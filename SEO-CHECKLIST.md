# SEO Deployment Checklist — alenev.ru

## Sitemap Submission

The sitemap is auto-generated at `https://alenev.ru/sitemap-index.xml` by `@astrojs/sitemap`.

**Google Search Console:**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (`alenev.ru`)
3. Navigate to **Indexing > Sitemaps**
4. Enter `sitemap-index.xml` and click **Submit**

**Yandex Webmaster Tools:**
1. Go to [Yandex Webmaster](https://webmaster.yandex.ru)
2. Select your site
3. Navigate to **Indexing > Sitemap files**
4. Enter the full URL `https://alenev.ru/sitemap-index.xml` and submit

`robots.txt` already references the sitemap URL, so crawlers can autodiscover it — no extra action needed for that.

---

## HTTPS & HSTS

HSTS is configured in `nginx.conf`:

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

- `max-age=31536000` = 1 year
- `includeSubDomains` applies HSTS to all subdomains as well

**Important:** HSTS only takes effect when the response is served over HTTPS. If you are using Cloudflare or another reverse proxy for SSL termination, also enable HSTS in the proxy's dashboard (e.g., Cloudflare SSL/TLS > Edge Certificates > HTTP Strict Transport Security).

**Required redirects — all four URL variants must 301-redirect to `https://alenev.ru/`:**
- `http://alenev.ru` → `https://alenev.ru/`
- `http://www.alenev.ru` → `https://alenev.ru/`
- `https://www.alenev.ru` → `https://alenev.ru/`

Once HTTPS is confirmed fully working and all redirects are in place, the domain can be submitted to the HSTS preload list: https://hstspreload.org

---

## Google Search Console Setup

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Click **Add property** and choose **Domain** property type for `alenev.ru`
3. Verify domain ownership by adding the provided DNS TXT record at your DNS registrar
4. Once verified, submit the sitemap (see Sitemap Submission section above)
5. Monitor **Experience > Core Web Vitals** for performance signals used in ranking
6. Monitor **Indexing > Pages** (formerly Coverage) to catch indexing errors or excluded pages

---

## Yandex Webmaster Tools

Yandex Webmaster is particularly important for the Russian-speaking audience.

1. Register or log in at https://webmaster.yandex.ru
2. Click **Add site** and enter `https://alenev.ru`
3. Verify site ownership via DNS TXT record or HTML file upload
4. Submit the sitemap at **Indexing > Sitemap files**
5. Enable **IndexNow** for faster re-indexing when content changes:
   - Yandex supports IndexNow at https://yandex.com/indexnow
   - With `@astrojs/sitemap` already configured, consider adding an IndexNow integration or pinging the endpoint after deployments

---

## Remaining SEO Improvements

- [ ] Add HTTP → HTTPS redirect server block to `nginx.conf` (currently only one `server {}` block on port 80 exists; a second block for the redirect is needed if SSL termination happens at nginx rather than a proxy)
- [ ] Verify all three redirect variants (`http://alenev.ru`, `http://www.alenev.ru`, `https://www.alenev.ru`) resolve to `https://alenev.ru/` with 301 status
- [ ] Submit to HSTS preload list at https://hstspreload.org once redirects and HTTPS are confirmed
- [ ] Set up IndexNow for instant Yandex and Bing re-indexing on content changes
- [ ] Add `og:image` meta tags to key pages for social sharing previews
- [ ] Ensure all pages have unique, descriptive `<title>` and `<meta name="description">` tags
- [ ] Check Core Web Vitals (LCP, CLS, INP) using PageSpeed Insights after deployment
