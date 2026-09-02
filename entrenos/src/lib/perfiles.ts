/** Perfiles de la app. Se pueden cambiar con NEXT_PUBLIC_PERFILES="id:Nombre,id2:Nombre2". */

export interface PerfilBase {
  id: string;
  nombre: string;
}

const POR_DEFECTO: PerfilBase[] = [
  { id: 'maikel', nombre: 'Maikel' },
  { id: 'isa', nombre: 'Isa' },
];

export const PERFILES: PerfilBase[] = (() => {
  const crudo = process.env.NEXT_PUBLIC_PERFILES;
  if (!crudo) return POR_DEFECTO;
  const lista = crudo
    .split(',')
    .map((par) => par.trim())
    .filter(Boolean)
    .map((par) => {
      const [id, ...resto] = par.split(':');
      const slug = (id || '').trim().toLowerCase();
      if (!slug) return null;
      return { id: slug, nombre: (resto.join(':').trim() || slug) };
    })
    .filter((p): p is PerfilBase => p !== null);
  return lista.length ? lista : POR_DEFECTO;
})();

export function buscarPerfil(id: string): PerfilBase | undefined {
  return PERFILES.find((p) => p.id === id.toLowerCase());
}
