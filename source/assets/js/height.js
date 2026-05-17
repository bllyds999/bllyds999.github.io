function fillRecentPostItems() {
  const container = document.querySelector('.recent-post-items');
  if (!container) return;

  const items = container.querySelectorAll('.recent-post-item');
  const current = items.length;
  const target = 10;

  if (current >= target) return;

  const missing = target - current;
  for (let i = 0; i < missing; i++) {
    const div = document.createElement('div');
    div.className = 'recent-post-item';
    div.style.visibility = 'hidden';
    container.appendChild(div);
  }
}

document.addEventListener('pjax:complete', fillRecentPostItems);
fillRecentPostItems();
