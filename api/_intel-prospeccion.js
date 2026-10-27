// Prospección (Maikel, 8-oct-2026): las cuentas que prepara la sesión de outbound y las
// campañas de Smartlead, dentro del modo real de Qualivo Intelligence.
//
// - Las cuentas viven en la pestaña «Prospección» del Sheet de finanzas (FINANZAS_SHEET_ID).
//   La escribe la sesión de outbound; aquí se leen y, con un clic de Maikel, se cambia el
//   estado o la versión de una fila. Ningún dato de prospectos vive en el repositorio.
// - Smartlead: se leen las campañas y sus números. Crear una campaña solo pasa con un clic de
//   Maikel y la deja en BORRADOR: sin buzones asignados y sin arrancar, así que no sale nada
//   hasta que él la active en Smartlead.
// La clave de Smartlead está en la variable de entorno smartlead_KEY.

const G = require('./_google.js');

const SHEET = process.env.FINANZAS_SHEET_ID || '1nO_3TfBuXHMIzQP2ChCX58xxlbd1o75b90Pla0_H7i0';
const TAB = process.env.PROSPECCION_TAB || 'Prospección';
const SL = process.env.INTELLIGENCE_SMARTLEAD_BASE || 'https://server.smartlead.ai/api/v1';
// Columnas de la pestaña, en orden (la fila 1 es la cabecera).
const COLS = ['id', 'empresa', 'web', 'sector', 'tamano', 'senal', 'decisor', 'cargo', 'email', 'linkedin', 'estado', 'version', 'asunto_a', 'mensaje_a', 'asunto_b', 'mensaje_b', 'campana', 'nota', 'actualizado'];
const ESTADOS = ['propuesta', 'aprobada', 'descartada', 'en campaña', 'respondió', 'reunión'];
const LETRA = function (i) { return String.fromCharCode(65 + i); };

function claveSL() { return process.env.smartlead_KEY || process.env.SMARTLEAD_KEY || process.env.SMARTLEAD_API_KEY || ''; }

async function sl(metodo, ruta, cuerpo) {
  const sep = ruta.indexOf('?') >= 0 ? '&' : '?';
  const ctl = new AbortController();
  const t = setTimeout(function () { ctl.abort(); }, 15000);
  try {
    const r = await fetch(SL + ruta + sep + 'api_key=' + encodeURIComponent(claveSL()), {
      method: metodo, signal: ctl.signal,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'QualivoIntelligence/1.0' },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });
    const txt = await r.text();
    let d = null; try { d = JSON.parse(txt); } catch (e) { d = { texto: txt.slice(0, 200) }; }
    if (!r.ok) throw new Error('Smartlead ' + r.status + ': ' + String((d && (d.message || d.error || d.texto)) || '').slice(0, 120));
    return d;
  } finally { clearTimeout(t); }
}

// ---------- Lectura ----------
async function leerCuentas() {
  let v;
  try {
    v = (await G.sheets('GET', SHEET + '/values/' + encodeURIComponent("'" + TAB + "'") + '!A1:' + LETRA(COLS.length - 1) + '2000')).values || [];
  } catch (e) {
    if (/400|Unable to parse range/i.test(String(e.message))) return { falta: true, cuentas: [] };
    throw e;
  }
  const cab = (v[0] || []).map(function (x) { return String(x || '').trim().toLowerCase(); });
  // Si la cabecera trae los nombres, manda la cabecera; si no, el orden de COLS.
  const pos = {};
  COLS.forEach(function (k, i) { const j = cab.indexOf(k); pos[k] = j >= 0 ? j : i; });
  const cuentas = [];
  v.slice(1).forEach(function (r, i) {
    const o = { fila: i + 2 };
    COLS.forEach(function (k) { o[k] = String(r[pos[k]] == null ? '' : r[pos[k]]).trim(); });
    if (!o.empresa && !o.email) return;
    o.estado = (o.estado || 'propuesta').toLowerCase();
    o.version = (o.version || '').toUpperCase();
    cuentas.push(o);
  });
  return { falta: false, cuentas: cuentas, columnas: pos };
}

async function leerCampanas() {
  if (!claveSL()) return { sinClave: true, campanas: [] };
  const lista = await sl('GET', '/campaigns');
  const campanas = (Array.isArray(lista) ? lista : (lista.data || [])).slice(0, 40);
  // Números de las 15 más recientes (una llamada por campaña)
  campanas.sort(function (a, b) { return Date.parse(b.created_at || 0) - Date.parse(a.created_at || 0); });
  const out = await Promise.all(campanas.slice(0, 15).map(async function (c) {
    let a = {};
    try { a = await sl('GET', '/campaigns/' + c.id + '/analytics'); } catch (e) { a = {}; }
    const n = function (k) { return Number(a[k] || 0); };
    return { id: c.id, nombre: c.name, estado: String(c.status || '').toLowerCase(), creada: c.created_at,
      leads: Number((a.campaign_lead_stats && a.campaign_lead_stats.total) || a.total_count || 0),
      enviados: n('sent_count'), abiertos: n('unique_open_count') || n('open_count'), respuestas: n('reply_count'), rebotes: n('bounce_count') };
  }));
  return { sinClave: false, campanas: out };
}

async function datos() {
  const avisos = [];
  let c = { falta: false, cuentas: [] }, s = { sinClave: false, campanas: [] };
  try { c = await leerCuentas(); } catch (e) { avisos.push('No se ha podido leer la pestaña «' + TAB + '»: ' + String(e.message).slice(0, 100)); }
  try { s = await leerCampanas(); } catch (e) { avisos.push('No se ha podido leer Smartlead: ' + String(e.message).slice(0, 100)); }
  return { generado: Date.now(), pestana: TAB, columnas: COLS, estados: ESTADOS, faltaPestana: c.falta, cuentas: c.cuentas, sinClaveSmartlead: s.sinClave, campanas: s.campanas, avisos: avisos };
}

// ---------- Escritura (solo con un clic de Maikel) ----------
async function escribirCelda(fila, col, valor) {
  const c = await leerCuentas();
  const j = c.columnas && c.columnas[col] != null ? c.columnas[col] : COLS.indexOf(col);
  const rango = "'" + TAB + "'!" + LETRA(j) + fila;
  await G.sheets('PUT', SHEET + '/values/' + encodeURIComponent(rango) + '?valueInputOption=RAW', { values: [[valor]] });
}
async function marcar(b) {
  const fila = Number(b.fila);
  if (!(fila >= 2 && fila <= 2000)) throw new Error('Fila no válida.');
  const c = await leerCuentas();
  const cu = c.cuentas.filter(function (x) { return x.fila === fila; })[0];
  if (!cu) throw new Error('Esa fila ya no está en la pestaña.');
  if (b.estado != null) {
    if (ESTADOS.indexOf(b.estado) < 0) throw new Error('Estado no válido.');
    await escribirCelda(fila, 'estado', b.estado);
  }
  if (b.version != null) {
    if (['A', 'B'].indexOf(b.version) < 0) throw new Error('Versión no válida.');
    await escribirCelda(fila, 'version', b.version);
  }
  await escribirCelda(fila, 'actualizado', new Date().toISOString().slice(0, 16).replace('T', ' ') + ' · Maikel desde Intelligence');
  return { ok: true };
}

// Crea la campaña en Smartlead en BORRADOR con las cuentas elegidas (aprobadas y con correo).
// Un paso por cuenta con su asunto y su mensaje no es posible en Smartlead (la secuencia es de
// la campaña), así que la secuencia usa variables: {{asunto}} y {{mensaje}} de cada lead.
async function crearCampana(b) {
  if (!claveSL()) throw new Error('Falta la clave de Smartlead (smartlead_KEY) en Vercel.');
  const nombre = String(b.nombre || '').trim().slice(0, 90);
  if (!nombre) throw new Error('Ponle nombre a la campaña.');
  const filas = (Array.isArray(b.filas) ? b.filas : []).map(Number).filter(function (n) { return n >= 2; });
  if (!filas.length) throw new Error('Elige al menos una cuenta.');
  const c = await leerCuentas();
  const elegidas = c.cuentas.filter(function (x) { return filas.indexOf(x.fila) >= 0; });
  const validas = elegidas.filter(function (x) { return x.estado === 'aprobada' && /@/.test(x.email); });
  if (!validas.length) throw new Error('Ninguna de las cuentas elegidas está aprobada y con correo.');
  const camp = await sl('POST', '/campaigns/create', { name: nombre });
  const id = camp.id || (camp.data && camp.data.id);
  if (!id) throw new Error('Smartlead no ha devuelto el id de la campaña.');
  await sl('POST', '/campaigns/' + id + '/sequences', { sequences: [{ seq_number: 1, seq_delay_details: { delay_in_days: 0 }, subject: '{{asunto}}', email_body: '{{mensaje}}' }] });
  const leads = validas.map(function (x) {
    const v = x.version === 'B' && x.mensaje_b ? 'b' : 'a';
    const p = x.decisor.split(/\s+/);
    return { email: x.email, first_name: p[0] || '', last_name: p.slice(1).join(' '), company_name: x.empresa, website: x.web, linkedin_profile: x.linkedin,
      custom_fields: { asunto: x['asunto_' + v] || x.asunto_a, mensaje: String(x['mensaje_' + v] || x.mensaje_a).replace(/\n/g, '<br>'), sector: x.sector, senal: x.senal } };
  });
  await sl('POST', '/campaigns/' + id + '/leads', { lead_list: leads, settings: { ignore_global_block_list: false, ignore_unsubscribe_list: false, ignore_duplicate_leads_in_other_campaign: false } });
  // Las cuentas pasan a «en campaña» con el nombre de la campaña
  for (const x of validas) {
    await escribirCelda(x.fila, 'estado', 'en campaña');
    await escribirCelda(x.fila, 'campana', nombre);
  }
  return { ok: true, id: id, nombre: nombre, cuentas: validas.length, saltadas: elegidas.length - validas.length, url: 'https://app.smartlead.ai/app/email-campaign/' + id + '/analytics' };
}

module.exports = { datos: datos, marcar: marcar, crearCampana: crearCampana, COLS: COLS, ESTADOS: ESTADOS };
