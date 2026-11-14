// Nuria · etiqueta «circulo activo · excluir envios», al día cada mañana (cron 6:00 UTC = 7:00 Madrid).
// Una edición de El Círculo está activa desde que empieza su captación hasta que acaba su venta:
// del directo − 12 días (viernes) al directo + 4 días (domingo, el día después de cerrar la venta). Quien tenga la etiqueta de registro
// o de comunidad de una edición activa recibe la etiqueta; quien ya no esté en ninguna, la pierde.
// Así las newsletters y campañas pueden excluir con una sola etiqueta a quien está en pleno Círculo.
// Solo toca esa etiqueta. ?dry=1 calcula sin escribir.

const GHL = 'https://services.leadconnectorhq.com';
const ETIQUETA = 'circulo activo · excluir envios';
const ANTES = 12, DESPUES = 4, TIEMPO_MAX = 250000;

function clave() { return process.env.NURIA_GHL_API_KEY_ESCRITURA || process.env.NURIA_GHL_API_KEY; }

async function ghl(ruta, opc) {
  opc = opc || {};
  for (let i = 0; ; i++) {
    const r = await fetch(GHL + ruta, {
      method: opc.metodo || (opc.cuerpo ? 'POST' : 'GET'),
      headers: { Authorization: 'Bearer ' + clave(), Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'QualivoNuria/1.0 (+https://qualivo.io)' },
      body: opc.cuerpo ? JSON.stringify(opc.cuerpo) : undefined
    });
    if (r.status === 429 && i < 6) { await new Promise(function (ok) { setTimeout(ok, 1500 * (i + 1)); }); continue; }
    if (!r.ok) throw new Error('GHL ' + r.status + ' ' + ruta.slice(0, 40));
    return r.status === 204 ? {} : r.json();
  }
}

function hoyMadrid() { return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })); }
function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

// Miércoles de directo cuya ventana [D−12, D+3] contiene hoy
function edicionesActivas(hoy) {
  const out = [];
  for (let k = -DESPUES; k <= ANTES; k++) {
    const d = new Date(hoy); d.setDate(d.getDate() + k);
    if (d.getDay() === 3) out.push(iso(d));
  }
  return out;
}

async function buscarTodos(loc, tag) {
  const out = []; let sa = null;
  for (let i = 0; i < 60; i++) {
    const cuerpo = { locationId: loc, pageLimit: 500, filters: [{ field: 'tags', operator: 'eq', value: tag }] };
    if (sa) cuerpo.searchAfter = sa;
    const cs = (await ghl('/contacts/search', { cuerpo: cuerpo })).contacts || [];
    out.push.apply(out, cs);
    if (cs.length < 500) break;
    sa = cs[cs.length - 1].searchAfter;
  }
  return out;
}

async function enParalelo(lista, n, fn, limite) {
  let i = 0, hechos = 0;
  await Promise.all(Array.from({ length: n }, async function () {
    while (i < lista.length && Date.now() < limite) { const x = lista[i++]; await fn(x); hechos++; }
  }));
  return hechos;
}

async function actualizar(seco) {
  const inicio = Date.now(), limite = inicio + TIEMPO_MAX;
  const loc = process.env.NURIA_GHL_LOCATION_ID;
  const eds = edicionesActivas(hoyMadrid());
  const tagsActivos = [];
  eds.forEach(function (d) { ['[registro ads]', '[registro org]', '[ingresa a comunidad]'].forEach(function (p) { tagsActivos.push(p + ' ' + d); }); });
  const norm = function (t) { return String(t).replace(/ /g, ' ').toLowerCase(); };
  const activosNorm = new Set(tagsActivos.map(norm));

  const enActivas = new Map();
  for (const t of tagsActivos) (await buscarTodos(loc, t)).forEach(function (c) { enActivas.set(c.id, c); });
  const conEtiqueta = await buscarTodos(loc, ETIQUETA);

  const poner = [...enActivas.values()].filter(function (c) { return !(c.tags || []).some(function (t) { return norm(t) === norm(ETIQUETA); }); }).map(function (c) { return c.id; });
  const quitar = conEtiqueta.filter(function (c) { return !(c.tags || []).some(function (t) { return activosNorm.has(norm(t)); }); }).map(function (c) { return c.id; });

  let puestas = 0, quitadas = 0;
  if (!seco) {
    puestas = await enParalelo(poner, 4, function (id) { return ghl('/contacts/' + id + '/tags', { cuerpo: { tags: [ETIQUETA] } }); }, limite);
    quitadas = await enParalelo(quitar, 4, function (id) { return ghl('/contacts/' + id + '/tags', { metodo: 'DELETE', cuerpo: { tags: [ETIQUETA] } }); }, limite);
  }
  return { ok: true, seco: !!seco, ediciones: eds, enEdicionesActivas: enActivas.size, conEtiquetaAntes: conEtiqueta.length, porPoner: poner.length, porQuitar: quitar.length, puestas: puestas, quitadas: quitadas, pendientes: (poner.length - puestas) + (quitar.length - quitadas), segundos: Math.round((Date.now() - inicio) / 1000) };
}

async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || String(req.headers.authorization || '') !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (!clave() || !process.env.NURIA_GHL_LOCATION_ID) return res.status(500).json({ ok: false, error: 'not_configured' });
  try { return res.status(200).json(await actualizar(String((req.query || {}).dry || '') === '1')); }
  catch (e) { return res.status(502).json({ ok: false, error: String(e.message || e).slice(0, 120) }); }
}

module.exports = handler;
module.exports.actualizar = actualizar;
module.exports.edicionesActivas = edicionesActivas;
