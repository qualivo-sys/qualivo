# Workflow n8n · Seguimientos 3-7-14

> Entregable nº 1 del agente de Automatización. Estado: **listo para importar** (probado contra el `seguimiento.md` real del 01-sep: el 02-sep detecta los 3 toques pendientes).
> **Nada se envía a clientes desde este workflow.** Crea borradores; los envía Maikel.

## Qué hace

Cada mañana laborable a las **7:30 (Europe/Madrid)**:

1. Lee `ventas/seguimiento.md` del repo (rama del agente de ventas) vía GitHub raw — repo público, sin credencial.
2. Parsea la tabla "## Tabla de seguimiento" y se queda con las filas cuyo **Próximo toque vence hoy o ya venció**.
3. Para cada toque de canal **email**: crea un **BORRADOR en Gmail, sin destinatario** (imposible enviarlo por accidente), con un bloque de contexto arriba (cuenta, estado, material del agente de ventas, días de retraso) y una plantilla según el día de cadencia:
   - **Día 3**: recordatorio suave + ofrecer enfoque en dos líneas, sin reunión.
   - **Día 7**: una sola pregunta cerrada ("¿lo tenéis sobre la mesa este trimestre o lo aparco?") — en línea con el aprendizaje del SDR: el mensaje funciona, la reunión no convierte.
   - **Día 14**: cierre de hilo elegante (después pasa a "dormida" según la regla de ventas).
4. Para toques de canal **no-email** (LinkedIn, WhatsApp, teléfono): el texto va dentro del email-resumen, listo para copiar/pegar.
5. Envía **un único email interno a Maikel** (`info@maikelechevarria.com`) con la lista del día. Si no vence nada, avisa de "sin toques hoy" (el silencio nunca es ambiguo).

**Caso especial Emana**: el workflow detecta la cuenta y NO genera plantilla comercial — recuerda la regla del pipeline (relación, no venta; cero pitch, cero calendario).

## Importar y conectar (5 minutos)

1. n8n → **Workflows → Import from File** → `workflow.json`.
2. Abre los dos nodos de Gmail y asigna tu credencial **Gmail OAuth2** (la misma en ambos). Son los únicos nodos con credencial.
3. (Opcional) En "Enviar resumen a Maikel (interno)" cambia el destinatario si prefieres otro buzón.
4. Prueba con **Execute Workflow** (ejecución manual): hoy debería decir qué vence hoy; no rompe nada repetirla, solo crea borradores de más si vencen toques (bórralos del buzón de borradores).
5. Actívalo (toggle **Active**).

## Mantenimiento / avisos

- **URL del tracker**: apunta a la rama `claude/qualivo-agente-ventas-sq3vnt`. Si `ventas/` se fusiona a otra rama principal, cambia la rama en la URL del nodo "Leer ventas/seguimiento.md (GitHub)".
- **Formato del tracker**: el parseo depende de la tabla de `seguimiento.md` (8 columnas, fechas tipo `02-sep`). Si el agente de ventas cambia el formato, el workflow falla con un error explícito en el nodo de parseo (no falla en silencio).
- **Registro de toques**: tras enviar un toque, hay que actualizar `seguimiento.md` (fecha de último contacto + nuevo próximo toque). Eso lo hace el agente de ventas; si no se actualiza, el workflow repetirá el toque como "vencido" cada mañana — que es el comportamiento seguro (mejor recordar de más que perder una cuenta).

## Límite duro (recordatorio)

Este workflow **no tiene ningún nodo capaz de enviar a un cliente**: los borradores Gmail se crean sin destinatario y el único envío real es el resumen interno a Maikel.
