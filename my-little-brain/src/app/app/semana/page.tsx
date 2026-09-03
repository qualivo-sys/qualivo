import Link from 'next/link';
import VistaRevision from '@/components/revision-semanal';
import { Anillo } from '@/components/ui/anillo';
import { Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { borrarActividad, registrarActividad } from '@/app/app/acciones';
import { TIPOS_CARDIO } from '@/lib/motor/cardio';
import { esActividad } from '@/lib/motor/energia';
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

  // Calendario de la semana: los 7 dias de lunes a domingo con lo hecho en cada uno.
  const diasCalendario = Array.from({ length: 7 }, (_, i) => sumarDias(semanaActual, i)).map((fecha) => {
    const dia = panel.dias.find((d) => d.fecha === fecha);
    const del = panel.entrenamientos.filter((e) => e.fecha === fecha && e.completado);
    return {
      fecha,
      futuro: fecha > panel.hoy,
      esHoy: fecha === panel.hoy,
      dia,
      entrenos: del.filter((e) => !esActividad(e)),
      actividades: del.filter(esActividad),
    };
  });
  const totales = diasCalendario.reduce(
    (t, d) => ({
      entrenos: t.entrenos + d.entrenos.length,
      actividades: t.actividades + d.actividades.length,
      comido: t.comido + (d.dia?.kcal ?? 0),
      gastado: t.gastado + (d.dia && !d.futuro ? d.dia.gastoKcal : 0),
      pasos: t.pasos + (d.dia?.pasos ?? 0),
      redondos: t.redondos + (d.dia?.redondo ? 1 : 0),
    }),
    { entrenos: 0, actividades: 0, comido: 0, gastado: 0, pasos: 0, redondos: 0 },
  );
  const LETRAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

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
        <TituloTarjeta>Calendario de la semana</TituloTarjeta>
        <div className="desplazable-x">
          <div className="grid min-w-[640px] grid-cols-7 gap-1.5">
            {diasCalendario.map((d, i) => (
              <div
                key={d.fecha}
                className={`rounded-lg border p-2 text-xs ${d.esHoy ? 'border-primary bg-primary/10' : 'border-border bg-muted/30'} ${d.futuro ? 'opacity-50' : ''}`}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold">{LETRAS[i]} {d.fecha.slice(8)}</span>
                  {d.dia?.redondo && <span title="Dia redondo">⭐</span>}
                </div>
                <div className="mt-1.5 min-h-[2.5rem] space-y-0.5">
                  {d.entrenos.map((e) => (
                    <div key={e.id} className="truncate rounded bg-[hsl(var(--area-fitness))]/15 px-1 py-0.5" title={e.nombre}>🏋️ {e.nombre.replace(/^Dia \d+ · /, '')}</div>
                  ))}
                  {d.actividades.map((e) => (
                    <div key={e.id} className="flex items-center justify-between gap-1 rounded bg-[hsl(var(--area-habitos))]/15 px-1 py-0.5" title={e.nombre}>
                      <span className="truncate">🥾 {e.nombre}{e.cardio_min ? ` ${e.cardio_min}'` : ''}</span>
                      <form action={borrarActividad.bind(null, e.id)}>
                        <button type="submit" aria-label="Borrar actividad" className="text-muted-foreground hover:text-destructive">×</button>
                      </form>
                    </div>
                  ))}
                  {!d.futuro && !d.entrenos.length && !d.actividades.length && <div className="text-muted-foreground">descanso</div>}
                </div>
                {!d.futuro && d.dia && (
                  <dl className="mt-1.5 space-y-0.5 text-[11px] text-muted-foreground tabular-nums">
                    <div className="flex justify-between gap-1"><dt>com.</dt><dd className="text-foreground">{d.dia.comidas ? d.dia.kcal : '—'}</dd></div>
                    <div className="flex justify-between gap-1"><dt>gast.</dt><dd className="text-foreground">{d.dia.gastoKcal ? `~${d.dia.gastoKcal}` : '—'}</dd></div>
                    <div className="flex justify-between gap-1"><dt>pasos</dt><dd className="text-foreground">{d.dia.pasos ? (d.dia.pasos / 1000).toFixed(1) + 'k' : '—'}</dd></div>
                  </dl>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-sm tabular-nums">
          <strong>{totales.entrenos}</strong> entrenos · <strong>{totales.actividades}</strong> actividades ·{' '}
          <strong>{totales.redondos}</strong> dias redondos · comido <strong>{totales.comido.toLocaleString('es-ES')}</strong> kcal ·{' '}
          gastado <strong>~{totales.gastado.toLocaleString('es-ES')}</strong> kcal
          {totales.pasos ? <> · <strong>{totales.pasos.toLocaleString('es-ES')}</strong> pasos</> : null}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Balance de la semana: {totales.comido - totales.gastado > 0 ? '+' : ''}{(totales.comido - totales.gastado).toLocaleString('es-ES')} kcal
          {totales.comido ? '' : ' (apunta las comidas para que tenga sentido)'}. Los pasos salen del check-in de la noche.
        </p>

        <details id="actividad" className="mt-4 border-t border-border pt-3">
          <summary className="cursor-pointer text-sm font-medium">Anadir una actividad fuera del plan</summary>
          <form action={registrarActividad} className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Campo etiqueta="Dia" name="fecha" type="date" defaultValue={panel.hoy} max={panel.hoy} required />
              <Campo etiqueta="Minutos" name="minutos" type="number" inputMode="numeric" min={1} defaultValue={60} required />
            </div>
            <Selector etiqueta="Que has hecho" name="tipo" defaultValue="senderismo">
              {TIPOS_CARDIO.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
              <option value="otro">Otro deporte (padel, futbol, yoga…)</option>
            </Selector>
            <Campo etiqueta="Nombre (opcional)" name="nombre" placeholder="Ruta por la montaña, padel con Isa…" />
            <Boton type="submit" variante="secundario" className="w-full">Guardar actividad</Boton>
            <p className="text-xs text-muted-foreground">
              Calcula las calorias con tu peso y los minutos, suma 25 XP y cuenta para la racha y el dia redondo.
            </p>
          </form>
        </details>
      </Tarjeta>

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
