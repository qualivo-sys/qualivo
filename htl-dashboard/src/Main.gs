/**
 * Main.gs — Menú y arranque del dashboard HackTheLead.
 */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('HackTheLead')
    .addItem('Actualizar dashboard', 'htlRenderAll')
    .addSeparator()
    .addItem('Activar alertas de leads (email)', 'htlInstallLeadAlerts')
    .addItem('Enviar email de prueba (QA)', 'htlTestLeadEmail')
    .addItem('Programar refresco diario (7:00)', 'htlInstallDailyRefresh')
    .addSeparator()
    .addItem('Comprobar leads ahora', 'htlCheckNewLeads')
    .addToUi();
}
