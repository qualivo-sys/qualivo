import { NextResponse } from 'next/server';
import { cargarPanel, cargarPerfil } from '@/lib/datos';
import { inicioSemana, sumarDias } from '@/lib/fechas';
import { BETA_FALLBACK, MODELO, clienteIA, hayClaveIA, textoDe } from '@/lib/ia/cliente';
import { anotarUso, cuota } from '@/lib/ia/limites';
import { estadisticasSemana, parsearRevision, promptRevision } from '@/lib/ia/revision';
import { clienteServidor } from '@/lib/supabase/servidor';

export const runtime = 'nodejs';
export const maxDuration = 120;
export const dynamic = 'force-dynamic';

const SISTEMA = `Eres el jefe de operaciones de la vida del usuario y escribes su revision semanal. Espanol de Espana, directo, honesto y accionable. Trabajas solo con los numeros que te dan: no inventas datos ni rellenas huecos. Cuando algo no esta medido, lo dices y propones como medirlo.`;

export async function POST(peticion: Request) {
  const supabase = clienteServidor();
  const { data: sesion } = await supabase.auth.getUser();
  const usuario = sesion.user;
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  if (!hayClaveIA()) {
    return NextResponse.json({ error: 'Falta configurar ANTHROPIC_API_KEY.' }, { status: 503 });
  }

  const perfil = await cargarPerfil(supabase, usuario.id);
  if (!perfil) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });

  const estado = await cuota(supabase, usuario.id, perfil.plan);
  if (estado.agotada) {
    return NextResponse.json({ error: 'Has agotado los mensajes de tu plan este mes.' }, { status: 429 });
  }

  let semana: string | undefined;
  try {
    const cuerpo = (await peticion.json()) as { semana?: string };
    semana = cuerpo.semana;
  } catch {
    semana = undefined;
  }

  const panel = await cargarPanel(supabase, usuario.id, perfil);
  const lunes = inicioSemana(semana ?? sumarDias(panel.hoy, -7));
  const stats = estadisticasSemana(panel, lunes);

  try {
    const respuesta = await clienteIA().beta.messages.create({
      model: MODELO,
      max_tokens: 4096,
      betas: [BETA_FALLBACK],
      fallbacks: 'default',
      output_config: { effort: 'high' },
      system: [{ type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: promptRevision(panel, stats) }],
    });

    if (respuesta.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'No he podido generar la revision de esta semana.' }, { status: 422 });
    }

    const revision = parsearRevision(textoDe(respuesta));
    if (!revision) {
      return NextResponse.json({ error: 'La revision llego en un formato inesperado. Reintenta.' }, { status: 502 });
    }

    const contenido = { ...revision, estadisticas: { ...stats, dias: undefined } };
    await supabase
      .from('revisiones')
      .upsert(
        { user_id: usuario.id, semana_inicio: lunes, contenido, generado_el: new Date().toISOString() },
        { onConflict: 'user_id,semana_inicio' },
      );
    await supabase
      .from('xp_eventos')
      .insert({ user_id: usuario.id, fecha: panel.hoy, tipo: 'revision', xp: 25, motivo: `revision ${lunes}` });
    await anotarUso(supabase, usuario.id, {
      entrada: respuesta.usage.input_tokens ?? 0,
      salida: respuesta.usage.output_tokens ?? 0,
    });

    return NextResponse.json({ semana: lunes, revision, estadisticas: contenido.estadisticas });
  } catch (error) {
    console.error('[revision] error generando la revision', error);
    return NextResponse.json({ error: 'No se ha podido generar la revision.' }, { status: 502 });
  }
}
