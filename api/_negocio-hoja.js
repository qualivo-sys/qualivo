// Panel de negocio · hoja «Facturación» (Google Sheets, cuenta de servicio GOOGLE_SA_JSON).
//
//  - Lee «<MES> · plan y control» y «COCKPIT · caja 18 meses» (y «DEUDA» si existe).
//    No se asume una maqueta fija: se buscan las tablas por sus cabeceras y las cifras
//    por su etiqueta, para que la hoja pueda seguir cambiando sin romper el panel.
//  - Datos manuales del panel (saldos, huchas, estado de cobro, suscripciones, estado de
//    cada cliente): pestaña «PANEL · datos manuales», que crea el propio panel.
//  - Registro de acciones en GHL (quién, qué, cuándo): pestaña «PANEL · registro».
// Ninguna cifra vive en el código: todo se lee con la sesión del panel.

const G = require('./_google.js');
const C = require('./_negocio-comun.js');

const HOJA = process.env.FINANZAS_SHEET_ID || '1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0';
const TAB_MANUAL = 'PANEL · datos manuales';
const TAB_REGISTRO = 'PANEL · registro';
const TAB_COCKPIT = /^COCKPIT\s*·\s*caja/i;
const TAB_DEUDA = /^DEUDA$/i;
const CAB_MANUAL = ['tipo', 'nombre', 'importe', 'estado', 'nota', 'extra', 'actualizado', 'usuario'];
const TIPOS = ['cuenta', 'cobro', 'suscripcion', 'cliente', 'deuda', 'impuesto'];

function hayCuenta() { return !!process.env.GOOGLE_SA_JSON; }
function rango(tab, r) { return encodeURIComponent("'" + tab.replace(/'/g, "''") + "'" + (r ? '!' + r : '')); }

async function pestanas() {
  const d = await G.sheets('GET', HOJA + '?fields=sheets.properties(sheetId,title)');
  return (d.sheets || []).map(function (s) { return { id: s.properties.sheetId, titulo: s.properties.title }; });
}
async function valores(tab, formato) {
  const d = await G.sheets('GET', HOJA + '/values/' + rango(tab, 'A1:AD400') + '?valueRenderOption=' + (formato ? 'FORMATTED_VALUE' : 'UNFORMATTED_VALUE') + '&dateTimeRenderOption=FORMATTED_STRING');
  return d.values || [];
}

// ---------------------------------------------------------------------------
// Lectura genérica: bloques separados por filas vacías → { titulo, cabecera, filas }
// ---------------------------------------------------------------------------
function vacia(f) { return !f || !f.some(function (x) { return String(x == null ? '' : x).trim() !== ''; }); }
function llenas(f) { return (f || []).filter(function (x) { return String(x == null ? '' : x).trim() !== ''; }).length; }
function bloques(fmt, raw) {
  const out = [];
  let actual = null;
  for (let i = 0; i < fmt.length; i++) {
    const f = fmt[i];
    if (vacia(f)) { actual = null; continue; }
    if (!actual) { actual = { titulo: '', cabecera: null, filas: [], crudas: [], fila0: i }; out.push(actual); }
    if (!actual.cabecera && !actual.filas.length && llenas(f) === 1 && String(f[0] || '').trim() && !actual.titulo) { actual.titulo = String(f[0]).trim(); continue; }
    if (!actual.cabecera && !actual.filas.length && llenas(f) >= 2 && f.filter(function (x) { return typeof x === 'string' && x.trim() && !/^[-\d.,\s€%]+$/.test(x); }).length >= llenas(f) - 1) { actual.cabecera = f.map(function (x) { return String(x || '').trim(); }); continue; }
    actual.filas.push(f.map(function (x) { return String(x == null ? '' : x); }));
    actual.crudas.push(raw[i] || []);
  }
  // Quitar columnas vacías del todo en cada bloque
  out.forEach(function (b) {
    const ancho = Math.max(b.cabecera ? b.cabecera.length : 0, ...b.filas.map(function (f) { return f.length; }), 0);
    const usadas = [];
    for (let c = 0; c < ancho; c++) {
      const algo = (b.cabecera && b.cabecera[c]) || b.filas.some(function (f) { return String(f[c] || '').trim(); });
      if (algo) usadas.push(c);
    }
    b.cols = usadas;
    b.cabecera = b.cabecera ? usadas.map(function (c) { return b.cabecera[c] || ''; }) : null;
    b.filas = b.filas.map(function (f) { return usadas.map(function (c) { return f[c] || ''; }); });
    b.crudas = b.crudas.map(function (f) { return usadas.map(function (c) { return f[c]; }); });
  });
  return out.filter(function (b) { return b.filas.length || b.cabecera; });
}
function aNumero(x) {
  if (typeof x === 'number') return x;
  const s = String(x == null ? '' : x).replace(/[€%\s]/g, '').replace(/−/g, '-');
  if (!s || !/\d/.test(s)) return null;
  const n = Number(/,\d{1,2}$/.test(s) ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, ''));
  return isFinite(n) ? n : null;
}
function col(cab, re) { if (!cab) return -1; for (let i = 0; i < cab.length; i++) if (re.test(C.normal(cab[i]))) return i; return -1; }
// Busca en toda la cuadrícula una etiqueta y devuelve el primer número a su derecha.
function cifra(raw, re) {
  for (const f of raw) {
    for (let c = 0; c < f.length; c++) {
      if (typeof f[c] === 'string' && re.test(C.normal(f[c]))) {
        for (let k = c + 1; k < f.length; k++) { const n = typeof f[k] === 'number' ? f[k] : null; if (n != null) return n; }
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Datos manuales
// ---------------------------------------------------------------------------
async function asegurarTab(titulo, cabecera) {
  const tabs = await pestanas();
  if (tabs.some(function (t) { return t.titulo === titulo; })) return;
  await G.sheets('POST', HOJA + ':batchUpdate', { requests: [{ addSheet: { properties: { title: titulo } } }] });
  await G.sheets('PUT', HOJA + '/values/' + rango(titulo, 'A1') + '?valueInputOption=RAW', { values: [cabecera] });
}
async function leerManual() {
  let filas;
  try { filas = await valores(TAB_MANUAL, false); } catch (e) { if (/400|404|Unable to parse range/i.test(String(e.message))) return []; throw e; }
  return filas.slice(1).filter(function (f) { return f[0] && f[1]; }).map(function (f) {
    return { tipo: String(f[0]).trim().toLowerCase(), nombre: String(f[1]).trim(), importe: aNumero(f[2]), estado: String(f[3] || ''), nota: String(f[4] || ''), extra: String(f[5] || ''), actualizado: String(f[6] || ''), usuario: String(f[7] || '') };
  });
}
function limpiar(s, max) { return String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max || 300); }
// Guarda (alta o cambio) o borra una fila manual. Reescribe la pestaña entera.
async function guardarManual(dato, usuario) {
  const tipo = String(dato.tipo || '').toLowerCase();
  if (TIPOS.indexOf(tipo) < 0) throw Object.assign(new Error('Tipo de dato no válido.'), { status: 400 });
  const nombre = limpiar(dato.nombre, 120);
  if (!nombre) throw Object.assign(new Error('Falta el nombre.'), { status: 400 });
  // Texto que empiece por = + - @ se guarda tal cual (RAW), sin fórmulas.
  await asegurarTab(TAB_MANUAL, CAB_MANUAL);
  const filas = await leerManual();
  const i = filas.findIndex(function (f) { return f.tipo === tipo && C.normal(f.nombre) === C.normal(dato.nombreAnterior || nombre); });
  if (dato.borrar) { if (i >= 0) filas.splice(i, 1); }
  else {
    const imp = dato.importe === '' || dato.importe == null ? null : aNumero(dato.importe);
    const fila = { tipo: tipo, nombre: nombre, importe: imp, estado: limpiar(dato.estado, 60), nota: limpiar(dato.nota, 500), extra: limpiar(dato.extra, 300), actualizado: new Date().toISOString(), usuario: usuario };
    if (i >= 0) filas[i] = fila; else filas.push(fila);
  }
  const vals = [CAB_MANUAL].concat(filas.map(function (f) { return [f.tipo, f.nombre, f.importe == null ? '' : f.importe, f.estado, f.nota, f.extra, f.actualizado, f.usuario]; }));
  await G.sheets('POST', HOJA + '/values/' + rango(TAB_MANUAL, 'A1:H1000') + ':clear', {});
  await G.sheets('PUT', HOJA + '/values/' + rango(TAB_MANUAL, 'A1') + '?valueInputOption=RAW', { values: vals });
  C.borrarCache('hoja|');
  return { ok: true };
}

// Registro de acciones (una fila por clic)
async function registrar(e) {
  await asegurarTab(TAB_REGISTRO, ['fecha', 'usuario', 'acción', 'contacto', 'oportunidad', 'resumen', 'resultado']);
  await G.sheets('POST', HOJA + '/values/' + rango(TAB_REGISTRO, 'A1') + ':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS', {
    values: [[new Date().toISOString(), e.usuario, e.accion, e.contacto || '', e.oportunidad || '', limpiar(e.resumen, 300), e.resultado]]
  });
}
async function leerRegistro() {
  try {
    const f = await valores(TAB_REGISTRO, true);
    return f.slice(1).reverse().slice(0, 50).map(function (x) { return { fecha: x[0], usuario: x[1], accion: x[2], resumen: x[5], resultado: x[6] }; });
  } catch (e) { return []; }
}

// ---------------------------------------------------------------------------
// Finanzas
// ---------------------------------------------------------------------------
function esMes(x) {
  const s = C.normal(x);
  return /^(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*( de)? ?'?\d{2,4}$/.test(s) || /^\d{1,2} \d{4}$/.test(s) || /^\d{4} \d{2}$/.test(s);
}
// Cockpit de caja: fila de meses + filas con etiqueta a la izquierda.
function cockpit(fmt, raw) {
  let filaMeses = -1, cols = [];
  for (let i = 0; i < fmt.length && filaMeses < 0; i++) {
    const c = [];
    (fmt[i] || []).forEach(function (x, k) { if (esMes(x)) c.push(k); });
    if (c.length >= 6) { filaMeses = i; cols = c; }
  }
  if (filaMeses < 0) return null;
  const meses = cols.map(function (k) { return String(fmt[filaMeses][k]).trim(); });
  const series = [];
  for (let i = filaMeses + 1; i < fmt.length; i++) {
    const f = fmt[i] || [], r = raw[i] || [];
    const etiqueta = f.slice(0, cols[0]).map(function (x) { return String(x || '').trim(); }).filter(Boolean).join(' · ');
    if (!etiqueta) continue;
    if (esMes(f[cols[0]])) break; // empieza otra tabla de meses
    const v = cols.map(function (k) { return typeof r[k] === 'number' ? r[k] : aNumero(r[k]); });
    if (v.every(function (x) { return x == null; })) continue;
    series.push({ etiqueta: etiqueta, valores: v, personal: /personal|hogar|vivienda|alquiler casa|familia/i.test(C.normal(etiqueta)) });
  }
  const busca = function (re, sin) { return series.filter(function (s) { return re.test(C.normal(s.etiqueta)) && !(sin && sin.test(C.normal(s.etiqueta))) && !s.personal; })[0] || null; };
  const ingresos = busca(/^(total )?ingres|^cobros?/);
  const gastos = busca(/gastos? (de )?(qualivo|empresa|negocio|operativ)|^(total )?gastos?$/, /personal/);
  const deuda = busca(/deuda|cuotas?|prestamo|aplazam/);
  const impuestos = busca(/impuesto|iva|irpf|hacienda/, /deuda|aplaz/);
  const resultado = busca(/resultado.*(qualivo|empresa|negocio)|resultado sin personal|neto (de )?(qualivo|empresa|negocio)/) || busca(/^resultado|^neto|flujo/, /personal/);
  const caja = busca(/caja (al )?(final|fin)|saldo (al )?(final|fin)|^caja$/);
  const filas = meses.map(function (m, k) {
    const val = function (s) { return s ? s.valores[k] : null; };
    let neto = null;
    if (ingresos && (gastos || deuda || impuestos)) neto = (val(ingresos) || 0) - Math.abs(val(gastos) || 0) - Math.abs(val(deuda) || 0) - Math.abs(val(impuestos) || 0);
    else if (resultado) neto = val(resultado);
    return { mes: m, ingresos: val(ingresos), gastos: val(gastos), deuda: val(deuda), impuestos: val(impuestos), resultado: neto, caja: val(caja) };
  });
  return {
    meses: meses, filas: filas,
    calculado: !!(ingresos && (gastos || deuda || impuestos)),
    etiquetas: { ingresos: ingresos && ingresos.etiqueta, gastos: gastos && gastos.etiqueta, deuda: deuda && deuda.etiqueta, impuestos: impuestos && impuestos.etiqueta, resultado: resultado && resultado.etiqueta, caja: caja && caja.etiqueta },
    detalle: series.filter(function (s) { return !s.personal; }).map(function (s) { return { etiqueta: s.etiqueta, valores: s.valores }; }),
    ocultas: series.filter(function (s) { return s.personal; }).length
  };
}

// Facturas del mes: el bloque con «Cliente» y «Estado» (o «Base») en la cabecera.
function facturas(bloquesPlan, manual) {
  const b = bloquesPlan.filter(function (x) { return x.cabecera && col(x.cabecera, /^cliente/) >= 0 && (col(x.cabecera, /estado|cobr/) >= 0 || col(x.cabecera, /base|importe/) >= 0); })[0];
  if (!b) return null;
  const h = b.cabecera;
  const ci = { cliente: col(h, /^cliente/), tipo: col(h, /^tipo|concepto/), origen: col(h, /origen|canal/), base: col(h, /^base|importe sin|^importe$/), iva: col(h, /^iva/), irpf: col(h, /irpf|retenc/), total: col(h, /al banco|total|a cobrar|liquido/), estado: col(h, /estado|cobr/), nota: col(h, /nota|comentario|observ/) };
  const cobros = {};
  manual.filter(function (m) { return m.tipo === 'cobro'; }).forEach(function (m) { cobros[C.normal(m.nombre)] = m; });
  const filas = [];
  b.crudas.forEach(function (r, i) {
    const f = b.filas[i];
    const cliente = String(f[ci.cliente] || '').trim();
    if (!cliente || /^total/i.test(cliente)) return;
    const n = function (k) { return ci[k] >= 0 ? (typeof r[ci[k]] === 'number' ? r[ci[k]] : aNumero(r[ci[k]])) : null; };
    const base = n('base'), iva = n('iva'), irpf = n('irpf');
    let total = n('total');
    if (total == null && base != null) total = base + (iva || 0) - Math.abs(irpf || 0);
    const m = cobros[C.normal(cliente)] || cobros[C.normal(cliente + ' ' + (f[ci.tipo] || ''))];
    filas.push({
      cliente: cliente, tipo: ci.tipo >= 0 ? f[ci.tipo] : '', origen: ci.origen >= 0 ? f[ci.origen] : '', base: base, iva: iva, irpf: irpf, total: total,
      estado: m && m.estado ? m.estado : (ci.estado >= 0 ? f[ci.estado] : ''), nota: m && m.nota ? m.nota : (ci.nota >= 0 ? f[ci.nota] : ''), manual: !!m
    });
  });
  return { titulo: b.titulo, filas: filas };
}

// Gastos: bloque con «Presupuesto». Si tiene «Categoría», se agrupa; la publicidad, de Meta.
function gastos(bloquesPlan, metaMes) {
  const b = bloquesPlan.filter(function (x) { return x.cabecera && col(x.cabecera, /presup/) >= 0 && col(x.cabecera, /^cliente/) < 0; });
  if (!b.length) return null;
  const filas = [];
  b.forEach(function (bl) {
    const h = bl.cabecera;
    const ci = { concepto: Math.max(col(h, /concepto|gasto|partida|proveedor|herramienta/), 0), categoria: col(h, /categor/), anterior: col(h, /octubre|real (mes )?anterior|mes pasado|^real oct/), presupuesto: col(h, /presup/), real: col(h, /gastado|real(?! oct)|pagado$|^real$/), estado: col(h, /estado|pagad/), nota: col(h, /nota|comentario/) };
    bl.crudas.forEach(function (r, i) {
      const f = bl.filas[i];
      const concepto = String(f[ci.concepto] || '').trim();
      if (!concepto || /^total/i.test(concepto) || /personal/i.test(C.normal(concepto + ' ' + (f[ci.categoria] || '')))) return;
      const n = function (k) { return ci[k] >= 0 ? (typeof r[ci[k]] === 'number' ? r[ci[k]] : aNumero(r[ci[k]])) : null; };
      filas.push({ concepto: concepto, categoria: ci.categoria >= 0 ? (f[ci.categoria] || 'Sin categoría') : (bl.titulo || 'Gastos'), anterior: n('anterior'), presupuesto: n('presupuesto'), real: n('real'), estado: ci.estado >= 0 ? f[ci.estado] : '', nota: ci.nota >= 0 ? f[ci.nota] : '' });
    });
  });
  const cat = {};
  filas.forEach(function (f) {
    const k = f.categoria;
    cat[k] = cat[k] || { categoria: k, presupuesto: 0, real: 0, publicidad: /publicidad|meta|ads|anuncio/i.test(C.normal(k)) };
    cat[k].presupuesto += f.presupuesto || 0; cat[k].real += f.real || 0;
  });
  const categorias = Object.keys(cat).map(function (k) { return cat[k]; });
  const pub = categorias.filter(function (c) { return c.publicidad; })[0];
  if (metaMes != null) {
    if (pub) { pub.real = metaMes; pub.fuente = 'API de Meta'; }
    else categorias.push({ categoria: 'Publicidad (Meta)', presupuesto: null, real: metaMes, publicidad: true, fuente: 'API de Meta' });
  }
  return { filas: filas, categorias: categorias };
}

async function finanzas(fresco, metaMesFn) {
  if (!hayCuenta()) return { sinCuenta: true, aviso: 'Falta GOOGLE_SA_JSON en Vercel: la cuenta de servicio que lee la hoja «Facturación» (necesita permiso de editor para guardar los datos manuales).' };
  return C.cacheado('hoja|finanzas', 3 * 60000, fresco, async function () {
    const hoy = C.diaMadrid(Date.now());
    const tabs = await pestanas();
    const mes = C.nombreMes(hoy);
    const reMes = new RegExp('^' + mes + '\\s*·\\s*plan', 'i');
    const tabPlan = (tabs.filter(function (t) { return reMes.test(t.titulo); })[0] ||
      tabs.filter(function (t) { return /·\s*plan y control/i.test(t.titulo); })[0] || {}).titulo;
    const tabCockpit = (tabs.filter(function (t) { return TAB_COCKPIT.test(t.titulo); })[0] || {}).titulo;
    const tabDeuda = (tabs.filter(function (t) { return TAB_DEUDA.test(t.titulo); })[0] || {}).titulo;
    const leerAmbos = async function (t) { if (!t) return null; const [f, r] = await Promise.all([valores(t, true), valores(t, false)]); return { fmt: f, raw: r }; };
    const [plan, cock, deu, manual, metaMes] = await Promise.all([
      leerAmbos(tabPlan), leerAmbos(tabCockpit), leerAmbos(tabDeuda), leerManual(),
      metaMesFn ? metaMesFn().catch(function () { return null; }) : null
    ]);
    const avisos = [];
    if (!tabPlan) avisos.push('No encuentro la pestaña «' + mes.toUpperCase() + ' · plan y control».');
    if (!tabCockpit) avisos.push('No encuentro la pestaña «COCKPIT · caja 18 meses».');
    const bPlan = plan ? bloques(plan.fmt, plan.raw) : [];
    const fac = facturas(bPlan, manual);
    const gas = gastos(bPlan, metaMes);
    const cajas = cock ? cockpit(cock.fmt, cock.raw) : null;
    if (cock && !cajas) avisos.push('En el cockpit no encuentro la fila de meses (oct-26, nov-26…).');

    // Cifras clave: primero lo que mete Maikel en el panel; si no, lo que diga la hoja.
    const cuentas = manual.filter(function (m) { return m.tipo === 'cuenta'; });
    const sumaCuentas = function (re) { const l = cuentas.filter(function (c) { return re.test(C.normal(c.estado + ' ' + c.nombre)); }); return l.length ? l.reduce(function (s, c) { return s + (c.importe || 0); }, 0) : null; };
    const raw = plan ? plan.raw : [];
    const ivaFact = fac ? fac.filas.reduce(function (s, f) { return s + (f.iva || 0); }, 0) : null;
    const irpfFact = fac ? fac.filas.reduce(function (s, f) { return s + Math.abs(f.irpf || 0); }, 0) : null;
    const cobrada = function (f) { return /cobrad|pagad|ingresad/i.test(f.estado); };
    const kpis = {
      banco: cuentas.length ? sumaCuentas(/empresa|operativ|cuenta|banco/) : cifra(raw, /^(saldo|caja)( en)?( el)? banco|saldo cuenta/),
      huchas: cuentas.length ? sumaCuentas(/hucha/) : null,
      reserva: cuentas.length ? sumaCuentas(/reserva/) : null,
      cajaInicial: cifra(raw, /caja (total )?(inicial|al empezar|a 1)/),
      facturacionPrevista: fac ? fac.filas.reduce(function (s, f) { return s + (f.base || 0); }, 0) : cifra(raw, /facturacion prevista|previsto facturar/),
      cobrado: fac ? fac.filas.filter(cobrada).reduce(function (s, f) { return s + (f.total || 0); }, 0) : null,
      pendiente: fac ? fac.filas.filter(function (f) { return !cobrada(f); }).reduce(function (s, f) { return s + (f.total || 0); }, 0) : null,
      mrr: cifra(raw, /^mrr|cuotas? (mensuales? )?(de )?clientes|recurrente/),
      metaMes: metaMes,
      deudaMes: cifra(raw, /cuotas? (de )?deuda|deuda (al )?mes/) || cifra(deu ? deu.raw : [], /total cuotas?|cuota mensual total|total mensual/),
      deudaTotal: cifra(deu ? deu.raw : [], /^total( deuda| pendiente)?$|deuda total|saldo (pendiente )?total/) || cifra(raw, /deuda total/),
      ivaApartar: ivaFact
    };
    const impuestos = [
      { concepto: 'IVA repercutido en las facturas del mes', importe: ivaFact, cuando: 'Se paga con el modelo 303 del trimestre, del 1 al 20 del mes siguiente al cierre (enero, abril, julio y octubre).', fuente: 'Facturas de la hoja' },
      { concepto: 'Retenciones de IRPF en las facturas del mes', importe: irpfFact, cuando: 'Las retiene el cliente y las ingresa él; cuentan como pago a cuenta en tu renta o en el 130.', fuente: 'Facturas de la hoja' }
    ].concat(manual.filter(function (m) { return m.tipo === 'impuesto'; }).map(function (m) { return { concepto: m.nombre, importe: m.importe, cuando: m.nota, fuente: 'Dato del panel (' + m.usuario + ')' }; }));

    return {
      hoja: { plan: tabPlan || null, cockpit: tabCockpit || null, deuda: tabDeuda || null },
      kpis: kpis,
      cuentas: cuentas,
      facturas: fac,
      gastos: gas,
      impuestos: impuestos,
      suscripciones: manual.filter(function (m) { return m.tipo === 'suscripcion'; }),
      deudaManual: manual.filter(function (m) { return m.tipo === 'deuda'; }),
      deudaHoja: deu ? bloques(deu.fmt, deu.raw).map(function (b) { return { titulo: b.titulo, cabecera: b.cabecera, filas: b.filas }; }) : [],
      caja18: cajas,
      otrosBloques: bPlan.filter(function (b) { return !(fac && b.titulo === fac.titulo && b.cabecera && col(b.cabecera, /^cliente/) >= 0) && !(b.cabecera && col(b.cabecera, /presup/) >= 0); }).map(function (b) { return { titulo: b.titulo, cabecera: b.cabecera, filas: b.filas }; }).slice(0, 12),
      avisos: avisos,
      generado: Date.now()
    };
  });
}

// Estado de cada cliente (manual) y sus cuentas de Meta
async function clientesManual() {
  if (!hayCuenta()) return null;
  return C.cacheado('hoja|clientes', 3 * 60000, false, async function () {
    const m = await leerManual();
    return m.filter(function (x) { return x.tipo === 'cliente'; }).map(function (x) {
      return { cliente: x.nombre, estado: x.estado, nota: x.nota, ids: (x.extra.match(/act_\d+|\b\d{9,20}\b/g) || []).map(function (id) { return id.indexOf('act_') === 0 ? id : 'act_' + id; }), actualizado: x.actualizado, usuario: x.usuario };
    });
  });
}

module.exports = { finanzas, guardarManual, leerManual, registrar, leerRegistro, clientesManual, hayCuenta, TIPOS, _prueba: { bloques, cockpit, facturas, gastos, cifra, esMes } };
