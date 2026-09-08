'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { XP_POR_ACCION } from '@/lib/motor/puntuaciones';
import { clienteServidor } from '@/lib/supabase/servidor';

async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  const { data: perfil } = await supabase.from('perfiles').select('zona_horaria').eq('id', data.user.id).maybeSingle();
  return { supabase, userId: data.user.id, hoy: hoyIso((perfil?.zona_horaria as string | null) || undefined) };
}

function refrescar() {
  revalidatePath('/app/tareas');
  revalidatePath('/app');
}

const texto = (valor: FormDataEntryValue | null): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;

/**
 * Crear una tarea. Si dice que es de hoy, va a hoy: tres es lo que suele
 * cundir, pero hay dias que traen cinco cosas de verdad importantes y quien
 * sabe eso es la persona, no la app.
 */
export async function crearTarea(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const titulo = texto(datos.get('titulo'));
  if (!titulo) return;

  const fecha = datos.get('para_hoy') === 'si' ? hoy : null;

  await supabase.from('tareas').insert({
    user_id: userId,
    titulo: titulo.slice(0, 160),
    area: texto(datos.get('area')),
    prioridad: 2,
    fecha,
    completada: false,
    pospuesta: 0,
  });
  refrescar();
}

/** Marcar o desmarcar. Guardamos el dia para poder medir el avance. */
export async function completarTarea(id: string, completada: boolean) {
  const { supabase, userId, hoy } = await sesion();
  await supabase
    .from('tareas')
    .update({ completada, completada_el: completada ? hoy : null })
    .eq('id', id)
    .eq('user_id', userId);

  if (completada) {
    await supabase.from('xp_eventos').insert({
      user_id: userId, fecha: hoy, tipo: 'tarea', xp: XP_POR_ACCION.tarea ?? 5, motivo: 'tarea hecha',
    }).then(() => undefined, () => undefined);
  }
  refrescar();
}

/**
 * Traer una tarea a hoy. Cuenta como posponer solo si ya tenia un dia
 * anterior: sacarla de la mochila por primera vez no es haberla pospuesto.
 */
export async function traerAHoy(id: string) {
  const { supabase, userId, hoy } = await sesion();

  const { data: previa } = await supabase
    .from('tareas').select('fecha, pospuesta').eq('id', id).eq('user_id', userId).maybeSingle();
  if (!previa) return;

  const veniaDeOtroDia = previa.fecha !== null && previa.fecha < hoy;
  await supabase
    .from('tareas')
    .update({ fecha: hoy, pospuesta: (previa.pospuesta ?? 0) + (veniaDeOtroDia ? 1 : 0) })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

/** Devolver a la mochila: sin fecha, sin culpa, sin desaparecer. */
export async function aLaMochila(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('tareas').update({ fecha: null }).eq('id', id).eq('user_id', userId);
  refrescar();
}

export async function borrarTarea(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('tareas').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}
