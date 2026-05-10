---
title: Butterfly 网站深色模式
date: 2026-04-09 16:14:24
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - 暗色模式
  - Hexo
  - 技术折腾
  - 前端脚本
---

在 `_config.butterfly.yml` 改一下配置：

```yml
darkmode:
  enable: true
  # Toggle Button to switch dark/light mode
  button: true
  # Switch dark/light mode automatically
  # autoChangeMode: 1  Following System Settings, if the system doesn't support dark mode, it will switch dark mode between 6 pm to 6 am
  # autoChangeMode: 2  Switch dark mode between 6 pm to 6 am
  # autoChangeMode: false
  autoChangeMode: 1
  # Set the light mode time. The value is between 0 and 24. If not set, the default value is 6 and 18
  start:
  end:
```

就改好了。后面发现，不行嚯！网站友链页面用的 `.svg` 图片居然还是黑色的，按道理来说这玩意不是会跟着变色吗？问了一下 AI，说是因为正常情况下 FAS 的 SVG 被当做字体处理，而我手动引入的当图片处理，并且默认是黑色图片。AI 给了我下面这代码：

```css
@media (prefers-color-scheme: dark) {
  img[src$=".svg"] {
    filter: brightness(0) invert(1) !important;
  }
}
```

写成 `svg.css`，加入配置：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
  bottom:
    # - <script src="xxxx"></script>
```

现在就可以推送了，深色下是白色，浅色下是黑色，大家都不会打架了。