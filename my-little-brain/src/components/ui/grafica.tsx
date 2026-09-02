'use client';

import { useState } from 'react';
import { fechaCorta } from '@/lib/fechas';

export interface Punto {
  fecha: string;
  valor: number;
}

/**
 * Serie temporal unica: linea de 2 px, rejilla discreta, punto y tooltip al pasar
 * el dedo o el raton. Una sola serie, asi que el titulo hace de leyenda.
 */
export default function Grafica({
  datos,
  unidad = '',
  color = 'hsl(var(--area-cuerpo))',
  decimales = 1,
  alto = 150,
}: {
  datos: Punto[];
  unidad?: string;
  color?: string;
  decimales?: number;
  alto?: number;
}) {
  const [activo, setActivo] = useState<number | null>(null);

  const puntos = [...datos]
    .filter((p) => Number.isFinite(p.valor))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  if (puntos.length < 2) {
    return <p className="py-6 text-sm text-muted-foreground">Con dos registros ya te enseño la evolucion.</p>;
  }

  const ancho = 320;
  const margen = { arriba: 14, abajo: 22, lados: 8 };
  const valores = puntos.map((p) => p.valor);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min || 1;
  const suelo = min - rango * 0.18;
  const techo = max + rango * 0.18;

  const x = (i: number) => margen.lados + (i * (ancho - margen.lados * 2)) / (puntos.length - 1);
  const y = (v: number) => margen.arriba + ((techo - v) * (alto - margen.arriba - margen.abajo)) / (techo - suelo);

  const linea = puntos.map((p, i) => `${x(i).toFixed(1)},${y(p.valor).toFixed(1)}`).join(' ');
  const area = `${x(0)},${alto - margen.abajo} ${linea} ${x(puntos.length - 1)},${alto - margen.abajo}`;
  const ultimo = puntos[puntos.length - 1];
  const primero = puntos[0];
  const delta = ultimo.valor - primero.valor;
  const destacado = activo === null ? puntos.length - 1 : activo;

  const alSenalar = (evento: React.PointerEvent<SVGSVGElement>) => {
    const caja = evento.currentTarget.getBoundingClientRect();
    const relativo = ((evento.clientX - caja.left) / caja.width) * ancho;
    const indice = Math.round(((relativo - margen.lados) / (ancho - margen.lados * 2)) * (puntos.length - 1));
    setActivo(Math.max(0, Math.min(puntos.length - 1, indice)));
  };

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${ancho} ${alto}`}
        className="w-full touch-pan-y"
        style={{ height: alto }}
        onPointerMove={alSenalar}
        onPointerDown={alSenalar}
        onPointerLeave={() => setActivo(null)}
        role="img"
        aria-label={`Evolucion de ${primero.fecha} a ${ultimo.fecha}`}
      >
        <line
          x1={margen.lados} x2={ancho - margen.lados}
          y1={alto - margen.abajo} y2={alto - margen.abajo}
          stroke="hsl(var(--border))" strokeWidth="1"
        />
        <polygon points={area} fill={color} opacity="0.10" />
        <polyline points={linea} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        <line
          x1={x(destacado)} x2={x(destacado)} y1={margen.arriba} y2={alto - margen.abajo}
          stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"
        />
        <circle
          cx={x(destacado)} cy={y(puntos[destacado].valor)} r="5"
          fill={color} stroke="hsl(var(--card))" strokeWidth="2"
        />

        <text x={margen.lados} y={alto - 6} className="fill-muted-foreground text-[9px]">
          {fechaCorta(primero.fecha)}
        </text>
        <text x={ancho - margen.lados} y={alto - 6} textAnchor="end" className="fill-muted-foreground text-[9px]">
          {fechaCorta(ultimo.fecha)}
        </text>
      </svg>

      <figcaption className="mt-1 flex items-baseline justify-between text-sm">
        <span className="tabular-nums">
          <strong className="text-foreground">
            {puntos[destacado].valor.toFixed(decimales)}
            {unidad}
          </strong>{' '}
          <span className="text-muted-foreground">· {fechaCorta(puntos[destacado].fecha)}</span>
        </span>
        <span className="text-xs text-muted-foreground">
          {delta > 0 ? '+' : ''}
          {delta.toFixed(decimales)}
          {unidad} desde {fechaCorta(primero.fecha)}
        </span>
      </figcaption>
    </figure>
  );
}
