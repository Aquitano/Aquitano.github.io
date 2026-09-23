import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap';

const JUMP_DURATION = 1.2;

let lenis: Lenis | null = null;

/**
 * Starts Lenis and drives it from the GSAP ticker so smooth scroll and
 * ScrollTrigger share one rAF loop. Skipped entirely under reduced motion,
 * which leaves native scrolling in place.
 */
export function initSmoothScroll() {
    if (lenis || prefersReducedMotion()) return;

    const instance = new Lenis({ autoRaf: false, anchors: { duration: JUMP_DURATION } });
    instance.on('scroll', ScrollTrigger.update);

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
 * destination rides along as `userData`, which Lenis drops as soon as any other
 * scroll (wheel, anchor, another jump) replaces this one.
 */
export function targetScrollY() {
    if (!lenis) return window.scrollY;
    const { destination } = lenis.userData;
    return lenis.isScrolling && typeof destination === 'number' ? destination : lenis.targetScroll;
}

/**
 * Scrolls via Lenis when it is running, otherwise falls back to the native API
 * so reduced-motion and no-JS paths behave as before.
 */
export function scrollToTarget(target: number | HTMLElement, { immediate = false } = {}) {
    if (lenis) {
        const destination = typeof target === 'number' ? Math.max(0, Math.min(target, lenis.limit)) : undefined;
        lenis.scrollTo(target, { immediate, duration: JUMP_DURATION, userData: { destination } });
        return;
    }

    const behavior: ScrollBehavior = immediate ? 'instant' : 'auto';
    if (typeof target === 'number') window.scrollTo({ top: Math.max(0, target), behavior });
    else target.scrollIntoView({ behavior });
}

export const pauseScroll = () => lenis?.stop();
export const resumeScroll = () => lenis?.start();
