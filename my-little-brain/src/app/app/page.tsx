import { ArrowRight, Flame, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import HabitosHoy from '@/components/habitos-hoy';
import { Anillo } from '@/components/ui/anillo';
import { Barra, Boton, Insignia, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import Grafica from '@/components/ui/grafica';
import { cargarPanel } from '@/lib/datos';
import { fechaLarga } from '@/lib/fechas';
import { ajusteCalorico } from '@/lib/motor/nutricion';
import { proximoDia } from '@/lib/motor/progresion';
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
