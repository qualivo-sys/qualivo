import Link from 'next/link';
import { notFound } from 'next/navigation';
import EstadoGuardado from '@/components/EstadoGuardado';
import Navegacion from '@/components/Navegacion';
import { ProveedorEstado } from '@/lib/estado-cliente';
import { PERFILES, buscarPerfil } from '@/lib/perfiles';

export function generateStaticParams() {
  return PERFILES.map((p) => ({ perfil: p.id }));
}

export default function LayoutPerfil({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { perfil: string };
}) {
  const perfil = buscarPerfil(params.perfil);
  if (!perfil) notFound();

  return (
    <ProveedorEstado perfilId={perfil.id} nombre={perfil.nombre}>
      <div className="app">
        <header className="cabecera">
          <div className="quien">
            <span className="avatar">{perfil.nombre.charAt(0).toUpperCase()}</span>
            <div>
              <strong>{perfil.nombre}</strong>
              <EstadoGuardado />
            </div>
          </div>
          <Link href="/" className="cambiar">Cambiar</Link>
        </header>
        {children}
      </div>
      <Navegacion perfilId={perfil.id} />
    </ProveedorEstado>
  );
}
