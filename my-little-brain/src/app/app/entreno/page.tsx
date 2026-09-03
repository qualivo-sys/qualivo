import Link from 'next/link';
import { regenerarPlan } from '@/app/app/acciones';
import RegistroEntreno, { type BloqueVista, type OpcionCatalogo } from '@/components/registro-entreno';
import { Boton, Insignia, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel, cargarSesionesMotor } from '@/lib/datos';
import { sumarDias } from '@/lib/fechas';
import { EJERCICIOS, ejercicio } from '@/lib/motor/ejercicios';
import { esIsometrico, planDesactualizado, volumenSemanal } from '@/lib/motor/planificador';
import { proximoDia, sugerencia } from '@/lib/motor/progresion';
import { perfilEntreno } from '@/lib/perfil';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function PaginaEntreno({
  searchParams,
}: {
  searchParams: { dia?: string; nueva?: string };
}) {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);

  if (!panel.plan) {
    return (
      <main className="space-y-4">
        <h1>Entreno</h1>
        <Tarjeta>
          <p className="mb-3 text-sm text-muted-foreground">
            Aun no tienes plan. Lo genero con tu objetivo, nivel, dias disponibles, material y
            molestias.
          </p>
          <form action={regenerarPlan}>
            <Boton type="submit" className="w-full">Generar mi plan</Boton>
          </form>
        </Tarjeta>
      </main>
    );
  }

  const sesiones = await cargarSesionesMotor(supabase, usuario.id, sumarDias(panel.hoy, -120));
  const diaSeleccionado =
    panel.plan.dias.find((d) => d.id === searchParams.dia) ??
    panel.plan.dias.find((d) => d.id === proximoDia(panel.plan!, sesiones)) ??
    panel.plan.dias[0];

  const bloques: BloqueVista[] = diaSeleccionado.bloques.map((bloque) => {
    const info = ejercicio(bloque.ejercicioId);
    const consejo = sugerencia(bloque, sesiones);
    return {
      ...bloque,
      nombre: info?.nombre ?? bloque.nombreLibre ?? bloque.ejercicioId,
      tecnica: info?.tecnica ?? '',
      sugerencia: consejo.texto,
      pesoSugerido: consejo.pesoKg,
      esIsometrico: esIsometrico(bloque.ejercicioId),
    };
  });

  // Si hoy ya has terminado este dia, ensenamos lo registrado (salvo que pidas otra sesion).
  const hechaHoy = panel.entrenamientos.find(
    (e) => e.completado && e.fecha === panel.hoy && e.dia_plan === diaSeleccionado.id,
  );
  const sesionHoy = hechaHoy && !searchParams.nueva ? sesiones.find((s) => s.id === hechaHoy.id) ?? null : null;

  // Catalogo para anadir ejercicios a la sesion, con la sugerencia de carga de cada uno.
  const GRUPOS: Record<string, string> = {
    empuje_horizontal: 'Pecho', empuje_vertical: 'Hombro (empuje)', traccion_horizontal: 'Espalda (remo)',
    traccion_vertical: 'Espalda (dominadas y jalones)', dominante_rodilla: 'Pierna (cuadriceps)',
    dominante_cadera: 'Pierna (isquios y gluteo)', gluteo: 'Gluteo', gemelo: 'Gemelo', core: 'Core',
    hombro: 'Hombro (aislamiento)', biceps: 'Biceps', triceps: 'Triceps',
  };
  const catalogo: OpcionCatalogo[] = EJERCICIOS.map((e) => {
    const consejo = sugerencia({ ejercicioId: e.id, rol: 'accesorio', series: 3, repMin: 8, repMax: 12, rir: 2, descansoSeg: 90 }, sesiones);
    return { id: e.id, nombre: e.nombre, grupo: GRUPOS[e.patron] ?? e.patron, tecnica: e.tecnica, pesoSugerido: consejo.pesoKg, sugerencia: consejo.texto };
  });

  const datosPerfil = perfilEntreno(perfil);
  const desactualizado = datosPerfil ? planDesactualizado(panel.plan, datosPerfil) : false;
  const volumen = volumenSemanal(panel.plan);
  const maxVolumen = Math.max(...volumen.map((v) => v.series), 1);

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between">
        <h1>Entreno</h1>
        <Insignia>{panel.plan.dias.length} dias/semana</Insignia>
      </div>

      {desactualizado && (
        <Tarjeta className="border-amber-500/40">
          <p className="mb-2 text-sm">
            Has cambiado datos del perfil que afectan a la rutina. ¿Regenero el plan?
          </p>
          <form action={regenerarPlan}>
            <Boton type="submit" variante="secundario" tamano="sm">Regenerar plan</Boton>
          </form>
        </Tarjeta>
      )}

      <div className="desplazable-x">
        <div className="flex min-w-max gap-2 pb-1">
          {panel.plan.dias.map((dia) => (
            <Link key={dia.id} href={`/app/entreno?dia=${dia.id}`} scroll={false}>
              <span
                className={`inline-block rounded-full border px-3 py-1.5 text-xs ${
                  dia.id === diaSeleccionado.id
                    ? 'border-transparent bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {dia.nombre.replace('Dia ', 'D')}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2>{diaSeleccionado.nombre}</h2>
        <p className="text-sm text-muted-foreground">{diaSeleccionado.foco}</p>
      </div>

      {sesionHoy ? (
        <Tarjeta className="border-emerald-500/40">
          <div className="mb-3 flex items-center justify-between">
            <TituloTarjeta className="mb-0">Hoy ya lo has hecho</TituloTarjeta>
            <Insignia tono="exito">guardado</Insignia>
          </div>
          <ul className="space-y-3 text-sm">
            {sesionHoy.ejercicios.map((ej) => (
              <li key={ej.ejercicioId}>
                <div className="font-medium">
                  {ejercicio(ej.ejercicioId)?.nombre ?? ej.ejercicioId.replace(/^libre_/, '').replace(/_/g, ' ')}
                </div>
                <div className="text-muted-foreground">
                  {ej.series
                    .filter((serie) => serie.hecha)
                    .map((serie) => `${serie.pesoKg ?? '—'} × ${serie.reps ?? '—'}`)
                    .join('  ·  ') || 'sin series con datos'}
                </div>
              </li>
            ))}
          </ul>
          {hechaHoy?.cardio_min ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Cardio: {hechaHoy.cardio_min} min (~{hechaHoy.cardio_kcal} kcal).
            </p>
          ) : null}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Link href={`/app/entreno?dia=${diaSeleccionado.id}&nueva=1`} className="block">
              <Boton variante="contorno" className="w-full">Registrar otra sesion</Boton>
            </Link>
            <Link href={`/app/entreno?dia=${diaSeleccionado.id}&nueva=1#anadir`} className="block">
              <Boton variante="contorno" className="w-full">Anadir ejercicios al plan</Boton>
            </Link>
          </div>
        </Tarjeta>
      ) : (
        /* key: al cambiar de dia el registro se reinicia y no arrastra los pesos del anterior. */
        <RegistroEntreno
          key={diaSeleccionado.id}
          diaId={diaSeleccionado.id}
          nombre={diaSeleccionado.nombre}
          bloques={bloques}
          pesoKg={Math.round(panel.cuerpo.peso ?? 75)}
          claveBorrador={`${usuario.id}:${diaSeleccionado.id}:${panel.hoy}`}
          catalogo={catalogo}
        />
      )}

      {diaSeleccionado.cardio && (
        <Tarjeta>
          <TituloTarjeta>Cardio</TituloTarjeta>
          <p className="text-sm text-muted-foreground">{diaSeleccionado.cardio}</p>
        </Tarjeta>
      )}

      <Tarjeta>
        <TituloTarjeta>Volumen semanal por musculo</TituloTarjeta>
        <ul className="space-y-1.5">
          {volumen.map((v) => (
            <li key={v.musculo} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 capitalize text-muted-foreground">{v.musculo}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-[hsl(var(--area-fitness))]"
                  style={{ width: `${(v.series / maxVolumen) * 100}%` }}
                />
              </span>
              <span className="w-6 text-right tabular-nums">{v.series}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Entre 10 y 20 series semanales por grupo muscular es donde casi todo el mundo progresa.
        </p>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Como funciona el plan</TituloTarjeta>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {panel.plan.notas.map((nota) => (
            <li key={nota}>· {nota}</li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <form action={regenerarPlan}>
            <Boton type="submit" variante="contorno" className="w-full">
              {panel.plan.firma === 'importado' ? 'Que la app me haga el plan' : 'Regenerar plan desde cero'}
            </Boton>
          </form>
          <Link href="/app/importar" className="block">
            <Boton type="button" variante="contorno" className="w-full">Importar plan de un especialista</Boton>
          </Link>
        </div>
      </Tarjeta>
    </main>
  );
}
