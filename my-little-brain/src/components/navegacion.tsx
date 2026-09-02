'use client';

import { Activity, Brain, CalendarCheck, Dumbbell, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const SECCIONES = [
  { href: '/app', etiqueta: 'Hoy', Icono: Brain },
  { href: '/app/coach', etiqueta: 'Coach', Icono: MessageCircle },
  { href: '/app/entreno', etiqueta: 'Entreno', Icono: Dumbbell },
  { href: '/app/cuerpo', etiqueta: 'Cuerpo', Icono: Activity },
  { href: '/app/semana', etiqueta: 'Semana', Icono: CalendarCheck },
];

export default function Navegacion() {
  const ruta = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur">
      <div className="mx-auto grid max-w-2xl grid-cols-5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {SECCIONES.map(({ href, etiqueta, Icono }) => {
          const activo = href === '/app' ? ruta === '/app' : ruta.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] transition-colors',
                activo ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <Icono size={20} strokeWidth={activo ? 2.4 : 1.8} />
              {etiqueta}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
