---
title: 让博客更有人情味：Butterfly 主题自定义 Snackbar 时段问候
date: 2026-05-05 02:45:19
updated: 2026-05-05 16:02:12
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - 前端脚本
  - 技术折腾
  - 个人网站
  - 自定义提示条
description: "本文介绍了如何为 Butterfly 主题添加一个根据时间段自动显示问候语的 Snackbar 提示条功能。文章将一天划分为六个时段并对应不同问候语，通过 JavaScript 脚本判断首页后延迟一秒触发提示。同时详细说明了利用主题的 inject 配置项将脚本注入所有页面，并针对 Snackbar 自带的 Roboto 字体与网站 ZCOOLXiaoWei 字体不统一的问题，编写自定义 CSS 覆盖字体设置，使提示条外观与网站风格一致。整个过程轻柔自然，不干扰浏览体验，且支持灵活修改文案，为博客增添人情味。"
---

最近看到好友卡泽搞了一个网站提示条，在不同的时间段会提示你作者提前写好的内容，比如早上问好、晚上道晚安，甚至还能根据节日推送祝福语。这让我想起来以前用 Butterfly 主题和 Heo 主题时也见过类似的提示功能，当时就觉得这种小细节特别有意思。它不像弹窗那样烦人，也不像公告栏那样容易被忽略，而是以一种轻柔的方式出现在屏幕角落，给人一种有人在跟你打招呼的感觉。这的确能给网站增添一点“人味”，让冷冰冰的页面变得有温度，访客看到后也会会心一笑，觉得这个博客是有主人在用心经营的。

有意思的是，Butterfly 本身就内置了 Snackbar 提示条功能，而且我们可以完全自定义它的提示内容。具体实现可以参考主题的 `source/js/utils.js` 文件，里面定义了全局方法 `btf.snackbarShow`，这个方法封装了 Snackbar 库的调用逻辑，会自动读取你在配置文件中设置的位置和颜色。不过在使用之前，你得先在 `_config.butterfly.yml` 中把 Snackbar 功能开启，配置好它的位置（比如右下角）和亮暗模式下的背景色，这样调用时才能正常显示，否则 Snackbar 不会出现在页面上。

我把一天分成六个时段：早上（5 点到 7 点）、上午（8 点到 10 点）、中午（11 点到 12 点）、下午（13 点到 17 点）、晚上（18 点到 22 点）以及凌晨（其余时间）。每个时段都有对应的问候语，比如凌晨说“好梦”，早上和上午说“有个好心情”，中午说“午安”，下午和晚上则分别说“下午好”和“晚上好”。当用户访问首页时，脚本会先判断当前路径是否为首页，然后延迟一秒再触发 Snackbar，这样既不会打扰到页面加载，又能给访客一个小惊喜。于是，我便有了以下代码实现：

```javascript
(function () {
  function getTimePeriod() {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 8) return '早上'
    if (hour >= 8 && hour < 11) return '上午'
    if (hour >= 11 && hour < 13) return '中午'
    if (hour >= 13 && hour < 18) return '下午'
    if (hour >= 18 && hour < 23) return '晚上'
    return '凌晨'
  }

  function isHomePage() {
    return window.location.pathname === '/' || window.location.pathname === '/index.html'
  }

  if (isHomePage()) {
    setTimeout(() => {
      const period = getTimePeriod()
      btf.snackbarShow(`现在是${period}，祝你${period === '凌晨' ? '好梦' : period === '早上' || period === '上午' ? '有个好心情' : period === '中午' ? '午安' : period === '下午' ? '下午好' : '晚上好'}！`)
    }, 1000)
  }
})();
```

写好 JavaScript 脚本后，为了避免它无法在页面中运行，我还需要把它嵌入到 Butterfly 主题的每一个页面中。Butterfly 提供了一个非常方便的 inject 配置项，可以在所有页面的 `<head>` 或 `<body>` 底部注入自定义代码。我只需要把写好的 `reminder.js` 文件放到 `source/assets/js/` 目录下，然后在主题配置文件的 `inject.bottom` 中添加一行引用即可：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
    - <link rel="stylesheet" href="/assets/css/description.css">
    - <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@7.2.0/css/all.min.css">
    - <link rel="stylesheet" href="/assets/css/pagination.css">
    - <link rel="stylesheet" href="/assets/css/social.css">
    - <link rel="stylesheet" href="/assets/css/align.css">
    - <link rel="stylesheet" href="/assets/css/blur.css">
  bottom:
    # - <script src="xxxx"></script>
    - <script src="/assets/js/reload.js"></script>
    - <script src="/assets/js/stroll.js"></script>
    - <script src="/assets/js/blindbox.js"></script>
    - <script src="/assets/js/fans.js"></script>
    - <script src="/assets/js/mourn.js"></script>
    - <script src="/assets/js/birthday.js"></script>
    - <script src="/assets/js/reminder.js"></script>
```

但仅仅只是这样的话，还会出现一个问题，那就是 Snackbar 的字体和网站的不统一。如果你在浏览器里打开开发者工具查看 Snackbar 的样式，会发现它的字体明显和网站其他部分不一样，看起来有点突兀。于是我查询了一下 `source/js/utils.js` 的源码实现方式，发现 `btf.snackbarShow` 方法底层调用的是 Node Snackbar 这个第三方库。这个库自带了一套默认样式，已经为 Snackbar 指定了字体 `Roboto` 和 `14px` 的字体大小，而我的网站全局字体是 `ZCOOLXiaoWei`，字号是 `1rem`，两者放在一起就显得格格不入了：

```css
.snackbar-container {
  font-family: Roboto, sans-serif;
  font-size: 14px;
}
```

既然问题出在 Node Snackbar 自带的样式上，那解决思路就很明确了——我们只需要编写一段 CSS 来覆盖它的默认字体设置即可。因为 Snackbar 的容器类名是 `.snackbar-container`，我们直接针对这个类名重新指定 `font-family` 和 `font-size`，并加上 `!important` 来确保优先级足够高，这样就能覆盖掉库自带的 Roboto 字体了。新建一个 `snackbar.css` 文件放到 `source/assets/css/` 目录下，写入以下内容：

```css
.snackbar-container {
  font-family: 'ZCOOLXiaoWei', sans-serif;
  font-size: 1rem;
}
```

CSS 文件写好之后，还需要把它导入到主题中才能生效。和之前导入 JavaScript 脚本类似，我们同样利用 Butterfly 的 `inject` 配置项，在 `inject.head` 中添加一行 CSS 引用即可。需要注意的是，这行引用要放在字体文件 `fonts.css` 的后面，因为 Snackbar 的字体依赖于 `ZCOOLXiaoWei` 这个自定义字体，必须先加载字体再应用样式，否则浏览器不认识这个字体名称，覆盖也就没有意义了。更新后的配置如下：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
    - <link rel="stylesheet" href="/assets/css/description.css">
    - <link rel="stylesheet" href="/assets/css/pagination.css">
    - <link rel="stylesheet" href="/assets/css/social.css">
    - <link rel="stylesheet" href="/assets/css/align.css">
    - <link rel="stylesheet" href="/assets/css/blur.css">
    - <link rel="stylesheet" href="/assets/css/snackbar.css">
  bottom:
    # - <script src="xxxx"></script>
    - <script src="/assets/js/reload.js"></script>
    - <script src="/assets/js/stroll.js"></script>
    - <script src="/assets/js/blindbox.js"></script>
    - <script src="/assets/js/fans.js"></script>
    - <script src="/assets/js/mourn.js"></script>
    - <script src="/assets/js/birthday.js"></script>
    - <script src="/assets/js/reminder.js"></script>
```

这样无论是首页、归档页还是文章页，脚本和样式都会被自动加载，但由于我们在 JavaScript 代码中做了首页判断，所以只有访问首页时才会触发提示条，不会在其他页面造成干扰。现在当访客访问首页时，就能触发这个功能了。页面加载完成后，Snackbar 会从右下角缓缓弹出，显示当前时段对应的问候语，停留两秒后自动消失。而且由于我们覆盖了字体设置，Snackbar 的文字现在和网站其他部分保持一致，看起来就像是网站原生的一部分，不再有那种第三方组件乱入的割裂感。

整个过程轻柔自然，不会干扰用户的浏览体验。如果你觉得问候语不够个性化，也可以随时修改 `reminder.js` 中的文案，甚至可以根据不同的季节、天气或者节日来动态调整提示内容，让网站始终保持新鲜感。一个小小的提示条，就能让博客多一分人情味，何乐而不为呢？