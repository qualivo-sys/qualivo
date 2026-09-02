'use client';

import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Boton } from '@/components/ui/base';

/** Botones de suscripcion: abren Stripe en la misma pestana. */
export default function PlanSuscripcion({
  plan,
  pagosActivos,
}: {
  plan: string;
  pagosActivos: boolean;
}) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const abrir = async (ruta: 'checkout' | 'portal') => {
    setCargando(true);
    setError('');
    try {
      const respuesta = await fetch(`/api/pago/${ruta}`, { method: 'POST' });
      const datos = await respuesta.json();
      if (!respuesta.ok || !datos.url) {
        setError(datos.error ?? 'No se ha podido abrir el pago.');
        return;
      }
      window.location.href = datos.url;
    } catch {
      setError('Sin conexion con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  if (!pagosActivos) {
    return (
      <p className="text-sm text-muted-foreground">
        El cobro no esta configurado en este despliegue.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {plan === 'free' ? (
        <Boton onClick={() => abrir('checkout')} disabled={cargando} className="w-full">
          {cargando && <Loader2 size={16} className="animate-spin" />}
          Pasar a Pro
        </Boton>
      ) : (
        <Boton onClick={() => abrir('portal')} disabled={cargando} variante="contorno" className="w-full">
          {cargando && <Loader2 size={16} className="animate-spin" />}
          Gestionar mi suscripcion
        </Boton>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
