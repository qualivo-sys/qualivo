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
  website: 'qualivo.io',
  senderName: '',        // QUALIVO_SENDER_NAME
  senderEmail: '',       // QUALIVO_SENDER_EMAIL (remitente de los borradores)
  calendarLink: ''       // QUALIVO_CALENDAR_LINK (Calendly / Google Calendar)
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
