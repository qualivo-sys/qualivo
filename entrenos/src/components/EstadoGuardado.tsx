'use client';

import { useEstado } from '@/lib/estado-cliente';

const TEXTO = {
  cargando: 'Cargando…',
  guardando: 'Guardando…',
  guardado: 'Guardado',
  error: 'Sin guardar',
};

export default function EstadoGuardado() {
  const { sync, modo } = useEstado();
  return (
    <span className={`sync sync-${sync}`} title={modo === 'nube' ? 'Sincronizado entre dispositivos' : 'Guardado solo en este navegador'}>
      {TEXTO[sync]} · {modo === 'nube' ? 'nube' : 'este movil'}
    </span>
  );
}
