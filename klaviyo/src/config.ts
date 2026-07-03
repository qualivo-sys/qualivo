import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/** Carga mínima de un fichero .env (sin dependencias). No sobreescribe variables ya presentes. */
function loadDotenv(path: string): void {
  if (!existsSync(path)) return;
  for (const rawLine of readFileSync(path, 'utf8').split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = value;
  }
}

export type Config = {
  apiKey: string;
  revision: string;
};

/**
 * Lee la configuración desde el entorno (y desde klaviyo/.env si existe).
 * La clave privada NUNCA se guarda en el repositorio: vive en .env (gitignored)
 * o en una variable de entorno del sistema/CI.
 */
export function getConfig(): Config {
  const here = dirname(fileURLToPath(import.meta.url));
  loadDotenv(join(here, '..', '.env'));

  const apiKey = process.env.KLAVIYO_API_KEY;
  if (!apiKey) {
    throw new Error(
      'KLAVIYO_API_KEY no está definida. Copia klaviyo/.env.example a klaviyo/.env ' +
        'y pega tu clave privada (pk_...), o expórtala como variable de entorno.',
    );
  }
  if (!apiKey.startsWith('pk_')) {
    throw new Error(
      'KLAVIYO_API_KEY no parece una clave privada de Klaviyo (debe empezar por "pk_"). ' +
        'La clave pública (site ID de 6 caracteres) no sirve para crear flows/plantillas.',
    );
  }

  return {
    apiKey,
    revision: process.env.KLAVIYO_API_REVISION ?? '2025-07-15',
  };
}
