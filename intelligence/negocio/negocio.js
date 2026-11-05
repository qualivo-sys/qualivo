/* Panel de negocio Qualivo · módulo de Qualivo Intelligence.
 * Todo llega de /api/intelligence-negocio/ con la sesión (usuario y contraseña comprobados
 * en el servidor). Este archivo no lleva ni un dato: solo cómo se pintan. */
(function () {
  'use strict';
  const API = '/api/intelligence-negocio/';
  const ico = function (n) { return window.QV && window.QV.ico ? window.QV.ico(n) : ''; };
  const $ = function (s) { return document.querySelector(s); };

  const SECCIONES = [
    { id: 'resumen', txt: 'Resumen', ico: 'resumen', periodo: true },
    { id: 'paid', txt: 'Paid', ico: 'anuncio', periodo: true },
    { id: 'leads', txt: 'Leads', ico: 'persona' },
    { id: 'outbound', txt: 'Outbound', ico: 'correo', periodo: true },
    { id: 'crm', txt: 'CRM', ico: 'oportunidades' },
    { id: 'clientes', txt: 'Clientes', ico: 'b2b' },
    { id: 'redes', txt: 'Redes', ico: 'instagram' },
    { id: 'finanzas', txt: 'Finanzas', ico: 'euro' }
  ];
  const E = { seccion: 'resumen', periodo: 'mes', desde: '', hasta: '', datos: {}, cargando: {}, errores: {}, yo: null, filtros: {}, cuentaIg: '' };

  // ---------------------------------------------------------------- formato
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  const nf0 = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nf1 = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 });
  function vacio(v) { return v == null || v === '' || (typeof v === 'number' && !isFinite(v)); }
  function eur(v, dec) { if (vacio(v)) return '—'; const n = Number(v); return (dec || Math.abs(n) < 100 ? nf2 : nf0).format(n) + ' €'; }
  function ent(v) { return vacio(v) ? '—' : nf0.format(v); }
  function pct(v, fraccion) { if (vacio(v)) return '—'; return nf1.format(fraccion ? v * 100 : v) + ' %'; }
  function fechaCorta(iso) { if (!iso) return '—'; const p = String(iso).slice(0, 10).split('-'); return p.length === 3 ? p[2] + '/' + p[1] : iso; }
  function hora(t) { return t ? new Date(t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''; }
  function hoyISO() { return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' }); }

  // ---------------------------------------------------------------- red
  async function api(params, cuerpo) {
    const url = API + '?' + new URLSearchParams(params).toString();
    const r = await fetch(url, cuerpo ? { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) } : { credentials: 'same-origin' });
    let d = {};
    try { d = await r.json(); } catch (e) { /* nada */ }
    if (r.status === 401 && params.accion !== 'entrar') { mostrarEntrada(); throw new Error('Sin sesión'); }
    if (!r.ok) throw new Error(d.error || ('Error ' + r.status));
    return d;
  }
  function clave(sec) {
    const s = SECCIONES.filter(function (x) { return x.id === sec; })[0];
    return sec + (s && s.periodo ? '|' + E.periodo + '|' + E.desde + '|' + E.hasta : '') + (sec === 'redes' ? '|' + E.cuentaIg : '');
  }
  function cargar(sec, fresco) {
    const k = clave(sec);
    if (E.cargando[k]) return;
    E.cargando[k] = true; delete E.errores[k];
    const p = { seccion: sec, periodo: E.periodo };
    if (E.periodo === 'personalizado') { p.desde = E.desde; p.hasta = E.hasta; }
    if (sec === 'redes' && E.cuentaIg) p.cuenta = E.cuentaIg;
    if (fresco) p.fresco = '1';
    api(p).then(function (d) { E.datos[k] = d; }).catch(function (e) { E.errores[k] = e.message; })
      .then(function () { delete E.cargando[k]; if (clave(E.seccion) === k) pintar(); });
  }

  // ---------------------------------------------------------------- entrada
  function mostrarEntrada() {
    $('#app').hidden = true; $('#entrada').hidden = false;
    setTimeout(function () { $('#usuario').focus(); }, 30);
  }
  $('#formEntrada').addEventListener('submit', function (ev) {
    ev.preventDefault();
    const btn = ev.target.querySelector('button'); btn.disabled = true;
    $('#errorEntrada').hidden = true;
    api({ accion: 'entrar' }, { usuario: $('#usuario').value, clave: $('#clave').value })
      .then(function () { $('#clave').value = ''; return arrancar(); })
      .catch(function (e) { $('#errorEntrada').textContent = e.message; $('#errorEntrada').hidden = false; })
      .then(function () { btn.disabled = false; });
  });
  $('#btnSalir').addEventListener('click', function () {
    api({ accion: 'salir' }, {}).catch(function () {}).then(function () { E.datos = {}; mostrarEntrada(); });
  });

  async function arrancar() {
    try { E.yo = await api({ accion: 'yo' }); } catch (e) { if (e.message !== 'Sin sesión') { $('#entrada').hidden = false; $('#errorEntrada').textContent = e.message; $('#errorEntrada').hidden = false; } return; }
    $('#entrada').hidden = true; $('#app').hidden = false;
    $('#quien').textContent = 'Sesión: ' + E.yo.usuario;
    const h = location.hash.replace('#', '');
    if (SECCIONES.some(function (s) { return s.id === h; })) E.seccion = h;
    pintarNav(); pintar();
  }

  // ---------------------------------------------------------------- navegación
  function pintarNav() {
    $('#nav').innerHTML = SECCIONES.map(function (s) {
      return '<button type="button" data-sec="' + s.id + '"' + (s.id === E.seccion ? ' aria-current="page"' : '') + '>' + ico(s.ico) + '<span>' + s.txt + '</span></button>';
    }).join('');
    const s = SECCIONES.filter(function (x) { return x.id === E.seccion; })[0];
    $('#cajaPeriodo').hidden = !s.periodo;
    $('#cajaFechas').hidden = !s.periodo || E.periodo !== 'personalizado';
  }
  $('#nav').addEventListener('click', function (ev) {
    const b = ev.target.closest('[data-sec]'); if (!b) return;
    E.seccion = b.getAttribute('data-sec');
    history.replaceState(null, '', '#' + E.seccion);
    pintarNav(); pintar(); $('#vista').scrollTop = 0; window.scrollTo(0, 0);
  });
  $('#periodo').addEventListener('change', function (ev) {
    E.periodo = ev.target.value;
    if (E.periodo === 'personalizado') {
      if (!E.desde) { E.hasta = hoyISO(); E.desde = E.hasta.slice(0, 8) + '01'; }
      $('#desde').value = E.desde; $('#hasta').value = E.hasta;
    }
    pintarNav(); pintar();
  });
  $('#btnFechas').addEventListener('click', function () {
    if (!$('#desde').value || !$('#hasta').value || $('#desde').value > $('#hasta').value) return aviso('Elige dos fechas, la primera antes que la segunda.');
    E.desde = $('#desde').value; E.hasta = $('#hasta').value; pintar();
  });
  $('#btnRecargar').innerHTML = ico('reinicio');
  $('#btnRecargar').addEventListener('click', function () { cargar(E.seccion, true); pintar(); });

  // ---------------------------------------------------------------- piezas
  function cabecera(guia, titulo, texto) {
    return '<div class="titulo-vista"><div><p class="pregunta-guia">' + esc(guia) + '</p><h1>' + esc(titulo) + '</h1>' + (texto ? '<p>' + texto + '</p>' : '') + '</div></div>';
  }
  function kpi(l, v, em, cls) { return '<div class="kpi"><span title="' + esc(l) + '">' + esc(l) + '</span><strong>' + v + '</strong>' + (em ? '<em class="' + (cls || '') + '">' + esc(em) + '</em>' : '') + '</div>'; }
  function tarjeta(titulo, sub, cuerpo, extra) {
    return '<section class="tarjeta"><div class="tarjeta-cab"><div><h3>' + esc(titulo) + '</h3>' + (sub ? '<p class="ng-sub">' + sub + '</p>' : '') + '</div>' + (extra || '') + '</div>' + cuerpo + '</section>';
  }
  function avisoCaja(t, error) { return '<p class="ng-aviso-caja' + (error ? ' error' : '') + '">' + esc(t) + '</p>'; }
  function cargando() { return '<div class="ng-cargando"><i></i>Leyendo las fuentes en vivo…</div>'; }
  // cols: [{t, k, num, f(v, fila) → html ya escapado, cls(v, fila)}]
  function tabla(cols, filas, opc) {
    opc = opc || {};
    if (!filas.length) return '<p class="ng-vacio">' + esc(opc.vacio || 'Sin datos.') + '</p>';
    return '<div class="ng-tabla-caja"><table class="tabla"><thead><tr>' + cols.map(function (c) { return '<th' + (c.num ? ' class="num"' : '') + '>' + esc(c.t) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      filas.map(function (f, i) {
        return '<tr' + (opc.fila ? ' ' + opc.fila(f, i) : '') + '>' + cols.map(function (c) {
          const v = c.k ? f[c.k] : null;
          const h = c.f ? c.f(v, f, i) : esc(vacio(v) ? '—' : v);
          const cl = (c.num ? 'num ' : '') + (c.cls ? c.cls(v, f) || '' : '');
          return '<td data-t="' + esc(c.t) + '"' + (cl.trim() ? ' class="' + cl.trim() + '"' : '') + '>' + h + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }
  function pill(t, tipo) { return '<span class="ng-pill ' + (tipo || '') + '">' + esc(t) + '</span>'; }

  // Barras + línea sobre un eje de categorías (SVG propio, ancho fluido)
  function combo(filas, o) {
    if (!filas.length) return '<p class="ng-vacio">Sin datos en este periodo.</p>';
    const vw = ($('#vista') && $('#vista').clientWidth) || 900;
    const W = Math.round(Math.max(300, Math.min(1300, (o.medio && vw > 1000 ? (vw - 110) / 2 : vw - 90)))), H = W < 480 ? 200 : 240, m = { t: 12, r: o.linea ? 40 : 12, b: 26, l: 56 };
    const n = filas.length, paso = (W - m.l - m.r) / n, ancho = Math.max(3, Math.min(30, paso * .62));
    const maxB = Math.max.apply(null, filas.map(function (f) { return Math.abs(f[o.barra] || 0); }).concat([1]));
    const minB = o.negativos ? Math.min.apply(null, filas.map(function (f) { return f[o.barra] || 0; }).concat([0])) : 0;
    const maxL = o.linea ? Math.ceil(Math.max.apply(null, filas.map(function (f) { return f[o.linea] || 0; }).concat([3])) / 3) * 3 : 1;
    const paso3 = function (v) { const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; };
    const top = !o.negativos ? paso3(maxB / 3) * 3 : o.negativos ? Math.max(0, Math.max.apply(null, filas.map(function (f) { return f[o.barra] || 0; }))) : maxB;
    const rango = (top - minB) || 1;
    const yB = function (v) { return m.t + (top - v) / rango * (H - m.t - m.b); };
    const yL = function (v) { return m.t + (1 - v / maxL) * (H - m.t - m.b); };
    let s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.titulo || 'Gráfico') + '">';
    for (let i = 0; i <= 3; i++) {
      const v = minB + rango * i / 3, y = yB(v);
      s += '<line class="ng-rej" x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + y + '" y2="' + y + '"/><text class="ng-eje" x="' + (m.l - 6) + '" y="' + (y + 3) + '" text-anchor="end">' + esc(o.fmtEje ? o.fmtEje(v) : ent(v)) + '</text>';
      if (o.linea) s += '<text class="ng-eje" x="' + (W - m.r + 6) + '" y="' + (yL(maxL * i / 3) + 3) + '">' + esc(ent(maxL * i / 3)) + '</text>';
    }
    const cada = Math.ceil(n / 10);
    filas.forEach(function (f, i) {
      const x = m.l + paso * i + (paso - ancho) / 2, v = f[o.barra] || 0;
      const y0 = yB(0), y1 = yB(v);
      s += '<rect class="ng-bar' + (v < 0 ? ' neg' : '') + '" x="' + x + '" y="' + Math.min(y0, y1) + '" width="' + ancho + '" height="' + Math.max(1, Math.abs(y1 - y0)) + '" rx="3"/>';
      if (i % cada === 0) s += '<text class="ng-eje" x="' + (x + ancho / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(o.fmtX ? o.fmtX(f[o.x]) : f[o.x]) + '</text>';
      s += '<rect class="ng-zona" data-i="' + i + '" x="' + (m.l + paso * i) + '" y="' + m.t + '" width="' + paso + '" height="' + (H - m.t - m.b) + '" fill="transparent"/>';
    });
    if (o.linea) {
      const pts = filas.map(function (f, i) { return (m.l + paso * i + paso / 2) + ',' + yL(f[o.linea] || 0); });
      s += '<polyline class="ng-lin" points="' + pts.join(' ') + '"/>' + filas.map(function (f, i) { return '<circle class="ng-pt" r="3" cx="' + (m.l + paso * i + paso / 2) + '" cy="' + yL(f[o.linea] || 0) + '"/>'; }).join('');
    }
    s += '</svg>';
    const id = 'g' + Math.random().toString(36).slice(2, 8);
    GRAFS[id] = { filas: filas, o: o };
    return '<div class="ng-graf" data-graf="' + id + '">' + s + '<div class="ng-tip" hidden></div></div>' +
      '<div class="ng-leyenda"><span><i' + (o.negativos ? ' class="c"' : '') + '></i>' + esc(o.nombreBarra) + '</span>' + (o.linea ? '<span><i class="l"></i>' + esc(o.nombreLinea) + '</span>' : '') + '</div>';
  }
  const GRAFS = {};
  document.addEventListener('mousemove', function (ev) {
    const z = ev.target.closest && ev.target.closest('.ng-zona');
    document.querySelectorAll('.ng-tip').forEach(function (t) { if (!z || !t.parentNode.contains(z)) t.hidden = true; });
    if (!z) return;
    const caja = z.closest('.ng-graf'), g = GRAFS[caja.getAttribute('data-graf')]; if (!g) return;
    const f = g.filas[Number(z.getAttribute('data-i'))], o = g.o, tip = caja.querySelector('.ng-tip');
    tip.innerHTML = '<b>' + esc(o.fmtX ? o.fmtX(f[o.x], true) : f[o.x]) + '</b>' + esc(o.nombreBarra) + ': ' + esc((o.fmtB || ent)(f[o.barra])) + (o.linea ? '<br>' + esc(o.nombreLinea) + ': ' + esc((o.fmtL || ent)(f[o.linea])) : '') + (o.extra ? o.extra(f) : '');
    const r = caja.getBoundingClientRect();
    tip.style.left = Math.max(60, Math.min(r.width - 60, ev.clientX - r.left)) + 'px';
    tip.style.top = (ev.clientY - r.top) + 'px';
    tip.hidden = false;
  });
  // Barras horizontales: items [{et, v, rojo?}]
  function hbarras(items, opc) {
    opc = opc || {};
    if (!items.length) return '<p class="ng-vacio">Sin datos.</p>';
    const max = Math.max.apply(null, items.map(function (i) { return i.v; }).concat([1]));
    return '<div class="ng-hbarras">' + items.map(function (i) {
      const rojo = i.rojo || 0;
      return '<div class="ng-hb"><span class="ng-et" title="' + esc(i.et) + '">' + esc(i.et) + '</span><span class="pista"><span class="' + (i.gris ? 'g' : '') + '" style="width:' + ((i.v - rojo) / max * 100) + '%"></span>' + (rojo ? '<span class="c" style="width:' + (rojo / max * 100) + '%"></span>' : '') + '</span><span class="ng-v">' + ent(i.v) + (rojo ? ' <small>(' + ent(rojo) + ')</small>' : '') + (opc.pct ? ' <small style="color:var(--gris-2)">' + pct(i.v / opc.pct, true) + '</small>' : '') + '</span></div>';
    }).join('') + '</div>';
  }
  function contar(obj, orden) {
    const ks = Object.keys(obj || {});
    const ord = orden ? orden.filter(function (k) { return ks.indexOf(k) >= 0; }).concat(ks.filter(function (k) { return orden.indexOf(k) < 0; }).sort(function (a, b) { return obj[b] - obj[a]; })) : ks.sort(function (a, b) { return obj[b] - obj[a]; });
    return ord.map(function (k) { return { et: k, v: obj[k] }; });
  }
  function fSemana(s, largo) { return largo ? 'Semana del ' + fechaCorta(s) : fechaCorta(s); }
  function fMes(m, largo) { const n = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][Number(String(m).slice(5, 7)) - 1]; return n ? n + (largo ? ' ' + String(m).slice(0, 4) : ' ' + String(m).slice(2, 4)) : m; }

  // ---------------------------------------------------------------- pintar
  function pintar() {
    const k = clave(E.seccion);
    const d = E.datos[k];
    const s = SECCIONES.filter(function (x) { return x.id === E.seccion; })[0];
    $('#actualizado').innerHTML = d && d.generado ? '<i></i>' + esc('Leído a las ' + hora(d.generado)) : '';
    let html;
    if (E.errores[k] && !d) html = cabecera('', s.txt) + avisoCaja('No se ha podido leer: ' + E.errores[k], true) + '<p style="margin-top:12px"><button class="btn" type="button" data-reintentar>Reintentar</button></p>';
    else if (!d) { cargar(E.seccion); html = cabecera('', s.txt) + cargando(); }
    else html = VISTAS[E.seccion](d) + (E.cargando[k] ? '<div class="ng-cargando"><i></i>Actualizando…</div>' : '');
    $('#vista').innerHTML = html;
    if (E.errores[k] && d) aviso('No se ha podido actualizar: ' + E.errores[k]);
  }
  $('#vista').addEventListener('click', function (ev) {
    if (ev.target.closest('[data-reintentar]')) { cargar(E.seccion, true); pintar(); }
  });

  const VISTAS = {};

  // ---------- Resumen ----------
  let RES = null;
  VISTAS.resumen = function (d) {
    RES = d;
    const k = d.kpis || {}, p = d.paid || {}, c = d.crm || {}, o = d.outbound || {}, l = d.leads || {}, h = d.hoy || {};
    const puede = d.acciones && d.acciones.puedes;
    const vs = function (v, obj) { return vacio(v) ? '' : 'objetivo ' + ent(obj) + ' · ' + pct(v / obj, true); };
    const errores = ['paid', 'crm', 'outbound', 'leads', 'hoy'].filter(function (x) { return d[x] && d[x].error; }).map(function (x) { return avisoCaja('No se ha podido leer ' + x + ': ' + d[x].error, true); }).join('') +
      Object.keys(d.errores || {}).filter(function (x) { return d.errores[x] && !(d[x] && d[x].error); }).map(function (x) { return avisoCaja('No se ha podido calcular ' + x + ': ' + d.errores[x], true); }).join('');
    const kp = '<div class="ng-kpis ng-kpis-6">' +
      kpi('RC del mes', ent(k.rcMes) + '<small> / ' + ent(k.objetivoRC) + '</small>', vacio(k.rcMes) ? 'sin datos' : ent(k.rcSemana) + ' esta semana', k.rcMes >= k.objetivoRC ? 'bien' : '') +
      kpi('Clientes nuevos del mes', ent(k.clientesNuevos) + '<small> / ' + ent(k.objetivoClientes) + '</small>', vs(k.clientesNuevos, k.objetivoClientes), k.clientesNuevos >= k.objetivoClientes ? 'bien' : '') +
      kpi('Gasto Meta del mes', eur(k.gastoMetaMes), vacio(k.gastoMetaMes) ? '' : pct(k.gastoMetaMes / k.topeMeta, true) + ' del tope de ' + eur(k.topeMeta), k.gastoMetaMes >= 0.85 * k.topeMeta ? 'mal' : '') +
      kpi('CPL de 7 días', eur(k.cpl7, true), 'objetivo ' + eur(k.cplObjetivo), vacio(k.cpl7) ? '' : k.cpl7 > k.cplObjetivo ? 'mal' : 'bien') +
      kpi('MRR confirmado', k.sinHoja ? '—' : eur(k.mrr), k.sinHoja ? 'sin conexión con la hoja' : 'cuotas de clientes', k.sinHoja ? 'aviso-kpi' : '') +
      kpi('Caja disponible', k.sinHoja ? '—' : eur(k.caja), k.sinHoja ? 'sin conexión con la hoja' : 'saldo en banco', k.sinHoja ? 'aviso-kpi' : '') +
      '</div>';
    const al = (d.alertas || []).length ? '<div class="ng-alertas">' + d.alertas.map(function (a) {
      return '<article class="ng-alerta ' + esc(a.nivel) + '"><div><h4>' + esc(a.que) + '</h4><dl><dt>Evidencia</dt><dd>' + esc(a.evidencia) + '</dd>' + (a.causa ? '<dt>Causa</dt><dd>' + esc(a.causa) + '</dd>' : '') + (a.impacto ? '<dt>Impacto</dt><dd>' + esc(a.impacto) + '</dd>' : '') + '<dt>Acción</dt><dd>' + esc(a.accion) + (a.ir ? ' <button class="btn btn-mini" type="button" data-ir="' + esc(a.ir) + '">Ir a ' + esc(SECCIONES.filter(function (x) { return x.id === a.ir; })[0].txt) + '</button>' : '') + '</dd></dl></div><div class="ng-alerta-lado"><span class="ng-quien-alerta">' + esc(a.responsable) + '</span><span class="gris-2" style="font-size:11px">' + esc(fechaCorta(a.fecha)) + '</span></div></article>';
    }).join('') + '</div>' : '<p class="ng-vacio">Nada fuera de lo normal ahora mismo.</p>';
    const hoyHtml = '<div class="ng-rejilla-3">' +
      '<div><p class="ng-embudo-t">Reuniones de hoy</p>' + ((h.reunionesHoy || []).length ? '<ul class="ng-lista">' + h.reunionesHoy.map(function (r) { return '<li><b>' + esc(r.hora) + '</b> ' + esc(r.nombre) + ' <span class="gris-2">· ' + esc(r.calendario) + '</span></li>'; }).join('') + '</ul>' : '<p class="ng-vacio">Ninguna en los calendarios de GHL.</p>') + '</div>' +
      '<div><p class="ng-embudo-t">Reuniones sin resultado</p>' + ((h.sinResultado || []).length ? '<ul class="ng-lista">' + h.sinResultado.map(function (r, i) { return '<li><span>' + esc(fechaCorta(r.dia)) + ' · ' + esc(r.nombre) + '</span><span class="ng-acciones"><button class="btn" type="button" data-acc="reunion" data-reu="' + i + '"' + (puede ? '' : ' disabled') + '>Resultado</button><button class="btn" type="button" data-acc="rc" data-reu="' + i + '"' + (puede ? '' : ' disabled') + '>RC</button></span></li>'; }).join('') + '</ul>' : '<p class="ng-vacio">Todas marcadas.</p>') + '</div>' +
      '<div><p class="ng-embudo-t">Ofertas abiertas</p>' + ((h.ofertas || []).length ? '<ul class="ng-lista">' + h.ofertas.map(function (r) { return '<li><span>' + esc(r.nombre) + ' <span class="gris-2">· ' + esc(r.etapa) + '</span></span><span class="' + (r.parada ? 'mal' : 'gris-2') + '" style="font-weight:700">' + esc(r.dias) + ' d</span></li>'; }).join('') + '</ul>' : '<p class="ng-vacio">Ninguna.</p>') + '</div>' +
      '</div>';
    return cabecera('¿Cómo vamos?', 'Resumen', 'La pantalla de los 10 minutos: objetivos del mes, alertas y lo de hoy. Todo en vivo.') +
      '<div class="ng-sec">' + errores + kp +
      tarjeta('Alertas', 'Qué ha pasado → evidencia → causa → impacto → acción → responsable. Máximo 7, por impacto.', al) +
      tarjeta('Hoy', 'Reuniones de hoy, reuniones pasadas sin resultado y ofertas abiertas', hoyHtml) +
      '<div class="ng-rejilla">' +
      tarjeta('Meta por semana', 'Gasto y leads, semanas que empiezan en lunes', combo(p.semanas || [], { medio: true, x: 'semana', barra: 'gasto', linea: 'leads', fmtX: fSemana, fmtEje: function (v) { return nf0.format(v) + ' €'; }, fmtB: eur, nombreBarra: 'Gasto', nombreLinea: 'Leads', extra: function (f) { return '<br>CPL: ' + esc(eur(f.cpl)); } })) +
      tarjeta('Leads por semana', 'Captación propia (Meta y web); la línea son los de nivel A o B', combo(l.semanas || [], { medio: true, x: 'semana', barra: 'total', linea: 'ab', fmtX: fSemana, nombreBarra: 'Leads', nombreLinea: 'A o B' })) +
      tarjeta('Outbound por día', 'Enviados y respuestas, últimos 30 días (todas las campañas de Smartlead)', combo(o.dias || [], { medio: true, x: 'dia', barra: 'enviados', linea: 'respuestas', fmtX: function (v, lg) { return lg ? v : fechaCorta(v); }, nombreBarra: 'Enviados', nombreLinea: 'Respuestas' })) +
      tarjeta('Embudo comercial', 'Oportunidades abiertas en Prospección; en coral, las paradas más de ' + (c.diasParada || 14) + ' días', hbarras((c.etapas || []).filter(function (e) { return /prospecci/i.test(e.embudo) && e.abiertas; }).map(function (e) { return { et: e.etapa, v: e.abiertas, rojo: e.paradas }; }))) +
      '</div></div>';
  };
  $('#vista').addEventListener('click', function (ev) {
    const b = ev.target.closest('[data-ir]'); if (!b) return;
    E.seccion = b.getAttribute('data-ir'); history.replaceState(null, '', '#' + E.seccion); pintarNav(); pintar(); window.scrollTo(0, 0); $('#vista').scrollTop = 0;
  });

  // ---------- Paid ----------
  VISTAS.paid = function (d) {
    const t = d.total || {};
    const f = E.filtros.paid || { q: '', estado: '' };
    const estados = Array.from(new Set((d.anuncios || []).map(function (a) { return a.estado; }))).sort();
    const ads = (d.anuncios || []).filter(function (a) {
      return (!f.estado || a.estado === f.estado) && (!f.q || (a.anuncio + ' ' + a.campana + ' ' + a.conjunto).toLowerCase().indexOf(f.q.toLowerCase()) >= 0);
    });
    const colsM = [{ t: 'Gasto', k: 'gasto', num: true, f: function (v) { return eur(v); } }, { t: 'Impresiones', k: 'impresiones', num: true, f: ent }, { t: 'CTR', k: 'ctr', num: true, f: function (v) { return pct(v); } }, { t: 'CPM', k: 'cpm', num: true, f: function (v) { return eur(v, true); } }, { t: 'Leads', k: 'leads', num: true, f: ent }, { t: 'CPL', k: 'cpl', num: true, f: function (v) { return eur(v, true); } }];
    return cabecera('¿Qué rinde la publicidad?', 'Paid · Meta de Qualivo', 'Cuenta publicitaria de Qualivo en vivo. ' + esc(d.periodo.etiqueta) + ' (' + esc(fechaCorta(d.periodo.desde)) + ' a ' + esc(fechaCorta(d.periodo.hasta)) + '). Cambia el periodo arriba.') +
      '<div class="ng-sec"><div class="ng-kpis">' + kpi('Gasto', eur(t.gasto)) + kpi('Impresiones', ent(t.impresiones)) + kpi('CTR', pct(t.ctr), ent(t.clics) + ' clics') + kpi('CPM', eur(t.cpm, true)) + kpi('Leads de Meta', ent(t.leads), d.leadsGHL && !d.leadsGHL.error ? ent(d.leadsGHL.total) + ' en GHL (' + ent(d.leadsGHL.ab) + ' A o B)' : '') + kpi('Coste por lead', eur(t.cpl, true)) + '</div>' +
      tarjeta('Por día', 'Gasto (barras) y leads (línea) del periodo', combo(d.dias || [], { x: 'dia', barra: 'gasto', linea: 'leads', fmtX: function (v, l) { return l ? v : fechaCorta(v); }, fmtEje: function (v) { return nf0.format(v) + ' €'; }, fmtB: eur, nombreBarra: 'Gasto', nombreLinea: 'Leads', extra: function (r) { return '<br>CTR: ' + esc(pct(r.ctr)) + ' · CPL: ' + esc(eur(r.cpl)); } })) +
      '<div class="ng-rejilla">' +
      tarjeta('Por mes', 'Últimos seis meses', tabla([{ t: 'Mes', k: 'mes', f: function (v) { return esc(fMes(v)); } }].concat(colsM), (d.meses || []).slice().reverse())) +
      tarjeta('Por semana', 'Semanas que empiezan en lunes', tabla([{ t: 'Semana', k: 'semana', f: function (v) { return esc(fechaCorta(v)); } }].concat(colsM), (d.semanas || []).slice().reverse())) +
      '</div>' +
      tarjeta('Por anuncio', 'Resultados de cada anuncio en el periodo, ordenados por gasto', tabla([{ t: 'Anuncio', k: 'anuncio' }, { t: 'Campaña', k: 'campana' }, { t: 'Estado', k: 'estado', f: function (v) { return pill(v, v === 'Activo' ? 'bien' : /rechaz|problem/i.test(v) ? 'mal' : ''); } }].concat(colsM), ads, { vacio: 'Ningún anuncio con gasto en este periodo.' }),
        '<div class="ng-filtros"><input type="search" placeholder="Buscar anuncio o campaña" data-filtro="paid.q" value="' + esc(f.q) + '"><select data-filtro="paid.estado"><option value="">Todos los estados</option>' + estados.map(function (e) { return '<option' + (e === f.estado ? ' selected' : '') + '>' + esc(e) + '</option>'; }).join('') + '</select></div>') +
      '</div>';
  };

  // ---------- Leads ----------
  VISTAS.leads = function (d) {
    const f = E.filtros.leads || { q: '', nivel: '', sector: '', canal: '', estado: '' };
    const filas = (d.filas || []).filter(function (x) {
      return ['nivel', 'sector', 'canal', 'estado'].every(function (k) { return !f[k] || x[k] === f[k]; }) &&
        (!f.q || [x.empresa, x.sector, x.nivel, x.canal, x.estado].join(' ').toLowerCase().indexOf(f.q.toLowerCase()) >= 0);
    });
    const sel = function (k, nombre) {
      const vals = Object.keys(d['por' + k.charAt(0).toUpperCase() + k.slice(1)] || {}).sort();
      return '<select data-filtro="leads.' + k + '"><option value="">' + esc(nombre) + '</option>' + vals.map(function (v) { return '<option' + (v === f[k] ? ' selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>';
    };
    const n = d.porNivel || {};
    return cabecera('¿Qué leads entran?', 'Leads · GHL de Qualivo', 'Captación propia (Meta y web) desde el ' + esc(fechaCorta(d.desde)) + ', sin pruebas ni descartados. Solo empresa: sin datos personales.') +
      '<div class="ng-sec"><div class="ng-kpis">' + kpi('Leads', ent(d.total)) + kpi('Nivel A', ent(n.A || 0), pct((n.A || 0) / (d.total || 1), true), 'bien') + kpi('Nivel B', ent(n.B || 0), pct((n.B || 0) / (d.total || 1), true)) + kpi('Nivel C', ent(n.C || 0), pct((n.C || 0) / (d.total || 1), true)) + kpi('Nivel D', ent(n.D || 0), pct((n.D || 0) / (d.total || 1), true)) + '</div>' +
      '<div class="ng-rejilla">' +
      tarjeta('Por nivel', 'Etiquetas nivel-a … nivel-d. A y B se llaman primero.', hbarras(contar(d.porNivel, ['A', 'B', 'C', 'D', 'Sin nivel']).map(function (i) { i.gris = !/^[AB]$/.test(i.et); return i; }), { pct: d.total })) +
      tarjeta('Por estado', 'Etapa de su oportunidad en GHL', hbarras(contar(d.porEstado), { pct: d.total })) +
      tarjeta('Por sector', 'Etiquetas sector-*', hbarras(contar(d.porSector), { pct: d.total })) +
      tarjeta('Por canal', 'Etiquetas canal-* y de origen', hbarras(contar(d.porCanal), { pct: d.total })) +
      '</div>' +
      tarjeta('Todos los leads', ent(filas.length) + ' de ' + ent(d.total) + ' con los filtros', tabla([{ t: 'Fecha', k: 'fecha', f: function (v) { return esc(fechaCorta(v)); } }, { t: 'Empresa', k: 'empresa' }, { t: 'Sector', k: 'sector' }, { t: 'Nivel', k: 'nivel', f: function (v) { return pill(v, v === 'A' ? 'bien' : v === 'B' ? 'info' : ''); } }, { t: 'Canal', k: 'canal' }, { t: 'Estado', k: 'estado', f: function (v) { return pill(v, /ganad|cliente/i.test(v) ? 'bien' : /perdid/i.test(v) ? 'mal' : /reuni|oferta|segunda|negoc|piloto/i.test(v) ? 'info' : ''); } }], filas, { vacio: 'Ningún lead con esos filtros.' }),
        '<div class="ng-filtros"><input type="search" placeholder="Buscar empresa, sector…" data-filtro="leads.q" value="' + esc(f.q) + '">' + sel('nivel', 'Nivel') + sel('sector', 'Sector') + sel('canal', 'Canal') + sel('estado', 'Estado') + '</div>') +
      '</div>';
  };

  // ---------- Outbound ----------
  VISTAS.outbound = function (d) {
    if (d.sinClave) return cabecera('¿Funciona el outbound?', 'Outbound') + avisoCaja(d.aviso);
    const k = d.kpis || {};
    const f = E.filtros.outbound || { estado: 'Activa', cliente: '' };
    const clientes = Array.from(new Set((d.campanas || []).map(function (c) { return c.cliente; }))).sort();
    const camp = (d.campanas || []).filter(function (c) { return (!f.estado || c.estado === f.estado) && (!f.cliente || c.cliente === f.cliente); });
    const tr = k.enviadosPeriodo ? k.respuestasPeriodo / k.enviadosPeriodo : null, tb = k.enviadosPeriodo ? k.rebotesPeriodo / k.enviadosPeriodo : null;
    return cabecera('¿Funciona el outbound?', 'Outbound · Smartlead', 'Campañas de Qualivo en vivo (las de clientes van aparte y no suman). ' + esc(d.periodo.etiqueta) + '.') +
      '<div class="ng-sec">' + (d.avisos || []).map(function (a) { return avisoCaja(a); }).join('') +
      '<div class="ng-kpis">' + kpi('Campañas activas', ent(k.activas)) + kpi('Enviados hoy', ent(k.enviadosHoy)) + kpi('Enviados 7 días', ent(k.enviados7)) + kpi('Enviados en el periodo', ent(k.enviadosPeriodo)) + kpi('% respuesta', pct(tr, true), ent(k.respuestasPeriodo) + ' respuestas') + kpi('% rebote', pct(tb, true), ent(k.rebotesPeriodo) + ' rebotes', tb > 0.03 ? 'mal' : '') + kpi('Con interés', ent(k.interesados), 'total de las campañas') + '</div>' +
      tarjeta('Por día', 'Enviados (barras) y respuestas (línea); todas las campañas de la cuenta', combo(d.dias || [], { x: 'dia', barra: 'enviados', linea: 'respuestas', fmtX: function (v, l) { return l ? v : fechaCorta(v); }, nombreBarra: 'Enviados', nombreLinea: 'Respuestas', extra: function (r) { return '<br>Rebotes: ' + esc(ent(r.rebotes)); } })) +
      tarjeta('Campañas', 'Totales desde que empezó cada campaña. «Con interés» es campaign_lead_stats.interested; el resto de respuestas son negativas o neutras.', tabla([
        { t: 'Campaña', k: 'campana' }, { t: 'Cliente', k: 'cliente' }, { t: 'Estado', k: 'estado', f: function (v) { return pill(v, v === 'Activa' ? 'bien' : ''); } },
        { t: 'Enviados', k: 'enviados', num: true, f: ent }, { t: 'Respuestas', k: 'respuestas', num: true, f: ent }, { t: '% resp.', k: 'tasaRespuesta', num: true, f: function (v) { return pct(v, true); } },
        { t: 'Con interés', k: 'interesados', num: true, f: ent, cls: function (v) { return v ? 'bien' : ''; } }, { t: 'Neg./neutras', k: 'otras', num: true, f: ent },
        { t: '% rebote', k: 'tasaRebote', num: true, f: function (v) { return pct(v, true); }, cls: function (v) { return v > 0.03 ? 'mal' : ''; } },
        { t: 'Periodo', k: 'periodo', num: true, f: function (v, r) { return r.error ? '<span class="ng-pill mal" title="' + esc(r.error) + '">sin datos</span>' : esc(ent(v && v.enviados) + ' env. · ' + ent(v && v.respuestas) + ' resp.'); } }
      ], camp, { vacio: 'Ninguna campaña con esos filtros.' }),
        '<div class="ng-filtros"><select data-filtro="outbound.estado"><option value="">Todos los estados</option>' + ['Activa', 'Pausada', 'Terminada', 'Parada'].map(function (e) { return '<option' + (e === f.estado ? ' selected' : '') + '>' + e + '</option>'; }).join('') + '</select><select data-filtro="outbound.cliente"><option value="">Todos los clientes</option>' + clientes.map(function (c) { return '<option' + (c === f.cliente ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('') + '</select></div>') +
      '</div>';
  };

  // ---------- CRM ----------
  let CRM = null;
  VISTAS.crm = function (d) {
    CRM = d;
    const ac = d.acciones || {};
    const nota = !ac.puedes ? 'Tu usuario ve el CRM pero no puede hacer acciones en GHL.' : !ac.activas ? 'Acciones apagadas: se encienden cuando esté la clave GHL_PANEL_API_KEY y NEGOCIO_ACCIONES=1 en Vercel. Puedes ver los diálogos, pero no se envía nada.' : 'Cada acción pide confirmación, se hace de una en una y queda en el registro y como nota «[Panel]» en el contacto.';
    const colAcc = { t: 'Acciones', f: function (v, r) {
      return '<div class="ng-acciones">' + [['mover', 'Etapa'], ['nota', 'Nota'], ['tarea', 'Tarea'], ['reunion', 'Reunión'], ['rc', r.rc ? 'RC ✓' : 'RC']].map(function (a) {
        return '<button class="btn" type="button" data-acc="' + a[0] + '" data-op="' + esc(r.id) + '"' + (ac.puedes ? '' : ' disabled') + '>' + a[1] + '</button>';
      }).join('') + '</div>';
    } };
    const cols = [
      { t: 'Etapa', k: 'etapa', f: function (v, r) { return pill(v, r.parada ? 'mal' : 'info') + '<div class="gris-2" style="font-size:11px;margin-top:3px">' + esc(r.embudo) + '</div>'; } },
      { t: 'Empresa / oportunidad', k: 'nombre' }, { t: 'Origen', k: 'origen' }, { t: 'Nivel', k: 'nivel' },
      { t: 'Valor', k: 'valor', num: true, f: function (v) { return v ? eur(v) : '—'; } },
      { t: 'Días parada', k: 'dias', num: true, f: ent, cls: function (v, r) { return r.parada ? 'mal' : ''; } },
      colAcc
    ];
    const porEmbudo = {};
    (d.etapas || []).forEach(function (e) { (porEmbudo[e.embudo] = porEmbudo[e.embudo] || []).push(e); });
    const embudosHtml = Object.keys(porEmbudo).map(function (n) {
      const et = porEmbudo[n].filter(function (e) { return e.abiertas; });
      if (!et.length) return '';
      return '<p class="ng-embudo-t">' + esc(n) + '</p>' + hbarras(et.map(function (e) { return { et: e.etapa, v: e.abiertas, rojo: e.paradas }; }));
    }).join('');
    return cabecera('¿Qué hay que mover hoy?', 'CRM · GHL de Qualivo', 'Oportunidades abiertas por embudo y etapa. Paradas: más de ' + d.diasParada + ' días sin cambiar de etapa.') +
      '<div class="ng-sec"><div class="ng-kpis">' + kpi('Abiertas', ent(d.abiertas)) + kpi('Paradas > ' + d.diasParada + ' días', ent(d.paradas), '', d.paradas ? 'mal' : '') + kpi('Avanzadas', ent((d.avanzadas || []).length), 'reunión, oferta, negociación, piloto') + kpi('Avanzadas paradas', ent((d.avanzadas || []).filter(function (o) { return o.parada; }).length), 'las primeras que mover', 'mal') + kpi('Valor en avanzadas', eur((d.avanzadas || []).reduce(function (s, o) { return s + (o.valor || 0); }, 0))) + '</div>' +
      avisoCaja(nota, false) +
      tarjeta('Oportunidades por etapa', 'Barras: abiertas. En coral (y entre paréntesis), las paradas.', embudosHtml) +
      tarjeta('Avanzadas', 'Reunión, segunda reunión, oferta, negociación y piloto. Las que llevan más tiempo paradas, arriba.', tabla(cols, d.avanzadas || [], { vacio: 'No hay oportunidades avanzadas abiertas.' })) +
      tarjeta('Otras paradas', 'Primeras etapas, más de ' + d.diasParada + ' días sin moverse (hasta 60)', tabla(cols, d.paradasLista || [], { vacio: 'Ninguna.' })) +
      '</div>';
  };

  // ---------- Clientes ----------
  let CLIENTES_FILAS = [];
  VISTAS.clientes = function (d) {
    const meta = (d.meta && d.meta.filas) || [];
    const porNombre = {};
    meta.forEach(function (m) { porNombre[m.cliente.toLowerCase()] = m; });
    let filas;
    if ((d.manual || []).length) {
      filas = d.manual.map(function (c) { return Object.assign({ cliente: c.cliente, estado: c.estado, nota: c.nota, ids: c.ids, actualizado: c.actualizado }, porNombre[c.cliente.toLowerCase()] || {}); });
    } else {
      filas = meta.map(function (m) { return Object.assign({ estado: '', nota: '' }, m); });
    }
    CLIENTES_FILAS = filas;
    const puedeEditar = !d.sinCuenta;
    return cabecera('¿Cómo están los clientes?', 'Clientes', 'Estado de cada cliente y su Meta de los últimos 7 días donde llevamos los anuncios.') +
      '<div class="ng-sec">' + (d.sinCuenta ? avisoCaja('El estado de cada cliente se guarda en la hoja «Facturación»: falta GOOGLE_SA_JSON en Vercel. Mientras, salen todas las cuentas publicitarias con gasto en los últimos 7 días.') : '') +
      (d.errorManual ? avisoCaja('No se han podido leer los datos manuales: ' + d.errorManual, true) : '') +
      (d.meta && d.meta.automatica && !d.sinCuenta ? avisoCaja('Aún no hay clientes dados de alta en el panel: salen las cuentas publicitarias con gasto en los últimos 7 días. Da de alta cada cliente con sus cuentas de Meta para fijar la lista.') : '') +
      tarjeta('Clientes', 'Gasto, leads, CPL y CTR de los últimos 7 días; gasto del mes en curso', tabla([
        { t: 'Estado', k: 'estado', f: function (v) { return v ? pill(v, /verde|bien|ok|al d[ií]a/i.test(v) ? 'bien' : /rojo|riesgo|mal|baja/i.test(v) ? 'mal' : 'medio') : '—'; } },
        { t: 'Cliente', k: 'cliente' }, { t: 'Gasto 7 d', k: 'gasto7', num: true, f: function (v) { return eur(v); } }, { t: 'Leads 7 d', k: 'leads7', num: true, f: ent },
        { t: 'CPL 7 d', k: 'cpl7', num: true, f: function (v) { return eur(v, true); } }, { t: 'CTR', k: 'ctr7', num: true, f: function (v) { return pct(v); } },
        { t: 'Gasto del mes', k: 'gastoMes', num: true, f: function (v) { return eur(v); } },
        { t: 'Situación', k: 'nota', f: function (v, r) { return r.error ? '<span class="ng-pill mal" title="' + esc(r.error) + '">Meta sin datos</span>' : esc(v || '—'); } },
        { t: '', f: function (v, r, i) { return puedeEditar ? '<button class="btn btn-mini" type="button" data-cliente="' + i + '">Editar</button>' : ''; } }
      ], filas, { vacio: 'Ninguna cuenta con gasto en los últimos 7 días.' }), puedeEditar ? '<button class="btn btn-mini btn-verde" type="button" data-cliente="nuevo">Añadir cliente</button>' : '') +
      '</div>';
  };

  // ---------- Redes ----------
  VISTAS.redes = function (d) {
    if (!d.elegida) return cabecera('¿Qué funciona en redes?', 'Redes') + avisoCaja('El token de Meta no da acceso a ninguna cuenta de Instagram.');
    const posts = d.posts || [];
    const conAlcance = posts.filter(function (p) { return p.alcance != null; });
    const medio = conAlcance.length ? conAlcance.reduce(function (s, p) { return s + p.alcance; }, 0) / conAlcance.length : null;
    const sel = '<div class="ng-filtros"><select data-ig>' + (d.cuentas || []).map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === d.elegida.id ? ' selected' : '') + '>@' + esc(c.usuario) + '</option>'; }).join('') + '</select></div>';
    const orden = posts.slice().sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; });
    return cabecera('¿Qué funciona en redes?', 'Redes · Instagram', 'Cuentas de Instagram accesibles con el token de Meta. Últimas 30 publicaciones de la cuenta elegida.') +
      '<div class="ng-sec">' + tarjeta('@' + d.elegida.usuario, esc(d.elegida.pagina), '<div class="ng-kpis">' + kpi('Seguidores', ent(d.elegida.seguidores)) + kpi('Publicaciones', ent(d.elegida.publicaciones)) + kpi('Alcance medio', ent(medio), 'últimas ' + posts.length) + kpi('Me gusta medio', ent(posts.length ? posts.reduce(function (s, p) { return s + p.megusta; }, 0) / posts.length : null)) + kpi('Guardados', ent(posts.reduce(function (s, p) { return s + (p.guardados || 0); }, 0)), 'suma de las últimas ' + posts.length) + '</div>', sel) +
      tarjeta('Alcance por publicación', 'Barras: alcance. Línea: me gusta.', combo(orden, { x: 'fecha', barra: 'alcance', linea: 'megusta', fmtX: function (v, l) { return l ? v : fechaCorta(v); }, nombreBarra: 'Alcance', nombreLinea: 'Me gusta', extra: function (p) { return '<br>' + esc(p.tipo) + ' · ' + esc(String(p.texto || '').slice(0, 40)); } })) +
      tarjeta('Publicaciones', 'Las 30 más recientes', tabla([
        { t: 'Fecha', k: 'fecha', f: function (v) { return esc(fechaCorta(v)); } }, { t: 'Tipo', k: 'tipo' },
        { t: 'Texto', k: 'texto', f: function (v, p) { return '<a href="' + esc(p.enlace) + '" target="_blank" rel="noopener noreferrer">' + esc(v || '(sin texto)') + '</a>'; } },
        { t: 'Me gusta', k: 'megusta', num: true, f: ent }, { t: 'Coment.', k: 'comentarios', num: true, f: ent }, { t: 'Alcance', k: 'alcance', num: true, f: ent },
        { t: 'Guardados', k: 'guardados', num: true, f: ent }, { t: 'Compart.', k: 'compartidos', num: true, f: ent }
      ], posts)) + '</div>';
  };

  // ---------- Finanzas ----------
  let FIN = null;
  VISTAS.finanzas = function (d) {
    FIN = d;
    const cab = cabecera('¿Cuánto aire tengo?', 'Finanzas', 'De la hoja «Facturación»' + (d.hoja ? ' (' + esc([d.hoja.plan, d.hoja.cockpit].filter(Boolean).join(' y ')) + ')' : '') + ', más los datos que metes aquí. La publicidad, de la API de Meta. Sin gastos personales.');
    if (d.sinCuenta) return cab + avisoCaja(d.aviso);
    const k = d.kpis || {};
    const editar = function (tipo, i) { return '<button class="btn btn-mini" type="button" data-dato="' + tipo + '" data-i="' + i + '">Editar</button>'; };
    const anadir = function (tipo, txt) { return '<button class="btn btn-mini btn-verde" type="button" data-dato="' + tipo + '" data-i="nuevo">' + esc(txt) + '</button>'; };
    const c18 = d.caja18;
    const kp = '<div class="ng-kpis">' +
      kpi('Saldo en banco', eur(k.banco), d.cuentas.length ? 'según tus datos del panel' : 'añade el saldo abajo', d.cuentas.length ? '' : 'aviso-kpi') +
      kpi('Huchas', eur(k.huchas)) + kpi('Reserva', eur(k.reserva), 'no cuenta para operar') +
      kpi('Facturación prevista', eur(k.facturacionPrevista), 'base del mes') + kpi('Cobrado', eur(k.cobrado), '', 'bien') + kpi('Pendiente de cobro', eur(k.pendiente), 'lo que llegará al banco', k.pendiente ? 'aviso-kpi' : '') +
      kpi('MRR', eur(k.mrr), 'cuotas de clientes') + kpi('Meta este mes', eur(k.metaMes), 'API de Meta') +
      kpi('Cuotas de deuda al mes', eur(k.deudaMes)) + kpi('Deuda total', eur(k.deudaTotal)) + kpi('IVA a apartar', eur(k.ivaApartar), 'de las facturas del mes') +
      '</div>';
    const genericos = function (bloques) {
      return (bloques || []).map(function (b) {
        const cab2 = b.cabecera || (b.filas[0] || []).map(function () { return ''; });
        return '<div style="margin-top:10px">' + (b.titulo ? '<p class="ng-embudo-t">' + esc(b.titulo) + '</p>' : '') + '<div class="ng-tabla-caja"><table class="tabla"><thead><tr>' + cab2.map(function (h) { return '<th>' + esc(h) + '</th>'; }).join('') + '</tr></thead><tbody>' + b.filas.map(function (f) { return '<tr>' + f.map(function (x, j) { return '<td data-t="' + esc(cab2[j] || '') + '"' + (/^[-−]?[\d.,]+\s?[€%]?$/.test(String(x).trim()) ? ' class="num"' : '') + '>' + esc(x) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></div>';
      }).join('');
    };
    return cab + '<div class="ng-sec">' + (d.avisos || []).map(function (a) { return avisoCaja(a); }).join('') + kp +
      (c18 ? tarjeta('Caja a 18 meses', (c18.calculado ? 'Resultado de cada mes = ingresos − gastos de Qualivo − cuotas de deuda − impuestos' : 'Fila «' + esc(c18.etiquetas.resultado || '') + '» del cockpit') + '. Sin gastos personales' + (c18.ocultas ? ' (' + c18.ocultas + ' filas personales fuera)' : '') + '. En coral, los meses en negativo.',
        combo(c18.filas.filter(function (f) { return f.resultado != null; }), { x: 'mes', barra: 'resultado', negativos: true, fmtEje: function (v) { return nf0.format(v) + ' €'; }, fmtB: eur, nombreBarra: 'Resultado del mes', extra: function (f) { return '<br>Ingresos: ' + esc(eur(f.ingresos)) + '<br>Gastos: ' + esc(eur(f.gastos)) + '<br>Deuda: ' + esc(eur(f.deuda)) + '<br>Impuestos: ' + esc(eur(f.impuestos)); } }) +
        '<details style="margin-top:10px"><summary class="gris" style="cursor:pointer;font-weight:600">Ver el detalle mes a mes</summary>' + tabla([{ t: 'Mes', k: 'mes' }, { t: 'Ingresos', k: 'ingresos', num: true, f: function (v) { return eur(v); } }, { t: 'Gastos Qualivo', k: 'gastos', num: true, f: function (v) { return eur(v); } }, { t: 'Cuotas deuda', k: 'deuda', num: true, f: function (v) { return eur(v); } }, { t: 'Impuestos', k: 'impuestos', num: true, f: function (v) { return eur(v); } }, { t: 'Resultado', k: 'resultado', num: true, f: function (v) { return eur(v); }, cls: function (v) { return v < 0 ? 'mal' : 'bien'; } }], c18.filas) + '</details>') : '') +
      '<div class="ng-rejilla">' +
      tarjeta('Cuentas y huchas', 'Saldos que metes tú. La reserva no cuenta como caja para operar.', tabla([{ t: 'Cuenta', k: 'nombre' }, { t: 'Saldo', k: 'importe', num: true, f: function (v) { return eur(v); } }, { t: 'Uso', k: 'estado' }, { t: 'Actualizado', k: 'actualizado', f: function (v, r) { return esc(fechaCorta(v) + (r.usuario ? ' · ' + r.usuario : '')); } }, { t: '', f: function (v, r, i) { return editar('cuenta', i); } }], d.cuentas, { vacio: 'Todavía no hay saldos. Añade la cuenta de empresa y cada hucha.' }), anadir('cuenta', 'Añadir cuenta')) +
      tarjeta('Impuestos del mes: IVA e IRPF', 'Lo que generan las facturas del mes. Estimación: confírmala con el gestor.', tabla([{ t: 'Concepto', k: 'concepto' }, { t: 'Importe', k: 'importe', num: true, f: function (v) { return eur(v); } }, { t: 'Cuándo y cómo', k: 'cuando' }], d.impuestos || [])) +
      '</div>' +
      (d.facturas ? tarjeta('Facturas del mes por cliente', 'De «' + esc(d.hoja.plan || '') + '». El estado de cobro que marques aquí manda sobre el de la hoja.', tabla([{ t: 'Cliente', k: 'cliente' }, { t: 'Tipo', k: 'tipo' }, { t: 'Base', k: 'base', num: true, f: function (v) { return eur(v); } }, { t: 'IVA', k: 'iva', num: true, f: function (v) { return eur(v); } }, { t: 'Al banco', k: 'total', num: true, f: function (v) { return eur(v); } }, { t: 'Estado', k: 'estado', f: function (v, r) { return v ? pill(v + (r.manual ? ' ·' : ''), /cobrad|pagad|ingresad/i.test(v) ? 'bien' : /retras|impag|vencid/i.test(v) ? 'mal' : 'medio') : '—'; } }, { t: 'Nota', k: 'nota' }, { t: '', f: function (v, r, i) { return '<button class="btn btn-mini" type="button" data-cobro="' + i + '">Estado de cobro</button>'; } }], d.facturas.filas)) : '') +
      '<div class="ng-rejilla">' +
      (d.gastos ? tarjeta('Gasto por categoría', 'Presupuesto del mes frente a lo gastado. La publicidad se lee de Meta.', tabla([{ t: 'Categoría', k: 'categoria', f: function (v, r) { return esc(v) + (r.fuente ? ' <span class="ng-pill info">' + esc(r.fuente) + '</span>' : ''); } }, { t: 'Presupuesto', k: 'presupuesto', num: true, f: function (v) { return eur(v); } }, { t: 'Gastado', k: 'real', num: true, f: function (v) { return eur(v); }, cls: function (v, r) { return r.presupuesto != null && v > r.presupuesto ? 'mal' : ''; } }], d.gastos.categorias)) : '') +
      tarjeta('Suscripciones', 'Cada herramienta, su último cargo y qué hacer con ella.', tabla([{ t: 'Herramienta', k: 'nombre' }, { t: 'Cuota', k: 'importe', num: true, f: function (v) { return eur(v); } }, { t: 'Último cargo', k: 'extra' }, { t: 'Cobro', k: 'estado', f: function (v) { return v ? pill(v, /rechaz/i.test(v) ? 'mal' : /cobrad/i.test(v) ? 'bien' : '') : '—'; } }, { t: 'Qué hacer', k: 'nota' }, { t: '', f: function (v, r, i) { return editar('suscripcion', i); } }], d.suscripciones || [], { vacio: 'Sin suscripciones apuntadas.' }), anadir('suscripcion', 'Añadir')) +
      '</div>' +
      tarjeta('Deuda y aplazamientos', 'De la pestaña «DEUDA» de la hoja' + ((d.deudaManual || []).length ? ', más lo que apuntas aquí' : '') + '.', ((d.deudaManual || []).length ? tabla([{ t: 'Deuda', k: 'nombre' }, { t: 'Cuota/mes', k: 'importe', num: true, f: function (v) { return eur(v); } }, { t: 'Este mes', k: 'estado' }, { t: 'Plan', k: 'nota' }, { t: 'Saldo y fin', k: 'extra' }, { t: '', f: function (v, r, i) { return editar('deuda', i); } }], d.deudaManual) : '') + (genericos(d.deudaHoja) || '<p class="ng-vacio">No encuentro la pestaña «DEUDA».</p>'), anadir('deuda', 'Apuntar deuda')) +
      (d.gastos ? tarjeta('Gastos de empresa', 'Partidas del mes sin gastos personales', tabla([{ t: 'Concepto', k: 'concepto' }, { t: 'Categoría', k: 'categoria' }, { t: 'Mes anterior', k: 'anterior', num: true, f: function (v) { return eur(v); } }, { t: 'Presupuesto', k: 'presupuesto', num: true, f: function (v) { return eur(v); } }, { t: 'Gastado', k: 'real', num: true, f: function (v) { return eur(v); } }, { t: 'Estado', k: 'estado' }, { t: 'Nota', k: 'nota' }], d.gastos.filas)) : '') +
      ((d.otrosBloques || []).length ? tarjeta('Más de «' + (d.hoja.plan || '') + '»', 'El resto de bloques de la pestaña, tal cual', genericos(d.otrosBloques)) : '') +
      tarjeta('Registro de acciones', 'Quién hizo qué desde el panel (últimas 50)', tabla([{ t: 'Fecha', k: 'fecha' }, { t: 'Usuario', k: 'usuario' }, { t: 'Acción', k: 'accion' }, { t: 'Qué', k: 'resumen' }, { t: 'Resultado', k: 'resultado', f: function (v) { return pill(v, v === 'ok' ? 'bien' : 'mal'); } }], d.registro || [], { vacio: 'Todavía no hay acciones.' })) +
      '</div>';
  };

  // ---------------------------------------------------------------- filtros
  $('#vista').addEventListener('input', function (ev) {
    const el = ev.target.closest('[data-filtro]'); if (!el) return;
    const p = el.getAttribute('data-filtro').split('.');
    E.filtros[p[0]] = Object.assign({}, E.filtros[p[0]] || (p[0] === 'outbound' ? { estado: 'Activa' } : {}));
    E.filtros[p[0]][p[1]] = el.value;
    const pos = el.selectionStart;
    pintar();
    const nuevo = document.querySelector('[data-filtro="' + p.join('.') + '"]');
    if (nuevo && el.tagName === 'INPUT') { nuevo.focus(); try { nuevo.setSelectionRange(pos, pos); } catch (e) { /* nada */ } }
  });
  $('#vista').addEventListener('change', function (ev) {
    if (ev.target.matches('[data-ig]')) { E.cuentaIg = ev.target.value; pintar(); }
  });

  // ---------------------------------------------------------------- diálogo
  let alConfirmar = null;
  function abrirModal(titulo, cuerpo, textoOk, fn) {
    $('#modalTitulo').textContent = titulo;
    $('#modalCuerpo').innerHTML = cuerpo;
    $('#modalOk').textContent = textoOk || 'Confirmar';
    $('#modalOk').disabled = false;
    alConfirmar = fn;
    $('#modal').hidden = false;
    const p = $('#modalCuerpo').querySelector('input,select,textarea'); if (p) p.focus();
  }
  function cerrarModal() { $('#modal').hidden = true; alConfirmar = null; }
  document.querySelectorAll('#modal [data-cerrar]').forEach(function (b) { b.addEventListener('click', cerrarModal); });
  document.querySelector('#modal header [data-cerrar]').innerHTML = ico('cerrar');
  document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !$('#modal').hidden) cerrarModal(); });
  $('#modalForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (!alConfirmar) return;
    const datos = {};
    new FormData(ev.target).forEach(function (v, k) { datos[k] = v; });
    $('#modalOk').disabled = true;
    Promise.resolve(alConfirmar(datos)).then(function (ok) { if (ok !== false) cerrarModal(); else $('#modalOk').disabled = false; })
      .catch(function (e) { aviso(e.message, true); $('#modalOk').disabled = false; });
  });
  function campo(nombre, etiqueta, tipo, valor, extra) {
    if (tipo === 'textarea') return '<label>' + esc(etiqueta) + '<textarea name="' + nombre + '" maxlength="1500"' + (extra || '') + '>' + esc(valor || '') + '</textarea></label>';
    if (Array.isArray(tipo)) return '<label>' + esc(etiqueta) + '<select name="' + nombre + '"' + (extra || '') + '>' + tipo.map(function (o) { const v = typeof o === 'string' ? o : o.v, t = typeof o === 'string' ? o : o.t; return '<option value="' + esc(v) + '"' + (v === valor ? ' selected' : '') + '>' + esc(t) + '</option>'; }).join('') + '</select></label>';
    return '<label>' + esc(etiqueta) + '<input name="' + nombre + '" type="' + (tipo || 'text') + '" value="' + esc(valor == null ? '' : valor) + '"' + (extra || '') + '></label>';
  }

  // Acciones del CRM
  const WORKFLOWS = ['Cliente ganado:', 'ETAPA_NUEVO_LEAD', 'Lead_agendado', 'Radiografía · contestó', 'ABM — Nuevo Contacto'];
  // ctx: { activas, opcionesRC, embudos } (de la sección CRM o del Resumen)
  function abrirAccion(tipo, op, ctx) {
    const activas = ctx.acciones && ctx.acciones.activas;
    const ficha = '<div class="ng-ficha"><b>' + esc(op.nombre) + '</b><br>' + (op.etapa ? esc(op.embudo) + ' · ' + esc(op.etapa) + ' · ' + esc(op.dias) + ' días en la etapa' : esc(op.detalle || '')) + '</div>' + (activas ? '' : avisoCaja('Acciones apagadas: no se enviará nada a GHL hasta que esté GHL_PANEL_API_KEY y NEGOCIO_ACCIONES=1.'));
    const enviar = function (cuerpo) {
      if (!activas) { aviso('Acciones apagadas: no se ha enviado nada.', true); return false; }
      return api({ accion: 'ghl' }, Object.assign({ contacto: op.contacto, oportunidad: op.id || '' }, cuerpo)).then(function (r) {
        aviso('Hecho en GHL: ' + r.resumen + (r.avisoRegistro ? ' (' + r.avisoRegistro + ')' : ''));
        Object.keys(E.datos).forEach(function (k) { if (/^(crm|resumen)/.test(k)) delete E.datos[k]; });
        cargar(E.seccion, true); pintar(); return true;
      });
    };
    const emb = (ctx.embudos || []).filter(function (e) { return e.id === op.embudoId; })[0] || { etapas: [] };
    if (tipo === 'mover') {
      abrirModal('Mover de etapa', ficha + campo('etapa', 'Nueva etapa', emb.etapas.filter(function (s) { return s.id !== op.etapaId; }).map(function (s) { return { v: s.id, t: s.nombre }; })) +
        '<div class="ng-aviso-caja">Mover de etapa es igual que moverla a mano en GHL y dispara los workflows publicados:<ul>' + WORKFLOWS.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>Alguno puede escribir al contacto. Además, la señal a Meta (cada 2 horas) le contará el cambio de etapa.</div>' +
        '<label class="ng-check"><input type="checkbox" name="entendido" required> Entendido: quiero moverla y que se disparen esos workflows.</label>', 'Mover', function (f) { return enviar({ tipo: 'mover', embudo: op.embudoId, etapa: f.etapa }); });
    } else if (tipo === 'nota') {
      abrirModal('Añadir nota', ficha + campo('texto', 'Nota (queda como «Panel · Nota · fecha · usuario»)', 'textarea', '', ' required'), 'Guardar nota', function (f) { return enviar({ tipo: 'nota', texto: f.texto }); });
    } else if (tipo === 'tarea') {
      const manana = new Date(Date.now() + 864e5).toLocaleDateString('en-CA', { timeZone: 'Europe/Madrid' });
      abrirModal('Crear tarea o seguimiento', ficha + campo('titulo', 'Título', 'text', '', ' required maxlength="140"') + campo('vence', 'Para el día', 'date', manana, ' required') + campo('detalle', 'Detalle (opcional)', 'textarea', ''), 'Crear tarea', function (f) { return enviar({ tipo: 'tarea', titulo: f.titulo, vence: f.vence, detalle: f.detalle }); });
    } else if (tipo === 'reunion') {
      abrirModal('Resultado de la reunión', ficha + campo('resultado', 'Resultado', [{ v: 'celebrada', t: 'Celebrada' }, { v: 'no-presentado', t: 'No vino' }, { v: 'movida', t: 'Movida' }, { v: 'cancelada', t: 'Cancelada' }]) +
        campo('encaje', 'Encaje', [{ v: '', t: '—' }, { v: 'si', t: 'Sí' }, { v: 'dudoso', t: 'Dudoso' }, { v: 'no', t: 'No' }]) + campo('siguiente', 'Siguiente paso', 'text', '', ' maxlength="200"') + campo('texto', 'Comentario (opcional)', 'textarea', '') +
        '<p class="gris" style="font-size:12px">Queda como nota en el contacto. Si fue cualificada, márcala también como RC; si hay que cambiar la etapa, usa «Etapa».</p>', 'Guardar', function (f) { return enviar({ tipo: 'reunion', resultado: f.resultado, encaje: f.encaje, siguiente: f.siguiente, texto: f.texto }); });
    } else if (tipo === 'rc') {
      abrirModal('Marcar como RC (reunión cualificada)', ficha + '<p class="gris" style="font-size:12.5px">Pone a la vez la etiqueta RC, el canal de origen RC y la fecha RC. El recuento semanal solo cuenta las que tienen las tres.</p>' +
        campo('canal', 'Canal de origen RC', (ctx.opcionesRC || []).length ? ctx.opcionesRC : ['(no se han podido leer las opciones)']) + campo('fecha', 'Fecha RC (la de la reunión)', 'date', op.diaReunion || hoyISO(), ' required'), 'Marcar RC', function (f) { return enviar({ tipo: 'rc', canal: f.canal, fecha: f.fecha }); });
    }
  }
  $('#vista').addEventListener('click', function (ev) {
    const b = ev.target.closest('[data-acc]'); if (!b) return;
    const tipo = b.getAttribute('data-acc');
    if (b.hasAttribute('data-op') && CRM) {
      const op = (CRM.avanzadas || []).concat(CRM.paradasLista || []).filter(function (o) { return o.id === b.getAttribute('data-op'); })[0];
      if (op) abrirAccion(tipo, op, CRM);
    } else if (b.hasAttribute('data-reu') && RES) {
      const r = ((RES.hoy && RES.hoy.sinResultado) || [])[Number(b.getAttribute('data-reu'))];
      if (r) abrirAccion(tipo, { contacto: r.contacto, nombre: r.nombre, detalle: 'Reunión del ' + r.dia + ' a las ' + r.hora + ' · ' + r.calendario, diaReunion: r.dia }, RES);
    }
  });

  // Datos manuales: cuentas, suscripciones, deuda, cobros y clientes
  const DEF = {
    cuenta: { t: 'Cuenta o hucha', campos: function (r) { return campo('nombre', 'Nombre (p. ej. «Cuenta empresa», «Hucha impuestos»)', 'text', r.nombre, ' required') + campo('importe', 'Saldo (€)', 'number', r.importe, ' step="0.01" required') + campo('estado', 'Uso', ['operativa', 'hucha', 'reserva'], r.estado || 'operativa') + campo('nota', 'Nota', 'text', r.nota); }, lista: function () { return FIN.cuentas; } },
    suscripcion: { t: 'Suscripción', campos: function (r) { return campo('nombre', 'Herramienta', 'text', r.nombre, ' required') + campo('importe', 'Cuota al mes (€)', 'number', r.importe, ' step="0.01"') + campo('extra', 'Último cargo (fecha e importe)', 'text', r.extra) + campo('estado', 'Cobro', ['Cobrado', 'Rechazado', 'Pendiente', 'De baja'], r.estado || 'Cobrado') + campo('nota', 'Qué hacer y para qué', 'text', r.nota); }, lista: function () { return FIN.suscripciones; } },
    deuda: { t: 'Deuda o aplazamiento', campos: function (r) { return campo('nombre', 'Deuda (con quién)', 'text', r.nombre, ' required') + campo('importe', 'Cuota al mes (€)', 'number', r.importe, ' step="0.01"') + campo('estado', 'Este mes', ['Pagada', 'Pendiente', 'Aplazada'], r.estado || 'Pendiente') + campo('extra', 'Saldo pendiente y cuándo acaba', 'text', r.extra) + campo('nota', 'Plan', 'text', r.nota); }, lista: function () { return FIN.deudaManual; } }
  };
  function guardarDato(tipo, f, anterior) {
    return api({ accion: 'dato' }, Object.assign({ tipo: tipo, nombreAnterior: anterior || '' }, f)).then(function () {
      aviso('Guardado.'); delete E.datos[clave(E.seccion)]; cargar(E.seccion, true); pintar(); return true;
    });
  }
  function borrarBoton(tipo, nombre) {
    return '<button class="btn btn-mini" type="button" data-borrar="' + esc(tipo) + '" data-nombre="' + esc(nombre) + '" style="align-self:flex-start;color:var(--rojo)">Borrar «' + esc(nombre) + '»</button>';
  }
  $('#vista').addEventListener('click', function (ev) {
    const b = ev.target.closest('[data-dato]'); if (!b || !FIN) return;
    const tipo = b.getAttribute('data-dato'), i = b.getAttribute('data-i'), def = DEF[tipo];
    const r = i === 'nuevo' ? {} : def.lista()[Number(i)] || {};
    abrirModal((i === 'nuevo' ? 'Añadir: ' : 'Editar: ') + def.t, def.campos(r) + (i === 'nuevo' ? '' : borrarBoton(tipo, r.nombre)), 'Guardar', function (f) { return guardarDato(tipo, f, r.nombre); });
  });
  $('#vista').addEventListener('click', function (ev) {
    const b = ev.target.closest('[data-cobro]'); if (!b || !FIN || !FIN.facturas) return;
    const fac = FIN.facturas.filas[Number(b.getAttribute('data-cobro'))];
    abrirModal('Estado de cobro', '<div class="ng-ficha"><b>' + esc(fac.cliente) + '</b> · ' + esc(fac.tipo || '') + ' · ' + esc(eur(fac.total)) + '</div>' + campo('estado', 'Estado', ['Cobrada', 'Por cobrar', 'Enviada', 'Retrasada', 'Impagada'], fac.estado) + campo('nota', 'Nota', 'text', fac.manual ? fac.nota : ''), 'Guardar', function (f) { return guardarDato('cobro', { nombre: fac.cliente, estado: f.estado, nota: f.nota }); });
  });
  $('#vista').addEventListener('click', function (ev) {
    const b = ev.target.closest('[data-cliente]'); if (!b) return;
    const i = b.getAttribute('data-cliente');
    const r = i === 'nuevo' ? {} : CLIENTES_FILAS[Number(i)] || {};
    abrirModal(i === 'nuevo' ? 'Añadir cliente' : 'Cliente: ' + r.cliente, campo('nombre', 'Cliente', 'text', r.cliente, ' required') + campo('estado', 'Estado', ['Verde · al día', 'Ámbar · atención', 'Rojo · en riesgo', 'Pausado', 'Baja'], r.estado || 'Verde · al día') + campo('nota', 'Situación', 'textarea', r.nota) + campo('extra', 'Cuentas publicitarias de Meta (act_… separadas por comas)', 'text', (r.ids || []).join(', ')) + (i === 'nuevo' || !r.actualizado ? '' : borrarBoton('cliente', r.cliente)), 'Guardar', function (f) { return guardarDato('cliente', f, r.cliente); });
  });
  document.addEventListener('click', function (ev) {
    const b = ev.target.closest('[data-borrar]'); if (!b) return;
    const tipo = b.getAttribute('data-borrar'), nombre = b.getAttribute('data-nombre');
    if (!window.confirm('¿Borrar «' + nombre + '»?')) return;
    api({ accion: 'dato' }, { tipo: tipo, nombre: nombre, borrar: true }).then(function () { cerrarModal(); aviso('Borrado.'); delete E.datos[clave(E.seccion)]; pintar(); }).catch(function (e) { aviso(e.message, true); });
  });

  // ---------------------------------------------------------------- avisos
  function aviso(t, malo) {
    const el = document.createElement('div');
    el.className = 'aviso'; el.innerHTML = ico(malo ? 'alerta' : 'check') + '<span>' + esc(t) + '</span>';
    if (malo) el.querySelector('.ico').style.color = 'var(--rojo)';
    $('#avisos').appendChild(el);
    setTimeout(function () { el.remove(); }, 5200);
  }

  let tRes = null;
  window.addEventListener('resize', function () { clearTimeout(tRes); tRes = setTimeout(function () { if (!$('#app').hidden) pintar(); }, 250); });

  arrancar();
})();
