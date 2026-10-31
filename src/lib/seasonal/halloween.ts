import { prefersReducedMotion } from '../gsap';
import { styleUntil } from './stage';

const SPIDER_HEIGHT = 29;

const SPIDER = `
<svg width="32" height="${SPIDER_HEIGHT}" viewBox="-15 -11 30 27" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-2 2.5 -8 -1 -11 -6M-2.5 3.5 -9 2 -13 -1M-2.5 5 -9 6 -12 10M-2 6 -7 9.5 -8 14" />
    <path d="M2 2.5 8 -1 11 -6M2.5 3.5 9 2 13 -1M2.5 5 9 6 12 10M2 6 7 9.5 8 14" />
    <ellipse cy="-3" rx="4.5" ry="5.5" fill="currentColor" stroke="none" />
    <circle cy="4.5" r="3" fill="currentColor" stroke="none" />
    <circle cx="-1.1" cy="5.8" r="0.7" fill="var(--accent)" stroke="none" />
    <circle cx="1.1" cy="5.8" r="0.7" fill="var(--accent)" stroke="none" />
</svg>`;

export const icon = SPIDER.replace(`width="32" height="${SPIDER_HEIGHT}"`, 'width="18" height="16"');

const HIDDEN_Y = -80;

const FLEE_RADIUS = 110;

const RETURN_MS = 5000;

// The dot grid only shows inside a torch beam that follows the pointer, using the --mx/--my the hero already tracks.
function darkenGrid(hero: HTMLElement, signal: AbortSignal) {
    const grid = hero.querySelector<HTMLElement>('.hero-bg');
    const glow = grid?.querySelector<HTMLElement>('.hero-glow');

    if (!grid) return;

    const beam = 'radial-gradient(circle 280px at var(--mx) var(--my), #000 25%, transparent 100%)';

    styleUntil(signal, grid, {
        '-webkit-mask-image': beam,
        'mask-image': beam,
        opacity: '1',
        'background-image':
            'radial-gradient(circle, color-mix(in oklch, var(--fg) 55%, transparent) 1px, transparent 1.5px)',
    });

    if (glow) {
        styleUntil(signal, glow, {
            background:
                'radial-gradient(300px 300px at var(--mx) var(--my), oklch(0.7165 0.1409 50.91 / 0.28), transparent 70%)',
        });
    }
}

function flickerSurname(hero: HTMLElement, signal: AbortSignal) {
    const flicker = hero
        .querySelector('h1 .display-outline')
        ?.animate(
            [
                { opacity: 1 },
                { opacity: 1, offset: 0.9 },
                { opacity: 0.15, offset: 0.91 },
                { opacity: 1, offset: 0.925 },
                { opacity: 0.3, offset: 0.94 },
                { opacity: 1, offset: 0.97 },
            ],
            { duration: 7000, delay: 2500, iterations: Infinity },
        );

    signal.addEventListener('abort', () => flicker?.cancel());
}

// Under reduced motion the spider hangs still and vanishes instead of climbing.
function lowerSpider(hero: HTMLElement, signal: AbortSignal, still: boolean) {
    const anchor = document.createElement('div');
    anchor.setAttribute('aria-hidden', 'true');
    Object.assign(anchor.style, { position: 'absolute', top: '0', left: '78%', zIndex: '5', pointerEvents: 'none' });

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
    hero.append(anchor);

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
            ? Math.max(24, heading.getBoundingClientRect().top - hero.getBoundingClientRect().top - SPIDER_HEIGHT - 28)
            : Math.round(hero.clientHeight * 0.28);

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

    const descend = (delay: number) =>
        moveTo(restingY(), { duration: 2600, delay, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });

    const fleeFrom = (e: PointerEvent) => {
        const body = drop.querySelector('svg')?.getBoundingClientRect();

        if (returning || !body) return;

        const distance = Math.hypot(e.clientX - (body.left + body.width / 2), e.clientY - (body.top + body.height / 2));

        if (distance > FLEE_RADIUS) return;

        moveTo(HIDDEN_Y, { duration: 420, easing: 'cubic-bezier(0.7, 0, 0.84, 0)' });
        returning = setTimeout(() => {
            returning = undefined;
            descend(0);
        }, RETURN_MS);
    };

    hero.addEventListener('pointermove', fleeFrom, { passive: true, signal });
    hero.addEventListener('pointerdown', fleeFrom, { passive: true, signal });
    signal.addEventListener('abort', () => {
        clearTimeout(returning);
        anchor.remove();
    });
    descend(1800);
}

export function start(signal: AbortSignal) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');

    if (!hero) return;

    const still = prefersReducedMotion();

    darkenGrid(hero, signal);
    lowerSpider(hero, signal, still);

    // A flickering title is a flash, which reduced motion opts out of.
    if (!still) flickerSurname(hero, signal);
}
