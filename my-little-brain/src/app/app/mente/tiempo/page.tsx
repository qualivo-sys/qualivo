import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  apuntarTiempo,
  archivarActividad,
  borrarActividad,
  borrarTiempo,
  crearActividad,
} from '@/app/app/mente/acciones-tiempo';
import { Barra, Boton, Campo, Insignia, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel, cargarTiempo } from '@/lib/datos';
import { fechaCorta, inicioSemana, sumarDias } from '@/lib/fechas';
import { ETIQUETA_CATEGORIA_FOCO } from '@/lib/perfil';
import { avance, insightsTiempo, resumenTiempo, semanasHasta } from '@/lib/motor/tiempo';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const SEMANAS = 8;

const hm = (min: number) => {
  if (!min) return '0 min';
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h ? `${h} h${m ? ` ${m} min` : ''}` : `${m} min`;
};

const etiqueta = (id: string) => ETIQUETA_CATEGORIA_FOCO[id] ?? 'Otro';

export default async function PaginaTiempo() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const [panel, tiempo] = await Promise.all([
    cargarPanel(supabase, usuario.id, perfil),
    cargarTiempo(supabase, usuario.id),
  ]);

  const semanas = semanasHasta(panel.hoy, SEMANAS, inicioSemana, sumarDias);
  const estaSemana = semanas[semanas.length - 1];
  const resumen = resumenTiempo(panel.foco, tiempo.actividades, estaSemana.fechas, etiqueta);
  const av = avance(panel.foco, semanas);
  const avisos = insightsTiempo(resumen, av, 7);

  const maxSemana = Math.max(1, ...av.serie.map((s) => s.minutos));
  const vivas = tiempo.actividades.filter((a) => !a.archivada);
  const ultimos = panel.foco
    .filter((f) => f.fecha >= sumarDias(panel.hoy, -13))
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1))
    .slice(0, 15);

  return (
    <main className="space-y-4">
      <div>
        <h1>Tu tiempo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          En que se te va la semana y si vas a mas o a menos.{' '}
          <Link href="/app/mente" className="text-primary underline">Volver a Mente</Link>
        </p>
      </div>

      <Tarjeta>
        <TituloTarjeta>Tu avance, semana a semana</TituloTarjeta>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{hm(av.estaSemana)}</div>
            <div className="text-xs text-muted-foreground">esta semana</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{av.mediaSemanal !== null ? hm(av.mediaSemanal) : '—'}</div>
            <div className="text-xs text-muted-foreground">media semanal</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{hm(av.mejorSemana)}</div>
            <div className="text-xs text-muted-foreground">tu mejor semana</div>
          </div>
        </div>

        <div className="flex h-24 items-end gap-1.5">
          {av.serie.map((s, i) => (
            <div key={s.desde} className="flex h-full flex-1 flex-col justify-end" title={`Semana del ${fechaCorta(s.desde)}: ${hm(s.minutos)}`}>
              <div
                className={`w-full rounded-t ${i === av.serie.length - 1 ? 'bg-primary' : 'bg-primary/40'}`}
                style={{ height: `${Math.max(3, (s.minutos / maxSemana) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{fechaCorta(av.serie[0].desde)}</span>
          <span>esta semana</span>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {av.cambio !== null
            ? `${av.cambio > 0 ? '+' : ''}${av.cambio} % respecto a la semana pasada (${hm(av.semanaAnterior)}).`
            : 'Cuando tengas dos semanas apuntadas te dire si vas a mas o a menos.'}
          {av.semanasSeguidas >= 2 && ` ${av.semanasSeguidas} semanas seguidas dedicandole tiempo.`}
          {av.totalMinutos > 0 && ` En total llevas ${hm(av.totalMinutos)}.`}
        </p>
      </Tarjeta>

      {avisos.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Lo que veo</TituloTarjeta>
          <ul className="space-y-2 text-sm">
            {avisos.map((a) => (
              <li key={a.id} className={a.tono === 'bien' ? 'text-emerald-600 dark:text-emerald-400' : a.tono === 'aviso' ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}>
                · {a.texto}
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      {resumen.actividades.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>En que has estado esta semana</TituloTarjeta>
          <ul className="space-y-3">
            {resumen.actividades.map((a) => {
              const propia = tiempo.actividades.find((x) => x.id === a.id);
              const suyo = propia ? avance(panel.foco, semanas, propia.id) : null;
              return (
                <li key={a.id}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                    <span className="min-w-0 truncate">{a.emoji} {a.nombre}</span>
                    <span className="shrink-0 tabular-nums">
                      <strong>{hm(a.minutos)}</strong>
                      <span className="ml-1 text-xs text-muted-foreground">{a.pct} %</span>
                    </span>
                  </div>
                  <Barra valor={a.objetivoPct ?? a.pct} color={a.objetivoPct !== null ? 'hsl(var(--area-foco))' : 'hsl(var(--primary))'} />
                  <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {a.sesiones} {a.sesiones === 1 ? 'rato' : 'ratos'}
                      {a.objetivoMin !== null && ` · objetivo ${hm(a.objetivoMin)} a la semana`}
                    </span>
                    {suyo && suyo.cambio !== null && (
                      <span className={suyo.cambio >= 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}>
                        {suyo.cambio > 0 ? '+' : ''}{suyo.cambio} % vs semana pasada
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 border-t border-border pt-3 text-sm tabular-nums">
            Total: <strong>{hm(resumen.minutos)}</strong> en {resumen.sesiones} ratos y {resumen.diasActivos}{' '}
            {resumen.diasActivos === 1 ? 'dia' : 'dias'}.
          </p>
        </Tarjeta>
      )}

      <Tarjeta>
        <TituloTarjeta>Apuntar un rato a mano</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">
          Para cuando el rato ya ha pasado y nadie le dio al play.
        </p>
        <form action={apuntarTiempo} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Actividad" name="actividad_id" defaultValue={vivas[0]?.id ?? ''}>
              {vivas.map((a) => (
                <option key={a.id} value={a.id}>{a.emoji ? `${a.emoji} ` : ''}{a.nombre}</option>
              ))}
              <option value="">Sin actividad</option>
            </Selector>
            <Campo etiqueta="Minutos" name="minutos" type="number" min={1} inputMode="numeric" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Dia" name="fecha" type="date" defaultValue={panel.hoy} />
            <Campo etiqueta="En que" name="descripcion" placeholder="Capitulo 4" />
          </div>
          <Boton type="submit" variante="secundario" className="w-full">Apuntar el rato</Boton>
        </form>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Tus actividades</TituloTarjeta>
        {tiempo.actividades.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {tiempo.actividades.map((a) => (
              <li key={a.id} className="flex items-center gap-2 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate">
                  {a.emoji || '⏱️'} {a.nombre}
                  <span className="ml-1.5 text-xs text-muted-foreground">{etiqueta(a.categoria)}</span>
                  {a.objetivo_min_semana && (
                    <span className="ml-1.5 text-xs text-muted-foreground">· {hm(a.objetivo_min_semana)}/sem</span>
                  )}
                </span>
                {a.archivada && <Insignia>archivada</Insignia>}
                <form action={archivarActividad.bind(null, a.id, !a.archivada)}>
                  <button type="submit" className="text-xs text-primary underline">
                    {a.archivada ? 'Recuperar' : 'Archivar'}
                  </button>
                </form>
                <form action={borrarActividad.bind(null, a.id)}>
                  <button type="submit" aria-label={`Borrar ${a.nombre}`} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form action={crearActividad} className="space-y-3 border-t border-border pt-3">
          <div className="grid grid-cols-[4rem_1fr] gap-3">
            <Campo etiqueta="Icono" name="emoji" placeholder="🎸" maxLength={4} />
            <Campo etiqueta="Nombre" name="nombre" placeholder="Guitarra" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Tipo" name="categoria" defaultValue="aprendizaje">
              {Object.entries(ETIQUETA_CATEGORIA_FOCO).map(([valor, nombre]) => (
                <option key={valor} value={valor}>{nombre}</option>
              ))}
            </Selector>
            <Campo
              etiqueta="Min. a la semana" name="objetivo_min_semana" type="number" min={1}
              inputMode="numeric" placeholder="120" ayuda="Opcional"
            />
          </div>
          <Boton type="submit" variante="contorno" className="w-full">Crear actividad</Boton>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          Al archivar deja de salir para cronometrar, pero el tiempo que le dedicaste sigue contando.
        </p>
      </Tarjeta>

      {ultimos.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Ultimos ratos</TituloTarjeta>
          <ul className="divide-y divide-border">
            {ultimos.map((f) => {
              const act = tiempo.actividades.find((a) => a.id === f.actividad_id);
              return (
                <li key={f.id} className="flex items-center gap-2 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate">
                    {act ? `${act.emoji || '⏱️'} ${act.nombre}` : etiqueta(f.categoria)}
                    {f.descripcion && <span className="text-muted-foreground"> · {f.descripcion}</span>}
                    <span className="block text-xs text-muted-foreground">{fechaCorta(f.fecha)}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">{hm(f.minutos)}</span>
                  <form action={borrarTiempo.bind(null, f.id)}>
                    <button type="submit" aria-label="Borrar" className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        </Tarjeta>
      )}
    </main>
  );
}
