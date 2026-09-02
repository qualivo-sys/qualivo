'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

function Formulario() {
  const router = useRouter();
  const parametros = useSearchParams();
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const entrar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const respuesta = await fetch('/api/acceso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      });
      if (!respuesta.ok) {
        setError('Ese codigo no es.');
        return;
      }
      router.replace(parametros.get('destino') || '/');
      router.refresh();
    } catch {
      setError('No se ha podido comprobar. Reintenta.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={entrar}>
      <div className="campo">
        <label htmlFor="codigo">Codigo de acceso</label>
        <input
          id="codigo" type="password" autoFocus autoComplete="current-password"
          value={codigo} onChange={(e) => setCodigo(e.target.value)}
        />
      </div>
      {error && <p className="aviso error">{error}</p>}
      <button className="boton" type="submit" disabled={enviando || !codigo}>
        {enviando ? 'Comprobando…' : 'Entrar'}
      </button>
    </form>
  );
}

export default function PaginaAcceso() {
  return (
    <main className="portada">
      <h1>Entrenos</h1>
      <p>Esto es privado. Mete el codigo para entrar.</p>
      <Suspense fallback={<p className="cargando">Cargando…</p>}>
        <Formulario />
      </Suspense>
    </main>
  );
}
