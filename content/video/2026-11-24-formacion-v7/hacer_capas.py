#!/usr/bin/env python3
"""Formación V7 · capa gráfica completa (9:16) para componer sobre planos de vídeo generados. Guion de la V6.
Genera t.js (tiempos y cortes a partir de la locución) y capas.html. Estilos de la prueba audiovisual del 23-nov."""
import json, os, subprocess
A = os.path.dirname(os.path.abspath(__file__)); BASE = f'{A}/../2026-11-23-formacion-v7-prueba/capas.html'
TEMPO, HUECO, COLA, LLAMADA = 1.10, 0.2, 1.4, 6.0
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
T = {}; W = {}; t = 0.1
for k in ['v0', 'v1', 'v2', 'v3', 'r', 'v4', 'v5', 'v6']:
    if k == 'r': T[k] = [round(t, 3), LLAMADA]; t += LLAMADA + HUECO; continue
    d = dur(f'{A}/voz/{k}.mp3') / TEMPO; T[k] = [round(t, 3), round(d, 3)]
    W[k] = {w['w'].strip('¿?.,:').lower(): round(t + w['s'] / TEMPO, 3) for w in reversed(json.load(open(f'{A}/voz/{k}.json')))}
    t += d + HUECO
DUR = round(t - HUECO + COLA, 2); E = {k: round(T[k][0] - .1, 3) for k in T}; E['v0'] = 0
r25 = lambda x: round(round(x * 25) / 25, 2)
# cortes de plano: [inicio, tipo, plano de vídeo (o None si la escena es gráfica), segundo de entrada en el plano]
P = [[0, 'laura', 'laura', 1.3], [r25(W['v0']['mira'] - .15), 'mesa', 'escritorio', 0.9],
     [r25(E['v1']), 'scroll', 'scroll', 0.4], [r25(W['v1']['para'] - .1), 'crm', None, 0],
     [r25(E['v2']), 'wa', None, 0], [r25(E['v3']), 'sinresp', 'sinrespuesta', 0.3], [r25(E['r']), 'llamada', 'llamada', 0.6],
     [r25(E['v4']), 'cal', None, 0], [r25(W['v4']['y'] - .0 if False else W['v4']['admisiones'] - .25), 'adm', 'admisiones', 0.6],
     [r25(E['v5']), 'equipo', 'equipo', 0.5], [r25(W['v5']['utilizamos'] - .2), 'meta', None, 0], [r25(E['v6']), 'fin', None, 0]]
open(f'{A}/t.js', 'w').write('window.T=' + json.dumps(T) + ';window.W=' + json.dumps(W, ensure_ascii=False) + ';window.DUR=' + str(DUR) + ';window.P=' + json.dumps(P) + ';')
json.dump({'T': T, 'DUR': DUR, 'TEMPO': TEMPO, 'P': P}, open(f'{A}/tiempos.json', 'w'), indent=1)
h = open(BASE).read(); cab = h[:h.index('</style>')]
EXTRA = '''
.tt{left:70px;right:70px;font-family:Anton;font-size:112px;line-height:.94;text-transform:uppercase;color:#F4F1EB;text-shadow:0 6px 30px rgba(0,0,0,.6)}
.tt span{display:inline-block;opacity:0}.tt i{font-style:normal;color:#F4CC38}
.tt.osc{color:#0A0A0B;text-shadow:none}.tt.osc i{color:#F4F1EB}
.flo{position:absolute;background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:62px;line-height:1;text-transform:uppercase;padding:22px 32px;border-radius:24px;white-space:nowrap;box-shadow:0 30px 70px rgba(0,0,0,.55);opacity:0;transform-origin:50% 50%}
.flo small{display:block;font-family:SG;font-size:23px;letter-spacing:.16em;font-weight:700;color:rgba(244,241,235,.7);margin-bottom:4px}
.flo.am{background:#F4CC38;color:#0A0A0B}.flo.am small{color:rgba(10,10,11,.6)}
.flo.cl{background:#F4F1EB;color:#0A0A0B}.flo.cl small{color:#0E7C74}
.flo.vd{background:#0E7C74;color:#F4F1EB}
.esc{inset:0;overflow:hidden;perspective:2400px}
#adc{left:250px;top:560px;width:580px;background:#fff;border-radius:40px;overflow:hidden;padding-bottom:26px;box-shadow:0 40px 90px rgba(0,0,0,.6);transform-origin:50% 50%;color:#0A0A0B}
#adc .igh{display:flex;align-items:center;gap:16px;padding:22px 26px 14px}#adc .igh .av{width:56px;height:56px;border-radius:50%;background:#1FA396}#adc .igh b{font-size:26px;display:block}#adc .igh span{font-size:20px;color:#7A7C82}
#adc .igi{height:330px;background:#0A0A0B;color:#F4F1EB;display:flex;flex-direction:column;justify-content:center;padding:34px}#adc .igi h4{font-family:Anton;font-weight:400;font-size:60px;line-height:.95;text-transform:uppercase}
#adc .igb{margin:18px 26px 0;border-radius:14px;padding:18px;text-align:center;font-weight:700;font-size:28px;background:#F4CC38}
#f0{left:60px;top:700px;width:580px;background:#F4F1EB;border-radius:34px;padding:26px 28px;box-shadow:0 30px 70px rgba(0,0,0,.55);color:#0A0A0B;transform-origin:0 0}
#f0 small{display:block;font-size:22px;letter-spacing:.16em;text-transform:uppercase;font-weight:800;color:#0E7C74}
#f0 b{display:block;font-family:Anton;font-weight:400;font-size:52px;line-height:1;text-transform:uppercase;margin:6px 0 16px}
#f0 .bt{display:inline-block;background:#F4CC38;border:4px solid #0A0A0B;border-radius:16px;font-family:Anton;font-size:38px;text-transform:uppercase;padding:12px 26px;transform-origin:0 50%}
.tag{position:absolute;background:rgba(10,10,11,.82);color:#F4F1EB;border-radius:999px;padding:12px 24px 12px 18px;font-size:28px;font-weight:700;display:flex;align-items:center;gap:12px;opacity:0;white-space:nowrap}
.tag:before{content:'';width:18px;height:18px;border-radius:50%;background:#F4CC38}.tag.ad:before{background:#1FA396}.tag em{font-style:normal;font-weight:600;color:rgba(244,241,235,.65)}
/* CRM en perspectiva */
#crm{position:absolute;left:90px;top:520px;width:900px;background:#F4F1EB;border-radius:44px;padding:34px 36px;transform-style:preserve-3d;box-shadow:-40px 60px 120px rgba(10,10,11,.45);color:#0A0A0B}
#crm .k{font-size:24px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:#0E7C74;margin-bottom:18px;display:flex;justify-content:space-between}
.fl2{display:flex;align-items:center;gap:22px;background:#fff;border-radius:22px;padding:22px 24px;margin-bottom:14px;font-size:30px;font-weight:700;color:#9AA2AE}
.fl2 .av{flex:none;width:72px;height:72px;border-radius:50%;background:#D9D5CC}.fl2 small{display:block;font-size:22px;font-weight:600;margin-top:4px}
.fl2.n{background:#F4CC38;color:#0A0A0B;border:4px solid #0A0A0B;transform-origin:50% 50%}.fl2.n .av{background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:36px;display:flex;align-items:center;justify-content:center}.fl2.n small{color:rgba(10,10,11,.7)}
.fl2.n b{display:block;font-family:Anton;font-weight:400;font-size:56px;line-height:1;text-transform:uppercase}
/* subtítulos de la llamada */
.sub{position:absolute;left:70px;max-width:860px;background:rgba(10,10,11,.86);color:#F4F1EB;border-radius:26px;padding:20px 28px;font-size:44px;line-height:1.18;font-weight:600;opacity:0;transform-origin:0 100%}
.sub small{display:block;font-size:22px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:#F4CC38;margin-bottom:4px}
.sub.r{left:auto;right:70px;background:rgba(244,241,235,.94);color:#0A0A0B;transform-origin:100% 100%}.sub.r small{color:#0E7C74}
#pend{position:absolute;left:70px;top:300px;border:3px dashed #F4CC38;color:#F4CC38;font-family:Anton;font-size:30px;text-transform:uppercase;padding:9px 16px;border-radius:12px;opacity:0;background:rgba(10,10,11,.5)}
#onda{position:absolute;right:70px;top:300px;display:flex;gap:8px;align-items:center;height:60px;opacity:0}#onda i{width:9px;border-radius:5px;background:#F4CC38;display:block;height:14px}
/* calendario */
#cal{position:absolute;left:120px;top:520px;width:840px;background:#F4F1EB;border-radius:44px;padding:34px;transform-style:preserve-3d;box-shadow:-40px 60px 120px rgba(0,0,0,.6);color:#0A0A0B}
#cal .mes{font-family:Anton;font-size:60px;text-transform:uppercase;margin-bottom:18px;display:flex;justify-content:space-between}#cal .mes span{color:#0E7C74}
#cal .gr{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}#cal .gr div{height:120px;border-radius:18px;background:rgba(10,10,11,.07);font-size:26px;font-weight:700;color:#7A7C82;padding:12px 14px}
#cal .gr div.h{background:#F4CC38;color:#0A0A0B;border:4px solid #0A0A0B;transform-origin:50% 50%}#cal .gr div.h b{display:block;font-family:Anton;font-weight:400;font-size:40px;margin-top:6px}
/* panel de Intelligence */
#pan{position:absolute;left:80px;top:520px;width:920px;background:#16181C;border:3px solid rgba(244,241,235,.16);border-radius:44px;padding:34px 36px;transform-style:preserve-3d;box-shadow:-40px 60px 120px rgba(0,0,0,.6);color:#F4F1EB}
#pan .k{font-size:24px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;color:#F4CC38;margin-bottom:20px}
.cam{display:flex;align-items:center;gap:20px;background:rgba(244,241,235,.06);border-radius:22px;padding:24px 26px;margin-bottom:14px;font-size:34px;font-weight:700;border:4px solid transparent}
.cam em{margin-left:auto;font-style:normal;font-size:24px;font-weight:700;color:rgba(244,241,235,.5);white-space:nowrap}
.cam.g{background:#F4CC38;color:#0A0A0B;border-color:#F4F1EB}.cam.g em{color:#0A0A0B;background:#F4F1EB;border-radius:10px;padding:6px 12px}
#res{position:absolute;left:150px;top:1330px;width:780px;background:#F4F1EB;color:#0A0A0B;border-radius:30px;padding:26px 30px;box-shadow:0 30px 70px rgba(0,0,0,.55);opacity:0}
#res small{display:block;font-size:22px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:#0E7C74}#res b{display:block;font-family:Anton;font-weight:400;font-size:56px;text-transform:uppercase;line-height:1.02}
#bola{position:absolute;left:500px;top:1290px;width:80px;height:80px;border-radius:50%;background:#F4CC38;border:6px solid #F4F1EB;opacity:0}
/* cierre */
#fin{inset:0;background:#0A0A0B}
#con{position:absolute;left:70px;right:70px;top:290px}
#con h3{font-family:Anton;font-weight:400;font-size:150px;line-height:.95;text-transform:uppercase;color:#F4F1EB;margin-bottom:60px}#con h3 i{font-style:normal;color:#F4CC38}#con h3 span{display:inline-block;opacity:0}
#con .nd{position:relative;background:#16181C;border:3px solid rgba(244,241,235,.16);border-radius:28px;padding:30px 34px 30px 130px;margin-bottom:54px;opacity:0;transform-origin:0 50%}
#con .nd u{position:absolute;left:30px;top:50%;margin-top:-38px;width:76px;height:76px;border-radius:50%;background:#F4CC38;color:#0A0A0B;text-decoration:none;font-family:Anton;font-size:44px;display:flex;align-items:center;justify-content:center}
#con .nd b{display:block;font-family:Anton;font-weight:400;font-size:66px;line-height:1;text-transform:uppercase;color:#F4F1EB}#con .nd small{display:block;font-size:28px;font-weight:600;color:rgba(244,241,235,.65);margin-top:8px}
#con .cx{position:absolute;left:62px;width:12px;height:54px;background:#F4CC38;transform-origin:50% 0;opacity:0}
#cie{position:absolute;left:80px;right:80px;top:300px;text-align:center;opacity:0}
#cie img{width:520px}#cie .t1{font-family:Anton;font-size:100px;line-height:.96;text-transform:uppercase;color:#F4F1EB;margin-top:60px}#cie .t1 span{display:inline-block;opacity:0}#cie .t1 i{font-style:normal;color:#F4CC38}
#cie .cta{display:inline-block;font-family:Anton;font-size:64px;line-height:1;text-transform:uppercase;background:#F4CC38;color:#0A0A0B;padding:34px 44px;border-radius:24px;margin-top:64px;opacity:0;transform-origin:50% 50%}
#cie .t2{font-size:32px;font-weight:600;color:rgba(244,241,235,.75);margin-top:34px;opacity:0}#cie .web{font-family:Anton;font-size:44px;letter-spacing:.06em;color:#1FA396;margin-top:22px;opacity:0}
'''
CUERPO = r'''
<div id="e">
  <div class="abs" id="velo"></div>
  <!-- 1 Laura -->
  <div class="abs tt" id="q0" style="top:1010px"><span>¿Tu</span> <span>escuela</span> <span>online</span> <i><span>ya</span> <span>invierte</span> <span>en</span> <span>publicidad?</span></i></div>
  <div class="abs" id="f0"><small>Escuela Norte · curso online</small><b>Marketing Digital</b><span class="bt" id="f0b">Solicitar información</span></div>
  <div class="tag" id="g0" style="left:70px;top:296px">Laura <em>· quiere estudiar Marketing Digital</em></div>
  <div class="tag" id="g1" style="left:70px;top:1560px">Laura <em>· no ha visto el mensaje</em></div>
  <div class="tag" id="g2" style="left:70px;top:400px">Laura <em>· contesta la llamada</em></div>
  <div class="tag ad" id="g3" style="left:70px;top:560px">Admisiones <em>· Escuela Norte</em></div>
  <div class="tag ad" id="g4" style="left:70px;top:560px">Equipo de campañas <em>· Qualivo</em></div>
  <!-- 2 mesa -->
  <div class="abs" id="noti"><div class="av">LV</div><div><small>Nueva solicitud</small><b>Laura Vidal</b><span>Pide información de un curso</span></div><em>ahora</em></div>
  <div class="flo am" id="op" style="left:150px;top:1340px"><small>Objetivo</small>Oportunidad comercial</div>
  <!-- 3 scroll -->
  <div class="abs tt" id="q1" style="top:300px"><span>Gestionamos</span> <i><span>tus</span> <span>anuncios.</span></i></div>
  <div class="abs" id="adc"><div class="igh"><div class="av"></div><div><b>Escuela Norte</b><span>Patrocinado</span></div></div><div class="igi"><h4>Marketing Digital online. Por las tardes.</h4></div><div class="igb" id="adb">Más información</div></div>
  <!-- 4 CRM -->
  <div class="abs esc" id="e4" style="background:#1FA396"><div class="luz"></div>
    <div class="abs tt osc" id="q2" style="top:290px"><span>Y</span> <span>llega</span> <i><span>la</span> <span>solicitud.</span></i></div>
    <div id="crm"><div class="k"><span>CRM · Solicitudes</span><span>en directo</span></div>
      <div class="fl2 n" id="fn"><div class="av">LV</div><div><b>Laura Vidal</b><small>Marketing Digital · anuncio «por las tardes»</small></div></div>
      <div class="fl2"><div class="av"></div><div>Solicitud anterior<small>En conversación</small></div></div>
      <div class="fl2"><div class="av"></div><div>Solicitud anterior<small>Reunión agendada</small></div></div></div>
  </div>
  <!-- 5 WhatsApp -->
  <div class="abs" id="p3"><div class="luz"></div><div class="som" id="som"></div>
    <div class="abs tt osc" id="q3" style="top:140px;font-size:96px"><span>Responde,</span> <span>pregunta</span> <i><span>y</span> <span>cualifica.</span></i></div>
    <div id="mov"><div class="scr">
      <div class="wah"><div class="av">E</div><div><b>Escuela Norte</b><span>en línea</span></div></div>
      <div class="typ" id="ty" style="top:190px"><i></i><i></i><i></i></div>
      <div class="bub" id="b1" style="top:190px">Hola Laura, te interesa Marketing Digital. <b>¿Para cambiar de trabajo o para tu puesto actual?</b></div>
      <div class="bub r" id="b2" style="top:520px">Para cambiar de trabajo.</div>
      <div class="bub" id="b3" style="top:650px"><b>¿Cuándo te gustaría empezar?</b></div>
      <div class="bub r" id="b4" style="top:790px">Cuanto antes.</div>
    </div></div>
    <div class="flo" id="k0" style="left:470px;top:1250px;font-size:50px"><small>Viene de</small>Anuncio «tardes»</div>
    <div class="flo am" id="k2" style="left:70px;top:1440px"><small>Sistema</small>Cualificada · Nivel A</div>
    <div class="flo cl" id="k3" style="left:330px;top:1640px;font-size:50px"><small>Etapa</small>Conversación abierta</div>
  </div>
  <!-- 6 sin respuesta -->
  <div class="abs tt" id="q4" style="top:300px"><span>¿Laura</span> <span>deja</span> <i><span>de</span> <span>responder?</span></i></div>
  <div class="flo cl" id="sr" style="left:240px;top:760px;font-size:76px">Sin respuesta</div>
  <div class="flo am" id="av" style="left:120px;top:1330px"><small>El sistema puede activar</small>Agente de voz</div>
  <!-- 7 llamada -->
  <div id="pend">Audio pendiente de la llamada real</div><div id="onda"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
  <div class="sub" id="s1" style="top:1010px"><small>Raquel · asistente virtual</small>Hola, Laura. ¿Te viene bien hablar un momento?</div>
  <div class="sub r" id="s2" style="top:1210px"><small>Laura</small>Sí, quería información sobre el curso.</div>
  <div class="sub" id="s3" style="top:1350px"><small>Raquel</small>¿Te ayudo a reservar una llamada con admisiones?</div>
  <!-- 8 calendario -->
  <div class="abs esc" id="e8" style="background:#0A0A0B"><div class="luz" style="opacity:.35"></div>
    <div class="abs tt" id="q5" style="top:290px"><span>Laura</span> <span>agenda</span> <i><span>una</span> <span>reunión.</span></i></div>
    <div id="cal"><div class="mes">Esta semana <span>admisiones</span></div><div class="gr"><div>LUN</div><div>MAR</div><div>MIÉ</div><div class="h" id="jue">JUE<b>17:00</b></div><div>VIE</div></div></div>
    <div class="flo vd" id="c1" style="left:100px;top:1010px;font-size:54px"><small style="color:rgba(244,241,235,.8)">WhatsApp</small>Confirmación enviada ✓</div>
    <div class="flo vd" id="c2" style="left:260px;top:1190px;font-size:54px"><small style="color:rgba(244,241,235,.8)">Automático</small>Recordatorios ✓</div>
  </div>
  <!-- 9 admisiones -->
  <div class="abs tt" id="q6" style="top:300px"><span>Admisiones</span> <i><span>lo</span> <span>sabe</span> <span>todo.</span></i></div>
  <div class="flo cl" id="ad1" style="left:90px;top:1180px;white-space:normal;width:900px;font-size:52px"><small>Laura Vidal · jueves 17:00</small>Quiere cambiar de trabajo. Empezar cuanto antes.</div>
  <!-- 10 equipo -->
  <div class="abs tt" id="q7" style="top:300px"><span>La</span> <span>reunión</span> <i><span>se</span> <span>celebra</span> <span>y</span> <span>se</span> <span>valida.</span></i></div>
  <div class="flo am" id="va" style="left:230px;top:1340px;font-size:72px">Cualificada ✓</div>
  <!-- 11 Intelligence -->
  <div class="abs esc" id="e11" style="background:#0A0A0B"><div class="luz" style="opacity:.3"></div>
    <div class="abs tt" id="q8" style="top:290px;font-size:100px"><span>Ese</span> <span>resultado</span> <i><span>mejora</span> <span>las</span> <span>campañas.</span></i></div>
    <div id="pan"><div class="k">Qualivo Intelligence · campañas</div>
      <div class="cam" id="cm0">Anuncio «por las tardes»<em id="ce">oportunidad cualificada</em></div>
      <div class="cam">Anuncio «matrícula abierta»<em>solo formularios</em></div>
      <div class="cam">Anuncio «plazas limitadas»<em>solo formularios</em></div></div>
    <div id="res"><small>Resultado comercial</small><b>Laura Vidal · reunión validada</b></div><div id="bola"></div>
  </div>
  <!-- 12 cierre -->
  <div class="abs" id="fin"><div id="con"><h3><span>Esto</span> <span>es</span> <i><span>Qualivo</span></i></h3>
      <div class="nd"><u>1</u><b>Captación</b><small>Anuncios y páginas</small></div><div class="cx" id="x0"></div>
      <div class="nd"><u>2</u><b>Seguimiento</b><small>De la solicitud a la reunión</small></div><div class="cx" id="x1"></div>
      <div class="nd"><u>3</u><b>Mejora continua</b><small>Ventas mejora las campañas</small></div></div>
    <div id="cie"><img src="rec/logo-blanco.png"><div class="t1"><span>De</span> <span>la</span> <span>solicitud</span> <i><span>a</span> <span>la</span> <span>oportunidad.</span></i></div><div class="cta">Solicita tu diagnóstico gratuito</div><div class="t2">Para escuelas de formación online</div><div class="web">QUALIVO.IO</div></div></div>
  <div class="abs" id="flash"></div>
</div>
<script src="../2026-11-24-formacion-v7/t.js"></script>
<script>
const $=id=>document.getElementById(id); const T=window.T, W=window.W, P=window.P, DUR=window.DUR;
const C={}; P.forEach((p,i)=>C[p[1]]=[p[0], i<P.length-1?P[i+1][0]:DUR+1]);
const cl=(x,a,b)=>Math.max(a,Math.min(b,x)), nm=(t,a,b)=>cl((t-a)/(b-a),0,1), lerp=(a,b,v)=>a+(b-a)*v;
const expo=x=>x>=1?1:1-Math.pow(2,-10*x), io=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2, back=x=>{const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, pico=x=>Math.sin(cl(x,0,1)*Math.PI);
function pop(el,t,t0,d=.3){ const v=nm(t,t0,t0+d); el.style.opacity=Math.min(1,v*3); el.style.transform=`scale(${v<=0?0:back(v)})`; }
function palabras(el,t,t0,paso=.08){ [...el.querySelectorAll('span')].forEach((s,i)=>{const v=nm(t,t0+i*paso,t0+i*paso+.16); s.style.opacity=v; s.style.transform=`translateY(${(1-expo(v))*26}px)`; s.style.filter=v<1?`blur(${(8*(1-v)).toFixed(1)}px)`:'none';}); }
const en=(k,t)=>t>=C[k][0]&&t<C[k][1];
function flota(id,k,t,t0,rot=0){ const el=$(id), v=nm(t,t0,t0+.35); el.style.opacity=en(k,t)?Math.min(1,v*3):0; el.style.transform=`translateY(${(1-expo(v))*90-10*nm(t,t0,C[k][1])}px) scale(${v<=0?0:lerp(.6,1,back(v))}) rotate(${rot}deg)`; el.style.filter=v<1&&v>0?`blur(${(10*(1-v)).toFixed(1)}px)`:'none'; }
function titulo(id,k,t,d=.2){ const el=$(id); el.style.opacity=en(k,t)?1:0; palabras(el,t,C[k][0]+d); }
function gira(id,k,t,ry=-22,rx=12){ const u=nm(t,C[k][0],C[k][1]), a=expo(nm(t,C[k][0],C[k][0]+.7)); $(id).style.transform=`translate3d(${lerp(100,0,a)}px,${lerp(140,0,a)-24*u}px,0) rotateY(${lerp(ry*1.6,ry*.6,a)+7*u}deg) rotateX(${lerp(rx*1.5,rx*.6,a)-3*u}deg) rotateZ(${lerp(5,1.5,a)-1*u}deg) scale(${lerp(.84,1,a)+.05*u})`; }
const VID=['laura','mesa','scroll','sinresp','llamada','adm','equipo'];
window.setT=function(t){
  $('velo').style.opacity=VID.some(k=>en(k,t))?1:0;
  $('flash').style.opacity=P.slice(1).reduce((m,p)=>Math.max(m,t>=p[0]-.04&&t<p[0]+.08?.5*(1-nm(t,p[0],p[0]+.08)):0),0);
  // 1 · Laura: se ve qué está pidiendo; pulsa «Solicitar información» justo antes del corte
  titulo('q0','laura',t,.1);
  { const k='laura', v=nm(t,.35,.75), pr=pico(nm(t,C[k][1]-.7,C[k][1]-.3)), f=$('f0'); f.style.opacity=en(k,t)?Math.min(1,v*3):0; f.style.transform=`translateY(${(1-expo(v))*-160}px) rotate(${lerp(-6,-2,expo(v))}deg) scale(${1-.03*pr})`; f.style.filter=v<1&&v>0?`blur(${(10*(1-v)).toFixed(1)}px)`:'none';
    $('f0b').style.background=pr>.2?'#0A0A0B':'#F4CC38'; $('f0b').style.color=pr>.2?'#F4CC38':'#0A0A0B'; $('f0b').style.transform=`scale(${1-.08*pr})`; }
  // quién es quién: Laura en sus tres planos, admisiones y el equipo de campañas
  [['g0','laura'],['g1','sinresp'],['g2','llamada'],['g3','adm'],['g4','equipo']].forEach(([id,k])=>{ const v=nm(t,C[k][0]+.25,C[k][0]+.55); $(id).style.opacity=en(k,t)?v:0; $(id).style.transform=`translateX(${(1-expo(v))*-60}px)`; });
  // 2 · mesa: salta la notificación; al nombrar «oportunidad comercial» aparece el objetivo
  { const k='mesa', n=$('noti'), a=C[k][0], v=nm(t,a+.5,a+.9); n.style.opacity=en(k,t)&&t>=a+.5?Math.min(1,v*3):0; n.style.transform=`translateY(${(1-expo(v))*420}px) scale(${v<=0?0:lerp(.5,1,back(v))}) rotate(${2*Math.sin(nm(t,a+.9,a+1.55)*Math.PI*6)*(1-nm(t,a+.9,a+1.55))}deg)`; n.style.filter=`blur(${(12*(1-nm(v,0,.6))).toFixed(1)}px)`; flota('op',k,t,W.v0.oportunidad-.15,-3); }
  // 3 · scroll: nuestro anuncio aparece en el móvil de quien navega
  { const k='scroll', a=C[k][0], v=nm(t,a+.45,a+.85), ad=$('adc'), pr=pico(nm(t,C[k][1]-.6,C[k][1]-.25)); titulo('q1',k,t);
    ad.style.opacity=en(k,t)?Math.min(1,v*3):0; ad.style.transform=`translateY(${(1-expo(v))*500}px) scale(${lerp(.7,1,expo(v))*(1-.03*pr)}) rotate(${lerp(8,-3,expo(v))}deg)`; ad.style.filter=`blur(${(12*(1-nm(v,0,.6))).toFixed(1)}px)`;
    $('adb').style.background=pr>.2?'#0A0A0B':'#F4CC38'; $('adb').style.color=pr>.2?'#F4CC38':'#0A0A0B'; }
  // 4 · CRM en perspectiva: entra la solicitud
  { const k='crm'; $('e4').style.opacity=en(k,t)?1:0; if(en(k,t)){ gira('crm',k,t,-20,12); titulo('q2',k,t); const v=nm(t,C[k][0]+.35,C[k][0]+.8), f=$('fn'); f.style.transform=`translateX(${(1-expo(v))*-1000}px) translateZ(${60*pico(nm(t,C[k][0]+.8,C[k][0]+1.3))}px) scale(${1+.04*pico(nm(t,C[k][0]+.8,C[k][0]+1.3))})`; f.style.filter=`blur(${(14*pico(v)).toFixed(1)}px)`; } }
  // 5 · WhatsApp en un móvil en perspectiva
  { const k='wa', p=$('p3'); p.style.opacity=en(k,t)?1:0; if(en(k,t)){ gira('mov',k,t,-22,12); $('som').style.transform=`translateX(${-40*nm(t,C[k][0],C[k][1])}px)`; titulo('q3',k,t,.25);
      const a=C[k][0], q=Math.min(nm(t,a+.5,a+.65),1-nm(t,W.v2.whatsapp-.3,W.v2.whatsapp-.2)); $('ty').style.opacity=q; [...$('ty').children].forEach((el,n)=>el.style.transform=`translateY(${-7*Math.max(0,Math.sin(t*10+n*1.1))}px)`);
      pop($('b1'),t,W.v2.whatsapp-.2); pop($('b2'),t,W.v2.preguntas-.4); pop($('b3'),t,W.v2.preguntas+.2); pop($('b4'),t,W.v2.cualifica-.5);
      flota('k0',k,t,W.v2.anuncio-.2,4); flota('k2',k,t,W.v2.cualifica,-4); flota('k3',k,t,W.v2.actualiza+.1,3); } else ['k0','k2','k3'].forEach(i=>$(i).style.opacity=0); }
  // 6 · sin respuesta
  { const k='sinresp'; titulo('q4',k,t); const v=nm(t,W.v3.responder-.1,W.v3.responder+.25), s=$('sr'); s.style.opacity=en(k,t)?Math.min(1,v*3):0; s.style.transform=`scale(${lerp(1.7,1,expo(v))}) rotate(-4deg)`; s.style.filter=v<1&&v>0?`blur(${(12*(1-v)).toFixed(1)}px)`:'none'; flota('av',k,t,W.v3.agente-.3,3); }
  // 7 · llamada: subtítulos de la conversación y aviso de audio pendiente
  { const k='llamada', a=C[k][0], on=en(k,t); $('pend').style.opacity=on?1:0; $('onda').style.opacity=on?1:0; [...$('onda').children].forEach((el,n)=>el.style.height=(14+40*Math.abs(Math.sin(t*9+n*.9)))+'px');
    [['s1',a+.3],['s2',a+2.5],['s3',a+4.0]].forEach(([id,t0])=>{ const el=$(id), v=nm(t,t0,t0+.3); el.style.opacity=on?Math.min(1,v*3):0; el.style.transform=`scale(${v<=0?0:back(v)})`; }); }
  // 8 · calendario en perspectiva
  { const k='cal'; $('e8').style.opacity=en(k,t)?1:0; if(en(k,t)){ gira('cal',k,t,18,10); titulo('q5',k,t); const v=nm(t,W.v4.reunión-.2,W.v4.reunión+.15); $('jue').style.transform=`translateZ(${70*expo(v)}px) scale(${1+.14*expo(v)})`; $('jue').style.opacity=.35+.65*v;
      flota('c1','cal',t,W.v4.confirmación-.1,-3); flota('c2','cal',t,W.v4.recordatorios-.1,3); } else ['c1','c2'].forEach(i=>$(i).style.opacity=0); }
  // 9 · admisiones
  titulo('q6','adm',t); flota('ad1','adm',t,C.adm[0]+.9,-1.5);
  // 10 · el equipo valida la reunión
  titulo('q7','equipo',t); flota('va','equipo',t,W.v5.celebra,-4);
  // 11 · Intelligence: el resultado sube a la campaña que trajo a Laura
  { const k='meta'; $('e11').style.opacity=en(k,t)?1:0; if(en(k,t)){ gira('pan',k,t,-16,10); titulo('q8',k,t); const a=C[k][0], r=nm(t,a+.3,a+.65), rs=$('res'); rs.style.opacity=Math.min(1,r*3); rs.style.transform=`translateY(${(1-expo(r))*120}px) rotate(-2deg)`;
      const tb=W.v5.mejorar-.3, v=nm(t,tb,tb+.8), bo=$('bola'); bo.style.opacity=(t>=tb&&v<1)?1:0; bo.style.transform=`translateY(${-640*io(v)}px) scale(${1+.4*pico(v)})`; bo.style.filter=`blur(${(8*pico(v)).toFixed(1)}px)`;
      const g=t>=tb+.75; $('cm0').className='cam'+(g?' g':''); $('cm0').style.transform=`scale(${1+.05*pico(nm(t,tb+.75,tb+1.15))})`; $('ce').style.visibility=g?'visible':'hidden'; } }
  // 12 · cierre: tres piezas unidas y botón
  { const k='fin', f=$('fin'); f.style.opacity=en(k,t)?1:0; const a=C[k][0], tS=W.v6.solicita, c=$('con'), sal=nm(t,tS-.45,tS-.25); c.style.opacity=1-sal; c.style.filter=sal>0?`blur(${(10*sal).toFixed(1)}px)`:'none'; palabras(c.querySelector('h3'),t,a+.15,.1);
    const nd=c.querySelectorAll('.nd'); [W.v6.captación,W.v6.seguimiento,W.v6.mejora].forEach((d,i)=>{ const q=nm(t,d-.1,d+.2); nd[i].style.opacity=Math.min(1,q*3); nd[i].style.transform=`translateX(${(1-expo(q))*-120}px)`; if(i<2){ const x=$('x'+i), ff=nm(t,d+.2,d+.45); x.style.top=(nd[i].offsetTop+nd[i].offsetHeight)+'px'; x.style.opacity=ff; x.style.transform=`scaleY(${ff})`; } });
    const ci=$('cie'); ci.style.opacity=t<tS-.3?0:1; const lg=nm(t,tS-.25,tS+.05); ci.querySelector('img').style.opacity=lg; palabras(ci.querySelector('.t1'),t,tS-.1,.07); pop(ci.querySelector('.cta'),t,tS+.5); ci.querySelector('.t2').style.opacity=nm(t,tS+1.0,tS+1.3); ci.querySelector('.web').style.opacity=nm(t,tS+1.3,tS+1.6); }
};
window.setT(0);
</script>
</html>
'''
open(f'{A}/capas.html', 'w').write(cab + EXTRA + '</style>' + CUERPO); print('ok', DUR); [print(p) for p in P]
