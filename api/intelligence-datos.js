// Modo real de Qualivo Intelligence: los datos de verdad de Qualivo (GHL y
// Meta) con el mismo motor y las mismas pantallas del sector «qualivo».
//
//   POST /api/intelligence-datos/?accion=entrar   { clave }  → cookie de sesión
//   POST /api/intelligence-datos/?accion=salir               → borra la cookie
//   GET  /api/intelligence-datos/                            → datos (401 sin sesión)
//
// Reglas (Maikel, 25-sep):
//   - SOLO LECTURA. Toda llamada a GHL y a Meta sale por leer(), que solo hace
//     GET. Aquí no hay ni un POST, PUT ni DELETE hacia GHL, Vapi, WhatsApp o Meta.
//     Ni siquiera /contacts/search (que es POST aunque solo lea): se lista con GET.
//   - Nada de datos en el código: todo se lee en el momento y se guarda como
//     mucho 5 minutos en memoria de la instancia.
//   - Sin sesión, 401. Siempre Cache-Control: no-store.
//   - Al navegador no se mandan correos ni teléfonos: solo si los hay.

const S = require('./_intel-sesion.js');

const GHL = process.env.INTELLIGENCE_GHL_BASE || 'https://services.leadconnectorhq.com';
const GRAPH = process.env.INTELLIGENCE_GRAPH_BASE || 'https://graph.facebook.com/v21.0';
const CUENTA_META = 'act_3453332464718877';
const EMBUDOS = ['JaB4LIwUqFn96LLFEhSm', '980j4DzvOwp7aDmkk2ZA']; // Prospección y Qualivo Pipeline (api/_tratos.js)
const ZONA = 'Europe/Madrid';
const DIAS = 30;
const CACHE_MS = 5 * 60000;
const PLAZO_MS = 40000;

let cache = null; // { t, datos }
let enCurso = null;

// ---------------------------------------------------------------------------
// Lectura: todo es GET, salvo mover un trato de etapa desde el tablero (acción «mover»).
// ---------------------------------------------------------------------------
function cabGHL() {
  return {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: '2021-07-28',
    Accept: 'application/json',
    // Sin User-Agent, GHL a veces devuelve 403.
    'User-Agent': 'QualivoIntelligence/1.0 (+https://qualivo.io)'
  };
}
async function leer(url, cabeceras) {
  const ctl = new AbortController();
  const t = setTimeout(function () { ctl.abort(); }, 12000);
  try {
    const r = await fetch(url, { method: 'GET', headers: cabeceras || {}, signal: ctl.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}
function ghl(ruta) { return leer(GHL + ruta, cabGHL()); }
function meta(ruta, params) {
  const q = new URLSearchParams(Object.assign({ access_token: process.env.META_ADS_TOKEN || process.env.META_LEADFORM_TOKEN || '' }, params));
  return leer(GRAPH + ruta + '?' + q.toString(), { 'User-Agent': 'QualivoIntelligence/1.0' });
}

// n tareas a la vez, sin pasarse del plazo
async function enParalelo(items, n, fn, hasta) {
  const out = new Array(items.length);
  let i = 0;
  async function obrero() {
    while (i < items.length) {
      const k = i++;
      if (Date.now() > hasta) { out[k] = null; continue; }
      try { out[k] = await fn(items[k], k); } catch (e) { out[k] = null; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, obrero));
  return out;
}

// ---------------------------------------------------------------------------
// Fechas: GHL da a veces «2026-09-28 12:00:00» sin zona, en hora de Madrid
// (misma lógica que api/_cita.js). Las etiquetas act-ini-AAAAMMDDHHMM van en UTC.
// ---------------------------------------------------------------------------
function desfaseMadridMin(d) {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: ZONA, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    .formatToParts(d).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
  return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - d.getTime()) / 60000);
}
function madrid(y, mo, d, h, mi) {
  const bruto = Date.UTC(y, mo - 1, d, h, mi, 0);
  const d1 = new Date(bruto - desfaseMadridMin(new Date(bruto)) * 60000);
  return bruto - desfaseMadridMin(d1) * 60000;
}
function fecha(v) {
  if (!v) return null;
  const s = String(v).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::\d{2})?(?:\.\d+)?$/);
  if (m) return madrid(+m[1], +m[2], +m[3], +m[4], +m[5]);
  const t = Date.parse(s);
  return isNaN(t) ? null : t;
}
function fechaEtiqueta(tags, prefijo) {
  const t = tags.filter(function (x) { return x.indexOf(prefijo) === 0; }).map(function (x) { return x.slice(prefijo.length); })
    // Los sellos se escriben en UTC (api/meta-leadform.js, api/activacion.js: toISOString)
    .map(function (x) { const m = x.match(/(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0)) : null; })
    .filter(Boolean);
  return t.length ? Math.min.apply(null, t) : null;
}

// ---------------------------------------------------------------------------
// Etiquetas del formulario (api/meta-leadform.js) → los campos del motor
// ---------------------------------------------------------------------------
function primera(tags, prefijo) {
  return tags.filter(function (x) { return x.indexOf(prefijo) === 0; }).map(function (x) { return x.slice(prefijo.length); })[0] || '';
}
function inversion(tags) {
  const v = primera(tags, 'inv-');
  if (/mas-de-5|5-000/.test(v)) return 'mas5000';
  if (/mas-de-2|2-000-y|mas-2000|entre-2-000/.test(v)) return '2000_5000';
  if (/entre-500|500-y-2/.test(v)) return '500_2000';
  if (/menos-de-500|menos-500/.test(v)) return 'menos500';
  if (/nada/.test(v)) return 'nada';
  return '';
}
function volumen(tags) {
  const v = primera(tags, 'vol-');
  if (!v) return 0;
  if (/mas|50-100|100/.test(v)) return 60;
  if (/20-50|15-30|30/.test(v)) return 35;
  if (/5-15|15-20|10-20|10/.test(v)) return 10;
  if (/menos/.test(v)) return 3;
  return 0;
}
function sector(tags) {
  const v = primera(tags, 'sector-');
  if (!v) return '';
  if (/clinic|salud|estet|dental|fisio/.test(v)) return 'clinica';
  if (/formaci|academ|escuela/.test(v)) return 'formacion';
  if (/reform|constru|instala/.test(v)) return 'reformas';
  if (/asesor|consult|abogad|gestor/.test(v)) return 'asesoria';
  return 'otro';
}
function fuga(tags) {
  const v = primera(tags, 'fuga-');
  if (!v) return '';
  if (/anuncio|captaci/.test(v)) return 'anuncios';
  if (/web|formulario/.test(v)) return 'web';
  if (/respuesta/.test(v)) return 'respuesta';
  if (/seguimiento|presupuesto/.test(v)) return 'seguimiento';
  if (/no-lo-s|nose/.test(v)) return 'nose';
  return '';
}

// Etapa del trato → índice del recorrido del sector «qualivo»
// (Anuncio 0 · Formulario 1 · Contesta 2 · Diagnóstico agendado 3 · Diagnóstico hecho 4 · Plan enviado 5 · Piloto o cliente 6)
function etapaDe(nombre) {
  const n = String(nombre || '').toLowerCase();
  if (/cliente|piloto/.test(n)) return { i: 6, fin: 'ganado' };
  if (/perdido/.test(n)) return { i: 1, fin: 'perdido' };
  // «Segunda reunión» (28-sep) va después de la oferta: no es un diagnóstico agendado.
  if (/oferta|propuesta|negociaci|segunda/.test(n)) return { i: 5 };
  if (/no presentado/.test(n)) return { i: 3, noshow: true };
  if (/reuni|call agendada|agendad/.test(n)) return { i: 3 };
  if (/más adelante|mas adelante/.test(n)) return { i: 2, luego: true };
  if (/conversaci|tibio/.test(n)) return { i: 2 };
  if (/no responde/.test(n)) return { i: 1, agotado: true };
  return { i: 1 };
}

// 28-sep: el modo real no puede quedarse solo con lo que entra por anuncios. Las
// reuniones que llegan por correo en frío, agenda directa o recomendación
// (Patrizia, Sergi, Talkual…) también son el negocio.
const REUNION_TAGS = ['reunion-reservada', 'reunion-reservada.', 'act-agendado', 'reunion-agendada', 'reunion-celebrada', 'propuesta-enviada', 'segunda-reunion'];
const MAX_TRATOS_EXTRA = 40;
// Trato «vivo» a partir de la reunión: agendada, confirmada, no presentado, oferta, segunda reunión, negociación, piloto o cliente.
function tratoVivo(tr) {
  if (!tr) return false;
  if (/lost|abandon/.test(String(tr.estado || ''))) return false;
  const et = etapaDe(tr.etapa);
  return et.i >= 3 || /confirm/i.test(tr.etapa || '');
}
// «patrizia laplana bigott» → «Patrizia Laplana Bigott» (los formularios llegan en minúsculas)
function nombrePropio(s) {
  return String(s).split(/\s+/).map(function (w) { return w && w === w.toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w; }).join(' ');
}
function origenDe(tags) {
  const t = function (x) { return tags.indexOf(x) >= 0; };
  if (t('leadform')) return 'Formulario de Meta';
  if (t('paid')) return 'Anuncio · web';
  if (t('email-frio') || t('canal-email-frio')) return 'Correo en frío';
  if (tags.some(function (x) { return /^abm|linkedin/.test(x); })) return 'Prospección directa';
  return 'Directo o recomendación';
}

function normal(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }

// ---------------------------------------------------------------------------
// Recogida
// ---------------------------------------------------------------------------
async function contactosRecientes(desde, hasta) {
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const todos = [];
  let url = '/contacts/?locationId=' + loc + '&limit=100';
  for (let pagina = 0; pagina < 25 && Date.now() < hasta; pagina++) {
    const d = await ghl(url);
    const lote = d.contacts || [];
    todos.push.apply(todos, lote);
    const m = d.meta || {};
    if (lote.length < 100 || !m.startAfterId) break;
    // Si la lista viene de más nueva a más antigua, se para al pasar los 30 días.
    const ultima = fecha(lote[lote.length - 1].dateAdded);
    if (ultima && ultima < desde && fecha(lote[0].dateAdded) >= ultima) break;
    url = '/contacts/?locationId=' + loc + '&limit=100&startAfterId=' + encodeURIComponent(m.startAfterId) + (m.startAfter ? '&startAfter=' + encodeURIComponent(m.startAfter) : '');
  }
  return todos.filter(function (c) {
    const tags = (c.tags || []).map(String);
    if (tags.indexOf('demo') >= 0) return false;
    if (/\b(prueba|test)\b/i.test([c.firstName, c.lastName, c.contactName].join(' '))) return false;
    const deAnuncio = tags.indexOf('paid') >= 0 || tags.indexOf('leadform') >= 0;
    const conReunion = REUNION_TAGS.some(function (t) { return tags.indexOf(t) >= 0; });
    if (!deAnuncio && !conReunion) return false;
    const t = fechaEtiqueta(tags, 'act-ini-') || fecha(c.dateAdded);
    return t && t >= desde;
  });
}

async function mensajes(contactId) {
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const d = await ghl('/conversations/search?locationId=' + loc + '&contactId=' + encodeURIComponent(contactId));
  const out = [];
  for (const c of (d.conversations || []).slice(0, 3)) {
    const dm = await ghl('/conversations/' + encodeURIComponent(c.id) + '/messages?limit=100');
    const lista = (dm.messages && dm.messages.messages) || dm.messages || [];
    (Array.isArray(lista) ? lista : []).forEach(function (m) { out.push(m); });
  }
  // Fuera las actividades y los duplicados de la pasarela (mismo texto y sentido en menos de 90 s)
  const limpios = out.filter(function (m) { return !/ACTIVITY/i.test(String(m.messageType || m.type || '')); })
    .sort(function (a, b) { return fecha(a.dateAdded) - fecha(b.dateAdded); });
  return limpios.filter(function (m, i) {
    const p = limpios[i - 1];
    return !(p && p.direction === m.direction && String(p.body || '').trim() === String(m.body || '').trim() && fecha(m.dateAdded) - fecha(p.dateAdded) < 90000);
  });
}

// 28-sep: todas las citas de los calendarios de GHL en dos llamadas (una por calendario),
// en vez de una por contacto: así no se acaba el tiempo y la agenda sale completa.
async function citasCalendario(desde, hastaCitas) {
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const cals = await ghl('/calendars/?locationId=' + loc);
  const porContacto = {};
  for (const cal of (cals.calendars || [])) {
    const d = await ghl('/calendars/events?locationId=' + loc + '&calendarId=' + encodeURIComponent(cal.id) + '&startTime=' + desde + '&endTime=' + hastaCitas);
    (d.events || []).forEach(function (e) {
      const cid = e.contactId;
      const t = fecha(e.startTime);
      if (!cid || !t) return;
      (porContacto[cid] = porContacto[cid] || []).push({ t: t, estado: String(e.appointmentStatus || e.status || '').toLowerCase(), titulo: String(e.title || '').slice(0, 80) });
    });
  }
  return porContacto;
}

async function citas(contactId) {
  const d = await ghl('/contacts/' + encodeURIComponent(contactId) + '/appointments');
  return (d.events || d.appointments || []).map(function (e) {
    return { t: fecha(e.startTime), estado: String(e.appointmentStatus || e.status || '').toLowerCase(), titulo: String(e.title || '').slice(0, 80) };
  }).filter(function (e) { return e.t; });
}

// Etapas del embudo de Prospección, en orden: son las columnas del tablero del modo real.
async function etapasCrm() {
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const p = await ghl('/opportunities/pipelines?locationId=' + loc);
  const todas = {};
  let prosp = [];
  (p.pipelines || []).forEach(function (pl) {
    (pl.stages || []).forEach(function (s) { todas[s.id] = s.name; });
    if (pl.id === EMBUDOS[0]) prosp = (pl.stages || []).slice().sort(function (a, b) { return (a.position || 0) - (b.position || 0); }).map(function (s) { return { id: s.id, txt: s.name }; });
  });
  return { todas: todas, prosp: prosp };
}

async function tratos(hasta, etapasInfo) {
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const etapas = (etapasInfo && etapasInfo.todas) || {};
  const porContacto = {};
  for (const emb of EMBUDOS) {
    for (let page = 1; page <= 10 && Date.now() < hasta; page++) {
      const d = await ghl('/opportunities/search?location_id=' + loc + '&pipeline_id=' + emb + '&limit=100&page=' + page);
      const lista = d.opportunities || [];
      lista.forEach(function (o) {
        const cid = o.contactId || (o.contact && o.contact.id);
        if (!cid) return;
        const prev = porContacto[cid];
        // Manda Prospección (lo que entra por anuncios) sobre Qualivo Pipeline
        if (prev && prev.embudo === EMBUDOS[0] && emb !== EMBUDOS[0]) return;
        porContacto[cid] = { id: o.id, embudo: emb, etapa: etapas[o.pipelineStageId] || '', etapaId: o.pipelineStageId, estado: o.status, valor: Number(o.monetaryValue || 0) };
      });
      if (lista.length < 100) break;
    }
  }
  return porContacto;
}

async function anuncios() {
  const d = await meta('/' + CUENTA_META + '/insights', { level: 'campaign', date_preset: 'last_30d', fields: 'campaign_id,campaign_name,spend,clicks,actions', limit: '50' });
  return (d.data || []).filter(function (r) { return /^QV_/.test(r.campaign_name || ''); }).map(function (r) {
    const acts = {};
    (r.actions || []).forEach(function (a) { acts[a.action_type] = Number(a.value || 0); });
    return { id: String(r.campaign_id), nombre: String(r.campaign_name).replace(/^QV_/, '').replace(/_/g, ' '), bruto: r.campaign_name, gasto: Number(r.spend || 0), clics: Number(r.clicks || 0), leadsMeta: acts.lead || acts['onsite_conversion.lead_grouped'] || 0 };
  });
}

// ---------------------------------------------------------------------------
// Un contacto de GHL → lo que necesita el motor (sin correo ni teléfono)
// ---------------------------------------------------------------------------
function convertir(c, msgs, citasC, trato, ahora, campanas) {
  const tags = (c.tags || []).map(String);
  const tiene = function (t) { return tags.indexOf(t) >= 0; };
  const creado = fechaEtiqueta(tags, 'act-ini-') || fecha(c.dateAdded) || ahora;
  const conv = (msgs || []).map(function (m) {
    const tipo = String(m.messageType || m.type || '');
    const voz = /CALL/i.test(tipo);
    const canal = voz ? 'voz' : /EMAIL/i.test(tipo) ? 'email' : 'wa';
    const entrante = String(m.direction) === 'inbound';
    const de = entrante ? 'c' : voz ? 'v' : m.userId ? 'h' : 'a';
    let texto = String(m.body || (voz ? 'Llamada' : '')).replace(/✅ Sent from another device ✅/g, '').replace(/\s+/g, ' ').trim().slice(0, 280);
    const estado = String(m.status || '').toLowerCase();
    return { t: fecha(m.dateAdded), de: de, canal: canal, texto: texto || '(sin texto)', estado: estado };
  }).filter(function (m) { return m.t; });
  const suyos = conv.filter(function (m) { return m.de === 'c'; });
  const nuestros = conv.filter(function (m) { return m.de !== 'c'; });
  const primeroNuestro = nuestros.filter(function (m) { return m.t >= creado - 60000; })[0];
  const ultimo = conv[conv.length - 1];
  const et = trato ? etapaDe(trato.etapa) : null;
  const proxima = (citasC || []).filter(function (e) { return e.t > ahora - 3 * 3600000 && !/cancel/.test(e.estado); }).sort(function (a, b) { return a.t - b.t; })[0];
  const pasadaNoShow = (citasC || []).some(function (e) { return /noshow|no_show/.test(e.estado); });
  let etapa = et ? et.i : 1;
  if (!et) {
    if (proxima || tiene('act-agendado') || tiene('reunion-reservada')) etapa = 3;
    else if (suyos.length) etapa = 2;
  }
  // Reunión ya pasada y sin plantón → diagnóstico hecho
  const ultimaCita = (citasC || []).filter(function (e) { return e.t <= ahora && !/cancel|noshow|no_show/.test(e.estado); }).sort(function (a, b) { return b.t - a.t; })[0];
  if (etapa === 3 && ultimaCita && !(proxima && proxima.t > ahora)) etapa = 4;
  let resVoz = tiene('voz-completada') ? 'completada' : tiene('voz-sin-respuesta') ? 'sin respuesta' : tiene('voz-fallo') ? 'fallo' : '';
  const intentos = ['act-wa1', 'act-wa2', 'act-voz1'].filter(tiene).length;
  // Campaña: por atribución de GHL, si coincide con alguna de Meta
  const attr = [c.attributionSource, c.lastAttributionSource].filter(Boolean).map(function (a) { return normal([a.utmCampaign, a.campaign, a.utmContent, a.adName].join(' ')); }).join(' ');
  const camp = (campanas || []).filter(function (k) { const n = normal(k.bruto); return n && attr && (attr.indexOf(n) >= 0 || attr.indexOf(normal(k.id)) >= 0); })[0];

  return {
    id: c.id,
    n: nombrePropio([c.firstName, c.lastName].filter(Boolean).join(' ').trim() || c.contactName || 'Sin nombre'),
    emp: c.companyName || '',
    ciudad: c.city || '',
    canal: c.phone ? 'wa' : 'email',
    origen: origenDe(tags),
    campana: camp ? camp.id : '',
    creado: creado,
    act: suyos.length ? suyos[suyos.length - 1].t : creado,
    toque: nuestros.length ? nuestros[nuestros.length - 1].t : null,
    etapa: etapa,
    etapaNombre: trato ? trato.etapa : '',
    tratoId: trato ? trato.id : '',
    etapaId: trato && trato.embudo === EMBUDOS[0] && !/lost|abandon/.test(String(trato.estado || '')) ? trato.etapaId : '',
    fin: et && et.fin ? et.fin : (trato && /lost/.test(String(trato.estado)) ? 'perdido' : ''),
    valor: trato ? trato.valor : 0,
    f: { inv: inversion(tags), vol: volumen(tags), sector: sector(tags), fuga: fuga(tags), nivel: (primera(tags, 'nivel-') || '').toUpperCase(), potente: tiene('lead-potente'),
      // Formulario y cadencia del 28-sep: cuándo quiere empezar, encaje con el precio y camino seguido.
      cuando: primera(tags, 'cuando-'), precio: primera(tags, 'precio-'), ruta: primera(tags, 'ruta-') },
    s: {
      wa1: tiene('act-wa1'), wa1Fallido: tiene('act-wa1-fallido'), wa2: tiene('act-wa2'), voz1: tiene('act-voz1'),
      vozCuando: fechaEtiqueta(tags, 'act-voz1-h-'), vozRes: resVoz, raquel: resVoz === 'completada',
      manualWa: tiene('wa1-manual-maikel'), manualVoz: tiene('voz-manual-maikel'),
      agendado: tiene('act-agendado') || tiene('reunion-reservada'), actFin: tiene('act-fin'),
      cita: proxima ? proxima.t : null, citaOk: proxima ? /confirm/.test(proxima.estado) : false,
      citas: (citasC || []).filter(function (e) { return !/cancel|invalid/.test(e.estado); }).map(function (e) { return { t: e.t, estado: e.estado }; }),
      noshow: !!(et && et.noshow) || pasadaNoShow || tiene('no-presentado'),
      luego: et && et.luego ? 'más adelante' : '', intentos: et && et.agotado ? 3 : intentos,
      primeraRespuestaMin: primeroNuestro ? Math.max(0, Math.round((primeroNuestro.t - creado) / 60000)) : null,
      esperaDesde: ultimo && ultimo.de === 'c' ? ultimo.t : null
    },
    conv: conv.slice(-40)
  };
}

async function recoger() {
  const ahora = Date.now();
  const hasta = ahora + PLAZO_MS;
  const desde = ahora - DIAS * 86400000;
  const avisos = [];
  let campanas = [];
  try { campanas = await anuncios(); } catch (e) { avisos.push('No se ha podido leer Meta (' + String(e.message).slice(0, 40) + ').'); }
  const leads = await contactosRecientes(desde, hasta);
  let porTrato = {};
  let etapasInfo = { todas: {}, prosp: [] };
  try { etapasInfo = await etapasCrm(); } catch (e) { avisos.push('No se han podido leer las etapas del CRM.'); }
  try { porTrato = await tratos(hasta, etapasInfo); } catch (e) { avisos.push('No se han podido leer los tratos.'); }
  // Contactos con un trato vivo en el pipeline que no han entrado por la lista de recientes
  // (más antiguos que 30 días o sin etiqueta de anuncio).
  const yaEstan = {};
  leads.forEach(function (c) { yaEstan[c.id] = true; });
  const extra = Object.keys(porTrato).filter(function (id) { return !yaEstan[id] && tratoVivo(porTrato[id]); }).slice(0, MAX_TRATOS_EXTRA);
  if (extra.length) {
    const traidos = await enParalelo(extra, 5, function (id) { return ghl('/contacts/' + encodeURIComponent(id)).then(function (d) { return d.contact || null; }); }, hasta - 12000);
    traidos.forEach(function (c) {
      if (!c || (c.tags || []).indexOf('demo') >= 0) return;
      if (/\b(prueba|test)\b/i.test([c.firstName, c.lastName, c.contactName].join(' '))) return;
      leads.push(c);
    });
  }
  leads.sort(function (a, b) { return (fecha(b.dateAdded) || 0) - (fecha(a.dateAdded) || 0); });
  // El calendario va antes que las conversaciones: son dos llamadas y, si esperan al
  // final, GHL ya está limitando (429) y la agenda sale vacía.
  let citasPrevias = null;
  for (let intento = 0; intento < 2 && !citasPrevias; intento++) {
    try { citasPrevias = await citasCalendario(desde, ahora + 45 * 86400000); }
    catch (e) { if (intento) avisos.push('No se ha podido leer el calendario de GHL.'); else await new Promise(function (r) { setTimeout(r, 1500); }); }
  }
  const msgs = await enParalelo(leads, 5, function (c) { return mensajes(c.id); }, hasta - 8000);
  const conCita = leads.map(function (c, i) { return i; }).filter(function (i) {
    const tags = (leads[i].tags || []).map(String);
    const tr = porTrato[leads[i].id];
    return REUNION_TAGS.some(function (t) { return tags.indexOf(t) >= 0; }) || tratoVivo(tr);
  });
  let citasPor = citasPrevias;
  if (!citasPor) {
    citasPor = {};
    const cs = await enParalelo(conCita, 5, function (i) { return citas(leads[i].id); }, hasta - 3000);
    conCita.forEach(function (i, k) { citasPor[leads[i].id] = cs[k] || []; });
  }
  const faltan = msgs.filter(function (m) { return m === null; }).length;
  if (faltan) avisos.push('GHL tardaba: ' + faltan + ' conversaciones no se han leído en esta pasada.');
  const contactos = leads.map(function (c, i) { return convertir(c, msgs[i] || [], citasPor[c.id], porTrato[c.id], ahora, campanas); });
  let pausa = false;
  try { pausa = !!require('./_pausa.js').PAUSA_TOTAL; } catch (e) { pausa = false; }
  return { generado: ahora, pausa: pausa, parcial: faltan > 0, avisos: avisos, contactos: contactos, campanas: campanas, etapasCrm: etapasInfo.prosp };
}

async function mover(b) {
  const contactId = String(b.contactId || '').slice(0, 40);
  const etapaId = String(b.etapaId || '').slice(0, 60);
  if (!/^[A-Za-z0-9]+$/.test(contactId) || !/^[A-Za-z0-9-]+$/.test(etapaId)) throw new Error('Datos no válidos.');
  const info = await etapasCrm();
  const etapa = info.prosp.filter(function (s) { return s.id === etapaId; })[0];
  if (!etapa) throw new Error('Esa etapa no es del embudo de Prospección.');
  const cab = Object.assign({}, cabGHL(), { 'Content-Type': 'application/json' });
  // El trato de Prospección de este contacto, si lo tiene (el que llega del tablero no se da por bueno)
  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const d = await ghl('/opportunities/search?location_id=' + loc + '&pipeline_id=' + EMBUDOS[0] + '&contact_id=' + encodeURIComponent(contactId) + '&limit=5');
  const trato = (d.opportunities || [])[0];
  let r;
  if (trato) {
    r = await fetch(GHL + '/opportunities/' + encodeURIComponent(trato.id), { method: 'PUT', headers: cab, body: JSON.stringify({ pipelineStageId: etapaId, status: 'open' }) });
  } else {
    const c = await ghl('/contacts/' + encodeURIComponent(contactId));
    const ct = c.contact || {};
    const nombre = [ct.firstName, ct.lastName].filter(Boolean).join(' ') || ct.contactName || 'Contacto';
    r = await fetch(GHL + '/opportunities/', { method: 'POST', headers: cab, body: JSON.stringify({ locationId: process.env.GHL_LOCATION_ID, pipelineId: EMBUDOS[0], pipelineStageId: etapaId, contactId: contactId, name: nombre + (ct.companyName ? ' (' + ct.companyName + ')' : ''), status: 'open' }) });
  }
  if (!r.ok) throw new Error('GHL no ha aceptado el cambio (' + r.status + ').');
  const j = await r.json().catch(function () { return {}; });
  // Que la próxima lectura no enseñe la etapa vieja
  if (cache && cache.datos) {
    cache.datos.contactos.forEach(function (x) {
      if (x.id !== contactId) return;
      x.etapaId = etapaId; x.etapaNombre = etapa.txt;
      const et = etapaDe(etapa.txt); x.etapa = et.i; x.fin = et.fin || '';
      if (!x.tratoId) x.tratoId = (j.opportunity && j.opportunity.id) || '';
    });
  }
  return { ok: true, etapaId: etapaId, etapa: etapa.txt, creado: !trato };
}

// ---------------------------------------------------------------------------
// Acciones de la ficha (modo real). Nada sale sin un clic de Maikel en la pantalla.
// ---------------------------------------------------------------------------
function idValido(id) {
  const s = String(id || '').slice(0, 40);
  if (!/^[A-Za-z0-9]+$/.test(s)) throw new Error('Contacto no válido.');
  return s;
}
async function contactoGhl(id) {
  const d = await ghl('/contacts/' + encodeURIComponent(id));
  if (!d.contact) throw new Error('No encuentro el contacto en GHL.');
  return d.contact;
}

// Borrador con IA a partir de la conversación real: si el último mensaje es suyo,
// la respuesta; si es nuestro, un reenganche que retoma donde se quedó.
async function redactar(b) {
  const A = require('./_activacion.js'), AGT = require('./_agente.js');
  const id = idValido(b.contactId);
  const c = await contactoGhl(id);
  const msgs = await A.mensajesDe(id);
  const wa = msgs.filter(function (m) { return A.esWhatsApp(m) && String(m.status || '').toLowerCase() !== 'failed' && String(m.body || '').trim(); })
    .sort(function (x, y) { return fecha(x.dateAdded) - fecha(y.dateAdded); });
  const ultimo = wa[wa.length - 1];
  if (!ultimo) throw new Error('No hay conversación de WhatsApp con esta persona: no tengo de dónde partir. Escríbele tú o activa la llamada.');
  if (String(ultimo.direction) === 'inbound') {
    let huecos = [];
    try { huecos = await require('./agendar.js').huecosLibres(4); } catch (e) { huecos = []; }
    const d = await AGT.decidir({ contacto: c, mensajes: wa, huecos: huecos, copiloto: true });
    if (!d.texto) throw new Error('El agente no ha encontrado nada que contestar.');
    return { texto: d.texto, tipo: 'respuesta', nota: d.accion === 'pasar' ? 'El agente cree que esto lo tienes que llevar tú.' : d.accion === 'proponer_cita' ? 'Propone una cita: si le dice que sí, resérvala tú.' : '' };
  }
  const dias = Math.max(1, Math.round((Date.now() - fecha(ultimo.dateAdded)) / 86400000));
  const r = await AGT.reenganchar({ contacto: c, mensajes: wa, intento: 1, dias: dias });
  if (!r.texto) throw new Error('No se ha podido redactar (' + (r.motivo || 'sin texto') + ').');
  return { texto: r.texto, tipo: 'reenganche', nota: 'Lleva ' + dias + (dias === 1 ? ' día' : ' días') + ' sin contestar.' };
}

async function enviarWa(b) {
  const A = require('./_activacion.js');
  const id = idValido(b.contactId);
  const texto = String(b.texto || '').trim();
  if (!texto || texto.length > 1000) throw new Error('El mensaje está vacío o es demasiado largo.');
  await A.enviarPorGateway(id, texto, { forzar: true });
  await A.nota(id, 'WHATSAPP ENVIADO DESDE INTELLIGENCE (Maikel) · ' + new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }) + '\n' + texto).catch(function () {});
  await A.etiquetar(id, ['wa-intelligence']).catch(function () {});
  return { ok: true };
}

// «Activar agente de WhatsApp»: envía el mensaje aprobado y deja al agente contestar
// solo a esta persona (etiqueta agente-auto, que salta el modo copiloto en _agente.js).
async function agenteWa(b) {
  const A = require('./_activacion.js');
  const id = idValido(b.contactId);
  if (b.texto) await enviarWa(b);
  await A.etiquetar(id, ['agente-auto']);
  // Quitar los frenos que harían callar al agente con esta persona
  try {
    await fetch(GHL + '/contacts/' + encodeURIComponent(id) + '/tags', { method: 'DELETE', headers: Object.assign({}, cabGHL(), { 'Content-Type': 'application/json' }), body: JSON.stringify({ tags: ['wa-humano', 'wa-agente-off'] }) });
  } catch (e) { /* no bloquea */ }
  await A.nota(id, 'AGENTE DE WHATSAPP ACTIVADO desde Intelligence (Maikel): contesta solo a esta persona, sin pasar por borrador.').catch(function () {});
  return { ok: true };
}

async function llamar(b) {
  const A = require('./_activacion.js');
  const id = idValido(b.contactId);
  const c = await contactoGhl(id);
  if (!c.phone) throw new Error('No tiene teléfono en GHL.');
  const nombre = c.firstName || c.contactName || '';
  const r = await A.lanzarLlamada({ telefono: c.phone, nombre: nombre, contexto: { nombre: nombre, email: c.email || '', email_dominio: String(c.email || '').split('@')[1] || '', empresa: c.companyName || '', origen: 'el diagnóstico', fuga: '' } });
  if (!r.ok) throw new Error('No se ha podido lanzar la llamada (' + (r.motivo || '') + ').');
  await A.etiquetar(id, ['voz-intelligence']).catch(function () {});
  await A.nota(id, 'LLAMADA DE RAQUEL lanzada desde Intelligence (Maikel) · ' + new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })).catch(function () {});
  return { ok: true, id: r.id };
}

// ---------------------------------------------------------------------------
module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  const accion = String((req.query && req.query.accion) || '');
  if (!S.configurada()) return res.status(503).json({ error: 'Falta INTELLIGENCE_CLAVE en Vercel.' });

  if (req.method === 'POST' && accion === 'entrar') {
    const ip = S.ipDe(req);
    if (S.bloqueada(ip)) return res.status(429).json({ error: 'Demasiados intentos. Prueba dentro de 15 minutos.' });
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    if (!S.claveCorrecta(String((body && body.clave) || '').slice(0, 200))) {
      S.fallo(ip);
      await new Promise(function (r) { setTimeout(r, 400); });
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }
    res.setHeader('Set-Cookie', S.cookieSesion());
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'POST' && accion === 'salir') {
    res.setHeader('Set-Cookie', S.cookieBorrar());
    return res.status(200).json({ ok: true });
  }
  if (req.method === 'POST' && accion === 'mover') {
    // 28-sep: mover una oportunidad de etapa desde el tablero. Solo toca el CRM
    // (la etapa del trato); no envía mensajes a nadie.
    if (!S.valida(req)) return res.status(401).json({ error: 'Sin sesión.' });
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    try { return res.status(200).json(await mover(body || {})); }
    catch (e) { return res.status(400).json({ error: String(e.message || e).slice(0, 120) }); }
  }
  if (req.method === 'POST' && (accion === 'redactar' || accion === 'enviar-wa' || accion === 'llamar' || accion === 'agente-wa')) {
    // 28-sep: acciones desde la ficha. Solo con sesión y siempre por un clic de Maikel.
    if (!S.valida(req)) return res.status(401).json({ error: 'Sin sesión.' });
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    try {
      const fn = { redactar: redactar, 'enviar-wa': enviarWa, llamar: llamar, 'agente-wa': agenteWa }[accion];
      return res.status(200).json(await fn(body || {}));
    } catch (e) { return res.status(400).json({ error: String(e.message || e).slice(0, 160) }); }
  }
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido.' });
  if (!S.valida(req)) return res.status(401).json({ error: 'Sin sesión.' });
  if (!process.env.GHL_API_KEY || !process.env.GHL_LOCATION_ID) return res.status(503).json({ error: 'Faltan las claves de GHL en Vercel.' });

  try {
    const fresco = String((req.query && req.query.fresco) || '') === '1';
    const edad = cache ? Date.now() - cache.t : Infinity;
    if (!cache || edad > CACHE_MS || (fresco && edad > 60000)) {
      if (!enCurso) enCurso = recoger().then(function (d) { cache = { t: Date.now(), datos: d }; return d; }).finally(function () { enCurso = null; });
      await enCurso;
    }
    return res.status(200).json(Object.assign({ cacheSegundos: Math.round((Date.now() - cache.t) / 1000) }, cache.datos));
  } catch (e) {
    return res.status(502).json({ error: 'No se han podido leer los datos: ' + String(e.message || e).slice(0, 80) });
  }
};
