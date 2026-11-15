import { EASE_OUT_STRONG, fadeOutOnAbort, styleUntil } from './stage';

type LedgeToy = {
    label: string;
    toy: HTMLElement;
    note: string;
    still: boolean;
    onLoad: boolean;
    onPress: () => void;
};

const TOY_PX = 44;

/** Stands a toy on the hero's divider line that can be pressed once. Returns false when the page has no ledge. */
export function placeOnLedge(signal: AbortSignal, { label, toy, note, still, onLoad, onPress }: LedgeToy) {
    const ledge = document.querySelector<HTMLElement>('[data-hero-ledge]');

    if (!ledge) return false;

    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', label);
    Object.assign(button.style, {
        position: 'absolute',
        bottom: 'calc(100% + 1px)',
        right: '0',
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
        width: `${TOY_PX}px`,
        height: `${TOY_PX}px`,
        cursor: 'pointer',
    });
    button.append(toy);

    const status = document.createElement('span');
    status.setAttribute('role', 'status');
    status.className = 'meta text-accent';
    // Beside the toy rather than above it, where a phone's surname leaves no room.
    Object.assign(status.style, {
        position: 'absolute',
        whiteSpace: 'nowrap',
        bottom: 'calc(100% + 8px)',
        right: `${TOY_PX + 4}px`,
    });

    styleUntil(signal, ledge, { position: 'relative' });
    ledge.append(button, status);
    fadeOutOnAbort(signal, button, status);

    button.animate(
        [still ? { opacity: 0 } : { opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
        {
            duration: 600,
            delay: onLoad ? 1200 : 0,
            easing: EASE_OUT_STRONG,
            fill: 'backwards',
        },
    );

    const noteIn = still ? { opacity: 0 } : { opacity: 0, transform: 'translateX(8px)' };

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
