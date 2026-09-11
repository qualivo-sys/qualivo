/**
 * Dictado por voz con el reconocimiento del propio navegador.
 *
 * Por que asi y no grabando un audio y mandandolo: la API de Claude acepta
 * texto, imagenes y documentos, pero NO audio. Habria que transcribir por el
 * camino, y eso son otra clave de API y un coste por minuto. El navegador ya
 * sabe hacerlo, es instantaneo y es gratis.
 *
 * Lo que si se transcribe se deja en la caja de texto en vez de enviarse solo:
 * el reconocimiento se equivoca, y este chat ESCRIBE en tus datos. Poder leer
 * "he comido 300 g de arroz" antes de mandarlo no es friccion, es lo correcto.
 */

type Constructor = new () => Reconocedor;

interface Reconocedor {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: EventoResultado) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

interface EventoResultado {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}

function constructor(): Constructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: Constructor; webkitSpeechRecognition?: Constructor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** true si este navegador puede dictar. En iOS hace falta Safari 14.5+. */
export function hayDictado(): boolean {
  return constructor() !== null;
}

export interface Dictado {
  parar: () => void;
}

export type { Constructor as FabricaReconocedor };

export interface OpcionesDictado {
  idioma?: string;
  /** Texto reconocido hasta ahora (definitivo + lo que va oyendo). */
  alTexto: (texto: string, definitivo: boolean) => void;
  alError: (mensaje: string) => void;
  alTerminar: () => void;
}

const MENSAJES: Record<string, string> = {
  'not-allowed': 'No me has dado permiso para usar el microfono. Puedes activarlo en los ajustes del navegador.',
  'service-not-allowed': 'Tu navegador no deja usar el microfono aqui. Prueba a abrir la app en Chrome o Safari.',
  'no-speech': 'No he oido nada. Prueba otra vez.',
  'audio-capture': 'No encuentro ningun microfono.',
  network: 'Me he quedado sin conexion mientras escuchaba.',
};

/**
 * Empieza a escuchar. Devuelve como pararlo, o null si el navegador no puede.
 *
 * En iOS el reconocimiento se corta solo cada pocos segundos aunque le pidas
 * que siga. Por eso se reengancha mientras la persona no haya pulsado parar:
 * si no, un audio de treinta segundos se queda en los cinco primeros.
 */
export function empezarDictado(
  { idioma = 'es-ES', alTexto, alError, alTerminar }: OpcionesDictado,
  /** Inyectable para poder probar el acumulado y el reenganche sin navegador. */
  fabrica: Constructor | null = constructor(),
): Dictado | null {
  const Reconocimiento = fabrica;
  if (!Reconocimiento) return null;

  let parado = false;
  // Guardado por posicion, no concatenando: el navegador reenvia un trozo ya
  // cerrado mas de una vez y appendear lo duplicaba ("dos huevos huevos").
  let definitivos: string[] = [];
  // Lo de las sesiones anteriores. Al reengancharse el navegador vuelve a
  // contar desde el indice 0, asi que hay que cerrar lo de antes o se pisa.
  let anterior = '';
  const reconocedor = new Reconocimiento();
  reconocedor.lang = idioma;
  reconocedor.continuous = true;
  reconocedor.interimResults = true;

  reconocedor.onresult = (evento) => {
    let provisional = '';
    for (let i = evento.resultIndex; i < evento.results.length; i++) {
      const trozo = evento.results[i][0].transcript;
      if (evento.results[i].isFinal) definitivos[i] = trozo;
      else provisional += trozo;
    }
    const cerrado = anterior + definitivos.join('');
    alTexto((cerrado + provisional).trimStart(), provisional === '');
  };

  reconocedor.onerror = (evento) => {
    // Quedarse callado un momento no es un error que haya que enseñar.
    if (evento.error === 'aborted' || evento.error === 'no-speech') return;
    parado = true;
    alError(MENSAJES[evento.error] ?? 'No he podido escucharte. Prueba otra vez.');
    alTerminar();
  };

  reconocedor.onend = () => {
    if (parado) {
      alTerminar();
      return;
    }
    // Con espacio al empalmar: la sesion nueva empieza sin el y salia "pancon".
    anterior = `${(anterior + definitivos.join('')).trimEnd()} `;
    definitivos = [];
    try {
      reconocedor.start();
    } catch {
      parado = true;
      alTerminar();
    }
  };

  try {
    reconocedor.start();
  } catch {
    return null;
  }

  return {
    parar() {
      parado = true;
      reconocedor.stop();
    },
  };
}
