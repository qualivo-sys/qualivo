// Intelligence de Nuria · Black Friday de A 11 Pasos del Sueño (noviembre 2026).
// Lista VIP (etiqueta de Kliking), personas en el grupo de Telegram (página pública de la invitación),
// estado y resultados de cada email del plan, y compras con la etiqueta de diciembre.
// Solo lectura y sin datos personales.

const N = require('./_nuria-semana.js');

const TAG_VIP = 'lista vip black friday 2026';
const TAG_COMPRA = 'cliente 11 pasos dic2026';
const TELEGRAM = 'https://t.me/+JtDEw4RKL-lhN2Fk';
const PLAN = [
  { n: 1, dia: '2026-11-16', nombre: 'VIP 1 · «Este Black Friday, primero tú»', a: 'Toda la base, sin El Círculo activo' },
  { n: 2, dia: '2026-11-19', nombre: 'VIP 2 · «¿Ya estás dentro?»', a: 'Toda la base, sin El Círculo activo' },
  { n: 3, dia: '2026-11-21', nombre: 'VIP 3 · «Mañana lo desvelo»', a: 'Toda la base, sin El Círculo activo' },
  { n: 4, dia: '2026-11-22', nombre: 'Oferta 4 · la propuesta, con regalo solo ese día', a: 'Solo la lista VIP' },
  { n: 5, dia: '2026-11-27', nombre: 'Oferta 5 · Black Friday', a: 'Toda la base, sin El Círculo activo' },
  { n: 6, dia: '2026-11-30', nombre: 'Oferta 6 · último día a 175 €', a: 'Toda la base, sin El Círculo activo' }
];

async function total(tag) {
  const r = await N.ghl('/contacts/search', { cuerpo: { locationId: process.env.NURIA_GHL_LOCATION_ID, pageLimit: 1, filters: [{ field: 'tags', operator: 'eq', value: tag }] } });
  return Number(r.total || 0);
}

async function telegram() {
  try {
    const r = await fetch(TELEGRAM, { headers: { 'User-Agent': 'Mozilla/5.0 (QualivoNuria)' } });
    const t = await r.text();
    const m = /tgme_page_extra">\s*([\d\s.,]+)\s*members?(?:,\s*([\d\s.,]+)\s*online)?/i.exec(t);
    if (!m) return null;
    const n = function (x) { return x ? Number(String(x).replace(/[^\d]/g, '')) : null; };
    return { miembros: n(m[1]), enLinea: n(m[2]) };
  } catch (e) { return null; }
}

function fechaDe(x) {
  const v = x.dateScheduled || x.scheduledAt || x.createdAt;
  const d = typeof v === 'number' || /^\d+$/.test(String(v)) ? new Date(Number(v)) : new Date(v);
  return isNaN(d) ? '' : new Date(d.getTime() + 3600000).toISOString().slice(0, 16).replace('T', ' ');
}

async function campanas() {
  const loc = process.env.NURIA_GHL_LOCATION_ID, out = [];
  for (let off = 0; off < 400; off += 100) {
    const d = await N.ghl('/emails/schedule?locationId=' + loc + '&limit=100&offset=' + off + '&showStats=true');
    const s = d.schedules || [];
    s.forEach(function (x) {
      if (x.deleted || !/black\s*friday/i.test(String(x.name || '') + ' ' + String(x.subject || ''))) return;
      out.push({
        nombre: String(x.name || ''), asunto: String(x.subject || ''), estado: String(x.status || ''), fecha: fechaDe(x),
        seleccionados: Number(x.totalCount || 0), entregados: Number(x.delivered || 0), abiertos: Number(x.opened || 0), clics: Number(x.clicked || 0)
      });
    });
    if (s.length < 100) break;
  }
  return out;
}

// Une cada email del plan con su campaña en Kliking (por el número «· N ·» o «VIP N» en el nombre).
function cruzar(lista) {
  return PLAN.map(function (p) {
    const tipo = p.n <= 3 ? /vip/i : /oferta|11 pasos/i, num = new RegExp('(·|#|n\\.?º?|email)\\s*' + p.n + '(\\s*·|\\b)', 'i');
    const cs = lista.filter(function (c) { return tipo.test(c.nombre) && num.test(c.nombre.replace(/20\d\d/g, '')); });
    const hecha = cs.find(function (c) { return c.estado === 'complete'; });
    const prog = cs.find(function (c) { return c.estado !== 'complete' && c.estado !== 'draft'; });
    const c = hecha || prog || null;
    return Object.assign({}, p, { estado: hecha ? 'enviado' : (prog ? 'programado' : (cs.length ? 'borrador' : 'sin programar')), campana: c });
  });
}

async function blackfriday() {
  const [vip, compras, tg, lista] = await Promise.all([total(TAG_VIP), total(TAG_COMPRA), telegram(), campanas().catch(function () { return null; })]);
  return { generado: Date.now(), vip: vip, compras: compras, telegram: tg, plan: lista ? cruzar(lista) : null };
}

module.exports = { blackfriday: blackfriday };
