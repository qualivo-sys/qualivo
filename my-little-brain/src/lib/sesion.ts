import { redirect } from 'next/navigation';
import { cargarPerfil } from './datos';
import { clienteServidor, hayConfiguracionSupabase } from './supabase/servidor';
import type { Perfil } from './tipos';

/**
 * Sesion + perfil para las paginas privadas. Si falta el alta, lleva al onboarding
 * (salvo que la propia pagina sea el onboarding).
 */
export async function sesionRequerida(opciones: { permitirSinAlta?: boolean } = {}) {
  if (!hayConfiguracionSupabase()) redirect('/entrar');
  const supabase = clienteServidor();
  const { data } = await supabase.auth.getUser();
  const usuario = data.user;
  if (!usuario) redirect('/entrar');

  let perfil: Perfil | null = await cargarPerfil(supabase, usuario.id);

  // El trigger de Supabase crea el perfil al registrarse; si algo fallo, lo creamos aqui.
  if (!perfil) {
    await supabase.from('perfiles').insert({
      id: usuario.id,
      email: usuario.email,
      nombre: (usuario.user_metadata?.nombre as string) ?? usuario.email?.split('@')[0] ?? null,
    });
    perfil = await cargarPerfil(supabase, usuario.id);
  }
  if (!perfil) redirect('/entrar');

  if (!perfil.onboarding && !opciones.permitirSinAlta) redirect('/app/onboarding');

  return { supabase, usuario, perfil };
}
