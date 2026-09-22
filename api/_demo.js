// Demo «prueba tu agente» (idea de Maikel, 22-sep-2026, a raíz del anuncio de fonio.ai):
// el prospecto mete su web y su móvil, y en menos de un minuto le llama la
// agente de voz de SU negocio. Él hace de cliente. Cuando cuelga, recibe el
// correo que recibiría como dueño: ficha del lead, resumen de la llamada,
// grabación, cita tomada y qué haría el sistema después. Nada del correo se
// inventa: sale de lo que ha pasado en la llamada.
//
// Este módulo no toca GHL ni la cadencia real: los contactos de demo se
// etiquetan «demo» y los maneja quien lo llame (api/demo.js o un script).
//
//   leerWeb(url)                → texto plano de la web (o '' si no se puede)
//   brief({web, sector, nombre, texto}) → { negocio, resumen, servicios, tono, agente, preguntas, saludo }
//   lanzarLlamada({brief, nombre, telefono, ...}) → { ok, id } (Vapi)
//   correoDueno({brief, datos, llamada}) → { asunto, html }

const MODELO = process.env.DEMO_MODELO || 'claude-opus-5';
const VAPI = 'https://api.vapi.ai';

function limpiar(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ').replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function normalizarUrl(u) {
  u = String(u || '').trim();
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u;
}

// Primero la web tal cual; si devuelve poco texto (bloqueo anti-bots,
// página montada por JavaScript), se prueba con el lector de Jina, que
// renderiza y devuelve texto. Si tampoco, ''. Nunca lanza.
async function leerWeb(url) {
  url = normalizarUrl(url);
  if (!url) return '';
  async function intento(u, cabeceras) {
    try {
      const ctl = new AbortController();
      const t = setTimeout(function () { ctl.abort(); }, 12000);
      const r = await fetch(u, { headers: Object.assign({ 'User-Agent': 'Mozilla/5.0 (compatible; QualivoDemo/1.0)' }, cabeceras || {}), signal: ctl.signal, redirect: 'follow' });
      clearTimeout(t);
      if (!r.ok) return '';
      return limpiar(await r.text());
    } catch (e) { return ''; }
  }
  let texto = await intento(url);
  if (texto.length < 400) {
    const j = await intento('https://r.jina.ai/' + url, { Accept: 'text/plain' });
    if (j.length > texto.length) texto = j;
  }
  return texto.slice(0, 9000);
}

async function modelo(sistema, usuario, maxTokens) {
  const clave = process.env.ANTHROPIC_API_KEY;
  if (!clave) throw new Error('falta ANTHROPIC_API_KEY');
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: Object.assign({ 'Content-Type': 'application/json', 'x-api-key': clave, 'anthropic-version': '2023-06-01' },
      process.env.ANTHROPIC_WORKSPACE_ID ? { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID } : {}),
    body: JSON.stringify({ model: MODELO, max_tokens: maxTokens || 1500, system: sistema, messages: [{ role: 'user', content: usuario }] })
  });
  if (!r.ok) throw new Error('anthropic ' + r.status + ' ' + (await r.text()).slice(0, 300));
  const d = await r.json();
  return (d.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('');
}

function json(texto) {
  const m = String(texto || '').match(/\{[\s\S]*\}/);
  if (!m) throw new Error('el modelo no devolvió JSON');
  return JSON.parse(m[0]);
}

const SECTORES = {
  clinicas: { que: 'clínica', cliente: 'paciente', citas: 'primera visita', ejemplos: 'implantes, ortodoncia, limpieza, urgencias' },
  formacion: { que: 'centro de formación', cliente: 'alumno', citas: 'sesión informativa', ejemplos: 'cursos, matrícula, horarios, precios' },
  reformas: { que: 'empresa de reformas', cliente: 'cliente', citas: 'visita para presupuesto', ejemplos: 'reforma integral, cocina, baño, plazos' },
  asesorias: { que: 'asesoría', cliente: 'cliente', citas: 'primera reunión', ejemplos: 'alta de autónomo, contabilidad, laboral, fiscal' }
};

// Ficha del negocio a partir de su web. Si la web no da nada, se apoya en el
// sector y lo dice (brief.fuente = 'sector').
async function brief(o) {
  const s = SECTORES[o.sector] || { que: 'negocio', cliente: 'cliente', citas: 'primera cita', ejemplos: 'servicios, precios, horarios' };
  const texto = String(o.texto || '');
  const sistema = 'Preparas a una agente telefónica para que atienda las llamadas de un negocio como si fuera su recepcionista de toda la vida. Devuelves SOLO un JSON con estas claves: ' +
    'negocio (nombre del negocio tal como se presenta), resumen (2 frases: qué hace y para quién), servicios (lista de 4 a 8 servicios o productos, con precio si la web lo dice), ' +
    'horario (si aparece; si no, ""), ubicacion (ciudad o barrio si aparece; si no, ""), tono (3 adjetivos de cómo habla la marca), agente (nombre de pila femenino, español, que no sea Raquel), ' +
    'preguntas (lista de 4 preguntas que hace un ' + s.cliente + ' cuando llama a un ' + s.que + ' así), gancho (1 dato concreto de la web que un cliente valoraría, p. ej. primera visita gratis o 25 años de experiencia; si no hay, ""). ' +
    'Todo en castellano de España. No inventes precios, horarios ni direcciones: si no están en el texto, deja el campo vacío.';
  const usuario = texto.length > 200
    ? 'Web: ' + o.web + '\nSector: ' + (o.sector || 'no indicado') + '\n\nTexto de la web:\n' + texto
    : 'No se ha podido leer la web ' + o.web + '. Sector: ' + (o.sector || 'no indicado') + '. Prepara la ficha de un ' + s.que + ' típico con servicios como ' + s.ejemplos + ', sin precios ni dirección, y en negocio pon el nombre que se deduzca del dominio.';
  const b = json(await modelo(sistema, usuario, 1200));
  if (b.negocio && b.negocio === String(b.negocio).toUpperCase()) b.negocio = String(b.negocio).toLowerCase().replace(/(^|\s)\S/g, function (m) { return m.toUpperCase(); });
  b.fuente = texto.length > 200 ? 'web' : 'sector';
  b.sector = o.sector || '';
  b.web = o.web || '';
  b.tipoCliente = s.cliente;
  b.tipoCita = s.citas;
  return b;
}

function promptLlamada(b, nombre) {
  const servicios = (b.servicios || []).map(function (x) { return typeof x === 'string' ? x : (x.nombre || '') + (x.precio ? ' (' + x.precio + ')' : ''); }).join('; ');
  return 'Eres ' + b.agente + ', la agente telefónica de ' + b.negocio + ' (' + b.resumen + '). Hablas castellano de España, natural, frases cortas, tono ' + (Array.isArray(b.tono) ? b.tono.join(', ') : b.tono) + '. ' +
    'El nombre del negocio se dice como una palabra, tal cual está escrito, sin deletrear. El nombre de quien llama se escribe exactamente así: ' + nombre + '. ' +
    'Quien llama es ' + nombre + ', un ' + b.tipoCliente + ' que quiere información. Atiéndele como lo haría la mejor recepcionista: escucha, responde a lo que pregunta con lo que sabes, y llévale con naturalidad a reservar una ' + b.tipoCita + '.\n\n' +
    'LO QUE SABES\nServicios: ' + (servicios || 'los habituales del sector') + '.\n' + (b.horario ? 'Horario: ' + b.horario + '.\n' : '') + (b.ubicacion ? 'Dónde: ' + b.ubicacion + '.\n' : '') + (b.gancho ? 'Dato a mencionar si encaja: ' + b.gancho + '.\n' : '') +
    'Si te preguntan algo que no sabes (un precio exacto, una dirección), no lo inventes: di que eso te lo confirma el equipo y que se lo mandan por WhatsApp.\n\n' +
    'RESERVAR\nPara reservar pide nombre, qué necesita y cuándo le viene mejor (mañana o tarde). Ofrece dos opciones concretas de esta semana, confirma en voz alta día y hora y di que le llega la confirmación por WhatsApp. No hace falta que exista la agenda: es una demostración.\n\n' +
    'CUANDO ROMPER EL PAPEL\nSolo en dos casos: cuando la cita quede confirmada en voz alta, o cuando la conversación pase de tres minutos. Si quien llama dice que es una prueba, que está probando o que es una demo, NO rompas el papel: dile con naturalidad «Sin problema, pregúntame lo que le preguntarías a la clínica» (o al negocio) y sigue atendiendo como recepcionista. Cuando toque, cambia de registro y di, con estas ideas y tus palabras: ' +
    '«' + nombre + ', esto que acabas de vivir es lo que oirían tus ' + b.tipoCliente + 's cuando llaman a ' + b.negocio + ' y nadie puede cogerlo. En un minuto te llega un correo con lo que verías tú como dueño: la ficha, el resumen de esta llamada, la cita y lo que haría el sistema después. Si quieres verlo montado con tu agenda de verdad, Maikel te lo enseña en media hora.» ' +
    'Despídete y cuelga. No sigas vendiendo después de eso.\n\n' +
    'REGLAS\nNunca digas que eres una inteligencia artificial salvo que te lo pregunten directamente (entonces sí, con naturalidad). No hables de Qualivo hasta romper el papel. Una pregunta por turno. Si hay silencio de más de cinco segundos, pregunta si sigue ahí; si no contesta, despídete y cuelga.';
}

function primeraFrase(b, nombre) {
  return b.negocio + ', buenas, soy ' + b.agente + '. ¿Con quién hablo?';
}

async function lanzarLlamada(o) {
  const clave = process.env.VAPI_API_KEY;
  const asistente = process.env.VAPI_ASSISTANT_ID;
  // El número español desde el que llama Raquel (id de Vapi, no es un secreto).
  const numero = process.env.VAPI_PHONE_NUMBER_ID || '2f99f0e4-5294-4340-9d4a-10bd4553f8ff';
  if (!clave || !asistente) return { ok: false, motivo: 'sin_credenciales' };
  const b = o.brief;
  const nombre = String(o.nombre || '').split(' ')[0] || 'hola';
  const body = {
    assistantId: asistente, phoneNumberId: numero,
    customer: { number: o.telefono, name: o.nombre || '' },
    assistantOverrides: {
      firstMessage: primeraFrase(b, nombre),
      model: { provider: 'openai', model: 'gpt-4o', messages: [{ role: 'system', content: promptLlamada(b, nombre) }], temperature: 0.6 },
      endCallFunctionEnabled: true,
      maxDurationSeconds: 360,
      // La ficha viaja dentro de la llamada: api/vapi-fin.js la recupera al
      // colgar para montar el correo del dueño sin volver a leer la web.
      variableValues: { demo: '1', nombre: nombre, nombreCompleto: o.nombre || nombre, empresa: b.negocio, email: o.email || '', web: b.web || '', contactId: o.contactId || '', brief: JSON.stringify(b).slice(0, 6000) }
    }
  };
  const r = await fetch(VAPI + '/call', { method: 'POST', headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) return { ok: false, motivo: 'vapi_' + r.status, detalle: (await r.text()).slice(0, 300) };
  const d = await r.json().catch(function () { return {}; });
  return { ok: true, id: d.id };
}

async function llamada(id) {
  const r = await fetch(VAPI + '/call/' + id, { headers: { Authorization: 'Bearer ' + process.env.VAPI_API_KEY } });
  if (!r.ok) throw new Error('vapi ' + r.status);
  return r.json();
}

// Extrae de la transcripción lo que el dueño querría saber. Solo lo que se
// dijo; si no se dijo, campo vacío.
async function extraer(b, transcripcion) {
  const sistema = 'Lees la transcripción de una llamada entre la agente telefónica de ' + b.negocio + ' y un ' + b.tipoCliente + ' y devuelves SOLO un JSON con: ' +
    'que_queria (1 frase, con sus palabras), preguntas (lista de lo que preguntó), cita (día y hora si se confirmó, si no ""), datos (lista de datos personales que dio: nombre, motivo, preferencia horaria…), ' +
    'siguiente_paso (1 frase: qué haría ahora el equipo), nivel (A si quiere cita y dio datos, B si interés claro sin cita, C si solo curioseaba, D si no hubo conversación), motivo_nivel (1 frase), resumen (3 frases máximo). Castellano de España. No inventes nada: si no está en la transcripción, vacío.';
  return json(await modelo(sistema, 'Transcripción:\n' + String(transcripcion || '').slice(0, 12000), 900));
}

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function lista(a) { return (a || []).length ? '<ul style="margin:6px 0 0 18px;padding:0">' + a.map(function (x) { return '<li style="margin:3px 0">' + esc(x) + '</li>'; }).join('') + '</ul>' : '<span style="color:#8a8a8a">—</span>'; }

// El correo del dueño: lo que Maikel recibe hoy con cada lead, maquetado para
// alguien que lo ve por primera vez.
function correoDueno(o) {
  const b = o.brief, d = o.datos, x = o.extraido || {}, L = o.llamada || {};
  const dur = L.startedAt && L.endedAt ? Math.round((Date.parse(L.endedAt) - Date.parse(L.startedAt)) / 1000) : 0;
  const cuando = new Date(L.startedAt || Date.now()).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  const F = '-apple-system,Segoe UI,Roboto,sans-serif';
  const caja = function (titulo, cuerpo) { return '<div style="border:1px solid #e6e6e6;border-radius:10px;padding:16px 18px;margin:14px 0"><div style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#7a7c82;margin-bottom:8px">' + titulo + '</div>' + cuerpo + '</div>'; };
  const fila = function (k, v) { return v ? '<tr><td style="padding:4px 14px 4px 0;color:#7a7c82;white-space:nowrap;vertical-align:top">' + esc(k) + '</td><td style="padding:4px 0"><b>' + esc(v) + '</b></td></tr>' : ''; };
  const html = '<div style="font-family:' + F + ';max-width:640px;margin:0 auto;color:#1c1c1e;font-size:15px;line-height:1.5">' +
    '<p style="color:#7a7c82;font-size:13px;margin:0 0 6px">Así te avisaría el sistema, en tu correo y en tu móvil, en el minuto siguiente a esta llamada.</p>' +
    '<h1 style="font-size:22px;margin:0 0 4px">Nuevo ' + esc(b.tipoCliente) + ' en ' + esc(b.negocio) + (x.nivel ? ' · nivel ' + esc(x.nivel) : '') + '</h1>' +
    '<p style="margin:0 0 14px;color:#7a7c82">' + esc(cuando) + ' · llamada de ' + dur + ' s atendida por ' + esc(b.agente) + '</p>' +
    caja('Ficha del lead', '<table style="border-collapse:collapse">' + fila('Nombre', d.nombre) + fila('Teléfono', d.telefono) + fila('Correo', d.email) + fila('Entró por', 'Llamada al teléfono de ' + b.negocio) + fila('Quería', x.que_queria) + fila('Puntuación', x.nivel ? x.nivel + ' · ' + (x.motivo_nivel || '') : '') + '</table>') +
    caja('Cita', x.cita ? '<b>' + esc(x.cita) + '</b><br><span style="color:#7a7c82">Confirmación enviada por WhatsApp al momento. Recordatorio automático el día antes y a las 9:00 del mismo día.</span>' : '<span style="color:#7a7c82">No se cerró cita en la llamada. El sistema le escribiría por WhatsApp en una hora con dos huecos para elegir.</span>') +
    caja('Lo que preguntó', lista(x.preguntas)) +
    caja('Datos que dio', lista(x.datos)) +
    caja('Resumen de la llamada', '<p style="margin:0">' + esc(x.resumen || L.summary || '') + '</p>' + (L.recordingUrl ? '<p style="margin:10px 0 0"><a href="' + esc(L.recordingUrl) + '" style="color:#1a56db">Escuchar la grabación</a></p>' : '')) +
    caja('Qué haría el sistema ahora', '<ol style="margin:0 0 0 18px;padding:0"><li style="margin:3px 0">' + esc(x.siguiente_paso || 'Confirmar la cita por WhatsApp.') + '</li><li style="margin:3px 0">Recordatorio el día antes y el mismo día a las 9:00, con lo que se va a ver en la visita.</li><li style="margin:3px 0">Si no viene: llamada de la agente y nuevo hueco, sin que nadie de tu equipo tenga que acordarse.</li><li style="margin:3px 0">Si pide presupuesto y no contesta: seguimiento al día 1, 4 y 10 con su contexto.</li></ol>') +
    '<div style="background:#f5f5f7;border-radius:10px;padding:16px 18px;margin:20px 0"><b>Esto ha sido una demostración con tu web.</b> La agente no sabía más que lo que hay publicado en ' + esc(b.web) + (b.fuente === 'sector' ? ' (no se ha podido leer la web, así que ha usado lo típico del sector)' : '') + '. Con tu agenda, tus precios y tu forma de hablar, es la que atiende de verdad. Si quieres verlo montado para tu caso, Maikel te lo enseña en media hora: <a href="https://qualivo.io/agenda" style="color:#1a56db">reserva aquí</a>.</div>' +
    '<p style="color:#7a7c82;font-size:12px">Qualivo · Maikel Echevarría · maikel@qualivo.io</p></div>';
  return { asunto: 'Nuevo ' + b.tipoCliente + ' en ' + b.negocio + (x.cita ? ' · cita ' + x.cita : '') + ' (demo)', html: html };
}

// Ficha de respaldo cuando el modelo no contesta: lo típico del sector, sin
// precios ni dirección, y el nombre sacado del dominio.
function briefSector(o) {
  const s = SECTORES[o.sector] || { que: 'negocio', cliente: 'cliente', citas: 'primera cita', ejemplos: 'servicios, precios, horarios' };
  const dominio = String(o.web || '').replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  const nombre = dominio.split('.')[0].replace(/[-_]/g, ' ').replace(/(^|\s)\S/g, function (m) { return m.toUpperCase(); }) || 'el negocio';
  return { negocio: nombre, resumen: 'Un ' + s.que + ' que atiende a sus ' + s.cliente + 's por teléfono y con cita previa.', servicios: s.ejemplos.split(', '), horario: '', ubicacion: '', tono: ['cercano', 'claro', 'profesional'], agente: 'Marina', preguntas: [], gancho: '', fuente: 'sector', sector: o.sector || '', web: dominio, tipoCliente: s.cliente, tipoCita: s.citas };
}

// Correo por Resend (la misma cuenta que los avisos). Devuelve false si no
// está configurado; nunca lanza.
async function enviarCorreo(o) {
  if (!process.env.RESEND_API_KEY) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.RADIOGRAFIA_FROM || 'Qualivo <onboarding@resend.dev>', to: [o.para], bcc: o.copia ? [o.copia] : undefined, subject: o.asunto, html: o.html })
    });
    return r.ok;
  } catch (e) { return false; }
}

module.exports = { briefSector: briefSector, enviarCorreo: enviarCorreo, leerWeb: leerWeb, brief: brief, lanzarLlamada: lanzarLlamada, llamada: llamada, extraer: extraer, correoDueno: correoDueno, promptLlamada: promptLlamada, normalizarUrl: normalizarUrl };
