async function tagsCloud() {
  document.querySelectorAll('.card-tag-cloud a').forEach(a => {
    let style = a.getAttribute('style');
    let match = style.match(/font-size:\s*([\d.]+)em/);
    if (match) {
      let oldSize = parseFloat(match[1]);
      let newSize = (oldSize * 0.8).toFixed(2);
      a.style.fontSize = newSize + 'em';
    }
  })
};


document.addEventListener('pjax:complete', tagsCloud);
tagsCloud();
