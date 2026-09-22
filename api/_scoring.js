// Puntuación de leads (Maikel, 21/22-sep-2026): dos notas de 0 a 10 y una letra.
//
//   Tipología (lo que es): inversión declarada, volumen de peticiones, sector.
//   Comportamiento (lo que hace): contestó, cuánto tardó, habló con Raquel,
//   cogió cita, volvió a escribir. Se resta si pidió baja o no se presentó.
//
//   A · tipología ≥ 6 y comportamiento ≥ 5 → prioridad de Maikel, aviso al momento
//   B · tipología ≥ 6 y comportamiento < 5 → el sistema insiste (cadencia, reenganche)
//   C · tipología < 6 y comportamiento ≥ 5 → se atiende, sin dedicarle horas
//   D · el resto, o baja / no responde       → se guarda
//
// Se escribe en los campos «Score · Tipología / Comportamiento / Nivel /
// Motivo» del contacto y en la etiqueta nivel-a|b|c|d. Cuando un contacto pasa
// a A por primera vez, se avisa a Maikel (etiqueta score-aviso-a para no
// repetir). Lo llama el reloj de activación en cada vuelta y se puede correr a
// mano: node -e "require('./api/_scoring.js').puntuarTodos().then(console.log)".

const A = require('./_activacion');

const CAMPOS = {
  tipo: 'cK3wfNGtB1sn4qe1Aedy',
  comport: 'djjJgYakFzyVvHo5HBAF',
  nivel: 'sboBzOUXmPgJp85DeBgv',
  motivo: 'aTDOe7eIT4BVoRNN4P0J'
};

function etiqueta(c, prefijo) {
  const t = (c.tags || []).map(String).filter(function (x) { return x.indexOf(prefijo) === 0; }).sort(function (a, b) { return a.length - b.length; })[0];
  return t ? t.slice(prefijo.length) : '';
}

function tipologia(c) {
  const motivos = [];
  let p = 0;
  const inv = etiqueta(c, 'inv-');
  if (/mas-de-2|2-000-y|mas-2000|entre-2-000/.test(inv)) { p += 5; motivos.push('invierte más de 2.000 €'); }
  else if (/entre-500|500-y-2/.test(inv)) { p += 4; motivos.push('invierte 500-2.000 €'); }
  else if (/menos-de-500|menos-500/.test(inv)) { p += 2; motivos.push('invierte menos de 500 €'); }
  else if (/nada/.test(inv)) { p += 0; motivos.push('no invierte'); }
  else { p += 2; }
  const vol = etiqueta(c, 'vol-');
  if (/mas|50-100/.test(vol)) { p += 3; motivos.push('más de 50 peticiones/mes'); }
  else if (/20-50|15-30/.test(vol)) { p += 2; motivos.push('20-50 peticiones/mes'); }
  else if (/5-15|15-20|10-20/.test(vol)) { p += 1; motivos.push('5-15 peticiones/mes'); }
  else if (/menos/.test(vol)) { p += 0; motivos.push('menos de 5 peticiones/mes'); }
  else { p += 1; }
  const sector = etiqueta(c, 'sector-');
  if (/clinic|formaci|reforma|asesor/.test(sector)) { p += 2; } else if (sector) { p += 1; motivos.push('sector fuera de las verticales'); }
  else { p += 1; }
  return { puntos: Math.min(10, p), motivos: motivos };
}

function comportamiento(c, mensajes) {
  const motivos = [];
  let p = 0;
  const tiene = function (t) { return A.tiene(c, t); };
  const entrantes = (mensajes || []).filter(function (m) { return String(m.direction) === 'inbound' && !/ACTIVITY/.test(String(m.messageType || '')); });
  const salientes = (mensajes || []).filter(function (m) { return String(m.direction) === 'outbound' && !/ACTIVITY/.test(String(m.messageType || '')); });
  if (entrantes.length) {
    p += 3; motivos.push('contestó');
    // Velocidad: minutos entre nuestro primer mensaje y su primera respuesta.
    const primeroFuera = salientes[0], primeroDentro = entrantes[0];
    if (primeroFuera && primeroDentro) {
      const min = (Date.parse(primeroDentro.dateAdded) - Date.parse(primeroFuera.dateAdded)) / 60000;
      if (min >= 0 && min <= 60) { p += 1; motivos.push('contestó en menos de una hora'); }
    }
    if (entrantes.length >= 3) { p += 1; motivos.push('conversación de varios mensajes'); }
  }
  if (tiene('voz-completada')) { p += 2; motivos.push('habló con Raquel'); }
  if (tiene('act-agendado') || tiene('act-cita-confirmada') || tiene('reunion-reservada.')) { p += 4; motivos.push('cogió cita'); }
  if (tiene('reunion-celebrada')) { p += 1; motivos.push('vino a la reunión'); }
  if (tiene('no-presentado')) { p -= 3; motivos.push('no se presentó'); }
  if (tiene('act-baja')) { p = 0; motivos.push('pidió baja'); }
  if (tiene('no-responde') || tiene('act-descartado')) { p = Math.min(p, 1); motivos.push('sin respuesta tras la cadencia'); }
  return { puntos: Math.max(0, Math.min(10, p)), motivos: motivos };
}

function nivel(tipo, comp, c) {
  if (A.tiene(c, 'act-baja') || A.tiene(c, 'no-responde') || A.tiene(c, 'act-descartado')) return 'D';
  if (tipo >= 6 && comp >= 5) return 'A';
  if (tipo >= 6) return 'B';
  if (comp >= 5) return 'C';
  return 'D';
}

function leerNivel(c) {
  const f = (c.customFields || []).filter(function (x) { return x && x.id === CAMPOS.nivel; })[0];
  return f ? String(f.value || f.field_value || '') : '';
}

async function puntuar(c, opciones) {
  opciones = opciones || {};
  const mensajes = opciones.mensajes || await A.mensajesDe(c.id);
  const t = tipologia(c), k = comportamiento(c, mensajes);
  const n = nivel(t.puntos, k.puntos, c);
  const motivo = [].concat(t.motivos, k.motivos).join(' · ');
  const anterior = leerNivel(c);
  if (!opciones.seco) {
    await fetch(A.GHL_BASE + '/contacts/' + c.id, {
      method: 'PUT', headers: A.cabeceras(),
      body: JSON.stringify({ customFields: [
        { id: CAMPOS.tipo, field_value: t.puntos }, { id: CAMPOS.comport, field_value: k.puntos },
        { id: CAMPOS.nivel, field_value: n }, { id: CAMPOS.motivo, field_value: motivo.slice(0, 900) }
      ] })
    });
    const quitar = ['nivel-a', 'nivel-b', 'nivel-c', 'nivel-d'].filter(function (x) { return x !== 'nivel-' + n.toLowerCase() && A.tiene(c, x); });
    await A.etiquetar(c.id, ['nivel-' + n.toLowerCase()], quitar.length ? quitar : null);
    if (n === 'A' && !A.tiene(c, 'score-aviso-a')) {
      await A.etiquetar(c.id, ['score-aviso-a']);
      try {
        await require('./_aviso.js').seMovio('actividad', { nombre: c.firstName || c.contactName || '', empresa: c.companyName || '', email: c.email || '', telefono: c.phone || '', contactId: c.id,
          accion: 'LEAD A · tipología ' + t.puntos + '/10 · comportamiento ' + k.puntos + '/10', texto: motivo, origen: 'Puntuación' });
      } catch (e) { /* no bloquea */ }
    }
  }
  return { id: c.id, nombre: c.contactName || c.firstName || '', tipo: t.puntos, comport: k.puntos, nivel: n, antes: anterior, motivo: motivo };
}

// Puntúa todos los leads del sistema (etiqueta paid). opciones.seco no escribe.
async function puntuarTodos(opciones) {
  opciones = opciones || {};
  const lista = await A.buscarPorEtiqueta('paid', 1500);
  const res = [];
  for (const c of lista) {
    if (A.tiene(c, 'cliente-actual')) continue;
    if (opciones.desdeMs && Date.parse(c.dateUpdated || c.dateAdded || 0) < opciones.desdeMs) continue;
    try { res.push(await puntuar(c, opciones)); } catch (e) { res.push({ id: c.id, error: String(e.message).slice(0, 80) }); }
  }
  const cuenta = { A: 0, B: 0, C: 0, D: 0 };
  res.forEach(function (r) { if (r.nivel) cuenta[r.nivel]++; });
  let hoja = null;
  if (!opciones.seco && !opciones.desdeMs) { try { hoja = await volcarHoja(res, lista); } catch (e) { hoja = { ok: false, motivo: String(e.message).slice(0, 100) }; } }
  return { total: res.length, cuenta: cuenta, detalle: res, hoja: hoja };
}

// Hoja «Puntuación de leads Qualivo» (Maikel, 22-sep): una fila por lead, se
// reescribe entera cada vez. Necesita GOOGLE_SA_JSON (el mismo del informe).
const HOJA = process.env.SCORING_SHEET_ID || '158tKmIYVhAvrmJEeAU404bIztALIc7JoNZVAk2Pkt6s';
const CAB = ['Nivel', 'Tipología', 'Comportamiento', 'Nombre', 'Empresa', 'Sector', 'Inversión', 'Peticiones/mes', 'Etapa', 'Motivo', 'Alta', 'Última actualización', 'Ficha GHL'];

async function volcarHoja(detalle, contactos) {
  if (!process.env.GOOGLE_SA_JSON) return { ok: false, motivo: 'sin GOOGLE_SA_JSON' };
  const G = require('./_google');
  const T = require('./_tratos.js');
  const nombreEtapa = {}; Object.keys(T.ETAPAS).forEach(function (k) { nombreEtapa[T.ETAPAS[k]] = k; });
  const porId = {}; (contactos || []).forEach(function (c) { porId[c.id] = c; });
  const orden = { A: 0, B: 1, C: 2, D: 3 };
  const filas = [];
  for (const r of detalle.filter(function (x) { return x.nivel; }).sort(function (a, b) { return (orden[a.nivel] - orden[b.nivel]) || ((b.tipo + b.comport) - (a.tipo + a.comport)); })) {
    const c = porId[r.id] || {};
    let etapa = '';
    try { const op = await T.abierto(r.id); etapa = op ? (nombreEtapa[op.pipelineStageId] || '') : ''; } catch (e) { etapa = ''; }
    filas.push([r.nivel, r.tipo, r.comport, r.nombre || '', c.companyName || '', etiqueta(c, 'sector-').replace(/-/g, ' '), etiqueta(c, 'inv-').replace(/-/g, ' '), etiqueta(c, 'vol-').replace(/-/g, ' '), etapa, r.motivo,
      String(c.dateAdded || '').slice(0, 10), new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }), 'https://app.gohighlevel.com/v2/location/' + process.env.GHL_LOCATION_ID + '/contacts/detail/' + r.id]);
  }
  const tab = 'Leads';
  await G.sheets('POST', HOJA + '/values/' + encodeURIComponent("'" + tab + "'!A2:Z") + ':clear', {});
  await G.sheets('PUT', HOJA + '/values/' + encodeURIComponent("'" + tab + "'!A1") + '?valueInputOption=USER_ENTERED', { values: [CAB].concat(filas) });
  // Resumen arriba a la derecha de la pestaña Resumen
  const cuenta = { A: 0, B: 0, C: 0, D: 0 }; detalle.forEach(function (r) { if (r.nivel) cuenta[r.nivel]++; });
  await G.sheets('PUT', HOJA + '/values/' + encodeURIComponent("'Resumen'!A1") + '?valueInputOption=USER_ENTERED', { values: [
    ['Actualizado', new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })],
    ['Nivel', 'Leads', 'Qué significa'],
    ['A', cuenta.A, 'Encaja y se mueve: prioridad de Maikel, aviso al momento'],
    ['B', cuenta.B, 'Encaja pero no se mueve: el sistema insiste (cadencia, reenganche)'],
    ['C', cuenta.C, 'Se mueve pero el ticket es pequeño: se atiende sin dedicarle horas'],
    ['D', cuenta.D, 'Ni encaja ni se mueve, baja o no responde: se guarda'],
    ['Total', detalle.filter(function (r) { return r.nivel; }).length, '']
  ] });
  return { ok: true, filas: filas.length };
}

module.exports = { volcarHoja: volcarHoja, puntuar: puntuar, puntuarTodos: puntuarTodos, tipologia: tipologia, comportamiento: comportamiento, nivel: nivel, CAMPOS: CAMPOS };
