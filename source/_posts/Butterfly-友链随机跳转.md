---
title: Butterfly 友链随机跳转
date: 2026-04-12 16:06:02
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - 友链
  - 随机跳转
  - 前端脚本
  - 个人网站
---

这个网站原定计划是使用 AnZhiYu 主题来搭建的，但当时想到 AnZhiYu 需要配置那么多奇怪的地方，一上午时间全花在配置上，还是干脆使用 Butterfly 稍微美化一下好了。安知鱼的主题有一个随机跳转友链的功能，但是这个功能在 Butterfly 主题中没有。其实这个功能我还挺想要，因为现在的友链比以往任何时候要多。

随机跳转的本质就是抓取链接组成列表，在列表里面进行随机抽取最后跳转到抽中的链接。听起来貌似不难，但是如何获取友链才是一个大问题：比如 `source/_data/link.yml` 这个文件，你无法在构建完成的网站上找到。

所以我选择了在前端抓取友链页面，提取 `a.href` 的结果汇聚成列表：

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

如这个脚本所做的那样，它定义了一个名叫 `go` 的函数。当我执行这个函数时，它会从网站的 `/friends` 页面抓取友链，随机抽取并跳转到抽中的链接中。我需要让每一个页面都调用这个脚本，才能让浏览器知道有这个函数。我需要修改主题的配置文件，让每个页面都引用它：

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
```

现在我就可以在浏览器控制台运行 `go()` 来随机跳转友链了，可是我一开始需要的是在页面上点击它来随机跳转，有点背道而驰。所以我选择添加到了页脚作为一个菜单，既不会改变我导航栏的布局，又可以给访客们一个惊喜：

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
```

其实我一开始是想做成开往按钮的，但这样的话就会和真开往按钮放一起搞混。万一我一个半月以后真加入开往了呢？所以我就想，不如做成彩蛋，毕竟本来只是一个小功能。访客爱点不点，不如就当作是一个玩笑吧！