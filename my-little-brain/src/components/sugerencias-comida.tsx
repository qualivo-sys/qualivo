'use client';

import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { guardarComidaCalculada } from '@/app/app/acciones';
import { Boton } from '@/components/ui/base';
import type { Macros, MomentoDia, SugerenciaComida } from '@/lib/motor/dieta';

interface Grupo {
  momento: MomentoDia;
  etiqueta: string;
  objetivo: Macros;
  opciones: SugerenciaComida[];
}

/** Propuestas para las comidas que faltan, con un boton para apuntarlas tal cual. */
export default function SugerenciasComida({ grupos }: { grupos: Grupo[] }) {
  const router = useRouter();
  const [elegida, setElegida] = useState<Record<string, number>>({});
  const [apuntada, setApuntada] = useState<string | null>(null);
  const [pendiente, empezar] = useTransition();

  const apuntar = (s: SugerenciaComida) => {
    empezar(async () => {
      await guardarComidaCalculada({
        descripcion: `${s.titulo} (${s.texto})`,
        momento: s.momento,
        kcal: s.macros.kcal,
        proteina_g: s.macros.proteina,
        carbos_g: s.macros.carbos,
        grasa_g: s.macros.grasa,
        alcohol_ud: 0,
      });
      setApuntada(s.momento);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {grupos.map((grupo) => {
        const indice = elegida[grupo.momento] ?? 0;
        const s = grupo.opciones[indice] ?? grupo.opciones[0];
        return (
          <div key={grupo.momento} className="rounded-lg bg-muted/40 p-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold">{grupo.etiqueta}</span>
              <span className="text-xs text-muted-foreground tabular-nums">
                objetivo ~{Math.round(grupo.objetivo.kcal)} kcal · {Math.round(grupo.objetivo.proteina)} g prot
              </span>
            </div>
            {grupo.opciones.length > 1 && (
              <div className="mt-2 flex gap-1.5">
                {grupo.opciones.map((o, i) => (
                  <button
                    key={o.titulo}
                    type="button"
                    onClick={() => setElegida((prev) => ({ ...prev, [grupo.momento]: i }))}
                    className={`rounded-full px-2.5 py-1 text-xs ${i === indice ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}
                  >
                    Opcion {i + 1}
                  </button>
                ))}
              </div>
            )}
            <p className="mt-2 text-sm font-medium">{s.titulo}</p>
            <ul className="mt-1 text-xs text-muted-foreground">
              {s.lineas.map((l) => (
                <li key={l.id}>· {l.gramos} g {l.nombre.toLowerCase()}</li>
              ))}
            </ul>
            <p className="mt-2 text-xs tabular-nums">
              <strong>{s.macros.kcal} kcal</strong> · {s.macros.proteina} g prot · {s.macros.carbos} g carbos · {s.macros.grasa} g grasa
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Boton tamano="sm" variante="secundario" onClick={() => apuntar(s)} disabled={pendiente || apuntada === s.momento}>
                {pendiente ? <Loader2 size={14} className="animate-spin" /> : apuntada === s.momento ? <Check size={14} /> : null}
                {apuntada === s.momento ? 'Apuntada' : 'La he comido tal cual'}
              </Boton>
              <span className="text-[11px] text-muted-foreground">Si cambias algo, usa la calculadora de abajo.</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
