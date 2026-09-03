import Link from 'next/link';
import ImportarPlan from '@/components/importar-plan';
import { hayClaveIA } from '@/lib/ia/cliente';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function PaginaImportar() {
  await sesionRequerida();
  return (
    <main className="space-y-4">
      <div>
        <h1>Importar un plan</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Si ya tienes un entreno o una dieta hecha por un entrenador o nutricionista, subela y la app la usa
          tal cual. Si no, la app te la hace en{' '}
          <Link href="/app/entreno" className="text-primary underline">Entreno</Link> y{' '}
          <Link href="/app/cuerpo" className="text-primary underline">Cuerpo</Link>.
        </p>
      </div>
      {hayClaveIA() ? (
        <ImportarPlan />
      ) : (
        <p className="text-sm text-destructive">Falta la clave de la IA para leer documentos.</p>
      )}
    </main>
  );
}
