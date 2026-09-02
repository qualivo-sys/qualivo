'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Boton, Campo, Tarjeta } from '@/components/ui/base';
import { clienteNavegador } from '@/lib/supabase/cliente';

export default function PaginaClave() {
  const router = useRouter();
  const [clave, setClave] = useState('');
  const [repetir, setRepetir] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (clave !== repetir) {
      setError('Las dos contraseñas no coinciden.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      const { error: fallo } = await clienteNavegador().auth.updateUser({ password: clave });
      if (fallo) throw fallo;
      router.push('/app/ajustes?clave=ok');
      router.refresh();
    } catch (fallo) {
      setError((fallo as Error).message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="space-y-4">
      <h1>Nueva contraseña</h1>
      <Tarjeta>
        <form onSubmit={guardar} className="space-y-3">
          <Campo
            etiqueta="Contraseña nueva" type="password" required minLength={8} autoComplete="new-password"
            value={clave} onChange={(e) => setClave(e.target.value)} ayuda="Minimo 8 caracteres."
          />
          <Campo
            etiqueta="Repitela" type="password" required minLength={8} autoComplete="new-password"
            value={repetir} onChange={(e) => setRepetir(e.target.value)}
          />
          {error && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
          <Boton type="submit" className="w-full" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar contraseña'}
          </Boton>
        </form>
      </Tarjeta>
    </main>
  );
}
