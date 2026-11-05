// Intelligence de Nuria · visualizaciones de las clases (Presto Player en WordPress).
// Lee la analítica de Presto por la API REST de WordPress (solo lectura):
//   /wp-json/presto-player/v1/analytics/views y /watch-time, por día.
// Hoy Presto no sabe quién ve cada clase (la gente no inicia sesión): solo totales por día.
// Variables: NURIA_WP_USUARIO, NURIA_WP_CLAVE_APP (contraseña de aplicación).

const WP = 'https://nuriaroure.com/wp-json/presto-player/v1/';

async function leer(ruta, desde, hasta) {
  const u = process.env.NURIA_WP_USUARIO, c = process.env.NURIA_WP_CLAVE_APP;
  if (!u || !c) return null;
  const q = new URLSearchParams({ start: desde + 'T00:00:00', end: hasta + 'T23:59:59' });
  const ctl = new AbortController();
  const t = setTimeout(function () { ctl.abort(); }, 90000);   // la web de Nuria responde lento
  try {
    const r = await fetch(WP + ruta + '?' + q, { headers: { Authorization: 'Basic ' + Buffer.from(u + ':' + c).toString('base64'), 'User-Agent': 'QualivoIntelligence/1.0 (+https://qualivo.io)' }, signal: ctl.signal });
    if (!r.ok) throw new Error('Presto ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

async function clases(desde, hasta) {
  const [vistas, tiempo] = await Promise.all([leer('analytics/views', desde, hasta), leer('analytics/watch-time', desde, hasta)]);
  if (!vistas) return null;
  const dias = {};
  (vistas || []).forEach(function (x) { const d = String(x.date_time || '').slice(0, 10); if (d) dias[d] = { dia: d, vistas: Number(x.total || 0), segundos: 0 }; });
  ((tiempo && tiempo.data) || []).forEach(function (x) { const d = String(x.date_time || '').slice(0, 10); if (!d) return; dias[d] = dias[d] || { dia: d, vistas: 0, segundos: 0 }; dias[d].segundos = Number(x.total || 0); });
  return { desde: desde, hasta: hasta, mediaSegundos: tiempo ? Number(tiempo.average || 0) : null, dias: Object.keys(dias).sort().map(function (k) { return dias[k]; }) };
}

module.exports = { clases: clases };
