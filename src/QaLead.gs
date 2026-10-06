/**
 * QaLead.gs
 * QA punta a punta (punto 6 del brief): manda un lead de PRUEBA a la CAPI con
 * test_event_code para verlo en Events Manager → «Probar eventos», sin gastar
 * presupuesto ni ensuciar la optimización. NO activar gasto hasta que el lead
 * de prueba entre en GHL, se filtre y dispare el WhatsApp.
 */

/** Envía un lead de prueba a la Conversions API (menú). */
function qaSendTestLead() {
  var ui = SpreadsheetApp.getUi();
  var code = getProp('META_TEST_EVENT_CODE');
  if (!code) {
    ui.alert('Falta META_TEST_EVENT_CODE.\n\nEvents Manager → Orígenes de datos → tu dataset → ' +
      'Probar eventos → copia el código TESTxxxx en Script Properties.');
    return;
  }
  if (!hasCreds('CAPI')) {
    ui.alert('Faltan credenciales CAPI: define META_CAPI_TOKEN y META_DATASET_ID.');
    return;
  }

  try {
    var res = sendLeadEventToMeta({
      email: 'qa+htl@qualivo.test',
      phone: '+34600000000',
      firstName: 'QA',
      lastName: 'HackTheLead',
      eventName: 'Lead',
      eventId: 'qa-' + Date.now(),
      testEventCode: code
    });
    ui.alert('Lead de prueba enviado a la CAPI.\n\n' +
      'events_received: ' + (res && res.events_received != null ? res.events_received : '—') + '\n' +
      'fbtrace_id: ' + (res && res.fbtrace_id || '—') + '\n\n' +
      'Compruébalo en Events Manager → Probar eventos (' + code + ').');
  } catch (err) {
    ui.alert('Error enviando el lead de prueba:\n\n' + err);
  }
}

/** Muestra la URL del Web App para pegarla en el Webhook de GHL (menú). */
function showWebhookUrl() {
  var ui = SpreadsheetApp.getUi();
  var url = ScriptApp.getService().getUrl();
  if (!url) {
    ui.alert('El Web App aún no está desplegado.\n\n' +
      'Implementar → Nueva implementación → Aplicación web ' +
      '(Ejecutar como: yo · Acceso: Cualquier usuario).');
    return;
  }
  var hasSecret = !!getProp('LEAD_WEBHOOK_SECRET');
  ui.alert('URL del Web App (pégala en la acción Webhook del workflow de GHL):\n\n' +
    url + (hasSecret ? '?secret=TU_SECRETO' : '') +
    (hasSecret ? '\n\n(Reemplaza TU_SECRETO por el valor de LEAD_WEBHOOK_SECRET.)'
               : '\n\n(Define LEAD_WEBHOOK_SECRET para protegerlo.)'));
}
