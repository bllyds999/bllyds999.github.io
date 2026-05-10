---
title: Butterfly 目录折腾二传
date: 2026-04-10 18:31:37
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - Hexo
  - 前端脚本
  - 技术折腾
  - 个人网站
---

我之前不是跟大家说网站的目录有问题吗？

那个问题只需要一次刷新就好了，也就是说完全可以添加一个 JS 直接在用户端刷新页面：

```javascript
(function() {
  let refreshTimer = null;

  function waitForImages() {
    const images = Array.from(document.images);
    const pendingImages = images.filter(img => !img.complete);
    
    if (pendingImages.length === 0) {
      return Promise.resolve();
    }
    
    return Promise.all(
      pendingImages.map(img => new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true });
      img.addEventListener('error', resolve, { once: true });
      }))
    );
  }

  async function scheduleRefresh() {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
        refreshTimer = null;
    }
    
    await waitForImages();

    refreshTimer = setTimeout(() => {
      location.reload();
      }, 1500);
  }

  const nav = performance.getEntriesByType('navigation')[0];
  if (!nav || nav.type !== 'reload') {
    scheduleRefresh();
  }

  const pjaxEvents = [
    'pjax:complete',
    'page:load',
    'turbolinks:load',
    'barba:transitionend',
    'astro:page-load',
    'pjax:success',
    'popstate'
  ];

  pjaxEvents.forEach(eventName => {
    window.addEventListener(eventName, scheduleRefresh);
  });
})();
```
添加进配置文件中：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
  bottom:
    # - <script src="xxxx"></script>
    - <script src="/assets/js/reload.js"></script>
```

而不需要原来那个 CSS，也就是说我原来写的：

```css
p > img
{
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

存粹就是来搞笑的，甚至还会导致评论区的贴片表情包也跟着异常，所以现在我删除了这个。

最近不知道怎么回事，精神状态不好，啥都搞错了……