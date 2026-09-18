#!/usr/bin/env node
/**
 * Informe semanal para el cliente, en su propia hoja de cálculo.
 *
 *   SA_PATH=... INFORME_ID=<id> node scripts/crm/informe-semanal.mjs
 *
 * Tres pestañas y ninguna más, a propósito: lo que hay que hacer el lunes,
 * el estado de cada lead, y los números. En ese orden, porque un informe que
 * empieza por métricas se lee una vez y un informe que empieza por tareas se
 * usa toda la semana.
 */
import fs from 'node:fs';
import { token } from './preparar-hoja.mjs';

const ID = process.env.INFORME_ID;
const API = `https://sheets.googleapis.com/v4/spreadsheets/${ID}`;
const datos = JSON.parse(fs.readFileSync(process.env.DATOS || '/tmp/informe.json', 'utf8'));

let T;
async function api(ruta, op = {}) {
  T = T || await token();
  const r = await fetch(API + ruta, { ...op,
    headers: { Authorization: `Bearer ${T}`, 'Content-Type': 'application/json', ...op.headers } });
  const j = await r.json();
  if (j.error) throw new Error(`${ruta}: ${j.error.message}`);
  return j;
}
const lote = (requests) => api(':batchUpdate', { method: 'POST', body: JSON.stringify({ requests }) });

const rgb = (h) => ({ red: parseInt(h.slice(1,3),16)/255, green: parseInt(h.slice(3,5),16)/255, blue: parseInt(h.slice(5,7),16)/255 });
const TINTA='#14100D', PAPEL='#F4EFE7', ROBLE='#8C5E32', AVISO='#FFF4E5';

const libro = await api('?fields=sheets.properties(title,sheetId,index)');
const hojas = Object.fromEntries(libro.sheets.map(s => [s.properties.title, s.properties.sheetId]));

const QUIERO = ['Esta semana', 'Leads', 'Números'];
const crear = QUIERO.filter(t => !(t in hojas))
  .map((t, i) => ({ addSheet: { properties: { title: t, index: i, gridProperties: { rowCount: 120, columnCount: 9 } } } }));
if (crear.length) {
  const r = await lote(crear);
  r.replies.forEach(x => { if (x.addSheet) hojas[x.addSheet.properties.title] = x.addSheet.properties.sheetId; });
}
// La pestaña vacía que trae toda hoja nueva
const sobra = libro.sheets.find(s => /^(Untitled|Hoja ?1|Sheet1)$/.test(s.properties.title));
if (sobra) await lote([{ deleteSheet: { sheetId: sobra.properties.sheetId } }]);

for (const [nombre, filas] of Object.entries(datos.pestanas)) {
  await api(`/values/${encodeURIComponent(nombre)}!A1:I120:clear`, { method: 'POST', body: '{}' });
  await api(`/values/${encodeURIComponent(nombre)}!A1?valueInputOption=USER_ENTERED`, {
    method: 'PUT', body: JSON.stringify({ values: filas }) });
}

// ── Formato ────────────────────────────────────────────────────────────────
const peticiones = [];
for (const [nombre, filas] of Object.entries(datos.pestanas)) {
  const id = hojas[nombre];
  const anchos = datos.anchos[nombre] || [];
  anchos.forEach((px, i) => peticiones.push({ updateDimensionProperties: {
    range: { sheetId: id, dimension: 'COLUMNS', startIndex: i, endIndex: i + 1 },
    properties: { pixelSize: px }, fields: 'pixelSize' } }));

  peticiones.push({ repeatCell: {
    range: { sheetId: id, startRowIndex: 0, endRowIndex: 1 },
    cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 15 } } },
    fields: 'userEnteredFormat.textFormat' } });

  // Las filas que en los datos vienen marcadas como cabecera de bloque
  (datos.cabeceras[nombre] || []).forEach((f) => peticiones.push({ repeatCell: {
    range: { sheetId: id, startRowIndex: f, endRowIndex: f + 1, startColumnIndex: 0, endColumnIndex: 9 },
    cell: { userEnteredFormat: { backgroundColor: rgb(TINTA),
      textFormat: { foregroundColor: rgb(PAPEL), bold: true } } },
    fields: 'userEnteredFormat(backgroundColor,textFormat)' } }));

  (datos.destacadas[nombre] || []).forEach((f) => peticiones.push({ repeatCell: {
    range: { sheetId: id, startRowIndex: f, endRowIndex: f + 1, startColumnIndex: 0, endColumnIndex: 9 },
    cell: { userEnteredFormat: { backgroundColor: rgb(AVISO) } },
    fields: 'userEnteredFormat.backgroundColor' } }));

  peticiones.push({ updateSheetProperties: {
    properties: { sheetId: id, gridProperties: { frozenRowCount: datos.congelar[nombre] || 0 } },
    fields: 'gridProperties.frozenRowCount' } });
  peticiones.push({ repeatCell: {
    range: { sheetId: id, startRowIndex: 1, endRowIndex: filas.length },
    cell: { userEnteredFormat: { wrapStrategy: 'WRAP', verticalAlignment: 'TOP' } },
    fields: 'userEnteredFormat(wrapStrategy,verticalAlignment)' } });
}
await lote(peticiones);
console.log(`✓ https://docs.google.com/spreadsheets/d/${ID}/edit`);
