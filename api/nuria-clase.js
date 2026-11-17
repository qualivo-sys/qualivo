// Nuria · quién ve cada clase de El Círculo.
// Recibe los avisos de nuria/clases.js (páginas de las clases en nuriaroure.com) y pone en Kliking
// la etiqueta «clase N · paso · AAAA-MM-DD» a la alumna, donde la fecha es el directo de su edición.
// paso: empieza | mitad | acaba. Solo acepta esos valores y clases 1 a 9; no guarda nada más.
// Edición: las clases van del domingo al martes antes del directo (miércoles) y la grabación se ve
// hasta el sábado; de jueves a sábado cuenta la edición del miércoles anterior.

const GHL = 'https://services.leadconnectorhq.com';
const PASOS = ['empieza', 'mitad', 'acaba'];
const vistos = new Map();

function clave() { return process.env.NURIA_GHL_API_KEY_ESCRITURA || process.env.NURIA_GHL_API_KEY; }
function hoyMadrid() { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })); }
function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

function edicion(hoy) {
  const d = new Date(hoy), w = d.getDay();   // 0 domingo … 6 sábado
  if (w >= 4) d.setDate(d.getDate() - (w - 3));        // jueves a sábado → miércoles anterior
  else d.setDate(d.getDate() + ((3 - w + 7) % 7));     // domingo a miércoles → este miércoles
  return iso(d);
}
function etiqueta(clase, paso, ed) { return 'clase ' + clase + ' · ' + paso + ' · ' + ed; }

function leerCuerpo(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.body === 'string') { try { return Promise.resolve(JSON.parse(req.body)); } catch (e) { return Promise.resolve({}); } }
  return new Promise(function (ok) {
    let s = '';
    req.on('data', function (c) { s += c; if (s.length > 2000) req.destroy(); });
    req.on('end', function () { try { ok(JSON.parse(s)); } catch (e) { ok({}); } });
    req.on('error', function () { ok({}); });
  });
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://nuriaroure.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = await leerCuerpo(req);
  const a = String(b.a || ''), clase = String(b.clase || ''), paso = String(b.paso || '');
  if (!/^[A-Za-z0-9]{10,40}$/.test(a) || !/^[1-9]$/.test(clase) || PASOS.indexOf(paso) < 0) return res.status(400).json({ ok: false });
  if (!clave()) return res.status(503).json({ ok: false });
  const ed = edicion(hoyMadrid()), tag = etiqueta(clase, paso, ed), k = a + '|' + tag;
  if (vistos.has(k)) return res.status(204).end();
  if (vistos.size > 20000) vistos.clear();
  vistos.set(k, 1);
  try {
    const r = await fetch(GHL + '/contacts/' + encodeURIComponent(a) + '/tags', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + clave(), Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'QualivoNuria/1.0 (+https://qualivo.io)' },
      body: JSON.stringify({ tags: [tag] })
    });
    if (!r.ok) vistos.delete(k);
  } catch (e) { vistos.delete(k); }
  return res.status(204).end();
}

module.exports = handler;
module.exports.edicion = edicion;
module.exports.etiqueta = etiqueta;
