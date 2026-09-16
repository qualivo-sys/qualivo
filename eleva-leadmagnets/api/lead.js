/**
 * /api/lead — Función serverless (Vercel).
 * Recibe los datos de la calculadora y crea/actualiza el contacto en GoHighLevel.
 * El token vive en variables de entorno de Vercel (GHL_TOKEN, GHL_LOCATION_ID),
 * nunca se expone al navegador.
 */
const GHL = 'https://services.leadconnectorhq.com';

module.exports = async (req, res) => {
  // CORS básico (por si se incrusta desde otro dominio)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const nombre = String(body.nombre || '').slice(0, 80).trim();
  const email = String(body.email || '').slice(0, 120).trim();
  const telefono = String(body.telefono || '').slice(0, 40).trim();
  if (!email || !nombre) return res.status(400).json({ error: 'missing_fields' });

  const token = process.env.GHL_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    // No hay CRM configurado todavía: no rompemos la experiencia del usuario.
    return res.status(200).json({ ok: true, crm: false });
  }

  // Cada lead magnet puede mandar un resumen libre en `detalle`.
  // Si no, componemos la nota con los campos de la calculadora de ingresos.
  const notaCampos = body.detalle
    ? `Origen: ${body.origen || 'lead-magnet'} · ${String(body.detalle).slice(0, 400)}`
    : [
        `Origen: ${body.origen || 'calculadora'}`,
        `Modo: ${body.modo || '—'}`,
        `Clientas/semana: ${body.clientasSemana ?? '—'}`,
        `Precio medio: ${body.precioMedio ?? '—'} €`,
        `Ingreso estimado: ${body.ingresoMensual ?? '—'} €/mes`,
        `Potencial: ${body.potencialMensual ?? '—'} €/mes`
      ].join(' · ');

  // Atribución de anuncio: capturamos las UTM que manda la página (de la URL del anuncio)
  // y las guardamos en campos personalizados del contacto para verlas en el trato.
  const clean = (v) => String(v || '').slice(0, 120).trim();
  const CF = {
    utm_content: '5k8Qawj9WohFIXx9ZLxZ',   // "Anuncio (utm_content)"
    utm_campaign: 'gRLU3mBopXvBPII8pST0',   // "Campaña (utm_campaign)"
    utm_source: 'Z70dykYHxcCrjOBMJujv'      // "Canal (utm_source)"
  };
  const customFields = [];
  for (const [k, id] of Object.entries(CF)) {
    if (body[k]) customFields.push({ id, value: clean(body[k]) });
  }
  const utmNota = body.utm_content ? ` · Anuncio: ${clean(body.utm_content)} (${clean(body.utm_campaign)})` : '';

  const payload = {
    locationId,
    firstName: nombre,
    email,
    phone: telefono || undefined,
    source: String(body.source || 'Calculadora ingresos (web)').slice(0, 80),
    tags: ['lead-magnet'].concat(body.tag ? [String(body.tag).slice(0, 40)] : ['calculadora-ingresos']),
    customFields
  };

  try {
    const r = await fetch(`${GHL}/contacts/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'eleva-leadmagnet/1.0'
      },
      body: JSON.stringify(payload)
    });
    const txt = await r.text();

    // Duplicado (email ya existe) → GHL devuelve 400; lo tratamos como éxito.
    if (r.ok || /duplicat/i.test(txt)) {
      // Añadimos una nota con la simulación si tenemos el contactId
      let contactId = null;
      try { contactId = (JSON.parse(txt).contact || {}).id || null; } catch {}
      if (contactId) {
        try {
          await fetch(`${GHL}/contacts/${contactId}/notes`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Version: '2021-07-28',
              'Content-Type': 'application/json',
              'User-Agent': 'eleva-leadmagnet/1.0'
            },
            body: JSON.stringify({ body: `Calculadora de ingresos → ${notaCampos}${utmNota}` })
          });
        } catch { /* la nota es best-effort */ }
      }
      return res.status(200).json({ ok: true, crm: true });
    }
    return res.status(200).json({ ok: true, crm: false, detail: txt.slice(0, 200) });
  } catch (e) {
    return res.status(200).json({ ok: true, crm: false, error: String(e).slice(0, 200) });
  }
};
