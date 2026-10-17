/**
 * Alerts.gs — Aviso por email cada vez que entra un lead nuevo.
 *
 * Un trigger temporal llama a htlCheckNewLeads() cada pocos minutos. Por cada
 * formulario vigilado, pide los leads creados desde la última comprobación,
 * envía un email por cada uno y guarda la marca de tiempo para no repetir.
 */

/** Prefijo de la propiedad que guarda el último timestamp por formulario. */
function htlLastKey(formId) { return 'HTL_LASTLEAD_' + formId; }

/** Comprueba y notifica leads nuevos. (Lo llama el trigger.) */
function htlCheckNewLeads() {
  if (!htlHasCreds()) return;
  var email = htlAlertEmail();
  if (!email) return;

  var forms = htlFormIds();
  if (!forms.length) return;

  var pageToken = htlPageToken();
  var nowUnix = Math.floor(Date.now() / 1000);

  forms.forEach(function (formId) {
    var lastStr = htlProp(htlLastKey(formId));
    // Primera ejecución: fija "ahora" y no manda históricos.
    if (!lastStr) { htlSetProp(htlLastKey(formId), nowUnix); return; }

    var since = parseInt(lastStr, 10) || (nowUnix - 3600);
    var leads;
    try {
      leads = htlNewLeads(formId, since, pageToken);
    } catch (e) {
      Logger.log('htlCheckNewLeads error form ' + formId + ': ' + e);
      return;
    }

    // Orden ascendente por fecha para procesar en orden y avanzar la marca.
    leads.sort(function (a, b) { return (a.created || '').localeCompare(b.created || ''); });

    var maxUnix = since;
    leads.forEach(function (lead) {
      htlSendLeadEmail(email, formId, lead);
      var t = Math.floor(new Date(lead.created).getTime() / 1000);
      if (t > maxUnix) maxUnix = t;
    });
    if (maxUnix > since) htlSetProp(htlLastKey(formId), maxUnix);
  });
}

/** Envía el email de un lead. */
function htlSendLeadEmail(email, formId, lead) {
  var f = lead.fields || {};
  var nombre = f.full_name || f.name || '(sin nombre)';
  var tel = f.phone_number || f.phone || '';
  var mail = f.email || '';
  var sector = f.sector || '';
  var inversion = f.inversion_ads || '';

  var subject = '🟢 Nuevo lead HackTheLead: ' + nombre;
  var lines = [
    'Ha entrado un lead nuevo por Meta.',
    '',
    'Nombre:    ' + nombre,
    'Teléfono:  ' + tel,
    'Email:     ' + mail,
    'Sector:    ' + sector,
    'Inversión: ' + inversion,
    '',
    'Formulario: ' + formId,
    'Fecha:      ' + lead.created,
    'Lead ID:    ' + lead.id
  ];
  MailApp.sendEmail(email, subject, lines.join('\n'));
}

/** Instala el trigger de alertas (cada 15 min). Menú. */
function htlInstallLeadAlerts() {
  htlRemoveTrigger('htlCheckNewLeads');
  ScriptApp.newTrigger('htlCheckNewLeads').timeBased().everyMinutes(15).create();
  // Inicializa la marca a "ahora" para no notificar históricos en el primer ciclo.
  htlFormIds().forEach(function (id) {
    if (!htlProp(htlLastKey(id))) htlSetProp(htlLastKey(id), Math.floor(Date.now() / 1000));
  });
  SpreadsheetApp.getActive().toast('Alertas de leads activadas (cada 15 min) → ' + htlAlertEmail());
}

/** Instala refresco diario del dashboard a las 7:00. Menú. */
function htlInstallDailyRefresh() {
  htlRemoveTrigger('htlRenderAll');
  ScriptApp.newTrigger('htlRenderAll').timeBased().atHour(7).everyDays(1).create();
  SpreadsheetApp.getActive().toast('Refresco diario del dashboard activado (7:00)');
}

/** Envía un email de prueba con el último lead disponible. Menú (QA). */
function htlTestLeadEmail() {
  var email = htlAlertEmail();
  var forms = htlFormIds();
  if (!email || !forms.length) {
    SpreadsheetApp.getUi().alert('Define HTL_ALERT_EMAIL y HTL_FORM_IDS primero.');
    return;
  }
  var pageToken = htlPageToken();
  // Trae leads de la última semana para tener alguno con el que probar.
  var since = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
  var leads = htlNewLeads(forms[0], since, pageToken);
  if (!leads.length) { SpreadsheetApp.getUi().alert('No hay leads recientes en el formulario ' + forms[0]); return; }
  htlSendLeadEmail(email, forms[0], leads[leads.length - 1]);
  SpreadsheetApp.getUi().alert('Email de prueba enviado a ' + email);
}

function htlRemoveTrigger(fn) {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === fn) ScriptApp.deleteTrigger(t);
  });
}
