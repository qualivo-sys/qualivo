/* Prospección (8-oct): solo en el modo real. Las cuentas que prepara la sesión de outbound
 * (pestaña «Prospección» del Sheet) y las campañas de Smartlead. Desde aquí Maikel aprueba,
 * descarta o elige versión, y crea campañas EN BORRADOR con las cuentas aprobadas.
 * Ningún dato vive en este archivo: todo llega de /api/intelligence-datos con la sesión. */
(function () {
  'use strict';
  const QV = window.QV;
  const esc = function (s) { return QV.esc(s); };
  const API = '/api/intelligence-datos/';
  let datos = null, error = '', cargando = false, ocupado = false;
  const ui = { filtro: 'propuesta', abierta: null, sel: {} };
  const ORDEN = ['propuesta', 'aprobada', 'en campaña', 'respondió', 'reunión', 'descartada'];
  const TXT = { propuesta: 'Pendientes de tu ok', aprobada: 'Aprobadas', 'en campaña': 'En campaña', 'respondió': 'Respondieron', 'reunión': 'Reunión', descartada: 'Descartadas' };

  function pinta() { if (QV.estado.vista === 'prospeccion') QV.pintarVista(); }
  function cargar() {
    if (cargando) return;
    cargando = true; error = '';
    fetch(API + '?accion=prospeccion', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; }); })
      .then(function (d) { datos = d; })
      .catch(function (e) { error = e.message || String(e); })
      .then(function () { cargando = false; pinta(); });
  }
  function enviar(accion, cuerpo) {
    ocupado = true; pinta();
    return fetch(API + '?accion=' + accion, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; }); })
      .finally(function () { ocupado = false; });
  }

  function cuenta(c) {
    const abierta = ui.abierta === c.fila;
    const v = c.version || 'A';
    const msg = function (l) {
      const a = c['asunto_' + l.toLowerCase()], m = c['mensaje_' + l.toLowerCase()];
      if (!a && !m) return '';
      return '<div class="pr-msg' + (v === l ? ' elegido' : '') + '"><div class="pr-msg-cab"><b>Versión ' + l + '</b>' +
        (c.estado === 'propuesta' || c.estado === 'aprobada' ? '<button class="btn btn-mini' + (v === l ? ' btn-primario' : '') + '" type="button" data-pr-version="' + l + '" data-fila="' + c.fila + '">' + (v === l ? 'Elegida' : 'Elegir ' + l) + '</button>' : '') + '</div>' +
        (a ? '<p class="pr-asunto">' + esc(a) + '</p>' : '') + '<p class="pr-cuerpo">' + esc(m) + '</p></div>';
    };
    const sel = c.estado === 'aprobada' && /@/.test(c.email);
    return '<div class="pr-cuenta' + (abierta ? ' abierta' : '') + '">' +
      '<div class="pr-fila" data-pr-abrir="' + c.fila + '">' +
        (sel ? '<input type="checkbox" class="pr-check" data-pr-sel="' + c.fila + '"' + (ui.sel[c.fila] ? ' checked' : '') + ' aria-label="Elegir para la campaña">' : '<span class="pr-check-vacio"></span>') +
        '<div style="min-width:0"><div class="nombre">' + esc(c.empresa || '—') + (c.sector ? ' <span class="pr-tag">' + esc(c.sector) + '</span>' : '') + '</div>' +
        '<div class="meta">' + esc([c.decisor, c.cargo].filter(Boolean).join(' · ') || 'sin decisor') + (c.tamano ? ' · ' + esc(c.tamano) : '') + '</div></div>' +
        '<div class="pr-senal">' + esc(c.senal || '') + '</div>' +
        '<span class="pr-estado e-' + esc(c.estado.replace(/\s/g, '-')) + '">' + esc(c.estado) + (c.campana ? ' · ' + esc(c.campana) : '') + '</span>' +
      '</div>' +
      (abierta ? '<div class="pr-detalle">' +
        '<div class="pr-datos">' + [['Web', c.web], ['Correo', c.email || 'sin correo: no puede ir a Smartlead'], ['LinkedIn', c.linkedin], ['Nota', c.nota], ['Actualizado', c.actualizado]].filter(function (x) { return x[1]; }).map(function (x) { return '<span>' + esc(x[0]) + ': <b>' + esc(x[1]) + '</b></span>'; }).join('') + '</div>' +
        '<div class="pr-msgs">' + msg('A') + msg('B') + '</div>' +
        '<div class="pr-acciones">' +
          (c.estado !== 'aprobada' && ['propuesta', 'descartada'].indexOf(c.estado) >= 0 ? '<button class="btn btn-mini btn-verde" type="button" data-pr-estado="aprobada" data-fila="' + c.fila + '">Aprobar</button>' : '') +
          (c.estado === 'propuesta' || c.estado === 'aprobada' ? '<button class="btn btn-mini" type="button" data-pr-estado="descartada" data-fila="' + c.fila + '">Descartar</button>' : '') +
          (c.estado === 'aprobada' ? '<button class="btn btn-mini btn-fantasma" type="button" data-pr-estado="propuesta" data-fila="' + c.fila + '">Volver a pendiente</button>' : '') +
          (c.estado === 'en campaña' ? '<button class="btn btn-mini" type="button" data-pr-estado="respondió" data-fila="' + c.fila + '">Ha respondido</button>' : '') +
          (c.estado === 'respondió' ? '<button class="btn btn-mini btn-verde" type="button" data-pr-estado="reunión" data-fila="' + c.fila + '">Tiene reunión</button>' : '') +
        '</div></div>' : '') +
      '</div>';
  }

  function vista() {
    const cab = QV.cabecera('Prospección', '¿Qué cuentas trabajamos esta semana?', 'Las cuentas que prepara la sesión de outbound, con su señal y su mensaje. Las apruebas aquí y, con las aprobadas, creas la campaña en Smartlead. Se crea en borrador: no sale nada hasta que la actives tú en Smartlead.');
    if (!(QV.estado.cfg && QV.estado.cfg.real)) return cab + '<div class="tarjeta"><p class="gris">La prospección solo se ve con tus datos reales.</p></div>';
    if (!datos && !error) { cargar(); return cab + '<div class="tarjeta"><p class="vacio">Leyendo la pestaña de prospección y Smartlead…</p></div>'; }
    if (error && !datos) return cab + '<div class="tarjeta"><p class="vacio">' + esc(error) + '</p><button class="btn btn-mini" type="button" data-pr="recargar">Reintentar</button></div>';
    const D = datos;
    const avisos = (D.avisos || []).map(function (a) { return '<p class="inf-aviso">' + esc(a) + '</p>'; }).join('') +
      (D.sinClaveSmartlead ? '<p class="inf-aviso">Falta la clave de Smartlead en Vercel (smartlead_KEY).</p>' : '');
    if (D.faltaPestana) {
      return cab + avisos + '<div class="tarjeta"><h3>Falta la pestaña «' + esc(D.pestana) + '» en el Sheet</h3><p class="gris" style="margin-top:6px">Créala (o pídeselo a la sesión de outbound) con estas columnas en la fila 1, en este orden:</p><p style="margin-top:8px;font-family:monospace;font-size:12px;word-break:break-word">' + esc(D.columnas.join(' | ')) + '</p></div>';
    }
    const cs = D.cuentas;
    const n = function (e) { return cs.filter(function (c) { return c.estado === e; }).length; };
    const kp = function (l, v, em) { return '<div class="kpi"><span>' + esc(l) + '</span><strong>' + v + '</strong><em>' + esc(em || '') + '</em></div>'; };
    const kpis = '<div class="kpis pr-kpis">' + kp('Pendientes de tu ok', n('propuesta'), 'esperan aprobación') + kp('Aprobadas', n('aprobada'), 'listas para campaña') + kp('En campaña', n('en campaña'), '') + kp('Respondieron', n('respondió'), '') + kp('Reuniones', n('reunión'), 'de outbound') + '</div>';
    const filtros = '<div class="inf-ctrl">' + ORDEN.map(function (e) { return '<button type="button" class="btn btn-mini' + (ui.filtro === e ? ' btn-primario' : '') + '" data-pr-filtro="' + esc(e) + '">' + esc(TXT[e]) + ' <small>' + n(e) + '</small></button>'; }).join('') +
      '<button type="button" class="btn btn-mini' + (ui.filtro === 'todas' ? ' btn-primario' : '') + '" data-pr-filtro="todas">Todas <small>' + cs.length + '</small></button>' +
      '<button class="btn btn-mini btn-fantasma" type="button" data-pr="recargar">' + (cargando ? 'Leyendo…' : 'Actualizar') + '</button></div>';
    const lista = cs.filter(function (c) { return ui.filtro === 'todas' || c.estado === ui.filtro; });
    const elegidas = Object.keys(ui.sel).filter(function (k) { return ui.sel[k]; });
    const crear = ui.filtro === 'aprobada' || elegidas.length ? '<div class="tarjeta pr-crear"><h3>Crear campaña en Smartlead <span class="sub">en borrador, sin enviar nada</span></h3>' +
      '<div class="pr-crear-fila"><input class="select" id="prNombre" placeholder="Nombre de la campaña (p. ej. Formación · semana 41)" maxlength="90">' +
      '<button class="btn btn-primario" type="button" data-pr="crear"' + (elegidas.length && !ocupado && !D.sinClaveSmartlead ? '' : ' disabled') + '>' + (ocupado ? 'Creando…' : 'Crear con ' + elegidas.length + (elegidas.length === 1 ? ' cuenta' : ' cuentas')) + '</button></div>' +
      '<p class="gris" style="margin-top:6px">Marca las cuentas aprobadas que quieras meter. Cada una va con su asunto y su mensaje (la versión elegida). Después, en Smartlead, le asignas el buzón y la activas.</p></div>' : '';
    const campanas = '<div class="tarjeta" style="margin-top:14px"><h3>Campañas en Smartlead <span class="sub">' + D.campanas.length + '</span></h3>' +
      (D.campanas.length ? '<div class="tabla-caja" style="margin-top:10px;border:0"><table class="tabla"><thead><tr><th>Campaña</th><th>Estado</th><th class="num">Leads</th><th class="num">Enviados</th><th class="num">Abiertos</th><th class="num">Respuestas</th><th class="num">Rebotes</th></tr></thead><tbody>' +
        D.campanas.map(function (c) { return '<tr><td><a href="https://app.smartlead.ai/app/email-campaign/' + encodeURIComponent(c.id) + '/analytics" target="_blank" rel="noopener">' + esc(c.nombre) + '</a></td><td>' + esc(c.estado) + '</td><td class="num">' + c.leads + '</td><td class="num">' + c.enviados + '</td><td class="num">' + c.abiertos + '</td><td class="num"><b>' + c.respuestas + '</b></td><td class="num">' + c.rebotes + '</td></tr>'; }).join('') +
        '</tbody></table></div>' : '<p class="vacio">' + (D.sinClaveSmartlead ? 'Sin clave de Smartlead.' : 'No hay campañas todavía.') + '</p>') + '</div>';
    return cab + avisos + kpis + filtros + crear +
      '<div class="tarjeta pr-lista">' + (lista.map(cuenta).join('') || '<p class="vacio">No hay cuentas en «' + esc(TXT[ui.filtro] || 'todas') + '».</p>') + '</div>' +
      campanas + '<p class="gris inf-nota">Las cuentas salen de la pestaña «' + esc(D.pestana) + '» del Sheet, que escribe la sesión de outbound. Lo que cambias aquí se guarda en esa pestaña.</p>';
  }

  document.addEventListener('click', function (e) {
    const t = e.target.closest && e.target.closest('[data-pr],[data-pr-filtro],[data-pr-abrir],[data-pr-estado],[data-pr-version],[data-pr-sel]');
    if (!t) return;
    if (t.hasAttribute('data-pr-sel')) { e.stopPropagation(); ui.sel[t.dataset.prSel] = t.checked; pinta(); return; }
    if (t.dataset.prFiltro) { ui.filtro = t.dataset.prFiltro; ui.abierta = null; pinta(); return; }
    if (t.dataset.prAbrir) { const f = +t.dataset.prAbrir; ui.abierta = ui.abierta === f ? null : f; pinta(); return; }
    if (t.dataset.prEstado || t.dataset.prVersion) {
      const cuerpo = { fila: +t.dataset.fila };
      if (t.dataset.prEstado) cuerpo.estado = t.dataset.prEstado; else cuerpo.version = t.dataset.prVersion;
      enviar('prospeccion-marcar', cuerpo).then(function () {
        const c = datos.cuentas.filter(function (x) { return x.fila === cuerpo.fila; })[0];
        if (c) { if (cuerpo.estado) c.estado = cuerpo.estado; if (cuerpo.version) c.version = cuerpo.version; }
        if (cuerpo.estado && cuerpo.estado !== 'aprobada') delete ui.sel[cuerpo.fila];
        QV.aviso(cuerpo.estado ? 'Guardado: ' + cuerpo.estado : 'Versión ' + cuerpo.version + ' elegida');
      }).catch(function (err) { QV.aviso(err.message, 'alerta'); }).then(pinta);
      return;
    }
    if (t.dataset.pr === 'recargar') { datos = null; error = ''; cargar(); pinta(); return; }
    if (t.dataset.pr === 'crear') {
      const nombre = (document.getElementById('prNombre') || {}).value || '';
      const filas = Object.keys(ui.sel).filter(function (k) { return ui.sel[k]; }).map(Number);
      if (!nombre.trim()) { QV.aviso('Ponle nombre a la campaña', 'alerta'); return; }
      if (!window.confirm('¿Crear «' + nombre.trim() + '» en Smartlead con ' + filas.length + ' cuentas? Se crea en borrador: no se envía nada hasta que la actives tú.')) return;
      enviar('prospeccion-campana', { nombre: nombre.trim(), filas: filas }).then(function (r) {
        ui.sel = {};
        QV.aviso('Campaña creada en borrador con ' + r.cuentas + ' cuentas' + (r.saltadas ? ' (' + r.saltadas + ' sin aprobar o sin correo)' : ''));
        datos = null; cargar();
      }).catch(function (err) { QV.aviso(err.message, 'alerta'); }).then(pinta);
    }
  });

  QV.VISTA_FN.prospeccion = vista;
})();
