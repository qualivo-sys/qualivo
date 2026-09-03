/**
 * Nutricion del dia a dia: como vas de macros respecto al objetivo, lo que un
 * nutricionista te diria al verlo, y que comer en lo que queda de dia para
 * cuadrarlo. Todo determinista, con la misma tabla de alimentos que la
 * calculadora: sin IA y siempre el mismo resultado.
 */
import { ALIMENTOS, type Alimento } from './alimentos';
import type { ObjetivosDiarios } from './nutricion';
import type { Comida } from '../tipos';

export interface Macros {
  kcal: number;
  proteina: number;
  carbos: number;
  grasa: number;
}

export type MomentoDia = 'desayuno' | 'comida' | 'snack' | 'cena';

/** Reparto del dia por comida y hora hasta la que "toca" cada una. */
export const MOMENTOS: { id: MomentoDia; etiqueta: string; peso: number; hasta: number }[] = [
  { id: 'desayuno', etiqueta: 'Desayuno', peso: 0.25, hasta: 11 },
  { id: 'comida', etiqueta: 'Comida', peso: 0.35, hasta: 16 },
  { id: 'snack', etiqueta: 'Merienda', peso: 0.15, hasta: 19 },
  { id: 'cena', etiqueta: 'Cena', peso: 0.25, hasta: 23 },
];

const r = (n: number) => Math.round(n);
const suma = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function macrosDe(comidas: Comida[]): Macros {
  return {
    kcal: suma(comidas.map((c) => c.kcal ?? 0)),
    proteina: suma(comidas.map((c) => c.proteina_g ?? 0)),
    carbos: suma(comidas.map((c) => c.carbos_g ?? 0)),
    grasa: suma(comidas.map((c) => c.grasa_g ?? 0)),
  };
}

export function metasComoMacros(metas: ObjetivosDiarios): Macros {
  return { kcal: metas.kcal, proteina: metas.proteinaG, carbos: metas.carbosG, grasa: metas.grasaG };
}

/** Comidas del dia que aun no se han registrado y cuya hora no ha pasado del todo. */
export function momentosPendientes(comidas: Comida[], hora: number): MomentoDia[] {
  const hechos = new Set(comidas.map((c) => c.momento));
  return MOMENTOS.filter((m) => !hechos.has(m.id) && hora < m.hasta + 1).map((m) => m.id);
}

export interface Lectura {
  tono: 'bien' | 'aviso' | 'alerta' | 'info';
  texto: string;
}

export interface BalanceDia {
  consumido: Macros;
  objetivo: Macros;
  restante: Macros;
  /** Porcentaje cubierto de cada macro, 0-999. */
  pct: Macros;
  /** Fraccion del dia que ya deberia estar comida segun la hora. */
  esperado: number;
  lecturas: Lectura[];
}

const PALABRAS_VERDURA = /ensalada|verdura|brocoli|espinaca|tomate|zanahoria|pimiento|calabacin|champi|lechuga|judias|acelga|coliflor|berenjena|pepino|fruta|platano|manzana|naranja|pera|fresa|arandano|kiwi|uva|sandia|melon/i;

/** Como vas hoy y lo que diria un nutricionista al verlo. */
export function balanceDia(
  comidas: Comida[],
  metas: ObjetivosDiarios,
  hora: number,
  opciones: { entrenoHoy?: boolean } = {},
): BalanceDia {
  const consumido = macrosDe(comidas);
  const objetivo = metasComoMacros(metas);
  const restante: Macros = {
    kcal: objetivo.kcal - consumido.kcal,
    proteina: objetivo.proteina - consumido.proteina,
    carbos: objetivo.carbos - consumido.carbos,
    grasa: objetivo.grasa - consumido.grasa,
  };
  const pct: Macros = {
    kcal: objetivo.kcal ? r((consumido.kcal / objetivo.kcal) * 100) : 0,
    proteina: objetivo.proteina ? r((consumido.proteina / objetivo.proteina) * 100) : 0,
    carbos: objetivo.carbos ? r((consumido.carbos / objetivo.carbos) * 100) : 0,
    grasa: objetivo.grasa ? r((consumido.grasa / objetivo.grasa) * 100) : 0,
  };
  const esperado = suma(MOMENTOS.filter((m) => hora >= m.hasta).map((m) => m.peso));
  const lecturas: Lectura[] = [];
  const pendientes = momentosPendientes(comidas, hora);
  const finDelDia = hora >= 21 || pendientes.length === 0;

  if (!comidas.length) {
    lecturas.push({
      tono: 'info',
      texto: hora < 11
        ? `Objetivo de hoy: ${objetivo.kcal} kcal con ${objetivo.proteina} g de proteina. Empieza el dia con 30-40 g de proteina en el desayuno.`
        : 'Aun no has apuntado nada hoy. Apunta lo que llevas y te digo como cuadrar el resto.',
    });
    return { consumido, objetivo, restante, pct, esperado, lecturas };
  }

  // Calorias.
  if (consumido.kcal > objetivo.kcal * 1.1) {
    lecturas.push({
      tono: 'alerta',
      texto: `Llevas ${consumido.kcal} kcal, ${consumido.kcal - objetivo.kcal} por encima del objetivo. ${finDelDia ? 'Manana dia normal, sin compensar pasando hambre.' : 'Lo que quede, proteina y verdura: nada de picar.'}`,
    });
  } else if (finDelDia && consumido.kcal < objetivo.kcal * 0.8) {
    lecturas.push({
      tono: 'aviso',
      texto: `Te quedas en ${consumido.kcal} kcal, bastante por debajo de las ${objetivo.kcal}. Un dia no pasa nada; si se repite, pierdes musculo y energia.`,
    });
  } else if (finDelDia && Math.abs(restante.kcal) <= objetivo.kcal * 0.1) {
    lecturas.push({ tono: 'bien', texto: `Calorias clavadas: ${consumido.kcal} de ${objetivo.kcal}.` });
  }

  // Proteina: es lo que mas cuesta cubrir, se vigila por ritmo.
  const proteinaEsperada = objetivo.proteina * Math.max(esperado, 0.25);
  if (consumido.proteina >= objetivo.proteina * 0.95) {
    lecturas.push({ tono: 'bien', texto: `Proteina cubierta: ${consumido.proteina} g de ${objetivo.proteina}.` });
  } else if (finDelDia) {
    lecturas.push({
      tono: restante.proteina > objetivo.proteina * 0.3 ? 'alerta' : 'aviso',
      texto: `Te faltan ${r(restante.proteina)} g de proteina. ${hora < 23 ? 'Un yogur batido, 2 huevos o un batido antes de dormir lo arreglan.' : 'Manana mete 30-40 g en cada comida.'}`,
    });
  } else if (consumido.proteina < proteinaEsperada * 0.7 && hora >= 13) {
    const porComida = pendientes.length ? r(restante.proteina / pendientes.length) : r(restante.proteina);
    lecturas.push({
      tono: 'aviso',
      texto: `Vas corto de proteina: ${consumido.proteina} g a esta hora. Te quedan ${r(restante.proteina)} g, unos ${porComida} g en cada comida que falta.`,
    });
  }

  // Grasa: pasarse es lo habitual cuando se come fuera.
  if (consumido.grasa > objetivo.grasa * 1.25) {
    lecturas.push({
      tono: 'aviso',
      texto: `Grasa alta: ${consumido.grasa} g de ${objetivo.grasa}. Lo que queda, sin aceite extra, frutos secos ni quesos.`,
    });
  }

  // Carbohidratos: el dia de entreno son gasolina, no enemigo.
  if (opciones.entrenoHoy && !finDelDia && pct.carbos < 40 && hora >= 14) {
    lecturas.push({
      tono: 'info',
      texto: `Hoy has entrenado y llevas solo ${consumido.carbos} g de carbos de ${objetivo.carbos}: arroz, patata o pasta en la siguiente comida para recuperar.`,
    });
  } else if (!opciones.entrenoHoy && consumido.carbos > objetivo.carbos * 1.2) {
    lecturas.push({
      tono: 'aviso',
      texto: `Carbos por encima (${consumido.carbos} g de ${objetivo.carbos}) en un dia sin entreno. Cena de proteina y verdura.`,
    });
  }

  // Verdura y fruta.
  if (hora >= 16 && !comidas.some((c) => PALABRAS_VERDURA.test(c.descripcion))) {
    lecturas.push({ tono: 'info', texto: 'No veo verdura ni fruta hoy. Mete un plato de verdura en la cena: fibra, saciedad y micronutrientes.' });
  }

  // Alcohol.
  const alcohol = suma(comidas.map((c) => Number(c.alcohol_ud ?? 0)));
  if (alcohol >= 2) {
    lecturas.push({ tono: 'aviso', texto: `${alcohol} unidades de alcohol hoy: son ${r(alcohol * 90)} kcal vacias y peor sueno. Agua el resto del dia.` });
  }

  return { consumido, objetivo, restante, pct, esperado, lecturas: lecturas.slice(0, 4) };
}

// ── Sugerencias de comidas ────────────────────────────────────────────

interface Plantilla {
  momento: MomentoDia;
  titulo: string;
  proteina: string;
  carbo: string;
  grasa: string;
  /** Guarnicion fija: verdura o fruta con gramos cerrados. */
  fijos: { id: string; gramos: number }[];
  etiquetas: string[];
}

const PLANTILLAS: Plantilla[] = [
  { momento: 'desayuno', titulo: 'Avena con queso batido, platano y nueces', proteina: 'skyr', carbo: 'avena', grasa: 'nueces', fijos: [{ id: 'platano', gramos: 100 }], etiquetas: ['lacteo', 'gluten', 'frutos_secos', 'veg'] },
  { momento: 'desayuno', titulo: 'Tostadas con huevos revueltos y aguacate', proteina: 'huevo', carbo: 'pan_integral', grasa: 'aguacate', fijos: [{ id: 'tomate', gramos: 80 }], etiquetas: ['huevo', 'gluten', 'veg'] },
  { momento: 'desayuno', titulo: 'Yogur griego con avena, fruta y almendras', proteina: 'skyr', carbo: 'avena', grasa: 'almendras', fijos: [{ id: 'fresas', gramos: 120 }], etiquetas: ['lacteo', 'gluten', 'frutos_secos', 'veg'] },
  { momento: 'desayuno', titulo: 'Tortilla de claras con pan y jamon', proteina: 'clara', carbo: 'pan_integral', grasa: 'aceite', fijos: [{ id: 'jamon_serrano', gramos: 30 }], etiquetas: ['huevo', 'gluten', 'carne'] },

  { momento: 'comida', titulo: 'Pollo a la plancha con arroz y verduras', proteina: 'pollo_pechuga', carbo: 'arroz_cocido', grasa: 'aceite', fijos: [{ id: 'verduras', gramos: 150 }], etiquetas: ['carne'] },
  { momento: 'comida', titulo: 'Ternera con patata asada y ensalada', proteina: 'ternera', carbo: 'patata', grasa: 'aceite', fijos: [{ id: 'ensalada', gramos: 150 }], etiquetas: ['carne'] },
  { momento: 'comida', titulo: 'Salmon con quinoa y brocoli', proteina: 'salmon', carbo: 'quinoa', grasa: 'aceite', fijos: [{ id: 'brocoli', gramos: 150 }], etiquetas: ['pescado'] },
  { momento: 'comida', titulo: 'Pasta con atun, tomate y aceite de oliva', proteina: 'atun_natural', carbo: 'pasta_cocida', grasa: 'aceite', fijos: [{ id: 'tomate', gramos: 120 }], etiquetas: ['pescado', 'gluten'] },
  { momento: 'comida', titulo: 'Lentejas con tofu y verduras', proteina: 'tofu', carbo: 'lentejas', grasa: 'aceite', fijos: [{ id: 'verduras', gramos: 150 }], etiquetas: ['veg', 'vegano'] },
  { momento: 'comida', titulo: 'Lomo de cerdo con boniato y pimientos', proteina: 'cerdo_lomo', carbo: 'boniato', grasa: 'aceite', fijos: [{ id: 'pimiento', gramos: 120 }], etiquetas: ['carne'] },

  { momento: 'snack', titulo: 'Queso batido con platano y nueces', proteina: 'skyr', carbo: 'platano', grasa: 'nueces', fijos: [], etiquetas: ['lacteo', 'frutos_secos', 'veg'] },
  { momento: 'snack', titulo: 'Batido de proteina con avena y crema de cacahuete', proteina: 'whey', carbo: 'avena', grasa: 'crema_cacahuete', fijos: [], etiquetas: ['lacteo', 'gluten', 'frutos_secos', 'veg'] },
  { momento: 'snack', titulo: 'Bocadillo de pavo con tomate', proteina: 'pavo', carbo: 'pan_integral', grasa: 'aceite', fijos: [{ id: 'tomate', gramos: 60 }], etiquetas: ['carne', 'gluten'] },
  { momento: 'snack', titulo: 'Yogur con manzana y almendras', proteina: 'yogur', carbo: 'manzana', grasa: 'almendras', fijos: [], etiquetas: ['lacteo', 'frutos_secos', 'veg'] },

  { momento: 'cena', titulo: 'Merluza al horno con patata y verduras', proteina: 'merluza', carbo: 'patata', grasa: 'aceite', fijos: [{ id: 'verduras', gramos: 200 }], etiquetas: ['pescado'] },
  { momento: 'cena', titulo: 'Tortilla francesa con ensalada y pan', proteina: 'huevo', carbo: 'pan_integral', grasa: 'aceite', fijos: [{ id: 'ensalada', gramos: 150 }], etiquetas: ['huevo', 'gluten', 'veg'] },
  { momento: 'cena', titulo: 'Pollo salteado con champinones y boniato', proteina: 'pollo_muslo', carbo: 'boniato', grasa: 'aceite', fijos: [{ id: 'champinones', gramos: 120 }], etiquetas: ['carne'] },
  { momento: 'cena', titulo: 'Gambas al ajillo con arroz y calabacin', proteina: 'gambas', carbo: 'arroz_cocido', grasa: 'aceite', fijos: [{ id: 'calabacin', gramos: 150 }], etiquetas: ['marisco'] },
  { momento: 'cena', titulo: 'Tofu salteado con verduras y quinoa', proteina: 'tofu', carbo: 'quinoa', grasa: 'aceite', fijos: [{ id: 'verduras', gramos: 200 }], etiquetas: ['veg', 'vegano'] },
];

/** Gramos minimos y maximos razonables por alimento cuando hace de fuente principal. */
const LIMITES: Record<string, [number, number]> = {
  whey: [15, 60], huevo: [55, 220], clara: [66, 264], skyr: [100, 300], yogur: [125, 250],
  avena: [30, 100], pan_integral: [30, 150], platano: [80, 200], manzana: [100, 250],
  aceite: [0, 25], nueces: [0, 40], almendras: [0, 40], crema_cacahuete: [0, 40], aguacate: [0, 120],
};
const LIMITE_PROTEINA: [number, number] = [80, 250];
const LIMITE_CARBO: [number, number] = [0, 400];

const porId = (id: string): Alimento | undefined => ALIMENTOS.find((a) => a.id === id);
const limites = (id: string, base: [number, number]) => LIMITES[id] ?? base;
const acotar = (x: number, [min, max]: [number, number]) => Math.max(min, Math.min(max, x));
const aPaso = (g: number, paso: number) => Math.round(g / paso) * paso;

function macrosAlimento(alimento: Alimento, gramos: number): Macros {
  return {
    kcal: (alimento.kcal * gramos) / 100,
    proteina: (alimento.proteina * gramos) / 100,
    carbos: (alimento.carbos * gramos) / 100,
    grasa: (alimento.grasa * gramos) / 100,
  };
}
const sumarMacros = (xs: Macros[]): Macros => ({
  kcal: suma(xs.map((x) => x.kcal)), proteina: suma(xs.map((x) => x.proteina)),
  carbos: suma(xs.map((x) => x.carbos)), grasa: suma(xs.map((x) => x.grasa)),
});

export interface LineaSugerida { id: string; nombre: string; gramos: number }

export interface SugerenciaComida {
  momento: MomentoDia;
  etiqueta: string;
  titulo: string;
  lineas: LineaSugerida[];
  macros: Macros;
  objetivo: Macros;
  /** Texto listo para la calculadora / registro: "150 g pollo, 200 g arroz cocido…". */
  texto: string;
}

/** Que evita cada persona, a partir de alergias y preferencias en texto libre. */
export function restricciones(alergias: string[], preferencias: string | null): Set<string> {
  const texto = [...alergias, preferencias ?? ''].join(' ').toLowerCase();
  const fuera = new Set<string>();
  if (/lact|leche|lacteo/.test(texto)) fuera.add('lacteo');
  if (/gluten|celiac|trigo/.test(texto)) fuera.add('gluten');
  if (/huevo/.test(texto)) fuera.add('huevo');
  if (/pescado/.test(texto)) fuera.add('pescado');
  if (/marisco|gamba|crustaceo/.test(texto)) fuera.add('marisco');
  if (/fruto.? seco|nuez|nueces|almendra|cacahuete/.test(texto)) fuera.add('frutos_secos');
  if (/vegano|vegana/.test(texto)) { fuera.add('carne'); fuera.add('pescado'); fuera.add('marisco'); fuera.add('lacteo'); fuera.add('huevo'); }
  else if (/vegetarian/.test(texto)) { fuera.add('carne'); fuera.add('pescado'); fuera.add('marisco'); }
  if (/sin carne|no como carne/.test(texto)) fuera.add('carne');
  return fuera;
}

/** Segunda fuente de proteina cuando la principal no llega ni al maximo razonable. */
const COMPLEMENTOS: { id: string; etiquetas: string[]; max: number }[] = [
  { id: 'clara', etiquetas: ['huevo'], max: 200 },
  { id: 'skyr', etiquetas: ['lacteo'], max: 250 },
  { id: 'pavo', etiquetas: ['carne'], max: 120 },
  { id: 'atun_natural', etiquetas: ['pescado'], max: 160 },
  { id: 'tofu', etiquetas: [], max: 200 },
];

/** Cuadra una plantilla a los macros objetivo de esa comida. */
function resolverPlantilla(p: Plantilla, objetivo: Macros, fuera: Set<string> = new Set()): SugerenciaComida | null {
  const prot = porId(p.proteina);
  const carbo = porId(p.carbo);
  const grasa = porId(p.grasa);
  if (!prot || !carbo || !grasa) return null;
  const fijos = p.fijos.map((f) => ({ alimento: porId(f.id)!, gramos: f.gramos })).filter((f) => f.alimento);
  const base = sumarMacros(fijos.map((f) => macrosAlimento(f.alimento, f.gramos)));

  // 1. Proteina: la fuente principal cubre lo que falta tras la guarnicion.
  let gProt = ((objetivo.proteina - base.proteina) / Math.max(prot.proteina, 1)) * 100;
  gProt = acotar(gProt, limites(prot.id, LIMITE_PROTEINA));
  gProt = prot.porcion && prot.porcion.gramos >= 30 ? Math.max(prot.porcion.gramos, aPaso(gProt, prot.porcion.gramos)) : aPaso(gProt, 10);
  let mProt = macrosAlimento(prot, gProt);

  // 1b. Si aun faltan mas de 15 g de proteina, entra una segunda fuente.
  let complemento: { alimento: Alimento; gramos: number } | null = null;
  const faltaProteina = objetivo.proteina - base.proteina - mProt.proteina;
  if (faltaProteina > 15) {
    const extra = COMPLEMENTOS.find((c) => c.id !== prot.id && !c.etiquetas.some((e) => fuera.has(e)));
    const alimento = extra ? porId(extra.id) : undefined;
    if (extra && alimento) {
      let g = (faltaProteina / Math.max(alimento.proteina, 1)) * 100;
      g = acotar(g, [alimento.porcion?.gramos ?? 30, extra.max]);
      g = alimento.porcion && alimento.porcion.gramos >= 50 ? aPaso(g, alimento.porcion.gramos) : aPaso(g, 10);
      complemento = { alimento, gramos: g };
      mProt = sumarMacros([mProt, macrosAlimento(alimento, g)]);
    }
  }

  // 2. Carbohidrato: lo que quede tras proteina y guarnicion.
  let gCarbo = ((objetivo.carbos - base.carbos - mProt.carbos) / Math.max(carbo.carbos, 1)) * 100;
  gCarbo = acotar(gCarbo, limites(carbo.id, LIMITE_CARBO));
  gCarbo = carbo.porcion && carbo.porcion.gramos >= 80 ? Math.max(0, aPaso(gCarbo, carbo.porcion.gramos)) : aPaso(gCarbo, 10);
  const mCarbo = macrosAlimento(carbo, gCarbo);

  // 3. Grasa anadida: solo si aun falta tras lo anterior.
  let gGrasa = ((objetivo.grasa - base.grasa - mProt.grasa - mCarbo.grasa) / Math.max(grasa.grasa, 1)) * 100;
  gGrasa = aPaso(acotar(gGrasa, limites(grasa.id, [0, 40])), 5);
  const mGrasa = macrosAlimento(grasa, gGrasa);

  const lineas: LineaSugerida[] = [
    { id: prot.id, nombre: prot.nombre, gramos: gProt },
    ...(complemento ? [{ id: complemento.alimento.id, nombre: complemento.alimento.nombre, gramos: complemento.gramos }] : []),
    ...(gCarbo > 0 ? [{ id: carbo.id, nombre: carbo.nombre, gramos: gCarbo }] : []),
    ...(gGrasa > 0 ? [{ id: grasa.id, nombre: grasa.nombre, gramos: gGrasa }] : []),
    ...fijos.map((f) => ({ id: f.alimento.id, nombre: f.alimento.nombre, gramos: f.gramos })),
  ];
  const total = sumarMacros([mProt, mCarbo, mGrasa, base]);
  const macros: Macros = { kcal: r(total.kcal), proteina: r(total.proteina), carbos: r(total.carbos), grasa: r(total.grasa) };
  const momento = MOMENTOS.find((m) => m.id === p.momento)!;
  return {
    momento: p.momento,
    etiqueta: momento.etiqueta,
    titulo: p.titulo,
    lineas,
    macros,
    objetivo: { kcal: r(objetivo.kcal), proteina: r(objetivo.proteina), carbos: r(objetivo.carbos), grasa: r(objetivo.grasa) },
    texto: lineas.map((l) => `${l.gramos} g ${l.nombre.toLowerCase()}`).join(', '),
  };
}

/**
 * Propone que comer en las comidas que faltan para cuadrar lo que queda del
 * objetivo. Devuelve hasta dos opciones por comida, ordenadas por lo que se
 * acercan a los macros; `semilla` rota las opciones para no repetir siempre.
 */
export function sugerirComidas(
  restante: Macros,
  pendientes: MomentoDia[],
  opciones: { alergias?: string[]; preferencias?: string | null; semilla?: number } = {},
): { momento: MomentoDia; etiqueta: string; objetivo: Macros; opciones: SugerenciaComida[] }[] {
  if (!pendientes.length || restante.kcal < 150) return [];
  const fuera = restricciones(opciones.alergias ?? [], opciones.preferencias ?? null);
  const pesoTotal = suma(pendientes.map((id) => MOMENTOS.find((m) => m.id === id)?.peso ?? 0)) || 1;
  const semilla = opciones.semilla ?? 0;

  return pendientes.map((id) => {
    const momento = MOMENTOS.find((m) => m.id === id)!;
    const parte = momento.peso / pesoTotal;
    const objetivo: Macros = {
      kcal: Math.max(0, restante.kcal * parte),
      proteina: Math.max(0, restante.proteina * parte),
      carbos: Math.max(0, restante.carbos * parte),
      grasa: Math.max(0, restante.grasa * parte),
    };
    const candidatas = PLANTILLAS
      .filter((p) => p.momento === id && !p.etiquetas.some((e) => fuera.has(e)))
      .map((p) => resolverPlantilla(p, objetivo, fuera))
      .filter((s): s is SugerenciaComida => s !== null)
      .map((s) => ({
        s,
        error: Math.abs(s.macros.kcal - objetivo.kcal) / Math.max(objetivo.kcal, 1) + Math.abs(s.macros.proteina - objetivo.proteina) / Math.max(objetivo.proteina, 1),
      }))
      .sort((a, b) => a.error - b.error);
    // Entre las que cuadran bien, rota por dia para variar.
    const buenas = candidatas.filter((c) => c.error <= 0.35);
    const lista = (buenas.length >= 2 ? buenas : candidatas).map((c) => c.s);
    const giro = lista.length ? semilla % lista.length : 0;
    const rotada = [...lista.slice(giro), ...lista.slice(0, giro)];
    return { momento: id, etiqueta: momento.etiqueta, objetivo, opciones: rotada.slice(0, 2) };
  }).filter((grupo) => grupo.opciones.length);
}
