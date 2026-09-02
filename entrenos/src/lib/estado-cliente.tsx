'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { estadoInicial, normalizarEstado } from './estado-inicial';
import type { Estado, ModoAlmacenamiento } from './types';

type Sincronizacion = 'cargando' | 'guardado' | 'guardando' | 'error';

interface ValorContexto {
  estado: Estado;
  modo: ModoAlmacenamiento;
  sync: Sincronizacion;
  actualizar: (receta: (estado: Estado) => Estado) => void;
}

const ContextoEstado = createContext<ValorContexto | null>(null);

const clave = (perfilId: string) => `entrenos:v1:${perfilId}`;

function leerLocal(perfilId: string, nombre: string): Estado | null {
  if (typeof window === 'undefined') return null;
  try {
    const bruto = window.localStorage.getItem(clave(perfilId));
    if (!bruto) return null;
    return normalizarEstado(JSON.parse(bruto), perfilId, nombre);
  } catch {
    return null;
  }
}

function escribirLocal(perfilId: string, estado: Estado): void {
  try {
    window.localStorage.setItem(clave(perfilId), JSON.stringify(estado));
  } catch {
    // Cuota llena o modo privado: el guardado en la nube sigue funcionando.
  }
}

export function ProveedorEstado({
  perfilId,
  nombre,
  children,
}: {
  perfilId: string;
  nombre: string;
  children: React.ReactNode;
}) {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [modo, setModo] = useState<ModoAlmacenamiento>('local');
  const [sync, setSync] = useState<Sincronizacion>('cargando');
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendiente = useRef<Estado | null>(null);

  // Carga inicial: la nube manda; si falla, tiramos de la copia del navegador.
  useEffect(() => {
    let vivo = true;
    (async () => {
      const local = leerLocal(perfilId, nombre);
      try {
        const respuesta = await fetch(`/api/estado/${perfilId}`, { cache: 'no-store' });
        const datos = await respuesta.json();
        if (!vivo) return;
        if (datos.modo === 'nube') {
          setModo('nube');
          setEstado(datos.estado ? normalizarEstado(datos.estado, perfilId, nombre) : local ?? estadoInicial(perfilId, nombre));
        } else {
          setModo('local');
          setEstado(local ?? estadoInicial(perfilId, nombre));
        }
      } catch {
        if (!vivo) return;
        setModo('local');
        setEstado(local ?? estadoInicial(perfilId, nombre));
      } finally {
        if (vivo) setSync('guardado');
      }
    })();
    return () => {
      vivo = false;
    };
  }, [perfilId, nombre]);

  const enviar = useCallback(
    async (siguiente: Estado) => {
      if (modo !== 'nube') {
        setSync('guardado');
        return;
      }
      setSync('guardando');
      try {
        const respuesta = await fetch(`/api/estado/${perfilId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(siguiente),
        });
        setSync(respuesta.ok ? 'guardado' : 'error');
      } catch {
        setSync('error');
      }
    },
    [modo, perfilId],
  );

  const actualizar = useCallback(
    (receta: (estado: Estado) => Estado) => {
      setEstado((actual) => {
        if (!actual) return actual;
        const siguiente = receta(actual);
        escribirLocal(perfilId, siguiente);
        pendiente.current = siguiente;
        setSync(modo === 'nube' ? 'guardando' : 'guardado');
        if (temporizador.current) clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => {
          const aEnviar = pendiente.current;
          pendiente.current = null;
          if (aEnviar) void enviar(aEnviar);
        }, 900);
        return siguiente;
      });
    },
    [enviar, modo, perfilId],
  );

  // Si cierras la pestaña con algo a medio guardar, lo mandamos ya.
  useEffect(() => {
    const volcar = () => {
      const aEnviar = pendiente.current;
      if (!aEnviar) return;
      pendiente.current = null;
      if (temporizador.current) clearTimeout(temporizador.current);
      if (modo === 'nube' && navigator.sendBeacon) {
        navigator.sendBeacon(`/api/estado/${perfilId}`, new Blob([JSON.stringify(aEnviar)], { type: 'application/json' }));
      }
    };
    document.addEventListener('visibilitychange', volcar);
    window.addEventListener('pagehide', volcar);
    return () => {
      document.removeEventListener('visibilitychange', volcar);
      window.removeEventListener('pagehide', volcar);
    };
  }, [modo, perfilId]);

  if (!estado) {
    return <p className="cargando">Cargando tus datos…</p>;
  }

  return (
    <ContextoEstado.Provider value={{ estado, modo, sync, actualizar }}>{children}</ContextoEstado.Provider>
  );
}

export function useEstado(): ValorContexto {
  const valor = useContext(ContextoEstado);
  if (!valor) throw new Error('useEstado debe usarse dentro de ProveedorEstado');
  return valor;
}
