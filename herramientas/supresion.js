#!/usr/bin/env node
// Supresión V1 desde la terminal, para cualquier agente antes de contactar.
//
//   node herramientas/supresion.js correo@empresa.com
//   node herramientas/supresion.js empresa.com otra.com
//   node herramientas/supresion.js --lista cuentas.csv      (una columna con correo o dominio)
//   node herramientas/supresion.js --refrescar               (vuelca la foto de Smartlead a la hoja)
//
// Necesita en el entorno GHL_API_KEY y GHL_LOCATION_ID, y SMARTLEAD_API_KEY
// (o GOOGLE_SA_JSON + SUPRESION_SHEET_ID para leer la foto de la hoja).
// Salida: una línea por entrada, LIBRE / BLOQUEADO / DESCONOCIDO, con los motivos.
// Código de salida 1 si alguna entrada está bloqueada o es desconocida.
const fs = require('fs');
const S = require('../api/_supresion.js');

(async function () {
  const args = process.argv.slice(2);
  if (args[0] === '--refrescar') {
    const n = await S.refrescarHoja();
    console.log('Hoja «' + S.PESTANA + '» actualizada con ' + n + ' filas de Smartlead.');
    return;
  }
  let entradas = args;
  if (args[0] === '--lista') {
    entradas = fs.readFileSync(args[1], 'utf8').split(/\r?\n/).map(function (l) { return l.split(/[;,\t]/)[0].trim(); }).filter(Boolean);
  }
  if (!entradas.length) { console.error('Uso: supresion.js correo@empresa.com | dominio.com | --lista archivo.csv | --refrescar'); process.exit(2); }
  const foto = process.env.SMARTLEAD_API_KEY ? await S.fotoSmartlead(false) : await S.fotoDesdeHoja();
  let mal = 0;
  for (const e of entradas) {
    const esCorreo = e.indexOf('@') > -1;
    const r = await S.consultar(esCorreo ? { email: e } : { dominio: e }, { foto: foto });
    const estado = r.bloqueado ? 'BLOQUEADO' : (r.avisos.length ? 'DESCONOCIDO' : 'LIBRE');
    if (estado !== 'LIBRE') mal++;
    const detalle = r.motivos.concat(r.avisos).join(' · ');
    console.log(estado.padEnd(11) + e + (r.contacto_previo ? '  [ya contactado antes]' : '') + (detalle ? '  — ' + detalle : ''));
  }
  process.exit(mal ? 1 : 0);
})().catch(function (e) { console.error('Error:', e && e.message); process.exit(2); });
