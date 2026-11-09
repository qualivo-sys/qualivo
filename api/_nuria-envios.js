// Intelligence de Nuria · envíos masivos de email (campañas de GHL/Kliking) por mes.
// Datos exactos de /emails/schedule?showStats=true: personas seleccionadas, enviados,
// entregados, abiertos y clics de cada envío. Solo lectura y sin datos personales.
// Los emails automáticos de los flujos (El Círculo, VSL…) no salen aquí.

const N = require('./_nuria-semana.js');

function tipo(nombre, total) {
  const n = String(nombre || '').toLowerCase();
  if (/replay|grabaci/.test(n)) return 'Grabación (solo inscritas)';
  if (total < 2000) return 'Recordatorio a un grupo pequeño';
  if (/webinar/.test(n)) return 'Webinar';
  if (/c[ií]rculo/.test(n)) return 'El Círculo';
  return 'Newsletter';
}

function fechaDe(x) {
  const v = x.dateScheduled || x.createdAt;
  const d = typeof v === 'number' || /^\d+$/.test(String(v)) ? new Date(Number(v)) : new Date(v);
  return isNaN(d) ? '' : new Date(d.getTime() + 3600000).toISOString().slice(0, 10);   // aprox. hora de Madrid
}

async function envios(desde, hasta) {
  const loc = process.env.NURIA_GHL_LOCATION_ID;
  const todos = [];
  for (let off = 0; off < 3000; off += 100) {
    const d = await N.ghl('/emails/schedule?locationId=' + loc + '&limit=100&offset=' + off + '&showStats=true');
    const s = d.schedules || [];
    todos.push.apply(todos, s);
    if (s.length < 100) break;
  }
  const lista = todos
    .filter(function (x) { const f = fechaDe(x); return x.status === 'complete' && !x.deleted && f >= desde && f < hasta; })
    .map(function (x) {
      return {
        fecha: fechaDe(x), nombre: String(x.name || ''), asunto: String(x.subject || ''), tipo: tipo(x.name, Number(x.totalCount || 0)),
        seleccionados: Number(x.totalCount || 0), enviados: Number(x.successCount || 0), entregados: Number(x.delivered || 0),
        abiertos: Number(x.opened || 0), clics: Number(x.clicked || 0)
      };
    })
    .sort(function (a, b) { return a.fecha < b.fecha ? -1 : 1; });
  return { desde: desde, hasta: hasta, envios: lista };
}

module.exports = { envios: envios };
