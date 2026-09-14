/**
 * CRM — puerta de entrada de la app de Vercel a la hoja.
 *
 * Aquí no hay base de datos: los datos siguen viviendo en la hoja de cálculo
 * y esto es un proxy con sesión. La razón es que si esta función falla, el
 * cliente sigue teniendo sus leads, sus avisos por correo y su hoja. Una base
 * de datos propia habría añadido un sitio más donde perderlos.
 *
 * Variables de entorno:
 *   LEAD_WEBHOOK_URL     la URL /exec de Apps Script
 *   LEAD_SHARED_SECRET   el mismo SECRETO del script
 *   CRM_PASSWORD         contraseña de acceso al CRM
 *   CRM_SESSION_SECRET   cadena larga para firmar la cookie de sesión
 */
import crypto from 'node:crypto';

const DIAS = 30;
const COOKIE = 'ab113_crm';

// ── Sesión ──────────────────────────────────────────────────────────────────

function firmar(caduca) {
  const secreto = process.env.CRM_SESSION_SECRET || process.env.CRM_PASSWORD || '';
  return crypto.createHmac('sha256', secreto).update(String(caduca)).digest('hex');
}

function emitirCookie(res) {
  const caduca = Date.now() + DIAS * 864e5;
  const valor = `${caduca}.${firmar(caduca)}`;
  res.setHeader('Set-Cookie',
    `${COOKIE}=${valor}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DIAS * 86400}`);
}

function sesionValida(req) {
  const bruto = (req.headers.cookie || '')
    .split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  if (!bruto) return false;
  const [caduca, firma] = bruto.slice(COOKIE.length + 1).split('.');
  if (!caduca || !firma || Number(caduca) < Date.now()) return false;
  const esperada = firmar(caduca);
  // Comparación en tiempo constante: con === se puede adivinar la firma byte
  // a byte midiendo cuánto tarda en responder.
  return firma.length === esperada.length &&
    crypto.timingSafeEqual(Buffer.from(firma), Buffer.from(esperada));
}

// ── Freno a la fuerza bruta sobre la contraseña ─────────────────────────────

const intentos = new Map();
function demasiadosIntentos(ip) {
  const ahora = Date.now();
  const previos = (intentos.get(ip) || []).filter((t) => ahora - t < 15 * 60e3);
  intentos.set(ip, previos);
  if (intentos.size > 500) intentos.clear();
  return previos.length >= 8;
}
function anotarIntento(ip) {
  intentos.set(ip, [...(intentos.get(ip) || []), Date.now()]);
}

// ── Hoja ────────────────────────────────────────────────────────────────────

async function hoja(carga) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) throw new Error('LEAD_WEBHOOK_URL sin configurar');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...carga, secret: process.env.LEAD_SHARED_SECRET || '' }),
      signal: ctrl.signal,
      redirect: 'follow',   // Apps Script responde con un 302 a googleusercontent
    });
    const texto = await r.text();
    try { return JSON.parse(texto); }
    catch { throw new Error(`la hoja respondió algo que no es JSON (${r.status})`); }
  } finally { clearTimeout(t); }
}

// ── Rutas ───────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'metodo' });

  const b = typeof req.body === 'string' ? seguro(req.body) : (req.body || {});
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'sin-ip';

  if (b.accion === 'entrar') {
    if (!process.env.CRM_PASSWORD) {
      return res.status(500).json({ ok: false, error: 'sin_configurar' });
    }
    if (demasiadosIntentos(ip)) {
      return res.status(429).json({ ok: false, error: 'demasiados_intentos' });
    }
    const dada = Buffer.from(String(b.password || ''));
    const real = Buffer.from(process.env.CRM_PASSWORD);
    const correcta = dada.length === real.length && crypto.timingSafeEqual(dada, real);
    if (!correcta) { anotarIntento(ip); return res.status(401).json({ ok: false, error: 'password' }); }
    emitirCookie(res);
    return res.status(200).json({ ok: true });
  }

  if (b.accion === 'salir') {
    res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
    return res.status(200).json({ ok: true });
  }

  if (!sesionValida(req)) return res.status(401).json({ ok: false, error: 'sin_sesion' });

  if (b.accion !== 'listar' && b.accion !== 'actualizar') {
    return res.status(400).json({ ok: false, error: 'accion' });
  }

  try {
    const r = await hoja(b.accion === 'listar'
      ? { accion: 'listar' }
      : { accion: 'actualizar', lead_id: b.lead_id, campos: b.campos || {} });
    return res.status(200).json(r);
  } catch (e) {
    console.error('[crm]', e.message);
    return res.status(502).json({ ok: false, error: 'hoja_no_responde', detalle: e.message });
  }
}

function seguro(s) { try { return JSON.parse(s); } catch { return {}; } }
