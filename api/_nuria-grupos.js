// Intelligence de Nuria · entradas y salidas de los grupos de WhatsApp de El Círculo, por edición.
// Lee la tabla de n8n donde el webhook de Funnelchat guarda cada entrada y salida. El flujo ya
// anota la edición de cada persona (su etiqueta «[registro ads|org] fecha del directo» en Kliking).
// Devuelve solo recuentos: ningún teléfono sale de aquí.

const TABLA = 'uYfWz0cQh0RfIMob';

async function filas() {
  const base = (process.env.NURIA_N8N_URL || 'https://nuriaroure.app.n8n.cloud').replace(/\/$/, '');
  const clave = process.env.NURIA_N8N_API_KEY;
  if (!clave) throw new Error('Falta la clave de n8n');
  const out = [];
  let cursor = null;
  for (let i = 0; i < 200; i++) {
    const r = await fetch(base + '/api/v1/data-tables/' + TABLA + '/rows?limit=250' + (cursor ? '&cursor=' + encodeURIComponent(cursor) : ''), { headers: { 'X-N8N-API-KEY': clave } });
    if (!r.ok) throw new Error('n8n ' + r.status);
    const d = await r.json();
    out.push.apply(out, d.data || []);
    cursor = d.nextCursor;
    if (!cursor) break;
  }
  return out;
}

async function grupos() {
  const L = (await filas()).filter(function (x) { return x.evento === 'entra' || x.evento === 'sale'; })
    .sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; });
  const ed = {};
  L.forEach(function (x) {
    const k = x.edicion || 'sin edición';
    const e = ed[k] = ed[k] || { entran: new Set(), salen: new Set(), ultimo: {} };
    (x.evento === 'entra' ? e.entran : e.salen).add(x.telefono);
    e.ultimo[x.telefono] = x.evento;
  });
  const ediciones = {};
  Object.keys(ed).forEach(function (k) {
    const e = ed[k];
    ediciones[k] = { entran: e.entran.size, salen: e.salen.size, siguen: Object.keys(e.ultimo).filter(function (t) { return e.ultimo[t] === 'entra'; }).length };
  });
  return { desde: L.length ? L[0].fecha : null, ediciones: ediciones };
}

module.exports = { grupos: grupos };
