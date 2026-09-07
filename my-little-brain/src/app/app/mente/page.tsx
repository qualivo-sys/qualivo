import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import EstadoEmocional from '@/components/estado-emocional';
import { Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { anadirHoja, borrarHoja, devolverHoja, guardarDiario, retirarHoja } from '@/app/app/mente/acciones';
import { cargarMente, cargarPanel } from '@/lib/datos';
import { fechaCorta, inicioSemana, sumarDias } from '@/lib/fechas';
import {
  TEMAS,
  evidenciasSemana,
  patronesEmocionales,
  perfilDeDias,
  resumenEmocional,
  tema as infoTema,
} from '@/lib/motor/emociones';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

const PREGUNTAS = [
  { campo: 'bien', titulo: '¿Que ha ido bien hoy?', ayuda: 'Una cosa por linea. He entrenado. He cerrado una reunion.' },
  { campo: 'preocupa', titulo: '¿Que te ha preocupado?', ayuda: 'Cada linea se posa como una hoja en el estanque.' },
  { campo: 'controlo', titulo: '¿Que puedes controlar?', ayuda: 'Convierte la preocupacion en accion: "hacer 5 seguimientos manana".' },
  { campo: 'aprendido', titulo: '¿Que has aprendido?', ayuda: 'Vale algo pequeno.' },
  { campo: 'agradecido', titulo: '¿Por que estas agradecido?', ayuda: 'Minimo una cosa.' },
] as const;

export default async function PaginaMente() {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);
  const mente = await cargarMente(supabase, usuario.id, panel.hoy);

  const lunes = inicioSemana(panel.hoy);
  const hoyDia = panel.dias.find((d) => d.fecha === panel.hoy);
  const emocionesHoy = mente.emociones.find((e) => e.fecha === panel.hoy)?.emociones ?? [];
  const resumen = resumenEmocional(panel.dias, mente.emociones, mente.hojas, sumarDias(panel.hoy, -29), panel.hoy);
  const patrones = patronesEmocionales({ dias: panel.dias, diario: mente.diario, hojas: mente.hojas, hoy: panel.hoy });
  const perfilDias = perfilDeDias(panel.dias);
  const evidencias = evidenciasSemana({ dias: panel.dias, diario: mente.diario, hojas: mente.hojas, desde: lunes, hasta: panel.hoy });
  const entrada = mente.entradaDeHoy;
  const abiertas = resumen.hojasAbiertas;
  const retiradas = mente.hojas.filter((h) => h.cerrada).slice(0, 5);

  return (
    <main className="space-y-4">
      <div>
        <h1>Mente</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Las emociones son el clima. Las preocupaciones son hojas sobre el estanque. El estanque sigue ahi aunque hoy no
          lo veas con claridad. 🌿
        </p>
      </div>

      {resumen.diasRegistrados >= 3 && (
        <Tarjeta>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Animo', resumen.animoMedio],
              ['Energia', resumen.energiaMedia],
              ['Estres', resumen.estresMedio],
            ].map(([etiqueta, valor]) => (
              <div key={etiqueta as string} className="rounded-lg bg-muted/40 p-3">
                <div className="text-lg font-semibold tabular-nums">
                  {valor === null ? '—' : (valor as number).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">{etiqueta as string}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Media de los ultimos 30 dias ({resumen.diasRegistrados} registrados).</p>
          {resumen.frecuentes.length > 0 && (
            <p className="mt-2 text-sm">
              Lo que mas se repite:{' '}
              {resumen.frecuentes.slice(0, 3).map((f) => `${f.emocion.emoji} ${f.emocion.nombre.toLowerCase()} (${f.veces})`).join(' · ')}
            </p>
          )}
        </Tarjeta>
      )}

      <Tarjeta>
        <TituloTarjeta>Como estas hoy</TituloTarjeta>
        <EstadoEmocional
          animo={hoyDia?.animo ?? null}
          energia={hoyDia?.energia ?? null}
          estres={hoyDia?.estres ?? null}
          emociones={emocionesHoy}
        />
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Diario de hoy</TituloTarjeta>
        <form action={guardarDiario} className="space-y-4">
          <input type="hidden" name="fecha" value={panel.hoy} />
          {PREGUNTAS.map((p) => (
            <div key={p.campo}>
              <label htmlFor={`diario-${p.campo}`} className="block text-sm font-medium">{p.titulo}</label>
              <p className="mb-1 text-xs text-muted-foreground">{p.ayuda}</p>
              <textarea
                id={`diario-${p.campo}`}
                name={p.campo}
                rows={p.campo === 'bien' || p.campo === 'preocupa' ? 3 : 2}
                defaultValue={entrada?.[p.campo] ?? ''}
                className="w-full rounded-lg border border-input bg-muted/40 p-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <Boton type="submit" className="w-full">{entrada ? 'Actualizar el diario' : 'Guardar el diario'}</Boton>
          <p className="text-xs text-muted-foreground">
            Ninguna pregunta es obligatoria. Lo que escribas en preocupaciones se guarda como hojas, abajo.
          </p>
        </form>
      </Tarjeta>

      <Tarjeta>
        <div className="mb-1 flex items-baseline justify-between">
          <TituloTarjeta className="mb-0">Hojas del estanque</TituloTarjeta>
          <span className="text-xs text-muted-foreground">{abiertas.length} en el agua</span>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Cada preocupacion es una hoja. No hay que quitarlas a la fuerza: se van con accion o con tiempo.
        </p>

        {abiertas.length ? (
          <ul className="mb-4 space-y-2">
            {abiertas.map((h) => (
              <li key={h.id} className="rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex items-start gap-2">
                  <span className="text-base">🍂</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">{h.texto}</p>
                    <p className="text-xs text-muted-foreground">
                      {infoTema(h.tema).emoji} {infoTema(h.tema).nombre} · desde el {fechaCorta(h.creada)}
                    </p>
                  </div>
                  <form action={borrarHoja.bind(null, h.id)}>
                    <button type="submit" aria-label="Borrar hoja" className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={15} />
                    </button>
                  </form>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-primary">¿Sigue en el estanque?</summary>
                  <form action={retirarHoja} className="mt-2 space-y-2">
                    <input type="hidden" name="id" value={h.id} />
                    <Campo etiqueta="Ya no esta. ¿Que ayudo a retirarla?" name="accion" placeholder="Hable con el cliente / se resolvio solo con el tiempo" />
                    <Boton type="submit" variante="secundario" tamano="sm">Retirar la hoja</Boton>
                  </form>
                </details>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-sm text-muted-foreground">El estanque esta limpio ahora mismo. 🌿</p>
        )}

        <details className="border-t border-border pt-3">
          <summary className="cursor-pointer text-sm text-muted-foreground">Anadir una preocupacion</summary>
          <form action={anadirHoja} className="mt-3 space-y-3">
            <Campo etiqueta="¿Que te ronda?" name="texto" placeholder="Caja baja este mes" required />
            <Selector etiqueta="Tema" name="tema" defaultValue="">
              <option value="">Que lo decida la app</option>
              {TEMAS.map((t) => (
                <option key={t.id} value={t.id}>{t.emoji} {t.nombre}</option>
              ))}
            </Selector>
            <Boton type="submit" variante="contorno" className="w-full">Poner la hoja en el estanque</Boton>
          </form>
        </details>

        {retiradas.length > 0 && (
          <details className="mt-3 border-t border-border pt-3">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Hojas que ya se fueron ({retiradas.length})
            </summary>
            <ul className="mt-2 space-y-2">
              {retiradas.map((h) => (
                <li key={h.id} className="flex items-start gap-2 text-sm">
                  <span>🌊</span>
                  <div className="flex-1">
                    <p className="line-through decoration-muted-foreground/40">{h.texto}</p>
                    <p className="text-xs text-muted-foreground">
                      {h.accion ? `Ayudo: ${h.accion}` : 'Se fue sola con el tiempo'} · {fechaCorta(h.cerrada!)}
                    </p>
                  </div>
                  <form action={devolverHoja.bind(null, h.id)}>
                    <button type="submit" className="text-xs text-muted-foreground underline">Ha vuelto</button>
                  </form>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              {retiradas.filter((h) => !h.accion).length > 0
                ? 'Fijate en cuantas se fueron sin que hicieras nada. Eso tambien es informacion.'
                : 'Todas se fueron porque hiciste algo. Esa es la prueba.'}
            </p>
          </details>
        )}
      </Tarjeta>

      {patrones.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Patrones que veo</TituloTarjeta>
          <ul className="space-y-1.5 text-sm">
            {patrones.slice(0, 4).map((p) => (
              <li
                key={p.id}
                className={p.tono === 'bien' ? 'text-emerald-700 dark:text-emerald-300' : p.tono === 'aviso' ? 'text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}
              >
                · {p.texto}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            Salen de cruzar tu animo con lo que haces cada dia. Cuantos mas dias registres, mas fino hila.
          </p>
        </Tarjeta>
      )}

      {perfilDias && (perfilDias.buenos.length > 0 || perfilDias.malos.length > 0) && (
        <Tarjeta className="border-primary/40">
          <TituloTarjeta>Tus mejores dias y tus peores</TituloTarjeta>
          {perfilDias.buenos.length > 0 && (
            <p className="text-sm">
              <strong>Tus mejores dias</strong> coinciden con {perfilDias.buenos.map((f) => f.etiqueta).join(', ')}.
            </p>
          )}
          {perfilDias.malos.length > 0 && (
            <p className="mt-2 text-sm">
              <strong>Los peores</strong> coinciden con lo contrario: {perfilDias.malos.map((f) => f.etiqueta).join(', ')} es lo que falta esos dias.
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Sobre {perfilDias.n} dias con animo registrado. No es una regla, es tu patron.
          </p>
        </Tarjeta>
      )}

      {evidencias.length > 0 && (
        <Tarjeta className="border-emerald-500/40">
          <TituloTarjeta>Evidencias de esta semana</TituloTarjeta>
          <p className="mb-2 text-xs text-muted-foreground">
            La cabeza recuerda los problemas. Esto es lo que ha pasado de verdad desde el lunes.
          </p>
          <ul className="space-y-1 text-sm">
            {evidencias.map((e) => (
              <li key={e}>✓ {e}</li>
            ))}
          </ul>
        </Tarjeta>
      )}

      <p className="pb-2 text-center text-xs text-muted-foreground">
        Tambien puedes contarselo al <Link href="/app/coach" className="text-primary underline">coach</Link> con tus
        palabras: el lo apunta y te dice que ve.
      </p>
    </main>
  );
}
