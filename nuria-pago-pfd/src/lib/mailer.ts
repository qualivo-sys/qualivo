/**
 * Aviso por email de cada venta, via Resend (https://resend.com).
 *
 * Se envia desde el webhook SOLO cuando el pago esta confirmado. Es "best-effort":
 * si falla el envio o falta la configuracion, se registra en logs pero NUNCA
 * rompe el alta en ThriveCart ni la respuesta a Redsys.
 *
 * Variables:
 *   RESEND_API_KEY     Token de Resend (obligatorio para enviar). Si falta, no envia.
 *   SALE_NOTIFY_TO     Destinatarios separados por coma. Por defecto hola@nuriaroure.com,maikel@qualivo.io
 *   SALE_NOTIFY_FROM   Remitente. Por defecto onboarding@resend.dev (para producir a
 *                      hola@ y maikel@ hay que verificar el dominio en Resend y usar
 *                      p.ej. "Ventas PFD <ventas@nuriaroure.com>").
 */
import type { BuyerData } from './redsys';

export interface SaleInfo {
  order: string;
  buyer: BuyerData;
  amountEuro: string; // ej. "2.200,00 €"
  enrolled: boolean;  // si el alta en ThriveCart salio bien
}

export async function sendSaleNotification(sale: SaleInfo): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[mail] RESEND_API_KEY no configurada; no se envia aviso de venta.');
    return;
  }

  const to = (process.env.SALE_NOTIFY_TO ?? 'hola@nuriaroure.com,maikel@qualivo.io')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.SALE_NOTIFY_FROM ?? 'Checkout PFD <onboarding@resend.dev>';

  const b = sale.buyer;
  const nombre = `${b.name} ${b.surname}`.trim() || '(sin nombre)';
  const estadoAcceso = sale.enrolled
    ? '✅ Acceso a ThriveCart concedido automaticamente.'
    : '⚠️ El alta en ThriveCart fallo — revisar y dar acceso manual.';

  const subject = `🛎️ Nueva venta PFD — ${nombre}`;
  const html = `
    <div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:520px;margin:auto;color:#1a2233">
      <h2 style="margin:0 0 12px">🛎️ Nueva venta · Por Fin Duermo</h2>
      <table style="width:100%;border-collapse:collapse;font-size:15px">
        <tr><td style="padding:6px 0;color:#5b6577">Nombre</td><td style="padding:6px 0"><strong>${nombre}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#5b6577">Email</td><td style="padding:6px 0">${b.email}</td></tr>
        <tr><td style="padding:6px 0;color:#5b6577">Telefono</td><td style="padding:6px 0">${b.phone || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#5b6577">Pais</td><td style="padding:6px 0">${b.country || '—'}</td></tr>
        <tr><td style="padding:6px 0;color:#5b6577">Importe</td><td style="padding:6px 0"><strong>${sale.amountEuro}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#5b6577">Nº pedido</td><td style="padding:6px 0">${sale.order}</td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:14px">${estadoAcceso}</p>
    </div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (res.ok) {
      console.log(`[mail] Aviso de venta enviado order=${sale.order} a=${to.join(',')}`);
    } else {
      console.error(`[mail] Fallo enviando aviso order=${sale.order} status=${res.status} body=${await res.text()}`);
    }
  } catch (err) {
    console.error(`[mail] Excepcion enviando aviso order=${sale.order}:`, err);
  }
}

/** Formatea centimos a euros con formato es-ES. Ej. "220000" -> "2.200,00 €" */
export function formatEuro(cents: string): string {
  const n = parseInt(cents, 10);
  if (!Number.isFinite(n)) return `${cents} €`;
  return (n / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
