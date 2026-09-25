# 2. Lifecycle canónico y Event Contract

## Reglas

- **Estado**: condición actual mutuamente excluyente de la entidad.
- **Evento**: hecho inmutable y fechado que ocurrió; puede causar un cambio de estado.
- No se deriva revenue de mensajes enviados ni de actividades de CRM.
- La entidad puede ser `lead`, `contact`, `account`, `opportunity` o `customer`; se relacionan, no se sustituyen.
- Fit, Intent y Human Priority son dimensiones independientes. No se suman en un lead score único.

## Lifecycle canónico

| Estado | Entrada verificable | Salida / siguiente decisión |
|---|---|---|
| ORIGEN | Se registra fuente/campaña/referido/acción | Crear o reconciliar Lead/Cuenta |
| LEAD / CUENTA | Entidad deduplicada con owner y consentimiento/base aplicable | Contactar o nutrir |
| CONTACTADO | Se emitió contacto válido | Conversación, sin respuesta, baja o no-fit |
| CONVERSACIÓN | Respuesta humana bidireccional o conversación de voz real | Cualificado, nurture o no-fit |
| CUALIFICADO | Fit e Intent mínimos confirmados | Cita o nurture temporal |
| CITA | Reserva real creada | Confirmada, cancelada, no-show o realizada |
| CONFIRMADA | Confirmación explícita / señal acordada | Reunión realizada, cancelación o no-show |
| REUNIÓN REALIZADA | Asistencia real y resultado registrado | Propuesta, nurture o perdido/no-fit |
| PROPUESTA | Propuesta personalizada enviada con fecha de decisión | Decisión |
| DECISIÓN | Comprador acepta, rechaza o aplaza con motivo | Ganado, perdido o nurture fechado |
| GANADO | Contrato/aceptación y condición comercial definida | Onboarding |
| PERDIDO | Razón estructurada y posible reactivación registrada | Reactivación futura o cierre |
| ONBOARDING | Handoff aceptado y plan de alta iniciado | Primer valor |
| PRIMER VALOR | Hito de valor verificable para cliente | Retención |
| RETENCIÓN | Servicio activo con health/hitos y renovación | Expansión, referido, churn o renovación |
| EXPANSIÓN / REFERIDO | Oportunidad adicional o referido con origen registrado | Nuevo opportunity / lead relacionado |

Estados auxiliares permitidos: `nurture`, `no-fit`, `opt-out`, `duplicate`, `paused`. Nunca sustituyen un resultado comercial con una actividad.

## Fit / Intent / Human Priority

| Dimensión | Pregunta | Valores | Dueño de la regla | Uso |
|---|---|---|---|---|
| FIT | ¿Podemos crear valor con este tipo de cuenta/persona? | alto / medio / bajo / desconocido | Growth Architect + Sales | Segmentación, rutas y exclusión digna |
| INTENT | ¿Qué señales observables muestran disposición a avanzar ahora? | alto / medio / bajo / desconocido | Intelligence + Sales | Cadencia, CTA y timing |
| HUMAN PRIORITY | ¿Quién merece atención humana primero dada capacidad, riesgo y contexto? | P0 / P1 / P2 / P3 | Sales Ops / responsable comercial | SLA y cola humana |

Ejemplo: una cuenta puede tener FIT alto, INTENT bajo y prioridad P2; recibe nurturing útil, no persecución. Una cuenta FIT medio, INTENT alto puede ser P1 y requerir revisión humana. La prioridad no es «valor del lead» y caduca al cambiar las señales.

## Event Contract v1 (diseño)

Todos los productores — Paid, Outbound, Content, GHL, WhatsApp, Voice, Meetings, Sales y Customer Success — deberán poder emitir este sobre común:

```json
{
  "event_name": "meeting.completed",
  "timestamp": "2026-09-25T10:15:00Z",
  "entity_id": "opp_123",
  "entity_type": "opportunity",
  "lead_id": "lead_456",
  "contact_id": "contact_789",
  "account_id": "account_012",
  "source": "paid",
  "channel": "meta",
  "campaign": "meta_clinicas_q3",
  "vertical": "clinicas",
  "previous_state": "confirmed",
  "new_state": "meeting_completed",
  "actor": {"type": "human|agent|system|prospect", "id": "sales_maikel"},
  "metadata": {"schema_version": "1.0", "consent_status": "known"},
  "currency": "EUR",
  "value": null
}
```

Campos obligatorios en todo evento: `event_name`, `timestamp`, `entity_id`, `entity_type`, `source`, `channel`, `actor`, `metadata.schema_version`.

Campos obligatorios cuando existen: `lead_id/contact_id/account_id`, `campaign`, `vertical`, `previous_state/new_state`, `currency/value`. Ausencia se representa con `null`, no se inventa.

### Catálogo inicial

| Dominio | Eventos mínimos |
|---|---|
| Adquisición | `ad.impression`, `ad.click`, `lead.created`, `content.cta_clicked`, `outbound.account_qualified` |
| Contacto | `contact.attempted`, `contact.delivered`, `conversation.started`, `conversation.replied`, `contact.opted_out` |
| Cualificación | `fit.assessed`, `intent.assessed`, `priority.assigned`, `qualification.completed`, `lead.disqualified` |
| Reunión | `meeting.booked`, `meeting.confirmed`, `meeting.rescheduled`, `meeting.cancelled`, `meeting.no_show`, `meeting.completed` |
| Sales | `opportunity.created`, `proposal.sent`, `proposal.viewed`, `decision.recorded`, `deal.won`, `deal.lost`, `payment.received` |
| Customer Success | `onboarding.started`, `kickoff.completed`, `first_value.achieved`, `health.changed`, `renewal.decided`, `expansion.created`, `referral.created` |
| Operación / QA | `workflow.failed`, `workflow.recovered`, `event.rejected`, `data.reconciled`, `approval.granted`, `approval.rejected` |

## Reglas de calidad del contrato

1. El CRM conserva el estado actual; el almacén/event log conserva historia inmutable.
2. Un `meeting.completed` requiere asistencia registrada, no solo calendario ocupado.
3. `proposal.sent` necesita propuesta identificable y fecha de decisión.
4. `deal.won` y `payment.received` son eventos distintos.
5. Los costes de Paid usan fecha, moneda, campaña y periodo explícitos.
6. Las conversiones cross-channel llevan atribución declarada, nunca inferida como hecho.
7. RevOps rechaza/quarantena eventos sin identificador, tiempo, origen o schema válido; no corrige silenciosamente.
