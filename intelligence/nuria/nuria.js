// Intelligence privado de Nuria Roure. Lee api/intelligence-nuria.js (solo lectura).
(function () {
  'use strict';
  var API = '/api/intelligence-nuria/';
  var $ = function (s) { return document.querySelector(s); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function num(n) { return Number(n || 0).toLocaleString('es-ES'); }
  function eur(n) { return Number(n || 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); }
  function pct(a, b) { return b ? Math.round(a * 100 / b) + ' %' : '—'; }
  var MADRID = { timeZone: 'Europe/Madrid' };
  function fechaHora(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString('es-ES', Object.assign({ weekday: 'short', day: 'numeric', month: 'short' }, MADRID)) + ' · ' +
      d.toLocaleTimeString('es-ES', Object.assign({ hour: '2-digit', minute: '2-digit' }, MADRID));
  }
  function diaCorto(ymd) {
    var d = new Date(ymd + 'T12:00:00Z');
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
  }

  function mostrarAcceso(msg) {
    $('#panel').hidden = true;
    $('#acceso').hidden = false;
    $('#claveError').textContent = msg || '';
    $('#clave').focus();
  }

  $('#formAcceso').addEventListener('submit', function (e) {
    e.preventDefault();
    var b = $('#entrar');
    b.disabled = true; b.textContent = 'Entrando…';
    fetch(API + '?accion=entrar', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clave: $('#clave').value }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        b.disabled = false; b.textContent = 'Entrar';
        if (!x.ok) { $('#claveError').textContent = x.d.error || 'No se ha podido entrar.'; return; }
        $('#clave').value = '';
        cargar(false);
      })
      .catch(function () { b.disabled = false; b.textContent = 'Entrar'; $('#claveError').textContent = 'Sin conexión. Prueba otra vez.'; });
  });

  $('#salir').addEventListener('click', function () {
    fetch(API + '?accion=salir', { method: 'POST', credentials: 'same-origin' }).finally(function () { mostrarAcceso(''); });
  });
  $('#actualizar').addEventListener('click', function () { cargar(true); });

  function cargar(fresco) {
    var bt = $('#actualizar');
    bt.disabled = true;
    fetch(API + (fresco ? '?fresco=1' : ''), { credentials: 'same-origin' })
      .then(function (r) { return r.json().then(function (d) { return { st: r.status, d: d }; }); })
      .then(function (x) {
        bt.disabled = false;
        if (x.st === 401) return mostrarAcceso('');
        $('#acceso').hidden = true;
        $('#panel').hidden = false;
        if (x.st !== 200) { $('#contenido').innerHTML = '<p class="aviso">' + esc(x.d.error || 'No se han podido leer los datos.') + '</p>'; return; }
        pintar(x.d);
      })
      .catch(function () { bt.disabled = false; $('#contenido').innerHTML = '<p class="aviso">Sin conexión. Prueba otra vez.</p>'; });
  }

  function cuentaAtras(iso) {
    var ms = Date.parse(iso) - Date.now();
    if (ms <= 0) return ms > -75 * 60000 ? '<strong>En directo ahora</strong>' : '<strong>Clase terminada</strong><span>Ahora toca agendar llamadas.</span>';
    var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5);
    return '<strong>' + (d ? d + ' d ' : '') + h + ' h</strong><span>para el directo</span>';
  }

  function kpi(titulo, valor, nota, clase) {
    return '<div class="kpi' + (clase ? ' ' + clase : '') + '"><span>' + esc(titulo) + '</span><strong>' + valor + '</strong><em>' + (nota || '&nbsp;') + '</em></div>';
  }

  function pintar(d) {
    var r = d.resumen, h = '';
    h += '<div class="nr-cuenta">' + cuentaAtras(d.directo) +
      '<span>' + num(r.inscritas) + ' personas inscritas · ' + num(r.hoy) + ' hoy · ' + num(r.ayer) + ' ayer</span></div>';

    if (r.porAtender) {
      h += '<p class="aviso"><b>' + num(r.porAtender) + ' ' + (r.porAtender === 1 ? 'persona espera' : 'personas esperan') +
        ' respuesta del equipo por WhatsApp.</b> En GHL, contactos con la etiqueta «atender · persona».</p>';
    }

    h += '<div class="kpis">' +
      kpi('Inscritas', num(r.inscritas), num(r.hoy) + ' hoy', 'destacado') +
      kpi('Email de confirmación', num(r.emailConfirmacion), pct(r.emailConfirmacion, r.inscritas) + ' de las inscritas') +
      kpi('WhatsApp de bienvenida', num(r.whatsappBienvenida), num(r.conMovil) + ' con móvil') +
      kpi('Llamadas agendadas', num(d.citas ? d.citas.length : 0), d.citas ? 'en el calendario' : 'sin datos del calendario') +
      kpi('Ventas', num(r.ventas), r.facturado ? eur(r.facturado) : 'todavía no', r.ventas ? 'destacado' : '') +
      '</div>';

    // Embudo
    var max = Math.max.apply(null, d.embudo.map(function (p) { return p.personas; }).concat([1]));
    var emb = d.embudo.map(function (p, i) {
      var ant = i ? d.embudo[i - 1].personas : 0;
      return '<div class="paso"><div>' + esc(p.paso) + (i && ant ? '<small>' + pct(p.personas, ant) + ' del paso anterior</small>' : '') + '</div>' +
        '<div class="pista"><div class="lleno" style="width:' + Math.round(p.personas * 100 / max) + '%"></div></div><b>' + num(p.personas) + '</b></div>';
    }).join('');
    if (d.perdidas) emb += '<p class="vacio">' + num(d.perdidas) + ' marcadas como perdidas.</p>';

    // Por día
    var maxD = Math.max.apply(null, d.porDia.map(function (x) { return x.personas; }).concat([1]));
    var dias = d.porDia.slice(-10).map(function (x) {
      return '<div class="dia"><b>' + num(x.personas) + '</b><div class="col" style="height:' + Math.round(x.personas * 110 / maxD) + 'px"></div><span>' + esc(diaCorto(x.dia)) + '</span></div>';
    }).join('');

    h += '<div class="nr-rejilla">' +
      '<section class="tarjeta"><h3>Del registro a la venta</h3>' + emb + '</section>' +
      '<section class="tarjeta"><h3>Inscripciones por día</h3>' + (dias ? '<div class="dias">' + dias + '</div>' : '<p class="vacio">Todavía no hay inscripciones.</p>') + '</section>' +
      '</div>';

    // Llamadas
    var closers = (d.porCloser || []).map(function (c) {
      return '<tr><td>' + esc(c.closer) + '</td><td class="num">' + num(c.total) + '</td><td class="num">' + num(c.presentadas) + '</td><td class="num">' + num(c.noPresentadas) + '</td></tr>';
    }).join('');
    var ahora = Date.now();
    var prox = (d.citas || []).filter(function (c) { return Date.parse(c.cuando) > ahora - 3600000; }).slice(0, 15).map(function (c) {
      var est = c.estado === 'confirmed' ? '<span class="pill ok">Confirmada</span>' : c.estado === 'showed' ? '<span class="pill ok">Hecha</span>' : c.estado === 'noshow' ? '<span class="pill mal">No vino</span>' : c.estado === 'cancelled' ? '<span class="pill mal">Cancelada</span>' : '<span class="pill">Reservada</span>';
      return '<tr><td>' + esc(fechaHora(c.cuando)) + '</td><td>' + esc(c.quien) + '</td><td>' + esc(c.closer) + '</td><td>' + est + '</td></tr>';
    }).join('');
    h += '<div class="nr-rejilla">' +
      '<section class="tarjeta"><h3>Próximas llamadas</h3>' + (d.citas === null ? '<p class="vacio">No se ha podido leer el calendario.</p>' : prox ? '<table class="nr-tabla"><thead><tr><th>Cuándo</th><th>Persona</th><th>Closer</th><th>Estado</th></tr></thead><tbody>' + prox + '</tbody></table>' : '<p class="vacio">Todavía no hay llamadas agendadas. Se abren después del directo.</p>') + '</section>' +
      '<section class="tarjeta"><h3>Llamadas por closer</h3>' + (closers ? '<table class="nr-tabla"><thead><tr><th>Closer</th><th style="text-align:right">Total</th><th style="text-align:right">Hechas</th><th style="text-align:right">No vino</th></tr></thead><tbody>' + closers + '</tbody></table>' : '<p class="vacio">Sin llamadas todavía.</p>') + '</section>' +
      '</div>';

    h += '<p class="pie">Datos de GHL, actualizados ' + esc(new Date(d.actualizado).toLocaleTimeString('es-ES', Object.assign({ hour: '2-digit', minute: '2-digit' }, MADRID))) +
      '. Solo lectura. No se muestran correos, teléfonos ni datos de salud. Las personas excluidas de los envíos no cuentan.</p>';
    $('#contenido').innerHTML = h;
  }

  cargar(false);
})();
