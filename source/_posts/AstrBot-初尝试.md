---
title: AstrBot 初尝试
date: 2026-04-10 20:25:04
categories: 杂谈
cover: /assets/images/illustrations/astrbot-1.webp
tags:
  - AstrBot
  - 树莓派
  - 1Panel
  - 大语言模型
  - AI 机器人
---

我昨天不是带大家玩过 OpenClaw 吗？在那之后，我的朋友给我介绍了一款叫作 AstrBot 的机器人软件。其实在他说之前，我了解过这个项目，是中国人做的，这个项目本来只是个把大语言模型接入聊天软件活跃气氛的工具。在那之后随着不断迭代的版本更新，现在加入了 Agent 功能，可以看作是 OpenClaw 的同类产品了。

## 安装软件

![](/assets/images/illustrations/astrbot-1.webp)

我把它装在了我的树莓派上，和 OpenClaw 一起。通过 1Panel 来安装 AstrBot 也挺简单的，虽然没有像 OpenClaw 一样被官方集成安装通道，但是一样可以在应用商店里下载。我记得之前 1Panel 官方出过一期 AstrBot 的安装教程，不过 1Panel 那么简单，不看教程也能玩。大家觉得对不对？

## 接入模型

![](/assets/images/illustrations/astrbot-2.webp)

第一次打开是这个界面，有一个地方会引导你一步一步配置。我看了一下它自带接入聊天软件的设置，貌似没有 OpenClaw 简单，毕竟大龙虾是官方支持的，它这里还需要手动配置机器人。不过我觉得我用不上它自带的接入聊天软件，因为我只是在网页端使用。

![](/assets/images/illustrations/astrbot-3.webp)

这里依旧是生成一个 API Key 用于 AstrBot 的调用。我觉得这是一个十分良好的习惯，不仅可以让我的大脑休息（毕竟密钥本来就不是拿来记得），还可以让攻击面最小化。如果大家都混用一个 Key，攻击者一旦破解，后续你想要逐个服务更换 Key 那可就太难了，维护成本又是一大问题。

![](/assets/images/illustrations/astrbot-4.webp)

第一次使用这个软件，还不是很熟悉。所以我犯了一个很大的错误，以为这个软件和别的 AI 软件（比如 OpenWebUI）一样，只需要导入服务商就能使用模型。实际上你还需要在这里单独开启模型，否则你的模型表里什么都没有。用了那么多的 AI 软件，我也不是很清楚他们为什么要这样设计？但仔细一想，貌似这玩意初衷是希望你开放给大家用的。

## 对话体验

![](/assets/images/illustrations/astrbot-5.webp)

令我感到十分惊讶的是，这玩意的对话居然如此地快而流畅。之前我在 OpenWebUI 导入了 DeepSeek 的服务商密钥，使用 DeepSeek 时总是会卡一会，包括在 OpenClaw 里也是稍微卡一会才会响应。我觉得这不仅有 AstrBot 的功劳，还有我下午整顿网线的问题，多方面因素共同造就了这番成果。但是谁在乎呢？

![](/assets/images/illustrations/astrbot-6.webp)

我尝试询问它我的系统信息，它至少应该会按照这个步骤告诉我：运行 Shell 命令、解析输出、返回结果。但是它却告诉我说，它没有手脚去执行这些操作，我一时间居然感到诧异。这玩意难道不是 OpenClaw 的同类型产品吗？我见那些大博主都可以直接调来使用啊，一定是我遗漏了什么，我去研究一下先……

## 插件系统

![](/assets/images/illustrations/astrbot-7.webp)

啊哈，快看我找到了什么，是插件系统！这玩意居然支持插件，这意味着我可以安装一个 Shell 运行插件，这下 AstrBot 就有手脚了。当然啊，我也不确定这个东西到底能不能运行。但是，我记得某位狐狸说过：“相信吧，相信 AstrBot 是不需要理由的。”，于是我鼓足了干劲，决定继续尝试，看看到底行不行。

![](/assets/images/illustrations/astrbot-8.webp)

好吧，依旧不行，我成小丑了……

![](/assets/images/illustrations/astrbot-9.webp)

诶，我发现了这有个权限设置，全打开试试！

## 折腾后感

![](/assets/images/illustrations/astrbot-10.webp)

不是吧，哥们！我折腾了那么久，打开了还是不行，是漏了什么设置吗？评论区的哥们有没有懂的，麻烦写个留言救救博主，已经懒得折腾了。希望 AstrBot 的开发人员能路过这里，在评论区给点提示……整体来看，AstrBot 如果从初衷来看的话，那是非常好的，做得有模有样，延迟很低。但是，如果看作是 OpenClaw 的竞品，那还需要努力一下啦！