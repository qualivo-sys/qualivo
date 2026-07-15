/**
 * Main.gs
 * Punto de entrada: menú, triggers (onOpen/onEdit), refresco y configuración.
 */

/** Menú al abrir la hoja. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('EAC Dashboard')
    .addItem('Refrescar mes seleccionado', 'menuRefreshCurrent')
    .addItem('Refrescar últimos 3 meses', 'menuRefreshRecent')
    .addSeparator()
    .addItem('Reconstruir vistas (sin llamar APIs)', 'menuRerender')
    .addItem('Inicializar / crear pestañas', 'setupDashboard')
    .addItem('Cargar datos de ejemplo (demo)', 'loadSeedData')
    .addSeparator()
    .addItem('Instagram: auditar cuenta', 'menuInstagramAudit')
    .addItem('Instagram: publicar prueba (de _Config)', 'igPublishTestFromConfig')
    .addSeparator()
    .addItem('Configurar credenciales (hoja _Config)', 'openConfigSheet')
    .addItem('Guardar credenciales de _Config', 'saveConfigFromSheet')
    .addItem('Programar refresco diario', 'installDailyTrigger')
    .addToUi();
}

/** Mes actualmente seleccionado en el Dashboard (B2). */
function selectedMonth() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEETS.dashboard);
  var v = sh ? sh.getRange(2, 2).getValue() : '';
  return v ? String(v) : (cacheMonths()[0] || currentMonthKey());
}

/* --------------------------- Acciones de menú --------------------------- */

function menuRefreshCurrent() {
  var m = selectedMonth();
  toast('Refrescando ' + monthLabel(m) + '…');
  refreshMonth(m);
  renderAll(m);
  toast('Listo: ' + monthLabel(m));
}

function menuRefreshRecent() {
  toast('Refrescando últimos 3 meses… (puede tardar)');
  var keys = refreshRecentMonths(3);
  renderAll(keys[0]);
  toast('Actualizados: ' + keys.join(', '));
}

function menuRerender() {
  renderAll(selectedMonth());
  toast('Vistas reconstruidas');
}

/** Crea pestañas base y pinta lo que haya en caché. */
function setupDashboard() {
  ensureConfigSheet();
  cacheSheet();
  var m = cacheMonths()[0] || currentMonthKey();
  renderAll(m);
  toast('Dashboard inicializado');
}

/** Repinta Dashboard + Comparativa + Leads. */
function renderAll(monthKey) {
  renderDashboard(monthKey);
  renderComparativa();
  renderLeads(monthKey);
}

/* ------------------------------- onEdit -------------------------------- */

/**
 * Cambiar el desplegable de mes (Dashboard!B2) repinta el Dashboard y los
 * Leads desde la caché (sin llamar a las APIs).
 */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var sh = e.range.getSheet();
    if (sh.getName() === SHEETS.dashboard && e.range.getA1Notation() === 'B2') {
      var m = String(e.range.getValue());
      renderDashboard(m);
      renderLeads(m);
    }
  } catch (err) {
    logInfo('onEdit error', err);
  }
}

/* ----------------------------- Triggers ------------------------------- */

/** Instala (idempotente) un trigger diario a las 7:00 que refresca el mes en curso. */
function installDailyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'scheduledRefresh') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('scheduledRefresh').timeBased().atHour(7).everyDays(1).create();
  toast('Refresco diario programado (7:00)');
}

function scheduledRefresh() {
  var m = currentMonthKey();
  refreshMonth(m);
  renderAll(m);
}

/* ------------------------------- Helpers ------------------------------ */

function toast(msg) {
  try { SpreadsheetApp.getActive().toast(msg, CLIENT.name + ' Dashboard', 5); } catch (e) {}
}
