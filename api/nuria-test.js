// Nuria · test de sueño de la web (nr.nuriaroure.com/test-patrones).
// Antes de ver el resultado, la persona deja nombre, email y teléfono. Este endpoint:
//   1) crea o actualiza el contacto en Kliking (origen «Test patrones web») con sus etiquetas;
//   2) lo mete en el pipeline «Test de calidad», etapa «Rellena Test Web» (sin duplicar si ya estaba);
//   3) avisa a las comerciales con una tarea asignada en Kliking (les llega la notificación) y una nota
//      con el resultado y si ha dado permiso para que la llamen.
// No guarda nada aquí ni lo escribe en logs. Comerciales a avisar: NURIA_TEST_AVISAR (ids de usuario
// de Kliking separados por comas); si no está, Pepi.

const GHL = 'https://services.leadconnectorhq.com';
const PIPELINE = 'RpUHQDDmHuRVrLDqzGeC';            // Test de calidad
const ETAPA = '43c8dc46-2874-4a55-aaec-00416e6cd223'; // Rellena Test Web
const PEPI = 'x8PibYJBn02iD2DuSSxE';
const MAIKEL_API = 'G6oafD4GUFk4DLX0CkfO';
const ORIGENES = ['https://nr.nuriaroure.com', 'https://nuriaroure.com', 'https://www.nuriaroure.com'];
const PATRONES = { control: 'Control', anticipacion: 'Anticipación', compensacion: 'Compensación' };
const NIVELES = ['incipiente', 'instalado', 'arraigado'];
const TEXTO_LLAMADA = 'Acepto que el equipo de Nuria Roure me llame por teléfono para conocer mi caso y comentar mi resultado. Me llamarán desde un número que empieza por 6.';
const CAMPO_LLAMADA = 'pcO5PbesGTnsMv0t00GZ';   // campo de contacto «Acepta que la llamen (número que empieza por 6)»
const OPCION_CAMPO = 'Acepto que el equipo de Nuria Roure me llame por teléfono para conocer mi caso. Me llamarán desde un número que empieza por 6.';   // debe coincidir con la opción del campo en Kliking
const recientes = new Map();

function clave() { return process.env.NURIA_GHL_API_KEY_ESCRITURA || process.env.NURIA_GHL_API_KEY; }
function hoyMadrid() { return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Madrid' }).format(new Date()); }
function limpio(v, n) { return String(v == null ? '' : v).replace(/[<>\u0000-\u001f]/g, ' ').trim().slice(0, n); }
function slug(v) { return limpio(v, 40).toLowerCase().replace(/[^a-z0-9-]/g, ''); }

function telefono(v) {
  let t = String(v || '').replace(/[^\d+]/g, '');
  if (t.indexOf('00') === 0) t = '+' + t.slice(2);
  if (/^[6789]\d{8}$/.test(t)) t = '+34' + t;
  return /^\+\d{8,15}$/.test(t) ? t : '';
}

function leerCuerpo(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.body === 'string') { try { return Promise.resolve(JSON.parse(req.body)); } catch (e) { return Promise.resolve({}); } }
  return new Promise(function (ok) {
    let s = '';
    req.on('data', function (c) { s += c; if (s.length > 5000) req.destroy(); });
    req.on('end', function () { try { ok(JSON.parse(s)); } catch (e) { ok({}); } });
    req.on('error', function () { ok({}); });
  });
}

async function ghl(ruta, metodo, cuerpo) {
  const r = await fetch(GHL + ruta, {
    method: metodo,
    headers: { Authorization: 'Bearer ' + clave(), Version: '2021-07-28', Accept: 'application/json', 'Content-Type': 'application/json', 'User-Agent': 'QualivoNuria/1.0 (+https://qualivo.io)' },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  const d = await r.json().catch(function () { return {}; });
  if (!r.ok) throw new Error('GHL ' + ruta.split('?')[0] + ' ' + r.status);
  return d;
}

// Lo que se escribe en Kliking a partir de lo que manda la página. Separado para poder probarlo sin red.
function preparar(b) {
  const nombre = limpio(b.nombre, 60), email = limpio(b.email, 120).toLowerCase(), tel = telefono(b.telefono);
  if (limpio(b.web, 10)) return { error: 'bot' };                         // campo trampa
  if (!nombre || !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email) || !tel || b.privacidad !== true) return { error: 'datos' };
  const patron = PATRONES[slug(b.patron)] ? slug(b.patron) : '';
  const nivel = NIVELES.indexOf(slug(b.nivel)) >= 0 ? slug(b.nivel) : '';
  const llamada = b.llamada === true, dia = hoyMadrid();
  const tags = ['[completa test patrones web]', '[test patrones] ' + dia];
  if (patron) tags.push('[test patrón] ' + patron);
  if (nivel) tags.push('[test nivel] ' + nivel);
  tags.push(llamada ? '[acepta llamada] ' + dia : '[no acepta llamada]');
  const partes = nombre.split(/\s+/);
  const r = {
    sueno: ['horas', 'anos', 'medicacion', 'etapa'].map(function (k) { return [k, slug((b.respuestas || {})[k])]; }).filter(function (x) { return x[1]; })
  };
  const nota = [
    'Ha hecho el test de sueño de la web (' + dia + ').',
    'Datos que ha escrito: ' + nombre + ' · ' + email + ' · ' + tel + '.',
    'Patrón dominante: ' + (PATRONES[patron] || 'sin dato') + (nivel ? ' · nivel ' + nivel : '') + (b.indice != null ? ' (' + Number(b.indice) + '/6)' : '') + '.',
    r.sueno.length ? 'Respuestas: ' + r.sueno.map(function (x) { return x[0] + ' ' + x[1]; }).join(' · ') + '.' : '',
    llamada ? 'ACEPTA QUE LA LLAMEN. Texto aceptado: «' + TEXTO_LLAMADA + '» Fecha: ' + dia + '. Formulario: test-patrones.' : 'NO ha dado permiso para llamarla: contactar solo por email o WhatsApp si ella escribe.',
    b.url ? 'Página: ' + limpio(b.url, 300) : ''
  ].filter(Boolean).join('\n');
  return {
    contacto: { firstName: partes[0], lastName: partes.slice(1).join(' ') || undefined, email: email, phone: tel },
    tags: tags,
    oportunidad: { name: nombre + ' · Test web', pipelineStageId: ETAPA, status: 'open', source: 'Test patrones web' },
    tarea: { title: (llamada ? 'Llamar: ' : 'Contactar (sin permiso de llamada): ') + nombre + ' ha hecho el test web', body: nota, completed: false },
    nota: nota,
    llamada: llamada,
    clave: email
  };
}

async function handler(req, res) {
  const origen = req.headers.origin || '';
  res.setHeader('Access-Control-Allow-Origin', ORIGENES.indexOf(origen) >= 0 ? origen : ORIGENES[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const p = preparar(await leerCuerpo(req));
  if (p.error === 'bot') return res.status(200).json({ ok: true });
  if (p.error) return res.status(400).json({ ok: false, error: p.error });
  const loc = process.env.NURIA_GHL_LOCATION_ID;
  if (!clave() || !loc) return res.status(503).json({ ok: false });
  const ahora = Date.now();
  if (recientes.has(p.clave) && ahora - recientes.get(p.clave) < 10 * 60 * 1000) return res.status(200).json({ ok: true });
  if (recientes.size > 5000) recientes.clear();
  recientes.set(p.clave, ahora);
  try {
    // Se busca SOLO por email. No se usa el «upsert» de Kliking porque también junta por teléfono y hay
    // muchos contactos con teléfonos inventados (600 000 000): pisaría el nombre y el email de otra persona.
    // Si ya existe, no se cambian su nombre, email ni teléfono: lo que ha escrito va en la nota.
    const ya = await ghl('/contacts/search/duplicate?locationId=' + encodeURIComponent(loc) + '&email=' + encodeURIComponent(p.clave), 'GET').catch(function () { return {}; });
    let id = (ya.contact || {}).id;
    if (id) {
      if (!ya.contact.phone) await ghl('/contacts/' + id, 'PUT', { phone: p.contacto.phone }).catch(function () {});
    } else {
      const nuevo = Object.assign({ locationId: loc, source: 'Test patrones web' }, p.contacto);
      let c = await ghl('/contacts/', 'POST', nuevo).catch(function () { return null; });
      // Si Kliking no deja crearlo porque el teléfono ya es de otro contacto, se crea sin teléfono.
      if (!c || !(c.contact || {}).id) { delete nuevo.phone; c = await ghl('/contacts/', 'POST', nuevo); }
      id = (c.contact || {}).id;
    }
    if (!id) throw new Error('sin contacto');
    await ghl('/contacts/' + id + '/tags', 'POST', { tags: p.tags }).catch(function () {});
    // Mismo campo de consentimiento que la casilla de los formularios de Kliking («Acepta que la llamen»).
    if (p.llamada) await ghl('/contacts/' + id, 'PUT', { customFields: [{ id: CAMPO_LLAMADA, field_value: [OPCION_CAMPO] }] }).catch(function () {});
    // Pruebas internas (@qualivo.io): la tarea va al usuario API de Maikel y no molesta a las comerciales.
    const avisar = /@qualivo\.io$/.test(p.clave) ? [MAIKEL_API] : String(process.env.NURIA_TEST_AVISAR || PEPI).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    const vence = new Date(ahora + 30 * 60 * 1000).toISOString();
    await Promise.all([
      // Si ya está en el pipeline (abierta), no se mueve de etapa: la comercial ve la tarea y la nota.
      ghl('/opportunities/search?location_id=' + encodeURIComponent(loc) + '&pipeline_id=' + PIPELINE + '&contact_id=' + id + '&status=open', 'GET')
        .then(function (o) { if (!(o.opportunities || []).length) return ghl('/opportunities/', 'POST', Object.assign({ locationId: loc, pipelineId: PIPELINE, contactId: id }, p.oportunidad)); })
        .catch(function () {}),
      ghl('/contacts/' + id + '/notes', 'POST', { body: p.nota }).catch(function () {})
    ].concat(avisar.map(function (u) {
      return ghl('/contacts/' + id + '/tasks', 'POST', Object.assign({ dueDate: vence, assignedTo: u }, p.tarea)).catch(function () {});
    })));
    return res.status(200).json({ ok: true });
  } catch (e) {
    recientes.delete(p.clave);
    return res.status(502).json({ ok: false });
  }
}

module.exports = handler;
module.exports.preparar = preparar;
