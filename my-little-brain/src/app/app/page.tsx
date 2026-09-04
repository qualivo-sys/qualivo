import { AlertTriangle, ArrowRight, CheckCircle2, Dumbbell, Flame, Info, MessageCircle, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import ComidasHabituales from '@/components/comidas-habituales';
import HabitosHoy from '@/components/habitos-hoy';
import { Anillo } from '@/components/ui/anillo';
import { Barra, Boton, Insignia, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import Grafica from '@/components/ui/grafica';
import { cargarPanel, cargarSesionesMotor } from '@/lib/datos';
import { ejercicio } from '@/lib/motor/ejercicios';
import { fechaLarga } from '@/lib/fechas';
import { ajusteCalorico } from '@/lib/motor/nutricion';
import { balanceEnergia, esDiaRedondo, gastoDia } from '@/lib/motor/energia';
import { comidasHabituales } from '@/lib/motor/habituales';
import { horaActual } from '@/lib/fechas';
import { tmbDe } from '@/lib/perfil';
import { proximoDia } from '@/lib/motor/progresion';
import { senales } from '@/lib/motor/senales';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const AREAS = [
  { clave: 'nutricion', etiqueta: 'Nutricion', color: 'hsl(var(--area-cuerpo))' },
  { clave: 'entrenamiento', etiqueta: 'Entreno', color: 'hsl(var(--area-fitness))' },
  { clave: 'foco', etiqueta: 'Foco', color: 'hsl(var(--area-foco))' },
  { clave: 'mente', etiqueta: 'Mente', color: 'hsl(var(--area-mente))' },
  { clave: 'habitos', etiqueta: 'Habitos', color: 'hsl(var(--area-habitos))' },
] as const;

export default async function PanelHoy() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);
  const { diaHoy, metas, cuerpo, puntuaciones } = panel;

  const ajuste = metas ? ajusteCalorico(metas, cuerpo.tendencia, perfil.objetivo ?? 'energia') : null;
  const kcalPct = metas ? Math.round((diaHoy.kcal / metas.kcal) * 100) : 0;
  const proteinaPct = metas ? Math.round((diaHoy.proteina / metas.proteinaG) * 100) : 0;

  const sesionesMotor = panel.entrenamientos
    .filter((e) => e.completado)
    .map((e) => ({
      id: e.id,
      fecha: e.fecha,
      diaId: e.dia_plan ?? '',
      nombre: e.nombre,
      ejercicios: [],
      completada: true,
    }));
  const siguiente = panel.plan
    ? panel.plan.dias.find((d) => d.id === proximoDia(panel.plan!, sesionesMotor)) ?? panel.plan.dias[0]
    : null;

  const lecturas = senales({
    dias: panel.dias,
    hoy: panel.hoy,
    objetivoEntrenos: perfil.dias_semana ?? 3,
    metaKcal: metas?.kcal ?? null,
    metaProteina: metas?.proteinaG ?? null,
    tendenciaPeso: cuerpo.tendencia,
    ritmoObjetivo: metas?.ritmoKgSemana ?? null,
    racha: panel.racha,
  }).slice(0, 3);

  // Entrenos de hoy con sus series, para ensenar lo hecho y no solo un "si".
  const entrenosHoy = panel.entrenamientos.filter((e) => e.completado && e.fecha === panel.hoy);
  const sesionesHoy = entrenosHoy.length ? await cargarSesionesMotor(supabase, usuario.id, panel.hoy) : [];
  const resumenHoy = entrenosHoy.map((e) => {
    const sesion = sesionesHoy.find((s) => s.id === e.id);
    const series = (sesion?.ejercicios ?? []).flatMap((ej) => ej.series.filter((serie) => serie.hecha));
    const volumen = series.reduce((total, serie) => total + (serie.pesoKg ?? 0) * (serie.reps ?? 0), 0);
    const nombres = (sesion?.ejercicios ?? []).map(
      (ej) => ejercicio(ej.ejercicioId)?.nombre ?? ej.ejercicioId.replace(/^libre_/, '').replace(/_/g, ' '),
    );
    return { ...e, ejercicios: nombres, seriesHechas: series.length, volumen: Math.round(volumen) };
  });

  // Balance de energia: gastado (basal, pasos, entrenos) frente a comido.
  const hora = horaActual(perfil.zona_horaria || undefined);
  const gasto = gastoDia({
    tmbKcal: metas?.tmb || tmbDe(perfil, cuerpo.peso),
    pesoKg: cuerpo.peso ?? 75,
    pasos: diaHoy.pasos,
    entrenamientos: entrenosHoy,
  });
  const energia = gasto.basal ? balanceEnergia(diaHoy.kcal, gasto, perfil.objetivo, hora >= 21) : null;
  const tonoEnergia = { bien: 'text-emerald-700 dark:text-emerald-300', aviso: 'text-amber-700 dark:text-amber-300', alerta: 'text-destructive', info: 'text-muted-foreground' };
  const redondo = metas
    ? [
        { etiqueta: 'Entreno o actividad', ok: diaHoy.entreno || diaHoy.actividad },
        { etiqueta: `Calorias en rango (±12 % de ${metas.kcal})`, ok: diaHoy.comidas > 0 && Math.abs(diaHoy.kcal - metas.kcal) <= metas.kcal * 0.12 },
        { etiqueta: `Proteina ≥ ${Math.round(metas.proteinaG * 0.85)} g`, ok: diaHoy.proteina >= metas.proteinaG * 0.85 },
        { etiqueta: 'Check-in de la noche', ok: diaHoy.animo !== null },
      ]
    : [];
  const esRedondo = metas ? esDiaRedondo(diaHoy, { kcal: metas.kcal, proteina: metas.proteinaG }) : false;

  // Lo que suele comer a esta hora: apuntarlo sin salir de aqui.
  const habituales = comidasHabituales(panel.comidas, { hoy: panel.hoy, hora, limite: 5 });

  const habitosHechos = panel.registrosHabitos
    .filter((r) => r.fecha === panel.hoy && r.hecho)
    .map((r) => r.habito_id);

  const serieDePeso = panel.metricas
    .filter((m) => m.peso_kg)
    .map((m) => ({ fecha: m.fecha, valor: m.peso_kg as number }));

  return (
    <main className="space-y-4">
      <section>
        <p className="etiqueta-seccion">{fechaLarga(panel.hoy)}</p>
        <h1 className="mt-1">Hola, {perfil.nombre?.split(' ')[0] ?? 'crack'}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Insignia tono="marca">Nivel {panel.progreso.nivel}</Insignia>
          <Insignia>
            <Flame size={13} className="mr-1" /> {panel.racha} dias de racha
          </Insignia>
          <span className="text-xs text-muted-foreground">
            {panel.progreso.xpNivel}/{panel.progreso.xpSiguienteNivel} XP
          </span>
        </div>
        <div className="mt-2">
          <Barra valor={panel.progreso.porcentaje} />
        </div>
      </section>

      <nav aria-label="Atajos" className="desplazable-x">
        <div className="flex min-w-max gap-2">
          {[
            { href: '/app/checkin', etiqueta: '✍️ Check-in' },
            { href: '/app/cuerpo', etiqueta: '🍽️ Comida' },
            { href: '/app/habitos', etiqueta: '✅ Habitos' },
            { href: '/app/progreso', etiqueta: '📈 Progreso' },
            { href: '/app/coach', etiqueta: '💬 Coach' },
          ].map((atajo) => (
            <Link
              key={atajo.href}
              href={atajo.href}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {atajo.etiqueta}
            </Link>
          ))}
        </div>
      </nav>

      <Tarjeta>
        <div className="mb-3 flex items-baseline justify-between">
          <TituloTarjeta className="mb-0">Tu semana</TituloTarjeta>
          <span className="text-sm text-muted-foreground">
            global <strong className="text-foreground">{puntuaciones.global ?? '—'}</strong>/100
          </span>
        </div>
        <div className="desplazable-x">
          <div className="flex min-w-max gap-4 pb-1">
            {AREAS.map((area) => (
              <Anillo
                key={area.clave}
                valor={puntuaciones[area.clave]}
                etiqueta={area.etiqueta}
                color={area.color}
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Cada area se puntua sobre 100 con lo que llevas registrado esta semana. Un guion
          significa que aun no hay datos suficientes.
        </p>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Hoy</TituloTarjeta>
        {metas ? (
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Calorias</span>
                <span className="tabular-nums">
                  <strong>{diaHoy.kcal}</strong> / {metas.kcal} kcal
                </span>
              </div>
              <Barra valor={kcalPct} color="hsl(var(--area-cuerpo))" />
            </div>
            <div>
              <div className="mb-1 flex items-baseline justify-between text-sm">
                <span className="text-muted-foreground">Proteina</span>
                <span className="tabular-nums">
                  <strong>{diaHoy.proteina}</strong> / {metas.proteinaG} g
                </span>
              </div>
              <Barra valor={proteinaPct} color="hsl(var(--area-foco))" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Dile tu peso al coach y calculo tus calorias y macros al momento.
          </p>
        )}

        {habituales.length > 0 && (
          <div className="mt-4 border-t border-border pt-4">
            <ComidasHabituales habituales={habituales} />
            <Link href="/app/cuerpo" className="text-xs text-primary underline">
              Apuntar otra cosa
            </Link>
          </div>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold">{diaHoy.entreno ? 'Si' : 'No'}</div>
            <div className="text-xs text-muted-foreground">entreno</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{(diaHoy.focoMin / 60).toFixed(1)} h</div>
            <div className="text-xs text-muted-foreground">foco</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">
              {diaHoy.suenoHoras ?? '—'}
              {diaHoy.suenoHoras ? ' h' : ''}
            </div>
            <div className="text-xs text-muted-foreground">sueno</div>
          </div>
        </div>
      </Tarjeta>

      {energia && (
        <Tarjeta>
          <TituloTarjeta>Balance de energia</TituloTarjeta>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-lg font-semibold tabular-nums">{energia.gasto.total.toLocaleString('es-ES')}</div>
              <div className="text-xs text-muted-foreground">gastadas</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-lg font-semibold tabular-nums">{energia.consumido.toLocaleString('es-ES')}</div>
              <div className="text-xs text-muted-foreground">comidas</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className={`text-lg font-semibold tabular-nums ${tonoEnergia[energia.tono]}`}>
                {energia.neto > 0 ? '+' : ''}{Math.round(energia.neto).toLocaleString('es-ES')}
              </div>
              <div className="text-xs text-muted-foreground">balance</div>
            </div>
          </div>
          <p className={`mt-3 text-sm ${tonoEnergia[energia.tono]}`}>{energia.texto}</p>
          <p className="mt-2 text-xs text-muted-foreground tabular-nums">
            Gasto: {energia.gasto.basal} basal
            {energia.gasto.pasos ? ` · ${energia.gasto.pasos} pasos` : ' · pasos sin apuntar'}
            {energia.gasto.fuerza ? ` · ${energia.gasto.fuerza} fuerza` : ''}
            {energia.gasto.cardio ? ` · ${energia.gasto.cardio} cardio` : ''}
            {energia.gasto.actividades ? ` · ${energia.gasto.actividades} actividad` : ''}. Son estimaciones.
          </p>
          {redondo.length > 0 && (
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-sm font-medium">{esRedondo ? '⭐ Dia redondo conseguido (+30 XP)' : 'Dia redondo (+30 XP)'}</p>
              <ul className="mt-1.5 grid gap-1 text-xs sm:grid-cols-2">
                {redondo.map((r) => (
                  <li key={r.etiqueta} className={r.ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}>
                    {r.ok ? '✓' : '○'} {r.etiqueta}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Tarjeta>
      )}

      {resumenHoy.length > 0 && (
        <Tarjeta className="border-emerald-500/40">
          <div className="mb-2 flex items-center justify-between">
            <TituloTarjeta className="mb-0 flex items-center gap-2">
              <Dumbbell size={16} className="text-[hsl(var(--area-fitness))]" /> Entreno de hoy
            </TituloTarjeta>
            <Insignia tono="exito">hecho</Insignia>
          </div>
          <ul className="space-y-3">
            {resumenHoy.map((e) => (
              <li key={e.id} className="text-sm">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{e.nombre}</span>
                  {e.sensacion ? <span className="text-xs text-muted-foreground">sensacion {e.sensacion}/5</span> : null}
                </div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground tabular-nums">
                  {e.ejercicios.length > 0 && <span>{e.ejercicios.length} ejercicios</span>}
                  {e.seriesHechas > 0 && <span>{e.seriesHechas} series</span>}
                  {e.volumen > 0 && <span>{e.volumen.toLocaleString('es-ES')} kg movidos</span>}
                  {e.cardio_min ? <span>{e.dia_plan ? 'cardio' : 'actividad'} {e.cardio_min} min{e.cardio_kcal ? ` · ~${e.cardio_kcal} kcal` : ''}</span> : null}
                </div>
                {e.ejercicios.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">{e.ejercicios.join(' · ')}</p>
                )}
                {e.dia_plan && (
                  <Link href={`/app/entreno?dia=${e.dia_plan}`} className="mt-1 inline-block text-xs text-primary underline">
                    Ver las series
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      {lecturas.length > 0 && (
        <section className="space-y-2">
          <h2 className="etiqueta-seccion">Lo que veo</h2>
          {lecturas.map((senal) => {
            const Icono =
              senal.tono === 'bien' ? CheckCircle2 : senal.tono === 'alerta' ? AlertTriangle : senal.tono === 'aviso' ? TrendingDown : Info;
            const color =
              senal.tono === 'bien'
                ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : senal.tono === 'alerta'
                  ? 'border-destructive/40 text-destructive'
                  : senal.tono === 'aviso'
                    ? 'border-amber-500/40 text-amber-600 dark:text-amber-400'
                    : 'border-border text-muted-foreground';
            return (
              <Tarjeta key={senal.id} className={color.split(' ')[0]}>
                <div className="flex gap-3">
                  <Icono size={18} className={`mt-0.5 shrink-0 ${color.split(' ')[1]}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{senal.titulo}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{senal.detalle}</p>
                    {senal.accion && (
                      <Link href={senal.accion.href} className="mt-2 inline-block text-sm text-primary underline">
                        {senal.accion.texto}
                      </Link>
                    )}
                  </div>
                </div>
              </Tarjeta>
            );
          })}
        </section>
      )}

      {ajuste && ajuste.estado !== 'sin_datos' && (
        <Tarjeta className={ajuste.estado === 'ok' ? 'border-emerald-500/40' : 'border-amber-500/40'}>
          <TituloTarjeta>Ajuste de calorias</TituloTarjeta>
          <p className="text-sm text-muted-foreground">{ajuste.mensaje}</p>
        </Tarjeta>
      )}

      <Tarjeta>
        <TituloTarjeta>Habitos de hoy</TituloTarjeta>
        <HabitosHoy habitos={panel.habitos} hechos={habitosHechos} fecha={panel.hoy} />
      </Tarjeta>

      {siguiente && (
        <Tarjeta className="border-primary/40 bg-gradient-to-br from-primary/15 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="etiqueta-seccion">{diaHoy.entreno ? 'Siguiente entreno' : 'Toca hoy'}</p>
              <p className="mt-1 font-semibold">{siguiente.nombre}</p>
              <p className="text-sm text-muted-foreground">
                {siguiente.foco} · {siguiente.bloques.length} ejercicios
              </p>
            </div>
            <Link href={`/app/entreno?dia=${siguiente.id}`}>
              <Boton tamano="sm">
                Entrenar <ArrowRight size={16} />
              </Boton>
            </Link>
          </div>
        </Tarjeta>
      )}

      {serieDePeso.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Peso</TituloTarjeta>
          <Grafica datos={serieDePeso} unidad=" kg" />
        </Tarjeta>
      )}

      {panel.tareas.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Pendiente</TituloTarjeta>
          <ul className="space-y-1.5 text-sm">
            {panel.tareas.slice(0, 5).map((tarea) => (
              <li key={tarea.id} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {tarea.titulo}
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      <Link href="/app/coach" className="block">
        <Tarjeta className="flex items-center gap-3 border-dashed">
          <MessageCircle size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">
            Cuentale tu dia al coach y se apunta solo: comidas, entrenos, foco, sueno…
          </span>
        </Tarjeta>
      </Link>
    </main>
  );
}
