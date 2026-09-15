/**
 * Recepción de leads — Antic Barcelona 113
 *
 * Función serverless de Vercel. Recibe el formulario de la guía y del
 * cuestionario, valida, y escribe la fila en la hoja de cálculo.
 *
 * Escribe en la hoja directamente, no a través de Apps Script. Así la
 * captura de leads funciona sin que nadie tenga que desplegar nada: lo único
 * que se pierde mientras Apps Script no esté es el correo automático, y un
 * lead sin correo se recupera; un lead que nunca se guardó, no.
 *
 * Variables de entorno:
 *   GOOGLE_SERVICE_ACCOUNT  JSON de la cuenta de servicio  (obligatoria)
 *   SHEET_ID                id de la hoja                  (obligatoria)
 *   LEAD_WEBHOOK_URL        URL /exec de Apps Script       (opcional: correos)
 *   LEAD_SHARED_SECRET      secreto compartido con el script
 */
import { anadir } from '../lib/hoja.js';

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

  // 1. La hoja es el destino de verdad. Si esto falla, se ha perdido un lead.
  let guardado = false;
  try {
    lead.lead_id = await anadir(lead);
    guardado = true;
  } catch (e) {
    // El usuario ya ha hecho su parte: no se le penaliza con un error. Pero el
    // lead queda entero en los registros para poder recuperarlo a mano.
    console.error('[lead] no se pudo escribir en la hoja:', e.message, JSON.stringify(lead));
  }

  // 2. El aviso por correo. Lo manda n8n, y es opcional a propósito: si el
  //    webhook falla o no está puesto, el lead ya está guardado. Perder un
  //    aviso se arregla mirando el CRM; perder un lead, no.
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8000);
      const r = await fetch(webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // n8n autentica el webhook por cabecera. El mismo secreto va también
          // en el cuerpo por si algún día el destino vuelve a ser Apps Script,
          // que no puede leer cabeceras personalizadas.
          'x-ab113-secret': process.env.LEAD_SHARED_SECRET || '',
        },
        body: JSON.stringify({ ...lead, accion: 'avisar',
          secret: process.env.LEAD_SHARED_SECRET || '' }),
        signal: ctrl.signal,
      });
      clearTimeout(t);
      if (!r.ok) console.error('[lead] el aviso respondió', r.status);
    } catch (e) {
      console.error('[lead] el aviso por correo falló:', e.message);
    }
  }

  return res.status(200).json({ ok: true, stored: guardado });
}

function safeJson(s) { try { return JSON.parse(s); } catch { return {}; } }
