---
title: Brave 浏览器升级后：macOS 访问页面出现横杠，降级轻松解决
date: 2026-06-09 14:49:46
categories: 杂谈
cover: /assets/images/cover/other.webp
tags:
  - Brave 浏览器
  - macOS
  - 系统错误
  - 覆盖安装
  - 使用体验
description: "本文介绍了 Brave 浏览器在 macOS 15 系统下的 MacBook Air M4 上出现的一个显示问题。当用户访问其他网站时，浏览器界面中会无故出现一条与浏览器配色一致的水平横杠，且刷新页面后横杠暂时消失，但重新访问同一网站或打开新页面时横杠会再次出现。解决该问题的方法非常简单：彻底关闭正在运行的 Brave 浏览器，然后通过指定链接下载上一个版本的 Brave 安装包，重新运行覆盖安装即可。覆盖安装后，所有异常现象均会消失，无需额外设置。文章还指出，若降级使用旧版本，可能需要等到下下个版本发布才能收到官方的正式修复，目前覆盖安装是最直接有效的方案。作者不确定此问题是否仅存在于 Brave，但希望开发团队能及时修复。"
---

我的 Brave 浏览器最近升级到了最新版本，但在 macOS 系统下却出现了一个令人困扰的问题。我目前使用的电脑是 MacBook Air M4，系统版本为 macOS 15，这套软硬件组合在用户群体中非常普遍，可以说是最为标准的配置之一。然而就在这样一套毫无特殊性的环境下，问题却出现了：每当我访问其它网站时，浏览器界面中会莫名其妙地多出一条横杠，而且这条横杠的颜色与浏览器自身的配色方案完全一致，看起来就像是界面本身的一部分。

关于这条横杠的具体尺寸，我无法确定它是否与地址栏的高度一致，因为当时我着急解决问题，没有来得及截图就匆忙更换了浏览器版本。不过有一点是可以确认的：每当我刷新当前页面之后，那条横杠会暂时消失，看起来问题似乎得到了解决。但只要我重新访问同一个网站，或者打开新的页面，那条横杠就会再次顽固地出现。说实话，我真的是一个非常不喜欢折腾的强迫症用户，正因如此我才会选择 macOS 和 MacBook Air。

解决这个问题的办法其实非常简单，并不需要复杂的操作或者系统级的调整。你只需要彻底关闭目前正在运行的 Brave 浏览器，然后通过[这个链接](https://release-assets.githubusercontent.com/github-production-release-asset/110178895/3514e3fa-3500-4e9e-b754-04c4f67cf68f?sp=r&sv=2018-11-09&sr=b&spr=https&se=2026-06-09T07%3A29%3A10Z&rscd=attachment%3B+filename%3DBrave-Browser-arm64.dmg&rsct=application%2Foctet-stream&skoid=96c2d410-5711-43a1-aedd-ab1947aa7ab0&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skt=2026-06-09T06%3A28%3A55Z&ske=2026-06-09T07%3A29%3A10Z&sks=b&skv=2018-11-09&sig=7Cz8Xr%2FH%2BJFfohPiMXzqJGqCmVh06A3F%2FKU1t06NoEU%3D&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmVsZWFzZS1hc3NldHMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwia2V5Ijoia2V5MSIsImV4cCI6MTc4MDk5MTE0NSwibmJmIjoxNzgwOTg3NTQ1LCJwYXRoIjoicmVsZWFzZWFzc2V0cHJvZHVjdGlvbi5ibG9iLmNvcmUud2luZG93cy5uZXQifQ.2bJ1cAehcERx6Vuhlfwk3AmY6YUUGlmea7NOiPbYO9s&response-content-disposition=attachment%3B%20filename%3DBrave-Browser-arm64.dmg&response-content-type=application%2Foctet-stream)下载上一个版本的 Brave 安装包，重新运行安装程序覆盖一次当前的 Brave 浏览器即可。完成覆盖安装后，我之前所描述的所有问题——包括那条诡异的横杠、刷新后消失又重新出现的行为，都会一并得到解决，不需要再进行任何额外的设置或清理操作。

如果你像我一样把版本换成了旧版本，并且你还提交过反馈给当前版本，换算下来可能需要等到下下个版本发布时才能收到正式的回应和修复。在此期间，你可能无法找到其他有效的解决办法，因为覆盖安装上一个版本已经是目前最为直接且可行的方案了。至于这条横杠问题是否只存在于 Brave 浏览器中，我并不确定，但有一点我可以肯定：Brave 官方的开发或测试团队看到了这篇文章，希望他们能够在后续版本中彻底修复这个问题。