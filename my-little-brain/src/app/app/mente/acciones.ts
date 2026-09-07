'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { EMOCIONES, TEMAS, temaDe } from '@/lib/motor/emociones';
import { XP_POR_ACCION } from '@/lib/motor/puntuaciones';
import { clienteServidor } from '@/lib/supabase/servidor';

async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  const { data: perfil } = await supabase.from('perfiles').select('zona_horaria').eq('id', data.user.id).maybeSingle();
  return { supabase, userId: data.user.id, hoy: hoyIso((perfil?.zona_horaria as string | null) || undefined) };
}

const texto = (valor: FormDataEntryValue | null): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;
const escala = (valor: FormDataEntryValue | null): number | null => {
  const n = Number(valor);
  return Number.isFinite(n) && n >= 1 && n <= 10 ? Math.round(n) : null;
};

function refrescar() {
  revalidatePath('/app/mente');
  revalidatePath('/app');
  revalidatePath('/app/semana');
}

/** Como te has sentido hoy: escalas y hasta tres emociones. */
export async function guardarEstadoEmocional(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const fecha = texto(datos.get('fecha')) ?? hoy;
  const emociones = (texto(datos.get('emociones')) ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter((e) => EMOCIONES.some((x) => x.id === e))
    .slice(0, 3);

  const { data: previo } = await supabase
    .from('bienestar').select('*').eq('user_id', userId).eq('fecha', fecha).maybeSingle();

  await supabase.from('bienestar').upsert(
    {
      ...(previo ?? {}),
      user_id: userId,
      fecha,
      animo: escala(datos.get('animo')) ?? previo?.animo ?? null,
      energia: escala(datos.get('energia')) ?? previo?.energia ?? null,
      estres: escala(datos.get('estres')) ?? previo?.estres ?? null,
      emociones,
    },
    { onConflict: 'user_id,fecha' },
  );
  if (!previo) {
    await supabase.from('xp_eventos').insert({ user_id: userId, fecha, tipo: 'checkin', xp: XP_POR_ACCION.checkin ?? 10, motivo: 'estado emocional' });
  }
  refrescar();
}

/** El diario guiado del dia: cinco preguntas, ninguna obligatoria. */
export async function guardarDiario(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const fecha = texto(datos.get('fecha')) ?? hoy;
  const campos = {
    bien: texto(datos.get('bien')),
    preocupa: texto(datos.get('preocupa')),
    controlo: texto(datos.get('controlo')),
    aprendido: texto(datos.get('aprendido')),
    agradecido: texto(datos.get('agradecido')),
  };
  if (Object.values(campos).every((v) => v === null)) return;

  const { data: previo } = await supabase
    .from('diario').select('id').eq('user_id', userId).eq('fecha', fecha).maybeSingle();

  await supabase.from('diario').upsert(
    { user_id: userId, fecha, ...campos, actualizado: new Date().toISOString() },
    { onConflict: 'user_id,fecha' },
  );

  // Cada preocupacion escrita se posa en el estanque como una hoja.
  if (campos.preocupa) {
    const lineas = campos.preocupa.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 5);
    const { data: abiertas } = await supabase
      .from('hojas').select('texto').eq('user_id', userId).is('cerrada', null);
    const yaEstan = new Set((abiertas ?? []).map((h) => (h.texto as string).toLowerCase()));
    const nuevas = lineas.filter((l) => !yaEstan.has(l.toLowerCase()));
    if (nuevas.length) {
      await supabase.from('hojas').insert(
        nuevas.map((l) => ({ user_id: userId, texto: l.slice(0, 160), tema: temaDe(l), creada: fecha })),
      );
    }
  }

  if (!previo) {
    await supabase.from('xp_eventos').insert({ user_id: userId, fecha, tipo: 'diario', xp: XP_POR_ACCION.diario ?? 10, motivo: 'diario' });
  }
  refrescar();
}

/** Una hoja nueva sobre el estanque, escrita a mano. */
export async function anadirHoja(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const contenido = texto(datos.get('texto'));
  if (!contenido) return;
  const elegido = texto(datos.get('tema'));
  await supabase.from('hojas').insert({
    user_id: userId,
    texto: contenido.slice(0, 160),
    tema: elegido && TEMAS.some((t) => t.id === elegido) ? elegido : temaDe(contenido),
    creada: hoy,
  });
  refrescar();
}

/** "¿Esta hoja sigue en el estanque?" No: se retira y se apunta que ayudo. */
export async function retirarHoja(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const id = texto(datos.get('id'));
  if (!id) return;
  await supabase
    .from('hojas')
    .update({ cerrada: hoy, accion: texto(datos.get('accion'))?.slice(0, 200) ?? null })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

/** Vuelve a estar ahi: la hoja regresa al estanque. */
export async function devolverHoja(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('hojas').update({ cerrada: null, accion: null }).eq('id', id).eq('user_id', userId);
  refrescar();
}

export async function borrarHoja(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('hojas').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}
