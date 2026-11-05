// Panel de negocio · GHL de Qualivo: leads, oportunidades y las acciones de los botones.
//
// Lectura: GET con GHL_API_KEY (la misma que ya lee Intelligence).
// Escritura: SOLO desde los botones del panel, de una en una, con la clave propia
// GHL_PANEL_API_KEY (la crea Maikel) y solo si NEGOCIO_ACCIONES=1. Ver
// automatizaciones/plataforma/panel-negocio-ghl.md (rama claude/qualivo-automatizaciones-b7k2m9).
// Al navegador no van correos ni teléfonos; en Leads, solo la empresa.

const C = require('./_negocio-comun.js');

const GHL = process.env.NEGOCIO_GHL_BASE || 'https://services.leadconnectorhq.com';
const DIAS_PARADA = 14;
const ETAPAS_AVANZADAS = /reuni[oó]n agendada|confirmado|call agendada|call realizada|oferta|propuesta|segunda reuni|negociaci|piloto/i;
const ETAPAS_CERRADAS = /cliente|perdid|no interesado|cerrado/i;

function loc() { return process.env.GHL_LOCATION_ID || ''; }
function cab(clave) {
  return { Authorization: 'Bearer ' + clave, Version: '2021-07-28', Accept: 'application/json', 'User-Agent': 'QualivoIntelligence/1.0 (+https://qualivo.io)' };
}
async function leer(ruta, intento) {
  try {
    return await C.getJSON(GHL + ruta, cab(process.env.GHL_API_KEY), 15000);
  } catch (e) {
    if (e.status === 429 && !intento) { await new Promise(function (ok) { setTimeout(ok, 1500); }); return leer(ruta, 1); }
    throw e;
  }
}

function fecha(x) { const t = x ? Date.parse(x) : NaN; return isNaN(t) ? null : t; }

// ---------------------------------------------------------------------------
// Lectura base (caché de 3 minutos): embudos, oportunidades y contactos.
// ---------------------------------------------------------------------------
async function embudos() {
  const d = await leer('/opportunities/pipelines?locationId=' + encodeURIComponent(loc()));
  return (d.pipelines || []).map(function (p) {
    return { id: p.id, nombre: p.name, etapas: (p.stages || []).slice().sort(function (a, b) { return (a.position || 0) - (b.position || 0); }).map(function (s) { return { id: s.id, nombre: s.name }; }) };
  });
}

async function oportunidades(listaEmbudos) {
  const todas = [];
  for (const emb of listaEmbudos) {
    let url = '/opportunities/search?location_id=' + encodeURIComponent(loc()) + '&pipeline_id=' + encodeURIComponent(emb.id) + '&limit=100';
    for (let i = 0; i < 20; i++) {
      const d = await leer(url);
      (d.opportunities || []).forEach(function (o) { todas.push(o); });
      const m = d.meta || {};
      if ((d.opportunities || []).length < 100 || !m.startAfterId) break;
      url = '/opportunities/search?location_id=' + encodeURIComponent(loc()) + '&pipeline_id=' + encodeURIComponent(emb.id) + '&limit=100&startAfter=' + encodeURIComponent(m.startAfter) + '&startAfterId=' + encodeURIComponent(m.startAfterId);
    }
  }
  return todas;
}

async function contactos() {
  const todos = [];
  let url = '/contacts/?locationId=' + encodeURIComponent(loc()) + '&limit=100';
  for (let i = 0; i < 40; i++) {
    const d = await leer(url);
    const lote = d.contacts || [];
    todos.push.apply(todos, lote);
    const m = d.meta || {};
    if (lote.length < 100 || !m.startAfterId) break;
    url = '/contacts/?locationId=' + encodeURIComponent(loc()) + '&limit=100&startAfterId=' + encodeURIComponent(m.startAfterId) + (m.startAfter ? '&startAfter=' + encodeURIComponent(m.startAfter) : '');
  }
  return todos;
}

async function base(fresco) {
  return C.cacheado('ghl|base', 3 * 60000, fresco, async function () {
    const emb = await embudos();
    const [ops, cts] = await Promise.all([oportunidades(emb), contactos()]);
    return { embudos: emb, oportunidades: ops, contactos: cts, generado: Date.now() };
  });
}

// ---------------------------------------------------------------------------
// Etiquetas → nivel, sector, canal
// ---------------------------------------------------------------------------
function nivelDe(tags) {
  for (const n of ['a', 'b', 'c', 'd']) if (tags.indexOf('nivel-' + n) >= 0) return n.toUpperCase();
  return 'Sin nivel';
}
function bonito(s) { s = String(s || '').replace(/-/g, ' ').trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
const SECTORES = [
  [/^sector-formacion/, 'Formación'], [/^sector-(clinicas|salud)/, 'Clínicas y salud'], [/^sector-reformas/, 'Reformas y construcción'],
  [/^sector-servicios-profesionales/, 'Servicios profesionales'], [/^sector-agencia/, 'Agencias'], [/^sector-ecommerce/, 'E-commerce'],
  [/^sector-inmobiliari/, 'Inmobiliaria'], [/^sector-movilidad/, 'Movilidad'], [/^sector-otro/, 'Otro']
];
function sectorDe(tags) {
  const t = tags.filter(function (x) { return x.indexOf('sector-') === 0; })[0];
  if (!t) return 'Sin sector';
  for (const s of SECTORES) if (s[0].test(t)) return s[1];
  return bonito(t.slice(7));
}
function canalDe(tags) {
  if (tags.indexOf('canal-meta-ads') >= 0 || tags.indexOf('leadform') >= 0) return 'Meta Ads';
  if (tags.indexOf('canal-web') >= 0) return 'Web';
  if (tags.indexOf('canal-email-frio') >= 0 || tags.indexOf('origen-outbound') >= 0) return 'Outbound';
  if (tags.indexOf('canal-linkedin') >= 0 || tags.indexOf('origen-linkedin') >= 0) return 'LinkedIn';
  if (tags.indexOf('canal-referencia') >= 0 || tags.indexOf('origen-partner') >= 0) return 'Referido o partner';
  if (tags.indexOf('origen-instagram') >= 0) return 'Instagram';
  if (tags.indexOf('canal-base-antigua') >= 0) return 'Base antigua';
  if (tags.indexOf('paid') >= 0) return 'Meta Ads';
  return 'Sin identificar';
}
function esPrueba(c, tags) {
  return tags.indexOf('demo') >= 0 || tags.some(function (t) { return /^demo-/.test(t); }) || tags.indexOf('descartado') >= 0 ||
    /\b(prueba|test)\b/i.test([c.firstName, c.lastName, c.contactName, c.companyName].join(' '));
}

// Mapa contacto → oportunidad «principal» (la abierta más reciente; si no, la más reciente)
function oportunidadPorContacto(ops, etapaNombre) {
  const m = {};
  ops.forEach(function (o) {
    const cid = o.contactId || (o.contact && o.contact.id);
    if (!cid) return;
    const p = m[cid];
    const abierta = o.status === 'open';
    const t = fecha(o.updatedAt) || 0;
    if (!p || (abierta && !p.abierta) || (abierta === p.abierta && t > p.t)) m[cid] = { id: o.id, etapa: etapaNombre[o.pipelineStageId] || '', estado: o.status, abierta: abierta, t: t };
  });
  return m;
}
function estadoLead(op) {
  if (!op) return 'Sin oportunidad';
  if (op.estado === 'won') return 'Ganado';
  if (op.estado === 'lost' || op.estado === 'abandoned') return 'Perdido';
  return op.etapa || 'Abierto';
}

// ---------------------------------------------------------------------------
// Leads: captación propia (Meta y web), sin datos personales.
// ---------------------------------------------------------------------------
async function leads(q, fresco) {
  const b = await base(fresco);
  const etapaNombre = {};
  b.embudos.forEach(function (e) { e.etapas.forEach(function (s) { etapaNombre[s.id] = s.nombre; }); });
  const opDe = oportunidadPorContacto(b.oportunidades, etapaNombre);
  const desde = /^\d{4}-\d{2}-\d{2}$/.test(String(q.desde || '')) ? q.desde : '2026-09-01';
  const filas = [];
  b.contactos.forEach(function (c) {
    const tags = (c.tags || []).map(function (t) { return String(t).toLowerCase(); });
    if (esPrueba(c, tags)) return;
    const propio = tags.some(function (t) { return t === 'paid' || t === 'leadform' || t === 'canal-web' || t === 'canal-meta-ads'; });
    if (!propio) return;
    const t = fecha(c.dateAdded);
    if (!t || C.diaMadrid(t) < desde) return;
    filas.push({
      id: c.id, fecha: C.diaMadrid(t), empresa: String(c.companyName || '').trim() || '—',
      sector: sectorDe(tags), nivel: nivelDe(tags), canal: canalDe(tags), estado: estadoLead(opDe[c.id])
    });
  });
  filas.sort(function (a, b2) { return a.fecha < b2.fecha ? 1 : a.fecha > b2.fecha ? -1 : 0; });
  const cuenta = function (k) { const m = {}; filas.forEach(function (f) { m[f[k]] = (m[f[k]] || 0) + 1; }); return m; };
  const semanas = {};
  filas.forEach(function (f) { const s = C.lunesDe(f.fecha); semanas[s] = semanas[s] || { semana: s, total: 0, ab: 0 }; semanas[s].total++; if (f.nivel === 'A' || f.nivel === 'B') semanas[s].ab++; });
  return {
    desde: desde, total: filas.length, porNivel: cuenta('nivel'), porSector: cuenta('sector'), porCanal: cuenta('canal'), porEstado: cuenta('estado'),
    semanas: Object.keys(semanas).sort().slice(-12).map(function (k) { return semanas[k]; }),
    filas: filas, generado: b.generado
  };
}

// ---------------------------------------------------------------------------
// CRM: oportunidades abiertas por embudo y etapa, paradas, y la tabla de avanzadas.
// ---------------------------------------------------------------------------
async function crm(fresco) {
  const b = await base(fresco);
  const ahora = Date.now();
  const cPorId = {};
  b.contactos.forEach(function (c) { cPorId[c.id] = c; });
  const etapas = [];
  const etapaInfo = {};
  b.embudos.forEach(function (e) {
    e.etapas.forEach(function (s, i) {
      const r = { embudo: e.nombre, embudoId: e.id, etapa: s.nombre, etapaId: s.id, orden: i, abiertas: 0, paradas: 0, valor: 0 };
      etapas.push(r); etapaInfo[s.id] = r;
    });
  });
  const lista = [];
  b.oportunidades.forEach(function (o) {
    if (o.status !== 'open') return;
    const e = etapaInfo[o.pipelineStageId];
    if (!e) return;
    const desdeCambio = fecha(o.lastStageChangeAt) || fecha(o.createdAt) || ahora;
    const dias = Math.floor((ahora - desdeCambio) / 86400000);
    e.abiertas++; e.valor += C.num(o.monetaryValue);
    const parada = dias > DIAS_PARADA && !ETAPAS_CERRADAS.test(e.etapa);
    if (parada) e.paradas++;
    const cid = o.contactId || (o.contact && o.contact.id);
    const ct = cPorId[cid] || {};
    const tags = (ct.tags || (o.contact && o.contact.tags) || []).map(function (t) { return String(t).toLowerCase(); });
    lista.push({
      id: o.id, contacto: cid || '', embudo: e.embudo, embudoId: e.embudoId, etapa: e.etapa, etapaId: e.etapaId,
      nombre: String((o.contact && o.contact.companyName) || ct.companyName || o.name || '').trim() || '—',
      origen: canalDe(tags), nivel: nivelDe(tags), valor: C.num(o.monetaryValue), dias: dias, parada: parada,
      avanzada: ETAPAS_AVANZADAS.test(e.etapa), rc: tags.indexOf('rc') >= 0,
      ghl: 'https://app.gohighlevel.com/v2/location/' + encodeURIComponent(loc()) + '/opportunities/list'
    });
  });
  lista.sort(function (a, c) { return c.dias - a.dias; });
  return {
    embudos: b.embudos,
    etapas: etapas,
    abiertas: lista.length,
    paradas: lista.filter(function (x) { return x.parada; }).length,
    avanzadas: lista.filter(function (x) { return x.avanzada; }),
    paradasLista: lista.filter(function (x) { return x.parada && !x.avanzada; }).slice(0, 60),
    diasParada: DIAS_PARADA,
    generado: b.generado
  };
}

// ---------------------------------------------------------------------------
// Acciones (escritura). Una a una y solo por un clic con confirmación.
// ---------------------------------------------------------------------------
function accionesActivas() { return process.env.NEGOCIO_ACCIONES === '1' && !!process.env.GHL_PANEL_API_KEY; }

async function escribir(metodo, ruta, cuerpo) {
  const r = await fetch(GHL + ruta, {
    method: metodo,
    headers: Object.assign(cab(process.env.GHL_PANEL_API_KEY), { 'Content-Type': 'application/json' }),
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('GHL ' + metodo + ' ' + ruta.split('?')[0].replace(/\/[A-Za-z0-9]{15,}/g, '/…') + ' → ' + r.status + ': ' + txt.slice(0, 160));
  try { return JSON.parse(txt); } catch (e) { return {}; }
}

async function camposRC() {
  return C.cacheado('ghl|camposRC', 60 * 60000, false, async function () {
    const d = await leer('/locations/' + encodeURIComponent(loc()) + '/customFields?model=contact');
    const out = {};
    (d.customFields || []).forEach(function (f) {
      if (f.fieldKey === 'contact.canal_de_origen_rc') out.canal = { id: f.id, opciones: f.picklistOptions || [] };
      if (f.fieldKey === 'contact.fecha_rc') out.fecha = { id: f.id };
    });
    return out;
  });
}

const ID = /^[A-Za-z0-9]{10,40}$/;
function txt(s, max) { return String(s || '').replace(/[\u0000-\u0008\u000b-\u001f]/g, '').trim().slice(0, max || 2000); }
function nota(contacto, texto) { return escribir('POST', '/contacts/' + contacto + '/notes', { body: '[Panel] ' + texto }); }

// Ejecuta una acción. Devuelve { ok, resumen } para el registro.
async function accion(a, usuario) {
  if (!accionesActivas()) throw Object.assign(new Error('Las acciones están apagadas (falta GHL_PANEL_API_KEY o NEGOCIO_ACCIONES=1).'), { status: 403 });
  const tipo = String(a.tipo || '');
  const contacto = String(a.contacto || '');
  if (!ID.test(contacto)) throw Object.assign(new Error('Contacto no válido.'), { status: 400 });
  const firma = ' (desde el panel, ' + usuario + ')';
  let resumen = '';

  if (tipo === 'mover') {
    const op = String(a.oportunidad || ''), etapa = String(a.etapa || ''), emb = String(a.embudo || '');
    if (!ID.test(op) || !ID.test(etapa) || !ID.test(emb)) throw Object.assign(new Error('Datos de la oportunidad no válidos.'), { status: 400 });
    const b = await base(false);
    const e = b.embudos.filter(function (x) { return x.id === emb; })[0];
    const s = e && e.etapas.filter(function (x) { return x.id === etapa; })[0];
    if (!s) throw Object.assign(new Error('Esa etapa no es de ese embudo.'), { status: 400 });
    await escribir('PUT', '/opportunities/' + op, { pipelineId: emb, pipelineStageId: etapa });
    resumen = 'Movida a «' + s.nombre + '» (' + e.nombre + ')';
    await nota(contacto, resumen + firma);
  } else if (tipo === 'nota') {
    const t = txt(a.texto, 3000);
    if (!t) throw Object.assign(new Error('La nota está vacía.'), { status: 400 });
    await nota(contacto, t + firma);
    resumen = 'Nota: ' + t.slice(0, 80);
  } else if (tipo === 'tarea') {
    const titulo = txt(a.titulo, 140), vence = String(a.vence || '');
    if (!titulo || !/^\d{4}-\d{2}-\d{2}$/.test(vence)) throw Object.assign(new Error('Falta el título o la fecha de la tarea.'), { status: 400 });
    // Título con «[Panel]» para no confundirla con las de api/seguimientos.js
    await escribir('POST', '/contacts/' + contacto + '/tasks', { title: '[Panel] ' + titulo, body: txt(a.detalle, 1000) + firma, dueDate: vence + 'T09:00:00+01:00', completed: false });
    resumen = 'Tarea «' + titulo + '» para el ' + vence;
  } else if (tipo === 'reunion') {
    const res = { celebrada: 'Reunión celebrada', 'no-presentado': 'No se presentó a la reunión', reprogramar: 'Reunión para reprogramar', cancelada: 'Reunión cancelada' }[String(a.resultado || '')];
    if (!res) throw Object.assign(new Error('Resultado de reunión no válido.'), { status: 400 });
    await nota(contacto, res + (a.texto ? ': ' + txt(a.texto, 1500) : '') + firma);
    resumen = res;
  } else if (tipo === 'rc') {
    const campos = await camposRC();
    if (!campos.canal || !campos.fecha) throw new Error('No encuentro los campos RC en GHL (contact.canal_de_origen_rc y contact.fecha_rc).');
    const canal = String(a.canal || ''), dia = String(a.fecha || '');
    if (campos.canal.opciones.indexOf(canal) < 0) throw Object.assign(new Error('Canal de origen RC no válido.'), { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dia)) throw Object.assign(new Error('Fecha RC no válida.'), { status: 400 });
    // Las tres cosas a la vez: etiqueta RC + canal + fecha
    await escribir('PUT', '/contacts/' + contacto, { customFields: [{ id: campos.canal.id, field_value: canal }, { id: campos.fecha.id, field_value: dia }] });
    await escribir('POST', '/contacts/' + contacto + '/tags', { tags: ['RC'] });
    resumen = 'Marcada RC · ' + canal + ' · ' + dia;
    await nota(contacto, resumen + firma);
  } else {
    throw Object.assign(new Error('Acción desconocida.'), { status: 400 });
  }
  C.borrarCache('ghl|base');
  return { ok: true, resumen: resumen };
}

async function opcionesRC() {
  try { const c = await camposRC(); return (c.canal && c.canal.opciones) || []; } catch (e) { return []; }
}

module.exports = { leads, crm, accion, accionesActivas, opcionesRC, base };
