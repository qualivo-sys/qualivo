'use client';

import { useEstado } from '@/lib/estado-cliente';
import {
  ETIQUETA_ACTIVIDAD,
  ETIQUETA_ENTORNO,
  ETIQUETA_LIMITACION,
  ETIQUETA_NIVEL,
  ETIQUETA_OBJETIVO,
  ETIQUETA_SEXO,
} from '@/lib/formato';
import { generarPlan, planDesactualizado } from '@/lib/planificador';
import type { Actividad, Entorno, Limitacion, Nivel, Objetivo, Perfil, Sexo } from '@/lib/types';

const LIMITACIONES: Limitacion[] = ['hombro', 'rodilla', 'espalda_baja', 'muneca', 'cadera'];

export default function PaginaPerfil() {
  const { estado, actualizar } = useEstado();
  const { perfil, plan } = estado;

  const set = <C extends keyof Perfil>(campo: C, valor: Perfil[C]) =>
    actualizar((e) => ({
      ...e,
      perfil: { ...e.perfil, [campo]: valor, actualizado: new Date().toISOString() },
    }));

  const alternarLimitacion = (l: Limitacion) =>
    set(
      'limitaciones',
      perfil.limitaciones.includes(l) ? perfil.limitaciones.filter((x) => x !== l) : [...perfil.limitaciones, l],
    );

  const regenerar = () => actualizar((e) => ({ ...e, plan: generarPlan(e.perfil) }));

  return (
    <main>
      <h1>Tu perfil</h1>
      <p className="vacio">Con estos datos calculo las calorias y monto la rutina. Se guarda solo.</p>

      {plan && planDesactualizado(plan, perfil) && (
        <div className="aviso atencion">
          <strong>Has cambiado algo que afecta al plan</strong>
          <button className="boton pequeno" style={{ marginTop: 8 }} onClick={regenerar}>
            Regenerar plan con los datos nuevos
          </button>
        </div>
      )}

      <div className="tarjeta">
        <h3>Datos basicos</h3>
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" value={perfil.nombre} onChange={(e) => set('nombre', e.target.value)} />
        </div>
        <div className="rejilla">
          <div className="campo">
            <label htmlFor="sexo">Sexo biologico</label>
            <select id="sexo" value={perfil.sexo} onChange={(e) => set('sexo', e.target.value as Sexo)}>
              {Object.entries(ETIQUETA_SEXO).map(([v, t]) => (
                <option key={v} value={v}>{t}</option>
              ))}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="edad">Edad</label>
            <input id="edad" type="number" inputMode="numeric" min={14} max={99}
              value={perfil.edad || ''} onChange={(e) => set('edad', Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="campo">
          <label htmlFor="altura">Altura (cm)</label>
          <input id="altura" type="number" inputMode="numeric" min={120} max={230}
            value={perfil.alturaCm || ''} onChange={(e) => set('alturaCm', Number(e.target.value) || 0)} />
          <div className="ayuda">Se usa para el metabolismo basal y la estimacion de grasa corporal.</div>
        </div>
      </div>

      <div className="tarjeta">
        <h3>Objetivo y entrenamiento</h3>
        <div className="campo">
          <label htmlFor="objetivo">Que quieres conseguir</label>
          <select id="objetivo" value={perfil.objetivo} onChange={(e) => set('objetivo', e.target.value as Objetivo)}>
            {Object.entries(ETIQUETA_OBJETIVO).map(([v, t]) => (
              <option key={v} value={v}>{t}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="nivel">Experiencia entrenando</label>
          <select id="nivel" value={perfil.nivel} onChange={(e) => set('nivel', e.target.value as Nivel)}>
            {Object.entries(ETIQUETA_NIVEL).map(([v, t]) => (
              <option key={v} value={v}>{t}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="dias">Dias que puedes entrenar por semana</label>
          <select id="dias" value={perfil.diasPorSemana} onChange={(e) => set('diasPorSemana', Number(e.target.value))}>
            {[2, 3, 4, 5, 6].map((d) => (
              <option key={d} value={d}>{d} dias</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="entorno">Donde entrenas</label>
          <select id="entorno" value={perfil.entorno} onChange={(e) => set('entorno', e.target.value as Entorno)}>
            {Object.entries(ETIQUETA_ENTORNO).map(([v, t]) => (
              <option key={v} value={v}>{t}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="actividad">Actividad fuera del gimnasio</label>
          <select id="actividad" value={perfil.actividad} onChange={(e) => set('actividad', e.target.value as Actividad)}>
            {Object.entries(ETIQUETA_ACTIVIDAD).map(([v, t]) => (
              <option key={v} value={v}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tarjeta">
        <h3>Molestias o lesiones</h3>
        <p className="vacio">Marca lo que te da guerra y quitare los ejercicios mas agresivos para esa zona.</p>
        <div className="chips">
          {LIMITACIONES.map((l) => (
            <button
              key={l}
              type="button"
              className={perfil.limitaciones.includes(l) ? 'chip activo' : 'chip'}
              onClick={() => alternarLimitacion(l)}
            >
              {ETIQUETA_LIMITACION[l]}
            </button>
          ))}
        </div>
        <div className="campo" style={{ marginTop: 14 }}>
          <label htmlFor="notas">Notas</label>
          <textarea id="notas" rows={3} value={perfil.notas} placeholder="Alergias, horarios, lo que sea"
            onChange={(e) => set('notas', e.target.value)} />
        </div>
      </div>

      <div className="tarjeta">
        <h3>Datos</h3>
        <p className="vacio">
          Puedes descargar todo lo registrado (perfil, medidas y sesiones) por si quieres una copia.
        </p>
        <button
          className="boton secundario"
          onClick={() => {
            const blob = new Blob([JSON.stringify(estado, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `entrenos-${perfil.id}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Descargar mis datos
        </button>
      </div>
    </main>
  );
}
