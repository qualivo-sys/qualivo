import { emparejarEjercicio } from './motor/ejercicios';
import { esIsometrico } from './motor/planificador';
import type { PlanEntreno } from './motor/tipos-motor';

/** Lo que pedimos al modelo que extraiga de un plan de un especialista. */
export interface ImportacionEntreno {
  origen?: string;
  dias: {
    nombre: string;
    foco?: string;
    ejercicios: { nombre: string; series?: number; repMin?: number; repMax?: number; rir?: number; descansoSeg?: number }[];
  }[];
  notas?: string[];
}

export interface ImportacionDieta {
  origen?: string;
  kcal?: number;
  proteina_g?: number;
  carbos_g?: number;
  grasa_g?: number;
  /** Resumen del menu o de las pautas, para que el coach lo tenga presente. */
  resumen?: string;
  normas?: string[];
}

export interface Importacion {
  entreno: ImportacionEntreno | null;
  dieta: ImportacionDieta | null;
}

export const PROMPT_IMPORTACION = `Eres un asistente que convierte planes de entrenamiento y dietas escritos por profesionales en datos estructurados. Espanol.

Lee el documento y extrae SOLO lo que este escrito. No inventes series, pesos ni calorias que no aparezcan; si un dato falta, omitelo.

Responde UNICAMENTE con un objeto JSON valido, sin texto alrededor ni bloques de codigo, con esta forma:
{
  "entreno": null | {
    "origen": "quien lo ha hecho, si consta (ej. 'Laura, entrenadora')",
    "dias": [
      { "nombre": "Dia 1 · Torso", "foco": "pecho y espalda",
        "ejercicios": [ { "nombre": "Press de banca", "series": 4, "repMin": 8, "repMax": 10, "rir": 2, "descansoSeg": 120 } ] }
    ],
    "notas": ["indicaciones generales del plan, si las hay"]
  },
  "dieta": null | {
    "origen": "quien la ha hecho, si consta",
    "kcal": 2100, "proteina_g": 160, "carbos_g": 220, "grasa_g": 65,
    "resumen": "en 5-10 lineas: estructura de comidas, alimentos habituales, que evitar; es lo que el coach recordara",
    "normas": ["reglas concretas del plan, si las hay"]
  }
}

Reglas:
- Si el documento solo tiene entreno, "dieta" es null, y al reves.
- Repeticiones "8-10" → repMin 8, repMax 10. "10" → repMin 10, repMax 10. "al fallo" → rir 0.
- Si la dieta da menus pero no macros, deja kcal y macros vacios y describe el menu en "resumen".
- Nombres de ejercicio tal cual aparezcan, en espanol.`;

/** Extrae el JSON aunque venga envuelto en texto o en un bloque de codigo. */
export function parsearImportacion(texto: string): Importacion | null {
  const limpio = texto.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const inicio = limpio.indexOf('{');
  const fin = limpio.lastIndexOf('}');
  if (inicio === -1 || fin === -1) return null;
  try {
    const bruto = JSON.parse(limpio.slice(inicio, fin + 1)) as Partial<Importacion>;
    const entreno = bruto.entreno && Array.isArray(bruto.entreno.dias) && bruto.entreno.dias.length ? bruto.entreno : null;
    const dieta = bruto.dieta && typeof bruto.dieta === 'object' ? bruto.dieta : null;
    if (!entreno && !dieta) return null;
    return { entreno, dieta };
  } catch {
    return null;
  }
}

const n = (v: unknown, porDefecto: number, min: number, max: number): number => {
  const x = typeof v === 'number' && Number.isFinite(v) ? Math.round(v) : porDefecto;
  return Math.max(min, Math.min(max, x));
};

/**
 * Convierte el entreno extraido en un plan de la app: empareja cada ejercicio
 * con el catalogo (o lo deja como ejercicio propio) y completa las pautas que
 * falten con valores razonables.
 */
export function planDesdeImportacion(datos: ImportacionEntreno): { plan: PlanEntreno; sinCatalogo: string[] } {
  const sinCatalogo: string[] = [];
  const dias = datos.dias.slice(0, 7).map((dia, i) => ({
    id: `d${i + 1}`,
    nombre: dia.nombre?.trim() ? (dia.nombre.startsWith('Dia') ? dia.nombre : `Dia ${i + 1} · ${dia.nombre}`) : `Dia ${i + 1}`,
    foco: dia.foco?.trim() || 'Importado',
    cardio: null,
    bloques: (dia.ejercicios ?? []).slice(0, 12).map((ej, j) => {
      const info = emparejarEjercicio(ej.nombre ?? `Ejercicio ${j + 1}`);
      if (!info.enCatalogo) sinCatalogo.push(info.nombre);
      const iso = esIsometrico(info.id);
      const repMin = n(ej.repMin, iso ? 30 : 8, 1, 120);
      const repMax = Math.max(repMin, n(ej.repMax, repMin, 1, 180));
      return {
        ejercicioId: info.id,
        ...(info.enCatalogo ? {} : { nombreLibre: info.nombre }),
        rol: (j === 0 ? 'principal' : j < 3 ? 'secundario' : 'accesorio') as 'principal' | 'secundario' | 'accesorio',
        series: n(ej.series, 3, 1, 10),
        repMin,
        repMax,
        rir: n(ej.rir, 2, 0, 5),
        descansoSeg: n(ej.descansoSeg, j === 0 ? 120 : 90, 30, 300),
      };
    }),
  }));

  return {
    plan: {
      generadoEl: new Date().toISOString(),
      firma: 'importado',
      dias,
      notas: [
        `Plan importado${datos.origen ? ` de ${datos.origen}` : ''}. Se sigue tal cual esta escrito; la progresion de cargas la lleva la app.`,
        ...(datos.notas ?? []).filter((x) => typeof x === 'string').slice(0, 8),
      ],
    },
    sinCatalogo: [...new Set(sinCatalogo)],
  };
}
