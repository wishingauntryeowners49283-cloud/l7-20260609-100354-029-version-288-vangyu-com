(function () {
  function initPlayer(shell) {
    if (!shell || shell.getAttribute('data-initialized') === 'true') {
      return;
    }

    var video = shell.querySelector('video');
    var source = shell.getAttribute('data-src');
    if (!video || !source) {
      return;
    }

    shell.setAttribute('data-initialized', 'true');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      shell._hls = hls;
    } else {
      video.src = source;
    }

    shell.classList.add('is-ready');
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        video.controls = true;
      });
    }
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-player-button]');
    if (!button) {
      return;
    }
    var shell = button.closest('[data-player]');
    initPlayer(shell);
  });
})();
