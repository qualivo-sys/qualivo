#!/bin/sh
# Separa laminas.html en una página por lámina (cabecera común en _head.html)
# y renderiza cada una a PNG 1080x1350 con el headless shell del entorno.
cd "$(dirname "$0")"
CH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
awk -v head="$(cat _head.html)" '
  /<!-- [0-9]+ / { if (n) { print "</body></html>" > f; close(f) } n++; f = "_lamina-" n ".html"; print head > f; next }
  n { print >> f }
  END { if (n) { print "</body></html>" >> f } }
' laminas.html
for f in _lamina-*.html; do
  n="${f#_}"; n="${n%.html}"
  "$CH" --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=1080,1350 --screenshot="$PWD/$n.png" "file://$PWD/$f" >/dev/null 2>&1
  rm -f "$f"
  echo "$n.png"
done
