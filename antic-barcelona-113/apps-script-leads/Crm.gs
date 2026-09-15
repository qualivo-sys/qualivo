/**
 * CRM — Antic Barcelona 113
 *
 * La hoja de cálculo ES el CRM. Con 20-30 leads al mes y un taller sin
 * equipo comercial, montar Pipedrive o HubSpot añade una herramienta que
 * nadie abre: lo que se mantiene es lo que ya se usa a diario.
 *
 * Se migra a un CRM de verdad cuando pase una de estas dos cosas:
 * más de 100 leads al mes, o más de una persona vendiendo a la vez.
 *
 * Todo arranca ejecutando configurar() una sola vez.
 */

// ── Estructura ──────────────────────────────────────────────────────────────

var COLUMNAS = [
  'fecha', 'origen', 'nombre', 'telefono', 'email', 'tier',
  'estado', 'responsable', 'proxima_accion', 'fecha_proxima', 'importe',
  'motivo_perdida', 'notas',
  'pieza', 'espacio', 'medidas', 'estilo', 'presupuesto', 'plazo', 'referencias',
  'primer_contacto', 'fecha_cierre',
  'utm_source', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid',
  'ip', 'user_agent', 'lead_id', 'sla_avisado'
];

var ESTADOS = ['Nuevo', 'Contactado', 'Visita o llamada', 'Presupuesto enviado',
  'Ganado', 'Perdido'];

var ESTADOS_ABIERTOS = ['Nuevo', 'Contactado', 'Visita o llamada', 'Presupuesto enviado'];

var MOTIVOS = ['Precio', 'Plazo', 'No contesta', 'Compró en otro sitio',
  'Solo miraba', 'Fuera de zona', 'Otro'];

// Horas laborables dentro de las que corre el reloj del SLA
var HORA_ABRE = 9;
var HORA_CIERRA = 20;
var SLA_HOT_HORAS = 2;

function idx(nombre) { return COLUMNAS.indexOf(nombre) + 1; }

function letra(nombre) {
  var n = idx(nombre), s = '';
  while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; }
  return s;
}

function hojaLeads() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName('Leads');
  if (!hoja) hoja = ss.insertSheet('Leads', 0);
  // Una hoja nueva trae 26 columnas y aquí hacen falta 31: sin esto,
  // setValues() de la cabecera revienta.
  if (hoja.getMaxColumns() < COLUMNAS.length) {
    hoja.insertColumnsAfter(hoja.getMaxColumns(), COLUMNAS.length - hoja.getMaxColumns());
  }
  if (hoja.getLastRow() === 0) hoja.appendRow(COLUMNAS);
  return hoja;
}

// ── Puesta en marcha ────────────────────────────────────────────────────────

/**
 * Se ejecuta UNA vez desde el editor. Crea las pestañas, los desplegables,
 * el panel y los avisos automáticos. Se puede volver a ejecutar sin romper
 * nada: no borra datos y no duplica los disparadores.
 */
/**
 * Se ejecuta UNA vez desde el editor.
 *
 * Ya no monta la hoja: las pestañas, los desplegables, los formatos y el
 * panel los construye scripts/crm/preparar-hoja.mjs desde fuera, con la
 * cuenta de servicio. Hacerlo allí quita un paso al cliente y permite
 * comprobar que salió bien antes de entregarlo.
 *
 * Lo que queda aquí es lo que solo puede vivir dentro de la cuenta de
 * Google: guardar la configuración y programar los avisos.
 */
function configurar() {
  if (typeof guardarConfig === 'function') guardarConfig();
  hojaLeads();
  instalarDisparadores();

  var props = PropertiesService.getScriptProperties();
  var faltan = ['EMAIL_AVISOS'].filter(function (k) { return !props.getProperty(k); });
  SpreadsheetApp.getActiveSpreadsheet().toast(
    faltan.length
      ? 'Hecho, pero falta rellenar arriba: ' + faltan.join(' y ')
      : 'Listo. Avisos diarios a las 8:00 y resumen semanal los lunes.',
    'Antic Barcelona 113', 8);
}

function instalarDisparadores() {
  var ss = SpreadsheetApp.getActive();
  var yaHay = {};
  ScriptApp.getProjectTriggers().forEach(function (t) { yaHay[t.getHandlerFunction()] = true; });

  if (!yaHay['alEditar']) {
    ScriptApp.newTrigger('alEditar').forSpreadsheet(ss).onEdit().create();
  }
  if (!yaHay['resumenDiario']) {
    ScriptApp.newTrigger('resumenDiario').timeBased().atHour(8).everyDays(1).create();
  }
  if (!yaHay['resumenSemanal']) {
    ScriptApp.newTrigger('resumenSemanal').timeBased()
      .onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).create();
  }
  if (!yaHay['revisarSla']) {
    ScriptApp.newTrigger('revisarSla').timeBased().everyHours(1).create();
  }
  if (!yaHay['traerLeadsDeMeta']) {
    ScriptApp.newTrigger('traerLeadsDeMeta').timeBased().everyMinutes(15).create();
  }
}

// ── El pipeline ─────────────────────────────────────────────────────────────

/**
 * Disparador instalable: al cambiar el estado de una fila, sella las fechas
 * y repinta. Hace a mano lo que en un CRM de pago es "mover la tarjeta".
 */
function alEditar(e) {
  if (!e || !e.range) return;
  var hoja = e.range.getSheet();
  if (hoja.getName() !== 'Leads') return;
  var fila = e.range.getRow();
  var columna = e.range.getColumn();
  if (fila < 2 || columna !== idx('estado')) return;

  sellarEstado(hoja, fila, String(e.range.getValue() || ''));
}

/**
 * Lo que un CRM de pago hace al arrastrar una tarjeta de columna: sella las
 * fechas. Solo hace falta cuando alguien edita el estado dentro de la hoja;
 * si lo cambia desde /crm, lo sella Vercel.
 */
function sellarEstado(hoja, fila, estado) {
  var ahora = new Date();
  if (estado && estado !== 'Nuevo' && !hoja.getRange(fila, idx('primer_contacto')).getValue()) {
    hoja.getRange(fila, idx('primer_contacto')).setValue(ahora);
  }
  if (estado === 'Ganado' || estado === 'Perdido') {
    if (!hoja.getRange(fila, idx('fecha_cierre')).getValue()) {
      hoja.getRange(fila, idx('fecha_cierre')).setValue(ahora);
    }
    hoja.getRange(fila, idx('proxima_accion')).clearContent();
    hoja.getRange(fila, idx('fecha_proxima')).clearContent();
  }
}



// ── Panel ───────────────────────────────────────────────────────────────────

function construirPanel() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var p = ss.getSheetByName('Panel') || ss.insertSheet('Panel', 0);
  p.clear();

  // Ojo al escribir fórmulas desde aquí: setFormula() habla siempre notación
  // americana (coma como separador y punto decimal) aunque la hoja esté en
  // español. Con punto y coma, Sheets las rechaza y el panel sale vacío.
  var L = 'Leads!';
  var cEstado = L + letra('estado') + '2:' + letra('estado');
  var cOrigen = L + letra('origen') + '2:' + letra('origen');
  var cFecha = L + letra('fecha') + '2:' + letra('fecha');
  var cTier = L + letra('tier') + '2:' + letra('tier');
  var cImporte = L + letra('importe') + '2:' + letra('importe');
  var cPrimero = L + letra('primer_contacto') + '2:' + letra('primer_contacto');
  var mes = 'DATE(YEAR(TODAY()),MONTH(TODAY()),1)';
  var total = 'COUNTA(' + cFecha + ')';

  p.getRange('A1').setValue('Antic Barcelona 113 · Panel de leads')
    .setFontSize(16).setFontWeight('bold');
  p.getRange('A2').setValue('Se actualiza solo. La única celda que se escribe a mano es la inversión del mes.')
    .setFontColor('#7C7266');

  function bloque(fila, titulo, b, c) {
    p.getRange(fila, 1, 1, 3).setBackground('#14100D').setFontColor('#F4EFE7').setFontWeight('bold');
    p.getRange(fila, 1).setValue(titulo);
    if (b) p.getRange(fila, 2).setValue(b);
    if (c) p.getRange(fila, 3).setValue(c);
  }

  bloque(4, 'Embudo', 'Total', 'Este mes');
  ESTADOS.forEach(function (e, i) {
    p.getRange(5 + i, 1).setValue(e);
    p.getRange(5 + i, 2).setFormula('=COUNTIF(' + cEstado + ',"' + e + '")');
    p.getRange(5 + i, 3).setFormula(
      '=COUNTIFS(' + cEstado + ',"' + e + '",' + cFecha + ',">="&' + mes + ')');
  });

  bloque(12, 'Conversión');
  var presupuestados = 'COUNTIF(' + cEstado + ',"Presupuesto enviado")+COUNTIF(' + cEstado + ',"Ganado")';
  var ganados = 'COUNTIF(' + cEstado + ',"Ganado")';
  var conv = [
    ['Contesta el cliente', '=IFERROR(COUNTA(' + cPrimero + ')/' + total + ',0)'],
    ['Llega a presupuesto', '=IFERROR((' + presupuestados + ')/' + total + ',0)'],
    ['Cierra en venta', '=IFERROR(' + ganados + '/' + total + ',0)'],
    ['Presupuesto → venta', '=IFERROR(' + ganados + '/(' + presupuestados + '),0)']
  ];
  conv.forEach(function (r, i) {
    p.getRange(13 + i, 1).setValue(r[0]);
    p.getRange(13 + i, 2).setFormula(r[1]).setNumberFormat('0.0%');
  });

  bloque(18, 'Dinero');
  var dinero = [
    ['Facturado (ganado)', '=SUMIF(' + cEstado + ',"Ganado",' + cImporte + ')'],
    ['Pipeline abierto', '=SUMIF(' + cEstado + ',"Presupuesto enviado",' + cImporte + ')'],
    ['Ticket medio ganado', '=IFERROR(AVERAGEIF(' + cEstado + ',"Ganado",' + cImporte + '),0)']
  ];
  dinero.forEach(function (r, i) {
    p.getRange(19 + i, 1).setValue(r[0]);
    p.getRange(19 + i, 2).setFormula(r[1]).setNumberFormat('#,##0 €');
  });

  bloque(23, 'Coste de adquisición');
  p.getRange('A24').setValue('Inversión en Meta este mes (€)');
  p.getRange('B24').setValue(0).setNumberFormat('#,##0 €')
    .setBackground('#FFF4E5').setBorder(true, true, true, true, false, false);
  p.getRange('C24').setValue('← se escribe a mano cada semana').setFontColor('#7C7266');

  var mesLeads = 'COUNTIFS(' + cFecha + ',">="&' + mes + ')';
  var mesHot = 'COUNTIFS(' + cFecha + ',">="&' + mes + ',' + cTier + ',"HOT")';
  var mesVentas = 'COUNTIFS(' + cFecha + ',">="&' + mes + ',' + cEstado + ',"Ganado")';
  [['Coste por lead', mesLeads], ['Coste por lead HOT', mesHot], ['Coste por venta', mesVentas]]
    .forEach(function (r, i) {
      p.getRange(25 + i, 1).setValue(r[0]);
      p.getRange(25 + i, 2).setFormula('=IFERROR($B$24/' + r[1] + ',"—")')
        .setNumberFormat('#,##0 €');
    });
  p.getRange('A28').setValue('Retorno sobre la inversión').setFontWeight('bold');
  p.getRange('B28').setFormula('=IFERROR(SUMIFS(' + cImporte + ',' + cEstado +
    ',"Ganado",' + cFecha + ',">="&' + mes + ')/$B$24,"—")').setNumberFormat('0.0"×"');

  bloque(30, 'De dónde vienen', 'Leads', 'Ventas');
  [['Guía descargada', 'guia'], ['Cuestionario', 'cuestionario'], ['Formulario de Meta', 'meta_form']]
    .forEach(function (r, i) {
      p.getRange(31 + i, 1).setValue(r[0]);
      p.getRange(31 + i, 2).setFormula('=COUNTIF(' + cOrigen + ',"' + r[1] + '")');
      p.getRange(31 + i, 3).setFormula(
        '=COUNTIFS(' + cOrigen + ',"' + r[1] + '",' + cEstado + ',"Ganado")');
    });

  bloque(35, 'Por creatividad', 'Leads', 'A presupuesto');
  var cCont = L + letra('utm_content') + '2:' + letra('utm_content');
  p.getRange('A36').setFormula(
    '=IFERROR(QUERY({' + cCont + ',' + cEstado + '},' +
    '"select Col1, count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc label count(Col1) \'\'",0),' +
    '"Sin datos todavía")');

  p.setColumnWidth(1, 240);
  p.setColumnWidth(2, 110);
  p.setColumnWidth(3, 220);
  ss.setActiveSheet(p);
}

// ── Avisos ──────────────────────────────────────────────────────────────────

function destinatarios(clave) {
  var v = PropertiesService.getScriptProperties().getProperty(clave) || '';
  return v.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}

function leerLeads() {
  var hoja = hojaLeads();
  if (hoja.getLastRow() < 2) return [];
  var datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, COLUMNAS.length).getValues();
  return datos.map(function (fila, i) {
    var o = { _fila: i + 2 };
    COLUMNAS.forEach(function (c, j) { o[c] = fila[j]; });
    return o;
  });
}

/** Cada mañana: lo que hay que hacer hoy, no un informe. */
function resumenDiario() {
  var para = destinatarios('EMAIL_AVISOS');
  if (!para.length) return;
  var leads = leerLeads();
  var hoy = new Date(); hoy.setHours(0, 0, 0, 0);

  // Mismo criterio que la pestaña «Hoy» de /crm: lo que toca hoy, no todo lo
  // que ha entrado. Un frío de guía tiene fecha a siete días y no sale aquí.
  var sinTocar = leads.filter(function (l) {
    return l.estado === 'Nuevo' && (!l.fecha_proxima || new Date(l.fecha_proxima) <= new Date());
  }).sort(function (a, b) { return new Date(a.fecha) - new Date(b.fecha); });
  var vencidas = leads.filter(function (l) {
    return l.estado !== 'Nuevo' && ESTADOS_ABIERTOS.indexOf(l.estado) >= 0 &&
      l.fecha_proxima && new Date(l.fecha_proxima) <= hoy;
  });

  if (!sinTocar.length && !vencidas.length) return;  // sin deberes, sin correo

  var html = '<div style="font-family:system-ui,sans-serif;font-size:15px;color:#332B23;max-width:640px">';
  if (sinTocar.length) {
    html += '<h3 style="margin:0 0 6px">Sin contactar todavía (' + sinTocar.length + ')</h3>' +
      '<p style="color:#7C7266;margin:0 0 10px">El más antiguo arriba.</p>' +
      tabla(sinTocar);
  }
  if (vencidas.length) {
    html += '<h3 style="margin:22px 0 6px">Con la próxima acción vencida (' + vencidas.length + ')</h3>' +
      tabla(vencidas, true);
  }
  html += '<p style="margin-top:22px"><a href="' +
    SpreadsheetApp.getActiveSpreadsheet().getUrl() +
    '" style="background:#8C5E32;color:#fff;padding:10px 18px;border-radius:999px;' +
    'text-decoration:none;display:inline-block">Abrir el CRM</a></p></div>';

  MailApp.sendEmail({
    to: para.join(','),
    subject: 'Leads de hoy · ' + sinTocar.length + ' sin contactar' +
      (vencidas.length ? ' · ' + vencidas.length + ' vencidos' : ''),
    name: 'CRM Antic Barcelona 113',
    htmlBody: html,
  });
}

function tabla(leads, conAccion) {
  var filas = leads.slice(0, 25).map(function (l) {
    var tel = String(l.telefono || '').replace(/\D/g, '');
    return '<tr>' +
      '<td style="padding:6px 12px 6px 0;white-space:nowrap">' + fechaCorta(l.fecha) + '</td>' +
      '<td style="padding:6px 12px 6px 0"><b>' + escapar(l.nombre || '—') + '</b>' +
      (l.tier === 'HOT' ? ' <span style="background:#FCE8E6;padding:1px 6px;border-radius:4px;font-size:12px">HOT</span>' : '') + '</td>' +
      '<td style="padding:6px 12px 6px 0">' + escapar(l.pieza || '') + '</td>' +
      '<td style="padding:6px 12px 6px 0;color:#7C7266">' +
      escapar(conAccion ? String(l.proxima_accion || '') : String(l.presupuesto || '')) + '</td>' +
      '<td style="padding:6px 0">' + (tel ?
        '<a href="https://wa.me/' + tel + '" style="color:#8C5E32">WhatsApp</a>' : '') + '</td>' +
      '</tr>';
  }).join('');
  return '<table style="border-collapse:collapse;font-size:14px">' + filas + '</table>' +
    (leads.length > 25 ? '<p style="color:#7C7266">y ' + (leads.length - 25) + ' más…</p>' : '');
}

/**
 * Los lunes, a cliente y agencia. Lo que se mira aquí no es cuántos leads
 * entraron sino de qué creatividad salieron los que llegan a presupuesto:
 * es lo único que dice qué anuncio hay que subir y cuál apagar.
 */
function resumenSemanal() {
  var para = destinatarios('EMAIL_AVISOS').concat(destinatarios('EMAIL_AGENCIA'));
  if (!para.length) return;
  var leads = leerLeads();
  var ahora = new Date();
  var hace7 = new Date(ahora - 7 * 864e5);
  var hace14 = new Date(ahora - 14 * 864e5);

  var semana = leads.filter(function (l) { return l.fecha && new Date(l.fecha) >= hace7; });
  var previa = leads.filter(function (l) {
    var d = l.fecha && new Date(l.fecha);
    return d && d >= hace14 && d < hace7;
  });

  var porCreatividad = {};
  semana.forEach(function (l) {
    var k = String(l.utm_content || l.origen || 'sin identificar');
    porCreatividad[k] = porCreatividad[k] || { n: 0, hot: 0, presu: 0, ganado: 0 };
    porCreatividad[k].n++;
    if (l.tier === 'HOT') porCreatividad[k].hot++;
    if (l.estado === 'Presupuesto enviado' || l.estado === 'Ganado') porCreatividad[k].presu++;
    if (l.estado === 'Ganado') porCreatividad[k].ganado++;
  });

  var orden = Object.keys(porCreatividad).sort(function (a, b) {
    return porCreatividad[b].presu - porCreatividad[a].presu ||
      porCreatividad[b].n - porCreatividad[a].n;
  });

  var filas = orden.map(function (k) {
    var c = porCreatividad[k];
    return '<tr><td style="padding:5px 14px 5px 0">' + escapar(k) + '</td>' +
      '<td style="padding:5px 14px 5px 0;text-align:right">' + c.n + '</td>' +
      '<td style="padding:5px 14px 5px 0;text-align:right">' + c.hot + '</td>' +
      '<td style="padding:5px 14px 5px 0;text-align:right"><b>' + c.presu + '</b></td>' +
      '<td style="padding:5px 0;text-align:right">' + c.ganado + '</td></tr>';
  }).join('');

  var abiertos = leads.filter(function (l) { return ESTADOS_ABIERTOS.indexOf(l.estado) >= 0; });
  var sinTocar = leads.filter(function (l) { return l.estado === 'Nuevo'; }).length;
  var delta = semana.length - previa.length;

  MailApp.sendEmail({
    to: para.join(','),
    subject: 'Semana · ' + semana.length + ' leads' +
      (delta ? ' (' + (delta > 0 ? '+' : '') + delta + ' vs anterior)' : ''),
    name: 'CRM Antic Barcelona 113',
    htmlBody: '<div style="font-family:system-ui,sans-serif;font-size:15px;color:#332B23;max-width:680px">' +
      '<h3 style="margin:0 0 4px">' + semana.length + ' leads en 7 días</h3>' +
      '<p style="color:#7C7266;margin:0 0 18px">Semana anterior: ' + previa.length + '. ' +
      'En marcha ahora mismo: ' + abiertos.length + '. Sin contactar: ' + sinTocar + '.</p>' +
      '<h4 style="margin:0 0 6px">Qué creatividad trae los leads que llegan lejos</h4>' +
      '<table style="border-collapse:collapse;font-size:14px">' +
      '<tr style="color:#7C7266;text-align:right"><th style="text-align:left;padding-right:14px">Creatividad</th>' +
      '<th style="padding-right:14px">Leads</th><th style="padding-right:14px">HOT</th>' +
      '<th style="padding-right:14px">A presupuesto</th><th>Ventas</th></tr>' +
      (filas || '<tr><td colspan="5" style="color:#7C7266">Todavía sin datos.</td></tr>') +
      '</table>' +
      '<p style="color:#7C7266;font-size:13px;margin-top:14px">La columna que decide es ' +
      '«A presupuesto». Una creatividad con muchos leads y cero presupuestos está ' +
      'trayendo gente que no compra, y sale más cara que otra con la mitad de leads.</p>' +
      '<p style="margin-top:20px"><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() +
      '" style="background:#8C5E32;color:#fff;padding:10px 18px;border-radius:999px;' +
      'text-decoration:none;display:inline-block">Abrir el panel</a></p></div>',
  });
}

/** Cada hora, en horario de taller: un HOT parado más de 2 h se avisa una vez. */
function revisarSla() {
  var h = new Date().getHours();
  if (h < HORA_ABRE || h >= HORA_CIERRA) return;
  var para = destinatarios('EMAIL_AVISOS');
  if (!para.length) return;

  var hoja = hojaLeads();
  var limite = new Date(Date.now() - SLA_HOT_HORAS * 36e5);

  leerLeads().forEach(function (l) {
    if (l.tier !== 'HOT' || l.estado !== 'Nuevo' || l.sla_avisado) return;
    if (!l.fecha || new Date(l.fecha) > limite) return;
    var tel = String(l.telefono || '').replace(/\D/g, '');
    MailApp.sendEmail({
      to: para.join(','),
      subject: '⏰ ' + SLA_HOT_HORAS + ' h sin responder a un lead HOT · ' + (l.nombre || ''),
      name: 'CRM Antic Barcelona 113',
      htmlBody: '<div style="font-family:system-ui,sans-serif;font-size:15px;color:#332B23">' +
        '<p><b>' + escapar(l.nombre || '') + '</b> pidió presupuesto hace más de ' +
        SLA_HOT_HORAS + ' horas y sigue en «Nuevo».</p>' +
        '<p style="color:#7C7266">' + escapar([l.pieza, l.medidas, l.presupuesto, l.plazo]
          .filter(Boolean).join(' · ')) + '</p>' +
        (tel ? '<p><a href="https://wa.me/' + tel + '" style="background:#8C5E32;color:#fff;' +
          'padding:10px 18px;border-radius:999px;text-decoration:none;display:inline-block">' +
          'Escribir ahora</a></p>' : '') + '</div>',
    });
    hoja.getRange(l._fila, idx('sla_avisado')).setValue(new Date());
  });
}

function fechaCorta(d) {
  if (!d) return '';
  try { return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), 'dd/MM HH:mm'); }
  catch (e) { return String(d); }
}

// ── Entrada ─────────────────────────────────────────────────────────────────

/**
 * Única puerta de escritura: la usan tanto los leads de la web (Codigo.gs)
 * como los del formulario de Meta (MetaLeads.gs).
 */
function guardar(lead) {
  var hoja = hojaLeads();
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS);
    hoja.setFrozenRows(1);
  }
  if (!lead.lead_id) {
    lead.lead_id = 'web_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  }
  var fila = COLUMNAS.map(function (c) {
    if (c === 'estado') return 'Nuevo';
    if (c === 'proxima_accion') return primeraAccion(lead);
    if (c === 'fecha_proxima') return new Date();
    // La web manda la fecha como texto ISO. Si se guarda tal cual, las
    // fórmulas del panel que comparan fechas devuelven cero.
    if (c === 'fecha') return lead.fecha ? new Date(lead.fecha) : new Date();
    return lead[c] !== undefined && lead[c] !== null ? lead[c] : '';
  });
  hoja.appendRow(fila);
}

/** El CRM no sirve de nada si al abrirlo hay que decidir qué hacer. */
function primeraAccion(lead) {
  if (lead.tier === 'HOT') return 'WhatsApp hoy + proponer visita al taller';
  if (lead.tier === 'WARM') return 'WhatsApp con 2 proyectos parecidos';
  if (lead.origen === 'guia') return 'Dejar madurar. Revisar en 7 días.';
  return 'WhatsApp para entender el proyecto';
}
