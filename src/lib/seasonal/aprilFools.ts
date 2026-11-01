import { prefersReducedMotion } from '../gsap';
import { EASE_OUT_STRONG, styleUntil } from './stage';

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M5.2 6.4h1.6M9.6 6.6l1.2-.8M5.4 9.6c1.4 1.5 3.8 1.5 5.2 0" />
</svg>`;

const DODGES = 3;

const LEAP_PX = 160;

const EDGE_PX = 16;

const GIVE_UP_MS = 900;

// The first step along an axis that keeps the button inside [min, max]: away, back the other way, or not at all.
const fitStep = (from: number, size: number, step: number, min: number, max: number) =>
    [step, -step].find((s) => from + s >= min && from + size + s <= max) ?? 0;

// The "View Work" button jumps away from the mouse a few times, then slides home and owns up.
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
    let givingUp: ReturnType<typeof setTimeout> | undefined;

    const note = document.createElement('span');
    note.setAttribute('role', 'status');
    note.className = 'meta pointer-events-none text-accent';
    Object.assign(note.style, {
        position: 'absolute',
        bottom: 'calc(100% + 12px)',
        left: '50%',
        translate: '-50% 0',
        whiteSpace: 'nowrap',
    });

    styleUntil(signal, cta, { position: 'relative' });
    cta.append(note);
    signal.addEventListener('abort', () => {
        clearTimeout(givingUp);
        leap?.cancel();
        note.remove();
    });

    // Animating `translate` leaves `transform` to the Magnetic wrapper's own pointer tracking.
    const slideTo = (x: number, y: number, duration: number) => {
        leap?.cancel();
        leap = cta.animate([{ translate: `${offsetX}px ${offsetY}px` }, { translate: `${x}px ${y}px` }], {
            duration: still ? 0 : duration,
            easing: EASE_OUT_STRONG,
            fill: 'forwards',
        });
        offsetX = x;
        offsetY = y;

        return leap;
    };

    const giveUp = () => {
        slideTo(0, 0, 700);
        note.textContent = 'April Fools';
        note.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: still ? 0 : 500, fill: 'backwards' });
    };

    const dodge = (e: PointerEvent) => {
        if (leaping || e.pointerType !== 'mouse') return;

        const rect = cta.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - e.clientX;
        const dy = rect.top + rect.height / 2 - e.clientY;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance > rect.width * 0.85) return;

        // The hero clips its overflow, so a jump must land where the hero is both visible and on screen.
        const area = hero.getBoundingClientRect();
        const minX = Math.max(area.left, 0) + EDGE_PX;
        const maxX = Math.min(area.right, window.innerWidth) - EDGE_PX;
        const minY = Math.max(area.top, 0) + EDGE_PX;
        const maxY = Math.min(area.bottom, window.innerHeight) - EDGE_PX;
        const stepX = fitStep(rect.left, rect.width, (dx / distance) * LEAP_PX, minX, maxX);
        const stepY = fitStep(rect.top, rect.height, (dy / distance) * LEAP_PX, minY, maxY);

        leaping = true;
        dodges += 1;
        slideTo(offsetX + stepX, offsetY + stepY, 380).addEventListener('finish', () => (leaping = false), {
            once: true,
        });

        if (dodges < DODGES) return;

        hero.removeEventListener('pointermove', dodge);
        givingUp = setTimeout(giveUp, GIVE_UP_MS);
    };

    hero.addEventListener('pointermove', dodge, { passive: true, signal });
}
