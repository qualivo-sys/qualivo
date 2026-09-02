import { NextResponse } from 'next/server';
import { cargarPanel } from '@/lib/datos';
import { hoy as hoyIso, inicioSemana, sumarDias } from '@/lib/fechas';
import { MODELO_REVISION, clienteIA, hayClaveIA, parametrosModelo, textoDe } from '@/lib/ia/cliente';
import { estadisticasSemana, parsearRevision, promptRevision } from '@/lib/ia/revision';
import { clienteAdmin, hayServiceRole } from '@/lib/supabase/admin';
import type { Perfil } from '@/lib/tipos';

export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

const SISTEMA = `Eres el jefe de operaciones de la vida del usuario y escribes su revision semanal. Espanol de Espana, directo, honesto y accionable. Trabajas solo con los numeros que te dan: no inventas datos. Cuando algo no esta medido, lo dices y propones como medirlo.`;

/** Cuantos usuarios se procesan como mucho en cada ejecucion. */
const MAXIMO_POR_TANDA = 25;

/**
 * Tarea de los domingos: deja la revision de la semana generada y esperando.
 * La programa Vercel (ver vercel.json) y se protege con CRON_SECRET.
 */
export async function GET(peticion: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || peticion.headers.get('authorization') !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  if (!hayServiceRole() || !hayClaveIA()) {
    return NextResponse.json({ error: 'Faltan SUPABASE_SERVICE_ROLE_KEY o ANTHROPIC_API_KEY' }, { status: 503 });
  }

  const supabase = clienteAdmin();
  const semana = inicioSemana(sumarDias(hoyIso(), -1)); // la semana que acaba de cerrarse

  const { data: perfiles } = await supabase
    .from('perfiles')
    .select('*')
    .in('plan', ['pro', 'founder'])
    .eq('onboarding', true)
    .limit(MAXIMO_POR_TANDA);

  const cliente = clienteIA();
  let generadas = 0;
  let saltadas = 0;

  for (const perfil of (perfiles ?? []) as Perfil[]) {
    try {
      const { data: existente } = await supabase
        .from('revisiones')
        .select('id')
        .eq('user_id', perfil.id)
        .eq('semana_inicio', semana)
        .maybeSingle();
      if (existente) {
        saltadas += 1;
        continue;
      }

      const panel = await cargarPanel(supabase, perfil.id, perfil);
      const stats = estadisticasSemana(panel, semana);

      // Sin datos suficientes no merece la pena gastar una llamada.
      if (stats.diasConRegistro === 0 && stats.entrenos === 0 && stats.focoHoras === 0) {
        saltadas += 1;
        continue;
      }

      const respuesta = await cliente.beta.messages.create({
        model: MODELO_REVISION,
        max_tokens: 4096,
        ...parametrosModelo(MODELO_REVISION, 'high'),
        system: [{ type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: promptRevision(panel, stats) }],
      });

      if (respuesta.stop_reason === 'refusal') {
        saltadas += 1;
        continue;
      }

      const revision = parsearRevision(textoDe(respuesta));
      if (!revision) {
        saltadas += 1;
        continue;
      }

      await supabase.from('revisiones').upsert(
        {
          user_id: perfil.id,
          semana_inicio: semana,
          contenido: { ...revision, estadisticas: { ...stats, dias: undefined } },
          generado_el: new Date().toISOString(),
        },
        { onConflict: 'user_id,semana_inicio' },
      );
      generadas += 1;
    } catch (error) {
      console.error('[cron] fallo la revision de', perfil.id, error);
      saltadas += 1;
    }
  }

  return NextResponse.json({ semana, generadas, saltadas });
}
