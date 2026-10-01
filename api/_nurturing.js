// Nurturing por correo (Maikel, 1-oct-2026: «monta esta, para formación y para
// clínicas»). Textos y HTML en content/nurturing/correo/ (generar.py), que
// escribe api/_nurturing-correos.json.
//
// Seis correos desde que entra el lead: día 0 (15 min), 2, 5, 8, 12 y 20.
//   - Corre a la vez que la cadencia de WhatsApp. El 0 espera a que haya salido
//     el primer WhatsApp (dice «te acabo de escribir por WhatsApp»); el resto,
//     en días laborables de 9:00 a 19:00 y nunca el mismo día que un WhatsApp
//     de la cadencia.
//   - Sustituye al correo de bienvenida en formación y clínicas (el 0 hace ese
//     papel). Si la bienvenida ya salió, o el lead entró hace más de 3 h, se
//     empieza por el 1.
//   - Se para si contesta por cualquier canal, reserva, pide la baja, Maikel lo
//     coge (wa-humano) o le pone la etiqueta nut-stop.
// Estado en etiquetas: nut-on (en curso), nut-0 … nut-5 (enviados o saltados),
// nut-fin. Nada de aquí lanza.

const A = require('./_activacion');
const H = require('./_horario');
const CORREOS = require('./_nurturing-correos.json');

// Clínicas se enciende cuando Maikel apruebe sus textos (1-oct: vista previa enviada).
const CLINICAS_APROBADO = false;
const ACTIVO = {
  formacion: process.env.NURTURING_FORMACION !== '0',
  clinicas: CLINICAS_APROBADO && process.env.NURTURING_CLINICAS !== '0'
};
// Solo leads que entran desde aquí (Javier, 1-oct 18:00, ya entra).
const DESDE = Date.parse(process.env.NURTURING_DESDE || '2026-10-01T15:30:00Z');
const FROM = process.env.NURTURING_FROM || 'Maikel Echevarría <maikel@qualivo.io>';
const RESPONDER_A = process.env.NURTURING_REPLY_TO || 'maikel@qualivo.io';
const MAX_ENVIOS = 10;
const PARADAS = ['act-respondio', 'respondio', 'act-agendado', 'act-cita-confirmada', 'act-baja', 'wa-humano', 'nut-stop', 'nut-fin'];
const EN_BLANCO = { formacion: 'vuestro centro', clinicas: 'vuestra clínica' };

function tiene(c, t) { return ((c && c.tags) || []).map(String).indexOf(t) > -1; }

// Vertical del lead por sus etiquetas, o por el texto del sector del formulario.
function verticalDe(tagsOSector) {
  const t = Array.isArray(tagsOSector) ? tagsOSector.map(String).join(' ') : String(tagsOSector || '');
  if (/sector-formaci|formaci[oó]n|academia|escuela|\bfp\b/i.test(t)) return 'formacion';
  if (/sector-clinic|cl[ií]nica|salud|dental|bienestar/i.test(t)) return 'clinicas';
  return '';
}
// ¿El nurturing hace de bienvenida para este sector? (lo usan el webhook y el rescate)
function sustituyeBienvenida(sector) { const v = verticalDe(sector); return !!(v && ACTIVO[v]); }

function nombrePila(v) {
  const p = String(v || '').replace(/^\s*(arq|dra|dr|sra|sr|ing|lic|prof|don|doña)(\.\s*|\s+)/i, '').trim().split(/\s+/)[0] || '';
  return p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : '';
}
function escapar(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// Asunto y HTML con nombre y empresa (sin empresa: «vuestro centro» / «vuestra clínica»).
function componer(vertical, n, c) {
  const plantilla = (CORREOS[vertical] || [])[n];
  if (!plantilla) return null;
  const nombre = nombrePila(c.firstName || c.contactName || '');
  const empresa = String(c.companyName || '').trim().slice(0, 60) || EN_BLANCO[vertical];
  const poner = function (s, html) {
    let out = s.replace(/Hola \{\{nombre\}\}:/g, nombre ? 'Hola ' + (html ? escapar(nombre) : nombre) + ':' : 'Hola:');
    out = out.replace(/\{\{nombre\}\}/g, html ? escapar(nombre) : nombre).replace(/\{\{empresa\}\}/g, html ? escapar(empresa) : empresa);
    return out;
  };
  return { asunto: poner(plantilla.asunto, false), html: poner(plantilla.html, true) };
}

function entradaDe(c) {
  const t = ((c && c.tags) || []).map(String).filter(function (x) { return /^act-ini-\d{12}$/.test(x); })[0];
  if (t) return H.msDeSello(t);
  return Date.parse((c && c.dateAdded) || 0) || 0;
}
// ¿Salió hoy (Madrid) un WhatsApp de la cadencia? (act-wa2-h-/act-wa3-h-, en UTC)
function whatsappDeCadenciaHoy(c, ahora) {
  const hoy = H.madrid(ahora);
  return ((c && c.tags) || []).map(String).some(function (t) {
    const m = t.match(/^act-wa[23]-h-(\d{12})$/);
    if (!m) return false;
    return H.madrid(H.msDeSello(t)).fecha === hoy.fecha;
  });
}

// Qué toca ahora con este contacto: { n, saltar? } o null. Puro.
function siguiente(c, ahora) {
  const v = verticalDe(c.tags);
  if (!v || !ACTIVO[v] || !c.email || c.dnd === true) return null;
  if (PARADAS.some(function (p) { return tiene(c, p); })) return null;
  const entro = entradaDe(c);
  if (!entro || entro < DESDE) return null;
  let n = 0;
  while (n < CORREOS.dias.length && tiene(c, 'nut-' + n)) n++;
  if (n >= CORREOS.dias.length) return { fin: true };
  if (n === 0) {
    // El 0 dice «te acabo de escribir por WhatsApp»: cuenta desde ese WhatsApp
    // (de noche sale a las 8:00) o, sin teléfono, desde la entrada.
    if (tiene(c, 'act-email0')) return { n: 0, saltar: true, vertical: v }; // la bienvenida ya salió
    const wa = ((c.tags || []).map(String).filter(function (x) { return /^act-wa1-h-\d{12}$/.test(x); })[0]);
    let base = entro;
    if (c.phone) {
      if (!tiene(c, 'act-wa1')) return ahora - entro > 24 * 3600 * 1000 ? { n: 0, saltar: true, vertical: v } : null;
      base = wa ? H.msDeSello(wa) : entro;
    }
    if (ahora - base > 3 * 3600 * 1000) return { n: 0, saltar: true, vertical: v }; // ya no es «acabo de»
    if (ahora - base < 15 * 60000 || !H.ventanaWhatsApp(ahora)) return null;
    return { n: 0, vertical: v };
  }
  if (ahora < entro + CORREOS.dias[n] * 24 * 3600 * 1000) return null;
  const t = H.madrid(ahora);
  if (!H.esLaborable(ahora) || t.hora < 9 || t.hora >= 19) return null;
  if (whatsappDeCadenciaHoy(c, ahora)) return null;
  return { n: n, vertical: v };
}

async function enviar(c, vertical, n) {
  if (A.PAUSA_TOTAL) return { ok: false, motivo: 'pausa_total' };
  if (!process.env.RESEND_API_KEY) return { ok: false, motivo: 'sin_resend' };
  const m = componer(vertical, n, c);
  if (!m) return { ok: false, motivo: 'sin_plantilla' };
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: FROM, to: [c.email], reply_to: RESPONDER_A, subject: m.asunto, html: m.html,
        headers: { 'List-Unsubscribe': '<mailto:' + RESPONDER_A + '?subject=baja>' },
        // Las mismas etiquetas que lee api/resend-evento.js (aperturas y clics).
        tags: [{ name: 'paso', value: 'nut-' + vertical + '-' + n }, { name: 'contacto', value: String(c.id).replace(/[^A-Za-z0-9_-]/g, '') }]
      })
    });
    return { ok: r.ok, motivo: r.ok ? '' : 'resend_' + r.status, asunto: m.asunto };
  } catch (e) { return { ok: false, motivo: 'fetch_' + (e && e.message) }; }
}

// Una vuelta (la llama el reloj de activación cada 10 min).
async function vuelta(opciones) {
  opciones = opciones || {};
  const ahora = Date.now();
  const limite = ahora + (opciones.presupuestoMs || 15000);
  const res = { altas: 0, enviados: 0, saltados: 0, terminados: 0, errores: 0, detalle: [] };
  if (!ACTIVO.formacion && !ACTIVO.clinicas) return res;
  // Altas: leads en cadencia, de formación o clínicas, con correo, que entraron desde DESDE.
  try {
    const nuevos = await A.buscarPorEtiqueta('activacion', 100);
    for (const c of nuevos) {
      if (tiene(c, 'nut-on') || tiene(c, 'nut-fin') || ((c.tags || []).some(function (t) { return /^nut-\d$/.test(String(t)); }))) continue;
      const v = verticalDe(c.tags);
      if (!v || !ACTIVO[v] || !c.email || entradaDe(c) < DESDE) continue;
      await A.etiquetar(c.id, ['nut-on']); res.altas++;
    }
  } catch (e) { res.errores++; }
  let lista = [];
  try { lista = await A.buscarPorEtiqueta('nut-on', 300); } catch (e) { res.errores++; return res; }
  for (const c0 of lista) {
    if (Date.now() > limite || res.enviados >= MAX_ENVIOS) break;
    const c = Object.assign({}, c0, { tags: (c0.tags || []).map(String) });
    try {
      if (PARADAS.some(function (p) { return tiene(c, p); })) {
        await A.etiquetar(c.id, null, ['nut-on']);
        res.terminados++; res.detalle.push({ id: c.id, accion: 'parado' }); continue;
      }
      const s = siguiente(c, Date.now());
      if (!s) continue;
      if (s.fin) {
        await A.etiquetar(c.id, ['nut-fin'], ['nut-on']); res.terminados++; res.detalle.push({ id: c.id, accion: 'fin' }); continue;
      }
      if (s.saltar) { await A.etiquetar(c.id, ['nut-' + s.n]); res.saltados++; res.detalle.push({ id: c.id, accion: 'salta ' + s.n }); continue; }
      if (opciones.seco) { res.detalle.push({ id: c.id, accion: 'enviaría ' + s.vertical + '-' + s.n }); continue; }
      // Candado corto: dos vueltas a la vez no mandan el mismo correo.
      const candado = await A.tomarCandado(c.id, 'qv-nut');
      if (!candado) continue;
      try {
        const fresca = await fetch(A.GHL_BASE + '/contacts/' + c.id, { headers: A.cabeceras() }).then(function (r) { return r.ok ? r.json() : {}; }).then(function (d) { return d.contact || null; }).catch(function () { return null; });
        if (!fresca || tiene(fresca, 'nut-' + s.n)) continue;
        await A.etiquetar(c.id, ['nut-' + s.n]); // antes de enviar: si algo falla después, no se repite
        const r = await enviar(c, s.vertical, s.n);
        if (r.ok) {
          res.enviados++; res.detalle.push({ id: c.id, accion: 'enviado ' + s.vertical + '-' + s.n });
          await A.nota(c.id, 'NURTURING · correo ' + s.n + ' (' + s.vertical + ') enviado: «' + r.asunto + '»').catch(function () {});
        } else {
          await A.etiquetar(c.id, null, ['nut-' + s.n]); // se reintenta en la vuelta siguiente
          res.errores++; res.detalle.push({ id: c.id, accion: 'error ' + r.motivo });
        }
      } finally { await A.soltarCandado(c.id, candado); }
    } catch (e) { res.errores++; }
  }
  return res;
}

module.exports = { ACTIVO: ACTIVO, DESDE: DESDE, verticalDe: verticalDe, sustituyeBienvenida: sustituyeBienvenida, componer: componer, siguiente: siguiente, vuelta: vuelta };
