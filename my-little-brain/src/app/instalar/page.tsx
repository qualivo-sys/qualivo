import Link from 'next/link';
import CompartirApp from '@/components/compartir-app';
import { Boton, Tarjeta, TituloTarjeta } from '@/components/ui/base';

export const metadata = { title: 'Instalar My Little Brain' };

/** Pagina publica para pasar a un amigo: el enlace y como ponerlo en la pantalla de inicio. */
export default function PaginaInstalar() {
  return (
    <main className="mx-auto max-w-lg space-y-4 p-4 pb-12">
      <div className="pt-4 text-center">
        <p className="text-4xl">🧠</p>
        <h1 className="mt-2">My Little Brain</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tu coach de entreno, comida, habitos y cabeza. Funciona en el navegador y se instala como una app en un minuto.
        </p>
      </div>

      <Link href="/entrar?modo=registro" className="block">
        <Boton tamano="lg" className="w-full">Crear mi cuenta gratis</Boton>
      </Link>

      <Tarjeta>
        <TituloTarjeta>1 · Ponla en la pantalla de inicio</TituloTarjeta>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">iPhone (Safari)</p>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-muted-foreground">
              <li>Abre <span className="text-foreground">my-little-brain.vercel.app</span> en Safari (no vale desde Instagram o WhatsApp: toca &ldquo;abrir en Safari&rdquo;).</li>
              <li>Toca el boton de compartir, el cuadrado con la flecha hacia arriba.</li>
              <li>Baja y toca <span className="text-foreground">Anadir a pantalla de inicio</span>, y luego Anadir.</li>
            </ol>
          </div>
          <div>
            <p className="font-medium">Android (Chrome)</p>
            <ol className="mt-1 list-decimal space-y-0.5 pl-5 text-muted-foreground">
              <li>Abre el enlace en Chrome.</li>
              <li>Menu de los tres puntos, arriba a la derecha.</li>
              <li>Toca <span className="text-foreground">Instalar aplicacion</span> o <span className="text-foreground">Anadir a pantalla de inicio</span>.</li>
            </ol>
          </div>
          <p className="text-xs text-muted-foreground">
            Desde el icono se abre a pantalla completa, guarda la sesion y puede mandarte avisos. Si ya te has registrado en el navegador, no hace falta volver a hacerlo.
          </p>
        </div>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>2 · Los primeros cinco minutos</TituloTarjeta>
        <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Crea la cuenta y contesta el alta: objetivo, dias que puedes entrenar, material y molestias.</li>
          <li>Te genera el plan de entreno y tus calorias y macros. Si ya tienes dieta o rutina de un especialista, la subes en Importar.</li>
          <li>Registra el entreno serie a serie; la app te dice el peso de la siguiente vez.</li>
          <li>Apunta lo que comes escribiendolo (&ldquo;200 g pollo, 150 arroz&rdquo;) o contandoselo al coach.</li>
          <li>Check-in de manana y de noche, diez segundos cada uno. El domingo tienes tu revision semanal.</li>
        </ol>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Pasaselo a alguien</TituloTarjeta>
        <CompartirApp variante="secundario" />
        <p className="mt-2 text-center text-xs text-muted-foreground">O copia el enlace: my-little-brain.vercel.app/instalar</p>
      </Tarjeta>

      <p className="text-center text-xs text-muted-foreground">
        <Link href="/legal/privacidad" className="underline">Privacidad</Link> · <Link href="/" className="underline">Inicio</Link>
      </p>
    </main>
  );
}
