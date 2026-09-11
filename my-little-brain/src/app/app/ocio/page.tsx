import { Check, ExternalLink, Trash2, Undo2 } from 'lucide-react';
import Link from 'next/link';
import {
  anotarOcio,
  borrarOcio,
  descartarOcio,
  devolverAPendiente,
  marcarHecho,
  valorarOcio,
} from '@/app/app/ocio/acciones';
import { Boton, Campo, Insignia, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarOcio, cargarPanel } from '@/lib/datos';
import { diasEntre, fechaCorta } from '@/lib/fechas';
import { CATEGORIAS_OCIO, categoriaOcio, insightsOcio, resumenOcio, sugerencias } from '@/lib/motor/ocio';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const tonos = {
  bien: 'text-emerald-600 dark:text-emerald-400',
  aviso: 'text-amber-600 dark:text-amber-400',
  info: 'text-muted-foreground',
} as const;

const RATOS = [
  { min: 60, etiqueta: '1 h' },
  { min: 180, etiqueta: 'Una tarde' },
  { min: 1440, etiqueta: 'Un dia' },
];

export default async function PaginaOcio({
  searchParams,
}: {
  searchParams: { cat?: string; ver?: string; rato?: string };
}) {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);
  const apuntes = await cargarOcio(supabase, usuario.id, panel.hoy);

  const resumen = resumenOcio(apuntes, panel.hoy, diasEntre);
  const diaSemana = new Date(panel.hoy + 'T12:00:00').getDay();
  const avisos = insightsOcio({ resumen, apuntes, dias: panel.dias, hoy: panel.hoy, diaSemana });

  const cat = CATEGORIAS_OCIO.some((c) => c.id === searchParams.cat) ? searchParams.cat : undefined;
  const verHechos = searchParams.ver === 'hechos';
  const rato = Number(searchParams.rato) || undefined;

  const pendientes = sugerencias(apuntes, { minutos: rato, categoria: cat });
  const hechos = apuntes
    .filter((a) => a.estado === 'hecho' && (!cat || a.categoria === cat))
    .sort((a, b) => ((a.fecha_hecho ?? '') < (b.fecha_hecho ?? '') ? 1 : -1));
  const lista = verHechos ? hechos : pendientes;

  const enlaces = (extra: Record<string, string | undefined>) => {
    const q = new URLSearchParams();
    const juntos = { cat, ver: verHechos ? 'hechos' : undefined, rato: rato ? String(rato) : undefined, ...extra };
    for (const [k, v] of Object.entries(juntos)) if (v) q.set(k, v);
    const s = q.toString();
    return `/app/ocio${s ? `?${s}` : ''}`;
  };

  return (
    <main className="space-y-4">
      <div>
        <h1>Ocio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lo que quieres hacer y lo que ya has hecho, en la misma lista. Para que cuando tengas un rato no tengas que
          pensar.
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

      {/* Todo de un vistazo: cuanto hay de cada cosa y cuanto has hecho. */}
      {resumen.categorias.length > 0 && (
        <Tarjeta>
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <TituloTarjeta className="mb-0">De un vistazo</TituloTarjeta>
            <span className="text-xs text-muted-foreground tabular-nums">
              {resumen.totalPendientes} por hacer · {resumen.totalHechos} hechas
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {resumen.categorias.map((l) => (
              <Link
                key={l.categoria.id}
                href={enlaces({ cat: cat === l.categoria.id ? undefined : l.categoria.id })}
                className={`rounded-lg border p-2 text-center transition-colors ${
                  cat === l.categoria.id ? 'border-primary bg-primary/10' : 'border-border bg-muted/40 hover:bg-muted'
                }`}
              >
                <div className="text-lg">{l.categoria.emoji}</div>
                <div className="text-lg font-semibold tabular-nums">{l.pendientes}</div>
                <div className="truncate text-[10px] text-muted-foreground">
                  {l.categoria.nombre}
                  {l.hechos > 0 && ` · ${l.hechos} ✓`}
                </div>
              </Link>
            ))}
          </div>
        </Tarjeta>
      )}

      <Tarjeta>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Link
            href={enlaces({ ver: undefined })}
            className={`rounded-full px-3 py-1 text-sm ${!verHechos ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Por hacer
          </Link>
          <Link
            href={enlaces({ ver: 'hechos' })}
            className={`rounded-full px-3 py-1 text-sm ${verHechos ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            Hechas
          </Link>
          {cat && (
            <Link href={enlaces({ cat: undefined })} className="text-xs text-primary underline">
              Quitar filtro {categoriaOcio(cat).nombre}
            </Link>
          )}
        </div>

        {/* "Tengo una hora libre": la pregunta con la que se usa esto de verdad. */}
        {!verHechos && (
          <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-3 text-xs">
            <span className="text-muted-foreground">¿Cuanto rato tienes?</span>
            {RATOS.map((r) => (
              <Link
                key={r.min}
                href={enlaces({ rato: rato === r.min ? undefined : String(r.min) })}
                className={`rounded-full px-2.5 py-1 ${rato === r.min ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
              >
                {r.etiqueta}
              </Link>
            ))}
            {rato && <span className="text-muted-foreground">Solo lo que cabe (o no tiene duracion puesta).</span>}
          </div>
        )}

        {lista.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {verHechos ? 'Aun no has marcado nada como hecho.' : 'Nada por aqui. Apunta algo ahi abajo.'}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {lista.slice(0, 60).map((a) => {
              const c = categoriaOcio(a.categoria);
              return (
                <li key={a.id} className="py-2">
                  <details>
                    <summary className="flex cursor-pointer items-start gap-3 marker:content-['']">
                      <span className="text-base leading-6">{c.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm">{a.titulo}</div>
                        <div className="text-xs text-muted-foreground">
                          {a.estado === 'hecho' && a.fecha_hecho ? fechaCorta(a.fecha_hecho) : c.nombre}
                          {a.lugar && ` · ${a.lugar}`}
                          {a.minutos && ` · ${a.minutos < 60 ? `${a.minutos} min` : `${Math.round(a.minutos / 60)} h`}`}
                          {a.con_quien && ` · con ${a.con_quien}`}
                          {a.valoracion && ` · ${'★'.repeat(a.valoracion)}`}
                        </div>
                      </div>
                      {a.estado === 'pendiente' ? (
                        <form action={marcarHecho.bind(null, a.id)}>
                          <button
                            type="submit" aria-label={`Marcar ${a.titulo} como hecho`}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground hover:border-emerald-500 hover:text-emerald-600"
                          >
                            <Check size={15} />
                          </button>
                        </form>
                      ) : (
                        <Insignia tono="exito">hecho</Insignia>
                      )}
                    </summary>

                    <div className="mt-2 space-y-2 rounded-lg bg-muted/40 p-3">
                      {a.nota && <p className="text-sm">{a.nota}</p>}
                      {a.enlace && (
                        <a href={a.enlace} target="_blank" rel="noreferrer noopener" className="flex items-center gap-1 text-sm text-primary underline">
                          <ExternalLink size={13} /> Abrir el enlace
                        </a>
                      )}

                      {a.estado === 'hecho' && (
                        <form action={valorarOcio.bind(null, a.id)} className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <Selector etiqueta="Que tal" name="valoracion" defaultValue={a.valoracion ? String(a.valoracion) : ''}>
                              <option value="">Sin valorar</option>
                              <option value="5">★★★★★ para repetir</option>
                              <option value="4">★★★★ muy bien</option>
                              <option value="3">★★★ bien</option>
                              <option value="2">★★ regular</option>
                              <option value="1">★ no volveria</option>
                            </Selector>
                            <Campo etiqueta="Con quien" name="con_quien" defaultValue={a.con_quien ?? ''} />
                          </div>
                          <Campo etiqueta="Que tal estuvo" name="nota" defaultValue={a.nota ?? ''} placeholder="Lo que quieras acordarte" />
                          <Boton type="submit" variante="secundario" className="w-full">Guardar</Boton>
                        </form>
                      )}

                      <div className="flex flex-wrap gap-3 pt-1 text-xs">
                        {a.estado === 'hecho' && (
                          <form action={devolverAPendiente.bind(null, a.id)}>
                            <button type="submit" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                              <Undo2 size={13} /> Volver a pendiente
                            </button>
                          </form>
                        )}
                        {a.estado === 'pendiente' && (
                          <form action={descartarOcio.bind(null, a.id)}>
                            <button type="submit" className="text-muted-foreground hover:text-foreground">Ya no me apetece</button>
                          </form>
                        )}
                        <form action={borrarOcio.bind(null, a.id)}>
                          <button type="submit" className="flex items-center gap-1 text-muted-foreground hover:text-destructive">
                            <Trash2 size={13} /> Borrar
                          </button>
                        </form>
                      </div>
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Apuntar algo</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">
          Con el titulo basta. Lo demas puedes rellenarlo luego, o nunca.
        </p>
        <form action={anotarOcio} className="space-y-3">
          <Campo etiqueta="Que es" name="titulo" required placeholder="Cenar en Casa Paco" />
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Que tipo" name="categoria" defaultValue={cat ?? 'actividad'}>
              {CATEGORIAS_OCIO.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
              ))}
            </Selector>
            <Campo etiqueta="Cuanto dura (min)" name="minutos" type="number" inputMode="numeric" placeholder="120" ayuda="Opcional" />
          </div>
          <details>
            <summary className="cursor-pointer text-sm text-primary marker:content-['']">Añadir mas detalles</summary>
            <div className="mt-2 space-y-3">
              <Campo etiqueta="Enlace" name="enlace" placeholder="https://…" />
              <div className="grid grid-cols-2 gap-3">
                <Campo etiqueta="Donde" name="lugar" placeholder="Gijon" />
                <Campo etiqueta="Con quien" name="con_quien" placeholder="Isa" />
              </div>
              <Campo etiqueta="Nota" name="nota" placeholder="Me lo recomendo Javi" />
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" name="ya_hecho" value="si" className="h-4 w-4 rounded border-input" />
                Esto ya lo he hecho
              </label>
            </div>
          </details>
          <Boton type="submit" className="w-full">Apuntar</Boton>
        </form>
      </Tarjeta>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Tambien puedes decirselo al <Link href="/app/coach" className="text-primary underline">coach</Link>:
        &ldquo;apunta que quiero ir a la ruta del Cares&rdquo; o &ldquo;ayer vimos Dune, muy buena&rdquo;.
      </p>
    </main>
  );
}
