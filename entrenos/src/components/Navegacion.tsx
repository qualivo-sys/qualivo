'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SECCIONES = [
  { href: '', etiqueta: 'Hoy', icono: '🏠' },
  { href: '/plan', etiqueta: 'Plan', icono: '📋' },
  { href: '/medidas', etiqueta: 'Medidas', icono: '⚖️' },
  { href: '/progreso', etiqueta: 'Progreso', icono: '📈' },
  { href: '/perfil', etiqueta: 'Perfil', icono: '⚙️' },
];

export default function Navegacion({ perfilId }: { perfilId: string }) {
  const ruta = usePathname();
  const base = `/${perfilId}`;

  return (
    <nav className="nav">
      {SECCIONES.map((s) => {
        const destino = `${base}${s.href}`;
        const activo = s.href === '' ? ruta === base : ruta.startsWith(destino);
        return (
          <Link key={s.href} href={destino} className={activo ? 'nav-item activo' : 'nav-item'}>
            <span aria-hidden>{s.icono}</span>
            {s.etiqueta}
          </Link>
        );
      })}
    </nav>
  );
}
