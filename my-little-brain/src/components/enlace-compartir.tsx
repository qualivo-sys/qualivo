'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useState } from 'react';
import { Boton } from '@/components/ui/base';

/**
 * El enlace, listo para mandarlo. Usa el compartir del movil si lo hay, y si
 * no copia al portapapeles. Lo importante es que el enlace se vea entero:
 * tiene que quedar claro que es una direccion publica.
 */
export default function EnlaceCompartir({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);

  const compartir = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url, title: 'Mi lista de ocio' });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Cancelar el compartir del movil no es un error que haya que enseñar.
    }
  };

  return (
    <div className="space-y-2">
      <div className="break-all rounded-lg bg-muted/60 p-2.5 text-xs text-muted-foreground">{url}</div>
      <Boton type="button" variante="secundario" className="w-full" onClick={compartir}>
        {copiado ? <><Check size={16} className="mr-1.5" /> Copiado</> : <><Share2 size={16} className="mr-1.5" /> Compartir el enlace</>}
      </Boton>
    </div>
  );
}
