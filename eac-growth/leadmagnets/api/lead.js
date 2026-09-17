// EAC · recepción de leads de los imanes
// Mapea al esquema real del CRM de EAC (GoHighLevel) y reenvía.
// Sin credenciales configuradas responde en modo vista previa: no guarda ni envía nada.

// Campos personalizados que ya existen en la cuenta de EAC
const CF = {
  lead_score:        '2OM5C4Jv74aQnll7scTF',
  lead_temperature:  'mLYa91oz29zhukGWF5a0',
  cuando_empezar:    'WqqQlj5PcehW0b4cE7u1',
  programa_interes:  'nNHjlcQ0uABOGPQDwfI6',
  nivel_ingles:      'tjraLJd7lSNhpzEuLCDa',
  sabes_nadar_bien:  'kSymyDwvTLaGXrhnOMhD',
  edad_rango:        'EZSZYk0BSbEGOSkEqYxY',
  estudios:          'Om5K9YjzJnO7YvglvPGb',
  fuente_plataforma: 'w4iNpw1LrivCyb0vvKsZ',
  fuente_campania:   'CLYQMLrGYZi8iiHRactB',
  iman_captacion:    'Baa3dQNDNsn1egjx5cxE',
  resultado_test:    'UGXJAIaJYIiT8HTOUJSj',
  // Atribución (creados 17-sep): rellenan el apartado UTM del contacto
  utm_source:        'yLWQ5KU1cTUHm6kyygbL',
  utm_medium:        'hXRB6IFVOJKYApaXGNEW',
  utm_campaign:      '1hboX9nGPzF6cQuk4opF',
  utm_content:       'zUM4I8S9ZowLWMki13s9',
  utm_term:          'kpkhY2up9lJfaoTIXV7L',
  landing_url:       '97NNEbiisZgjEzDxzv4P',
  click_id:          'vCwr7TZT0lNRvGJS63eQ',
};

// UTM de la página: las lee de la query del imán (el bloque de GTM copia las del artículo al iframe)
function utms(q) {
  const out = {};
  try {
    const p = new URLSearchParams(String(q || '').replace(/^\?/, ''));
    for (const k of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term']) if (p.get(k)) out[k] = p.get(k).slice(0, 200);
    const cid = p.get('fbclid') || p.get('gclid') || p.get('ttclid');
    if (cid) out.click_id = cid.slice(0, 300);
  } catch {}
  return out;
}

// Traducción a los valores exactos de cada desplegable del CRM
const PLAZO   = { '<3': 'En 1-3 meses', '3-6': 'En 3-6 meses', '>6': 'Solo busco info' };
const PROGRAMA= { TCP: 'TCP / Auxiliar de vuelo', FD: 'Flight Dispatcher', AT: 'TCP / Auxiliar de vuelo', General: 'Aun no estoy seguro' };
const IMAN    = { lm_test_tcp:'Test requisitos TCP', lm_calc_sueldo:'Calculadora sueldo',
                  lm_guia_seleccion:'Guia de seleccion', lm_test_perfil:'Test de perfil',
                  lm_temario_fd:'Temario despachador' };
const TAG_IMAN= { lm_test_tcp:'lm-test-tcp', lm_calc_sueldo:'lm-calc-sueldo',
                  lm_guia_seleccion:'lm-guia-seleccion', lm_test_perfil:'lm-test-perfil',
                  lm_temario_fd:'lm-temario-fd' };
const TAG_CURSO={ TCP:'lead-tcp', AT:'lead-azafata-tierra', FD:'lead-flight-dispatcher' };

// Traza legible para la asesora, en el campo de texto largo del contacto
function resumen(body, sc, det) {
  const l = [];
  if (body.resultado) l.push('Resultado: ' + body.resultado);
  l.push('Puntuación: ' + (sc.score ?? '?') + ' (' + (sc.tag || '?') + ')');
  if (body.plazo) l.push('Quiere empezar: ' + (PLAZO[body.plazo] || body.plazo));
  if (det && Object.keys(det).length) l.push('Respuestas: ' + JSON.stringify(det));
  if (body.utm) l.push('Origen: ' + body.url + ' ' + body.utm);
  return l.join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { nombre, email, telefono } = body || {};
  if (!nombre || !email || !telefono) return res.status(400).json({ ok: false, error: 'campos' });
  if (body.empresa) return res.status(200).json({ ok: true, mode: 'ignored' });   // honeypot

  const sc = body.scored || {};
  const det = body.detalle || {};
  const u  = utms(body.utm);

  const tags = ['lead-magnet', 'organico-web'];
  if (TAG_IMAN[body.magnet]) tags.push(TAG_IMAN[body.magnet]);
  if (TAG_CURSO[body.curso]) tags.push(TAG_CURSO[body.curso]);
  if (sc.tag) tags.push(String(sc.tag).toLowerCase());
  if (body.menor === true) tags.push('edad-menor-18');

  const partes = String(nombre).trim().split(/\s+/);
  const payload = {
    firstName: partes[0],
    lastName: partes.slice(1).join(' ') || undefined,
    name: nombre, email, phone: telefono,
    source: 'Lead magnet · blog',
    tags,
    customFields: [
      { id: CF.lead_score,       value: sc.score ?? 0 },
      { id: CF.lead_temperature, value: sc.tag || 'Frio' },
      { id: CF.cuando_empezar,   value: PLAZO[body.plazo] || 'Solo busco info' },
      { id: CF.programa_interes, value: PROGRAMA[body.curso] || 'Aun no estoy seguro' },
      { id: CF.fuente_plataforma,value: u.utm_source ? ({meta:'Meta',facebook:'Meta',google:'Google Ads',tiktok:'TikTok',email:'Email'}[u.utm_source.toLowerCase()] || u.utm_source) : 'Organico SEO' },
      { id: CF.utm_source,       value: u.utm_source || 'organico' },
      { id: CF.utm_medium,       value: u.utm_medium || 'seo' },
      { id: CF.utm_campaign,     value: u.utm_campaign || ('blog · ' + (body.magnet || '')) },
      { id: CF.utm_content,      value: u.utm_content || '' },
      { id: CF.utm_term,         value: u.utm_term || '' },
      { id: CF.landing_url,      value: String(body.url || '').slice(0, 300) },
      { id: CF.click_id,         value: u.click_id || '' },
      { id: CF.fuente_campania,  value: body.magnet || '' },
      { id: CF.iman_captacion,   value: IMAN[body.magnet] || '' },
      { id: CF.resultado_test,   value: resumen(body, sc, det) },
    ].filter(f => f.id && f.value !== '' && f.value != null),
  };

  const hook  = process.env.CRM_WEBHOOK_URL;     // webhook de entrada del CRM
  const token = process.env.GHL_TOKEN;           // alternativa: API directa
  const loc   = process.env.GHL_LOCATION_ID;

  if (!hook && !token) {
    return res.status(200).json({
      ok: true, mode: 'preview',
      score: sc.score ?? null, tag: sc.tag ?? null,
      note: 'Vista previa: no se ha enviado a ningún CRM ni se ha almacenado el dato.'
    });
  }

  try {
    if (token && loc) {
      const r = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, Version: '2021-07-28', 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, locationId: loc })
      });
      const detalle = r.ok ? null : (await r.text()).slice(0, 300);
      return res.status(200).json({ ok: r.ok, mode: 'ghl', score: sc.score ?? null, tag: sc.tag ?? null, detalle });
    }
    const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return res.status(200).json({ ok: r.ok, mode: 'webhook', score: sc.score ?? null, tag: sc.tag ?? null });
  } catch {
    return res.status(200).json({ ok: false, error: 'crm_unreachable', score: sc.score ?? null, tag: sc.tag ?? null });
  }
}
