# Revisión · Qualivo Master Reviewer · piezas de plantones (24-sep-2026)

> Tres piezas: carrusel «Te han dado plantón» (8 láminas y pie de foto), guía
> que se manda a quien comenta GUÍA y newsletter propuesta para el 25-sep.
> Revisadas en su estado del commit `766395d` (24-sep, 10:37). Formato del
> prompt del 22-sep, guía de voz (con la regla del 22-sep: nada de lemas ni
> rótulos que suenen a máquina) y guía de carruseles. La tabla resumen está al
> final.

## Lo que dicen las fuentes, tal cual

- **Brief §1.4.5:** «Recordatorio a las 9:00 del día con "esto es lo que
  veremos", y la víspera a las 18:00 si se reservó con dos o más días».
  **§1.5:** «Recordatorio de cita sin confirmación ni liberación de hueco».
  **§4.4:** «el recordatorio de las 9:00 no las rescata».
- **Brief §3:** «Citas de leads de pago: 9; plantones: 5», semana del 18 al 22
  de septiembre. **Regla de Maikel del 24-sep: no se publica.** Comprobado: no
  aparece en ningún texto publicable de las tres piezas (sí en el README del
  carrusel y en la nota interna de fuentes de la newsletter, que no se publican).
- **Brief §1.5, §5.1 y §6:** precio antes de reservar y confirmación la víspera
  con hueco que se libera son **hipótesis y decisiones pendientes de Maikel**
  («sí o no»), no pruebas en marcha.
- **Bitácora, 18-sep tarde:** «Grupo Rumy 12:06 (59 s): plantón de la reunión
  de las 12:00, Raquel llama con guion de plantón, **coge una persona de la
  oficina** y dice que avisa al encargado; tres minutos después **escriben**
  por WhatsApp pidiendo reprogramar». No hay cita literal de lo que dijo Raquel.
  No dice si la llamada salió sola o la lanzó Maikel. La cita se había reservado
  ese mismo día a las 09:35.
- **Bitácora, 22-sep:** «1 colgó a los 12 s (David, tras el plantón de las
  10:00)»; en propuestas, no aplicado: «tras un plantón, no llamar en frío
  (David colgó a los 12 s): mejor WhatsApp con hueco nuevo». **No consta la
  hora de esa llamada.**
- **«te he esperado»** existe, pero es el asunto del primer correo de la
  secuencia de plantón (`api/_secuencias.js`, `noshow-1`, días 0, 2 y 6), no
  una frase de la llamada.
- **«47 correos, 12 llamadas, 3 reuniones y dos incendios»:** hipérbole de
  Maikel. Se acepta; se señala dónde puede leerse como cifra real.
- **Nombres de persona o empresa:** ninguno en las tres piezas (ni Rumy, ni
  David, ni Raquel). Bien. Solo @maikel.echevarria, Maikel y qualivo.io.

---

# PIEZA 1 · Carrusel «Te han dado plantón» (8 láminas y pie de foto)

`content/carruseles/2026-09-24-plantones/`

# Nota Global (1-10)

**7**

# Resumen Ejecutivo

El esqueleto de Maikel funciona: portada con tensión, cinco motivos con su
arreglo, un sexto que da la vuelta («el problema eres tú, después del
plantón»), resumen y una sola acción (comenta GUÍA). Es útil, se reconoce en
un segundo y lleva a una conversación, que es el primer paso hacia un
diagnóstico. El tono es de persona, no de agencia, casi en todas las láminas.

Falla en tres cosas, todas de frase: (1) el caso del 18-sep está contado en el
pie de foto con más de lo que dice la bitácora (la IA «le llamó» y él «me
escribió», cuando cogió la oficina; en LinkedIn, además, una cita literal que
no existe); (2) la lámina 4 promete que un recordatorio recupera reuniones,
cuando nuestro propio recordatorio no rescató ninguna; (3) la lámina 8 usa la
construcción prohibida «no es X: es Y» y va sobrecargada. Además, todas las
láminas de la 2 a la 8 pasan de 40 palabras (66 a 99) y el cuadro «Qué hacer»
está a 32 px.

# Lo Mejor

- Portada: «Te han dado plantón.» Una escena que cualquier dueño ha vivido, en
  tres palabras, sin lema.
- El giro de la lámina 7: después de cinco motivos del cliente, el sexto es lo
  que haces tú. Es el punto «hostia, esto tiene sentido» y lleva al dato propio.
- El dato propio de la lámina 7 está bien contado y es verdad: «plantón a las
  12:00, llamada a las 12:06, y a los tres minutos me escribieron pidiendo otra
  hora» (plural, como la bitácora).
- Frases con voz: «Vale. ¿Y para qué?», «El lunes estaba motivado. El viernes
  ya no tanto», «Puede que no cancele. Puede que simplemente no aparezca».
- CTA único y coherente con lo que se entrega (la guía existe y trae lo que
  promete).
- Continuidad visual impecable: barra de progreso, numeración 1/8 a 8/8,
  «Pasa →» en todas menos la última, paleta y rejilla de casa.

# Lo Más Débil

- La lámina 4 dice lo contrario de lo que nos pasó con el recordatorio.
- El pie de foto cambia quién cogió y quién escribió el 18-sep.
- La lámina 8: 99 palabras, título a 72 px, cuerpo a 31 px, siete motivos en
  una lista cuando el CTA habla de cinco, y «El proceso era un lío», que no
  aparece en ninguna lámina anterior.
- Ninguna lámina de la 2 a la 8 tiene imagen ni gráfico (regla 5 de la guía de
  carruseles). Es un carrusel de texto.

# Problemas Críticos Detectados

**C1 · Pie de foto de Instagram, caso del 18-sep (claim que la fuente no dice).**
La bitácora dice que cogió una persona de la oficina y que tres minutos después
«escriben». El pie dice que la IA «le llamó» a él y que él «me escribió».
«Un cliente» además sugiere que era cliente de pago.

- Falla: «El 18 de septiembre un cliente no apareció a las 12:00. A las 12:06
  le llamó mi comercial IA con otro guion, y a los tres minutos me escribió
  pidiendo otra hora.»
- Propuesta: «El 18 de septiembre una empresa que había reservado conmigo no
  apareció a las 12:00. A las 12:06 mi comercial IA llamó a su oficina con un
  guion de plantón. Cogió un compañero, y a los tres minutos me escribieron
  pidiendo otra hora.»

**C2 · Pie de foto de LinkedIn, cita literal inventada y mismo cambio de
sujeto.** «te he esperado, ¿te viene mejor otro día?» no está en la bitácora;
«te he esperado» es el asunto del correo de plantón, no lo que dijo la llamada.
Y no se lo pudo decir a él: cogió la oficina.

- Falla: «El 18 de septiembre un cliente no apareció a las 12:00. A las 12:06
  le llamó mi comercial IA con otro guion: «te he esperado, ¿te viene mejor
  otro día?». A los tres minutos me escribió pidiendo otra hora.»
- Propuesta: «El 18 de septiembre una empresa que había reservado conmigo no
  apareció a las 12:00. A las 12:06 mi comercial IA llamó a su oficina con un
  guion de plantón, no de venta. Cogió un compañero, y a los tres minutos me
  escribieron pidiendo otra hora.»

**C3 · Lámina 4, claim sin respaldo que contradice el dato de casa.** El
recordatorio de las 9:00 «no las rescata» (brief §4.4) y la guía dice que un
recordatorio que no pide nada «confirma las citas que iban a pasar de todas
formas». Las dos piezas se contradicen.

- Falla: «Un recordatorio pequeño recupera reuniones que dabas por perdidas.»
- Propuesta: «Un recordatorio que pide respuesta te avisa a tiempo de quién no
  va a venir.»

**C4 · Lámina 8, construcción prohibida («no se trata de X sino de Y»,
guía de carruseles §6) que además suena a plantilla.**

- Falla: «Lo importante no es que nadie te dé plantón: es entender por qué
  pasa y montar un sistema que lo reduzca.»
- Propuesta: «Plantones va a haber siempre. Lo que sí puedes es saber por qué
  pasan y montar un sistema que los reduzca.»

# Qué Eliminaría

- Lámina 7: el rótulo «Y hay otro problema» encima del titular (regla del 22-sep:
  sin etiquetas de sección). Que lo diga el titular: «Y cuando te da plantón,
  no haces nada.»
- Lámina 8: «El proceso era un lío» de la lista. No es un motivo que se haya
  contado; es la conclusión, y ya la dice el párrafo. Deja la lista en seis
  (los cinco y «Nadie hizo seguimiento») para que cuadre con la lámina 7.
- Lámina 6: «Cuanta menos incertidumbre, menos fricción.» Suena a consultora
  («fricción») y no añade nada a la frase anterior. Si se quiere cerrar con
  algo: «Cuantas menos dudas lleve, más fácil que venga.»
- Lámina 1: el `<br>` del cuadro deja «hora, no aparece.» colgando; con la foto
  nueva conviene revisar el corte.

# Qué Simplificaría

Todas las láminas de la 2 a la 8 pasan de 40 palabras (L2 71, L3 79, L4 70,
L5 66, L6 64, L7 86, L8 99). Sin tocar el esqueleto, recortes de frase:

- L2: «Y tu reunión desaparece de su radar.» → «Y tu reunión se le va de la
  cabeza.» (menos tópico). «una reunión de cuarenta y cinco» → «una reunión de
  cuarenta y cinco minutos» (hoy se lee cortado).
- L3: «la reunión no vale lo suficiente como para aparecer» → «no le compensa
  aparecer».
- L4: «Y si tiene sentido, la pregunta:» → «Y una pregunta que pida respuesta:».
- L7: «Todavía puedes recuperar esa reunión. A mí me pasó el 18 de septiembre:»
  → «Todavía estás a tiempo. El 18 de septiembre:».
- L8: con C4 y sin «El proceso era un lío» baja a unas 80 palabras. Para
  llegar a 40, quitar el párrafo entero y dejar título, lista y CTA: la lista
  ya es el resumen y el CTA ya dice «revisar tu proceso».
- Numeración: «Motivo 1» encima del titular es otro rótulo. Si se quiere
  mantener el número (es parte del esqueleto de Maikel), dentro del titular:
  «1. No tenía tiempo.»

# Qué Reforzaría

- **El protocolo con la prueba.** La lámina 7 recomienda «A los cinco minutos,
  WhatsApp. A los quince, llamada», y el caso que se cuenta justo encima es una
  llamada a los seis minutos que acabó en WhatsApp. Quien lo lea atento lo
  verá. Propuesta de frase: «A los cinco minutos, llamada con guion de plantón.
  Si no coge, WhatsApp. Después, seguimiento que salga solo.» (O al revés, pero
  que el caso y la regla digan lo mismo.)
- **Lámina 7 como pantalla.** Es la única prueba propia del carrusel y va en
  texto. Una línea de tiempo simple («12:00 plantón · 12:06 llamada · 3 min
  después, WhatsApp pidiendo otra hora») la haría la lámina que se guarda. Sin
  poner «12:09»: la fuente dice «tres minutos después», no la hora.
- **Pie de Instagram:** «con otro guion» no se entiende sin contexto. «Con un
  guion de plantón, no de venta» (ya en C1) lo explica en cuatro palabras.
- **LinkedIn:** «tenía dudas que no me contó» → «que no te contó» (el resto del
  texto habla en segunda persona).

# Riesgos

- Publicar C1 o C2 tal cual: si alguien de esa empresa lo lee, sabe que no fue
  así. Y la cita literal no la dijo nadie.
- La lámina 4 contra la guía: quien comente GUÍA recibe un documento que dice
  lo contrario que el carrusel.
- «47 correos, 12 llamadas, 3 reuniones»: en cifras, con número exacto,
  puede leerse como dato. En la lámina 4 lo salva «y dos incendios» (se ve que
  es broma). Se acepta; si se quiere blindar, en letras: «cuarenta correos,
  doce llamadas, tres reuniones y dos incendios».
- El caso del 18-sep era una cita reservada a las 09:35 para las 12:00. Si se
  usa en otra pieza para ilustrar «acorta el tiempo» (lámina 5), no sirve:
  había dos horas y media y aun así no vino.
- Etiquetas de sección en todas las láminas («Motivo N», «Qué hacer», «Y hay
  otro problema») contra la regla del 22-sep. Si son de Maikel, que lo decida
  él; «Y hay otro problema» es la que más se nota.

# Impacto Esperado

Buen carrusel para guardar y comentar: es una lista útil con arreglo concreto
por punto. El CTA «comenta GUÍA» abre conversaciones por mensaje directo, que
es la primera métrica que mueve pilotos. El paso siguiente (guía → diagnóstico
de quince minutos) está en la guía, no en el carrusel, y está bien así. No
pongo número de comentarios esperado: no hay dato propio de carruseles con CTA
de palabra clave para compararlo.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- **Portada (solo encaje del texto, la foto se cambia):** titular a 150 px en
  el tercio superior, se lee en un segundo. El cuadro negro de abajo (31 px)
  tapa la mitad inferior de la imagen, justo donde estaba la pantalla vacía de
  la videollamada, que es lo que cuenta la escena. Con la foto nueva, el
  elemento clave (pantalla vacía, reloj) tiene que quedar entre el titular y el
  cuadro, no debajo. Subir el cuadro a 34 px si cabe.
- **Jerarquía:** titular 82 px en Anton, cuerpo 34 px, cuadro «Qué hacer» a
  32 px (por debajo del mínimo de 34 de la guía). Lámina 8 a 72 / 31 / 30 px:
  la más importante es la más apretada.
- **Aire:** en las láminas 2 a 6 quedan unos 250 px vacíos abajo. Hay sitio de
  sobra para subir el cuadro a 34-36 px sin tocar el texto.
- **Imagen o gráfico por lámina:** ninguno de la 2 a la 8 (regla 5). Mínimo, la
  línea de tiempo de la lámina 7.
- **Ritmo y continuidad:** barra que crece, numeración, «Pasa →», misma
  rejilla. Cumple la regla 8. La lista con «✗» de la lámina 8 se lee bien,
  aunque la cruz sugiere «error del cliente», que es justo lo que el titular
  niega; un número (1-6) casa mejor con el mensaje.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook:** bueno. Escena reconocible y una pregunta («¿por qué no ha
  venido?») que abre el circuito.
- **Claridad:** alta. Cada motivo, un problema y un arreglo. Se entiende sin
  releer.
- **Credibilidad:** el dato propio de la lámina 7 es exacto. Pierden
  credibilidad C1, C2 y C3.
- **Frases que suenan a máquina o a agencia:** «Lo importante no es...: es...»
  (L8, C4), «Cuanta menos incertidumbre, menos fricción» (L6), «desaparece de su
  radar» (L2, tópico). En el límite, pero con voz: «No vendas la reunión. Vende
  lo que se lleva de la reunión» (L3). Se queda.
- **CTA:** una sola acción, clara, coherente con lo que se entrega. Bien.
- **Pie de foto:** estructura correcta (gancho, un párrafo, una acción, cuatro
  etiquetas en Instagram, ninguna en LinkedIn). Solo fallan C1 y C2.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Habla de fugas sin decir «fuga»: la cita que se pierde entre «me interesa» y
  la reunión, y la que se pierde después del plantón. Es exactamente el tramo
  que el brief señala como roto (§4.4). Bien alineado.
- No cae en «IA genérica»: la IA sale una vez, como quien hizo la llamada, y
  con honestidad («mi comercial IA»).
- North Star: comenta GUÍA → conversación por mensaje directo → guía con
  enlace al diagnóstico. Es un camino corto hacia diagnósticos. Falta medirlo
  (ver experimento).
- Aviso interno: nuestro recordatorio de las 9:00 ya dice «esto es lo que
  veremos» (el arreglo del motivo 2) y aun así no rescató los plantones. Lo que
  nos falta es lo de la lámina 4 (una pregunta que pida respuesta). Buen
  argumento para la decisión pendiente de Maikel, no para la pieza.

# Versión Mejorada del Hook

Titular igual («Te han dado plantón.»). Cuadro de portada:

> Reservó. Parecía interesado. Y a la hora, no aparece.
> Casi nunca es mala educación. Son cinco motivos, y el sexto depende de ti.

# Próximo Experimento Recomendado

Publicar con los cambios y contar, durante siete días: comentarios GUÍA →
guías mandadas → respuestas a la guía → diagnósticos reservados desde ese
mensaje. Si hay comentarios pero ningún diagnóstico, el problema está en la
guía, no en el carrusel. Anotarlo en la fila de Notion de la pieza.

# Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 2 · Guía «menos plantones» (recurso para quien comenta GUÍA)

`content/recursos/guia-plantones.md`

# Nota Global (1-10)

**7**

# Resumen Ejecutivo

Cumple lo que promete el carrusel: los cinco motivos, qué revisar en cada uno
y el protocolo de después. Añade dos cosas que el carrusel no tiene y que la
hacen valer la pena: «mide dos números» y el precio antes de reservar. El
cierre al diagnóstico de quince minutos es el correcto (el diagnóstico dura
quince minutos en `diagnostico/index.html`) y el «Lo leo yo» suena a persona.

Tiene tres frases que dicen más que las fuentes: que Maikel la está aplicando
entera en su empresa, que «no estaba mirando el calendario» el 18-sep y que ya
está probando el precio antes de reservar y la confirmación con hueco que se
libera. Las dos últimas son decisiones pendientes suyas, según el brief.

# Lo Mejor

- «Mide dos números», con el segundo («cuántas llamaste antes de que pasara una
  hora») como el que separa sistema de suerte. Es lo más útil de las tres
  piezas.
- Cada motivo con una pregunta incómoda («¿Tu enlace dice "reserva una llamada
  para conocer nuestros servicios"?») y un «Revisa:» concreto.
- El protocolo de después (día 0, 2 y 6) está respaldado: es la secuencia
  `noshow` que ya existe en `api/_secuencias.js`.
- El caso del 18-sep en su versión exacta: «plantón a las 12:00, llamada a las
  12:06 y a los tres minutos me escribieron pidiendo otra hora».
- Ningún nombre de persona ni empresa.

# Lo Más Débil

- Las tres frases que prometen más de lo que hay (críticos).
- El protocolo dice «Minuto 15: llamada» y el caso que lo prueba es una
  llamada al minuto 6.
- Formato: `##` y `**` no se ven en un mensaje directo de Instagram ni en
  LinkedIn. Se mandará con asteriscos y almohadillas a la vista.

# Problemas Críticos Detectados

**G1 · Claim que la fuente no dice.** El brief dice que el recordatorio es sin
confirmación ni liberación de hueco (§1.5) y que el precio y la confirmación
son decisiones pendientes (§6). No está aplicando las cinco cosas.

- Falla: «La estoy aplicando en mi propia empresa.»
- Propuesta: «Una parte ya la uso en mi empresa. La otra la voy a probar, y
  abajo te cuento cuál.»

**G2 · Claim que la fuente no dice.** La bitácora no dice dónde estaba Maikel
ni si la llamada salió sola o la lanzó él. Solo que llamó Raquel.

- Falla: «Yo no estaba mirando el calendario: lo hizo mi comercial IA.»
- Propuesta: «La llamada no la hice yo: la hizo mi comercial IA.»

**G3 · Prueba que no está en marcha.** Precio antes de reservar y confirmación
con hueco que se libera son hipótesis (§5.1) y decisiones pendientes (§6).

- Falla: «## Lo que estoy probando ahora / Precio antes de reservar, y
  confirmación la víspera con un hueco que se libera si no contesta. Cuando
  tenga el número de dos semanas, lo cuento.»
- Propuesta: «## Lo siguiente que quiero probar / Precio antes de reservar, y
  confirmación la víspera con un hueco que se libera si no contesta. Cuando
  lleve dos semanas probándolo, te cuento el número.»

# Qué Eliminaría

- La nota de cabecera (líneas 3-7) al mandarla: es interna. Que empiece en
  «Hola, soy Maikel».
- «Es corta a propósito:». Sobra; se ve que es corta.

# Qué Simplificaría

- «Sin precio, reservar es curiosidad, no decisión.» Es un lema («X, no Y») y
  una hipótesis del brief contada como verdad. → «Si no sabe lo que cuesta,
  reservar no le compromete a nada. Y faltar, tampoco.»
- Los `##` y `**`: pasar a texto plano con mayúsculas o números para mensaje
  directo, o mandarla como PDF de una página.
- «Cabe en una pantalla larga de móvil» (nota interna): son unas 500 palabras,
  tres pantallas. No afecta al lector, pero que nadie la corte creyendo que
  sobra.

# Qué Reforzaría

- **Protocolo y caso, alineados.** «Minuto 15: llamada» → «Entre el minuto 5 y
  el 15: llamada, con guion de plantón, no de venta.» Así el 18-sep (minuto 6)
  lo demuestra en vez de contradecirlo.
- **«Si suena a llamada en frío, cuelgan»** gana con el caso, que está en la
  bitácora del 22-sep: «El martes 22, una llamada con el guion normal a alguien
  que me acababa de dar plantón duró doce segundos.»
- **El cierre al diagnóstico** con la palabra que ya usa la guía: «Si quieres
  que miremos tus dos números con tu agenda delante» está muy bien. Dejarlo
  como única acción y pasar «responde a este mensaje» a una línea aparte, sin
  competir.

# Riesgos

- Mandarla con G1 o G3: la guía se convierte en la promesa más fácil de
  comprobar («¿y ya lo haces?»). Si alguien reserva el diagnóstico y ve que
  Qualivo no pide confirmación ni pone precio, se cae la credibilidad justo en
  el paso que más importa.
- «Casi nadie tiene el segundo»: generalización sin fuente. Como opinión de
  Maikel se acepta; no convertirla en dato en otra pieza.
- Se manda a mano: si hay muchos GUÍA, el retraso en mandarla es un plantón al
  revés. Decidir antes quién la manda y en cuánto tiempo.

# Impacto Esperado

Es el puente entre el comentario y el diagnóstico. Si se manda rápido y con un
cierre claro, cada guía es una conversación abierta con alguien que ya
reconoció el problema. Es la pieza de las tres más cerca de la North Star.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

No es una pieza visual. Jerarquía clara (dos números, cinco motivos,
protocolo, lo siguiente, cierre). El único problema de forma es el formato
Markdown en un canal que no lo pinta (ver «Qué simplificaría»).

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook:** «Hola, soy Maikel. Esta es la guía que prometí en el carrusel.»
  Correcto para un mensaje que el lector ha pedido.
- **Claridad:** alta; cada bloque, pregunta + «Revisa:».
- **Credibilidad:** fallan G1, G2 y G3. El resto está respaldado.
- **Suena a máquina o a agencia:** «Sin precio, reservar es curiosidad, no
  decisión» (lema). «Es el que dice si tienes sistema o suerte» está en el
  límite, pero tiene gracia y dice algo: se queda.
- **CTA:** diagnóstico de quince minutos, bien atado a «tus dos números».

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Muy alineada: mide, detecta dónde se pierde la cita, propone el arreglo y
ofrece mirarlo juntos en quince minutos. Es un diagnóstico en miniatura. Si
funciona, es plantilla para otras palabras clave (PRESUPUESTO, SEGUIMIENTO).

# Versión Mejorada del Hook

> Hola, soy Maikel. Aquí tienes la guía del carrusel. Antes de los cinco
> motivos, mira dos números. El segundo casi nadie lo tiene.

# Próximo Experimento Recomendado

Dos versiones del cierre durante dos semanas, alternando: A, enlace al
diagnóstico; B, «¿Me dices tus dos números y te digo cuál de los cinco es el
tuyo?». Medir respuestas y diagnósticos reservados. La B pide menos y abre
conversación; la A va directa. Con los GUÍA que haya se sabrá cuál acerca más
pilotos.

# Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 3 · Newsletter «Te han dado plantón. ¿Por qué?» (propuesta 25-sep)

`content/newsletter/2026-09-25-plantones.md`

# Nota Global (1-10)

**7**

# Resumen Ejecutivo

Es la mejor de las tres en voz: empieza por lo que pasó, reconoce un error
propio («no estaba donde yo creía»), cuenta una hipótesis como hipótesis («Lo
que creo ahora») y cierra con «Y si no baja, también», que es lo que hace
creíble a alguien. La escena del domingo, la voz que no conoce y el hueco del
martes está muy cerca de lo que pasó el 21 y el 22 (bitácora), así que no es
inventada, aunque se cuente como ejemplo.

Tiene cinco frases que dicen más que las fuentes: la cita literal de la
llamada del 18-sep (y que la IA «le llamó» a él), «Yo no estaba mirando el
calendario», la llamada del 22 «por la tarde», «lo que estoy probando ahora» y
«esta semana varios clientes». Y dos CTA, uno de ellos imposible en LinkedIn
(«responde a este correo»).

# Lo Mejor

- Apertura: «Me ha hecho mirar dónde estaba el fallo, y no estaba donde yo
  creía.» Persona contando algo a otra.
- «No mintió. Es que no había nada en juego.» La mejor frase de las tres piezas.
- Los dos casos contrapuestos (18-sep y 22-sep): guion de plantón frente a
  guion en frío. Es prueba, no opinión.
- «Y si no baja, también.»
- La regla del 24-sep está cumplida: «varios», nunca «5 de 9».

# Lo Más Débil

- Los cinco críticos.
- Dos CTA (GUÍA y diagnóstico) y el de GUÍA dice «responde a este correo» en
  una newsletter nativa de LinkedIn, donde no se puede responder a un correo.
- El párrafo de los cinco motivos repite el carrusel casi entero; para quien
  vio el carrusel, es el tramo que se salta.

# Problemas Críticos Detectados

**N1 · Cita literal que no está en la fuente y cambio de sujeto.** La
bitácora no recoge lo que dijo Raquel; «te he esperado» es el asunto del correo
de plantón. Y cogió una persona de la oficina, no él.

- Falla: «A las 12:06 mi comercial IA le llamó con otro guion: «te he esperado,
  ¿te viene mejor otro día?». Tres minutos después me escribieron pidiendo otra
  hora.»
- Propuesta: «A las 12:06 mi comercial IA llamó a su oficina con un guion de
  plantón, no de venta. Cogió un compañero. Tres minutos después me escribieron
  pidiendo otra hora.»

**N2 · Claim que la fuente no dice.** La bitácora no dice dónde estaba Maikel
ni si la llamada salió sola.

- Falla: «Yo no estaba mirando el calendario.»
- Propuesta: «La llamada no la hice yo.»

**N3 · Hora que no consta y sujeto que no cuadra.** La bitácora no da la hora
de la llamada del 22-sep. Y «probé» (yo) seguido de «le llamó» (ella) no se
entiende; tampoco fue una prueba.

- Falla: «El martes probé lo contrario sin querer: a un contacto que se había
  plantado por la mañana le llamó por la tarde con el guion normal, el de
  llamada en frío.»
- Propuesta: «El martes pasó lo contrario: a un contacto que me había dado
  plantón por la mañana, mi comercial IA le llamó más tarde con el guion
  normal, el de llamada en frío.»

**N4 · Prueba que no está en marcha.** Precio antes de reservar y confirmación
con hueco que se libera son decisiones pendientes (brief §6).

- Falla: «Lo que estoy probando ahora: precio antes de reservar y confirmación
  la víspera con un hueco que se libera si no contestas. En dos semanas cuento
  si el número baja.»
- Propuesta: «Lo siguiente que quiero probar: precio antes de reservar y
  confirmación la víspera con un hueco que se libera si no contestas. Cuando
  lleve dos semanas, cuento si el número baja.»

**N5 · Fecha y sujeto que no cuadran con la fuente.** Los plantones son de la
semana del 18 al 22; enviada el viernes 25, «esta semana» deja fuera el caso
del 18 que se cuenta después. Y eran contactos que habían reservado, no
clientes.

- Falla: «Esta semana varios clientes que habían reservado reunión conmigo no
  aparecieron.»
- Propuesta: «Estos días, varias personas que habían reservado reunión conmigo
  no aparecieron.»

# Qué Eliminaría

- «Guion de plantón o nada.» Lema que cierra un párrafo que ya se entiende, y
  saca una regla de dos llamadas. → «Con un guion me contestaron en tres
  minutos. Con el otro, doce segundos y colgó.»
- De la nota interna de fuentes (línea 69), la cifra «5 de 9»: basta con «la
  tasa de plantones no se publica». Si alguien copia el bloque entero a
  LinkedIn, que no viaje la cifra.
- El segundo CTA (diagnóstico). Ver «Qué reforzaría».

# Qué Simplificaría

- «Es de diseño.» → «Es por cómo montamos la cita.» (más hablado).
- «Reservábamos la cita con la persona menos comprometida» → «Reservamos...».
  El pasado da a entender que ya no pasa, y el cambio está pendiente.
- «Sale a las 9:00 del mismo día para todas las citas. No rescató ninguna.»
  Exacto para el de las 9:00, pero hay otro la víspera a las 18:00 (brief
  §1.4.5). → «Sale a las 9:00 del mismo día. No evitó ni un plantón.»
- El párrafo de los cinco motivos: dejarlo en una línea por motivo, sin los
  ejemplos que ya están en el carrusel, o remitir a la guía.
- «47 correos y dos incendios»: en un texto lleno de horas y segundos reales,
  «47» puede leerse como dato. → «cuarenta correos y dos incendios».
- «Yo pensaba que era cosa del recordatorio»: no está en ninguna fuente; es
  memoria de Maikel. Que lo confirme él antes de enviarlo.

# Qué Reforzaría

- **Una sola acción por canal.** En LinkedIn: «Escríbeme GUÍA en comentarios y
  te la mando.» En el correo a leads: «Responde GUÍA y te la mando.» El
  diagnóstico ya va dentro de la guía; aquí compite con ella.
- **Preheader sin lema.** «No es que el cliente sea malo. Es que la cita nació
  floja.» es la estructura «no es X, es Y». → «Cinco motivos por los que no
  aparecen, y lo que pasó seis minutos después de un plantón.»
- **Asunto alternativa 1:** «Lo que hago a los seis minutos de un plantón»
  sugiere rutina; fue un caso y lo hizo la IA. → «Lo que pasó seis minutos
  después de un plantón.»

# Riesgos

- N1: publicar una cita que nadie dijo, en una newsletter que se vende como
  diario de lo que pasa de verdad («Agentizando mi propia empresa»), es el
  error más caro de las tres piezas.
- N4: «En dos semanas cuento si el número baja» compromete una segunda entrega
  con un número. Si Maikel no aprueba la prueba, esa promesa queda en el aire.
  Y al contar «el número», cuidado con la regla del 24-sep: se podrá decir si
  baja, no la tasa.
- Dos llamadas (una bien, una mal) contadas como regla. Con N3 y «Qué eliminaría»
  queda como lo que es: dos casos.

# Impacto Esperado

A los leads con cadencia terminada les llega un correo personal, útil y sin
venta; es un buen motivo para que alguno conteste. En LinkedIn, suma al diario
y lleva a la guía. Con una sola acción, cada respuesta es una conversación.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Texto de unas 450 palabras, párrafos cortos, se lee en voz alta sin ahogarse.
Si va en LinkedIn, una imagen: la portada nueva del carrusel o la línea de
tiempo del 18-sep. Sin más.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook (asunto):** «Te han dado plantón. ¿Por qué?» Claro y coherente con el
  carrusel. Funciona.
- **Claridad:** alta.
- **Credibilidad:** muy buena en tono; fallan N1 a N5.
- **Suena a máquina o a agencia:** «Guion de plantón o nada.», «Es de diseño.»,
  el preheader «No es que... Es que...».
- **CTA:** dos, y uno imposible en LinkedIn.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Es Qualivo contado desde dentro: dónde se rompe el recorrido (cita → reunión,
brief §4.4), qué se cree que lo arregla y qué se va a probar. Encaja con el
diario «Agentizando mi propia empresa» y con la North Star si la única acción
es GUÍA, que abre conversación, y la guía lleva al diagnóstico. Recomiendo
capítulo 2, como propone la pieza.

# Versión Mejorada del Hook

- Asunto: «Me dieron plantón a las 12:00. Lo que pasó a las 12:06»
- Primera línea: «Estos días, varias personas que habían reservado reunión
  conmigo no aparecieron. Me ha hecho mirar dónde estaba el fallo, y no estaba
  donde yo creía.»

# Próximo Experimento Recomendado

En el correo a los leads con cadencia terminada, mandar la mitad con el asunto
recomendado y la otra mitad con «Me dieron plantón a las 12:00. Lo que pasó a
las 12:06». Medir respuestas con GUÍA (no aperturas). Con pocos envíos no dará
significación: se anota como pista, no como regla.

# Veredicto: PUBLICAR CON CAMBIOS

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| Carrusel «Te han dado plantón» (8 láminas y pie de foto) | 7 | PUBLICAR CON CAMBIOS | 4 (C1 pie Instagram, C2 pie LinkedIn, C3 lámina 4, C4 lámina 8) |
| Guía «menos plantones» (recurso GUÍA) | 7 | PUBLICAR CON CAMBIOS | 3 (G1, G2, G3) |
| Newsletter «Te han dado plantón. ¿Por qué?» (25-sep) | 7 | PUBLICAR CON CAMBIOS | 5 (N1 a N5) |

Regla del 24-sep («5 de 9» no se publica): cumplida en las tres piezas.
Nombres de persona o empresa en texto publicable: ninguno.
