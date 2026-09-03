import { AlertTriangle, ArrowRight, CheckCircle2, Flame, Info, MessageCircle, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import HabitosHoy from '@/components/habitos-hoy';
import { Anillo } from '@/components/ui/anillo';
import { Barra, Boton, Insignia, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import Grafica from '@/components/ui/grafica';
import { cargarPanel } from '@/lib/datos';
import { fechaLarga } from '@/lib/fechas';
import { ajusteCalorico } from '@/lib/motor/nutricion';
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
              <p className="etiqueta-seccion">{diaHoy.entreno ? 'Ya has entrenado hoy' : 'Toca hoy'}</p>
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
