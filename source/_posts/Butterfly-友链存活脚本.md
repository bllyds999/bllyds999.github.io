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
description: "本文介绍了如何使用一段 Shell 脚本检查指定文件中的链接存活状态。该脚本首先定义文件路径为 source/_data/link.yml ，然后判断文件是否存在，若存在则使用 grep 提取所有 https 开头的主机名，通过 sed 去除协议头，再借助 xargs 和 sh 执行 ping 命令，对每个主机发送 4 个 ICMP 包。根据 ping 结果，脚本会输出该主机“存活！”或“死亡！”。本文适用于需要定期验证博客或网站友情链接是否有效的场景，可快速检测链接的可用性，便于运维人员及时处理失效链接。"
---

```shell
file=source/_data/link.yml

[[ -f $file ]] && \
  grep -o 'https://[^/]*' $file | \
  sed 's|https://||' | \
  xargs -I {} sh -c 'ping $1 -c 4 > /dev/null && echo "$1 存活！" || echo "$1 死亡！"' _ {}
```