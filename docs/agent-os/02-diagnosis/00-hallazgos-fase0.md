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

---

## H10 · RESUELTO el 10-sep · Había dos ofertas escritas al mismo tiempo

Detectado el 10-sep al revisar el agente de ofertas. **Es el hallazgo con más consecuencias
comerciales de todos.**

| Fuente | Fecha | Entrada | Núcleo |
|---|---|---|---|
| `sistema/cerebro.md`, matriz **obligatoria** | 8-sep | Radiografía del crecimiento, gratis, 90 s | Growth System, 1.000-2.500 €/mes. *"Nada más en la carta"* |
| Sesión de ofertas | 10-sep | **Leak Map** como producto de entrada | posicionamiento de **24.000 €**, nicho pyme, validación en 14 días |

Las dos no pueden ser ciertas a la vez. Y mientras tanto seis agentes están leyendo la primera:
Content escribe con ella, Outbound manda copy con ella, el SDR responde con ella, Sales propone
con ella.

**Aviso de precisión:** he leído el resumen de la sesión de ofertas, no su contenido completo.
Puede que sea exploración sin cerrar. Pero eso no cambia el riesgo: hay dos documentos de oferta y
seis agentes leyendo el viejo.

**Es H4 repitiéndose**, ahora sobre el activo más importante que tiene Qualivo. La deuda de
memoria no aparece por descuido, aparece cada vez que se trabaja en paralelo sin una regla de
precedencia.

**Resolución, y solo hay dos caminos.**

| Si la oferta nueva está decidida | Si sigue siendo exploración |
|---|---|
| Maikel la firma, se actualiza la matriz de la Estrategia Central, y el Cerebro avisa a los seis el mismo día | Se marca explícitamente como borrador, y la matriz del 8-sep sigue siendo la única válida |

Lo que no se puede hacer es dejarlo como está. Un mes vendiendo dos cosas distintas cuesta más que
cualquier fallo técnico de esta lista.

### RESOLUCIÓN · 10-sep, mismo día

Maikel firma una **tercera** versión, que no es ninguna de las dos anteriores: la **Propuesta de
valor V1 definitiva**, decidida por el cerebro a petición suya. Está en `sistema/propuesta-de-valor.md`
de la rama `main`, como espejo de solo lectura que leen todos los agentes.

Conserva la Radiografía como entrada, así que no es el Leak Map, y deroga la matriz del 8-sep. Los
cambios de fondo: la categoría pasa a "no sustituimos tu sistema comercial, lo agentizamos"; la
oferta pasa a cuatro escalones (Radiografía, plan en 48 h, piloto, sistema); el ICP pasa a 5-50
personas; y entra el reloj con la regla del número base firmado en semana 1 y la fecha de decisión
al día 30.

**Se congela hasta que haya 8-10 propuestas enviadas.** A partir de ahí manda la evidencia, no una
versión nueva. Esa cláusula es lo mejor del documento: convierte la oferta en algo que se falsa
con datos en vez de reescribirse cada semana.

**Tres conflictos nuevos que abre y hay que cerrar**, listados al final del propio fichero: el ICP
contra el Radar IA (2-20 empleados) y contra el Outbound Brain (18 ICPs), los precios que puedan
quedar en la landing, y el suelo de 500 €/mes que no estaba escrito en ningún sitio.

---

## H11 · Hay campañas vivas con dinero de clientes y nadie las gobierna

Corrección de un error mío. Escribí que Paid estaba dormido porque Qualivo no tiene presupuesto
propio. Maikel lo corrigió: hay campañas activas ahora mismo. Al comprobarlo, tenía razón, y el
problema es mayor de lo que parecía.

### Lo que está corriendo hoy, 10-sep

| Cliente | Plataforma | Presupuesto | Periodo | Quién lo vigila |
|---|---|---|---|---|
| **OutThink / Adigital** | Google Ads `918-811-5388` | **2.000 €** (600 Search + 1.000 Prospecting + 400 Remarketing) | 31-ago → **24-sep**, hoy es el día 11 de 25 | workflow n8n diario a las 08:00 → Sheet + email. **Ninguna rutina despierta al agente** |
| **EAC** | Meta + Google + TikTok | **4.000 €/mes** contratado (`CLIENT.monthlyBudget`) | continuo | dashboard, sin rutina |
| **Focus Practical** | Meta | SIN DATO | continuo | rutina diaria REBT 06:00, refresca el dashboard |
| **Eleva** | SIN DATO | SIN DATO | continuo | dashboard, sin rutina |
| **Antic Barcelona** | creatividades preparadas | SIN DATO | — | sesión **bloqueada desde el 7-sep** esperando un permiso |

### El diagnóstico exacto: hay medición, no hay gobierno

No falta instrumentación. Está bien montada: conectores de Meta, Google Ads y TikTok en el repo,
dashboards en Sheets, un workflow de n8n desplegado y activo que reporta cada mañana, conversión
`OT26_Registro` creada y verificada end-to-end en producción.

Lo que no existe es **quién decide qué cambiar**. El informe llega a un correo y ahí muere.

**Pruebas de que nadie lo está gobernando:**

1. `outthink-google-ads/ESTADO.md` no se actualiza desde el **28-ago**. La campaña lleva **11 días
   corriendo** y el documento de estado tiene 13 días.
2. Agente Adigital tiene **cero rutinas** programadas. Solo trabaja cuando Maikel lo abre.
3. El propio ESTADO.md se contradice: dice "todas en PAUSED (0 € de gasto)" y a la vez marca
   OT26_Search como ENABLED. A 28-ago era coherente; a 10-sep nadie sabe cuál es el estado real
   sin abrir la cuenta.
4. Quedan **13 días de campaña**. Lo que no se optimice esta semana ya no se optimiza: el
   presupuesto se habrá gastado.

### Riesgo pendiente heredado, ya documentado por el propio agente

Del ESTADO.md, sin resolver: la etiqueta antigua del Observatorio está contando también los
registros de OutThink en otra cuenta de conversión. Las listas de remarketing no se poblarán hasta
que el cliente active su medición. Y `rai.outthink.es` no es accesible desde la cuenta de Qualivo.

### Consecuencia para la arquitectura

Paid deja de ser un agente a futuro y pasa a ser **el que más urge**, por delante de casi todo lo
demás del roadmap. Es dinero de un cliente, con fecha de fin, y hoy no tiene dueño.

Y cambia el orden de prioridad del brief: esto es *client-delivery-critical*, no *intelligence*.
