# Formación V7 · storyboard completo (23-nov)

- **Dirección aprobada por Maikel el 23-nov:** mezcla de escenas humanas, demostraciones del sistema y gráficos, siguiendo a Laura desde que pide información hasta la reunión con admisiones y el resultado que vuelve a la campaña.
- **Estado:** storyboard y borrador en movimiento (`formacion-v7-borrador-916.mp4`). No es montaje final. No se publica. El anuncio antiguo sigue activo y no se toca.
- **Guion:** el de la V6, sin cambios. Voz de Javier Rojas un 10 % más rápida. 56 s.

## Plano a plano

| # | Tiempo | Tipo | Qué se ve | Voz | Enlace con el siguiente |
|---|---|---|---|---|---|
| 1 | 0-2,7 | Humano | **Laura** en el sofá, al atardecer, con el móvil. Flota el formulario «Escuela Norte · Marketing Digital · Solicitar información» y la etiqueta «Laura · quiere estudiar Marketing Digital». Titular: «¿Tu escuela online ya invierte en publicidad?» | «¿Tu escuela online ya invierte en publicidad?» | Laura pulsa «Solicitar información» → corte |
| 2 | 2,7-6,5 | Humano (objeto) | Un móvil se enciende sobre el escritorio de la escuela. Salta «Nueva solicitud · Laura Vidal». Al final, «Objetivo: oportunidad comercial». | «Mira cómo convertimos una solicitud en una oportunidad comercial.» | — |
| 3 | 6,5-8,8 | Humano (objeto) | Una mano navega por el móvil; aparece nuestro anuncio «Marketing Digital online. Por las tardes». Titular: «Gestionamos tus anuncios». | «Gestionamos tus anuncios y páginas de captación…» | Se pulsa «Más información» → corte |
| 4 | 8,8-12,4 | Sistema | El CRM en perspectiva: la fila de Laura entra con su origen, «anuncio "por las tardes"». | «…para atraer solicitudes de personas interesadas en tus cursos.» | — |
| 5 | 12,4-20,8 | Sistema | WhatsApp dentro de un móvil en perspectiva, con la cámara girando. Dos preguntas y dos respuestas. Flotan «Viene de: anuncio "tardes"», «Cualificada · Nivel A» y «Etapa: conversación abierta». | «Sabemos de qué anuncio viene Laura. El sistema responde por WhatsApp, hace preguntas, la cualifica y actualiza su etapa automáticamente.» | — |
| 6 | 20,8-26,4 | Humano | El móvil de **Laura**, boca abajo en la encimera, mientras ella cocina al fondo. Sello «Sin respuesta»; después, «El sistema puede activar: agente de voz». | «¿Laura deja de responder? El sistema puede activar un agente de voz para retomar la conversación.» | Tono de llamada → corte |
| 7 | 26,4-32,6 | Humano | **Laura** coge el teléfono y contesta. Subtítulos de la conversación. Aviso «Audio pendiente de la llamada real». La música baja. | (hueco para la llamada real) | — |
| 8 | 32,6-36,7 | Gráfico | Calendario en perspectiva: se levanta el jueves a las 17:00. Flotan «Confirmación enviada ✓» y «Recordatorios ✓». | «Laura agenda una reunión. Recibe confirmación y recordatorios…» | — |
| 9 | 36,7-39,8 | Humano | La asesora de **admisiones** empieza la llamada. Etiqueta «Admisiones · Escuela Norte» y la ficha «Quiere cambiar de trabajo. Empezar cuanto antes». | «…y admisiones sabe exactamente qué necesita.» | — |
| 10 | 39,8-42,2 | Humano | El **equipo de campañas** de Qualivo frente al portátil. Etiqueta propia y el sello «Cualificada ✓». | «Y cuando la reunión se celebra y se valida…» | — |
| 11 | 42,2-48,5 | Gráfico | Panel de Qualivo Intelligence en perspectiva: el resultado de Laura sube hasta el anuncio «por las tardes», que se enciende como «oportunidad cualificada»; los otros dos quedan en «solo formularios». | «…utilizamos ese resultado para mejorar las campañas. No optimizamos solo por formularios.» | — |
| 12 | 48,5-56 | Gráfico | «Esto es Qualivo»: captación, seguimiento y mejora continua unidos por una línea. Logo, «De la solicitud a la oportunidad» y el botón. | «Esto es Qualivo: captación, seguimiento y mejora continua. Solicita tu diagnóstico gratuito.» | — |

## Reparto

- Escenas humanas: 6 planos, unos 23 s (41 %).
- Demostración del sistema: 2 planos, 12 s (21 %), más las capas de interfaz que flotan sobre los planos humanos.
- Gráficos y datos: 3 planos, 18 s (32 %), incluido el cierre.

## Los seis puntos del encargo

1. **Gancho para escuelas online:** la pregunta en el primer plano y el formulario del curso flotando junto a Laura.
2. **Humano e interfaz conectados:** Laura pulsa → salta la solicitud; se pulsa el anuncio → entra en el CRM; tono de llamada → Laura contesta.
3. **Laura reconocible:** lleva etiqueta con su nombre en sus tres planos. Admisiones y el equipo de campañas llevan etiqueta de otro color.
4. **Responde, cualifica, sigue y gestiona la reunión:** planos 4 a 9.
5. **Agente de voz con escena propia:** plano 7, con el hueco de audio.
6. **El final enseña el ciclo:** planos 10 y 11.

## Qué falta para una versión final

- **Planos sin marca de agua.** Tres planos (móvil sin contestar, equipo de campañas, mano navegando) son de HeyGen y llevan su marca; Higgsfield alcanzó su límite diario. Hay que regenerarlos.
- **La misma Laura en todos sus planos.** En el plano 6 la mujer del fondo es de otra generación; conviene regenerarlo con la Laura del plano 1 como referencia.
- **La llamada real** del agente de voz (línea caída desde el 13-nov).
- **Las señales de cualificación a Meta**, que Growth tiene propuestas para corregir.
- Subtítulos de toda la locución, base musical de más de 56 s y formato 4:5.
- Decidir expresamente el uso de personas generadas en el anuncio.

## Archivos

- `hacer_capas.py` genera `t.js`, `tiempos.json` y `capas.html`; `render_capas.js` saca la capa con transparencia; `montar.py` la compone sobre los planos.
- Los planos de vídeo no están en el repo.
