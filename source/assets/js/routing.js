(async function () {
  const container = document.querySelector('#error-content');
  if (!container) return;

  const currentPath = window.location.pathname;
  if (currentPath === '/404' || currentPath === '/404.html') return;

  await tryRoute(currentPath);
})();

async function tryRoute(targetPath) {
  try {
    const response = await fetch('/sitemap.txt');
    if (!response.ok) return;

    const text = await response.text();
    const urls = text.split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    if (urls.length === 0) return;

    const sitemapPaths = urls.map(url => {
      try {
        return new URL(url).pathname;
      } catch {
        return url;
      }
    });

    const bestPath = findBestMatch(targetPath, sitemapPaths);
    if (!bestPath) return;

    const bestIndex = sitemapPaths.indexOf(bestPath);
    const bestUrl = urls[bestIndex];

    btf.snackbarShow('未找到页面，五秒后跳转至正确路径……');

    setTimeout(() => {
      window.location.href = bestUrl;
    }, 5000);
  } catch (e) {}
}

window.error_location = async function (wrongPath) {
  if (!wrongPath || typeof wrongPath !== 'string') return;
  await tryRoute(wrongPath);
};

function findBestMatch(target, candidates) {
  const targetSegs = decodeURIComponent(target)
    .toLowerCase()
    .split('/')
    .filter(Boolean);

  let bestScore = Infinity;
  let bestCandidate = candidates[0];

  for (const candidate of candidates) {
    const candSegs = decodeURIComponent(candidate)
      .toLowerCase()
      .split('/')
      .filter(Boolean);

    const minLen = Math.min(targetSegs.length, candSegs.length);
    let totalDist = 0;
    let totalLen = 0;

    for (let i = 0; i < minLen; i++) {
      const d = levenshtein(targetSegs[i], candSegs[i]);
      totalDist += d;
      totalLen += Math.max(targetSegs[i].length, candSegs[i].length);
    }

    const extraSegs = Math.abs(targetSegs.length - candSegs.length);
    const penalty = extraSegs * 3;
    totalDist += penalty;
    totalLen += penalty;

    const score = totalLen > 0 ? totalDist / totalLen : 0;

    if (score < bestScore) {
      bestScore = score;
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}

function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  let curr = new Array(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost
      );
    }
    [prev, curr] = [curr, prev];
  }

  return prev[n];
}
