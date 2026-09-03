import type Anthropic from '@anthropic-ai/sdk';
import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { hoy as hoyIso, sumarDias } from '../fechas';
import { calcularComida } from '../motor/alimentos';
import { TIPOS_CARDIO, kcalCardio } from '../motor/cardio';
import { emparejarEjercicio } from '../motor/ejercicios';
import { firmaPerfil, generarPlan } from '../motor/planificador';
import { XP_POR_ACCION } from '../motor/puntuaciones';
import { perfilEntreno } from '../perfil';
import type { AccionRegistrada, Perfil } from '../tipos';

export interface ContextoHerramientas {
  supabase: SupabaseClient;
  userId: string;
  perfil: Perfil;
  hoy: string;
  /** Ultimo peso corporal conocido, para estimar calorias de cardio. */
  pesoKg?: number | null;
}

// ── Definiciones que ve el modelo ───────────────────────────────────────

const FECHA = { type: 'string' as const, description: 'Fecha YYYY-MM-DD. Omitir para hoy.' };

export const HERRAMIENTAS: Anthropic.Tool[] = [
  {
    name: 'calcular_comida',
    description:
      'Calcula kcal y macros de una comida con la tabla de alimentos de la app (valores por 100 g, sin estimar). Usala ANTES de registrar_comida cuando el usuario describa ingredientes o platos comunes con cantidades. Devuelve los totales y las partes que no estan en la tabla, que si estimaras tu.',
    input_schema: {
      type: 'object',
      properties: {
        texto: {
          type: 'string',
          description: 'La comida tal cual, separando partes por comas. Ej: "200 g pollo, 150 arroz cocido, 1 cucharada de aceite, un platano".',
        },
      },
      required: ['texto'],
    },
  },
  {
    name: 'registrar_comida',
    description:
      'Apunta algo que el usuario ha comido o bebido. Estima los macros a partir de la descripcion si no los da. Una llamada por comida o bebida.',
    input_schema: {
      type: 'object',
      properties: {
        descripcion: { type: 'string', description: 'Que ha tomado, con cantidades si las sabes.' },
        momento: { type: 'string', enum: ['desayuno', 'comida', 'cena', 'snack', 'bebida'] },
        kcal: { type: 'number' },
        proteina_g: { type: 'number' },
        carbos_g: { type: 'number' },
        grasa_g: { type: 'number' },
        alcohol_ud: { type: 'number', description: 'Unidades de alcohol (1 cerveja o 1 copa de vino = 1).' },
        confianza: { type: 'string', enum: ['alta', 'media', 'baja'] },
        fecha: FECHA,
      },
      required: ['descripcion', 'kcal'],
    },
  },
  {
    name: 'registrar_peso',
    description: 'Apunta el peso y, si los da, los perimetros corporales de un dia.',
    input_schema: {
      type: 'object',
      properties: {
        peso_kg: { type: 'number' },
        cuello_cm: { type: 'number' },
        pecho_cm: { type: 'number' },
        cintura_cm: { type: 'number' },
        cadera_cm: { type: 'number' },
        brazo_cm: { type: 'number' },
        muslo_cm: { type: 'number' },
        notas: { type: 'string' },
        fecha: FECHA,
      },
      required: [],
    },
  },
  {
    name: 'registrar_entrenamiento',
    description:
      'Apunta un entrenamiento con sus ejercicios y series. Si el usuario solo dice que ha entrenado algo ("hoy pecho"), registra el entreno sin series.',
    input_schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', description: 'Ej: "Torso A" o "Pecho y triceps".' },
        fecha: FECHA,
        sensacion: { type: 'number', description: 'Del 1 al 5.' },
        duracion_min: { type: 'number' },
        notas: { type: 'string' },
        cardio_tipo: {
          type: 'string',
          enum: TIPOS_CARDIO.map((t) => t.id),
          description: 'Cardio hecho en la sesion, si lo hubo.',
        },
        cardio_min: { type: 'number', description: 'Minutos de cardio.' },
        ejercicios: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              nombre: { type: 'string' },
              series: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    peso_kg: { type: 'number' },
                    reps: { type: 'number' },
                    rir: { type: 'number' },
                  },
                },
              },
            },
            required: ['nombre'],
          },
        },
      },
      required: ['nombre'],
    },
  },
  {
    name: 'registrar_foco',
    description: 'Apunta tiempo de trabajo profundo, de negocio, de estudio o de lectura.',
    input_schema: {
      type: 'object',
      properties: {
        categoria: {
          type: 'string',
          enum: ['deep_work', 'negocio', 'aprendizaje', 'idiomas', 'lectura', 'otro'],
        },
        minutos: { type: 'number' },
        descripcion: { type: 'string' },
        fecha: FECHA,
      },
      required: ['categoria', 'minutos'],
    },
  },
  {
    name: 'registrar_bienestar',
    description:
      'Apunta como ha dormido y como se encuentra. Escalas del 1 al 10. Solo los campos que mencione.',
    input_schema: {
      type: 'object',
      properties: {
        animo: { type: 'number' },
        energia: { type: 'number' },
        estres: { type: 'number' },
        ansiedad: { type: 'number' },
        motivacion: { type: 'number' },
        sueno_horas: { type: 'number' },
        sueno_calidad: { type: 'number' },
        pasos: { type: 'number' },
        notas: { type: 'string' },
        fecha: FECHA,
      },
      required: [],
    },
  },
  {
    name: 'registrar_habito',
    description: 'Marca un habito como hecho (o no hecho) en un dia. Si el habito no existe, se crea.',
    input_schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        hecho: { type: 'boolean' },
        fecha: FECHA,
      },
      required: ['nombre'],
    },
  },
  {
    name: 'crear_habito',
    description: 'Crea un habito nuevo que el usuario quiere sostener.',
    input_schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        emoji: { type: 'string' },
        veces_por_semana: { type: 'number' },
      },
      required: ['nombre'],
    },
  },
  {
    name: 'crear_objetivo',
    description: 'Guarda un objetivo del usuario con su area y, si la hay, su metrica.',
    input_schema: {
      type: 'object',
      properties: {
        area: {
          type: 'string',
          enum: ['cuerpo', 'fitness', 'productividad', 'aprendizaje', 'mente', 'negocio'],
        },
        titulo: { type: 'string' },
        detalle: { type: 'string' },
        metrica: { type: 'string' },
        valor_objetivo: { type: 'number' },
        fecha_limite: { type: 'string' },
      },
      required: ['area', 'titulo'],
    },
  },
  {
    name: 'crear_tarea',
    description: 'Anota una tarea concreta que el usuario se compromete a hacer.',
    input_schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string' },
        area: { type: 'string' },
        prioridad: { type: 'number', description: '1 alta, 2 media, 3 baja.' },
        fecha: FECHA,
      },
      required: ['titulo'],
    },
  },
  {
    name: 'recordar',
    description:
      'Guarda un dato duradero sobre el usuario (lesion, preferencia, contexto vital, decision) para tenerlo en cuenta siempre.',
    input_schema: {
      type: 'object',
      properties: {
        clave: { type: 'string', description: 'Identificador corto, ej: "lesion_hombro".' },
        valor: { type: 'string' },
        categoria: { type: 'string' },
      },
      required: ['clave', 'valor'],
    },
  },
  {
    name: 'actualizar_perfil',
    description:
      'Actualiza los datos del perfil. Usalo durante el alta y cuando el usuario cambie algo estable (objetivo, dias que entrena, material, lesiones).',
    input_schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string' },
        sexo: { type: 'string', enum: ['hombre', 'mujer'] },
        edad: { type: 'number' },
        altura_cm: { type: 'number' },
        ocupacion: { type: 'string' },
        objetivo: {
          type: 'string',
          enum: ['perder_grasa', 'ganar_musculo', 'recomposicion', 'fuerza', 'rendimiento', 'energia', 'salud_mental'],
        },
        nivel: { type: 'string', enum: ['principiante', 'intermedio', 'avanzado'] },
        dias_semana: { type: 'number' },
        entorno: { type: 'string', enum: ['gimnasio', 'casa_mancuernas', 'casa_sin_material'] },
        actividad: { type: 'string', enum: ['sedentario', 'ligera', 'moderada', 'alta'] },
        limitaciones: { type: 'array', items: { type: 'string' } },
        alergias: { type: 'array', items: { type: 'string' } },
        preferencias_comida: { type: 'string' },
        alcohol_semanal: { type: 'number' },
        hora_dormir: { type: 'string' },
        hora_despertar: { type: 'string' },
        onboarding: { type: 'boolean', description: 'true cuando el alta esta completa.' },
      },
      required: [],
    },
  },
  {
    name: 'generar_plan_entreno',
    description:
      'Genera (o regenera) el plan de entrenamiento con los datos actuales del perfil. Usalo tras el alta o si cambian objetivo, dias, nivel, material o lesiones.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'consultar_historial',
    description:
      'Consulta los datos registrados de un rango de fechas cuando necesites numeros que no estan en el contexto.',
    input_schema: {
      type: 'object',
      properties: {
        dias: { type: 'number', description: 'Cuantos dias hacia atras (por defecto 14).' },
        areas: {
          type: 'array',
          items: { type: 'string', enum: ['nutricion', 'entrenamiento', 'foco', 'bienestar', 'peso', 'habitos'] },
        },
      },
      required: [],
    },
  },
];

// ── Ejecucion ───────────────────────────────────────────────────────────

const num = z.number().finite();
const fechaOpc = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional();

async function otorgarXp(ctx: ContextoHerramientas, tipo: string, motivo: string): Promise<number> {
  const xp = XP_POR_ACCION[tipo] ?? 5;
  await ctx.supabase.from('xp_eventos').insert({
    user_id: ctx.userId,
    fecha: ctx.hoy,
    tipo,
    xp,
    motivo,
  });
  return xp;
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .trim();
}

export interface ResultadoHerramienta {
  texto: string;
  accion: AccionRegistrada | null;
}

export async function ejecutarHerramienta(
  nombre: string,
  entrada: unknown,
  ctx: ContextoHerramientas,
): Promise<ResultadoHerramienta> {
  try {
    return await despachar(nombre, entrada, ctx);
  } catch (error) {
    console.error(`[coach] fallo la herramienta ${nombre}`, error);
    return { texto: `Error al ejecutar ${nombre}: ${(error as Error).message}`, accion: null };
  }
}

async function despachar(
  nombre: string,
  entrada: unknown,
  ctx: ContextoHerramientas,
): Promise<ResultadoHerramienta> {
  const { supabase, userId } = ctx;

  switch (nombre) {
    case 'calcular_comida': {
      const d = z.object({ texto: z.string().min(1) }).parse(entrada);
      const r = calcularComida(d.texto);
      const detalle = r.lineas
        .filter((l) => l.alimento)
        .map((l) => `${l.alimento!.nombre} ${l.gramos} g: ${l.kcal} kcal, ${l.proteina} P, ${l.carbos} C, ${l.grasa} G`)
        .join('; ');
      const texto = [
        `Total segun tabla: ${r.kcal} kcal, ${r.proteina} g proteina, ${r.carbos} g carbos, ${r.grasa} g grasa${r.alcoholUd ? `, ${r.alcoholUd} ud alcohol` : ''}.`,
        detalle ? `Detalle: ${detalle}.` : 'Ninguna parte reconocida.',
        r.sinReconocer.length
          ? `No estan en la tabla (estimalas tu y sumalas): ${r.sinReconocer.join(', ')}.`
          : 'Todas las partes reconocidas: registra con confianza alta.',
      ].join(' ');
      return { texto, accion: null };
    }

    case 'registrar_comida': {
      const d = z
        .object({
          descripcion: z.string().min(1),
          momento: z.enum(['desayuno', 'comida', 'cena', 'snack', 'bebida']).optional(),
          kcal: num,
          proteina_g: num.optional(),
          carbos_g: num.optional(),
          grasa_g: num.optional(),
          alcohol_ud: num.optional(),
          confianza: z.enum(['alta', 'media', 'baja']).optional(),
          fecha: fechaOpc,
        })
        .parse(entrada);

      const fecha = d.fecha ?? ctx.hoy;
      const { error } = await supabase.from('comidas').insert({
        user_id: userId,
        fecha,
        momento: d.momento ?? null,
        descripcion: d.descripcion,
        kcal: Math.round(d.kcal),
        proteina_g: d.proteina_g ? Math.round(d.proteina_g) : null,
        carbos_g: d.carbos_g ? Math.round(d.carbos_g) : null,
        grasa_g: d.grasa_g ? Math.round(d.grasa_g) : null,
        alcohol_ud: d.alcohol_ud ?? 0,
        fuente: 'chat',
        confianza: d.confianza ?? 'media',
      });
      if (error) throw error;

      const xp = await otorgarXp(ctx, 'comida', d.descripcion);
      return {
        texto: `Comida registrada: ${d.descripcion} · ${Math.round(d.kcal)} kcal, ${d.proteina_g ?? '?'} g de proteina.`,
        accion: { herramienta: nombre, resumen: `${d.descripcion} · ${Math.round(d.kcal)} kcal`, xp },
      };
    }

    case 'registrar_peso': {
      const d = z
        .object({
          peso_kg: num.optional(),
          cuello_cm: num.optional(),
          pecho_cm: num.optional(),
          cintura_cm: num.optional(),
          cadera_cm: num.optional(),
          brazo_cm: num.optional(),
          muslo_cm: num.optional(),
          notas: z.string().optional(),
          fecha: fechaOpc,
        })
        .parse(entrada);

      const fecha = d.fecha ?? ctx.hoy;
      const fila = {
        user_id: userId,
        fecha,
        peso_kg: d.peso_kg ?? null,
        cuello_cm: d.cuello_cm ?? null,
        pecho_cm: d.pecho_cm ?? null,
        cintura_cm: d.cintura_cm ?? null,
        cadera_cm: d.cadera_cm ?? null,
        brazo_cm: d.brazo_cm ?? null,
        muslo_cm: d.muslo_cm ?? null,
        notas: d.notas ?? null,
      };
      const { error } = await supabase
        .from('metricas_corporales')
        .upsert(fila, { onConflict: 'user_id,fecha' });
      if (error) throw error;

      const conPerimetros = Boolean(d.cintura_cm || d.cadera_cm || d.brazo_cm);
      const xp = await otorgarXp(ctx, conPerimetros ? 'medidas' : 'peso', `medicion ${fecha}`);
      return {
        texto: `Medicion guardada (${fecha})${d.peso_kg ? `: ${d.peso_kg} kg` : ''}.`,
        accion: { herramienta: nombre, resumen: d.peso_kg ? `${d.peso_kg} kg` : 'medidas', xp },
      };
    }

    case 'registrar_entrenamiento': {
      const d = z
        .object({
          nombre: z.string().min(1),
          fecha: fechaOpc,
          sensacion: num.optional(),
          duracion_min: num.optional(),
          notas: z.string().optional(),
          cardio_tipo: z.string().optional(),
          cardio_min: num.optional(),
          ejercicios: z
            .array(
              z.object({
                nombre: z.string().min(1),
                series: z
                  .array(z.object({ peso_kg: num.optional(), reps: num.optional(), rir: num.optional() }))
                  .optional(),
              }),
            )
            .optional(),
        })
        .parse(entrada);

      const fecha = d.fecha ?? ctx.hoy;
      const cardio =
        d.cardio_tipo && d.cardio_min && d.cardio_min > 0
          ? { tipo: d.cardio_tipo, minutos: Math.round(d.cardio_min), kcal: kcalCardio(d.cardio_tipo, d.cardio_min, ctx.pesoKg ?? 75) }
          : null;
      const { data: entreno, error } = await supabase
        .from('entrenamientos')
        .insert({
          user_id: userId,
          fecha,
          nombre: d.nombre,
          sensacion: d.sensacion ? Math.round(d.sensacion) : null,
          duracion_min: d.duracion_min ? Math.round(d.duracion_min) : null,
          notas: d.notas ?? null,
          completado: true,
          cardio_tipo: cardio?.tipo ?? null,
          cardio_min: cardio?.minutos ?? null,
          cardio_kcal: cardio?.kcal ?? null,
        })
        .select('id')
        .single();
      if (error) throw error;

      let totalSeries = 0;
      const filas = (d.ejercicios ?? []).flatMap((ejercicio, orden) => {
        const info = emparejarEjercicio(ejercicio.nombre);
        return (ejercicio.series ?? []).map((s, indice) => {
          totalSeries += 1;
          return {
            user_id: userId,
            entrenamiento_id: entreno.id,
            ejercicio_id: info.id,
            ejercicio_nombre: info.nombre,
            orden,
            serie: indice + 1,
            peso_kg: s.peso_kg ?? null,
            reps: s.reps ? Math.round(s.reps) : null,
            rir: s.rir !== undefined ? Math.round(s.rir) : null,
            hecha: true,
          };
        });
      });
      if (filas.length) {
        const { error: errorSeries } = await supabase.from('series').insert(filas);
        if (errorSeries) throw errorSeries;
      }

      const xp = await otorgarXp(ctx, 'entreno', d.nombre);
      const textoCardio = cardio ? ` + ${cardio.minutos} min de cardio (~${cardio.kcal} kcal)` : '';
      return {
        texto: `Entreno registrado: ${d.nombre} (${totalSeries} series)${textoCardio}.`,
        accion: { herramienta: nombre, resumen: `${d.nombre} · ${totalSeries} series${textoCardio}`, xp },
      };
    }

    case 'registrar_foco': {
      const d = z
        .object({
          categoria: z.enum(['deep_work', 'negocio', 'aprendizaje', 'idiomas', 'lectura', 'otro']),
          minutos: num.positive(),
          descripcion: z.string().optional(),
          fecha: fechaOpc,
        })
        .parse(entrada);

      const { error } = await supabase.from('foco').insert({
        user_id: userId,
        fecha: d.fecha ?? ctx.hoy,
        categoria: d.categoria,
        minutos: Math.round(d.minutos),
        descripcion: d.descripcion ?? null,
      });
      if (error) throw error;

      const xp = await otorgarXp(ctx, 'foco', d.descripcion ?? d.categoria);
      return {
        texto: `Apuntados ${Math.round(d.minutos)} min de ${d.categoria.replace('_', ' ')}.`,
        accion: { herramienta: nombre, resumen: `${Math.round(d.minutos)} min · ${d.categoria.replace('_', ' ')}`, xp },
      };
    }

    case 'registrar_bienestar': {
      const d = z
        .object({
          animo: num.optional(),
          energia: num.optional(),
          estres: num.optional(),
          ansiedad: num.optional(),
          motivacion: num.optional(),
          sueno_horas: num.optional(),
          sueno_calidad: num.optional(),
          pasos: num.optional(),
          notas: z.string().optional(),
          fecha: fechaOpc,
        })
        .parse(entrada);

      const fecha = d.fecha ?? ctx.hoy;
      const escala = (v: number | undefined) =>
        v === undefined ? undefined : Math.max(1, Math.min(10, Math.round(v)));

      const { data: previo } = await supabase
        .from('bienestar')
        .select('*')
        .eq('user_id', userId)
        .eq('fecha', fecha)
        .maybeSingle();

      const fila = {
        ...(previo ?? {}),
        user_id: userId,
        fecha,
        animo: escala(d.animo) ?? previo?.animo ?? null,
        energia: escala(d.energia) ?? previo?.energia ?? null,
        estres: escala(d.estres) ?? previo?.estres ?? null,
        ansiedad: escala(d.ansiedad) ?? previo?.ansiedad ?? null,
        motivacion: escala(d.motivacion) ?? previo?.motivacion ?? null,
        sueno_horas: d.sueno_horas ?? previo?.sueno_horas ?? null,
        sueno_calidad: escala(d.sueno_calidad) ?? previo?.sueno_calidad ?? null,
        pasos: d.pasos ? Math.round(d.pasos) : previo?.pasos ?? null,
        notas: d.notas ?? previo?.notas ?? null,
      };
      const { error } = await supabase.from('bienestar').upsert(fila, { onConflict: 'user_id,fecha' });
      if (error) throw error;

      const xp = await otorgarXp(ctx, 'checkin', `bienestar ${fecha}`);
      const partes = [
        d.sueno_horas !== undefined ? `${d.sueno_horas} h de sueno` : null,
        d.animo !== undefined ? `animo ${escala(d.animo)}/10` : null,
        d.energia !== undefined ? `energia ${escala(d.energia)}/10` : null,
      ].filter(Boolean);
      return {
        texto: `Bienestar guardado (${fecha}).`,
        accion: { herramienta: nombre, resumen: partes.join(' · ') || 'check-in', xp },
      };
    }

    case 'registrar_habito': {
      const d = z
        .object({ nombre: z.string().min(1), hecho: z.boolean().optional(), fecha: fechaOpc })
        .parse(entrada);
      const fecha = d.fecha ?? ctx.hoy;

      const { data: existentes } = await supabase
        .from('habitos')
        .select('id, nombre')
        .eq('user_id', userId);
      const objetivo = normalizar(d.nombre);
      let habito = (existentes ?? []).find((h) => normalizar(h.nombre) === objetivo);

      if (!habito) {
        const { data: creado, error } = await supabase
          .from('habitos')
          .insert({ user_id: userId, nombre: d.nombre, activo: true })
          .select('id, nombre')
          .single();
        if (error) throw error;
        habito = creado;
      }

      const { error: errorRegistro } = await supabase
        .from('habitos_registro')
        .upsert(
          { user_id: userId, habito_id: habito.id, fecha, hecho: d.hecho ?? true },
          { onConflict: 'habito_id,fecha' },
        );
      if (errorRegistro) throw errorRegistro;

      const xp = d.hecho === false ? 0 : await otorgarXp(ctx, 'habito', habito.nombre);
      return {
        texto: `Habito "${habito.nombre}" marcado como ${d.hecho === false ? 'no hecho' : 'hecho'} (${fecha}).`,
        accion: { herramienta: nombre, resumen: `${habito.nombre}`, xp },
      };
    }

    case 'crear_habito': {
      const d = z
        .object({ nombre: z.string().min(1), emoji: z.string().optional(), veces_por_semana: num.optional() })
        .parse(entrada);
      const { error } = await supabase.from('habitos').insert({
        user_id: userId,
        nombre: d.nombre,
        emoji: d.emoji ?? '✅',
        veces_por_semana: d.veces_por_semana ? Math.max(1, Math.min(7, Math.round(d.veces_por_semana))) : 7,
      });
      if (error) throw error;
      return {
        texto: `Habito creado: ${d.nombre}.`,
        accion: { herramienta: nombre, resumen: `nuevo habito · ${d.nombre}` },
      };
    }

    case 'crear_objetivo': {
      const d = z
        .object({
          area: z.enum(['cuerpo', 'fitness', 'productividad', 'aprendizaje', 'mente', 'negocio']),
          titulo: z.string().min(1),
          detalle: z.string().optional(),
          metrica: z.string().optional(),
          valor_objetivo: num.optional(),
          fecha_limite: fechaOpc,
        })
        .parse(entrada);
      const { error } = await supabase.from('objetivos').insert({
        user_id: userId,
        area: d.area,
        titulo: d.titulo,
        detalle: d.detalle ?? null,
        metrica: d.metrica ?? null,
        valor_objetivo: d.valor_objetivo ?? null,
        fecha_limite: d.fecha_limite ?? null,
      });
      if (error) throw error;
      const xp = await otorgarXp(ctx, 'objetivo', d.titulo);
      return {
        texto: `Objetivo guardado: ${d.titulo}.`,
        accion: { herramienta: nombre, resumen: `objetivo · ${d.titulo}`, xp },
      };
    }

    case 'crear_tarea': {
      const d = z
        .object({
          titulo: z.string().min(1),
          area: z.string().optional(),
          prioridad: num.optional(),
          fecha: fechaOpc,
        })
        .parse(entrada);
      const { error } = await supabase.from('tareas').insert({
        user_id: userId,
        titulo: d.titulo,
        area: d.area ?? null,
        prioridad: d.prioridad ? Math.max(1, Math.min(3, Math.round(d.prioridad))) : 2,
        fecha: d.fecha ?? ctx.hoy,
      });
      if (error) throw error;
      return {
        texto: `Tarea anotada: ${d.titulo}.`,
        accion: { herramienta: nombre, resumen: `tarea · ${d.titulo}` },
      };
    }

    case 'recordar': {
      const d = z
        .object({ clave: z.string().min(1), valor: z.string().min(1), categoria: z.string().optional() })
        .parse(entrada);
      const { error } = await supabase.from('memoria').upsert(
        {
          user_id: userId,
          clave: d.clave.slice(0, 80),
          valor: d.valor,
          categoria: d.categoria ?? 'general',
          actualizado: new Date().toISOString(),
        },
        { onConflict: 'user_id,clave' },
      );
      if (error) throw error;
      return {
        texto: `Anotado para el futuro: ${d.valor}`,
        accion: { herramienta: nombre, resumen: `recordare: ${d.valor.slice(0, 60)}` },
      };
    }

    case 'actualizar_perfil': {
      const d = z
        .object({
          nombre: z.string().optional(),
          sexo: z.enum(['hombre', 'mujer']).optional(),
          edad: num.optional(),
          altura_cm: num.optional(),
          ocupacion: z.string().optional(),
          objetivo: z
            .enum(['perder_grasa', 'ganar_musculo', 'recomposicion', 'fuerza', 'rendimiento', 'energia', 'salud_mental'])
            .optional(),
          nivel: z.enum(['principiante', 'intermedio', 'avanzado']).optional(),
          dias_semana: num.optional(),
          entorno: z.enum(['gimnasio', 'casa_mancuernas', 'casa_sin_material']).optional(),
          actividad: z.enum(['sedentario', 'ligera', 'moderada', 'alta']).optional(),
          limitaciones: z.array(z.string()).optional(),
          alergias: z.array(z.string()).optional(),
          preferencias_comida: z.string().optional(),
          alcohol_semanal: num.optional(),
          hora_dormir: z.string().optional(),
          hora_despertar: z.string().optional(),
          onboarding: z.boolean().optional(),
        })
        .parse(entrada);

      const cambios: Record<string, unknown> = { actualizado: new Date().toISOString() };
      for (const [clave, valor] of Object.entries(d)) {
        if (valor !== undefined) cambios[clave] = valor;
      }
      if (typeof cambios.dias_semana === 'number') {
        cambios.dias_semana = Math.max(1, Math.min(7, Math.round(cambios.dias_semana)));
      }

      const { error } = await supabase.from('perfiles').update(cambios).eq('id', userId);
      if (error) throw error;
      Object.assign(ctx.perfil, cambios);

      const campos = Object.keys(d).filter((k) => (d as Record<string, unknown>)[k] !== undefined);
      // En cuanto el perfil tiene lo esencial, el alta se cierra sola: nadie se queda
      // atrapado en el chat porque el modelo olvide marcarla.
      const cerrada = await cerrarAltaSiCompleta(supabase, userId, ctx.perfil);
      return {
        texto: `Perfil actualizado: ${campos.join(', ')}.${cerrada ? ' Alta completada y plan generado: ya puede usar toda la app.' : ''}`,
        accion: { herramienta: nombre, resumen: `perfil · ${campos.join(', ')}${cerrada ? ' · alta completada' : ''}` },
      };
    }

    case 'generar_plan_entreno': {
      const datos = perfilEntreno(ctx.perfil);
      if (!datos) {
        return {
          texto:
            'Faltan datos del perfil para generar el plan (hacen falta sexo, edad, altura, objetivo, nivel, dias y material).',
          accion: null,
        };
      }
      const plan = generarPlan(datos);
      await supabase.from('planes_entreno').update({ activo: false }).eq('user_id', userId).eq('activo', true);
      const { error } = await supabase.from('planes_entreno').insert({
        user_id: userId,
        firma: firmaPerfil(datos),
        datos: plan,
        activo: true,
      });
      if (error) throw error;

      if (!ctx.perfil.onboarding) {
        await supabase.from('perfiles').update({ onboarding: true, actualizado: new Date().toISOString() }).eq('id', userId);
        ctx.perfil.onboarding = true;
      }

      const resumen = plan.dias.map((dia) => `${dia.nombre} (${dia.bloques.length} ejercicios)`).join('; ');
      return {
        texto: `Plan generado con ${plan.dias.length} dias: ${resumen}`,
        accion: { herramienta: nombre, resumen: `plan de ${plan.dias.length} dias generado` },
      };
    }

    case 'consultar_historial': {
      const d = z.object({ dias: num.optional(), areas: z.array(z.string()).optional() }).parse(entrada ?? {});
      const dias = Math.max(1, Math.min(120, Math.round(d.dias ?? 14)));
      const desde = sumarDias(ctx.hoy, -dias + 1);
      const areas = new Set(d.areas?.length ? d.areas : ['nutricion', 'entrenamiento', 'foco', 'bienestar', 'peso', 'habitos']);
      const lineas: string[] = [`Historial de los ultimos ${dias} dias (desde ${desde}):`];

      if (areas.has('nutricion')) {
        const { data } = await supabase
          .from('comidas')
          .select('fecha, kcal, proteina_g, alcohol_ud')
          .eq('user_id', userId)
          .gte('fecha', desde);
        const porDia = new Map<string, { kcal: number; prot: number; alc: number }>();
        (data ?? []).forEach((c) => {
          const acumulado = porDia.get(c.fecha) ?? { kcal: 0, prot: 0, alc: 0 };
          acumulado.kcal += c.kcal ?? 0;
          acumulado.prot += c.proteina_g ?? 0;
          acumulado.alc += Number(c.alcohol_ud ?? 0);
          porDia.set(c.fecha, acumulado);
        });
        const valores = [...porDia.values()];
        const mediaKcal = valores.length ? Math.round(valores.reduce((a, b) => a + b.kcal, 0) / valores.length) : 0;
        const mediaProt = valores.length ? Math.round(valores.reduce((a, b) => a + b.prot, 0) / valores.length) : 0;
        const diasAlcohol = valores.filter((v) => v.alc > 0).length;
        lineas.push(
          `- Nutricion: ${porDia.size} dias registrados, media ${mediaKcal} kcal y ${mediaProt} g de proteina. Alcohol en ${diasAlcohol} dias.`,
        );
      }

      if (areas.has('entrenamiento')) {
        const { data } = await supabase
          .from('entrenamientos')
          .select('fecha, nombre, completado')
          .eq('user_id', userId)
          .gte('fecha', desde)
          .order('fecha', { ascending: false });
        const hechos = (data ?? []).filter((e) => e.completado);
        lineas.push(
          `- Entrenamientos: ${hechos.length} en el periodo${hechos.length ? ` (ultimos: ${hechos.slice(0, 4).map((e) => `${e.fecha} ${e.nombre}`).join(', ')})` : ''}.`,
        );
      }

      if (areas.has('foco')) {
        const { data } = await supabase
          .from('foco')
          .select('categoria, minutos')
          .eq('user_id', userId)
          .gte('fecha', desde);
        const porCategoria = new Map<string, number>();
        (data ?? []).forEach((f) => porCategoria.set(f.categoria, (porCategoria.get(f.categoria) ?? 0) + f.minutos));
        const detalle = [...porCategoria.entries()]
          .map(([categoria, minutos]) => `${categoria.replace('_', ' ')} ${(minutos / 60).toFixed(1)} h`)
          .join(', ');
        lineas.push(`- Foco: ${detalle || 'sin registros'}.`);
      }

      if (areas.has('bienestar')) {
        const { data } = await supabase
          .from('bienestar')
          .select('animo, energia, estres, sueno_horas')
          .eq('user_id', userId)
          .gte('fecha', desde);
        const prom = (clave: 'animo' | 'energia' | 'estres' | 'sueno_horas') => {
          const valores = (data ?? []).map((b) => b[clave]).filter((v): v is number => v !== null);
          return valores.length ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1) : '—';
        };
        lineas.push(
          `- Bienestar: animo ${prom('animo')}/10, energia ${prom('energia')}/10, estres ${prom('estres')}/10, sueno ${prom('sueno_horas')} h.`,
        );
      }

      if (areas.has('peso')) {
        const { data } = await supabase
          .from('metricas_corporales')
          .select('fecha, peso_kg, cintura_cm')
          .eq('user_id', userId)
          .gte('fecha', desde)
          .order('fecha', { ascending: true });
        const pesos = (data ?? []).filter((m) => m.peso_kg);
        if (pesos.length >= 2) {
          const primero = pesos[0];
          const ultimo = pesos[pesos.length - 1];
          lineas.push(
            `- Peso: de ${primero.peso_kg} kg (${primero.fecha}) a ${ultimo.peso_kg} kg (${ultimo.fecha}), ${pesos.length} pesajes.`,
          );
        } else {
          lineas.push(`- Peso: ${pesos.length} pesajes en el periodo.`);
        }
      }

      if (areas.has('habitos')) {
        const { data } = await supabase
          .from('habitos_registro')
          .select('fecha, hecho, habitos(nombre)')
          .eq('user_id', userId)
          .gte('fecha', desde);
        const hechos = (data ?? []).filter((r) => r.hecho).length;
        lineas.push(`- Habitos: ${hechos} marcas en el periodo.`);
      }

      return { texto: lineas.join('\n'), accion: null };
    }

    default:
      return { texto: `Herramienta desconocida: ${nombre}`, accion: null };
  }
}

export { hoyIso };

/**
 * Si el alta no esta marcada pero el perfil ya tiene lo que hace falta para
 * entrenar, la cierra y genera el plan si no hay uno. Devuelve true si la cerro.
 */
export async function cerrarAltaSiCompleta(supabase: SupabaseClient, userId: string, perfil: Perfil): Promise<boolean> {
  if (perfil.onboarding) return false;
  const datos = perfilEntreno(perfil);
  if (!datos) return false;
  const { data: activo } = await supabase.from('planes_entreno').select('id').eq('user_id', userId).eq('activo', true).limit(1);
  if (!activo?.length) {
    await supabase.from('planes_entreno').insert({ user_id: userId, firma: firmaPerfil(datos), datos: generarPlan(datos), activo: true });
  }
  const { error } = await supabase.from('perfiles').update({ onboarding: true, actualizado: new Date().toISOString() }).eq('id', userId);
  if (error) return false;
  perfil.onboarding = true;
  return true;
}
