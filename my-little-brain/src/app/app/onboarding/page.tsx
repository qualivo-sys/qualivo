import { redirect } from 'next/navigation';
import { terminarAlta } from '@/app/app/acciones';
import { Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import ChatCoach from '@/components/chat-coach';
import { hayClaveIA } from '@/lib/ia/cliente';
import { sesionRequerida } from '@/lib/sesion';
import type { MensajeChat } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

export default async function PaginaAlta({ searchParams }: { searchParams: { faltan?: string } }) {
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

      <Tarjeta className="mt-6">
        <TituloTarjeta>¿Prefieres rellenarlo a mano? Un minuto</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">
          Con esto te genero el plan y abro la app. Lo que ya le hayas contado al coach se conserva; aqui solo hace falta lo que falte.
        </p>
        {searchParams?.faltan && (
          <p className="mb-3 text-sm text-destructive">Faltan datos: revisa sexo, edad, altura, objetivo, nivel, dias y material.</p>
        )}
        <form action={terminarAlta} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Sexo" name="sexo" defaultValue={perfil.sexo ?? ''} required>
              <option value="">Elige</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
            </Selector>
            <Campo etiqueta="Edad" name="edad" type="number" inputMode="numeric" defaultValue={perfil.edad ?? ''} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Altura (cm)" name="altura_cm" type="number" inputMode="numeric" defaultValue={perfil.altura_cm ?? ''} required />
            <Campo etiqueta="Peso (kg)" name="peso_kg" type="number" step="0.1" inputMode="decimal" />
          </div>
          <Selector etiqueta="Objetivo" name="objetivo" defaultValue={perfil.objetivo ?? ''} required>
            <option value="">Elige</option>
            <option value="perder_grasa">Perder grasa</option>
            <option value="recomposicion">Perder grasa y ganar musculo</option>
            <option value="ganar_musculo">Ganar musculo</option>
            <option value="fuerza">Ganar fuerza</option>
            <option value="rendimiento">Rendimiento deportivo</option>
            <option value="energia">Mas energia y salud</option>
            <option value="salud_mental">Cabeza y bienestar</option>
          </Selector>
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Experiencia" name="nivel" defaultValue={perfil.nivel ?? ''} required>
              <option value="">Elige</option>
              <option value="principiante">Empiezo (menos de 1 año)</option>
              <option value="intermedio">Llevo 1-3 años</option>
              <option value="avanzado">Mas de 3 años</option>
            </Selector>
            <Campo etiqueta="Dias por semana" name="dias_semana" type="number" inputMode="numeric" min={1} max={7} defaultValue={perfil.dias_semana ?? 3} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Material" name="entorno" defaultValue={perfil.entorno ?? ''} required>
              <option value="">Elige</option>
              <option value="gimnasio">Gimnasio</option>
              <option value="casa_mancuernas">Casa con mancuernas</option>
              <option value="casa_sin_material">Casa sin material</option>
            </Selector>
            <Selector etiqueta="Actividad diaria" name="actividad" defaultValue={perfil.actividad ?? 'ligera'}>
              <option value="sedentario">Sentado casi todo el dia</option>
              <option value="ligera">Ligera</option>
              <option value="moderada">Moderada</option>
              <option value="alta">Alta (trabajo fisico)</option>
            </Selector>
          </div>
          <Boton type="submit" className="w-full">Generar mi plan y entrar</Boton>
        </form>
      </Tarjeta>
    </main>
  );
}
