# Formación V7 · storyboard completo (23-nov)

- **Dirección aprobada por Maikel el 23-nov:** mezcla de escenas humanas, demostraciones del sistema y gráficos, siguiendo a Laura desde que pide información hasta la reunión con admisiones y el resultado que vuelve a la campaña.
- **Estado:** storyboard y borrador en movimiento (`formacion-v7-borrador-916.mp4`). No es montaje final. No se publica. El anuncio antiguo sigue activo y no se toca.
- **Guion:** el de la V6, sin cambios. Voz de Javier Rojas un 10 % más rápida. 56 s.

## Plano a plano · versión refinada 2 (52,4 s)

Refinada el 23-nov con el último encargo de Maikel: el agente de voz baja a 3 s y sin simular una llamada, y el tiempo recuperado va a la gestión de la cita. Guion nuevo en `guion.json`.

| # | Tiempo | Tipo | Qué se ve | Voz |
|---|---|---|---|---|
| 1 | 0-2,3 | Humano | **Laura** en el sofá con el móvil, su etiqueta, el formulario del curso y el titular. | «¿Tu escuela online ya invierte en publicidad?» |
| 2 | 2,3-4,3 | Sistema | El móvil de Laura en grande con el anuncio «Da el salto al Marketing Digital». Un dedo pulsa «Solicitar información». | «Mira cómo convertimos una solicitud…» |
| 3 | 4,3-6,5 | Sistema | El CRM en perspectiva: entra la fila de Laura con su origen. | «…en una oportunidad comercial.» |
| 4 | 6,5-9,7 | Gráfico | Tres anuncios de la campaña; el de Laura se enciende y baja hasta su ficha. | «Gestionamos tus anuncios y tus páginas de captación.» |
| 5 | 9,7-14,6 | Sistema | WhatsApp grande: una pregunta, una respuesta, y de qué anuncio viene. | «Sabemos de qué anuncio viene Laura. El sistema responde por WhatsApp, hace preguntas…» |
| 6 | 14,6-18,1 | Sistema | Pipeline: la tarjeta de Laura salta a «Conversación abierta». | «…la cualifica y actualiza su etapa automáticamente.» |
| 7 | 18,1-19,1 | Sistema | WhatsApp sin leer y sello «Sin respuesta». | «¿No responde?» |
| 8 | 19,1-25,4 | Humano | **Laura** mira el móvil que suena y contesta. Tarjeta «Llamada entrante · Raquel · Asistente virtual». Tras el narrador, saludo breve de Raquel con sonido de teléfono y subtitulado. Etiqueta «Recreación · pendiente la llamada real». | «Podemos activar un agente de voz.» · Raquel: «Hola, Laura, soy Raquel, la asistente virtual de Escuela Norte.» |
| 9 | 22,2-23,9 | Gráfico | Calendario: jueves 17:00 y «Pipeline: Reunión agendada». | «Laura reserva su reunión.» |
| 10 | 23,9-27,1 | Sistema | WhatsApp grande: confirmación del jueves a las 17:00 y, ese día a las 9:00, el recordatorio con el enlace. | «El sistema la confirma por WhatsApp, le envía recordatorios…» |
| 11 | 27,1-29,4 | Gráfico | El calendario cambia de jueves a viernes 12:00: «Agenda actualizada ✓». | «…y, si no puede asistir, la reprograma.» |
| 12 | 29,4-35,4 | Humano | La asesora de **admisiones** con la ficha de lo que Laura necesita; después «Cualificada ✓». | «Y admisiones recibe todo el contexto antes de la llamada. Y cuando la reunión se celebra y se valida…» |
| 13 | 35,4-41,7 | Gráfico | «Reunión cualificada ✓» → «Intelligence» → dos anuncios comparados: uno trae «Oportunidades cualificadas», el otro «Solo formularios». | «…utilizamos ese resultado para mejorar las campañas. No optimizamos solo por formularios.» |
| 14 | 41,7-49,2 | Gráfico | «Esto es Qualivo», las tres piezas unidas, logo y botón. | «Esto es Qualivo: captación, seguimiento y mejora continua. Solicita tu diagnóstico gratuito.» |

## Qué falta para una versión final

- **La llamada real** del agente de voz (línea caída desde el 13-nov). Hasta entonces el saludo de Raquel es una recreación con la voz del agente y lleva la etiqueta «Recreación»; hay que sustituirlo por la grabación real antes de publicar. Desde la fila 9 los tiempos de la tabla van 3,2 s más tarde.
- **Las señales de cualificación a Meta**, que Growth tiene propuestas para corregir.
- Subtítulos de toda la locución, base musical más larga (la actual se repite) y formato 4:5.
- Decidir expresamente el uso de personas generadas en el anuncio.

## Archivos

- `hacer_capas.py` genera `t.js`, `tiempos.json` y `capas.html`; `render_capas.js` saca la capa con transparencia; `montar.py` la compone sobre los planos.
- Los planos de vídeo no están en el repo.
