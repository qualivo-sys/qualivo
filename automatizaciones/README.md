# Automatizaciones · Qualivo

> Carpeta del **agente de Automatización** (sesión "Agente de Automatización Qualivo", `session_01DAmUZHTVFxPG37QyuAMQvr`, rama `claude/qualivo-automatizaciones-b7k2m9`).
> Misión: quitar horas de trabajo repetitivo automatizando **solo procesos que ya funcionan a mano**.
> Directrices del cerebro: `sistema/cerebro.md` en `claude/quipu-billing-dashboard-g2s2ap`.

## Reglas de operación

1. **ENTENDER → ESTANDARIZAR → VALIDAR → AUTOMATIZAR → ESCALAR.** Nunca se automatiza una mala operación ni un proceso sin validar a mano.
2. **Límite duro:** nada que envíe mensajes a clientes o terceros se activa solo. Todo se entrega en modo borrador/staging; lo lanza Maikel.
3. Los workflows n8n se entregan como **JSON importable + README de conexión**. Maikel importa y conecta credenciales; aquí no vive ninguna credencial.
4. Las decisiones de dinero son de Maikel; lo que necesite al cerebro va con prefijo `[PARA CEREBRO]`.
5. No duplicar trabajo de otros agentes: los scripts de Outbound (`captacion/scripts/`) son suyos; si merecen industrializarse, se propone vía cerebro.

## Contenido

| Ruta | Qué es | Estado |
|---|---|---|
| `seguimientos-3-7-14/` | Workflow n8n nº 1: lista diaria de toques del tracker de ventas + borradores Gmail (sin destinatario). | **Listo para importar** |
| `auditoria-automatizables.md` | Auditoría de procesos repetitivos del repo: Problema→Impacto→Solución→Automatización, con horas/mes y coste. | v1 (2026-09-01) |
| `parte-2026-09-01.md` | Parte de turno para el cerebro. | — |

## Backlog (orden de valor)

1. ~~Seguimientos 3-7-14~~ → entregado.
2. **Cobros** (Quipu): recordatorio de facturas emitidas sin cobrar a los X días. Caso de prueba: Adigital, 850 €.
3. **Pipeline → Notion**: reflejar cambios de fase de `ventas/pipeline.md` en la base Tareas del Qualivo OS.
