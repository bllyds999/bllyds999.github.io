---
title: 主流的 Hexo 部署平台
categories: Hexo 教程
cover: /assets/images/cover/hexo.webp
date: 2026-04-04 17:32:09
tags:
  - Hexo 教程
  - 部署平台
  - Vercel
  - Cloudflare Pages
  - GitHub Pages
---

## Vercel

Vercel 部署 Hexo 可以说是非常简单。如果大家有域名的话，非常推荐在 Vercel 上部署——速度快、稳定、安全。用 GitHub 登录 Vercel 账号，导入你在 GitHub 的 Hexo 仓库，点击部署。稍等片刻，你的网站就部署好了！缺点是如果没有域名的话，默认的 `vercle.app` 国内已经屏蔽，你需要购买一个域名。单纯想写博客玩玩的不推荐，如果是想长期写博客，建议购买域名。

## Cloudflare Pages

Cloudflare Pages 是 Cloudflare 提供的静态网站部署平台，非常简单、稳定、安全，速度仅次于 Vercel。和 Vercel 一样，Cloudflare 拥有除大陆外各国的 CDN，并且部署也十分简单，只需要导入你的 GitHub 仓库即可。它会检测网站类型，自动构建部署。和 Vercel 一样，默认的 `workers.dev` 国内已经屏蔽，你需要购买一个域名。

## Netlify

Netlify 是 Netlify 提供的静态网站部署平台，非常简单、稳定、安全，速度仅次于 Vercel。和 Vercel 一样，Netlify 拥有除大陆外各国的 CDN，并且部署也十分简单，只需要导入你的 GitHub 仓库即可。它会检测网站类型，自动构建部署。和 Vercel 不同的是，默认的 `netlify.app` 国内没有屏蔽，你不需要购买一个域名。

## GitHub Pages

最简单、最慢、最麻烦的静态网站部署平台。说它简单，是因为只需要有个 GitHub 账号就可以开始部署，域名是你的账号名字加上 `github.io`，比较好记；说它慢，是因为它的速度不如前面介绍的所有部署平台，它只有一个美国服务器，CDN 也比上面介绍过的部署平台少；说它麻烦，是因为它默认只支持静态页面和 Jekyll 的部署，没有检测网站功能，如果你需要部署除了 Jekyll 和静态页面以外的网站，需要改成 Actions 部署，并且自己写一个 Actions。但是好处 `github.io` 是大陆可以访问，并且很多站长都用过这个。

## 结语

个人推荐 Vercel，其次是 Cloudflare Pages，之后是 Netlify。如果你实在没得选，GitHub Pages 是不错的选择。