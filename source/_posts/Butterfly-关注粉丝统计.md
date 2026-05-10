---
title: Butterfly 关注粉丝统计
categories: 代码展示
cover: /assets/images/cover/code.webp
date: 2026-04-18 11:46:46
tags:
  - Butterfly
  - 粉丝统计
  - 友链
  - 前端脚本
  - 关注按钮
---

原版的“关注我”按钮只是个装饰，点击之后只能跳转到特定链接或者执行一个 JS 函数。我观察到，社交平台上都是这样显示的：关注按钮的“关注我”旁边还带一个数字，数字是粉丝数量统计，要这样的效果在前端不难。其实难点还是如何寻找一种和关注等价的东西，GitHub API 可以吗？但那属于跨域资源，而且我 GitHub 账号刚被封。最后我还是选择了博客友链，那和关注没区别。因此，我设计了如下脚本：

```javascript
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
      spanElement.textContent = `关注我 ${linkCount}`;
    }
  }
})();
```

它会在前端统计我的友链数量，并替换关注按钮中的 `<span></span>` 内容为 `关注我 ${linkCount}`。你可以改成其它的，比如 `有 ${linkCount} 人正在关注他`。需要注意的是，我的友链页面是 `/friends`，你需要改成你自己的。我还需要在 Butterfly 的配置文件引入这个 JS 脚本，不然无法在每个页面运行脚本：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
    - <link rel="stylesheet" href="/assets/css/description.css">
  bottom:
    # - <script src="xxxx"></script>
    - <script src="/assets/js/reload.js"></script>
    - <script src="/assets/js/stroll.js"></script>
    - <script src="/assets/js/blindbox.js"></script>
    - <script src="/assets/js/fans.js"></script>
```

现在只需要交换友链，你就被计入关注了。听着好原始站长风哦，呵呵。