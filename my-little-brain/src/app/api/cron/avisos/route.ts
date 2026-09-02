import { NextResponse } from 'next/server';
import { cargarPanel } from '@/lib/datos';
import { hoy as hoyIso, inicioSemana, sumarDias } from '@/lib/fechas';
import { decidirAvisos, enviarAviso, hayPush, textoAviso, type TipoAviso } from '@/lib/push';
import { clienteAdmin, hayServiceRole } from '@/lib/supabase/admin';
import type { Perfil } from '@/lib/tipos';

export const runtime = 'nodejs';
export const maxDuration = 120;
export const dynamic = 'force-dynamic';

/**
 * Se llama cada hora (GitHub Actions, porque Vercel Hobby solo permite crons
 * diarios). Para cada usuario con navegadores suscritos calcula su hora local,
 * mira que le falta hoy y le manda el aviso que toque, una vez por dia y tipo.
 */
export async function GET(peticion: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || peticion.headers.get('authorization') !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  if (!hayServiceRole() || !hayPush()) {
    return NextResponse.json({ error: 'Faltan SUPABASE_SERVICE_ROLE_KEY o las claves VAPID' }, { status: 503 });
  }

  const supabase = clienteAdmin();
  const { data: subs } = await supabase
    .from('push_suscripciones')
    .select('id, user_id, endpoint, p256dh, auth');
  if (!subs?.length) return NextResponse.json({ usuarios: 0, enviados: 0 });

  const porUsuario = new Map<string, typeof subs>();
  for (const s of subs) porUsuario.set(s.user_id, [...(porUsuario.get(s.user_id) ?? []), s]);

  const { data: perfiles } = await supabase
    .from('perfiles')
    .select('*')
    .in('id', [...porUsuario.keys()])
    .eq('onboarding', true);

  let enviados = 0;
  const ahora = new Date();

  for (const perfil of (perfiles ?? []) as Perfil[]) {
    try {
      const zona = perfil.zona_horaria || 'Europe/Madrid';
      const partes = new Intl.DateTimeFormat('en-GB', {
        timeZone: zona, hour: 'numeric', weekday: 'short', hourCycle: 'h23',
      }).formatToParts(ahora);
      const hora = Number(partes.find((p) => p.type === 'hour')?.value ?? '0');
      const nombreDia = partes.find((p) => p.type === 'weekday')?.value ?? 'Mon';
      const diaSemana = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(nombreDia);
      const hoy = hoyIso(zona);

      const [{ data: enviadosHoy }, { data: bienestar }, { data: revision }] = await Promise.all([
        supabase.from('push_envios').select('tipo').eq('user_id', perfil.id).eq('fecha', hoy),
        supabase.from('bienestar').select('sueno_horas, animo').eq('user_id', perfil.id).eq('fecha', hoy).maybeSingle(),
        supabase
          .from('revisiones')
          .select('generado_el')
          .eq('user_id', perfil.id)
          .eq('semana_inicio', inicioSemana(sumarDias(hoy, -1)))
          .maybeSingle(),
      ]);

      const panel = await cargarPanel(supabase, perfil.id, perfil);
      const entrenosSemana = panel.semana.filter((d) => d.entreno).length;

      const tipos = decidirAvisos(perfil.preferencias ?? {}, {
        hora,
        diaSemana,
        tieneCheckInManana: Boolean(bienestar?.sueno_horas || bienestar?.animo),
        tieneComidasHoy: panel.diaHoy.comidas > 0,
        entrenoHoy: panel.diaHoy.entreno,
        entrenoPendienteSemana: entrenosSemana < (perfil.dias_semana ?? 3),
        revisionNueva: Boolean(revision && Date.now() - new Date(revision.generado_el).getTime() < 36 * 3600 * 1000),
        enviadosHoy: (enviadosHoy ?? []).map((e) => e.tipo as TipoAviso),
      });

      for (const tipo of tipos) {
        const aviso = textoAviso(tipo, perfil.nombre ?? '', {
          racha: panel.racha,
          kcal: panel.diaHoy.kcal,
          metaKcal: panel.metas?.kcal ?? null,
        });
        const resultado = await enviarAviso(supabase, porUsuario.get(perfil.id) ?? [], aviso);
        if (resultado.enviados) {
          enviados += resultado.enviados;
          await supabase.from('push_envios').upsert(
            { user_id: perfil.id, fecha: hoy, tipo },
            { onConflict: 'user_id,fecha,tipo' },
          );
        }
      }
    } catch (error) {
      console.error('[avisos] fallo con el usuario', perfil.id, error);
    }
  }

  return NextResponse.json({ usuarios: porUsuario.size, enviados });
}
