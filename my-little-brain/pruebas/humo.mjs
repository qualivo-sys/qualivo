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
  ['crear_habito', { nombre: 'Rumiar por la noche', tipo: 'evitar' }],
  ['registrar_habito', { nombre: 'Rumiar por la noche', nota: 'Mail del cliente a las 23:00' }],
  ['crear_objetivo', { area: 'negocio', titulo: 'Cerrar 3 clientes nuevos', metrica: 'manual', valor_objetivo: 3 }],
  ['actualizar_objetivo', { titulo: 'cerrar 3 clientes', valor_actual: 1 }],
  ['crear_tarea', { titulo: 'Preparar propuesta EAC', prioridad: 1, para_hoy: true }],
  ['completar_tarea', { titulo: 'preparar propuesta' }],
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

// ── 18. Las tareas de hoy ──────────────────────────────────────────────
const { tareasDelDia, progresoTareas, insightsTareas, MAX_HOY } = await import(`${L}/motor/tareas.js`);
const tarea = (id, titulo, extra = {}) => ({ id, titulo, area: null, prioridad: 2, fecha: null, completada: false, completada_el: null, pospuesta: 0, ...extra });

const lote = [
  tarea('t1', 'Cerrar la propuesta', { fecha: '2026-09-08' }),
  tarea('t2', 'Llamar al gestor', { fecha: '2026-09-08', completada: true, completada_el: '2026-09-08' }),
  tarea('t3', 'Renovar el seguro', { fecha: '2026-09-05', pospuesta: 4 }),
  tarea('t4', 'Mirar lo del gimnasio', { fecha: '2026-09-06' }),
  tarea('t5', 'Cambiar las ruedas'),
  tarea('t6', 'Leer el informe', { fecha: '2026-09-20' }),
];
const d1 = tareasDelDia(lote, '2026-09-08');
check('separa las de hoy de las hechas', d1.hoy.map((t) => t.id).join() === 't1' && d1.hechasHoy.map((t) => t.id).join() === 't2', JSON.stringify({ h: d1.hoy.map((t) => t.id), x: d1.hechasHoy.map((t) => t.id) }));
check('las de dias anteriores salen aparte y por antiguedad', d1.arrastradas.map((t) => t.id).join() === 't3,t4', d1.arrastradas.map((t) => t.id).join());
check('sin fecha o para mas adelante van a la mochila', d1.mochila.map((t) => t.id).join() === 't5,t6', d1.mochila.map((t) => t.id).join());
check('cuenta los huecos que quedan de los tres', d1.huecos === 1, String(d1.huecos));
check('el dia no esta cerrado si queda algo abierto', d1.diaCerrado === false);
const cerrado = tareasDelDia([tarea('a', 'Una', { fecha: '2026-09-08', completada: true, completada_el: '2026-09-08' })], '2026-09-08');
check('el dia se cierra cuando estan todas', cerrado.diaCerrado === true && cerrado.huecos === 2);
check('un dia sin tareas no cuenta como cerrado', tareasDelDia([], '2026-09-08').diaCerrado === false);
check('tres es la recomendacion', MAX_HOY === 3);

// Tres no es un muro: se pueden poner mas y todo sigue cuadrando
const cinco = tareasDelDia([
  tarea('c1', 'A', { fecha: '2026-09-08' }), tarea('c2', 'B', { fecha: '2026-09-08' }),
  tarea('c3', 'C', { fecha: '2026-09-08' }), tarea('c4', 'D', { fecha: '2026-09-08' }),
  tarea('c5', 'E', { fecha: '2026-09-08', completada: true, completada_el: '2026-09-08' }),
], '2026-09-08');
check('acepta mas de tres en un dia', cinco.hoy.length === 4 && cinco.hechasHoy.length === 1);
check('cuenta cuantas van por encima de las tres', cinco.extra === 2 && cinco.huecos === 0, JSON.stringify({ e: cinco.extra, h: cinco.huecos }));
check('con menos de tres no hay extras', d1.extra === 0 && d1.huecos === 1);
const cincoCerradas = tareasDelDia(['a', 'b', 'c', 'd', 'e'].map((x) => tarea(x, x, { fecha: '2026-09-08', completada: true, completada_el: '2026-09-08' })), '2026-09-08');
check('un dia de cinco tambien se puede cerrar', cincoCerradas.diaCerrado === true && cincoCerradas.extra === 2);

// El aviso sale de SUS dias, no de una norma nuestra
const diasMix = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06'];
const mixTareas = [
  // tres dias de <=3, cerrados los tres
  ...['2026-09-01', '2026-09-02', '2026-09-03'].map((f, i) => tarea(`p${i}`, 'P', { fecha: f, completada: true, completada_el: f })),
  // tres dias de 4, sin cerrar ninguno
  ...['2026-09-04', '2026-09-05', '2026-09-06'].flatMap((f, i) =>
    [0, 1, 2, 3].map((n) => tarea(`m${i}${n}`, 'M', { fecha: f, completada: n < 2, completada_el: n < 2 ? f : null }))),
];
const prMix = progresoTareas(mixTareas, diasMix);
check('separa los dias de tres o menos de los de mas', prMix.segunCuantas.hasta3.dias === 3 && prMix.segunCuantas.masDe3.dias === 3, JSON.stringify(prMix.segunCuantas));
check('y cuantos cerro en cada grupo', prMix.segunCuantas.hasta3.cerrados === 3 && prMix.segunCuantas.masDe3.cerrados === 0);
const avisoMix = insightsTareas(cinco, prMix);
check('te lo cuenta con tus numeros, sin prohibir nada', avisoMix.some((i) => i.id === 'mas_de_tres' && /100 %/.test(i.texto) && /0 %/.test(i.texto) && /tu sabras/i.test(i.texto)), JSON.stringify(avisoMix.map((i) => i.texto)));
const prBueno = progresoTareas([
  ...['2026-09-01', '2026-09-02', '2026-09-03'].map((f, i) => tarea(`q${i}`, 'Q', { fecha: f })),
  ...['2026-09-04', '2026-09-05', '2026-09-06'].flatMap((f, i) =>
    [0, 1, 2, 3].map((n) => tarea(`n${i}${n}`, 'N', { fecha: f, completada: true, completada_el: f }))),
], diasMix);
check('si te va bien poniendote mas, te lo dice tambien', insightsTareas(cinco, prBueno).some((i) => i.id === 'mas_de_tres' && i.tono === 'bien'), JSON.stringify(insightsTareas(cinco, prBueno).map((i) => i.texto)));
check('sin dias suficientes en los dos grupos no opina', !insightsTareas(cinco, progresoTareas(mixTareas.slice(0, 4), diasMix)).some((i) => i.id === 'mas_de_tres'));
check('con tres o menos no saca el tema', !insightsTareas(d1, prMix).some((i) => i.id === 'mas_de_tres'));

// El avance: los dias sin tareas no son dias fallados
const dias5 = ['2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07', '2026-09-08'];
const historialT = [
  tarea('h1', 'A', { fecha: '2026-09-04', completada: true, completada_el: '2026-09-04' }),
  tarea('h2', 'B', { fecha: '2026-09-05', completada: true, completada_el: '2026-09-05' }),
  tarea('h3', 'C', { fecha: '2026-09-05' }),
  // el 6 y el 7 no eligio nada
  tarea('h4', 'D', { fecha: '2026-09-08', completada: true, completada_el: '2026-09-08' }),
];
const pr = progresoTareas(historialT, dias5);
check('solo cuenta los dias en los que eligio tareas', pr.diasConTareas === 3 && pr.diasCerrados === 2, JSON.stringify(pr));
check('el porcentaje sale de esos dias, no del calendario', pr.pct === 67, String(pr.pct));
check('cuenta las tareas hechas', pr.hechas === 3, String(pr.hechas));
check('un dia sin tareas no rompe la racha, se salta', pr.racha === 1, String(pr.racha));
const rachaLarga = progresoTareas([
  tarea('r1', 'A', { fecha: '2026-09-07', completada: true, completada_el: '2026-09-07' }),
  tarea('r2', 'B', { fecha: '2026-09-08', completada: true, completada_el: '2026-09-08' }),
], dias5);
check('la racha cuenta los dias cerrados seguidos', rachaLarga.racha === 2, String(rachaLarga.racha));
check('un dia a medias corta la racha', progresoTareas([...historialT, tarea('h5', 'E', { fecha: '2026-09-08' })], dias5).racha === 0);
check('sin ningun dia con tareas no hay porcentaje', progresoTareas([], dias5).pct === null);

// Lo que veo
const avisosT = insightsTareas(d1, pr);
check('senala lo que lleva demasiado tiempo posponiendose', avisosT.some((i) => i.id === 'atascada' && /Renovar el seguro/.test(i.texto) && /4 dias/.test(i.texto)), JSON.stringify(avisosT.map((i) => i.texto)));
check('y ofrece salida, no bronca', avisosT.some((i) => /suéltala|partela|troce/i.test(i.texto)));
check('celebra el dia cerrado', insightsTareas(cerrado, rachaLarga).some((i) => i.id === 'cerrado' && /2 seguidos/.test(i.texto)), JSON.stringify(insightsTareas(cerrado, rachaLarga)));
const sinNada = insightsTareas(tareasDelDia([], '2026-09-08'), progresoTareas([], dias5));
check('sin tareas sugiere tres pero deja claro que el dia es tuyo', sinNada.some((i) => i.id === 'vacio' && /Tres suele ser/.test(i.texto) && /el dia es tuyo/.test(i.texto)), JSON.stringify(sinNada));
check('nunca mas de tres frases', avisosT.length <= 3 && sinNada.length <= 3);
check('ninguna frase de tareas culpabiliza', [...avisosT, ...sinNada].every((i) => !/deberias|vago|fracas|mal\b/i.test(i.texto)), JSON.stringify([...avisosT, ...sinNada].map((i) => i.texto)));

// El coach respeta el limite de tres
// Tres es la recomendacion, no un tope: el coach pone las que le digas.
const antesTareas = supabase.db.tablas.tareas.filter((t) => t.fecha === HOY).length;
for (const t of ['Uno', 'Dos', 'Tres', 'Cuatro']) await ejecutarHerramienta('crear_tarea', { titulo: t, para_hoy: true }, ctx);
const deHoy = supabase.db.tablas.tareas.filter((t) => t.fecha === HOY);
check('el coach pone en hoy todas las que le digas, tres no es un tope', deHoy.length === antesTareas + 4, `${deHoy.length} para hoy`);
check('ninguna acaba sin fecha por el camino', supabase.db.tablas.tareas.filter((t) => ['Uno', 'Dos', 'Tres', 'Cuatro'].includes(t.titulo)).every((t) => t.fecha === HOY));
const cuarta = await ejecutarHerramienta('crear_tarea', { titulo: 'Quinta', para_hoy: true }, ctx);
check('pero te dice cuantas llevas cuando pasas de tres', /van \d+ para hoy/.test(cuarta.texto), cuarta.texto);
await ejecutarHerramienta('completar_tarea', { titulo: 'uno' }, ctx);
check('el coach marca la tarea buscandola por el titulo', supabase.db.tablas.tareas.find((t) => t.titulo === 'Uno')?.completada === true);
check('y guarda el dia en que se cerro', supabase.db.tablas.tareas.find((t) => t.titulo === 'Uno')?.completada_el === HOY);
const noExiste = await ejecutarHerramienta('completar_tarea', { titulo: 'pasear al dragon' }, ctx);
check('si no la encuentra lo dice, no inventa', /No encuentro/.test(noExiste.texto), noExiste.texto);

// ── 19. Objetivos que se miden solos ───────────────────────────────────
const { medir, ritmo: ritmoObj, valorActual, insightsObjetivos, metrica: metricaDe, METRICAS } = await import(`${L}/motor/objetivos.js`);
const { diasEntre } = await import(`${L}/fechas.js`);

const obj = (extra = {}) => ({ id: 'o1', area: 'cuerpo', titulo: 'Bajar a 78 kg', detalle: null, metrica: 'peso', valor_objetivo: 78, valor_inicial: 83, valor_actual: null, fecha_limite: null, estado: 'activo', creado: '2026-08-11', ...extra });
const diaO = (fecha, extra = {}) => ({ fecha, kcal: 0, proteina: 0, carbos: 0, grasa: 0, alcoholUd: 0, comidas: 0, entreno: false, actividad: false, nombresActividad: [], seriesEntreno: 0, pasos: null, gastoKcal: 0, redondo: false, focoMin: 0, habitosHechos: 0, habitosTotal: 0, animo: null, energia: null, estres: null, suenoHoras: null, suenoCalidad: null, suenoInicio: null, suenoFin: null, aguaMl: 0, cafes: 0, cafeinaUltima: null, peso: null, ...extra });
const cuerpoMock = { peso: 81, fecha: '2026-09-08', imc: null, grasaPct: 20.5, masaMagra: null, tendencia: -0.4, cintura: 92 };
const fuentes = { cuerpo: cuerpoMock, dias: [], hoy: '2026-09-08' };

// La app lee el valor sola: no hay que apuntar nada dos veces
check('el peso lo lee de tus pesajes', valorActual(obj(), fuentes) === 81, String(valorActual(obj(), fuentes)));
check('la cintura y la grasa tambien', valorActual(obj({ metrica: 'cintura' }), fuentes) === 92 && valorActual(obj({ metrica: 'grasa' }), fuentes) === 20.5);
const con30 = { ...fuentes, dias: Array.from({ length: 30 }, (_, i) => diaO(`2026-08-${String(i + 1).padStart(2, '0')}`, { entreno: i % 3 === 0, focoMin: 60, suenoHoras: 7 })) };
check('cuenta los entrenos de los ultimos 30 dias', valorActual(obj({ metrica: 'entrenos_semana' }), con30) === 10, String(valorActual(obj({ metrica: 'entrenos_semana' }), con30)));
check('y las horas dedicadas', valorActual(obj({ metrica: 'foco_semana' }), con30) === 30, String(valorActual(obj({ metrica: 'foco_semana' }), con30)));
check('el sueno es la media de dos semanas', valorActual(obj({ metrica: 'sueno' }), con30) === 7);
check('lo manual solo lo sabe la persona', valorActual(obj({ metrica: 'manual', valor_actual: 2 }), fuentes) === 2);
check('sin datos devuelve null, no un cero que engane', valorActual(obj({ metrica: 'peso' }), { ...fuentes, cuerpo: { ...cuerpoMock, peso: null } }) === null);

// El camino recorrido
const m1 = medir(obj(), fuentes);
check('mide el camino de 83 a 78 estando en 81', m1.pct === 40 && m1.falta === 3 && m1.direccion === 'bajar' && !m1.conseguido, JSON.stringify(m1));
check('sabe cuando ya has llegado', medir(obj({ valor_objetivo: 82 }), fuentes).conseguido === true);
const subir = medir(obj({ titulo: 'Subir a 85', valor_objetivo: 85, valor_inicial: 79 }), fuentes);
check('funciona igual hacia arriba', subir.direccion === 'subir' && subir.pct === 33, JSON.stringify(subir));
check('sin numero objetivo no hay barra', medir(obj({ valor_objetivo: null }), fuentes).pct === null);
check('sin datos para medir tampoco', medir(obj(), { ...fuentes, cuerpo: { ...cuerpoMock, peso: null } }).pct === null);
check('pasarse de la meta no da mas del 100 %', medir(obj({ valor_objetivo: 82, valor_inicial: 83 }), fuentes).pct === 100);
const desdeHoy = medir(obj({ valor_inicial: null }), fuentes);
check('sin punto de partida se toma el de hoy: empieza en 0 %, no sin barra', desdeHoy.pct === 0 && desdeHoy.inicial === 81 && desdeHoy.falta === 3, JSON.stringify(desdeHoy));

// El ritmo: da la fecha, no una bronca
const r1 = ritmoObj(obj({ fecha_limite: '2026-10-30' }), m1, '2026-08-11', '2026-09-08', sumarDias, diasEntre);
check('calcula el ritmo por semana', r1.porSemana === -0.5, String(r1.porSemana));
check('proyecta la fecha de llegada', r1.llegada === '2026-10-20', String(r1.llegada));
check('dice si llega a tiempo', r1.aTiempo === true && r1.diasHastaLimite === 52, JSON.stringify(r1));
const rTarde = ritmoObj(obj({ fecha_limite: '2026-09-20' }), m1, '2026-08-11', '2026-09-08', sumarDias, diasEntre);
check('y si no llega, tambien', rTarde.aTiempo === false);
const sinRecorrido = ritmoObj(obj(), m1, '2026-09-05', '2026-09-08', sumarDias, diasEntre);
check('con menos de una semana no proyecta nada', sinRecorrido.porSemana === null && sinRecorrido.llegada === null);
const alReves = medir(obj({ valor_inicial: 80 }), fuentes);
check('yendo hacia el lado contrario no inventa una fecha', ritmoObj(obj({ valor_inicial: 80 }), alReves, '2026-08-11', '2026-09-08', sumarDias, diasEntre).llegada === null);

// Lo que veo
const conMedida = (o, extra = {}) => ({ objetivo: o, medicion: medir(o, fuentes), ritmo: ritmoObj(o, medir(o, fuentes), '2026-08-11', '2026-09-08', sumarDias, diasEntre), tareasAbiertas: 0, ...extra });
const avisosO = insightsObjetivos([conMedida(obj({ fecha_limite: '2026-09-20' }))]);
check('avisa de lo que no llega dando las dos salidas', avisosO.some((i) => i.id === 'tarde' && /mueves la fecha/.test(i.texto)), JSON.stringify(avisosO.map((i) => i.texto)));
check('senala el objetivo sin ninguna tarea detras', avisosO.some((i) => i.id === 'sin_tareas'), JSON.stringify(avisosO.map((i) => i.texto)));
check('avisa cuando ya has llegado', insightsObjetivos([conMedida(obj({ valor_objetivo: 82 }))]).some((i) => i.id === 'conseguido'));
check('celebra el que va en hora', insightsObjetivos([conMedida(obj({ fecha_limite: '2026-12-30' }), { tareasAbiertas: 1 })]).some((i) => i.id === 'en_camino' && /40 %/.test(i.texto)));
const sinObj = insightsObjetivos([]);
check('sin objetivos explica que es uno bueno, no regana', sinObj.length === 1 && /bajar a 78 kg/.test(sinObj[0].texto), JSON.stringify(sinObj));
check('los pausados no cuentan como activos', insightsObjetivos([conMedida(obj({ estado: 'pausado' }))])[0].id === 'vacio');
check('nunca mas de tres frases', avisosO.length <= 3);
check('ninguna frase de objetivos culpabiliza', [...avisosO, ...sinObj].every((i) => !/deberias|fracas|vago/i.test(i.texto)));
check('las metricas automaticas se distinguen de la manual', METRICAS.filter((m) => m.automatica).length === 6 && metricaDe('manual').automatica === false);

// Cuanto te falta, tal y como vas
const { proyectar } = await import(`${L}/motor/objetivos.js`);
const mPeso = medir(obj({ fecha_limite: '2026-10-30' }), fuentes); // de 83 a 78, esta en 81
const pr1 = proyectar(mPeso, -0.35, '2026-09-08', '2026-10-30', sumarDias, diasEntre);
check('dice cuanto falta y a que dia llegarias al ritmo que llevas', pr1.falta === 3 && pr1.semanas === 8.6 && pr1.llegada === '2026-11-08', JSON.stringify(pr1));
check('y si eso llega o no a tu fecha', pr1.aTiempo === false && pr1.diasHastaLimite === 52);
check('da el ritmo que HARIA falta, que es el dato util', pr1.ritmoNecesario === -0.4, String(pr1.ritmoNecesario));
const pr2 = proyectar(mPeso, -0.6, '2026-09-08', '2026-10-30', sumarDias, diasEntre);
check('yendo mas rapido, llega a tiempo', pr2.aTiempo === true && pr2.llegada === '2026-10-13', JSON.stringify({ a: pr2.aTiempo, l: pr2.llegada }));
const alReves2 = proyectar(mPeso, 0.3, '2026-09-08', '2026-10-30', sumarDias, diasEntre);
check('si vas hacia el otro lado no inventa una fecha', alReves2.alejandose === true && alReves2.llegada === null, JSON.stringify(alReves2));
check('pero sigue diciendo a que ritmo tendrias que ir', alReves2.ritmoNecesario === -0.4);
const sinRitmo = proyectar(mPeso, null, '2026-09-08', null, sumarDias, diasEntre);
check('sin ritmo no hay fecha ni se la inventa', sinRitmo.llegada === null && sinRitmo.semanas === null && sinRitmo.aTiempo === null);
check('sin fecha limite no hay ritmo necesario', sinRitmo.ritmoNecesario === null);
const yaEsta = proyectar(medir(obj({ valor_objetivo: 82 }), fuentes), -0.35, '2026-09-08', null, sumarDias, diasEntre);
check('si ya has llegado, lo dice y no proyecta', yaEsta.conseguido === true && yaEsta.llegada === null);
const vencida = proyectar(mPeso, -0.35, '2026-09-08', '2026-09-01', sumarDias, diasEntre);
check('una fecha ya pasada sale en negativo, no como ritmo imposible', vencida.diasHastaLimite === -7 && vencida.ritmoNecesario === null, JSON.stringify({ d: vencida.diasHastaLimite, r: vencida.ritmoNecesario }));
const subiendo = proyectar(medir(obj({ titulo: 'Subir a 85', valor_objetivo: 85, valor_inicial: 79 }), fuentes), 0.25, '2026-09-08', null, sumarDias, diasEntre);
check('funciona igual para ganar peso', subiendo.falta === 4 && subiendo.semanas === 16 && !subiendo.alejandose, JSON.stringify(subiendo));

// El coach
const objCoach = supabase.db.tablas.objetivos.find((o) => /clientes/i.test(o.titulo));
check('el coach guarda el objetivo con su metrica y su punto de partida', objCoach?.metrica === 'manual' && objCoach?.valor_objetivo === 3 && objCoach?.valor_inicial === 0, JSON.stringify(objCoach));
check('y lo actualiza buscandolo por el titulo', objCoach?.valor_actual === 1, String(objCoach?.valor_actual));
await ejecutarHerramienta('actualizar_objetivo', { titulo: 'clientes', estado: 'conseguido' }, ctx);
check('lo puede dar por conseguido', supabase.db.tablas.objetivos.find((o) => /clientes/i.test(o.titulo))?.estado === 'conseguido');
// El panel tiene que traer TODOS los objetivos: si solo trae los activos, los
// conseguidos desaparecen de la pantalla en cuanto los cierras.
const panelObj = await cargarPanel(supabase, 'u1', supabase.db.tablas.perfiles[0]);
check('el panel trae tambien los objetivos ya cerrados',
  panelObj.objetivos.some((o) => o.estado === 'conseguido'),
  JSON.stringify(panelObj.objetivos.map((o) => [o.titulo, o.estado])));
const objNo = await ejecutarHerramienta('actualizar_objetivo', { titulo: 'aprender a volar' }, ctx);
check('si no lo encuentra lo dice', /No encuentro/.test(objNo.texto), objNo.texto);
const objPeso = await ejecutarHerramienta('crear_objetivo', { area: 'cuerpo', titulo: 'Bajar a 78', metrica: 'peso', valor_objetivo: 78 }, ctx);
check('en los automaticos guarda de donde partes sin preguntartelo',
  supabase.db.tablas.objetivos.find((o) => o.titulo === 'Bajar a 78')?.valor_inicial === 82.4,
  JSON.stringify(supabase.db.tablas.objetivos.find((o) => o.titulo === 'Bajar a 78')));

// ── 20. El animo con nombre y apellidos ────────────────────────────────
const { diasSenalados, semanaEmocional } = await import(`${L}/motor/emociones.js`);

const diaA = (fecha, extra = {}) => diaMock(fecha, { animo: null, energia: null, estres: null, suenoHoras: null, focoMin: 0, entreno: false, actividad: false, pasos: null, alcoholUd: 0, ...extra });
const semanaDias = [
  diaA('2026-09-07', { animo: 5, energia: 5, estres: 6, suenoHoras: 6 }),
  diaA('2026-09-08', { animo: 9, energia: 8, estres: 3, entreno: true, suenoHoras: 8, focoMin: 120 }),
  diaA('2026-09-09', { animo: 7, energia: 7, estres: 4 }),
  diaA('2026-09-10', { animo: 3, energia: 3, estres: 8, alcoholUd: 3 }),
  diaA('2026-09-11', { animo: 6, energia: 6, estres: 5 }),
];
const emosPorDia = [
  { fecha: '2026-09-08', emociones: ['feliz', 'motivado'] },
  { fecha: '2026-09-10', emociones: ['agobiado'] },
];

const sen = diasSenalados(semanaDias, emosPorDia);
check('senala el mejor dia por su fecha y su animo', sen.mejores[0].fecha === '2026-09-08' && sen.mejores[0].animo === 9, JSON.stringify(sen.mejores[0]));
check('y cuenta que tenia ese dia', sen.mejores[0].porque.join(', ') === 'entreno, 8 h de sueno, 2 h de foco', sen.mejores[0].porque.join(', '));
check('trae las emociones de ese dia', sen.mejores[0].emociones.map((e) => e.id).join() === 'feliz,motivado');
check('y el mas flojo, con lo suyo', sen.peores[0].fecha === '2026-09-10' && sen.peores[0].animo === 3 && /alcohol/.test(sen.peores[0].porque.join(' ')), JSON.stringify(sen.peores[0]));
check('un dia no sale a la vez como mejor y como peor', sen.mejores.every((m) => !sen.peores.some((x) => x.fecha === m.fecha)));
check('con menos de tres dias no senala nada', diasSenalados(semanaDias.slice(0, 2), emosPorDia).mejores.length === 0);
check('pero en la semana bastan dos dias', diasSenalados(semanaDias.slice(0, 2), emosPorDia, 1, 2).mejores.length === 1);
check('los dias sin animo no cuentan', diasSenalados([diaA('2026-09-01'), diaA('2026-09-02'), diaA('2026-09-03')], []).mejores.length === 0);
const empate = diasSenalados([diaA('2026-09-01', { animo: 7 }), diaA('2026-09-05', { animo: 7 }), diaA('2026-09-03', { animo: 2 })], [], 1);
check('a igual animo, gana el mas reciente', empate.mejores[0].fecha === '2026-09-05', empate.mejores[0].fecha);

// La semana, comparada consigo misma
const anteriores = ['2026-08-31', '2026-09-01', '2026-09-02', '2026-09-03'].map((f) => diaA(f, { animo: 4, energia: 4, estres: 7 }));
const se = semanaEmocional([...anteriores, ...semanaDias], emosPorDia, '2026-09-07', '2026-09-13');
check('resume el animo de la semana', se.animoMedio === 6 && se.diasRegistrados === 5, JSON.stringify({ a: se.animoMedio, d: se.diasRegistrados }));
check('lo compara con la semana anterior', se.cambioAnimo === 2, String(se.cambioAnimo));
check('trae tambien energia y estres', se.energiaMedia === 5.8 && se.estresMedio === 5.2, JSON.stringify({ e: se.energiaMedia, s: se.estresMedio }));
check('da el mejor y el peor dia de la semana', se.mejor?.fecha === '2026-09-08' && se.peor?.fecha === '2026-09-10', JSON.stringify({ m: se.mejor?.fecha, p: se.peor?.fecha }));
check('y las emociones que mas se han repetido', se.frecuentes.length === 3 && se.frecuentes.every((f) => f.veces === 1));
const sinAnterior = semanaEmocional(semanaDias, emosPorDia, '2026-09-07', '2026-09-13');
check('sin semana anterior no inventa una comparacion', sinAnterior.cambioAnimo === null);
const dosDias = semanaEmocional([...anteriores, diaA('2026-09-07', { animo: 4 }), diaA('2026-09-08', { animo: 8, entreno: true })], [], '2026-09-07', '2026-09-13');
check('con dos dias la semana ya senala el mejor y el peor', dosDias.mejor?.fecha === '2026-09-08' && dosDias.peor?.fecha === '2026-09-07', JSON.stringify({ m: dosDias.mejor?.fecha, p: dosDias.peor?.fecha }));
const soloUno = semanaEmocional([...anteriores.slice(0, 1), ...semanaDias], emosPorDia, '2026-09-07', '2026-09-13');
check('con un solo dia anterior tampoco compara', soloUno.cambioAnimo === null);
// Un dia bueno no es una semana mejor: hacen falta dos a cada lado.
const unDiaEstaSemana = semanaEmocional([...anteriores, diaA('2026-09-08', { animo: 10 })], [], '2026-09-07', '2026-09-13');
check('con un solo dia esta semana no compara con la anterior', unDiaEstaSemana.cambioAnimo === null && unDiaEstaSemana.animoMedio === 10, JSON.stringify(unDiaEstaSemana));
const vaciaSem = semanaEmocional([diaA('2026-09-07')], [], '2026-09-07', '2026-09-13');
check('una semana sin registrar no da medias falsas', vaciaSem.animoMedio === null && vaciaSem.diasRegistrados === 0 && vaciaSem.mejor === null);

// ── 21. Habitos que se caen entre semana ───────────────────────────────
const { habitosOlvidados, diasHabilesEntre, umbralDe, avisoHabito } = await import(`${L}/motor/habitos.js`);


// 2026-09-07 es lunes; 12 viernes, 13 domingo, 14 lunes.
check('cuenta solo dias laborables', diasHabilesEntre('2026-09-07', '2026-09-09') === 2, String(diasHabilesEntre('2026-09-07', '2026-09-09')));
check('el fin de semana no suma', diasHabilesEntre('2026-09-11', '2026-09-14') === 1, String(diasHabilesEntre('2026-09-11', '2026-09-14')));
check('de viernes a lunes es un dia habil, no tres', diasHabilesEntre('2026-09-11', '2026-09-13') === 0 && diasHabilesEntre('2026-09-11', '2026-09-14') === 1);
check('el mismo dia son cero', diasHabilesEntre('2026-09-09', '2026-09-09') === 0);

check('un habito diario avisa a los 2 dias', umbralDe(7) === 2 && umbralDe(5) === 2);
check('uno de tres veces por semana aguanta mas', umbralDe(3) === 3 && umbralDe(2) === 4 && umbralDe(1) === 7);

const hab = (id, nombre, veces = 7, activo = true) => ({ id, nombre, emoji: '📚', veces_por_semana: veces, activo });
const reg = (habito_id, fecha) => ({ id: `${habito_id}-${fecha}`, habito_id, fecha, hecho: true });

// Miercoles 9: leer se hizo el lunes 7 -> martes y miercoles sin hacerlo = 2
const olv = habitosOlvidados({
  habitos: [hab('h1', 'Leer 20 min'), hab('h2', 'Estirar', 3)],
  registros: [reg('h1', '2026-09-07'), reg('h2', '2026-09-07')],
  hoy: '2026-09-09',
});
check('avisa del diario a los dos dias laborables', olv.length === 1 && olv[0].id === 'h1' && olv[0].diasHabiles === 2, JSON.stringify(olv));
check('y no del de tres veces por semana, que aun va en plazo', !olv.some((h) => h.id === 'h2'));
const olv3 = habitosOlvidados({
  habitos: [hab('h2', 'Estirar', 3)],
  registros: [reg('h2', '2026-09-07')],
  hoy: '2026-09-10',
});
check('pero al tercero si', olv3.length === 1 && olv3[0].diasHabiles === 3, JSON.stringify(olv3));

check('hoy no cuenta: aun le da tiempo', habitosOlvidados({ habitos: [hab('h1', 'Leer')], registros: [reg('h1', '2026-09-09')], hoy: '2026-09-09' }).length === 0);
check('el fin de semana no rompe nada', habitosOlvidados({ habitos: [hab('h1', 'Leer')], registros: [reg('h1', '2026-09-11')], hoy: '2026-09-14' }).length === 0, JSON.stringify(habitosOlvidados({ habitos: [hab('h1', 'Leer')], registros: [reg('h1', '2026-09-11')], hoy: '2026-09-14' })));
check('un habito apagado no da la lata', habitosOlvidados({ habitos: [hab('h1', 'Leer', 7, false)], registros: [], hoy: '2026-09-30', creados: { h1: '2026-09-01' } }).length === 0);
check('uno recien creado tampoco', habitosOlvidados({ habitos: [hab('h1', 'Leer')], registros: [], hoy: '2026-09-09', creados: { h1: '2026-09-08' } }).length === 0);
const sinEstrenar = habitosOlvidados({ habitos: [hab('h1', 'Leer')], registros: [], hoy: '2026-09-11', creados: { h1: '2026-09-07' } });
check('pero uno creado hace dias y nunca hecho, si', sinEstrenar.length === 1 && sinEstrenar[0].ultima === null, JSON.stringify(sinEstrenar));
check('el aviso de uno sin estrenar se nota que es distinto', /sin estrenarse/.test(avisoHabito(sinEstrenar[0])), avisoHabito(sinEstrenar[0]));
check('ningun aviso de habitos regaña', [avisoHabito(olv[0]), avisoHabito(sinEstrenar[0])].every((t) => !/deberias|mal|fatal|fracas|vago/i.test(t)));
check('y ofrece salir sin deuda', /no hace falta recuperar nada/i.test(avisoHabito(olv[0])), avisoHabito(olv[0]));

const varios = habitosOlvidados({
  habitos: [hab('h1', 'Leer'), hab('h3', 'Meditar')],
  registros: [reg('h1', '2026-09-07'), reg('h3', '2026-09-02')],
  hoy: '2026-09-09',
});
check('los ordena del mas abandonado al menos', varios.map((h) => h.id).join() === 'h3,h1', JSON.stringify(varios.map((h) => [h.id, h.diasHabiles])));

// La señal en el panel: solo entre semana
const baseSenal = { dias: [], objetivoEntrenos: 4, metaKcal: null, metaProteina: null, tendenciaPeso: null, ritmoObjetivo: null, racha: 0 };
const conHabito = senales({ ...baseSenal, hoy: '2026-09-09', habitosOlvidados: olv });
check('la señal sale entre semana', conHabito.some((x) => x.id === 'habito_h1'), JSON.stringify(conHabito.map((x) => x.id)));
const enSabado = senales({ ...baseSenal, hoy: '2026-09-12', habitosOlvidados: olv });
check('el fin de semana no da la brasa con esto', !enSabado.some((x) => x.id.startsWith('habito_')), JSON.stringify(enSabado.map((x) => x.id)));
check('sin habitos olvidados no hay señal', !senales({ ...baseSenal, hoy: '2026-09-09' }).some((x) => x.id.startsWith('habito_')));

// El aviso al movil
const prefs = {};
const estadoBase = { hora: 19, diaSemana: 3, tieneCheckInManana: true, tieneComidasHoy: true, entrenoHoy: true, entrenoPendienteSemana: false, revisionNueva: false, enviadosHoy: [] };
const hOlv = { nombre: 'Leer 20 min', emoji: '📚', dias: 2 };
check('manda el aviso a las 19 entre semana', decidirAvisos(prefs, { ...estadoBase, habitoOlvidado: hOlv }).includes('habito'));
check('no lo manda el domingo', !decidirAvisos(prefs, { ...estadoBase, diaSemana: 0, habitoOlvidado: hOlv }).includes('habito'));
check('ni a otra hora', !decidirAvisos(prefs, { ...estadoBase, hora: 11, habitoOlvidado: hOlv }).includes('habito'));
check('ni dos veces el mismo dia', !decidirAvisos(prefs, { ...estadoBase, habitoOlvidado: hOlv, enviadosHoy: ['habito'] }).includes('habito'));
check('ni si no hay ningun habito caido', !decidirAvisos(prefs, { ...estadoBase, habitoOlvidado: null }).includes('habito'));
check('se puede apagar', !decidirAvisos({ aviso_habito: false }, { ...estadoBase, habitoOlvidado: hOlv }).includes('habito'));
const textoH = textoAviso('habito', 'Maikel', { racha: 0, kcal: 0, metaKcal: null, habito: hOlv });
check('el aviso lleva el nombre del habito y que hacer', /Leer 20 min/.test(textoH.titulo) && /2 dias entre semana/.test(textoH.cuerpo) && textoH.url === '/app/habitos', JSON.stringify(textoH));

// ── 22. Habitos de evitar ──────────────────────────────────────────────
const { resumenEvitar, textoEvitar, patronesRecaida } = await import(`${L}/motor/habitos.js`);

const habEvitar = { id: 'e1', nombre: 'Rumiar', emoji: '🌀', veces_por_semana: 7, activo: true, tipo: 'evitar' };
const dias10 = Array.from({ length: 10 }, (_, i) => `2026-09-${String(i + 1).padStart(2, '0')}`);
const caida = (fecha, nota = null) => ({ id: `c-${fecha}`, habito_id: 'e1', fecha, hecho: true, nota });

// Cayo el 1 y el 4; del 5 al 10 limpio.
const rEv = resumenEvitar(habEvitar, [caida('2026-09-01', 'poco sueño'), caida('2026-09-04')], dias10);
check('la racha son los dias SIN caer', rEv.racha === 6, String(rEv.racha));
check('cuenta los dias limpios y las caidas', rEv.diasLimpios === 8 && rEv.recaidas.length === 2, JSON.stringify({ l: rEv.diasLimpios, r: rEv.recaidas.length }));
check('guarda la mejor racha', rEv.mejorRacha === 6, String(rEv.mejorRacha));
check('las caidas vienen de la mas reciente y con su nota', rEv.recaidas[0].fecha === '2026-09-04' && rEv.recaidas[1].nota === 'poco sueño');
check('sin ninguna caida, la racha es todo el periodo', resumenEvitar(habEvitar, [], dias10).racha === 10);
const hoyCaido = resumenEvitar(habEvitar, [caida('2026-09-10')], dias10);
check('si caes hoy la racha se pone a cero y se sabe', hoyCaido.racha === 0 && hoyCaido.caidoHoy === true);
check('el dia empieza limpio mientras no marques nada', resumenEvitar(habEvitar, [caida('2026-09-09')], dias10).caidoHoy === false);

check('al caer se mira lo que sigue en pie, no la culpa', /no borra eso/.test(textoEvitar(hoyCaido)), textoEvitar(hoyCaido));
check('la primera caida no dramatiza', /la mitad del trabajo/.test(textoEvitar(resumenEvitar(habEvitar, [caida('2026-09-10')], ['2026-09-10']))));
check('celebra la mejor racha sin exagerar', /mejor racha/.test(textoEvitar(rEv)), textoEvitar(rEv));
check('ningun texto de evitar culpabiliza', [textoEvitar(hoyCaido), textoEvitar(rEv)].every((t) => !/deberias|mal|fatal|fracas|recaida|debil/i.test(t)));

// El patron con lo que la app ya sabe
const diasPat = [
  ...['2026-09-01', '2026-09-02', '2026-09-03'].map((f) => diaMock(f, { suenoHoras: 5.5, animo: 4, estres: 8 })),
  ...['2026-09-05', '2026-09-06', '2026-09-07', '2026-09-08'].map((f) => diaMock(f, { suenoHoras: 7.5, animo: 8, estres: 3 })),
];
const patRec = patronesRecaida('e1', ['2026-09-01', '2026-09-02', '2026-09-03'].map((f) => caida(f)), diasPat);
check('cruza las caidas con el sueño', patRec.some((x) => x.id === 'sueno' && /5,5 h/.test(x.texto)), JSON.stringify(patRec.map((x) => x.texto)));
check('y con el estres', patRec.some((x) => x.id === 'estres'), JSON.stringify(patRec.map((x) => x.id)));
check('con pocos dias no inventa patrones', patronesRecaida('e1', [caida('2026-09-01')], diasPat).length === 0);

// Los de evitar no entran en la regla de "llevas dias sin hacerlo"
const mezclaHab = habitosOlvidados({
  habitos: [hab('h1', 'Leer'), { ...habEvitar, id: 'e1' }],
  registros: [reg('h1', '2026-09-07')],
  hoy: '2026-09-09',
  creados: { e1: '2026-09-01' },
});
check('un habito de evitar nunca sale como olvidado', !mezclaHab.some((h) => h.id === 'e1'), JSON.stringify(mezclaHab.map((h) => h.id)));

// El coach
const habsCoach = supabase.db.tablas.habitos ?? [];
check('el coach crea el habito de evitar con su tipo', habsCoach.some((h) => h.nombre === 'Rumiar por la noche' && h.tipo === 'evitar'), JSON.stringify(habsCoach.map((h) => [h.nombre, h.tipo])));
const rumia = habsCoach.find((h) => h.nombre === 'Rumiar por la noche');
const regRumia = (supabase.db.tablas.habitos_registro ?? []).find((r) => r.habito_id === rumia?.id);
check('apunta la caida con lo que la disparo', regRumia?.hecho === true && /Mail del cliente/.test(regRumia?.nota ?? ''), JSON.stringify(regRumia));
check('y no da XP por caer', !(supabase.db.tablas.xp_eventos ?? []).some((x) => x.motivo === 'Rumiar por la noche'));

console.log(fallos ? `\n${fallos} COMPROBACIONES FALLIDAS` : '\nTodo correcto.');
process.exit(fallos ? 1 : 0);
