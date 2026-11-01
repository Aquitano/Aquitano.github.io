import { gsap, prefersReducedMotion } from '../gsap';
import { createStage, cssVar, everyFrame, random } from './stage';

type Particle = { x: number; y: number; vx: number; vy: number; age: number; ttl: number; color: string };

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M3.4 12.6l2.1-2.1M10.5 5.5l2.1-2.1" />
</svg>`;

const GRAVITY = 140;

const FLIGHT_S = 1.1;

const GOLD = '#f6c177';

// Where reduced motion shows its still bursts, as fractions of the hero: the empty band above the role line.
const STILL_BURSTS = [
    [0.18, 0.12],
    [0.5, 0.08],
    [0.8, 0.14],
];

export function start(signal: AbortSignal) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const stage = hero && createStage(hero, signal, { placement: { position: 'absolute', zIndex: '0' }, maxDpr: 1 });

    if (!hero || !stage) return;

    const { ctx } = stage;
    const white = cssVar('--fg');
    const palette = [cssVar('--accent'), GOLD, white];
    const rockets: Particle[] = [];
    const sparks: Particle[] = [];

    const burst = (x: number, y: number, color: string) => {
        for (let i = 0; i < 72; i++) {
            const angle = random(0, Math.PI * 2);
            const speed = Math.sqrt(Math.random()) * 230;
            sparks.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                age: 0,
                ttl: random(1.1, 1.9),
                color: Math.random() < 0.75 ? color : white,
            });
        }
    };

    const step = (particle: Particle, dt: number, drag: number) => {
        particle.age += dt;
        particle.vx *= drag;
        particle.vy = particle.vy * drag + GRAVITY * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
    };

    const streak = (particle: Particle, alpha: number, tail: number) => {
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = particle.color;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x - particle.vx * tail, particle.y - particle.vy * tail);
        ctx.stroke();
    };

    const prepare = () => {
        ctx.clearRect(0, 0, stage.width, stage.height);
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        ctx.lineWidth = 1.6;
    };

    const pointInHero = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();

        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onEmptyClick = (handler: (e: MouseEvent) => void) =>
        hero.addEventListener(
            'click',
            (e) => {
                if (!(e.target instanceof Element && e.target.closest('a, button'))) handler(e);
            },
            { signal },
        );

    // Reduced motion gets a still frame of bursts caught mid-air; a click adds one where it lands.
    if (prefersReducedMotion()) {
        const bursts = STILL_BURSTS.map(([fx, fy]) => ({ fx, fy, color: gsap.utils.random(palette) }));

        const develop = () => {
            sparks.length = 0;

            for (const { fx, fy, color } of bursts) burst(fx * stage.width, fy * stage.height, color);

            for (const spark of sparks) {
                for (let i = 0; i < 30; i++) step(spark, 1 / 60, Math.exp(-1.6 / 60));
            }

            prepare();

            for (const spark of sparks) streak(spark, 1 - spark.age / spark.ttl, 0.05);
        };

        stage.onResize = develop;
        onEmptyClick((e) => {
            const { x, y } = pointInHero(e);
            bursts.push({ fx: x / stage.width, fy: y / stage.height, color: gsap.utils.random(palette) });

            if (bursts.length > 5) bursts.shift();

            develop();
        });

        return;
    }

    let heroVisible = true;
    let nextLaunch = 1.2;

    const observer = new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting));
    observer.observe(hero);
    signal.addEventListener('abort', () => observer.disconnect());

    // Solves the launch velocity so the rocket peaks out exactly at the target when its fuse ends.
    const launch = (toX: number, toY: number) => {
        const x = toX + random(-60, 60);
        const y = stage.height + 8;
        const vy = (toY - y - 0.5 * GRAVITY * FLIGHT_S ** 2) / FLIGHT_S;
        rockets.push({ x, y, vx: (toX - x) / FLIGHT_S, vy, age: 0, ttl: FLIGHT_S, color: gsap.utils.random(palette) });
    };

    onEmptyClick((e) => {
        const { x, y } = pointInHero(e);
        launch(x, y);
    });

    everyFrame(signal, (_, dt) => {
        const { width, height } = stage;
        nextLaunch -= dt;

        if (heroVisible && width && nextLaunch <= 0) {
            launch(random(width * 0.15, width * 0.85), random(height * 0.1, height * 0.4));
            nextLaunch = random(0.6, 2.2);
        }

        if (!rockets.length && !sparks.length) return;

        prepare();

        for (let i = rockets.length - 1; i >= 0; i--) {
            const rocket = rockets[i];
            step(rocket, dt, 1);

            if (rocket.age >= rocket.ttl) {
                burst(rocket.x, rocket.y, rocket.color);
                rockets.splice(i, 1);
            } else {
                streak(rocket, 0.9, 0.04);
            }
        }

        const drag = Math.exp(-1.6 * dt);

        for (let i = sparks.length - 1; i >= 0; i--) {
            const spark = sparks[i];
            step(spark, dt, drag);

            if (spark.age >= spark.ttl) sparks.splice(i, 1);
            else streak(spark, (1 - spark.age / spark.ttl) ** 1.5, 0.05);
        }
    });
}
