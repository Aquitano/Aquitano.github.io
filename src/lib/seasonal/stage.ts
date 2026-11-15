import { gsap } from '../gsap';

/** `--ease-out-strong`, which WAAPI cannot read through `var()`. */
export const EASE_OUT_STRONG = 'cubic-bezier(0.23, 1, 0.32, 1)';

export type Stage = {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    onResize?: () => void;
};

export function createStage(
    host: HTMLElement,
    signal: AbortSignal,
    placement: Partial<CSSStyleDeclaration>,
): Stage | undefined {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return undefined;

    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, { inset: '0', width: '100%', height: '100%', pointerEvents: 'none' }, placement);
    host.append(canvas);
    canvas.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, easing: 'ease-out' });

    const stage: Stage = { ctx, width: 0, height: 0 };

    const observer = new ResizeObserver(([entry]) => {
        // Drawn at 1x on every screen: soft particles look the same, and each extra device pixel is paint work per frame.
        const { width, height } = entry.contentRect;
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        stage.width = width;
        stage.height = height;
        stage.onResize?.();
    });

    observer.observe(canvas);
    signal.addEventListener('abort', () => observer.disconnect());
    fadeOutOnAbort(signal, canvas);

    return stage;
}

/** Removes the elements once the signal aborts, after a short fade so switching a season off does not hard-cut. */
export function fadeOutOnAbort(signal: AbortSignal, ...elements: HTMLElement[]) {
    signal.addEventListener('abort', () => {
        for (const el of elements) {
            el.style.pointerEvents = 'none';

            // Infinite or filled animations on a removed node stay alive, so they are cancelled with it.
            const remove = () => {
                for (const animation of el.getAnimations({ subtree: true })) animation.cancel();

                el.remove();
            };

            el.animate([{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], {
                duration: 250,
                easing: 'ease-out',
            }).finished.then(remove, remove);
        }
    });
}

/** Runs on GSAP's ticker, the rAF loop Lenis and ScrollTrigger already share. */
export function everyFrame(signal: AbortSignal, frame: (time: number, dt: number) => void) {
    const tick = (time: number, deltaMs: number) => frame(time, deltaMs / 1000);
    gsap.ticker.add(tick);
    signal.addEventListener('abort', () => gsap.ticker.remove(tick));
}

/** Sets inline styles until the signal aborts, then puts back whatever inline values they replaced. */
export function styleUntil(signal: AbortSignal, el: HTMLElement, styles: Record<string, string>) {
    const hadStyle = el.hasAttribute('style');

    const previous = Object.keys(styles).map(
        (property) => [property, el.style.getPropertyValue(property), el.style.getPropertyPriority(property)] as const,
    );

    for (const [property, value] of Object.entries(styles)) el.style.setProperty(property, value);

    signal.addEventListener('abort', () => {
        for (const [property, value, priority] of previous) {
            if (value) el.style.setProperty(property, value, priority);
            else el.style.removeProperty(property);
        }

        if (!hadStyle && !el.style.length) el.removeAttribute('style');
    });
}

export const GOLD = '#f6c177';

export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export const random = (min: number, max: number) => min + Math.random() * (max - min);
