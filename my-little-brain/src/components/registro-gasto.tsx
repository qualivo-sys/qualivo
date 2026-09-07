'use client';

import { Check, Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { registrarMovimiento } from '@/app/app/finanzas/acciones';
import { Boton } from '@/components/ui/base';
import { CATEGORIAS } from '@/lib/motor/finanzas';

/**
 * Apuntar un gasto tiene que costar dos toques: importe y categoria. Todo lo
 * demas (descripcion, si fue un impulso, si es de empresa) es opcional.
 */
export default function RegistroGasto({ frecuentes = [] as string[], moneda = '€' }) {
  const formulario = useRef<HTMLFormElement>(null);
  const [categoria, setCategoria] = useState(frecuentes[0] ?? 'restaurantes');
  const [tipo, setTipo] = useState<'gasto' | 'ingreso'>('gasto');
  const [impulsivo, setImpulsivo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [hecho, setHecho] = useState(false);

  // Las que mas usa primero, el resto detras: la lista no se reordena sola al escribir.
  const ordenadas = [
    ...frecuentes.map((id) => CATEGORIAS.find((c) => c.id === id)).filter((c): c is (typeof CATEGORIAS)[number] => Boolean(c)),
    ...CATEGORIAS.filter((c) => !frecuentes.includes(c.id)),
  ];

  return (
    <form
      ref={formulario}
      action={async (datos) => {
        setEnviando(true);
        await registrarMovimiento(datos);
        formulario.current?.reset();
        setImpulsivo(false);
        setEnviando(false);
        setHecho(true);
        setTimeout(() => setHecho(false), 2000);
      }}
      className="space-y-3"
    >
      <input type="hidden" name="categoria" value={categoria} />
      <input type="hidden" name="tipo" value={tipo} />
      <input type="hidden" name="impulsivo" value={impulsivo ? 'true' : 'false'} />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            name="importe"
            inputMode="decimal"
            required
            placeholder="0"
            aria-label="Importe"
            className="h-14 w-full rounded-xl border border-input bg-muted/40 pl-4 pr-10 text-2xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">{moneda}</span>
        </div>
        <div className="flex overflow-hidden rounded-xl border border-border text-xs">
          {(['gasto', 'ingreso'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTipo(t)}
              className={`h-14 px-3 capitalize transition-colors ${tipo === t ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="desplazable-x">
        <div className="flex min-w-max gap-1.5 pb-1">
          {ordenadas.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoria(c.id)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors ${
                categoria === c.id ? 'border-primary bg-primary/15 text-foreground' : 'border-border bg-card text-muted-foreground'
              }`}
            >
              {c.emoji} {c.nombre}
            </button>
          ))}
        </div>
      </div>

      <input
        name="descripcion"
        placeholder="Descripcion (opcional): menu del mediodia…"
        aria-label="Descripcion"
        className="h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
      />

      <div className="flex items-center justify-between gap-3">
        {tipo === 'gasto' ? (
          <button
            type="button"
            onClick={() => setImpulsivo((v) => !v)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              impulsivo ? 'border-amber-500/50 bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'border-border text-muted-foreground'
            }`}
          >
            {impulsivo ? '⚡ Fue un impulso' : '¿Fue un impulso?'}
          </button>
        ) : (
          <span />
        )}
        <Boton type="submit" disabled={enviando}>
          {enviando ? <Loader2 size={16} className="animate-spin" /> : hecho ? <Check size={16} /> : null}
          {hecho ? 'Apuntado' : 'Apuntar'}
        </Boton>
      </div>
    </form>
  );
}
