import { ChevronLeft, ChevronRight } from 'lucide-react';
import CalculadoraComida from '@/components/calculadora-comida';
import ComidasHabituales from '@/components/comidas-habituales';
import ListaComidas from '@/components/lista-comidas';
import SugerenciasComida from '@/components/sugerencias-comida';
import { Barra, Boton, Campo, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import Grafica from '@/components/ui/grafica';
import Link from 'next/link';
import { guardarComida, guardarMedicion, quitarObjetivosManual } from '@/app/app/acciones';
import { cargarPanel } from '@/lib/datos';
import { fechaLarga, horaActual, inicioSemana, sumarDias } from '@/lib/fechas';
import { balanceDia, momentosPendientes, sugerirComidas } from '@/lib/motor/dieta';
import { comidasHabituales } from '@/lib/motor/habituales';
import { grasaCorporal } from '@/lib/motor/cuerpo';
import { sesionRequerida } from '@/lib/sesion';

export const dynamic = 'force-dynamic';

export default async function PaginaCuerpo({ searchParams }: { searchParams: { dia?: string } }) {
  const { supabase, usuario, perfil } = await sesionRequerida();
  const panel = await cargarPanel(supabase, usuario.id, perfil);
  const { cuerpo, metas } = panel;

  // Se puede mirar y apuntar en dias pasados (hasta 30 dias atras), no solo hoy.
  const minimo = sumarDias(panel.hoy, -30);
  const pedido = searchParams?.dia ?? '';
  const dia = /^\d{4}-\d{2}-\d{2}$/.test(pedido) && pedido <= panel.hoy && pedido >= minimo ? pedido : panel.hoy;
  const esHoy = dia === panel.hoy;
  const comidasDia = panel.comidas.filter((c) => c.fecha === dia);
  const diaResumen = panel.dias.find((d) => d.fecha === dia);

  const kcalHoy = comidasDia.reduce((total, c) => total + (c.kcal ?? 0), 0);
  const proteinaHoy = comidasDia.reduce((total, c) => total + (c.proteina_g ?? 0), 0);

  // Balance de macros, lectura de nutricionista y que comer en lo que falta.
  // En un dia pasado se lee como dia cerrado (hora 23), no como uno a medias.
  const hora = esHoy ? horaActual(perfil.zona_horaria || undefined) : 23;
  const balance = metas ? balanceDia(comidasDia, metas, hora, { entrenoHoy: diaResumen?.entreno ?? false }) : null;
  const pendientes = esHoy ? momentosPendientes(comidasDia, hora) : [];
  const semilla = Number(panel.hoy.replace(/-/g, '')) % 7;
  const sugerencias = balance
    ? sugerirComidas(balance.restante, pendientes, { alergias: perfil.alergias ?? [], preferencias: perfil.preferencias_comida, semilla })
    : [];
  // Lo que suele comer, para apuntarlo de un toque.
  const habituales = comidasHabituales(panel.comidas, { hoy: dia, hora });

  const macrosBarra = balance
    ? [
        { etiqueta: 'Calorias', valor: balance.consumido.kcal, meta: balance.objetivo.kcal, unidad: 'kcal', pct: balance.pct.kcal, color: 'hsl(var(--area-cuerpo))' },
        { etiqueta: 'Proteina', valor: balance.consumido.proteina, meta: balance.objetivo.proteina, unidad: 'g', pct: balance.pct.proteina, color: 'hsl(var(--area-foco))' },
        { etiqueta: 'Carbos', valor: balance.consumido.carbos, meta: balance.objetivo.carbos, unidad: 'g', pct: balance.pct.carbos, color: 'hsl(var(--area-habitos))' },
        { etiqueta: 'Grasa', valor: balance.consumido.grasa, meta: balance.objetivo.grasa, unidad: 'g', pct: balance.pct.grasa, color: 'hsl(var(--area-mente))' },
      ]
    : [];
  const tonoLectura = { bien: 'text-emerald-700 dark:text-emerald-300', aviso: 'text-amber-700 dark:text-amber-300', alerta: 'text-destructive', info: 'text-muted-foreground' };

  // La semana: medias de los dias con registro frente al objetivo.
  const lunes = inicioSemana(panel.hoy);
  const diasSemana = panel.dias.filter((d) => d.fecha >= lunes && d.fecha <= panel.hoy && d.comidas > 0);
  const media = (f: (d: (typeof diasSemana)[number]) => number) =>
    diasSemana.length ? Math.round(diasSemana.reduce((t, d) => t + f(d), 0) / diasSemana.length) : null;
  const semana = {
    dias: diasSemana.length,
    kcal: media((d) => d.kcal),
    proteina: media((d) => d.proteina),
    carbos: media((d) => d.carbos),
    grasa: media((d) => d.grasa),
    kcalOk: metas ? diasSemana.filter((d) => Math.abs(d.kcal - metas.kcal) <= metas.kcal * 0.12).length : 0,
    proteinaOk: metas ? diasSemana.filter((d) => d.proteina >= metas.proteinaG * 0.85).length : 0,
  };

  const seriePeso = panel.metricas
    .filter((m) => m.peso_kg)
    .map((m) => ({ fecha: m.fecha, valor: m.peso_kg as number }));
  const serieCintura = panel.metricas
    .filter((m) => m.cintura_cm)
    .map((m) => ({ fecha: m.fecha, valor: m.cintura_cm as number }));
  const serieGrasa = perfil.sexo && perfil.altura_cm
    ? panel.metricas
        .map((m) => ({ fecha: m.fecha, valor: grasaCorporal(perfil.sexo!, perfil.altura_cm!, m) }))
        .filter((p): p is { fecha: string; valor: number } => p.valor !== null)
    : [];

  return (
    <main className="space-y-4">
      <h1>Cuerpo</h1>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { etiqueta: 'Peso', valor: cuerpo.peso ? `${cuerpo.peso.toFixed(1)} kg` : '—' },
          {
            etiqueta: 'Tendencia',
            valor: cuerpo.tendencia === null ? '—' : `${cuerpo.tendencia > 0 ? '+' : ''}${cuerpo.tendencia.toFixed(2)} kg/sem`,
          },
          { etiqueta: 'Grasa est.', valor: cuerpo.grasaPct ? `${cuerpo.grasaPct.toFixed(1)} %` : '—' },
          { etiqueta: 'Cintura', valor: cuerpo.cintura ? `${cuerpo.cintura} cm` : '—' },
        ].map((dato) => (
          <Tarjeta key={dato.etiqueta} className="p-3">
            <div className="text-xs text-muted-foreground">{dato.etiqueta}</div>
            <div className="mt-0.5 text-lg font-semibold tabular-nums">{dato.valor}</div>
          </Tarjeta>
        ))}
      </div>

      {balance && (
        <Tarjeta>
          <TituloTarjeta>{esHoy ? 'Macros de hoy' : `Macros del ${fechaLarga(dia)}`}</TituloTarjeta>
          <div className="space-y-3">
            {macrosBarra.map((m) => (
              <div key={m.etiqueta}>
                <div className="mb-1 flex items-baseline justify-between text-sm">
                  <span className="text-muted-foreground">{m.etiqueta}</span>
                  <span className="tabular-nums">
                    <strong>{m.valor}</strong> / {m.meta} {m.unidad}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {m.meta - m.valor >= 0 ? `faltan ${m.meta - m.valor}` : `${m.valor - m.meta} de mas`}
                    </span>
                  </span>
                </div>
                <Barra valor={Math.min(100, m.pct)} color={m.pct > 110 ? 'hsl(var(--destructive))' : m.color} />
              </div>
            ))}
          </div>
          {balance.lecturas.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-border pt-3 text-sm">
              {balance.lecturas.map((l) => (
                <li key={l.texto} className={tonoLectura[l.tono]}>· {l.texto}</li>
              ))}
            </ul>
          )}
          {esHoy && panel.diaHoy.gastoKcal > 0 && (
            <p className="mt-3 text-xs text-muted-foreground tabular-nums">
              Hoy llevas gastadas ~{panel.diaHoy.gastoKcal.toLocaleString('es-ES')} kcal (basal, pasos y entrenos); balance{' '}
              {panel.diaHoy.kcal - panel.diaHoy.gastoKcal > 0 ? '+' : ''}{(panel.diaHoy.kcal - panel.diaHoy.gastoKcal).toLocaleString('es-ES')} kcal.{' '}
              El detalle esta en <Link href="/app" className="underline">Hoy</Link>.
            </p>
          )}
          {semana.dias > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Esta semana ({semana.dias} {semana.dias === 1 ? 'dia' : 'dias'} con registro): media de {semana.kcal} kcal,{' '}
              {semana.proteina} g proteina, {semana.carbos} g carbos y {semana.grasa} g grasa. Calorias en rango{' '}
              {semana.kcalOk} de {semana.dias}, proteina cubierta {semana.proteinaOk} de {semana.dias}.
            </p>
          )}
        </Tarjeta>
      )}

      {sugerencias.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Que comer en lo que queda de dia</TituloTarjeta>
          <p className="mb-3 text-sm text-muted-foreground">
            Cantidades calculadas para cuadrar los {Math.max(0, Math.round(balance!.restante.kcal))} kcal y{' '}
            {Math.max(0, Math.round(balance!.restante.proteina))} g de proteina que te faltan, repartidos entre{' '}
            {sugerencias.map((g) => g.etiqueta.toLowerCase()).join(' y ')}.
            {perfil.alergias?.length ? ' Sin lo que tienes marcado como alergia.' : ''}
          </p>
          <SugerenciasComida grupos={sugerencias} />
          <p className="mt-3 text-xs text-muted-foreground">
            ¿Quieres otra cosa? Pidele al <Link href="/app/coach" className="underline">coach</Link> una alternativa con lo que tengas en casa.
          </p>
        </Tarjeta>
      )}

      <Tarjeta>
        <div className="mb-3 flex items-center justify-between gap-2">
          <TituloTarjeta className="mb-0">{esHoy ? 'Comidas de hoy' : `Comidas del ${fechaLarga(dia)}`}</TituloTarjeta>
          <div className="flex items-center gap-1">
            {dia > minimo && (
              <Link
                href={`/app/cuerpo?dia=${sumarDias(dia, -1)}`}
                aria-label="Dia anterior"
                className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft size={16} />
              </Link>
            )}
            {!esHoy && (
              <>
                <Link
                  href={`/app/cuerpo?dia=${sumarDias(dia, 1)}`}
                  aria-label="Dia siguiente"
                  className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
                >
                  <ChevronRight size={16} />
                </Link>
                <Link href="/app/cuerpo" className="ml-1 text-xs text-primary underline">Hoy</Link>
              </>
            )}
          </div>
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          {kcalHoy} kcal y {proteinaHoy} g de proteina
          {metas ? ` de ${metas.kcal} kcal y ${metas.proteinaG} g` : ''}.
        </p>
        <p className="mb-3 text-xs text-muted-foreground">
          {metas?.manual ? (
            <>
              Objetivo fijado por tu {metas.manual}.{' '}
              <form action={quitarObjetivosManual} className="inline">
                <button type="submit" className="underline">Volver al que calcula la app</button>
              </form>
            </>
          ) : (
            <>
              Objetivo calculado por la app.{' '}
              <Link href="/app/importar" className="underline">¿Tienes dieta de un nutricionista? Importala</Link>.
            </>
          )}
        </p>

        <ComidasHabituales habituales={habituales} fecha={dia} />

        <ListaComidas comidas={comidasDia} />

        <div className="border-t border-border pt-4">
          <p className="mb-3 text-sm font-medium">Calcular con la tabla de alimentos</p>
          <CalculadoraComida fecha={dia} />
        </div>

        <details className="mt-4 border-t border-border pt-4">
          <summary className="cursor-pointer text-sm text-muted-foreground">O apuntar las calorias a mano</summary>
        <form action={guardarComida} className="mt-3 space-y-3">
          <input type="hidden" name="fecha" value={dia} />
          <Campo etiqueta="Que has comido" name="descripcion" required placeholder="Pollo con arroz y ensalada" />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Kcal" name="kcal" type="number" inputMode="numeric" required />
            <Campo etiqueta="Proteina (g)" name="proteina_g" type="number" inputMode="numeric" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Momento" name="momento" defaultValue="comida">
              {['desayuno', 'comida', 'cena', 'snack', 'bebida'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Selector>
            <Campo etiqueta="Alcohol (ud)" name="alcohol_ud" type="number" inputMode="decimal" step="0.5" />
          </div>
          <Boton type="submit" variante="secundario" className="w-full">Anadir comida</Boton>
        </form>
        </details>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Nueva medicion</TituloTarjeta>
        <form action={guardarMedicion} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Peso (kg)" name="peso_kg" type="number" step="0.1" inputMode="decimal" />
            <Campo etiqueta="Cintura (cm)" name="cintura_cm" type="number" step="0.5" inputMode="decimal" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Cuello (cm)" name="cuello_cm" type="number" step="0.5" inputMode="decimal" />
            <Campo
              etiqueta={perfil.sexo === 'mujer' ? 'Cadera (cm)' : 'Pecho (cm)'}
              name={perfil.sexo === 'mujer' ? 'cadera_cm' : 'pecho_cm'}
              type="number" step="0.5" inputMode="decimal"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Con cuello y cintura{perfil.sexo === 'mujer' ? ' y cadera' : ''} calculo la grasa
            corporal estimada (formula US Navy).
          </p>
          <Boton type="submit" className="w-full">Guardar medicion</Boton>
        </form>
      </Tarjeta>

      {seriePeso.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Peso</TituloTarjeta>
          <Grafica datos={seriePeso} unidad=" kg" color="hsl(var(--area-cuerpo))" />
        </Tarjeta>
      )}
      {serieCintura.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Cintura</TituloTarjeta>
          <Grafica datos={serieCintura} unidad=" cm" color="hsl(var(--area-foco))" />
        </Tarjeta>
      )}
      {serieGrasa.length >= 2 && (
        <Tarjeta>
          <TituloTarjeta>Grasa corporal estimada</TituloTarjeta>
          <Grafica datos={serieGrasa} unidad=" %" color="hsl(var(--area-mente))" />
        </Tarjeta>
      )}

      {panel.metricas.length > 0 && (
        <Tarjeta>
          <TituloTarjeta>Historial</TituloTarjeta>
          <ul className="divide-y divide-border text-sm">
            {panel.metricas.slice(0, 12).map((m) => (
              <li key={m.id} className="flex justify-between py-2">
                <span className="text-muted-foreground">{fechaLarga(m.fecha)}</span>
                <span className="tabular-nums">
                  {m.peso_kg ? `${m.peso_kg} kg` : '—'}
                  {m.cintura_cm ? ` · ${m.cintura_cm} cm` : ''}
                </span>
              </li>
            ))}
          </ul>
        </Tarjeta>
      )}
    </main>
  );
}
