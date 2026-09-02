'use client';

import Link from 'next/link';
import { resumenCuerpo } from '@/lib/cuerpo';
import { useEstado } from '@/lib/estado-cliente';
import { ETIQUETA_OBJETIVO, entero, fechaLarga, hoy, num } from '@/lib/formato';
import { ajusteCalorico, planNutricional } from '@/lib/nutricion';
import { generarPlan, planDesactualizado } from '@/lib/planificador';
import { inicioSemana, proximoDia } from '@/lib/progresion';

export default function PaginaHoy() {
  const { estado, actualizar } = useEstado();
  const { perfil, plan, mediciones, sesiones } = estado;

  const cuerpo = resumenCuerpo(perfil, mediciones);
  const nutricion = cuerpo.peso ? planNutricional(perfil, cuerpo.peso, cuerpo.grasaPct) : null;
  const ajuste = nutricion ? ajusteCalorico(nutricion, cuerpo.tendencia, perfil.objetivo) : null;

  const semana = inicioSemana(hoy());
  const entrenosSemana = sesiones.filter((s) => s.completada && inicioSemana(s.fecha) >= semana).length;

  const siguiente = plan ? plan.dias.find((d) => d.id === proximoDia(plan, sesiones)) ?? plan.dias[0] : null;
  const sesionHoy = sesiones.find((s) => s.fecha === hoy());

  const crearPlan = () => actualizar((e) => ({ ...e, plan: generarPlan(e.perfil) }));

  return (
    <main>
      <h1>Hola, {perfil.nombre}</h1>
      <p className="vacio">{fechaLarga(hoy())} · Objetivo: {ETIQUETA_OBJETIVO[perfil.objetivo].toLowerCase()}</p>

      {!mediciones.length && (
        <div className="aviso atencion">
          <strong>Empieza por tus datos</strong>
          Sin peso ni medidas no puedo calcular calorias ni seguir tu progreso.{' '}
          <Link href={`/${perfil.id}/medidas`}>Anotar mi primera medicion →</Link>
        </div>
      )}

      {!plan && (
        <div className="tarjeta destacada">
          <h2>Todavia no tienes plan</h2>
          <p>Reviso tu objetivo, tu nivel, los dias que puedes entrenar y el material que tienes, y monto la rutina.</p>
          <button className="boton" onClick={crearPlan}>Generar mi plan</button>
        </div>
      )}

      {plan && planDesactualizado(plan, perfil) && (
        <div className="aviso atencion">
          <strong>Tu plan se ha quedado antiguo</strong>
          Has cambiado datos del perfil que afectan a la rutina.{' '}
          <Link href={`/${perfil.id}/plan`}>Regenerar el plan →</Link>
        </div>
      )}

      <div className="kpis">
        <div className="kpi">
          <div className="etiqueta">Peso</div>
          <div className="valor">{num(cuerpo.peso)}<small> kg</small></div>
          <div className="pie">{cuerpo.tendencia !== null ? `${cuerpo.tendencia > 0 ? '+' : ''}${num(cuerpo.tendencia, 2)} kg/sem` : 'sin tendencia aun'}</div>
        </div>
        <div className="kpi">
          <div className="etiqueta">Grasa est.</div>
          <div className="valor">{num(cuerpo.grasaPct)}<small> %</small></div>
          <div className="pie">{cuerpo.masaMagra ? `${num(cuerpo.masaMagra)} kg magros` : 'faltan perimetros'}</div>
        </div>
        <div className="kpi">
          <div className="etiqueta">Kcal / dia</div>
          <div className="valor">{nutricion ? entero(nutricion.calorias) : '—'}</div>
          <div className="pie">{nutricion ? `${nutricion.proteinaG} g proteina` : 'falta el peso'}</div>
        </div>
        <div className="kpi">
          <div className="etiqueta">Esta semana</div>
          <div className="valor">{entrenosSemana}<small> / {perfil.diasPorSemana}</small></div>
          <div className="pie">entrenos hechos</div>
        </div>
      </div>

      {siguiente && (
        <div className="tarjeta destacada" style={{ marginTop: 16 }}>
          <div className="tarjeta-cabecera">
            <h2>{sesionHoy && sesionHoy.completada ? 'Hoy ya has entrenado' : 'Toca hoy'}</h2>
            <span className="badge">{siguiente.bloques.length} ejercicios</span>
          </div>
          <p style={{ marginBottom: 6 }}><strong>{siguiente.nombre}</strong></p>
          <p className="vacio" style={{ marginBottom: 14 }}>{siguiente.foco}</p>
          <Link className="boton" href={`/${perfil.id}/entreno/${siguiente.id}`}>
            {sesionHoy ? 'Seguir con la sesion' : 'Empezar entreno'}
          </Link>
        </div>
      )}

      {ajuste && (
        <div className={`aviso ${ajuste.estado === 'ok' ? 'ok' : ajuste.estado === 'sin_datos' ? '' : 'atencion'}`}>
          <strong>Ajuste de calorias</strong>
          {ajuste.mensaje}
        </div>
      )}

      <div className="tarjeta">
        <h3>Ultimos entrenos</h3>
        {sesiones.filter((s) => s.completada).length === 0 ? (
          <p className="vacio">Aun no hay sesiones registradas.</p>
        ) : (
          <ul className="lista">
            {[...sesiones]
              .filter((s) => s.completada)
              .sort((a, b) => b.fecha.localeCompare(a.fecha))
              .slice(0, 4)
              .map((s) => (
                <li key={s.id}>
                  <div className="titulo">{s.nombre}</div>
                  <div className="meta">{fechaLarga(s.fecha)}</div>
                </li>
              ))}
          </ul>
        )}
      </div>
    </main>
  );
}
