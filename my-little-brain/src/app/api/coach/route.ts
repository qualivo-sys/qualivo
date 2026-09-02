import type Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { cargarPanel, cargarPerfil } from '@/lib/datos';
import { BETA_FALLBACK, MODELO, clienteIA, hayClaveIA } from '@/lib/ia/cliente';
import { construirContexto } from '@/lib/ia/contexto';
import { HERRAMIENTAS, ejecutarHerramienta } from '@/lib/ia/herramientas';
import { anotarUso, cuota } from '@/lib/ia/limites';
import { PROMPT_COACH, PROMPT_ONBOARDING } from '@/lib/ia/prompt';
import { clienteServidor } from '@/lib/supabase/servidor';
import type { AccionRegistrada } from '@/lib/tipos';

export const runtime = 'nodejs';
export const maxDuration = 120;
export const dynamic = 'force-dynamic';

const MAX_VUELTAS = 6;
const MENSAJES_HISTORIAL = 16;

/**
 * Chat del coach. Responde en streaming (SSE) porque en un chat la espera en
 * blanco se nota mas que el total: eventos `texto`, `accion`, `fin` y `error`.
 */
export async function POST(peticion: Request) {
  const supabase = clienteServidor();
  const { data: sesion } = await supabase.auth.getUser();
  const usuario = sesion.user;
  if (!usuario) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  if (!hayClaveIA()) {
    return NextResponse.json(
      { error: 'Falta configurar ANTHROPIC_API_KEY en el servidor. El resto de la app funciona igual.' },
      { status: 503 },
    );
  }

  let cuerpo: { mensaje?: string; imagen?: { media_type: string; data: string } };
  try {
    cuerpo = await peticion.json();
  } catch {
    return NextResponse.json({ error: 'JSON invalido' }, { status: 400 });
  }

  const mensaje = (cuerpo.mensaje ?? '').trim();
  if (!mensaje && !cuerpo.imagen) return NextResponse.json({ error: 'Mensaje vacio' }, { status: 400 });

  const perfil = await cargarPerfil(supabase, usuario.id);
  if (!perfil) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });

  const estado = await cuota(supabase, usuario.id, perfil.plan);
  if (estado.agotada) {
    return NextResponse.json(
      { error: `Has gastado los ${estado.limite} mensajes de tu plan este mes.`, cuota: estado },
      { status: 429 },
    );
  }

  // La foto va al modelo y ademas se guarda en el bucket privado del usuario.
  let fotoPath: string | null = null;
  if (cuerpo.imagen?.data) {
    try {
      const binario = Buffer.from(cuerpo.imagen.data, 'base64');
      const extension = cuerpo.imagen.media_type.split('/')[1] ?? 'jpg';
      const ruta = `${usuario.id}/${Date.now()}.${extension}`;
      const { error } = await supabase.storage
        .from('comidas')
        .upload(ruta, binario, { contentType: cuerpo.imagen.media_type });
      if (!error) fotoPath = ruta;
    } catch (error) {
      console.error('[coach] no se pudo guardar la foto', error);
    }
  }

  const panel = await cargarPanel(supabase, usuario.id, perfil);
  const contexto = construirContexto(panel);

  const { data: historial } = await supabase
    .from('chat_mensajes')
    .select('rol, texto')
    .eq('user_id', usuario.id)
    .order('creado', { ascending: false })
    .limit(MENSAJES_HISTORIAL);

  const mensajes: Anthropic.Beta.Messages.BetaMessageParam[] = (historial ?? [])
    .reverse()
    .map((m) => ({ role: m.rol as 'user' | 'assistant', content: m.texto }));

  const contenidoUsuario: Anthropic.Beta.Messages.BetaContentBlockParam[] = [];
  if (cuerpo.imagen?.data) {
    contenidoUsuario.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: cuerpo.imagen.media_type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
        data: cuerpo.imagen.data,
      },
    });
  }
  contenidoUsuario.push({
    type: 'text',
    text: mensaje || 'Esta es una foto de lo que he comido. Estima los macros y registralo.',
  });
  mensajes.push({ role: 'user', content: contenidoUsuario });

  const cliente = clienteIA();
  const ctxHerramientas = { supabase, userId: usuario.id, perfil, hoy: panel.hoy };
  const codificador = new TextEncoder();

  const flujo = new ReadableStream({
    async start(controlador) {
      const acciones: AccionRegistrada[] = [];
      let tokensEntrada = 0;
      let tokensSalida = 0;
      let respuesta = '';

      const enviar = (evento: string, datos: unknown) => {
        controlador.enqueue(codificador.encode(`event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`));
      };

      try {
        for (let vuelta = 0; vuelta < MAX_VUELTAS; vuelta++) {
          const emision = cliente.beta.messages.stream({
            model: MODELO,
            max_tokens: 4096,
            betas: [BETA_FALLBACK],
            fallbacks: 'default',
            output_config: { effort: 'medium' },
            system: [
              {
                type: 'text',
                text: perfil.onboarding ? PROMPT_COACH : PROMPT_ONBOARDING,
                cache_control: { type: 'ephemeral' },
              },
              { type: 'text', text: `DATOS ACTUALES DEL USUARIO\n${contexto}` },
            ],
            tools: HERRAMIENTAS,
            messages: mensajes,
          });

          emision.on('text', (delta) => {
            respuesta += delta;
            enviar('texto', { delta });
          });

          const mensajeIa = await emision.finalMessage();
          tokensEntrada += mensajeIa.usage.input_tokens ?? 0;
          tokensSalida += mensajeIa.usage.output_tokens ?? 0;

          if (mensajeIa.stop_reason === 'refusal') {
            const aviso =
              'No puedo ayudarte con eso. Si es algo de salud delicado, mejor con un profesional; para cualquier otra cosa, dime y seguimos.';
            respuesta = aviso;
            enviar('texto', { delta: aviso });
            break;
          }

          const llamadas = mensajeIa.content.filter(
            (b): b is Anthropic.Beta.Messages.BetaToolUseBlock => b.type === 'tool_use',
          );
          if (!llamadas.length) break;

          mensajes.push({ role: 'assistant', content: mensajeIa.content });

          const resultados: Anthropic.Beta.Messages.BetaToolResultBlockParam[] = [];
          for (const llamada of llamadas) {
            const resultado = await ejecutarHerramienta(llamada.name, llamada.input, ctxHerramientas);
            if (resultado.accion) {
              acciones.push(resultado.accion);
              enviar('accion', resultado.accion);
            }
            resultados.push({ type: 'tool_result', tool_use_id: llamada.id, content: resultado.texto });
          }
          mensajes.push({ role: 'user', content: resultados });
        }

        if (!respuesta.trim()) respuesta = 'Apuntado.';

        if (fotoPath && acciones.some((a) => a.herramienta === 'registrar_comida')) {
          const { data: ultima } = await supabase
            .from('comidas')
            .select('id')
            .eq('user_id', usuario.id)
            .order('creado', { ascending: false })
            .limit(1)
            .maybeSingle();
          if (ultima) {
            await supabase.from('comidas').update({ foto_path: fotoPath, fuente: 'foto' }).eq('id', ultima.id);
          }
        }

        await supabase.from('chat_mensajes').insert([
          { user_id: usuario.id, rol: 'user', texto: mensaje || '[foto de comida]' },
          { user_id: usuario.id, rol: 'assistant', texto: respuesta, acciones },
        ]);
        await anotarUso(supabase, usuario.id, { entrada: tokensEntrada, salida: tokensSalida });

        enviar('fin', {
          texto: respuesta,
          acciones,
          xp: acciones.reduce((total, a) => total + (a.xp ?? 0), 0),
          cuota: { ...estado, usados: estado.usados + 1, quedan: Math.max(0, estado.quedan - 1) },
        });
      } catch (error) {
        console.error('[coach] error durante la conversacion', error);
        enviar('error', { error: 'El coach se ha quedado a medias. Reintenta en un momento.' });
      } finally {
        controlador.close();
      }
    },
  });

  return new Response(flujo, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
