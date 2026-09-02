import { fechaLarga } from '../fechas';
import { correlaciones } from '../motor/puntuaciones';
import { ETIQUETA_CATEGORIA_FOCO, ETIQUETA_OBJETIVO } from '../perfil';
import type { Panel } from '../datos';

const n = (valor: number | null | undefined, decimales = 1) =>
  valor === null || valor === undefined || !Number.isFinite(valor) ? '—' : valor.toFixed(decimales);

/**
 * Contexto que el coach recibe en cada mensaje. Son datos calculados por la app,
 * no estimaciones del modelo: aqui esta la unica fuente de verdad numerica.
 */
export function construirContexto(panel: Panel): string {
  const { perfil, metas, cuerpo, diaHoy, semana, puntuaciones } = panel;
  const l: string[] = [];

  l.push(`FECHA: ${fechaLarga(panel.hoy)} (${panel.hoy}).`);

  l.push('\nPERFIL');
  l.push(
    `- ${perfil.nombre ?? 'sin nombre'}, ${perfil.sexo ?? '?'}, ${perfil.edad ?? '?'} años, ${n(perfil.altura_cm, 0)} cm.` +
      (perfil.ocupacion ? ` Ocupacion: ${perfil.ocupacion}.` : ''),
  );
  l.push(
    `- Objetivo: ${perfil.objetivo ? ETIQUETA_OBJETIVO[perfil.objetivo] : 'sin definir'}. Nivel: ${perfil.nivel ?? '?'}. ` +
      `Entrena ${perfil.dias_semana ?? '?'} dias/semana en ${perfil.entorno ?? '?'}. Actividad diaria: ${perfil.actividad ?? '?'}.`,
  );
  if (perfil.limitaciones.length) l.push(`- Molestias: ${perfil.limitaciones.join(', ')}.`);
  if (perfil.alergias.length) l.push(`- Alergias: ${perfil.alergias.join(', ')}.`);
  if (perfil.preferencias_comida) l.push(`- Comida: ${perfil.preferencias_comida}.`);
  if (perfil.hora_dormir || perfil.hora_despertar) {
    l.push(`- Sueno habitual: ${perfil.hora_dormir ?? '?'} a ${perfil.hora_despertar ?? '?'}.`);
  }

  l.push('\nOBJETIVOS DIARIOS (calculados por la app)');
  if (metas) {
    l.push(
      `- ${metas.kcal} kcal · ${metas.proteinaG} g proteina · ${metas.grasaG} g grasa · ${metas.carbosG} g carbos · ${metas.aguaMl} ml agua · ${metas.pasos} pasos.`,
    );
    l.push(`- Ritmo de peso objetivo: ${n(metas.ritmoKgSemana, 2)} kg/semana. Gasto estimado: ${metas.gastoTotal} kcal.`);
  } else {
    l.push('- Sin calcular todavia: falta peso o datos del perfil.');
  }

  l.push('\nCUERPO');
  l.push(
    `- Peso: ${n(cuerpo.peso)} kg${cuerpo.fecha ? ` (${cuerpo.fecha})` : ''}. Tendencia 4 semanas: ${cuerpo.tendencia === null ? 'sin datos' : `${n(cuerpo.tendencia, 2)} kg/semana`}.`,
  );
  l.push(
    `- Grasa estimada: ${n(cuerpo.grasaPct)} %. Masa magra: ${n(cuerpo.masaMagra)} kg. IMC: ${n(cuerpo.imc)}. Cintura: ${n(cuerpo.cintura)} cm.`,
  );

  l.push('\nHOY');
  l.push(
    `- Comidas: ${diaHoy.comidas} · ${diaHoy.kcal} kcal · ${diaHoy.proteina} g proteina${diaHoy.alcoholUd ? ` · ${diaHoy.alcoholUd} ud de alcohol` : ''}.`,
  );
  l.push(
    `- Entreno: ${diaHoy.entreno ? 'hecho' : 'pendiente'}. Foco: ${diaHoy.focoMin} min. Habitos: ${diaHoy.habitosHechos}/${diaHoy.habitosTotal}.`,
  );
  l.push(
    `- Animo ${diaHoy.animo ?? '—'}/10 · energia ${diaHoy.energia ?? '—'}/10 · estres ${diaHoy.estres ?? '—'}/10 · sueno ${diaHoy.suenoHoras ?? '—'} h.`,
  );

  l.push('\nESTA SEMANA');
  const entrenosSemana = semana.filter((d) => d.entreno).length;
  const focoSemana = semana.reduce((total, d) => total + d.focoMin, 0) / 60;
  const alcoholSemana = semana.filter((d) => d.alcoholUd > 0).length;
  const kcalMedia = (() => {
    const conDatos = semana.filter((d) => d.comidas > 0);
    return conDatos.length ? Math.round(conDatos.reduce((t, d) => t + d.kcal, 0) / conDatos.length) : null;
  })();
  l.push(
    `- Entrenos ${entrenosSemana}/${perfil.dias_semana ?? '?'} · foco ${focoSemana.toFixed(1)} h · dias con alcohol ${alcoholSemana} · media ${kcalMedia ?? '—'} kcal.`,
  );
  l.push(
    `- Puntuaciones: nutricion ${puntuaciones.nutricion ?? '—'}, entrenamiento ${puntuaciones.entrenamiento ?? '—'}, foco ${puntuaciones.foco ?? '—'}, habitos ${puntuaciones.habitos ?? '—'}, mente ${puntuaciones.mente ?? '—'}, global ${puntuaciones.global ?? '—'} (sobre 100).`,
  );
  l.push(`- Nivel ${panel.progreso.nivel} · ${panel.progreso.xp} XP · racha de ${panel.racha} dias.`);

  const ultimos = panel.dias.slice(-14);
  if (ultimos.some((d) => d.comidas || d.entreno || d.focoMin || d.animo)) {
    l.push('\nULTIMOS 14 DIAS (fecha | kcal | prot | entreno | foco min | sueno h | animo)');
    for (const d of ultimos) {
      l.push(
        `${d.fecha} | ${d.kcal || '—'} | ${d.proteina || '—'} | ${d.entreno ? 'si' : 'no'} | ${d.focoMin || 0} | ${d.suenoHoras ?? '—'} | ${d.animo ?? '—'}`,
      );
    }
  }

  const correl = correlaciones(panel.dias.slice(-30));
  if (correl.length) {
    l.push('\nPATRONES DETECTADOS (correlacion de Pearson, calculada por la app)');
    for (const c of correl.slice(0, 4)) {
      l.push(`- ${c.variable} vs ${c.contra}: r = ${c.r} (n = ${c.n}).`);
    }
  }

  if (panel.plan) {
    l.push('\nPLAN DE ENTRENO ACTIVO');
    for (const dia of panel.plan.dias) {
      l.push(`- ${dia.nombre}: ${dia.bloques.length} ejercicios (${dia.foco}).`);
    }
  } else {
    l.push('\nPLAN DE ENTRENO: no hay ninguno generado todavia.');
  }

  if (panel.habitos.length) {
    l.push('\nHABITOS');
    for (const h of panel.habitos) {
      const hechos = panel.registrosHabitos.filter((r) => r.habito_id === h.id && r.hecho).length;
      l.push(`- ${h.nombre} (${h.veces_por_semana}/semana): ${hechos} marcas en los ultimos 60 dias.`);
    }
  }

  if (panel.objetivos.length) {
    l.push('\nOBJETIVOS ACTIVOS');
    for (const o of panel.objetivos) {
      l.push(`- [${o.area}] ${o.titulo}${o.fecha_limite ? ` (antes de ${o.fecha_limite})` : ''}.`);
    }
  }

  if (panel.tareas.length) {
    l.push('\nTAREAS PENDIENTES');
    for (const t of panel.tareas.slice(0, 8)) l.push(`- ${t.titulo}`);
  }

  if (panel.memoria.length) {
    l.push('\nLO QUE SE DE EL (memoria)');
    for (const m of panel.memoria.slice(0, 25)) l.push(`- ${m.clave}: ${m.valor}`);
  }

  const focoPorCategoria = new Map<string, number>();
  for (const d of panel.dias.slice(-30)) {
    if (d.focoMin) focoPorCategoria.set('total', (focoPorCategoria.get('total') ?? 0) + d.focoMin);
  }
  if (focoPorCategoria.get('total')) {
    l.push(`\nFOCO ULTIMOS 30 DIAS: ${((focoPorCategoria.get('total') ?? 0) / 60).toFixed(1)} h en total.`);
  }

  return l.join('\n');
}

export { ETIQUETA_CATEGORIA_FOCO };
