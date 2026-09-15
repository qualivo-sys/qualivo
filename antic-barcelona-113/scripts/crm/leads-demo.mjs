#!/usr/bin/env node
/**
 * Leads de ejemplo para enseñar el CRM antes de tener datos reales.
 *
 *   SA_PATH=... node scripts/crm/leads-demo.mjs --poner
 *   SA_PATH=... node scripts/crm/leads-demo.mjs --quitar
 *
 * Son inventados. Van con el lead_id empezando por "demo_" y con "(demo)" en
 * las notas, por dos razones: se borran todos de una y nadie puede
 * confundirlos con clientes reales dentro de un mes.
 *
 * Los números están elegidos para ser plausibles con 19 €/día durante cinco
 * semanas, no para lucir bien. Un panel de demostración que enseña un retorno
 * imposible es la forma más rápida de perder credibilidad en la reunión
 * siguiente, cuando lleguen los de verdad.
 */
import { token, COLUMNAS } from './preparar-hoja.mjs';

const ID = process.env.HOJA_ID || '11-rbXqLFf9rnHYNmvvTv_OkTeuzQ4y-dBf3H4n2O3YM';
const API = `https://sheets.googleapis.com/v4/spreadsheets/${ID}`;

// Mismo criterio que lib/hoja.js: se escribe número de serie, no texto.
const ZONA = 'Europe/Madrid', EPOCA = Date.UTC(1899, 11, 30), DIA = 86400000;
const PARTES = new Intl.DateTimeFormat('en-US', { timeZone: ZONA, hour12: false,
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit' });
const relojLocal = (f) => {
  const p = Object.fromEntries(PARTES.formatToParts(f).filter((x) => x.type !== 'literal')
    .map((x) => [x.type, Number(x.value)]));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second);
};
const serie = (d) => (relojLocal(new Date(d)) - EPOCA) / DIA;

const HOY = new Date();
const haceDias = (d, hora = 11, min = 20) => {
  const x = new Date(HOY); x.setDate(x.getDate() - d); x.setHours(hora, min, 0, 0); return x;
};

// ── Los leads ───────────────────────────────────────────────────────────────
// [días atrás, origen, nombre, tel, tier, pieza, medidas, plazo, creatividad,
//  estado, importe, motivo, notas, díasHastaContacto]
const L = [
  [0,  'cuestionario', 'Marta Ribas',        '+34676112038', 'HOT',  'Mesa de comedor', '240 × 100 cm', 'Lo antes posible',        '2A | FRIO | 4x5 | v1',           'Nuevo'],
  [0,  'guia',         'Sergi Bonet',        '+34655430921', 'COLD', '',                '',             '',                        'POST-PROCESO | FRIO | Reel | v1','Nuevo'],
  [1,  'cuestionario', 'Núria Castells',     '+34600882145', 'HOT',  'Mesa de comedor', '200 × 90 cm',  'Lo antes posible',        'POST-CASA | FRIO | Reel | v1',   'Nuevo'],
  [2,  'guia',         'Albert Solé',        '+34627009431', 'WARM', 'Banco',           '',             'En los próximos 3 meses', '5A | FRIO | 4x5 | v1',           'Contactado', null, null, '', 1],
  [3,  'cuestionario', 'Laia Ferrer',        '+34699234870', 'HOT',  'Mesa de comedor', '260 × 105 cm', 'Lo antes posible',        '2A | FRIO | 4x5 | v1',           'Visita o llamada', null, null, 'Viene al taller el jueves a ver el roble', 0],
  [5,  'cuestionario', 'Jordi Puig',         '+34610554278', 'WARM', 'Cajonera',        '120 × 45 cm',  'En los próximos 3 meses', '3A | FRIO | 4x5 | v1',           'Contactado', null, null, '', 1],
  [6,  'guia',         'Anna Vilalta',       '+34638771026', 'COLD', '',                '',             '',                        'POST-OLMO | FRIO | Reel | v1',   'Nuevo'],
  [8,  'cuestionario', 'Pau Mestres',        '+34644190385', 'HOT',  'Mesa de comedor', '220 × 95 cm',  'Lo antes posible',        'POST-OLMO | FRIO | Reel | v1',   'Presupuesto enviado', 4650, null, 'Pendiente de que lo hable con su mujer', 0],
  [9,  'guia',         'Elena Torres',       '+34677302914', 'COLD', '',                '',             '',                        '5A | FRIO | 4x5 | v1',           'Nuevo'],
  [11, 'cuestionario', 'Marc Ribó',          '+34629845017', 'WARM', 'Mesa de comedor', '180 × 90 cm',  'Más adelante este año',   '3A | RTG | 4x5 | v1',            'Contactado', null, null, 'Reforma acaba en enero', 2],
  [13, 'cuestionario', 'Cristina Bosch',     '+34652118470', 'HOT',  'Mesa de comedor', '240 × 100 cm', 'Lo antes posible',        '2A | FRIO | 4x5 | v1',           'Ganado', 5200, null, 'Roble recuperado, pata central. Entrega 20/10', 0],
  [15, 'guia',         'Ferran Amat',        '+34698440271', 'COLD', '',                '',             '',                        'POST-PROCESO | FRIO | Reel | v1','Contactado', null, null, '', 2],
  [16, 'cuestionario', 'Sílvia Ortega',      '+34611927306', 'WARM', 'Banco',           '160 cm',       'En los próximos 3 meses', '4B | RTG | 4x5 | v1',            'Perdido', null, 'Precio', 'Buscaba por debajo de 800 €', 1],
  [18, 'guia',         'Oriol Camps',        '+34673558102', 'WARM', '',                '',             '',                        'POST-CASA | FRIO | Reel | v1',   'Contactado', null, null, '', 3],
  [20, 'cuestionario', 'Roser Dalmau',       '+34620713849', 'HOT',  'Mesa de comedor', '300 × 110 cm', 'Lo antes posible',        '3A | FRIO | 4x5 | v1',           'Presupuesto enviado', 7900, null, 'Pieza grande, una sola tabla. Enviado el 02/09', 0],
  [23, 'guia',         'Guillem Sala',       '+34681204673', 'COLD', '',                '',             '',                        '5A | FRIO | 4x5 | v1',           'Contactado', null, null, '', 2],
  [25, 'cuestionario', 'Montse Aguilar',     '+34634880159', 'WARM', 'Cajonera',        '',             'Más adelante este año',   'POST-OLMO | FRIO | Reel | v1',   'Perdido', null, 'No contesta', '', 2],
  [28, 'cuestionario', 'David Roca',         '+34691336742', 'HOT',  'Mesa de comedor', '230 × 100 cm', 'Lo antes posible',        '2A | FRIO | 4x5 | v1',           'Ganado', 4200, null, 'Segunda pieza: quiere banco a juego más adelante', 0],
  [30, 'guia',         'Teresa Miralles',    '+34645029138', 'COLD', '',                '',             '',                        'POST-PROCESO | FRIO | Reel | v1','Contactado', null, null, '', 2],
  [33, 'cuestionario', 'Xavier Lloret',      '+34602447916', 'WARM', 'Mesa de comedor', '200 × 95 cm',  'En los próximos 3 meses', '4B | RTG | 4x5 | v1',            'Perdido', null, 'Plazo', 'Necesitaba en 3 semanas', 1],
  [35, 'guia',         'Berta Nogués',       '+34664815203', 'COLD', '',                '',             '',                        'POST-CASA | FRIO | Reel | v1',   'Contactado', null, null, '', 2],
  [37, 'cuestionario', 'Ignasi Ferrer',      '+34617238054', 'WARM', 'Banco',           '180 cm',       'En los próximos 3 meses', '3A | FRIO | 4x5 | v1',           'Visita o llamada', null, null, 'Vino al taller, le gustó la teca', 2],
];

const ESPACIOS = { 'Mesa de comedor': 'Comedor', 'Banco': 'Comedor', 'Cajonera': 'Salón' };
const ACCION = { HOT: 'WhatsApp hoy + proponer visita al taller',
  WARM: 'WhatsApp con 2 proyectos parecidos',
  COLD: 'Dejar madurar. Revisar en 7 días.' };
const CERRADOS = ['Ganado', 'Perdido'];
const VENCIDOS = ['Roser Dalmau', 'Marc Ribó', 'Oriol Camps'];

function fila(d, i) {
  const [dias, origen, nombre, tel, tier, pieza, medidas, plazo, crea, estado,
    importe, motivo, notas, diasContacto] = d;
  const alta = haceDias(dias, 9 + (i % 10), (i * 7) % 60);
  const o = {
    fecha: serie(alta), origen, nombre, telefono: tel, tier,
    email: nombre.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z]+/g, '.') + '@ejemplo.es',
    estado, responsable: 'Ahmed',
    proxima_accion: CERRADOS.includes(estado) ? '' : (ACCION[tier] || ''),
    // Se simula lo que haría el sistema de verdad, no lo que queda bonito:
    //   · en «Nuevo» la fecha es la del alta más la espera que le toque por
    //     tier, porque a un lead que nadie ha tocado no se le puede aplazar
    //     el primer contacto;
    //   · ya contactados, fecha por delante, salvo tres vencidos a propósito
    //     que son los que justifican que exista la pestaña «Hoy».
    fecha_proxima: CERRADOS.includes(estado) ? ''
      : estado === 'Nuevo'
        ? Math.floor(serie(haceDias(dias - (tier === 'COLD' ? 7 : 0))))
        : Math.floor(serie(haceDias(VENCIDOS.includes(nombre) ? 2 : -(1 + (i % 5))))),
    importe: importe || '',
    motivo_perdida: motivo || '',
    notas: [notas, '(demo)'].filter(Boolean).join(' · '),
    pieza, espacio: ESPACIOS[pieza] || '', medidas, plazo,
    primer_contacto: diasContacto === undefined ? ''
      : serie(haceDias(dias - diasContacto, 12, 30)),
    fecha_cierre: CERRADOS.includes(estado) ? Math.floor(serie(haceDias(Math.max(dias - 5, 0)))) : '',
    utm_source: 'meta', utm_medium: 'paid_social',
    utm_campaign: crea.includes('RTG') ? 'AB113 | RTG | Lead' : 'AB113 | FRIO | Lead',
    utm_content: crea,
    lead_id: `demo_${String(i + 1).padStart(2, '0')}`,
  };
  return COLUMNAS.map((c) => (o[c] === undefined || o[c] === null ? '' : o[c]));
}

async function main() {
  const t = await token();
  const h = { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' };
  const libro = await (await fetch(`${API}?fields=sheets.properties(title,sheetId)`, { headers: h })).json();
  const idLeads = libro.sheets.find((s) => s.properties.title === 'Leads').properties.sheetId;

  // Los de demo se borran siempre primero, así el script es idempotente
  const ids = await (await fetch(`${API}/values/Leads!AD2:AD1000`, { headers: h })).json();
  const aBorrar = (ids.values || []).map((f, i) => [String(f[0] || ''), i + 2])
    .filter(([v]) => v.startsWith('demo_')).map(([, n]) => n).reverse();
  if (aBorrar.length) {
    await fetch(`${API}:batchUpdate`, { method: 'POST', headers: h, body: JSON.stringify({
      requests: aBorrar.map((n) => ({ deleteRange: {
        range: { sheetId: idLeads, startRowIndex: n - 1, endRowIndex: n }, shiftDimension: 'ROWS' } })) }) });
    console.log(`  ${aBorrar.length} leads de demo anteriores borrados`);
  }
  if (process.argv.includes('--quitar')) { console.log('✓ hoja limpia'); return; }

  const filas = L.map(fila).sort((a, b) => a[0] - b[0]);   // cronológico
  await fetch(`${API}/values/Leads!A:AF:append?valueInputOption=RAW`, {
    method: 'POST', headers: h, body: JSON.stringify({ values: filas }) });
  console.log(`✓ ${filas.length} leads de ejemplo puestos`);
}

main();
