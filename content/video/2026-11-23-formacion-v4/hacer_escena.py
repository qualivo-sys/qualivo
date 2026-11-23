#!/usr/bin/env python3
"""Formación V4 · «De un anuncio a una oportunidad real». Genera t.js (tiempos a partir de la locución) y escena-v4.html (9:16).
Toma los estilos de la V3 espectacular (../2026-11-23-formacion-v3/escena-v3x.html) y añade las escenas nuevas."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V3 = f'{A}/../2026-11-23-formacion-v3/escena-v3x.html'
TEMPO, HUECO, COLA = 1.08, 0.25, 1.4
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
G = json.load(open(f'{A}/guion.json')); T = {}; W = {}; t = 0.12
for k in G:
    d = dur(f'{A}/voz/{k}.mp3') / TEMPO; T[k] = [round(t, 3), round(d, 3)]
    W[k] = {w['w'].strip('¿?.,:').lower(): round(t + w['s'] / TEMPO, 3) for w in reversed(json.load(open(f'{A}/voz/{k}.json')))}
    t += d + HUECO
DUR = round(t - HUECO + COLA, 2)
open(f'{A}/t.js', 'w').write('window.T=' + json.dumps(T) + ';window.W=' + json.dumps(W, ensure_ascii=False) + ';window.DUR=' + str(DUR) + ';')
json.dump({'T': T, 'DUR': DUR, 'TEMPO': TEMPO}, open(f'{A}/tiempos.json', 'w'), indent=1)
h = open(V3).read(); cab = h[:h.index('</style>')]
EXTRA = '''
#h1{font-size:150px}
#mini{left:290px;top:880px;width:500px;transform-origin:50% 0}
#mini .ig{position:relative;inset:auto;border-radius:36px;overflow:hidden;border:6px solid #2A2D33;background:#fff;padding-bottom:26px}
#mini .igh{padding:22px 24px 14px}#mini .igi{height:300px;padding:28px}#mini .igi h4{font-size:46px}#mini .igi p{font-size:20px}#mini .igb{margin:16px 24px 0;font-size:24px;padding:16px}
#noti{top:1000px}
.tile{position:absolute;left:0;width:880px;height:270px;background:#F4F1EB;border:4px solid #0A0A0B;border-radius:32px;display:flex;align-items:center;gap:34px;padding:0 40px;opacity:0;transform-origin:50% 50%}
.tile u{flex:none;width:96px;height:96px;border-radius:50%;background:#0A0A0B;color:#F4CC38;text-decoration:none;font-family:Anton;font-size:56px;display:flex;align-items:center;justify-content:center}
.tile b{display:block;font-family:Anton;font-weight:400;font-size:74px;line-height:1;text-transform:uppercase}
.tile small{display:block;font-size:30px;font-weight:600;color:#3D4148;margin-top:10px}
.tile em{margin-left:auto;font-style:normal;font-family:Anton;font-size:30px;background:#F4CC38;border-radius:12px;padding:10px 16px;text-transform:uppercase;white-space:nowrap}
.fle{position:absolute;left:66px;width:10px;height:40px;background:#0A0A0B;border-radius:5px;opacity:0;transform-origin:50% 0}
.pillA{display:inline-block;background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:44px;padding:8px 26px;border-radius:14px;text-transform:uppercase;transform-origin:0 50%}
.tagnr{position:absolute;left:50%;top:880px;transform:translateX(-50%);background:#0A0A0B;color:#F4F1EB;font-family:Anton;font-size:44px;text-transform:uppercase;padding:16px 30px;border-radius:16px;opacity:0;white-space:nowrap}
.call{position:absolute;inset:0;background:#0A0A0B;color:#F4F1EB;display:flex;flex-direction:column;align-items:center;padding-top:110px}
.call .av{width:220px;height:220px;border-radius:50%;background:#F4CC38;color:#0A0A0B;font-family:Anton;font-size:120px;display:flex;align-items:center;justify-content:center;margin-bottom:34px}
.call h2{font-family:Anton;font-weight:400;font-size:60px;text-transform:uppercase}
.call p{font-size:28px;color:rgba(244,241,235,.6);margin-top:8px}
.wave{display:flex;gap:10px;align-items:center;height:120px;margin-top:50px}
.wave i{width:12px;border-radius:6px;background:#F4CC38;display:block;height:20px}
.cond{margin-top:30px;border:3px solid rgba(244,241,235,.3);border-radius:16px;padding:14px 24px;font-size:26px;font-weight:600;color:rgba(244,241,235,.8)}
.cita{background:#0A0A0B;color:#F4F1EB;border-radius:28px;padding:34px 40px;margin-bottom:24px;display:flex;align-items:center;gap:30px}
.cita .d{flex:none;width:150px;height:150px;background:#F4CC38;color:#0A0A0B;border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Anton;font-size:54px;line-height:1}
.cita .d small{font-family:SG;font-size:22px;font-weight:700;letter-spacing:.14em}
.cita b{display:block;font-family:Anton;font-weight:400;font-size:60px;line-height:1;text-transform:uppercase;color:#F4CC38}
.cita span{display:block;font-size:30px;font-weight:600;margin-top:8px}
.ok{color:#0E7C74;font-weight:800}
#lz{position:absolute;inset:0}
#lz .nodo{position:absolute;left:0;width:880px;background:#F4F1EB;border:4px solid #0A0A0B;border-radius:32px;padding:34px 40px;opacity:0;transform-origin:50% 50%}
#lz .nodo .k{font-size:22px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:#0E7C74;margin-bottom:8px}
#lz .nodo b{display:block;font-family:Anton;font-weight:400;font-size:66px;line-height:1;text-transform:uppercase}
#lz .nodo span{display:block;font-size:30px;font-weight:600;margin-top:10px}
#lz .sen{display:inline-block;margin-top:16px;background:#0E7C74;color:#F4F1EB;font-family:Anton;font-size:38px;text-transform:uppercase;padding:10px 22px;border-radius:14px;opacity:0;transform-origin:0 50%}
#lz .cua{display:inline-block;margin-top:16px;background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:38px;text-transform:uppercase;padding:10px 22px;border-radius:14px;opacity:0;transform-origin:0 50%}
#via{position:absolute;left:120px;top:300px;width:16px;height:300px;border-radius:8px;background:repeating-linear-gradient(#0A0A0B 0 22px,transparent 22px 40px);opacity:0}
#bola{position:absolute;left:92px;top:560px;width:72px;height:72px;border-radius:50%;background:#F4CC38;border:6px solid #0A0A0B;opacity:0}
#val h3{font-size:150px}
#fin .t1{font-size:96px}
'''
CUERPO = r'''
<div id="e">
  <div id="fondo"></div><div id="rej"></div>
  <div class="abs" id="h1"><span>Tu</span> <span>escuela</span> <span>invierte</span><br><i><span>en</span> <span>anuncios.</span></i></div>
  <div class="abs" id="h2"><span>Mira</span> <span>todo</span> <span>lo</span> <span>que</span> <span>pasa</span> <i><span>antes</span> <span>de</span> <span>la</span> <span>reunión.</span></i></div>
  <div class="abs" id="mini"><div class="ig"><div class="igh"><div class="av"></div><div><b>Escuela Norte</b><span>Patrocinado</span></div></div>
      <div class="igi"><h4>Marketing Digital online. Por las tardes.</h4><p>Cuéntanos qué buscas y te decimos si encaja.</p></div><div class="igb" id="btn0">Más información</div></div></div>
  <div class="abs" id="noti"><div class="av">LV</div><div><small>Nueva solicitud</small><b>Laura Vidal</b><span>Quiere información de un curso</span></div><em>ahora</em></div>
  <div class="abs" id="reloj"><span>desde el anuncio</span><b>00:00</b></div>
  <div class="abs" id="ej">Caso de ejemplo</div>
  <div class="abs" id="cap"></div>
  <div id="stage">
    <div class="sc" id="c1">
      <div class="tile" id="t0" style="top:0"><u>1</u><div><b>Campañas</b><small>Meta Ads</small></div><em>Qualivo</em></div><div class="fle" id="f0" style="top:278px"></div>
      <div class="tile" id="t1" style="top:326px"><u>2</u><div><b>Landing</b><small>Página de captación</small></div><em>Qualivo</em></div><div class="fle" id="f1" style="top:604px"></div>
      <div class="tile" id="t2" style="top:652px"><u>3</u><div><b>Formulario</b><small>Con preguntas que cualifican</small></div><em>Qualivo</em></div>
    </div>
    <div class="sc" id="c2"><div class="card">
      <div class="k"><span>CRM · Nueva solicitud</span><em>hace 4 s</em></div><h2>Laura Vidal</h2>
      <div class="dato hi"><b>Viene de</b><span>Anuncio «por las tardes»</span></div>
      <div class="dato"><b>Interés</b><span>Marketing Digital online</span></div>
      <div class="dato"><b>Quiere</b><span>Cambiar de trabajo · cuanto antes</span></div>
      <div class="dato"><b>Cualificación</b><span><span class="pillA" id="pa">Nivel A</span></span></div>
    </div></div>
    <div class="sc" id="c3"><div class="phone"><div class="screen"><div class="wa">
      <div class="wah"><div class="av">E</div><div><b>Escuela Norte</b><span>en línea</span></div></div>
      <div class="bub" id="b1" style="top:170px">Hola Laura, te interesa Marketing Digital por las tardes. <b>¿Te cuento cómo son las clases?</b><div class="t">+2 min ✓✓</div></div>
      <div class="bub r" id="b2" style="top:440px">Sí. ¿Son en directo?</div>
      <div class="bub" id="b3" style="top:556px">En directo, de 18 a 20 h, y quedan grabadas. <b>¿Reservamos una llamada?</b></div>
      <div class="tagnr" id="nr">Laura no responde</div>
    </div></div></div></div>
    <div class="sc" id="c4"><div class="card"><div class="k"><span>Seguimiento automático</span><em>sin respuesta</em></div><h2>El sistema insiste</h2>
      <div class="dato"><b>+1 día</b><span>Nuevo WhatsApp</span></div>
      <div class="dato"><b>+2 días</b><span>Correo</span></div>
      <div class="dato"><b>+3 días</b><span>Otro WhatsApp</span></div>
      <div class="dato"><b></b><span style="font-weight:700">Nadie tiene que acordarse.</span></div>
    </div></div>
    <div class="sc" id="c5"><div class="cita" id="ci"><div class="d"><small>JUE</small>17:00</div><div><b>Reunión agendada</b><span>Laura Vidal · admisiones</span></div></div>
      <div class="card" id="c5c" style="top:250px"><div class="k"><span>Automático</span><em>cita</em></div>
      <div class="dato"><b>Etapa</b><span>Reunión agendada <span class="ok">✓</span></span></div>
      <div class="dato"><b>Recordatorios</b><span>La víspera y el mismo día <span class="ok">✓</span></span></div>
      <div class="dato"><b>¿No puede?</b><span>Reprograma desde la cita</span></div>
    </div></div>
    <div class="sc" id="c6"><div class="card"><div class="k"><span>Antes de la llamada</span><em>para el equipo</em></div><h2>Laura Vidal</h2>
      <div class="dato"><b>Curso</b><span>Marketing Digital online</span></div>
      <div class="dato"><b>Objetivo</b><span>Cambiar de trabajo</span></div>
      <div class="dato"><b>Dudas</b><span>Clases en directo</span></div>
      <div class="dato hi"><b>Viene de</b><span>Anuncio «por las tardes»</span></div>
    </div></div>
    <div class="sc" id="c7"><div id="lz">
      <div class="nodo" id="n1" style="top:0"><div class="k">Meta Ads · campaña</div><b>Anuncio «por las tardes»</b><span>De aquí vino Laura</span><div class="sen" id="sen">Señal de calidad recibida</div></div>
      <div id="via"></div><div id="bola"></div>
      <div class="nodo" id="n2" style="top:590px"><div class="k">CRM · resultado comercial</div><b>Laura Vidal</b><span>Reunión celebrada</span><div class="cua" id="cua">Cualificada ✓</div></div>
    </div></div>
  </div>
  <div class="abs" id="val"><h3><span>Esto</span> <span>es</span> <i><span>Qualivo</span></i></h3>
    <div class="vr"><u>1</u><div><b>Captación</b><small>Campañas, landing y formulario</small></div></div>
    <div class="vr"><u>2</u><div><b>Seguimiento comercial</b><small>De la solicitud a la reunión</small></div></div>
    <div class="vr"><u>3</u><div><b>Optimización continua</b><small>Lo que pasa en ventas mejora la captación</small></div></div>
  </div>
  <div class="abs" id="fin"><img src="rec/logo-blanco.png"><div class="t1"><span>¿Quieres</span> <span>algo</span> <span>así</span> <i><span>para</span> <span>tu</span> <span>escuela?</span></i></div><div class="cta">Solicita tu diagnóstico gratuito</div><div class="t2">Para escuelas de formación online</div><div class="web">QUALIVO.IO</div></div>
  <div id="tex"></div>
</div>
<script src="../2026-11-23-formacion-v4/t.js"></script>
<script>
const $=id=>document.getElementById(id);
$('tex').style.backgroundImage="url(\"data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')+"\")";
const T=window.T, W=window.W, DUR=window.DUR;
// inicio de cada escena: una décima antes de su frase
const E={}; Object.keys(T).forEach((k,i)=>E['s'+i]=T[k][0]-.12); E.s0=0; E.fin=DUR+1;
const cl=(x,a,b)=>Math.max(a,Math.min(b,x)), nm=(t,a,b)=>cl((t-a)/(b-a),0,1), lerp=(a,b,v)=>a+(b-a)*v;
const expo=x=>x>=1?1:1-Math.pow(2,-10*x), p3in=x=>x*x*x, io=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2, back=x=>{const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const pico=x=>Math.sin(cl(x,0,1)*Math.PI);
function S(el,o){ el.style.opacity=o.o===undefined?1:o.o; el.style.transform=`translate(${o.x||0}px,${o.y||0}px) scale(${o.s===undefined?1:o.s}) rotate(${o.r||0}deg)`; el.style.filter=o.b>0.3?`blur(${o.b.toFixed(1)}px)`:'none'; }
function palabras(el,t,t0,paso=.067){ [...el.querySelectorAll('span')].forEach((s,i)=>{const v=nm(t,t0+i*paso,t0+i*paso+.14); s.style.opacity=v; s.style.filter=v<1?`blur(${(6*(1-v)).toFixed(1)}px)`:'none';}); }
function fila(el,t,t0){ const v=nm(t,t0,t0+.28); el.style.opacity=v; el.style.transform=`translateX(${(1-expo(v))*40}px)`; }
function pop(el,t,t0){ const v=nm(t,t0,t0+.32); el.style.opacity=Math.min(1,v*3); el.style.transform=`scale(${v<=0?0:back(v)})`; }
// transiciones entre escenas: entra 'zoom' | 'der' | 'izq' | 'foco'; sale barrida, por zoom o desenfocada
function escena(el,t,a,b,ent,sal){ const i=nm(t,a-.06,a+.4), o=nm(t,b-.3,b-.03); let x=0,s=1,bl=0;
  if(ent==='zoom'){s*=lerp(1.12,1,expo(i)); bl+=11*(1-nm(i,0,.7));} if(ent==='der'){x+=1500*(1-expo(i)); bl+=22*(1-nm(i,0,.75));} if(ent==='izq'){x-=1500*(1-expo(i)); bl+=22*(1-nm(i,0,.75));} if(ent==='foco'){bl+=12*(1-i);}
  let op=t<a-.06?0:1; if(sal==='izq'){x-=1500*p3in(o); bl+=22*pico(o); if(o>=1)op=0;} else if(sal==='der'){x+=1500*p3in(o); bl+=22*pico(o); if(o>=1)op=0;} else if(sal==='zoom'){s*=1+p3in(o)*5; bl+=16*pico(o); if(o>=1)op=0;} else {op*=1-o; bl+=10*o; s*=1-.05*o;}
  S(el,{o:ent==='foco'?op*i:op,x,s,b:bl}); }
const CAPS=[['s1','<span>Campañas,</span> <span>landing</span> <span>y</span> <i><span>formulario.</span></i>'],['s2','<span>Sabemos</span> <span>de</span> <span>qué</span> <i><span>anuncio</span> <span>viene.</span></i>'],['s3','<span>WhatsApp.</span> <i><span>En</span> <span>minutos.</span></i>'],['s4','<span>¿No</span> <span>responde?</span> <i><span>El</span> <span>sistema</span> <span>insiste.</span></i>'],['s5','<span>Reunión</span> <span>y</span> <i><span>recordatorios.</span></i>'],['s6','<span>El</span> <span>equipo</span> <span>llega</span> <i><span>con</span> <span>todo.</span></i>'],['s7','<span>El</span> <span>resultado</span> <span>vuelve</span> <i><span>a</span> <span>la</span> <span>campaña.</span></i>']];
const RELOJ={s1:['lo montamos nosotros','captación'],s2:['desde el formulario','00:04'],s3:['desde el formulario','02:00'],s4:['sin respuesta','+1 día'],s5:['seguimiento','reunión'],s6:['el día de la reunión','17:00'],s7:['después de la reunión','resultado']};
let capAct='';
window.setT=function(t){
  const z=nm(t,E.s1-.44,E.s1-.04), fl=io(nm(t,E.s1-.07,E.s1+.28)), fn=io(nm(t,E.s8-.25,E.s8+.2));
  $('e').style.background=t<E.s1-.07?'#0A0A0B':(t<E.s8-.25?'#F4CC38':'#0A0A0B'); $('fondo').style.opacity=t<E.s1-.07?0:(t<E.s8-.25?fl:1-fn);
  $('rej').style.opacity=(t<E.s1?0:.9)*(1-fn); $('rej').style.transform=`translate(${-(t*9)%120}px,${-(t*6)%120}px)`;
  // ── 0 · gancho: titular y anuncio en pantalla desde el fotograma 0; Laura pulsa, entra la solicitud y se convierte en el mundo
  const tL=W.v0.laura, tP=W.v0.pide, tY=W.v0.aquí;
  S($('h1'),{o:1-nm(t,tY-.3,tY-.1),b:8*nm(t,tY-.3,tY-.1)}); [...$('h1').querySelectorAll('span')].forEach(s=>s.style.opacity=1);
  S($('h2'),{o:(t>=tY-.1?1:0)*(1-nm(t,E.s1-.5,E.s1-.32)),b:10*nm(t,E.s1-.5,E.s1-.32)}); palabras($('h2'),t,tY-.05);
  { const pr=pico(nm(t,tL+.45,tL+.8)), sal=nm(t,tP+.1,tP+.5); S($('mini'),{o:1-nm(t,E.s1-.5,E.s1-.32),s:(1-.03*pr)*lerp(1,.86,io(sal)),y:lerp(0,-40,io(sal)),b:6*nm(sal,.2,1)}); $('btn0').style.transform=`scale(${1-.08*pr})`; $('btn0').style.background=pr>.2?'#0A0A0B':'#F4CC38'; $('btn0').style.color=pr>.2?'#F4CC38':'#0A0A0B'; }
  { const a=nm(t,tP,tP+.5), y=lerp(-1700,0,expo(a)), golpe=pico(nm(t,tP+.42,tP+.75)), zs=1+p3in(z)*26;
    S($('noti'),{o:t<tP?0:(z>=1?0:1),y:y,s:(1+.03*golpe)*zs,r:1.6*Math.sin(nm(t,tP+.5,tP+1.1)*Math.PI*6)*(1-nm(t,tP+.5,tP+1.1)),b:14*pico(nm(t,tP,tP+.4))+18*pico(z)});
    [...$('noti').children].forEach(c=>c.style.opacity=1-nm(z,.15,.5)); }
  // ── cabecera
  const k=['s1','s2','s3','s4','s5','s6','s7'].filter(x=>t>=E[x]).pop(), enC=t>=E.s1&&t<E.s8-.3;
  const rl=$('reloj'); if(k&&enC){ rl.innerHTML='<span>'+RELOJ[k][0]+'</span><b>'+RELOJ[k][1]+'</b>'; S(rl,{o:Math.min(nm(t,E.s1+.25,E.s1+.5),1-nm(t,E.s8-.5,E.s8-.3)),s:1+.08*pico(nm(t,E[k]+.25,E[k]+.5))}); } else rl.style.opacity=0;
  $('ej').style.opacity=enC?Math.min(nm(t,E.s1+.4,E.s1+.7),1-nm(t,E.s8-.5,E.s8-.3)):0;
  const cap=$('cap'); if(k&&enC){ if(k!==capAct){cap.innerHTML=CAPS.find(c=>c[0]===k)[1]; capAct=k;} const fin=E['s'+(+k[1]+1)]; palabras(cap,t,E[k]+.3); const sal=nm(t,fin-.22,fin-.04); cap.style.opacity=1-sal; cap.style.filter=sal>0?`blur(${(8*sal).toFixed(1)}px)`:'none'; } else { cap.style.opacity=0; capAct=''; }
  // ── 1 · lo que montamos: campañas, landing y formulario, encadenados
  escena($('c1'),t,E.s1,E.s2,'foco','izq');
  [[W.v1.campañas,'t0'],[W.v1.páginas,'t1'],[W.v1.formularios,'t2']].forEach(([a,id],i)=>{ const v=nm(t,a-.1,a+.3); S($(id),{o:Math.min(1,v*3),y:(1-expo(v))*120,s:lerp(1.08,1,expo(v)),b:10*(1-nm(v,0,.7))}); if(i<2){ const f=nm(t,a+.35,a+.6); $('f'+i).style.opacity=f; $('f'+i).style.transform=`scaleY(${f})`; } });
  // ── 2 · Intelligence: de qué anuncio viene, su interés y la cualificación
  escena($('c2'),t,E.s2,E.s3,'der','izq');
  { const d=document.querySelectorAll('#c2 .dato'); fila(d[0],t,W.v2.identifica); fila(d[1],t,W.v2.registra); fila(d[2],t,W.v2.registra+.5); fila(d[3],t,W.v2.cualifica-.2); pop($('pa'),t,W.v2.cualifica+.05); }
  // ── 3 · WhatsApp
  escena($('c3'),t,E.s3,E.s4+1.35,'der','zoom'); $('c3').style.transformOrigin='50% 72%';
  pop($('b1'),t,W.v3.recibe); pop($('b2'),t,W.v3.resuelve-.1); pop($('b3'),t,W.v3.resuelve+.9);
  { const v=nm(t,E.s4+.1,E.s4+.45); S($('nr'),{o:Math.min(1,v*3),x:-200,s:lerp(1.6,1,expo(v)),r:-3,b:10*(1-nm(v,0,.5))}); $('nr').style.left='50%'; $('nr').style.transform=`translateX(-50%) scale(${lerp(1.6,1,expo(v))}) rotate(-3deg)`; }
  // ── 4 · si no responde, el seguimiento sigue solo
  escena($('c4'),t,E.s4+1.35,E.s5,'zoom','izq');
  document.querySelectorAll('#c4 .dato').forEach((d,i)=>fila(d,t,W.v4.insiste-.1+i*.5));
  // ── 5 · reunión, recordatorios y reprogramación
  escena($('c5'),t,E.s5,E.s6,'der','');
  { const v=nm(t,W.v5.agenda,W.v5.agenda+.4); S($('ci'),{o:Math.min(1,v*3),s:lerp(1.5,1,expo(v)),r:lerp(-4,0,expo(v)),b:12*(1-nm(v,0,.5))}); const c=nm(t,W.v5.sistema-.2,W.v5.sistema+.2); S($('c5c'),{o:c,y:(1-expo(c))*70});
    const d=document.querySelectorAll('#c5c .dato'); fila(d[0],t,W.v5.actualiza); fila(d[1],t,W.v5.recordatorios-.2); fila(d[2],t,W.v5.reprogramación-.2); }
  // ── 6 · el equipo llega con todo
  escena($('c6'),t,E.s6,E.s7,'zoom','');
  document.querySelectorAll('#c6 .dato').forEach((d,i)=>fila(d,t,E.s6+.45+i*.28));
  // ── 7 · el resultado vuelve a la campaña que la trajo
  escena($('c7'),t,E.s7,E.s8,'foco','');
  { const a=nm(t,E.s7+.1,E.s7+.5); S($('n2'),{o:Math.min(1,a*3),s:lerp(1.1,1,expo(a)),b:10*(1-nm(a,0,.7))}); pop($('cua'),t,W.v7.cualificada);
    const b=nm(t,W.v7.sistema-.2,W.v7.sistema+.2); S($('n1'),{o:b,y:(1-expo(b))*-60}); $('via').style.opacity=nm(t,W.v7.envía,W.v7.envía+.3);
    const tb=W.v7.señal-.25, v=nm(t,tb,tb+1.0); S($('bola'),{o:t<tb?0:(v>=1?0:1),y:-330*io(v),s:1+.35*pico(v),b:7*pico(v)});
    const r=nm(t,tb+.95,tb+1.3); $('n1').style.transform+=` scale(${1+.04*pico(r)})`; pop($('sen'),t,tb+1.0); $('n1').style.background=r>0?'#F4CC38':'#F4F1EB'; }
  // ── 8 · esto es Qualivo
  { const v=$('val'), sal=nm(t,E.s9-.25,E.s9-.05); v.style.opacity=t<E.s8-.05?0:1-sal; v.style.filter=sal>0?`blur(${(10*sal).toFixed(1)}px)`:'none'; palabras(v.querySelector('h3'),t,E.s8+.2,.1);
    [W.v8.captación,W.v8.seguimiento,W.v8.optimización].forEach((d,i)=>{const el=v.querySelectorAll('.vr')[i], q=nm(t,d-.1,d+.2); el.style.opacity=Math.min(1,q*3); el.style.transform=`translateX(${(1-expo(q))*-120}px) scale(${1+.03*pico(nm(t,d+.2,d+.5))})`; el.style.filter=q<1&&q>0?`blur(${(8*(1-q)).toFixed(1)}px)`:'none';}); }
  // ── 9 · cierre
  { const f=$('fin'); f.style.opacity=t<E.s9-.05?0:1; const lg=nm(t,E.s9+.05,E.s9+.35), im=f.querySelector('img'); im.style.opacity=lg; im.style.filter=lg<1?`blur(${(8*(1-lg)).toFixed(1)}px)`:'none';
    palabras(f.querySelector('.t1'),t,E.s9+.25,.07); pop(f.querySelector('.cta'),t,W.v9.solicita-.1);
    f.querySelector('.t2').style.opacity=nm(t,W.v9.solicita+.6,W.v9.solicita+.9); f.querySelector('.web').style.opacity=nm(t,W.v9.solicita+.9,W.v9.solicita+1.2); }
};
window.setT(0);
</script>
</html>
'''
open(f'{A}/escena-v4.html', 'w').write(cab + EXTRA + '</style>' + CUERPO); print('ok escena-v4.html', DUR, T)
