import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
    site: 'https://thomasbreindl.me',

    env: {
        schema: {
            PUBLIC_POSTHOG_KEY: envField.string({ context: 'client', access: 'public', optional: true }),
        },
    },

    integrations: [sitemap()],

    prefetch: {
        prefetchAll: true,
    },

    vite: {
        plugins: [tailwindcss()],
        build: {
            // Astro minifies page CSS in its SSR environment, which targets esnext and
            // would strip the -webkit-backdrop-filter that Safari 17 and older need.
            cssTarget: 'safari16.4',
        },
    },
});
