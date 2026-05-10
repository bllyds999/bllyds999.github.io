---
title: Giscus 修改 CSS 样式
categories: 代码展示
cover: /assets/images/cover/code.webp
date: 2026-05-02 11:05:31
tags:
  - Giscus
  - CSS 美化
  - 暗色模式
  - 个人网站
  - 技术折腾
---

最近为网站添加了 Giscus 作为第二评论区，以适应不同访客的不同需求。Giscus 使用 `iframe` 标签在页面里嵌入评论区，所以本质上这里边是一个独立的窗口，不享受网站自带的 CSS 美化。Giscus 官方允许我为 Giscus 编写 CSS 进行美化，因为 `iframe` 标签这一特性，美化过程中如果涉及网站上的 CSS 资源，需要写成带网站域名的绝对路径，而非不带网站域名的相对路径。理清了思路，那我们就开始写代码吧！

我选择 `noborder_light` 和 `noborder_dark` 作为网站评论区默认的亮暗色，从名字就可以知道，它们都是典型的无边框样式。相比默认的 `light` 和 `dark` 这样的有边框样式，这更有助于融入网站页面。我把这两个文件放到了网站的 `/assets/css/giscus/` 目录，确保足够统一。值得一提的是，由于是备用评论区，我不需要为其编写很融合的 CSS，只需要修改一下字体设置，确保和网站看起来一样就可以了：

```css
@font-face
{
  font-family: 'ZCOOLXiaoWei';
  src: url('https://090909.top/assets/fonts/ZCOOLXiaoWei-Regular.woff2');
}

@font-face
{
  font-family: 'FiraCode';
  src: url('https://090909.top/assets/fonts/FiraCode-Light.woff2');
}

main
{
  --primary-default: 5, 92, 55;
  --bg-default: 246, 246, 247;
  --color-prettylights-syntax-comment: #6e7781;
  --color-prettylights-syntax-constant: #0550ae;
  --color-prettylights-syntax-entity: #8250df;
  --color-prettylights-syntax-storage-modifier-import: #24292f;
  --color-prettylights-syntax-entity-tag: #116329;
  --color-prettylights-syntax-keyword: #cf222e;
  --color-prettylights-syntax-string: #0a3069;
  --color-prettylights-syntax-variable: #953800;
  --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
  --color-prettylights-syntax-invalid-illegal-text: #f6f8fa;
  --color-prettylights-syntax-invalid-illegal-bg: #82071e;
  --color-prettylights-syntax-carriage-return-text: #f6f8fa;
  --color-prettylights-syntax-carriage-return-bg: #cf222e;
  --color-prettylights-syntax-string-regexp: #116329;
  --color-prettylights-syntax-markup-list: #3b2300;
  --color-prettylights-syntax-markup-heading: #0550ae;
  --color-prettylights-syntax-markup-italic: #24292f;
  --color-prettylights-syntax-markup-bold: #24292f;
  --color-prettylights-syntax-markup-deleted-text: #82071e;
  --color-prettylights-syntax-markup-deleted-bg: #ffebe9;
  --color-prettylights-syntax-markup-inserted-text: #116329;
  --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
  --color-prettylights-syntax-markup-changed-text: #953800;
  --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
  --color-prettylights-syntax-markup-ignored-text: #eaeef2;
  --color-prettylights-syntax-markup-ignored-bg: #0550ae;
  --color-prettylights-syntax-meta-diff-range: #8250df;
  --color-prettylights-syntax-brackethighlighter-angle: #57606a;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #8c959f;
  --color-prettylights-syntax-constant-other-reference-link: #0a3069;
  --color-btn-text: #24292f;
  --color-btn-bg: rgba(var(--bg-default), 1);
  --color-btn-border: rgba(var(--bg-default), 1);
  --color-btn-shadow: 0 1px 0 rgba(var(--bg-default), 1);
  --color-btn-inset-shadow: inset 0 1px 0 rgba(var(--bg-default), 1);
  --color-btn-hover-bg: rgba(var(--bg-default), 0.5);
  --color-btn-hover-border: rgba(var(--bg-default), 0.5);
  --color-btn-active-bg: rgba(var(--primary-default), 0.2);
  --color-btn-active-border: rgba(var(--primary-default), 1);
  --color-btn-selected-bg: rgba(var(--primary-default), 0.15);
  --color-btn-primary-text: rgb(255 255 255 / 100%);
  --color-btn-primary-bg: rgba(var(--primary-default), 1);
  --color-btn-primary-border: rgba(var(--primary-default), 1);
  --color-btn-primary-shadow: 0 1px 0 rgb(31 35 40 / 10%);
  --color-btn-primary-inset-shadow: inset 0 1px 0 rgb(255 255 255 / 3%);
  --color-btn-primary-hover-bg: rgba(var(--primary-default), 0.9);
  --color-btn-primary-hover-border: rgba(var(--primary-default), 0.75);
  --color-btn-primary-selected-bg: rgba(var(--primary-default), 1);
  --color-btn-primary-selected-shadow: inset 0 1px 0 rgb(0 45 17 / 20%);
  --color-btn-primary-disabled-text: rgb(255 255 255 / 80%);
  --color-btn-primary-disabled-bg: rgba(var(--primary-default), 0.5);
  --color-btn-primary-disabled-border: rgba(var(--primary-default), 0.5);
  --color-action-list-item-default-hover-bg: rgb(208 215 222 / 32%);
  --color-segmented-control-bg: #eaeef2;
  --color-segmented-control-button-bg: #fff;
  --color-segmented-control-button-selected-border: rgba(var(--bg-default), 0.85);
  --color-fg-default: rgb(60 60 67);
  --color-fg-muted: rgb(60 60 67 / 75%);
  --color-fg-subtle: rgb(60 60 67 / 33%);
  --color-canvas-default: rgb(255 255 255);
  --color-canvas-overlay: rgb(255 255 255);
  --color-canvas-inset: rgba(var(--bg-default), 0.85);
  --color-canvas-subtle: rgba(var(--bg-default), 1);
  --color-border-default: rgba(var(--bg-default), 0.85);
  --color-border-muted: rgb(175 184 193 / 20%);
  --color-neutral-muted: rgb(175 184 193 / 20%);
  --color-accent-fg: rgba(var(--primary-default), 0.85);
  --color-accent-emphasis: rgba(var(--primary-default), 0.95);
  --color-accent-muted: rgba(var(--primary-default), 0.4);
  --color-accent-subtle: rgba(var(--primary-default), 0.1);
  --color-success-fg: #1a7f37;
  --color-attention-fg: #9a6700;
  --color-attention-muted: rgb(212 167 44 / 40%);
  --color-attention-subtle: #fff8c5;
  --color-danger-fg: #d1242f;
  --color-danger-muted: rgb(255 129 130 / 40%);
  --color-danger-subtle: #ffebe9;
  --color-primer-shadow-inset: 0 1px 0 rgba(var(--bg-default), 1), inset 0 1px 0 rgba(var(--bg-default), 1);
  --color-scale-gray-1: rgb(234 238 242 / 100%);
  --color-scale-blue-1: rgb(16 185 129 / 15%);

  --color-social-reaction-bg-hover: var(--color-scale-gray-1);
  --color-social-reaction-bg-reacted-hover: var(--color-scale-blue-1);
}

main .pagination-loader-container
{
  background-image: url("https://github.com/images/modules/pulls/progressive-disclosure-line.svg");
}

main .gsc-loading-image
{
  background-image: url("https://github.githubassets.com/images/mona-loading-default.gif");
}

.gsc-comment:not(.gsc-reply-box) .gsc-replies
{
  border-radius: unset;
}

main
{
  font-family: 'ZCOOLXiaoWei';
  font-size: 1rem;
}

code, pre
{
  font-family: 'Fira Code', 'ZCOOLXiaoWei', monospace;
  font-size: 1rem;
}
```

还有暗色模式的：

```css
@font-face
{
  font-family: 'ZCOOLXiaoWei';
  src: url('https://090909.top/assets/fonts/ZCOOLXiaoWei-Regular.woff2');
}

@font-face
{
  font-family: 'FiraCode';
  src: url('https://090909.top/assets/fonts/FiraCode-Light.woff2');
}

main
{
  --primary-default: 20, 222, 155;
  --bg-default: 22, 22, 24;
  --color-prettylights-syntax-comment: #8b949e;
  --color-prettylights-syntax-constant: #79c0ff;
  --color-prettylights-syntax-entity: #d2a8ff;
  --color-prettylights-syntax-storage-modifier-import: #c9d1d9;
  --color-prettylights-syntax-entity-tag: #7ee787;
  --color-prettylights-syntax-keyword: #ff7b72;
  --color-prettylights-syntax-string: #a5d6ff;
  --color-prettylights-syntax-variable: #ffa657;
  --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
  --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
  --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
  --color-prettylights-syntax-carriage-return-text: #f0f6fc;
  --color-prettylights-syntax-carriage-return-bg: #b62324;
  --color-prettylights-syntax-string-regexp: #7ee787;
  --color-prettylights-syntax-markup-list: #f2cc60;
  --color-prettylights-syntax-markup-heading: #1f6feb;
  --color-prettylights-syntax-markup-italic: #c9d1d9;
  --color-prettylights-syntax-markup-bold: #c9d1d9;
  --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
  --color-prettylights-syntax-markup-deleted-bg: #67060c;
  --color-prettylights-syntax-markup-inserted-text: #aff5b4;
  --color-prettylights-syntax-markup-inserted-bg: #033a16;
  --color-prettylights-syntax-markup-changed-text: #ffdfb6;
  --color-prettylights-syntax-markup-changed-bg: #5a1e02;
  --color-prettylights-syntax-markup-ignored-text: #c9d1d9;
  --color-prettylights-syntax-markup-ignored-bg: #1158c7;
  --color-prettylights-syntax-meta-diff-range: #d2a8ff;
  --color-prettylights-syntax-brackethighlighter-angle: #8b949e;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #484f58;
  --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
  --color-btn-text: rgb(235 235 245 / 86%);
  --color-btn-bg: rgba(var(--bg-default), 1);
  --color-btn-border: rgba(var(--bg-default), 1);
  --color-btn-shadow: 0 1px 0 rgba(var(--bg-default), 1);
  --color-btn-inset-shadow: inset 0 1px 0 rgba(var(--bg-default), 1);
  --color-btn-hover-bg: rgba(var(--bg-default), 0.5);
  --color-btn-hover-border: rgba(var(--bg-default), 0.5);
  --color-btn-active-bg: rgba(var(--primary-default), 0.2);
  --color-btn-active-border: rgba(var(--primary-default), 1);
  --color-btn-selected-bg: rgba(var(--primary-default), 0.15);
  --color-btn-primary-text: rgb(255 255 255 / 100%);
  --color-btn-primary-bg: rgba(var(--primary-default), 0.45);
  --color-btn-primary-border: rgba(var(--primary-default), 0.5);
  --color-btn-primary-shadow: 0 1px 0 rgb(27 31 36 / 10%);
  --color-btn-primary-inset-shadow: inset 0 1px 0 hsl(0deg 0% 100% / 3%);
  --color-btn-primary-hover-bg: rgba(var(--primary-default), 0.53);
  --color-btn-primary-hover-border: rgba(var(--primary-default), 0.75);
  --color-btn-primary-selected-bg: rgba(var(--primary-default), 0.45);
  --color-btn-primary-selected-shadow: inset 0 1px 0 rgb(0 45 17 / 20%);
  --color-btn-primary-disabled-text: rgb(255 255 255 / 80%);
  --color-btn-primary-disabled-bg: rgba(var(--primary-default), 0.5);
  --color-btn-primary-disabled-border: rgba(var(--primary-default), 0.5);
  --color-action-list-item-default-hover-bg: rgb(177 186 196 / 12%);
  --color-segmented-control-bg: rgb(110 118 129 / 10%);
  --color-segmented-control-button-bg: #0d1117;
  --color-segmented-control-button-selected-border: rgba(var(--bg-default), 0.85);
  --color-fg-default: rgb(235 235 245 / 86%);
  --color-fg-muted: rgb(235 235 245 / 60%);
  --color-fg-subtle: rgb(235 235 245 / 50%);
  --color-canvas-default: rgb(30 30 32 / 100%);
  --color-canvas-overlay: rgb(30 30 32 / 100%);
  --color-canvas-inset: rgba(var(--bg-default), 0.85);
  --color-canvas-subtle: rgba(var(--bg-default), 1);
  --color-border-default: rgba(var(--bg-default), 0.85);
  --color-border-muted: rgb(175 184 193 / 20%);
  --color-neutral-muted: rgb(175 184 193 / 20%);
  --color-accent-fg: rgba(var(--primary-default), 0.85);
  --color-accent-emphasis: rgba(var(--primary-default), 0.95);
  --color-accent-muted: rgba(var(--primary-default), 0.4);
  --color-accent-subtle: rgba(var(--primary-default), 0.1);
  --color-success-fg: #3fb950;
  --color-attention-fg: #d29922;
  --color-attention-muted: rgb(187 128 9 / 40%);
  --color-attention-subtle: rgb(187 128 9 / 15%);
  --color-danger-fg: #f85149;
  --color-danger-muted: rgb(248 81 73 / 40%);
  --color-danger-subtle: rgb(248 81 73 / 10%);
  --color-primer-shadow-inset: 0 1px 0 rgba(var(--bg-default), 1), inset 0 1px 0 rgba(var(--bg-default), 1);
  --color-scale-gray-7: rgb(22 22 24 / 100%);
  --color-scale-blue-8: rgb(16 185 129 / 15%);

  --color-social-reaction-bg-hover: var(--color-scale-gray-7);
  --color-social-reaction-bg-reacted-hover: var(--color-scale-blue-8);
}

main .pagination-loader-container
{
  background-image: url("https://github.com/images/modules/pulls/progressive-disclosure-line-dark.svg");
}

main .gsc-loading-image
{
  background-image: url("https://github.githubassets.com/images/mona-loading-dark.gif");
}

main
{
  font-family: 'ZCOOLXiaoWei', sans-serif;
  font-size: 1rem;
}

code, pre
{
  font-family: 'Fira Code', 'ZCOOLXiaoWei', monospace;
  font-size: 1rem;
}
```

我还需要使用这两个主题：

```yml
giscus:
  repo:
  repo_id:
  category_id:
  light_theme: https://090909.top/assets/css/giscus/light.css
  dark_theme: https://090909.top/assets/css/giscus/dark.css
```

现在一切完成了，等以后有时间再慢慢美化吧！