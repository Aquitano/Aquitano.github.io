import { prefersReducedMotion } from '../gsap';

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M5.2 6.4h1.6M9.6 6.6l1.2-.8M5.4 9.6c1.4 1.5 3.8 1.5 5.2 0" />
</svg>`;

const DODGES = 3;

const LEAP_PX = 160;

const EDGE_PX = 16;

// The "View Work" button jumps away from the mouse a few times before it gives up.
export function start(signal: AbortSignal) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const cta = hero?.querySelector<HTMLElement>('[data-magnetic]');

    if (!hero || !cta) return;

    // Reduced motion still gets the joke, but the button jumps instead of sliding.
    const still = prefersReducedMotion();
    let dodges = 0;
    let leaping = false;
    let offsetX = 0;
    let offsetY = 0;
    let leap: Animation | undefined;

    // Animating `translate` leaves `transform` to the Magnetic wrapper's own pointer tracking.
    const slideTo = (x: number, y: number, duration: number) => {
        leap?.cancel();
        leap = cta.animate([{ translate: `${offsetX}px ${offsetY}px` }, { translate: `${x}px ${y}px` }], {
            duration: still ? 0 : duration,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
            fill: 'forwards',
        });
        leap.addEventListener('finish', () => (leaping = false), { once: true });
        offsetX = x;
        offsetY = y;
    };

    const dodge = (e: PointerEvent) => {
        if (leaping || e.pointerType !== 'mouse') return;

        const rect = cta.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - e.clientX;
        const dy = rect.top + rect.height / 2 - e.clientY;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance > rect.width * 0.85) return;

        let stepX = (dx / distance) * LEAP_PX;
        let stepY = (dy / distance) * LEAP_PX;

        if (rect.left + stepX < EDGE_PX || rect.right + stepX > window.innerWidth - EDGE_PX) stepX = -stepX;

        if (rect.top + stepY < EDGE_PX || rect.bottom + stepY > window.innerHeight - EDGE_PX) stepY = -stepY;

        leaping = true;
        dodges += 1;
        slideTo(offsetX + stepX, offsetY + stepY, 380);

        if (dodges === DODGES) hero.removeEventListener('pointermove', dodge);
    };

    hero.addEventListener('pointermove', dodge, { passive: true, signal });
    cta.addEventListener('click', () => setTimeout(() => !signal.aborted && slideTo(0, 0, 700), 400), {
        once: true,
        signal,
    });
    signal.addEventListener('abort', () => leap?.cancel());
}
