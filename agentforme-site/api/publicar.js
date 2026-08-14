// Publica en el Social Planner de GHL (Instagram). Protegido con PUBLISH_SECRET:
// sin la cabecera correcta no hace nada, para que no quede una puerta abierta
// a cualquiera que descubra la URL.

const ACCOUNTS = {
  agentforme: '6a7d70552f0bd87d6789a3a9_bHGMuZEGUESZmVoNv9HT_17841436991239729',
  maikel: '6a7b7f63b57e593bbe6a2203_bHGMuZEGUESZmVoNv9HT_17841400637954150'
};
const USER_ID = 'nXgGkRbPWcDpdydQ06ns';
const GHL = 'https://services.leadconnectorhq.com';

module.exports = async function handler(req, res) {
  const secret = process.env.PUBLISH_SECRET;
  const given = req.headers['x-publish-secret'];
  if (!secret || given !== secret) {
    return res.status(404).json({ error: 'not_found' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return res.status(500).json({ ok: false, error: 'not_configured' });

  const headers = {
    Authorization: 'Bearer ' + apiKey,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };

  // Consultar el estado de un post existente
  if (req.query.check) {
    const r = await fetch(GHL + '/social-media-posting/' + locationId + '/posts/' + req.query.check, { headers: headers });
    const t = await r.text();
    return res.status(200).json({ upstreamStatus: r.status, body: t.slice(0, 2500) });
  }

  // Listar los últimos posts (para localizar el id y ver su estado)
  if (req.query.list) {
    const r = await fetch(GHL + '/social-media-posting/' + locationId + '/posts/list', {
      method: 'POST', headers: headers,
      body: JSON.stringify({ type: 'all', accounts: ACCOUNTS[req.query.list] || ACCOUNTS.maikel, skip: '0', limit: '5', includeUsers: 'false' })
    });
    const t = await r.text();
    return res.status(200).json({ upstreamStatus: r.status, body: t.slice(0, 3000) });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const b = req.body || {};
  const accountId = ACCOUNTS[b.cuenta];
  const media = Array.isArray(b.media) ? b.media : [];
  const summary = String(b.summary || '');
  if (!accountId || !media.length || !summary) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const payload = {
    accountIds: [accountId],
    type: 'post',
    userId: USER_ID,
    summary: summary,
    media: media.map(function (u) { return { url: String(u), type: 'image/jpeg' }; }),
    status: b.publicar === true ? 'published' : 'draft'
  };

  const r = await fetch(GHL + '/social-media-posting/' + locationId + '/posts', {
    method: 'POST', headers: headers, body: JSON.stringify(payload)
  });
  const t = await r.text();
  return res.status(200).json({ upstreamStatus: r.status, body: t.slice(0, 1200) });
};
