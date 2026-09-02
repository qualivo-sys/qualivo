import { neon } from '@neondatabase/serverless';
import type { Estado } from './types';

/**
 * Conexion a Postgres (Neon, que es lo que monta Vercel desde el Marketplace).
 * La integracion nativa inyecta DATABASE_URL; las bases antiguas de Vercel
 * Postgres usaban POSTGRES_URL, asi que aceptamos las dos.
 */
function cadenaConexion(): string {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
}

/** Sin base de datos la app sigue funcionando, pero guarda solo en el navegador. */
export function hayNube(): boolean {
  return Boolean(cadenaConexion());
}

let tablaLista = false;

async function conectar() {
  const sql = neon(cadenaConexion());
  if (!tablaLista) {
    await sql`
      CREATE TABLE IF NOT EXISTS entrenos_estado (
        perfil_id   text PRIMARY KEY,
        datos       jsonb NOT NULL,
        actualizado timestamptz NOT NULL DEFAULT now()
      )
    `;
    tablaLista = true;
  }
  return sql;
}

export async function leerEstado(perfilId: string): Promise<Estado | null> {
  const sql = await conectar();
  const filas = (await sql`SELECT datos FROM entrenos_estado WHERE perfil_id = ${perfilId}`) as { datos: Estado }[];
  return filas[0]?.datos ?? null;
}

export async function guardarEstado(perfilId: string, estado: Estado): Promise<void> {
  const sql = await conectar();
  await sql`
    INSERT INTO entrenos_estado (perfil_id, datos, actualizado)
    VALUES (${perfilId}, ${JSON.stringify(estado)}::jsonb, now())
    ON CONFLICT (perfil_id)
    DO UPDATE SET datos = EXCLUDED.datos, actualizado = now()
  `;
}
