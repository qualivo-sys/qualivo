'use client';

import { fechaCorta, num } from '@/lib/formato';

export interface PuntoGrafica {
  fecha: string;
  valor: number;
}

/** Grafica de linea en SVG puro: sin librerias, se ve bien en movil y en oscuro. */
export default function Grafica({
  datos,
  unidad = '',
  color = 'var(--brand)',
  decimales = 1,
}: {
  datos: PuntoGrafica[];
  unidad?: string;
  color?: string;
  decimales?: number;
}) {
  const puntos = [...datos]
    .filter((p) => Number.isFinite(p.valor))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  if (puntos.length < 2) {
    return <p className="vacio">Necesitas al menos 2 registros para ver la evolucion.</p>;
  }

  const ancho = 320;
  const alto = 130;
  const margen = { arriba: 12, abajo: 22, izq: 6, der: 6 };

  const valores = puntos.map((p) => p.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min || 1;
  const colchon = rango * 0.15;
  const suelo = min - colchon;
  const techo = max + colchon;

  const x = (i: number) =>
    margen.izq + (i * (ancho - margen.izq - margen.der)) / (puntos.length - 1);
  const y = (v: number) =>
    margen.arriba + ((techo - v) * (alto - margen.arriba - margen.abajo)) / (techo - suelo);

  const linea = puntos.map((p, i) => `${x(i).toFixed(1)},${y(p.valor).toFixed(1)}`).join(' ');
  const area = `${margen.izq},${alto - margen.abajo} ${linea} ${x(puntos.length - 1).toFixed(1)},${alto - margen.abajo}`;
  const ultimo = puntos[puntos.length - 1];
  const primero = puntos[0];
  const delta = ultimo.valor - primero.valor;

  return (
    <div className="grafica">
      <svg viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label="Evolucion">
        <polygon points={area} fill={color} opacity="0.12" />
        <polyline points={linea} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {puntos.map((p, i) => (
          <circle key={p.fecha + i} cx={x(i)} cy={y(p.valor)} r={i === puntos.length - 1 ? 4 : 2.5} fill={color} />
        ))}
        <text x={margen.izq} y={alto - 6} className="eje">{fechaCorta(primero.fecha)}</text>
        <text x={ancho - margen.der} y={alto - 6} textAnchor="end" className="eje">{fechaCorta(ultimo.fecha)}</text>
      </svg>
      <div className="grafica-pie">
        <span>
          Ahora <strong>{num(ultimo.valor, decimales)}{unidad}</strong>
        </span>
        <span className={delta === 0 ? '' : delta > 0 ? 'sube' : 'baja'}>
          {delta > 0 ? '+' : ''}{num(delta, decimales)}{unidad} desde {fechaCorta(primero.fecha)}
        </span>
      </div>
    </div>
  );
}
