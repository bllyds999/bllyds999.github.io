(async function () {
  const container = document.querySelector('#saying');
  if (!container) return;

  const response = await fetch('https://saying.090909.top/saying.json');
  const data = await response.json();
  const sayings = data.saying;
  if (!sayings || sayings.length === 0) return;

  const randomIndex = Math.floor(Math.random() * sayings.length);
  const saying = sayings[randomIndex];

  const p = document.createElement('p');
  p.innerHTML = saying.split('\n').map(s => s.trim()).filter(Boolean).join('<br>');
  container.appendChild(p);
})();
