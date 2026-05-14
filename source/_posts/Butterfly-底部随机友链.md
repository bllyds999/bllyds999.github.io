---
title: Butterfly 底部随机友链
date: 2026-05-14 22:34:02
categories: 代码展示
cover: /assets/images/cover/code.webp
description: "本文介绍了作者在网站优化过程中，重新关注友链功能并为其创造更大价值的思考与实践。作者在投入大量精力调整网站加载速度、排版布局和交互逻辑后，偶然通过社交媒体结识了一批新人博主并主动交换友链。然而，作者意识到传统友链页面容易被访客忽视，无法有效为小博主引流，因此设想在页脚以随机形式展示友链，使其更自然地触达访客。作者参考了安知鱼博客主题的类似实现，并基于此前编写的用于抓取友链数据的 JavaScript 脚本进行改造。脚本逻辑包括：在配置文件中添加空容器标签，页面加载后异步请求 /friends 页面 HTML，解析 DOM 提取第一个 flink-list 中的友链信息，过滤无效数据，再根据屏幕宽度（大于 768 像素显示 6 个，否则显示 3 个）随机抽取不重复的友链接，动态生成链接元素插入页脚。这一响应式设计避免了手机端布局错乱，同时充分利用电脑端空间，使友链从静态列表变为动态信息流，真正释放其引流价值。"
tags:
  - Butterfly
  - 友链
  - 前端脚本
  - 博客搭建
  - 个人网站
---

最近这段时间，我把大部分精力都扑在了网站的优化工作上。从页面加载速度的调整，到各个模块的排版布局，甚至是一些细枝末节的交互逻辑，都花了不少心思反复打磨。说来也有些惭愧，正是因为这些琐碎但必要的工作占据了大量时间，我已经很久没有关注过“友链”这件事了。

前几天难得稍微闲下来，我像往常一样在社交媒体上漫无目的地刷着短视频，没想到平台的算法突然给我推了一大批新人博主——这些人大多刚搭建好自己的个人博客，虽然网站还比较简陋，但能看出每个人都花了不少心思。

我挨个看了他们的介绍视频，觉得挺有意思的，于是在评论区一个个留言，主动和他们交换了友链。一来二去，既认识了一些新朋友，也让自己的友链页面重新活跃了起来。

交换完这些友链之后，我不禁开始琢磨一个事情：现在网站每天的访问量似乎比以前多了不少，虽然算不上什么大流量站点，但如果能把这些来之不易的访问量最大化地利用起来，给友链里的那些小博主们带去一些真实的流量，那才是友链最大的价值所在。

毕竟说实话，绝大多数访客并不会像订阅博客文章那样，有事没事就点进友链页面挨个查看——谁会有那个闲工夫呢？友链页面往往被放在不起眼的角落里，很少有人专门去翻。

但反过来想，如果能把友链以一种更自然、更轻量的方式推到访客眼前，比如在页脚随机展示几位朋友的博客链接，那效果可能就完全不一样了。也许以后真能做出“友链订阅”之类的功能，让友链不再是静态的列表，而是像信息流一样动态更新。

那样的话，友链的价值就能真正被释放出来了。说到页脚随机展示友链这个想法，我印象中安知鱼的博客主题就实现过类似的功能——在页面底部随机显示几个已添加的友链，每次刷新可能都不一样，既节省空间，又增加了趣味性。

虽然我自己用的主题是 Butterfly，跟安知鱼不是同一个，但这并不妨碍我去实现同样的效果。因为在此之前，我已经为了其他需求写过一段用来获取友链数据的 JavaScript 脚本，那段脚本能从指定的页面抓取友链信息并解析出来。

既然基础能力已经有了，那接下来要做的无非就是基于那段脚本进行改造和扩展——解析友链页面、随机抽取几条、动态渲染到页脚位置。这么一想，实现起来应该不会太复杂，于是我就着手开始写了。

我给自己定的脚本工作逻辑大概是这样的：首先，在 `_config.butterfly.yml` 配置文件的页脚部分手动新增一个空的 `<div>` 标签，用来作为友链展示的容器。

脚本本身是一个典型的“无头脚本”——它不会在页面上产生任何可见的 UI 元素，只是在网站页面加载完成后自动运行一次。运行时会向 `/friends` 这个地址发起请求，抓取整个友链页面的 HTML 代码，然后用 DOMParser 解析成文档对象。

接下来从文档中找到第一个 flink-list（也就是“我的朋友”那一部分），提取出所有的链接项，过滤掉无效数据，得到一份干净的友链数组。最后根据屏幕宽度随机抽取三到六个不重复的友链，动态生成链接元素并插入到页脚容器中：

```javascript
(async function () {
  const response = await fetch('/friends');
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const firstFlinkList = doc.querySelector('.flink .flink-list');
  if (!firstFlinkList) return;
  const linkItems = firstFlinkList.querySelectorAll('.flink-list-item a');
  const friendList = Array.from(linkItems)
    .map(a => ({ name: a.title, href: a.href }))
    .filter(f => f.name && f.href && f.href !== '#');

  if (friendList.length === 0) return;

  const count = window.innerWidth > 768 ? 6 : 3;
  const shuffled = friendList.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  const container = document.querySelector('#friends');
  selected.forEach((f, i) => {
    if (i > 0) {
      container.appendChild(document.createTextNode(' '));
    }
    const span = document.createElement('span');
    const a = document.createElement('a');
    a.href = f.href;
    a.textContent = f.name;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    span.appendChild(a);
    container.appendChild(span);
  });
})();
```

上面那段代码里最关键的一个细节在于响应式的处理逻辑。当屏幕宽度小于或等于 768 像素时，也就是手机端的典型布局，脚本只会随机抽取并显示三个友链；而当屏幕宽度大于 768 像素时，则显示六个友链。

这个区分不是随手写的，而是我经过认真考虑后做的决定。手机屏幕本来就窄，页脚区域的空间非常有限，如果硬塞进去六七个链接，很容易导致换行混乱，甚至撑破布局。而电脑端屏幕宽裕，显示六个链接既不会显得拥挤，又能充分利用空间。

这个小小的判断逻辑，其实解决了我一直以来的一个隐忧——网站布局在不同设备上出现意外错位的问题。现在至少可以放心了，无论访客用的是大屏显示器还是小屏手机，页脚都不会因为友链的随机展示而突然变得又长又乱。