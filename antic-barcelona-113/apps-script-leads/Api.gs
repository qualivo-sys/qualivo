/**
 * API de la hoja — Antic Barcelona 113
 *
 * Lo que convierte la hoja en el motor del CRM que se ve en
 * antic-barcelona-113.vercel.app/crm
 *
 * La hoja sigue siendo el sitio donde viven los datos. Vercel solo pone la
 * cara: así no hay base de datos nueva que mantener, los avisos automáticos
 * siguen funcionando igual y, si algún día la app web se cae, los leads no se
 * pierden ni dejan de llegar.
 *
 * Todas las llamadas son POST a la URL /exec con el mismo SECRETO que usa
 * la captura de leads.
 */

function atender(peticion) {
  var accion = peticion.accion;
  if (accion === 'listar') return { ok: true, leads: listarLeads(), estados: ESTADOS, motivos: MOTIVOS };
  if (accion === 'actualizar') return actualizarLead(peticion);
  return null;   // no es una llamada de la API: lo trata doPost como lead nuevo
}

function listarLeads() {
  var hoja = hojaLeads();
  if (hoja.getLastRow() < 2) return [];
  var datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, COLUMNAS.length).getValues();
  var fuera = { ip: 1, user_agent: 1, fbclid: 1, sla_avisado: 1 };
  return datos.map(function (fila, i) {
    var o = { _fila: i + 2 };
    COLUMNAS.forEach(function (c, j) {
      if (fuera[c]) return;                       // no hace falta en pantalla
      var v = fila[j];
      o[c] = (v instanceof Date) ? v.toISOString() : v;
    });
    return o;
  }).reverse();                                    // lo último que entró, arriba
}

// Lo único que la app puede tocar. El resto (fecha, origen, utm, puntuación)
// es historia del lead y no se reescribe desde fuera.
var EDITABLES = ['estado', 'responsable', 'proxima_accion', 'fecha_proxima',
  'importe', 'motivo_perdida', 'notas', 'telefono', 'email'];

function actualizarLead(peticion) {
  var hoja = hojaLeads();
  var fila = filaDeLead(hoja, peticion.lead_id);
  if (!fila) return { ok: false, error: 'lead_no_encontrado' };

  var campos = peticion.campos || {};
  Object.keys(campos).forEach(function (c) {
    if (EDITABLES.indexOf(c) < 0) return;
    var v = campos[c];
    if (c === 'estado' && ESTADOS.indexOf(v) < 0) return;
    if (c === 'fecha_proxima' && v) v = new Date(v);
    if (c === 'importe') v = Number(String(v).replace(/[^\d.,-]/g, '').replace(',', '.')) || '';
    hoja.getRange(fila, idx(c)).setValue(v === null || v === undefined ? '' : v);
  });

  if (campos.estado) sellarEstado(hoja, fila, campos.estado);
  else pintarFila(hoja, fila);

  var valores = hoja.getRange(fila, 1, 1, COLUMNAS.length).getValues()[0];
  var lead = { _fila: fila };
  COLUMNAS.forEach(function (c, j) {
    lead[c] = valores[j] instanceof Date ? valores[j].toISOString() : valores[j];
  });
  return { ok: true, lead: lead };
}

function filaDeLead(hoja, leadId) {
  if (!leadId || hoja.getLastRow() < 2) return 0;
  var ids = hoja.getRange(2, idx('lead_id'), hoja.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(leadId)) return i + 2;
  }
  return 0;
}
