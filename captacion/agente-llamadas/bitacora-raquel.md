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

## 19-sep-2026 · sábado

**Llamadas del día (1).** Pablo Martínez, Opoprime (formación), 10:01, 32 s: buzón. Era la primera llamada de la cadencia, 45 minutos después de entrar por el formulario de Meta.

**Lo que enseñó:**
1. **Salió desde el +1 775 de EE. UU.** El reloj no tenía el móvil de Maikel como número de origen: solo lo tenían las llamadas lanzadas a mano. Corregido: el móvil de Maikel es el origen por defecto (VAPI_PHONE_NUMBER_ID en el entorno manda).
2. **El recado del buzón seguía con el texto viejo** («te escribimos por WhatsApp»): es un ajuste aparte de Vapi (voicemailMessage), no el prompt. Cambiado a «Máikel te escribe por correo para buscar un hueco» (copia previa: `vapi-asistente-2026-09-19.json`).

**Regla fijada por Maikel (19-sep):** si el lead contesta al WhatsApp, no se le llama. El reloj ya lo hacía (mira la respuesta antes de decidir el paso); queda escrito para que no se toque.

**Cambios del sistema alrededor de Raquel, mismo día:** todo el WhatsApp sale por la pasarela (Wazzap) desde el número de Maikel; el primer mensaje es genérico y en fin de semana propone agendar el lunes; el agente de WhatsApp atiende las respuestas (pendiente de una clave válida de Anthropic); correo a Maikel por cada llamada con resumen y enlace a la grabación.

## 21-sep-2026 · lunes

**Llamadas del día (24, todas desde el móvil de Maikel):** 3 citas (Angélica 9:00 → martes 10:00; Celso 10:30 → martes 10:30; Elena 18:08 → martes 11:00), 1 «llámame más tarde» (Elena 9:00), 2 «no es el lead» con conversación (Benjamín 12:15, César 17:59), 1 cortada por falta de contexto (César 17:56), 10 buzones (Ana ×2, Pablo ×2, David ×2, Pilar, Elena, César ×2), 3 con locución de operadora + buzón (Raúl ×2, David), 4 sin conectar (Paco ×2, Marcos ×2). Coste aproximado del día: 1,65 $. Registro completo con audio en Notion «📞 Llamadas de Raquel».

**Lo que enseñó:**
1. **La locución de la operadora la engaña.** «Gracias. No cuelgues, por favor» la trata como una persona («Claro, aquí estoy»), deja el recado dos veces y luego espera 60 s de silencio: 118 s por un buzón, tres veces hoy (Raúl ×2, David).
2. **Sin contexto, el reintento se cae.** César, cuarta llamada: «la última vez que te llamo, que no quiero ser pesada» y directamente los huecos → «¿de qué tema me habla?» y se corta. Con contexto (quinta, a mano) contestó de verdad: no es el lead.
3. **No sabe qué hacer con «lo pidió un compañero» ni con «me llegó un correo de que no interesaba».** Con Benjamín repitió tres veces la pregunta de la fuga, dijo «no tengo constancia de un correo» y acabó confirmando el descarte automático. (El descarte automático se desactivó ese mismo día: los que no invierten entran en cadencia.)
4. **Lee literal la opción del formulario:** «marcaste el tema de no lo sé, eso es lo que quiero» (Celso).
5. **Pedir confirmar el dominio del correo** («el de Gmail punto com, ¿correcto?») dejó a Celso 50 s en silencio y a Raquel repitiendo el discurso del correo dos veces.
6. **Dice que la cita es telefónica** cuando es videollamada (Elena).
7. **Ofrece dos huecos del mismo día sin preguntar disponibilidad** (Angélica: «no puedo a ninguna de las dos»).
8. Siguen «un 2º», «1º», «Michael», «Cualibó/Qualibo/Quality», y «Hola, citana» por «Hola, Ana». Y «¿hablé Elena?» por «¿hablo con Elena?». El nombre compuesto «Nadia Angélica» venía así del formulario.
9. La primera llamada de los leads del domingo salió a las 9:00 en punto del lunes (Elena: «te va a venir fatal ahora»).

**Cambios aplicados al asistente** (copia previa en el scratchpad: `vapi-asistente-2026-09-21.json`; prompt nuevo en `vapi-prompt-2026-09-21-nuevo.md`):
1. Locuciones de operadora: no contestar, esperar al pitido, recado de diez segundos y colgar con endCall. Nunca esperar en silencio tras el recado.
2. Si quien coge no es quien lo lleva: preguntar nombre, si puede pasar, mejor canal y horario; no seguir con la fuga.
3. Respuestas fijas nuevas: correo de descarte («salió por un error del sistema, por eso te llamo»), agencia («tu agencia trae la gente; esto va de qué pasa después»), canal («videollamada por Meet; si prefieres teléfono, Máikel te llama»).
4. Fuga «no lo sé»: no leer la opción literal.
5. Agenda: preguntar mañana/tarde antes de leer huecos, preferir mañana o pasado a hoy; no pedir confirmar el dominio del correo.
6. Ordinales con letras («un segundo», «primero»), reforzado.

**Propuesto, no aplicado:** primera llamada de los leads de fin de semana a partir de las 9:30-10:00, no a las 9:00 en punto (cadencia); tras dos buzones el mismo día, no volver a llamar ese día (cadencia); reintentos con apertura de contexto obligatoria en `assistantOverrides.firstMessage` desde `api/activacion.js` (hoy solo se hace a mano); probar grafía «Áना» → «Hola. Ana,» para nombres de tres letras (voz).

**Regla fijada por Maikel (21-sep):** los que no invierten también se llaman («puede ser gente con dinero»); y nada que parezca envío automatizado por WhatsApp desde el 663.

## 22-sep-2026 · martes

**Llamadas del día (27; 23 reales + 4 pruebas de Maikel de la demo «prueba tu agente»).** Lead form Meta (11): 1 cita real (Noelia, 16:30, 300 s: miércoles 23 a las 17:00), 4 buzones (Ana, Rafael, Pilar CPD, Pablo ×1 más: ya van cuatro), 3 sin contestar o comunicando (Carlos, Celso, Benjamín), 1 locución de espera (Raúl), 1 colgó a los 12 s (David, tras el plantón de las 10:00), 1 sin conectar (Carmen, tercer fallo: sin canal). Base antigua (12, llamadas de reactivación de la mañana): 0 citas, 3 recados en recepción (Jorge/Otefisa, Carlos/Madom, Estela/Grupo 2000), 1 recepción que pidió un número y no lo obtuvo (Pilar Vega/CIP, 149 s), 1 «no interesa» (Eva/AYCE: preguntó si era una máquina, Raquel lo negó y colgó), 1 filtro de marketing (Ignasi), 6 cortas o sin conectar. Tres de la base antigua salieron desde el +1 775 de EE. UU. («me llama de Estados Unidos», +34711268234). Registro completo con 8 audios en Notion «📞 Llamadas de Raquel».

**Lo que enseñaron las grabaciones:**
1. **Negó ser una máquina** (Eva: «No, Eva, soy Raquel» → colgó). Con Noelia dijo «asistente virtual, como si fuera una persona real». No había respuesta fija para esto.
2. **La locución de la operadora sigue engañándola cuando llega después del saludo** («Gracias. No cuelgues, por favor»): Raúl, Rafael, Pilar CPD, Miguel Martínez, +34711268234 («claro, aquí espero»). La regla del 21-sep cubría la locución antes del saludo, no después.
3. **Menús IVR** («pulse uno…»): en la llamada a Ignasi leyó en voz alta sus propias instrucciones del guion de reactivación; con CIP y Empatif preguntó «¿hablo con…?» al menú.
4. **Tras el adiós no cuelga**: Noelia, 300 s hasta el corte por silencio (0,49 $ por una llamada de 2 minutos útiles).
5. **Base antigua con apertura de lead nuevo**: «acabas de pedir el diagnóstico… en nuestro correo de agosto» y «el diagnóstico que pidió esta mañana» (Jorge, Carlos, Eva, Estela). Nadie de esa base ha pedido nada.
6. **No sabe dar un número para devolver la llamada**: «no puedo proporcionar el número» ×2 a la recepcionista del CIP, que decía que no le salía en pantalla.
7. Pronunciación: «Kualifo/Cualibo/Qualibu» por Qualivo; «Michael/Mike/My Le/Maykel» por Máikel en la transcripción (parte es el transcriptor oyendo a la voz; hay que escuchar antes de tocar). «Un 2º» en la transcripción es cómo el transcriptor escribe «un segundo», no un fallo de Raquel.
8. Latencia: con la configuración nueva de la tarde (voz flash, nova-3, espera 0,5 s) el turno medio bajó de 3,2 s a 2,0 s en las pruebas de Maikel.

**Cambios aplicados** (copia previa en el scratchpad: `vapi-asistente-2026-09-22b.json`; prompt nuevo en `vapi-prompt-2026-09-22-nuevo.md`):
1. Respuesta fija a «¿eres una máquina / una IA / real?»: «Sí, soy la asistente de IA de Máikel. La reunión es con él, en persona. ¿Te cuadro el hueco?». Nunca negarlo, nunca «como si fuera una persona real».
2. Menús IVR: no hablar ni leer instrucciones; esperar en silencio hasta veinte segundos y colgar con endCall si sigue el menú.
3. Locución después del saludo: no decir nada más (ni «¿hablo con…?», ni «aquí espero») hasta que hable una persona o suene el pitido.
4. Tras la despedida, colgar con endCall en el acto (endCallFunctionEnabled activado en el asistente).
5. Base antigua: si el origen es el correo de agosto, nunca «acabas de pedir»; recado «Máikel le ha escrito por correo»; si ofrecen un email, aceptarlo.
6. Si el número no les sale en pantalla, dictar el de Máikel cifra a cifra (es el identificador de llamada que ya ven).
7. Por la tarde (Maikel, «me gusta»): voz `eleven_flash_v2_5`, transcriptor `nova-3`, espera 0,5 s.

**Propuesto, no aplicado:** las llamadas de reactivación de la base antigua deben salir siempre desde el móvil de Maikel, no desde el +1 775 (revisar el script de las 9:55); tras cuatro buzones (Pablo) o tres fallos de conexión (Carmen), dejar de llamar y pasar a correo; tras un plantón, no llamar en frío (David colgó a los 12 s): mejor WhatsApp con hueco nuevo; probar grafía «Cuálivo» en el prompt y escuchar si «Máikel» suena bien con la voz flash antes de tocar nada más.

## 23-sep-2026 · revisión diaria

**Llamadas del día (4, todas a leads del formulario de Meta, ninguna con conversación).**
Rafael (Ágape), 10:20, 48 s: buzón (segunda llamada de la cadencia; por la tarde
contestó a un WhatsApp y agendó el jueves 24 a las 18:00). Marian (reformas), 11:50: no
contestó. Noelia (flamenco), 17:06, 30 s: llamada de plantón lanzada a mano con saludo y
guion propios; buzón. Pilar (CPD Ceprovic), 17:50, 53 s: llamada para que entrara a la
videollamada; locución de operadora y buzón. Registro en Notion «📞 Llamadas de Raquel»
(4 filas, sin audio: no hubo conversación).

**Fallo visto:** el mensaje de buzón es un texto fijo del asistente (`voicemailMessage`)
que decía «te llamaba por el diagnóstico que has pedido… para buscar un hueco». Sonó
igual en las llamadas de plantón y de aviso de reunión, donde no encaja. El guion que se
pasa en cada llamada no afecta al buzón.

**Cambiado:** `voicemailMessage` → «Hola, soy Raquel, del equipo de Máikel Echevarría,
de Cuálivo. Te llamaba por lo del diagnóstico. Máikel te escribe por WhatsApp. Hasta
luego.» (vale para primera llamada, plantón y confirmación). La sección «Si salta el
buzón» del prompt decía otro texto y prometía correo: alineada con el mensaje real.
Copia previa en el scratchpad.

**Aclaración:** en las transcripciones aparece «Michael», pero el texto que dice Raquel
lleva «Máikel»; es Deepgram quien lo transcribe así. Para saber cómo lo pronuncia la voz
hay que escuchar el audio, no leer la transcripción.

**Hipótesis nuevas.** (1) En llamadas especiales conviene pasar también un
`voicemailMessage` propio en `assistantOverrides`. (2) En perfiles que dan clase por la
tarde, un WhatsApp con valor rinde más que la segunda llamada (Rafael: dos buzones y
agendó al WhatsApp).

**Propuesto, no aplicado:** nada de voz, modelo, número ni cadencia.

## 24-sep-2026 · revisión de las últimas 24 h

**Llamadas del día (4, todas del lead form Meta, mismo número de origen: móvil de Maikel).**
Santi (Gil Jiménez, reformas), 23-sep 19:50, 35 s: única con conversación real. Contesta,
confirma que fue él quien pidió el diagnóstico; Raquel pregunta por atribución de
campañas («¿sabes qué campaña te trajo tu último cliente?»), Santi empieza a responder
(«No, vamos a ver,») y la llamada se corta ahí (`customer-ended-call`, 0,065 $) sin llegar
a proponer cita. Cristina (Magro, formación), 24-sep 17:20, 31 s: buzón, tras dos intentos
de WhatsApp fallidos. Santi otra vez, 24-sep 19:30, 30 s: segunda llamada de la cadencia,
buzón también (misma tarde que la primera con conversación real: iba precedida de dos
WhatsApp fallidos). Marian (reformas), 24-sep 11:30: no contestó, sin transcripción.
Registro completo en Notion «📞 Llamadas de Raquel» (4 filas; audio subido en Santi 24-sep
y Cristina — Santi 23-sep se quedó sin audio por un error del lado de Notion al subir el
archivo, ver más abajo).

**Lo que enseñaron las grabaciones:**
1. **Patrón WhatsApp fallido → llamada a buzón** en 2 de los 3 leads con ficha revisada a
   fondo (Santi y Cristina): ambos tienen WhatsApp 1 y WhatsApp 2 marcados como fallidos en
   GHL antes de que la llamada de voz salte a buzón. Apunta a un problema del canal de
   WhatsApp (plantilla de Meta sin aprobar, o gateway de respaldo caído) más que a un
   problema del propio agente de voz — ver tarea abierta «WhatsApp automático: crear
   plantillas de Meta y activar el envío».
2. **La llamada de Santi con conversación real se cortó antes de pedir cita.** El guion
   fue directo a la pregunta de atribución de campañas («¿qué campaña te trajo tu último
   cliente?») en vez de ir primero a la disponibilidad; con una llamada tan corta
   (35 s), no llegó a proponer hueco. Hipótesis para revisar con más casos: adelantar la
   petición de cita antes de profundizar en atribución cuando la persona ya confirmó ser
   el lead.
3. **Sigue «Michael Echeverría» y «Cuálibo/Qualibo» en vez de «Máikel Echevarría» y
   «Qualivo»**, en las tres transcripciones con contenido (Santi ×2, Cristina), pese a que
   el prompt del asistente ya trae la instrucción explícita de escribir siempre «Máikel»
   con tilde. Es el mismo hallazgo del 17, 18, 21, 22 y 23-sep: no se puede saber por la
   transcripción si es un fallo de la voz (TTS) o del transcriptor (Deepgram) leyendo el
   texto correcto; hace falta oír la grabación de una llamada real y compararla con el
   texto exacto que se le pasó al modelo antes de tocar el prompt. **No se ha aplicado
   ningún cambio de guion, voz ni modelo hoy** — sigue sin haber evidencia sólida de que
   el problema esté en la redacción del prompt.

**Incidencia técnica (Notion, no del agente):** la subida del audio de la llamada de Santi
23-sep falló tres veces seguidas con `MemcachedCrossCellError` (error 500 del lado de
Notion) aunque los otros dos audios, de tamaño similar, subieron sin problema. La fila
quedó registrada igualmente, con transcripción y enlace a la grabación en Vapi, solo sin
el archivo de audio adjunto.

**Propuesto, no aplicado:** nada de voz, modelo, número ni cadencia — jornada de
diagnóstico únicamente.
