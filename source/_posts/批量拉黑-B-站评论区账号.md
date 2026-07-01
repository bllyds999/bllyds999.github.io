---
title: 批量拉黑 B 站评论区账号：评论区太乱？这个脚本帮你批量拉黑
date: 2026-07-01 11:56:46
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - B 站
  - Python 脚本
  - Playwright
  - 技术折腾
  - 批量拉黑
description: "本文介绍了作者为解决 B 站评论区充斥不适内容而开发的 Bilibili Comment Blacklist Tool 脚本。该工具基于 Playwright 框架，能够自动滚动评论、点击“更多”按钮并执行“加入黑名单”操作，全程不显示评论内容，避免用户情绪污染。文章详细阐述了脚本面临的两大技术挑战：嵌套 Shadow DOM 的结构穿越以及默认隐藏的“更多”按钮，并给出通过 JavaScript evaluate 强制覆写 CSS 样式、使用 dispatchEvent 模拟点击的解决方案。同时，脚本处理了拉黑后评论区自动刷新的情况，通过 UID 去重避免重复拉黑。部署步骤包括克隆项目、创建 Python 虚拟环境、安装依赖及 Playwright 的 Chromium 浏览器，并需将 B 站 Cookie 粘贴到配置中。文章最后强调该工具仅供学习研究，存在封号风险，作者通过加入随机延迟（0.5 - 3.5 秒）模拟人类操作以降低检测概率，并计划未来增加按关键词或用户名拉黑等精细功能，帮助用户过滤不良内容。"
---

我真的很喜欢在 B 站上看海绵宝宝，那些无厘头的幽默总能让我忘记一天的疲惫。但不知道从什么时候开始，我的首页推荐流里混进了越来越多奇奇怪怪的东西——二次元游戏圈的党争、键政圈的对线、小鬼圈的烂梗，这些东西像牛皮癣一样甩都甩不掉。每次我只是想安安静静看个视频，评论区却总有人在吵架、钓鱼、刷屏。我尝试过点“不感兴趣”，也试过屏蔽某些关键词，但算法似乎总能找到新的方式来恶心我。说实话，B 站让我挺失望的，那个曾经充满二次元二创、鬼畜调音和经典电视剧的地方，现在变得越来越嘈杂了。

我也不是没想过反抗。B 站其实提供了一个“拉黑”功能，只要把某个用户加入黑名单，你就再也看不到他的评论、私信和动态了——相当于这个人从你的 B 站世界里彻底消失。这本来是个很好的隔离手段，但问题在于：当你看到一条令人不适的评论时，你已经读完了它的内容，已经生气了。在这种情况下，很少有人能心平气和地再点进“更多”菜单、找到“加入黑名单”、再确认一遍弹窗。而且就算你真的拉黑了这个人，你的情绪已经被破坏了，拉黑本身并不能让你高兴起来。更别提那些视频底下动辄几百上千条评论，一个一个手动拉黑根本不现实。

所以我写了一个脚本，专门解决这个问题。它叫做 Bilibili Comment Blacklist Tool，这是[项目地址](github.com/bllyds999/bilibili-comment-blacklist-tool)。这个工具的原理很简单：打开一个 B 站视频页面，自动滚动评论区，找到每条评论的“更多”按钮，点击“加入黑名单”，然后确认弹窗——全程自动化，你只需要在命令行里看着它运行就行了。最关键的是，这个过程中你只会看到被拉黑用户的昵称和 UID，完全不会看到评论内容本身。也就是说，你可以批量清理一个视频底下所有评论者，而不会在这个过程中被任何一条评论恶心到。等脚本跑完，这个视频底下的人就跟你的 B 站世界再也没有关系了：

````python
#!/usr/bin/env python3
"""
哔哩哔哩评论区批量拉黑工具

DOM 结构（关键）：
  div#body              ← 每条评论的根容器（Light DOM）
  a#user-avatar[data-user-profile-id]  ← 用户 UID
  div#main
    div#header
    bili-comment-user-info    ← Shadow DOM → #user-name > a（用户名）
    div#content
    bili-rich-text        ← Shadow DOM → #contents（评论正文）
    div#footer
    bili-comment-action-buttons-renderer  ← Shadow DOM
      div#more
      button           ← 「更多」按钮
      bili-comment-menu    ← Shadow DOM → ul#options > li（菜单项）

嵌套 Shadow DOM 穿透策略：
  - 用 Playwright 的 >> 组合器找到 Shadow DOM 内的按钮
  - 用 JS evaluate + getRootNode().host 从按钮跨越 Shadow DOM 边界到 Light DOM
  - 用 JS evaluate + shadowRoot 穿透 bili-comment-menu 的 Shadow DOM 点击菜单项

使用方式：
  source venv/bin/activate
  python main.py
"""

import asyncio
import random
import re
import sys
import time
from typing import Optional

from playwright.async_api import async_playwright, Page

# ============================================================
# 固定配置 — Cookie 写在这里，不用每次粘贴
# ============================================================

# 在浏览器中打开 bilibili.com，DevTools → Application → Cookies，
# 全选复制所有 Cookie，粘贴到下面的三引号之间。
COOKIE_RAW = """

"""

# 要处理的视频 URL（可留空，每次运行时输入）
VIDEO_URL = ""


# ============================================================
# Cookie 解析
# ============================================================

def parse_cookie_string(raw: str) -> list[dict]:
  """
  解析用户粘贴的 Cookie 字符串，转为 Playwright 格式。

  支持格式：
    1. 浏览器 DevTools 复制： "name1=value1; name2=value2; ..."
    2. Netscape 导出格式（多行，含 \t 分隔符）
  """
  cookies = []
  domain = ".bilibili.com"

  if "\n" in raw.strip():
    for line in raw.strip().split("\n"):
      line = line.strip()
      if not line or line.startswith("#"):
        continue
      parts = line.split("\t")
      if len(parts) >= 7:
        name, value = parts[5], parts[6]
      elif "=" in line:
        name, value = line.split("=", 1)
      else:
        continue
      cookies.append({
        "name": name.strip(),
        "value": value.strip(),
        "domain": domain,
        "path": "/",
        "httpOnly": False,
        "secure": True,
        "sameSite": "Lax",
      })
  else:
    for pair in raw.split(";"):
      pair = pair.strip()
      if "=" not in pair:
        continue
      name, value = pair.split("=", 1)
      cookies.append({
        "name": name.strip(),
        "value": value.strip(),
        "domain": domain,
        "path": "/",
        "httpOnly": False,
        "secure": True,
        "sameSite": "Lax",
      })

  if not cookies:
    print("⚠️  未解析到任何 Cookie，请检查输入格式。")
    sys.exit(1)

  print(f"✅ 解析到 {len(cookies)} 个 Cookie")
  return cookies


# ============================================================
# 获取评论信息（UID + 用户名），跨越 Shadow DOM 边界
# ============================================================

async def get_comment_info(button) -> dict:
  """
  从「更多」按钮出发，跨越 Shadow DOM 边界到 Light DOM，
  提取评论的用户 UID 和用户名。

  返回: {"uid": str, "username": str}
  """
  info = await button.evaluate('''
    (btn) => {
      // Step 1: 从按钮所在的 Shadow DOM 跳到 Light DOM
      const actionButtons = btn.getRootNode().host;
      if (!actionButtons) return {uid: null, username: '未知'};

      const footer = actionButtons.parentElement;
      if (!footer) return {uid: null, username: '未知'};

      const main = footer.parentElement;
      if (!main) return {uid: null, username: '未知'};

      const body = main.parentElement;
      if (!body) return {uid: null, username: '未知'};

      // Step 2: 从 div#body 的子元素中获取用户信息
      const avatar = body.querySelector(':scope > a#user-avatar');
      const profileId = avatar ? avatar.getAttribute('data-user-profile-id') : null;

      // Step 3: 穿透 bili-comment-user-info 的 Shadow DOM 获取用户名
      const userInfo = body.querySelector('bili-comment-user-info');
      let username = '未知';
      if (userInfo && userInfo.shadowRoot) {
        const nameLink = userInfo.shadowRoot.querySelector('#user-name a');
        if (nameLink) {
          username = nameLink.textContent.trim();
        }
      }

      // Step 4: 回退 — 用 bili-rich-text 中的评论内容前20字做标识
      let snippet = '';
      const richText = body.querySelector('bili-rich-text');
      if (richText && richText.shadowRoot) {
        const contents = richText.shadowRoot.querySelector('#contents');
        if (contents) {
          snippet = contents.textContent.trim().substring(0, 30);
        }
      }

      return {
        uid: profileId || ('fallback-' + snippet),
        username: username,
        snippet: snippet,
      };
    }
  ''')
  return info


# ============================================================
# 确认弹窗处理
# ============================================================

async def handle_confirmation_dialog(page: Page, timeout: float = 3.0) -> bool:
  """
  等待并自动点击 B 站「确定拉黑」弹窗中的确认按钮。
  """
  confirm_selectors = [
    "text=确定",
    "text=确认",
    "button:has-text('确定')",
    "button:has-text('确认')",
    "[class*='primary']:has-text('确定')",
    "[class*='primary']:has-text('确认')",
    ".bili-modal button:has-text('确定')",
    "[class*='dialog'] button:has-text('确定')",
  ]

  for _ in range(int(timeout * 10)):
    for sel in confirm_selectors:
      try:
        btn = page.locator(sel).first
        if await btn.is_visible(timeout=100):
          await btn.click()
          await asyncio.sleep(0.5)
          return True
      except Exception:
        pass
    await asyncio.sleep(0.1)

  return False


# ============================================================
# 处理单条评论：点更多 → 点加入黑名单
# ============================================================

async def process_one_comment(page: Page, button) -> bool:
  """
  处理一条评论的拉黑操作（全程 JS evaluate，跳过 Playwright 可见性检查）：

    1. 强制设置 CSS 让被隐藏的「更多」按钮可见
    2. 点击「更多」按钮
    3. 穿透 bili-comment-menu 的 Shadow DOM → 点击「加入黑名单」
    4. 处理确认弹窗
  """
  try:
    clicked = await button.evaluate('''
      async (btn) => {
        // --- 1. 强制让「更多」按钮及其容器可见 ---
        // B 站用 CSS 变量 --bili-comment-hover-more-display 控制显隐，
        // 默认 display:none，只有鼠标悬停才出现。
        // 直接改 inline style 强制露出。
        const moreDiv = btn.closest('div#more');
        if (moreDiv) {
          moreDiv.style.setProperty('display', 'block', 'important');
          moreDiv.style.setProperty('visibility', 'visible', 'important');
          moreDiv.style.setProperty('opacity', '1', 'important');
        }
        btn.style.setProperty('display', 'inline-block', 'important');
        btn.style.setProperty('visibility', 'visible', 'important');
        btn.style.setProperty('opacity', '1', 'important');
        // 等一帧确保样式生效
        await new Promise(r => requestAnimationFrame(r));

        // --- 2. 点击「更多」按钮 ---
        btn.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
        await new Promise(r => setTimeout(r, 400));

        // --- 3. 在 bili-comment-menu 的 Shadow DOM 中点击「加入黑名单」---
        if (!moreDiv) return false;
        const menu = moreDiv.querySelector('bili-comment-menu');
        if (!menu || !menu.shadowRoot) return false;

        const items = menu.shadowRoot.querySelectorAll('li');
        for (const li of items) {
          if (li.textContent && li.textContent.includes('加入黑名单')) {
            li.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
            return true;
          }
        }
        return false;
      }
    ''')

    if not clicked:
      try:
        await page.get_by_text("加入黑名单", exact=True).first.click(timeout=2000)
        clicked = True
      except Exception:
        pass

    if not clicked:
      return False

    # 4. 等待并处理确认弹窗
    await asyncio.sleep(0.8)
    await handle_confirmation_dialog(page, timeout=2.0)

    return True

  except Exception as e:
    print(f"   ❌ 处理出错: {e}")
    return False


# ============================================================
# 主循环：处理一条 → 等待页面刷新 → 下一条
# ============================================================

async def run_blacklist_loop(page: Page):
  """
  主循环（适配 B 站拉黑后自动刷新评论的行为）：

    1. 找到一条未处理的评论 → 拉黑
    2. 等待页面自动刷新（该评论消失，新评论顶上）
    3. 继续找下一条
    4. 当前可见的都处理完了 → 缓慢滚动加载更多
    5. 到达底部且无新评论 → 结束
  """
  processed_uids: set[str] = set()
  total_blacklisted = 0
  no_new_streak = 0       # 连续"找不到未处理评论"的次数
  scroll_accumulator = 0    # 累计滚动距离，偶尔需要滚一下加载更多

  print("\n🚀 开始处理评论（拉黑一条 → 页面自动刷新 → 下一条）...\n")

  while True:
    # --- 尝试找一条未处理的评论 ---
    buttons = await page.locator(
      "bili-comment-action-buttons-renderer >> div#more > button"
    ).all()

    found_one = False
    for i, button in enumerate(buttons):
      try:
        info = await get_comment_info(button)
        uid = info.get("uid", f"unknown-{i}")
        username = info.get("username", "未知")

        if uid in processed_uids:
          continue  # 已拉黑过

        # 找到了！处理它
        found_one = True
        processed_uids.add(uid)

        print(f"🔨 [{total_blacklisted + 1}] 正在拉黑: {username} (UID: {uid}) ...")

        success = await process_one_comment(page, button)

        if success:
          total_blacklisted += 1
          print(f"   ✅ 已拉黑: {username}（累计 {total_blacklisted} 人）")
        else:
          print(f"   ⚠️  跳过: {username}（菜单点击失败）")

        # 拉黑后 B 站会刷新评论区，等待 DOM 稳定
        await asyncio.sleep(random.uniform(1.5, 2.5))

        # 处理完一条就 break，重新扫描（因为页面已刷新，旧元素可能失效）
        break

      except Exception:
        # 页面刷新导致元素失效是正常的，跳过这条重新扫描
        continue

    # --- 根据结果决定下一步 ---
    if found_one:
      no_new_streak = 0
      continue  # 继续找下一条可见评论

    # --- 当前可见评论都已处理，需要滚动加载更多 ---
    no_new_streak += 1

    if no_new_streak >= 4:
      # 连续多次找不到新评论，可能到底了
      print("\n⏳ 连续多次未发现新评论，尝试最后滚动...")
      await page.evaluate("window.scrollBy(0, 1000)")
      await asyncio.sleep(5)

      # 最终扫描
      any_new = False
      final_buttons = await page.locator(
        "bili-comment-action-buttons-renderer >> div#more > button"
      ).all()
      for b in final_buttons:
        try:
          info = await get_comment_info(b)
          if info.get("uid") and info.get("uid") not in processed_uids:
            any_new = True
            break
        except Exception:
          # 元素可能已失效（页面变化），跳过
          continue

      if not any_new:
        print(f"\n🏁 已完成！共拉黑 {total_blacklisted} 人。")
        break
      else:
        no_new_streak = 0
        print("   发现新评论，继续处理...\n")
        continue

    # --- 缓慢滚动，加载更多评论 ---
    scroll_delta = random.randint(300, 500)
    current_scroll = await page.evaluate("window.scrollY")
    page_height = await page.evaluate("document.body.scrollHeight")

    await page.evaluate(f"window.scrollBy(0, {scroll_delta})")

    wait_time = random.uniform(2.0, 3.5)
    await asyncio.sleep(wait_time)

    print(f"   📜 滚动 {scroll_delta}px | 位置 {current_scroll}/{page_height} | 已拉黑 {total_blacklisted} 人")

    # 如果到底了
    if current_scroll + scroll_delta >= page_height - 100:
      await asyncio.sleep(3)  # 等待可能的懒加载
      new_height = await page.evaluate("document.body.scrollHeight")
      if new_height <= page_height:
        no_new_streak += 1

  return total_blacklisted


# ============================================================
# 程序入口
# ============================================================

async def main():
  print("=" * 60)
  print("  哔哩哔哩评论区 · 批量拉黑工具")
  print("=" * 60)
  print()

  # --- 获取 Cookie ---
  cookie_str = COOKIE_RAW.strip()
  if not cookie_str:
    print("❌ 请先在 main.py 顶部的 COOKIE_RAW 中粘贴你的 B 站 Cookie。")
    print("   浏览器 DevTools → Application → Cookies → 全选复制 → 粘贴到三引号之间。")
    sys.exit(1)

  # --- 获取视频 URL ---
  video_url = VIDEO_URL.strip()
  if not video_url:
    video_url = input("🔗 请输入视频页面 URL: ").strip()
  else:
    print(f"🔗 使用配置中的视频 URL: {video_url}")

  if not video_url:
    print("❌ 未输入视频 URL，程序退出。")
    sys.exit(1)

  # --- 解析 Cookie ---
  cookies = parse_cookie_string(cookie_str)

  # --- 启动无头浏览器 ---
  print("\n🌐 正在启动无头浏览器...")
  async with async_playwright() as p:
    browser = await p.chromium.launch(
      headless=True,
      args=[
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
      ],
    )

    context = await browser.new_context(
      viewport={"width": 1920, "height": 1080},
      user_agent=(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
      ),
      locale="zh-CN",
    )

    await context.add_cookies(cookies)

    page = await context.new_page()

    # 自动接受原生 alert/confirm 弹窗（备用）
    page.on("dialog", lambda dialog: asyncio.ensure_future(_accept_dialog(dialog)))

    # --- 打开视频页面 ---
    print(f"📄 正在加载: {video_url}")
    try:
      await page.goto(video_url, wait_until="domcontentloaded", timeout=30000)
    except Exception:
      print("⚠️  页面加载超时，尝试继续...")
      await page.wait_for_timeout(3000)

    try:
      await page.wait_for_load_state("load", timeout=15000)
    except Exception:
      pass
    print("✅ 页面加载完成")

    # 等待评论区渲染
    await asyncio.sleep(3)

    # 先滚一下，触发评论区懒加载
    await page.evaluate("window.scrollBy(0, 800)")
    await asyncio.sleep(3)

    # --- 主循环 ---
    try:
      total = await run_blacklist_loop(page)
      print(f"\n🎉 程序运行完毕，共拉黑 {total} 人。")
    except KeyboardInterrupt:
      print(f"\n⏹️  用户中断。")
    finally:
      await browser.close()
      print("👋 浏览器已关闭。")


async def _accept_dialog(dialog):
  """自动接受浏览器原生弹窗"""
  try:
    await dialog.accept()
  except Exception:
    pass


if __name__ == "__main__":
  asyncio.run(main())

````

说起来简单，但实际写这个脚本的时候遇到了不少麻烦。首先，B 站的评论组件使用了嵌套的 Shadow DOM，里面包着 `bili-comment-menu`，常规的 DOM 选择器根本拿不到里面的按钮。其次，B 站的“更多”按钮默认是隐藏的，它通过一个 CSS 变量控制显隐，只有鼠标悬停在评论上才会出现。Playwright 的可见性检查在这种元素上会直接超时。我的解决方案是全部在 JavaScript 层面操作：用 `element.evaluate()` 强制覆盖 CSS 样式让按钮可见，再用 `dispatchEvent` 模拟点击事件——即使元素是 `display:none` 也能正常工作。

另外，每次拉黑一个人之后 B 站会自动刷新评论区，脚本需要实时重新扫描，并且按 UID 去重，避免重复拉黑同一个人。如果你想自己试试这个工具，部署流程并不复杂，但需要一点命令行基础。首先把项目克隆到本地，然后创建 Python 虚拟环境并激活——我推荐用虚拟环境，这样所有依赖都装在项目目录里，不会污染系统。接着安装依赖：

```
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/playwright install chromium
```

下载 Playwright 所需的 Chromium 浏览器近 200MB，如果网络好的话不需要等待多久。最关键的一步是配置 Cookie：打开 B 站网页，按 F12 打开开发者工具，复制所有 Cookie（这一步在网络上很多人写教程，可自行向 AI 提问该步骤，或者在搜索引擎搜索“如何提取页面 Cookie”），粘贴到 `main.py` 里 COOKIE_RAW 的三引号中间。这个 Cookie 包含了你的登录状态，非常重要，千万不要提交到 Git 或者分享给任何人，最后在 `main.py` 里填上你要处理的视频链接。一切配置好之后，在终端里激活虚拟环境，运行这段命令就行了：

```
.venv/bin/python main.py
```

脚本会启动一个无头浏览器（你看不到窗口），自动打开视频页面，然后开始缓慢滚动评论区，等待 2 到 3.5 秒让评论加载出来。每找到一条未处理的评论，脚本就会执行拉黑操作，然后 B 站刷新评论区，脚本继续处理下一条。命令行里会实时输出进度。当所有可见评论都处理完后，脚本会继续滚动加载更多，直到到达评论区底部，然后自动退出。整个过程你只需要看着屏幕，什么都不用做。

最后必须强调一点：使用这个脚本有封号风险。因为脚本用到了你的 B 站 Cookie，相当于模拟你在浏览器里的操作，B 站的风控系统可能会检测到异常行为。为了降低风险，我在脚本里加入了随机延迟——操作之间间隔 0.5 到 1.5 秒，滚动间隔 2 到 3.5 秒——尽可能模仿人类的操作节奏。这个工具仅供学习研究使用，我会根据实际需求持续维护，未来计划增加按关键词拉黑、按用户名拉黑等更精细的功能，让大家能更精准地过滤掉不想看到的内容，还大家一个清净的 B 站。欢迎大家收藏和提交反馈。