'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { CATEGORIAS_OCIO, nuevoToken } from '@/lib/motor/ocio';
import { clienteServidor } from '@/lib/supabase/servidor';

async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  const { data: perfil } = await supabase.from('perfiles').select('zona_horaria').eq('id', data.user.id).maybeSingle();
  return { supabase, userId: data.user.id, hoy: hoyIso((perfil?.zona_horaria as string | null) || undefined) };
}

function refrescar() {
  revalidatePath('/app/ocio');
  revalidatePath('/app');
}

const texto = (valor: FormDataEntryValue | null): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;

const numero = (valor: FormDataEntryValue | null): number | null => {
  const v = texto(valor);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
};

const esCategoria = (v: string | null) => (v && CATEGORIAS_OCIO.some((c) => c.id === v) ? v : 'otros');

/**
 * Apuntar algo. Solo el titulo es obligatorio: si pedimos mas, no se apunta.
 * Todo lo demas se puede rellenar despues, o nunca.
 */
export async function anotarOcio(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const titulo = texto(datos.get('titulo'));
  if (!titulo) return;

  // Se puede apuntar algo ya hecho directamente: "ayer cenamos aqui, muy bueno".
  const yaHecho = datos.get('ya_hecho') === 'si';

  await supabase.from('ocio').insert({
    user_id: userId,
    titulo: titulo.slice(0, 160),
    categoria: esCategoria(texto(datos.get('categoria'))),
    estado: yaHecho ? 'hecho' : 'pendiente',
    fecha_hecho: yaHecho ? hoy : null,
    enlace: texto(datos.get('enlace'))?.slice(0, 500) ?? null,
    nota: texto(datos.get('nota'))?.slice(0, 500) ?? null,
    lugar: texto(datos.get('lugar'))?.slice(0, 120) ?? null,
    con_quien: texto(datos.get('con_quien'))?.slice(0, 120) ?? null,
    minutos: numero(datos.get('minutos')),
  });
  refrescar();
}

/** Hecho, a un toque. La valoracion y la nota vienen despues si apetece. */
export async function marcarHecho(id: string) {
  const { supabase, userId, hoy } = await sesion();
  await supabase
    .from('ocio')
    .update({ estado: 'hecho', fecha_hecho: hoy })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

export async function devolverAPendiente(id: string) {
  const { supabase, userId } = await sesion();
  await supabase
    .from('ocio')
    .update({ estado: 'pendiente', fecha_hecho: null, valoracion: null })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

/** Que te parecio, una vez hecho. Es lo que convierte la lista en memoria. */
export async function valorarOcio(id: string, datos: FormData) {
  const { supabase, userId } = await sesion();
  const valor = numero(datos.get('valoracion'));
  await supabase
    .from('ocio')
    .update({
      valoracion: valor !== null ? Math.max(1, Math.min(5, valor)) : null,
      nota: texto(datos.get('nota'))?.slice(0, 500) ?? null,
      con_quien: texto(datos.get('con_quien'))?.slice(0, 120) ?? null,
    })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

/** Descartar sin borrar: ya no te apetece, pero no hace falta perder el rastro. */
export async function descartarOcio(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('ocio').update({ estado: 'descartado' }).eq('id', id).eq('user_id', userId);
  refrescar();
}

export async function borrarOcio(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('ocio').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}

// ── Compartir ─────────────────────────────────────────────────────────

/**
 * Crea (o rehace) el enlace publico. Solo hay uno activo a la vez: dos
 * enlaces vivos son dos cosas que revocar y una que se te olvida.
 */
export async function compartirOcio(datos: FormData) {
  const { supabase, userId } = await sesion();

  const categorias = CATEGORIAS_OCIO.map((c) => c.id).filter((id) => datos.get(`cat_${id}`) === 'si');

  // El anterior se desactiva: el enlace viejo deja de funcionar al momento.
  await supabase.from('ocio_compartidos').update({ activo: false }).eq('user_id', userId).eq('activo', true);

  await supabase.from('ocio_compartidos').insert({
    user_id: userId,
    token: nuevoToken(),
    titulo: texto(datos.get('titulo_lista'))?.slice(0, 80) ?? 'Mi lista',
    categorias,
    solo_pendientes: datos.get('solo_pendientes') === 'si',
    incluye_notas: datos.get('incluye_notas') === 'si',
    activo: true,
  });
  refrescar();
}

/** Dejar de compartir. El enlace deja de servir en el momento. */
export async function dejarDeCompartir() {
  const { supabase, userId } = await sesion();
  await supabase.from('ocio_compartidos').update({ activo: false }).eq('user_id', userId).eq('activo', true);
  refrescar();
}
