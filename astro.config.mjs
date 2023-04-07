import prefetch from '@astrojs/prefetch';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import { astroImageTools } from 'astro-imagetools';
import purgecss from 'astro-purgecss';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://aquitano.github.io',
    integrations: [tailwind(), sitemap(), astroImageTools /*, purgecss({ keyframes: true }),*/, compress(), prefetch()],
});
