import prefetch from '@astrojs/prefetch';
import sitemap from '@astrojs/sitemap';
import solidJs from '@astrojs/solid-js';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import critters from 'astro-critters';
import { astroImageTools } from 'astro-imagetools';
import purgecss from 'astro-purgecss';
import { defineConfig } from 'astro/config';
// import devtools from 'solid-devtools/vite';

// https://astro.build/config
export default defineConfig({
    site: 'https://aquitano.github.io',
    integrations: [
        tailwind(),
        solidJs(),
        sitemap(),
        astroImageTools,
        purgecss({
            keyframes: true,
            fontFace: true,
        }),
        prefetch({
            throttle: 1,
        }),
        critters({
            exclude: ['./dist/showcase'],
            Logger: 1,
        }),
        compress({
            Image: false,
            Logger: 1,
        }),
    ],
    // vite: {
    //     plugins: [
    //         devtools({
    //             /* features options - all disabled by default */
    //             autoname: true, // e.g. enable autoname
    //         }),
    //     ],
    // },
});
