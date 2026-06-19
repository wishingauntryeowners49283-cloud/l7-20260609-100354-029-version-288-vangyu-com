(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-mobile-panel]");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            panel.classList.toggle("is-open");
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        if (slides.length < 2) {
            return;
        }
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            slides[index].classList.remove("is-active");
            index = (nextIndex + slides.length) % slides.length;
            slides[index].classList.add("is-active");
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                start();
            });
        }
        start();
    }

    function initSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
        if (!inputs.length || !cards.length) {
            return;
        }
        var currentQuery = "";
        var currentFilter = "";

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function apply() {
            cards.forEach(function (card) {
                var text = normalize(card.getAttribute("data-filter-text") || card.textContent);
                var matchesQuery = !currentQuery || text.indexOf(currentQuery) !== -1;
                var matchesFilter = !currentFilter || text.indexOf(currentFilter) !== -1;
                card.classList.toggle("is-hidden", !(matchesQuery && matchesFilter));
            });
        }

        inputs.forEach(function (input) {
            input.addEventListener("input", function () {
                currentQuery = normalize(input.value);
                inputs.forEach(function (other) {
                    if (other !== input) {
                        other.value = input.value;
                    }
                });
                apply();
            });
        });

        Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]")).forEach(function (button) {
            button.addEventListener("click", function () {
                Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]")).forEach(function (item) {
                    item.classList.remove("is-active");
                });
                button.classList.add("is-active");
                currentFilter = normalize(button.getAttribute("data-filter-value"));
                apply();
            });
        });
    }

    window.initializePlayer = function (source) {
        var video = document.querySelector("[data-video-player]");
        var button = document.querySelector("[data-play-button]");
        var hls = null;
        var attached = false;

        if (!video || !button || !source) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function start() {
            attach();
            button.classList.add("is-hidden");
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(function () {
                    button.classList.remove("is-hidden");
                });
            }
        }

        button.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (video.paused) {
                start();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    };

    ready(function () {
        initMenu();
        initHero();
        initSearch();
    });
})();
