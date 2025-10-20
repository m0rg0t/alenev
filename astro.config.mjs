// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://antonlenev.com',
  i18n: {
    defaultLocale: 'ru',
    locales: ['ru', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  integrations: [sitemap()]
});
