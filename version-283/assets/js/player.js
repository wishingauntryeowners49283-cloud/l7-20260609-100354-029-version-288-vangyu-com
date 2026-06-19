(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function bindPlayer(shell) {
    var video = shell.querySelector("video");
    var button = shell.querySelector("[data-play-button]");
    var url = video ? video.getAttribute("data-video-url") : "";
    var loaded = false;
    var instance = null;

    function loadVideo() {
      if (!video || !url || loaded) {
        return;
      }
      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        instance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30
        });
        instance.loadSource(url);
        instance.attachMedia(video);
      } else {
        video.src = url;
      }
    }

    function begin() {
      if (!video) {
        return;
      }
      loadVideo();
      video.controls = true;
      if (button) {
        button.classList.add("is-hidden");
      }
      var playAction = video.play();
      if (playAction && typeof playAction.catch === "function") {
        playAction.catch(function () {
          if (button) {
            button.classList.remove("is-hidden");
          }
        });
      }
    }

    if (button) {
      button.addEventListener("click", begin);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (video.paused) {
          begin();
        }
      });
      video.addEventListener("play", function () {
        if (button) {
          button.classList.add("is-hidden");
        }
      });
      video.addEventListener("pause", function () {
        if (button && video.currentTime === 0) {
          button.classList.remove("is-hidden");
        }
      });
      window.addEventListener("pagehide", function () {
        if (instance) {
          instance.destroy();
          instance = null;
        }
      });
    }
  }

  ready(function () {
    document.querySelectorAll("[data-video-player]").forEach(bindPlayer);
  });
})();
