import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

let lenis: Lenis | null = null;

/**
 * Starts Lenis and drives it from the GSAP ticker so smooth scroll and
 * ScrollTrigger share one rAF loop. Skipped entirely under reduced motion,
 * which leaves native scrolling in place.
 */
export function initSmoothScroll() {
    if (lenis || prefersReducedMotion()) return;

    const instance = new Lenis({ autoRaf: false, anchors: true });
    instance.on('scroll', ScrollTrigger.update);

    // Lenis derives its delta from this clock, so it needs real wall-clock time.
    // The ticker's own `time` argument is lag-smoothed and would desync scroll
    // after a slow frame -- reading performance.now() here lets GSAP keep
    // lagSmoothing for tweens without affecting scroll.
    gsap.ticker.add(() => instance.raf(performance.now()));

    lenis = instance;
}

/**
 * Scrolls via Lenis when it is running, otherwise falls back to the native API
 * so reduced-motion and no-JS paths behave as before.
 */
export function scrollToTarget(target: number | HTMLElement, { immediate = false } = {}) {
    if (lenis) {
        lenis.scrollTo(target, { immediate });
        return;
    }

    const behavior: ScrollBehavior = immediate ? 'instant' : 'auto';
    if (typeof target === 'number') window.scrollTo({ top: Math.max(0, target), behavior });
    else target.scrollIntoView({ behavior });
}
