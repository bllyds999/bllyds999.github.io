---
title: 在 Codium 中使用 Aider：想要图形化，试试  Aider Composer 插件吧
date: 2026-10-19 02:06:06
categories: 梁栋烨的编程小站
cover: /assets/images/cover/code.webp
tags:
  - AI
  - AI 工具
  - 代码编辑器
  - 编程工具
  - Python 脚本
description: 本文介绍了在 Codium IDE 中集成外部 AI 助手 Aider 的具体过程和方法。文章指出 尽管 Codium 是一个现代编程工具，但它本身缺乏内置的 AI 助手功能，而传统的 TUI 小助手使用起来体验不佳，且容易造成 Agent 和 IDE 之间的割裂。为了弥补这一功能缺失，作者选择通过社区插件 Aider Composer 来实现 AI 问答、编码和规划功能。这个过程需要创建一个独立的依赖环境，具体使用了 Python 3.11 版本，并在 ~/.aider-composer/ 目录下创建了虚拟环境。随后，作者在该环境中安装了 aider-chat 和 flask 两个必要的模块包，并完成了插件环境路径的配置。完成基础设置后，还需要在 Aider Composer 的聊天界面中填入模型名称和 API 相关配置。最后，为了优化用户体验，作者将 AI 聊天框从默认的左侧位置拖动并移动到了 Codium 的右侧边栏，从而实现了 AI 辅助功能与主流软件习惯的统一。
---

最近不是从 Trae 换到 Codium 了吗？Codium 并没有内置一个 AI 助手，但现代编程不可能离得开 AI 的。就算是我为了爱好编程，有时也会想跳过繁琐步骤。这时就要下载其它 AI 插件，来弥补这方面的损失了。有人就问：“直接在自带的命令行使用 TUI 小助手行不行？”是可以的，但用起来会非常别扭，而且很多情况都是 Agent 和 IDE 各玩各的。如果还全屏使用 TUI Agent 的话，直接就缩小了代码编辑器分区的面积。好在 Codium 的右侧边栏没有 Copilot，可以自己添加一个 AI 助手上去。这里我就选择自己一直在用的 Aider 了：它在 Code 的插件市场，有个叫 Aider Composer 的社区插件，默认支持问答、编码、规划。

因为 Aider Composer 并不使用系统自带的 Aider，需要一个装有 `aider-chat` 的依赖环境。因此我需要使用 Python 的 3.11 版本，在 `~/.aider-composer/` 创建一个虚拟依赖环境。其实放在哪里、叫什么无所谓，关键就是自己记住就行了。创建好依赖环境之后，就要在里面安装 `aider-chat` 和 `flask` 两个模块包。安装完成之后，在插件的环境配置填入 `~/.aider-composer/bin` 位置。打开 Aider Composer 插件，在插件聊天界面中填入自己的模型名称、进行 API 相关配置。做完是做完了，但这个 AI 聊天框在左边，我们习惯的软件都是在右边。可以打开 Codium 的右侧边栏，长按拖动左侧插件图标到右侧边栏松手。