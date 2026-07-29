/**
 * POST /api/redsys/notificacion   (URL de notificacion server-to-server)
 *
 * Redsys llama a esta ruta tras cada operacion. Aqui:
 *   1. Verificamos la FIRMA (si es invalida, se descarta).
 *   2. Si el pago esta AUTORIZADO, damos de alta al alumno en ThriveCart.
 *
 * Es el corazon del sistema: garantiza que el acceso se concede SOLO tras un
 * pago real y verificado, de forma automatica y sin intervencion manual.
 */
import { NextResponse } from 'next/server';
import {
  processRestNotification,
  unpackMerchantData,
  isPaymentAuthorized,
} from '@/lib/redsys';
import { enrollStudent } from '@/lib/thrivecart';
import { assertThriveCartConfigured } from '@/lib/config';
import { sendSaleNotification, formatEuro } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Redsys envia application/x-www-form-urlencoded (a veces JSON).
  let bodyObj: Record<string, string> = {};
  try {
    const ct = req.headers.get('content-type') ?? '';
    if (ct.includes('application/json')) {
      bodyObj = (await req.json()) as Record<string, string>;
    } else {
      const form = await req.formData();
      for (const [k, v] of form.entries()) bodyObj[k] = String(v);
    }
  } catch (err) {
    console.error('[notif] No se pudo leer el cuerpo:', err);
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Verificacion de firma. Si falla, processRestNotification lanza.
  let params;
  try {
    params = processRestNotification({
      Ds_SignatureVersion: bodyObj.Ds_SignatureVersion as 'HMAC_SHA256_V1',
      Ds_MerchantParameters: bodyObj.Ds_MerchantParameters,
      Ds_Signature: bodyObj.Ds_Signature,
    });
  } catch (err) {
    console.error('[notif] Firma invalida o notificacion corrupta:', err);
    return new NextResponse('Forbidden', { status: 403 });
  }

  const order = params.Ds_Order;
  const response = params.Ds_Response;

  if (!isPaymentAuthorized(response)) {
    console.log(`[notif] Pago NO autorizado order=${order} Ds_Response=${response}. Sin alta.`);
    return new NextResponse('OK', { status: 200 });
  }

  // Pago autorizado → alta en ThriveCart.
  const buyer = unpackMerchantData(params.Ds_MerchantData);
  if (!buyer) {
    console.error(`[notif] Pago autorizado order=${order} pero sin email en MerchantData. Alta MANUAL requerida.`);
    return new NextResponse('OK', { status: 200 });
  }

  const tcError = assertThriveCartConfigured();
  if (tcError) {
    console.error(`[notif] Pago OK order=${order} email=${buyer.email} pero ThriveCart no configurado: ${tcError}. Alta MANUAL requerida.`);
    return new NextResponse('OK', { status: 200 });
  }

  const amountEuro = formatEuro(params.Ds_Amount);

  try {
    const result = await enrollStudent({ email: buyer.email, name: buyer.name });
    const enrolled = result.ok;
    if (enrolled) {
      console.log(`[notif] ✅ Alta en ThriveCart OK order=${order} email=${buyer.email}`);
    } else {
      console.error(`[notif] ⚠️ Fallo alta ThriveCart order=${order} email=${buyer.email} status=${result.status} body=${result.body}`);
    }
    // Aviso de venta por email (best-effort: no afecta a la respuesta ni al alta).
    await sendSaleNotification({ order, buyer, amountEuro, enrolled });
    // Si el alta fallo, devolvemos 500 para que Redsys reintente (alta idempotente).
    return new NextResponse(enrolled ? 'OK' : 'Enrollment failed', { status: enrolled ? 200 : 500 });
  } catch (err) {
    console.error(`[notif] ⚠️ Excepcion en alta ThriveCart order=${order} email=${buyer.email}:`, err);
    await sendSaleNotification({ order, buyer, amountEuro, enrolled: false });
    return new NextResponse('Enrollment error', { status: 500 });
  }
}

// Algunos setups de Redsys hacen un GET de verificacion; respondemos 200.
export async function GET() {
  return new NextResponse('OK', { status: 200 });
}
