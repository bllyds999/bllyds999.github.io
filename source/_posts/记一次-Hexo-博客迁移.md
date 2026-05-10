---
title: 记一次 Hexo 博客迁移
categories: 杂谈
cover: /assets/images/cover/other.webp
date: 2026-04-18 11:46:35
tags:
  - Hexo
  - 个人网站
  - Cloudflare
  - Pages
  - 技术折腾
---

今天凌晨的时候正在折腾网站美化，添加了一些新字体，精简化了字体子集。当我推送到 GitHub 时，发现我的账号被 Masked 了。中文翻译过来就是封号，我也不知道为什么，可能和我使用了域名邮箱有关系。断了 GitHub 可不行，那是可是程序员的命根子，我网站放在那里的，你让我以后怎么更新个人网站？

实在不行就迁移网站嘛，大不了 GitHub 不用了。反正我不用梯子的话，GitHub 跟不存在没啥区别，况且我的网站在国内有备份。一个成熟的站长，就应该习惯各种备份方式。如果只是单纯放在 GitHub 上，指不定哪天像现在被外国佬封了可就是真哦吼了。Cloudflare Pages 支持直接文件夹拖拽部署，我只需要在本地编译好这些页面上传到 Cloudflare Pages 就行了，比以前麻烦，上传速度也不算慢。

但是我发现 Cloudflare Pages 是真的快啊！我现在收回那句话，Cloudflare Pages 比 Vercel 牛逼！当然，也有我写缓存缓存的功劳。至于 GitHub 死一边去吧！微软那德行指不定哪天把这个网站搞成最烂的开源网站。有 Codeberg 玩 Codeberg，没 Codeberg 玩 Gitee 那些的。最终还是各回各家、各找各妈，赶紧去备份代码吧！