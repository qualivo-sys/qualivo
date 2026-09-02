import { Settings } from 'lucide-react';
import Link from 'next/link';
import Navegacion from '@/components/navegacion';
import { Insignia } from '@/components/ui/base';
import { sesionRequerida } from '@/lib/sesion';

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  const { perfil } = await sesionRequerida({ permitirSinAlta: true });

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
          <Link href="/app/ajustes" aria-label="Ajustes" className="text-muted-foreground hover:text-foreground">
            <Settings size={20} />
          </Link>
        </div>
      </header>

      {children}

      {perfil.onboarding && <Navegacion />}
    </div>
  );
}
