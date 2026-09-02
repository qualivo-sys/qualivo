/**
 * Datos del responsable para los textos legales. Se rellenan por variables de
 * entorno para no dejar datos de empresa en el codigo. Los valores por defecto
 * son marcadores visibles: si aparecen en la web, es que falta configurarlos.
 */
export const LEGAL = {
  empresa: process.env.NEXT_PUBLIC_LEGAL_EMPRESA || '[NOMBRE O RAZON SOCIAL]',
  cif: process.env.NEXT_PUBLIC_LEGAL_CIF || '[NIF / CIF]',
  direccion: process.env.NEXT_PUBLIC_LEGAL_DIRECCION || '[DIRECCION POSTAL]',
  email: process.env.NEXT_PUBLIC_LEGAL_EMAIL || '[EMAIL DE CONTACTO]',
  dominio: process.env.NEXT_PUBLIC_SITE_URL || '[DOMINIO]',
  actualizado: '2 de septiembre de 2026',
};

export function legalConfigurado(): boolean {
  return !Object.values(LEGAL).some((v) => v.startsWith('['));
}
