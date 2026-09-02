'use client';

import { useEffect } from 'react';
import { Boton, Tarjeta } from '@/components/ui/base';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[app] error en la pagina', error);
  }, [error]);

  return (
    <Tarjeta className="border-destructive/40">
      <h1 className="mb-2 text-lg">Algo se ha roto por aqui</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        No has perdido nada: lo que ya estaba registrado sigue guardado. Prueba a recargar.
      </p>
      <div className="flex gap-2">
        <Boton onClick={reset}>Reintentar</Boton>
        <a href="/app">
          <Boton variante="contorno">Volver al panel</Boton>
        </a>
      </div>
    </Tarjeta>
  );
}
