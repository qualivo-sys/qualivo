/**
 * GoHighLevel.gs
 * Conector GoHighLevel / LeadConnector (API v2) – oportunidades del pipeline.
 *
 * Credenciales (Script Properties):
 *   GHL_TOKEN        - token de acceso (Bearer) con scope opportunities.readonly
 *   GHL_LOCATION_ID  - id de la location (sub-cuenta)
 *
 * Doc: https://highlevel.stoplight.io/docs/integrations (Opportunities → Search)
 *
 * Mapea los estados nativos (open/won/lost/abandoned) y el nombre de la etapa
 * del pipeline a las etapas canónicas de PIPELINE_STAGES.
 */
function fetchGHL(monthKey) {
  var out = emptyCrm('GHL');
  if (!hasCreds('GHL')) { out.error = 'sin credenciales'; return out; }

  try {
    var token = getProp('GHL_TOKEN');
    var locationId = getProp('GHL_LOCATION_ID');
    var range = monthRange(monthKey);

    var stageNames = ghlStageNameMap(token, locationId); // stageId -> nombre
    var opps = ghlSearchOpportunities(token, locationId, range.since, range.until);

    out.totalCreated = opps.length;

    var byStage = {};
    PIPELINE_STAGES.forEach(function (s) { byStage[s] = 0; });
    var statusCounts = {};
    var sourceCounts = {};
    var e = { won: 0, wonPrevMonth: 0, interviewed: 0, openActive: 0, lost: 0, abandoned: 0, contractValue: 0, revenue: 0 };

    opps.forEach(function (o) {
      var status = (o.status || '').toLowerCase(); // open / won / lost / abandoned
      var stageName = stageNames[o.pipelineStageId] || o.pipelineStageId || '(sin etapa)';
      var canon = normalizeStage(stageName);
      var value = toNumber(o.monetaryValue);

      statusCounts[stageName] = (statusCounts[stageName] || 0) + 1;
      var src = o.source || '(sin fuente)';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;

      var contact = o.contact || {};
      out.leads.push({
        date: (o.createdAt || '').slice(0, 10),
        name: o.name || contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        source: src,
        url: '',
        status: stageName
      });

      if (status === 'won') { e.won += 1; e.contractValue += value; e.revenue += value; }
      else if (status === 'lost') { e.lost += 1; }
      else if (status === 'abandoned') { e.abandoned += 1; }
      else {
        e.openActive += 1;
        if (PIPELINE_STAGES.indexOf(canon) >= 0) byStage[canon] += 1;
        if (canon === 'Entrevistado') e.interviewed += 1;
      }
    });

    out.byStage = byStage;
    out.byStatus = withPercentages(mapToList(statusCounts), out.totalCreated)
      .sort(function (a, b) { return b.count - a.count; });
    out.bySource = withPercentages(mapToList(sourceCounts), out.totalCreated)
      .sort(function (a, b) { return b.count - a.count; });
    out.enrollment = e;
    out.leads.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
  } catch (e) {
    out.error = String(e);
    logInfo('GHL error', e);
  }
  return out;
}

/** Devuelve un mapa stageId -> nombre, recorriendo todos los pipelines. */
function ghlStageNameMap(token, locationId) {
  var map = {};
  try {
    var url = 'https://services.leadconnectorhq.com/opportunities/pipelines?locationId=' + encodeURIComponent(locationId);
    var json = httpJson(url, { headers: ghlHeaders(token) });
    (json.pipelines || []).forEach(function (p) {
      (p.stages || []).forEach(function (s) { map[s.id] = s.name; });
    });
  } catch (e) {
    logInfo('GHL pipelines error', e);
  }
  return map;
}

/** Pagina la búsqueda de oportunidades por fecha de creación. */
function ghlSearchOpportunities(token, locationId, since, until) {
  var results = [];
  var page = 1;
  while (true) {
    var params = {
      location_id: locationId,
      date: since, // filtro base; refinamos en cliente por rango
      startAfter: '',
      page: String(page),
      limit: '100'
    };
    var url = 'https://services.leadconnectorhq.com/opportunities/search?' + toQuery(params);
    var json = httpJson(url, { headers: ghlHeaders(token) });
    var opps = json.opportunities || [];
    // Filtra por rango de fecha de creación en cliente (la API filtra por mes/día base)
    opps.forEach(function (o) {
      var created = (o.createdAt || '').slice(0, 10);
      if (created >= since && created <= until) results.push(o);
    });
    var meta = json.meta || {};
    if (!opps.length || (meta.nextPage == null) || page >= 50) break;
    page++;
  }
  return results;
}

function ghlHeaders(token) {
  return {
    'Authorization': 'Bearer ' + token,
    'Version': '2021-07-28',
    'Accept': 'application/json'
  };
}
