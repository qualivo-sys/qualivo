'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { FileText, Image as ImagenIcono, Upload } from 'lucide-react';
import { aplicarImportacion } from '@/app/app/acciones';
import { Boton, Insignia, Tarjeta, TituloTarjeta } from '@/components/ui/base';
import type { Importacion } from '@/lib/importar';
import { EJERCICIOS } from '@/lib/motor/ejercicios';
import type { PlanEntreno } from '@/lib/motor/tipos-motor';

interface Analisis {
  datos: Importacion;
  plan: PlanEntreno | null;
  sinCatalogo: string[];
}

const MAX_BYTES = 3 * 1024 * 1024;

/** Reduce una foto a 1600 px y JPEG para que quepa en la peticion y se lea igual. */
async function comprimirImagen(archivo: File): Promise<{ media_type: string; data: string }> {
  const url = URL.createObjectURL(archivo);
  try {
    const imagen = await new Promise<HTMLImageElement>((resolver, rechazar) => {
      const img = new Image();
      img.onload = () => resolver(img);
      img.onerror = () => rechazar(new Error('No se ha podido leer la imagen.'));
      img.src = url;
    });
    const escala = Math.min(1, 1600 / Math.max(imagen.width, imagen.height));
    const lienzo = document.createElement('canvas');
    lienzo.width = Math.round(imagen.width * escala);
    lienzo.height = Math.round(imagen.height * escala);
    lienzo.getContext('2d')?.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
    const dataUrl = lienzo.toDataURL('image/jpeg', 0.85);
    return { media_type: 'image/jpeg', data: dataUrl.split(',')[1] };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function aBase64(archivo: File): Promise<string> {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver((lector.result as string).split(',')[1]);
    lector.onerror = () => rechazar(new Error('No se ha podido leer el archivo.'));
    lector.readAsDataURL(archivo);
  });
}

export default function ImportarPlan() {
  const router = useRouter();
  const entradaArchivo = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [texto, setTexto] = useState('');
  const [analizando, setAnalizando] = useState(false);
  const [aplicando, setAplicando] = useState(false);
  const [error, setError] = useState('');
  const [analisis, setAnalisis] = useState<Analisis | null>(null);
  const [usarEntreno, setUsarEntreno] = useState(true);
  const [usarDieta, setUsarDieta] = useState(true);

  const elegirArchivo = (f: File | null) => {
    setError('');
    if (f && f.size > MAX_BYTES && f.type === 'application/pdf') {
      setError('El PDF pesa mas de 3 MB. Haz una foto de las paginas o pega el texto.');
      return;
    }
    setArchivo(f);
  };

  const analizar = async () => {
    if (!archivo && !texto.trim()) {
      setError('Sube un archivo o pega el texto del plan.');
      return;
    }
    setAnalizando(true);
    setError('');
    setAnalisis(null);
    try {
      let adjunto: { nombre: string; media_type: string; data: string } | undefined;
      if (archivo) {
        const contenido = archivo.type.startsWith('image/')
          ? await comprimirImagen(archivo)
          : { media_type: archivo.type || 'application/pdf', data: await aBase64(archivo) };
        adjunto = { nombre: archivo.name, ...contenido };
      }
      const respuesta = await fetch('/api/importar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: texto.trim() || undefined, archivo: adjunto }),
      });
      const cuerpo = (await respuesta.json()) as Analisis & { error?: string };
      if (!respuesta.ok || cuerpo.error) throw new Error(cuerpo.error ?? 'No se ha podido analizar el documento.');
      setAnalisis(cuerpo);
      setUsarEntreno(Boolean(cuerpo.datos.entreno));
      setUsarDieta(Boolean(cuerpo.datos.dieta));
    } catch (fallo) {
      setError((fallo as Error).message);
    } finally {
      setAnalizando(false);
    }
  };

  const aplicar = async () => {
    if (!analisis) return;
    setAplicando(true);
    setError('');
    try {
      const resultado = await aplicarImportacion(analisis.datos, { entreno: usarEntreno, dieta: usarDieta });
      if (!resultado.ok) throw new Error(resultado.error);
      router.push(usarEntreno ? '/app/entreno?importado=1' : '/app/cuerpo?importado=1');
      router.refresh();
    } catch (fallo) {
      setError((fallo as Error).message);
      setAplicando(false);
    }
  };

  const dieta = analisis?.datos.dieta ?? null;
  const plan = analisis?.plan ?? null;

  return (
    <div className="space-y-4">
      <Tarjeta>
        <TituloTarjeta>1 · Sube el plan</TituloTarjeta>
        <p className="mb-3 text-sm text-muted-foreground">
          Vale un PDF, una foto del papel o el texto pegado. Puede ser solo el entreno, solo la dieta o las dos cosas.
        </p>
        <input
          ref={entradaArchivo}
          type="file"
          accept="application/pdf,image/*"
          className="hidden"
          onChange={(e) => elegirArchivo(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => entradaArchivo.current?.click()}
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-left hover:bg-muted/60"
        >
          {archivo ? (
            archivo.type === 'application/pdf' ? <FileText className="h-6 w-6 shrink-0 text-primary" /> : <ImagenIcono className="h-6 w-6 shrink-0 text-primary" />
          ) : (
            <Upload className="h-6 w-6 shrink-0 text-muted-foreground" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{archivo ? archivo.name : 'Elegir PDF o foto'}</span>
            <span className="block text-xs text-muted-foreground">
              {archivo ? `${(archivo.size / 1024).toFixed(0)} KB · toca para cambiar` : 'PDF hasta 3 MB; las fotos se reducen solas'}
            </span>
          </span>
        </button>
        {archivo && (
          <button type="button" onClick={() => elegirArchivo(null)} className="mt-2 text-xs text-muted-foreground underline">
            Quitar archivo
          </button>
        )}

        <label htmlFor="texto-plan" className="mt-4 block text-sm text-muted-foreground">
          O pega el texto (opcional, tambien sirve como aclaracion al archivo)
        </label>
        <textarea
          id="texto-plan"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={6}
          placeholder={'Dia 1 - Pierna\nSentadilla 4x8-10 RIR 2\nPrensa 3x12\n...\n\nDieta: 2100 kcal, 160 g proteina...'}
          className="mt-1.5 w-full rounded-lg border border-input bg-muted/40 p-3 text-sm outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
        />

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <Boton type="button" onClick={analizar} disabled={analizando} className="mt-4 w-full">
          {analizando ? 'Leyendo el plan…' : 'Analizar'}
        </Boton>
        <p className="mt-2 text-xs text-muted-foreground">Cuenta como un mensaje al coach. No se guarda nada hasta que confirmes.</p>
      </Tarjeta>

      {analisis && (
        <Tarjeta>
          <TituloTarjeta>2 · Revisa lo que he entendido</TituloTarjeta>

          {plan && (
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={usarEntreno} onChange={(e) => setUsarEntreno(e.target.checked)} className="h-4 w-4" />
                Plan de entreno · {plan.dias.length} dias{analisis.datos.entreno?.origen ? ` · ${analisis.datos.entreno.origen}` : ''}
              </label>
              <div className="mt-2 space-y-2">
                {plan.dias.map((dia) => (
                  <div key={dia.id} className="rounded-lg bg-muted/40 p-3">
                    <div className="text-sm font-medium">{dia.nombre}</div>
                    <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      {dia.bloques.map((b, i) => (
                        <li key={i}>
                          {b.nombreLibre ?? nombreCatalogo(b.ejercicioId)} · {b.series}×{b.repMin === b.repMax ? b.repMin : `${b.repMin}-${b.repMax}`} · RIR {b.rir}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {analisis.sinCatalogo.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Estos ejercicios no estan en mi catalogo y se guardan con su nombre tal cual (sin foto de tecnica):{' '}
                  {analisis.sinCatalogo.join(', ')}.
                </p>
              )}
            </div>
          )}

          {dieta && (
            <div className="mb-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={usarDieta} onChange={(e) => setUsarDieta(e.target.checked)} className="h-4 w-4" />
                Dieta{dieta.origen ? ` · ${dieta.origen}` : ''}
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {dieta.kcal ? <Insignia tono="marca">{Math.round(dieta.kcal)} kcal</Insignia> : <Insignia tono="aviso">Sin calorias: solo pautas</Insignia>}
                {dieta.proteina_g ? <Insignia>{Math.round(dieta.proteina_g)} g proteina</Insignia> : null}
                {dieta.carbos_g ? <Insignia>{Math.round(dieta.carbos_g)} g carbos</Insignia> : null}
                {dieta.grasa_g ? <Insignia>{Math.round(dieta.grasa_g)} g grasa</Insignia> : null}
              </div>
              {dieta.resumen && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{dieta.resumen}</p>}
              {dieta.normas?.length ? (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {dieta.normas.map((n) => <li key={n}>· {n}</li>)}
                </ul>
              ) : null}
              <p className="mt-2 text-xs text-muted-foreground">
                {dieta.kcal
                  ? 'Las calorias y macros pasan a ser tu objetivo diario en lugar de los que calcula la app. El coach tendra las pautas presentes.'
                  : 'El coach tendra las pautas presentes; el objetivo de calorias sigue siendo el que calcula la app.'}
              </p>
            </div>
          )}

          <Boton type="button" onClick={aplicar} disabled={aplicando || (!usarEntreno && !usarDieta)} className="w-full">
            {aplicando ? 'Guardando…' : 'Aplicar a mi plan'}
          </Boton>
          {plan && usarEntreno && (
            <p className="mt-2 text-xs text-muted-foreground">
              El plan actual se archiva y este pasa a ser el activo. La progresion de cargas la sigue llevando la app.
            </p>
          )}
        </Tarjeta>
      )}
    </div>
  );
}

function nombreCatalogo(id: string): string {
  return EJERCICIOS.find((e) => e.id === id)?.nombre ?? id;
}
