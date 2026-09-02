'use client';

import { useState } from 'react';
import Grafica from '@/components/Grafica';
import { grasaCorporal, ordenadas, resumenCuerpo } from '@/lib/cuerpo';
import { useEstado } from '@/lib/estado-cliente';
import { fechaLarga, hoy, id as nuevoId, num } from '@/lib/formato';
import type { Medicion } from '@/lib/types';

const PERIMETROS: { campo: keyof Medicion; etiqueta: string; ayuda: string }[] = [
  { campo: 'cuelloCm', etiqueta: 'Cuello', ayuda: 'justo debajo de la nuez' },
  { campo: 'cinturaCm', etiqueta: 'Cintura', ayuda: 'a la altura del ombligo' },
  { campo: 'caderaCm', etiqueta: 'Cadera', ayuda: 'por la parte mas ancha' },
  { campo: 'pechoCm', etiqueta: 'Pecho', ayuda: 'por la linea de los pezones' },
  { campo: 'brazoCm', etiqueta: 'Brazo', ayuda: 'relajado, por el biceps' },
  { campo: 'musloCm', etiqueta: 'Muslo', ayuda: 'por la parte mas ancha' },
];

type Formulario = Record<string, string>;

const VACIO: Formulario = { fecha: hoy(), pesoKg: '', cuelloCm: '', cinturaCm: '', caderaCm: '', pechoCm: '', brazoCm: '', musloCm: '', notas: '' };

export default function PaginaMedidas() {
  const { estado, actualizar } = useEstado();
  const { perfil, mediciones } = estado;
  const [form, setForm] = useState<Formulario>(VACIO);
  const [guardado, setGuardado] = useState(false);

  const cuerpo = resumenCuerpo(perfil, mediciones);
  const historial = ordenadas(mediciones);

  const numero = (v: string): number | null => {
    const limpio = v.replace(',', '.').trim();
    if (!limpio) return null;
    const n = Number(limpio);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const guardar = () => {
    const peso = numero(form.pesoKg);
    if (!peso) return;
    const registro: Medicion = {
      id: nuevoId(),
      fecha: form.fecha || hoy(),
      pesoKg: peso,
      cuelloCm: numero(form.cuelloCm),
      cinturaCm: numero(form.cinturaCm),
      caderaCm: numero(form.caderaCm),
      pechoCm: numero(form.pechoCm),
      brazoCm: numero(form.brazoCm),
      musloCm: numero(form.musloCm),
      notas: form.notas.trim() || undefined,
    };
    actualizar((e) => ({
      ...e,
      // Una medicion por dia: si repites fecha, se sustituye.
      mediciones: [...e.mediciones.filter((m) => m.fecha !== registro.fecha), registro],
    }));
    setForm({ ...VACIO, fecha: hoy() });
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const borrar = (idMedicion: string) =>
    actualizar((e) => ({ ...e, mediciones: e.mediciones.filter((m) => m.id !== idMedicion) }));

  const serie = (extraer: (m: Medicion) => number | null | undefined) =>
    historial
      .map((m) => ({ fecha: m.fecha, valor: extraer(m) ?? NaN }))
      .filter((p) => Number.isFinite(p.valor))
      .reverse();

  return (
    <main>
      <h1>Medidas</h1>
      <p className="vacio">
        Pesate en ayunas y siempre en las mismas condiciones. Los perimetros, una vez por semana:
        son mas fiables que la bascula para ver los cambios.
      </p>

      <div className="tarjeta">
        <h3>Nueva medicion</h3>
        <div className="rejilla">
          <div className="campo">
            <label htmlFor="fecha">Fecha</label>
            <input id="fecha" type="date" value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} />
          </div>
          <div className="campo">
            <label htmlFor="peso">Peso (kg)</label>
            <input id="peso" type="number" inputMode="decimal" step="0.1" placeholder="72.4"
              value={form.pesoKg} onChange={(e) => setForm({ ...form, pesoKg: e.target.value })} />
          </div>
        </div>

        <div className="rejilla">
          {PERIMETROS.map((p) => (
            <div className="campo" key={String(p.campo)}>
              <label htmlFor={String(p.campo)}>{p.etiqueta} (cm)</label>
              <input
                id={String(p.campo)}
                type="number"
                inputMode="decimal"
                step="0.5"
                value={form[p.campo as string] ?? ''}
                onChange={(e) => setForm({ ...form, [p.campo as string]: e.target.value })}
              />
              <div className="ayuda">{p.ayuda}</div>
            </div>
          ))}
        </div>

        <div className="campo">
          <label htmlFor="notas-medida">Notas</label>
          <input id="notas-medida" placeholder="Fin de semana con exceso, regla, mucha sal…"
            value={form.notas} onChange={(e) => setForm({ ...form, notas: e.target.value })} />
        </div>

        <button className="boton" onClick={guardar} disabled={!numero(form.pesoKg)}>Guardar medicion</button>
        {guardado && <p className="aviso ok" style={{ marginTop: 12 }}>Guardado. Buen habito.</p>}
        <p className="ayuda" style={{ marginTop: 10 }}>
          Para estimar la grasa corporal hacen falta cuello y cintura
          {perfil.sexo === 'mujer' ? ' y cadera' : ''}.
        </p>
      </div>

      {cuerpo.peso !== null && (
        <div className="kpis">
          <div className="kpi">
            <div className="etiqueta">Peso</div>
            <div className="valor">{num(cuerpo.peso)}</div>
            <div className="pie">kg</div>
          </div>
          <div className="kpi">
            <div className="etiqueta">IMC</div>
            <div className="valor">{num(cuerpo.imc)}</div>
            <div className="pie">orientativo</div>
          </div>
          <div className="kpi">
            <div className="etiqueta">Grasa est.</div>
            <div className="valor">{num(cuerpo.grasaPct)}</div>
            <div className="pie">%</div>
          </div>
          <div className="kpi">
            <div className="etiqueta">Cintura/cadera</div>
            <div className="valor">{num(cuerpo.cinturaCadera, 2)}</div>
            <div className="pie">ratio</div>
          </div>
        </div>
      )}

      <div className="tarjeta" style={{ marginTop: 16 }}>
        <h3>Peso</h3>
        <Grafica datos={serie((m) => m.pesoKg)} unidad=" kg" />
      </div>

      <div className="tarjeta">
        <h3>Cintura</h3>
        <Grafica datos={serie((m) => m.cinturaCm)} unidad=" cm" color="var(--ok)" />
      </div>

      <div className="tarjeta">
        <h3>Grasa corporal estimada</h3>
        <Grafica datos={serie((m) => grasaCorporal(perfil.sexo, perfil.alturaCm, m))} unidad=" %" color="var(--warn)" />
      </div>

      <div className="tarjeta">
        <h3>Historial</h3>
        {!historial.length ? (
          <p className="vacio">Todavia no has anotado nada.</p>
        ) : (
          <ul className="lista">
            {historial.map((m) => (
              <li key={m.id}>
                <div className="titulo">{num(m.pesoKg)} kg</div>
                <div className="meta">
                  {fechaLarga(m.fecha)}
                  {m.cinturaCm ? ` · cintura ${num(m.cinturaCm)} cm` : ''}
                  {m.notas ? ` · ${m.notas}` : ''}
                </div>
                <button className="boton peligro pequeno" style={{ marginTop: 8 }} onClick={() => borrar(m.id)}>
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
