---
title: Shell 写的大语言模型客户端
date: 2026-04-07 17:43:55
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Shell命令
  - 大语言模型
  - Token 消耗
  - 技术折腾
  - 运维
---

```shell
rm -rf ./history.json

read -p "请输入 OpenAI API URL：" OpenAI_API
read -p "请输入 OpenAI API Key：" API_KEY
read -p "请输入模型名称：" MODEL_NAME
[[ -f "./history.json" ]] || echo "{\"model\": \"$MODEL_NAME\",\"messages\": [{\"role\": \"system\", \"content\": \"回答一句话，越简短越好，不需要 Markdown 和换行，要标点符号！\"}],\"stream\": false}" > ./history.json
clear

while true
do
  read -p "请输入内容：" input
  echo
  sed -i '' "s/],/, {\"role\": \"user\", \"content\": \"${input}\"}],/" ./history.json
  content=$(curl -sS $OpenAI_API -H "Content-Type: application/json" -H "Authorization: Bearer $API_KEY" -d "$(cat ./history.json)" | grep -oE '"content":"(.*?)"}' | sed -n 's/.*"content":"\([^"]*\)".*/\1/p')
  echo "${MODEL_NAME}：${content}"
  echo
  sed -i '' "s/],/, {\"role\": \"assistant\", \"content\": \"${content}\"}],/" ./history.json
done
```