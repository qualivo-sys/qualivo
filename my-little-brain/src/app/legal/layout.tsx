import Link from 'next/link';
import { LEGAL, legalConfigurado } from '@/lib/legal';

export default function LayoutLegal({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-5 pb-16 pt-10">
      <Link href="/" className="text-sm text-muted-foreground">← My Little Brain</Link>
      {!legalConfigurado() && (
        <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300">
          Faltan los datos del responsable (variables <code>NEXT_PUBLIC_LEGAL_*</code>). Este aviso
          desaparece al configurarlas.
        </p>
      )}
      <article className="prose-legal mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-foreground [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-4 [&_li]:list-disc [&_strong]:text-foreground">
        {children}
      </article>
      <p className="mt-10 text-xs text-muted-foreground">
        Ultima actualizacion: {LEGAL.actualizado}. Contacto: {LEGAL.email}.
      </p>
    </main>
  );
}
