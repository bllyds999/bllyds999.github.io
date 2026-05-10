file=source/_data/link.yml

[[ -f $file ]] && \
  grep -o 'https://[^/]*' $file | \
  sed 's|https://||' | \
  xargs -I {} sh -c 'ping $1 -c 4 > /dev/null && echo "$1 存活！" || echo "$1 死亡！"' _ {}
