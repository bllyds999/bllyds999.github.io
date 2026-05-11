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
description: "本文介绍了一个用于自动备份配置文件的 Shell 脚本。脚本通过设置远程仓库与本地仓库路径，检查本地目录是否存在，若不存在则克隆远程仓库。随后进入本地仓库目录，将用户目录下的 .mozilla、.vimrc、.config 等配置文件复制到仓库内，并执行 git add、git commit（提交信息含当前时间）、git push 操作，从而实现配置文件的增量备份与云端同步。该脚本适用于 Linux 环境下快速备份个性化配置。"
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