import { prefersReducedMotion } from '../gsap';
import type { EffectRun } from '../seasons';
import { EASE_OUT_STRONG, fadeOutOnAbort, styleUntil } from './stage';

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <circle cx="8" cy="8" r="6.5" />
    <path d="M5.2 6.4h1.6M9.6 6.6l1.2-.8M5.4 9.6c1.4 1.5 3.8 1.5 5.2 0" />
</svg>`;

const DODGES = 2;

const LEAP_PX = 180;

const EDGE_PX = 16;

const GIVE_UP_MS = 900;

// The first sideways step that keeps the button inside [min, max]: away, back the other way, or not at all.
const fitStep = (from: number, size: number, step: number, min: number, max: number) =>
    [step, -step].find((s) => from + s >= min && from + size + s <= max) ?? 0;

// The "View Work" button jumps away from the mouse twice, then slides home and owns up.
export function start(signal: AbortSignal, { reveal }: EffectRun) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const cta = hero?.querySelector<HTMLElement>('[data-magnetic]');
    const intro = hero?.querySelector<HTMLElement>('[data-hero-ledge] > p');

    if (!hero || !cta) return;

    // Reduced motion still gets the joke, but the button jumps instead of sliding.
    const still = prefersReducedMotion();
    let dodges = 0;
    let leaping = false;
    let offsetX = 0;
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
    fadeOutOnAbort(signal, note);
    signal.addEventListener('abort', () => {
        clearTimeout(givingUp);
        leap?.cancel();
    });

    // Animating `translate` leaves `transform` to the Magnetic wrapper's own pointer tracking.
    const slideTo = (x: number, duration: number) => {
        leap?.cancel();
        leap = cta.animate([{ translate: `${offsetX}px 0` }, { translate: `${x}px 0` }], {
            duration: still ? 0 : duration,
            easing: EASE_OUT_STRONG,
            fill: 'forwards',
        });
        offsetX = x;

        return leap;
    };

    const giveUp = () => {
        slideTo(0, 700);
        note.textContent = 'April Fools';
        note.animate(
            [still ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
            {
                duration: 500,
                delay: still ? 0 : 500,
                easing: EASE_OUT_STRONG,
                fill: 'backwards',
            },
        );
        reveal();
    };

    const dodge = (e: PointerEvent) => {
        if (leaping || e.pointerType !== 'mouse') return;

        const rect = cta.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - e.clientX;
        const dy = rect.top + rect.height / 2 - e.clientY;
        const distance = Math.hypot(dx, dy) || 1;

        if (distance > rect.width * 0.85) return;

        // Jumps stay in the row, between the intro text and the button's own spot, so they never land on the scroll link.
        const text = intro?.getBoundingClientRect();
        const textBeside = text && text.bottom > rect.top && text.top < rect.bottom;
        const minX = Math.max(textBeside ? text.right : 0, hero.getBoundingClientRect().left) + EDGE_PX;
        const maxX = rect.right - offsetX;
        const stepX = fitStep(rect.left, rect.width, Math.sign(dx || -1) * LEAP_PX, minX, maxX);

        if (!stepX) return;

        leaping = true;
        dodges += 1;
        slideTo(offsetX + stepX, 380).addEventListener('finish', () => (leaping = false), { once: true });

        if (dodges < DODGES) return;

        hero.removeEventListener('pointermove', dodge);
        givingUp = setTimeout(giveUp, GIVE_UP_MS);
    };

    hero.addEventListener('pointermove', dodge, { passive: true, signal });
}
