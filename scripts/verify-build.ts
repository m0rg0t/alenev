import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import expected from './fixtures/routes-v5.json';
import evidence from '../src/data/pdf-evidence.json';
import fullPages from '../src/data/pdf-full-pages.json';
import { DIST_DIR, estimateTokens, walk } from './generate-markdown';

const htmlFiles = (await walk(DIST_DIR)).filter(path => !path.includes('yandex_')).sort();
assert.deepEqual(htmlFiles.map(path => relative(DIST_DIR, path)), expected, 'Expected site routes must be present');
let twins = 0;
for (const path of htmlFiles) {
  const page = parse(await readFile(path, 'utf8'));
  assert.ok(page.querySelector('main'), `${path}: main content`);
  assert.ok(page.querySelector('title')?.text.trim(), `${path}: title`);
  if (path.endsWith('/404.html')) continue;
  const md = await readFile(path.replace(/\.html$/, '.md'), 'utf8');
  const count = await readFile(path.replace(/\.html$/, '.md.tokens'), 'utf8');
  assert.ok(md.trim().length > 20, `${path}: Markdown twin`);
  assert.equal(Number(count), estimateTokens(md), `${path}: Markdown token count`);
  twins++;
}

const archives = [...fullPages, ...evidence];
const publicLinks = new Set(archives.map(item => item.pdf));
assert.equal(publicLinks.size, archives.length, 'Each PDF link should be listed once');
for (const route of ['pdf-evidence', 'en/pdf-evidence']) {
  const page = parse(await readFile(`${DIST_DIR}/${route}/index.html`, 'utf8'));
  const links = page.querySelectorAll('main a[type="application/pdf"]');
  assert.equal(links.length, archives.length, `${route}: PDF link count`);
  assert.deepEqual(new Set(links.map(link => link.getAttribute('href'))), publicLinks, `${route}: PDF links`);
}

const checkedPdfs = new Set<string>();
for (const { pdf, archiveId } of archives) {
  assert.match(pdf, /^\/archives\/pdf-evidence\/(?:full\/[a-z\d-]+\.pdf|[a-z\d-]+\.pdf#page=[1-9]\d*)$/);
  const file = pdf.split('#')[0];
  if (!checkedPdfs.has(file)) {
    const contents = await readFile(`${DIST_DIR}${file}`);
    assert.equal(contents.subarray(0, 5).toString(), '%PDF-', `${file}: PDF signature`);
    checkedPdfs.add(file);
  }
  if (archiveId) {
    const page = parse(await readFile(`${DIST_DIR}/archive/${archiveId}/index.html`, 'utf8'));
    assert.ok(page.querySelector(`a[href="${pdf}"]`), `${archiveId}: archive PDF link`);
  }
}

console.log(`Verified ${htmlFiles.length} routes, ${twins} Markdown twins and ${archives.length} PDF links`);
