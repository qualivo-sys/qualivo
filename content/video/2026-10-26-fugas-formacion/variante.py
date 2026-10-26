#!/usr/bin/env python3
"""Genera escena_nolose.html a partir de escena.html: solo cambia el gancho (0-6 s).
   «¿Dónde se te pierden los alumnos? La respuesta que más nos dan es: no lo sé.» + tarjeta del formulario con la respuesta escrita,
   y «Vamos a averiguarlo» antes de entrar en el cuerpo, que es el mismo del anuncio 11.
   VARIANTE=nolose python3 voz.py voz|tiempos   ·   python3 variante.py   ·   ESCENA=escena_nolose.html node graba.js video ..."""
import os
AQUI = os.path.dirname(os.path.abspath(__file__))
s = open(f'{AQUI}/escena.html').read()

def r(a, b):
    global s
    assert s.count(a) == 1, a
    s = s.replace(a, b)

r('<script src="tiempos.js"></script>', '<script src="tiempos_nolose.js"></script>')
r('<div class="tit" id="g1">Inviertes en anuncios para <i>vender formación</i></div>', '<div class="tit" id="g1">¿Dónde se te pierden <i>los alumnos?</i></div>')
r('</style>', '''#fo{position:absolute;left:110px;right:110px;top:820px;background:#FAF7F0;border:5px solid #0A0A0B;border-radius:36px;padding:44px 46px;color:#0A0A0B;opacity:0;z-index:6}
#fo small{display:block;font-size:24px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;color:#6B6E74;margin-bottom:18px}
#fo b{display:block;font-size:40px;font-weight:800;line-height:1.25;margin-bottom:24px}
#fo div{border:4px solid #0E7C74;border-radius:18px;padding:26px 28px;font-size:44px;font-weight:700;min-height:150px;background:#fff}
#fo div::after{content:'|';color:#0E7C74;margin-left:2px}
#fo em{display:block;font-style:normal;font-size:22px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#0E7C74;margin-top:20px}
#aver{top:860px;text-align:center;font-size:150px}
#g1{top:330px}.v45 #g1{top:120px}
.v45 #fo{top:420px}.v45 #aver{top:520px}
</style>''')
r('<div id="cont">', '''<div id="fo"><small>Formulario · pregunta 3 de 4</small><b>¿Dónde crees que se te pierden hoy las oportunidades?</b><div id="resp"></div><em>Respuesta de ejemplo</em></div>
  <div class="tit" id="aver">Vamos a <i>averiguarlo</i></div>
  <div id="cont">''')
r('window.setT(0);', '''{ const base=window.setT; const R='No lo sé, eso es lo que quiero averiguar.';
  window.setT=function(t){ const p=base(t);
    $('cont').style.opacity=0; $('g2').style.opacity=0;
    show($('g1'),win(t,.05,T.aver-.05,.25,.2),40);
    show($('fo'),win(t,T.g2-.6,T.aver-.05,.25,.2),40);
    $('resp').textContent=R.slice(0,Math.round(R.length*nm(t,T.g2+.6,T.aver-.6)));
    show($('aver'),win(t,T.aver-.05,T.antes-.05,.2,.15),30);
    return p; }; }
window.setT(0);''')
open(f'{AQUI}/escena_nolose.html', 'w').write(s)
print('ok escena_nolose.html')
