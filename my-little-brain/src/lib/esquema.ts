import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Comprueba que la base de datos tiene lo que esta version de la app necesita.
 * Si falta algo, la solucion es siempre la misma: volver a ejecutar schema.sql.
 */
export async function comprobarEsquema(supabase: SupabaseClient): Promise<string[]> {
  const faltan: string[] = [];
  const pruebas: { nombre: string; consulta: () => PromiseLike<{ error: { message: string } | null }> }[] = [
    { nombre: 'columnas de cardio en entrenamientos', consulta: () => supabase.from('entrenamientos').select('cardio_kcal').limit(1) },
    { nombre: 'preferencias en perfiles', consulta: () => supabase.from('perfiles').select('preferencias').limit(1) },
    { nombre: 'objetivos manuales en perfiles', consulta: () => supabase.from('perfiles').select('objetivos_manual').limit(1) },
    { nombre: 'tabla push_suscripciones', consulta: () => supabase.from('push_suscripciones').select('id').limit(1) },
  ];
  for (const prueba of pruebas) {
    const { error } = await prueba.consulta();
    if (error) faltan.push(prueba.nombre);
  }
  return faltan;
}
