// Copilot de la demo comercial Qualivo Intelligence (qualivo.io/intelligence).
//
// Recibe una pregunta libre y un resumen del estado de la demo (datos
// SIMULADOS: contactos, campañas y fugas ficticios que calcula el navegador) y
// devuelve bloques estructurados que la interfaz pinta como tarjetas, tablas
// y métricas. Claude consulta el estado con herramientas y termina llamando a
// «responder». No inventa contactos: la interfaz descarta cualquier id que no
// exista, y aquí se filtran también.
//
// No toca GHL, WhatsApp, Vapi ni nada de producción. Solo lee lo que le manda
// la página. Si algo falla o tarda, la página contesta con su respuesta
// determinista, así que aquí se prioriza responder rápido o no responder.
//
// Tope de uso: por IP y total diario, en memoria de la instancia (suficiente
// para una demo sin enlazar desde la web). Límite de tokens por respuesta.
// La llamada al modelo va por HTTP directo, como el resto de /api (sin package.json).

const MODELO = process.env.ANTHROPIC_MODEL || 'claude-opus-5';
const SESION = require('./_intel-sesion.js');
// Modo real: solo estos campos de cada contacto llegan a Claude (aunque el navegador mande más)
const CAMPOS_REAL = ['id', 'nombre', 'sector', 'nivel', 'inversion', 'potente', 'etapa', 'estado', 'encaje', 'interes', 'intencion', 'riesgo', 'prioridad', 'probabilidad', 'siguienteAccion', 'quien', 'senales', 'requiereAtencion', 'altaHace', 'ultimaActividad', 'sinSeguimiento', 'esperaRespuestaNuestra', 'cita', 'llamada'];
const MAX_POR_IP = Number(process.env.INTELLIGENCE_MAX_IP || 30);       // al día
const MAX_TOTAL = Number(process.env.INTELLIGENCE_MAX_DIA || 400);      // al día, por instancia
const PLAZO_MS = 8500;
const MAX_VUELTAS = 3;

const uso = { dia: '', total: 0, ips: {} };
function contar(ip) {
  const hoy = new Date().toISOString().slice(0, 10);
  if (uso.dia !== hoy) { uso.dia = hoy; uso.total = 0; uso.ips = {}; }
  if (uso.total >= MAX_TOTAL) return false;
  if ((uso.ips[ip] || 0) >= MAX_POR_IP) return false;
  uso.total++; uso.ips[ip] = (uso.ips[ip] || 0) + 1;
  return true;
}

const HERRAMIENTAS = [
  {
    name: 'buscar_contactos',
    description: 'Filtra los contactos del estado. Todos los filtros son opcionales y se combinan. Devuelve como mucho 12, ordenados según «orden».',
    input_schema: {
      type: 'object',
      properties: {
        texto: { type: 'string', description: 'Busca en nombre, empresa, rol, producto, porqué y último mensaje' },
        prioridad: { type: 'string', enum: ['urgente', 'alta', 'media', 'baja'] },
        senal: { type: 'string', description: 'Nombre de señal, p. ej. «Intención alta», «Sin seguimiento», «Reactivación»' },
        etapa: { type: 'string' },
        requiereAtencion: { type: 'boolean' },
        minIntencion: { type: 'integer' },
        minEncaje: { type: 'integer' },
        minRiesgo: { type: 'integer' },
        estado: { type: 'string', enum: ['abierto', 'ganado', 'perdido'] },
        orden: { type: 'string', enum: ['prioridad', 'probabilidad', 'valor', 'riesgo', 'intencion'] }
      },
      additionalProperties: false
    }
  },
  {
    name: 'responder',
    description: 'Da la respuesta final a la persona. Úsala siempre para terminar. Los bloques se pintan en orden.',
    input_schema: {
      type: 'object',
      properties: {
        bloques: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              tipo: { type: 'string', enum: ['texto', 'contactos', 'tabla', 'metrica', 'accion'] },
              md: { type: 'string', description: 'tipo texto: 1-3 frases; **negrita** permitida' },
              ids: { type: 'array', items: { type: 'string' }, description: 'tipo contactos: ids reales (máx. 3)' },
              cols: { type: 'array', items: { type: 'string' } },
              filas: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, celdas: { type: 'array', items: { type: 'string' } } }, required: ['celdas'] } },
              items: { type: 'array', items: { type: 'object', properties: { v: { type: 'string' }, l: { type: 'string' } }, required: ['v', 'l'] } },
              texto: { type: 'string', description: 'tipo accion: acción sugerida en una frase' }
            },
            required: ['tipo']
          }
        }
      },
      required: ['bloques']
    }
  }
];

function sistema(ctx) {
  const t = ctx.terminos || {};
  return [
    (ctx.real ? 'Eres Qualivo Copilot con los datos reales de Qualivo de hoy. Hablas con Maikel, el fundador. Los nombres van abreviados a propósito.' : 'Eres Qualivo Copilot dentro de una demo comercial. La empresa' + (ctx.empresa ? ' se llama ' + ctx.empresa : '') + ' es del sector ' + ctx.sector + '. Todos los datos son simulados, pero hablas de ellos como si fueran los suyos.'),
    'Qualivo mira el recorrido completo (anuncio → ' + (t.venta || 'venta') + '), detecta dónde se escapan las oportunidades y pone agentes (WhatsApp y voz) y automatizaciones; cuando hace falta una persona, le pasa el contacto con todo el contexto. Acciones reales que puede proponer: WhatsApp del agente, llamada de la agente de voz, aviso ' + (t.comercial ? 'a ' + t.comercial : 'al comercial') + ', recordatorio de ' + (t.cita || 'cita') + ', recuperación de propuestas, reenganche, esperar y reactivar en la fecha que dijo.',
    'Reglas: responde en español de España, tuteando, claro y breve (como se lo dirías a un director en una reunión). Usa los términos del sector: ' + (t.contactos || 'contactos') + ', ' + (t.ventas || 'ventas') + '. Nunca inventes contactos, cifras ni campañas: usa solo lo que está en el estado o lo que devuelven las herramientas. Si algo no está en los datos, dilo. Cita contactos por su id en bloques «contactos» (máx. 3) o en filas de tabla con «id».',
    'Termina SIEMPRE llamando a la herramienta «responder». Si el estado de abajo ya basta, llama a «responder» directamente, sin otras herramientas: la respuesta tiene que llegar en pocos segundos.',
    '',
    'ESTADO (hora ' + ctx.hora + '):',
    JSON.stringify({ recorrido: ctx.recorrido, fugas: ctx.fugas, campanas: ctx.campanas, kpis: ctx.kpis, agendaSemana: ctx.agenda || null }),
    'CONTACTOS (resumen):',
    JSON.stringify((ctx.contactos || []).map(function (c) {
      return [c.id, c.nombre, c.empresa || c.rol, c.producto, c.etapa, c.valor, c.estado, c.prioridad, 'E' + c.encaje + '/A' + c.interes + '/I' + c.intencion + '/R' + c.riesgo, c.siguienteAccion, (c.senales || []).join('|'), c.masAdelante || '', c.llamada || '', c.cita || ''];
    })),
    'Columnas: id, nombre, empresa o rol, producto, etapa, valor €, estado, prioridad, Encaje/Actividad/Intención/Riesgo, siguiente acción, señales, «más adelante», última llamada del agente de voz, cita.'
  ].join('\n');
}

function buscar(ctx, q) {
  const orden = { urgente: 4, alta: 3, media: 2, baja: 1 };
  const txt = String(q.texto || '').toLowerCase();
  let l = (ctx.contactos || []).filter(function (c) {
    if (txt && [c.nombre, c.empresa, c.rol, c.producto, c.porque, c.ultimoMensaje, c.masAdelante].join(' ').toLowerCase().indexOf(txt) < 0) return false;
    if (q.prioridad && c.prioridad !== q.prioridad) return false;
    if (q.senal && !(c.senales || []).some(function (s) { return s.toLowerCase().indexOf(String(q.senal).toLowerCase()) >= 0; })) return false;
    if (q.etapa && String(c.etapa).toLowerCase().indexOf(String(q.etapa).toLowerCase()) < 0) return false;
    if (q.requiereAtencion != null && !!c.requiereAtencion !== q.requiereAtencion) return false;
    if (q.minIntencion != null && c.intencion < q.minIntencion) return false;
    if (q.minEncaje != null && c.encaje < q.minEncaje) return false;
    if (q.minRiesgo != null && c.riesgo < q.minRiesgo) return false;
    if (q.estado && c.estado !== q.estado) return false;
    return true;
  });
  const f = {
    prioridad: function (a, b) { return orden[b.prioridad] - orden[a.prioridad] || b.intencion - a.intencion; },
    probabilidad: function (a, b) { return b.probabilidad - a.probabilidad; },
    valor: function (a, b) { return b.valor - a.valor; },
    riesgo: function (a, b) { return b.riesgo - a.riesgo; },
    intencion: function (a, b) { return b.intencion - a.intencion; }
  }[q.orden || 'prioridad'];
  l.sort(f);
  return { total: l.length, contactos: l.slice(0, 12) };
}

async function llamar(cuerpo, restanteMs) {
  const ctl = new AbortController();
  const t = setTimeout(function () { ctl.abort(); }, Math.max(500, restanteMs));
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: ctl.signal,
      headers: Object.assign({ 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        process.env.ANTHROPIC_WORKSPACE_ID ? { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID } : {}),
      body: JSON.stringify(cuerpo)
    });
    if (!r.ok) throw new Error('anthropic ' + r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

function limpiarBloques(bloques, ctx) {
  const ids = {};
  (ctx.contactos || []).forEach(function (c) { ids[c.id] = true; });
  return (Array.isArray(bloques) ? bloques : []).slice(0, 8).map(function (b) {
    if (!b || typeof b !== 'object') return null;
    if (b.tipo === 'texto' && b.md) return { tipo: 'texto', md: String(b.md).slice(0, 900) };
    if (b.tipo === 'accion' && b.texto) return { tipo: 'accion', texto: String(b.texto).slice(0, 400) };
    if (b.tipo === 'contactos') { const l = (b.ids || []).filter(function (i) { return ids[i]; }).slice(0, 3); return l.length ? { tipo: 'contactos', ids: l } : null; }
    if (b.tipo === 'metrica' && Array.isArray(b.items)) return { tipo: 'metrica', items: b.items.slice(0, 4).map(function (m) { return { v: String(m.v).slice(0, 24), l: String(m.l).slice(0, 60) }; }) };
    if (b.tipo === 'tabla' && Array.isArray(b.cols) && Array.isArray(b.filas)) {
      return { tipo: 'tabla', cols: b.cols.slice(0, 5).map(String), filas: b.filas.slice(0, 12).map(function (f) {
        const o = { celdas: (f.celdas || []).slice(0, 5).map(function (x) { return String(x).slice(0, 80); }) };
        if (f.id && ids[f.id]) o.id = f.id;
        return o;
      }) };
    }
    return null;
  }).filter(Boolean);
}

module.exports = async function (req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'POST') return res.status(405).json({ error: 'solo POST' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'sin clave' });
  const ip = String(req.headers['x-forwarded-for'] || req.socket && req.socket.remoteAddress || 'x').split(',')[0].trim();
  if (!contar(ip)) return res.status(429).json({ error: 'límite de uso' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const pregunta = body && String(body.pregunta || '').trim().slice(0, 300);
  const ctx = body && body.contexto;
  const real = body && body.modo === 'real';
  if (real && !SESION.valida(req)) return res.status(401).json({ error: 'sin sesión' });
  if (!pregunta || !ctx || !Array.isArray(ctx.contactos) || ctx.contactos.length > (real ? 400 : 80) || JSON.stringify(ctx).length > (real ? 400000 : 150000)) {
    return res.status(400).json({ error: 'petición no válida' });
  }
  if (real) {
    ctx.contactos = ctx.contactos.map(function (c) { const o = {}; CAMPOS_REAL.forEach(function (k) { if (c[k] !== undefined) o[k] = c[k]; }); return o; });
    ctx.campanas = []; ctx.recorrido = []; ctx.real = true;
    // De la agenda solo pasan números
    const ag = ctx.agenda && typeof ctx.agenda === 'object' ? ctx.agenda : {};
    ctx.agenda = {}; Object.keys(ag).forEach(function (k) { if (typeof ag[k] === 'number') ctx.agenda[k] = ag[k]; });
  }

  const inicio = Date.now();
  const mensajes = [{ role: 'user', content: pregunta }];
  try {
    for (let v = 0; v < MAX_VUELTAS; v++) {
      const restante = PLAZO_MS - (Date.now() - inicio);
      if (restante < 800) break;
      const r = await llamar({
        model: MODELO, max_tokens: 1500, system: sistema(ctx), tools: HERRAMIENTAS, tool_choice: { type: 'auto' },
        output_config: { effort: 'low' }, messages: mensajes
      }, restante);
      if (r.stop_reason === 'refusal') break;
      const usos = (r.content || []).filter(function (b) { return b.type === 'tool_use'; });
      const fin = usos.filter(function (b) { return b.name === 'responder'; })[0];
      if (fin) {
        const bloques = limpiarBloques(fin.input && fin.input.bloques, ctx);
        if (bloques.length) return res.status(200).json({ bloques: bloques });
        break;
      }
      if (!usos.length) {
        const txt = (r.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('\n').trim();
        if (txt) return res.status(200).json({ bloques: [{ tipo: 'texto', md: txt.slice(0, 900) }] });
        break;
      }
      mensajes.push({ role: 'assistant', content: r.content });
      mensajes.push({ role: 'user', content: usos.map(function (u) {
        let out;
        try { out = u.name === 'buscar_contactos' ? buscar(ctx, u.input || {}) : { error: 'herramienta desconocida' }; } catch (e) { out = { error: 'no se pudo' }; }
        return { type: 'tool_result', tool_use_id: u.id, content: JSON.stringify(out) };
      }) });
    }
  } catch (e) {
    return res.status(504).json({ error: 'sin respuesta a tiempo' });
  }
  return res.status(502).json({ error: 'sin respuesta útil' });
};
