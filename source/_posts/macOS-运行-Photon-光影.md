---
title: macOS 运行 Photon 光影：Photon 无法运行？可能需要这篇教程
date: 2026-08-02 17:20:39
categories: 游戏
cover: /assets/images/illustrations/shader-1.webp
tags:
  - macOS
  - 光影
  - 游戏攻略
  - 我的世界
  - Mesa
description: "本文介绍了 macOS 系统上运行 Minecraft 光影效果时遇到的问题与解决方法。文章指出，macOS 新版抛弃了 OpenGL 驱动，所有 OpenGL 指令需转译成 Metal 指令，而 Mesa 的转译并不完全，导致部分光影无法运行。要解决问题，需在 Photon 光影配置中关闭“球谐天空光”和“彩色光照”。对于 Intel 版 Mac，因为仍支持 OpenGL，问题可能出在设备性能不足。作者使用 M4 芯片测试，建议将帧数设置在 60 左右，开启垂直同步，并将光影配置从“高”改为“中”，关闭部分体积雾选项。而 M5 Pro 或 M5 Ultra 等更高性能设备可以随意开到最高画质。最后，作者推荐搭配 Patrix 等真实风格材质包，强调游戏体验以个人喜好为主。"
---

![](/assets/images/illustrations/shader-1.webp)

如果你进入游戏并没有显示光影效果，甚至还提醒你出了问题要去 GitHub 反馈，那你大概率是本文章的受众。反正给你讲得明明白白就是了，看个文章不像看视频那样，读文字要多快就多快，并不浪费时间。macOS 新版抛弃了 OpenGL 驱动，也就是说一切 OpenGL 指令都需要转译成 Metal 指令才能执行。macOS 需要使用 Mesa 转译 OpenGL 指令才能正确翻译 GLSL 效果，这就是部分光影无法在 macOS 上运行的原因。一般来讲，因为 Mesa 对于 OpenGL 为 Metal 转译的不完全，而 Mesa Zink 中部分的 Vulkan 指令并不在 MoltenVK 中转译，这点可从 Vulkan 光追在 macOS 中无法运行而知。

![](/assets/images/illustrations/shader-2.webp)

根据 Photon 仓库的 README 可知，如果你想运行这个光影在 macOS 上，则需要同时关闭“球谐天空光”和“彩色光照”。如果你拿到了一份别人的配置，记得先进入配置关掉这两个。关闭以后记得点一下应用，大概率都是能运行的，除非你用的不是 macOS 或者 Metal 渲染。如果你是 Intel 的 macOS，你确实不适合来看这期视频，因为 X86 至少还是支持 GLSL 和 OpenGL 的。大概率是设备太差跑不起来，或者别的什么原因导致的。因为 macOS 最后一代搭载到 MacBook Intel 上的，只是 2020 年那时候的机器了，距离现在都有六年了，差不多是电脑的一半寿命。

![](/assets/images/illustrations/shader-3.webp)

我这边用的是 M4 普通版的图形处理，帧数还是相当稳定的。由于 MacBook Air 的屏幕锁死在了 60 帧，所以帧数建议还是设置在 60 左右，打开一下垂直同步。光影配置从“高”改成“中”，关掉一些体积雾的选项。如果你用的是 M5 Pro 或者 M5 Ultra，随便开到最高都是没有问题的，毕竟是台式电脑、性能本和便携笔记本的区别嘛！总之就是调到合适的帧率，再找一个好看的材质包。我推荐使用 Patrix，它是真实风格的，很搭配。当然，如果你要使用别的，比如 Multipixel 或者 Fathful、Bare Bones、Stay True，又或者什么乱七八糟的逆天音效材质包，也不是不行。反正打游戏，玩的就是开心嘛，适合自己最好！