import { ChevronRight, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import RegistroGasto from '@/components/registro-gasto';
import { Barra, Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { activarFinanzas, borrarMovimiento, cerrarSobre, editarMovimiento } from '@/app/app/finanzas/acciones';
import { cargarFinanzas } from '@/lib/datos';
import { fechaCorta, hoy as hoyIso, inicioSemana, sumarDias } from '@/lib/fechas';
import {
  type Ambito,
  CATEGORIAS,
  categoria as infoCategoria,
  gastoPorCategoria,
  insightsFinanzas,
  insightsPatrimonio,
  mesAnteriorA,
  nombreMes,
  porSemanas,
  resumenCuentas,
  resumenDeudas,
  resumenFinanzas,
  revisionSemana,
} from '@/lib/motor/finanzas';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const eur = (n: number) => `${n.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`;
/** Para cuando el signo lo pone el texto de al lado: si no, salia "−-850 €". */
const eurAbs = (n: number) => eur(Math.abs(n));

const TONOS = {
  bien: 'text-emerald-700 dark:text-emerald-300',
  aviso: 'text-amber-700 dark:text-amber-300',
  alerta: 'text-destructive',
  info: 'text-muted-foreground',
} as const;

const SEMAFORO = {
  bien: { punto: '🟢', color: 'hsl(var(--area-habitos))' },
  cerca: { punto: '🟡', color: 'hsl(38 92% 50%)' },
  pasado: { punto: '🔴', color: 'hsl(var(--destructive))' },
} as const;

export default async function PaginaFinanzas({
  searchParams,
}: {
  searchParams?: { ambito?: string };
}) {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const hoy = hoyIso(perfil.zona_horaria || undefined);
  const finanzas = await cargarFinanzas(supabase, usuario.id, hoy);

  if (!finanzas.activo) {
    return (
      <main className="space-y-4">
        <div>
          <h1>Dinero</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control de caja, no contabilidad. No hace falta apuntar hasta el ultimo centimo: basta con saber si vas por
            encima o por debajo de lo que decidiste gastar.
          </p>
        </div>

        <Tarjeta>
          <TituloTarjeta>Empecemos por lo unico imprescindible</TituloTarjeta>
          <form action={activarFinanzas} className="space-y-3">
            <Campo
              etiqueta="¿Cuanto dinero tienes ahora mismo?"
              name="caja_inicial"
              inputMode="decimal"
              placeholder="3850"
              required
              ayuda="La suma de tus cuentas, a ojo. A partir de aqui la app suma lo que ingreses y resta lo que gastes."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo etiqueta="Quiero ahorrar al mes (opcional)" name="ahorro_mes" inputMode="decimal" placeholder="300" />
              <Campo etiqueta="Caja minima (opcional)" name="caja_minima" inputMode="decimal" placeholder="5000" />
            </div>
            <Boton type="submit" className="w-full">Activar el modulo de dinero</Boton>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            Despues pones tus ingresos previstos y un presupuesto por categoria. Se tarda dos minutos y se cambia cuando
            quieras.
          </p>
        </Tarjeta>

        <Tarjeta>
          <TituloTarjeta>Para que sirve</TituloTarjeta>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>· Ver tu caja y si el mes va bien o mal, de un vistazo.</li>
            <li>· Un presupuesto por categoria con semaforo: verde, ambar, rojo.</li>
            <li>· Marcar un gasto como impulso, para ver donde esta el margen facil.</li>
            <li>· Una pregunta cada semana: ¿estas usando tu dinero en la vida que quieres construir?</li>
          </ul>
        </Tarjeta>
      </main>
    );
  }

  // Lleva dos dineros si alguna vez ha marcado algo como de empresa. Mientras
  // no sea asi, el conmutador no aparece: no se enseña una decision que no tiene.
  const conEmpresa =
    finanzas.movimientos.some((m) => m.ambito === 'empresa')
    || finanzas.cuentas.some((c) => c.ambito === 'empresa')
    || finanzas.deudas.some((d) => d.ambito === 'empresa')
    || finanzas.ingresos.some((i) => i.ambito === 'empresa');
  const pedido = searchParams?.ambito;
  const ambito: Ambito = conEmpresa && (pedido === 'empresa' || pedido === 'todo') ? pedido : 'personal';

  const comun = { ...finanzas, ingresosPrevistos: finanzas.ingresos, hoy, ambito };
  const resumen = resumenFinanzas(comun);
  const sobresAbiertos = resumen.sobres.filter((s) => !s.cerrado);
  const sobresCerrados = resumen.sobres.filter((s) => s.cerrado);
  const anterior = resumenFinanzas({ ...comun, mes: mesAnteriorA(resumen.mes) });
  const insights = insightsFinanzas(resumen, anterior, finanzas.ajustes);
  const lunes = inicioSemana(hoy);
  const semana = revisionSemana(
    finanzas.movimientos.filter((m) => ambito === 'todo' || m.ambito === ambito),
    resumen, lunes, hoy,
  );
  const delMes = finanzas.movimientos
    .filter((m) => m.fecha.slice(0, 7) === resumen.mes)
    .filter((m) => ambito === 'todo' || m.ambito === ambito);
  const frecuentes = [...new Set(finanzas.movimientos.slice(0, 40).map((m) => m.categoria))].slice(0, 4);

  const cuentas = resumenCuentas(finanzas.cuentas, { ambito, fechaFoto: finanzas.ajustes?.caja_fecha ?? null, hoy });
  const deudas = resumenDeudas({
    deudas: finanzas.deudas,
    movimientos: finanzas.movimientos,
    hoy,
    ingresosMes: resumen.ingresosPrevistos || resumen.ingresos || null,
    ahorrado: finanzas.cuentas.length ? cuentas.ahorrado : null,
    ambito,
  });
  const semanas = porSemanas(finanzas.movimientos, resumen.mes, {
    hoy, presupuestoMes: resumen.presupuestoTotal || null, ambito,
  });
  const donde = gastoPorCategoria(finanzas.movimientos, resumen.mes, { ambito });
  const avisos = insightsPatrimonio(cuentas, deudas, semanas);
  // La barra mas alta manda: si no, un mes tranquilo se ve igual que uno caro.
  const picoSemana = Math.max(1, ...semanas.map((x) => x.porDia));

  /** Los gastos del dia a dia de una categoria este mes, del mas reciente al mas viejo. */
  const porCategoria = (id: string) =>
    delMes
      .filter((m) => m.tipo === 'gasto' && m.categoria === id && !m.sobre_id)
      .sort((a, b) => (a.fecha < b.fecha ? 1 : -1));

  return (
    <main className="space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h1>Dinero</h1>
          <p className="mt-1 text-sm text-muted-foreground">{nombreMes(resumen.mes)}</p>
        </div>
        <Link href="/app/finanzas/ajustes" className="text-sm text-primary underline">Ajustes</Link>
      </div>

      {/* El dinero de la empresa no es tuyo para gastartelo: mezclarlo hace que
          el presupuesto personal mienta. Por defecto se mira lo personal. */}
      {conEmpresa && (
        <div className="flex overflow-hidden rounded-xl border border-border text-sm">
          {([
            { id: 'personal', texto: 'Personal' },
            { id: 'empresa', texto: 'Empresa' },
            { id: 'todo', texto: 'Todo junto' },
          ] as const).map((o) => (
            <Link
              key={o.id}
              href={o.id === 'personal' ? '/app/finanzas' : `/app/finanzas?ambito=${o.id}`}
              className={`flex-1 py-2 text-center transition-colors ${
                ambito === o.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground'
              }`}
            >
              {o.texto}
            </Link>
          ))}
        </div>
      )}

      <Tarjeta>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Caja actual</p>
            <p className="mt-0.5 text-3xl font-semibold tabular-nums">{eur(resumen.caja)}</p>
          </div>
          {resumen.cumplimiento !== null && (
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Cumplimiento</p>
              <p className={`mt-0.5 text-2xl font-semibold tabular-nums ${resumen.cumplimiento >= 80 ? TONOS.bien : resumen.cumplimiento >= 50 ? TONOS.aviso : TONOS.alerta}`}>
                {resumen.cumplimiento} %
              </p>
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{eur(resumen.gastos)}</div>
            <div className="text-xs text-muted-foreground">gastos</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="text-lg font-semibold tabular-nums">{eur(resumen.ingresos)}</div>
            <div className="text-xs text-muted-foreground">ingresos</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className={`text-lg font-semibold tabular-nums ${resumen.neto >= 0 ? TONOS.bien : TONOS.alerta}`}>
              {resumen.neto > 0 ? '+' : ''}{eur(resumen.neto)}
            </div>
            <div className="text-xs text-muted-foreground">neto</div>
          </div>
        </div>
        {/* De que cajas sale el dinero. Un total sin desglosar no distingue
            entre tenerlo disponible y tenerlo en un fondo que no vas a tocar. */}
        {cuentas.cuentas.length > 0 && (
          <div className="mt-4 border-t border-border pt-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Donde esta</p>
              <Link href="/app/finanzas/ajustes#cajas" className="text-xs text-primary underline">Poner al dia</Link>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-lg font-semibold tabular-nums">{eur(cuentas.ahorrado)}</div>
                <div className="text-xs text-muted-foreground">ahorrado</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-lg font-semibold tabular-nums">{eur(cuentas.disponible)}</div>
                <div className="text-xs text-muted-foreground">para el dia a dia</div>
              </div>
            </div>
            <ul className="mt-2 space-y-1">
              {cuentas.cuentas.map((c) => (
                <li key={c.id} className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">
                    {c.emoji} {c.nombre}
                    {c.ahorro && <span className="ml-1 text-xs text-muted-foreground">ahorro</span>}
                  </span>
                  <span className="shrink-0 tabular-nums">{eur(c.saldo)}</span>
                </li>
              ))}
            </ul>
            {cuentas.diasDesdeFoto !== null && cuentas.diasDesdeFoto > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Saldos de hace {cuentas.diasDesdeFoto} {cuentas.diasDesdeFoto === 1 ? 'dia' : 'dias'}, mas lo que has
                apuntado desde entonces.
              </p>
            )}
          </div>
        )}
        {resumen.ingresosPrevistos > 0 && (
          <p className="mt-3 text-xs text-muted-foreground tabular-nums">
            Previsto este mes: {eur(resumen.ingresosPrevistos)} de ingresos
            {resumen.presupuestoTotal > 0 ? ` y ${eur(resumen.presupuestoTotal)} de gasto` : ''}.
            {resumen.proyeccionFiable && resumen.diaDelMes < resumen.dias && resumen.presupuestoTotal > 0
              ? ` A este ritmo acabaras en ${eur(resumen.proyeccion)}.`
              : ''}
          </p>
        )}
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Apuntar un movimiento</TituloTarjeta>
        <RegistroGasto
          frecuentes={frecuentes}
          hoy={hoy}
          ayer={sumarDias(hoy, -1)}
          conEmpresa={conEmpresa}
          sobres={sobresAbiertos.map((s) => ({ id: s.id, nombre: s.nombre, emoji: s.emoji, disponible: s.disponible }))}
        />
      </Tarjeta>

      {insights.length + avisos.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Lo que veo</TituloTarjeta>
          <ul className="space-y-1.5 text-sm">
            {[...avisos, ...insights].map((i) => (
              <li key={i.texto} className={TONOS[i.tono]}>· {i.texto}</li>
            ))}
          </ul>
        </Tarjeta>
      )}

      <Tarjeta>
        <div className="mb-1 flex items-baseline justify-between">
          <TituloTarjeta className="mb-0">Deudas y prestamos</TituloTarjeta>
          <Link href="/app/finanzas/deudas" className="text-sm text-primary underline">
            {deudas.alguna ? 'Gestionar' : 'Añadir'}
          </Link>
        </div>
        {deudas.alguna ? (
          <>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-lg font-semibold tabular-nums">{eur(deudas.pendiente)}</div>
                <div className="text-xs text-muted-foreground">pendiente</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-lg font-semibold tabular-nums">{eur(deudas.cuotaMes)}</div>
                <div className="text-xs text-muted-foreground">
                  al mes{deudas.pctIngresos !== null ? ` · ${deudas.pctIngresos} % de lo que entra` : ''}
                </div>
              </div>
            </div>
            <ul className="mt-3 space-y-2">
              {deudas.deudas.map((d) => (
                <li key={d.id} className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">
                    {d.emoji} {d.nombre}
                    <span className="ml-1 text-xs text-muted-foreground">
                      {d.nuncaAcaba
                        ? 'la cuota no cubre ni los intereses'
                        : d.meses === 0
                          ? 'pagada'
                          : d.meses !== null
                            ? `${d.meses} ${d.meses === 1 ? 'mes' : 'meses'}`
                            : 'sin cuota fijada'}
                    </span>
                  </span>
                  <span className={`shrink-0 tabular-nums ${d.nuncaAcaba ? TONOS.alerta : ''}`}>{eur(d.pendiente)}</span>
                </li>
              ))}
            </ul>
            {deudas.patrimonio !== null && (
              <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground tabular-nums">
                Ahorro menos deuda: <strong className={deudas.patrimonio >= 0 ? TONOS.bien : TONOS.alerta}>
                  {deudas.patrimonio >= 0 ? '+' : '−'}{eurAbs(deudas.patrimonio)}
                </strong>
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Si tienes un prestamo, una hipoteca o algo financiado, ponlo aqui. Lo que pesa no es el total: es cuanto de
            lo que entra cada mes ya esta comprometido antes de que decidas nada.
          </p>
        )}
      </Tarjeta>

      {(sobresAbiertos.length > 0 || sobresCerrados.length > 0) && (
        <Tarjeta>
          <div className="mb-1 flex items-baseline justify-between">
            <TituloTarjeta className="mb-0">Para algo concreto</TituloTarjeta>
            <Link href="/app/finanzas/ajustes#sobres" className="text-sm text-primary underline">Nuevo</Link>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Un finde, una escapada, un evento. Lo que gastas aqui no toca el presupuesto del dia a dia.
          </p>
          <ul className="space-y-3">
            {sobresAbiertos.map((s) => (
              <li key={s.id}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span>
                    {SEMAFORO[s.estado].punto} {s.emoji} {s.nombre}
                    {s.diasRestantes !== null && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        {s.diasRestantes === 0 ? 'ultimo dia' : `quedan ${s.diasRestantes} d`}
                      </span>
                    )}
                  </span>
                  <span className="tabular-nums">
                    <strong>{eur(s.gastado)}</strong> <span className="text-muted-foreground">/ {eur(s.importe)}</span>
                  </span>
                </div>
                <Barra valor={Math.min(100, s.pct)} color={SEMAFORO[s.estado].color} />
                <div className="mt-1 flex items-baseline justify-between gap-2">
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {s.disponible >= 0 ? `Te quedan ${eur(s.disponible)}` : `Te has pasado ${eur(-s.disponible)}`}
                    {s.movimientos > 0 ? ` · ${s.movimientos} ${s.movimientos === 1 ? 'apunte' : 'apuntes'}` : ' · sin gastos todavia'}
                  </p>
                  <form action={cerrarSobre.bind(null, s.id, true)}>
                    <button type="submit" className="text-xs text-muted-foreground underline">Cerrarlo</button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
          {sobresCerrados.length > 0 && (
            <details className="mt-3 border-t border-border pt-3">
              <summary className="cursor-pointer text-sm text-muted-foreground">Cerrados ({sobresCerrados.length})</summary>
              <ul className="mt-2 space-y-2 text-sm">
                {sobresCerrados.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">
                      {s.emoji} {s.nombre}: {eur(s.gastado)} de {eur(s.importe)}
                      {s.disponible >= 0 ? ` · sobraron ${eur(s.disponible)}` : ` · te pasaste ${eur(-s.disponible)}`}
                    </span>
                    <form action={cerrarSobre.bind(null, s.id, false)}>
                      <button type="submit" className="shrink-0 text-xs text-primary underline">Reabrir</button>
                    </form>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </Tarjeta>
      )}

      {resumen.categorias.length > 0 ? (
        <Tarjeta>
          <TituloTarjeta>Presupuesto por categoria</TituloTarjeta>
          <ul className="space-y-3">
            {resumen.categorias.map((c) => (
              <li key={c.id}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span>
                    {SEMAFORO[c.estado].punto} {c.emoji} {c.nombre}
                    {c.ritmoAlto && <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">va rapido</span>}
                  </span>
                  <span className="tabular-nums">
                    <strong>{eur(c.gastado)}</strong> <span className="text-muted-foreground">/ {eur(c.presupuesto)}</span>
                  </span>
                </div>
                <Barra valor={Math.min(100, c.pct)} color={SEMAFORO[c.estado].color} />
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                  {c.disponible >= 0 ? `Te quedan ${eur(c.disponible)}` : `Te has pasado ${eur(-c.disponible)}`}
                  {c.impulsivo > 0 ? ` · ${eur(c.impulsivo)} en impulsos` : ''}
                  {c.inversion ? ' · esto es inversion en ti' : ''}
                </p>

                {/* Un numero rojo sin saber de que viene no sirve de nada. */}
                {porCategoria(c.id).length > 0 && (
                  <details className="mt-1.5 group">
                    <summary className="flex cursor-pointer items-center gap-1 text-xs text-primary marker:content-['']">
                      <ChevronRight size={12} className="transition-transform group-open:rotate-90" />
                      Ver en que se ha ido ({porCategoria(c.id).length})
                    </summary>
                    <ul className="mt-1.5 space-y-1 border-l border-border pl-3">
                      {porCategoria(c.id).map((m) => (
                        <li key={m.id} className="flex items-baseline justify-between gap-2 text-xs">
                          <span className="min-w-0 truncate text-muted-foreground">
                            {fechaCorta(m.fecha)} · {m.descripcion || 'sin descripcion'}
                            {m.impulsivo && ' ⚡'}
                          </span>
                          <span className="shrink-0 tabular-nums">{eur(Number(m.importe))}</span>
                        </li>
                      ))}
                    </ul>
                    <a href="#movimientos" className="mt-1.5 inline-block text-xs text-primary underline">
                      Corregir alguno
                    </a>
                  </details>
                )}
              </li>
            ))}
          </ul>
          {resumen.gastoEnSobres > 0 && (
            <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground tabular-nums">
              Ademas has gastado {eur(resumen.gastoEnSobres)} este mes en presupuestos concretos, que van aparte.
            </p>
          )}
          {resumen.sinPresupuesto.length > 0 && (
            <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
              Sin presupuesto:{' '}
              {resumen.sinPresupuesto.map((c) => `${c.nombre} ${eur(c.gastado)}`).join(' · ')}.{' '}
              <Link href="/app/finanzas/ajustes" className="underline">Ponles uno</Link>.
            </p>
          )}
        </Tarjeta>
      ) : (
        <Tarjeta className="border-amber-500/40">
          <p className="text-sm">
            Aun no tienes presupuestos. Sin ellos puedo sumar lo que gastas, pero no decirte si vas bien.{' '}
            <Link href="/app/finanzas/ajustes" className="text-primary underline">Poner presupuestos</Link>.
          </p>
        </Tarjeta>
      )}

      {donde.lineas.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>En que se te va</TituloTarjeta>
          <p className="mb-3 text-xs text-muted-foreground">
            Todo lo gastado este mes, tenga presupuesto o no, contando tambien los sobres. La tarjeta de arriba dice si
            te has pasado; esta dice en que vives.
          </p>
          <ul className="space-y-2.5">
            {donde.lineas.map((c) => (
              <li key={c.id}>
                <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                  <span className="min-w-0 truncate">
                    {c.emoji} {c.nombre}
                    <span className="ml-1 text-xs text-muted-foreground">{c.pct} %</span>
                    {c.cambio !== null && Math.abs(c.cambio) >= 15 && (
                      <span className={`ml-1 text-xs ${c.cambio > 0 ? TONOS.aviso : TONOS.bien}`}>
                        {c.cambio > 0 ? '+' : ''}{c.cambio} % vs mes pasado
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 tabular-nums">{eur(c.gastado)}</span>
                </div>
                <Barra
                  valor={donde.total > 0 ? (c.gastado / donde.lineas[0].gastado) * 100 : 0}
                  color={c.inversion ? 'hsl(var(--area-habitos))' : 'hsl(var(--primary))'}
                />
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground tabular-nums">
            Total del mes: {eur(donde.total)} en {donde.lineas.length}{' '}
            {donde.lineas.length === 1 ? 'categoria' : 'categorias'}.
            {donde.lineas[0] ? ` Lo mas gordo, ${donde.lineas[0].nombre.toLowerCase()} (${donde.lineas[0].pct} %).` : ''}
          </p>
        </Tarjeta>
      )}

      <Tarjeta>
        <TituloTarjeta>El mes, semana a semana</TituloTarjeta>
        <p className="mb-3 text-xs text-muted-foreground">
          Comparadas por gasto al dia, no por total: la primera semana del mes y la ultima casi nunca tienen siete dias,
          y compararlas a pelo seria mentir con la verdad por delante.
        </p>
        <ul className="space-y-2.5">
          {semanas.map((w) => (
            <li key={w.numero}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span>
                  {w.pasado ? '🔴' : w.encurso ? '🔵' : '🟢'} {w.numero}.ª
                  <span className="ml-1 text-xs text-muted-foreground">
                    {Number(w.desde.slice(8, 10))}–{Number(w.hasta.slice(8, 10))}
                    {w.dias !== 7 ? ` · ${w.dias} d` : ''}
                    {w.encurso ? ' · en curso' : ''}
                  </span>
                </span>
                <span className="tabular-nums">
                  <strong>{eur(w.gastos)}</strong>
                  <span className="text-muted-foreground"> · {eur(w.porDia)}/dia</span>
                </span>
              </div>
              <Barra
                valor={(w.porDia / picoSemana) * 100}
                color={w.pasado ? SEMAFORO.pasado.color : w.encurso ? 'hsl(var(--primary))' : SEMAFORO.bien.color}
              />
              {w.limite !== null && (
                <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                  {w.gastos > w.limite
                    ? `${eur(w.gastos - w.limite)} por encima de lo que tocaba en ${w.dias} dias`
                    : `${eur(w.limite - w.gastos)} por debajo de lo que tocaba en ${w.dias} dias`}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Tu semana en dinero</TituloTarjeta>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/40 p-3">
            <dt className="text-xs text-muted-foreground">Gastado desde el lunes</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">{eur(semana.gastado)}</dd>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <dt className="text-xs text-muted-foreground">Donde mas</dt>
            <dd className="mt-0.5 font-semibold">{semana.categoriaTop ? `${semana.categoriaTop.nombre} · ${eur(semana.categoriaTop.gastado)}` : '—'}</dd>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <dt className="text-xs text-muted-foreground">De impulso</dt>
            <dd className="mt-0.5 font-semibold tabular-nums">{semana.impulsivo ? eur(semana.impulsivo) : '0 €'}</dd>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <dt className="text-xs text-muted-foreground">Dentro del presupuesto</dt>
            <dd className={`mt-0.5 font-semibold ${semana.dentroDePresupuesto === false ? TONOS.alerta : TONOS.bien}`}>
              {semana.dentroDePresupuesto === null ? '—' : semana.dentroDePresupuesto ? 'Si' : 'No'}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-sm text-muted-foreground">{semana.sugerencia}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          La pregunta de fondo no es cuanto has gastado, es si ese dinero te acerca a la vida que quieres.
          100 € en formacion y 100 € en tres cenas de impulso no valen lo mismo.
        </p>
      </Tarjeta>

      <Tarjeta id="movimientos">
        <TituloTarjeta>Movimientos del mes</TituloTarjeta>
        {delMes.length ? (
          <ul className="divide-y divide-border">
            {delMes.slice(0, 60).map((m) => {
              const cat = infoCategoria(m.categoria);
              const sobre = m.sobre_id ? resumen.sobres.find((s) => s.id === m.sobre_id) : null;
              return (
                <li key={m.id} className="py-2 text-sm">
                  <details className="group">
                    <summary className="flex cursor-pointer items-center gap-3 marker:content-['']">
                      <span className="text-base">{cat.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate">
                          {m.descripcion || cat.nombre}
                          {m.impulsivo && <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">⚡</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {fechaCorta(m.fecha)} · {cat.nombre}
                          {m.ambito === 'empresa' ? ' · empresa' : ''}
                          {sobre ? ` · ${sobre.nombre}` : ''}
                          {m.deuda_id ? ' · cuota' : ''}
                        </div>
                      </div>
                      <span className={`shrink-0 tabular-nums ${m.tipo === 'ingreso' ? TONOS.bien : ''}`}>
                        {m.tipo === 'ingreso' ? '+' : '−'}{eur(Number(m.importe))}
                      </span>
                      <Pencil size={14} className="shrink-0 text-muted-foreground transition-colors group-open:text-primary" />
                    </summary>

                    {/* Corregir sin tener que borrar y volver a apuntar. */}
                    <form action={editarMovimiento.bind(null, m.id)} className="mt-3 space-y-3 rounded-lg bg-muted/40 p-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Selector etiqueta="Categoria" name="categoria" defaultValue={m.categoria}>
                          {CATEGORIAS.map((c) => (
                            <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
                          ))}
                        </Selector>
                        <Campo etiqueta="Importe" name="importe" inputMode="decimal" defaultValue={String(Number(m.importe))} />
                      </div>
                      <Campo etiqueta="Descripcion" name="descripcion" defaultValue={m.descripcion ?? ''} placeholder="Menu del mediodia" />
                      <div className="grid grid-cols-2 gap-3">
                        <Campo etiqueta="Dia" name="fecha" type="date" defaultValue={m.fecha} max={hoy} />
                        <Selector etiqueta="Ambito" name="ambito" defaultValue={m.ambito}>
                          <option value="personal">Personal</option>
                          <option value="empresa">Empresa</option>
                        </Selector>
                      </div>
                      {resumen.sobres.length > 0 && (
                        <Selector etiqueta="¿Va a un presupuesto concreto?" name="sobre_id" defaultValue={m.sobre_id ?? ''}>
                          <option value="">Dia a dia</option>
                          {resumen.sobres.map((sb) => (
                            <option key={sb.id} value={sb.id}>{sb.emoji || '🎯'} {sb.nombre}</option>
                          ))}
                        </Selector>
                      )}
                      {/* Atar el pago a su deuda hace que la deuda baje sola. */}
                      {deudas.alguna && m.tipo === 'gasto' && (
                        <Selector etiqueta="¿Es la cuota de una deuda?" name="deuda_id" defaultValue={m.deuda_id ?? ''}>
                          <option value="">No</option>
                          {deudas.deudas.map((d) => (
                            <option key={d.id} value={d.id}>{d.emoji} {d.nombre}</option>
                          ))}
                        </Selector>
                      )}
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input type="checkbox" name="impulsivo" defaultChecked={m.impulsivo} className="h-4 w-4 rounded border-input" />
                        Fue un impulso
                      </label>
                      <div className="flex gap-2">
                        <Boton type="submit" variante="secundario" className="flex-1">Guardar cambios</Boton>
                      </div>
                    </form>
                    <form action={borrarMovimiento.bind(null, m.id)} className="mt-2">
                      <button type="submit" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                        <Trash2 size={13} /> Borrar este apunte
                      </button>
                    </form>
                  </details>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nada apuntado este mes todavia.</p>
        )}
        {delMes.length > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            Toca cualquier apunte para corregirlo: la categoria, el importe, el dia o la descripcion.
          </p>
        )}
        {finanzas.ajustes && (
          <p className="mt-3 text-xs text-muted-foreground">
            Caja de referencia: {eur(Number(finanzas.ajustes.caja_inicial))} el {fechaCorta(finanzas.ajustes.caja_fecha)}.{' '}
            <Link href="/app/finanzas/ajustes" className="underline">Corregirla</Link> si no cuadra.
          </p>
        )}
      </Tarjeta>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Tambien puedes decirselo al <Link href="/app/coach" className="text-primary underline">coach</Link>: &ldquo;me he
        gastado 18 € en el menu&rdquo; y lo apunta el.
      </p>
    </main>
  );
}
