---
title: 如何搭建一个 Matrix 机器人：免部署桥接，实现广播日志和聊天回复
date: 2026-09-15 22:32:48
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - AI 机器人
  - 大语言模型
  - Python 脚本
  - 技术折腾
  - 服务器
description: "本文介绍了使用 Python 语言和 matrix-nio 库来构建和部署 Matrix 机器人，以实现服务器日志汇报和 AI 聊天回复功能。文章首先指出，传统的 Matrix 桥接配置过程复杂且缺乏教程，因此作者提供了一种更简单、更可靠的解决方案：利用 matrix-nio 这个专门用于 Matrix 账户控制的 Python 库来创建机器人。文章详细展示了两个核心的机器人脚本。第一个脚本是一个日志机器人，它能够执行 Linux 服务器的系统更新操作（例如 apt upgrade），并根据操作结果（成功或失败）生成日志信息，然后将这些日志通过 API 消息发送到指定的 Matrix 公群组中。这个功能非常适合在技术讨论群组中实时汇报后台任务的执行状态。第二个脚本则是一个更复杂的 AI 聊天机器人。它通过监听 Matrix 房间中的事件，接收用户发送的消息，然后利用 aiohttp 库调用外部 AI 接口（如 Deepseek）获取回复，并将 AI 的回复内容回传到聊天房间。为了确保项目的专业性和环境的隔离性，文章最后详细介绍了如何使用 Docker 技术来部署这些机器人。作者提供了一个完整的 Dockerfile 和 .env 文件示例，指导读者如何构建 Docker 镜像，并在容器中持续运行 AI 聊天机器人。这种基于 Docker 的部署方式，使得整个系统能够在一个干净、可控的环境中运行，极大地提高了项目的可维护性和稳定性。整个过程展示了从基础脚本编写到容器化部署的完整技术链条，为读者提供了一个完整的实践参考。"
---

今天发第二篇文章真的是太迟了，凌晨的时候起来写了第一篇文章，等到今天中午的时候，又刚好不小心把它发了出去。原本计划两篇文章一起发出去的，结果现在是先发出去了一篇，这一篇又最后发出去。最近不是在折腾 Matrix 吗？今天早上突然想给自己折腾一个 Matrix 机器人，用来汇报服务器日志以及聊天娱乐……毕竟你们都知道的，在 QQ 和微信上都有一些聊天机器人嘛，但 Matrix 是开源的，方便操控账号。起床的时候问豆包有没有什么折腾方式，不需要去修改 `homeserver.yaml` 的。豆师傅也是非常老实啊，陪我折腾了半个小时的桥接，最后嘛也是无东西带回来，两手空诶。

我发现桥接这玩意网上几乎找不到教程，只有零星几个外国人的网站写了如何配置桥接。并且桥接的情况相当复杂，虽然能够以正则的方式操控一些账号和生成机器人账号，但生成的机器人账号对 Webhook Token 又十分严格。这导致我几乎是浪费了早晨四个小时，来折腾这种莫名其妙的东西……不过没有关系，现在总算找到了一种比 Webhook 听起来复杂，但实际做起来相当简单的机器人制作方式，那就是使用 `matrix-nio` 操作客户端。这是一个还在维护的、专门用于 Matrix 控制账号的库，可以拿来创建一个 Matrix 机器人。值得一提的是，这是一个 Python 库，你可以这样去安装它：

```shell
python3 -m venv .venv
.venv/bin/pip install matrix-nio
```

过程中会下载一些 Async 库，所以也不需要去好奇后面的代码哪来的 Async 字段，其实这里面依赖项就有的。不需要再加上别的指令参数了，这个 `matrix-nio` 包含了所有它自己需要的依赖，所以非常地简单。因为这玩意本身就没有什么教程，并且官方示例都是给一个模板给你参考去写，所以我这边还是贴上代码和代码解释，顺便再给大家做一个小项目示范一下好了。你可以直接复制它进行修改，放在本地中去使用。首先是用于发消息的机器人，它可以用来发布你的服务器日志。需要你先在 Matrix 上创建一个账号，然后在任何一个 Matrix 客户端上创建公群组，获得这个群组的 ID：

```python
# 不能省略代码中的 async 和 await，Matrix 是异步操作，这里需要异步的同时代码继续
import asyncio, subprocess, datetime
from nio import AsyncClient, RoomMessageText, responses

# 基础参数，matrix_user 是用户完整 ID，matrix_password 是密码，matrix_server 是 Matrix 服务器地址，room_id 是房间的 ID
matrix_user = "@username:matrix.exmaple.com"
matrix_password = "password"
matrix_server = "https://matrix.exmaple.com"
room_id = "!wqCGcePkjtUuQboKgH:raspberrypi.tail00e4c5.ts.net"

async def main():
  client = AsyncClient(matrix_server, matrix_user)
  await client.login(matrix_password)
  
  # 尝试去更新系统，或者去做些什么别的事情，这里的 subprocess.run 的意义是运行命令并返回成功值，为防止出现特殊意外失败，这里使用了 try 去强制 response=1
  try:
    result = subprocess.run(
      ["bash", "-c", "DEBIAN_FRONTEND=noninteractive apt update -y && DEBIAN_FRONTEND=noninteractive apt upgrade -y -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold"],
      capture_output=True
    )
    response = result.returncode
  except Exception as e:
    response = 1
  date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  if response == 0:
    logs = f"{date} 批次任务系统更新成功"
  else:
    logs = f"{date} 批次任务系统更新失败"

  # 算法开始，机器人进入房间后，向房间发送结果；不需要担心 join 的问题，放在这里没有什么关系
  await client.join(room_id)
  await client.room_send(
    room_id=room_id,
    message_type="m.room.message",
    content={"msgtype": "m.text", "body": f"{logs}"}
  )
  await client.close()

# 最后异步运行 main
asyncio.run(main())
```

如果你使用的是一个 Linux 服务器，那你可以把它写进你的环境里测试一下。每次这个脚本被运行的时候，都会返回结果并发送到 Matrix 房间里。适合放在议会房间里面聊技术的过程中，等待云端代码被执行。或者说你也可以那它去接收文件，或者是做一些订阅操作专门爬取博客文章，以聊天的形式把文章链接发给你。唯一的缺点就是它不能接收消息，只是单向地在群里广播，因此下面展示了一个可以接受消息并回复的脚本代码。就像上文一样的，你可以复制它到你的环境里面测试，只需要修改几处关键的变量。如果你需要算法的话，可以修改里面函数的算法。我会为这些代码都带上注释：

```python
# 这里需要用到爬虫功能，比如向 AI 发送请求，所以需要用到 aiohttp 异步处理，如果你不需要爬虫的话可以去掉
import asyncio, os, aiohttp
from nio import AsyncClient, RoomMessageText

# 基础参数，matrix_user 是用户完整 ID，matrix_password 是密码，matrix_server 是 Matrix 服务器地址，room_id 是房间的 ID
matrix_user = "@username:matrix.exmaple.com"
matrix_password = "password"
matrix_server = "https://matrix.exmaple.com"
room_id = "!wqCGcePkjtUuQboKgH:raspberrypi.tail00e4c5.ts.net"

# 定义了一个名为 ai_chat 的处理器，参数必须得是两位，一位代表房间号，另一位代表行为
async def ai_chat(room, event):

  # 判断聊天请求是否是处理器自己的，如果是则不循环触发，防止刷屏
  if event.sender == client.user_id:
    return

  # event.body 是你发送的值，如果你想要做成特定功能的机器人，这一段可以换成判断文本的算法，如果语句最前面的字符是 ! 才回复
  payload = {
    "model": "deepseek-flash",
    "messages": [
      {"role": "system", "content": "请不要在回复中使用任何 Markdown 格式的文本"},
      {"role": "user", "content": event.body}
    ]
  }
  headers = {
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
  }

  # 异步获取了一个 AI 的返回 JSON
  async with session.post(api, json=payload, headers=headers) as resp:
    data = await resp.json()

  # 这里处理聊天的地方，只需要修改 body 对应的值为你想要的文本即可
  await client.room_send(
    room_id=room.room_id,
    message_type="m.room.message",
    content={"msgtype": "m.text", "body": data["choices"][0]["message"]["content"]}
  )

async def main():
  # 这里需要一个 API_KEY 环境变量，一个 API_URL 环境变量，别写进脚本项目里
  global client, key, api, session
  key = os.environ["API_KEY"]
  api = os.environ["API_URL"]
  session = aiohttp.ClientSession()
  client = AsyncClient(matrix_server, matrix_user)
  try:
    await client.login(matrix_password)
    await client.join(room_id)
    client.add_event_callback(ai_chat, RoomMessageText)
    # 这里代表长轮询超时，不是真的运行 30 秒后退出
    await client.sync_forever(timeout=30000)
  finally:
    await session.close()
    await client.close()

asyncio.run(main())
```

接下来我们还需要一个 Docker 容器，它和前面的 Cron 日志助手不一样，这个需要在后台持续地运行项目。一般来说不推荐直接食用脚本后台拉起一个进程，因为太脏了，很多东西混在一起。正所谓专业的事情交给专业的工具去做，你只需要把这件事交给 Docker 处理就好了。Docker 在处理后台进程和隔离性这方面，算是相当专业的，因此我建议 Linux 使用者多少试一下这个软件。你可以在 Docker 容器里提前规定环境是什么样子的、变量是什么样子的。比如这里我就规定要拉取一个 3.11 环境，因为和我主机的环境隔离，所以调用的是容器里的 Python，我还在里面写入了环境变量：

```dockerfile
# 使用云端或本地名为 python 镜像的 3.11 版本，如果不规定则默认使用最新版
# Dockerfile 只需要记 FROM、COPY、RUN、CMD、ENV 这几个关键的就行了
FROM python:3.11

# 拷贝脚本名称到容器里，并安装我们需要的 matrix-nio 库，RUN 后面跟的是 Shell 指令
COPY ai-chat.py .
RUN pip install --no-cache-dir matrix-nio

# 规定一个 Shell 环境变量，对应了前面 Python 脚本中想要获取的环境变量名称，敏感内容别写进项目里
ENV API_URL="https://api.deepseek.com/v1/chat/completions"

# 规定容器启动后需要执行什么命令，这里是持续执行 ai-chat.py 这个 Python 脚本
CMD ["python3", "ai-chat.py"]
```

因为这份 Dockerfile 缺少 `API_KEY `环境变量，我们需要一个 `.env` 去新增容器 Shell 环境变量（记得写进 `.gitignore`）：

```shell
API_KEY=sk-xxx
```

恭喜你，你能走到这一步大部分基础的都懂了。最后，为这个脚本生成 Docker 镜像，再启动 Docker 容器即可：

```shell
# -t 后面跟着的是镜像名称，. 代表在当前目录寻找 Dockerfile 文件
docker build -t ai-chat .

# 启动这个容器即可，末尾必须要是镜像名
docker run -d --env-file .env ai-chat
```