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
// Configuración: el id del número va fijo abajo (META_WA_PHONE_ID lo
// sobreescribe) y el token es META_WA_TOKEN o, si no está, META_LEADFORM_TOKEN
// (usuario de sistema «Twin Integration», con whatsapp_business_messaging).
// Si una plantilla no está aprobada, Meta la rechaza, se registra y quien
// llama sigue por GHL: nunca bloquea nada. SMS no: orden de Maikel.
//
// Las plantillas y sus variables tienen que coincidir letra por letra con lo
// aprobado en Meta. Nombres de plantilla en PLANTILLAS.

const GRAPH = 'https://graph.facebook.com/v21.0';

// Plantillas SIN variables (18-sep-2026). GoHighLevel gestiona el número y no
// hay forma de mapear las variables de una plantilla desde la API, así que las
// que se usan de verdad son estas dos: texto fijo, cero variables, cero mapeo.
// La personalización vuelve en cuanto el lead contesta: ahí se abre la ventana
// de 24 h y el reloj manda el mensaje con sus palabras (whatsappTrasApertura).
const PLANTILLAS = {
  apertura: process.env.META_WA_PLANTILLA_APERTURA || 'qualivo_apertura',
  citaConfirmada: process.env.META_WA_PLANTILLA_CITA_FIJA || 'qualivo_cita_confirmada',
  // Hola {{1}}, soy Maikel, de Qualivo. Acabas de pedir el diagnóstico y me ha
  // llamado la atención lo que has escrito: «{{2}}». Una pregunta antes de que
  // hablemos: {{3}} Con eso te llamo ya con algo concreto.
  // (Meta no admite una variable al final de la plantilla.)
  primerContacto: process.env.META_WA_PLANTILLA_PRIMERO || 'qualivo_primer_contacto',
  // Hola {{1}}, soy Maikel, de Qualivo. Confirmado: hablamos el {{2}} a las
  // {{3}}. Son quince minutos por videollamada. Este es el enlace: {{4}}
  // (también lo tienes en la invitación del correo). Voy a repasar contigo
  // dónde se te está escapando el negocio y te enseño un plan hecho para tu
  // caso. Si te surge algo antes, dímelo por aquí.
  confirmacionCita: process.env.META_WA_PLANTILLA_CITA || 'qualivo_confirmacion_cita'
};

// Número +34 647 118 491 en la cuenta de WhatsApp Business de Qualivo (WABA
// 1488236355519674, Cloud API). META_WA_PHONE_ID en el entorno manda.
const PHONE_ID_FIJO = '842803652246178';
function phoneId() { return process.env.META_WA_PHONE_ID || PHONE_ID_FIJO; }

function configurado() {
  return !!(phoneId() && (process.env.META_WA_TOKEN || process.env.META_LEADFORM_TOKEN));
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
    const r = await fetch(GRAPH + '/' + phoneId() + '/messages', {
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
