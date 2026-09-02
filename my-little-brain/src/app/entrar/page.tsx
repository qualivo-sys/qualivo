'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Boton, Campo, Tarjeta } from '@/components/ui/base';
import { clienteNavegador } from '@/lib/supabase/cliente';

function Formulario() {
  const router = useRouter();
  const parametros = useSearchParams();
  const [modo, setModo] = useState<'entrar' | 'registro'>('entrar');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    setError('');
    setAviso('');
    const supabase = clienteNavegador();

    try {
      if (modo === 'registro') {
        const { data, error: fallo } = await supabase.auth.signUp({
          email,
          password: clave,
          options: {
            data: { nombre },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (fallo) throw fallo;
        if (!data.session) {
          setAviso('Te hemos enviado un correo para confirmar la cuenta. Abrelo y vuelve aqui.');
          return;
        }
      } else {
        const { error: fallo } = await supabase.auth.signInWithPassword({ email, password: clave });
        if (fallo) throw fallo;
      }
      router.push(parametros.get('siguiente') || '/app');
      router.refresh();
    } catch (fallo) {
      setError(traducir((fallo as Error).message));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Tarjeta className="w-full max-w-sm">
      <div className="mb-4 flex rounded-lg bg-muted p-1 text-sm">
        {(['entrar', 'registro'] as const).map((opcion) => (
          <button
            key={opcion}
            type="button"
            onClick={() => setModo(opcion)}
            className={`flex-1 rounded-md py-2 transition-colors ${
              modo === opcion ? 'bg-card text-foreground' : 'text-muted-foreground'
            }`}
          >
            {opcion === 'entrar' ? 'Entrar' : 'Crear cuenta'}
          </button>
        ))}
      </div>

      <form onSubmit={enviar} className="space-y-3">
        {modo === 'registro' && (
          <Campo etiqueta="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} autoComplete="given-name" />
        )}
        <Campo
          etiqueta="Email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} autoComplete="email"
        />
        <Campo
          etiqueta="Contraseña" type="password" required minLength={8} value={clave}
          onChange={(e) => setClave(e.target.value)}
          autoComplete={modo === 'registro' ? 'new-password' : 'current-password'}
          ayuda={modo === 'registro' ? 'Minimo 8 caracteres.' : undefined}
        />
        {error && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
        {aviso && <p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">{aviso}</p>}
        <Boton type="submit" className="w-full" disabled={enviando}>
          {enviando ? 'Un momento…' : modo === 'entrar' ? 'Entrar' : 'Crear mi cuenta'}
        </Boton>
      </form>
    </Tarjeta>
  );
}

function traducir(mensaje: string): string {
  if (/invalid login credentials/i.test(mensaje)) return 'Email o contraseña incorrectos.';
  if (/already registered/i.test(mensaje)) return 'Ya existe una cuenta con ese email.';
  if (/password should be/i.test(mensaje)) return 'La contraseña es demasiado corta.';
  return mensaje;
}

export default function PaginaEntrar() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-5">
      <Link href="/" className="text-center">
        <h1 className="text-2xl font-semibold">My Little Brain</h1>
        <p className="text-sm text-muted-foreground">Tu sistema operativo personal</p>
      </Link>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando…</p>}>
        <Formulario />
      </Suspense>
    </main>
  );
}
