'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ejercicio } from '@/lib/ejercicios';
import { useEstado } from '@/lib/estado-cliente';
import { fechaLarga, hoy, id as nuevoId, minSeg, num } from '@/lib/formato';
import { esIsometrico } from '@/lib/planificador';
import { seriesCompletadas, sugerencia, tonelaje } from '@/lib/progresion';
import type { Bloque, Serie, Sesion } from '@/lib/types';

export default function PaginaEntreno() {
  const { estado, actualizar } = useEstado();
  const parametros = useParams<{ perfil: string; dia: string }>();
  const router = useRouter();
  const [descanso, setDescanso] = useState<number | null>(null);

  const { perfil, plan, sesiones } = estado;
  const dia = plan?.dias.find((d) => d.id === parametros.dia) ?? null;
  const fecha = hoy();

  const sesion = useMemo(
    () => sesiones.find((s) => s.fecha === fecha && s.diaId === parametros.dia) ?? null,
    [sesiones, fecha, parametros.dia],
  );

  // Al abrir el dia se crea (una sola vez) la sesion de hoy con el peso sugerido.
  useEffect(() => {
    if (!dia || sesion) return;
    actualizar((e) => {
      if (e.sesiones.some((s) => s.fecha === fecha && s.diaId === dia.id)) return e;
      const nueva: Sesion = {
        id: nuevoId(),
        fecha,
        diaId: dia.id,
        nombre: dia.nombre,
        completada: false,
        sensacion: null,
        ejercicios: dia.bloques.map((bloque) => ({
          ejercicioId: bloque.ejercicioId,
          series: Array.from({ length: bloque.series }, () => ({
            pesoKg: sugerencia(bloque, e.sesiones).pesoKg,
            reps: null,
            rir: null,
            hecha: false,
          })),
        })),
      };
      return { ...e, sesiones: [...e.sesiones, nueva] };
    });
  }, [dia, sesion, fecha, actualizar]);

  // Cuenta atras del descanso entre series.
  useEffect(() => {
    if (descanso === null) return;
    if (descanso <= 0) {
      setDescanso(null);
      return;
    }
    const t = setTimeout(() => setDescanso((v) => (v === null ? null : v - 1)), 1000);
    return () => clearTimeout(t);
  }, [descanso]);

  const historial = useMemo(
    () => sesiones.filter((s) => s.id !== sesion?.id && s.completada),
    [sesiones, sesion?.id],
  );

  if (!plan || !dia) {
    return (
      <main>
        <h1>Entreno</h1>
        <div className="aviso atencion">
          <strong>No encuentro ese dia</strong>
          Puede que hayas regenerado el plan. <Link href={`/${perfil.id}/plan`}>Ver mi plan →</Link>
        </div>
      </main>
    );
  }

  if (!sesion) return <p className="cargando">Preparando la sesion…</p>;

  const editarSerie = (indiceEjercicio: number, indiceSerie: number, cambios: Partial<Serie>) =>
    actualizar((e) => ({
      ...e,
      sesiones: e.sesiones.map((s) =>
        s.id !== sesion.id
          ? s
          : {
              ...s,
              ejercicios: s.ejercicios.map((ej, i) =>
                i !== indiceEjercicio
                  ? ej
                  : { ...ej, series: ej.series.map((se, j) => (j !== indiceSerie ? se : { ...se, ...cambios })) },
              ),
            },
      ),
    }));

  const cambiarSeries = (indiceEjercicio: number, delta: number) =>
    actualizar((e) => ({
      ...e,
      sesiones: e.sesiones.map((s) =>
        s.id !== sesion.id
          ? s
          : {
              ...s,
              ejercicios: s.ejercicios.map((ej, i) => {
                if (i !== indiceEjercicio) return ej;
                if (delta > 0) {
                  const ultima = ej.series[ej.series.length - 1];
                  return { ...ej, series: [...ej.series, { pesoKg: ultima?.pesoKg ?? null, reps: null, rir: null, hecha: false }] };
                }
                return { ...ej, series: ej.series.length > 1 ? ej.series.slice(0, -1) : ej.series };
              }),
            },
      ),
    }));

  const editarSesion = (cambios: Partial<Sesion>) =>
    actualizar((e) => ({
      ...e,
      sesiones: e.sesiones.map((s) => (s.id !== sesion.id ? s : { ...s, ...cambios })),
    }));

  const terminar = () => {
    editarSesion({ completada: true });
    router.push(`/${perfil.id}`);
  };

  const numero = (v: string): number | null => {
    const limpio = v.replace(',', '.').trim();
    if (!limpio) return null;
    const n = Number(limpio);
    return Number.isFinite(n) ? n : null;
  };

  const totalSeries = sesion.ejercicios.reduce((t, e) => t + e.series.length, 0);
  const hechas = seriesCompletadas(sesion);

  return (
    <main>
      <h1>{dia.nombre}</h1>
      <p className="vacio">{fechaLarga(fecha)} · {hechas} de {totalSeries} series · {num(tonelaje(sesion), 0)} kg movidos</p>

      {descanso !== null && (
        <div className="aviso ok">
          <strong>Descanso</strong>
          Quedan {minSeg(descanso)}.{' '}
          <button className="boton pequeno fantasma" onClick={() => setDescanso(null)}>Saltar</button>
        </div>
      )}

      {sesion.ejercicios.map((registro, indiceEjercicio) => {
        const bloque: Bloque | undefined = dia.bloques.find((b) => b.ejercicioId === registro.ejercicioId);
        const info = ejercicio(registro.ejercicioId);
        const pauta = bloque ?? { series: registro.series.length, repMin: 8, repMax: 12, rir: 2, descansoSeg: 90, ejercicioId: registro.ejercicioId, rol: 'secundario' as const };
        const consejo = sugerencia(pauta, historial);
        const unidad = esIsometrico(registro.ejercicioId) ? 'seg' : 'reps';

        return (
          <div className="ejercicio" key={registro.ejercicioId + indiceEjercicio}>
            <h4>{info?.nombre ?? registro.ejercicioId}</h4>
            <div className="pauta">
              {pauta.series} × {pauta.repMin}-{pauta.repMax} {unidad} · RIR {pauta.rir} · descanso {minSeg(pauta.descansoSeg)}
            </div>

            <div className="sugerencia">{consejo.texto}</div>

            <div className="serie-cabecera">
              <span>#</span><span>kg</span><span>{unidad}</span><span>RIR</span><span>✓</span>
            </div>
            <div className="series">
              {registro.series.map((serie, indiceSerie) => (
                <div className={serie.hecha ? 'serie hecha' : 'serie'} key={indiceSerie}>
                  <span className="indice">{indiceSerie + 1}</span>
                  <input
                    type="number" inputMode="decimal" step="0.5" placeholder="—"
                    value={serie.pesoKg ?? ''}
                    onChange={(ev) => editarSerie(indiceEjercicio, indiceSerie, { pesoKg: numero(ev.target.value) })}
                  />
                  <input
                    type="number" inputMode="numeric" placeholder={String(pauta.repMax)}
                    value={serie.reps ?? ''}
                    onChange={(ev) => editarSerie(indiceEjercicio, indiceSerie, { reps: numero(ev.target.value) })}
                  />
                  <input
                    type="number" inputMode="numeric" placeholder={String(pauta.rir)}
                    value={serie.rir ?? ''}
                    onChange={(ev) => editarSerie(indiceEjercicio, indiceSerie, { rir: numero(ev.target.value) })}
                  />
                  <button
                    className="marcar"
                    aria-label={serie.hecha ? 'Desmarcar serie' : 'Marcar serie hecha'}
                    onClick={() => {
                      const hecha = !serie.hecha;
                      editarSerie(indiceEjercicio, indiceSerie, { hecha });
                      setDescanso(hecha ? pauta.descansoSeg : null);
                    }}
                  >
                    {serie.hecha ? '✓' : '○'}
                  </button>
                </div>
              ))}
            </div>

            <div className="botonera" style={{ marginTop: 10 }}>
              <button className="boton fantasma pequeno" onClick={() => cambiarSeries(indiceEjercicio, 1)}>+ serie</button>
              <button className="boton fantasma pequeno" onClick={() => cambiarSeries(indiceEjercicio, -1)}>− serie</button>
            </div>

            {consejo.referencia && (
              <p className="consejo">
                Ultima vez ({consejo.referencia.fecha}):{' '}
                {consejo.referencia.series.map((s) => `${s.pesoKg ?? '—'}×${s.reps ?? '—'}`).join('  ·  ')}
              </p>
            )}
            {info && <p className="consejo">{info.tecnica}</p>}
          </div>
        );
      })}

      <div className="tarjeta">
        <h3>Como ha ido</h3>
        <div className="chips">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              className={sesion.sensacion === n ? 'chip activo' : 'chip'}
              onClick={() => editarSesion({ sensacion: n })}
            >
              {['Fatal', 'Flojo', 'Normal', 'Bien', 'Brutal'][n - 1]}
            </button>
          ))}
        </div>
        <div className="campo" style={{ marginTop: 14 }}>
          <label htmlFor="notas-sesion">Notas de la sesion</label>
          <textarea
            id="notas-sesion" rows={2} placeholder="Molestias, cambios de ejercicio, sensaciones…"
            value={sesion.notas ?? ''}
            onChange={(ev) => editarSesion({ notas: ev.target.value })}
          />
        </div>
        {sesion.completada ? (
          <div className="aviso ok"><strong>Sesion terminada</strong>Puedes seguir editando lo que quieras.</div>
        ) : (
          <button className="boton" onClick={terminar}>Terminar entreno</button>
        )}
      </div>
    </main>
  );
}
