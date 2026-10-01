// Piezas compartidas de la capa de activación: CRM, WhatsApp, voz y ventanas
// horarias. El estado vive en etiquetas de GHL; aquí no se guarda nada.
// Documentado en captacion/recorrido-activacion-v2.md.

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const VAPI_BASE = 'https://api.vapi.ai';
const { PAUSA_TOTAL } = require('./_pausa.js');
// Número desde el que llama Raquel cuando VAPI_PHONE_NUMBER_ID no está en el
// entorno. Hasta el 19-sep era el +1 775 de EE. UU. (b60821ae…): las llamadas
// lanzadas a mano salían desde el móvil de Maikel, pero las del reloj no, y
// Pablo recibió un sábado por la mañana una llamada americana que fue al
// buzón. Decisión de Maikel del 18-sep: su móvil (+34 663 375 205).
const NUMERO_SALIENTE = '2f99f0e4-5294-4340-9d4a-10bd4553f8ff'; // Vapi · +34 663 375 205 (móvil de Maikel)

function cabeceras() {
  return {
    Authorization: 'Bearer ' + process.env.GHL_API_KEY,
    Version: GHL_VERSION,
    'Content-Type': 'application/json'
  };
}

// Hora local de Madrid sin dependencias: Intl da el desfase real, incluido verano.
function ahoraMadrid(fecha) {
  const d = fecha || new Date();
  const p = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(d).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
  const dias = { 'lun': 1, 'mar': 2, 'mié': 3, 'jue': 4, 'vie': 5, 'sáb': 6, 'dom': 0 };
  return {
    hora: parseInt(p.hour, 10),
    minuto: parseInt(p.minute, 10),
    dia: dias[String(p.weekday).toLowerCase().replace('.', '')],
    minutos: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10)
  };
}

// WhatsApp es asíncrono y se lee cuando se puede; la voz interrumpe, así que
// tiene la ventana más estrecha y solo entre semana.
function enVentana(canal, fecha) {
  const t = ahoraMadrid(fecha);
  // 1-oct-2026: WhatsApp y voz con las ventanas aprobadas (api/_horario.js).
  const HH = require('./_horario.js');
  const ms = fecha ? new Date(fecha).getTime() : Date.now();
  if (canal === 'whatsapp') return HH.ventanaWhatsApp(ms);
  if (canal === 'voz') return HH.ventanaVoz(ms);
  if (canal === 'voz') {
    if (t.dia === 0) return false;                       // domingo nunca
    // Sábado solo por la mañana. El histórico de la cuenta dice que el fin de
    // semana capta a la mitad de precio, así que dejar esos leads sin llamada
    // hasta el lunes es tirar el dinero que costó traerlos. Pero llamar a un
    // empresario un domingo, o un sábado por la tarde, es pasarse.
    if (t.dia === 6) return t.minutos >= 10 * 60 && t.minutos < 14 * 60;
    // Desde las 9:00 entre semana (Maikel, 21-sep): un dueño de reformas o de
    // academia ya está en marcha a esa hora y la primera tanda no espera media hora.
    const manana = t.minutos >= 9 * 60 && t.minutos < 14 * 60;
    const tarde = t.minutos >= 16 * 60 && t.minutos < 20 * 60;
    return manana || tarde;
  }
  return true;
}

async function buscarPorEtiqueta(etiqueta, limite) {
  const contactos = [];
  let page = 1;
  while (page <= 10) {
    const r = await fetch(GHL_BASE + '/contacts/search', {
      method: 'POST',
      headers: cabeceras(),
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID,
        page: page,
        pageLimit: 100,
        filters: [{ field: 'tags', operator: 'contains', value: etiqueta }]
      })
    });
    if (!r.ok) throw new Error('ghl_search ' + r.status + ' ' + (await r.text()).slice(0, 200));
    const d = await r.json();
    const lote = d.contacts || [];
    contactos.push.apply(contactos, lote);
    if (lote.length < 100 || contactos.length >= (limite || 500)) break;
    page++;
  }
  return contactos;
}

async function etiquetar(contactId, anadir, quitar) {
  const cuerpo = {};
  if (anadir && anadir.length) cuerpo.tags = anadir;
  if (quitar && quitar.length) {
    await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', {
      method: 'DELETE', headers: cabeceras(), body: JSON.stringify({ tags: quitar })
    }).catch(function () {});
  }
  if (!cuerpo.tags) return true;
  const r = await fetch(GHL_BASE + '/contacts/' + contactId + '/tags', {
    method: 'POST', headers: cabeceras(), body: JSON.stringify(cuerpo)
  });
  return r.ok;
}

async function nota(contactId, texto) {
  const r = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', {
    method: 'POST', headers: cabeceras(), body: JSON.stringify({ body: texto })
  });
  return r.ok;
}

// El primer mensaje sale por la API de conversaciones de GHL, con el número de
// WhatsApp de la location. Las respuestas las atiende el agente ya montado allí.
async function enviarWhatsApp(contactId, texto) {
  if (PAUSA_TOTAL) throw new Error('pausa total: no sale nada hacia leads');
  const r = await fetch(GHL_BASE + '/conversations/messages', {
    method: 'POST',
    headers: cabeceras(),
    body: JSON.stringify({ type: 'WhatsApp', contactId: contactId, message: texto })
  });
  if (!r.ok) throw new Error('ghl_whatsapp ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json().catch(function () { return {}; });
}

// La pasarela de WhatsApp de la cuenta (Wazzap, «WhatsApp Gateway»): en GHL
// está dada de alta como proveedor de SMS, así que un mensaje de tipo SMS sale
// por ella COMO WHATSAPP desde el número conectado, sin plantillas ni ventana
// de 24 h. Hasta el 19-sep se creía que esto era un SMS de verdad y se apagó
// («por SMS nunca»); Maikel lo desveló ese día y es la vía para el primer
// mensaje y las confirmaciones. Los mensajes que salen por aquí aparecen en
// GHL como TYPE_CUSTOM_SMS con este proveedor.
//
// El número conectado a Wazzap cambió el 23-sep: hasta entonces era el móvil
// personal de Maikel (663); desde el 23-sep es el número oficial del negocio
// (647), que Maikel conectó él mismo a Wazzap. El proveedor y el código no
// cambian, solo el número que sale al otro lado.
const GATEWAY_PROVIDER = '67ad23a0cf352d8f5809f0ca';

// PAUSA DE LA PASARELA (22-sep, 16:20 → 23-sep): WhatsApp restringió el móvil
// personal de Maikel (663) tras un envío masivo de mensajes iguales. Con el
// número oficial (647) conectado a Wazzap desde el 23-sep, ese riesgo concreto
// ya no aplica al número que sale; el tope diario y la regla de «nunca
// mensajes iguales» se mantienen igual, valen para cualquier número que no
// pase por la API oficial de Meta.
//
// 24-sep-2026: la pausa por defecto («ausente = en pausa») se quedó activa sin
// que nadie pusiera GATEWAY_PAUSA=0 en Vercel tras el cambio de número, y hoy
// los WhatsApp de leads reales (Santi, Cristina) han estado cayendo en
// whatsapp_fallido por eso, aunque los números sí tienen WhatsApp. Maikel:
// «hazlo todo por whatsapp». Se invierte el valor por defecto: ahora activa
// sola, y solo se pausa poniendo GATEWAY_PAUSA=1 en Vercel si hace falta.
const GATEWAY_PAUSA = process.env.GATEWAY_PAUSA === '1';
// Tope diario de mensajes por la pasarela. El 21 y el 22 de septiembre
// salieron unos sesenta en dos días por el número personal, muchos iguales, y
// WhatsApp lo restringió. El tope se mantiene con el número oficial (647) por
// el mismo motivo: cualquier número no oficial puede ser restringido si el
// patrón de envío parece automatizado. Se cuenta con la etiqueta gw-AAAAMMDD.
const GATEWAY_MAX_DIA = parseInt(process.env.GATEWAY_MAX_DIA || '20', 10);
function etiquetaGatewayHoy() {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return 'gw-' + p.replace(/-/g, '');
}
async function enviarPorGateway(contactId, texto, opciones) {
  // Los avisos al móvil de Maikel (api/_aviso.js) pasan con { interno: true }.
  if (PAUSA_TOTAL && !(opciones && opciones.interno)) throw new Error('pausa total: no sale nada hacia leads');
  if (GATEWAY_PAUSA) throw new Error('pasarela en pausa (restricción de WhatsApp, 22-sep)');
  if (!(opciones && opciones.forzar) && await frenoSinRespuesta(contactId, texto)) throw new Error('frenado: demasiados mensajes sin respuesta');
  const hoy = etiquetaGatewayHoy();
  try {
    const deHoy = await buscarPorEtiqueta(hoy, GATEWAY_MAX_DIA + 1);
    if (deHoy.length >= GATEWAY_MAX_DIA) throw new Error('tope diario de la pasarela (' + GATEWAY_MAX_DIA + ')');
  } catch (e) { if (/tope diario/.test(String(e && e.message))) throw e; /* si el CRM no cuenta, se envía */ }
  await etiquetar(contactId, [hoy]).catch(function () {});
  const r = await fetch(GHL_BASE + '/conversations/messages', {
    method: 'POST',
    headers: cabeceras(),
    body: JSON.stringify({ type: 'SMS', contactId: contactId, message: texto })
  });
  if (!r.ok) throw new Error('ghl_gateway ' + r.status + ' ' + (await r.text()).slice(0, 200));
  return r.json().catch(function () { return {}; });
}
const enviarSMS = enviarPorGateway; // nombre antiguo

// Un mensaje de GHL es de WhatsApp si salió por la API oficial o por la pasarela.
function esWhatsApp(m) {
  const t = String((m && m.messageType) || '');
  if (/WHATSAPP/i.test(t)) return true;
  return /CUSTOM_SMS/i.test(t) && String((m && m.conversationProviderId) || '') === GATEWAY_PROVIDER;
}

async function estadoMensaje(messageId) {
  try {
    const r = await fetch(GHL_BASE + '/conversations/messages/' + messageId, { headers: cabeceras() });
    if (!r.ok) return '';
    const d = await r.json();
    const m = (d && d.message) || d || {};
    // GHL a veces rellena «error» antes de cambiar «status».
    if (m.error) return 'failed';
    return String(m.status || '');
  } catch (err) {
    return '';
  }
}

function esperar(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

// WhatsApp solo deja escribir primero dentro de las 24 horas siguientes al
// último mensaje del contacto. Fuera de esa ventana, y sin una plantilla
// aprobada por Meta, el mensaje se acepta por API y luego queda en «failed»
// sin avisar a nadie: el lead se pierde en silencio. Por eso se comprueba el
// estado y, si ha fallado, el mismo texto sale por la pasarela de WhatsApp
// (Wazzap), que no tiene ventana de 24 h. El 18-sep se apagó creyendo que era
// un SMS («por SMS nunca»); el 19-sep Maikel aclaró que es WhatsApp y se
// volvió a encender. A las 11:20 pidió pararla (estaba en su móvil personal) y
// a las 11:35, con Wazzap ya conectado al número del negocio, pidió que el
// primer mensaje salga solo y que el agente agende cuando contesten. Va
// encendida salvo PERMITIR_GATEWAY=0; apagada, la API oficial que falla
// devuelve 'whatsapp_fallido' y Maikel recibe en el móvil el texto listo.
const GATEWAY_PERMITIDO = process.env.PERMITIR_GATEWAY !== '0';

// Le deja a Maikel el mensaje que no ha salido, con nombre y teléfono, para que
// lo mande él desde su WhatsApp. Nunca bloquea.
async function pasarAMaikel(contactId, texto) {
  try {
    const r = await fetch(GHL_BASE + '/contacts/' + contactId, { headers: cabeceras() });
    const c = r.ok ? ((await r.json()).contact || {}) : {};
    const quien = (c.firstName || c.contactName || c.name || 'lead') + (c.companyName ? ' · ' + c.companyName : '');
    await require('./_aviso.js').movil('PARA ENVIAR TÚ · ' + quien + (c.phone ? ' · ' + c.phone : '') +
      '\n(el WhatsApp automático no ha salido: fuera de la ventana de 24 h)\n\n' + texto);
  } catch (e) { console.error('[activacion] pasarAMaikel:', e && e.message); }
}

// Maikel, 19-sep 12:05: «hazlo todo por Wazzap». La pasarela va primero, sin
// pasar por la API oficial de Meta (ventana de 24 h, plantillas, esperas de
// cinco segundos). La oficial queda de respaldo si la pasarela falla, y se
// vuelve a ella con GATEWAY_PRIMERO=0.
const GATEWAY_PRIMERO = process.env.GATEWAY_PRIMERO !== '0';
// ¿El próximo mensaje normal saldría por la pasarela? (para decidir si hay que variarlo)
function saldriaPorGateway() { return GATEWAY_PERMITIDO && GATEWAY_PRIMERO && !GATEWAY_PAUSA; }

// opciones.transaccional (Bloque 2): confirmación de cita y enlace del día. No
// pasan por el freno de 3 sin respuesta: los pidió la propia reserva del lead.
async function enviarMensaje(contactId, texto, opciones) {
  if (PAUSA_TOTAL) return { canal: 'pausado', estado: 'pausado', id: '' };
  if (!(opciones && opciones.transaccional) && await frenoSinRespuesta(contactId, texto)) return { canal: 'frenado', estado: 'frenado', id: '' };
  if (GATEWAY_PERMITIDO && GATEWAY_PRIMERO && !GATEWAY_PAUSA) {
    try {
      const g = await enviarPorGateway(contactId, texto, { forzar: true });
      return { canal: 'gateway', estado: 'enviado', id: (g && (g.messageId || g.msgId)) || '' };
    } catch (err) {
      console.error('[activacion] pasarela falló, pruebo la API oficial:', err && err.message);
    }
  }
  let idWa = '';
  try {
    const r = await enviarWhatsApp(contactId, texto);
    idWa = (r && (r.messageId || r.msgId)) || '';
  } catch (err) {
    idWa = '';
  }
  if (idWa) {
    await esperar(5000);
    const estado = await estadoMensaje(idWa);
    if (estado && estado.toLowerCase() !== 'failed') return { canal: 'whatsapp', estado: estado, id: idWa };
  }
  if (!GATEWAY_PERMITIDO || GATEWAY_PAUSA) {
    await pasarAMaikel(contactId, texto);
    return { canal: 'whatsapp_fallido', estado: 'failed', id: idWa };
  }
  // Fuera de la ventana de 24 h (o número que la API oficial no entrega), el
  // mismo texto sale por la pasarela como WhatsApp normal.
  const g = await enviarPorGateway(contactId, texto, { forzar: true });
  return { canal: 'gateway', estado: 'enviado', id: (g && (g.messageId || g.msgId)) || '' };
}

// Campos personalizados del contacto que usan los workflows de GHL para
// rellenar las plantillas de WhatsApp (plan B cuando Meta no deja enviar desde
// nuestra app: el workflow «etiqueta añadida → plantilla» lo manda GHL con
// estos valores). Ids de la location bHGMuZEGUESZmVoNv9HT, creados el 18-sep.
const CAMPOS_WA = {
  loQueEscribio: '3ipqSYlrbxkAEO7RrIPs', // WA · Lo que escribió
  pregunta: 'Jk5jLEChMdSOe8eQPJLZ',      // WA · Pregunta
  citaDia: '88tSGYs0YkoeIkrd8JLZ',       // Cita · Día
  citaHora: 'ZyZvyw77Q3FtyGnhK1qO',      // Cita · Hora
  citaEnlace: 'Fm1hDYlKR02hS8khPJ99'     // Cita · Enlace
};
// Lee del contacto los valores que guardó camposWA.
function leerCamposWA(contacto) {
  const out = {};
  const campos = (contacto && contacto.customFields) || [];
  Object.keys(CAMPOS_WA).forEach(function (k) {
    const f = campos.filter(function (x) { return x && (x.id === CAMPOS_WA[k]); })[0];
    if (f) out[k] = f.value || f.field_value || '';
  });
  return out;
}

async function camposWA(contactId, valores) {
  const customFields = Object.keys(valores || {}).filter(function (k) { return CAMPOS_WA[k] && valores[k] != null; })
    .map(function (k) { return { id: CAMPOS_WA[k], field_value: String(valores[k]).slice(0, 500) }; });
  if (!customFields.length) return false;
  const r = await fetch(GHL_BASE + '/contacts/' + contactId, {
    method: 'PUT', headers: cabeceras(), body: JSON.stringify({ customFields: customFields })
  });
  return r.ok;
}

// Primer WhatsApp a un lead que nunca nos ha escrito. Si la plantilla de Meta
// está configurada y aprobada, sale por ella (es la única vía que Meta acepta
// fuera de la ventana de 24 h); si no, por GHL con respaldo SMS como siempre.
// datos: { nombre, cita (lo que escribió o el tema), pregunta, texto (versión libre) }
async function primerWhatsApp(contactId, telefono, datos) {
  // Se lanza en vez de devolver: los formularios ponen act-wa1 después de
  // llamar aquí, y con la etiqueta el reloj ya no mandaría el primer
  // mensaje al reanudar.
  if (PAUSA_TOTAL) throw new Error('pausa total: no sale nada hacia leads');
  // Los valores de la plantilla se dejan en el contacto pase lo que pase: los
  // lee el workflow de GHL y sirven para ver qué se le dijo.
  try { await camposWA(contactId, { loQueEscribio: datos.cita || 'el diagnóstico', pregunta: datos.pregunta || '' }); } catch (e) { /* no bloquea */ }
  try {
    const WA = require('./_whatsapp.js');
    if (!GATEWAY_PRIMERO && WA.configurado() && telefono) {
      const r = await WA.enviarPlantilla(telefono, WA.PLANTILLAS.primerContacto,
        [datos.nombre || 'hola', datos.cita || 'el diagnóstico', datos.pregunta || '']);
      if (r.ok) return { canal: 'plantilla', estado: 'enviado', id: r.id };
      console.warn('[activacion] plantilla primer contacto no salió (' + r.motivo + '); sigo por GHL');
    }
  } catch (e) { console.warn('[activacion] plantilla:', e && e.message); }
  const env = await enviarMensaje(contactId, datos.texto);
  // Meta no deja escribir primero y nuestra app no puede mandar la plantilla:
  // la etiqueta dispara el workflow de GHL que sí puede (plantilla
  // qualivo_primer_contacto con los campos WA · …).
  if (env.canal === 'whatsapp_fallido') await etiquetar(contactId, ['wa-primer-contacto']).catch(function () {});
  return env;
}

// ---------------------------------------------------------------------------
// Primer WhatsApp · Bloque 1 «speed-to-lead» (decisiones de Maikel del 1-oct-2026)
// ---------------------------------------------------------------------------
//   · WhatsApp solo de 8:00 a 21:30 (api/_horario.js). Fuera, el lead entra en
//     el CRM igual y el primer WhatsApp queda programado para las 8:00
//     (act-wa1-prog-<sello> + act-wa1-motivo-quiet). Lo manda el reloj.
//   · A y B dentro de la supervisión de Maikel (L-V laborables 9:00-19:00): se
//     genera el borrador al momento, se le avisa («sale automáticamente a las
//     HH:MM si no haces nada») y espera ESPERA_A_B_MIN. Si Maikel escribe al
//     lead antes, o pone la etiqueta wa1-cancelar, no sale nada automático.
//     Si no, sale solo (soltarRetenidos, cada 2 min). Nunca indefinido.
//   · A y B fuera de su supervisión pero en hora de WhatsApp: sale al momento.
//   · Un candado (tomarCandado) evita dos envíos aunque el webhook, el rescate
//     y los relojes lleguen a la vez.
//   · Trazabilidad por etiquetas: act-ini (entrada), act-wa1-prog (programado),
//     act-wa1-h (enviado), act-wa1-motivo-<quiet|supervision>,
//     act-wa1-modo-<auto|auto10|humano|cancelado>, wa1-v-<corto|largo>,
//     wa1-ctx-<supervision|fuera|noche>.
const H = require('./_horario.js');
const ESPERA_A_B_MIN = 10;
// A/B del primer WhatsApp (P0.2): corto frente a largo, mitad y mitad. Las 15
// preguntas del corto las aprobó Maikel el 1-oct. false = todos al largo.
const WA1_CORTO = true;
const CANDADO_MS = parseInt(process.env.CANDADO_MS || '1500', 10);

function etiquetaCon(tags, prefijo) {
  return (tags || []).map(String).filter(function (t) { return t.indexOf(prefijo) === 0 && /\d{12}$/.test(t); })[0] || '';
}

// Candado distribuido con etiquetas: cada proceso deja su marca, espera un
// momento, relee el contacto y solo sigue el de la marca más antigua (y, en
// empate, la menor). Las marcas de más de 15 min se ignoran.
async function tomarCandado(contactId, clave) {
  const ahora = Date.now();
  const mia = clave + '-' + new Date(ahora).toISOString().replace(/[-:T.Z]/g, '').slice(0, 17) + '-' + Math.random().toString(36).slice(2, 8);
  await etiquetar(contactId, [mia]);
  await esperar(CANDADO_MS);
  let tags = [];
  try { const r = await fetch(GHL_BASE + '/contacts/' + contactId, { headers: cabeceras() }); if (r.ok) tags = (((await r.json()).contact || {}).tags || []).map(String); } catch (e) { tags = []; }
  const vivas = tags.filter(function (t) {
    if (t.indexOf(clave + '-') !== 0) return false;
    const m = t.slice(clave.length + 1).match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (!m) return false;
    return ahora - Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]) < 15 * 60000;
  }).sort();
  if (vivas.indexOf(mia) === -1 && tags.length) return null; // no se ve la propia marca: mejor no seguir
  if (vivas.length && vivas[0] !== mia) { await etiquetar(contactId, null, [mia]).catch(function () {}); return null; }
  return mia;
}
async function soltarCandado(contactId, mia) { if (mia) await etiquetar(contactId, null, [mia]).catch(function () {}); }

async function fichaDe(contactId) {
  try { const r = await fetch(GHL_BASE + '/contacts/' + contactId, { headers: cabeceras() }); if (r.ok) return (await r.json()).contact || null; } catch (e) { /* nada */ }
  return null;
}

// Hora de entrada del lead: act-ini-<sello>, la que pase la puerta, o la del CRM.
function entradaDe(ficha, d) {
  const t = etiquetaCon(ficha && ficha.tags, 'act-ini-');
  if (t) return H.msDeSello(t);
  const e = Date.parse((d && d.entro) || (ficha && ficha.dateAdded) || 0);
  return e || Date.now();
}

// Texto del primer WhatsApp según variante y contexto horario.
async function textoWa1(d, ficha, variante, ctx, pq) {
  const M = require('./_mensajes.js'), AGT = require('./_agente.js');
  const datosMsg = { nombre: d.nombre, origen: d.origen, inversion: d.inversion, fuga: d.fuga, sector: d.sector, hipotesis: d.hipotesis, entro: d.entro, precualificar: pq };
  if (variante === 'corto') return { texto: M.whatsappCorto(datosMsg, ctx), ia: false, datosMsg: datosMsg };
  const tardes = AGT.opcionesTarde();
  const ia = await AGT.mensajePersonalizado({ nombre: M.nombreCorto(d.nombre), empresa: d.empresa || '', sector: d.sector, fuga: d.fuga || d.hipotesis, inversion: d.inversion, volumen: d.volumen,
    opcion1: tardes[0], opcion2: tardes[1], precualificar: pq, ctx: ctx }).catch(function (e) { return { texto: '', motivo: e && e.message }; });
  return { texto: ia.texto || M.whatsapp1(datosMsg), ia: !!ia.texto, datosMsg: datosMsg };
}

// Primer WhatsApp completo, el mismo desde cualquier puerta (formulario de Meta,
// rescate, landing y reloj de activación). Nunca lanza por la parte horaria.
// d: { nombre, empresa, sector, fuga, inversion, volumen, entro, hipotesis, origen,
//      soltar (sale el borrador retenido), texto, variante, ctx, modo }
async function primerWhatsAppCompleto(contactId, telefono, d) {
  d = d || {};
  const M = require('./_mensajes.js');
  let ficha = await fichaDe(contactId);
  const tags0 = ((ficha && ficha.tags) || []).map(String);
  const ahora = Date.now();
  // 1. Horario: con el WhatsApp cerrado no se escribe; se deja programado.
  if (!H.ventanaWhatsApp(ahora)) {
    if (!etiquetaCon(tags0, 'act-wa1-prog-') && tags0.indexOf('act-wa1') === -1) {
      await etiquetar(contactId, ['act-wa1-prog-' + H.sello(H.siguienteWhatsApp(ahora)), 'act-wa1-motivo-quiet']).catch(function () {});
    }
    return { ok: false, canal: 'ninguno', motivo: 'quiet_hours', programado: H.siguienteWhatsApp(ahora) };
  }
  // 2. ¿Ya salió o está saliendo? (29-sep, Anna: dos puertas a la vez.)
  const ya = await yaTienePrimerWhatsApp(contactId, ficha);
  if (ya) return { ok: false, canal: 'ninguno', motivo: ya };
  if (tags0.indexOf('act-espera-maikel') > -1 && !d.soltar) return { ok: false, canal: 'ninguno', motivo: 'retenido' };
  // 3. Candado: solo un proceso sigue a partir de aquí.
  const candado = await tomarCandado(contactId, 'act-lock-wa1');
  if (!candado) return { ok: false, canal: 'ninguno', motivo: 'otro_proceso' };
  try {
    ficha = (await fichaDe(contactId)) || ficha;
    const ya2 = await yaTienePrimerWhatsApp(contactId, ficha);
    if (ya2) return { ok: false, canal: 'ninguno', motivo: ya2 };
    const tags = ((ficha && ficha.tags) || []).map(String);
    if (tags.indexOf('act-espera-maikel') > -1 && !d.soltar) return { ok: false, canal: 'ninguno', motivo: 'retenido' };
    const pq = ficha ? require('./_scoring.js').precualificar(ficha).si : false;
    const entro = entradaDe(ficha, d);
    const ctx = d.ctx || H.contextoWa1(ahora, entro);
    const variante = d.variante || (WA1_CORTO ? M.varianteWa1(contactId) : 'largo');
    const n = ficha ? nivelDe(ficha) : '';
    const t = d.texto ? { texto: d.texto, ia: false, datosMsg: { nombre: d.nombre, fuga: d.fuga, sector: d.sector, hipotesis: d.hipotesis } } : await textoWa1(d, ficha, variante, ctx, pq);
    const traza = ['wa1-v-' + variante, 'wa1-ctx-' + ctx.ctx];
    // 4. A y B en horario de supervisión: borrador, aviso y 10 minutos.
    if ((n === 'A' || n === 'B') && !d.soltar && H.supervision(ahora)) {
      await retenerParaMaikel(ficha, t.texto, n, traza);
      return { ok: false, canal: 'espera_maikel', nivel: n, borrador: t.texto, sale: ahora + ESPERA_A_B_MIN * 60000 };
    }
    // 5. Envío.
    await etiquetar(contactId, ['act-wa1-enviando-' + H.sello(ahora)]);
    const env = await primerWhatsApp(contactId, telefono, { nombre: M.nombreCorto(d.nombre), cita: d.fuga || d.hipotesis || 'el diagnóstico', pregunta: M.pregunta(t.datosMsg), texto: t.texto });
    const modo = d.modo || (d.soltar ? 'auto10' : 'auto');
    const quitar = d.soltar ? ['act-espera-maikel'].concat(tags.filter(function (x) { return x.indexOf('act-espera-maikel-h-') === 0; })) : [];
    await etiquetar(contactId, ['act-wa1', 'act-wa1-h-' + H.sello(), 'act-wa1-modo-' + modo].concat(traza,
      env.canal === 'gateway' ? ['act-por-gateway'] : env.canal === 'plantilla' ? ['act-por-plantilla'] : env.canal === 'whatsapp_fallido' ? ['act-wa1-fallido'] : []), quitar);
    try { const f2 = await fichaDe(contactId); if (f2) await require('./_scoring.js').puntuar(f2, { mensajes: [] }); } catch (e) { /* no bloquea */ }
    return Object.assign({}, env, { ok: env.canal !== 'whatsapp_fallido' && env.canal !== 'frenado' && env.canal !== 'pausado', ia: !!t.ia, precualificar: pq, variante: variante, ctx: ctx.ctx, modo: modo, texto: t.texto });
  } finally {
    await soltarCandado(contactId, candado);
  }
}

function nivelDe(c) {
  const S = require('./_scoring.js');
  return S.nivel(S.tipologia(c).puntos, S.comportamiento(c, []).puntos, c);
}

// A/B en supervisión: queda el borrador en una nota y Maikel recibe el aviso.
async function retenerParaMaikel(c, texto, n, traza) {
  if ((c.tags || []).indexOf('act-espera-maikel') > -1) return false;
  const ahora = Date.now();
  const sale = ahora + ESPERA_A_B_MIN * 60000;
  await etiquetar(c.id, ['act-espera-maikel', 'act-espera-maikel-h-' + H.sello(ahora), 'act-wa1-prog-' + H.sello(sale),
    'act-wa1-motivo-supervision', 'nivel-' + String(n).toLowerCase()].concat(traza || []));
  const quien = (c.firstName || c.contactName || '?') + (c.companyName ? ' · ' + c.companyName : '');
  await nota(c.id, 'NIVEL ' + n + ' · PRIMER WHATSAPP EN ESPERA ' + ESPERA_A_B_MIN + ' MIN (regla de Maikel del 1-oct). ' +
    'Sale automáticamente a las ' + H.horaTexto(sale) + ' si Maikel no le escribe antes ni pone la etiqueta wa1-cancelar.\n\nBorrador del primer WhatsApp:\n' + texto);
  // La ficha investigada (api/_enriquecer.js) acompaña al aviso si llega a tiempo.
  const inv = await require('./_enriquecer.js').paraElAviso(c);
  const Av = require('./_aviso.js');
  try {
    await Av.movil('LEAD ' + n + ' · Sale automáticamente a las ' + H.horaTexto(sale) + ' si no haces nada\n' + quien + (c.phone ? '\nTel ' + c.phone : '') +
      (inv && inv.resumen ? '\n\nLo que se ve de su negocio:\n' + inv.resumen + (inv.guardada ? '\n(ficha completa en las notas del CRM)' : '') : '') +
      '\n\nBorrador del primer WhatsApp:\n' + texto +
      '\n\nSi le escribes tú antes, no sale este. Para que no salga nada: etiqueta wa1-cancelar en el CRM.', { forzar: true });
  } catch (e) { console.error('[activacion] aviso A/B al móvil:', e && e.message); }
  try {
    await Av.seMovio('actividad', { nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', email: c.email || '', telefono: c.phone || '', contactId: c.id,
      accion: 'LEAD ' + n + ' · primer WhatsApp sale automáticamente a las ' + H.horaTexto(sale), texto: texto, origen: 'Cadencia' });
  } catch (e) { console.error('[activacion] aviso A/B por correo:', e && e.message); }
  return true;
}

// El borrador que se le enseñó a Maikel (la nota de retenerParaMaikel).
async function borradorRetenido(contactId) {
  try {
    const r = await fetch(GHL_BASE + '/contacts/' + contactId + '/notes', { headers: cabeceras() });
    if (!r.ok) return '';
    const notas = ((await r.json()).notes || []).slice().sort(function (a, b) { return Date.parse(b.dateAdded || 0) - Date.parse(a.dateAdded || 0); });
    const marca = 'Borrador del primer WhatsApp:\n';
    const n = notas.filter(function (x) { return /^NIVEL [AB] · /.test(String(x.body || '')) && String(x.body).indexOf(marca) > -1; })[0];
    return n ? String(n.body).slice(String(n.body).indexOf(marca) + marca.length).trim() : '';
  } catch (e) { return ''; }
}

// Cada 2 minutos (api/wa-agente-reloj.js) y de respaldo cada 10 (api/activacion.js).
// Resuelve los A/B retenidos: humano, cancelado, respondió, o sale solo a los 10 min.
async function soltarRetenidos(opciones) {
  opciones = opciones || {};
  const res = { revisados: 0, enviados: 0, humano: 0, cancelados: 0, respondio: 0, esperando: 0, limpiados: 0, errores: 0, detalle: [] };
  if (PAUSA_TOTAL) return res;
  let lista = [];
  try { lista = await buscarPorEtiqueta('act-espera-maikel', 50); } catch (e) { res.errores++; return res; }
  for (const c of lista) {
    res.revisados++;
    const tags = (c.tags || []).map(String);
    const selloEspera = tags.filter(function (t) { return /^act-espera-maikel-h-\d{12}$/.test(t); })[0] || '';
    const quitar = ['act-espera-maikel'].concat(selloEspera ? [selloEspera] : []);
    const fila = { id: c.id, nombre: c.firstName || c.contactName || '' };
    try {
      if (tags.indexOf('act-wa1') > -1) { // ya salió por otra vía: solo se limpia
        fila.accion = 'limpiar'; await etiquetar(c.id, null, quitar); res.limpiados++; res.detalle.push(fila); continue;
      }
      if (tags.indexOf('wa1-cancelar') > -1) {
        fila.accion = 'cancelado';
        await etiquetar(c.id, ['act-wa1-cancelado', 'act-wa1-modo-cancelado'], quitar.concat(['wa1-cancelar']));
        await nota(c.id, 'PRIMER WHATSAPP CANCELADO por Maikel (etiqueta wa1-cancelar). No sale nada automático: lo lleva él.');
        res.cancelados++; res.detalle.push(fila); continue;
      }
      if (!selloEspera) { // retenido antes de esta versión: el reloj de 10 min empieza ahora
        fila.accion = 'sellar'; await etiquetar(c.id, ['act-espera-maikel-h-' + H.sello()]); res.esperando++; res.detalle.push(fila); continue;
      }
      const desde = H.msDeSello(selloEspera);
      const msgs = (await mensajesDe(c.id)).filter(function (m) {
        return Date.parse(m.dateAdded || 0) >= desde - 60000 && !/ACTIVITY/i.test(String(m.messageType || ''));
      });
      const suyo = msgs.filter(function (m) { return String(m.direction) === 'inbound'; })[0];
      if (suyo) { // contestó antes de que saliera nada (al correo, por ejemplo): sigue el agente
        fila.accion = 'respondio'; await etiquetar(c.id, ['act-wa1-modo-respondio-antes'], quitar);
        await nota(c.id, 'PRIMER WHATSAPP NO ENVIADO: el lead escribió antes de que saliera («' + String(suyo.body || '').slice(0, 160) + '»).');
        res.respondio++; res.detalle.push(fila); continue;
      }
      const nuestro = msgs.filter(function (m) { return String(m.direction) === 'outbound' && !/EMAIL/i.test(String(m.messageType || '')); })[0];
      if (nuestro) { // Maikel le escribió él: su mensaje es el primero
        fila.accion = 'humano';
        await etiquetar(c.id, ['act-wa1', 'act-wa1-h-' + H.sello(Date.parse(nuestro.dateAdded || 0) || Date.now()), 'act-wa1-modo-humano'], quitar);
        await nota(c.id, 'PRIMER WHATSAPP: lo escribió Maikel antes de los ' + ESPERA_A_B_MIN + ' min. No sale el automático.');
        res.humano++; res.detalle.push(fila); continue;
      }
      const min = (Date.now() - desde) / 60000;
      if (min < ESPERA_A_B_MIN || !H.ventanaWhatsApp(Date.now())) { fila.accion = 'esperando'; res.esperando++; res.detalle.push(fila); continue; }
      if (!c.phone) { fila.accion = 'sin_telefono'; await etiquetar(c.id, ['act-wa1-modo-sin-telefono'], quitar); res.errores++; res.detalle.push(fila); continue; }
      if (opciones.seco) { fila.accion = 'enviaria'; res.detalle.push(fila); continue; }
      const texto = await borradorRetenido(c.id);
      const v = (tags.filter(function (t) { return /^wa1-v-/.test(t); })[0] || '').slice(6) || undefined;
      const ctxTag = (tags.filter(function (t) { return /^wa1-ctx-/.test(t); })[0] || '').slice(8);
      const sector = (tags.filter(function (t) { return /^sector-/.test(t); }).sort(function (a, b) { return a.length - b.length; })[0] || '').slice(7).replace(/-/g, ' ');
      const fuga = (tags.filter(function (t) { return /^fuga-/.test(t); })[0] || '').slice(5).replace(/-/g, ' ');
      const env = await primerWhatsAppCompleto(c.id, c.phone, {
        nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', sector: sector, fuga: fuga,
        soltar: true, texto: texto || undefined, variante: v, ctx: ctxTag ? { ctx: ctxTag } : undefined, modo: 'auto10',
        origen: tags.indexOf('leadform') > -1 ? 'leadform' : 'landing'
      });
      fila.accion = env.ok === false ? 'no_salio:' + (env.motivo || env.canal) : 'enviado';
      if (env.ok === false && env.motivo === 'ya_escrito') { // alguien escribió justo ahora: cuenta como humano
        await etiquetar(c.id, ['act-wa1', 'act-wa1-h-' + H.sello(), 'act-wa1-modo-humano'], quitar); res.humano++;
      } else if (env.ok === false) { res.errores++; }
      else {
        res.enviados++;
        try { await require('./_aviso.js').movil('Ha salido solo el primer WhatsApp a ' + (c.firstName || c.contactName || 'un lead') + (c.companyName ? ' · ' + c.companyName : '') + ' (no lo tocaste en ' + ESPERA_A_B_MIN + ' min).', { forzar: true }); } catch (e) { /* no bloquea */ }
      }
      res.detalle.push(fila);
    } catch (e) {
      res.errores++; fila.error = String(e && e.message).slice(0, 160); res.detalle.push(fila);
    }
  }
  return res;
}

// Siguiente acción para Maikel con fecha: ahora si está en su horario de
// supervisión, o al empezar el siguiente. Tarea en GHL asignada a él.
const USUARIO_MAIKEL = 'nXgGkRbPWcDpdydQ06ns';
async function siguienteAccion(c, titulo, cuerpo) {
  const vence = H.siguienteSupervision(Date.now()) || Date.now();
  const r = await fetch(GHL_BASE + '/contacts/' + c.id + '/tasks', {
    method: 'POST', headers: cabeceras(),
    body: JSON.stringify({ title: titulo + ' · ' + (c.firstName || c.contactName || ''), body: String(cuerpo || '').slice(0, 2000), dueDate: new Date(vence).toISOString(), completed: false, assignedTo: USUARIO_MAIKEL })
  });
  await nota(c.id, 'SIGUIENTE ACCIÓN para Maikel · ' + titulo + ' · para el ' + H.cuandoTexto(vence)).catch(function () {});
  return r.ok;
}

// Motivo para no mandar el primer WhatsApp, o '' si se puede. El envío en curso caduca a los
// 15 minutos: si la función murió a medias, el reloj de activación puede volver a intentarlo.
async function yaTienePrimerWhatsApp(contactId, ficha) {
  const tags = ((ficha && ficha.tags) || []).map(String);
  if (tags.indexOf('act-wa1') > -1) return 'ya_marcado';
  const enCurso = tags.filter(function (t) { return /^act-wa1-enviando-\d{12}$/.test(t); }).some(function (t) {
    const s = t.slice(-12);
    return minutosDesde(s.slice(0, 4) + '-' + s.slice(4, 6) + '-' + s.slice(6, 8) + 'T' + s.slice(8, 10) + ':' + s.slice(10, 12) + ':00Z') < 15;
  });
  if (enCurso) return 'enviando';
  try {
    const hace24h = Date.now() - 24 * 3600 * 1000;
    const nuestros = (await mensajesDe(contactId)).filter(function (m) {
      return m.direction === 'outbound' && !/ACTIVITY|EMAIL/i.test(String(m.messageType || '')) && Date.parse(m.dateAdded || 0) > hace24h;
    });
    if (nuestros.length) return 'ya_escrito';
  } catch (e) { /* sin conversación legible: se sigue con las etiquetas */ }
  return '';
}

async function mensajesDe(contactId) {
  const r = await fetch(GHL_BASE + '/conversations/search?locationId=' +
    encodeURIComponent(process.env.GHL_LOCATION_ID) + '&contactId=' + contactId, { headers: cabeceras() });
  if (!r.ok) return [];
  const d = await r.json().catch(function () { return {}; });
  const todos = [];
  for (const c of (d.conversations || [])) {
    const m = await fetch(GHL_BASE + '/conversations/' + c.id + '/messages?limit=50', { headers: cabeceras() });
    if (!m.ok) continue;
    const dm = await m.json().catch(function () { return {}; });
    const lista = (dm.messages && dm.messages.messages) || dm.messages || [];
    todos.push.apply(todos, Array.isArray(lista) ? lista : []);
  }
  todos.sort(function (a, b) { return Date.parse(a.dateAdded || 0) - Date.parse(b.dateAdded || 0); });
  return sinDuplicados(todos);
}

// Desde el 23-sep el 647 está a la vez en Wazzap (pasarela) y en la API
// oficial de WhatsApp de GHL: cada mensaje queda registrado dos veces, uno
// como TYPE_CUSTOM_SMS de la pasarela y otro como TYPE_WHATSAPP con
// source «app», con uno o dos segundos de diferencia. El lead lo recibe una
// vez, pero quien lea la conversación (el agente, el reenganche, los
// recordatorios, los recuentos) la vería doble. Se queda el primero de cada
// pareja: misma dirección, mismo texto y menos de 90 segundos entre ellos.
function textoPlano(m) {
  return String((m && m.body) || '').replace(/✅ Sent from another device ✅/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}
function sinDuplicados(lista) {
  const fuera = [];
  return lista.filter(function (m) {
    if (/ACTIVITY/i.test(String(m.messageType || ''))) return true;
    const t = textoPlano(m); const cuando = Date.parse(m.dateAdded || 0);
    if (!t) return true;
    const repe = fuera.some(function (k) { return k.dir === m.direction && k.t === t && Math.abs(k.cuando - cuando) < 90000; });
    fuera.push({ dir: m.direction, t: t, cuando: cuando });
    return !repe;
  });
}

// Freno (Maikel, 23-sep, tras ver ocho mensajes a un lead que no contestaba):
// si en las últimas 24 horas le hemos escrito tres veces o más por WhatsApp
// sin que conteste, no sale un cuarto automático y se avisa a Maikel. La
// cadencia normal manda dos el primer día; primer mensaje + confirmación +
// recordatorio son tres. El cuarto es el que sobra.
const TOPE_SIN_RESPUESTA = parseInt(process.env.TOPE_SIN_RESPUESTA || '3', 10);
async function seguidosSinRespuesta(contactId) {
  const ms = await mensajesDe(contactId);
  const desde = Date.now() - 24 * 3600 * 1000;
  let n = 0;
  for (let i = ms.length - 1; i >= 0; i--) {
    const m = ms[i];
    if (/ACTIVITY/i.test(String(m.messageType || ''))) continue;
    if (!/WHATSAPP|SMS/i.test(String(m.messageType || ''))) continue;
    if (String(m.direction) === 'inbound') break;
    if (Date.parse(m.dateAdded || 0) < desde) break;
    if (String(m.status || '').toLowerCase() === 'failed') continue;
    n++;
  }
  return n;
}
async function frenoSinRespuesta(contactId, texto) {
  let n = 0;
  try { n = await seguidosSinRespuesta(contactId); } catch (e) { return false; }
  if (n < TOPE_SIN_RESPUESTA) return false;
  const marca = 'tope-aviso-' + new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).replace(/-/g, '');
  try {
    const r = await fetch(GHL_BASE + '/contacts/' + contactId, { headers: cabeceras() });
    const c = r.ok ? ((await r.json()).contact || {}) : {};
    if ((c.tags || []).indexOf(marca) === -1) {
      await etiquetar(contactId, [marca]);
      await require('./_aviso.js').movil('FRENADO · ' + (c.firstName || c.contactName || 'lead') + (c.phone ? ' · ' + c.phone : '') +
        '\nYa lleva ' + n + ' WhatsApp nuestros sin contestar en 24 h. No se le manda este:\n\n' + String(texto || '').slice(0, 400));
    }
    await nota(contactId, 'FRENADO: ' + n + ' WhatsApp sin respuesta en 24 h. No salió: ' + String(texto || '').slice(0, 300));
  } catch (e) { /* el aviso no bloquea */ }
  return true;
}

// El fallo del WhatsApp por la ventana de 24 h no siempre llega en los cinco
// segundos que espera enviarMensaje. El 17-sep a las 00:12 un lead de reformas
// se quedó sin nada: el WhatsApp cayó en «failed» siete segundos después de
// salir, la comprobación ya había pasado, y el SMS de respaldo nunca se envió.
// Esto lo mira el reloj en cada vuelta: cualquier WhatsApp saliente fallido que
// no tenga ya el mismo texto enviado por SMS, se manda por SMS.
// Solo mira los WhatsApp de esta cadencia (desde `desdeMs`): sin ese corte, la
// primera vuelta reenvió por SMS pruebas fallidas de hace días.
async function reenviarFallidos(contactId, desdeMs) {
  if (!GATEWAY_PERMITIDO) return 0;
  const msgs = await mensajesDe(contactId);
  const salientes = msgs.filter(function (m) { return String(m.direction) === 'outbound'; });
  const corte = (desdeMs || 0) - 10 * 60000;
  let enviados = 0;
  for (const m of salientes) {
    if (!/WHATSAPP/i.test(String(m.messageType || ''))) continue;
    if (Date.parse(m.dateAdded || 0) < corte) continue;
    // Lo que mandó un workflow de GHL (la plantilla de apertura) no se repite:
    // el 19-sep Pablo recibió por la pasarela el texto personalizado Y la
    // plantilla, uno detrás de otro, desde el móvil de Maikel.
    if (String(m.source || '') === 'workflow') continue;
    if (String(m.status || '').toLowerCase() !== 'failed' && !m.error) continue;
    const cuerpo = String(m.body || '').trim();
    if (!cuerpo) continue;
    const yaPorGateway = salientes.some(function (x) {
      return /SMS/i.test(String(x.messageType || '')) && String(x.body || '').trim() === cuerpo;
    });
    if (yaPorGateway) continue;
    await enviarPorGateway(contactId, cuerpo);
    enviados++;
  }
  return enviados;
}

// Teléfono a E.164 español. Sin prefijo y con nueve dígitos se asume España;
// cualquier otra cosa se devuelve como está para no inventar un número.
function telefonoE164(valor) {
  const s = String(valor || '').replace(/[^\d+]/g, '');
  if (!s) return '';
  if (s.startsWith('+')) return s;
  if (s.startsWith('00')) return '+' + s.slice(2);
  if (s.startsWith('34') && s.length === 11) return '+' + s;
  if (s.length === 9) return '+34' + s;
  return '';
}

// Saliente: el asistente va en cada llamada, así que el mismo número lo pueden
// usar varias campañas sin pisarse. Los entrantes no se tocan.
async function lanzarLlamada(datos) {
  if (PAUSA_TOTAL) return { ok: false, motivo: 'pausa_total' };
  const clave = process.env.VAPI_API_KEY;
  const asistente = process.env.VAPI_ASSISTANT_ID;
  if (!clave || !asistente) return { ok: false, motivo: 'sin_credenciales' };

  const numero = telefonoE164(datos.telefono);
  if (!numero) return { ok: false, motivo: 'telefono_invalido' };

  const r = await fetch(VAPI_BASE + '/call', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + clave, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      assistantId: asistente,
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID || NUMERO_SALIENTE,
      customer: { number: numero, name: datos.nombre || undefined },
      assistantOverrides: { variableValues: datos.contexto || {} }
    })
  });
  if (!r.ok) return { ok: false, motivo: 'vapi_' + r.status, detalle: (await r.text()).slice(0, 200) };
  const d = await r.json().catch(function () { return {}; });
  return { ok: true, id: d.id };
}

// Detecta si el contacto ha contestado, sin depender de que GHL tenga un
// workflow puesto. Devuelve qué hacer: parar la cadencia porque ha respondido,
// o darle de baja si lo ha pedido con todas las letras.
const BAJA = /\b(baja|d[ae]r?me de baja|no me interesa|no estoy interesad|dejad?me? en paz|stop|unsubscribe|no escrib|no vuelvas a|no quiero)\b/i;

async function revisarRespuesta(contactId, desdeMs) {
  // Mira TODOS los mensajes desde el arranque, no solo el último de cada
  // conversación: si Maikel contesta desde el móvil, el último pasa a ser
  // saliente y la respuesta del lead quedaba tapada (Carlos Cuevas, 21-sep:
  // contestó «ahora no, acabo de llegar a casa», Maikel le respondió, y la
  // cadencia le llamó y le escribió a la mañana siguiente).
  try {
    const mensajes = await mensajesDe(contactId);
    let respondio = false, texto = '', primeraMs = 0;
    for (const m of mensajes) {
      if (String(m.direction) !== 'inbound') continue;
      if (Date.parse(m.dateAdded || 0) < (desdeMs || 0)) continue;
      if (!/SMS|WHATSAPP|EMAIL|CUSTOM/i.test(String(m.messageType || ''))) continue;
      respondio = true;
      if (!primeraMs) primeraMs = Date.parse(m.dateAdded || 0) || 0;
      texto = String(m.body || '') || texto;
    }
    return { respondio: respondio, baja: BAJA.test(texto), texto: texto.slice(0, 200), primeraMs: primeraMs };
  } catch (err) {
    return { respondio: false };
  }
}

async function tieneCitaGHL(contactId) {
  try {
    const r = await fetch(GHL_BASE + '/contacts/' + contactId + '/appointments', { headers: cabeceras() });
    if (!r.ok) return false;
    const d = await r.json();
    return (d.events || d.appointments || []).some(function (e) {
      return !/cancelled|noshow/i.test(String(e.appointmentStatus || ''));
    });
  } catch (err) {
    return false;
  }
}

function tiene(contacto, etiqueta) {
  return (contacto.tags || []).some(function (t) { return String(t).toLowerCase() === etiqueta; });
}

function minutosDesde(iso) {
  const t = Date.parse(iso);
  return isFinite(t) ? (Date.now() - t) / 60000 : Infinity;
}

// Envio de correo suelto, para lo que no va por la cadencia del reloj (hoy, el
// correo del minuto cero). Devuelve el motivo en vez de lanzar: quien lo llama
// esta a mitad de dar de alta un lead y no puede romperse por esto.
async function enviarCorreo(email, asunto, html) {
  if (PAUSA_TOTAL) return { ok: false, motivo: 'pausa_total' };
  if (!process.env.RESEND_API_KEY) return { ok: false, motivo: 'sin_resend' };
  if (!email) return { ok: false, motivo: 'sin_email' };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RADIOGRAFIA_FROM || 'Maikel de Qualivo <onboarding@resend.dev>',
        to: [email], subject: asunto, html: html
      })
    });
    return { ok: r.ok, motivo: r.ok ? '' : 'resend_' + r.status };
  } catch (e) {
    return { ok: false, motivo: 'fetch_' + (e && e.message) };
  }
}

module.exports = {
  PAUSA_TOTAL,
  GHL_BASE, GHL_VERSION, cabeceras, ahoraMadrid, enVentana, buscarPorEtiqueta, saldriaPorGateway, enviarCorreo,
  etiquetar, nota, enviarWhatsApp, enviarSMS, enviarPorGateway, esWhatsApp, GATEWAY_PROVIDER, enviarMensaje, primerWhatsApp, primerWhatsAppCompleto, yaTienePrimerWhatsApp, retenerParaMaikel, nivelDe, camposWA, leerCamposWA, CAMPOS_WA, estadoMensaje, mensajesDe, reenviarFallidos,
  lanzarLlamada, telefonoE164, tiene, minutosDesde, revisarRespuesta, tieneCitaGHL, BAJA,
  sinDuplicados, seguidosSinRespuesta, frenoSinRespuesta,
  soltarRetenidos, siguienteAccion, tomarCandado, soltarCandado, borradorRetenido, ESPERA_A_B_MIN, WA1_CORTO
};
