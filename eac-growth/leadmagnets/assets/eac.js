/* EAC · Motor compartido de imanes de leads (Qualivo)
   - Ejecuta el test paso a paso
   - Calcula la puntuación del lead (modelo Fase 5)
   - Captura el contacto y lo envía a /api/lead
*/
(function(){
const $ = (s,r)=> (r||document).querySelector(s);
const $$= (s,r)=> Array.from((r||document).querySelectorAll(s));

/* ── puntuación de leads · modelo Fase 5 ───────────────── */
function score(d){
  var s=0, reasons=[];
  s+=20; reasons.push('Origen: imán de leads (+20)');                 // siempre viene del blog
  if(d.curso && d.curso!=='General'){s+=10;reasons.push('Curso concreto (+10)');}
  else {s+=4;reasons.push('Interés general (+4)');}
  var pl={'<3':20,'3-6':10,'>6':3}[d.plazo]; if(pl){s+=pl;reasons.push('Plazo declarado (+'+pl+')');}
  ['edad','eso','ingles','nadar'].forEach(function(k){ if(d[k]===true){s+=5;reasons.push('Requisito '+k+' (+5)');} });
  if(d.telefono && d.telefono.replace(/\D/g,'').length>=9){s+=8;reasons.push('Teléfono válido (+8)');}
  if(d.provincia==='bcn'){s+=4;reasons.push('Área de Barcelona (+4)');}
  if(d.email && !/@(mailinator|tempmail|guerrilla|yopmail|10minutemail)/i.test(d.email)){s+=3;reasons.push('Email personal (+3)');}
  if(d.menor===true){s-=20;reasons.push('Menor de 18 (−20)');}
  s=Math.max(0,Math.min(100,s));
  var tag = s>=70?'CALIENTE' : s>=45?'TEMPLADO' : s>=25?'TIBIO' : 'FRÍO';
  return {score:s, tag:tag, reasons:reasons};
}

/* ── envío al CRM ──────────────────────────────────────── */
async function send(payload){
  payload.magnet   = window.EAC_MAGNET || 'desconocido';
  payload.url      = location.href;
  payload.utm      = location.search || '';
  payload.scored   = score(payload);
  try{
    var r = await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    return await r.json();
  }catch(e){ return {ok:false,error:'network'}; }
}

/* ── motor de test ─────────────────────────────────────── */
function Quiz(cfg){
  var i=0, answers=[], root=$('#quiz'), prog=$('.prog i')||$('#prog i'), step=$('#pstep');
  if(!root){ console.error('EAC.Quiz: falta el contenedor #quiz'); return; }
  function setProg(pctv, txt){ if(prog) prog.style.width=pctv+'%'; if(step) step.textContent=txt; }
  function render(){
    var q=cfg.questions[i];
    setProg(i/cfg.questions.length*100, 'Pregunta '+(i+1)+' de '+cfg.questions.length);
    root.innerHTML='';
    var w=document.createElement('div'); w.className='q';
    var h=document.createElement('div'); h.className='qt'; h.textContent=q.t; w.appendChild(h);
    if(q.h){var p=document.createElement('div');p.className='qh';p.textContent=q.h;w.appendChild(p);}
    var o=document.createElement('div'); o.className='opts';
    q.opts.forEach(function(opt,n){
      var b=document.createElement('button');
      b.type='button'; b.className='opt';
      b.innerHTML='<span class="mk">'+String.fromCharCode(65+n)+'</span><span>'+opt.t+'</span>';
      b.onclick=function(){
        answers[i]=opt;
        b.classList.add('sel');
        setTimeout(function(){ i++; if(i<cfg.questions.length) render(); else finish(); },160);
      };
      o.appendChild(b);
    });
    w.appendChild(o);
    if(i>0){
      var bk=document.createElement('button'); bk.type='button'; bk.className='back';
      bk.textContent='← Volver a la anterior'; bk.onclick=function(){ i--; render(); };
      w.appendChild(bk);
    }
    root.appendChild(w);
    var f=w.querySelector('.opt'); if(f) f.focus({preventScroll:true});
  }
  function finish(){
    setProg(100,'Test completado');
    cfg.onFinish(answers);
  }
  render();
}

/* ── formulario de captura ─────────────────────────────── */
function gate(container, opts){
  container.innerHTML =
   '<div class="gate">'
  +'  <h2>'+(opts.title||'Tu resultado está listo')+'</h2>'
  +'  <p class="small" style="margin-bottom:18px">'+(opts.sub||'Déjanos dónde enviártelo y lo recibes ahora mismo.')+'</p>'
  +'  <div class="why">'+(opts.why||'Te enviamos el informe completo por email y, si lo pides, te llamamos para resolver dudas concretas.')+'</div>'
  +'  <form id="lf" novalidate>'
  +'    <div class="grid2">'
  +'      <div class="field"><label for="n">Nombre</label><input id="n" name="nombre" type="text" autocomplete="given-name" required></div>'
  +'      <div class="field"><label for="e">Email</label><input id="e" name="email" type="email" autocomplete="email" required></div>'
  +'    </div>'
  +'    <div class="grid2">'
  +'      <div class="field"><label for="t">Teléfono</label><input id="t" name="telefono" type="tel" autocomplete="tel" required></div>'
  +'      <div class="field"><label for="p">¿Cuándo te gustaría empezar?</label>'
  +'        <select id="p" name="plazo" required>'
  +'          <option value="">Elige una opción</option>'
  +'          <option value="&lt;3">En los próximos 3 meses</option>'
  +'          <option value="3-6">Dentro de 3 a 6 meses</option>'
  +'          <option value="&gt;6">Más adelante / lo estoy mirando</option>'
  +'        </select></div>'
  +'    </div>'
  +'    <div class="field"><label for="pr">¿Desde dónde nos escribes?</label>'
  +'      <select id="pr" name="provincia">'
  +'        <option value="">Elige una opción</option>'
  +'        <option value="bcn">Barcelona y área metropolitana</option>'
  +'        <option value="cat">Resto de Cataluña</option>'
  +'        <option value="es">Resto de España</option>'
  +'        <option value="int">Fuera de España</option>'
  +'      </select></div>'
  +'    <div class="err" id="er">Revisa el nombre, el email, el teléfono y el plazo.</div>'
  +'    <button class="btn" type="submit" id="sb">'+(opts.cta||'Ver mi resultado completo')+'</button>'
  +'    <p class="consent">Al enviar aceptas que la Escola Aeronàutica de Catalunya te contacte sobre su formación. '
  +'    Puedes darte de baja cuando quieras. No compartimos tus datos con terceros.</p>'
  +'  </form>'
  +'</div>';

  $('#lf').addEventListener('submit', async function(ev){
    ev.preventDefault();
    var f=ev.target, er=$('#er'), sb=$('#sb');
    var d={ nombre:f.nombre.value.trim(), email:f.email.value.trim(), telefono:f.telefono.value.trim(),
            plazo:f.plazo.value, provincia:f.provincia.value };
    var ok = d.nombre.length>1 && /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(d.email)
             && d.telefono.replace(/\D/g,'').length>=9 && d.plazo;
    if(!ok){ er.classList.add('on'); return; }
    er.classList.remove('on'); sb.disabled=true; sb.textContent='Enviando…';
    Object.assign(d, opts.extra||{});
    var res = await send(d);
    opts.onDone(d, res);
  });
}

window.EAC = { Quiz:Quiz, gate:gate, score:score, send:send, $:$, $$:$$ };
})();
