---
title: 网站目录问题用 JS 自动刷新、解决并删除错误 CSS
date: 2026-04-10 18:31:37
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - Hexo
  - 前端脚本
  - 技术折腾
  - 个人网站
description: "本文介绍了如何通过在网站配置文件中添加 JavaScript 代码来解决目录显示异常的问题，该代码会在页面加载完成后等待所有图片加载，并在 1.5 秒后自动刷新页面，同时监听 PJAX 等异步加载事件以保持功能生效。文章还指出了之前使用 CSS 强制修改图片宽高比的做法是错误的，会导致评论区表情包异常，因此已删除该样式。作者反思了自己因精神状态不佳而导致的失误。"
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