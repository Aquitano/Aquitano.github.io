import { prefersReducedMotion } from '../gsap';
import type { EffectRun } from '../seasons';
import { EASE_OUT_STRONG, everyFrame, fadeOutOnAbort, random } from './stage';

const SPIDER_HEIGHT = 29;

const SPIDER = `
<svg width="32" height="${SPIDER_HEIGHT}" viewBox="-15 -11 30 27" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-2 2.5 -8 -1 -11 -6M-2.5 3.5 -9 2 -13 -1M-2.5 5 -9 6 -12 10M-2 6 -7 9.5 -8 14" />
    <path d="M2 2.5 8 -1 11 -6M2.5 3.5 9 2 13 -1M2.5 5 9 6 12 10M2 6 7 9.5 8 14" />
    <ellipse cy="-3" rx="4.5" ry="5.5" fill="currentColor" stroke="none" />
    <circle cy="4.5" r="3" fill="currentColor" stroke="none" />
    <circle cx="-1.2" cy="5.8" r="1" fill="var(--accent)" stroke="none" />
    <circle cx="1.2" cy="5.8" r="1" fill="var(--accent)" stroke="none" />
</svg>`;

export const icon = SPIDER;

const HIDDEN_Y = -80;

const FLEE_RADIUS = 110;

const RETURN_MS = 5000;

// The dot grid only shows inside a torch beam, which follows the --mx/--my the hero already eases towards the pointer.
function torchlight(hero: HTMLElement, signal: AbortSignal) {
    const grid = hero.querySelector<HTMLElement>('.hero-bg');

    if (!grid) return;

    const beam = 'radial-gradient(circle 280px at var(--mx) var(--my), #000 25%, transparent 100%)';
    const torch = document.createElement('div');
    torch.setAttribute('aria-hidden', 'true');
    Object.assign(torch.style, {
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        backgroundImage: [
            'radial-gradient(300px 300px at var(--mx) var(--my), color-mix(in oklch, var(--accent) 28%, transparent), transparent 70%)',
            'radial-gradient(circle, color-mix(in oklch, var(--fg) 55%, transparent) 1px, transparent 1.5px)',
        ].join(', '),
        backgroundSize: 'auto, 26px 26px',
        backgroundPosition: 'center',
        maskImage: beam,
        webkitMaskImage: beam,
    });

    // The hero writes the eased position inline, or leaves the stylesheet's 70% 30% on touch and reduced motion.
    let position = '';

    const follow = () => {
        const x = grid.style.getPropertyValue('--mx') || '70%';
        const y = grid.style.getPropertyValue('--my') || '30%';

        if (`${x} ${y}` === position) return;

        position = `${x} ${y}`;
        torch.style.setProperty('--mx', x);
        torch.style.setProperty('--my', y);
    };

    follow();
    everyFrame(signal, follow);
    grid.after(torch);
    torch.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out' });
    fadeOutOnAbort(signal, torch);

    // Fading the grid with an animation rather than a style lets switching off play it back to where it was.
    const dim = grid.animate([{ opacity: 0 }], {
        duration: 600,
        easing: 'ease-out',
        fill: 'forwards',
    });

    signal.addEventListener('abort', () => {
        dim.updatePlaybackRate(2.4);
        dim.reverse();
        dim.finished.then(
            () => dim.cancel(),
            () => {},
        );
    });
}

function flickerSurname(hero: HTMLElement, signal: AbortSignal) {
    const surname = hero.querySelector('h1 .display-outline');

    if (!surname) return;

    let flicker: Animation | undefined;
    let next: ReturnType<typeof setTimeout> | undefined;

    // At random moments rather than on a beat, like a failing bulb.
    const schedule = (seconds: number) => {
        next = setTimeout(() => {
            flicker = surname.animate(
                [
                    { opacity: 1 },
                    { opacity: 0.15, offset: 0.1 },
                    { opacity: 1, offset: 0.25 },
                    { opacity: 0.3, offset: 0.4 },
                    { opacity: 1, offset: 0.7 },
                ],
                { duration: 700 },
            );
            schedule(random(12, 25));
        }, seconds * 1000);
    };

    schedule(random(5, 9));
    signal.addEventListener('abort', () => {
        clearTimeout(next);
        flicker?.cancel();
    });
}

// Under reduced motion the spider hangs still and vanishes instead of climbing.
function lowerSpider(hero: HTMLElement, signal: AbortSignal, still: boolean, onLoad: boolean) {
    // The web hangs from below the fixed header, so the thread never runs through the nav links.
    const ceiling = document.querySelector<HTMLElement>('[data-header]')?.offsetHeight ?? 0;
    const web = document.createElement('div');
    web.setAttribute('aria-hidden', 'true');
    Object.assign(web.style, {
        position: 'absolute',
        inset: `${ceiling}px 0 0`,
        zIndex: '5',
        overflow: 'hidden',
        pointerEvents: 'none',
        maskImage: 'linear-gradient(transparent, #000 48px)',
    });

    const anchor = document.createElement('div');
    Object.assign(anchor.style, { position: 'absolute', top: '0', left: '72%' });

    const drop = document.createElement('div');
    drop.style.color = 'color-mix(in oklch, var(--fg) 85%, transparent)';
    drop.style.transform = `translateY(${HIDDEN_Y}px)`;
    drop.innerHTML = SPIDER;

    const thread = document.createElement('span');
    Object.assign(thread.style, {
        position: 'absolute',
        bottom: 'calc(100% - 6px)',
        left: '50%',
        width: '1px',
        height: '100vh',
        background: 'color-mix(in oklch, var(--fg) 30%, transparent)',
    });

    drop.prepend(thread);
    anchor.append(drop);
    web.append(anchor);
    hero.append(web);

    if (!still) {
        anchor.animate([{ transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }], {
            duration: 3200,
            direction: 'alternate',
            easing: 'ease-in-out',
            iterations: Infinity,
        });
    }

    let current: Animation | undefined;
    let returning: ReturnType<typeof setTimeout> | undefined;
    const heading = hero.querySelector('[data-hero-dim]');

    // Hang just above the role line and name, wherever the viewport puts them.
    const restingY = () =>
        heading
            ? Math.max(56, heading.getBoundingClientRect().top - web.getBoundingClientRect().top - SPIDER_HEIGHT - 28)
            : Math.round(web.clientHeight * 0.28);

    const moveTo = (y: number, options: KeyframeAnimationOptions) => {
        const from = getComputedStyle(drop).transform;
        current?.cancel();
        current = drop.animate([{ transform: from }, { transform: `translateY(${y}px)` }], {
            ...options,
            duration: still ? 0 : options.duration,
            delay: still ? 0 : options.delay,
            fill: 'forwards',
        });
    };

    const descend = (delay: number) => moveTo(restingY(), { duration: 2600, delay, easing: EASE_OUT_STRONG });

    let pointerX = -Infinity;
    let pointerY = -Infinity;

    // Where the spider's body hangs once it has come down, in viewport coordinates.
    const restingCentre = () => {
        const box = anchor.getBoundingClientRect();

        return { x: box.left + box.width / 2, y: web.getBoundingClientRect().top + restingY() + SPIDER_HEIGHT / 2 };
    };

    const nearPointer = ({ x, y }: { x: number; y: number }) => Math.hypot(pointerX - x, pointerY - y) < FLEE_RADIUS;

    // Waits until the cursor has moved off the spot, so the spider does not drop straight onto it again.
    const returnLater = (ms: number) => {
        returning = setTimeout(() => {
            if (nearPointer(restingCentre())) return returnLater(1500);

            returning = undefined;
            descend(0);
        }, ms);
    };

    const fleeFrom = (e: PointerEvent) => {
        pointerX = e.clientX;
        pointerY = e.clientY;
        const body = drop.querySelector('svg')?.getBoundingClientRect();

        if (returning || !body || !nearPointer({ x: body.left + body.width / 2, y: body.top + body.height / 2 }))
            return;

        // A startled spider leaves at once, so the climb starts fast instead of easing in.
        moveTo(HIDDEN_Y, { duration: 300, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' });
        returnLater(RETURN_MS);
    };

    hero.addEventListener('pointermove', fleeFrom, { passive: true, signal });
    hero.addEventListener('pointerdown', fleeFrom, { passive: true, signal });
    hero.addEventListener('pointerleave', () => (pointerX = pointerY = -Infinity), { signal });
    // A rotated phone or resized window moves the name, so a hanging spider follows it. The first call is the initial layout.
    let laidOut = false;

    const relayout = new ResizeObserver(() => {
        if (laidOut && !returning) moveTo(restingY(), { duration: 400, easing: EASE_OUT_STRONG });

        laidOut = true;
    });

    relayout.observe(hero);

    signal.addEventListener('abort', () => {
        clearTimeout(returning);
        relayout.disconnect();
    });
    fadeOutOnAbort(signal, web);
    descend(onLoad ? 1800 : 300);
}

export function start(signal: AbortSignal, { onLoad }: EffectRun) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');

    if (!hero) return;

    const still = prefersReducedMotion();

    torchlight(hero, signal);
    lowerSpider(hero, signal, still, onLoad);

    // A flickering title is a flash, which reduced motion opts out of.
    if (!still) flickerSurname(hero, signal);
}
