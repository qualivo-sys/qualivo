import type { KlaviyoClient } from './client.ts';

export type FlowStatus = 'draft' | 'manual' | 'live';

/** Lista todos los flows de la cuenta (id, nombre, status). */
export async function listFlows(client: KlaviyoClient): Promise<any> {
  return client.request('/api/flows/');
}

/** Devuelve un flow con su `definition` completa (trigger + acciones), la base clonable. */
export async function getFlowWithDefinition(client: KlaviyoClient, id: string): Promise<any> {
  return client.request(`/api/flows/${id}/`, {
    query: { 'additional-fields[flow]': 'definition' },
  });
}

/** Crea un flow a partir de una `definition`. Entra en estado `draft` (hay que activarlo). */
export async function createFlow(
  client: KlaviyoClient,
  name: string,
  definition: unknown,
): Promise<any> {
  return client.request('/api/flows/', {
    method: 'POST',
    body: { data: { type: 'flow', attributes: { name, definition } } },
  });
}

/** Borra un flow por id (útil para limpiar flows de prueba). */
export async function deleteFlow(client: KlaviyoClient, id: string): Promise<void> {
  await client.request(`/api/flows/${id}/`, { method: 'DELETE' });
}

/** Cambia el estado de un flow: draft ↔ manual ↔ live (activar = 'live'). */
export async function updateFlowStatus(
  client: KlaviyoClient,
  id: string,
  status: FlowStatus,
): Promise<any> {
  return client.request(`/api/flows/${id}/`, {
    method: 'PATCH',
    body: { data: { type: 'flow', id, attributes: { status } } },
  });
}
