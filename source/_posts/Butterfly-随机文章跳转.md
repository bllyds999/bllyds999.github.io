---
title: Butterfly 随机文章跳转
date: 2026-04-12 20:08:22
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - Hexo
  - 前端脚本
  - 个人网站
  - 随机跳转
description: "本文介绍了如何为 Butterfly 主题实现随机跳转文章的功能，通过编写 JavaScript 脚本爬取归档页面并提取文章链接，再随机选择一个链接进行跳转。文章详细展示了从复用友链跳转脚本到修改选择器适配归档页面的过程，并给出了完整的 randomizer 函数代码。同时说明了在主题配置中注入脚本文件以及在页脚添加触发链接的方法，最后提醒不同主题需根据实际情况调整链接类名。"
---

既然提到了 AnZhiYu 主题，那就不得不说一下随机跳转文章的作用。访客第一次来到我们的博客网站，不知道该从哪一篇文章开始看，这时候随机跳转能够很大程度上缓解访客的焦虑。Butterfly 包括大部分主题并没有内置原生的随机跳转功能，所以需要使用 JS 进行功能实现，流程如下：

{% mermaid %}
graph LR;
    A[爬取归档页面] --> B[提取文章链接] --> C[放入候选列表] --> D[随机链接跳转];
{% endmermaid %}

由于之前已经写过了一个随机跳转友链的 JS 脚本，可以复用一下：

```javascript
async function go() {
  const response = await fetch('/friends');
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const linkItems = doc.querySelectorAll('.flink-list-item a');
  const links = Array.from(linkItems).map(a => a.href).filter(href => href && href !== '#');
    
  if (links.length === 0) return;
    
  const randomIndex = Math.floor(Math.random() * links.length);
  const randomLink = links[randomIndex];
    
  window.location.href = randomLink;
}
```

将其中的位置从友链改成归档，再将 `.flink-list-item a` 改成 `.article-sort-item-title`。稍微修改一下函数名字，就得到了如下脚本（它会爬取归档页面、提取文章的链接、放入候选列表、随机选择一个链接跳转到该文章）：

```javascript
async function randomizer() {
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
```

在主题配置中应用这个脚本：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
  bottom:
    # - <script src="xxxx"></script>
    - <script src="/assets/js/reload.js"></script>
    - <script src="/assets/js/travellings.js"></script>
    - <script src="/assets/js/randomizer.js"></script>
```

现在就可以在网站控制台运行 `randomizer` 函数了，在任何页面下都可以触发文章随机跳转。但如果仅仅只是这样，那还是不够的。因此还需要让它被展示出来，比如作为一个链接。我习惯放到页脚：

```yml
footer:
  nav:
  owner:
    enable: true
    since: 2026
  # Copyright of theme and framework
  copyright:
    enable: true
    version: true
  custom_text: |
    <span><a href="/sitemap.xml">网站地图</a></span>
    <span><a href="/atom.xml">订阅</a></span>
    <span><a href="javascript:go()">闲逛</a></span>
    <span><a href="javascript:randomizer()">盲盒</a></span>
```

不同的主题对于归档页面的链接类不一，你需要根据情况修改，我的代码仅针对 Butterfly 主题。