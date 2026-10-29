// Intelligence privado de Al Milímetro: el pipeline de Sonia leído de su subcuenta de GHL.
// Página: qualivo.io/intelligence/?cuenta=almilimetro
//
//   POST /api/intelligence-almilimetro/?accion=entrar   { clave }  → cookie de sesión
//   POST /api/intelligence-almilimetro/?accion=salir               → borra la cookie
//   GET  /api/intelligence-almilimetro/?accion=tablero             → oportunidades con su ficha (401 sin sesión)
//
// Variables en Vercel (las pone Maikel o Growth):
//   INTELLIGENCE_CLAVE_AM  contraseña de la página
//   AM_GHL_API_KEY         token privado de la subcuenta (aquí solo se usan lecturas)
//   AM_GHL_LOCATION_ID     id de la subcuenta
//   AM_GHL_PIPELINE_ID     (opcional) id del pipeline; si falta, se busca por nombre
//
// Reglas: SOLO LECTURA (todo sale por leer(), que solo hace GET). No se leen conversaciones ni notas.
// Nunca teléfonos ni emails al navegador; el nombre, como «Nombre I.». Cache de 3 minutos.

const S = require('./_intel-sesion.js').crear({ cookie: 'qi_am', env: 'INTELLIGENCE_CLAVE_AM', sal: 'almilimetro-intelligence|' });
const M = require('./_am-modelo.js');

const GHL = 'https://services.leadconnectorhq.com';
const CACHE_MS = 3 * 60000;
const ETAPAS = { 'nuevo': 1, 'contactado': 2, 'visita técnica': 3, 'presupuesto enviado': 4, 'seguimiento': 5, 'firmado': 6, 'perdido': 4 };
// Valor orientativo de la obra según el tramo de presupuesto que marcó (para ordenar y sumar; no es su presupuesto)
const VALOR = { 'Menos de 15.000 €': 12000, '15.000-30.000 €': 22000, '30.000-60.000 €': 45000, '60.000-160.000 €': 100000, 'Más de 160.000 €': 180000, 'Todavía no lo sé': 27500 };
const ORIGEN_ID = {}; Object.keys(M.OPCIONES.origen).forEach(function (k) { ORIGEN_ID[M.OPCIONES.origen[k]] = k; });

let cache = null;

async function leer(ruta) {
  for (let intento = 0; ; intento++) {
    const ctl = new AbortController(); const t = setTimeout(function () { ctl.abort(); }, 12000);
    try {
      const r = await fetch(GHL + ruta, { method: 'GET', signal: ctl.signal, headers: { Authorization: 'Bearer ' + process.env.AM_GHL_API_KEY, Version: '2021-07-28', Accept: 'application/json' } });
      if (r.status === 429 && intento < 4) { await new Promise(function (ok) { setTimeout(ok, 1500 * (intento + 1)); }); continue; }
      if (!r.ok) throw new Error('GHL ' + r.status);
      return await r.json();
    } finally { clearTimeout(t); }
  }
}
function corto(n) {
  const p = String(n || '').replace(/prueba qualivo/i, '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return 'Sin nombre';
  return p[0].charAt(0).toUpperCase() + p[0].slice(1).toLowerCase() + (p[1] ? ' ' + p[1].charAt(0).toUpperCase() + '.' : '');
}

async function recoger() {
  const loc = encodeURIComponent(process.env.AM_GHL_LOCATION_ID);
  const pl = await leer('/opportunities/pipelines?locationId=' + loc);
  const p = (pl.pipelines || []).filter(function (x) { return process.env.AM_GHL_PIPELINE_ID ? x.id === process.env.AM_GHL_PIPELINE_ID : /al mil[ií]metro/i.test(x.name); })[0];
  if (!p) throw new Error('No encuentro el pipeline de Al Milímetro');
  const etapa = {}; (p.stages || []).forEach(function (s) { etapa[s.id] = String(s.name).trim(); });

  const ops = [];
  for (let pagina = 1; pagina <= 5; pagina++) {
    const d = await leer('/opportunities/search?location_id=' + loc + '&pipeline_id=' + p.id + '&limit=100&page=' + pagina);
    (d.opportunities || []).forEach(function (o) { ops.push(o); });
    if (!d.opportunities || d.opportunities.length < 100) break;
  }
  // Ficha de cada contacto (campos am_*), de 5 en 5
  const ids = {}; ops.forEach(function (o) { if (o.contactId || (o.contact && o.contact.id)) ids[o.contactId || o.contact.id] = 1; });
  const lista = Object.keys(ids), fichas = {};
  let campos = {};
  const cf = await leer('/locations/' + loc + '/customFields?model=contact');
  (cf.customFields || []).forEach(function (f) { campos[f.id] = String(f.fieldKey || '').replace(/^contact\./, ''); });
  for (let i = 0; i < lista.length; i += 5) {
    await Promise.all(lista.slice(i, i + 5).map(function (id) {
      return leer('/contacts/' + id).then(function (d) { fichas[id] = d.contact || {}; }).catch(function () { fichas[id] = {}; });
    }));
  }
  const contactos = ops.map(function (o) {
    const cid = o.contactId || (o.contact && o.contact.id);
    const c = fichas[cid] || {};
    const v = {}; (c.customFields || []).forEach(function (x) { if (campos[x.id]) v[campos[x.id]] = x.value; });
    const nombreEtapa = etapa[o.pipelineStageId] || '';
    const tags = c.tags || [];
    return {
      id: o.id, n: corto(c.firstName || c.contactName || (o.contact && o.contact.name) || o.name),
      etapaNombre: nombreEtapa, etapa: ETAPAS[nombreEtapa.toLowerCase()] || 1,
      fin: o.status === 'won' || /^firmado$/i.test(nombreEtapa) ? 'ganado' : o.status === 'lost' || /^perdido$/i.test(nombreEtapa) ? 'perdido' : null,
      clase: v.am_clase || '', puntos: Number(v.am_puntos || 0), origen: ORIGEN_ID[v.am_origen] || 'web',
      tipo: v.am_tipo_obra || '', zona: v.am_zona || '', cp: v.am_codigo_postal || '', metros: v.am_metros || '', cuando: v.am_cuando || '',
      presupuesto: v.am_presupuesto || '', revision: v.am_revision === 'Sí', prueba: tags.indexOf('am-prueba') > -1,
      valor: Number(o.monetaryValue) || VALOR[v.am_presupuesto] || 27500,
      creado: Date.parse(o.createdAt || c.dateAdded) || Date.now(), cambio: Date.parse(o.lastStageChangeAt || o.updatedAt) || null,
      ghl: 'https://app.gohighlevel.com/v2/location/' + process.env.AM_GHL_LOCATION_ID + '/contacts/detail/' + cid
    };
  });
  return { generado: Date.now(), pipeline: p.name, etapas: (p.stages || []).map(function (s) { return s.name; }), contactos: contactos };
}

function cuerpo(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const accion = String((req.query && req.query.accion) || '');
  if (!S.configurada()) return res.status(503).json({ error: 'Falta INTELLIGENCE_CLAVE_AM en Vercel.' });
  if (req.method === 'POST' && accion === 'entrar') {
    const ip = S.ipDe(req);
    if (S.bloqueada(ip)) return res.status(429).json({ error: 'Demasiados intentos. Prueba dentro de 15 minutos.' });
    if (!S.claveCorrecta(String(cuerpo(req).clave || '').slice(0, 200))) { S.fallo(ip); return res.status(401).json({ error: 'Contraseña incorrecta.' }); }
    res.setHeader('Set-Cookie', S.cookieSesion());
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'POST' && accion === 'salir') { res.setHeader('Set-Cookie', S.cookieBorrar()); return res.status(200).json({ ok: true }); }
  if (!S.valida(req)) return res.status(401).json({ error: 'Sin sesión.' });
  if (!process.env.AM_GHL_API_KEY || !process.env.AM_GHL_LOCATION_ID) return res.status(503).json({ error: 'Falta conectar la subcuenta de GHL (AM_GHL_API_KEY y AM_GHL_LOCATION_ID).' });
  try {
    const fresco = req.query && req.query.fresco === '1';
    if (!cache || fresco || Date.now() - cache.t > CACHE_MS) cache = { t: Date.now(), d: await recoger() };
    return res.status(200).json(cache.d);
  } catch (e) {
    console.error('[intel-am]', e.message);
    return res.status(502).json({ error: 'No se ha podido leer GHL: ' + e.message });
  }
};
