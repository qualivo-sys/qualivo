/**
 * Borra SOLO las filas de prueba.
 *
 *   SA_PATH=... node scripts/crm/limpiar-pruebas.mjs            # las lista
 *   SA_PATH=... node scripts/crm/limpiar-pruebas.mjs --aplicar
 *
 * El script que había antes borraba todas las filas de la hoja y se llevó por
 * delante cinco leads reales. Se recuperaron de las ejecuciones de n8n, pero
 * la lección es que una herramienta de limpieza no puede decidir «todo»: aquí
 * hay que decir explícitamente qué es una prueba, y lo que no encaje se queda.
 */
import { token, COLUMNAS } from './preparar-hoja.mjs';
const ID = process.env.HOJA_ID || '11-rbXqLFf9rnHYNmvvTv_OkTeuzQ4y-dBf3H4n2O3YM';
const APLICAR = process.argv.includes('--aplicar');

const esPrueba = (l) =>
  /^(demo_|web_prueba)/.test(String(l.lead_id || '')) ||
  /prueba|test/i.test(String(l.nombre || '')) ||
  /@ejemplo\.(es|com)$/i.test(String(l.email || '')) ||
  String(l.email || '').toLowerCase() === 'info@maikelechevarria.com';

const t = await token();
const h = { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
const libro = await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${ID}?fields=sheets.properties(title,sheetId)`, { headers: h })).json();
const idLeads = libro.sheets.find((s) => s.properties.title === 'Leads').properties.sheetId;
const ULT = (() => { let i = COLUMNAS.length, s = ''; while (i > 0) { const r = (i-1)%26; s = String.fromCharCode(65+r)+s; i=(i-r-1)/26; } return s; })();
const r = await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/Leads!A2:${ULT}1000`, { headers: h })).json();

const filas = (r.values || []).map((f, i) => {
  const o = { _fila: i + 2 };
  COLUMNAS.forEach((c, j) => { o[c] = f[j]; });
  return o;
});
const pruebas = filas.filter(esPrueba);
const reales = filas.length - pruebas.length;

if (!pruebas.length) { console.log(`  Nada que borrar. ${reales} leads reales intactos.`); process.exit(0); }
pruebas.forEach((l) => console.log(`  fila ${l._fila}: ${l.nombre} · ${l.email}`));
console.log(`\n  ${pruebas.length} de prueba · ${reales} reales que NO se tocan`);
if (!APLICAR) { console.log('  Añade --aplicar.'); process.exit(0); }

// De abajo arriba, para que borrar una fila no desplace las siguientes
await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${ID}:batchUpdate`, {
  method: 'POST', headers: h,
  body: JSON.stringify({ requests: pruebas.map((l) => l._fila).sort((a, b) => b - a)
    .map((n) => ({ deleteRange: { range: { sheetId: idLeads, startRowIndex: n-1, endRowIndex: n }, shiftDimension: 'ROWS' } })) }),
});
console.log(`\n  ✓ ${pruebas.length} borradas. ${reales} reales intactos.`);
