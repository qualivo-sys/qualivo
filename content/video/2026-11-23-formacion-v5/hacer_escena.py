#!/usr/bin/env python3
"""Formación V5 · vídeo completo, 9:16. Estilos de la V4; tiempos sacados de la locución. La frase de Raquel (r) va a su velocidad real."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V4 = f'{A}/../2026-11-23-formacion-v4/escena-v4.html'
TEMPO, HUECO, COLA = 1.08, 0.25, 1.5
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
G = json.load(open(f'{A}/guion.json')); T = {}; W = {}; t = 0.1
for k in G:
    tp = 1.0 if k == 'r' else TEMPO; d = dur(f'{A}/voz/{k}.mp3') / tp; d = max(d, 7.0) if k == 'r' else d;   # la llamada tiene reservados 7 s
    T[k] = [round(t, 3), round(d, 3)]
    W[k] = {w['w'].strip('¿?.,:').lower(): round(t + w['s'] / tp, 3) for w in reversed(json.load(open(f'{A}/voz/{k}.json')))}
    t += d + HUECO
DUR = round(t - HUECO + COLA, 2)
open(f'{A}/t.js', 'w').write('window.T=' + json.dumps(T) + ';window.W=' + json.dumps(W, ensure_ascii=False) + ';window.DUR=' + str(DUR) + ';')
json.dump({'T': T, 'DUR': DUR, 'TEMPO': TEMPO}, open(f'{A}/tiempos.json', 'w'), indent=1)
h = open(V4).read(); cab = h[:h.index('</style>')]
EXTRA = '''
#h1{font-size:128px;top:292px}#h2{font-size:118px;top:292px}
#crm{left:70px;top:860px;width:940px;background:#16181C;border:3px solid rgba(244,241,235,.16);border-radius:40px;padding:34px 34px 30px;opacity:1}
#crm .k{font-size:22px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:rgba(244,241,235,.6);margin-bottom:20px;display:flex;justify-content:space-between}
#crm .k b{color:#F4CC38}
#fil{background:#F4CC38;border-radius:28px;padding:28px 30px;display:flex;align-items:center;gap:26px;transform-origin:50% 50%;opacity:0}
#fil .av{flex:none;width:104px;height:104px;border-radius:50%;background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:52px;display:flex;align-items:center;justify-content:center}
#fil small{display:block;font-size:22px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:rgba(10,10,11,.6)}
#fil b{display:block;font-family:Anton;font-weight:400;font-size:64px;line-height:1;text-transform:uppercase}
#fil span{display:block;font-size:28px;font-weight:600;margin-top:6px}
.act{display:flex;align-items:center;gap:20px;background:rgba(244,241,235,.07);border-radius:20px;padding:20px 24px;margin-top:14px;font-size:32px;font-weight:600;color:#F4F1EB;opacity:0;transform-origin:0 50%}
.act u{flex:none;width:50px;height:50px;border-radius:50%;background:#1FA396;color:#0A0A0B;text-decoration:none;font-weight:800;font-size:30px;display:flex;align-items:center;justify-content:center}
.act em{margin-left:auto;font-style:normal;font-size:22px;color:rgba(244,241,235,.5);font-weight:700}
#val h3{font-size:150px}#fin{top:300px}#fin .t1{font-size:96px}
.cond{font-size:28px}
#prov{position:absolute;left:50%;top:900px;transform:translateX(-50%) rotate(-3deg);border:4px dashed #F4CC38;color:#F4CC38;font-family:Anton;font-size:34px;text-transform:uppercase;padding:12px 22px;border-radius:12px;white-space:nowrap;text-align:center;line-height:1.15}
#rsub{position:absolute;left:44px;right:44px;top:690px;font-size:40px;line-height:1.3;text-align:center;color:#F4F1EB;font-weight:600}#rsub i{font-style:normal;color:#F4CC38}
#bar{height:14px;border-radius:7px;background:rgba(244,241,235,.12);margin-top:22px;overflow:hidden}#bar i{display:block;height:100%;width:0;background:#F4CC38}
'''
CUERPO = r'''
<div id="e">
  <div id="fondo"></div><div id="rej"></div>
  <div class="abs" id="h1"><span>¿Tu</span> <span>escuela</span> <span>online</span><br><i><span>ya</span> <span>invierte</span><br><span>en</span> <span>anuncios?</span></i></div>
  <div class="abs" id="h2"><span>Mira</span> <span>todo</span> <span>lo</span> <span>que</span> <span>pasa</span> <i><span>cuando</span> <span>alguien</span> <span>pide</span> <span>información.</span></i></div>
  <div class="abs" id="crm"><div class="k"><span>CRM · Solicitudes</span><b>en directo</b></div>
    <div id="fil"><div class="av">LV</div><div><small>Nueva solicitud · ahora</small><b>Laura Vidal</b><span>Pide información de un curso</span></div></div>
    <div class="act" id="a0"><u>✓</u>Origen: anuncio de Meta<em>0 s</em></div>
    <div class="act" id="a1"><u>✓</u>Cualificada: Nivel A<em>4 s</em></div>
    <div class="act" id="a2"><u>✓</u>WhatsApp enviado<em>2 min</em></div>
    <div id="bar"><i id="bi"></i></div>
  </div>
  <div class="abs" id="reloj"><span>desde el anuncio</span><b>00:00</b></div>
  <div class="abs" id="ej">Caso de ejemplo</div>
  <div class="abs" id="cap"></div>
  <div id="stage">
    <div class="sc" id="c1">
      <div class="tile" id="t0" style="top:0"><u>1</u><div><b>Campaña</b><small>Meta Ads · «por las tardes»</small></div><em>Qualivo</em></div><div class="fle" id="f0" style="top:278px"></div>
      <div class="tile" id="t1" style="top:326px"><u>2</u><div><b>Landing</b><small>Página de captación</small></div><em>Qualivo</em></div><div class="fle" id="f1" style="top:604px"></div>
      <div class="tile" id="t2" style="top:652px"><u>3</u><div><b>Formulario</b><small>Con preguntas que cualifican</small></div><em>Qualivo</em></div>
    </div>
    <div class="sc" id="c2"><div class="card">
      <div class="k"><span>CRM · Nueva solicitud</span><em>hace 4 s</em></div><h2>Laura Vidal</h2>
      <div class="dato hi"><b>Viene de</b><span>Anuncio «por las tardes»</span></div>
      <div class="dato"><b>Curso</b><span>Marketing Digital online</span></div>
      <div class="dato"><b>Quiere</b><span>Cambiar de trabajo · cuanto antes</span></div>
      <div class="dato"><b>Cualificación</b><span><span class="pillA" id="pa">Nivel A</span></span></div>
    </div></div>
    <div class="sc" id="c3"><div class="phone"><div class="screen"><div class="wa">
      <div class="wah"><div class="av">E</div><div><b>Escuela Norte</b><span>en línea</span></div></div>
      <div class="bub" id="b1" style="top:170px">Hola Laura, te interesa Marketing Digital por las tardes. <b>¿Te cuento cómo son las clases?</b><div class="t">al momento ✓✓</div></div>
      <div class="bub r" id="b2" style="top:440px">Sí. ¿Son en directo?</div>
      <div class="bub" id="b3" style="top:556px">En directo, de 18 a 20 h, y quedan grabadas. <b>¿Reservamos una llamada?</b></div>
      <div class="tagnr" id="nr">Laura no responde</div>
    </div></div></div><div class="pillA" id="et" style="position:absolute;left:300px;top:1010px;opacity:0;font-size:40px;white-space:nowrap">Etapa: conversación abierta</div></div>
    <div class="sc" id="c4"><div class="phone"><div class="screen"><div class="call">
      <div class="av">R</div><h2>Raquel · agente de voz</h2><p id="cst">Llamando a Laura…</p>
      <div class="wave" id="wave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div id="rsub"></div><div id="prov">Audio provisional<br>pendiente de la llamada real</div>
    </div></div></div></div>
    <div class="sc" id="c5"><div class="cita" id="ci"><div class="d"><small>JUE</small>17:00</div><div><b>Reunión agendada</b><span>Laura Vidal · admisiones</span></div></div>
      <div class="card" id="c5c" style="top:250px"><div class="k"><span>Automático</span><em>cita</em></div>
      <div class="dato"><b>Cita</b><span>Confirmada por WhatsApp <span class="ok">✓</span></span></div>
      <div class="dato"><b>Recordatorios</b><span>La víspera y el mismo día <span class="ok">✓</span></span></div>
      <div class="dato"><b>Pipeline</b><span>Reunión agendada <span class="ok">✓</span></span></div>
      <div class="dato"><b>¿No puede?</b><span>La cambia desde la cita</span></div>
    </div></div>
    <div class="sc" id="c7"><div id="lz">
      <div class="nodo" id="n1" style="top:0"><div class="k">Meta Ads · campaña</div><b>Anuncio «por las tardes»</b><span>De aquí vino Laura</span><div class="sen" id="sen">Señal de calidad recibida</div></div>
      <div id="via"></div><div id="bola"></div>
      <div class="nodo" id="n2" style="top:590px"><div class="k">CRM · resultado comercial</div><b>Laura Vidal</b><span>Reunión celebrada</span><div class="cua" id="cua">Cualificada ✓</div></div>
    </div></div>
  </div>
  <div class="abs" id="val"><h3><span>Esto</span> <span>es</span> <i><span>Qualivo</span></i></h3>
    <div class="vr"><u>1</u><div><b>Captación</b><small>Campañas, landing y formulario</small></div></div>
    <div class="vr"><u>2</u><div><b>Seguimiento</b><small>De la solicitud a la reunión</small></div></div>
    <div class="vr"><u>3</u><div><b>Datos</b><small>Lo que pasa en ventas mejora las campañas</small></div></div>
  </div>
  <div class="abs" id="fin"><img src="rec/logo-blanco.png"><div class="t1"><span>Más</span> <span>matrículas,</span> <i><span>con</span> <span>todo</span> <span>conectado.</span></i></div><div class="cta">Solicita tu diagnóstico gratuito</div><div class="t2">Para escuelas de formación online</div><div class="web">QUALIVO.IO</div></div>
  <div id="tex"></div>
</div>
<script src="../2026-11-23-formacion-v5/t.js"></script>
<script>
const $=id=>document.getElementById(id);
$('tex').style.backgroundImage="url(\"data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')+"\")";
const T=window.T, W=window.W, DUR=window.DUR; const E={s1:T.v1[0]-.12, s2:W.v1.ya-.25, s3:T.v2[0]-.12, s4:T.v3[0]-.12, s5:T.v4[0]-.12, s6:T.v5[0]-.12, s7:T.v6[0]-.12}; const RAQ=Object.entries(W.r).sort((a,b)=>a[1]-b[1]); const RTX='Hola Laura, soy Raquel, de Escuela Norte. ¿Te viene bien el jueves a las cinco para una llamada de diez minutos?'.split(' '); const RT=RAQ.map(x=>x[1]);
const cl=(x,a,b)=>Math.max(a,Math.min(b,x)), nm=(t,a,b)=>cl((t-a)/(b-a),0,1), lerp=(a,b,v)=>a+(b-a)*v;
const expo=x=>x>=1?1:1-Math.pow(2,-10*x), p3in=x=>x*x*x, io=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2, back=x=>{const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const pico=x=>Math.sin(cl(x,0,1)*Math.PI);
function S(el,o){ el.style.opacity=o.o===undefined?1:o.o; el.style.transform=`translate(${o.x||0}px,${o.y||0}px) scale(${o.s===undefined?1:o.s}) rotate(${o.r||0}deg)`; el.style.filter=o.b>0.3?`blur(${o.b.toFixed(1)}px)`:'none'; }
function palabras(el,t,t0,paso=.067){ [...el.querySelectorAll('span')].forEach((s,i)=>{const v=nm(t,t0+i*paso,t0+i*paso+.14); s.style.opacity=v; s.style.filter=v<1?`blur(${(6*(1-v)).toFixed(1)}px)`:'none';}); }
function fila(el,t,t0){ const v=nm(t,t0,t0+.28); el.style.opacity=v; el.style.transform=`translateX(${(1-expo(v))*40}px)`; }
function pop(el,t,t0){ const v=nm(t,t0,t0+.32); el.style.opacity=Math.min(1,v*3); el.style.transform=`scale(${v<=0?0:back(v)})`; }
let capAct='';
window.setT=function(t){
  const z=nm(t,E.s1-.4,E.s1), fl=io(nm(t,E.s1-.03,E.s1+.3)), fn=io(nm(t,E.s7-.25,E.s7+.2));
  $('e').style.background=t<E.s1-.03?'#0A0A0B':(t<E.s7-.25?'#F4CC38':'#0A0A0B'); $('fondo').style.opacity=t<E.s1-.03?0:(t<E.s7-.25?fl:1-fn); $('rej').style.opacity=(t<E.s1?0:.9)*(1-fn); $('rej').style.transform=`translate(${-(t*9)%120}px,${-(t*6)%120}px)`;
  // ── gancho: la pregunta y el CRM están en pantalla desde el fotograma 0; la solicitud cae y el sistema reacciona solo
  const tm=W.v0.mira;
  S($('h1'),{o:1-nm(t,tm-.25,tm-.08),b:8*nm(t,tm-.25,tm-.08)}); [...$('h1').querySelectorAll('span')].forEach(s=>s.style.opacity=1);
  S($('h2'),{o:(t>=tm-.08?1:0)*(1-nm(t,E.s1-.45,E.s1-.3)),b:10*nm(t,E.s1-.45,E.s1-.3)}); palabras($('h2'),t,tm-.03);
  { const a=nm(t,.12,.6), golpe=pico(nm(t,.52,.85)), zs=1+p3in(z)*30;
    S($('crm'),{o:z>=1?0:1,y:6*golpe,b:0}); $('crm').style.background=z>.3?'transparent':'#16181C'; $('crm').style.borderColor=z>.3?'transparent':'rgba(244,241,235,.16)';
    S($('fil'),{o:t<.12?0:1,y:lerp(-1300,0,expo(a)),s:(1+.03*golpe)*zs,b:14*pico(nm(t,.12,.5))+18*pico(z)}); [...$('fil').children].forEach(c=>c.style.opacity=1-nm(z,.1,.45));
    [1.0,1.55,2.1].forEach((d,i)=>{ const el=$('a'+i), v=nm(t,d,d+.3); el.style.opacity=Math.min(1,v*3)*(1-nm(z,0,.3)); el.style.transform=`translateX(${(1-expo(v))*-70}px) scale(${1+.04*pico(nm(t,d+.3,d+.6))})`; el.style.filter=v<1&&v>0?`blur(${(8*(1-v)).toFixed(1)}px)`:'none'; });
    $('bi').style.width=(100*nm(t,.7,E.s1-.5))+'%'; $('bar').style.opacity=1-nm(z,0,.3); $('crm').querySelector('.k').style.opacity=1-nm(z,0,.3); }
  // ── cabecera
  const enC=t>=E.s1&&t<E.s7-.3, k=['s1','s2','s3','s4','s5','s6'].filter(x=>t>=E[x]).pop()||'s1', sig={s1:E.s2,s2:E.s3,s3:E.s4,s4:E.s5,s5:E.s6,s6:E.s7}[k];
  const RJ={s1:['desde el anuncio','00:00'],s2:['desde el formulario','00:04'],s3:['desde el formulario','al momento'],s4:['sin respuesta','+2 h'],s5:['seguimiento','reunión'],s6:['después de la reunión','resultado']}, CP={s1:'<span>Del</span> <span>anuncio</span> <i><span>al</span> <span>formulario.</span></i>',s2:'<span>Sabemos</span> <span>de</span> <span>qué</span> <i><span>anuncio</span> <span>viene.</span></i>',s3:'<span>WhatsApp</span> <i><span>al</span> <span>momento.</span></i>',s4:'<span>¿No</span> <span>responde?</span> <i><span>La</span> <span>llamamos.</span></i>',s5:'<span>Reunión</span> <span>y</span> <i><span>recordatorios.</span></i>',s6:'<span>El</span> <span>resultado</span> <span>vuelve</span> <i><span>a</span> <span>la</span> <span>campaña.</span></i>'};
  const rl=$('reloj'); if(enC){ rl.innerHTML='<span>'+RJ[k][0]+'</span><b>'+RJ[k][1]+'</b>'; S(rl,{o:Math.min(nm(t,E.s1+.25,E.s1+.5),1-nm(t,E.s7-.5,E.s7-.3)),s:1+.08*pico(nm(t,E[k]+.25,E[k]+.5))}); } else rl.style.opacity=0;
  $('ej').style.opacity=enC?Math.min(nm(t,E.s1+.4,E.s1+.7),1-nm(t,E.s7-.5,E.s7-.3)):0;
  const cap=$('cap'); if(enC){ if(k!==capAct){cap.innerHTML=CP[k]; capAct=k;} palabras(cap,t,E[k]+.3); const sal=nm(t,sig-.22,sig-.04); cap.style.opacity=1-sal; cap.style.filter=sal>0?`blur(${(8*sal).toFixed(1)}px)`:'none'; } else { cap.style.opacity=0; capAct=''; }
  // ── 1 · campaña → landing → formulario
  { const o=nm(t,E.s2-.3,E.s2-.03); S($('c1'),{o:t<E.s1?0:(o>=1?0:1),x:-1500*p3in(o),b:22*pico(o)});
    [[W.v1.campaña,'t0'],[W.v1.landing,'t1'],[W.v1.formulario,'t2']].forEach(([a,id],i)=>{ const v=nm(t,a-.15,a+.25); S($(id),{o:Math.min(1,v*3),y:(1-expo(v))*120,s:lerp(1.08,1,expo(v)),b:10*(1-nm(v,0,.7))}); if(i<2){ const f=nm(t,a+.3,a+.55); $('f'+i).style.opacity=f; $('f'+i).style.transform=`scaleY(${f})`; } }); }
  // ── 2 · la ficha de Laura
  { const i=nm(t,E.s2-.06,E.s2+.4), o=nm(t,E.s3-.3,E.s3-.03); S($('c2'),{o:t<E.s2-.06?0:(o>=1?0:1),x:1500*(1-expo(i))-1500*p3in(o),b:22*(1-nm(i,0,.75))+22*pico(o)});
    const d=document.querySelectorAll('#c2 .dato'); fila(d[0],t,W.v1.anuncio-.2); fila(d[1],t,W.v1.curso-.2); fila(d[2],t,W.v1.curso+.3); fila(d[3],t,W.v1.curso+.6); pop($('pa'),t,W.v1.curso+.8); }
  // ── 3 · WhatsApp: resuelve dudas, cualifica y mueve la etapa
  { const i=nm(t,E.s3-.06,E.s3+.4), o=nm(t,E.s4+1.0,E.s4+1.3); S($('c3'),{o:t<E.s3-.06?0:(o>=1?0:1),x:1500*(1-expo(i)),s:1+p3in(o)*4,b:22*(1-nm(i,0,.75))+16*pico(o)}); $('c3').style.transformOrigin='50% 72%';
    pop($('b1'),t,W.v2.whatsapp); pop($('b2'),t,W.v2.resuelve-.2); pop($('b3'),t,W.v2.resuelve+.6); pop($('et'),t,W.v2.mueve); if(t>E.s4) $('et').style.opacity=1-nm(t,E.s4,E.s4+.2);
    const v=nm(t,E.s4+.1,E.s4+.45); $('nr').style.opacity=Math.min(1,v*3); $('nr').style.transform=`translateX(-50%) scale(${lerp(1.6,1,expo(v))}) rotate(-3deg)`; $('nr').style.filter=v<1&&v>0?`blur(${(10*(1-v)).toFixed(1)}px)`:'none'; }
  // ── 4 · agente de voz: se oye a Raquel; el subtítulo sigue lo que dice
  { const i=nm(t,E.s4+1.25,E.s4+1.7), o=nm(t,E.s5-.3,E.s5-.03); S($('c4'),{o:t<E.s4+1.25?0:(o>=1?0:1),s:lerp(1.12,1,expo(i)),x:-1500*p3in(o),b:11*(1-nm(i,0,.7))+22*pico(o)});
    const r0=T.r[0], r1=T.r[0]+T.r[1], hab=t>=r0&&t<r1; $('cst').textContent=t>=r0?'En llamada · 00:0'+Math.min(9,Math.floor(t-r0)):'Llamando a Laura…';
    [...$('wave').children].forEach((el,n)=>{el.style.height=(hab?20+70*Math.abs(Math.sin(t*9+n*.9)):16)+'px';});
    const nw=RT.filter(x=>x<=t).length; $('rsub').innerHTML=nw?RTX.slice(0,nw).map((w,j)=>j===nw-1?'<i>'+w+'</i>':w).join(' '):''; }
  // ── 5 · reunión: confirmación, recordatorios, pipeline y cambio de cita
  { const i=nm(t,E.s5-.06,E.s5+.4), o=nm(t,E.s6-.3,E.s6-.03); S($('c5'),{o:(t<E.s5-.06?0:1)*(1-o),x:1500*(1-expo(i)),b:22*(1-nm(i,0,.75))+10*o,s:1-.05*o});
    const v=nm(t,W.v4.agenda,W.v4.agenda+.4); S($('ci'),{o:Math.min(1,v*3),s:lerp(1.5,1,expo(v)),r:lerp(-4,0,expo(v)),b:12*(1-nm(v,0,.5))}); const c=nm(t,W.v4.sistema-.2,W.v4.sistema+.2); S($('c5c'),{o:c,y:(1-expo(c))*70});
    const d=document.querySelectorAll('#c5c .dato'); fila(d[0],t,W.v4.confirma); fila(d[1],t,W.v4.recuerda); fila(d[2],t,W.v4.actualiza); fila(d[3],t,W.v4.cambia-.4); }
  // ── 6 · el resultado vuelve a la campaña que la trajo
  { const i=nm(t,E.s6-.06,E.s6+.4), o=nm(t,E.s7-.3,E.s7-.03); S($('c7'),{o:(t<E.s6-.06?0:i)*(1-o),b:12*(1-i)+10*o,s:1-.05*o});
    const a=nm(t,E.s6+.1,E.s6+.5); S($('n2'),{o:Math.min(1,a*3),s:lerp(1.1,1,expo(a)),b:10*(1-nm(a,0,.7))}); pop($('cua'),t,W.v5.cualificada);
    const b=nm(t,W.v5.esa-.3,W.v5.esa+.1); S($('n1'),{o:b,y:(1-expo(b))*-60}); $('via').style.opacity=nm(t,W.v5.esa,W.v5.esa+.3);
    const tb=W.v5.señal, v=nm(t,tb,tb+.9); S($('bola'),{o:t<tb?0:(v>=1?0:1),y:-330*io(v),s:1+.35*pico(v),b:7*pico(v)});
    const r=nm(t,tb+.85,tb+1.2); $('n1').style.transform+=` scale(${1+.04*pico(r)})`; pop($('sen'),t,tb+.9); $('n1').style.background=r>0?'#F4CC38':'#F4F1EB'; }
  // ── 7 · esto es Qualivo y cierre
  { const tS=W.v6.solicita, v=$('val'), sal=nm(t,tS-.45,tS-.25); v.style.opacity=t<E.s7-.05?0:1-sal; v.style.filter=sal>0?`blur(${(10*sal).toFixed(1)}px)`:'none'; palabras(v.querySelector('h3'),t,E.s7+.2,.1);
    [W.v6.captación,W.v6.seguimiento,W.v6.datos].forEach((d,i)=>{const el=v.querySelectorAll('.vr')[i], q=nm(t,d-.1,d+.2); el.style.opacity=Math.min(1,q*3); el.style.transform=`translateX(${(1-expo(q))*-120}px) scale(${1+.03*pico(nm(t,d+.2,d+.5))})`; el.style.filter=q<1&&q>0?`blur(${(8*(1-q)).toFixed(1)}px)`:'none';});
    const f=$('fin'); f.style.opacity=t<tS-.3?0:1; const lg=nm(t,tS-.25,tS+.05), im=f.querySelector('img'); im.style.opacity=lg; im.style.filter=lg<1?`blur(${(8*(1-lg)).toFixed(1)}px)`:'none';
    palabras(f.querySelector('.t1'),t,tS-.1,.07); pop(f.querySelector('.cta'),t,tS+.5); f.querySelector('.t2').style.opacity=nm(t,tS+1.0,tS+1.3); f.querySelector('.web').style.opacity=nm(t,tS+1.3,tS+1.6); }
};
window.setT(0);
</script>
</html>
'''
open(f'{A}/escena-v5.html', 'w').write(cab + EXTRA + '</style>' + CUERPO); print('ok', DUR, T)
