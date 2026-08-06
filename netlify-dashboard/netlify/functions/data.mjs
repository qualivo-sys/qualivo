/**
 * data.mjs — Función serverless de Netlify.
 * Devuelve el dataset comercial NORMALIZADO en vivo desde GoHighLevel:
 * una fila por oportunidad con comercial, procedencia, etapa, estado y flags.
 *
 * Seguridad: exige la contraseña compartida (DASHBOARD_PASSWORD). Los tokens
 * viven en variables de entorno de Netlify, nunca se envían al navegador.
 * Caché en memoria de 2 min para no golpear GHL en cada visita.
 */
const GHL = 'https://services.leadconnectorhq.com';
const TTL = 120000; // 2 minutos
let CACHE = { at: 0, data: null };

const headers = () => ({
  Authorization: `Bearer ${process.env.GHL_TOKEN}`,
  Version: '2021-07-28',
  Accept: 'application/json',
  'User-Agent': 'qualivo-dashboard/1.0'
});

async function ghl(pathOrUrl) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : GHL + pathOrUrl;
  const r = await fetch(url, { headers: headers() });
  if (!r.ok) throw new Error(`GHL ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}

function provider(s) {
  const x = (s || '').toLowerCase();
  if (x.includes('google')) return 'Google Ads';
  if (x.includes('landing')) return 'Meta · Landing';
  if (/facebook|lead form|instant|formulario|meta/.test(x)) return 'Meta · Instantáneo';
  if (/whatsapp|gener|directo|web/.test(x)) return 'Web / WhatsApp';
  return s ? 'Otro' : '(sin fuente)';
}
function weekMonday(ds) {
  const d = new Date(ds + 'T00:00:00Z');
  const off = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return d.toISOString().slice(0, 10);
}

/* ---------- Inversión: Meta (en vivo) + Google (manual) ---------- */
const COURSE_PRICE = Number(process.env.COURSE_PRICE || 1500);
// Google Ads manual por mes (editable con la env var GOOGLE_INV en JSON).
const GOOGLE_INV_DEFAULT = {
  '2026-07': {
    'Google · Performance Max': { spend: 200.55, leads: 26 },
    'Google · Search': { spend: 201.61, leads: 20 }
  },
  '2026-06': {
    'Google · Performance Max': { spend: 355.79, leads: 14 },
    'Google · Search': { spend: 135.04, leads: 8 }
  }
};
function googleInv() {
  try { return process.env.GOOGLE_INV ? JSON.parse(process.env.GOOGLE_INV) : GOOGLE_INV_DEFAULT; }
  catch { return GOOGLE_INV_DEFAULT; }
}
function metaChannel(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('landing')) return 'Meta · Landing';
  if (/lead|instant|formulario/.test(n)) return 'Meta · Instantáneo';
  return 'Meta · (otro)';
}
function metaLeads(actions) {
  if (!actions) return 0;
  const by = {}; actions.forEach((a) => { by[a.action_type] = parseFloat(a.value) || 0; });
  if (by['lead'] != null) return by['lead'];
  return (by['onsite_conversion.lead_grouped'] || 0) + (by['offsite_conversion.fb_pixel_lead'] || 0);
}
function daysInMonth(mk) { const [y, m] = mk.split('-').map(Number); return new Date(y, m, 0).getDate(); }

/** Insights diarios de Meta por campaña/canal. Devuelve [{date,channel,spend,leads}]. */
async function metaDaily(since, until) {
  const tok = process.env.META_TOKEN, act = process.env.META_ACT;
  if (!tok || !act) return [];
  const ver = process.env.META_API_VERSION || 'v21.0';
  const params = new URLSearchParams({
    level: 'campaign', time_increment: '1',
    fields: 'campaign_name,spend,actions', limit: '500',
    time_range: JSON.stringify({ since, until }), access_token: tok
  });
  let url = `https://graph.facebook.com/${ver}/act_${act}/insights?${params}`;
  const out = []; let guard = 0;
  while (url && guard < 40) {
    const r = await fetch(url);
    if (!r.ok) break;
    const d = await r.json();
    (d.data || []).forEach((row) => out.push({
      date: row.date_start, channel: metaChannel(row.campaign_name),
      spend: parseFloat(row.spend) || 0, leads: metaLeads(row.actions)
    }));
    url = (d.paging && d.paging.next) || null;
  }
  return out;
}

/** Array de inversión diaria unificada (Meta real + Google repartido por días del mes). */
async function buildSpend(since, until) {
  const spend = await metaDaily(since, until);
  const g = googleInv();
  Object.keys(g).forEach((mk) => {
    const dim = daysInMonth(mk);
    for (let day = 1; day <= dim; day++) {
      const date = `${mk}-${String(day).padStart(2, '0')}`;
      if (date < since || date > until) continue;
      Object.entries(g[mk]).forEach(([channel, v]) => {
        spend.push({ date, channel, spend: v.spend / dim, leads: v.leads / dim });
      });
    }
  });
  return spend;
}

/** Citas (bookings) de todos los calendarios en [since,until] (fechas YYYY-MM-DD). */
async function fetchAppointments(since, until) {
  const loc = process.env.GHL_LOCATION_ID;
  const startMs = new Date(since + 'T00:00:00Z').getTime();
  const endMs = new Date(until + 'T23:59:59Z').getTime();
  let cals = [];
  try { const c = await ghl(`/calendars/?locationId=${encodeURIComponent(loc)}`); cals = c.calendars || []; }
  catch { return []; }
  const out = [];
  for (const cal of cals) {
    try {
      const j = await ghl(`/calendars/events?locationId=${encodeURIComponent(loc)}&calendarId=${cal.id}&startTime=${startMs}&endTime=${endMs}`);
      (j.events || []).forEach((e) => {
        const date = (e.startTime || '').slice(0, 10);
        out.push({ date, status: String(e.appointmentStatus || e.appoinmentStatus || '').toLowerCase(), assignedUserId: e.assignedUserId, calendar: cal.name });
      });
    } catch { /* calendario sin permiso o vacío */ }
  }
  return out;
}

async function build() {
  const loc = process.env.GHL_LOCATION_ID;

  // Comerciales (id -> nombre)
  const users = {};
  try {
    const u = await ghl(`/users/?locationId=${encodeURIComponent(loc)}`);
    (u.users || []).forEach((x) => { users[x.id] = x.name; });
  } catch { /* si no hay scope de users, quedan como (sin asignar) */ }

  // Pipeline: etapas en orden
  const pl = await ghl(`/opportunities/pipelines?locationId=${encodeURIComponent(loc)}`);
  const NAME = {}, POS = {}, orderNames = [];
  (pl.pipelines || []).forEach((p) =>
    (p.stages || []).slice().sort((a, b) => (a.position || 0) - (b.position || 0)).forEach((s) => {
      NAME[s.id] = s.name; POS[s.id] = s.position || 0;
      if (!orderNames.includes(s.name)) orderNames.push(s.name);
    })
  );
  const lower = orderNames.map((n) => n.toLowerCase());
  const iLlam = lower.indexOf('leads llamados');
  const iProp = lower.indexOf('propuesta enviada');

  // Todas las oportunidades (paginado por cursor)
  let url = `${GHL}/opportunities/search?location_id=${encodeURIComponent(loc)}&limit=100`;
  const opps = [];
  let pages = 0;
  while (url && pages < 200) {
    const d = await ghl(url);
    pages++;
    (d.opportunities || []).forEach((o) => opps.push(o));
    url = (d.meta && d.meta.nextPageUrl) || null;
  }

  const rows = opps.map((o) => {
    const sid = o.pipelineStageId;
    const etapa = NAME[sid] || '(otra)';
    const pos = POS[sid] ?? 0;
    const status = (o.status || '').toLowerCase();
    const el = etapa.trim().toLowerCase();
    const descartada = el === 'no cualificada';
    const matricula = el === 'alumna activa' ? 1 : 0;
    const perdido = status === 'lost' ? 1 : 0;
    const abandonado = status === 'abandoned' ? 1 : 0;
    const pendiente = status === 'open' && !matricula ? 1 : 0;
    const contactado = iLlam >= 0 && pos >= iLlam && !descartada ? 1 : 0;
    const entrevista = iProp >= 0 && pos >= iProp && !descartada ? 1 : 0;
    const estado = matricula ? 'Ganado' : perdido ? 'Perdido' : abandonado ? 'Abandonado/Inválido' : 'Pendiente';
    const fecha = (o.createdAt || '').slice(0, 10);
    return {
      id: o.id, fecha, semana: fecha ? weekMonday(fecha) : '', mes: fecha.slice(0, 7),
      comercial: users[o.assignedTo] || '(sin asignar)',
      procedencia: provider(o.source), source: o.source || '',
      etapa, estado, contactado, entrevista, matricula, perdido, abandonado, pendiente,
      contacto: (o.contact && o.contact.name) || ''
    };
  });

  // Inversión: ventana desde la primera oportunidad (o 2026-05-01) hasta hoy
  const dates = rows.map((r) => r.fecha).filter(Boolean).sort();
  const since = dates.length && dates[0] < '2026-05-01' ? dates[0] : '2026-05-01';
  const until = new Date().toISOString().slice(0, 10);
  let spend = [];
  try { spend = await buildSpend(since, until); } catch { spend = []; }

  // Citas (bookings): ventana amplia (incluye futuras). Fuente fiable e histórica de entrevistas.
  let appts = [];
  try {
    const apUntil = new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10);
    const raw = await fetchAppointments('2026-05-01', apUntil);
    appts = raw.filter((a) => a.date).map((a) => ({
      date: a.date, semana: weekMonday(a.date), mes: a.date.slice(0, 7),
      comercial: users[a.assignedUserId] || '(sin asignar)', status: a.status, calendar: a.calendar
    }));
  } catch { appts = []; }

  return { generatedAt: new Date().toISOString(), etapas: orderNames, coursePrice: COURSE_PRICE, spend, appts, rows };
}

export default async (req) => {
  const url = new URL(req.url);
  const pw = url.searchParams.get('pw') || req.headers.get('x-dash-pw') || '';
  if (!process.env.DASHBOARD_PASSWORD || pw !== process.env.DASHBOARD_PASSWORD) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401, headers: { 'content-type': 'application/json' }
    });
  }
  try {
    if (!CACHE.data || Date.now() - CACHE.at > TTL) {
      CACHE = { at: Date.now(), data: await build() };
    }
    return new Response(JSON.stringify(CACHE.data), {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { 'content-type': 'application/json' }
    });
  }
};
