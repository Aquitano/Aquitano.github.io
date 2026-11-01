import { EASE_OUT_STRONG, styleUntil } from './stage';

type LedgeToy = {
    /** Names what pressing the toy does. */
    label: string;
    toy: HTMLElement;
    /** Answers the press. */
    note: string;
    still: boolean;
    onPress: () => void;
};

/** Stands a toy on the hero's divider line that can be pressed once. Returns false when the page has no ledge. */
export function placeOnLedge(signal: AbortSignal, { label, toy, note, still, onPress }: LedgeToy) {
    const ledge = document.querySelector<HTMLElement>('[data-hero-ledge]');

    if (!ledge) return false;

    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    Object.assign(button.style, {
        position: 'absolute',
        bottom: 'calc(100% + 1px)',
        left: '56%',
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        cursor: 'pointer',
    });
    button.append(toy);

    const status = document.createElement('span');
    status.setAttribute('role', 'status');
    status.className = 'meta text-accent';
    Object.assign(status.style, {
        position: 'absolute',
        whiteSpace: 'nowrap',
        bottom: 'calc(100% + 36px)',
        left: 'calc(56% + 22px)',
        translate: '-50% 0',
    });

    styleUntil(signal, ledge, { position: 'relative' });
    ledge.append(button, status);
    signal.addEventListener('abort', () => {
        button.remove();
        status.remove();
    });

    const noteIn = still ? { opacity: 0 } : { opacity: 0, transform: 'translateY(8px)' };

    button.addEventListener(
        'click',
        () => {
            // aria-disabled rather than disabled, which would drop keyboard focus to the page.
            button.setAttribute('aria-disabled', 'true');
            button.style.cursor = 'default';
            onPress();
            status.textContent = note;
            status.animate([noteIn, { opacity: 1, transform: 'none' }], {
                duration: still ? 200 : 600,
                delay: 150,
                easing: EASE_OUT_STRONG,
                fill: 'backwards',
            });
        },
        { once: true, signal },
    );

    return true;
}
