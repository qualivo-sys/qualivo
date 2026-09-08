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
  iman_captacion:    null,   // se resuelve por fieldKey
  resultado_test:    null,
};

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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { nombre, email, telefono } = body || {};
  if (!nombre || !email || !telefono) return res.status(400).json({ ok: false, error: 'campos' });
  if (body.empresa) return res.status(200).json({ ok: true, mode: 'ignored' });   // honeypot

  const sc = body.scored || {};
  const det = body.detalle || {};

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
      { id: CF.fuente_plataforma,value: 'Organico SEO' },
      { id: CF.fuente_campania,  value: body.magnet || '' },
    ].filter(f => f.id),
    // trazabilidad completa por si se quiere volcar a un campo de texto largo
    meta: { magnet: body.magnet, url: body.url, utm: body.utm, resultado: body.resultado || null, detalle: det, puntos: sc.reasons || [] }
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
      return res.status(200).json({ ok: r.ok, mode: 'ghl', score: sc.score ?? null, tag: sc.tag ?? null });
    }
    const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    return res.status(200).json({ ok: r.ok, mode: 'webhook', score: sc.score ?? null, tag: sc.tag ?? null });
  } catch {
    return res.status(200).json({ ok: false, error: 'crm_unreachable', score: sc.score ?? null, tag: sc.tag ?? null });
  }
}
