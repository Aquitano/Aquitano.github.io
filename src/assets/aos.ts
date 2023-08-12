import { debounce, throttle } from 'lodash-es';

let callback = () => {
    /* Default empty function */
};

const defaultOptions = {
    offset: 120,
    delay: 0,
    easing: 'ease',
    duration: 400,
    disable: false,
    once: false,
    mirror: false,
    anchorPlacement: 'top-bottom',
    startEvent: 'DOMContentLoaded',
    animatedClassName: 'aos-animate',
    initClassName: 'aos-init',
    useClassNames: false,
    disableMutationObserver: false,
    throttleDelay: 99,
    debounceDelay: 50,
};
let options = { ...defaultOptions };

interface OffsetResult {
    top: number;
    left: number;
}

interface ElementData {
    node: HTMLElement;
    position?: {
        in: number;
        out?: number;
    };
    options?: {
        once: boolean | string;
        mirror: boolean | string;
        animatedClassNames: string[];
        id?: string;
    };
}

function containsAOSNode(elements: NodeList): boolean {
    return Array.from(elements).some((element) => {
        if (element instanceof HTMLElement && element.dataset.aos) return true;
        if (element.hasChildNodes() && containsAOSNode(element.childNodes)) return true;
        return false;
    });
}

function check(mutations: MutationRecord[]): void {
    if (mutations.some((mutation) => containsAOSNode(mutation.addedNodes) || containsAOSNode(mutation.removedNodes))) {
        callback();
    }
}

function getMutationObserver(): typeof MutationObserver | null {
    return window.MutationObserver || null;
}

function isSupported(): boolean {
    return !!getMutationObserver();
}

function ready(_e: any, cb: () => void): void {
    const observerInstance = new (getMutationObserver() as any)(check);
    callback = cb;
    observerInstance.observe(document.documentElement, {
        childList: true,
        subtree: true,
        removedNodes: true,
    });
}

const observer = {
    isSupported,
    ready,
};

const fullNameRe =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
const prefixRe =
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;
const fullNameMobileRe =
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
const prefixMobileRe =
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i;

const getUserAgent = (): string => navigator.userAgent || navigator.vendor || '';
const userAgent = getUserAgent();

const isMatch = (fullNameRe: RegExp, prefixRe: RegExp): boolean => {
    return fullNameRe.test(userAgent) || prefixRe.test(userAgent.substr(0, 4));
};

const isPhone = (): boolean => {
    return isMatch(fullNameRe, prefixRe);
};

const isMobile = (): boolean => {
    return isMatch(fullNameMobileRe, prefixMobileRe);
};

const isTablet = (): boolean => {
    return isMobile() && !isPhone();
};

const isIE11 = (): boolean => {
    return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
};

const elements = (): { node: HTMLElement }[] => {
    const elems = document.querySelectorAll('[data-aos]');
    return Array.from(elems).map((elem) => ({ node: elem as HTMLElement }));
};

const addClasses = (element: HTMLElement, classNames?: string[]): void => {
    classNames?.forEach((name) => element.classList.add(name));
};

const removeClasses = (element: HTMLElement, classNames?: string[]): void => {
    classNames?.forEach((name) => element.classList.remove(name));
};

const fireEvent = (eventName: string, detail: HTMLElement | string): boolean => {
    let event: CustomEvent;
    if (isIE11()) {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventName, true, true, { detail });
    } else {
        event = new CustomEvent(eventName, { detail });
    }
    return document.dispatchEvent(event);
};

const applyClasses = (
    elementData: { options: any; position: any; node: HTMLElement; animated?: boolean },
    yOffset: number,
): void => {
    const { options, position, node } = elementData;
    const removeAnimation = () => {
        if (elementData.animated) {
            removeClasses(node, options.animatedClassNames);
            fireEvent('aos:out', node);
            if (options.id) fireEvent(`aos:out:${options.id}`, node);
            elementData.animated = false;
        }
    };
    if (options.mirror && yOffset >= position.out && !options.once) {
        removeAnimation();
    } else if (yOffset >= position.in) {
        if (!elementData.animated) {
            addClasses(node, options.animatedClassNames);
            fireEvent('aos:in', node);
            if (options.id) fireEvent(`aos:in:${options.id}`, node);
            elementData.animated = true;
        }
    } else if (elementData.animated && !options.once) {
        removeAnimation();
    }
};

const handleScroll = (elements: any[]): void => {
    elements.forEach((element) => applyClasses(element, window.pageYOffset));
};

const getInlineOption = (element: HTMLElement, attrName: string, defaultValue?: any): boolean | string => {
    let attrValue = element.getAttribute(`data-aos-${attrName}`);
    if (attrValue !== null) {
        if (attrValue === 'true') return true;
        if (attrValue === 'false') return false;
    }
    return attrValue ?? defaultValue;
};

const offset = (element: HTMLElement): OffsetResult => {
    let left = 0,
        top = 0;
    while (element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
        left += element.offsetLeft - (element.tagName !== 'BODY' ? element.scrollLeft : 0);
        top += element.offsetTop - (element.tagName !== 'BODY' ? element.scrollTop : 0);
        element = element.offsetParent as HTMLElement;
    }
    return { top, left };
};

const getFinalElement = (element: HTMLElement, selector?: string): HTMLElement => {
    return (selector && document.querySelector(selector)) || element;
};

const getPositionIn = (element: HTMLElement, defaultOffset: number, defaultPlacement: string): number => {
    const windowHeight = window.innerHeight;
    const anchor = getInlineOption(element, 'anchor');
    const anchorPlacement = getInlineOption(element, 'anchor-placement') || defaultPlacement;
    const offsetValue = Number(getInlineOption(element, 'offset', anchorPlacement ? 0 : defaultOffset));
    const finalElement = getFinalElement(element, anchor as string);
    let position = offset(finalElement).top - windowHeight;

    switch (anchorPlacement) {
        case 'center-bottom':
            position += finalElement.offsetHeight / 2;
            break;
        case 'bottom-bottom':
            position += finalElement.offsetHeight;
            break;
        case 'top-center':
            position += windowHeight / 2;
            break;
        case 'center-center':
            position += windowHeight / 2 + finalElement.offsetHeight / 2;
            break;
        case 'bottom-center':
            position += windowHeight / 2 + finalElement.offsetHeight;
            break;
        case 'top-top':
            position += windowHeight;
            break;
        case 'bottom-top':
            position += windowHeight + finalElement.offsetHeight;
            break;
        case 'center-top':
            position += windowHeight + finalElement.offsetHeight / 2;
            break;
    }
    return position + offsetValue;
};

const getPositionOut = (element: HTMLElement, defaultOffset: number): number => {
    const anchor = getInlineOption(element, 'anchor');
    const offsetValue = getInlineOption(element, 'offset', defaultOffset);
    const finalElement = getFinalElement(element, anchor as string);
    return offset(finalElement).top + finalElement.offsetHeight - Number(offsetValue);
};

const prepare = (elements: ElementData[], config: typeof defaultOptions): ElementData[] => {
    return elements.map((elementData) => {
        const mirror = getInlineOption(elementData.node, 'mirror', config.mirror);
        const once = getInlineOption(elementData.node, 'once', config.once);
        const id = getInlineOption(elementData.node, 'id');
        const classNames = config.useClassNames && elementData.node.getAttribute('data-aos');
        const animatedClassNames = [config.animatedClassName]
            .concat(classNames ? classNames.split(' ') : [])
            .filter((name) => typeof name === 'string');

        if (config.initClassName) {
            elementData.node.classList.add(config.initClassName);
        }

        elementData.position = {
            in: getPositionIn(elementData.node, config.offset, config.anchorPlacement),
            out: mirror && getPositionOut(elementData.node, config.offset),
        };

        elementData.options = {
            once: once as boolean,
            mirror: mirror as boolean,
            animatedClassNames,
            id: id as string,
        };

        return elementData;
    });
};
let aosElements: ElementData[] = [];
let initialized = false;

const isBrowserNotSupported = (): boolean => !!document.all && !window.atob;

const initializeScroll = () => {
    aosElements = prepare(aosElements, options);
    handleScroll(aosElements);

    window.addEventListener(
        'scroll',
        throttle(() => {
            // @ts-expect-error
            handleScroll(aosElements, options.once);
        }, options.throttleDelay),
        { passive: true },
    );

    return aosElements;
};

const refresh = (force = false): void => {
    initialized = force ? true : initialized;
    if (initialized) {
        initializeScroll();
    }
};

const refreshHard = (): void => {
    aosElements = elements();
    if (isDisabled(options.disable) || isBrowserNotSupported()) {
        disable();
    } else {
        refresh();
    }
};

const disable = (): void => {
    aosElements.forEach((element) => {
        element.node.removeAttribute('data-aos');
        element.node.removeAttribute('data-aos-easing');
        element.node.removeAttribute('data-aos-duration');
        element.node.removeAttribute('data-aos-delay');
        if (options.initClassName) {
            element.node.classList.remove(options.initClassName);
        }
        if (options.animatedClassName) {
            element.node.classList.remove(options.animatedClassName);
        }
    });
};

const isDisabled = (disableOption: any): boolean => {
    return (
        disableOption === true ||
        (disableOption === 'mobile' && isMobile()) ||
        (disableOption === 'phone' && isPhone()) ||
        (disableOption === 'tablet' && isTablet()) ||
        (typeof disableOption === 'function' && disableOption())
    );
};

const init = (customOptions: Partial<typeof defaultOptions>) => {
    options = { ...options, ...customOptions };
    aosElements = elements();

    if (!options.disableMutationObserver && !observer.isSupported()) {
        console.info(`
            aos: MutationObserver is not supported on this browser,
            code mutations observing has been disabled.
            You may have to call "refreshHard()" by yourself.
        `);
        options.disableMutationObserver = true;
    }

    if (!options.disableMutationObserver) {
        observer.ready('[data-aos]', refreshHard);
    }

    if (isDisabled(options.disable) || isBrowserNotSupported()) {
        disable();
    } else {
        const body = document.querySelector('body');
        if (body) {
            body.setAttribute('data-aos-easing', options.easing);
            body.setAttribute('data-aos-duration', `${options.duration}`);
            body.setAttribute('data-aos-delay', `${options.delay}`);
        }

        if (['DOMContentLoaded', 'load'].indexOf(options.startEvent) === -1) {
            document.addEventListener(options.startEvent, () => {
                refresh(true);
            });
        } else {
            window.addEventListener('load', () => {
                refresh(true);
            });
        }

        if (options.startEvent === 'DOMContentLoaded' && ['complete', 'interactive'].includes(document.readyState)) {
            refresh(true);
        }

        window.addEventListener('resize', () => debounce(refresh, options.debounceDelay, { leading: true }));
        window.addEventListener('orientationchange', () => debounce(refresh, options.debounceDelay, { leading: true }));
    }

    return aosElements;
};

export default {
    init,
    refresh,
    refreshHard,
};
