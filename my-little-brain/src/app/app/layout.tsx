import { Settings } from 'lucide-react';
import Link from 'next/link';
import Navegacion from '@/components/navegacion';
import RefrescoAlVolver from '@/components/refresco';
import { BotonTema } from '@/components/tema';
import { Insignia } from '@/components/ui/base';
import { comprobarEsquema } from '@/lib/esquema';
import { sesionRequerida } from '@/lib/sesion';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const { supabase, perfil } = await sesionRequerida({ permitirSinAlta: true });
  const faltan = await comprobarEsquema(supabase);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-5">
      <header className="mb-5 flex items-center justify-between">
        <Link href="/app" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/20 text-lg">🧠</span>
          <span>
            <span className="block text-sm font-semibold leading-tight">My Little Brain</span>
            <span className="block text-xs text-muted-foreground">{perfil.nombre ?? perfil.email}</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {perfil.plan !== 'free' && <Insignia tono="marca">{perfil.plan}</Insignia>}
          <BotonTema />
          <Link href="/app/ajustes" aria-label="Ajustes" className="text-muted-foreground hover:text-foreground">
            <Settings size={20} />
          </Link>
        </div>
      </header>

      {faltan.length > 0 && (
        <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          <strong>La base de datos necesita actualizarse.</strong> Vuelve a ejecutar{' '}
          <code>supabase/schema.sql</code> en el SQL Editor de Supabase (es idempotente). Falta:{' '}
          {faltan.join(', ')}.
        </p>
      )}

      {children}

      {perfil.onboarding && <Navegacion />}
      <RefrescoAlVolver />
    </div>
  );
}
