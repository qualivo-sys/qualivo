#!/usr/bin/env node
/**
 * Construye la hoja del CRM entera desde fuera.
 *
 *   SA_PATH=/ruta/cuenta-servicio.json node scripts/crm/preparar-hoja.mjs
 *
 * Antes esto lo hacía configurar() dentro de Apps Script. Hacerlo desde aquí
 * quita un paso al cliente y, sobre todo, permite comprobarlo: si algo sale
 * mal, sale mal aquí y no en el ordenador de otro.
 *
 * Es idempotente: se puede volver a ejecutar sin perder datos.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';

const ID = process.env.HOJA_ID || '11-rbXqLFf9rnHYNmvvTv_OkTeuzQ4y-dBf3H4n2O3YM';
const sa = JSON.parse(fs.readFileSync(process.env.SA_PATH, 'utf8'));

export const COLUMNAS = [
  'fecha', 'origen', 'nombre', 'telefono', 'email', 'tier',
  'estado', 'responsable', 'proxima_accion', 'fecha_proxima', 'importe',
  'motivo_perdida', 'notas',
  'pieza', 'espacio', 'medidas', 'estilo', 'presupuesto', 'plazo', 'referencias',
  'primer_contacto', 'fecha_cierre',
  'utm_source', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid',
  'ip', 'user_agent', 'lead_id', 'sla_avisado', 'email_enviado',
];

export const ESTADOS = ['Nuevo', 'Contactado', 'Visita o llamada',
  'Presupuesto enviado', 'Ganado', 'Perdido'];
export const MOTIVOS = ['Precio', 'Plazo', 'No contesta', 'Compró en otro sitio',
  'Solo miraba', 'Fuera de zona', 'Otro'];

const OCULTAS = ['utm_source', 'fbclid', 'ip', 'user_agent', 'lead_id',
  'sla_avisado', 'email_enviado'];

const col = (n) => COLUMNAS.indexOf(n);
const letra = (n) => {
  let i = col(n) + 1, s = '';
  while (i > 0) { const r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = (i - r - 1) / 26; }
  return s;
};

// ── Autenticación ───────────────────────────────────────────────────────────

const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');

export async function token(scopes = ['https://www.googleapis.com/auth/spreadsheets']) {
  const ahora = Math.floor(Date.now() / 1000);
  const c = b64({ alg: 'RS256', typ: 'JWT' });
  const p = b64({ iss: sa.client_email, scope: scopes.join(' '), aud: sa.token_uri,
    iat: ahora, exp: ahora + 3600 });
  const f = crypto.sign('RSA-SHA256', Buffer.from(`${c}.${p}`), sa.private_key).toString('base64url');
  const r = await fetch(sa.token_uri, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${c}.${p}.${f}` }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error(JSON.stringify(j));
  return j.access_token;
}

const API = `https://sheets.googleapis.com/v4/spreadsheets/${ID}`;
let T;
async function llamar(ruta, opciones = {}) {
  T = T || await token();
  const r = await fetch(API + ruta, {
    ...opciones,
    headers: { Authorization: `Bearer ${T}`, 'Content-Type': 'application/json', ...opciones.headers },
  });
  const j = await r.json();
  if (j.error) throw new Error(`${ruta}: ${j.error.message}`);
  return j;
}
const lote = (peticiones) => llamar(':batchUpdate', {
  method: 'POST', body: JSON.stringify({ requests: peticiones }) });

// ── Estilo ──────────────────────────────────────────────────────────────────

const rgb = (hex) => ({
  red: parseInt(hex.slice(1, 3), 16) / 255,
  green: parseInt(hex.slice(3, 5), 16) / 255,
  blue: parseInt(hex.slice(5, 7), 16) / 255,
});
const TINTA = '#14100D', PAPEL = '#F4EFE7', ROBLE = '#8C5E32';
const COLOR_ESTADO = {
  'Nuevo': '#FFF4E5', 'Contactado': '#FFFFFF', 'Visita o llamada': '#F1F5EC',
  'Presupuesto enviado': '#EAF1F8', 'Ganado': '#E6F4EA', 'Perdido': '#F3F1EF',
};

// ── Construcción ────────────────────────────────────────────────────────────

async function main() {
  const libro = await llamar('');
  console.log(`Hoja: ${libro.properties.title}`);

  // 1. Zona horaria e idioma. Los disparadores de Apps Script se programan en
  //    la zona de la hoja: en Los Ángeles, el aviso de las 8:00 sale a las 17:00.
  if (libro.properties.timeZone !== 'Europe/Madrid' || libro.properties.locale !== 'es_ES') {
    await lote([{ updateSpreadsheetProperties: {
      properties: { timeZone: 'Europe/Madrid', locale: 'es_ES' },
      fields: 'timeZone,locale' } }]);
    console.log(`  · zona horaria ${libro.properties.timeZone} → Europe/Madrid`);
    console.log(`  · idioma ${libro.properties.locale} → es_ES`);
  }

  // 2. Las dos pestañas
  const hojas = Object.fromEntries(libro.sheets.map((s) => [s.properties.title, s.properties]));
  const crear = [];
  if (!hojas.Leads) crear.push({ addSheet: { properties: { title: 'Leads', index: 0,
    gridProperties: { rowCount: 1000, columnCount: COLUMNAS.length, frozenRowCount: 1, frozenColumnCount: 3 } } } });
  if (!hojas.Panel) crear.push({ addSheet: { properties: { title: 'Panel', index: 1,
    gridProperties: { rowCount: 60, columnCount: 4 } } } });
  if (crear.length) {
    const r = await lote(crear);
    r.replies.forEach((x) => {
      if (x.addSheet) { hojas[x.addSheet.properties.title] = x.addSheet.properties;
        console.log(`  · pestaña «${x.addSheet.properties.title}» creada`); }
    });
  }
  // La pestaña vacía que trae toda hoja nueva estorba
  const sobra = libro.sheets.find((s) => /^(Untitled|Hoja 1|Sheet1|Hoja1)$/.test(s.properties.title));
  if (sobra && Object.keys(hojas).length > 1) {
    await lote([{ deleteSheet: { sheetId: sobra.properties.sheetId } }]);
    console.log(`  · pestaña «${sobra.properties.title}» eliminada`);
  }

  const idLeads = hojas.Leads.sheetId, idPanel = hojas.Panel.sheetId;
  const N = COLUMNAS.length;

  // 3. Cabecera
  await llamar(`/values/Leads!A1:${letra(COLUMNAS[N - 1])}1?valueInputOption=RAW`, {
    method: 'PUT', body: JSON.stringify({ values: [COLUMNAS] }) });

  // 4. Formato, desplegables y colores
  const peticiones = [
    { updateSheetProperties: { properties: { sheetId: idLeads,
      gridProperties: { frozenRowCount: 1, frozenColumnCount: 3, columnCount: N } },
      fields: 'gridProperties.frozenRowCount,gridProperties.frozenColumnCount,gridProperties.columnCount' } },
    { repeatCell: { range: { sheetId: idLeads, startRowIndex: 0, endRowIndex: 1 },
      cell: { userEnteredFormat: { backgroundColor: rgb(TINTA),
        textFormat: { foregroundColor: rgb(PAPEL), bold: true, fontSize: 10 } } },
      fields: 'userEnteredFormat(backgroundColor,textFormat)' } },
    { setDataValidation: { range: { sheetId: idLeads, startRowIndex: 1, startColumnIndex: col('estado'), endColumnIndex: col('estado') + 1 },
      rule: { condition: { type: 'ONE_OF_LIST', values: ESTADOS.map((v) => ({ userEnteredValue: v })) },
        showCustomUi: true, strict: true } } },
    { setDataValidation: { range: { sheetId: idLeads, startRowIndex: 1, startColumnIndex: col('motivo_perdida'), endColumnIndex: col('motivo_perdida') + 1 },
      rule: { condition: { type: 'ONE_OF_LIST', values: MOTIVOS.map((v) => ({ userEnteredValue: v })) },
        showCustomUi: true, strict: false } } },
  ];

  const formato = (nombre, patron, tipo) => peticiones.push({ repeatCell: {
    range: { sheetId: idLeads, startRowIndex: 1, startColumnIndex: col(nombre), endColumnIndex: col(nombre) + 1 },
    cell: { userEnteredFormat: { numberFormat: { type: tipo, pattern: patron } } },
    fields: 'userEnteredFormat.numberFormat' } });
  formato('fecha', 'dd/mm/yyyy hh:mm', 'DATE_TIME');
  formato('primer_contacto', 'dd/mm/yyyy hh:mm', 'DATE_TIME');
  formato('fecha_proxima', 'dd/mm/yyyy', 'DATE');
  formato('fecha_cierre', 'dd/mm/yyyy', 'DATE');
  formato('importe', '#,##0 €', 'NUMBER');

  OCULTAS.forEach((c) => peticiones.push({ updateDimensionProperties: {
    range: { sheetId: idLeads, dimension: 'COLUMNS', startIndex: col(c), endIndex: col(c) + 1 },
    properties: { hiddenByUser: true }, fields: 'hiddenByUser' } }));

  [['nombre', 170], ['proxima_accion', 220], ['notas', 260], ['medidas', 130], ['telefono', 130]]
    .forEach(([c, px]) => peticiones.push({ updateDimensionProperties: {
      range: { sheetId: idLeads, dimension: 'COLUMNS', startIndex: col(c), endIndex: col(c) + 1 },
      properties: { pixelSize: px }, fields: 'pixelSize' } }));

  // Colorear por estado con formato condicional: así lo hace la hoja sola y no
  // hay que repintar cada fila desde el script cada vez que algo cambia.
  const rango = { sheetId: idLeads, startRowIndex: 1, startColumnIndex: 0, endColumnIndex: N };
  peticiones.push({ addConditionalFormatRule: { index: 0, rule: {
    ranges: [rango],
    booleanRule: {
      condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue:
        `=AND($${letra('tier')}2="HOT";$${letra('estado')}2="Nuevo")` }] },
      format: { backgroundColor: rgb('#FCE8E6'), textFormat: { bold: true } } } } } });
  ESTADOS.forEach((e, i) => peticiones.push({ addConditionalFormatRule: { index: i + 1, rule: {
    ranges: [rango],
    booleanRule: {
      condition: { type: 'CUSTOM_FORMULA', values: [{ userEnteredValue: `=$${letra('estado')}2="${e}"` }] },
      format: { backgroundColor: rgb(COLOR_ESTADO[e]) } } } } }));

  // Las reglas viejas se quitan primero para no acumularlas al reejecutar
  const reglas = (libro.sheets.find((s) => s.properties.sheetId === idLeads) || {}).conditionalFormats || [];
  const limpiar = reglas.map((_, i) => ({ deleteConditionalFormatRule: { sheetId: idLeads, index: reglas.length - 1 - i } }));

  await lote([...limpiar, ...peticiones]);
  console.log(`  · ${COLUMNAS.length} columnas, desplegables, formatos y colores por estado`);

  await construirPanel(idPanel);
  console.log(`\n✓ https://docs.google.com/spreadsheets/d/${ID}/edit`);
}

// ── Panel ───────────────────────────────────────────────────────────────────

async function construirPanel(idPanel) {
  // Las referencias van dentro de INDIRECT a propósito. Escritas normales,
  // Sheets las desplaza cuando se insertan o borran filas en Leads: después de
  // un par de altas por API, Leads!G2:G se había convertido solo en Leads!G4:G
  // y el panel contaba cero con leads dentro. Dentro de INDIRECT son texto y
  // no hay nada que desplazar.
  const c = (n) => `INDIRECT("Leads!${letra(n)}2:${letra(n)}")`;
  const mes = 'DATE(YEAR(TODAY());MONTH(TODAY());1)';
  // COUNTA cuenta como llena una celda con cadena vacía, y la API escribe ""
  // en todas las columnas que el lead no trae. Como fecha y primer_contacto
  // son números de serie, contar los mayores que cero es exacto.
  const total = `COUNTIF(${c('fecha')};">0")`;
  const presu = `COUNTIF(${c('estado')};"Presupuesto enviado")+COUNTIF(${c('estado')};"Ganado")`;
  const gana = `COUNTIF(${c('estado')};"Ganado")`;

  // Ojo: aquí las fórmulas van con punto y coma porque la hoja es es_ES y se
  // escriben por la API de valores, que respeta el idioma del documento. Es al
  // revés que en Apps Script, donde setFormula() siempre pide comas.
  const filas = [];
  const F = (a, b = '', d = '') => filas.push([a, b, d]);

  F('Antic Barcelona 113 · Panel de leads');
  F('Se actualiza solo. La única celda que se escribe a mano es la inversión del mes.');
  F('');
  F('EMBUDO', 'Total', 'Este mes');
  ESTADOS.forEach((e) => F(e,
    `=COUNTIF(${c('estado')};"${e}")`,
    `=COUNTIFS(${c('estado')};"${e}";${c('fecha')};">="&${mes})`));
  F('');
  F('CONVERSIÓN');
  F('Contesta el cliente', `=IFERROR(COUNTIF(${c('primer_contacto')};">0")/${total};0)`);
  F('Llega a presupuesto', `=IFERROR((${presu})/${total};0)`);
  F('Cierra en venta', `=IFERROR(${gana}/${total};0)`);
  F('Presupuesto → venta', `=IFERROR(${gana}/(${presu});0)`);
  F('');
  F('DINERO');
  F('Facturado (ganado)', `=SUMIF(${c('estado')};"Ganado";${c('importe')})`);
  F('Pipeline abierto', `=SUMIF(${c('estado')};"Presupuesto enviado";${c('importe')})`);
  F('Ticket medio ganado', `=IFERROR(AVERAGEIF(${c('estado')};"Ganado";${c('importe')});0)`);
  F('');
  F('COSTE DE ADQUISICIÓN');
  F('Inversión en Meta este mes (€)', 0, '← se escribe a mano cada semana');
  // Dónde acabe esa celda depende de cuántas filas lleven las secciones de
  // arriba. Escribirla a mano es garantizar que se rompa al añadir una fila.
  const INV = `$B$${filas.length}`;
  const mesLeads = `COUNTIFS(${c('fecha')};">="&${mes})`;
  const mesHot = `COUNTIFS(${c('fecha')};">="&${mes};${c('tier')};"HOT")`;
  const mesVentas = `COUNTIFS(${c('fecha')};">="&${mes};${c('estado')};"Ganado")`;
  F('Coste por lead', `=IFERROR(${INV}/${mesLeads};"—")`);
  F('Coste por lead HOT', `=IFERROR(${INV}/${mesHot};"—")`);
  F('Coste por venta', `=IFERROR(${INV}/${mesVentas};"—")`);
  F('Retorno sobre la inversión',
    `=IFERROR(SUMIFS(${c('importe')};${c('estado')};"Ganado";${c('fecha')};">="&${mes})/${INV};"—")`);
  F('');
  F('DE DÓNDE VIENEN', 'Leads', 'Ventas');
  [['Guía descargada', 'guia'], ['Cuestionario', 'cuestionario'], ['Formulario de Meta', 'meta_form']]
    .forEach(([et, k]) => F(et, `=COUNTIF(${c('origen')};"${k}")`,
      `=COUNTIFS(${c('origen')};"${k}";${c('estado')};"Ganado")`));
  F('');
  F('POR CREATIVIDAD');
  F(`=IFERROR(QUERY(${c('utm_content')};"select Col1, count(Col1) where Col1 is not null group by Col1 order by count(Col1) desc label count(Col1) 'Leads'";0);"Sin datos todavía")`);

  await llamar('/values/Panel!A1:C60:clear', { method: 'POST', body: '{}' });
  await llamar('/values/Panel!A1?valueInputOption=USER_ENTERED', {
    method: 'PUT', body: JSON.stringify({ values: filas }) });

  const enc = (t) => filas.findIndex((f) => f[0] === t);
  const peticiones = [
    { updateDimensionProperties: { range: { sheetId: idPanel, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 },
      properties: { pixelSize: 250 }, fields: 'pixelSize' } },
    { updateDimensionProperties: { range: { sheetId: idPanel, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 },
      properties: { pixelSize: 230 }, fields: 'pixelSize' } },
    { repeatCell: { range: { sheetId: idPanel, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 3 },
      cell: { userEnteredFormat: { textFormat: { bold: true, fontSize: 14 } } },
      fields: 'userEnteredFormat.textFormat' } },
  ];
  ['EMBUDO', 'CONVERSIÓN', 'DINERO', 'COSTE DE ADQUISICIÓN', 'DE DÓNDE VIENEN', 'POR CREATIVIDAD']
    .forEach((t) => { const i = enc(t); if (i < 0) return;
      peticiones.push({ repeatCell: { range: { sheetId: idPanel, startRowIndex: i, endRowIndex: i + 1, startColumnIndex: 0, endColumnIndex: 3 },
        cell: { userEnteredFormat: { backgroundColor: rgb(TINTA), textFormat: { foregroundColor: rgb(PAPEL), bold: true } } },
        fields: 'userEnteredFormat(backgroundColor,textFormat)' } }); });

  const pct = (t) => { const i = enc(t); if (i < 0) return;
    peticiones.push({ repeatCell: { range: { sheetId: idPanel, startRowIndex: i, endRowIndex: i + 1, startColumnIndex: 1, endColumnIndex: 2 },
      cell: { userEnteredFormat: { numberFormat: { type: 'PERCENT', pattern: '0.0%' } } },
      fields: 'userEnteredFormat.numberFormat' } }); };
  ['Contesta el cliente', 'Llega a presupuesto', 'Cierra en venta', 'Presupuesto → venta'].forEach(pct);

  const eur = (t) => { const i = enc(t); if (i < 0) return;
    peticiones.push({ repeatCell: { range: { sheetId: idPanel, startRowIndex: i, endRowIndex: i + 1, startColumnIndex: 1, endColumnIndex: 2 },
      cell: { userEnteredFormat: { numberFormat: { type: 'NUMBER', pattern: '#,##0 €' } } },
      fields: 'userEnteredFormat.numberFormat' } }); };
  ['Facturado (ganado)', 'Pipeline abierto', 'Ticket medio ganado', 'Inversión en Meta este mes (€)',
   'Coste por lead', 'Coste por lead HOT', 'Coste por venta'].forEach(eur);

  const iRoi = enc('Retorno sobre la inversión');
  peticiones.push({ repeatCell: { range: { sheetId: idPanel, startRowIndex: iRoi, endRowIndex: iRoi + 1, startColumnIndex: 1, endColumnIndex: 2 },
    cell: { userEnteredFormat: { numberFormat: { type: 'NUMBER', pattern: '0.0"×"' } } },
    fields: 'userEnteredFormat.numberFormat' } });

  const iInv = enc('Inversión en Meta este mes (€)');
  peticiones.push({ repeatCell: { range: { sheetId: idPanel, startRowIndex: iInv, endRowIndex: iInv + 1, startColumnIndex: 1, endColumnIndex: 2 },
    cell: { userEnteredFormat: { backgroundColor: rgb('#FFF4E5'),
      borders: ['top', 'bottom', 'left', 'right'].reduce((a, k) => (a[k] = { style: 'SOLID', color: rgb(ROBLE) }, a), {}) } },
    fields: 'userEnteredFormat(backgroundColor,borders)' } });

  await lote(peticiones);
  console.log(`  · panel con ${filas.length} filas de fórmulas vivas`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
