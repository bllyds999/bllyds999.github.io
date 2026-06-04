---
title: Waline 邮箱提醒：七个环境变量一个都不能少
date: 2026-04-13 17:14:23
categories: 杂谈
cover: /assets/images/cover/other.webp
tags:
  - Waline
  - 邮箱提醒
  - SMTP 配置
  - 评论系统
  - 环境变量
description: "本文介绍了 Waline 评论系统配置邮箱提醒所需的环境变量，包括 AUTHOR_EMAIL、SITE_URL、SMTP_USER、SMTP_PASS、SMTP_HOST、SMTP_PORT 和 SITE_NAME，并强调一个也不能少。文章指出 SMTP_USER 和 AUTHOR_EMAIL 可以相同，也可使用域名邮箱；同时提醒在 Vercel 或 Docker 部署时，环境变量的写法差异——Docker 版 docker-compose.yml 中值不能带引号。全文旨在帮助已搭建好 Waline 的用户快速完成邮件通知配置，避免遗漏关键变量。"
---

Waline 官网对于这部分的介绍过于复杂，折腾的时候总是漏了配置几个变量。最近发现秋葵笔记的评论系统从 Giscus 换到了 Waline，貌似是看到了我写给别人的回复。突然想起来，自己好像没在网站上，写过关于 Waline 配置邮箱提醒的文章。如果你已经搭建好了 Waline 并且已经给博客网站用上了，你还需要配置这几个环境变量（一个也不能少）：

- `AUTHOR_EMAIL`：作者邮箱地址，用来接收读者评论通知。
- `SITE_URL`：网站 URL，用来生成评论通知中的链接。
- `SMTP_USER`：SMTP 用户名，填用来发提醒的那个邮箱，用来发送邮件。
- `SMTP_PASS`：SMTP 密码，不是邮箱密码，是邮箱授权码，用来发送邮件。
- `SMTP_HOST`：SMTP 主机地址，比如腾讯的 `smtp.qq.com`，用来发送邮件。
- `SMTP_PORT`：SMTP 端口号，比如腾讯的 `465`，用来发送邮件。
- `SITE_NAME`：网站名称，用来在评论通知中显示。

`SMTP_USER` 和 `AUTHOR_EMAIL` 可以是同一个；如果你不想泄露真实邮箱的话，可以给 `SMTP_USER` 配置一个域名邮箱。我是在 Vercel 上配置的环境变量，如果你是使用自己的服务器用 Docker 版部署的话，`docker-compose.yml` 里的环境变量不要写上引号，比如 `SMTP_USER: "no-reply@example.com"` 是错误的，要写成 `SMTP_USER: no-reply@example.com`。