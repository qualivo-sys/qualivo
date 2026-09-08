'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { cargarPanel } from '@/lib/datos';
import { METRICAS, valorActual } from '@/lib/motor/objetivos';
import type { ObjetivoRegistro, Perfil } from '@/lib/tipos';
import { MAX_HOY } from '@/lib/motor/tareas';
import { XP_POR_ACCION } from '@/lib/motor/puntuaciones';
import { clienteServidor } from '@/lib/supabase/servidor';

const AREAS = ['cuerpo', 'fitness', 'productividad', 'aprendizaje', 'mente', 'negocio'];

async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', data.user.id).maybeSingle();
  return {
    supabase,
    userId: data.user.id,
    perfil: perfil as Perfil,
    hoy: hoyIso((perfil?.zona_horaria as string | null) || undefined),
  };
}

function refrescar() {
  revalidatePath('/app/objetivos');
  revalidatePath('/app/tareas');
  revalidatePath('/app');
}

const texto = (valor: FormDataEntryValue | null): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;

/** Cuanto vale ahora la metrica elegida, para guardarlo como salida. */
async function puntoDePartida(
  supabase: Awaited<ReturnType<typeof sesion>>['supabase'],
  userId: string,
  perfil: Perfil,
  idMetrica: string,
): Promise<number | null> {
  if (idMetrica === 'manual') return 0;
  const panel = await cargarPanel(supabase, userId, perfil);
  return valorActual(
    { metrica: idMetrica, valor_actual: null } as ObjetivoRegistro,
    { cuerpo: panel.cuerpo, dias: panel.dias, hoy: panel.hoy },
  );
}

const numero = (valor: FormDataEntryValue | null): number | null => {
  const v = texto(valor);
  if (v === null) return null;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

/**
 * Crear un objetivo. El punto de partida lo manda la pantalla, que es quien
 * sabe cuanto pesas hoy: sin el no se puede decir "llevas el 40 % del camino",
 * solo "estas a 3 kg", que dice bastante menos.
 */
export async function crearObjetivo(datos: FormData) {
  const { supabase, userId, perfil } = await sesion();
  const titulo = texto(datos.get('titulo'));
  if (!titulo) return;

  const idMetrica = texto(datos.get('metrica'));
  const valida = METRICAS.some((m) => m.id === idMetrica) ? idMetrica : 'manual';
  const area = texto(datos.get('area'));
  const limite = texto(datos.get('fecha_limite'));

  await supabase.from('objetivos').insert({
    user_id: userId,
    area: area && AREAS.includes(area) ? area : 'productividad',
    titulo: titulo.slice(0, 160),
    detalle: texto(datos.get('detalle')),
    metrica: valida,
    valor_objetivo: numero(datos.get('valor_objetivo')),
    // El punto de partida lo lee la app: si tu objetivo es bajar a 78 kg, de
    // donde partes lo sabe ella, no hace falta que lo teclees.
    valor_inicial: numero(datos.get('valor_inicial')) ?? await puntoDePartida(supabase, userId, perfil, valida ?? 'manual'),
    valor_actual: valida === 'manual' ? numero(datos.get('valor_inicial')) ?? 0 : null,
    fecha_limite: limite && /^\d{4}-\d{2}-\d{2}$/.test(limite) ? limite : null,
    estado: 'activo',
  });
  refrescar();
}

/** Para los objetivos que solo puede contar la persona. */
export async function actualizarValor(id: string, datos: FormData) {
  const { supabase, userId } = await sesion();
  const valor = numero(datos.get('valor_actual'));
  if (valor === null) return;
  await supabase
    .from('objetivos')
    .update({ valor_actual: valor, actualizado: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

export async function cambiarEstado(id: string, estado: 'activo' | 'conseguido' | 'pausado' | 'abandonado') {
  const { supabase, userId, hoy } = await sesion();
  await supabase
    .from('objetivos')
    .update({ estado, actualizado: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId);

  if (estado === 'conseguido') {
    await supabase.from('xp_eventos').insert({
      user_id: userId, fecha: hoy, tipo: 'objetivo', xp: XP_POR_ACCION.objetivo ?? 30, motivo: 'objetivo conseguido',
    }).then(() => undefined, () => undefined);
  }
  refrescar();
}

export async function borrarObjetivo(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('objetivos').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}

/**
 * Lo que convierte un proposito en algo que pasa: una tarea concreta colgada
 * del objetivo. Si hoy ya estan las tres, va a la mochila en vez de perderse.
 */
export async function tareaParaObjetivo(objetivoId: string, datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const titulo = texto(datos.get('titulo'));
  if (!titulo) return;

  const { count } = await supabase
    .from('tareas').select('id', { count: 'exact', head: true })
    .eq('user_id', userId).eq('fecha', hoy);

  await supabase.from('tareas').insert({
    user_id: userId,
    titulo: titulo.slice(0, 160),
    prioridad: 2,
    fecha: (count ?? 0) < MAX_HOY ? hoy : null,
    objetivo_id: objetivoId,
    completada: false,
    pospuesta: 0,
  });
  refrescar();
}
