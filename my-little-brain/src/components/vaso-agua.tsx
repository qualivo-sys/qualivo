'use client';

import { Minus, Plus } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { sumarAgua } from '@/app/app/descanso/acciones';
import { BOTELLA_ML, VASO_ML } from '@/lib/motor/descanso';
import { cn } from '@/lib/utils';

/**
 * Apuntar agua es la accion mas repetida de la app: tiene que costar un toque
 * y responder al instante. Por eso el numero se actualiza de forma optimista
 * y el servidor va detras; si algo falla, React lo devuelve a su sitio solo.
 */
export default function VasoAgua({
  ml,
  objetivoMl,
  compacto = false,
}: {
  ml: number;
  objetivoMl: number;
  compacto?: boolean;
}) {
  const [pendiente, iniciar] = useTransition();
  const [optimista, sumarOptimista] = useOptimistic(ml, (actual, delta: number) => Math.max(0, actual + delta));

  const sumar = (delta: number) => {
    iniciar(async () => {
      sumarOptimista(delta);
      await sumarAgua(delta);
    });
  };

  const pct = Math.min(100, Math.round((optimista / objetivoMl) * 100));
  const vasos = Math.round(objetivoMl / VASO_ML);
  const llenos = Math.min(vasos, Math.round(optimista / VASO_ML));

  return (
    <div className={cn('space-y-3', pendiente && 'opacity-90')}>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-semibold tabular-nums">{(optimista / 1000).toFixed(2).replace('.', ',')}</span>
          <span className="ml-1 text-sm text-muted-foreground">
            de {(objetivoMl / 1000).toFixed(1).replace('.', ',')} l
          </span>
        </div>
        <span className={cn('text-sm font-medium tabular-nums', pct >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground')}>
          {pct} %
        </span>
      </div>

      {/* Los vasos son la unidad con la que la gente piensa, no los mililitros. */}
      <div className="flex flex-wrap gap-1.5" aria-hidden>
        {Array.from({ length: vasos }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-6 w-4 rounded-b-md rounded-t-sm border transition-colors',
              i < llenos ? 'border-sky-500 bg-sky-500/70' : 'border-border bg-muted/50',
            )}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => sumar(VASO_ML)}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500/15 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-500/25 dark:text-sky-300"
        >
          <Plus size={16} /> Vaso
        </button>
        <button
          type="button"
          onClick={() => sumar(BOTELLA_ML)}
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-sky-500/15 text-sm font-medium text-sky-700 transition-colors hover:bg-sky-500/25 dark:text-sky-300"
        >
          <Plus size={16} /> Botella
        </button>
        <button
          type="button"
          onClick={() => sumar(-VASO_ML)}
          disabled={optimista === 0}
          aria-label="Quitar un vaso"
          className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors hover:bg-muted/70 disabled:opacity-40"
        >
          <Minus size={16} />
        </button>
      </div>

      {!compacto && (
        <p className="text-xs text-muted-foreground">
          Un vaso son {VASO_ML} ml y una botella {BOTELLA_ML} ml. Si te pasas, resta con el menos.
        </p>
      )}
    </div>
  );
}
