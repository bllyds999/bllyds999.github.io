---
title: 部署 RSSHub：RSS 阅读器结合树莓派，订阅 B 站 UP 主实操
date: 2026-06-09 21:05:17
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - RSSHub
  - 树莓派
  - B 站
  - 技术折腾
  - 个人网站
description: "本文介绍了作者使用 NetNewsWire 这款 macOS 上的 RSS 阅读器，重新获得了对阅读内容的掌控感，能够自由订阅个人博客并针对特定源设置系统通知。文章描述了 RSS 阅读带来的独特孤独体验，并由此引出著名的开源项目 RSSHub，它可以将不支持 RSS 的网站转换为标准订阅源。作者利用闲置的树莓派，通过 Docker 和一份 Docker Compose 配置文件轻松部署了 RSSHub 实例，其中包含无头浏览器、RSSHub 和 Redis 三个服务，并给出了安全建议，如关闭非必要服务的端口映射以减少攻击面。文章还详细说明了如何订阅 B 站 UP 主：通过浏览器开发者工具获取登录后的 Cookie 中的 SESSDATA 键值对，将其配置为环境变量，并添加对应 UID，即可生成独立的 RSS 订阅链接。最后，针对首次访问正常但后续出现 412 状态码的问题，指出需补充完整 Cookie 而非仅 SESSDATA 来解决。整体而言，本文是一份实用性强的 RSSHub 部署与 B 站内容订阅指南。"
---

最近用 NetNewsWire 订阅真的用爽了。这款 macOS 上的 RSS 阅读器让我重新找回了阅读的掌控感——我可以自由订阅各种个人博客，无论是技术分享还是生活随笔，都能整齐地汇聚在一个界面里。最让我惊喜的是，它能针对峰哥、张洪、拾月这些特定订阅源单独设置系统通知，完全融入 macOS 的通知中心。早上睁开眼，拉开窗帘，坐在桌前打开电脑，那些我喜欢作者的最新文章就已经安静地躺在那里等我翻阅。

用 RSS 阅读就有一种独特的孤独感，但这种孤独并不让人难过。它不是你真的孤身一人，而是像小时候一个人坐在电视机前看电视那样——荧幕里的世界热热闹闹，你和外界却隔着一层玻璃。用 RSS 也是这样：你从自己的阅读器这“石头缝”里默默观察着整个互联网，看别人争论、看别人分享、看别人生活，而外面的人并不知道你在看什么，也干涉不了你看到的顺序和内容。最近社交媒体用多了，我越来越受不了“刷不到后续”的焦虑。

我知道一个叫 RSSHub 的服务，这个项目在开源社区里非常有名。简单来说，它能把几乎所有不支持 RSS 的网站统统转换成标准 RSS 订阅源。只要你把它部署在自己的服务器上，就可以订阅基本已知的任何媒体平台内容。这是我在以前折腾 Linux 系统时，从开源社区那里了解到的工具。现在手头正好有一台闲置的树莓派，虽然因为曾经流量问题，已经不敢跑网站服务了，但部署一个 RSSHub 还是绰绰有余的。

它的安装过程十分简单，只需要一个 Docker 和一双勤劳的手就能完成。所有需要的依赖镜像在 DockerHub 官方仓库上都有现成版本，你不需要自己编译源码或配置复杂的环境。你可以直接使用这份 Docker Compose 配置文件来部署，它来自 1Panel 面板，我把那三份 Docker Compsoe 模板用 AI 缝合、修改了一下。它的配置里面定义了三个服务，分别是无头浏览器、RSSHub、数据库：

```yml
networks:
  1panel-network:
    external: true

services:
  browserless:
    container_name: browserless
    deploy:
      resources:
        limits:
          cpus: 0
          memory: 0
    healthcheck:
      interval: 30s
      retries: 3
      test:
        - CMD
        - curl
        - -f
        - http://localhost:3000/pressure
      timeout: 10s
    image: browserless/chrome
    labels:
      createdBy: Apps
    networks:
      - 1panel-network
    ports:
      - 3000:3000
    restart: always
    ulimits:
      core:
        hard: 0
        soft: 0

  rsshub:
    container_name: rsshub
    deploy:
      resources:
        limits:
          cpus: 0
          memory: 0
    environment:
      CACHE_TYPE: redis
      NODE_ENV: production
      PUPPETEER_WS_ENDPOINT: ws://browserless:3000/
      REDIS_URL: redis://:redis_hZie7B@redis:6379/
    healthcheck:
      interval: 30s
      retries: 3
      test:
        - CMD
        - curl
        - -f
        - http://localhost:1200/healthz
      timeout: 10s
    image: diygod/rsshub:chromium-bundled-2026-04-19
    labels:
      createdBy: Apps
    networks:
      - 1panel-network
    ports:
      - 1200:1200
    restart: always

  redis:
    command: redis-server /etc/redis/redis.conf --requirepass redis_hZie7B
    container_name: redis
    deploy:
      resources:
        limits:
          cpus: 0
          memory: 0
    image: redis:8.8.0
    labels:
      createdBy: Apps
    networks:
      - 1panel-network
    ports:
      - 6379:6379
    restart: always
    volumes:
      - ./data:/data
      - ./conf/redis.conf:/etc/redis/redis.conf
      - ./logs:/logs
```

其中 Redis 的密码需要改一改，因为这是你自己私人部署的实例，配置文件里的 `redis_hZie7B` 只是示例。安全起见，我强烈建议你在部署完成后，关闭除了 RSSHub 之外那两个服务的端口映射。端口映射把容器内部的服务暴露到你的电脑网络上，关掉它们意味着外部无法直接访问数据库和无头浏览器，只能通过 RSSHub 内部网络调用。这样一来，底层修改权就只保留在静态文件里，可攻击的突破口大大减少，你的 RSSHub 实例会更加安全。

我平时就乐意看 B 站的视频，要订阅 B 站 UP 主，就需要提取 B 站登录后的 Cookie 中的 `SESSDATA` 键值对——这是 B 站用来识别用户身份的凭证。我们可以通过开发者工具来获取：打开浏览器访问 B 站并登录，访问[这个地址](https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/dynamic_new?uid=0&type=8)，打开开发者工具，切换到“网络”标签，刷新页面，找到任意一个请求，在请求头里找到 Cookie 字段。通常情况，复制 `SESSDATA` 的键值就可以了。

我假设你有一份 Cookie 已经被提取出来了，现在你需要找到其中 `SESSDATA` 那一节，把它和对应的值（比如 `12345678`）提取出来，放到 Docker Compose 模板的 RSSHub 环境变量里边。同时还需要加上你要订阅的 UP 主的 UID。配置格式如下方的代码所展示的，注意 RSSHub 官方文档种的环境变量名的特殊结构（`BILIBILI_COOKIE_` 需要后面跟上 UP 主的 UID）：

```yml
    environment:
      BILIBILI_COOKIE_3494372658121066: SESSDATA=12345678
      CACHE_TYPE: redis
      NODE_ENV: production
      PUPPETEER_WS_ENDPOINT: ws://browserless:3000/
      REDIS_URL: redis://:redis_hZie7B@redis:6379/
```

配置好环境变量、重启容器后，访问实例的路径 `/bilibili/user/video/:uid`（替换为自己想看博主的 UID），即可获得该 UP 主近期视频的 RSS 订阅源。比如我想订阅“极客湾”的科技评测，就把极客湾的 UID 配置进去；还想看“影视飓风”的摄影大片？那就再添加一个变量，把影视飓风的 UID 也写上。每个 UP 主会生成独立的订阅链接，统一添加到 NetNewsWire 或者其它阅读器里，非常方便。

第一次访问这个 RSS 链接时通常会正常返回内容，但是后续访问却提示 412 状态码，这又是什么意思呢？412 表示“前提条件失败”——简单来说，哔哩哔哩的服务器拒绝了你的访问。这通常是因为你配置文件的 Cookie 不完整：RSSHub 默认只需要 `SESSDATA`。解决方案也不复杂：将你在开发者工具里复制出来的那串完整 Cookie 原封不动地塞到环境变量里，完整的 Cookie 包含了浏览器指纹、登录时间戳、令牌等多种信息。