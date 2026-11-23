#!/usr/bin/env python3
"""Formación V6 · escena de storyboard (9:16): la ficha de Laura como elemento fijo que enciende estados.
Cubre los primeros 10 s (0-10) y la escena del agente de voz (23-32). Estilos de la V5."""
import os
A = os.path.dirname(os.path.abspath(__file__)); V5 = f'{A}/../2026-11-23-formacion-v5/escena-v5.html'
h = open(V5).read(); cab = h[:h.index('</style>')]
EXTRA = '''
#tit{left:70px;right:70px;top:290px;font-family:Anton;font-size:88px;line-height:.98;text-transform:uppercase;color:#F4F1EB;opacity:1}
#tit i{font-style:normal;color:#F4CC38}#tit span{display:inline-block}
#fi{left:60px;top:610px;width:960px;background:#F4F1EB;border:5px solid #0A0A0B;border-radius:44px;padding:30px 34px 34px;opacity:1;color:#0A0A0B;box-shadow:0 30px 80px rgba(0,0,0,.45)}
#fi .cab{display:flex;align-items:center;gap:24px;margin-bottom:22px}
#fi .av{flex:none;width:104px;height:104px;border-radius:50%;background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:52px;display:flex;align-items:center;justify-content:center}
#fi .cab b{display:block;font-family:Anton;font-weight:400;font-size:66px;line-height:1;text-transform:uppercase}
#fi .cab span{display:block;font-size:26px;font-weight:600;color:#3D4148;margin-top:4px}
#etp{margin-left:auto;background:#0A0A0B;color:#F4CC38;font-family:Anton;font-size:30px;text-transform:uppercase;padding:12px 20px;border-radius:14px;white-space:nowrap;transform-origin:100% 50%}
.pa{display:flex;align-items:center;gap:20px;padding:15px 18px;border-radius:18px;font-size:32px;font-weight:700;color:#9AA2AE;margin-bottom:8px;background:rgba(10,10,11,.05);transform-origin:0 50%}
.pa u{flex:none;width:48px;height:48px;border-radius:50%;border:4px solid #C9C5BC;text-decoration:none;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:transparent}
.pa em{margin-left:auto;font-style:normal;font-size:22px;font-weight:700;color:#9AA2AE}
.pa.on{background:#F4CC38;color:#0A0A0B}.pa.on u{background:#0A0A0B;border-color:#0A0A0B;color:#F4CC38}.pa.on em{color:rgba(10,10,11,.65)}
.pa.ya{background:rgba(14,124,116,.14);color:#0A0A0B}.pa.ya u{background:#0E7C74;border-color:#0E7C74;color:#F4F1EB}
#viv{margin-top:18px;height:400px;border-radius:26px;background:#0A0A0B;position:relative;overflow:hidden}
#viv .et{position:absolute;left:24px;top:18px;font-size:20px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:rgba(244,241,235,.55)}
.ln{position:absolute;left:24px;max-width:780px;background:#F4F1EB;color:#0A0A0B;border-radius:22px;border-top-left-radius:6px;padding:13px 20px;font-size:28px;line-height:1.2;font-weight:600;opacity:0;transform-origin:0 100%}
.ln.r{left:auto;right:24px;background:#D9FDD3;border-radius:22px;border-top-right-radius:6px;transform-origin:100% 100%}
.ln.q{background:#F4CC38}.ln small{display:block;font-size:18px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;opacity:.6;margin-bottom:2px}
#wv{position:absolute;right:28px;top:14px;display:flex;gap:6px;align-items:center;height:40px;opacity:0}#wv i{width:7px;border-radius:4px;background:#F4CC38;display:block;height:10px}
#pend{position:absolute;right:20px;bottom:12px;border:3px dashed #F4CC38;color:#F4CC38;font-family:Anton;font-size:22px;text-transform:uppercase;padding:6px 12px;border-radius:10px;opacity:0}
#sel{position:absolute;left:50%;top:150px;background:#0E7C74;color:#F4F1EB;font-family:Anton;font-size:70px;line-height:1;text-transform:uppercase;padding:22px 34px;border-radius:20px;white-space:nowrap;opacity:0;border:5px solid #F4F1EB}
#ad{left:300px;top:640px;width:480px;background:#fff;border-radius:34px;border:6px solid #2A2D33;overflow:hidden;padding-bottom:22px;transform-origin:50% 50%}
#ad .igh{padding:20px 22px 12px}#ad .igi{height:250px;padding:26px}#ad .igi h4{font-size:44px}#ad .igb{margin:14px 22px 0;font-size:24px;padding:14px}
#fot{position:absolute;left:70px;bottom:250px;right:70px;font-size:30px;font-weight:600;color:rgba(244,241,235,.6);text-align:center}
'''
CUERPO = r'''
<div id="e" style="background:#0A0A0B">
  <div id="rej" style="opacity:.35;filter:invert(1)"></div>
  <div class="abs" id="tit"></div>
  <div class="abs" id="ad"><div class="igh"><div class="av"></div><div><b>Escuela Norte</b><span>Patrocinado</span></div></div>
      <div class="igi"><h4>Marketing Digital online. Por las tardes.</h4></div><div class="igb">Más información</div></div>
  <div class="abs" id="fi">
    <div class="cab"><div class="av">LV</div><div><b>Laura Vidal</b><span>Marketing Digital online · CRM</span></div><div id="etp">Nueva solicitud</div></div>
    <div class="pa" id="p0"><u>✓</u>Solicitud desde Meta<em>anuncio «tardes»</em></div>
    <div class="pa" id="p1"><u>✓</u>WhatsApp y cualificación<em>al momento</em></div>
    <div class="pa" id="p2"><u>✓</u>Agente de voz<em>si no responde</em></div>
    <div class="pa" id="p3"><u>✓</u>Reunión agendada<em>con recordatorios</em></div>
    <div class="pa" id="p4"><u>✓</u>Cualificada → señal a Meta<em>tras la reunión</em></div>
    <div id="viv"><div class="et" id="vet">En directo</div><div id="wv"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
      <div class="ln" id="l0" style="top:58px"></div><div class="ln" id="l1" style="top:150px"></div><div class="ln" id="l2" style="top:242px"></div>
      <div id="sel">Reunión cualificada ✓</div><div id="pend">Audio pendiente de la llamada real</div></div>
  </div>
  <div id="tex"></div>
</div>
<script>
const $=id=>document.getElementById(id);
const cl=(x,a,b)=>Math.max(a,Math.min(b,x)), nm=(t,a,b)=>cl((t-a)/(b-a),0,1), lerp=(a,b,v)=>a+(b-a)*v;
const expo=x=>x>=1?1:1-Math.pow(2,-10*x), p3in=x=>x*x*x, io=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2, back=x=>{const c=1.6;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)}, pico=x=>Math.sin(cl(x,0,1)*Math.PI);
function pop(el,t,t0,d=.32){ const v=nm(t,t0,t0+d); el.style.opacity=Math.min(1,v*3); el.style.transform=`scale(${v<=0?0:back(v)})`; }
function linea(id,t,t0,cls,quien,txt){ const el=$(id); el.className='ln '+cls; el.innerHTML=(quien?'<small>'+quien+'</small>':'')+txt; pop(el,t,t0); }
function paso(i,t,ton,tya){ const el=$('p'+i); el.className='pa'+(t>=tya?' ya':t>=ton?' on':''); el.style.transform=`scale(${1+.035*pico(nm(t,ton,ton+.35))})`; }
function titulo(html){ if($('tit').dataset.h!==html){$('tit').innerHTML=html; $('tit').dataset.h=html;} }
window.DUR=32;
window.setT=function(t){
  $('rej').style.transform=`translate(${-(t*9)%120}px,${-(t*6)%120}px)`;
  ['l0','l1','l2'].forEach(id=>$(id).style.opacity=0); $('sel').style.opacity=0; $('pend').style.opacity=0; $('wv').style.opacity=0; $('ad').style.opacity=0;
  const fi=$('fi');
  if(t<12){
    // ── GANCHO (0-5 s): la ficha está desde el fotograma 0 y el sistema avanza en cámara rápida hasta la reunión cualificada
    titulo(t<5.2?'<span>¿Tu escuela online</span> <i><span>ya invierte en publicidad?</span></i>':'<span>Gestionamos</span> <i><span>tus anuncios</span></i> <span>y páginas de captación.</span>');
    $('tit').style.opacity=1-pico(nm(t,5.0,5.4)); $('tit').style.filter=`blur(${(10*pico(nm(t,5.0,5.4))).toFixed(1)}px)`;
    const ent=nm(t,-.3,.35); fi.style.opacity=1; fi.style.transform=`translateY(${(1-expo(ent))*160}px) scale(${lerp(1.04,1,expo(ent))})`; fi.style.filter='none';
    if(t<5.2){ const T0=[.35,1.0,1.65,2.3,2.95]; T0.forEach((a,i)=>paso(i,t,a,T0[i+1]||3.4));
      $('etp').textContent=t<1.0?'Nueva solicitud':t<1.65?'Conversación abierta':t<2.3?'En seguimiento':t<2.95?'Reunión agendada':'Cualificada'; $('etp').style.transform=`scale(${1+.1*pico(nm(t%0.65,0,.3))})`;
      $('vet').textContent='Así acaba'; const v=nm(t,3.2,3.6); const s=$('sel'); s.style.opacity=Math.min(1,v*3)*(1-nm(t,4.9,5.15)); s.style.transform=`translateX(-50%) scale(${lerp(1.7,1,expo(v))}) rotate(-3deg)`; s.style.filter=v<1&&v>0?`blur(${(12*(1-v)).toFixed(1)}px)`:'none';
      if(t<3.2){ linea('l0',t,.5,'q','Sistema',['Solicitud recibida desde Meta','WhatsApp enviado · cualificada','Sin respuesta: agente de voz','Reunión agendada · recordatorios'][Math.min(3,Math.floor(Math.max(0,t-.35)/.65))]); $('l0').style.opacity=1; $('l0').style.transform='none'; }
    } else {
      // ── CAPTACIÓN (5-12 s): vuelve al principio; el anuncio de Meta entra en la ficha como primer estado
      [0,1,2,3,4].forEach(i=>paso(i,t,i===0?8.0:99,99)); $('etp').textContent='Nueva solicitud'; $('vet').textContent='En directo';
      const ad=$('ad'), a=nm(t,5.3,5.75), v=nm(t,7.5,8.05); ad.style.opacity=t<5.3?0:(v>=1?0:1); ad.style.transform=`translate(${lerp(0,-150,io(v))}px,${lerp(-70,150,io(v))+(1-expo(a))*-500}px) scale(${lerp(1,.16,io(v))*(1-.04*pico(nm(t,6.9,7.3)))}) rotate(${lerp(-4,0,expo(a))}deg)`; ad.style.filter=`blur(${(9*pico(v)+10*(1-nm(a,0,.6))).toFixed(1)}px)`;
      fi.style.transform=`translateY(${lerp(0,420,io(nm(t,5.2,5.7)))-lerp(0,420,io(v))}px)`;
      linea('l0',t,8.2,'q','Sistema','Solicitud recibida · anuncio «por las tardes»'); linea('l1',t,9.1,'q','Sistema','Curso: Marketing Digital · Nivel A');
    }
  } else {
    // ── AGENTE DE VOZ (23-32 s): misma ficha; la llamada es una conversación que avanza y cambia el estado
    titulo(t<27.2?'<span>¿Deja de responder?</span> <i><span>Entra el agente de voz.</span></i>':'<span>Retoma la conversación</span> <i><span>y la lleva a la reunión.</span></i>');
    $('tit').style.opacity=1; $('tit').style.filter='none'; fi.style.opacity=1; fi.style.transform='none';
    paso(0,t,0,0); paso(1,t,0,0); paso(2,t,24.6,31.0); paso(3,t,31.0,99); paso(4,t,99,99);
    $('etp').textContent=t<24.6?'Sin respuesta · 2 h':t<30.1?'Agente de voz':'Interesada en agendar'; $('etp').style.transform=`scale(${1+.12*pico(nm(t,30.1,30.5))+.12*pico(nm(t,24.6,25))})`;
    if(t<24.6){ $('vet').textContent='WhatsApp'; linea('l0',t,0,'','','¿Reservamos una llamada?'); const n=$('l1'); n.className='ln r'; n.innerHTML='<small>Laura</small>sin respuesta · 2 h'; n.style.background='#3D4148'; n.style.color='#F4F1EB'; pop(n,t,23.5); }
    else { $('l1').style.background=''; $('l1').style.color=''; $('vet').textContent='Llamada · en horario'; $('wv').style.opacity=1; [...$('wv').children].forEach((el,n)=>el.style.height=(10+26*Math.abs(Math.sin(t*9+n*.9)))+'px');
      linea('l0',t,25.0,'q','Raquel · asistente virtual','Hola, Laura. ¿Sigues interesada en el curso?'); linea('l1',t,27.6,'r','Laura','Sí, quería hablar con alguien.'); linea('l2',t,29.2,'q','Raquel','Perfecto, te ayudo a reservar una llamada.');
      $('pend').style.opacity=1; }
  }
};
window.setT(0);
</script>
</html>
'''
open(f'{A}/escena-v6-sb.html', 'w').write(cab + EXTRA + '</style>' + CUERPO); print('ok')
