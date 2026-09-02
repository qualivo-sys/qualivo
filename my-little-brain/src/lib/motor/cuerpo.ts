import type { MetricaCorporal, Sexo } from '../tipos';

export function imc(pesoKg: number, alturaCm: number): number | null {
  if (!pesoKg || !alturaCm) return null;
  const m = alturaCm / 100;
  return pesoKg / (m * m);
}

export function clasificacionImc(valor: number): string {
  if (valor < 18.5) return 'bajo peso';
  if (valor < 25) return 'normopeso';
  if (valor < 30) return 'sobrepeso';
  return 'obesidad';
}

/**
 * Grasa corporal estimada con la formula de perimetros de la US Navy.
 * Es una estimacion: vale para ver la tendencia, no como dato clinico.
 */
export function grasaCorporal(sexo: Sexo, alturaCm: number, m: MetricaCorporal): number | null {
  const cintura = m.cintura_cm;
  const cuello = m.cuello_cm;
  if (!cintura || !cuello || !alturaCm) return null;

  if (sexo === 'hombre') {
    const x = cintura - cuello;
    if (x <= 0) return null;
    return acotar(495 / (1.0324 - 0.19077 * Math.log10(x) + 0.15456 * Math.log10(alturaCm)) - 450);
  }

  const cadera = m.cadera_cm;
  if (!cadera) return null;
  const x = cintura + cadera - cuello;
  if (x <= 0) return null;
  return acotar(495 / (1.29579 - 0.35004 * Math.log10(x) + 0.221 * Math.log10(alturaCm)) - 450);
}

function acotar(bf: number): number | null {
  if (!Number.isFinite(bf) || bf <= 2 || bf >= 70) return null;
  return bf;
}

export function masaMagraKg(pesoKg: number, grasaPct: number | null): number | null {
  return grasaPct === null ? null : pesoKg * (1 - grasaPct / 100);
}

/** Mediciones de mas reciente a mas antigua. */
export function ordenadas(mediciones: MetricaCorporal[]): MetricaCorporal[] {
  return [...mediciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function ultimoPeso(mediciones: MetricaCorporal[]): { fecha: string; peso: number } | null {
  for (const m of ordenadas(mediciones)) {
    if (m.peso_kg) return { fecha: m.fecha, peso: m.peso_kg };
  }
  return null;
}

/**
 * Tendencia de peso en kg/semana por regresion lineal sobre los ultimos `dias`.
 * Null si no hay al menos dos pesajes separados en el tiempo.
 */
export function tendenciaPesoKgSemana(mediciones: MetricaCorporal[], dias = 28): number | null {
  const corte = Date.now() - dias * 86400000;
  const puntos = mediciones
    .filter((m) => m.peso_kg)
    .map((m) => ({ t: new Date(m.fecha + 'T12:00:00').getTime(), y: m.peso_kg as number }))
    .filter((p) => Number.isFinite(p.t) && p.t >= corte)
    .sort((a, b) => a.t - b.t);
  if (puntos.length < 2) return null;

  const t0 = puntos[0].t;
  const xs = puntos.map((p) => (p.t - t0) / 86400000);
  const ys = puntos.map((p) => p.y);
  const n = xs.length;
  const mediaX = xs.reduce((a, b) => a + b, 0) / n;
  const mediaY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mediaX) * (ys[i] - mediaY);
    den += (xs[i] - mediaX) ** 2;
  }
  return den === 0 ? null : (num / den) * 7;
}

export interface ResumenCuerpo {
  peso: number | null;
  fecha: string | null;
  imc: number | null;
  grasaPct: number | null;
  masaMagra: number | null;
  tendencia: number | null;
  cintura: number | null;
}

export function resumenCuerpo(
  sexo: Sexo | null,
  alturaCm: number | null,
  mediciones: MetricaCorporal[],
): ResumenCuerpo {
  const lista = ordenadas(mediciones);
  const ultima = lista.find((m) => m.peso_kg) ?? null;
  const conPerimetros = lista.find((m) => m.cintura_cm && m.cuello_cm) ?? null;
  const peso = ultima?.peso_kg ?? null;
  const grasaPct =
    sexo && alturaCm && conPerimetros ? grasaCorporal(sexo, alturaCm, conPerimetros) : null;

  return {
    peso,
    fecha: ultima?.fecha ?? null,
    imc: peso && alturaCm ? imc(peso, alturaCm) : null,
    grasaPct,
    masaMagra: peso ? masaMagraKg(peso, grasaPct) : null,
    tendencia: tendenciaPesoKgSemana(mediciones),
    cintura: conPerimetros?.cintura_cm ?? null,
  };
}
