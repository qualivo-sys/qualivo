// Recibe el resultado del diagnóstico "¿Cuántos clientes estás perdiendo sin saberlo?"
// y crea/actualiza el contacto en GoHighLevel con su fuga principal, su nivel y su
// perfil. Mismas credenciales que /api/lead (variables de entorno de Vercel).

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const DIMS = ['seguimiento', 'velocidad', 'origen', 'dependencia', 'proceso', 'cartera'];
const FUGAS = DIMS.concat(['perfecto']);
const NIVELES = ['critica', 'relevante', 'bajo'];
const EMPLEADOS = ['Solo yo', '2 a 5', '6 a 20', 'Más de 20'];
const VALORES = ['Menos de 500 €', '500 a 2.000 €', '2.000 a 10.000 €', 'Más de 10.000 €', 'No lo sé'];

const NOMBRE_FUGA = {
  seguimiento: 'Seguimiento de presupuestos',
  velocidad: 'Velocidad de respuesta',
  origen: 'Origen de los clientes',
  dependencia: 'Dependencia del dueño',
  proceso: 'Proceso sin escribir',
  cartera: 'Cartera dormida',
  perfecto: 'Sin fuga evidente'
};

// Un lead es prioritario cuando la fuga es crítica, la empresa cae dentro del ICP
// y el valor de cliente justifica la conversación. Se avisa al momento.
function esPrioritario(b) {
  return b.nivel === 'critica' &&
    (b.empleados === '2 a 5' || b.empleados === '6 a 20') &&
    (b.valor_cliente === '2.000 a 10.000 €' || b.valor_cliente === 'Más de 10.000 €');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    console.error('[fugas] Faltan GHL_API_KEY o GHL_LOCATION_ID en el entorno');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }

  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });

  const nombre = String(b.nombre || '').trim();
  const email = String(b.email || '').trim();
  const fuga = String(b.fuga || '');
  const segunda = String(b.segunda || '');
  const nivel = String(b.nivel || '');
  const total = Number.isInteger(b.total) ? b.total : null;
  const puntos = b.puntos || {};
  const empleados = String(b.empleados || '');
  const valorCliente = String(b.valor_cliente || '');

  const puntosOk = DIMS.every(function (d) {
    return Number.isInteger(puntos[d]) && puntos[d] >= 0 && puntos[d] <= 2;
  });

  if (!nombre || !EMAIL_RE.test(email) || b.rgpd !== true ||
      !FUGAS.includes(fuga) || !NIVELES.includes(nivel) ||
      total === null || total < 0 || total > 12 || !puntosOk ||
      !EMPLEADOS.includes(empleados) || !VALORES.includes(valorCliente)) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const prioritario = esPrioritario({ nivel, empleados, valor_cliente: valorCliente });

  const ghlHeaders = {
    Authorization: 'Bearer ' + apiKey,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };

  const tags = ['qualivo-landing', 'diagnostico-fugas', 'fuga-' + fuga, 'nivel-' + nivel];
  if (prioritario) tags.push('prioridad-alta');

  try {
    const upsertRes = await fetch(GHL_BASE + '/contacts/upsert', {
      method: 'POST',
      headers: ghlHeaders,
      body: JSON.stringify({
        locationId: locationId,
        name: nombre,
        email: email,
        source: 'qualivo.io — dónde pierdes clientes',
        tags: tags
      })
    });
    if (!upsertRes.ok) {
      console.error('[fugas] GHL upsert falló', upsertRes.status, (await upsertRes.text()).slice(0, 500));
      return res.status(502).json({ ok: false, error: 'crm_error' });
    }
    const upsert = await upsertRes.json();
    const contactId = upsert && upsert.contact && upsert.contact.id;

    if (contactId) {
      const detalle = DIMS.map(function (d) {
        const p = puntos[d];
        const icono = p === 2 ? 'OK' : (p === 1 ? 'regular' : 'MAL');
        return '· ' + d.charAt(0).toUpperCase() + d.slice(1) + ': ' + p + '/2 (' + icono + ')';
      }).join('\n');

      const nota = [
        'Diagnóstico «¿Cuántos clientes estás perdiendo sin saberlo?» — qualivo.io',
        '',
        'FUGA PRINCIPAL: ' + (NOMBRE_FUGA[fuga] || fuga),
        'Segunda fuga: ' + (NOMBRE_FUGA[segunda] || segunda || '—'),
        'Nivel: ' + nivel + ' (' + total + '/12 puntos)',
        prioritario ? '>>> LEAD PRIORITARIO: contactar en 24 h <<<' : '',
        '',
        'Perfil:',
        '· Personas en la empresa: ' + empleados,
        '· Valor de un cliente al año: ' + valorCliente,
        '',
        'Puntuación por dimensión:',
        detalle,
        '',
        'Consentimiento RGPD: sí · ' + new Date().toISOString()
      ].filter(Boolean).join('\n');

      const noteRes = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: nota })
      });
      if (!noteRes.ok) {
        console.error('[fugas] Nota no creada', noteRes.status, (await noteRes.text()).slice(0, 300));
      }
    }

    await avisar({
      nombre, email, fuga, segunda, nivel, total, puntos,
      empleados, valorCliente, prioritario, contactId, locationId
    }).catch(function (err) {
      console.error('[fugas] Aviso por email falló:', err);
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[fugas] Error inesperado:', err);
    return res.status(502).json({ ok: false, error: 'crm_error' });
  }
};

async function avisar(lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const to = process.env.LEAD_NOTIFY_TO || 'maikel@qualivo.io';
  const from = process.env.LEAD_NOTIFY_FROM || 'Qualivo Landing <onboarding@resend.dev>';

  const esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  const fila = function (k, v) {
    return '<tr><td style="padding:6px 14px 6px 0;color:#5A5E66;white-space:nowrap">' + k +
      '</td><td style="padding:6px 0;color:#101319">' + esc(v) + '</td></tr>';
  };
  const ghlUrl = 'https://app.gohighlevel.com/v2/location/' + lead.locationId +
    '/contacts/detail/' + lead.contactId;

  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">' +
    (lead.prioritario
      ? '<p style="background:#E8590C;color:#fff;padding:10px 14px;border-radius:8px;font-weight:700;margin:0 0 16px">LEAD PRIORITARIO · contactar en 24 h</p>'
      : '') +
    '<h2 style="margin:0 0 4px">Diagnóstico completado en qualivo.io</h2>' +
    '<p style="margin:0 0 4px;color:#E8590C;font-weight:700">Fuga principal: ' +
      esc(NOMBRE_FUGA[lead.fuga] || lead.fuga) + '</p>' +
    '<p style="margin:0 0 16px;color:#5A5E66">Nivel ' + esc(lead.nivel) + ' · ' + lead.total + '/12</p>' +
    '<table style="border-collapse:collapse;font-size:15px">' +
    fila('Nombre', lead.nombre) +
    fila('Email', lead.email) +
    fila('Personas', lead.empleados) +
    fila('Valor cliente/año', lead.valorCliente) +
    fila('Segunda fuga', NOMBRE_FUGA[lead.segunda] || lead.segunda || '—') +
    '</table>' +
    (lead.contactId
      ? '<p style="margin:18px 0 0"><a href="' + ghlUrl + '">Ver contacto en GoHighLevel →</a></p>'
      : '') +
    '</div>';

  const asunto = (lead.prioritario ? '🔴 PRIORITARIO · ' : '📊 ') +
    lead.nombre + ' · fuga: ' + (NOMBRE_FUGA[lead.fuga] || lead.fuga);

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: from, to: to, subject: asunto, html: html, reply_to: lead.email })
  });
  if (!r.ok) throw new Error('Resend respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}
