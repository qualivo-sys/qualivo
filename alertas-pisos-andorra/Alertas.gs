/*******************************************************************************
 * Alertas de pisos en Andorra  ·  Google Apps Script
 * ---------------------------------------------------------------------------
 * Vigila los portales inmobiliarios de Andorra y te avisa por email (y, si
 * quieres, por Telegram) EN CUANTO aparece un piso nuevo que cumple tus
 * filtros: precio, habitaciones, parroquia y terraza/balcón. Pensado para
 * llegar el primero y ser el primero en contactar.
 *
 * Portales incluidos:  Pisos.ad  ·  Habitaclia
 * (arquitectura extensible: ver FUENTES al final para añadir más)
 *
 * ─── Puesta en marcha (una sola vez) ─────────────────────────────────────
 *   1. Rellena el objeto CONFIG (sobre todo EMAILS y los filtros).
 *   2. Ejecuta la función  instalar()  y autoriza los permisos.
 *      -> Crea el trigger cada X minutos y hace una primera carga SIN spam:
 *         te manda un email resumen del inventario que ya cumple ahora mismo.
 *   3. Listo. A partir de ahí solo recibirás avisos de pisos NUEVOS.
 *
 * ─── Funciones que puedes ejecutar a mano ────────────────────────────────
 *   instalar()      Crea el trigger periódico + arranque inicial.
 *   revisarAhora()  Una revisión manual (es la que corre el trigger).
 *   desinstalar()   Borra los triggers (deja de vigilar).
 *   pruebaEmail()   Manda un email de prueba para verificar el canal.
 *   reset()         Olvida todos los anuncios vistos (empezar de cero).
 ******************************************************************************/

var CONFIG = {
  // ── A quién avisar (separa varios con comas) ──────────────────────────
  EMAILS: 'info@maikelechevarria.com, EMAIL_DE_ISA_AQUI',

  // ── Filtros de búsqueda ───────────────────────────────────────────────
  MAX_PRECIO: 1500,               // € al mes
  MAX_HABITACIONES: 2,
  EXIGIR_TERRAZA: true,           // solo pisos con terraza o balcón
  AVISAR_SI_TERRAZA_DUDOSA: true, // si no se confirma, avisar igual (marcado)

  // Parroquias/zonas aceptadas. [] = toda Andorra (las 7 parroquias + Santa Coloma).
  // Para restringir, añade nombres, p.ej.: ['encamp', 'la massana', 'ordino'].
  PARROQUIAS: [],

  // Tipos de vivienda que NO interesan (se descartan casas, locales, etc.)
  EXCLUIR_TIPOS: [
    'casa', 'chalet', 'local', 'nave', 'terreno', 'parking', 'garaje',
    'box', 'oficina', 'edificio', 'solar', 'traspaso', 'habitacion', 'hotel',
    'finca'
  ],

  // ── Fuentes ───────────────────────────────────────────────────────────
  USAR_PISOS_AD: true,
  USAR_HABITACLIA: true,
  USAR_PISOS_COM: true,
  MAX_PAGINAS: 12,                // páginas máximas a revisar por portal

  // ── Cada cuánto revisar (minutos): 1, 5, 10, 15 o 30 ──────────────────
  INTERVALO_MIN: 10,

  // ── Telegram (opcional, aún más rápido que el email). Deja vacío si no. ─
  TELEGRAM_BOT_TOKEN: '',
  TELEGRAM_CHAT_ID: '',

  // ── Avanzado ──────────────────────────────────────────────────────────
  DIAS_MEMORIA: 45,               // olvida anuncios vistos tras estos días
  UA: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};


/* ============================================================================
 * PUNTO DE ENTRADA
 * ==========================================================================*/

/** Instala el trigger periódico y hace el arranque inicial (sin spam). */
function instalar() {
  desinstalar();
  var min = [1, 5, 10, 15, 30].indexOf(CONFIG.INTERVALO_MIN) >= 0 ? CONFIG.INTERVALO_MIN : 10;
  ScriptApp.newTrigger('revisarAhora').timeBased().everyMinutes(min).create();
  Logger.log('Trigger creado: cada ' + min + ' min. Ejecutando arranque inicial...');
  revisarAhora();
}

/** Borra todos los triggers de este script. */
function desinstalar() {
  var t = ScriptApp.getProjectTriggers();
  for (var i = 0; i < t.length; i++) {
    if (t[i].getHandlerFunction() === 'revisarAhora') ScriptApp.deleteTrigger(t[i]);
  }
  Logger.log('Triggers borrados.');
}

/** Revisión principal. La ejecuta el trigger; también puedes lanzarla a mano. */
function revisarAhora() {
  var vistos = cargarVistos();
  var esArranque = numKeys(vistos) === 0;
  var ahora = Math.floor(Date.now() / 1000);

  var listings = recolectar();
  if (listings.length === 0) {
    Logger.log('No se obtuvieron anuncios (portales caídos o bloqueados). Reintentaré.');
    return;
  }

  // Detecta anuncios nunca vistos y los marca en memoria.
  var nuevosProps = {};
  var candidatos = [];
  for (var i = 0; i < listings.length; i++) {
    var l = listings[i];
    if (vistos[l.clave] == null) {
      nuevosProps['v_' + l.clave] = String(ahora);
      vistos[l.clave] = ahora;
      candidatos.push(l);
    }
  }

  // Filtra los candidatos por precio / habitaciones / parroquia / tipo / terraza.
  var matches = [];
  for (var j = 0; j < candidatos.length; j++) {
    var c = candidatos[j];
    if (!cumpleFiltros(c)) continue;
    c.terraza = evaluarTerraza(c, /*permitirFetch=*/ !esArranque);
    if (!pasaTerraza(c)) continue;
    matches.push(c);
  }

  // Persiste la memoria y purga lo antiguo.
  if (numKeys(nuevosProps) > 0) guardarVistos(nuevosProps);
  purgar(ahora);

  Logger.log('Revisados ' + listings.length + ' anuncios · nuevos ' + candidatos.length +
             ' · coincidencias ' + matches.length + (esArranque ? ' (arranque)' : ''));

  if (esArranque) {
    // Primera vez: un único email resumen, aunque no haya coincidencias.
    enviarEmail(matches, true);
    return;
  }
  if (matches.length > 0) {
    enviarEmail(matches, false);
    enviarTelegram(matches);
  }
}


/* ============================================================================
 * RECOLECCIÓN + PARSEO DE PORTALES
 * ==========================================================================*/

/** Descarga y parsea todas las fuentes activas; devuelve anuncios únicos. */
function recolectar() {
  var todos = [];
  for (var f = 0; f < FUENTES.length; f++) {
    var fuente = FUENTES[f];
    if (!fuente.activa()) continue;
    try {
      var items = recolectarFuente(fuente);
      Logger.log(fuente.nombre + ': ' + items.length + ' anuncios');
      todos = todos.concat(items);
    } catch (e) {
      Logger.log('Error en ' + fuente.nombre + ': ' + e);
    }
  }
  // Dedup por clave (un mismo piso puede salir en dos portales).
  var vistos = {}, out = [];
  for (var i = 0; i < todos.length; i++) {
    if (!vistos[todos[i].clave]) { vistos[todos[i].clave] = 1; out.push(todos[i]); }
  }
  return out;
}

/** Pagina una fuente hasta que no aparecen anuncios nuevos o se llega al tope. */
function recolectarFuente(fuente) {
  var res = [], vistos = {};
  for (var p = 1; p <= CONFIG.MAX_PAGINAS; p++) {
    var html = fetchHtml(fuente.url(p));
    if (!html) break;
    var items = fuente.parse(html);
    if (items.length === 0) break;
    var nuevos = 0;
    for (var i = 0; i < items.length; i++) {
      if (!vistos[items[i].clave]) { vistos[items[i].clave] = 1; res.push(items[i]); nuevos++; }
    }
    if (nuevos === 0) break; // página repetida → fin de resultados
  }
  return res;
}

/** Parser de Pisos.ad (tarjetas .list-item). */
function parsePisosAd(html) {
  var out = [], seen = {};
  var blocks = html.split('list-item clearfix');
  for (var i = 1; i < blocks.length; i++) {
    var b = blocks[i];
    var mLink = b.match(/href="(\/es\/alquiler\/([a-z0-9\-]+)\/(\d+))"/);
    if (!mLink) continue;
    var path = mLink[1], slug = mLink[2], id = mLink[3];
    if (seen[id]) continue; seen[id] = 1;

    var mTit = b.match(/list-item__title[\s\S]{0,180}?title="([^"]+)"/);
    var titulo = mTit ? decodeEntities(mTit[1]) : decodeEntities(slug.replace(/-/g, ' '));

    var mHab = b.match(/list-item__habitacions[^>]*>\s*(\d+)/);
    var hab = mHab ? parseInt(mHab[1], 10) : 0;
    if (!hab) { var rs = slug.match(/(\d+)-habitacion/); hab = rs ? parseInt(rs[1], 10) : 0; }

    var mSup = b.match(/list-item__superficie[^>]*>\s*(\d+)/);
    var m2 = mSup ? parseInt(mSup[1], 10) : 0;

    var precio = 0;
    var mPre = b.match(/list-item__price[^>]*>\s*([\d.]+)/);
    if (mPre) precio = parseInt(mPre[1].replace(/\./g, ''), 10) || 0;

    var mAg = b.match(/list-item__logo[\s\S]{0,220}?title="([^"]+)"/);
    var agencia = mAg ? decodeEntities(mAg[1]) : '';

    var mImg = b.match(/src="(https:\/\/fotos[^"]+\.(?:jpg|jpeg|png|webp))"/i);
    var imagen = mImg ? mImg[1] : '';

    out.push({
      source: 'Pisos.ad', id: id, clave: 'padd_' + id,
      url: 'https://pisos.ad' + path, titulo: titulo, tipo: slug.split('-')[0],
      habitaciones: hab, m2: m2, precio: precio, imagen: imagen,
      parroquia: parishFrom(slug + ' ' + titulo), agencia: agencia
    });
  }
  return out;
}

/** Parser de Habitaclia (una tarjeta por bloque schema.org/Product). */
function parseHabitaclia(html) {
  var out = [], seen = {};
  var cards = html.split('schema.org/Product');
  for (var i = 1; i < cards.length; i++) {
    var seg = cards[i];
    var d = seg.match(/data-hab="(\d+)"[^>]*?data-sup="(\d+)"[^>]*?data-pvp="(\d+)"[^>]*?data-codanuncio="(\d+)"/);
    if (!d) continue;
    var hab = parseInt(d[1], 10), m2 = parseInt(d[2], 10), precio = parseInt(d[3], 10), id = d[4];
    if (seen[id]) continue; seen[id] = 1;

    var um = seg.match(new RegExp('href="(https://www\\.habitaclia\\.com/alquiler-[^"]*-i' + id + '\\.htm)'));
    if (!um) continue;
    var url = um[1].replace(/&amp;/g, '&');

    var tm = url.match(/alquiler-([a-z_]+)-/);
    var tipo = tm ? tm[1] : '';
    var sm = url.match(/alquiler-[a-z_]+-([^\/]*?)-i\d+\.htm/);
    var titulo = sm ? decodeEntities(sm[1].replace(/_/g, ' ')) : 'Piso en Andorra';

    var im = seg.match(/(https?:)?\/\/images\.habimg\.com\/[^"']+\.jpg/i);
    var imagen = im ? (im[0].indexOf('http') === 0 ? im[0] : 'https:' + im[0]) : '';

    out.push({
      source: 'Habitaclia', id: id, clave: 'habi_' + id,
      url: url, titulo: titulo, tipo: tipo,
      habitaciones: hab, m2: m2, precio: precio, imagen: imagen,
      parroquia: parishFrom(url), agencia: ''
    });
  }
  return out;
}

/** Parser de Pisos.com (tarjetas .ad-preview, ancla .ad-preview__title). */
function parsePisosCom(html) {
  var out = [], seen = {};
  var re = /<a href="(\/alquilar\/([a-z_]+)-[^"\/]*?-(\d+_\d+))\/" class="ad-preview__title">([^<]*)<\/a>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var path = m[1], tipo = m[2], id = m[3], titulo = decodeEntities(m[4]);
    if (seen[id]) continue; seen[id] = 1;

    var antes = html.substring(Math.max(0, m.index - 2600), m.index);
    var despues = html.substring(m.index, m.index + 1400);

    var precio = 0;
    var pAll = antes.match(/ad-preview__price">\s*([\d.]+)\s*€/g);
    if (pAll && pAll.length) {
      var pm = pAll[pAll.length - 1].match(/([\d.]+)/);
      if (pm) precio = parseInt(pm[1].replace(/\./g, ''), 10) || 0;
    }
    var iAll = antes.match(/data-src="(https:\/\/fotos[^"]+)"/g);
    var imagen = '';
    if (iAll && iAll.length) imagen = iAll[iAll.length - 1].replace(/data-src="|"/g, '');

    var mSub = despues.match(/ad-preview__subtitle">([^<]*)</);
    var subtitulo = mSub ? decodeEntities(mSub[1]) : '';
    var mHab = despues.match(/ad-preview__char[^>]*>\s*(\d+)\s*habs?/);
    var hab = mHab ? parseInt(mHab[1], 10) : 0;
    var mSup = despues.match(/ad-preview__char[^>]*>\s*(\d+)\s*m/);
    var m2 = mSup ? parseInt(mSup[1], 10) : 0;
    var mDesc = despues.match(/ad-preview__description">([^<]*)</);
    var desc = mDesc ? decodeEntities(mDesc[1]) : '';

    out.push({
      source: 'Pisos.com', id: id, clave: 'pcom_' + id,
      url: 'https://www.pisos.com' + path, titulo: titulo, tipo: tipo,
      habitaciones: hab, m2: m2, precio: precio, imagen: imagen,
      parroquia: parishFrom(subtitulo || titulo || path),
      agencia: '', _extra: desc
    });
  }
  return out;
}


/* ============================================================================
 * FILTROS
 * ==========================================================================*/

function cumpleFiltros(l) {
  // Tipo de vivienda
  var base = (l.tipo || '').split('_')[0];
  if (CONFIG.EXCLUIR_TIPOS.indexOf(base) >= 0) return false;
  // Habitaciones (0 = desconocido → se deja pasar)
  if (l.habitaciones > 0 && l.habitaciones > CONFIG.MAX_HABITACIONES) return false;
  // Precio (0 = a consultar → se deja pasar, marcado luego)
  if (l.precio > 0 && l.precio > CONFIG.MAX_PRECIO) return false;
  // Parroquia
  if (CONFIG.PARROQUIAS.length > 0) {
    var zona = stripAccents((l.parroquia + ' ' + l.titulo + ' ' + l.url).toLowerCase());
    var ok = false;
    for (var i = 0; i < CONFIG.PARROQUIAS.length; i++) {
      if (zona.indexOf(stripAccents(CONFIG.PARROQUIAS[i].toLowerCase())) >= 0) { ok = true; break; }
    }
    if (!ok) return false;
  }
  return true;
}

/** Devuelve 'si' | 'no' | 'dudosa'. Solo baja al detalle si permitirFetch. */
function evaluarTerraza(l, permitirFetch) {
  var rx = /terra(za|ssa|sse)|balc[oó]n?|balc\b|solari?um/i;
  if (rx.test(l.titulo) || rx.test(l.url) || rx.test(l._extra || '')) return 'si';
  if (permitirFetch === false) return 'dudosa';
  var html = fetchHtml(l.url);
  if (!html) return 'dudosa';
  var txt = html.replace(/<[^>]+>/g, ' ');
  if (/terra(za|ssa|sse)|balc[oó]/i.test(txt)) return 'si';
  return 'no';
}

function pasaTerraza(l) {
  if (!CONFIG.EXIGIR_TERRAZA) return true;
  if (l.terraza === 'si') return true;
  if (l.terraza === 'no') return false;
  return CONFIG.AVISAR_SI_TERRAZA_DUDOSA; // 'dudosa'
}


/* ============================================================================
 * MEMORIA DE ANUNCIOS VISTOS (ScriptProperties, una clave por anuncio)
 * ==========================================================================*/

function _props() { return PropertiesService.getScriptProperties(); }

function cargarVistos() {
  var all = _props().getProperties(), vistos = {};
  for (var k in all) {
    if (k.indexOf('v_') === 0) vistos[k.substring(2)] = parseInt(all[k], 10) || 0;
  }
  return vistos;
}

function guardarVistos(nuevosProps) { _props().setProperties(nuevosProps, false); }

function purgar(ahora) {
  var cutoff = ahora - CONFIG.DIAS_MEMORIA * 86400;
  var all = _props().getProperties();
  for (var k in all) {
    if (k.indexOf('v_') === 0 && (parseInt(all[k], 10) || 0) < cutoff) _props().deleteProperty(k);
  }
}

function reset() {
  var all = _props().getProperties();
  for (var k in all) if (k.indexOf('v_') === 0) _props().deleteProperty(k);
  Logger.log('Memoria borrada. La próxima ejecución será un arranque limpio.');
}


/* ============================================================================
 * NOTIFICACIONES
 * ==========================================================================*/

function enviarEmail(matches, esArranque) {
  var n = matches.length;
  var asunto;
  if (esArranque) {
    asunto = '🏠 Alertas de pisos en Andorra activadas' +
             (n > 0 ? ' · ' + n + ' que ya cumplen' : ' · a la espera de novedades');
  } else {
    asunto = '🏠 ' + n + (n === 1 ? ' piso NUEVO' : ' pisos NUEVOS') +
             ' en Andorra ≤' + CONFIG.MAX_PRECIO + '€';
  }
  MailApp.sendEmail({
    to: CONFIG.EMAILS,
    subject: asunto,
    htmlBody: construirHtml(matches, esArranque),
    name: 'Alertas Pisos Andorra'
  });
}

function enviarTelegram(matches) {
  if (!CONFIG.TELEGRAM_BOT_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) return;
  var base = 'https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/';
  for (var i = 0; i < matches.length; i++) {
    var l = matches[i];
    var msg = '🏠 <b>' + escapeHtml(l.titulo) + '</b>\n' +
              '💶 ' + precioTxt(l) + '  ·  🛏️ ' + (l.habitaciones || '?') + ' hab' +
              (l.m2 ? '  ·  📐 ' + l.m2 + ' m²' : '') + '\n' +
              '📍 ' + (l.parroquia || 'Andorra') + terrazaTxt(l) + '\n' +
              '🔗 ' + l.url + '\n' +
              '(' + l.source + (l.agencia ? ' · ' + escapeHtml(l.agencia) : '') + ')';
    try {
      if (l.imagen) {
        UrlFetchApp.fetch(base + 'sendPhoto', {
          method: 'post', muteHttpExceptions: true,
          payload: { chat_id: CONFIG.TELEGRAM_CHAT_ID, photo: l.imagen, caption: msg, parse_mode: 'HTML' }
        });
      } else {
        UrlFetchApp.fetch(base + 'sendMessage', {
          method: 'post', muteHttpExceptions: true,
          payload: { chat_id: CONFIG.TELEGRAM_CHAT_ID, text: msg, parse_mode: 'HTML', disable_web_page_preview: 'false' }
        });
      }
    } catch (e) { Logger.log('Telegram error: ' + e); }
  }
}

function pruebaEmail() {
  var demo = [{
    source: 'Pisos.ad', titulo: 'Piso de prueba con terraza en Escaldes',
    url: 'https://pisos.ad', precio: 1400, habitaciones: 2, m2: 75,
    parroquia: 'Escaldes-Engordany', agencia: 'Inmobiliaria Demo', terraza: 'si'
  }];
  enviarEmail(demo, false);
  Logger.log('Email de prueba enviado a: ' + CONFIG.EMAILS);
}


/* ============================================================================
 * HTML DEL EMAIL
 * ==========================================================================*/

function construirHtml(matches, esArranque) {
  var head =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;' +
    'max-width:640px;margin:0 auto;color:#1a1a1a">' +
    '<h2 style="margin:0 0 4px">🏠 Alertas de pisos · Andorra</h2>' +
    '<p style="margin:0 0 16px;color:#666;font-size:13px">' +
    'Filtros: ≤' + CONFIG.MAX_PRECIO + '€/mes · ≤' + CONFIG.MAX_HABITACIONES +
    ' hab · con terraza/balcón · ' +
    (CONFIG.PARROQUIAS.length ? 'parroquias seleccionadas' : 'toda Andorra') + '</p>';

  if (matches.length === 0) {
    return head +
      '<p style="background:#f4f6f8;padding:16px;border-radius:10px">✅ Vigilancia activada. ' +
      'Ahora mismo no hay ningún piso que cumpla todos los filtros, pero te avisaré ' +
      '<b>al instante</b> en cuanto aparezca uno nuevo.</p></div>';
  }

  var intro = esArranque
    ? '<p style="background:#eef7ee;padding:12px 16px;border-radius:10px">✅ Vigilancia activada. ' +
      'Esto es lo que <b>ya cumple</b> tus filtros ahora mismo. A partir de ahora solo te avisaré de novedades.</p>'
    : '';

  var cards = '';
  for (var i = 0; i < matches.length; i++) {
    var l = matches[i];
    var foto = l.imagen
      ? '<a href="' + l.url + '"><img src="' + l.imagen + '" alt="" width="100%" ' +
        'style="width:100%;max-height:230px;object-fit:cover;border-radius:10px;margin-bottom:10px;display:block"></a>'
      : '';
    cards +=
      '<div style="border:1px solid #e3e6ea;border-radius:12px;padding:16px;margin:0 0 12px">' +
      foto +
      '<div style="font-size:16px;font-weight:600;margin-bottom:6px">' + escapeHtml(l.titulo) + '</div>' +
      '<div style="font-size:15px;margin-bottom:6px">' +
        '<b style="color:#0a7d2c">' + precioTxt(l) + '</b>' +
        '<span style="color:#666"> · ' + (l.habitaciones || '?') + ' hab' +
        (l.m2 ? ' · ' + l.m2 + ' m²' : '') + '</span></div>' +
      '<div style="font-size:13px;color:#444;margin-bottom:10px">📍 ' +
        escapeHtml(l.parroquia || 'Andorra') + terrazaBadge(l) +
        (l.agencia ? ' · ' + escapeHtml(l.agencia) : '') +
        ' · <span style="color:#888">' + l.source + '</span></div>' +
      '<a href="' + l.url + '" style="display:inline-block;background:#0a63c9;color:#fff;' +
        'text-decoration:none;padding:9px 16px;border-radius:8px;font-size:14px;font-weight:600">' +
        'Ver anuncio →</a></div>';
  }

  var portales = [];
  for (var f = 0; f < FUENTES.length; f++) if (FUENTES[f].activa()) portales.push(FUENTES[f].nombre);
  var pie = '<p style="color:#999;font-size:11px;margin-top:8px">Portales vigilados: ' + portales.join(' · ') + '. ' +
            'Consejo: llama también a las inmobiliarias — muchos pisos vuelan antes de publicarse.</p></div>';
  return head + intro + cards + pie;
}

function precioTxt(l) {
  return l.precio > 0 ? formatMiles(l.precio) + ' €/mes' : 'Precio a consultar';
}
function terrazaTxt(l) {
  if (l.terraza === 'si') return '  ·  🌿 terraza/balcón';
  if (l.terraza === 'dudosa') return '  ·  🌿 terraza sin confirmar';
  return '';
}
function terrazaBadge(l) {
  if (l.terraza === 'si') return ' · 🌿 terraza/balcón';
  if (l.terraza === 'dudosa') return ' · 🌿 <i>terraza sin confirmar</i>';
  return '';
}


/* ============================================================================
 * UTILIDADES
 * ==========================================================================*/

function fetchHtml(url) {
  try {
    var r = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true, followRedirects: true,
      headers: { 'User-Agent': CONFIG.UA, 'Accept-Language': 'es-ES,es;q=0.9,ca;q=0.8' }
    });
    if (r.getResponseCode() !== 200) return '';
    return r.getContentText('UTF-8');
  } catch (e) {
    Logger.log('fetch error ' + url + ': ' + e);
    return '';
  }
}

function parishFrom(text) {
  var t = stripAccents((text || '').toLowerCase()).replace(/_/g, ' ');
  for (var i = 0; i < PARROQUIA_KEYS.length; i++) {
    if (t.indexOf(stripAccents(PARROQUIA_KEYS[i].k)) >= 0) return PARROQUIA_KEYS[i].n;
  }
  return '';
}

function stripAccents(s) {
  return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function decodeEntities(s) {
  if (!s) return '';
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, function (_, h) { return String.fromCharCode(parseInt(h, 16)); })
    .replace(/&#(\d+);/g, function (_, d) { return String.fromCharCode(parseInt(d, 10)); })
    .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
    .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&ntilde;/g, 'ñ')
    .replace(/&quot;/g, '"').replace(/&#039;|&apos;/g, "'")
    .replace(/\s+/g, ' ').trim();
}

function escapeHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatMiles(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function numKeys(o) { var c = 0; for (var k in o) c++; return c; }


/* ============================================================================
 * PARROQUIAS (para clasificar por zona)
 * ==========================================================================*/

var PARROQUIA_KEYS = [
  { k: 'andorra la vella', n: 'Andorra la Vella' },
  { k: 'santa coloma',     n: 'Santa Coloma' },
  { k: 'escaldes',         n: 'Escaldes-Engordany' },
  { k: 'engordany',        n: 'Escaldes-Engordany' },
  { k: 'pas de la casa',   n: 'Encamp (Pas de la Casa)' },
  { k: 'encamp',           n: 'Encamp' },
  { k: 'la massana',       n: 'La Massana' },
  { k: 'arinsal',          n: 'La Massana (Arinsal)' },
  { k: 'sispony',          n: 'La Massana (Sispony)' },
  { k: 'anyos',            n: 'La Massana (Anyós)' },
  { k: 'erts',             n: 'La Massana (Erts)' },
  { k: 'pal',              n: 'La Massana (Pal)' },
  { k: 'massana',          n: 'La Massana' },
  { k: 'la cortinada',     n: 'Ordino (La Cortinada)' },
  { k: 'el serrat',        n: 'Ordino (El Serrat)' },
  { k: 'ordino',           n: 'Ordino' },
  { k: 'soldeu',           n: 'Canillo (Soldeu)' },
  { k: 'el tarter',        n: 'Canillo (El Tarter)' },
  { k: 'meritxell',        n: 'Canillo (Meritxell)' },
  { k: 'ransol',           n: 'Canillo (Ransol)' },
  { k: 'el forn',          n: 'Canillo (El Forn)' },
  { k: 'canillo',          n: 'Canillo' },
  { k: 'aixovall',         n: 'Sant Julià de Lòria (Aixovall)' },
  { k: 'juberri',          n: 'Sant Julià de Lòria (Juberri)' },
  { k: 'nagol',            n: 'Sant Julià de Lòria (Nagol)' },
  { k: 'sant julia',       n: 'Sant Julià de Lòria' }
];


/* ============================================================================
 * FUENTES (para añadir un portal nuevo, copia un bloque y ajusta url + parse)
 * --------------------------------------------------------------------------
 * Portales probados y viables de añadir: Pisos.com, EnAlquiler, BuscoCasa.ad.
 * Idealista / Fotocasa / Trovit bloquean bots: requerirían un servicio de
 * scraping de pago (no compatible con este script gratuito).
 * ==========================================================================*/

var FUENTES = [
  {
    nombre: 'Pisos.ad',
    activa: function () { return CONFIG.USAR_PISOS_AD; },
    url: function (p) { return 'https://pisos.ad/es/alquiler/pisos?pagina=' + p; },
    parse: function (html) { return parsePisosAd(html); }
  },
  {
    nombre: 'Habitaclia',
    activa: function () { return CONFIG.USAR_HABITACLIA; },
    url: function (p) { return 'https://www.habitaclia.com/alquiler-provincia-andorra-' + p + '.htm?orden=mas_recientes'; },
    parse: function (html) { return parseHabitaclia(html); }
  },
  {
    nombre: 'Pisos.com',
    activa: function () { return CONFIG.USAR_PISOS_COM; },
    url: function (p) { return 'https://www.pisos.com/alquiler/pisos-andorra/' + (p > 1 ? p + '/' : ''); },
    parse: function (html) { return parsePisosCom(html); }
  }
];
