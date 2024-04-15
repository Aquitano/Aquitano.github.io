const WATCH_CLASS = 'i-v';
const FADE = ['is-visible'];

let elements: NodeListOf<Element> = document.querySelectorAll(`.${WATCH_CLASS}`);

function getMutationObserver(): typeof IntersectionObserver | null {
    return window.IntersectionObserver || null;
}

function isObserverSupported(): boolean {
    return !!getMutationObserver();
}

function aos() {
    if (isObserverSupported()) {
        const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(...FADE);
                    observer.unobserve(entry.target);

                    setTimeout(() => {
                        entry.target.addEventListener(
                            'animationend',
                            () => {
                                entry.target.classList.remove(...FADE, ...['will-change', 'i-v']);
                            },
                            { once: true },
                        );
                    }, 500);
                }
            });
        };

        const observerOptions: IntersectionObserverInit = {
            root: null,
            threshold: 0.1, // at least 10% of the target is visible
        };

        const observer: IntersectionObserver = new IntersectionObserver(handleIntersection, observerOptions);

        elements.forEach((element) => {
            observer.observe(element);
            element.classList.add('will-change');
        });
    } else {
        elements.forEach((element) => {
            element.classList.remove(WATCH_CLASS);
        });
    }
}
aos();

document.addEventListener('astro:after-swap', () => {
    elements = document.querySelectorAll(`.${WATCH_CLASS}`);
    aos();
});
