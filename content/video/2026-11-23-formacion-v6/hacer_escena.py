#!/usr/bin/env python3
"""Formación V6 · borrador interno completo (9:16). Una sola ficha de Laura: nombre, etapa, barra de progreso discreta y una ventana
central que enseña lo que el sistema hace en cada momento. Tiempos sacados de la locución; la llamada (r) tiene su hueco sin audio."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V5 = f'{A}/../2026-11-23-formacion-v5/escena-v5.html'
TEMPO, HUECO, COLA, LLAMADA = 1.12, 0.2, 1.6, 6.5
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
G = json.load(open(f'{A}/guion.json')); T = {}; W = {}; t = 0.1
for k in ['v0', 'v1', 'v2', 'v3', 'r', 'v4', 'v5', 'v6']:
    if k == 'r': T[k] = [round(t, 3), LLAMADA]; t += LLAMADA + HUECO; continue
    d = dur(f'{A}/voz/{k}.mp3') / TEMPO; T[k] = [round(t, 3), round(d, 3)]
    W[k] = {w['w'].strip('¿?.,:').lower(): round(t + w['s'] / TEMPO, 3) for w in reversed(json.load(open(f'{A}/voz/{k}.json')))}
    t += d + HUECO
DUR = round(t - HUECO + COLA, 2)
open(f'{A}/t.js', 'w').write('window.T=' + json.dumps(T) + ';window.W=' + json.dumps(W, ensure_ascii=False) + ';window.DUR=' + str(DUR) + ';')
json.dump({'T': T, 'DUR': DUR, 'TEMPO': TEMPO}, open(f'{A}/tiempos.json', 'w'), indent=1)
h = open(V5).read(); cab = h[:h.index('</style>')]
EXTRA = '''
#tit{left:70px;right:70px;top:290px;font-family:Anton;font-size:88px;line-height:.98;text-transform:uppercase;color:#F4F1EB;opacity:1}
#tit i{font-style:normal;color:#F4CC38}
#fi{left:60px;top:560px;width:960px;background:#F4F1EB;border:5px solid #0A0A0B;border-radius:44px;padding:26px 30px 30px;opacity:1;color:#0A0A0B;box-shadow:0 30px 80px rgba(0,0,0,.45)}
#fi .cab{display:flex;align-items:center;gap:22px}
#fi .av{flex:none;width:92px;height:92px;border-radius:50%;background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:46px;display:flex;align-items:center;justify-content:center}
#fi .cab b{display:block;font-family:Anton;font-weight:400;font-size:60px;line-height:1;text-transform:uppercase}
#fi .cab span{display:block;font-size:24px;font-weight:600;color:#3D4148;margin-top:4px}
#etp{margin-left:auto;background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:32px;text-transform:uppercase;padding:13px 20px;border-radius:14px;white-space:nowrap;transform-origin:100% 50%}
#bar5{display:flex;gap:10px;margin:22px 0 8px}#bar5 i{flex:1;height:12px;border-radius:6px;background:rgba(10,10,11,.14);display:block;overflow:hidden}#bar5 i u{display:block;height:100%;width:0;background:#0E7C74}
#pasotx{font-size:22px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#7A7C82;height:30px}
#viv{margin-top:12px;height:690px;border-radius:30px;background:#0A0A0B;position:relative;overflow:hidden;padding:64px 26px 20px;display:flex;flex-direction:column;gap:14px;align-items:flex-start}
#vet{position:absolute;left:28px;top:20px;font-size:22px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:rgba(244,241,235,.6)}
#wv{position:absolute;right:30px;top:14px;display:flex;gap:6px;align-items:center;height:40px;opacity:0}#wv i{width:7px;border-radius:4px;background:#F4CC38;display:block;height:10px}
.ln{max-width:850px;background:#F4F1EB;color:#0A0A0B;border-radius:24px;border-top-left-radius:6px;padding:20px 26px;font-size:44px;line-height:1.18;font-weight:600;transform-origin:0 100%;display:none}
.ln.r{align-self:flex-end;background:#D9FDD3;border-radius:24px;border-top-right-radius:6px;transform-origin:100% 100%}
.ln.q{background:#F4CC38}.ln.g{background:#0E7C74;color:#F4F1EB}.ln.n{background:#3D4148;color:#F4F1EB}
.ln small{display:block;font-size:22px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;opacity:.62;margin-bottom:3px}
.ln.cita{display:none;align-self:stretch;max-width:none;background:#F4CC38;border-radius:26px;padding:22px 26px;font-family:Anton;font-weight:400;font-size:62px;text-transform:uppercase;line-height:1}
.ln.cita small{font-family:SG}
#pend{position:absolute;right:22px;bottom:16px;border:3px dashed #F4CC38;color:#F4CC38;font-family:Anton;font-size:24px;text-transform:uppercase;padding:7px 14px;border-radius:10px;opacity:0}
#adv{position:absolute;left:215px;top:76px;width:480px;background:#fff;border-radius:30px;overflow:hidden;padding-bottom:20px;transform-origin:50% 0;opacity:0;color:#0A0A0B}
#adv .igh{padding:18px 20px 10px}#adv .igi{height:300px;padding:26px}#adv .igi h4{font-size:46px}#adv .igb{margin:14px 20px 0;font-size:24px;padding:14px}
#meta{position:absolute;left:26px;right:26px;top:70px;background:#F4F1EB;color:#0A0A0B;border-radius:24px;padding:20px 24px;opacity:0;transform-origin:50% 50%}
#meta small{display:block;font-size:19px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:#0E7C74}
#meta b{display:block;font-family:Anton;font-weight:400;font-size:50px;text-transform:uppercase;line-height:1.05}
#meta em{display:inline-block;margin-top:10px;font-style:normal;background:#0E7C74;color:#F4F1EB;font-family:Anton;font-size:32px;text-transform:uppercase;padding:8px 18px;border-radius:12px;opacity:0;transform-origin:0 50%}
#res{position:absolute;left:26px;right:26px;top:470px;background:#F4CC38;color:#0A0A0B;border-radius:24px;padding:20px 24px;opacity:0;transform-origin:50% 50%}
#res small{display:block;font-size:19px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;opacity:.62}
#res b{display:block;font-family:Anton;font-weight:400;font-size:50px;text-transform:uppercase;line-height:1.05}
#via2{position:absolute;left:96px;top:262px;width:14px;height:200px;border-radius:7px;background:repeating-linear-gradient(#F4F1EB 0 20px,transparent 20px 36px);opacity:0}
#bola2{position:absolute;left:71px;top:430px;width:64px;height:64px;border-radius:50%;background:#F4CC38;border:5px solid #F4F1EB;opacity:0}
/* cierre conectado */
#con{left:70px;right:70px;top:290px;opacity:1}
#con h3{font-family:Anton;font-weight:400;font-size:150px;line-height:.95;text-transform:uppercase;color:#F4F1EB;margin-bottom:60px}#con h3 i{font-style:normal;color:#F4CC38}#con h3 span{display:inline-block;opacity:0}
#con .nd{position:relative;background:#16181C;border:3px solid rgba(244,241,235,.16);border-radius:28px;padding:30px 34px 30px 130px;margin-bottom:54px;opacity:0;transform-origin:0 50%}
#con .nd u{position:absolute;left:30px;top:50%;margin-top:-38px;width:76px;height:76px;border-radius:50%;background:#F4CC38;color:#0A0A0B;text-decoration:none;font-family:Anton;font-size:44px;display:flex;align-items:center;justify-content:center}
#con .nd b{display:block;font-family:Anton;font-weight:400;font-size:66px;line-height:1;text-transform:uppercase;color:#F4F1EB}
#con .nd small{display:block;font-size:28px;font-weight:600;color:rgba(244,241,235,.65);margin-top:8px}
#con .cx{position:absolute;left:62px;width:12px;height:54px;background:#F4CC38;transform-origin:50% 0;opacity:0}
#fin .t1{font-size:96px}
'''
CUERPO = r'''
<div id="e" style="background:#0A0A0B">
  <div id="rej" style="opacity:.35;filter:invert(1)"></div>
  <div class="abs" id="tit"></div>
  <div class="abs" id="fi">
    <div class="cab"><div class="av">LV</div><div><b>Laura Vidal</b><span>Marketing Digital online</span></div><div id="etp">Nueva solicitud</div></div>
    <div id="bar5"><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i><i><u></u></i></div><div id="pasotx"></div>
    <div id="viv"><div id="vet">En directo</div><div id="wv"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div id="lineas" style="display:contents"></div>
      <div id="adv"><div class="igh"><div class="av"></div><div><b>Escuela Norte</b><span>Patrocinado</span></div></div><div class="igi"><h4>Marketing Digital online. Por las tardes.</h4></div><div class="igb">Más información</div></div>
      <div id="meta"><small>Meta Ads · campaña</small><b>Anuncio «por las tardes»</b><em id="sen">Resultado recibido</em></div><div id="via2"></div><div id="bola2"></div>
      <div id="res"><small>Resultado comercial</small><b>Reunión celebrada y validada</b></div>
      <div id="pend">Audio pendiente de la llamada real</div></div>
  </div>
  <div class="abs" id="con"><h3><span>Esto</span> <span>es</span> <i><span>Qualivo</span></i></h3>
    <div class="nd"><u>1</u><b>Captación</b><small>Anuncios y páginas</small></div><div class="cx" id="x0"></div>
    <div class="nd"><u>2</u><b>Seguimiento</b><small>De la solicitud a la reunión</small></div><div class="cx" id="x1"></div>
    <div class="nd"><u>3</u><b>Mejora continua</b><small>Ventas mejora las campañas</small></div>
  </div>
  <div class="abs" id="fin"><img src="rec/logo-blanco.png"><div class="t1"><span>De</span> <span>la</span> <span>solicitud</span> <i><span>a</span> <span>la</span> <span>oportunidad.</span></i></div><div class="cta">Solicita tu diagnóstico gratuito</div><div class="t2">Para escuelas de formación online</div><div class="web">QUALIVO.IO</div></div>
  <div id="tex"></div>
</div>
<script src="../2026-11-23-formacion-v6/t.js"></script>
<script>
const $=id=>document.getElementById(id);
$('tex').style.backgroundImage="url(\"data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')+"\")";
const T=window.T, W=window.W, DUR=window.DUR; const E={}; Object.keys(T).forEach(k=>E[k]=T[k][0]-.1); E.v0=0;
const cl=(x,a,b)=>Math.max(a,Math.min(b,x)), nm=(t,a,b)=>cl((t-a)/(b-a),0,1), lerp=(a,b,v)=>a+(b-a)*v;
const expo=x=>x>=1?1:1-Math.pow(2,-10*x), p3in=x=>x*x*x, io=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2, back=x=>{const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, pico=x=>Math.sin(cl(x,0,1)*Math.PI);
function pop(el,t,t0,d=.3){ const v=nm(t,t0,t0+d); el.style.opacity=Math.min(1,v*3); el.style.transform=`scale(${v<=0?0:back(v)})`; }
function palabras(el,t,t0,paso=.067){ [...el.querySelectorAll('span')].forEach((s,i)=>{const v=nm(t,t0+i*paso,t0+i*paso+.14); s.style.opacity=v; s.style.filter=v<1?`blur(${(6*(1-v)).toFixed(1)}px)`:'none';}); }
const r0=T.r[0];
// lo que aparece en la ventana central: [escena, segundo, clase, quién, texto]
const L=[
 ['v0',.45,'q','Sistema','Solicitud recibida'],['v0',1.15,'','WhatsApp','Respuesta enviada al momento'],['v0',1.85,'g','Sistema','Cualificada'],['v0',2.55,'q','Sistema','Reunión con admisiones'],
 ['v1',W.v1.solicitudes-.1,'q','Sistema','Solicitud recibida desde Meta'],['v1',W.v1.interesadas-.1,'','Laura pide','Información de Marketing Digital'],
 ['v2',W.v2.anuncio-.2,'q','Sistema','Viene del anuncio «por las tardes»'],['v2',W.v2.whatsapp-.2,'','WhatsApp','¿Para cambiar de trabajo o para tu puesto actual?'],['v2',W.v2.preguntas+.1,'r','Laura','Para cambiar de trabajo.'],['v2',W.v2.cualifica,'g','Sistema','Cualificada · Nivel A'],
 ['v3',E.v3+.15,'','WhatsApp','¿Reservamos una llamada con admisiones?'],['v3',W.v3.responder-.1,'n','Laura','Sin respuesta'],['v3',W.v3.agente-.1,'q','Sistema','Se activa el agente de voz'],
 ['r',r0+.25,'q','Raquel · asistente virtual','Hola, Laura. ¿Te viene bien hablar un momento?'],['r',r0+2.5,'r','Laura','Sí, quería información sobre el curso.'],['r',r0+4.3,'q','Raquel','¿Te ayudo a reservar una llamada con admisiones?'],
 ['v4',E.v4+.15,'r','Laura','Reservo el jueves a las 17:00.'],['v4',W.v4.reunión-.1,'cita','Reunión agendada','Jueves · 17:00'],['v4',W.v4.confirmación,'g','Sistema','Confirmación y recordatorios enviados'],['v4',W.v4.admisiones,'','Para admisiones','Quiere cambiar de trabajo · viene del anuncio «tardes»']];
const LIN=$('lineas'); L.forEach((x,i)=>{const d=document.createElement('div'); d.className='ln '+x[2]; d.id='ln'+i; d.innerHTML='<small>'+x[3]+'</small>'+x[4]; LIN.appendChild(d);});
const TIT={v0:'¿Tu escuela online <i>ya invierte en publicidad?</i>',v1:'Gestionamos <i>tus anuncios</i> y páginas de captación.',v2:'Responde, pregunta <i>y cualifica.</i>',v3:'¿Deja de responder? <i>Agente de voz.</i>',r:'Retoma <i>la conversación.</i>',v4:'Reunión agendada. <i>Admisiones lo sabe todo.</i>',v5:'El resultado comercial <i>mejora las campañas.</i>'};
const PASO=['Solicitud','WhatsApp y cualificación','Agente de voz','Reunión','Resultado → Meta'];
let titAct='';
window.setT=function(t){
  $('rej').style.transform=`translate(${-(t*9)%120}px,${-(t*6)%120}px)`;
  const ks=['v0','v1','v2','v3','r','v4','v5','v6'], k=ks.filter(x=>t>=E[x]).pop(), ki=ks.indexOf(k), sig=E[ks[ki+1]]||DUR+5, fuera=nm(t,E.v6-.3,E.v6+.05);
  // ── titular: cambia con cada escena y luego se queda quieto
  const ti=$('tit'); if(k!=='v6'){ if(titAct!==k){ti.innerHTML=TIT[k]; titAct=k;} const en=k==='v0'?1:nm(t,E[k]+.05,E[k]+.3), sa=nm(t,sig-.2,sig-.02); ti.style.opacity=Math.min(en,1-sa); ti.style.filter=`blur(${(8*(1-en)+8*sa).toFixed(1)}px)`; } else ti.style.opacity=0;
  // ── ficha: siempre en pantalla; se va al cierre
  const fi=$('fi'), ent=nm(t,-.3,.35); fi.style.opacity=1-fuera; fi.style.transform=`translateY(${(1-expo(ent))*160+fuera*-80}px) scale(${lerp(1.04,1,expo(ent))*(1-.06*fuera)})`; fi.style.filter=fuera>0?`blur(${(14*fuera).toFixed(1)}px)`:'none';
  // etapa y barra de progreso
  let etapa='Nueva solicitud', paso=0, tc=0;
  const C=[[.45,'Nueva solicitud',1],[1.15,'Conversación abierta',2],[2.55,'Reunión agendada',4],[W.v0.oportunidad,'Oportunidad comercial',4],[E.v1,'Nueva solicitud',0],[W.v1.solicitudes-.1,'Nueva solicitud',1],[W.v2.actualiza,'Conversación abierta',2],[W.v3.responder,'Sin respuesta',2],[W.v3.agente-.1,'Agente de voz',3],[r0+5.6,'Interesada en agendar',3],[W.v4.reunión-.1,'Reunión agendada',4],[W.v5.valida,'Cualificada',5]];
  C.forEach(c=>{ if(t>=c[0]){etapa=c[1]; paso=c[2]; tc=c[0];} });
  $('etp').textContent=etapa; $('etp').style.transform=`scale(${1+.12*pico(nm(t,tc,tc+.35))})`;
  [...document.querySelectorAll('#bar5 i u')].forEach((u,i)=>{u.style.width=(i<paso-1?100:i===paso-1?100*expo(nm(t,tc,tc+.4)):0)+'%';}); $('pasotx').textContent=paso?paso+' de 5 · '+PASO[paso-1]:'';
  // ── ventana central: solo las líneas de la escena actual
  $('vet').textContent={v0:'Así avanza',v1:'En directo',v2:'En directo',v3:'En directo',r:'Llamada',v4:'En directo',v5:'Lo que vuelve a la campaña',v6:''}[k];
  L.forEach((x,i)=>{ const el=$('ln'+i), on=x[0]===k&&t>=x[1]; el.style.display=on?'block':'none'; if(on){ const v=nm(t,x[1],x[1]+.3), sa=nm(t,sig-.18,sig-.02); el.style.opacity=Math.min(1,v*3)*(1-sa); el.style.transform=`scale(${back(v)})`; } });
  // anuncio de Meta dentro de la ventana: aparece y se convierte en la solicitud
  { const a=nm(t,E.v1+.1,E.v1+.5), v=nm(t,W.v1.solicitudes-.55,W.v1.solicitudes-.1), ad=$('adv'); ad.style.opacity=(k==='v1'&&t>=E.v1+.1&&v<1)?1:0; ad.style.transform=`translateY(${(1-expo(a))*80+lerp(0,-60,io(v))}px) scale(${lerp(1.06,1,expo(a))*lerp(1,.12,io(v))})`; ad.style.filter=`blur(${(10*(1-nm(a,0,.6))+8*pico(v)).toFixed(1)}px)`; }
  // llamada: onda y aviso de audio pendiente
  { const en=k==='r'; $('wv').style.opacity=en?1:0; [...$('wv').children].forEach((el,n)=>el.style.height=(10+26*Math.abs(Math.sin(t*9+n*.9)))+'px'); $('pend').style.opacity=en?1:0; }
  // resultado comercial → campaña de Meta
  { const en=k==='v5', sa=en?nm(t,sig-.18,sig-.02):1; const a=nm(t,E.v5+.15,E.v5+.5); const rs=$('res'); rs.style.opacity=en?Math.min(1,a*3)*(1-sa):0; rs.style.transform=`scale(${lerp(1.08,1,expo(a))})`;
    const b=nm(t,W.v5.utilizamos-.3,W.v5.utilizamos+.1), me=$('meta'); me.style.opacity=en?b*(1-sa):0; const tb=W.v5.resultado-.1, v=nm(t,tb,tb+.9), rr=nm(t,tb+.85,tb+1.2);
    me.style.transform=`translateY(${(1-expo(b))*-40}px) scale(${1+.04*pico(rr)})`; me.style.background=rr>0?'#F4CC38':'#F4F1EB'; $('via2').style.opacity=en?nm(t,W.v5.utilizamos,W.v5.utilizamos+.3)*(1-sa):0;
    const bo=$('bola2'); bo.style.opacity=(en&&t>=tb&&v<1)?1:0; bo.style.transform=`translateY(${-210*io(v)}px) scale(${1+.3*pico(v)})`; pop($('sen'),t,tb+.9); if(!en) $('sen').style.opacity=0; }
  // ── cierre: tres piezas unidas y botón
  { const c=$('con'), tS=W.v6.solicita, sal=nm(t,tS-.45,tS-.25); c.style.opacity=t<E.v6?0:1-sal; c.style.filter=sal>0?`blur(${(10*sal).toFixed(1)}px)`:'none'; palabras(c.querySelector('h3'),t,E.v6+.15,.1);
    const nd=c.querySelectorAll('.nd'); [W.v6.captación,W.v6.seguimiento,W.v6.mejora].forEach((d,i)=>{ const q=nm(t,d-.1,d+.2); nd[i].style.opacity=Math.min(1,q*3); nd[i].style.transform=`translateX(${(1-expo(q))*-120}px)`; nd[i].style.filter=q<1&&q>0?`blur(${(8*(1-q)).toFixed(1)}px)`:'none';
      if(i<2){ const x=$('x'+i), f=nm(t,d+.2,d+.45); x.style.top=(nd[i].offsetTop+nd[i].offsetHeight)+'px'; x.style.opacity=f; x.style.transform=`scaleY(${f})`; } });
    const f=$('fin'); f.style.opacity=t<tS-.3?0:1; const lg=nm(t,tS-.25,tS+.05), im=f.querySelector('img'); im.style.opacity=lg; im.style.filter=lg<1?`blur(${(8*(1-lg)).toFixed(1)}px)`:'none';
    palabras(f.querySelector('.t1'),t,tS-.1,.07); pop(f.querySelector('.cta'),t,tS+.5); f.querySelector('.t2').style.opacity=nm(t,tS+1.0,tS+1.3); f.querySelector('.web').style.opacity=nm(t,tS+1.3,tS+1.6); }
};
window.setT(0);
</script>
</html>
'''
open(f'{A}/escena-v6.html', 'w').write(cab + EXTRA + '</style>' + CUERPO); print('ok', DUR, T)
