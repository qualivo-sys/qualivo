'use client';

import { Check, Pause, Play, Trash2 } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import {
  arrancarCronometro,
  descartarCronometro,
  pararYGuardar,
  pausarCronometro,
  reanudarCronometro,
} from '@/app/app/mente/acciones-tiempo';
import { Boton } from '@/components/ui/base';
import { type Cronometro, reloj, segundosDelCronometro } from '@/lib/motor/tiempo';
import type { ActividadTiempo } from '@/lib/tipos';
import { cn } from '@/lib/utils';

/**
 * El cronometro. Los segundos se recalculan siempre desde la marca de tiempo
 * que dio el servidor, no sumando de uno en uno: si el movil se bloquea o el
 * navegador congela la pestana, al volver el numero sigue siendo el correcto.
 */
export default function CronometroFoco({
  cronometro,
  segundosIniciales,
  actividades,
  nombreActividad,
}: {
  cronometro: Cronometro | null;
  segundosIniciales: number;
  actividades: ActividadTiempo[];
  nombreActividad: string | null;
}) {
  const [pendiente, iniciar] = useTransition();
  const [segundos, setSegundos] = useState(segundosIniciales);
  const [descripcion, setDescripcion] = useState('');
  const inicio = cronometro?.inicio ?? null;
  const acumulado = cronometro?.acumulado_seg ?? 0;
  const corriendo = Boolean(inicio);

  useEffect(() => {
    const leer = () =>
      setSegundos(segundosDelCronometro({ actividad_id: null, descripcion: null, inicio, acumulado_seg: acumulado }));
    leer();
    if (!inicio) return;
    const id = setInterval(leer, 1000);
    return () => clearInterval(id);
  }, [inicio, acumulado]);

  const accion = (fn: () => Promise<void>) => iniciar(() => fn());

  if (!cronometro) {
    if (!actividades.length) {
      return (
        <p className="text-sm text-muted-foreground">
          Crea una actividad ahi abajo y podras cronometrarla con un toque.
        </p>
      );
    }
    return (
      <div className="space-y-3">
        <input
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="En que, si quieres precisar (opcional)"
          className="h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-base outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
        />
        <div className="grid grid-cols-2 gap-2">
          {actividades.map((a) => (
            <button
              key={a.id}
              type="button"
              disabled={pendiente}
              onClick={() => accion(() => arrancarCronometro(a.id, descripcion))}
              className="flex h-14 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-left text-sm transition-colors hover:border-primary/60 hover:bg-muted disabled:opacity-50"
            >
              <span className="text-lg">{a.emoji || '⏱️'}</span>
              <span className="min-w-0 flex-1 truncate">{a.nombre}</span>
              <Play size={16} className="shrink-0 text-primary" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-sm text-muted-foreground">
          {nombreActividad ?? 'En marcha'}
          {cronometro.descripcion && ` · ${cronometro.descripcion}`}
        </div>
        <div className={cn('mt-1 text-5xl font-semibold tabular-nums', !corriendo && 'text-muted-foreground')}>
          {reloj(segundos)}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {corriendo ? 'Contando…' : 'En pausa'}
          {segundos < 60 && ' · por debajo de un minuto no se guarda'}
        </div>
      </div>

      <div className="flex gap-2">
        {corriendo ? (
          <Boton type="button" variante="secundario" className="flex-1" disabled={pendiente} onClick={() => accion(pausarCronometro)}>
            <Pause size={16} className="mr-1.5" /> Pausa
          </Boton>
        ) : (
          <Boton type="button" variante="secundario" className="flex-1" disabled={pendiente} onClick={() => accion(reanudarCronometro)}>
            <Play size={16} className="mr-1.5" /> Seguir
          </Boton>
        )}
        <Boton type="button" className="flex-1" disabled={pendiente} onClick={() => accion(pararYGuardar)}>
          <Check size={16} className="mr-1.5" /> Terminar
        </Boton>
        <Boton
          type="button" variante="contorno" aria-label="Descartar sin guardar"
          disabled={pendiente} onClick={() => accion(descartarCronometro)}
        >
          <Trash2 size={16} />
        </Boton>
      </div>
    </div>
  );
}

/** Aviso pequeno para el resto de la app: "tienes algo contando". */
export function CronometroEnMarcha({
  cronometro,
  segundosIniciales,
  nombre,
}: {
  cronometro: Cronometro;
  segundosIniciales: number;
  nombre: string | null;
}) {
  const [segundos, setSegundos] = useState(segundosIniciales);
  const { inicio, acumulado_seg: acumulado } = cronometro;

  useEffect(() => {
    const leer = () => setSegundos(segundosDelCronometro({ actividad_id: null, descripcion: null, inicio, acumulado_seg: acumulado }));
    leer();
    if (!inicio) return;
    const id = setInterval(leer, 1000);
    return () => clearInterval(id);
  }, [inicio, acumulado]);

  return (
    <span className="tabular-nums">
      {nombre ?? 'En marcha'} · {reloj(segundos)}
      {!inicio && ' (en pausa)'}
    </span>
  );
}
