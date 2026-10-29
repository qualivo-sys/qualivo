// Al Milímetro: la subcuenta de GoHighLevel de Sonia (agencia de Qualivo, decisión del 29-oct a las 13:58).
// La usan api/al-milimetro-lead.js (escribe el lead) e api/intelligence-almilimetro.js (lee el pipeline).
// Los WhatsApp y emails los lanzan los workflows de GHL con las etiquetas que se ponen aquí. Campos y etiquetas son
// los genéricos de la plantilla «Reformas v1» (los crea Automatización con ghl-alta-subcuenta.js);
// el WhatsApp sale por Wazzap desde el número de Sonia.
//
// Variables: AM_GHL_API_KEY (token privado de la subcuenta) · AM_GHL_LOCATION_ID
//            AM_GHL_PIPELINE_ID (opcional; si falta: el pipeline que se llame «Al Milímetro» o «Reformas»,
//            o el único que haya)

const M = require('./_am-modelo.js');
const GHL = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';

let cacheCampos = null, cachePipeline = null;

function configurada() { return !!(process.env.AM_GHL_API_KEY && process.env.AM_GHL_LOCATION_ID); }

async function ghl(metodo, ruta, cuerpo) {
  for (let intento = 0; ; intento++) {
    const ctl = new AbortController(); const t = setTimeout(function () { ctl.abort(); }, 12000);
    let r;
    try {
      r = await fetch(GHL + ruta, {
        method: metodo, signal: ctl.signal, body: cuerpo ? JSON.stringify(cuerpo) : undefined,
        headers: { Authorization: 'Bearer ' + process.env.AM_GHL_API_KEY, Version: VERSION, 'Content-Type': 'application/json', Accept: 'application/json' }
      });
    } finally { clearTimeout(t); }
    // GHL deja 100 llamadas cada 10 segundos: si nos pasamos, esperar y repetir
    if (r.status === 429 && intento < 3) { await new Promise(function (ok) { setTimeout(ok, 1200 * (intento + 1)); }); continue; }
    const txt = await r.text();
    if (!r.ok) throw new Error('GHL ' + metodo + ' ' + ruta.split('?')[0] + ' → ' + r.status + ' ' + txt.slice(0, 300));
    return txt ? JSON.parse(txt) : {};
  }
}
const loc = function () { return encodeURIComponent(process.env.AM_GHL_LOCATION_ID); };

// Campos personalizados por su clave («contact.obra_tipo» → id), leídos una vez por instancia
async function campos() {
  if (cacheCampos) return cacheCampos;
  const d = await ghl('GET', '/locations/' + loc() + '/customFields?model=contact');
  const m = { porClave: {}, porId: {} };
  (d.customFields || []).forEach(function (f) { const k = String(f.fieldKey || '').replace(/^contact\./, ''); m.porClave[k] = f.id; m.porId[f.id] = k; });
  cacheCampos = m;
  return m;
}
async function pipeline() {
  if (cachePipeline) return cachePipeline;
  const d = await ghl('GET', '/opportunities/pipelines?locationId=' + loc());
  const ps = d.pipelines || [];
  let p = ps.filter(function (x) { return process.env.AM_GHL_PIPELINE_ID ? x.id === process.env.AM_GHL_PIPELINE_ID : /al mil[ií]metro|reformas/i.test(x.name); });
  if (!process.env.AM_GHL_PIPELINE_ID && p.length !== 1 && ps.length === 1) p = ps;
  if (p.length !== 1) throw new Error('Pipeline de Al Milímetro: se esperaba 1 y hay ' + p.length + ' (pon AM_GHL_PIPELINE_ID)');
  const etapas = {}; (p[0].stages || []).forEach(function (s) { etapas[String(s.name).trim().toLowerCase()] = s.id; });
  cachePipeline = { id: p[0].id, nombre: p[0].name, etapas: etapas, stages: p[0].stages || [] };
  return cachePipeline;
}

// Escribe el lead: contacto (sin pisar sus etiquetas), campos, etiquetas, oportunidad en «Nuevo» y nota.
// L: lead ya validado y puntuado (M.vista) · origen: pared|chalet|precio|portal|web
async function escribirLead(L, sc, extra) {
  const ids = (await campos()).porClave;
  const valores = {
    obra_tipo: M.OPCIONES.tipo[L.tipo], obra_texto: M.TIPO_TEXTO[L.tipo] || 'tu casa', codigo_postal: L.cp, zona: L.mun || L.cp,
    metros: M.OPCIONES.m2[L.m2] || '', cuando: M.OPCIONES.cuando[L.cuando] || '', presupuesto: M.OPCIONES.ppto[L.ppto] || '',
    vivienda_propia: M.OPCIONES.propia[L.propia] || '', clase: sc.clase, puntos: sc.puntos,
    origen: M.OPCIONES.origen[L.origen], revision: L.revision ? 'Sí' : 'No', precio_desde: M.DESDE[L.tipo] || '',
    instalaciones: M.OPCIONES.inst[L.inst] || '', que_cambiar: L.frase || ''
  };
  const faltan = Object.keys(valores).filter(function (k) { return !ids[k]; });
  if (faltan.length) console.error('[am-ghl] Faltan campos (los crea ghl-alta-subcuenta.js de Automatización):', faltan.join(', '));
  const customFields = Object.keys(valores).filter(function (k) { return ids[k] && valores[k] !== ''; }).map(function (k) { return { id: ids[k], field_value: valores[k] }; });

  // Sin «tags» en el upsert: si el contacto ya existía, GHL sustituiría sus etiquetas. Se suman después.
  const up = await ghl('POST', '/contacts/upsert', {
    locationId: process.env.AM_GHL_LOCATION_ID, firstName: L.nombre, phone: L.telefono, email: L.email || undefined,
    source: 'Landing Al Milímetro · ' + M.OPCIONES.origen[L.origen], customFields: customFields
  });
  const contactId = up && up.contact && up.contact.id;
  if (!contactId) throw new Error('upsert sin id');

  // El orden importa: los workflows se disparan con «nuevo» y miran ya las demás etiquetas
  // Etiquetas genéricas de la plantilla «Reformas v1» de la agencia (29-oct). «nuevo» dispara el workflow del
  // primer contacto y va la última, en otra llamada, para que las demás ya estén puestas.
  const tags = ['clase-' + sc.clase.toLowerCase(), 'origen-' + L.origen].concat(L.revision ? ['revision'] : []).concat(L.prueba ? ['prueba'] : []);
  await ghl('POST', '/contacts/' + contactId + '/tags', { tags: tags });
  await ghl('POST', '/contacts/' + contactId + '/tags', { tags: ['nuevo'] });

  try {
    const p = await pipeline();
    const nuevo = p.etapas.nuevo || (p.stages[0] && p.stages[0].id);
    await ghl('POST', '/opportunities/', {
      locationId: process.env.AM_GHL_LOCATION_ID, pipelineId: p.id, pipelineStageId: nuevo, contactId: contactId, status: 'open',
      name: (L.prueba ? '[PRUEBA] ' : '') + L.nombre + ' · ' + M.OPCIONES.tipo[L.tipo] + ' · ' + (L.mun || L.cp)
    });
  } catch (e) { console.error('[am-ghl] Oportunidad no creada:', e.message); }

  const nota = [
    'Formulario «Calcula tu reforma» · ' + new Date().toISOString(),
    'Clase ' + sc.clase + ' · ' + sc.puntos + ' puntos (' + sc.motivos.join(', ') + ')' + (L.revision ? ' · pasa por segundas preguntas' : ''),
    'Obra: ' + M.OPCIONES.tipo[L.tipo] + ' · ' + (M.OPCIONES.m2[L.m2] || '—') + ' · ' + (L.mun || '') + ' (' + L.cp + ')',
    'Cuándo: ' + (M.OPCIONES.cuando[L.cuando] || '—') + ' · Presupuesto: ' + (M.OPCIONES.ppto[L.ppto] || '—') + ' · Vivienda propia: ' + (M.OPCIONES.propia[L.propia] || '—'),
    L.inst ? 'Instalaciones: ' + M.OPCIONES.inst[L.inst] : '',
    L.frase ? 'Qué quiere cambiar: ' + L.frase : '',
    'Origen: ' + M.OPCIONES.origen[L.origen] + (extra && extra.municipio ? ' · municipio del anuncio: ' + extra.municipio : '') + (extra && extra.utm ? ' · ' + extra.utm : ''),
    'Consentimiento: sí'
  ].filter(Boolean).join('\n');
  try { await ghl('POST', '/contacts/' + contactId + '/notes', { body: nota }); } catch (e) { console.error('[am-ghl] Nota no creada:', e.message); }
  return contactId;
}

// Para Intelligence: oportunidades del pipeline con la ficha de cada contacto. SOLO LECTURA.
const ETAPA_IDX = { 'nuevo': 1, 'contactado': 2, 'visita técnica': 3, 'presupuesto enviado': 4, 'seguimiento': 5, 'firmado': 6, 'perdido': 4 };
const VALOR = { 'Menos de 15.000 €': 12000, '15.000-30.000 €': 22000, '30.000-60.000 €': 45000, '60.000-160.000 €': 100000, 'Más de 160.000 €': 180000, 'Todavía no lo sé': 27500 };
const ORIGEN_ID = {}; Object.keys(M.OPCIONES.origen).forEach(function (k) { ORIGEN_ID[M.OPCIONES.origen[k]] = k; });
function corto(n) {
  const p = String(n || '').replace(/prueba qualivo/i, '').trim().split(/\s+/).filter(Boolean);
  if (!p.length) return 'Sin nombre';
  return p[0].charAt(0).toUpperCase() + p[0].slice(1).toLowerCase() + (p[1] ? ' ' + p[1].charAt(0).toUpperCase() + '.' : '');
}
async function leerTablero() {
  const p = await pipeline();
  const nombreEtapa = {}; p.stages.forEach(function (s) { nombreEtapa[s.id] = String(s.name).trim(); });
  const ops = [];
  for (let pagina = 1; pagina <= 5; pagina++) {
    const d = await ghl('GET', '/opportunities/search?location_id=' + loc() + '&pipeline_id=' + p.id + '&limit=100&page=' + pagina);
    (d.opportunities || []).forEach(function (o) { ops.push(o); });
    if (!d.opportunities || d.opportunities.length < 100) break;
  }
  const porId = (await campos()).porId;
  const fichas = {};
  const ids = Array.from(new Set(ops.map(function (o) { return o.contactId || (o.contact && o.contact.id); }).filter(Boolean)));
  for (let i = 0; i < ids.length; i += 5) {
    await Promise.all(ids.slice(i, i + 5).map(function (id) {
      return ghl('GET', '/contacts/' + id).then(function (d) { fichas[id] = d.contact || {}; }).catch(function () { fichas[id] = {}; });
    }));
  }
  const contactos = ops.map(function (o) {
    const cid = o.contactId || (o.contact && o.contact.id), c = fichas[cid] || {};
    const v = {}; (c.customFields || []).forEach(function (x) { if (porId[x.id]) v[porId[x.id]] = x.value; });
    const et = nombreEtapa[o.pipelineStageId] || '';
    return {
      id: o.id, n: corto(c.firstName || (o.contact && o.contact.name) || o.name), etapaNombre: et, etapa: ETAPA_IDX[et.toLowerCase()] || 1,
      fin: o.status === 'won' || /^firmado$/i.test(et) ? 'ganado' : o.status === 'lost' || /^perdido$/i.test(et) ? 'perdido' : null,
      clase: v.clase || '', puntos: Number(v.puntos || 0), origen: ORIGEN_ID[v.origen] || 'web',
      tipo: v.obra_tipo || '', zona: v.zona || '', cp: v.codigo_postal || '', metros: v.metros || '', cuando: v.cuando || '',
      presupuesto: v.presupuesto || '', revision: v.revision === 'Sí', prueba: (c.tags || []).indexOf('prueba') > -1,
      valor: Number(o.monetaryValue) || VALOR[v.presupuesto] || 27500,
      creado: Date.parse(o.createdAt || c.dateAdded) || Date.now(), cambio: Date.parse(o.lastStageChangeAt || o.updatedAt) || null
    };
  });
  return { generado: Date.now(), fuente: 'ghl', etapas: p.stages.map(function (s) { return s.name; }), contactos: contactos };
}

module.exports = { configurada: configurada, escribirLead: escribirLead, leerTablero: leerTablero, _reiniciar: function () { cacheCampos = null; cachePipeline = null; } };
