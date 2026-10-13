// Datos para rellenar el calendario del enlace «elige tu hora» (?paso=agenda&c=…), 13-oct-2026.
// Solo responde con un token firmado (api/_agenda-token.js) y devuelve lo mínimo que pide el
// calendario: nombre, email y teléfono del propio contacto. Sin caché.

const { verificar } = require('./_agenda-token.js');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false });
  }
  const contactId = verificar(req.query && req.query.c);
  if (!contactId || !process.env.GHL_API_KEY) return res.status(200).json({ ok: false });
  try {
    const r = await fetch('https://services.leadconnectorhq.com/contacts/' + contactId, {
      headers: { Authorization: 'Bearer ' + process.env.GHL_API_KEY, Version: '2021-07-28' }
    });
    if (!r.ok) return res.status(200).json({ ok: false });
    const c = ((await r.json()) || {}).contact || {};
    return res.status(200).json({ ok: true, nombre: c.firstName || '', email: c.email || '', telefono: c.phone || '' });
  } catch (err) {
    console.error('[agenda-datos]', err && err.message);
    return res.status(200).json({ ok: false });
  }
};
