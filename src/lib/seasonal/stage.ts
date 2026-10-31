import { gsap } from '../gsap';

export type Stage = {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    onResize?: () => void;
};

/** A click-through canvas that fills its containing block and keeps a DPR-sharp backing store. */
export function createStage(
    host: HTMLElement,
    placement: Partial<CSSStyleDeclaration>,
    signal: AbortSignal,
): Stage | undefined {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return undefined;

    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, { inset: '0', width: '100%', height: '100%', pointerEvents: 'none' }, placement);
    host.append(canvas);

    const stage: Stage = { ctx, width: 0, height: 0 };

    const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        const dpr = Math.min(window.devicePixelRatio, 2);
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
    });
}

export const random = (min: number, max: number) => min + Math.random() * (max - min);
