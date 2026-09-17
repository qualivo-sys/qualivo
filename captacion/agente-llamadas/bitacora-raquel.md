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

## 17-sep-2026 · dos llamadas, ninguna conversación

**Qué pasó.** 09:10, llamada a un contacto de la base antigua reactivado esa mañana
(Bigpoma): comunicaba, sin conversación. 10:10, llamada de prueba al número de Maikel:
Raquel dijo la apertura completa y esperó 45 segundos en silencio hasta que el sistema
colgó por «silence-timed-out». Es el comportamiento que tendría con un buzón de voz:
el asistente no detectaba contestadores.

**Cambios aplicados al asistente `Raquel · Landing Diagnóstico`** (copia previa en el
scratchpad: `vapi-asistente-2026-09-17.json`):
1. Detección de buzón de voz activada (proveedor Vapi). Si salta el contestador, deja
   un mensaje corto: «Hola, soy Raquel, del equipo de Máikel Echevarría, de Cuálivo.
   Te llamaba por el diagnóstico que has pedido. Te escribimos por WhatsApp para
   buscar un hueco. Hasta luego.» y cuelga.
2. Silencio máximo antes de colgar: de 45 a 25 segundos. Con la regla de nunca dejar
   más de 3 segundos sin hablar, 45 era demasiado margen.

**Pendiente de observar.** En la transcripción de la llamada de prueba «Máikel» aparece
como «Michael»; no se puede saber por el texto si es la voz o el transcriptor. Hay que
oír la grabación de la próxima llamada real antes de tocar la pronunciación.

**Nota.** El contacto de Bigpoma entró en la cadencia por una reactivación de la base
de febrero hecha el 17-sep desde otra sesión (etiquetas canal-base-antigua,
respondio-17sep). No es un lead de las campañas nuevas.
