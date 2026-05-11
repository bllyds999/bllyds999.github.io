---
title: Butterfly 卡片模糊效果
categories: 代码展示
cover: /assets/images/cover/code.webp
date: 2026-05-01 00:21:47
tags:
  - Butterfly
  - CSS 阴影
  - 毛玻璃效果
  - 暗色模式
  - 技术折腾
description: "本文介绍了在 Butterfly 主题网站中为卡片实现毛玻璃效果的方法与问题解决过程。文章首先指出，为所有卡片统一设置 backdrop-filter: blur(7px) 可使导航栏模糊程度一致，但在暗色模式下会因缺乏基础颜色导致卡片与背景糊成一片。作者曾尝试通过 @media (prefers-color-scheme: light) 限制仅在亮色模式生效，但这并非根本解决方案。后来意外发现主题作者为导航栏设计的十六位色（如 #FFFFFFB3 和 #121212CC），通过为亮色和暗色模式分别设置带透明度通道的背景颜色，再统一保留 blur(7px)，即可实现不干扰网站扁平化设计的毛玻璃效果，且暗色模式用户也能正常使用。最后，文章给出了在 Butterfly 主题配置文件中引入对应 CSS 文件以及通过 Cloudflare Pages 完成部署的示例代码。"
---

在创建这个网站之前，我曾见过一个把 Butterfly 卡片改出毛玻璃质感的网站。最近我也想尝试类似的效果，发现这其中最大的难点居然是找到各种卡片的 CSS 类。如果只是单独修改一个类而不是整个类群的话，效果就不会应用到全部地方。我想作者在设计时应该考虑到所有卡片颜色，因此有一个专门的代码。

关于每个卡片的模糊程度，可以直接将导航栏的 `blur(7px)` 作为基本参考，这样能确保所有地方的模糊程度都是一致的：

```css
.cardHover, .type-404 .error-content, .layout > div:first-child:not(.nc), #recent-posts .recent-post-item, #article-container .shuoshuo-item, #aside-content .card-widget, .layout .pagination > *:not(.space) {
  background: transparent;
  backdrop-filter: blur(7px);
}
```

这段代码的类是从控制台的 CSS 提取的，原理是让所有卡片的背景颜色都设置了透明，最后给每个卡片的模糊设置为 `7px`。但是我发现这样做会出现一个大问题，如果我们处于暗色模式下，没有基础颜色的毛玻璃会让卡片和漆黑的背景糊成一团，因为暗色模式下卡片没有阴影边界，但如果为此硬加一条白边反而破坏了原有的主题和谐。说实话这个模糊功能我还真挺想要的，但只能委屈一下暗色模式的朋友们了（包括我）：

```css
@media (prefers-color-scheme: light) {
  .cardHover, .type-404 .error-content, .layout > div:first-child:not(.nc), #recent-posts .recent-post-item, #article-container .shuoshuo-item, #aside-content .card-widget, .layout .pagination > *:not(.space) {
    background: transparent;
    backdrop-filter: blur(7px);
  }
}
```

上面这段的 CSS 代码 `@media (prefers-color-scheme: light)` 使得毛玻璃卡片仅在浏览器设置为亮色主题时生效，但这样终究只能是掩耳盗铃。况且，就算是在亮色模式下，如果不注意阴影的话，卡片和背景也是糊成一团，这也是之前那个网站的效果。后来，经过几天下来的折腾，有一次我不小心把光标放到了导航栏上，居然不小心得到了主题作者最初为了模糊设计的十六位色，于是便有了下面这段新代码：

```css
.cardHover, .type-404 .error-content, .layout > div:first-child:not(.nc), #recent-posts .recent-post-item, #article-container .shuoshuo-item, #aside-content .card-widget, .layout .pagination > *:not(.space) {
  backdrop-filter: blur(7px);
}

@media (prefers-color-scheme: light) {
  .cardHover, .type-404 .error-content, .layout > div:first-child:not(.nc), #recent-posts .recent-post-item, #article-container .shuoshuo-item, #aside-content .card-widget, .layout .pagination > *:not(.space) {
    background: #FFFFFFB3;
  }
}

@media (prefers-color-scheme: dark) {
  .cardHover, .type-404 .error-content, .layout > div:first-child:not(.nc), #recent-posts .recent-post-item, #article-container .shuoshuo-item, #aside-content .card-widget, .layout .pagination > *:not(.space) {
    background: #121212CC;
  }
}
```

第一部分是让所有的卡片保持 `7px` 的模糊，第二部分是让卡片在亮色模式下颜色为 `#FFFFFFB3`，第三部分是让卡片在暗色模式下颜色为 `#121212CC`。这两个都是有 A 通道的十六位色，它们本来就定义了透明度，不需要再为卡片写 `transparent`。

现在我便不再需要焦虑卡片和背景混合的事情了，暗色模式下的小伙伴也可以看到这些若隐若现的毛玻璃效果（如果没有效果，记得清理缓存），重点是它一点也不干扰网站原本的扁平化设计语言！接下来只需要修改 Butterfly 的主题配置文件应用它，使其生效：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <meta name="msvalidate.01" content="418AEC41299D1A70760AD5404E9AD5CC" />
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
    - <link rel="stylesheet" href="/assets/css/description.css">
    - <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/css/all.min.css">
    - <link rel="stylesheet" href="/assets/css/pagination.css">
    - <link rel="stylesheet" href="/assets/css/social.css">
    - <link rel="stylesheet" href="/assets/css/align.css">
    - <link rel="stylesheet" href="/assets/css/blur.css"> # 这里哦！
  bottom:
    # - <script src="xxxx"></script>
    - <script src="/assets/js/reload.js"></script>
    - <script src="/assets/js/stroll.js"></script>
    - <script src="/assets/js/blindbox.js"></script>
    - <script src="/assets/js/fans.js"></script>
    - <script src="/assets/js/mourn.js"></script>
    - <script src="/assets/js/birthday.js"></script>
```

最后把网站上传到 Cloudflare Pages 完成更新：

```shell
npm run backup && npm run build && npm run deploy
```

有时候答案就在眼前，可是我却没有注意到……