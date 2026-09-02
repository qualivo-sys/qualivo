import Link from 'next/link';
import { Boton } from '@/components/ui/base';

export default function NoEncontrado() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-5xl">🧠</p>
      <h1 className="text-xl font-semibold">Esta pagina no existe</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        O la has escrito a mano, o la hemos movido. Desde el panel llegas a todo.
      </p>
      <Link href="/app">
        <Boton>Ir al panel</Boton>
      </Link>
    </main>
  );
}
