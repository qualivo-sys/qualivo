// Piezas compartidas de la capa de activación: CRM, WhatsApp, voz y ventanas
// horarias. El estado vive en etiquetas de GHL; aquí no se guarda nada.
// Documentado en captacion/recorrido-activacion-v2.md.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const VAPI_BASE = 'https://api.vapi.ai';
const NUMERO_SALIENTE = 'b60821ae-39fc-46b3-b8f8-23ee593ee6fd'; // Vapi BYO · +34 647118491

function cabeceras() {
  return {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };
}

// Hora local de Madrid sin dependencias: Intl da el desfase real, incluido verano.
function ahoraMadrid(fecha) {
  const d = fecha || new Date();
  const p = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(d).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
  const dias = { 'lun': 1, 'mar': 2, 'mié': 3, 'jue': 4, 'vie': 5, 'sáb': 6, 'dom': 0 };
  return {
    hora: parseInt(p.hour, 10),
    minuto: parseInt(p.minute, 10),
    dia: dias[String(p.weekday).toLowerCase().replace('.', '')],
    minutos: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10)
  };
}

// WhatsApp es asíncrono y se lee cuando se puede; la voz interrumpe, así que
// tiene la ventana más estrecha y solo entre semana.
function enVentana(canal, fecha) {
  const t = ahoraMadrid(fecha);
  if (canal === 'whatsapp') return t.minutos >= 8 * 60 && t.minutos <= 21 * 60 + 30;
  if (canal === 'voz') {
    if (t.dia === 0) return false;                       // domingo nunca
    // Sábado solo por la mañana. El histórico de la cuenta dice que el fin de
    // semana capta a la mitad de precio, así que dejar esos leads sin llamada
    // hasta el lunes es tirar el dinero que costó traerlos. Pero llamar a un
    // empresario un domingo, o un sábado por la tarde, es pasarse.
    if (t.dia === 6) return t.minutos >= 10 * 60 && t.minutos < 14 * 60;
    const manana = t.minutos >= 9 * 60 + 30 && t.minutos < 14 * 60;
    const tarde = t.minutos >= 16 * 60 && t.minutos < 20 * 60;
    return manana || tarde;
  }
  return true;
}

async function buscarPorEtiqueta(etiqueta, limite) {
  const contactos = [];
  let page = 1;
  while (page <= 10) {
    const r = await fetch(GHL_BASE + '/contacts/search', {
      method: 'POST',
      headers: cabeceras(),
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID,
        page: page,
        pageLimit: 100,
        filters: [{ field: 'tags', operator: 'contains', value: etiqueta }]
      })
    });
    if (!r.ok) throw new Error('ghl_search ' + r.status + ' ' + (await r.text()).slice(0, 200));
    const d = await r.json();
    const lote = d.contacts || [];
    contactos.push.apply(contactos, lote);
    if (lote.length < 100 || contactos.length >= (limite || 500)) break;
    page++;
  }
  return contactos;
}

async function etiquetar(contactId, anadir, quitar) {
  const cuerpo = {};
  if (anadir && anadir.length) cuerpo.tags = anadir;
  if (quitar && quitar.length) {
    await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', {
      method: 'DELETE', headers: cabeceras(), body: JSON.stringify({ tags: quitar })
    }).catch(function () {});
  }
  if (!cuerpo.tags) return true;
  const r = await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', {
    method: 'POST', headers: cabeceras(), body: JSON.stringify(cuerpo)
  });
  return r.ok;
}

async function nota(contactId, texto) {
  const r = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
    method: 'POST', headers: cabeceras(), body: JSON.stringify({ body: texto })
  });
  return r.ok;
}

// El primer mensaje sale por la API de conversaciones de GHL, con el número de
// WhatsApp de la location. Las respuestas las atiende el agente ya montado allí.
async function enviarWhatsApp(contactId, texto) {
  const r = await fetch(GHL_BASE + '/conversations/messages', {
    method: 'POST',
    headers: cabeceras(),
    body: JSON.stringify({ type: 'WhatsApp', contactId: contactId, message: texto })
  });
  if (!r.ok) throw new Error('ghl_whatsapp ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json().catch(function () { return {}; });
}

async function enviarSMS(contactId, texto) {
  const r = await fetch(GHL_BASE + '/conversations/messages', {
    method: 'POST',
    headers: cabeceras(),
    body: JSON.stringify({ type: 'SMS', contactId: contactId, message: texto })
  });
  if (!r.ok) throw new Error('ghl_sms ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json().catch(function () { return {}; });
}

async function estadoMensaje(messageId) {
  try {
    const r = await fetch(GHL_BASE + '/conversations/messages/' + messageId, { headers: cabeceras() });
    if (!r.ok) return '';
    const d = await r.json();
    return String(((d && d.message) || d || {}).status || '');
  } catch (err) {
    return '';
  }
}

function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// WhatsApp solo deja escribir primero dentro de las 24 horas siguientes al
// último mensaje del contacto. Fuera de esa ventana, y sin una plantilla
// aprobada por Meta, el mensaje se acepta por API y luego queda en «failed»
// sin avisar a nadie: el lead se pierde en silencio. Por eso se comprueba el
// estado y, si ha fallado, el mismo texto sale por SMS.
async function enviarMensaje(contactId, texto) {
  let idWa = '';
  try {
    const r = await enviarWhatsApp(contactId, texto);
    idWa = (r && (r.messageId || r.msgId)) || '';
  } catch (err) {
    idWa = '';
  }
  if (idWa) {
    await esperar(5000);
    const estado = await estadoMensaje(idWa);
    if (estado && estado.toLowerCase() !== 'failed') return { canal: 'whatsapp', estado: estado };
  }
  await enviarSMS(contactId, texto);
  return { canal: 'sms', estado: 'enviado' };
}

// Teléfono a E.164 español. Sin prefijo y con nueve dígitos se asume España;
// cualquier otra cosa se devuelve como está para no inventar un número.
function telefonoE164(valor) {
  const s = String(valor || '').replace(/[^\d+]/g, '');
  if (!s) return '';
  if (s.startsWith('+')) return s;
  if (s.startsWith('00')) return '+' + s.slice(2);
  if (s.startsWith('34') && s.length === 11) return '+' + s;
  if (s.length === 9) return '+34' + s;
  return '';
}

// Saliente: el asistente va en cada llamada, así que el mismo número lo pueden
// usar varias campañas sin pisarse. Los entrantes no se tocan.
async function lanzarLlamada(datos) {
  const clave = process.env.VAPI_API_KEY;
  const asistente = process.env.VAPI_ASSISTANT_ID;
  if (!clave || !asistente) return { ok: false, motivo: 'sin_credenciales' };

  const numero = telefonoE164(datos.telefono);
  if (!numero) return { ok: false, motivo: 'telefono_invalido' };

  const r = await fetch(VAPI_BASE + '/call', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assistantId: asistente,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID || NUMERO_SALIENTE,
      customer: { number: numero, name: datos.nombre || undefined },
      assistantOverrides: { variableValues: datos.contexto || {} }
    })
  });
  if (!r.ok) return { ok: false, motivo: 'vapi_' + r.status, detalle: (await r.text()).slice(0, 200) };
  const d = await r.json().catch(function () { return {}; });
  return { ok: true, id: d.id };
}

// Detecta si el contacto ha contestado, sin depender de que GHL tenga un
// workflow puesto. Devuelve qué hacer: parar la cadencia porque ha respondido,
// o darle de baja si lo ha pedido con todas las letras.
const BAJA = /\b(baja|d[ae]r?me de baja|no me interesa|no estoy interesad|dejad?me? en paz|stop|unsubscribe|no escrib|no vuelvas a|no quiero)\b/i;

async function revisarRespuesta(contactId, desdeMs) {
  try {
    const r = await fetch(GHL_BASE + '/conversations/search?locationId=' +
      encodeURIComponent(process.env.GHL_LOCATION_ID) + '&contactId=' + contactId,
      { headers: cabeceras() });
    if (!r.ok) return { respondio: false };
    const d = await r.json();
    const convs = d.conversations || [];
    let respondio = false, texto = '';
    for (const c of convs) {
      const fecha = Number(c.lastMessageDate || 0);
      if (String(c.lastMessageDirection) === 'inbound' && fecha >= (desdeMs || 0)) {
        respondio = true;
        texto = String(c.lastMessageBody || '');
      }
      // Un WhatsApp entrante posterior al arranque también cuenta como respuesta.
      const wa = Number(c.lastInboundWhatsappMessageDate || 0);
      if (wa && wa >= (desdeMs || 0)) respondio = true;
    }
    return { respondio: respondio, baja: BAJA.test(texto), texto: texto.slice(0, 200) };
  } catch (err) {
    return { respondio: false };
  }
}

async function tieneCitaGHL(contactId) {
  try {
    const r = await fetch(GHL_BASE + '/contacts/' + contactId + '/appointments', { headers: cabeceras() });
    if (!r.ok) return false;
    const d = await r.json();
    return (d.events || d.appointments || []).some(function (e) {
      return !/cancelled|noshow/i.test(String(e.appointmentStatus || ''));
    });
  } catch (err) {
    return false;
  }
}

function tiene(contacto, etiqueta) {
  return (contacto.tags || []).some(function (t) { return String(t).toLowerCase() === etiqueta; });
}

function minutosDesde(iso) {
  const t = Date.parse(iso);
  return isFinite(t) ? (Date.now() - t) / 60000 : Infinity;
}

module.exports = {
  GHL_BASE, GHL_VERSION, cabeceras, ahoraMadrid, enVentana, buscarPorEtiqueta,
  etiquetar, nota, enviarWhatsApp, enviarSMS, enviarMensaje, estadoMensaje,
  lanzarLlamada, telefonoE164, tiene, minutosDesde, revisarRespuesta, tieneCitaGHL, BAJA
};
