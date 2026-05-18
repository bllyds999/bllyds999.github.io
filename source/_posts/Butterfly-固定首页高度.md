---
title: Butterfly 固定首页高度
categories: 代码展示
cover: /assets/images/cover/code.webp
date: 2026-05-18 16:21:15
tags:
  - Butterfly
  - Hexo
  - 前端脚本
  - CSS 美化
  - 博客搭建
description: "本文介绍了 Butterfly 主题中首页文章列表高度不统一的问题及其解决方案。由于博客每页显示固定篇数（如 10 篇），末页文章数量不足时，列表容器高度会大幅缩减，导致底部大量空白，影响视觉一致性。为解决该问题，文章提供了一种基于 JavaScript 的动态补齐方法：通过 fillRecentPostItems 函数检测 .recent-post-items 容器内实际文章条目数，若少于目标值（如 10），则自动追加对应数量的隐藏 div 元素（visibility: hidden），使容器高度始终与满篇数保持一致。该逻辑还通过监听 pjax:complete 事件兼容 PJAX 无刷新加载，确保页面切换后自动执行补齐。同时指出，在 index_layout 参数为 4 或 6 的特殊布局下，由于文章条目高度依赖封面图片，纯隐藏标签会导致高度不一致，因此需要额外添加空封面占位元素。最后说明如何通过主题的 inject 配置将脚本注入页面底部，无需修改核心文件，便于维护升级。该方案有效解决了分页高度不一致的布局问题。"
---

在 Butterfly 主题中，或者说绝大多数博客主题，都倾向于将首页文章展示区域的高度，设定为本页剩余文章所占用的自然高度。从理论上看，最大展示高度应当由 `_config.yml` 中配置的每页文章篇数决定。但实际浏览过程中，页面高度很少能恰好达到十篇文章的完整高度。

举个例子，假设我的博客总共有 51 篇文章，每页显示 10 篇，那么最后一页只会剩下 1 篇文章。此时，首页文章列表的高度就会被限制在仅仅一篇文章的高度，导致页面布局显得不够协调，底部出现大量空白。相比之下，我更希望分页能够保持固定的高度，使每一页的视觉效果一致。

要实现这一点，就需要为文章列表容器设置 `min-height` 样式，确保即使文章数量不足，容器也能维持一个最小高度。然而，新的问题随之而来：当用户在 4K 显示器上浏览时，容器高度可能过小显得不饱满；而在手机等小屏设备上，容器高度又可能过大导致滚动条过长，无法实现真正的固定高度效果。

为了解决这个高度不统一的问题，可以通过 JavaScript 动态监测 Butterfly 主题中 `.recent-post-items` 容器内部实际存在的 `.recent-post-item` 文章条目数量，并判断其是否达到配置文件中设定的固定篇数。如果检测到 `recent-post-item` 的总数不足 10 篇，就计算出缺失的数量，例如当前只有 1 篇文章，则缺少 9 篇。此时，程序应当自动向 `.recent-post-items` 容器中追加若干空白且隐藏的文章标签，每个空白标签的结构为：

```html
<div class="recent-post-item" style="visibility: hidden;"></div>`
```

数量正好等于缺失的篇数。这样一来，虽然这些标签在页面上不可见，但它们会占据实际的空间，使得容器的高度始终保持与满篇数时一致。此外，这段逻辑还需要兼容 PJAX 无刷新加载技术，确保用户切换页面时，新加载的内容也能自动执行补齐操作，避免出现高度异常对应的实现代码如下所示：

```js
function fillRecentPostItems() {
  const container = document.querySelector('.recent-post-items');
  if (!container) return;

  const items = container.querySelectorAll('.recent-post-item');
  const current = items.length;
  const target = 10;

  if (current >= target) return;

  const missing = target - current;
  for (let i = 0; i < missing; i++) {
    const div = document.createElement('div');
    div.className = 'recent-post-item';
    div.style.visibility = 'hidden';
    container.appendChild(div);
  }
}

document.addEventListener('pjax:complete', fillRecentPostItems);
fillRecentPostItems();
```

首先定义一个 `fillRecentPostItems` 函数，获取文章列表容器，若容器不存在则直接返回。接着获取容器内所有文章条目，统计当前数量，并与目标数量 10 进行比较。如果当前数量已经大于或等于 10，则无需操作；否则计算出缺失数量，并通过循环创建对应数量的隐藏 `div` 元素，设置其类名和隐藏样式，最后追加到容器末尾。在函数定义完成后，使用：

```js
document.addEventListener('pjax:complete', fillRecentPostItems)
```

监听 PJAX 完成事件，确保每次页面局部刷新后都重新执行补齐操作。最后，主动调用一次 `fillRecentPostItems()` 函数，保证初始加载时也能正常工作，从而彻底解决末页高度不足的问题。在 Butterfly 主题中，当一个标签被标记为文章条目后，它会自动按照文章应有的高度进行渲染——但在手机设备上，由于响应式布局的存在，可能不会触发相同的高度逻辑，这一点需要特别注意。

尤其当主题的 `index_layout` 参数设置为 `4` 或 `6` 时，这两种布局会根据封面图片的有无来计算每个条目的固定高度。如果简单使用纯空白且隐藏的标签，由于没有封面元素，其高度可能与其他正常文章不一致，导致布局错乱。因此，在这两种布局下，需要为每个空白占位标签额外添加一个空白的封面占位元素，而不是单纯地插入隐藏的 `div`。为了将这段脚本集成到主题中。

我需要在 `_config.butterfly.yml` 配置文件的 `inject` 区域进行注入。在 `bottom` 部分添加对应的 JavaScript 文件引用，同时确保该脚本文件包含上述补齐逻辑。通过这种方式，脚本会在页面底部加载并自动执行，无需手动修改主题核心文件，便于日后主题升级和维护：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/transparent.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
    - <link rel="stylesheet" href="/assets/css/pagination.css">
    - <link rel="stylesheet" href="/assets/css/social.css">
    - <link rel="stylesheet" href="/assets/css/align.css">
    - <link rel="stylesheet" href="/assets/css/snackbar.css">
    - <link rel="stylesheet" href="/assets/css/meta.css">
    - <link rel="stylesheet" href="/assets/css/spacing.css">
    - <link rel="stylesheet" href="/assets/css/paragraph.css">
    - <link rel="stylesheet" href="/assets/css/proportion.css">
  bottom:
    # - <script src="xxxx"></script>
    - <script src="/assets/js/stroll.js"></script>
    - <script src="/assets/js/blindbox.js"></script>
    - <script src="/assets/js/mourn.js"></script>
    - <script src="/assets/js/reminder.js"></script>
    - <script src="/assets/js/friends.js"></script>
    - <script src="/assets/js/avatar.js"></script>
    - <script src="/assets/js/music.js"></script>
    - <script src="/assets/js/height.js"></script>
```