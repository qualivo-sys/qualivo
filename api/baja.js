// Baja de la secuencia de correos del diagnóstico. El enlace lleva el id del
// contacto y una firma; si la firma es válida se etiqueta sec-baja en GoHighLevel
// y se activa «no molestar» para correo.

const crypto = require('crypto');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';

function firma(contactId, secreto) {
  return crypto.createHmac('sha256', secreto).update(contactId).digest('hex').slice(0, 24);
}

function pagina(titulo, texto) {
  return '<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + titulo + ' · Qualivo</title><meta name="robots" content="noindex"></head>' +
    '<body style="margin:0;background:#F7F8F9;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#101319">' +
    '<div style="max-width:520px;margin:60px auto;background:#fff;border-radius:16px;padding:36px 30px">' +
    '<h1 style="margin:0 0 12px;font-size:24px">' + titulo + '</h1><p style="margin:0;font-size:16px;line-height:1.6;color:#3D4148">' + texto + '</p>' +
    '<p style="margin:24px 0 0;font-size:14px"><a href="https://qualivo.io/" style="color:#0E7C74">qualivo.io</a></p></div></body></html>';
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const secreto = process.env.CRON_SECRET;
  const apiKey = process.env.GHL_API_KEY;
  const c = String((req.query && req.query.c) || '');
  const t = String((req.query && req.query.t) || '');
  if (!secreto || !apiKey || !/^[A-Za-z0-9]{10,40}$/.test(c) || t !== firma(c, secreto)) {
    return res.status(400).send(pagina('Enlace no válido', 'Este enlace de baja no es correcto. Si quieres dejar de recibir correos, responde a cualquiera de ellos con la palabra «baja» y lo hago a mano.'));
  }
  const ghl = { Authorization: 'Bearer ' + apiKey, Version: GHL_VERSION, 'Content-Type': 'application/json' };
  try {
    await fetch(GHL_BASE + '/contacts/' + c + '/tags', { method: 'POST', headers: ghl, body: JSON.stringify({ tags: ['sec-baja'] }) });
    await fetch(GHL_BASE + '/contacts/' + c, { method: 'PUT', headers: ghl,
      body: JSON.stringify({ dndSettings: { Email: { status: 'active', message: 'Baja desde la secuencia del diagnóstico' } } }) });
  } catch (err) {
    console.error('[baja] fallo', String(err).slice(0, 200));
  }
  return res.status(200).send(pagina('Hecho. No te escribo más.', 'Quedas fuera de la secuencia del diagnóstico. Si algún día quieres retomarlo, el diagnóstico sigue en qualivo.io/donde-se-rompe-tu-crecimiento/.'));
};
