import Link from 'next/link';
import ChatCoach from '@/components/chat-coach';
import { Boton, Insignia } from '@/components/ui/base';
import { fechaCorta } from '@/lib/fechas';
import { hayClaveIA } from '@/lib/ia/cliente';
import { cuota } from '@/lib/ia/limites';
import { sesionRequerida } from '@/lib/sesion';
import type { MensajeChat } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

const CHECKINS: Record<string, string> = {
  manana: 'Check-in de la manana.',
  noche: 'Check-in de la noche.',
};

const POR_TANDA = 40;

export default async function PaginaCoach({
  searchParams,
}: {
  searchParams: { checkin?: string; ver?: string; buscar?: string };
}) {
  const { supabase, usuario, perfil } = await sesionRequerida();

  const buscar = (searchParams.buscar ?? '').trim().slice(0, 80);
  const pedidos = Number(searchParams.ver);
  const cuantos = Number.isFinite(pedidos) ? Math.min(400, Math.max(POR_TANDA, Math.round(pedidos))) : POR_TANDA;

  let consulta = supabase
    .from('chat_mensajes')
    .select('*', { count: 'exact' })
    .eq('user_id', usuario.id)
    .order('creado', { ascending: false });
  // Buscar es lo que de verdad sirve cuando lo que quieres es UN mensaje
  // concreto de hace tres semanas, no bajar cargando tandas de cuarenta.
  if (buscar) consulta = consulta.ilike('texto', `%${buscar}%`);

  const { data, count } = await consulta.limit(cuantos);

  const encontrados = (data ?? []) as MensajeChat[];
  const historial = buscar ? encontrados : [...encontrados].reverse();
  const total = count ?? encontrados.length;
  const hayMas = encontrados.length >= cuantos && total > cuantos;
  const estado = await cuota(supabase, usuario.id, perfil.plan);

  return (
    <main>
      <div className="mb-3 flex items-center justify-between">
        <h1>Coach</h1>
        <Insignia tono={estado.quedan < 5 ? 'aviso' : 'neutro'}>
          {estado.quedan} mensajes este mes
        </Insignia>
      </div>

      {!hayClaveIA() && (
        <p className="mb-3 rounded-lg bg-amber-500/15 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          Falta configurar <code>ANTHROPIC_API_KEY</code> en el servidor: el coach no puede
          responder todavia. El resto de la app funciona.
        </p>
      )}

      {/* Buscar y tirar atras: los mensajes estan todos, solo hay que llegar. */}
      <details className="mb-3" open={Boolean(buscar)}>
        <summary className="cursor-pointer text-sm text-primary marker:content-['']">
          Buscar en el historial{total > 0 && ` · ${total} ${total === 1 ? 'mensaje' : 'mensajes'} guardados`}
        </summary>
        <form method="get" className="mt-2 flex gap-2">
          <input
            type="search" name="buscar" defaultValue={buscar} placeholder="Que dije de la rodilla, del cliente A…"
            className="h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-base outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
          />
          <Boton type="submit" variante="secundario">Buscar</Boton>
        </form>
        {buscar && (
          <div className="mt-3">
            <p className="mb-2 text-xs text-muted-foreground">
              {historial.length === 0
                ? `Nada con "${buscar}".`
                : `${historial.length} ${historial.length === 1 ? 'mensaje' : 'mensajes'} con "${buscar}", del mas reciente al mas antiguo.`}
            </p>
            <ul className="space-y-2">
              {historial.map((m) => (
                <li key={m.id} className="rounded-lg bg-muted/40 p-3 text-sm">
                  <div className="mb-1 text-xs text-muted-foreground">
                    {m.rol === 'user' ? 'Tu' : 'Coach'} · {fechaCorta(m.creado.slice(0, 10))}
                  </div>
                  {m.texto}
                </li>
              ))}
            </ul>
            <Link href="/app/coach" className="mt-3 inline-block text-sm text-primary underline">
              Volver a la conversacion
            </Link>
          </div>
        )}
      </details>

      {!buscar && hayMas && (
        <Link
          href={`/app/coach?ver=${cuantos + POR_TANDA}`}
          className="mb-3 block rounded-lg border border-dashed border-border py-2 text-center text-sm text-primary"
        >
          Ver mensajes mas antiguos ({total - cuantos} mas)
        </Link>
      )}

      {!buscar && (
      <ChatCoach
        historial={historial}
        mensajeInicial={searchParams.checkin ? CHECKINS[searchParams.checkin] : undefined}
        saludo="Cuentame lo que has hecho y yo me encargo del resto: comidas, entrenos, horas de foco, sueno, animo. Tambien puedes mandarme una foto de la comida."
      />
      )}
    </main>
  );
}
