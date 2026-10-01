// Experimento del primer WhatsApp (Bloque 1): embudo por lead y por segmento.
// Solo lee del CRM. Uso: node herramientas/kpi-wa1.js [desde AAAA-MM-DD]
// Embudo: WA1 → respuesta → conversación (2+ mensajes suyos) → agenda → show →
// oportunidad (oferta o segunda reunión) → venta (piloto o cliente) e ingresos.
// Segmentos: vertical × variante × ángulo, y modo de salida y contexto horario.
'use strict';
const A = require('../api/_activacion.js');
const T = require('../api/_tratos.js');
const H = require('../api/_horario.js');
const desde = Date.parse((process.argv[2] || '2026-10-01') + 'T00:00:00Z');
const tag = function (c, p) { return ((c.tags || []).find(function (t) { return t.indexOf(p) === 0; }) || '').slice(p.length); };
const sello = function (c, p) { const t = (c.tags || []).find(function (x) { return x.indexOf(p) === 0 && /\d{12}$/.test(x); }); return t ? H.msDeSello(t) : null; };
(async function () {
  const leads = (await A.buscarPorEtiqueta('paid', 1000)).filter(function (c) { return Date.parse(c.dateAdded) >= desde && (c.tags || []).indexOf('act-wa1') > -1; });
  const tratos = {};
  for (let p = 1; p <= 5; p++) {
    const r = await fetch(A.GHL_BASE + '/opportunities/search?location_id=' + process.env.GHL_LOCATION_ID + '&pipeline_id=' + T.PIPELINE + '&limit=100&page=' + p, { headers: A.cabeceras() });
    const l = ((await r.json()).opportunities || []); l.forEach(function (o) { tratos[o.contactId] = o; }); if (l.length < 100) break;
  }
  const etapa = Object.fromEntries(Object.entries(T.ETAPAS).map(function (e) { return [e[1], e[0]]; }));
  const filas = [];
  for (const c of leads) {
    const ms = await A.mensajesDe(c.id);
    const wa1 = sello(c, 'act-wa1-h-');
    const suyos = ms.filter(function (m) { return m.direction === 'inbound' && !/ACTIVITY/.test(m.messageType || '') && (!wa1 || Date.parse(m.dateAdded) >= wa1); });
    const o = tratos[c.id] || {}; const e = etapa[o.pipelineStageId] || (String(o.pipelineStageId || '').indexOf('b853294d') === 0 ? 'segunda' : '');
    const t = function (x) { return (c.tags || []).indexOf(x) > -1; };
    filas.push({
      vertical: tag(c, 'sector-').split('-')[0] || '?', variante: tag(c, 'wa1-v-') || 'largo', angulo: tag(c, 'angulo-') || '-', modo: tag(c, 'act-wa1-modo-') || '?', ctx: tag(c, 'wa1-ctx-') || '?',
      stl: wa1 && sello(c, 'act-ini-') ? Math.round((wa1 - sello(c, 'act-ini-')) / 60000) : null,
      respuesta: suyos.length > 0, conversacion: suyos.length >= 2, agenda: t('act-agendado') || t('act-cita-confirmada'), show: t('reunion-celebrada'),
      oportunidad: ['oferta', 'seguimiento', 'segunda', 'piloto', 'cliente'].indexOf(e) > -1 || t('propuesta-enviada') || t('segunda-reunion'),
      venta: e === 'piloto' || e === 'cliente' || o.status === 'won', ingresos: (o.status === 'won' || e === 'piloto' || e === 'cliente') ? (o.monetaryValue || 0) : 0
    });
  }
  const agrupar = function (clave) {
    const g = {};
    filas.forEach(function (f) { const k = clave(f); const x = g[k] = g[k] || { leads: 0, respuesta: 0, conversacion: 0, agenda: 0, show: 0, oportunidad: 0, venta: 0, ingresos: 0, stl: [] };
      x.leads++; ['respuesta', 'conversacion', 'agenda', 'show', 'oportunidad', 'venta'].forEach(function (m) { if (f[m]) x[m]++; }); x.ingresos += f.ingresos; if (f.stl != null) x.stl.push(f.stl); });
    Object.keys(g).sort().forEach(function (k) { const x = g[k]; const med = x.stl.sort(function (a, b) { return a - b; })[Math.floor(x.stl.length / 2)];
      console.log(k.padEnd(34), 'leads', String(x.leads).padStart(3), '| resp', x.respuesta, '| conv', x.conversacion, '| agenda', x.agenda, '| show', x.show, '| oport', x.oportunidad, '| venta', x.venta, '| €/lead', x.leads ? Math.round(x.ingresos / x.leads) : 0, '| STL mediana', med == null ? '-' : med + ' min'); });
  };
  console.log('Leads con primer WhatsApp desde ' + new Date(desde).toISOString().slice(0, 10) + ': ' + filas.length + '\n');
  console.log('· Por variante'); agrupar(function (f) { return f.variante; });
  console.log('\n· Por vertical × variante'); agrupar(function (f) { return f.vertical + ' · ' + f.variante; });
  console.log('\n· Por vertical × variante × ángulo'); agrupar(function (f) { return f.vertical + ' · ' + f.variante + ' · ' + f.angulo; });
  console.log('\n· Por modo de salida'); agrupar(function (f) { return f.modo; });
  console.log('\n· Por contexto horario'); agrupar(function (f) { return f.ctx; });
  console.log('\nNo se declara ganador por la respuesta: manda el embudo hasta show, oportunidad y venta (€/lead).');
})().catch(function (e) { console.error(e); process.exit(1); });
