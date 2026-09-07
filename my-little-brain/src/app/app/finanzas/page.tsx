import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import RegistroGasto from '@/components/registro-gasto';
import { Barra, Boton, Campo, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { activarFinanzas, borrarMovimiento, cerrarSobre } from '@/app/app/finanzas/acciones';
import { cargarFinanzas } from '@/lib/datos';
import { fechaCorta, hoy as hoyIso, inicioSemana } from '@/lib/fechas';
import {
  categoria as infoCategoria,
  insightsFinanzas,
  mesAnteriorA,
  nombreMes,
  resumenFinanzas,
  revisionSemana,
} from '@/lib/motor/finanzas';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const eur = (n: number) => `${n.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`;

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

export default async function PaginaFinanzas() {
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

  const resumen = resumenFinanzas({ ...finanzas, ingresosPrevistos: finanzas.ingresos, hoy });
  const sobresAbiertos = resumen.sobres.filter((s) => !s.cerrado);
  const sobresCerrados = resumen.sobres.filter((s) => s.cerrado);
  const anterior = resumenFinanzas({ ...finanzas, ingresosPrevistos: finanzas.ingresos, hoy, mes: mesAnteriorA(resumen.mes) });
  const insights = insightsFinanzas(resumen, anterior, finanzas.ajustes);
  const lunes = inicioSemana(hoy);
  const semana = revisionSemana(finanzas.movimientos, resumen, lunes, hoy);
  const delMes = finanzas.movimientos.filter((m) => m.fecha.slice(0, 7) === resumen.mes);
  const frecuentes = [...new Set(finanzas.movimientos.slice(0, 40).map((m) => m.categoria))].slice(0, 4);

  return (
    <main className="space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h1>Dinero</h1>
          <p className="mt-1 text-sm text-muted-foreground">{nombreMes(resumen.mes)}</p>
        </div>
        <Link href="/app/finanzas/ajustes" className="text-sm text-primary underline">Ajustes</Link>
      </div>

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
          sobres={sobresAbiertos.map((s) => ({ id: s.id, nombre: s.nombre, emoji: s.emoji, disponible: s.disponible }))}
        />
      </Tarjeta>

      {insights.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Lo que veo</TituloTarjeta>
          <ul className="space-y-1.5 text-sm">
            {insights.map((i) => (
              <li key={i.texto} className={TONOS[i.tono]}>· {i.texto}</li>
            ))}
          </ul>
        </Tarjeta>
      )}

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

      <Tarjeta>
        <TituloTarjeta>Movimientos del mes</TituloTarjeta>
        {delMes.length ? (
          <ul className="divide-y divide-border">
            {delMes.slice(0, 40).map((m) => {
              const cat = infoCategoria(m.categoria);
              return (
                <li key={m.id} className="flex items-center gap-3 py-2 text-sm">
                  <span className="text-base">{cat.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate">
                      {m.descripcion || cat.nombre}
                      {m.impulsivo && <span className="ml-1 text-xs text-amber-600 dark:text-amber-400">⚡</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {fechaCorta(m.fecha)} · {cat.nombre}
                      {m.ambito === 'empresa' ? ' · empresa' : ''}
                      {m.sobre_id ? ` · ${resumen.sobres.find((s) => s.id === m.sobre_id)?.nombre ?? 'sobre'}` : ''}
                    </div>
                  </div>
                  <span className={`shrink-0 tabular-nums ${m.tipo === 'ingreso' ? TONOS.bien : ''}`}>
                    {m.tipo === 'ingreso' ? '+' : '−'}{eur(Number(m.importe))}
                  </span>
                  <form action={borrarMovimiento.bind(null, m.id)}>
                    <button type="submit" aria-label="Borrar" className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nada apuntado este mes todavia.</p>
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
