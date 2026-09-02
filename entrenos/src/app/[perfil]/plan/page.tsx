'use client';

import Link from 'next/link';
import { resumenCuerpo } from '@/lib/cuerpo';
import { alternativas, ejercicio } from '@/lib/ejercicios';
import { useEstado } from '@/lib/estado-cliente';
import { ETIQUETA_OBJETIVO, entero, minSeg, num } from '@/lib/formato';
import { planNutricional } from '@/lib/nutricion';
import { esIsometrico, generarPlan, planDesactualizado, prescripcion, volumenSemanal } from '@/lib/planificador';

export default function PaginaPlan() {
  const { estado, actualizar } = useEstado();
  const { perfil, plan, mediciones } = estado;

  const cuerpo = resumenCuerpo(perfil, mediciones);
  const nutricion = cuerpo.peso ? planNutricional(perfil, cuerpo.peso, cuerpo.grasaPct) : null;

  const regenerar = () => actualizar((e) => ({ ...e, plan: generarPlan(e.perfil) }));

  const cambiarEjercicio = (diaId: string, indice: number, nuevoId: string) =>
    actualizar((e) => {
      if (!e.plan) return e;
      return {
        ...e,
        plan: {
          ...e.plan,
          dias: e.plan.dias.map((d) =>
            d.id !== diaId
              ? d
              : {
                  ...d,
                  bloques: d.bloques.map((b, i) =>
                    i !== indice
                      ? b
                      : { ejercicioId: nuevoId, rol: b.rol, ...prescripcion(b.rol, e.perfil.objetivo, e.perfil.nivel, nuevoId) },
                  ),
                },
          ),
        },
      };
    });

  if (!plan) {
    return (
      <main>
        <h1>Tu plan</h1>
        <div className="tarjeta destacada">
          <p>Aun no hay plan generado. Lo monto con tu objetivo, nivel, dias disponibles y material.</p>
          <button className="boton" onClick={regenerar}>Generar mi plan</button>
        </div>
      </main>
    );
  }

  const volumen = volumenSemanal(plan);
  const maxVolumen = Math.max(...volumen.map((v) => v.series), 1);

  return (
    <main>
      <h1>Tu plan</h1>
      <p className="vacio">
        {plan.dias.length} dias por semana · {ETIQUETA_OBJETIVO[perfil.objetivo].toLowerCase()} ·
        generado el {new Date(plan.generadoEl).toLocaleDateString('es-ES')}
      </p>

      {planDesactualizado(plan, perfil) && (
        <div className="aviso atencion">
          <strong>Has cambiado tu perfil</strong>
          Este plan se genero con los datos anteriores.
          <button className="boton pequeno" style={{ marginTop: 8 }} onClick={regenerar}>Regenerar</button>
        </div>
      )}

      {nutricion ? (
        <div className="tarjeta">
          <div className="tarjeta-cabecera">
            <h2>Nutricion</h2>
            <span className="badge">{entero(nutricion.calorias)} kcal/dia</span>
          </div>
          <table className="tabla">
            <thead>
              <tr><th>Macro</th><th className="num">Gramos</th><th className="num">Kcal</th><th className="num">%</th></tr>
            </thead>
            <tbody>
              {nutricion.desglose.map((m) => (
                <tr key={m.nombre}>
                  <td>{m.nombre}</td>
                  <td className="num">{entero(m.gramos)} g</td>
                  <td className="num">{entero(m.kcal)}</td>
                  <td className="num">{m.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="ayuda" style={{ marginTop: 12 }}>
            Metabolismo basal {entero(nutricion.tmb)} kcal · gasto diario estimado {entero(nutricion.gastoTotal)} kcal ·
            objetivo de ritmo {num(nutricion.ritmoKgSemana, 2)} kg/semana · agua ~{entero(nutricion.aguaMl)} ml ·
            {' '}{entero(nutricion.pasos)} pasos al dia.
          </p>
        </div>
      ) : (
        <div className="aviso atencion">
          <strong>Falta tu peso</strong>
          <Link href={`/${perfil.id}/medidas`}>Anota una medicion</Link> y calculo calorias y macros.
        </div>
      )}

      {plan.dias.map((dia) => (
        <div className="tarjeta" key={dia.id}>
          <div className="tarjeta-cabecera">
            <h2>{dia.nombre}</h2>
            <Link className="boton pequeno secundario" href={`/${perfil.id}/entreno/${dia.id}`}>Entrenar</Link>
          </div>
          <p className="vacio" style={{ marginTop: -6 }}>{dia.foco}</p>

          {dia.bloques.map((bloque, indice) => {
            const info = ejercicio(bloque.ejercicioId);
            const opciones = alternativas(bloque.ejercicioId, perfil.entorno, perfil.limitaciones);
            const unidad = esIsometrico(bloque.ejercicioId) ? 's' : 'reps';
            return (
              <div className="ejercicio" key={`${dia.id}-${indice}`}>
                <h4>{info?.nombre ?? bloque.ejercicioId}</h4>
                <div className="pauta">
                  {bloque.series} series × {bloque.repMin}-{bloque.repMax} {unidad} · RIR {bloque.rir} ·
                  descanso {minSeg(bloque.descansoSeg)}{' '}
                  <span className={`badge ${bloque.rol === 'principal' ? 'principal' : ''}`}>{bloque.rol}</span>
                </div>
                {info && <p className="consejo">{info.tecnica}</p>}
                {opciones.length > 1 && (
                  <div className="campo" style={{ marginTop: 10, marginBottom: 0 }}>
                    <label htmlFor={`alt-${dia.id}-${indice}`}>Cambiar por</label>
                    <select
                      id={`alt-${dia.id}-${indice}`}
                      value={bloque.ejercicioId}
                      onChange={(e) => cambiarEjercicio(dia.id, indice, e.target.value)}
                    >
                      {opciones.map((o) => (
                        <option key={o.id} value={o.id}>{o.nombre}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            );
          })}

          {dia.cardio && <p className="consejo">Cardio: {dia.cardio}</p>}
        </div>
      ))}

      <div className="tarjeta">
        <h3>Volumen semanal por musculo</h3>
        {volumen.map((v) => (
          <div className="barra-volumen" key={v.musculo}>
            <span className="nombre">{v.musculo}</span>
            <span className="pista"><span className="relleno" style={{ width: `${(v.series / maxVolumen) * 100}%` }} /></span>
            <span>{v.series}</span>
          </div>
        ))}
        <p className="ayuda" style={{ marginTop: 10 }}>
          Entre 10 y 20 series semanales por grupo muscular es el rango donde casi todo el mundo progresa.
        </p>
      </div>

      <div className="tarjeta">
        <h3>Como usar el plan</h3>
        <ul className="lista">
          {plan.notas.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <button className="boton secundario" style={{ marginTop: 14 }} onClick={regenerar}>
          Regenerar plan desde cero
        </button>
      </div>
    </main>
  );
}
