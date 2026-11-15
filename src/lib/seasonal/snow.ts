import { gsap, prefersReducedMotion } from '../gsap';
import { createStage, cssVar, everyFrame, random, styleUntil } from './stage';

type Flake = { x: number; y: number; vx: number; vy: number; phase: number; size: number };

type Layer = { near: number; radius: number; alpha: number; share: number; flakes: Flake[] };

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 1.5v13M2.37 4.75l11.26 6.5M2.37 11.25l11.26-6.5" />
    <path d="M9.9 4.4 8 2.8 6.1 4.4M6.1 11.6 8 13.2l1.9-1.6M12.07 7.85l.43-2.45-2.33-.85M10.17 11.45l2.33-.85-.43-2.45M3.93 8.15l-.43 2.45 2.33.85M5.83 4.55 3.5 5.4l.43 2.45" />
</svg>`;

const REPEL_RADIUS = 110;

const clampScroll = gsap.utils.clamp(-60, 60);

const flakeCount = (width: number, height: number) => gsap.utils.clamp(40, 120, Math.round((width * height) / 12_000));

/** A flake with a soft edge, drawn once and stamped for every flake. */
function flakeSprite(color: string) {
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = 32;
    const ctx = sprite.getContext('2d');

    if (ctx) {
        const glow = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        glow.addColorStop(0, color);
        glow.addColorStop(0.35, color);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, 32, 32);
    }

    return sprite;
}

export function start(signal: AbortSignal) {
    // 100lvh keeps the canvas from resizing whenever a mobile URL bar shows or hides.
    const stage = createStage(document.body, signal, { position: 'fixed', zIndex: '-1', height: '100lvh' });

    if (!stage) return;

    // Snow falls behind the text. Without its own stacking context, body paints its background over a negative z-index.
    styleUntil(signal, document.body, { isolation: 'isolate' });

    const { ctx } = stage;
    const color = cssVar('--fg');

    // Three depths: far flakes are smaller, fainter and slower.
    const layers: Layer[] = [
        { near: 0.4, radius: 0.9, alpha: 0.35, share: 0.5, flakes: [] },
        { near: 0.7, radius: 1.5, alpha: 0.55, share: 0.3, flakes: [] },
        { near: 1, radius: 2.3, alpha: 0.6, share: 0.2, flakes: [] },
    ];

    const populate = (total: number, width: number, height: number) => {
        for (const layer of layers) {
            const count = Math.round(total * layer.share);

            while (layer.flakes.length < count) {
                layer.flakes.push({
                    x: random(0, width),
                    y: random(0, height),
                    vx: 0,
                    vy: 0,
                    phase: random(0, 7),
                    size: random(0.6, 1.4),
                });
            }

            layer.flakes.length = count;
        }
    };

    const sprite = flakeSprite(color);

    const paint = (scaleX: number, scaleY: number) => {
        ctx.clearRect(0, 0, stage.width, stage.height);

        for (const { radius, alpha, flakes } of layers) {
            ctx.globalAlpha = alpha;

            // The sprite's solid core is about a third of its width, so it is stamped at three times the flake's size.
            for (const { x, y, size } of flakes) {
                const d = radius * size * 6;
                ctx.drawImage(sprite, x * scaleX - d / 2, y * scaleY - d / 2, d, d);
            }
        }
    };

    // Reduced motion gets a still frame. Flakes live in 0-1 coordinates so a resize rescales them instead of reshuffling.
    if (prefersReducedMotion()) {
        stage.onResize = () => {
            if (!layers[0].flakes.length) populate(flakeCount(stage.width, stage.height) / 2, 1, 1);

            paint(stage.width, stage.height);
        };

        return;
    }

    let pointerX = -Infinity;
    let pointerY = -Infinity;
    let lastScrollY = window.scrollY;

    window.addEventListener(
        'pointermove',
        (e) => {
            pointerX = e.clientX;
            pointerY = e.clientY;
        },
        { passive: true, signal },
    );

    document.documentElement.addEventListener('pointerleave', () => (pointerX = -Infinity), { signal });

    everyFrame(signal, (time, dt) => {
        const { width, height } = stage;

        if (!width) return;

        populate(flakeCount(width, height), width, height);

        // Flakes sit in the page rather than on the glass, so scrolling carries them along, near ones further.
        const scrolled = clampScroll(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;
        const damping = Math.exp(-2.5 * dt);

        for (const { near, flakes } of layers) {
            for (const flake of flakes) {
                const dx = flake.x - pointerX;
                const dy = flake.y - pointerY;
                const distance = Math.hypot(dx, dy);

                if (distance < REPEL_RADIUS && distance > 0) {
                    const force = (1 - distance / REPEL_RADIUS) * 900 * dt;
                    flake.vx += (dx / distance) * force;
                    flake.vy += (dy / distance) * force;
                }

                flake.vx *= damping;
                flake.vy *= damping;
                flake.x += (Math.sin(time * 0.7 + flake.phase) * 16 * near + flake.vx) * dt;
                flake.y += (5 + 50 * near + flake.vy) * dt - scrolled * near * 0.4;

                if (flake.y > height + 4) Object.assign(flake, { y: -4, x: random(0, width) });
                else if (flake.y < -4) Object.assign(flake, { y: height + 4, x: random(0, width) });

                if (flake.x > width + 4) flake.x = -4;
                else if (flake.x < -4) flake.x = width + 4;
            }
        }

        paint(1, 1);
    });
}
