'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { firmaPerfil, generarPlan } from '@/lib/motor/planificador';
import { XP_POR_ACCION } from '@/lib/motor/puntuaciones';
import { perfilEntreno } from '@/lib/perfil';
import { clienteServidor } from '@/lib/supabase/servidor';
import { cargarPerfil } from '@/lib/datos';

async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  return { supabase, userId: data.user.id };
}

async function sumarXp(tipo: string, motivo: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('xp_eventos').insert({
    user_id: userId,
    fecha: hoyIso(),
    tipo,
    xp: XP_POR_ACCION[tipo] ?? 5,
    motivo,
  });
}

const numero = (valor: FormDataEntryValue | null): number | null => {
  if (typeof valor !== 'string' || !valor.trim()) return null;
  const n = Number(valor.replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

const texto = (valor: FormDataEntryValue | null): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;

export async function alternarHabito(habitoId: string, fecha: string, hecho: boolean) {
  const { supabase, userId } = await sesion();
  await supabase
    .from('habitos_registro')
    .upsert({ user_id: userId, habito_id: habitoId, fecha, hecho }, { onConflict: 'habito_id,fecha' });
  if (hecho) await sumarXp('habito', habitoId);
  revalidatePath('/app');
  revalidatePath('/app/habitos');
}

export async function crearHabito(datos: FormData) {
  const { supabase, userId } = await sesion();
  const nombre = texto(datos.get('nombre'));
  if (!nombre) return;
  await supabase.from('habitos').insert({
    user_id: userId,
    nombre,
    emoji: texto(datos.get('emoji')) ?? '✅',
    veces_por_semana: Math.max(1, Math.min(7, numero(datos.get('veces_por_semana')) ?? 7)),
  });
  revalidatePath('/app/habitos');
}

export async function archivarHabito(habitoId: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('habitos').update({ activo: false }).eq('id', habitoId).eq('user_id', userId);
  revalidatePath('/app/habitos');
}

export async function guardarMedicion(datos: FormData) {
  const { supabase, userId } = await sesion();
  const fecha = texto(datos.get('fecha')) ?? hoyIso();
  const fila = {
    user_id: userId,
    fecha,
    peso_kg: numero(datos.get('peso_kg')),
    cuello_cm: numero(datos.get('cuello_cm')),
    pecho_cm: numero(datos.get('pecho_cm')),
    cintura_cm: numero(datos.get('cintura_cm')),
    cadera_cm: numero(datos.get('cadera_cm')),
    brazo_cm: numero(datos.get('brazo_cm')),
    muslo_cm: numero(datos.get('muslo_cm')),
    notas: texto(datos.get('notas')),
  };
  if (Object.values(fila).every((v) => v === null || v === userId || v === fecha)) return;

  await supabase.from('metricas_corporales').upsert(fila, { onConflict: 'user_id,fecha' });
  await sumarXp(fila.cintura_cm ? 'medidas' : 'peso', `medicion ${fecha}`);
  revalidatePath('/app');
  revalidatePath('/app/cuerpo');
}

export async function guardarComida(datos: FormData) {
  const { supabase, userId } = await sesion();
  const descripcion = texto(datos.get('descripcion'));
  const kcal = numero(datos.get('kcal'));
  if (!descripcion || kcal === null) return;

  await supabase.from('comidas').insert({
    user_id: userId,
    fecha: texto(datos.get('fecha')) ?? hoyIso(),
    momento: texto(datos.get('momento')),
    descripcion,
    kcal: Math.round(kcal),
    proteina_g: numero(datos.get('proteina_g')),
    carbos_g: numero(datos.get('carbos_g')),
    grasa_g: numero(datos.get('grasa_g')),
    alcohol_ud: numero(datos.get('alcohol_ud')) ?? 0,
    fuente: 'manual',
    confianza: 'alta',
  });
  await sumarXp('comida', descripcion);
  revalidatePath('/app');
  revalidatePath('/app/cuerpo');
}

export async function borrarComida(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('comidas').delete().eq('id', id).eq('user_id', userId);
  revalidatePath('/app/cuerpo');
}

export async function guardarCheckIn(datos: FormData) {
  const { supabase, userId } = await sesion();
  const fecha = texto(datos.get('fecha')) ?? hoyIso();
  const escala = (clave: string) => {
    const valor = numero(datos.get(clave));
    return valor === null ? null : Math.max(1, Math.min(10, Math.round(valor)));
  };

  const { data: previo } = await supabase
    .from('bienestar')
    .select('*')
    .eq('user_id', userId)
    .eq('fecha', fecha)
    .maybeSingle();

  await supabase.from('bienestar').upsert(
    {
      ...(previo ?? {}),
      user_id: userId,
      fecha,
      animo: escala('animo') ?? previo?.animo ?? null,
      energia: escala('energia') ?? previo?.energia ?? null,
      estres: escala('estres') ?? previo?.estres ?? null,
      motivacion: escala('motivacion') ?? previo?.motivacion ?? null,
      sueno_horas: numero(datos.get('sueno_horas')) ?? previo?.sueno_horas ?? null,
      sueno_calidad: escala('sueno_calidad') ?? previo?.sueno_calidad ?? null,
      pasos: numero(datos.get('pasos')) ?? previo?.pasos ?? null,
      notas: texto(datos.get('notas')) ?? previo?.notas ?? null,
    },
    { onConflict: 'user_id,fecha' },
  );
  if (!previo) await sumarXp('checkin', `check-in ${fecha}`);
  revalidatePath('/app');
}

export async function guardarFoco(datos: FormData) {
  const { supabase, userId } = await sesion();
  const minutos = numero(datos.get('minutos'));
  const categoria = texto(datos.get('categoria'));
  if (!minutos || !categoria) return;

  await supabase.from('foco').insert({
    user_id: userId,
    fecha: texto(datos.get('fecha')) ?? hoyIso(),
    categoria,
    minutos: Math.round(minutos),
    descripcion: texto(datos.get('descripcion')),
  });
  await sumarXp('foco', categoria);
  revalidatePath('/app');
}

export interface SeriePayload {
  ejercicio_id: string;
  ejercicio_nombre: string;
  orden: number;
  serie: number;
  peso_kg: number | null;
  reps: number | null;
  rir: number | null;
}

export async function guardarEntreno(payload: {
  nombre: string;
  dia_plan: string | null;
  sensacion: number | null;
  notas: string | null;
  series: SeriePayload[];
}) {
  const { supabase, userId } = await sesion();
  const fecha = hoyIso();

  const { data: entreno, error } = await supabase
    .from('entrenamientos')
    .insert({
      user_id: userId,
      fecha,
      dia_plan: payload.dia_plan,
      nombre: payload.nombre,
      sensacion: payload.sensacion,
      notas: payload.notas,
      completado: true,
    })
    .select('id')
    .single();
  if (error || !entreno) return { ok: false };

  const series = payload.series.filter((s) => s.reps !== null || s.peso_kg !== null);
  if (series.length) {
    await supabase.from('series').insert(
      series.map((s) => ({ ...s, user_id: userId, entrenamiento_id: entreno.id, hecha: true })),
    );
  }
  await sumarXp('entreno', payload.nombre);
  revalidatePath('/app');
  revalidatePath('/app/entreno');
  return { ok: true };
}

/** Accion de formulario: regenera el plan con los datos actuales del perfil. */
export async function regenerarPlan(): Promise<void> {
  const { supabase, userId } = await sesion();
  const perfil = await cargarPerfil(supabase, userId);
  if (!perfil) return;

  const datos = perfilEntreno(perfil);
  if (!datos) return;

  const plan = generarPlan(datos);
  await supabase.from('planes_entreno').update({ activo: false }).eq('user_id', userId).eq('activo', true);
  await supabase.from('planes_entreno').insert({
    user_id: userId,
    firma: firmaPerfil(datos),
    datos: plan,
    activo: true,
  });
  revalidatePath('/app/entreno');
}

export async function guardarPerfil(datos: FormData) {
  const { supabase, userId } = await sesion();
  const cambios: Record<string, unknown> = { actualizado: new Date().toISOString() };
  const campos = [
    'nombre', 'sexo', 'ocupacion', 'objetivo', 'nivel', 'entorno', 'actividad',
    'preferencias_comida', 'hora_dormir', 'hora_despertar', 'zona_horaria',
  ];
  for (const campo of campos) {
    const valor = texto(datos.get(campo));
    if (valor) cambios[campo] = valor;
  }
  for (const campo of ['edad', 'altura_cm', 'dias_semana', 'alcohol_semanal']) {
    const valor = numero(datos.get(campo));
    if (valor !== null) cambios[campo] = valor;
  }
  const limitaciones = datos.getAll('limitaciones').filter((v): v is string => typeof v === 'string');
  cambios.limitaciones = limitaciones;

  await supabase.from('perfiles').update(cambios).eq('id', userId);
  revalidatePath('/app/ajustes');
  revalidatePath('/app');
}

export async function cerrarSesion() {
  const { supabase } = await sesion();
  await supabase.auth.signOut();
  redirect('/entrar');
}
