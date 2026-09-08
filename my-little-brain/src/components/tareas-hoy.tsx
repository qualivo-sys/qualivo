'use client';

import { Check, Undo2 } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { completarTarea } from '@/app/app/tareas/acciones';
import { cn } from '@/lib/utils';
import type { Tarea } from '@/lib/tipos';

/**
 * Marcar una tarea responde al instante. El servidor va detras: si algo
 * falla, React devuelve la casilla a su sitio solo.
 */
export default function TareasHoy({
  abiertas,
  hechas,
  compacto = false,
}: {
  abiertas: Tarea[];
  hechas: Tarea[];
  compacto?: boolean;
}) {
  const [, iniciar] = useTransition();
  const todas = [...abiertas, ...hechas];
  const [marcadas, marcar] = useOptimistic(
    new Set(hechas.map((t) => t.id)),
    (actual: Set<string>, id: string) => {
      const nueva = new Set(actual);
      if (nueva.has(id)) nueva.delete(id);
      else nueva.add(id);
      return nueva;
    },
  );

  const alternar = (t: Tarea) => {
    iniciar(async () => {
      marcar(t.id);
      await completarTarea(t.id, !marcadas.has(t.id));
    });
  };

  if (!todas.length) return null;

  // Las hechas caen abajo, pero sin desaparecer: ver lo cerrado es media gracia.
  const orden = [...todas].sort((a, b) => Number(marcadas.has(a.id)) - Number(marcadas.has(b.id)));

  return (
    <ul className={cn('space-y-1', compacto && 'space-y-0.5')}>
      {orden.map((t) => {
        const hecha = marcadas.has(t.id);
        return (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => alternar(t)}
              className="flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left transition-colors hover:bg-muted/60"
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                  hecha ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-input',
                )}
              >
                {hecha && <Check size={15} strokeWidth={3} />}
              </span>
              <span className={cn('min-w-0 flex-1 text-sm', hecha && 'text-muted-foreground line-through')}>
                {t.titulo}
                {t.pospuesta > 0 && !hecha && (
                  <span className="ml-1.5 inline-flex items-center gap-0.5 align-middle text-[10px] text-amber-600 dark:text-amber-400">
                    <Undo2 size={11} /> {t.pospuesta}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
