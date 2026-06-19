(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    ready(function () {
        var toggle = document.querySelector('.nav-toggle');
        var nav = document.querySelector('.site-nav');

        if (toggle && nav) {
            toggle.addEventListener('click', function () {
                var open = nav.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }

        document.querySelectorAll('.search-form').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = form.querySelector('input[name="q"]');
                var query = input ? input.value.trim() : '';
                if (query) {
                    event.preventDefault();
                    window.location.href = './search.html?q=' + encodeURIComponent(query);
                }
            });
        });

        var slider = document.querySelector('[data-hero-slider]');
        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
            var current = 0;

            function show(index) {
                if (!slides.length) {
                    return;
                }
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle('is-active', slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle('is-active', dotIndex === current);
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    show(Number(dot.getAttribute('data-slide-to')) || 0);
                });
            });

            setInterval(function () {
                show(current + 1);
            }, 5600);
        }

        var filterInput = document.querySelector('.page-filter');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var emptyState = document.querySelector('.empty-state');

        if (filterInput && cards.length) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');
            if (query) {
                filterInput.value = query;
            }

            function filterCards() {
                var term = normalize(filterInput.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute('data-title'),
                        card.getAttribute('data-tags'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-category')
                    ].join(' '));
                    var matched = !term || haystack.indexOf(term) !== -1;
                    card.classList.toggle('is-hidden', !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (emptyState) {
                    emptyState.hidden = visible !== 0;
                }
            }

            filterInput.addEventListener('input', filterCards);
            filterCards();
        }
    });
})();
