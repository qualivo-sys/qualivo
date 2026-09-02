'use client';

import { Bell, BellOff, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Boton } from '@/components/ui/base';

type Estado = 'cargando' | 'no_soportado' | 'sin_configurar' | 'inactivo' | 'activo' | 'denegado';

function base64AUint8(base64: string): Uint8Array {
  const relleno = '='.repeat((4 - (base64.length % 4)) % 4);
  const limpio = (base64 + relleno).replace(/-/g, '+').replace(/_/g, '/');
  const crudo = atob(limpio);
  return Uint8Array.from([...crudo].map((c) => c.charCodeAt(0)));
}

/** Activar o desactivar los avisos push en este navegador. */
export default function Notificaciones() {
  const [estado, setEstado] = useState<Estado>('cargando');
  const [clave, setClave] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    (async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setEstado('no_soportado');
        return;
      }
      try {
        const r = await fetch('/api/push/suscribir');
        const d = await r.json();
        if (!d.activo || !d.clavePublica) {
          setEstado('sin_configurar');
          return;
        }
        setClave(d.clavePublica);
        if (Notification.permission === 'denied') {
          setEstado('denegado');
          return;
        }
        const registro = await navigator.serviceWorker.register('/sw.js');
        const actual = await registro.pushManager.getSubscription();
        setEstado(actual ? 'activo' : 'inactivo');
      } catch {
        setEstado('inactivo');
      }
    })();
  }, []);

  const activar = async () => {
    if (!clave) return;
    setOcupado(true);
    setMensaje('');
    try {
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') {
        setEstado('denegado');
        return;
      }
      const registro = await navigator.serviceWorker.ready;
      const sub = await registro.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64AUint8(clave),
      });
      const r = await fetch('/api/push/suscribir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!r.ok) throw new Error('No se pudo guardar la suscripcion');
      setEstado('activo');
      setMensaje('Avisos activados en este navegador.');
    } catch (error) {
      setMensaje((error as Error).message);
    } finally {
      setOcupado(false);
    }
  };

  const desactivar = async () => {
    setOcupado(true);
    try {
      const registro = await navigator.serviceWorker.ready;
      const sub = await registro.pushManager.getSubscription();
      if (sub) {
        await fetch('/api/push/suscribir', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setEstado('inactivo');
      setMensaje('Avisos desactivados.');
    } finally {
      setOcupado(false);
    }
  };

  const probar = async () => {
    setOcupado(true);
    setMensaje('');
    try {
      const r = await fetch('/api/push/probar', { method: 'POST' });
      const d = await r.json();
      setMensaje(r.ok ? `Enviado a ${d.enviados} navegador(es). Si no aparece, mira los permisos del sistema.` : d.error);
    } finally {
      setOcupado(false);
    }
  };

  if (estado === 'cargando') return <p className="text-sm text-muted-foreground">Comprobando…</p>;
  if (estado === 'no_soportado') {
    return (
      <p className="text-sm text-muted-foreground">
        Este navegador no admite avisos. En iPhone: anade la app a la pantalla de inicio (Compartir →
        Anadir a inicio) y abrela desde ahi.
      </p>
    );
  }
  if (estado === 'sin_configurar') {
    return <p className="text-sm text-muted-foreground">Los avisos no estan configurados en este despliegue.</p>;
  }
  if (estado === 'denegado') {
    return (
      <p className="text-sm text-amber-300">
        Has bloqueado los avisos para esta web. Actívalos en los ajustes del navegador y recarga.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {estado === 'activo' ? (
        <div className="grid gap-2 sm:grid-cols-2">
          <Boton variante="secundario" onClick={probar} disabled={ocupado}>
            {ocupado ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}
            Enviar aviso de prueba
          </Boton>
          <Boton variante="contorno" onClick={desactivar} disabled={ocupado}>
            <BellOff size={16} /> Desactivar en este navegador
          </Boton>
        </div>
      ) : (
        <Boton onClick={activar} disabled={ocupado} className="w-full">
          {ocupado ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}
          Activar avisos en este navegador
        </Boton>
      )}
      {mensaje && <p className="text-sm text-muted-foreground">{mensaje}</p>}
    </div>
  );
}
