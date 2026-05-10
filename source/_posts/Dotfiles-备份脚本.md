---
title: Dotfiles 备份脚本
date: 2026-04-05 16:04:09
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Shell命令
  - 技术折腾
  - 运维
  - Dotfiles
  - 备份脚本
---

```shell
cloud_repo=''
local_repo=''
[ -d $local_repo ] || git clone $cloud_repo $local_repo
pushd $local_repo
cp -rf ~/{.mozilla,.vimrc,.config} . && \
  git add . && \
  git commit -m "备份了配置文件 $(date)" && \
  git push
popd
```