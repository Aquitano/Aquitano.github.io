import { prefersReducedMotion } from '../gsap';
import { placeOnLedge } from './ledge';
import { EASE_OUT_STRONG } from './stage';

export const icon = `
<svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
    <path d="M9 1C4.5 1 1 8 1 13.5 1 18 4.6 21 9 21s8-3 8-7.5C17 8 13.5 1 9 1Z" fill="var(--bg-raise)" />
    <path d="M1.4 12.5 4 10.5l2.5 2 2.5-2 2.5 2 2.5-2 2.6 2" />
</svg>`;

const CRACK = ['0 48%', '12% 56%', '26% 44%', '40% 56%', '54% 44%', '68% 56%', '82% 44%', '100% 52%'];

const half = (clipPath: string) => {
    const el = document.createElement('span');
    Object.assign(el.style, { position: 'absolute', inset: '0', clipPath });
    el.innerHTML = icon;

    return el;
};

export function start(signal: AbortSignal) {
    const still = prefersReducedMotion();

    const egg = document.createElement('span');
    Object.assign(egg.style, {
        position: 'relative',
        width: '18px',
        height: '22px',
        color: 'var(--accent)',
        transformOrigin: '50% 100%',
    });

    const lid = half(`polygon(0 0, 100% 0, ${CRACK.toReversed().join(', ')})`);
    egg.append(lid, half(`polygon(${CRACK.join(', ')}, 100% 100%, 0 100%)`));

    // Reduced motion keeps the reveal but swaps the lid's flight for a plain fade.
    const lidOff = still ? { opacity: 0 } : { transform: 'translate(-6px, -22px) rotate(-40deg)', opacity: 0 };
    let wobble: Animation | undefined;

    const placed = placeOnLedge(signal, {
        label: 'Crack open the Easter egg',
        toy: egg,
        note: 'Happy Easter',
        still,
        onPress: () => {
            wobble?.cancel();
            lid.animate([{ transform: 'none', opacity: 1 }, lidOff], {
                duration: still ? 200 : 900,
                easing: EASE_OUT_STRONG,
                fill: 'forwards',
            });
        },
    });

    if (!placed || still) return;

    wobble = egg.animate(
        [
            { rotate: '0deg' },
            { rotate: '0deg', offset: 0.82 },
            { rotate: '-12deg', offset: 0.86 },
            { rotate: '10deg', offset: 0.9 },
            { rotate: '-6deg', offset: 0.94 },
            { rotate: '3deg', offset: 0.97 },
            { rotate: '0deg' },
        ],
        { duration: 4200, delay: 1500, iterations: Infinity },
    );
}
