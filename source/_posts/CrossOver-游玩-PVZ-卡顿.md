---
title: CrossOver 游玩 PVZ 卡顿：帧数不稳的凶手，竟是早期 DRM
date: 2026-11-09 22:11:58
categories: 梁栋烨的杂谈小站
cover: /assets/images/cover/other.webp
tags:
  - macOS
  - CrossOver
  - 游戏
  - 游戏体验
  - 游戏技术
description: "本文描述了在 Mac 操作系统上使用 CrossOver 运行游戏《植物大战僵尸》时遇到的卡顿问题及其解决方案。该问题表现为游戏在主线关卡过程中不会卡顿，但特别是在选卡界面会发生明显的卡顿现象。经过排查，文章指出该问题并非源于 Mac 本身的硬件性能不足，而是由于《植物大战僵尸》早期版本存在 DRM 机制，导致游戏运行了 2 个进程，造成了资源消耗和性能瓶颈。为了解决这一技术难题，文章提供了一套详细的修复步骤。"
---

## 问题表现原因

起因是最近在 Mac 上使用 CrossOver 游玩《植物大战僵尸》，因为购买了 CrossOver 正版，加之 CrossOver 本身的配置已经足够傻瓜，所以当时就觉得直接下载就能玩。玩了有一会《植物大战僵尸》，发现推起主线关卡来卡卡的。我能意识到不是 Mac 的问题，因为哪怕是我小学用的那台上网本，也足够性能跑得起来《植物大战僵尸》，为什么呢？游戏过程中不会卡顿，但偏偏发生在选卡界面……上网搜索了一下，发现 Steam 上的《植物大战僵尸》玩起来就是这样卡顿，因为《植物大战僵尸》有早期 DRM，开了两个进程。

## 如何解决问题

首先将 CrossOver 的图形方式改成 D3DMetal，同时打开 MSync，这一步主要起到跟我环境一致的作用。接下来运行一次《植物大战僵尸》，界面停留在主界面不要关闭进程。使用 Finder 打开 CrossOver 容器的 C 盘文件夹，进入 C 盘下的 `ProgramData\PopCap Games\PlantsVsZombies\`，复制 `popcapgame1.exe`。再进入 `Program Files (x86)\Steam\steamapps\common\Plants Vs Zombies\`，把复制的文件粘贴到文件夹，关掉游戏进程，重命名替换掉 `PlantsVsZombies.exe`。