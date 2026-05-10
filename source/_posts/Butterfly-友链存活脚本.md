---
title: Butterfly 友链存活脚本
date: 2026-04-06 12:48:24
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - 友链
  - Shell命令
  - 运维
  - 技术折腾
---

```shell
file=source/_data/link.yml

[[ -f $file ]] && \
  grep -o 'https://[^/]*' $file | \
  sed 's|https://||' | \
  xargs -I {} sh -c 'ping $1 -c 4 > /dev/null && echo "$1 存活！" || echo "$1 死亡！"' _ {}
```