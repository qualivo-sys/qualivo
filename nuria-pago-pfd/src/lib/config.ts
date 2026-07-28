/**
 * Configuracion central del checkout.
 *
 * TODOS los valores se leen de variables de entorno (Vercel → Settings →
 * Environment Variables). Nada sensible se escribe en el codigo.
 *
 * Variables OBLIGATORIAS en produccion:
 *   REDSYS_SECRET_KEY        Clave SHA-256 de PRODUCCION (panel canales.redsys.es)
 *   REDSYS_MERCHANT_CODE     FUC / numero de comercio (ej. 369473541)
 *   THRIVECART_API_TOKEN     API token de ThriveCart (Settings → API & Webhooks)
 *   THRIVECART_COURSE_ID     ID del curso "Por fin duermo" en ThriveCart Learn
 *   PUBLIC_BASE_URL          URL publica del sitio (ej. https://pago.nuriaroure.com)
 */

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === '') {
    // No lanzamos en build; lo detectamos en tiempo de request para dar un
    // error claro en los logs de Vercel.
    return '';
  }
  return value;
}

export const config = {
  // ---- Redsys ----
  redsys: {
    // 'production' usa sis.redsys.es ; 'sandbox' usa sis-t.redsys.es
    env: (process.env.REDSYS_ENV ?? 'production') as 'production' | 'sandbox',
    secretKey: required('REDSYS_SECRET_KEY'),
    merchantCode: required('REDSYS_MERCHANT_CODE', '369473541'),
    terminal: required('REDSYS_TERMINAL', '1'),
    currency: required('REDSYS_CURRENCY', '978'), // 978 = EUR
    merchantName: required('REDSYS_MERCHANT_NAME', 'Nuria Roure'),
    // Importe en la unidad minima (centimos). 220000 = 2.200,00 €
    amountCents: required('AMOUNT_CENTS', '220000'),
    productDescription: required('PRODUCT_DESCRIPTION', 'Programa Por Fin Duermo (PFD)'),
  },

  // ---- ThriveCart ----
  thrivecart: {
    apiToken: required('THRIVECART_API_TOKEN'),
    courseId: required('THRIVECART_COURSE_ID'),
    // Base de la API de ThriveCart. Configurable por si cambia.
    apiBase: required('THRIVECART_API_BASE', 'https://thrivecart.com/api/external'),
  },

  // ---- Sitio ----
  // URL publica; se usa para construir las URLs de notificacion y retorno.
  // En Vercel se puede usar https://${VERCEL_URL} pero conviene fijar el dominio real.
  baseUrl: (
    process.env.PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'http://localhost:3000'
  ).replace(/\/$/, ''),
};

export function assertRedsysConfigured(): string | null {
  if (!config.redsys.secretKey) return 'Falta REDSYS_SECRET_KEY';
  if (!config.redsys.merchantCode) return 'Falta REDSYS_MERCHANT_CODE';
  if (!config.baseUrl || config.baseUrl.startsWith('http://localhost')) {
    // permitido en local, solo avisamos
  }
  return null;
}

export function assertThriveCartConfigured(): string | null {
  if (!config.thrivecart.apiToken) return 'Falta THRIVECART_API_TOKEN';
  if (!config.thrivecart.courseId) return 'Falta THRIVECART_COURSE_ID';
  return null;
}
