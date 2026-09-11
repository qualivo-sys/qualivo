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
    if (t.dia === 0 || t.dia === 6) return false;
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

function tiene(contacto, etiqueta) {
  return (contacto.tags || []).some(function (t) { return String(t).toLowerCase() === etiqueta; });
}

function minutosDesde(iso) {
  const t = Date.parse(iso);
  return isFinite(t) ? (Date.now() - t) / 60000 : Infinity;
}

module.exports = {
  GHL_BASE, GHL_VERSION, cabeceras, ahoraMadrid, enVentana, buscarPorEtiqueta,
  etiquetar, nota, enviarWhatsApp, lanzarLlamada, telefonoE164, tiene, minutosDesde
};
