'use client';

import { Check } from 'lucide-react';
import { useState, useTransition } from 'react';
import { alternarHabito } from '@/app/app/acciones';
import { cn } from '@/lib/utils';
import type { Habito } from '@/lib/tipos';

export default function HabitosHoy({
  habitos,
  hechos,
  fecha,
}: {
  habitos: Habito[];
  hechos: string[];
  fecha: string;
}) {
  const [marcados, setMarcados] = useState<string[]>(hechos);
  const [, empezar] = useTransition();

  if (!habitos.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Aun no tienes habitos. Dile al coach cual quieres sostener (&ldquo;quiero andar 10.000 pasos
        cada dia&rdquo;) y lo crea.
      </p>
    );
  }

  const alternar = (id: string) => {
    const hecho = !marcados.includes(id);
    setMarcados((previos) => (hecho ? [...previos, id] : previos.filter((x) => x !== id)));
    empezar(() => {
      void alternarHabito(id, fecha, hecho);
    });
  };

  return (
    <ul className="space-y-2">
      {habitos.map((habito) => {
        const hecho = marcados.includes(habito.id);
        return (
          <li key={habito.id}>
            <button
              type="button"
              onClick={() => alternar(habito.id)}
              aria-pressed={hecho}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                hecho
                  ? 'border-transparent bg-[hsl(var(--area-habitos)/0.18)] text-foreground'
                  : 'border-border bg-muted/30 text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'grid h-6 w-6 shrink-0 place-items-center rounded-md border',
                  hecho ? 'border-transparent bg-[hsl(var(--area-habitos))] text-white' : 'border-border',
                )}
              >
                {hecho && <Check size={14} strokeWidth={3} />}
              </span>
              <span className="flex-1">
                {habito.emoji} {habito.nombre}
              </span>
              <span className="text-xs text-muted-foreground">{habito.veces_por_semana}/sem</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
