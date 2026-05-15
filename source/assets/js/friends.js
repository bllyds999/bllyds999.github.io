async function loadFriends() {
  const container = document.querySelector('#friends');
  if (!container || container.children.length > 0) return;

  const response = await fetch('/friends');
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const firstFlinkList = doc.querySelector('.flink .flink-list');
  if (!firstFlinkList) return;
  const linkItems = firstFlinkList.querySelectorAll('.flink-list-item a');
  const friendList = Array.from(linkItems)
    .map(a => ({ name: a.title, href: a.href }))
    .filter(f => f.name && f.href && f.href !== '#');

  if (friendList.length === 0) return;

  const count = window.innerWidth > 768 ? 6 : 3;
  const shuffled = friendList.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  selected.forEach((f, i) => {
    if (i > 0) {
      container.appendChild(document.createTextNode(' '));
    }
    const span = document.createElement('span');
    const a = document.createElement('a');
    a.href = f.href;
    a.textContent = f.name;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    span.appendChild(a);
    container.appendChild(span);
  });
}

document.addEventListener('pjax:complete', loadFriends);
loadFriends();
