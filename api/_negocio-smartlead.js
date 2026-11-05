// Panel de negocio · Outbound (Smartlead). SOLO LECTURA: todo es GET.
// Trampas conocidas (agente Outbound): User-Agent de navegador; un fallo no es un cero.
// Las campañas de clientes (DKR = Kill & Ramble, Kubysoft…) se marcan con su cliente y
// no suman en los totales de Qualivo.

const C = require('./_negocio-comun.js');

const BASE = process.env.NEGOCIO_SMARTLEAD_BASE || 'https://server.smartlead.ai/api/v1';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
const CLIENTES = [[/DKR|kill ?& ?ramble/i, 'Kill & Ramble'], [/Kubysoft/i, 'Kubysoft'], [/scubalight/i, 'Scubalight'], [/Mailerfind/i, 'Mailerfind'], [/Infoproducto/i, 'Infoproducto']];

function clave() { return process.env.SMARTLEAD_API_KEY || process.env.SMARTLEAD_KEY || process.env.smartlead_KEY || ''; }
async function sl(ruta, intento) {
  try {
    return await C.getJSON(BASE + ruta + (ruta.indexOf('?') > -1 ? '&' : '?') + 'api_key=' + encodeURIComponent(clave()), { 'User-Agent': UA, Accept: 'application/json' }, 20000);
  } catch (e) {
    if (e.status === 429 && !intento) { await new Promise(function (ok) { setTimeout(ok, 2500); }); return sl(ruta, 1); }
    throw new Error('Smartlead ' + ruta.split('?')[0].replace(/\/\d+/g, '/…') + ' → ' + String(e.message || e).slice(0, 60));
  }
}
function clienteDe(nombre) {
  for (const c of CLIENTES) if (c[0].test(nombre || '')) return c[1];
  return 'Qualivo';
}
const ESTADOS = { ACTIVE: 'Activa', PAUSED: 'Pausada', COMPLETED: 'Terminada', STOPPED: 'Parada', DRAFTED: 'Borrador', ARCHIVED: 'Archivada' };
// Smartlead da «28 Oct» sin año en el día a día: se reconstruye con el rango pedido.
function diaISO(txt, desde, hasta) {
  const m = /^(\d{1,2}) (\w{3})/.exec(String(txt || ''));
  if (!m) return null;
  const mes = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(m[2].toLowerCase());
  if (mes < 0) return null;
  for (const anio of [Number(hasta.slice(0, 4)), Number(desde.slice(0, 4))]) {
    const iso = anio + '-' + String(mes + 1).padStart(2, '0') + '-' + String(m[1]).padStart(2, '0');
    if (iso >= desde && iso <= hasta) return iso;
  }
  return null;
}

async function outbound(per, fresco) {
  if (!clave()) return { sinClave: true, aviso: 'Falta la clave de Smartlead en Vercel (SMARTLEAD_API_KEY o SMARTLEAD_KEY).' };
  return C.cacheado('sl|' + per.desde + '|' + per.hasta, 7 * 60000, fresco, async function () {
    const hoy = C.diaMadrid(Date.now());
    const desde30 = C.sumarDias(hoy, -29);
    const dDesde = per.desde < desde30 ? per.desde : desde30;
    const avisos = [];
    const [lista, porDia, enPeriodo] = await Promise.all([
      sl('/campaigns'),
      sl('/analytics/day-wise-overall-stats?start_date=' + dDesde + '&end_date=' + hoy).catch(function (e) { avisos.push(e.message); return null; }),
      sl('/analytics/campaign/overall-stats?start_date=' + per.desde + '&end_date=' + per.hasta).catch(function (e) { avisos.push(e.message); return null; })
    ]);
    const camps = (Array.isArray(lista) ? lista : (lista && lista.data) || []).filter(function (c) { return !/ARCHIVED|DRAFTED/i.test(c.status || ''); });
    // Totales desde el inicio de cada campaña (interesados de campaign_lead_stats)
    const relevantes = camps.filter(function (c) { return /ACTIVE|PAUSED|COMPLETED|STOPPED/i.test(c.status || ''); });
    const analit = await C.enParalelo(relevantes, 5, function (c) { return sl('/campaigns/' + c.id + '/analytics'); });
    const periodoPorId = {};
    (((enPeriodo || {}).data || {}).campaign_wise_performance || []).forEach(function (r) { periodoPorId[r.id] = r; });
    const filas = relevantes.map(function (c, i) {
      const a = analit[i] || {};
      if (a._error) return { id: c.id, campana: c.name, cliente: clienteDe(c.name), estado: ESTADOS[String(c.status).toUpperCase()] || c.status, error: a._error };
      const env = C.num(a.sent_count), resp = C.num(a.reply_count), reb = C.num(a.bounce_count);
      const int = C.num(a.campaign_lead_stats && a.campaign_lead_stats.interested);
      const p = periodoPorId[c.id] || {};
      return {
        id: c.id, campana: c.name, cliente: clienteDe(c.name), estado: ESTADOS[String(c.status).toUpperCase()] || c.status, creada: String(c.created_at || '').slice(0, 10),
        enviados: env, respuestas: resp, tasaRespuesta: env ? resp / env : null, interesados: int, otras: Math.max(0, resp - int), rebotes: reb, tasaRebote: env ? reb / env : null,
        leads: C.num(a.campaign_lead_stats && a.campaign_lead_stats.total),
        periodo: { enviados: C.num(p.sent), respuestas: C.num(p.replied), rebotes: C.num(p.bounced) }
      };
    }).filter(function (f) { return f.error || f.enviados > 0 || f.estado === 'Activa'; });
    analit.forEach(function (a, i) { if (a && a._error) avisos.push('«' + relevantes[i].name + '»: ' + a._error); });
    const dias = ((((porDia || {}).data || {}).day_wise_stats) || []).map(function (d) {
      const m = d.email_engagement_metrics || {};
      return { dia: diaISO(d.date, dDesde, hoy), enviados: C.num(m.sent), respuestas: C.num(m.replied), rebotes: C.num(m.bounced), abiertos: C.num(m.opened) };
    }).filter(function (d) { return d.dia; });
    const deQualivo = filas.filter(function (f) { return f.cliente === 'Qualivo' && !f.error; });
    const sumaP = function (k) { return deQualivo.reduce(function (s, f) { return s + f.periodo[k]; }, 0); };
    const sumaD = function (arr, k) { return arr.reduce(function (s, d) { return s + d[k]; }, 0); };
    const d7 = dias.filter(function (d) { return d.dia >= C.sumarDias(hoy, -6); });
    return {
      periodo: per,
      kpis: {
        activas: filas.filter(function (f) { return f.estado === 'Activa' && f.cliente === 'Qualivo'; }).length,
        enviadosHoy: sumaD(dias.filter(function (d) { return d.dia === hoy; }), 'enviados'),
        enviados7: sumaD(d7, 'enviados'),
        enviadosPeriodo: sumaP('enviados'), respuestasPeriodo: sumaP('respuestas'), rebotesPeriodo: sumaP('rebotes'),
        interesados: deQualivo.reduce(function (s, f) { return s + f.interesados; }, 0)
      },
      dias: dias.filter(function (d) { return d.dia >= per.desde || d.dia >= desde30; }),
      campanas: filas.sort(function (a, b) { return (b.enviados || 0) - (a.enviados || 0); }),
      avisos: avisos,
      generado: Date.now()
    };
  });
}

module.exports = { outbound };
