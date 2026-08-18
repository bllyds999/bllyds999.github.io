function patchWalineLabel() {
  const wrap = document.querySelector('div#waline-wrap');
  if (!wrap) return;

  const item3 = wrap.querySelector('div.wl-header.item3');
  if (!item3) return;

  const items = item3.querySelectorAll('.wl-header-item');
  const target = items[2];
  if (!target) return;

  const label = target.querySelector('label[for="wl-link"]');
  if (!label) return;

  label.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent = '网站（可选）';
    }
  });
}

const observer = new MutationObserver(() => {
  patchWalineLabel();
});

observer.observe(document.body, { childList: true, subtree: true });
patchWalineLabel();
