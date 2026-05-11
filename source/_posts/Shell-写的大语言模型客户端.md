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
description: "本文介绍了 一个基于 Shell 脚本的终端聊天工具，通过调用 OpenAI API 实现与语言模型的交互。脚本首先提示用户输入 OpenAI API URL、API Key 及模型名称，并初始化一个 JSON 格式的历史记录文件。随后进入无限循环，每次读取用户输入，将用户消息追加到历史记录中，再通过 curl 发起 API 请求，从返回的 JSON 中提取模型回复并显示在终端上，同时将助手回复也更新到历史记录文件，从而实现多轮对话的上下文维护。该脚本简化了与 AI 模型的命令行交互过程，适合快速测试或二次开发。"
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