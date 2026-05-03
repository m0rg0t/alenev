#!/usr/bin/env bun
/**
 * Cosplay Image Optimization Script
 *
 * Scans public/cosplay/ folders and for each image:
 * - Resizes to 2K max (2560px longest side) → WebP (quality 80)
 * - Generates 400px wide thumbnail → WebP (quality 75)
 * - Writes manifest.json per folder
 *
 * Idempotent: skips images that already have newer outputs.
 */

import sharp from 'sharp';
import { readdir, stat, writeFile, readFile, mkdir } from 'node:fs/promises';
import { join, basename, extname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const PROJECT_ROOT = resolve(import.meta.dir, '..');
// Allow overriding cosplay dir via CLI argument (useful for worktrees)
const COSPLAY_DIR = process.argv[2]
  ? resolve(process.argv[2])
  : join(PROJECT_ROOT, 'public', 'cosplay');

const MAX_DIMENSION = 2560;
const THUMB_WIDTH = 400;
const WEBP_QUALITY = 80;
const THUMB_QUALITY = 75;

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const SKIP_FILES = new Set(['.DS_Store', 'manifest.json', 'Thumbs.db']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.avi', '.webm']);

// Transliteration map for Cyrillic → Latin
const CYRILLIC_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Shch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya',
};

function transliterate(str: string): string {
  return str.split('').map(ch => CYRILLIC_MAP[ch] ?? ch).join('');
}

function sanitizeFilename(name: string): string {
  let safe = transliterate(name);
  // Replace spaces and special chars with underscores
  safe = safe.replace(/[^a-zA-Z0-9._-]/g, '_');
  // Collapse multiple underscores
  safe = safe.replace(/_+/g, '_');
  return safe;
}

interface ImageEntry {
  original: string;
  webp: string;
  thumb: string;
  width: number;
  height: number;
}

interface Manifest {
  images: ImageEntry[];
  video: string | null;
}

async function isImageFile(filePath: string, fileName: string): Promise<boolean> {
  const ext = extname(fileName).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) return true;

  // Check files without extension — try to detect if they're images
  if (ext === '') {
    try {
      const metadata = await sharp(filePath).metadata();
      return metadata.format !== undefined;
    } catch {
      return false;
    }
  }
  return false;
}

async function processImage(
  inputPath: string,
  outputDir: string,
  outputBasename: string,
): Promise<{ webp: string; thumb: string; width: number; height: number } | null> {
  const webpName = `${outputBasename}.webp`;
  const thumbName = `${outputBasename}.thumb.webp`;
  const webpPath = join(outputDir, webpName);
  const thumbPath = join(outputDir, thumbName);

  // Check if outputs exist and are newer than source
  const srcStat = await stat(inputPath);
  const webpExists = existsSync(webpPath);
  const thumbExists = existsSync(thumbPath);

  if (webpExists && thumbExists) {
    const webpStat = await stat(webpPath);
    const thumbStat = await stat(thumbPath);
    if (webpStat.mtimeMs > srcStat.mtimeMs && thumbStat.mtimeMs > srcStat.mtimeMs) {
      // Already processed, read dimensions from existing WebP
      const meta = await sharp(webpPath).metadata();
      return { webp: webpName, thumb: thumbName, width: meta.width!, height: meta.height! };
    }
  }

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      console.warn(`  ⚠ Skipping ${inputPath}: cannot read dimensions`);
      return null;
    }

    // Calculate 2K resize dimensions
    const longestSide = Math.max(metadata.width, metadata.height);
    const needsResize = longestSide > MAX_DIMENSION;

    // Generate 2K WebP
    let pipeline = sharp(inputPath);
    if (needsResize) {
      pipeline = pipeline.resize({
        width: metadata.width >= metadata.height ? MAX_DIMENSION : undefined,
        height: metadata.height > metadata.width ? MAX_DIMENSION : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }
    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(webpPath);

    // Read final dimensions
    const finalMeta = await sharp(webpPath).metadata();

    // Generate thumbnail
    await sharp(inputPath)
      .resize({ width: THUMB_WIDTH, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: THUMB_QUALITY })
      .toFile(thumbPath);

    return {
      webp: webpName,
      thumb: thumbName,
      width: finalMeta.width!,
      height: finalMeta.height!,
    };
  } catch (err) {
    console.error(`  ✗ Error processing ${inputPath}:`, err);
    return null;
  }
}

async function processFolder(folderPath: string, folderName: string): Promise<void> {
  console.log(`\n📁 Processing: ${folderName}`);

  const entries = await readdir(folderPath, { withFileTypes: true });
  const manifest: Manifest = { images: [], video: null };
  const manifestPath = join(folderPath, 'manifest.json');

  // Load previous manifest so we can preserve `original` filenames (and recover
  // webp-only folders where original JPGs are no longer present on disk — e.g.
  // when only optimized webp files are committed to git).
  let previousManifest: Manifest = { images: [], video: null };
  if (existsSync(manifestPath)) {
    try {
      previousManifest = JSON.parse(await readFile(manifestPath, 'utf-8')) as Manifest;
    } catch {}
  }
  const previousByWebp = new Map(previousManifest.images.map(e => [e.webp, e]));

  // Track filenames present in the folder for fast lookup during recovery pass.
  const fileNames = new Set(entries.filter(e => e.isFile()).map(e => e.name));

  let processedCount = 0;
  let skippedCount = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (SKIP_FILES.has(entry.name)) continue;

    const filePath = join(folderPath, entry.name);
    const ext = extname(entry.name).toLowerCase();

    // Check for video
    if (VIDEO_EXTENSIONS.has(ext)) {
      manifest.video = entry.name;
      console.log(`  🎥 Video found: ${entry.name}`);
      continue;
    }

    // Skip already-generated WebP files
    if (ext === '.webp') continue;

    // Check if it's an image
    if (!(await isImageFile(filePath, entry.name))) {
      console.log(`  ⏭ Skipping non-image: ${entry.name}`);
      continue;
    }

    const nameWithoutExt = basename(entry.name, extname(entry.name)) || entry.name;
    const safeName = sanitizeFilename(nameWithoutExt);

    const result = await processImage(filePath, folderPath, safeName);
    if (result) {
      manifest.images.push({
        original: entry.name,
        webp: result.webp,
        thumb: result.thumb,
        width: result.width,
        height: result.height,
      });
      processedCount++;
    } else {
      skippedCount++;
    }
  }

  // Recovery pass: include webp files that have no current JPG/PNG original
  // but do have a sibling .thumb.webp — these are valid optimized assets that
  // must stay in the manifest even when originals aren't on disk.
  const coveredWebp = new Set(manifest.images.map(e => e.webp));
  let recoveredCount = 0;

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const name = entry.name;
    if (!name.endsWith('.webp') || name.endsWith('.thumb.webp')) continue;
    if (coveredWebp.has(name)) continue;
    const thumbName = `${basename(name, '.webp')}.thumb.webp`;
    if (!fileNames.has(thumbName)) continue;

    try {
      const meta = await sharp(join(folderPath, name)).metadata();
      if (!meta.width || !meta.height) continue;
      const previous = previousByWebp.get(name);
      manifest.images.push({
        original: previous?.original ?? name,
        webp: name,
        thumb: thumbName,
        width: meta.width,
        height: meta.height,
      });
      recoveredCount++;
    } catch (err) {
      console.warn(`  ⚠ Could not read metadata for orphan webp ${name}:`, err);
    }
  }

  // Sort images by filename for consistent order
  manifest.images.sort((a, b) => a.original.localeCompare(b.original));

  // Write manifest
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`  ✓ ${processedCount} images processed, ${skippedCount} skipped${recoveredCount > 0 ? `, ${recoveredCount} recovered from existing webp` : ''}`);
  console.log(`  ✓ manifest.json written`);
}

async function main() {
  console.log('🖼  Cosplay Image Optimizer');
  console.log(`   Source: ${COSPLAY_DIR}`);
  console.log(`   Max dimension: ${MAX_DIMENSION}px`);
  console.log(`   Thumbnail width: ${THUMB_WIDTH}px\n`);

  if (!existsSync(COSPLAY_DIR)) {
    console.error(`✗ Directory not found: ${COSPLAY_DIR}`);
    process.exit(1);
  }

  const folders = await readdir(COSPLAY_DIR, { withFileTypes: true });
  const shootFolders = folders
    .filter(f => f.isDirectory() && !f.name.startsWith('.'))
    .map(f => f.name);

  console.log(`Found ${shootFolders.length} photo shoot folders`);

  let totalImages = 0;
  const startTime = Date.now();

  for (const folder of shootFolders) {
    const folderPath = join(COSPLAY_DIR, folder);
    await processFolder(folderPath, folder);

    // Count from manifest
    try {
      const manifest = JSON.parse(
        await readFile(join(folderPath, 'manifest.json'), 'utf-8'),
      ) as Manifest;
      totalImages += manifest.images.length;
    } catch {}
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n✅ Done! ${totalImages} images across ${shootFolders.length} folders in ${elapsed}s`);

  // Calculate total size of WebP files
  let totalWebpSize = 0;
  let totalThumbSize = 0;
  for (const folder of shootFolders) {
    const folderPath = join(COSPLAY_DIR, folder);
    const files = await readdir(folderPath);
    for (const file of files) {
      if (file.endsWith('.thumb.webp')) {
        totalThumbSize += (await stat(join(folderPath, file))).size;
      } else if (file.endsWith('.webp')) {
        totalWebpSize += (await stat(join(folderPath, file))).size;
      }
    }
  }
  console.log(`   WebP total: ${(totalWebpSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`   Thumbnails total: ${(totalThumbSize / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
