'use client';

import { useState } from 'react';
import Grafica from '@/components/Grafica';
import { nombreEjercicio } from '@/lib/ejercicios';
import { useEstado } from '@/lib/estado-cliente';
import { entero, fechaLarga, num } from '@/lib/formato';
import { mejorMarca, seriesCompletadas, sesionesPorSemana, tonelaje, unaRm } from '@/lib/progresion';
import type { Sesion } from '@/lib/types';

/** Mejor 1RM estimado de cada sesion, para ver si el ejercicio sube. */
function serieFuerza(sesiones: Sesion[], ejercicioId: string) {
  return [...sesiones]
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .map((s) => {
      const registro = s.ejercicios.find((e) => e.ejercicioId === ejercicioId);
      if (!registro) return null;
      const marcas = registro.series
        .filter((x) => x.hecha && x.reps && x.pesoKg)
        .map((x) => unaRm(x.pesoKg as number, x.reps as number));
      if (!marcas.length) return null;
      return { fecha: s.fecha, valor: Math.max(...marcas) };
    })
    .filter((p): p is { fecha: string; valor: number } => p !== null);
}

export default function PaginaProgreso() {
  const { estado } = useEstado();
  const { sesiones, plan } = estado;
  const completadas = sesiones.filter((s) => s.completada);

  const ejerciciosSeguidos = Array.from(
    new Set([
      ...(plan?.dias.flatMap((d) => d.bloques.filter((b) => b.rol === 'principal').map((b) => b.ejercicioId)) ?? []),
      ...completadas.flatMap((s) => s.ejercicios.map((e) => e.ejercicioId)),
    ]),
  );
  const [seleccionado, setSeleccionado] = useState(ejerciciosSeguidos[0] ?? '');

  const porSemana = sesionesPorSemana(completadas, 8);
  const maxSemana = Math.max(...porSemana.map((s) => s.total), 1);
  const tonelajeTotal = completadas.reduce((t, s) => t + tonelaje(s), 0);
  const datosFuerza = seleccionado ? serieFuerza(completadas, seleccionado) : [];
  const marca = seleccionado ? mejorMarca(completadas, seleccionado) : null;

  return (
    <main>
      <h1>Progreso</h1>
      <p className="vacio">Lo que se mide, mejora. Aqui esta todo lo que has levantado.</p>

      <div className="kpis">
        <div className="kpi">
          <div className="etiqueta">Entrenos</div>
          <div className="valor">{completadas.length}</div>
          <div className="pie">en total</div>
        </div>
        <div className="kpi">
          <div className="etiqueta">Series</div>
          <div className="valor">{completadas.reduce((t, s) => t + seriesCompletadas(s), 0)}</div>
          <div className="pie">completadas</div>
        </div>
        <div className="kpi">
          <div className="etiqueta">Tonelaje</div>
          <div className="valor">{entero(tonelajeTotal / 1000)}<small> t</small></div>
          <div className="pie">peso × reps</div>
        </div>
        <div className="kpi">
          <div className="etiqueta">Ultimo</div>
          <div className="valor" style={{ fontSize: 15 }}>
            {completadas.length ? fechaLarga([...completadas].sort((a, b) => b.fecha.localeCompare(a.fecha))[0].fecha) : '—'}
          </div>
          <div className="pie">entreno</div>
        </div>
      </div>

      <div className="tarjeta" style={{ marginTop: 16 }}>
        <h3>Constancia (ultimas semanas)</h3>
        {!porSemana.length ? (
          <p className="vacio">Sin entrenos registrados todavia.</p>
        ) : (
          porSemana.map((s) => (
            <div className="barra-volumen" key={s.semana}>
              <span className="nombre">{s.semana.slice(8)}/{s.semana.slice(5, 7)}</span>
              <span className="pista"><span className="relleno" style={{ width: `${(s.total / maxSemana) * 100}%` }} /></span>
              <span>{s.total}</span>
            </div>
          ))
        )}
      </div>

      {ejerciciosSeguidos.length > 0 && (
        <div className="tarjeta">
          <h3>Fuerza por ejercicio</h3>
          <div className="campo">
            <label htmlFor="ejercicio">Ejercicio</label>
            <select id="ejercicio" value={seleccionado} onChange={(e) => setSeleccionado(e.target.value)}>
              {ejerciciosSeguidos.map((id) => (
                <option key={id} value={id}>{nombreEjercicio(id)}</option>
              ))}
            </select>
          </div>
          <Grafica datos={datosFuerza} unidad=" kg" color="var(--brand-2)" />
          {marca ? (
            <p className="ayuda" style={{ marginTop: 10 }}>
              Mejor serie: {num(marca.pesoKg)} kg × {marca.reps} reps ({fechaLarga(marca.fecha)}) ·
              1RM estimado {num(marca.e1rm)} kg.
            </p>
          ) : (
            <p className="ayuda">Registra series con peso y repeticiones para ver la curva.</p>
          )}
        </div>
      )}

      <div className="tarjeta">
        <h3>Historial</h3>
        {!completadas.length ? (
          <p className="vacio">Aqui apareceran tus sesiones cuando termines la primera.</p>
        ) : (
          <ul className="lista">
            {[...completadas]
              .sort((a, b) => b.fecha.localeCompare(a.fecha))
              .map((s) => (
                <li key={s.id}>
                  <div className="titulo">{s.nombre}</div>
                  <div className="meta">
                    {fechaLarga(s.fecha)} · {seriesCompletadas(s)} series · {entero(tonelaje(s))} kg
                    {s.sensacion ? ` · sensacion ${s.sensacion}/5` : ''}
                  </div>
                  {s.notas && <div className="meta">“{s.notas}”</div>}
                </li>
              ))}
          </ul>
        )}
      </div>
    </main>
  );
}
