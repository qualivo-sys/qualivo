'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Boton, Campo, Tarjeta } from '@/components/ui/base';
import { clienteNavegador } from '@/lib/supabase/cliente';

export default function PaginaRecuperar() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const { error: fallo } = await clienteNavegador().auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?siguiente=/app/ajustes/clave`,
      });
      if (fallo) throw fallo;
      setEnviado(true);
    } catch (fallo) {
      setError((fallo as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5">
      <Link href="/" className="text-center">
        <h1 className="text-2xl font-semibold">My Little Brain</h1>
      </Link>
      <Tarjeta className="w-full max-w-sm">
        <h2 className="mb-1">Recuperar contraseña</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Te mandamos un enlace al correo para que pongas una nueva.
        </p>
        {enviado ? (
          <p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">
            Si ese email tiene cuenta, el enlace ya va de camino. Mira tambien en spam.
          </p>
        ) : (
          <form onSubmit={enviar} className="space-y-3">
            <Campo
              etiqueta="Email" type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
            <Boton type="submit" className="w-full" disabled={enviando}>
              {enviando ? 'Enviando…' : 'Enviar enlace'}
            </Boton>
          </form>
        )}
        <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/entrar" className="text-primary underline">Volver a entrar</Link>
        </p>
      </Tarjeta>
    </main>
  );
}
