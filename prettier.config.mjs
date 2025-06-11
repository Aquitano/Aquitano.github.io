/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    printWidth: 120,
    plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
    arrowParens: 'always',
};

export default config;
