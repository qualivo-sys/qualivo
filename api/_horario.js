// Horarios del sistema comercial (decisión de Maikel del 1-oct-2026, Bloque 1).
// Todo en hora de Madrid (Europe/Madrid), con el cambio de hora resuelto por
// Intl: nunca se suma un desfase fijo.
//
//   WhatsApp ............ todos los días, de 8:00 a 21:30. Fuera, no se envía:
//                         se programa para las 8:00 (motivo quiet_hours).
//   Supervisión Maikel .. de lunes a viernes laborables, de 9:00 a 19:00. Solo
//                         ahí el primer WhatsApp de un A/B espera 10 minutos
//                         por si él interviene. Fuera, sale solo.
//   Raquel (voz) ........ de lunes a viernes laborables, de 9:30 a 14:00 y de
//                         16:00 a 19:30. Ni sábados, ni domingos, ni festivos
//                         nacionales: la llamada se programa para la siguiente
//                         ventana válida.
//   Festivos ............ nacionales de España. WhatsApp sí; voz no; la
//                         supervisión de Maikel no cuenta como laborable.

const ZONA = 'Europe/Madrid';

// Festivos nacionales (los que fija el Estado para todo el país; los
// autonómicos y locales no cuentan). Cuando uno cae en domingo no se traslada.
const FESTIVOS = new Set([
  // 2026
  '2026-01-01', '2026-01-06', '2026-04-03', '2026-05-01', '2026-08-15',
  '2026-10-12', '2026-11-01', '2026-12-06', '2026-12-08', '2026-12-25',
  // 2027
  '2027-01-01', '2027-01-06', '2027-03-26', '2027-05-01', '2027-08-15',
  '2027-10-12', '2027-11-01', '2027-12-06', '2027-12-08', '2027-12-25',
  // 2028
  '2028-01-01', '2028-01-06', '2028-04-14', '2028-05-01', '2028-08-15',
  '2028-10-12', '2028-11-01', '2028-12-06', '2028-12-08', '2028-12-25'
]);

const WA_DESDE = 8 * 60;              // 08:00
const WA_HASTA = 21 * 60 + 30;        // 21:30 (a las 21:30 ya no sale)
const SUP_DESDE = 9 * 60;             // 09:00
const SUP_HASTA = 19 * 60;            // 19:00
const VOZ_TRAMOS = [[9 * 60 + 30, 14 * 60], [16 * 60, 19 * 60 + 30]];

// Fecha y hora de Madrid de un instante (ms). dia: 0 domingo … 6 sábado.
function madrid(ms) {
  const d = new Date(ms == null ? Date.now() : ms);
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short'
  }).formatToParts(d).reduce(function (a, x) { a[x.type] = x.value; return a; }, {});
  const dias = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const hora = parseInt(p.hour, 10), minuto = parseInt(p.minute, 10);
  return {
    fecha: p.year + '-' + p.month + '-' + p.day,
    anio: +p.year, mes: +p.month, diaMes: +p.day,
    dia: dias[p.weekday], hora: hora, minuto: minuto, minutos: hora * 60 + minuto
  };
}

// Instante (ms) de una hora local de Madrid. Correcto también los días del
// cambio de hora: se corrige el desfase dos veces.
function msDeMadrid(fecha, minutos) {
  const [y, m, d] = String(fecha).split('-').map(Number);
  const bruto = Date.UTC(y, m - 1, d, Math.floor(minutos / 60), minutos % 60);
  let ms = bruto;
  for (let i = 0; i < 2; i++) {
    const t = madrid(ms);
    const comoUTC = Date.UTC(t.anio, t.mes - 1, t.diaMes, t.hora, t.minuto);
    ms = ms - (comoUTC - bruto);
  }
  return ms;
}

function sumarDias(fecha, n) {
  const [y, m, d] = String(fecha).split('-').map(Number);
  const x = new Date(Date.UTC(y, m - 1, d + n));
  return x.toISOString().slice(0, 10);
}

function esFestivo(ms) { return FESTIVOS.has(madrid(ms).fecha); }
function esLaborable(ms) { const t = madrid(ms); return t.dia >= 1 && t.dia <= 5 && !FESTIVOS.has(t.fecha); }

function ventanaWhatsApp(ms) { const t = madrid(ms); return t.minutos >= WA_DESDE && t.minutos < WA_HASTA; }
function supervision(ms) { const t = madrid(ms); return esLaborable(ms) && t.minutos >= SUP_DESDE && t.minutos < SUP_HASTA; }
function ventanaVoz(ms) {
  if (!esLaborable(ms)) return false;
  const t = madrid(ms);
  return VOZ_TRAMOS.some(function (r) { return t.minutos >= r[0] && t.minutos < r[1]; });
}

// Próximo instante en que se puede mandar WhatsApp (el propio si ya se puede).
function siguienteWhatsApp(ms) {
  ms = ms == null ? Date.now() : ms;
  if (ventanaWhatsApp(ms)) return ms;
  const t = madrid(ms);
  const fecha = t.minutos < WA_DESDE ? t.fecha : sumarDias(t.fecha, 1);
  return msDeMadrid(fecha, WA_DESDE);
}

// Próximo inicio de un tramo válido según la función (voz o supervisión), con
// el propio instante si ya vale. Mira hasta 15 días adelante.
function siguienteTramo(ms, tramos, laborableObligatorio) {
  ms = ms == null ? Date.now() : ms;
  const t0 = madrid(ms);
  for (let k = 0; k < 15; k++) {
    const fecha = sumarDias(t0.fecha, k);
    const medio = msDeMadrid(fecha, 12 * 60);
    if (laborableObligatorio && !esLaborable(medio)) continue;
    for (const r of tramos) {
      const ini = msDeMadrid(fecha, r[0]), fin = msDeMadrid(fecha, r[1]);
      if (ms < fin) return Math.max(ms, ini);
    }
  }
  return null;
}
function siguienteVoz(ms) { return siguienteTramo(ms, VOZ_TRAMOS, true); }
function siguienteSupervision(ms) { return siguienteTramo(ms, [[SUP_DESDE, SUP_HASTA]], true); }

// Contexto del primer WhatsApp, que decide el arranque del mensaje:
//   'supervision' · en horario de Maikel («He visto que en el formulario marcaste…»)
//   'fuera'       · en hora de WhatsApp pero fuera de su horario («acabas de dejarnos tus datos»)
//   'noche'       · entró con el WhatsApp cerrado y sale ahora por la mañana («Anoche nos dejaste…»)
//   'cerrado'     · ahora no se puede escribir
// entroMs: cuándo entró el lead (opcional).
function contextoWa1(ahoraMs, entroMs) {
  ahoraMs = ahoraMs == null ? Date.now() : ahoraMs;
  if (!ventanaWhatsApp(ahoraMs)) return { ctx: 'cerrado' };
  if (entroMs && !ventanaWhatsApp(entroMs) && ahoraMs - entroMs < 14 * 3600 * 1000) {
    const e = madrid(entroMs), a = madrid(ahoraMs);
    // Entró hoy de madrugada a partir de las 5:00: «esta mañana». Si no, «anoche».
    const cuando = e.fecha === a.fecha && e.minutos >= 5 * 60 ? 'esta mañana' : 'anoche';
    return { ctx: 'noche', cuando: cuando };
  }
  return { ctx: supervision(ahoraMs) ? 'supervision' : 'fuera' };
}

// Sello AAAAMMDDHHMM en UTC para las etiquetas de tiempo (act-…-h-<sello>).
function sello(ms) { return new Date(ms == null ? Date.now() : ms).toISOString().replace(/[-:T]/g, '').slice(0, 12); }
function msDeSello(s) {
  const x = String(s).slice(-12);
  return Date.parse(x.slice(0, 4) + '-' + x.slice(4, 6) + '-' + x.slice(6, 8) + 'T' + x.slice(8, 10) + ':' + x.slice(10, 12) + ':00Z');
}
function horaTexto(ms) {
  return new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
}
function cuandoTexto(ms) {
  return new Intl.DateTimeFormat('es-ES', { timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(ms));
}

module.exports = {
  ZONA, FESTIVOS, madrid, msDeMadrid, esFestivo, esLaborable,
  ventanaWhatsApp, supervision, ventanaVoz,
  siguienteWhatsApp, siguienteVoz, siguienteSupervision, contextoWa1,
  sello, msDeSello, horaTexto, cuandoTexto
};
