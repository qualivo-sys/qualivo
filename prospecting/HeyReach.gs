/**
 * HeyReach.gs · añade un contacto a una lista de HeyReach (automatización de
 * LinkedIn). Desde HeyReach se asigna esa lista a una campaña y se lanza tras
 * revisar. Requiere que el prospecto tenga URL de LinkedIn.
 *
 * Doc: https://documentation.heyreach.io/ (Public API · Add leads to list V2)
 * Nota: si tu versión de la API usa otra forma de payload, ajústala aquí; el
 * error HTTP queda registrado en _Log para depurarlo.
 */
var HEYREACH_BASE = 'https://api.heyreach.io/api/public';

/** Añade un prospecto a la lista de HeyReach. Devuelve true/false. */
function heyreachAddLead(p) {
  var key = getProp('HEYREACH_API_KEY');
  var listId = parseInt(getProp('HEYREACH_LIST_ID'), 10);
  var parts = splitName(p.contactName);

  var payload = {
    listId: listId,
    leads: [{
      linkedInAccountId: null,
      lead: {
        profileUrl: p.contactLinkedin,
        firstName: parts.first,
        lastName: parts.last,
        companyName: p.company || ''
      }
    }]
  };

  var r = httpJson(HEYREACH_BASE + '/list/AddLeadsToListV2', {
    method: 'post',
    headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' },
    payload: JSON.stringify(payload)
  });
  if (!r.ok) { logEvent('HeyReach add error', p.company + ' HTTP ' + r.code + ' ' + String(r.body).slice(0, 160)); return false; }
  return true;
}
