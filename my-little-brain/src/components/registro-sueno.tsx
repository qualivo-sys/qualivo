'use client';

import { useState } from 'react';
import { guardarSueno } from '@/app/app/descanso/acciones';
import { Boton, Campo } from '@/components/ui/base';
import { horasDeSueno } from '@/lib/motor/descanso';

/**
 * Anoche. Pedimos las dos horas en vez de "cuantas horas has dormido" porque
 * acordarse de a que hora te acostaste es facil, y hacer la resta a las siete
 * de la manana no lo es. La cuenta la hacemos nosotros y se ve al momento.
 */
export default function RegistroSueno({
  inicio,
  fin,
  calidad,
  horasGuardadas,
}: {
  inicio: string | null;
  fin: string | null;
  calidad: number | null;
  horasGuardadas: number | null;
}) {
  const [desde, setDesde] = useState(inicio ?? '');
  const [hasta, setHasta] = useState(fin ?? '');

  const horas = horasDeSueno(desde || null, hasta || null);
  const aviso = desde && hasta && horas === null;

  return (
    <form action={guardarSueno} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Campo
          etiqueta="Me acoste a las" name="sueno_inicio" type="time"
          value={desde} onChange={(e) => setDesde(e.target.value)}
        />
        <Campo
          etiqueta="Me levante a las" name="sueno_fin" type="time"
          value={hasta} onChange={(e) => setHasta(e.target.value)}
        />
      </div>

      {horas !== null && (
        <p className="text-sm">
          Son <strong className="tabular-nums">{horas.toFixed(1).replace('.', ',')} h</strong> de sueno.
        </p>
      )}
      {aviso && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Con esas horas no me salen las cuentas. Revisa si te has confundido de am/pm.
        </p>
      )}
      {horas === null && !aviso && horasGuardadas !== null && (
        <p className="text-sm text-muted-foreground">
          Tienes {String(horasGuardadas).replace('.', ',')} h apuntadas hoy.
        </p>
      )}

      <Campo
        etiqueta="Como has dormido (1-10)" name="sueno_calidad" type="number" min={1} max={10}
        inputMode="numeric" defaultValue={calidad ?? ''}
      />
      {/* Salida de emergencia para quien no quiera dar las horas exactas. */}
      {!desde && !hasta && (
        <Campo
          etiqueta="O directamente, horas dormidas" name="sueno_horas" type="number" step="0.5"
          inputMode="decimal" defaultValue={horasGuardadas ?? ''}
        />
      )}
      <Boton type="submit" className="w-full">Guardar la noche</Boton>
    </form>
  );
}
