---
title: 一个脚本，从清华镜像下载并提取 Ubuntu 壁纸
date: 2026-04-06 18:14:34
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Shell命令
  - 技术折腾
  - Ubuntu 壁纸
  - 下载脚本
  - 清华镜像
description: "本文介绍了如何使用 Shell 脚本从清华镜像源下载并提取 Ubuntu 壁纸文件。脚本首先通过 curl 获取 ubuntu-wallpapers 软件包列表，使用 grep 和 tail 提取最新版本的原生 tar.gz 压缩包文件名。接着利用 wget 下载该文件，并创建 ubuntu-wallpapers 和 temp 两个目录。然后使用 tar 解压到 temp 文件夹，再通过 find 命令查找所有 .jpg 和 .png 格式的图片文件，将它们移动到 ubuntu-wallpapers 目录中。最后删除临时目录和下载的压缩包，完成壁纸的提取与整理。整个过程自动化地从清华镜像获取 Ubuntu 官方壁纸资源，适合用于批量收集或本地备份。"
---

```shell
filename=$(curl https://mirrors.tuna.tsinghua.edu.cn/ubuntu/pool/main/u/ubuntu-wallpapers/ | \
  grep -oE "ubuntu-wallpapers_.*?.orig.tar.gz" | \
  tail -n 1)

wget https://mirrors.tuna.tsinghua.edu.cn/ubuntu/pool/main/u/ubuntu-wallpapers/${filename} && \
  mkdir ubuntu-wallpapers temp && \
  tar -xvf $filename -C temp && \
  find temp -type f (\ -name "*.jpg" -o -name "*.png" \) -exec mv {} ubuntu-wallpapers/ \;
  rm -rf temp $filename
```