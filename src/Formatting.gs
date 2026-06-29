/**
 * Formatting.gs
 * Helpers de presentación para construir el dashboard en la hoja.
 */

var THEME = {
  dark: '#0f2233',     // azul noche (cabeceras de sección)
  accent: '#1f6feb',   // azul acento
  total: '#11324d',    // fila TOTAL
  light: '#eef3f8',    // fondo claro KPI
  border: '#d0d7de',
  textLight: '#ffffff',
  good: '#1a7f37',
  warn: '#9a6700',
  bad: '#cf222e'
};

var NUMFMT = {
  eur: '€#,##0.00',
  eur0: '€#,##0',
  int: '#,##0',
  pct: '0.00%',
  pct0: '0%',
  dec2: '#,##0.00'
};

/** Escribe una cabecera de sección (banda de color) en la fila `row`. */
function writeSectionHeader(sh, row, ncols, title) {
  var rng = sh.getRange(row, 1, 1, ncols);
  rng.merge();
  rng.setValue(title.toUpperCase());
  rng.setBackground(THEME.dark).setFontColor(THEME.textLight)
    .setFontWeight('bold').setFontSize(11)
    .setVerticalAlignment('middle');
  sh.setRowHeight(row, 26);
  return row + 1;
}

/**
 * Escribe una tabla con cabecera.
 * @param header array de strings
 * @param rows   array de arrays
 * @param formats array opcional de num-format por columna (alineado a header)
 * @param totalRow bool: si la última fila es TOTAL (se resalta)
 * @return siguiente fila libre
 */
function writeTable(sh, row, header, rows, formats, totalRow) {
  var ncols = header.length;
  var hr = sh.getRange(row, 1, 1, ncols);
  hr.setValues([header]);
  hr.setBackground(THEME.accent).setFontColor(THEME.textLight).setFontWeight('bold');
  hr.setHorizontalAlignment('center');
  row++;

  if (rows.length) {
    var rng = sh.getRange(row, 1, rows.length, ncols);
    rng.setValues(rows);
    rng.setBorder(true, true, true, true, true, true, THEME.border, SpreadsheetApp.BorderStyle.SOLID);
    // formatos por columna
    if (formats) {
      for (var c = 0; c < ncols; c++) {
        if (formats[c]) sh.getRange(row, c + 1, rows.length, 1).setNumberFormat(formats[c]);
      }
    }
    // bandas alternas
    for (var i = 0; i < rows.length; i++) {
      if (i % 2 === 1) sh.getRange(row + i, 1, 1, ncols).setBackground(THEME.light);
    }
    // resaltar TOTAL
    if (totalRow) {
      var last = sh.getRange(row + rows.length - 1, 1, 1, ncols);
      last.setBackground(THEME.total).setFontColor(THEME.textLight).setFontWeight('bold');
    }
    row += rows.length;
  }
  return row + 1; // deja una fila en blanco
}

/**
 * Escribe una rejilla de KPIs (etiqueta arriba, valor grande abajo) en
 * bloques de `perRow` columnas dobles.
 * @param kpis array de { label, value, format }
 */
function writeKpiGrid(sh, row, kpis, perRow) {
  perRow = perRow || 4;
  var startRow = row;
  for (var i = 0; i < kpis.length; i++) {
    var col = (i % perRow) * 2 + 1;
    var r = startRow + Math.floor(i / perRow) * 3;
    var k = kpis[i];

    var labelCell = sh.getRange(r, col, 1, 2).merge();
    labelCell.setValue(k.label).setFontSize(9).setFontColor('#57606a')
      .setHorizontalAlignment('center').setBackground(THEME.light);

    var valueCell = sh.getRange(r + 1, col, 1, 2).merge();
    valueCell.setValue(k.value).setFontSize(16).setFontWeight('bold')
      .setHorizontalAlignment('center').setBackground(THEME.light)
      .setFontColor(THEME.dark);
    if (k.format) valueCell.setNumberFormat(k.format);
    sh.setRowHeight(r + 1, 30);
  }
  var blocks = Math.ceil(kpis.length / perRow);
  return startRow + blocks * 3 + 1;
}

/** Aplica anchos de columna estándar al dashboard. */
function setDashboardColumnWidths(sh, ncols) {
  sh.setColumnWidth(1, 230);
  for (var c = 2; c <= ncols; c++) sh.setColumnWidth(c, 120);
}
