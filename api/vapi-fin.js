// Qué pasó con la llamada. Vapi lo cuenta al terminar (end-of-call-report) y
// hasta ahora nadie escuchaba: lanzábamos a Raquel y el sistema seguía la
// cadencia como si la llamada hubiera ido bien, hubiera ido bien o no.
//
// Eso importa más aquí que en otro sitio: usamos un agente de IA para vender
// agentes de IA. Una llamada que se cuelga a mitad no es un bug, es el producto
// desacreditándose solo delante de un cliente potencial.
//
// La distinción que hace este endpoint es la única que importa: que no cojan el
// teléfono es normal y la cadencia sigue; que el agente se rompa no lo es, y
// entonces entra una persona.
//
// Se protege con el mismo token que la herramienta de agenda (?k=...).

const A = require('./_activacion');

// Finales donde el agente hizo su trabajo, saliera cita o no.
const NORMALES = [
  'customer-ended-call', 'assistant-ended-call', 'customer-did-not-answer',
  'customer-busy', 'voicemail', 'assistant-ended-call-after-message-spoken',
  'customer-ended-call-during-assistant-speech'
];

// Finales donde se rompió algo nuestro. Lo que Vapi mete en endedReason cambia
// con el tiempo, así que además de esta lista se mira si la razón contiene
// «error» o «failed»: es mejor un aviso de más que un lead quemado en silencio.
const ROTOS = [
  'assistant-error', 'pipeline-error', 'assistant-not-found', 'db-error',
  'license-check-failed', 'exceeded-max-duration', 'silence-timed-out',
  'phone-call-provider-closed-websocket'
];

// Una llamada que se contesta y muere en menos de esto no llegó a ninguna parte.
// Quince segundos dan para el saludo y poco más.
const CORTA_SEG = 15;

function clasificar(informe) {
  const razon = String(informe.endedReason || '').toLowerCase();
  const seg = Number(informe.durationSeconds || 0);

  if (ROTOS.indexOf(razon) !== -1 || /error|failed/.test(razon)) {
    return { estado: 'roto', motivo: razon || 'sin_razon' };
  }
  // No contestar no es un fallo: es el motivo por el que existe la cadencia.
  if (/did-not-answer|busy|voicemail|no-answer/.test(razon)) {
    return { estado: 'sin_respuesta', motivo: razon };
  }
  // Contestó y se cortó enseguida. Puede ser que colgara al oír un robot, o que
  // el agente se liara. No se puede distinguir desde aquí, y las dos merecen
  // que alguien lo mire.
  if (seg > 0 && seg < CORTA_SEG) {
    return { estado: 'roto', motivo: 'colgada_a_los_' + Math.round(seg) + 's' };
  }
  if (NORMALES.indexOf(razon) !== -1 || seg >= CORTA_SEG) {
    return { estado: 'normal', motivo: razon || 'sin_razon' };
  }
  return { estado: 'revisar', motivo: razon || 'sin_razon' };
}

async function buscarPorTelefono(numero) {
  const r = await fetch('https://services.leadconnectorhq.com/contacts/search', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.GHL_API_KEY,
      Version: '2021-07-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      locationId: process.env.GHL_LOCATION_ID,
      pageLimit: 5,
      filters: [{ field: 'phone', operator: 'eq', value: numero }]
    })
  });
  if (!r.ok) return null;
  const d = await r.json().catch(function () { return {}; });
  return (d.contacts || [])[0] || null;
}

async function avisar(asunto, cuerpo) {
  if (!process.env.RESEND_API_KEY) return;
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>',
      to: [process.env.INFORME_PAID_TO || 'maikel@qualivo.io'],
      subject: asunto,
      html: cuerpo
    })
  }).catch(function () {});
}

function escapar(t) {
  return String(t == null ? '' : t).replace(/[&<>]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c];
  });
}

module.exports = async function handler(req, res) {
  // A Vapi se le contesta siempre 200. Si devolvemos error reintenta, y un
  // reintento aquí significa otro WhatsApp de rescate al mismo lead.
  let recibido = (req.query && req.query.k) || req.headers['x-agenda-secret'] || '';
  if (!recibido && req.url) {
    const m = String(req.url).match(/[?&]k=([^&]+)/);
    if (m) recibido = decodeURIComponent(m[1]);
  }
  const esperado = process.env.AGENDA_SECRET;
  if (!esperado || recibido !== esperado) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  const msg = (req.body && req.body.message) || {};
  if (String(msg.type || '') !== 'end-of-call-report') {
    return res.status(200).json({ ok: true, ignorado: msg.type || 'sin_tipo' });
  }

  const informe = {
    endedReason: msg.endedReason,
    durationSeconds: msg.durationSeconds || (msg.call && msg.call.durationSeconds),
    transcript: msg.transcript,
    summary: msg.summary
  };
  const v = clasificar(informe);
  const numero = (msg.customer && msg.customer.number) ||
    (msg.call && msg.call.customer && msg.call.customer.number) || '';

  let contacto = null;
  try { if (numero) contacto = await buscarPorTelefono(numero); } catch (e) { /* seguimos */ }

  // Que no cojan el teléfono es el caso normal: no se toca nada y la cadencia
  // hace su trabajo.
  if (v.estado === 'sin_respuesta' || v.estado === 'normal') {
    if (contacto) {
      const etiqueta = v.estado === 'normal' ? 'voz-completada' : 'voz-sin-respuesta';
      try { await A.etiquetar(contacto.id, [etiqueta]); } catch (e) { /* no bloquea */ }
    }
    return res.status(200).json({ ok: true, estado: v.estado });
  }

  // A partir de aquí algo se rompió.
  const nombre = (contacto && (contacto.firstName || contacto.name)) || '';
  const acciones = [];

  if (contacto) {
    try { await A.etiquetar(contacto.id, ['voz-fallo']); acciones.push('etiquetado'); } catch (e) { /* no bloquea */ }

    // A quien ya pidió que le dejáramos en paz no se le escribe ni para pedir
    // perdón.
    const tags = (contacto.tags || []).map(function (t) { return String(t).toLowerCase(); });
    if (tags.indexOf('act-baja') !== -1) {
      acciones.push('sin_rescate_por_baja');
      await avisar('Llamada fallida a un contacto de baja', '<p>Se ha etiquetado, no se le ha escrito.</p>');
      return res.status(200).json({ ok: true, estado: v.estado, acciones: acciones });
    }

    // Rescate: la llamada se ha caído y del otro lado hay alguien que acaba de
    // hablar con un robot que se ha colgado. Se pide perdón y se le devuelve el
    // control, sin volver a llamar automáticamente.
    if (A.enVentana('whatsapp')) {
      const texto = (nombre ? nombre + ', ' : '') +
        'perdona, se nos ha cortado la llamada. Soy Maikel, de Qualivo. ' +
        'Si te viene bien te escribo por aquí y lo vemos sin llamadas: ' +
        '¿qué es lo que más se te está escapando ahora mismo?';
      try {
        const env = await A.enviarMensaje(contacto.id, texto);
        acciones.push('rescate_' + (env && env.canal ? env.canal : 'enviado'));
      } catch (e) { acciones.push('rescate_fallido'); }
    } else {
      acciones.push('rescate_fuera_de_ventana');
    }
  }

  await avisar(
    'Llamada de Raquel fallida' + (nombre ? ' — ' + nombre : ''),
    '<p style="font:16px/1.5 system-ui">Una llamada ha terminado mal y el lead lo ha notado.</p>' +
    '<table style="font:14px/1.6 system-ui;border-collapse:collapse">' +
    '<tr><td style="padding:4px 12px 4px 0"><b>Motivo</b></td><td>' + escapar(v.motivo) + '</td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0"><b>Duración</b></td><td>' + Math.round(Number(informe.durationSeconds || 0)) + ' s</td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0"><b>Teléfono</b></td><td>' + escapar(numero) + '</td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0"><b>Contacto</b></td><td>' + (contacto ? escapar(nombre || contacto.id) : 'no encontrado en el CRM') + '</td></tr>' +
    '<tr><td style="padding:4px 12px 4px 0"><b>Hecho</b></td><td>' + escapar(acciones.join(', ') || 'nada') + '</td></tr>' +
    '</table>' +
    (informe.summary ? '<p style="font:14px/1.5 system-ui"><b>Resumen de la llamada</b><br>' + escapar(informe.summary) + '</p>' : '') +
    '<p style="font:13px/1.5 system-ui;color:#666">Si esto se repite dos veces seguidas, lo que toca es apagar la llamada ' +
    'automática (quitar el paso de voz) y dejar solo WhatsApp hasta mirarlo con calma. Un lead quemado no vuelve.</p>'
  );

  return res.status(200).json({ ok: true, estado: v.estado, motivo: v.motivo, acciones: acciones });
};
