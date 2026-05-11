---
title: 如何使用 Hexo 搭建博客网站
date: 2026-04-03 23:57:40
categories: Hexo 教程
cover: /assets/images/cover/hexo.webp
tags:
  - Hexo 教程
  - 博客搭建
  - Hexo
  - 个人网站
  - Node.js
description: "本文介绍了如何在不同操作系统（Windows、Linux 包括 Debian 和 Arch、macOS）上安装 Node.js，以及使用 NPM 安装 Hexo 博客框架。接着描述了初始化网站项目的步骤，即在一个空文件夹中运行 hexo init 命令。然后详细说明了修改 config.yml 配置文件的方法，包括设置网站标题、副标题、描述、关键词、作者、语言和时区等参数，并给出了示例配置。最后介绍了通过 hexo server 命令启动本地服务器，并在浏览器中访问 localhost:4000 查看网站。整个过程覆盖了从环境搭建到网站运行的基本流程，适合初学者快速搭建个人博客。"
---

## 安装 Node.js

### Windows

运行：

```shell
curl -O https://nodejs.org/dist/v24.14.1/node-v24.14.1-arm64.msi && start node-v24.14.1-arm64.msi
```

按照提示，进行一步一步操作，记得配置环境变量。

### Linux

#### Debian

运行：

```shell
sudo apt install nodejs
```

#### Arch

运行：

```shell
sudo pacman -S nodejs
```

### macOS

运行：

```shell
brew install nodejs
```

## 安装 Hexo

运行：

```shell
npm install hexo-cli -g
```

## 初始化网站

找到一个空文件夹，进入运行：

```shell
hexo init
```

命令完成后会将当前文件夹作为网站项目根目录。

## 修改配置文件

打开 `config.yml`，你会看到：

```yml
title: Hexo # 网站标题
subtitle: '' # 网站副标题
description: '' # 网站描述
keywords: # 网站关键词
author: John Doe # 作者名字
language: en # 语言
timezone: '' # 时区
```

修改为以下参数：

```yml
title: 文文的博客网站
subtitle: 记录学习、生活、大学经历
description: 你好，我是文文，我们一起进步！
keywords: 学习, 文文, 博客, 大学, 生活
author: 文文
language: zh-CN
timezone: Asia/Shanghai
```

其中 `文文的博客网站` 是网站标题，`记录学习、生活、大学经历` 是网站副标题。`你好，我是文文，我们一起进步！` 是网站描述，`学习, 文文, 博客, 大学, 生活` 是网站关键词，这两处用于 SEO。`文文` 是作者名字，`zh-CN` 是语言，`Asia/Shanghai` 是时区。

## 启动网站

运行：

```shell
hexo server
```

命令完成后会打开浏览器，访问 `localhost:4000`，显示网站。