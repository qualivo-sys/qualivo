/* Auditor Conversacional — agentforme.io. Chat multi-turno contra
   api/auditor (que llama a Claude). El historial vive en el navegador y se
   envía entero en cada turno. Cuando el agente marca pedirContacto, se pinta
   el formulario y el contacto se registra en api/afm-lead (fuente 'auditor'). */
(function () {
  'use strict';

  var log = document.getElementById('au-log');
  var typing = document.getElementById('au-typing');
  var chips = document.getElementById('au-chips');
  var input = document.getElementById('au-input');
  var send = document.getElementById('au-send');
  var hp = document.getElementById('au-hp');
  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  var historial = [];        // [{rol:'usuario'|'agente', texto}]
  var ocupado = false;
  var cerrado = false;
  var leadPintado = false;
  var leadEnviado = false;

  var esc = function (s) {
    return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
  };

  var abajo = function () { log.scrollTop = log.scrollHeight; };

  var burbuja = function (rol, texto) {
    var d = document.createElement('div');
    d.className = 'au-msg ' + rol;
    d.textContent = texto;
    log.appendChild(d);
    abajo();
  };

  var pintaReparto = function (r) {
    var horas = '';
    if (typeof r.horasSemana === 'number') {
      horas = '<div class="au-card-top"><div class="au-horas">' + esc(String(r.horasSemana).replace('.', ',')) + ' h/semana</div>' +
        '<div class="au-horas-l">que dejaría de hacer tu equipo (calculado con tus datos)</div></div>';
    }
    var d = document.createElement('div');
    d.className = 'au-card';
    d.innerHTML = horas +
      '<div class="au-card-cols">' +
        '<div class="au-card-col hum"><div class="au-kick">Sigue siendo humano</div>' +
          r.humano.map(function (h) { return '<div class="au-li">' + esc(h) + '</div>'; }).join('') + '</div>' +
        '<div class="au-card-col ia"><div class="au-kick">Lo haría el empleado digital</div>' +
          r.empleadoIA.map(function (h) { return '<div class="au-li">' + esc(h) + '</div>'; }).join('') + '</div>' +
      '</div>' +
      '<div class="au-card-note">Reparto orientativo hecho en vivo a partir de lo que has contado. El diagnóstico de verdad se hace mirando el proceso real.</div>';
    log.appendChild(d);
    abajo();
  };

  var resumenLead = function () {
    var partes = [];
    for (var i = 0; i < historial.length; i++) {
      partes.push((historial[i].rol === 'usuario' ? 'Visitante: ' : 'Agente: ') + historial[i].texto);
    }
    return partes.join('\n').slice(0, 2000);
  };

  var pintaLead = function () {
    if (leadPintado) return;
    leadPintado = true;
    var d = document.createElement('div');
    d.className = 'au-lead';
    d.innerHTML =
      '<div class="au-lead-t">Deja tus datos y seguimos con el proceso real delante.</div>' +
      '<div class="au-lead-grid">' +
        '<input id="au-nombre" placeholder="Nombre">' +
        '<input id="au-empresa" placeholder="Empresa">' +
        '<input id="au-email" type="email" placeholder="Email">' +
        '<button id="au-lead-btn" class="btn" type="button">Quiero la llamada →</button>' +
      '</div>' +
      '<div class="au-lead-err" id="au-lead-err"></div>';
    log.appendChild(d);
    abajo();
    document.getElementById('au-lead-btn').addEventListener('click', function () {
      if (leadEnviado) return;
      var nombre = document.getElementById('au-nombre').value.trim();
      var empresa = document.getElementById('au-empresa').value.trim();
      var email = document.getElementById('au-email').value.trim();
      var errEl = document.getElementById('au-lead-err');
      errEl.style.display = 'none';
      if (!nombre || !empresa || !EMAIL_RE.test(email)) {
        errEl.textContent = 'Necesitamos nombre, empresa y un email válido.';
        errEl.style.display = 'block';
        return;
      }
      var btn = document.getElementById('au-lead-btn');
      btn.disabled = true;
      btn.textContent = 'Enviando…';
      var primero = '';
      for (var i = 0; i < historial.length; i++) {
        if (historial[i].rol === 'usuario') { primero = historial[i].texto; break; }
      }
      fetch('/api/afm-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre, empresa: empresa, email: email,
          fuente: 'auditor', input: primero.slice(0, 600), resumen: resumenLead(),
          website: hp.value
        })
      })
        .then(function (r) { if (!r.ok) throw new Error('server'); return r.json(); })
        .then(function () {
          leadEnviado = true;
          d.innerHTML = '<div class="au-lead-t">Hecho. Te escribimos en menos de un día laborable — y la conversación de aquí ya la tenemos, no te haremos repetirla.</div>';
          abajo();
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = 'Quiero la llamada →';
          errEl.textContent = 'No se ha podido enviar. Prueba otra vez.';
          errEl.style.display = 'block';
        });
    });
  };

  var termina = function (texto) {
    cerrado = true;
    input.disabled = true;
    send.disabled = true;
    input.placeholder = texto || 'Conversación terminada.';
  };

  var envia = function (texto) {
    texto = String(texto || '').trim();
    if (!texto || ocupado || cerrado) return;
    if (texto.length > 600) texto = texto.slice(0, 600);
    chips.innerHTML = '';
    burbuja('usuario', texto);
    historial.push({ rol: 'usuario', texto: texto });
    input.value = '';
    ocupado = true;
    send.disabled = true;
    typing.style.display = 'block';
    log.appendChild(typing);
    abajo();

    fetch('/api/auditor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensajes: historial, website: hp.value })
    })
      .then(function (r) { return r.json().then(function (d) { return { status: r.status, body: d }; }); })
      .then(function (res) {
        if (res.status !== 200 || !res.body || res.body.ok === false || !res.body.respuesta) throw new Error('server');
        var b = res.body;
        burbuja('agente', b.respuesta);
        historial.push({ rol: 'agente', texto: b.respuesta });
        if (b.reparto) pintaReparto(b.reparto);
        if (b.pedirContacto) pintaLead();
        if (b.fin || b.quedan === 0) termina('Hemos llegado al tope de la charla — deja tus datos arriba y seguimos en persona.');
      })
      .catch(function () {
        burbuja('agente', 'Se me ha cruzado un cable un segundo. Repítemelo, por favor.');
        historial.pop();   // el turno no cuenta: que pueda reintentar sin quemar mensajes
      })
      .then(function () {
        ocupado = false;
        typing.style.display = 'none';
        if (!cerrado) { send.disabled = false; input.focus(); }
      });
  };

  // Arranque: saludo fijo (sin coste) + tres arrancadores de ejemplo.
  burbuja('agente', 'Hola. Soy un empleado digital de Agent for Me — y sí, esto que estás viendo es exactamente lo que vendemos. Dime a qué se dedica tu empresa y qué tarea repetitiva le está robando tiempo a tu equipo, y te digo qué parte podría quitarse de encima.');
  historial.push({ rol: 'agente', texto: 'Hola. Soy un empleado digital de Agent for Me. Dime a qué se dedica tu empresa y qué tarea repetitiva le está robando tiempo a tu equipo, y te digo qué parte podría quitarse de encima.' });

  [
    'Perdemos horas pasando pedidos del email al programa de gestión',
    'Mi comercial no llega a responder a todos los que piden presupuesto',
    'Cada mes tardamos días en perseguir facturas impagadas'
  ].forEach(function (t) {
    var c = document.createElement('button');
    c.className = 'au-chip';
    c.type = 'button';
    c.textContent = t;
    c.addEventListener('click', function () { envia(t); });
    chips.appendChild(c);
  });

  send.addEventListener('click', function () { envia(input.value); });
  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      ev.preventDefault();
      envia(input.value);
    }
  });
})();
