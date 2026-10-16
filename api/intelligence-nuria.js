// Intelligence privado de Nuria Roure: el directo del 22 de octubre en una pantalla.
// Página: qualivo.io/intelligence/nuria/
//
//   POST /api/intelligence-nuria/?accion=entrar   { clave }  → cookie de sesión
//   POST /api/intelligence-nuria/?accion=salir               → borra la cookie
//   GET  /api/intelligence-nuria/                            → datos (401 sin sesión)
//
// Variables en Vercel (las pone Maikel):
//   INTELLIGENCE_CLAVE_NURIA  contraseña de la página
//   NURIA_GHL_API_KEY         token privado de la cuenta de GHL de Nuria
//   NURIA_GHL_LOCATION_ID     id de la cuenta
//
// Reglas:
//   - SOLO LECTURA: todo sale por leer(), que solo hace GET.
//   - Son datos de salud (insomnio): aquí no se leen conversaciones, notas ni
//     formularios. Del contacto solo se usan sus etiquetas y el nombre, que se
//     manda al navegador como «Nombre I.». Ni correos ni teléfonos.
//   - Nada de datos en el código. Cache de 3 minutos en memoria. Sin sesión, 401.

const S = require('./_intel-sesion.js').crear({ cookie: 'qi_nuria', env: 'INTELLIGENCE_CLAVE_NURIA', sal: 'nuria-intelligence|' });

const GHL = 'https://services.leadconnectorhq.com';
const EMBUDO = 'TQqkq98rY6GT0UogiMPT';       // WEBINAR Tres trampas 22 de octubre
const CALENDARIO = 'Hcf01yCebG49hj7D0cTh';   // Sesión PFD Webinar (llamadas con closers)
const DIRECTO = '2026-10-22T16:00:00Z';      // jueves 22, 18:00 en Madrid
const ZONA = 'Europe/Madrid';
const CACHE_MS = 3 * 60000;

// Etapas del embudo en el orden en que avanza una persona. «nombre» es como
// se llama en GHL; «texto», como se enseña.
const PASOS = [
  { clave: 'inscrita', texto: 'Inscritas', etapas: ['Inscripción', 'Confirma', 'Diferido', 'No responde', 'Lanzamiento 6,7,8', 'Post-Vacaciones'] },
  { clave: 'asistio', texto: 'Vieron la clase', etapas: ['Asistido', 'Grabación'] },
  { clave: 'pendiente', texto: 'Pendientes de agendar', etapas: ['Pendiente de agenda'] },
  { clave: 'llamada', texto: 'Llamada agendada', etapas: ['Agenda diagnostico', 'Cita confirmada', 'Seguimiento Hot', 'Negociación'] },
  { clave: 'venta', texto: 'Ventas', etapas: ['ganado'] }
];

let cache = null, enCurso = null;

function cab(version) {
  return {
    Authorization: 'Bearer ' + process.env.NURIA_GHL_API_KEY,
    Version: version || '2021-07-28',
    Accept: 'application/json',
    'User-Agent': 'QualivoIntelligence/1.0 (+https://qualivo.io)'
  };
}
async function leer(ruta, version) {
  const ctl = new AbortController();
  const t = setTimeout(function () { ctl.abort(); }, 12000);
  try {
    const r = await fetch(GHL + ruta, { method: 'GET', headers: cab(version), signal: ctl.signal });
    if (!r.ok) throw new Error('GHL ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

function diaMadrid(iso) {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: ZONA }).format(new Date(iso));
}
function corto(nombre) {
  const p = String(nombre || '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return 'Sin nombre';
  const n = p[0].charAt(0).toUpperCase() + p[0].slice(1).toLowerCase();
  return p[1] ? n + ' ' + p[1].charAt(0).toUpperCase() + '.' : n;
}

async function recoger() {
  const loc = encodeURIComponent(process.env.NURIA_GHL_LOCATION_ID);

  // Nombres de las etapas
  const embudos = await leer('/opportunities/pipelines?locationId=' + loc);
  const emb = (embudos.pipelines || []).filter(function (p) { return p.id === EMBUDO; })[0];
  if (!emb) throw new Error('No encuentro el embudo del directo');
  const nombreEtapa = {};
  (emb.stages || []).forEach(function (s) { nombreEtapa[s.id] = s.name; });

  // Oportunidades del embudo (100 por página)
  let ops = [];
  for (let pag = 1; pag <= 60; pag++) {
    const d = await leer('/opportunities/search?location_id=' + loc + '&pipeline_id=' + EMBUDO + '&limit=100&page=' + pag);
    const o = d.opportunities || [];
    ops = ops.concat(o);
    if (o.length < 100) break;
  }

  // Personas: una por contacto, sin las excluidas de los envíos ni las pruebas
  const vistos = {};
  const gente = [];
  ops.forEach(function (o) {
    const c = o.contact || {};
    const id = o.contactId || c.id;
    if (!id || vistos[id]) return;
    vistos[id] = true;
    const tags = (c.tags || []).map(String);
    if (tags.indexOf('no enviar · webinar 22-oct') >= 0 || tags.indexOf('prueba') >= 0) return;
    gente.push({
      id: id,
      etapa: nombreEtapa[o.pipelineStageId] || '',
      estado: o.status,
      alta: o.createdAt,
      valor: Number(o.monetaryValue) || 0,
      tags: tags,
      tel: !!c.phone,
      nombre: corto(c.name || c.firstName)
    });
  });

  // Embudo
  const pasoDe = {};
  PASOS.forEach(function (p, i) { p.etapas.forEach(function (e) { pasoDe[e] = i; }); });
  const cuenta = PASOS.map(function () { return 0; });
  let perdidas = 0;
  gente.forEach(function (p) {
    if (p.estado === 'lost' || p.etapa === 'Perdido') { perdidas++; return; }
    const i = p.estado === 'won' ? PASOS.length - 1 : (pasoDe[p.etapa] != null ? pasoDe[p.etapa] : 0);
    for (let k = 0; k <= i; k++) cuenta[k]++; // quien ha llegado a un paso ha pasado por los anteriores
  });
  // «Inscritas» cuenta a todas, también las perdidas
  cuenta[0] += perdidas;

  // Inscripciones por día
  const porDia = {};
  gente.forEach(function (p) { if (p.alta) { const d = diaMadrid(p.alta); porDia[d] = (porDia[d] || 0) + 1; } });
  const hoy = diaMadrid(new Date().toISOString());
  const ayer = diaMadrid(new Date(Date.now() - 864e5).toISOString());

  // Llamadas con closers: del día 15 a 3 semanas vista
  const usuarios = {};
  try {
    const u = await leer('/users/?locationId=' + loc);
    (u.users || []).forEach(function (x) { usuarios[x.id] = (x.firstName || x.name || '').trim() || 'Closer'; });
  } catch (e) { /* sin nombres de closer */ }
  const nombrePorContacto = {};
  gente.forEach(function (p) { nombrePorContacto[p.id] = p.nombre; });
  let citas = [];
  try {
    const ini = Date.parse('2026-10-15T00:00:00Z');
    const fin = Date.now() + 21 * 864e5;
    const ev = await leer('/calendars/events?locationId=' + loc + '&calendarId=' + CALENDARIO + '&startTime=' + ini + '&endTime=' + fin, '2021-04-15');
    citas = (ev.events || []).filter(function (e) { return !e.deleted; }).map(function (e) {
      return {
        cuando: e.startTime,
        closer: usuarios[e.assignedUserId] || 'Sin asignar',
        quien: nombrePorContacto[e.contactId] || 'Fuera del directo',
        estado: e.appointmentStatus || e.status || ''
      };
    }).sort(function (a, b) { return String(a.cuando) < String(b.cuando) ? -1 : 1; });
  } catch (e) { citas = null; }

  const porCloser = {};
  (citas || []).forEach(function (c) {
    const k = c.closer;
    porCloser[k] = porCloser[k] || { closer: k, total: 0, presentadas: 0, noPresentadas: 0 };
    porCloser[k].total++;
    if (c.estado === 'showed') porCloser[k].presentadas++;
    if (c.estado === 'noshow') porCloser[k].noPresentadas++;
  });

  const tiene = function (t) { return gente.filter(function (p) { return p.tags.indexOf(t) >= 0; }).length; };
  const ventas = gente.filter(function (p) { return p.estado === 'won' || p.etapa === 'ganado'; });

  return {
    actualizado: new Date().toISOString(),
    directo: DIRECTO,
    resumen: {
      inscritas: gente.length,
      hoy: porDia[hoy] || 0,
      ayer: porDia[ayer] || 0,
      conMovil: gente.filter(function (p) { return p.tel; }).length,
      emailConfirmacion: tiene('n8n · e1 enviado'),
      whatsappBienvenida: tiene('wa · w1 bienvenida'),
      porAtender: tiene('atender · persona'),
      bajasWhatsapp: tiene('baja whatsapp'),
      ventas: ventas.length,
      facturado: ventas.reduce(function (s, p) { return s + p.valor; }, 0)
    },
    embudo: PASOS.map(function (p, i) { return { paso: p.texto, personas: cuenta[i] }; }),
    perdidas: perdidas,
    porDia: Object.keys(porDia).sort().map(function (d) { return { dia: d, personas: porDia[d] }; }),
    citas: citas,
    porCloser: Object.keys(porCloser).map(function (k) { return porCloser[k]; }).sort(function (a, b) { return b.total - a.total; })
  };
}

function cuerpo(req) {
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  return b || {};
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  const accion = String((req.query && req.query.accion) || '');
  if (!S.configurada()) return res.status(503).json({ error: 'Falta INTELLIGENCE_CLAVE_NURIA en Vercel.' });

  if (req.method === 'POST' && accion === 'entrar') {
    const ip = S.ipDe(req);
    if (S.bloqueada(ip)) return res.status(429).json({ error: 'Demasiados intentos. Prueba dentro de 15 minutos.' });
    if (!S.claveCorrecta(String(cuerpo(req).clave || '').slice(0, 200))) {
      S.fallo(ip);
      await new Promise(function (r) { setTimeout(r, 400); });
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }
    res.setHeader('Set-Cookie', S.cookieSesion());
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'POST' && accion === 'salir') {
    res.setHeader('Set-Cookie', S.cookieBorrar());
    return res.status(200).json({ ok: true });
  }
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido.' });
  if (!S.valida(req)) return res.status(401).json({ error: 'Sin sesión.' });
  if (!process.env.NURIA_GHL_API_KEY || !process.env.NURIA_GHL_LOCATION_ID) return res.status(503).json({ error: 'Faltan las claves de GHL de Nuria en Vercel.' });

  try {
    const fresco = String((req.query && req.query.fresco) || '') === '1';
    const edad = cache ? Date.now() - cache.t : Infinity;
    if (!cache || edad > CACHE_MS || (fresco && edad > 30000)) {
      if (!enCurso) enCurso = recoger().then(function (d) { cache = { t: Date.now(), datos: d }; return d; }).finally(function () { enCurso = null; });
      await enCurso;
    }
    return res.status(200).json(cache.datos);
  } catch (e) {
    return res.status(502).json({ error: 'No se han podido leer los datos: ' + String(e.message || e).slice(0, 80) });
  }
};
