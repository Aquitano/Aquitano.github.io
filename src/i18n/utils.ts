import { ui, defaultLang, type Lang, type TranslationKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as Lang;
    return defaultLang;
}

export function useTranslations(lang: Lang) {
    return function t(key: TranslationKey): string {
        return ui[lang][key] ?? ui[defaultLang][key];
    };
}

export function getLocalePath(lang: Lang, path: string = '/'): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (lang === defaultLang) return cleanPath;
    return `/${lang}${cleanPath}`;
}

export function getAlternateLang(lang: Lang): Lang {
    return lang === 'de' ? 'en' : 'de';
}
