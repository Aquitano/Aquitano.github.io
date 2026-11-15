import { prefersReducedMotion } from '../gsap';
import type { EffectRun } from '../seasons';
import { EASE_OUT_STRONG, fadeOutOnAbort, styleUntil } from './stage';

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 4.5 1.5 8 5 11.5M11 4.5 14.5 8 11 11.5M9.2 3 6.8 13" />
</svg>`;

const BITS = '01';

const HEX = '0123456789abcdef';

const FRAME_MS = 55;

const BINARY_MS = 350;

const LOCK_STAGGER_MS = 70;

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

        // The hidden name keeps its width in the layout, so a wider string of digits overflows instead of wrapping.
        const placeholder = document.createElement('span');
        placeholder.setAttribute('aria-hidden', 'true');
        placeholder.style.visibility = 'hidden';
        placeholder.textContent = word;

        const shown = document.createElement('span');
        shown.setAttribute('aria-hidden', 'true');
        Object.assign(shown.style, { position: 'absolute', top: '0', left: '0', whiteSpace: 'nowrap' });

        // Screen readers keep the real name while the visible one is noise.
        const spoken = document.createElement('span');
        spoken.className = 'sr-only';
        spoken.textContent = word;
        surname.replaceChildren(placeholder, shown, spoken);

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
export function start(signal: AbortSignal, { onLoad }: EffectRun) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const surname = hero?.querySelector<HTMLElement>('h1 .display-outline');
    const status = hero?.querySelector<HTMLElement>('[data-hero-status]');

    if (!surname || !status) return;

    const caption = document.createElement('span');
    caption.className = 'text-accent';
    caption.innerHTML = 'Day <span class="normal-case">0x100</span>';
    status.append(caption);
    fadeOutOnAbort(signal, caption);

    if (prefersReducedMotion()) return;

    const introMs = onLoad ? INTRO_MS : 0;

    caption.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 600,
        delay: introMs,
        easing: EASE_OUT_STRONG,
        fill: 'backwards',
    });

    styleUntil(signal, surname, { position: 'relative' });
    const decode = decoder(surname, signal);
    const first = setTimeout(decode, introMs);
    signal.addEventListener('abort', () => clearTimeout(first));

    // Swapping the letters under a resting cursor fires pointerenter again, so a hover replays only after the cursor leaves.
    let armed = true;
    surname.addEventListener(
        'pointerenter',
        () => {
            if (!armed) return;

            armed = false;
            decode();
        },
        { signal },
    );
    surname.addEventListener('pointerleave', () => (armed = true), { signal });
}
