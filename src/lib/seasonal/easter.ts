import { prefersReducedMotion } from '../gsap';
import { styleUntil } from './stage';

export const icon = `
<svg width="18" height="22" viewBox="0 0 18 22" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">
    <path d="M9 1C4.5 1 1 8 1 13.5 1 18 4.6 21 9 21s8-3 8-7.5C17 8 13.5 1 9 1Z" fill="var(--bg-raise)" />
    <path d="M1.4 12.5 4 10.5l2.5 2 2.5-2 2.5 2 2.5-2 2.6 2" />
</svg>`;

const CRACK = ['0 48%', '12% 56%', '26% 44%', '40% 56%', '54% 44%', '68% 56%', '82% 44%', '100% 52%'];

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const half = (clipPath: string) => {
    const el = document.createElement('span');
    Object.assign(el.style, { position: 'absolute', inset: '0', clipPath });
    el.innerHTML = icon;

    return el;
};

export function start(signal: AbortSignal) {
    const ledge = document.querySelector<HTMLElement>('[data-hero-ledge]');

    if (!ledge) return;

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

    const button = document.createElement('button');
    button.type = 'button';
    button.ariaLabel = 'Crack open the Easter egg';
    Object.assign(button.style, {
        position: 'absolute',
        bottom: 'calc(100% + 1px)',
        left: '56%',
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        cursor: 'pointer',
    });
    button.append(egg);

    const note = document.createElement('span');
    note.role = 'status';
    note.className = 'meta text-accent';
    Object.assign(note.style, {
        position: 'absolute',
        whiteSpace: 'nowrap',
        bottom: 'calc(100% + 36px)',
        left: 'calc(56% + 22px)',
        translate: '-50% 0',
    });

    styleUntil(signal, ledge, { position: 'relative' });
    ledge.append(button, note);
    signal.addEventListener('abort', () => {
        button.remove();
        note.remove();
    });

    const wobble = still
        ? undefined
        : egg.animate(
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

    // Reduced motion keeps the reveal but swaps the lid's flight and the note's rise for plain fades.
    const lidOff = still ? { opacity: 0 } : { transform: 'translate(-6px, -22px) rotate(-40deg)', opacity: 0 };

    const noteIn = still ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)' };

    button.addEventListener(
        'click',
        () => {
            wobble?.cancel();
            button.disabled = true;
            button.style.cursor = 'default';
            lid.animate([{ transform: 'none', opacity: 1 }, lidOff], {
                duration: still ? 200 : 900,
                easing: EASE,
                fill: 'forwards',
            });
            note.textContent = 'Happy Easter';
            note.animate([noteIn, { opacity: 1, transform: 'none' }], {
                duration: still ? 200 : 600,
                delay: 150,
                easing: EASE,
                fill: 'backwards',
            });
        },
        { once: true, signal },
    );
}
