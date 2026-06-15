(function () {
  if (window._musicPlayer) return;

  let playlist = [];

  function playRandom() {
    if (playlist.length === 0) return;
    const index = Math.floor(Math.random() * playlist.length);
    const audio = new Audio(playlist[index]);
    audio.volume = 0.3;
    audio.play();
    audio.addEventListener('ended', () => playRandom());
  }

  async function init() {
    try {
      const response = await fetch('https://music.090909.top/music.json');
      const data = await response.json();
      playlist = data.music || [];
      if (playlist.length === 0) return;
      window.addEventListener('click', playRandom, { once: true });
    } catch (e) {}
  }

  window._musicPlayer = true;
  init();
})();
