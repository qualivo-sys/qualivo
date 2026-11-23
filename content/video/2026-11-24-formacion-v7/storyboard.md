# Formación V7 · storyboard completo (23-nov)

- **Dirección aprobada por Maikel el 23-nov:** mezcla de escenas humanas, demostraciones del sistema y gráficos, siguiendo a Laura desde que pide información hasta la reunión con admisiones y el resultado que vuelve a la campaña.
- **Estado:** storyboard y borrador en movimiento (`formacion-v7-borrador-916.mp4`). No es montaje final. No se publica. El anuncio antiguo sigue activo y no se toca.
- **Guion:** el de la V6, sin cambios. Voz de Javier Rojas un 10 % más rápida. 56 s.

## Plano a plano · versión refinada (52,7 s)

Refinada el 23-nov con los cinco cambios de Maikel: inicio conectado, sin planos genéricos, WhatsApp más cerca, llamada más evidente y la señal a Meta con más protagonismo.

| # | Tiempo | Tipo | Qué se ve | Voz |
|---|---|---|---|---|
| 1 | 0-2,3 | Humano | **Laura** en el sofá con el móvil. Etiqueta «Laura · quiere estudiar Marketing Digital», formulario del curso flotando y el titular «¿Tu escuela online ya invierte en publicidad?». | «¿Tu escuela online ya invierte en publicidad?» |
| 2 | 2,3-4,3 | Sistema | El móvil de Laura en grande: el anuncio «Marketing Digital online. Por las tardes». Un dedo pulsa «Solicitar información». | «Mira cómo convertimos una solicitud…» |
| 3 | 4,3-6,5 | Sistema | El CRM en perspectiva: la fila de Laura entra con su origen. | «…en una oportunidad comercial.» |
| 4 | 6,5-9,7 | Gráfico | Tres anuncios de la campaña de Meta; «por las tardes» se enciende y baja hasta la ficha de Laura. | «Gestionamos tus anuncios y tus páginas de captación.» |
| 5 | 9,7-14,6 | Sistema | WhatsApp en un móvil grande y cercano: una pregunta, una respuesta. Flota «Viene de: anuncio "por las tardes"». | «Sabemos de qué anuncio viene Laura. El sistema responde por WhatsApp, hace preguntas…» |
| 6 | 14,6-18,1 | Sistema | Pipeline en perspectiva: la tarjeta de Laura salta a «Conversación abierta». Titular «Interesada. Cualificada.». | «…la cualifica y actualiza su etapa automáticamente.» |
| 7 | 18,1-23,6 | Humano | El móvil de **Laura** boca abajo en la cocina. «Sin respuesta» y «El sistema puede activar: agente de voz». | «¿Laura deja de responder? El sistema puede activar un agente de voz para retomar la conversación.» |
| 8 | 23,6-26,7 | Humano | **Laura** contesta. Subtítulos del saludo de Raquel y de su respuesta. Aviso de audio pendiente. | (hueco para la llamada real) |
| 9 | 26,7-29,4 | Sistema | Interfaz de Raquel, asistente virtual: onda de voz, su propuesta de reservar y la etapa «Interesada en agendar». | (hueco para la llamada real) |
| 10 | 29,4-33,5 | Gráfico | Calendario: jueves a las 17:00, confirmación y recordatorios. | «Laura agenda una reunión. Recibe confirmación y recordatorios…» |
| 11 | 33,5-36,6 | Humano | La asesora de **admisiones** empieza la reunión, con la ficha de lo que Laura necesita. | «…y admisiones sabe exactamente qué necesita.» |
| 12 | 36,6-39 | Humano | El **equipo de campañas** valida: «Cualificada ✓». | «Y cuando la reunión se celebra y se valida…» |
| 13 | 39-45,3 | Gráfico | «Reunión cualificada ✓» → «Intelligence» → «Meta Ads · anuncio "por las tardes"», unidos por conductos con pulsos que suben; la campaña se enciende. Titular «No solo por formularios». | «…utilizamos ese resultado para mejorar las campañas. No optimizamos solo por formularios.» |
| 14 | 45,3-52,7 | Gráfico | «Esto es Qualivo» con las tres piezas unidas; logo y botón. | «Esto es Qualivo: captación, seguimiento y mejora continua. Solicita tu diagnóstico gratuito.» |

## Los seis puntos del encargo

1. **Gancho para escuelas online:** la pregunta en el primer plano y el formulario del curso flotando junto a Laura.
2. **Humano e interfaz conectados:** Laura pulsa → salta la solicitud; se pulsa el anuncio → entra en el CRM; tono de llamada → Laura contesta.
3. **Laura reconocible:** lleva etiqueta con su nombre en sus tres planos. Admisiones y el equipo de campañas llevan etiqueta de otro color.
4. **Responde, cualifica, sigue y gestiona la reunión:** planos 4 a 9.
5. **Agente de voz con escena propia:** plano 7, con el hueco de audio.
6. **El final enseña el ciclo:** planos 10 y 11.

## Qué falta para una versión final

- **Planos sin marca de agua.** Dos planos (móvil sin contestar y equipo de campañas) son de HeyGen y llevan su marca; Higgsfield alcanzó su límite diario. Hay que regenerarlos.
- **La misma Laura en todos sus planos.** En el plano 7 la mujer del fondo es de otra generación; conviene regenerarlo con la Laura del plano 1 como referencia.
- **La llamada real** del agente de voz (línea caída desde el 13-nov).
- **Las señales de cualificación a Meta**, que Growth tiene propuestas para corregir.
- Subtítulos de toda la locución, base musical de más de 56 s y formato 4:5.
- Decidir expresamente el uso de personas generadas en el anuncio.

## Archivos

- `hacer_capas.py` genera `t.js`, `tiempos.json` y `capas.html`; `render_capas.js` saca la capa con transparencia; `montar.py` la compone sobre los planos.
- Los planos de vídeo no están en el repo.
