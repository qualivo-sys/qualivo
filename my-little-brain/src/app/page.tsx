import Link from 'next/link';
import { Boton, Insignia, Tarjeta } from '@/components/ui/base';
import { LIMITE_MENSAJES } from '@/lib/ia/limites';
import { usuarioActual } from '@/lib/supabase/servidor';

const AREAS = [
  { nombre: 'Cuerpo', color: 'var(--area-cuerpo)', texto: 'Peso, medidas, grasa corporal y calorias con objetivos que se recalculan solos.' },
  { nombre: 'Entrenamiento', color: 'var(--area-fitness)', texto: 'Plan generado a tu medida y progresion de cargas sesion a sesion.' },
  { nombre: 'Foco', color: 'var(--area-foco)', texto: 'Trabajo profundo, negocio y aprendizaje. Lo que de verdad mueve tus proyectos.' },
  { nombre: 'Mente', color: 'var(--area-mente)', texto: 'Sueno, animo, energia y estres, cruzados con todo lo demas.' },
  { nombre: 'Habitos', color: 'var(--area-habitos)', texto: 'Rachas, XP y niveles. La constancia se sostiene si se ve.' },
];

const EJEMPLOS = [
  'Me he tomado una cerveza y una hamburguesa',
  'Hoy he entrenado pecho: banca 5 series de 8 con 80 kg',
  'He estudiado ingles 45 minutos',
  'He dormido fatal, unas 5 horas',
  '3 horas de trabajo profundo en el proyecto de IA',
];

export default async function Portada({ searchParams }: { searchParams: { cuenta?: string } }) {
  const usuario = await usuarioActual();

  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-14">
      {searchParams.cuenta === 'borrada' && (
        <p className="mb-6 rounded-lg bg-emerald-500/15 px-3 py-2 text-center text-sm text-emerald-700 dark:text-emerald-300">
          Cuenta borrada. Gracias por haber estado aqui.
        </p>
      )}
      <header className="text-center">
        <Insignia tono="marca">Tu sistema operativo personal</Insignia>
        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">My Little Brain</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Un entrenador, un nutricionista y un jefe de operaciones de tu vida, disponibles
          las 24 horas. Le cuentas tu dia por chat y el sistema se construye solo.
        </p>
        <div className="mx-auto mt-7 flex max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
          <Link href={usuario ? '/app' : '/entrar'} className="block">
            <Boton tamano="lg" className="w-full whitespace-nowrap sm:w-auto">{usuario ? 'Entrar en mi panel' : 'Empezar gratis'}</Boton>
          </Link>
          <Link href="#como-funciona" className="block">
            <Boton tamano="lg" variante="contorno" className="w-full whitespace-nowrap sm:w-auto">Como funciona</Boton>
          </Link>
        </div>
      </header>

      <section id="como-funciona" className="mt-14">
        <h2 className="mb-3">Sin formularios. Se lo cuentas y ya.</h2>
        <Tarjeta className="space-y-2">
          {EJEMPLOS.map((ejemplo) => (
            <div key={ejemplo} className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <span className="text-muted-foreground">tu:</span> {ejemplo}
            </div>
          ))}
          <p className="pt-2 text-sm text-muted-foreground">
            El coach estima los macros, apunta las series, suma tus horas de foco y actualiza
            todas tus metricas. Tu solo hablas.
          </p>
        </Tarjeta>
      </section>

      <section className="mt-12">
        <h2 className="mb-3">Cinco areas, un solo sistema</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {AREAS.map((area) => (
            <Tarjeta key={area.nombre}>
              <div className="mb-1.5 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: `hsl(${area.color})` }} />
                <h3 className="font-semibold">{area.nombre}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{area.texto}</p>
            </Tarjeta>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-3">La revision de los domingos</h2>
        <Tarjeta>
          <p className="text-sm italic text-muted-foreground">
            &ldquo;Esta semana perdiste 0,4 kg, entrenaste 4 veces, estudiaste ingles 2 horas y
            trabajaste 18 horas de foco profundo. Bebiste 3 dias. Tu cuello de botella no es la
            dieta: es el sueno. Duermes 5,8 h de media y tus dias de menos de 6 h tienen la mitad
            de foco. Si arreglas el sueno, arreglas las otras tres.&rdquo;
          </p>
          <p className="mt-3 text-sm">
            Eso es lo que ningun contador de calorias te dice. Los numeros los calcula la app;
            la lectura la hace tu coach.
          </p>
        </Tarjeta>
      </section>

      <section className="mt-12">
        <h2 className="mb-3">Planes</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Tarjeta>
            <h3 className="font-semibold">Gratis</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Todo el sistema: panel, plan de entreno, medidas, habitos y revision semanal.
              {' '}{LIMITE_MENSAJES.free} mensajes con el coach al mes.
            </p>
          </Tarjeta>
          <Tarjeta className="border-primary/50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Pro</h3>
              <Insignia tono="marca">recomendado</Insignia>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {LIMITE_MENSAJES.pro} mensajes al mes, fotos de comida ilimitadas y revision
              semanal automatica cada domingo.
            </p>
          </Tarjeta>
        </div>
      </section>

      <footer className="mt-14 space-y-2 text-center text-xs text-muted-foreground">
        <p>
          My Little Brain calcula estimaciones con formulas estandar (Mifflin-St Jeor, US Navy).
          No es consejo medico ni sustituye a un profesional sanitario.
        </p>
        <p>
          <Link href="/legal/privacidad" className="underline">Privacidad</Link> ·{' '}
          <Link href="/legal/terminos" className="underline">Terminos</Link>
        </p>
      </footer>
    </main>
  );
}
