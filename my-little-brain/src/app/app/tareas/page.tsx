import { ArrowUp, Backpack, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { aLaMochila, borrarTarea, crearTarea, traerAHoy } from '@/app/app/tareas/acciones';
import TareasHoy from '@/components/tareas-hoy';
import { Barra, Boton, Campo, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel } from '@/lib/datos';
import { fechaCorta, fechaLarga, ultimosDias } from '@/lib/fechas';
import { MAX_HOY, insightsTareas, progresoTareas, tareasDelDia } from '@/lib/motor/tareas';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const DIAS = 30;

const tonos = {
  bien: 'text-emerald-600 dark:text-emerald-400',
  aviso: 'text-amber-600 dark:text-amber-400',
  info: 'text-muted-foreground',
} as const;

export default async function PaginaTareas() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);

  const dia = tareasDelDia(panel.tareas, panel.hoy);
  const fechas = ultimosDias(DIAS, panel.hoy);
  const progreso = progresoTareas(panel.tareas, fechas);
  const avisos = insightsTareas(dia, progreso);

  const porDia = fechas.slice(-14).map((fecha) => {
    const delDia = panel.tareas.filter((t) => t.fecha === fecha);
    return { fecha, total: delDia.length, hechas: delDia.filter((t) => t.completada).length };
  });

  return (
    <main className="space-y-4">
      <div>
        <h1>Lo importante de hoy</h1>
        <p className="mt-1 text-sm text-muted-foreground">{fechaLarga(panel.hoy)}</p>
      </div>

      <Tarjeta>
        <div className="mb-3 flex items-baseline justify-between">
          <TituloTarjeta className="mb-0">Tus {MAX_HOY} de hoy</TituloTarjeta>
          <span className="text-xs text-muted-foreground">
            {dia.hechasHoy.length} de {dia.hoy.length + dia.hechasHoy.length}
          </span>
        </div>

        {dia.hoy.length || dia.hechasHoy.length ? (
          <TareasHoy abiertas={dia.hoy} hechas={dia.hechasHoy} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Elige como mucho tres cosas. Si eliges diez, no vas a hacer ninguna.
          </p>
        )}

        {dia.huecos > 0 && (
          <form action={crearTarea} className="mt-3 space-y-2 border-t border-border pt-3">
            <input type="hidden" name="para_hoy" value="si" />
            <Campo
              etiqueta={`Anadir a las de hoy (${dia.huecos} ${dia.huecos === 1 ? 'hueco' : 'huecos'})`}
              name="titulo" placeholder="Cerrar la propuesta de EAC" required
            />
            <Boton type="submit" variante="secundario" className="w-full">Anadir a hoy</Boton>
          </form>
        )}
        {dia.huecos === 0 && !dia.diaCerrado && (
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
            Ya tienes tus tres. Lo que se te ocurra ahora va a la mochila, no a hoy.
          </p>
        )}
      </Tarjeta>

      {avisos.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Lo que veo</TituloTarjeta>
          <ul className="space-y-2 text-sm">
            {avisos.map((a) => <li key={a.id} className={tonos[a.tono]}>· {a.texto}</li>)}
          </ul>
        </Tarjeta>
      )}

      {dia.arrastradas.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Vienen de otros dias</TituloTarjeta>
          <p className="mb-3 text-sm text-muted-foreground">
            No las metas todas hoy. Trae una, y el resto a la mochila hasta que les toque.
          </p>
          <ul className="divide-y divide-border">
            {dia.arrastradas.map((t) => (
              <li key={t.id} className="flex items-center gap-2 py-2 text-sm">
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{t.titulo}</span>
                  <span className="text-xs text-muted-foreground">
                    del {fechaCorta(t.fecha!)}
                    {t.pospuesta > 0 && ` · pospuesta ${t.pospuesta} ${t.pospuesta === 1 ? 'vez' : 'veces'}`}
                  </span>
                </span>
                {dia.huecos > 0 && (
                  <form action={traerAHoy.bind(null, t.id)}>
                    <button type="submit" aria-label={`Traer ${t.titulo} a hoy`} className="flex items-center gap-1 text-xs text-primary">
                      <ArrowUp size={14} /> Hoy
                    </button>
                  </form>
                )}
                <form action={aLaMochila.bind(null, t.id)}>
                  <button type="submit" aria-label={`Mandar ${t.titulo} a la mochila`} className="text-muted-foreground hover:text-foreground">
                    <Backpack size={16} />
                  </button>
                </form>
                <form action={borrarTarea.bind(null, t.id)}>
                  <button type="submit" aria-label={`Borrar ${t.titulo}`} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      <Tarjeta>
        <TituloTarjeta>Tu avance</TituloTarjeta>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{progreso.pct === null ? '—' : `${progreso.pct} %`}</div>
            <div className="text-xs text-muted-foreground">dias cerrados</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{progreso.racha}</div>
            <div className="text-xs text-muted-foreground">racha</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{progreso.hechas}</div>
            <div className="text-xs text-muted-foreground">hechas</div>
          </div>
        </div>

        {/* Una columna por dia: los dias sin tareas se quedan en gris, no en rojo. */}
        <div className="flex h-16 items-end gap-1">
          {porDia.map((d) => (
            <div key={d.fecha} className="flex h-full flex-1 flex-col justify-end" title={`${fechaCorta(d.fecha)}: ${d.hechas} de ${d.total}`}>
              <div
                className={`w-full rounded-t ${
                  d.total === 0 ? 'bg-muted' : d.hechas === d.total ? 'bg-emerald-500/70' : 'bg-primary/40'
                }`}
                style={{ height: d.total === 0 ? '10%' : `${Math.max(20, (d.hechas / d.total) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Ultimos {DIAS} dias. Solo cuentan los dias en los que elegiste algo: un dia sin tareas no es un dia
          fallado, es un dia que no usaste esto.
        </p>
      </Tarjeta>

      <Tarjeta>
        <div className="mb-3 flex items-center gap-2">
          <Backpack size={18} className="text-muted-foreground" />
          <TituloTarjeta className="mb-0">La mochila</TituloTarjeta>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          Lo que quieres hacer, pero no hoy. Aqui no molesta y no se pierde.
        </p>
        {dia.mochila.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {dia.mochila.map((t) => (
              <li key={t.id} className="flex items-center gap-2 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate">
                  {t.titulo}
                  {t.fecha && <span className="ml-1.5 text-xs text-muted-foreground">para el {fechaCorta(t.fecha)}</span>}
                </span>
                {dia.huecos > 0 && (
                  <form action={traerAHoy.bind(null, t.id)}>
                    <button type="submit" aria-label={`Traer ${t.titulo} a hoy`} className="flex items-center gap-1 text-xs text-primary">
                      <ArrowUp size={14} /> Hoy
                    </button>
                  </form>
                )}
                <form action={borrarTarea.bind(null, t.id)}>
                  <button type="submit" aria-label={`Borrar ${t.titulo}`} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <form action={crearTarea} className="space-y-2 border-t border-border pt-3">
          <Campo etiqueta="Apuntar para mas adelante" name="titulo" placeholder="Cambiar el seguro del coche" required />
          <Boton type="submit" variante="contorno" className="w-full">A la mochila</Boton>
        </form>
      </Tarjeta>

      {progreso.hechas > 0 && (
        <Tarjeta>
          <TituloTarjeta>Cerradas estos dias</TituloTarjeta>
          <ul className="divide-y divide-border">
            {panel.tareas
              .filter((t) => t.completada && t.completada_el)
              .sort((a, b) => (a.completada_el! < b.completada_el! ? 1 : -1))
              .slice(0, 10)
              .map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <span className="min-w-0 flex-1 truncate text-muted-foreground line-through">{t.titulo}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{fechaCorta(t.completada_el!)}</span>
                </li>
              ))}
          </ul>
        </Tarjeta>
      )}

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Tambien puedes decirselo al <Link href="/app/coach" className="text-primary underline">coach</Link>:
        &ldquo;hoy tengo que cerrar la propuesta y llamar al gestor&rdquo;.
      </p>
    </main>
  );
}
