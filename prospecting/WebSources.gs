/**
 * WebSources.gs · sourcing en Google y portales de empleo (además de Apollo).
 *
 * Dos motores, se usa el que tenga credenciales (SerpApi tiene prioridad porque
 * devuelve empresa + fecha estructuradas):
 *
 *   A) SerpApi · engine=google_jobs  → resultados de Google Jobs (empresa,
 *      título, ubicación, fecha). Clave: SERPAPI_KEY.
 *   B) Google Programmable Search (Custom Search JSON API) restringido a
 *      portales (InfoJobs, LinkedIn Jobs, Tecnoempleo…). Claves:
 *      GOOGLE_CSE_KEY + GOOGLE_CSE_ID.
 *
 * Devuelven "candidatos" con la misma forma que el conector de Apollo para
 * entrar en el mismo pipeline (cualificar → enriquecer → escribir).
 */

/** Frases de búsqueda (curadas para no agotar la cuota de la API). */
var WEB_QUERIES = [
  'generación de leads', 'captación de leads', 'CRM manager',
  'automatización de procesos', 'marketing automation', 'growth marketing',
  'SDR ventas', 'especialista en HubSpot', 'RevOps'
];

/** Portales para el buscador Custom Search (modo B). */
var JOB_PORTALS = [
  'infojobs.net', 'linkedin.com/jobs', 'tecnoempleo.com',
  'es.indeed.com', 'glassdoor.es', 'jobfluent.com'
];

/** Máximo de consultas por ejecución (protege la cuota de la API). */
var WEB_MAX_QUERIES = 8;

/** ¿Hay algún motor web configurado? */
function hasWebSource() {
  return !!getProp('SERPAPI_KEY') || (!!getProp('GOOGLE_CSE_KEY') && !!getProp('GOOGLE_CSE_ID'));
}

/** Recolecta candidatos de la web. Devuelve array unificado. */
function webGatherSignals() {
  if (getProp('SERPAPI_KEY')) return serpApiGather();
  if (getProp('GOOGLE_CSE_KEY') && getProp('GOOGLE_CSE_ID')) return cseGather();
  return [];
}

/* ------------------------------ SerpApi ------------------------------- */

function serpApiGather() {
  var key = getProp('SERPAPI_KEY');
  var loc = TARGET.locations[0] || 'Spain';
  var out = [];
  var queries = WEB_QUERIES.slice(0, WEB_MAX_QUERIES);

  queries.forEach(function (q) {
    var url = 'https://serpapi.com/search.json?engine=google_jobs' +
      '&q=' + encodeURIComponent(q) +
      '&location=' + encodeURIComponent(loc) +
      '&hl=es&api_key=' + encodeURIComponent(key);
    var r = httpJson(url, { method: 'get' });
    if (!r.ok) { logEvent('SerpApi error', 'HTTP ' + r.code + ' q=' + q); return; }
    (r.json.jobs_results || []).forEach(function (j) {
      var ext = j.detected_extensions || {};
      var link = j.share_link || (j.related_links && j.related_links[0] && j.related_links[0].link) || '';
      out.push({
        source: 'Google Jobs',
        company: j.company_name || '',
        domain: '',
        website: '',
        industry: '',
        employees: '',
        location: j.location || loc,
        orgId: '',
        jobs: [{ title: j.title || '', url: link, postedAt: normalizePosted(ext.posted_at) }]
      });
    });
  });
  return dedupeWebCandidates(out);
}

/** "hace 3 días" / "3 days ago" → fecha aproximada YYYY-MM-DD ('' si no se sabe). */
function normalizePosted(txt) {
  if (!txt) return '';
  var m = String(txt).match(/(\d+)\s*(d|día|dia|day|hour|hora|h)/i);
  if (!m) return '';
  var n = parseInt(m[1], 10);
  var unit = m[2].toLowerCase();
  var msAgo = (unit[0] === 'h') ? n * 3600000 : n * 86400000;
  return Utilities.formatDate(new Date(Date.now() - msAgo), QUALIVO.timezone, 'yyyy-MM-dd');
}

/* --------------------------- Custom Search ---------------------------- */

function cseGather() {
  var key = getProp('GOOGLE_CSE_KEY');
  var cx = getProp('GOOGLE_CSE_ID');
  var out = [];
  var budget = WEB_MAX_QUERIES;

  for (var p = 0; p < JOB_PORTALS.length && budget > 0; p++) {
    // Una consulta por portal combinando keywords con OR (ahorra cuota).
    var terms = WEB_QUERIES.slice(0, 5).map(function (q) { return '"' + q + '"'; }).join(' OR ');
    var q = 'site:' + JOB_PORTALS[p] + ' (' + terms + ')';
    var url = 'https://www.googleapis.com/customsearch/v1?key=' + encodeURIComponent(key) +
      '&cx=' + encodeURIComponent(cx) + '&num=10&q=' + encodeURIComponent(q);
    var r = httpJson(url, { method: 'get' });
    budget--;
    if (!r.ok) { logEvent('CSE error', 'HTTP ' + r.code + ' portal=' + JOB_PORTALS[p]); continue; }
    (r.json.items || []).forEach(function (it) {
      out.push({
        source: 'Portal: ' + JOB_PORTALS[p],
        company: guessCompanyFromResult(it),
        domain: '',
        website: '',
        industry: '',
        employees: '',
        location: TARGET.locations[0] || '',
        orgId: '',
        jobs: [{ title: it.title || '', url: it.link || '', postedAt: '' }]
      });
    });
  }
  return dedupeWebCandidates(out);
}

/** Intenta extraer el nombre de la empresa del título/snippet de un resultado. */
function guessCompanyFromResult(item) {
  var title = item.title || '';
  // Patrones típicos: "Puesto - Empresa | Portal", "Empresa busca Puesto".
  var m = title.match(/[-–|]\s*([^-–|]+?)\s*[-–|]\s*(InfoJobs|LinkedIn|Indeed|Tecnoempleo|Glassdoor)/i);
  if (m) return m[1].trim();
  m = title.match(/^([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑ.& ]{2,40}?)\s+(busca|precisa|selecciona|contrata)/);
  if (m) return m[1].trim();
  return '';
}

/** Quita candidatos con la misma oferta (misma URL o mismo empresa+título). */
function dedupeWebCandidates(list) {
  var seen = {};
  return list.filter(function (c) {
    var j = c.jobs[0] || {};
    var key = (j.url || (c.company + '|' + j.title)).toLowerCase();
    if (seen[key]) return false;
    seen[key] = true;
    return true;
  });
}
