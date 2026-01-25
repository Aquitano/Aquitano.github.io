/**
 * Animates a CLI command with a typing effect
 * @param selector - CSS selector for the command element
 * @param delay - Delay before starting the typing animation (in ms)
 * @param charDelay - Delay between each character (in ms)
 */
export function animateCliTyping(selector: string, delay: number = 100, charDelay: number = 50): void {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;

    const originalText = element.textContent || '';
    element.textContent = '';
    element.style.opacity = '1';

    originalText.split('').forEach((char, index) => {
        setTimeout(
            () => {
                element.textContent += char;
            },
            charDelay * index + delay,
        );
    });
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
export const getReducedMotionMQL = (): MediaQueryList | null => {
    if (typeof globalThis.matchMedia !== 'function') {
        return null;
    }
    return globalThis.matchMedia(REDUCED_MOTION_QUERY);
};

export const getMotionPreference = (): boolean => {
    const mql = getReducedMotionMQL();
    return mql ? !mql.matches : true;
};
