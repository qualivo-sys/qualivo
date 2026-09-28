# Revisión · Qualivo Master Reviewer · 28-sep-2026

> Tres piezas revisadas contra sus fuentes: el artículo nuevo «Formulario de
> Facebook o landing page», la reorientación de «Captación de leads» (error 3,
> destacado y bloque post-cta) y el post de LinkedIn del lunes «Dos preguntas
> antes de la llamada» con su ficha e imagen.
>
> Fuentes contrastadas: bus/out/demand.jsonl (aviso 17:25 y daily 19:40 del
> 27-sep), content/brief-recorrido-semana-38.md (§1.1, §1.2, §1.4, §2, §3, §5),
> api/meta-leadform.js (formulario 1089963670593608 y comentario del 28-sep),
> api/_scoring.js (cabecera, tipologia(), comportamiento(), nivel()),
> api/activacion.js (cabecera de la cadencia del 28-sep), api/_activacion.js
> (número de la pasarela), captacion/agente-llamadas/bitacora-raquel.md,
> diagnostico/index.html (15 minutos y plan en 24 h), blog/coste-por-lead,
> llms.txt y el resto del blog (buscando cifras de plantones).
>
> Calendario comprobado: 27-sep-2026 es domingo, 28-sep lunes, 5-oct lunes.
>
> Recuento propio de §3 del brief (mandan las filas, no el resumen):
> «nada todavía» = 6 (CL-2, FO-2, FO-7, RE-1, RE-5, RE-7). «Menos de 500 €» = 8
> (CL-1, CL-3, FO-1, FO-4, FO-5, RE-2, RE-4, RE-8). Total 14 de 20. El resumen
> del brief dice 5 «no invierto nada»: está mal, son 6, pero el 14 sale igual.
> «No lo sé» en «dónde se le escapa» = 10 de 20 (CL-4, FO-1, FO-7, RE-1, RE-2,
> RE-3, RE-4, RE-6, RE-7, RE-8). «La mitad» es exacto.
>
> Nota de estado: las tres piezas ya están en el commit f4a2993. Si el artículo
> ya se ha desplegado, los críticos se corrigen hoy.

---

# PIEZA 1 · Artículo «Formulario de Facebook o landing page: qué trae más citas»

`blog/formulario-de-facebook-o-landing-page/index.html` · keyword «formulario de Facebook o landing page»

# Nota Global (1-10)

**6**. Sube a 8,5 con los diez cambios de frase de abajo. Ninguno pide rehacer la estructura.

# Resumen Ejecutivo

Los números están bien. 14 citas, 12 por el formulario y 2 por la web (una de clínicas y otra de reformas), coinciden con el daily del 27-sep. «De los primeros 20, 14 invertían menos de 500 € o nada» y «la mitad marcó no lo sé» cuadran con las filas del brief. El cambio del 27-sep (quitar la inversión, meter cuándo y precio) coincide con el aviso del bus y con el código. Y el artículo hace lo más difícil: enseña un dato que le favorece y explica por qué no demuestra nada.

Lo que falla es el envoltorio de la tesis. La idea de que «lo que manda son las preguntas y no el formato» aparece cinco veces (meta description, lede, «En 30 segundos», regla y FAQ). Varias usan el giro prohibido «no es X, es Y», y todas la dan por probada cuando el propio texto dice «Todavía no sé si funciona». Además hay tres frases que describen mal el sistema o la prueba en marcha: «este mes» y «sí» no bastan para que llame Maikel, y la medición no compara vías «con el mismo anuncio». Son frases sueltas y se arreglan en veinte minutos.

# Lo Mejor

- La honestidad con el dato propio: «12 de 14 entraron por el formulario… Eso no demuestra que el formulario sea mejor. Casi todo el dinero iba al formulario.» Es verdad (§1.1: los tres anuncios activos eran de formulario instantáneo, §2: los 291,90 € de la semana fueron a ellos, §3: todos por el formulario nativo menos CL-1 y un lead de reformas por landing) y es exactamente lo que un resultado de Google no te cuenta.
- El fallo, bien contado y corto: 14 de 20 con menos de 500 € o nada, y la mitad «no lo sé». Recuento propio, correcto.
- Primera persona real, fechada y con código detrás: «El 27 de septiembre… Quité la de cuánto invierte y metí dos nuevas».
- Toma partido y admite que no sabe el resultado. «Lo contaré con el resultado, salga bien o salga mal» es la voz de la guía.
- El FAQ del schema coincide palabra por palabra con el FAQ visible. Fechas en schema, autor con la grafía correcta, keyword en H1, title, URL y breadcrumb.
- La promesa del CTA (quince minutos, plan por escrito en 24 horas) está tal cual en /diagnostico/.
- Cero nombres de leads. Cero cifras de plantones. Cero mención al 663 o a WhatsApp automatizado.

# Lo Más Débil

- La tesis se afirma como hecho cinco veces y el artículo reconoce que está sin probar. Un lector atento lo pilla: el experimento dura siete días y la regla dice «casi siempre».
- El giro «no es X, es Y» en la meta description, el lede, «Eso no mide… Mide…», la regla y el FAQ. Es justo lo que delata texto de máquina.
- La descripción del sistema es más bonita que el código: «quien dice este mes y sí pasa delante… el sistema lee esas dos respuestas y decide» (ver C9).
- La medición que se anuncia («por cada vía, con el mismo anuncio») no existe: no hay anuncio a la landing, y la sección 3 del propio artículo exige «el mismo anuncio y un gasto parecido».
- Es un artículo de comparación sin tabla comparativa.

# Problemas Críticos Detectados

**C1 · Meta description y `Article.description` del schema: giro prohibido.**
- Falla: «Formulario instantáneo de Meta o página propia: lo que cambia no es el formato, son las preguntas. Con las citas de mis propios anuncios y lo que cambié el 27 de septiembre.»
- Propuesta: «Formulario instantáneo de Meta o página propia: qué trae más citas, con los números de mis propios anuncios y las dos preguntas que añadí al formulario el 27 de septiembre.»

**C2 · Lede: giro prohibido disfrazado y «casi todo el mundo» sin respaldo.**
- Falla: «Casi todo el mundo plantea esta pregunta como si fuera de formato. No lo es. Un formulario de Facebook y una landing page pueden traerte el mismo tipo de contacto o uno muy distinto. Lo que marca la diferencia son las preguntas que haces antes de que alguien envíe sus datos, y lo que pasa en los minutos siguientes.»
- Propuesta: «Un formulario de Facebook y una landing page pueden traerte el mismo tipo de contacto o uno muy distinto. Mi opinión, después de mirar mis propios anuncios: pesa más lo que preguntas antes de que alguien envíe sus datos, y lo que pasa en los minutos siguientes, que el sitio donde lo preguntas.»

**C3 · «Mis números»: giro prohibido.**
- Falla: «Eso no mide qué puerta es mejor. Mide por dónde mandé a la gente.»
- Propuesta: «Eso cuenta por dónde mandé a la gente. Para saber qué puerta es mejor, tendría que mandar a la misma gente, con el mismo dinero, a las dos.»

**C4 · «En 30 segundos», punto 4: afirma un resultado que no existe todavía.** El daily del 27-sep no dice que las preguntas cambien el resultado. Dice que se va a medir en 7 días.
- Falla: «Lo que sí cambia el resultado son las preguntas. El 27 de septiembre metí dos nuevas en el formulario: cuándo quiere empezar y si le encaja el precio de entrada.»
- Propuesta: «Lo que he cambiado son las preguntas. El 27 de septiembre quité la de cuánto invierte y metí dos nuevas: cuándo quiere empezar y si le encaja el precio de entrada. El resultado, en siete días.»

**C5 · Regla: giro prohibido y «casi siempre» sin respaldo** (el artículo reconoce «Todavía no sé si funciona»).
- Falla: «No cambies de formulario a landing, ni al revés, hasta haber mirado las preguntas. Casi siempre el arreglo está en lo que preguntas, no en dónde lo preguntas.»
- Propuesta: «No cambies de formulario a landing, ni al revés, hasta haber mirado las preguntas. Cambiar una pregunta se hace en una tarde, y en una semana sabes si ha servido.»

**C6 · FAQ 2 (visible y schema): giro prohibido y una hipótesis dada como hecho.** El brief §5.2 lo plantea como hipótesis («Esta semana 0 leads de landing, no comparable»).
- Falla: «Depende de lo que pase después. El formulario trae más contactos porque cuesta menos enviarlo, y también más curiosos. La landing trae menos, con más contexto. Lo que decide es qué preguntas haces y lo rápido que contestas, no el formato.»
- Propuesta: «Depende de lo que pase después. El formulario suele traer más contactos, porque cuesta menos enviarlo, y también más curiosos. La landing suele traer menos. Mi recomendación es mirar primero qué preguntas haces y lo rápido que contestas, y solo después cambiar de formato.»

**C7 · Hipótesis contadas como hecho** («En 30 segundos», punto 3, y primer H2). Mismo motivo que C6: no hay dato propio de la landing con gasto comparable.
- Falla: «El formulario cuesta muy poco de enviar. Trae volumen y también curiosos. La landing trae menos, con más contexto.»
- Propuesta: «El formulario cuesta muy poco de enviar. Suele traer volumen y también curiosos. La landing, en teoría, trae menos gente y con más contexto. En mis anuncios todavía no lo he podido comparar.»
- Falla: «Por eso trae más contactos por el mismo dinero.»
- Propuesta: «Por eso suele traer más contactos por el mismo dinero.»

**C8 · Primer H2: dos claims sin fuente.** «Dos toques» choca con el formulario propio (pantalla de intro, volumen, fuga, cuándo, precio y datos). «Sin acordarse de haberlo enviado» no está en el brief ni en la bitácora de Raquel (el «no me acuerdo» del 16-sep es la respuesta a otra pregunta).
- Falla: «Enviarlo son dos toques.»
- Propuesta: «Si el formulario solo pide los datos, enviarlo son dos toques.»
- Falla: «Se envía casi sin pensar, y a veces sin acordarse después de haberlo enviado.»
- Propuesta: «Se envía casi sin pensar.»

**C9 · «Lo que cambié el 27 de septiembre»: el sistema descrito no es el del código.** En `api/_scoring.js`, «este mes» suma 3 al comportamiento y «sí» pone 4 en la tipología. Sin contestar, un «este mes + sí» con 20-50 peticiones al mes se queda en B (tipología 8, comportamiento 3) y le llama Raquel, no Maikel. Solo llega a A sin contestar si además tiene más de 50 peticiones (tipología 9). «Solo estoy mirando» con precio «sí» puede ser B y recibir llamada. Y la llamada sale a las 2 h 30, no «mañana a primera hora».
- Falla: «Quien marca «solo estoy mirando» o «ahora mismo no» sigue siendo bienvenido, pero no necesita una llamada mañana a primera hora. Y quien dice «este mes» y «sí» pasa delante. El sistema lee esas dos respuestas y decide quién recibe una llamada y quién solo un mensaje.»
- Propuesta: «Quien marca «solo estoy mirando» o «ahora mismo no» sigue siendo bienvenido, pero baja en la nota. Quien dice «este mes» y «sí» sube. El sistema junta esas respuestas con lo demás que sabe del contacto, como cuántas peticiones recibe al mes o si ha contestado. Si a las dos horas y media no ha respondido, la nota decide quién le llama: yo, mi comercial IA o nadie.»

**C10 · La prueba en marcha no es la que se cuenta.** El aviso del 27-sep mide «por nivel y por ruta» y el anuncio nuevo lleva «mismo vídeo y texto» que el viejo, con formulario nuevo. No hay anuncio a la landing, así que no hay comparación por vía «con el mismo anuncio». Tal como está, además, contradice la sección 3 y la FAQ 4 del propio artículo.
- Falla: «La regla es no tocar nada en siete días y medir cuántas reuniones se celebran por cada vía, con el mismo anuncio.»
- Propuesta: «La regla es no tocar nada en siete días y contar cuántas reuniones se celebran, según la nota de cada contacto y quién le llamó. El anuncio es el mismo de antes, solo cambia el formulario.»

# Qué Eliminaría

- El H2 vacío «Cómo decidir en tu caso» seguido de otro H2. O lleva una frase de respuesta («Mira tres cosas, por este orden») o se quita.
- La repetición de «cuenta citas celebradas, no contactos». Sale en el H2 3, en su párrafo y en la FAQ 4, y en LinkedIn otra vez. No es el giro prohibido (es una instrucción), pero repetido tres veces suena a plantilla. Una vez basta.

# Qué Simplificaría

- «Cambié las preguntas del formulario de formación.» Quien llega de Google no sabe que «formación» es el anuncio para academias. Mejor «del formulario del anuncio para academias y centros de formación».
- FAQ 3: «para que no baje demasiado el volumen» es una apuesta, no un dato (Paid vigila si baja más de un 40 %). Mejor «para que el volumen no se hunda».
- «Si nadie contesta en los primeros minutos, da igual la vía.» Absoluto. «Casi da igual la vía» dice lo mismo sin exagerar.

# Qué Reforzaría

- **Una tabla** (`.post-tabla`). Es un artículo de comparación y el estándar pide cada comparación importante en tabla (GEO §4). Filas: fricción, volumen, contexto del contacto, qué preguntar, mis citas (12 frente a 2, con la nota «casi todo el gasto iba al formulario»).
- El dato de la semana del 18 al 22 en un `.post-caso` o `.post-flow`: 20 contactos, 14 con menos de 500 € o nada, 10 con «no lo sé». Es la frase que un modelo citaría.
- Primer H2 con definición «X es Y»: «El formulario instantáneo es el que se abre dentro de Facebook o Instagram al tocar el anuncio.»
- El «Sigue leyendo» enlaza a «Qué poner en tu negocio para atraer clientes», que publica «De 9 citas… 5 fueron plantón». Cambiarlo por /blog/prueba-a-tu-empresa/, que está limpio (y que la reorientación de captación ha dejado de enlazar).

# Riesgos

- **Plantones.** Esta pieza no da la tasa ni permite deducirla. Pero cuando se publique el resultado prometido, no se pueden dar a la vez citas y reuniones celebradas de la misma cohorte (con 14 citas publicadas hoy, cualquier «X celebradas» deja la tasa a la vista). Contar solo celebradas por nivel y ruta.
- **Fuera de alcance pero urgente:** la tasa propia ya está publicada en `blog/que-poner-en-tu-negocio-para-atraer-clientes`, `blog/leads-pero-no-ventas`, `blog/cliente-no-se-presenta-a-la-cita`, `blog/index.html` y `llms.txt` («9 citas, 5 plantones»). Choca con la regla de Maikel. No lo he tocado. Lo decide él.
- **Incoherencia del cluster:** `blog/coste-por-lead` dice «en mis campañas el formulario pregunta cuánto invierte ya», y este artículo dice que esa pregunta se quitó. Quien salta de uno a otro lo ve. Basta una línea en coste-por-lead («hasta el 27 de septiembre»).
- La línea de `llms.txt` de este artículo repite el giro prohibido («no es el formato sino las preguntas»). Hay que cambiarla a la vez que C1.
- Si la prueba sale mal, el artículo queda con una tesis que su propio dato desmiente. Con C4, C5 y C6 aplicados, el riesgo desaparece.

# Impacto Esperado

Medio-alto para diagnósticos. La keyword tiene intención de dueño de negocio que ya invierte en Meta, que es el cliente de Qualivo, y el CTA conecta con el problema («¿Sabes por qué vía te entran las reuniones que se celebran?»). Es además la pieza que las IA pueden citar con dato propio. La promesa de contar el resultado da una segunda pieza en una semana. Poco impacto directo en pilotos hasta que tenga tráfico.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Jerarquía correcta: eyebrow, H1 con keyword, enlace al pilar, lede, tarjeta oscura, H2 por idea, pnum en los pasos, destacado, regla, FAQ, CTA, autor. Párrafos cortos, se lee bien en el móvil. Falta la tabla (ver Qué Reforzaría), y el caso con número va en prosa cuando el catálogo tiene `.post-caso` para eso. Dos H2 seguidos sin texto entre medias rompen el ritmo.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: el H1 es claro. El lede arranca con una negación («No lo es») cuando tiene un dato mucho mejor para arrancar.
- Claridad: alta. Sin anglicismos gratuitos. «Landing page» es el término de búsqueda.
- Credibilidad: los números aguantan la verificación. Lo que resta es la tesis afirmada sin prueba y la descripción del sistema (C4 a C10).
- CTA: conectado al tema y con la promesa exacta de /diagnostico/. Bien.
- Raya larga y punto y coma: ninguno en el texto visible. Bien.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Habla de fugas entre el anuncio y la reunión, de sistema y de medir reuniones, no de herramientas. «Ponemos agentes de IA en el punto donde se pierden los contactos, dentro del CRM que ya usas» está bien anclado. Acerca a pilotos por la vía correcta: diagnóstico de 15 minutos. Falta un puente al piloto (qué pasa después del diagnóstico), que en un artículo de blog es opcional.

# Versión Mejorada del Hook

Lede: «De las 14 citas que han salido de mis anuncios, 12 entraron por el formulario de Facebook. Parece que gana el formulario por goleada. Todavía no lo puedo decir, y te cuento por qué.»

# Próximo Experimento Recomendado

La prueba del brief §5.2, cuando pasen los 7 días sin tocar: un anuncio con el mismo creativo a la landing de formación, 10 €/día, dos semanas, midiendo reuniones celebradas por vía. Es lo único que responde de verdad al título. En el artículo: UTM propia en el CTA para contar diagnósticos que salen de esta pieza.

# Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 2 · Reorientación de «Captación de leads» (error 3, destacado y bloque post-cta)

`blog/captacion-de-leads/index.html` · solo las partes cambiadas y su encaje

# Nota Global (1-10)

**8**.

# Resumen Ejecutivo

Buen cambio. El error 3 deja de ser abstracto («atribución rota») y pasa a tener un dato propio verificado (12 de 14 citas por el formulario, con casi todo el dinero ahí) y un enlace al artículo nuevo. El destacado sustituye una metáfora recargada (grifo, circuito, junta, charco) por una frase que se entiende a la primera. El CTA pasa de dos botones y «90 segundos» a un solo botón con la promesa real de /diagnostico/ (quince minutos, plan en 24 horas). Encaja con lo anterior: la sección «Cualificar en origen» ya citaba «cuándo quiere empezar» como pregunta filtro. Sin críticos.

# Lo Mejor

- «En mis propios anuncios, 12 de 14 citas entraron por el formulario de Facebook, y eso no demostraba que fuera la mejor vía: casi todo el dinero iba ahí.» Dato correcto (daily 27-sep), bien contextualizado y en primera persona.
- Destacado nuevo: «Si se te escapan los contactos entre el formulario y la reunión, más anuncios solo traen más contactos que se pierden igual.» Habla de fugas en lenguaje de bar.
- CTA con una sola acción y promesa verificable. Menos fricción.
- Ninguna cifra de plantones, ningún nombre, sin raya larga ni punto y coma en lo nuevo.

# Lo Más Débil

- El H3 dice «datos que no son verdad» y el ejemplo nuevo es un dato verdadero mal leído. No se contradicen del todo, pero no casan.
- «Salimos con dónde se pierden» suena a traducción.

# Problemas Críticos Detectados

Ninguno.

# Qué Eliminaría

- Nada de lo nuevo.

# Qué Simplificaría

- «Salimos con dónde se pierden, y el plan por escrito te lo quedas en 24 horas.» → «Sales sabiendo dónde se pierden, y el plan por escrito te lo quedas en 24 horas.»
- «Y medir reuniones que se celebran, no formularios.» Es instrucción, no el giro prohibido, pero es la misma muletilla que se repite en el artículo nuevo y en LinkedIn. Alternativa: «Y lo que se mide son las reuniones que se celebran.»

# Qué Reforzaría

- Puente entre el H3 y el ejemplo: empezar el párrafo con «Un dato puede ser cierto y aun así engañarte.» Así el ejemplo encaja con «datos que no son verdad».
- En «Cualificar en origen», donde ya aparece «cuándo quiere empezar», un enlace al artículo nuevo. Es el sitio natural.

# Riesgos

- Fuera de alcance: el `dateModified` pasa a 28-sep y reactiva la página, pero la `description` del schema de este mismo fichero dice «La captación de leads no es un problema de volumen sino de sistema», que es el giro prohibido. El texto antiguo también lleva rayas largas. No lo he revisado a fondo porque no era el encargo, pero conviene arreglarlo en la próxima pasada.
- Se pierde el enlace a /blog/prueba-a-tu-empresa/. No es grave: tiene diez enlaces internos más. Y el artículo nuevo lo puede recoger (ver Pieza 1).

# Impacto Esperado

Medio. Es el pilar del cluster: pasa tráfico al artículo nuevo y el CTA simplificado debería subir el clic a /diagnostico/.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Sin cambios de estructura. El párrafo del error 3 queda en unas cinco líneas en el móvil, en el límite del estándar. Un solo botón en el CTA es más limpio.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

Claro, con dato y con voz. El destacado es subrayable. El CTA pregunta por el problema del artículo («¿Sabes en qué punto se te van los contactos?»). Bien.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Fugas, sistema, medir reuniones. Alineado. Lleva al diagnóstico, que es el paso anterior al piloto.

# Versión Mejorada del Hook

Destacado, si se quiere más filo: «Más anuncios sobre un sistema que pierde contactos es pagar más por perder lo mismo.»

# Próximo Experimento Recomendado

Contar durante dos semanas los clics del pilar al artículo nuevo y los de su CTA a /diagnostico/, frente a las dos semanas anteriores con el CTA doble.

# Veredicto: PUBLICAR

---

# PIEZA 3 · Post de LinkedIn del lunes «Dos preguntas antes de la llamada» (texto, ficha e imagen)

`content/borradores/2026-09-28-agentizando-dos-preguntas.md` · `content/infografias/2026-09-28/dos-preguntas.png`

# Nota Global (1-10)

**7**. Sube a 8,5 con los cinco cambios de abajo.

# Resumen Ejecutivo

Buen post. Empieza por lo que pasó, cuenta el acierto con dato (12 de 14 citas por el formulario) antes del fallo corto (14 de 20 con menos de 500 € o nada), explica el sistema en tres líneas A / B-C / D y termina con una pregunta que invita a contestar. La ruta a las 2 h 30 coincide con `api/activacion.js` («A → aviso al móvil de Maikel para que llame él», «B/C → una sola llamada de Raquel», «D → sin llamada, solo WhatsApp») y «Antes llamábamos a todos igual» coincide con la cadencia vieja del brief §1.4 (voz 1 y voz 2 de Raquel para todos). La ficha cumple las reglas: no hay plantones, ni nombres, ni canal del primer mensaje.

Fallan cinco frases: tres referencias de fecha que no aguantan (y LinkedIn está en pausa, así que la fecha real de salida es incierta), un «el formulario me funciona» que la fuente no dice y que contradice el artículo del mismo día, el giro prohibido «no es la pregunta, es lo que hace el sistema», una descripción de a quién llama Maikel que el código no respalda, y una imagen que cita una pregunta del formulario que no existe con esas palabras.

# Lo Mejor

- El hook va contra lo esperado y es verdad: el formulario nuevo incluye el precio (`api/_scoring.js`, 28-sep: «Nuestros proyectos empiezan desde 750 €/mes. ¿Encaja?»).
- Acierto con dato y fallo corto, en ese orden. Las dos cifras verificadas.
- Las rutas A / B-C / D, fáciles de leer y fieles al código.
- «No sé si va a funcionar» y la regla de siete días sin tocar (aviso del 27-sep: «No tocar nada en 7 días»).
- La pregunta final («¿Tú pones el precio antes de la primera llamada, o te lo guardas?») abre conversación de dueño de negocio, no de marketer.
- La imagen se entiende en cinco segundos: el formulario arriba, las tres rutas abajo. La nota al pie («contestar, coger cita o no presentarse la mueven») es fiel a la cabecera de `_scoring.js`.
- Sin raya larga ni punto y coma. «Recibe mensajes» no dice por qué número salen, y hoy salen por el 647 oficial (`_activacion.js`, desde el 23-sep), así que no hay nada que parezca envío automático desde el número personal de Maikel.

# Lo Más Débil

- «Y el formulario me funciona» usa el 12 de 14 como prueba de éxito el mismo día que el blog explica que ese dato no prueba nada. Y el formulario también trajo cinco de los seis plantones (daily del 27-sep). Si alguien pregunta en comentarios «¿y cuántas de las 14 vinieron?», la frase le lleva justo ahí.
- El hook promete el precio y el post no lo da. Funciona si es deliberado (la ficha lo propone), pero entonces la imagen no puede fingir que el formulario dice «Este es el precio de entrada».

# Problemas Críticos Detectados

**L1 · Fechas que no aguantan.** El cambio fue el domingo 27 (semana anterior al lunes 28), y LinkedIn está en pausa, así que el post puede salir otro día.
- Falla: «Esta semana he puesto el precio en el formulario de mis anuncios.»
- Propuesta: «El domingo 27 puse el precio en el formulario de mis anuncios.»
- Falla: «Así que el domingo cambié dos cosas.»
- Propuesta: «Así que cambié dos cosas.»
- Falla: «Os lo cuento el lunes que viene, salga como salga.»
- Propuesta: «Os lo cuento cuando pasen los siete días, salga como salga.»

**L2 · «Me funciona» no está en la fuente.** El daily dice «El formulario nativo SÍ trae reuniones», no que funcione.
- Falla: «Y el formulario me funciona. De las 14 citas que han salido de mis anuncios, 12 entraron por el formulario de Facebook.»
- Propuesta: «Y el formulario trae citas. De las 14 que han salido de mis anuncios, 12 entraron por él.»

**L3 · Giro prohibido.**
- Falla: «Lo interesante no es la pregunta. Es lo que hace el sistema con la respuesta.»
- Propuesta: «Lo que me gusta es lo que hace el sistema con las respuestas.»

**L4 · El código no hace eso.** Con `_scoring.js`, «este mes» y «sí» sin contestar dan A solo si además hay más de 50 peticiones al mes. Si no, es B y llama Raquel.
- Falla: «Ahora mi tiempo va a quien dijo «este mes» y «sí».»
- Propuesta: «Ahora mi tiempo va a los que tienen la nota más alta. Decir «este mes» y «sí» la sube.»

**L5 · Imagen: cita como «MI FORMULARIO» una pregunta que el formulario no hace.** La real es «Nuestros proyectos empiezan desde 750 €/mes. ¿Encaja con lo que buscas?» (`api/meta-leadform.js` y `_scoring.js`, 28-sep, y aviso del bus: «Desde 750 €/mes, ¿encaja?»).
- Falla: «Este es el precio de entrada. ¿Encaja?»
- Propuesta: «Nuestros proyectos empiezan desde ●●● €/mes. ¿Encaja con lo que buscas?» (la cifra tapada mientras Maikel decide, o «750» si dice que sí).

# Qué Eliminaría

- El rótulo «AGENTIZANDO MI PROPIA EMPRESA» en la cabecera de la imagen. Es la serie de Maikel y lo decide él, pero la regla del 22-sep incluye los nombres de serie que suenan a máquina, y «agentizando» no pasa la prueba del bar. La imagen se sostiene sola con «Dos preguntas antes de la llamada».

# Qué Simplificaría

- «Pero también entra mucha gente que solo está mirando.» «Solo estoy mirando» es ahora una opción del formulario y el dato que sigue es de inversión, no de esa respuesta. Mejor: «Pero también entra mucha gente que todavía no invierte en esto.»
- «contar las reuniones que se celebran, no los contactos»: la misma muletilla que en el blog. Vale una vez en toda la semana.

# Qué Reforzaría

- La serie es «agentizando mi propia empresa» y el daily dice que el cambio lo hizo el agente de Growth con el ok de Maikel. Contarlo así («Se lo pedí a mi agente de growth el domingo y a las siete de la tarde estaba en marcha») es más fiel y más de la serie. Decisión de Maikel.
- En la imagen, una pista de qué es A: «A (la nota más alta)». Quien no lee el texto no sabe que A es lo mejor.

# Riesgos

- **Plantones la semana que viene.** El post publica 14 citas y promete contar reuniones celebradas. Si el seguimiento da citas y celebradas de la misma cohorte, la tasa queda a la vista. Contar solo celebradas por nivel y ruta, sin denominador de citas. Y llevar preparada la respuesta a «¿cuántas de las 14 vinieron?» (por ejemplo, «lo cuento cuando tenga la semana entera»).
- **Precio en comentarios.** Si la cifra no se dice, habrá quien la pida. La ficha ya lo mide. Conviene que Maikel decida antes de publicar si contesta por privado.
- **LinkedIn en pausa:** con L1 aplicado, el texto aguanta aunque salga otro día. Sin L1, no.

# Impacto Esperado

Medio para conversaciones. El tema (precio antes de la llamada) es de dueño de negocio y abre debate. Si Maikel contesta los comentarios con una pregunta y pasa a privado a quien tenga el problema, puede salir algún diagnóstico. No va a mover pilotos solo.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Portada clara y específica. Titular grande con «ANTES» en naranja, bloque oscuro con el formulario, tres filas A / B-C / D y una nota al pie. Se lee en el móvil. Dos detalles: el rótulo de serie arriba (ver Qué Eliminaría) y la firma «@maikel.echevarria», que tiene formato de Instagram en una pieza de LinkedIn.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: fuerte y verdadero. Con L1 queda fechado sin perder fuerza.
- Claridad: alta, frases cortas, se lee en voz alta sin ahogarse.
- Credibilidad: cifras verificadas. Resta «me funciona» (L2) y la frase de «este mes y sí» (L4).
- CTA: pregunta de conversación, adecuada para LinkedIn.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Enseña el sistema de Qualivo aplicado a Qualivo: cualificar en origen y decidir a quién se llama. Es la demostración más creíble de lo que se vende. Habla de dónde se va el tiempo comercial, no de IA genérica. Encaja con la North Star si los comentarios se convierten en conversaciones privadas.

# Versión Mejorada del Hook

«El domingo 27 puse el precio en el formulario de mis anuncios. Justo lo que todo el mundo te dice que no hagas.»

# Próximo Experimento Recomendado

Contar en los 7 días siguientes a la publicación las conversaciones privadas y los diagnósticos que salgan del post, separando a quien pregunta el precio de quien cuenta que lo esconde. Si el precio en el formulario no hunde el volumen de leads (Paid avisa por debajo de −40 %), el siguiente post es el resultado por nivel.

# Veredicto: PUBLICAR CON CAMBIOS

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| Artículo «Formulario de Facebook o landing page» | 6 | PUBLICAR CON CAMBIOS | 10 |
| Reorientación «Captación de leads» (error 3, destacado, post-cta) | 8 | PUBLICAR | 0 |
| Post de LinkedIn «Dos preguntas antes de la llamada» + imagen | 7 | PUBLICAR CON CAMBIOS | 5 |
