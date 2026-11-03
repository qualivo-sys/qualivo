// Intelligence de Nuria · «Esta semana» y «La persona».
// Junta GHL, Meta y la hoja de ventas por semana y por puerta de entrada.
// Lo usa api/intelligence-nuria.js (?accion=semana), solo con sesión.
//
// Variables en Vercel:
//   NURIA_GHL_API_KEY, NURIA_GHL_LOCATION_ID   (ya existen)
//   NURIA_META_TOKEN       token de lectura de anuncios de la cuenta de Meta de Nuria
//   NURIA_META_CUENTA      id de la cuenta publicitaria (act_…)
//   NURIA_GOOGLE_SA_JSON   cuenta de servicio con lectura de la hoja de ventas
//   NURIA_VENTAS_HOJA      id de la hoja «D. MÉTRICAS» (pestaña «🟠 VENTAS»)
//
// Reglas: SOLO LECTURA. Sin datos de salud: no se leen tests, notas ni
// conversaciones. Nombres como «Nombre I.». Nada de datos en el código.

const crypto = require('crypto');

const GHL = 'https://services.leadconnectorhq.com';
const ZONA = 'Europe/Madrid';
const SEMANAS = 8;
const PERPETUO = 'bIgnFh4rXCSpZ1bwjQHq';       // Lanzamiento Perpetuo (El Círculo semanal)
const SETTEO_GENERAL = 'IEQ1AEfkYPzgHtlS29gH';
const CONTACTAR_HUMANO = 'CONTACTAR (HUMANO)';

// Puerta de entrada según el origen («source») del contacto en GHL
const PUERTAS = [
  { puerta: 'El Círculo', fuentes: ['Registro Taller ADS - Semana Sueño', 'Registro Taller ORG - Semana Sueño'] },
  { puerta: 'VSL', fuentes: ['Registro VSL - ENERO 26'] },
  { puerta: 'Test y meditación', fuentes: ['Quiz Calidad Del Sueño', 'Registro a Descargar Meditación', 'Registro a Descargar Meditación ORG', 'Test patrones web'] }
];
// Puerta según la columna «Fuente» de la hoja de ventas
const FUENTE_VENTA = { lanzamiento: 'El Círculo', vsl: 'VSL', webinar: 'Webinar', instagram: 'Instagram', setter: 'Instagram', 'base de datos': 'Base de contactos', web: 'Web' };
// Puerta según el calendario de la llamada
const CALENDARIO = {
  'calendario-lanzamiento-perpetuo': 'El Círculo', 'calendario-vsl1-pfd-prueba-b': 'VSL', 'calendario-vsl1-pfd-web': 'Web',
  'calendario-sesion-diagnostico-julio': 'Webinar', 'sesion-diagnostico-instagram': 'Instagram',
  'calendario-dg-lorena': 'Agenda personal', 'calendario-dg-pepi': 'Agenda personal', 'calendario-dg-sonia': 'Agenda personal'
};
const ORDEN = ['El Círculo', 'VSL', 'Webinar', 'Instagram', 'Base de contactos', 'Test y meditación', 'Web'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MES_EN = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };

// ---------- fechas (día civil de Madrid como 'YYYY-MM-DD') ----------
function diaMadrid(d) { return new Intl.DateTimeFormat('sv-SE', { timeZone: ZONA }).format(d); }
function sumaDias(dia, n) { const d = new Date(dia + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
function lunesDe(dia) { const d = new Date(dia + 'T12:00:00Z'); return sumaDias(dia, -((d.getUTCDay() + 6) % 7)); }
function diaSemana(dia) { return new Date(dia + 'T12:00:00Z').getUTCDay(); } // 0 domingo
// Inicio de un día de Madrid en UTC (ISO). Madrid es UTC+1 o UTC+2.
function inicioUTC(dia) {
  for (const h of [22, 23]) {
    const t = new Date(sumaDias(dia, -1) + 'T' + h + ':00:00Z');
    if (diaMadrid(t) === dia && diaMadrid(new Date(t.getTime() - 3600000)) !== dia) return t.toISOString();
  }
  return dia + 'T00:00:00Z';
}
function mdY(dia) { return dia.slice(5, 7) + '-' + dia.slice(8, 10) + '-' + dia.slice(0, 4); }

// ---------- GHL ----------
async function ghl(ruta, opc) {
  opc = opc || {};
  for (let intento = 0; ; intento++) {
    const ctl = new AbortController();
    const t = setTimeout(function () { ctl.abort(); }, 15000);
    try {
      const r = await fetch(GHL + ruta, {
        method: opc.cuerpo ? 'POST' : 'GET',
        headers: {
          Authorization: 'Bearer ' + process.env.NURIA_GHL_API_KEY, Version: opc.version || '2021-07-28',
          Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'QualivoIntelligence/1.0 (+https://qualivo.io)'
        },
        body: opc.cuerpo ? JSON.stringify(opc.cuerpo) : undefined,
        signal: ctl.signal
      });
      if (r.status === 429 && intento < 5) { await new Promise(function (ok) { setTimeout(ok, 1200 * (intento + 1)); }); continue; }
      if (!r.ok) throw new Error('GHL ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }
}
// Solo lectura: la búsqueda de contactos es un POST de consulta, no escribe nada.
function buscarContactos(filtros, n) {
  return ghl('/contacts/search', { cuerpo: { locationId: process.env.NURIA_GHL_LOCATION_ID, pageLimit: n || 1, filters: filtros } });
}
async function enParalelo(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  async function obrero() { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, obrero));
  return out;
}
function corto(nombre) {
  const p = String(nombre || '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return 'Sin nombre';
  const n = p[0].charAt(0).toUpperCase() + p[0].slice(1).toLowerCase();
  return p[1] ? n + ' ' + p[1].charAt(0).toUpperCase() + '.' : n;
}

// ---------- Meta ----------
async function gastoMeta(desde, hasta) {
  const token = process.env.NURIA_META_TOKEN, cuenta = process.env.NURIA_META_CUENTA;
  if (!token || !cuenta) return null;
  const q = new URLSearchParams({
    access_token: token, level: 'campaign', fields: 'campaign_name,spend,actions', time_increment: '1',
    time_range: JSON.stringify({ since: desde, until: hasta }), limit: '500'
  });
  let url = 'https://graph.facebook.com/v21.0/' + cuenta + '/insights?' + q;
  const filas = [];
  while (url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error('Meta ' + r.status);
    const d = await r.json();
    filas.push.apply(filas, d.data || []);
    url = d.paging && d.paging.next;
  }
  return filas.map(function (x) {
    const n = String(x.campaign_name || '').toUpperCase();
    const reg = (x.actions || []).filter(function (a) { return a.action_type === 'complete_registration'; }).reduce(function (s, a) { return s + Number(a.value || 0); }, 0);
    return { dia: x.date_start, puerta: /C[ÍI]RCULO/.test(n) ? 'El Círculo' : (/AUTORIDAD|PERFIL/.test(n) ? 'Instagram' : 'Otras'), gasto: Number(x.spend || 0), registros: reg };
  });
}

// ---------- Hoja de ventas ----------
async function tokenGoogle() {
  const sa = JSON.parse(process.env.NURIA_GOOGLE_SA_JSON || '{}');
  if (!sa.client_email || !sa.private_key) return null;
  const b64 = function (o) { return Buffer.from(JSON.stringify(o)).toString('base64url'); };
  const now = Math.floor(Date.now() / 1000);
  const cab = b64({ alg: 'RS256', typ: 'JWT' });
  const carga = b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/spreadsheets.readonly', aud: sa.token_uri, iat: now, exp: now + 3600 });
  const firma = crypto.sign('RSA-SHA256', Buffer.from(cab + '.' + carga), sa.private_key).toString('base64url');
  const r = await fetch(sa.token_uri, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: cab + '.' + carga + '.' + firma }) });
  if (!r.ok) throw new Error('Google ' + r.status);
  return (await r.json()).access_token;
}
function fechaHoja(v) {
  if (typeof v === 'number') return new Date(Date.UTC(1899, 11, 30) + Math.floor(v) * 86400000).toISOString().slice(0, 10);
  const s = String(v || '').trim();
  let m = s.match(/^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/);
  if (m && MES_EN[m[1].toLowerCase()]) return m[3] + '-' + String(MES_EN[m[1].toLowerCase()]).padStart(2, '0') + '-' + m[2].padStart(2, '0');
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (m) return (m[3].length === 2 ? '20' + m[3] : m[3]) + '-' + m[2].padStart(2, '0') + '-' + m[1].padStart(2, '0');
  return null;
}
async function ventasHoja(desde) {
  const hoja = process.env.NURIA_VENTAS_HOJA;
  const t = hoja ? await tokenGoogle() : null;
  if (!t) return null;
  const r = await fetch('https://sheets.googleapis.com/v4/spreadsheets/' + hoja + '/values/' + encodeURIComponent("'🟠 VENTAS'!A2:N") + '?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER', { headers: { Authorization: 'Bearer ' + t } });
  if (!r.ok) throw new Error('Hoja ' + r.status);
  const filas = (await r.json()).values || [];
  return filas.map(function (f) {
    const dia = fechaHoja(f[0]);
    const fuente = String(f[2] || '').trim();
    return { dia: dia, closer: String(f[1] || '').trim().replace(/^Goria\b/, 'Gloria'), puerta: FUENTE_VENTA[fuente.toLowerCase()] || (fuente || 'Sin fuente'), fuente: fuente, email: String(f[4] || '').trim().toLowerCase(), importe: Number(f[13]) || 0 };
  }).filter(function (v) { return v.dia && v.dia >= desde; });
}

// ---------- recoger ----------
async function recoger() {
  const loc = process.env.NURIA_GHL_LOCATION_ID;
  const hoy = diaMadrid(new Date());
  const lunesHoy = lunesDe(hoy);
  const semanas = [];
  for (let i = SEMANAS; i >= 0; i--) semanas.push(sumaDias(lunesHoy, -7 * i));   // la última es la semana en curso
  const desde = semanas[0];

  // 1) Registros por semana y puerta (solo contamos: pageLimit 1 y el total)
  const consultas = [];
  semanas.forEach(function (s) {
    const rango = { field: 'dateAdded', operator: 'range', value: { gte: inicioUTC(s), lte: new Date(new Date(inicioUTC(sumaDias(s, 7))).getTime() - 1000).toISOString() } };
    consultas.push({ s: s, puerta: '_total', filtros: [rango] });
    PUERTAS.forEach(function (p) { p.fuentes.forEach(function (f) { consultas.push({ s: s, puerta: p.puerta, filtros: [rango, { field: 'source', operator: 'eq', value: f }] }); }); });
  });
  const totales = await enParalelo(consultas, 6, async function (c) { const r = await buscarContactos(c.filtros); return Number(r.total || 0); });
  const registros = {};
  semanas.forEach(function (s) { registros[s] = {}; });
  consultas.forEach(function (c, k) { registros[c.s][c.puerta] = (registros[c.s][c.puerta] || 0) + totales[k]; });
  semanas.forEach(function (s) {
    const r = registros[s]; const conocidas = PUERTAS.reduce(function (t, p) { return t + (r[p.puerta] || 0); }, 0);
    r['Base de contactos'] = Math.max(0, (r._total || 0) - conocidas);
  });

  // 2) Llamadas celebradas por semana y puerta (calendarios)
  const cals = ((await ghl('/calendars/?locationId=' + encodeURIComponent(loc), { version: '2021-04-15' })).calendars || []).filter(function (c) { return CALENDARIO[c.widgetSlug || c.slug]; });
  const ini = new Date(inicioUTC(desde)).getTime(), fin = new Date(inicioUTC(sumaDias(lunesHoy, 7))).getTime();
  const llamadas = {};
  semanas.forEach(function (s) { llamadas[s] = {}; });
  await enParalelo(cals, 4, async function (c) {
    const ev = (await ghl('/calendars/events?locationId=' + encodeURIComponent(loc) + '&calendarId=' + c.id + '&startTime=' + ini + '&endTime=' + fin, { version: '2021-04-15' })).events || [];
    ev.forEach(function (e) {
      const s = lunesDe(diaMadrid(new Date(e.startTime)));
      if (!llamadas[s]) return;
      const p = CALENDARIO[c.widgetSlug || c.slug];
      const st = e.appointmentStatus || 'new';
      llamadas[s][p] = llamadas[s][p] || { celebradas: 0, noPresentadas: 0, canceladas: 0, pendientes: 0 };
      const o = llamadas[s][p];
      if (st === 'showed') o.celebradas++; else if (st === 'noshow') o.noPresentadas++; else if (st === 'cancelled' || st === 'invalid') o.canceladas++; else o.pendientes++;
    });
  });

  // 3) Gasto en Meta y 4) ventas de la hoja (si están configurados)
  const [meta, ventas] = await Promise.all([
    gastoMeta(desde, hoy).catch(function () { return null; }),
    ventasHoja(desde).catch(function () { return null; })
  ]);
  const gasto = {}; semanas.forEach(function (s) { gasto[s] = {}; });
  (meta || []).forEach(function (m) { const s = lunesDe(m.dia); if (gasto[s]) gasto[s][m.puerta] = (gasto[s][m.puerta] || 0) + m.gasto; });
  const venta = {}; semanas.forEach(function (s) { venta[s] = {}; });
  (ventas || []).forEach(function (v) {
    const s = lunesDe(v.dia); if (!venta[s]) return;
    const o = venta[s][v.puerta] = venta[s][v.puerta] || { n: 0, eur: 0 };
    o.n++; o.eur += v.importe;
  });

  // 5) El Círculo por edición: registros de miércoles a martes → directo del miércoles siguiente
  const pipes = (await ghl('/opportunities/pipelines?locationId=' + encodeURIComponent(loc))).pipelines || [];
  const perpetuo = pipes.find(function (p) { return p.id === PERPETUO; });
  const settGen = pipes.find(function (p) { return p.id === SETTEO_GENERAL; });
  let miercoles = hoy; while (diaSemana(miercoles) !== 3) miercoles = sumaDias(miercoles, 1);
  const ediciones = [sumaDias(miercoles, -14), sumaDias(miercoles, -7), miercoles];
  const edicion = await enParalelo(ediciones, 3, async function (w) {
    const de = sumaDias(w, -7), a = sumaDias(w, -1);
    const base = { location_id: loc, pipeline_id: PERPETUO, limit: 1, date: mdY(de), endDate: mdY(a) };
    const total = Number(((await ghl('/opportunities/search?' + new URLSearchParams(base))).meta || {}).total || 0);
    const etapas = {};
    await enParalelo((perpetuo && perpetuo.stages) || [], 4, async function (st) {
      const r = await ghl('/opportunities/search?' + new URLSearchParams(Object.assign({}, base, { pipeline_stage_id: st.id })));
      etapas[st.name] = Number(((r.meta) || {}).total || 0);
    });
    return { directo: w, cerrada: w < hoy, total: total, etapas: etapas };
  });

  // 6) Bolsa del VSL sin contactar
  let sinContactar = null;
  const stC = settGen && (settGen.stages || []).find(function (s) { return s.name === CONTACTAR_HUMANO; });
  if (stC) sinContactar = Number(((await ghl('/opportunities/search?' + new URLSearchParams({ location_id: loc, pipeline_id: SETTEO_GENERAL, pipeline_stage_id: stC.id, limit: 1 }))).meta || {}).total || 0);

  // 7) La persona: recorrido de las últimas ventas con importe
  const nombrePipe = {}, nombreEtapa = {};
  pipes.forEach(function (p) { nombrePipe[p.id] = p.name; (p.stages || []).forEach(function (s) { nombreEtapa[s.id] = s.name; }); });
  const ultimas = (ventas || []).filter(function (v) { return v.email && v.importe > 0; }).sort(function (a, b) { return a.dia < b.dia ? 1 : -1; }).slice(0, 6);
  const personas = (await enParalelo(ultimas, 3, async function (v) {
    const c = ((await buscarContactos([{ field: 'email', operator: 'eq', value: v.email }])).contacts || [])[0];
    if (!c) return null;
    const a = c.attributionSource || {};
    const ev = [{ t: c.dateAdded, tipo: 'registro', texto: 'Primer registro · ' + (c.source || 'sin puerta') + ' · origen: ' + (a.utmSource || a.sessionSource || 'sin dato') + (a.campaign && !/\{\{/.test(a.campaign) ? ' · ' + a.campaign : '') }];
    const ops = (await ghl('/opportunities/search?' + new URLSearchParams({ location_id: loc, contact_id: c.id, limit: 50 }))).opportunities || [];
    ops.forEach(function (o) { ev.push({ t: o.createdAt, tipo: 'embudo', texto: 'Entra en «' + (nombrePipe[o.pipelineId] || 'pipeline') + '» · hoy: ' + (nombreEtapa[o.pipelineStageId] || '—') }); });
    const citas = (await ghl('/contacts/' + c.id + '/appointments')).events || [];
    citas.forEach(function (x) { if (x.startTime) ev.push({ t: new Date(String(x.startTime).replace(' ', 'T')).toISOString(), tipo: 'llamada', texto: 'Llamada · ' + ({ showed: 'celebrada', noshow: 'no se presentó', cancelled: 'cancelada', confirmed: 'confirmada' }[x.appointmentStatus] || x.appointmentStatus || 'agendada') }); });
    ev.push({ t: v.dia + 'T12:00:00Z', tipo: 'venta', texto: 'Venta · apuntada como «' + (v.fuente || '—') + '» · ' + Math.round(v.importe) + ' €' });
    ev.sort(function (x, y) { return x.t < y.t ? -1 : 1; });
    return { nombre: corto((c.firstName || '') + ' ' + (c.lastName || '')), dia: v.dia, puerta: v.puerta, importe: v.importe, primero: (c.dateAdded || '').slice(0, 10), eventos: ev.map(function (e) { return { dia: diaMadrid(new Date(e.t)), tipo: e.tipo, texto: e.texto }; }) };
  })).filter(Boolean).slice(0, 4);

  // 8) Ventas por closer (todo el periodo)
  const closers = {};
  (ventas || []).forEach(function (v) { const o = closers[v.closer || '—'] = closers[v.closer || '—'] || { n: 0, eur: 0 }; o.n++; o.eur += v.importe; });

  return {
    generado: Date.now(), hoy: hoy, semanas: semanas, orden: ORDEN,
    registros: registros, llamadas: llamadas, gasto: meta ? gasto : null, ventas: ventas ? venta : null,
    ediciones: edicion, sinContactarVsl: sinContactar, personas: personas, closers: closers,
    fuentes: { meta: !!meta, hoja: !!ventas, googleAds: false }
  };
}

module.exports = { recoger: recoger, MESES: MESES };
