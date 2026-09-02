'use client';

import { Camera, Loader2, Send, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Boton } from '@/components/ui/base';
import type { AccionRegistrada, MensajeChat } from '@/lib/tipos';
import { cn } from '@/lib/utils';

interface Burbuja {
  id: string;
  rol: 'user' | 'assistant';
  texto: string;
  acciones: AccionRegistrada[];
}

const SUGERENCIAS = [
  'He desayunado dos huevos, pan integral y un cafe',
  'Hoy he entrenado pierna',
  'He dormido 6 horas y estoy reventado',
  '¿Como llevo la semana?',
];

export default function ChatCoach({
  historial,
  modoAlta = false,
  saludo,
}: {
  historial: MensajeChat[];
  modoAlta?: boolean;
  saludo?: string;
}) {
  const router = useRouter();
  const [mensajes, setMensajes] = useState<Burbuja[]>(
    historial.map((m) => ({ id: m.id, rol: m.rol, texto: m.texto, acciones: m.acciones ?? [] })),
  );
  const [borrador, setBorrador] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const finRef = useRef<HTMLDivElement>(null);
  const archivoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [mensajes, enviando]);

  const enviar = async (texto: string, imagen?: { media_type: string; data: string }) => {
    if ((!texto.trim() && !imagen) || enviando) return;
    setError('');
    setEnviando(true);
    setBorrador('');
    setMensajes((previos) => [
      ...previos,
      { id: `local-${Date.now()}`, rol: 'user', texto: texto || '📷 Foto de comida', acciones: [] },
    ]);

    try {
      const respuesta = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto, imagen }),
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setError(datos.error ?? 'El coach no ha podido responder.');
        return;
      }

      setMensajes((previos) => [
        ...previos,
        { id: `ia-${Date.now()}`, rol: 'assistant', texto: datos.texto, acciones: datos.acciones ?? [] },
      ]);
      router.refresh();
    } catch {
      setError('No hay conexion con el servidor. Reintenta.');
    } finally {
      setEnviando(false);
    }
  };

  const subirFoto = (archivo: File) => {
    const lector = new FileReader();
    lector.onload = () => {
      const resultado = String(lector.result);
      const data = resultado.split(',')[1];
      if (data) void enviar('', { media_type: archivo.type, data });
    };
    lector.readAsDataURL(archivo);
  };

  return (
    <div className="flex min-h-[60vh] flex-col">
      <div className="flex-1 space-y-3 pb-4">
        {saludo && !mensajes.length && (
          <div className="rounded-[var(--radius)] border border-primary/40 bg-primary/10 p-4 text-sm">
            <Sparkles size={16} className="mb-2 text-primary" />
            {saludo}
          </div>
        )}

        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={cn('flex', mensaje.rol === 'user' ? 'justify-end' : 'justify-start')}
          >
            <div
              className={cn(
                'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                mensaje.rol === 'user'
                  ? 'rounded-br-sm bg-primary text-primary-foreground'
                  : 'rounded-bl-sm bg-card border border-border',
              )}
            >
              {mensaje.texto}
              {mensaje.acciones.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border/60 pt-2">
                  {mensaje.acciones.map((accion, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                    >
                      {accion.resumen}
                      {accion.xp ? ` · +${accion.xp} XP` : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {enviando && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={15} className="animate-spin" /> Pensando…
          </div>
        )}
        {error && (
          <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>
        )}
        <div ref={finRef} />
      </div>

      {!mensajes.length && !modoAlta && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGERENCIAS.map((sugerencia) => (
            <button
              key={sugerencia}
              type="button"
              onClick={() => void enviar(sugerencia)}
              className="rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {sugerencia}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(evento) => {
          evento.preventDefault();
          void enviar(borrador);
        }}
        className="sticky bottom-24 flex items-end gap-2 rounded-2xl border border-border bg-card p-2"
      >
        {!modoAlta && (
          <>
            <input
              ref={archivoRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(evento) => {
                const archivo = evento.target.files?.[0];
                if (archivo) subirFoto(archivo);
                evento.target.value = '';
              }}
            />
            <Boton
              type="button"
              variante="fantasma"
              tamano="icono"
              aria-label="Foto de la comida"
              onClick={() => archivoRef.current?.click()}
              disabled={enviando}
            >
              <Camera size={20} />
            </Boton>
          </>
        )}
        <textarea
          value={borrador}
          onChange={(evento) => setBorrador(evento.target.value)}
          onKeyDown={(evento) => {
            if (evento.key === 'Enter' && !evento.shiftKey) {
              evento.preventDefault();
              void enviar(borrador);
            }
          }}
          rows={1}
          placeholder={modoAlta ? 'Responde aqui…' : 'Cuentame que has hecho…'}
          className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2.5 text-base outline-none placeholder:text-muted-foreground/60"
        />
        <Boton type="submit" tamano="icono" disabled={enviando || (!borrador.trim() && !enviando)}>
          <Send size={18} />
        </Boton>
      </form>
    </div>
  );
}
