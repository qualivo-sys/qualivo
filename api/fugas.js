// Recibe el resultado del diagnóstico "¿Dónde se te escapan los clientes?" y crea o
// actualiza el contacto en GoHighLevel con el estado de sus cinco etapas, la más débil,
// el síntoma concreto y su perfil. Mismas credenciales que /api/lead.

const R = require('./_radiografia');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const ETAPAS = ['captacion', 'conversion', 'seguimiento', 'proceso', 'medicion'];
const SINTOMAS = ['presupuestos', 'velocidad', 'caida', 'perdidos', 'cartera', 'origen',
  'canal-unico', 'coste', 'sin-registro', 'dependencia', 'sin-guion', 'sin-revision'];
const NIVELES = ['critica', 'relevante', 'bajo'];
const EMPLEADOS = ['Solo yo', '2 a 5', '6 a 20', 'Más de 20'];
const VALORES = ['Menos de 500 €', '500 a 2.000 €', '2.000 a 10.000 €', 'Más de 10.000 €', 'No lo sé'];

const NOMBRE_ETAPA = {
  captacion: 'Captación', conversion: 'Conversión', seguimiento: 'Seguimiento',
  proceso: 'Proceso', medicion: 'Medición'
};

const NOMBRE_SINTOMA = {
  'presupuestos': 'Seguimiento de presupuestos', 'velocidad': 'Velocidad de respuesta',
  'caida': 'Gente que se cae por el camino', 'perdidos': 'Los «no» que se tiran',
  'cartera': 'Cartera dormida', 'origen': 'No sabe qué le trae los clientes',
  'canal-unico': 'Todo depende de un solo canal', 'coste': 'No sabe lo que cuesta un cliente',
  'sin-registro': 'El proceso vive en su cabeza', 'dependencia': 'El cuello de botella es el dueño',
  'sin-guion': 'Cada uno lo hace a su manera', 'sin-revision': 'Nadie mira los números'
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
  const etapaDebil = String(b.etapa_debil || '');
  const sintoma = String(b.sintoma || '');
  const nivel = String(b.nivel || '');
  const total = Number.isInteger(b.total) ? b.total : null;
  const maximo = Number.isInteger(b.maximo) ? b.maximo : null;
  const completo = b.completo === true;
  const etapas = b.etapas || {};
  const empleados = String(b.empleados || '');
  const valorCliente = String(b.valor_cliente || '');

  const etapasOk = ETAPAS.every(function (e) {
    return Number.isInteger(etapas[e]) && etapas[e] >= 0 && etapas[e] <= 8;
  });

  if (!nombre || !EMAIL_RE.test(email) || b.rgpd !== true ||
      !ETAPAS.includes(etapaDebil) || !NIVELES.includes(nivel) ||
      (sintoma && !SINTOMAS.includes(sintoma)) || !etapasOk ||
      total === null || maximo === null || total < 0 || maximo < 0 ||
      total > 40 || maximo > 40 || total > maximo ||
      !EMPLEADOS.includes(empleados) || !VALORES.includes(valorCliente)) {
    return res.status(400).json({ ok: false, error: 'invalid_payload' });
  }

  const prioritario = esPrioritario({ nivel, empleados, valor_cliente: valorCliente });

  const ghlHeaders = {
    Authorization: 'Bearer ' + apiKey,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };

  const tags = ['qualivo-landing', 'diagnostico-fugas', 'etapa-' + etapaDebil, 'nivel-' + nivel];
  if (sintoma) tags.push('sintoma-' + sintoma);
  if (completo) tags.push('diagnostico-completo');
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
      const detalle = ETAPAS.map(function (e) {
        const p = etapas[e];
        const estado = p <= 2 ? 'CRÍTICA' : (p <= 5 ? 'floja' : 'sólida');
        return '· ' + NOMBRE_ETAPA[e] + ': ' + p + '/8 (' + estado + ')';
      }).join('\n');

      const nota = [
        'Diagnóstico «¿Cuántos clientes estás perdiendo sin saberlo?» — qualivo.io',
        '',
        'ETAPA MÁS DÉBIL: ' + (NOMBRE_ETAPA[etapaDebil] || etapaDebil),
        'Síntoma concreto: ' + (NOMBRE_SINTOMA[sintoma] || sintoma || '—'),
        'Nivel: ' + nivel + ' (' + total + '/' + maximo + ' puntos)',
        completo ? 'Diagnóstico completo (20 preguntas)' : 'Diagnóstico parcial: se fue antes de terminar',
        prioritario ? '>>> LEAD PRIORITARIO: contactar en 24 h <<<' : '',
        '',
        'Perfil:',
        '· Personas en la empresa: ' + empleados,
        '· Valor de un cliente al año: ' + valorCliente,
        '',
        'Puntuación por etapa:',
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
      nombre, email, etapaDebil, sintoma, nivel, total, maximo, completo, etapas,
      empleados, valorCliente, prioritario, contactId, locationId
    }).catch(function (err) {
      console.error('[fugas] Aviso interno falló:', err);
    });

    // La radiografía prometida en el formulario. Si falla, el lead ya está
    // guardado: no se devuelve error al navegador por esto.
    await enviarRadiografia({ nombre, email, etapaDebil, etapas, completo })
      .catch(function (err) {
        console.error('[fugas] Radiografía no enviada:', err);
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
    '<p style="margin:0 0 4px;color:#E8590C;font-weight:700">Etapa más débil: ' +
      esc(NOMBRE_ETAPA[lead.etapaDebil] || lead.etapaDebil) + ' — ' +
      esc(NOMBRE_SINTOMA[lead.sintoma] || lead.sintoma || '') + '</p>' +
    '<p style="margin:0 0 16px;color:#5A5E66">Nivel ' + esc(lead.nivel) + ' · ' + lead.total + '/' + lead.maximo +
      (lead.completo ? '' : ' · diagnóstico parcial') + '</p>' +
    '<table style="border-collapse:collapse;font-size:15px">' +
    fila('Nombre', lead.nombre) +
    fila('Email', lead.email) +
    fila('Personas', lead.empleados) +
    fila('Valor cliente/año', lead.valorCliente) +
    fila('Captación', lead.etapas.captacion + '/8') +
    fila('Conversión', lead.etapas.conversion + '/8') +
    fila('Seguimiento', lead.etapas.seguimiento + '/8') +
    fila('Proceso', lead.etapas.proceso + '/8') +
    fila('Medición', lead.etapas.medicion + '/8') +
    '</table>' +
    (lead.contactId
      ? '<p style="margin:18px 0 0"><a href="' + ghlUrl + '">Ver contacto en GoHighLevel →</a></p>'
      : '') +
    '</div>';

  const asunto = (lead.prioritario ? '🔴 PRIORITARIO · ' : '📊 ') +
    lead.nombre + ' · falla en ' + (NOMBRE_ETAPA[lead.etapaDebil] || lead.etapaDebil);

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: from, to: to, subject: asunto, html: html, reply_to: lead.email })
  });
  if (!r.ok) throw new Error('Resend respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}


// ── Radiografía ampliada para el usuario ──────────────────────────────────
async function enviarRadiografia(d) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const from = process.env.RADIOGRAFIA_FROM || process.env.LEAD_NOTIFY_FROM ||
    'Maikel de Qualivo <onboarding@resend.dev>';

  const esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };
  const nombreCorto = esc(d.nombre.split(' ')[0]);
  const segunda = R.segundaPeor(d.etapas, d.etapaDebil);

  const bloque = function (e) {
    const p = d.etapas[e];
    return '<tr><td style="padding:20px 0;border-bottom:1px solid #E8E6E1">' +
      '<table style="width:100%"><tr>' +
      '<td style="font:700 17px -apple-system,Segoe UI,Roboto,sans-serif;color:#101319">' +
        R.NOMBRE[e] + ' <span style="font-weight:500;color:#8A8B90">· ' + R.PREGUNTA[e] + '</span></td>' +
      '<td align="right" style="font:800 14px -apple-system,Segoe UI,Roboto,sans-serif;color:' +
        R.color(p) + '">' + R.etiqueta(p) + ' · ' + p + '/8</td>' +
      '</tr></table>' +
      '<p style="margin:10px 0 0;font:400 15.5px/1.65 -apple-system,Segoe UI,Roboto,sans-serif;color:#3D4148">' +
        R.EXPLICA[e][R.estado(p)] + '</p></td></tr>';
  };

  const pasos = R.MOVIMIENTOS[d.etapaDebil].map(function (m, i) {
    return '<tr><td style="padding:0 0 16px"><table><tr>' +
      '<td valign="top" style="width:30px"><div style="width:24px;height:24px;border-radius:50%;' +
      'background:#101319;color:#fff;font:800 13px -apple-system,sans-serif;text-align:center;' +
      'line-height:24px">' + (i + 1) + '</div></td>' +
      '<td style="font:400 15.5px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#3D4148">' +
      m + '</td></tr></table></td></tr>';
  }).join('');

  const html =
  '<div style="background:#F7F8F9;padding:28px 14px">' +
  '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;padding:34px 30px;' +
  'font-family:-apple-system,Segoe UI,Roboto,sans-serif">' +
    '<p style="margin:0 0 6px;font:800 12px -apple-system,sans-serif;letter-spacing:.14em;' +
      'text-transform:uppercase;color:#0E7C74">Tu radiografía</p>' +
    '<h1 style="margin:0 0 18px;font:800 27px/1.2 -apple-system,Segoe UI,Roboto,sans-serif;' +
      'color:#101319;letter-spacing:-.02em">' + nombreCorto + ', donde más se te escapa es en ' +
      R.NOMBRE[d.etapaDebil].toLowerCase() + '.</h1>' +
    (d.completo ? '' :
      '<p style="margin:0 0 18px;padding:12px 16px;background:#FDF4E0;border-radius:10px;' +
      'font:600 14.5px/1.6 -apple-system,sans-serif;color:#8A6206">Contestaste solo una parte del ' +
      'diagnóstico, así que esto sale de lo que dio tiempo a ver. Si vuelves y terminas las etapas ' +
      'que faltan, la foto será más fiel.</p>') +

    '<h2 style="margin:26px 0 4px;font:800 19px -apple-system,sans-serif;color:#101319">' +
      'Las cinco etapas, una a una</h2>' +
    '<table style="width:100%;border-collapse:collapse">' + R.ETAPAS.map(bloque).join('') + '</table>' +

    '<div style="margin:28px 0 0;padding:22px 24px;background:#F7F8F9;border-radius:14px">' +
      '<p style="margin:0 0 6px;font:800 12px -apple-system,sans-serif;letter-spacing:.14em;' +
        'text-transform:uppercase;color:#0E7C74">La que no esperabas</p>' +
      '<p style="margin:0;font:400 16px/1.65 -apple-system,sans-serif;color:#3D4148">' +
        'Casi todo el mundo acierta con su primera fuga. Con la segunda no. La tuya es <strong>' +
        R.NOMBRE[segunda].toLowerCase() + '</strong>, y suele ser la que sostiene a la primera: ' +
        'arreglar una sin mirar la otra dura poco.</p>' +
    '</div>' +

    '<h2 style="margin:30px 0 10px;font:800 19px -apple-system,sans-serif;color:#101319">' +
      'Cómo saber si esto acierta</h2>' +
    '<p style="margin:0;font:400 16px/1.65 -apple-system,sans-serif;color:#3D4148">' +
      R.COMPROBAR[d.etapaDebil] + '</p>' +

    '<h2 style="margin:30px 0 14px;font:800 19px -apple-system,sans-serif;color:#101319">' +
      'Los tres primeros movimientos, en orden</h2>' +
    '<table style="width:100%;border-collapse:collapse">' + pasos + '</table>' +

    '<div style="margin:30px 0 0;padding:24px;background:#101319;border-radius:14px">' +
      '<p style="margin:0 0 8px;font:800 19px -apple-system,sans-serif;color:#fff">' +
        'Ya sabes por dónde se te escapa.</p>' +
      '<p style="margin:0 0 18px;font:400 15.5px/1.65 -apple-system,sans-serif;color:#B9BDC4">' +
        'La siguiente pregunta es cuánto te está costando y qué habría que tocar primero para que ' +
        'deje de pasar.</p>' +
      '<a href="https://qualivo.io/diagnostico/?origen=radiografia" style="display:inline-block;' +
        'background:#27BDB1;color:#04231F;text-decoration:none;font:800 15px -apple-system,sans-serif;' +
        'padding:13px 22px;border-radius:10px">Ver mi radiografía de crecimiento →</a>' +
    '</div>' +

    '<p style="margin:26px 0 0;font:400 14px/1.6 -apple-system,sans-serif;color:#8A8B90">' +
      'Si algo de esto no te cuadra, contéstame a este correo y lo miramos. Lo leo yo.<br>Maikel</p>' +
  '</div>' +
  '<p style="max-width:600px;margin:16px auto 0;font:400 12.5px/1.6 -apple-system,sans-serif;' +
    'color:#8A8B90;text-align:center">Recibes esto porque hiciste el diagnóstico en qualivo.io. ' +
    '<a href="https://qualivo.io/privacidad/" style="color:#8A8B90">Privacidad</a></p>' +
  '</div>';

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from,
      to: d.email,
      subject: 'Tu radiografía: se te escapan en ' + R.NOMBRE[d.etapaDebil].toLowerCase(),
      html: html,
      reply_to: process.env.LEAD_NOTIFY_TO || 'maikel@qualivo.io'
    })
  });
  if (!r.ok) throw new Error('Resend respondió ' + r.status + ': ' + (await r.text()).slice(0, 300));
}
