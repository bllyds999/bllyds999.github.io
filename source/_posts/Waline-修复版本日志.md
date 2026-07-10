---
title: 修复版本日志：修改 Butterfly 配置，固定 Waline 版本避免问题
date: 2026-07-01 10:19:54
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Waline
  - Butterfly
  - 评论系统
  - 博客搭建
  - CDN
description: "本文介绍了由于 Waline 客户端更新导致 Butterfly 主题样式出现异常，例如多出按钮或布局变化，这些并非主题作者更新所致，而是 Waline 自身变动。为解决此问题，文章指导用户如何修改 Butterfly 主题内置的 Waline 版本以固定版本。具体步骤包括：确保使用 Butterfly 主题；找到主题配置文件末尾的 CDN 选项段；定位 waline_js 项，取消注释并指定版本，例如使用 https://unpkg.com/@waline/client@v3.8.0/dist/waline.js；修改后提交源码至 GitHub 等静态服务器，部署后检查评论区结构。文章还指出 Waline 将源码作为 JS 直接引用热更新虽快，但频繁更新无关样式功能反而带来不便，建议开源社区保持本体仅修复 BUG，样式由第三方维护。最终通过固定版本避免不必要的更新问题。"
---

因为 Waline 客户端更新最新版了，导致原本的 Butterfly 主题样式出了问题。比如说凭空多出来一些按钮，或是原本的布局变成了现在的新版布局。这些都不是主题作者的小更新做的，而是 Waline 自己做的。前端没法找到 Waline 的引入链接，但是有不清楚具体用了什么方式引入。而且博客网站不是一个随时可改的项目，人都是有精力的，不如固定版本好了。我就是这样抛弃 Memos 的，因为它总是改新版本。

这里就写一篇教程，教大家如何修改 Butterfly 主题内置 Waline 的版本。首先要确保你用的是 Butterfly 主题，这个不必多说。第二点是直到如何复制代码，我说的东西在哪一段。如果你是自己嵌入脚本的话，不建议看我这一篇了。首先找到主题配置文件的最后一段，可以看到关于 CDN 的选项，都是关于各种脚本、样式的 CDN，你可以指定自己的版本。我们找到 Waline JS 段，取消掉它的注释，并设置版本：

```yml
CDN:
  # The CDN provider for internal and third-party scripts
  # Options for both: local/jsdelivr/unpkg/cdnjs/custom
  # Note: Dev version can only use 'local' for internal scripts
  # Note: When setting third-party scripts to 'local', you need to install hexo-butterfly-extjs
  internal_provider: local
  third_party_provider: jsdelivr

  # Add version number to url, true or false
  version: true

  # Custom format
  # For example: https://cdn.staticfile.org/${cdnjs_name}/${version}/${min_cdnjs_file}
  custom_format:

  option:
    # abcjs_basic_js:
    # activate_power_mode:
    # algolia_js:
    # algolia_search:
    # aplayer_css:
    # aplayer_js:
    # artalk_css:
    # artalk_js:
    # blueimp_md5:
    # busuanzi:
    # canvas_fluttering_ribbon:
    # canvas_nest:
    # canvas_ribbon:
    # chartjs:
    # click_heart:
    # clickShowText:
    # disqusjs:
    # disqusjs_css:
    # docsearch_css:
    # docsearch_js:
    # egjs_infinitegrid:
    # fancybox:
    # fancybox_css:
    # fireworks:
    # fontawesome:
    # gitalk:
    # gitalk_css:
    # giscus:
    # instantpage:
    # katex:
    # katex_copytex:
    # lazyload:
    # local_search:
    # main:
    # main_css:
    # mathjax:
    # medium_zoom:
    # mermaid:
    # meting_js:
    # prismjs_autoloader:
    # prismjs_js:
    # prismjs_lineNumber_js:
    # pjax:
    # sharejs:
    # sharejs_css:
    # snackbar:
    # snackbar_css:
    # translate:
    # twikoo:
    # typed:
    # utils:
    # valine:
    # waline_css:
    waline_js: https://unpkg.com/@waline/client@v3.8.0/dist/waline.js
```

修改好后，把网站源码提交到 GitHub 或者别的什么静态网站服务器。部署好后重新检查一下页面评论区结构，确认好没什么问题后就能合上笔记本了。之前 Waline 修改前端源代码，导致后端版本用不了，实在是吓人。把源码作为 JS 直接引用的热更新，对比其它开源项目确实快了不知道多少。但是作为一个不需要更新的经常更新，确实有一点鸡肋的成分在了。我理解的开源社区，样式什么的，都是第三方做的，本体就修 BUG 好了。