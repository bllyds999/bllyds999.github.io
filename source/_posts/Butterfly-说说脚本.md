---
title: Butterfly 说说脚本
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