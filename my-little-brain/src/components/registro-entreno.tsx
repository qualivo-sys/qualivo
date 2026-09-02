'use client';

import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { guardarEntreno, type SeriePayload } from '@/app/app/acciones';
import { Boton, Tarjeta } from '@/components/ui/base';
import type { Bloque } from '@/lib/motor/tipos-motor';
import { cn } from '@/lib/utils';

export interface BloqueVista extends Bloque {
  nombre: string;
  tecnica: string;
  sugerencia: string;
  pesoSugerido: number | null;
  esIsometrico: boolean;
}

interface SerieEditable {
  peso: string;
  reps: string;
  rir: string;
  hecha: boolean;
}

export default function RegistroEntreno({
  diaId,
  nombre,
  bloques,
}: {
  diaId: string;
  nombre: string;
  bloques: BloqueVista[];
}) {
  const router = useRouter();
  const [estado, setEstado] = useState<SerieEditable[][]>(
    bloques.map((bloque) =>
      Array.from({ length: bloque.series }, () => ({
        peso: bloque.pesoSugerido !== null ? String(bloque.pesoSugerido) : '',
        reps: '',
        rir: '',
        hecha: false,
      })),
    ),
  );
  const [sensacion, setSensacion] = useState<number | null>(null);
  const [notas, setNotas] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [descanso, setDescanso] = useState<number | null>(null);

  const editar = (bloque: number, serie: number, cambios: Partial<SerieEditable>) =>
    setEstado((previo) =>
      previo.map((filas, i) =>
        i !== bloque ? filas : filas.map((fila, j) => (j !== serie ? fila : { ...fila, ...cambios })),
      ),
    );

  const anadirSerie = (bloque: number) =>
    setEstado((previo) =>
      previo.map((filas, i) =>
        i !== bloque ? filas : [...filas, { ...filas[filas.length - 1], reps: '', hecha: false }],
      ),
    );

  const terminar = async () => {
    setGuardando(true);
    const series: SeriePayload[] = [];
    estado.forEach((filas, indiceBloque) => {
      filas.forEach((fila, indiceSerie) => {
        if (!fila.hecha && !fila.reps) return;
        series.push({
          ejercicio_id: bloques[indiceBloque].ejercicioId,
          ejercicio_nombre: bloques[indiceBloque].nombre,
          orden: indiceBloque,
          serie: indiceSerie + 1,
          peso_kg: fila.peso ? Number(fila.peso.replace(',', '.')) : null,
          reps: fila.reps ? Number(fila.reps) : null,
          rir: fila.rir ? Number(fila.rir) : null,
        });
      });
    });

    await guardarEntreno({ nombre, dia_plan: diaId, sensacion, notas: notas || null, series });
    setGuardando(false);
    router.push('/app');
    router.refresh();
  };

  const totalHechas = estado.flat().filter((s) => s.hecha).length;

  return (
    <div className="space-y-3">
      {descanso !== null && (
        <div className="sticky top-2 z-10 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm">
          Descanso sugerido: {Math.round(descanso / 60)} min {descanso % 60 ? `${descanso % 60} s` : ''}
          <button onClick={() => setDescanso(null)} className="ml-2 text-xs text-muted-foreground underline">
            ocultar
          </button>
        </div>
      )}

      {bloques.map((bloque, indiceBloque) => (
        <Tarjeta key={`${bloque.ejercicioId}-${indiceBloque}`}>
          <h3 className="font-semibold">{bloque.nombre}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {bloque.series} × {bloque.repMin}-{bloque.repMax} {bloque.esIsometrico ? 'seg' : 'reps'} · RIR {bloque.rir} ·
            descanso {Math.round(bloque.descansoSeg / 60)} min
          </p>

          <p className="mt-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs">
            {bloque.sugerencia}
          </p>

          <div className="mt-3 grid grid-cols-[24px_1fr_1fr_1fr_40px] gap-1.5 text-center text-[11px] text-muted-foreground">
            <span>#</span>
            <span>kg</span>
            <span>{bloque.esIsometrico ? 'seg' : 'reps'}</span>
            <span>RIR</span>
            <span>✓</span>
          </div>

          <div className="mt-1 space-y-1.5">
            {estado[indiceBloque].map((serie, indiceSerie) => (
              <div key={indiceSerie} className="grid grid-cols-[24px_1fr_1fr_1fr_40px] items-center gap-1.5">
                <span className="text-center text-xs text-muted-foreground">{indiceSerie + 1}</span>
                {(['peso', 'reps', 'rir'] as const).map((campo) => (
                  <input
                    key={campo}
                    type="number"
                    inputMode="decimal"
                    value={serie[campo]}
                    placeholder={campo === 'reps' ? String(bloque.repMax) : campo === 'rir' ? String(bloque.rir) : '—'}
                    onChange={(evento) => editar(indiceBloque, indiceSerie, { [campo]: evento.target.value })}
                    className="h-11 w-full rounded-lg border border-input bg-muted/40 text-center text-base outline-none focus:ring-2 focus:ring-ring"
                    aria-label={`${bloque.nombre} serie ${indiceSerie + 1} ${campo}`}
                  />
                ))}
                <button
                  type="button"
                  aria-label={serie.hecha ? 'Desmarcar serie' : 'Marcar serie'}
                  aria-pressed={serie.hecha}
                  onClick={() => {
                    const hecha = !serie.hecha;
                    editar(indiceBloque, indiceSerie, { hecha });
                    setDescanso(hecha ? bloque.descansoSeg : null);
                  }}
                  className={cn(
                    'grid h-11 place-items-center rounded-lg border transition-colors',
                    serie.hecha
                      ? 'border-transparent bg-[hsl(var(--area-fitness))] text-white'
                      : 'border-border bg-muted/40 text-muted-foreground',
                  )}
                >
                  <Check size={16} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => anadirSerie(indiceBloque)}
            className="mt-2 text-xs text-muted-foreground underline"
          >
            + serie
          </button>

          <p className="mt-3 border-l-2 border-border pl-3 text-xs text-muted-foreground">{bloque.tecnica}</p>
        </Tarjeta>
      ))}

      <Tarjeta>
        <h3 className="mb-2 font-semibold">Como ha ido</h3>
        <div className="flex flex-wrap gap-2">
          {['Fatal', 'Flojo', 'Normal', 'Bien', 'Brutal'].map((etiqueta, i) => (
            <button
              key={etiqueta}
              type="button"
              onClick={() => setSensacion(i + 1)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs',
                sensacion === i + 1
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground',
              )}
            >
              {etiqueta}
            </button>
          ))}
        </div>
        <textarea
          value={notas}
          onChange={(evento) => setNotas(evento.target.value)}
          rows={2}
          placeholder="Molestias, cambios de ejercicio, sensaciones…"
          className="mt-3 w-full rounded-lg border border-input bg-muted/40 p-3 text-base outline-none focus:ring-2 focus:ring-ring"
        />
        <Boton onClick={terminar} disabled={guardando} className="mt-3 w-full">
          {guardando ? <Loader2 size={16} className="animate-spin" /> : null}
          Terminar entreno ({totalHechas} series)
        </Boton>
      </Tarjeta>
    </div>
  );
}
