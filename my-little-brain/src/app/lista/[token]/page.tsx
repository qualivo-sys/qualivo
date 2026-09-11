import type { Metadata } from 'next';
import Link from 'next/link';
import { Insignia, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { fechaCorta } from '@/lib/fechas';
import { CATEGORIAS_OCIO, categoriaOcio } from '@/lib/motor/ocio';
import { clienteServidor } from '@/lib/supabase/servidor';
import type { ApuntePublico } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

// Un enlace compartido no tiene por que acabar en Google.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ListaCompartida({ params }: { params: { token: string } }) {
  const supabase = clienteServidor();

  // Por funcion, no por tabla: es la funcion la que decide que columnas salen.
  const [{ data: info }, { data: apuntes }] = await Promise.all([
    supabase.rpc('ocio_compartido_info', { p_token: params.token }),
    supabase.rpc('ocio_publico', { p_token: params.token }),
  ]);

  const cabecera = (info ?? [])[0] as { titulo: string; solo_pendientes: boolean } | undefined;
  const lista = (apuntes ?? []) as ApuntePublico[];

  if (!cabecera) {
    return (
      <main className="mx-auto max-w-2xl space-y-4 p-4">
        <h1>Esta lista ya no esta disponible</h1>
        <p className="text-sm text-muted-foreground">
          El enlace ha caducado o quien lo compartio ha dejado de compartirlo.
        </p>
        <Link href="/" className="text-sm text-primary underline">Ir a My Little Brain</Link>
      </main>
    );
  }

  const pendientes = lista.filter((a) => a.estado === 'pendiente');
  const hechas = lista.filter((a) => a.estado === 'hecho');

  const bloque = (titulo: string, items: ApuntePublico[]) =>
    items.length > 0 && (
      <Tarjeta>
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <TituloTarjeta className="mb-0">{titulo}</TituloTarjeta>
          <span className="text-xs text-muted-foreground tabular-nums">{items.length}</span>
        </div>
        <ul className="divide-y divide-border">
          {items.map((a, i) => {
            const c = categoriaOcio(a.categoria);
            return (
              <li key={`${a.titulo}-${i}`} className="flex items-start gap-3 py-2">
                <span className="text-base leading-6">{c.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm">
                    {a.enlace ? (
                      <a href={a.enlace} target="_blank" rel="noreferrer noopener nofollow" className="text-primary underline">
                        {a.titulo}
                      </a>
                    ) : (
                      a.titulo
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.nombre}
                    {a.lugar && ` · ${a.lugar}`}
                    {a.minutos && ` · ${a.minutos < 60 ? `${a.minutos} min` : `${Math.round(a.minutos / 60)} h`}`}
                    {a.fecha_hecho && ` · ${fechaCorta(a.fecha_hecho)}`}
                    {a.valoracion && ` · ${'★'.repeat(a.valoracion)}`}
                  </div>
                  {a.nota && <p className="mt-0.5 text-xs">{a.nota}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </Tarjeta>
    );

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-4 pb-10">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <Insignia>compartida contigo</Insignia>
        </div>
        <h1>{cabecera.titulo}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lista.length === 0
            ? 'De momento no hay nada en esta lista.'
            : `${lista.length} ${lista.length === 1 ? 'cosa' : 'cosas'}${cabecera.solo_pendientes ? ' por hacer' : ''}.`}
        </p>
      </div>

      {bloque('Por hacer', pendientes)}
      {!cabecera.solo_pendientes && bloque('Ya hechas', hechas)}

      <p className="pt-2 text-center text-xs text-muted-foreground">
        Hecha con <Link href="/" className="text-primary underline">My Little Brain</Link>.
        {' '}Quien la comparte puede quitar el enlace cuando quiera.
      </p>
    </main>
  );
}
