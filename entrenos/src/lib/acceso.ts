export const COOKIE_ACCESO = 'entrenos_acceso';

/** Hash del codigo de acceso. Web Crypto: funciona en Node y en el edge. */
export async function hashCodigo(codigo: string): Promise<string> {
  const datos = new TextEncoder().encode(`entrenos:${codigo}`);
  const buffer = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
