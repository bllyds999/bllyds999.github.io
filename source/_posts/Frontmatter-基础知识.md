---
title: Frontmatter 基础知识
date: 2026-04-04 23:39:16
categories: Hexo 教程
cover: /assets/images/cover/hexo.webp
tags:
  - Hexo
  - Frontmatter
  - 技术折腾
  - 个人网站
  - Hexo 教程
description: "本文介绍了 Hexo 静态博客中 Frontmatter 的各项元数据字段及其作用，包括标题、日期、标签、分类、封面、更新日期、摘要、关键词、目录、评论和置顶等。通过 YML 格式的 Frontmatter，用户无需数据库即可管理文章信息，并控制文章在网站中的显示方式与排序。文章详细解释了每个字段的配置方法，例如封面使用 cover 关键字、置顶通过 sticky 设置数值等，旨在帮助读者快速掌握 Hexo 文章元数据的配置技巧，提升博客搭建效率。"
---

```markdown
---
title: 你好，世界 # 文章标题
date: 2026-04-04 23:39:16 # 文章日期
tags: # 文章标签
  - 你好
  - 世界
categories: 世界树 # 文章分类
cover: /assets/images/cover/sekai.webp # 文章封面
---

你好，这是我的第一篇文章！
```

因为静态博客网站没有数据库，所以 Hexo 使用 Frontmatter 来存储文章的元数据。Frontmatter 是文章的元数据，是 YML 格式，包括文章的标题、日期、标签、分类等。不同网站生成器的 Frontmatter 关键字不同，比如 Jekyll 的封面是 `image`，Hexo 的封面是 `cover`。

## 标题

```yml
title: 你好，世界 # 文章标题
```

它在构建后会渲染为网站文章的标题，显示在文章的顶部。

## 日期

```yml
date: 2026-04-04 23:39:16 # 文章日期
```

它会显示文章的发布日期，并决定文章的排序。一般先写的在后面，后写的在前面。

## 标签

```yml
tags: # 文章标签
  - 你好
  - 世界
```

它会将文章分类到指定的标签中，方便用户根据标签进行筛选。

## 分类

```yml
categories: 世界树 # 文章分类
```

它会将文章分类到指定的分类中，方便用户根据分类进行筛选。

## 封面

```yml
cover: /assets/images/cover/sekai.webp # 文章封面
```

它会将图片渲染为网站文章的封面，显示在文章的首页和文章详细页的顶部。

## 更新日期

```yml
updated: 2026-04-05 12:00:00 # 更新日期
```

它会显示文章的更新日期，告诉读者这篇文章最近有更新。

## 摘要

```yml
description: 这是一篇关于 Frontmatter 的基础教程 # 文章摘要
```

它会显示在文章列表和搜索引擎结果中，帮助读者快速了解文章内容。

## 关键词

```yml
keywords:
  - Hexo
  - Frontmatter
  - 教程 # 文章关键词
```

它会写入网页的 meta 标签，用于搜索引擎优化（SEO）。

## 目录

```yml
toc: true # 显示目录
```

它控制文章是否显示目录，默认为 `true`。设为 `false` 可以隐藏目录。

## 评论

```yml
comments: true # 开启评论
```

它控制文章是否开启评论功能，默认为 `true`。设为 `false` 可以关闭评论。

## 置顶

```yml
sticky: 100 # 文章置顶
```

它会让文章固定在列表顶部，数值越大越靠前。适合用于公告或重要文章。