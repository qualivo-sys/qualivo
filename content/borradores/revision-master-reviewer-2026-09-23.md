# Revisión · Qualivo Master Reviewer · 23-sep-2026

Dos piezas del miércoles, revisadas contra sus fuentes:
`content/brief-recorrido-semana-38.md` (§3, §4, §5),
`captacion/agente-llamadas/bitacora-raquel.md` (18-sep y 22-sep),
`content/borradores/serie-estudio-vs-agente.md` (tabla de estudios verificados)
y, para lo que el sistema hace de verdad tras un plantón, `api/_secuencias.js`
(secuencia `noshow`).

Regla aplicada: un claim que la fuente no dice tal cual es crítico; una cifra
sin fuente es crítica; y todo lo que suene a máquina o a agencia se marca
(regla de Maikel del 22-sep).

Lo que la fuente confirma sin reparo, para no volver a comprobarlo: 20
contactos de anuncios entre el 18 y el 22; 9 citas; 5 plantones; 1 reunión
hecha (CL-1) con propuesta de 1.000 €; el recordatorio de las 9:00 no rescató
ninguna; hipótesis «el plantón es de diseño» marcada como hipótesis en el brief;
18-sep plantón a las 12:00, llamada de plantón a las 12:06 de 59 s, WhatsApp
del cliente tres minutos después pidiendo otra hora; 22-sep David colgó a los
12 s tras el plantón de las 10:00 y la bitácora deja escrito «tras un plantón,
no llamar en frío»; Robotham y otros, BMJ Open 2016, 21 estudios, más de
16.000 pacientes, 15 % frente a 21 %, 25 % menos, varios avisos mejoran más;
tres citas pendientes el 23 (RE-8, FO-7, CL-2); secuencia de correo tras
plantón a los días 0, 2 y 6 con los asuntos «te he esperado», «Lo que iba a
mirar en tu caso» y «Cierro esto por mi parte».

---

# PIEZA 1 · Artículo «El cliente no se presenta a la cita»

`blog/cliente-no-se-presenta-a-la-cita/index.html`

# Nota Global (1-10)

**6**

# Resumen Ejecutivo

Es el mejor tipo de artículo que puede sacar Qualivo: un problema que la gente
busca, datos propios de esta misma semana, una hipótesis marcada como
hipótesis y una voz que no es de agencia. La estructura cumple el estándar
(lede, «En 30 segundos», tabla, destacado, regla, caso, FAQ, CTA atado al
tema) y el tono pasa la prueba del bar casi en todos los párrafos.

El problema está en la segunda mitad: el artículo cuenta como «lo que hace mi
sistema» cosas que hoy son una llamada que salió bien una vez y mal otra, una
secuencia de correo que sí existe y un WhatsApp con dos huecos que todavía no
existe. Y convierte un solo caso (Rumy, 18-sep) en regla universal («en los
seis minutos siguientes o no se recupera», «casi todos los plantones que se
recuperan se recuperan en la primera hora»), que además va al schema de FAQ,
donde las IA lo citarán tal cual. A eso se suman tres cifras que la fuente no
dice (la tabla suma 4 plantones y el texto dice 5; «citas a uno o dos días»
cuando el brief dice de 1 a 4; «dos no contestaron al nuevo hueco» cuando fue
uno) y una hora inventada («le llamó a las cuatro»).

Todo se arregla frase a frase. No hay que rehacer nada.

# Lo Mejor

- El lede y la primera bullet del resumen: «Casi todas las empresas apuntan
  “no vino” y lo dejan para más tarde. Más tarde no llega.» Es la idea del
  artículo en dos frases, y es verdad.
- «El plantón es de diseño» marcado como hipótesis, con las tres causas
  concretas (sin precio, sin decisión, sin nada que perder) y la comparación
  del dentista que cobra la primera visita. Eso lo lee alguien con una cerveza
  delante y dice «hostia, tiene sentido».
- El párrafo de formación: «alguien deja sus datos un domingo, el lunes le
  llama una voz que no conoce, dice que sí a un hueco del martes para
  quitarse la llamada de encima… No mintió. Es que no había nada en juego.»
- La honestidad del cierre: «Cuando tenga el número de plantones de las dos
  semanas siguientes, lo pongo aquí. Si la hipótesis está mal, también.»
- El CTA pide dos cifras concretas, no «un diagnóstico». Conecta con el tema.
- El estudio está bien citado: autores, revista, año, número de estudios,
  pacientes, porcentajes. Coincide con la tabla verificada.

# Lo Más Débil

- La distancia entre lo que el artículo dice que hace el sistema y lo que el
  sistema hace según el brief y la bitácora. Si un lector pide ver el sistema
  en la llamada de diagnóstico, no puede enseñar el WhatsApp con dos huecos ni
  la confirmación con liberación de hueco.
- Reglas absolutas con n = 1. El artículo dice «hipótesis» en la parte de
  diseño y luego se olvida de decirlo en la parte de recuperación, que es la
  que da título a la pieza.
- La tabla no cuadra con el texto (4 frente a 5) y cualquier lector que sume
  la columna lo ve.

# Problemas Críticos Detectados

Frase que falla → frase propuesta. Fuente entre paréntesis.

**C1. La tabla suma 4 plantones y el texto dice 5.** (brief §3: la fila CL-2
dice «plantón el 22 a las 16:00; cita movida al 23 a las 17:45», pero la tabla
resumen por vertical del propio brief arrastra un 0 en clínicas. La fuente se
contradice a sí misma; el dato fila a fila es el primario.)
- Falla: fila «Clínicas · 4 · 2 · 0 · La única reunión que pasó entera fue una
  clínica. Terminó en propuesta.»
- Propuesta: «Clínicas · 4 · 2 · 1 · Un plantón el 22 a las 16:00 que pidió
  moverse al día siguiente. La otra cita pasó entera y terminó en propuesta.»
- Maikel tiene que confirmar el recuento antes de publicar: o la tabla lleva
  el 1 de clínicas, o el total no es 5.

**C2. «Citas a uno o dos días» y «dos no contestaron al nuevo hueco».**
(brief §4: «Citas en frío, a 1-4 días»; §3: solo FO-2 tiene «sin respuesta al
nuevo hueco», FO-4 es «cancelada/plantón» y FO-5 «plantón».)
- Falla: «Citas a uno o dos días, cerradas por teléfono en frío. Dos no
  contestaron al nuevo hueco.»
- Propuesta: «Citas en frío, a entre uno y cuatro días. Una no contestó al
  nuevo hueco; otra se canceló.»

**C3. «Mi comercial IA cerró 9 citas».** (brief §3: «Citas de leads de pago:
9». No dice quién las cerró. Por la bitácora, Raquel cerró cuatro de esta
semana; RE-8 la cerró el agente de WhatsApp; CL-1 entró por la landing, que
tiene calendario propio. La fuente no sostiene que las nueve sean de la IA.)
- Falla: «Mi comercial IA cerró 9 citas. Se plantaron 5.»
- Propuesta: «Mi sistema cerró 9 citas sin que yo llamara a nadie. Se
  plantaron 5.» Si Maikel confirma que las nueve las cerraron Raquel o el
  agente de WhatsApp, se queda como está.
- Mismo arreglo en el resumen («de 9 citas cerradas con contactos que
  entraron por anuncios» ya está bien ahí) y en la meta description.

**C4. Hora inventada en la llamada a David.** (bitácora 22-sep: «1 colgó a
los 12 s (David, tras el plantón de las 10:00)». No dice a qué hora fue la
llamada.)
- Falla: «A un contacto que se plantó a las diez le llamó a las cuatro con el
  guion normal. Doce segundos.»
- Propuesta: «A un contacto que se plantó a las diez le volvió a llamar ese
  mismo día con el guion normal, el de llamada en frío. Colgó a los doce
  segundos.»

**C5. «Lo que hace mi sistema desde el 18 de septiembre».** (bitácora 22-sep:
tras el plantón de David el sistema llamó en frío y «tras un plantón, no
llamar en frío» está en «propuesto, no aplicado». Brief §1.4.6: no presentado
= «llamada de Raquel y correo». WhatsApp tras plantón: pasarela en pausa desde
el 22 y propuesta sin aplicar. Lo que sí existe: correo a los días 0, 2 y 6,
`api/_secuencias.js`.)
- Falla: «Lo que sigue es lo que hace mi sistema desde el 18 de septiembre,
  contado con la primera vez que pasó.»
- Propuesta: «Lo que sigue es lo que estoy montando desde el 18 de
  septiembre: la llamada ya salió bien una vez y mal otra, los tres correos
  salen solos, y el WhatsApp con dos huecos lo tengo a medias. Lo cuento con
  la primera vez que pasó.»

**C6. El paso 2 y el párrafo de producto venden lo que no está hecho.**
(Mismas fuentes que C5. Además brief §1.5: «Recordatorio de cita sin
confirmación ni liberación de hueco».)
- Falla (H2 paso 2): «Si no coge, un WhatsApp con dos huecos» presentado como
  parte de la secuencia que ya funciona.
- Propuesta: dejar el paso, pero abrirlo con «Esto es lo siguiente que meto:
  si no coge, un WhatsApp con dos huecos.» Y el ejemplo de mensaje se queda.
- Falla (Qué hacemos nosotros): «Cierra la cita, confirma, y si el cliente no
  aparece, llama a los seis minutos con el guion de plantón y deja el WhatsApp
  con dos huecos.»
- Propuesta: «Cierra la cita, la recuerda, y si el cliente no aparece, llama
  con el guion de plantón y le escribe tres veces en una semana con el hueco
  abierto. La confirmación la víspera y el WhatsApp con dos huecos son lo que
  estoy probando ahora en mi propia empresa.»

**C7. Regla universal con un solo caso, y en el schema.** (No hay fuente para
«primera hora» ni para «seis minutos o no se recupera». El único plantón
recuperado es Rumy, 12:06. El 22-sep la llamada tras plantón falló.)
- Falla (primera frase del H2): «Un plantón se recupera en la primera hora o
  no se recupera.»
- Propuesta: «Un plantón se llama en cuanto pasa, no al día siguiente. Es mi
  regla con una semana de datos y un caso recuperado; la cuento igual porque
  el caso contrario ya lo he visto.»
- Falla (FAQ 1, schema y visible): «Casi todos los plantones que se recuperan
  se recuperan en la primera hora.»
- Propuesta: «El único plantón que he recuperado hasta ahora se recuperó en
  los diez minutos siguientes. Por eso la llamada va antes que nada.»
- Falla (regla): «El plantón se llama en los seis minutos siguientes o no se
  recupera. Y la llamada dice “te he esperado” en la primera frase, o
  cuelgan.»
- Propuesta: «El plantón se llama en cuanto pasa, no mañana. Y la llamada dice
  “te he esperado” en la primera frase; si suena a llamada en frío, cuelgan.»

**C8. La FAQ 2 da por probado lo que el artículo dice que está probando.**
(El propio artículo: «Dos pruebas en marcha, sin resultado todavía». Brief
§6: la confirmación con liberación de hueco es decisión pendiente.)
- Falla (schema y visible): «La confirmación la víspera, con hueco que se
  libera si no contesta, sí cambia quién aparece.»
- Propuesta: «Lo que estoy probando ahora es la confirmación la víspera con
  un hueco que se libera si no contestas. En dos semanas pongo el número.»

**C9. «Cita recuperada» donde la fuente dice «pidieron reprogramar».**
(bitácora 18-sep: «tres minutos después escriben por WhatsApp pidiendo
reprogramar». No consta la nueva cita ni la reunión; la única reunión hecha
de la semana es CL-1.)
- Falla (caso): «Es una cita recuperada, no una venta: la venta la contaré si
  llega.»
- Propuesta: «Es un cliente que pidió otra hora, no una venta. La reunión la
  contaré si pasa; la venta, si llega.»

# Qué Eliminaría

- «No es un artículo desde la tarima. Es el diario de alguien que está
  midiendo por qué la gente no aparece.» Suena a rótulo de serie, a
  presentación de programa. La frase anterior («Escribo esto un miércoles con
  tres citas en la agenda y cinco plantones a la espalda») ya lo dice todo.
  Fuera las dos.
- La repetición de «Plan por escrito en 24 horas, lo hagas con nosotros o
  no»: aparece en el párrafo de cierre y diez líneas después en la tarjeta de
  CTA. Una vez, en la tarjeta.
- En el schema de FAQ 4: «Perseguir un plantón durante un mes convierte una
  cita perdida en un cliente que te bloquea» no está en la FAQ visible. O va
  en las dos o no va (Google penaliza el schema que no coincide con lo
  visible).

# Qué Simplificaría

- Alinear FAQ visible y FAQ del schema: hoy son cuatro textos distintos por
  pregunta (la del schema lleva autores y «un 25 % menos»; la visible no). Un
  solo texto por pregunta, el mismo en los dos sitios.
- «−25 %» frente a «del 21 % al 15 %»: quien haga la cuenta saca un 29 %
  relativo. La tabla verificada dice 25 % (es la razón de riesgo del estudio,
  no la resta de porcentajes). Para no abrir ese frente: «seis puntos menos:
  del 21 % al 15 %», y el «25 %» solo si se explica que es la cifra que da el
  estudio.
- El H2 «Los diez minutos siguientes» seguido de tres H2 numerados: bien para
  el estándar, pero el primer párrafo del H2 padre y el del paso 1 dicen lo
  mismo dos veces (primera hora / minuto seis). Uno de los dos.

# Qué Reforzaría

- Enlazar el estudio. El estándar pide fuente con enlace y GEO pide datos
  atribuibles: `https://pmc.ncbi.nlm.nih.gov/articles/PMC5093388` en la
  primera mención de Robotham.
- El dato que nadie más tiene y aquí está enterrado: «la única reunión que
  pasó entera terminó en propuesta» (1 de 1). Merece estar en el resumen
  como está, y además una frase en «Mis plantones»: la fuga no está en la
  reunión, está en llegar a ella. Es el argumento entero del artículo.
- Decir que el sistema ya manda un recordatorio la víspera a las 18:00 cuando
  la cita se reservó con dos o más días (brief §1.4.5), y que lo que falta no
  es «la víspera» sino que pida confirmar y libere el hueco. Hoy el artículo
  presenta «confirmación la víspera» como la novedad y un lector del brief
  sabe que la víspera ya existe. La novedad es la confirmación con
  consecuencia.
- Marcar la primera frase del H2 «Qué es un plantón» tal cual (ya cumple el
  patrón «X es Y»): es lo que citarán las IA. Bien.

# Riesgos

- Grabaciones públicas: la llamada de Rumy a las 12:06, según la bitácora,
  tuvo dos fallos (soltó el motivo a quien cogió sin preguntar con quién
  hablaba y repitió el saludo). Si Maikel enseña el audio en una llamada de
  diagnóstico, la historia bonita del artículo tiene ruido. Mejor contarlo
  con ese matiz que dejar que lo descubra el cliente.
- El ejemplo del 18-sep (Rumy) no es uno de los 20 contactos de la semana:
  es «un lead de reformas de la semana anterior (landing /reformas)», brief
  §3. El artículo no dice que sea uno de los 5, pero lo pone justo después de
  la tabla. Una frase («con un contacto de la semana anterior») lo blinda.
- Publicar reglas absolutas en schema y en llms.txt con n = 1: si en dos
  semanas el dato desmiente la regla, el artículo queda desactualizado en el
  sitio donde más se cita. La versión con «mi regla» y fecha envejece mejor.
- Prometer en «Qué hacemos nosotros» una secuencia que hoy no existe: es el
  riesgo de credibilidad más caro para la North Star, porque el diagnóstico
  se vende con «te enseño el mío».

# Impacto Esperado

Con los cambios: pieza citable por buscador y por IA para «cliente no se
presenta a la cita», con un dato propio que nadie más tiene y un CTA que
pide dos cifras que el lector no sabe. Lo que aporta a la North Star es
conversaciones de diagnóstico con dueños que ya tienen citas y les fallan:
es gente en fase de reunión, más cerca del piloto que quien todavía busca
leads. Sin los cambios: mismo tráfico, pero cada lector que llegue al
diagnóstico esperará ver un sistema que no está montado.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Estructura conforme al estándar: eyebrow, H1 con keyword, lede, resumen
  oscuro, tabla con wrapper de scroll, destacado, tres pasos con `pnum`,
  regla, caso, FAQ, CTA, «sigue leyendo», autor.
- Párrafos dentro del límite de cuatro líneas salvo dos (el de «Tres cosas
  hacen una cita floja» y el del paso 1), que rozan cinco en móvil. Partir el
  del paso 1 en la frase «Cogió una persona de la oficina».
- El H1 lleva punto final y el `<title>` no. Unificar.
- La tabla tiene cinco columnas; en móvil la última («Qué pasó») es la que
  importa y queda a un scroll de distancia. Aceptable con el wrapper; mejor
  si «Qué pasó» va antes que «Plantones» o si la tabla se reduce a cuatro
  columnas.
- Falta imagen propia: `og:image` es la genérica del sitio. La infografía del
  post de LinkedIn, sin las banderas, serviría de OG.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: H1 y lede claros en cinco segundos. Se entiende qué problema y qué
  se lleva el lector.
- Claridad: sin jerga. «Comercial IA», «CRM» y «WhatsApp» son las únicas
  palabras técnicas y son las del lector. «Lo agentizamos» es frase de marca
  ya asentada en portada, en asesorías y en tres artículos; no la toco, pero
  sigue siendo la única palabra del artículo que no diría nadie en un bar.
- Credibilidad: buena en la parte de diagnóstico (datos propios, hipótesis
  marcada, estudio bien citado), floja en la parte de solución (C5 a C9).
- Frases que suenan a máquina o a agencia: «Es el diario de alguien que está
  midiendo…» (rótulo); «La primera cifra incomoda. La segunda es la que dice
  si hay sistema» (aforismo de carrusel; pasa, pero justo). El resto suena a
  persona.
- CTA: conectado al tema y con la pregunta correcta. Repite la promesa de las
  24 horas dos veces.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Habla de fuga (cita → reunión), de sistema (lo que pasa antes de reservar y
  en los diez minutos siguientes) y de agente sin vender herramienta. Alineado.
- Toma partido (el plantón es de diseño, no mala educación) y lo enseña con
  su propio número malo. Es lo que ninguna agencia haría.
- El artículo apunta a la North Star por el camino correcto: dueños con
  agenda que se les cae, no curiosos de IA.
- Hipótesis no validadas: dos, y las dos dichas como tales, salvo donde se
  olvida (C7, C8). Corregido eso, la pieza es honesta.

# Versión Mejorada del Hook

Lede alternativo, misma idea, con el dato que hoy está escondido:

«Esta semana mi sistema cerró nueve citas con gente que venía de anuncios.
Cinco no aparecieron. La única reunión que pasó entera terminó en propuesta.
La fuga no está en la reunión: está en llegar a ella. Aquí va por qué la
gente no se presenta, lo que dicen los datos sobre los recordatorios y lo que
hago en los diez minutos siguientes.»

# Próximo Experimento Recomendado

El que el propio artículo promete: dos semanas con precio antes de reservar y
confirmación la víspera con hueco que se libera, y volver al artículo con el
número de plantones nuevo y «actualizado a». Es contenido que ningún
competidor puede copiar y da un segundo post de LinkedIn gratis. Medida:
plantones / citas, no clics.

# Veredicto

**PUBLICAR CON CAMBIOS.** Nueve críticos, todos de una frase. Ninguno obliga
a tocar la estructura. Antes de publicar, Maikel confirma el recuento de la
tabla (C1) y quién cerró las nueve citas (C3).

---

# PIEZA 2 · Post de LinkedIn del miércoles + pie de Instagram + ficha + imagen

`content/borradores/2026-09-23-bandera-roja-cita.md` y
`content/infografias/2026-09-23/bandera-roja-cita.png`

# Nota Global (1-10)

**7**

# Resumen Ejecutivo

Cumple la regla de Maikel del 22-sep mejor que casi todo lo anterior: empieza
por lo que pasó («Esta semana mi comercial IA cerró 9 citas. Se plantaron
5»), no hay lema ni nombre de serie en el texto, y el tono es el de alguien
contando un fallo propio. La estructura acierto/fallo de la ficha está bien
ejecutada: primero el número malo, después lo que ya ha aprendido, después lo
que va a probar, y una pregunta al final que pide un dato, no un aplauso.

Los tres críticos son los mismos que en el artículo, concentrados: «ya la
tengo arreglada» / «ya funciona» cuando la bitácora del 22 registra que la
llamada tras plantón salió en frío y colgaron a los 12 s; «un recordatorio a
las 9:00 y ya está» cuando el brief dice que hay también uno la víspera a las
18:00 para citas a dos o más días (lo que falta es que pida confirmar, no que
exista); y «citas que cerró mi comercial IA» que la fuente no dice.

La imagen está bien jerarquizada (el «5 de 9» manda) y no dice más que el
post, pero arrastra esos mismos tres claims, tiene los rótulos «BANDERA ROJA /
VERDE» que son de plantilla y una línea de pie que en el móvil no se lee.

# Lo Mejor

- Primera línea: hecho, número, sin adorno. Para el scroll y no se puede
  haber escrito en una agencia.
- «Es un número que no le enseñaría a un cliente si no fuera mío.» Y en el
  mismo párrafo lo que hace con él. Es exactamente la voz de la guía.
- El giro: «Yo pensaba que era cosa del recordatorio… Lo que creo ahora: el
  plantón es de diseño.» Hipótesis contada como cambio de opinión, no como
  verdad revelada.
- «En dos semanas cuento si el número baja. Y si no baja, también.»
- El cierre pide dos cifras que el lector no tiene: buen anzuelo de
  comentario y puerta al diagnóstico sin decir «diagnóstico».
- La ficha decide que el enlace va en el primer comentario. Correcto.
- Imagen: el número grande en naranja sobre tinta con la frase corta debajo
  se lee a un metro. Los tres pares rojo/verde se entienden sin leer los
  rótulos.

# Lo Más Débil

- «La tercera ya la tengo arreglada, y es la que más se nota.» Es el claim
  que un cliente pedirá ver y que la bitácora contradice el día siguiente.
- La imagen cambia de voz: el post dice «reservábamos», la imagen dice
  «Reservas la cita sin haber dicho el precio». Uno confiesa, la otra da
  lecciones.
- Los rótulos «🚩 BANDERA ROJA» y «VERDE». «Verde» sin sustantivo no
  significa nada, y los dos son etiqueta de plantilla, justo lo que la regla
  del 22-sep pide quitar.

# Problemas Críticos Detectados

**C1. «Ya la tengo arreglada» / «ya funciona» / «lo que ya funciona».**
(bitácora 22-sep: «1 colgó a los 12 s (David, tras el plantón de las
10:00)»; «tras un plantón, no llamar en frío… mejor WhatsApp con hueco nuevo»
está en «propuesto, no aplicado». Un acierto el 18 y un fallo el 22.)
- Falla (LinkedIn): «La tercera ya la tengo arreglada, y es la que más se
  nota.»
- Propuesta: «La tercera es la primera que he tocado, y ya le he visto las
  dos caras.» Y tras el párrafo del 18-sep, una línea: «El martes, la misma
  llamada con el guion normal duró doce segundos. Guion de plantón o nada.»
- Falla (imagen, pie): «La tercera ya funciona: el 18-sep, plantón a las
  12:00, llamada a las 12:06, y a los tres minutos pidieron otra hora.»
- Propuesta: «La tercera ya la he probado: el 18-sep, plantón a las 12:00,
  llamada a las 12:06, y a los tres minutos pidieron otra hora.»
- Falla (Instagram): «Lo que ya funciona: llamar a los seis minutos con “te
  he esperado, ¿otro día?”.»
- Propuesta: «Lo que mejor ha ido: llamar a los seis minutos con “te he
  esperado, ¿otro día?”.»

**C2. «Un recordatorio a las 9:00 y ya está».** (brief §1.4.5:
«Recordatorio a las 9:00 del día… y la víspera a las 18:00 si se reservó con
dos o más días»; §1.5: «Recordatorio de cita sin confirmación ni liberación de
hueco». El fallo no es que solo haya uno; es que ninguno pide nada.)
- Falla (LinkedIn): «Un recordatorio a las 9:00 y ya está. Confirma las citas
  que iban a pasar de todas formas.»
- Propuesta: «Un recordatorio que no pide nada. Si no contesta, no pasa nada.
  Confirma las citas que iban a pasar de todas formas.»
- Falla (imagen, bandera 2): «El recordatorio sale a las 9:00 y ya está.»
- Propuesta: «El recordatorio no pide confirmar. Si no contesta, no pasa
  nada.»
- El párrafo anterior del post («Sale a las 9:00 del mismo día para todas las
  citas. Esta semana no rescató ninguna de las cinco») es literal del brief y
  se queda.

**C3. «Citas que cerró mi comercial IA».** (brief §3: «Citas de leads de
pago: 9»; no atribuye las nueve a la IA. Raquel cerró cuatro de esta semana
según la bitácora; RE-8 el agente de WhatsApp; CL-1 entró por la landing con
calendario. Ver C3 del artículo.)
- Falla (LinkedIn, primera línea): «Esta semana mi comercial IA cerró 9
  citas. Se plantaron 5.»
- Propuesta: «Esta semana mi sistema cerró 9 citas con gente de anuncios. Se
  plantaron 5.»
- Falla (imagen, línea bajo el número, y gancho de la ficha e Instagram):
  «citas que cerró mi comercial IA esta semana acabaron en plantón.»
- Propuesta: «citas de anuncios de esta semana acabaron en plantón.»
- Si Maikel confirma que las nueve las cerraron Raquel o el agente de
  WhatsApp, se queda todo como está y este crítico desaparece.

# Qué Eliminaría

- Los rótulos «🚩 BANDERA ROJA» y «VERDE» de la imagen. Sin ellos, los pares
  rojo/crema ya dicen fallo/arreglo. Si hace falta etiqueta: «Lo que fallaba»
  / «Lo que hago ahora».
- El párrafo de tres líneas al pie de la imagen («Las dos primeras las estoy
  probando ahora mismo…»). Es texto de post, no de imagen; ya está en el
  post. Dejar solo la línea de datos.
- En Instagram, «#comercialia»: no lo busca nadie y suena a robot. «#ventas
  #pymes» bastan.

# Qué Simplificaría

- «Tres banderas rojas que he encontrado en mi propio proceso:» → «Tres cosas
  que he encontrado mal en mi propio proceso:». «Bandera roja» pasa la prueba
  del bar (la gente lo dice), pero es el nombre del molde y la regla del
  22-sep pide que el nombre de serie no salga en el texto.
- Primer comentario: «lo que dice la evidencia sobre los recordatorios» →
  «lo que dicen los estudios sobre los recordatorios». «Evidencia» es de
  paper.
- Imagen, bandera 1: «Reservas la cita sin haber dicho el precio.» →
  «Reservar la cita sin haber dicho el precio.» Infinitivo, como en el post,
  y así deja de sonar a lección al lector.

# Qué Reforzaría

- El dato que falta en el post y que es el argumento: la única reunión que
  pasó entera terminó en propuesta. Una línea tras «Se plantaron 5»: «La única
  reunión que pasó entera acabó en propuesta. La fuga no está en la reunión;
  está en llegar a ella.» Convierte el post de «me han plantado» en «sé dónde
  está la fuga».
- Dejar claro que el caso del 18-sep es de otro contacto (la semana anterior,
  por la landing de reformas, brief §3): «El 18 de septiembre, con un contacto
  de la semana anterior, un cliente no apareció a las 12:00». Evita que
  alguien pregunte «¿ese es uno de los 5?» y no haya respuesta buena.
- La pregunta final ya es buena. Si se quiere un empujón más al comentario:
  «Dime la primera cifra aunque sea fea; la mía es 5 de 9.»

# Riesgos

- El mismo de la pieza 1: si un lector pide ver «la llamada del minuto seis»,
  el audio del 18-sep tiene los fallos que anota la bitácora (repite el
  saludo, no pregunta con quién habla). Mejor contar «salió bien una y mal
  otra» que vender que está arreglado.
- El handle «@maikel.echevarria» de la imagen: coincide con el de las piezas
  de vídeo del 17-sep, pero no se ha comprobado contra Instagram. Un
  segundo, antes de publicar.
- La pausa sigue (ficha: «Sin publicar»). Este informe no la levanta.

# Impacto Esperado

Post de opinión + experiencia + aprendizaje, como pide la guía para LinkedIn.
Lo que puede traer a la North Star: comentarios de dueños con su tasa de
plantones (la ficha lo mide bien) y algún mensaje directo de quien reconozca
el «no vino y a otra cosa». No es un post de alcance; es un post que filtra a
gente con agenda que se cae, que es a quien se le vende un piloto de reunión.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Formato 1080 × 1350, 4:5, correcto para Instagram y LinkedIn.
- Jerarquía: bien. «5 de 9» en display condensada naranja ocupa un tercio y se
  lee en miniatura; la frase blanca en serif debajo cierra el titular; el gris
  para la explicación; los tres pares en dos columnas; pie. Tres niveles
  claros.
- Tres tipografías (display condensada, serif, grotesca). Funciona, pero la
  serif solo aparece en una línea y parece prestada de otra plantilla. Con
  dos familias bastaba.
- Contraste: las tarjetas crema (arreglo) pesan más que las rojas (fallo).
  Es la decisión correcta: el ojo va a la solución.
- Legibilidad en móvil: tarjetas bien; el pie de tres líneas en gris medio y
  la línea «Datos propios, 18 a 22 de septiembre…» en gris pequeño no se
  leerán en el feed. La línea de datos hay que subirla de cuerpo o pasarla al
  pie de foto; el párrafo de tres líneas sobra (ver «Qué eliminaría»).
- Ritmo: el bloque de pares es denso pero se escanea en tres golpes. Sin el
  párrafo del pie, respira.
- Texto de la imagen frente a fuente: «5 de 9», «20 contactos de anuncios, 9
  citas, 5 plantones», «18-sep 12:00 / 12:06 / tres minutos» coinciden con el
  brief y la bitácora. No coinciden: «9:00 y ya está» (C2), «ya funciona»
  (C1), «que cerró mi comercial IA» (C3). La hipótesis «No es mala educación.
  La cita se reservó con la persona menos comprometida…» va como afirmación
  sin el «lo que creo ahora» del post; en imagen no cabe el matiz, y es
  opinión con la cara, así que pasa. Pero que Maikel sepa que ahí la imagen
  afirma lo que el post solo cree.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: hecho + número. Para el scroll. Cumple «una pieza empieza por lo que
  pasó, no por un lema».
- Claridad: sin jerga. «Comercial IA» es la única etiqueta y es de la casa.
- Credibilidad: alta en la confesión, floja en «ya la tengo arreglada» (C1).
  Arreglado eso, es de las piezas más creíbles del mes porque enseña un
  número malo propio.
- Frases que suenan a máquina o a agencia: ninguna en el texto de LinkedIn.
  En la imagen, los rótulos «BANDERA ROJA / VERDE». En el primer comentario,
  «la evidencia». En Instagram, «#comercialia».
- Se repite «no le enseñaría a un cliente si no fuera mío» en artículo y
  post. Quien lea los dos (el comentario enlaza al artículo) lo verá dos
  veces. En una de las dos piezas, cambiar la frase.
- CTA: pregunta que pide un dato. Bien. Instagram: «Dímelo abajo» es
  natural.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Habla de una fuga concreta (cita → reunión), de un sistema (lo que pasa
  antes de reservar y después del plantón) y de un agente que hace una cosa
  medible. No vende IA genérica ni herramientas.
- La ficha mide comentarios con su tasa o con qué hacen antes de reservar:
  buena métrica, no vanidad.
- Hipótesis marcadas como tales en el post («Lo que creo ahora», «las estoy
  probando»). Corregir C1 para que la parte «resuelta» sea igual de honesta
  que la parte «hipótesis».
- La secuencia post del miércoles → artículo en el comentario → diagnóstico
  en el artículo es el camino correcto hacia la North Star.

# Versión Mejorada del Hook

«Esta semana mi sistema cerró 9 citas con gente que venía de anuncios. Se
plantaron 5. La única reunión que pasó entera acabó en propuesta.

La fuga no está en la reunión. Está en llegar a ella.»

(Y sigue el post como está desde «Es un número que no le enseñaría…».)

# Próximo Experimento Recomendado

Publicar este post con la pregunta final tal cual y contar cuántos comentarios
traen una cifra (no «buen post»). Si hay cinco o más con cifra, el molde
«número malo propio + qué he aprendido + qué pruebo» pasa a ser el de los
miércoles. Y en dos semanas, el post de vuelta con el número de plantones
nuevo, enlazando a este: es la prueba que ningún competidor puede fabricar.

# Veredicto

**PUBLICAR CON CAMBIOS.** Tres críticos (dos de texto, uno que obliga a
regenerar la imagen) y dos retoques de diseño en la imagen (rótulos y pie).
Sigue sin publicarse hasta que Maikel levante la pausa.

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| Artículo «El cliente no se presenta a la cita» (`blog/cliente-no-se-presenta-a-la-cita/index.html`) | 6 | PUBLICAR CON CAMBIOS | 9 |
| Post LinkedIn + pie Instagram + ficha + imagen (`content/borradores/2026-09-23-bandera-roja-cita.md`, `content/infografias/2026-09-23/bandera-roja-cita.png`) | 7 | PUBLICAR CON CAMBIOS | 3 |

Dos cosas que solo Maikel puede cerrar y afectan a las dos piezas: el
recuento de plantones por vertical (la tabla del brief suma 4 y el total dice
5; CL-2 tuvo plantón el 22) y si las nueve citas las cerró la IA o no.
