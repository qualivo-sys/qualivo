import { Moon, Sun } from 'lucide-react';
import { guardarCheckIn, guardarFoco, guardarMedicion } from '@/app/app/acciones';
import { Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel } from '@/lib/datos';
import { fechaLarga } from '@/lib/fechas';
import { ETIQUETA_CATEGORIA_FOCO } from '@/lib/perfil';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function PaginaCheckIn() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);

  const { data: bienestarHoy } = await supabase
    .from('bienestar')
    .select('*')
    .eq('user_id', usuario.id)
    .eq('fecha', panel.hoy)
    .maybeSingle();

  const focoHoy = panel.diaHoy.focoMin;

  return (
    <main className="space-y-4">
      <div>
        <h1>Check-in</h1>
        <p className="mt-1 text-sm text-muted-foreground">{fechaLarga(panel.hoy)}</p>
      </div>

      <Tarjeta>
        <div className="mb-3 flex items-center gap-2">
          <Sun size={18} className="text-[hsl(var(--area-mente))]" />
          <TituloTarjeta className="mb-0">Manana</TituloTarjeta>
        </div>
        <form action={guardarCheckIn} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo
              etiqueta="Horas de sueno" name="sueno_horas" type="number" step="0.5"
              inputMode="decimal" defaultValue={bienestarHoy?.sueno_horas ?? ''}
            />
            <Campo
              etiqueta="Calidad (1-10)" name="sueno_calidad" type="number" min={1} max={10}
              defaultValue={bienestarHoy?.sueno_calidad ?? ''}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Campo etiqueta="Animo" name="animo" type="number" min={1} max={10} defaultValue={bienestarHoy?.animo ?? ''} />
            <Campo etiqueta="Energia" name="energia" type="number" min={1} max={10} defaultValue={bienestarHoy?.energia ?? ''} />
            <Campo etiqueta="Estres" name="estres" type="number" min={1} max={10} defaultValue={bienestarHoy?.estres ?? ''} />
          </div>
          <Boton type="submit" className="w-full">Guardar como estoy hoy</Boton>
        </form>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Peso de hoy</TituloTarjeta>
        <form action={guardarMedicion} className="space-y-3">
          <Campo etiqueta="Peso (kg)" name="peso_kg" type="number" step="0.1" inputMode="decimal" />
          <Boton type="submit" variante="secundario" className="w-full">Guardar peso</Boton>
        </form>
        {panel.cuerpo.peso && (
          <p className="mt-2 text-xs text-muted-foreground">
            Ultimo registro: {panel.cuerpo.peso} kg ({panel.cuerpo.fecha}).
          </p>
        )}
      </Tarjeta>

      <Tarjeta>
        <div className="mb-3 flex items-center gap-2">
          <Moon size={18} className="text-[hsl(var(--area-foco))]" />
          <TituloTarjeta className="mb-0">Noche</TituloTarjeta>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          Hoy llevas {(focoHoy / 60).toFixed(1)} h de foco. Suma un bloque:
        </p>
        <form action={guardarFoco} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Tipo" name="categoria" defaultValue="deep_work">
              {Object.entries(ETIQUETA_CATEGORIA_FOCO).map(([valor, etiqueta]) => (
                <option key={valor} value={valor}>{etiqueta}</option>
              ))}
            </Selector>
            <Campo etiqueta="Minutos" name="minutos" type="number" inputMode="numeric" required />
          </div>
          <Campo etiqueta="En que" name="descripcion" placeholder="Propuesta para EAC" />
          <Boton type="submit" variante="secundario" className="w-full">Anadir bloque de foco</Boton>
        </form>

        <form action={guardarCheckIn} className="mt-4 space-y-3 border-t border-border pt-4">
          <Campo
            etiqueta="Pasos" name="pasos" type="number" inputMode="numeric"
            defaultValue={bienestarHoy?.pasos ?? ''}
          />
          <Campo
            etiqueta="Notas del dia" name="notas" defaultValue={bienestarHoy?.notas ?? ''}
            placeholder="Que ha ido bien, que se ha torcido"
          />
          <Boton type="submit" className="w-full">Cerrar el dia</Boton>
        </form>
      </Tarjeta>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Todo esto tambien puedes contarselo al coach en una frase y lo apunta el.
      </p>
    </main>
  );
}
