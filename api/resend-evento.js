// Webhook de Resend: aperturas, clics, rebotes y quejas de los correos de la radiografía.
// Cada evento se apunta en el contacto de GoHighLevel (etiquetas abrio-<paso>, clic-<paso>,
// rebote, queja) y suma puntuación de señal: clic +35 (una vez), 3+ aperturas +15 (una vez).
// Firma Svix (cabeceras svix-id / svix-timestamp / svix-signature) con RESEND_WEBHOOK_SECRET.
// Los correos llevan las etiquetas «paso» y «contacto» al enviarse (fugas.js, secuencia.js).

const crypto = require('crypto');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const CAMPO_SENAL = 'Señal · puntuación';
let campoSenalId = null;

function leerCuerpo(req) {
  return new Promise(function (resolve) {
    if (typeof req.body === 'string') return resolve(req.body);
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return resolve(JSON.stringify(req.body));
    const trozos = [];
    req.on('data', function (t) { trozos.push(t); });
    req.on('end', function () { resolve(Buffer.concat(trozos).toString('utf8')); });
    req.on('error', function () { resolve(''); });
  });
}

function firmaValida(req, cuerpo, secreto) {
  const id = String(req.headers['svix-id'] || '');
  const ts = String(req.headers['svix-timestamp'] || '');
  const firmas = String(req.headers['svix-signature'] || '').split(' ');
  if (!id || !ts || !firmas.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const clave = Buffer.from(secreto.replace(/^whsec_/, ''), 'base64');
  const esperada = crypto.createHmac('sha256', clave).update(id + '.' + ts + '.' + cuerpo).digest('base64');
  return firmas.some(function (f) {
    const v = f.split(',')[1] || '';
    return v.length === esperada.length && crypto.timingSafeEqual(Buffer.from(v), Buffer.from(esperada));
  });
}

async function sumarSenal(contactId, puntos, locationId, ghl) {
  if (!campoSenalId) {
    const r = await fetch(GHL_BASE + '/locations/' + locationId + '/customFields?model=contact', { headers: ghl });
    if (!r.ok) throw new Error('customFields ' + r.status);
    const f = ((await r.json()).customFields || []).filter(function (x) { return x.name === CAMPO_SENAL; })[0];
    if (!f) return null;
    campoSenalId = f.id;
  }
  const cr = await fetch(GHL_BASE + '/contacts/' + contactId, { headers: ghl });
  const contacto = cr.ok ? ((await cr.json()).contact || {}) : {};
  const actual = (contacto.customFields || []).filter(function (x) { return x.id === campoSenalId; })[0];
  const valor = Math.min(100, (Number(actual && (actual.value || actual.fieldValue)) || 0) + puntos);
  const u = await fetch(GHL_BASE + '/contacts/' + contactId, { method: 'PUT', headers: ghl, body: JSON.stringify({ customFields: [{ id: campoSenalId, field_value: valor }] }) });
  if (!u.ok) throw new Error('PUT contacto ' + u.status);
  return valor;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  const secreto = process.env.RESEND_WEBHOOK_SECRET;
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!secreto || !apiKey || !locationId) return res.status(500).json({ ok: false, error: 'not_configured' });

  const cuerpo = await leerCuerpo(req);
  if (!firmaValida(req, cuerpo, secreto)) return res.status(401).json({ ok: false, error: 'firma' });

  let ev = {};
  try { ev = JSON.parse(cuerpo); } catch (e) { return res.status(400).json({ ok: false, error: 'json' }); }
  const tipo = String(ev.type || '');
  const d = ev.data || {};
  const etiquetas = {};
  (Array.isArray(d.tags) ? d.tags : []).forEach(function (t) { if (t && t.name) etiquetas[t.name] = String(t.value || ''); });
  if (d.tags && !Array.isArray(d.tags) && typeof d.tags === 'object') Object.keys(d.tags).forEach(function (k) { etiquetas[k] = String(d.tags[k]); });
  const contactId = /^[A-Za-z0-9]{10,40}$/.test(etiquetas.contacto || '') ? etiquetas.contacto : '';
  const paso = /^[a-z0-9]{1,10}$/.test(etiquetas.paso || '') ? etiquetas.paso : 'x';
  if (!contactId) return res.status(200).json({ ok: true, ignorado: 'sin contacto' });

  const ghl = { Authorization: 'Bearer ' + apiKey, Version: GHL_VERSION, 'Content-Type': 'application/json' };
  const cr = await fetch(GHL_BASE + '/contacts/' + contactId, { headers: ghl });
  if (!cr.ok) return res.status(200).json({ ok: true, ignorado: 'contacto no encontrado' });
  const contacto = (await cr.json()).contact || {};
  const tags = (contacto.tags || []).map(String);
  const nuevas = [];
  let senal = 0;

  if (tipo === 'email.opened') {
    if (!tags.includes('abrio-' + paso)) nuevas.push('abrio-' + paso);
    const abiertos = tags.filter(function (t) { return t.indexOf('abrio-') === 0; }).length + (nuevas.length ? 1 : 0);
    if (abiertos >= 3 && !tags.includes('senal-aperturas')) { nuevas.push('senal-aperturas'); senal += 15; }
  } else if (tipo === 'email.clicked') {
    if (!tags.includes('clic-' + paso)) nuevas.push('clic-' + paso);
    if (!tags.includes('senal-clic')) { nuevas.push('senal-clic'); senal += 35; }
  } else if (tipo === 'email.bounced') {
    if (!tags.includes('rebote')) nuevas.push('rebote');
  } else if (tipo === 'email.complained') {
    if (!tags.includes('queja')) nuevas.push('queja');
    if (!tags.includes('sec-baja')) nuevas.push('sec-baja');
  } else {
    return res.status(200).json({ ok: true, ignorado: tipo });
  }

  if (nuevas.length) {
    const tg = await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', { method: 'POST', headers: ghl, body: JSON.stringify({ tags: nuevas }) });
    if (!tg.ok) console.error('[resend-evento] etiquetas', contactId, tg.status);
  }
  let total = null;
  if (senal) total = await sumarSenal(contactId, senal, locationId, ghl).catch(function (err) { console.error('[resend-evento] señal', String(err).slice(0, 120)); return null; });
  if (tipo === 'email.clicked' && !tags.includes('senal-clic')) {
    await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', { method: 'POST', headers: ghl,
      body: JSON.stringify({ body: 'Clic en el correo «' + String(d.subject || paso) + '» · ' + String((d.click && d.click.link) || '') + ' · ' + new Date().toISOString() }) }).catch(function () {});
  }
  console.log('[resend-evento]', tipo, contactId, paso, nuevas.join(','), total);
  return res.status(200).json({ ok: true, tipo: tipo, etiquetas: nuevas, senal: total });
};
