import { Check, Pause, Play, Target, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  actualizarValor,
  borrarObjetivo,
  cambiarEstado,
  crearObjetivo,
  tareaParaObjetivo,
} from '@/app/app/objetivos/acciones';
import { Barra, Boton, Campo, Insignia, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel } from '@/lib/datos';
import { diasEntre, fechaCorta, sumarDias } from '@/lib/fechas';
import {
  ETIQUETA_AREA,
  METRICAS,
  insightsObjetivos,
  medir,
  metrica as infoMetrica,
  ritmo,
  type ObjetivoConMedida,
} from '@/lib/motor/objetivos';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const tonos = {
  bien: 'text-emerald-600 dark:text-emerald-400',
  aviso: 'text-amber-600 dark:text-amber-400',
  info: 'text-muted-foreground',
} as const;

const num = (n: number | null, unidad: string) =>
  n === null ? '—' : `${String(Math.round(n * 10) / 10).replace('.', ',')}${unidad ? ` ${unidad}` : ''}`;

export default async function PaginaObjetivos() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);
  const fuentes = { cuerpo: panel.cuerpo, dias: panel.dias, hoy: panel.hoy };

  const conMedida: ObjetivoConMedida[] = panel.objetivos.map((objetivo) => {
    const medicion = medir(objetivo, fuentes);
    return {
      objetivo,
      medicion,
      ritmo: ritmo(objetivo, medicion, objetivo.creado ?? panel.hoy, panel.hoy, sumarDias, diasEntre),
      tareasAbiertas: panel.tareas.filter((t) => t.objetivo_id === objetivo.id && !t.completada).length,
    };
  });

  const activos = conMedida.filter((o) => o.objetivo.estado === 'activo');
  const pausados = conMedida.filter((o) => o.objetivo.estado === 'pausado');
  const cerrados = conMedida.filter((o) => ['conseguido', 'abandonado'].includes(o.objetivo.estado));
  const avisos = insightsObjetivos(conMedida);

  return (
    <main className="space-y-4">
      <div>
        <h1>Objetivos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lo que quieres conseguir, medido con los datos que ya tiene la app. Sin tener que apuntar nada dos veces.
        </p>
      </div>

      {avisos.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Lo que veo</TituloTarjeta>
          <ul className="space-y-2 text-sm">
            {avisos.map((a) => <li key={a.id} className={tonos[a.tono]}>· {a.texto}</li>)}
          </ul>
        </Tarjeta>
      )}

      {[...activos, ...pausados].map(({ objetivo, medicion, ritmo: r, tareasAbiertas }) => {
        const info = infoMetrica(objetivo.metrica);
        const pausado = objetivo.estado === 'pausado';
        return (
          <Tarjeta key={objetivo.id} className={pausado ? 'opacity-70' : undefined}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <TituloTarjeta className="mb-0.5">{objetivo.titulo}</TituloTarjeta>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Insignia>{ETIQUETA_AREA[objetivo.area] ?? objetivo.area}</Insignia>
                  {objetivo.fecha_limite && <span>antes del {fechaCorta(objetivo.fecha_limite)}</span>}
                  {pausado && <Insignia tono="aviso">en pausa</Insignia>}
                </div>
              </div>
              <form action={borrarObjetivo.bind(null, objetivo.id)}>
                <button type="submit" aria-label={`Borrar ${objetivo.titulo}`} className="text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              </form>
            </div>

            {objetivo.detalle && <p className="mb-3 text-sm text-muted-foreground">{objetivo.detalle}</p>}

            {medicion.pct !== null ? (
              <>
                <div className="mb-1 flex items-baseline justify-between text-sm tabular-nums">
                  <span className="text-muted-foreground">
                    de {num(medicion.inicial, info.unidad)} a {num(medicion.meta, info.unidad)}
                  </span>
                  <span>
                    <strong>{num(medicion.actual, info.unidad)}</strong>
                    <span className="ml-1.5 text-xs text-muted-foreground">{medicion.pct} %</span>
                  </span>
                </div>
                <Barra
                  valor={medicion.pct}
                  color={medicion.conseguido ? 'hsl(142 71% 45%)' : 'hsl(var(--primary))'}
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {medicion.conseguido
                    ? 'Ya has llegado. Dalo por conseguido cuando quieras.'
                    : `Te ${medicion.falta === 1 ? 'falta' : 'faltan'} ${num(medicion.falta, info.unidad)}.`}
                  {r.porSemana !== null && r.porSemana !== 0 && !medicion.conseguido && (
                    <> Vas a {num(Math.abs(r.porSemana), info.unidad)} por semana.</>
                  )}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {info.automatica
                  ? `Aun no tengo con que medirlo. ${info.ayuda}`
                  : 'Ponle un numero objetivo y ve contando abajo.'}
              </p>
            )}

            {/* La proyeccion: la fecha en la mano, sin regañar. */}
            {r.llegada && !medicion.conseguido && (
              <p className={`mt-2 text-sm ${r.aTiempo === false ? tonos.aviso : tonos.info}`}>
                A este ritmo llegas el {fechaCorta(r.llegada)}
                {objetivo.fecha_limite && (
                  r.aTiempo
                    ? `, antes de tu fecha. Vas en hora.`
                    : `, y tu fecha es el ${fechaCorta(objetivo.fecha_limite)}. O aprietas, o mueves la fecha: las dos valen.`
                )}
                {!objetivo.fecha_limite && '.'}
              </p>
            )}

            {!info.automatica && !pausado && (
              <form action={actualizarValor.bind(null, objetivo.id)} className="mt-3 flex items-end gap-2 border-t border-border pt-3">
                <div className="flex-1">
                  <Campo
                    etiqueta="Como vas" name="valor_actual" type="number" step="any" inputMode="decimal"
                    defaultValue={objetivo.valor_actual ?? ''}
                  />
                </div>
                <Boton type="submit" variante="secundario">Guardar</Boton>
              </form>
            )}

            {!pausado && (
              <form action={tareaParaObjetivo.bind(null, objetivo.id)} className="mt-3 space-y-2 border-t border-border pt-3">
                <Campo
                  etiqueta="¿Que haces hoy por esto?" name="titulo" placeholder="Llamar a dos clientes"
                  ayuda={tareasAbiertas > 0 ? `Ya tienes ${tareasAbiertas} ${tareasAbiertas === 1 ? 'tarea abierta' : 'tareas abiertas'} de este objetivo.` : 'Un objetivo sin una tarea al lado es un deseo.'}
                />
                <Boton type="submit" variante="contorno" className="w-full">Anadir a mis tareas</Boton>
              </form>
            )}

            <div className="mt-3 flex gap-2 border-t border-border pt-3 text-xs">
              <form action={cambiarEstado.bind(null, objetivo.id, 'conseguido')}>
                <button type="submit" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <Check size={14} /> Conseguido
                </button>
              </form>
              <form action={cambiarEstado.bind(null, objetivo.id, pausado ? 'activo' : 'pausado')}>
                <button type="submit" className="flex items-center gap-1 text-muted-foreground">
                  {pausado ? <><Play size={14} /> Retomar</> : <><Pause size={14} /> Pausar</>}
                </button>
              </form>
              {!pausado && (
                <form action={cambiarEstado.bind(null, objetivo.id, 'abandonado')}>
                  <button type="submit" className="text-muted-foreground">Soltarlo</button>
                </form>
              )}
            </div>
          </Tarjeta>
        );
      })}

      <Tarjeta>
        <div className="mb-3 flex items-center gap-2">
          <Target size={18} className="text-primary" />
          <TituloTarjeta className="mb-0">Nuevo objetivo</TituloTarjeta>
        </div>
        <form action={crearObjetivo} className="space-y-3">
          <Campo etiqueta="Que quieres conseguir" name="titulo" placeholder="Bajar a 78 kg" required />
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Area" name="area" defaultValue="cuerpo">
              {Object.entries(ETIQUETA_AREA).map(([valor, nombre]) => (
                <option key={valor} value={valor}>{nombre}</option>
              ))}
            </Selector>
            <Selector etiqueta="Como se mide" name="metrica" defaultValue="peso">
              {METRICAS.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </Selector>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Numero al que quieres llegar" name="valor_objetivo" type="number" step="any" inputMode="decimal" placeholder="78" />
            <Campo etiqueta="Para cuando" name="fecha_limite" type="date" />
          </div>
          <Campo etiqueta="Por que te importa (opcional)" name="detalle" placeholder="Para llegar bien a la boda de mi hermano" />
          <Boton type="submit" className="w-full">Crear objetivo</Boton>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          Si eliges peso, cintura, grasa, entrenos, tiempo o sueno, la app lo mide sola con lo que ya apuntas. El punto
          de partida lo coge de hoy. &ldquo;Lo cuento yo&rdquo; es para lo que solo sabes tu: clientes, capitulos, kilometros.
        </p>
      </Tarjeta>

      {cerrados.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Los que ya no estan en marcha</TituloTarjeta>
          <ul className="divide-y divide-border">
            {cerrados.map(({ objetivo }) => (
              <li key={objetivo.id} className="flex items-center gap-2 py-2 text-sm">
                <span className="min-w-0 flex-1 truncate">
                  {objetivo.titulo}
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {objetivo.estado === 'conseguido' ? 'conseguido' : 'soltado'}
                  </span>
                </span>
                <form action={cambiarEstado.bind(null, objetivo.id, 'activo')}>
                  <button type="submit" className="text-xs text-primary underline">Retomar</button>
                </form>
                <form action={borrarObjetivo.bind(null, objetivo.id)}>
                  <button type="submit" aria-label={`Borrar ${objetivo.titulo}`} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Soltar un objetivo no es fracasar. A veces deja de ser el tuyo y decirlo a tiempo vale mas que arrastrarlo.
          </p>
        </Tarjeta>
      )}

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Tus tareas de hoy estan en <Link href="/app/tareas" className="text-primary underline">Lo importante de hoy</Link>.
      </p>
    </main>
  );
}
