# PLAN DE MIGRACIÓN

Orden por riesgo, no por ilusión. Cada paso dice qué rompe si sale mal y cómo se revierte.
**Nada de esto se ejecuta sin el visto bueno de Maikel**, porque toca agentes vivos.

## Paso 0 · Reparar el bucle semanal · ANTES QUE NADA

No tiene sentido diseñar aprendizaje sobre cinco rutinas que llevan un mes sin ejecutarse.

1. Confirmar con Maikel si llegaron el Weekly Plan del 8 y el CEO Brief del 5.
2. Ops investiga por qué no consta ninguna ejecución y lo arregla o lo recrea.
3. Añadir el chequeo de anclaje: el lunes se pregunta si corrió el plan, el sábado si corrió la
   review.
4. **Criterio de éxito:** dos viernes seguidos con CEO Brief entregado.

Rompe: nada. Revertir: trivial.

## Paso 1 · Rama de integración

Crear `main` con `sistema/`, `docs/agent-os/`, `registry.json`, `bus/`, `src/connectors/`.
Cambiar la rama por defecto del repositorio.

Rompe: nada, es una rama nueva. Revertir: borrarla.
**Criterio:** los tres agentes vivos leen la constitución desde `main`.

## Paso 2 · Bus y partes

Cada agente escribe su línea en `bus/out/<agente>.jsonl` al cerrar un bloque. El Brain lee de ahí
en vez de hacer polling de resúmenes.

Rompe: si un agente no escribe, el Brain no lo ve. Mitigación: durante dos semanas conviven las
dos formas.
**Criterio:** un Morning Brief construido solo con el bus.

## Paso 3 · Ops entra en servicio

Reactivar la sesión con el mandato nuevo. Primeras tres tareas: chequeo diario de salud,
inventario de secretos, `mapa-n8n.md`.

Rompe: nada, solo lee. **Criterio:** un parte de salud diario durante una semana.

## Paso 4 · Partir Outbound

Crear la sesión SDR. Mover a ella el triaje de respuestas, WhatsApp y voz. Outbound se queda con
carga de leads, secuencias y reporte de envíos. La telefonía se va a Ops.

Rompe: **es el paso de más riesgo.** Si se hace mal, se cae la captación.
Mitigación: se mueve una rutina por día, no todas de golpe, y se verifica cada una antes de la
siguiente. Revertir: reasignar la rutina a la sesión original.
**Criterio:** una semana con las dos sesiones y cero leads perdidos.

## Paso 5 · Partir Growth

Crear la sesión Content con la content machine y el Radar. Demand se queda con web, CRO, SEO y
Radiografía, en cadencia semanal.

Rompe: poco. Revertir: fácil.
**Criterio:** el Growth Review se ejecuta dos lunes seguidos.

## Paso 6 · Sales en servicio

Reactivar como copiloto. Primer encargo, el que lleva pendiente: reactivación de cartera y subidas
de precio, de 4.100 a 6.800 €/mes.

**Criterio:** dossier antes de cada reunión y propuesta en menos de 48 h después.

## Paso 7 · Renombrar sesiones y retirar `cerebro.md`

**Estado: hecho a medias el 10-sep.** Maikel renombró las sesiones. Los nombres nuevos son mejores
que los que yo proponía, así que se adoptan:

| Antes | Ahora | Agente del diseño |
|---|---|---|
| Quipu billing dashboard 2025-2026 | **CEO Agent** | Cerebro |
| Client acquisition strategy | **Agente Outbound** | Outbound, y de ahí sale SDR |
| Landing Qualivo.io en Vercel | **Agente growth** | Demand, y de ahí sale Content |
| Google Ads expert prompt | **Agente Adigital** | cliente |
| EAC metrics dashboard | **Agente EAC** | cliente |
| Eleva Academy metrics dashboard | **Agente Eleva** | cliente |

**Falta la otra mitad, y es la que rompe cosas.** Cinco rutinas y `sistema/cerebro.md` siguen
nombrando las sesiones por su título antiguo:

| Qué | Nombra a |
|---|---|
| Daily 9:30 · Revisión de agentes | Agente Outbound, Agente growth |
| Timbre Cerebro → Outbound | CEO Agent |
| Timbre Outbound → Cerebro | Agente Outbound |
| Canal cerebro → Landing/Growth | CEO Agent |
| Outbound · Documento Madre | CEO Agent |
| `sistema/cerebro.md`, tabla Quién es quién | las seis |

Las rutinas **siguen despertando a la sesión correcta**, porque van por `session_id`. Lo que falla
es el texto: la revisión diaria del CEO Agent le dice que busque "Client acquisition strategy" y
"Landing Qualivo.io en Vercel", que ya no existen. El fallo no es ruidoso, es silencioso: reporta
que no hay novedades. Es el mismo patrón del hallazgo H2.

Y solo entonces borrar las tres copias de `cerebro.md`.

## Paso 8 · Client OS

Con el Internal OS estable, plantilla de cliente: mismos módulos, `client.config` propio. EAC es
el primer caso porque es el que más código tiene ya escrito.

## Resumen

| Paso | Riesgo | Desbloquea |
|---|---|---|
| 0 · bucle semanal | ninguno | que el sistema aprenda |
| 1 · rama de integración | ninguno | una sola fuente de verdad |
| 2 · bus | bajo | que el Brain vea sin preguntar |
| 3 · Ops | ninguno | que nada falle en silencio |
| 4 · partir Outbound | **alto** | medir el funnel |
| 5 · partir Growth | bajo | que lo semanal se ejecute |
| 6 · Sales | bajo | 4.100 → 6.800 €/mes |
| 7 · renombrar | medio | que el sistema se entienda solo |
| 8 · Client OS | — | escalar a clientes |
