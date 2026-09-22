#!/usr/bin/env python3
"""Genera public/index.html (portada del blog) a partir de public/blog.html.
blog.html sigue siendo el archivo fuente que actualizan los generadores; /blog redirige a / (vercel.json)."""
import os, re
PUB = os.path.join(os.path.dirname(__file__), "..", "public")
html = open(os.path.join(PUB, "blog.html"), encoding="utf-8").read()
html = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="https://blog.elevanails.es/">', html)
if '<link rel="canonical"' not in html:
    html = html.replace('<meta name="robots" content="index,follow">', '<meta name="robots" content="index,follow">\n<link rel="canonical" href="https://blog.elevanails.es/">', 1)
html = re.sub(r'<meta property="og:url" content="[^"]*">', '<meta property="og:url" content="https://blog.elevanails.es/">', html)
open(os.path.join(PUB, "index.html"), "w", encoding="utf-8").write(html)
print("index.html generado desde blog.html")
