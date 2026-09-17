/**
 * Seguimiento de los leads que se quedaron en la guía.
 *
 * De los cinco primeros leads, cuatro se descargaron la guía y solo uno pasó
 * al cuestionario, y lo hizo solo. Ese salto es el mayor agujero del embudo:
 * un lead de guía no tiene medidas, ni plazo, ni presupuesto, así que el
 * comercial no sabe ni por dónde empezar.
 *
 * Esto lo llama n8n una vez al día. Busca a quien descargó la guía, sigue en
 * «Nuevo» —nadie del taller ha hablado con él— y lleva esperando lo
 * suficiente, y le manda un recordatorio.
 *
 * Dos toques y se para. A partir del tercero ya no es seguimiento, es
 * insistir, y quema la dirección para cuando de verdad tenga un proyecto.
 */
import crypto from 'node:crypto';
import { listar, marcar } from '../lib/hoja.js';

const TOQUES = [
  { n: 1, dias: 1 },
  { n: 2, dias: 7 },
];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const dado = req.headers['x-ab113-secret'] || '';
  const real = process.env.LEAD_SHARED_SECRET || '';
  const ok = real && dado.length === real.length &&
    crypto.timingSafeEqual(Buffer.from(String(dado)), Buffer.from(real));
  if (!ok) return res.status(401).json({ ok: false, error: 'sin_autorizacion' });

  const seco = req.query?.simulacro === '1';

  let leads;
  try { leads = await listar({ todo: true }); }
  catch (e) { return res.status(502).json({ ok: false, error: 'hoja_no_responde', detalle: e.message }); }

  // Quien ya rellenó el cuestionario no necesita que le recuerden nada,
  // aunque antes se hubiera descargado la guía.
  const cualificados = new Set(leads
    .filter((l) => l.origen === 'cuestionario' && l.email)
    .map((l) => String(l.email).toLowerCase()));

  const ahora = Date.now();
  const pendientes = [];

  for (const l of leads) {
    if (l.origen !== 'guia' || !l.email) continue;
    if (cualificados.has(String(l.email).toLowerCase())) continue;
    // Solo los que nadie ha tocado. En cuanto el comercial habla con alguien,
    // el seguimiento automático sobra y además estorba: mandarle «¿qué medidas
    // tiene el hueco?» a quien ya le has preguntado por WhatsApp le deja en
    // ridículo delante de su propio cliente.
    if ((l.estado || 'Nuevo') !== 'Nuevo') continue;

    const enviados = String(l.seguimiento || '');
    const dias = (ahora - new Date(l.fecha).getTime()) / 864e5;
    // Del último toque que toque hacia atrás: si lleva ocho días sin volver,
    // se le manda el segundo y no el primero.
    const toque = [...TOQUES].reverse()
      .find((t) => dias >= t.dias && !enviados.includes(`#${t.n}`));
    if (toque) pendientes.push({ lead: l, toque: toque.n });
  }

  if (seco) {
    return res.status(200).json({ ok: true, simulacro: true, total: pendientes.length,
      pendientes: pendientes.map((p) => ({ nombre: p.lead.nombre, email: p.lead.email, toque: p.toque })) });
  }

  const hechos = [];
  for (const { lead, toque } of pendientes) {
    try {
      const r = await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-ab113-secret': real },
        body: JSON.stringify({ ...lead, seguimiento: toque }),
      });
      if (!r.ok) throw new Error('el webhook respondió ' + r.status);
      // Se marca después de enviar: si falla el envío, mañana se reintenta.
      // Marcarlo antes convertiría un fallo puntual en un lead nunca seguido.
      await marcar(lead.lead_id, 'seguimiento',
        [String(lead.seguimiento || ''), `#${toque} ${new Date().toISOString().slice(0, 10)}`]
          .filter(Boolean).join(' '));
      hechos.push({ nombre: lead.nombre, email: lead.email, toque });
    } catch (e) {
      console.error('[seguimiento]', lead.email, e.message);
    }
  }

  return res.status(200).json({ ok: true, enviados: hechos.length, detalle: hechos });
}
