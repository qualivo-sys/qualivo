'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { hoy as hoyIso } from '@/lib/fechas';
import { CATEGORIAS } from '@/lib/motor/finanzas';
import { XP_POR_ACCION } from '@/lib/motor/puntuaciones';
import { clienteServidor } from '@/lib/supabase/servidor';

async function sesion() {
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect('/entrar');
  const { data: perfil } = await supabase.from('perfiles').select('zona_horaria').eq('id', data.user.id).maybeSingle();
  return { supabase, userId: data.user.id, hoy: hoyIso((perfil?.zona_horaria as string | null) || undefined) };
}

/** Importe en euros: acepta "18", "18,50" y "18.50". */
const importe = (valor: FormDataEntryValue | null): number | null => {
  if (typeof valor !== 'string' || !valor.trim()) return null;
  const n = Number(valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
  return Number.isFinite(n) ? Math.round(Math.abs(n) * 100) / 100 : null;
};
const texto = (valor: FormDataEntryValue | null): string | null =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : null;
const esCategoria = (v: string | null) => (v && CATEGORIAS.some((c) => c.id === v) ? v : 'otros');
const esAmbito = (v: string | null) => (v === 'empresa' ? 'empresa' : 'personal');

function refrescar() {
  revalidatePath('/app/finanzas');
  revalidatePath('/app');
}

/** Alta del modulo: caja actual y, si quiere, objetivos. */
export async function activarFinanzas(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  await supabase.from('finanzas_ajustes').upsert({
    user_id: userId,
    caja_inicial: importe(datos.get('caja_inicial')) ?? 0,
    caja_fecha: hoy,
    ahorro_mes: importe(datos.get('ahorro_mes')),
    caja_minima: importe(datos.get('caja_minima')),
    activo: true,
    actualizado: new Date().toISOString(),
  });
  refrescar();
  redirect('/app/finanzas');
}

export async function guardarAjustesFinanzas(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const caja = importe(datos.get('caja_inicial'));
  await supabase.from('finanzas_ajustes').upsert({
    user_id: userId,
    // Corregir la caja es decir "ahora mismo tengo esto": la fecha se pone a hoy.
    ...(caja !== null ? { caja_inicial: caja, caja_fecha: hoy } : {}),
    ahorro_mes: importe(datos.get('ahorro_mes')),
    caja_minima: importe(datos.get('caja_minima')),
    activo: true,
    actualizado: new Date().toISOString(),
  });
  refrescar();
}

export async function guardarIngreso(datos: FormData) {
  const { supabase, userId } = await sesion();
  const nombre = texto(datos.get('nombre'));
  const valor = importe(datos.get('importe'));
  if (!nombre || valor === null) return;
  await supabase.from('finanzas_ingresos').insert({
    user_id: userId,
    nombre: nombre.slice(0, 60),
    importe: valor,
    ambito: esAmbito(texto(datos.get('ambito'))),
  });
  refrescar();
}

export async function borrarIngreso(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_ingresos').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}

export async function guardarPresupuesto(datos: FormData) {
  const { supabase, userId } = await sesion();
  const valor = importe(datos.get('importe'));
  if (valor === null) return;
  await supabase.from('finanzas_presupuestos').upsert(
    { user_id: userId, categoria: esCategoria(texto(datos.get('categoria'))), importe: valor, activo: true },
    { onConflict: 'user_id,categoria' },
  );
  refrescar();
}

export async function borrarPresupuesto(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_presupuestos').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}

/** El registro del dia a dia: importe, categoria y poco mas. */
export async function registrarMovimiento(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const valor = importe(datos.get('importe'));
  if (valor === null || valor === 0) return;

  const fecha = texto(datos.get('fecha'));
  await supabase.from('finanzas_movimientos').insert({
    user_id: userId,
    fecha: fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha) && fecha <= hoy ? fecha : hoy,
    tipo: texto(datos.get('tipo')) === 'ingreso' ? 'ingreso' : 'gasto',
    importe: valor,
    categoria: esCategoria(texto(datos.get('categoria'))),
    descripcion: texto(datos.get('descripcion'))?.slice(0, 200) ?? null,
    ambito: esAmbito(texto(datos.get('ambito'))),
    impulsivo: datos.get('impulsivo') === 'on' || datos.get('impulsivo') === 'true',
    sobre_id: texto(datos.get('sobre_id')) || null,
    fuente: 'manual',
  });
  await supabase.from('xp_eventos').insert({
    user_id: userId,
    fecha: hoy,
    tipo: 'gasto',
    xp: XP_POR_ACCION.gasto ?? 3,
    motivo: 'movimiento registrado',
  });
  refrescar();
}

/**
 * Corregir un apunte ya hecho. Casi siempre es la categoria: apuntas rapido
 * "18 €" desde el movil y luego ves que aquello no era restaurantes. Si no se
 * puede arreglar, el presupuesto deja de decir la verdad y se abandona.
 *
 * Solo se toca lo que venga en el formulario; lo demas se queda como estaba.
 */
export async function editarMovimiento(id: string, datos: FormData) {
  const { supabase, userId, hoy } = await sesion();

  const { data: previo } = await supabase
    .from('finanzas_movimientos').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
  if (!previo) return;

  const valor = importe(datos.get('importe'));
  const fecha = texto(datos.get('fecha'));
  const cat = texto(datos.get('categoria'));

  await supabase
    .from('finanzas_movimientos')
    .update({
      ...(valor !== null && valor !== 0 ? { importe: valor } : {}),
      ...(fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha) && fecha <= hoy ? { fecha } : {}),
      ...(cat ? { categoria: esCategoria(cat) } : {}),
      descripcion: texto(datos.get('descripcion'))?.slice(0, 200) ?? null,
      ambito: esAmbito(texto(datos.get('ambito'))),
      impulsivo: datos.get('impulsivo') === 'on' || datos.get('impulsivo') === 'true',
      // "" es "que vuelva al dia a dia", que no es lo mismo que no tocarlo.
      sobre_id: texto(datos.get('sobre_id')) || null,
    })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

export async function borrarMovimiento(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_movimientos').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}

/** Marcar o desmarcar un gasto como impulsivo desde la lista. */
export async function alternarImpulsivo(id: string, impulsivo: boolean) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_movimientos').update({ impulsivo }).eq('id', id).eq('user_id', userId);
  refrescar();
}

/**
 * Un sobre: presupuesto con nombre propio para algo concreto (un finde, una
 * escapada, un evento). Lo que se gaste ahi no come el presupuesto mensual.
 */
export async function crearSobre(datos: FormData) {
  const { supabase, userId } = await sesion();
  const nombre = texto(datos.get('nombre'));
  const valor = importe(datos.get('importe'));
  if (!nombre || valor === null) return;

  const fecha = (clave: string) => {
    const v = texto(datos.get(clave));
    return v && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
  };
  await supabase.from('finanzas_sobres').insert({
    user_id: userId,
    nombre: nombre.slice(0, 80),
    importe: valor,
    emoji: texto(datos.get('emoji'))?.slice(0, 4) ?? null,
    desde: fecha('desde'),
    hasta: fecha('hasta'),
  });
  refrescar();
}

export async function cerrarSobre(id: string, cerrado: boolean) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_sobres').update({ cerrado }).eq('id', id).eq('user_id', userId);
  refrescar();
}

/** Al borrar el sobre, sus gastos se quedan: vuelven al dia a dia. */
export async function borrarSobre(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_sobres').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}
