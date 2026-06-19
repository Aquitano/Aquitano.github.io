import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import compress from 'astro-compress';
import critters from 'astro-critters';
import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://thomasbreindl.me',

    integrations: [
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', {}]],
            },
        }),
        sitemap(),
        critters({
            exclude: ['./dist/showcase'],
            Logger: 1,
        }),
        compress({
            // Astro's built-in compressHTML handles HTML minification safely;
            // astro-compress strips HTML comments, which deletes React's
            // hydration text-boundary markers and breaks island hydration.
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
