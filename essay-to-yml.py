#!/usr/bin/env python3
"""把 JSON 形式的说说数据转成 示范.txt 风格的 YAML。

格式逻辑在 essay_yml.py（与 essay.py 追加新说说时共用），本脚本只负责读 JSON、
写 YAML。纯标准库，无第三方依赖。

用法：
    python3 essay-to-yml.py
    python3 essay-to-yml.py --input essay/essay.json --output source/_data/shuoshuo.yml
    python3 essay-to-yml.py --reverse        # 倒序输出
"""
import argparse
import json
import os
import sys

from essay_yml import convert

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_INPUT = os.path.join(SCRIPT_DIR, "essay", "essay.json")
DEFAULT_OUTPUT = os.path.join(SCRIPT_DIR, "source", "_data", "shuoshuo.yml")


def main():
    ap = argparse.ArgumentParser(description="把 JSON 说说数据转成 示范.txt 风格 YAML。")
    ap.add_argument("--input", default=DEFAULT_INPUT, help="输入 JSON 路径")
    ap.add_argument("--output", default=DEFAULT_OUTPUT, help="输出 YAML 路径")
    ap.add_argument("--reverse", action="store_true", help="倒序输出（新条目在前）")
    args = ap.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
        entries = json.load(f)
    if not isinstance(entries, list):
        print("输入 JSON 不是顶层数组。", file=sys.stderr)
        sys.exit(1)

    text = convert(entries, reverse=args.reverse)
    with open(args.output, "w", encoding="utf-8") as f:
        f.write(text)
    print("已写入 {} 条记录到 {}".format(len(entries), args.output))


if __name__ == "__main__":
    main()
