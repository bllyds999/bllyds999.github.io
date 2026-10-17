import sys
import os
import json
import urllib.request
import urllib.error

API_URL = "http://localhost:11434/api/chat"
MODEL = "gemma4:e4b-mlx"

PROMPT_TEMPLATE = """请阅读以下文章内容，为这篇文章生成一段超过 200 字的中文摘要。

要求：
1. 摘要必须以“本文介绍了”或“本文描述了”开头
2. 中文、英文、数字之间要用空格隔开，例如：我使用 Hexo 搭建了 1 个博客网站。
3. 摘要长度约 200 字，简洁准确地概括文章核心内容。
4. 只输出摘要文本，不要输出其他任何内容。
5. 不要有 Markdown

文章内容：
"""


def readFile(path):
  with open(path, "r", encoding="utf-8") as f:
    return f.read()


def writeFile(path, content):
  with open(path, "w", encoding="utf-8") as f:
    f.write(content)


def extractArticleBody(content):
  parts = content.split("---", 2)
  if len(parts) < 3:
    print("Error: invalid frontmatter format, cannot find two --- delimiters")
    sys.exit(1)
  return parts[2].strip()


def buildPrompt(articleBody):
  return PROMPT_TEMPLATE + articleBody


def callApi(prompt):
  headers = {
    "Content-Type": "application/json",
  }
  payload = {
    "model": MODEL,
    "messages": [{"role": "user", "content": prompt}],
    "stream": False,
    "options": {"temperature": 0.3},
  }
  body = json.dumps(payload).encode("utf-8")
  req = urllib.request.Request(API_URL, data=body, headers=headers, method="POST")
  try:
    with urllib.request.urlopen(req) as resp:
      result = json.loads(resp.read().decode("utf-8"))
      return result["message"]["content"].strip()
  except urllib.error.HTTPError as e:
    print("API HTTP error: {} {}".format(e.code, e.reason))
    sys.exit(1)
  except urllib.error.URLError as e:
    print("API request failed: {}".format(e.reason))
    sys.exit(1)


def insertDescriptionToFrontmatter(content, description):
  parts = content.split("---", 2)
  if len(parts) < 3:
    print("Error: invalid frontmatter format, cannot find two --- delimiters")
    sys.exit(1)
  frontmatterBody = parts[1]
  articleBody = parts[2]
  if "description:" in frontmatterBody:
    print("File already has description, skipping")
    return None
  newContent = "---" + frontmatterBody + "description: \"" + description + "\"\n---" + articleBody
  return newContent


def main():
  if len(sys.argv) < 2:
    print("Usage: python auto-description.py <markdown_file_path>")
    sys.exit(1)

  filePath = os.path.abspath(sys.argv[1])
  if not os.path.exists(filePath):
    print("File not found: " + filePath)
    sys.exit(1)

  content = readFile(filePath)
  articleBody = extractArticleBody(content)

  if not articleBody:
    print("Error: article body is empty")
    sys.exit(1)

  print("Generating description for: " + filePath)
  response = callApi(buildPrompt(articleBody))
  print("API response: " + response)

  newContent = insertDescriptionToFrontmatter(content, response)
  if newContent is None:
    sys.exit(0)

  writeFile(filePath, newContent)
  print("Description inserted into: " + filePath)


if __name__ == "__main__":
  main()
