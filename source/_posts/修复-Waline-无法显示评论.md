---
title: 修复 Waline 无法显示评论
categories: 杂谈
cover: /assets/images/cover/other.webp
date: 2026-04-18 11:46:57
tags:
  - Waline
  - 评论系统
  - Cloudflare
  - 树莓派
  - Vercel
---

因为 GitHub 被封了，Vercel 没得用了，迁移评论区到了我家树莓派。还好 Waline 可以导出评论，要不然我的博客网站就要被 Giscus 坑惨了！这就是为什么我推荐大家都用 Waline，最起码数据在自己手里，想迁移就迁移，这就是区别。

迁移网站到 Cloudflare Pages 一看，妈的老子 Waline 评论区没剩几条了。搞得好像我这个网站是那个坟墓，周围飘荡着评论的幽灵，但是就是没人评论那种。遇到这种情况我先不慌好吧，反正评论都能显示在后台。

和 DeepSeek 对了一个凌晨的账，终于搞清楚了原因，都怪傻逼 Vercel 的路径问题。是这样子的，Vercel 它把我文章时间弄错了，变成了 10 号的文章，路径是 `2026/04/10`。但我那个文章是 11 号写的，这就是为什么我在本地浏览感觉没评论，但是 Vercel 看就有评论。因为本地浏览时路径是 `2026/04/11`，他妈的 Vercel！

还好我有 Waline 的源 `waline.json`，明文玩意改个路径重新导入又不难。包括友链页面也没法显示评论，你知道为什么吗？在 Vercel 上，友链页面是 `/friends`，而 Cloudflare Pages 的比较规范，友链页面是 `/friends/`。差了一个 `/` 就无法显示评论了，真他妈乌龙！