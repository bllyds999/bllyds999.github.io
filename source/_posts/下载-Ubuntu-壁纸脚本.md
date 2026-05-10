---
title: 下载 Ubuntu 壁纸脚本
date: 2026-04-06 18:14:34
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Shell命令
  - 技术折腾
  - Ubuntu 壁纸
  - 下载脚本
  - 清华镜像
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