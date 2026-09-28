# Nurturing por correo · formación · v2 (27-sep-2026, empieza al entrar)

Estado: **borrador para aprobar**. No hay nada encendido.

## A quién le llega y cuándo

**Cambio del 27-sep (Maikel): el nurturing empieza en el primer momento**, en paralelo
con el WhatsApp, no cuando termina. Para que no se pisen, el correo nunca sale el mismo
día que un WhatsApp de la cadencia (día 0 va 15 minutos después del primer WhatsApp y
con otro papel: preparar la llamada, no pedirla).

| Día | Correo | Mientras tanto por WhatsApp |
|---|---|---|
| 0 (15 min tras entrar) | 0 · Bienvenida y qué vamos a mirar | Primer WhatsApp IA |
| 2 | 1 · Lo que pasa en la primera hora | (día 1: WhatsApp de conversación) |
| 5 | 2 · El caso EAC | (día 3: agenda) |
| 8 | 3 · Tu cifra en tres minutos | cadencia cerrada el día 7 |
| 12 | 4 · 23:04, 23:05, 9:00 | |
| 20 | 5 · ¿Lo dejamos aquí? | |

A todos los contactos del formulario con correo (A, B, C y D). Se para en cuanto
contesta por cualquier canal, reserva o pide la baja; si reserva, deja de recibir
nurturing y recibe solo la confirmación y el recordatorio. Quien contesta al correo
vuelve al copiloto: el borrador le llega a Maikel.

Remitente: Maikel Echevarría <maikel@qualivo.io>. Sin plantilla de boletín, un solo
enlace por correo, firma corta y línea de baja.

**Maquetación (28-sep):** versión HTML ligera en `content/nurturing/correo/` (`formacion-0.html` … `formacion-5.html`, apta para correo: tablas, estilos en línea, fondos con bgcolor). Parece un correo personal de Maikel, no un boletín: tarjeta blanca con filete turquesa, una caja lila o una franja de cifras por correo para lo que se tiene que ver de un vistazo, enlace en texto y firma con foto. Vista previa de los seis en `content/nurturing/correo/vista-previa.html`. Se regenera con `python3 content/nurturing/correo/generar.py`. Cambios de texto al maquetar: el correo 2 ya no dice «lo que me contaste» (le llega también a quien no ha hablado con nadie) y el 4 deja un solo enlace (el vídeo), y para la llamada se pide que responda al correo.

Medición: etiquetas `nut-0` … `nut-5` al enviar, y apertura y clic por correo. Así se ve
qué correo precede a cada reunión, aparte de lo que traen WhatsApp y Raquel.

Variables: `{{nombre}}`, `{{empresa}}` (si no hay, la frase se reescribe sin ella).

---

## 0 · Día 0 · Bienvenida

**Asunto:** lo que vamos a mirar en {{empresa}}

Hola {{nombre}}:

Soy Maikel, de Qualivo. Gracias por pedir el diagnóstico. Te acabo de escribir por
WhatsApp para buscar un hueco; te dejo aquí lo que vamos a hacer, para que sepas qué
esperar.

En 15 minutos dibujamos vuestro recorrido, desde que alguien pide información hasta que
se matricula, y vemos dónde se están quedando alumnos por el camino. Si tiene sentido, te
enseño cómo lo resolveríamos en vuestro caso. Si no lo tiene, te lo digo igual.

Una cosa que ayuda mucho: si puedes, ven con un dato, cuántas solicitudes os llegaron el
mes pasado. Con eso ya sale una cifra.

Si prefieres elegir tú la hora: qualivo.io/llamada

Maikel
Qualivo · qualivo.io

_Si prefieres que no te escriba más, respóndeme «baja» y listo._

---

## 1 · Día 2 · «Lo que pasa en la primera hora»

**Asunto:** lo que pasa en la primera hora

Hola {{nombre}}:

Te escribo una sola idea, por si te sirve aunque no hablemos.

Un estudio de Harvard Business Review sobre más de 2.000 empresas vio que quien responde
a una solicitud en la primera hora tiene casi siete veces más probabilidades de
cualificarla que quien tarda algo más. En formación se nota todavía más: quien pide
información de un curso suele pedirla en dos o tres sitios a la vez, y se queda con el
primero que le contesta con sentido.

Una prueba que puedes hacer mañana: mira las diez últimas solicitudes y apunta cuánto
tardó alguien en contestar a cada una. Si alguna pasó la noche o el fin de semana sin
respuesta, ahí hay matrículas.

Si quieres, te digo cómo lo arreglaríamos en {{empresa}} sin contratar a nadie.

Maikel
Qualivo · qualivo.io

_Si prefieres que no te escriba más, respóndeme «baja» y listo._

---

## 2 · Día 5 · Un caso real

**Asunto:** 559 interesados, 10 matrículas y qué cambió

Hola {{nombre}}:

Te cuento un caso de formación, por si se parece al vuestro.

Una escuela aeronáutica de Cataluña invertía en Meta, Google y TikTok para tres cursos
muy distintos. Tenían interesados de sobra, pero no sabían qué anuncio acababa en
matrícula y cuál solo traía curiosos.

Unimos cada anuncio con lo que pasaba después: interesado, entrevista, matrícula. En un
mes: 559 interesados, 68 entrevistas, 10 matrículas y 44.000 € atribuidos, unas diez
veces lo invertido. Lo más útil no fue el número, fue poder apagar lo que no vendía.

El caso completo, si te apetece: qualivo.io/casos/eac/

Maikel

_Si prefieres que no te escriba más, respóndeme «baja» y listo._

---

## 3 · Día 8 · Su cifra en tres minutos

**Asunto:** ¿cuánto se os queda por el camino?

Hola {{nombre}}:

Casi nadie sabe cuánto pierde entre que alguien pide información y se matricula. Lo
he convertido en una calculadora de tres minutos: respondes nueve preguntas (cuántas
solicitudes, cuánto tardáis en contestar, qué pasa con el que dice «me lo pienso») y te
da la cifra al mes, con el cálculo a la vista.

qualivo.io/intelligence/diagnostico/?sector=formacion

No te pide correo ni teléfono. Si la cifra te sorprende, contéstame con ella y te digo
por dónde empezaría.

Maikel

_Si prefieres que no te escriba más, respóndeme «baja» y listo._

---

## 4 · Día 12 · Cómo funciona por dentro

**Asunto:** 23:04, 23:05, 9:00

Hola {{nombre}}:

Un alumno pide información a las 23:04. A las 23:05 ya tiene respuesta, con su nombre
y sobre el curso que preguntó. A las 9:00 le llamamos. Y la persona de admisiones solo
entra cuando ese alumno está listo para hablar, con la conversación resumida.

Así funciona, en 16 segundos: {{enlace_video}}

Esto no sustituye a tu equipo ni a tu agencia. Hace lo repetitivo (contestar al
momento, recordar, volver a escribir al que se lo piensa) y les pasa a ellos lo que
vende.

Si quieres verlo con los datos de {{empresa}}, son 15 minutos: responde a este correo
y te propongo hora.

Maikel

_Si prefieres que no te escriba más, respóndeme «baja» y listo._

---

## 5 · Día 20 · ¿Lo dejamos aquí?

**Asunto:** ¿lo dejamos aquí?

Hola {{nombre}}:

No quiero llenarte la bandeja, así que te pregunto directamente: ¿mejorar cómo
respondéis y seguís a los interesados es algo que queréis mover en los próximos meses,
o ahora mismo no toca?

Con una palabra me vale:

- «Ahora»: te propongo dos huecos para vernos esta semana.
- «Más adelante»: dime cuándo y te escribo entonces, no antes.
- «No»: te borro de mi lista y tan amigos.

Maikel

---

## Variante clínicas (cuando se reactive el conjunto)

Mismo esquema, cambiando:

1. «Pacientes que preguntan por un tratamiento y se quedan con la primera clínica que
   contesta».
2. El caso de Nuria Roure: 2.000 € invertidos, 12.900 € en ventas atribuidas (6,45×),
   «mismo tráfico, sistema distinto» (qualivo.io/casos/nuria-roure/).
3. Diagnóstico con `?sector=clinica`.
4. «Una paciente escribe a las 22:00 por implantes…».
5. Igual.

## Fuentes

- HBR, «The Short Life of Online Sales Leads» (2011): respuesta en la primera hora,
  casi 7 veces más probabilidad de cualificar.
- EAC: qualivo.io/casos/eac/ (559 interesados, 68 entrevistas, 10 matrículas, 44.000 €,
  10,2×).
- Nuria Roure: qualivo.io/casos/nuria-roure/ (2.000 € → 12.900 €, 6,45×).
