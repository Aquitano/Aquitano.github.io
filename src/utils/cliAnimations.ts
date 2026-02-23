// Store timeout IDs for each element to allow cleanup
const animationTimeouts = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>[]>();

/**
 * Animates a CLI command with a typing effect
 * @param selector - CSS selector for the command element
 * @param delay - Delay before starting the typing animation (in ms)
 * @param charDelay - Delay between each character (in ms)
 */
export function animateCliTyping(selector: string, delay: number = 100, charDelay: number = 50): void {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;

    // Check if animation is already running or has completed
    if (element.dataset.cliAnimating === 'true' || element.dataset.cliAnimated === 'true') {
        return;
    }

    // Clear any existing timeouts for this element
    const existingTimeouts = animationTimeouts.get(element);
    if (existingTimeouts) {
        existingTimeouts.forEach(clearTimeout);
    }

    // Store original text if not already stored
    const originalText = element.dataset.cliOriginal || element.textContent || '';
    if (!element.dataset.cliOriginal) {
        element.dataset.cliOriginal = originalText;
    }

    // Mark as animating
    element.dataset.cliAnimating = 'true';
    element.textContent = '';
    element.style.opacity = '1';

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const chars = originalText.split('');

    chars.forEach((char, index) => {
        const timeoutId = globalThis.setTimeout(
            () => {
                // Check if element still exists and animation wasn't cancelled
                if (element?.dataset.cliAnimating === 'true') {
                    element.textContent += char;

                    // Mark as completed when last character is added
                    if (index === chars.length - 1) {
                        element.dataset.cliAnimating = 'false';
                        element.dataset.cliAnimated = 'true';
                        animationTimeouts.delete(element);
                    }
                }
            },
            charDelay * index + delay,
        );
        timeouts.push(timeoutId);
    });

    animationTimeouts.set(element, timeouts);
}

/**
 * Resets the CLI typing animation state for an element
 * Useful when navigating away or when you want to replay the animation
 * @param selector - CSS selector for the command element
 */
export function resetCliTyping(selector: string): void {
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) return;

    // Clear any running timeouts
    const existingTimeouts = animationTimeouts.get(element);
    if (existingTimeouts) {
        existingTimeouts.forEach(clearTimeout);
        animationTimeouts.delete(element);
    }

    // Reset the element state
    delete element.dataset.cliAnimating;
    delete element.dataset.cliAnimated;

    // Restore original text if it exists
    if (element.dataset.cliOriginal) {
        element.textContent = element.dataset.cliOriginal;
    }
}

/**
 * Detects Safari browser (including iOS Safari).
 * Used to avoid CSS filter animations that Safari composites poorly.
 */
export const isSafari = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    return /safari/i.test(ua) && !/chrome|chromium|edg|opera|opr/i.test(ua);
};

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
