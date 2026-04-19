from playwright.sync_api import sync_playwright
import json

PAGES = {
    "ru": "https://alenev.ru",
    "en": "https://alenev.ru/en/",
}

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "mobile":  {"width": 375,  "height": 812},
}

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch()
    for vp_name, vp in VIEWPORTS.items():
        ctx = browser.new_context(viewport=vp)
        pg = ctx.new_page()
        for lang, url in PAGES.items():
            pg.goto(url, wait_until="networkidle", timeout=30000)
            pg.wait_for_timeout(1000)

            key = f"{lang}_{vp_name}"

            # Measure .about-images children
            metrics = pg.evaluate("""() => {
                const container = document.querySelector('.about-images');
                if (!container) return {error: 'no .about-images'};
                const imgs = Array.from(container.querySelectorAll('img'));
                return imgs.map(img => ({
                    src: img.src.split('/').pop(),
                    naturalW: img.naturalWidth,
                    naturalH: img.naturalHeight,
                    renderedW: img.getBoundingClientRect().width,
                    renderedH: img.getBoundingClientRect().height,
                    computedObjectFit: getComputedStyle(img).objectFit,
                    computedMaxWidth: getComputedStyle(img).maxWidth,
                }));
            }""")

            # Measure nav link tap targets
            nav_metrics = pg.evaluate("""() => {
                const links = Array.from(document.querySelectorAll('nav a, header a'));
                return links.map(a => {
                    const r = a.getBoundingClientRect();
                    return {text: a.textContent.trim().slice(0,20), w: Math.round(r.width), h: Math.round(r.height)};
                });
            }""")

            # Check lang switcher visibility
            lang_sw = pg.evaluate("""() => {
                const switchers = Array.from(document.querySelectorAll('a, button')).filter(el =>
                    /^(RU|EN|ru|en)$/.test(el.textContent.trim())
                );
                return switchers.map(el => {
                    const r = el.getBoundingClientRect();
                    return {text: el.textContent.trim(), visible: r.width > 0 && r.height > 0, w: Math.round(r.width), h: Math.round(r.height)};
                });
            }""")

            # H1 check
            h1 = pg.evaluate("""() => {
                const h1 = document.querySelector('h1');
                if (!h1) return null;
                const r = h1.getBoundingClientRect();
                const style = getComputedStyle(h1);
                return {
                    text: h1.textContent.trim().slice(0,40),
                    visible: r.width > 0 && r.top < window.innerHeight,
                    fontSize: style.fontSize,
                    color: style.color,
                };
            }""")

            results[key] = {
                "images": metrics,
                "nav_links": nav_metrics,
                "lang_switcher": lang_sw,
                "h1": h1,
            }

        ctx.close()
    browser.close()

print(json.dumps(results, indent=2, ensure_ascii=False))
