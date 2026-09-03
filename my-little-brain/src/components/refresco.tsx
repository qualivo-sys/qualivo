'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Vuelve a pedir los datos al servidor cada vez que la app vuelve a primer
 * plano o se restaura desde el historial. Sin esto, la PWA en el movil (que no
 * tiene boton de recargar) ensena los numeros de la ultima vez que se abrio.
 */
export default function RefrescoAlVolver() {
  const router = useRouter();
  useEffect(() => {
    let ultimo = Date.now();
    const refrescar = () => {
      if (Date.now() - ultimo < 2000) return;
      ultimo = Date.now();
      router.refresh();
    };
    const alCambiarVisibilidad = () => {
      if (document.visibilityState === 'visible') refrescar();
    };
    const alMostrar = (evento: PageTransitionEvent) => {
      if (evento.persisted) refrescar();
    };
    document.addEventListener('visibilitychange', alCambiarVisibilidad);
    window.addEventListener('pageshow', alMostrar);
    window.addEventListener('focus', refrescar);
    return () => {
      document.removeEventListener('visibilitychange', alCambiarVisibilidad);
      window.removeEventListener('pageshow', alMostrar);
      window.removeEventListener('focus', refrescar);
    };
  }, [router]);
  return null;
}
