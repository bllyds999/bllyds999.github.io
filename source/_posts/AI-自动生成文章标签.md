---
title: AI 自动生成文章标签
date: 2026-05-08 20:13:37
categories: 代码展示
cover: /assets/images/cover/code.webp
tags:
  - 大语言模型
  - DeepSeek
  - 技术折腾
  - 博客搭建
  - 个人网站
description: "本文介绍了作者为解决博客文章标签利用率低的问题而编写的 Python 自动化脚本。该脚本利用 DeepSeek API 为每篇文章生成 5 个适合 SEO 的标签，并优先复用已有的标签库以避免重复。脚本自动读取 Markdown 文件，调用 API 后解析返回的标签，插入到文件的 frontmatter 中，同时更新一个标签总和文件，确保每次运行只载入当前文章和标签列表，从而降低上下文熵增。作者还建议配合 Git 管理文章目录以防数据丢失。该脚本有效简化了标签分配流程，提升了博客 SEO 优化效率。"
---

老读者都知道，我最近正在忙着网站的样式修改工作，最近也是终于完成了样式修改并 Push 到了云端部署。然而在我浏览网站的时候，发现大部分文章的标签利用率真的很低——相关标签点进去大概率只有一篇文章，很多文章本来应该是这个标签，但是却不在这里，因为我没有分配。上个月的时候我就重新分配过一次标签，当时文章还不算多，还可以使用编辑器自带的 AI 进行操作的。用 AI 生成标签有两个好处，第一点 AI 确实是 Token 机制的原住民，人家比你还清楚每个值在向量中表达什么，另一点是不需要花费人力物力重新标签，我敢打赌大部分写博客的人很少回看自己的博客文章。

用编辑器 AI 本质上还是一种人工代偿：AI 需要有上下文才能知道文章的内容，于是它才知道应该发配什么标签。但实际上由于编辑器内置了一堆 SKills，以及文章多的时候字数特别多（如果算每篇文章 800 到 2000 字的话，五十多篇大概就是六万多字），上下文熵增速度贼快。一般来说我们让 AI 分配标签，大部分人的选择就是直接让 AI 读所有文章（因为大家就是纯懒惰，里面有所有文章内容、所有文章标签），后续如果不想消耗 Token 的话，应该会使用 Obsidian 打开 `_posts` 目录，人工分配标签。有一种办法就是，在 AI 每次写完标签后，存到标签总和里，下次直接让 AI 读文章内容和标签总和。为此，我编写了以下 Python 代码：

```python
import sys
import os
import json
import urllib.request
import urllib.error

API_URL = "https://api.deepseek.com/chat/completions" # 这里我拿 DeepSeek API 举例子
API_KEY = "" # 写你自己的 API KEY
MODEL = "deepseek-v4-flash"

PROMPT_TEMPLATE = """请阅读以下文章内容，为这篇文章生成 5 个适合 SEO 的标签。
要求：
1. 标签要精准概括文章主题，有利于搜索引擎优化
2. 只输出标签，用中文逗号分隔，不要输出其他任何内容
3. 格式示例：个人网站,个人经历,宇宙探索
{existing_tags_section}
文章内容：
"""


def read_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def build_prompt(article_content, existing_tags):
    if existing_tags:
        tags_str = "、".join(sorted(existing_tags))
        section = "4. 以下是本站已有的标签列表，请优先从中选择合适的标签复用，只有当已有标签无法概括文章时才生成新标签：\n" + tags_str
    else:
        section = ""
    return PROMPT_TEMPLATE.format(existing_tags_section=section) + article_content


def call_api(article_content, existing_tags):
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY,
    }
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": build_prompt(article_content, existing_tags)}],
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


def parse_tags(response):
    for sep in ["，", ","]:
        if sep in response:
            tags = [t.strip().strip('"').strip("'") for t in response.split(sep)]
            tags = [t for t in tags if t]
            return tags[:5]
    return [response.strip().strip('"').strip("'")][:5]


def insert_tags_to_frontmatter(content, tags):
    parts = content.split("---", 2)
    if len(parts) < 3:
        print("Error: invalid frontmatter format, cannot find two --- delimiters")
        sys.exit(1)
    frontmatter_body = parts[1]
    article_body = parts[2]
    if "tags:" in frontmatter_body:
        print("File already has tags, skipping")
        return None
    tag_lines = "tags:"
    for tag in tags:
        tag_lines += "\n  - " + tag
    new_content = "---" + frontmatter_body + tag_lines + "\n---" + article_body
    return new_content


def load_existing_tags(tags_file):
    if not os.path.exists(tags_file):
        return set()
    content = read_file(tags_file).strip()
    if not content:
        return set()
    return set(line.strip() for line in content.split("\n") if line.strip())


def save_tags_diff(tags_file, new_tags, existing_tags):
    diff = [t for t in new_tags if t not in existing_tags]
    all_tags = sorted(existing_tags | set(new_tags))
    write_file(tags_file, "\n".join(all_tags) + "\n")
    if diff:
        print("New tags added to tags.md: " + ", ".join(diff))
    else:
        print("No new tags to add to tags.md")


def main():
    if len(sys.argv) < 2:
        print("Usage: python auto-tags.py <markdown_file_path>")
        sys.exit(1)

    file_path = os.path.abspath(sys.argv[1])
    if not os.path.exists(file_path):
        print("File not found: " + file_path)
        sys.exit(1)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    tags_file = os.path.join(script_dir, "tags.md")

    existing_tags = load_existing_tags(tags_file)

    content = read_file(file_path)

    print("Generating tags for: " + file_path)
    print("Existing tags count: " + str(len(existing_tags)))
    response = call_api(content, existing_tags)
    print("API response: " + response)

    tags = parse_tags(response)
    print("Generated tags: " + ", ".join(tags))

    new_content = insert_tags_to_frontmatter(content, tags)
    if new_content is None:
        sys.exit(0)

    write_file(file_path, new_content)
    print("Tags inserted into: " + file_path)

    existing_tags = load_existing_tags(tags_file)
    save_tags_diff(tags_file, tags, existing_tags)


if __name__ == "__main__":
    main()
```

它可以自动化这个流程，不需要在写完文章之后，每次都打开聊天框和 AI 说要干什么事情，同时还能确保功能的健壮性。关键是熵增速度还慢，只有一个文件，脚本在生成标签后，会自动检测 AI 用的标签哪些是仓库已经有的，如果这个标签存在，则不增加标签总和；如果这个标签不存在，则将新标签加入进总和。每次运行的时候，上下文开销只有标签总和，因为每次都只载入当前阅读的上下文。建议在使用这个脚本的同时，使用 Git 管理文章目录（这里指静态网站），避免 AI 生成标签之后，破坏了你的文章内容。曾经我为了吐槽吴语涵，写完初稿后拿给 AI 改，结果 AI 直接把我文章吞了，关键是我还没保存，之后那篇是我理清思路后重新写的。