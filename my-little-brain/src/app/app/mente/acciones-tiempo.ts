'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { XP_POR_ACCION } from '@/lib/motor/puntuaciones';
import { clienteServidor } from '@/lib/supabase/servidor';
import { ETIQUETA_CATEGORIA_FOCO } from '@/lib/perfil';

async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  const { data: perfil } = await supabase.from('perfiles').select('zona_horaria').eq('id', data.user.id).maybeSingle();
  const zona = (perfil?.zona_horaria as string | null) || undefined;
  return { supabase, userId: data.user.id, hoy: hoyIso(zona), zona };
}

function refrescar() {
  revalidatePath('/app/mente');
  revalidatePath('/app/mente/tiempo');
  revalidatePath('/app');
}

const texto = (valor: FormDataEntryValue | null): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;

const esCategoria = (v: string | null) => (v && v in ETIQUETA_CATEGORIA_FOCO ? v : 'otro');

/** Suma XP sin romper el flujo si algo falla: apuntar el rato es lo importante. */
async function sumarXp(supabase: Awaited<ReturnType<typeof sesion>>['supabase'], userId: string, hoy: string, motivo: string) {
  await supabase.from('xp_eventos').insert({
    user_id: userId, fecha: hoy, tipo: 'foco', xp: XP_POR_ACCION.foco ?? 5, motivo,
  }).then(() => undefined, () => undefined);
}

// ── Actividades ───────────────────────────────────────────────────────

export async function crearActividad(datos: FormData) {
  const { supabase, userId } = await sesion();
  const nombre = texto(datos.get('nombre'));
  if (!nombre) return;

  const objetivo = Number(texto(datos.get('objetivo_min_semana')) ?? '');
  await supabase.from('actividades_tiempo').insert({
    user_id: userId,
    nombre: nombre.slice(0, 40),
    emoji: texto(datos.get('emoji'))?.slice(0, 4) ?? null,
    categoria: esCategoria(texto(datos.get('categoria'))),
    objetivo_min_semana: Number.isFinite(objetivo) && objetivo > 0 ? Math.round(objetivo) : null,
  });
  refrescar();
}

/** Archivar en vez de borrar: los ratos ya dedicados no se tiran a la basura. */
export async function archivarActividad(id: string, archivada: boolean) {
  const { supabase, userId } = await sesion();
  await supabase.from('actividades_tiempo').update({ archivada }).eq('id', id).eq('user_id', userId);
  refrescar();
}

export async function borrarActividad(id: string) {
  const { supabase, userId } = await sesion();
  // Los registros de foco se quedan (actividad_id pasa a null por la FK).
  await supabase.from('actividades_tiempo').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}

// ── El cronometro ─────────────────────────────────────────────────────

/**
 * Arranca el cronometro. Si ya habia uno corriendo con otra actividad, se
 * guarda antes: cambiar de tarea no deberia perder el rato anterior.
 */
export async function arrancarCronometro(actividadId: string, descripcion?: string) {
  const { supabase, userId } = await sesion();

  const { data: previo } = await supabase.from('cronometro').select('*').eq('user_id', userId).maybeSingle();
  if (previo && previo.actividad_id !== actividadId) await pararYGuardar();

  await supabase.from('cronometro').upsert({
    user_id: userId,
    actividad_id: actividadId,
    descripcion: descripcion?.trim().slice(0, 120) || null,
    inicio: new Date().toISOString(),
    acumulado_seg: 0,
  }, { onConflict: 'user_id' });
  refrescar();
}

/** Pausa: se pasa lo corrido a acumulado y se suelta la marca de inicio. */
export async function pausarCronometro() {
  const { supabase, userId } = await sesion();
  const { data: c } = await supabase.from('cronometro').select('*').eq('user_id', userId).maybeSingle();
  if (!c?.inicio) return;

  const corrido = Math.max(0, Math.floor((Date.now() - new Date(c.inicio).getTime()) / 1000));
  await supabase.from('cronometro')
    .update({ inicio: null, acumulado_seg: c.acumulado_seg + corrido })
    .eq('user_id', userId);
  refrescar();
}

export async function reanudarCronometro() {
  const { supabase, userId } = await sesion();
  await supabase.from('cronometro').update({ inicio: new Date().toISOString() }).eq('user_id', userId);
  refrescar();
}

/**
 * Parar y guardar el rato. Por debajo de un minuto no se guarda nada: es un
 * toque sin querer, y un registro de 12 segundos solo ensucia la semana.
 */
export async function pararYGuardar() {
  const { supabase, userId, hoy } = await sesion();
  const { data: c } = await supabase.from('cronometro').select('*').eq('user_id', userId).maybeSingle();
  if (!c) return;

  const corrido = c.inicio ? Math.max(0, Math.floor((Date.now() - new Date(c.inicio).getTime()) / 1000)) : 0;
  const minutos = Math.round((c.acumulado_seg + corrido) / 60);

  await supabase.from('cronometro').delete().eq('user_id', userId);
  if (minutos < 1) {
    refrescar();
    return;
  }

  const { data: act } = await supabase
    .from('actividades_tiempo').select('categoria, nombre').eq('id', c.actividad_id).maybeSingle();

  await supabase.from('foco').insert({
    user_id: userId,
    fecha: hoy,
    categoria: act?.categoria ?? 'otro',
    minutos,
    descripcion: c.descripcion,
    actividad_id: c.actividad_id,
    inicio: c.creado,
  });
  await sumarXp(supabase, userId, hoy, act?.nombre ?? 'tiempo');
  refrescar();
}

/** Descartar sin guardar, para cuando el cronometro se quedo puesto de noche. */
export async function descartarCronometro() {
  const { supabase, userId } = await sesion();
  await supabase.from('cronometro').delete().eq('user_id', userId);
  refrescar();
}

// ── A mano ────────────────────────────────────────────────────────────

/** Para cuando el rato ya ha pasado y nadie le dio al play. */
export async function apuntarTiempo(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const actividadId = texto(datos.get('actividad_id'));
  const minutos = Number(texto(datos.get('minutos')) ?? '');
  if (!Number.isFinite(minutos) || minutos <= 0) return;

  const { data: act } = actividadId
    ? await supabase.from('actividades_tiempo').select('categoria, nombre').eq('id', actividadId).eq('user_id', userId).maybeSingle()
    : { data: null };

  const fecha = texto(datos.get('fecha'));
  await supabase.from('foco').insert({
    user_id: userId,
    fecha: fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : hoy,
    categoria: act?.categoria ?? esCategoria(texto(datos.get('categoria'))),
    minutos: Math.min(1440, Math.round(minutos)),
    descripcion: texto(datos.get('descripcion')),
    actividad_id: actividadId || null,
  });
  await sumarXp(supabase, userId, hoy, act?.nombre ?? 'tiempo');
  refrescar();
}

export async function borrarTiempo(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('foco').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}
