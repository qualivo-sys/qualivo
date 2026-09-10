# FASE 0 · HALLAZGOS PRELIMINARES

> No es el diagnóstico completo (Fase 2). Son los hechos que la inspección deja probados
> y que condicionan el diseño. Cada uno lleva su evidencia.

## H1 · Qualivo YA tiene un Agent OS funcionando. Esto no es un greenfield

`sistema/cerebro.md` es una constitución real y en uso: define quién es quién, protocolo de
reporting, prefijo de urgencia, ownership de decisiones ("las de dinero las toma Maikel"),
directrices vigentes con fecha y registro de cambios versionado (v1, v2, v3).

**Consecuencia de diseño:** el trabajo no es construir un OS. Es **formalizar, reparar y
escalar el que ya existe**. Cualquier propuesta que ignore `cerebro.md` es una regresión.

## H2 · El bucle diario funciona. El bucle de aprendizaje semanal NUNCA ha cerrado

10 rutinas diarias: todas ejecutadas ayer u hoy.
4 rutinas semanales + 1 mensual: **cero ejecuciones registradas**, algunas creadas hace un mes.

Las que no han corrido nunca son exactamente las que producen aprendizaje y dirección:
Weekly Plan (lunes), Weekly Review + CEO Brief (viernes), Growth Review, Informe de los lunes,
Cierre financiero.

**Esto es el hallazgo más grave.** El sistema de Qualivo ejecuta todos los días y no aprende
ninguna semana. El ciclo `DATA → INTELLIGENCE → DECISION → EXECUTION → RESULT → LEARNING`
está roto exactamente en el tramo `RESULT → LEARNING`.

**Verificación pendiente con Maikel:** ¿llegó el CEO Brief el viernes 5-sep? ¿el Weekly Plan el
lunes 8-sep? Si no llegaron, confirmado. Si llegaron, el fallo es solo de registro.

## H3 · El conocimiento del OS vive en ramas huérfanas que nadie integra

29 ramas en el repo. **Ninguna mergeada.** La rama por defecto del repositorio de la empresa es
`claude/eac-metrics-dashboard-qx7fkh`, la rama de un cliente.

- El Cerebro escribe en su rama. Outbound en la suya (105 commits). Landing en la suya (275).
- Para leer la constitución hay que saber el comando exacto: `git show origin/claude/quipu-billing-dashboard-g2s2ap:sistema/cerebro.md`.
- Un agente nuevo no encuentra nada. Un humano nuevo, tampoco.

## H4 · La fuente de verdad ya se ha bifurcado. Con pruebas

`sistema/cerebro.md` dice: *"Este fichero: solo lo edita el cerebro"*. Hay **tres copias vivas y
distintas**:

| Rama | Líneas | Estado |
|---|---|---|
| `quipu-billing-dashboard` (cerebro) | 103 | canónica |
| `qualivo-agente-ventas` | 63 | congelada, le faltan 44 líneas |
| `qualivo-automatizaciones` | 57 | congelada |

Ventas y Automatización operan hoy con una constitución de hace días: sin el posicionamiento del
8-sep, sin las decisiones de reparto del 9-sep, sin la matriz obligatoria de mensaje.

Añadido: la estrategia tiene **cuatro espejos** (Google Doc → `sistema/estrategia-central.md` →
Notion OUTBOUND BRAIN → `estrategia/outbound-brain.md`) con reglas de precedencia escritas en
prosa. Es deuda de memoria activa, no teórica.

## H5 · Un solo agente carga el 43% de la operación

"Client acquisition strategy" tiene **10 de las 23 rutinas** y hace de: Outbound, SDR, agente de
voz (Raquel), administrador de infraestructura Twilio y guardián de deliverability.

Es a la vez el mayor cuello de botella y el mayor riesgo de concentración: si esa sesión se
degrada, cae toda la captación. Además impide medir: no se puede saber si falla la prospección o
la conversación, porque las dos viven en el mismo sitio.

## H6 · El Event Bus ya existe, hecho a mano, y es frágil

Los "Timbres" y "Canales" (6 triggers poke-only apuntando a sesiones persistentes) **son** un bus
de mensajes entre agentes. El protocolo es el prefijo `[PARA CEREBRO]` / `[DEL CEREBRO]` en texto
libre, y el Cerebro lo lee haciendo *polling* de resúmenes con `list_sessions`.

Problemas: sin schema, sin `trace_id`, sin acuse, sin reintento, y el Cerebro puede perderse un
aviso simplemente porque no aparece en el resumen de la sesión. De 6 canales, **4 no se han
disparado nunca**.

## H7 · Nadie sabe si un agente ha fallado

No hay observabilidad. El único registro de salud es `last_run` en los triggers, y **nadie lo
lee** — de hecho ha bastado consultarlo una vez para encontrar H2, que llevaba un mes activo.

Riesgo asociado: varias rutinas dependen de claves en el *scratchpad* del contenedor
(`/tmp/claude-0/...`, `.smartlead`, `.twilio_auth`). El contenedor es efímero. Una rutina puede
empezar a fallar en silencio sin que nada lo notifique.

## H8 · Internal OS, Client OS y Personal OS están mezclados en la misma infraestructura

Mismo repo, mismo scheduler, mismo Notion para: Qualivo interno, siete clientes (EAC, Eleva,
Outthink, Focus Practical, Nuria, Inspyria, Antic) y la vida de Maikel (inglés, entrenamientos,
SO personal, Tibia).

No es urgente separarlo del todo, pero sí nombrarlo: la rentabilidad por cliente no se puede
calcular si el trabajo de cliente no está aislado.

## H9 · Dos agentes chartered sin operación

El Cerebro coordina "Agente de Ventas" y "Agente de Automatización". Maikel no los abre
(confirmado por él, 10-sep). Uno tiene un encargo de máxima prioridad sin disparar nunca:
subir el recurrente de 4.100 € a 6.800 €.

**CONFLICT:** o el encargo importa y no tiene ejecutor, o no importa y sobra el agente.

## Cuellos de botella (los 3 reales)

1. **El bucle semanal no cierra** → se ejecuta sin corregir el rumbo. (H2)
2. **Outbound/SDR concentra 4 funciones** → tapón en `Account → Conversation → Meeting`, sin poder medir dónde se rompe. (H5)
3. **La atención de Maikel es el único aprobador** → todo lo 🟡 y 🔴 espera a una persona, y no hay mecanismo para que la autonomía crezca con el tiempo. (Ver Anexo A del prompt)
