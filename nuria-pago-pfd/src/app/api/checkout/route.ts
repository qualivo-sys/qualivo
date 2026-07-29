/**
 * POST /api/checkout
 *
 * Recibe los datos del formulario, genera la operacion de Redsys firmada y
 * devuelve al navegador la URL de la pasarela + los campos firmados para que el
 * cliente los reenvie (auto-submit) a Redsys.
 */
import { NextResponse } from 'next/server';
import { config, assertRedsysConfigured } from '@/lib/config';
import { createRedirectForm, newOrderId, packMerchantData } from '@/lib/redsys';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function clean(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

export async function POST(req: Request) {
  const configError = assertRedsysConfigured();
  if (configError) {
    console.error('[checkout] Configuracion incompleta:', configError);
    return NextResponse.json({ error: 'El pago no esta configurado. Contacta con el comercio.' }, { status: 503 });
  }

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: 'Peticion invalida.' }, { status: 400 });
  }

  const name = clean(data.name);
  const surname = clean(data.surname);
  const email = clean(data.email);
  const phone = clean(data.phone);
  const country = clean(data.country);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Introduce un email valido.' }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: 'Introduce tu nombre.' }, { status: 400 });
  }

  const order = newOrderId();
  const titular = `${name} ${surname}`.trim().slice(0, 60);

  const params = {
    DS_MERCHANT_MERCHANTCODE: config.redsys.merchantCode,
    DS_MERCHANT_TERMINAL: config.redsys.terminal,
    DS_MERCHANT_ORDER: order,
    DS_MERCHANT_AMOUNT: config.redsys.amountCents,
    DS_MERCHANT_CURRENCY: config.redsys.currency,
    DS_MERCHANT_TRANSACTIONTYPE: '0', // 0 = autorizacion
    DS_MERCHANT_MERCHANTNAME: config.redsys.merchantName,
    DS_MERCHANT_PRODUCTDESCRIPTION: config.redsys.productDescription,
    DS_MERCHANT_TITULAR: titular,
    DS_MERCHANT_CONSUMERLANGUAGE: '1', // 1 = espanol
    DS_MERCHANT_MERCHANTURL: `${config.baseUrl}/api/redsys/notificacion`,
    DS_MERCHANT_URLOK: `${config.baseUrl}/pago/ok?order=${order}`,
    DS_MERCHANT_URLKO: `${config.baseUrl}/pago/ko?order=${order}`,
    DS_MERCHANT_MERCHANTDATA: packMerchantData({ email, name, surname, phone, country }),
  };

  try {
    // Cast controlado: construimos los parametros como strings segun la spec de
    // Redsys; redsys-easy los valida internamente al firmar.
    const form = createRedirectForm(params as unknown as Parameters<typeof createRedirectForm>[0]);
    console.log(`[checkout] Operacion creada order=${order} email=${email} phone=${phone || 'n/a'}`);
    return NextResponse.json({
      url: form.url,
      fields: form.body, // { Ds_SignatureVersion, Ds_MerchantParameters, Ds_Signature }
    });
  } catch (err) {
    console.error('[checkout] Error firmando la operacion:', err);
    return NextResponse.json({ error: 'No se pudo iniciar el pago. Intentalo de nuevo.' }, { status: 500 });
  }
}
