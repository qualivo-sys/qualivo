/**
 * Radar.gs · orquestador. Junta las fuentes (Apollo + web), cualifica cada
 * empresa, enriquece con el decisor, genera el mensaje y escribe en la hoja.
 *
 * Es la función que dispara el trigger diario y el botón "Ejecutar radar ahora".
 */

/** Ejecuta un ciclo completo del radar. Devuelve el nº de prospectos nuevos. */
function ejecutarRadar() {
  applyConfigOverrides();

  if (!hasCreds('Apollo') && !hasWebSource()) {
    logEvent('Radar', 'Sin fuentes: configura APOLLO_API_KEY y/o SERPAPI_KEY (o GOOGLE_CSE_*).');
    return 0;
  }

  var limit = TARGET.maxCompaniesPerRun;
  var seenDomains = existingDomains();
  var seenNames = existingCompanyNames();

  // 1) Recolectar candidatos de todas las fuentes.
  var candidates = [];
  if (hasCreds('Apollo')) {
    candidates = candidates.concat(collectApolloCandidates(seenDomains, limit));
  }
  if (hasWebSource()) {
    candidates = candidates.concat(webGatherSignals());
  }

  // 2) Procesar hasta `limit` prospectos nuevos.
  var added = [];
  for (var i = 0; i < candidates.length && added.length < limit; i++) {
    var cand = candidates[i];
    var dkey = cand.domain ? cleanDomain(cand.domain) : '';
    var nkey = normalizeText(cand.company);

    if (dkey && seenDomains[dkey]) continue;
    if (!dkey && nkey && seenNames[nkey]) continue;
    if (!cand.company && !dkey) continue;

    var relevant = relevantJobs(cand.jobs);
    if (!relevant.length) continue;

    var prospect = buildProspect(cand, relevant);
    added.push(prospect);

    if (dkey) seenDomains[dkey] = true;
    if (nkey) seenNames[nkey] = true;
  }

  if (added.length) appendProspects(added);
  logEvent('Radar ejecutado', added.length + ' prospectos nuevos de ' + candidates.length + ' candidatos');
  return added.length;
}

/**
 * Recorre la búsqueda de empresas de Apollo, trae las ofertas de cada una y se
 * queda con las que tienen alguna oferta relevante. Limita cuántas empresas
 * inspecciona para controlar el gasto de créditos.
 */
function collectApolloCandidates(seenDomains, limit) {
  var out = [];
  var page = 1;
  var inspected = 0;
  var maxInspect = limit * 4;

  while (out.length < limit && inspected < maxInspect && page <= 10) {
    var res = apolloSearchCompanies(page);
    if (!res.companies.length) break;

    for (var i = 0; i < res.companies.length && out.length < limit; i++) {
      var c = res.companies[i];
      inspected++;
      var dkey = cleanDomain(c.domain);
      if (dkey && seenDomains[dkey]) continue;

      var jobs = apolloJobPostings(c.id);
      if (!relevantJobs(jobs).length) continue;

      c.orgId = c.id;
      c.jobs = jobs;
      c.source = 'Apollo';
      out.push(c);
    }
    page++;
    if (res.totalPages && page > res.totalPages) break;
  }
  return out;
}

/**
 * Filtra una lista de ofertas dejando solo las que son señal para Qualivo y
 * están dentro de la ventana de frescura. Añade {signal, category} a cada una.
 */
function relevantJobs(jobs) {
  var out = [];
  (jobs || []).forEach(function (j) {
    var sig = roleSignal(j.title);
    if (!sig) return;
    var age = daysSince(j.postedAt);
    if (age !== null && age > TARGET.maxJobAgeDays) return; // demasiado antigua
    out.push({ title: j.title, url: j.url, postedAt: j.postedAt, signal: sig.keyword, category: sig.category });
  });
  return out;
}

/**
 * Construye el objeto prospecto final (para escribir en la hoja): enriquece con
 * el decisor, puntúa y genera el mensaje.
 */
function buildProspect(cand, relevant) {
  // Mejor oferta = la de mayor peso de categoría.
  relevant.sort(function (a, b) {
    return (CATEGORY_WEIGHT[b.category] || 0) - (CATEGORY_WEIGHT[a.category] || 0);
  });
  var top = relevant[0];

  // Enriquecimiento del decisor (si hay Apollo).
  var contact = null;
  if (hasCreds('Apollo')) {
    var orgId = cand.orgId || apolloResolveOrg(cand);
    if (orgId) {
      try { contact = apolloFindContact(orgId); } catch (e) { logInfo('enrich error', e); }
    }
  }
  contact = contact || { name: '', title: '', linkedin: '', email: '' };

  var scoreRes = scoreProspect({
    matchedJobs: relevant,
    employees: cand.employees,
    hasContact: !!contact.name,
    hasEmail: !!contact.email
  });

  var msg = buildMessage({
    company: cand.company,
    contactName: contact.name,
    jobTitle: top.title,
    category: top.category
  });

  var channel = contact.email && contact.linkedin ? 'Ambos'
    : (contact.email ? 'Email' : (contact.linkedin ? 'LinkedIn' : ''));

  var state = scoreRes.score >= TARGET.qualifyThreshold ? 'Cualificado' : 'Nuevo';

  return {
    date: today(),
    company: cand.company,
    domain: cand.domain,
    website: cand.website,
    industry: cand.industry,
    employees: cand.employees,
    location: cand.location,
    jobTitle: top.title,
    jobUrl: top.url,
    jobPostedAt: top.postedAt,
    signal: top.signal,
    jobCount: relevant.length,
    score: scoreRes.score,
    priority: scoreRes.priority,
    contactName: contact.name,
    contactTitle: contact.title,
    contactEmail: contact.email,
    contactLinkedin: contact.linkedin,
    state: state,
    channel: channel,
    subject: msg.subject,
    message: msg.body,
    notes: 'Fuente: ' + (cand.source || '—')
  };
}

/** Conjunto de nombres de empresa ya presentes (dedup de candidatos web). */
function existingCompanyNames() {
  var sh = prospectSheet();
  var last = sh.getLastRow();
  var set = {};
  if (last < 2) return set;
  var vals = sh.getRange(2, col('Empresa') + 1, last - 1, 1).getValues();
  vals.forEach(function (r) {
    var n = normalizeText(r[0]);
    if (n) set[n] = true;
  });
  return set;
}
