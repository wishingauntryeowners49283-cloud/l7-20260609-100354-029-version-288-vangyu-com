(function () {
  var toggle = document.querySelector('.mobile-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('.poster-image').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-missing');
    }, { once: true });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    restart();
  }

  var searchInput = document.getElementById('movie-search');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var activeFilter = 'all';

  function runFilter() {
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var items = Array.prototype.slice.call(document.querySelectorAll('.searchable-list .movie-card, .searchable-list .horizontal-card'));

    items.forEach(function (item) {
      var text = (item.getAttribute('data-search') || '').toLowerCase();
      var category = item.getAttribute('data-category') || '';
      var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
      var matchedCategory = activeFilter === 'all' || category === activeFilter;
      item.classList.toggle('is-hidden', !(matchedKeyword && matchedCategory));
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', runFilter);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.getAttribute('data-filter') || 'all';
      filterButtons.forEach(function (entry) {
        entry.classList.toggle('active', entry === button);
      });
      runFilter();
    });
  });

  document.querySelectorAll('.player-shell').forEach(function (shell) {
    var video = shell.querySelector('.video-player');
    var button = shell.querySelector('.video-play-button');

    if (!video) {
      return;
    }

    var src = video.getAttribute('data-video-src');
    var attached = false;

    function attachVideo() {
      if (!src || attached) {
        return;
      }

      attached = true;

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
      } else {
        video.src = src;
      }
    }

    function playVideo() {
      attachVideo();
      var action = video.play();

      if (action && typeof action.catch === 'function') {
        action.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', function () {
        playVideo();
      });
    }

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('hidden');
      }
    });

    video.addEventListener('click', function () {
      attachVideo();
    });
  });
})();
