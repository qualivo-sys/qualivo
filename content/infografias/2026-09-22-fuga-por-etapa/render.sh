#!/bin/sh
cd "$(dirname "$0")"
CH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
for f in [0-9]*.html; do n="${f%.html}"
  sed 's|</head>|<style>body{padding:0!important;background:#000}</style></head>|' "$f" > "_r-$n.html"
  "$CH" --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=1080,1350 --screenshot="$PWD/$n.png" "file://$PWD/_r-$n.html" >/dev/null 2>&1
  rm -f "_r-$n.html"; echo "$n.png"; done
