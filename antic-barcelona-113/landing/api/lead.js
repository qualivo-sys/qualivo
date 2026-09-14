/**
 * Recepción de leads — Antic Barcelona 113
 *
 * Función serverless de Vercel. Recibe el formulario de la guía y del
 * cuestionario, valida, y reenvía a LEAD_WEBHOOK_URL (una app web de Apps
 * Script que escribe en la hoja de cálculo y manda la guía por email).
 *
 * Variables de entorno necesarias:
 *   LEAD_WEBHOOK_URL   URL /exec de la app web de Apps Script
 *   LEAD_SHARED_SECRET (opcional) se envía en el cuerpo para que el webhook
 *                      pueda rechazar peticiones que no vengan de aquí
 */

const LIMITE = new Map();          // control de abuso por IP, en memoria

function limitar(ip) {
  const ahora = Date.now();
  const ventana = 60_000, maximo = 8;
  const hits = (LIMITE.get(ip) || []).filter(t => ahora - t < ventana);
  hits.push(ahora);
  LIMITE.set(ip, hits);
  if (LIMITE.size > 5000) LIMITE.clear();   // techo de memoria
  return hits.length > maximo;
}

const texto = (v, max) => typeof v === 'string' ? v.trim().slice(0, max) : '';
const emailValido = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'metodo_no_permitido' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconocida';
  if (limitar(ip)) return res.status(429).json({ ok: false, error: 'demasiadas_peticiones' });

  const b = typeof req.body === 'string' ? safeJson(req.body) : (req.body || {});

  // Trampa para bots: campo oculto que una persona nunca rellena.
  if (texto(b.web, 50)) return res.status(200).json({ ok: true, stored: false, bot: true });

  const email = texto(b.email, 160).toLowerCase();
  const nombre = texto(b.nombre, 80);
  if (!nombre || nombre.length < 2) return res.status(400).json({ ok: false, error: 'nombre_requerido' });
  if (!emailValido(email)) return res.status(400).json({ ok: false, error: 'email_invalido' });
  if (b.consent !== true) return res.status(400).json({ ok: false, error: 'consentimiento_requerido' });

  const lead = {
    fecha: new Date().toISOString(),
    origen: texto(b.origen, 30) || 'desconocido',      // 'guia' | 'cuestionario'
    nombre, email,
    telefono: texto(b.telefono, 40),
    tier: texto(b.tier, 10),
    pieza: texto(b.pieza, 40),
    espacio: texto(b.espacio, 40),
    medidas: texto(b.medidas, 200),
    estilo: texto(b.estilo, 40),
    presupuesto: texto(String(b.presupuesto ?? ''), 20),
    plazo: texto(b.plazo, 40),
    referencias: texto(b.referencias, 500),
    utm_source: texto(b.utm_source, 60),
    utm_campaign: texto(b.utm_campaign, 120),
    utm_content: texto(b.utm_content, 120),
    utm_term: texto(b.utm_term, 120),
    fbclid: texto(b.fbclid, 255),
    ip, user_agent: texto(req.headers['user-agent'], 255),
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    // Sin webhook el lead se perdería. Se registra entero para poder
    // recuperarlo de los logs y se avisa al cliente de que no se guardó.
    console.error('[lead] LEAD_WEBHOOK_URL sin configurar. Lead NO guardado:', JSON.stringify(lead));
    return res.status(200).json({ ok: true, stored: false, motivo: 'webhook_sin_configurar' });
  }

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Apps Script no expone las cabeceras personalizadas al script, así que
      // el secreto viaja en el cuerpo.
      body: JSON.stringify(
        process.env.LEAD_SHARED_SECRET
          ? { ...lead, secret: process.env.LEAD_SHARED_SECRET }
          : lead
      ),
      signal: ctrl.signal,
    });
    clearTimeout(t);
    if (!r.ok) throw new Error(`webhook respondió ${r.status}`);
    return res.status(200).json({ ok: true, stored: true });
  } catch (e) {
    // El usuario ya ha hecho su parte: no se le penaliza con un error. Pero el
    // lead queda íntegro en los logs para no perderlo.
    console.error('[lead] fallo al reenviar:', e.message, JSON.stringify(lead));
    return res.status(200).json({ ok: true, stored: false, motivo: 'webhook_fallo' });
  }
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
