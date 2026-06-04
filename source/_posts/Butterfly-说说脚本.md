---
title: Shell 脚本自动创建，并追加内容到说说 YAML 文件
date: 2026-04-05 11:22:35
updated: 2026-04-08 21:12:23
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Butterfly
  - Hexo
  - Shell命令
  - 个人网站
  - 技术折腾
description: "本文介绍了如何使用 Shell 脚本向 YAML 文件动态追加数据记录。脚本定义了两个函数：nofile 用于在文件不存在时创建并写入第一条记录，包含当前日期时间、固定 key 值 1 以及用户输入的内容；hadfile 则读取已有文件中的最大 key 值并自动递增，然后追加新记录。主逻辑通过检查文件是否存在来调用相应函数。该脚本适用于自动化博客或静态站点中类似说说、动态等内容的管理，实现简单且高效。"
---

```shell
nofile() {
  touch source/_data/shuoshuo.yml
  echo >> source/_data/shuoshuo.yml
  echo "- date: $(date +'%Y-%m-%d %H:%M:%S')" >> source/_data/shuoshuo.yml
  echo "  key: 1" >> source/_data/shuoshuo.yml
  echo "  content: $@" >> source/_data/shuoshuo.yml
}

hadfile() {
  key=$(grep -oE 'key: [0-9]+' source/_data/shuoshuo.yml | \
    tail -n 1 | \
    sed 's/key: //') 
  ((key++))
  echo >> source/_data/shuoshuo.yml
  echo "- date: $(date +'%Y-%m-%d %H:%M:%S')" >> source/_data/shuoshuo.yml
  echo "  key: $key" >> source/_data/shuoshuo.yml
  echo "  content: $@" >> source/_data/shuoshuo.yml
}

if [[ -f source/_data/shuoshuo.yml ]]
then
  hadfile $@
else
  nofile $@
fi
```