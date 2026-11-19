async function stroll() {
  const response = await fetch('/archives');
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const linkItems = doc.querySelectorAll('.article-sort-item-title');
  const links = Array.from(linkItems).map(a => a.href).filter(href => href && href !== '#');
  
  if (links.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * links.length);
  const randomLink = links[randomIndex];
  
  window.location.href = randomLink;
}