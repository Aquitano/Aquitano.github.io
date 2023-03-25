import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { astroImageTools } from 'astro-imagetools'
import { defineConfig } from 'astro/config'

import compress from 'astro-compress'

// https://astro.build/config
export default defineConfig({
  site: 'https://aquitano.github.io',
  integrations: [tailwind(), sitemap(), compress(), astroImageTools],
})
