import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

let lenis: Lenis | null = null;
let destination: number | null = null;

/**
 * Starts Lenis and drives it from the GSAP ticker so smooth scroll and
 * ScrollTrigger share one rAF loop. Skipped entirely under reduced motion,
 * which leaves native scrolling in place.
 */
export function initSmoothScroll() {
    if (lenis || prefersReducedMotion()) return;

    const instance = new Lenis({ autoRaf: false, anchors: true });
    instance.on('scroll', ScrollTrigger.update);
    instance.on('virtual-scroll', () => (destination = null));

    // Lenis derives its delta from this clock, so it needs real wall-clock time.
    // The ticker's own `time` argument is lag-smoothed and would desync scroll
    // after a slow frame -- reading performance.now() here lets GSAP keep
    // lagSmoothing for tweens without affecting scroll.
    gsap.ticker.add(() => instance.raf(performance.now()));

    lenis = instance;
}

/**
 * Where the page is heading rather than where it is mid-animation, so repeated
 * relative jumps chain instead of re-targeting the same stop. Lenis reports the
 * in-flight value as `targetScroll` during programmatic scrolls, so the
 * destination is tracked here until the scroll completes or user input takes over.
 */
export const targetScrollY = () => destination ?? lenis?.targetScroll ?? window.scrollY;

/**
 * Scrolls via Lenis when it is running, otherwise falls back to the native API
 * so reduced-motion and no-JS paths behave as before.
 */
export function scrollToTarget(target: number | HTMLElement, { immediate = false } = {}) {
    if (lenis) {
        destination = typeof target === 'number' ? Math.max(0, Math.min(target, lenis.limit)) : null;
        lenis.scrollTo(target, { immediate, onComplete: () => (destination = null) });
        return;
    }

    const behavior: ScrollBehavior = immediate ? 'instant' : 'auto';
    if (typeof target === 'number') window.scrollTo({ top: Math.max(0, target), behavior });
    else target.scrollIntoView({ behavior });
}
