/**
 * Smartlead.gs · añade un contacto a una campaña de Smartlead (email en frío
 * con warmup / deliverability). La campaña destino (SMARTLEAD_CAMPAIGN_ID)
 * debería estar EN PAUSA para revisar antes de que empiece a enviar.
 *
 * Doc: https://api.smartlead.ai/reference/add-leads-to-a-campaign-by-id
 */
var SMARTLEAD_BASE = 'https://server.smartlead.ai/api/v1';

/** Añade un prospecto como lead de la campaña. Devuelve true/false. */
function smartleadAddLead(p) {
  var key = getProp('SMARTLEAD_API_KEY');
  var campaignId = getProp('SMARTLEAD_CAMPAIGN_ID');
  var parts = splitName(p.contactName);

  var payload = {
    lead_list: [{
      email: p.contactEmail,
      first_name: parts.first,
      last_name: parts.last,
      company_name: p.company || '',
      custom_fields: {
        oferta_detectada: p.jobTitle || '',
        asunto_sugerido: p.subject || ''
      }
    }],
    // No pisar leads existentes ni parar el resto de la campaña.
    settings: { ignore_global_block_list: false, ignore_unsubscribe_list: false }
  };

  var url = SMARTLEAD_BASE + '/campaigns/' + encodeURIComponent(campaignId) +
    '/leads?api_key=' + encodeURIComponent(key);
  var r = httpJson(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
  if (!r.ok) { logEvent('Smartlead add error', p.company + ' HTTP ' + r.code + ' ' + String(r.body).slice(0, 160)); return false; }
  return true;
}

/** "María López García" -> {first:'María', last:'López García'} */
function splitName(full) {
  var s = String(full || '').trim();
  if (!s) return { first: '', last: '' };
  var parts = s.split(/\s+/);
  return { first: parts.shift(), last: parts.join(' ') };
}
