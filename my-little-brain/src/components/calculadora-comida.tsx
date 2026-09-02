'use client';

import { Loader2 } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { guardarComidaCalculada } from '@/app/app/acciones';
import { Boton, Selector } from '@/components/ui/base';
import { calcularComida } from '@/lib/motor/alimentos';

const EJEMPLO = '200 g pollo, 150 arroz, 1 cucharada de aceite y un platano';

/**
 * Escribes la comida en una linea y sale calculada al momento con la tabla de
 * alimentos: sin IA, sin esperar y siempre con el mismo resultado.
 */
export default function CalculadoraComida() {
  const [texto, setTexto] = useState('');
  const [momento, setMomento] = useState('comida');
  const [guardado, setGuardado] = useState(false);
  const [pendiente, empezar] = useTransition();

  const resultado = useMemo(() => (texto.trim() ? calcularComida(texto) : null), [texto]);
  const reconocidas = resultado?.lineas.filter((l) => l.alimento) ?? [];

  const guardar = () => {
    if (!resultado || !reconocidas.length) return;
    empezar(async () => {
      await guardarComidaCalculada({
        descripcion: resultado.descripcion,
        momento,
        kcal: resultado.kcal,
        proteina_g: Math.round(resultado.proteina),
        carbos_g: Math.round(resultado.carbos),
        grasa_g: Math.round(resultado.grasa),
        alcohol_ud: resultado.alcoholUd,
      });
      setTexto('');
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <label htmlFor="comida-texto" className="block text-sm text-muted-foreground">
          Que has comido, con cantidades
        </label>
        <textarea
          id="comida-texto"
          rows={2}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={EJEMPLO}
          className="w-full rounded-lg border border-input bg-muted/40 p-3 text-base outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground">
          Separa con comas. Vale &ldquo;200 g&rdquo;, &ldquo;2 huevos&rdquo;, &ldquo;una lata de atun&rdquo;,
          &ldquo;1 cucharada de aceite&rdquo;. Si no pones cantidad, uso una racion normal.
        </p>
      </div>

      {resultado && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
          <ul className="space-y-1">
            {resultado.lineas.map((linea, i) =>
              linea.alimento ? (
                <li key={i} className="flex justify-between gap-3">
                  <span>
                    {linea.alimento.nombre}{' '}
                    <span className="text-muted-foreground">· {linea.gramos} g</span>
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {linea.kcal} kcal · {linea.proteina} P
                  </span>
                </li>
              ) : (
                <li key={i} className="text-amber-300">
                  &ldquo;{linea.texto}&rdquo; no esta en la tabla: no suma. Diselo al coach y lo estima.
                </li>
              ),
            )}
          </ul>
          {reconocidas.length > 0 && (
            <p className="mt-2 border-t border-border pt-2 font-semibold tabular-nums">
              {resultado.kcal} kcal · {Math.round(resultado.proteina)} g proteina ·{' '}
              {Math.round(resultado.carbos)} g carbos · {Math.round(resultado.grasa)} g grasa
              {resultado.alcoholUd ? ` · ${resultado.alcoholUd} ud alcohol` : ''}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-[1fr_auto] items-end gap-3">
        <Selector etiqueta="Momento" value={momento} onChange={(e) => setMomento(e.target.value)}>
          {['desayuno', 'comida', 'cena', 'snack', 'bebida'].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </Selector>
        <Boton onClick={guardar} disabled={pendiente || !reconocidas.length}>
          {pendiente && <Loader2 size={16} className="animate-spin" />}
          Guardar
        </Boton>
      </div>
      {guardado && <p className="text-sm text-emerald-300">Comida guardada.</p>}
    </div>
  );
}
