#!/bin/sh
cd "$(dirname "$0")"
CH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
for f in lamina-*.html; do n="${f%.html}"
  "$CH" --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=1080,1350 --screenshot="$PWD/$n.png" "file://$PWD/$f" >/dev/null 2>&1; echo "$n.png"; done
