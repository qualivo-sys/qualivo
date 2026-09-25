# Qualivo Growth Operating System · Fase 1

Estado: **diseño para revisión**. No altera producción, campañas, mensajes, workflows, presupuestos ni credenciales.

## Decisión de arquitectura

Qualivo opera un solo sistema de revenue: `actividad → conversación → oportunidad → reunión realizada → propuesta → decisión → revenue → valor → retención/expansión`.

**Revenue Intelligence** observa el sistema entero, cuantifica las fugas y prioriza qué merece atención. **Growth System Architect** recibe los problemas priorizados y rediseña el journey, la oferta, los handoffs o experimentos estructurales. No son la misma función.

## Documentos

1. [Arquitectura y mapa de capacidades](01-arquitectura-y-capacidades.md)
2. [Lifecycle canónico y Event Contract](02-lifecycle-y-event-contract.md)
3. [Responsabilidades, fuentes de datos y Change Control](03-responsabilidades-datos-y-change-control.md)
4. [Intelligence, memoria de experimentos, seguridad y backlog](04-intelligence-experimentos-seguridad-backlog.md)

## Límites de Fase 1

- No crea ni modifica automatizaciones, campañas, copy comercial, precios, garantías, contratos o producción.
- El contrato de eventos es un diseño, no instrumentación.
- Los agentes y sistemas existentes continúan siendo la fuente operativa hasta una aprobación explícita de Fase 2.
- Todo dato sin trazabilidad completa se etiqueta como evidencia parcial, no como verdad causal.

## Base revisada

- Auditoría del recorrido comercial y documentación operativa en Notion.
- Ramas: `auditoria/embudo-semana-38`, `claude/qualivo-landing-vercel-nubk1i`, `claude/client-acquisition-ideas-k00f5d`, `claude/qualivo-paid`, `claude/qualivo-agente-ventas-sq3vnt` y `claude/qualivo-automatizaciones-b7k2m9`.
- Agentes instalados y borradores especializados de Qualivo.

La Fase 2 solo podrá convertir este diseño en cambios concretos mediante propuestas independientes y aprobación proporcional al riesgo.
