# Auditoría de automatizables · Qualivo

> Agente de Automatización · **2026-09-01**
> Fuentes revisadas: `ventas/` (rama `claude/qualivo-agente-ventas-sq3vnt`), `captacion/`, `plan/`, `sdr/` (rama `claude/client-acquisition-ideas-k00f5d`), `quipu/`, `sistema/cerebro.md` (rama del cerebro), `src/` (dashboard Apps Script).
> Regla de oro aplicada: ENTENDER → ESTANDARIZAR → VALIDAR → AUTOMATIZAR → ESCALAR. Solo aparecen propuestas con ROI positivo; al final hay una lista explícita de lo que **NO** hay que automatizar todavía.
> Coste de herramienta: 0 € en todos los casos — todo corre en el n8n existente de Maikel o en cron. Sin gasto nuevo (modo caja respetado).

## Resumen

| # | Automatización | Horas/mes ahorradas (est.) | Coste | Estado |
|---|---|---|---|---|
| 1 | Seguimientos 3-7-14 → borradores diarios | ~7 h | 0 € | **Entregado hoy** (`seguimientos-3-7-14/`) |
| 2 | Cobros: recordatorio de facturas impagadas (Quipu) | ~2 h + caja más rápida | 0 € | Siguiente (backlog nº 2) |
| 3 | Pipeline repo → Notion (Qualivo OS) | ~2 h | 0 € | Backlog nº 3 |
| 4 | Industrializar scripts de Outbound (guardia + reporte) | ~4 h | 0 € | Propuesta a Outbound vía cerebro |
| 5 | Programar `sync_quipu_dashboard.py` (cron) | ~1 h | 0 € | Propuesta al cerebro |
| 6 | Alerta de respuesta entrante <2h | ~2 h + prioridad nº 1 del cerebro | 0 € | Propuesta (necesita decisión) |
| | **Total potencial** | **~18 h/mes** | **0 €** | |

---

## 1 · Seguimientos 3-7-14 — ENTREGADO

- **Problema:** el tracker `ventas/seguimiento.md` exige revisar cada mañana qué toques vencen y redactar cada uno. Hoy mismo los 3 seguimientos están vencidos — la revisión manual ya ha fallado una vez.
- **Impacto:** ~30 min/día laborable (~10 h/mes) entre revisar, redactar y no olvidarse. El coste real no son las horas: es la cuenta de 1.500 € que se enfría por un toque no dado (el día 14 de Equilibrha cae el 07-sep).
- **Solución:** lista de toques del día generada sola cada mañana, con el borrador ya redactado.
- **Automatización:** workflow n8n en `seguimientos-3-7-14/` (ver README). Ahorro neto ~7 h/mes (queda la revisión y envío de Maikel, ~10 min/día). Proceso ya validado a mano por el agente de ventas → cumple la regla de oro.

## 2 · Cobros: facturas emitidas sin cobrar (Quipu)

- **Problema:** no hay ningún aviso sistemático de facturas emitidas que pasan X días sin cobro. Caso real: la factura de **Adigital de 850 €**.
- **Impacto:** revisión manual de Quipu (~1-2 h/mes) y, peor, días de caja perdidos — en modo caja, cobrar 850 € una semana antes importa más que cualquier hora ahorrada.
- **Solución:** workflow n8n con Schedule semanal → API de Quipu (`GET /invoices`, `kind=income`; la autenticación OAuth y la paginación ya están resueltas en `quipu/sync_quipu_dashboard.py`, se reutiliza el mismo patrón) → filtrar emitidas sin cobrar a +15 y +30 días → **borrador** de email de recordatorio cortés + aviso interno a Maikel. Nunca autoenvío (es un email a cliente).
- **Automatización:** siguiente entregable de esta carpeta. Ahorro ~2 h/mes + aceleración de cobro. Nota: hay que confirmar en la respuesta de la API de Quipu qué campo marca el estado de cobro (`paid`/`unpaid_amount`) — lo verifico al construirlo.

## 3 · Pipeline repo → Notion (Qualivo OS)

- **Problema:** el estado de las oportunidades vive en `ventas/pipeline.md` y además el cerebro registra tareas en la base **Tareas** de "Qualivo OS · Sala de Mando" en Notion. Doble apunte manual.
- **Impacto:** ~2 h/mes de re-tecleo + riesgo de que Notion y repo cuenten historias distintas (el cerebro prepara el parte diario con esos datos).
- **Solución:** workflow n8n que vigile cambios de `pipeline.md` (polling del commit del fichero vía API de GitHub) y refleje los cambios de fase en Notion con importe y fecha.
- **Automatización:** backlog nº 3. Requiere credencial de Notion de Maikel y el ID de la base Tareas. Respetará la regla del cerebro: las finanzas NO se duplican en Notion — solo fase/estado/importe de oportunidad, no caja.

## 4 · Industrializar los scripts de Outbound — propuesta, no reescritura

- **Problema:** Outbound ya tiene dos scripts buenos y validados en `captacion/scripts/`: `guardia_reenvios.py` (pausa campañas Smartlead que reinician secuencias — nació del incidente de reenvíos de agosto) y `reporte_diario.py` (métricas del día). Ambos se lanzan **a mano** con la API key como argumento.
- **Impacto:** ~10 min/día si se ejecutan a diario (~3,5-4 h/mes); y el guardián solo protege cuando alguien se acuerda de lanzarlo — un guardián manual es medio guardián.
- **Solución:** programarlos (n8n Schedule + Execute Command, o cron): guardián 2-3 veces/día con alerta a Maikel si pausa algo (exit code 1 ya lo señala); reporte a las 8:00 con salida al buzón interno.
- **Automatización:** **no la construyo yo** — los scripts son de Outbound y funcionan; industrializarlos es decisión suya. Propuesto vía `[PARA CEREBRO]` en mi parte de hoy.

## 5 · Programar `sync_quipu_dashboard.py`

- **Problema:** el sync del dashboard de facturación es idempotente y "puede ejecutarse desde un cron" según su propio README… pero no consta ningún cron: se lanza a mano.
- **Impacto:** ~15 min por ejecución + el dashboard del cerebro puede estar desfasado justo en la revisión de las 9:30.
- **Solución:** cron o n8n Schedule diario a las 8:30 (antes de la revisión del cerebro), con aviso solo si falla.
- **Automatización:** trivial (una línea de cron en la máquina donde ya corre). Decisión del cerebro, que es el dueño del script.

## 6 · Alerta de respuesta entrante <2h

- **Problema:** la prioridad nº 1 del cerebro es "responder toda respuesta entrante en <2h", pero detectar la respuesta depende de mirar Smartlead/GHL.
- **Impacto:** una respuesta vista tarde incumple la directriz nº 1 y enfría al lead — es la métrica que gobierna todo lo demás (8-10 respuestas/semana objetivo).
- **Solución:** webhook de Smartlead (evento reply) → n8n → notificación inmediata a Maikel (email interno o Telegram) con el texto de la respuesta y la cuenta. Solo notifica: la respuesta la escribe/aprueba Maikel o el SDR.
- **Automatización:** toca territorio de Outbound (Smartlead) → propuesta vía `[PARA CEREBRO]` para que decida quién lo cablea. Ahorro directo ~2 h/mes de vigilancia + cumplimiento de la directriz.

---

## Lo que NO hay que automatizar todavía (regla de oro)

- **Registro de toques en `seguimiento.md`**: el registro manual tiene 0 entradas — el proceso aún no ha funcionado a mano ni una vez. Primero que ventas registre 2-3 semanas; luego se automatiza.
- **Propuestas comerciales**: la plantilla existe (`ventas/plantillas/propuesta-base.md`) pero no se ha enviado ninguna propuesta real. Sin proceso validado no hay nada que estandarizar.
- **Cualquier envío directo a cliente**: límite duro permanente, no cuestión de madurez.
- **Reactivaciones (motor templado, 5/semana)**: el criterio de selección de qué contacto reactivar es hoy juicio de Maikel/SDR; automatizar la selección sería automatizar una decisión, no una tarea.
