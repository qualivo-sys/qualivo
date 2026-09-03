'use client';

import { Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Boton, Insignia, Tarjeta } from '@/components/ui/base';

export interface DatosPremio {
  diaId: string;
  nombre: string;
  ejercicios: number;
  series: number;
  volumen: number;
  kcalCardio: number;
  xp?: number;
  racha?: number;
  t: number;
}

export const CLAVE_PREMIO = 'mlb:premio';

export function leerPremio(): DatosPremio | null {
  try {
    const bruto = window.sessionStorage.getItem(CLAVE_PREMIO);
    if (!bruto) return null;
    const datos = JSON.parse(bruto) as DatosPremio;
    return Date.now() - datos.t < 10 * 60 * 1000 ? datos : null;
  } catch {
    return null;
  }
}

/**
 * Pantalla de premio al terminar un entreno. Vive fuera del registro porque,
 * al guardar, la pagina se vuelve a pintar como "hoy ya lo has hecho": el
 * registro deja el premio en sessionStorage y este componente lo ensena.
 */
export default function PremioEntreno({ diaId }: { diaId: string }) {
  const router = useRouter();
  const [premio, setPremio] = useState<DatosPremio | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const leer = () => {
      const datos = leerPremio();
      if (datos && datos.diaId === diaId) setPremio(datos);
    };
    leer();
    // El XP y la racha llegan cuando el servidor contesta: se relee unos segundos.
    const timer = window.setInterval(leer, 500);
    const fin = window.setTimeout(() => window.clearInterval(timer), 8000);
    return () => { window.clearInterval(timer); window.clearTimeout(fin); };
  }, [diaId]);

  if (!premio) return null;

  const cerrar = () => {
    try { window.sessionStorage.removeItem(CLAVE_PREMIO); } catch { /* nada */ }
    setPremio(null);
  };

  const compartir = async () => {
    const partes = [
      `💪 ${premio.nombre} hecho: ${premio.ejercicios} ejercicios, ${premio.series} series`,
      premio.volumen ? `${premio.volumen.toLocaleString('es-ES')} kg movidos` : null,
      premio.kcalCardio ? `cardio ~${premio.kcalCardio} kcal` : null,
      premio.racha ? `🔥 racha de ${premio.racha} ${premio.racha === 1 ? 'dia' : 'dias'}` : null,
    ].filter(Boolean);
    const texto = `${partes.join(' · ')}\nRegistrado con My Little Brain`;
    try {
      if (navigator.share) await navigator.share({ text: texto, url: window.location.origin });
      else { await navigator.clipboard.writeText(`${texto} ${window.location.origin}`); setCopiado(true); }
    } catch { /* cancelado */ }
  };

  return (
    <Tarjeta className="border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-transparent">
      <p className="text-3xl">🎉</p>
      <h3 className="mt-1 text-lg font-semibold">{premio.nombre} hecho</h3>
      <p className="text-sm text-muted-foreground">
        {premio.ejercicios} ejercicios · {premio.series} series
        {premio.volumen ? ` · ${premio.volumen.toLocaleString('es-ES')} kg movidos` : ''}
        {premio.kcalCardio ? ` · cardio ~${premio.kcalCardio} kcal` : ''}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Insignia tono="marca">+{premio.xp ?? 40} XP</Insignia>
        {premio.racha ? <Insignia tono="exito">🔥 {premio.racha} {premio.racha === 1 ? 'dia' : 'dias'} de racha</Insignia> : null}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Clava hoy las calorias y la proteina y te llevas +30 XP por dia redondo. Lo compruebo en el check-in de la noche.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Boton type="button" variante="secundario" onClick={compartir}>
          <Share2 size={16} /> {copiado ? 'Copiado, pegalo donde quieras' : 'Compartir'}
        </Boton>
        <Boton type="button" onClick={() => { cerrar(); router.push('/app'); router.refresh(); }}>Ir a Hoy</Boton>
      </div>
      <button type="button" onClick={cerrar} className="mt-2 text-xs text-muted-foreground underline">Cerrar</button>
    </Tarjeta>
  );
}
