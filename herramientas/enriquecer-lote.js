#!/usr/bin/env node
// Ficha investigada para leads que ya están en el CRM (la misma que se hace sola cuando entra
// un A o B, api/_enriquecer.js). Solo escribe notas internas y la etiqueta ficha-investigada:
// nunca escribe a un lead ni avisa al móvil.
//
// Uso (las claves, del entorno: GHL_API_KEY, GHL_LOCATION_ID, ANTHROPIC_API_KEY):
//   set -a; . ./.env.activacion; . ./.env.anthropic; set +a
//   node herramientas/enriquecer-lote.js <id> [<id> ...]            → prueba: imprime la ficha, no guarda
//   node herramientas/enriquecer-lote.js --buscar "texto"           → busca contactos por texto (prueba)
//   node herramientas/enriquecer-lote.js --etiquetas nivel-a,nivel-b --desde 2026-09-01
//   ... y --escribir para dejar la nota y la etiqueta en GHL.
// Opciones: --listar (solo enseña a quién le tocaría), --ver (con --escribir, imprime también la ficha),
//           --max N (tope de contactos, 30 por defecto), --todos (incluye perdidos/ganados y bajas),
//           --espera MS (tope por lead, 120000 por defecto: aquí no hay prisa).

const path = require('path');
const E = require(path.join(__dirname, '..', 'api', '_enriquecer.js'));
const A = require(path.join(__dirname, '..', 'api', '_activacion.js'));

// Cloudflare delante de GHL devuelve 403 sin User-Agent: se añade a todas las llamadas.
const fetchOriginal = global.fetch;
global.fetch = function (url, init) {
  init = init || {};
  if (/leadconnectorhq\.com/.test(String(url))) init.headers = Object.assign({ 'User-Agent': 'qualivo-enriquecer-lote/1.0' }, init.headers || {});
  return fetchOriginal(url, init);
};

function arg(nombre) {
  const i = process.argv.indexOf(nombre);
  return i > -1 ? process.argv[i + 1] : undefined;
}
const ESCRIBIR = process.argv.includes('--escribir');
const TODOS = process.argv.includes('--todos');
const MAX = parseInt(arg('--max') || '30', 10);
const ESPERA = parseInt(arg('--espera') || '120000', 10);
const CON_VALOR = ['--etiquetas', '--desde', '--max', '--espera', '--buscar'];
const ids = process.argv.slice(2).filter(function (x, i, todos) { return !/^--/.test(x) && CON_VALOR.indexOf(todos[i - 1]) < 0; });

async function contacto(id) {
  const r = await fetch(A.GHL_BASE + '/contacts/' + id, { headers: A.cabeceras() });
  if (!r.ok) throw new Error('ghl ' + r.status);
  return (await r.json()).contact;
}

async function buscarTexto(q) {
  const r = await fetch(A.GHL_BASE + '/contacts/search', {
    method: 'POST', headers: A.cabeceras(),
    body: JSON.stringify({ locationId: process.env.GHL_LOCATION_ID, page: 1, pageLimit: 10, query: q })
  });
  if (!r.ok) throw new Error('ghl_search ' + r.status);
  return (await r.json()).contacts || [];
}

// Sigue abierto: sin baja ni descarte y sin oportunidad ganada o perdida.
function abierto(c) {
  const t = (c.tags || []).map(String);
  if (t.some(function (x) { return /^(act-baja|act-descartado|no-interesa|cliente)$/.test(x); })) return false;
  const ops = c.opportunities || [];
  return !ops.length || ops.some(function (o) { return o.status === 'open'; });
}

async function candidatos() {
  if (ids.length) return Promise.all(ids.map(contacto));
  if (arg('--buscar')) return buscarTexto(arg('--buscar'));
  const etiquetas = String(arg('--etiquetas') || 'nivel-a,nivel-b').split(',').map(function (x) { return x.trim(); }).filter(Boolean);
  const desde = Date.parse(arg('--desde') || '2026-09-01');
  const vistos = {}, lista = [];
  for (const et of etiquetas) {
    for (const c of await A.buscarPorEtiqueta(et, 500)) {
      if (vistos[c.id]) continue;
      vistos[c.id] = true;
      // «contains» de GHL es por subcadena: se exige la etiqueta exacta.
      if (!(c.tags || []).map(String).includes(et)) continue;
      if (Date.parse(c.dateAdded || 0) < desde) continue;
      if ((c.tags || []).map(String).includes(E.ETIQUETA)) continue;
      if (!TODOS && !abierto(c)) continue;
      lista.push(c);
    }
  }
  lista.sort(function (a, b) { return Date.parse(b.dateAdded) - Date.parse(a.dateAdded); });
  return lista;
}

// Coste aproximado (Opus 5.5: 4 $/M entrada, 20 $/M salida; búsqueda web 10 $ cada mil).
function coste(u) {
  return (u.entrada * 4 + u.salida * 20) / 1e6 + u.busquedas * 0.01;
}

(async function () {
  for (const k of ['GHL_API_KEY', 'GHL_LOCATION_ID', 'ANTHROPIC_API_KEY']) {
    if (!process.env[k]) { console.error('Falta ' + k + ' en el entorno.'); process.exit(1); }
  }
  const lista = (await candidatos()).slice(0, MAX);
  if (process.argv.includes('--listar')) {
    lista.forEach(function (c) { console.log(String(c.dateAdded).slice(0, 10) + ' · ' + (c.tags || []).filter(function (t) { return /^nivel-/.test(t); }).join(',') + ' · ' + (c.companyName || '(sin empresa)') + ' · ' + c.id); });
    console.log(lista.length + ' contacto(s)');
    return;
  }
  console.log((ESCRIBIR ? 'ESCRIBE en GHL' : 'PRUEBA (no guarda nada)') + ' · ' + lista.length + ' contacto(s)\n');
  let hechos = 0, fallidos = 0, total = 0;
  for (const c of lista) {
    const quien = (c.companyName || '(sin empresa)') + ' · ' + c.id;
    if ((c.tags || []).map(String).includes(E.ETIQUETA)) { console.log('— ' + quien + ': ya tiene ficha, se salta'); continue; }
    const r = await E.investigarYAnotar(c, { esperaMs: ESPERA, simular: !ESCRIBIR });
    if (!r) { fallidos++; console.log('✗ ' + quien + ': sin ficha\n'); continue; }
    hechos++;
    total += coste(r.uso);
    console.log('✓ ' + quien + ' · ' + Math.round(r.uso.ms / 1000) + ' s · ' + r.uso.busquedas + ' búsquedas, ' + r.uso.lecturas + ' lecturas · ' +
      r.uso.entrada + ' tok entrada / ' + r.uso.salida + ' salida · ~' + coste(r.uso).toFixed(3) + ' $ · ' + r.uso.modelo +
      (ESCRIBIR ? (r.guardada ? ' · nota guardada' : ' · NOTA NO GUARDADA') : ''));
    if (!ESCRIBIR || process.argv.includes('--ver')) console.log('\nRESUMEN (móvil):\n' + r.resumen + '\n\n' + r.nota + '\n\n' + '-'.repeat(60) + '\n');
  }
  console.log('\nHechos: ' + hechos + ' · sin ficha: ' + fallidos + ' · coste aproximado: ' + total.toFixed(2) + ' $');
})().catch(function (e) { console.error(e && e.message); process.exit(1); });
