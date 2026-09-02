import webpush from 'web-push';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PreferenciasAvisos } from './tipos';

export function hayPush(): boolean {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function configurar(): void {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:hola@example.com',
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
}

export interface Aviso {
  titulo: string;
  cuerpo: string;
  url: string;
  tag?: string;
}

export interface Suscripcion {
  id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

/**
 * Envia un aviso a todas las suscripciones de un usuario. Si el navegador ya
 * no existe (410/404), la suscripcion se borra para no insistir.
 */
export async function enviarAviso(
  supabase: SupabaseClient,
  suscripciones: Suscripcion[],
  aviso: Aviso,
): Promise<{ enviados: number; caducadas: number }> {
  if (!hayPush() || !suscripciones.length) return { enviados: 0, caducadas: 0 };
  configurar();

  let enviados = 0;
  let caducadas = 0;
  for (const s of suscripciones) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify(aviso),
        { TTL: 60 * 60 * 6 },
      );
      enviados += 1;
    } catch (error) {
      const estado = (error as { statusCode?: number }).statusCode;
      if (estado === 404 || estado === 410) {
        await supabase.from('push_suscripciones').delete().eq('id', s.id);
        caducadas += 1;
      } else {
        console.error('[push] fallo el envio', estado, (error as Error).message);
      }
    }
  }
  return { enviados, caducadas };
}

// ── Que aviso toca a cada hora (logica pura, sin red) ─────────────────

export type TipoAviso = 'manana' | 'noche' | 'entreno' | 'revision';

export interface EstadoDia {
  /** Hora local del usuario, 0-23. */
  hora: number;
  /** Dia de la semana local, 0 = domingo. */
  diaSemana: number;
  tieneCheckInManana: boolean;
  tieneComidasHoy: boolean;
  entrenoHoy: boolean;
  entrenoPendienteSemana: boolean;
  revisionNueva: boolean;
  /** Avisos ya enviados hoy. */
  enviadosHoy: TipoAviso[];
}

const horaDe = (valor: string | null | undefined, porDefecto: number): number | null => {
  if (valor === null) return null;
  if (!valor) return porDefecto;
  const h = Number(valor.split(':')[0]);
  return Number.isFinite(h) ? h : porDefecto;
};

/**
 * Decide que avisos mandar ahora. Se llama cada hora por usuario; cada tipo
 * sale como mucho una vez al dia y solo si de verdad hay algo pendiente.
 */
export function decidirAvisos(prefs: PreferenciasAvisos, estado: EstadoDia): TipoAviso[] {
  const salida: TipoAviso[] = [];
  const ya = (t: TipoAviso) => estado.enviadosHoy.includes(t);

  const horaManana = horaDe(prefs.aviso_manana, 8);
  if (horaManana !== null && estado.hora === horaManana && !estado.tieneCheckInManana && !ya('manana')) {
    salida.push('manana');
  }

  const horaNoche = horaDe(prefs.aviso_noche, 21);
  if (horaNoche !== null && estado.hora === horaNoche && !ya('noche')) {
    salida.push('noche');
  }

  if (
    prefs.aviso_entreno !== false &&
    estado.hora === 17 &&
    !estado.entrenoHoy &&
    estado.entrenoPendienteSemana &&
    !ya('entreno')
  ) {
    salida.push('entreno');
  }

  if (estado.revisionNueva && estado.diaSemana === 0 && estado.hora >= 9 && !ya('revision')) {
    salida.push('revision');
  }

  return salida;
}

export function textoAviso(tipo: TipoAviso, nombre: string, datos: { racha: number; kcal: number; metaKcal: number | null }): Aviso {
  const quien = nombre.split(' ')[0] || 'crack';
  switch (tipo) {
    case 'manana':
      return {
        titulo: `Buenos dias, ${quien}`,
        cuerpo: datos.racha > 1 ? `Racha de ${datos.racha} dias. ¿Como has dormido? Cuentamelo en un mensaje.` : '¿Como has dormido y como te encuentras? Un mensaje y lo apunto todo.',
        url: '/app/coach?checkin=manana',
        tag: 'manana',
      };
    case 'noche':
      return {
        titulo: 'Cerramos el dia',
        cuerpo:
          datos.metaKcal && datos.kcal
            ? `Llevas ${datos.kcal} de ${datos.metaKcal} kcal. ¿Que ha ido bien hoy y que no?`
            : '¿Que has comido, has entrenado, que ha ido bien? Un mensaje y cerramos el dia.',
        url: '/app/coach?checkin=noche',
        tag: 'noche',
      };
    case 'entreno':
      return {
        titulo: 'Hoy toca entrenar',
        cuerpo: 'Todavia no has registrado sesion. Una corta vale mas que la perfecta de manana.',
        url: '/app/entreno',
        tag: 'entreno',
      };
    case 'revision':
      return {
        titulo: 'Tu revision de la semana esta lista',
        cuerpo: 'Puntuaciones, tu cuello de botella y tres acciones para la semana que entra.',
        url: '/app/semana',
        tag: 'revision',
      };
  }
}
