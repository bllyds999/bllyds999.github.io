---
title: 网站纪念日自动变灰功能的 JS 实现方法
date: 2026-04-18 22:15:43
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - Hexo
  - 前端脚本
  - 技术折腾
  - 网站默哀
description: "本文介绍了如何使用一段简单的 JavaScript 代码为网站添加默哀功能，即在特定纪念日自动将网页元素从彩色变为灰白色。代码通过检测当前日期是否匹配清明节、国家公祭日、汶川地震纪念日、七七事变纪念日、九一八事变纪念日、烈士纪念日、日本投降纪念日以及毛泽东、周恩来、邓小平逝世纪念日等日期，若匹配则对 document.documentElement 应用 grayscale(100%) 滤镜。文章还说明了需在主题配置文件中通过 inject 方式导入该 JS 脚本，并提供了示例配置代码段。整体实现简洁，无需额外提醒文字，仅通过视觉变化体现默哀。"
---

所谓的默哀功能，其实就是网站元素整个变色：从彩色变成灰白色，再加个提醒说今天是什么日，为什么需要默哀。因为我压根不想提醒，所以用到的东西也不多，只是一段很简单的检测日期变色 JS 代码：

```javascript
(function() {
  const now = new Date;
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const isQingming = month === 4 && (day === 4 || day === 5);
  const isNationalMemorialDay = month === 12 && day === 13;
  const isWenchuan = month === 5 && day === 12;
  const isMarcoPoloBridge = month === 7 && day === 7;
  const isMukden = month === 9 && day === 18;
  const isMartyrsDay = month === 9 && day === 30;
  const isJapanSurrender = month === 8 && day === 15;
  const isZhouEnlaiDeath = month === 1 && day === 8;
  const isDengXiaopingDeath = month === 2 && day === 19;
  const isMaoDeath = month === 9 && day === 9;

  if (isQingming || isNationalMemorialDay || isWenchuan || isMarcoPoloBridge || isMukden || isMartyrsDay || isJapanSurrender || isMaoDeath || isZhouEnlaiDeath || isDengXiaopingDeath) {
    document.documentElement.style.filter = 'grayscale(100%)';
  }
})();
```

这段代码通过检测今天是否是对应日期（清明节、国家公祭日、汶川地震纪念日、七七事变纪念日、九一八事变纪念日、烈士纪念日、日本投降纪念日、毛泽东逝世纪念日、周恩来逝世纪念日、邓小平逝世纪念日）来判断网站是否需要开启默哀模式。为了保证代码能够运行，还需要编辑主题配置文件，导入这个 JS 代码：

```yml
inject:
  head:
    # - <link rel="stylesheet" href="/xxx.css">
    - <link rel="stylesheet" href="/assets/css/fonts.css">
    - <link rel="stylesheet" href="/assets/css/svg.css">
    - <link rel="stylesheet" href="/assets/css/description.css">
  bottom:
    # - <script src="xxxx"></script>
    - <script src="/assets/js/reload.js"></script>
    - <script src="/assets/js/stroll.js"></script>
    - <script src="/assets/js/blindbox.js"></script>
    - <script src="/assets/js/fans.js"></script>
    - <script src="/assets/js/mourn.js"></script>
```

现在代码就生效了，剩下的就是等到时候了（其实也没必要特别等）。