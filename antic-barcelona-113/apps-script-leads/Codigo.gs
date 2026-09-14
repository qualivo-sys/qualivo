/**
 * Receptor de leads — Antic Barcelona 113
 *
 * Se pega en la hoja de cálculo (Extensiones → Apps Script), se despliega como
 * app web y la URL /exec se mete en Vercel como LEAD_WEBHOOK_URL.
 *
 * Qué hace con cada lead:
 *   1. Lo añade como fila en la pestaña "Leads"
 *   2. Si viene de la guía, manda el email con el PDF adjunto
 *   3. Avisa por correo al comercial, marcando en el asunto si es HOT
 *
 * Configuración: Proyecto → Configuración → Propiedades del script
 *   SECRETO        debe coincidir con LEAD_SHARED_SECRET de Vercel
 *   EMAIL_AVISOS   dónde llegan los avisos de lead nuevo
 *
 * La guía se descarga de la propia web al enviar el correo, así que no hay
 * que subirla a Drive ni mantener dos copias: el adjunto siempre es la que
 * está publicada.
 */
var URL_GUIA = 'https://antic-barcelona-113.vercel.app/descargas/guia-mesa-perfecta-antic-barcelona-113.pdf';

var COLUMNAS = ['fecha', 'origen', 'nombre', 'email', 'telefono', 'tier', 'pieza',
  'espacio', 'medidas', 'estilo', 'presupuesto', 'plazo', 'referencias',
  'utm_source', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid',
  'ip', 'user_agent', 'estado', 'primer_contacto', 'importe', 'resultado'];

function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var secreto = props.getProperty('SECRETO');
    if (secreto) {
      var enviado = (e.parameter && e.parameter.secret) ||
        (e.postData && JSON.parse(e.postData.contents).secret) || '';
      // Apps Script no expone cabeceras personalizadas: el secreto viaja en el cuerpo.
      if (enviado !== secreto) return json({ ok: false, error: 'no_autorizado' });
    }

    var lead = JSON.parse(e.postData.contents);
    guardar(lead);

    if (lead.origen === 'guia') enviarGuia(lead, props);
    avisarComercial(lead, props);

    return json({ ok: true });
  } catch (err) {
    console.error('Error procesando lead: ' + err);
    return json({ ok: false, error: String(err) });
  }
}

function doGet() { return json({ ok: true, servicio: 'leads AB113' }); }

function guardar(lead) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName('Leads');
  if (!hoja) {
    hoja = ss.insertSheet('Leads');
    hoja.appendRow(COLUMNAS);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold').setBackground('#F4EFE7');
    hoja.setFrozenRows(1);
  }
  var fila = COLUMNAS.map(function (c) {
    if (c === 'estado') return 'Nuevo';
    return lead[c] !== undefined && lead[c] !== null ? lead[c] : '';
  });
  hoja.appendRow(fila);

  // Los HOT en rojo suave, para que salten a la vista al abrir la hoja
  if (lead.tier === 'HOT') {
    hoja.getRange(hoja.getLastRow(), 1, 1, COLUMNAS.length).setBackground('#FCE8E6');
  }
}

function enviarGuia(lead, props) {
  var adjuntos = [];
  try {
    var resp = UrlFetchApp.fetch(URL_GUIA, { muteHttpExceptions: true });
    if (resp.getResponseCode() === 200) {
      adjuntos.push(resp.getBlob().setName('Guia-mesa-perfecta-Antic-Barcelona-113.pdf'));
    } else {
      console.error('La guía respondió ' + resp.getResponseCode() + '; se envía el correo sin adjunto.');
    }
  } catch (err) {
    console.error('No se pudo descargar la guía: ' + err);
  }
  var nombre = (lead.nombre || '').split(' ')[0];
  MailApp.sendEmail({
    to: lead.email,
    subject: 'Tu guía para elegir la mesa perfecta',
    name: 'Antic Barcelona 113',
    htmlBody:
      '<div style="font-family:Georgia,serif;font-size:16px;line-height:1.6;color:#332B23;max-width:560px">' +
      '<p>Hola ' + escapar(nombre) + ',</p>' +
      '<p>Aquí tienes la guía. Son siete apartados con lo que preguntamos a todos ' +
      'nuestros clientes antes de empezar: medidas, comensales, maderas, acabados, ' +
      'qué encarece una pieza y los plazos reales.</p>' +
      (adjuntos.length ? '' :
        '<p><a href="' + URL_GUIA + '" style="color:#8C5E32">Descargar la guía en PDF →</a></p>') +
      '<p>Si ya tienes un espacio concreto en la cabeza, cuéntanoslo y te decimos ' +
      'qué encaja:<br>' +
      '<a href="https://antic-barcelona-113.vercel.app/cuestionario" ' +
      'style="color:#8C5E32">Diseña tu pieza →</a></p>' +
      '<p style="color:#7C7266;font-size:14px">Un saludo,<br>' +
      'El equipo de Antic Barcelona 113<br>' +
      'Taller en Terrassa · +34 665 521 684</p></div>',
    attachments: adjuntos,
  });
}

function avisarComercial(lead, props) {
  var destino = props.getProperty('EMAIL_AVISOS');
  if (!destino) return;
  var caliente = lead.tier === 'HOT';
  var asunto = (caliente ? '🔥 LEAD HOT · ' : 'Lead nuevo · ') +
    (lead.nombre || '') + (lead.pieza ? ' · ' + lead.pieza : '');
  var filas = ['nombre', 'email', 'telefono', 'tier', 'pieza', 'espacio', 'medidas',
    'estilo', 'presupuesto', 'plazo', 'utm_campaign', 'utm_content']
    .filter(function (c) { return lead[c]; })
    .map(function (c) {
      return '<tr><td style="padding:4px 12px 4px 0;color:#7C7266">' + c +
        '</td><td style="padding:4px 0"><b>' + escapar(String(lead[c])) + '</b></td></tr>';
    }).join('');
  MailApp.sendEmail({
    to: destino,
    subject: asunto,
    htmlBody: '<div style="font-family:system-ui,sans-serif;font-size:15px;color:#332B23">' +
      (caliente ? '<p style="background:#FCE8E6;padding:10px 14px;border-radius:6px">' +
        '<b>Lead HOT.</b> Proyecto definido, presupuesto y plazo cercano. ' +
        'WhatsApp en menos de 2 horas laborables.</p>' : '') +
      '<table>' + filas + '</table>' +
      (lead.telefono ? '<p><a href="https://wa.me/' + String(lead.telefono).replace(/\D/g, '') +
        '" style="background:#8C5E32;color:#fff;padding:10px 18px;border-radius:999px;' +
        'text-decoration:none;display:inline-block;margin-top:14px">Escribir por WhatsApp</a></p>' : '') +
      '</div>',
  });
}

function escapar(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
