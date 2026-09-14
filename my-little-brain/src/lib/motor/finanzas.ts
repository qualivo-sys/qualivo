/**
 * Control de caja, no contabilidad. La pregunta que responde este modulo no es
 * "cuanto he gastado exactamente", es "¿voy por encima o por debajo de lo que
 * decidi gastar, y ese dinero me acerca a lo que quiero?".
 */
import type {
  AmbitoFinanzas, Cuenta, Deuda, FinanzasAjustes, IngresoPrevisto, Movimiento, Presupuesto, Sobre,
} from '../tipos';

/**
 * Con que dinero estas mirando. El dinero de la empresa no es tuyo para
 * gastartelo: mezclarlo hace que el presupuesto personal mienta, asi que
 * todo se filtra por ambito y por defecto se mira lo personal.
 */
export type Ambito = AmbitoFinanzas | 'todo';

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
  const texto = new Date(anio, m - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
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

export interface LineaSobre {
  id: string;
  nombre: string;
  emoji: string;
  importe: number;
  gastado: number;
  disponible: number;
  pct: number;
  estado: EstadoCategoria;
  cerrado: boolean;
  desde: string | null;
  hasta: string | null;
  /** Dias que quedan si tiene fecha de fin; null si no la tiene o ya paso. */
  diasRestantes: number | null;
  movimientos: number;
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
  /** Falso cuando hay tan pocos apuntes que proyectar seria adivinar. */
  proyeccionFiable: boolean;
  /** Porcentaje de categorias con presupuesto que no se han pasado. */
  cumplimiento: number | null;
  categorias: LineaCategoria[];
  /** Categorias sin presupuesto en las que si hay gasto. */
  sinPresupuesto: { id: string; nombre: string; emoji: string; gastado: number }[];
  /** Presupuestos para algo concreto: un finde, un evento. Van aparte. */
  sobres: LineaSobre[];
  /** Gasto del mes que ha ido a sobres y no al presupuesto del dia a dia. */
  gastoEnSobres: number;
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
  sobres?: Sobre[];
  cuentas?: Cuenta[];
  hoy: string;
  mes?: string;
  /** Con que dinero se mira. Por defecto el personal: es el que te afecta. */
  ambito?: Ambito;
}): ResumenFinanzas {
  const mes = datos.mes ?? mesDe(datos.hoy);
  const ambito = datos.ambito ?? 'personal';
  // Lo de la empresa fuera: si entra, el presupuesto personal deja de decir
  // la verdad en cuanto pasa una factura de tres mil euros por delante.
  const movimientos = datos.movimientos.filter(
    (m) => ambito === 'todo' || (m.ambito ?? 'personal') === ambito,
  );
  const delMes = movimientos.filter((m) => mesDe(m.fecha) === mes);
  const gastosMes = delMes.filter((m) => m.tipo === 'gasto');
  const gastos = suma(gastosMes.map((m) => num(m.importe)));
  const ingresos = suma(delMes.filter((m) => m.tipo === 'ingreso').map((m) => num(m.importe)));

  // Caja: lo que habia el dia que lo dijo, mas todo lo movido desde entonces.
  const desde = datos.ajustes?.caja_fecha ?? mes + '-01';
  // Que apuntes hay que sumar o restar a la foto del saldo.
  //
  // Lo que cuenta es la FECHA del gasto, no cuando lo apuntaste: si el martes
  // miras el banco y pone 3.850, ahi ya esta el cafe del lunes aunque lo
  // apuntes el jueves. Restarlo otra vez seria contarlo dos veces.
  //
  // El unico caso que la fecha no resuelve es el del mismo dia de la foto:
  // el cafe de esa tarde no estaba en el saldo de esa mañana. Para esos se
  // mira la hora: si lo apuntaste despues de tocar el saldo, va fuera.
  const tocado = datos.ajustes?.actualizado ?? null;
  const posteriores = movimientos.filter((m) => {
    if (m.fecha > datos.hoy) return false;
    if (m.fecha > desde) return true;
    if (m.fecha < desde) return false;
    return Boolean(tocado && m.creado && m.creado > tocado);
  });
  // Si ha dicho en que cuentas tiene el dinero, esa es la foto buena; si no,
  // el numero suelto de siempre.
  const conCuentas = (datos.cuentas ?? []).filter((c) => ambito === 'todo' || c.ambito === ambito);
  const partida = conCuentas.length
    ? suma(conCuentas.map((c) => num(c.saldo)))
    : num(datos.ajustes?.caja_inicial ?? 0);
  const caja =
    partida +
    suma(posteriores.filter((m) => m.tipo === 'ingreso').map((m) => num(m.importe))) -
    suma(posteriores.filter((m) => m.tipo === 'gasto').map((m) => num(m.importe)));

  const dias = diasDelMes(mes);
  const diaDelMes = mes === mesDe(datos.hoy) ? Number(datos.hoy.slice(8, 10)) : dias;
  const parteDelMes = diaDelMes / dias;

  const activos = datos.presupuestos.filter((p) => p.activo !== false);
  // Lo que va a un sobre es gasto planificado aparte: no come el presupuesto del dia a dia.
  const gastosDiaADia = gastosMes.filter((m) => !m.sobre_id);
  const categorias: LineaCategoria[] = activos
    .map((p) => {
      const info = categoria(p.categoria);
      const suyos = gastosDiaADia.filter((m) => m.categoria === p.categoria);
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
  const sinPresupuesto = [...new Set(gastosDiaADia.map((m) => m.categoria))]
    .filter((id) => !conPresupuesto.has(id))
    .map((id) => ({
      ...categoria(id),
      gastado: Math.round(suma(gastosDiaADia.filter((m) => m.categoria === id).map((m) => num(m.importe))) * 100) / 100,
    }))
    .filter((c) => c.gastado > 0)
    .sort((a, b) => b.gastado - a.gastado);

  // Un sobre puede cruzar meses (un viaje a caballo entre julio y agosto),
  // asi que se cuenta con todos los movimientos, no solo con los del mes.
  const todosGastos = movimientos.filter((m) => m.tipo === 'gasto');
  const sobres: LineaSobre[] = (datos.sobres ?? []).map((s) => {
    const suyos = todosGastos.filter((m) => m.sobre_id === s.id);
    const gastado = Math.round(suma(suyos.map((m) => num(m.importe))) * 100) / 100;
    const presupuesto = num(s.importe);
    const pct = presupuesto > 0 ? Math.round((gastado / presupuesto) * 100) : 0;
    const restantes = s.hasta
      ? Math.round((new Date(s.hasta + 'T12:00:00').getTime() - new Date(datos.hoy + 'T12:00:00').getTime()) / 86400000)
      : null;
    return {
      id: s.id,
      nombre: s.nombre,
      emoji: s.emoji || '🎯',
      importe: presupuesto,
      gastado,
      disponible: Math.round((presupuesto - gastado) * 100) / 100,
      pct,
      estado: gastado > presupuesto ? 'pasado' : pct >= 80 ? 'cerca' : 'bien',
      cerrado: s.cerrado,
      desde: s.desde,
      hasta: s.hasta,
      diasRestantes: restantes !== null && restantes >= 0 ? restantes : null,
      movimientos: suyos.length,
    };
  });

  const presupuestoTotal = suma(activos.map((p) => num(p.importe)));
  // Proyectar el mes con uno o dos apuntes es adivinar: hacen falta varios dias.
  const diasConGasto = new Set(gastosMes.map((m) => m.fecha)).size;
  return {
    mes,
    caja: Math.round(caja * 100) / 100,
    gastos: Math.round(gastos * 100) / 100,
    ingresos: Math.round(ingresos * 100) / 100,
    neto: Math.round((ingresos - gastos) * 100) / 100,
    ingresosPrevistos: suma(
      datos.ingresosPrevistos
        .filter((i) => i.activo !== false && (ambito === 'todo' || (i.ambito ?? 'personal') === ambito))
        .map((i) => num(i.importe)),
    ),
    presupuestoTotal,
    proyeccion: diaDelMes > 0 ? Math.round((gastos / diaDelMes) * dias) : 0,
    proyeccionFiable: diasConGasto >= 3 && diaDelMes >= 5,
    cumplimiento: categorias.length
      ? Math.round((categorias.filter((c) => c.estado !== 'pasado').length / categorias.length) * 100)
      : null,
    categorias,
    sinPresupuesto,
    sobres,
    gastoEnSobres: Math.round(suma(gastosMes.filter((m) => m.sobre_id).map((m) => num(m.importe))) * 100) / 100,
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

  if (actual.presupuestoTotal > 0 && actual.proyeccionFiable && actual.diaDelMes < actual.dias) {
    const diferencia = actual.proyeccion - actual.presupuestoTotal;
    // Si la proyeccion cuadra con el presupuesto no hay nada que decir.
    if (Math.abs(diferencia) >= 20) salida.push({
      tono: diferencia > 0 ? 'aviso' : 'bien',
      texto: diferencia > 0
        ? `Si mantienes este ritmo terminaras el mes ${eur(diferencia)} por encima del presupuesto.`
        : `Si mantienes este ritmo terminaras el mes ${eur(diferencia)} por debajo del presupuesto.`,
    });
  }

  if (actual.gastoImpulsivo > 0 && actual.gastos >= 60) {
    const pct = Math.round((actual.gastoImpulsivo / actual.gastos) * 100);
    if (pct >= 15) {
      salida.push({ tono: 'aviso', texto: `${eur(actual.gastoImpulsivo)} de lo que llevas gastado (${pct} %) lo marcaste como impulsivo. Ahi esta el margen mas facil.` });
    }
  }

  for (const s of actual.sobres.filter((x) => !x.cerrado)) {
    if (s.estado === 'pasado') {
      salida.push({ tono: 'aviso', texto: `Te has pasado ${eur(-s.disponible)} en ${s.nombre}: llevas ${eur(s.gastado)} de ${eur(s.importe)}.` });
    } else if (s.estado === 'cerca' && s.diasRestantes !== null && s.diasRestantes > 0) {
      salida.push({ tono: 'aviso', texto: `${s.nombre}: te quedan ${eur(s.disponible)} y ${s.diasRestantes} ${s.diasRestantes === 1 ? 'dia' : 'dias'}.` });
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

// ═══════════════════════════════════════════════════════════════════════
//  Donde vive el dinero, donde se va, y lo que ya esta comprometido.
// ═══════════════════════════════════════════════════════════════════════

export const TIPOS_CUENTA = [
  { id: 'corriente', nombre: 'Cuenta corriente', emoji: '🏦' },
  { id: 'ahorro', nombre: 'Cuenta de ahorro', emoji: '🐖' },
  { id: 'efectivo', nombre: 'Efectivo', emoji: '💵' },
  { id: 'inversion', nombre: 'Inversion', emoji: '📈' },
  { id: 'otro', nombre: 'Otra', emoji: '💳' },
] as const;

export const TIPOS_DEUDA = [
  { id: 'prestamo', nombre: 'Prestamo', emoji: '🏛️' },
  { id: 'hipoteca', nombre: 'Hipoteca', emoji: '🏠' },
  { id: 'tarjeta', nombre: 'Tarjeta', emoji: '💳' },
  { id: 'financiacion', nombre: 'Financiacion', emoji: '📱' },
  { id: 'personal', nombre: 'A alguien', emoji: '🤝' },
  { id: 'otro', nombre: 'Otra', emoji: '📄' },
] as const;

export const tipoCuenta = (id: string) => TIPOS_CUENTA.find((t) => t.id === id) ?? TIPOS_CUENTA[4];
export const tipoDeuda = (id: string) => TIPOS_DEUDA.find((t) => t.id === id) ?? TIPOS_DEUDA[5];

export interface LineaCuenta {
  id: string;
  nombre: string;
  tipo: string;
  emoji: string;
  saldo: number;
  ahorro: boolean;
  ambito: AmbitoFinanzas;
  /** Parte del total que representa, para saber si esta todo en un sitio. */
  pct: number;
}

export interface ResumenCuentas {
  /** Lo que dicen las cuentas el dia de la foto. */
  total: number;
  /** Solo lo que has marcado como ahorro: el dinero que no es para gastar. */
  ahorrado: number;
  /** El resto: lo que tienes para el dia a dia. */
  disponible: number;
  cuentas: LineaCuenta[];
  /** Cuentas de ahorro, para poder decir de que cajas sale el ahorro. */
  cajasDeAhorro: LineaCuenta[];
  /** Dias desde la ultima foto. Pasados muchos, los numeros dejan de valer. */
  diasDesdeFoto: number | null;
}

/**
 * Las cuentas no son un saldo vivo (no hay banco detras): son una foto a una
 * fecha. Por eso se actualizan todas a la vez y se avisa cuando la foto es
 * vieja: un saldo de hace dos meses no es un saldo, es un recuerdo.
 */
export function resumenCuentas(
  cuentas: Cuenta[],
  opciones: { ambito?: Ambito; fechaFoto?: string | null; hoy: string },
): ResumenCuentas {
  const ambito = opciones.ambito ?? 'personal';
  const suyas = cuentas.filter((c) => ambito === 'todo' || c.ambito === ambito);
  const total = Math.round(suma(suyas.map((c) => num(c.saldo))) * 100) / 100;
  const linea = (c: Cuenta): LineaCuenta => ({
    id: c.id,
    nombre: c.nombre,
    tipo: c.tipo,
    emoji: tipoCuenta(c.tipo).emoji,
    saldo: num(c.saldo),
    ahorro: c.ahorro,
    ambito: c.ambito,
    pct: total > 0 ? Math.round((num(c.saldo) / total) * 100) : 0,
  });
  const lineas = suyas.map(linea).sort((a, b) => b.saldo - a.saldo);
  const ahorrado = Math.round(suma(lineas.filter((c) => c.ahorro).map((c) => c.saldo)) * 100) / 100;
  const dias = opciones.fechaFoto
    ? Math.round(
        (new Date(opciones.hoy + 'T12:00:00').getTime() - new Date(opciones.fechaFoto + 'T12:00:00').getTime()) / 86400000,
      )
    : null;
  return {
    total,
    ahorrado,
    disponible: Math.round((total - ahorrado) * 100) / 100,
    cuentas: lineas,
    cajasDeAhorro: lineas.filter((c) => c.ahorro),
    diasDesdeFoto: dias,
  };
}

export interface Semana {
  /** 1, 2, 3… dentro del mes. */
  numero: number;
  desde: string;
  hasta: string;
  /** Dias de esa semana que caen dentro del mes: la primera y la ultima cojean. */
  dias: number;
  gastos: number;
  ingresos: number;
  /** Gasto medio por dia: la unica forma justa de comparar una semana de 3 dias con una de 7. */
  porDia: number;
  /** Lo que te tocaria gastar en esos dias segun tu presupuesto, o null si no tienes. */
  limite: number | null;
  pasado: boolean;
  /** La semana en la que estas ahora mismo: aun no ha terminado. */
  encurso: boolean;
}

const dosDigitos = (n: number) => String(n).padStart(2, '0');

/**
 * El mes partido en semanas naturales (lunes a domingo) recortadas al mes.
 *
 * Se comparan por gasto POR DIA, no por total: la primera semana puede tener
 * dos dias y la ultima siete, y decir "esta semana has gastado menos" cuando
 * solo tiene dos dias es mentir con la verdad por delante.
 */
export function porSemanas(
  movimientos: Movimiento[],
  mes: string,
  opciones: { hoy: string; presupuestoMes?: number | null; ambito?: Ambito } = { hoy: '' },
): Semana[] {
  const ambito = opciones.ambito ?? 'personal';
  const total = diasDelMes(mes);
  const delMes = movimientos.filter(
    (m) => mesDe(m.fecha) === mes && (ambito === 'todo' || (m.ambito ?? 'personal') === ambito),
  );

  const semanas: Semana[] = [];
  let dia = 1;
  let numero = 1;
  while (dia <= total) {
    const fecha = `${mes}-${dosDigitos(dia)}`;
    // getDay(): 0 es domingo. Lo movemos para que el lunes sea 0.
    const diaSemana = (new Date(fecha + 'T12:00:00').getDay() + 6) % 7;
    const hastaDia = Math.min(total, dia + (6 - diaSemana));
    const desde = fecha;
    const hasta = `${mes}-${dosDigitos(hastaDia)}`;
    const dias = hastaDia - dia + 1;
    const dentro = delMes.filter((m) => m.fecha >= desde && m.fecha <= hasta);
    const gastos = Math.round(suma(dentro.filter((m) => m.tipo === 'gasto').map((m) => num(m.importe))) * 100) / 100;
    const presupuesto = opciones.presupuestoMes ?? null;
    semanas.push({
      numero,
      desde,
      hasta,
      dias,
      gastos,
      ingresos: Math.round(suma(dentro.filter((m) => m.tipo === 'ingreso').map((m) => num(m.importe))) * 100) / 100,
      porDia: Math.round((gastos / dias) * 100) / 100,
      limite: presupuesto !== null && presupuesto > 0 ? Math.round((presupuesto / total) * dias) : null,
      pasado: false,
      encurso: Boolean(opciones.hoy) && opciones.hoy >= desde && opciones.hoy <= hasta,
    });
    dia = hastaDia + 1;
    numero += 1;
  }
  // 'pasado' solo se marca en semanas terminadas: la de en curso aun puede enderezarse.
  return semanas.map((s) => ({
    ...s,
    pasado: s.limite !== null && !s.encurso && s.gastos > s.limite && (!opciones.hoy || opciones.hoy > s.hasta),
  }));
}

export interface LineaGasto {
  id: string;
  nombre: string;
  emoji: string;
  gastado: number;
  /** Parte del gasto total del mes. */
  pct: number;
  /** Cuanto ha cambiado respecto al mes pasado, en %, o null si no hay con que comparar. */
  cambio: number | null;
  anterior: number;
  apuntes: number;
  impulsivo: number;
  inversion: boolean;
}

/**
 * En que se va el dinero, de verdad: todas las categorias, tengan presupuesto
 * o no, y contando tambien lo de los sobres. La tarjeta de presupuestos
 * responde "¿me he pasado?"; esta responde "¿en que vivo?", que no es lo mismo.
 */
export function gastoPorCategoria(
  movimientos: Movimiento[],
  mes: string,
  opciones: { ambito?: Ambito; mesAnterior?: string } = {},
): { lineas: LineaGasto[]; total: number } {
  const ambito = opciones.ambito ?? 'personal';
  const suyos = movimientos.filter(
    (m) => m.tipo === 'gasto' && (ambito === 'todo' || (m.ambito ?? 'personal') === ambito),
  );
  const delMes = suyos.filter((m) => mesDe(m.fecha) === mes);
  const anteriorMes = opciones.mesAnterior ?? mesAnteriorA(mes);
  const previos = suyos.filter((m) => mesDe(m.fecha) === anteriorMes);
  const total = Math.round(suma(delMes.map((m) => num(m.importe))) * 100) / 100;

  const lineas = [...new Set(delMes.map((m) => m.categoria))]
    .map((id) => {
      const info = categoria(id);
      const mios = delMes.filter((m) => m.categoria === id);
      const gastado = Math.round(suma(mios.map((m) => num(m.importe))) * 100) / 100;
      const anterior = Math.round(suma(previos.filter((m) => m.categoria === id).map((m) => num(m.importe))) * 100) / 100;
      return {
        id,
        nombre: info.nombre,
        emoji: info.emoji,
        gastado,
        pct: total > 0 ? Math.round((gastado / total) * 100) : 0,
        // Con menos de 20 € el mes pasado, un "+400 %" no significa nada.
        cambio: anterior >= 20 ? Math.round(((gastado - anterior) / anterior) * 100) : null,
        anterior,
        apuntes: mios.length,
        impulsivo: Math.round(suma(mios.filter((m) => m.impulsivo).map((m) => num(m.importe))) * 100) / 100,
        inversion: INVERSION.has(id),
      };
    })
    .sort((a, b) => b.gastado - a.gastado);

  return { lineas, total };
}

export interface LineaDeuda {
  id: string;
  nombre: string;
  tipo: string;
  emoji: string;
  /** Lo que queda hoy: lo que dijiste menos lo que has ido pagando. */
  pendiente: number;
  /** Lo que dijiste que quedaba, sin descontar pagos. */
  inicial: number;
  pagado: number;
  cuota: number;
  tae: number | null;
  diaCobro: number | null;
  ambito: AmbitoFinanzas;
  /** Meses que faltan contando los intereses. null si no se puede saber. */
  meses: number | null;
  /** Mes aproximado en que la terminas (AAAA-MM). */
  fin: string | null;
  /** Lo que vas a pagar de intereses de aqui al final, si sigues con esta cuota. */
  intereses: number | null;
  /**
   * La cuota no llega ni para los intereses: la deuda crece aunque pagues.
   * Es la trampa clasica de la tarjeta revolving.
   */
  nuncaAcaba: boolean;
  pagos: number;
}

/** Sumar meses a un AAAA-MM sin liarse con los desbordes de diciembre. */
function mesMas(mes: string, n: number): string {
  const [anio, m] = mes.split('-').map(Number);
  const d = new Date(anio, m - 1 + n, 1);
  return `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}`;
}

/**
 * Cuantos meses faltan para liquidar, contando intereses.
 *
 * Dividir lo que debes entre la cuota es la cuenta que hace todo el mundo y
 * esta mal: con un 18 % de TAE te puede faltar un tercio mas de lo que crees.
 * La formula es la de la amortizacion francesa despejando el numero de cuotas.
 */
export function mesesParaLiquidar(pendiente: number, cuota: number, tae: number | null): number | null {
  if (pendiente <= 0) return 0;
  if (cuota <= 0) return null;
  const r = tae && tae > 0 ? tae / 100 / 12 : 0;
  if (r === 0) return Math.ceil(pendiente / cuota);
  // Si la cuota no cubre ni los intereses del mes, esto no se acaba nunca.
  if (cuota <= pendiente * r) return null;
  return Math.ceil(-Math.log(1 - (r * pendiente) / cuota) / Math.log(1 + r));
}

export interface ResumenDeudas {
  deudas: LineaDeuda[];
  /** Lo que debes en total ahora mismo. */
  pendiente: number;
  /** La suma de las cuotas: lo que ya esta comprometido cada mes. */
  cuotaMes: number;
  /** Que parte de lo que ingresas se va en cuotas antes de decidir nada. */
  pctIngresos: number | null;
  /** Ahorro menos deuda: el numero que de verdad dice como estas. */
  patrimonio: number | null;
  /** La ultima en terminar, o null. */
  ultimoFin: string | null;
  /** Cual conviene atacar primero: la mas cara, no la mas grande. */
  masCara: LineaDeuda | null;
  alguna: boolean;
}

export function resumenDeudas(datos: {
  deudas: Deuda[];
  movimientos: Movimiento[];
  hoy: string;
  ingresosMes?: number | null;
  ahorrado?: number | null;
  ambito?: Ambito;
}): ResumenDeudas {
  const ambito = datos.ambito ?? 'personal';
  const suyas = datos.deudas.filter((d) => !d.cerrada && (ambito === 'todo' || d.ambito === ambito));
  const mesActual = mesDe(datos.hoy);

  const deudas: LineaDeuda[] = suyas
    .map((d) => {
      // Solo los pagos posteriores a la foto: los de antes ya estan descontados.
      // Misma regla que la caja: manda la fecha del pago, y para los del mismo
      // dia que la foto, la hora. Si no, apuntar la deuda y pagar la cuota el
      // mismo dia no bajaba nada y parecia que el boton no hacia su trabajo.
      const pagos = datos.movimientos.filter((m) => {
        if (m.deuda_id !== d.id || m.tipo !== 'gasto') return false;
        if (m.fecha > d.pendiente_fecha) return true;
        if (m.fecha < d.pendiente_fecha) return false;
        return Boolean(d.actualizada && m.creado && m.creado > d.actualizada);
      });
      const pagado = Math.round(suma(pagos.map((m) => num(m.importe))) * 100) / 100;
      const inicial = num(d.pendiente);
      const pendiente = Math.max(0, Math.round((inicial - pagado) * 100) / 100);
      const cuota = num(d.cuota);
      const tae = d.tae !== null && d.tae !== undefined ? num(d.tae) : null;
      const meses = mesesParaLiquidar(pendiente, cuota, tae);
      return {
        id: d.id,
        nombre: d.nombre,
        tipo: d.tipo,
        emoji: tipoDeuda(d.tipo).emoji,
        pendiente,
        inicial,
        pagado,
        cuota,
        tae,
        diaCobro: d.dia_cobro,
        ambito: d.ambito,
        meses,
        fin: meses !== null && meses > 0 ? mesMas(mesActual, meses) : meses === 0 ? mesActual : null,
        intereses: meses !== null && meses > 0 ? Math.round(cuota * meses - pendiente) : null,
        nuncaAcaba: meses === null && cuota > 0 && pendiente > 0,
        pagos: pagos.length,
      };
    })
    .sort((a, b) => b.pendiente - a.pendiente);

  const pendiente = Math.round(suma(deudas.map((d) => d.pendiente)) * 100) / 100;
  const cuotaMes = Math.round(suma(deudas.map((d) => d.cuota)) * 100) / 100;
  const ingresos = datos.ingresosMes ?? null;
  const conFin = deudas.filter((d) => d.fin).map((d) => d.fin as string).sort();

  return {
    deudas,
    pendiente,
    cuotaMes,
    pctIngresos: ingresos && ingresos > 0 ? Math.round((cuotaMes / ingresos) * 100) : null,
    patrimonio: datos.ahorrado !== null && datos.ahorrado !== undefined
      ? Math.round((datos.ahorrado - pendiente) * 100) / 100
      : null,
    ultimoFin: conFin.length ? conFin[conFin.length - 1] : null,
    // La mas cara por TAE, no la mas grande: es la que mas te cuesta tener viva.
    masCara: deudas.filter((d) => d.tae && d.pendiente > 0).sort((a, b) => (b.tae ?? 0) - (a.tae ?? 0))[0] ?? null,
    alguna: deudas.length > 0,
  };
}

/** Lo que hay que decir sobre deudas y cuentas, y que no dice el resumen del mes. */
export function insightsPatrimonio(
  cuentas: ResumenCuentas,
  deudas: ResumenDeudas,
  semanas: Semana[],
): Insight[] {
  const salida: Insight[] = [];

  for (const d of deudas.deudas.filter((x) => x.nuncaAcaba)) {
    salida.push({
      tono: 'alerta',
      texto: `${d.nombre}: con ${eur(d.cuota)} al mes y un ${d.tae} % de TAE no llegas ni a cubrir los intereses. Asi la deuda sube aunque pagues.`,
    });
  }

  if (deudas.pctIngresos !== null && deudas.pctIngresos >= 35) {
    salida.push({
      tono: deudas.pctIngresos >= 50 ? 'alerta' : 'aviso',
      texto: `${deudas.pctIngresos} % de lo que ingresas se va en cuotas antes de que decidas nada (${eur(deudas.cuotaMes)} al mes).`,
    });
  }

  if (deudas.masCara && deudas.masCara.tae && deudas.masCara.tae >= 12 && deudas.deudas.length > 1) {
    salida.push({
      tono: 'info',
      texto: `Si te sobra algo, metelo en ${deudas.masCara.nombre} (${deudas.masCara.tae} % TAE): es la mas cara de tener viva, aunque no sea la mas grande.`,
    });
  }

  // Ahorrar al 1 % mientras se debe al 18 % es perder dinero cada mes.
  if (cuentas.ahorrado > 0 && deudas.masCara && (deudas.masCara.tae ?? 0) >= 10 && cuentas.ahorrado >= deudas.masCara.pendiente) {
    salida.push({
      tono: 'info',
      texto: `Tienes ${eur(cuentas.ahorrado)} ahorrados y debes ${eur(deudas.masCara.pendiente)} al ${deudas.masCara.tae} %. Cancelarla te renta mas que tenerlo parado, si te deja dormir igual de bien.`,
    });
  }

  if (deudas.patrimonio !== null && deudas.alguna) {
    salida.push({
      tono: deudas.patrimonio >= 0 ? 'bien' : 'info',
      texto: deudas.patrimonio >= 0
        ? `Ahorro menos deuda: ${eur(deudas.patrimonio)} a favor.`
        : `Ahorro menos deuda: ${eur(deudas.patrimonio)} en contra. Es el numero a mover, no el de la caja.`,
    });
  }

  // Una foto vieja no es un saldo, es un recuerdo.
  if (cuentas.diasDesdeFoto !== null && cuentas.diasDesdeFoto >= 45 && cuentas.total > 0) {
    salida.push({
      tono: 'aviso',
      texto: `Hace ${cuentas.diasDesdeFoto} dias que no pones al dia tus cuentas. A partir de ahi el saldo que ves es una estimacion.`,
    });
  }

  const terminadas = semanas.filter((s) => !s.encurso && s.gastos > 0);
  if (terminadas.length >= 2) {
    const peor = [...terminadas].sort((a, b) => b.porDia - a.porDia)[0];
    const resto = terminadas.filter((s) => s.numero !== peor.numero);
    const mediaResto = suma(resto.map((s) => s.porDia)) / resto.length;
    if (mediaResto > 0 && peor.porDia > mediaResto * 1.6) {
      salida.push({
        tono: 'info',
        texto: `Tu semana cara fue la ${peor.numero}.ª: ${eur(peor.porDia)} al dia frente a ${eur(mediaResto)} del resto del mes.`,
      });
    }
  }

  const orden = { alerta: 0, aviso: 1, bien: 2, info: 3 };
  return [...salida].sort((a, b) => orden[a.tono] - orden[b.tono]).slice(0, 4);
}
