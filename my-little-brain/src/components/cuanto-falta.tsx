import Link from 'next/link';
import { Barra, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { fechaCorta } from '@/lib/fechas';
import type { Medicion, Proyeccion } from '@/lib/motor/objetivos';

/**
 * "Cuanto te falta, tal y como vas". No dice si vas bien o mal: da la fecha a
 * la que llegarias y, si te pusiste una, el ritmo que haria falta para
 * cumplirla. Con eso decides tu si aprietas o si mueves la fecha.
 */
export default function CuantoFalta({
  titulo,
  medicion,
  proyeccion,
  unidad,
  /** Como se lee el ritmo: "kg/semana", "entrenos/semana". */
  unidadRitmo,
  fechaLimite,
}: {
  titulo: string;
  medicion: Medicion;
  proyeccion: Proyeccion;
  unidad: string;
  unidadRitmo: string;
  fechaLimite: string | null;
}) {
  const n = (v: number, decimales = 1) =>
    `${Math.abs(v).toFixed(decimales).replace('.', ',')}`;

  return (
    <Tarjeta className={proyeccion.conseguido ? 'border-emerald-500/40' : undefined}>
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <TituloTarjeta className="mb-0">Cuanto te falta</TituloTarjeta>
        <Link href="/app/objetivos" className="text-xs text-primary underline">Objetivos</Link>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">{titulo}</p>

      {proyeccion.conseguido ? (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">
          Ya has llegado. Dalo por conseguido en objetivos y pon el siguiente.
        </p>
      ) : (
        <>
          <div className="mb-1 flex items-baseline justify-between gap-2 text-sm tabular-nums">
            <span className="text-muted-foreground">
              de {n(medicion.inicial ?? 0)} a {n(medicion.meta ?? 0)} {unidad}
            </span>
            <span>
              <strong>{n(medicion.actual ?? 0)} {unidad}</strong>
              {medicion.pct !== null && <span className="ml-1.5 text-xs text-muted-foreground">{medicion.pct} %</span>}
            </span>
          </div>
          <Barra valor={medicion.pct ?? 0} />

          <p className="mt-2 text-lg tabular-nums">
            Te {proyeccion.falta === 1 ? 'falta' : 'faltan'} <strong>{n(proyeccion.falta)} {unidad}</strong>.
          </p>

          {proyeccion.alejandose ? (
            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
              Ahora mismo vas hacia el otro lado ({n(proyeccion.porSemana ?? 0, 2)} {unidadRitmo} en contra), asi que no
              te puedo dar una fecha. No es para agobiarse: son datos de las ultimas semanas, no una sentencia.
            </p>
          ) : proyeccion.llegada ? (
            <p className="mt-1 text-sm">
              Al ritmo que llevas ({n(proyeccion.porSemana ?? 0, 2)} {unidadRitmo}) llegarias el{' '}
              <strong>{fechaCorta(proyeccion.llegada)}</strong>
              {proyeccion.semanas !== null && ` · unas ${n(proyeccion.semanas, 0)} semanas`}.
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Aun no tengo ritmo suficiente para darte una fecha. Sigue apuntando y en un par de semanas te lo digo.
            </p>
          )}

          {/* Lo util no es "vas mal", es el numero al que tendrias que ir. */}
          {fechaLimite && proyeccion.ritmoNecesario !== null && !proyeccion.conseguido && (
            <p className={`mt-2 border-t border-border pt-2 text-sm ${proyeccion.aTiempo === false ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
              Tu fecha es el {fechaCorta(fechaLimite)}: para llegar tendrias que ir a{' '}
              <strong>{n(proyeccion.ritmoNecesario, 2)} {unidadRitmo}</strong>
              {proyeccion.porSemana !== null && !proyeccion.alejandose && ` y vas a ${n(proyeccion.porSemana, 2)}`}.
              {proyeccion.aTiempo === false && ' O aprietas, o mueves la fecha: las dos valen.'}
              {proyeccion.aTiempo === true && ' Vas sobrado.'}
            </p>
          )}

          {fechaLimite && proyeccion.diasHastaLimite !== null && proyeccion.diasHastaLimite < 0 && (
            <p className="mt-2 text-sm text-muted-foreground">
              Tu fecha ya paso. Ponle una nueva en objetivos: una fecha vencida no empuja, solo pesa.
            </p>
          )}
        </>
      )}
    </Tarjeta>
  );
}
