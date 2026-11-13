// Escenario de demostración «Laura Vidal · Escuela Norte» para el anuncio de formación V2.
// Datos ficticios. NO envía WhatsApp, emails ni llamadas: Laura se crea SIN teléfono y SIN email, así que
// ningún workflow puede escribirle. Sin etiqueta meta-lead-*, así que no manda señales a Meta
// (api/senales-meta.js y api/seguimientos.js solo miran contactos con meta-lead-*).
//
//   Crear:   node automatizaciones/demo/escenario-laura.js --qualivo [--seco]
//   Borrar:  node automatizaciones/demo/escenario-laura.js --qualivo --borrar [--seco]
//
// --qualivo: usa GHL de Qualivo (GHL_API_KEY / GHL_LOCATION_ID), decisión de Maikel del 13-nov: probar ahí y
// borrar al terminar. Sin --qualivo usa DEMO_GHL_API_KEY / DEMO_GHL_LOCATION_ID (subcuenta de demostración).
// Nunca corre en subcuentas de clientes. Todo lo que crea lleva la etiqueta «demo-anuncio» y se borra por ella.
const API = 'https://services.leadconnectorhq.com';
const QUALIVO = process.argv.includes('--qualivo');
const KEY = QUALIVO ? process.env.GHL_API_KEY : process.env.DEMO_GHL_API_KEY;
const LOC = QUALIVO ? process.env.GHL_LOCATION_ID : process.env.DEMO_GHL_LOCATION_ID;
const SECO = process.argv.includes('--seco'), BORRAR = process.argv.includes('--borrar');
const CLIENTES = ['0bISaCnoTBNRmYQbLdbf', '5Eylu2xUj1SoQaQnfmF8'];
const ETIQUETA = 'demo-anuncio';

const PREGUNTA = '¿El curso de tarde se puede compaginar con el trabajo? Salgo a las 17:00.';
const LAURA = { firstName: 'Laura', lastName: 'Vidal', companyName: 'Escuela Norte',
  source: 'Instagram · Anuncio formación V2', tags: [ETIQUETA, 'origen-instagram', 'curso-tarde'] };
const NOTA_HISTORIAL = ['Historial (demo)', '· Solicitud desde formulario de Instagram · curso de tarde',
  '· Pregunta: «' + PREGUNTA + '»', '· WhatsApp de respuesta enviado a los 2 minutos', '· Llamada del equipo: ver nota de llamada'].join('\n');
const NOTA_LLAMADA = ['📞 Llamada (demo) · 4 min',
  'Resumen: Laura trabaja hasta las 17:00 y le encaja el grupo de tarde (18:30). Pregunta por el precio y si hay plazas en enero.',
  'Siguiente paso: enviarle el calendario de enero y la ficha del curso. Interés alto.'].join('\n');

async function ghl(metodo, ruta, cuerpo) {
  if (SECO && metodo !== 'GET' && !(metodo === 'POST' && /\/search/.test(ruta))) {
    console.log('[seco]', metodo, ruta.split('?')[0], cuerpo ? JSON.stringify(cuerpo).slice(0, 140) : ''); return { _seco: true };
  }
  const r = await fetch(API + ruta, { method: metodo, body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    headers: { Authorization: 'Bearer ' + KEY, Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json' } });
  const t = await r.text();
  if (!r.ok) throw new Error(metodo + ' ' + ruta.split('?')[0] + ' → ' + r.status + ' ' + t.slice(0, 200));
  return t ? JSON.parse(t) : {};
}

async function demos() {
  const d = await ghl('POST', '/contacts/search', { locationId: LOC, pageLimit: 100, filters: [{ field: 'tags', operator: 'contains', value: ETIQUETA }] });
  return d.contacts || [];
}

async function crear() {
  if ((await demos()).length) throw new Error('Ya hay contactos con «' + ETIQUETA + '». Bórralos antes o úsalos.');
  const campos = (await ghl('GET', '/locations/' + LOC + '/customFields?model=contact')).customFields || [];
  const preg = campos.find((f) => f.fieldKey === 'contact.wa__pregunta');
  const c = await ghl('POST', '/contacts/', { locationId: LOC, ...LAURA,
    customFields: preg ? [{ id: preg.id, field_value: PREGUNTA }] : [] });
  const cid = (c.contact || {}).id || 'demo-contacto';
  const pipes = (await ghl('GET', '/opportunities/pipelines?locationId=' + LOC)).pipelines || [];
  const p = pipes.find((x) => /prospecci/i.test(x.name)) || pipes[0];
  const etapa = p.stages.find((s) => /^nuevo/i.test(s.name)) || p.stages[0];
  await ghl('POST', '/opportunities/', { locationId: LOC, pipelineId: p.id, pipelineStageId: etapa.id, contactId: cid,
    name: 'Escuela Norte · Laura Vidal · Curso de tarde (DEMO)', status: 'open', source: LAURA.source });
  await ghl('POST', '/contacts/' + cid + '/notes', { body: NOTA_HISTORIAL });
  await ghl('POST', '/contacts/' + cid + '/notes', { body: NOTA_LLAMADA });
  console.log('Creada:', cid, '· oportunidad en', p.name, '→', etapa.name, '· sin teléfono ni email · nada enviado');
}

async function borrar() {
  const cs = await demos();
  for (const c of cs) {
    if (!(c.tags || []).includes(ETIQUETA)) continue;
    const ops = (await ghl('GET', '/opportunities/search?location_id=' + LOC + '&contact_id=' + c.id)).opportunities || [];
    for (const o of ops) await ghl('DELETE', '/opportunities/' + o.id);
    await ghl('DELETE', '/contacts/' + c.id); // borra también sus notas y tareas
    console.log('Borrado:', c.id, '+', ops.length, 'oportunidad(es)');
  }
  if (!SECO) { const quedan = await demos(); console.log(quedan.length ? '⚠ Quedan ' + quedan.length : 'Comprobado: no queda nada con «' + ETIQUETA + '».'); }
}

(async () => {
  if (!KEY || !LOC) throw new Error('Faltan la clave y la subcuenta.');
  if (CLIENTES.includes(LOC)) throw new Error('Es una subcuenta de cliente. No se toca.');
  if (QUALIVO && LOC !== 'bHGMuZEGUESZmVoNv9HT') throw new Error('--qualivo pero la subcuenta no es la de Qualivo.');
  await (BORRAR ? borrar() : crear());
})().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
