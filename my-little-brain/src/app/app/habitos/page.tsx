import { apuntarCaida, archivarHabito, borrarCaida, crearHabito } from '@/app/app/acciones';
import HabitosHoy from '@/components/habitos-hoy';
import { Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel } from '@/lib/datos';
import { fechaCorta, sumarDias } from '@/lib/fechas';
import { patronesRecaida, resumenEvitar, textoEvitar } from '@/lib/motor/habitos';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default async function PaginaHabitos() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);

  const ultimos7 = Array.from({ length: 7 }, (_, i) => sumarDias(panel.hoy, i - 6));
  const ultimos30 = Array.from({ length: 30 }, (_, i) => sumarDias(panel.hoy, i - 29));
  const hechosHoy = panel.registrosHabitos
    .filter((r) => r.fecha === panel.hoy && r.hecho)
    .map((r) => r.habito_id);

  const deHacer = panel.habitos.filter((h) => h.tipo !== 'evitar');
  const deEvitar = panel.habitos.filter((h) => h.tipo === 'evitar');

  return (
    <main className="space-y-4">
      <h1>Habitos</h1>

      <Tarjeta>
        <TituloTarjeta>Hoy</TituloTarjeta>
        <HabitosHoy habitos={deHacer} hechos={hechosHoy} fecha={panel.hoy} />
      </Tarjeta>

      {/* Los de evitar van aparte y con otra cara: aqui no se marca lo logrado,
          se apunta la caida, y el dia empieza en positivo. */}
      {deEvitar.map((habito) => {
        const r = resumenEvitar(habito, panel.registrosHabitos, ultimos30);
        const patrones = patronesRecaida(habito.id, panel.registrosHabitos, panel.dias);
        return (
          <Tarjeta key={habito.id} className={r.caidoHoy ? undefined : 'border-emerald-500/30'}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <TituloTarjeta className="mb-0">{habito.emoji} {habito.nombre}</TituloTarjeta>
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {r.diasLimpios}/{r.diasMirados} dias
              </span>
            </div>
            <p className={`text-sm ${r.caidoHoy ? 'text-muted-foreground' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {textoEvitar(r)}
            </p>

            <div className="mt-3 flex flex-wrap gap-1">
              {ultimos30.map((fecha) => {
                const cayo = panel.registrosHabitos.some((x) => x.habito_id === habito.id && x.fecha === fecha && x.hecho);
                return (
                  <span
                    key={fecha}
                    title={`${fechaCorta(fecha)}: ${cayo ? 'cai' : 'limpio'}`}
                    className={`h-3 w-3 rounded-sm ${cayo ? 'bg-amber-500/80' : 'bg-emerald-500/40'}`}
                  />
                );
              })}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Ultimos 30 dias · mejor racha {r.mejorRacha} {r.mejorRacha === 1 ? 'dia' : 'dias'}
            </p>

            {patrones.length > 0 && (
              <ul className="mt-3 space-y-1 border-t border-border pt-3 text-sm text-muted-foreground">
                {patrones.map((x) => <li key={x.id}>· {x.texto}</li>)}
              </ul>
            )}

            {r.caidoHoy ? (
              <form action={borrarCaida.bind(null, habito.id, panel.hoy)} className="mt-3">
                <Boton type="submit" variante="fantasma" tamano="sm">Me he confundido, quitalo</Boton>
              </form>
            ) : (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-muted-foreground marker:content-['']">
                  Hoy he caido
                </summary>
                <form action={apuntarCaida.bind(null, habito.id)} className="mt-2 space-y-2">
                  <Campo etiqueta="¿Que lo disparo? (opcional)" name="nota" placeholder="Mail del cliente a las 23:00" />
                  <Boton type="submit" variante="secundario" className="w-full">Apuntarlo</Boton>
                </form>
                <p className="mt-2 text-xs text-muted-foreground">
                  Apuntarlo no es castigarse: es lo unico que deja ver el patron. Y no resta puntos en ningun sitio.
                </p>
              </details>
            )}

            {r.recaidas.some((x) => x.nota) && (
              <details className="mt-3 border-t border-border pt-3">
                <summary className="cursor-pointer text-sm text-primary marker:content-['']">
                  Que lo dispara ({r.recaidas.filter((x) => x.nota).length})
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {r.recaidas.filter((x) => x.nota).slice(0, 8).map((x) => (
                    <li key={x.fecha}>{fechaCorta(x.fecha)} · {x.nota}</li>
                  ))}
                </ul>
              </details>
            )}
          </Tarjeta>
        );
      })}

      {deHacer.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Ultimos 7 dias</TituloTarjeta>
          <div className="desplazable-x">
            <table className="w-full min-w-max text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Habito</th>
                  {ultimos7.map((fecha) => (
                    <th key={fecha} className="w-8 pb-2 text-center font-medium">
                      {DIAS[(new Date(fecha + 'T12:00:00').getDay() + 6) % 7]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deHacer.map((habito) => (
                  <tr key={habito.id} className="border-t border-border">
                    <td className="py-2 pr-3">
                      {habito.emoji} {habito.nombre}
                    </td>
                    {ultimos7.map((fecha) => {
                      const hecho = panel.registrosHabitos.some(
                        (r) => r.habito_id === habito.id && r.fecha === fecha && r.hecho,
                      );
                      return (
                        <td key={fecha} className="py-2 text-center">
                          <span
                            aria-label={hecho ? 'hecho' : 'sin marcar'}
                            className={`inline-block h-4 w-4 rounded ${
                              hecho ? 'bg-[hsl(var(--area-habitos))]' : 'bg-muted'
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tarjeta>
      )}

      <Tarjeta>
        <TituloTarjeta>Nuevo habito</TituloTarjeta>
        <form action={crearHabito} className="space-y-3">
          <Selector etiqueta="Que quieres" name="tipo" defaultValue="hacer">
            <option value="hacer">Hacer algo (andar, leer, estirar)</option>
            <option value="evitar">Evitar algo (rumiar, mirar metricas a todas horas)</option>
          </Selector>
          <Campo etiqueta="Nombre" name="nombre" required placeholder="10.000 pasos" />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Emoji" name="emoji" placeholder="🚶" maxLength={4} />
            <Campo
              etiqueta="Veces por semana" name="veces_por_semana" type="number"
              min={1} max={7} defaultValue={7}
              ayuda="Solo para los de hacer"
            />
          </div>
          <Boton type="submit" className="w-full">Crear habito</Boton>
        </form>
        <p className="mt-3 text-xs text-muted-foreground">
          En los de evitar no hay que marcar nada cada dia: solo se apunta cuando caes, y el silencio
          quiere decir que ese dia lo evitaste.
        </p>
      </Tarjeta>

      {panel.habitos.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Archivar</TituloTarjeta>
          <ul className="space-y-2 text-sm">
            {panel.habitos.map((habito) => (
              <li key={habito.id} className="flex items-center justify-between">
                <span>
                  {habito.emoji} {habito.nombre}
                </span>
                <form action={archivarHabito.bind(null, habito.id)}>
                  <Boton type="submit" variante="fantasma" tamano="sm">Archivar</Boton>
                </form>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}
    </main>
  );
}
