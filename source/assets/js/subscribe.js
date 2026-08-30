(async () => {
  const response = await fetch('/friends');
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const linkItems = doc.querySelectorAll('.flink-list-item a');
  const links = Array.from(linkItems).map(item => item.href).filter(href => href && href !== '#');
  
  const linkCount = links.length;
  
  const cardInfoBtn = document.getElementById('card-info-btn');
  if (cardInfoBtn) {
    const spanElement = cardInfoBtn.querySelector('span');
    if (spanElement) {
      spanElement.textContent = `订阅我 ${linkCount}`;
    }
  }
})();