# Revisión · Qualivo Master Reviewer · piezas de plantones (24-sep-2026)

> Tres piezas: carrusel «Te han dado plantón» (8 láminas y pie de foto), guía
> que se manda a quien comenta GUÍA y newsletter propuesta para el 25-sep.
> Revisadas en su estado del commit `4005a00` (24-sep, 10:41, con los ejemplos
> por sector: clínicas, reformas, academias). Formato del prompt del 22-sep,
> guía de voz (con la regla del 22-sep: nada de lemas ni rótulos que suenen a
> máquina) y guía de carruseles. La tabla resumen está al final.

## Lo que dicen las fuentes, tal cual

- **Brief §1.4.5:** «Recordatorio a las 9:00 del día con "esto es lo que
  veremos", y la víspera a las 18:00 si se reservó con dos o más días».
  **§1.5:** «Recordatorio de cita sin confirmación ni liberación de hueco».
  **§4.4:** «el recordatorio de las 9:00 no las rescata».
- **Brief §3:** «Citas de leads de pago: 9; plantones: 5», semana del 18 al 22
  de septiembre. **Regla de Maikel del 24-sep: no se publica.** Comprobado: no
  aparece en ningún texto publicable de las tres piezas. Sí está en el README
  del carrusel («9 citas, 5 plantones») y en la nota interna de fuentes de la
  newsletter («la cifra 5 de 9 no se publica»), que no se publican.
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
  Maikel, aceptada. En el commit `4005a00` ya no aparece en ninguna de las tres
  piezas (la lámina 4 dice ahora «el trabajo, los turnos, los exámenes y el
  móvil que no para»). Si vuelve, mejor en letras para que no se lea como dato.
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
plantón»), resumen y una sola acción (comenta GUÍA). Con los ejemplos por
sector gana: cada motivo es ahora una escena concreta de uno de los tres
sectores a los que vende Qualivo, y la lámina 5 («Adivina dónde se ha
matriculado») es la mejor del carrusel. La lámina 4 ya no contradice nuestro
dato del recordatorio.

Falla en tres cosas, todas de frase: (1) el caso del 18-sep está contado en el
pie de foto con más de lo que dice la bitácora (la IA «le llamó» y él «me
escribió», cuando cogió la oficina; en LinkedIn, además, una cita literal que
no existe); (2) los rótulos nuevos «Motivo 1 · reformas» son exactamente el
patrón que Maikel prohibió el 22-sep («Contacto · la primera hora»); (3) la
lámina 8 usa la construcción prohibida «no es X: es Y». Además, las láminas 2
a 8 van de 75 a 100 palabras (máximo de la guía: 40) y el cuadro «Qué hacer»
está a 32 px.

# Lo Mejor

- Portada: «Te han dado plantón.» Una escena que cualquier dueño ha vivido, en
  tres palabras, sin lema.
- Lámina 5: «En septiembre pidió información en tres academias. La tuya le dio
  cita para dentro de ocho días. Otra le llamó esa misma tarde. Adivina dónde
  se ha matriculado.» Escena, tensión y remate. Es la guía de voz entera.
- Lámina 3: «Si el paciente no sabe qué se lleva, la cita pesa poco. Y lo que
  pesa poco se cae.» Tiene gracia y dice algo.
- Lámina 4: «Un recordatorio que no pide nada confirma las citas que iban a
  pasar de todas formas.» Ahora casa con nuestro dato (el recordatorio de las
  9:00 no rescató los plantones) y con la guía.
- El giro de la lámina 7 y su dato propio, exacto: «plantón a las 12:00,
  llamada a las 12:06, y a los tres minutos me escribieron pidiendo otra hora»
  (plural, como la bitácora).
- CTA único y coherente con lo que se entrega (la guía existe y trae lo que
  promete, sectores incluidos).
- Continuidad visual: barra de progreso, numeración 1/8 a 8/8, «Pasa →» en
  todas menos la última, paleta y rejilla de casa.

# Lo Más Débil

- El pie de foto cambia quién cogió y quién escribió el 18-sep.
- Los rótulos «Motivo N · sector» encima de cada titular.
- La lámina 8: 100 palabras, título a 72 px, cuerpo a 31 px, siete motivos en
  la lista cuando el CTA habla de cinco, y «El proceso era un lío», que no
  aparece en ninguna lámina anterior.
- Texto de más en todas las láminas (L2 80, L3 90, L4 90, L5 76, L6 75, L7 90,
  L8 100 palabras) y ninguna imagen ni gráfico de la 2 a la 8 (regla 5 de la
  guía de carruseles).

# Problemas Críticos Detectados

**C1 · Pie de foto de Instagram, caso del 18-sep (claim que la fuente no
dice).** La bitácora dice que cogió una persona de la oficina y que tres
minutos después «escriben». El pie dice que la IA «le llamó» a él y que él «me
escribió». «Un cliente» además sugiere que era cliente de pago.

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

**C3 · Láminas 2 a 6, rótulos de sección que Maikel prohibió el 22-sep.**
«Motivo 1 · reformas» es el mismo molde que «Contacto · la primera hora», el
ejemplo que la guía de carruseles (§6) pone de lo que delata a una máquina. Y
no hace falta: la primera frase de cada lámina ya dice el sector («Te piden
presupuesto para reformar un baño», «Si el paciente...», «Pidió información
del curso», «tres academias», «¿Me va a doler?»).

- Falla: «Motivo 1 · reformas» (y «Motivo 2 · clínicas», «Motivo 3 ·
  academias», «Motivo 4 · academias», «Motivo 5 · clínicas») encima del
  titular.
- Propuesta: sin rótulo, con el número dentro del titular: «1. No tenía
  tiempo.», «2. No sabe para qué es la cita.», «3. Se le ha olvidado.», «4. Ha
  perdido el interés.», «5. Tiene dudas y no te las ha contado.»

**C4 · Lámina 8, construcción prohibida («no se trata de X sino de Y», guía
de carruseles §6) que además suena a plantilla.**

- Falla: «Lo importante no es que nadie te dé plantón: es entender por qué
  pasa y montar un sistema que lo reduzca.»
- Propuesta: «Plantones va a haber siempre. Lo que sí puedes es saber por qué
  pasan y montar un sistema que los reduzca.»

# Qué Eliminaría

- Lámina 7: el rótulo «Y hay otro problema» (misma regla que C3). Que lo diga
  el titular: «Y cuando te da plantón, no haces nada.»
- Lámina 8: «El proceso era un lío» de la lista. No es un motivo que se haya
  contado; es la conclusión, y ya la dice el párrafo. Deja la lista en seis
  (los cinco y «Nadie hizo seguimiento») para que cuadre con la lámina 7.
- Lámina 6: «Cuanta menos incertidumbre, menos fricción.» Suena a consultora
  («fricción») y no añade nada. Si se quiere cerrar con algo: «Cuantas menos
  dudas lleve, más fácil que venga.»
- Lámina 5: «En septiembre» al principio. Es una escena inventada y con mes
  concreto puede leerse como caso real. «Pidió información en tres academias.»
  funciona igual.

# Qué Simplificaría

Sin tocar el esqueleto, recortes de frase para acercarse a 40 palabras:

- L1 (portada, 38 palabras; el molde pide 15): «Un paciente, un alumno o un
  cliente de reforma reservó cita. Parecía interesado. Y cuando llega la hora,
  no aparece.» → «Reservó cita. Parecía interesado. Y a la hora, no aparece.» Los
  tres sectores ya están en el pie de foto. Hoy, además, «aparece.» queda
  sola en una línea.
- L2: «Y tu visita desaparece de su radar.» → «Y tu visita se le va de la
  cabeza.» (menos tópico).
- L3: «¿Y qué pasa en esa visita? ¿Me van a mirar o me van a vender un
  tratamiento?» → dejar solo la segunda pregunta; la duda del tratamiento ya
  vuelve en la lámina 6.
- L4: «Confirmación al reservar. Recordatorio 24 horas antes. Recordatorio 2
  horas antes. WhatsApp justo antes.» → «Confirmación al reservar, aviso el día
  antes y otro dos horas antes.» (cuatro toques antes de una llamada de
  admisión es mucho para una academia pequeña).
- L5: «Lo que importa es que alguien conteste mientras todavía está eligiendo.»
  → «Que alguien conteste mientras todavía está eligiendo.»
- L7: «Todavía puedes recuperar esa cita. A mí me pasó el 18 de septiembre:» →
  «Todavía estás a tiempo. El 18 de septiembre:».
- L8: con C4 y sin «El proceso era un lío» baja a unas 80. Para llegar a 40,
  quitar el párrafo y dejar título, lista y CTA: la lista ya es el resumen.

# Qué Reforzaría

- **El protocolo con la prueba.** La lámina 7 recomienda «A los cinco minutos,
  WhatsApp. A los quince, llamada», y el caso que se cuenta justo encima es una
  llamada a los seis minutos que acabó en WhatsApp. Quien lo lea atento lo
  verá. Propuesta: «A los cinco minutos, llamada con guion de plantón. Si no
  coge, WhatsApp. Después, seguimiento que salga solo.» (O al revés, pero que
  el caso y la regla digan lo mismo.)
- **Lámina 7 como pantalla.** Es la única prueba propia y va en texto. Una
  línea de tiempo simple («12:00 plantón · 12:06 llamada · 3 min después,
  WhatsApp pidiendo otra hora») la haría la lámina que se guarda. Sin poner
  «12:09»: la fuente dice «tres minutos después», no la hora.
- **Pie de Instagram:** «con otro guion» no se entiende sin contexto; «con un
  guion de plantón» (ya en C1) lo explica.
- **Pie de LinkedIn:** «tenía dudas que no me contó» → «que no te contó» (el
  resto habla en segunda persona).

# Riesgos

- Publicar C1 o C2 tal cual: si alguien de esa empresa lo lee, sabe que no fue
  así. Y la cita literal no la dijo nadie.
- Reparto de sectores: reformas sale una vez, clínicas dos, academias dos
  seguidas. Un dueño de reformas se queda con una lámina de cinco. No es grave,
  pero si hay que quitar texto, que no sea la de reformas.
- El caso del 18-sep era una cita reservada a las 09:35 para las 12:00. Si se
  usa en otra pieza para ilustrar «acorta el tiempo» (lámina 5), no sirve:
  había dos horas y media y aun así no vino.
- «Qué hacer» dentro del cuadro es también una etiqueta. Es funcional y parece
  del esqueleto de Maikel; se queda si él lo quiere, pero con C3 y el rótulo
  de la 7 fuera, el carrusel deja de parecer plantilla.

# Impacto Esperado

Buen carrusel para guardar y comentar: lista útil con arreglo concreto por
punto, contada en los tres sectores que Qualivo trabaja. El CTA «comenta GUÍA»
abre conversaciones por mensaje directo, que es la primera métrica que mueve
pilotos, y la guía lleva al diagnóstico. No pongo número de comentarios
esperado: no hay dato propio de carruseles con CTA de palabra clave.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- **Portada (solo encaje del texto, la foto se cambia):** titular a 150 px
  arriba a la derecha, se lee en un segundo. El cuadro negro de abajo (31 px,
  38 palabras) tapa el borde inferior del portátil con la videollamada vacía,
  que es lo que cuenta la escena, y la firma cae encima de la libreta. Con la
  foto nueva: pantalla vacía entre el titular y el cuadro, no debajo; cuadro
  más corto (ver «Qué simplificaría») y a 34 px.
- **Jerarquía:** titular 82 px en Anton, cuerpo 34 px, cuadro «Qué hacer» a
  32 px (por debajo del mínimo de 34). Lámina 8 a 72 / 31 / 30 px: la más
  importante es la más apretada.
- **Aire:** en las láminas 2, 5 y 6 quedan unos 200-250 px vacíos abajo. Hay
  sitio para subir el cuadro a 34-36 px.
- **Imagen o gráfico por lámina:** ninguno de la 2 a la 8 (regla 5). Mínimo,
  la línea de tiempo de la lámina 7.
- **Ritmo y continuidad:** cumple la regla 8. La lista con «✗» de la lámina 8
  se lee bien, pero la cruz sugiere «culpa del cliente», justo lo que el
  titular niega; números (1-6) casan mejor.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook:** bueno. Escena reconocible y una pregunta («¿por qué no ha
  venido?») que abre el circuito.
- **Claridad:** alta. Cada motivo, una escena, un problema y un arreglo.
- **Credibilidad:** el dato propio de la lámina 7 es exacto. Pierden
  credibilidad C1 y C2.
- **Frases que suenan a máquina o a agencia:** los rótulos «Motivo N · sector»
  (C3), «Y hay otro problema», «Lo importante no es...: es...» (C4), «Cuanta
  menos incertidumbre, menos fricción» (L6), «desaparece de su radar» (L2,
  tópico). En el límite pero con voz, se quedan: «No vendas la cita. Vende lo
  que se lleva de la cita» y «lo que pesa poco se cae».
- **CTA:** una sola acción, clara, coherente con lo que se entrega.
- **Pie de foto:** estructura correcta (gancho, un párrafo, una acción, cuatro
  etiquetas en Instagram, ninguna en LinkedIn). Solo fallan C1 y C2.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Habla de fugas sin decir «fuga»: la cita que se pierde entre «me interesa» y
  la reunión, y la que se pierde después del plantón. Es el tramo que el brief
  señala como roto (§4.4).
- Los tres sectores son los tres verticales de los anuncios (brief §3). Quien
  se reconozca en la lámina es cliente posible, no audiencia.
- No cae en «IA genérica»: la IA sale una vez, como quien hizo la llamada, y
  con honestidad («mi comercial IA»).
- North Star: comenta GUÍA → conversación → guía con enlace al diagnóstico.
  Camino corto hacia diagnósticos. Falta medirlo (ver experimento).
- Nota interna: nuestro recordatorio de las 9:00 ya dice «esto es lo que
  veremos» (el arreglo del motivo 2) y no rescató los plantones. Lo que falta
  es lo de la lámina 4 (una pregunta que pida respuesta). Argumento para la
  decisión pendiente de Maikel, no para la pieza.

# Versión Mejorada del Hook

Titular igual («Te han dado plantón.»). Cuadro de portada:

> Reservó cita. Parecía interesado. Y a la hora, no aparece.
> Casi nunca es mala educación. Son cinco motivos, y el sexto depende de ti.

# Próximo Experimento Recomendado

Publicar con los cambios y contar durante siete días: comentarios GUÍA → guías
mandadas → respuestas → diagnósticos reservados desde ese mensaje, y de qué
sector es cada uno. Si hay comentarios pero ningún diagnóstico, el problema
está en la guía. Si todos vienen de un sector, el siguiente carrusel va solo
para ese. Anotarlo en la fila de Notion de la pieza.

# Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 2 · Guía «menos plantones en clínicas, reformas y academias» (recurso GUÍA)

`content/recursos/guia-plantones.md`

# Nota Global (1-10)

**7**

# Resumen Ejecutivo

Cumple lo que promete el carrusel: los cinco motivos, qué revisar en cada uno,
lo primero que miraría en cada sector y el protocolo de después. Lo que la
hace valer la pena es «mide dos números» y la sección por sector, que es
concreta y suena a alguien que ha visto esos negocios por dentro. El cierre al
diagnóstico de quince minutos es el correcto (dura quince minutos en
`diagnostico/index.html`) y «Lo leo yo» suena a persona.

Tiene tres frases que dicen más que las fuentes: que Maikel la está aplicando
en su empresa, que «no estaba mirando el calendario» el 18-sep y que ya está
probando el precio antes de reservar y la confirmación con hueco que se
libera. Las dos últimas son decisiones pendientes suyas, según el brief.

# Lo Mejor

- «Mide dos números», con el segundo («cuántas llamaste antes de que pasara una
  hora») como el que separa sistema de suerte.
- La sección por sector: «La visita, cuando ya sepa que le encajas», «el otro
  presupuesto viene mañana», «nadie quiere salir con un tratamiento que no
  pidió». Concreto y hablado.
- Cada motivo con una pregunta incómoda y un «Revisa:» concreto.
- El protocolo de después (día 0, 2 y 6) está respaldado: es la secuencia
  `noshow` que ya existe en `api/_secuencias.js`.
- El caso del 18-sep en su versión exacta: «plantón a las 12:00, llamada a las
  12:06 y a los tres minutos me escribieron pidiendo otra hora».

# Lo Más Débil

- Las tres frases que prometen más de lo que hay (críticos).
- El protocolo dice «Minuto 15: llamada» y el caso que lo prueba es una
  llamada al minuto 6.
- 685 palabras para mandar por mensaje directo, en Markdown: `##` y `**` no se
  ven ni en Instagram ni en LinkedIn.

# Problemas Críticos Detectados

**G1 · Claim que la fuente no dice.** El brief dice que el recordatorio va sin
confirmación ni liberación de hueco (§1.5) y que precio y confirmación son
decisiones pendientes (§6). No está aplicando las cinco cosas.

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
- «Es corta a propósito:». Con 685 palabras no lo es, y sobra decirlo.
- En «Los cinco motivos», lo que la sección por sector repite casi igual
  (reformas: teléfono en diez minutos; clínicas: qué vais a revisar y precio
  orientativo). Con una de las dos versiones basta; la de sector es mejor.

# Qué Simplificaría

- «Sin precio, reservar es curiosidad, no decisión.» Es un lema («X, no Y») y
  una hipótesis del brief contada como verdad. → «Si no sabe lo que cuesta,
  reservar no le compromete a nada. Y faltar, tampoco.»
- «El alumno pide información en tres sitios a la vez y se matricula en el que
  le contesta antes.» Generalización sin fuente contada como regla. → «Muchas
  veces pide información en tres sitios a la vez, y el que contesta antes
  lleva ventaja.»
- Los `##` y `**`: pasar a texto plano con mayúsculas o números para mensaje
  directo, o mandarla como PDF de una página.

# Qué Reforzaría

- **Protocolo y caso, alineados.** «Minuto 15: llamada» → «Entre el minuto 5 y
  el 15: llamada, con guion de plantón, no de venta.» Así el 18-sep (minuto 6)
  lo demuestra en vez de contradecirlo.
- **«Si suena a llamada en frío, cuelgan»** gana con el caso de la bitácora del
  22-sep: «El martes 22, una llamada con el guion normal a alguien que me
  acababa de dar plantón duró doce segundos.»
- **El cierre al diagnóstico:** «Si quieres que miremos tus dos números con tu
  agenda delante» está muy bien. Que sea la única acción y «responde a este
  mensaje» vaya en línea aparte, sin competir.

# Riesgos

- Mandarla con G1 o G3: la guía es la promesa más fácil de comprobar («¿y ya lo
  haces?»). Si alguien reserva el diagnóstico y ve que Qualivo no pide
  confirmación ni pone precio, se cae la credibilidad justo en el paso que más
  importa.
- «Casi nadie tiene el segundo»: generalización sin fuente. Como opinión de
  Maikel se acepta; no convertirla en dato en otra pieza.
- Se manda a mano: si hay muchos GUÍA, el retraso en mandarla es un plantón al
  revés. Decidir antes quién la manda y en cuánto tiempo.

# Impacto Esperado

Es el puente entre el comentario y el diagnóstico. Si se manda rápido y con un
cierre claro, cada guía es una conversación con alguien que ya reconoció el
problema en su sector. De las tres piezas, la más cerca de la North Star.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

No es pieza visual. Jerarquía clara (dos números, cinco motivos, sectores,
protocolo, lo siguiente, cierre). El problema de forma es el Markdown en un
canal que no lo pinta, y la longitud: ya no cabe en «una pantalla larga de
móvil» como dice su nota.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook:** «Hola, soy Maikel. Esta es la guía que prometí en el carrusel.»
  Correcto para un mensaje que el lector ha pedido.
- **Claridad:** alta; cada bloque, pregunta + «Revisa:».
- **Credibilidad:** fallan G1, G2 y G3. El resto está respaldado o es consejo.
- **Suena a máquina o a agencia:** «Sin precio, reservar es curiosidad, no
  decisión» (lema). «Es el que dice si tienes sistema o suerte» está en el
  límite, pero tiene gracia y dice algo: se queda.
- **CTA:** diagnóstico de quince minutos, bien atado a «tus dos números».

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Muy alineada: mide, detecta dónde se pierde la cita, propone el arreglo por
sector y ofrece mirarlo juntos en quince minutos. Es un diagnóstico en
miniatura. Si funciona, es plantilla para otras palabras clave (PRESUPUESTO,
SEGUIMIENTO).

# Versión Mejorada del Hook

> Hola, soy Maikel. Aquí tienes la guía del carrusel. Antes de los cinco
> motivos, mira dos números. El segundo casi nadie lo tiene.

# Próximo Experimento Recomendado

Dos versiones del cierre, alternando durante dos semanas: A, enlace al
diagnóstico; B, «¿Me dices tus dos números y te digo cuál de los cinco es el
tuyo?». Medir respuestas y diagnósticos reservados. La B pide menos y abre
conversación; la A va directa.

# Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 3 · Newsletter «Te han dado plantón. ¿Por qué?» (propuesta 25-sep)

`content/newsletter/2026-09-25-plantones.md`

# Nota Global (1-10)

**7**

# Resumen Ejecutivo

Es la mejor de las tres en voz: empieza por lo que pasó, reconoce un error
propio («no estaba donde yo creía»), cuenta una hipótesis como hipótesis («Lo
que creo ahora») y cierra con «Y si no baja, también». La escena del domingo,
la voz que no conoce y el hueco del martes está muy cerca de lo que pasó el 21
y el 22 (bitácora), así que no es inventada aunque se cuente como ejemplo.

Tiene seis frases que dicen más que las fuentes: la cita literal de la llamada
del 18-sep (y que la IA «le llamó» a él), «Yo no estaba mirando el
calendario», la llamada del 22 «por la tarde», «lo que estoy probando ahora»,
«esta semana varios clientes» y los ejemplos por sector contados en pasado,
que en un diario de datos reales se leen como casos propios. Y dos CTA, uno de
ellos imposible en LinkedIn («responde a este correo»).

# Lo Mejor

- Apertura: «Me ha hecho mirar dónde estaba el fallo, y no estaba donde yo
  creía.» Persona contando algo a otra.
- «No mintió. Es que no había nada en juego.» La mejor frase de las tres piezas.
- Los dos casos contrapuestos (18-sep y 22-sep): guion de plantón frente a
  guion en frío. Es prueba, no opinión.
- «Y si no baja, también.»
- La regla del 24-sep está cumplida: «varios», nunca «5 de 9».

# Lo Más Débil

- Los seis críticos.
- Dos CTA (GUÍA y diagnóstico), y el de GUÍA dice «responde a este correo» en
  una newsletter nativa de LinkedIn.
- El párrafo por sectores es largo (nueve líneas) y repite el carrusel.

# Problemas Críticos Detectados

**N1 · Cita literal que no está en la fuente y cambio de sujeto.** La
bitácora no recoge lo que dijo Raquel; «te he esperado» es el asunto del correo
de plantón. Y cogió una persona de la oficina, no él.

- Falla: «El 18 de septiembre un cliente no apareció a las 12:00. A las 12:06
  mi comercial IA le llamó con otro guion: «te he esperado, ¿te viene mejor
  otro día?». Tres minutos después me escribieron pidiendo otra hora.»
- Propuesta: «El 18 de septiembre una empresa que había reservado conmigo no
  apareció a las 12:00. A las 12:06 mi comercial IA llamó a su oficina con un
  guion de plantón, no de venta. Cogió un compañero. Tres minutos después me
  escribieron pidiendo otra hora.»

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

**N6 · Ejemplos inventados que se leen como casos propios.** Justo después de
«varios clientes... no aparecieron», los ejemplos van en pasado y en los tres
sectores de Qualivo («la visita era a cinco días», «se matriculó en el que le
llamó esa misma tarde»). El lector entiende que le pasó a Maikel o a sus
clientes. Ninguna fuente lo dice. En presente son ejemplos; en pasado, datos.

- Falla: «En una empresa de reformas, no tenía tiempo: la visita era a cinco
  días y se le cruzó el trabajo [...] En una clínica, no sabía para qué era la
  primera visita, o tenía dudas que no contó [...] En una academia, se le
  olvidó entre el trabajo y los exámenes, o perdió el interés: pidió
  información en tres sitios y se matriculó en el que le llamó esa misma
  tarde.»
- Propuesta: «En una empresa de reformas, no tiene tiempo: la visita es a cinco
  días y se le cruza el trabajo, cuando la primera parte se resolvía por
  teléfono con unas fotos. En una clínica, no sabe para qué es la primera
  visita, o tiene dudas que no cuenta: si le va a doler, cuánto le va a costar,
  si le van a meter un tratamiento que no necesita. En una academia, se le
  olvida entre el trabajo y los exámenes, o pierde el interés: pide
  información en tres sitios y se matricula en el que le llama esa misma
  tarde.»

# Qué Eliminaría

- «Guion de plantón o nada.» Lema que cierra un párrafo que ya se entiende, y
  saca una regla de dos llamadas. → «Con un guion me contestaron en tres
  minutos. Con el otro, doce segundos y colgó.»
- De la nota interna de fuentes (línea 70), la cifra «5 de 9»: basta con «la
  tasa de plantones no se publica». Si alguien copia el bloque a LinkedIn, que
  no viaje la cifra.
- El segundo CTA (diagnóstico). Ver «Qué reforzaría».

# Qué Simplificaría

- «Es de diseño.» → «Es por cómo montamos la cita.» (más hablado).
- «Reservábamos la cita con la persona menos comprometida» → «Reservamos...».
  El pasado da a entender que ya no pasa, y el cambio está pendiente.
- «Sale a las 9:00 del mismo día para todas las citas. No rescató ninguna.»
  Exacto para el de las 9:00, pero hay otro la víspera a las 18:00 (brief
  §1.4.5). → «Sale a las 9:00 del mismo día. No evitó ni un plantón.»
- «Yo pensaba que era cosa del recordatorio»: no está en ninguna fuente; es
  memoria de Maikel. Que lo confirme él antes de enviarlo.
- El párrafo por sectores: una línea por sector basta; el detalle está en la
  guía.

# Qué Reforzaría

- **Una sola acción por canal.** En LinkedIn: «Escríbeme GUÍA en comentarios y
  te la mando.» En el correo a leads: «Responde GUÍA y te la mando.» El
  diagnóstico ya va dentro de la guía; aquí compite con ella.
- **Preheader sin lema.** «No es que el cliente sea malo. Es que la cita nació
  floja.» es la estructura «no es X, es Y». → «Cinco motivos por los que no
  aparecen, y lo que pasó seis minutos después de un plantón.»
- **Asunto, alternativa 1:** «Lo que hago a los seis minutos de un plantón»
  sugiere rutina; fue un caso y lo hizo la IA. → «Lo que pasó seis minutos
  después de un plantón.»

# Riesgos

- N1: publicar una cita que nadie dijo, en una newsletter que se vende como
  diario de lo que pasa de verdad («Agentizando mi propia empresa»), es el
  error más caro de las tres piezas.
- N4: «En dos semanas cuento si el número baja» compromete una segunda entrega.
  Si Maikel no aprueba la prueba, esa promesa queda en el aire. Y al contarlo,
  cuidado con la regla del 24-sep: se podrá decir si baja, no la tasa.
- Dos llamadas (una bien, una mal) contadas como regla. Con N3 y «Qué
  eliminaría» queda como lo que es: dos casos.

# Impacto Esperado

A los leads con cadencia terminada les llega un correo personal, útil y sin
venta, que habla de su sector: buen motivo para que alguno conteste. En
LinkedIn, suma al diario y lleva a la guía. Con una sola acción, cada
respuesta es una conversación.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Unas 475 palabras, párrafos cortos salvo el de sectores, se lee en voz alta
sin ahogarse. Si va en LinkedIn, una imagen: la portada nueva del carrusel o
la línea de tiempo del 18-sep.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook (asunto):** «Te han dado plantón. ¿Por qué?» Claro y coherente con el
  carrusel.
- **Claridad:** alta.
- **Credibilidad:** muy buena en tono; fallan N1 a N6.
- **Suena a máquina o a agencia:** «Guion de plantón o nada.», «Es de diseño.»,
  el preheader «No es que... Es que...».
- **CTA:** dos, y uno imposible en LinkedIn.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Es Qualivo contado desde dentro: dónde se rompe el recorrido (cita → reunión,
brief §4.4), qué se cree que lo arregla y qué se va a probar, con ejemplos en
los tres sectores que compran. Encaja con el diario «Agentizando mi propia
empresa» y con la North Star si la única acción es GUÍA, que abre
conversación, y la guía lleva al diagnóstico. Recomiendo capítulo 2, como
propone la pieza.

# Versión Mejorada del Hook

- Asunto: «Me dieron plantón a las 12:00. Lo que pasó a las 12:06»
- Primera línea: «Estos días, varias personas que habían reservado reunión
  conmigo no aparecieron. Me ha hecho mirar dónde estaba el fallo, y no estaba
  donde yo creía.»

# Próximo Experimento Recomendado

En el correo a los leads con cadencia terminada, la mitad con el asunto
recomendado y la otra mitad con «Me dieron plantón a las 12:00. Lo que pasó a
las 12:06». Medir respuestas con GUÍA (no aperturas) y de qué sector vienen.
Con pocos envíos no dará significación: se anota como pista, no como regla.

# Veredicto: PUBLICAR CON CAMBIOS

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| Carrusel «Te han dado plantón» (8 láminas y pie de foto) | 7 | PUBLICAR CON CAMBIOS | 4 (C1 pie Instagram, C2 pie LinkedIn, C3 rótulos láminas 2-6, C4 lámina 8) |
| Guía «menos plantones en clínicas, reformas y academias» | 7 | PUBLICAR CON CAMBIOS | 3 (G1, G2, G3) |
| Newsletter «Te han dado plantón. ¿Por qué?» (25-sep) | 7 | PUBLICAR CON CAMBIOS | 6 (N1 a N6) |

Regla del 24-sep («5 de 9» no se publica): cumplida en las tres piezas.
Nombres de persona o empresa en texto publicable: ninguno.
Revisado sobre el commit `4005a00`; si las piezas cambian otra vez, repasar
los críticos contra la versión nueva.
