import sys
import os
import json
import urllib.request
import urllib.error

API_URL = "http://localhost:11434/api/chat"
MODEL = "gemma4:e4b-mlx"

PROMPT_TEMPLATE = """请阅读以下文章内容，为这篇文章生成 5 个适合 SEO 的标签。

要求：
1. 标签要精准概括文章主题，有利于搜索引擎优化
2. 只输出标签，用中文逗号分隔，不要输出其他任何内容
3. 格式示例：个人网站,个人经历,宇宙探索

{existing_tags_section}

文章内容：
"""


def readFile(path):
  with open(path, "r", encoding="utf-8") as f:
    return f.read()


def writeFile(path, content):
  with open(path, "w", encoding="utf-8") as f:
    f.write(content)


def buildPrompt(articleContent, existingTags):
  if existingTags:
    tagsStr = "、".join(sorted(existingTags))
    section = "4. 以下是本站已有的标签列表，请优先从中选择合适的标签复用，只有当已有标签无法概括文章时才生成新标签：\n" + tagsStr
  else:
    section = ""
  return PROMPT_TEMPLATE.format(existing_tags_section=section) + articleContent


def callApi(articleContent, existingTags):
  headers = {
    "Content-Type": "application/json",
  }
  payload = {
    "model": MODEL,
    "messages": [{"role": "user", "content": buildPrompt(articleContent, existingTags)}],
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


def parseTags(response):
  for sep in ["，", ","]:
    if sep in response:
      tags = [t.strip().strip('"').strip("'") for t in response.split(sep)]
      tags = [t for t in tags if t]
      return tags[:5]
  return [response.strip().strip('"').strip("'")][:5]


def insertTagsToFrontmatter(content, tags):
  parts = content.split("---", 2)
  if len(parts) < 3:
    print("Error: invalid frontmatter format, cannot find two --- delimiters")
    sys.exit(1)
  frontmatterBody = parts[1]
  articleBody = parts[2]
  if "tags:" in frontmatterBody:
    print("File already has tags, skipping")
    return None
  tagLines = "tags:"
  for tag in tags:
    tagLines += "\n  - " + tag
  newContent = "---" + frontmatterBody + tagLines + "\n---" + articleBody
  return newContent


def loadExistingTags(tagsFile):
  if not os.path.exists(tagsFile):
    return set()
  content = readFile(tagsFile).strip()
  if not content:
    return set()
  return set(line.strip() for line in content.split("\n") if line.strip())


def saveTagsDiff(tagsFile, newTags, existingTags):
  diff = [t for t in newTags if t not in existingTags]
  allTags = sorted(existingTags | set(newTags))
  writeFile(tagsFile, "\n".join(allTags) + "\n")
  if diff:
    print("New tags added to tags.md: " + ", ".join(diff))
  else:
    print("No new tags to add to tags.md")


def main():
  if len(sys.argv) < 2:
    print("Usage: python auto-tags.py <markdown_file_path>")
    sys.exit(1)

  filePath = os.path.abspath(sys.argv[1])
  if not os.path.exists(filePath):
    print("File not found: " + filePath)
    sys.exit(1)

  scriptDir = os.path.dirname(os.path.abspath(__file__))
  tagsFile = os.path.join(scriptDir, "tags.md")

  existingTags = loadExistingTags(tagsFile)

  content = readFile(filePath)

  print("Generating tags for: " + filePath)
  print("Existing tags count: " + str(len(existingTags)))
  response = callApi(content, existingTags)
  print("API response: " + response)

  tags = parseTags(response)
  print("Generated tags: " + ", ".join(tags))

  newContent = insertTagsToFrontmatter(content, tags)
  if newContent is None:
    sys.exit(0)

  writeFile(filePath, newContent)
  print("Tags inserted into: " + filePath)

  existingTags = loadExistingTags(tagsFile)
  saveTagsDiff(tagsFile, tags, existingTags)


if __name__ == "__main__":
  main()
