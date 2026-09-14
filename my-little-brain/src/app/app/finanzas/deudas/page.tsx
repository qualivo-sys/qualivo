import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Barra, Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { borrarDeuda, cerrarDeuda, crearDeuda, editarDeuda, pagarCuota } from '@/app/app/finanzas/acciones';
import { cargarFinanzas } from '@/lib/datos';
import { fechaCorta, hoy as hoyIso } from '@/lib/fechas';
import { resumenDeudas, resumenFinanzas, TIPOS_DEUDA, tipoDeuda } from '@/lib/motor/finanzas';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const eur = (n: number) => `${n.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`;

/** "2027-03" → "marzo de 2027". */
function mesLargo(mes: string): string {
  const [anio, m] = mes.split('-').map(Number);
  return new Date(anio, m - 1, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

export default async function PaginaDeudas() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const hoy = hoyIso(perfil.zona_horaria || undefined);
  const finanzas = await cargarFinanzas(supabase, usuario.id, hoy);
  const resumen = resumenFinanzas({ ...finanzas, ingresosPrevistos: finanzas.ingresos, hoy, ambito: 'todo' });
  const deudas = resumenDeudas({
    deudas: finanzas.deudas,
    movimientos: finanzas.movimientos,
    hoy,
    ingresosMes: resumen.ingresosPrevistos || resumen.ingresos || null,
    ambito: 'todo',
  });
  const cerradas = finanzas.deudas.filter((d) => d.cerrada);
  const mesActual = hoy.slice(0, 7);

  return (
    <main className="space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h1>Deudas y prestamos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Lo que pesa no es el total: es cuanto de lo que entra cada mes ya esta comprometido.
          </p>
        </div>
        <Link href="/app/finanzas" className="shrink-0 text-sm text-primary underline">Dinero</Link>
      </div>

      {deudas.alguna && (
        <Tarjeta>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-lg font-semibold tabular-nums">{eur(deudas.pendiente)}</div>
              <div className="text-xs text-muted-foreground">pendiente</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-lg font-semibold tabular-nums">{eur(deudas.cuotaMes)}</div>
              <div className="text-xs text-muted-foreground">al mes</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div
                className={`text-lg font-semibold tabular-nums ${
                  deudas.pctIngresos === null
                    ? ''
                    : deudas.pctIngresos >= 50
                      ? 'text-destructive'
                      : deudas.pctIngresos >= 35
                        ? 'text-amber-700 dark:text-amber-300'
                        : 'text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {deudas.pctIngresos !== null ? `${deudas.pctIngresos} %` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">de lo que entra</div>
            </div>
          </div>
          {deudas.ultimoFin && (
            <p className="mt-3 text-sm text-muted-foreground">
              Si mantienes las cuotas, la ultima la terminas en <strong>{mesLargo(deudas.ultimoFin)}</strong>.
            </p>
          )}
          {deudas.masCara && deudas.masCara.tae !== null && deudas.deudas.length > 1 && (
            <p className="mt-1 text-sm text-muted-foreground">
              La mas cara de tener viva es {deudas.masCara.nombre} ({deudas.masCara.tae} % TAE). Si te sobra algo, ahi
              rinde mas que en la mas grande.
            </p>
          )}
        </Tarjeta>
      )}

      {deudas.deudas.map((d) => {
        const pagadoPct = d.inicial > 0 ? Math.round(((d.inicial - d.pendiente) / d.inicial) * 100) : 0;
        const yaPagada = finanzas.movimientos.some(
          (m) => m.deuda_id === d.id && m.fecha.slice(0, 7) === mesActual,
        );
        return (
          <Tarjeta key={d.id}>
            <div className="flex items-baseline justify-between gap-2">
              <TituloTarjeta className="mb-0">{d.emoji} {d.nombre}</TituloTarjeta>
              <span className="shrink-0 text-lg font-semibold tabular-nums">{eur(d.pendiente)}</span>
            </div>

            {d.pagado > 0 && (
              <>
                <div className="mt-2">
                  <Barra valor={pagadoPct} color="hsl(var(--area-habitos))" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                  Llevas {eur(d.pagado)} pagados desde que la apuntaste ({pagadoPct} %).
                </p>
              </>
            )}

            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-muted/40 p-2.5">
                <dt className="text-xs text-muted-foreground">Cuota</dt>
                <dd className="font-semibold tabular-nums">
                  {d.cuota > 0 ? eur(d.cuota) : '—'}
                  {d.diaCobro ? <span className="text-xs font-normal text-muted-foreground"> · dia {d.diaCobro}</span> : null}
                </dd>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5">
                <dt className="text-xs text-muted-foreground">Te queda</dt>
                <dd className={`font-semibold ${d.nuncaAcaba ? 'text-destructive' : ''}`}>
                  {d.nuncaAcaba
                    ? 'No se acaba'
                    : d.meses === 0
                      ? 'Pagada'
                      : d.meses !== null
                        ? `${d.meses} ${d.meses === 1 ? 'mes' : 'meses'}`
                        : 'Pon la cuota'}
                </dd>
              </div>
            </dl>

            {d.nuncaAcaba ? (
              <p className="mt-2 text-sm text-destructive">
                Con {eur(d.cuota)} al mes y un {d.tae} % de TAE no cubres ni los intereses: la deuda sube aunque pagues.
                Para que baje necesitas mas de {eur(Math.ceil(((d.pendiente * (d.tae ?? 0)) / 100 / 12) * 100) / 100)} al mes.
              </p>
            ) : (
              d.fin && d.meses !== null && d.meses > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  La terminas en <strong>{mesLargo(d.fin)}</strong>
                  {d.intereses !== null && d.intereses > 0 && d.tae
                    ? `, pagando ${eur(d.intereses)} de intereses por el camino.`
                    : '.'}
                </p>
              )
            )}

            {d.cuota > 0 && (
              <form action={pagarCuota.bind(null, d.id)} className="mt-3">
                <Boton type="submit" variante={yaPagada ? 'fantasma' : 'secundario'} className="w-full">
                  {yaPagada ? `Apuntar otra cuota de ${eur(d.cuota)}` : `Apuntar la cuota de este mes (${eur(d.cuota)})`}
                </Boton>
              </form>
            )}
            {yaPagada && (
              <p className="mt-1 text-center text-xs text-muted-foreground">Este mes ya tienes una cuota apuntada.</p>
            )}

            <details className="mt-3 border-t border-border pt-3">
              <summary className="cursor-pointer text-sm text-muted-foreground">Corregir o cerrar</summary>
              <form action={editarDeuda.bind(null, d.id)} className="mt-3 space-y-3">
                <Campo etiqueta="Nombre" name="nombre" defaultValue={d.nombre} />
                <div className="grid grid-cols-2 gap-3">
                  <Selector etiqueta="Tipo" name="tipo" defaultValue={d.tipo}>
                    {TIPOS_DEUDA.map((t) => (
                      <option key={t.id} value={t.id}>{t.emoji} {t.nombre}</option>
                    ))}
                  </Selector>
                  <Selector etiqueta="Ambito" name="ambito" defaultValue={d.ambito}>
                    <option value="personal">Personal</option>
                    <option value="empresa">Empresa</option>
                  </Selector>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Campo
                    etiqueta="Queda ahora"
                    name="pendiente"
                    inputMode="decimal"
                    defaultValue={String(d.pendiente)}
                    ayuda="Si lo cambias, se toma como lo que debes hoy."
                  />
                  <Campo etiqueta="Cuota al mes" name="cuota" inputMode="decimal" defaultValue={String(d.cuota)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Campo etiqueta="TAE %" name="tae" inputMode="decimal" defaultValue={d.tae !== null ? String(d.tae) : ''} placeholder="5,9" />
                  <Campo etiqueta="Dia de cobro" name="dia_cobro" inputMode="numeric" defaultValue={d.diaCobro ? String(d.diaCobro) : ''} placeholder="5" />
                </div>
                <Boton type="submit" variante="secundario" className="w-full">Guardar cambios</Boton>
              </form>
              <div className="mt-3 flex items-center justify-between gap-2">
                <form action={cerrarDeuda.bind(null, d.id, true)}>
                  <button type="submit" className="text-xs text-primary underline">Ya esta pagada, cerrarla</button>
                </form>
                <form action={borrarDeuda.bind(null, d.id)}>
                  <button type="submit" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                    <Trash2 size={13} /> Borrarla
                  </button>
                </form>
              </div>
            </details>
          </Tarjeta>
        );
      })}

      <Tarjeta>
        <TituloTarjeta>{deudas.alguna ? 'Añadir otra' : 'Añadir una deuda'}</TituloTarjeta>
        <form action={crearDeuda} className="space-y-3">
          <Campo etiqueta="¿Que es?" name="nombre" placeholder="Prestamo del coche" required />
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Tipo" name="tipo" defaultValue="prestamo">
              {TIPOS_DEUDA.map((t) => (
                <option key={t.id} value={t.id}>{t.emoji} {t.nombre}</option>
              ))}
            </Selector>
            <Selector etiqueta="Ambito" name="ambito" defaultValue="personal">
              <option value="personal">Personal</option>
              <option value="empresa">Empresa</option>
            </Selector>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="¿Cuanto queda?" name="pendiente" inputMode="decimal" placeholder="6000" required />
            <Campo etiqueta="Cuota al mes" name="cuota" inputMode="decimal" placeholder="200" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo
              etiqueta="TAE % (opcional)"
              name="tae"
              inputMode="decimal"
              placeholder="5,9"
              ayuda="Sin esto la cuenta de cuando acabas sale optimista."
            />
            <Campo etiqueta="Dia de cobro (opcional)" name="dia_cobro" inputMode="numeric" placeholder="5" />
          </div>
          <Boton type="submit" className="w-full">Añadir</Boton>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          Pon lo que queda hoy, no lo que pediste. A partir de aqui, cada cuota que apuntes la baja sola.
        </p>
      </Tarjeta>

      {cerradas.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Pagadas</TituloTarjeta>
          <ul className="space-y-2 text-sm">
            {cerradas.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-muted-foreground">
                  {tipoDeuda(d.tipo).emoji} {d.nombre} · desde {fechaCorta(d.pendiente_fecha)}
                </span>
                <form action={cerrarDeuda.bind(null, d.id, false)}>
                  <button type="submit" className="shrink-0 text-xs text-primary underline">Reabrir</button>
                </form>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Pagar la mas cara antes que la mas grande es casi siempre lo que mas te ahorra, aunque quitarse la pequeña de
        encima siente mejor. Las dos cosas valen; solo conviene saber cual estas eligiendo.
      </p>
    </main>
  );
}
