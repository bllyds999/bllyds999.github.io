---
title: 备份你的 Waline 评论：备份数据，借助 GitHub 定时执行任务
date: 2026-08-05 16:23:50
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - Waline
  - 评论系统
  - 数据备份
  - Python 脚本
  - Playwright
description: "本文介绍了 1 个用于备份 Waline 评论数据的 Python 脚本及其配套的 GitHub Actions 工作流。脚本基于 Playwright 自动化浏览器操作，通过 Waline 官方提供的一键导出功能，将评论数据保存为 JSON 文件。运行时需要设置环境变量 WALINE_RESET_URLS 获取重置链接，依次访问后台并跳转至迁移页面，点击导出按钮完成下载。文章详细展示了参数解析、链接处理、文件命名及异常处理等核心代码，并说明了 Actions 的定时触发与密钥配置方式。此外，作者提醒用户应创建私密仓库存放备份，并强调保护好备份文件的重要性，因为其中包含的用户信息可能被恶意利用。整体内容兼顾代码展示与技术讲解，适合需要自动化备份 Waline 数据的开发者参考。"
---

最近真的没怎么发文章，不是太懒更啊，而是有自己的事情要去做。这不，又写了一个小软件，用来备份 Waline 数据的。你可能会以为涉及到了数据库操作之类的，实际上并没有那么复杂。Waline 前端提供了一键导出的功能，直接就是完整的 JSON 数据文件。你当然不需要准备一个云盘或者一个独立的服务器，因为这套脚本只需要运行在 GitHub 仓库即可。我为其添加了 Actions 定时支持和详细的 README，你完全可以按照那套 README 里面的去做。这篇文章主要在代码展示以及技术讲解方面，教程是会包含一些的，以下是代码部分：

```python
#!/usr/bin/env python3

import argparse
import os
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser()
  parser.add_argument("--output-dir", "-o", type=Path, default=Path.cwd())
  return parser.parse_args()


def parse_reset_urls(raw: str) -> list[str]:
  urls = []
  for line in raw.replace(",", "\n").split("\n"):
    url = line.strip().rstrip(",").strip()
    if url:
      parsed = urlparse(url)
      if parsed.scheme and parsed.netloc:
        urls.append(url)
  return urls


def extract_domain(url: str) -> str:
  parsed = urlparse(url)
  hostname = parsed.hostname or "unknown"
  parts = hostname.split(".")
  if len(parts) >= 2:
    return "-".join(parts[-2:])
  return hostname.replace(".", "-")


def generate_filename(domain_tag: str, index: int, total: int) -> str:
  today = date.today().isoformat()
  if total > 1:
    return f"waline-backup-{today}-{domain_tag}-{index}.json"
  return f"waline-backup-{today}-{domain_tag}.json"


def main() -> None:
  args = parse_args()
  output_dir = args.output_dir
  output_dir.mkdir(parents=True, exist_ok=True)

  raw_urls = os.environ.get("WALINE_RESET_URLS", "").strip()
  if not raw_urls:
    print("错误: 未设置 WALINE_RESET_URLS", file=sys.stderr)
    sys.exit(1)

  urls = parse_reset_urls(raw_urls)
  if not urls:
    print("错误: 未解析出有效的重置链接", file=sys.stderr)
    sys.exit(1)

  ok = True

  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    for i, url in enumerate(urls, 1):
      domain_tag = extract_domain(url)
      output_path = output_dir / generate_filename(domain_tag, i, len(urls))

      page.goto(url, wait_until="domcontentloaded")
      page.wait_for_timeout(3_000)

      parsed = urlparse(url)
      base = f"{parsed.scheme}://{parsed.netloc}"
      page.goto(f"{base}/ui/migration", wait_until="domcontentloaded")
      page.wait_for_timeout(2_000)

      export_btn = page.locator(
        'button.btn:has-text("导出"), '
        'button.btn:has-text("Export")'
      )
      try:
        export_btn.wait_for(timeout=10_000)
      except PlaywrightTimeout:
        ok = False
        context.clear_cookies()
        continue

      with page.expect_download(timeout=120_000) as download_info:
        export_btn.click()

      download = download_info.value
      download.save_as(str(output_path))

      if not output_path.exists() or output_path.stat().st_size == 0:
        ok = False

      context.clear_cookies()

    browser.close()

  if ok:
    print("备份成功")
  else:
    print("备份失败", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
  main()
```

辅助模型使用的是 DeepSeek，它真的很便宜。这套代码的运行逻辑是：第一步，通过你的重置链接访问后台；第二步，通过当前的登录状态跳转到备份页；第三步，导出备份 JSON 到指定位置。为什么需要重置链接？因为 Cookie 我这边折腾不了，新版本的 Waline 貌似是破坏性更新的，老版本的密码直接不能用了；我确实尝试过重置密码，但是下次登录还是用的 QQ 登录。重置链接算是官方提供的一个小门口，别泄露这东西给别人的就行了。我也不确定重置链接会不会失效，有没有保质期之类的。如果会的话，可能就需要定时换什么的。配套的还有一份 Actions，以下是代码部分：

```yml
name: Waline Backup

on:
  schedule:
    - cron: "0 2 * * *"
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Install dependencies
        run: |
          pip install playwright
          python -m playwright install chromium

      - name: Run backup
        env:
          WALINE_RESET_URLS: ${{ secrets.WALINE_RESET_URLS }}
        run: python waline_backup.py

      - name: Push backup to target repository
        env:
          BACKUP_REPO: ${{ secrets.WALINE_BACKUP_REPO }}
          GH_TOKEN: ${{ secrets.WALINE_BACKUP_TOKEN }}
        run: |
          CLONE_URL="https://x-access-token:${GH_TOKEN}@${BACKUP_REPO#https://}"
          git clone --depth=1 "$CLONE_URL" backup-repo
          cp waline-backup-*.json backup-repo/
          cd backup-repo
          git config user.name "waline-backup-bot"
          git config user.email "waline-backup-bot@users.noreply.github.com"
          git add .
          git diff --cached --quiet || git commit -m "备份评论 $(date +%Y-%m-%d)"
          git push
```

值得一提的是，它使用的是仓库密钥，而不是硬编码到仓库的配置文件。仓库方面，你需要额外创建一个私密仓库，用于存储你的备份，这一点我相信大家清楚；还有一点是，千万要保管好这份文件，大家的命根子都在里面。可怕的不是泄露单独的邮箱、名字这些的，怕的是名字、邮箱、网站三个一起泄露，它几乎直接定了你是一个什么样的人。可是你会说，那没啥区别啊！我网站就是这样的，别人一来就能看到联系邮箱。那差别可就大的去了，来你网站看是合法渠道，而通过仓库去看是灰色渠道。并且，来看你网站的几乎是被你吸引过来的，对于他们来说你不是陌生人；但看你仓库的，就是纯纯的陌生人了。最后，附上三个密钥：

```

```