(() => {
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');

  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  let heroIndex = 0;

  function showHeroSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === heroIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === heroIndex);
      dot.setAttribute('aria-pressed', dotIndex === heroIndex ? 'true' : 'false');
    });
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => showHeroSlide(dotIndex));
  });

  if (slides.length > 1) {
    window.setInterval(() => showHeroSlide(heroIndex + 1), 5600);
  }

  document.querySelectorAll('[data-filter-panel]').forEach((panel) => {
    const scope = panel.getAttribute('data-filter-panel') || 'body';
    const target = document.querySelector(scope);
    const cards = target ? Array.from(target.querySelectorAll('[data-movie-card]')) : [];
    const search = panel.querySelector('[data-filter-search]');
    const year = panel.querySelector('[data-filter-year]');
    const region = panel.querySelector('[data-filter-region]');
    const type = panel.querySelector('[data-filter-type]');

    function applyFilter() {
      const query = (search?.value || '').trim().toLowerCase();
      const selectedYear = year?.value || '';
      const selectedRegion = region?.value || '';
      const selectedType = type?.value || '';

      cards.forEach((card) => {
        const text = [
          card.dataset.title,
          card.dataset.genre,
          card.dataset.tags,
          card.dataset.region,
          card.dataset.type
        ].join(' ').toLowerCase();
        const matchedQuery = !query || text.includes(query);
        const matchedYear = !selectedYear || card.dataset.year === selectedYear;
        const matchedRegion = !selectedRegion || card.dataset.region === selectedRegion;
        const matchedType = !selectedType || card.dataset.type === selectedType;
        card.classList.toggle('hidden', !(matchedQuery && matchedYear && matchedRegion && matchedType));
      });
    }

    [search, year, region, type].forEach((control) => {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });
  });

  const video = document.querySelector('[data-video-url]');
  const playButton = document.querySelector('[data-player-button]');
  let hlsInstance = null;
  let playerReady = false;

  function preparePlayer() {
    if (!video || playerReady) {
      return;
    }

    const streamUrl = video.getAttribute('data-video-url');

    if (!streamUrl) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hlsInstance.loadSource(streamUrl);
      hlsInstance.attachMedia(video);
      playerReady = true;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      playerReady = true;
    }
  }

  function playMovie() {
    if (!video) {
      return;
    }

    preparePlayer();

    const result = video.play();

    if (result && typeof result.then === 'function') {
      result.then(() => {
        if (playButton) {
          playButton.classList.add('is-hidden');
        }
      }).catch(() => {});
    } else if (playButton) {
      playButton.classList.add('is-hidden');
    }
  }

  if (playButton) {
    playButton.addEventListener('click', playMovie);
  }

  if (video) {
    video.addEventListener('click', () => {
      if (video.paused) {
        playMovie();
      }
    });

    video.addEventListener('play', () => {
      if (playButton) {
        playButton.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', () => {
      if (playButton && video.currentTime === 0) {
        playButton.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('beforeunload', () => {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
