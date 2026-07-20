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
  return s ? 'Otro' : '(sin fuente)';
}
function weekMonday(ds) {
  const d = new Date(ds + 'T00:00:00Z');
  const off = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - off);
  return d.toISOString().slice(0, 10);
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

  return { generatedAt: new Date().toISOString(), etapas: orderNames, rows };
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
