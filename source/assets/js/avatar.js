(async function () {
  const response = await fetch('https://avatar.090909.top/avatar.json');
  const map = await response.json();

  const rules = Object.entries(map)
    .map(([key, val]) => `img[src="${key}"]\n{\n  content: url("${val}");\n}`)
    .join('\n');

  const style = document.createElement('style');
  style.textContent = rules;
  document.head.appendChild(style);
})();
