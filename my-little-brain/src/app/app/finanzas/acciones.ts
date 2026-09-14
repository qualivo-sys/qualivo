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
      // Igual con la deuda: desatarlo tiene que ser posible, no solo atarlo.
      deuda_id: texto(datos.get('deuda_id')) || null,
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

// ── Cajas: donde vive el dinero ────────────────────────────────────────

const esTipoCuenta = (v: string | null) =>
  v && ['corriente', 'ahorro', 'efectivo', 'inversion', 'otro'].includes(v) ? v : 'corriente';

export async function crearCuenta(datos: FormData) {
  const { supabase, userId } = await sesion();
  const nombre = texto(datos.get('nombre'));
  if (!nombre) return;
  const { count } = await supabase
    .from('finanzas_cuentas').select('id', { count: 'exact', head: true }).eq('user_id', userId);
  await supabase.from('finanzas_cuentas').insert({
    user_id: userId,
    nombre: nombre.slice(0, 60),
    tipo: esTipoCuenta(texto(datos.get('tipo'))),
    saldo: importe(datos.get('saldo')) ?? 0,
    // Ahorro e inversion se marcan solas: es lo que la gente espera.
    ahorro: datos.get('ahorro') === 'on' || ['ahorro', 'inversion'].includes(esTipoCuenta(texto(datos.get('tipo')))),
    ambito: esAmbito(texto(datos.get('ambito'))),
    orden: count ?? 0,
  });
  refrescar();
}

/**
 * Poner al dia TODOS los saldos de una vez, no uno a uno.
 *
 * Los saldos son una foto a una fecha: si actualizas uno solo, los demas se
 * quedan en la foto vieja y los apuntes de por medio se cuentan mal. Por eso
 * el formulario manda todas las cuentas juntas y se sella la fecha de hoy.
 */
export async function actualizarSaldos(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const { data: cuentas } = await supabase
    .from('finanzas_cuentas').select('id').eq('user_id', userId);
  if (!cuentas?.length) return;

  for (const c of cuentas) {
    const valor = importe(datos.get(`saldo_${c.id}`));
    if (valor === null) continue;
    await supabase.from('finanzas_cuentas').update({ saldo: valor }).eq('id', c.id).eq('user_id', userId);
  }
  // La foto entera pasa a ser de hoy, a esta hora: a partir de aqui se suman
  // los apuntes nuevos, y lo que ya habias apuntado se queda dentro del saldo.
  await supabase.from('finanzas_ajustes').upsert({
    user_id: userId,
    caja_fecha: hoy,
    activo: true,
    actualizado: new Date().toISOString(),
  });
  refrescar();
}

export async function editarCuenta(id: string, datos: FormData) {
  const { supabase, userId } = await sesion();
  const nombre = texto(datos.get('nombre'));
  await supabase
    .from('finanzas_cuentas')
    .update({
      ...(nombre ? { nombre: nombre.slice(0, 60) } : {}),
      tipo: esTipoCuenta(texto(datos.get('tipo'))),
      ahorro: datos.get('ahorro') === 'on',
      ambito: esAmbito(texto(datos.get('ambito'))),
    })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

export async function borrarCuenta(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_cuentas').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}

// ── Deudas y prestamos ─────────────────────────────────────────────────

const esTipoDeuda = (v: string | null) =>
  v && ['prestamo', 'hipoteca', 'tarjeta', 'financiacion', 'personal', 'otro'].includes(v) ? v : 'prestamo';

/** TAE como numero: acepta "5,9", "5.9" y "5,9 %". */
const porcentaje = (valor: FormDataEntryValue | null): number | null => {
  if (typeof valor !== 'string' || !valor.trim()) return null;
  const n = Number(valor.replace(/[^\d,.-]/g, '').replace(',', '.'));
  return Number.isFinite(n) && n >= 0 && n < 1000 ? Math.round(n * 1000) / 1000 : null;
};

export async function crearDeuda(datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const nombre = texto(datos.get('nombre'));
  const pendiente = importe(datos.get('pendiente'));
  if (!nombre || pendiente === null) return;

  const dia = Number(texto(datos.get('dia_cobro')));
  await supabase.from('finanzas_deudas').insert({
    user_id: userId,
    nombre: nombre.slice(0, 80),
    tipo: esTipoDeuda(texto(datos.get('tipo'))),
    pendiente,
    // La foto es de hoy: los pagos que apuntes a partir de ahora la bajan.
    pendiente_fecha: hoy,
    cuota: importe(datos.get('cuota')) ?? 0,
    tae: porcentaje(datos.get('tae')),
    dia_cobro: Number.isInteger(dia) && dia >= 1 && dia <= 31 ? dia : null,
    ambito: esAmbito(texto(datos.get('ambito'))),
    nota: texto(datos.get('nota'))?.slice(0, 200) ?? null,
  });
  refrescar();
}

/**
 * Corregir una deuda. Si toca el pendiente, la foto vuelve a ser de hoy: esta
 * diciendo "ahora mismo debo esto", asi que los pagos viejos ya estan dentro.
 */
export async function editarDeuda(id: string, datos: FormData) {
  const { supabase, userId, hoy } = await sesion();
  const nombre = texto(datos.get('nombre'));
  const pendiente = importe(datos.get('pendiente'));
  const cuota = importe(datos.get('cuota'));
  const dia = Number(texto(datos.get('dia_cobro')));

  await supabase
    .from('finanzas_deudas')
    .update({
      ...(nombre ? { nombre: nombre.slice(0, 80) } : {}),
      tipo: esTipoDeuda(texto(datos.get('tipo'))),
      ...(pendiente !== null ? { pendiente, pendiente_fecha: hoy } : {}),
      ...(cuota !== null ? { cuota } : {}),
      tae: porcentaje(datos.get('tae')),
      dia_cobro: Number.isInteger(dia) && dia >= 1 && dia <= 31 ? dia : null,
      ambito: esAmbito(texto(datos.get('ambito'))),
      nota: texto(datos.get('nota'))?.slice(0, 200) ?? null,
    })
    .eq('id', id)
    .eq('user_id', userId);
  refrescar();
}

export async function cerrarDeuda(id: string, cerrada: boolean) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_deudas').update({ cerrada }).eq('id', id).eq('user_id', userId);
  refrescar();
}

export async function borrarDeuda(id: string) {
  const { supabase, userId } = await sesion();
  await supabase.from('finanzas_deudas').delete().eq('id', id).eq('user_id', userId);
  refrescar();
}

/**
 * Apuntar la cuota de una deuda. Es un gasto normal atado a la deuda, asi que
 * al apuntarlo la deuda baja sola: no hay que editar dos sitios.
 */
export async function pagarCuota(deudaId: string) {
  const { supabase, userId, hoy } = await sesion();
  const { data: deuda } = await supabase
    .from('finanzas_deudas').select('nombre, cuota, ambito').eq('id', deudaId).eq('user_id', userId).maybeSingle();
  if (!deuda || !Number(deuda.cuota)) return;

  await supabase.from('finanzas_movimientos').insert({
    user_id: userId,
    fecha: hoy,
    tipo: 'gasto',
    importe: Number(deuda.cuota),
    categoria: 'vivienda',
    descripcion: `Cuota de ${deuda.nombre}`.slice(0, 200),
    ambito: deuda.ambito,
    impulsivo: false,
    deuda_id: deudaId,
    fuente: 'manual',
  });
  refrescar();
}
