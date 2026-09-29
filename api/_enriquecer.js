// Ficha investigada: lo que se encuentra en internet sobre el NEGOCIO de un lead A o B.
//
// 29-sep, Maikel: «que en el CRM pueda tener la máxima información de los leads, porque ahora
// me está entrando poquita información; que se busque en internet información sobre las
// personas que me vayan entrando de este tipo de categoría». Cuando un A o B entra y se le
// retiene el primer WhatsApp (retenerParaMaikel), se investiga el negocio con Claude y la
// búsqueda web del servidor, se deja una nota «FICHA INVESTIGADA» en GHL con las fuentes, y
// el aviso al móvil lleva el resumen en tres líneas.
//
// Solo información profesional y pública: qué vende, precios si son públicos, tamaño, sedes,
// web, anuncios, reseñas, redes del negocio y el cargo público de la persona si es claramente
// ella. Nada personal (domicilio, familia, vida privada). Cada dato con su fuente; lo que no
// se encuentra se dice, no se supone.
//
// Nunca bloquea: tiene un tope de tiempo (AbortController) y ante cualquier fallo devuelve
// null, y quien lo llama sigue como si no existiera. Sin dependencias: fetch directo, como
// el resto del repo. La usa también herramientas/enriquecer-lote.js para leads ya en el CRM.

const MODELO = process.env.ENRIQUECER_MODEL || 'claude-opus-5-5';
// Tope duro de la investigación (se aborta la llamada) y lo que el aviso a Maikel la espera.
// Las funciones que llegan aquí tienen 60 s (vercel.json): el aviso sale como mucho a los 30 s,
// con o sin resumen, y la nota puede llegar después (hasta los 45 s).
const ESPERA_MS = parseInt(process.env.ENRIQUECER_MS || '45000', 10);
const AVISO_MS = parseInt(process.env.ENRIQUECER_AVISO_MS || '30000', 10);
const ETIQUETA = 'ficha-investigada';

// Dominios de correo gratuitos: de ahí no se saca la empresa.
const CORREO_GRATIS = /^(gmail|googlemail|hotmail|outlook|live|msn|yahoo|ymail|icloud|me|mac|aol|proton(mail)?|pm|gmx|yandex|zoho|mail|telefonica|movistar|terra|orange|vodafone|ono|jazztel|wanadoo|tiscali|libero|hotmail\.es|yahoo\.es)\./i;

// Campos personalizados de la location que dicen algo del negocio (ids de GHL).
const CAMPOS = {
  '3ipqSYlrbxkAEO7RrIPs': 'Lo que escribió en el formulario',
  'Mw37t6A0k0vJuu5CvPa0': 'Hipótesis del problema',
  'aTDOe7eIT4BVoRNN4P0J': 'Motivo del scoring',
  'sboBzOUXmPgJp85DeBgv': 'Nivel',
  '4xAHatu7HkiKNVHD14Jp': 'Facturación anual',
  'EYm5gYLsoEVuTrZ5HPNX': 'Ticket medio del cliente',
  'Em2pkVsVvl3yZA2q45fR': 'Inversión mensual en anuncios',
  'HDO5jRppmeut0C3tI7zI': 'Sector o actividad',
  'Jm8nQ7Urb8aCqAuI25qx': 'Invierte en publicidad',
  'Z3a1TzbBAmSJjZxC9jwd': 'Cargo',
  'ZTzmx8G5JakCj3Phj7wb': 'Plazo para arrancar',
  'd6w0ucuobdTXfj7K9vdD': 'Quién lleva la captación',
  'hBNLcQluOJHJqBy4PfEb': 'Problema principal con los leads',
  'uC1YfdRGuwUY04avXoVb': 'Web o Instagram',
  'qf5wiVdGfyEcg7dlGQC4': 'Sector / nicho',
  'kvWokSeWtmy8HO7qonOs': 'Ciudad de la empresa',
  'rvUrnFXL2TvA8Qne7bIw': 'Web de la empresa',
  'tash5tdoodqaJvjL6LEk': 'LinkedIn',
  'dPcoJGVNAAwvzplNAfJ6': 'Ticket estimado'
};

// Prefijos de etiqueta que vienen del formulario.
const PREFIJOS = { 'sector-': 'Sector', 'inv-': 'Inversión mensual en anuncios', 'vol-': 'Peticiones al mes', 'fuga-': 'Dónde cree que pierde clientes', 'cuando-': 'Cuándo quiere empezar', 'precio-': 'Precio', 'pagina-': 'Página por la que entró' };

// Prefijo telefónico → país, para orientar la búsqueda.
function paisDe(tel) {
  const t = String(tel || '').replace(/\s/g, '');
  if (/^\+34/.test(t)) return 'España';
  if (/^\+33/.test(t)) return 'Francia';
  if (/^\+351/.test(t)) return 'Portugal';
  if (/^\+52/.test(t)) return 'México';
  if (/^\+54/.test(t)) return 'Argentina';
  if (/^\+57/.test(t)) return 'Colombia';
  if (/^\+56/.test(t)) return 'Chile';
  if (/^\+1/.test(t)) return 'EE. UU./Canadá';
  return '';
}

function dominioDe(c) {
  const m = String((c && c.email) || '').toLowerCase().match(/@([a-z0-9.-]+\.[a-z]{2,})$/);
  if (!m || CORREO_GRATIS.test(m[1] + '.')) return '';
  return m[1];
}

function webDe(c) {
  const candidatos = [c && c.website];
  ((c && c.customFields) || []).forEach(function (f) {
    if (f && (f.id === 'uC1YfdRGuwUY04avXoVb' || f.id === 'rvUrnFXL2TvA8Qne7bIw')) candidatos.push(f.value || f.field_value);
  });
  const w = candidatos.map(function (x) { return String(x || '').trim(); }).filter(Boolean)[0] || '';
  if (!w) return '';
  if (/^https?:\/\//i.test(w)) return w;
  if (/^@/.test(w)) return 'https://www.instagram.com/' + w.slice(1);
  if (/\.[a-z]{2,}/i.test(w)) return 'https://' + w;
  return w;
}

// Todo lo que sabemos del lead, en texto, para el modelo. Solo datos del negocio y del
// formulario: el correo y el teléfono no se le pasan enteros (bastan el dominio y el país).
function datosDe(c) {
  const tags = (c.tags || []).map(String);
  const lineas = [];
  const nombre = [c.firstName, c.lastName].filter(Boolean).join(' ') || c.contactName || '';
  lineas.push('Persona de contacto: ' + (nombre || 'no consta'));
  lineas.push('Empresa: ' + (c.companyName || c.businessName || 'no consta'));
  const web = webDe(c);
  lineas.push('Web o red que dio: ' + (web || 'no consta'));
  const dom = dominioDe(c);
  lineas.push('Dominio del correo: ' + (dom || 'correo genérico (no sirve para identificar la empresa)'));
  const lugar = [c.city, c.state, c.country].filter(Boolean).join(', ');
  if (lugar) lineas.push('Ubicación en el CRM: ' + lugar);
  const pais = paisDe(c.phone);
  if (pais) lineas.push('Prefijo del teléfono: ' + pais);
  Object.keys(PREFIJOS).forEach(function (p) {
    const t = tags.filter(function (x) { return x.startsWith(p); }).sort(function (a, b) { return a.length - b.length; })[0];
    if (t) lineas.push(PREFIJOS[p] + ': ' + t.slice(p.length).replace(/-/g, ' ').trim());
  });
  ((c.customFields) || []).forEach(function (f) {
    const et = f && CAMPOS[f.id];
    const v = f && (f.value != null ? f.value : f.field_value);
    if (et && v != null && String(v).trim() && !/^[\[{]/.test(String(v).trim())) lineas.push(et + ': ' + String(v).trim().slice(0, 300));
  });
  if (c.source) lineas.push('Origen del lead: ' + c.source);
  return lineas.join('\n');
}

const SISTEMA = [
  'Preparas, para Maikel (fundador de Qualivo), una ficha de investigación sobre el NEGOCIO de alguien que acaba de pedir un diagnóstico. Maikel la lee en el CRM antes de escribirle o de la videollamada.',
  '',
  'QUÉ HACE QUALIVO, para juzgar el encaje: monta el sistema que hace que no se pierdan los clientes que ya llegan (respuesta en el primer minuto, filtro, seguimiento de cada petición y saber qué anuncio trae ventas). Encaja mejor con negocios que invierten en anuncios y reciben bastantes peticiones al mes: academias y formación, clínicas, reformas, asesorías.',
  '',
  'CÓMO BUSCAR: si hay web, lee primero la portada (y como mucho una página más, la de precios o la de un curso o servicio). Después haz de tres a cinco búsquedas, cada una con un objetivo distinto: el nombre del negocio con su ciudad y «opiniones» o «reseñas» (Google, directorios); el nombre de la persona con el del negocio (su cargo, LinkedIn); el nombre del negocio con «precio» o el nombre de su producto principal; y, si hace falta, sus redes o menciones en prensa. No te quedes solo con la web: lo que dice de sí mismo el negocio vale menos que lo que dicen fuera. Hay prisa: lanza a la vez las búsquedas que no dependan unas de otras.',
  '',
  'QUÉ BUSCAR: qué vende exactamente (cursos, tratamientos, servicios) y a quién; rango de precios si es público; tamaño y equipo; sedes o ciudades; calidad de la web (clara, con precios, con formulario o WhatsApp, cuidada o anticuada); si hace anuncios (menciones, biblioteca de anuncios de Meta si es accesible); valoración y número de reseñas en Google; redes del negocio y tamaño aproximado; y el cargo profesional público de la persona (por ejemplo, su título en LinkedIn o en la web del negocio) solo si está claro que es la misma persona en la misma empresa.',
  '',
  'LÍMITES QUE NO SE CRUZAN:',
  '- Solo información profesional y pública del negocio. Nada personal: ni domicilio, ni familia, ni edad, ni vida privada, ni perfiles personales, ni nada que no sirva para entender el negocio.',
  '- Cada dato lleva su fuente con un número entre corchetes, [1], [2], que remite a la lista FUENTES. Lo que no encuentres: «no encontrado». Lo que no puedas comprobar (por ejemplo, la biblioteca de anuncios): «no comprobado». Nunca supongas ni rellenes.',
  '- Si un resultado puede ser de otro negocio o de otra persona con nombre parecido y no puedes confirmar que es el mismo, no lo describas: basta con «no encontrado (hay homónimos sin confirmar)».',
  '- Si con los datos no se puede identificar el negocio, dilo en la ficha y no inventes.',
  '',
  'FORMATO DE LA RESPUESTA FINAL, exactamente estas tres secciones y nada antes ni después. La FICHA, en menos de 1.600 caracteres; frases cortas, sin markdown (ni asteriscos ni almohadillas), en español.',
  'RESUMEN',
  '(tres líneas de menos de 90 caracteres cada una: qué es el negocio y su tamaño; señal de inversión o de volumen; encaje)',
  'FICHA',
  'Qué vende: …',
  'Precios: …',
  'Tamaño y sedes: …',
  'Web: …',
  'Anuncios: …',
  'Reseñas Google: …',
  'Redes: …',
  'Persona: … (cargo profesional público, o «no encontrado»)',
  'Cómo abrir la conversación: (una frase que Maikel puede usar, apoyada en algo concreto que hayas encontrado de su negocio; nada que suene a que le hemos investigado)',
  'Encaje con Qualivo: A, B o C — (una o dos líneas: ¿invierte en anuncios a la vista?, ¿volumen?, ¿el problema que dijo cuadra con lo que se ve?)',
  'Preguntas para la reunión:',
  '1. …',
  '2. …',
  '3. …',
  'FUENTES',
  '[1] url',
  '[2] url'
].join('\n');

function cabecerasAnthropic() {
  return Object.assign(
    { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01',
      // Si Opus rechaza la petición por un clasificador, el servidor la repite en otro modelo.
      'anthropic-beta': 'server-side-fallback-2026-07-01' },
    process.env.ANTHROPIC_WORKSPACE_ID ? { 'anthropic-workspace-id': process.env.ANTHROPIC_WORKSPACE_ID } : {}
  );
}

// Texto final: lo que el modelo escribe después del último resultado de herramienta.
function textoFinal(contenido) {
  let ultimo = -1;
  contenido.forEach(function (b, i) { if (/tool_(use|result)$/.test(String(b.type))) ultimo = i; });
  return contenido.slice(ultimo + 1).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('').trim();
}

function trocear(texto) {
  const t = String(texto || '').replace(/\r/g, '').replace(/\*\*/g, '');
  const iR = t.search(/^RESUMEN\s*$/m), iF = t.search(/^FICHA\s*$/m), iS = t.search(/^FUENTES\s*$/m);
  if (iR < 0 || iF < 0 || iF < iR) return null;
  const resumen = t.slice(iR, iF).replace(/^RESUMEN\s*$/m, '').trim().split('\n').map(function (l) { return l.trim(); }).filter(Boolean).slice(0, 3).join('\n');
  const ficha = t.slice(iF, iS > iF ? iS : undefined).replace(/^FICHA\s*$/m, '').trim();
  const fuentes = [];
  if (iS > iF) {
    t.slice(iS).split('\n').forEach(function (l) {
      const m = l.match(/^\s*\[(\d+)\]\s*(https?:\/\/\S+)/);
      if (m) fuentes.push({ n: parseInt(m[1], 10), url: m[2].replace(/[).,;]+$/, '') });
    });
  }
  if (!resumen || !ficha) return null;
  return { resumen: resumen, ficha: ficha, fuentes: fuentes };
}

// Enlace a la biblioteca de anuncios de Meta con el nombre del negocio: la búsqueda web no
// siempre puede leerla (es una página dinámica), así que Maikel lo comprueba de un toque.
function enlaceAnuncios(c) {
  const q = String(c.companyName || c.businessName || '').trim();
  if (q.length < 4) return '';
  return 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ES&media_type=all&search_type=keyword_unordered&q=' + encodeURIComponent(q);
}

// enriquecer(contacto, { esperaMs }) → { resumen, ficha, fuentes: [urls], uso } o null.
async function enriquecer(c, opciones) {
  opciones = opciones || {};
  if (!c || !process.env.ANTHROPIC_API_KEY) return null;
  const espera = opciones.esperaMs || ESPERA_MS;
  const inicio = Date.now();
  const control = new AbortController();
  const reloj = setTimeout(function () { control.abort(); }, espera);
  const uso = { entrada: 0, salida: 0, busquedas: 0, lecturas: 0, vueltas: 0 };
  try {
    const web = webDe(c);
    const peticion = 'Investiga este negocio y prepara la ficha.\n\n' + datosDe(c) +
      (web ? '\n\nSu web: ' + web : '') +
      '\n\nFecha de hoy: ' + new Date().toISOString().slice(0, 10) + '.';
    const mensajes = [{ role: 'user', content: peticion }];
    // Sin lecturas (lecturas: 0) no se declara web_fetch: la búsqueda ya trae el texto de las páginas.
    const lecturas = opciones.lecturas == null ? 2 : opciones.lecturas;
    const herramientas = [{ type: 'web_search_20260209', name: 'web_search', max_uses: opciones.busquedas || 5, user_location: { type: 'approximate', country: 'ES', timezone: 'Europe/Madrid' } }];
    if (lecturas > 0) herramientas.push({ type: 'web_fetch_20260209', name: 'web_fetch', max_uses: lecturas, max_content_tokens: 6000 });
    let r = null, acumulado = [];
    // Si el servidor pausa el turno (pause_turn), se reenvía tal cual y continúa donde iba.
    for (let vuelta = 0; vuelta < 4; vuelta++) {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: cabecerasAnthropic(),
        signal: control.signal,
        body: JSON.stringify({
          model: MODELO,
          max_tokens: 12000,
          thinking: { type: 'adaptive' },
          output_config: { effort: process.env.ENRIQUECER_ESFUERZO || 'low' },
          fallbacks: 'default',
          system: SISTEMA,
          tools: herramientas,
          messages: mensajes
        })
      });
      if (!resp.ok) throw new Error('anthropic ' + resp.status + ' ' + (await resp.text()).slice(0, 300));
      r = await resp.json();
      uso.vueltas++;
      const u = r.usage || {};
      uso.entrada += (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
      uso.salida += u.output_tokens || 0;
      uso.busquedas += (u.server_tool_use && u.server_tool_use.web_search_requests) || 0;
      uso.lecturas += (u.server_tool_use && u.server_tool_use.web_fetch_requests) || 0;
      acumulado = acumulado.concat(r.content || []);
      if (r.stop_reason !== 'pause_turn') break;
      mensajes.length = 1;
      mensajes.push({ role: 'assistant', content: acumulado });
    }
    if (!r || r.stop_reason === 'refusal' || r.stop_reason === 'pause_turn') throw new Error('sin respuesta final (' + (r && r.stop_reason) + ')');
    const partes = trocear(textoFinal(acumulado));
    if (!partes) throw new Error('formato inesperado');
    uso.ms = Date.now() - inicio;
    uso.modelo = r.model || MODELO;
    const anuncios = enlaceAnuncios(c);
    return {
      resumen: partes.resumen,
      ficha: partes.ficha,
      fuentes: partes.fuentes.map(function (f) { return '[' + f.n + '] ' + f.url; }),
      anuncios: anuncios,
      uso: uso
    };
  } catch (e) {
    console.error('[enriquecer] ' + (c && c.id) + ' sin ficha (' + (Date.now() - inicio) + ' ms): ' + (e && e.name === 'AbortError' ? 'tiempo agotado' : e && e.message));
    return null;
  } finally {
    clearTimeout(reloj);
  }
}

function fechaHoy() {
  return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date());
}

// Texto de la nota de GHL.
function textoNota(r) {
  return 'FICHA INVESTIGADA · ' + fechaHoy() + '\n' +
    '(búsqueda automática en internet; solo datos públicos del negocio, cada uno con su fuente)\n\n' +
    r.ficha +
    (r.fuentes.length ? '\n\nFuentes:\n' + r.fuentes.join('\n') : '\n\nFuentes: ninguna') +
    (r.anuncios ? '\n\nSus anuncios activos en Meta, para comprobar: ' + r.anuncios : '');
}

// Investiga y deja la nota + etiqueta en GHL. No investiga dos veces (etiqueta ficha-investigada).
// Devuelve el resultado de enriquecer (con .nota) o null.
async function investigarYAnotar(c, opciones) {
  opciones = opciones || {};
  if (!c || !c.id) return null;
  if ((c.tags || []).map(String).indexOf(ETIQUETA) > -1) return null;
  const r = await enriquecer(c, opciones);
  if (!r) return null;
  r.nota = textoNota(r);
  if (opciones.simular) return r;
  const A = require('./_activacion.js');
  try {
    const ok = await A.nota(c.id, r.nota);
    if (!ok) throw new Error('nota no guardada');
    await A.etiquetar(c.id, [ETIQUETA]);
    r.guardada = true;
  } catch (e) {
    console.error('[enriquecer] ' + c.id + ' nota:', e && e.message);
    r.guardada = false;
  }
  return r;
}

// Lo que Vercel ofrece para terminar trabajo después de responder (es lo que hace
// waitUntil de @vercel/functions, sin la dependencia). Fuera de Vercel no hace nada.
function enSegundoPlano(promesa) {
  try {
    const ctx = globalThis[Symbol.for('@vercel/request-context')];
    const w = ctx && typeof ctx.get === 'function' && (ctx.get() || {}).waitUntil;
    if (typeof w === 'function') { w(promesa); return true; }
  } catch (e) { /* sin contexto de Vercel */ }
  return false;
}

// Dentro del flujo de un lead nuevo (retenerParaMaikel). Nunca lanza error y nunca espera más de
// AVISO_MS: si la ficha no ha llegado, devuelve null (el aviso sale como siempre), la nota se
// sigue escribiendo en segundo plano y, cuando llega, el resumen va al móvil en un segundo
// mensaje corto (unos segundos después del aviso, para que no se adelante). Una sola investigación por instancia y minuto: el reloj
// puede retener varios A/B en la misma vuelta y no puede gastar su minuto en esto; los que se
// queden sin ficha se completan con herramientas/enriquecer-lote.js. ENRIQUECER=0 lo apaga.
let ultimaEnFlujo = 0;
async function paraElAviso(c) {
  try {
    if (process.env.ENRIQUECER === '0' || !c || !c.id || !process.env.ANTHROPIC_API_KEY) return null;
    if ((c.tags || []).map(String).indexOf(ETIQUETA) > -1) return null;
    if (Date.now() - ultimaEnFlujo < 60000) { console.warn('[enriquecer] ' + c.id + ': otra ficha en curso en esta instancia, se deja para el lote'); return null; }
    ultimaEnFlujo = Date.now();
    const trabajo = investigarYAnotar(c, { esperaMs: ESPERA_MS, busquedas: 3, lecturas: 1 }).catch(function () { return null; });
    let plazo;
    const r = await Promise.race([trabajo, new Promise(function (ok) { plazo = setTimeout(function () { ok(null); }, AVISO_MS); })]);
    clearTimeout(plazo);
    if (!r) {
      const quien = (c.firstName || c.contactName || '?') + (c.companyName ? ' · ' + c.companyName : '');
      enSegundoPlano(trabajo.then(async function (tarde) {
        if (!tarde || !tarde.resumen) return;
        await new Promise(function (ok) { setTimeout(ok, 5000); });
        await require('./_aviso.js').movil('FICHA INVESTIGADA · ' + quien + '\n' + tarde.resumen + (tarde.guardada ? '\n(ficha completa en las notas del CRM)' : ''));
      }).catch(function (e) { console.error('[enriquecer] resumen tardío:', e && e.message); }));
    }
    return r;
  } catch (e) {
    console.error('[enriquecer] paraElAviso:', e && e.message);
    return null;
  }
}

module.exports = { enriquecer: enriquecer, investigarYAnotar: investigarYAnotar, paraElAviso: paraElAviso, textoNota: textoNota, datosDe: datosDe, ETIQUETA: ETIQUETA };
