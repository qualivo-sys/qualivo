// EAC · recepción de leads de los imanes
// Reenvía al CRM solo si hay webhook configurado por variable de entorno.
// Sin variable configurada responde OK en modo vista previa: no guarda nada.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { nombre, email, telefono } = body || {};
  if (!nombre || !email || !telefono) return res.status(400).json({ ok: false, error: 'campos' });

  const scored = body.scored || {};
  const hook = process.env.CRM_WEBHOOK_URL;      // GoHighLevel o HubSpot, según se decida

  if (!hook) {
    return res.status(200).json({
      ok: true, mode: 'preview',
      score: scored.score ?? null, tag: scored.tag ?? null,
      note: 'Vista previa: no se ha enviado a ningún CRM ni se ha almacenado el dato.'
    });
  }

  try {
    const r = await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre, email, telefono,
        plazo: body.plazo, provincia: body.provincia, curso: body.curso,
        magnet: body.magnet, url: body.url, utm: body.utm,
        score: scored.score, tag: scored.tag, detalle: body.detalle || body.config || null,
        source: 'leadmagnet'
      })
    });
    return res.status(200).json({ ok: r.ok, mode: 'crm', score: scored.score ?? null, tag: scored.tag ?? null });
  } catch {
    return res.status(200).json({ ok: false, mode: 'crm', error: 'crm_unreachable', score: scored.score ?? null, tag: scored.tag ?? null });
  }
}
