---
title: Hexo Butterfly 亮暗色切换：data-theme 替代 @media 实现方法
categories: 代码展示
cover: /assets/images/cover/code.webp
date: 2026-05-01 03:43:57
tags:
  - Butterfly
  - 暗色模式
  - 技术折腾
  - 个人网站
  - Hexo
description: "本文介绍了 Hexo 博客 Butterfly 主题的亮暗色切换实现原理与自定义方法。文章指出 Butterfly 通过 JS 脚本控制 `data-theme` 属性实现颜色模式切换，而非监听浏览器主题，因此刷新页面后才能响应系统主题变化。作者详细解释了暗色模式下的 CSS 变量赋值方式，并给出了具体的代码示例，包括如何为卡片、布局等元素分别设置亮色和暗色背景，以及如何使用 `[data-theme='dark']` 选择器替代 `@media (prefers-color-scheme: dark)` 进行暗色样式定制。文章为需要深度美化 Butterfly 主题的用户提供了实用的 CSS 编写思路。"
---

我的博客网站是用 Hexo 做的，主题是 Butterfly。因为 Butterfly 支持外置 CSS 和 JS，所以我一直在为网站美化、添加各种新功能。最近正在亮暗色切换问题上头疼，貌似 Butterfly 主题有套自己的亮暗色控制规则，完全不听 `@media` 的。

通过简单的搜索可以了解到，Butterfly 的亮暗色实现依赖的是 JS 脚本控制，而不是传统的监听浏览器主题，这是因为 Butterfly 需要适配亮暗切换按钮。当你点击主题网站上的亮暗切换按钮时，JS 会在浏览器记录网站的亮暗色值，最后赋值给 CSS 完成切换亮暗色。

如果你没按过亮暗切换钮，在页面加载时，JS 会检测当前用户的浏览器主题，最后进行赋值操作。这就是为什么我们在切换浏览器主题时，网站的配色方案需要手动刷新页面才会改变，因为需要运行 JS 才能切换配色方案。Butterfly 的 JS 在切换后，`data-theme` 的赋值为 `dark`：

```css
[data-theme='dark']
{
  --global-bg: #0d0d0d;
  --font-color: rgba(255,255,255,0.7);
  --hr-border: rgba(255,255,255,0.4);
  --hr-before-color: rgba(255,255,255,0.7);
  --search-bg: #121212;
  --search-input-color: rgba(255,255,255,0.7);
  --search-a-color: rgba(255,255,255,0.7);
  --preloader-bg: #0d0d0d;
  --preloader-color: rgba(255,255,255,0.7);
  --tab-border-color: #2c2c2c;
  --tab-button-bg: #2c2c2c;
  --tab-button-color: rgba(255,255,255,0.7);
  --tab-button-hover-bg: #383838;
  --tab-button-active-bg: #121212;
  --card-bg: #121212;
  --sidebar-bg: #121212;
  --sidebar-menu-bg: #1f1f1f;
  --btn-hover-color: #787878;
  --btn-color: rgba(255,255,255,0.7);
  --btn-bg: #1f1f1f;
  --text-bg-hover: #383838;
  --light-grey: rgba(255,255,255,0.7);
  --dark-grey: rgba(255,255,255,0.2);
  --white: rgba(255,255,255,0.9);
  --text-highlight-color: rgba(255,255,255,0.9);
  --blockquote-color: rgba(255,255,255,0.7);
  --blockquote-bg: #2c2c2c;
  --reward-pop: #2c2c2c;
  --toc-link-color: rgba(255,255,255,0.6);
  --scrollbar-color: #525252;
  --timeline-bg: #1f1f1f;
  --zoom-bg: #121212;
  --mark-bg: rgba(0,0,0,0.6);
  --btn-color: #ccc;
  --btn-default-color: #929292;
  --tags-blue-color: #3e6f98;
  --tags-blue-color-lighten: rgba(66,139,202,0.15);
  --tags-pink-color: #dd3c8c;
  --tags-pink-color-lighten: rgba(255,105,180,0.15);
  --tags-red-color: #a41b1b;
  --tags-red-color-lighten: rgba(255,0,0,0.15);
  --tags-orange-color: #a76a20;
  --tags-orange-color-lighten: rgba(255,140,0,0.15);
  --tags-purple-color: #5f4490;
  --tags-purple-color-lighten: rgba(111,66,193,0.15);
  --tags-green-color: #4f8e4f;
  --tags-green-color-lighten: rgba(92,184,92,0.15);
  --note-default-border: #5a5a5a;
  --note-default-bg: #2b2b2b;
  --note-default-text: #b3b3b3;
  --note-modern-default-border: #9a9a9a;
  --note-modern-default-bg: #353535;
  --note-modern-default-text: #c4c4c4;
  --note-primary-border: #5935a1;
  --note-primary-bg: #2e1c3e;
  --note-primary-text: #a47dd4;
  --note-modern-primary-border: #9985cc;
  --note-modern-primary-bg: #3c2d4c;
  --note-modern-primary-text: #b693e6;
  --note-info-border: #346fa2;
  --note-info-bg: #1f2e3b;
  --note-info-text: #7bb3db;
  --note-modern-info-border: #7ca8b5;
  --note-modern-info-bg: #2b3c44;
  --note-modern-info-text: #8fc6e0;
  --note-success-border: #4a944a;
  --note-success-bg: #202e20;
  --note-success-text: #82c682;
  --note-modern-success-border: #8bb087;
  --note-modern-success-bg: #2c3d2c;
  --note-modern-success-text: #96d196;
  --note-warning-border: #c08a3e;
  --note-warning-bg: #3e301f;
  --note-warning-text: #e6ba6b;
  --note-modern-warning-border: #b8a285;
  --note-modern-warning-bg: #4b3c2b;
  --note-modern-warning-text: #d4b373;
  --note-danger-border: #b34440;
  --note-danger-bg: #3b201f;
  --note-danger-text: #e67572;
  --note-modern-danger-border: #c7898c;
  --note-modern-danger-bg: #4d2b2e;
  --note-modern-danger-text: #d98b8e;
}
```

在亮色模式下，`data-theme` 不会被赋值。这意味着，当需要管理亮暗切换时要这样写：

```css
/* 先写亮色。 */
.cardHover, .type-404 .error-content, .layout > div:first-child:not(.nc), #recent-posts .recent-post-item, #article-container .shuoshuo-item, #aside-content .card-widget, .layout .pagination > *:not(.space)
{
  backdrop-filter: blur(7px);
  background: #FFFFFFB3;
}

/* 再写暗色。 */
[data-theme='dark'] {
  .cardHover, .type-404 .error-content, .layout > div:first-child:not(.nc), #recent-posts .recent-post-item, #article-container .shuoshuo-item, #aside-content .card-widget, .layout .pagination > *:not(.space) {
    background: #121212CC;
  }
}
```

如果仅需要修改暗色模式下的设置，则这样写：

```css
/* 这里是我的 SVG 暗色代码，我拿来做演示。 */
[data-theme='dark']
{
  img[src$=".svg"] {
    filter: brightness(0) invert(1) !important;
  }
}
```

基本思路等同于使用 `[data-theme='dark']` 替换掉 `@media (prefers-color-scheme: dark)`，需要修改目前的代码实现。