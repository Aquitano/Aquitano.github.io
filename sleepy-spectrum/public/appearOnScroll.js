('use strict');
(function (window, document) {
    let WATCH_CLASS = 'i-v';
    let IN_VIEWPORT_CLASS = 'in-viewport';
    let FADE = 'Fly-in-down';
    let elements = [];
    function hasClass(element, className) {
        if (element.classList) {
            return element.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
        }
    }
    function addClass(element, className) {
        return element.classList.add(className);
    }

    function storeElements() {
        elements = document.getElementsByClassName(WATCH_CLASS);
    }
    function update() {
        let viewportTop = window.scrollY || document.documentElement.scrollTop;
        let viewportBottom =
            viewportTop + (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        for (let i = 0, len = elements.length; i < len; i += 1) {
            let element = elements[i];
            if (true === isInViewport(element, scrollTop, viewportTop, viewportBottom)) {
                if (!hasClass(element, IN_VIEWPORT_CLASS)) {
                    console.log('in viewport');
                    addClass(element, FADE);
                }
            }
        }
    }
    function isInViewport(element, scrollTop, viewportTop, viewportBottom) {
        let elementRect = element.getBoundingClientRect();
        let elementTop = elementRect.top + scrollTop;
        let elementBottom = elementTop + element.offsetHeight;

        return !!(elementBottom >= viewportTop && elementTop < viewportBottom);
    }

    document.addEventListener('DOMContentLoaded', function (event) {
        if (document.readyState === 'interactive') {
            storeElements();
            console.log(elements);
            document.addEventListener('scroll', update);
            document.addEventListener('resize', update);
            update();
        }
    });
})(window, document);
