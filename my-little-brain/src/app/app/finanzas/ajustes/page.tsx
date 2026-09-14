import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import {
  actualizarSaldos,
  borrarCuenta,
  borrarIngreso,
  borrarPresupuesto,
  borrarSobre,
  crearCuenta,
  crearSobre,
  editarCuenta,
  guardarAjustesFinanzas,
  guardarIngreso,
  guardarPresupuesto,
} from '@/app/app/finanzas/acciones';
import { cargarFinanzas } from '@/lib/datos';
import { fechaCorta, hoy as hoyIso } from '@/lib/fechas';
import { CATEGORIAS, categoria as infoCategoria, resumenCuentas, TIPOS_CUENTA } from '@/lib/motor/finanzas';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const eur = (n: number) => `${Number(n).toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`;

export default async function AjustesFinanzas() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const hoy = hoyIso(perfil.zona_horaria || undefined);
  const { ajustes, ingresos, presupuestos, sobres, movimientos, cuentas } = await cargarFinanzas(supabase, usuario.id, hoy);
  const cajas = resumenCuentas(cuentas, { ambito: 'todo', fechaFoto: ajustes?.caja_fecha ?? null, hoy });

  const totalIngresos = ingresos.filter((i) => i.activo !== false).reduce((t, i) => t + Number(i.importe), 0);
  const totalPresupuesto = presupuestos.filter((p) => p.activo !== false).reduce((t, p) => t + Number(p.importe), 0);
  const puestas = new Set(presupuestos.map((p) => p.categoria));

  return (
    <main className="space-y-4">
      <div>
        <h1>Ajustes de dinero</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tus ingresos previstos, tu presupuesto por categoria y tus objetivos.{' '}
          <Link href="/app/finanzas" className="text-primary underline">Volver</Link>
        </p>
      </div>

      <Tarjeta>
        <TituloTarjeta>Caja y objetivos</TituloTarjeta>
        <form action={guardarAjustesFinanzas} className="space-y-3">
          <Campo
            etiqueta="Dinero que tienes ahora"
            name="caja_inicial"
            inputMode="decimal"
            defaultValue={ajustes ? String(Number(ajustes.caja_inicial)) : ''}
            ayuda={ajustes ? `Ultima referencia: ${eur(Number(ajustes.caja_inicial))} el ${fechaCorta(ajustes.caja_fecha)}. Si lo cambias, la fecha pasa a hoy.` : undefined}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Campo etiqueta="Ahorro al mes" name="ahorro_mes" inputMode="decimal" defaultValue={ajustes?.ahorro_mes ? String(Number(ajustes.ahorro_mes)) : ''} />
            <Campo etiqueta="Caja minima" name="caja_minima" inputMode="decimal" defaultValue={ajustes?.caja_minima ? String(Number(ajustes.caja_minima)) : ''} />
          </div>
          <Boton type="submit" variante="secundario" className="w-full">Guardar</Boton>
        </form>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Ingresos previstos al mes</TituloTarjeta>
        {ingresos.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {ingresos.map((i) => (
              <li key={i.id} className="flex items-center gap-3 py-2 text-sm">
                <div className="flex-1">
                  <div>{i.nombre}</div>
                  <div className="text-xs text-muted-foreground">{i.ambito === 'empresa' ? 'empresa' : 'personal'}</div>
                </div>
                <span className="tabular-nums">{eur(Number(i.importe))}</span>
                <form action={borrarIngreso.bind(null, i.id)}>
                  <button type="submit" aria-label={`Borrar ${i.nombre}`} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
        {totalIngresos > 0 && (
          <p className="mb-3 text-sm tabular-nums">Total previsto: <strong>{eur(totalIngresos)}</strong></p>
        )}
        <form action={guardarIngreso} className="space-y-3 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Concepto" name="nombre" placeholder="Nomina, Cliente A…" required />
            <Campo etiqueta="Importe" name="importe" inputMode="decimal" placeholder="2040" required />
          </div>
          <Selector etiqueta="Ambito" name="ambito" defaultValue="personal">
            <option value="personal">Personal</option>
            <option value="empresa">Empresa</option>
          </Selector>
          <Boton type="submit" variante="contorno" className="w-full">Anadir ingreso</Boton>
        </form>
      </Tarjeta>

      <Tarjeta id="cajas">
        <TituloTarjeta>Donde tienes el dinero</TituloTarjeta>
        <p className="mb-3 text-xs text-muted-foreground">
          No es lo mismo tener 6.000 € en la cuenta de siempre que 5.000 en un fondo de emergencia que no piensas tocar.
          Lo que marques como ahorro se lee aparte de lo que tienes para el dia a dia.
        </p>

        {cuentas.length > 0 ? (
          <>
            {/* Se actualizan TODAS a la vez a proposito: los saldos son una foto
                a una fecha, y actualizar una sola dejaria las demas en la foto
                vieja, contando mal los apuntes de por medio. */}
            <form action={actualizarSaldos} className="space-y-3">
              {cuentas.map((c) => (
                <Campo
                  key={c.id}
                  etiqueta={`${c.nombre}${c.ahorro ? ' · ahorro' : ''}${c.ambito === 'empresa' ? ' · empresa' : ''}`}
                  name={`saldo_${c.id}`}
                  inputMode="decimal"
                  defaultValue={String(Number(c.saldo))}
                />
              ))}
              <Boton type="submit" className="w-full">Poner al dia los saldos</Boton>
            </form>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg bg-muted/40 p-2.5">
                <div className="font-semibold tabular-nums">{eur(cajas.total)}</div>
                <div className="text-xs text-muted-foreground">en total</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5">
                <div className="font-semibold tabular-nums">{eur(cajas.ahorrado)}</div>
                <div className="text-xs text-muted-foreground">ahorrado</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-2.5">
                <div className="font-semibold tabular-nums">{eur(cajas.disponible)}</div>
                <div className="text-xs text-muted-foreground">dia a dia</div>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Ultima foto: {ajustes?.caja_fecha ? fechaCorta(ajustes.caja_fecha) : '—'}. Pon los saldos tal y como los
              ves en el banco: lo que ya habias apuntado antes de esta foto no se vuelve a restar.
            </p>

            <details className="mt-3 border-t border-border pt-3">
              <summary className="cursor-pointer text-sm text-muted-foreground">Renombrar o quitar cajas</summary>
              <ul className="mt-3 space-y-3">
                {cuentas.map((c) => (
                  <li key={c.id} className="rounded-lg bg-muted/40 p-3">
                    <form action={editarCuenta.bind(null, c.id)} className="space-y-2.5">
                      <Campo etiqueta="Nombre" name="nombre" defaultValue={c.nombre} />
                      <div className="grid grid-cols-2 gap-2.5">
                        <Selector etiqueta="Tipo" name="tipo" defaultValue={c.tipo}>
                          {TIPOS_CUENTA.map((t) => (
                            <option key={t.id} value={t.id}>{t.emoji} {t.nombre}</option>
                          ))}
                        </Selector>
                        <Selector etiqueta="Ambito" name="ambito" defaultValue={c.ambito}>
                          <option value="personal">Personal</option>
                          <option value="empresa">Empresa</option>
                        </Selector>
                      </div>
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input type="checkbox" name="ahorro" defaultChecked={c.ahorro} className="h-4 w-4 rounded border-input" />
                        Esto es ahorro, no dinero del dia a dia
                      </label>
                      <div className="flex items-center gap-3">
                        <Boton type="submit" variante="secundario" className="flex-1">Guardar</Boton>
                      </div>
                    </form>
                    <form action={borrarCuenta.bind(null, c.id)} className="mt-2">
                      <button type="submit" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                        <Trash2 size={13} /> Quitar esta caja
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            </details>
          </>
        ) : (
          <p className="mb-3 text-sm text-muted-foreground">
            Aun no has dicho donde tienes el dinero. Mientras tanto se usa el numero suelto de la caja de arriba.
          </p>
        )}

        <details className="mt-3 border-t border-border pt-3" open={cuentas.length === 0}>
          <summary className="cursor-pointer text-sm text-primary">Añadir una caja</summary>
          <form action={crearCuenta} className="mt-3 space-y-3">
            <Campo etiqueta="¿Como se llama?" name="nombre" placeholder="Fondo de emergencia" required />
            <div className="grid grid-cols-2 gap-3">
              <Selector etiqueta="Tipo" name="tipo" defaultValue="corriente">
                {TIPOS_CUENTA.map((t) => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.nombre}</option>
                ))}
              </Selector>
              <Campo etiqueta="¿Cuanto hay?" name="saldo" inputMode="decimal" placeholder="5000" />
            </div>
            <Selector etiqueta="Ambito" name="ambito" defaultValue="personal">
              <option value="personal">Personal</option>
              <option value="empresa">Empresa</option>
            </Selector>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" name="ahorro" className="h-4 w-4 rounded border-input" />
              Esto es ahorro, no dinero del dia a dia
            </label>
            <Boton type="submit" className="w-full">Añadir la caja</Boton>
          </form>
          <p className="mt-2 text-xs text-muted-foreground">
            Las de ahorro e inversion se marcan como ahorro solas.
          </p>
        </details>
      </Tarjeta>

      <Tarjeta id="sobres">
        <TituloTarjeta>Presupuesto para algo concreto</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">
          Un finde en Roma, la boda de tu primo, las vacaciones. Le pones nombre y un importe, y al apuntar un gasto
          eliges si va ahi. No toca tu presupuesto mensual.
        </p>
        {sobres.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {sobres.map((s) => {
              const gastado = movimientos
                .filter((m) => m.sobre_id === s.id && m.tipo === 'gasto')
                .reduce((t, m) => t + Number(m.importe), 0);
              return (
                <li key={s.id} className="flex items-center gap-3 py-2 text-sm">
                  <div className="min-w-0 flex-1">
                    <div className="truncate">
                      {s.emoji || '🎯'} {s.nombre}
                      {s.cerrado && <span className="ml-1 text-xs text-muted-foreground">cerrado</span>}
                    </div>
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {eur(gastado)} de {eur(Number(s.importe))}
                      {s.hasta ? ` · hasta el ${fechaCorta(s.hasta)}` : ''}
                    </div>
                  </div>
                  <form action={borrarSobre.bind(null, s.id)}>
                    <button type="submit" aria-label={`Borrar ${s.nombre}`} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
        <form action={crearSobre} className="space-y-3 border-t border-border pt-3">
          <div className="grid grid-cols-[4rem_1fr] gap-3">
            <Campo etiqueta="Icono" name="emoji" placeholder="✈️" maxLength={4} />
            <Campo etiqueta="Para que es" name="nombre" placeholder="Finde en Roma" required />
          </div>
          <Campo etiqueta="Cuanto quieres gastar" name="importe" inputMode="decimal" placeholder="400" required />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Desde (opcional)" name="desde" type="date" />
            <Campo etiqueta="Hasta (opcional)" name="hasta" type="date" />
          </div>
          <Boton type="submit" variante="contorno" className="w-full">Crear el presupuesto</Boton>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          Si le pones fecha de fin, te avisa cuando queden pocos dias y poco dinero. Al borrarlo, sus gastos vuelven al
          dia a dia.
        </p>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Presupuesto por categoria</TituloTarjeta>
        {presupuestos.length > 0 && (
          <ul className="mb-4 divide-y divide-border">
            {presupuestos.map((p) => {
              const cat = infoCategoria(p.categoria);
              return (
                <li key={p.id} className="flex items-center gap-3 py-2 text-sm">
                  <span className="flex-1">{cat.emoji} {cat.nombre}</span>
                  <span className="tabular-nums">{eur(Number(p.importe))}</span>
                  <form action={borrarPresupuesto.bind(null, p.id)}>
                    <button type="submit" aria-label={`Borrar ${cat.nombre}`} className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
        {totalPresupuesto > 0 && (
          <p className="mb-3 text-sm tabular-nums">
            Total: <strong>{eur(totalPresupuesto)}</strong>
            {totalIngresos > 0 && ` de ${eur(totalIngresos)} previstos · margen ${eur(totalIngresos - totalPresupuesto)}`}
          </p>
        )}
        <form action={guardarPresupuesto} className="space-y-3 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Categoria" name="categoria" defaultValue={CATEGORIAS.find((c) => !puestas.has(c.id))?.id ?? 'otros'}>
              {CATEGORIAS.map((c) => (
                <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
              ))}
            </Selector>
            <Campo etiqueta="Al mes" name="importe" inputMode="decimal" placeholder="150" required />
          </div>
          <Boton type="submit" variante="contorno" className="w-full">Guardar presupuesto</Boton>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          No hace falta ponerlos todos. Con las tres o cuatro categorias donde se te va el dinero ya tienes control.
        </p>
      </Tarjeta>
    </main>
  );
}
