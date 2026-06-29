/**
 * Config.gs
 * Configuración central del dashboard EAC.
 *
 * Las credenciales NO se guardan en el código. Se leen de las
 * "Script Properties" del proyecto (Configuración del proyecto → Propiedades
 * del script) o se cargan desde la pestaña oculta `_Config` con el menú
 * "EAC Dashboard → Configurar credenciales".
 */

/** Cliente / marca del dashboard. */
var CLIENT = {
  name: 'EAC',
  fullName: 'Escola Aeronàutica de Catalunya',
  website: 'escolaeronauticadecatalunya.cat',
  currency: 'EUR',
  currencySymbol: '€',
  timezone: 'Europe/Madrid',
  // Budget mensual contratado (EUR). Usado para el % de budget gastado.
  monthlyBudget: 4000
};

/** Nombres de las pestañas que gestiona el script. */
var SHEETS = {
  dashboard: 'Dashboard',
  comparativa: 'Comparativa',
  leads: 'Leads',
  config: '_Config',
  cache: '_Cache' // JSON normalizado por mes, oculto
};

/**
 * Etapas del pipeline (orden de visualización). Cada conector mapea sus
 * estados nativos a estas etapas canónicas vía STAGE_ALIASES.
 */
var PIPELINE_STAGES = [
  'Nuevo Lead',
  'Llamados',
  'Cita Programada',
  'Entrevistado',
  'Negociación',
  'Más adelante',
  'Plantón',
  'No localizado'
];

/** Estados de cierre / matrícula que se reportan aparte del pipeline abierto. */
var CLOSED_STATUSES = ['Won', 'Lost', 'Abandoned'];

/**
 * Alias para normalizar nombres de etapa que llegan de HubSpot / GHL
 * (sin tildes, mayúsculas distintas, typos del CRM, etc.).
 */
var STAGE_ALIASES = {
  'nuevo lead': 'Nuevo Lead',
  'new lead': 'Nuevo Lead',
  'llamados': 'Llamados',
  'llamado': 'Llamados',
  'called': 'Llamados',
  'cita programada': 'Cita Programada',
  'appointment scheduled': 'Cita Programada',
  'entrevistado': 'Entrevistado',
  'interviewed': 'Entrevistado',
  'negociacion': 'Negociación',
  'negociación': 'Negociación',
  'negotiation': 'Negociación',
  'mas adelante': 'Más adelante',
  'más adelante': 'Más adelante',
  'planton': 'Plantón',
  'plantón': 'Plantón',
  'no localizado': 'No localizado',
  'matriculado': 'Won',
  'won': 'Won',
  'ganado': 'Won',
  'lost': 'Lost',
  'perdido': 'Lost',
  'descartado': 'Lost',
  'abandoned': 'Abandoned',
  'abandonado': 'Abandoned'
};

/** Claves de credenciales esperadas en Script Properties. */
var CREDENTIAL_KEYS = [
  // Meta Marketing API
  'META_ACCESS_TOKEN',
  'META_AD_ACCOUNT_ID', // sin el prefijo act_, p.ej. 1234567890
  'META_API_VERSION', // opcional, por defecto v21.0
  // Google Ads API
  'GOOGLE_ADS_DEVELOPER_TOKEN',
  'GOOGLE_ADS_CLIENT_ID',
  'GOOGLE_ADS_CLIENT_SECRET',
  'GOOGLE_ADS_REFRESH_TOKEN',
  'GOOGLE_ADS_CUSTOMER_ID', // sin guiones, p.ej. 1234567890
  'GOOGLE_ADS_LOGIN_CUSTOMER_ID', // MCC, opcional
  // TikTok Marketing API
  'TIKTOK_ACCESS_TOKEN',
  'TIKTOK_ADVERTISER_ID',
  // HubSpot
  'HUBSPOT_TOKEN', // Private App token (Bearer)
  // GoHighLevel (LeadConnector v2)
  'GHL_TOKEN',
  'GHL_LOCATION_ID',
  'GHL_PIPELINE_ID' // opcional: limita a un pipeline concreto
];

/** Lee una propiedad del script (credencial / ajuste). */
function getProp(key, fallback) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return (v === null || v === '') ? (fallback === undefined ? '' : fallback) : v;
}

/** Indica si hay credenciales para una plataforma concreta. */
function hasCreds(platform) {
  switch (platform) {
    case 'Meta':
      return !!getProp('META_ACCESS_TOKEN') && !!getProp('META_AD_ACCOUNT_ID');
    case 'Google':
      return !!getProp('GOOGLE_ADS_DEVELOPER_TOKEN') && !!getProp('GOOGLE_ADS_REFRESH_TOKEN') && !!getProp('GOOGLE_ADS_CUSTOMER_ID');
    case 'TikTok':
      return !!getProp('TIKTOK_ACCESS_TOKEN') && !!getProp('TIKTOK_ADVERTISER_ID');
    case 'HubSpot':
      return !!getProp('HUBSPOT_TOKEN');
    case 'GHL':
      return !!getProp('GHL_TOKEN') && !!getProp('GHL_LOCATION_ID');
    default:
      return false;
  }
}
