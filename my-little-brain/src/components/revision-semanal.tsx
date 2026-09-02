'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Boton, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import type { RevisionSemanal } from '@/lib/tipos';

export default function VistaRevision({
  inicial,
  semana,
}: {
  inicial: RevisionSemanal | null;
  semana: string;
}) {
  const [revision, setRevision] = useState<RevisionSemanal | null>(inicial);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState('');

  const generar = async () => {
    setGenerando(true);
    setError('');
    try {
      const respuesta = await fetch('/api/revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ semana }),
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        setError(datos.error ?? 'No se ha podido generar la revision.');
        return;
      }
      setRevision(datos.revision);
    } catch {
      setError('Sin conexion con el servidor.');
    } finally {
      setGenerando(false);
    }
  };

  return (
    <div className="space-y-4">
      <Boton onClick={generar} disabled={generando} variante={revision ? 'contorno' : 'primario'} className="w-full">
        {generando ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
        {revision ? 'Regenerar la revision' : 'Generar mi revision de la semana'}
      </Boton>

      {error && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}

      {revision && (
        <>
          <Tarjeta className="border-primary/40 bg-gradient-to-br from-primary/10 to-transparent">
            <p className="text-lg font-semibold">{revision.titular}</p>
            <p className="mt-2 text-sm text-muted-foreground">{revision.cuerpo}</p>
          </Tarjeta>

          <Tarjeta className="border-amber-500/40">
            <TituloTarjeta>Tu cuello de botella</TituloTarjeta>
            <p className="text-sm">{revision.cuello_botella}</p>
          </Tarjeta>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { titulo: 'Nutricion', texto: revision.nutricion },
              { titulo: 'Entrenamiento', texto: revision.entrenamiento },
              { titulo: 'Productividad', texto: revision.productividad },
              { titulo: 'Habitos', texto: revision.habitos },
              { titulo: 'Sueno y animo', texto: revision.animo },
            ]
              .filter((bloque) => bloque.texto)
              .map((bloque) => (
                <Tarjeta key={bloque.titulo}>
                  <TituloTarjeta>{bloque.titulo}</TituloTarjeta>
                  <p className="text-sm text-muted-foreground">{bloque.texto}</p>
                </Tarjeta>
              ))}
          </div>

          {revision.victorias.length > 0 && (
            <Tarjeta>
              <TituloTarjeta>Lo que has hecho bien</TituloTarjeta>
              <ul className="space-y-1.5 text-sm">
                {revision.victorias.map((v) => (
                  <li key={v}>✅ {v}</li>
                ))}
              </ul>
            </Tarjeta>
          )}

          {revision.errores.length > 0 && (
            <Tarjeta>
              <TituloTarjeta>Lo que te esta costando</TituloTarjeta>
              <ul className="space-y-1.5 text-sm">
                {revision.errores.map((e) => (
                  <li key={e}>⚠️ {e}</li>
                ))}
              </ul>
            </Tarjeta>
          )}

          {revision.acciones.length > 0 && (
            <Tarjeta className="border-emerald-500/40">
              <TituloTarjeta>La semana que viene</TituloTarjeta>
              <ol className="space-y-2 text-sm">
                {revision.acciones.map((accion, i) => (
                  <li key={accion} className="flex gap-2">
                    <span className="font-semibold text-emerald-400">{i + 1}.</span> {accion}
                  </li>
                ))}
              </ol>
            </Tarjeta>
          )}
        </>
      )}
    </div>
  );
}
