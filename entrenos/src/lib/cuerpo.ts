import type { Medicion, Perfil, Sexo } from './types';

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
 * Grasa corporal estimada con la formula de la US Navy (perimetros, en cm).
 * Es una estimacion: sirve para ver la tendencia, no como dato clinico.
 */
export function grasaCorporal(sexo: Sexo, alturaCm: number, m: Medicion): number | null {
  const cintura = m.cinturaCm ?? null;
  const cuello = m.cuelloCm ?? null;
  if (!cintura || !cuello || !alturaCm) return null;

  if (sexo === 'hombre') {
    const x = cintura - cuello;
    if (x <= 0) return null;
    const bf = 495 / (1.0324 - 0.19077 * Math.log10(x) + 0.15456 * Math.log10(alturaCm)) - 450;
    return acotar(bf);
  }

  const cadera = m.caderaCm ?? null;
  if (!cadera) return null;
  const x = cintura + cadera - cuello;
  if (x <= 0) return null;
  const bf = 495 / (1.29579 - 0.35004 * Math.log10(x) + 0.221 * Math.log10(alturaCm)) - 450;
  return acotar(bf);
}

function acotar(bf: number): number | null {
  if (!Number.isFinite(bf) || bf <= 2 || bf >= 70) return null;
  return bf;
}

export function masaMagraKg(pesoKg: number, grasaPct: number | null): number | null {
  if (grasaPct === null) return null;
  return pesoKg * (1 - grasaPct / 100);
}

export function ratioCinturaCadera(m: Medicion): number | null {
  if (!m.cinturaCm || !m.caderaCm) return null;
  return m.cinturaCm / m.caderaCm;
}

/** Mediciones de mas reciente a mas antigua. */
export function ordenadas(mediciones: Medicion[]): Medicion[] {
  return [...mediciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function ultimaMedicion(mediciones: Medicion[]): Medicion | null {
  return ordenadas(mediciones)[0] ?? null;
}

/**
 * Tendencia de peso en kg/semana por regresion lineal sobre los ultimos `dias`.
 * Devuelve null si no hay al menos 2 pesajes separados en el tiempo.
 */
export function tendenciaPesoKgSemana(mediciones: Medicion[], dias = 28): number | null {
  if (mediciones.length < 2) return null;
  const corte = Date.now() - dias * 86400000;
  const puntos = mediciones
    .filter((m) => m.pesoKg > 0)
    .map((m) => ({ t: new Date(m.fecha + 'T12:00:00').getTime(), y: m.pesoKg }))
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
  if (den === 0) return null;
  return (num / den) * 7;
}

export interface ResumenCuerpo {
  peso: number | null;
  imc: number | null;
  grasaPct: number | null;
  masaMagra: number | null;
  cinturaCadera: number | null;
  tendencia: number | null;
  fecha: string | null;
}

export function resumenCuerpo(perfil: Perfil, mediciones: Medicion[]): ResumenCuerpo {
  const ultima = ultimaMedicion(mediciones);
  if (!ultima) {
    return { peso: null, imc: null, grasaPct: null, masaMagra: null, cinturaCadera: null, tendencia: null, fecha: null };
  }
  const grasaPct = grasaCorporal(perfil.sexo, perfil.alturaCm, ultima);
  return {
    peso: ultima.pesoKg,
    imc: imc(ultima.pesoKg, perfil.alturaCm),
    grasaPct,
    masaMagra: masaMagraKg(ultima.pesoKg, grasaPct),
    cinturaCadera: ratioCinturaCadera(ultima),
    tendencia: tendenciaPesoKgSemana(mediciones),
    fecha: ultima.fecha,
  };
}
