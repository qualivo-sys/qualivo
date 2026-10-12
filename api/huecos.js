// Próximos huecos libres del diagnóstico, para enseñarlos en las landings
// (formacion/v2, 12-oct-2026). Es urgencia real: los huecos salen del mismo
// calendario del CRM que usa Raquel (api/agendar.js → huecosLibres), sin
// festivos. Solo lectura, sin datos personales, cacheado 5 minutos en la CDN
// para no llamar a GHL en cada visita. Si falla, devuelve una lista vacía y la
// página esconde el bloque.

const { huecosLibres } = require('./agendar.js');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false });
  }
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  if (!process.env.GHL_API_KEY) return res.status(200).json({ ok: true, huecos: [] });
  try {
    const huecos = await huecosLibres(3);
    return res.status(200).json({ ok: true, huecos: huecos.filter(Boolean) });
  } catch (err) {
    console.error('[huecos] no se pudieron leer:', err && err.message);
    return res.status(200).json({ ok: true, huecos: [] });
  }
};
