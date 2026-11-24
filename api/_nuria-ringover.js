// Intelligence de Nuria · llamadas de Ringover por embudo y por comercial.
// Lee las llamadas de Ringover del periodo, cruza cada número con su ficha de Kliking para saber de
// qué embudo viene y suma: llamadas, personas, contestadas, conversaciones de más de 2 minutos,
// minutos hablados; y, de las personas llamadas, cuántas tienen cita y cuántas compran.
// Solo lectura; la respuesta solo lleva recuentos (ningún teléfono ni nombre de lead).

const N = require('./_nuria-semana.js');
const RO = 'https://public-api.ringover.com/v2';
const LOC = function () { return process.env.NURIA_GHL_LOCATION_ID; };
function clave() { return process.env.NURIA_RINGOVER_API_KEY || process.env.RINGOVER_API_KEY; }

async function llamadasRingover(desde, hasta) {
  const out = [];
  let a = desde;
  while (a <= hasta) {
    let b = N.sumaDias(a, 13); if (b > hasta) b = hasta;
    for (let off = 0; off < 20000; off += 1000) {
      const q = 'limit_count=1000&limit_offset=' + off + '&start_date=' + a + 'T00:00:00.000Z&end_date=' + b + 'T23:59:59.000Z';
      const r = await fetch(RO + '/calls?' + q, { headers: { Authorization: clave() } });
      if (r.status === 204) break;
      if (!r.ok) throw new Error('Ringover ' + r.status);
      const d = await r.json();
      const L = d.call_list || [];
      out.push.apply(out, L);
      if (L.length < 1000) break;
    }
    a = N.sumaDias(b, 1);
  }
  const vistos = new Set();
  return out.filter(function (c) { if (vistos.has(c.cdr_id)) return false; vistos.add(c.cdr_id); return true; });
}

// Embudo de una ficha de Kliking: El Círculo si tiene registro de alguna edición; si no, por su origen.
function embudoDe(c) {
  const tags = (c.tags || []).join('|').toLowerCase(), src = String(c.source || '').toLowerCase();
  if (/\[registro (ads|org)\]|registro-evergreen|c[íi]rculo/.test(tags) || /c[íi]rculo|taller|lanzamiento/.test(src)) return 'El Círculo';
  if (/vsl/.test(src) || /registrado_vsl|\[agenda sesion vsl\]/.test(tags)) return 'VSL';
  if (/quiz|test/.test(src) || /test patrones|test calidad|test mi noche/.test(tags)) return 'Test';
  if (/instagram|setter/.test(src) || /instagram/.test(tags)) return 'Instagram';
  if (/meditaci/.test(src)) return 'Meditación';
  return 'Base de contactos';
}

async function fichas(numeros) {
  const mapa = {}, lista = Array.from(numeros);
  const lotes = [];
  for (let i = 0; i < lista.length; i += 50) lotes.push(lista.slice(i, i + 50));
  await N.enParalelo(lotes, 3, async function (lote) {
    const r = await N.ghl('/contacts/search', { cuerpo: { locationId: LOC(), pageLimit: 100, filters: [{ group: 'OR', filters: lote.map(function (n) { return { field: 'phone', operator: 'eq', value: '+' + n }; }) }] } });
    (r.contacts || []).forEach(function (c) { const n = String(c.phone || '').replace(/\D/g, ''); if (n) mapa[n] = { id: c.id, email: c.email ? String(c.email).toLowerCase() : null, embudo: embudoDe(c) }; });
  });
  return mapa;
}

async function citasDe(ids, desde, hasta) {
  const cals = ((await N.ghl('/calendars/?locationId=' + LOC(), {})).calendars || []);
  const a = Date.parse(desde + 'T00:00:00+01:00'), b = Date.parse(hasta + 'T23:59:59+01:00');
  const res = {};
  await N.enParalelo(cals, 3, async function (c) {
    const ev = (await N.ghl('/calendars/events?locationId=' + LOC() + '&calendarId=' + c.id + '&startTime=' + a + '&endTime=' + b, {})).events || [];
    ev.forEach(function (e) {
      if (!ids.has(e.contactId) || e.appointmentStatus === 'invalid') return;
      const r = res[e.contactId] = res[e.contactId] || { cita: false, hecha: false };
      r.cita = true; if (e.appointmentStatus === 'showed') r.hecha = true;
    });
  });
  return res;
}

function nuevo() { return { llamadas: 0, personas: new Set(), contestadas: 0, conversaciones: 0, segundos: 0, entrantes: 0, perdidas: 0 }; }

async function llamadas(desde, hasta) {
  if (!clave()) throw new Error('Falta la clave de Ringover');
  const hoy = N.diaMadrid(new Date());
  const L = await llamadasRingover(desde, hasta);
  const numeros = new Set(L.map(function (c) { return String(c.contact_number || '').replace(/\D/g, ''); }).filter(function (n) { return n.length >= 9; }));
  const mapa = await fichas(numeros);
  const ids = new Set(Object.keys(mapa).map(function (n) { return mapa[n].id; }));
  const hastaCitas = N.sumaDias(hasta, 14) < hoy ? N.sumaDias(hasta, 14) : hoy;
  const [citas, ventas] = await Promise.all([
    citasDe(ids, desde, hastaCitas).catch(function () { return null; }),
    N.ventasHoja(desde).catch(function () { return null; })
  ]);
  const compradores = new Set((ventas || []).filter(function (v) { return v.email && v.dia >= desde; }).map(function (v) { return v.email; }));
  const porEmb = {}, porCom = {};
  L.forEach(function (c) {
    const n = String(c.contact_number || '').replace(/\D/g, '');
    const f = mapa[n];
    const emb = f ? f.embudo : 'No está en Kliking';
    const com = c.user ? ((c.user.firstname || '') + ' ' + String(c.user.lastname || '').split(' ')[0]).trim() : 'Sin comercial';
    [[porEmb, emb], [porCom, com]].forEach(function (x) {
      const t = x[0][x[1]] = x[0][x[1]] || nuevo();
      if (c.direction === 'in') { t.entrantes++; if (!c.is_answered) t.perdidas++; return; }
      t.llamadas++; t.personas.add(n);
      if (c.is_answered) { t.contestadas++; t.segundos += c.incall_duration || 0; if ((c.incall_duration || 0) >= 120) t.conversaciones++; }
    });
  });
  const cerrar = function (o) {
    return Object.keys(o).map(function (k) {
      const t = o[k], pers = Array.from(t.personas);
      const fs = pers.map(function (n) { return mapa[n]; }).filter(Boolean);
      return {
        nombre: k, llamadas: t.llamadas, personas: pers.length, contestadas: t.contestadas, conversaciones: t.conversaciones,
        minutos: Math.round(t.segundos / 60), mediaSegundos: t.contestadas ? Math.round(t.segundos / t.contestadas) : 0,
        entrantes: t.entrantes, perdidas: t.perdidas,
        conCita: citas ? fs.filter(function (f) { return citas[f.id] && citas[f.id].cita; }).length : null,
        citaHecha: citas ? fs.filter(function (f) { return citas[f.id] && citas[f.id].hecha; }).length : null,
        compran: ventas ? fs.filter(function (f) { return f.email && compradores.has(f.email); }).length : null
      };
    }).sort(function (a, b) { return b.llamadas - a.llamadas; });
  };
  return { generado: Date.now(), desde: desde, hasta: hasta, total: L.length, encontradas: Object.keys(mapa).length, numeros: numeros.size, embudos: cerrar(porEmb), comerciales: cerrar(porCom) };
}

module.exports = { llamadas: llamadas };
