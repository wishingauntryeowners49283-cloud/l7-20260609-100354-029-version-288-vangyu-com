(function () {
  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var links = document.querySelector('[data-nav-links]');
    if (!toggle || !links) {
      return;
    }
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
  }

  function setupHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    if (slides.length <= 1) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    start();
  }

  function setupJumpSearch() {
    var forms = document.querySelectorAll('[data-jump-search-form]');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var target = form.getAttribute('action') || 'search.html';
        window.location.href = query ? target + '?q=' + encodeURIComponent(query) : target;
      });
    });
  }

  function cardMatchesText(card, query) {
    if (!query) {
      return true;
    }
    var haystack = [
      card.getAttribute('data-title'),
      card.getAttribute('data-year'),
      card.getAttribute('data-region'),
      card.getAttribute('data-type'),
      card.getAttribute('data-genre'),
      card.textContent
    ].map(normalize).join(' ');
    return haystack.indexOf(query) !== -1;
  }

  function setupFilters() {
    var scopes = document.querySelectorAll('[data-filter-scope]');
    scopes.forEach(function (scope) {
      var cards = Array.prototype.slice.call(scope.parentElement.querySelectorAll('[data-card]'));
      var input = scope.querySelector('[data-card-search]');
      var count = scope.querySelector('[data-filter-count]');
      var yearButtons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-year]'));
      var selects = Array.prototype.slice.call(scope.querySelectorAll('[data-select-filter]'));
      var reset = scope.querySelector('[data-reset-filter]');
      var activeYear = 'all';

      function selectedValue(name) {
        var select = scope.querySelector('[data-select-filter="' + name + '"]');
        return select ? select.value : 'all';
      }

      function apply() {
        var query = normalize(input ? input.value : '');
        var region = selectedValue('region');
        var type = selectedValue('type');
        var yearSelect = selectedValue('year');
        var visible = 0;

        cards.forEach(function (card) {
          var match = cardMatchesText(card, query);
          if (activeYear !== 'all') {
            match = match && String(card.getAttribute('data-year')) === activeYear;
          }
          if (yearSelect !== 'all') {
            match = match && String(card.getAttribute('data-year')) === String(yearSelect);
          }
          if (region !== 'all') {
            match = match && String(card.getAttribute('data-region')) === region;
          }
          if (type !== 'all') {
            match = match && String(card.getAttribute('data-type')) === type;
          }
          card.classList.toggle('is-hidden', !match);
          if (match) {
            visible += 1;
          }
        });

        if (count) {
          count.textContent = '当前显示 ' + visible + ' 部影片';
        }
      }

      if (input) {
        input.addEventListener('input', apply);
      }

      yearButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          activeYear = button.getAttribute('data-filter-year') || 'all';
          yearButtons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
          });
          apply();
        });
      });

      selects.forEach(function (select) {
        select.addEventListener('change', apply);
      });

      if (reset) {
        reset.addEventListener('click', function () {
          if (input) {
            input.value = '';
          }
          selects.forEach(function (select) {
            select.value = 'all';
          });
          activeYear = 'all';
          yearButtons.forEach(function (button) {
            button.classList.toggle('is-active', button.getAttribute('data-filter-year') === 'all');
          });
          apply();
        });
      }

      var params = new URLSearchParams(window.location.search);
      var queryParam = params.get('q');
      if (queryParam && input) {
        input.value = queryParam;
      }
      apply();
    });
  }

  function setupScrollPlayer() {
    var triggers = document.querySelectorAll('[data-scroll-player]');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        var player = document.querySelector('[data-player]');
        if (player) {
          player.scrollIntoView({ behavior: 'smooth', block: 'center' });
          var button = player.querySelector('[data-player-button]');
          if (button) {
            button.focus();
          }
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNavigation();
    setupHeroCarousel();
    setupJumpSearch();
    setupFilters();
    setupScrollPlayer();
  });
})();
