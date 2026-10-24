# Señales del CRM a Meta · responsable: Paid (desde el 24-oct-2026, por decisión de Maikel)

**Objetivo:** que Meta sepa quién es nuestro cliente ideal. Cada lead del formulario nativo tiene que volver a Meta con su etapa real: reserva, reunión con encaje, venta con importe y descarte. Así el algoritmo busca más gente como los que compran, no como los que rellenan formularios.

## Cómo funciona hoy (código de la rama claude/qualivo-landing-vercel-nubk1i, leído el 24-oct)

| Etapa | Evento a Meta | Cuándo sale | Archivo |
|---|---|---|---|
| Primer contacto | `Contacted` (con lead_id) | Cuando el trato pasa a «conversación» | `api/_tratos.js` → `calidadAMeta` |
| Reserva | `Schedule` (por email/teléfono hasheado, **sin lead_id**) | Al crearse la cita por la agenda, solo en la primera | `api/_cita.js` |
| Reunión con encaje | `Qualified` (con lead_id) | Cuando el trato se mueve a celebrada, oferta o seguimiento. También por la etiqueta `reunion-encaja`, que `api/seguimientos.js` revisa a las 07:15 de lunes a viernes | `api/_tratos.js` |
| Venta | `Converted` (con lead_id) | **Solo** si el trato se mueve a piloto o cliente | `api/_tratos.js` |
| Descarte | `Disqualified` | El agente o la cadencia lo descartan | `api/_agente.js`, `api/activacion.js` |

## Qué falló con el primer cliente de E-01 (lead de Meta 849695508226387)

Fuente: píxel /stats y GHL, 24-oct [C].

1. **A Meta solo le llegó `Contacted`.** No le llegaron la reserva, la reunión ni la venta.
2. **No hubo `Converted`.** El contacto tiene la etiqueta `cliente`, pero la oportunidad sigue en la primera etapa con 0 €. `Converted` solo sale al mover el trato, y nada revisa la etiqueta `cliente`.
3. **`Qualified` está pendiente.** Tiene `reunion-encaja`, pero la revisión de esa etiqueta solo corre de lunes a viernes. Saldría el lunes 26-oct, tres días tarde.
4. **No hubo `Schedule`.** La cita la propuso el agente en el mismo hilo de WhatsApp. Puede que no pasara por `api/_cita.js` como «primera», o que saliera sin lead_id. **Pendiente de comprobar.**
5. **`Converted` no lleva importe.** Meta no distingue un cliente de 3.600 € de uno de 300 €.

## Arreglos (Paid los propone y los prueba; Growth o quien despliegue la web los sube)

1. **Revisar etiquetas también para la venta.** Que `api/seguimientos.js` mande `Converted` cuando el contacto tenga `cliente` o `piloto`, aunque no se haya movido el trato. Y que esa revisión corra todos los días, no solo de lunes a viernes.
2. **Importe en `Converted`.** Añadir `value` y `currency: 'EUR'` en `calidadLead`, a partir del valor de la oportunidad o de una etiqueta `importe-<n>`.
3. **`Schedule` con lead_id** cuando el contacto lleve `meta-lead-*`, para que la reserva cuente en la integración del CRM.
4. **Comprobación diaria de Paid.** En el cierre de las 21:10, comparar los leads con `meta-lead-*` y su etapa en GHL con los eventos recibidos por el píxel. Avisar de cualquier hueco.

## Envío manual del primer cliente

`Qualified` (23-oct, 13:00 UTC) y `Converted` (24-oct, valor 3.600 €), con `lead_id` 849695508226387 y `external_id` hasheado, por la API de conversiones al píxel 879197745226987. Los event_id siguen el mismo patrón que el código (`lead-<id>-qualified`, `lead-<id>-converted`).

**Estado (24-oct):** bloqueado. El control de permisos de esta sesión no deja escribir en sistemas externos (Meta y GHL) sin aprobación de Maikel.
