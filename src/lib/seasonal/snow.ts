import { gsap, prefersReducedMotion } from '../gsap';
import { createStage, everyFrame, random } from './stage';

type Flake = { x: number; y: number; vx: number; vy: number; depth: number; phase: number };

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 1.5v13M2.37 4.75l11.26 6.5M2.37 11.25l11.26-6.5" />
    <path d="M9.9 4.4 8 2.8 6.1 4.4M6.1 11.6 8 13.2l1.9-1.6M12.07 7.85l.43-2.45-2.33-.85M10.17 11.45l2.33-.85-.43-2.45M3.93 8.15l-.43 2.45 2.33.85M5.83 4.55 3.5 5.4l.43 2.45" />
</svg>`;

const REPEL_RADIUS = 110;

const clampScroll = gsap.utils.clamp(-60, 60);

export function start(signal: AbortSignal) {
    const stage = createStage(document.body, { position: 'fixed', zIndex: '45' }, signal);

    if (!stage) return;

    const still = prefersReducedMotion();
    const color = getComputedStyle(document.documentElement).getPropertyValue('--fg');
    const flakes: Flake[] = [];

    const settle = () => {
        const { width, height } = stage;
        const count = gsap.utils.clamp(40, 140, Math.round((width * height) / 12_000));

        while (flakes.length < count) {
            flakes.push({
                x: random(0, width),
                y: random(0, height),
                vx: 0,
                vy: 0,
                depth: Math.random(),
                phase: random(0, 7),
            });
        }

        flakes.length = still ? Math.round(count / 2) : count;
    };

    const draw = (flake: Flake) => {
        const near = 0.35 + flake.depth * 0.65;
        stage.ctx.globalAlpha = 0.2 + near * 0.6;
        stage.ctx.beginPath();
        stage.ctx.arc(flake.x, flake.y, 0.5 + near * 1.9, 0, Math.PI * 2);
        stage.ctx.fill();
    };

    // Reduced motion gets one still frame, redrawn only when the viewport changes.
    if (still) {
        stage.onResize = () => {
            flakes.length = 0;
            settle();
            stage.ctx.fillStyle = color;
            flakes.forEach(draw);
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
        const { ctx, width, height } = stage;

        if (!width) return;

        settle();

        // Flakes sit in the page rather than on the glass, so scrolling carries them along, near ones further.
        const scrolled = clampScroll(window.scrollY - lastScrollY);
        lastScrollY = window.scrollY;
        const damping = Math.exp(-2.5 * dt);

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;

        for (const flake of flakes) {
            const near = 0.35 + flake.depth * 0.65;
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
            flake.y += ((16 + 40 * near) * near + flake.vy) * dt - scrolled * near * 0.4;

            if (flake.y > height + 4) Object.assign(flake, { y: -4, x: random(0, width) });
            else if (flake.y < -4) Object.assign(flake, { y: height + 4, x: random(0, width) });

            if (flake.x > width + 4) flake.x = -4;
            else if (flake.x < -4) flake.x = width + 4;

            draw(flake);
        }
    });
}
