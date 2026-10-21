/* Outbound (20-oct): lo que hace el SDR en Smartlead, solo en el modo real y solo lectura.
 * Lee /api/intelligence-datos?accion=outbound (con la sesión). Arriba las respuestas pendientes,
 * después las cuentas en secuencia (con filtros y ficha) y los números por campaña.
 * Si una cifra no se ha podido leer sale «sin datos», nunca un cero. */
(function () {
  'use strict';
  const QV = window.QV, M = QV.motor;
  const esc = function (s) { return QV.esc(s); };
  const API = '/api/intelligence-datos/';
  const SD = '<span class="inf-nm" title="Smartlead no lo ha devuelto">sin datos</span>';
  let datos = null, error = '', cargando = false;
  const ui = { campana: 'qualivo', estado: 'todas', texto: '', limite: 150 };

  function pinta() { if (QV.estado.vista === 'outbound') QV.pintarVista(); }
  function json(r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; }); }
  function cargar(fresco) {
    if (cargando) return;
    cargando = true; error = '';
    fetch(API + '?accion=outbound' + (fresco ? '&fresco=1' : ''), { credentials: 'same-origin', cache: 'no-store' })
      .then(json).then(function (d) { datos = d; }).catch(function (e) { error = e.message || String(e); })
      .then(function () { cargando = false; pinta(); });
  }
  function hace(t) { return t ? M.hace((Date.now() - t) / M.MIN) : '—'; }
  function n(v) { return v == null ? SD : M.num(v); }
  function estadoDe(a) {
    if (a.reboto) return { k: 'reboto', txt: 'Rebotó' };
    if (a.respondio) return { k: 'respondio', txt: 'Respondió' };
    if (a.estado === 'STARTED') return { k: 'cargado', txt: 'Sin empezar' };
    if (a.estado === 'INPROGRESS') return { k: 'secuencia', txt: 'En secuencia' };
    if (a.estado === 'COMPLETED') return { k: 'terminado', txt: 'Secuencia terminada' };
    if (a.estado === 'PAUSED' || a.estado === 'STOPPED') return { k: 'parado', txt: a.estado === 'PAUSED' ? 'Pausado' : 'Parado' };
    return { k: 'otro', txt: a.estado || '—' };
  }
  function cuentaDe(email) { return (datos.cuentas || []).filter(function (a) { return a.email === email; })[0]; }

  function vista() {
    const cab = QV.cabecera('Outbound', '¿Qué está haciendo el SDR?', 'Lo que pasa en Smartlead, en directo: quién ha respondido, en qué punto está cada cuenta y cómo va cada campaña. Solo lectura: desde aquí no se envía ni se pausa nada.');
    if (!(QV.estado.cfg && QV.estado.cfg.real)) return cab + '<div class="tarjeta"><p class="gris">Outbound solo se ve con tus datos reales.</p></div>';
    if (!datos && !error) { cargar(); return cab + '<div class="tarjeta"><p class="vacio">Leyendo Smartlead… la primera vez tarda hasta un minuto.</p></div>'; }
    if (error && !datos) return cab + '<div class="tarjeta"><p class="vacio">' + esc(error) + '</p><button class="btn btn-mini" type="button" data-ob="recargar">Reintentar</button></div>';
    const D = datos;
    const avisos = (D.avisos || []).map(function (a) { return '<p class="inf-aviso">' + esc(a) + '</p>'; }).join('');
    const propias = D.campanas.filter(function (c) { return !c.cliente; });
    const suma = function (f) { const v = propias.map(f); return v.some(function (x) { return x == null; }) ? null : v.reduce(function (a, x) { return a + x; }, 0); };
    const kp = function (l, v, em, cls) { return '<div class="kpi"><span>' + esc(l) + '</span><strong>' + v + '</strong><em class="' + (cls || '') + '">' + esc(em || '') + '</em></div>'; };
    const reun = suma(function (c) { return c.reuniones == null ? null : c.reuniones; });
    const kpis = '<div class="kpis ob-kpis">' +
      kp('Enviados hoy', n(suma(function (c) { return c.hoy ? c.hoy.enviados : null; })), 'campañas de Qualivo') +
      kp('Enviados en 7 días', n(suma(function (c) { return c.semana ? c.semana.enviados : null; })), 'del ' + D.desde7.slice(8) + '/' + D.desde7.slice(5, 7) + ' a hoy') +
      kp('Respuestas pendientes', M.num(D.pendientes.length), 'sin contestar todavía', D.pendientes.length ? 'mal' : '') +
      kp('Piden reunión', n(reun), 'categoría en Smartlead') +
      kp('Rebotes en 7 días', n(suma(function (c) { return c.semana ? c.semana.rebotes : null; })), '') +
      kp('Cargados sin empezar', n(suma(function (c) { return c.leads ? c.leads.cargados : null; })), 'depósito (STARTED)') + '</div>';

    // 1) Respuestas pendientes
    const pend = '<div class="tarjeta"><h3>Respuestas pendientes <span class="sub">Respondieron y nadie les ha contestado todavía</span></h3>' +
      (D.pendientes.length ? '<div class="ob-pend">' + D.pendientes.map(function (p) {
        const a = cuentaDe(p.email) || {};
        return '<div class="ob-resp"><div class="ob-resp-cab"><b>' + esc(a.persona || p.email) + '</b><span class="gris"> · ' + esc(a.empresa || '') + '</span><span class="ob-cuando">' + hace(p.cuando) + '</span></div>' +
          '<div class="meta">' + esc(a.campanaNombre || '') + (a.categoria ? ' · ' + esc(a.categoria) : '') + '</div>' +
          (p.texto ? '<p class="ob-texto">«' + esc(p.texto) + '»</p>' : '<p class="gris">No se ha podido leer el texto (' + esc(p.sinHistorial || '') + ').</p>') +
          '<div class="pr-acciones"><button class="btn btn-mini" type="button" data-ob-ficha="' + esc(p.email) + '">Ver el hilo</button><a class="btn btn-mini btn-fantasma" href="https://app.smartlead.ai/app/master-inbox" target="_blank" rel="noopener">Contestar en Smartlead</a></div></div>';
      }).join('') + '</div>' : '<p class="vacio">No hay respuestas sin contestar.</p>') +
      '<p class="gris" style="margin-top:8px;font-size:12px">Los borradores del agente Outbound todavía no se ven aquí.</p></div>';

    // 2) Cuentas en secuencia
    const todas = D.cuentas.filter(function (a) {
      if (ui.campana === 'qualivo' && a.cliente) return false;
      if (ui.campana !== 'qualivo' && ui.campana !== 'todas' && String(a.campana) !== ui.campana) return false;
      if (ui.estado !== 'todas' && estadoDe(a).k !== ui.estado) return false;
      if (ui.texto) { const t = ui.texto.toLowerCase(); if ([a.empresa, a.persona, a.cargo, a.senal].join(' ').toLowerCase().indexOf(t) < 0) return false; }
      return true;
    }).sort(function (x, y) { return (y.respondio || 0) - (x.respondio || 0) || (y.ultimoEnvio || 0) - (x.ultimoEnvio || 0); });
    const opcCamp = '<option value="qualivo">Campañas de Qualivo</option><option value="todas"' + (ui.campana === 'todas' ? ' selected' : '') + '>Todas (con clientes)</option>' +
      D.campanas.map(function (c) { return '<option value="' + c.id + '"' + (String(c.id) === ui.campana ? ' selected' : '') + '>' + esc((c.cliente ? '[cliente] ' : '') + c.nombre) + '</option>'; }).join('');
    const EST = [['todas', 'Todos los estados'], ['secuencia', 'En secuencia'], ['cargado', 'Sin empezar'], ['respondio', 'Respondió'], ['reboto', 'Rebotó'], ['terminado', 'Secuencia terminada'], ['parado', 'Pausado o parado']];
    const filtros = '<div class="inf-ctrl"><select class="select inf-sel" data-ob-f="campana">' + opcCamp + '</select>' +
      '<select class="select inf-sel" data-ob-f="estado">' + EST.map(function (e) { return '<option value="' + e[0] + '"' + (ui.estado === e[0] ? ' selected' : '') + '>' + e[1] + '</option>'; }).join('') + '</select>' +
      '<input class="select inf-sel" data-ob-f="texto" placeholder="Buscar empresa, persona o señal" value="' + esc(ui.texto) + '"></div>';
    const filas = todas.slice(0, ui.limite).map(function (a) {
      const e = estadoDe(a);
      return '<tr data-ob-ficha="' + esc(a.email) + '" style="cursor:pointer"><td><b>' + esc(a.empresa || '—') + '</b>' + (a.cliente ? ' <span class="pr-tag">cliente</span>' : '') + '<div class="meta">' + esc([a.persona, a.cargo].filter(Boolean).join(' · ')) + '</div></td>' +
        '<td class="ob-senal">' + esc(a.senal || '—') + '</td><td class="num">' + esc(a.puntuacion || '—') + '</td><td>' + esc(a.campanaNombre) + '</td>' +
        '<td class="num">' + (a.paso || '—') + '</td><td>' + (a.ultimoEnvio ? hace(a.ultimoEnvio) : '—') + '</td>' +
        '<td>' + (a.abrio ? 'Sí' : '—') + '</td><td>' + (a.respondio ? '<b>' + hace(a.respondio) + '</b>' : '—') + '</td><td><span class="ob-est e-' + e.k + '">' + esc(e.txt) + '</span></td></tr>';
    }).join('');
    const cuentas = '<div class="tarjeta" style="margin-top:14px"><h3>Cuentas en Smartlead <span class="sub">' + M.num(todas.length) + (todas.length > ui.limite ? ' · se ven ' + ui.limite : '') + '</span></h3>' + filtros +
      (todas.length ? '<div class="tabla-caja" style="border:0"><table class="tabla ob-tabla"><thead><tr><th>Empresa y persona</th><th>Señal</th><th class="num">Punt.</th><th>Campaña</th><th class="num">Paso</th><th>Último envío</th><th>Abrió</th><th>Respondió</th><th>Estado</th></tr></thead><tbody>' + filas + '</tbody></table></div>' +
        (todas.length > ui.limite ? '<button class="btn btn-mini" type="button" data-ob="mas" style="margin-top:8px">Ver más</button>' : '') : '<p class="vacio">Ninguna cuenta con estos filtros.</p>') + '</div>';

    // 3) Por campaña
    const camp = '<div class="tarjeta" style="margin-top:14px"><h3>Por campaña <span class="sub">hoy y últimos 7 días</span></h3><div class="tabla-caja" style="border:0;margin-top:8px"><table class="tabla ob-tabla"><thead><tr><th>Campaña</th><th>Estado</th><th class="num">Hoy</th><th class="num">7 días</th><th class="num">Respuestas 7 d</th><th class="num">Piden reunión</th><th class="num">Rebotes 7 d</th><th class="num">Sin empezar</th><th class="num">En curso</th><th class="num">Buzones</th></tr></thead><tbody>' +
      D.campanas.slice().sort(function (a, b) { return (a.cliente ? 1 : 0) - (b.cliente ? 1 : 0) || (b.semana ? b.semana.enviados : -1) - (a.semana ? a.semana.enviados : -1); }).map(function (c) {
        return '<tr' + (c.cliente ? ' class="ob-cliente"' : '') + '><td>' + (c.cliente ? '<span class="pr-tag">cliente</span> ' : '') + '<a href="https://app.smartlead.ai/app/email-campaign/' + encodeURIComponent(c.id) + '/analytics" target="_blank" rel="noopener">' + esc(c.nombre) + '</a></td>' +
          '<td><span class="ob-est ' + (c.estado === 'ACTIVE' ? 'e-secuencia' : 'e-parado') + '">' + esc(c.estado === 'ACTIVE' ? 'Activa' : c.estado.toLowerCase()) + '</span></td>' +
          '<td class="num">' + (c.hoy ? M.num(c.hoy.enviados) : SD) + '</td><td class="num"><b>' + (c.semana ? M.num(c.semana.enviados) : SD) + '</b></td>' +
          '<td class="num">' + (c.semana ? M.num(c.semana.respuestas) : SD) + '</td><td class="num">' + n(c.reuniones) + '</td><td class="num">' + (c.semana ? M.num(c.semana.rebotes) : SD) + '</td>' +
          '<td class="num">' + (c.leads ? M.num(c.leads.cargados) : SD) + '</td><td class="num">' + (c.leads ? M.num(c.leads.enCurso) : SD) + '</td><td class="num">' + n(c.buzones) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
    const pie = '<p class="gris inf-nota">Leído de Smartlead ' + (D.cacheSegundos != null ? 'hace ' + Math.max(1, Math.round(D.cacheSegundos / 60)) + ' min' : '') + ' (se guarda 7 minutos). <button class="btn btn-mini btn-fantasma" type="button" data-ob="recargar">' + (cargando ? 'Leyendo…' : 'Volver a leer') + '</button></p>';
    return cab + avisos + kpis + pend + cuentas + camp + pie;
  }

  // ---------- Ficha lateral ----------
  function abrir(email) {
    const a = cuentaDe(email);
    if (!a) return;
    const el = document.getElementById('ficha');
    const e = estadoDe(a);
    const cabF = '<div class="ficha-cab"><div class="l1"><div><h2>' + esc(a.empresa || a.persona || '—') + '</h2><div class="meta" style="font-size:13px">' + esc([a.persona, a.cargo].filter(Boolean).join(' · ')) + '</div></div><span class="ob-est e-' + e.k + '">' + esc(e.txt) + '</span><button class="btn btn-icono" type="button" data-cerrar-ficha aria-label="Cerrar">' + QV.ico('cerrar') + '</button></div>' +
      '<div class="datos">' + [['Campaña', a.campanaNombre], ['Señal', a.senal], ['Puntuación', a.puntuacion], ['Paso', a.paso || ''], ['Último envío', a.ultimoEnvio ? hace(a.ultimoEnvio) : ''], ['Categoría', a.categoria], ['Web', a.web]].filter(function (x) { return x[1]; }).map(function (x) { return '<span>' + esc(x[0]) + ': <b>' + esc(x[1]) + '</b></span>'; }).join('') + '</div></div>';
    el.innerHTML = cabF + '<div class="ficha-cuerpo"><p class="vacio">Leyendo la secuencia y los mensajes…</p></div>';
    el.hidden = false; document.getElementById('velo').hidden = false;
    fetch(API + '?accion=outbound-ficha&campana=' + encodeURIComponent(a.campana) + '&lead=' + encodeURIComponent(a.lead), { credentials: 'same-origin', cache: 'no-store' }).then(json).then(function (f) {
      const pasos = f.pasos ? '<div><p class="bloque-t">Secuencia</p><div class="ob-seq">' + f.pasos.map(function (p, i) {
        const hecho = p.n <= (a.paso || 0);
        return '<div class="ob-paso' + (hecho ? ' hecho' : '') + '"><div class="ob-paso-cab"><b>Paso ' + p.n + '</b><span class="gris">' + (p.espera ? '+' + p.espera + ' días' : 'día 0') + (hecho ? ' · enviado' : '') + '</span></div>' + (p.asunto ? '<p class="pr-asunto">' + esc(p.asunto) + '</p>' : '') + '<p class="pr-cuerpo">' + esc(p.cuerpo) + '</p></div>';
      }).join('') + '</div></div>' : '<p class="gris">Secuencia: sin datos (' + esc(f.errorPasos) + ').</p>';
      const msgs = f.mensajes ? '<div><p class="bloque-t">Mensajes</p>' + (f.mensajes.length ? f.mensajes.map(function (m) {
        return '<div class="ob-msg ' + m.tipo + '"><div class="ob-paso-cab"><b>' + (m.tipo === 'respuesta' ? 'Respuesta' : 'Enviado') + '</b><span class="gris">' + (m.t ? M.fechaCorta(m.t, Date.now()) : '') + '</span></div>' + (m.asunto ? '<p class="pr-asunto">' + esc(m.asunto) + '</p>' : '') + '<p class="pr-cuerpo">' + esc(m.texto) + '</p></div>';
      }).join('') : '<p class="vacio">Todavía no se le ha enviado nada.</p>') + '</div>' : '<p class="gris">Mensajes: sin datos (' + esc(f.errorMensajes) + ').</p>';
      el.innerHTML = cabF + '<div class="ficha-cuerpo">' + msgs + pasos + '</div>';
    }).catch(function (err) { el.innerHTML = cabF + '<div class="ficha-cuerpo"><p class="vacio">' + esc(err.message) + '</p></div>'; });
  }

  document.addEventListener('click', function (e) {
    const t = e.target.closest && e.target.closest('[data-ob],[data-ob-ficha]');
    if (!t) return;
    if (t.dataset.obFicha) { abrir(t.dataset.obFicha); return; }
    if (t.dataset.ob === 'recargar') { datos = null; error = ''; cargar(true); pinta(); return; }
    if (t.dataset.ob === 'mas') { ui.limite += 150; pinta(); }
  });
  document.addEventListener('change', function (e) {
    const s = e.target.closest && e.target.closest('[data-ob-f]');
    if (!s || s.dataset.obF === 'texto') return;
    ui[s.dataset.obF] = s.value; ui.limite = 150; pinta();
  });
  let tBusca = null;
  document.addEventListener('input', function (e) {
    const s = e.target.closest && e.target.closest('[data-ob-f="texto"]');
    if (!s) return;
    clearTimeout(tBusca);
    tBusca = setTimeout(function () {
      ui.texto = s.value.trim(); pinta();
      const i = document.querySelector('[data-ob-f="texto"]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); }
    }, 300);
  });

  QV.VISTA_FN.outbound = vista;
})();
