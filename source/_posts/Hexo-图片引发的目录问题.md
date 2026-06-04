---
title: 巧用 CSS 容器一步修复 Butterfly 主题，目录加载图片大小问题
date: 2026-04-09 21:58:34
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Hexo
  - Butterfly
  - CSS 美化
  - 技术折腾
  - 图片占位
description: "本文介绍了在使用 Butterfly 主题时，遇到的目录大小计算问题，即目录仅统计首次加载时的内容而非加载完成后的实际大小。文章提供了解决方案：通过为图片添加 CSS 容器，设置 width: 100%、aspect-ratio 和 object-fit 属性，实现图片占位与裁剪，从而解决目录高度计算错误。同时，作者强调了根据网站图片比例（如 4:3、16:9 或 1:1）调整 aspect-ratio 值，并建议使用压缩后的 .webp 格式图片以保持原分辨率。最后给出了在主题配置文件中注入该 CSS 文件的方法。"
---

最近在写作的时候发现一个问题：Butterfly 的目录算的是当前第一次加载时的目录大小，而不是加载完成后的目录大小。也就是说如果你的文章通篇下来全是图片和二级标题，那你可能就会遇到这个非常影响美观性的问题。查遍了全网的答案，没有一个提到解决方法的，于是我去问了人工智能助手，不得不说人工智能真的很方便。它告诉我说，只需要给图片加一个容器就可以了：

```css
p > img
{
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

最后引入这个 CSS：

```yml
# Inject
# Insert the code to head (before '</head>' tag) and the bottom (before '</body>' tag)
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
    - <link rel="stylesheet" href="/assets/css/illustrations.css">
  bottom:
    # - <script src="xxxx"></script>
```

这里的 `4 / 3` 是因为我的网站图片经常是 4:3 的，我就选择这个。如果你的网站图片多是 16:9 或者 1:1 的那种，建议按照实际情况设置，因为这个设置不仅会占位图片，还会裁剪图片。当然这里还是要提醒一下，插入图片前一定要压缩成 `.webp`，使用 macOS 或者其它什么工具直接裁剪的图片会出现很多麻烦，等你需要大图却发现图片已经成小图的时候，还不如要一张 302 KB 原分辨率 `.webp`。