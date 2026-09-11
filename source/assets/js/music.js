(function() {
  let currentAudio = null;
  let isUserInteracted = false;

  // 缓存 key，建议用一个不容易冲突的名字
  const MUSIC_MUTE_KEY = 'site_music_muted';

  // 检测是否已经被别人设置过“静音/无音乐”
  function isMusicMutedByCache() {
    try {
      return localStorage.getItem(MUSIC_MUTE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  // 提升到外层的用户交互处理函数
  function handleUserInteraction() {
    if (!currentAudio || isUserInteracted) return;

    // 如果已经被 musicMute() 设置过缓存，也不再取消静音
    if (isMusicMutedByCache()) {
      currentAudio.pause();
      return;
    }

    currentAudio.muted = false;
    currentAudio.volume = 0.2;
    isUserInteracted = true;

    document.removeEventListener('click', handleUserInteraction);
    document.removeEventListener('touchstart', handleUserInteraction);
    document.removeEventListener('keydown', handleUserInteraction);
  }

  // 对外暴露：设置缓存，后续不再播放音乐
  function musicMute() {
    try {
      localStorage.setItem(MUSIC_MUTE_KEY, '1');
    } catch (e) {}

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.muted = true;
      currentAudio = null;
    }

    // 移除之前可能绑定过的事件
    document.removeEventListener('click', handleUserInteraction);
    document.removeEventListener('touchstart', handleUserInteraction);
    document.removeEventListener('keydown', handleUserInteraction);
  }

  function initMusic() {
    // 如果检测到别人有这个缓存，则没有音乐
    if (isMusicMutedByCache()) {
      return;
    }

    if (currentAudio) return;

    currentAudio = new Audio('/assets/media/馬鹿ふたり.mp3');
    currentAudio.loop = true;
    currentAudio.volume = 0.2;
    currentAudio.muted = true;

    currentAudio.addEventListener('canplaythrough', () => {
      currentAudio.play()
        .catch(err => {
          document.addEventListener('click', function firstClick() {
            // 再次检查缓存，避免期间被 musicMute()
            if (isMusicMutedByCache()) return;
            currentAudio.play().catch(() => {});
            document.removeEventListener('click', firstClick);
          }, { once: true });
        });
    });

    if (currentAudio.readyState >= 3) {
      currentAudio.play().catch(() => {});
    } else {
      currentAudio.load();
    }

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
  }

  // 暴露到全局，方便别处调用
  window.musicMute = musicMute;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic);
  } else {
    initMusic();
  }
})();