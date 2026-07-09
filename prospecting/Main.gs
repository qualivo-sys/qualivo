/**
 * Main.gs · menú, setup y triggers del Radar de Prospección.
 */

/** Menú al abrir la hoja. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Radar Qualivo')
    .addItem('▶ Ejecutar radar ahora', 'menuEjecutarRadar')
    .addItem('Inicializar / crear pestañas', 'setupRadar')
    .addSeparator()
    .addItem('✉ Generar borradores de email (Cualificados)', 'menuGenerarBorradores')
    .addItem('Enviar Cualificados a Smartlead', 'menuEnviarSmartlead')
    .addItem('Enviar Cualificados a HeyReach', 'menuEnviarHeyReach')
    .addSeparator()
    .addItem('Configurar credenciales (_Config)', 'openConfigSheet')
    .addItem('Guardar credenciales de _Config', 'saveConfigFromSheet')
    .addSeparator()
    .addItem('⏱ Programar radar diario (7:00)', 'instalarTriggerDiario')
    .addItem('Quitar radar programado', 'quitarTriggerDiario')
    .addToUi();
}

/** Crea las pestañas base (Prospectos, _Config, _Log). */
function setupRadar() {
  ensureConfigSheet();
  prospectSheet();
  logSheet();
  toast('Radar inicializado. Rellena _Config y ejecuta el radar.');
}

/* --------------------------- Acciones de menú -------------------------- */

function menuEjecutarRadar() {
  toast('Ejecutando radar… (puede tardar 1-2 min)');
  var n = ejecutarRadar();
  toast('Radar completado: ' + n + ' prospectos nuevos.');
}

function menuGenerarBorradores() {
  var n = generarBorradores();
  toast(n + ' borradores de Gmail creados (revísalos antes de enviar).');
}

function menuEnviarSmartlead() {
  var n = enviarASmartlead();
  toast(n + ' contactos enviados a Smartlead.');
}

function menuEnviarHeyReach() {
  var n = enviarAHeyReach();
  toast(n + ' contactos enviados a HeyReach.');
}

/* ------------------------------ Triggers ------------------------------ */

/** Instala (idempotente) un trigger diario a las 7:00 que ejecuta el radar. */
function instalarTriggerDiario() {
  quitarTriggerDiario();
  ScriptApp.newTrigger('radarProgramado').timeBased().atHour(7).everyDays(1).create();
  toast('Radar diario programado (7:00).');
}

/** Elimina el trigger programado del radar. */
function quitarTriggerDiario() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'radarProgramado') ScriptApp.deleteTrigger(t);
  });
}

/** Handler del trigger: solo DETECTA y escribe (nunca contacta). */
function radarProgramado() {
  ejecutarRadar();
}

/* ------------------------------- Helpers ------------------------------ */

function toast(msg) {
  try { SpreadsheetApp.getActive().toast(msg, 'Radar Qualivo', 6); } catch (e) {}
}
