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

  const notaCampos = [
    `Origen: ${body.origen || 'calculadora'}`,
    `Modo: ${body.modo || '—'}`,
    `Clientas/semana: ${body.clientasSemana ?? '—'}`,
    `Precio medio: ${body.precioMedio ?? '—'} €`,
    `Ingreso estimado: ${body.ingresoMensual ?? '—'} €/mes`,
    `Potencial: ${body.potencialMensual ?? '—'} €/mes`
  ].join(' · ');

  const payload = {
    locationId,
    firstName: nombre,
    email,
    phone: telefono || undefined,
    source: 'Calculadora ingresos (web)',
    tags: ['lead-magnet', 'calculadora-ingresos'],
    // Guardamos el contexto de la simulación en el primer contacto vía companyName libre-></br>
    // (si hay campos personalizados creados, se pueden mapear aquí)
    customFields: []
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
            body: JSON.stringify({ body: `Calculadora de ingresos → ${notaCampos}` })
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
