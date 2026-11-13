// Escenario de demostración «Laura Vidal · Escuela Norte» para el anuncio de formación V2.
// SOLO para la subcuenta de demostración de Qualivo. Datos ficticios. No envía WhatsApp, emails ni llamadas:
// crea contacto, oportunidad, nota de llamada y nota de historial por API.
//
//   DEMO_GHL_API_KEY=… DEMO_GHL_LOCATION_ID=… node automatizaciones/demo/escenario-laura.js [--seco]
//
// --seco: enseña lo que haría sin escribir nada. Se niega a correr en Qualivo o en subcuentas de clientes.
const API = 'https://services.leadconnectorhq.com';
const KEY = process.env.DEMO_GHL_API_KEY, LOC = process.env.DEMO_GHL_LOCATION_ID;
const SECO = process.argv.includes('--seco');
const PROHIBIDAS = ['bHGMuZEGUESZmVoNv9HT', '0bISaCnoTBNRmYQbLdbf', '5Eylu2xUj1SoQaQnfmF8'];

const LAURA = {
  firstName: 'Laura', lastName: 'Vidal', companyName: 'Escuela Norte',
  email: 'laura.vidal@ejemplo.invalid', // dominio .invalid: nunca puede recibir correo
  source: 'Instagram · Anuncio formación V2', tags: ['demo', 'origen-instagram', 'curso-tarde'],
};
const PREGUNTA = '¿El curso de tarde se puede compaginar con el trabajo? Salgo a las 17:00.';
const NOTA_LLAMADA = [
  '📞 Llamada (demo) · 4 min',
  'Resumen: Laura trabaja hasta las 17:00 y le encaja el grupo de tarde (18:30). Pregunta por el precio y si hay plazas en enero.',
  'Siguiente paso: enviarle el calendario de enero y la ficha del curso. Interés alto.',
].join('\n');
const NOTA_HISTORIAL = [
  'Historial (demo)',
  '· Solicitud desde formulario de Instagram · curso de tarde',
  '· Pregunta: «' + PREGUNTA + '»',
  '· WhatsApp de respuesta enviado a los 2 minutos',
  '· Llamada del equipo: ver nota de llamada',
].join('\n');

async function ghl(metodo, ruta, cuerpo) {
  if (SECO && metodo !== 'GET') { console.log('[seco]', metodo, ruta, cuerpo ? JSON.stringify(cuerpo).slice(0, 160) : ''); return { _seco: true }; }
  const r = await fetch(API + ruta, { method: metodo, body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    headers: { Authorization: 'Bearer ' + KEY, Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json' } });
  const t = await r.text();
  if (!r.ok) throw new Error(metodo + ' ' + ruta.split('?')[0] + ' → ' + r.status + ' ' + t.slice(0, 200));
  return t ? JSON.parse(t) : {};
}

async function main() {
  if (!KEY || !LOC) throw new Error('Faltan DEMO_GHL_API_KEY y DEMO_GHL_LOCATION_ID (subcuenta de demostración).');
  if (PROHIBIDAS.includes(LOC)) throw new Error('Esa subcuenta no es la de demostración. No se toca.');
  const loc = await ghl('GET', '/locations/' + LOC);
  const nombre = ((loc.location || {}).name || '');
  if (!/demo/i.test(nombre)) throw new Error('La subcuenta se llama «' + nombre + '»; tiene que llevar «demo» en el nombre.');
  console.log('Subcuenta:', nombre);

  // Campo «Pregunta del formulario» (lo crea si no existe)
  const campos = (await ghl('GET', '/locations/' + LOC + '/customFields?model=contact')).customFields || [];
  let campo = campos.find((f) => f.fieldKey === 'contact.pregunta_formulario');
  if (!campo) campo = (await ghl('POST', '/locations/' + LOC + '/customFields', { name: 'Pregunta del formulario', dataType: 'LARGE_TEXT', model: 'contact' })).customField || { id: 'nuevo' };
  let curso = campos.find((f) => f.fieldKey === 'contact.curso');
  if (!curso) curso = (await ghl('POST', '/locations/' + LOC + '/customFields', { name: 'Curso', dataType: 'TEXT', model: 'contact' })).customField || { id: 'nuevo' };

  const c = await ghl('POST', '/contacts/upsert', { locationId: LOC, ...LAURA,
    customFields: [{ id: campo.id, field_value: PREGUNTA }, { id: curso.id, field_value: 'Curso de tarde' }] });
  const cid = (c.contact || {}).id || 'demo-contacto';
  console.log('Contacto:', cid);

  const pipes = (await ghl('GET', '/opportunities/pipelines?locationId=' + LOC)).pipelines || [];
  const p = pipes[0];
  if (p) await ghl('POST', '/opportunities/', { locationId: LOC, pipelineId: p.id, pipelineStageId: p.stages[0].id,
    contactId: cid, name: 'Escuela Norte · Laura Vidal · Curso de tarde', status: 'open', source: LAURA.source });
  else console.log('⚠ La subcuenta no tiene pipeline: créalo en la interfaz y vuelve a lanzar.');

  await ghl('POST', '/contacts/' + cid + '/notes', { body: NOTA_HISTORIAL });
  await ghl('POST', '/contacts/' + cid + '/notes', { body: NOTA_LLAMADA });
  console.log('Listo. Nada enviado a nadie.');
}
main().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
