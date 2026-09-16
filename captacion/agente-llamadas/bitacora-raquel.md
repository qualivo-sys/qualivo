# Bitácora de Raquel · mejoras sobre la marcha

Cada llamada real se revisa (transcripción, tiempos, resultado) y lo que se
aprende se aplica al asistente de Vapi el mismo día. Aquí queda el porqué de
cada cambio, para no deshacerlo sin querer. Copia del asistente antes de cada
cambio: scratchpad de la sesión (`vapi-asistente-backup-<fecha>.json`).

## 16-sep-2026 · llamada a Ziad (Manar Construcciones), 50 s, colgó él

**Qué pasó.** Cogió y dijo «sí, por favor». Raquel leyó el nombre tal cual venía
del formulario («Arq.Ziad»), preguntó «¿cuántas oportunidades tienes abiertas sin
siguiente paso?» y, cuando él contestó «no me acuerdo», estuvo 7 s en silencio,
llamó a `huecos_disponibles` sin decir nada (2,5 s más) y dijo «un momento». Colgó
a los 10 s de silencio acumulado. Latencia técnica normal (3,3 s por turno).

**Cambios aplicados al asistente `Raquel · Landing Diagnóstico`:**
1. Regla de oro: nunca llamar a una herramienta sin una frase antes.
2. Tras una respuesta de «no lo sé / no me acuerdo», contestar en el acto con la
   frase fija y anunciar «dame un segundo, que miro qué tiene libre».
3. Mensajes de relleno en las dos herramientas (`request-start`,
   `request-response-delayed` a 2,5 s, `request-failed`).
4. Si marcó «no lo sé» en el formulario: pregunta fácil («¿cómo os llegan hoy los
   clientes: recomendación, web, anuncios…?») en vez de pedir un número.
5. «Máikel» con tilde en el guion para que la voz no lo lea «Michael».
6. En `api/activacion.js`, `nombrePila()` quita títulos («Arq.», «Dr.», «Sra.»)
   antes de pasar el nombre al agente.

**Pendiente de observar:** si la pronunciación de «Máikel» queda natural; si la
segunda llamada del día siguiente conviene cuando la primera la colgó la persona.
