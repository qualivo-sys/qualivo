/* Acciones de la ficha y del tablero en la DEMO (28-sep): lo mismo que el modo real
 * (generar mensaje, activar el agente de WhatsApp, llamada de Raquel en directo,
 * accesos de contacto y mover de etapa arrastrando), pero simulado: no sale nada
 * ni se toca ningún CRM. En modo real, todo esto lo hace real.js. */
(function () {
  'use strict';
  const QV = window.QV, M = QV.motor;
  const esc = function (s) { return QV.esc(s); };
  const E = function () { return QV.estado; };
  const esDemo = function () { return !(E().cfg && E().cfg.real); };

  function toast(txt) {
    let t = document.getElementById('toastDemo');
    if (!t) { t = document.createElement('div'); t.id = 'toastDemo'; t.className = 'toast-demo'; document.body.appendChild(t); }
    t.textContent = txt;
    t.classList.add('visible');
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove('visible'); }, 2600);
  }
  function cajaDe(el) { const b = el && el.closest && el.closest('[data-bloque-real]'); return b ? b.querySelector('.accion-real-caja') : null; }
  function pintar(box, html) { if (box) box.innerHTML = html; }
  function nombre(c) { return c ? c.n.split(' ')[0] : ''; }
  function refrescar(id) {
    M.evaluarTodos(E());
    if (!document.getElementById('ficha').hidden && E().fichaId === id) QV.abrirFicha(id); else QV.pintarTodo();
  }

  function borrador(box, c, modo) {
    const b = QV.copilot && QV.copilot.borrador ? QV.copilot.borrador(c) : { texto: 'Hola ' + nombre(c) + ', ¿cómo lo llevas?' };
    const agente = modo === 'agente';
    pintar(box, '<p class="nota-ar">' + esc(agente ? 'Así empezaría el agente. Al enviarlo, contesta solo a ' + nombre(c) + ' a partir de ahora y te avisa cuando haga falta una persona.' : 'Borrador del agente con su conversación y su siguiente acción. Edítalo si quieres.') + '</p>' +
      '<textarea class="ar-texto">' + esc(b.texto) + '</textarea><div class="fila">' +
      (agente ? '<button class="btn btn-mini btn-primario" type="button" data-real="agente-enviar" data-id="' + c.id + '">Enviar y activar el agente</button>'
              : '<button class="btn btn-mini btn-primario" type="button" data-real="enviar" data-id="' + c.id + '">Enviar por WhatsApp</button>') +
      '<button class="btn btn-mini" type="button" data-real="copiar">Copiar</button><button class="btn btn-mini" type="button" data-real="cerrar">Descartar</button></div>');
  }

  // Llamada simulada en directo: marcando → sonando → hablando → resultado
  function llamar(box, c) {
    const mmss = function (s) { return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
    const quien = esc(nombre(c));
    const T = E().cfg.t;
    const agenda = (c.x && c.x.int >= 45) || c.s.noshow;
    const pasos = [[1200, 'Marcando…'], [2400, 'Sonando…']];
    let i = 0;
    function vivo(txt) { pintar(box, '<p class="ok-ar"><span class="punto-vivo"></span>Raquel · ' + quien + ' · ' + txt + '</p><p class="nota-ar">Demo: la llamada es simulada. Con tus datos, Raquel llama de verdad y el resultado queda en tu CRM.</p>'); }
    function siguiente() {
      if (!box.isConnected) return;
      if (i < pasos.length) { vivo(pasos[i][1]); setTimeout(siguiente, pasos[i++][0]); return; }
      let s = 0;
      const h = setInterval(function () {
        if (!box.isConnected) { clearInterval(h); return; }
        s += 7; vivo('<b>Hablando</b> · ' + mmss(s));
        if (s >= 84) { clearInterval(h); fin(s); }
      }, 500);
    }
    function fin(seg) {
      const res = agenda ? 'agendo' : 'hablo';
      const resumen = agenda
        ? nombre(c) + ' ha cogido y confirma que sigue interesado en ' + (c.prod || 'lo que pidió') + '. ' + (c.s.noshow ? 'Se disculpa por no haber venido. ' : '') + 'Queda ' + (T.cita || 'la cita') + ' para el jueves a las 12:00 y le llega la confirmación por WhatsApp.'
        : nombre(c) + ' ha cogido. Le interesa ' + (c.prod || 'lo que pidió') + ', pero ahora no puede decidir. Pide que le escribamos por WhatsApp con la información y volver a hablar la semana que viene.';
      c.llamadas = (c.llamadas || []).concat([{ t: E().ahora, dur: seg, res: res, resumen: resumen, dijo: [] }]);
      pintar(box, '<p class="ok-ar">Llamada terminada · ' + mmss(seg) + ' · ' + (agenda ? 'Agendó' : 'Habló') + '</p><p class="nota-ar" style="margin-top:6px">' + esc(resumen) + '</p>' +
        '<div class="fila"><button class="btn btn-mini btn-primario" type="button" data-demo-refrescar="' + c.id + '">Verlo en la ficha</button><button class="btn btn-mini" type="button" data-real="cerrar">Cerrar</button></div>');
    }
    siguiente();
  }

  document.addEventListener('click', function (e) {
    if (!esDemo()) return;
    const enl = e.target.closest && e.target.closest('[data-demo-enlace]');
    if (enl) { e.preventDefault(); toast('En la demo no se abre. Con tus datos, abre el WhatsApp, la llamada, el correo o la ficha del CRM de esa persona.'); return; }
    const rf = e.target.closest && e.target.closest('[data-demo-refrescar]');
    if (rf) { e.preventDefault(); refrescar(rf.getAttribute('data-demo-refrescar')); return; }
    const b = e.target.closest && e.target.closest('[data-real]');
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    const accion = b.getAttribute('data-real'), id = b.getAttribute('data-id');
    const box = cajaDe(b);
    const c = id ? QV.contacto(id) : null;
    if (accion === 'cerrar') { pintar(box, ''); return; }
    if (accion === 'copiar') { const t = box && box.querySelector('.ar-texto'); if (t) { try { navigator.clipboard.writeText(t.value); b.textContent = 'Copiado'; } catch (err) { t.select(); } } return; }
    if (!c) return;
    if (accion === 'redactar' || accion === 'agente') {
      pintar(box, '<p class="nota-ar">Leyendo la conversación y redactando…</p>');
      setTimeout(function () { borrador(box, c, accion); }, 650);
      return;
    }
    if (accion === 'enviar' || accion === 'agente-enviar') {
      const t = box && box.querySelector('.ar-texto');
      const texto = t ? t.value.trim() : '';
      if (!texto) return;
      c.conv.push({ t: E().ahora, de: 'a', canal: 'wa', texto: texto });
      if (accion === 'agente-enviar') c.ev = (c.ev || []).concat([{ t: E().ahora, tipo: 'sistema', texto: 'Agente de WhatsApp activado: contesta solo a ' + nombre(c) }]);
      pintar(box, '<p class="ok-ar">' + (accion === 'enviar' ? 'Enviado por WhatsApp.' : 'Enviado y agente activado: a partir de ahora contesta solo.') + ' (Demo: no ha salido nada.)</p>' +
        '<div class="fila"><button class="btn btn-mini" type="button" data-demo-refrescar="' + c.id + '">Verlo en la conversación</button></div>');
      return;
    }
    if (accion === 'llamar') { llamar(box, c); }
  }, true);

  // Tablero de la demo: arrastrar una tarjeta a otra etapa
  let arrastrado = null;
  document.addEventListener('dragstart', function (e) {
    const t = e.target.closest && e.target.closest('[data-mover-demo]');
    if (!t) return;
    arrastrado = t.getAttribute('data-mover-demo');
    t.classList.add('arrastrando');
    try { e.dataTransfer.setData('text/plain', arrastrado); e.dataTransfer.effectAllowed = 'move'; } catch (err) { /* nada */ }
  });
  document.addEventListener('dragend', function (e) {
    const t = e.target.closest && e.target.closest('[data-mover-demo]');
    if (t) t.classList.remove('arrastrando');
    document.querySelectorAll('.columna.soltar').forEach(function (c) { c.classList.remove('soltar'); });
  });
  document.addEventListener('dragover', function (e) {
    const col = arrastrado && e.target.closest && e.target.closest('[data-etapa-demo]');
    if (!col) return;
    e.preventDefault();
    document.querySelectorAll('.columna.soltar').forEach(function (c) { if (c !== col) c.classList.remove('soltar'); });
    col.classList.add('soltar');
  });
  document.addEventListener('drop', function (e) {
    const col = arrastrado && e.target.closest && e.target.closest('[data-etapa-demo]');
    if (!col) return;
    e.preventDefault();
    const c = QV.contacto(arrastrado); arrastrado = null;
    if (!c) return;
    const idx = +col.getAttribute('data-etapa-demo');
    if (c.etapa === idx) return;
    c.etapa = idx; c.etapaTxt = '';
    M.evaluarTodos(E());
    QV.pintarTodo();
    toast(nombre(c) + ' pasa a «' + (E().cfg.recorrido[idx] || {}).txt + '». Con tus datos, se mueve también en tu CRM.');
  });
})();
