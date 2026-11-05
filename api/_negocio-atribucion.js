// Panel de negocio · Paid: de la campaña a la RC (prioridad 1 de Growth para la v1.1).
//
// Cadena: lead de Meta (etiqueta meta-lead-{id} en GHL) → anuncio y campaña (Graph API, el lead de
// formulario sabe de qué anuncio vino) → cita → reunión celebrada → RC → coste por RC.
// Definiciones (iguales que api/senales-meta.js):
//   cita       · tiene cita en un calendario de GHL o el trato llegó a reunión (agendada, confirmada,
//                no presentado o más allá) o la etiqueta act-agendado / reunion-agendada
//   celebrada  · reunion-celebrada, cita marcada como «showed», o trato en Oferta en adelante
//   RC         · etiqueta RC con canal y fecha (recuento semanal) o «Qualified» de Meta
//                (reunion-encaja, o Oferta, Segunda reunión, Negociación, Piloto o Cliente)
// SOLO LECTURA. Nada de datos en el código: se lee con la sesión del panel.

const C = require('./_negocio-comun.js');
const G = require('./_negocio-ghl.js');

const GRAPH = process.env.NEGOCIO_GRAPH_BASE || 'https://graph.facebook.com/v21.0';
function token() { return process.env.META_ADS_TOKEN || process.env.META_LEADFORM_TOKEN || process.env.META_TOKEN || ''; }

// id de lead de formulario → anuncio y campaña (no cambia nunca: se guarda en memoria)
const origenLead = {};
async function origen(id) {
  if (origenLead[id]) return origenLead[id];
  const q = new URLSearchParams({ fields: 'ad_id,ad_name,campaign_id,campaign_name,created_time', access_token: token() });
  const d = await C.getJSON(GRAPH + '/' + encodeURIComponent(id) + '?' + q.toString(), { 'User-Agent': 'QualivoIntelligence/1.0' }, 15000);
  origenLead[id] = { anuncioId: d.ad_id || '', anuncio: d.ad_name || '(sin anuncio)', campanaId: d.campaign_id || '', campana: d.campaign_name || '(sin campaña)', dia: d.created_time ? C.diaMadrid(Date.parse(d.created_time)) : null };
  return origenLead[id];
}

async function gastoPor(nivel, per) {
  const q = new URLSearchParams({ level: nivel, fields: 'spend,' + (nivel === 'ad' ? 'ad_id' : 'campaign_id'), time_range: JSON.stringify({ since: per.desde, until: per.hasta }), limit: '500', access_token: token() });
  const out = {};
  let url = GRAPH + '/act_3453332464718877/insights?' + q.toString();
  for (let i = 0; i < 10 && url; i++) {
    const d = await C.getJSON(url, { 'User-Agent': 'QualivoIntelligence/1.0' }, 20000);
    (d.data || []).forEach(function (r) { out[nivel === 'ad' ? r.ad_id : r.campaign_id] = C.num(r.spend); });
    url = d.paging && d.paging.next;
  }
  return out;
}

async function embudoPaid(per, fresco) {
  return C.cacheado('atrib|' + per.desde + '|' + per.hasta, 10 * 60000, fresco, async function () {
    const ahora = Date.now();
    const [b, campos, ev, gCamp, gAd] = await Promise.all([
      G.base(fresco), G.camposRC().catch(function () { return {}; }),
      G.citas(Date.parse(per.desde + 'T00:00:00Z') - 86400000, ahora + 45 * 86400000, fresco).catch(function () { return []; }),
      gastoPor('campaign', per), gastoPor('ad', per)
    ]);
    const etapa = {};
    b.embudos.forEach(function (e) { e.etapas.forEach(function (s) { etapa[s.id] = s.nombre; }); });
    const opDe = G.oportunidadPorContacto(b.oportunidades, etapa);
    const citasDe = {};
    ev.forEach(function (e) { if (e.contacto && e.estado !== 'cancelled') (citasDe[e.contacto] = citasDe[e.contacto] || []).push(e); });

    const deMeta = [];
    b.contactos.forEach(function (c) {
      const tags = (c.tags || []).map(function (t) { return String(t).toLowerCase(); });
      const t = tags.filter(function (x) { return x.indexOf('meta-lead-') === 0; })[0];
      if (!t || tags.indexOf('demo') >= 0) return;
      deMeta.push({ c: c, tags: tags, leadId: t.slice(10) });
    });
    const avisos = [];
    const origenes = await C.enParalelo(deMeta, 6, function (x) { return origen(x.leadId); });
    const filas = [];
    deMeta.forEach(function (x, i) {
      const o = origenes[i];
      if (!o || o._error) { avisos.push('Lead ' + x.leadId + ' sin origen en Meta'); return; }
      const dia = o.dia || C.diaMadrid(G.fecha(x.c.dateAdded) || 0);
      if (dia < per.desde || dia > per.hasta) return;
      const op = opDe[x.c.id] || {};
      const n = String(op.etapa || '').toLowerCase();
      const tiene = function (tg) { return x.tags.indexOf(tg) >= 0; };
      const cs = citasDe[x.c.id] || [];
      const venta = /piloto|^cliente/.test(n) || op.estado === 'won' || tiene('cliente') || tiene('piloto');
      const encaja = venta || tiene('reunion-encaja') || /oferta|propuesta|segunda|negociaci/.test(n);
      const celebrada = encaja || tiene('reunion-celebrada') || cs.some(function (e) { return /showed/.test(e.estado); });
      const cita = celebrada || cs.length > 0 || tiene('act-agendado') || tiene('reunion-agendada') || /reuni|confirmad|no presentad|call agendada/.test(n);
      let rcEtiqueta = false;
      if (tiene('rc') && campos.canal && campos.fecha) rcEtiqueta = !!(G.valorCampo(x.c, campos.canal.id) && G.diaDe(G.valorCampo(x.c, campos.fecha.id)));
      filas.push({ campanaId: o.campanaId, campana: o.campana, anuncioId: o.anuncioId, anuncio: o.anuncio, nivelAB: tiene('nivel-a') || tiene('nivel-b'), cita: cita, celebrada: celebrada, rc: rcEtiqueta || encaja, rcEtiqueta: rcEtiqueta, cliente: venta });
    });
    const agrupar = function (clave, nombre, gasto) {
      const m = {};
      filas.forEach(function (f) {
        const k = f[clave] || f[nombre];
        const g = m[k] = m[k] || { id: k, nombre: f[nombre], campana: f.campana, leads: 0, ab: 0, citas: 0, celebradas: 0, rc: 0, clientes: 0 };
        g.leads++; if (f.nivelAB) g.ab++; if (f.cita) g.citas++; if (f.celebrada) g.celebradas++; if (f.rc) g.rc++; if (f.cliente) g.clientes++;
      });
      Object.keys(gasto).forEach(function (k) { if (gasto[k] > 0 && !m[k]) m[k] = { id: k, nombre: '(sin leads de formulario en GHL)', campana: '', leads: 0, ab: 0, citas: 0, celebradas: 0, rc: 0, clientes: 0 }; });
      return Object.keys(m).map(function (k) {
        const g = m[k]; g.gasto = gasto[k] || 0;
        g.costeLead = g.leads ? g.gasto / g.leads : null; g.costeCita = g.citas ? g.gasto / g.citas : null; g.costeRC = g.rc ? g.gasto / g.rc : null;
        return g;
      }).sort(function (a, b2) { return b2.gasto - a.gasto || b2.leads - a.leads; });
    };
    const porCampana = agrupar('campanaId', 'campana', gCamp);
    // Nombre de campaña de las que solo tienen gasto
    const total = filas.reduce(function (s, f) { s.leads++; if (f.cita) s.citas++; if (f.celebradas || f.celebrada) s.celebradas++; if (f.rc) s.rc++; if (f.cliente) s.clientes++; return s; }, { leads: 0, citas: 0, celebradas: 0, rc: 0, clientes: 0 });
    total.gasto = Object.keys(gCamp).reduce(function (s, k) { return s + gCamp[k]; }, 0);
    total.costeRC = total.rc ? total.gasto / total.rc : null;
    return { periodo: per, total: total, porCampana: porCampana, porAnuncio: agrupar('anuncioId', 'anuncio', gAd), avisos: avisos.slice(0, 5), generado: Date.now() };
  });
}

module.exports = { embudoPaid };
