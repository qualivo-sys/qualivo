/**
 * Swipe.gs — Qualivo · Swipe & Competencia (Meta Ad Library)
 *
 * Herramienta AUTÓNOMA de Qualivo (no tiene nada que ver con el dashboard de
 * EAC). Es un único archivo pensado para pegarse en un Google Sheet nuevo:
 * al abrir el Sheet aparece el menú "Qualivo Swipe" para crear una pestaña
 * que ayuda a analizar y registrar los carruseles/anuncios que la competencia
 * tiene ACTIVOS en Meta, usando la Biblioteca de Anuncios pública (Ad Library).
 *
 * Por qué la Ad Library y no la API de Meta:
 *  - Es pública y gratuita: no necesita token ni credenciales.
 *  - Por la DSA, en la UE muestra TODOS los anuncios activos de cualquier
 *    página (no solo los políticos) → sirve para espiar a la competencia.
 *
 * Limitación honesta: la Ad Library NO da métricas de engagement. La
 * "viralidad" se infiere de señales (antigüedad del anuncio + nº de
 * variaciones activas). Los virales ORGÁNICOS de IG/LinkedIn no aparecen aquí.
 *
 * La pestaña es un TRACKER manual: el scaffold solo se crea si la hoja no
 * existe, para no borrar tus registros.
 */

/** Ajustes de la herramienta. Edita libremente queries y brands. */
var SWIPE = {
  sheet: 'Swipe',
  country: 'ES',      // país de la Ad Library (ES, MX, US, …)
  cols: 12,
  // Búsquedas por temática del nicho de Qualivo (growth / marketing / ads).
  queries: [
    'agencia de marketing',
    'growth hacking',
    'más clientes para tu negocio',
    'campañas de Google Ads',
    'publicidad para negocios',
    'escalar tu negocio',
    'generar leads',
    'embudo de ventas'
  ],
  // Referencias del nicho hispano que suelen tener anuncios corriendo.
  brands: [
    'Convierte Más',
    'Vilma Núñez',
    'Rubén Máñez',
    'Product Hackers',
    'Cyberclick',
    'Aula CM',
    'Roman Cuesta'
  ]
};

/** Paleta mínima (autónoma, sin dependencias). */
var SW_THEME = {
  dark: '#0f2233',
  accent: '#1f6feb',
  light: '#eef3f8',
  textLight: '#ffffff',
  muted: '#57606a'
};

/** Menú al abrir el Sheet. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Qualivo Swipe')
    .addItem('Crear pestaña Swipe / Competencia', 'setupSwipe')
    .addItem('Reconstruir ayuda (enlaces)', 'rebuildSwipeHelp')
    .addToUi();
}

/** Toast de aviso. */
function swToast(msg) {
  try { SpreadsheetApp.getActive().toast(msg, 'Qualivo Swipe', 5); } catch (e) {}
}

/** Construye la URL de una búsqueda por palabra clave en la Ad Library. */
function adLibraryUrl(query) {
  return 'https://www.facebook.com/ads/library/'
    + '?active_status=active'
    + '&ad_type=all'
    + '&country=' + SWIPE.country
    + '&media_type=all'
    + '&search_type=keyword_unordered'
    + '&q=' + encodeURIComponent(query);
}

/** Cabecera de sección (banda de color). Devuelve la siguiente fila. */
function swSectionHeader(sh, row, ncols, title) {
  var rng = sh.getRange(row, 1, 1, ncols).merge();
  rng.setValue(title.toUpperCase())
    .setBackground(SW_THEME.dark).setFontColor(SW_THEME.textLight)
    .setFontWeight('bold').setFontSize(11).setVerticalAlignment('middle');
  sh.setRowHeight(row, 26);
  return row + 1;
}

/**
 * Crea la pestaña Swipe si no existe (idempotente, no borra datos).
 */
function setupSwipe() {
  var ss = SpreadsheetApp.getActive();
  var existing = ss.getSheetByName(SWIPE.sheet);
  if (existing) {
    ss.setActiveSheet(existing);
    swToast('La pestaña "' + SWIPE.sheet + '" ya existe (no se toca para no borrar tus datos).');
    return;
  }
  var sh = ss.insertSheet(SWIPE.sheet);
  renderSwipeHelp(sh, true);
  swToast('Pestaña Swipe creada');
}

/** Reconstruye SOLO el bloque de ayuda (cabecera + enlaces), respeta el registro. */
function rebuildSwipeHelp() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SWIPE.sheet) || ss.insertSheet(SWIPE.sheet);
  renderSwipeHelp(sh, false);
  swToast('Bloque de ayuda actualizado');
}

/**
 * Pinta cabecera, búsquedas rápidas, marcas a vigilar, leyenda y la cabecera
 * del registro.
 * @param sh hoja destino
 * @param seedTable si true, escribe cabecera del registro + validaciones + fila ejemplo.
 */
function renderSwipeHelp(sh, seedTable) {
  var n = SWIPE.cols;
  sh.setHiddenGridlines(true);

  var widths = [95, 150, 95, 90, 260, 260, 150, 95, 80, 85, 160, 280];
  for (var c = 0; c < widths.length; c++) sh.setColumnWidth(c + 1, widths[c]);

  // --- Título ---
  sh.getRange(1, 1, 1, n).merge()
    .setValue('Qualivo · Swipe & Competencia (Meta Ad Library)')
    .setFontSize(16).setFontWeight('bold').setFontColor(SW_THEME.dark);
  sh.setRowHeight(1, 32);
  sh.getRange(2, 1, 1, n).merge()
    .setValue('Analiza los carruseles/anuncios ACTIVOS de la competencia en Meta. La Ad Library es pública (sin token). '
      + 'La "viralidad" se infiere: un anuncio que lleva semanas activo y con varias variaciones = ganador escalando.')
    .setFontColor(SW_THEME.muted).setWrap(true);
  sh.setRowHeight(2, 30);

  var row = 4;

  // --- Búsquedas rápidas por temática ---
  row = swSectionHeader(sh, row, n, 'Búsquedas rápidas · Ad Library (país ' + SWIPE.country + ', activos)');
  for (var i = 0; i < SWIPE.queries.length; i++) {
    var q = SWIPE.queries[i];
    var cell = sh.getRange(row, 1, 1, n).merge();
    cell.setFormula('=HYPERLINK("' + adLibraryUrl(q) + '";"🔎  ' + q + '")')
      .setFontColor(SW_THEME.accent);
    if (i % 2 === 1) cell.setBackground(SW_THEME.light);
    row++;
  }
  row++;

  // --- Marcas a vigilar ---
  row = swSectionHeader(sh, row, n, 'Competencia a vigilar (buscar la marca en la Ad Library)');
  for (var b = 0; b < SWIPE.brands.length; b++) {
    var brand = SWIPE.brands[b];
    var bc = sh.getRange(row, 1, 1, n).merge();
    bc.setFormula('=HYPERLINK("' + adLibraryUrl(brand) + '";"👤  ' + brand + '")')
      .setFontColor(SW_THEME.accent);
    if (b % 2 === 1) bc.setBackground(SW_THEME.light);
    row++;
  }
  row++;

  // --- Cómo puntuar la viralidad ---
  row = swSectionHeader(sh, row, n, 'Cómo estimar la viralidad (1–5)');
  var legend = [
    '5 · Activo >4 semanas y con varias variaciones → ganador claro, diséccalo',
    '4 · Activo 2–4 semanas o varias variaciones → funciona',
    '3 · Activo 1–2 semanas → prometedor, seguir',
    '2 · Recién lanzado (pocos días) → sin datos aún',
    '1 · Anuncio suelto sin recorrido → baja prioridad'
  ];
  for (var l = 0; l < legend.length; l++) {
    sh.getRange(row, 1, 1, n).merge().setValue(legend[l]).setFontColor(SW_THEME.muted);
    row++;
  }
  row++;

  // --- Cabecera del registro ---
  row = swSectionHeader(sh, row, n, 'Registro de carruseles / creatividades');
  var header = [
    'Fecha detección', 'Competidor / Marca', 'Plataforma', 'Formato',
    'Gancho (tarjeta 1)', 'Estructura (slides / mensaje)', 'Oferta / CTA',
    'Inicio anuncio', 'Nº variac.', 'Viralidad', 'Link anuncio', 'Notas / qué copiar'
  ];
  sh.getRange(row, 1, 1, n).setValues([header])
    .setBackground(SW_THEME.accent).setFontColor(SW_THEME.textLight).setFontWeight('bold')
    .setHorizontalAlignment('center').setWrap(true);
  sh.setFrozenRows(row);
  var dataStart = row + 1;

  if (seedTable) {
    var example = [
      new Date(), 'Ejemplo · Convierte Más', 'Instagram', 'Carrusel',
      '"3 errores que arruinan tus campañas de Meta"',
      'S1 hook → S2-4 errores → S5 solución → S6 CTA',
      'Descarga la guía gratis', '', 3, 4, '',
      'Copiar el patrón hook con número + dolor'
    ];
    sh.getRange(dataStart, 1, 1, n).setValues([example])
      .setBackground(SW_THEME.light).setFontColor(SW_THEME.muted).setFontStyle('italic');
    sh.getRange(dataStart, 1).setNumberFormat('yyyy-mm-dd');

    var rows = 300;
    var platRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Instagram', 'Facebook', 'Ambas'], true).build();
    var fmtRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Carrusel', 'Imagen', 'Vídeo', 'Reel', 'Texto'], true).build();
    var viralRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['1', '2', '3', '4', '5'], true).build();
    sh.getRange(dataStart, 3, rows, 1).setDataValidation(platRule);
    sh.getRange(dataStart, 4, rows, 1).setDataValidation(fmtRule);
    sh.getRange(dataStart, 10, rows, 1).setDataValidation(viralRule);
    sh.getRange(dataStart, 1, rows, 1).setNumberFormat('yyyy-mm-dd');
    sh.getRange(dataStart, 8, rows, 1).setNumberFormat('yyyy-mm-dd');

    var viralRange = sh.getRange(dataStart, 10, rows, 1);
    sh.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberGreaterThanOrEqualTo(4).setBackground('#d6f5d6').setRanges([viralRange]).build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberEqualTo(3).setBackground('#fff2c9').setRanges([viralRange]).build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberLessThanOrEqualTo(2).setBackground('#ffd6d6').setRanges([viralRange]).build()
    ]);
  }

  sh.setActiveSelection(sh.getRange(dataStart, 1));
}
