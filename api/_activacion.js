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

// La pasarela de WhatsApp de la cuenta (Wazzap, «WhatsApp Gateway»): en GHL
// está dada de alta como proveedor de SMS, así que un mensaje de tipo SMS sale
// por ella COMO WHATSAPP desde el número conectado, sin plantillas ni ventana
// de 24 h. Hasta el 19-sep se creía que esto era un SMS de verdad y se apagó
// («por SMS nunca»); Maikel lo desveló ese día y es la vía para el primer
// mensaje y las confirmaciones. Los mensajes que salen por aquí aparecen en
// GHL como TYPE_CUSTOM_SMS con este proveedor.
const GATEWAY_PROVIDER = '67ad23a0cf352d8f5809f0ca';

async function enviarPorGateway(contactId, texto) {
  const r = await fetch(GHL_BASE + '/conversations/messages', {
    method: 'POST',
    headers: cabeceras(),
    body: JSON.stringify({ type: 'SMS', contactId: contactId, message: texto })
  });
  if (!r.ok) throw new Error('ghl_gateway ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json().catch(function () { return {}; });
}
const enviarSMS = enviarPorGateway; // nombre antiguo

// Un mensaje de GHL es de WhatsApp si salió por la API oficial o por la pasarela.
function esWhatsApp(m) {
  const t = String((m && m.messageType) || '');
  if (/WHATSAPP/i.test(t)) return true;
  return /CUSTOM_SMS/i.test(t) && String((m && m.conversationProviderId) || '') === GATEWAY_PROVIDER;
}

async function estadoMensaje(messageId) {
  try {
    const r = await fetch(GHL_BASE + '/conversations/messages/' + messageId, { headers: cabeceras() });
    if (!r.ok) return '';
    const d = await r.json();
    const m = (d && d.message) || d || {};
    // GHL a veces rellena «error» antes de cambiar «status».
    if (m.error) return 'failed';
    return String(m.status || '');
  } catch (err) {
    return '';
  }
}

function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// WhatsApp solo deja escribir primero dentro de las 24 horas siguientes al
// último mensaje del contacto. Fuera de esa ventana, y sin una plantilla
// aprobada por Meta, el mensaje se acepta por API y luego queda en «failed»
// sin avisar a nadie: el lead se pierde en silencio. Por eso se comprueba el
// estado y, si ha fallado, el mismo texto sale por la pasarela de WhatsApp
// (Wazzap), que no tiene ventana de 24 h. El 18-sep se apagó creyendo que era
// un SMS («por SMS nunca»); el 19-sep Maikel aclaró que es WhatsApp y se
// volvió a encender. Se apaga con PERMITIR_GATEWAY=0; entonces se devuelve
// canal 'whatsapp_fallido' y quien llama decide.
const GATEWAY_PERMITIDO = process.env.PERMITIR_GATEWAY !== '0';

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
    if (estado && estado.toLowerCase() !== 'failed') return { canal: 'whatsapp', estado: estado, id: idWa };
  }
  if (!GATEWAY_PERMITIDO) return { canal: 'whatsapp_fallido', estado: 'failed', id: idWa };
  // Fuera de la ventana de 24 h (o número que la API oficial no entrega), el
  // mismo texto sale por la pasarela como WhatsApp normal.
  const g = await enviarPorGateway(contactId, texto);
  return { canal: 'gateway', estado: 'enviado', id: (g && (g.messageId || g.msgId)) || '' };
}

// Campos personalizados del contacto que usan los workflows de GHL para
// rellenar las plantillas de WhatsApp (plan B cuando Meta no deja enviar desde
// nuestra app: el workflow «etiqueta añadida → plantilla» lo manda GHL con
// estos valores). Ids de la location bHGMuZEGUESZmVoNv9HT, creados el 18-sep.
const CAMPOS_WA = {
  loQueEscribio: '3ipqSYlrbxkAEO7RrIPs', // WA · Lo que escribió
  pregunta: 'Jk5jLEChMdSOe8eQPJLZ',      // WA · Pregunta
  citaDia: '88tSGYs0YkoeIkrd8JLZ',       // Cita · Día
  citaHora: 'ZyZvyw77Q3FtyGnhK1qO',      // Cita · Hora
  citaEnlace: 'Fm1hDYlKR02hS8khPJ99'     // Cita · Enlace
};
// Lee del contacto los valores que guardó camposWA.
function leerCamposWA(contacto) {
  const out = {};
  const campos = (contacto && contacto.customFields) || [];
  Object.keys(CAMPOS_WA).forEach(function (k) {
    const f = campos.filter(function (x) { return x && (x.id === CAMPOS_WA[k]); })[0];
    if (f) out[k] = f.value || f.field_value || '';
  });
  return out;
}

async function camposWA(contactId, valores) {
  const customFields = Object.keys(valores || {}).filter(function (k) { return CAMPOS_WA[k] && valores[k] != null; })
    .map(function (k) { return { id: CAMPOS_WA[k], field_value: String(valores[k]).slice(0, 500) }; });
  if (!customFields.length) return false;
  const r = await fetch(GHL_BASE + '/contacts/' + contactId, {
    method: 'PUT', headers: cabeceras(), body: JSON.stringify({ customFields: customFields })
  });
  return r.ok;
}

// Primer WhatsApp a un lead que nunca nos ha escrito. Si la plantilla de Meta
// está configurada y aprobada, sale por ella (es la única vía que Meta acepta
// fuera de la ventana de 24 h); si no, por GHL con respaldo SMS como siempre.
// datos: { nombre, cita (lo que escribió o el tema), pregunta, texto (versión libre) }
async function primerWhatsApp(contactId, telefono, datos) {
  // Los valores de la plantilla se dejan en el contacto pase lo que pase: los
  // lee el workflow de GHL y sirven para ver qué se le dijo.
  try { await camposWA(contactId, { loQueEscribio: datos.cita || 'el diagnóstico', pregunta: datos.pregunta || '' }); } catch (e) { /* no bloquea */ }
  try {
    const WA = require('./_whatsapp.js');
    if (WA.configurado() && telefono) {
      const r = await WA.enviarPlantilla(telefono, WA.PLANTILLAS.primerContacto,
        [datos.nombre || 'hola', datos.cita || 'el diagnóstico', datos.pregunta || '']);
      if (r.ok) return { canal: 'plantilla', estado: 'enviado', id: r.id };
      console.warn('[activacion] plantilla primer contacto no salió (' + r.motivo + '); sigo por GHL');
    }
  } catch (e) { console.warn('[activacion] plantilla:', e && e.message); }
  const env = await enviarMensaje(contactId, datos.texto);
  // Meta no deja escribir primero y nuestra app no puede mandar la plantilla:
  // la etiqueta dispara el workflow de GHL que sí puede (plantilla
  // qualivo_primer_contacto con los campos WA · …).
  if (env.canal === 'whatsapp_fallido') await etiquetar(contactId, ['wa-primer-contacto']).catch(function () {});
  return env;
}

// Todos los mensajes de un contacto, de más antiguo a más nuevo.
async function mensajesDe(contactId) {
  const r = await fetch(GHL_BASE + '/conversations/search?locationId=' +
    encodeURIComponent(process.env.GHL_LOCATION_ID) + '&contactId=' + contactId, { headers: cabeceras() });
  if (!r.ok) return [];
  const d = await r.json().catch(function () { return {}; });
  const todos = [];
  for (const c of (d.conversations || [])) {
    const m = await fetch(GHL_BASE + '/conversations/' + c.id + '/messages?limit=50', { headers: cabeceras() });
    if (!m.ok) continue;
    const dm = await m.json().catch(function () { return {}; });
    const lista = (dm.messages && dm.messages.messages) || dm.messages || [];
    todos.push.apply(todos, Array.isArray(lista) ? lista : []);
  }
  return todos.sort(function (a, b) { return Date.parse(a.dateAdded || 0) - Date.parse(b.dateAdded || 0); });
}

// El fallo del WhatsApp por la ventana de 24 h no siempre llega en los cinco
// segundos que espera enviarMensaje. El 17-sep a las 00:12 un lead de reformas
// se quedó sin nada: el WhatsApp cayó en «failed» siete segundos después de
// salir, la comprobación ya había pasado, y el SMS de respaldo nunca se envió.
// Esto lo mira el reloj en cada vuelta: cualquier WhatsApp saliente fallido que
// no tenga ya el mismo texto enviado por SMS, se manda por SMS.
// Solo mira los WhatsApp de esta cadencia (desde `desdeMs`): sin ese corte, la
// primera vuelta reenvió por SMS pruebas fallidas de hace días.
async function reenviarFallidos(contactId, desdeMs) {
  if (!GATEWAY_PERMITIDO) return 0;
  const msgs = await mensajesDe(contactId);
  const salientes = msgs.filter(function (m) { return String(m.direction) === 'outbound'; });
  const corte = (desdeMs || 0) - 10 * 60000;
  let enviados = 0;
  for (const m of salientes) {
    if (!/WHATSAPP/i.test(String(m.messageType || ''))) continue;
    if (Date.parse(m.dateAdded || 0) < corte) continue;
    if (String(m.status || '').toLowerCase() !== 'failed' && !m.error) continue;
    const cuerpo = String(m.body || '').trim();
    if (!cuerpo) continue;
    const yaPorGateway = salientes.some(function (x) {
      return /SMS/i.test(String(x.messageType || '')) && String(x.body || '').trim() === cuerpo;
    });
    if (yaPorGateway) continue;
    await enviarPorGateway(contactId, cuerpo);
    enviados++;
  }
  return enviados;
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

// Envio de correo suelto, para lo que no va por la cadencia del reloj (hoy, el
// correo del minuto cero). Devuelve el motivo en vez de lanzar: quien lo llama
// esta a mitad de dar de alta un lead y no puede romperse por esto.
async function enviarCorreo(email, asunto, html) {
  if (!process.env.RESEND_API_KEY) return { ok: false, motivo: 'sin_resend' };
  if (!email) return { ok: false, motivo: 'sin_email' };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RADIOGRAFIA_FROM || 'Maikel de Qualivo <onboarding@resend.dev>',
        to: [email], subject: asunto, html: html
      })
    });
    return { ok: r.ok, motivo: r.ok ? '' : 'resend_' + r.status };
  } catch (e) {
    return { ok: false, motivo: 'fetch_' + (e && e.message) };
  }
}

module.exports = {
  GHL_BASE, GHL_VERSION, cabeceras, ahoraMadrid, enVentana, buscarPorEtiqueta, enviarCorreo,
  etiquetar, nota, enviarWhatsApp, enviarSMS, enviarPorGateway, esWhatsApp, GATEWAY_PROVIDER, enviarMensaje, primerWhatsApp, camposWA, leerCamposWA, CAMPOS_WA, estadoMensaje, mensajesDe, reenviarFallidos,
  lanzarLlamada, telefonoE164, tiene, minutosDesde, revisarRespuesta, tieneCitaGHL, BAJA
};
