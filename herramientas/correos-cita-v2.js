// Genera las vistas previas de los correos de la cita v2 (api/_correo-cita.js)
// en content/correos/. Datos de ejemplo, inventados: ningún lead real.
//   node herramientas/correos-cita-v2.js

const fs = require('fs');
const path = require('path');
const CC = require('../api/_correo-cita.js');

const SALIDA = path.join(__dirname, '..', 'content', 'correos');
const F = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

// Contacto de ejemplo con las etiquetas que ponen los formularios.
const contacto = {
  firstName: 'Marta', companyName: 'Academia Ejemplo',
  tags: ['sector-formacion', 'fuga-en-el-tiempo-de-respuesta-a', 'vol-20-50']
};
const d = CC.datosDe(contacto);
const cita = { dia: 'jueves, 1 de octubre', hora: '10:00', cuando: 'mañana', enlace: 'https://meet.google.com/abc-defg-hij' };

function esc(v) { return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

function aviso(que, cuando) {
  return '<div style="max-width:560px;margin:16px auto 0;padding:12px 16px;border:1px dashed #C9CBD1;border-radius:10px;background:#FFFBEA;font-family:' + F + ';font-size:13px;line-height:1.5;color:#3D4148;">' +
    '<b>Vista previa · borrador pendiente del ok de Maikel.</b> ' + que + ' Sale ' + cuando + '. ' +
    'Datos de ejemplo: formación, «dónde se te escapa: en el tiempo de respuesta», 20-50 solicitudes al mes. ' +
    'Apagado en código (<code>CORREO_CITA_V2 = false</code>).</div>';
}

function variantes() {
  const fila = function (a, b) { return '<tr><td style="padding:8px 10px;border-top:1px solid #E6E6E6;vertical-align:top;font-weight:700;width:150px;">' + esc(a) + '</td><td style="padding:8px 10px;border-top:1px solid #E6E6E6;vertical-align:top;">' + esc(b) + '</td></tr>'; };
  const tabla = function (titulo, filas) { return '<h3 style="font-size:15px;margin:22px 0 6px;">' + esc(titulo) + '</h3><table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;">' + filas.join('') + '</table>'; };
  const fugas = ['respuesta', 'seguimiento', 'anuncios', 'web', 'nolose', ''];
  const nombreFuga = { respuesta: 'Tiempo de respuesta', seguimiento: 'Seguimiento y presupuestos', anuncios: 'Anuncios y captación', web: 'Web y formularios', nolose: 'No lo sé', '': 'Sin respuesta' };
  const sectores = ['formacion', 'clinica', 'reformas', 'otro'];
  const out = [];
  out.push(tabla('«En el formulario me dijiste que…» (según su respuesta)', fugas.filter(Boolean).map(function (f) { return fila(nombreFuga[f], '…' + CC.FUGA_DICHA[f] + '.'); }).concat([fila('Sin respuesta', 'No sale la frase.')])));
  out.push(tabla('Punto 2 «Tu etapa más floja, funcionando» (ejemplo con formación)', fugas.map(function (f) { return fila(nombreFuga[f], CC.etapa({ sector: 'formacion', fuga: f })); })));
  out.push(tabla('Los cuatro números y el caso, por sector', sectores.map(function (s) {
    const x = CC.SECTOR[s];
    return fila({ formacion: 'Formación', clinica: 'Clínica', reformas: 'Reformas', otro: 'Otro sector' }[s],
      '1. Cuánto inviertes al mes en anuncios. 2. ' + x.n2 + ' 3. ' + x.n3 + ' 4. ' + x.n4 + (x.caso ? ' · Caso: ' + x.caso : ' · Sin caso.'));
  })));
  return '<div style="max-width:760px;margin:28px auto 40px;padding:20px 24px;background:#FFFFFF;border-radius:14px;font-family:' + F + ';color:#101319;">' +
    '<h2 style="font-size:18px;margin:0 0 4px;">Variantes que se ponen solas</h2>' +
    '<p style="font-size:14px;color:#5A5E66;margin:0;">Salen de las etiquetas del contacto (sector-, fuga-, vol-). Si falta un dato, esa frase no aparece.</p>' +
    out.join('') + '</div>';
}

function guardar(nombre, correo, que, cuando, extra) {
  let html = correo.html.replace(/(<body[^>]*>)/, '$1\n' + aviso(que + ' Asunto: «' + esc(correo.asunto) + '».', cuando));
  if (extra) html = html.replace('</body>', extra + '</body>');
  fs.writeFileSync(path.join(SALIDA, nombre), html + '\n');
  console.log('escrito', nombre);
}

guardar('confirmacion-cita-v2.html', CC.confirmacion(d, cita), 'Correo de confirmación.', 'nada más reservar, a la vez que el WhatsApp de confirmación', variantes());
guardar('recordatorio-vispera-v2.html', CC.vispera(d, cita), 'Recordatorio de la víspera.', 'a las 18:30 del día anterior, solo si reservó con dos o más días de antelación');
guardar('recordatorio-dia-v2.html', CC.dia(d, cita), 'Recordatorio del mismo día.', 'a las 9:00 del día de la cita');
