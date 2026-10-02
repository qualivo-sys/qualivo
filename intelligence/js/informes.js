/* Informes (2-oct, brief content/briefs/intelligence-informes-por-periodo.md): el embudo por mes,
 * por semana (lunes a domingo, hora de Madrid) y por vertical, con los tratos abiertos debajo.
 * Modo real: /api/intelligence-datos?accion=informe (solo lectura, con sesión). Demo: los mismos
 * registros salen de las campañas y contactos inventados del sector.
 * Todo se agrega aquí desde registros sueltos, así que un mes y sus semanas siempre cuadran.
 * Lo que no se puede medir sale como «NO MEDIDO», nunca con una cifra inventada. */
(function () {
  'use strict';
  const QV = window.QV, M = QV.motor;
  const esc = function (s) { return QV.esc(s); };
  const ZONA = 'Europe/Madrid';
  const NM = '<span class="inf-nm" title="No se puede medir con los datos que hay">NO MEDIDO</span>';
  const VERT = { formacion: 'Formación', clinica: 'Clínicas', reformas: 'Reformas', asesoria: 'Asesorías', otro: 'Otros sectores', sin: 'Sin vertical' };
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  let real = null, error = '', cargando = false;
  const ui = { modo: 'mes', vert: 'todas', periodo: '' };

  // ---------- Fechas en Madrid ----------
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' });
  function dia(t) { return typeof t === 'string' ? t : fmt.format(new Date(t)); }
  function lunesDe(d) { // d «AAAA-MM-DD» → lunes de su semana
    const x = new Date(d + 'T12:00:00Z');
    x.setUTCDate(x.getUTCDate() - (x.getUTCDay() + 6) % 7);
    return x.toISOString().slice(0, 10);
  }
  function clave(d, modo) { return modo === 'mes' ? d.slice(0, 7) : lunesDe(d); }
  function etiqueta(k, modo) {
    if (modo === 'mes') { const p = k.split('-'); return MESES[+p[1] - 1].replace(/^./, function (c) { return c.toUpperCase(); }) + ' ' + p[0].slice(2); }
    const a = new Date(k + 'T12:00:00Z'), b = new Date(a.getTime() + 6 * 86400000);
    return a.getUTCDate() + (a.getUTCMonth() !== b.getUTCMonth() ? ' ' + MESES[a.getUTCMonth()].slice(0, 3) : '') + '–' + b.getUTCDate() + ' ' + MESES[b.getUTCMonth()].slice(0, 3);
  }
  function periodos(datos, modo) {
    const hoy = dia(Date.now());
    const out = [];
    let d = modo === 'mes' ? datos.desde : lunesDe(datos.desde);
    while (d <= hoy) {
      const k = clave(d, modo);
      if (out.indexOf(k) < 0) out.push(k);
      const x = new Date(d + 'T12:00:00Z');
      if (modo === 'mes') x.setUTCMonth(x.getUTCMonth() + 1, 1); else x.setUTCDate(x.getUTCDate() + 7);
      d = x.toISOString().slice(0, 10);
    }
    return modo === 'semana' ? out.slice(-6) : out;
  }

  // ---------- Datos ----------
  function cargar(fresco) {
    if (cargando) return;
    cargando = true; error = '';
    fetch('/api/intelligence-datos/?accion=informe' + (fresco ? '&fresco=1' : ''), { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok) throw new Error(d.error || ('Error ' + r.status)); return d; }); })
      .then(function (d) { real = d; })
      .catch(function (e) { error = e.message || String(e); })
      .then(function () { cargando = false; if (QV.estado.vista === 'informes') QV.pintarVista(); });
  }

  function hash(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) % 1000 / 1000; }

  // Demo: los registros salen del mes tipo de cada campaña del sector, con algo de variación por mes.
  function demo() {
    const est = QV.estado, cfg = est.cfg;
    if (cfg._informe) return cfg._informe;
    const ids = cfg.recorrido.map(function (e) { return e.id; });
    const etCita = (cfg.kpiEtapas && cfg.kpiEtapas.entrevistas) || ids[4];
    const iCita = ids.indexOf(etCita), iVenta = ids.indexOf(cfg.ventaEtapa);
    const hoy = dia(est.ahora);
    const p = hoy.split('-').map(Number);
    const desde = new Date(Date.UTC(p[0], p[1] - 4, 1)).toISOString().slice(0, 10);
    const gasto = [], leads = [], citas = [], cambios = [];
    let d = lunesDe(desde);
    while (d <= hoy) {
      const x = new Date(d + 'T12:00:00Z');
      const finde = x.getUTCDay() === 0 || x.getUTCDay() === 6;
      const mesN = x.getUTCMonth();
      const diasMes = new Date(Date.UTC(x.getUTCFullYear(), mesN + 1, 0)).getUTCDate();
      cfg.campanas.forEach(function (cp, ci) {
        const f = (0.82 + 0.3 * hash(cp.id + mesN)) / diasMes * (finde ? 0.7 : 1.12);
        const v = cp.id;
        const tirar = function (n, sem) { const base = n * f; const r = hash(sem + d + cp.id); return Math.floor(base) + (r < base - Math.floor(base) ? 1 : 0); };
        if (cp.inversion) gasto.push({ d: d, c: cp.id, v: v, g: Math.round(cp.inversion * f * 100) / 100, l: tirar((cp.embudo[ids[1]] || 0) * 0.92, 'l') });
        for (let i = tirar(cp.embudo[ids[1]] || 0, 'c'); i > 0; i--) leads.push({ t: d, v: v });
        const ef = tirar(cp.embudo[etCita] || 0, 'e');
        const ns = tirar((cp.embudo[etCita] || 0) * 0.24, 'n'), ca = tirar((cp.embudo[etCita] || 0) * 0.07, 'x');
        const fut = d > hoy || (d === hoy);
        for (let i = 0; i < ef; i++) citas.push({ t: d, tipo: 'diagnostico', res: fut ? 'pendiente' : 'efectiva', fuente: 'registro', pago: cp.inversion > 0, v: v, rec: hash(d + cp.id + i) < 0.08 || undefined });
        for (let i = 0; i < ns; i++) citas.push({ t: d, tipo: 'diagnostico', res: fut ? 'pendiente' : 'noshow', fuente: 'registro', pago: cp.inversion > 0, v: v });
        for (let i = 0; i < ca; i++) citas.push({ t: d, tipo: 'diagnostico', res: 'cancelada', fuente: 'registro', pago: cp.inversion > 0, v: v });
        const segunda = tirar((cp.embudo[etCita] || 0) * 0.35, 's');
        for (let i = 0; i < segunda; i++) citas.push({ t: d, tipo: 'segunda', res: fut ? 'pendiente' : 'efectiva', fuente: 'registro', pago: cp.inversion > 0, v: v });
        for (let i = tirar((cp.embudo[etCita] || 0) * 0.55, 'o'); i > 0; i--) cambios.push({ t: d, k: 'oferta', v: v });
        for (let i = tirar((cp.embudo[cfg.ventaEtapa] || 0) * 0.25, 'p'); i > 0; i--) cambios.push({ t: d, k: 'piloto', v: v });
        for (let i = tirar(cp.embudo[cfg.ventaEtapa] || 0, 'v'); i > 0; i--) cambios.push({ t: d, k: 'cliente', v: v });
        for (let i = tirar((cp.embudo[etCita] || 0) * 0.3, 'g'); i > 0; i--) cambios.push({ t: d, k: 'negociacion', v: v });
      });
      x.setUTCDate(x.getUTCDate() + 1);
      d = x.toISOString().slice(0, 10);
    }
    const abiertosC = est.contactos.filter(function (c) { return !c.fin && c.valor > 0 && c.etapa >= Math.max(1, iCita - 1); }).sort(function (a, b) { return b.valor - a.valor; });
    const enJuego = abiertosC.filter(function (c) { return c.etapa >= iCita; }).reduce(function (a, c) { return a + c.valor; }, 0);
    const vivos = est.contactos.filter(function (c) { return c.fin === 'ganado'; }).length;
    cfg._informe = {
      demo: true, generado: est.ahora, desde: desde, avisos: [], ok: { meta: true, crm: true, tratos: true, citas: true },
      verticales: cfg.campanas.map(function (cp) { return { k: cp.id, txt: cp.nombre }; }),
      gasto: gasto, leads: leads, citas: citas, cambios: cambios,
      foto: { enJuego: enJuego, enNegociacion: abiertosC.filter(function (c) { return c.etapa >= iCita; }).length, clientesActivos: vivos + Math.round(M.mes(cfg).tot[ids[iVenta]] * 2.4), pilotos: 0 },
      abiertos: abiertosC.slice(0, 12).map(function (c) {
        const cp = cfg.campana(c.orig);
        return { empresa: c.emp || c.n, etapa: c.etapaTxt || cfg.etapaTxt(c.etapa), importe: c.valor, v: c.orig, origen: cp ? cp.canal : 'Web', cambio: c.tToque || c.tAct, siguienteTxt: c.x.nba.accion };
      })
    };
    return cfg._informe;
  }

  // ---------- Agregado de una celda (periodo + vertical) ----------
  function celda(D, filtro) {
    const vale = function (r) { return filtro(dia(r.d || r.t), r.v === 'general' ? 'sin' : r.v); };
    const g = D.gasto.filter(vale), l = D.leads.filter(vale), c = D.citas.filter(vale), k = D.cambios.filter(vale);
    const diag = c.filter(function (x) { return x.tipo === 'diagnostico'; });
    const cuenta = function (lista, res) { return lista.filter(function (x) { return x.res === res; }).length; };
    const inv = g.reduce(function (a, x) { return a + x.g; }, 0);
    const pago = diag.filter(function (x) { return x.pago; });
    const camp = {}; g.forEach(function (x) { if (x.g > 0) camp[x.c] = 1; });
    const ef = cuenta(diag, 'efectiva'), ns = cuenta(diag, 'noshow');
    return {
      inv: inv, camp: Object.keys(camp).length, leadsMeta: g.reduce(function (a, x) { return a + x.l; }, 0), leadsCrm: l.length,
      agPago: pago.length, agOtros: diag.length - pago.length, ag: diag.length,
      ef: ef, efPago: cuenta(pago, 'efectiva'), ns: ns, nsPago: cuenta(pago, 'noshow'), ca: cuenta(diag, 'cancelada'), caPago: cuenta(pago, 'cancelada'), pend: cuenta(diag, 'pendiente'), nm: cuenta(diag, 'nomedido'),
      rec: diag.filter(function (x) { return x.rec; }).length,
      seg: c.filter(function (x) { return x.tipo === 'segunda' && x.res !== 'cancelada'; }).length,
      segEf: c.filter(function (x) { return x.tipo === 'segunda' && x.res === 'efectiva'; }).length,
      recon: c.some(function (x) { return x.fuente === 'reconstruido'; }),
      prop: k.filter(function (x) { return x.k === 'oferta'; }).length, neg: k.filter(function (x) { return x.k === 'negociacion'; }).length,
      pil: k.filter(function (x) { return x.k === 'piloto'; }).length, cli: k.filter(function (x) { return x.k === 'cliente'; }).length
    };
  }

  function eur(v, dec) { return v == null || !isFinite(v) ? '—' : M.num(v, dec ? 2 : 0) + ' €'; }
  function eur2(v) { return v == null || !isFinite(v) ? '—' : v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
  const R = '<sup class="inf-r" title="Reconstruido con etiquetas, estado de la cita y etapa del trato">r</sup>';
  const MIN = '<sup class="inf-r" title="Reconstruido con el último cambio de etapa: es un mínimo">r</sup>';

  // Filas: [grupo, nombre, fn(celda, ctx) → html]
  function filas(D, T) {
    const ok = D.ok || {};
    const m = function (fn, fuente) { return function (x, ctx) { return ok[fuente] === false ? NM : fn(x, ctx); }; };
    const cita = function (fn) { return m(function (x, ctx) { return fn(x, ctx) + (x.recon && !D.demo ? R : ''); }, 'citas'); };
    return [
      ['Anuncios', 'Inversión', m(function (x) { return eur2(x.inv); }, 'meta')],
      ['Anuncios', 'Campañas activas', m(function (x) { return M.num(x.camp); }, 'meta')],
      ['Anuncios', 'Leads (plataforma)', m(function (x) { return M.num(x.leadsMeta); }, 'meta')],
      ['Anuncios', 'Leads (CRM)', m(function (x) { return M.num(x.leadsCrm); }, 'crm')],
      ['Anuncios', 'CPL', m(function (x) { return x.leadsMeta ? eur2(x.inv / x.leadsMeta) : '—'; }, 'meta')],
      ['Reuniones', (D.demo ? T.Cita + 's agendadas' : 'Diagnósticos agendados') + ' de pago', cita(function (x) { return M.num(x.agPago); })],
      ['Reuniones', 'Agendados outbound y referidos', cita(function (x) { return M.num(x.agOtros); })],
      // De pago, que es lo que se compara con la inversión; el total con outbound y referidos, al lado.
      ['Reuniones', 'Efectivos (pago)', cita(function (x) { return M.num(x.efPago) + (x.ef !== x.efPago ? ' <small class="gris">· ' + x.ef + ' en total</small>' : '') + (x.pend ? ' <small class="gris">+' + x.pend + ' por venir</small>' : ''); })],
      ['Reuniones', 'No-show (pago)', cita(function (x) { return M.num(x.nsPago) + (x.ns !== x.nsPago ? ' <small class="gris">· ' + x.ns + ' en total</small>' : ''); })],
      ['Reuniones', 'Cancelados (pago)', cita(function (x) { return M.num(x.caPago) + (x.ca !== x.caPago ? ' <small class="gris">· ' + x.ca + ' en total</small>' : '') + (x.nm ? ' <small class="gris">· ' + x.nm + ' sin resultado</small>' : ''); })],
      ['Reuniones', 'Show rate (pago)', cita(function (x) { return x.efPago + x.nsPago ? M.pct(x.efPago / (x.efPago + x.nsPago)) : '—'; })],
      ['Reuniones', 'Coste por reunión efectiva (pago)', function (x) { return ok.meta === false || ok.citas === false ? NM : x.efPago ? eur2(x.inv / x.efPago) : '—'; }],
      ['Reuniones', 'No-show recuperados', cita(function (x) { return M.num(x.rec); })],
      ['Reuniones', 'Segundas reuniones', cita(function (x) { return M.num(x.seg) + (x.seg !== x.segEf ? ' <small class="gris">(' + x.segEf + ' hechas)</small>' : ''); })],
      ['Ventas', 'Propuestas enviadas', m(function (x) { return M.num(x.prop) + (D.demo ? '' : MIN); }, 'tratos')],
      ['Ventas', 'En negociación', m(function (x, ctx) { return ctx.actual && D.foto ? M.num(D.foto.enNegociacion) + ' <small class="gris">hoy</small>' : M.num(x.neg) + (D.demo ? '' : MIN); }, 'tratos')],
      ['Ventas', 'Dinero en juego', m(function (x, ctx) { return ctx.actual && ctx.todas && D.foto ? '<b>' + eur(D.foto.enJuego) + '</b> <small class="gris">hoy</small>' : NM; }, 'tratos')],
      ['Ventas', 'Pilotos', m(function (x) { return M.num(x.pil) + (D.demo ? '' : MIN); }, 'tratos')],
      ['Ventas', 'Clientes nuevos', m(function (x) { return M.num(x.cli) + (D.demo ? '' : MIN); }, 'tratos')],
      ['Ventas', 'Clientes activos', m(function (x, ctx) { return ctx.actual && ctx.todas && D.foto ? M.num(D.foto.clientesActivos) + ' <small class="gris">hoy</small>' : NM; }, 'tratos')],
      ['Ventas', 'CAC', function (x) {
        if (ok.meta === false || ok.tratos === false) return NM;
        if (x.cli) return x.inv ? eur2(x.inv / x.cli) : '—';
        return '<span class="gris">no calculable</span>' + (x.pil && x.inv ? '<br><small>' + eur2(x.inv / x.pil) + ' por piloto</small>' : '');
      }]
    ];
  }

  function vista() {
    const est = QV.estado, cfg = est.cfg, T = cfg.t;
    const cab = QV.cabecera('Informes', '¿Cómo va el embudo mes a mes?', 'Del anuncio al cliente por mes, por semana (de lunes a domingo) y por vertical. Lo que no se puede medir sale como NO MEDIDO.');
    let D;
    if (cfg.real) {
      if (!real && !error) { cargar(); return cab + '<div class="tarjeta"><p class="vacio">Leyendo Meta y GHL… la primera vez tarda hasta un minuto.</p></div>'; }
      if (error && !real) return cab + '<div class="tarjeta"><p class="vacio">No se ha podido preparar el informe: ' + esc(error) + '</p><button class="btn btn-mini" type="button" data-inf="recargar">Reintentar</button></div>';
      D = real;
    } else D = demo();
    const verts = D.verticales || Object.keys(VERT).map(function (k) { return { k: k, txt: VERT[k] }; }).filter(function (v) {
      return D.gasto.some(function (x) { return (x.v === 'general' ? 'sin' : x.v) === v.k; }) || D.leads.some(function (x) { return x.v === v.k; }) || D.citas.some(function (x) { return x.v === v.k; });
    });
    if (ui.vert !== 'todas' && !verts.some(function (v) { return v.k === ui.vert; })) ui.vert = 'todas';
    const hoy = dia(Date.now());
    const pers = periodos(D, ui.modo === 'vertical' ? 'mes' : ui.modo);
    let cols;
    if (ui.modo === 'vertical') {
      const todosP = periodos(D, 'mes').map(function (k) { return { k: 'm:' + k, txt: etiqueta(k, 'mes') }; }).concat(periodos(D, 'semana').map(function (k) { return { k: 's:' + k, txt: 'Semana ' + etiqueta(k, 'semana') }; }));
      if (!todosP.some(function (p) { return p.k === ui.periodo; })) ui.periodo = 'm:' + hoy.slice(0, 7);
      const modoP = ui.periodo.slice(0, 1) === 'm' ? 'mes' : 'semana', kP = ui.periodo.slice(2);
      const actual = clave(hoy, modoP) === kP;
      cols = [{ txt: 'Total', todas: true, actual: actual, f: function (d) { return clave(d, modoP) === kP; } }].concat(verts.map(function (v) {
        return { txt: v.txt, actual: actual, f: function (d, vv) { return clave(d, modoP) === kP && vv === v.k; } };
      }));
      ui._periodos = todosP;
    } else {
      cols = pers.map(function (k) {
        return { txt: etiqueta(k, ui.modo), todas: ui.vert === 'todas', actual: clave(hoy, ui.modo) === k, f: function (d, vv) { return clave(d, ui.modo) === k && (ui.vert === 'todas' || vv === ui.vert); } };
      });
    }
    const celdas = cols.map(function (c) { return celda(D, c.f); });
    const fs = filas(D, T);
    let grupo = '';
    const cuerpo = fs.map(function (f) {
      const g = f[0] !== grupo ? '<tr class="inf-grupo"><td colspan="' + (cols.length + 1) + '">' + esc(f[0]) + '</td></tr>' : '';
      grupo = f[0];
      return g + '<tr><th scope="row">' + esc(f[1]) + '</th>' + cols.map(function (c, i) { return '<td class="num' + (c.actual ? ' inf-actual' : '') + '">' + f[2](celdas[i], c) + '</td>'; }).join('') + '</tr>';
    }).join('');
    const seg = function (k, txt) { return '<button type="button" class="btn btn-mini' + (ui.modo === k ? ' btn-primario' : '') + '" data-inf-modo="' + k + '">' + txt + '</button>'; };
    const controles = '<div class="inf-ctrl">' + seg('mes', 'Por mes') + seg('semana', 'Por semana') + seg('vertical', D.demo ? 'Por campaña' : 'Por vertical') +
      (ui.modo === 'vertical'
        ? '<select class="select inf-sel" data-inf-periodo aria-label="Periodo">' + ui._periodos.map(function (p) { return '<option value="' + p.k + '"' + (p.k === ui.periodo ? ' selected' : '') + '>' + esc(p.txt) + '</option>'; }).join('') + '</select>'
        : '<select class="select inf-sel" data-inf-vert aria-label="Vertical"><option value="todas">' + (D.demo ? 'Todas las campañas' : 'Todas las verticales') + '</option>' + verts.map(function (v) { return '<option value="' + esc(v.k) + '"' + (v.k === ui.vert ? ' selected' : '') + '>' + esc(v.txt) + '</option>'; }).join('') + '</select>') +
      (cfg.real ? '<button class="btn btn-mini btn-fantasma" type="button" data-inf="recargar">' + (cargando ? 'Leyendo…' : 'Actualizar') + '</button>' : '') + '</div>';
    const avisos = (D.avisos || []).map(function (a) { return '<p class="inf-aviso">' + esc(a) + '</p>'; }).join('');
    const nota = D.demo ? '<p class="gris inf-nota">Datos de ejemplo del sector.</p>'
      : '<p class="gris inf-nota"><sup class="inf-r">r</sup> Reconstruido: las reuniones antes del 1 de octubre salen de las etiquetas, el estado de la cita y la etapa del trato; desde el 1 de octubre, del registro por cita. Propuestas, negociación, pilotos y clientes cuentan el último cambio de etapa de cada trato, así que son un mínimo. «Dinero en juego» y «Clientes activos» son una foto de hoy.</p>';
    const ab = D.abiertos || [];
    const abiertos = '<div class="tarjeta" style="margin-top:14px"><h3>Tratos abiertos con importe <span class="sub">' + M.pl(ab.length, 'trato', 'tratos') + (ab.length ? ' · ' + eur(ab.reduce(function (a, x) { return a + x.importe; }, 0)) : '') + '</span></h3>' +
      (ab.length ? '<div class="tabla-caja" style="margin-top:10px;border:0"><table class="tabla"><thead><tr><th>Empresa</th><th>Etapa</th><th class="num">Importe</th><th>' + (D.demo ? 'Campaña' : 'Vertical') + '</th><th>Origen</th><th>Último cambio</th><th>Siguiente paso</th></tr></thead><tbody>' +
        ab.map(function (x) {
          const vtx = (verts.filter(function (v) { return v.k === x.v; })[0] || {}).txt || VERT[x.v] || '—';
          const sig = x.siguienteTxt || (x.siguiente ? (x.siguiente.tipo === 'segunda' ? 'Segunda reunión' : x.siguiente.tipo === 'diagnostico' ? 'Diagnóstico' : 'Reunión') + ' · ' + M.fechaCorta(x.siguiente.t, Date.now()) : '<span class="gris">sin reunión puesta</span>');
          return '<tr><td>' + esc(x.empresa) + '</td><td>' + esc(x.etapa) + '</td><td class="num">' + eur(x.importe) + '</td><td>' + esc(vtx) + '</td><td>' + esc(x.origen) + '</td><td>' + (x.cambio ? M.fechaCorta(x.cambio, Date.now()) : '—') + '</td><td>' + (x.siguienteTxt ? esc(sig) : sig) + '</td></tr>';
        }).join('') + '</tbody></table></div>' : '<p class="vacio">No hay tratos abiertos con importe.</p>') + '</div>';
    return cab + controles + avisos +
      '<div class="tarjeta inf-tabla"><div class="tabla-caja" style="border:0"><table class="tabla"><thead><tr><th></th>' + cols.map(function (c) { return '<th class="num' + (c.actual ? ' inf-actual' : '') + '">' + esc(c.txt) + (c.actual && ui.modo !== 'vertical' ? '<small> en curso</small>' : '') + '</th>'; }).join('') + '</tr></thead><tbody>' + cuerpo + '</tbody></table></div></div>' +
      nota + abiertos;
  }

  QV.VISTA_FN.informes = vista;
  QV.informes = { celda: celda, demo: demo, periodos: periodos, clave: clave, ui: ui, datosReales: function () { return real; } };

  document.addEventListener('click', function (e) {
    const b = e.target.closest('[data-inf-modo],[data-inf]');
    if (!b) return;
    if (b.dataset.infModo) { ui.modo = b.dataset.infModo; QV.pintarVista(); return; }
    if (b.dataset.inf === 'recargar') { real = null; error = ''; cargar(true); QV.pintarVista(); }
  });
  document.addEventListener('change', function (e) {
    const s = e.target.closest('[data-inf-vert],[data-inf-periodo]');
    if (!s) return;
    if (s.hasAttribute('data-inf-vert')) ui.vert = s.value; else ui.periodo = s.value;
    QV.pintarVista();
  });
})();
