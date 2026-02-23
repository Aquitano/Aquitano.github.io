/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            fontFamily: {
                display: ['Syne Variable', 'system-ui', 'sans-serif'],
                body: ['Roboto Slab Variable', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'SF Mono', 'Fira Code', 'monospace'],
            },
        },
    },
    plugins: [],
};
