// Outbound (encargo de Growth del 20-oct por orden de Maikel): lo que hace el SDR en Smartlead,
// dentro de Qualivo Intelligence en modo real. SOLO LECTURA: todas las llamadas son GET; no
// envía, no pausa, no carga leads ni toca campañas.
//
// Trampas de Smartlead que se respetan (las conoce el agente Outbound):
// - User-Agent de navegador.
// - Un 401/403 o una lista vacía por fallo NO es un cero: se devuelve «sin datos» con el error.
// - Los leads cargados (depósito) se cuentan recorriendo /leads con status STARTED:
//   campaign_lead_stats.notStarted siempre devuelve 0.
// - Las campañas de clientes (DKR, Kubysoft…) se marcan como [cliente] y no suman en los totales
//   de Qualivo (misma lista que api/_supresion.js).
// La clave está en Vercel (SMARTLEAD_API_KEY; también vale smartlead_KEY). Nada de datos de leads
// en el repositorio: todo llega por la API autenticada de intelligence-datos.

const BASE = process.env.INTELLIGENCE_SMARTLEAD_BASE || 'https://server.smartlead.ai/api/v1';
const AJENAS = /DKR|scubalight|Kubysoft|Infoproducto|Mailerfind/i;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';
const ZONA = 'Europe/Madrid';
const CATEGORIA = { 1: 'Interesado', 2: 'Pide reunión', 3: 'No le interesa', 4: 'No contactar', 5: 'Pide información', 6: 'Fuera de la oficina', 7: 'Persona equivocada', 9: 'Rebote' };

function clave() { return process.env.SMARTLEAD_API_KEY || process.env.smartlead_KEY || process.env.SMARTLEAD_KEY || ''; }

async function sl(ruta, intento) {
  const ctl = new AbortController();
  const t = setTimeout(function () { ctl.abort(); }, 15000);
  try {
    const r = await fetch(BASE + ruta + (ruta.indexOf('?') > -1 ? '&' : '?') + 'api_key=' + encodeURIComponent(clave()), {
      method: 'GET', signal: ctl.signal, headers: { 'User-Agent': UA, Accept: 'application/json' }
    });
    if (r.status === 429 && !intento) { await new Promise(function (ok) { setTimeout(ok, 2500); }); return sl(ruta, 1); }
    if (!r.ok) throw new Error('Smartlead ' + ruta.split('?')[0].replace(/\/\d+/g, '/…') + ' → ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

function diaMadrid(t) { return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t)); }
function num(x) { const n = Number(x); return isFinite(n) ? n : 0; }
function ms(x) { const t = x ? Date.parse(x) : NaN; return isNaN(t) ? null : t; }

async function enParalelo(items, n, fn, hasta) {
  const out = new Array(items.length);
  let i = 0;
  async function obrero() {
    while (i < items.length) {
      const k = i++;
      if (Date.now() > hasta) { out[k] = { error: 'sin tiempo' }; continue; }
      try { out[k] = await fn(items[k]); } catch (e) { out[k] = { error: String(e.message || e) }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, obrero));
  return out;
}

// Todas las páginas de un listado con offset/limit
async function paginas(ruta, clave, hasta) {
  const todo = [];
  for (let off = 0; off < 5000 && Date.now() < hasta; off += 100) {
    const d = await sl(ruta + (ruta.indexOf('?') > -1 ? '&' : '?') + 'offset=' + off + '&limit=100');
    const lote = (d && d[clave]) || [];
    todo.push.apply(todo, lote);
    if (lote.length < 100) return { filas: todo, completo: true };
  }
  return { filas: todo, completo: false };
}

// La señal y la puntuación viven en los custom fields del lead (o en subject1/body1).
function campoDe(cf, re) {
  const k = Object.keys(cf || {}).filter(function (x) { return re.test(x) && String(cf[x] || '').trim(); })[0];
  return k ? String(cf[k]).trim() : '';
}

async function campana(c, hoy, hace7, hasta) {
  const id = c.id;
  const out = { id: id, nombre: c.name, estado: String(c.status || '').toUpperCase(), cliente: AJENAS.test(c.name || ''), creada: c.created_at, errores: [] };
  const prot = async function (nombre, fn) { try { return await fn(); } catch (e) { out.errores.push(nombre + ': ' + String(e.message || e).slice(0, 90)); return null; } };
  const [hoyD, semD, buzones, leads, stats] = await Promise.all([
    prot('envíos de hoy', function () { return sl('/campaigns/' + id + '/analytics-by-date?start_date=' + hoy + '&end_date=' + hoy); }),
    prot('envíos de 7 días', function () { return sl('/campaigns/' + id + '/analytics-by-date?start_date=' + hace7 + '&end_date=' + hoy); }),
    prot('buzones', function () { return sl('/campaigns/' + id + '/email-accounts'); }),
    prot('leads', function () { return paginas('/campaigns/' + id + '/leads', 'data', hasta); }),
    prot('estadísticas', function () { return paginas('/campaigns/' + id + '/statistics', 'data', hasta); })
  ]);
  out.hoy = hoyD ? { enviados: num(hoyD.sent_count), respuestas: num(hoyD.reply_count), rebotes: num(hoyD.bounce_count) } : null;
  out.semana = semD ? { enviados: num(semD.sent_count), abiertos: num(semD.unique_open_count || semD.open_count), respuestas: num(semD.reply_count), rebotes: num(semD.bounce_count) } : null;
  out.buzones = Array.isArray(buzones) ? buzones.length : null;
  // Leads: estado y categoría
  const porEmail = {};
  if (leads) {
    out.leadsCompleto = leads.completo;
    const n = function (st) { return leads.filas.filter(function (x) { return String(x.status || '').toUpperCase() === st; }).length; };
    out.leads = { total: leads.filas.length, cargados: n('STARTED'), enCurso: n('INPROGRESS'), terminados: n('COMPLETED'), pausados: n('PAUSED'), parados: n('STOPPED') };
    out.reuniones = leads.filas.filter(function (x) { return num(x.lead_category_id) === 2; }).length;
    leads.filas.forEach(function (x) {
      const l = x.lead || {};
      const cf = l.custom_fields || {};
      const em = String(l.email || '').toLowerCase();
      if (!em) return;
      porEmail[em] = {
        campana: id, lead: l.id, estado: String(x.status || '').toUpperCase(), categoria: CATEGORIA[num(x.lead_category_id)] || '',
        empresa: l.company_name || campoDe(cf, /empresa|company/i), persona: [l.first_name, l.last_name].filter(Boolean).join(' '),
        cargo: campoDe(cf, /cargo|title|puesto|role|position/i), web: l.website || l.company_url || '',
        senal: campoDe(cf, /se[ñn]al|signal|trigger|motivo|gancho|hook/i) || campoDe(cf, /^subject1$|asunto/i),
        puntuacion: campoDe(cf, /score|puntu|nivel|fit|tier|prior/i),
        alta: ms(x.created_at), paso: 0, ultimoEnvio: null, abrio: false, respondio: null, reboto: false
      };
    });
  }
  // Estadísticas por correo enviado → paso, último envío, apertura, respuesta, rebote
  if (stats) {
    stats.filas.forEach(function (s) {
      const em = String(s.lead_email || '').toLowerCase();
      const a = porEmail[em];
      if (!a) return;
      const env = ms(s.sent_time);
      a.paso = Math.max(a.paso, num(s.sequence_number));
      if (env && (!a.ultimoEnvio || env > a.ultimoEnvio)) a.ultimoEnvio = env;
      if (s.open_time || num(s.open_count) > 0) a.abrio = true;
      const rp = ms(s.reply_time);
      if (rp && (!a.respondio || rp > a.respondio)) a.respondio = rp;
      if (s.is_bounced) a.reboto = true;
    });
  }
  out.cuentas = Object.keys(porEmail).map(function (em) { return Object.assign({ email: em }, porEmail[em]); });
  out.respuestasTotal = out.cuentas.filter(function (x) { return x.respondio; }).length;
  out.rebotesTotal = out.cuentas.filter(function (x) { return x.reboto; }).length;
  return out;
}

// Respuestas pendientes: respondió y no le hemos vuelto a escribir después.
async function pendientes(cuentas, hasta) {
  const resp = cuentas.filter(function (x) { return x.respondio && x.categoria !== 'No le interesa' && x.categoria !== 'No contactar' && x.categoria !== 'Rebote'; })
    .sort(function (a, b) { return b.respondio - a.respondio; }).slice(0, 25);
  const hist = await enParalelo(resp, 4, function (a) { return sl('/campaigns/' + a.campana + '/leads/' + a.lead + '/message-history'); }, hasta);
  const out = [];
  resp.forEach(function (a, i) {
    const h = hist[i];
    const lista = (h && (h.history || h.data)) || null;
    if (!lista) { out.push({ email: a.email, campana: a.campana, lead: a.lead, cuando: a.respondio, texto: '', sinHistorial: (h && h.error) || 'sin historial' }); return; }
    const resps = lista.filter(function (m) { return /REPLY/i.test(m.type || ''); });
    const ult = resps[resps.length - 1];
    if (!ult) return;
    const tR = ms(ult.time);
    const nuestro = lista.some(function (m) { return /SENT/i.test(m.type || '') && ms(m.time) > tR; });
    if (nuestro) return; // ya contestada
    out.push({ email: a.email, campana: a.campana, lead: a.lead, cuando: tR || a.respondio, texto: textoPlano(ult.email_body).slice(0, 600), asunto: ult.subject || '' });
  });
  return out;
}

function textoPlano(html) {
  return String(html || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    // fuera el texto citado de nuestro correo
    .split(/\nOn .{5,80} wrote:|\nEl .{5,80} escribió:/)[0].replace(/\n{3,}/g, '\n\n').trim();
}

async function datos() {
  if (!clave()) return { sinClave: true, campanas: [], cuentas: [], pendientes: [], avisos: ['Falta la clave de Smartlead en Vercel (SMARTLEAD_API_KEY).'] };
  const ahora = Date.now(), hasta = ahora + 48000;
  const avisos = [];
  let lista;
  try { lista = await sl('/campaigns'); } catch (e) { return { error: String(e.message || e), campanas: [], cuentas: [], pendientes: [], avisos: ['No se ha podido leer Smartlead: ' + String(e.message || e)] }; }
  lista = Array.isArray(lista) ? lista : (lista && lista.data) || [];
  // Las archivadas o en borrador sin actividad no interesan aquí
  const vivas = lista.filter(function (c) { return !/ARCHIVED|DRAFTED/i.test(c.status || ''); });
  const hoy = diaMadrid(ahora), hace7 = diaMadrid(ahora - 6 * 86400000);
  const camps = await enParalelo(vivas, 3, function (c) { return campana(c, hoy, hace7, hasta); }, hasta - 6000);
  camps.forEach(function (c, i) { if (c && c.error) camps[i] = { id: vivas[i].id, nombre: vivas[i].name, estado: String(vivas[i].status || ''), cliente: AJENAS.test(vivas[i].name || ''), errores: [c.error] }; });
  const cuentas = [];
  camps.forEach(function (c) { (c.cuentas || []).forEach(function (a) { a.campanaNombre = c.nombre; a.cliente = c.cliente; cuentas.push(a); }); delete c.cuentas; });
  camps.forEach(function (c) { if (c.errores && c.errores.length) avisos.push('«' + c.nombre + '»: ' + c.errores.join(' · ')); });
  const pend = await pendientes(cuentas.filter(function (a) { return !a.cliente; }), hasta);
  return { generado: ahora, hoy: hoy, desde7: hace7, campanas: camps, cuentas: cuentas, pendientes: pend, avisos: avisos, borradores: null };
}

// Ficha: la secuencia de la campaña y los mensajes de ese lead
async function ficha(campanaId, leadId) {
  if (!/^\d+$/.test(String(campanaId)) || !/^\d+$/.test(String(leadId))) throw new Error('Ids no válidos.');
  const [seq, hist] = await Promise.all([
    sl('/campaigns/' + campanaId + '/sequences').catch(function (e) { return { error: e.message }; }),
    sl('/campaigns/' + campanaId + '/leads/' + leadId + '/message-history').catch(function (e) { return { error: e.message }; })
  ]);
  const pasos = Array.isArray(seq) ? seq.map(function (s) {
    const v = (s.sequence_variants && s.sequence_variants[0]) || s;
    return { n: s.seq_number, espera: (s.seq_delay_details && s.seq_delay_details.delay_in_days) || 0, asunto: v.subject || s.subject || '', cuerpo: textoPlano(v.email_body || s.email_body).slice(0, 1500) };
  }) : null;
  const lista = (hist && (hist.history || hist.data)) || null;
  return {
    pasos: pasos, errorPasos: pasos ? '' : (seq && seq.error) || 'sin secuencia',
    mensajes: lista ? lista.map(function (m) { return { tipo: /REPLY/i.test(m.type || '') ? 'respuesta' : 'enviado', t: ms(m.time), asunto: m.subject || '', texto: textoPlano(m.email_body).slice(0, 2000) }; }) : null,
    errorMensajes: lista ? '' : (hist && hist.error) || 'sin historial'
  };
}

module.exports = { datos: datos, ficha: ficha, textoPlano: textoPlano, AJENAS: AJENAS };
