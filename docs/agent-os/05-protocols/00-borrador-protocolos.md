# FASE 0 · H. PROTOCOLO COMÚN (borrador, sin implementar)

Diseñado sobre lo que YA existe (`[PARA CEREBRO]`, timbres, `cerebro.md`, Notion), no sobre cero.
No se implementa hasta cerrar Fase 2.

## H.1 EVENT

Formaliza lo que hoy es el prefijo `[PARA CEREBRO]` en texto libre.

```json
{
  "event_id": "evt_2026-09-10_001",
  "event_type": "opportunity.stage_changed",
  "timestamp": "2026-09-10T09:12:00+02:00",
  "source": "qualivo.ventas",
  "entity": { "type": "opportunity", "id": "equilibrha", "name": "Equilibrha" },
  "scope": "qualivo",
  "priority": "high",
  "data": { "from": "propuesta", "to": "negociacion", "amount_eur": 1500, "probability": 0.5 },
  "requires_human": false,
  "trace_id": "trc_radiografia_equilibrha"
}
```

`scope` sustituye a `client` y admite `qualivo | eac | eleva | outthink | focus | personal`:
separa Internal OS, Client OS y Personal OS desde el primer campo (Anexo A6).

**Catálogo inicial** (solo eventos con consumidor real hoy):
`lead.captured` (Radiografía completada) · `lead.replied` · `lead.high_intent` ·
`meeting.booked` · `opportunity.stage_changed` · `opportunity.stalled` · `proposal.sent` ·
`payment.received` · `campaign.anomaly` · `agent.degraded` · `approval.requested`

## H.2 TASK

Formaliza los "encargos del cerebro" que hoy viajan como texto en un poke.

```json
{
  "task_id": "TASK-2026-09-10-003",
  "created_by": "qualivo.brain",
  "assigned_to": "qualivo.outbound",
  "objective": "Contactar en <24h las radiografías completadas usando su cuello de botella",
  "entity": { "type": "segment", "id": "radiografias_pendientes" },
  "priority": "high",
  "deadline": "2026-09-11T18:00:00+02:00",
  "success_metric": "conversaciones_iniciadas",
  "approval_level": "green",
  "blast_radius": "visible_cliente",
  "attention_cost": 0,
  "status": "pending",
  "trace_id": "trc_radiografia_sep"
}
```

`approval_level`, `blast_radius` y `attention_cost` vienen del Anexo A.

## H.3 RESULT

```json
{
  "task_id": "TASK-2026-09-10-003",
  "status": "completed",
  "actions": ["12 contactos enviados", "3 respuestas"],
  "metrics": [
    { "name": "conversaciones_iniciadas", "value": 3, "source": "captacion/datos/funnel-diario.csv", "as_of": "2026-09-10" }
  ],
  "issues": [],
  "decisions_required": [],
  "next_action": "Seguimiento día 3 a los 9 sin respuesta",
  "attention_spent": 0
}
```

**Regla dura:** toda métrica lleva `value` + `source` + `as_of`. Sin fuente se escribe `SIN DATO`.

## H.4 AGENT CARD (registry.json)

Reemplaza la tabla "Quién es quién" de `cerebro.md`, que ya se ha bifurcado (H4).

```json
{
  "agent_id": "qualivo.outbound",
  "name": "Outbound",
  "system": "revenue",
  "scope": "qualivo",
  "session_id": "session_01CQu7vwR41PJkVKgtfbSEo4",
  "branch": "claude/client-acquisition-ideas-k00f5d",
  "owns": "Account → Conversation",
  "does_not_own": ["Conversation → Meeting", "infraestructura de telefonía"],
  "kpis": [{ "name": "conversaciones_iniciadas", "source": "captacion/datos/funnel-diario.csv" }],
  "routines": ["Carga diaria de leads", "Reporte diario de envíos"],
  "events_consumed": ["lead.high_intent"],
  "events_emitted": ["lead.replied", "meeting.booked"],
  "permissions": { "green": ["investigar", "enriquecer", "borrador"], "yellow": ["enviar secuencia"], "red": ["gasto", "copy nuevo"] },
  "cadence": "daily",
  "health": { "last_run": null, "consecutive_failures": 0, "silent_since": null },
  "attention_cost_week": 3,
  "status": "active"
}
```

## H.5 REPORT (parte de turno)

El bloque que ya usan los agentes, con dos campos nuevos:

```
STATUS · OBJECTIVE · ACTIONS · RESULTS · METRICS · ISSUES ·
DECISIONS_REQUIRED · NEXT_ACTION · HEALTH · ATTENTION_SPENT
```

## H.6 Regla de precedencia de la fuente de verdad

Causa raíz de H4. Propuesta a decidir en Fase 2:

| Información | Fuente única | Espejos permitidos |
|---|---|---|
| Estrategia y posicionamiento | Google Doc "Estrategia Central v1" | repo, solo lectura, sincronizado por el Brain |
| ICPs y mensajes de outbound | Notion OUTBOUND BRAIN | repo, solo lectura |
| Quién es quién / permisos | `registry.json` (una rama, una copia) | ninguno |
| Comercial (leads, oportunidades) | GoHighLevel | CSV derivados |
| Finanzas | Google Sheet del cerebro + Quipu | ninguno en Notion |
| Tareas y decisiones | Notion Sala de Mando | ninguno |
| Código y datos de agentes | repo, **rama única integrada** | ninguno |

**Regla:** un dato tiene una fuente. Un espejo es de solo lectura y lo escribe un proceso, nunca
una persona ni un agente distinto del propietario.
