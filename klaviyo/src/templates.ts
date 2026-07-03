import type { KlaviyoClient } from './client.ts';

/** Lista las plantillas de email de la cuenta. */
export async function listTemplates(client: KlaviyoClient): Promise<any> {
  return client.request('/api/templates/');
}

/**
 * Crea una plantilla HTML (editor_type = 'CODE').
 * Las plantillas HTML no tienen restricción por API (a diferencia de las
 * drag-and-drop, limitadas a ~2 por app partner). Devuelve el id para
 * referenciarlo desde una acción send-email de un flow.
 */
export async function createHtmlTemplate(
  client: KlaviyoClient,
  name: string,
  html: string,
): Promise<any> {
  return client.request('/api/templates/', {
    method: 'POST',
    body: {
      data: { type: 'template', attributes: { name, editor_type: 'CODE', html } },
    },
  });
}

/** Borra una plantilla por id (útil para limpiar plantillas de prueba). */
export async function deleteTemplate(client: KlaviyoClient, id: string): Promise<void> {
  await client.request(`/api/templates/${id}/`, { method: 'DELETE' });
}
