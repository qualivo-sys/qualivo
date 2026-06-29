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
    var e = { won: 0, wonNew: 0, wonCarry: 0, wonPrevMonth: 0, interviewed: 0, openActive: 0, lost: 0, abandoned: 0, contractValue: 0, revenue: 0 };

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

      // Las matrículas (won) se cuentan por fecha de CIERRE, no de creación
      // (ver más abajo). Aquí solo clasificamos el cohorte creado en el mes.
      if (status === 'lost') { e.lost += 1; }
      else if (status === 'abandoned') { e.abandoned += 1; }
      else if (status !== 'won') {
        e.openActive += 1;
        if (PIPELINE_STAGES.indexOf(canon) >= 0) byStage[canon] += 1;
        if (canon === 'Entrevistado') e.interviewed += 1;
      }
    });

    // Matrículas del mes = oportunidades ganadas con fecha de cierre en el mes
    // (lastStatusChangeAt), aunque entraran como lead en meses anteriores.
    // Facturación = matrículas × precio de matrícula (monetaryValue de GHL no
    // siempre está cargado).
    var wonList = ghlSearchWonInMonth(token, locationId, range.since, range.until);
    e.won = wonList.length;
    e.wonNew = wonList.filter(function (o) {
      var c = (o.createdAt || '').slice(0, 10);
      return c >= range.since && c <= range.until;
    }).length;
    e.wonCarry = e.won - e.wonNew;
    e.revenue = e.won * CLIENT.matriculaPrice;
    e.contractValue = e.revenue;

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

/**
 * Pagina la búsqueda de oportunidades creadas en el rango [since, until].
 *
 * La API de GHL v2 ordena por fecha descendente y pagina con cursor
 * (`meta.nextPageUrl`), NO con un parámetro `page`. Como viene de más reciente
 * a más antiguo, en cuanto una página contiene una oportunidad anterior a
 * `since` podemos parar (ya hemos cubierto el mes).
 *
 * Si se define GHL_PIPELINE_ID, filtra a ese pipeline (en EAC el pipeline
 * activo es "Pipeline"; el pipeline "Hubspot" es el volcado de la migración y
 * se excluye).
 */
function ghlSearchOpportunities(token, locationId, since, until) {
  var pipelineId = getProp('GHL_PIPELINE_ID');
  var results = [];
  var url = 'https://services.leadconnectorhq.com/opportunities/search' +
    '?location_id=' + encodeURIComponent(locationId) + '&limit=100';
  if (pipelineId) url += '&pipeline_id=' + encodeURIComponent(pipelineId);

  var pages = 0;
  while (url && pages < 60) {
    var json = httpJson(url, { headers: ghlHeaders(token) });
    var opps = json.opportunities || [];
    pages++;
    var minDate = '9999';
    opps.forEach(function (o) {
      var created = (o.createdAt || '').slice(0, 10);
      if (created < minDate) minDate = created;
      if (created >= since && created <= until) results.push(o);
    });
    if (minDate < since) break; // orden desc: el resto es anterior al mes
    url = (json.meta && json.meta.nextPageUrl) ? json.meta.nextPageUrl : null;
  }
  return results;
}

/**
 * Devuelve las oportunidades GANADAS cuya fecha de cierre (lastStatusChangeAt)
 * cae dentro del mes. Usa el filtro status=won del API y pagina todas (suelen
 * ser pocas). Respeta GHL_PIPELINE_ID si está definido.
 */
function ghlSearchWonInMonth(token, locationId, since, until) {
  var pipelineId = getProp('GHL_PIPELINE_ID');
  var url = 'https://services.leadconnectorhq.com/opportunities/search' +
    '?location_id=' + encodeURIComponent(locationId) + '&status=won&limit=100';
  if (pipelineId) url += '&pipeline_id=' + encodeURIComponent(pipelineId);

  var results = [];
  var pages = 0;
  while (url && pages < 60) {
    var json = httpJson(url, { headers: ghlHeaders(token) });
    var opps = json.opportunities || [];
    pages++;
    opps.forEach(function (o) {
      var closed = (o.lastStatusChangeAt || '').slice(0, 10);
      if (closed >= since && closed <= until) results.push(o);
    });
    url = (json.meta && json.meta.nextPageUrl) ? json.meta.nextPageUrl : null;
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
