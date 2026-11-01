import { gsap } from '../gsap';

/** `--ease-out-strong`, which WAAPI cannot read through `var()`. */
export const EASE_OUT_STRONG = 'cubic-bezier(0.23, 1, 0.32, 1)';

export type Stage = {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    onResize?: () => void;
};

type StageOptions = {
    placement: Partial<CSSStyleDeclaration>;
    /** Soft particles look the same at 1x, and every extra device pixel is paint work per frame. */
    maxDpr: number;
};

/** A click-through canvas that fills its containing block. */
export function createStage(host: HTMLElement, signal: AbortSignal, options: StageOptions): Stage | undefined {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return undefined;

    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(
        canvas.style,
        { inset: '0', width: '100%', height: '100%', pointerEvents: 'none' },
        options.placement,
    );
    host.append(canvas);

    const stage: Stage = { ctx, width: 0, height: 0 };

    const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        const dpr = Math.min(window.devicePixelRatio, options.maxDpr);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        stage.width = width;
        stage.height = height;
        stage.onResize?.();
    });

    observer.observe(canvas);
    signal.addEventListener('abort', () => {
        observer.disconnect();
        canvas.remove();
    });

    return stage;
}

/** Runs on GSAP's ticker, the rAF loop Lenis and ScrollTrigger already share. */
export function everyFrame(signal: AbortSignal, frame: (time: number, dt: number) => void) {
    const tick = (time: number, deltaMs: number) => frame(time, deltaMs / 1000);
    gsap.ticker.add(tick);
    signal.addEventListener('abort', () => gsap.ticker.remove(tick));
}

/** Sets inline styles that are removed again when the signal aborts. */
export function styleUntil(signal: AbortSignal, el: HTMLElement, styles: Record<string, string>) {
    for (const [property, value] of Object.entries(styles)) el.style.setProperty(property, value);
    signal.addEventListener('abort', () => {
        for (const property of Object.keys(styles)) el.style.removeProperty(property);

        if (!el.style.length) el.removeAttribute('style');
    });
}

export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const random = (min: number, max: number) => min + Math.random() * (max - min);
