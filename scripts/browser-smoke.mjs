import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:8080';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Use a local verification server');
const output = 'output/maintenance-browser';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, chromiumSandbox: true, executablePath: process.env.E2E_CHROME ?? '/usr/bin/google-chrome' });
const errors = [];
const results = [];
try {
  for (const width of [320, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort('blockedbyclient'));
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(base, { waitUntil: 'networkidle' });
    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await page.getByRole('button', { name: 'Сменить тему' }).click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), theme);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      await page.screenshot({ path: `${output}/home-${width}-${theme}.png`, fullPage: true });
    }
    if (width === 320) {
      const toggle = page.getByRole('button', { name: 'Меню', exact: true });
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    }
    await page.locator('.lang-switcher a[hreflang="en"]').click();
    await page.waitForURL('**/en/');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    results.push(`${width}px: themes, layout, bilingual navigation and preference persistence`);
    await page.goto(`${base}/cosplay/dead-space/dead-space-2019/`, { waitUntil: 'networkidle' });
    const trigger = page.locator('[data-lightbox-trigger]').first();
    await trigger.click();
    await page.waitForSelector('#lightbox[data-active]');
    await page.waitForFunction(() => { const image = document.querySelector('.lightbox-image'); return image?.complete && image.naturalWidth > 0; });
    await page.locator('.lightbox-next').click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#lightbox').getAttribute('hidden'), '');
    assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
    await trigger.click();
    await page.locator('.lightbox-close').click();
    assert.equal(await page.locator('#lightbox').getAttribute('hidden'), '');
    await page.screenshot({ path: `${output}/gallery-${width}.png`, fullPage: true });
    results.push(`${width}px: full artwork, repeated viewer open/next/Escape/Close and focus return`);
    await context.close();
  }
  const restricted = await browser.newContext({ viewport: { width: 320, height: 900 }, colorScheme: 'light' });
  await restricted.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort('blockedbyclient'));
  await restricted.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage denied', 'SecurityError'); } }));
  const page = await restricted.newPage();
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
  await page.getByRole('button', { name: 'Сменить тему' }).click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.getByRole('button', { name: 'Меню', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Меню', exact: true }).getAttribute('aria-expanded'), 'true');
  await restricted.close();
  results.push('Denied storage: theme and mobile navigation stay usable');
  assert.deepEqual(errors, []);
  await writeFile(`${output}/report.json`, JSON.stringify({ results, errors }, null, 2));
  console.log(results.join('\n'));
} finally {
  await browser.close();
}
