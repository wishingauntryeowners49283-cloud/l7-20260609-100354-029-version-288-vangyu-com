(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      document.body.classList.toggle('nav-open', nav.classList.contains('is-open'));
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    if (!slides.length) {
      return;
    }

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
        schedule();
      });
    });

    show(0);
    schedule();
  }

  function setupSearch() {
    var input = document.querySelector('[data-movie-search]');

    if (!input) {
      return;
    }

    var items = Array.prototype.slice.call(document.querySelectorAll('[data-search]'));

    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();

      items.forEach(function (item) {
        var source = (item.getAttribute('data-search') || '').toLowerCase();
        item.classList.toggle('is-hidden-by-search', value && source.indexOf(value) === -1);
      });
    });
  }

  function setPlayerMessage(shell, text) {
    var message = shell.querySelector('[data-player-message]');

    if (message) {
      message.textContent = text || '';
    }
  }

  function startVideo(shell) {
    var video = shell.querySelector('video[data-src]');

    if (!video || shell.getAttribute('data-player-ready') === 'true') {
      if (video) {
        video.play().catch(function () {});
      }
      return;
    }

    var source = video.getAttribute('data-src');

    if (!source) {
      setPlayerMessage(shell, '播放源暂不可用');
      return;
    }

    shell.setAttribute('data-player-ready', 'true');
    shell.classList.add('is-playing');
    setPlayerMessage(shell, '正在加载播放源');

    function playNow() {
      video.play().then(function () {
        setPlayerMessage(shell, '');
      }).catch(function () {
        setPlayerMessage(shell, '浏览器已拦截自动播放，请再次点击播放按钮');
      });
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', playNow, { once: true });
      video.load();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, playNow);
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setPlayerMessage(shell, '播放加载异常，请刷新页面或稍后重试');
        }
      });
      shell._hls = hls;
      return;
    }

    video.src = source;
    video.addEventListener('loadedmetadata', playNow, { once: true });
    video.load();
  }

  function setupPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));

    shells.forEach(function (shell) {
      var startButton = shell.querySelector('[data-player-start]');
      var video = shell.querySelector('video');

      if (startButton) {
        startButton.addEventListener('click', function () {
          startVideo(shell);
        });
      }

      if (video) {
        video.addEventListener('click', function () {
          if (video.paused) {
            startVideo(shell);
          }
        });
        video.addEventListener('play', function () {
          shell.classList.add('is-playing');
        });
      }
    });
  }

  ready(function () {
    setupNavigation();
    setupHero();
    setupSearch();
    setupPlayers();
  });
}());
