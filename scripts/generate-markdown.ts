#!/usr/bin/env bun
/**
 * Markdown for Agents — post-build step.
 *
 * Walks `dist/` and writes a sibling `.md` twin for every built HTML page.
 * Nginx serves the `.md` variant when the client sends `Accept: text/markdown`
 * (see nginx.conf — content negotiation via a `map` on $http_accept).
 *
 * The `.md` file contains the page's <main> content converted to Markdown,
 * prefixed with a short frontmatter-free header (title + canonical URL).
 *
 * Spec: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse, type HTMLElement, type Node, NodeType } from 'node-html-parser';

const DIST_DIR = join(import.meta.dir, '..', 'dist');
const SITE_ORIGIN = 'https://alenev.ru';

// Skip pages that have no agent-readable content.
const SKIP_FILES = new Set([
  '404.html',
  // Yandex site-verification file — single meta tag, nothing useful as md.
  'yandex_9402ac7900e76ecd.html',
]);

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function inlineText(node: Node): string {
  if (node.nodeType === NodeType.TEXT_NODE) {
    return node.rawText.replace(/\s+/g, ' ');
  }
  if (node.nodeType !== NodeType.ELEMENT_NODE) return '';
  const el = node as HTMLElement;
  const tag = el.tagName?.toLowerCase();
  const inner = el.childNodes.map(inlineText).join('');
  switch (tag) {
    case 'br':
      return '\n';
    case 'strong':
    case 'b':
      return `**${inner.trim()}**`;
    case 'em':
    case 'i':
      return `*${inner.trim()}*`;
    case 'code':
      return `\`${inner}\``;
    case 'a': {
      const href = el.getAttribute('href') ?? '';
      const text = inner.trim() || href;
      if (!href) return text;
      return `[${text}](${href})`;
    }
    case 'img': {
      const alt = el.getAttribute('alt') ?? '';
      const src = el.getAttribute('src') ?? '';
      if (!src) return '';
      return `![${alt}](${src})`;
    }
    case 'picture':
    case 'source':
      // <picture>: collapse to the nested <img> alt/src handled above.
      return inner;
    default:
      return inner;
  }
}

function blockify(node: Node, depth = 0): string {
  if (node.nodeType === NodeType.TEXT_NODE) {
    const t = node.rawText.trim();
    return t ? t : '';
  }
  if (node.nodeType !== NodeType.ELEMENT_NODE) return '';
  const el = node as HTMLElement;
  const tag = el.tagName?.toLowerCase();

  // Skip non-content scaffolding.
  if (
    tag === 'script' ||
    tag === 'style' ||
    tag === 'noscript' ||
    tag === 'template' ||
    tag === 'iframe'
  ) {
    return '';
  }

  switch (tag) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6': {
      const level = Number(tag[1]);
      return `${'#'.repeat(level)} ${inlineText(el).trim()}\n\n`;
    }
    case 'p': {
      const text = inlineText(el).trim();
      return text ? `${text}\n\n` : '';
    }
    case 'hr':
      return `---\n\n`;
    case 'blockquote': {
      const inner = el.childNodes.map((n) => blockify(n, depth)).join('').trim();
      return inner
        .split('\n')
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n') + '\n\n';
    }
    case 'pre': {
      const code = el.querySelector('code');
      const body = (code ? code.text : el.text).replace(/\n$/, '');
      return `\`\`\`\n${body}\n\`\`\`\n\n`;
    }
    case 'ul':
    case 'ol': {
      const ordered = tag === 'ol';
      const items = el.childNodes.filter(
        (n) => n.nodeType === NodeType.ELEMENT_NODE && (n as HTMLElement).tagName?.toLowerCase() === 'li'
      );
      const lines = items.map((li, i) => {
        const bullet = ordered ? `${i + 1}.` : '-';
        // A <li> may contain inline or block content. Prefer inline rendering;
        // fall back to blockify for nested lists.
        const nested = (li as HTMLElement).querySelector('ul, ol');
        if (nested) {
          const lead = inlineText(li as HTMLElement)
            .replace(/\s+/g, ' ')
            .trim();
          const sub = blockify(nested, depth + 1).trim();
          const indented = sub
            .split('\n')
            .map((l) => (l ? `  ${l}` : l))
            .join('\n');
          return `${bullet} ${lead}\n${indented}`;
        }
        return `${bullet} ${inlineText(li as HTMLElement).replace(/\s+/g, ' ').trim()}`;
      });
      return lines.join('\n') + '\n\n';
    }
    case 'figure':
    case 'article':
    case 'section':
    case 'div':
    case 'header':
    case 'footer':
    case 'main':
    case 'aside':
      return el.childNodes.map((n) => blockify(n, depth)).join('');
    case 'a':
    case 'img':
    case 'strong':
    case 'em':
    case 'code':
    case 'span':
    case 'b':
    case 'i': {
      const text = inlineText(el).trim();
      return text ? `${text}\n\n` : '';
    }
    default:
      return el.childNodes.map((n) => blockify(n, depth)).join('');
  }
}

function htmlToMarkdown(html: string, htmlPath: string): { md: string; tokens: number } {
  const root = parse(html, { comment: false });

  const title = root.querySelector('title')?.text?.trim() ?? '';
  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
  const description = root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

  // Extract the content region. `<main>` is used consistently in BaseLayout.astro.
  const main = root.querySelector('main') ?? root.querySelector('body') ?? root;

  // Drop nodes that are pure navigation/chrome even if they ended up inside <main>.
  main.querySelectorAll('nav, header, footer, script, style, noscript, template').forEach((n) => n.remove());

  let body = blockify(main).trim();
  // Collapse runs of blank lines.
  body = body.replace(/\n{3,}/g, '\n\n');

  const header: string[] = [];
  if (title) header.push(`# ${title}`);
  if (description) header.push(`> ${description}`);
  if (canonical) header.push(`Source: ${canonical}`);

  const md = [...(header.length ? [header.join('\n\n')] : []), body].filter(Boolean).join('\n\n') + '\n';

  // Rough token count — 4 chars per token is the standard heuristic used by
  // Cloudflare's x-markdown-tokens header.
  const tokens = Math.ceil(md.length / 4);
  return { md, tokens };
}

async function main() {
  const distExists = await stat(DIST_DIR).catch(() => null);
  if (!distExists) {
    console.error(`[markdown] dist/ not found at ${DIST_DIR} — run \`astro build\` first`);
    process.exit(1);
  }

  const htmlFiles = await walk(DIST_DIR);
  let written = 0;
  for (const file of htmlFiles) {
    const rel = relative(DIST_DIR, file);
    if (SKIP_FILES.has(rel) || SKIP_FILES.has(rel.split('/').pop()!)) continue;

    const html = await readFile(file, 'utf8');
    const { md, tokens } = htmlToMarkdown(html, file);
    const mdPath = file.replace(/\.html$/, '.md');
    await writeFile(mdPath, md, 'utf8');
    // Sibling file holding the token count — nginx can expose it as x-markdown-tokens.
    await writeFile(`${mdPath}.tokens`, String(tokens), 'utf8');
    written++;
  }
  console.log(`[markdown] wrote ${written} .md files under ${relative(process.cwd(), DIST_DIR)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
