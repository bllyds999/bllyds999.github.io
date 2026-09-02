---
title: macOS 必玩之鼠标指针：macOS 更换指针？用 Mousecape Swift
date: 2026-09-02 11:37:59
categories: 杂谈
cover: /assets/images/illustrations/other-8.webp
tags:
  - macOS
  - 使用体验
  - 鼠标指针
  - 美化
  - 开源软件
description: "本文介绍了在 macOS 上实现个性化桌面主题的方法，重点聚焦于鼠标指针的更换。作者指出 macOS 用户桌面风格普遍千篇一律，并分享了自己从 Linux 转向 macOS 后对美化工具的需求。文章提到经典的 Mousecape 软件因停止维护而无法在高版本系统上使用，随后发现并推荐了其重写版本 Mousecape Swift。该软件由 Swift 语言原生编写，兼容性出色，且内置 Windows 格式转换功能，无需额外配置 Python 库。作者还提供了仓库链接，并展示了最终的美化效果，为追求个性化桌面的 macOS 用户提供了实用参考。"
---

刷到过很多人的 macOS 桌面，感觉都很千篇一律。我猜测这可能和 macOS 大多数的用户习惯有关，并不是 Linux 桌面那种极客风格。因此考虑到这一点，本文篇幅不会涉及到一些专有名词之类的，请放心观看。最近有了一个（伪）需求，就是给自己的 macOS 桌面更换一套“更加个性化”的主题，原因是自己的 macOS 一直以来用着其它壁纸。以前在 Linux 上换壁纸和换鼠标指针，真是勤得又勤，非常之勤快啊！现在到了 macOS，不可能再像之前一样，系统内置一个软件给你改了，但好在我们有万能的开源社区。Mousecape 就是一个好软件，它曾经是很多人修改鼠标指针的必备，无数美化人心中的白月光。

但是嘛，作者早早地宣布 Mousecape 已经停止维护，这意味着你无法在高版本的 macOS 上，体验到那么个性化的修改，这十分地不银杏花。我也是倒了大霉，没有提前了解过这一点，下载了这个软件后发现用不了。我记得之前刷到过一个切换 macOS 指针的软件来着？它好像叫那啥，我忘了，上万能的哔哩哔哩找了一圈，发现名字叫 Mousecape Swift，是作者重写同名高版本换指针软件，原生使用 Swift 语言进行编写。哟吼，这可不得了，Swift 在 macOS 上可是亲儿子级别的待遇，这叫人怎么能不惊喜？更关键的是，它原生支持使用 Winodows 格式，因为软件里面内置了转换方式，不需要你再去下载什么奇奇怪怪的 Python 库。

这是[仓库链接](https://github.com/sdmj76/Mousecape-swiftUI)，最后晒晒我自己的美化结果：

![](/assets/images/illustrations/other-8.webp)