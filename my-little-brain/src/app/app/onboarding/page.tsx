import { redirect } from 'next/navigation';
import ChatCoach from '@/components/chat-coach';
import { hayClaveIA } from '@/lib/ia/cliente';
import { sesionRequerida } from '@/lib/sesion';
import type { MensajeChat } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function PaginaAlta() {
  const { supabase, usuario, perfil } = await sesionRequerida({ permitirSinAlta: true });
  if (perfil.onboarding) redirect('/app');

  const { data } = await supabase
    .from('chat_mensajes')
    .select('*')
    .eq('user_id', usuario.id)
    .order('creado', { ascending: false })
    .limit(30);

  const historial = ((data ?? []) as MensajeChat[]).reverse();

  return (
    <main>
      <h1>Vamos a conocernos</h1>
      <p className="mb-4 mt-1 text-sm text-muted-foreground">
        Sin formularios kilometricos: contestame unas preguntas y te monto el plan de entreno,
        las calorias y tu panel.
      </p>

      {!hayClaveIA() ? (
        <div className="rounded-[var(--radius)] border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p className="mb-2 font-semibold text-amber-700 dark:text-amber-300">Falta la clave de la IA</p>
          <p className="text-muted-foreground">
            Configura <code>ANTHROPIC_API_KEY</code> en el servidor para hacer el alta por chat.
            Mientras tanto puedes rellenar tus datos a mano en{' '}
            <a href="/app/ajustes" className="text-primary underline">
              Ajustes
            </a>
            .
          </p>
        </div>
      ) : (
        <ChatCoach
          historial={historial}
          modoAlta
          saludo="Hola, soy tu coach. Para montarte el sistema necesito conocerte un poco. Empecemos por lo importante: ¿que quieres conseguir en los proximos 3 meses, y por que ahora?"
        />
      )}
    </main>
  );
}
