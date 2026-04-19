from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = "/Users/antonlenev/Github/alenev/screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "mobile":  {"width": 375,  "height": 812},
}

PAGES = {
    "ru": "https://alenev.ru",
    "en": "https://alenev.ru/en/",
}

def capture(page, url, output_path):
    page.goto(url, wait_until="networkidle", timeout=30000)
    # Capture above-the-fold only (no full_page)
    page.screenshot(path=output_path, full_page=False)
    print(f"Saved: {output_path}")

with sync_playwright() as p:
    browser = p.chromium.launch()
    for vp_name, vp in VIEWPORTS.items():
        ctx = browser.new_context(viewport=vp)
        pg = ctx.new_page()
        for lang, url in PAGES.items():
            fname = f"{lang}_{vp_name}.png"
            capture(pg, url, os.path.join(OUTPUT_DIR, fname))
        ctx.close()
    browser.close()

print("All screenshots captured.")
