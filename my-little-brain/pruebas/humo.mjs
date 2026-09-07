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
// La misma fecha que usa la app: la de la zona del perfil, no la de UTC.
// Con hoy() a secas las pruebas fallaban cada noche entre las 22:00 y las
// 00:00 UTC, cuando en Madrid ya es el dia siguiente.
const HOY = hoy(perfil.zona_horaria);
const ctx = { supabase, userId: 'u1', perfil, hoy: HOY };

// ── 1. Cada herramienta se ejecuta y escribe donde debe ────────────────
const llamadas = [
  ['calcular_comida', { texto: '200 g pollo, 150 arroz, 1 cucharada de aceite y un platano' }],
  ['registrar_comida', { descripcion: 'Hamburguesa y una cerveza', kcal: 950, proteina_g: 45, carbos_g: 70, grasa_g: 50, alcohol_ud: 1, confianza: 'media', momento: 'cena' }],
  ['registrar_peso', { peso_kg: 82.4, cintura_cm: 92, cuello_cm: 39 }],
  ['registrar_entrenamiento', { nombre: 'Torso A', sensacion: 4, ejercicios: [
      { nombre: 'press banca', series: [{ peso_kg: 80, reps: 8, rir: 1 }, { peso_kg: 80, reps: 8, rir: 1 }, { peso_kg: 80, reps: 8, rir: 2 }] },
      { nombre: 'jalon al pecho', series: [{ peso_kg: 60, reps: 12, rir: 2 }] }] }],
  ['registrar_foco', { categoria: 'idiomas', minutos: 45, descripcion: 'Ingles' }],
  ['registrar_foco', { categoria: 'aprendizaje', actividad: 'Guitarra', minutos: 30 }],
  ['registrar_bienestar', { sueno_inicio: '01:15', sueno_fin: '06:45', animo: 6, energia: 4, estres: 7, cafes: 3, cafeina_ultima: '18:30' }],
  ['registrar_agua', { vasos: 2 }],
  ['registrar_habito', { nombre: '10.000 pasos' }],
  ['crear_habito', { nombre: 'Leer 20 min', emoji: '📚', veces_por_semana: 5 }],
  ['crear_objetivo', { area: 'negocio', titulo: 'Cerrar 3 clientes nuevos' }],
  ['crear_tarea', { titulo: 'Preparar propuesta EAC', prioridad: 1 }],
  ['recordar', { clave: 'lesion_hombro', valor: 'Molestia en el hombro derecho desde 2025' }],
  ['generar_plan_entreno', {}],
  ['cambiar_ejercicio', { ejercicio_actual: 'press de banca', ejercicio_nuevo: 'press de banca con mancuernas' }],
  ['registrar_gasto', { importe: 18, categoria: 'restaurantes', descripcion: 'Menu del mediodia' }],
  ['anotar_preocupacion', { texto: 'Caja baja este mes' }],
  ['retirar_preocupacion', { texto: 'Caja baja', accion: 'Cobre la factura del cliente A' }],
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

// El coach crea la actividad la primera vez y la reutiliza despues
check('el coach crea la actividad que le nombras', (supabase.db.tablas.actividades_tiempo ?? []).some((a) => a.nombre === 'Guitarra'),
  JSON.stringify(supabase.db.tablas.actividades_tiempo ?? []));
await ejecutarHerramienta('registrar_foco', { categoria: 'aprendizaje', actividad: 'guitarra', minutos: 20 }, ctx);
check('y no la duplica aunque la escribas distinto', (supabase.db.tablas.actividades_tiempo ?? []).filter((a) => /guitarra/i.test(a.nombre)).length === 1,
  JSON.stringify((supabase.db.tablas.actividades_tiempo ?? []).map((a) => a.nombre)));
check('el rato queda atado a la actividad', (supabase.db.tablas.foco ?? []).filter((f) => f.actividad_id).length === 2,
  JSON.stringify((supabase.db.tablas.foco ?? []).map((f) => ({ m: f.minutos, a: f.actividad_id }))));

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
check('cuenta los minutos de foco', panel.diaHoy.focoMin === 95, `${panel.diaHoy.focoMin} min`); // 45 idiomas + 30 y 20 de guitarra
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
const sesiones = await cargarSesionesMotor(supabase, 'u1', sumarDias(HOY, -90));
check('reconstruye las sesiones para el motor', sesiones.length === 1 && sesiones[0].ejercicios.length === 2);
const bloque = { ejercicioId: 'press_banca', rol: 'principal', series: 3, repMin: 6, repMax: 8, rir: 2, descansoSeg: 150 };
const consejo = sugerencia(bloque, sesiones);
check('propone subir peso tras cerrar el rango', consejo.tipo === 'subir' && consejo.pesoKg === 82.5, consejo.texto);

// ── 5a. Calculadora de comidas ─────────────────────────────────────────
const { calcularComida, buscarAlimento } = await import(`${L}/motor/alimentos.js`);
const plato = calcularComida('200 g pollo, 150 arroz, 1 cucharada de aceite y un platano');
check('reconoce las 4 partes del plato', plato.lineas.every((l) => l.alimento) && plato.sinReconocer.length === 0,
  plato.lineas.map((l) => `${l.alimento?.nombre} ${l.gramos}g`).join(' | '));
check('calcula kcal y proteina coherentes', plato.kcal > 550 && plato.kcal < 720 && plato.proteina > 45, `${plato.kcal} kcal, ${plato.proteina} P`);
const desayuno = calcularComida('2 huevos y cafe con leche');
check('"cafe con leche" es un alimento, no dos', desayuno.lineas.length === 2 && desayuno.lineas[1].alimento?.id === 'cafe_leche',
  desayuno.lineas.map((l) => l.alimento?.nombre ?? '??').join(' | '));
check('"2 huevos" son dos unidades de 55 g', desayuno.lineas[0].gramos === 110);
const bar = calcularComida('una cana y dos tercios');
check('cuenta unidades de alcohol', bar.alcoholUd >= 2.5 && bar.alcoholUd <= 2.7, `${bar.alcoholUd} ud`);
check('lo desconocido no suma pero se avisa', calcularComida('flan de la abuela, 100 g de xyzabc').sinReconocer.length === 1);
check('busca por alias con plural', buscarAlimento('platanos')?.id === 'platano');

// ── 5a2. Cardio por MET ────────────────────────────────────────────────
const { kcalCardio, enlaceTecnica } = await import(`${L}/motor/cardio.js`);
check('30 min de eliptica a 80 kg rondan las 220 kcal', Math.abs(kcalCardio('eliptica', 30, 80) - 220) <= 5, `${kcalCardio('eliptica', 30, 80)} kcal`);
check('tipo desconocido o minutos 0 dan 0', kcalCardio('xyz', 30, 80) === 0 && kcalCardio('correr', 0, 80) === 0);
check('el enlace de tecnica esta codificado', enlaceTecnica('Press de banca con barra').includes('Press%20de%20banca'));

// ── 5b. Señales proactivas y logros ────────────────────────────────────
const { senales } = await import(`${L}/motor/senales.js`);
const { logros } = await import(`${L}/motor/logros.js`);

const lecturas = senales({
  dias: panel.dias, hoy: HOY, objetivoEntrenos: 4,
  metaKcal: panel.metas.kcal, metaProteina: panel.metas.proteinaG,
  tendenciaPeso: null, ritmoObjetivo: panel.metas.ritmoKgSemana, racha: panel.racha,
});
check('detecta que duerme poco', lecturas.some((s) => s.id === 'sueno_corto'),
  lecturas.map((s) => s.id).join(', '));
check('las senales vienen ordenadas por peso',
  lecturas.every((s, i) => i === 0 || lecturas[i - 1].peso >= s.peso));

const sinDatos = senales({
  dias: panel.dias.map((d) => ({ ...d, comidas: 0, kcal: 0, entreno: false, focoMin: 0, animo: null, suenoHoras: null, alcoholUd: 0 })),
  hoy: HOY, objetivoEntrenos: 4, metaKcal: 2000, metaProteina: 150,
  tendenciaPeso: null, ritmoObjetivo: -0.5, racha: 0,
});
check('avisa cuando lleva dias sin registrar', sinDatos.some((s) => s.id === 'sin_registrar'));

const insignias = logros({
  dias: panel.dias, racha: panel.racha, entrenosTotales: 1, comidasTotales: 1,
  tonelajeTotal: 1920, revisiones: 0, pesajes: 1,
});
check('los logros se calculan con progreso acotado',
  insignias.length === 11 && insignias.every((l) => l.progreso >= 0 && l.progreso <= 1));
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

// ── 5d. Avisos push: que toca a cada hora ──────────────────────────────
const { decidirAvisos, textoAviso } = await import(`${L}/push.js`);
const base = { diaSemana: 3, tieneCheckInManana: false, tieneComidasHoy: false, entrenoHoy: false, entrenoPendienteSemana: true, revisionNueva: false, enviadosHoy: [] };
check('a las 8 manda el aviso de la manana', decidirAvisos({}, { ...base, hora: 8 }).includes('manana'));
check('no repite la manana si ya se envio', !decidirAvisos({}, { ...base, hora: 8, enviadosHoy: ['manana'] }).includes('manana'));
check('no molesta por la manana si ya hizo el check-in', !decidirAvisos({}, { ...base, hora: 8, tieneCheckInManana: true }).includes('manana'));
check('respeta la hora elegida', decidirAvisos({ aviso_manana: '06:30' }, { ...base, hora: 6 }).includes('manana') && !decidirAvisos({ aviso_manana: '06:30' }, { ...base, hora: 8 }).includes('manana'));
check('hora vacia (null) desactiva el aviso', decidirAvisos({ aviso_noche: null }, { ...base, hora: 21 }).length === 0);
check('a las 17 recuerda entrenar solo si faltan sesiones', decidirAvisos({}, { ...base, hora: 17 }).includes('entreno') && !decidirAvisos({}, { ...base, hora: 17, entrenoPendienteSemana: false }).includes('entreno'));
check('el domingo avisa de la revision nueva', decidirAvisos({}, { ...base, hora: 10, diaSemana: 0, revisionNueva: true }).includes('revision'));
const aviso = textoAviso('noche', 'Maikel Echevarria', { racha: 3, kcal: 1450, metaKcal: 2100 });
check('el aviso de la noche abre el check-in con las calorias', aviso.url.includes('checkin=noche') && aviso.cuerpo.includes('1450'));

// ── 6. Revision semanal ────────────────────────────────────────────────
const stats = estadisticasSemana(panel, panel.dias[panel.dias.length - 1].fecha.slice(0, 8) + '01' > '' ? (await import(`${L}/fechas.js`)).inicioSemana(HOY) : HOY);
check('las estadisticas de la semana cuadran', stats.entrenos === 1 && stats.alcoholTotal === 1, `entrenos ${stats.entrenos}, alcohol ${stats.alcoholTotal}`);
const prompt = promptRevision(panel, stats);
check('el prompt de la revision lleva los numeros', prompt.includes('NUMEROS DE LA SEMANA') && prompt.includes('DIA A DIA'));
const revision = parsearRevision('```json\n{"titular":"Semana solida","cuerpo":"Bien","cuello_botella":"El sueno","victorias":["a","b"],"acciones":["x","y","z"]}\n```');
check('parsea la revision aunque venga en un bloque de codigo',
  revision?.titular === 'Semana solida' && revision.acciones.length === 3 && revision.errores.length === 0);
check('devuelve null si no hay JSON', parsearRevision('lo siento, no puedo') === null);

// ── 7. Importar plan de un especialista ────────────────────────────────
const { parsearImportacion, planDesdeImportacion } = await import(`${L}/importar.js`);
const { emparejarEjercicio } = await import(`${L}/motor/ejercicios.js`);
const { planDesactualizado } = await import(`${L}/motor/planificador.js`);
const { metasNutricion, perfilEntreno } = await import(`${L}/perfil.js`);

const emp = emparejarEjercicio('press banca con barra');
check('empareja un ejercicio del catalogo aunque el nombre varie', emp.enCatalogo && /banca/i.test(emp.nombre), emp.id);
const sent = emparejarEjercicio('Sentadilla');
check('una sola palabra elige la variante basica', sent.id === 'sentadilla_barra', sent.id);
check('sentadilla bulgara no cae en la barra', emparejarEjercicio('sentadillas bulgaras').id === 'sentadilla_bulgara', emparejarEjercicio('sentadillas bulgaras').id);
const libre = emparejarEjercicio('Aperturas invertidas en TRX con giro');
check('un ejercicio desconocido se guarda como libre', !libre.enCatalogo && libre.id.startsWith('libre_'), libre.id);

const importado = parsearImportacion(`Claro, aqui tienes:\n\`\`\`json\n{"entreno":{"origen":"Laura, entrenadora","dias":[{"nombre":"Torso","foco":"pecho","ejercicios":[{"nombre":"Press de banca","series":4,"repMin":8,"repMax":10,"rir":2},{"nombre":"Remo con barra","series":3,"repMin":10,"repMax":12},{"nombre":"Aperturas invertidas en TRX con giro","series":3}]},{"nombre":"Pierna","ejercicios":[{"nombre":"Sentadilla","series":5,"repMin":5,"repMax":5,"rir":1,"descansoSeg":180}]}]},"dieta":{"origen":"Pedro, nutricionista","kcal":2100,"proteina_g":160,"grasa_g":65,"resumen":"4 comidas","normas":["sin alcohol entre semana"]}}\n\`\`\``);
check('parsea la importacion aunque venga con texto y bloque de codigo', importado?.entreno?.dias.length === 2 && importado.dieta?.kcal === 2100);
check('sin entreno ni dieta devuelve null', parsearImportacion('{"entreno":null,"dieta":null}') === null && parsearImportacion('nada') === null);
const { plan: planImp, sinCatalogo } = planDesdeImportacion(importado.entreno);
check('el plan importado tiene los dias y ejercicios del documento', planImp.dias.length === 2 && planImp.dias[0].bloques.length === 3 && planImp.firma === 'importado');
check('respeta series, reps, RIR y descanso escritos', (() => { const b = planImp.dias[1].bloques[0]; return b.series === 5 && b.repMin === 5 && b.repMax === 5 && b.rir === 1 && b.descansoSeg === 180; })());
check('completa lo que falta con valores razonables', (() => { const b = planImp.dias[0].bloques[2]; return b.series === 3 && b.repMin >= 8 && b.repMax >= b.repMin && b.rir === 2; })());
check('los ejercicios fuera del catalogo se listan y llevan nombre', sinCatalogo.length >= 1 && planImp.dias[0].bloques.some((b) => b.nombreLibre), sinCatalogo.join(', '));
check('un plan importado no se marca como desactualizado', !planDesactualizado(planImp, perfilEntreno(perfil)));
const metasManual = metasNutricion({ ...perfil, objetivos_manual: { kcal: 2100, proteina_g: 160, carbos_g: 220, grasa_g: 65, fuente: 'dieta de Pedro', fijado_el: "2026-09-01" } }, 82, null);
check('los objetivos manuales mandan sobre los calculados', metasManual?.kcal === 2100 && metasManual.proteinaG === 160 && metasManual.manual === 'dieta de Pedro');
check('sin objetivos manuales la app los calcula', !metasNutricion({ ...perfil, objetivos_manual: null }, 82, null)?.manual);

// ── 8. Nutricion del dia: balance, lectura y sugerencias ───────────────
const { balanceDia, momentosPendientes, sugerirComidas, restricciones } = await import(`${L}/motor/dieta.js`);
const metasDieta = { tmb: 1800, gastoTotal: 2500, kcal: 2200, proteinaG: 170, grasaG: 70, carbosG: 220, aguaMl: 2800, pasos: 8000, ritmoKgSemana: -0.3 };
const comidaMock = (momento, kcal, p, c, g, descripcion = 'pollo con arroz') => ({ id: momento, fecha: '2026-09-03', momento, descripcion, kcal, proteina_g: p, carbos_g: c, grasa_g: g, alcohol_ud: 0, foto_path: null, fuente: 'manual', confianza: 'alta', creado: '' });
const bal = balanceDia([comidaMock('desayuno', 400, 20, 50, 12, 'tostadas con huevo')], metasDieta, 16, { entrenoHoy: true });
check('el balance resta lo comido del objetivo', bal.restante.kcal === 1800 && bal.restante.proteina === 150 && bal.pct.proteina === 12);
check('a media tarde avisa de que va corto de proteina', bal.lecturas.some((l) => /corto de proteina/.test(l.texto)), bal.lecturas.map((l) => l.texto).join(' | '));
check('sin verdura a las 16 lo dice', bal.lecturas.some((l) => /verdura/.test(l.texto)));
const balPasado = balanceDia([comidaMock('comida', 2600, 180, 300, 90)], metasDieta, 21);
check('si te pasas de calorias lo marca como alerta', balPasado.lecturas.some((l) => l.tono === 'alerta' && /por encima/.test(l.texto)));
check('las comidas pendientes dependen de la hora y de lo registrado', JSON.stringify(momentosPendientes([comidaMock('desayuno', 1, 1, 1, 1)], 15)) === '["comida","snack","cena"]' && !momentosPendientes([], 20).includes('desayuno'));
const sug = sugerirComidas(bal.restante, ['snack', 'cena'], { alergias: [], preferencias: null, semilla: 0 });
check('propone opciones para merienda y cena', sug.length === 2 && sug.every((g) => g.opciones.length === 2), sug.map((g) => g.opciones.map((o) => o.titulo).join('/')).join(' ; '));
const cena = sug.find((g) => g.momento === 'cena');
const desvio = Math.abs(cena.opciones[0].macros.kcal - cena.objetivo.kcal) / cena.objetivo.kcal;
check('la cena propuesta se acerca a las calorias que tocan', desvio <= 0.2, `${cena.opciones[0].macros.kcal} vs ${Math.round(cena.objetivo.kcal)} (${cena.opciones[0].texto})`);
check('la proteina de la cena cuadra', Math.abs(cena.opciones[0].macros.proteina - cena.objetivo.proteina) <= cena.objetivo.proteina * 0.25, `${cena.opciones[0].macros.proteina} vs ${Math.round(cena.objetivo.proteina)}`);
const sugVeg = sugerirComidas(bal.restante, ['cena'], { alergias: ['lactosa'], preferencias: 'vegetariano', semilla: 0 });
check('respeta alergias y preferencias', sugVeg[0].opciones.every((o) => !o.lineas.some((l) => /pollo|merluza|gambas|ternera|skyr|yogur/.test(l.id))), sugVeg[0].opciones.map((o) => o.titulo).join('/'));
check('vegano quita carne, pescado, lacteos y huevo', ['carne', 'pescado', 'lacteo', 'huevo'].every((e) => restricciones([], 'soy vegano').has(e)));
check('sin calorias restantes no propone nada', sugerirComidas({ kcal: 50, proteina: 5, carbos: 5, grasa: 2 }, ['cena']).length === 0);

// ── 9. Balance de energia, actividades y dia redondo ───────────────────
const { gastoDia, balanceEnergia, esActividad, esDiaRedondo } = await import(`${L}/motor/energia.js`);
const { construirDias } = await import(`${L}/motor/puntuaciones.js`);
const entrenoFuerza = { id: 'e1', fecha: '2026-09-03', dia_plan: 'd3', nombre: 'Dia 3 · Pierna A', sensacion: 4, duracion_min: 60, notas: null, completado: true, cardio_tipo: 'cinta_subida', cardio_min: 15, cardio_kcal: 140 };
const actividadMonte = { id: 'e2', fecha: '2026-09-03', dia_plan: null, nombre: 'Ruta por la montaña', sensacion: null, duracion_min: 120, notas: null, completado: true, cardio_tipo: 'senderismo', cardio_min: 120, cardio_kcal: 960 };
check('distingue actividad libre de sesion del plan', esActividad(actividadMonte) && !esActividad(entrenoFuerza));
const gasto = gastoDia({ tmbKcal: 1800, pesoKg: 80, pasos: 10000, entrenamientos: [entrenoFuerza, actividadMonte] });
check('el gasto suma basal, pasos, fuerza, cardio y actividad', gasto.basal === 2160 && gasto.pasos === 400 && gasto.fuerza === 300 && gasto.cardio === 140 && gasto.actividades === 960 && gasto.total === 3960, JSON.stringify(gasto));
check('el balance interpreta el deficit segun el objetivo', balanceEnergia(3400, gasto, 'perder_grasa', true).tono === 'bien' && balanceEnergia(3400, gasto, 'ganar_musculo', true).tono === 'aviso' && balanceEnergia(2500, gasto, 'perder_grasa', true).tono === 'alerta');
check('durante el dia no alarma por ir por debajo', balanceEnergia(1200, gasto, 'perder_grasa', false).tono === 'info');
check('dia redondo exige moverse, calorias en rango y proteina', esDiaRedondo({ entreno: false, actividad: true, kcal: 2150, proteina: 150, comidas: 3 }, { kcal: 2200, proteina: 170 }) && !esDiaRedondo({ entreno: true, actividad: false, kcal: 1500, proteina: 170, comidas: 3 }, { kcal: 2200, proteina: 170 }) && !esDiaRedondo({ entreno: false, actividad: false, kcal: 2200, proteina: 170, comidas: 3 }, { kcal: 2200, proteina: 170 }));
const diasCtx = construirDias(
  { comidas: [comidaMock('comida', 2150, 150, 200, 70)], entrenamientos: [actividadMonte], foco: [], habitos: [], registros: [], bienestar: [{ id: 'b', fecha: '2026-09-03', animo: 7, energia: 7, estres: 3, ansiedad: null, motivacion: null, sueno_horas: 7, sueno_calidad: 7, pasos: 8000, notas: null }], metricas: [] },
  ['2026-09-03'],
  { tmbKcal: 1800, pesoKg: 80, metaKcal: 2200, metaProteina: 170 },
);
check('el dia agregado lleva actividad, pasos, gasto y redondo', diasCtx[0].actividad && !diasCtx[0].entreno && diasCtx[0].pasos === 8000 && diasCtx[0].gastoKcal === 2160 + 320 + 960 && diasCtx[0].redondo, JSON.stringify({ a: diasCtx[0].actividad, g: diasCtx[0].gastoKcal, r: diasCtx[0].redondo }));

// ── 10. Planes distintos por sexo y cambio de ejercicio ───────────────
const { generarPlan, alternativas, enfasisDe } = await import(`${L}/motor/planificador.js`);
const baseEntreno = { sexo: 'hombre', edad: 30, alturaCm: 175, objetivo: 'perder_grasa', nivel: 'intermedio', diasPorSemana: 4, entorno: 'gimnasio', actividad: 'ligera', limitaciones: [] };
const planEl = generarPlan(baseEntreno);
const planElla = generarPlan({ ...baseEntreno, sexo: 'mujer' });
const ids = (plan) => plan.dias.map((d) => d.bloques.map((b) => b.ejercicioId).join(',')).join(' | ');
check('mujer y hombre con los mismos datos reciben planes distintos', ids(planEl) !== ids(planElla) && planEl.firma !== planElla.firma);
check('el plan de ella pone mas pierna y gluteo', planElla.dias.filter((d) => /Pierna|Gluteo/.test(d.nombre)).length >= 2 && planElla.dias.flatMap((d) => d.bloques).some((b) => b.ejercicioId === 'hip_thrust'), ids(planElla));
check('con objetivo de fuerza el enfasis es equilibrado', enfasisDe({ ...baseEntreno, sexo: 'mujer', objetivo: 'fuerza' }) === 'equilibrado');
const alt = alternativas('sentadilla_barra', { ...baseEntreno, entorno: 'casa_mancuernas' });
check('las alternativas respetan el material y no repiten el ejercicio', alt.length >= 2 && alt.every((e) => e.id !== 'sentadilla_barra' && e.entornos.includes('casa_mancuernas')), alt.map((e) => e.id).join(','));
const cambio = await ejecutarHerramienta('cambiar_ejercicio', { ejercicio_actual: 'sentadilla con barra', motivo: 'no hay rack' }, ctx);
check('el coach puede cambiar un ejercicio del plan', /Cambiado Sentadilla con barra por /.test(cambio.texto), cambio.texto);
const cambio2 = await ejecutarHerramienta('cambiar_ejercicio', { ejercicio_actual: 'press de banca', ejercicio_nuevo: 'flexiones' }, ctx);
check('o por el que pida el usuario', /por Flexiones/.test(cambio2.texto) || /No encuentro/.test(cambio2.texto), cambio2.texto);

// ── 11. Comidas habituales ─────────────────────────────────────────────
const { comidasHabituales, momentoDeHora } = await import(`${L}/motor/habituales.js`);
const cHab = (fecha, momento, descripcion, kcal, p) => ({ id: fecha + descripcion, fecha, momento, descripcion, kcal, proteina_g: p, carbos_g: 20, grasa_g: 10, alcohol_ud: 0, foto_path: null, fuente: 'manual', confianza: 'alta', creado: '' });
const historial = [
  cHab('2026-09-01', 'desayuno', 'Avena con queso batido y arandanos', 400, 27),
  cHab('2026-09-02', 'desayuno', 'avena con queso batido y arandanos', 410, 28),
  cHab('2026-09-03', 'desayuno', 'Avena con queso batido y arandanos', 390, 26),
  cHab('2026-09-02', 'cena', 'Merluza con verduras', 500, 40),
  cHab('2026-09-03', 'cena', 'Merluza con verduras', 520, 42),
  cHab('2026-07-01', 'comida', 'Paella del chiringuito', 900, 30),
  { ...cHab('2026-09-03', 'comida', 'Sin calorias', null, null), kcal: null },
];
const manana = comidasHabituales(historial, { hoy: '2026-09-04', hora: 9 });
check('agrupa la misma comida aunque cambie mayusculas y promedia sus macros', manana[0].descripcion.toLowerCase().startsWith('avena') && manana[0].veces === 3 && manana[0].kcal === 400, JSON.stringify(manana[0]));
check('a las 9 manda el desayuno; por la noche, la cena', manana[0].momento === 'desayuno' && comidasHabituales(historial, { hoy: '2026-09-04', hora: 21 })[0].momento === 'cena');
check('descarta lo puntual y viejo, y lo que no tiene calorias', !manana.some((h) => /paella|sin calorias/i.test(h.descripcion)), manana.map((h) => h.descripcion).join(' | '));
check('marca lo ya apuntado hoy y lo manda al final', (() => { const hoy = comidasHabituales([...historial, cHab('2026-09-04', 'desayuno', 'Avena con queso batido y arandanos', 400, 27)], { hoy: '2026-09-04', hora: 9 }); const avena = hoy.find((h) => /avena/i.test(h.descripcion)); return avena.hoy === true && hoy[0] !== avena; })());
check('la franja horaria se calcula bien', momentoDeHora(8) === 'desayuno' && momentoDeHora(14) === 'comida' && momentoDeHora(18) === 'snack' && momentoDeHora(22) === 'cena');

// ── 12. Ajuste automatico de calorias ──────────────────────────────────
const { proponerAjuste } = await import(`${L}/motor/ajuste.js`);
const metasAj = { tmb: 1600, gastoTotal: 2200, kcal: 2000, proteinaG: 150, grasaG: 65, carbosG: 200, aguaMl: 2600, pasos: 10000, ritmoKgSemana: -0.5 };
const baseAj = { metas: metasAj, pesajes: 6, diasConComidas: 10, ultimoAjuste: null, hoy: '2026-09-04', sueloKcal: 1600 };
const lento = proponerAjuste({ ...baseAj, tendenciaKgSemana: -0.05 });
check('si bajas mas lento de lo previsto, propone recortar calorias', lento && lento.delta < 0 && lento.kcalNuevas < 2000, JSON.stringify(lento && { d: lento.delta, k: lento.kcalNuevas }));
const rapido = proponerAjuste({ ...baseAj, tendenciaKgSemana: -1.2 });
check('si bajas demasiado rapido, propone subirlas', rapido && rapido.delta > 0 && rapido.kcalNuevas > 2000, JSON.stringify(rapido && { d: rapido.delta, k: rapido.kcalNuevas }));
check('el ajuste no pasa de 300 kcal de golpe', Math.abs(lento.delta) <= 300 && Math.abs(rapido.delta) <= 300);
check('la proteina no se toca y los macros cuadran con las kcal nuevas', lento.proteinaG === 150 && Math.abs(lento.proteinaG * 4 + lento.carbosG * 4 + lento.grasaG * 9 - lento.kcalNuevas) <= 30, JSON.stringify(lento));
check('si vas en el ritmo previsto no propone nada', proponerAjuste({ ...baseAj, tendenciaKgSemana: -0.45 }) === null);
check('sin pesarte o sin apuntar comida no propone nada', proponerAjuste({ ...baseAj, pesajes: 2, tendenciaKgSemana: -0.05 }) === null && proponerAjuste({ ...baseAj, diasConComidas: 3, tendenciaKgSemana: -0.05 }) === null);
check('no vuelve a proponer antes de dos semanas', proponerAjuste({ ...baseAj, tendenciaKgSemana: -0.05, ultimoAjuste: '2026-08-28' }) === null && proponerAjuste({ ...baseAj, tendenciaKgSemana: -0.05, ultimoAjuste: '2026-08-10' }) !== null);
const suelo = proponerAjuste({ ...baseAj, metas: { ...metasAj, kcal: 1800 }, tendenciaKgSemana: -0.05 });
check('nunca propone bajar del suelo de seguridad', suelo === null || suelo.kcalNuevas >= 1600, JSON.stringify(suelo && { k: suelo.kcalNuevas, d: suelo.delta }));
check('y si el suelo deja el cambio en calderilla, no molesta', proponerAjuste({ ...baseAj, metas: { ...metasAj, kcal: 1630 }, tendenciaKgSemana: -0.05 }) === null);
const mantener = proponerAjuste({ ...baseAj, metas: { ...metasAj, ritmoKgSemana: 0 }, tendenciaKgSemana: 0.45 });
check('con objetivo de mantener, corrige la deriva', mantener && mantener.delta < 0, JSON.stringify(mantener && mantener.titulo));

// ── 13. Finanzas: control de caja ──────────────────────────────────────
const { resumenFinanzas, insightsFinanzas, revisionSemana, mesAnteriorA, diasDelMes } = await import(`${L}/motor/finanzas.js`);
const mov = (fecha, importe, categoria, extra = {}) => ({ id: fecha + categoria + importe, fecha, tipo: 'gasto', importe, categoria, descripcion: null, ambito: 'personal', impulsivo: false, sobre_id: null, fuente: 'manual', creado: '', ...extra });
const movimientos = [
  mov('2026-09-02', 18, 'restaurantes'),
  mov('2026-09-03', 94, 'restaurantes', { impulsivo: true }),
  mov('2026-09-04', 60, 'restaurantes'),
  mov('2026-09-02', 120, 'alimentacion'),
  mov('2026-09-05', 100, 'formacion'),
  mov('2026-09-01', 25, 'ocio'),
  mov('2026-09-01', 2040, 'otros', { tipo: 'ingreso' }),
  mov('2026-08-15', 200, 'restaurantes'),
];
const presupuestos = [
  { id: '1', categoria: 'restaurantes', importe: 150, activo: true },
  { id: '2', categoria: 'alimentacion', importe: 400, activo: true },
  { id: '3', categoria: 'ocio', importe: 50, activo: true },
];
const ajustesFin = { user_id: 'u1', caja_inicial: 3000, caja_fecha: '2026-09-01', ahorro_mes: 300, caja_minima: 5000, moneda: 'EUR', activo: true, actualizado: '' };
const resFin = resumenFinanzas({ movimientos, presupuestos, ingresosPrevistos: [{ id: 'i1', nombre: 'Nomina', importe: 2040, ambito: 'personal', activo: true }], ajustes: ajustesFin, hoy: '2026-09-10' });
check('suma gastos e ingresos del mes y el neto', resFin.gastos === 417 && resFin.ingresos === 2040 && resFin.neto === 1623, JSON.stringify({ g: resFin.gastos, i: resFin.ingresos, n: resFin.neto }));
check('la caja parte de la referencia y suma lo movido despues', resFin.caja === 3000 + 2040 - 417, String(resFin.caja));
check('no mezcla meses', !resFin.categorias.some((c) => c.id === 'restaurantes' && c.gastado > 172));
const rest = resFin.categorias.find((c) => c.id === 'restaurantes');
check('marca en rojo la categoria pasada y calcula lo que sobra', rest.estado === 'pasado' && rest.gastado === 172 && rest.disponible === -22, JSON.stringify(rest));
check('separa el gasto impulsivo por categoria', rest.impulsivo === 94 && resFin.gastoImpulsivo === 94);
check('el cumplimiento es el porcentaje de categorias no pasadas', resFin.cumplimiento === 67, String(resFin.cumplimiento));
check('formacion cuenta como inversion y sin presupuesto aparece aparte', resFin.sinPresupuesto.some((c) => c.id === 'formacion' && c.gastado === 100));
check('proyecta el gasto a fin de mes', resFin.proyeccion === Math.round((417 / 10) * 30) && resFin.dias === 30 && diasDelMes('2026-02') === 28, String(resFin.proyeccion));
check('el mes anterior se calcula bien, tambien en enero', mesAnteriorA('2026-09') === '2026-08' && mesAnteriorA('2026-01') === '2025-12');

const ideas = insightsFinanzas(resFin, null, ajustesFin);
check('avisa de la categoria en la que se ha pasado', ideas.some((i) => /restaurantes/i.test(i.texto) && i.tono === 'alerta'), ideas.map((i) => i.texto).join(' | '));
check('lo urgente va primero: la caja por debajo del minimo no se queda fuera', ideas.some((i) => /minimo/i.test(i.texto)) && ideas[0].tono === 'alerta' && ideas.length <= 4, ideas.map((i) => i.tono).join(','));
const soloImpulso = insightsFinanzas(resumenFinanzas({ movimientos: [mov('2026-09-02', 100, 'alimentacion', { impulsivo: true }), mov('2026-09-02', 100, 'alimentacion')], presupuestos, ingresosPrevistos: [], ajustes: null, hoy: '2026-09-10' }), null, null);
check('senala el gasto impulsivo cuando hay hueco', soloImpulso.some((i) => /impulsivo/i.test(i.texto)), soloImpulso.map((i) => i.texto).join(' | '));
const buenas = insightsFinanzas(resumenFinanzas({ movimientos: [mov('2026-09-02', 20, 'restaurantes')], presupuestos, ingresosPrevistos: [], ajustes: null, hoy: '2026-09-10' }), null, null);
check('si va bien, lo dice sin reganar', buenas.every((i) => i.tono !== 'alerta'), buenas.map((i) => i.texto).join(' | '));

const semanaFin = revisionSemana(movimientos, resFin, '2026-08-31', '2026-09-06');
check('la revision de la semana cuadra', semanaFin.gastado === 417 && semanaFin.categoriaTop.nombre === 'Restaurantes' && semanaFin.impulsivo === 94 && semanaFin.dentroDePresupuesto === false, JSON.stringify(semanaFin));
check('la sugerencia apunta a donde se ha salido', /restaurantes/i.test(semanaFin.sugerencia), semanaFin.sugerencia);

// ── 14. Estado emocional: patrones y estanque ──────────────────────────
const { patronesEmocionales, perfilDeDias, resumenEmocional, evidenciasSemana, temaDe, comparar } = await import(`${L}/motor/emociones.js`);
const diaMock = (fecha, extra = {}) => ({ fecha, kcal: 2000, proteina: 150, carbos: 200, grasa: 60, alcoholUd: 0, comidas: 3, entreno: false, actividad: false, nombresActividad: [], seriesEntreno: 0, pasos: 6000, gastoKcal: 2400, redondo: false, focoMin: 0, habitosHechos: 0, habitosTotal: 0, animo: 6, energia: 6, estres: 5, suenoHoras: 7, suenoCalidad: 7, peso: null, ...extra });
// 8 dias entrenando con buen animo, 8 sin entrenar con animo bajo
const diasMente = [
  ...Array.from({ length: 8 }, (_, i) => diaMock(`2026-09-${String(i + 1).padStart(2, '0')}`, { entreno: true, animo: 8, estres: 3, focoMin: 90, suenoHoras: 7.5 })),
  ...Array.from({ length: 8 }, (_, i) => diaMock(`2026-09-${String(i + 9).padStart(2, '0')}`, { entreno: false, animo: 5, estres: 7, focoMin: 0, suenoHoras: 5.5 })),
];
const comp = comparar(diasMente, (d) => d.entreno, (d) => d.animo);
check('compara una metrica entre los dias que cumplen algo y los que no', comp.con === 8 && comp.sin === 5 && comp.cambio === 60, JSON.stringify(comp));
check('no inventa patrones sin dias suficientes', comparar(diasMente.slice(0, 9), (d) => !d.entreno, (d) => d.animo) === null);

const pat = patronesEmocionales({ dias: diasMente, diario: [{ id: 'd', fecha: '2026-09-01', bien: 'He entrenado', preocupa: null, controlo: null, aprendido: null, agradecido: null }], hojas: [], hoy: '2026-09-16' });
check('detecta que moverse le sube el animo', pat.some((p) => p.id === 'entreno_animo' && /animo medio es 8/.test(p.texto)), pat.map((p) => p.texto).join(' | '));
check('detecta que dormir mas le baja el estres', pat.some((p) => p.id === 'sueno_estres' && /estres baja/.test(p.texto)));
check('los patrones van ordenados por fuerza', pat.length > 1 && pat[0].fuerza >= pat[1].fuerza);

const perfilM = perfilDeDias(diasMente);
check('sabe que tienen en comun los mejores dias', perfilM.buenos.some((f) => f.id === 'entreno') && perfilM.buenos.some((f) => f.id === 'foco'), JSON.stringify(perfilM.buenos.map((f) => f.id)));
check('y que falta en los peores', perfilM.malos.length === 0 || perfilM.malos.every((f) => f.diferencia <= -25));
check('sin dias suficientes no saca conclusiones', perfilDeDias(diasMente.slice(0, 5)) === null);

check('adivina el tema de una preocupacion', temaDe('La caja esta baja y no llega la factura') === 'dinero' && temaDe('Dudas con Isa') === 'relaciones' && temaDe('Me duele el hombro') === 'salud' && temaDe('Cosas raras') === 'otros');

const hojasMock = [
  { id: 'h1', texto: 'Caja baja', tema: 'dinero', peso: 2, creada: '2026-09-01', cerrada: null, accion: null },
  { id: 'h2', texto: 'Cliente pendiente', tema: 'trabajo', peso: 2, creada: '2026-09-02', cerrada: '2026-09-10', accion: 'Me contesto' },
];
const resM = resumenEmocional(diasMente, [{ fecha: '2026-09-01', emociones: ['motivado', 'tranquilo'] }, { fecha: '2026-09-02', emociones: ['motivado'] }], hojasMock, '2026-09-01', '2026-09-16');
check('resume animo, emociones frecuentes y estado del estanque', resM.animoMedio === 6.5 && resM.frecuentes[0].emocion.id === 'motivado' && resM.frecuentes[0].veces === 2 && resM.hojasAbiertas.length === 1 && resM.hojasCerradas.length === 1, JSON.stringify({ a: resM.animoMedio, f: resM.frecuentes[0], ab: resM.hojasAbiertas.length }));

const evid = evidenciasSemana({ dias: diasMente, diario: [{ id: 'd', fecha: '2026-09-02', bien: 'Cerre una reunion', preocupa: null, controlo: null, aprendido: null, agradecido: null }], hojas: hojasMock, desde: '2026-09-01', hasta: '2026-09-16' });
check('las evidencias recogen lo hecho y las hojas que se fueron', evid.some((e) => /8 dias/.test(e)) && evid.some((e) => /Se fue una hoja/.test(e)) && evid.includes('Cerre una reunion'), evid.join(' | '));

// ── 15. Sobres: presupuesto para algo concreto ─────────────────────────
const sobresMock = [
  { id: 's1', nombre: 'Finde en Roma', importe: 400, emoji: '✈️', desde: '2026-09-11', hasta: '2026-09-14', cerrado: false, creado: '' },
  { id: 's2', nombre: 'Boda de Javi', importe: 200, emoji: '💒', desde: null, hasta: null, cerrado: true, creado: '' },
];
const conSobres = [
  ...movimientos,
  mov('2026-09-12', 180, 'restaurantes', { sobre_id: 's1' }),
  mov('2026-09-13', 90, 'transporte', { sobre_id: 's1' }),
  mov('2026-08-20', 210, 'ocio', { sobre_id: 's2' }),
];
const resSob = resumenFinanzas({ movimientos: conSobres, presupuestos, ingresosPrevistos: [], ajustes: null, sobres: sobresMock, hoy: '2026-09-12' });
const roma = resSob.sobres.find((s) => s.id === 's1');
check('el sobre suma solo sus gastos y calcula lo que queda', roma.gastado === 270 && roma.disponible === 130 && roma.pct === 68 && roma.movimientos === 2, JSON.stringify(roma));
check('cuenta los dias que quedan del sobre', roma.diasRestantes === 2, String(roma.diasRestantes));
const restSob = resSob.categorias.find((c) => c.id === 'restaurantes');
check('el gasto del sobre NO come el presupuesto mensual de su categoria', restSob.gastado === 172, String(restSob.gastado));
check('pero si cuenta en el gasto total y en la caja', resSob.gastos === 417 + 270 && resSob.gastoEnSobres === 270, JSON.stringify({ g: resSob.gastos, s: resSob.gastoEnSobres }));
const boda = resSob.sobres.find((s) => s.id === 's2');
check('un sobre cerrado sigue con sus numeros aunque sea de otro mes', boda.cerrado && boda.gastado === 210 && boda.estado === 'pasado', JSON.stringify(boda));
const pasado = resumenFinanzas({ movimientos: [mov('2026-09-12', 520, 'restaurantes', { sobre_id: 's1' })], presupuestos: [], ingresosPrevistos: [], ajustes: null, sobres: [sobresMock[0]], hoy: '2026-09-12' });
check('avisa cuando te pasas en un sobre abierto', insightsFinanzas(pasado, null, null).some((i) => /Finde en Roma/.test(i.texto) && /pasado/.test(i.texto)), insightsFinanzas(pasado, null, null).map((i) => i.texto).join(' | '));
const cerradoPasado = resumenFinanzas({ movimientos: [mov('2026-08-20', 210, 'ocio', { sobre_id: 's2' })], presupuestos: [], ingresosPrevistos: [], ajustes: null, sobres: [sobresMock[1]], hoy: '2026-09-12' });
check('un sobre ya cerrado no da la lata', !insightsFinanzas(cerradoPasado, null, null).some((i) => /Boda de Javi/.test(i.texto)));
const casiRoma = resumenFinanzas({ movimientos: [...movimientos, mov('2026-09-12', 350, 'restaurantes', { sobre_id: 's1' })], presupuestos, ingresosPrevistos: [], ajustes: null, sobres: [sobresMock[0]], hoy: '2026-09-12' });
check('avisa cuando queda poco dinero y pocos dias', insightsFinanzas(casiRoma, null, null).some((i) => /Roma.*quedan|quedan.*Roma/i.test(i.texto)), insightsFinanzas(casiRoma, null, null).map((i) => i.texto).join(' | '));
check('sin sobres, el resumen sigue igual que antes', resumenFinanzas({ movimientos, presupuestos, ingresosPrevistos: [], ajustes: null, hoy: '2026-09-10' }).sobres.length === 0);

// ── 16. Descanso: sueno, agua y lo que cuesta dormir poco ──────────────
const {
  horasDeSueno, minutosDesdeLasSeis, horaDesdeLasSeis, objetivoSueno, objetivoAgua, desgloseAgua,
  resumenSueno, resumenAgua, impactoSueno, insightsDescanso, VASO_ML,
} = await import(`${L}/motor/descanso.js`);

check('calcula las horas cruzando la medianoche', horasDeSueno('23:30', '07:00') === 7.5, String(horasDeSueno('23:30', '07:00')));
check('y tambien cuando se acuesta de madrugada', horasDeSueno('01:15', '08:45') === 7.5, String(horasDeSueno('01:15', '08:45')));
check('descarta un dedazo de am/pm', horasDeSueno('23:00', '23:30') === null && horasDeSueno('08:00', '23:00') === null);
check('sin las dos horas no se inventa nada', horasDeSueno('23:00', null) === null && horasDeSueno(null, null) === null && horasDeSueno('25:00', '07:00') === null);
check('las 00:30 y las 23:30 quedan a una hora, no a 23', Math.abs(minutosDesdeLasSeis('00:30') - minutosDesdeLasSeis('23:30')) === 60);
check('la hora vuelve a leerse bien', horaDesdeLasSeis(minutosDesdeLasSeis('23:40')) === '23:40' && horaDesdeLasSeis(minutosDesdeLasSeis('01:05')) === '01:05');

check('el objetivo sale del horario que la persona dijo querer', objetivoSueno('23:00', '07:00') === 8, String(objetivoSueno('23:00', '07:00')));
check('si no lo puso, 7,5 h', objetivoSueno(null, null) === 7.5 && objetivoSueno('23:00', null) === 7.5);

check('el agua base son 35 ml por kilo', objetivoAgua({ pesoKg: 80 }) === 2800, String(objetivoAgua({ pesoKg: 80 })));
check('entrenar y beber alcohol suben el objetivo', objetivoAgua({ pesoKg: 80, entreno: true, alcoholUd: 2 }) === 3800, String(objetivoAgua({ pesoKg: 80, entreno: true, alcoholUd: 2 })));
check('el objetivo se puede explicar por partes', desgloseAgua({ pesoKg: 80, entreno: true }).length === 2 && desgloseAgua({ pesoKg: 80 }).length === 1);

const diaD = (fecha, extra = {}) => ({ fecha, kcal: 2000, proteina: 150, carbos: 200, grasa: 60, alcoholUd: 0, comidas: 3, entreno: false, actividad: false, nombresActividad: [], seriesEntreno: 0, pasos: 6000, gastoKcal: 2400, redondo: false, focoMin: 60, habitosHechos: 0, habitosTotal: 0, animo: 6, energia: 6, estres: 5, suenoHoras: 7, suenoCalidad: 7, suenoInicio: '23:30', suenoFin: '07:00', aguaMl: 0, cafes: 0, cafeinaUltima: null, peso: null, ...extra });

// Una semana acostandose siempre a la misma hora frente a otra a salto de mata.
const regulares = Array.from({ length: 7 }, (_, i) => diaD(`2026-09-0${i + 1}`, { suenoInicio: '23:30', suenoHoras: 7.5 }));
const rs = resumenSueno(regulares, 7.5);
check('resume media, regularidad y hora habitual', rs.mediaHoras === 7.5 && rs.regularidadMin === 0 && rs.horaHabitual === '23:30' && rs.noches === 7, JSON.stringify(rs));
check('sin deuda si duerme lo que se propuso', rs.deudaHoras === 0 && rs.nochesCortas === 0);

const caoticos = [
  diaD('2026-09-01', { suenoInicio: '22:30', suenoHoras: 8 }),
  diaD('2026-09-02', { suenoInicio: '01:30', suenoHoras: 5 }),
  diaD('2026-09-03', { suenoInicio: '23:00', suenoHoras: 7 }),
  diaD('2026-09-04', { suenoInicio: '02:00', suenoHoras: 5 }),
  diaD('2026-09-05', { suenoInicio: '23:30', suenoHoras: 6 }),
];
const rc = resumenSueno(caoticos, 7.5);
check('detecta que la hora de acostarse baila', rc.regularidadMin >= 60, String(rc.regularidadMin));
check('acumula la deuda de sueno', rc.deudaHoras === 7 && rc.nochesCortas === 3, JSON.stringify({ d: rc.deudaHoras, c: rc.nochesCortas }));
check('propone una hora que ya ha conseguido, no la media del caos', rc.horaBuena === '23:00' && rc.horaHabitual === '00:06', JSON.stringify({ b: rc.horaBuena, h: rc.horaHabitual }));
check('un dia suelto no da regularidad', resumenSueno([diaD('2026-09-01')], 7.5).regularidadMin === null);
check('sin noches apuntadas no inventa medias', resumenSueno([diaD('2026-09-01', { suenoHoras: null, suenoInicio: null })], 7.5).mediaHoras === null);

// El precio de dormir poco, con dias suficientes en los dos grupos.
const mezcla = [
  ...Array.from({ length: 6 }, (_, i) => diaD(`2026-09-0${i + 1}`, { suenoHoras: 5.5, energia: 4, animo: 5, kcal: 2600, focoMin: 30, entreno: false })),
  ...Array.from({ length: 6 }, (_, i) => diaD(`2026-09-${i + 7}`, { suenoHoras: 7.5, energia: 8, animo: 8, kcal: 2100, focoMin: 90, entreno: true })),
];
const imp = impactoSueno(mezcla);
check('dice cuanto baja la energia durmiendo poco', imp.some((p) => p.id === 'energia' && /4/.test(p.texto) && /8/.test(p.texto)), JSON.stringify(imp.map((p) => p.texto)));
check('dice cuantas kcal de mas se comen', imp.some((p) => p.id === 'kcal' && /500 kcal mas/.test(p.texto)), JSON.stringify(imp.map((p) => p.texto)));
check('y que se entrena menos', imp.some((p) => p.id === 'entreno' && /100 %/.test(p.texto) && /0 %/.test(p.texto)), JSON.stringify(imp.map((p) => p.texto)));
check('los patrones vienen ordenados por relevancia', imp.every((p, i) => i === 0 || imp[i - 1].fuerza >= p.fuerza));
check('con pocos dias no dice nada', impactoSueno(mezcla.slice(0, 4)).length === 0);

// El cafe de la tarde, que es lo unico que se puede cambiar hoy mismo.
const conCafe = [
  ...Array.from({ length: 5 }, (_, i) => diaD(`2026-09-0${i + 1}`, { cafeinaUltima: '18:00', suenoHoras: 6 })),
  ...Array.from({ length: 5 }, (_, i) => diaD(`2026-09-${i + 10}`, { cafeinaUltima: '09:00', suenoHoras: 7.5 })),
];
check('relaciona el cafe tardio con dormir menos', impactoSueno(conCafe).some((p) => p.id === 'cafeina' && /90 min menos/.test(p.texto)), JSON.stringify(impactoSueno(conCafe).map((p) => p.texto)));

// Agua
const semanaAgua = Array.from({ length: 7 }, (_, i) => diaD(`2026-09-0${i + 1}`, { aguaMl: 2800 }));
const ra = resumenAgua(semanaAgua, 2800, '2026-09-07');
check('cuenta la racha de dias cumpliendo el agua', ra.racha === 7 && ra.diasCumplidos === 7 && ra.pct === 100 && ra.vasosQueFaltan === 0, JSON.stringify(ra));
const aMedias = resumenAgua([...semanaAgua.slice(0, 6), diaD('2026-09-07', { aguaMl: 1000 })], 2800, '2026-09-07');
check('hoy sin terminar no rompe la racha', aMedias.racha === 6 && aMedias.pct === 36 && aMedias.vasosQueFaltan === Math.ceil(1800 / VASO_ML), JSON.stringify(aMedias));
const roto = resumenAgua([diaD('2026-09-01', { aguaMl: 500 }), diaD('2026-09-02', { aguaMl: 2800 }), diaD('2026-09-03', { aguaMl: 2800 })], 2800, '2026-09-03');
check('la racha para en el primer dia que no llego', roto.racha === 2, String(roto.racha));
check('sin agua apuntada no hay media', resumenAgua([diaD('2026-09-01')], 2800, '2026-09-01').mediaMl === null);

// Lo que veo
const alerta = insightsDescanso({
  dias: [diaD('2026-09-05', { suenoHoras: 5 }), diaD('2026-09-06', { suenoHoras: 5.5 }), diaD('2026-09-07', { suenoHoras: 6 })],
  sueno: resumenSueno(caoticos, 7.5), agua: resumenAgua(semanaAgua, 2800, '2026-09-07'), hoy: '2026-09-07',
});
check('tres noches malas seguidas son lo primero que se dice', alerta[0].tono === 'alerta' && /media hora antes/.test(alerta[0].texto), JSON.stringify(alerta));
check('nunca mas de cuatro frases', alerta.length <= 4, String(alerta.length));
const conRetraso = insightsDescanso({
  dias: regulares, sueno: resumenSueno(regulares, 7.5),
  agua: resumenAgua(semanaAgua, 2800, '2026-09-07'), hoy: '2026-09-07', horaObjetivo: '22:30',
});
check('contrasta la hora que dijo con la que se acuesta', conRetraso.some((i) => i.id === 'retraso' && /60 min mas tarde/.test(i.texto)), JSON.stringify(conRetraso.map((i) => i.texto)));
const entrenoSinAgua = insightsDescanso({
  dias: [diaD('2026-09-07', { entreno: true, aguaMl: 500 })],
  sueno: resumenSueno(regulares, 7.5),
  agua: resumenAgua([diaD('2026-09-07', { entreno: true, aguaMl: 500 })], 3300, '2026-09-07'), hoy: '2026-09-07',
});
check('si entrenas y no bebes, te lo dice', entrenoSinAgua.some((i) => i.id === 'agua_entreno'), JSON.stringify(entrenoSinAgua.map((i) => i.texto)));
check('ningun aviso de descanso regana', [...alerta, ...conRetraso, ...entrenoSinAgua].every((i) => !/deberias|tienes que|mal hecho/i.test(i.texto)));

// ── 17. Tiempo: en que has estado y si vas a mas o a menos ─────────────
const { resumenTiempo, avance, insightsTiempo, semanasHasta, segundosDelCronometro, reloj } = await import(`${L}/motor/tiempo.js`);
const { inicioSemana: iniSem } = await import(`${L}/fechas.js`);
const etq = (id) => ({ deep_work: 'Trabajo profundo', idiomas: 'Idiomas', otro: 'Otro' })[id] ?? 'Otro';

const acts = [
  { id: 'a1', nombre: 'Ingles', emoji: '🇬🇧', categoria: 'idiomas', objetivo_min_semana: 120, archivada: false, creada: '2026-08-01' },
  { id: 'a2', nombre: 'Guitarra', emoji: '🎸', categoria: 'aprendizaje', objetivo_min_semana: null, archivada: false, creada: '2026-08-01' },
];
const rato = (fecha, minutos, actividad_id, categoria = 'otro') => ({ id: `${fecha}-${minutos}-${actividad_id ?? 'x'}`, fecha, minutos, categoria, descripcion: null, actividad_id });
const semanaFechas = ['2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11', '2026-09-12', '2026-09-13'];
const ratos = [
  rato('2026-09-07', 60, 'a1'), rato('2026-09-09', 30, 'a1'),
  rato('2026-09-08', 90, 'a2'), rato('2026-09-10', 30, 'a2'),
  rato('2026-09-11', 45, null, 'deep_work'),
];
const rt = resumenTiempo(ratos, acts, semanaFechas, etq);
check('reparte el tiempo por actividad, de mas a menos', rt.actividades.map((a) => a.nombre).join(',') === 'Guitarra,Ingles,Trabajo profundo', rt.actividades.map((a) => `${a.nombre}:${a.minutos}`).join(' '));
check('suma total, ratos y dias activos', rt.minutos === 255 && rt.sesiones === 5 && rt.diasActivos === 5, JSON.stringify({ m: rt.minutos, s: rt.sesiones, d: rt.diasActivos }));
check('los registros sin actividad no se pierden, van por categoria', rt.actividades.some((a) => a.nombre === 'Trabajo profundo' && a.minutos === 45));
check('el porcentaje del total cuadra', rt.actividades.find((a) => a.nombre === 'Ingles').pct === 35, String(rt.actividades.find((a) => a.nombre === 'Ingles').pct));
check('solo mide objetivo donde la persona se ha puesto uno', rt.actividades.find((a) => a.nombre === 'Ingles').objetivoPct === 75 && rt.actividades.find((a) => a.nombre === 'Guitarra').objetivoPct === null);
check('el tiempo por dia respeta el orden de las fechas', rt.porDia.length === 7 && rt.porDia[0].minutos === 60 && rt.porDia[5].minutos === 0);
check('lo de fuera del periodo no cuenta', resumenTiempo([...ratos, rato('2026-08-30', 600, 'a1')], acts, semanaFechas, etq).minutos === 255);

// Avance: la semana en curso no ensucia la media de las cerradas
const semanas = semanasHasta('2026-09-13', 4, iniSem, sumarDias);
check('trocea las semanas en lunes correctos', semanas.map((s) => s.desde).join(',') === '2026-08-24,2026-08-31,2026-09-07,2026-09-14' || semanas[semanas.length - 1].fechas.includes('2026-09-13'), semanas.map((s) => s.desde).join(','));
const historico = [
  rato('2026-08-25', 60, 'a1'), rato('2026-09-01', 120, 'a1'), rato('2026-09-07', 60, 'a1'), rato('2026-09-09', 30, 'a1'),
];
const av = avance(historico, semanasHasta('2026-09-13', 3, iniSem, sumarDias), 'a1');
check('compara con la semana pasada', av.estaSemana === 90 && av.semanaAnterior === 120 && av.cambio === -25, JSON.stringify(av));
check('la media solo cuenta semanas cerradas', av.mediaSemanal === 90, String(av.mediaSemanal));
check('guarda la mejor semana y el total', av.mejorSemana === 120 && av.totalMinutos === 270, JSON.stringify({ m: av.mejorSemana, t: av.totalMinutos }));
check('cuenta las semanas seguidas', av.semanasSeguidas === 2, String(av.semanasSeguidas));
const empezandoHoy = avance([rato('2026-09-08', 60, 'a1')], semanasHasta('2026-09-13', 4, iniSem, sumarDias), 'a1');
check('sin semana anterior no inventa un porcentaje', empezandoHoy.cambio === null && empezandoHoy.mediaSemanal === null, JSON.stringify(empezandoHoy));
check('el avance de una actividad ignora las demas', avance(ratos, [{ desde: '2026-09-07', fechas: semanaFechas }], 'a2').estaSemana === 120);

// Lo que veo
const vacio = insightsTiempo(resumenTiempo([], acts, semanaFechas, etq), avance([], semanas), 7);
check('sin nada apuntado invita a empezar, no regana', vacio.length === 1 && /dale al play/i.test(vacio[0].texto), JSON.stringify(vacio));
const conAvisos = insightsTiempo(rt, av, 7);
check('dice donde se te ha ido el tiempo', conAvisos.some((i) => i.id === 'reparto' && /Guitarra/.test(i.texto)), JSON.stringify(conAvisos.map((i) => i.texto)));
check('nunca mas de tres frases', conAvisos.length <= 3, String(conAvisos.length));
check('ninguna frase de tiempo regana', conAvisos.every((i) => !/deberias|tienes que|vago|poco/i.test(i.texto)), JSON.stringify(conAvisos.map((i) => i.texto)));
const subida = insightsTiempo(rt, { ...av, estaSemana: 200, semanaAnterior: 100, cambio: 100 }, 7);
check('celebra la subida con el dato', subida.some((i) => i.id === 'cambio' && /100 %/.test(i.texto)), JSON.stringify(subida.map((i) => i.texto)));
const atracon = insightsTiempo(resumenTiempo([rato('2026-09-07', 180, 'a1')], acts, semanaFechas, etq), av, 7);
check('avisa si todo cayo en un solo dia', atracon.some((i) => i.id === 'concentrado'), JSON.stringify(atracon.map((i) => i.texto)));

// El cronometro cuenta desde la marca del servidor, no sumando en el navegador
const ahora = Date.parse('2026-09-07T12:00:00Z');
check('cuenta lo corrido desde el inicio', segundosDelCronometro({ actividad_id: 'a1', descripcion: null, inicio: '2026-09-07T11:30:00Z', acumulado_seg: 0 }, ahora) === 1800);
check('suma lo acumulado de antes de la pausa', segundosDelCronometro({ actividad_id: 'a1', descripcion: null, inicio: '2026-09-07T11:59:00Z', acumulado_seg: 600 }, ahora) === 660);
check('en pausa no sigue contando', segundosDelCronometro({ actividad_id: 'a1', descripcion: null, inicio: null, acumulado_seg: 900 }, ahora) === 900);
check('sin cronometro son cero segundos', segundosDelCronometro(null, ahora) === 0);
check('si el reloj del movil va atrasado no cuenta en negativo', segundosDelCronometro({ actividad_id: 'a1', descripcion: null, inicio: '2026-09-07T12:05:00Z', acumulado_seg: 0 }, ahora) === 0);
check('el reloj se lee bien', reloj(65) === '01:05' && reloj(3725) === '1:02:05' && reloj(0) === '00:00', `${reloj(65)} ${reloj(3725)}`);

console.log(fallos ? `\n${fallos} COMPROBACIONES FALLIDAS` : '\nTodo correcto.');
process.exit(fallos ? 1 : 0);
