/**
 * InstagramPublish.gs
 * Publicación de contenido en Instagram vía Instagram Graph API (Content Publishing).
 *
 * A diferencia del resto de conectores (solo lectura de métricas), este módulo
 * ESCRIBE: crea y publica posts en una cuenta de Instagram Business/Creator.
 *
 * Credenciales (Script Properties / hoja _Config):
 *   IG_USER_ID       - id de la cuenta de Instagram Business (IG User ID,
 *                      p.ej. 17841400000000000). NO es el @usuario ni el id de Página.
 *   IG_ACCESS_TOKEN  - token de acceso (Página o System User) con permisos:
 *                      instagram_basic, instagram_content_publish,
 *                      pages_read_engagement (+ instagram_manage_insights para auditar).
 *   IG_API_VERSION   - opcional, por defecto el de META_API_VERSION o v21.0.
 *
 * Flujo de la API (2 pasos):
 *   1) Crear un "contenedor" de medios  -> POST /{ig-user-id}/media
 *   2) Publicar el contenedor           -> POST /{ig-user-id}/media_publish
 * Para vídeo/Reels/stories de vídeo el contenedor se procesa de forma asíncrona:
 * hay que sondear su status_code hasta FINISHED antes de publicar.
 *
 * IMPORTANTE: Instagram DESCARGA el medio desde una URL pública (image_url /
 * video_url). No se sube el binario; el fichero debe estar accesible por HTTP(S).
 *
 * Doc: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 */

/* ------------------------------ Config base ------------------------------ */

/** Versión de la Graph API a usar para Instagram. */
function igApiVersion() {
  return getProp('IG_API_VERSION', getProp('META_API_VERSION', 'v21.0'));
}

/** Base de la Graph API, p.ej. https://graph.facebook.com/v21.0 */
function igGraphBase() {
  return 'https://graph.facebook.com/' + igApiVersion();
}

/** Lee y valida las credenciales de publicación de Instagram. */
function igCreds() {
  var userId = getProp('IG_USER_ID');
  var token = getProp('IG_ACCESS_TOKEN');
  if (!userId || !token) {
    throw new Error('Faltan credenciales de Instagram (IG_USER_ID / IG_ACCESS_TOKEN). ' +
      'Configúralas en la hoja _Config.');
  }
  return { userId: userId, token: token };
}

/* ------------------------------ HTTP helpers ----------------------------- */

/**
 * POST a la Graph API con parámetros url-encoded. Añade el access_token.
 * @param {string} path  - ruta relativa a la base, p.ej. '/{ig-user-id}/media'
 * @param {Object} params - parámetros del cuerpo (sin access_token)
 */
function igPost(path, params) {
  var creds = igCreds();
  var payload = {};
  Object.keys(params || {}).forEach(function (k) {
    if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
      payload[k] = params[k];
    }
  });
  payload.access_token = creds.token;
  return httpJson(igGraphBase() + path, {
    method: 'post',
    payload: payload
  });
}

/** GET a la Graph API con parámetros en query string. Añade el access_token. */
function igGet(path, params) {
  var creds = igCreds();
  var q = Object.assign({}, params || {}, { access_token: creds.token });
  return httpJson(igGraphBase() + path + '?' + toQuery(q));
}

/* --------------------------- Límite de publicación ------------------------ */

/**
 * Uso del cupo de publicación de las últimas 24h. Instagram limita a 50
 * publicaciones/día por cuenta (contenedores de carrusel cuentan como 1).
 * @return {{quota: number, used: number, remaining: number}}
 */
function igPublishingUsage() {
  var creds = igCreds();
  var json = igGet('/' + creds.userId + '/content_publishing_limit', {
    fields: 'config,quota_usage'
  });
  var row = (json.data && json.data[0]) || {};
  var quota = (row.config && toNumber(row.config.quota_total)) || 50;
  var used = toNumber(row.quota_usage);
  return { quota: quota, used: used, remaining: Math.max(0, quota - used) };
}

/* ------------------------- Contenedor + publicación ----------------------- */

/**
 * Crea un contenedor de medios y devuelve su id (creation_id).
 * @param {Object} params - campos del contenedor (image_url, video_url,
 *   media_type, caption, is_carousel_item, children, cover_url, share_to_feed…)
 */
function igCreateContainer(params) {
  var creds = igCreds();
  var json = igPost('/' + creds.userId + '/media', params);
  if (!json.id) throw new Error('La API no devolvió id de contenedor: ' + JSON.stringify(json));
  return json.id;
}

/**
 * Sondea el estado de un contenedor hasta que termine de procesarse.
 * Necesario para vídeo / Reels / stories de vídeo (procesado asíncrono).
 * @param {string} containerId
 * @param {Object} [opts] - { timeoutMs=300000, intervalMs=5000 }
 */
function igWaitContainer(containerId, opts) {
  opts = opts || {};
  var timeoutMs = opts.timeoutMs || 300000; // 5 min (límite práctico de Apps Script)
  var intervalMs = opts.intervalMs || 5000;
  var waited = 0;
  while (waited < timeoutMs) {
    var json = httpJson(igGraphBase() + '/' + containerId + '?' +
      toQuery({ fields: 'status_code,status', access_token: igCreds().token }));
    var code = json.status_code;
    if (code === 'FINISHED') return true;
    if (code === 'ERROR' || code === 'EXPIRED') {
      throw new Error('El contenedor ' + containerId + ' falló: ' +
        (json.status || code));
    }
    Utilities.sleep(intervalMs);
    waited += intervalMs;
  }
  throw new Error('Tiempo de espera agotado procesando el contenedor ' + containerId +
    ' (sigue IN_PROGRESS tras ' + Math.round(timeoutMs / 1000) + 's).');
}

/**
 * Publica un contenedor ya creado (y procesado). Devuelve el id del post.
 * @param {string} creationId
 */
function igPublishContainer(creationId) {
  var creds = igCreds();
  var json = igPost('/' + creds.userId + '/media_publish', { creation_id: creationId });
  if (!json.id) throw new Error('No se pudo publicar: ' + JSON.stringify(json));
  return json.id;
}

/**
 * Devuelve el permalink de un medio publicado (para confirmar/loguear).
 * @param {string} mediaId
 */
function igPermalink(mediaId) {
  try {
    var json = igGet('/' + mediaId, { fields: 'permalink' });
    return json.permalink || '';
  } catch (e) {
    return '';
  }
}

/* ----------------------------- Alto nivel -------------------------------- */

/**
 * Publica una foto en el feed.
 * @param {string} imageUrl - URL pública de la imagen (JPG/PNG).
 * @param {string} [caption] - pie de foto (hasta 2200 caracteres, 30 hashtags).
 * @return {{id: string, permalink: string}}
 */
function igPublishPhoto(imageUrl, caption) {
  if (!imageUrl) throw new Error('igPublishPhoto: falta imageUrl');
  var containerId = igCreateContainer({ image_url: imageUrl, caption: caption });
  var id = igPublishContainer(containerId);
  return { id: id, permalink: igPermalink(id) };
}

/**
 * Publica un Reel (vídeo vertical). Instagram publica todo el vídeo del feed
 * como Reel; usa share_to_feed=false si NO quieres que aparezca en la pestaña de feed.
 * @param {string} videoUrl - URL pública del vídeo (MP4/MOV, H.264/AAC).
 * @param {string} [caption]
 * @param {Object} [opts] - { coverUrl, shareToFeed=true, thumbOffset }
 * @return {{id: string, permalink: string}}
 */
function igPublishReel(videoUrl, caption, opts) {
  if (!videoUrl) throw new Error('igPublishReel: falta videoUrl');
  opts = opts || {};
  var containerId = igCreateContainer({
    media_type: 'REELS',
    video_url: videoUrl,
    caption: caption,
    cover_url: opts.coverUrl,
    thumb_offset: opts.thumbOffset,
    share_to_feed: (opts.shareToFeed === false) ? 'false' : 'true'
  });
  igWaitContainer(containerId, opts);
  var id = igPublishContainer(containerId);
  return { id: id, permalink: igPermalink(id) };
}

/**
 * Publica una Story (imagen o vídeo). Pasa imageUrl O videoUrl.
 * @param {Object} spec - { imageUrl } | { videoUrl }
 * @return {{id: string, permalink: string}}
 */
function igPublishStory(spec) {
  spec = spec || {};
  var params = { media_type: 'STORIES' };
  if (spec.videoUrl) {
    params.video_url = spec.videoUrl;
  } else if (spec.imageUrl) {
    params.image_url = spec.imageUrl;
  } else {
    throw new Error('igPublishStory: falta imageUrl o videoUrl');
  }
  var containerId = igCreateContainer(params);
  if (spec.videoUrl) igWaitContainer(containerId, spec);
  var id = igPublishContainer(containerId);
  return { id: id, permalink: igPermalink(id) };
}

/**
 * Publica un carrusel (2–10 elementos de imagen y/o vídeo).
 * @param {Array<Object>} items - cada uno { imageUrl } | { videoUrl }
 * @param {string} [caption]
 * @param {Object} [opts] - pasado al sondeo de contenedores de vídeo
 * @return {{id: string, permalink: string}}
 */
function igPublishCarousel(items, caption, opts) {
  if (!items || items.length < 2) throw new Error('Un carrusel necesita al menos 2 elementos');
  if (items.length > 10) throw new Error('Un carrusel admite como máximo 10 elementos');
  opts = opts || {};

  // 1) Crear un contenedor hijo por elemento.
  var childIds = items.map(function (it) {
    var p = { is_carousel_item: 'true' };
    var isVideo = !!it.videoUrl;
    if (isVideo) { p.media_type = 'VIDEO'; p.video_url = it.videoUrl; }
    else if (it.imageUrl) { p.image_url = it.imageUrl; }
    else { throw new Error('Elemento de carrusel sin imageUrl ni videoUrl'); }
    var cid = igCreateContainer(p);
    return { id: cid, isVideo: isVideo };
  });

  // 2) Esperar a que los vídeos terminen de procesarse.
  childIds.forEach(function (c) { if (c.isVideo) igWaitContainer(c.id, opts); });

  // 3) Crear el contenedor padre del carrusel.
  var parentId = igCreateContainer({
    media_type: 'CAROUSEL',
    caption: caption,
    children: childIds.map(function (c) { return c.id; }).join(',')
  });
  igWaitContainer(parentId, { timeoutMs: opts.timeoutMs || 120000 });

  // 4) Publicar.
  var id = igPublishContainer(parentId);
  return { id: id, permalink: igPermalink(id) };
}

/**
 * Dispatcher genérico. Publica según spec.type.
 * @param {Object} spec
 *   { type: 'PHOTO', imageUrl, caption }
 *   { type: 'REEL',  videoUrl, caption, coverUrl, shareToFeed }
 *   { type: 'STORY', imageUrl|videoUrl }
 *   { type: 'CAROUSEL', items:[{imageUrl|videoUrl}], caption }
 * @return {{id: string, permalink: string}}
 */
function igPublish(spec) {
  spec = spec || {};
  switch (String(spec.type || '').toUpperCase()) {
    case 'PHOTO':
    case 'IMAGE':
      return igPublishPhoto(spec.imageUrl, spec.caption);
    case 'REEL':
    case 'VIDEO':
      return igPublishReel(spec.videoUrl, spec.caption, {
        coverUrl: spec.coverUrl,
        shareToFeed: spec.shareToFeed,
        thumbOffset: spec.thumbOffset
      });
    case 'STORY':
      return igPublishStory(spec);
    case 'CAROUSEL':
      return igPublishCarousel(spec.items, spec.caption, spec);
    default:
      throw new Error('Tipo de publicación no soportado: ' + spec.type);
  }
}

/* --------------------------- Prueba desde el menú ------------------------- */

/**
 * Publica una imagen de prueba leyendo los parámetros de la pestaña _Config
 * (filas IG_TEST_IMAGE_URL / IG_TEST_CAPTION). Útil para validar credenciales.
 * Se invoca desde el menú "EAC Dashboard → Instagram: publicar prueba".
 */
function igPublishTestFromConfig() {
  var ui = SpreadsheetApp.getUi();
  try {
    var imageUrl = getProp('IG_TEST_IMAGE_URL');
    var caption = getProp('IG_TEST_CAPTION', '');
    if (!imageUrl) {
      ui.alert('Instagram', 'Rellena IG_TEST_IMAGE_URL en la hoja _Config (URL pública de una imagen) ' +
        'y "Guardar credenciales" antes de probar.', ui.ButtonSet.OK);
      return;
    }
    var usage = igPublishingUsage();
    var resp = ui.alert('Instagram — publicar prueba',
      'Se publicará una foto en la cuenta configurada.\n\n' +
      'Imagen: ' + imageUrl + '\n' +
      'Caption: ' + (caption || '(vacío)') + '\n\n' +
      'Cupo 24h: ' + usage.used + '/' + usage.quota + ' usados (' + usage.remaining + ' libres).\n\n' +
      '¿Publicar ahora?', ui.ButtonSet.YES_NO);
    if (resp !== ui.Button.YES) { toast('Publicación cancelada'); return; }

    toast('Publicando en Instagram…');
    var out = igPublishPhoto(imageUrl, caption);
    ui.alert('Instagram', 'Publicado ✅\n\nID: ' + out.id +
      (out.permalink ? '\n' + out.permalink : ''), ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Instagram — error', String(e), ui.ButtonSet.OK);
    logInfo('igPublishTestFromConfig error', e);
  }
}
