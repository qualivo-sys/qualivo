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

## 18-sep-2026 · mañana

- **Número de origen.** Confirmado que todas las llamadas salían desde +1 775 363 8742 (Twilio EE. UU., «provisional» desde el 9-sep). Twilio ha rechazado tres veces el alta de un móvil español (bundles v1-v3, código 18001 en DNI y factura). Los dos números verificados como identificador en Twilio (+34 663 375 205 y +34 647 118 491) sí sirven como origen por la troncal SIP: probado con el móvil de Maikel, llamada completada. Vapi acepta el 663 pero rechaza el 647 («Couldn't Create Phone Number»); pendiente de saber si está en otra cuenta de Vapi. Hoy las llamadas reales salen con el móvil de Maikel (phoneNumberId 2f99f0e4-…), decisión de Maikel.
- **Agenda.** GHL rechazaba toda cita con «Selected slot duration is not a valid duration option» porque el calendario está en huecos de 30 min y api/agendar.js creaba citas de 15. Raquel decía «el hueco ya no está disponible». Corregido: se lee la duración del calendario. Primera cita real cerrada por Raquel: Grupo Rumy (Cristian), hoy 12:00.
- **Prompt.** Números con letras, no leer el correo entero (solo el dominio, variable email_dominio), «en el anuncio de reformas» en vez de «en el anuncio del diagnóstico», nombre «Máikel». Resúmenes y datos estructurados en castellano activados en Vapi (analysisPlan).
- **Registro.** Cada llamada deja nota en el contacto de GHL (vapi-fin.js) y va a la base de Notion «📞 Llamadas de Raquel» con transcripción, audio e hipótesis. Backfill de 32 llamadas hecho a mano.
- **Trato.** Un trato ya no retrocede de etapa (vapi-fin devolvía «Reunión agendada» a «Conversación abierta»).
- Pendiente: pronunciación de «Maikel» y «Qualivo» (probar grafías con la voz), no repetir el saludo cuando coge otra persona, rellenar el silencio de la agenda, bajar un punto la velocidad.

## 18-sep-2026 · tarde

**Llamadas del día (9).** Tres pruebas de Maikel (09:20, 09:24, 09:32). Cesar / Cristian, Grupo Rumy, 09:35 (149 s): primera cita real, hoy 12:00. Jordi, Bigpoma, 11:00: buzón. Grupo Rumy 12:06 (59 s): plantón de la reunión de las 12:00, Raquel llama con guion de plantón, coge una persona de la oficina y dice que avisa al encargado; tres minutos después escriben por WhatsApp pidiendo reprogramar. TALKUAL 12:28 (150 s): centralita, buscando a Betlem; la compañera pide nombre y correo para el recado, se pone a anotar y Raquel cuelga por tiempo de silencio con el recado a medias (Betlem contestó por correo esa tarde: reunión jueves 24, 11:00). Francisco, Zenda Seguros, 13:33 y Carmen, Tec, 18:42: no conectaron (Twilio «failed» a los 0 s; otros Vodafone sí entran, así que son números inactivos; los dos con WhatsApp «undeliverable»).

**Lo que enseñaron las grabaciones** (en Notion, con audio):
1. Silencio de 25 s: en una centralita, con esperas y gente escribiendo, Raquel cuelga antes de tiempo (TALKUAL).
2. En números de empresa suelta el motivo a quien coge, sin preguntar con quién habla (Rumy 12:06, TALKUAL).
3. Si le cortan el saludo, vuelve a empezar desde el principio, dos y tres veces (Rumy 12:06, TALKUAL).
4. Deletrea correos cuando se los piden, y los destroza («bettlem dot antuneid a tal cual foods»); y presenta el número de Maikel como suyo («para que me contacte»).
5. El recado del buzón promete WhatsApp a quien el WhatsApp no le llega (Jordi, act-por-sms).
6. El calendario tenía «reservar con 3 días de antelación» contando fines de semana: un viernes por la tarde solo ofrecía hoy. Cambiado a 14 días hábiles (afectaba a Raquel, a la web y al agente de WhatsApp).
7. Nombres catalanes: «Betlem Antúnez» salió como Bethle Mantúnez, Beldemi, Bettleman Túnez. Y siguen «Michael» y «Cualibo/Coalibo».

**Cambios aplicados al asistente** (copia previa en el scratchpad: `vapi-asistente-2026-09-18b.json`):
1. Silencio máximo antes de colgar: de 25 a 60 segundos (aplicado a las 12:31, tras la llamada de TALKUAL).
2. Prompt, apertura: si coge otra persona, pregunta «¿hablo con {{nombre}}?», pide que le pasen, y si no está deja recado «Máikel le escribe por correo» sin explicar nada; si le cortan el saludo, retoma donde estaba en vez de repetirlo.
3. Prompt, buzón de voz: diez segundos, «Máikel te escribe por correo», sin prometer WhatsApp ni otra llamada.
4. Prompt, cómo hablas: nunca deletrear correos, tampoco para un recado («Máikel le ha escrito por correo»); el número desde el que llama es el de Máikel («este mismo, que es el de Máikel»), nunca «para que me contacte».
5. Prompt, agenda: «el calendario pide dos horas de aviso y no abre fines de semana» (antes decía un día).

**Propuesto, no aplicado** (voz/número/cadencia): la segunda llamada de la cadencia (voz2) sigue saliendo desde el +1 775 (Jordi la recibió dos veces desde EE. UU.); grafía fonética para nombres poco comunes o usar solo el nombre de pila; probar grafías de «Máikel» y «Cuálivo» con la voz. Regla «sin canal» (WhatsApp undeliverable + llamada a 0 s = parar llamadas, solo correo, avisar): pendiente del ok de Maikel.
