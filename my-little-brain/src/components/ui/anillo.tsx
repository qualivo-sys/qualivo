/**
 * Medidor circular 0-100 para las puntuaciones por area.
 * El numero y la etiqueta van siempre escritos: el color no es el unico canal.
 */
export function Anillo({
  valor,
  etiqueta,
  color,
  tamano = 76,
}: {
  valor: number | null;
  etiqueta: string;
  color: string;
  tamano?: number;
}) {
  const radio = (tamano - 10) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const porcentaje = valor === null ? 0 : Math.max(0, Math.min(100, valor));
  const relleno = (porcentaje / 100) * circunferencia;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg width={tamano} height={tamano} viewBox={`0 0 ${tamano} ${tamano}`} role="img" aria-label={`${etiqueta}: ${valor ?? 'sin datos'} sobre 100`}>
        <circle cx={tamano / 2} cy={tamano / 2} r={radio} fill="none" stroke="hsl(var(--muted))" strokeWidth="6" />
        {valor !== null && (
          <circle
            cx={tamano / 2}
            cy={tamano / 2}
            r={radio}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${relleno} ${circunferencia - relleno}`}
            transform={`rotate(-90 ${tamano / 2} ${tamano / 2})`}
          />
        )}
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-[15px] font-semibold"
        >
          {valor === null ? '—' : valor}
        </text>
      </svg>
      <span className="text-center text-xs text-muted-foreground">{etiqueta}</span>
    </div>
  );
}
