'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { firmaPerfil, generarPlan, prescripcion } from '@/lib/motor/planificador';
import type { Bloque } from '@/lib/motor/tipos-motor';
import { XP_POR_ACCION, racha as calcularRacha } from '@/lib/motor/puntuaciones';
import { kcalCardio, tipoCardio } from '@/lib/motor/cardio';
import { esDiaRedondo } from '@/lib/motor/energia';
import { cargarPanel } from '@/lib/datos';
import { perfilEntreno } from '@/lib/perfil';
import { clienteServidor } from '@/lib/supabase/servidor';
import { clienteAdmin, hayServiceRole } from '@/lib/supabase/admin';
import { cargarPerfil } from '@/lib/datos';
import { planDesdeImportacion, type Importacion } from '@/lib/importar';
import type { ObjetivosManual } from '@/lib/tipos';

/**
 * Sesion + fecha de "hoy" en la zona horaria del usuario. El servidor va en UTC:
 * sin esto, lo que se guarda entre las 00:00 y las 02:00 en Espana caia en el dia
 * anterior y el panel no lo ensenaba como de hoy.
 */
async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  const { data: perfil } = await supabase.from('perfiles').select('zona_horaria').eq('id', data.user.id).maybeSingle();
  const hoy = hoyIso((perfil?.zona_horaria as string | null) || undefined);
  return { supabase, userId: data.user.id, hoy };
}

async function sumarXp(tipo: string, motivo: string) {
  const { supabase, userId, hoy } = await sesion();
  await supabase.from('xp_eventos').insert({
    user_id: userId,
    fecha: hoy,
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
  const { supabase, userId, hoy } = await sesion();
  const fecha = texto(datos.get('fecha')) ?? hoy;
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
  const { supabase, userId, hoy } = await sesion();
  const descripcion = texto(datos.get('descripcion'));
  const kcal = numero(datos.get('kcal'));
  if (!descripcion || kcal === null) return;

  await supabase.from('comidas').insert({
    user_id: userId,
    fecha: texto(datos.get('fecha')) ?? hoy,
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

/** Comida calculada con la tabla de alimentos (confianza alta: no hay estimacion). */
export async function guardarComidaCalculada(datos: {
  descripcion: string;
  momento: string;
  kcal: number;
  proteina_g: number;
  carbos_g: number;
  grasa_g: number;
  alcohol_ud: number;
}) {
  const { supabase, userId, hoy } = await sesion();
  if (!datos.descripcion || !Number.isFinite(datos.kcal)) return;

  await supabase.from('comidas').insert({
    user_id: userId,
    fecha: hoy,
    momento: ['desayuno', 'comida', 'cena', 'snack', 'bebida'].includes(datos.momento) ? datos.momento : null,
    descripcion: datos.descripcion.slice(0, 300),
    kcal: Math.max(0, Math.round(datos.kcal)),
    proteina_g: Math.max(0, Math.round(datos.proteina_g)),
    carbos_g: Math.max(0, Math.round(datos.carbos_g)),
    grasa_g: Math.max(0, Math.round(datos.grasa_g)),
    alcohol_ud: Math.max(0, Number(datos.alcohol_ud) || 0),
    fuente: 'manual',
    confianza: 'alta',
  });
  await sumarXp('comida', datos.descripcion);
  revalidatePath('/app');
  revalidatePath('/app/cuerpo');
}

export async function borrarComida(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('comidas').delete().eq('id', id).eq('user_id', userId);
  revalidatePath('/app/cuerpo');
}

export async function guardarCheckIn(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const fecha = texto(datos.get('fecha')) ?? hoy;
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
  await premiarDiaRedondo(supabase, userId, fecha);
  revalidatePath('/app');
}

export async function guardarFoco(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const minutos = numero(datos.get('minutos'));
  const categoria = texto(datos.get('categoria'));
  if (!minutos || !categoria) return;

  await supabase.from('foco').insert({
    user_id: userId,
    fecha: texto(datos.get('fecha')) ?? hoy,
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
  cardio?: { tipo: string; minutos: number; kcal: number } | null;
}) {
  const { supabase, userId, hoy } = await sesion();
  const fecha = hoy;
  const cardio = payload.cardio && payload.cardio.minutos > 0 ? payload.cardio : null;

  const seriesConDatos = payload.series.filter((s) => s.reps !== null || s.peso_kg !== null);
  const base = {
    user_id: userId,
    fecha,
    dia_plan: payload.dia_plan,
    nombre: payload.nombre,
    sensacion: payload.sensacion,
    notas: payload.notas,
    completado: true,
    // Duracion estimada (unos 3 min por serie con descanso) mas el cardio: sirve para el gasto.
    duracion_min: Math.max(15, seriesConDatos.length * 3) + (cardio ? Math.round(cardio.minutos) : 0),
  };
  let { data: entreno, error } = await supabase
    .from('entrenamientos')
    .insert({
      ...base,
      cardio_tipo: cardio?.tipo ?? null,
      cardio_min: cardio ? Math.round(cardio.minutos) : null,
      cardio_kcal: cardio ? Math.round(cardio.kcal) : null,
    })
    .select('id')
    .single();

  // Base de datos sin actualizar (faltan las columnas de cardio): guardamos
  // igualmente el entreno sin cardio y avisamos, en vez de perder la sesion.
  let aviso: string | null = null;
  if (error && /cardio_/.test(error.message)) {
    ({ data: entreno, error } = await supabase.from('entrenamientos').insert(base).select('id').single());
    aviso = 'Entreno guardado, pero sin el cardio: la base de datos necesita actualizarse (ejecuta schema.sql en Supabase).';
  }
  if (error || !entreno) {
    console.error('[entreno] no se pudo guardar', error?.message);
    return { ok: false as const, error: error?.message ?? 'No se pudo guardar el entreno.' };
  }

  const series = payload.series.filter((s) => s.reps !== null || s.peso_kg !== null);
  if (series.length) {
    const { error: errorSeries } = await supabase.from('series').insert(
      series.map((s) => ({ ...s, user_id: userId, entrenamiento_id: entreno.id, hecha: true })),
    );
    if (errorSeries) {
      console.error('[entreno] no se pudieron guardar las series', errorSeries.message);
      aviso = `Entreno guardado, pero sin las series: ${errorSeries.message}`;
    }
  }
  await sumarXp('entreno', payload.nombre);
  revalidatePath('/app');
  revalidatePath('/app/entreno');
  const { data: xp } = await supabase.from('xp_eventos').select('fecha').eq('user_id', userId);
  return {
    ok: true as const,
    aviso,
    xp: XP_POR_ACCION.entreno,
    racha: calcularRacha((xp ?? []).map((e) => e.fecha as string), hoy),
    kcalCardio: cardio ? Math.round(cardio.kcal) : 0,
  };
}

/** Anade un ejercicio al dia del plan activo (desde el registro de sesion). */
export async function anadirAlPlan(diaId: string, ejercicioId: string, nombre: string) {
  const { supabase, userId } = await sesion();
  const [{ data: plan }, perfil] = await Promise.all([
    supabase
      .from('planes_entreno')
      .select('id, datos')
      .eq('user_id', userId)
      .eq('activo', true)
      .order('generado_el', { ascending: false })
      .limit(1)
      .maybeSingle(),
    cargarPerfil(supabase, userId),
  ]);
  if (!plan || !perfil) return;

  const datos = plan.datos as { dias: { id: string; bloques: Bloque[] }[] };
  const dia = datos.dias.find((d) => d.id === diaId);
  if (!dia || dia.bloques.some((b) => b.ejercicioId === ejercicioId)) return;

  const datosEntreno = perfilEntreno(perfil);
  const pauta = prescripcion('accesorio', datosEntreno?.objetivo ?? 'mantener', datosEntreno?.nivel ?? 'intermedio', ejercicioId);
  dia.bloques.push({ ejercicioId, rol: 'accesorio', ...pauta, ...(ejercicioId.startsWith('libre_') ? { nombreLibre: nombre } : {}) });

  await supabase.from('planes_entreno').update({ datos }).eq('id', plan.id);
  revalidatePath('/app/entreno');
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

/** Horas de los avisos push. Vacio = desactivado. */
export async function guardarPreferencias(datos: FormData) {
  const { supabase, userId } = await sesion();
  const hora = (clave: string): string | null => {
    const v = texto(datos.get(clave));
    return v && /^\d{2}:\d{2}$/.test(v) ? v : null;
  };
  const preferencias = {
    aviso_manana: hora('aviso_manana'),
    aviso_noche: hora('aviso_noche'),
    aviso_entreno: datos.get('aviso_entreno') === 'on',
  };
  const zona = texto(datos.get('zona_horaria'));
  await supabase
    .from('perfiles')
    .update({ preferencias, ...(zona ? { zona_horaria: zona } : {}), actualizado: new Date().toISOString() })
    .eq('id', userId);
  revalidatePath('/app/ajustes');
}

export async function cerrarSesion() {
  const { supabase } = await sesion();
  await supabase.auth.signOut();
  redirect('/entrar');
}

/**
 * Borrado de cuenta (art. 17 RGPD). Irreversible: el cascade de auth.users se
 * lleva todas las tablas, y las fotos se borran a mano porque Storage no cascadea.
 */
export async function borrarCuenta(datos: FormData) {
  const { supabase, userId } = await sesion();
  if (texto(datos.get('confirmacion'))?.toUpperCase() !== 'BORRAR') {
    redirect('/app/ajustes?borrar=confirmacion');
  }
  if (!hayServiceRole()) {
    redirect('/app/ajustes?borrar=sin_servicio');
  }

  const admin = clienteAdmin();

  const { data: fotos } = await admin.storage.from('comidas').list(userId, { limit: 1000 });
  if (fotos?.length) {
    await admin.storage.from('comidas').remove(fotos.map((f) => `${userId}/${f.name}`));
  }

  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.error('[cuenta] no se pudo borrar el usuario', error.message);
    redirect('/app/ajustes?borrar=error');
  }

  await supabase.auth.signOut();
  redirect('/?cuenta=borrada');
}

/**
 * Guarda lo que el usuario ha confirmado de un plan importado: el entreno pasa
 * a ser el plan activo (firma 'importado', asi no se marca como desactualizado)
 * y la dieta fija los objetivos de calorias y deja sus pautas en la memoria
 * del coach.
 */
export async function aplicarImportacion(
  datos: Importacion,
  opciones: { entreno: boolean; dieta: boolean },
): Promise<{ ok: true; aplicado: string[] } | { ok: false; error: string }> {
  const { supabase, userId, hoy } = await sesion();
  const aplicado: string[] = [];

  if (opciones.entreno && datos.entreno?.dias?.length) {
    const { plan } = planDesdeImportacion(datos.entreno);
    if (!plan.dias.some((d) => d.bloques.length)) {
      return { ok: false, error: 'El plan de entreno no tiene ejercicios.' };
    }
    await supabase.from('planes_entreno').update({ activo: false }).eq('user_id', userId).eq('activo', true);
    const { error } = await supabase
      .from('planes_entreno')
      .insert({ user_id: userId, firma: 'importado', datos: plan, activo: true });
    if (error) return { ok: false, error: `No se ha podido guardar el plan: ${error.message}` };
    aplicado.push(`entreno de ${plan.dias.length} dias`);
  }

  if (opciones.dieta && datos.dieta) {
    const d = datos.dieta;
    const fuente = d.origen?.trim() ? `dieta de ${d.origen.trim()}` : 'dieta importada';
    if (typeof d.kcal === 'number' && d.kcal > 0) {
      const kcal = Math.round(d.kcal);
      const proteina = Math.round(Math.max(0, d.proteina_g ?? 0));
      const grasa = Math.round(Math.max(0, d.grasa_g ?? 0));
      // Si faltan los carbos, se deducen de lo que queda de las calorias.
      const carbos = Math.round(Math.max(0, d.carbos_g ?? (kcal - proteina * 4 - grasa * 9) / 4));
      const objetivos: ObjetivosManual = {
        kcal, proteina_g: proteina, carbos_g: carbos, grasa_g: grasa, fuente, fijado_el: hoy,
      };
      const { error } = await supabase.from('perfiles').update({ objetivos_manual: objetivos }).eq('id', userId);
      if (error) {
        return {
          ok: false,
          error: /objetivos_manual/.test(error.message)
            ? 'Falta actualizar la base de datos (ejecuta supabase/schema.sql) para guardar los objetivos.'
            : `No se han podido guardar los objetivos: ${error.message}`,
        };
      }
      aplicado.push(`objetivo de ${kcal} kcal`);
    }
    const pautas = [d.resumen?.trim(), ...(d.normas ?? []).map((x) => `- ${x}`)].filter(Boolean).join('\n');
    if (pautas) {
      await supabase.from('memoria').upsert(
        {
          user_id: userId,
          clave: 'dieta_especialista',
          valor: `${fuente}: ${pautas}`.slice(0, 4000),
          categoria: 'nutricion',
          actualizado: new Date().toISOString(),
        },
        { onConflict: 'user_id,clave' },
      );
      aplicado.push('pautas de la dieta en la memoria del coach');
    }
  }

  if (!aplicado.length) return { ok: false, error: 'No habia nada que aplicar.' };
  revalidatePath('/app');
  revalidatePath('/app/entreno');
  revalidatePath('/app/cuerpo');
  return { ok: true, aplicado };
}

/** Vuelve a los objetivos que calcula la app a partir del perfil. */
export async function quitarObjetivosManual(): Promise<void> {
  const { supabase, userId } = await sesion();
  await supabase.from('perfiles').update({ objetivos_manual: null }).eq('id', userId);
  revalidatePath('/app');
  revalidatePath('/app/cuerpo');
}


/** Da la bonificacion de "dia redondo" una sola vez por dia, cuando se cumple. */
async function premiarDiaRedondo(supabase: Awaited<ReturnType<typeof sesion>>['supabase'], userId: string, fecha: string) {
  const perfil = await cargarPerfil(supabase, userId);
  if (!perfil) return;
  const panel = await cargarPanel(supabase, userId, perfil);
  const dia = panel.dias.find((d) => d.fecha === fecha);
  if (!dia || !esDiaRedondo(dia, { kcal: panel.metas?.kcal ?? null, proteina: panel.metas?.proteinaG ?? null })) return;
  const { data: ya } = await supabase
    .from('xp_eventos').select('id').eq('user_id', userId).eq('fecha', fecha).eq('tipo', 'dia_redondo').limit(1);
  if (ya?.length) return;
  await supabase.from('xp_eventos').insert({ user_id: userId, fecha, tipo: 'dia_redondo', xp: XP_POR_ACCION.dia_redondo, motivo: 'dia redondo' });
}

/**
 * Actividad libre fuera del plan (monte, bici, padel, natacion…): se guarda como
 * entrenamiento sin dia del plan, con su tipo, minutos y calorias estimadas.
 */
export async function registrarActividad(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const fecha = texto(datos.get('fecha')) ?? hoy;
  const tipo = texto(datos.get('tipo')) ?? 'andar';
  const minutos = Math.max(1, Math.round(numero(datos.get('minutos')) ?? 30));
  const { data: ultimoPeso } = await supabase
    .from('metricas_corporales').select('peso_kg').eq('user_id', userId).not('peso_kg', 'is', null)
    .order('fecha', { ascending: false }).limit(1).maybeSingle();
  const peso = Number(ultimoPeso?.peso_kg) || 75;
  const info = tipoCardio(tipo);
  const kcal = info ? kcalCardio(tipo, minutos, peso) : Math.round(5 * peso * (minutos / 60));
  const nombre = texto(datos.get('nombre')) ?? info?.nombre ?? 'Actividad';
  const { error } = await supabase.from('entrenamientos').insert({
    user_id: userId,
    fecha,
    dia_plan: null,
    nombre: nombre.slice(0, 80),
    sensacion: numero(datos.get('sensacion')),
    notas: texto(datos.get('notas')),
    completado: true,
    duracion_min: minutos,
    cardio_tipo: info ? tipo : 'otro',
    cardio_min: minutos,
    cardio_kcal: kcal,
  });
  if (error) {
    console.error('[actividad] no se pudo guardar', error.message);
    return;
  }
  await supabase.from('xp_eventos').insert({ user_id: userId, fecha, tipo: 'actividad', xp: XP_POR_ACCION.actividad, motivo: nombre });
  revalidatePath('/app');
  revalidatePath('/app/semana');
  revalidatePath('/app/entreno');
  revalidatePath('/app/progreso');
}

export async function borrarActividad(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('entrenamientos').delete().eq('id', id).eq('user_id', userId).is('dia_plan', null);
  revalidatePath('/app');
  revalidatePath('/app/semana');
}

/**
 * Alta a mano, por si el chat no termina o la persona prefiere un formulario:
 * guarda lo esencial, el peso, genera el plan y abre la app.
 */
export async function terminarAlta(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const cambios: Record<string, unknown> = { actualizado: new Date().toISOString() };
  for (const campo of ['sexo', 'objetivo', 'nivel', 'entorno', 'actividad']) {
    const valor = texto(datos.get(campo));
    if (valor) cambios[campo] = valor;
  }
  for (const campo of ['edad', 'altura_cm', 'dias_semana']) {
    const valor = numero(datos.get(campo));
    if (valor !== null) cambios[campo] = valor;
  }
  await supabase.from('perfiles').update(cambios).eq('id', userId);
  const peso = numero(datos.get('peso_kg'));
  if (peso) {
    await supabase.from('metricas_corporales').upsert({ user_id: userId, fecha: hoy, peso_kg: peso }, { onConflict: 'user_id,fecha' });
  }
  const perfil = await cargarPerfil(supabase, userId);
  if (!perfil) redirect('/app/onboarding');
  const datosEntreno = perfilEntreno(perfil);
  if (!datosEntreno) redirect('/app/onboarding?faltan=1');
  const { data: activo } = await supabase.from('planes_entreno').select('id').eq('user_id', userId).eq('activo', true).limit(1);
  if (!activo?.length) {
    await supabase.from('planes_entreno').insert({ user_id: userId, firma: firmaPerfil(datosEntreno), datos: generarPlan(datosEntreno), activo: true });
  }
  await supabase.from('perfiles').update({ onboarding: true, actualizado: new Date().toISOString() }).eq('id', userId);
  revalidatePath('/app');
  redirect('/app');
}
