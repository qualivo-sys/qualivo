/**
 * Alta automatica del alumno en ThriveCart Learn.
 *
 * Cuando Redsys confirma un pago, damos de alta al comprador en el curso para
 * que ThriveCart le envie su email de acceso ("Verify your email to access your
 * courses"). Esto sustituye a la antigua automatizacion en n8n: ahora vive
 * dentro de la propia app, sin depender de nada externo encendido.
 *
 * Autenticacion: Bearer token = API token de ThriveCart
 * (ThriveCart → Settings → API & Webhooks → API tokens).
 *
 * ⚠️ EL ENDPOINT EXACTO debe confirmarse contra la referencia oficial de la API
 * de ThriveCart (https://developers.thrivecart.com). El cuerpo documentado para
 * "crear/enrolar alumno" es { email, course_id }. Dejamos la ruta y los nombres
 * de campo configurables por variable de entorno para poder ajustarlos sin
 * tocar codigo tras la primera prueba real.
 */
import { config } from './config';

export interface EnrollResult {
  ok: boolean;
  status: number;
  body: string;
}

export async function enrollStudent(params: {
  email: string;
  name?: string;
}): Promise<EnrollResult> {
  const { apiToken, courseId, apiBase } = config.thrivecart;

  // Ruta del endpoint de alta. Ajustable por env si la referencia oficial
  // usa otra (p.ej. '/learn/students' o '/courses/students').
  const path = process.env.THRIVECART_ENROLL_PATH ?? '/learn/access';
  const url = `${apiBase}${path}`;

  const payload: Record<string, string> = {
    course_id: courseId,
    email: params.email,
  };
  if (params.name) payload.name = params.name;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}
