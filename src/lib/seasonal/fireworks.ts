import { gsap, prefersReducedMotion } from '../gsap';
import type { EffectRun } from '../seasons';
import { GOLD, createStage, cssVar, everyFrame, random } from './stage';

type Particle = { x: number; y: number; vx: number; vy: number; age: number; ttl: number; color: string };

type Rocket = Particle & { trail: { x: number; y: number }[] };

type Flash = { x: number; y: number; age: number };

/** Clicked bursts keep where they landed; the starting ones sit mid-sky, wherever the layout puts it. */
type StillBurst = { fx: number; fy?: number; color: string };

export const icon = `
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
    <path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M3.4 12.6l2.1-2.1M10.5 5.5l2.1-2.1" />
</svg>`;

const GRAVITY = 140;

const FLIGHT_S = 1.1;

/** A click should pay off quickly, so its rocket flies a shorter fuse than the ones the show launches itself. */
const CLICK_FLIGHT_S = 0.6;

const SPARK_SPEED = 380;

const TRAIL_POINTS = 9;

const FLASH_S = 0.12;

// Where reduced motion shows its still bursts, as fractions of the hero's width, in the open sky above the role line.
const STILL_BURSTS = [0.26, 0.72];

export function start(signal: AbortSignal, { onLoad }: EffectRun) {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    const stage = hero && createStage(hero, signal, { position: 'absolute', zIndex: '0' });

    if (!hero || !stage) return;

    const { ctx } = stage;
    const white = cssVar('--fg');
    const palette = [cssVar('--accent'), GOLD, white];
    const rockets: Rocket[] = [];
    const sparks: Particle[] = [];
    const flashes: Flash[] = [];
    const header = document.querySelector<HTMLElement>('[data-header]');
    const status = hero.querySelector<HTMLElement>('[data-hero-status]');
    const ledge = hero.querySelector<HTMLElement>('[data-hero-ledge]');

    const below = (el: HTMLElement | null, fallback: number) =>
        el ? el.getBoundingClientRect().top - hero.getBoundingClientRect().top : fallback;

    // Bursts stay in the open sky between the header and the role line, never behind the name.
    const skyBand = () => {
        const top = (header?.offsetHeight ?? 0) + 16;

        return [top, Math.max(top + 20, below(status, stage.height * 0.3) - 24)];
    };

    // A phone's sky is narrow, so its bursts spread less to stay clear of the nav.
    const sparkSpeed = () => SPARK_SPEED * (stage.width < 768 ? 0.6 : 1);

    const burst = (x: number, y: number, color: string) => {
        flashes.push({ x, y, age: 0 });

        for (let i = 0; i < 90; i++) {
            const angle = random(0, Math.PI * 2);
            const speed = Math.sqrt(Math.random()) * sparkSpeed();
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
        const bursts: StillBurst[] = STILL_BURSTS.map((fx) => ({ fx, color: gsap.utils.random(palette) }));

        const develop = () => {
            const [top, bottom] = skyBand();
            sparks.length = 0;

            for (const { fx, fy, color } of bursts) {
                burst(fx * stage.width, fy === undefined ? (top + bottom) / 2 : fy * stage.height, color);
            }

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
    let nextLaunch = onLoad ? 1.2 : 0.2;
    let painted = false;

    const observer = new IntersectionObserver(([entry]) => (heroVisible = entry.isIntersecting));
    observer.observe(hero);
    signal.addEventListener('abort', () => observer.disconnect());

    // Solves the launch velocity so the rocket peaks out exactly at the target when its fuse ends.
    const launch = (toX: number, toY: number, flight: number) => {
        // Rockets rise from the divider, so their trails never cross the intro text or the buttons below it.
        const x = toX + random(-60, 60);
        const y = below(ledge, stage.height);
        const vy = (toY - y - 0.5 * GRAVITY * flight ** 2) / flight;
        const color = gsap.utils.random(palette);
        rockets.push({ x, y, vx: (toX - x) / flight, vy, age: 0, ttl: flight, color, trail: [] });
    };

    onEmptyClick((e) => {
        const { x, y } = pointInHero(e);
        launch(x, Math.min(y, below(ledge, stage.height) - 40), CLICK_FLIGHT_S);
    });

    const drawTrail = ({ trail, color }: Rocket) => {
        ctx.strokeStyle = color;

        for (let i = 1; i < trail.length; i++) {
            ctx.globalAlpha = (i / trail.length) * 0.9;
            ctx.beginPath();
            ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
            ctx.lineTo(trail[i].x, trail[i].y);
            ctx.stroke();
        }
    };

    const drawFlash = ({ x, y, age }: Flash) => {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 70);
        glow.addColorStop(0, white);
        glow.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.3 * (1 - age / FLASH_S);
        ctx.fillStyle = glow;
        ctx.fillRect(x - 70, y - 70, 140, 140);
    };

    everyFrame(signal, (_, dt) => {
        const { width, height } = stage;
        nextLaunch -= dt;

        if (heroVisible && width && nextLaunch <= 0) {
            const [top, bottom] = skyBand();
            launch(random(width * 0.12, width * 0.88), random(top, bottom), FLIGHT_S);
            nextLaunch = random(0.6, 2.2);
        }

        if (!rockets.length && !sparks.length && !flashes.length) {
            if (painted) ctx.clearRect(0, 0, width, height);
            painted = false;

            return;
        }

        prepare();
        painted = true;

        for (let i = flashes.length - 1; i >= 0; i--) {
            const flash = flashes[i];
            flash.age += dt;

            if (flash.age >= FLASH_S) flashes.splice(i, 1);
            else drawFlash(flash);
        }

        for (let i = rockets.length - 1; i >= 0; i--) {
            const rocket = rockets[i];
            step(rocket, dt, 1);
            rocket.trail.push({ x: rocket.x, y: rocket.y });

            if (rocket.trail.length > TRAIL_POINTS) rocket.trail.shift();

            if (rocket.age >= rocket.ttl) {
                burst(rocket.x, rocket.y, rocket.color);
                rockets.splice(i, 1);
            } else {
                drawTrail(rocket);
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
