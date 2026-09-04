'use client';

import { Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { actualizarComida, borrarComida } from '@/app/app/acciones';
import { Boton, Insignia } from '@/components/ui/base';
import type { Comida } from '@/lib/tipos';

const MOMENTOS = ['desayuno', 'comida', 'cena', 'snack', 'bebida'];

/** Las comidas de un dia, con edicion en linea: corregir sin borrar y reescribir. */
export default function ListaComidas({ comidas }: { comidas: Comida[] }) {
  const [editando, setEditando] = useState<string | null>(null);

  if (!comidas.length) {
    return (
      <p className="mb-4 text-sm text-muted-foreground">
        Nada apuntado este dia. Lo mas rapido es tocar una de arriba o decirselo al coach.
      </p>
    );
  }

  return (
    <ul className="mb-4 divide-y divide-border">
      {comidas.map((comida) =>
        editando === comida.id ? (
          <li key={comida.id} className="py-3">
            <form action={actualizarComida} onSubmit={() => setEditando(null)} className="space-y-2">
              <input type="hidden" name="id" value={comida.id} />
              <input
                name="descripcion"
                defaultValue={comida.descripcion}
                required
                aria-label="Que has comido"
                className="h-10 w-full rounded-lg border border-input bg-muted/40 px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="grid grid-cols-4 gap-2">
                {([
                  ['kcal', 'kcal', comida.kcal],
                  ['proteina_g', 'P', comida.proteina_g],
                  ['carbos_g', 'C', comida.carbos_g],
                  ['grasa_g', 'G', comida.grasa_g],
                ] as const).map(([campo, etiqueta, valor]) => (
                  <label key={campo} className="text-xs text-muted-foreground">
                    {etiqueta}
                    <input
                      name={campo}
                      type="number"
                      inputMode="numeric"
                      defaultValue={valor ?? ''}
                      required={campo === 'kcal'}
                      className="mt-0.5 h-10 w-full rounded-lg border border-input bg-muted/40 px-2 text-sm tabular-nums outline-none focus:ring-2 focus:ring-ring"
                    />
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <select
                  name="momento"
                  defaultValue={comida.momento ?? 'comida'}
                  aria-label="Momento"
                  className="h-10 flex-1 rounded-lg border border-input bg-muted/40 px-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {MOMENTOS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <Boton type="submit" tamano="sm">Guardar</Boton>
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  aria-label="Cancelar"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>
            </form>
          </li>
        ) : (
          <li key={comida.id} className="flex items-center gap-3 py-2 text-sm">
            <div className="min-w-0 flex-1">
              <div className="truncate">{comida.descripcion}</div>
              <div className="text-xs text-muted-foreground tabular-nums">
                {comida.kcal ?? '—'} kcal · {comida.proteina_g ?? '—'} P · {comida.carbos_g ?? '—'} C · {comida.grasa_g ?? '—'} G
                {comida.confianza === 'baja' && ' · estimacion aproximada'}
              </div>
            </div>
            {comida.momento && <Insignia>{comida.momento}</Insignia>}
            <button
              type="button"
              onClick={() => setEditando(comida.id)}
              aria-label={`Editar ${comida.descripcion}`}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil size={16} />
            </button>
            <form action={borrarComida.bind(null, comida.id)}>
              <button type="submit" aria-label={`Borrar ${comida.descripcion}`} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={16} />
              </button>
            </form>
          </li>
        ),
      )}
    </ul>
  );
}
