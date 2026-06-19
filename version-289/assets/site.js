document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
  var prev = document.querySelector("[data-hero-prev]");
  var next = document.querySelector("[data-hero-next]");
  var activeIndex = 0;
  var heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === activeIndex);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("is-active", i === activeIndex);
    });
  }

  function startHeroTimer() {
    if (slides.length < 2) {
      return;
    }
    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function () {
      showSlide(activeIndex + 1);
    }, 5200);
  }

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(activeIndex - 1);
      startHeroTimer();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(activeIndex + 1);
      startHeroTimer();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
      startHeroTimer();
    });
  });

  showSlide(0);
  startHeroTimer();

  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
  var searchInput = document.querySelector("[data-search-input]");
  var regionSelect = document.querySelector("[data-filter-region]");
  var yearSelect = document.querySelector("[data-filter-year]");
  var categorySelect = document.querySelector("[data-filter-category]");
  var countNode = document.querySelector("[data-result-count]");

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    var current = select.value;
    values.forEach(function (value) {
      if (!value) {
        return;
      }
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
    select.value = current;
  }

  if (cards.length) {
    var regions = Array.from(new Set(cards.map(function (card) {
      return card.getAttribute("data-region") || "";
    }))).filter(Boolean).sort();
    var years = Array.from(new Set(cards.map(function (card) {
      return card.getAttribute("data-year") || "";
    }))).filter(Boolean).sort(function (a, b) {
      return Number(b) - Number(a);
    });
    fillSelect(regionSelect, regions);
    fillSelect(yearSelect, years);
  }

  function readQuery() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    if (query && searchInput) {
      searchInput.value = query;
    }
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }
    var q = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var region = regionSelect ? regionSelect.value : "";
    var year = yearSelect ? yearSelect.value : "";
    var category = categorySelect ? categorySelect.value : "";
    var visible = 0;

    cards.forEach(function (card) {
      var matchesText = !q || (card.getAttribute("data-search") || "").toLowerCase().indexOf(q) !== -1;
      var matchesRegion = !region || card.getAttribute("data-region") === region;
      var matchesYear = !year || card.getAttribute("data-year") === year;
      var matchesCategory = !category || card.getAttribute("data-category") === category;
      var isVisible = matchesText && matchesRegion && matchesYear && matchesCategory;
      card.classList.toggle("is-hidden-card", !isVisible);
      if (isVisible) {
        visible += 1;
      }
    });

    if (countNode) {
      countNode.textContent = String(visible);
    }
  }

  [searchInput, regionSelect, yearSelect, categorySelect].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });

  readQuery();
  applyFilters();
});
