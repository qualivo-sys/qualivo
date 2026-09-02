import { archivarHabito, crearHabito } from '@/app/app/acciones';
import HabitosHoy from '@/components/habitos-hoy';
import { Boton, Campo, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel } from '@/lib/datos';
import { sumarDias } from '@/lib/fechas';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export default async function PaginaHabitos() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);

  const ultimos7 = Array.from({ length: 7 }, (_, i) => sumarDias(panel.hoy, i - 6));
  const hechosHoy = panel.registrosHabitos
    .filter((r) => r.fecha === panel.hoy && r.hecho)
    .map((r) => r.habito_id);

  return (
    <main className="space-y-4">
      <h1>Habitos</h1>

      <Tarjeta>
        <TituloTarjeta>Hoy</TituloTarjeta>
        <HabitosHoy habitos={panel.habitos} hechos={hechosHoy} fecha={panel.hoy} />
      </Tarjeta>

      {panel.habitos.length > 0 && (
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
                {panel.habitos.map((habito) => (
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
          <Campo etiqueta="Nombre" name="nombre" required placeholder="10.000 pasos" />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Emoji" name="emoji" placeholder="🚶" maxLength={4} />
            <Campo
              etiqueta="Veces por semana" name="veces_por_semana" type="number"
              min={1} max={7} defaultValue={7}
            />
          </div>
          <Boton type="submit" className="w-full">Crear habito</Boton>
        </form>
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
