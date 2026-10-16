// Intelligence privado de Nuria Roure: el directo del 22 de octubre en una pantalla.
// Página: qualivo.io/intelligence/nuria/
//
//   POST /api/intelligence-nuria/?accion=entrar   { clave }  → cookie de sesión
//   POST /api/intelligence-nuria/?accion=salir               → borra la cookie
//   GET  /api/intelligence-nuria/                            → resumen (401 sin sesión)
//   GET  /api/intelligence-nuria/?accion=tablero             → fichas y conversaciones
//                                                              (pantallas de Intelligence, ?cuenta=nuria)
//
// Variables en Vercel (las pone Maikel):
//   INTELLIGENCE_CLAVE_NURIA  contraseña de la página
//   NURIA_GHL_API_KEY         token privado de la cuenta de GHL de Nuria (solo lectura)
//   NURIA_GHL_LOCATION_ID     id de la cuenta
//   NURIA_GHL_APP_URL         (opcional) dominio del CRM para «Abrir en GHL»
//
// Reglas:
//   - SOLO LECTURA: todo sale por leer(), que solo hace GET.
//   - Son datos de salud (insomnio). El resumen no lee conversaciones. El tablero
//     sí (Nuria lo autorizó el 16-oct, vía Maikel), solo de las inscritas al
//     directo, y solo los mensajes desde el 14 de octubre. Nunca correos ni
//     teléfonos al navegador; el nombre, como «Nombre I.». No se leen notas
//     ni formularios.
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
  for (let intento = 0; ; intento++) {
    const ctl = new AbortController();
    const t = setTimeout(function () { ctl.abort(); }, 12000);
    try {
      const r = await fetch(GHL + ruta, { method: 'GET', headers: cab(version), signal: ctl.signal });
      // GHL deja 100 llamadas cada 10 segundos: si nos pasamos, esperar y repetir
      if (r.status === 429 && intento < 4) { await new Promise(function (ok) { setTimeout(ok, 1500 * (intento + 1)); }); continue; }
      if (!r.ok) throw new Error('GHL ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }
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

// ---------------------------------------------------------------------------
// Tablero: una ficha por inscrita, con su trato, sus citas y sus mensajes
// ---------------------------------------------------------------------------
const DESDE_MENSAJES = Date.parse('2026-10-14T00:00:00Z'); // desde la semana del directo
let cacheTab = null, tabEnCurso = null;
const memMensajes = {}; // contacto → { huella, msgs }

async function enParalelo(items, n, fn, hasta) {
  const out = new Array(items.length);
  let i = 0;
  async function obrero() {
    while (i < items.length) {
      const k = i++;
      if (Date.now() > hasta) { out[k] = undefined; continue; }
      try { out[k] = await fn(items[k]); } catch (e) { out[k] = null; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, obrero));
  return out;
}

// Quién escribió: c = la persona, h = alguien del equipo, a = automático (flujos, n8n, campañas, bot)
function autor(m) {
  if (m.direction === 'inbound') return 'c';
  return m.source === 'app' && m.userId ? 'h' : 'a';
}
function canalDe(t) {
  t = String(t || '');
  if (/WHATSAPP/.test(t)) return 'wa';
  if (/EMAIL/.test(t)) return 'email';
  if (/CALL|VOICE/.test(t)) return 'voz';
  return 'wa';
}
function textoDe(m) {
  const canal = canalDe(m.messageType);
  let t = String(m.body || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (canal === 'email' && m.direction !== 'inbound') {
    const asunto = m.meta && m.meta.email && m.meta.email.subject;
    t = 'Correo: ' + (asunto || t.slice(0, 80));
  }
  if (canal === 'voz') t = 'Llamada';
  return t.slice(0, 600) || (canal === 'email' ? 'Correo' : 'Mensaje sin texto');
}

async function tablero() {
  const base = cache && Date.now() - cache.t < CACHE_MS ? cache.datos : await recoger();
  const loc = encodeURIComponent(process.env.NURIA_GHL_LOCATION_ID);
  const hasta = Date.now() + 48000;

  const embudos = await leer('/opportunities/pipelines?locationId=' + loc);
  const emb = (embudos.pipelines || []).filter(function (p) { return p.id === EMBUDO; })[0];
  const etapas = (emb.stages || []).map(function (s) { return { id: s.id, txt: s.name }; });

  let ops = [];
  for (let pag = 1; pag <= 60; pag++) {
    const d = await leer('/opportunities/search?location_id=' + loc + '&pipeline_id=' + EMBUDO + '&limit=100&page=' + pag);
    const o = d.opportunities || [];
    ops = ops.concat(o);
    if (o.length < 100) break;
  }
  const vistos = {};
  const gente = ops.filter(function (o) {
    const c = o.contact || {}, id = o.contactId || c.id;
    if (!id || vistos[id]) return false;
    vistos[id] = true;
    const tags = (c.tags || []).map(String);
    return tags.indexOf('no enviar · webinar 22-oct') < 0 && tags.indexOf('prueba') < 0;
  });

  // Mensajes: una conversación por persona, solo desde el 14 de octubre
  const huellas = [];
  const convs = await enParalelo(gente, 4, async function (o) {
    const s = await leer('/conversations/search?locationId=' + loc + '&contactId=' + encodeURIComponent(o.contactId), '2021-04-15');
    const lista = s.conversations || [];
    // Si nada ha cambiado desde la última lectura, se reutilizan los mensajes (memoria de la instancia)
    const huella = lista.map(function (c) { return c.id + ':' + c.lastMessageDate; }).join('|');
    const previo = memMensajes[o.contactId];
    if (previo && previo.huella === huella) return previo.msgs;
    huellas[gente.indexOf(o)] = huella;
    let msgs = [];
    for (let i = 0; i < lista.length && i < 2; i++) {
      const m = await leer('/conversations/' + encodeURIComponent(lista[i].id) + '/messages?limit=40', '2021-04-15');
      msgs = msgs.concat((m.messages && m.messages.messages) || []);
    }
    return msgs
      .filter(function (m) { return Date.parse(m.dateAdded) >= DESDE_MENSAJES && !/ACTIVITY/.test(m.messageType || ''); })
      .map(function (m) { return { t: Date.parse(m.dateAdded), de: autor(m), canal: canalDe(m.messageType), texto: textoDe(m), estado: m.status || '' }; })
      .sort(function (a, b) { return a.t - b.t; });
  }, hasta);
  gente.forEach(function (o, k) { if (convs[k] && huellas[k]) memMensajes[o.contactId] = { huella: huellas[k], msgs: convs[k] }; });
  const parcial = convs.some(function (x) { return x == null; });

  // Citas por contacto
  const citasDe = {};
  try {
    const ev = await leer('/calendars/events?locationId=' + loc + '&calendarId=' + CALENDARIO + '&startTime=' + Date.parse('2026-10-15T00:00:00Z') + '&endTime=' + (Date.now() + 21 * 864e5), '2021-04-15');
    (ev.events || []).forEach(function (e) {
      if (e.deleted) return;
      (citasDe[e.contactId] = citasDe[e.contactId] || []).push({ t: Date.parse(e.startTime), estado: e.appointmentStatus || '', closer: e.assignedUserId || '' });
    });
  } catch (e) { /* sin calendario */ }
  let usuarios = {};
  try {
    const u = await leer('/users/?locationId=' + loc);
    (u.users || []).forEach(function (x) { usuarios[x.id] = (x.firstName || x.name || '').trim(); });
  } catch (e) { usuarios = {}; }

  const app = (process.env.NURIA_GHL_APP_URL || 'https://app.gohighlevel.com').replace(/\/+$/, '');
  const ordenEtapa = {};
  PASOS.forEach(function (p, i) { p.etapas.forEach(function (e) { ordenEtapa[e] = i; }); });
  const nombreEtapa = {};
  etapas.forEach(function (e) { nombreEtapa[e.id] = e.txt; });

  const contactos = gente.map(function (o, k) {
    const c = o.contact || {};
    const tags = (c.tags || []).map(String);
    const conv = convs[k] || [];
    const citas = (citasDe[o.contactId] || []).sort(function (a, b) { return a.t - b.t; });
    const prox = citas.filter(function (x) { return x.estado !== 'cancelled' && x.estado !== 'invalid'; }).slice(-1)[0];
    const ultimo = conv[conv.length - 1];
    const suyos = conv.filter(function (m) { return m.de === 'c'; });
    const etapaNom = nombreEtapa[o.pipelineStageId] || '';
    const a = (o.attributions || []).filter(function (x) { return x.isFirst; })[0] || (o.attributions || [])[0] || {};
    return {
      id: o.contactId,
      n: corto(c.name),
      tratoId: o.id,
      etapaId: o.pipelineStageId,
      etapaNombre: etapaNom,
      paso: o.status === 'won' ? 4 : (ordenEtapa[etapaNom] != null ? ordenEtapa[etapaNom] : 0),
      fin: o.status === 'won' ? 'ganado' : (o.status === 'lost' || etapaNom === 'Perdido') ? 'perdido' : '',
      valor: Number(o.monetaryValue) || 0,
      creado: Date.parse(o.createdAt),
      cambioEtapa: Date.parse(o.lastStageChangeAt || o.createdAt),
      origen: a.utmSource || (a.utmSessionSource === 'Direct traffic' ? 'Email o directo' : a.utmSessionSource) || 'Sin origen',
      ghl: app + '/v2/location/' + encodeURIComponent(process.env.NURIA_GHL_LOCATION_ID) + '/contacts/detail/' + encodeURIComponent(o.contactId),
      s: {
        e1: tags.indexOf('n8n · e1 enviado') >= 0,
        w1: tags.indexOf('wa · w1 bienvenida') >= 0,
        movil: !!c.phone,
        atender: tags.indexOf('atender · persona') >= 0,
        baja: tags.indexOf('baja whatsapp') >= 0,
        cita: prox ? prox.t : null,
        citaEstado: prox ? prox.estado : '',
        closer: prox ? (usuarios[prox.closer] || '') : '',
        citas: citas.map(function (x) { return { t: x.t, estado: x.estado }; }),
        esperaDesde: ultimo && ultimo.de === 'c' ? ultimo.t : null,
        primeraRespuesta: suyos.length ? suyos[0].t : null
      },
      conv: conv
    };
  });

  return Object.assign({}, base, { etapasCrm: etapas, contactos: contactos, parcial: parcial, generado: Date.now() });
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

  if (accion === 'tablero') {
    try {
      const fresco = String((req.query && req.query.fresco) || '') === '1';
      const edad = cacheTab ? Date.now() - cacheTab.t : Infinity;
      if (!cacheTab || edad > CACHE_MS || (fresco && edad > 30000)) {
        if (!tabEnCurso) tabEnCurso = tablero().then(function (d) { cacheTab = { t: Date.now(), datos: d }; return d; }).finally(function () { tabEnCurso = null; });
        await tabEnCurso;
      }
      return res.status(200).json(Object.assign({ cacheSegundos: Math.round((Date.now() - cacheTab.t) / 1000) }, cacheTab.datos));
    } catch (e) {
      return res.status(502).json({ error: 'No se han podido leer los datos: ' + String(e.message || e).slice(0, 80) });
    }
  }

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
