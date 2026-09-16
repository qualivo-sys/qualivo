/**
 * Normaliza los teléfonos ya guardados.
 *
 *   SA_PATH=... node scripts/crm/arreglar-telefonos.mjs          # dice qué haría
 *   SA_PATH=... node scripts/crm/arreglar-telefonos.mjs --aplicar
 *
 * Desde hoy se normalizan al guardar, pero los leads que entraron antes se
 * quedaron con el número tal cual lo escribió cada uno, y con eso el botón de
 * WhatsApp no abre nada.
 */
import { token, COLUMNAS } from './preparar-hoja.mjs';
const ID = process.env.HOJA_ID || '11-rbXqLFf9rnHYNmvvTv_OkTeuzQ4y-dBf3H4n2O3YM';
const APLICAR = process.argv.includes('--aplicar');

function e164(valor) {
  let d = String(valor || '').replace(/\D/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = d.slice(2);
  if (d.length === 9 && /^[6789]/.test(d)) d = '34' + d;
  return d.length >= 8 && d.length <= 15 ? d : '';
}

const letra = (n) => { let i = COLUMNAS.indexOf(n) + 1, s = ''; while (i > 0) { const r = (i-1)%26; s = String.fromCharCode(65+r)+s; i=(i-r-1)/26; } return s; };
const t = await token();
const h = { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
const col = letra('telefono');
const r = await (await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/Leads!${col}2:${col}1000`, { headers: h })).json();
const filas = r.values || [];

const cambios = [];
filas.forEach((f, i) => {
  const antes = String(f[0] || '');
  const despues = e164(antes);
  if (antes && despues && antes !== despues) cambios.push({ fila: i + 2, antes, despues });
});

if (!cambios.length) { console.log('  Nada que cambiar.'); process.exit(0); }
cambios.forEach((c) => console.log(`  fila ${c.fila}: «${c.antes}» → ${c.despues}`));
if (!APLICAR) { console.log(`\n  ${cambios.length} por arreglar. Añade --aplicar.`); process.exit(0); }

await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${ID}/values:batchUpdate`, {
  method: 'POST', headers: h,
  body: JSON.stringify({ valueInputOption: 'RAW',
    data: cambios.map((c) => ({ range: `Leads!${col}${c.fila}`, values: [[c.despues]] })) }),
});
console.log(`\n  ✓ ${cambios.length} arreglados.`);
