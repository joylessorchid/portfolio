// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://v2horizon.com',
  trailingSlash: 'always',

  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru-RU', en: 'en-US' } },
      // служебные страницы для генерации OG-картинок в индекс не нужны
      filter: (page) => !page.includes('/og/'),
    }),
  ],

  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Prata',
      cssVariable: '--font-display',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Manrope',
      cssVariable: '--font-sans',
      weights: ['200 800'],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: ['100 800'],
      styles: ['normal'],
      subsets: ['latin', 'cyrillic'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],

  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
