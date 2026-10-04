import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out', duration: 0.8 });

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Deep links land before the reveal scripts load, so their target is already painted.
// Leave anything on screen in place instead of hiding it and fading it back in.
const offscreen = <T extends Element>(els: T[]) => els.filter((el) => !ScrollTrigger.isInViewport(el));

export { gsap, ScrollTrigger, offscreen, prefersReducedMotion, supportsHover };
