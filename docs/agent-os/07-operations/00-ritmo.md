# EL DÍA, LA SEMANA Y EL MES DE QUALIVO

## Regla de diseño

La inspección demuestra que **lo diario se sostiene y lo semanal se cae**. Todo el ritmo se diseña
en consecuencia: lo semanal se ancla a lo diario y se vigila, en vez de confiar en que ocurra.

## El día

| Hora | Quién | Qué |
|---|---|---|
| 05:00 | **Ops** | Salud de las 23 rutinas. Primero, antes que nadie |
| 05:15 | Content | Blog y redes del día |
| 05:30 | Outbound | Carga de leads y secuencias |
| 06:00 | SDR | Preparación de la ronda |
| 07:30 | SDR | Triaje de respuestas |
| 08:00 | **Brain** | Consolida y entrega el **Morning Brief** |
| 09:00-11:00 | **Maikel** | Bloque comercial profundo. Nada de organizar |
| durante el día | todos | Trabajo por eventos, con sus SLA |
| 17:30 | Outbound + SDR | Parte del día al bus |
| 18:00 | **Brain** | Cierre: tareas, decisiones registradas, día siguiente preparado |

Maikel tiene **tres puntos de contacto**: el brief a las 8:00, lo urgente que rompa el SLA, y el
cierre. Nada más le interrumpe.

## Morning Brief · formato fijo

Cabe en una pantalla o no se envía.

```
1. DECISIONES QUE TE ESPERAN        🔴 y 🟡, con recomendación. Máximo 3
2. NÚMEROS                          solo la cadena de revenue, con fuente y fecha
3. SALUD DEL SISTEMA                rutinas rojas y desde cuándo. Una línea si todo va bien
4. AYER                             una línea por agente
5. HOY                              tareas asignadas, por prioridad
6. RIESGOS                          con el evento que los disparó
```

Si un día no hay nada que decidir, el punto 1 dice "nada" y eso es una buena noticia, no un fallo.

## SLA por evento

| Evento | Owner | Plazo |
|---|---|---|
| `lead.captured` con intención alta | SDR | 24 h |
| `lead.replied` | SDR | 2 h en horario |
| `meeting.completed` | Sales | propuesta en 48 h |
| `opportunity.stalled` | Sales | 24 h |
| `agent.degraded` | Ops | mismo día |
| `campaign.anomaly` | Outbound o Demand | mismo día |

## La semana

**Lunes 07:00 · Weekly Plan (Brain).** Objetivo de la semana, top 3, tareas de Maikel por día,
KPIs objetivo. Sale del número que esté más lejos de su meta.

**Martes 07:00 · Revisión de pipeline (Sales).** Cada oportunidad con su siguiente acción y fecha.

**Lunes 06:00 · Growth Review (Demand).** Web, SEO y contenido de la semana con cifras.

**Viernes 13:00 · Weekly Review + CEO Brief (Brain).** El único ritual que no puede fallar:

```
qué se hizo  →  qué movió el número  →  qué aprendimos  →  qué matamos
     →  qué escalamos  →  qué promociona de 🟡 a 🟢  →  qué decide Maikel
     →  borrador del plan de la semana siguiente
```

Aquí es donde el sistema aprende. Si esta rutina no corre, la semana no ha existido.

**Vigilancia:** el chequeo de salud del lunes pregunta si corrió el Weekly Plan; el del sábado, si
corrió el Weekly Review. Si no, es un incidente y aparece en el brief del lunes.

## El mes

**Día 1 · Cierre financiero (Brain).** Caja, cobros, gastos, runway, IVA, rentabilidad por cliente
con las horas de Todoist. Alertas de CFO.

**Día 1 · Revisión de arquitectura (Ops).** Agentes sin ficha, ownership duplicado, rutinas
caídas, fuentes de verdad nuevas, agentes que ya no aportan. Se retira lo que no mueve un número.

## Presupuesto de atención

Techo: **10 decisiones de Maikel por semana.**

| Agente | Decisiones/semana |
|---|---|
| Sales | 3 |
| Brain | 3 |
| Outbound | 2 |
| SDR | 2 |
| Demand | 1 |
| Content | 1 |
| Ops | 1 |
| **Total pedido** | **13** |

Pide 13 y el techo es 10. **Eso es deliberado:** obliga al Brain a recortar cada semana, y a
recortar por impacto. Un sistema que nunca supera su presupuesto de atención es un sistema que
no está pidiendo bastante.
