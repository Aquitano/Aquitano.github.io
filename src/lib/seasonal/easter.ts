import { prefersReducedMotion } from '../gsap';
import type { EffectRun } from '../seasons';
import { placeOnLedge } from './ledge';
import { EASE_OUT_STRONG, GOLD } from './stage';

const SHELL = '<path d="M9 1C4.5 1 1 8 1 13.5 1 18 4.6 21 9 21s8-3 8-7.5C17 8 13.5 1 9 1Z" fill="var(--bg-raise)" />';

const CRACK_LINE = '<path d="M1.4 12.5 4 10.5l2.5 2 2.5-2 2.5 2 2.5-2 2.6 2" />';

const DOTS = `<g fill="currentColor" stroke="none">
    <circle cx="4.6" cy="15.6" r=".85" /><circle cx="7.5" cy="15.9" r=".85" />
    <circle cx="10.5" cy="15.9" r=".85" /><circle cx="13.4" cy="15.6" r=".85" />
</g>`;

const egg = (inner: string) => `
<svg width="100%" height="100%" viewBox="0 0 18 22" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
    ${SHELL}${inner}
</svg>`;

export const icon = egg(CRACK_LINE);

// Sits behind the bottom shell, so only its head shows above the crack.
const CHICK = `
<svg width="100%" height="100%" viewBox="0 0 18 22" fill="none" stroke-linecap="round">
    <path d="M9 5.6c-.3-1.3.4-2.2 1.4-2.4" stroke="${GOLD}" stroke-width="1.1" />
    <circle cx="9" cy="10.4" r="4.8" fill="${GOLD}" />
    <circle cx="10.7" cy="9.4" r="0.75" fill="var(--bg)" />
    <path d="M13.4 10.2 15.6 11l-2.2.8Z" fill="var(--accent)" />
</svg>`;

const CRACK = ['0 48%', '12% 56%', '26% 44%', '40% 56%', '54% 44%', '68% 56%', '82% 44%', '100% 52%'];

const layer = (svg: string, clipPath = 'none') => {
    const el = document.createElement('span');
    Object.assign(el.style, { position: 'absolute', inset: '0', clipPath });
    el.innerHTML = svg;

    return el;
};

export function start(signal: AbortSignal, { onLoad }: EffectRun) {
    const still = prefersReducedMotion();

    const toy = document.createElement('span');
    Object.assign(toy.style, {
        position: 'relative',
        width: '24px',
        height: '29px',
        color: 'var(--accent)',
        transformOrigin: '50% 100%',
    });

    const chick = layer(CHICK);
    chick.style.opacity = '0';

    // The painted egg shows no crack until it is pressed, so the toy does not give its surprise away.
    const lid = layer(egg(DOTS), `polygon(0 0, 100% 0, ${CRACK.toReversed().join(', ')})`);
    const base = layer(egg(DOTS), `polygon(${CRACK.join(', ')}, 100% 100%, 0 100%)`);
    toy.append(chick, lid, base);

    // Reduced motion keeps the reveal but swaps the lid's flight for a plain fade.
    const lidOff = still ? { opacity: 0 } : { transform: 'translate(-6px, -26px) rotate(-40deg)', opacity: 0 };
    let wobble: Animation | undefined;

    const placed = placeOnLedge(signal, {
        label: 'Crack open the Easter egg',
        toy,
        note: 'Happy Easter',
        still,
        onLoad,
        onPress: () => {
            wobble?.cancel();

            for (const half of [lid, base]) half.querySelector('svg')?.insertAdjacentHTML('beforeend', CRACK_LINE);

            lid.animate([{ transform: 'none', opacity: 1 }, lidOff], {
                duration: still ? 200 : 900,
                easing: EASE_OUT_STRONG,
                fill: 'forwards',
            });
            chick.animate(
                still
                    ? [
                          { opacity: 0, transform: 'translateY(-3px)' },
                          { opacity: 1, transform: 'translateY(-3px)' },
                      ]
                    : [
                          { opacity: 0, transform: 'translateY(9px)' },
                          { opacity: 1, transform: 'translateY(-5px)', offset: 0.6 },
                          { opacity: 1, transform: 'translateY(-3px)' },
                      ],
                { duration: still ? 200 : 520, delay: still ? 0 : 160, easing: EASE_OUT_STRONG, fill: 'both' },
            );
        },
    });

    if (!placed || still) return;

    wobble = toy.animate(
        [
            { rotate: '0deg' },
            { rotate: '0deg', offset: 0.82 },
            { rotate: '-12deg', offset: 0.86 },
            { rotate: '10deg', offset: 0.9 },
            { rotate: '-6deg', offset: 0.94 },
            { rotate: '3deg', offset: 0.97 },
            { rotate: '0deg' },
        ],
        { duration: 4200, delay: onLoad ? 1500 : 600, iterations: Infinity },
    );
}
