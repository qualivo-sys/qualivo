// Cuadro de mando semanal de Qualivo (ritual del viernes, 22-sep-2026).
//
// Saca de Meta, del CRM (GHL) y de Vapi las cifras de una semana y las imprime
// como tabla Markdown y como JSON. No escribe en ningún sitio. Lo lanza el
// agente de operaciones cada viernes a primera hora (o a mano):
//
//   GHL_API_KEY=… GHL_LOCATION_ID=… VAPI_API_KEY=… META_ADS_TOKEN=… \
//   node herramientas/revision-semanal.js [--desde 2026-09-15] [--hasta 2026-09-21] [--json]
//
// Sin fechas: la semana natural anterior (lunes a domingo) si hoy es lunes, o la
// semana en curso desde el lunes hasta hoy el resto de días. Todo en hora de
// Madrid. Las métricas siguen el embudo que pidió Maikel: leads →
// conversaciones → reuniones → diagnósticos → propuestas → pilotos → clientes,
// y el coste por lead y por reunión por vertical.

const A = require('../api/_activacion');
const T = require('../api/_tratos.js');

const ZONA = 'Europe/Madrid';
const CUENTA_META = process.env.META_AD_ACCOUNT || 'act_3453332464718877';
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';

function arg(nombre) { const i = process.argv.indexOf('--' + nombre); return i > -1 ? process.argv[i + 1] : ''; }
function fechaMadrid(d) { return new Intl.DateTimeFormat('sv-SE', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d); }
function inicioDia(iso) { return Date.parse(iso + 'T00:00:00+02:00'); }
function finDia(iso) { return Date.parse(iso + 'T23:59:59+02:00'); }

function rangoPorDefecto() {
  const hoy = new Date();
  const dow = new Date(fechaMadrid(hoy) + 'T12:00:00Z').getUTCDay(); // 0 dom … 6 sáb
  const lunesOffset = (dow + 6) % 7;
  const lunes = new Date(hoy.getTime() - lunesOffset * 86400000);
  if (dow === 1) { // lunes: semana anterior completa
    const l = new Date(lunes.getTime() - 7 * 86400000);
    return { desde: fechaMadrid(l), hasta: fechaMadrid(new Date(l.getTime() + 6 * 86400000)) };
  }
  return { desde: fechaMadrid(lunes), hasta: fechaMadrid(hoy) };
}

function sectorDe(c) {
  const t = (c.tags || []).map(String).filter(function (x) { return x.startsWith('sector-'); }).sort(function (a, b) { return a.length - b.length; })[0] || '';
  const s = t.slice(7);
  if (/reforma|construcc/.test(s)) return 'Reformas';
  if (/formaci|academia/.test(s)) return 'Formación';
  if (/clinic|salud|dental/.test(s)) return 'Clínicas';
  if (/asesor|gestor/.test(s)) return 'Asesorías';
  return s ? 'Otro' : 'Sin sector';
}

async function meta(desde, hasta) {
  const token = process.env.META_ADS_TOKEN;
  if (!token) return { nota: 'sin META_ADS_TOKEN' };
  const u = new URL('https://graph.facebook.com/v21.0/' + CUENTA_META + '/insights');
  u.searchParams.set('fields', 'campaign_name,spend,impressions,clicks,actions');
  u.searchParams.set('level', 'campaign');
  u.searchParams.set('time_range', JSON.stringify({ since: desde, until: hasta }));
  u.searchParams.set('access_token', token);
  const r = await fetch(u); const d = await r.json();
  if (d.error) return { nota: 'meta: ' + d.error.message };
  const campanas = (d.data || []).map(function (x) {
    const acts = {}; (x.actions || []).forEach(function (a) { acts[a.action_type] = Number(a.value); });
    return { campana: x.campaign_name, gasto: Number(x.spend || 0), leads: acts.lead || 0, clics: Number(x.clicks || 0) };
  });
  const gasto = campanas.reduce(function (a, c) { return a + c.gasto; }, 0);
  const leads = campanas.reduce(function (a, c) { return a + c.leads; }, 0);
  return { gasto: Math.round(gasto * 100) / 100, leadsMeta: leads, campanas: campanas };
}

async function crm(desdeMs, hastaMs) {
  const paid = await A.buscarPorEtiqueta('paid', 1500);
  const semana = paid.filter(function (c) { const t = Date.parse(c.dateAdded); return t >= desdeMs && t <= hastaMs; });
  const porSector = {};
  semana.forEach(function (c) { const s = sectorDe(c); porSector[s] = porSector[s] || { leads: 0, contestaron: 0, hablaron: 0, cita: 0 }; porSector[s].leads++;
    if (A.tiene(c, 'act-respondio')) porSector[s].contestaron++;
    if (A.tiene(c, 'voz-completada')) porSector[s].hablaron++;
    if (A.tiene(c, 'act-agendado') || A.tiene(c, 'act-cita-confirmada')) porSector[s].cita++; });
  const conversaciones = semana.filter(function (c) { return A.tiene(c, 'act-respondio') || A.tiene(c, 'voz-completada'); }).length;
  const bajas = semana.filter(function (c) { return A.tiene(c, 'act-baja'); }).length;

  const loc = encodeURIComponent(process.env.GHL_LOCATION_ID);
  const r = await fetch(A.GHL_BASE + '/calendars/events?locationId=' + loc + '&userId=' + USUARIO_MAIKEL + '&startTime=' + desdeMs + '&endTime=' + hastaMs, { headers: A.cabeceras() });
  const d = r.ok ? await r.json() : {};
  const eventos = (d.events || []).filter(function (e) { return e.contactId; });
  const citas = { total: eventos.length, hechas: 0, noShow: 0, canceladas: 0, pendientes: 0, lista: [] };
  eventos.forEach(function (e) {
    const st = String(e.appointmentStatus || '').toLowerCase();
    if (/cancel|invalid/.test(st)) citas.canceladas++;
    else if (/noshow/.test(st)) citas.noShow++;
    else if (/showed/.test(st) || Date.parse(e.startTime) < Date.now()) citas.hechas++;
    else citas.pendientes++;
    citas.lista.push((e.startTime || '').slice(0, 16) + ' · ' + (e.title || '') + ' · ' + (e.appointmentStatus || ''));
  });

  // Oportunidades: movimientos de etapa en la semana
  const ops = []; let url = A.GHL_BASE + '/opportunities/search?location_id=' + loc + '&pipeline_id=' + T.PIPELINE + '&limit=100';
  for (let p = 0; p < 5 && url; p++) { const rr = await fetch(url, { headers: A.cabeceras() }); const dd = await rr.json(); ops.push.apply(ops, dd.opportunities || []); url = dd.meta && dd.meta.nextPageUrl && (dd.opportunities || []).length === 100 ? dd.meta.nextPageUrl : null; }
  const inv = {}; Object.keys(T.ETAPAS).forEach(function (k) { inv[T.ETAPAS[k]] = k; });
  const movidas = ops.filter(function (o) { const t = Date.parse(o.lastStageChangeAt || 0); return t >= desdeMs && t <= hastaMs; });
  const cuenta = function (etapa) { return movidas.filter(function (o) { return inv[o.pipelineStageId] === etapa; }); };
  const propuestas = cuenta('oferta'), clientes = cuenta('cliente'), reuniones = cuenta('reunion');
  const pilotos = ops.filter(function (o) { return /piloto/i.test(o.name || '') && Date.parse(o.updatedAt || 0) >= desdeMs; });
  const cartera = {}; ops.filter(function (o) { return o.status === 'open'; }).forEach(function (o) { const k = inv[o.pipelineStageId] || '?'; cartera[k] = (cartera[k] || 0) + 1; });
  const valorPropuestas = ops.filter(function (o) { return inv[o.pipelineStageId] === 'oferta' && o.status === 'open'; }).reduce(function (a, o) { return a + (o.monetaryValue || 0); }, 0);

  return { leads: semana.length, conversaciones: conversaciones, bajas: bajas, porSector: porSector, citas: citas,
    reunionesNuevas: reuniones.map(function (o) { return o.name; }), propuestas: propuestas.map(function (o) { return o.name + (o.monetaryValue ? ' (' + o.monetaryValue + ' €)' : ''); }),
    pilotos: pilotos.map(function (o) { return o.name; }), clientes: clientes.map(function (o) { return o.name; }), cartera: cartera, valorPropuestasAbiertas: valorPropuestas };
}

async function vapi(desdeMs, hastaMs) {
  if (!process.env.VAPI_API_KEY) return { nota: 'sin VAPI_API_KEY' };
  const r = await fetch('https://api.vapi.ai/call?limit=1000&createdAtGt=' + new Date(desdeMs).toISOString(), { headers: { Authorization: 'Bearer ' + process.env.VAPI_API_KEY } });
  const all = await r.json();
  if (!Array.isArray(all)) return { nota: 'vapi: ' + JSON.stringify(all).slice(0, 120) };
  const calls = all.filter(function (c) { const t = Date.parse(c.createdAt); return c.type === 'outboundPhoneCall' && t >= desdeMs && t <= hastaMs; });
  const dur = function (c) { return c.endedAt && c.startedAt ? (Date.parse(c.endedAt) - Date.parse(c.startedAt)) / 1000 : 0; };
  return { llamadas: calls.length, numeros: new Set(calls.map(function (c) { return c.customer && c.customer.number; })).size,
    conversaciones: calls.filter(function (c) { return dur(c) >= 30; }).length, largas: calls.filter(function (c) { return dur(c) >= 120; }).length,
    buzon: calls.filter(function (c) { return /voicemail/.test(c.endedReason || ''); }).length,
    minutos: Math.round(calls.reduce(function (a, c) { return a + dur(c); }, 0) / 60), coste: Math.round(calls.reduce(function (a, c) { return a + (c.cost || 0); }, 0) * 100) / 100 };
}

async function main() {
  const rango = { desde: arg('desde') || rangoPorDefecto().desde, hasta: arg('hasta') || rangoPorDefecto().hasta };
  const desdeMs = inicioDia(rango.desde), hastaMs = finDia(rango.hasta);
  const [m, c, v] = await Promise.all([meta(rango.desde, rango.hasta), crm(desdeMs, hastaMs), vapi(desdeMs, hastaMs)]);
  const cpl = m.gasto && c.leads ? Math.round(m.gasto / c.leads * 100) / 100 : null;
  const reunionesSemana = c.citas.hechas + c.citas.pendientes;
  const cpr = m.gasto && reunionesSemana ? Math.round(m.gasto / reunionesSemana * 100) / 100 : null;
  const salida = { semana: rango, meta: m, crm: c, vapi: v, cpl: cpl, costePorReunion: cpr };
  if (process.argv.includes('--json')) { console.log(JSON.stringify(salida, null, 1)); return; }

  const f = function (x) { return x == null ? '—' : x; };
  console.log('Semana ' + rango.desde + ' → ' + rango.hasta + '\n');
  console.log('| Métrica | Semana |\n|---|---|');
  console.log('| Gasto Meta | ' + (m.gasto != null ? m.gasto + ' €' : m.nota) + ' |');
  console.log('| Leads (CRM, paid) | ' + c.leads + (m.leadsMeta != null ? ' (Meta dice ' + m.leadsMeta + ')' : '') + ' |');
  console.log('| Coste por lead | ' + (cpl != null ? cpl + ' €' : '—') + ' |');
  console.log('| Conversaciones (contestó WA o habló con Raquel) | ' + c.conversaciones + ' |');
  console.log('| Reuniones en calendario | ' + c.citas.total + ' (hechas ' + c.citas.hechas + ', pendientes ' + c.citas.pendientes + ', no vino ' + c.citas.noShow + ', canceladas ' + c.citas.canceladas + ') |');
  console.log('| Coste por reunión | ' + (cpr != null ? cpr + ' €' : '—') + ' |');
  console.log('| Diagnósticos hechos | ' + c.citas.hechas + ' |');
  console.log('| Propuestas enviadas | ' + c.propuestas.length + (c.propuestas.length ? ': ' + c.propuestas.join('; ') : '') + ' |');
  console.log('| Pilotos tocados | ' + c.pilotos.length + (c.pilotos.length ? ': ' + c.pilotos.join('; ') : '') + ' |');
  console.log('| Clientes nuevos | ' + c.clientes.length + (c.clientes.length ? ': ' + c.clientes.join('; ') : '') + ' |');
  console.log('| Bajas | ' + c.bajas + ' |');
  if (!v.nota) console.log('| Llamadas de Raquel | ' + v.llamadas + ' a ' + v.numeros + ' números · ' + v.conversaciones + ' con conversación · ' + v.buzon + ' buzón · ' + v.minutos + ' min · ' + v.coste + ' $ |');
  else console.log('| Llamadas de Raquel | ' + v.nota + ' |');
  console.log('\nPor vertical (leads · contestaron · hablaron con Raquel · con cita):');
  Object.keys(c.porSector).forEach(function (s) { const x = c.porSector[s]; console.log('- ' + s + ': ' + x.leads + ' · ' + x.contestaron + ' · ' + x.hablaron + ' · ' + x.cita); });
  if (m.campanas) { console.log('\nCampañas (gasto · leads Meta):'); m.campanas.forEach(function (k) { console.log('- ' + k.campana + ': ' + k.gasto + ' € · ' + k.leads); }); }
  console.log('\nCartera abierta por etapa: ' + JSON.stringify(c.cartera) + ' · propuestas abiertas: ' + c.valorPropuestasAbiertas + ' €');
  console.log('\nReuniones de la semana:\n' + (c.citas.lista.join('\n') || '(ninguna)'));
}

main().catch(function (e) { console.error('ERROR', e && e.message); process.exit(1); });
