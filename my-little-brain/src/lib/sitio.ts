/**
 * La direccion publica de la app, en UN solo sitio.
 *
 * Estaba escrita a mano en tres ficheros, asi que al cambiar de dominio habia
 * que ir a buscarla. Cuando el dominio vuelva a cambiar, se cambia la variable
 * de entorno y ya.
 */
const CRUDO = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL_BASE || 'https://mylittlebrain.es';

/** Con https:// y sin barra final: para construir enlaces. */
export const SITIO = CRUDO.replace(/\/+$/, '');

/** Sin el https://: para cuando hay que ESCRIBIRLO en pantalla y que se lea bien. */
export const SITIO_CORTO = SITIO.replace(/^https?:\/\//, '');
