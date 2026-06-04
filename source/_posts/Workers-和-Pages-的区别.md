---
title: Cloudflare Workers 与 Pages：从冷启动到静态部署的全面对比
categories: 杂谈
cover: /assets/images/cover/other.webp
date: 2026-04-19 03:18:36
tags:
  - Cloudflare
  - Workers
  - Pages
  - 技术折腾
  - Hexo
description: "本文介绍了 Cloudflare Workers 与 Pages 两种原生部署模式的区别。文章从域名入手，指出 Workers 使用 workers.dev 而 Pages 使用 pages.dev。接着深入分析 Workers 的两种形态：Serverless 和静态 Workers。Serverless 以函数形式处理请求，存在冷启动问题，仅有算力无存储，需搭配云数据库如 Neon、MongoDB 使用；静态 Workers 则能连接 GitHub 仓库自动构建静态站点，但每次需回源计算，无法充分利用 Cache Rules。文章还对比了 Workers 与 Pages 在部署流程上的差异，并提供了使用 Wrangler 命令行工具推送代码到 Pages 或 Workers 的实战示例，帮助读者根据项目类型选择合适方案。"
---

最近把网站从 Vercel 整体迁移到了 Cloudflare Pages，能直观地感受到速度比以前快了很多。由此接触到了两种 Cloudflare 的原生部署模式——Workers 和 Pages，稍微折腾了一下发现它们其实是不一样的，我决定出篇文章详细地讲讲它们之间的区别。

首先是域名上，Workers 的域名是 `workers.dev`，Pages 的域名是 `pages.dev`。其次是行为模式，Workers 分为 Serverless 和静态 Workers。Serverless 就是少服务器的意思，每一个部署在 Serverless 上的服务不叫“服务端”而是叫“函数”。只因它的表现模式真的是函数，平时这些 Serverless 会进入休眠状态，当你的 Serverless 被访问激活时，会像函数一样处理来自这个域名的访问请求，它会在服务器持续运行一段时间。这个从运行到启动一段时间的过程，被广义上称为“冷启动”，需要一定的等待时间。

你的请求结果会从这个域名返回，当无人看守时又继续进入睡眠。因此从结果上看，就和有服务端的服务没啥区别，它们都能处理问题；区别就是 Serverless 只有算力、没有存储，因此需要为其配备云数据库。在没有服务器的情况下，你当然可以编写一个有后端的网站，用 Serverless 就可以做到，数据库可以选择一些在线的厂商，我认识的就 Neon、MongoDB 这些。很多 Node.js 写的软件都可以主动适配支持 Serverless，比如说 Waline、Twikoo，它们不仅可以通过后端部署在本地，还可以通过 Serverless 跑在云端。

如果你实在不知道 Workers 是什么意思，其实你可以理解为一种 Actions，它们都是为了完成某个特定的任务而借助云服务器的算力。讲完了 Serverless，我们来说说静态 Workers，你可以使用 Cloudflare Workers 连接你的网站 GitHub 仓库，每次推送的时候就会触发网站的 Workers 构建运行。Workers 会自动识别网站类型，比如 Jekyll、Hexo，准备对应的环境进行接下来的页面编译工作，构建成果会放在 `workers.dev`，而不是 `pages.dev`。你可以构建静态页面上传到 `workers.dev`，虽然不知何意味。

也就是说，其实你第一次觉得所谓的导入仓库就编译、很方便的这一步，其实是 Workers 而不是 Pages。静态 Workers 既然是 Workers，肯定是要跟算力扯上关系的，就算你的网站仓库上面全是静态文件，它也需要回源进行计算，貌似没法充分利用 Cache Rules。如果你的网站全是静态文件，那你就要看准点了。实际上 Workers 和 Pages 并不强依赖一个 GitHub 网站仓库，这意味着其实没必要 GitHub 账号，因为 Cloudflare 允许你使用 Wrangler 管理上传源代码。既然我们找不到 Pages 入口，不如集成到工作流：

```shell
# 在项目文件夹安装 Wrangler
npm install wrangler

# 使用命令行登录 Cloudflare
npx wrangler login

# 推送页面构建成果到 Pages
npx wrangler pages deploy ./public --project-name=项目名字

# 推送源代码文件到 Workers
npx wrangler deploy 项目脚本 --project-name=项目名字
```

Cloudflare 官方推荐你修改 `package.json` 的 `script` 部分进行集成，比如我的 Hexo 网站：

```json
  "scripts": {
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "wrangler pages deploy ./public --project-name=liangdongye999",
    "server": "hexo server"
  },
```

每次运行命令就是 `npm run build && npm run deploy`，这样子就可以更加方便地进行网站推送了。