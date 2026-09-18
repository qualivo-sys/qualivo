// Herramienta de agenda del agente de voz. La llama Vapi cuando el contacto
// acepta una hora, crea la cita en GHL y devuelve a Vapi lo que Raquel tiene que
// decir a continuación.
//
// Existe porque el workflow de n8n al que apuntaba el asistente contesta 200 con
// el cuerpo vacío, y Vapi entonces registra «No result returned»: la llamada
// seguía como si nada y no se creaba ninguna cita. Además ese workflow es de
// otra campaña, así que compartirlo significaba pisarse los huecos.
//
// Se protege con un token en la URL (?k=...), que es lo que Vapi puede mandar
// sin configuración extra.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const CALENDARIO = 'zBlsw8BEKA2zah81YlOl';
// Duración por si no se puede leer el calendario. La cita dura lo que diga el
// calendario, no lo que diga este archivo: el 18-sep el calendario estaba en
// huecos de 30 minutos y aquí se pedían 15, GHL contestaba «Selected slot
// duration is not a valid duration option» (400) y Raquel le decía al lead que
// el hueco «ya no estaba disponible» aunque acababa de ofrecérselo.
const DURACION_MIN = 30;

let duracionCache = { valor: 0, hasta: 0 };
async function duracionCalendario() {
  if (duracionCache.valor && Date.now() < duracionCache.hasta) return duracionCache.valor;
  try {
    const cal = process.env.AGENDA_CALENDARIO || CALENDARIO;
    const r = await fetch(GHL_BASE + '/calendars/' + cal, { headers: cabeceras() });
    if (!r.ok) return DURACION_MIN;
    const d = await r.json();
    const c = (d && d.calendar) || {};
    let min = Number(c.slotDuration || 0);
    if (String(c.slotDurationUnit || 'mins').startsWith('hour')) min = min * 60;
    if (min > 0) duracionCache = { valor: min, hasta: Date.now() + 10 * 60000 };
    return min > 0 ? min : DURACION_MIN;
  } catch (e) { return DURACION_MIN; }
}
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function cabeceras() {
  return {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };
}

function respuesta(res, toolCallId, texto) {
  return res.status(200).json({ results: [{ toolCallId: toolCallId || 'sin-id', result: texto }] });
}

// El modelo no sabe en qué día vive: si le llega «2023-09-12» hay que corregir
// el año antes de crear nada, o la cita se va tres años atrás y nadie la ve.
function corregirFecha(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const ahora = new Date();
  if (d.getTime() < ahora.getTime() - 60 * 60 * 1000) {
    d.setFullYear(ahora.getFullYear());
    if (d.getTime() < ahora.getTime() - 60 * 60 * 1000) d.setFullYear(ahora.getFullYear() + 1);
  }
  return d;
}

// Huecos reales del calendario. Sin esto el agente propone horas a ojo, el
// calendario las rechaza una tras otra y la llamada entra en bucle: pasó en la
// prueba del 11-sep, con el calendario pidiendo un día de aviso y el agente
// ofreciendo la tarde de hoy.
async function huecosLibres(limite) {
  const ini = Date.now();
  const fin = ini + 10 * 24 * 3600 * 1000;
  const cal = process.env.AGENDA_CALENDARIO || CALENDARIO;
  const r = await fetch(GHL_BASE + '/calendars/' + cal + '/free-slots?startDate=' + ini +
    '&endDate=' + fin + '&timezone=Europe%2FMadrid', { headers: cabeceras() });
  if (!r.ok) return [];
  const d = await r.json().catch(function () { return {}; });
  const dias = Object.keys(d).filter(function (k) { return d[k] && d[k].slots; }).sort();
  const fuera = [];
  // Uno por franja para no cantarle quince horas seguidas: primero de la mañana
  // y primero de la tarde de cada día.
  for (const dia of dias) {
    let manana = null, tarde = null;
    for (const s of d[dia].slots) {
      const h = parseInt(String(s).slice(11, 13), 10);
      if (h < 14 && !manana) manana = s;
      if (h >= 14 && !tarde) tarde = s;
    }
    if (manana) fuera.push(manana);
    if (tarde) fuera.push(tarde);
    if (fuera.length >= (limite || 4)) break;
  }
  return fuera.slice(0, limite || 4);
}

function enPalabras(iso) {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(iso));
}

async function buscarContacto(email, telefono) {
  const filtros = [];
  if (EMAIL_RE.test(email)) filtros.push({ field: 'email', operator: 'eq', value: email });
  if (!filtros.length && telefono) filtros.push({ field: 'phone', operator: 'eq', value: telefono });
  if (!filtros.length) return null;
  const r = await fetch(GHL_BASE + '/contacts/search', {
    method: 'POST', headers: cabeceras(),
    body: JSON.stringify({ locationId: process.env.GHL_LOCATION_ID, pageLimit: 1, filters: filtros })
  });
  if (!r.ok) return null;
  const d = await r.json();
  return (d.contacts || [])[0] || null;
}

// Reserva la cita y dispara todo lo que sigue (confirmación, trato, aviso,
// evento a Meta). La usan Raquel (por el handler de abajo) y el agente de
// WhatsApp (api/_agente.js). Devuelve { ok, hora } o { ok:false, motivo,
// libres } donde motivo es 'ocupado' o 'error'.
async function reservar(o) {
  const contacto = o.contacto;
  const inicio = o.inicio;
  const fin = new Date(inicio.getTime() + (await duracionCalendario()) * 60000);
  const cita = await fetch(GHL_BASE + '/calendars/events/appointments', {
    method: 'POST', headers: cabeceras(),
    body: JSON.stringify({
      calendarId: process.env.AGENDA_CALENDARIO || CALENDARIO,
      locationId: process.env.GHL_LOCATION_ID,
      contactId: contacto.id,
      startTime: inicio.toISOString(),
      endTime: fin.toISOString(),
      // El nombre del CRM manda sobre el que dicta el modelo: en la prueba del
      // 18-sep la cita se creó como «Michael» porque el modelo copia el nombre
      // tal como lo transcribe de su propia voz.
      title: 'Diagnóstico de crecimiento · ' + (contacto.firstName || contacto.contactName || o.nombre || ''),
      // La sala fija de Meet, para que la invitación del calendario lleve el enlace.
      address: process.env.AGENDA_ENLACE || require('./_cita.js').ENLACE_FIJO,
      appointmentStatus: 'confirmed',
      ignoreFreeSlotValidation: false,
      toNotify: true
    })
  });
  if (!cita.ok) {
    const detalle = (await cita.text()).slice(0, 300);
    console.error('[agendar] GHL rechazó la cita', cita.status, detalle);
    // Solo es «hueco ocupado» si GHL lo dice; cualquier otro 400 es un fallo
    // nuestro y no hay que culpar a la agenda delante del lead.
    const ocupado = /slot|available|disponib|busy|booked|overlap/i.test(detalle) && !/duration/i.test(detalle);
    if ((cita.status === 400 || cita.status === 422) && ocupado) {
      return { ok: false, motivo: 'ocupado', libres: await huecosLibres(3) };
    }
    return { ok: false, motivo: 'error' };
  }

  // Se para la cadencia, el trato pasa a «Reunión agendada», se avisa a Maikel,
  // sale el evento «Schedule» a Meta y el cliente recibe la confirmación por
  // WhatsApp. Todo en _cita.js; aquí solo se dispara.
  await require('./_cita.js').confirmarCita({
    contactId: contacto.id, inicio: inicio, origen: o.origen || 'agenda', fuente: o.fuente || ''
  });
  if (o.contexto) {
    await fetch(GHL_BASE + '/contacts/' + contacto.id + '/notes', {
      method: 'POST', headers: cabeceras(),
      body: JSON.stringify({ body: 'Agendado por ' + (o.origen || 'el agente') + '\n\n' + o.contexto + '\n\nHora: ' + inicio.toISOString() })
    }).catch(function () {});
  }
  console.log('[agendar] cita creada', contacto.id, inicio.toISOString());
  return { ok: true, hora: enPalabras(inicio.toISOString()) };
}

async function handler(req, res) {
  // El token puede venir en la query ya parseada, en la URL cruda o en cabecera.
  let recibido = (req.query && req.query.k) || req.headers['x-agenda-secret'] || '';
  if (!recibido && req.url) {
    const m = String(req.url).match(/[?&]k=([^&]+)/);
    if (m) recibido = decodeURIComponent(m[1]);
  }
  const esperado = process.env.AGENDA_SECRET;
  if (!esperado) {
    console.error('[agendar] falta AGENDA_SECRET en el entorno');
    return res.status(500).json({ ok: false, error: 'not_configured' });
  }
  if (String(recibido) !== esperado) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const cuerpo = req.body || {};
  const llamada = (((cuerpo.message || {}).toolCalls) || [])[0] || {};
  const toolCallId = llamada.id;
  const funcion = String((llamada.function || {}).name || '');
  let args = (llamada.function || {}).arguments || cuerpo;
  if (typeof args === 'string') { try { args = JSON.parse(args); } catch (e) { args = {}; } }

  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) {
    console.error('[agendar] falta GHL_API_KEY o GHL_LOCATION_ID');
    return respuesta(res, toolCallId, 'No puedo mirar la agenda ahora. Dile que Maikel le manda el enlace enseguida.');
  }

  // Consulta de huecos: se llama antes de proponer nada.
  if (funcion === 'huecos_disponibles' || args.solo_consultar) {
    const libres = await huecosLibres(4);
    if (!libres.length) {
      return respuesta(res, toolCallId, 'No veo huecos en los próximos días. Dile que Maikel le escribe con opciones.');
    }
    return respuesta(res, toolCallId, 'Huecos libres, ofrécele dos de estos: ' +
      libres.map(enPalabras).join(' · '));
  }

  const nombre = String(args.nombre || '').trim().slice(0, 120);
  let email = String(args.email || '').trim().toLowerCase().slice(0, 160);
  // El email dictado por teléfono se transcribe fatal: en la prueba del 11-sep
  // «maikel@equipzilla.com» llegó como «maike@equillazilla.com». Si tenemos el
  // del formulario, ese manda: el de la llamada solo sirve para confirmarlo.
  const emailFiable = String(args.email_conocido || '').trim().toLowerCase().slice(0, 160);
  if (EMAIL_RE.test(emailFiable)) email = emailFiable;
  const telefono = String(args.telefono || '').replace(/[^\d+]/g, '').slice(0, 20);
  const contexto = String(args.contexto || args.fuga || '').trim().slice(0, 900);

  const inicio = corregirFecha(args.slot || args.fecha || args.startTime);
  if (!inicio) {
    return respuesta(res, toolCallId, 'No me ha quedado clara la hora. Pregúntasela otra vez y dímela con el día.');
  }

  try {
    let contacto = await buscarContacto(email, telefono);
    if (!contacto) {
      const up = await fetch(GHL_BASE + '/contacts/upsert', {
        method: 'POST', headers: cabeceras(),
        body: JSON.stringify({
          locationId: process.env.GHL_LOCATION_ID,
          name: nombre || email || telefono,
          email: EMAIL_RE.test(email) ? email : undefined,
          phone: telefono || undefined,
          source: 'Agente de voz — diagnóstico',
          tags: ['diagnostico-landing', 'act-agendado']
        })
      });
      if (up.ok) {
        const d = await up.json().catch(function () { return {}; });
        contacto = d.contact || null;
      }
    }
    if (!contacto || !contacto.id) {
      console.error('[agendar] sin contacto para', email || telefono);
      return respuesta(res, toolCallId, 'No he podido reservarlo. Pídele el email otra vez, letra por letra.');
    }

    const r = await reservar({
      contacto: contacto, inicio: inicio, nombre: nombre, contexto: contexto,
      origen: 'Raquel', fuente: 'Agente de voz — diagnóstico'
    });
    if (!r.ok && r.motivo === 'ocupado') {
      if (r.libres && r.libres.length) {
        return respuesta(res, toolCallId, 'Ese hueco no está libre. NO propongas otro a ojo: ' +
          'ofrécele exactamente uno de estos, que sí lo están: ' + r.libres.map(enPalabras).join(' · '));
      }
      return respuesta(res, toolCallId, 'Ese hueco no está libre y no veo otros. Dile que Maikel le escribe con opciones.');
    }
    if (!r.ok) return respuesta(res, toolCallId, 'No he podido reservarlo ahora. Dile que Maikel le manda el enlace en un momento.');
    return respuesta(res, toolCallId, 'Reservado para el ' + r.hora + '. Confírmaselo y dile que le llega la invitación al correo.');
  } catch (err) {
    console.error('[agendar] error inesperado:', err && err.message);
    return respuesta(res, toolCallId, 'No he podido reservarlo ahora. Dile que Maikel le escribe enseguida.');
  }
}

module.exports = handler;
module.exports.huecosLibres = huecosLibres;
module.exports.enPalabras = enPalabras;
module.exports.corregirFecha = corregirFecha;
module.exports.reservar = reservar;
