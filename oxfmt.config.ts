import { defineConfig } from 'oxfmt';

export default defineConfig({
    tabWidth: 4,
    singleQuote: true,
    printWidth: 120,
    astro: {},
    sortTailwindcss: { stylesheet: 'src/styles/global.css' },
    ignorePatterns: [
        // Vendored school-project demo: reformatting would destroy the original jQuery/Bootstrap artifact.
        'public/showcase/**',
        'src/pages/showcase/griffin/**',
        '.claude/**',
        'tools/oxlint/anti-slop/**',
    ],
});
