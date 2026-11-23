#!/usr/bin/env python3
"""Formación V3 · genera escena-v3.html (9:16) y escena-v3-45.html (4:5).
Toma los estilos del anuncio antiguo (2026-09-17-sistema/escena-formacion*.html) y cambia el recorrido y los tiempos.
?ap=b desplaza el cuerpo para montarlo detrás de la apertura original (5,68 s)."""
import os, re
A = os.path.dirname(os.path.abspath(__file__)); S = f'{A}/../2026-09-17-sistema'
EXTRA = '''
#hk{position:absolute;inset:0;z-index:15;opacity:0}
#hk h1{position:absolute;left:80px;right:80px;top:150px;font-family:Anton;font-size:124px;line-height:.95;text-transform:uppercase;color:#0A0A0B}
#hk h1 i{font-style:normal;color:#F4F1EB}
#hk .lst{position:absolute;left:100px;top:560px;width:880px;background:#F4F1EB;border-radius:36px;border:4px solid #0A0A0B;padding:40px 40px 30px}
#hk .lst .k{font-size:20px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:#0E7C74;margin-bottom:18px;display:flex;justify-content:space-between}
#hk .fl{display:flex;align-items:center;gap:22px;background:#fff;border-radius:20px;padding:22px 24px;margin-bottom:16px;font-size:30px;font-weight:700;border:3px solid transparent}
#hk .fl .av{flex:none;width:68px;height:68px;border-radius:50%;background:#D9D5CC}
#hk .fl small{display:block;font-size:22px;font-weight:600;color:#7A7C82;margin-top:4px}
#hk .fl.g{color:#9AA2AE}
#hk .fl.n{border-color:#0A0A0B;background:#F4CC38}#hk .fl.n .av{background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:34px;display:flex;align-items:center;justify-content:center}
#hk .fl.n em{margin-left:auto;font-style:normal;background:#0A0A0B;color:#F4F1EB;border-radius:999px;padding:8px 18px;font-size:22px;white-space:nowrap}
#hk .p{position:absolute;left:80px;right:80px;top:1290px;font-family:Anton;font-size:64px;line-height:1;text-transform:uppercase;text-align:center;color:#0A0A0B}
#hk .p i{font-style:normal;color:#F4F1EB}
.bub.r{left:auto;right:34px;width:520px;background:#D9FDD3;border-radius:26px;border-top-right-radius:8px}
#s6v .big{font-size:84px}
.atr{margin-top:30px;background:#0A0A0B;color:#F4F1EB;border-radius:22px;padding:24px 28px;font-size:28px;line-height:1.35;font-weight:600;opacity:0}
.atr b{color:#F4CC38;font-family:Anton;font-weight:400;font-size:34px;letter-spacing:.03em;text-transform:uppercase;display:block;margin-bottom:6px}
.lead.me{background:#F4CC38}
#fin{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:40px;padding:0 20px}
#fin img{width:560px}
#fin .t1{font-family:Anton;font-size:66px;line-height:1;text-transform:uppercase}
#fin .cta{font-family:Anton;font-size:58px;line-height:1;text-transform:uppercase;background:#0A0A0B;color:#F4CC38;padding:30px 40px;border-radius:22px}
#fin .t2{font-size:30px;font-weight:600;color:rgba(10,10,11,.8)}
#fin .web{font-family:Anton;font-size:44px;letter-spacing:.06em;color:#F4F1EB}
'''
EXTRA45 = '''
#hk h1{left:60px;right:60px;top:70px;font-size:96px}
#hk .lst{left:250px;top:330px;transform:scale(.66);transform-origin:0 0}
#hk .p{left:60px;right:60px;top:1060px;font-size:54px}
'''
CUERPO = '''
<div id="e">
  <div id="hk"><h1>¿Tienes una <i>escuela online?</i></h1>
    <div class="lst"><div class="k"><span>CRM · Solicitudes</span><span>hoy</span></div>
      <div class="fl n" id="fn"><div class="av">LV</div><div>Laura Vidal<small>Pide información · Marketing Digital</small></div><em>Nueva</em></div>
      <div class="fl g"><div class="av"></div><div>Solicitud anterior<small>En conversación</small></div></div>
      <div class="fl g"><div class="av"></div><div>Solicitud anterior<small>Reunión agendada</small></div></div>
      <div class="fl g"><div class="av"></div><div>Solicitud anterior<small>En seguimiento</small></div></div>
    </div>
    <div class="p" id="hp">Mira qué pasa cuando alguien <i>pide información.</i></div>
  </div>
  <div id="ej">Caso de ejemplo · Escuela Norte</div>
  <div id="reloj"><span>desde el anuncio</span><b>00:00</b></div>
  <div id="stage">
    <div class="sc" id="s2a"><div class="phone"><div class="screen"><div class="ig">
      <div class="igh"><div class="av"></div><div><b>Escuela Norte</b><span>Patrocinado</span></div></div>
      <div class="igi"><h4>Marketing Digital online. Por las tardes.</h4><p>Cuéntanos qué buscas y te decimos si encaja.</p></div>
      <div class="igb">Más información</div>
      <div class="igf" id="igf"><small>Cuéntanos qué buscas</small><span id="igt"></span></div>
    </div></div></div></div>
    <div class="sc" id="s3"><div class="card" style="top:90px"><div class="chip">CRM<small>solicitud creada</small></div>
      <div class="k"><span>Nueva solicitud</span><em>hace 4 s</em></div><h2>Laura Vidal</h2>
      <div class="dato"><b>Curso</b><span>Marketing Digital online</span></div>
      <div class="dato"><b>Horario</b><span>Tardes</span></div>
      <div class="dato"><b>Origen</b><span>Instagram</span></div>
      <div class="dato"><b>Campaña</b><span>Marketing Digital · tardes</span></div>
      <div class="dato"><b>Copiado a mano</b><span>Nada.</span></div>
    </div></div>
    <div class="sc" id="s4"><div class="phone"><div class="screen"><div class="wa">
      <div class="wah"><div class="av">E</div><div><b>Escuela Norte</b><span>en línea</span></div></div>
      <div class="bub" id="b1" style="top:190px">Hola Laura, he visto que te interesa Marketing Digital por las tardes. <b>¿Lo quieres para cambiar de trabajo o para tu puesto actual?</b><div class="t">+2 min ✓✓</div></div>
      <div class="bub r" id="b2" style="top:500px">Para cambiar de trabajo.</div>
      <div class="bub" id="b3" style="top:620px"><b>¿Cuándo te gustaría empezar?</b></div>
      <div class="bub r" id="b4" style="top:760px">Cuanto antes.</div>
    </div></div><div class="chip" style="top:-70px;left:60px">WhatsApp<small>2 min después</small></div></div></div>
    <div class="sc" id="s6v"><div class="card" style="top:90px"><div class="chip">Seguimiento<small>siguiente paso</small></div>
      <div class="k"><span>Laura Vidal</span><em>Nivel A</em></div><div class="big">Aviso al equipo</div>
      <div class="dato" style="margin-top:20px"><b>Tarea</b><span>Llamar hoy · admisiones</span></div>
      <div class="dato"><b>Si no responde</b><span>WhatsApp al día siguiente</span></div>
      <div class="dato"><b>Después</b><span>Otro a los 3 días</span></div>
      <div class="dato"><b></b><span style="font-weight:700">Siempre hay un siguiente paso.</span></div>
    </div></div>
    <div class="sc" id="s8v"><div class="board" style="height:auto;padding-bottom:44px"><div class="k">Pipeline · Escuela Norte</div>
      <div class="cols" style="height:640px">
        <div class="col"><h4>Nuevo lead</h4><div class="ghost"></div><div class="ghost"></div></div>
        <div class="col"><h4>Conversación abierta</h4><div class="ghost"></div></div>
        <div class="col"><h4>Reunión agendada</h4><div class="ghost"></div></div>
      </div>
      <div class="lead me" id="ld" style="left:50px;top:420px;width:232px">Laura Vidal<small>Nivel A</small></div>
      <div class="atr" id="atr"><b>De dónde viene</b>Anuncio «Marketing Digital · tardes» → Laura Vidal · Reunión agendada</div>
    </div></div>
    <div class="sc" id="fin"><img src="rec/logo-blanco.png"><div class="t1">Conectamos captación, seguimiento y ventas.</div><div class="cta">Solicita tu diagnóstico gratuito</div><div class="t2">Para escuelas de formación online</div><div class="web">QUALIVO.IO</div></div>
  </div>
  <div id="cap"></div>
  <div class="pie pieL">@maikel.echevarria</div><div class="pie pieR">QUALIVO.IO</div>
  <div id="tex"></div>
</div>
<script>
const $=id=>document.getElementById(id);
$('tex').style.backgroundImage="url(\\"data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')+"\\")";
const AP=new URLSearchParams(location.search).get('ap')||'a';
// inicios de escena (s). Con ?ap=b el cuerpo empieza en 5,68 s, detrás de la apertura original.
const E={s1:6.0,m1:8.7,s2:12.3,s3:19.8,s4:27.0,s5:34.8}; const DUR=45.0, OFF=AP==='b'?6.0-5.68:0; window.DUR=DUR-OFF;
const cl=(x,a,b)=>Math.max(a,Math.min(b,x)); const nm=(t,a,b)=>cl((t-a)/(b-a),0,1); const out=x=>1-Math.pow(1-x,3);
function win(t,a,b,fi=.35,fo=.3){ if(t<a||t>b) return 0; return Math.min(nm(t,a,a+fi), 1-nm(t,b-fo,b)); }
function show(el,op,dy=0){ el.style.opacity=op; el.style.transform=`translateY(${(1-out(op))*dy}px)`; }
const CAPS=[[E.s1,E.s2,'Laura llega desde un anuncio. <i>Sabemos de qué campaña.</i>'],[E.s2,E.s3,'Respuesta por WhatsApp. <i>En minutos.</i>'],[E.s3,E.s4,'El equipo sabe <i>cuándo intervenir.</i>'],[E.s4,E.s5,'Qué anuncios generan <i>oportunidades.</i>']];
const RELOJ=[[E.s1,E.m1,'desde el anuncio','00:00'],[E.m1,E.s2,'desde el formulario','00:04'],[E.s2,E.s3,'desde el formulario','02:00'],[E.s3,E.s4,'seguimiento','+1 día'],[E.s4,E.s5,'seguimiento','+3 días']];
const IGT='Quiero información del curso de Marketing Digital. Trabajo por las mañanas, ¿puedo hacerlo por las tardes?';
window.setT=function(t){ t+=OFF;
  // apertura: el CRM ya está en pantalla y la solicitud de Laura entra desde el primer fotograma
  const hk=$('hk'); hk.style.opacity=AP==='b'?0:(t<E.s1-.3?1:1-nm(t,E.s1-.3,E.s1+.1));
  const fn=$('fn'), v=nm(t,-.25,.45); fn.style.transform=`translateX(${(1-out(v))*-900}px) scale(${1+.04*Math.sin(nm(t,.45,1.3)*Math.PI)})`;
  show($('hp'),nm(t,2.0,2.5),24);
  $('ej').style.opacity=(t>E.s1&&t<E.s5)?1:0;
  const r=RELOJ.find(x=>t>=x[0]&&t<x[1]); const rl=$('reloj'); if(r){rl.style.opacity=win(t,r[0],r[1],.3,.3); rl.innerHTML='<span>'+r[2]+'</span><b>'+r[3]+'</b>';} else rl.style.opacity=0;
  const cap=$('cap'); const c=CAPS.find(x=>t>=x[0]&&t<x[1]); if(c){cap.innerHTML=c[2]; show(cap,win(t,c[0],c[1],.3,.25),18);} else cap.style.opacity=0;
  // 1 · anuncio → ficha
  const a2=E.s1, m2=E.m1; show($('s2a'),win(t,a2,m2,.3,.25),30); $('igt').textContent=IGT.slice(0,Math.floor(nm(t,a2+.3,a2+2.1)*IGT.length)); show($('igf'),nm(t,a2+.1,a2+.4),20);
  show($('s3'),win(t,m2,E.s2-.05,.3,.3),40); show($('s3').querySelector('.chip'),nm(t,m2+.2,m2+.5),-14); document.querySelectorAll('#s3 .dato').forEach((d,i)=>show(d,nm(t,m2+.4+i*.42,m2+.7+i*.42),14));
  // 2 · WhatsApp
  const a4=E.s2; show($('s4'),win(t,a4,E.s3-.05,.3,.3),30); show($('s4').querySelector('.chip'),nm(t,a4+.3,a4+.6),-14);
  [['b1',.7],['b2',3.1],['b3',4.5],['b4',5.9]].forEach(([id,d])=>show($(id),nm(t,a4+d,a4+d+.35),24));
  // 3 · seguimiento
  const a6=E.s3; show($('s6v'),win(t,a6,E.s4-.05,.3,.3),40); show($('s6v').querySelector('.chip'),nm(t,a6+.3,a6+.6),-14);
  [1.0,3.7,4.6,5.6].forEach((d,i)=>show(document.querySelectorAll('#s6v .dato')[i],nm(t,a6+d,a6+d+.3),14));
  // 4 · pipeline y atribución
  const a8=E.s4; show($('s8v'),win(t,a8,E.s5-.05,.3,.3),40);
  const p1=out(nm(t,a8+1.6,a8+2.2)), p2=out(nm(t,a8+3.4,a8+4.0)); $('ld').style.left=(50+p1*272+p2*272)+'px'; $('ld').style.top=(420-p1*96)+'px';
  show($('atr'),nm(t,a8+4.6,a8+5.0),20);
  // 5 · cierre
  show($('fin'),win(t,E.s5,DUR+1,.4,1),30);
};
window.setT(0);
</script>
'''
for src, dst, extra in (('escena-formacion.html', 'escena-v3.html', EXTRA), ('escena-formacion-45.html', 'escena-v3-45.html', EXTRA + EXTRA45)):
    h = open(f'{S}/{src}').read()
    cab = h[:h.index('</style>')]
    cab = cab.replace('<meta charset="utf-8">', '<meta charset="utf-8"><base href="../2026-09-17-sistema/">', 1)
    open(f'{A}/{dst}', 'w').write(cab + extra + '</style>' + CUERPO + '</html>'); print('ok', dst)
