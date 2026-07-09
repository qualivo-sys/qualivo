/**
 * Codigo.gs - Radar de Prospeccion de Qualivo - BUNDLE (todo en un archivo).
 * Pega este archivo como un unico fichero en el editor de Apps Script.
 * Fuente: modulos de prospecting/ (mantener alli; este es el build).
 */

/* ===================== Config.gs ===================== */
/**
 * Config.gs · Radar de Prospección de Qualivo
 *
 * Sistema que detecta empresas que ESTÁN CONTRATANDO para roles de captación
 * de leads / CRM / automatización de procesos (= tienen ese dolor AHORA) y las
 * prepara para contactarlas ofreciéndoles los servicios de Qualivo.
 *
 * Lógica: una oferta de empleo de "Especialista en generación de leads",
 * "CRM Manager", "Automatización de procesos", "SDR/RevOps"… es una SEÑAL DE
 * COMPRA. En vez de (o además de) contratar, la empresa puede resolverlo con
 * Qualivo como servicio. Detectamos la oferta, sacamos al decisor y preparamos
 * el mensaje.
 *
 * Las credenciales NO viven en el código. Se leen de las "Script Properties"
 * (Configuración del proyecto → Propiedades del script) o se cargan desde la
 * pestaña `_Config` con el menú "Radar Qualivo → Guardar credenciales".
 */

/** Marca / remitente. Ajustable en _Config (claves QUALIVO_*). */
var QUALIVO = {
  name: 'Qualivo',
  timezone: 'Europe/Madrid',
  currency: 'EUR',
  // Estos 4 se sobrescriben desde _Config si están definidos:
  website: 'goqualivo.com',
  senderName: 'Maikel Echevarria',  // QUALIVO_SENDER_NAME
  senderEmail: '',                  // QUALIVO_SENDER_EMAIL (remitente de los borradores)
  calendarLink: ''                  // QUALIVO_CALENDAR_LINK (Calendly / Google Calendar)
};

/**
 * Parámetros del radar. Los que se pueden tocar sin programar están también
 * expuestos en `_Config` (ver ConfigSheet.gs) para no tener que editar código.
 */
var TARGET = {
  // Geografía (nombres tal cual los entiende Apollo: "Spain", "Mexico"…).
  locations: ['Spain'],

  // Rango de tamaño de empresa (sweet spot de Qualivo). Formato Apollo "min,max".
  employeeRanges: ['11,20', '21,50', '51,100', '101,200', '201,500'],

  // Cuántas empresas nuevas procesar como máximo por ejecución (controla el
  // gasto de créditos de Apollo y el límite de 6 min de Apps Script).
  maxCompaniesPerRun: 25,

  // Solo consideramos ofertas publicadas en los últimos N días (señal fresca).
  maxJobAgeDays: 60,

  // Revelar el email real del decisor (consume 1 crédito de Apollo por persona).
  // Ponlo en false para validar el flujo de detección sin gastar créditos.
  revealEmails: true,

  // Umbral de score (0-100) a partir del cual una empresa entra como
  // "Cualificado" (lista para contactar) en vez de "Nuevo".
  qualifyThreshold: 50,

  // ENVÍO AUTOMÁTICO: si true, tras detectar y cualificar, el radar empuja
  // automáticamente los "Cualificado" con email a la campaña de Smartlead (que
  // se encarga del envío con warmup/límites). Requiere credenciales de Smartlead
  // y fuerza revealEmails=true. Déjalo en false hasta tener la campaña lista.
  autoSmartlead: false
};

/**
 * Palabras clave que, si aparecen en el TÍTULO de una oferta, la marcan como
 * señal de compra para Qualivo. En minúsculas y sin tildes (el matcher
 * normaliza el título antes de comparar).
 */
var ROLE_KEYWORDS = [
  // Captación de leads
  'lead', 'leads', 'generacion de leads', 'lead generation', 'captacion',
  'demand generation', 'prospeccion', 'prospecting',
  // Ventas / SDR
  'sdr', 'bdr', 'sales development', 'inside sales', 'appointment setter',
  'closer', 'teleoperador', 'telemarketing', 'comercial', 'ventas',
  // CRM
  'crm', 'hubspot', 'salesforce', 'gohighlevel', 'pipedrive', 'zoho',
  // Automatización / RevOps
  'automatizacion', 'automation', 'revops', 'revenue operations',
  'sales operations', 'marketing operations', 'make', 'zapier', 'n8n',
  // Marketing / growth
  'growth', 'growth marketing', 'marketing automation', 'email marketing',
  'performance marketing', 'paid media', 'marketing digital', 'funnel',
  'embudo', 'nurturing', 'outbound'
];

/**
 * Cargos de decisor a buscar en cada empresa (Apollo person_titles). El primero
 * que exista se usa como contacto.
 */
var DECISION_MAKER_TITLES = [
  'CEO', 'Founder', 'Co-Founder', 'Owner', 'Fundador', 'Director General',
  'Managing Director', 'Gerente', 'CMO', 'Chief Marketing Officer',
  'Director de Marketing', 'Head of Marketing', 'Head of Growth',
  'VP Marketing', 'Director Comercial', 'Chief Revenue Officer',
  'Head of Sales', 'VP Sales', 'Director de Ventas', 'Sales Director'
];

/** Estados del pipeline de prospección (columna Estado). */
var PROSPECT_STATES = [
  'Nuevo',                 // detectado, aún sin cualificar del todo
  'Cualificado',           // encaja + tiene decisor: listo para contactar
  'Borrador listo',        // borrador de email generado, pendiente de revisar/enviar
  'En secuencia (Smartlead)',
  'En secuencia (HeyReach)',
  'Respondió',
  'Reunión',
  'Cliente',
  'Descartado',
  'Perdido'
];

/** Pestañas que gestiona el script. */
var SHEETS = {
  prospects: 'Prospectos',
  config: '_Config',
  log: '_Log'
};

/** Claves de credenciales / ajustes esperadas en Script Properties. */
var CREDENTIAL_KEYS = [
  'APOLLO_API_KEY',          // API key de Apollo (Settings → Integrations → API)
  'SERPAPI_KEY',             // SerpApi (motor web Google Jobs) — opcional
  'GOOGLE_CSE_KEY',          // Google Programmable Search API key — opcional
  'GOOGLE_CSE_ID',           // Google Programmable Search engine id (cx) — opcional
  'SMARTLEAD_API_KEY',       // Smartlead (Settings → API)
  'SMARTLEAD_CAMPAIGN_ID',   // campaña destino en Smartlead (en pausa, para revisar)
  'HEYREACH_API_KEY',        // HeyReach (Settings → API keys)
  'HEYREACH_LIST_ID',        // lista destino en HeyReach
  'QUALIVO_SENDER_NAME',
  'QUALIVO_SENDER_EMAIL',
  'QUALIVO_CALENDAR_LINK',
  'QUALIVO_WEBSITE',
  // Ajustes opcionales del radar (si están, pisan a TARGET.*):
  'RADAR_LOCATIONS',         // p.ej. "Spain,Mexico"
  'RADAR_MAX_COMPANIES',     // p.ej. "25"
  'RADAR_MAX_JOB_AGE_DAYS',  // p.ej. "60"
  'RADAR_REVEAL_EMAILS',     // "true" / "false"
  'RADAR_QUALIFY_THRESHOLD', // p.ej. "50"
  'RADAR_AUTO_SMARTLEAD'     // "true" = enviar solo vía Smartlead tras detectar
];

/** Lee una propiedad del script (credencial / ajuste). */
function getProp(key, fallback) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return (v === null || v === '') ? (fallback === undefined ? '' : fallback) : v;
}

/** Aplica los ajustes de _Config / Script Properties sobre TARGET y QUALIVO. */
function applyConfigOverrides() {
  var loc = getProp('RADAR_LOCATIONS');
  if (loc) TARGET.locations = loc.split(',').map(function (s) { return s.trim(); }).filter(String);

  var maxC = getProp('RADAR_MAX_COMPANIES');
  if (maxC) TARGET.maxCompaniesPerRun = Math.max(1, parseInt(maxC, 10) || TARGET.maxCompaniesPerRun);

  var maxAge = getProp('RADAR_MAX_JOB_AGE_DAYS');
  if (maxAge) TARGET.maxJobAgeDays = Math.max(1, parseInt(maxAge, 10) || TARGET.maxJobAgeDays);

  var reveal = getProp('RADAR_REVEAL_EMAILS');
  if (reveal) TARGET.revealEmails = (String(reveal).toLowerCase() === 'true');

  var thr = getProp('RADAR_QUALIFY_THRESHOLD');
  if (thr) TARGET.qualifyThreshold = parseInt(thr, 10) || TARGET.qualifyThreshold;

  var autoSL = getProp('RADAR_AUTO_SMARTLEAD');
  if (autoSL) TARGET.autoSmartlead = (String(autoSL).toLowerCase() === 'true');
  // El envío automático necesita el email revelado.
  if (TARGET.autoSmartlead) TARGET.revealEmails = true;

  QUALIVO.senderName = getProp('QUALIVO_SENDER_NAME', QUALIVO.senderName);
  QUALIVO.senderEmail = getProp('QUALIVO_SENDER_EMAIL', QUALIVO.senderEmail);
  QUALIVO.calendarLink = getProp('QUALIVO_CALENDAR_LINK', QUALIVO.calendarLink);
  QUALIVO.website = getProp('QUALIVO_WEBSITE', QUALIVO.website);
}

/** Indica si hay credenciales para una plataforma concreta. */
function hasCreds(platform) {
  switch (platform) {
    case 'Apollo':
      return !!getProp('APOLLO_API_KEY');
    case 'Smartlead':
      return !!getProp('SMARTLEAD_API_KEY') && !!getProp('SMARTLEAD_CAMPAIGN_ID');
    case 'HeyReach':
      return !!getProp('HEYREACH_API_KEY') && !!getProp('HEYREACH_LIST_ID');
    default:
      return false;
  }
}

/* ===================== Utils.gs ===================== */
/**
 * Utils.gs · helpers genéricos: HTTP, texto, fechas, normalización.
 */

/** Petición HTTP JSON. Devuelve {ok, code, json}. No lanza en errores HTTP. */
function httpJson(url, options) {
  options = options || {};
  options.muteHttpExceptions = true;
  var res = UrlFetchApp.fetch(url, options);
  var code = res.getResponseCode();
  var body = res.getContentText();
  var json;
  try {
    json = body ? JSON.parse(body) : {};
  } catch (e) {
    json = { _raw: body };
  }
  return { ok: (code >= 200 && code < 300), code: code, json: json, body: body };
}

/** Igual que httpJson pero lanza si el código no es 2xx (para llamadas críticas). */
function httpJsonOrThrow(url, options) {
  var r = httpJson(url, options);
  if (!r.ok) throw new Error('HTTP ' + r.code + ' en ' + url + ': ' + String(r.body).slice(0, 400));
  return r.json;
}

/**
 * Normaliza texto para comparar: minúsculas, sin tildes, sin signos raros.
 * "Generación de Leads (Senior)" -> "generacion de leads senior"
 */
function normalizeText(s) {
  if (!s) return '';
  return String(s)
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // quita tildes
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Extrae el dominio limpio de una URL o email. "https://www.acme.com/x" -> "acme.com" */
function cleanDomain(input) {
  if (!input) return '';
  var s = String(input).trim().toLowerCase();
  if (s.indexOf('@') >= 0) s = s.split('@').pop();
  s = s.replace(/^https?:\/\//, '').replace(/^www\./, '');
  s = s.split('/')[0].split('?')[0].split('#')[0];
  return s;
}

/** YYYY-MM-DD de hoy en la zona horaria de Qualivo. */
function today() {
  return Utilities.formatDate(new Date(), QUALIVO.timezone, 'yyyy-MM-dd');
}

/** Marca de tiempo legible "2026-07-09 14:32". */
function nowStamp() {
  return Utilities.formatDate(new Date(), QUALIVO.timezone, 'yyyy-MM-dd HH:mm');
}

/** Días transcurridos desde una fecha ISO (o '' si no se puede parsear). */
function daysSince(isoDate) {
  if (!isoDate) return null;
  var t = Date.parse(isoDate);
  if (isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}

/** Primer nombre a partir de "María López" -> "María". */
function firstName(full) {
  if (!full) return '';
  return String(full).trim().split(/\s+/)[0];
}

/** Log seguro a la consola de Apps Script. */
function logInfo() {
  try { console.log.apply(console, arguments); } catch (e) {}
}

/* ===================== Scoring.gs ===================== */
/**
 * Scoring.gs · detección de la señal en una oferta y puntuación del prospecto.
 */

/**
 * Categoría de una palabra clave (para el tono del mensaje y el peso del score).
 * Cualquier keyword no listada cae en 'general'.
 */
var SIGNAL_MAP = {
  leadgen: ['lead', 'leads', 'generacion de leads', 'lead generation', 'captacion',
    'demand generation', 'prospeccion', 'prospecting'],
  sales: ['sdr', 'bdr', 'sales development', 'inside sales', 'appointment setter',
    'closer', 'teleoperador', 'telemarketing', 'comercial', 'ventas'],
  crm: ['crm', 'hubspot', 'salesforce', 'gohighlevel', 'pipedrive', 'zoho'],
  automation: ['automatizacion', 'automation', 'revops', 'revenue operations',
    'sales operations', 'marketing operations', 'make', 'zapier', 'n8n'],
  marketing: ['growth', 'growth marketing', 'marketing automation', 'email marketing',
    'performance marketing', 'paid media', 'marketing digital', 'funnel',
    'embudo', 'nurturing', 'outbound']
};

/** Peso por categoría (una vacante de RevOps/automatización pesa más). */
var CATEGORY_WEIGHT = {
  automation: 30, crm: 28, leadgen: 26, sales: 22, marketing: 20, general: 16
};

/** Categoría a la que pertenece una keyword. */
function categoryOf(keyword) {
  var k = normalizeText(keyword);
  for (var cat in SIGNAL_MAP) {
    if (SIGNAL_MAP[cat].indexOf(k) >= 0) return cat;
  }
  return 'general';
}

/**
 * ¿El título de una oferta es una señal para Qualivo? Devuelve
 * {keyword, category} de la primera coincidencia, o null.
 */
function roleSignal(title) {
  var t = normalizeText(title);
  if (!t) return null;
  for (var i = 0; i < ROLE_KEYWORDS.length; i++) {
    var kw = normalizeText(ROLE_KEYWORDS[i]);
    // \b para no casar "crm" dentro de otra palabra; keyword multi-palabra: substring.
    var hit = kw.indexOf(' ') >= 0
      ? (t.indexOf(kw) >= 0)
      : new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(t);
    if (hit) return { keyword: ROLE_KEYWORDS[i], category: categoryOf(ROLE_KEYWORDS[i]) };
  }
  return null;
}

/**
 * Puntúa un prospecto (0-100) a partir de las ofertas relevantes detectadas,
 * el tamaño de la empresa y si tenemos email del decisor.
 * @param {Object} ctx - {matchedJobs:[{signal,category}], employees, hasEmail, hasContact}
 * @returns {Object} {score, priority}
 */
function scoreProspect(ctx) {
  var score = 0;

  // 1) Señal principal: categoría de la mejor oferta.
  var topCat = 'general';
  var topWeight = 0;
  (ctx.matchedJobs || []).forEach(function (j) {
    var w = CATEGORY_WEIGHT[j.category] || CATEGORY_WEIGHT.general;
    if (w > topWeight) { topWeight = w; topCat = j.category; }
  });
  score += topWeight;

  // 2) Varias ofertas relevantes = dolor más grande / presupuesto activo.
  var n = (ctx.matchedJobs || []).length;
  score += Math.min(n - 1, 3) * 8; // +8 por cada oferta extra, hasta +24

  // 3) Tamaño de empresa: sweet spot 11-200 empleados.
  var emp = parseInt(ctx.employees, 10) || 0;
  if (emp >= 11 && emp <= 200) score += 15;
  else if (emp > 200 && emp <= 500) score += 8;
  else if (emp > 0 && emp < 11) score += 4;

  // 4) Alcanzabilidad: decisor identificado y email disponible.
  if (ctx.hasContact) score += 8;
  if (ctx.hasEmail) score += 12;

  score = Math.max(0, Math.min(100, Math.round(score)));

  var priority = score >= 70 ? 'Alta' : (score >= 50 ? 'Media' : 'Baja');
  return { score: score, priority: priority };
}

/* ===================== Message.gs ===================== */
/**
 * Message.gs · genera el mensaje de contacto personalizado (email + LinkedIn)
 * a partir de la señal detectada (la oferta de empleo).
 */

/** Copy por categoría de señal: dolor detectado + propuesta de Qualivo. */
var COPY = {
  leadgen: {
    pain: 'generar leads de forma constante',
    propuesta: 'montamos un motor de captación (ads + landing + cualificación) que os llena la agenda de oportunidades, sin depender de una sola persona'
  },
  sales: {
    pain: 'hacer prospección y agendar más reuniones',
    propuesta: 'montamos la prospección outbound (email + LinkedIn) y os pasamos reuniones ya cualificadas directamente al calendario'
  },
  crm: {
    pain: 'poner orden en el CRM y que no se enfríe ningún lead',
    propuesta: 'implantamos y automatizamos vuestro CRM (GoHighLevel / HubSpot) con seguimiento automático de cada oportunidad'
  },
  automation: {
    pain: 'automatizar procesos que hoy os comen horas',
    propuesta: 'automatizamos vuestros flujos de captación, seguimiento y reporting con integraciones a medida'
  },
  marketing: {
    pain: 'que el marketing genere pipeline y no solo tráfico',
    propuesta: 'montamos el embudo completo (captación, nurturing y reporting) conectado a ventas'
  },
  general: {
    pain: 'captar y convertir más clientes',
    propuesta: 'montamos vuestro sistema de captación y automatización de principio a fin'
  }
};

/**
 * Construye el mensaje. `p` = {company, contactName, jobTitle, category}.
 * Devuelve {subject, body, linkedin}.
 */
function buildMessage(p) {
  var name = firstName(p.contactName) || 'hola';
  var greet = firstName(p.contactName) ? ('Hola ' + name + ',') : 'Hola,';
  var company = p.company || 'vuestra empresa';
  var offer = shortenOffer(p.jobTitle);
  var copy = COPY[p.category] || COPY.general;
  var cta = QUALIVO.calendarLink
    ? ('¿Te viene bien una llamada de 15 min esta semana? Aquí mi agenda: ' + QUALIVO.calendarLink)
    : '¿Te viene bien una llamada de 15 min esta semana para verlo?';
  var signoff = firmaQualivo();

  var subject = 'Vi que en ' + company + ' buscáis ' + offer;

  var body = [
    greet,
    '',
    'He visto que en ' + company + ' estáis buscando ' + (offer ? ('“' + offer + '”') : 'perfil para ' + copy.pain) +
      ' — normalmente eso significa que queréis ' + copy.pain + '.',
    '',
    'En ' + QUALIVO.name + ' hacemos justo eso como servicio: ' + copy.propuesta + '. ' +
      'Sin proceso de selección de meses ni contratar y formar: en pocas semanas tenéis el sistema funcionando.',
    '',
    cta,
    '',
    signoff
  ].join('\n');

  var linkedin = 'Hola ' + name + ', vi que en ' + company + ' buscáis ' + offer +
    '. En ' + QUALIVO.name + ' montamos eso como servicio (' + copy.pain +
    ') sin tener que contratar. ¿Te cuento en 15 min?';

  return { subject: subject, body: body, linkedin: linkedin };
}

/** Firma del remitente. */
function firmaQualivo() {
  var lines = ['Un saludo,'];
  lines.push(QUALIVO.senderName || QUALIVO.name);
  if (QUALIVO.senderName) lines.push(QUALIVO.name);
  if (QUALIVO.website) lines.push(QUALIVO.website);
  return lines.join('\n');
}

/** Acorta títulos largos de oferta para el asunto/cuerpo. */
function shortenOffer(title) {
  if (!title) return '';
  var t = String(title).split(/[|·\-–—(]/)[0].trim(); // corta en separadores
  if (t.length > 60) t = t.slice(0, 57).trim() + '…';
  return t;
}

/* ===================== Apollo.gs ===================== */
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

/* ===================== WebSources.gs ===================== */
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

/* ===================== Radar.gs ===================== */
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

  // ENVÍO AUTOMÁTICO (opcional): empuja los Cualificado con email a Smartlead,
  // que se encarga del envío real con warmup y límites. Solo si está activado.
  if (TARGET.autoSmartlead && hasCreds('Smartlead')) {
    var pushed = enviarASmartlead();
    logEvent('Auto-Smartlead', pushed + ' contactos añadidos a la secuencia automática');
  }

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

/* ===================== Sheet.gs ===================== */
/**
 * Sheet.gs · estructura y escritura de la hoja "Prospectos" + "_Log".
 */

/** Cabeceras de la tabla de prospectos (el orden define las columnas). */
var PROSPECT_HEADERS = [
  'Fecha',            // 0  detección
  'Empresa',          // 1
  'Dominio',          // 2  clave de deduplicación
  'Web',              // 3
  'Sector',           // 4
  'Empleados',        // 5
  'Ubicación',        // 6
  'Oferta detectada', // 7  título de la vacante
  'URL oferta',       // 8
  'Publicada',        // 9  fecha de publicación (si Apollo la da)
  'Señal',            // 10 palabra clave que disparó el match
  'Nº ofertas',       // 11 nº de ofertas relevantes abiertas
  'Score',            // 12 0-100
  'Prioridad',        // 13 Alta / Media / Baja
  'Decisor',          // 14 nombre
  'Cargo',            // 15
  'Email',            // 16
  'LinkedIn',         // 17
  'Estado',           // 18 PROSPECT_STATES
  'Canal',            // 19 Email / LinkedIn / Ambos
  'Asunto',           // 20 asunto del email sugerido
  'Mensaje sugerido', // 21 cuerpo del email sugerido
  'Notas'             // 22
];

/** Índice de columna (0-based) por nombre de cabecera. */
function col(name) {
  var i = PROSPECT_HEADERS.indexOf(name);
  if (i < 0) throw new Error('Columna desconocida: ' + name);
  return i;
}

/** Devuelve (creando si hace falta) la pestaña de prospectos con cabeceras. */
function prospectSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.prospects);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.prospects);
  }
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, PROSPECT_HEADERS.length).setValues([PROSPECT_HEADERS]);
    formatProspectSheet(sh);
  }
  return sh;
}

/** Formato de cabecera + validación de la columna Estado + anchos. */
function formatProspectSheet(sh) {
  var header = sh.getRange(1, 1, 1, PROSPECT_HEADERS.length);
  header.setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff')
    .setVerticalAlignment('middle');
  sh.setFrozenRows(1);

  // Desplegable de Estado.
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(PROSPECT_STATES, true).setAllowInvalid(true).build();
  sh.getRange(2, col('Estado') + 1, sh.getMaxRows() - 1, 1).setDataValidation(rule);

  // Anchos cómodos para las columnas de texto largo.
  sh.setColumnWidth(col('Empresa') + 1, 200);
  sh.setColumnWidth(col('Oferta detectada') + 1, 220);
  sh.setColumnWidth(col('Asunto') + 1, 260);
  sh.setColumnWidth(col('Mensaje sugerido') + 1, 420);
  sh.setColumnWidth(col('Notas') + 1, 220);
}

/** Conjunto de dominios ya presentes (para no duplicar empresas). */
function existingDomains() {
  var sh = prospectSheet();
  var last = sh.getLastRow();
  var set = {};
  if (last < 2) return set;
  var vals = sh.getRange(2, col('Dominio') + 1, last - 1, 1).getValues();
  vals.forEach(function (r) {
    var d = cleanDomain(r[0]);
    if (d) set[d] = true;
  });
  return set;
}

/**
 * Convierte un objeto prospecto en la fila (array) según PROSPECT_HEADERS.
 * @param {Object} p - ver buildProspect() en Radar.gs
 */
function prospectToRow(p) {
  var row = new Array(PROSPECT_HEADERS.length).fill('');
  row[col('Fecha')] = p.date || today();
  row[col('Empresa')] = p.company || '';
  row[col('Dominio')] = p.domain || '';
  row[col('Web')] = p.website || '';
  row[col('Sector')] = p.industry || '';
  row[col('Empleados')] = p.employees || '';
  row[col('Ubicación')] = p.location || '';
  row[col('Oferta detectada')] = p.jobTitle || '';
  row[col('URL oferta')] = p.jobUrl || '';
  row[col('Publicada')] = p.jobPostedAt || '';
  row[col('Señal')] = p.signal || '';
  row[col('Nº ofertas')] = p.jobCount || 0;
  row[col('Score')] = p.score || 0;
  row[col('Prioridad')] = p.priority || '';
  row[col('Decisor')] = p.contactName || '';
  row[col('Cargo')] = p.contactTitle || '';
  row[col('Email')] = p.contactEmail || '';
  row[col('LinkedIn')] = p.contactLinkedin || '';
  row[col('Estado')] = p.state || 'Nuevo';
  row[col('Canal')] = p.channel || '';
  row[col('Asunto')] = p.subject || '';
  row[col('Mensaje sugerido')] = p.message || '';
  row[col('Notas')] = p.notes || '';
  return row;
}

/** Añade varias filas de prospectos al final de la hoja. */
function appendProspects(prospects) {
  if (!prospects.length) return;
  var sh = prospectSheet();
  var rows = prospects.map(prospectToRow);
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, PROSPECT_HEADERS.length).setValues(rows);
}

/**
 * Lee las filas cuyo Estado esté en `states` (array). Devuelve objetos con el
 * número de fila real (`_row`) para poder actualizarlas después.
 */
function readProspectsByState(states) {
  var sh = prospectSheet();
  var last = sh.getLastRow();
  if (last < 2) return [];
  var values = sh.getRange(2, 1, last - 1, PROSPECT_HEADERS.length).getValues();
  var out = [];
  values.forEach(function (r, i) {
    var state = r[col('Estado')];
    if (states.indexOf(state) < 0) return;
    out.push({
      _row: i + 2,
      company: r[col('Empresa')],
      domain: r[col('Dominio')],
      contactName: r[col('Decisor')],
      contactEmail: r[col('Email')],
      contactLinkedin: r[col('LinkedIn')],
      jobTitle: r[col('Oferta detectada')],
      subject: r[col('Asunto')],
      message: r[col('Mensaje sugerido')],
      channel: r[col('Canal')]
    });
  });
  return out;
}

/** Escribe el Estado (y opcionalmente una nota) de una fila concreta. */
function setProspectState(rowNumber, state, note) {
  var sh = prospectSheet();
  sh.getRange(rowNumber, col('Estado') + 1).setValue(state);
  if (note) {
    var cell = sh.getRange(rowNumber, col('Notas') + 1);
    var prev = cell.getValue();
    cell.setValue(prev ? (prev + ' · ' + note) : note);
  }
}

/* --------------------------------- Log --------------------------------- */

/** Devuelve (creando) la pestaña _Log. */
function logSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.log);
  if (!sh) {
    sh = ss.insertSheet(SHEETS.log);
    sh.getRange(1, 1, 1, 3).setValues([['Cuándo', 'Evento', 'Detalle']]);
    sh.getRange(1, 1, 1, 3).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Registra una línea en _Log (y en la consola). */
function logEvent(event, detail) {
  logInfo(event, detail || '');
  try {
    logSheet().appendRow([nowStamp(), event, detail || '']);
  } catch (e) {}
}

/* ===================== Outreach.gs ===================== */
/**
 * Outreach.gs · capa de contacto. SIEMPRE bajo control humano: estas funciones
 * se lanzan desde el menú sobre filas ya revisadas, NUNCA desde el trigger
 * automático (que solo detecta y escribe). Así protegemos reputación de dominio
 * y cumplimiento (RGPD / LSSI en España).
 */

/** Máximo de acciones de contacto por lote (evita disparos masivos). */
var OUTREACH_BATCH = 30;

/**
 * Crea borradores de Gmail para los prospectos "Cualificado" que tengan email.
 * Deja el borrador en Gmail para revisar y enviar a mano. No envía nada.
 */
function generarBorradores() {
  applyConfigOverrides();
  var rows = readProspectsByState(['Cualificado']);
  var done = 0;
  for (var i = 0; i < rows.length && done < OUTREACH_BATCH; i++) {
    var p = rows[i];
    if (!p.contactEmail) continue;
    try {
      GmailApp.createDraft(p.contactEmail, p.subject || ('Propuesta para ' + p.company), p.message || '', {
        name: QUALIVO.senderName || QUALIVO.name
      });
      setProspectState(p._row, 'Borrador listo', 'Borrador Gmail creado ' + nowStamp());
      done++;
    } catch (e) {
      logEvent('Borrador error', p.company + ': ' + e);
    }
  }
  logEvent('Borradores generados', done + ' borradores de Gmail');
  return done;
}

/**
 * Empuja los prospectos con email a la campaña de Smartlead (en pausa, para
 * revisar). Cambia su estado a "En secuencia (Smartlead)".
 */
function enviarASmartlead() {
  applyConfigOverrides();
  if (!hasCreds('Smartlead')) { logEvent('Smartlead', 'Falta SMARTLEAD_API_KEY / SMARTLEAD_CAMPAIGN_ID'); return 0; }
  var rows = readProspectsByState(['Cualificado', 'Borrador listo']);
  var done = 0;
  for (var i = 0; i < rows.length && done < OUTREACH_BATCH; i++) {
    var p = rows[i];
    if (!p.contactEmail) continue;
    var ok = smartleadAddLead(p);
    if (ok) { setProspectState(p._row, 'En secuencia (Smartlead)', 'Añadido a Smartlead ' + nowStamp()); done++; }
  }
  logEvent('Enviados a Smartlead', done + ' contactos');
  return done;
}

/**
 * Empuja los prospectos con LinkedIn a la lista de HeyReach (para lanzar la
 * campaña desde HeyReach tras revisar).
 */
function enviarAHeyReach() {
  applyConfigOverrides();
  if (!hasCreds('HeyReach')) { logEvent('HeyReach', 'Falta HEYREACH_API_KEY / HEYREACH_LIST_ID'); return 0; }
  var rows = readProspectsByState(['Cualificado', 'Borrador listo']);
  var done = 0;
  for (var i = 0; i < rows.length && done < OUTREACH_BATCH; i++) {
    var p = rows[i];
    if (!p.contactLinkedin) continue;
    var ok = heyreachAddLead(p);
    if (ok) { setProspectState(p._row, 'En secuencia (HeyReach)', 'Añadido a HeyReach ' + nowStamp()); done++; }
  }
  logEvent('Enviados a HeyReach', done + ' contactos');
  return done;
}

/* ===================== Smartlead.gs ===================== */
/**
 * Smartlead.gs · añade un contacto a una campaña de Smartlead (email en frío
 * con warmup / deliverability). La campaña destino (SMARTLEAD_CAMPAIGN_ID)
 * debería estar EN PAUSA para revisar antes de que empiece a enviar.
 *
 * Doc: https://api.smartlead.ai/reference/add-leads-to-a-campaign-by-id
 */
var SMARTLEAD_BASE = 'https://server.smartlead.ai/api/v1';

/** Añade un prospecto como lead de la campaña. Devuelve true/false. */
function smartleadAddLead(p) {
  var key = getProp('SMARTLEAD_API_KEY');
  var campaignId = getProp('SMARTLEAD_CAMPAIGN_ID');
  var parts = splitName(p.contactName);

  var payload = {
    lead_list: [{
      email: p.contactEmail,
      first_name: parts.first,
      last_name: parts.last,
      company_name: p.company || '',
      // Variables que la plantilla de la campaña puede inyectar tal cual:
      //   Asunto del email  ->  {{asunto}}
      //   Cuerpo del email  ->  {{mensaje}}
      // Así el envío queda 100% personalizado sin escribir plantilla en Smartlead.
      custom_fields: {
        asunto: p.subject || '',
        mensaje: p.message || '',
        oferta_detectada: p.jobTitle || ''
      }
    }],
    // No pisar leads existentes ni parar el resto de la campaña.
    settings: { ignore_global_block_list: false, ignore_unsubscribe_list: false }
  };

  var url = SMARTLEAD_BASE + '/campaigns/' + encodeURIComponent(campaignId) +
    '/leads?api_key=' + encodeURIComponent(key);
  var r = httpJson(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  });
  if (!r.ok) { logEvent('Smartlead add error', p.company + ' HTTP ' + r.code + ' ' + String(r.body).slice(0, 160)); return false; }
  return true;
}

/** "María López García" -> {first:'María', last:'López García'} */
function splitName(full) {
  var s = String(full || '').trim();
  if (!s) return { first: '', last: '' };
  var parts = s.split(/\s+/);
  return { first: parts.shift(), last: parts.join(' ') };
}

/* ===================== HeyReach.gs ===================== */
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

/* ===================== ConfigSheet.gs ===================== */
/**
 * ConfigSheet.gs · pestaña `_Config` para introducir credenciales/ajustes y
 * volcarlos a las Script Properties (almacenamiento seguro del proyecto).
 */

/** Crea (si no existe) la pestaña _Config con las claves esperadas. */
function ensureConfigSheet() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SHEETS.config);
  if (!sh) sh = ss.insertSheet(SHEETS.config);

  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, 2).setValues([['Clave', 'Valor']]);
    sh.getRange(1, 1, 1, 2).setFontWeight('bold').setBackground('#1f2937').setFontColor('#ffffff');
    var props = PropertiesService.getScriptProperties();
    var rows = CREDENTIAL_KEYS.map(function (k) { return [k, props.getProperty(k) || '']; });
    sh.getRange(2, 1, rows.length, 2).setValues(rows);
    sh.setColumnWidth(1, 240);
    sh.setColumnWidth(2, 380);
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Abre / crea la pestaña _Config y la activa. */
function openConfigSheet() {
  var sh = ensureConfigSheet();
  SpreadsheetApp.setActiveSheet(sh);
  toast('Rellena los valores y luego "Guardar credenciales de _Config".');
}

/** Vuelca los valores de _Config a las Script Properties. */
function saveConfigFromSheet() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.config);
  if (!sh) { toast('No existe la hoja _Config.'); return; }
  var last = sh.getLastRow();
  if (last < 2) { toast('_Config está vacía.'); return; }
  var values = sh.getRange(2, 1, last - 1, 2).getValues();
  var props = PropertiesService.getScriptProperties();
  var saved = 0;
  values.forEach(function (r) {
    var key = String(r[0] || '').trim();
    var val = String(r[1] || '').trim();
    if (key && val) { props.setProperty(key, val); saved++; }
  });
  toast(saved + ' credenciales guardadas en Script Properties.');
}

/* ===================== Main.gs ===================== */
/**
 * Main.gs · menú, setup y triggers del Radar de Prospección.
 */

/** Menú al abrir la hoja. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Radar Qualivo')
    .addItem('▶ Ejecutar radar ahora', 'menuEjecutarRadar')
    .addItem('Inicializar / crear pestañas', 'setupRadar')
    .addSeparator()
    .addItem('✉ Generar borradores de email (Cualificados)', 'menuGenerarBorradores')
    .addItem('Enviar Cualificados a Smartlead', 'menuEnviarSmartlead')
    .addItem('Enviar Cualificados a HeyReach', 'menuEnviarHeyReach')
    .addSeparator()
    .addItem('Configurar credenciales (_Config)', 'openConfigSheet')
    .addItem('Guardar credenciales de _Config', 'saveConfigFromSheet')
    .addSeparator()
    .addItem('⏱ Programar radar diario (7:00)', 'instalarTriggerDiario')
    .addItem('Quitar radar programado', 'quitarTriggerDiario')
    .addToUi();
}

/** Crea las pestañas base (Prospectos, _Config, _Log). */
function setupRadar() {
  ensureConfigSheet();
  prospectSheet();
  logSheet();
  toast('Radar inicializado. Rellena _Config y ejecuta el radar.');
}

/* --------------------------- Acciones de menú -------------------------- */

function menuEjecutarRadar() {
  toast('Ejecutando radar… (puede tardar 1-2 min)');
  var n = ejecutarRadar();
  toast('Radar completado: ' + n + ' prospectos nuevos.');
}

function menuGenerarBorradores() {
  var n = generarBorradores();
  toast(n + ' borradores de Gmail creados (revísalos antes de enviar).');
}

function menuEnviarSmartlead() {
  var n = enviarASmartlead();
  toast(n + ' contactos enviados a Smartlead.');
}

function menuEnviarHeyReach() {
  var n = enviarAHeyReach();
  toast(n + ' contactos enviados a HeyReach.');
}

/* ------------------------------ Triggers ------------------------------ */

/** Instala (idempotente) un trigger diario a las 7:00 que ejecuta el radar. */
function instalarTriggerDiario() {
  quitarTriggerDiario();
  ScriptApp.newTrigger('radarProgramado').timeBased().atHour(7).everyDays(1).create();
  toast('Radar diario programado (7:00).');
}

/** Elimina el trigger programado del radar. */
function quitarTriggerDiario() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'radarProgramado') ScriptApp.deleteTrigger(t);
  });
}

/** Handler del trigger: solo DETECTA y escribe (nunca contacta). */
function radarProgramado() {
  ejecutarRadar();
}

/* ------------------------------- Helpers ------------------------------ */

function toast(msg) {
  try { SpreadsheetApp.getActive().toast(msg, 'Radar Qualivo', 6); } catch (e) {}
}

