// Panel de negocio · Meta: la cuenta publicitaria de Qualivo, las de los clientes e Instagram.
// SOLO LECTURA (GET a la Graph API). El token sale de las variables de entorno.

const C = require('./_negocio-comun.js');

const GRAPH = process.env.NEGOCIO_GRAPH_BASE || 'https://graph.facebook.com/v21.0';
const CUENTA_QUALIVO = 'act_3453332464718877';

function token() { return process.env.META_ADS_TOKEN || process.env.META_LEADFORM_TOKEN || process.env.META_TOKEN || ''; }
function graph(ruta, params) {
  const q = new URLSearchParams(Object.assign({ access_token: token() }, params || {}));
  return C.getJSON(GRAPH + ruta + '?' + q.toString(), { 'User-Agent': 'QualivoIntelligence/1.0' }, 20000);
}
// Todas las páginas de un listado de la Graph API
async function todas(ruta, params, max) {
  const out = [];
  let d = await graph(ruta, params);
  for (let i = 0; i < (max || 20); i++) {
    out.push.apply(out, d.data || []);
    const sig = d.paging && d.paging.next;
    if (!sig) break;
    d = await C.getJSON(sig, { 'User-Agent': 'QualivoIntelligence/1.0' }, 20000);
  }
  return out;
}

// Leads de Meta: misma regla que el resto de Qualivo (api/informe-paid.js).
function leadsDe(acciones) {
  const a = {};
  (acciones || []).forEach(function (x) { a[x.action_type] = C.num(x.value); });
  return a.lead || a['onsite_conversion.lead_grouped'] || 0;
}
function fila(r) {
  const gasto = C.num(r.spend), imp = C.num(r.impressions), clics = C.num(r.clicks), leads = leadsDe(r.actions);
  return { gasto: gasto, impresiones: imp, clics: clics, leads: leads };
}
function metricas(f) {
  return Object.assign(f, {
    ctr: f.impresiones ? f.clics / f.impresiones * 100 : null,
    cpm: f.impresiones ? f.gasto / f.impresiones * 1000 : null,
    cpl: f.leads ? f.gasto / f.leads : null
  });
}
function suma(filas) {
  return filas.reduce(function (s, f) { s.gasto += f.gasto; s.impresiones += f.impresiones; s.clics += f.clics; s.leads += f.leads; return s; }, { gasto: 0, impresiones: 0, clics: 0, leads: 0 });
}
const CAMPOS = 'spend,impressions,clicks,actions';

// Serie diaria de una cuenta entre dos fechas
async function diario(cuenta, desde, hasta) {
  const filas = await todas('/' + cuenta + '/insights', { fields: CAMPOS, time_range: JSON.stringify({ since: desde, until: hasta }), time_increment: 1, limit: 500 });
  return filas.map(function (r) { return Object.assign({ dia: r.date_start }, fila(r)); });
}

// Paid de Qualivo: meses, semanas, días, totales del periodo y anuncios del periodo.
async function paid(per, fresco) {
  return C.cacheado('paid|' + per.desde + '|' + per.hasta, 5 * 60000, fresco, async function () {
    const hoy = C.diaMadrid(Date.now());
    const desdeSerie = C.inicioMes(C.mesAnterior(C.mesAnterior(C.mesAnterior(C.mesAnterior(C.mesAnterior(hoy)))))); // 6 meses
    const [dias, anuncios, estados] = await Promise.all([
      diario(CUENTA_QUALIVO, desdeSerie < per.desde ? desdeSerie : per.desde, hoy),
      todas('/' + CUENTA_QUALIVO + '/insights', { level: 'ad', fields: CAMPOS + ',ad_id,ad_name,campaign_name,adset_name', time_range: JSON.stringify({ since: per.desde, until: per.hasta }), limit: 500 }),
      todas('/' + CUENTA_QUALIVO + '/ads', { fields: 'id,effective_status', limit: 500 }, 10).catch(function () { return []; })
    ]);
    const porMes = {}, porSemana = {};
    dias.forEach(function (d) {
      const m = d.dia.slice(0, 7), s = C.lunesDe(d.dia);
      (porMes[m] = porMes[m] || []).push(d);
      (porSemana[s] = porSemana[s] || []).push(d);
    });
    const meses = Object.keys(porMes).sort().map(function (m) { return metricas(Object.assign({ mes: m }, suma(porMes[m]))); });
    const semanas = Object.keys(porSemana).sort().slice(-12).map(function (s) { return metricas(Object.assign({ semana: s }, suma(porSemana[s]))); });
    const enPeriodo = dias.filter(function (d) { return d.dia >= per.desde && d.dia <= per.hasta; });
    const diasPeriodo = enPeriodo.length > 1 ? enPeriodo : dias.slice(-15);
    const est = {};
    estados.forEach(function (a) { est[a.id] = a.effective_status; });
    const ads = anuncios.map(function (r) {
      return metricas(Object.assign({ id: r.ad_id, anuncio: r.ad_name, campana: r.campaign_name, conjunto: r.adset_name, estado: estadoTxt(est[r.ad_id]) }, fila(r)));
    }).filter(function (a) { return a.gasto > 0 || a.leads > 0; }).sort(function (a, b) { return b.gasto - a.gasto; });
    return {
      periodo: per,
      total: metricas(suma(enPeriodo)),
      meses: meses,
      semanas: semanas,
      dias: diasPeriodo.map(metricas),
      anuncios: ads,
      generado: Date.now()
    };
  });
}

function estadoTxt(s) {
  return ({ ACTIVE: 'Activo', PAUSED: 'Pausado', CAMPAIGN_PAUSED: 'Campaña en pausa', ADSET_PAUSED: 'Conjunto en pausa', DISAPPROVED: 'Rechazado', WITH_ISSUES: 'Con problemas', PENDING_REVIEW: 'En revisión', ARCHIVED: 'Archivado', DELETED: 'Borrado' })[s] || (s ? String(s).toLowerCase() : '—');
}

// Gasto de Meta de Qualivo en un mes (para Finanzas)
async function gastoMes(iso, fresco) {
  return C.cacheado('gastoMes|' + iso.slice(0, 7), 10 * 60000, fresco, async function () {
    const hasta = iso.slice(0, 7) === C.diaMadrid(Date.now()).slice(0, 7) ? C.diaMadrid(Date.now()) : C.finMes(iso);
    const r = await graph('/' + CUENTA_QUALIVO + '/insights', { fields: 'spend', time_range: JSON.stringify({ since: C.inicioMes(iso), until: hasta }) });
    return C.num(((r.data || [])[0] || {}).spend);
  });
}

// Cuentas publicitarias de clientes: últimos 7 días y mes en curso.
// «cuentas»: lista de { cliente, ids:[act_…] } (de los datos manuales). Si viene vacía, se
// enseñan todas las cuentas accesibles con gasto en los últimos 7 días, salvo la de Qualivo.
async function clientes(cuentas, fresco) {
  const clave = 'clientes|' + JSON.stringify(cuentas || []);
  return C.cacheado(clave, 10 * 60000, fresco, async function () {
    const hoy = C.diaMadrid(Date.now());
    const r7 = { since: C.sumarDias(hoy, -6), until: hoy };
    const rMes = { since: C.inicioMes(hoy), until: hoy };
    let lista = (cuentas || []).filter(function (c) { return c.ids && c.ids.length; });
    let automatica = false;
    if (!lista.length) {
      automatica = true;
      const todasCuentas = await todas('/me/adaccounts', { fields: 'name,account_id,account_status', limit: 100 }, 5);
      lista = todasCuentas.filter(function (a) { return 'act_' + a.account_id !== CUENTA_QUALIVO && a.account_status === 1; })
        .map(function (a) { return { cliente: a.name, ids: ['act_' + a.account_id] }; });
    }
    const filas = await C.enParalelo(lista, 4, async function (c) {
      const res = await Promise.all(c.ids.map(async function (id) {
        const [a, b] = await Promise.all([
          graph('/' + id + '/insights', { fields: CAMPOS, time_range: JSON.stringify(r7) }),
          graph('/' + id + '/insights', { fields: 'spend', time_range: JSON.stringify(rMes) })
        ]);
        return { s7: fila((a.data || [])[0] || {}), mes: C.num(((b.data || [])[0] || {}).spend) };
      }));
      const s7 = metricas(suma(res.map(function (x) { return x.s7; })));
      return { cliente: c.cliente, cuentas: c.ids.length, gasto7: s7.gasto, leads7: s7.leads, cpl7: s7.cpl, ctr7: s7.ctr, gastoMes: res.reduce(function (s, x) { return s + x.mes; }, 0) };
    });
    let out = filas.map(function (f, i) { return f && f._error ? { cliente: lista[i].cliente, error: f._error } : f; });
    if (automatica) out = out.filter(function (f) { return f.error || f.gasto7 > 0 || f.gastoMes > 0; });
    return { automatica: automatica, filas: out, generado: Date.now() };
  });
}

// Instagram: cuentas accesibles con el token y las últimas publicaciones de la elegida.
async function instagram(cuentaId, fresco) {
  return C.cacheado('ig|' + (cuentaId || ''), 15 * 60000, fresco, async function () {
    const paginas = await todas('/me/accounts', { fields: 'name,instagram_business_account{id,username,followers_count,media_count}', limit: 100 }, 5);
    const cuentas = paginas.filter(function (p) { return p.instagram_business_account; }).map(function (p) {
      const ig = p.instagram_business_account;
      return { id: ig.id, usuario: ig.username, seguidores: C.num(ig.followers_count), publicaciones: C.num(ig.media_count), pagina: p.name };
    });
    const preferida = process.env.NEGOCIO_IG_CUENTA || '';
    const elegida = cuentas.filter(function (c) { return c.id === cuentaId; })[0] ||
      cuentas.filter(function (c) { return preferida && (c.id === preferida || c.usuario === preferida); })[0] ||
      cuentas.filter(function (c) { return /qualivo/i.test(c.usuario + ' ' + c.pagina); })[0] ||
      cuentas.filter(function (c) { return /maikel/i.test(c.usuario + ' ' + c.pagina); })[0] || cuentas[0];
    if (!elegida) return { cuentas: [], elegida: null, posts: [], generado: Date.now() };
    const media = await graph('/' + elegida.id + '/media', { fields: 'id,caption,media_type,media_product_type,timestamp,like_count,comments_count,permalink', limit: 30 });
    const posts = await C.enParalelo(media.data || [], 5, async function (m) {
      const met = m.media_product_type === 'REELS' ? 'reach,saved,shares,views' : 'reach,saved,shares';
      let ins = {};
      try {
        const r = await graph('/' + m.id + '/insights', { metric: met });
        (r.data || []).forEach(function (x) { ins[x.name] = C.num((x.values && x.values[0] && x.values[0].value) || x.total_value && x.total_value.value); });
      } catch (e) { ins = { error: true }; }
      return {
        id: m.id, fecha: String(m.timestamp || '').slice(0, 10), tipo: m.media_product_type === 'REELS' ? 'Reel' : m.media_type === 'CAROUSEL_ALBUM' ? 'Carrusel' : m.media_type === 'VIDEO' ? 'Vídeo' : 'Imagen',
        texto: String(m.caption || '').replace(/\s+/g, ' ').slice(0, 140), enlace: m.permalink,
        megusta: C.num(m.like_count), comentarios: C.num(m.comments_count), alcance: ins.reach == null ? null : ins.reach, guardados: ins.saved == null ? null : ins.saved, compartidos: ins.shares == null ? null : ins.shares, vistas: ins.views == null ? null : ins.views
      };
    });
    return { cuentas: cuentas, elegida: elegida, posts: posts.filter(function (p) { return p && !p._error; }), generado: Date.now() };
  });
}

module.exports = { paid, gastoMes, clientes, instagram, CUENTA_QUALIVO };
