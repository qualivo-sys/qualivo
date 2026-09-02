import Link from 'next/link';
import { borrarCuenta, cerrarSesion, guardarPerfil } from '@/app/app/acciones';
import PlanSuscripcion from '@/components/plan-suscripcion';
import { Boton, Campo, Insignia, Selector, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import { LIMITE_MENSAJES, cuota } from '@/lib/ia/limites';
import { hayPagos } from '@/lib/pago';
import { ETIQUETA_OBJETIVO } from '@/lib/perfil';
import { sesionRequerida } from '@/lib/sesion';
import type { Limitacion } from '@/lib/tipos';

export const dynamic = 'force-dynamic';

const LIMITACIONES: { valor: Limitacion; etiqueta: string }[] = [
  { valor: 'hombro', etiqueta: 'Hombro' },
  { valor: 'rodilla', etiqueta: 'Rodilla' },
  { valor: 'espalda_baja', etiqueta: 'Espalda baja' },
  { valor: 'muneca', etiqueta: 'Muñeca' },
  { valor: 'cadera', etiqueta: 'Cadera' },
];

export default async function PaginaAjustes({
  searchParams,
}: {
  searchParams: { pago?: string; clave?: string; borrar?: string };
}) {
  const { supabase, usuario, perfil } = await sesionRequerida({ permitirSinAlta: true });
  const estado = await cuota(supabase, usuario.id, perfil.plan);

  return (
    <main className="space-y-4">
      <h1>Ajustes</h1>

      {searchParams.pago === 'ok' && (
        <p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">
          Pago confirmado. Si el plan tarda unos segundos en actualizarse, recarga la pagina.
        </p>
      )}
      {searchParams.clave === 'ok' && (
        <p className="rounded-lg bg-emerald-500/15 px-3 py-2 text-sm text-emerald-300">
          Contraseña cambiada.
        </p>
      )}
      {searchParams.borrar && (
        <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">
          {searchParams.borrar === 'confirmacion'
            ? 'Para borrar la cuenta tienes que escribir BORRAR en el campo.'
            : searchParams.borrar === 'sin_servicio'
              ? 'El borrado automatico no esta configurado en este despliegue. Escribenos y lo hacemos a mano.'
              : 'No se ha podido borrar la cuenta. Reintenta o escribenos.'}
        </p>
      )}
      {searchParams.pago === 'cancelado' && (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          Has salido del pago sin completarlo. Sigues en tu plan actual.
        </p>
      )}

      <Tarjeta>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <TituloTarjeta className="mb-0">Tu plan</TituloTarjeta>
            <p className="text-sm text-muted-foreground">
              {estado.usados} de {estado.limite} mensajes usados este mes.
            </p>
          </div>
          <Insignia tono={perfil.plan === 'free' ? 'neutro' : 'marca'}>{perfil.plan}</Insignia>
        </div>
        {perfil.plan === 'free' && (
          <p className="mb-3 text-sm text-muted-foreground">
            Pro sube a {LIMITE_MENSAJES.pro} mensajes al mes, fotos de comida sin limite y
            revision semanal automatica cada domingo.
          </p>
        )}
        <PlanSuscripcion plan={perfil.plan} pagosActivos={hayPagos()} />
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Tus datos</TituloTarjeta>
        <form action={guardarPerfil} className="space-y-3">
          <Campo etiqueta="Nombre" name="nombre" defaultValue={perfil.nombre ?? ''} />
          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Sexo biologico" name="sexo" defaultValue={perfil.sexo ?? ''}>
              <option value="">Sin especificar</option>
              <option value="hombre">Hombre</option>
              <option value="mujer">Mujer</option>
            </Selector>
            <Campo etiqueta="Edad" name="edad" type="number" defaultValue={perfil.edad ?? ''} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Altura (cm)" name="altura_cm" type="number" defaultValue={perfil.altura_cm ?? ''} />
            <Campo etiqueta="Ocupacion" name="ocupacion" defaultValue={perfil.ocupacion ?? ''} />
          </div>

          <Selector etiqueta="Objetivo" name="objetivo" defaultValue={perfil.objetivo ?? ''}>
            <option value="">Sin definir</option>
            {Object.entries(ETIQUETA_OBJETIVO).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>{etiqueta}</option>
            ))}
          </Selector>

          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Experiencia" name="nivel" defaultValue={perfil.nivel ?? ''}>
              <option value="">Sin definir</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </Selector>
            <Campo
              etiqueta="Dias/semana" name="dias_semana" type="number" min={1} max={7}
              defaultValue={perfil.dias_semana ?? ''}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Selector etiqueta="Donde entrenas" name="entorno" defaultValue={perfil.entorno ?? ''}>
              <option value="">Sin definir</option>
              <option value="gimnasio">Gimnasio</option>
              <option value="casa_mancuernas">Casa con mancuernas</option>
              <option value="casa_sin_material">Casa sin material</option>
            </Selector>
            <Selector etiqueta="Actividad diaria" name="actividad" defaultValue={perfil.actividad ?? ''}>
              <option value="">Sin definir</option>
              <option value="sedentario">Sedentaria</option>
              <option value="ligera">Ligera</option>
              <option value="moderada">Moderada</option>
              <option value="alta">Alta</option>
            </Selector>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm text-muted-foreground">Molestias o lesiones</legend>
            <div className="flex flex-wrap gap-3">
              {LIMITACIONES.map((limitacion) => (
                <label key={limitacion.valor} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="limitaciones"
                    value={limitacion.valor}
                    defaultChecked={perfil.limitaciones.includes(limitacion.valor)}
                    className="h-4 w-4 rounded border-border bg-muted"
                  />
                  {limitacion.etiqueta}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Hora de dormir" name="hora_dormir" type="time" defaultValue={perfil.hora_dormir ?? ''} />
            <Campo etiqueta="Hora de despertar" name="hora_despertar" type="time" defaultValue={perfil.hora_despertar ?? ''} />
          </div>

          <Campo
            etiqueta="Preferencias y alergias" name="preferencias_comida"
            defaultValue={perfil.preferencias_comida ?? ''}
            placeholder="Vegetariano, sin lactosa, no me gusta el pescado…"
          />

          <Boton type="submit" className="w-full">Guardar cambios</Boton>
          <p className="text-xs text-muted-foreground">
            Si cambias objetivo, nivel, dias, material o lesiones, acuerdate de regenerar el plan
            en <Link href="/app/entreno" className="text-primary underline">Entreno</Link>.
          </p>
        </form>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Sesion y seguridad</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">{perfil.email}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link href="/app/ajustes/clave">
            <Boton variante="contorno" className="w-full">Cambiar contraseña</Boton>
          </Link>
          <form action={cerrarSesion}>
            <Boton type="submit" variante="contorno" className="w-full">Cerrar sesion</Boton>
          </form>
        </div>
      </Tarjeta>

      <Tarjeta>
        <TituloTarjeta>Tus datos</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">
          Todo lo que has registrado es tuyo. Puedes llevartelo en un JSON cuando quieras.
        </p>
        <a href="/api/exportar" download>
          <Boton variante="secundario" className="w-full">Descargar todos mis datos</Boton>
        </a>
      </Tarjeta>

      <Tarjeta className="border-destructive/40">
        <TituloTarjeta>Borrar la cuenta</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">
          Se borra todo al instante y sin vuelta atras: perfil, registros, conversaciones y fotos.
          Si tienes una suscripcion, cancelala antes desde el portal de facturacion.
        </p>
        <form action={borrarCuenta} className="space-y-3">
          <Campo etiqueta='Escribe BORRAR para confirmar' name="confirmacion" autoComplete="off" />
          <Boton type="submit" variante="peligro" className="w-full">Borrar mi cuenta para siempre</Boton>
        </form>
      </Tarjeta>

      <p className="pb-4 text-center text-xs text-muted-foreground">
        Las calorias, los macros y la grasa corporal son estimaciones con formulas estandar
        (Mifflin-St Jeor y US Navy). No sustituyen el criterio de un medico o un dietista.
      </p>
    </main>
  );
}
