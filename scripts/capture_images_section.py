from playwright.sync_api import sync_playwright
import os

OUTPUT_DIR = "/Users/antonlenev/Github/alenev/screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def capture_section(page, url, output_path, selector, viewport):
    page.goto(url, wait_until="networkidle", timeout=30000)
    # Wait for images to load
    page.wait_for_timeout(1000)

    el = page.query_selector(selector)
    if el:
        el.scroll_into_view_if_needed()
        page.wait_for_timeout(500)
        el.screenshot(path=output_path)
        print(f"Saved element screenshot: {output_path}")
    else:
        # Fall back to full page scroll-to area
        page.screenshot(path=output_path, full_page=True)
        print(f"Selector not found, saved full page: {output_path}")

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "mobile":  {"width": 375,  "height": 812},
}

PAGES = {
    "ru": "https://alenev.ru",
    "en": "https://alenev.ru/en/",
}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for vp_name, vp in VIEWPORTS.items():
        ctx = browser.new_context(viewport=vp)
        pg = ctx.new_page()
        for lang, url in PAGES.items():
            fname = f"{lang}_{vp_name}_images.png"
            capture_section(pg, url, os.path.join(OUTPUT_DIR, fname), ".about-images", vp)
        ctx.close()
    browser.close()

print("All image-section screenshots captured.")
