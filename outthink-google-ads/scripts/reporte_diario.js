/**
 * OutThink 2026 — Reporte diario por email
 *
 * Script de Google Ads (no requiere infraestructura externa: se ejecuta dentro
 * de la cuenta 918-811-5388 con la programación que se le indique).
 *
 * INSTALACIÓN
 *   Google Ads -> Herramientas -> Acciones masivas -> Scripts -> "+"
 *   Pegar este archivo, autorizar, "Vista previa" para probar y luego
 *   Programar: cada día a las 08:00.
 *
 * Ajustar DESTINATARIOS antes de usar.
 */

var DESTINATARIOS = ['info@maikelechevarria.com'];
var INICIO = '2026-08-31';        // primer día de campaña
var FIN = '2026-09-24';           // día del evento
var PRESUPUESTO_TOTAL = 2000;     // €
var OBJETIVO_MIN = 200;           // registros objetivo (mínimo del rango)
var CPL_ALERTA = 15;              // € — umbral del escenario conservador

function main() {
  var hoy = new Date();
  var ayer = fechaISO(sumaDias(hoy, -1));
  var diasRestantes = Math.max(0, Math.round(
      (new Date(FIN) - hoy) / 86400000));

  var ayerDatos = consultar(ayer, ayer);
  var acumulado = consultar(INICIO, fechaISO(hoy));
  var terminos = terminosNuevos(ayer);
  var avisos = calcularAvisos(ayerDatos, acumulado, diasRestantes);

  var html = construirEmail(ayer, ayerDatos, acumulado, diasRestantes, terminos, avisos);
  var asunto = 'OutThink 2026 · ' + totales(acumulado).conversiones + ' registros · ' +
               diasRestantes + ' días para el evento' +
               (avisos.length ? ' · ' + avisos.length + ' aviso(s)' : '');

  MailApp.sendEmail({
    to: DESTINATARIOS.join(','),
    subject: asunto,
    htmlBody: html
  });
  Logger.log('Enviado a ' + DESTINATARIOS.join(', '));
}

/* ---------- datos ---------- */

function consultar(desde, hasta) {
  var q = "SELECT campaign.name, campaign.status, metrics.impressions, metrics.clicks, " +
          "metrics.cost_micros, metrics.conversions " +
          "FROM campaign WHERE segments.date BETWEEN '" + desde + "' AND '" + hasta + "' " +
          "AND campaign.status != 'REMOVED'";
  var filas = [], it = AdsApp.search(q);
  while (it.hasNext()) {
    var r = it.next();
    filas.push({
      nombre: r.campaign.name,
      estado: r.campaign.status,
      impresiones: Number(r.metrics.impressions || 0),
      clics: Number(r.metrics.clicks || 0),
      coste: Number(r.metrics.costMicros || 0) / 1000000,
      conversiones: Number(r.metrics.conversions || 0)
    });
  }
  return filas;
}

function terminosNuevos(dia) {
  var q = "SELECT search_term_view.search_term, metrics.clicks, metrics.cost_micros " +
          "FROM search_term_view WHERE segments.date = '" + dia + "' " +
          "ORDER BY metrics.cost_micros DESC LIMIT 15";
  var out = [], it = AdsApp.search(q);
  while (it.hasNext()) {
    var r = it.next();
    out.push({
      termino: r.searchTermView.searchTerm,
      clics: Number(r.metrics.clicks || 0),
      coste: Number(r.metrics.costMicros || 0) / 1000000
    });
  }
  return out;
}

function totales(filas) {
  var t = {impresiones: 0, clics: 0, coste: 0, conversiones: 0};
  for (var i = 0; i < filas.length; i++) {
    t.impresiones += filas[i].impresiones;
    t.clics += filas[i].clics;
    t.coste += filas[i].coste;
    t.conversiones += filas[i].conversiones;
  }
  return t;
}

/* ---------- avisos ---------- */

function calcularAvisos(ayerDatos, acumulado, diasRestantes) {
  var avisos = [];
  var tAyer = totales(ayerDatos), tAcum = totales(acumulado);

  for (var i = 0; i < ayerDatos.length; i++) {
    var c = ayerDatos[i];
    if (c.estado === 'ENABLED' && c.impresiones === 0) {
      avisos.push('«' + c.nombre + '» no tuvo ninguna impresión ayer.');
    }
    if (c.coste === 0 && c.estado === 'ENABLED' && c.impresiones > 0) {
      avisos.push('«' + c.nombre + '» tuvo impresiones pero no gastó nada.');
    }
  }

  var cplAcum = tAcum.conversiones ? tAcum.coste / tAcum.conversiones : 0;
  if (cplAcum > CPL_ALERTA) {
    avisos.push('CPL acumulado en ' + euros(cplAcum) + ', por encima del umbral de ' +
                euros(CPL_ALERTA) + '.');
  }
  if (tAcum.coste > 100 && tAcum.conversiones === 0) {
    avisos.push('Más de ' + euros(tAcum.coste) + ' gastados sin ninguna conversión: ' +
                'revisar que el seguimiento esté midiendo bien.');
  }

  var presupuestoRestante = PRESUPUESTO_TOTAL - tAcum.coste;
  if (diasRestantes > 0) {
    var ritmoNecesario = presupuestoRestante / diasRestantes;
    if (tAyer.coste > 0 && tAyer.coste < ritmoNecesario * 0.6) {
      avisos.push('Ritmo de gasto bajo: ayer ' + euros(tAyer.coste) + ' frente a ' +
                  euros(ritmoNecesario) + '/día necesarios para agotar el presupuesto.');
    }
  }
  if (diasRestantes <= 7 && tAcum.conversiones < OBJETIVO_MIN * 0.6) {
    avisos.push('Quedan ' + diasRestantes + ' días y llevamos ' +
                tAcum.conversiones.toFixed(0) + ' de ' + OBJETIVO_MIN + ' registros.');
  }
  return avisos;
}

/* ---------- email ---------- */

function construirEmail(ayer, ayerDatos, acumulado, diasRestantes, terminos, avisos) {
  var tAyer = totales(ayerDatos), tAcum = totales(acumulado);
  var cplAcum = tAcum.conversiones ? tAcum.coste / tAcum.conversiones : 0;
  var diasCorridos = Math.max(1, Math.round(
      (new Date(ayer) - new Date(INICIO)) / 86400000) + 1);
  var proyeccion = tAcum.conversiones / diasCorridos * (diasCorridos + diasRestantes);

  var h = '<div style="font-family:system-ui,Arial,sans-serif;max-width:760px;color:#222">';
  h += '<h2 style="margin:0 0 4px">OutThink 2026 · informe del ' + ayer + '</h2>';
  h += '<p style="color:#666;margin:0 0 20px">Quedan ' + diasRestantes +
       ' días para el evento (24 de septiembre).</p>';

  if (avisos.length) {
    h += '<div style="background:#fff4f4;border-left:4px solid #d33;padding:12px 16px;margin-bottom:20px">';
    h += '<strong>Requiere atención</strong><ul style="margin:8px 0 0;padding-left:18px">';
    for (var i = 0; i < avisos.length; i++) h += '<li>' + avisos[i] + '</li>';
    h += '</ul></div>';
  }

  h += '<h3>Acumulado</h3>';
  h += '<table style="border-collapse:collapse;width:100%;font-size:14px">' +
       fila(['', 'Impresiones', 'Clics', 'Coste', 'Registros', 'CPL'], true);
  for (var j = 0; j < acumulado.length; j++) {
    var c = acumulado[j];
    var cpl = c.conversiones ? euros(c.coste / c.conversiones) : '—';
    h += fila([c.nombre, num(c.impresiones), num(c.clics), euros(c.coste),
               c.conversiones.toFixed(0), cpl], false);
  }
  h += fila(['<strong>Total</strong>', '<strong>' + num(tAcum.impresiones) + '</strong>',
             '<strong>' + num(tAcum.clics) + '</strong>', '<strong>' + euros(tAcum.coste) + '</strong>',
             '<strong>' + tAcum.conversiones.toFixed(0) + '</strong>',
             '<strong>' + (cplAcum ? euros(cplAcum) : '—') + '</strong>'], false);
  h += '</table>';

  h += '<p style="margin-top:12px">Presupuesto consumido: <strong>' + euros(tAcum.coste) +
       '</strong> de ' + euros(PRESUPUESTO_TOTAL) + ' (' +
       (tAcum.coste / PRESUPUESTO_TOTAL * 100).toFixed(0) + '%). ' +
       'Proyección al ritmo actual: <strong>' + proyeccion.toFixed(0) +
       ' registros</strong> (objetivo ' + OBJETIVO_MIN + '+).</p>';

  h += '<h3 style="margin-top:24px">Ayer</h3>';
  h += '<table style="border-collapse:collapse;width:100%;font-size:14px">' +
       fila(['', 'Impresiones', 'Clics', 'Coste', 'Registros'], true);
  for (var k = 0; k < ayerDatos.length; k++) {
    var d = ayerDatos[k];
    h += fila([d.nombre, num(d.impresiones), num(d.clics), euros(d.coste),
               d.conversiones.toFixed(0)], false);
  }
  h += '</table>';

  if (terminos.length) {
    h += '<h3 style="margin-top:24px">Términos de búsqueda de ayer</h3>';
    h += '<p style="color:#666;font-size:13px;margin:0 0 8px">Revisar y añadir como negativas ' +
         'los que no encajen con el perfil del evento.</p>';
    h += '<table style="border-collapse:collapse;width:100%;font-size:14px">' +
         fila(['Término', 'Clics', 'Coste'], true);
    for (var m = 0; m < terminos.length; m++) {
      h += fila([terminos[m].termino, num(terminos[m].clics), euros(terminos[m].coste)], false);
    }
    h += '</table>';
  }

  h += '<p style="color:#888;font-size:12px;margin-top:28px">Generado automáticamente ' +
       'desde la cuenta de Google Ads · Qualivo</p></div>';
  return h;
}

function fila(celdas, cabecera) {
  var tag = cabecera ? 'th' : 'td';
  var estilo = 'padding:8px 10px;border-bottom:1px solid #e5e5e5;text-align:' +
               (cabecera ? 'left' : 'left') + ';' + (cabecera ? 'background:#f7f7f7' : '');
  var r = '<tr>';
  for (var i = 0; i < celdas.length; i++) {
    var alin = i === 0 ? 'left' : 'right';
    r += '<' + tag + ' style="' + estilo + 'text-align:' + alin + '">' + celdas[i] + '</' + tag + '>';
  }
  return r + '</tr>';
}

function euros(v) { return v.toFixed(2).replace('.', ',') + ' €'; }
function num(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
function sumaDias(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
function fechaISO(d) {
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
         ('0' + d.getDate()).slice(-2);
}
