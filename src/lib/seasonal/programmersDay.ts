import { prefersReducedMotion } from '../gsap';
import type { EffectRun } from '../seasons';
import { INTRO_MS, captionRoleLine } from './roleLine';

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 4.5 1.5 8 5 11.5M11 4.5 14.5 8 11 11.5M9.2 3 6.8 13" />
</svg>`;

const BITS = '01';

const HEX = '0123456789abcdef';

const FRAME_MS = 55;

const BINARY_MS = 350;

const LOCK_STAGGER_MS = 70;

const HOVER_COOLDOWN_MS = 3000;

const pick = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

// Each character gets a box as wide as the letter it stands in for, so the surname keeps its exact width while the
// noise plays. A digit wider than its box is squeezed to fit rather than spilling into its neighbours.
function cellsFor(surname: HTMLElement, word: string) {
    const text = [...surname.childNodes].find((node): node is Text => node instanceof Text && node.data.includes(word));

    if (!text) return undefined;

    const offset = text.data.indexOf(word);
    const range = document.createRange();

    const widths = Array.from({ length: word.length }, (_, i) => {
        range.setStart(text, offset + i);
        range.setEnd(text, offset + i + 1);

        return range.getBoundingClientRect().width;
    });

    const probe = document.createElement('span');
    Object.assign(probe.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'pre' });
    surname.append(probe);

    const glyphWidths = new Map(
        [...new Set(BITS + HEX)].map((char) => {
            probe.textContent = char;

            return [char, probe.getBoundingClientRect().width] as const;
        }),
    );

    probe.remove();

    return widths.map((width) => {
        const cell = document.createElement('span');
        Object.assign(cell.style, { display: 'inline-block', width: `${width}px`, textAlign: 'center' });

        const show = (char: string) => {
            cell.textContent = char;
            cell.style.transform = `scaleX(${Math.min(1, width / (glyphWidths.get(char) ?? width))})`;
        };

        return { cell, show };
    });
}

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

        const cells = cellsFor(surname, word);

        if (!cells) return;

        const shown = document.createElement('span');
        shown.setAttribute('aria-hidden', 'true');
        shown.style.whiteSpace = 'nowrap';
        shown.append(...cells.map(({ cell }) => cell));

        // Screen readers keep the real name while the visible one is noise.
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

            cells.forEach(({ show }, i) => {
                if (elapsed < BINARY_MS) show(pick(BITS));
                else show(elapsed < BINARY_MS + (i + 1) * LOCK_STAGGER_MS ? pick(HEX) : word[i]);
            });
        };

        frame();
        timer = setInterval(frame, FRAME_MS);
    };
}

export function start(signal: AbortSignal, { onLoad }: EffectRun) {
    const surname = document.querySelector<HTMLElement>('[data-hero] h1 .display-outline');

    if (!surname || !captionRoleLine(signal, 'Day <span class="normal-case">0x100</span>', onLoad)) return;

    if (prefersReducedMotion()) return;

    const decode = decoder(surname, signal);
    const first = setTimeout(decode, onLoad ? INTRO_MS : 0);
    signal.addEventListener('abort', () => clearTimeout(first));

    // Swapping the letters under a resting cursor fires pointerenter again, so a hover replays only after the cursor
    // leaves. The surname spans the screen, so a cooldown keeps a cursor passing over it from replaying every time.
    let armed = true;
    let lastHover = -Infinity;
    surname.addEventListener(
        'pointerenter',
        () => {
            if (!armed || performance.now() - lastHover < HOVER_COOLDOWN_MS) return;

            armed = false;
            lastHover = performance.now();
            decode();
        },
        { signal },
    );
    surname.addEventListener('pointerleave', () => (armed = true), { signal });
}
