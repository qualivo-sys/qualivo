/* Qualivo Intelligence · aplicación
 * Un solo estado (QV.estado). Todo lo que se pinta sale de ahí: las pantallas,
 * el Copilot y el modo demo leen y escriben el mismo estado. */
(function () {
  'use strict';
  const QV = window.QV;
  const M = QV.motor;
  const ico = QV.ico;
  const $ = function (s) { return document.querySelector(s); };
  const esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]; }); };

  const SECTORES = [
    { id: 'formacion', txt: 'Formación', desc: 'Escuelas, másteres y formación para empresas', ico: 'formacion' },
    { id: 'saas', txt: 'SaaS / Software', desc: 'Producto con prueba gratis o versión free', ico: 'saas' },
    { id: 'b2b', txt: 'Servicios B2B', desc: 'Consultoría, agencias y servicios profesionales', ico: 'b2b' },
    { id: 'clinica', txt: 'Clínica', desc: 'Dental, estética, fisioterapia', ico: 'clinica' },
    { id: 'inmobiliaria', txt: 'Inmobiliaria', desc: 'Compraventa, alquiler y obra nueva', ico: 'inmobiliaria' },
    { id: 'reformas', txt: 'Reformas / Construcción', desc: 'Presupuestos, visitas y obras', ico: 'reformas' },
    { id: 'marketing', txt: 'Agencia de marketing', desc: 'Una agencia que capta sus propios clientes', ico: 'sube' },
    { id: 'agencias', txt: 'Vista para agencias', desc: 'La cartera de una agencia: qué cuenta vende y cuál se puede ir', ico: 'anuncio' },
    { id: 'otro', txt: 'Personalizado', desc: 'Cualquier negocio que vende servicios', ico: 'otro' }
  ];
  const OBJETIVOS = [
    { id: 'captacion', txt: 'Captación' }, { id: 'conversion', txt: 'Conversión' }, { id: 'seguimiento', txt: 'Seguimiento' },
    { id: 'ventas', txt: 'Ventas' }, { id: 'retencion', txt: 'Retención' }, { id: 'expansion', txt: 'Expansión' }, { id: 'todo', txt: 'Todo el recorrido' }
  ];
  const VISTAS = [
    { id: 'resumen', txt: 'Resumen', ico: 'resumen' },
    { id: 'inteligencia', txt: 'Inteligencia', ico: 'inteligencia' },
    { id: 'oportunidades', txt: 'Oportunidades', ico: 'oportunidades' },
    { id: 'conversaciones', txt: 'Conversaciones', ico: 'conversaciones' },
    { id: 'recorrido', txt: 'Recorrido', ico: 'recorrido' },
    { id: 'anuncios', txt: 'Anuncios', ico: 'anuncio' },
    { id: 'senales', txt: 'Señales', ico: 'senales' },
    { id: 'agentes', txt: 'Agentes', ico: 'agentes' }
  ];

  // ---------------------------------------------------------------------------
  // Carga de sectores (un archivo por sector, bajo demanda)
  // ---------------------------------------------------------------------------
  window.QV_SECTORES = window.QV_SECTORES || {};
  function cargarSector(id) {
    return new Promise(function (ok, ko) {
      if (window.QV_SECTORES[id]) return ok(window.QV_SECTORES[id]);
      const s = document.createElement('script');
      s.src = 'sectores/' + id + '.js?v=' + (window.QV_VERSION || '1');
      s.onload = function () { window.QV_SECTORES[id] ? ok(window.QV_SECTORES[id]) : ko(new Error('sector vacío')); };
      s.onerror = function () { ko(new Error('no se pudo cargar el sector ' + id)); };
      document.head.appendChild(s);
    });
  }

  function completarCfg(cfg) {
    if (cfg._ok) return cfg;
    cfg.campanaNombre = function (id) { const c = cfg.campanas.filter(function (x) { return x.id === id; })[0]; return c ? c.nombre : ''; };
    cfg.campana = function (id) { return cfg.campanas.filter(function (x) { return x.id === id; })[0] || null; };
    cfg.etapaTxt = function (i) { return (cfg.recorrido[i] || {}).txt || ''; };
    cfg._ok = true;
    return cfg;
  }

  // ---------------------------------------------------------------------------
  // Estado
  // ---------------------------------------------------------------------------
  // Términos del recorrido y los anuncios. En casi todos los sectores son los
  // mismos; en la vista de agencias los «contactos» del sistema son las cuentas
  // de clientes y los del recorrido son los que traen sus anuncios.
  function TA() { const T = estado.cfg.t; return T.recorrido ? Object.assign({}, T, T.recorrido) : T; }
  QV.TA = function () { return TA(); };
  const estado = QV.estado = { vista: 'resumen', filtro: 'atencion', filtroSenal: 'todas', convSel: null };

  function iniciar(opts) {
    return cargarSector(opts.sector).then(function (cfg) {
      completarCfg(cfg);
      M.nombresSenal(cfg.t.senales);
      if (QV.demo) QV.demo.parar(true);
      estado.sectorId = cfg.id;
      estado.cfg = cfg;
      estado.empresa = (opts.empresa || '').trim().slice(0, 40);
      estado.objetivo = opts.objetivo || 'todo';
      estado.historia = opts.historia && cfg.historias && cfg.historias[opts.historia] ? opts.historia : cfg.historiaDefecto;
      const d = new Date(); d.setSeconds(0, 0);
      estado.t0 = d.getTime();
      estado.ahora = estado.t0;
      estado.contactos = cfg.contactos.map(function (c) { return M.preparar(c, estado.t0); });
      estado.feed = [];
      estado.nuevos = {};
      estado.filtro = 'atencion';
      estado.convSel = null;
      recalcular();
      $('#inicio').hidden = true;
      $('#app').hidden = false;
      document.title = 'Intelligence System' + (estado.empresa ? ' · ' + estado.empresa : '') + ' · Qualivo';
      guardarUrl();
      pintarTodo();
      if (QV.copilot) QV.copilot.reiniciar();
      irA(opts.vista || 'resumen');
      return cfg;
    });
  }

  function recalcular() { M.evaluarTodos(estado); }

  function guardarUrl() {
    const p = new URLSearchParams();
    p.set('sector', estado.sectorId);
    if (estado.empresa) p.set('empresa', estado.empresa);
    if (estado.objetivo && estado.objetivo !== 'todo') p.set('objetivo', estado.objetivo);
    if (estado.historia && estado.historia !== estado.cfg.historiaDefecto) p.set('historia', estado.historia);
    try { history.replaceState(null, '', '?' + p.toString()); } catch (e) { /* nada */ }
  }

  // ---------------------------------------------------------------------------
  // Utilidades de pintado
  // ---------------------------------------------------------------------------
  function iniciales(n) { return String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (x) { return x.charAt(0); }).join('').toUpperCase(); }
  const COLORES = ['#E6F4F2', '#EFECFB', '#FDF4E0', '#E9F0FC', '#FDEEE6', '#EDEFF2'];
  function avatar(c) {
    let h = 0; for (let i = 0; i < c.id.length; i++) h = (h * 31 + c.id.charCodeAt(i)) >>> 0;
    return '<span class="avatar" style="background:' + COLORES[h % COLORES.length] + '">' + esc(iniciales(c.n)) + '</span>';
  }
  function pillPrio(p) { const d = M.PRIO[p]; return '<span class="pill p-' + d.clase + '"><i></i>' + d.txt + '</span>'; }
  function metaContacto(c) {
    const T = estado.cfg.t;
    const partes = [c.rol];
    if (c.emp) partes.push(c.emp);
    if (c.tam) partes.push(c.tam + ' ' + (T.empleados || 'empleados'));
    return partes.filter(Boolean).join(' · ');
  }
  function icoAccion(tipo) { return tipo === 'humano' ? 'persona' : tipo === 'voz' ? 'voz' : tipo === 'auto' ? 'auto' : tipo === 'agente' ? 'whatsapp' : 'ojo'; }
  function miniScores(x) {
    const b = function (l, v, cls) { return '<div class="ms ' + (cls || '') + '" title="' + l + ' ' + v + '"><small>' + l.slice(0, 3) + '</small><b>' + v + '</b><div class="barrita"><i style="width:' + v + '%"></i></div></div>'; };
    return '<div class="mini-scores">' + b('Encaje', x.fit) + b('Actividad', x.comp) + b('Intención', x.int) + b('Riesgo', x.riesgo, 'riesgo') + '</div>';
  }
  function ultimaSenal(c) {
    const s = c.x.senales.slice().sort(function (a, b) { return b.t - a.t; })[0];
    if (s) return { txt: M.TIPOS_SENAL[s.tipo].txt, t: s.t };
    const tl = M.timeline(c, estado.cfg, estado.ahora);
    const u = tl[tl.length - 1];
    return u ? { txt: u.texto.split(' · ')[0], t: u.t } : { txt: '', t: c.tCreado };
  }
  function contacto(id) { return estado.contactos.filter(function (c) { return c.id === id; })[0]; }
  function atencion() { return estado.contactos.filter(function (c) { return c.x.atencion; }); }
  function tituloSistema() { return 'Intelligence System' + (estado.empresa ? ' · <b>' + esc(estado.empresa) + '</b>' : ''); }

  function aviso(txt, icono) {
    const el = document.createElement('div');
    el.className = 'aviso';
    el.innerHTML = ico(icono || 'check') + '<span>' + esc(txt) + '</span>';
    $('#avisos').appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 320); }, 3200);
  }

  // ---------------------------------------------------------------------------
  // KPIs del mes (salen de las campañas del sector)
  // ---------------------------------------------------------------------------
  function kpis() {
    const cfg = estado.cfg, T = cfg.t, m = M.mes(cfg);
    const pago = cfg.campanas.filter(function (c) { return c.inversion > 0; });
    const et = cfg.kpiEtapas || {};
    const sum = function (lista, id) { return lista.reduce(function (a, c) { return a + (c.embudo[id] || 0); }, 0); };
    const primera = et.interesados || cfg.recorrido[1].id;
    const ventasPago = sum(pago, cfg.ventaEtapa);
    const ingresosPago = pago.reduce(function (a, c) { return a + (c.embudo[cfg.ventaEtapa] || 0) * (c.ticket || cfg.ticket); }, 0);
    const md = cfg.mesDatos || {};
    const N = cfg.kpiNombres || {};
    const base = {
      interesados: { l: N.interesados || T.Contactos, v: M.num(m.tot[primera]), em: M.euros(m.inversion) + ' invertidos' },
      cpl: { l: 'Coste por ' + T.contacto, v: M.euros(m.inversion / Math.max(1, sum(pago, primera))), em: 'Solo campañas de pago' },
      respuesta: { l: 'Tiempo de respuesta', v: md.respuestaAntes ? M.duracionLarga(md.respuestaAntes) : '—', em: 'Con el agente: ' + (md.respuestaAhora || 1) + ' min', clase: 'mal' },
      cualificados: { l: N.cualificados || 'Cualificados', v: M.num(m.tot[et.cualificados]), em: M.pct(m.tot[et.cualificados] / Math.max(1, m.tot[primera])) + ' de los que entran' },
      entrevistas: { l: N.entrevistas || T.Cita + 's', v: M.num(m.tot[et.entrevistas]), em: md.agendadas ? md.agendadas + ' agendadas' : '' },
      show: { l: 'Asistencia (show rate)', v: md.agendadas ? M.pct(m.tot[et.entrevistas] / md.agendadas) : '—', em: md.agendadas ? (md.agendadas - m.tot[et.entrevistas]) + ' no se presentaron' : '', clase: 'mal' },
      ventas: { l: N.ventas || T.Ventas, v: M.num(m.tot[cfg.ventaEtapa]), em: M.pct(m.tot[cfg.ventaEtapa] / Math.max(1, m.tot[primera])) + ' de los que entran' },
      cpv: { l: N.cpv || 'Coste por ' + T.venta, v: M.euros(m.inversion / Math.max(1, ventasPago)), em: ventasPago + ' ' + T.ventas + ' de pago' },
      ingresos: { l: N.ingresos || 'Facturación', v: M.euros(m.ingresos), em: 'Últimos 30 días', clase: 'bien' },
      roas: { l: 'Retorno (ROAS)', v: M.num(ingresosPago / Math.max(1, m.inversion), 1) + '×', em: 'Por cada euro en anuncios', clase: 'bien' }
    };
    const extra = cfg.kpiCustom ? cfg.kpiCustom(m, cfg, M, estado) : {};
    return (cfg.kpis || []).map(function (k) { const d = extra[k] || base[k]; return d ? Object.assign({ id: k }, d) : null; }).filter(Boolean);
  }
  QV.kpis = kpis;

  const DESTACADO = { captacion: ['cpl', 'interesados', 'signups'], conversion: ['ventas', 'cualificados', 'activacion', 'trialPago'], seguimiento: ['respuesta', 'show'], ventas: ['ingresos', 'ventas', 'pipeline'], retencion: ['churn', 'retencion', 'show'], expansion: ['expansion', 'mrr'], todo: [] };

  // ---------------------------------------------------------------------------
  // Feed del piloto automático: lo que ha hecho el sistema, con hora.
  // ---------------------------------------------------------------------------
  function feed(limite) {
    const T = estado.cfg.t;
    const items = [];
    const ventana = 48 * 60 * M.MIN;
    estado.contactos.forEach(function (c) {
      c.conv.forEach(function (m) {
        if (m.de === 'c' || estado.ahora - m.t > ventana || m.t > estado.ahora) return;
        const canal = m.canal === 'email' ? 'Correo' : m.canal === 'voz' ? 'Llamada' : 'WhatsApp';
        const quien = m.de === 'a' ? 'agente' : m.de === 'v' ? 'agente de voz' : 'equipo';
        items.push({ t: m.t, ico: m.canal === 'email' ? 'correo' : m.canal === 'voz' ? 'voz' : 'whatsapp', tono: m.de === 'h' ? 't-lila' : 't-teal', titulo: canal + ' enviado por el ' + quien, quien: c.n, id: c.id, detalle: m.texto.length > 90 ? m.texto.slice(0, 88) + '…' : m.texto });
      });
      c.x.senales.forEach(function (s) {
        if (estado.ahora - s.t > ventana || s.t > estado.ahora) return;
        const ts = M.TIPOS_SENAL[s.tipo];
        items.push({ t: s.t + 30000, ico: ts.ico, tono: 't-' + ts.tono, titulo: ts.txt + ' detectada', quien: c.n, id: c.id, detalle: 'Acción: ' + s.accion.charAt(0).toLowerCase() + s.accion.slice(1) });
      });
    });
    estado.feed.forEach(function (f) { items.push(f); });
    items.sort(function (a, b) { return b.t - a.t; });
    return items.slice(0, limite || 12);
  }
  function pintaFeed(items) {
    if (!items.length) return '<p class="vacio">Sin actividad en las últimas 48 horas.</p>';
    return '<div class="feed">' + items.map(function (f) {
      return '<div class="feed-item' + (f.nuevo && estado.ahora - f.t < 120000 ? ' nuevo' : '') + '"' + (f.id ? ' data-abrir="' + f.id + '" style="cursor:pointer"' : '') + '><time>' + M.hora(f.t) + '</time><span class="feed-ico ' + f.tono + '">' + ico(f.ico) + '</span><div><p><b>' + esc(f.titulo) + '</b>' + (f.quien ? ' · ' + esc(f.quien) : '') + '</p>' + (f.detalle ? '<small>' + esc(f.detalle) + '</small>' : '') + '</div></div>';
    }).join('') + '</div>';
  }
  QV.feed = feed;

  // ---------------------------------------------------------------------------
  // Capa de inteligencia sobre los anuncios. Qualivo no lleva las campañas: une
  // cada anuncio con lo que pasa después (encaje, seguimiento, venta) y se lo
  // devuelve a quien las lleva. Todo sale de las campañas del mes y de los
  // contactos del estado.
  // ---------------------------------------------------------------------------
  function anuncios() {
    const cfg = estado.cfg, T = TA(), M_ = M;
    const r = cfg.recorrido;
    const entra = r[1].id, contact = r[2].id, venta = cfg.ventaEtapa;
    const pago = cfg.campanas.filter(function (c) { return c.inversion > 0; });
    const inv = pago.reduce(function (a, c) { return a + c.inversion; }, 0);
    const ing = pago.reduce(function (a, c) { return a + (c.embudo[venta] || 0) * (c.ticket || cfg.ticket); }, 0);
    const R = ing / Math.max(1, inv);
    const postTotal = pago.reduce(function (a, c) { return a + (c.embudo[venta] || 0); }, 0) / Math.max(1, pago.reduce(function (a, c) { return a + (c.embudo[contact] || 0); }, 0));
    const filas = cfg.campanas.map(function (c) {
      const cs = estado.contactos.filter(function (k) { return k.orig === c.id && k.id !== 'demo'; });
      const fitMedio = cs.length ? Math.round(cs.reduce(function (a, k) { return a + k.x.fit; }, 0) / cs.length) : null;
      const bajo = cs.filter(function (k) { return k.x.fit < 40; }).length;
      const v = c.embudo[venta] || 0, e = c.embudo[entra] || 0;
      const ingC = v * (c.ticket || cfg.ticket);
      const roas = c.inversion ? ingC / c.inversion : null;
      const post = (c.embudo[contact] || 0) ? v / c.embudo[contact] : 0;
      let ver = cfg.veredictoAnuncio ? cfg.veredictoAnuncio({ c: c, roas: roas, R: R, post: post, postTotal: postTotal }, M_, T) : null;
      if (ver) { /* veredicto propio del sector */ }
      else if (!c.inversion) ver = { id: 'organico', txt: 'Orgánico', tono: 't-gris', por: 'No tiene inversión. Sirve de referencia de calidad: ' + (fitMedio != null ? 'encaje medio ' + fitMedio + '.' : '') };
      else if (roas >= R * 1.3) ver = { id: 'escalar', txt: 'Escalar', tono: 't-teal', por: 'Devuelve ' + M_.num(roas, 1) + '× (la media es ' + M_.num(R, 1) + '×). Aquí hay margen para subir presupuesto.' };
      else if (roas < R * 0.6 && fitMedio != null && fitMedio < 45) ver = { id: 'publico', txt: 'Revisar público', tono: 't-coral', por: 'Trae ' + T.contactos + ' baratos que no encajan (encaje medio ' + fitMedio + ', ' + bajo + ' de ' + cs.length + ' por debajo de 40). El anuncio funciona; el público no.' };
      else if (roas < R * 0.6) ver = { id: 'despues', txt: 'No es el anuncio', tono: 't-amber', por: 'Lo que trae encaja (encaje medio ' + (fitMedio != null ? fitMedio : '—') + '), pero solo el ' + M_.pct(post) + ' de los contactados acaba en ' + T.venta + ' (media ' + M_.pct(postTotal) + '). Se pierde después: es seguimiento, no campaña.' };
      else ver = { id: 'mantener', txt: 'Mantener', tono: 't-lila', por: 'Retorno de ' + M_.num(roas, 1) + '×, en línea con la media. Sin cambios.' };
      return { c: c, entra: e, ventas: v, ingresos: ingC, roas: roas, cpl: c.inversion ? c.inversion / Math.max(1, e) : null, cpv: c.inversion ? c.inversion / Math.max(1, v) : null, fitMedio: fitMedio, n: cs.length, post: post, ver: ver };
    });
    // Eventos que se devuelven a las plataformas (conversiones offline)
    const eventos = r.slice(2).filter(function (e) { return !e.sinFuga || e.id === venta; }).map(function (e) {
      return { etapa: e.txt, n: pago.reduce(function (a, c) { return a + (c.embudo[e.id] || 0); }, 0), valor: e.id === venta };
    });
    const canales = pago.map(function (c) { return c.canal; }).filter(function (x, i, a) { return a.indexOf(x) === i; });
    return { filas: filas, R: R, inversion: inv, ingresos: ing, eventos: eventos, canales: canales };
  }
  QV.anuncios = anuncios;

  // Nota semanal para quien lleva los anuncios (se genera de los veredictos)
  function notaAgencia() {
    const T = TA(), a = anuncios();
    if (estado.cfg.notaAnuncios) return estado.cfg.notaAnuncios(a, T, M);
    const pago = a.filas.filter(function (f) { return f.c.inversion > 0; });
    const lin = [];
    pago.filter(function (f) { return f.ver.id === 'escalar'; }).forEach(function (f) { lin.push('Subiría presupuesto en «' + f.c.nombre + '» (' + f.c.canal + '): ' + f.ventas + ' ' + T.ventas + ' y ' + M.num(f.roas, 1) + '× de retorno.'); });
    pago.filter(function (f) { return f.ver.id === 'publico'; }).forEach(function (f) { lin.push('Revisaría el público de «' + f.c.nombre + '»: el coste por ' + T.contacto + ' es bueno (' + M.euros(f.cpl) + '), pero lo que trae no encaja (encaje medio ' + f.fitMedio + ').'); });
    pago.filter(function (f) { return f.ver.id === 'despues'; }).forEach(function (f) { lin.push('No tocaría «' + f.c.nombre + '»: sus ' + T.contactos + ' encajan y se pierden en el seguimiento. Eso lo arreglamos nosotros.'); });
    lin.push('Desde esta semana os llegan a ' + M.unir(a.canales) + ' los eventos de ' + M.unir(a.eventos.map(function (e) { return e.etapa.toLowerCase(); })) + ', con su valor. Si podéis, optimizad al último.');
    return lin;
  }
  QV.notaAgencia = notaAgencia;

  // ---------------------------------------------------------------------------
  // Navegación
  // ---------------------------------------------------------------------------
  function pintarNav() {
    const nAt = atencion().length;
    const nSen = estado.contactos.reduce(function (a, c) { return a + c.x.senales.filter(function (s) { return s.humano; }).length; }, 0);
    $('#nav').innerHTML = VISTAS.map(function (v) {
      let cuenta = '';
      if (v.id === 'oportunidades' && nAt) cuenta = '<span class="cuenta">' + nAt + '</span>';
      if (v.id === 'senales' && nSen) cuenta = '<span class="cuenta">' + nSen + '</span>';
      return '<button type="button" data-vista="' + v.id + '"' + (estado.vista === v.id ? ' aria-current="page"' : '') + '>' + ico(v.ico) + '<span>' + v.txt + '</span>' + cuenta + '</button>';
    }).join('');
  }
  function pintarBarra() {
    $('#tituloSistema').innerHTML = tituloSistema();
    const sec = SECTORES.filter(function (s) { return s.id === estado.sectorId; })[0];
    const obj = OBJETIVOS.filter(function (o) { return o.id === estado.objetivo; })[0];
    $('#chipSector').textContent = sec.txt + (obj && obj.id !== 'todo' ? ' · ' + obj.txt : '');
    $('#reloj').innerHTML = '<i></i>' + M.hora(estado.ahora);
    $('#selSector').innerHTML = SECTORES.map(function (s) { return '<option value="' + s.id + '"' + (s.id === estado.sectorId ? ' selected' : '') + '>' + s.txt + '</option>'; }).join('');
    if (QV.demo) QV.demo.pintarBotones();
  }
  function pintarTodo() {
    pintarNav();
    pintarBarra();
    pintarVista();
  }
  QV.pintarTodo = pintarTodo;

  function irA(v) {
    estado.vista = v;
    pintarNav();
    pintarVista();
    $('#vista').scrollTop = 0;
  }
  QV.irA = irA;

  function pintarVista() {
    const f = VISTA_FN[estado.vista] || VISTA_FN.resumen;
    $('#vista').innerHTML = f();
    if (estado.vista === 'conversaciones') { const b = document.querySelector('.burbujas'); if (b) b.scrollTop = b.scrollHeight; }
  }

  // ---------------------------------------------------------------------------
  // Vistas
  // ---------------------------------------------------------------------------
  function cabecera(titulo, pregunta, sub) {
    return '<div class="titulo-vista"><div><p class="pregunta-guia">' + esc(pregunta) + '</p><h1>' + esc(titulo) + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div></div>';
  }

  function filaContacto(c) {
    return '<div class="fila" data-abrir="' + c.id + '"><div class="quien-fila">' + avatar(c) + '<div style="min-width:0"><div class="nombre">' + esc(c.n) + '</div><div class="meta">' + esc(metaContacto(c)) + '</div></div></div>' +
      '<div class="nba-corta">' + ico(icoAccion(c.x.nba.tipo)) + '<span>' + esc(c.x.nba.accion) + '</span></div>' + pillPrio(c.x.prio) + '</div>';
  }

  const VISTA_FN = {
    resumen: function () {
      const cfg = estado.cfg, T = cfg.t;
      const at = atencion();
      const enJuego = at.reduce(function (a, c) { return a + (c.valor || 0); }, 0);
      const trabajando = estado.contactos.filter(function (c) { return ['agente', 'voz', 'auto'].indexOf(c.x.nba.tipo) >= 0 && c.x.nba.estado !== 'cerrado'; }).length;
      const humanos = estado.contactos.filter(function (c) { return c.x.nba.tipo === 'humano' && c.x.nba.id !== 'asignado'; }).length;
      const dest = DESTACADO[estado.objetivo] || [];
      const fg = M.fugas(cfg)[0];
      const hoyTxt = at.length ? '<b>' + at.length + ' ' + T.oportunidades + '</b> requieren atención hoy. Solo <b>' + humanos + '</b> necesitan a una persona.' : 'Hoy no hay nada urgente. El sistema sigue trabajando.';
      return '<div class="hoy"><div class="hoy-frase"><h2>' + hoyTxt + '</h2><p>' + estado.contactos.length + ' ' + T.contactos + ' en el sistema · actualizado a las ' + M.hora(estado.ahora) + '</p></div>' +
        '<button class="hoy-dato" type="button" data-vista="oportunidades"><span>Requieren atención</span><strong>' + at.length + '</strong><em>' + M.euros(enJuego) + ' en juego</em></button>' +
        '<button class="hoy-dato" type="button" data-vista="agentes"><span>El sistema está moviendo</span><strong>' + trabajando + '</strong><em>sin que nadie tenga que acordarse</em></button>' +
        '<button class="hoy-dato" type="button" data-vista="senales"><span>Necesitan a una persona</span><strong style="color:var(--coral)">' + humanos + '</strong><em>con todo el contexto</em></button></div>' +
        '<p class="pregunta-guia" style="margin:18px 0 8px">Últimos 30 días</p>' +
        '<div class="kpis">' + kpis().map(function (k) {
          return '<div class="kpi' + (dest.indexOf(k.id) >= 0 ? ' destacado' : '') + '"><span title="' + esc(k.l) + '">' + esc(k.l) + '</span><strong>' + k.v + '</strong><em class="' + (k.clase || '') + '">' + esc(k.em || '') + '</em></div>';
        }).join('') + '</div>' +
        '<div class="rejilla r-21" style="margin-top:14px">' +
          '<div class="tarjeta"><h3>Requieren atención <span class="sub">¿Dónde hay que actuar ahora?</span></h3><div class="lista" style="margin-top:8px">' + (at.slice(0, 6).map(filaContacto).join('') || '<p class="vacio">Nada urgente.</p>') + '</div>' +
          (at.length > 6 ? '<button class="btn btn-fantasma btn-mini" data-vista="oportunidades" style="margin-top:6px">Ver las ' + at.length + '</button>' : '') + '</div>' +
          '<div class="rejilla">' +
            (fg ? '<div class="tarjeta fuga-grande" data-vista="recorrido" style="cursor:pointer"><h3>Dónde se pierde más <span class="sub">Últimos 30 días</span></h3><div class="cifra">' + M.num(fg.recuperables) + ' ' + TA().contactos + '</div><p class="gris">Se quedan entre <b>' + esc(fg.de.txt) + '</b> y <b>' + esc(fg.a.txt) + '</b>: solo pasa el ' + M.pct(fg.conv) + ', cuando con un buen seguimiento pasa el ' + M.pct(fg.ref) + '.</p></div>' : '') +
            '<div class="tarjeta"><h3>Qué está haciendo el sistema <span class="sub">Piloto automático</span></h3><div style="margin-top:6px">' + pintaFeed(feed(6)) + '</div></div>' +
          '</div>' +
        '</div>';
    },

    inteligencia: function () {
      const cfg = estado.cfg, T = cfg.t, cs = estado.contactos;
      const eventos = cs.reduce(function (a, c) { return a + M.timeline(c, cfg, estado.ahora).length; }, 0);
      const sen = cs.reduce(function (a, c) { return a + c.x.senales.length; }, 0);
      const solas = cs.filter(function (c) { return ['agente', 'voz', 'auto'].indexOf(c.x.nba.tipo) >= 0 && c.x.nba.estado !== 'cerrado'; }).length;
      const hum = cs.filter(function (c) { return c.x.nba.tipo === 'humano'; }).length;
      const citas = cs.filter(function (c) { return c.s.tCita != null && c.s.tCita > estado.ahora; }).length;
      const ganados = cs.filter(function (c) { return c.fin; }).length;
      const pasos = [
        ['DATOS', M.num(eventos), 'eventos: anuncios, web, CRM, WhatsApp, voz'],
        ['INTELIGENCIA', M.num(cs.length * 4), 'puntuaciones calculadas'],
        ['SEÑALES', sen, 'cambios que piden actuar'],
        ['DECISIÓN', cs.length, 'siguientes acciones con su porqué'],
        ['ACCIÓN', solas, 'las hace el sistema solo; ' + hum + ' van a una persona'],
        ['RESULTADO', citas, T.cita + 's agendadas'],
        ['APRENDIZAJE', ganados, 'cierres que recalibran el modelo']
      ];
      // Mapa encaje × intención
      const puntos = cs.filter(function (c) { return !c.fin; }).map(function (c) {
        const col = { urgente: 'var(--coral)', alta: '#E0A43A', media: 'var(--azul)', baja: '#B9BBBF' }[c.x.prio];
        const tam = 10 + Math.min(14, Math.sqrt(c.valor || 0) / 8);
        let h = 0; for (let i = 0; i < c.id.length; i++) h = (h * 131 + c.id.charCodeAt(i)) >>> 0;
        const jx = (h % 7) - 3, jy = ((h >> 3) % 7) - 3;
        return '<span class="punto" data-abrir="' + c.id + '" title="' + esc(c.n + ' · encaje ' + c.x.fit + ' · intención ' + c.x.int) + '" style="left:' + Math.max(3, Math.min(97, 4 + c.x.fit * 0.9 + jx * 0.6)) + '%;bottom:' + Math.max(3, Math.min(95, 5 + c.x.int * 0.88 + jy * 0.6)) + '%;width:' + tam + 'px;height:' + tam + 'px;background:' + col + '"></span>';
      }).join('');
      const reglasFit = (cfg.reglas.fit || []).slice(0, 9).map(function (r) {
        const txt = r[3] || (typeof r[2] === 'function' ? r[2]({ tam: '50+', rol: 'rol que decide', f: { exp: 3 }, s: {}, n: '' }, {}, T) : r[2]);
        return '<li><span>' + esc(String(txt).replace(/^./, function (x) { return x.toUpperCase(); })) + '</span><b class="' + (r[1] < 0 ? 'neg' : '') + '">' + (r[1] > 0 ? '+' : '') + r[1] + '</b></li>';
      }).join('');
      return cabecera('Inteligencia', '¿Por qué está pasando?', 'Cada ' + T.contacto + ' tiene cuatro puntuaciones que se recalculan con cada cosa que hace. De ahí salen la prioridad, la señal y la siguiente acción. El mismo motor en todos los sectores; cambian los datos y las reglas de encaje.') +
        '<div class="flujo">' + pasos.map(function (p) { return '<div class="paso-f"><small>' + p[0] + '</small><strong>' + p[1] + '</strong><span>' + esc(p[2]) + '</span></div>'; }).join('') + '</div>' +
        '<div class="rejilla r-21" style="margin-top:14px">' +
          '<div class="tarjeta"><h3>Dónde está la oportunidad <span class="sub">Encaje × intención · el tamaño es el valor</span></h3><div class="mapa" style="margin-top:10px">' +
            '<span class="cuad" style="right:10px;top:8px;color:var(--coral)">Trabajar ya</span><span class="cuad" style="left:10px;top:8px">Interés sin encaje</span><span class="cuad" style="right:10px;bottom:24px">Buen perfil, frío: nutrir</span><span class="cuad" style="left:10px;bottom:24px">No gastar tiempo</span>' +
            puntos + '</div><div class="gris" style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:600;margin-top:6px"><span>↑ más intención</span><span>más encaje →</span></div></div>' +
          '<div class="rejilla">' +
            '<div class="tarjeta"><h3>Cómo se calcula el encaje</h3><p class="gris" style="font-size:12.5px;margin-top:4px">¿Es el tipo de ' + T.cliente + ' que queremos?</p><ul class="reglas">' + reglasFit + '</ul></div>' +
            '<div class="tarjeta"><h3>Y las otras tres</h3><ul class="reglas">' +
              '<li><span><b style="font-weight:700">Actividad</b> · qué está haciendo: visitas, respuestas, lo reciente</span></li>' +
              '<li><span><b style="font-weight:700">Intención</b> · cuánto quiere: precio, urgencia, ' + T.cita + ', ' + T.propuesta.replace(/^la /, '') + '</span></li>' +
              '<li><span><b style="font-weight:700">Riesgo</b> · qué se puede perder: sin respuesta, sin seguimiento, no-show</span></li>' +
              '<li><span><b style="font-weight:700">Prioridad</b> · combina las cuatro y explica el porqué en una frase</span></li></ul></div>' +
          '</div></div>';
    },

    oportunidades: function () {
      const cfg = estado.cfg, T = cfg.t;
      const f = estado.filtro;
      const cuenta = { atencion: 0, todos: estado.contactos.length, urgente: 0, alta: 0, media: 0, baja: 0 };
      estado.contactos.forEach(function (c) { cuenta[c.x.prio]++; if (c.x.atencion) cuenta.atencion++; });
      const lista = estado.contactos.filter(function (c) { return f === 'todos' ? true : f === 'atencion' ? c.x.atencion : c.x.prio === f; });
      const filtros = [['atencion', 'Requieren atención'], ['todos', 'Todos'], ['urgente', 'Urgente'], ['alta', 'Alta'], ['media', 'Media'], ['baja', 'Baja']];
      return cabecera('Oportunidades', '¿Dónde existe una oportunidad?', 'Ordenadas por prioridad. Pulsa en cualquier ' + T.contacto + ' para ver por qué está ahí y qué va a pasar ahora.') +
        '<div class="filtros">' + filtros.map(function (x) { return '<button class="filtro" type="button" data-filtro="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + x[1] + ' <small>' + cuenta[x[0]] + '</small></button>'; }).join('') + '</div>' +
        '<div class="tabla-caja"><table class="tabla tabla-op"><colgroup><col style="width:27%"><col class="ocultar-movil" style="width:17%"><col class="ocultar-movil" style="width:150px"><col style="width:96px"><col class="ocultar-movil"></colgroup><thead><tr><th>' + esc(T.Contacto) + '</th><th class="ocultar-movil">Etapa</th><th class="ocultar-movil">Puntuaciones</th><th>Prioridad</th><th class="ocultar-movil">Siguiente acción</th></tr></thead><tbody>' +
        lista.map(function (c) {
          const us = ultimaSenal(c);
          return '<tr class="clic' + (estado.nuevos[c.id] ? ' nuevo' : '') + '" data-abrir="' + c.id + '"><td><div class="quien-fila">' + avatar(c) + '<div style="min-width:0"><div class="nombre">' + esc(c.n) + '</div><div class="meta">' + esc(metaContacto(c)) + '</div></div></div></td>' +
            '<td class="ocultar-movil"><div style="font-weight:600;white-space:nowrap">' + esc(c.etapaTxt || cfg.etapaTxt(c.etapa)) + '</div><div class="meta" style="max-width:150px">' + esc(c.prod) + '</div></td>' +
            '<td class="ocultar-movil">' + miniScores(c.x) + '</td><td>' + pillPrio(c.x.prio) + '</td>' +
            '<td class="ocultar-movil"><div class="nba-corta">' + ico(icoAccion(c.x.nba.tipo)) + '<span>' + esc(c.x.nba.accion) + '</span></div><div class="meta">' + esc(us.txt) + ' · ' + M.hace(M.desde(us.t, estado.ahora)) + '</div></td></tr>';
        }).join('') + '</tbody></table>' + (lista.length ? '' : '<p class="vacio">No hay ' + T.contactos + ' en este filtro.</p>') + '</div>';
    },

    conversaciones: function () {
      const cfg = estado.cfg, T = cfg.t;
      const con = estado.contactos.filter(function (c) { return c.conv.length; }).sort(function (a, b) { return b.conv[b.conv.length - 1].t - a.conv[a.conv.length - 1].t; });
      if (!estado.convSel || !contacto(estado.convSel) || !contacto(estado.convSel).conv.length) estado.convSel = con[0] && con[0].id;
      const sel = contacto(estado.convSel);
      const lado = con.map(function (c) {
        const u = c.conv[c.conv.length - 1];
        const qui = u.de === 'c' ? '' : u.de === 'h' ? 'Equipo: ' : 'Agente: ';
        return '<div class="conv-el" data-conv="' + c.id + '" aria-current="' + (c.id === estado.convSel) + '"><div class="l1"><b>' + esc(c.n) + '</b><time>' + M.fechaCorta(u.t, estado.ahora) + '</time></div><p>' + esc(qui + u.texto) + '</p><div class="l3">' + pillPrio(c.x.prio) + '<span class="pill t-gris">' + esc(M.ESTADOS[c.x.nba.estado]) + '</span></div></div>';
      }).join('');
      let hilo = '<p class="vacio">Sin conversaciones.</p>';
      if (sel) {
        hilo = '<div class="hilo-conv"><div class="hilo-cab"><div class="quien-fila">' + avatar(sel) + '<div><div class="nombre">' + esc(sel.n) + '</div><div class="meta">' + esc(metaContacto(sel)) + '</div></div></div><button class="btn btn-mini" data-abrir="' + sel.id + '">Ver ficha</button></div>' +
          '<div class="burbujas">' + sel.conv.filter(function (m) { return m.t <= estado.ahora; }).map(function (m) {
            const quien = m.de === 'c' ? sel.n.split(' ')[0] : m.de === 'a' ? 'Agente de WhatsApp' : m.de === 'v' ? 'Agente de voz' : 'Equipo';
            const ic = m.canal === 'email' ? 'correo' : m.canal === 'voz' ? 'voz' : 'whatsapp';
            return '<div class="burbuja ' + m.de + '"><small>' + ico(ic) + esc(quien) + ' · ' + M.fechaCorta(m.t, estado.ahora) + '</small>' + esc(m.texto) + '</div>';
          }).join('') + '</div>' +
          '<div class="hilo-pie">' + ico(icoAccion(sel.x.nba.tipo)) + '<span><b>' + esc(sel.x.nba.accion) + '</b> · ' + esc(sel.x.nba.quien) + ' · ' + esc(M.ESTADOS[sel.x.nba.estado]) + '</span></div></div>';
      }
      return cabecera('Conversaciones', '¿Qué está haciendo el sistema?', 'WhatsApp, correo y llamadas en un solo sitio. El agente escribe con el contexto de cada ' + T.contacto + ' y se aparta cuando hace falta una persona.') +
        '<div class="conv-caja"><div class="conv-lista">' + lado + '</div>' + hilo + '</div>';
    },

    recorrido: function () {
      const cfg = estado.cfg, T = TA(), m = M.mes(cfg);
      const fg = M.fugas(cfg);
      const peor = fg[0];
      const max = Math.max.apply(null, cfg.recorrido.filter(function (e, i) { return i > 0; }).map(function (e) { return m.tot[e.id] || 0; }));
      const filas = cfg.recorrido.map(function (e, i) {
        const v = m.tot[e.id] || 0;
        const prev = i > 0 ? m.tot[cfg.recorrido[i - 1].id] : 0;
        const conv = i > 0 && prev ? v / prev : null;
        const esFuga = peor && peor.a.id === e.id;
        if (i === 0) return '<div class="eb-fila"><span class="et">' + esc(e.txt) + '</span><span class="gris" style="font-size:12px">' + M.num(v) + ' clics en anuncios</span><span></span><span></span></div>';
        return '<div class="eb-fila' + (esFuga ? ' fuga' : '') + '"><span class="et">' + esc(e.txt) + '</span><div class="eb-barra"><i style="width:' + Math.max(2, Math.min(100, v / max * 100)) + '%"></i></div><span class="n">' + M.num(v) + '</span><span class="conv">' + (conv != null && i > 1 ? M.pct(conv) : '') + '</span></div>';
      }).join('');
      const nombres = cfg.nombresFuga || {};
      const tablaFugas = fg.map(function (f) {
        const n = nombres[f.a.id] || { txt: f.a.txt, exp: '' };
        return '<tr><td><b>' + esc(n.txt) + '</b><div class="meta">hasta ' + esc(f.a.txt.toLowerCase()) + '</div></td><td class="num">' + M.pct(f.conv) + '</td><td class="num gris">' + M.pct(f.ref) + '</td><td class="num" style="color:' + (f.recuperables > 0 ? 'var(--coral)' : 'inherit') + ';font-weight:700">' + (f.recuperables > 0 ? '+' + M.num(f.recuperables) : '—') + '</td></tr>';
      }).join('');
      const cols = cfg.recorrido.slice(1).map(function (e, i) {
        const idx = i + 1;
        const cs = estado.contactos.filter(function (c) { return c.etapa === idx && c.fin !== 'perdido'; });
        return '<div class="columna"><h4><span>' + esc(e.txt) + '</span><span class="gris-2">' + cs.length + '</span></h4>' + cs.map(function (c) {
          return '<div class="chipc" data-abrir="' + c.id + '"><b>' + esc(c.n) + '</b><span>' + pillPrio(c.x.prio) + '<em style="font-style:normal">' + M.euros(c.valor) + '</em></span></div>';
        }).join('') + '</div>';
      }).join('');
      return cabecera('Recorrido', '¿Dónde se pierde el negocio?', 'Del anuncio a ' + T.laVenta + '. Cada salto compara lo que pasa hoy con lo que pasa cuando el seguimiento está bien hecho.') +
        '<div class="rejilla r-2"><div class="tarjeta"><h3>Últimos 30 días <span class="sub">% que pasa de la etapa anterior</span></h3><div class="embudo" style="margin-top:12px">' + filas + '</div></div>' +
        '<div class="tarjeta"><h3>Fugas, de mayor a menor</h3><div class="tabla-caja" style="margin-top:10px;border:0"><table class="tabla"><thead><tr><th>Fuga</th><th class="num">Hoy</th><th class="num">Bien hecho</th><th class="num">Al mes</th></tr></thead><tbody>' + tablaFugas + '</tbody></table></div>' +
        (peor ? '<p class="gris" style="font-size:12.5px;margin-top:10px">La mayor: <b style="color:var(--tinta)">' + esc((nombres[peor.a.id] || {}).exp || '') + '</b>.</p>' : '') + '</div></div>' +
        (cfg.sinColumnas ? '' : '<p class="pregunta-guia" style="margin:20px 0 8px">Hoy en el sistema, por etapa</p><div class="columnas">' + cols + '</div>');
    },

    senales: function () {
      const T = estado.cfg.t;
      const todas = [];
      estado.contactos.forEach(function (c) { c.x.senales.forEach(function (s) { todas.push({ s: s, c: c }); }); });
      todas.sort(function (a, b) { return (b.s.humano - a.s.humano) || (b.s.t - a.s.t); });
      const tipos = {};
      todas.forEach(function (x) { tipos[x.s.tipo] = (tipos[x.s.tipo] || 0) + 1; });
      const f = estado.filtroSenal;
      const lista = todas.filter(function (x) { return f === 'todas' ? true : f === 'humano' ? x.s.humano : x.s.tipo === f; });
      const nh = todas.filter(function (x) { return x.s.humano; }).length;
      return cabecera('Señales', '¿Dónde existe un riesgo o una oportunidad?', 'Lo que el sistema ha detectado solo. Cada señal dice quién, qué ha pasado, por qué importa, qué se ha hecho ya y si hace falta una persona.') +
        '<div class="filtros"><button class="filtro" data-fsenal="todas" aria-pressed="' + (f === 'todas') + '">Todas <small>' + todas.length + '</small></button><button class="filtro" data-fsenal="humano" aria-pressed="' + (f === 'humano') + '">Requieren persona <small>' + nh + '</small></button>' +
        Object.keys(tipos).map(function (k) { return '<button class="filtro" data-fsenal="' + k + '" aria-pressed="' + (f === k) + '">' + M.TIPOS_SENAL[k].txt + ' <small>' + tipos[k] + '</small></button>'; }).join('') + '</div>' +
        '<div class="tarjeta" style="padding:0">' + (lista.map(function (x) {
          const ts = M.TIPOS_SENAL[x.s.tipo];
          return '<div class="senal" data-abrir="' + x.c.id + '"><span class="senal-ico t-' + ts.tono + '">' + ico(ts.ico) + '</span><div style="min-width:0"><h4>' + esc(ts.txt) + ' · ' + esc(x.c.n) + (x.s.humano ? ' <span class="humano-tag">' + ico('persona') + 'Requiere persona</span>' : '') + '</h4><p>' + esc(x.s.que) + '</p><p class="importa">' + esc(x.s.importa) + '</p></div>' +
            '<div class="lado"><span>' + M.hace(M.desde(x.s.t, estado.ahora)) + '</span><span class="tomada">' + ico('check') + esc(x.s.accion) + '</span>' + pillPrio(x.c.x.prio) + '</div></div>';
        }).join('') || '<p class="vacio">Sin señales en este filtro.</p>') + '</div>';
    },

    anuncios: function () {
      const cfg = estado.cfg, T = TA(), a = anuncios();
      const peor = a.filas.filter(function (f) { return f.c.inversion > 0; }).sort(function (x, y) { return x.roas - y.roas; })[0];
      const masEntra = a.filas.filter(function (f) { return f.c.inversion > 0; }).sort(function (x, y) { return y.entra - x.entra; })[0];
      const filas = a.filas.slice().sort(function (x, y) { return (y.roas || 0) - (x.roas || 0); }).map(function (f) {
        return '<tr><td style="min-width:170px"><div style="font-weight:700">' + esc(f.c.nombre) + '</div><div class="meta">' + esc(f.c.canal) + (f.c.inversion ? ' · ' + M.euros(f.c.inversion) : ' · sin inversión') + '</div></td>' +
          '<td class="num">' + M.num(f.entra) + '<div class="meta">' + (f.cpl ? M.euros(f.cpl) + ' c/u' : '—') + '</div></td>' +
          '<td class="num ocultar-movil">' + (f.fitMedio != null ? '<b>' + f.fitMedio + '</b>' : '—') + '<div class="meta">' + f.n + ' en el sistema</div></td>' +
          '<td class="num">' + M.num(f.ventas) + '<div class="meta">' + (f.cpv ? M.euros(f.cpv) + ' c/u' : 'orgánico') + '</div></td>' +
          '<td class="num">' + (f.roas != null ? '<b>' + M.num(f.roas, 1) + '×</b>' : '—') + '</td>' +
          '<td><span class="pill ' + f.ver.tono + '">' + esc(f.ver.txt) + '</span><div class="meta" style="white-space:normal;max-width:none;margin-top:4px">' + esc(f.ver.por) + '</div></td></tr>';
      }).join('');
      const maxEv = Math.max.apply(null, a.eventos.map(function (e) { return e.n; }));
      return cabecera('Anuncios', '¿Qué anuncio trae clientes de verdad?', T.anunciosIntro || 'Vuestra agencia sigue llevando las campañas. El sistema une cada anuncio con lo que pasa después (quién encaja, quién se pierde en el seguimiento, quién compra) y se lo devuelve, para que optimice a ' + T.laVenta + ' y no al formulario.') +
        (masEntra && peor ? '<div class="tarjeta" style="margin-bottom:14px;display:flex;gap:14px;align-items:flex-start"><span class="feed-ico t-coral" style="width:34px;height:34px;border-radius:10px;flex:none">' + ico('anuncio') + '</span><p style="font-size:14px"><b>' + esc(masEntra.c.nombre) + '</b> trae más ' + T.contactos + ' que ninguna (' + M.num(masEntra.entra) + ' a ' + M.euros(masEntra.cpl) + ') y ' + M.pl(masEntra.ventas, T.venta, T.ventas) + '. El anuncio más barato no es el que más vende: sin esta capa, la plataforma sigue premiando lo barato.</p></div>' : '') +
        '<div class="tabla-caja"><table class="tabla"><thead><tr><th>Campaña</th><th class="num">' + esc(T.Contactos) + '</th><th class="num ocultar-movil">Encaje medio</th><th class="num">' + esc(T.Ventas) + '</th><th class="num">Retorno</th><th>Lo que dice el sistema</th></tr></thead><tbody>' + filas + '</tbody></table></div>' +
        '<div class="rejilla r-2" style="margin-top:14px">' +
          '<div class="tarjeta"><h3>Lo que vuelve a las plataformas <span class="sub">Últimos 30 días</span></h3><p class="gris" style="font-size:12.5px;margin:4px 0 12px">Cada paso del recorrido se devuelve a ' + esc(M.unir(a.canales)) + ' como conversión, con su valor. Así el algoritmo aprende a buscar gente que ' + esc(T.convierten) + ', no gente que rellena formularios.</p>' +
            '<div class="embudo">' + a.eventos.map(function (e) { return '<div class="eb-fila"><span class="et">' + esc(e.etapa) + '</span><div class="eb-barra"><i style="width:' + Math.max(3, e.n / maxEv * 100) + '%"></i></div><span class="n">' + M.num(e.n) + '</span><span class="conv gris" style="font-weight:600">' + (e.valor ? '+ €' : '') + '</span></div>'; }).join('') + '</div></div>' +
          '<div class="tarjeta"><h3>' + esc(T.notaTitulo || 'Nota de esta semana para la agencia') + ' <span class="sub">Se genera sola</span></h3><ul style="margin:10px 0 12px;padding-left:18px;display:grid;gap:8px;font-size:13px">' + notaAgencia().map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul><button class="btn btn-mini" type="button" data-agencia>' + esc(T.notaBoton || 'Redactar el correo para la agencia') + '</button></div>' +
        '</div>';
    },

    agentes: function () {
      const T = estado.cfg.t, cs = estado.contactos;
      const abiertos = cs.filter(function (c) { return !c.fin; });
      const cual = abiertos.filter(function (c) { return c.etapa <= 2; });
      const seg = cs.filter(function (c) { return c.x.nba.tipo === 'agente' && ['wa', 'wa-seguir', 'reenganche', 'reprogramar', 'propuesta', 'desbloquear'].indexOf(c.x.nba.id) >= 0; });
      const react = cs.filter(function (c) { return c.s.luego || c.x.nba.id === 'nada' || (c.x.k.act > 14 * 1440 && !c.fin); });
      const reactProg = cs.filter(function (c) { return c.x.nba.id === 'esperar' && c.s.luego; });
      const hoy = []; cs.forEach(function (c) { c.x.senales.forEach(function (s) { if (estado.ahora - s.t < 1440 * M.MIN) hoy.push({ s: s, c: c }); }); });
      const voz = cs.filter(function (c) { return c.x.nba.id === 'voz'; });
      const auto = cs.filter(function (c) { return c.x.nba.tipo === 'auto' && c.x.nba.estado !== 'cerrado'; });
      const li = function (lista, txt) { return '<ul>' + lista.slice(0, 3).map(function (c) { return '<li data-abrir="' + c.id + '"><b style="font-weight:600">' + esc(c.n) + '</b><span>' + esc(txt(c)) + '</span></li>'; }).join('') + '</ul>'; };
      const card = function (icono, tono, nombre, n, unidad, que, lista) {
        return '<div class="tarjeta agente"><div class="cab-ag"><span class="feed-ico ' + tono + '">' + ico(icono) + '</span><h3>' + nombre + '</h3><span class="estado"><i></i>Activo</span></div><div class="grande">' + n + '<span>' + unidad + '</span></div><p class="que">' + que + '</p>' + lista + '</div>';
      };
      return cabecera('Agentes', '¿Qué está haciendo el sistema?', 'No son personajes: son procesos que trabajan en segundo plano, cada uno con una tarea concreta y un límite claro de hasta dónde llega.') +
        '<div class="rejilla r-3">' +
          card('diana', 't-teal', 'Cualificación', cual.length, T.contactos + ' analizando', 'Completa la ficha, calcula el encaje y decide si merece tiempo del equipo.', li(cual, function (c) { return 'encaje ' + c.x.fit; })) +
          card('whatsapp', 't-teal', 'Seguimiento', seg.length, 'conversaciones activas', 'Contesta en el minuto uno, retoma conversaciones paradas y recupera ' + T.propuesta.replace(/^la /, '') + 's. Nunca da precios: eso lo lleva una persona.', li(seg, function (c) { return c.x.nba.accion.toLowerCase(); })) +
          card('ciclo', 't-lila', 'Reactivación', react.length, 'contactos analizados', reactProg.length + ' reactivaciones programadas en la fecha que dijeron. Al resto no se le molesta.', li(reactProg.length ? reactProg : react, function (c) { return c.s.luego ? 'en ' + c.s.luego : 'guardado'; })) +
          card('senales', 't-amber', 'Inteligencia de ' + T.cliente, hoy.length, 'señales nuevas hoy', 'Vigila cambios de comportamiento: intención que sube, silencios, riesgo de no-show.', '<ul>' + hoy.slice(0, 3).map(function (x) { return '<li data-abrir="' + x.c.id + '"><b style="font-weight:600">' + esc(x.c.n) + '</b><span>' + esc(M.TIPOS_SENAL[x.s.tipo].txt.toLowerCase()) + '</span></li>'; }).join('') + '</ul>') +
          card('voz', 't-coral', 'Agente de voz', voz.length, 'llamadas programadas', 'Llama a quien no contesta por escrito, siempre dentro de su franja horaria. Si coge, cualifica y agenda.', li(voz, function (c) { return c.canal === 'tel' ? 'prefiere teléfono' : 'no contesta al WhatsApp'; })) +
          card('auto', 't-gris', 'Automatizaciones', auto.length, 'en cola', 'Recordatorios de ' + T.cita + ', casos de éxito y respuestas de cierre. Lo que no necesita pensar, pero sí hacerse siempre.', li(auto, function (c) { return c.x.nba.accion.toLowerCase(); })) +
        '</div>' +
        '<div class="tarjeta" style="margin-top:14px"><h3>Piloto automático <span class="sub">Últimas 48 horas</span></h3><div style="margin-top:6px">' + pintaFeed(feed(14)) + '</div></div>';
    }
  };

  // ---------------------------------------------------------------------------
  // Ficha del contacto
  // ---------------------------------------------------------------------------
  function scoresHtml(x, antes) {
    const s = function (id, l, v, pregunta, cls) {
      const sube = antes && antes[id] != null && v > antes[id];
      return '<div class="score ' + (cls || '') + (sube ? ' sube' : '') + '"><span>' + l + '</span><strong>' + v + '</strong><div class="barra-s"><i style="width:' + v + '%"></i></div><em>' + pregunta + '</em></div>';
    };
    return '<div class="scores">' + s('fit', 'Encaje', x.fit, '¿Es el cliente que queremos?') + s('comp', 'Actividad', x.comp, '¿Qué está haciendo?') + s('int', 'Intención', x.int, '¿Cuánto quiere comprar?') + s('riesgo', 'Riesgo', x.riesgo, '¿Qué se puede perder?', 'riesgo') + '</div>';
  }
  QV.scoresHtml = scoresHtml;

  function abrirFicha(id, foco) {
    const c = contacto(id);
    if (!c) return;
    estado.fichaId = id;
    const cfg = estado.cfg, T = cfg.t, x = c.x;
    const tl = M.timeline(c, cfg, estado.ahora);
    const icoTl = { origen: 'anuncio', web: 'web', form: 'formulario', respuesta: 'whatsapp', sistema: 'auto' };
    const camp = cfg.campana(c.orig);
    const datos = [['Etapa', c.etapaTxt || cfg.etapaTxt(c.etapa)], [T.Producto || 'Interés', c.prod], ['Valor', M.euros(c.valor)], ['Origen', camp ? camp.canal + ' · ' + camp.nombre : 'Web'], ['Ciudad', c.ciudad], ['Canal preferido', c.canal === 'email' ? 'Correo' : c.canal === 'tel' ? 'Teléfono' : 'WhatsApp']];
    const nba = x.nba;
    $('#ficha').innerHTML =
      '<div class="ficha-cab"><div class="l1">' + avatar(c) + '<div><h2>' + esc(c.n) + '</h2><div class="meta" style="font-size:13px">' + esc(metaContacto(c)) + '</div></div>' + pillPrio(x.prio) + '<button class="btn btn-icono" type="button" data-cerrar-ficha aria-label="Cerrar">' + ico('cerrar') + '</button></div>' +
      '<div class="datos">' + datos.filter(function (d) { return d[1] && d[1] !== '—'; }).map(function (d) { return '<span>' + esc(d[0]) + ': <b>' + esc(d[1]) + '</b></span>'; }).join('') + '</div></div>' +
      '<div class="ficha-cuerpo">' +
        '<div><p class="bloque-t">Inteligencia</p>' + scoresHtml(x) + '</div>' +
        '<div><p class="bloque-t">Por qué</p><div class="porque-caja">' + esc(x.porque) + '</div></div>' +
        '<div><p class="bloque-t">Siguiente mejor acción</p><div class="nba-caja' + (nba.tipo === 'humano' ? ' humano' : '') + '"><h3>' + ico(icoAccion(nba.tipo)) + esc(nba.accion) + '</h3><p>' + esc(nba.por) + '</p>' +
          '<div class="pie"><span class="estado-ag ' + (nba.estado === 'humano' || nba.estado === 'escalado' ? 'humano' : nba.estado) + '"><i></i>' + esc(nba.quien) + ' · ' + esc(M.ESTADOS[nba.estado]) + '</span><span style="flex:1"></span>' +
          '<button class="btn btn-mini" type="button" data-generar="' + c.id + '">Generar mensaje</button>' +
          (nba.id !== 'asignado' && !c.fin ? '<button class="btn btn-mini btn-primario" type="button" data-asignar="' + c.id + '">Asignar ' + esc(M.al(T.comercial)) + '</button>' : '') + '</div></div></div>' +
        '<div id="fichaTl"><p class="bloque-t">Línea de tiempo</p><div class="tarjeta"><div class="tl">' + tl.map(function (e) {
          return '<div class="tl-item ' + e.tipo + '"><time>' + M.fechaCorta(e.t, estado.ahora) + '</time><span class="dot">' + ico(icoTl[e.tipo] || 'auto') + '</span><p>' + esc(e.texto) + (e.detalle ? '<small>«' + esc(e.detalle) + '»</small>' : '') + '</p></div>';
        }).join('') + '</div></div></div>' +
      '</div>';
    $('#ficha').hidden = false;
    $('#velo').hidden = false;
    if (foco === 'timeline') { const el = $('#fichaTl'); if (el) el.scrollIntoView({ block: 'start' }); }
  }
  function cerrarFicha() { $('#ficha').hidden = true; $('#velo').hidden = true; estado.fichaId = null; }
  QV.abrirFicha = abrirFicha;
  QV.cerrarFicha = cerrarFicha;

  function asignar(id) {
    const c = contacto(id);
    if (!c) return;
    const T = estado.cfg.t;
    c.asignado = T.Comercial;
    estado.feed.push({ t: estado.ahora, ico: 'persona', tono: 't-coral', titulo: 'Asignado ' + M.al(T.comercial), quien: c.n, id: c.id, detalle: 'Con el resumen de la conversación y el porqué', nuevo: true });
    recalcular();
    pintarNav();
    pintarVista();
    if (estado.fichaId === id) abrirFicha(id);
    aviso(c.n.split(' ')[0] + ' asignado ' + M.al(T.comercial) + ', con todo el contexto', 'persona');
  }
  QV.asignar = asignar;

  // ---------------------------------------------------------------------------
  // Inicio
  // ---------------------------------------------------------------------------
  const eleccion = { sector: null, objetivo: 'todo' };
  function pintarInicio() {
    $('#inicioSectores').innerHTML = SECTORES.map(function (s) {
      return '<button type="button" class="sector-card" role="radio" aria-checked="' + (eleccion.sector === s.id) + '" data-sector="' + s.id + '">' + ico(s.ico) + '<strong>' + s.txt + '</strong><span>' + s.desc + '</span></button>';
    }).join('');
    $('#inicioObjetivos').innerHTML = OBJETIVOS.map(function (o) {
      return '<button type="button" class="obj-chip" role="radio" aria-checked="' + (eleccion.objetivo === o.id) + '" data-objetivo="' + o.id + '">' + o.txt + '</button>';
    }).join('');
    $('#inicioAbrir').disabled = !eleccion.sector;
  }
  function mostrarInicio() {
    if (QV.demo) QV.demo.parar(true);
    cerrarFicha();
    $('#app').hidden = true;
    $('#inicio').hidden = false;
    if (estado.empresa) $('#inicioEmpresa').value = estado.empresa;
    pintarInicio();
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* nada */ }
  }

  // ---------------------------------------------------------------------------
  // Eventos (delegados)
  // ---------------------------------------------------------------------------
  document.addEventListener('click', function (e) {
    const t = e.target.closest('[data-agencia],[data-sector],[data-objetivo],[data-vista],[data-abrir],[data-cerrar-ficha],[data-filtro],[data-fsenal],[data-conv],[data-asignar],[data-generar],[data-timeline]');
    if (!t) return;
    if (t.hasAttribute('data-agencia')) { if (QV.copilot) { QV.copilot.agencia(); if (window.innerWidth <= 1180) $('#copilot').classList.add('abierto'); } return; }
    if (t.dataset.sector) { eleccion.sector = t.dataset.sector; pintarInicio(); return; }
    if (t.dataset.objetivo) { eleccion.objetivo = t.dataset.objetivo; pintarInicio(); return; }
    if (t.dataset.vista) { cerrarFicha(); irA(t.dataset.vista); if (window.innerWidth <= 1180) $('#copilot').classList.remove('abierto'); return; }
    if (t.hasAttribute('data-cerrar-ficha')) { cerrarFicha(); return; }
    if (t.dataset.filtro) { estado.filtro = t.dataset.filtro; pintarVista(); return; }
    if (t.dataset.fsenal) { estado.filtroSenal = t.dataset.fsenal; pintarVista(); return; }
    if (t.dataset.conv) { estado.convSel = t.dataset.conv; pintarVista(); return; }
    if (t.dataset.asignar) { asignar(t.dataset.asignar); return; }
    if (t.dataset.generar) { if (QV.copilot) { QV.copilot.generar(t.dataset.generar); if (window.innerWidth <= 1180) { cerrarFicha(); $('#copilot').classList.add('abierto'); } } return; }
    if (t.dataset.timeline) { abrirFicha(t.dataset.timeline, 'timeline'); return; }
    if (t.dataset.abrir) { abrirFicha(t.dataset.abrir); return; }
  });
  $('#velo').addEventListener('click', cerrarFicha);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarFicha(); });
  $('#inicioAbrir').addEventListener('click', function () {
    if (!eleccion.sector) return;
    iniciar({ sector: eleccion.sector, objetivo: eleccion.objetivo, empresa: $('#inicioEmpresa').value }).catch(function (err) { aviso(err.message, 'alerta'); });
  });
  $('#btnInicio').addEventListener('click', mostrarInicio);
  $('#selSector').addEventListener('change', function (e) {
    iniciar({ sector: e.target.value, objetivo: estado.objetivo, empresa: estado.empresa, vista: estado.vista }).catch(function (err) { aviso(err.message, 'alerta'); });
  });
  $('#btnReiniciar').innerHTML = ico('reinicio');
  $('#btnReiniciar').addEventListener('click', function () {
    iniciar({ sector: estado.sectorId, objetivo: estado.objetivo, empresa: estado.empresa, historia: estado.historia }).then(function () { aviso('Demo reiniciada', 'reinicio'); });
  });
  $('#btnCopilotMovil').innerHTML = ico('chat');
  $('#btnCopilotMovil').addEventListener('click', function () { $('#copilot').classList.add('abierto'); });
  $('#btnCerrarCopilot').innerHTML = ico('cerrar');
  $('#btnCerrarCopilot').addEventListener('click', function () { $('#copilot').classList.remove('abierto'); });

  // Exponer lo que usan el Copilot y el modo demo
  Object.assign(QV, { esc: esc, avatar: avatar, pillPrio: pillPrio, metaContacto: metaContacto, icoAccion: icoAccion, ultimaSenal: ultimaSenal, contacto: contacto, atencion: atencion, recalcular: recalcular, aviso: aviso, pintarVista: pintarVista, pintarNav: pintarNav, pintarBarra: pintarBarra, iniciar: iniciar, SECTORES: SECTORES });

  // Arranque: enlace preparado o pantalla de inicio
  window.addEventListener('DOMContentLoaded', function () {
    const p = new URLSearchParams(location.search);
    const sector = p.get('sector');
    if (sector && SECTORES.some(function (s) { return s.id === sector; })) {
      iniciar({ sector: sector, empresa: p.get('empresa') || '', objetivo: p.get('objetivo') || 'todo', historia: p.get('historia') || '', vista: p.get('vista') || 'resumen' })
        .then(function () { if (p.get('demo') === '1' && QV.demo) QV.demo.empezar(); })
        .catch(function () { mostrarInicio(); });
    } else {
      mostrarInicio();
    }
  });
})();
