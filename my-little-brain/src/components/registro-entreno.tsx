'use client';

import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { anadirAlPlan, guardarEntreno, type SeriePayload } from '@/app/app/acciones';
import { Boton, Campo, Selector, Tarjeta } from '@/components/ui/base';
import { TIPOS_CARDIO, enlaceTecnica, kcalCardio } from '@/lib/motor/cardio';
import type { Bloque } from '@/lib/motor/tipos-motor';
import { cn } from '@/lib/utils';

export interface BloqueVista extends Bloque {
  nombre: string;
  tecnica: string;
  sugerencia: string;
  pesoSugerido: number | null;
  /** Ultima sesion registrada de este ejercicio, para verla al lado del registro. */
  ultima?: UltimaVez | null;
  esIsometrico: boolean;
  /** Anadido a mano en esta sesion (no viene del plan). */
  extra?: boolean;
  /** Si ademas quiere guardarlo en el plan de este dia. */
  alPlan?: boolean;
}

export interface UltimaVez {
  fecha: string;
  series: { pesoKg: number | null; reps: number | null }[];
}

export interface OpcionCatalogo {
  id: string;
  nombre: string;
  grupo: string;
  tecnica: string;
  pesoSugerido: number | null;
  sugerencia: string;
  ultima?: UltimaVez | null;
}

const fechaBreve = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

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
  pesoKg,
  claveBorrador,
  catalogo,
}: {
  diaId: string;
  nombre: string;
  bloques: BloqueVista[];
  /** Peso corporal para estimar las calorias del cardio. */
  pesoKg: number;
  /** Clave unica de usuario+dia+fecha para el borrador local. */
  claveBorrador: string;
  /** Catalogo completo para poder anadir ejercicios a la sesion. */
  catalogo: OpcionCatalogo[];
}) {
  const router = useRouter();
  const [extras, setExtras] = useState<BloqueVista[]>([]);
  const todos = [...bloques, ...extras];

  const filasPara = (bloque: BloqueVista): SerieEditable[] =>
    Array.from({ length: bloque.series }, () => ({
      peso: bloque.pesoSugerido !== null ? String(bloque.pesoSugerido) : '',
      reps: '',
      rir: '',
      hecha: false,
    }));

  const inicial = (): SerieEditable[][] =>
    bloques.map((bloque) =>
      Array.from({ length: bloque.series }, () => ({
        peso: bloque.pesoSugerido !== null ? String(bloque.pesoSugerido) : '',
        reps: '',
        rir: '',
        hecha: false,
      })),
    );

  // Borrador local: lo que escribes se guarda al momento en este navegador,
  // asi que bloquear el movil o salir a mitad no pierde nada.
  const claveLocal = `mlb:borrador:${claveBorrador}`;
  const leerBorrador = () => {
    try {
      const crudo = window.localStorage.getItem(claveLocal);
      if (!crudo) return null;
      const b = JSON.parse(crudo) as {
        estado?: SerieEditable[][]; extras?: BloqueVista[]; sensacion?: number | null;
        notas?: string; cardioTipo?: string; cardioMin?: string;
      };
      const extrasGuardados = Array.isArray(b.extras) ? b.extras : [];
      if (!Array.isArray(b.estado) || b.estado.length !== bloques.length + extrasGuardados.length) return null;
      return { ...b, extras: extrasGuardados };
    } catch {
      return null;
    }
  };

  const [estado, setEstado] = useState<SerieEditable[][]>(inicial);
  const [sensacion, setSensacion] = useState<number | null>(null);
  const [notas, setNotas] = useState('');
  const [restaurado, setRestaurado] = useState(false);
  const hidratado = useRef(false);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState('');
  const [descanso, setDescanso] = useState<number | null>(null);
  const [cardioTipo, setCardioTipo] = useState('');
  const [cardioMin, setCardioMin] = useState('');
  const cardioKcal = cardioTipo && Number(cardioMin) > 0 ? kcalCardio(cardioTipo, Number(cardioMin), pesoKg) : 0;

  // Al montar: restaurar el borrador si lo hay (solo en el navegador).
  useEffect(() => {
    const b = leerBorrador();
    if (b) {
      if (b.estado) setEstado(b.estado);
      setExtras(b.extras ?? []);
      setSensacion(b.sensacion ?? null);
      setNotas(b.notas ?? '');
      setCardioTipo(b.cardioTipo ?? '');
      setCardioMin(b.cardioMin ?? '');
      setRestaurado(true);
    }
    hidratado.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveLocal]);

  // Cada cambio se guarda; si no hay nada escrito, se borra el borrador.
  useEffect(() => {
    if (!hidratado.current) return;
    const hayAlgo =
      estado.some((filas) => filas.some((f) => f.hecha || f.reps || f.rir)) || notas || sensacion || cardioTipo || extras.length;
    try {
      if (hayAlgo) {
        window.localStorage.setItem(claveLocal, JSON.stringify({ estado, extras, sensacion, notas, cardioTipo, cardioMin }));
      } else {
        window.localStorage.removeItem(claveLocal);
      }
    } catch {
      // Sin espacio o modo privado: seguimos sin borrador.
    }
  }, [estado, extras, sensacion, notas, cardioTipo, cardioMin, claveLocal]);

  const editar = (bloque: number, serie: number, cambios: Partial<SerieEditable>) =>
    setEstado((previo) =>
      previo.map((filas, i) =>
        i !== bloque ? filas : filas.map((fila, j) => (j !== serie ? fila : { ...fila, ...cambios })),
      ),
    );

  const [seleccion, setSeleccion] = useState('');
  const [libre, setLibre] = useState('');

  const anadirEjercicio = () => {
    let nuevo: BloqueVista | null = null;
    if (seleccion) {
      const o = catalogo.find((c) => c.id === seleccion);
      if (o) {
        nuevo = {
          ejercicioId: o.id, rol: 'accesorio', series: 3, repMin: 8, repMax: 12, rir: 2, descansoSeg: 90,
          nombre: o.nombre, tecnica: o.tecnica, sugerencia: o.sugerencia, pesoSugerido: o.pesoSugerido,
          ultima: o.ultima ?? null, esIsometrico: false, extra: true, alPlan: false,
        };
      }
    } else if (libre.trim()) {
      const slug = libre.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').slice(0, 40);
      nuevo = {
        ejercicioId: `libre_${slug}`, rol: 'accesorio', series: 3, repMin: 8, repMax: 12, rir: 2, descansoSeg: 90,
        nombre: libre.trim(), tecnica: '', sugerencia: 'Ejercicio propio: apunta el peso que uses y la proxima vez te digo como progresar.',
        pesoSugerido: null, esIsometrico: false, extra: true, alPlan: false,
      };
    }
    if (!nuevo) return;
    if (todos.some((b) => b.ejercicioId === nuevo!.ejercicioId)) return;
    setExtras((previos) => [...previos, nuevo!]);
    setEstado((previo) => [...previo, filasPara(nuevo!)]);
    setSeleccion('');
    setLibre('');
  };

  const [guardandoPlan, setGuardandoPlan] = useState(false);
  const [avisoPlan, setAvisoPlan] = useState('');

  /** Anade el ejercicio elegido al plan de este dia sin necesidad de registrar sesion. */
  const guardarEnPlanAhora = async () => {
    const o = seleccion ? catalogo.find((c) => c.id === seleccion) : null;
    const id = o ? o.id : libre.trim() ? `libre_${libre.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').slice(0, 40)}` : '';
    const nombreEj = o ? o.nombre : libre.trim();
    if (!id) return;
    setGuardandoPlan(true);
    try {
      await anadirAlPlan(diaId, id, nombreEj);
      setAvisoPlan(`${nombreEj} ya esta en el plan de este dia.`);
      setSeleccion('');
      setLibre('');
      router.refresh();
    } finally {
      setGuardandoPlan(false);
    }
  };

  const quitarExtra = (indiceGlobal: number) => {
    const indiceExtra = indiceGlobal - bloques.length;
    if (indiceExtra < 0) return;
    setExtras((previos) => previos.filter((_, i) => i !== indiceExtra));
    setEstado((previo) => previo.filter((_, i) => i !== indiceGlobal));
  };

  const alternarAlPlan = (indiceGlobal: number) => {
    const indiceExtra = indiceGlobal - bloques.length;
    setExtras((previos) => previos.map((b, i) => (i !== indiceExtra ? b : { ...b, alPlan: !b.alPlan })));
  };

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
        // Marcar la serie sin escribir nada significa "he hecho lo que pone":
        // se guardan las reps y el RIR del plan (los que se ven en gris).
        const bloque = todos[indiceBloque];
        series.push({
          ejercicio_id: bloque.ejercicioId,
          ejercicio_nombre: bloque.nombre,
          orden: indiceBloque,
          serie: indiceSerie + 1,
          peso_kg: fila.peso ? Number(fila.peso.replace(',', '.')) : null,
          reps: fila.reps ? Number(fila.reps) : fila.hecha ? bloque.repMax : null,
          rir: fila.rir ? Number(fila.rir) : fila.hecha ? bloque.rir : null,
        });
      });
    });

    setErrorGuardar('');
    let resultado: Awaited<ReturnType<typeof guardarEntreno>>;
    try {
      resultado = await guardarEntreno({
        nombre,
        dia_plan: diaId,
        sensacion,
        notas: notas || null,
        series,
        cardio: cardioTipo && Number(cardioMin) > 0 ? { tipo: cardioTipo, minutos: Number(cardioMin), kcal: cardioKcal } : null,
      });
    } catch (e) {
      setGuardando(false);
      setErrorGuardar(`No se ha podido guardar: ${(e as Error).message}. Tus series siguen aqui; reintenta.`);
      return;
    }
    if (!resultado.ok) {
      setGuardando(false);
      setErrorGuardar(`No se ha podido guardar: ${resultado.error}. Tus series siguen aqui; reintenta.`);
      return;
    }
    if (resultado.aviso) window.alert(resultado.aviso);
    for (const extra of extras.filter((e) => e.alPlan)) {
      await anadirAlPlan(diaId, extra.ejercicioId, extra.nombre);
    }
    try {
      window.localStorage.removeItem(claveLocal);
    } catch {
      // nada
    }
    setGuardando(false);
    router.push('/app');
    router.refresh();
  };

  const totalHechas = estado.flat().filter((s) => s.hecha).length;

  return (
    <div className="space-y-3">
      {restaurado && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm">
          He recuperado lo que llevabas de esta sesion. Sigue donde lo dejaste.
        </p>
      )}
      {descanso !== null && (
        <div className="sticky top-2 z-10 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm">
          Descanso sugerido: {Math.round(descanso / 60)} min {descanso % 60 ? `${descanso % 60} s` : ''}
          <button onClick={() => setDescanso(null)} className="ml-2 text-xs text-muted-foreground underline">
            ocultar
          </button>
        </div>
      )}

      {todos.map((bloque, indiceBloque) => (
        <Tarjeta key={`${bloque.ejercicioId}-${indiceBloque}`}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold">{bloque.nombre}</h3>
            {bloque.extra && (
              <button type="button" onClick={() => quitarExtra(indiceBloque)} className="text-xs text-muted-foreground underline">
                quitar
              </button>
            )}
          </div>
          {bloque.extra && (
            <label className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" checked={Boolean(bloque.alPlan)} onChange={() => alternarAlPlan(indiceBloque)} className="h-4 w-4 rounded border-border bg-muted" />
              Guardarlo en el plan de este dia
            </label>
          )}
          <p className="mt-0.5 text-xs text-muted-foreground">
            {bloque.series} × {bloque.repMin}-{bloque.repMax} {bloque.esIsometrico ? 'seg' : 'reps'} · RIR {bloque.rir} ·
            descanso {Math.round(bloque.descansoSeg / 60)} min
          </p>

          <p className="mt-2 rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-xs">
            {bloque.sugerencia}
          </p>
          {bloque.ultima && (
            <p className="mt-2 text-xs text-muted-foreground tabular-nums">
              <span className="font-medium text-foreground">Ultima vez</span> ({fechaBreve(bloque.ultima.fecha)}):{' '}
              {bloque.ultima.series
                .map((serie) => `${serie.pesoKg ?? 'sin peso'} × ${serie.reps ?? '—'}`)
                .join(' · ')}
            </p>
          )}

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

          <p className="mt-3 border-l-2 border-border pl-3 text-xs text-muted-foreground">
            {bloque.tecnica}{bloque.tecnica ? ' ' : ''}
            <a
              href={enlaceTecnica(bloque.nombre)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Ver como se hace
            </a>
          </p>
        </Tarjeta>
      ))}

      <Tarjeta id="anadir">
        <h3 className="mb-1 font-semibold">Anadir un ejercicio</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Del catalogo o uno tuyo. Si marcas &ldquo;guardarlo en el plan&rdquo;, saldra siempre en este dia.
        </p>
        <div className="space-y-3">
          <Selector etiqueta="Del catalogo" value={seleccion} onChange={(e) => { setSeleccion(e.target.value); if (e.target.value) setLibre(''); }}>
            <option value="">Elegir…</option>
            {[...new Set(catalogo.map((c) => c.grupo))].map((grupo) => (
              <optgroup key={grupo} label={grupo}>
                {catalogo.filter((c) => c.grupo === grupo).map((c) => (
                  <option key={c.id} value={c.id} disabled={todos.some((b) => b.ejercicioId === c.id)}>{c.nombre}</option>
                ))}
              </optgroup>
            ))}
          </Selector>
          <Campo etiqueta="O escribe uno que no este" value={libre} onChange={(e) => { setLibre(e.target.value); if (e.target.value) setSeleccion(''); }} placeholder="Curl nordico, farmer walk…" />
          <div className="grid gap-2 sm:grid-cols-2">
            <Boton type="button" variante="secundario" onClick={anadirEjercicio} disabled={!seleccion && !libre.trim()}>
              + Anadir a la sesion de hoy
            </Boton>
            <Boton type="button" variante="contorno" onClick={guardarEnPlanAhora} disabled={guardandoPlan || (!seleccion && !libre.trim())}>
              {guardandoPlan ? <Loader2 size={16} className="animate-spin" /> : null}
              Guardar en el plan del dia
            </Boton>
          </div>
          {avisoPlan && <p className="text-sm text-emerald-700 dark:text-emerald-300">{avisoPlan}</p>}
        </div>
      </Tarjeta>

      <Tarjeta>
        <h3 className="mb-1 font-semibold">Cardio al acabar</h3>
        <p className="mb-3 text-xs text-muted-foreground">
          Opcional. Las calorias son una estimacion por MET con tu peso ({pesoKg} kg).
        </p>
        <div className="grid grid-cols-[1fr_96px] gap-3">
          <Selector etiqueta="Tipo" value={cardioTipo} onChange={(e) => setCardioTipo(e.target.value)}>
            <option value="">Sin cardio</option>
            {TIPOS_CARDIO.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </Selector>
          <div className="space-y-1.5">
            <label htmlFor="cardio-min" className="block text-sm text-muted-foreground">Minutos</label>
            <input
              id="cardio-min"
              type="number"
              inputMode="numeric"
              min={1}
              value={cardioMin}
              onChange={(e) => setCardioMin(e.target.value)}
              disabled={!cardioTipo}
              className="h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-center text-base outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </div>
        </div>
        {cardioKcal > 0 && (
          <p className="mt-3 text-sm">
            ≈ <strong>{cardioKcal} kcal</strong> en {cardioMin} min.
          </p>
        )}
      </Tarjeta>

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
        {errorGuardar && (
          <p className="mt-3 rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{errorGuardar}</p>
        )}
        <Boton onClick={terminar} disabled={guardando} className="mt-3 w-full">
          {guardando ? <Loader2 size={16} className="animate-spin" /> : null}
          Terminar entreno ({totalHechas} series)
        </Boton>
      </Tarjeta>
    </div>
  );
}
