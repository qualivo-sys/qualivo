// EAC · Panel comercial en vivo — motor de datos.
// Hermano de netlify-dashboard/netlify/functions/data.mjs (Eleva), adaptado a EAC:
//  · el embudo de EAC se mide por COLUMNA del pipeline, no por appointmentStatus:
//    en EAC las 161 citas están todas como "confirmed" y el resultado real
//    vive en las columnas Plantón / Entrevistado.
//  · "Plantón" es bandera de primera clase: es la fuga principal del cliente (58%).
//  · EAC no tiene columna de matrícula, así que no hay ingresos ni ROAS:
//    la economía se cierra en COSTE POR ENTREVISTA.
//  · Google Ads va por refresh token de OAuth (la cuenta de servicio da NOT_ADS_USER aquí).
// Seguridad: todo por variables de entorno. Ningún token llega al navegador.

import crypto from 'node:crypto';

const GHL = 'https://services.leadconnectorhq.com';
const TTL = 120000; // 2 min
let CACHE = { at: 0, data: null };

const H7 = () => ({ Authorization: `Bearer ${process.env.GHL_TOKEN}`, Version: '2021-07-28', Accept: 'application/json' });
const H4 = () => ({ Authorization: `Bearer ${process.env.GHL_TOKEN}`, Version: '2021-04-15', Accept: 'application/json' });

async function ghl(pathOrUrl, h = H7) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : GHL + pathOrUrl;
  const r = await fetch(url, { headers: h() });
  if (!r.ok) throw new Error(`GHL ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

/* ---------- normalización de etapas de EAC ---------- */
// Quita emoji y acentos para que "🔥 Lead caliente" y "Plantón" sean comparables
// y sobrevivan a que el cliente renombre o reordene columnas.
const norm = (s) => String(s || '')
  .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}️]/gu, '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .trim().toLowerCase();

const ES = {
  caliente:  (e) => e === 'lead caliente',
  nuevo:     (e) => e === 'nuevo lead',
  ilocaliz:  (e) => e === 'no localizado',
  llamados:  (e) => e === 'llamados',
  citaProg:  (e) => e === 'cita programada',
  planton:   (e) => e === 'planton',
  entrev:    (e) => e === 'entrevistado',
  masAdel:   (e) => e === 'mas adelante',
  perdido:   (e) => e === 'perdido'
};

// Los `source` reales de EAC (contados sobre la cuenta, no supuestos):
//   «Meta Lead Ads» 329 · «Tik Tok Ads» 38 · «Azafata de tierra» 37 · «Despachador de vuelo web» 31
//   «Auxiliar de vuelo web» 26 · «Google Ads» 25 · «General web» 18 · «Meta_ads_Landing» 16 · «HubSpot Import…» 11
// El nombre de campaña NO vive en `source`, vive en attributions[].campaign (ver adFrom).
function provider(s) {
  const x = norm(s);
  if (!x) return '(sin origen)';
  if (/tik ?tok/.test(x)) return 'TikTok';
  if (/hubspot|^import/.test(x)) return 'Importación histórica';
  if (/google|curso_tcp_(cat|esp)/.test(x)) return 'Google Ads';
  if (/lead ads|leadform|instant|clientes potenciales/.test(x)) return 'Meta · Instantáneo';
  if (/^meta_ads|landing/.test(x)) return 'Meta · Landing';
  if (/^\[ad\]|^eac_|facebook|instagram|\bmeta\b/.test(x)) return 'Meta · (otro)';
  // formularios de la web: llevan el nombre del curso
  if (/\bweb\b|general|azafata|despachador|auxiliar|tcp|intensivo/.test(x)) return 'Web / orgánico';
  return 'Otro';
}

function adFrom(o) {
  let anuncio = '', campana = '';
  for (const a of (o.attributions || [])) {
    if (a.utmContent || a.utmCampaign) { anuncio ||= a.utmContent || ''; campana ||= a.utmCampaign || ''; }
    if ((!anuncio || !campana) && a.pageUrl) {
      try { const q = new URL(a.pageUrl).searchParams; anuncio ||= q.get('utm_content') || ''; campana ||= q.get('utm_campaign') || ''; } catch {}
    }
    if (!campana && a.campaign) campana = a.campaign;
    if (anuncio && campana) break;
  }
  return { anuncio: String(anuncio).trim(), campana: String(campana).trim() };
}

function weekMonday(ds) {
  const d = new Date(ds + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
const today = () => new Date().toISOString().slice(0, 10);

/* ---------- Meta ---------- */
function metaChannel(name) {
  const n = norm(name);
  if (/leadform|instant|formulario|clientes potenciales/.test(n)) return 'Meta · Instantáneo';
  if (/landing/.test(n)) return 'Meta · Landing';
  return 'Meta · (otro)';
}
// OJO: no sumar `lead` + `lead_grouped`, se duplican.
function metaLeads(actions) {
  if (!actions) return 0;
  const by = {}; actions.forEach((a) => { by[a.action_type] = parseFloat(a.value) || 0; });
  if (by['lead'] != null) return by['lead'];
  return (by['onsite_conversion.lead_grouped'] || 0) + (by['offsite_conversion.fb_pixel_lead'] || 0);
}
async function metaQuery(params) {
  const tok = process.env.META_TOKEN, act = process.env.META_ACT;
  if (!tok || !act) return [];
  const ver = process.env.META_API_VERSION || 'v21.0';
  const p = new URLSearchParams({ ...params, limit: '500', access_token: tok });
  let url = `https://graph.facebook.com/${ver}/${act.startsWith('act_') ? act : 'act_' + act}/insights?${p}`;
  const out = []; let guard = 0;
  while (url && guard < 40) {
    const r = await fetch(url); if (!r.ok) break;
    const d = await r.json();
    (d.data || []).forEach((row) => out.push(row));
    url = d.paging?.next || null; guard++;
  }
  return out;
}
async function metaDaily(since, until) {
  const rows = await metaQuery({ level: 'campaign', time_increment: '1', fields: 'campaign_name,spend,actions', time_range: JSON.stringify({ since, until }) });
  return rows.map((r) => ({ date: r.date_start, channel: metaChannel(r.campaign_name), campaign: r.campaign_name, spend: parseFloat(r.spend) || 0, leads: metaLeads(r.actions) }));
}
// Gasto y leads por campaña y por anuncio en el rango que mira el panel.
async function metaBreakdown(since, until) {
  const agg = (rows, key) => {
    const by = {};
    rows.forEach((r) => {
      const n = (r[key] || '(sin nombre)').trim();
      (by[n] ??= { spend: 0, leads: 0, campaign: r.campaign_name || '' });
      by[n].spend += parseFloat(r.spend) || 0; by[n].leads += metaLeads(r.actions);
    });
    return Object.entries(by).map(([name, v]) => ({ name, campaign: v.campaign, spend: v.spend, leads: v.leads, cpl: v.leads ? v.spend / v.leads : null }))
      .sort((a, b) => b.spend - a.spend);
  };
  const tr = JSON.stringify({ since, until });
  const [camp, ads] = await Promise.all([
    metaQuery({ level: 'campaign', fields: 'campaign_name,spend,actions', time_range: tr }),
    metaQuery({ level: 'ad', fields: 'ad_name,campaign_name,spend,actions', time_range: tr })
  ]);
  return { campaigns: agg(camp, 'campaign_name'), ads: agg(ads, 'ad_name') };
}

/* ---------- Google: token de usuario (OAuth) con caída a cuenta de servicio ----------
   En EAC la cuenta de servicio apiclaude@… NO está dada de alta ni en Search Console ni
   en Google Ads: solo ve qualivo.io y elevanails.es. El refresh token de OAuth sí trae
   los scopes adwords + webmasters.readonly y ve escolaeronauticadecatalunya.cat.
   Por eso aquí se prueba primero OAuth y solo se cae a la SA si no hay refresh token. */
async function oauthToken() {
  const { GADS_CLIENT_ID: id, GADS_CLIENT_SECRET: sec, GADS_REFRESH_TOKEN: rt } = process.env;
  if (!id || !sec || !rt) return null;
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: id, client_secret: sec, refresh_token: rt, grant_type: 'refresh_token' }) });
    return r.ok ? (await r.json()).access_token || null : null;
  } catch { return null; }
}

const b64url = (b) => Buffer.from(b).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
async function googleToken(scopes) {
  const raw = process.env.GOOGLE_SA_B64;
  if (!raw) return null;
  let sa; try { sa = JSON.parse(Buffer.from(raw, 'base64').toString('utf8')); } catch { return null; }
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({ iss: sa.client_email, scope: scopes.join(' '), aud: sa.token_uri, iat: now, exp: now + 3600 }));
  let sig;
  try { const s = crypto.createSign('RSA-SHA256'); s.update(head + '.' + claim); sig = b64url(s.sign(sa.private_key)); } catch { return null; }
  try {
    const r = await fetch(sa.token_uri, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${head}.${claim}.${sig}` }) });
    return r.ok ? (await r.json()).access_token || null : null;
  } catch { return null; }
}

/* ---------- Google Ads: OAuth con refresh token ----------
   En EAC la cuenta de servicio devuelve NOT_ADS_USER, así que aquí se usa
   el refresh token de un usuario con acceso al MCC (9812988446). */
const gadsToken = oauthToken;
function gadsChannel(name, type) {
  const n = norm(name), t = String(type || '').toUpperCase();
  if (t === 'PERFORMANCE_MAX' || /pmax|performance/.test(n)) return 'Google · Performance Max';
  if (t === 'SEARCH' || /search|busqueda|curso_tcp/.test(n)) return 'Google · Search';
  return 'Google · Otro';
}
async function fetchGoogleAdsDaily(since, until) {
  const dev = process.env.GADS_DEV_TOKEN, cid = (process.env.GADS_CUSTOMER_ID || '').replace(/-/g, '');
  const login = (process.env.GADS_LOGIN_CUSTOMER_ID || '').replace(/-/g, '');
  if (!dev || !cid) return null;
  const tok = await gadsToken(); if (!tok) return null;
  const ver = process.env.GADS_API_VERSION || 'v22';
  const headers = { authorization: `Bearer ${tok}`, 'developer-token': dev, 'content-type': 'application/json' };
  if (login) headers['login-customer-id'] = login;
  const query = `SELECT segments.date, campaign.name, campaign.advertising_channel_type, metrics.cost_micros, metrics.conversions, metrics.clicks, metrics.impressions FROM campaign WHERE segments.date BETWEEN '${since}' AND '${until}' AND metrics.cost_micros > 0`;
  const out = []; let pageToken = null, guard = 0;
  do {
    const body = { query }; if (pageToken) body.pageToken = pageToken;
    const r = await fetch(`https://googleads.googleapis.com/${ver}/customers/${cid}/googleAds:search`, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!r.ok) return null;
    const d = await r.json();
    (d.results || []).forEach((x) => out.push({
      date: x.segments.date, campaign: x.campaign.name,
      channel: gadsChannel(x.campaign.name, x.campaign.advertisingChannelType),
      spend: (Number(x.metrics.costMicros) || 0) / 1e6, leads: Number(x.metrics.conversions) || 0,
      clicks: Number(x.metrics.clicks) || 0, impressions: Number(x.metrics.impressions) || 0
    }));
    pageToken = d.nextPageToken || null; guard++;
  } while (pageToken && guard < 20);
  return out;
}

/* ---------- inversión unificada ---------- */
// TikTok no tiene API aprobada en EAC: entra a mano por TIKTOK_INV como
// {"2026-09":{"spend":138.02,"leads":11,"days":8}}. `days` acota el reparto a los
// días que cubre la cifra (EAC solo tiene datos del 1 al 8 de septiembre); sin `days`
// se reparte por todo el mes y el total del rango sale corto.
function tiktokInv() { try { return process.env.TIKTOK_INV ? JSON.parse(process.env.TIKTOK_INV) : {}; } catch { return {}; } }
function daysInMonth(mk) { const [y, m] = mk.split('-').map(Number); return new Date(y, m, 0).getDate(); }

async function buildSpend(since, until) {
  const spend = [];
  try { spend.push(...await metaDaily(since, until)); } catch {}
  let gads = null;
  try { gads = await fetchGoogleAdsDaily(since, until); } catch {}
  (gads || []).forEach((r) => spend.push({ date: r.date, channel: r.channel, campaign: r.campaign, spend: r.spend, leads: r.leads }));
  const tt = tiktokInv();
  Object.entries(tt).forEach(([mk, v]) => {
    const dim = Math.min(v.days || daysInMonth(mk), daysInMonth(mk));
    for (let d = 1; d <= dim; d++) {
      const date = `${mk}-${String(d).padStart(2, '0')}`;
      if (date < since || date > until) continue;
      spend.push({ date, channel: 'TikTok', campaign: 'TikTok (manual)', spend: (v.spend || 0) / dim, leads: (v.leads || 0) / dim });
    }
  });
  return { spend, gadsLive: gads !== null };
}

/* ---------- citas ---------- */
async function fetchAppointments(since, until) {
  const loc = process.env.GHL_LOCATION_ID;
  const startMs = new Date(since + 'T00:00:00Z').getTime();
  const endMs = new Date(until + 'T23:59:59Z').getTime();
  let cals = [];
  try { cals = (await ghl(`/calendars/?locationId=${encodeURIComponent(loc)}`)).calendars || []; } catch { return []; }
  const out = [];
  for (const cal of cals) {
    try {
      const j = await ghl(`/calendars/events?locationId=${encodeURIComponent(loc)}&calendarId=${cal.id}&startTime=${startMs}&endTime=${endMs}`, H4);
      (j.events || []).forEach((e) => out.push({
        date: (e.startTime || '').slice(0, 10),
        creada: (e.dateAdded || '').slice(0, 10),
        status: String(e.appointmentStatus || e.appoinmentStatus || '').toLowerCase(),
        assignedUserId: e.assignedUserId, contactId: e.contactId, curso: cal.name
      }));
    } catch {}
  }
  return out;
}

/* ---------- SEO / GA4 ---------- */
async function fetchSEO(token) {
  if (!token || !process.env.GSC_DOMAIN) return null;
  const site = 'sc-domain:' + process.env.GSC_DOMAIN;
  const end = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
  const start = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
  const base = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const q = async (body) => { try { const r = await fetch(base, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify(body) }); return r.ok ? r.json() : { rows: [] }; } catch { return { rows: [] }; } };
  const [tot, queries] = await Promise.all([q({ startDate: start, endDate: end }), q({ startDate: start, endDate: end, dimensions: ['query'], rowLimit: 20 })]);
  const t = tot.rows?.[0] || {}; const r1 = (n) => Math.round((n || 0) * 10) / 10;
  return { start, end,
    totals: { clicks: t.clicks || 0, impressions: t.impressions || 0, ctr: r1((t.ctr || 0) * 100), position: r1(t.position) },
    queries: (queries.rows || []).map((r) => ({ q: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: r1(r.position) })) };
}
async function fetchGA4(token) {
  const pid = process.env.GA4_PROPERTY_ID;
  if (!token || !pid) return null;
  const run = async (body) => { try { const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${pid}:runReport`, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: JSON.stringify(body) }); return r.ok ? r.json() : null; } catch { return null; } };
  const dateRanges = [{ startDate: '28daysAgo', endDate: 'today' }];
  const [tot, chan] = await Promise.all([
    run({ dateRanges, metrics: [{ name: 'activeUsers' }, { name: 'sessions' }] }),
    run({ dateRanges, dimensions: [{ name: 'sessionDefaultChannelGroup' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 8 })
  ]);
  if (!tot) return null;
  const num = (rep, i) => rep?.rows?.[0] ? Number(rep.rows[0].metricValues[i].value) : 0;
  return { totals: { users: num(tot, 0), sessions: num(tot, 1) },
    channels: (chan?.rows || []).map((r) => ({ channel: r.dimensionValues[0].value, sessions: Number(r.metricValues[0].value) })) };
}

/* ---------- construcción ---------- */
export async function build() {
  const loc = process.env.GHL_LOCATION_ID;
  const desde = process.env.PANEL_DESDE || '2026-05-01';

  const users = {};
  try { (await ghl(`/users/?locationId=${encodeURIComponent(loc)}`)).users?.forEach((u) => { users[u.id] = u.name; }); } catch {}

  // pipeline
  const pl = await ghl(`/opportunities/pipelines?locationId=${encodeURIComponent(loc)}`);
  const pipeId = process.env.GHL_PIPELINE_ID || null;
  const NAME = {}, orderNames = [];
  (pl.pipelines || []).forEach((p) => {
    if (pipeId && p.id !== pipeId) return;
    (p.stages || []).slice().sort((a, b) => (a.position || 0) - (b.position || 0)).forEach((s) => {
      NAME[s.id] = s.name;
      if (!orderNames.includes(s.name)) orderNames.push(s.name);
    });
  });
  // ¿existe una columna de matrícula? En EAC hoy NO, y el panel lo dice en lugar de inventar ROAS.
  const colMatricula = orderNames.find((n) => /matricul|inscrit|alumn/.test(norm(n))) || null;

  // oportunidades
  let url = `${GHL}/opportunities/search?location_id=${encodeURIComponent(loc)}${pipeId ? `&pipeline_id=${pipeId}` : ''}&limit=100`;
  const opps = []; let pages = 0;
  while (url && pages < 200) {
    const d = await ghl(url); pages++;
    (d.opportunities || []).forEach((o) => opps.push(o));
    const oldest = (d.opportunities || []).reduce((m, x) => { const f = (x.createdAt || '').slice(0, 10); return f && f < m ? f : m; }, '9999');
    if (oldest < desde) break;
    url = d.meta?.nextPageUrl || null;
  }

  // citas: ventana amplia, incluye futuras
  const apUntil = new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10);
  let rawAppts = [];
  try { rawAppts = await fetchAppointments(desde, apUntil); } catch {}

  const filas = opps.map((o) => {
    const etapa = NAME[o.pipelineStageId] || '(otra)';
    const e = norm(etapa);
    const status = norm(o.status);
    const matricula = (colMatricula && e === norm(colMatricula)) || status === 'won' ? 1 : 0;
    const entrevista = ES.entrev(e) || matricula ? 1 : 0;
    const noshow = ES.planton(e) ? 1 : 0;
    const perdido = (!matricula && (status === 'lost' || ES.perdido(e))) ? 1 : 0;
    const abandonado = (!matricula && !perdido && (status === 'abandoned' || ES.ilocaliz(e))) ? 1 : 0;
    // contactado = alguien habló con el lead (por nombre de columna, nunca por posición)
    const contactado = (ES.llamados(e) || ES.citaProg(e) || ES.planton(e) || ES.entrev(e) || ES.masAdel(e) || ES.perdido(e)) ? 1 : 0;
    const pendiente = (!matricula && !perdido && !abandonado) ? 1 : 0;
    const fecha = (o.createdAt || '').slice(0, 10);
    return {
      id: o.id, contactId: o.contactId || '', fecha, semana: fecha ? weekMonday(fecha) : '', mes: fecha.slice(0, 7),
      comercial: users[o.assignedTo] || '(sin asignar)',
      procedencia: provider(o.source), source: o.source || '', ...adFrom(o),
      etapa, caliente: ES.caliente(e) ? 1 : 0,
      contactado, entrevista, noshow, matricula, perdido, abandonado, pendiente,
      estado: matricula ? 'Matrícula' : perdido ? 'Perdido' : abandonado ? 'No localizado' : 'En curso',
      contacto: o.contact?.name || ''
    };
  }).filter((r) => r.fecha >= desde);

  // índice contacto → fila, para resolver el resultado real de cada cita
  const porContacto = {};
  filas.forEach((r) => { if (r.contactId) porContacto[r.contactId] = r; });
  filas.forEach((r) => { r.cita = 0; });

  const hoy = today();
  const citas = rawAppts.filter((a) => a.date).map((a) => {
    const f = porContacto[a.contactId];
    const cancelada0 = a.status === 'cancelled';
    if (f && !cancelada0) f.cita = 1;   // una cita cancelada no es "consiguió cita"
    // EAC no marca showed/noshow en el calendario (todo queda "confirmed"):
    // el resultado se lee de la columna del trato.
    const cancelada = cancelada0;
    const pasada = a.date <= hoy;
    const resultado = cancelada ? 'cancelada'
      : !pasada ? 'futura'
      : !f ? 'sin trato'
      : f.entrevista ? 'se presentó'
      : f.noshow ? 'plantón'
      : 'sin marcar';
    return { date: a.date, creada: a.creada, semana: weekMonday(a.date), mes: a.date.slice(0, 7),
      curso: a.curso || '(sin calendario)', comercial: users[a.assignedUserId] || '(sin asignar)',
      canal: f?.procedencia || '(sin origen)', resultado, contactId: a.contactId || '' };
  });

  const { spend, gadsLive } = await buildSpend(desde, hoy).catch(() => ({ spend: [], gadsLive: false }));
  let metaExtra = { campaigns: [], ads: [] };
  try { metaExtra = await metaBreakdown(desde, hoy); } catch {}

  let seo = null, ga4 = null;
  try {
    const oauth = await oauthToken();
    const sa = await googleToken(['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/analytics.readonly']);
    // GSC: OAuth manda (la SA no tiene la propiedad de EAC). GA4: la SA sí es lectora.
    seo = await fetchSEO(oauth || sa);
    ga4 = await fetchGA4(sa || oauth);
  } catch {}

  return {
    generatedAt: new Date().toISOString(), desde, etapas: orderNames,
    // avisos de calidad del dato: el panel los pinta arriba en vez de esconderlos
    avisos: {
      sinColumnaMatricula: !colMatricula,
      gadsLive,
      citasSinMarcar: citas.filter((c) => c.resultado === 'sin marcar').length,
      citasSinTrato: citas.filter((c) => c.resultado === 'sin trato').length,
      // El status de GHL y la columna del tablero no siempre dicen lo mismo: hay tratos
      // con status lost/abandoned sentados en columnas vivas (Llamados, Cita Programada…).
      // El panel los cuenta como cerrados (criterio conservador) pero avisa de cuántos son,
      // porque cambia la lectura de "cuántos leads siguen vivos".
      statusFueraDeColumna: filas.filter((r) => {
        const e = norm(r.etapa);
        return (r.perdido && !ES.perdido(e)) || (r.abandonado && !ES.ilocaliz(e));
      }).length
    },
    filas, citas, spend, metaExtra, seo, ga4
  };
}

export default async function handler(req, res) {
  const pw = (req.query?.pw) || req.headers['x-dash-pw'] || '';
  if (!process.env.DASHBOARD_PASSWORD || pw !== process.env.DASHBOARD_PASSWORD) {
    res.status(401).json({ error: 'unauthorized' }); return;
  }
  try {
    if (!CACHE.data || Date.now() - CACHE.at > TTL) CACHE = { at: Date.now(), data: await build() };
    res.setHeader('cache-control', 'no-store');
    res.status(200).json(CACHE.data);
  } catch (e) {
    res.status(500).json({ error: String(e && e.message || e) });
  }
}
