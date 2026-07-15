/**
 * InstagramAudit.gs
 * Auditoría de una cuenta de Instagram Business/Creator vía Instagram Graph API.
 *
 * Lee el perfil, las publicaciones recientes y (best-effort) los insights de la
 * cuenta, calcula métricas de rendimiento (engagement, desglose por formato,
 * mejores horas/días, cadencia) y las vuelca en la pestaña `IG Auditoría`.
 *
 * Usa las mismas credenciales que la publicación:
 *   IG_USER_ID, IG_ACCESS_TOKEN (+ instagram_manage_insights para insights).
 *
 * Doc: https://developers.facebook.com/docs/instagram-api/reference/ig-user
 */

var IG_AUDIT_SHEET = 'IG Auditoría';

/** Nº de publicaciones recientes a analizar (paginando). */
var IG_AUDIT_MEDIA_LIMIT = 60;

/* ------------------------------- Fetch ----------------------------------- */

/** Perfil de la cuenta. */
function igFetchProfile() {
  var creds = igCreds();
  return igGet('/' + creds.userId, {
    fields: 'username,name,biography,website,followers_count,follows_count,media_count'
  });
}

/**
 * Publicaciones recientes (hasta IG_AUDIT_MEDIA_LIMIT), paginando.
 * @return {Array<Object>} medios con métricas básicas.
 */
function igFetchRecentMedia() {
  var creds = igCreds();
  var fields = 'id,caption,media_type,media_product_type,timestamp,' +
    'like_count,comments_count,permalink';
  var url = igGraphBase() + '/' + creds.userId + '/media?' +
    toQuery({ fields: fields, limit: '50', access_token: creds.token });
  var out = [];
  while (url && out.length < IG_AUDIT_MEDIA_LIMIT) {
    var json = httpJson(url);
    (json.data || []).forEach(function (m) { out.push(m); });
    url = (json.paging && json.paging.next) ? json.paging.next : null;
  }
  return out.slice(0, IG_AUDIT_MEDIA_LIMIT);
}

/**
 * Insights de la cuenta (best-effort: permisos/métricas varían por cuenta).
 * @return {Object} { reach, ... } o {} si no disponible.
 */
function igFetchAccountInsights() {
  try {
    var creds = igCreds();
    var json = igGet('/' + creds.userId + '/insights', {
      metric: 'reach',
      period: 'days_28',
      metric_type: 'total_value'
    });
    var out = {};
    (json.data || []).forEach(function (row) {
      var val = row.total_value ? row.total_value.value : null;
      out[row.name] = val;
    });
    return out;
  } catch (e) {
    logInfo('IG insights no disponibles', e);
    return {};
  }
}

/* ------------------------------ Análisis --------------------------------- */

var IG_WEEKDAYS_ES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** Etiqueta de formato legible a partir de media_type + media_product_type. */
function igFormatLabel(m) {
  var prod = m.media_product_type || '';
  if (prod === 'REELS') return 'Reel';
  if (prod === 'STORY') return 'Story';
  if (m.media_type === 'CAROUSEL_ALBUM') return 'Carrusel';
  if (m.media_type === 'VIDEO') return 'Vídeo';
  return 'Foto';
}

/**
 * Calcula métricas agregadas a partir del perfil y los medios.
 * @return {Object} resumen con kpis, desglose por formato, top posts y horarios.
 */
function igAnalyze(profile, media) {
  var followers = toNumber(profile.followers_count) || 0;
  var tz = CLIENT.timezone;

  var byFormat = {};   // formato -> { n, likes, comments }
  var byWeekday = {};  // 0-6 -> { n, eng }
  var byHour = {};     // 0-23 -> { n, eng }
  var enriched = [];
  var totalLikes = 0, totalComments = 0;
  var minTs = null, maxTs = null;

  media.forEach(function (m) {
    var likes = toNumber(m.like_count);
    var comments = toNumber(m.comments_count);
    var eng = likes + comments;
    var fmt = igFormatLabel(m);
    totalLikes += likes; totalComments += comments;

    var f = byFormat[fmt] || (byFormat[fmt] = { n: 0, likes: 0, comments: 0 });
    f.n++; f.likes += likes; f.comments += comments;

    var d = new Date(m.timestamp);
    if (!minTs || d < minTs) minTs = d;
    if (!maxTs || d > maxTs) maxTs = d;
    var wd = parseInt(Utilities.formatDate(d, tz, 'u'), 10) % 7; // 'u': 1=lunes..7=domingo
    var hr = parseInt(Utilities.formatDate(d, tz, 'H'), 10);
    var w = byWeekday[wd] || (byWeekday[wd] = { n: 0, eng: 0 });
    w.n++; w.eng += eng;
    var h = byHour[hr] || (byHour[hr] = { n: 0, eng: 0 });
    h.n++; h.eng += eng;

    enriched.push({
      permalink: m.permalink || '',
      format: fmt,
      date: Utilities.formatDate(d, tz, 'yyyy-MM-dd'),
      likes: likes, comments: comments, eng: eng,
      caption: (m.caption || '').replace(/\s+/g, ' ').slice(0, 80),
      er: followers ? eng / followers : 0
    });
  });

  var n = media.length;
  var avgEng = n ? (totalLikes + totalComments) / n : 0;
  var engRate = followers ? avgEng / followers : 0;

  // Cadencia: posts por semana en el periodo cubierto.
  var weeks = (minTs && maxTs) ? Math.max(1, (maxTs - minTs) / (7 * 24 * 3600 * 1000)) : 1;
  var perWeek = n / weeks;

  // Mejor día / hora por engagement medio (mínimo de muestras para ser fiable).
  var bestWeekday = igBestBucket(byWeekday);
  var bestHour = igBestBucket(byHour);

  return {
    followers: followers,
    following: toNumber(profile.follows_count),
    mediaCount: toNumber(profile.media_count),
    analyzed: n,
    avgLikes: n ? totalLikes / n : 0,
    avgComments: n ? totalComments / n : 0,
    avgEng: avgEng,
    engRate: engRate,
    perWeek: perWeek,
    periodFrom: minTs ? Utilities.formatDate(minTs, tz, 'yyyy-MM-dd') : '',
    periodTo: maxTs ? Utilities.formatDate(maxTs, tz, 'yyyy-MM-dd') : '',
    byFormat: byFormat,
    bestWeekday: (bestWeekday != null) ? IG_WEEKDAYS_ES[bestWeekday] : '—',
    bestHour: (bestHour != null) ? (bestHour + ':00') : '—',
    topPosts: enriched.slice().sort(function (a, b) { return b.eng - a.eng; }).slice(0, 8),
    enriched: enriched
  };
}

/** Devuelve la clave del bucket con mayor engagement medio (n>=2). */
function igBestBucket(map) {
  var best = null, bestAvg = -1;
  Object.keys(map).forEach(function (k) {
    var b = map[k];
    if (b.n < 2) return;
    var avg = b.eng / b.n;
    if (avg > bestAvg) { bestAvg = avg; best = parseInt(k, 10); }
  });
  return best;
}

/* ------------------------------- Render ---------------------------------- */

/** Ejecuta la auditoría completa y la pinta en la pestaña `IG Auditoría`. */
function runInstagramAudit() {
  var profile = igFetchProfile();
  var media = igFetchRecentMedia();
  var insights = igFetchAccountInsights();
  var a = igAnalyze(profile, media);
  renderInstagramAudit(profile, a, insights);
  return a;
}

/** Acción de menú: auditoría con toasts + control de errores. */
function menuInstagramAudit() {
  var ui = SpreadsheetApp.getUi();
  try {
    toast('Auditando Instagram… (leyendo perfil y publicaciones)');
    var a = runInstagramAudit();
    SpreadsheetApp.getActive().setActiveSheet(
      SpreadsheetApp.getActive().getSheetByName(IG_AUDIT_SHEET));
    toast('Auditoría lista: ' + a.analyzed + ' posts analizados');
  } catch (e) {
    ui.alert('Instagram — auditoría', String(e), ui.ButtonSet.OK);
    logInfo('menuInstagramAudit error', e);
  }
}

/** Pinta el informe en la pestaña `IG Auditoría`. */
function renderInstagramAudit(profile, a, insights) {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(IG_AUDIT_SHEET);
  if (!sh) sh = ss.insertSheet(IG_AUDIT_SHEET);
  sh.clear();
  var NC = 6;
  setDashboardColumnWidths(sh, NC);
  var row = 1;

  // Título.
  var title = sh.getRange(row, 1, 1, NC).merge();
  title.setValue('Auditoría Instagram · @' + (profile.username || '') +
    '  ·  ' + a.periodFrom + ' → ' + a.periodTo)
    .setBackground(THEME.dark).setFontColor(THEME.textLight)
    .setFontWeight('bold').setFontSize(13).setVerticalAlignment('middle');
  sh.setRowHeight(row, 32);
  row += 2;

  // KPIs de cuenta.
  row = writeSectionHeader(sh, row, NC, 'Resumen de cuenta');
  var reach28 = (insights && insights.reach != null) ? insights.reach : null;
  var kpis = [
    { label: 'Seguidores', value: a.followers, format: NUMFMT.int },
    { label: 'Publicaciones', value: a.mediaCount, format: NUMFMT.int },
    { label: 'Posts analizados', value: a.analyzed, format: NUMFMT.int },
    { label: 'Engagement rate', value: a.engRate, format: NUMFMT.pct },
    { label: 'Likes/post (media)', value: round(a.avgLikes, 1), format: NUMFMT.dec2 },
    { label: 'Coment./post (media)', value: round(a.avgComments, 1), format: NUMFMT.dec2 },
    { label: 'Posts/semana', value: round(a.perWeek, 1), format: NUMFMT.dec2 },
    { label: 'Alcance 28d', value: (reach28 != null ? reach28 : '—'), format: NUMFMT.int }
  ];
  row = writeKpiGrid(sh, row, kpis, 4);
  row += 1;

  // Desglose por formato.
  row = writeSectionHeader(sh, row, NC, 'Rendimiento por formato');
  var fmtRows = Object.keys(a.byFormat).map(function (k) {
    var f = a.byFormat[k];
    var avgEng = f.n ? (f.likes + f.comments) / f.n : 0;
    var er = a.followers ? avgEng / a.followers : 0;
    return [k, f.n, round(f.likes / f.n, 1), round(f.comments / f.n, 1), round(avgEng, 1), er];
  }).sort(function (x, y) { return y[4] - x[4]; });
  row = writeTable(sh, row,
    ['Formato', 'Posts', 'Likes/post', 'Coment./post', 'Engag./post', 'ER'],
    fmtRows,
    [null, NUMFMT.int, NUMFMT.dec2, NUMFMT.dec2, NUMFMT.dec2, NUMFMT.pct],
    false);

  // Mejores momentos.
  row = writeSectionHeader(sh, row, NC, 'Cuándo publicar (según tu histórico)');
  var timeRows = [
    ['Mejor día', a.bestWeekday, '', '', '', ''],
    ['Mejor hora', a.bestHour, '', '', '', ''],
    ['Cadencia actual', round(a.perWeek, 1) + ' posts/semana', '', '', '', '']
  ];
  row = writeTable(sh, row, ['Métrica', 'Valor', '', '', '', ''], timeRows, null, false);

  // Top posts.
  row = writeSectionHeader(sh, row, NC, 'Top publicaciones por engagement');
  var topRows = a.topPosts.map(function (p) {
    return [p.date, p.format, p.likes, p.comments, p.eng, p.permalink];
  });
  row = writeTable(sh, row,
    ['Fecha', 'Formato', 'Likes', 'Coment.', 'Engag.', 'Enlace'],
    topRows,
    [null, null, NUMFMT.int, NUMFMT.int, NUMFMT.int, null],
    false);

  // Nota metodológica.
  var note = sh.getRange(row, 1, 1, NC).merge();
  note.setValue('Métricas calculadas sobre las últimas ' + a.analyzed +
    ' publicaciones. ER = engagement (likes + comentarios) / seguidores. ' +
    'El alcance/impresiones a nivel post requiere el permiso instagram_manage_insights.')
    .setFontSize(9).setFontColor('#57606a').setWrap(true);
  sh.setRowHeight(row, 34);
}
