#!/usr/bin/env bun
/**
 * Archive Fetcher CLI
 *
 * Usage:
 *   bun run scripts/archive-fetcher/index.ts <url> [options]
 *
 * Options:
 *   --slug <name>     Custom slug for the archive (default: auto-generated)
 *   --category <cat>  Category: article, media, achievement (default: article)
 *   --dry-run         Show what would be created without writing files
 *   --download-video  Download videos via yt-dlp (if installed)
 *
 * Example:
 *   bun run scripts/archive-fetcher/index.ts https://habr.com/ru/articles/754234/ --slug habr-owleye
 */

import * as cheerio from "cheerio";
import TurndownService from "turndown";
import * as fs from "fs";
import * as path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "../..");

// Parse command line arguments
const args = process.argv.slice(2);
const url = args.find((arg) => arg.startsWith("http"));
const slugArg = args.indexOf("--slug");
const categoryArg = args.indexOf("--category");
const dryRun = args.includes("--dry-run");
const downloadVideo = args.includes("--download-video");

const customSlug = slugArg !== -1 ? args[slugArg + 1] : null;
const category =
  (categoryArg !== -1 ? args[categoryArg + 1] : "article") as
    | "article"
    | "media"
    | "achievement";

if (!url) {
  console.log(`
Archive Fetcher - Download and archive web publications

Usage:
  bun run scripts/archive-fetcher/index.ts <url> [options]

Options:
  --slug <name>     Custom slug for the archive (default: auto-generated from URL)
  --category <cat>  Category: article, media, achievement (default: article)
  --dry-run         Show what would be created without writing files
  --download-video  Download videos via yt-dlp (if installed)

Example:
  bun run scripts/archive-fetcher/index.ts https://habr.com/ru/articles/754234/ --slug habr-owleye --category article
  `);
  process.exit(1);
}

// Generate slug from URL
function generateSlug(url: string, title?: string): string {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.replace("www.", "");

  // Extract source name
  let source = hostname.split(".")[0];
  if (source === "habr") source = "habr";
  else if (hostname.includes("instructables")) source = "instructables";
  else if (hostname.includes("m24")) source = "m24";

  // Extract meaningful part from path
  const pathParts = urlObj.pathname
    .split("/")
    .filter((p) => p && !p.match(/^\d+$/));
  const meaningfulPart = pathParts[pathParts.length - 1] || "";

  // Clean and truncate
  const cleanPart = meaningfulPart
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30);

  return `${source}-${cleanPart || "archive"}`;
}

// Determine source name from URL
function getSourceName(url: string): string {
  const hostname = new URL(url).hostname.toLowerCase();

  const sourceMap: Record<string, string> = {
    "habr.com": "Habr",
    "instructables.com": "Instructables",
    "m24.ru": "М24",
    "gazeta-rybinsk.ru": "Газета Рыбинск",
    "yarreg.ru": "Ярославская Регион",
    "cheremuha.com": "Черемуха",
    "apptractor.ru": "AppTractor",
    "rybinsknote.ru": "RybinskNote",
    "minfin.gov.ru": "Минфин РФ",
    "facebook.com": "Facebook",
  };

  for (const [domain, name] of Object.entries(sourceMap)) {
    if (hostname.includes(domain)) return name;
  }

  return hostname;
}

function normalizeCharset(charset?: string | null): string | undefined {
  if (!charset) return undefined;
  const cleaned = charset.toLowerCase().trim().replace(/["']/g, "");
  if (cleaned === "utf8") return "utf-8";
  if (cleaned === "utf-8") return "utf-8";
  if (["windows-1251", "win-1251", "cp1251"].includes(cleaned)) {
    return "windows-1251";
  }
  if (["windows-1252", "win-1252", "cp1252"].includes(cleaned)) {
    return "windows-1252";
  }
  return cleaned;
}

function extractCharsetFromContentType(contentType?: string | null): string | undefined {
  if (!contentType) return undefined;
  const match = contentType.match(/charset=([^;]+)/i);
  return match ? match[1].trim() : undefined;
}

async function readResponseText(response: Response): Promise<string> {
  const buffer = Buffer.from(await response.arrayBuffer());
  let charset = normalizeCharset(
    extractCharsetFromContentType(response.headers.get("content-type"))
  );

  if (!charset) {
    const sniff = buffer.toString("latin1");
    const metaMatch =
      sniff.match(/<meta[^>]*charset=["']?([^"'>\s]+)/i) ||
      sniff.match(/<meta[^>]*content=["'][^"']*charset=([^"'>\s]+)/i);
    charset = normalizeCharset(metaMatch?.[1]);
  }

  if (!charset) {
    return buffer.toString("utf8");
  }

  try {
    return new TextDecoder(charset).decode(buffer);
  } catch {
    return buffer.toString("utf8");
  }
}

function cleanMarkdown(content: string): string {
  const junkPatterns: RegExp[] = [
    /^\u041E\u0431\u043D\u043E\u0432\u0438\u0442\u044C$/,
    /^\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043E /,
    /\u2014 \u0440\u0435\u043A\u043B\u0430\u043C\u0430 \u043D\u0430 \u0441\u0430\u0439\u0442\u0435/,
    /\u0415\u0449\u0451 \u0431\u043E\u043B\u044C\u0448\u0435 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u043D\u044B\u0445 \u0432\u0438\u0434\u0435\u043E/,
    /\u0412\u0440\u0435\u043C\u044F \u043D\u0430 \u043F\u0440\u043E\u0447\u0442\u0435\u043D\u0438\u0435/,
    /\u041E\u0445\u0432\u0430\u0442 \u0438 \u0447\u0438\u0442\u0430\u0442\u0435\u043B\u0438/,
    /\u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0439.*\u043F\u043E\u043A\u0430\u0437\u043E\u0432/,
    /^\*   \[\u041D\u0430\u0448\u0438\]/,
    /^\*   \d{2}:\d{2}$/,
    /^\*   \d+ [\u0430-\u044F\u0410-\u042F\u0401\u0451]+ \d+$/,
    /\u0412\u0441\u0451 \u043E \u043A\u0438\u043D\u043E \u0438 \u0430\u043D\u0438\u043C\u0435/,
    /!\[\u0410\u0432\u0430\u0442\u0430\u0440\u043A\u0430 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F/,
    /!\[\u041B\u043E\u0433\u043E\u0442\u0438\u043F \u043A\u043E\u043C\u043F\u0430\u043D\u0438\u0438/,
    /habrastorage.org.*avatars/,
    /\/ru\/users\//,
    /\/author\//,
    /\/company\//,
    /\/authors\//,
    /\/ru\/hubs\//,
    /youtube.com\/channel/,
    /^\u0434\u043B\u044F$/,
    /^\d+$/,
    /^\[$/,
    /^\]$/,
    /^\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F$/,
    /^\u041E\u0442\u043B\u043E\u0436\u0438\u0442\u044C$/,
    /^\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438\b/,
    /^\u0411\u043E\u043B\u044C\u0448\u0435 \u043F\u043E \u0442\u0435\u043C\u0435/,
    /\u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0438\u043B\u0438 \u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0439\u0442\u0435\u0441\u044C/,
    /\u0420\u0430\u0437\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0440\u0435\u043A\u043B\u0430\u043C\u0443/,
    /^More by the author:$/,
    /^Fusion Projects/,
    /assets\/img\/pixel\.png/,
    /^\]\(\/?/,
    /\u043C\u0435\u0434\u0438\u0430\u043A\u0438\u0442.*\u043A\u043E\u043D\u0442\u0430\u043A\u0442\u044B/,
  ];

  const cleaned = content
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      return !junkPatterns.some((pattern) => pattern.test(trimmed));
    })
    .join("\n");

  return cleaned.replace(/\n{3,}/g, "\n\n");
}

// Fetch and parse page content
async function fetchPage(url: string): Promise<{
  title: string;
  description: string;
  content: string;
  images: string[];
  publishDate?: Date;
}> {
  console.log(`Fetching: ${url}`);

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const html = await readResponseText(response);
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $(
    "script, style, nav, footer, header, .sidebar, .comments, .advertisement, .related, .share"
  ).remove();

  // Extract title
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().trim();

  // Extract description
  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  // Extract main content based on source
  let contentSelector = "article, .article, .post, .content, main, .entry-content";
  const hostname = new URL(url).hostname;

  if (hostname.includes("habr.com")) {
    contentSelector = ".tm-article-body";
  } else if (hostname.includes("instructables.com")) {
    contentSelector = ".step";
  }

  // Get content HTML
  let contentHtml = "";
  $(contentSelector).each((_, el) => {
    contentHtml += $.html(el);
  });

  if (!contentHtml) {
    // Fallback: get body content
    contentHtml = $("body").html() || "";
  }

  // Extract images
  const images: string[] = [];
  const baseUrl = new URL(url).origin;

  $("img").each((_, el) => {
    let src = $(el).attr("src") || $(el).attr("data-src");
    if (src) {
      // Make absolute URL
      if (src.startsWith("//")) {
        src = "https:" + src;
      } else if (src.startsWith("/")) {
        src = baseUrl + src;
      } else if (!src.startsWith("http")) {
        src = new URL(src, url).href;
      }

      // Skip tiny images and icons
      if (
        !src.includes("icon") &&
        !src.includes("logo") &&
        !src.includes("avatar")
      ) {
        images.push(src);
      }
    }
  });

  // Extract publish date
  let publishDate: Date | undefined;
  const dateStr =
    $('meta[property="article:published_time"]').attr("content") ||
    $('time[datetime]').attr("datetime") ||
    $(".date, .published, .post-date").first().text();

  if (dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      publishDate = parsed;
    }
  }

  // Convert to Markdown
  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
  });

  // Keep images with their src
  turndown.addRule("images", {
    filter: "img",
    replacement: (_, node) => {
      const src = (node as Element).getAttribute("src");
      const alt = (node as Element).getAttribute("alt") || "";
      return src ? `![${alt}](${src})` : "";
    },
  });

  const content = cleanMarkdown(turndown.turndown(contentHtml));

  return {
    title,
    description,
    content,
    images: [...new Set(images)], // Remove duplicates
    publishDate,
  };
}

// Download image and save locally
async function downloadImage(
  imageUrl: string,
  outputDir: string,
  index: number
): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const contentType = response.headers.get("content-type") || "";
    let ext = ".jpg";
    if (contentType.includes("png")) ext = ".png";
    else if (contentType.includes("gif")) ext = ".gif";
    else if (contentType.includes("webp")) ext = ".webp";

    const filename = index === 0 ? `cover${ext}` : `image-${index}${ext}`;
    const outputPath = path.join(outputDir, filename);

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);

    console.log(`  Downloaded: ${filename}`);
    return `/archives/${path.basename(outputDir)}/${filename}`;
  } catch (error) {
    console.log(`  Failed to download: ${imageUrl}`);
    return null;
  }
}

// Create archive files
async function createArchive(
  url: string,
  slug: string,
  category: "article" | "media" | "achievement"
) {
  const pageData = await fetchPage(url);
  const sourceName = getSourceName(url);
  const archiveDate = new Date().toISOString().split("T")[0];

  console.log(`\nCreating archive: ${slug}`);
  console.log(`  Title: ${pageData.title}`);
  console.log(`  Source: ${sourceName}`);
  console.log(`  Images found: ${pageData.images.length}`);

  if (dryRun) {
    console.log("\n[DRY RUN] Would create:");
    console.log(`  - src/content/archives/${slug}.md`);
    console.log(`  - public/archives/${slug}/`);
    if (downloadVideo) {
      console.log(`  - (video) public/archives/${slug}/`);
    }
    return;
  }

  // Create directories
  const contentDir = path.join(PROJECT_ROOT, "src/content/archives");
  const publicDir = path.join(PROJECT_ROOT, "public/archives", slug);

  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (downloadVideo) {
    const outputTemplate = path.join(publicDir, "%(title)s.%(ext)s");
    const result = spawnSync("yt-dlp", ["-o", outputTemplate, url], {
      stdio: "inherit",
    });
    if (result.error || result.status !== 0) {
      console.log("  Video download skipped (yt-dlp not available or failed).");
    }
  }

  // Download images
  const downloadedImages: string[] = [];
  let coverImage = "";

  for (let i = 0; i < Math.min(pageData.images.length, 20); i++) {
    const localPath = await downloadImage(pageData.images[i], publicDir, i);
    if (localPath) {
      if (i === 0) {
        coverImage = localPath;
      } else {
        downloadedImages.push(localPath);
      }
    }
  }

  // Generate frontmatter
  const frontmatter: Record<string, unknown> = {
    title: pageData.title,
    originalUrl: url,
    sourceName,
    category,
    archiveDate,
  };

  if (pageData.publishDate) {
    frontmatter.publishDate = pageData.publishDate.toISOString().split("T")[0];
  }

  if (pageData.description) {
    frontmatter.description = pageData.description;
  }

  if (coverImage) {
    frontmatter.coverImage = coverImage;
  }

  if (downloadedImages.length > 0) {
    frontmatter.images = downloadedImages;
  }

  // Create Markdown file
  const yamlContent = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((v) => `  - "${v}"`).join("\n")}`;
      }
      // Dates should not be quoted (archiveDate, publishDate)
      if (key.endsWith("Date")) {
        return `${key}: ${value}`;
      }
      if (typeof value === "string" && value.includes('"')) {
        return `${key}: '${value}'`;
      }
      return `${key}: "${value}"`;
    })
    .join("\n");

  const mdContent = `---
${yamlContent}
---

# ${pageData.title}

*Это архивная копия статьи. [Оригинал на ${sourceName}](${url})*

---

${pageData.content}
`;

  const mdPath = path.join(contentDir, `${slug}.md`);
  fs.writeFileSync(mdPath, mdContent);

  console.log(`\nArchive created successfully!`);
  console.log(`  Content: src/content/archives/${slug}.md`);
  console.log(`  Media: public/archives/${slug}/`);
  console.log(`  URL: /archive/${slug}`);
}

// Main
const slug = customSlug || generateSlug(url);
createArchive(url, slug, category).catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
