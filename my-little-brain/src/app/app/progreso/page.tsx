import Link from 'next/link';
import { Barra, Insignia, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import Grafica from '@/components/ui/grafica';
import FuerzaSemanal, { type SerieEjercicio } from '@/components/fuerza-semanal';
import { cargarPanel, cargarSesionesMotor } from '@/lib/datos';
import { fechaCorta, inicioSemana, sumarDias } from '@/lib/fechas';
import { nombreEjercicio } from '@/lib/motor/ejercicios';
import { tipoCardio } from '@/lib/motor/cardio';
import { grasaCorporal } from '@/lib/motor/cuerpo';
import { logros } from '@/lib/motor/logros';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function PaginaProgreso() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);

  // Totales de siempre (el panel solo carga los ultimos 60 dias).
  const [entrenos, comidas, pesajes, revisiones, series] = await Promise.all([
    supabase.from('entrenamientos').select('id', { count: 'exact', head: true }).eq('user_id', usuario.id).eq('completado', true),
    supabase.from('comidas').select('id', { count: 'exact', head: true }).eq('user_id', usuario.id),
    supabase.from('metricas_corporales').select('id', { count: 'exact', head: true }).eq('user_id', usuario.id),
    supabase.from('revisiones').select('id', { count: 'exact', head: true }).eq('user_id', usuario.id),
    supabase.from('series').select('peso_kg, reps').eq('user_id', usuario.id).limit(5000),
  ]);

  const tonelaje = (series.data ?? []).reduce(
    (total, s) => total + Number(s.peso_kg ?? 0) * (s.reps ?? 0),
    0,
  );

  // Mejor peso por ejercicio y semana (ultimos 6 meses).
  const sesiones = await cargarSesionesMotor(supabase, usuario.id, sumarDias(panel.hoy, -180));
  const porEjercicio = new Map<string, Map<string, number>>();
  const mejores = new Map<string, { pesoKg: number; reps: number; fecha: string }>();
  for (const sesion of sesiones) {
    const semana = inicioSemana(sesion.fecha);
    for (const ej of sesion.ejercicios) {
      for (const serie of ej.series) {
        if (!serie.hecha || !serie.pesoKg || !serie.reps) continue;
        const semanas = porEjercicio.get(ej.ejercicioId) ?? new Map<string, number>();
        semanas.set(semana, Math.max(semanas.get(semana) ?? 0, serie.pesoKg));
        porEjercicio.set(ej.ejercicioId, semanas);
        const mejor = mejores.get(ej.ejercicioId);
        if (!mejor || serie.pesoKg > mejor.pesoKg || (serie.pesoKg === mejor.pesoKg && serie.reps > mejor.reps)) {
          mejores.set(ej.ejercicioId, { pesoKg: serie.pesoKg, reps: serie.reps, fecha: sesion.fecha });
        }
      }
    }
  }
  const fuerza: SerieEjercicio[] = [...porEjercicio.entries()]
    .map(([ejercicioId, semanas]) => ({
      ejercicioId,
      nombre: nombreEjercicio(ejercicioId),
      porSemana: [...semanas.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([fecha, valor]) => ({ fecha, valor })),
      mejor: mejores.get(ejercicioId) ?? null,
    }))
    .sort((a, b) => b.porSemana.length - a.porSemana.length || a.nombre.localeCompare(b.nombre));

  const conseguidos = logros({
    dias: panel.dias,
    racha: panel.racha,
    entrenosTotales: entrenos.count ?? 0,
    comidasTotales: comidas.count ?? 0,
    tonelajeTotal: tonelaje,
    revisiones: revisiones.count ?? 0,
    pesajes: pesajes.count ?? 0,
  });

  // Series por semana para constancia y foco.
  const porSemana = new Map<string, { entrenos: number; focoMin: number }>();
  for (const dia of panel.dias) {
    const semana = inicioSemana(dia.fecha);
    const acumulado = porSemana.get(semana) ?? { entrenos: 0, focoMin: 0 };
    if (dia.entreno) acumulado.entrenos += 1;
    acumulado.focoMin += dia.focoMin;
    porSemana.set(semana, acumulado);
  }
  const semanas = [...porSemana.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-8);
  const maxEntrenos = Math.max(...semanas.map(([, s]) => s.entrenos), perfil.dias_semana ?? 3);
  const maxFoco = Math.max(...semanas.map(([, s]) => s.focoMin), 60);

  const seriePeso = panel.metricas.filter((m) => m.peso_kg).map((m) => ({ fecha: m.fecha, valor: m.peso_kg as number }));
  const serieGrasa = perfil.sexo && perfil.altura_cm
    ? panel.metricas
        .map((m) => ({ fecha: m.fecha, valor: grasaCorporal(perfil.sexo!, perfil.altura_cm!, m) }))
        .filter((p): p is { fecha: string; valor: number } => p.valor !== null)
    : [];
  const serieSueno = panel.dias
    .filter((d) => d.suenoHoras !== null)
    .map((d) => ({ fecha: d.fecha, valor: d.suenoHoras as number }));
  const serieAnimo = panel.dias
    .filter((d) => d.animo !== null)
    .map((d) => ({ fecha: d.fecha, valor: d.animo as number }));

  return (
    <main className="space-y-4">
      <h1>Progreso</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['Entrenos', entrenos.count ?? 0],
          ['Comidas', comidas.count ?? 0],
          ['Tonelaje', `${(tonelaje / 1000).toFixed(1)} t`],
          ['Nivel', panel.progreso.nivel],
        ].map(([etiqueta, valor]) => (
          <Tarjeta key={etiqueta} className="p-3">
            <div className="text-xs text-muted-foreground">{etiqueta}</div>
            <div className="mt-0.5 text-lg font-semibold tabular-nums">{valor}</div>
          </Tarjeta>
        ))}
      </div>

      <Tarjeta>
        <div className="mb-3 flex items-baseline justify-between">
          <TituloTarjeta className="mb-0">Logros</TituloTarjeta>
          <Insignia tono="marca">
            {conseguidos.filter((l) => l.conseguido).length} / {conseguidos.length}
          </Insignia>
        </div>
        <ul className="space-y-3">
          {conseguidos.map((logro) => (
            <li key={logro.id} className={logro.conseguido ? '' : 'opacity-70'}>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg">{logro.emoji}</span>
                <span className="flex-1 font-medium">{logro.nombre}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{logro.meta}</span>
              </div>
              <p className="mb-1.5 ml-8 text-xs text-muted-foreground">{logro.descripcion}</p>
              <div className="ml-8">
                <Barra
                  valor={logro.progreso * 100}
                  color={logro.conseguido ? 'hsl(var(--area-habitos))' : 'hsl(var(--muted-foreground))'}
                />
              </div>
            </li>
          ))}
        </ul>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Peso por ejercicio, semana a semana</TituloTarjeta>
        <FuerzaSemanal ejercicios={fuerza} />
      </Tarjeta>

      {panel.entrenamientos.some((e) => e.completado) && (
        <Tarjeta>
          <TituloTarjeta>Ultimos entrenos</TituloTarjeta>
          <ul className="divide-y divide-border text-sm">
            {panel.entrenamientos
              .filter((e) => e.completado)
              .slice(0, 10)
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2">
                  <span>
                    {e.nombre}
                    {e.cardio_min ? (
                      <span className="text-muted-foreground">
                        {' '}· {tipoCardio(e.cardio_tipo ?? '')?.nombre ?? 'cardio'} {e.cardio_min} min (~{e.cardio_kcal} kcal)
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">{fechaCorta(e.fecha)}</span>
                </li>
              ))}
          </ul>
        </Tarjeta>
      )}

      {semanas.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Constancia por semana</TituloTarjeta>
          <ul className="space-y-2">
            {semanas.map(([semana, datos]) => (
              <li key={semana} className="flex items-center gap-3 text-sm">
                <span className="w-12 shrink-0 text-xs text-muted-foreground">{fechaCorta(semana)}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-[hsl(var(--area-fitness))]"
                    style={{ width: `${(datos.entrenos / maxEntrenos) * 100}%` }}
                  />
                </span>
                <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                  {datos.entrenos} entrenos
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">Objetivo: {perfil.dias_semana ?? 3} por semana.</p>
        </Tarjeta>
      )}

      {semanas.some(([, s]) => s.focoMin > 0) && (
        <Tarjeta>
          <TituloTarjeta>Horas de foco por semana</TituloTarjeta>
          <ul className="space-y-2">
            {semanas.map(([semana, datos]) => (
              <li key={semana} className="flex items-center gap-3 text-sm">
                <span className="w-12 shrink-0 text-xs text-muted-foreground">{fechaCorta(semana)}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-[hsl(var(--area-foco))]"
                    style={{ width: `${(datos.focoMin / maxFoco) * 100}%` }}
                  />
                </span>
                <span className="w-16 text-right text-xs tabular-nums text-muted-foreground">
                  {(datos.focoMin / 60).toFixed(1)} h
                </span>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      {seriePeso.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Peso</TituloTarjeta>
          <Grafica datos={seriePeso} unidad=" kg" color="hsl(var(--area-cuerpo))" />
        </Tarjeta>
      )}
      {serieGrasa.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Grasa corporal estimada</TituloTarjeta>
          <Grafica datos={serieGrasa} unidad=" %" color="hsl(var(--area-mente))" />
        </Tarjeta>
      )}
      {serieSueno.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Sueno</TituloTarjeta>
          <Grafica datos={serieSueno} unidad=" h" color="hsl(var(--area-foco))" />
        </Tarjeta>
      )}
      {serieAnimo.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Animo</TituloTarjeta>
          <Grafica datos={serieAnimo} unidad="/10" decimales={0} color="hsl(var(--area-habitos))" />
        </Tarjeta>
      )}

      <p className="pb-2 text-center text-xs text-muted-foreground">
        ¿Quieres la lectura de todo esto? <Link href="/app/semana" className="text-primary underline">Genera tu revision semanal</Link>.
      </p>
    </main>
  );
}
