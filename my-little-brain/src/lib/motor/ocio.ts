/**
 * Ocio: lo que quieres hacer y lo que ya has hecho.
 *
 * La decision de fondo es que son la MISMA lista. "Quiero ir a ese sitio" y
 * "fuimos y estuvo bien" no son dos cosas distintas: son el mismo apunte en
 * dos momentos, y pasar de uno a otro cuesta un toque. Eso es lo que lo
 * mantiene vivo. Una lista de deseos se llena sola porque apetece; un diario
 * de lo ya vivido exige disciplina y se abandona a la semana.
 *
 * Y lo que justifica que esto viva aqui y no en una app de listas: la app ya
 * sabe como estas. Puede decirte que las semanas que haces algo de tu lista
 * tu animo es otro, y puede sacarte un plan de la chistera un viernes que
 * llevas dos semanas sin hacer nada.
 */
import { comparar } from './estadistica';
import type { Dia } from './puntuaciones';
import type { ApunteOcio } from '../tipos';

export interface CategoriaOcio {
  id: string;
  nombre: string;
  emoji: string;
  /** En plural, para los contadores. */
  plural: string;
}

export const CATEGORIAS_OCIO: CategoriaOcio[] = [
  { id: 'actividad', nombre: 'Plan', emoji: '🥾', plural: 'planes' },
  { id: 'restaurante', nombre: 'Restaurante', emoji: '🍽️', plural: 'restaurantes' },
  { id: 'viaje', nombre: 'Viaje', emoji: '✈️', plural: 'viajes' },
  { id: 'pantalla', nombre: 'Peli o serie', emoji: '🎬', plural: 'pelis y series' },
  { id: 'libro', nombre: 'Libro', emoji: '📚', plural: 'libros' },
  { id: 'formacion', nombre: 'Formacion', emoji: '🎓', plural: 'formaciones' },
  { id: 'experiencia', nombre: 'Experiencia', emoji: '🍷', plural: 'experiencias' },
  { id: 'revisar', nombre: 'Para revisar', emoji: '🔖', plural: 'cosas para revisar' },
  { id: 'otros', nombre: 'Otros', emoji: '✨', plural: 'otros' },
];

export const categoriaOcio = (id: string): CategoriaOcio =>
  CATEGORIAS_OCIO.find((c) => c.id === id) ?? CATEGORIAS_OCIO[CATEGORIAS_OCIO.length - 1];

export interface LineaCategoria {
  categoria: CategoriaOcio;
  pendientes: number;
  hechos: number;
}

export interface ResumenOcio {
  totalPendientes: number;
  totalHechos: number;
  /** Solo las categorias con algo dentro, de mas a menos pendientes. */
  categorias: LineaCategoria[];
  /** Hechos en los ultimos 30 dias. */
  hechosMes: number;
  /** Dias desde lo ultimo que hizo. null si nunca ha marcado nada. */
  diasDesdeUltimo: number | null;
  ultimo: ApunteOcio | null;
}

export function resumenOcio(apuntes: ApunteOcio[], hoy: string, diasEntre: (a: string, b: string) => number): ResumenOcio {
  const vivos = apuntes.filter((a) => a.estado !== 'descartado');
  const pendientes = vivos.filter((a) => a.estado === 'pendiente');
  const hechos = vivos.filter((a) => a.estado === 'hecho');

  const hechosOrdenados = hechos
    .filter((a) => a.fecha_hecho)
    .sort((a, b) => (a.fecha_hecho! < b.fecha_hecho! ? 1 : -1));
  const ultimo = hechosOrdenados[0] ?? null;

  const categorias = CATEGORIAS_OCIO.map((categoria) => ({
    categoria,
    pendientes: pendientes.filter((a) => a.categoria === categoria.id).length,
    hechos: hechos.filter((a) => a.categoria === categoria.id).length,
  }))
    .filter((l) => l.pendientes + l.hechos > 0)
    .sort((a, b) => b.pendientes - a.pendientes || b.hechos - a.hechos);

  return {
    totalPendientes: pendientes.length,
    totalHechos: hechos.length,
    categorias,
    hechosMes: hechosOrdenados.filter((a) => diasEntre(a.fecha_hecho!, hoy) <= 30).length,
    diasDesdeUltimo: ultimo?.fecha_hecho ? diasEntre(ultimo.fecha_hecho, hoy) : null,
    ultimo,
  };
}

/**
 * Que sacar de la lista cuando hay un rato.
 *
 * Ordena por lo que de verdad decide: si hay hueco de tiempo, lo que cabe;
 * y a igualdad, lo que lleva mas tiempo esperando. Lo que llevas un ano
 * apuntado y nunca haces no es que no te apetezca: es que nunca te acuerdas.
 */
export function sugerencias(apuntes: ApunteOcio[], opciones: { minutos?: number; categoria?: string } = {}): ApunteOcio[] {
  return apuntes
    .filter((a) => a.estado === 'pendiente')
    .filter((a) => !opciones.categoria || a.categoria === opciones.categoria)
    .filter((a) => !opciones.minutos || !a.minutos || a.minutos <= opciones.minutos)
    .sort((a, b) => {
      // Con hueco de tiempo, primero lo que cabe seguro (tiene duracion puesta).
      if (opciones.minutos) {
        const cabeA = a.minutos ? 0 : 1;
        const cabeB = b.minutos ? 0 : 1;
        if (cabeA !== cabeB) return cabeA - cabeB;
      }
      return a.creado < b.creado ? -1 : 1;
    });
}

// ── Lo que veo ────────────────────────────────────────────────────────

export interface InsightOcio {
  id: string;
  texto: string;
  tono: 'bien' | 'aviso' | 'info';
}

export interface DatosInsightsOcio {
  resumen: ResumenOcio;
  apuntes: ApunteOcio[];
  dias: Dia[];
  hoy: string;
  /** 0 domingo … 6 sabado, en la zona de la persona. */
  diaSemana: number;
}

/**
 * Tres frases. Ninguna dice "deberias salir mas": eso no es asunto de una app.
 * Lo que si puede hacer es recordarte lo que ya querias hacer y enseñarte lo
 * que pasa cuando lo haces.
 */
export function insightsOcio({ resumen, apuntes, dias, hoy, diaSemana }: DatosInsightsOcio): InsightOcio[] {
  const fuera: InsightOcio[] = [];

  if (!resumen.totalPendientes && !resumen.totalHechos) {
    return [{
      id: 'vacio',
      tono: 'info',
      texto: 'Apunta lo que te apetezca hacer aunque no sepas cuando: ese sitio, esa peli, ese viaje. Luego, cuando tengas un rato libre, no tendras que pensar.',
    }];
  }

  // Lo que lleva mas tiempo esperando. No es reproche: es que no te acuerdas.
  const viejos = sugerencias(apuntes);
  const masViejo = viejos[0];
  if (masViejo && resumen.totalPendientes >= 3) {
    fuera.push({
      id: 'esperando',
      tono: 'info',
      texto: `"${masViejo.titulo}" es lo que llevas mas tiempo queriendo hacer. Tienes ${resumen.totalPendientes} cosas apuntadas: lo dificil no es elegir, es acordarse.`,
    });
  }

  // Viernes o sabado, con la lista llena y tiempo sin hacer nada.
  if ((diaSemana === 5 || diaSemana === 6) && resumen.totalPendientes > 0 && (resumen.diasDesdeUltimo ?? 99) >= 10) {
    fuera.push({
      id: 'finde',
      tono: 'aviso',
      texto: resumen.diasDesdeUltimo === null
        ? 'Es finde y tienes cosas apuntadas sin estrenar. Una vale.'
        : `Llevas ${resumen.diasDesdeUltimo} dias sin hacer nada de tu lista y es finde. Tienes ${resumen.totalPendientes} para elegir.`,
    });
  }

  if (resumen.hechosMes >= 3) {
    fuera.push({
      id: 'buen_mes',
      tono: 'bien',
      texto: `${resumen.hechosMes} cosas de tu lista este mes. Eso tambien es cuidarse, aunque no lo parezca.`,
    });
  }

  // Lo unico que esta app puede decir y una lista no.
  const fechasHechas = new Set(apuntes.filter((a) => a.estado === 'hecho' && a.fecha_hecho).map((a) => a.fecha_hecho!));
  const comp = comparar(dias, (d) => fechasHechas.has(d.fecha), (d) => d.animo);
  if (comp && comp.cambio >= 12) {
    fuera.push({
      id: 'animo',
      tono: 'bien',
      texto: `Los dias que haces algo de esta lista tu animo es ${comp.con} sobre 10, frente a ${comp.sin} el resto.`,
    });
  }

  return fuera.slice(0, 3);
}
