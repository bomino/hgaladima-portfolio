/**
 * Reveal-on-scroll: adds .is-visible to any .reveal element once it enters
 * the viewport. Respects prefers-reduced-motion — when set, everything is
 * immediately marked visible so nothing animates in.
 */
(function () {
    'use strict';

    var prefersReducedMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        elements.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05
    });

    elements.forEach(function (el) { observer.observe(el); });
})();
