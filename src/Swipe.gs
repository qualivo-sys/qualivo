/**
 * Swipe.gs
 * Pestaña "Swipe / Competencia": herramienta para analizar y registrar los
 * carruseles (y demás creatividades) que la competencia tiene ACTIVOS en Meta,
 * usando la Biblioteca de Anuncios pública (Meta Ad Library).
 *
 * Por qué la Ad Library y no la API de Meta:
 *  - Es pública y gratuita: no necesita token ni credenciales.
 *  - Por la DSA, en la UE muestra TODOS los anuncios activos de cualquier
 *    página (no solo los políticos), así que sirve para espiar competencia.
 *  - La API `ads_archive` solo devuelve de forma fiable anuncios de temática
 *    social/política, por eso aquí trabajamos sobre la UI web con enlaces
 *    prefiltrados.
 *
 * Limitación honesta: la Ad Library NO da métricas de engagement. La
 * "viralidad" se infiere de señales (antigüedad del anuncio, nº de
 * variaciones activas). Los virales ORGÁNICOS de IG/LinkedIn no aparecen aquí.
 *
 * A diferencia del Dashboard, esta pestaña es un TRACKER manual: el scaffold
 * solo se crea si la hoja no existe, para no borrar tus registros. Usa
 * "Reconstruir bloque de ayuda" si quieres refrescar solo la cabecera.
 */

/** País y ajustes de las búsquedas de la Ad Library. */
var SWIPE = {
  sheet: 'Swipe',
  country: 'ES',
  cols: 12,
  helpRows: 0, // se calcula al pintar; fila donde arranca el registro
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

/**
 * Crea la pestaña Swipe si no existe (idempotente, no borra datos).
 * Llamada desde el menú "EAC Dashboard → Crear pestaña Swipe / Competencia".
 */
function setupSwipe() {
  var ss = SpreadsheetApp.getActive();
  var existing = ss.getSheetByName(SWIPE.sheet);
  if (existing) {
    ss.setActiveSheet(existing);
    toast('La pestaña "' + SWIPE.sheet + '" ya existe (no se toca para no borrar tus datos).');
    return;
  }
  var sh = ss.insertSheet(SWIPE.sheet);
  renderSwipeHelp(sh, true);
  toast('Pestaña Swipe creada');
}

/** Reconstruye SOLO el bloque de ayuda (cabecera + enlaces), respeta el registro. */
function rebuildSwipeHelp() {
  var ss = SpreadsheetApp.getActive();
  var sh = ss.getSheetByName(SWIPE.sheet) || ss.insertSheet(SWIPE.sheet);
  renderSwipeHelp(sh, false);
  toast('Bloque de ayuda actualizado');
}

/**
 * Pinta la cabecera, las búsquedas rápidas, las marcas a vigilar y la
 * cabecera del registro.
 * @param sh hoja destino
 * @param seedTable si true, escribe la cabecera del registro + validaciones y
 *        una fila de ejemplo. Si false, solo repinta el bloque de ayuda.
 */
function renderSwipeHelp(sh, seedTable) {
  var n = SWIPE.cols;
  sh.setHiddenGridlines(true);

  // Anchos: gancho / estructura / notas anchos, el resto medianos.
  var widths = [95, 150, 95, 90, 260, 260, 150, 95, 80, 85, 160, 280];
  for (var c = 0; c < widths.length; c++) sh.setColumnWidth(c + 1, widths[c]);

  // --- Título ---
  var title = sh.getRange(1, 1, 1, n).merge();
  title.setValue(CLIENT.name === 'EAC' ? 'Qualivo · Swipe & Competencia (Meta Ad Library)' : (CLIENT.name + ' · Swipe & Competencia'))
    .setFontSize(16).setFontWeight('bold').setFontColor(THEME.dark);
  sh.setRowHeight(1, 32);
  sh.getRange(2, 1, 1, n).merge()
    .setValue('Analiza los carruseles/anuncios ACTIVOS de la competencia en Meta. La Ad Library es pública (sin token). '
      + 'La "viralidad" se infiere: un anuncio que lleva semanas activo y con varias variaciones = ganador escalando.')
    .setFontColor('#57606a').setWrap(true);
  sh.setRowHeight(2, 30);

  var row = 4;

  // --- Búsquedas rápidas por temática ---
  row = writeSectionHeader(sh, row, n, 'Búsquedas rápidas · Ad Library (España, activos)');
  for (var i = 0; i < SWIPE.queries.length; i++) {
    var q = SWIPE.queries[i];
    var cell = sh.getRange(row, 1, 1, n).merge();
    cell.setFormula('=HYPERLINK("' + adLibraryUrl(q) + '";"🔎  ' + q + '")')
      .setFontColor(THEME.accent);
    if (i % 2 === 1) cell.setBackground(THEME.light);
    row++;
  }
  row++;

  // --- Marcas a vigilar ---
  row = writeSectionHeader(sh, row, n, 'Competencia a vigilar (buscar la marca en la Ad Library)');
  for (var b = 0; b < SWIPE.brands.length; b++) {
    var brand = SWIPE.brands[b];
    var bc = sh.getRange(row, 1, 1, n).merge();
    bc.setFormula('=HYPERLINK("' + adLibraryUrl(brand) + '";"👤  ' + brand + '")')
      .setFontColor(THEME.accent);
    if (b % 2 === 1) bc.setBackground(THEME.light);
    row++;
  }
  row++;

  // --- Cómo puntuar la viralidad ---
  row = writeSectionHeader(sh, row, n, 'Cómo estimar la viralidad (1–5)');
  var legend = [
    '5 · Activo >4 semanas y con varias variaciones → ganador claro, diséccalo',
    '4 · Activo 2–4 semanas o varias variaciones → funciona',
    '3 · Activo 1–2 semanas → prometedor, seguir',
    '2 · Recién lanzado (pocos días) → sin datos aún',
    '1 · Anuncio suelto sin recorrido → baja prioridad'
  ];
  for (var l = 0; l < legend.length; l++) {
    var lc = sh.getRange(row, 1, 1, n).merge();
    lc.setValue(legend[l]).setFontColor('#57606a');
    row++;
  }
  row++;

  // --- Cabecera del registro ---
  row = writeSectionHeader(sh, row, n, 'Registro de carruseles / creatividades');
  var header = [
    'Fecha detección', 'Competidor / Marca', 'Plataforma', 'Formato',
    'Gancho (tarjeta 1)', 'Estructura (slides / mensaje)', 'Oferta / CTA',
    'Inicio anuncio', 'Nº variac.', 'Viralidad', 'Link anuncio', 'Notas / qué copiar'
  ];
  var hr = sh.getRange(row, 1, 1, n);
  hr.setValues([header]);
  hr.setBackground(THEME.accent).setFontColor(THEME.textLight).setFontWeight('bold')
    .setHorizontalAlignment('center').setWrap(true);
  sh.setFrozenRows(row);
  var dataStart = row + 1;

  if (seedTable) {
    // Fila de ejemplo (gris claro) para que se vea cómo se rellena.
    var example = [
      new Date(), 'Ejemplo · Convierte Más', 'Instagram', 'Carrusel',
      '"3 errores que arruinan tus campañas de Meta"',
      'S1 hook → S2-4 errores → S5 solución → S6 CTA',
      'Descarga la guía gratis', '', 3, 4, '',
      'Copiar el patrón hook con número + dolor'
    ];
    sh.getRange(dataStart, 1, 1, n).setValues([example])
      .setBackground(THEME.light).setFontColor('#57606a').setFontStyle('italic');
    sh.getRange(dataStart, 1).setNumberFormat('yyyy-mm-dd');

    // Validaciones para las siguientes ~300 filas.
    var rows = 300;
    var platRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Instagram', 'Facebook', 'Ambas'], true).build();
    var fmtRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['Carrusel', 'Imagen', 'Vídeo', 'Reel', 'Texto'], true).build();
    var viralRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(['1', '2', '3', '4', '5'], true).build();
    sh.getRange(dataStart, 3, rows, 1).setDataValidation(platRule);   // Plataforma
    sh.getRange(dataStart, 4, rows, 1).setDataValidation(fmtRule);    // Formato
    sh.getRange(dataStart, 10, rows, 1).setDataValidation(viralRule); // Viralidad
    sh.getRange(dataStart, 1, rows, 1).setNumberFormat('yyyy-mm-dd'); // Fecha detección
    sh.getRange(dataStart, 8, rows, 1).setNumberFormat('yyyy-mm-dd'); // Inicio anuncio

    // Semáforo en la columna Viralidad (10).
    var viralRange = sh.getRange(dataStart, 10, rows, 1);
    var rules = [
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberGreaterThanOrEqualTo(4).setBackground('#d6f5d6').setRanges([viralRange]).build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberEqualTo(3).setBackground('#fff2c9').setRanges([viralRange]).build(),
      SpreadsheetApp.newConditionalFormatRule()
        .whenNumberLessThanOrEqualTo(2).setBackground('#ffd6d6').setRanges([viralRange]).build()
    ];
    sh.setConditionalFormatRules(rules);
  }

  SWIPE.helpRows = dataStart;
  sh.setActiveSelection(sh.getRange(dataStart, 1));
}
