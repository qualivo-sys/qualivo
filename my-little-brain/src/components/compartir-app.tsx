'use client';

import { Check, Copy, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Boton } from '@/components/ui/base';

const URL_APP = 'https://my-little-brain.vercel.app/instalar';
const TEXTO = 'Estoy usando My Little Brain: un coach de entreno, comida y habitos con IA. Te lo instalas en 1 minuto desde aqui:';

/** Boton de invitar: abre la hoja de compartir del movil o copia el enlace. */
export default function CompartirApp({ variante = 'primario' as 'primario' | 'secundario' | 'contorno' }) {
  const [copiado, setCopiado] = useState(false);
  const [nativo, setNativo] = useState(false);
  useEffect(() => {
    setNativo(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);
  const compartir = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Little Brain', text: TEXTO, url: URL_APP });
      } else {
        await navigator.clipboard.writeText(`${TEXTO} ${URL_APP}`);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      }
    } catch {
      // cancelado
    }
  };
  return (
    <Boton type="button" variante={variante} onClick={compartir} className="w-full">
      {copiado ? <Check size={16} /> : nativo ? <Share2 size={16} /> : <Copy size={16} />}
      {copiado ? 'Enlace copiado' : 'Invitar a un amigo'}
    </Boton>
  );
}
