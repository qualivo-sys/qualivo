import type { SupabaseClient } from '@supabase/supabase-js';
import { hoy as hoyIso, inicioSemana, sumarDias, ultimosDias } from './fechas';
import { resumenCuerpo, type ResumenCuerpo } from './motor/cuerpo';
import type { PlanEntreno } from './motor/tipos-motor';
import {
  construirDias,
  progreso,
  puntuar,
  racha,
  type Dia,
  type MetasSemana,
  type Progreso,
  type Puntuaciones,
} from './motor/puntuaciones';
import { tmbDe, metasNutricion } from './perfil';
import type {
  Bienestar, Comida, Entrenamiento, Foco, Habito, HabitoRegistro,
  MetricaCorporal, ObjetivoRegistro, Perfil, RecuerdoCoach, Tarea,
} from './tipos';
import type { ObjetivosDiarios } from './motor/nutricion';

export interface Panel {
  perfil: Perfil;
  hoy: string;
  metas: ObjetivosDiarios | null;
  cuerpo: ResumenCuerpo;
  dias: Dia[];
  diaHoy: Dia;
  semana: Dia[];
  puntuaciones: Puntuaciones;
  progreso: Progreso;
  racha: number;
  plan: PlanEntreno | null;
  habitos: Habito[];
  registrosHabitos: HabitoRegistro[];
  objetivos: ObjetivoRegistro[];
  tareas: Tarea[];
  memoria: RecuerdoCoach[];
  entrenamientos: Entrenamiento[];
  comidasHoy: Comida[];
  metricas: MetricaCorporal[];
}

const DIAS_HISTORIAL = 60;

/**
 * Carga de una sola vez todo lo que necesitan el panel, el coach y la revision.
 * Una unica funcion para que las tres cosas vean exactamente los mismos numeros.
 */
export async function cargarPanel(
  supabase: SupabaseClient,
  userId: string,
  perfil: Perfil,
): Promise<Panel> {
  const hoy = hoyIso(perfil.zona_horaria || undefined);
  const desde = sumarDias(hoy, -DIAS_HISTORIAL);

  const [
    metricas, comidas, entrenamientos, foco, habitos, registros,
    bienestar, planes, objetivos, tareas, memoria, xp,
  ] = await Promise.all([
    tabla<MetricaCorporal>(supabase, 'metricas_corporales', userId, desde),
    tabla<Comida>(supabase, 'comidas', userId, desde),
    tabla<Entrenamiento>(supabase, 'entrenamientos', userId, desde),
    tabla<Foco>(supabase, 'foco', userId, desde),
    supabase.from('habitos').select('*').eq('user_id', userId).order('creado').then((r) => (r.data ?? []) as Habito[]),
    tabla<HabitoRegistro>(supabase, 'habitos_registro', userId, desde),
    tabla<Bienestar>(supabase, 'bienestar', userId, desde),
    supabase
      .from('planes_entreno')
      .select('datos')
      .eq('user_id', userId)
      .eq('activo', true)
      .order('generado_el', { ascending: false })
      .limit(1)
      .then((r) => (r.data ?? []) as { datos: PlanEntreno }[]),
    supabase
      .from('objetivos')
      .select('*')
      .eq('user_id', userId)
      .eq('estado', 'activo')
      .then((r) => (r.data ?? []) as ObjetivoRegistro[]),
    supabase
      .from('tareas')
      .select('*')
      .eq('user_id', userId)
      .eq('completada', false)
      .order('prioridad')
      .limit(20)
      .then((r) => (r.data ?? []) as Tarea[]),
    supabase
      .from('memoria')
      .select('*')
      .eq('user_id', userId)
      .order('actualizado', { ascending: false })
      .limit(40)
      .then((r) => (r.data ?? []) as RecuerdoCoach[]),
    supabase
      .from('xp_eventos')
      .select('xp, fecha')
      .eq('user_id', userId)
      .then((r) => (r.data ?? []) as { xp: number; fecha: string }[]),
  ]);

  const cuerpo = resumenCuerpo(perfil.sexo, perfil.altura_cm, metricas);
  const metas = metasNutricion(perfil, cuerpo.peso, cuerpo.grasaPct);

  const fechas = ultimosDias(DIAS_HISTORIAL + 1, hoy);
  const dias = construirDias(
    { comidas, entrenamientos, foco, habitos, registros, bienestar, metricas },
    fechas,
    { tmbKcal: metas?.tmb || tmbDe(perfil, cuerpo.peso), pesoKg: cuerpo.peso ?? 75, metaKcal: metas?.kcal ?? null, metaProteina: metas?.proteinaG ?? null },
  );
  const lunes = inicioSemana(hoy);
  const semana = dias.filter((d) => d.fecha >= lunes && d.fecha <= hoy);

  const metasSemana: MetasSemana = {
    kcal: metas?.kcal ?? null,
    proteinaG: metas?.proteinaG ?? null,
    entrenos: perfil.dias_semana ?? 3,
    focoHoras: 10,
  };

  return {
    perfil,
    hoy,
    metas,
    cuerpo,
    dias,
    diaHoy: dias[dias.length - 1],
    semana,
    puntuaciones: puntuar(semana, metasSemana),
    progreso: progreso(xp.reduce((total, e) => total + e.xp, 0)),
    racha: racha(xp.map((e) => e.fecha), hoy),
    plan: planes[0]?.datos ?? null,
    habitos: habitos.filter((h) => h.activo),
    registrosHabitos: registros,
    objetivos,
    tareas,
    memoria,
    entrenamientos,
    comidasHoy: comidas.filter((c) => c.fecha === hoy),
    metricas,
  };
}

async function tabla<T>(
  supabase: SupabaseClient,
  nombre: string,
  userId: string,
  desde: string,
): Promise<T[]> {
  const { data, error } = await supabase
    .from(nombre)
    .select('*')
    .eq('user_id', userId)
    .gte('fecha', desde)
    .order('fecha', { ascending: false });
  if (error) {
    console.error(`[datos] no se pudo leer ${nombre}`, error.message);
    return [];
  }
  return (data ?? []) as T[];
}

export async function cargarPerfil(
  supabase: SupabaseClient,
  userId: string,
): Promise<Perfil | null> {
  const { data } = await supabase.from('perfiles').select('*').eq('id', userId).maybeSingle();
  return (data as Perfil) ?? null;
}

/** Sesiones en el formato del motor de progresion (para sugerir cargas). */
export async function cargarSesionesMotor(
  supabase: SupabaseClient,
  userId: string,
  desde: string,
): Promise<import('./motor/tipos-motor').Sesion[]> {
  const { data: entrenos } = await supabase
    .from('entrenamientos')
    .select('id, fecha, dia_plan, nombre, completado')
    .eq('user_id', userId)
    .gte('fecha', desde)
    .order('fecha', { ascending: false });

  if (!entrenos?.length) return [];

  const { data: series } = await supabase
    .from('series')
    .select('entrenamiento_id, ejercicio_id, orden, serie, peso_kg, reps, rir, hecha')
    .eq('user_id', userId)
    .in('entrenamiento_id', entrenos.map((e) => e.id));

  return entrenos.map((entreno) => {
    const suyas = (series ?? []).filter((s) => s.entrenamiento_id === entreno.id);
    const porEjercicio = new Map<string, { pesoKg: number | null; reps: number | null; rir: number | null; hecha: boolean }[]>();
    for (const s of suyas.sort((a, b) => a.orden - b.orden || a.serie - b.serie)) {
      const lista = porEjercicio.get(s.ejercicio_id) ?? [];
      lista.push({
        pesoKg: s.peso_kg === null ? null : Number(s.peso_kg),
        reps: s.reps,
        rir: s.rir,
        hecha: s.hecha,
      });
      porEjercicio.set(s.ejercicio_id, lista);
    }
    return {
      id: entreno.id,
      fecha: entreno.fecha,
      diaId: entreno.dia_plan ?? '',
      nombre: entreno.nombre,
      completada: entreno.completado,
      ejercicios: [...porEjercicio.entries()].map(([ejercicioId, series]) => ({ ejercicioId, series })),
    };
  });
}
