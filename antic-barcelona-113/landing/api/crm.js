/**
 * CRM — puerta de entrada de la app de Vercel a la hoja.
 *
 * Aquí no hay base de datos: los datos viven en la hoja de cálculo y esto
 * habla con ella. Si esta función falla, el cliente sigue teniendo sus leads
 * en su hoja. Una base de datos propia habría añadido un sitio más donde
 * perderlos.
 *
 * Variables de entorno:
 *   GOOGLE_SERVICE_ACCOUNT   JSON de la cuenta de servicio
 *   SHEET_ID                 id de la hoja
 *   CRM_PASSWORD             contraseña de acceso al CRM
 *   CRM_SESSION_SECRET       cadena larga para firmar la cookie de sesión
 */
import crypto from 'node:crypto';
import { listar, actualizar, ESTADOS } from '../lib/hoja.js';

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
    if (b.accion === 'listar') {
      return res.status(200).json({ ok: true, leads: await listar(), estados: ESTADOS });
    }
    const r = await actualizar(b.lead_id, b.campos || {});
    return res.status(r.ok ? 200 : 404).json(r);
  } catch (e) {
    console.error('[crm]', e.message);
    return res.status(502).json({ ok: false, error: 'hoja_no_responde', detalle: e.message });
  }
}

function seguro(s) { try { return JSON.parse(s); } catch { return {}; } }
