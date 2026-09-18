/**
 * Config.gs — HackTheLead · Dashboard + Alertas de leads
 *
 * Proyecto Apps Script independiente (vinculado a su propio Google Sheet) que:
 *   1. Pinta un dashboard por CAMPAÑA y por ANUNCIO de las campañas HTL_ de Meta.
 *   2. Avisa por email cada vez que entra un lead nuevo en los formularios.
 *
 * Credenciales / ajustes (Script Properties — Configuración del proyecto):
 *   HTL_META_TOKEN     - Token de Meta. IMPORTANTE: debe ser de LARGA DURACIÓN
 *                        (System User de Business Manager). Los triggers corren
 *                        solos; un token que caduca en 1-2 h NO sirve.
 *   HTL_AD_ACCOUNT_ID  - 3453332464718877  (sin el prefijo act_)
 *   HTL_FORM_IDS       - IDs de formularios a vigilar, separados por coma.
 *                        p.ej: 1699166241130533
 *   HTL_ALERT_EMAIL    - Email de aviso (info@maikelechevarria.com)
 *   HTL_PAGE_ID        - 359073050620335  (página de Qualivo; para leer leads)
 *   HTL_API_VERSION    - opcional (por defecto v21.0)
 *   HTL_DATE_PRESET    - opcional (maximum | last_30d | last_7d | today)
 *   HTL_NAME_FILTER    - opcional, prefijo/substring de campañas (por defecto HTL)
 */

var HTL = {
  defaultVersion: 'v21.0',
  defaultDatePreset: 'maximum',
  defaultNameFilter: 'HTL',
  sheets: { campaigns: 'Campañas', ads: 'Anuncios' }
};

/** Lee una propiedad del script. */
function htlProp(key, fallback) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return (v === null || v === '') ? (fallback === undefined ? '' : fallback) : v;
}

/** Guarda una propiedad del script. */
function htlSetProp(key, value) {
  PropertiesService.getScriptProperties().setProperty(key, String(value));
}

function htlToken() { return htlProp('HTL_META_TOKEN'); }
function htlAcct() { return htlProp('HTL_AD_ACCOUNT_ID'); }
function htlVer() { return htlProp('HTL_API_VERSION', HTL.defaultVersion); }
function htlDatePreset() { return htlProp('HTL_DATE_PRESET', HTL.defaultDatePreset); }
function htlNameFilter() { return htlProp('HTL_NAME_FILTER', HTL.defaultNameFilter); }
function htlAlertEmail() { return htlProp('HTL_ALERT_EMAIL'); }
function htlPageId() { return htlProp('HTL_PAGE_ID'); }

/** Lista de IDs de formularios a vigilar. */
function htlFormIds() {
  return htlProp('HTL_FORM_IDS').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}

/** Comprueba que estén las credenciales mínimas. */
function htlHasCreds() {
  return !!htlToken() && !!htlAcct();
}
