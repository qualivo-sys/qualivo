#!/bin/sh
# Renderiza cada .html de esta carpeta a PNG 1080x1350 con el Chromium del entorno
# (sin Playwright). Se hace una copia temporal sin el margen gris del molde y se
# captura la ventana justa.
cd "$(dirname "$0")"
CH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
for f in *.html; do
  case "$f" in _render-*) continue;; esac
  n="${f%.html}"
  sed 's|</head>|<style>body{padding:0!important;background:#000}</style></head>|' "$f" > "_render-$n.html"
  "$CH" --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=1080,1350 \
    --screenshot="$PWD/$n.png" "file://$PWD/_render-$n.html" >/dev/null 2>&1
  rm -f "_render-$n.html"
  echo "$n.png"
done
