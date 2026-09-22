// Seguidores nuevos de Instagram → lista cualificada para el setter manual (Maikel, 22-sep-2026).
//
// Cada mañana: saca los seguidores de @qualivo con Apify (sin login), los
// compara con los de ayer, enriquece a los nuevos (bio, categoría, web,
// seguidores) y deja en la hoja «Puntuación de leads Qualivo», pestaña
// «Instagram», una fila por seguidor nuevo con letra (A/B/descartar), motivo y
// un primer mensaje escrito para que Maikel lo mande desde el móvil. NUNCA
// manda mensajes: solo lee y propone.
//
//   APIFY_TOKEN=… GOOGLE_SA_JSON=… node herramientas/seguidores-instagram.js [--cuenta qualivo] [--seco]
//
// Estado entre días: herramientas/.estado/seguidores-<cuenta>.json (no se sube al repo).

const fs = require('fs');
const path = require('path');

const CUENTA = arg('cuenta') || 'qualivo';
const SECO = process.argv.includes('--seco');
const TOKEN = process.env.APIFY_TOKEN;
const HOJA = process.env.SCORING_SHEET_ID || '158tKmIYVhAvrmJEeAU404bIztALIc7JoNZVAk2Pkt6s';
const ACTOR_SEGUIDORES = process.env.APIFY_ACTOR_SEGUIDORES || 'scraping_solutions~instagram-scraper-followers-following-no-cookies';
const ULTIMOS = Number(arg('ultimos') || 0); // primera pasada: cualificar también los N más recientes
const ACTOR_PERFIL = 'apify~instagram-profile-scraper';
const DIR_ESTADO = path.join(__dirname, '.estado');
const FICHERO = path.join(DIR_ESTADO, 'seguidores-' + CUENTA + '.json');

function arg(n) { const i = process.argv.indexOf('--' + n); return i > -1 ? process.argv[i + 1] : ''; }

async function apify(actor, input) {
  const r = await fetch('https://api.apify.com/v2/acts/' + actor + '/run-sync-get-dataset-items?token=' + TOKEN + '&timeout=300&format=json&clean=true', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input)
  });
  if (!r.ok) throw new Error('apify ' + actor + ' ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json();
}

function usuarioDe(x) { return String(x.username || x.userName || x.handle || x.ownerUsername || '').replace('@', '').toLowerCase(); }

// Cualificación sencilla a partir de la bio: negocio o no, vertical, tamaño.
function cualificar(p) {
  const bio = ((p.biography || p.bio || '') + ' ' + (p.businessCategoryName || p.category || '') + ' ' + (p.fullName || '')).toLowerCase();
  const web = p.externalUrl || p.website || '';
  const seg = Number(p.followersCount || p.followers || 0);
  const esNegocio = !!(p.isBusinessAccount || p.businessCategoryName || web);
  let vertical = '';
  if (/cl[ií]nica|dental|dentist|fisio|est[eé]tica|medic|salud|odont/.test(bio)) vertical = 'Clínicas';
  else if (/academia|formaci|escuela|curso|oposici|idiomas|educa/.test(bio)) vertical = 'Formación';
  else if (/reforma|construcci|obra|interior|cocina|baño|arquitect/.test(bio)) vertical = 'Reformas';
  else if (/asesor|gestor|abogad|laboral|fiscal|contab/.test(bio)) vertical = 'Asesorías';
  else if (/agencia|marketing|\bads\b|growth|funnel|automatiz|\bia\b|coach|consultor/.test(bio)) vertical = 'Agencia / marketing (no cliente)';
  const motivos = [];
  let letra = 'descartar';
  if (vertical && !/no cliente/.test(vertical)) { letra = esNegocio || web ? 'A' : 'B'; motivos.push(vertical); }
  else if (esNegocio) { letra = 'B'; motivos.push('negocio sin vertical clara'); }
  if (/no cliente/.test(vertical)) { letra = 'descartar'; motivos.push('es del sector'); }
  if (seg > 50000) { letra = letra === 'A' ? 'B' : letra; motivos.push('cuenta muy grande'); }
  if (p.isPrivate || p.private) { motivos.push('cuenta privada'); if (letra === 'A') letra = 'B'; }
  return { letra: letra, vertical: vertical, esNegocio: esNegocio, motivo: motivos.join(' · ') || 'sin señales de negocio' };
}

function mensaje(p, q) {
  const nombre = String(p.fullName || p.username || '').split(' ')[0] || '';
  const hola = nombre ? 'Hola ' + nombre + ', gracias por seguirme.' : 'Gracias por seguirme.';
  const negocio = p.fullName && p.username && p.fullName.toLowerCase() !== p.username.toLowerCase() ? p.fullName : '';
  const preguntas = {
    'Clínicas': '¿Cómo os llegan hoy la mayoría de los pacientes nuevos, por recomendación o por Google?',
    'Formación': '¿Cuántas consultas de gente interesada os entran al mes, más o menos, y quién las contesta?',
    'Reformas': '¿Cuántos presupuestos dais al mes y quién hace el seguimiento después?',
    'Asesorías': '¿Cómo os llegan los clientes nuevos ahora mismo, por recomendación o hacéis algo activo?'
  };
  const pregunta = preguntas[q.vertical] || '¿A qué os dedicáis exactamente? Te lo pregunto para no hacerte perder el tiempo.';
  return hola + (negocio ? ' He visto ' + negocio + (q.vertical ? ' (' + q.vertical.toLowerCase() + ')' : '') + '.' : '') + ' ' + pregunta;
}

async function hoja(filas) {
  if (!process.env.GOOGLE_SA_JSON) { console.log('(sin GOOGLE_SA_JSON: no se escribe la hoja)'); return; }
  const G = require('../api/_google');
  const cab = ['Fecha', 'Letra', 'Usuario', 'Nombre', 'Vertical', 'Negocio', 'Seguidores', 'Web', 'Bio', 'Motivo', 'Mensaje propuesto', 'Enviado (sí/no)', 'Respondió'];
  const tab = 'Instagram';
  try { await G.sheets('GET', HOJA + '/values/' + encodeURIComponent("'" + tab + "'!A1:A1")); }
  catch (e) { await G.sheets('POST', HOJA + ':batchUpdate', { requests: [{ addSheet: { properties: { title: tab } } }] }); await G.sheets('PUT', HOJA + '/values/' + encodeURIComponent("'" + tab + "'!A1") + '?valueInputOption=RAW', { values: [cab] }); }
  await G.sheets('POST', HOJA + '/values/' + encodeURIComponent("'" + tab + "'!A1") + ':append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS', { values: filas });
}

async function main() {
  if (!TOKEN) throw new Error('falta APIFY_TOKEN');
  if (!fs.existsSync(DIR_ESTADO)) fs.mkdirSync(DIR_ESTADO);
  const antes = fs.existsSync(FICHERO) ? JSON.parse(fs.readFileSync(FICHERO)) : { usuarios: [], fecha: null };
  const items = await apify(ACTOR_SEGUIDORES, { Account: [CUENTA], resultsLimit: Number(process.env.APIFY_MAX_SEGUIDORES || 3000), dataToScrape: 'Followers' });
  const ahora = items.map(usuarioDe).filter(Boolean);
  let nuevos = antes.fecha ? ahora.filter(function (u) { return antes.usuarios.indexOf(u) === -1; }) : [];
  if (!antes.fecha && ULTIMOS) nuevos = ahora.slice(0, ULTIMOS); // la lista viene con los más recientes primero
  console.log('seguidores: ' + ahora.length + ' · nuevos desde ' + (antes.fecha || 'nunca') + ': ' + nuevos.length + (antes.fecha ? '' : ' (primera pasada: solo guardo la foto)'));
  if (!SECO) fs.writeFileSync(FICHERO, JSON.stringify({ usuarios: ahora, fecha: new Date().toISOString() }));
  if (!nuevos.length) return;

  const perfiles = await apify(ACTOR_PERFIL, { usernames: nuevos.slice(0, 60) });
  const hoy = new Date().toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' });
  const filas = [];
  for (const p of perfiles) {
    const q = cualificar(p);
    const fila = [hoy, q.letra, '@' + usuarioDe(p), p.fullName || '', q.vertical, q.esNegocio ? 'sí' : 'no', Number(p.followersCount || 0), p.externalUrl || '', String(p.biography || '').replace(/\s+/g, ' ').slice(0, 200), q.motivo, q.letra === 'descartar' ? '' : mensaje(p, q), '', ''];
    filas.push(fila);
    console.log(q.letra.padEnd(9), '@' + usuarioDe(p), '|', q.vertical || '-', '|', q.motivo);
  }
  filas.sort(function (a, b) { return ({ A: 0, B: 1, descartar: 2 })[a[1]] - ({ A: 0, B: 1, descartar: 2 })[b[1]]; });
  if (!SECO) await hoja(filas);
  console.log('A: ' + filas.filter(function (f) { return f[1] === 'A'; }).length + ' · B: ' + filas.filter(function (f) { return f[1] === 'B'; }).length + ' · descartar: ' + filas.filter(function (f) { return f[1] === 'descartar'; }).length);
}

main().catch(function (e) { console.error('ERROR', e.message); process.exit(1); });
