import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';
import critters from 'astro-critters';
import icon from 'astro-icon';
import { astroImageTools } from 'astro-imagetools';
import { defineConfig } from 'astro/config';

import devtools from 'solid-devtools/vite';

// const dev = process.env.NODE_ENV !== 'production';

export default defineConfig({
    site: 'https://thomasbreindl.me',

    integrations: [
        icon(),
        solidJs(),
        sitemap(),
        astroImageTools,
        critters({
            exclude: ['./dist/showcase'],
            Logger: 1,
        }),
        compress({
            Image: false,
            Logger: 1,
        }),
    ],

    prefetch: {
        prefetchAll: true,
    },

    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'de'],
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
