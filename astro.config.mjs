import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';
import critters from 'astro-critters';
import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://thomasbreindl.me',

    integrations: [
        sitemap(),
        critters({
            exclude: ['./dist/showcase'],
            Logger: 1,
        }),
        compress({
            HTML: false,
            Image: false,
            Logger: 1,
        }),
    ],

    prefetch: {
        prefetchAll: true,
    },

    vite: {
        plugins: [tailwindcss()],
    },
});
