'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Tema = 'claro' | 'oscuro' | 'sistema';

function aplicar(tema: Tema) {
  const oscuro = tema === 'oscuro' || (tema === 'sistema' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', oscuro);
}

function leer(): Tema {
  try {
    const t = window.localStorage.getItem('mlb:tema');
    return t === 'oscuro' || t === 'sistema' ? t : 'claro';
  } catch {
    return 'claro';
  }
}

/** Boton compacto para la cabecera: alterna claro/oscuro. */
export function BotonTema() {
  const [tema, setTema] = useState<Tema>('claro');
  useEffect(() => setTema(leer()), []);

  const alternar = () => {
    const siguiente: Tema = document.documentElement.classList.contains('dark') ? 'claro' : 'oscuro';
    try {
      window.localStorage.setItem('mlb:tema', siguiente);
    } catch {
      // nada
    }
    aplicar(siguiente);
    setTema(siguiente);
  };

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={tema === 'oscuro' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      className="text-muted-foreground hover:text-foreground"
    >
      {tema === 'oscuro' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

/** Selector completo para Ajustes: claro, oscuro o el del sistema. */
export function SelectorTema() {
  const [tema, setTema] = useState<Tema>('claro');
  useEffect(() => setTema(leer()), []);

  const elegir = (t: Tema) => {
    try {
      window.localStorage.setItem('mlb:tema', t);
    } catch {
      // nada
    }
    aplicar(t);
    setTema(t);
  };

  const opciones: { valor: Tema; etiqueta: string; Icono: typeof Sun }[] = [
    { valor: 'claro', etiqueta: 'Claro', Icono: Sun },
    { valor: 'oscuro', etiqueta: 'Oscuro', Icono: Moon },
    { valor: 'sistema', etiqueta: 'Como el sistema', Icono: Monitor },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {opciones.map(({ valor, etiqueta, Icono }) => (
        <button
          key={valor}
          type="button"
          onClick={() => elegir(valor)}
          aria-pressed={tema === valor}
          className={cn(
            'flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-xs transition-colors',
            tema === valor ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground',
          )}
        >
          <Icono size={18} />
          {etiqueta}
        </button>
      ))}
    </div>
  );
}
