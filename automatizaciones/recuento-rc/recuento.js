// Recuento semanal del plan de noviembre (2 clientes · 20 RC), para la Weekly de los lunes.
// Solo LEE de GHL de Qualivo. Sin datos personales: saca empresa y cifras.
//
//   GHL_API_KEY=… GHL_LOCATION_ID=… node automatizaciones/recuento-rc/recuento.js [AAAA-MM-DD] [--json]
//
// La fecha (opcional) es cualquier día de la semana a contar; por defecto, la semana pasada (lunes a
// domingo, hora de Madrid).
//   · RC por canal: contactos con la etiqueta «RC» cuya «Fecha RC» cae en la semana, agrupados por «Canal de
//     origen RC». Los RC sin fecha o sin canal salen aparte, para corregirlos en la ficha.
//   · Ofertas: oportunidades cuya última entrada de etapa en la semana es «Oferta enviada» (Prospección) o
//     «Propuesta enviada» (Qualivo Pipeline y ABM).
//   · Cierres: oportunidades marcadas como ganadas en la semana, o movidas a «Cliente» / «Cliente Activo».

const API = 'https://services.leadconnectorhq.com';
const KEY = process.env.GHL_API_KEY, LOC = process.env.GHL_LOCATION_ID;
const ETAPAS_OFERTA = /^(oferta enviada|propuesta enviada)$/i;
const ETAPAS_CIERRE = /^(cliente|cliente activo)$/i;
const CANALES = ['Reactivación', 'Meta', 'Referido/Partner', 'Clase', 'Outbound', 'Red personal', 'Contenido'];

async function ghl(metodo, ruta, cuerpo) {
  for (let i = 0; ; i++) {
    const r = await fetch(API + ruta, { method: metodo, body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      headers: { Authorization: 'Bearer ' + KEY, Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json' } });
    if (r.status === 429 && i < 3) { await new Promise((ok) => setTimeout(ok, 1500 * (i + 1))); continue; }
    const t = await r.text();
    if (!r.ok) throw new Error(metodo + ' ' + ruta.split('?')[0] + ' → ' + r.status + ' ' + t.slice(0, 200));
    return t ? JSON.parse(t) : {};
  }
}

// Lunes 00:00 a lunes siguiente 00:00 de Madrid, en ms
function semana(fecha) {
  const madrid = (ms) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })
    .formatToParts(new Date(ms)).reduce((a, x) => (a[x.type] = x.value, a), {});
  const dias = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  let ref = fecha ? Date.parse(fecha + 'T12:00:00Z') : Date.now() - 7 * 864e5;
  const p = madrid(ref);
  const lunes = new Date(Date.UTC(+p.year, +p.month - 1, +p.day - dias[p.weekday]));
  const aMs = (d) => { // medianoche de Madrid de la fecha UTC d
    const iso = d.toISOString().slice(0, 10);
    const off = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', timeZoneName: 'shortOffset' }).formatToParts(new Date(iso + 'T12:00:00Z')).find((x) => x.type === 'timeZoneName').value;
    const h = parseInt((off.match(/GMT([+-]\d+)/) || [0, 0])[1], 10);
    return Date.parse(iso + 'T00:00:00Z') - h * 3600e3;
  };
  const desde = aMs(lunes), hasta = aMs(new Date(lunes.getTime() + 7 * 864e5));
  return { desde, hasta, etiqueta: lunes.toISOString().slice(0, 10) };
}

async function contactosRC() {
  const out = []; let pagina = 1;
  for (;;) {
    const d = await ghl('POST', '/contacts/search', { locationId: LOC, page: pagina, pageLimit: 100, filters: [{ field: 'tags', operator: 'contains', value: 'RC' }] });
    const cs = d.contacts || [];
    out.push(...cs);
    if (cs.length < 100) return out;
    pagina++;
  }
}

async function oportunidades() {
  const out = []; let url = '/opportunities/search?location_id=' + LOC + '&limit=100';
  for (let n = 0; url && n < 50; n++) {
    const d = await ghl('GET', url);
    out.push(...(d.opportunities || []));
    const m = d.meta || {};
    url = m.nextPageUrl ? m.nextPageUrl.replace(API, '') : null;
    if ((d.opportunities || []).length < 100) url = null;
  }
  return out;
}

async function recuento(fecha) {
  if (!KEY || !LOC) throw new Error('Faltan GHL_API_KEY y GHL_LOCATION_ID');
  const s = semana(fecha);
  const enSemana = (v) => { const t = Date.parse(v); return t >= s.desde && t < s.hasta; };

  const campos = (await ghl('GET', '/locations/' + LOC + '/customFields?model=contact')).customFields || [];
  const idCanal = (campos.find((f) => f.fieldKey === 'contact.canal_de_origen_rc') || {}).id;
  const idFecha = (campos.find((f) => f.fieldKey === 'contact.fecha_rc') || {}).id;
  const valor = (c, id) => ((c.customFields || []).find((x) => x.id === id) || {}).value;

  const rc = { porCanal: Object.fromEntries(CANALES.map((k) => [k, 0])), sinCanal: 0, sinFecha: [], total: 0, empresas: [] };
  for (const c of await contactosRC()) {
    const f = valor(c, idFecha);
    if (!f) { rc.sinFecha.push(c.companyName || '(sin empresa)'); continue; }
    if (!enSemana(f)) continue;
    const canal = valor(c, idCanal);
    if (canal && rc.porCanal[canal] !== undefined) rc.porCanal[canal]++; else rc.sinCanal++;
    rc.total++; rc.empresas.push((c.companyName || '(sin empresa)') + (canal ? ' · ' + canal : ''));
  }

  const pipes = (await ghl('GET', '/opportunities/pipelines?locationId=' + LOC)).pipelines || [];
  const etapa = {}; pipes.forEach((p) => (p.stages || []).forEach((st) => { etapa[st.id] = { nombre: st.name, pipe: p.name }; }));
  const ofertas = [], cierres = [];
  for (const o of await oportunidades()) {
    const e = etapa[o.pipelineStageId] || {};
    const empresa = (o.contact && o.contact.companyName) || o.name && o.name.split('·')[0].trim() || '(sin empresa)';
    if (ETAPAS_OFERTA.test(e.nombre || '') && enSemana(o.lastStageChangeAt)) ofertas.push(empresa + ' · ' + e.pipe);
    const ganada = o.status === 'won' && enSemana(o.lastStatusChangeAt);
    const aCliente = ETAPAS_CIERRE.test(e.nombre || '') && enSemana(o.lastStageChangeAt);
    if (ganada || aCliente) cierres.push(empresa + ' · ' + e.pipe);
  }
  return { semana: s.etiqueta, rc, ofertas, cierres };
}

function texto(r) {
  const l = [];
  l.push('Semana del ' + r.semana + ' (lunes a domingo, hora de Madrid) · fuente: GHL de Qualivo [C]');
  l.push('RC: ' + r.rc.total + ' · ' + Object.entries(r.rc.porCanal).map(([k, v]) => k + ' ' + v).join(' · ') + (r.rc.sinCanal ? ' · sin canal ' + r.rc.sinCanal : ''));
  if (r.rc.empresas.length) l.push('  ' + r.rc.empresas.join(' | '));
  if (r.rc.sinFecha.length) l.push('⚠ RC sin «Fecha RC» (no cuentan; poner la fecha en la ficha): ' + r.rc.sinFecha.join(' | '));
  l.push('Ofertas enviadas: ' + r.ofertas.length + (r.ofertas.length ? ' · ' + r.ofertas.join(' | ') : ''));
  l.push('Cierres: ' + r.cierres.length + (r.cierres.length ? ' · ' + r.cierres.join(' | ') : ''));
  return l.join('\n');
}

if (require.main === module) {
  const fecha = process.argv.slice(2).find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
  recuento(fecha).then((r) => console.log(process.argv.includes('--json') ? JSON.stringify(r, null, 1) : texto(r)))
    .catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
}
module.exports = { recuento, semana, texto };
