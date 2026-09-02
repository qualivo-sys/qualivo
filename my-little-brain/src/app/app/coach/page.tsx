import ChatCoach from '@/components/chat-coach';
import { Insignia } from '@/components/ui/base';
import { hayClaveIA } from '@/lib/ia/cliente';
import { cuota } from '@/lib/ia/limites';
import { sesionRequerida } from '@/lib/sesion';
import type { MensajeChat } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

const CHECKINS: Record<string, string> = {
  manana: 'Check-in de la manana.',
  noche: 'Check-in de la noche.',
};

export default async function PaginaCoach({ searchParams }: { searchParams: { checkin?: string } }) {
  const { supabase, usuario, perfil } = await sesionRequerida();

  const { data } = await supabase
    .from('chat_mensajes')
    .select('*')
    .eq('user_id', usuario.id)
    .order('creado', { ascending: false })
    .limit(40);

  const historial = ((data ?? []) as MensajeChat[]).reverse();
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
        <p className="mb-3 rounded-lg bg-amber-500/15 px-3 py-2 text-sm text-amber-300">
          Falta configurar <code>ANTHROPIC_API_KEY</code> en el servidor: el coach no puede
          responder todavia. El resto de la app funciona.
        </p>
      )}

      <ChatCoach
        historial={historial}
        mensajeInicial={searchParams.checkin ? CHECKINS[searchParams.checkin] : undefined}
        saludo="Cuentame lo que has hecho y yo me encargo del resto: comidas, entrenos, horas de foco, sueno, animo. Tambien puedes mandarme una foto de la comida."
      />
    </main>
  );
}
