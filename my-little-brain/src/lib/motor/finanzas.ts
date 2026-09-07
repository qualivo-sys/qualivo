/**
 * Control de caja, no contabilidad. La pregunta que responde este modulo no es
 * "cuanto he gastado exactamente", es "¿voy por encima o por debajo de lo que
 * decidi gastar, y ese dinero me acerca a lo que quiero?".
 */
import type { FinanzasAjustes, IngresoPrevisto, Movimiento, Presupuesto } from '../tipos';

export interface Categoria {
  id: string;
  nombre: string;
  emoji: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: 'alimentacion', nombre: 'Alimentacion', emoji: '🛒' },
  { id: 'restaurantes', nombre: 'Restaurantes', emoji: '🍽️' },
  { id: 'ocio', nombre: 'Alcohol y ocio', emoji: '🍻' },
  { id: 'vivienda', nombre: 'Vivienda', emoji: '🏠' },
  { id: 'transporte', nombre: 'Transporte', emoji: '🚗' },
  { id: 'suscripciones', nombre: 'Suscripciones', emoji: '📺' },
  { id: 'formacion', nombre: 'Formacion', emoji: '📚' },
  { id: 'deporte', nombre: 'Deporte', emoji: '🏋️' },
  { id: 'salud', nombre: 'Salud', emoji: '⚕️' },
  { id: 'otros', nombre: 'Otros', emoji: '📦' },
];

export function categoria(id: string): Categoria {
  return CATEGORIAS.find((c) => c.id === id) ?? { id, nombre: id, emoji: '📦' };
}

/** Categorias que suelen acercar a los objetivos, no alejar: se leen distinto. */
const INVERSION = new Set(['formacion', 'deporte', 'salud']);

export const mesDe = (fecha: string): string => fecha.slice(0, 7);

export function diasDelMes(mes: string): number {
  const [anio, m] = mes.split('-').map(Number);
  return new Date(anio, m, 0).getDate();
}

export function mesAnteriorA(mes: string): string {
  const [anio, m] = mes.split('-').map(Number);
  const d = new Date(anio, m - 2, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function nombreMes(mes: string): string {
  const [anio, m] = mes.split('-').map(Number);
  return new Date(anio, m - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

export type EstadoCategoria = 'bien' | 'cerca' | 'pasado';

export interface LineaCategoria {
  id: string;
  nombre: string;
  emoji: string;
  presupuesto: number;
  gastado: number;
  disponible: number;
  /** Porcentaje del presupuesto consumido (puede pasar de 100). */
  pct: number;
  estado: EstadoCategoria;
  /** Va mas rapido de lo que le tocaria a estas alturas del mes. */
  ritmoAlto: boolean;
  impulsivo: number;
  inversion: boolean;
}

export interface ResumenFinanzas {
  mes: string;
  /** Dinero que hay ahora: la caja conocida mas lo movido desde entonces. */
  caja: number;
  gastos: number;
  ingresos: number;
  neto: number;
  ingresosPrevistos: number;
  presupuestoTotal: number;
  /** Gasto estimado a fin de mes si sigue este ritmo. */
  proyeccion: number;
  /** Porcentaje de categorias con presupuesto que no se han pasado. */
  cumplimiento: number | null;
  categorias: LineaCategoria[];
  /** Categorias sin presupuesto en las que si hay gasto. */
  sinPresupuesto: { id: string; nombre: string; emoji: string; gastado: number }[];
  gastoImpulsivo: number;
  diaDelMes: number;
  dias: number;
}

const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0);

export function resumenFinanzas(datos: {
  movimientos: Movimiento[];
  presupuestos: Presupuesto[];
  ingresosPrevistos: IngresoPrevisto[];
  ajustes: FinanzasAjustes | null;
  hoy: string;
  mes?: string;
}): ResumenFinanzas {
  const mes = datos.mes ?? mesDe(datos.hoy);
  const delMes = datos.movimientos.filter((m) => mesDe(m.fecha) === mes);
  const gastosMes = delMes.filter((m) => m.tipo === 'gasto');
  const gastos = suma(gastosMes.map((m) => num(m.importe)));
  const ingresos = suma(delMes.filter((m) => m.tipo === 'ingreso').map((m) => num(m.importe)));

  // Caja: lo que habia el dia que lo dijo, mas todo lo movido desde entonces.
  const desde = datos.ajustes?.caja_fecha ?? mes + '-01';
  const posteriores = datos.movimientos.filter((m) => m.fecha >= desde && m.fecha <= datos.hoy);
  const caja =
    num(datos.ajustes?.caja_inicial ?? 0) +
    suma(posteriores.filter((m) => m.tipo === 'ingreso').map((m) => num(m.importe))) -
    suma(posteriores.filter((m) => m.tipo === 'gasto').map((m) => num(m.importe)));

  const dias = diasDelMes(mes);
  const diaDelMes = mes === mesDe(datos.hoy) ? Number(datos.hoy.slice(8, 10)) : dias;
  const parteDelMes = diaDelMes / dias;

  const activos = datos.presupuestos.filter((p) => p.activo !== false);
  const categorias: LineaCategoria[] = activos
    .map((p) => {
      const info = categoria(p.categoria);
      const suyos = gastosMes.filter((m) => m.categoria === p.categoria);
      const gastado = Math.round(suma(suyos.map((m) => num(m.importe))) * 100) / 100;
      const presupuesto = num(p.importe);
      const pct = presupuesto > 0 ? Math.round((gastado / presupuesto) * 100) : 0;
      const estado: EstadoCategoria = gastado > presupuesto ? 'pasado' : pct >= 80 ? 'cerca' : 'bien';
      return {
        id: p.categoria,
        nombre: info.nombre,
        emoji: info.emoji,
        presupuesto,
        gastado,
        disponible: Math.round((presupuesto - gastado) * 100) / 100,
        pct,
        estado,
        // A dia 10 de 30 no deberia llevar gastado mucho mas de un tercio.
        ritmoAlto: estado !== 'pasado' && presupuesto > 0 && gastado > presupuesto * parteDelMes * 1.25,
        impulsivo: Math.round(suma(suyos.filter((m) => m.impulsivo).map((m) => num(m.importe))) * 100) / 100,
        inversion: INVERSION.has(p.categoria),
      };
    })
    .sort((a, b) => b.pct - a.pct);

  const conPresupuesto = new Set(activos.map((p) => p.categoria));
  const sinPresupuesto = [...new Set(gastosMes.map((m) => m.categoria))]
    .filter((id) => !conPresupuesto.has(id))
    .map((id) => ({
      ...categoria(id),
      gastado: Math.round(suma(gastosMes.filter((m) => m.categoria === id).map((m) => num(m.importe))) * 100) / 100,
    }))
    .filter((c) => c.gastado > 0)
    .sort((a, b) => b.gastado - a.gastado);

  const presupuestoTotal = suma(activos.map((p) => num(p.importe)));
  return {
    mes,
    caja: Math.round(caja * 100) / 100,
    gastos: Math.round(gastos * 100) / 100,
    ingresos: Math.round(ingresos * 100) / 100,
    neto: Math.round((ingresos - gastos) * 100) / 100,
    ingresosPrevistos: suma(datos.ingresosPrevistos.filter((i) => i.activo !== false).map((i) => num(i.importe))),
    presupuestoTotal,
    proyeccion: diaDelMes > 0 ? Math.round((gastos / diaDelMes) * dias) : 0,
    cumplimiento: categorias.length
      ? Math.round((categorias.filter((c) => c.estado !== 'pasado').length / categorias.length) * 100)
      : null,
    categorias,
    sinPresupuesto,
    gastoImpulsivo: Math.round(suma(gastosMes.filter((m) => m.impulsivo).map((m) => num(m.importe))) * 100) / 100,
    diaDelMes,
    dias,
  };
}

export interface Insight {
  tono: 'bien' | 'aviso' | 'alerta' | 'info';
  texto: string;
}

const eur = (n: number) => `${Math.round(Math.abs(n)).toLocaleString('es-ES')} €`;

/**
 * Lo que diria alguien que mira tus numeros y quiere ayudarte, no juzgarte:
 * donde te has desviado, que has mejorado y como vas a acabar el mes.
 */
export function insightsFinanzas(
  actual: ResumenFinanzas,
  anterior: ResumenFinanzas | null,
  ajustes: FinanzasAjustes | null,
): Insight[] {
  const salida: Insight[] = [];

  const pasadas = actual.categorias.filter((c) => c.estado === 'pasado').sort((a, b) => (b.gastado - b.presupuesto) - (a.gastado - a.presupuesto));
  if (pasadas.length) {
    const peor = pasadas[0];
    salida.push({
      tono: peor.inversion ? 'info' : 'alerta',
      texto: peor.inversion
        ? `Has puesto ${eur(peor.gastado - peor.presupuesto)} mas de lo previsto en ${peor.nombre.toLowerCase()}. Si era lo que querias, bien gastado.`
        : `Este mes has gastado ${eur(peor.gastado - peor.presupuesto)} mas de lo previsto en ${peor.nombre.toLowerCase()}.`,
    });
  }

  const rapidas = actual.categorias.filter((c) => c.ritmoAlto);
  if (rapidas.length && actual.diaDelMes < actual.dias) {
    salida.push({
      tono: 'aviso',
      texto: `Vas rapido en ${rapidas.map((c) => c.nombre.toLowerCase()).join(' y ')}: llevas ${rapidas[0].pct} % del presupuesto y el mes va por el ${Math.round((actual.diaDelMes / actual.dias) * 100)} %.`,
    });
  }

  if (anterior) {
    for (const c of actual.categorias) {
      const antes = anterior.categorias.find((x) => x.id === c.id);
      if (!antes || antes.gastado < 40) continue;
      const cambio = Math.round(((c.gastado - antes.gastado) / antes.gastado) * 100);
      if (cambio <= -20 && actual.diaDelMes >= actual.dias - 2) {
        salida.push({ tono: 'bien', texto: `Has reducido un ${Math.abs(cambio)} % el gasto en ${c.nombre.toLowerCase()} respecto al mes pasado.` });
        break;
      }
    }
  }

  if (actual.presupuestoTotal > 0 && actual.diaDelMes >= 5 && actual.diaDelMes < actual.dias) {
    const diferencia = actual.proyeccion - actual.presupuestoTotal;
    // Si la proyeccion cuadra con el presupuesto no hay nada que decir.
    if (Math.abs(diferencia) >= 20) salida.push({
      tono: diferencia > 0 ? 'aviso' : 'bien',
      texto: diferencia > 0
        ? `Si mantienes este ritmo terminaras el mes ${eur(diferencia)} por encima del presupuesto.`
        : `Si mantienes este ritmo terminaras el mes ${eur(diferencia)} por debajo del presupuesto.`,
    });
  }

  if (actual.gastoImpulsivo > 0 && actual.gastos > 0) {
    const pct = Math.round((actual.gastoImpulsivo / actual.gastos) * 100);
    if (pct >= 15) {
      salida.push({ tono: 'aviso', texto: `${eur(actual.gastoImpulsivo)} de lo que llevas gastado (${pct} %) lo marcaste como impulsivo. Ahi esta el margen mas facil.` });
    }
  }

  const objetivoAhorro = ajustes?.ahorro_mes ? num(ajustes.ahorro_mes) : null;
  if (objetivoAhorro && actual.ingresos > 0) {
    salida.push({
      tono: actual.neto >= objetivoAhorro ? 'bien' : 'aviso',
      texto: actual.neto >= objetivoAhorro
        ? `Llevas ${eur(actual.neto)} de margen este mes; tu objetivo era ahorrar ${eur(objetivoAhorro)}.`
        : `Llevas ${eur(actual.neto)} de margen y el objetivo era ${eur(objetivoAhorro)}. Te faltan ${eur(objetivoAhorro - actual.neto)}.`,
    });
  }

  const minima = ajustes?.caja_minima ? num(ajustes.caja_minima) : null;
  if (minima && actual.caja < minima) {
    salida.push({ tono: 'alerta', texto: `Tu caja (${eur(actual.caja)}) esta por debajo del minimo que fijaste (${eur(minima)}).` });
  }

  if (!salida.length && actual.gastos > 0) {
    salida.push({ tono: 'bien', texto: 'Vas dentro de todo lo que te marcaste. Nada que corregir.' });
  }
  // Lo urgente primero: quedarse sin caja importa mas que una desviacion pequena.
  const orden = { alerta: 0, aviso: 1, bien: 2, info: 3 };
  return [...salida].sort((a, b) => orden[a.tono] - orden[b.tono]).slice(0, 4);
}

/** Las cinco preguntas del viernes, con las que puede contestar la app. */
export interface RevisionSemanalFinanzas {
  gastado: number;
  categoriaTop: { nombre: string; gastado: number } | null;
  impulsivo: number;
  dentroDePresupuesto: boolean | null;
  sugerencia: string;
}

export function revisionSemana(
  movimientos: Movimiento[],
  resumen: ResumenFinanzas,
  desde: string,
  hasta: string,
): RevisionSemanalFinanzas {
  const semana = movimientos.filter((m) => m.tipo === 'gasto' && m.fecha >= desde && m.fecha <= hasta);
  const gastado = Math.round(suma(semana.map((m) => num(m.importe))) * 100) / 100;
  const porCategoria = [...new Set(semana.map((m) => m.categoria))]
    .map((id) => ({ nombre: categoria(id).nombre, gastado: suma(semana.filter((m) => m.categoria === id).map((m) => num(m.importe))) }))
    .sort((a, b) => b.gastado - a.gastado);
  const impulsivo = Math.round(suma(semana.filter((m) => m.impulsivo).map((m) => num(m.importe))) * 100) / 100;
  const pasadas = resumen.categorias.filter((c) => c.estado === 'pasado');

  const sugerencia = pasadas.length
    ? `Baja el ritmo en ${pasadas[0].nombre.toLowerCase()}: es donde te has salido.`
    : impulsivo > gastado * 0.25
      ? 'Antes de cada gasto de ocio, esperate a mañana: la mitad de los impulsos se caen solos.'
      : gastado === 0
        ? 'Semana sin gastos apuntados. Apunta aunque sea a bulto: sin datos no hay control.'
        : 'Vas bien. Manten el mismo criterio la semana que viene.';

  return {
    gastado,
    categoriaTop: porCategoria[0] ?? null,
    impulsivo,
    dentroDePresupuesto: resumen.categorias.length ? pasadas.length === 0 : null,
    sugerencia,
  };
}
