/**
 * Apollo.gs · fuente de señales (ofertas de empleo) + enriquecimiento del decisor.
 *
 * Usa la API REST de Apollo con la cabecera X-Api-Key (Script Property
 * APOLLO_API_KEY). Doc: https://docs.apollo.io/reference
 *
 * Flujo:
 *   1) apolloSearchCompanies(page)  → empresas del target (geo + tamaño).
 *   2) apolloJobPostings(orgId)     → ofertas de empleo abiertas de esa empresa.
 *   3) apolloFindContact(orgId)     → decisor (CEO/CMO/…) + email (opcional).
 */

var APOLLO_BASE = 'https://api.apollo.io/api/v1';

function apolloHeaders() {
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'X-Api-Key': getProp('APOLLO_API_KEY')
  };
}

/**
 * Busca empresas del target (geografía + rango de empleados). Devuelve un array
 * normalizado. `page` es 1-based.
 */
function apolloSearchCompanies(page) {
  var payload = {
    page: page || 1,
    per_page: 25,
    organization_locations: TARGET.locations,
    organization_num_employees_ranges: TARGET.employeeRanges
  };
  var r = httpJson(APOLLO_BASE + '/mixed_companies/search', {
    method: 'post',
    headers: apolloHeaders(),
    payload: JSON.stringify(payload)
  });
  if (!r.ok) {
    logEvent('Apollo search error', 'HTTP ' + r.code + ' ' + String(r.body).slice(0, 200));
    return { companies: [], totalPages: 0 };
  }
  var orgs = r.json.organizations || r.json.accounts || [];
  var companies = orgs.map(function (o) {
    return {
      id: o.id || o.organization_id,
      name: o.name || '',
      domain: cleanDomain(o.primary_domain || o.website_url || o.domain || ''),
      website: o.website_url || (o.primary_domain ? 'https://' + o.primary_domain : ''),
      industry: o.industry || '',
      employees: o.estimated_num_employees || '',
      location: [o.city, o.state, o.country].filter(String).join(', '),
      linkedin: o.linkedin_url || ''
    };
  }).filter(function (c) { return c.id; });
  var pag = r.json.pagination || {};
  return { companies: companies, totalPages: pag.total_pages || 0 };
}

/**
 * Ofertas de empleo abiertas de una empresa. Devuelve array de
 * {title, url, postedAt, location}. Vacío si no hay o si falla.
 */
function apolloJobPostings(orgId) {
  var r = httpJson(APOLLO_BASE + '/organizations/' + encodeURIComponent(orgId) + '/job_postings', {
    method: 'get',
    headers: apolloHeaders()
  });
  if (!r.ok) return [];
  var list = r.json.organization_job_postings || r.json.job_postings || [];
  return list.map(function (j) {
    return {
      title: j.title || '',
      url: j.url || '',
      postedAt: (j.posted_at || j.last_seen_at || '').slice(0, 10),
      location: [j.city, j.state, j.country].filter(String).join(', ')
    };
  }).filter(function (j) { return j.title; });
}

/**
 * Busca el mejor decisor de la empresa entre DECISION_MAKER_TITLES y, si
 * TARGET.revealEmails, revela su email (consume 1 crédito). Devuelve
 * {name, title, linkedin, email} o null.
 */
function apolloFindContact(orgId) {
  var payload = {
    page: 1,
    per_page: 10,
    organization_ids: [orgId],
    person_titles: DECISION_MAKER_TITLES
  };
  var r = httpJson(APOLLO_BASE + '/mixed_people/search', {
    method: 'post',
    headers: apolloHeaders(),
    payload: JSON.stringify(payload)
  });
  if (!r.ok) return null;
  var people = r.json.people || r.json.contacts || [];
  if (!people.length) return null;

  // Elegimos por orden de prioridad de cargo (el primero de la lista que exista).
  var best = pickBestContact(people);
  if (!best) return null;

  var contact = {
    name: best.name || [best.first_name, best.last_name].filter(String).join(' '),
    title: best.title || '',
    linkedin: best.linkedin_url || '',
    email: validEmail(best.email) ? best.email : ''
  };

  if (!contact.email && TARGET.revealEmails && best.id) {
    contact.email = apolloRevealEmail(best.id);
  }
  return contact;
}

/** Ordena candidatos según la prioridad de DECISION_MAKER_TITLES. */
function pickBestContact(people) {
  var ranked = people.map(function (p) {
    var t = normalizeText(p.title);
    var rank = DECISION_MAKER_TITLES.length; // por defecto, el peor
    for (var i = 0; i < DECISION_MAKER_TITLES.length; i++) {
      if (t.indexOf(normalizeText(DECISION_MAKER_TITLES[i])) >= 0) { rank = i; break; }
    }
    return { p: p, rank: rank };
  });
  ranked.sort(function (a, b) { return a.rank - b.rank; });
  return ranked.length ? ranked[0].p : null;
}

/** Revela el email de una persona por su id (POST /people/match). '' si no. */
function apolloRevealEmail(personId) {
  var r = httpJson(APOLLO_BASE + '/people/match?reveal_personal_emails=false', {
    method: 'post',
    headers: apolloHeaders(),
    payload: JSON.stringify({ id: personId })
  });
  if (!r.ok) return '';
  var person = r.json.person || {};
  return validEmail(person.email) ? person.email : '';
}

/**
 * Resuelve el id de organización de Apollo a partir del nombre y/o dominio de
 * una empresa (para candidatos web que no traen orgId). Devuelve '' si no.
 */
function apolloResolveOrg(cand) {
  var payload = { page: 1, per_page: 1 };
  if (cand.domain) payload.organization_domains = [cand.domain];
  else if (cand.company) payload.q_organization_name = cand.company;
  else return '';
  var r = httpJson(APOLLO_BASE + '/mixed_companies/search', {
    method: 'post',
    headers: apolloHeaders(),
    payload: JSON.stringify(payload)
  });
  if (!r.ok) return '';
  var orgs = r.json.organizations || r.json.accounts || [];
  return orgs.length ? (orgs[0].id || orgs[0].organization_id || '') : '';
}

/** Apollo devuelve placeholders tipo "email_not_unlocked@domain.com". */
function validEmail(email) {
  if (!email) return false;
  var e = String(email).toLowerCase();
  if (e.indexOf('not_unlocked') >= 0 || e.indexOf('domain.com') >= 0) return false;
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
}
