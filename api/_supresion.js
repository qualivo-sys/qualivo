// Supresión V1 (adenda operativa del 2-oct-2026, punto 19.2): antes de escribir,
// invitar o llamar a alguien por cualquier canal, se consulta aquí si se puede.
// Es el mínimo para operar con seguridad; no sustituye la Identity Layer completa.
//
// Una persona o empresa queda bloqueada si:
//   - su dominio es de un cliente (SUPRESION_DOMINIOS, separados por comas);
//   - pidió no recibir más (etiqueta act-baja / baja en GHL, o «Do Not Contact» /
//     «Not Interested» / «Wrong Person» / rebote en Smartlead);
//   - tiene una oportunidad abierta o ganada en cualquier pipeline de GHL;
//   - tiene una cita futura en GHL;
//   - ya está en una secuencia activa de Smartlead, o ha respondido a una
//     (entonces es conversación, no prospección).
// Lo que no se puede comprobar se devuelve como «desconocido», nunca como libre.
//
// Variables: GHL_API_KEY, GHL_LOCATION_ID, SMARTLEAD_API_KEY (opcional: sin ella
// solo se mira la hoja), GOOGLE_SA_JSON + SUPRESION_SHEET_ID (hoja con la foto
// de Smartlead, pestaña «Supresión»), SUPRESION_DOMINIOS.
const fs = require('fs');
const os = require('os');
const path = require('path');
const A = require('./_activacion.js');

const SL_BASE = 'https://server.smartlead.ai/api/v1';
const PESTANA = 'Supresión';
// Campañas de Smartlead que no son de Qualivo (clientes de outbound a terceros).
const CAMPANAS_AJENAS = /DKR|scubalight|Kubysoft|Infoproducto|Mailerfind/i;
// Categorías de Smartlead que bloquean para siempre.
const CATEGORIAS_BLOQUEO = { 3: 'no le interesa', 4: 'pidió no contactar', 7: 'persona equivocada', 9: 'rebote' };
const CATEGORIAS_RESPONDIO = { 1: 'interesado', 2: 'pidió reunión', 5: 'pidió información' };
const ESTADOS_ACTIVOS = { INPROGRESS: 1, STARTED: 1 };
const ETIQUETAS_BAJA = ['act-baja', 'baja', 'nut-stop'];
const ETIQUETAS_CLIENTE = ['cliente', 'piloto'];

function dominioDe(x) {
  const s = String(x || '').trim().toLowerCase();
  if (!s) return '';
  if (s.indexOf('@') > -1) return s.split('@')[1];
  return s.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
}

function dominiosCliente() {
  return String(process.env.SUPRESION_DOMINIOS || '').split(',').map(dominioDe).filter(Boolean);
}

// ---------------------------------------------------------------------------
// GHL
// ---------------------------------------------------------------------------
async function contactosGHL(email, dominio) {
  const vistos = {};
  const lista = [];
  async function busca(q) {
    const r = await fetch(A.GHL_BASE + '/contacts/search', {
      method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, A.cabeceras()),
      body: JSON.stringify({ locationId: process.env.GHL_LOCATION_ID, pageLimit: 20, query: q })
    });
    if (!r.ok) throw new Error('ghl_contacts_search ' + r.status);
    return ((await r.json()).contacts || []);
  }
  const candidatos = [];
  if (email) candidatos.push.apply(candidatos, await busca(email));
  if (dominio) candidatos.push.apply(candidatos, await busca(dominio));
  for (const c of candidatos) {
    if (vistos[c.id]) continue;
    const em = String(c.email || '').toLowerCase();
    const web = dominioDe(c.website || '');
    const coincide = (email && em === email) || (dominio && (dominioDe(em) === dominio || web === dominio));
    if (!coincide) continue;
    vistos[c.id] = 1;
    lista.push(c);
  }
  return lista;
}

async function oportunidadesDe(contactId) {
  const r = await fetch(A.GHL_BASE + '/opportunities/search?location_id=' + encodeURIComponent(process.env.GHL_LOCATION_ID) +
    '&contact_id=' + encodeURIComponent(contactId), { headers: A.cabeceras() });
  if (!r.ok) throw new Error('ghl_opportunities_search ' + r.status);
  return ((await r.json()).opportunities || []);
}

async function citasFuturasDe(contactId) {
  const r = await fetch(A.GHL_BASE + '/contacts/' + contactId + '/appointments', { headers: A.cabeceras() });
  if (!r.ok) return [];
  const ahora = Date.now();
  return ((await r.json()).events || []).filter(function (e) {
    return Date.parse(e.startTime) > ahora && !/cancel|no_?show|invalid/i.test(String(e.appointmentStatus || ''));
  });
}

async function revisarGHL(email, dominio, motivos) {
  const contactos = await contactosGHL(email, dominio);
  for (const c of contactos) {
    const tags = (c.tags || []).map(String);
    const quien = (c.firstName || c.contactName || c.email || c.id);
    if (tags.some(function (t) { return ETIQUETAS_BAJA.indexOf(t) > -1; })) motivos.push('GHL: ' + quien + ' pidió no recibir más');
    if (tags.some(function (t) { return ETIQUETAS_CLIENTE.indexOf(t) > -1; })) motivos.push('GHL: ' + quien + ' es cliente o piloto');
    const ops = await oportunidadesDe(c.id);
    for (const o of ops) {
      if (o.status === 'won') motivos.push('GHL: trato ganado «' + o.name + '»');
      else if (o.status === 'open') motivos.push('GHL: oportunidad abierta «' + o.name + '»');
    }
    const citas = await citasFuturasDe(c.id);
    if (citas.length) motivos.push('GHL: ' + quien + ' tiene cita el ' + String(citas[0].startTime).slice(0, 16));
  }
  return contactos.length;
}

// ---------------------------------------------------------------------------
// Smartlead
// ---------------------------------------------------------------------------
async function sl(ruta) {
  const k = process.env.SMARTLEAD_API_KEY;
  if (!k) return null;
  const r = await fetch(SL_BASE + ruta + (ruta.indexOf('?') > -1 ? '&' : '?') + 'api_key=' + k);
  if (r.status === 429) { await new Promise(function (ok) { setTimeout(ok, 3000); }); return sl(ruta); }
  if (!r.ok) throw new Error('smartlead ' + ruta.split('?')[0] + ' ' + r.status);
  return r.json();
}

// Lo que Smartlead sabe de un correo concreto, en vivo.
async function revisarSmartleadCorreo(email, motivos) {
  const d = await sl('/leads/?email=' + encodeURIComponent(email));
  if (!d || !d.id) return false;
  for (const c of (d.lead_campaign_data || [])) {
    if (CAMPANAS_AJENAS.test(c.campaign_name || '')) continue;
    const cat = c.lead_category_id;
    if (CATEGORIAS_BLOQUEO[cat]) motivos.push('Smartlead: ' + CATEGORIAS_BLOQUEO[cat] + ' (' + c.campaign_name + ')');
    else if (CATEGORIAS_RESPONDIO[cat]) motivos.push('Smartlead: respondió, ' + CATEGORIAS_RESPONDIO[cat] + ' (' + c.campaign_name + ')');
    if (ESTADOS_ACTIVOS[c.lead_status]) motivos.push('Smartlead: en secuencia activa (' + c.campaign_name + ')');
  }
  if (d.is_unsubscribed) motivos.push('Smartlead: se dio de baja');
  return true;
}

// Foto completa de Smartlead: todos los contactos de las campañas de Qualivo
// con su estado. Tarda un par de minutos; se guarda en disco seis horas.
async function fotoSmartlead(forzar) {
  const cache = path.join(os.tmpdir(), 'qualivo-supresion-smartlead.json');
  try {
    const st = fs.statSync(cache);
    if (!forzar && Date.now() - st.mtimeMs < 6 * 3600 * 1000) return JSON.parse(fs.readFileSync(cache, 'utf8'));
  } catch (e) { /* sin caché */ }
  const camps = await sl('/campaigns');
  if (!camps) return null;
  const filas = [];
  for (const c of camps) {
    if (CAMPANAS_AJENAS.test(c.name)) continue;
    let off = 0;
    while (true) {
      const j = await sl('/campaigns/' + c.id + '/leads?offset=' + off + '&limit=100');
      const data = (j && j.data) || [];
      for (const d of data) {
        const em = String((d.lead || {}).email || '').toLowerCase();
        if (!em) continue;
        filas.push({ email: em, dominio: dominioDe(em), estado: d.status || '', categoria: d.lead_category_id || '', campana: c.name, fecha: String(d.created_at || '').slice(0, 10) });
      }
      off += 100;
      if (data.length < 100) break;
    }
  }
  try { fs.writeFileSync(cache, JSON.stringify(filas)); } catch (e) { /* disco de solo lectura */ }
  return filas;
}

// La misma foto leída de la hoja privada (para el endpoint, que no tiene clave de Smartlead).
async function fotoDesdeHoja() {
  const sid = process.env.SUPRESION_SHEET_ID;
  if (!sid || !process.env.GOOGLE_SA_JSON) return null;
  const G = require('./_google.js');
  const d = await G.sheets('GET', sid + '/values/' + encodeURIComponent("'" + PESTANA + "'!A2:F"));
  return ((d.values || []).map(function (f) {
    return { email: f[0] || '', dominio: f[1] || '', estado: f[2] || '', categoria: f[3] || '', campana: f[4] || '', fecha: f[5] || '' };
  }));
}

async function refrescarHoja() {
  const sid = process.env.SUPRESION_SHEET_ID;
  if (!sid) throw new Error('falta SUPRESION_SHEET_ID');
  const filas = await fotoSmartlead(true);
  if (!filas) throw new Error('falta SMARTLEAD_API_KEY');
  const G = require('./_google.js');
  const meta = await G.sheets('GET', sid + '?fields=sheets.properties.title');
  if (!(meta.sheets || []).some(function (s) { return s.properties.title === PESTANA; })) {
    await G.sheets('POST', sid + ':batchUpdate', { requests: [{ addSheet: { properties: { title: PESTANA } } }] });
  }
  await G.sheets('POST', sid + '/values/' + encodeURIComponent("'" + PESTANA + "'!A1:Z") + ':clear', {});
  const cab = ['email', 'dominio', 'estado', 'categoria', 'campaña', 'fecha'];
  const valores = [cab].concat(filas.map(function (f) { return [f.email, f.dominio, f.estado, f.categoria, f.campana, f.fecha]; }));
  for (let i = 0; i < valores.length; i += 5000) {
    await G.sheets('PUT', sid + '/values/' + encodeURIComponent("'" + PESTANA + "'!A" + (i + 1)) + '?valueInputOption=RAW', { values: valores.slice(i, i + 5000) });
  }
  return filas.length;
}

function revisarFoto(filas, email, dominio, motivos, omitirCorreo) {
  let tocados = 0;
  for (const f of filas) {
    const mismo = (email && f.email === email);
    // El correo ya se miró en vivo: aquí solo cuentan los demás de su dominio.
    if (mismo && omitirCorreo) continue;
    const mismoDominio = (dominio && f.dominio === dominio);
    if (!mismo && !mismoDominio) continue;
    tocados++;
    const quien = mismo ? 'este correo' : f.email;
    if (CATEGORIAS_BLOQUEO[f.categoria]) motivos.push('Smartlead: ' + quien + ' ' + CATEGORIAS_BLOQUEO[f.categoria] + ' (' + f.campana + ')');
    else if (CATEGORIAS_RESPONDIO[f.categoria]) motivos.push('Smartlead: ' + quien + ' respondió, ' + CATEGORIAS_RESPONDIO[f.categoria] + ' (' + f.campana + ')');
    if (ESTADOS_ACTIVOS[f.estado]) motivos.push('Smartlead: ' + quien + ' en secuencia activa (' + f.campana + ')');
  }
  return tocados;
}

// ---------------------------------------------------------------------------
// La consulta
// ---------------------------------------------------------------------------
// consultar({ email, dominio }) → { bloqueado, motivos, avisos, contacto_previo }
//   bloqueado: true si hay cualquier motivo. avisos: lo que no se pudo comprobar.
//   contacto_previo: ya escribimos a esa empresa alguna vez (no bloquea por sí
//   solo, pero el mensaje no puede hacerse el nuevo).
async function consultar(entrada, opciones) {
  opciones = opciones || {};
  const email = String(entrada.email || '').trim().toLowerCase();
  const dominio = dominioDe(entrada.dominio || email);
  const motivos = [], avisos = [];
  let previo = 0;
  if (!email && !dominio) return { bloqueado: true, motivos: ['sin correo ni dominio'], avisos: avisos, contacto_previo: 0 };

  if (dominio && dominiosCliente().indexOf(dominio) > -1) motivos.push('dominio de cliente');

  try { previo += await revisarGHL(email, dominio, motivos); }
  catch (e) { avisos.push('GHL no comprobado: ' + (e && e.message)); }

  let correoEnVivo = false;
  if (email) {
    try { correoEnVivo = await revisarSmartleadCorreo(email, motivos); if (correoEnVivo) previo++; }
    catch (e) { avisos.push('Smartlead (correo) no comprobado: ' + (e && e.message)); }
  }
  try {
    const foto = opciones.foto || (process.env.SMARTLEAD_API_KEY ? await fotoSmartlead(false) : await fotoDesdeHoja());
    if (foto) previo += revisarFoto(foto, email, dominio, motivos, correoEnVivo);
    else avisos.push('Smartlead (dominio) no comprobado: sin clave ni hoja');
  } catch (e) { avisos.push('Smartlead (dominio) no comprobado: ' + (e && e.message)); }

  const unicos = motivos.filter(function (m, i) { return motivos.indexOf(m) === i; });
  return { bloqueado: unicos.length > 0, motivos: unicos, avisos: avisos, contacto_previo: previo };
}

module.exports = { consultar, dominioDe, dominiosCliente, fotoSmartlead, fotoDesdeHoja, refrescarHoja, PESTANA };
