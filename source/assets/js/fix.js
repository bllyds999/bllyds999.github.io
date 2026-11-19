(async function () {
  const currentPath = window.location.pathname;

  if (!currentPath.endsWith('/index.html')) return;

  const cleanPath = currentPath.slice(0, -'index.html'.length) || '/';

  try {
    const response = await fetch(cleanPath, { method: 'HEAD' });
    if (response.ok) {
      window.location.replace(cleanPath);
    }
  } catch (e) {}
})();
