/**
 * HubSpot.gs
 * Conector HubSpot CRM (contactos + deals).
 *
 * Credenciales (Script Properties):
 *   HUBSPOT_TOKEN  - token de Private App (Bearer)
 *
 * Scopes recomendados: crm.objects.contacts.read, crm.objects.deals.read
 * Doc: https://developers.hubspot.com/docs/api/crm/search
 *
 * Propiedad usada para el "estado del lead" (pipeline). Por defecto
 * hs_lead_status; si el cliente usa una propiedad custom (p.ej. estado del
 * lead en español), ponla en la Script Property HUBSPOT_STATUS_PROP.
 */
function fetchHubSpot(monthKey) {
  var out = emptyCrm('HubSpot');
  if (!hasCreds('HubSpot')) { out.error = 'sin credenciales'; return out; }

  try {
    var token = getProp('HUBSPOT_TOKEN');
    var statusProp = getProp('HUBSPOT_STATUS_PROP', 'hs_lead_status');
    var range = monthRange(monthKey);
    var since = new Date(range.since + 'T00:00:00Z').getTime();
    var until = new Date(range.until + 'T23:59:59Z').getTime();

    var contacts = hubspotSearchContacts(token, since, until, statusProp);
    out.totalCreated = contacts.length;

    // Distribución por fuente (hs_analytics_source)
    var sourceCounts = {};
    var statusCounts = {};
    contacts.forEach(function (c) {
      var p = c.properties || {};
      var src = p.hs_analytics_source || '(sin fuente)';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      var st = p[statusProp] || '(sin status)';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
      out.leads.push({
        date: (p.createdate || '').slice(0, 10),
        name: ((p.firstname || '') + ' ' + (p.lastname || '')).trim(),
        email: p.email || '',
        phone: p.phone || '',
        source: src,
        url: p.hs_analytics_first_url || '',
        status: st
      });
    });
    out.leads.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });

    out.bySource = withPercentages(mapToList(sourceCounts), out.totalCreated)
      .sort(function (a, b) { return b.count - a.count; });
    out.byStatus = withPercentages(mapToList(statusCounts), out.totalCreated)
      .sort(function (a, b) { return b.count - a.count; });

    // Open por stage canónico (sólo estados de pipeline abierto)
    var byStage = {};
    PIPELINE_STAGES.forEach(function (s) { byStage[s] = 0; });
    out.byStatus.forEach(function (s) {
      var canon = normalizeStage(s.key);
      if (PIPELINE_STAGES.indexOf(canon) >= 0) byStage[canon] += s.count;
    });
    out.byStage = byStage;

    // Matrículas / cierres vía deals
    out.enrollment = hubspotEnrollment(token, since, until);
  } catch (e) {
    out.error = String(e);
    logInfo('HubSpot error', e);
  }
  return out;
}

/** Pagina la Search API de contactos por fecha de creación. */
function hubspotSearchContacts(token, sinceMs, untilMs, statusProp) {
  var url = 'https://api.hubapi.com/crm/v3/objects/contacts/search';
  var results = [];
  var after = undefined;
  do {
    var payload = {
      filterGroups: [{
        filters: [
          { propertyName: 'createdate', operator: 'GTE', value: String(sinceMs) },
          { propertyName: 'createdate', operator: 'LTE', value: String(untilMs) }
        ]
      }],
      properties: ['hs_analytics_source', statusProp, 'createdate', 'email', 'firstname', 'lastname', 'phone', 'hs_analytics_first_url'],
      limit: 100
    };
    if (after) payload.after = after;
    var json = httpJson(url, {
      method: 'post',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      payload: JSON.stringify(payload)
    });
    results = results.concat(json.results || []);
    after = json.paging && json.paging.next ? json.paging.next.after : null;
  } while (after);
  return results;
}

/** Resumen de matrículas/cierres a partir de deals creados en el mes. */
function hubspotEnrollment(token, sinceMs, untilMs) {
  var e = { won: 0, wonPrevMonth: 0, interviewed: 0, openActive: 0, lost: 0, abandoned: 0, contractValue: 0, revenue: 0 };
  try {
    var url = 'https://api.hubapi.com/crm/v3/objects/deals/search';
    var after = undefined;
    var deals = [];
    do {
      var payload = {
        filterGroups: [{
          filters: [
            { propertyName: 'createdate', operator: 'GTE', value: String(sinceMs) },
            { propertyName: 'createdate', operator: 'LTE', value: String(untilMs) }
          ]
        }],
        properties: ['dealstage', 'amount', 'hs_is_closed_won', 'hs_is_closed'],
        limit: 100
      };
      if (after) payload.after = after;
      var json = httpJson(url, {
        method: 'post',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
        payload: JSON.stringify(payload)
      });
      deals = deals.concat(json.results || []);
      after = json.paging && json.paging.next ? json.paging.next.after : null;
    } while (after);

    deals.forEach(function (d) {
      var p = d.properties || {};
      var amount = toNumber(p.amount);
      if (p.hs_is_closed_won === 'true') {
        e.won += 1; e.contractValue += amount; e.revenue += amount;
      } else if (p.hs_is_closed === 'true') {
        e.lost += 1;
      } else {
        e.openActive += 1;
      }
    });
  } catch (err) {
    logInfo('HubSpot deals error', err);
  }
  return e;
}

/** Convierte {k:n} a [{key:k, count:n}]. */
function mapToList(obj) {
  return Object.keys(obj).map(function (k) { return { key: k, count: obj[k] }; });
}
