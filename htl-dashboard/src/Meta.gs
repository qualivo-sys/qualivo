/**
 * Meta.gs — Llamadas a la Marketing API (insights + leads).
 */

/** GET JSON con manejo de errores. */
function htlHttp(url) {
  var res = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var code = res.getResponseCode();
  var body = res.getContentText();
  var json;
  try { json = body ? JSON.parse(body) : {}; } catch (e) { json = { _raw: body }; }
  if (code < 200 || code >= 300) {
    throw new Error('HTTP ' + code + ': ' + body.slice(0, 400));
  }
  return json;
}

function htlGraph(path, params) {
  var url = 'https://graph.facebook.com/' + htlVer() + '/' + path + '?';
  var parts = [];
  params = params || {};
  params.access_token = htlToken();
  Object.keys(params).forEach(function (k) {
    parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
  });
  return htlHttp(url + parts.join('&'));
}

/** Extrae el nº de leads de un array de actions de Meta. */
function htlLeadsFromActions(actions) {
  if (!actions) return 0;
  var lead = 0, grouped = 0;
  actions.forEach(function (a) {
    if (a.action_type === 'lead') lead = Number(a.value) || 0;
    if (a.action_type === 'onsite_conversion.lead_grouped') grouped = Number(a.value) || 0;
  });
  return lead || grouped || 0;
}

/**
 * Insights agregados por nivel (campaign | ad) para las campañas HTL.
 * Devuelve filas con métricas derivadas.
 */
function htlInsights(level) {
  var fields = (level === 'ad')
    ? 'campaign_name,adset_name,ad_name,spend,impressions,clicks,ctr,cpc,actions'
    : 'campaign_name,spend,impressions,clicks,ctr,cpc,actions';
  var filtering = JSON.stringify([
    { field: 'campaign.name', operator: 'CONTAIN', value: htlNameFilter() }
  ]);
  var rows = [];
  var params = {
    level: level, fields: fields, filtering: filtering,
    date_preset: htlDatePreset(), limit: 200
  };
  var path = 'act_' + htlAcct() + '/insights';
  var pages = 0;
  var next = null;
  do {
    var json = next ? htlHttp(next) : htlGraph(path, params);
    (json.data || []).forEach(function (r) {
      var spend = Number(r.spend) || 0;
      var leads = htlLeadsFromActions(r.actions);
      rows.push({
        campaign: r.campaign_name || '',
        adset: r.adset_name || '',
        ad: r.ad_name || '',
        spend: spend,
        impressions: Number(r.impressions) || 0,
        clicks: Number(r.clicks) || 0,
        ctr: Number(r.ctr) || 0,
        cpc: Number(r.cpc) || 0,
        leads: leads,
        cpl: leads ? spend / leads : 0
      });
    });
    next = (json.paging && json.paging.next) ? json.paging.next : null;
    pages++;
  } while (next && pages < 20);
  // Orden: más gasto primero
  rows.sort(function (a, b) { return b.spend - a.spend; });
  return rows;
}

/** Token de página (para leer leads); cae al token principal si no lo obtiene. */
function htlPageToken() {
  var pid = htlPageId();
  if (!pid) return htlToken();
  try {
    var j = htlGraph(pid, { fields: 'access_token' });
    return j.access_token || htlToken();
  } catch (e) {
    return htlToken();
  }
}

/**
 * Leads de un formulario creados DESPUÉS de sinceUnix (segundos).
 * Devuelve [{id, created, fields:{clave:valor}}].
 */
function htlNewLeads(formId, sinceUnix, pageToken) {
  var filtering = JSON.stringify([
    { field: 'time_created', operator: 'GREATER_THAN', value: sinceUnix }
  ]);
  var url = 'https://graph.facebook.com/' + htlVer() + '/' + formId + '/leads?' +
    'fields=' + encodeURIComponent('id,created_time,field_data') +
    '&filtering=' + encodeURIComponent(filtering) +
    '&limit=50&access_token=' + encodeURIComponent(pageToken);
  var json = htlHttp(url);
  return (json.data || []).map(function (l) {
    var f = {};
    (l.field_data || []).forEach(function (fd) {
      f[fd.name] = (fd.values && fd.values[0]) || '';
    });
    return { id: l.id, created: l.created_time, fields: f };
  });
}
