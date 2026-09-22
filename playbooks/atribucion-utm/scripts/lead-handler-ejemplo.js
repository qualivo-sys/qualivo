// Backend del formulario: parsea las UTM y las escribe en los campos del CRM.
// Los IDs los devuelve scripts/ghl-campos.mjs. No hay claves aquí: van en el entorno.

const CF = {
  utm_source:   process.env.CF_UTM_SOURCE,
  utm_medium:   process.env.CF_UTM_MEDIUM,
  utm_campaign: process.env.CF_UTM_CAMPAIGN,
  utm_content:  process.env.CF_UTM_CONTENT,
  utm_term:     process.env.CF_UTM_TERM,
  landing_url:  process.env.CF_LANDING_URL,
  click_id:     process.env.CF_CLICK_ID,
};

// Normaliza la plataforma para que la asesora lea "Meta" y no "facebook"
const PLATAFORMA = { meta: 'Meta', facebook: 'Meta', google: 'Google Ads', tiktok: 'TikTok', email: 'Email' };

function utms(query) {
  const out = {};
  try {
    const p = new URLSearchParams(String(query || '').replace(/^\?/, ''));
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'])
      if (p.get(k)) out[k] = p.get(k).slice(0, 200);
    const cid = p.get('fbclid') || p.get('gclid') || p.get('ttclid');
    if (cid) out.click_id = cid.slice(0, 300);
  } catch {}
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  const { nombre, email, telefono } = body || {};
  if (!nombre || !email || !telefono) return res.status(400).json({ ok: false, error: 'campos' });
  if (body.empresa) return res.status(200).json({ ok: true, mode: 'ignored' });   // honeypot

  const u = utms(body.utm);
  const partes = String(nombre).trim().split(/\s+/);

  const payload = {
    firstName: partes[0],
    lastName: partes.slice(1).join(' ') || undefined,
    name: nombre, email, phone: telefono,
    source: body.source || 'Formulario web',
    customFields: [
      { id: CF.utm_source,   value: u.utm_source || 'organico' },
      { id: CF.utm_medium,   value: u.utm_medium || 'seo' },
      { id: CF.utm_campaign, value: u.utm_campaign || '' },
      { id: CF.utm_content,  value: u.utm_content || '' },
      { id: CF.utm_term,     value: u.utm_term || '' },
      { id: CF.landing_url,  value: String(body.url || '').slice(0, 300) },
      { id: CF.click_id,     value: u.click_id || '' },
    ].filter(f => f.id && f.value !== '' && f.value != null),
  };

  const token = process.env.GHL_TOKEN, loc = process.env.GHL_LOCATION;
  if (!token || !loc) return res.status(200).json({ ok: true, mode: 'preview' });

  try {
    const r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, Version: '2021-07-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, locationId: loc }),
    });
    // propaga el motivo: un ok:false pelado no dice nada cuando falla en producción
    const detalle = r.ok ? null : (await r.text()).slice(0, 300);
    return res.status(200).json({ ok: r.ok, mode: 'ghl', detalle });
  } catch {
    return res.status(200).json({ ok: false, error: 'crm_inalcanzable' });
  }
}
