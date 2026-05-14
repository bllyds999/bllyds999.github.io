---
title: AI 自动生成文章摘要
categories: 代码展示
cover: /assets/images/cover/code.webp
date: 2026-05-14 09:44:40
tags:
  - AI 机器人
  - DeepSeek
  - 个人网站
  - 博客搭建
  - 前端脚本
description: "本文介绍了作者如何利用 AI 技术为博客文章自动生成摘要，以解决主题默认截取前 500 字作为页面描述所带来的内容不完整、体验不佳的问题。作者借鉴了 CSDN 的 AI 摘要功能，基于已有的 Markdown 文件处理、API 调用与 Frontmatter 解析经验，设计并实现了 1 个自动化脚本。该脚本接收文章文件路径，读取内容后以 --- 为定位符提取正文，将正文发送给 DeepSeek 模型，并附带精心设计的提示词，要求生成以“本文介绍了”或“本文描述了”开头、字数超过 200 字、符合中英文空格规范的中文摘要。最后将 AI 返回的摘要作为 description 值插入到 Frontmatter 中。此脚本不仅能够提升 SEO 优化效果，更重要的是尊重访客的阅读体验，使他们能快速判断文章内容，实现更高效的浏览。整个实现复用 auto-tags.py 等已有代码，技术路径清晰，体现了技术服务于人的理念。"
---

之前，我已经成功实现了利用 AI 自动生成文章标签和说说标签的功能，这极大地提升了我的内容管理效率。现在，我打算进一步实现 AI 自动生成文章摘要的功能。那么，为什么我如此迫切地需要这个功能呢？

原因很简单，主题默认截取的 500 字页面描述实在是让人难以接受。在实际写作中，绝大多数人写文章时，第一段通常是用来引入话题、交代背景或阐述问题的“开头”，而不是整篇文章的核心概括。

这意味着，强制截取前 500 个字作为页面描述，往往会得到一个不完整、甚至不知所云的片段，既无法准确传达文章主旨，也破坏了阅读体验。对于需要快速了解文章内容的访客来说，这 500 字的前置信息几乎毫无价值，甚至可能让他们直接错过一篇好文章。

因此，我需要一个更智能的解决方案。其实，这个想法的灵感直接来源于 CSDN 的 AI 自动生成文章摘要功能。早在去年 5 月我写博客的时候，就非常喜欢 CSDN 提供的这项便利——它能自动提炼出文章的核心要点，让读者在点击之前就有一个清晰的预期。

请不要一听到“AI 自动生成”就以为我是在模仿安知鱼的实现方式……其实完全不是那么回事。这既不是我朋友那种动态 AI 生成的、逐字输出的打字机效果，也不是什么花哨的实时交互功能。

我的需求非常纯粹且务实：就是让 AI 针对每一篇静态文章，独立、批量地生成一段简洁准确的摘要。基于已有的代码基础，我打算设计这样一个实现流程：首先，脚本会接收第一个文章的文件路径作为参数，并读取其全部内容。

接着，它会将文章内容中的 `---` 作为 Frontmatter 与正文之间的定位符，精确地把定位符以下的所有文章正文部分提取出来。然后，这段正文会被发送给 AI 模型，并附带一个精心设计的提示词。

要求 AI 生成一段超过 200 字、以“本文介绍了”或“本文描述了”开头、且符合中英文空格规范的中文摘要。最后，脚本会获取 AI 返回的结果，将新生成的摘要作为 `description` 的值插入到定位符前，从而完成对原文件的更新。

因为我之前已经编写过 `auto-tags.py` 和 `auto-description.py` 这两个脚本，积累了处理 Markdown 文件、调用 API 以及解析 Frontmatter 的成熟经验，所以这些代码完全可以拿来直接修改和复用，技术路径非常清晰：

```python
import sys
import os
import json
import urllib.request
import urllib.error

API_URL = "https://api.deepseek.com/chat/completions"
API_KEY = ""
MODEL = "deepseek-v4-flash"

PROMPT_TEMPLATE = """请阅读以下文章内容，为这篇文章生成一段超过 200 字的中文摘要。

要求：
1. 摘要必须以“本文介绍了”或“本文描述了”开头
2. 中文、英文、数字之间要用空格隔开，例如：我使用 Hexo 搭建了 1 个博客网站。
3. 摘要长度约 200 字，简洁准确地概括文章核心内容。
4. 只输出摘要文本，不要输出其他任何内容。
5. 不要有 Markdown

文章内容：
"""


def read_file(path):
  with open(path, "r", encoding="utf-8") as f:
    return f.read()


def write_file(path, content):
  with open(path, "w", encoding="utf-8") as f:
    f.write(content)


def extract_article_body(content):
  parts = content.split("---", 2)
  if len(parts) < 3:
    print("Error: invalid frontmatter format, cannot find two --- delimiters")
    sys.exit(1)
  return parts[2].strip()


def build_prompt(article_body):
  return PROMPT_TEMPLATE + article_body


def call_api(prompt):
  headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + API_KEY,
  }
  payload = {
    "model": MODEL,
    "messages": [{"role": "user", "content": prompt}],
    "temperature": 0.3,
  }
  body = json.dumps(payload).encode("utf-8")
  req = urllib.request.Request(API_URL, data=body, headers=headers, method="POST")
  try:
    with urllib.request.urlopen(req) as resp:
      result = json.loads(resp.read().decode("utf-8"))
      return result["choices"][0]["message"]["content"].strip()
  except urllib.error.HTTPError as e:
    print("API HTTP error: {} {}".format(e.code, e.reason))
    sys.exit(1)
  except urllib.error.URLError as e:
    print("API request failed: {}".format(e.reason))
    sys.exit(1)


def insert_description_to_frontmatter(content, description):
  parts = content.split("---", 2)
  if len(parts) < 3:
    print("Error: invalid frontmatter format, cannot find two --- delimiters")
    sys.exit(1)
  frontmatter_body = parts[1]
  article_body = parts[2]
  if "description:" in frontmatter_body:
    print("File already has description, skipping")
    return None
  new_content = "---" + frontmatter_body + "description: \"" + description + "\"\n---" + article_body
  return new_content


def main():
  if len(sys.argv) < 2:
    print("Usage: python auto-description.py <markdown_file_path>")
    sys.exit(1)

  file_path = os.path.abspath(sys.argv[1])
  if not os.path.exists(file_path):
    print("File not found: " + file_path)
    sys.exit(1)

  content = read_file(file_path)
  article_body = extract_article_body(content)

  if not article_body:
    print("Error: article body is empty")
    sys.exit(1)

  print("Generating description for: " + file_path)
  response = call_api(build_prompt(article_body))
  print("API response: " + response)

  new_content = insert_description_to_frontmatter(content, response)
  if new_content is None:
    sys.exit(0)

  write_file(file_path, new_content)
  print("Description inserted into: " + file_path)


if __name__ == "__main__":
  main()
```

就这样，一个能够帮我自动生成高质量文章描述、并有效优化 SEO（搜索引擎优化）的功能性脚本就顺利完成了。但它的价值远不止于提升搜索引擎排名。对我来说，这个脚本更重要的意义在于，它是对我的访客的一种尊重。

访客来到我的博客，是为了高效地获取有价值的信息，而不是被迫忍受那些由于技术限制而自动截取的前 500 个字的尴尬开头。通过这个脚本生成的、真正由 AI 理解文章内容后提炼出的摘要。

访客可以在一目了然的阅读中，快速判断这篇文章是否包含他们感兴趣的内容，以及整篇文章的叙述流程会如何展开。这让他们能够提前做好心理准备，有选择性地阅读，从而获得更流畅、更舒适的浏览体验。这才是技术服务于人的真正体现。