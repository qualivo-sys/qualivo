'use client';

import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { guardarEstadoEmocional } from '@/app/app/mente/acciones';
import { Boton } from '@/components/ui/base';
import { EMOCIONES } from '@/lib/motor/emociones';

const CARAS = [
  { valor: 2, cara: '😞', etiqueta: 'Muy mal' },
  { valor: 4, cara: '😕', etiqueta: 'Bajo' },
  { valor: 6, cara: '😐', etiqueta: 'Normal' },
  { valor: 8, cara: '🙂', etiqueta: 'Bien' },
  { valor: 10, cara: '😄', etiqueta: 'Muy bien' },
];

/** El check-in de un minuto: como te has sentido y con que emociones. */
export default function EstadoEmocional({
  animo,
  energia,
  estres,
  emociones = [],
}: {
  animo: number | null;
  energia: number | null;
  estres: number | null;
  emociones?: string[];
}) {
  const [cara, setCara] = useState<number | null>(animo);
  const [nivelEnergia, setEnergia] = useState(energia ?? 5);
  const [nivelEstres, setEstres] = useState(estres ?? 5);
  const [elegidas, setElegidas] = useState<string[]>(emociones);
  const [guardando, setGuardando] = useState(false);
  const [hecho, setHecho] = useState(false);

  const alternar = (id: string) =>
    setElegidas((previas) =>
      previas.includes(id) ? previas.filter((e) => e !== id) : previas.length >= 3 ? previas : [...previas, id],
    );

  return (
    <form
      action={async (datos) => {
        setGuardando(true);
        await guardarEstadoEmocional(datos);
        setGuardando(false);
        setHecho(true);
        setTimeout(() => setHecho(false), 2500);
      }}
      className="space-y-4"
    >
      <input type="hidden" name="animo" value={cara ?? ''} />
      <input type="hidden" name="energia" value={nivelEnergia} />
      <input type="hidden" name="estres" value={nivelEstres} />
      <input type="hidden" name="emociones" value={elegidas.join(',')} />

      <div>
        <p className="mb-2 text-sm text-muted-foreground">¿Como te has sentido hoy?</p>
        <div className="grid grid-cols-5 gap-1.5">
          {CARAS.map((c) => (
            <button
              key={c.valor}
              type="button"
              onClick={() => setCara(c.valor)}
              className={`flex flex-col items-center gap-1 rounded-xl border py-2 transition-colors ${
                cara === c.valor ? 'border-primary bg-primary/15' : 'border-border bg-card'
              }`}
            >
              <span className="text-2xl">{c.cara}</span>
              <span className="text-[10px] text-muted-foreground">{c.etiqueta}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {([
          ['Energia', nivelEnergia, setEnergia] as const,
          ['Estres', nivelEstres, setEstres] as const,
        ]).map(([etiqueta, valor, set]) => (
          <label key={etiqueta} className="block">
            <span className="flex items-baseline justify-between text-sm text-muted-foreground">
              {etiqueta} <strong className="text-base text-foreground tabular-nums">{valor}</strong>
            </span>
            <input
              type="range"
              min={1}
              max={10}
              value={valor}
              onChange={(e) => set(Number(e.target.value))}
              className="mt-1 w-full accent-[hsl(var(--primary))]"
              aria-label={etiqueta}
            />
          </label>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          Emociones que han mandado hoy <span className="text-xs">(hasta 3)</span>
        </p>
        <div className="flex flex-wrap gap-1.5">
          {EMOCIONES.map((e) => {
            const activa = elegidas.includes(e.id);
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => alternar(e.id)}
                disabled={!activa && elegidas.length >= 3}
                className={`rounded-full border px-2.5 py-1.5 text-xs transition-colors disabled:opacity-40 ${
                  activa
                    ? e.valencia === 'positiva'
                      ? 'border-emerald-500/50 bg-emerald-500/15'
                      : 'border-amber-500/50 bg-amber-500/15'
                    : 'border-border bg-card text-muted-foreground'
                }`}
              >
                {e.emoji} {e.nombre}
              </button>
            );
          })}
        </div>
      </div>

      <Boton type="submit" disabled={guardando || cara === null} className="w-full">
        {guardando ? <Loader2 size={16} className="animate-spin" /> : hecho ? <Check size={16} /> : null}
        {hecho ? 'Guardado' : 'Guardar como me siento'}
      </Boton>
    </form>
  );
}
