(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-site-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('open');
        });
    }

    function initHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5600);
    }

    function getQueryValue(name) {
        try {
            var params = new URLSearchParams(window.location.search);
            return params.get(name) || '';
        } catch (err) {
            return '';
        }
    }

    function initFilters() {
        var search = document.querySelector('[data-site-search]');
        var list = document.querySelector('[data-search-list]');
        if (!list) {
            return;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        var filters = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
        var empty = document.querySelector('[data-empty-state]');
        if (search && !search.value) {
            search.value = getQueryValue('q');
        }
        function textOf(card) {
            return [
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags')
            ].join(' ').toLowerCase();
        }
        function apply() {
            var keyword = search ? search.value.trim().toLowerCase() : '';
            var visible = 0;
            cards.forEach(function (card) {
                var matched = !keyword || textOf(card).indexOf(keyword) !== -1;
                filters.forEach(function (select) {
                    var value = select.value;
                    var key = select.getAttribute('data-filter');
                    if (value && card.getAttribute('data-' + key) !== value) {
                        matched = false;
                    }
                });
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('show', visible === 0);
            }
        }
        if (search) {
            search.addEventListener('input', apply);
        }
        filters.forEach(function (select) {
            select.addEventListener('change', apply);
        });
        apply();
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-video-player]'));
        players.forEach(function (box) {
            var video = box.querySelector('video');
            var button = box.querySelector('[data-video-play]');
            var source = box.getAttribute('data-m3u8');
            var loaded = false;
            var hls = null;
            if (!video || !source) {
                return;
            }
            function start() {
                if (!loaded) {
                    loaded = true;
                    if (window.Hls && window.Hls.isSupported()) {
                        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                        hls.loadSource(source);
                        hls.attachMedia(video);
                        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            video.play().catch(function () {});
                        });
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = source;
                        video.addEventListener('loadedmetadata', function () {
                            video.play().catch(function () {});
                        }, { once: true });
                    } else {
                        video.src = source;
                        video.play().catch(function () {});
                    }
                } else {
                    video.play().catch(function () {});
                }
                box.classList.add('is-playing');
            }
            if (button) {
                button.addEventListener('click', start);
            }
            video.addEventListener('play', function () {
                box.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (!video.ended) {
                    box.classList.remove('is-playing');
                }
            });
            video.addEventListener('click', function () {
                if (video.paused) {
                    start();
                } else {
                    video.pause();
                }
            });
            window.addEventListener('beforeunload', function () {
                if (hls && hls.destroy) {
                    hls.destroy();
                }
            });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayers();
    });
})();
