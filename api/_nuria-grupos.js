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


// Cuándo sale la gente del grupo: salidas por día (respecto al directo de su edición) y franja horaria
// de Madrid. Sirve para ver qué mensajes del grupo coinciden con más salidas. Solo recuentos.
const FRANJAS = [['madrugada', 0, 8], ['mañana', 8, 14], ['tarde', 14, 20], ['noche', 20, 24]];
function madrid(f) {
  const d = new Date(f);
  if (isNaN(d)) return null;
  const p = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false }).formatToParts(d);
  const g = function (t) { return (p.find(function (x) { return x.type === t; }) || {}).value; };
  return { dia: g('year') + '-' + g('month') + '-' + g('day'), hora: Number(g('hour')) % 24 };
}
function difDias(a, b) { return Math.round((Date.parse(a + 'T12:00:00Z') - Date.parse(b + 'T12:00:00Z')) / 86400000); }
async function salidasPorMomento() {
  const L = (await filas()).filter(function (x) { return x.evento === 'sale' && /^\d{4}-\d{2}-\d{2}$/.test(String(x.edicion || '')); });
  const out = {};
  L.forEach(function (x) {
    const m = madrid(x.fecha); if (!m) return;
    const dd = difDias(m.dia, x.edicion);
    if (dd < -12 || dd > 6) return;
    const fr = FRANJAS.find(function (f) { return m.hora >= f[1] && m.hora < f[2]; })[0];
    const e = out[x.edicion] = out[x.edicion] || {};
    const k = dd + '|' + fr;
    e[k] = (e[k] || 0) + 1;
  });
  return { franjas: FRANJAS.map(function (f) { return f[0] + ' (' + f[1] + '–' + f[2] + ' h)'; }), ediciones: out };
}

module.exports = { grupos: grupos, salidasPorMomento: salidasPorMomento };
