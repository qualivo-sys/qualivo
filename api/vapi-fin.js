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

// Fallos de la telefonía: la llamada NUNCA llegó a sonar. Es distinto de que se
// rompa a mitad, y confundir las dos cosas sale caro. El 15-sep le escribimos
// «perdona, se nos ha cortado la llamada» a un lead cuyo teléfono no sonó
// jamás, porque el troncal no pudo establecer la llamada. Desde su lado, ese
// mensaje habla de algo que no ha pasado.
//
// Aquí no hay nada que disculpar con el contacto: no se ha enterado. El
// problema es nuestro y el aviso va a Maikel.
const NO_CONECTO = /failed-to-connect|outbound-call-failed|sip.*(fail|error)|no-answer-machine|provider-fault|cannot-connect/i;

function clasificar(informe) {
  const razon = String(informe.endedReason || '').toLowerCase();
  const seg = Number(informe.durationSeconds || 0);

  // Primero lo que ni siquiera llegó a sonar, antes del cajón genérico de error.
  if (NO_CONECTO.test(razon)) {
    return { estado: 'no_conecto', motivo: razon || 'sin_razon' };
  }
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

  // Registro de la llamada en el contacto, pase lo que pase después: qué se
  // dijo, cuánto duró, cómo acabó y dónde escucharla. Es lo que permite afinar
  // a Raquel con llamadas reales y no con suposiciones (pedido por Maikel el
  // 18-sep). El resumen y los datos estructurados los genera Vapi al colgar
  // (analysisPlan del asistente, en castellano).
  if (contacto) {
    try {
      const callId = (msg.call && msg.call.id) || '';
      const analisis = msg.analysis || {};
      const datos = analisis.structuredData || {};
      const seg = Math.round(Number(informe.durationSeconds || 0));
      const cuando = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
      // Buzón o sin respuesta: el analista de Vapi se inventa que «cogió el
      // teléfono» cuando solo habla Raquel (Pilar, 21-sep). Aquí el resumen es fijo.
      const nadieHablo = v.estado === 'sin_respuesta';
      const resumenFijo = 'Buzón o sin respuesta: no ha hablado nadie. Raquel ha dejado el mensaje.';
      const lineas = [
        'LLAMADA DE RAQUEL · ' + cuando + ' · ' + seg + ' s · ' + (informe.endedReason || ''),
        !nadieHablo && datos.resultado ? 'Resultado: ' + datos.resultado + (datos.cita ? ' (' + datos.cita + ')' : '') : '',
        !nadieHablo && datos.quien_cogio ? 'Quién cogió: ' + datos.quien_cogio + (datos.es_el_lead === false ? ' (no es quien pidió el diagnóstico)' : '') : '',
        !nadieHablo && datos.fuga_declarada ? 'Lo que cuenta: ' + datos.fuga_declarada : '',
        !nadieHablo && datos.objecion ? 'Objeción: ' + datos.objecion : '',
        !nadieHablo && datos.mejora_raquel ? 'Mejora para Raquel: ' + datos.mejora_raquel : '',
        '',
        nadieHablo ? 'RESUMEN\n' + resumenFijo : ((analisis.summary || informe.summary) ? 'RESUMEN\n' + (analisis.summary || informe.summary) : ''),
        '',
        callId ? 'Escuchar: https://dashboard.vapi.ai/calls/' + callId : '',
        '',
        informe.transcript ? 'TRANSCRIPCIÓN\n' + String(informe.transcript).slice(0, 4000) : 'Sin transcripción (no habló nadie).'
      ].filter(function (l, i, arr) { return !(l === '' && arr[i - 1] === ''); });
      await A.nota(contacto.id, lineas.join('\n'));
    } catch (e) { console.error('[vapi-fin] no se pudo anotar la llamada:', e && e.message); }
  }

  // Que no cojan el teléfono es el caso normal: no se toca nada y la cadencia
  // hace su trabajo.
  if (v.estado === 'sin_respuesta' || v.estado === 'normal') {
    if (contacto) {
      const etiqueta = v.estado === 'normal' ? 'voz-completada' : 'voz-sin-respuesta';
      try { await A.etiquetar(contacto.id, [etiqueta]); } catch (e) { /* no bloquea */ }
      // Una llamada que sí ha sido conversación mueve el trato en el tablero.
      if (v.estado === 'normal') {
        try { await require('./_tratos.js').mover(contacto.id, 'conversacion'); } catch (e) { /* no bloquea */ }
      }
      // Maikel, 19-sep: correo por cada llamada, con el resumen.
      try {
        await require('./_aviso.js').seMovio('actividad', {
          nombre: contacto.firstName || contacto.contactName || contacto.name || '', empresa: contacto.companyName || '', email: contacto.email || '', telefono: numero || contacto.phone || '', contactId: contacto.id,
          accion: v.estado === 'normal' ? 'Raquel ha hablado con él (' + Math.round(Number(informe.durationSeconds || 0)) + ' s)' : 'Raquel ha llamado y no ha cogido (' + (v.motivo || 'sin respuesta') + ')',
          texto: (v.estado === 'sin_respuesta' ? 'Buzón o sin respuesta: no ha hablado nadie. Raquel ha dejado el mensaje.' : String(((msg.analysis || {}).summary) || informe.summary || '').slice(0, 600)) + ((msg.call && msg.call.id) ? '\nEscuchar: https://dashboard.vapi.ai/calls/' + msg.call.id : ''),
          origen: 'Llamada de Raquel'
        });
      } catch (e) { /* no bloquea */ }
    }
    return res.status(200).json({ ok: true, estado: v.estado });
  }

  // La llamada no llegó a establecerse. El contacto no sabe nada, así que no se
  // le escribe: solo se deja constancia y se avisa a Maikel para que decida si
  // se reintenta. Escribirle sería disculparse por algo que no ha ocurrido.
  if (v.estado === 'no_conecto') {
    if (contacto) {
      try { await A.etiquetar(contacto.id, ['voz-no-conecto']); } catch (e) { /* no bloquea */ }
    }
    await avisar(
      'Una llamada no llegó a salir' + (numero ? ' (' + numero + ')' : ''),
      '<p style="font:16px/1.5 system-ui">La telefonía no pudo establecer la llamada. <b>El teléfono del contacto no ha sonado</b>, ' +
      'así que no se le ha escrito nada.</p>' +
      '<table style="font:14px/1.6 system-ui;border-collapse:collapse">' +
      '<tr><td style="padding:4px 12px 4px 0"><b>Motivo</b></td><td>' + escapar(v.motivo) + '</td></tr>' +
      '<tr><td style="padding:4px 12px 4px 0"><b>Teléfono</b></td><td>' + escapar(numero) + '</td></tr>' +
      '</table>' +
      '<p style="font:13px/1.5 system-ui;color:#666">Esto es un problema del número saliente, no del agente. Si se repite, ' +
      'el sistema de voz está caído aunque el número figure como activo.</p>'
    );
    return res.status(200).json({ ok: true, estado: v.estado, motivo: v.motivo });
  }

  // A partir de aquí la llamada sí se estableció y algo se rompió a mitad.
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
    // Regla de Maikel (22-sep): si el hilo lo lleva él (wa-humano), tiene cita
    // o el trato está en negociación, el rescate automático no sale: se le
    // avisa y decide él. El 22-sep salió un «se nos ha cortado la llamada» a
    // David (ProAudio) en mitad de una conversación que llevaba Maikel.
    if (tags.indexOf('wa-humano') !== -1 || tags.indexOf('act-agendado') !== -1 || tags.indexOf('act-cita-confirmada') !== -1) {
      acciones.push('sin_rescate_lo_lleva_maikel');
      await avisar('Llamada de Raquel fallida' + (nombre ? ' — ' + nombre : '') + ' (sin mensaje automático: lo llevas tú)', '<p>La llamada ha terminado mal. No se le ha escrito porque el hilo lo llevas tú o ya tiene cita. Si quieres, escríbele.</p>');
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
