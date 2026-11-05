// Panel de negocio Qualivo (Intelligence): utilidades comunes del servidor.
// Nada de datos aquí: solo cómo se lee, se cachea y se fecha.

const ZONA = 'Europe/Madrid';

// Lectura GET con plazo. Devuelve JSON o lanza «HTTP nnn».
async function getJSON(url, cabeceras, plazoMs) {
  const ctl = new AbortController();
  const t = setTimeout(function () { ctl.abort(); }, plazoMs || 15000);
  try {
    const r = await fetch(url, { method: 'GET', headers: cabeceras || {}, signal: ctl.signal });
    if (!r.ok) {
      let det = '';
      try { det = (await r.text()).slice(0, 160); } catch (e) { /* nada */ }
      const err = new Error('HTTP ' + r.status + (det ? ' · ' + det : ''));
      err.status = r.status;
      throw err;
    }
    return await r.json();
  } finally { clearTimeout(t); }
}

// Caché en memoria de la instancia, por clave, con una sola lectura en curso por clave.
const _cache = {};
const _enCurso = {};
async function cacheado(clave, ms, fresco, fn) {
  const c = _cache[clave];
  if (!fresco && c && Date.now() - c.t < ms) return c.v;
  if (_enCurso[clave]) return _enCurso[clave];
  _enCurso[clave] = (async function () {
    try {
      const v = await fn();
      _cache[clave] = { t: Date.now(), v: v };
      return v;
    } finally { delete _enCurso[clave]; }
  })();
  return _enCurso[clave];
}
function borrarCache(prefijo) {
  Object.keys(_cache).forEach(function (k) { if (!prefijo || k.indexOf(prefijo) === 0) delete _cache[k]; });
}

// n tareas a la vez
async function enParalelo(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function obrero() {
    while (i < items.length) {
      const k = i++;
      try { out[k] = await fn(items[k], k); } catch (e) { out[k] = { _error: String(e.message || e).slice(0, 160) }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, obrero));
  return out;
}

// ---------- Fechas en hora de Madrid ----------
function diaMadrid(t) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t));
}
function sumarDias(iso, n) {
  const d = new Date(iso + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function lunesDe(iso) {
  const d = new Date(iso + 'T12:00:00Z');
  const dow = (d.getUTCDay() + 6) % 7; // 0 = lunes
  return sumarDias(iso, -dow);
}
function inicioMes(iso) { return iso.slice(0, 8) + '01'; }
function finMes(iso) {
  const d = new Date(iso.slice(0, 8) + '01T12:00:00Z');
  d.setUTCMonth(d.getUTCMonth() + 1);
  d.setUTCDate(0);
  return d.toISOString().slice(0, 10);
}
function mesAnterior(iso) {
  const d = new Date(iso.slice(0, 8) + '01T12:00:00Z');
  d.setUTCMonth(d.getUTCMonth() - 1);
  return d.toISOString().slice(0, 10);
}
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
function nombreMes(iso) { return MESES[Number(iso.slice(5, 7)) - 1]; }

// Periodo pedido por el panel → { desde, hasta, etiqueta } (fechas AAAA-MM-DD, ambas incluidas)
function periodo(q) {
  const hoy = diaMadrid(Date.now());
  const p = String((q && q.periodo) || 'mes');
  const valida = function (s) { return /^\d{4}-\d{2}-\d{2}$/.test(String(s || '')); };
  if (p === 'personalizado' && valida(q.desde) && valida(q.hasta) && q.desde <= q.hasta) {
    return { clave: p, desde: q.desde, hasta: q.hasta > hoy ? hoy : q.hasta, etiqueta: 'Del ' + q.desde + ' al ' + q.hasta };
  }
  if (p === '7d') return { clave: p, desde: sumarDias(hoy, -6), hasta: hoy, etiqueta: 'Últimos 7 días' };
  if (p === '30d') return { clave: p, desde: sumarDias(hoy, -29), hasta: hoy, etiqueta: 'Últimos 30 días' };
  if (p === 'mes_anterior') { const m = mesAnterior(hoy); return { clave: p, desde: m, hasta: finMes(m), etiqueta: 'Mes anterior (' + nombreMes(m) + ')' }; }
  if (p === 'hoy') return { clave: p, desde: hoy, hasta: hoy, etiqueta: 'Hoy' };
  return { clave: 'mes', desde: inicioMes(hoy), hasta: hoy, etiqueta: 'Este mes (' + nombreMes(hoy) + ')' };
}

function num(x) { const n = Number(x); return isFinite(n) ? n : 0; }
function normal(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }

module.exports = { ZONA, getJSON, cacheado, borrarCache, enParalelo, diaMadrid, sumarDias, lunesDe, inicioMes, finMes, mesAnterior, nombreMes, periodo, num, normal, MESES };
