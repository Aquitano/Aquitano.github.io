/**
 * @type {import('astro-imagetools').GlobalConfigOptions}
 */
const config = {
    loading: 'lazy',
    placeholder: 'blur',
    format: ['avif', 'webp'],
    fallbackFormat: 'jpeg',
};

export default config;
