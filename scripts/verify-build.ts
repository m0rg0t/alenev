import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import assert from 'node:assert/strict';
import { parse } from 'node-html-parser';
import expected from './fixtures/routes-v5.json';

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? walk(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}
const htmlFiles = (await walk('dist')).filter(path => path.endsWith('.html') && !path.includes('yandex_')).sort();
assert.deepEqual(htmlFiles.map(path => relative('dist', path)), expected, 'All 104 pre-upgrade public routes must remain unchanged');
let twins = 0;
for (const path of htmlFiles) {
  const page = parse(await readFile(path, 'utf8'));
  assert.ok(page.querySelector('main'), `${path}: main content`);
  assert.ok(page.querySelector('title')?.text.trim(), `${path}: title`);
  if (path.endsWith('/404.html')) continue;
  const md = await readFile(path.replace(/\.html$/, '.md'), 'utf8');
  const count = await readFile(path.replace(/\.html$/, '.md.tokens'), 'utf8');
  assert.ok(md.trim().length > 20, `${path}: Markdown twin`);
  assert.equal(Number(count), Math.ceil(md.length / 4), `${path}: Markdown token count`);
  twins++;
}
console.log(`Verified ${htmlFiles.length} unchanged routes and ${twins} Markdown twins`);
