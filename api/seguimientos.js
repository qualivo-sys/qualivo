// Agente de seguimientos (cron diario, vercel.json → 07:15 UTC).
// Recorre TODAS las oportunidades abiertas de todos los pipelines y detecta las que llevan
// demasiado tiempo paradas en la misma etapa. Para cada atasco crea UNA tarea
// en GoHighLevel con el siguiente movimiento ya escrito y, si procede, sube la
// puntuación de señal. No manda nada al cliente: propone la acción a la persona.
//
// Regla de oro: una tarea por oportunidad y etapa. La etiqueta `atasco-<etapa>-<n>`
// en el contacto evita repetir la misma tarea cada mañana.
//
// GET /api/seguimientos/?dry=1 devuelve lo que haría sin escribir nada.

const R = require('./_radiografia');
const S = require('./_secuencia');   // PREGUNTA: la pregunta con número por cuello

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';
const RESERVA = 'https://api.leadconnectorhq.com/widget/booking/zBlsw8BEKA2zah81YlOl';
const MAX_TAREAS = 40;

// Reglas por etapa: a los N días parados, esta es la acción. Se evalúan de mayor
// a menor antigüedad, así una oportunidad muy vieja recibe la acción más fuerte.
// `patron` casa con el nombre de la etapa en minúsculas.
const REGLAS = [
  { patron: /nuevo lead/, dias: 2, clave: 'nuevo-2', prioridad: true,
    titulo: 'Primer contacto pendiente',
    accion: 'Lleva 2 días sin tocar. Llama o escribe hoy: es el momento en que más barato sale.' },
  { patron: /radiograf/, dias: 2, clave: 'radiografia-2', prioridad: true,
    titulo: 'Hizo la radiografía y nadie le ha preguntado',
    accion: 'Manda la pregunta con número de su cuello de botella. Si contesta con la cifra, tienes la conversación abierta.' },
  { patron: /contactad/, dias: 5, clave: 'contactado-5', prioridad: false,
    titulo: 'Segundo toque',
    accion: 'Cinco días desde el primer contacto. Segundo toque con algo nuevo: un caso parecido, un dato, una respuesta a lo que preguntó. No un «¿lo has visto?».' },
  { patron: /call agendada|reuni[oó]n agendada/, dias: 1, clave: 'agendada-1', prioridad: true,
    titulo: '¿Se hizo la llamada?',
    accion: 'La cita ya pasó y la oportunidad sigue en «agendada». Si se hizo, muévela. Si no vino, escríbele hoy: el que no viene una vez viene la segunda si le escribes el mismo día.' },
  { patron: /call realizada|reuni[oó]n realizada/, dias: 3, clave: 'realizada-3', prioridad: true,
    titulo: 'Propuesta sin enviar',
    accion: 'Tres días desde la llamada y sin propuesta. Cuanto más tarda, más se enfría lo que se habló.' },
  { patron: /propuesta/, dias: 5, clave: 'propuesta-5', prioridad: true,
    titulo: 'Propuesta en silencio',
    accion: 'Cinco días sin respuesta. Este es el dinero más caro que tienes parado: ya pagaste por atraerlo, visitarlo y calcular el precio. Un toque que aporte algo, no un recordatorio.' },
  { patron: /propuesta/, dias: 15, clave: 'propuesta-15', prioridad: true,
    titulo: 'Propuesta muerta: cierre elegante',
    accion: 'Quince días. Toca el último mensaje: sin reproches, resume en una línea lo que ofrecías y deja la puerta abierta. «Ahora no» y «no» son respuestas distintas.' },
  { patron: /respondi/, dias: 2, clave: 'respondio-2', prioridad: true,
    titulo: 'Contestó y se quedó ahí',
    accion: 'Contestó a un mensaje en frío y lleva días sin seguimiento. Es el contacto más caliente que hay: alguien que ya levantó la mano. Puente a los 20 minutos hoy.' },
  { patron: /respondi/, dias: 7, clave: 'respondio-7', prioridad: true,
    titulo: 'Contestó hace una semana y sigue parado',
    accion: 'Una semana desde que contestó. Se enfría. Un último intento con algo concreto para él, y si no, a seguimiento largo.' },
  { patron: /conversaci[oó]n abierta/, dias: 4, clave: 'conversacion-4', prioridad: true,
    titulo: 'Conversación abierta sin siguiente paso',
    accion: 'La conversación está viva pero no hay nada agendado. Propón hora concreta: dos opciones de día, no «cuando te venga bien».' },
  { patron: /oferta enviada/, dias: 5, clave: 'oferta-5', prioridad: true,
    titulo: 'Oferta en silencio',
    accion: 'Cinco días sin respuesta a la oferta. Un toque que aporte algo, no un recordatorio.' },
  { patron: /prospecto/, dias: 14, clave: 'prospecto-14', prioridad: false,
    titulo: 'Prospecto sin tocar',
    accion: 'Dos semanas en la lista sin ningún contacto. O se trabaja esta semana o se saca del pipeline: un pipeline con gente muerta miente sobre lo que tienes.' },
  { patron: /^seguimiento|m[aá]s adelante/, dias: 30, clave: 'seguimiento-30', prioridad: false,
    titulo: 'Toque de los 30 días',
    accion: 'Un mes esperando. Mensaje corto con algo útil y sin pedir nada. Si no contesta, se cierra y pasa a reactivación.' },
  { patron: /tibio/, dias: 30, clave: 'tibio-30', prioridad: false,
    titulo: 'Toque de los 30 días',
    accion: 'Un mes en tibio. Un mensaje corto con algo útil y sin pedir nada. Si no contesta, se cierra como perdido y se queda para reactivación.' }
];

function dias(desde) {
  const t = Date.parse(desde || '');
  return t ? (Date.now() - t) / 86400000 : 0;
}

async function ghlJson(url, headers, opciones) {
  const r = await fetch(url, Object.assign({ headers }, opciones || {}));
  if (!r.ok) throw new Error(url.split('?')[0].split('/').slice(-2).join('/') + ' ' + r.status + ': ' + (await r.text()).slice(0, 200));
  return r.json();
}

module.exports = async function handler(req, res) {
  const secreto = process.env.CRON_SECRET;
  const auth = String(req.headers.authorization || '');
  if (!secreto || auth !== 'Bearer ' + secreto) return res.status(401).json({ ok: false, error: 'unauthorized' });
  const apiKey = process.env.GHL_API_KEY, locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) return res.status(500).json({ ok: false, error: 'not_configured' });
  const ghl = { Authorization: 'Bearer ' + apiKey, Version: GHL_VERSION, 'Content-Type': 'application/json' };
  const seco = String((req.query || {}).dry || '') === '1';

  const resumen = { revisadas: 0, atascadas: 0, tareas: 0, saltadas: 0, errores: [], detalle: [] };

  try {
    // Etapas de todos los pipelines, por id
    const pls = await ghlJson(GHL_BASE + '/opportunities/pipelines?locationId=' + locationId, ghl);
    const etapa = {}, embudo = {};
    (pls.pipelines || []).forEach(function (p) {
      (p.stages || []).forEach(function (s) { etapa[s.id] = String(s.name); embudo[s.id] = String(p.name); });
    });

    // Oportunidades abiertas de todos los pipelines (paginado)
    const abiertas = [];
    let url = GHL_BASE + '/opportunities/search?location_id=' + locationId + '&status=open&limit=100';
    for (let p = 0; p < 10 && url; p++) {
      const d = await ghlJson(url, ghl);
      abiertas.push.apply(abiertas, d.opportunities || []);
      const sig = d.meta && d.meta.nextPageUrl;
      url = sig && (d.opportunities || []).length === 100 ? sig : null;
    }
    resumen.revisadas = abiertas.length;

    for (const op of abiertas) {
      if (resumen.tareas >= MAX_TAREAS) break;
      const nombreEtapa = (etapa[op.pipelineStageId] || '').toLowerCase();
      const parada = dias(op.lastStageChangeAt || op.updatedAt || op.createdAt);
      // La regla vencida más exigente (mayor número de días) es la que manda
      const regla = REGLAS.filter(function (x) { return x.patron.test(nombreEtapa) && parada >= x.dias; })
        .sort(function (a, b) { return b.dias - a.dias; })[0];
      if (!regla) continue;
      resumen.atascadas++;

      const contactId = op.contact && op.contact.id ? op.contact.id : op.contactId;
      if (!contactId) { resumen.saltadas++; continue; }
      const etiqueta = 'atasco-' + regla.clave;

      let contacto = {};
      try { contacto = (await ghlJson(GHL_BASE + '/contacts/' + contactId, ghl)).contact || {}; }
      catch (e) { resumen.errores.push('contacto ' + contactId + ': ' + String(e.message).slice(0, 80)); continue; }
      const tags = (contacto.tags || []).map(String);
      if (tags.includes(etiqueta)) { resumen.saltadas++; continue; }   // ya avisado
      if (tags.includes('sec-baja') || contacto.dnd === true) { resumen.saltadas++; continue; }

      const cuello = (tags.find(function (t) { return t.startsWith('cuello-'); }) || '').slice(7);
      const nombre = String(contacto.firstName || contacto.contactName || op.name || 'el contacto').split(' ')[0];
      const telefono = String(contacto.phone || '').replace(/[^\d]/g, '');
      const cuerpo = [
        regla.accion,
        cuello && R.NOMBRE[cuello] ? 'Su cuello de botella: ' + R.NOMBRE[cuello] + '. Pregunta que abre conversación: ' + (S.PREGUNTA[cuello] || '') : '',
        telefono ? 'WhatsApp: https://wa.me/' + telefono : '',
        'Calendario para cerrar los 20 minutos: ' + RESERVA,
        'Oportunidad: ' + (op.name || '') + ' · ' + Math.round(parada) + ' días en «' + (etapa[op.pipelineStageId] || '?') + '» (' + (embudo[op.pipelineStageId] || '?') + ')'
      ].filter(Boolean).join('\n\n');

      resumen.detalle.push({ oportunidad: op.name, embudo: embudo[op.pipelineStageId], etapa: etapa[op.pipelineStageId], dias: Math.round(parada), valor: op.monetaryValue || 0, accion: regla.titulo });
      if (seco) { resumen.tareas++; continue; }

      try {
        const vence = new Date(Date.now() + (regla.prioridad ? 4 : 24) * 3600 * 1000).toISOString();
        const t = await fetch(GHL_BASE + '/contacts/' + contactId + '/tasks', {
          method: 'POST', headers: ghl,
          body: JSON.stringify({
            title: (regla.prioridad ? '🔴 ' : '') + regla.titulo + ' · ' + nombre,
            body: cuerpo, dueDate: vence, completed: false, assignedTo: USUARIO_MAIKEL
          })
        });
        if (!t.ok) throw new Error('tarea ' + t.status);
        await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', { method: 'POST', headers: ghl, body: JSON.stringify({ tags: [etiqueta] }) });
        resumen.tareas++;
      } catch (e) {
        resumen.errores.push(String(op.name || contactId) + ': ' + String(e.message).slice(0, 80));
      }
    }
  } catch (e) {
    console.error('[seguimientos]', e);
    return res.status(502).json({ ok: false, error: String(e.message).slice(0, 200), resumen });
  }

  console.log('[seguimientos]', JSON.stringify({ revisadas: resumen.revisadas, atascadas: resumen.atascadas, tareas: resumen.tareas }));
  return res.status(200).json(Object.assign({ ok: true, seco: seco }, resumen));
};
