import yaml
from playwright.sync_api import sync_playwright, TimeoutError

# 固定友链文件路径
YAML_PATH = "/Users/liangdongye/Documents/trae_projects/demo/source/_data/link.yml"
# 访问超时时间（毫秒）
TIMEOUT = 10000

def main():
  # 读取yaml
  with open(YAML_PATH, "r", encoding="utf-8") as f:
    data = yaml.safe_load(f)

  # 取第一个分组的link_list
  first_group = data[0]
  friend_links = first_group.get("link_list", [])

  with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    for item in friend_links:
      name = item.get("name")
      url = item.get("link")
      if not name or not url:
        continue
      try:
        page.goto(url, timeout=TIMEOUT)
      except (TimeoutError, Exception):
        # 任何访问异常，输出固定格式
        print(f"{name}的网站挂了！")

    browser.close()

if __name__ == "__main__":
  main()