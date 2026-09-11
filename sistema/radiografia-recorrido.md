# Radiografía → reunión · Recorrido y mensajes (v1, 9 sep 2026)

> Decisión de Maikel (9-sep): "dale caña". Regla madre: **no se pide reunión; se le pone número a la fuga, y la reunión es donde se pone el número.** Nadie recibe la palabra "reunión" antes de haber dado un dato.

## 0. Cambios en la Radiografía (Landing)

1. **Identificador por lead en el enlace de outbound.** La variante B de email 1 enlaza con `?l=<id>` (id opaco ligado al email del lead en Smartlead/GHL). Al terminar el test, el resultado (cuello, nivel, segunda, puntuaciones) se guarda contra ese contacto en GHL **aunque no rellene el formulario**, con etiqueta `radiografia-anonima` + `cuello-<x>`. Sin id, nada cambia. Base legal: interés legítimo B2B sobre un contacto que ya tenemos; no se crea ningún dato nuevo de persona, se enriquece uno existente.
2. **Perfil (rol, empleados, valor por cliente) después del resultado**, opcional, con el texto "tres datos para ajustar tu plan". El botón "Ver mi cuello de botella" nunca bloqueado.
3. **WhatsApp opcional** en el formulario del plan, con motivo: "si quieres que te lo comente en dos minutos". Medir % que lo deja. La frase "sin llamadas comerciales" se mantiene: solo se llama a quien lo deja o no contesta al WhatsApp (ver §3).

## 1. Recorrido

| Día | Qué pasa | Quién | Canal | Condición |
|---|---|---|---|---|
| 0 | Resultado en pantalla + acción concreta. Si deja correo: email del plan de 30 días. Entra en GHL: etiqueta `diagnostico-completo`, `cuello-<x>`, sector, web, UTM, puntuación de señal (+40, +10 si ICP 1) | Landing (auto) | Web + Resend + GHL | siempre |
| 0 | Oportunidad en pipeline etapa **"Radiografía completada"**. Tarea para Maikel "WhatsApp día 1" con el mensaje de §2 ya relleno | GHL workflow | GHL | etiqueta |
| 1 | **Mensaje del día 1** (pregunta con número). Por WhatsApp si lo dejó; si no, por email | Agente WhatsApp (plantilla) o Maikel a mano si la API no está; email por GHL | WA / email | <24 h |
| 1 | Si contesta: **puente** (§2) → 20 min o plan por escrito. Reserva en calendario o tarea "plan 48 h" a Ventas | Agente WhatsApp (copiloto 2 semanas → autónomo) | WA | respuesta |
| 2 | Sin respuesta al WhatsApp en 24 h y teléfono publicado en su web: **agente de voz**, mismo gancho, único objetivo cuadrar 20 min | Vapi vía n8n | teléfono | sin respuesta + tel. público |
| 3 | Email "el error más común en [cuello]": un caso con número + una acción que puede hacer hoy sin nosotros | GHL workflow (copy de Ventas) | email | sin respuesta |
| 7 | Email "así lo arreglamos en [caso]" + oferta explícita del análisis por escrito | GHL workflow | email | sin respuesta |
| 7+ | Etapa **"Tibio"**, toque a los 30 días por el SDR. Sin día 14 automático | GHL | — | sin respuesta |
| cualquiera | Contesta → se para toda la secuencia, tarea "puente" si el agente está en copiloto | GHL | — | respuesta |

Puntuación: radiografía +40 · ICP 1 +10 · respuesta escrita +30 · clic +35. ≥60 → bloque de llamadas de Maikel 12:00 el mismo día.

## 2. Mensajes (borrador del cerebro; Ventas afina en `ventas/radiografia/`)

**Plantilla WhatsApp día 1** (para aprobación de Meta; variables {1} nombre, {2} cuello, {3} puntos, {4} pregunta):

> Hola {1}, soy Maikel. Vi que en la radiografía te salió {2} como cuello de botella, {3} de 100. Una pregunta rápida: {4} Si me dices el número, te digo en dos líneas cuánto es eso al año.

**Pregunta {4} por cuello:**

| Cuello | Pregunta |
|---|---|
| Captación | ¿cuántas oportunidades nuevas os entraron el mes pasado? |
| Conversión | cuando entra un formulario o un WhatsApp, ¿cuánto tarda en contestarse de media? |
| Seguimiento | ¿cuántos presupuestos del mes pasado siguen sin respuesta? |
| Dependencia | si mañana entraran 30 oportunidades, ¿cuántas se atenderían sin pasar por ti? |
| Control | ¿de qué canal salió el último cliente que firmó? El último cliente, no el último lead. |
| Ninguno | ¿qué pieza se caería primero si entrara el triple de trabajo? |

**Reacción al número** (una frase, con su dato, sin adjetivos). Ejemplo seguimiento: "Ocho presupuestos sin respuesta. Si tu ticket medio anda por los 2.000 €, son 16.000 € que ya te costaron atraer y calcular, esperando una llamada de dos minutos."

**Puente (dos salidas, las dos avanzan):**

> Con ese dato y tu ticket medio te lo pongo en un folio: cuánto se está escapando y qué haría yo primero. ¿Lo vemos en 20 minutos con tus números delante, o te lo mando por escrito?

- Elige 20 min → herramienta `agendar` (huecos reales del calendario) → "apuntado, {día} a las {hora}, te llega la invitación ahora".
- Elige por escrito → tarea a Ventas "plan 48 h" con el brief; el plan termina con la misma pregunta.
- "Ni idea" → "Es lo normal, casi nadie lo tiene. Justo por eso: ¿lo miramos en 20 minutos o prefieres que te mande cómo contarlo en una semana?"

**Email día 1 (si no dejó WhatsApp):** mismo texto que la plantilla, asunto `tu radiografía: {cuello}`.

**Email día 3** (asunto `el error más común en {cuello}`): caso del mismo cuello con número (seguimiento → Nuria 6,45×; conversión → Eleva −61 % CPL; control → Equipzilla ROAS 0,1→7,6; captación → BelloVinilo 3.600→30.000; dependencia → EAC 10,2×) + la acción concreta de la Radiografía para ese cuello + "si quieres, te digo cuánto es en tu caso: responde con el número".

**Email día 7** (asunto `cómo lo arreglamos en {caso}`): 4 líneas de qué se hizo, en qué orden, qué número cambió + "te hago el análisis por escrito de dónde se te escapa y qué arreglar primero. Sin llamada, sin compromiso. ¿Te lo mando?"

## 3. Contrato del agente de WhatsApp (mismo cerebro que el de voz)

| | |
|---|---|
| **Input** | Briefing por contacto: nombre, empresa, cargo, sector, cuello, puntos, segunda fuga, nivel, respuesta literal, historial, huecos del calendario. Fuente: GHL + resultado de la Radiografía. |
| **Proceso** | Guion cerrado de 4 movimientos: pregunta con número → reacción con una frase de valor → dos salidas → reserva o cierre. Máximo 6 mensajes por conversación. Responde en <2 min en horario 8-21; fuera, a las 8. |
| **Output** | Cita en el calendario de reuniones (con invitación) o tarea "plan 48 h" a Ventas, etapa actualizada en GHL, nota con la conversación literal. |
| **KPI** | Respuesta a plantilla (objetivo ≥30 %), conversación → reunión o plan (≥40 %), tiempo a primera respuesta (<2 min). Semanal en el scorecard: radiografías → conversaciones → reuniones. |
| **Límites** | No habla de precios ni describe el servicio; no insiste tras "ahora no"; no manda más de un mensaje sin respuesta (el día 3 y 7 van por email); no promete resultados; no llama. Si preguntan si es una persona: "soy el asistente de Maikel, me tiene para esto". |
| **Handoff a Maikel** (<2 h laborables) | Pregunta de precio, objeción fuera del guion, enfado, "quiero hablar con Maikel", cliente actual o antiguo, oportunidad ≥ nivel crítico con ICP 1. Mini-brief: empresa, cuello, número que dio, qué dijo, qué NO asumir, siguiente mejor acción. |
| **Feedback** | Cada conversación → nota en GHL + fila en el registro; el viernes, las frases literales de los prospectos van al Documento Madre y a la revisión del guion. |
| **Fases** | 1) Copiloto 2 semanas: manda la plantilla; ante respuesta, redacta y Maikel aprueba con un toque desde la bandeja de GHL. 2) Autónomo con las reglas de arriba. Parada: <10 % reuniones en 30 conversaciones o una queja → vuelve a copiloto. |
| **Stack** | n8n + API de Claude + GHL (WhatsApp Business Platform vía GHL, calendario, pipeline). Plan B: IA de conversación nativa de GHL. Dueño: Outbound (mismo cerebro y mismos workflows que el agente de voz); Automatización conecta su secuencia 3-7-14 al flujo. |

## 4. Reparto

- **Landing:** §0 (tres cambios), etapa y workflow de GHL (etiqueta → oportunidad + puntuación + tarea día 1 con mensaje relleno), emails día 1/3/7 por cuello con el copy de Ventas, eventos GA4 leídos en el Growth Review.
- **Ventas:** afinar los 7 mensajes de §2 en `ventas/radiografia/` (plantilla, 6 preguntas, reacción por cuello, puente, email 1/3/7) con los casos de la casa. Plantilla "plan por escrito 48 h" partiendo de `ventas/plantillas/`.
- **Outbound:** agente de WhatsApp (§3) sobre los workflows del agente de voz; enlace con `?l=<id>` en la variante B; puerta 2 del agente de voz = solo a las 24 h sin respuesta al WhatsApp y con teléfono publicado. Comprobar si WhatsApp está conectado en GHL y reportarlo [PARA CEREBRO].
- **Automatización:** conectar la secuencia 3-7-14 de n8n al flujo (parada al responder, tarea puente), y el reencolado hacia "Tibio".
- **Maikel:** ok al guion final, alta de WhatsApp Business en GHL si no está, y el bloque de llamadas de las 12:00 para los ≥60.
