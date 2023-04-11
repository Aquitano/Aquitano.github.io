/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
declare module 'astro-imagetools/components' {
    // const Img: import('astro-imagetools').ImgConfigOptions;
    // const Picture: import('astro-imagetools').PictureConfigOptions;
    // const BackgroundImage: import('astro-imagetools').BackgroundImageConfigOptions;
    // const BackgroundPicture: import('astro-imagetools').BackgroundPictureConfigOptions;

    export { default as BackgroundImage } from '../node_modules/.pnpm/astro-imagetools@0.8.1_astro@2.2.2/node_modules/astro-imagetools/components/BackgroundImage.astro';
    export { default as BackgroundPicture } from '../node_modules/.pnpm/astro-imagetools@0.8.1_astro@2.2.2/node_modules/astro-imagetools/components/BackgroundPicture.astro';
    export { default as ImageSupportDetection } from '../node_modules/.pnpm/astro-imagetools@0.8.1_astro@2.2.2/node_modules/astro-imagetools/components/ImageSupportDetection.astro';
    export { default as Img } from '../node_modules/.pnpm/astro-imagetools@0.8.1_astro@2.2.2/node_modules/astro-imagetools/components/Img.astro';
    export { default as Picture } from '../node_modules/.pnpm/astro-imagetools@0.8.1_astro@2.2.2/node_modules/astro-imagetools/components/Picture.astro';
}
