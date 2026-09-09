// Informe diario del recorrido (cron 06:45 UTC → Google Sheet del embudo).
// Tres pestañas: «Ads diario» (una fila por día y anuncio: impresiones, clics, CTR, CPC,
// gasto, visitas a la página, leads y coste por lead), «Web diario» (una fila por día:
// visitas GA4, eventos del Hero, registros en GoHighLevel, reuniones, clics e impresiones
// en Google, artículos publicados) y «Posiciones 7d» (consultas y páginas de Search Console).
// Variables: CRON_SECRET, GOOGLE_SA_JSON, INFORME_SHEET_ID, META_ADS_TOKEN (ads_read),
// META_AD_ACCOUNT (act_…), GHL_API_KEY, GHL_LOCATION_ID, GA4_PROPERTY_ID (opcional).
// GET /api/informe/?fecha=AAAA-MM-DD&dias=N para rellenar días atrás.

const G = require('./_google');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const SITIO_GSC = 'sc-domain:qualivo.io';
const TABS = {
  ads: { nombre: 'Ads diario', cab: ['Fecha', 'Campaña', 'Conjunto', 'Anuncio', 'Impresiones', 'Alcance', 'Frecuencia', 'Clics enlace', 'CTR enlace %', 'CPC €', 'Gasto €', 'Visitas página', 'Coste/visita €', 'Leads (píxel)', 'Coste/lead €', 'Actualizado'] },
  web: { nombre: 'Web diario', cab: ['Fecha', 'Sesiones GA4', 'Usuarios GA4', 'Páginas vistas', 'Hero vistas', 'Hero inicios', 'Hero completados', 'Hero registros', 'Formularios web', 'Registros GHL (radiografía)', 'De Meta', 'Con WhatsApp', 'Prioritarios', 'Leads web GHL (todos)', 'Reuniones (acumulado)', 'Clientes (acumulado)', 'GSC clics', 'GSC impresiones', 'GSC CTR %', 'GSC posición media', 'Páginas con clics', 'Artículos publicados', 'Actualizado'] },
  pos: { nombre: 'Posiciones 7d', cab: ['Periodo', 'Tipo', 'Consulta / Página', 'Clics', 'Impresiones', 'CTR %', 'Posición'] }
};

function fechaISO(d) { return d.toISOString().slice(0, 10); }
function n(x, dec) { const v = Number(x); return Number.isFinite(v) ? Number(v.toFixed(dec === undefined ? 2 : dec)) : ''; }
function accion(lista, tipos) {
  for (const t of tipos) { const a = (lista || []).find(function (x) { return x.action_type === t; }); if (a) return Number(a.value) || 0; }
  return 0;
}

// ── Meta Ads ─────────────────────────────────────────────────────────
async function filasAds(fecha) {
  const token = process.env.META_ADS_TOKEN, act = process.env.META_AD_ACCOUNT;
  if (!token || !act) return { filas: [], nota: 'sin META_ADS_TOKEN' };
  const u = new URL('https://graph.facebook.com/v21.0/' + act + '/insights');
  u.searchParams.set('level', 'ad');
  u.searchParams.set('time_range', JSON.stringify({ since: fecha, until: fecha }));
  u.searchParams.set('fields', 'campaign_name,adset_name,ad_name,impressions,reach,frequency,inline_link_clicks,inline_link_click_ctr,cpc,spend,actions');
  u.searchParams.set('limit', '200');
  u.searchParams.set('access_token', token);
  const r = await fetch(u);
  if (!r.ok) throw new Error('Meta insights ' + r.status + ': ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  const ahora = new Date().toISOString().slice(0, 16).replace('T', ' ');
  return { filas: (d.data || []).map(function (x) {
    const visitas = accion(x.actions, ['landing_page_view']);
    const leads = accion(x.actions, ['lead', 'offsite_conversion.fb_pixel_lead', 'onsite_conversion.lead_grouped']);
    const gasto = Number(x.spend) || 0;
    return [fecha, x.campaign_name, x.adset_name, x.ad_name, n(x.impressions, 0), n(x.reach, 0), n(x.frequency), n(x.inline_link_clicks, 0),
      n(x.inline_link_click_ctr), n(x.cpc), n(gasto), visitas, visitas ? n(gasto / visitas) : '', leads, leads ? n(gasto / leads) : '', ahora];
  }) };
}

// ── GoHighLevel ──────────────────────────────────────────────────────
async function contactosConTag(tag, ghl, locationId) {
  const out = []; let page = 1;
  while (page <= 30) {
    const r = await fetch(GHL_BASE + '/contacts/search', { method: 'POST', headers: ghl,
      body: JSON.stringify({ locationId, page, pageLimit: 100, filters: [{ field: 'tags', operator: 'contains', value: tag }] }) });
    if (!r.ok) throw new Error('GHL search ' + r.status);
    const d = await r.json(); const lote = d.contacts || [];
    out.push.apply(out, lote); if (lote.length < 100) break; page++;
  }
  return out;
}
async function datosGhl(fecha) {
  const apiKey = process.env.GHL_API_KEY, locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return {};
  const ghl = { Authorization: 'Bearer ' + apiKey, Version: GHL_VERSION, 'Content-Type': 'application/json' };
  const dx = 'dx-' + fecha.replace(/-/g, '');
  const radiografia = await contactosConTag('diagnostico-crecimiento', ghl, locationId);
  const hoy = radiografia.filter(function (c) { return (c.tags || []).includes(dx); });
  const web = await contactosConTag('qualivo-landing', ghl, locationId);
  const webHoy = web.filter(function (c) { return String(c.dateAdded || '').slice(0, 10) === fecha; });
  const has = function (c, t) { return (c.tags || []).includes(t); };
  return {
    registros: hoy.length,
    deMeta: hoy.filter(function (c) { return has(c, 'utm-meta'); }).length,
    conWhatsApp: hoy.filter(function (c) { return has(c, 'con-whatsapp'); }).length,
    prioritarios: hoy.filter(function (c) { return has(c, 'prioridad-alta'); }).length,
    leadsWeb: webHoy.length,
    reuniones: web.filter(function (c) { return has(c, 'reunion-reservada'); }).length,
    clientes: web.filter(function (c) { return has(c, 'cliente-ganado'); }).length
  };
}

// ── Search Console ───────────────────────────────────────────────────
async function gsc(body) {
  const t = await G.tokenGoogle('https://www.googleapis.com/auth/webmasters.readonly');
  const r = await fetch('https://www.googleapis.com/webmasters/v3/sites/' + encodeURIComponent(SITIO_GSC) + '/searchAnalytics/query', {
    method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('GSC ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return (await r.json()).rows || [];
}
async function datosGsc(fecha) {
  const tot = await gsc({ startDate: fecha, endDate: fecha, dimensions: ['date'] });
  const pags = await gsc({ startDate: fecha, endDate: fecha, dimensions: ['page'], rowLimit: 500 });
  const t = tot[0] || {};
  return { clics: t.clicks || 0, impresiones: t.impressions || 0, ctr: t.ctr ? n(t.ctr * 100) : 0, posicion: t.position ? n(t.position, 1) : '',
    paginasConClics: pags.filter(function (p) { return p.clicks > 0; }).length };
}
async function posiciones7d(hasta) {
  const desde = fechaISO(new Date(Date.parse(hasta) - 6 * 86400000));
  const periodo = desde + ' → ' + hasta;
  const q = await gsc({ startDate: desde, endDate: hasta, dimensions: ['query'], rowLimit: 60 });
  const p = await gsc({ startDate: desde, endDate: hasta, dimensions: ['page'], rowLimit: 40 });
  const fila = function (tipo, r) { return [periodo, tipo, r.keys[0], r.clicks, r.impressions, n(r.ctr * 100), n(r.position, 1)]; };
  return q.map(function (r) { return fila('consulta', r); }).concat(p.map(function (r) { return fila('página', r); }));
}

// ── GA4 (opcional) ───────────────────────────────────────────────────
async function datosGa4(fecha) {
  const prop = process.env.GA4_PROPERTY_ID;
  if (!prop) return {};
  const t = await G.tokenGoogle('https://www.googleapis.com/auth/analytics.readonly');
  const run = async function (body) {
    const r = await fetch('https://analyticsdata.googleapis.com/v1beta/properties/' + prop + ':runReport', { method: 'POST', headers: { Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ dateRanges: [{ startDate: fecha, endDate: fecha }] }, body)) });
    if (!r.ok) throw new Error('GA4 ' + r.status + ': ' + (await r.text()).slice(0, 200));
    return (await r.json()).rows || [];
  };
  const tot = await run({ metrics: [{ name: 'sessions' }, { name: 'totalUsers' }, { name: 'screenPageViews' }] });
  const ev = await run({ dimensions: [{ name: 'eventName' }], metrics: [{ name: 'eventCount' }] });
  const e = {}; ev.forEach(function (r) { e[r.dimensionValues[0].value] = Number(r.metricValues[0].value) || 0; });
  const m = (tot[0] || {}).metricValues || [];
  return { sesiones: Number((m[0] || {}).value) || 0, usuarios: Number((m[1] || {}).value) || 0, paginas: Number((m[2] || {}).value) || 0,
    heroVistas: e.hero_view || 0, heroInicios: e.hero_start || 0, heroCompletados: e.hero_complete || 0, heroRegistros: e.hero_email_submit || 0,
    formularios: e.diagnostico_solicitado || 0 };
}

async function articulosPublicados() {
  const r = await fetch('https://qualivo.io/sitemap.xml');
  if (!r.ok) return '';
  return ((await r.text()).match(/<loc>https:\/\/qualivo\.io\/blog\/[^<]+\/<\/loc>/g) || []).length;
}

// ── Sheet ────────────────────────────────────────────────────────────
async function asegurarPestanas(sid) {
  const meta = await G.sheets('GET', sid + '?fields=sheets.properties.title');
  const existentes = meta.sheets.map(function (s) { return s.properties.title; });
  const nuevas = Object.values(TABS).filter(function (t) { return !existentes.includes(t.nombre); });
  if (nuevas.length) await G.sheets('POST', sid + ':batchUpdate', { requests: nuevas.map(function (t) { return { addSheet: { properties: { title: t.nombre } } }; }) });
  for (const t of Object.values(TABS)) {
    const v = await G.sheets('GET', sid + '/values/' + encodeURIComponent("'" + t.nombre + "'!A1:A1"));
    if (!v.values || !v.values.length) {
      await G.sheets('PUT', sid + '/values/' + encodeURIComponent("'" + t.nombre + "'!A1") + '?valueInputOption=RAW', { values: [t.cab] });
    }
  }
}
async function quitarFilasDe(sid, tab, fecha, colClave) {
  const v = await G.sheets('GET', sid + '/values/' + encodeURIComponent("'" + tab + "'!A:A"));
  const filas = (v.values || []).map(function (r, i) { return { i: i, val: r[0] }; }).filter(function (r) { return r.i > 0 && r.val === fecha; });
  if (!filas.length) return;
  const meta = await G.sheets('GET', sid + '?fields=sheets.properties');
  const sh = meta.sheets.find(function (s) { return s.properties.title === tab; }).properties.sheetId;
  // Borrar de abajo arriba para no desplazar índices
  const reqs = filas.sort(function (a, b) { return b.i - a.i; }).map(function (f) { return { deleteDimension: { range: { sheetId: sh, dimension: 'ROWS', startIndex: f.i, endIndex: f.i + 1 } } }; });
  await G.sheets('POST', sid + ':batchUpdate', { requests: reqs });
  void colClave;
}
async function anadir(sid, tab, filas) {
  if (!filas.length) return;
  await G.sheets('POST', sid + '/values/' + encodeURIComponent("'" + tab + "'!A1") + ':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS', { values: filas });
}
async function reemplazarPestana(sid, tab, cab, filas) {
  await G.sheets('POST', sid + '/values/' + encodeURIComponent("'" + tab + "'!A2:Z") + ':clear', {});
  await G.sheets('PUT', sid + '/values/' + encodeURIComponent("'" + tab + "'!A1") + '?valueInputOption=USER_ENTERED', { values: [cab].concat(filas) });
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const sid = process.env.INFORME_SHEET_ID;
  if (!sid || !process.env.GOOGLE_SA_JSON) return res.status(500).json({ ok: false, error: 'not_configured' });

  const q = req.query || {};
  const dias = Math.min(31, Math.max(1, parseInt(q.dias, 10) || 1));
  const fin = /^\d{4}-\d{2}-\d{2}$/.test(String(q.fecha || '')) ? String(q.fecha) : fechaISO(new Date(Date.now() - 86400000));
  const resumen = { fechas: [], errores: [] };
  const ahora = new Date().toISOString().slice(0, 16).replace('T', ' ');

  try {
    await asegurarPestanas(sid);
    for (let k = dias - 1; k >= 0; k--) {
      const fecha = fechaISO(new Date(Date.parse(fin) - k * 86400000));
      const err = function (origen, e) { resumen.errores.push(fecha + ' ' + origen + ': ' + String(e && e.message || e).slice(0, 160)); };
      const ads = await filasAds(fecha).catch(function (e) { err('meta', e); return { filas: [] }; });
      const ghl = await datosGhl(fecha).catch(function (e) { err('ghl', e); return {}; });
      const g = await datosGsc(fecha).catch(function (e) { err('gsc', e); return {}; });
      const ga = await datosGa4(fecha).catch(function (e) { err('ga4', e); return {}; });
      const arts = await articulosPublicados().catch(function () { return ''; });

      await quitarFilasDe(sid, TABS.ads.nombre, fecha);
      await anadir(sid, TABS.ads.nombre, ads.filas);
      await quitarFilasDe(sid, TABS.web.nombre, fecha);
      await anadir(sid, TABS.web.nombre, [[fecha, ga.sesiones !== undefined ? ga.sesiones : '', ga.usuarios !== undefined ? ga.usuarios : '', ga.paginas !== undefined ? ga.paginas : '',
        ga.heroVistas !== undefined ? ga.heroVistas : '', ga.heroInicios !== undefined ? ga.heroInicios : '', ga.heroCompletados !== undefined ? ga.heroCompletados : '', ga.heroRegistros !== undefined ? ga.heroRegistros : '', ga.formularios !== undefined ? ga.formularios : '',
        ghl.registros !== undefined ? ghl.registros : '', ghl.deMeta !== undefined ? ghl.deMeta : '', ghl.conWhatsApp !== undefined ? ghl.conWhatsApp : '', ghl.prioritarios !== undefined ? ghl.prioritarios : '', ghl.leadsWeb !== undefined ? ghl.leadsWeb : '', ghl.reuniones !== undefined ? ghl.reuniones : '', ghl.clientes !== undefined ? ghl.clientes : '',
        g.clics !== undefined ? g.clics : '', g.impresiones !== undefined ? g.impresiones : '', g.ctr !== undefined ? g.ctr : '', g.posicion !== undefined ? g.posicion : '', g.paginasConClics !== undefined ? g.paginasConClics : '', arts, ahora]]);
      resumen.fechas.push({ fecha, anuncios: ads.filas.length, registros: ghl.registros, gscClics: g.clics });
    }
    // Posiciones: Search Console tarda 2-3 días; ventana de 7 días que acaba anteayer
    const hastaGsc = fechaISO(new Date(Date.parse(fin) - 2 * 86400000));
    const pos = await posiciones7d(hastaGsc).catch(function (e) { resumen.errores.push('posiciones: ' + String(e.message).slice(0, 160)); return null; });
    if (pos) await reemplazarPestana(sid, TABS.pos.nombre, TABS.pos.cab, pos);
  } catch (e) {
    console.error('[informe]', e);
    return res.status(502).json({ ok: false, error: String(e.message).slice(0, 200), resumen });
  }
  console.log('[informe]', JSON.stringify(resumen));
  return res.status(200).json(Object.assign({ ok: true }, resumen));
};
