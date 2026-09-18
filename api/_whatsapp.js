// WhatsApp por la Cloud API de Meta, directo, sin pasar por GoHighLevel.
//
// Por qué existe: la API de WhatsApp solo deja escribir en texto libre dentro
// de las 24 horas siguientes al último mensaje del cliente. Un lead que acaba
// de rellenar un formulario nunca nos ha escrito, así que el primer WhatsApp
// (y la confirmación de cita) los rechaza Meta y se pierden en silencio (18-sep:
// Cesar se quedó sin mensaje toda la noche). La única vía para escribir primero
// es una PLANTILLA aprobada por Meta, y GoHighLevel no deja mandarlas por API
// con variables. Por eso las plantillas salen desde aquí.
//
// Configuración (Vercel): META_WA_PHONE_ID (id del número en la cuenta de
// WhatsApp Business) y META_WA_TOKEN (si no está, se usa META_LEADFORM_TOKEN,
// que ya tiene permiso whatsapp_business_messaging). Sin META_WA_PHONE_ID este
// módulo dice «no configurado» y quien lo llama sigue por GHL (WhatsApp y, si
// falla, SMS): nunca bloquea nada.
//
// Las plantillas y sus variables tienen que coincidir letra por letra con lo
// aprobado en Meta. Nombres de plantilla en PLANTILLAS.

const GRAPH = 'https://graph.facebook.com/v21.0';

const PLANTILLAS = {
  // Hola {{1}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y me ha
  // llamado la atención lo que has escrito: «{{2}}». Una pregunta antes de que
  // hablemos: {{3}}
  primerContacto: process.env.META_WA_PLANTILLA_PRIMERO || 'qualivo_primer_contacto',
  // Hola {{1}}, soy Maikel, de Qualivo. Confirmado: hablamos el {{2}} a las
  // {{3}}. Son quince minutos por videollamada; el enlace está en la invitación
  // que te ha llegado al correo. Voy a repasar contigo dónde se te está
  // escapando el negocio y te enseño un plan hecho para tu caso. Si te surge
  // algo antes, dímelo por aquí.
  confirmacionCita: process.env.META_WA_PLANTILLA_CITA || 'qualivo_confirmacion_cita'
};

function configurado() {
  return !!(process.env.META_WA_PHONE_ID && (process.env.META_WA_TOKEN || process.env.META_LEADFORM_TOKEN));
}

// Meta rechaza variables con saltos de línea, tabuladores o más de tres
// espacios seguidos, y las muy largas. Se limpian aquí para que una hipótesis
// escrita a lo loco en el formulario no tumbe el mensaje.
function variable(v, max) {
  return String(v == null ? '' : v).replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim().slice(0, max || 300) || '-';
}

function e164(valor) {
  const s = String(valor || '').replace(/[^\d+]/g, '');
  if (!s) return '';
  if (s.startsWith('+')) return s.slice(1);
  if (s.startsWith('00')) return s.slice(2);
  if (s.length === 9) return '34' + s;
  return s;
}

// Envía una plantilla. Devuelve { ok, id } o { ok:false, motivo }.
async function enviarPlantilla(telefono, nombre, variables, idioma) {
  if (!configurado()) return { ok: false, motivo: 'no_configurado' };
  const numero = e164(telefono);
  if (!numero) return { ok: false, motivo: 'telefono_invalido' };
  const token = process.env.META_WA_TOKEN || process.env.META_LEADFORM_TOKEN;
  const cuerpo = {
    messaging_product: 'whatsapp',
    to: numero,
    type: 'template',
    template: {
      name: nombre,
      language: { code: idioma || 'es' },
      components: (variables && variables.length)
        ? [{ type: 'body', parameters: variables.map(function (v) { return { type: 'text', text: variable(v) }; }) }]
        : []
    }
  };
  try {
    const r = await fetch(GRAPH + '/' + process.env.META_WA_PHONE_ID + '/messages', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo)
    });
    const d = await r.json().catch(function () { return {}; });
    if (!r.ok) {
      const msg = (d.error && d.error.message) || ('http ' + r.status);
      console.error('[whatsapp] plantilla ' + nombre + ' rechazada:', msg);
      return { ok: false, motivo: msg.slice(0, 200) };
    }
    return { ok: true, id: ((d.messages || [])[0] || {}).id || '' };
  } catch (e) {
    return { ok: false, motivo: 'fetch_' + (e && e.message) };
  }
}

module.exports = { PLANTILLAS, configurado, enviarPlantilla, variable };
