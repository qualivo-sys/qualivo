'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { AGUA_MAX_ML, horasDeSueno } from '@/lib/motor/descanso';
import { clienteServidor } from '@/lib/supabase/servidor';

async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  const { data: perfil } = await supabase.from('perfiles').select('zona_horaria').eq('id', data.user.id).maybeSingle();
  return { supabase, userId: data.user.id, hoy: hoyIso((perfil?.zona_horaria as string | null) || undefined) };
}

function refrescar() {
  revalidatePath('/app/descanso');
  revalidatePath('/app');
}

const texto = (valor: FormDataEntryValue | null): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;

/** "23:30" o "23:30:00"; cualquier otra cosa se descarta en vez de romper. */
const hora = (valor: FormDataEntryValue | null): string | null => {
  const v = texto(valor);
  return v && /^\d{1,2}:\d{2}(:\d{2})?$/.test(v) ? v.slice(0, 5) : null;
};

const escala = (valor: FormDataEntryValue | null): number | null => {
  const v = texto(valor);
  if (v === null) return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= 1 && n <= 10 ? n : null;
};

/**
 * Suma (o resta) agua al dia. Es la accion que mas se va a usar de toda la
 * app, asi que no pide nada: un toque y ya. El total se recalcula en el
 * servidor a partir de lo que hay guardado para que dos toques seguidos
 * desde el movil no se pisen.
 */
export async function sumarAgua(ml: number) {
  const { supabase, userId, hoy } = await sesion();
  if (!Number.isFinite(ml) || ml === 0) return;

  const { data: previo } = await supabase
    .from('bienestar').select('agua_ml').eq('user_id', userId).eq('fecha', hoy).maybeSingle();

  const total = Math.max(0, Math.min(AGUA_MAX_ML, (previo?.agua_ml ?? 0) + Math.round(ml)));
  await supabase.from('bienestar').upsert(
    { user_id: userId, fecha: hoy, agua_ml: total },
    { onConflict: 'user_id,fecha' },
  );
  refrescar();
}

/**
 * Anoche. Si nos dan las dos horas calculamos nosotros las horas dormidas:
 * es mas facil acordarse de "me acoste a las 12 y me levante a las 7" que
 * hacer la resta a las siete de la manana.
 */
export async function guardarSueno(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const inicio = hora(datos.get('sueno_inicio'));
  const fin = hora(datos.get('sueno_fin'));
  const calculadas = horasDeSueno(inicio, fin);

  const manual = texto(datos.get('sueno_horas'));
  const horasManual = manual !== null && Number.isFinite(Number(manual.replace(',', '.')))
    ? Math.round(Number(manual.replace(',', '.')) * 10) / 10
    : null;
  const horas = calculadas ?? (horasManual !== null && horasManual > 0 && horasManual <= 14 ? horasManual : null);

  const { data: previo } = await supabase
    .from('bienestar').select('*').eq('user_id', userId).eq('fecha', hoy).maybeSingle();

  await supabase.from('bienestar').upsert(
    {
      user_id: userId,
      fecha: hoy,
      sueno_inicio: inicio ?? previo?.sueno_inicio ?? null,
      sueno_fin: fin ?? previo?.sueno_fin ?? null,
      sueno_horas: horas ?? previo?.sueno_horas ?? null,
      sueno_calidad: escala(datos.get('sueno_calidad')) ?? previo?.sueno_calidad ?? null,
    },
    { onConflict: 'user_id,fecha' },
  );
  refrescar();
}

/** El cafe: cuantos y a que hora fue el ultimo, que es lo que importa. */
export async function guardarCafe(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const n = Number(texto(datos.get('cafes')) ?? '');
  const cafes = Number.isFinite(n) ? Math.max(0, Math.min(12, Math.round(n))) : 0;

  await supabase.from('bienestar').upsert(
    {
      user_id: userId,
      fecha: hoy,
      cafes,
      cafeina_ultima: cafes > 0 ? hora(datos.get('cafeina_ultima')) : null,
    },
    { onConflict: 'user_id,fecha' },
  );
  refrescar();
}

/**
 * El horario que quieres tener. No es un dato del dia: es la referencia con
 * la que la app compara lo que haces de verdad.
 */
export async function guardarHorarioObjetivo(datos: FormData) {
  const { supabase, userId } = await sesion();
  const dormir = hora(datos.get('hora_dormir'));
  const despertar = hora(datos.get('hora_despertar'));
  if (!dormir && !despertar) return;
  await supabase.from('perfiles').update({
    ...(dormir ? { hora_dormir: dormir } : {}),
    ...(despertar ? { hora_despertar: despertar } : {}),
  }).eq('id', userId);
  refrescar();
}
