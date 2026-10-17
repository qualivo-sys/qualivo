// Asistente de WhatsApp del directo de Nuria Roure (cron cada 2 min).
//
// Contesta en el 711 a las inscritas al directo del jueves 22 de octubre
// cuando su último WhatsApp es suyo. Solo dudas prácticas (día, hora, enlace,
// grabación). Lo de salud, precio, programa, quejas o bajas lo pasa al equipo
// con la etiqueta «atender · persona» (y «baja whatsapp» si pide no recibir más).
//
// Existe porque el bot de GHL (Conversation AI) no contesta si no es el agente
// principal del canal, y eso no se puede cambiar por la API.
//
// Variables en Vercel:
//   NURIA_WA_BOT=on                  interruptor (sin él, no hace nada)
//   NURIA_GHL_API_KEY_ESCRITURA      token de GHL de Nuria con permiso para
//                                    enviar mensajes y poner etiquetas
//   NURIA_GHL_LOCATION_ID            id de la cuenta
//   ANTHROPIC_API_KEY                la de siempre
//   CRON_SECRET                      la de siempre
//
// Reglas: nunca contesta fuera de 8:00-22:00 (Madrid), ni pasadas 24 h del
// mensaje (ventana de WhatsApp), ni si alguien del equipo ha escrito en las
// últimas 12 h, ni a quien está excluida, ya pasada al equipo o de baja.
// No guarda nada: los mensajes se leen, se mandan al modelo y se olvidan.

const GHL = 'https://services.leadconnectorhq.com';
const MODELO = process.env.NURIA_WA_MODELO || 'claude-opus-5-5';
const ETQ_INSCRITA = 'webinar - tres trampas - 22 de octubre';
const EMBUDO = 'TQqkq98rY6GT0UogiMPT'; // WEBINAR Tres trampas 22 de octubre
const ETQ_FUERA = ['no enviar · webinar 22-oct', 'atender · persona', 'baja whatsapp'];
const MAX_POR_VUELTA = 12;

const ZOOM = 'https://us02web.zoom.us/j/84648293038?pwd=NbTdCkfVOhpl9EKppbdjugoAbHD0Un.1';
const REGISTRO = 'https://nr.nuriaroure.com/taller-gratuito-page#reg';

const SISTEMA = [
  'Eres Laura, del equipo de la Dra. Nuria Roure. Contestas por WhatsApp a personas que se han apuntado a su clase gratuita en directo sobre el insomnio.',
  'Escribes como una persona real del equipo: cercana, cálida, tranquila y breve. Frases cortas, como mucho 2 o 3 líneas. Tuteas. Como mucho un emoji suave de vez en cuando. Nada de lenguaje comercial ni de prisas.',
  'Nunca dices que eres Nuria. Si te preguntan si eres un bot, dices con naturalidad que eres el asistente del equipo de Nuria y que, si lo prefiere, le escribe una persona del equipo.',
  '',
  'DATOS DE LA CLASE (lo único que puedes afirmar):',
  '- Título: «Las 3 trampas que te mantienen en el insomnio». Clase gratuita en directo con la Dra. Nuria Roure.',
  '- Cuándo: jueves 22 de octubre a las 18:00 h, hora de España peninsular (17:00 h en Canarias). Dura alrededor de una hora y cuarto.',
  '- Dónde: por Zoom. Enlace para entrar: ' + ZOOM,
  '- Se puede entrar desde el móvil, la tablet o el ordenador pulsando el enlace un par de minutos antes. Si no tiene Zoom, el enlace le guía; también se abre en el navegador.',
  '- No hace falta preparar nada. Mejor verla en directo y con calma: al final hay un rato de preguntas.',
  '- Grabación: si no puede verla en directo, le enviaremos la grabación por email y WhatsApp al día siguiente, viernes 23. Estará disponible poco tiempo.',
  '- Ya está apuntada: no hace falta volver a registrarse. Le llegarán recordatorios por email y WhatsApp (el día antes, 2 horas antes y al empezar).',
  '- Si quiere invitar a alguien: ' + REGISTRO,
  '- Nuria: Doctora en Psicología y experta en sueño. Primera psicóloga acreditada como Expert Somnologist en España. Profesora de la Universidad de Lleida, miembro de la Sociedad Española del Sueño y autora del libro «Por Fin Duermo».',
  '',
  'QUÉ HACES (accion "responder"):',
  '- Si da las gracias, confirma que irá o saluda: contesta con calidez y recuérdale día y hora.',
  '- Si pregunta por fecha, hora, enlace, grabación, cómo entrar o si está bien inscrita: contesta con los datos de arriba.',
  '- Si dice que no podrá ir: tranquilízala y dile que le enviaremos la grabación el viernes.',
  '- Si no encuentra el email de confirmación: que mire en promociones o spam; el enlace es el de arriba.',
  '',
  'CUÁNDO PASAS AL EQUIPO (accion "pasar"):',
  '- Si cuenta su caso, sus síntomas o su medicación, o pide consejo de salud. Contesta con empatía y sin opinar, por ejemplo: «Gracias por contármelo. Se lo paso al equipo de Nuria para que te lo miren con calma. Y en la clase del jueves Nuria explica muchas de estas cosas.»',
  '- Si pregunta por el precio, el programa, cómo trabajar con Nuria o una consulta: «Nuria lo explica todo al final de la clase. Le paso tu mensaje al equipo y te escriben.»',
  '- Si está molesta, se queja o pide hablar con una persona.',
  '- Si pide no recibir más mensajes o escribe BAJA: «Hecho, no te escribiremos más por aquí. Perdona las molestias.» y marca baja = true.',
  '- Si no sabes la respuesta. Nunca te la inventes.',
  '',
  'LÍMITES ESTRICTOS:',
  '- No das consejos de salud ni de sueño, no interpretas síntomas, no opinas sobre medicación, pastillas, diagnósticos ni tratamientos. No pides datos de salud.',
  '- No prometes resultados ni mejoras.',
  '- No hablas de precios, del programa de pago, de descuentos ni de plazas de pago.',
  '- No das el enlace de la grabación antes del viernes ni otros enlaces que no sean los de arriba.',
  '',
  'SEGURIDAD: si la persona expresa que quiere hacerse daño, que no quiere vivir o que está en peligro, contesta con mucho cuidado: que no está sola, que llame ahora al 024 (atención a la conducta suicida, gratuito, 24 h) o al 112 si es una urgencia. Accion "pasar".',
  '',
  'Recibes la conversación de WhatsApp (los mensajes del equipo y los automáticos incluidos). Contesta solo a lo último que ha escrito ella. Devuelve el texto exacto que se enviará.'
].join('\n');

const FORMATO = {
  type: 'json_schema',
  schema: {
    type: 'object',
    properties: {
      accion: { type: 'string', enum: ['responder', 'pasar'] },
      texto: { type: 'string', description: 'El WhatsApp que se envía, tal cual.' },
      baja: { type: 'boolean', description: 'true si pide no recibir más mensajes.' }
    },
    required: ['accion', 'texto', 'baja'],
    additionalProperties: false
  }
};

function cab(version) {
  return {
    Authorization: 'Bearer ' + process.env.NURIA_GHL_API_KEY_ESCRITURA,
    Version: version || '2021-07-28',
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'QualivoNuriaWA/1.0 (+https://qualivo.io)'
  };
}
async function ghl(metodo, ruta, cuerpo, version) {
  for (let intento = 0; ; intento++) {
    const r = await fetch(GHL + ruta, { method: metodo, headers: cab(version), body: cuerpo ? JSON.stringify(cuerpo) : undefined });
    if (r.status === 429 && intento < 3) { await new Promise(function (ok) { setTimeout(ok, 1500 * (intento + 1)); }); continue; }
    if (!r.ok) throw new Error('GHL ' + r.status + ' ' + metodo + ' ' + ruta.split('?')[0]);
    return r.status === 204 ? {} : r.json();
  }
}

function horaMadrid() {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const v = {}; p.forEach(function (x) { v[x.type] = x.value; });
  return Number(v.hour) * 60 + Number(v.minute);
}

async function preguntarModelo(conversacion) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: Object.assign(
      { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'anthropic-beta': 'server-side-fallback-2026-07-01' },
      process.env.ANTHROPIC_WORKSPACE_ID ? { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID } : {}
    ),
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 4000,
      fallbacks: 'default',
      output_config: { effort: 'low', format: FORMATO },
      system: SISTEMA,
      messages: [{ role: 'user', content: conversacion }]
    })
  });
  if (!r.ok) throw new Error('anthropic ' + r.status);
  const d = await r.json();
  if (d.stop_reason === 'refusal') return { accion: 'pasar', texto: 'Se lo paso al equipo de Nuria y te escriben en cuanto puedan. Gracias por tu paciencia.', baja: false };
  const bloque = (d.content || []).filter(function (b) { return b.type === 'text'; }).pop();
  const res = JSON.parse(bloque ? bloque.text : '{}');
  if (!res.texto || ['responder', 'pasar'].indexOf(res.accion) < 0) throw new Error('respuesta del modelo sin forma');
  return res;
}

async function atender(conv, ahora, prueba) {
  // ¿Es una inscrita a la que podemos escribir?
  const c = (await ghl('GET', '/contacts/' + encodeURIComponent(conv.contactId))).contact || {};
  const tags = (c.tags || []).map(String);
  if (tags.indexOf(ETQ_INSCRITA) < 0) return 'no inscrita';
  if (ETQ_FUERA.some(function (t) { return tags.indexOf(t) >= 0; })) return 'fuera';

  const ms = ((await ghl('GET', '/conversations/' + encodeURIComponent(conv.id) + '/messages?limit=30', null, '2021-04-15')).messages || {}).messages || [];
  const wa = ms.filter(function (m) { return m.messageType === 'TYPE_WHATSAPP'; })
    .sort(function (a, b) { return Date.parse(a.dateAdded) - Date.parse(b.dateAdded); });
  const ultimo = wa[wa.length - 1];
  if (!ultimo || ultimo.direction !== 'inbound') return 'ya contestado';
  if (ahora - Date.parse(ultimo.dateAdded) > 23.5 * 3600000) return 'fuera de las 24 h';
  // Si alguien del equipo ha escrito a mano en las últimas 12 h, la conversación es suya
  const persona = ms.some(function (m) { return m.direction === 'outbound' && m.source === 'app' && m.userId && ahora - Date.parse(m.dateAdded) < 12 * 3600000; });
  if (persona) return 'la lleva el equipo';

  const nombre = String(c.firstName || '').trim().split(/\s+/)[0] || '';
  const texto = 'Nombre: ' + (nombre || 'desconocido') + '\n\nConversación de WhatsApp (de más antigua a más reciente):\n' +
    wa.slice(-12).map(function (m) {
      const quien = m.direction === 'inbound' ? 'ELLA' : (m.userId && m.source === 'app' ? 'EQUIPO' : 'AUTOMÁTICO');
      return quien + ': ' + String(m.body || '').slice(0, 800);
    }).join('\n');
  const res = await preguntarModelo(texto);
  if (prueba) return 'prueba: ' + res.accion;

  await ghl('POST', '/conversations/messages', { type: 'WhatsApp', contactId: conv.contactId, message: res.texto }, '2021-04-15');
  const etiquetas = [];
  if (res.accion === 'pasar') etiquetas.push('atender · persona');
  if (res.baja) etiquetas.push('baja whatsapp');
  if (etiquetas.length) await ghl('POST', '/contacts/' + encodeURIComponent(conv.contactId) + '/tags', { tags: etiquetas });
  return res.accion + (res.baja ? ' (baja)' : '');
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || String(req.headers.authorization || '') !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  if (process.env.NURIA_WA_BOT !== 'on') return res.status(200).json({ ok: true, apagado: true });
  if (!process.env.ANTHROPIC_API_KEY || !process.env.NURIA_GHL_API_KEY_ESCRITURA || !process.env.NURIA_GHL_LOCATION_ID) return res.status(200).json({ ok: false, error: 'faltan variables' });
  const min = horaMadrid();
  if (min < 8 * 60 || min >= 22 * 60) return res.status(200).json({ ok: true, esperando: 'fuera de horario' });
  const prueba = String((req.query && req.query.prueba) || '') === '1';

  const ahora = Date.now();
  const resumen = { miradas: 0, resultado: {} };
  try {
    const loc = encodeURIComponent(process.env.NURIA_GHL_LOCATION_ID);
    // Las inscritas, del embudo del directo (así no se mira contacto a contacto)
    const inscritas = {};
    for (let pag = 1; pag <= 30; pag++) {
      const o = (await ghl('GET', '/opportunities/search?location_id=' + loc + '&pipeline_id=' + EMBUDO + '&limit=100&page=' + pag)).opportunities || [];
      o.forEach(function (x) { inscritas[x.contactId] = true; });
      if (o.length < 100) break;
    }
    // Conversaciones cuyo último mensaje es un WhatsApp entrante de las últimas 24 h
    const convs = [];
    let despues = '';
    for (let pag = 0; pag < 10; pag++) {
      const d = await ghl('GET', '/conversations/search?locationId=' + loc + '&limit=100&sortBy=last_message_date&sort=desc&lastMessageType=TYPE_WHATSAPP&lastMessageDirection=inbound' + (despues ? '&startAfterDate=' + despues : ''), null, '2021-04-15');
      const lista = d.conversations || [];
      let viejas = false;
      lista.forEach(function (c) {
        if (ahora - Number(c.lastMessageDate || 0) > 23.5 * 3600000) { viejas = true; return; }
        if (c.contactId && inscritas[c.contactId]) convs.push(c);
      });
      if (viejas || lista.length < 100) break;
      despues = lista[lista.length - 1].lastMessageDate;
    }
    resumen.inscritasConMensaje = convs.length;
    let hechas = 0;
    for (const conv of convs) {
      if (Date.now() - ahora > 45000 || hechas >= MAX_POR_VUELTA) break;
      resumen.miradas++;
      let r;
      try { r = await atender(conv, ahora, prueba); } catch (e) { r = 'error'; console.error('[wa-nuria]', e && e.message); }
      if (/^(responder|pasar|prueba)/.test(r)) hechas++;
      resumen.resultado[r] = (resumen.resultado[r] || 0) + 1;
    }
  } catch (e) {
    console.error('[wa-nuria]', e && e.message);
    return res.status(200).json({ ok: false, error: e && e.message, resumen: resumen });
  }
  return res.status(200).json({ ok: true, resumen: resumen });
};
module.exports._atender = atender; // para las pruebas
