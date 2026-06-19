(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");

    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("open");
      });
    }

    document.querySelectorAll("[data-hero]").forEach(function (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
      var index = 0;
      var timer = null;

      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("active", dotIndex === index);
        });
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
          timer = null;
        }
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-slide")) || 0);
          start();
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    });

    document.querySelectorAll(".catalog-panel").forEach(function (panel) {
      var input = panel.querySelector(".catalog-search");
      var cards = Array.prototype.slice.call(panel.querySelectorAll(".movie-card, .ranking-row"));
      var chips = Array.prototype.slice.call(panel.querySelectorAll(".filter-chip"));
      var filterType = "all";
      var filterValue = "all";

      function normalize(value) {
        return String(value || "").toLowerCase().trim();
      }

      function matchesCard(card, query) {
        var text = normalize(card.getAttribute("data-search"));
        var passesQuery = !query || text.indexOf(query) !== -1;
        var passesFilter = true;

        if (filterType !== "all") {
          var cardValue = normalize(card.getAttribute("data-" + filterType));
          passesFilter = cardValue.indexOf(normalize(filterValue)) !== -1;
        }

        return passesQuery && passesFilter;
      }

      function apply() {
        var query = input ? normalize(input.value) : "";
        cards.forEach(function (card) {
          card.classList.toggle("hidden", !matchesCard(card, query));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (item) {
            item.classList.remove("active");
          });
          chip.classList.add("active");
          filterType = chip.getAttribute("data-filter-type") || "all";
          filterValue = chip.getAttribute("data-filter-value") || "all";
          apply();
        });
      });
    });
  });
})();
