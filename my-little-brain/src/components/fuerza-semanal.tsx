'use client';

import { useState } from 'react';
import Grafica from '@/components/ui/grafica';

export interface SerieEjercicio {
  ejercicioId: string;
  nombre: string;
  /** Mejor peso levantado cada semana (lunes de la semana → kg). */
  porSemana: { fecha: string; valor: number }[];
  /** Mejor serie de todas: peso × reps. */
  mejor: { pesoKg: number; reps: number; fecha: string } | null;
}

/** Peso por ejercicio, semana a semana: la grafica que dice si progresas de verdad. */
export default function FuerzaSemanal({ ejercicios }: { ejercicios: SerieEjercicio[] }) {
  const [seleccionado, setSeleccionado] = useState(ejercicios[0]?.ejercicioId ?? '');
  const actual = ejercicios.find((e) => e.ejercicioId === seleccionado) ?? ejercicios[0];

  if (!actual) {
    return <p className="text-sm text-muted-foreground">Registra series con peso y aqui veras la evolucion.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="ejercicio-fuerza" className="block text-sm text-muted-foreground">Ejercicio</label>
        <select
          id="ejercicio-fuerza"
          value={actual.ejercicioId}
          onChange={(e) => setSeleccionado(e.target.value)}
          className="h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-base outline-none focus:ring-2 focus:ring-ring"
        >
          {ejercicios.map((e) => (
            <option key={e.ejercicioId} value={e.ejercicioId}>{e.nombre}</option>
          ))}
        </select>
      </div>

      <Grafica datos={actual.porSemana} unidad=" kg" color="hsl(var(--area-fitness))" decimales={1} />

      <div className="desplazable-x">
        <table className="w-full min-w-max text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="pb-1 text-left font-medium">Semana</th>
              <th className="pb-1 text-right font-medium">Mejor peso</th>
              <th className="pb-1 text-right font-medium">Cambio</th>
            </tr>
          </thead>
          <tbody>
            {[...actual.porSemana].reverse().map((p, i, lista) => {
              const anterior = lista[i + 1];
              const delta = anterior ? p.valor - anterior.valor : null;
              return (
                <tr key={p.fecha} className="border-t border-border">
                  <td className="py-1.5">{p.fecha.slice(8)}/{p.fecha.slice(5, 7)}</td>
                  <td className="py-1.5 text-right tabular-nums">{p.valor} kg</td>
                  <td className={`py-1.5 text-right tabular-nums ${delta === null ? 'text-muted-foreground' : delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : delta < 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                    {delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {actual.mejor && (
        <p className="text-xs text-muted-foreground">
          Mejor serie: {actual.mejor.pesoKg} kg × {actual.mejor.reps} reps ({actual.mejor.fecha}).
        </p>
      )}
    </div>
  );
}
