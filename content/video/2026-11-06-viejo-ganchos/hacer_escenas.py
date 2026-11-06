#!/usr/bin/env python3
"""Genera escena-gancho.html (9:16) y escena-gancho-45.html (4:5) a partir de las escenas del anuncio viejo
(2026-09-17-sistema): mismo vídeo, solo cambia la tarjeta del gancho (0-5,65 s). El gancho se elige con #g1, #g2…"""
import json, os, re
A = os.path.dirname(os.path.abspath(__file__)); S = os.path.join(A, '../2026-09-17-sistema')
G = json.load(open(f'{A}/ganchos.json'))
for src, dst in (('escena-formacion.html', 'escena-gancho.html'), ('escena-formacion-45.html', 'escena-gancho-45.html')):
    h = open(f'{S}/{src}').read()
    h = h.replace('<meta charset="utf-8">', '<meta charset="utf-8"><base href="../2026-09-17-sistema/">', 1)
    h = re.sub(r'<div id="hook">.*?</div>', '<div id="hook"><h1 id="hk1"></h1><p id="hkp"></p></div>', h, count=1, flags=re.S)
    # la tarjeta se ve desde el primer fotograma (el original entraba en 0,3 s)
    h = h.replace("win(t,0,S.hook[1],.3,.5)", "win(t,-1,S.hook[1],.01,.5)")
    h = h.replace("show(hk.querySelector('h1'),nm(t,.2,.8),40); show(hk.querySelector('p'),nm(t,1.6,2.2),24);",
                  "show(hk.querySelector('h1'),1,0); show(hk.querySelector('p'),nm(t,1.0,1.5),24);")
    js = ('<script>const GANCHOS=' + json.dumps(G, ensure_ascii=False) + ';(function(){const g=GANCHOS[(location.hash||"#g1").slice(1)];'
          'document.getElementById("hk1").innerHTML=g.h1;document.getElementById("hkp").innerHTML=g.p;window.setT&&window.setT(0);})();</script>')
    h = h.replace('</html>', js + '</html>') if '</html>' in h else h + js
    h = h.replace('#hook h1{font-family:Anton;font-size:128px', '#hook h1{font-family:Anton;font-size:150px').replace('#hook h1{font-family:Anton;font-size:112px', '#hook h1{font-family:Anton;font-size:122px')
    open(f'{A}/{dst}', 'w').write(h); print('ok', dst)
