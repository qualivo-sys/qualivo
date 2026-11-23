#!/usr/bin/env python3
"""Formación V5 · primeros segundos (gancho + captación conectada), 9:16. Estilos de la V4; tiempos sacados de la locución."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); V4 = f'{A}/../2026-11-23-formacion-v4/escena-v4.html'
TEMPO, HUECO, COLA = 1.08, 0.25, 0.6
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
G = json.load(open(f'{A}/guion.json')); T = {}; W = {}; t = 0.1
for k in G:
    d = dur(f'{A}/voz/{k}.mp3') / TEMPO; T[k] = [round(t, 3), round(d, 3)]
    W[k] = {w['w'].strip('¿?.,:').lower(): round(t + w['s'] / TEMPO, 3) for w in reversed(json.load(open(f'{A}/voz/{k}.json')))}
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
  </div>
  <div id="tex"></div>
</div>
<script src="../2026-11-23-formacion-v5/t.js"></script>
<script>
const $=id=>document.getElementById(id);
$('tex').style.backgroundImage="url(\"data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')+"\")";
const T=window.T, W=window.W, DUR=window.DUR; const E={s1:T.v1[0]-.12, s2:W.v1.ya-.25};
const cl=(x,a,b)=>Math.max(a,Math.min(b,x)), nm=(t,a,b)=>cl((t-a)/(b-a),0,1), lerp=(a,b,v)=>a+(b-a)*v;
const expo=x=>x>=1?1:1-Math.pow(2,-10*x), p3in=x=>x*x*x, io=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2, back=x=>{const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
const pico=x=>Math.sin(cl(x,0,1)*Math.PI);
function S(el,o){ el.style.opacity=o.o===undefined?1:o.o; el.style.transform=`translate(${o.x||0}px,${o.y||0}px) scale(${o.s===undefined?1:o.s}) rotate(${o.r||0}deg)`; el.style.filter=o.b>0.3?`blur(${o.b.toFixed(1)}px)`:'none'; }
function palabras(el,t,t0,paso=.067){ [...el.querySelectorAll('span')].forEach((s,i)=>{const v=nm(t,t0+i*paso,t0+i*paso+.14); s.style.opacity=v; s.style.filter=v<1?`blur(${(6*(1-v)).toFixed(1)}px)`:'none';}); }
function fila(el,t,t0){ const v=nm(t,t0,t0+.28); el.style.opacity=v; el.style.transform=`translateX(${(1-expo(v))*40}px)`; }
function pop(el,t,t0){ const v=nm(t,t0,t0+.32); el.style.opacity=Math.min(1,v*3); el.style.transform=`scale(${v<=0?0:back(v)})`; }
let capAct='';
window.setT=function(t){
  const z=nm(t,E.s1-.4,E.s1), fl=io(nm(t,E.s1-.03,E.s1+.3));
  $('e').style.background=t<E.s1-.03?'#0A0A0B':'#F4CC38'; $('fondo').style.opacity=t<E.s1-.03?0:fl; $('rej').style.opacity=t<E.s1?0:.9; $('rej').style.transform=`translate(${-(t*9)%120}px,${-(t*6)%120}px)`;
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
  const enC=t>=E.s1, k=t<E.s2?'s1':'s2';
  const RJ={s1:['desde el anuncio','00:00'],s2:['desde el formulario','00:04']}, CP={s1:'<span>Del</span> <span>anuncio</span> <i><span>al</span> <span>formulario.</span></i>',s2:'<span>Sabemos</span> <span>de</span> <span>qué</span> <i><span>anuncio</span> <span>viene.</span></i>'};
  const rl=$('reloj'); if(enC){ rl.innerHTML='<span>'+RJ[k][0]+'</span><b>'+RJ[k][1]+'</b>'; S(rl,{o:nm(t,E.s1+.25,E.s1+.5),s:1+.08*pico(nm(t,E[k]+.25,E[k]+.5))}); } else rl.style.opacity=0;
  $('ej').style.opacity=enC?nm(t,E.s1+.4,E.s1+.7):0;
  const cap=$('cap'); if(enC){ if(k!==capAct){cap.innerHTML=CP[k]; capAct=k;} palabras(cap,t,E[k]+.3); const sal=k==='s1'?nm(t,E.s2-.22,E.s2-.04):0; cap.style.opacity=1-sal; cap.style.filter=sal>0?`blur(${(8*sal).toFixed(1)}px)`:'none'; } else { cap.style.opacity=0; capAct=''; }
  // ── 1 · campaña → landing → formulario
  { const o=nm(t,E.s2-.3,E.s2-.03); S($('c1'),{o:t<E.s1?0:(o>=1?0:1),x:-1500*p3in(o),b:22*pico(o)});
    [[W.v1.campaña,'t0'],[W.v1.landing,'t1'],[W.v1.formulario,'t2']].forEach(([a,id],i)=>{ const v=nm(t,a-.15,a+.25); S($(id),{o:Math.min(1,v*3),y:(1-expo(v))*120,s:lerp(1.08,1,expo(v)),b:10*(1-nm(v,0,.7))}); if(i<2){ const f=nm(t,a+.3,a+.55); $('f'+i).style.opacity=f; $('f'+i).style.transform=`scaleY(${f})`; } }); }
  // ── 2 · la ficha de Laura
  { const i=nm(t,E.s2-.06,E.s2+.4); S($('c2'),{o:t<E.s2-.06?0:1,x:1500*(1-expo(i)),b:22*(1-nm(i,0,.75))});
    const d=document.querySelectorAll('#c2 .dato'); fila(d[0],t,W.v1.anuncio-.2); fila(d[1],t,W.v1.curso-.2); fila(d[2],t,W.v1.curso+.3); fila(d[3],t,W.v1.curso+.6); pop($('pa'),t,W.v1.curso+.8); }
};
window.setT(0);
</script>
</html>
'''
open(f'{A}/escena-v5-inicio.html', 'w').write(cab + EXTRA + '</style>' + CUERPO); print('ok', DUR, T)
