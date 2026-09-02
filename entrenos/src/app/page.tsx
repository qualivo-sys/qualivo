import Link from 'next/link';
import { PERFILES } from '@/lib/perfiles';

export default function Portada() {
  return (
    <main className="portada">
      <h1>Entrenos</h1>
      <p>Tus medidas, tu plan y cada serie que levantas. Elige quien entrena hoy.</p>

      <div className="perfiles">
        {PERFILES.map((p) => (
          <Link key={p.id} href={`/${p.id}`} className="perfil-boton">
            <span className="avatar">{p.nombre.charAt(0).toUpperCase()}</span>
            <span>
              <strong>{p.nombre}</strong>
              <small>Entrar en mi espacio</small>
            </span>
          </Link>
        ))}
      </div>

      <p className="pie-legal">
        Los planes y las calorias son estimaciones basadas en formulas estandar
        (Mifflin-St Jeor, US Navy). No sustituyen el criterio de un medico o un
        dietista, sobre todo si hay patologias, embarazo o lesiones.
      </p>
    </main>
  );
}
