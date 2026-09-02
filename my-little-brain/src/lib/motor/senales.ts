import { diasEntre } from '../fechas';
import type { Dia } from './puntuaciones';

export type TonoSenal = 'bien' | 'aviso' | 'alerta' | 'info';

export interface Senal {
  id: string;
  tono: TonoSenal;
  titulo: string;
  detalle: string;
  /** Que hacer al respecto, en una accion concreta. */
  accion?: { texto: string; href: string };
  /** Cuanto pesa a la hora de ordenar. Mas alto, mas arriba. */
  peso: number;
}

export interface EntradaSenales {
  dias: Dia[];
  hoy: string;
  objetivoEntrenos: number;
  metaKcal: number | null;
  metaProteina: number | null;
  tendenciaPeso: number | null;
  ritmoObjetivo: number | null;
  racha: number;
}

const media = (valores: (number | null)[]): number | null => {
  const limpios = valores.filter((v): v is number => v !== null && Number.isFinite(v));
  return limpios.length ? limpios.reduce((a, b) => a + b, 0) / limpios.length : null;
};

/**
 * Lecturas que la app saca sola de los datos, sin llamar al modelo: son gratis,
 * instantaneas y siempre ciertas. El coach esta para lo que estas no cubren.
 */
export function senales(entrada: EntradaSenales): Senal[] {
  const { dias, hoy, objetivoEntrenos } = entrada;
  const ultimos7 = dias.slice(-7);
  const ultimos14 = dias.slice(-14);
  const salida: Senal[] = [];

  // ── Constancia del registro ─────────────────────────────────────────
  const ultimoRegistro = [...dias].reverse().find((d) => d.comidas > 0 || d.entreno || d.focoMin > 0);
  const diasSinRegistrar = ultimoRegistro ? diasEntre(ultimoRegistro.fecha, hoy) : 99;
  if (diasSinRegistrar >= 3) {
    salida.push({
      id: 'sin_registrar',
      tono: 'alerta',
      titulo: `${diasSinRegistrar} dias sin registrar nada`,
      detalle: 'Sin datos no hay lectura ni ajustes. Cuentame el dia en una frase y lo pongo al dia.',
      accion: { texto: 'Hablar con el coach', href: '/app/coach' },
      peso: 100,
    });
  }

  // ── Entrenamiento ───────────────────────────────────────────────────
  const ultimoEntreno = [...dias].reverse().find((d) => d.entreno);
  const diasSinEntrenar = ultimoEntreno ? diasEntre(ultimoEntreno.fecha, hoy) : null;
  const entrenos7 = ultimos7.filter((d) => d.entreno).length;

  if (diasSinEntrenar !== null && diasSinEntrenar >= 4 && objetivoEntrenos >= 3) {
    salida.push({
      id: 'sin_entrenar',
      tono: 'aviso',
      titulo: `Llevas ${diasSinEntrenar} dias sin entrenar`,
      detalle: `Tu objetivo son ${objetivoEntrenos} sesiones por semana. Una sesion corta hoy vale mas que la perfecta de manana.`,
      accion: { texto: 'Ver el entreno de hoy', href: '/app/entreno' },
      peso: 80,
    });
  } else if (entrenos7 >= objetivoEntrenos && objetivoEntrenos > 0) {
    salida.push({
      id: 'entrenos_ok',
      tono: 'bien',
      titulo: `${entrenos7} entrenos en 7 dias`,
      detalle: 'Objetivo semanal cumplido. Esto es lo que mueve la aguja a los tres meses.',
      peso: 30,
    });
  }

  // ── Sueno ───────────────────────────────────────────────────────────
  const suenoMedio = media(ultimos7.map((d) => d.suenoHoras));
  if (suenoMedio !== null && suenoMedio < 6.5) {
    const conSueno = ultimos14.filter((d) => d.suenoHoras !== null);
    const cortos = conSueno.filter((d) => (d.suenoHoras ?? 0) < 6.5);
    const largos = conSueno.filter((d) => (d.suenoHoras ?? 0) >= 7);
    const focoCortos = media(cortos.map((d) => d.focoMin));
    const focoLargos = media(largos.map((d) => d.focoMin));

    const comparativa =
      cortos.length >= 2 && largos.length >= 2 && focoCortos !== null && focoLargos !== null && focoLargos > 0
        ? ` Tus dias de menos de 6,5 h rinden ${Math.round((1 - focoCortos / focoLargos) * 100)}% menos de foco.`
        : '';

    salida.push({
      id: 'sueno_corto',
      tono: 'alerta',
      titulo: `Duermes ${suenoMedio.toFixed(1)} h de media`,
      detalle: `Por debajo de 7 h caen la energia, la recuperacion y el foco.${comparativa}`,
      peso: 90,
    });
  }

  // ── Alcohol ─────────────────────────────────────────────────────────
  const diasAlcohol = ultimos7.filter((d) => d.alcoholUd > 0).length;
  const unidades = ultimos7.reduce((total, d) => total + d.alcoholUd, 0);
  if (diasAlcohol >= 3) {
    salida.push({
      id: 'alcohol',
      tono: 'aviso',
      titulo: `Alcohol ${diasAlcohol} de los ultimos 7 dias`,
      detalle: `${unidades.toFixed(0)} unidades en total. Ademas de las calorias, empeora el sueno profundo y la recuperacion del entreno.`,
      peso: 70,
    });
  }

  // ── Proteina ────────────────────────────────────────────────────────
  if (entrada.metaProteina) {
    const conComidas = ultimos7.filter((d) => d.comidas > 0);
    const flojos = conComidas.filter((d) => d.proteina < entrada.metaProteina! * 0.8);
    if (conComidas.length >= 3 && flojos.length >= Math.ceil(conComidas.length * 0.6)) {
      salida.push({
        id: 'proteina_baja',
        tono: 'aviso',
        titulo: 'Te falta proteina casi todos los dias',
        detalle: `Tu objetivo son ${entrada.metaProteina} g y llevas ${flojos.length} de ${conComidas.length} dias por debajo del 80%. Es lo que protege el musculo.`,
        peso: 60,
      });
    }
  }

  // ── Peso vs objetivo ────────────────────────────────────────────────
  if (entrada.tendenciaPeso !== null && entrada.ritmoObjetivo !== null && entrada.ritmoObjetivo !== 0) {
    const diferencia = entrada.tendenciaPeso - entrada.ritmoObjetivo;
    const margen = Math.max(0.15, Math.abs(entrada.ritmoObjetivo) * 0.4);
    if (Math.abs(diferencia) <= margen) {
      salida.push({
        id: 'peso_ok',
        tono: 'bien',
        titulo: `Peso a ${entrada.tendenciaPeso > 0 ? '+' : ''}${entrada.tendenciaPeso.toFixed(2)} kg/semana`,
        detalle: 'Justo en el ritmo que buscas. No toques nada.',
        peso: 40,
      });
    }
  }

  // ── Racha ───────────────────────────────────────────────────────────
  if (entrada.racha >= 7) {
    salida.push({
      id: 'racha',
      tono: 'bien',
      titulo: `${entrada.racha} dias seguidos`,
      detalle: 'La constancia es la variable que mejor predice el resultado. Vas sobrado.',
      peso: 35,
    });
  }

  // ── Foco ────────────────────────────────────────────────────────────
  const focoSemana = ultimos7.reduce((total, d) => total + d.focoMin, 0) / 60;
  const focoPrevia = dias.slice(-14, -7).reduce((total, d) => total + d.focoMin, 0) / 60;
  if (focoPrevia > 1 && focoSemana < focoPrevia * 0.6) {
    salida.push({
      id: 'foco_cae',
      tono: 'aviso',
      titulo: `El foco ha caido a ${focoSemana.toFixed(1)} h`,
      detalle: `La semana anterior fueron ${focoPrevia.toFixed(1)} h. Si es puntual, no pasa nada; si se repite, hay que mirar la agenda.`,
      peso: 55,
    });
  }

  return salida.sort((a, b) => b.peso - a.peso);
}
