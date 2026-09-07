import { Coffee, Droplets, Moon } from 'lucide-react';
import Link from 'next/link';
import { guardarCafe, guardarHorarioObjetivo } from '@/app/app/descanso/acciones';
import RegistroSueno from '@/components/registro-sueno';
import VasoAgua from '@/components/vaso-agua';
import { Boton, Campo, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { cargarPanel } from '@/lib/datos';
import { fechaCorta } from '@/lib/fechas';
import {
  desgloseAgua,
  impactoSueno,
  insightsDescanso,
  objetivoAgua,
  objetivoSueno,
  resumenAgua,
  resumenSueno,
} from '@/lib/motor/descanso';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const DIAS_VENTANA = 14;

const tonos = {
  alerta: 'text-destructive',
  aviso: 'text-amber-600 dark:text-amber-400',
  bien: 'text-emerald-600 dark:text-emerald-400',
  info: 'text-muted-foreground',
} as const;

export default async function PaginaDescanso() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);

  const dias = panel.dias.slice(-DIAS_VENTANA);
  const hoyDia = panel.diaHoy;

  const contextoAgua = {
    pesoKg: panel.cuerpo.peso ?? 75,
    entreno: hoyDia.entreno || hoyDia.actividad,
    alcoholUd: hoyDia.alcoholUd,
  };
  const metaAgua = objetivoAgua(contextoAgua);
  const agua = resumenAgua(dias, metaAgua, panel.hoy);

  const metaSueno = objetivoSueno(perfil.hora_dormir, perfil.hora_despertar);
  const sueno = resumenSueno(dias, metaSueno);
  const patrones = impactoSueno(panel.dias);
  const avisos = insightsDescanso({ dias, sueno, agua, hoy: panel.hoy, horaObjetivo: perfil.hora_dormir });

  const noches = dias.filter((d) => d.suenoHoras !== null);
  const maxHoras = Math.max(9, ...noches.map((d) => d.suenoHoras!));

  return (
    <main className="space-y-4">
      <div>
        <h1>Descanso</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lo que mas mueve tu dia y lo que menos apunta todo el mundo: cuanto duermes y cuanta agua bebes.
        </p>
      </div>

      <Tarjeta>
        <div className="mb-3 flex items-center gap-2">
          <Droplets size={18} className="text-sky-500" />
          <TituloTarjeta className="mb-0">Agua de hoy</TituloTarjeta>
        </div>
        <VasoAgua ml={agua.hoyMl} objetivoMl={metaAgua} />
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          Tu objetivo de hoy sale de {desgloseAgua(contextoAgua).map((p) => `${p.ml} ml ${p.etiqueta}`).join(' + ')}.
          {agua.racha >= 2 && ` Llevas ${agua.racha} dias seguidos cumpliendolo.`}
        </p>
      </Tarjeta>

      <Tarjeta>
        <div className="mb-3 flex items-center gap-2">
          <Moon size={18} className="text-indigo-500" />
          <TituloTarjeta className="mb-0">Anoche</TituloTarjeta>
        </div>
        <RegistroSueno
          inicio={hoyDia.suenoInicio}
          fin={hoyDia.suenoFin}
          calidad={hoyDia.suenoCalidad}
          horasGuardadas={hoyDia.suenoHoras}
        />
      </Tarjeta>

      {avisos.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Lo que veo</TituloTarjeta>
          <ul className="space-y-2 text-sm">
            {avisos.map((a) => (
              <li key={a.id} className={tonos[a.tono]}>· {a.texto}</li>
            ))}
          </ul>
        </Tarjeta>
      )}

      {noches.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Tus ultimas noches</TituloTarjeta>
          <div className="mb-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-lg font-semibold tabular-nums">
                {sueno.mediaHoras !== null ? `${String(sueno.mediaHoras).replace('.', ',')} h` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">de media</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-lg font-semibold tabular-nums">
                {sueno.regularidadMin !== null ? `±${sueno.regularidadMin} min` : '—'}
              </div>
              <div className="text-xs text-muted-foreground">regularidad</div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-lg font-semibold tabular-nums">
                {sueno.deudaHoras > 0 ? `${String(sueno.deudaHoras).replace('.', ',')} h` : '0 h'}
              </div>
              <div className="text-xs text-muted-foreground">de deuda</div>
            </div>
          </div>

          {/* Una barra por noche: se ve de un vistazo si el sueno es estable o un sube y baja. */}
          <div className="flex h-24 items-end gap-1">
            {dias.map((d) => (
              <div key={d.fecha} className="flex h-full flex-1 flex-col justify-end" title={`${fechaCorta(d.fecha)}: ${d.suenoHoras ?? '—'} h`}>
                <div
                  className={`w-full rounded-t ${
                    d.suenoHoras === null ? 'bg-muted' : d.suenoHoras < 6.5 ? 'bg-amber-500/70' : 'bg-indigo-500/70'
                  }`}
                  style={{ height: `${Math.max(4, ((d.suenoHoras ?? 0) / maxHoras) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {noches.length} de los ultimos {DIAS_VENTANA} dias apuntados · objetivo {String(metaSueno).replace('.', ',')} h
            {sueno.nochesCortas > 0 && ` · ${sueno.nochesCortas} ${sueno.nochesCortas === 1 ? 'noche corta' : 'noches cortas'}`}
          </p>
        </Tarjeta>
      )}

      {patrones.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Que te cuesta dormir poco</TituloTarjeta>
          <ul className="space-y-2 text-sm">
            {patrones.slice(0, 4).map((p) => (
              <li key={p.id} className={p.tono === 'bien' ? tonos.bien : p.tono === 'aviso' ? tonos.aviso : tonos.info}>
                · {p.texto}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Salen de tus propios dias, no de un articulo. Cuantos mas apuntes, mas fino hila.
          </p>
        </Tarjeta>
      )}

      <Tarjeta>
        <div className="mb-3 flex items-center gap-2">
          <Coffee size={18} className="text-amber-700 dark:text-amber-500" />
          <TituloTarjeta className="mb-0">Cafe de hoy</TituloTarjeta>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          No es para que dejes el cafe. Es para saber si el de media tarde te esta costando sueno.
        </p>
        <form action={guardarCafe} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Cuantos" name="cafes" type="number" min={0} max={12} inputMode="numeric" defaultValue={hoyDia.cafes || ''} />
            <Campo etiqueta="El ultimo, a las" name="cafeina_ultima" type="time" defaultValue={hoyDia.cafeinaUltima ?? ''} />
          </div>
          <Boton type="submit" variante="secundario" className="w-full">Guardar el cafe</Boton>
        </form>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>El horario que quieres tener</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">
          Esta es tu referencia, no una norma. La app compara con ella lo que haces de verdad y te dice cuanto os separais.
        </p>
        <form action={guardarHorarioObjetivo} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Acostarme a las" name="hora_dormir" type="time" defaultValue={perfil.hora_dormir ?? ''} />
            <Campo etiqueta="Levantarme a las" name="hora_despertar" type="time" defaultValue={perfil.hora_despertar ?? ''} />
          </div>
          <Boton type="submit" variante="contorno" className="w-full">Guardar el horario</Boton>
        </form>
      </Tarjeta>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Tambien puedes decirselo al <Link href="/app/coach" className="text-primary underline">coach</Link>: &ldquo;he dormido 6 horas y llevo dos botellas de agua&rdquo;.
      </p>
    </main>
  );
}
