// Agente de base de datos (bajo demanda o cron semanal).
// Recorre los contactos dormidos del CRM y busca los que merecen un segundo intento:
// hicieron el diagnóstico y nunca pidieron el plan, pidieron el plan y no reservaron,
// fueron clientes, o se quedaron con un presupuesto sin cerrar. A cada grupo le
// escribe un motivo distinto — no una campaña igual para todos — y deja la tarea
// preparada con el mensaje y el enlace personal ya montados.
//
// El enlace personal (?l=<id de contacto>) hace que, si vuelve a hacer la
// radiografía, el resultado se guarde en SU ficha aunque no rellene formulario.
// Así una reactivación devuelve un dato nuevo, no solo un «hola».
//
// GET /api/reactivacion/?dry=1 enseña a quién escribiría, sin tocar nada.
// GET /api/reactivacion/?dias=120&max=25 ajusta el corte y el tope.

const R = require('./_radiografia');
const S = require('./_secuencia');

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';
const RADIOGRAFIA = 'https://qualivo.io/donde-se-rompe-tu-crecimiento/';
const RESERVA = 'https://api.leadconnectorhq.com/widget/booking/zBlsw8BEKA2zah81YlOl';
const DIAS_DORMIDO = 90;
const MAX = 25;

// Grupos, en orden de prioridad. El primero que case manda.
const GRUPOS = [
  {
    clave: 'cliente',
    nombre: 'Fue cliente',
    casa: function (t) { return t.includes('cliente-ganado') || t.includes('cliente-activo'); },
    motivo: 'Ya trabajó contigo. Sabe cómo trabajas y no hay que explicar nada.',
    mensaje: function (n) {
      return 'Hola ' + n + ', soy Maikel. Hace tiempo que no hablamos y me ha venido tu caso a la cabeza. ' +
        'Una pregunta rápida, sin vender nada: de lo que montamos entonces, ¿qué sigue funcionando y qué se ha caído? ' +
        'Con lo que me digas te digo si hay algo que valga la pena retocar.';
    }
  },
  {
    clave: 'propuesta-sin-cierre',
    nombre: 'Recibió propuesta y no cerró',
    casa: function (t) { return t.includes('propuesta-enviada') || t.includes('presupuesto-enviado'); },
    motivo: 'Le costó una reunión y una propuesta. Es el contacto más caro que hay dormido.',
    mensaje: function (n) {
      return 'Hola ' + n + ', soy Maikel. Te mandé una propuesta hace un tiempo y se quedó ahí, cosa que pasa y no pasa nada. ' +
        'No te la voy a volver a mandar. Solo quiero saber una cosa: ¿aquello se resolvió por otro lado o sigue igual? ' +
        'Si sigue igual, te digo por dónde empezaría hoy, que no es lo mismo que hace unos meses.';
    }
  },
  {
    clave: 'plan-sin-reunion',
    nombre: 'Pidió el plan y no reservó',
    casa: function (t) { return t.includes('diagnostico-crecimiento'); },
    motivo: 'Dejó el correo, se llevó el plan y no volvió. Sabemos exactamente qué le sale roto.',
    mensaje: function (n, cuello) {
      const dim = cuello && R.NOMBRE[cuello] ? R.NOMBRE[cuello].toLowerCase() : 'tu punto más flojo';
      const preg = cuello && S.PREGUNTA[cuello] ? S.PREGUNTA[cuello] : '¿qué se ha movido desde entonces?';
      return 'Hola ' + n + ', soy Maikel. Hace unos meses hiciste la radiografía y te salió ' + dim + ' como cuello de botella. ' +
        'Sin rodeos: ' + preg + ' Si me dices el número te digo en dos líneas cuánto es eso al año.';
    }
  },
  {
    clave: 'radiografia-anonima',
    nombre: 'Hizo la radiografía sin dejar datos',
    casa: function (t) { return t.includes('radiografia-anonima'); },
    motivo: 'Llegó hasta el resultado y no pidió el plan. Le interesa el tema pero no dio el paso.',
    mensaje: function (n, cuello) {
      const dim = cuello && R.NOMBRE[cuello] ? R.NOMBRE[cuello].toLowerCase() : 'un punto concreto';
      return 'Hola ' + n + ', soy Maikel. Hiciste la radiografía y te salió ' + dim + ', pero no llegaste a pedir el plan de 30 días. ' +
        'Te lo mando sin que tengas que rellenar nada, si lo quieres. Dime que sí y va.';
    }
  },
  {
    clave: 'nunca-avanzo',
    nombre: 'Entró y nunca avanzó',
    casa: function (t) { return t.includes('qualivo-landing') || t.includes('desde-hero'); },
    motivo: 'Dejó sus datos en su día y no se le volvió a tocar.',
    mensaje: function (n) {
      return 'Hola ' + n + ', soy Maikel. Dejaste tus datos en la web hace tiempo y creo que nunca te llamamos, así que empiezo pidiendo perdón. ' +
        'Si aquello sigue en pie, dime en una línea qué te preocupa ahora del crecimiento y te contesto con algo útil. ' +
        'Y si ya no aplica, dímelo y no te molesto más.';
    }
  }
];

// Etiquetas que sacan a alguien de la reactivación
const EXCLUIR = ['sec-baja', 'no-molestar', 'reactivado', 'reunion-reservada'];

async function ghlJson(url, headers, opciones) {
  const r = await fetch(url, Object.assign({ headers }, opciones || {}));
  if (!r.ok) throw new Error(url.split('?')[0].split('/').slice(-2).join('/') + ' ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return r.json();
}

async function buscar(tag, ghl, locationId) {
  const out = []; let page = 1;
  while (page <= 20) {
    const r = await fetch(GHL_BASE + '/contacts/search', {
      method: 'POST', headers: ghl,
      body: JSON.stringify({ locationId, page, pageLimit: 100, filters: [{ field: 'tags', operator: 'contains', value: tag }] })
    });
    if (!r.ok) throw new Error('search ' + r.status);
    const d = await r.json(); const lote = d.contacts || [];
    out.push.apply(out, lote); if (lote.length < 100) break; page++;
  }
  return out;
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const apiKey = process.env.GHL_API_KEY, locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return res.status(500).json({ ok: false, error: 'not_configured' });
  const ghl = { Authorization: 'Bearer ' + apiKey, Version: GHL_VERSION, 'Content-Type': 'application/json' };

  const q = req.query || {};
  const seco = String(q.dry || '') === '1';
  const corte = Math.max(30, Math.min(730, parseInt(q.dias, 10) || DIAS_DORMIDO));
  const tope = Math.max(1, Math.min(100, parseInt(q.max, 10) || MAX));

  const resumen = { candidatos: 0, tareas: 0, porGrupo: {}, muestra: [], errores: [] };

  try {
    // Universo: todo el que alguna vez pasó por la web o el diagnóstico
    const vistos = {};
    for (const tag of ['qualivo-landing', 'diagnostico-crecimiento', 'radiografia-anonima', 'cliente-ganado']) {
      let lote = [];
      try { lote = await buscar(tag, ghl, locationId); }
      catch (e) { resumen.errores.push(tag + ': ' + String(e.message).slice(0, 80)); continue; }
      lote.forEach(function (c) { vistos[c.id] = c; });
    }

    const ahora = Date.now();
    const candidatos = [];
    Object.keys(vistos).forEach(function (id) {
      const c = vistos[id];
      const tags = (c.tags || []).map(String);
      if (EXCLUIR.some(function (t) { return tags.includes(t); }) || c.dnd === true) return;
      const ultimo = Date.parse(c.dateUpdated || c.dateAdded || '') || 0;
      if (!ultimo || (ahora - ultimo) / 86400000 < corte) return;
      const grupo = GRUPOS.filter(function (g) { return g.casa(tags); })[0];
      if (!grupo) return;
      candidatos.push({ c: c, tags: tags, grupo: grupo, dormido: Math.round((ahora - ultimo) / 86400000) });
    });
    // Los más caros primero: cliente y propuesta antes que el resto; a igualdad, el más reciente
    const orden = GRUPOS.map(function (g) { return g.clave; });
    candidatos.sort(function (a, b) {
      const d = orden.indexOf(a.grupo.clave) - orden.indexOf(b.grupo.clave);
      return d !== 0 ? d : a.dormido - b.dormido;
    });
    resumen.candidatos = candidatos.length;
    candidatos.forEach(function (x) { resumen.porGrupo[x.grupo.nombre] = (resumen.porGrupo[x.grupo.nombre] || 0) + 1; });

    for (const x of candidatos.slice(0, tope)) {
      const c = x.c;
      const nombre = String(c.firstName || c.contactName || '').trim().split(' ')[0] || 'hola';
      const cuello = (x.tags.find(function (t) { return t.startsWith('cuello-'); }) || '').slice(7);
      const texto = x.grupo.mensaje(nombre, cuello);
      const telefono = String(c.phone || '').replace(/[^\d]/g, '');
      const enlace = RADIOGRAFIA + '?l=' + c.id + '&utm_source=crm&utm_medium=reactivacion&utm_campaign=' + x.grupo.clave;
      const cuerpo = [
        'Motivo: ' + x.grupo.motivo,
        'Lleva ' + x.dormido + ' días sin movimiento' + (cuello && R.NOMBRE[cuello] ? ' · cuello: ' + R.NOMBRE[cuello] : '') + '.',
        'Mensaje propuesto:\n' + texto,
        telefono ? 'Enviar por WhatsApp: https://wa.me/' + telefono + '?text=' + encodeURIComponent(texto) : (c.email ? 'Enviar por correo a ' + c.email : ''),
        'Si quieres que vuelva a hacer la radiografía, mándale este enlace (el resultado se guarda en su ficha aunque no rellene nada):\n' + enlace,
        'Calendario: ' + RESERVA
      ].filter(Boolean).join('\n\n');

      resumen.muestra.push({ nombre: c.firstName || c.email, grupo: x.grupo.nombre, dormido: x.dormido });
      if (seco) { resumen.tareas++; continue; }
      try {
        const t = await fetch(GHL_BASE + '/contacts/' + c.id + '/tasks', {
          method: 'POST', headers: ghl,
          body: JSON.stringify({
            title: 'Reactivar · ' + x.grupo.nombre + ' · ' + (c.firstName || c.email || c.id),
            body: cuerpo,
            dueDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
            completed: false, assignedTo: USUARIO_MAIKEL
          })
        });
        if (!t.ok) throw new Error('tarea ' + t.status);
        await fetch(GHL_BASE + '/contacts/' + c.id + '/tags', { method: 'POST', headers: ghl, body: JSON.stringify({ tags: ['reactivado', 'reactivacion-' + x.grupo.clave] }) });
        resumen.tareas++;
      } catch (e) {
        resumen.errores.push(String(c.email || c.id) + ': ' + String(e.message).slice(0, 80));
      }
    }
  } catch (e) {
    console.error('[reactivacion]', e);
    return res.status(502).json({ ok: false, error: String(e.message).slice(0, 200), resumen });
  }

  console.log('[reactivacion]', JSON.stringify({ candidatos: resumen.candidatos, tareas: resumen.tareas }));
  return res.status(200).json(Object.assign({ ok: true, seco: seco, corte_dias: corte }, resumen));
};
