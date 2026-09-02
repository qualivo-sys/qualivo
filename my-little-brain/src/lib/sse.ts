export interface EventoSSE {
  evento: string;
  datos: unknown;
}

/**
 * Lee un cuerpo de respuesta en formato Server-Sent Events y va soltando
 * los eventos segun llegan. Tolera que un bloque se parta entre dos chunks.
 */
export async function* leerSSE(cuerpo: ReadableStream<Uint8Array>): AsyncGenerator<EventoSSE> {
  const lector = cuerpo.getReader();
  const decodificador = new TextDecoder();
  let pendiente = '';

  while (true) {
    const { done, value } = await lector.read();
    if (done) break;
    pendiente += decodificador.decode(value, { stream: true });

    const bloques = pendiente.split('\n\n');
    pendiente = bloques.pop() ?? '';

    for (const bloque of bloques) {
      const evento = bloque.match(/^event: (.+)$/m)?.[1];
      const crudo = bloque.match(/^data: (.+)$/m)?.[1];
      if (!evento || !crudo) continue;
      try {
        yield { evento, datos: JSON.parse(crudo) };
      } catch {
        // Un bloque corrupto no debe tumbar la conversacion entera.
      }
    }
  }
}
