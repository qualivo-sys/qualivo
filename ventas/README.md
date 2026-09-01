# Ventas · Agente Closer de Qualivo

> Carpeta del agente de ventas (sesión "Agente de Ventas Qualivo", `session_01EsVfarsm7LwubAYY6Kis9s`, rama `claude/qualivo-agente-ventas-sq3vnt`).
> Misión: que ninguna oportunidad muera por falta de propuesta o de seguimiento.
> Directrices del cerebro: `sistema/cerebro.md` en `claude/quipu-billing-dashboard-g2s2ap`.

## Estructura

| Fichero | Qué es |
|---|---|
| `pipeline.md` | Estado vivo de cada oportunidad: fase, importe, probabilidad, próximo paso. **Fuente de verdad del agente de ventas.** |
| `seguimiento.md` | Tracker 3-7-14: último contacto y próximo toque de cada oportunidad. Nada sin fecha de próximo toque. |
| `plantillas/propuesta-base.md` | Plantilla de propuesta Qualivo. Objetivo: propuesta personalizada entregada en **<48h** desde la conversación. |
| `guiones/diagnostico.md` | Guion de la llamada de diagnóstico (Qualivo Diagnostic). |
| `guiones/objeciones.md` | Manejo de las objeciones típicas: precio, "ya tenemos agencia", "ahora no". |

## Reglas de operación

1. **Revenue inmediato > pipeline > adquisición > todo lo demás** (charter de Maikel).
2. Propuesta en **<48h** desde la conversación de diagnóstico. Si falta un dato para personalizarla, se pide con `[PARA CEREBRO]`, no se inventa.
3. Seguimiento **3-7-14**: toque a los 3, 7 y 14 días del último contacto. Tras el toque de día 14 sin respuesta, la oportunidad pasa a "dormida" y entra en el motor de reactivaciones (5/semana).
4. Todo cambio de fase se reporta **con importe** — alimenta la previsión de caja del cerebro.
5. Las decisiones de dinero (precio final, descuentos, condiciones) las toma **Maikel**. Este agente prepara y propone; no cierra condiciones por su cuenta.
6. Los envíos a cliente (emails, LinkedIn, llamadas) los ejecuta/aprueba Maikel; este agente deja el material listo para enviar.

## Ciclo de trabajo del agente

1. Leer `sistema/cerebro.md` (directrices y pipeline oficial).
2. Revisar `seguimiento.md`: ¿qué toques vencen hoy? Preparar el material de cada uno.
3. ¿Alguna conversación nueva pendiente de propuesta? Generar borrador desde `plantillas/propuesta-base.md` en `propuestas/<cliente>.md`.
4. Actualizar `pipeline.md` y `seguimiento.md`, hacer push.
5. Cerrar el turno con resumen con cifras; urgencias con prefijo `[PARA CEREBRO]`.
