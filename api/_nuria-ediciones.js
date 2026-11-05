// Intelligence de Nuria · El Círculo por edición, con las etiquetas de GHL.
// Cada edición se identifica por la fecha de su directo (miércoles, AAAA-MM-DD).
// Etiquetas (existen desde la edición del 28-oct-2026):
//   «[registro ads] AAAA-MM-DD», «[registro org] AAAA-MM-DD», «[ingresa a comunidad] AAAA-MM-DD»
//   y, en ediciones antiguas, «[abandona comunidad DD-MM-AAAA]».
// Ventas: las de la hoja de personas con etiqueta de registro de esa edición.
// Inversión: gasto de Meta en campañas de El Círculo durante la captación (viernes a jueves, de 12 a 6 días antes del directo).
// Solo lectura; la respuesta no lleva datos personales.

const N = require('./_nuria-semana.js');
const NBSP = ' ';

function etiquetas(d) {
  const dmy = d.slice(8, 10) + '-' + d.slice(5, 7) + '-' + d.slice(0, 4);
  return { ads: '[registro ads]' + NBSP + d, org: '[registro org]' + NBSP + d, grupo: '[ingresa a comunidad]' + NBSP + d, sale: '[abandona comunidad ' + dmy + ']' };
}
async function total(tag) {
  const r = await N.ghl('/contacts/search', { cuerpo: { locationId: process.env.NURIA_GHL_LOCATION_ID, pageLimit: 1, filters: [{ field: 'tags', operator: 'eq', value: tag }] } });
  return Number(r.total || 0);
}
async function emails(tag) {
  const out = [];
  for (let page = 1; page <= 10; page++) {
    const r = await N.ghl('/contacts/search', { cuerpo: { locationId: process.env.NURIA_GHL_LOCATION_ID, pageLimit: 500, page: page, filters: [{ field: 'tags', operator: 'eq', value: tag }] } });
    (r.contacts || []).forEach(function (c) { if (c.email) out.push(String(c.email).toLowerCase()); });
    if (!r.contacts || r.contacts.length < 500) break;
  }
  return out;
}

// directos: lista de fechas de directo. ventas: filas de la hoja (ya leídas). metaDia: [{dia, puerta, gasto}] diario.
async function porEdicion(directos, ventas, metaDia) {
  return N.enParalelo(directos, 3, async function (d) {
    const t = etiquetas(d);
    const [ads, org, grupo, sale, mails] = await Promise.all([total(t.ads), total(t.org), total(t.grupo), total(t.sale), Promise.all([emails(t.ads), emails(t.org)])]);
    const set = new Set(mails[0].concat(mails[1]));
    const desde = N.sumaDias(d, -12), hasta = N.sumaDias(d, -6);
    const vs = (ventas || []).filter(function (v) { return v.email && set.has(v.email) && v.dia >= desde; });
    const inversion = metaDia ? metaDia.filter(function (m) { return m.puerta === 'El Círculo' && m.dia >= desde && m.dia <= hasta; }).reduce(function (s, m) { return s + m.gasto; }, 0) : null;
    return {
      directo: d, conEtiquetas: ads + org + grupo > 0,
      ads: ads, org: org, registros: ads + org, grupo: grupo, sale: sale,
      compras: new Set(vs.map(function (v) { return v.email; })).size,
      facturacion: vs.reduce(function (s, v) { return s + (v.importe || 0); }, 0),
      cobrado: vs.reduce(function (s, v) { return s + (v.cobrado || 0); }, 0),
      inversion: inversion
    };
  });
}

module.exports = { porEdicion: porEdicion };
