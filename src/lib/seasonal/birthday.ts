import { prefersReducedMotion } from '../gsap';
import { placeOnLedge } from './ledge';
import { EASE_OUT_STRONG } from './stage';

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 1c1.4 1.6 2 2.7 2 3.6a2 2 0 0 1-4 0C6 3.7 6.6 2.6 8 1Z" fill="currentColor" stroke="none" />
    <path d="M8 6.8V8.4" />
    <rect x="5.4" y="8.4" width="5.2" height="6.6" rx="1" />
</svg>`;

const FLAME = `
<svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
    <path d="M4 0C2.6 2.4 0 4.8 0 8a4 4 0 0 0 8 0C8 4.8 5.4 2.4 4 0Z" />
</svg>`;

const BODY = `
<svg width="10" height="22" viewBox="0 0 10 22" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <path d="M5 0v3" />
    <rect x="0.6" y="3" width="8.8" height="18.4" rx="1.5" fill="var(--bg-raise)" />
    <path d="M0.6 9 9.4 5.5M0.6 14 9.4 10.5M0.6 19 9.4 15.5" />
</svg>`;

const SMOKE = `
<svg width="7" height="13" viewBox="0 0 10 18" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <path d="M5 18c-3-3 3-5 0-8s3-5 0-8" />
</svg>`;

const part = (svg: string, styles: Partial<CSSStyleDeclaration>) => {
    const el = document.createElement('span');
    Object.assign(el.style, { display: 'block' }, styles);
    el.innerHTML = svg;

    return el;
};

// A candle on the hero's divider line that a visitor can blow out on 4 October.
export function start(signal: AbortSignal) {
    const still = prefersReducedMotion();

    const flame = part(FLAME, {
        color: 'var(--accent)',
        transformOrigin: '50% 100%',
        filter: 'drop-shadow(0 0 6px color-mix(in oklch, var(--accent) 70%, transparent))',
    });

    const smoke = part(SMOKE, {
        position: 'absolute',
        bottom: '22px',
        left: '50%',
        translate: '-50% 0',
        opacity: '0',
        color: 'var(--muted)',
    });

    const candle = part(BODY, {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'color-mix(in oklch, var(--fg) 75%, transparent)',
    });

    candle.prepend(flame, smoke);

    let flicker: Animation | undefined;

    const placed = placeOnLedge(signal, {
        label: 'Blow out the birthday candle',
        toy: candle,
        note: "It's my birthday",
        still,
        onPress: () => {
            flicker?.cancel();

            // Reduced motion keeps the flame going out but drops the lean and the rising smoke.
            const out = still
                ? { opacity: 0 }
                : { opacity: 0, transform: 'translateX(3px) rotate(28deg) scale(0.3, 0.2)' };

            flame.animate([{ opacity: 1 }, out], {
                duration: still ? 200 : 280,
                easing: EASE_OUT_STRONG,
                fill: 'forwards',
            });

            if (still) return;

            smoke.animate(
                [
                    { opacity: 0, transform: 'translateY(2px)' },
                    { opacity: 0.7, offset: 0.2 },
                    { opacity: 0, transform: 'translateY(-6px)' },
                ],
                { duration: 1200, delay: 120, easing: 'ease-out' },
            );
        },
    });

    if (!placed || still) return;

    flicker = flame.animate(
        [
            { transform: 'none' },
            { transform: 'scale(0.92, 1.08) rotate(-3deg)' },
            { transform: 'scale(1.04, 0.94) rotate(2deg)' },
            { transform: 'scale(0.96, 1.05) rotate(-1deg)' },
            { transform: 'none' },
        ],
        { duration: 1100, iterations: Infinity, easing: 'ease-in-out' },
    );
}
