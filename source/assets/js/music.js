(function() {
  let currentAudio = null;
  let isUserInteracted = false;

  function initMusic() {
    if (currentAudio) return;
    
    currentAudio = new Audio('/assets/media/馬鹿ふたり.mp3');
    currentAudio.loop = true;
    currentAudio.volume = 0.2;
    currentAudio.muted = true; 

    currentAudio.addEventListener('canplaythrough', () => {
      currentAudio.play()
        .catch(err => {
          document.addEventListener('click', function firstClick() {
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

    function handleUserInteraction() {
      if (!currentAudio || isUserInteracted) return;
      
      currentAudio.muted = false;
      currentAudio.volume = 0.2;
      isUserInteracted = true;
      
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    }
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusic);
  } else {
    initMusic();
  }
})();