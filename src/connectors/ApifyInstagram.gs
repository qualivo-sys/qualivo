/**
 * ApifyInstagram.gs
 * Conector Apify — "la máquina" que extrae perfiles de Instagram.
 *
 * Lanza un actor de Apify (por defecto `apify~instagram-scraper`), espera a que
 * termine el run y devuelve los items del dataset ya mapeados a perfiles.
 *
 * Credenciales (Script Properties):
 *   APIFY_TOKEN      - API token de Apify (https://console.apify.com/account/integrations)
 *   APIFY_ACTOR_ID   - opcional, actor por defecto (p.ej. apify~instagram-scraper)
 *
 * Doc API: https://docs.apify.com/api/v2
 */

/** Actor de Apify por defecto (formato usuario~nombre para la API). */
var APIFY_DEFAULT_ACTOR = 'apify~instagram-scraper';

/**
 * Ejecuta un actor de Apify y devuelve los items del dataset (array).
 * Patrón asíncrono: lanza el run, hace polling del estado y al terminar
 * descarga el dataset. Encaja en el límite de 6 min de Apps Script.
 *
 * @param {string} actorId  - id del actor (usuario~nombre o id técnico)
 * @param {Object} input    - input JSON que espera el actor
 * @param {number} maxWaitS - segundos máximos de espera (por defecto 180)
 * @return {Array<Object>}  - items crudos del dataset
 */
function apifyRunActor(actorId, input, maxWaitS) {
  var token = getProp('APIFY_TOKEN');
  if (!token) throw new Error('Falta APIFY_TOKEN en _Config');
  actorId = actorId || getProp('APIFY_ACTOR_ID', APIFY_DEFAULT_ACTOR);
  maxWaitS = maxWaitS || 180;

  // 1) Lanzar el run.
  var runUrl = 'https://api.apify.com/v2/acts/' + encodeURIComponent(actorId) +
    '/runs?token=' + encodeURIComponent(token);
  var started = httpJson(runUrl, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(input || {})
  });
  var run = started.data;
  if (!run || !run.id) throw new Error('Apify: no se pudo iniciar el run');

  // 2) Polling del estado hasta SUCCEEDED (o error).
  var statusUrl = 'https://api.apify.com/v2/actor-runs/' + run.id +
    '?token=' + encodeURIComponent(token);
  var waited = 0;
  var stepS = 6;
  while (waited < maxWaitS) {
    Utilities.sleep(stepS * 1000);
    waited += stepS;
    var st = httpJson(statusUrl).data;
    if (st.status === 'SUCCEEDED') {
      return apifyDatasetItems(st.defaultDatasetId, token);
    }
    if (['FAILED', 'ABORTED', 'TIMED-OUT', 'TIMED_OUT'].indexOf(st.status) >= 0) {
      throw new Error('Apify: el run terminó en estado ' + st.status);
    }
  }
  throw new Error('Apify: timeout (' + maxWaitS + 's) esperando el run. ' +
    'Reduce el límite de resultados o usa un actor más rápido.');
}

/** Descarga los items (limpios) de un dataset de Apify. */
function apifyDatasetItems(datasetId, token) {
  if (!datasetId) return [];
  var url = 'https://api.apify.com/v2/datasets/' + datasetId +
    '/items?clean=true&format=json&token=' + encodeURIComponent(token);
  var items = httpJson(url);
  return Array.isArray(items) ? items : [];
}

/**
 * Normaliza un item de Apify a un perfil de Instagram con campos estables.
 * Tolera los distintos nombres de campo de los actores de IG más comunes
 * (instagram-scraper, instagram-profile-scraper, hashtag-scraper…).
 *
 * @return {Object|null} - {username, fullName, biography, followers, verified,
 *                          profilePic, url} o null si no hay handle.
 */
function mapIgProfile(item) {
  if (!item || typeof item !== 'object') return null;
  var username = item.username || item.ownerUsername || item.owner_username ||
    (item.owner && item.owner.username) || '';
  if (!username) return null;

  var pic = item.profilePicUrlHD || item.profilePicUrl || item.profile_pic_url_hd ||
    item.profile_pic_url || (item.owner && item.owner.profile_pic_url) || '';

  var followers = item.followersCount != null ? item.followersCount :
    (item.followers != null ? item.followers :
    (item.edge_followed_by && item.edge_followed_by.count));

  return {
    username: String(username).replace(/^@/, ''),
    fullName: item.fullName || item.ownerFullName || item.full_name || item.name || '',
    biography: item.biography || item.bio || '',
    followers: toNumber(followers),
    verified: !!(item.verified || item.isVerified || item.is_verified),
    profilePic: pic || '',
    url: item.url || item.inputUrl || ('https://www.instagram.com/' + String(username).replace(/^@/, '') + '/')
  };
}

/**
 * Construye un input razonable para `apify~instagram-scraper` a partir de una
 * fuente escrita en lenguaje llano. Sólo se usa como ayuda cuando el usuario no
 * pega un JSON propio en la hoja IG_Extractor.
 *
 *   '@nasa'                       -> detalles del perfil
 *   'https://instagram.com/nasa'  -> detalles del perfil por URL directa
 *   '#catalunya'                  -> posts del hashtag (devuelve ownerUsername)
 *   'escuela de vuelo'            -> búsqueda de usuarios
 */
function apifyBuildInput(source, limit) {
  source = String(source || '').trim();
  limit = limit || 50;
  if (/^https?:\/\//i.test(source)) {
    return { directUrls: [source], resultsType: 'details', resultsLimit: limit };
  }
  if (source.charAt(0) === '@') {
    var url = 'https://www.instagram.com/' + source.slice(1).replace(/\/$/, '') + '/';
    return { directUrls: [url], resultsType: 'details', resultsLimit: limit };
  }
  if (source.charAt(0) === '#') {
    return {
      search: source.slice(1), searchType: 'hashtag', searchLimit: 1,
      resultsType: 'posts', resultsLimit: limit
    };
  }
  return { search: source, searchType: 'user', searchLimit: limit, resultsType: 'details' };
}
