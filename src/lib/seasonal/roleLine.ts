import { prefersReducedMotion } from '../gsap';
import { EASE_OUT_STRONG, fadeOutOnAbort } from './stage';

/** The hero intro has brought the name and role line in by about here. */
export const INTRO_MS = 1400;

/** Adds an accent caption to the end of the hero's role line. Returns false when the page has no role line. */
export function captionRoleLine(signal: AbortSignal, html: string, onLoad: boolean) {
    const status = document.querySelector<HTMLElement>('[data-hero] [data-hero-status]');

    if (!status) return false;

    const caption = document.createElement('span');
    caption.className = 'text-accent md:-ml-1';
    // On phones the caption wraps onto its own line, where a leading separator would dangle.
    caption.innerHTML = `<span class="max-md:hidden" aria-hidden="true">·&nbsp;</span>${html}`;
    status.append(caption);
    fadeOutOnAbort(signal, caption);

    if (!prefersReducedMotion()) {
        caption.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 600,
            delay: onLoad ? INTRO_MS : 0,
            easing: EASE_OUT_STRONG,
            fill: 'backwards',
        });
    }

    return true;
}
