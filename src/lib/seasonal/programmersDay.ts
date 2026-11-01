import { prefersReducedMotion } from '../gsap';
import { EASE_OUT_STRONG } from './stage';

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 4.5 1.5 8 5 11.5M11 4.5 14.5 8 11 11.5M9.2 3 6.8 13" />
</svg>`;

const BITS = '01';

const HEX = '0123456789abcdef';

const FRAME_MS = 55;

const BINARY_MS = 450;

const LOCK_STAGGER_MS = 110;

/** The surname's intro rise ends around here. */
const INTRO_MS = 1400;

const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

// Every letter flickers in binary, then the letters lock in left to right through hex.
function decoder(surname: HTMLElement, signal: AbortSignal) {
    const original = [...surname.childNodes];
    const word = surname.textContent.trim();
    let timer: ReturnType<typeof setInterval> | undefined;

    const settle = () => {
        clearInterval(timer);
        timer = undefined;
        surname.replaceChildren(...original);
    };

    signal.addEventListener('abort', settle);

    return () => {
        if (timer !== undefined) return;

        // Screen readers keep the real name while the visible one is noise.
        const shown = document.createElement('span');
        shown.setAttribute('aria-hidden', 'true');

        const spoken = document.createElement('span');
        spoken.className = 'sr-only';
        spoken.textContent = word;
        surname.replaceChildren(shown, spoken);

        const began = performance.now();

        const frame = () => {
            const elapsed = performance.now() - began;

            if (elapsed >= BINARY_MS + word.length * LOCK_STAGGER_MS) {
                settle();

                return;
            }

            shown.textContent = word.replace(/./g, (letter, i: number) => {
                if (elapsed < BINARY_MS) return pick(BITS);

                return elapsed < BINARY_MS + (i + 1) * LOCK_STAGGER_MS ? pick(HEX) : letter;
            });
        };

        frame();
        timer = setInterval(frame, FRAME_MS);
    };
}

// Day 256 decodes the surname from hex and marks the day in the hero's status line.
export function start(signal: AbortSignal) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const surname = hero?.querySelector<HTMLElement>('h1 .display-outline');
    const status = hero?.querySelector<HTMLElement>('[data-hero-status]');

    if (!surname || !status) return;

    const caption = document.createElement('span');
    caption.className = 'text-accent';
    caption.innerHTML = 'Day <span class="normal-case">0x100</span>';
    status.append(caption);
    signal.addEventListener('abort', () => caption.remove());

    if (prefersReducedMotion()) return;

    caption.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 600,
        delay: INTRO_MS,
        easing: EASE_OUT_STRONG,
        fill: 'backwards',
    });

    const decode = decoder(surname, signal);
    const first = setTimeout(decode, INTRO_MS);
    signal.addEventListener('abort', () => clearTimeout(first));
    surname.addEventListener('pointerenter', decode, { signal });
}
