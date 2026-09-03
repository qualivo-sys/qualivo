import Link from 'next/link';
import VistaRevision from '@/components/revision-semanal';
import { Anillo } from '@/components/ui/anillo';
import { Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel } from '@/lib/datos';
import { fechaCorta, inicioSemana, sumarDias } from '@/lib/fechas';
import { estadisticasSemana } from '@/lib/ia/revision';
import { sesionRequerida } from '@/lib/sesion';
import type { RevisionSemanal } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function PaginaSemana() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);

  // Las puntuaciones y los numeros son de la semana en curso (de lunes a hoy).
  // La revision es de la ultima semana cerrada: la pasada hasta que llega el domingo.
  const semanaActual = inicioSemana(panel.hoy);
  const esDomingo = new Date(panel.hoy + 'T12:00:00').getDay() === 0;
  const semana = esDomingo ? semanaActual : inicioSemana(sumarDias(semanaActual, -1));
  const stats = estadisticasSemana(panel, semanaActual);
  const statsCerrada = estadisticasSemana(panel, semana);
  const diasTranscurridos = panel.semana.length;

  const { data } = await supabase
    .from('revisiones')
    .select('contenido')
    .eq('user_id', usuario.id)
    .eq('semana_inicio', semana)
    .maybeSingle();

  const revision = (data?.contenido as RevisionSemanal | undefined) ?? null;

  return (
    <main className="space-y-4">
      <div>
        <h1>Tu semana</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Semana en curso: del {fechaCorta(stats.desde)} al {fechaCorta(stats.hasta)} · llevas {diasTranscurridos} de 7 dias
        </p>
      </div>

      <Tarjeta>
        <TituloTarjeta>Puntuaciones</TituloTarjeta>
        <div className="desplazable-x">
          <div className="flex min-w-max gap-4 pb-1">
            <Anillo valor={panel.puntuaciones.nutricion} etiqueta="Nutricion" color="hsl(var(--area-cuerpo))" />
            <Anillo valor={panel.puntuaciones.entrenamiento} etiqueta="Entreno" color="hsl(var(--area-fitness))" />
            <Anillo valor={panel.puntuaciones.foco} etiqueta="Foco" color="hsl(var(--area-foco))" />
            <Anillo valor={panel.puntuaciones.mente} etiqueta="Mente" color="hsl(var(--area-mente))" />
            <Anillo valor={panel.puntuaciones.habitos} etiqueta="Habitos" color="hsl(var(--area-habitos))" />
          </div>
        </div>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Los numeros</TituloTarjeta>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          {[
            ['Entrenos', `${stats.entrenos} / ${stats.entrenosObjetivo}`],
            ['Media kcal', stats.kcalMedia ? `${stats.kcalMedia}` : '—'],
            ['Media proteina', stats.proteinaMedia ? `${stats.proteinaMedia} g` : '—'],
            ['Foco', `${stats.focoHoras} h`],
            ['Alcohol', `${stats.alcoholTotal} ud · ${stats.diasConAlcohol} dias`],
            ['Sueno medio', stats.suenoMedio ? `${stats.suenoMedio.toFixed(1)} h` : '—'],
            ['Animo medio', stats.animoMedio ? `${stats.animoMedio.toFixed(1)}/10` : '—'],
            ['Habitos', stats.habitosPct === null ? '—' : `${stats.habitosPct}%`],
            [
              'Peso',
              stats.cambioPeso === null
                ? '—'
                : `${stats.cambioPeso > 0 ? '+' : ''}${stats.cambioPeso} kg`,
            ],
          ].map(([etiqueta, valor]) => (
            <div key={etiqueta} className="rounded-lg bg-muted/40 p-3">
              <dt className="text-xs text-muted-foreground">{etiqueta}</dt>
              <dd className="mt-0.5 font-semibold tabular-nums">{valor}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-muted-foreground">
          Hasta hoy. Dias con comidas registradas: {stats.diasConRegistro} de {diasTranscurridos}. Cuanto mas
          registras, mas fina es la lectura.
        </p>
      </Tarjeta>

      <div className="pt-2">
        <h2>Revision de la semana pasada</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Del {fechaCorta(statsCerrada.desde)} al {fechaCorta(statsCerrada.hasta)} ·{' '}
          {statsCerrada.entrenos} entrenos · {statsCerrada.kcalMedia ? `${statsCerrada.kcalMedia} kcal de media` : 'sin comidas'} ·{' '}
          {statsCerrada.suenoMedio ? `${statsCerrada.suenoMedio.toFixed(1)} h de sueno` : 'sin sueno'}
        </p>
      </div>

      <VistaRevision inicial={revision} semana={semana} />

      <p className="text-center text-xs text-muted-foreground">
        ¿Te falta contexto? <Link href="/app/coach" className="text-primary underline">Cuentaselo al coach</Link> y
        vuelve a generarla.
      </p>
    </main>
  );
}
