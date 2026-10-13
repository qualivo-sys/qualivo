/**
 * Integracion con Redsys (modelo Hosted / Redireccion) usando `redsys-easy`,
 * que implementa la firma HMAC-SHA256 con derivacion de clave 3DES exigida por
 * Redsys. No reinventamos la criptografia: es dinero real.
 */
import {
  createRedsysAPI,
  PRODUCTION_URLS,
  SANDBOX_URLS,
  randomTransactionId,
} from 'redsys-easy';
import { config } from './config';

type RedsysAPI = ReturnType<typeof createRedsysAPI>;
let _api: RedsysAPI | null = null;

/**
 * Crea (una sola vez) el cliente de Redsys. Es LAZY a proposito: si lo
 * creasemos al importar el modulo, el build de Next fallaria cuando aun no hay
 * `REDSYS_SECRET_KEY` definida. Se instancia en el primer request real.
 */
function getApi(): RedsysAPI {
  if (_api) return _api;
  const urls = config.redsys.env === 'sandbox' ? SANDBOX_URLS : PRODUCTION_URLS;
  _api = createRedsysAPI({ secretKey: config.redsys.secretKey, urls });
  return _api;
}

export const createRedirectForm: RedsysAPI['createRedirectForm'] = (params) =>
  getApi().createRedirectForm(params);

export const processRestNotification: RedsysAPI['processRestNotification'] = (body) =>
  getApi().processRestNotification(body);

/**
 * Genera un identificador de pedido valido para Redsys.
 * Formato: 4 digitos numericos + hasta 8 alfanumericos. Debe ser UNICO por
 * operacion. `randomTransactionId` de redsys-easy devuelve 12 digitos validos.
 */
export function newOrderId(): string {
  return randomTransactionId();
}

/**
 * Empaqueta los datos del comprador para que viajen con la operacion y vuelvan
 * en la notificacion (campo Ds_MerchantData). Asi el webhook sabe a quien dar
 * de alta sin necesidad de base de datos. Redsys nos devuelve este dato tal
 * cual y la firma garantiza que no ha sido manipulado.
 */
export interface BuyerData {
  email: string;
  name: string;
  surname: string;
  phone: string;
  country: string;
}

export function packMerchantData(data: Partial<BuyerData> & { email: string }): string {
  const json = JSON.stringify({
    e: data.email,
    n: data.name ?? '',
    a: data.surname ?? '',
    t: data.phone ?? '',
    c: data.country ?? '',
  });
  // Ds_MerchantData admite hasta 1024 caracteres.
  return Buffer.from(json, 'utf8').toString('base64').slice(0, 1024);
}

export function unpackMerchantData(raw?: string): BuyerData | null {
  if (!raw) return null;
  try {
    const json = Buffer.from(raw, 'base64').toString('utf8');
    const p = JSON.parse(json) as { e?: string; n?: string; a?: string; t?: string; c?: string };
    if (!p.e) return null;
    return { email: p.e, name: p.n ?? '', surname: p.a ?? '', phone: p.t ?? '', country: p.c ?? '' };
  } catch {
    return null;
  }
}

/**
 * Un pago se considera aceptado si Ds_Response esta entre 0000 y 0099.
 * https://pagosonline.redsys.es/codigosRespuesta.html
 */
export function isPaymentAuthorized(dsResponse: string | number | undefined): boolean {
  if (dsResponse === undefined) return false;
  const code = typeof dsResponse === 'number' ? dsResponse : parseInt(dsResponse, 10);
  return Number.isFinite(code) && code >= 0 && code <= 99;
}
