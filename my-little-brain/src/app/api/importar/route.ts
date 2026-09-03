import { NextResponse } from 'next/server';
import type Anthropic from '@anthropic-ai/sdk';
import { cargarPerfil } from '@/lib/datos';
import { MODELO_REVISION, clienteIA, hayClaveIA, parametrosModelo, textoDe } from '@/lib/ia/cliente';
import { anotarUso, cuota } from '@/lib/ia/limites';
import { PROMPT_IMPORTACION, parsearImportacion, planDesdeImportacion } from '@/lib/importar';
import { clienteServidor } from '@/lib/supabase/servidor';

export const runtime = 'nodejs';
export const maxDuration = 120;
export const dynamic = 'force-dynamic';

/** Vercel corta los cuerpos a 4,5 MB; en base64 eso son unos 3 MB de archivo. */
const MAX_BASE64 = 4_000_000;
const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const;
type TipoImagen = (typeof TIPOS_IMAGEN)[number];

interface Cuerpo {
  texto?: string;
  archivo?: { nombre?: string; media_type: string; data: string };
}

type Bloque = Anthropic.Beta.Messages.BetaContentBlockParam;

/**
 * Lee un plan de entreno o una dieta hecha por un profesional (PDF, foto o
 * texto) y devuelve una vista previa estructurada. No guarda nada: eso lo hace
 * la accion `aplicarImportacion` cuando el usuario confirma.
 */
export async function POST(peticion: Request) {
  const supabase = clienteServidor();
  const { data: sesion } = await supabase.auth.getUser();
  const usuario = sesion.user;
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  if (!hayClaveIA()) {
    return NextResponse.json({ error: 'Falta configurar ANTHROPIC_API_KEY.' }, { status: 503 });
  }

  const perfil = await cargarPerfil(supabase, usuario.id);
  if (!perfil) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });

  const estado = await cuota(supabase, usuario.id, perfil.plan);
  if (estado.agotada) {
    return NextResponse.json({ error: 'Has agotado los mensajes de tu plan este mes.' }, { status: 429 });
  }

  let cuerpo: Cuerpo;
  try {
    cuerpo = (await peticion.json()) as Cuerpo;
  } catch {
    return NextResponse.json({ error: 'Peticion no valida.' }, { status: 400 });
  }

  const bloques: Bloque[] = [];
  const archivo = cuerpo.archivo;
  if (archivo?.data) {
    if (archivo.data.length > MAX_BASE64) {
      return NextResponse.json({ error: 'El archivo pesa demasiado. Maximo 3 MB; prueba con una foto mas pequeña o pega el texto.' }, { status: 413 });
    }
    if (archivo.media_type === 'application/pdf') {
      bloques.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: archivo.data } });
    } else if ((TIPOS_IMAGEN as readonly string[]).includes(archivo.media_type)) {
      bloques.push({ type: 'image', source: { type: 'base64', media_type: archivo.media_type as TipoImagen, data: archivo.data } });
    } else {
      return NextResponse.json({ error: 'Formato no admitido. Vale un PDF, una foto (JPG/PNG/WebP) o texto.' }, { status: 415 });
    }
  }
  const texto = (cuerpo.texto ?? '').trim().slice(0, 30_000);
  if (texto) bloques.push({ type: 'text', text: `Documento:\n\n${texto}` });
  if (!bloques.length) {
    return NextResponse.json({ error: 'Sube un archivo o pega el texto del plan.' }, { status: 400 });
  }
  bloques.push({ type: 'text', text: 'Extrae el plan de entreno y/o la dieta de este documento en el JSON indicado.' });

  try {
    const respuesta = await clienteIA().beta.messages.create({
      model: MODELO_REVISION,
      max_tokens: 8192,
      ...parametrosModelo(MODELO_REVISION, 'medium'),
      system: [{ type: 'text', text: PROMPT_IMPORTACION, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: bloques }],
    });

    await anotarUso(supabase, usuario.id, {
      entrada: respuesta.usage.input_tokens ?? 0,
      salida: respuesta.usage.output_tokens ?? 0,
    });

    if (respuesta.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'No he podido leer este documento.' }, { status: 422 });
    }

    const datos = parsearImportacion(textoDe(respuesta));
    if (!datos) {
      return NextResponse.json(
        { error: 'No he encontrado ni un plan de entreno ni una dieta en el documento. Si es una foto, prueba con mas luz o pega el texto.' },
        { status: 422 },
      );
    }

    const entreno = datos.entreno ? planDesdeImportacion(datos.entreno) : null;
    return NextResponse.json({
      datos,
      plan: entreno?.plan ?? null,
      sinCatalogo: entreno?.sinCatalogo ?? [],
    });
  } catch (error) {
    console.error('[importar] error analizando el documento', error);
    return NextResponse.json({ error: 'No se ha podido analizar el documento. Reintenta en un momento.' }, { status: 502 });
  }
}
