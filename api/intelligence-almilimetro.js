// Intelligence privado de Al Milímetro: el embudo de Sonia leído de su base de datos (api/_am-db.js).
// Página: qualivo.io/intelligence/?cuenta=almilimetro
//
//   POST /api/intelligence-almilimetro/?accion=entrar   { clave }  → cookie de sesión
//   POST /api/intelligence-almilimetro/?accion=salir               → borra la cookie
//   GET  /api/intelligence-almilimetro/?accion=tablero             → contactos y su etapa (401 sin sesión)
//
// Variables: INTELLIGENCE_CLAVE_AM (contraseña de la página) · AM_DATABASE_URL
// Reglas: SOLO LECTURA (solo SELECT). Nunca teléfonos ni emails al navegador; el nombre, como «Nombre I.».

const S = require('./_intel-sesion.js').crear({ cookie: 'qi_am', env: 'INTELLIGENCE_CLAVE_AM', sal: 'almilimetro-intelligence|' });
const M = require('./_am-modelo.js');
const DB = require('./_am-db.js');

const CACHE_MS = 60000;
const ETAPAS = { nuevo: [1, 'Nuevo'], contactado: [2, 'Contactado'], visita: [3, 'Visita técnica'], presupuesto: [4, 'Presupuesto enviado'], firmado: [6, 'Firmado'], perdido: [4, 'Perdido'], parado: [2, 'Parado'] };
// Valor orientativo de la obra según el tramo que marcó (para ordenar y sumar; no es su presupuesto)
const VALOR = { '<15': 12000, '15-30': 22000, '30-60': 45000, '60-160': 100000, '>160': 180000, nose: 27500 };

let cache = null;

function corto(n) {
  const p = String(n || '').replace(/prueba qualivo/i, '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return 'Sin nombre';
  return p[0].charAt(0).toUpperCase() + p[0].slice(1).toLowerCase() + (p[1] ? ' ' + p[1].charAt(0).toUpperCase() + '.' : '');
}

async function recoger() {
  await DB.asegurar();
  const filas = await DB.sql("SELECT row_to_json(l.*) AS j FROM am_leads l WHERE creado > now() - interval '180 days' ORDER BY creado DESC LIMIT 500");
  const contactos = filas.map(function (r) {
    const L = M.vista(r), e = ETAPAS[L.etapa] || ETAPAS.nuevo;
    return {
      id: L.id, n: corto(L.nombre), etapaNombre: e[1], etapa: e[0], fin: L.etapa === 'firmado' ? 'ganado' : (L.etapa === 'perdido' || L.etapa === 'parado') ? 'perdido' : null,
      clase: L.clase, puntos: L.puntos, origen: L.origen, tipo: L.tipoLargo, zona: L.mun, cp: L.cp, metros: L.m2Txt, cuando: L.cuandoTxt,
      presupuesto: L.pptoTxt, revision: L.revision, prueba: L.prueba, contesto: L.contesto, valor: VALOR[L.ppto] || 27500,
      creado: Date.parse(L.creado), cambio: Date.parse(L.etapa_cambio)
    };
  });
  return { generado: Date.now(), etapas: ['Nuevo', 'Contactado', 'Visita técnica', 'Presupuesto enviado', 'Firmado', 'Perdido'], contactos: contactos };
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
  if (!DB.configurada()) return res.status(503).json({ error: 'Falta conectar la base de datos (AM_DATABASE_URL).' });
  try {
    const fresco = req.query && req.query.fresco === '1';
    if (!cache || fresco || Date.now() - cache.t > CACHE_MS) cache = { t: Date.now(), d: await recoger() };
    return res.status(200).json(cache.d);
  } catch (e) {
    console.error('[intel-am]', e.message);
    return res.status(502).json({ error: 'No se ha podido leer la base de datos: ' + e.message });
  }
};
