const griffinAssetBase = '/showcase/griffin';

export function getGriffinAsset(path: string) {
    return `${griffinAssetBase}/${path}`;
}

export const griffinStylesheets = [
    'css/preloader.css',
    'css/slider-pro.css',
    'css/slick.css',
    'css/style.css',
    'css/magnific-popup.css',
].map((path) => getGriffinAsset(path));

export const griffinPageScripts = [
    'js/jquery.min.js',
    'js/bootstrap.min.js',
    'js/slick.min.js',
    'js/jquery-ui.min.js',
    'js/jquery.sliderPro.min.js',
    'js/fastclick.min.js',
    'js/timber.js',
    'js/jquery.magnific-popup.min.js',
    'js/jquery.waypoints.js',
    'js/jquery.counterup.min.js',
    'js/custom.js',
].map((path) => getGriffinAsset(path));
