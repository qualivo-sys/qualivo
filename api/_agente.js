// El agente de WhatsApp: contesta como Maikel cuando un lead escribe.
//
// Hasta el 18-sep, cuando un lead contestaba al primer WhatsApp, el reloj le
// mandaba la pregunta con su frase del formulario y ahí se paraba: lo que
// dijera después lo leía Maikel cuando podía. Cesar contestó a las 8:30 y
// nadie le respondió hasta que Maikel lo vio. Esto lo tapa: lee toda la
// conversación y la ficha, contesta en el tono de Maikel, y su único objetivo
// es entender la fuga en dos o tres mensajes y cerrar los quince minutos.
//
// Reglas que no se negocian (están en el prompt y en el código):
//   - Nunca da precio ni promete cifras. Precio, «quiero hablar con Maikel»,
//     queja o cosa rara: deja de contestar, avisa a Maikel y le pasa el hilo.
//   - Como mucho cinco mensajes suyos por conversación; después, Maikel.
//   - Si Maikel ha escrito él mismo en el hilo, el agente se calla.
//   - Solo contesta dentro de la ventana de 24 h que abre el cliente, que es
//     la única en la que Meta acepta texto libre. SMS no, nunca.
//   - Todo queda en la conversación de GHL y en una nota, como con Raquel.
//
// La llamada al modelo va por HTTP directo, como en el resto del repo
// (agentforme-site/api/ficha.js): aquí no hay package.json ni dependencias.

const A = require('./_activacion');
const AG = require('./agendar.js');

const MAX_TURNOS = 5;
const ESPERA_MS = 8000; // el lead suele mandar dos o tres mensajes seguidos
const CAMPO_ESTADO = 'SJp581X5s72ZxguCM4iI'; // WA · Agente (location bHGMuZEGUESZmVoNv9HT)
const ZONA = 'Europe/Madrid';

const MODELO = process.env.ANTHROPIC_MODEL || 'claude-opus-5';

// Lo que sabe de Qualivo y cómo habla. Cifras: solo las de los casos reales.
const SISTEMA = [
  'Eres Maikel Echevarría, fundador de Qualivo, contestando por WhatsApp a alguien que ha pedido el diagnóstico gratuito de crecimiento (quince minutos por videollamada). Escribes tú, en primera persona. Nadie sabe que hay un asistente detrás y no lo vas a decir.',
  '',
  'QUÉ HACE QUALIVO (para que no lo inventes): montamos el sistema que hace que ningún cliente que pide presupuesto o información se caiga por el camino. Respuesta en el minuto uno con sus palabras, filtro antes de que el equipo se mueva, seguimiento de cada presupuesto con fecha y siguiente paso, y saber cada mañana de dónde vino cada petición y cuál acabó en venta. No traemos «más leads»: hacemos que no se pierdan los que ya llegan. En los quince minutos repasas con la persona dónde se le escapa el negocio entre el anuncio y el cierre y le enseñas un plan hecho para su caso; el plan se lo mandas por escrito en 24 horas, lo haga con nosotros o no.',
  '',
  'CASOS QUE PUEDES CITAR, con estas cifras exactas y ninguna otra: Nuria Roure (clínica): 6,45 veces lo invertido sin captar un lead más, ordenando lo que pasaba después de que el lead entrara. Una academia de formación: 1.160 leads y 21 matrículas en cuatro meses. Antic Barcelona 113 (reformas): visitas agendadas en menos de 24 horas desde que el cliente pide presupuesto. Solo si viene a cuento; nunca dos en el mismo mensaje.',
  '',
  'CÓMO ESCRIBES: como en un WhatsApp de verdad. Corto: dos o tres frases, máximo cuarenta palabras, una sola pregunta por mensaje. Sin saludos largos, sin «¡Hola!» con exclamaciones, sin emojis, sin listas, sin negritas, sin jerga de marketing (nada de «leads», «funnel», «captación», «conversión»: di «peticiones», «presupuestos», «clientes», «obra», lo que use él). Tuteas. Usas sus palabras: si él dice «presupuestos», tú dices «presupuestos». Si te escribe en catalán, contestas en catalán. Nunca repites algo que ya está dicho en la conversación.',
  '',
  'TU OBJETIVO, en este orden:',
  '1. Entender en una o dos preguntas dónde cree que se le escapa el negocio. Si ya lo ha dicho (en el formulario o en la conversación), no lo vuelvas a preguntar: reconócelo con sus palabras y pasa al punto 2.',
  '2. Proponer la videollamada de quince minutos con DOS huecos concretos de los que te doy abajo (día y hora, en palabras). Nunca inventes un hueco que no esté en la lista.',
  '3. Cuando acepte uno, reserva con la herramienta reservar_cita. Su correo ya lo tenemos: no se lo pidas. Después de reservar, confirma en una frase y di que le llega la invitación al correo.',
  '',
  'LO QUE NUNCA HACES:',
  '- Dar precios, rangos de precio, «desde», ni hablar de garantías o de pilotos. Si pregunta cuánto cuesta, dile en una frase que eso depende de lo que salga en los quince minutos y que se lo cuentas ahí; si insiste, usa pasar_a_maikel.',
  '- Prometer resultados con cifras para su caso.',
  '- Hablar mal de otras agencias o de su web.',
  '- Presionar: si dice que no le interesa o que no es el momento, lo aceptas a la primera, das las gracias en una frase y usas pasar_a_maikel con motivo «no le interesa».',
  '- Mandar más de un mensaje seguido: contestas con UN mensaje.',
  '',
  'CUÁNDO USAS pasar_a_maikel (y entonces contestas solo con una frase de puente, tipo «Te contesto yo en un rato a esto»): pide precio dos veces, pide hablar con una persona o con Maikel, se queja de algo (un SMS raro, una llamada, un correo), pregunta algo técnico que no sabes, dice que ya es cliente o que ya habló con nosotros, o la conversación se va a un sitio donde no sabes qué decir. Más vale pasar de más que contestar mal.',
  '',
  'Hoy es {{FECHA}}. Los huecos libres reales del calendario de Maikel son: {{HUECOS}}. Ofrece dos, uno de mañana y otro de tarde o de otro día. Si te pide otra hora que no está en la lista, di que esa no la tienes y ofrécele las dos más cercanas.'
].join('\n');

const HERRAMIENTAS = [
  {
    name: 'reservar_cita',
    description: 'Reserva la videollamada de quince minutos con Maikel. Llámala SOLO cuando la persona ha aceptado un día y hora concretos de la lista de huecos.',
    input_schema: {
      type: 'object',
      required: ['slot'],
      properties: {
        slot: { type: 'string', description: 'Día y hora aceptados en ISO 8601 con zona Europe/Madrid, por ejemplo 2026-09-21T10:00:00+02:00. Tiene que ser uno de los huecos de la lista.' },
        contexto: { type: 'string', description: 'En dos frases y con sus palabras: qué le pasa y qué espera de la reunión, para que Maikel entre con contexto.' }
      }
    }
  },
  {
    name: 'pasar_a_maikel',
    description: 'Deja de contestar tú y avisa a Maikel para que siga él la conversación. Úsala cuando la conversación sale de lo que puedes contestar.',
    input_schema: {
      type: 'object',
      required: ['motivo'],
      properties: {
        motivo: { type: 'string', description: 'Por qué se lo pasas, en una frase: «pregunta precio», «quiere hablar con una persona», «se queja del SMS», «no le interesa».' }
      }
    }
  }
];

function fechaHoy() {
  return new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date());
}

function nombrePila(v) {
  const p = String(v || '').trim().split(/\s+/)[0] || '';
  return p ? p.charAt(0).toUpperCase() + p.slice(1) : '';
}

// Lo que sabemos del contacto, en texto, para el modelo. Sale de las etiquetas
// (sector-*, inv-*, fuga-*), de los campos WA y de las notas (las de Raquel
// llevan el resumen de la llamada).
async function fichaDe(c) {
  const tags = c.tags || [];
  // Hay etiquetas largas (sector-reformas-construccion-o-instalacio, cortada
  // por GHL) y cortas (sector-reformas): la corta es la que se lee bien.
  const de = function (prefijo) {
    const t = tags.filter(function (x) { return String(x).startsWith(prefijo); })
      .sort(function (a, b) { return a.length - b.length; })[0];
    return t ? String(t).slice(prefijo.length).replace(/-/g, ' ') : '';
  };
  const wa = A.leerCamposWA(c);
  const lineas = [];
  lineas.push('Nombre: ' + (c.firstName || c.contactName || c.name || '') + (c.companyName ? ' · Empresa: ' + c.companyName : ''));
  if (c.email) lineas.push('Correo (ya lo tenemos, no lo pidas): ' + c.email);
  const sector = de('sector-');
  if (sector) lineas.push('Sector: ' + sector);
  const inv = de('inv-');
  if (inv) lineas.push('Inversión mensual en anuncios que declaró: ' + inv);
  if (wa.loQueEscribio) lineas.push('Lo que escribió en el formulario sobre dónde se le escapa el negocio: «' + wa.loQueEscribio + '»');
  const fuga = de('fuga-');
  if (fuga && !wa.loQueEscribio) lineas.push('Dónde cree que se le escapa (formulario): ' + fuga);
  if (wa.pregunta) lineas.push('La pregunta que ya le hicimos por WhatsApp: «' + wa.pregunta + '»');
  if (A.tiene(c, 'act-agendado') || A.tiene(c, 'act-cita-confirmada')) lineas.push('YA TIENE CITA RESERVADA con Maikel. No propongas otra: si pregunta por ella, confírmasela y remítele a la invitación del correo. Si quiere cambiarla, usa pasar_a_maikel.');
  if (A.tiene(c, 'voz-completada')) lineas.push('Raquel, del equipo, ya habló con él por teléfono (mira las notas).');
  try {
    const r = await fetch(A.GHL_BASE + '/contacts/' + c.id + '/notes', { headers: A.cabeceras() });
    const d = r.ok ? await r.json() : {};
    const notas = (d.notes || []).filter(function (n) { return /LLAMADA DE RAQUEL|Raquel ha hablado|RESUMEN/i.test(n.body || ''); }).slice(0, 2);
    notas.forEach(function (n) { lineas.push('Nota de la llamada de Raquel: ' + String(n.body).replace(/\s+/g, ' ').slice(0, 600)); });
  } catch (e) { /* sin notas */ }
  return lineas.join('\n');
}

// La conversación de WhatsApp como turnos para el modelo. Los mensajes del
// sistema (plantillas, Raquel, el reloj) van como 'assistant': son «Maikel».
function turnosDe(mensajes) {
  const turnos = [];
  for (const m of mensajes) {
    if (!A.esWhatsApp(m)) continue;
    if (String(m.status || '').toLowerCase() === 'failed') continue;
    const texto = String(m.body || '').trim();
    if (!texto) continue;
    const rol = String(m.direction) === 'inbound' ? 'user' : 'assistant';
    if (turnos.length && turnos[turnos.length - 1].role === rol) {
      turnos[turnos.length - 1].content += '\n' + texto;
    } else {
      turnos.push({ role: rol, content: texto });
    }
  }
  // La API exige empezar por el usuario: si el hilo empieza por nosotros
  // (la plantilla de apertura), se pone como contexto delante.
  if (turnos.length && turnos[0].role === 'assistant') {
    turnos[0] = { role: 'user', content: '[Antes de esto Maikel le escribió: «' + turnos[0].content + '»]' + (turnos.length > 1 && turnos[1].role === 'user' ? '\n' + turnos[1].content : '') };
    if (turnos.length > 1 && turnos[1].role === 'user') turnos.splice(1, 1);
  }
  return turnos;
}

async function llamarModelo(sistema, mensajes) {
  const clave = process.env.ANTHROPIC_API_KEY;
  if (!clave) throw new Error('falta ANTHROPIC_API_KEY');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: Object.assign(
      { 'Content-Type': 'application/json', 'x-api-key': clave, 'anthropic-version': '2023-06-01' },
      // Las claves de organización (no ligadas a un workspace) exigen decir en qué workspace se gasta.
      process.env.ANTHROPIC_WORKSPACE_ID ? { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID } : {}
    ),
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 1500,
      thinking: { type: 'adaptive' },
      system: sistema,
      tools: HERRAMIENTAS,
      messages: mensajes
    })
  });
  if (!r.ok) throw new Error('anthropic ' + r.status + ' ' + (await r.text()).slice(0, 300));
  return r.json();
}

// Decide qué contestar. No envía nada: devuelve { texto, accion, detalle }.
// accion: 'responder' | 'reservar' | 'pasar' | 'callar'.
// o: { contacto, mensajes (GHL), huecos (ISO[]) }
async function decidir(o) {
  const ficha = await fichaDe(o.contacto);
  const huecos = (o.huecos || []).map(function (iso) { return AG.enPalabras(iso) + ' (' + iso + ')'; }).join(' · ') || 'ninguno: di que Maikel le escribe con opciones';
  const sistema = SISTEMA.replace('{{FECHA}}', fechaHoy()).replace('{{HUECOS}}', huecos) + '\n\nFICHA DE LA PERSONA:\n' + ficha;
  const turnos = turnosDe(o.mensajes);
  if (!turnos.length || turnos[turnos.length - 1].role !== 'user') return { accion: 'callar', motivo: 'sin_mensaje_del_lead' };

  const mensajes = turnos.slice(-20);
  let texto = '', accion = 'responder', detalle = {};
  for (let vuelta = 0; vuelta < 3; vuelta++) {
    const d = await llamarModelo(sistema, mensajes);
    const bloques = d.content || [];
    bloques.filter(function (b) { return b.type === 'text'; }).forEach(function (b) { texto = (texto ? texto + '\n' : '') + b.text.trim(); });
    const uso = bloques.filter(function (b) { return b.type === 'tool_use'; })[0];
    if (!uso) break;
    mensajes.push({ role: 'assistant', content: bloques });
    let resultado = '';
    if (uso.name === 'reservar_cita') {
      const inicio = AG.corregirFecha((uso.input || {}).slot);
      if (!inicio) {
        resultado = 'No entiendo la fecha. Pregúntale de nuevo el día y la hora.';
      } else {
        const r = await AG.reservar({
          contacto: o.contacto, inicio: inicio, contexto: (uso.input || {}).contexto || '',
          origen: 'Agente de WhatsApp', fuente: 'Agente de WhatsApp'
        });
        if (r.ok) { accion = 'reservar'; detalle = { hora: r.hora, inicio: inicio.toISOString() }; resultado = 'Reservado para el ' + r.hora + '. Confírmaselo en una frase y dile que le llega la invitación al correo.'; }
        else if (r.motivo === 'ocupado') resultado = 'Ese hueco ya no está libre. Ofrécele exactamente uno de estos: ' + (r.libres || []).map(AG.enPalabras).join(' · ');
        else resultado = 'No se ha podido reservar ahora. Dile que Maikel le manda el enlace en un momento y usa pasar_a_maikel.';
      }
    } else if (uso.name === 'pasar_a_maikel') {
      accion = 'pasar';
      detalle = { motivo: (uso.input || {}).motivo || '' };
      resultado = 'Hecho, Maikel sigue él. Despídete con una frase de puente si aún no lo has hecho.';
    } else {
      resultado = 'Herramienta desconocida.';
    }
    mensajes.push({ role: 'user', content: [{ type: 'tool_result', tool_use_id: uso.id, content: resultado }] });
    texto = '';
  }
  return { accion: accion, texto: texto.trim(), detalle: detalle, ficha: ficha };
}

// Estado del agente en el contacto (campo WA · Agente): turnos y candado.
function leerEstado(c) {
  const f = (c.customFields || []).filter(function (x) { return x && x.id === CAMPO_ESTADO; })[0];
  try { return JSON.parse((f && (f.value || f.field_value)) || '{}') || {}; } catch (e) { return {}; }
}
async function guardarEstado(contactId, estado) {
  await fetch(A.GHL_BASE + '/contacts/' + contactId, {
    method: 'PUT', headers: A.cabeceras(),
    body: JSON.stringify({ customFields: [{ id: CAMPO_ESTADO, field_value: JSON.stringify(estado).slice(0, 500) }] })
  });
}

async function contactoPorId(id) {
  const r = await fetch(A.GHL_BASE + '/contacts/' + id, { headers: A.cabeceras() });
  if (!r.ok) return null;
  const d = await r.json().catch(function () { return {}; });
  return d.contact || null;
}

function esperar(ms) { return new Promise(function (ok) { setTimeout(ok, ms); }); }

// Si el modelo falla (clave inválida, cuota), no se reintenta cada dos minutos
// ni se avisa a Maikel en cada vuelta: el 19-sep le llegaron veinte WhatsApps
// seguidos con el mismo error. Se para una hora y se avisa una vez.
let modeloCaidoHasta = 0;
let ultimoAvisoError = 0;

// Un mensaje entrante: mira si toca contestar, decide y envía. Devuelve un
// resumen de lo hecho y nunca lanza. simular=true hace todo menos enviar.
async function atender(contactId, opciones) {
  opciones = opciones || {};
  const hecho = { contactId: contactId };
  if (Date.now() < modeloCaidoHasta && !opciones.simular) return Object.assign(hecho, { accion: 'callar', motivo: 'modelo caído, en pausa' });
  try {
    let c = await contactoPorId(contactId);
    if (!c) return Object.assign(hecho, { accion: 'callar', motivo: 'sin_contacto' });
    // Solo leads que entraron por el sistema (landing, formulario de Meta o
    // cadencia). Con la pasarela en el móvil personal de Maikel, TODOS sus
    // chats entran en GHL: el 19-sep el reloj intentó contestar a un familiar.
    // Regla de Maikel (19-sep): solo contactos con la etiqueta «paid», que es
    // la que llevan todos los que entran por la landing o por el formulario.
    if (!A.tiene(c, 'paid')) return Object.assign(hecho, { accion: 'callar', motivo: 'sin etiqueta paid' });
    if (A.tiene(c, 'act-baja')) return Object.assign(hecho, { accion: 'callar', motivo: 'baja' });
    if (A.tiene(c, 'wa-humano')) return Object.assign(hecho, { accion: 'callar', motivo: 'lo lleva Maikel' });
    if (A.tiene(c, 'wa-agente-off')) return Object.assign(hecho, { accion: 'callar', motivo: 'agente apagado en este contacto' });
    // Quien ya tiene cita habla con Maikel, no con el agente (Beatriz, 19-sep).
    if (A.tiene(c, 'act-agendado') || A.tiene(c, 'act-cita-confirmada')) return Object.assign(hecho, { accion: 'callar', motivo: 'ya tiene cita: lo lleva Maikel' });

    // Candado: dos webhooks seguidos (el lead manda tres mensajes) no pueden
    // contestar dos veces. Si el candado tiene más de dos minutos, se ignora.
    let estado = leerEstado(c);
    if (estado.candado && Date.now() - estado.candado < 120000 && !opciones.simular) {
      return Object.assign(hecho, { accion: 'callar', motivo: 'otro proceso está contestando' });
    }
    if (!opciones.simular) await guardarEstado(c.id, Object.assign({}, estado, { candado: Date.now() }));

    // Se le da un momento por si sigue escribiendo, y se relee todo.
    if (!opciones.simular) await esperar(ESPERA_MS);
    let mensajes = opciones.mensajes || await A.mensajesDe(c.id);
    const wa = mensajes.filter(function (m) { return A.esWhatsApp(m) && String(m.status || '').toLowerCase() !== 'failed' && String(m.body || '').trim(); });
    const ultimo = wa[wa.length - 1];
    if (!ultimo || String(ultimo.direction) !== 'inbound') {
      if (!opciones.simular) await guardarEstado(c.id, Object.assign({}, estado, { candado: 0 }));
      return Object.assign(hecho, { accion: 'callar', motivo: 'el último mensaje no es del lead' });
    }
    // Un mensaje de hace días no se contesta a destiempo (la respuesta sale por
    // la pasarela, que no tiene ventana de 24 h, así que el límite es de sentido común).
    if (Date.now() - Date.parse(ultimo.dateAdded || 0) > 3 * 24 * 3600 * 1000) {
      if (!opciones.simular) await guardarEstado(c.id, Object.assign({}, estado, { candado: 0 }));
      return Object.assign(hecho, { accion: 'callar', motivo: 'mensaje de hace más de tres días' });
    }
    // Si Maikel ha escrito él en el hilo (mensaje saliente con usuario), el agente no se mete.
    const primerEntrante = wa.filter(function (m) { return String(m.direction) === 'inbound'; })[0];
    const humano = wa.some(function (m) { return String(m.direction) === 'outbound' && m.userId && Date.parse(m.dateAdded || 0) > Date.parse(primerEntrante.dateAdded || 0); });
    if (humano) {
      if (!opciones.simular) { await A.etiquetar(c.id, ['wa-humano']); await guardarEstado(c.id, Object.assign({}, estado, { candado: 0 })); }
      return Object.assign(hecho, { accion: 'callar', motivo: 'Maikel ya está escribiendo en este hilo' });
    }
    const turnos = Number(estado.turnos || 0);
    if (turnos >= MAX_TURNOS) {
      if (!opciones.simular) {
        await A.etiquetar(c.id, ['wa-humano']);
        await guardarEstado(c.id, Object.assign({}, estado, { candado: 0 }));
        await avisar(c, 'lleva ' + turnos + ' mensajes y no hay cita: te toca a ti', ultimo.body);
      }
      return Object.assign(hecho, { accion: 'pasar', motivo: 'tope de turnos' });
    }

    const huecos = await AG.huecosLibres(4);
    const decision = await decidir({ contacto: c, mensajes: mensajes, huecos: huecos });
    hecho.accion = decision.accion; hecho.texto = decision.texto; hecho.detalle = decision.detalle; hecho.motivo = decision.motivo;
    if (opciones.simular) return hecho;

    if (decision.texto) {
      const env = await A.enviarMensaje(c.id, decision.texto);
      hecho.canal = env.canal;
      try {
        await require('./_aviso.js').seMovio('actividad', { nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', email: c.email || '', telefono: c.phone || '', contactId: c.id,
          accion: 'El agente ha contestado', texto: 'Él: «' + String(ultimo.body).slice(0, 200) + '»\nAgente: «' + decision.texto + '»', origen: 'Agente de WhatsApp' });
      } catch (e) { /* no bloquea */ }
      if (env.canal === 'whatsapp_fallido') {
        await avisar(c, 'el agente quiso contestar y Meta rechazó el WhatsApp', decision.texto);
      }
    }
    const nuevoEstado = { turnos: turnos + (decision.texto ? 1 : 0), ultimo: new Date().toISOString(), candado: 0 };
    await guardarEstado(c.id, nuevoEstado);

    if (decision.accion === 'pasar') {
      await A.etiquetar(c.id, ['wa-humano']);
      await avisar(c, decision.detalle.motivo || 'te lo paso', ultimo.body);
    } else if (decision.accion === 'responder') {
      // Que el trato refleje que hay conversación viva.
      try { await require('./_tratos.js').mover(c.id, 'conversacion', { nombre: c.contactName || c.firstName || '', email: c.email || '', telefono: c.phone || '', empresa: c.companyName || '', origen: 'WhatsApp', fuente: 'Agente de WhatsApp' }); } catch (e) { /* no bloquea */ }
    }
    await A.nota(c.id, 'AGENTE DE WHATSAPP · ' + new Date().toLocaleString('es-ES', { timeZone: ZONA }) +
      '\nÉl: «' + String(ultimo.body).slice(0, 300) + '»' +
      '\nYo: «' + (decision.texto || '(nada)') + '»' +
      '\nAcción: ' + decision.accion + (decision.detalle && decision.detalle.motivo ? ' · ' + decision.detalle.motivo : '') + (decision.detalle && decision.detalle.hora ? ' · cita ' + decision.detalle.hora : '') +
      '\nTurno ' + nuevoEstado.turnos + ' de ' + MAX_TURNOS).catch(function () {});
    return hecho;
  } catch (e) {
    console.error('[agente]', e && e.message);
    const msg = String((e && e.message) || '');
    if (/anthropic 4(01|03|29)|anthropic 5\d\d|falta ANTHROPIC/.test(msg)) modeloCaidoHasta = Date.now() + 60 * 60000;
    if (Date.now() - ultimoAvisoError > 60 * 60000) {
      ultimoAvisoError = Date.now();
      try { await avisar({ id: contactId }, 'el agente ha fallado y se para una hora: ' + msg.slice(0, 160), ''); } catch (x) { /* nada */ }
    }
    try { const c2 = await contactoPorId(contactId); if (c2) await guardarEstado(contactId, Object.assign({}, leerEstado(c2), { candado: 0 })); } catch (x) { /* nada */ }
    return Object.assign(hecho, { accion: 'error', motivo: e && e.message });
  }
}

async function avisar(c, motivo, texto) {
  try {
    await require('./_aviso.js').seMovio('respondio', {
      nombre: c.contactName || c.firstName || '', empresa: c.companyName || '', email: c.email || '',
      telefono: c.phone || '', contactId: c.id, origen: 'Agente de WhatsApp · ' + motivo, texto: String(texto || '').slice(0, 300)
    });
  } catch (e) { console.error('[agente] aviso:', e && e.message); }
}

module.exports = { atender: atender, decidir: decidir, turnosDe: turnosDe, fichaDe: fichaDe, SISTEMA: SISTEMA, MAX_TURNOS: MAX_TURNOS };
