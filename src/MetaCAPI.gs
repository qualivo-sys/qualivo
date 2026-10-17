/**
 * MetaCAPI.gs
 * Conversions API (CAPI) para Lead Ads — devuelve a Meta el evento de lead
 * CUALIFICADO para que la campaña HackTheLead optimice sobre leads reales y no
 * sobre el volumen frío que entra por el formulario instantáneo.
 *
 * Arquitectura (decidida en el brief): la integración nativa Meta↔GHL trae el
 * lead a GoHighLevel; el workflow de knockout lo etiqueta `cualificado` y, solo
 * entonces, dispara un webhook a este proyecto (doPost en LeadWebhook.gs) que
 * llama a sendLeadEventToMeta(). Al mandar únicamente los cualificados, el
 * algoritmo aprende hacia leads buenos, no hacia leads anti-ICP.
 *
 * Credenciales (Script Properties):
 *   META_CAPI_TOKEN      - access token del dataset/píxel con permiso de CAPI
 *   META_DATASET_ID      - id del dataset (píxel) de la cuenta de Qualivo
 *   META_API_VERSION     - opcional (por defecto v21.0)
 *   META_TEST_EVENT_CODE - opcional: TESTxxxx para el QA en Events Manager
 *
 * Doc: https://developers.facebook.com/docs/marketing-api/conversions-api/guides/lead-ads
 */

var CAPI_DEFAULT_VERSION = 'v21.0';

/**
 * Envía un evento de lead a la Conversions API de Meta.
 *
 * Emparejamiento: si llega `leadId` (el leadgen_id de Meta, que la integración
 * nativa de GHL guarda con el contacto) se usa como match directo y no hace
 * falta PII. Si no, se cae a email/teléfono hasheados (SHA-256).
 *
 * @param {Object} lead
 *   - leadId        {string} leadgen_id de Meta [emparejamiento preferido]
 *   - email         {string}
 *   - phone         {string} cualquier formato; se normaliza a E.164 sin '+'
 *   - firstName     {string}
 *   - lastName      {string}
 *   - eventName     {string} por defecto 'Lead'
 *   - eventTime     {number} unix segundos; por defecto ahora
 *   - eventId       {string} para deduplicación con el píxel/web
 *   - fbc, fbp      {string} cookies de click/navegador si están disponibles
 *   - actionSource  {string} por defecto 'system_generated'
 *   - customData    {Object} datos opcionales del evento (p.ej. lead_event_source)
 *   - testEventCode {string} fuerza el code de test (si no, usa la prop)
 * @return {Object} respuesta de Graph API (incluye events_received / fbtrace_id)
 */
function sendLeadEventToMeta(lead) {
  if (!hasCreds('CAPI')) {
    throw new Error('Faltan credenciales CAPI (META_CAPI_TOKEN / META_DATASET_ID)');
  }
  lead = lead || {};

  var version = getProp('META_API_VERSION', CAPI_DEFAULT_VERSION);
  var dataset = getProp('META_DATASET_ID');
  var token = getProp('META_CAPI_TOKEN');

  var userData = {};
  if (lead.leadId) userData.lead_id = Number(lead.leadId) || lead.leadId;
  if (lead.email) userData.em = [sha256Hex(normalizeEmail(lead.email))];
  if (lead.phone) userData.ph = [sha256Hex(normalizePhone(lead.phone))];
  if (lead.firstName) userData.fn = [sha256Hex(normalizeName(lead.firstName))];
  if (lead.lastName) userData.ln = [sha256Hex(normalizeName(lead.lastName))];
  if (lead.fbc) userData.fbc = lead.fbc;
  if (lead.fbp) userData.fbp = lead.fbp;

  if (!userData.lead_id && !userData.em && !userData.ph) {
    throw new Error('El lead no trae lead_id ni email/teléfono: Meta no podría emparejarlo');
  }

  var event = {
    event_name: lead.eventName || 'Lead',
    event_time: lead.eventTime || Math.floor(Date.now() / 1000),
    action_source: lead.actionSource || 'system_generated',
    user_data: userData
  };
  if (lead.eventId) event.event_id = lead.eventId;
  if (lead.customData) event.custom_data = lead.customData;

  var payload = { data: [event] };
  var testCode = lead.testEventCode || getProp('META_TEST_EVENT_CODE');
  if (testCode) payload.test_event_code = testCode;

  var url = 'https://graph.facebook.com/' + version + '/' +
    encodeURIComponent(dataset) + '/events?access_token=' + encodeURIComponent(token);

  var res = httpJson(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
  logInfo('CAPI lead enviado', { event: event.event_name, leadId: lead.leadId || null, res: res });
  return res;
}

/* ----------------------------- Normalización ----------------------------- */
/* Meta exige minúsculas + trim antes de hashear. Teléfono solo dígitos (E.164
 * sin '+'); si llega un fijo/móvil español de 9 dígitos se le antepone 34.    */

function normalizeEmail(v) { return String(v).trim().toLowerCase(); }

function normalizeName(v) { return String(v).trim().toLowerCase(); }

function normalizePhone(v) {
  var digits = String(v).replace(/[^\d]/g, '');
  if (digits.length === 9) digits = '34' + digits; // móvil/fijo ES sin prefijo
  return digits;
}

/** SHA-256 en hex en minúsculas (formato que pide la CAPI para el PII). */
function sha256Hex(s) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(s), Utilities.Charset.UTF_8);
  var hex = '';
  for (var i = 0; i < bytes.length; i++) {
    var b = (bytes[i] + 256) % 256;
    hex += (b < 16 ? '0' : '') + b.toString(16);
  }
  return hex;
}
