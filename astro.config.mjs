// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://alenev.ru',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'ru',
        locales: {
          ru: 'ru',
          en: 'en',
        },
      },
      // Append x-default hreflang pointing to the RU (default) URL for each
      // entry that has localized alternates. Google accepts x-default in either
      // HTML head or sitemap; we emit it in both for belt-and-suspenders.
      serialize(item) {
        if (!item.links || item.links.length === 0) return item;
        const ruLink = item.links.find((l) => l.lang === 'ru');
        if (ruLink && !item.links.some((l) => l.lang === 'x-default')) {
          item.links = [...item.links, { lang: 'x-default', url: ruLink.url }];
        }
        return item;
      },
    }),
  ]
});
