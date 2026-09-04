'use client';

import { Check, Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { guardarComidaCalculada } from '@/app/app/acciones';
import type { ComidaHabitual } from '@/lib/motor/habituales';

/**
 * Lo que sueles comer, a un toque. Es la diferencia entre apuntar la comida
 * durante una semana y hacerlo durante un año.
 */
export default function ComidasHabituales({ habituales, fecha }: { habituales: ComidaHabitual[]; fecha?: string }) {
  const router = useRouter();
  const [pendiente, empezar] = useTransition();
  const [apuntando, setApuntando] = useState<string | null>(null);
  const [hecha, setHecha] = useState<string | null>(null);

  if (!habituales.length) return null;

  const apuntar = (h: ComidaHabitual) => {
    setApuntando(h.clave);
    empezar(async () => {
      await guardarComidaCalculada({
        descripcion: h.descripcion,
        momento: h.momento ?? 'snack',
        kcal: h.kcal,
        proteina_g: h.proteina,
        carbos_g: h.carbos,
        grasa_g: h.grasa,
        alcohol_ud: h.alcoholUd,
        fecha,
      });
      setApuntando(null);
      setHecha(h.clave);
      setTimeout(() => setHecha(null), 2000);
      router.refresh();
    });
  };

  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-medium">Lo que sueles comer</p>
      <div className="desplazable-x">
        <div className="flex min-w-max gap-2 pb-1">
          {habituales.map((h) => (
            <button
              key={h.clave}
              type="button"
              onClick={() => apuntar(h)}
              disabled={pendiente}
              className={`flex max-w-[15rem] items-center gap-2 rounded-full border px-3 py-2 text-left text-xs transition-colors disabled:opacity-60 ${
                hecha === h.clave
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-border bg-card hover:bg-secondary/60'
              }`}
            >
              <span className="shrink-0 text-muted-foreground">
                {apuntando === h.clave ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : hecha === h.clave ? (
                  <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Plus size={14} />
                )}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-foreground">{h.descripcion}</span>
                <span className="block text-muted-foreground tabular-nums">
                  {h.kcal} kcal · {h.proteina} g prot{h.hoy ? ' · ya hoy' : ''}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Un toque y queda apuntada con las calorias de las otras veces. Si cambia la cantidad, usala abajo.
      </p>
    </div>
  );
}
