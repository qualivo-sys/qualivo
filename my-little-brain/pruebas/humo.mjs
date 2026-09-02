/**
 * Prueba de humo del dominio: ejecuta todas las herramientas del coach contra un
 * Supabase falso en memoria y comprueba que lo que se guarda, se agrega y se le
 * cuenta al modelo es lo correcto. No llama a la API de Claude ni a Supabase.
 *
 *   npm run prueba
 */
import { crearSupabaseFalso } from './supabase-falso.mjs';
const L = '../.pruebas/lib';
const { ejecutarHerramienta, HERRAMIENTAS } = await import(`${L}/ia/herramientas.js`);
const { cargarPanel, cargarSesionesMotor } = await import(`${L}/datos.js`);
const { construirContexto } = await import(`${L}/ia/contexto.js`);
const { estadisticasSemana, promptRevision, parsearRevision } = await import(`${L}/ia/revision.js`);
const { sugerencia } = await import(`${L}/motor/progresion.js`);
const { hoy, sumarDias } = await import(`${L}/fechas.js`);

let fallos = 0;
const check = (nombre, condicion, extra = '') => {
  console.log(`${condicion ? 'OK  ' : 'FALLO'} ${nombre}${extra ? ' → ' + extra : ''}`);
  if (!condicion) fallos++;
};

const perfil = {
  id: 'u1', email: 'maikel@test.com', nombre: 'Maikel', sexo: 'hombre', edad: 34, altura_cm: 180,
  ocupacion: 'Agencia de IA', objetivo: 'recomposicion', objetivos_extra: [], nivel: 'intermedio',
  dias_semana: 4, entorno: 'gimnasio', actividad: 'ligera', limitaciones: ['hombro'], alergias: [],
  preferencias_comida: null, horario_comidas: null, alcohol_semanal: 4, hora_dormir: '00:30',
  hora_despertar: '07:00', zona_horaria: 'Europe/Madrid', plan: 'pro', onboarding: true,
  notas: null, creado: '2026-01-01', actualizado: '2026-01-01',
};

const supabase = crearSupabaseFalso({ perfiles: [perfil] });
const ctx = { supabase, userId: 'u1', perfil, hoy: hoy() };

// ── 1. Cada herramienta se ejecuta y escribe donde debe ────────────────
const llamadas = [
  ['registrar_comida', { descripcion: 'Hamburguesa y una cerveza', kcal: 950, proteina_g: 45, carbos_g: 70, grasa_g: 50, alcohol_ud: 1, confianza: 'media', momento: 'cena' }],
  ['registrar_peso', { peso_kg: 82.4, cintura_cm: 92, cuello_cm: 39 }],
  ['registrar_entrenamiento', { nombre: 'Torso A', sensacion: 4, ejercicios: [
      { nombre: 'press banca', series: [{ peso_kg: 80, reps: 8, rir: 1 }, { peso_kg: 80, reps: 8, rir: 1 }, { peso_kg: 80, reps: 8, rir: 2 }] },
      { nombre: 'jalon al pecho', series: [{ peso_kg: 60, reps: 12, rir: 2 }] }] }],
  ['registrar_foco', { categoria: 'idiomas', minutos: 45, descripcion: 'Ingles' }],
  ['registrar_bienestar', { sueno_horas: 5.5, animo: 6, energia: 4, estres: 7 }],
  ['registrar_habito', { nombre: '10.000 pasos' }],
  ['crear_habito', { nombre: 'Leer 20 min', emoji: '📚', veces_por_semana: 5 }],
  ['crear_objetivo', { area: 'negocio', titulo: 'Cerrar 3 clientes nuevos' }],
  ['crear_tarea', { titulo: 'Preparar propuesta EAC', prioridad: 1 }],
  ['recordar', { clave: 'lesion_hombro', valor: 'Molestia en el hombro derecho desde 2025' }],
  ['generar_plan_entreno', {}],
  ['consultar_historial', { dias: 14 }],
];

for (const [nombre, entrada] of llamadas) {
  const resultado = await ejecutarHerramienta(nombre, entrada, ctx);
  const ok = !resultado.texto.startsWith('Error') && !resultado.texto.startsWith('Herramienta desconocida');
  check(`herramienta ${nombre}`, ok, ok ? resultado.texto.split('\n')[0].slice(0, 70) : resultado.texto);
}

check('todas las herramientas declaradas se pueden ejecutar',
  HERRAMIENTAS.every((h) => h.name === 'actualizar_perfil' || llamadas.some(([n]) => n === h.name)),
  `${HERRAMIENTAS.length} declaradas`);

// El nombre libre se empareja con el catalogo
const series = supabase.db.tablas.series ?? [];
check('empareja "press banca" con el catalogo',
  series.some((s) => s.ejercicio_id === 'press_banca' && s.ejercicio_nombre === 'Press de banca con barra'));
check('guarda las 4 series del entreno', series.length === 4, `${series.length} series`);
check('el plan generado excluye lo que agrava el hombro',
  !JSON.stringify(supabase.db.tablas.planes_entreno[0].datos).includes('press_militar_barra') &&
  !JSON.stringify(supabase.db.tablas.planes_entreno[0].datos).includes('fondos_paralelas'));
check('el plan tiene 4 dias', supabase.db.tablas.planes_entreno[0].datos.dias.length === 4);

// ── 2. actualizar_perfil ───────────────────────────────────────────────
await ejecutarHerramienta('actualizar_perfil', { objetivo: 'perder_grasa', dias_semana: 3 }, ctx);
check('actualizar_perfil escribe en perfiles',
  supabase.db.tablas.perfiles[0].objetivo === 'perder_grasa' && supabase.db.tablas.perfiles[0].dias_semana === 3);

// ── 3. Panel completo ──────────────────────────────────────────────────
const panel = await cargarPanel(supabase, 'u1', supabase.db.tablas.perfiles[0]);
check('el panel calcula las calorias objetivo', panel.metas !== null, `${panel.metas?.kcal} kcal / ${panel.metas?.proteinaG} g prot`);
check('el panel ve el peso de hoy', panel.cuerpo.peso === 82.4);
check('estima la grasa corporal', panel.cuerpo.grasaPct !== null, `${panel.cuerpo.grasaPct?.toFixed(1)} %`);
check('suma las calorias de hoy', panel.diaHoy.kcal === 950, `${panel.diaHoy.kcal} kcal`);
check('cuenta el entreno de hoy', panel.diaHoy.entreno === true);
check('cuenta los minutos de foco', panel.diaHoy.focoMin === 45);
check('acumula XP y nivel', panel.progreso.xp > 0, `${panel.progreso.xp} XP, nivel ${panel.progreso.nivel}`);
check('puntua las areas', panel.puntuaciones.global !== null, JSON.stringify(panel.puntuaciones));

// ── 4. Contexto para el coach ──────────────────────────────────────────
const contexto = construirContexto(panel);
for (const clave of ['PERFIL', 'OBJETIVOS DIARIOS', 'CUERPO', 'HOY', 'ESTA SEMANA', 'PLAN DE ENTRENO', 'memoria']) {
  check(`el contexto incluye ${clave}`, contexto.includes(clave));
}
check('el contexto lleva la memoria a largo plazo', contexto.includes('Molestia en el hombro derecho'));
check('el contexto no es enorme', contexto.length < 9000, `${contexto.length} caracteres`);

// ── 5. Progresion sobre datos reales ───────────────────────────────────
const sesiones = await cargarSesionesMotor(supabase, 'u1', sumarDias(hoy(), -90));
check('reconstruye las sesiones para el motor', sesiones.length === 1 && sesiones[0].ejercicios.length === 2);
const bloque = { ejercicioId: 'press_banca', rol: 'principal', series: 3, repMin: 6, repMax: 8, rir: 2, descansoSeg: 150 };
const consejo = sugerencia(bloque, sesiones);
check('propone subir peso tras cerrar el rango', consejo.tipo === 'subir' && consejo.pesoKg === 82.5, consejo.texto);

// ── 5b. Señales proactivas y logros ────────────────────────────────────
const { senales } = await import(`${L}/motor/senales.js`);
const { logros } = await import(`${L}/motor/logros.js`);

const lecturas = senales({
  dias: panel.dias, hoy: hoy(), objetivoEntrenos: 4,
  metaKcal: panel.metas.kcal, metaProteina: panel.metas.proteinaG,
  tendenciaPeso: null, ritmoObjetivo: panel.metas.ritmoKgSemana, racha: panel.racha,
});
check('detecta que duerme poco', lecturas.some((s) => s.id === 'sueno_corto'),
  lecturas.map((s) => s.id).join(', '));
check('las senales vienen ordenadas por peso',
  lecturas.every((s, i) => i === 0 || lecturas[i - 1].peso >= s.peso));

const sinDatos = senales({
  dias: panel.dias.map((d) => ({ ...d, comidas: 0, kcal: 0, entreno: false, focoMin: 0, animo: null, suenoHoras: null, alcoholUd: 0 })),
  hoy: hoy(), objetivoEntrenos: 4, metaKcal: 2000, metaProteina: 150,
  tendenciaPeso: null, ritmoObjetivo: -0.5, racha: 0,
});
check('avisa cuando lleva dias sin registrar', sinDatos.some((s) => s.id === 'sin_registrar'));

const insignias = logros({
  dias: panel.dias, racha: panel.racha, entrenosTotales: 1, comidasTotales: 1,
  tonelajeTotal: 1920, revisiones: 0, pesajes: 1,
});
check('los logros se calculan con progreso acotado',
  insignias.length === 9 && insignias.every((l) => l.progreso >= 0 && l.progreso <= 1));
check('el primer logro ya esta conseguido', insignias[0].conseguido === true);

// ── 5c. Lectura del streaming del coach ────────────────────────────────
const { leerSSE } = await import(`${L}/sse.js`);
const trozos = [
  'event: texto\ndata: {"delta":"Apun"}\n\nevent: texto\ndata: {"delta":"tado. "}\n\nev',
  'ent: accion\ndata: {"herramienta":"registrar_comida","resumen":"Cerveza · 150 kcal","xp":5}\n\n',
  'event: mal\ndata: {roto\n\nevent: fin\ndata: {"texto":"Apuntado. Manana toca pierna.","acciones":[]}\n\n',
];
const flujo = new ReadableStream({
  start(c) { const e = new TextEncoder(); trozos.forEach((t) => c.enqueue(e.encode(t))); c.close(); },
});
const eventos = [];
for await (const evento of leerSSE(flujo)) eventos.push(evento);
check('el lector SSE junta los deltas partidos entre chunks',
  eventos.filter((e) => e.evento === 'texto').map((e) => e.datos.delta).join('') === 'Apuntado. ');
check('el lector SSE entrega las acciones', eventos.some((e) => e.evento === 'accion' && e.datos.xp === 5));
check('un bloque corrupto no rompe el resto',
  eventos[eventos.length - 1].evento === 'fin' && eventos[eventos.length - 1].datos.texto.includes('pierna'));

// ── 6. Revision semanal ────────────────────────────────────────────────
const stats = estadisticasSemana(panel, panel.dias[panel.dias.length - 1].fecha.slice(0, 8) + '01' > '' ? (await import(`${L}/fechas.js`)).inicioSemana(hoy()) : hoy());
check('las estadisticas de la semana cuadran', stats.entrenos === 1 && stats.alcoholTotal === 1, `entrenos ${stats.entrenos}, alcohol ${stats.alcoholTotal}`);
const prompt = promptRevision(panel, stats);
check('el prompt de la revision lleva los numeros', prompt.includes('NUMEROS DE LA SEMANA') && prompt.includes('DIA A DIA'));
const revision = parsearRevision('```json\n{"titular":"Semana solida","cuerpo":"Bien","cuello_botella":"El sueno","victorias":["a","b"],"acciones":["x","y","z"]}\n```');
check('parsea la revision aunque venga en un bloque de codigo',
  revision?.titular === 'Semana solida' && revision.acciones.length === 3 && revision.errores.length === 0);
check('devuelve null si no hay JSON', parsearRevision('lo siento, no puedo') === null);

console.log(fallos ? `\n${fallos} COMPROBACIONES FALLIDAS` : '\nTodo correcto.');
process.exit(fallos ? 1 : 0);
