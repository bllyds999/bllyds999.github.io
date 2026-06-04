---
title: Hexo 博客 Butterfly 主题安装，与配置完整教程指南
date: 2026-04-04 08:48:16
updated: 2026-04-09 23:08:00
categories: Hexo 教程
cover: /assets/images/cover/hexo.webp
tags:
  - Hexo
  - Butterfly
  - Hexo 教程
  - CSS 美化
  - 个人网站
description: "本文介绍了 Hexo Butterfly 主题的安装与详细配置方法。文章从安装主题开始，指导用户修改 Hexo 配置文件并复制主题配置文件。随后依次讲解了导航栏、菜单、代码块、社交链接、图片设置、首页字幕、目录、文章版权、分页、过期提示、页脚、侧边栏（作者卡片、公告、最新评论、运行时间）、繁简转换、暗黑模式、滚动百分比、复制设置、字数统计、搜索、分享、评论系统（推荐 Waline）、主题颜色、字体、加载动画、特效、图片灯箱、PJAX、懒加载及注入代码等模块的配置选项。此外还说明了分类、标签、友链、说说等页面的创建与数据文件编写方式。最后给出了初始化 Git 仓库和部署建议。本文适合希望个性化搭建 Hexo 博客并使用 Butterfly 主题的开发者参考。"
---

## 安装 Butterfly 主题

```shell
npm install hexo-theme-butterfly
```

## 修改配置文件

打开 `_config.yml` 文件，将以下内容：

```yml
theme: landscape
```

修改成：

```yaml
theme: butterfly
```

保存文件。

## 复制配置文件

运行：

```shell
cp -rf node_modules/hexo-theme-butterfly/_config.yml _config.butterfly.yml
```

以后要改主题的话，就是这个配置文件了。

## 配置主题

打开 `_config.butterfly.yml` 文件。

### 导航栏配置

```yaml
nav:
  logo: /assets/images/logo.ico
  display_title: true
  display_post_title: false
  fixed: true
```

- `logo`: 导航栏 logo 图片路径
- `display_title`: 是否显示标题
- `display_post_title`: 是否显示文章标题
- `fixed`: 是否固定导航栏

推荐使用 macOS 自带的去背景功能将图片背景去掉，或者在网上找一个去除图片背景的工具，主要是我目前的确没找到啥好的在线工具。`.ico` 不是必要的，但是考虑到大多数网站和静态页面部署都只支持 `.ico`，所以建议使用 `.ico`，在网上找一个图片转换器即可。这个我有推荐，可以查看我的友链页面。

### 菜单配置

```yaml
menu:
  首页: / || fas fa-home
  动态: /shuoshuo || fas fa-comment
  文章: /archives || fas fa-archive
  标签: /tags || fas fa-tag
  合集: /categories || fas fa-folder
  友链: /friends || fas fa-link
```

格式为 `菜单名: 路径 || 图标`。

### 代码块配置

```yaml
code_blocks:
  theme: light
  macStyle: true
  height_limit: false
  word_wrap: false
  copy: true
  language: true
  shrink: false
  fullpage: true
```

- `macStyle`: Mac 风格代码块
- `fullpage`: 全屏查看按钮

### 社交链接

```yaml
social:
  fab fa-bilibili: https://space.bilibili.com/xxx || 哔哩哔哩 || '#FF6699'
  fab fa-github: https://github.com/xxx || Github
  fas fa-envelope: mailto:xxx@qq.com || 电子邮箱 || '#4a7dbe'
```

格式为 `图标: 链接 || 描述 || 颜色`，这里将 `xxx` 替换为你自己的账号。

### 图片设置

```yaml
favicon: /assets/images/logo.ico

avatar:
  img: /assets/images/avatar.webp
  effect: false

default_top_img: /assets/images/top.webp
footer_img: /assets/images/footer.webp
```

- `favicon`: 网站图标
- `avatar`: 头像设置
- `default_top_img`: 默认顶部图片
- `footer_img`: 页脚图片

这里的 `favicon` 就是刚刚的 `logo.ico`，剩下的十分建议使用 `webp` 格式的。这里有一个网站设计小技巧，我们的 `top.webp` 和 `footer.webp` 其实是同一张图片的不同部分。`top.webp` 是图片的完整部分，`footer.webp` 是需要裁剪的图片底部部分。这样就能保证 `footer.webp` 不会和 `top.webp` 一样，不同设备看到的设计都差不多。

### 首页字幕

```yaml
subtitle:
  enable: true
  effect: true
  typed_option:
  source: 3
```

- `effect`: 打字机效果
- `source`: 字幕来源，1 为 hitokoto.cn，2 为一言 API，3 为今日诗词

### 目录设置

```yaml
toc:
  post: true
  page: true
  number: true
  expand: false
  style_simple: true
  scroll_percent: true
```

- `style_simple`: 简洁样式
- `scroll_percent`: 显示滚动百分比

### 文章版权

```yaml
post_copyright:
  enable: true
  decode: true
  author_href:
  license: CC BY-NC-SA 4.0
  license_url: https://creativecommons.org/licenses/by-nc-sa/4.0/
```

- `decode`: 解码作者链接

非常建议打开的一个功能，会在文章下方显示你的作者信息和文章信息。

### 文章分页

```yaml
post_pagination: 2
```

- `1`: 下一篇链接到旧文章
- `2`: 下一篇链接到新文章
- `false`: 禁用分页

这里我改成了 `2`，因为我是按照时间顺序发教程的，怕乱。

### 过期提示

```yaml
noticeOutdate:
  enable: true
  style: simple
  limit_day: 365
  position: bottom
  message_prev: 该文章距离发布时间已经过去了
  message_next: 天，请注意文章内容是否已过期！
```

这个对教程、科普、实事类的文章都很有大帮助，可以提醒别人文章是否过期，建议打开。

### 页脚设置

```yaml
footer:
  owner:
    enable: true
    since: 2026
  copyright:
    enable: true
    version: true
  custom_text: |
    <span><a href="/sitemap.xml">网站地图</a><span>
    <span><a href="/atom.xml">订阅</a><span>
```

这一部分是给访客和爬虫看的，搜索引擎的爬虫爬取网站首页时发现可以爬取网站地图，于是就回去爬取网站地图；而访客看到这里的订阅，会点击跳转 RSS 链接。

### 侧边栏配置

```yaml
aside:
  enable: true
  hide: false
  button: true
  mobile: true
  position: left
```

- `position`: 侧边栏位置，left 或 right

#### 作者卡片

```yaml
card_author:
  enable: true
  description: 今天空气真好，天气真不错！
  button:
    enable: true
    icon: fas fa-star
    text: 关注我，了解最新动态
    link: javascript:alert('按下 Ctrl + D 或者 Command + D 就可以收藏本站啦！')
```

这是一段简单的 JavaScript 脚本，它的浏览器导航栏格式的。当用户点击这个“关注我”按钮，就会跳转到 `link` 预设好的链接，如果改成导航栏格式的 JavaScripti，则会执行 Javascript，弹窗 `按下 Ctrl + D 或者 Command + D 就可以收藏本站啦！`。这是一个非常好玩的效果，如果你会 JS，可以试一下改成别的。

#### 公告卡片

```yaml
card_announcement:
  enable: true
  content: 不定时更新各种关于我生活的事情，包括但不限于个人生活、工作经历、项目经历等。希望在下半年里，我们共同进步！
```

这里的 `content` 是公告卡片的内容，你可以根据自己的情况修改，它会显示在网站个人卡片的下面。如果你的 `description` 塞不下那么多，可以考虑放到这里。

#### 最新评论

```yaml
card_newest_comments:
  enable: true
  limit: 6
```

这个仅支持 Waline、Valine、Twikoo 之类的可以查询数据库的评论系统，Giscus 和 Utterances 貌似不支持。如果你用 Giscus 和 Utterances，可以考虑关掉了。

#### 运行时间

```yaml
card_webinfo:
  runtime_date: 2026/4/3
```

这里会展示网站的运行时间，单位是天，我是从 2026 年 4 月 3 号开始运行网站的。

### 繁简转换

```yaml
translate:
  enable: true
  default: 繁
```

### 暗黑模式

```yaml
darkmode:
  enable: true
  button: true
  autoChangeMode: 1
```

不建议打开自动暗黑，主题变化区别太大了，除非你总是喜欢切换主题之类的。

### 滚动百分比

```yaml
rightside_scroll_percent: true
```

### 右侧按钮

```yaml
rightside_item_order:
  enable: true
  hide: darkmode
```

### 复制设置

```yaml
copy:
  enable: true
  copyright:
    enable: true
    limit_count: 150
```

- `limit_count`: 复制超过指定字数时添加版权信息

如果你不是为了原创的话，十分不建议打开这个功能。按下代码复制按钮会把作者信息也给复制过去，对原创友好，对于学习者折磨。

### 字数统计

需要先安装插件：

```shell
npm install hexo-wordcount
```

然后配置：

```yaml
wordcount:
  enable: true
  post_wordcount: true
  min2read: true
```

### 搜索功能

按照上一篇文章安装 `hexo-generator-search` 插件：

```
npm install hexo-generator-search
```

配置：

```yaml
search:
  use: local_search
```

### 分享设置

```yaml
share:
  sharejs:
    sites: wechat,weibo,qq
```

原本是包含国外社交媒体的，但是我觉得用不到，就改成只有国内社交媒体了。

### 评论系统

```yaml
comments:
  use: waline
  text: true
  lazyload: false
  count: true
  card_post_count: true

waline:
  serverURL: https://comments.xxx.top/
```

我选择 Waline，因为它和主题契合度很高！大部分的 Waline 都设置了安全域名，而且别人的 Waline 配置了作者邮箱和评论邮件提醒。你需要自己部署一个，可以上 Vercel 部署，那是免费的。建议改成自己的域名，因为 Vercel 主域名无法在国内访问。

### 主题颜色

```yaml
theme_color:
  enable: true
  main: "#00687A"
  paginator: "#4B6269"
  button_hover: "#575D7E"
  text_selection: "#7FD1E7"
  link_color: "#00687A"
  meta_color: "#3F484B"
  hr_color: "#70797C"
  code_foreground: "#BA1A1A"
  code_background: "rgba(27, 31, 35, .05)"
  toc_color: "#00687A"
  blockquote_padding_color: "#00687A"
  blockquote_background_color: "#ACEDFF"
  scrollbar_color: "#00687A"
  meta_theme_color_light: "#f5fafc"
  meta_theme_color_dark: "#0f1416"
```

这里是我网站自己的主题配色方案，根据图片修改的，你们可以用 `matugen` 生成一个自己的配色方案。如果你不会配置的话，保持这里默认即可。

### 字体设置

```yaml
font:
  global_font_size: 16px
  code_font_size: 16px
  font_family: 'ZCOOLXiaoWei, sans-serif'
  code_font_family: 'Fira Code, monospace'
```

这里需要下载字体到网站，放到 `source/assets/fonts` 目录，这是两个字体的下载链接：

- [ZCOOLXiaoWei](/assets/fonts/ZCOOLXiaoWei-Regular.woff2)
- [Fira Code](/assets/fonts/FiraCode-Light.woff2)

需要编写一个 `font.css` 放到 `source/assets/css/` 目录：

```css
@font-face
{ 
    font-family: 'ZCOOLXiaoWei';
    src: url('/assets/fonts/ZCOOLXiaoWei-Regular.woff2');
}

@font-face
{ 
    font-family: 'FiraCode';
    src: url('/assets/fonts/FiraCode-Light.woff2');
}
```

最后[导入](#注入代码) CSS 文件。

### 加载动画

```yaml
preloader:
  enable: true
  source: 2
```

- `source`: 1 为全屏加载，2 为进度条

### 文章美化

```yaml
beautify:
  enable: true
  field: site
```

### 特效设置

```yaml
activate_power_mode:
  enable: true
  colorful: true
  shake: true
  mobile: false

canvas_nest:
  enable: true
  color: '0,0,255'
  opacity: 0.7
  zIndex: -1

fireworks:
  enable: true
  zIndex: 9999
  mobile: true
```

- `activate_power_mode`: 打字特效
- `canvas_nest`: 背景线条特效
- `fireworks`: 鼠标点击烟花特效

### 图片灯箱

```yaml
lightbox: fancybox
```

添加了这个，你的网站的图片就可以放大看了。

### PJAX

```yaml
pjax:
  enable: true
```

它可以让浏览器缓存你的网站文件，下次访问时就不需要重新加载。

### 懒加载

```yaml
lazyload:
  enable: true
  native: true
  field: site
  blur: true
```

它可以让图片在加载时模糊，等图片加载完成后再显示，避免图片加载时的卡顿。

### 注入代码

```yaml
inject:
  head:
    - <link rel="stylesheet" href="/assets/css/fonts.css">
```

可以在这里注入自定义 CSS 或 JS。

## 配置页面

### 分类页面

```shell
hexo new page categories
```

修改成：

```yml
---
title: 分类
date: 2026-04-03 22:29:06
type: categories
---
```

### 标签页面

```shell
hexo new page tags
```

修改成：

```yml
---
title: 标签
date: 2026-04-03 22:29:03
type: tags
---
```

### 友链页面

```shell
hexo new page friends
```

修改成：

```yml
---
title: 友链
date: 2026-04-03 22:29:23
type: link
---
```

#### 友链展示

在 `source` 下新建一个 `_data` 文件夹，里面新建一个 `link.yml`，以后友链就在这里加了，这是我的配置：

```yml
- class_name: 我的朋友
  class_desc: 我添加的友情链接！
  link_list:
    - name: 梁栋烨
      link: https://090909.top/
      avatar: /assets/images/friend.svg
      descr: 我看的博主绝不会停更，不会！
    - name: 王科文
      link: https://wcowin.work/
      avatar: /assets/images/friend.svg
      descr: 写的 MkDocs 教程很好！
    - name: 老米小芬
      link: https://lm-xiao-fen.github.io/
      avatar: /assets/images/friend.svg
      descr: 这个懒狗好像不咋写博客诶！
    - name: 微风
      link: https://passage.breeze.moe/
      avatar: /assets/images/friend.svg
      descr: 是常发互相邮件的朋友哒！
    - name: 可乐
      link: https://cola0908.top/
      avatar: /assets/images/friend.svg
      descr: 他真的很喜欢网络安全！
    - name: 慕迟离
      link: https://muchili-code.github.io/
      avatar: /assets/images/friend.svg
      descr: 体制内的好像不咋更新吧？
    - name: 峰哥
      link: https://fengcblog.880200.xyz/
      avatar: /assets/images/friend.svg
      descr: 他拍的照片真的很好看！
    - name: 秋葵
      link: https://qiukui-note.happy365.day/
      avatar: /assets/images/friend.svg
      descr: 他写的笔记很好，我很喜欢！
    - name: 周配萝卜
      link: https://blog.zplb.top/
      avatar: /assets/images/friend.svg
      descr: 好朋友，好像还是个二次元！

- class_name: 实用工具
  class_desc: 我分享的实用工具！
  link_list:
    - name: 图片压缩
      link: https://www.yysuni.com/image-toolbox
      avatar: /assets/images/tool.svg
      descr: 前端大佬写的图片压缩工具！
    - name: 格式转换
      link: https://www.freeconvert.com/
      avatar: /assets/images/tool.svg
      descr: 最喜欢的免费文件格式在线转换工具！
    - name: 代码仓库
      link: https://github.com/
      avatar: /assets/images/tool.svg
      descr: 这简直是最开源的一集！
    - name: 触屏笔记
      link: https://speedynote.org/
      avatar: /assets/images/tool.svg
      descr: 群里群主开发的 PDF 触屏笔记工具！
```

我是教程作者，放我自己在这里很合理吧！这是我用到的图标文件：

- [友链](/assets/images/friend.svg)
- [工具](/assets/images/tool.svg)

### 说说页面

```shell
hexo new page shuoshuo
```

修改成：

```yml
---
title: 说说
date: 2026-04-03 22:29:16
type: shuoshuo
```

#### 配置说说

在 `source` 下新建一个 `_data` 文件夹，里面新建一个 `shuoshuo.yml`，以后说说就在这里写了，你可以这样写：

```yml
- date: 2026-04-04 01:53:02 # 时间
  key: 5 # 说说标识符，可以理解成标题，不能重复，不写不能开启评论
  content: | # 你要写的话，这里用管道表示多行内容
    肚子好饿，我吃碗面。
```

## 初始化仓库

```shell
git init
git add .
git commit -m "网站修改完成"
```

接下来绑定到你的 GitHub 仓库即可，推送上去后用 Vercel 部署，就不需要自己写 Actions 了。

## 写在最后

当然，新人博主，如果有什么错误的地方，欢迎评论区大佬指正。