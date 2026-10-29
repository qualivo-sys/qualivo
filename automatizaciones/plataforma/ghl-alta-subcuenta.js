// Alta de una subcuenta de cliente en la agencia de GHL (plantilla «Qualivo · Reformas v1»).
// Guía: automatizaciones/plataforma/2026-10-29-montaje-agencia.md (parte B).
//
//   GHL_AGENCY_API_KEY=… GHL_COMPANY_ID=… node automatizaciones/plataforma/ghl-alta-subcuenta.js cliente.json [--aplicar]
//
// Sin --aplicar solo enseña lo que haría (lee, no escribe). Es idempotente: lo que ya existe no se toca,
// así que se puede repetir. Nunca borra. Nunca toca la subcuenta de Qualivo.
// cliente.json: ver al-milimetro.json en esta carpeta. Con "snapshotId", la subcuenta nace de la plantilla
// y solo se ajustan los valores personalizados.

const fs = require('fs');
const API = 'https://services.leadconnectorhq.com';
const QUALIVO = 'bHGMuZEGUESZmVoNv9HT';   // subcuenta de Qualivo: prohibido tocarla desde aquí

const OPC = {   // opciones EXACTAS de api/_am-modelo.js (rama claude/al-milimetro-landing-v2-site, 78aeef31)
  tipo: ['Chalet o casa entera', 'Piso entero', 'Cocina y baño', 'Dos baños', 'Solo un baño o la cocina', 'Local u oficina', 'Arreglos sueltos'],
  m2: ['Menos de 50 m²', '50-80 m²', '80-120 m²', '120-200 m²', 'Más de 200 m²'],
  cuando: ['Menos de 3 meses', 'Entre 3 y 6 meses', 'Más adelante', 'Solo mirando precios'],
  ppto: ['Menos de 15.000 €', '15.000-30.000 €', '30.000-60.000 €', '60.000-160.000 €', 'Más de 160.000 €', 'Todavía no lo sé'],
  propia: ['Sí', 'La está comprando', 'No'],
  inst: ['Fontanería o electricidad', 'Solo acabados', 'No lo sabe'],
  origen: ['A · Detrás de la pared', 'B · Chalet', 'C · Cuánto cuesta', 'D · Sin portales', 'Web u orgánico'],
  clase: ['A', 'B', 'C']
};
// [clave esperada, nombre (sin tildes: GHL saca la clave del nombre), tipo, opciones]
const CAMPOS = [
  ['obra_tipo', 'Obra tipo', 'SINGLE_OPTIONS', OPC.tipo], ['obra_texto', 'Obra texto', 'TEXT'],
  ['codigo_postal', 'Codigo postal', 'TEXT'], ['zona', 'Zona', 'TEXT'],
  ['metros', 'Metros', 'SINGLE_OPTIONS', OPC.m2], ['cuando', 'Cuando', 'SINGLE_OPTIONS', OPC.cuando],
  ['presupuesto', 'Presupuesto', 'SINGLE_OPTIONS', OPC.ppto], ['vivienda_propia', 'Vivienda propia', 'SINGLE_OPTIONS', OPC.propia],
  ['clase', 'Clase', 'SINGLE_OPTIONS', OPC.clase], ['puntos', 'Puntos', 'NUMERICAL'],
  ['origen', 'Origen', 'SINGLE_OPTIONS', OPC.origen], ['revision', 'Revision', 'SINGLE_OPTIONS', ['Sí', 'No']],
  ['precio_desde', 'Precio desde', 'TEXT'], ['instalaciones', 'Instalaciones', 'SINGLE_OPTIONS', OPC.inst],
  ['que_cambiar', 'Que cambiar', 'LARGE_TEXT'], ['visita_direccion', 'Visita direccion', 'TEXT']
];
const ETIQUETAS = ['prueba', 'nuevo', 'clase-a', 'clase-b', 'clase-c', 'revision', 'respondio', 'visita', 'presupuesto',
  'mas-adelante', 'stop', 'origen-pared', 'origen-chalet', 'origen-precio', 'origen-portal', 'origen-web'];

const aplicar = process.argv.includes('--aplicar');
const archivo = process.argv.slice(2).find((a) => !a.startsWith('--'));
const AGENCIA = process.env.GHL_AGENCY_API_KEY, COMPANY = process.env.GHL_COMPANY_ID;
const hacer = (txt) => console.log((aplicar ? '+ ' : '· haría: ') + txt);

async function ghl(token, metodo, ruta, cuerpo, version, form) {
  for (let i = 0; ; i++) {
    const r = await fetch(API + ruta, {
      method: metodo,
      headers: Object.assign({ Authorization: 'Bearer ' + token, Version: version || '2021-07-28', Accept: 'application/json' },
        cuerpo ? { 'Content-Type': form ? 'application/x-www-form-urlencoded' : 'application/json' } : {}),
      body: cuerpo ? (form ? new URLSearchParams(cuerpo).toString() : JSON.stringify(cuerpo)) : undefined
    });
    if (r.status === 429 && i < 3) { await new Promise((ok) => setTimeout(ok, 1500 * (i + 1))); continue; }
    const t = await r.text();
    if (!r.ok) throw new Error(metodo + ' ' + ruta.split('?')[0] + ' → ' + r.status + ' ' + t.slice(0, 300));
    return t ? JSON.parse(t) : {};
  }
}

async function main(cli) {
  if (!AGENCIA || !COMPANY) throw new Error('Faltan GHL_AGENCY_API_KEY y GHL_COMPANY_ID (guía, A3.1)');
  if (!cli || !cli.nombre || !cli.valores) throw new Error('cliente.json sin «nombre» o sin «valores»');
  console.log((aplicar ? 'APLICANDO' : 'VISTA PREVIA (añade --aplicar)') + ' · subcuenta «' + cli.nombre + '»');

  // B1 · subcuenta (si ya hay una con ese nombre, se reutiliza)
  const lista = await ghl(AGENCIA, 'GET', '/locations/search?companyId=' + COMPANY + '&limit=100&skip=0');
  let loc = (lista.locations || []).find((l) => String(l.name).trim().toLowerCase() === cli.nombre.trim().toLowerCase());
  if (loc && loc.id === QUALIVO) throw new Error('El nombre apunta a la subcuenta de Qualivo: no se toca');
  if (loc) console.log('✓ la subcuenta ya existe · ' + loc.id);
  else {
    hacer('crear subcuenta «' + cli.nombre + '»' + (cli.snapshotId ? ' desde la plantilla ' + cli.snapshotId : ''));
    if (!aplicar) { console.log('(sin subcuenta no se puede seguir mirando; con --aplicar continúa)'); return; }
    const c = await ghl(AGENCIA, 'POST', '/locations/', Object.assign({
      companyId: COMPANY, name: cli.nombre, timezone: 'Europe/Madrid', country: 'ES'
    }, cli.ficha || {}, cli.snapshotId ? { snapshotId: cli.snapshotId } : {}));
    loc = c.location || c;
    console.log('  id ' + loc.id);
  }
  if (loc.id === QUALIVO) throw new Error('Subcuenta de Qualivo: no se toca');

  // B2 · token de la subcuenta
  const tk = await ghl(AGENCIA, 'POST', '/oauth/locationToken', { companyId: COMPANY, locationId: loc.id }, '2021-07-28', true);
  const T = tk.access_token;
  if (!T) throw new Error('Sin token de la subcuenta (¿falta el permiso oauth.write en la clave de agencia?)');

  // B3 · valores personalizados
  const cv = await ghl(T, 'GET', '/locations/' + loc.id + '/customValues');
  const hayCv = {}; (cv.customValues || []).forEach((v) => { hayCv[String(v.name)] = v; });
  for (const [k, v] of Object.entries(cli.valores)) {
    const ya = hayCv[k];
    if (ya && String(ya.value) === String(v)) { console.log('✓ valor ' + k); continue; }
    hacer((ya ? 'actualizar' : 'crear') + ' valor ' + k + ' = ' + JSON.stringify(v));
    if (!aplicar) continue;
    if (ya) await ghl(T, 'PUT', '/locations/' + loc.id + '/customValues/' + ya.id, { name: k, value: String(v) });
    else await ghl(T, 'POST', '/locations/' + loc.id + '/customValues', { name: k, value: String(v) });
  }

  // B4 · campos del contacto
  const cf = await ghl(T, 'GET', '/locations/' + loc.id + '/customFields?model=contact');
  const clave = (f) => String(f.fieldKey || '').replace(/^contact\./, '');
  const hayCf = {}; (cf.customFields || []).forEach((f) => { hayCf[clave(f)] = f; });
  for (const [k, nombre, tipo, opciones] of CAMPOS) {
    if (hayCf[k]) { console.log('✓ campo ' + k); continue; }
    hacer('crear campo ' + k + ' (' + tipo + ')');
    if (aplicar) await ghl(T, 'POST', '/locations/' + loc.id + '/customFields', Object.assign({ name: nombre, dataType: tipo, model: 'contact' }, opciones ? { options: opciones } : {}));
  }
  if (aplicar) {
    const cf2 = await ghl(T, 'GET', '/locations/' + loc.id + '/customFields?model=contact');
    const claves = (cf2.customFields || []).map(clave);
    const mal = CAMPOS.map((c) => c[0]).filter((k) => claves.indexOf(k) < 0);
    if (mal.length) console.log('⚠ GHL ha puesto otra clave a: ' + mal.join(', ') + ' → renómbrala en Settings → Custom Fields');
  }

  // B5 · etiquetas
  const tg = await ghl(T, 'GET', '/locations/' + loc.id + '/tags');
  const hayTg = new Set((tg.tags || []).map((t) => String(t.name).toLowerCase()));
  for (const e of ETIQUETAS) {
    if (hayTg.has(e)) { console.log('✓ etiqueta ' + e); continue; }
    hacer('crear etiqueta ' + e);
    if (aplicar) await ghl(T, 'POST', '/locations/' + loc.id + '/tags', { name: e });
  }

  // B6 · calendario «Visita técnica» con el horario del cliente
  const cal = await ghl(T, 'GET', '/calendars/?locationId=' + loc.id, null, '2021-04-15');
  const nombreCal = cli.calendario && cli.calendario.nombre || 'Visita técnica';
  if ((cal.calendars || []).some((c) => c.name === nombreCal)) console.log('✓ calendario ' + nombreCal);
  else {
    hacer('crear calendario «' + nombreCal + '»');
    if (aplicar) await ghl(T, 'POST', '/calendars/', Object.assign({
      locationId: loc.id, name: nombreCal, calendarType: 'event', slotDuration: 60, slotInterval: 60,
      description: 'Visita técnica a la vivienda'
    }, cli.calendario && cli.calendario.openHours ? { openHours: cli.calendario.openHours } : {}), '2021-04-15');
  }

  console.log('\nHecho. Solo por interfaz: pipeline «Reformas», workflows y guardar la plantilla (guía, C4-C6).');
  console.log('Subcuenta: ' + loc.id + ' · entrar: https://app.qualivo.io/v2/location/' + loc.id + '/dashboard');
}

if (require.main === module) {
  let cli;
  try { cli = JSON.parse(fs.readFileSync(archivo, 'utf8')); } catch (e) { console.error('Uso: … ghl-alta-subcuenta.js cliente.json [--aplicar]'); process.exit(1); }
  main(cli).catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
}
module.exports = { main, CAMPOS, ETIQUETAS, QUALIVO };
