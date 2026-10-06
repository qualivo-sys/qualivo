/**
 * LeadWebhook.gs
 * Web App que recibe el webhook de GoHighLevel (Workflow → acción "Webhook")
 * cuando un lead queda CUALIFICADO y reenvía el evento a la Conversions API de
 * Meta (MetaCAPI.gs). Es el único punto de código del flujo Meta→GHL: el resto
 * (mapeo de campos, knockout, secuencias) vive en los Workflows de GHL.
 *
 * Despliegue:
 *   Apps Script → Implementar → Nueva implementación → Aplicación web
 *     · Ejecutar como: yo (el propietario)
 *     · Quién tiene acceso: Cualquier usuario (anónimo)  ← GHL postea sin login
 *   Copia la URL .../exec y pégala en la acción Webhook del workflow de GHL.
 *   Menú: «Qualivo · Lead Form → Ver URL del webhook» te la muestra.
 *
 * Seguridad: define LEAD_WEBHOOK_SECRET en Script Properties y añádelo a la URL
 *   del webhook como ?secret=...  (Apps Script no expone cabeceras en doPost, así
 *   que el secreto viaja en el query string sobre HTTPS).
 */

/** Entrada del webhook de GHL: mapea el lead y lo manda a la CAPI de Meta. */
function doPost(e) {
  try {
    var secret = getProp('LEAD_WEBHOOK_SECRET');
    if (secret) {
      var given = (e && e.parameter && e.parameter.secret) || '';
      if (given !== secret) return jsonOut({ ok: false, error: 'unauthorized' });
    }

    var body = (e && e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : {};
    var lead = mapGhlWebhookToLead(body);
    var res = sendLeadEventToMeta(lead);

    return jsonOut({
      ok: true,
      sent: lead.eventName || 'Lead',
      matched_by: lead.leadId ? 'lead_id' : (lead.email ? 'email' : 'phone'),
      fbtrace_id: res && res.fbtrace_id,
      events_received: res && res.events_received
    });
  } catch (err) {
    logInfo('doPost error', err);
    return jsonOut({ ok: false, error: String(err) });
  }
}

/** Health check / verificación rápida en el navegador. */
function doGet(e) {
  return jsonOut({ ok: true, service: 'qualivo-lead-capi', ts: new Date().toISOString() });
}

/**
 * Mapa etapa/etiqueta de GHL → evento de Meta. Permite devolver TODO el embudo
 * de calidad (no solo el lead cualificado): así el algoritmo puede optimizar
 * sobre el evento que más importa cuando haya volumen (~50/semana).
 *
 * En el workflow de GHL basta con mandar `stage` (o `tag`/`status`) con uno de
 * estos valores; si no, se cae a `event_name` explícito y por defecto 'Lead'.
 */
var GHL_STAGE_TO_EVENT = {
  'lead': 'Lead',
  'nuevo lead': 'Lead',
  'cualificado': 'QualifiedLead',
  'qualified': 'QualifiedLead',
  'cita': 'Schedule',
  'cita programada': 'Schedule',
  'cita agendada': 'Schedule',
  'agendada': 'Schedule',
  'reservada': 'Schedule',
  'booked': 'Schedule',
  'venta': 'Purchase',
  'ganado': 'Purchase',
  'won': 'Purchase',
  'cliente': 'Purchase',
  'descartado': 'LeadDisqualified',
  'no cualificado': 'LeadDisqualified'
};

/** Resuelve el nombre de evento de Meta a partir del payload de GHL. */
function resolveEventName(body, c) {
  if (body.event_name) return body.event_name; // override explícito
  var stage = pick(body, ['stage', 'tag', 'status', 'pipeline_stage']) ||
              pick(c, ['stage', 'tag', 'status', 'pipeline_stage']);
  if (stage) {
    var mapped = GHL_STAGE_TO_EVENT[String(stage).trim().toLowerCase()];
    if (mapped) return mapped;
  }
  return 'Lead';
}

/**
 * Normaliza el payload del webhook de GHL a la forma que espera la CAPI.
 * GHL permite definir un Custom Data libre en la acción Webhook; soportamos
 * tanto un objeto plano como uno anidado en `contact`, y varias variantes de
 * nombre de clave para ser tolerantes a cómo se configure el workflow.
 *
 * IMPRESCINDIBLE en el workflow de GHL: incluir el leadgen_id de Meta (lo
 * guarda la integración nativa) como `meta_lead_id` para el match directo.
 * Para eventos de venta (Purchase) incluir `value` y opcionalmente `currency`.
 */
function mapGhlWebhookToLead(body) {
  body = body || {};
  var c = body.contact || body;

  var value = pick(body, ['value', 'amount', 'monetary_value']) ||
              pick(c, ['value', 'amount', 'monetary_value']);
  var currency = pick(body, ['currency']) || pick(c, ['currency']) || 'EUR';
  var stage = pick(body, ['stage', 'tag', 'status', 'pipeline_stage']) ||
              pick(c, ['stage', 'tag', 'status', 'pipeline_stage']);

  var customData = { lead_event_source: 'GHL', event_source: 'crm' };
  if (stage) customData.status = String(stage);
  if (value) { customData.value = Number(value) || value; customData.currency = currency; }

  return {
    leadId: pick(body, ['meta_lead_id', 'leadgen_id', 'lead_id']) ||
            pick(c, ['meta_lead_id', 'leadgen_id', 'lead_id']),
    email: pick(c, ['email', 'Email']),
    phone: pick(c, ['phone', 'Phone', 'whatsapp', 'WhatsApp']),
    firstName: pick(c, ['first_name', 'firstName', 'firstname']),
    lastName: pick(c, ['last_name', 'lastName', 'lastname']),
    fbc: pick(body, ['fbc']) || pick(c, ['fbc']),
    fbp: pick(body, ['fbp']) || pick(c, ['fbp']),
    eventName: resolveEventName(body, c),
    eventId: body.event_id || pick(c, ['contact_id', 'id']),
    customData: customData,
    testEventCode: body.test_event_code || ''
  };
}

/** Devuelve el primer valor no vacío entre varias claves candidatas. */
function pick(obj, keys) {
  if (!obj) return '';
  for (var i = 0; i < keys.length; i++) {
    var v = obj[keys[i]];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
}

/** Respuesta JSON del Web App. */
function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
