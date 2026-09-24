# Revisión · Qualivo Master Reviewer · 24-sep-2026

> Dos piezas revisadas contra sus fuentes: el artículo «Qué poner en tu negocio
> para atraer clientes» y el post del jueves de la serie sobre agentizar la
> propia empresa («¿Eres una máquina?») con su imagen, pie de Instagram y ficha.
> Fuentes contrastadas: brief-recorrido-semana-38.md (§2, §3, §4),
> bitacora-raquel.md (22 y 23-sep), diagnostico/landing.js (comentario del
> 19-sep), README del carrusel 2026-09-21-clinica-real, serie-estudio-vs-agente.md
> (HBR 2011), propuesta-de-valor-v1.md (§5), casos/nuria-roure/index.html,
> diagnostico/index.html (promesa del plan en 24 h), llms.txt y blog/index.html.
> Calendario comprobado: 19-sep-2026 es sábado; 22-sep, martes; 24-sep, jueves.

---

# PIEZA 1 · Artículo «Qué poner en tu negocio para atraer clientes (y qué lo vacía)»

`blog/que-poner-en-tu-negocio-para-atraer-clientes/index.html` · keyword «qué poner en tu negocio para atraer clientes»

# Nota Global (1-10)

**7**. Sube a 8,5 con los seis cambios de abajo; ninguno pide reescribir, todos son frases sueltas.

# Resumen Ejecutivo

Es un buen artículo: da la vuelta a la keyword (la gente busca un cartel, se lleva un sistema), tiene voz de persona, datos propios de la semana, tabla, regla, caso y CTA conectado al tema. Cumple el estándar de artículos punto por punto y la línea de llms.txt ya está. Lo que falla es de precisión, no de fondo: un día de la semana equivocado (el 19 fue sábado, no viernes), una frase que exagera lo que dice el brief («preguntaron a las once de la noche»), un baile 21/20 contactos que el lector nota, la FAQ visible que recorta la fuente, la única reunión de la semana atribuida al anuncio cuando entró por la web, y el resumen que dice que las cosas gratis son la 2 y la 3 mientras el cuerpo dice que son la 1 y la 2. Todo se arregla en diez minutos. Sin arreglarlo, un lector atento (o Meta, o el propio Maikel dentro de un mes) pilla la incoherencia y la pieza pierde justo lo que la hace distinta: que los números son de verdad.

# Lo Mejor

- La tesis, en una frase de persona: «Un cliente no se atrae. Se atiende.» Es lo que alguien subrayaría y no suena a agencia.
- Los datos son propios, de esta semana y con contexto (292 €, 21 solicitudes, 13,90 €, 9 citas, 5 plantones, frecuencia 2,0). Es lo que pide el estándar y lo que ninguna IA genérica puede escribir.
- La anécdota del calendario en el iPhone («no puedo bajar en el calendario», arreglado antes de comer) es real, verificable en el código y hace el punto 1 creíble.
- Cada H2 empieza con la respuesta autocontenida («Lo primero que hay que poner es…»). Bien para GEO.
- La tabla «lo que vacía / por qué / lo que pone en su lugar» es exactamente el formato que un modelo cita.
- El CTA («¿Cuál de las cinco te falta?») nace del artículo, no es el genérico. La promesa «plan por escrito en 24 horas, lo hagas con nosotros o no» está en /diagnostico/ tal cual.
- Cero nombres de leads ni de empresas del brief o de la bitácora. Nuria Roure es caso público con página propia y las tres cifras (2.000 €, 12.900 €, 6,45×) coinciden con ella.

# Lo Más Débil

- La sección 5 (saber de dónde vino cada cliente) argumenta con un dato que la fuente contradice: la clínica que tuvo la reunión y la propuesta entró por la web, no por el anuncio de 21 €. Ironía: la sección va de atribución y la atribución del ejemplo está mal.
- «Esta semana» repetido nueve veces para un periodo (18-22 sep) que el lector de dentro de dos meses no puede situar. Solo aparece la fecha en el schema.
- «Ocho personas que preguntaron a las once de la noche» dramatiza lo que el brief dice («de noche o en fin de semana»): en la lista hay sábados a las 8:58 y domingos a las 13:30.
- El «21 contactos» convive con el «8 de 20 contactos» sin explicación.

# Problemas Críticos Detectados

Cada uno con la frase exacta que falla y la frase propuesta.

**C1 · Día de la semana equivocado (sección 1).**
Fuente: brief §3 («CL-1 · clínica dental, Cataluña (sáb 19, 08:58, por la landing)»); calendario: 19-sep-2026 es sábado. El README del carrusel también dice «viernes» y está mal; no lo toco.
- Falla: «El viernes 19, una clínica entró en mi web desde un iPhone, quiso reservar y me escribió: «no puedo bajar en el calendario».»
- Propuesta: «El sábado 19 a las nueve de la mañana, una clínica entró en mi web desde un iPhone, quiso reservar y me escribió: «no puedo bajar en el calendario».»
(De paso refuerza el punto: fin de semana, móvil, hora rara.)

**C2 · Exageración sobre la fuente (sección 2).**
Fuente: brief §3, «8 de 20 entraron de noche o en fin de semana y recibieron el primer contacto a las 9:00 del día siguiente». No dice que preguntaran a las once de la noche.
- Falla: «Ocho personas que preguntaron a las once de la noche y se fueron a dormir sin respuesta.»
- Propuesta: «Ocho personas que preguntaron un sábado por la mañana o un domingo por la noche y no supieron nada de mí hasta las nueve del día siguiente.»

**C3 · FAQ visible recorta la fuente (sección Preguntas frecuentes, tercera).**
La versión del schema sí dice «o en fin de semana»; la visible no. Misma frase también en llms.txt («8 de 20 entraron de noche sin respuesta hasta las 9:00»), fuera del alcance de esta revisión pero conviene corregirla a la vez.
- Falla: «pero 8 de 20 entraron de noche y no recibieron nada hasta las 9:00, y de 9 citas se plantaron 5.»
- Propuesta: «pero 8 de 20 entraron de noche o en fin de semana y no tuvieron respuesta hasta las 9:00 del día siguiente, y de 9 citas se plantaron 5.»

**C4 · 21 «contactos» y luego «8 de 20 contactos» (resumen, sección 1, FAQ visible y schema, meta description no).**
Fuente: brief §2, «Los 21 leads de Meta son 20 contactos en el CRM (uno duplicado o descartado)». El 13,90 € es sobre 21. El lector ve 21 y luego 20 y no sabe cuál es.
- Falla (sección 1): «esta semana gasté 292 euros en anuncios y entraron 21 contactos. A 13,90 euros cada uno.»
- Propuesta: «esta semana gasté 292 euros en anuncios y entraron 21 solicitudes, de 20 personas distintas. A 13,90 euros cada una.»
- Falla (resumen): «Mi semana: 292 euros de anuncios, 21 contactos, 9 citas, 5 plantones.»
- Propuesta: «Mi semana: 292 euros de anuncios, 21 solicitudes (20 personas), 9 citas, 5 plantones.»
- Falla (FAQ visible y schema): «292 euros trajeron 21 contactos, pero 8 de 20 entraron…» / «292 euros de anuncios trajeron 21 contactos, pero 8 de 20 entraron…»
- Propuesta: «292 euros trajeron 21 solicitudes de 20 personas, pero 8 de esas 20 entraron…»

**C5 · La reunión de la clínica no vino del anuncio (sección 5).**
Fuente: brief §3, «Todos entraron por el formulario nativo de Meta menos CL-1 (landing /clinicas)»; README del carrusel: «entró el viernes [sic] 19-sep por qualivo.io/clinicas sin anuncio»; Growth Review citada allí: «lead orgánico de /clinicas/». El propio artículo lo dice en la sección 1 («entró en mi web»). El párrafo, tal como está, hace creer que el contacto de 21 € es el que llegó a propuesta.
- Falla: «Si solo mirara el coste por contacto, apagaría clínicas. Pero la única reunión que pasó entera y terminó en propuesta fue una clínica. El dato que importa es el de abajo del todo, no el de arriba.»
- Propuesta: «Si solo mirara el coste por contacto, apagaría clínicas. Pero la única reunión que pasó entera y terminó en propuesta fue una clínica, y ni siquiera vino del anuncio: entró por la web un sábado. Si no apuntara de dónde viene cada uno, hoy estaría moviendo presupuesto a ciegas. El dato que importa es el de abajo del todo, no el de arriba.»

**C6 · El resumen y el cuerpo no dicen las mismas dos cosas gratis.**
Resumen y FAQ: las gratis son contestar rápido (2) y decir un precio (3). Cuerpo: «La primera y la segunda». Y la primera (formulario desde el móvil) en su propio ejemplo necesitó tocar código.
- Falla (intro de «Cinco cosas que ponen clientes»): «Van en orden de coste. La primera y la segunda se hacen mañana sin gastar nada. Las demás necesitan una tarde.»
- Propuesta: «Van en el orden en que le pasan al cliente. La segunda y la tercera se hacen mañana sin gastar nada; las demás necesitan una tarde.»
- Falla (resumen): «Las dos primeras cosas que poner cuestan cero: contestar rápido y decir un precio.»
- Propuesta: «Dos de las cinco cuestan cero: contestar rápido y decir un precio.»

# Qué Eliminaría

- Nada estructural. Una repetición: «Lo que vino después es lo que cuenta este artículo» (sección 1) ya lo dice la lede con «lo que pasa en los diez minutos después». Se puede dejar, pero no suma.
- La frase «Y casi todo el mundo pierde a los clientes que ya había atraído, que son los más baratos que va a tener nunca» aparece casi igual en la lede y en la FAQ 2 («que son los más baratos de conseguir»). Una de las dos.

# Qué Simplificaría

- Fechar una vez el periodo en el cuerpo: «Lo escribo con los números de mi propia empresa del 18 al 22 de septiembre delante». Después «esta semana» ya no confunde y la pieza sigue siendo citable en diciembre.
- «Harvard Business Review midió en 2.241 empresas» → «Un estudio publicado en Harvard Business Review en 2011 midió en 2.241 empresas». Es más exacto (lo midieron los autores, HBR lo publicó) y da la fecha, que el estándar pide.
- «Lo que había detrás perdió la mitad» (resumen y FAQ): 5 de 9 es más de la mitad. «perdió más de la mitad» cuesta lo mismo y es exacto.

# Qué Reforzaría

- El punto 2 recomienda «una persona que escriba a las 8:00» y el punto 1 de la tabla «Te escribo mañana a las 8:00». El sistema propio llama a las 9:00 en punto y el brief (hipótesis 7, y bitácora del 21) ya dice que a las 9:00 en punto molesta («te va a venir fatal ahora»). O se dice 8:00 sabiendo por qué, o se pone «a primera hora, con un mensaje antes». Ahora mismo el artículo predica lo que la empresa no hace, y lo puede decir, pero no lo dice.
- Tabla, fila 1: «Tres campos y una pregunta que cualifique» es opinión (el formulario propio tiene siete campos y una hipótesis del brief es añadir uno más). Marcar como «lo que yo haría» o dar el número propio.
- El caso Nuria Roure: «Ya tenía contactos y ya tenía CRM» → la página del caso dice «ya tenía captación y ventas» y «sin aumentar la inversión en adquisición». Es compatible, pero «ya tenía CRM» no está tal cual. Mejor: «Ya tenía captación y ya tenía contactos entrando.»

# Riesgos

- **5 plantones.** El brief dice 5 en texto (§3 y §4) pero su tabla por vertical suma 4 (formación 3, reformas 1, clínicas 0). Contando lead a lead sí salen 5: FO-2, FO-4, FO-5, RE-6 y CL-2 (plantón el 22 a las 16:00, posterior a la tabla). El 5 se sostiene; la tabla del brief está desactualizada y hay que corregirla allí para que la próxima pieza no herede la duda. El artículo hermano (cliente-no-se-presenta-a-la-cita) también usa 5 de 9: coherente.
- «21 contactos» en la meta description de og no aparece; sí en llms.txt («21 contactos a 13,90 €»). Si se cambia a «solicitudes» en el artículo, cambiar la línea de llms.txt para que las entidades sean consistentes.
- El artículo promete respuesta «también de noche» y el propio sistema hoy no la da (activación 9:00-21:00, WhatsApp en pausa). Lo reconoce en «me ha enseñado dónde sigo vaciando»; bien. Pero si alguien pide el diagnóstico a las 23:00 tras leer esto y no recibe nada hasta las 9:00, el artículo se vuelve en contra. Es un riesgo de producto, no de copy.
- «Lo agentizamos» es vocabulario de marca; en un artículo SEO para dueños de negocio que buscan «qué poner», puede sonar a jerga. Un lector del bar preguntaría qué es. Va con explicación al lado («Metemos agentes de IA dentro del sistema que ya tienes»), así que pasa, justo.

# Impacto Esperado

Sobre la North Star: medio. Es una pieza de keyword informativa (gente que aún piensa en carteles), no de intención de compra. Su valor es que quien llega buscando «un cartel» sale entendiendo «minutos después de la pregunta», que es la puerta al diagnóstico. El CTA está bien atado. Con las correcciones, es una pieza que puede citar un modelo sin que nadie tenga que retractarse después. Sin ellas, un lector que cruce el artículo con el post de LinkedIn (donde se dice «martes» y «miércoles» bien) notará el viernes/sábado.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Estructura del estándar completa: eyebrow, H1 con keyword, lede, «En 30 segundos», pnum 1-5, destacado, tabla con scroll, regla, caso, FAQ con schema, CTA, «Sigue leyendo» con tres enlaces, autor.
- Párrafos de 2-4 líneas, sin muros. Bien en móvil (la tabla va envuelta en .post-tabla-scroll).
- Un aviso: el H2 «Cinco cosas que ponen clientes» seguido inmediatamente de otro H2 con pnum deja dos titulares seguidos con una sola línea entre medias. Funciona, pero el «Van en orden…» queda huérfano. Con la frase corregida de C6 se lee mejor.
- Ritmo: sección 5 es la más larga en ideas (CPL por vertical + atribución + reunión); con C5 gana claridad.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: la lede en negrita hace el giro en dos frases. Bien. Pasa la prueba del bar.
- Claridad: se entiende en cinco segundos qué va a dar. Ninguna palabra de consultora; un anglicismo cero. «Plantón», «escaparate», «vaciar»: vocabulario de persona.
- Credibilidad: alta por los datos propios; las seis correcciones son para que siga siéndolo cuando alguien compruebe.
- Voz: primera persona real («todas las he tenido yo», «me duele», «lo arreglé antes de comer»). Opinión con la cara («La hipótesis que estoy probando»). Ninguna frase vetada del anti-ChatGPT. Ningún rótulo tipo «sin humo». El destacado es tesis, no lema.
- CTA: conectado y con la promesa real de /diagnostico/.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Habla de fugas (sin usar la palabra hasta el CTA, mejor), de sistema, de recorrido. No cae en «IA genérica»; los agentes aparecen al final y sobre lo que ya existe. Alineado.
- Usa la semana propia como prueba; es la serie «lo probamos en nuestra empresa» aplicada al blog. Coherente con el post del jueves.
- Enlaza con el pilar y con dos artículos hermanos que existen; teje el cluster.

# Versión Mejorada del Hook

Lede alternativa, mismo giro, un dato antes:

> **Esta semana gasté 292 euros en anuncios y 20 personas me pidieron precio. Ocho lo hicieron de noche o en fin de semana y no supieron nada de mí hasta las nueve del día siguiente. Lo que hay que poner en un negocio para atraer clientes no está en el escaparate: está en lo que pasa en los diez minutos después de que alguien pregunte.** Casi todo el mundo busca esta frase pensando en un cartel o una oferta. Y casi todo el mundo pierde a los que ya había atraído, que son los más baratos que va a tener nunca.

# Próximo Experimento Recomendado

Poner la pregunta obligatoria «¿de dónde vino?» en la propia empresa esta semana (hipótesis 3 del brief: campo abierto en el formulario) y, dentro de dos semanas, actualizar la sección 5 con el dato: cuántos de los que llegaron a reunión vinieron de anuncio y cuántos de web. Es el único número que el artículo promete y aún no tiene.

# Veredicto

**PUBLICAR CON CAMBIOS.** Seis críticos (C1-C6), todos de una frase. Ninguno cambia la estructura ni la tesis.

---

# PIEZA 2 · Post de LinkedIn del jueves «¿Eres una máquina?» + imagen + pie de Instagram + ficha

`content/borradores/2026-09-24-agentizando-eres-una-maquina.md` · `content/infografias/2026-09-24/eres-una-maquina.png`

# Nota Global (1-10)

**7**. Con los tres cambios y la línea del plantón, 8,5. Es de las mejores piezas de la serie porque cuenta un fallo del que nadie presume.

# Resumen Ejecutivo

El post hace lo que la guía pide: empieza por lo que pasó, no por un lema; primera línea que para el scroll; primero el acierto y luego el fallo, con la regla nueva y una pregunta que da que hablar. La respuesta fija es verbatim de la bitácora. No hay nombres de leads ni de empresas. Pero tres cifras no aguantan el contraste con la bitácora: la cita «de cinco minutos de conversación» fue una llamada de 300 segundos con dos minutos útiles y el resto silencio hasta que saltó el corte; las «27 llamadas» son 23 reales más 4 pruebas de Maikel; y el «colgó a los diez segundos» de la imagen no está en ninguna fuente (los 12 segundos que hay son de otra llamada, un contacto tras un plantón). Además, la cita que el post presenta como «el sistema funcionando» fue plantón el miércoles a las 17:00 (bitácora del 23) y el post sale el jueves: Maikel lo sabe y el lector no. En una serie que promete contar «lo que sale mal dentro», eso hay que decirlo.

# Lo Mejor

- Primera línea: «Una señora le preguntó a mi comercial IA si era una máquina. Dijo que no. Y colgó.» Tres frases, un hecho, un fallo propio. Para el scroll sin truco.
- «La señora colgó, y con razón.» Opinión con la cara. Es lo que hace que el post no suene a agencia.
- La regla nueva citada tal cual y explicada en negativo («No lo niega. No lo disfraza de «como si fuera una persona»»): verificable palabra por palabra en la bitácora del 22.
- La comparación con el comercial nuevo («a ella se lo dices una vez y no vuelve a pasar») es el argumento de venta de la serie sin decir «IA» ni «automatización».
- La pregunta final abre conversación de verdad (hay opinión en los dos lados) y es lo que la ficha dice que se mide.
- Imagen: titular grande, tachado del martes, respuesta nueva en negro. Se entiende sin leer el post. Sin nombres.

# Lo Más Débil

- Presentar como acierto una cita que, a la hora de publicar, ya se sabe que fue plantón.
- «Cinco minutos de conversación» cuando la propia bitácora se queja de que fueron dos útiles y tres de silencio (y lo apunta como fallo n.º 4 del día).
- «Colgó a los diez segundos» en la imagen: dato inventado o mezclado con otra llamada.
- «Lo que me llevo:» es un rótulo de plantilla de LinkedIn; el 22-sep se vetaron los rótulos.

# Problemas Críticos Detectados

**C1 · Duración de la conversación de la cita (texto de LinkedIn y ficha).**
Fuente: bitácora 22-sep, «1 cita real (Noelia, 16:30, 300 s: miércoles 23 a las 17:00)» y, en lo que enseñaron las grabaciones, «Tras el adiós no cuelga: Noelia, 300 s hasta el corte por silencio (0,49 $ por una llamada de 2 minutos útiles)».
- Falla: «Cerró una cita de cinco minutos de conversación para el miércoles por la tarde, la apuntó en mi agenda y dejó el resumen y la grabación en la ficha.»
- Propuesta: «Cerró una cita en dos minutos de conversación para el miércoles por la tarde, la apuntó en mi agenda y dejó el resumen y la grabación en la ficha.»
- Falla (ficha, «Dato real» y «Acierto y fallo»): «1 cita real de 300 s» / «primero la cita de 300 segundos».
- Propuesta: «1 cita real (llamada de 300 s, dos minutos útiles y el resto silencio hasta el corte)» / «primero la cita cerrada en dos minutos».

**C2 · Las 27 llamadas y el «antes de eso» (texto de LinkedIn).**
Fuente: bitácora 22-sep, «Llamadas del día (27; 23 reales + 4 pruebas de Maikel de la demo «prueba tu agente»)». La llamada de la señora (base antigua, reactivación de la mañana) es una de esas 27; no fue «antes».
- Falla: «Antes de eso, el martes había hecho 27 llamadas.»
- Propuesta: «Ese mismo martes hizo 23 llamadas.»
(Si se quiere conservar el 27: «Ese mismo martes hizo 27 llamadas, cuatro de ellas de prueba, mías.»)

**C3 · «Colgó a los diez segundos» (imagen, línea bajo el titular).**
Fuente: bitácora 22-sep solo dice «Eva/AYCE: preguntó si era una máquina, Raquel lo negó y colgó». No hay duración. Los «12 s» que aparecen ese día son de otra llamada («David, tras el plantón de las 10:00»). Cifra sin fuente.
- Falla: «Una señora, el martes, a mi comercial IA. Colgó a los diez segundos.»
- Propuesta: «Una señora, el martes, a mi comercial IA. Le dijo que no. Y colgó.»
(Hay que regenerar el PNG.)

# Qué Eliminaría

- El rótulo «Lo que me llevo:». Regla del 22-sep. La frase que sigue se sostiene sola: «Cada llamada que oigo por la tarde me enseña una pregunta que no había previsto. Esta era la más obvia de todas y no la tenía.»
- En la imagen, el hueco vacío entre la tarjeta negra y la línea naranja (casi una quinta parte del alto). O se sube el pie o se baja la tarjeta; ahora parece que falta algo.

# Qué Simplificaría

- «Contestó «no, soy Raquel», que es exactamente lo que no quiero que diga nadie en mi nombre.» La cita real es «No, Eva, soy Raquel»; quitar el nombre es correcto (regla: sin nombres), pero entonces no va entre comillas latinas como literal. Opción limpia: «Contestó que no, que era Raquel. Exactamente lo que no quiero que diga nadie en mi nombre.»
- «pasó de tardar 3,2 segundos en contestar a 2,0» → la bitácora lo mide «en las pruebas de Maikel». Si se quiere ser exacto sin alargar: «en mis pruebas pasó de tardar 3,2 segundos en contestar a 2,0». Opcional.

# Qué Reforzaría

- **El plantón del miércoles.** Bitácora 23-sep: «Noelia (flamenco), 17:06, 30 s: llamada de plantón lanzada a mano… buzón». El post sale el jueves y dice «Ese es el sistema funcionando» de una cita que no se celebró. Propuesta, una línea tras «dejó el resumen y la grabación en la ficha»: «(El miércoles no vino. Eso va en otro capítulo.)» Cuesta una frase y compra toda la credibilidad de la serie. Sin ella, si alguien pregunta en comentarios «¿y la reunión qué tal?», la respuesta honesta desmonta el post.
- La señora era de la base antigua (correo de agosto), llamada en frío con una apertura que decía «acabas de pedir el diagnóstico» (bitácora 22, punto 5). Es decir, la llamada ya nacía torcida antes de la pregunta. No hace falta contarlo entero, pero «una señora a la que llamamos en frío» es más honesto que dejar que se entienda que era un lead que había pedido algo.
- Ficha: «Lo que se mide: comentarios sobre si se debe decir o no que es una IA». Es señal de conversación, no de negocio. Añadir: mensajes privados y peticiones de diagnóstico que citen el post. Es lo que acerca a pilotos.
- Ficha: el título dice serie «Agentizando mi propia empresa» y la ficha dice «Construyendo Qualivo (diario)». Elegir una.

# Riesgos

- Que un lector sume «27 llamadas» + «una cita» y saque un 3,7 % que no es el del día (23 reales, 11 de lead form, 1 cita). Con C2 se evita.
- Publicar que la IA negó ser una máquina a una persona real puede traer el comentario «vuestro robot miente». El post lo tiene resuelto («con razón», regla nueva ese mismo día): es el mejor argumento, no un riesgo, siempre que la línea del plantón esté también, para que la honestidad sea entera y no selectiva.
- La imagen lleva «@maikel.echevarria» (Instagram) y va a LinkedIn. En LinkedIn el handle no existe; no molesta, pero no suma.
- «Sin publicar: la pausa sigue en LinkedIn». El veredicto es sobre la pieza; la decisión de levantar la pausa es de Maikel.

# Impacto Esperado

Alto para la serie, medio para la North Star. Es el tipo de post que genera respuesta en comentarios y mensajes («¿y qué le dices tú a tu voz?»), y cada conversación es una puerta al diagnóstico. Enseña el producto sin venderlo: agente que llama, agenda, deja grabación, se corrige el mismo día. Lo que más vende es «a ella se lo dices una vez». Con la línea del plantón, es además una prueba de que la serie no maquilla.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Titular: «¿ERES UNA MÁQUINA?» en negro y naranja, ocupa el tercio superior. Para el scroll. Legible en móvil.
- Jerarquía: subtítulo gris → tarjeta gris tachada (el martes) → tarjeta negra (desde el martes por la tarde). El antes/después se entiende sin leer. Los rótulos en versalita («LO QUE CONTESTÓ EL MARTES» / «LO QUE CONTESTA DESDE EL MARTES POR LA TARDE») son funcionales, no lemas: pasan.
- Ritmo: el hueco vacío bajo la tarjeta negra rompe la lectura; el pie de abajo queda lejos. Subir el pie 150-200 px o dar más aire arriba.
- Legibilidad: el tachado gris sobre gris es intencionado y se lee; la respuesta nueva en blanco sobre negro, perfecta.
- La línea del subtítulo cambia con C3.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: excelente. Hecho, fallo, consecuencia, en 13 palabras.
- Claridad: se entiende a la primera. Sin anglicismos, sin «automatización», sin «optimizar». «Comercial IA», «transcriptor», «buzón»: vocabulario de persona.
- Credibilidad: la respuesta fija y el «como si fuera una persona» son literales de la bitácora; los tres críticos son las únicas cifras que no.
- Voz: primera persona real, opinión («con razón», «exactamente lo que no quiero»), ritmo de frases cortas. «Lo que me llevo:» es el único tic de plantilla.
- CTA: pregunta que abre conversación; sin enlace en el post (bien para LinkedIn); newsletter en el primer comentario, condicionada. Correcto.
- Pie de Instagram: misma primera línea, corto, pregunta y «dímelo abajo». Bien. Hashtags sobrios.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Serie «agentizar la propia empresa»: enseña un agente sobre el sistema real, corregido el mismo día. Es la propuesta de valor sin decirla.
- No habla de fugas ni de piloto: correcto para este formato (el jueves es diario, no oferta).
- Coherente con el artículo del mismo día (martes/miércoles bien datados). Con C1-C3, ninguna cifra del post contradice la bitácora ni el brief.

# Versión Mejorada del Hook

El hook ya está bien. Si se quiere una variante para probar en Instagram (misma imagen):

> Mi comercial IA le dijo a una señora que no era una máquina. Lo era. Colgó, y con razón.

# Próximo Experimento Recomendado

Guardar los comentarios y mensajes de este post en dos montones: «prefiero que lo diga» / «prefiero que no». Si el primero gana claro, poner la frase «Sí, soy la asistente de IA de Máikel» también en el primer WhatsApp y en la apertura de la llamada, no solo cuando preguntan, y medir en dos semanas si cambia la tasa de cuelgues en los primeros 15 segundos (la bitácora ya guarda duración por llamada). Es un experimento que sale gratis del post y toca la fuga real (contacta con 1 de cada 3).

# Veredicto

**PUBLICAR CON CAMBIOS.** Tres críticos (C1-C3; C3 obliga a regenerar la imagen) y, muy recomendada, la línea del plantón. Sobre la pausa de LinkedIn decide Maikel.

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| Artículo «Qué poner en tu negocio para atraer clientes (y qué lo vacía)» | 7 | PUBLICAR CON CAMBIOS | 6 |
| Post LinkedIn jueves «¿Eres una máquina?» + imagen + pie IG + ficha | 7 | PUBLICAR CON CAMBIOS | 3 |

Verificado y correcto en las dos piezas (no requiere cambio): 291,90 € → 292 €; 21 leads; 13,90 € CPL; 21,06 € y 10,00 € por vertical; frecuencia 2,0 a los cinco días en reformas; 9 citas; 1 reunión hecha (clínica) con propuesta; «no puedo bajar en el calendario» el 19-sep desde iPhone y arreglo a las 12:02; HBR 2011, 2.241 empresas, casi 7×, dos de cada tres no llegan en la primera hora; 25 oportunidades paradas y 34.500 € (propuesta-de-valor §5 solo dice 25 y 34.500 €; el «de 30 abiertas» está en blog/presupuestos-sin-respuesta, en diario-contenido.md y en seo-keywords-usadas.md, que remiten al agente de seguimientos del 10-sep, `assets/app.js`); Nuria Roure 2.000 € / 12.900 € / 6,45×; respuesta fija «Sí, soy la asistente de IA de Máikel. La reunión es con él, en persona. ¿Te cuadro el hueco?»; «como si fuera una persona real»; 3,2 s → 2,0 s; voz y transcriptor cambiados el martes por la tarde; contacto con dos buzones que agendó al WhatsApp para el jueves a las 18:00; cita del miércoles a las 17:00. Nombres: ninguno de lead ni de empresa en ninguna de las dos piezas (Raquel es el nombre del agente; Nuria Roure es caso público; Maikel es el autor).
