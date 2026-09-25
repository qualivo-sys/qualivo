# Revisión · Qualivo Master Reviewer · 25-sep-2026

> Dos piezas revisadas contra sus fuentes: el artículo «Coste por lead: por qué
> el número que más miras es el que más engaña» y el post del viernes (tesis
> contraria) «Una automatización que falla en silencio sale más cara que no
> tenerla», con su imagen, pie de Instagram y ficha.
> Fuentes contrastadas: brief-recorrido-semana-38.md (§1.2, §1.4, §2, §3, §5),
> casos/eac/index.html, serie-buscando-la-fuga-por-etapa.md (fila 9),
> api/meta-leadform.js, api/_tratos.js, api/informe-paid.js,
> bus/out/demand.jsonl (daily de Growth del 24-sep), diagnostico/index.html,
> blog/cliente-no-se-presenta-a-la-cita/index.html y llms.txt.
> Calendario: 22-sep-2026 es martes, 24-sep jueves, 25-sep viernes.

---

# PIEZA 1 · Artículo «Coste por lead: por qué el número que más miras es el que más engaña»

`blog/coste-por-lead/index.html` · keyword «coste por lead»

# Nota Global (1-10)

**6**. Sube a 8,5 con los once cambios de abajo. Ninguno pide reescribir: son frases sueltas, una celda de la tabla y el schema de la FAQ.

# Resumen Ejecutivo

La idea es buena y está bien contada: el coste por lead se para en el formulario, y lo demuestra con la cuenta propia de la semana (reformas y formación con el contacto casi al mismo precio y citas muy distintas). Cumple la estructura del estándar (H1 con keyword, «En 30 segundos», tabla, destacado, regla, caso, FAQ con schema, CTA conectado). Lo que falla es precisión, y en un artículo cuya tesis es «mira bien los números» eso pesa doble. El total de 291,90 € se atribuye a tres sectores cuando son cuatro. La fila de clínicas cuenta como cita del anuncio la de CL-1, que entró por la landing (el mismo error ya se marcó ayer en otro artículo). Las 5 citas de formación salen del resumen del brief, pero el detalle lead a lead del mismo brief solo tiene 4. La frase sobre el formulario («separa a los que van en serio») la contradicen los datos de la semana. Y el artículo enlaza a una pieza que publica la tasa de plantones «5 de 9», que es justo lo que no se publica.

# Lo Mejor

- La tabla con la columna «Citas» al final. Es la frase del artículo hecha dato: «La última columna es la que no enseña ninguno».
- Datos propios, recientes y con contexto. Gasto, contactos y coste por contacto por vertical coinciden con el brief §2 al céntimo (90,03 / 86,77 / 84,23 €, 9 / 8 / 4, 10,00 / 10,85 / 21,06 €). Coste por cita comprobado: 90,03 / 2 = 45,02 € y 86,77 / 5 = 17,35 €.
- Postura con la cara: «Con cuatro contactos no me atrevo a sacar ninguna conclusión de clínicas, y te recomiendo lo mismo». Es criterio, no relleno.
- La regla («Nunca apagues un anuncio por su coste por lead sin mirar antes cuántas citas trajo») es accionable y se recuerda.
- Primera frase de cada H2 autocontenida y definición «X es Y» en «Qué es el coste por lead». Bien para GEO.
- CTA conectado al tema («¿Sabes cuánto te cuesta un cliente en cada canal?»). La promesa «Quince minutos… plan por escrito en 24 horas, lo hagas con nosotros o no» está tal cual en /diagnostico/.
- Sin nombres de leads, sin raya larga, sin punto y coma en el texto visible ni en el schema.

# Lo Más Débil

- La fila de clínicas: sus dos citas se presentan como fruto de los 84,23 € del anuncio y una de ellas (CL-1, la única reunión hecha y la única propuesta de la semana) entró por la landing. En un artículo sobre atribución, la atribución del ejemplo está mal.
- La sección «Qué hacemos nosotros con esto» se va a «agentes de IA» y a un lema («No cambiamos tu sistema. Lo agentizamos.») cuando el artículo entero iba de medir el origen. El caso EAC que viene detrás no tiene agentes: tiene medición.
- El párrafo del formulario promete un efecto (separa a los serios) que la propia semana desmiente.

# Problemas Críticos Detectados

Cada uno con la frase exacta que falla y la frase propuesta.

**C1 · El total no es de tres sectores (sección «Mi campaña de septiembre»).**
Fuente: brief §2. Los 291,90 € incluyen asesorías (29,87 €, 0 leads, pausada el 20). Los tres sectores de la tabla suman 261,03 €. Quien sume la tabla verá que no cuadra.
- Falla: «Del 18 al 22 de septiembre invertí 291,90 € en anuncios de Meta para tres sectores. Entraron 21 solicitudes, a 13,90 € de media.»
- Propuesta: «Del 18 al 22 de septiembre invertí 291,90 € en anuncios de Meta para cuatro sectores. Entraron 21 solicitudes, a 13,90 € de media. El cuarto, asesorías, lo paré el día 20 después de gastar 29,87 € sin un solo contacto, y por eso no sale en la tabla.»

**C2 · Una de las dos citas de clínicas no vino del anuncio (tabla, fila Clínicas).**
Fuente: brief §3: «CL-1 · clínica dental, Cataluña (sáb 19, 08:58, por la landing…)» y «Todos entraron por el formulario nativo de Meta menos CL-1 (landing /clinicas)». Del anuncio de clínicas sale una cita (CL-2). El dato también está en llms.txt («clínicas 21,06 € y 2 citas»), fuera del alcance de esta revisión pero hay que corregirlo a la vez.
- Falla (celda): «2»
- Propuesta (celda): «1 (+1 que entró por la web)»

**C3 · La frase de clínicas dice lo contrario de lo que quiere decir.**
Mirando solo el coste por lead, clínicas no da miedo apagarla: es la primera que apagarías. Además hay que explicar la cita que vino por la web (C2).
- Falla: «Y clínicas, que tiene el contacto más caro con diferencia, es la que más miedo daría apagar mirando solo el coste por lead.»
- Propuesta: «Y clínicas, con el contacto más caro con diferencia, es la que apagarías primero mirando solo el coste por lead. Ojo, que de sus dos citas una ni siquiera vino del anuncio: entró por la web.»

**C4 · Las 5 citas de formación no cuadran dentro de la propia fuente.**
Fuente: el resumen por vertical del brief §3 dice 5, pero en la tabla lead a lead solo hay 4 formaciones con cita (FO-2, FO-4, FO-5, FO-7). El mismo resumen tampoco cuadra en plantones (clínicas 0, cuando CL-2 tuvo plantón el 22). Antes de publicar hay que confirmar en el CRM cuántas citas de formación hubo. Con 5, 86,77 / 5 = 17,35 € y la frase vale. Con 4, 86,77 / 4 = 21,69 € y 4 frente a 2 es el doble, no «más del doble».
- Falla: «Pero formación dio más del doble de citas. En coste por cita, reformas salió a unos 45 € y formación a unos 17 €.»
- Propuesta (si el CRM confirma 4): «Pero formación dio el doble de citas. En coste por cita, reformas salió a unos 45 € y formación a unos 22 €.»
- Lo mismo en la meta description y en el schema («una diferencia de más del doble en citas» → «el doble de citas») y en og:description («Citas: 2 frente a 5» → «Citas: 2 frente a 4»). Si el CRM confirma 5, se deja todo como está.

**C5 · El artículo enlaza a la tasa de plantones que no se publica.**
La frase del artículo no da la cifra, pero enlaza a blog/cliente-no-se-presenta-a-la-cita, que publica «5 de 9 citas» en la meta description, en og:description, en el schema y en el cuerpo. Con la tabla de este artículo (9 citas) el lector tiene las dos mitades. La pieza enlazada no la toco. Hay que quitarle el «5 de 9» a ella y, mientras tanto, quitar el enlace aquí.
- Falla: «Parte de esas citas no llegaron a celebrarse, y eso lo cuento en el cliente no se presenta a la cita.»
- Propuesta (hasta que la otra pieza deje de publicar la tasa): «Parte de esas citas no llegaron a celebrarse.»

**C6 · El formulario no «separa a los que van en serio» (sección «Por qué bajar el coste por lead puede salir caro»).**
Fuente: brief §1.2 confirma las preguntas (inversión mensual y dónde se le escapa). Lo que no dice ninguna fuente es que suba el CPL ni que separe a nadie. El brief dice lo contrario: 5 de 20 marcaron «no invierto nada», 12 de 20 «no lo sé» o menos de 500 €, y la hipótesis 2 es que «el formulario instantáneo trae curiosos».
- Falla: «Por eso en mis campañas el formulario pregunta cuánto invierte ya y qué se le escapa: sube un poco el coste por lead y separa a los que van en serio.»
- Propuesta: «Por eso en mis campañas el formulario pregunta cuánto invierte ya y qué se le escapa. No echa a todos los curiosos, pero obliga a pararse a pensar antes de enviar.»

**C7 · El nombre del anuncio no viaja «como etiqueta» (paso 1).**
Fuente: la serie (fila 9) lo dice así, pero el código no. api/meta-leadform.js pone la etiqueta `creativo-<id del anuncio>`, con el número y no con el nombre. El nombre lo resuelve api/_tratos.js (nombreAnuncio) y va en el título y la fuente del trato, que es lo que llega a la cita. La fila 9 de la serie tiene el mismo error, fuera del alcance.
- Falla: «En mi sistema el nombre del anuncio viaja como etiqueta desde el formulario hasta la cita.»
- Propuesta: «En mi sistema cada contacto entra con el anuncio del que vino apuntado, y ese dato le acompaña desde el formulario hasta la cita.»

**C8 · El «informe de la mañana» no da citas ni clientes por anuncio (sección «Qué hacemos nosotros con esto»).**
Fuente: api/informe-paid.js da gasto, leads y CPL por campaña, y las citas en total, no por anuncio. Lo que sí respalda el caso EAC es un panel que se actualiza cada día, con «100 % trazabilidad del anuncio a la matrícula».
- Falla: «…y para que el informe de la mañana diga cuántas citas y cuántos clientes trajo cada anuncio, no cuántos formularios.»
- Propuesta: «…y para que el panel diga qué anuncio trajo citas y clientes, no solo formularios. Es lo que hicimos en la Escola Aeronàutica.»

**C9 · Lema prohibido (misma sección).**
Es la construcción «no es X, es Y» con otras palabras, suena a rótulo (regla del 22-sep) y «agentizamos» no pasa la prueba del bar.
- Falla: «Con agentes de IA dentro del CRM que ya usas. No cambiamos tu sistema. Lo agentizamos.»
- Propuesta: «Todo dentro del CRM que ya usas, sin cambiarte de herramienta.»

**C10 · El caso EAC dice más que su página (caja del caso).**
Fuente: casos/eac. La página dice «saber qué fuente trae calidad, no solo volumen» y sigue publicando el CPL (7,71 €). No dice que se dejara de medir por contactos. 10,2× y 44.000 € en un mes sí coinciden.
- Falla: «…y dejamos de medir la campaña por los contactos.»
- Propuesta: «…y empezamos a medir la campaña por matrículas, no solo por contactos.»

**C11 · Construcción prohibida en el schema de la FAQ, que además no coincide con la FAQ visible.**
El schema lo leen Google y los modelos, así que también se publica. La respuesta 4 del JSON-LD usa «no es esa: es…». Las respuestas 2 y 4 del schema llevan frases que no están en la FAQ visible, y Google pide que coincidan.
- Falla (schema, respuesta 4): «Pero la pregunta útil no es esa: es cuánto te cuesta un cliente y cuánto te deja. Un contacto caro que compra vale más que diez baratos que no contestan.»
- Propuesta: copiar tal cual la respuesta visible: «Depende del sector y de lo que vale un cliente. En mi campaña de septiembre en España salieron entre 10 y 21 euros por contacto según el sector. La pregunta útil es cuánto te cuesta un cliente y cuánto te deja.» Y en la respuesta 2, quitar del schema «y bajar el coste por lead suele traer contactos que nunca iban a comprar» (o añadirlo a la visible).

# Qué Eliminaría

- «Con agentes de IA dentro del CRM que ya usas. No cambiamos tu sistema. Lo agentizamos.» (C9). El artículo va de medir, no de IA.
- El segundo párrafo del lede («Lo escribo porque esta semana he tenido la prueba…») repite lo que ya dice el lede. Se puede fundir: «Esta semana lo he visto en mi propia cuenta: dos sectores con el contacto casi al mismo precio y resultados que no se parecen en nada.»

# Qué Simplificaría

- «Una precisión, porque importa: una cita no es una reunión.» → «Ojo: coger cita no es presentarse.» Más hablado y evita otra negación-definición.
- «Es un campo obligatorio, no una nota.» → «Y es obligatorio.»
- «Es el número que decide dónde poner el dinero el mes que viene.» Bien. Pero el paso 3 enlaza a CAC con «Te lo explico entero en…». Mejor «Cómo se calcula, paso a paso, en…».

# Qué Reforzaría

- La fila de clínicas como argumento extra (tras C2 y C3): el único contacto de la semana que llegó a reunión y a propuesta vino por la web, no por el formulario. Eso refuerza la tesis sin tocar la tasa de plantones.
- El cluster: el pilar blog/metricas-de-marketing no enlaza de vuelta a este artículo. Hay que añadir el enlace en el pilar (fuera del alcance de esta revisión).
- La etiqueta de hipótesis. «Bajar el coste por lead suele traer contactos que nunca iban a comprar» es opinión. Marcarlo («en mi experiencia») cumple el estándar (hecho / hipótesis / opinión separados).

# Riesgos

- Publicar con C5 sin resolver deja reconstruible la tasa de plantones propia. Es regla de Maikel.
- Publicar con C2, C4 o C1 sin resolver deja un artículo de «mira bien tus números» con números que no cuadran. Un competidor o un lead atento lo ve en un minuto.
- llms.txt repite «formación 10,85 € y 5 citas, clínicas 21,06 € y 2 citas». Si se corrige el artículo y no llms.txt, los modelos citarán la versión mala.
- CPL de 10 a 21 € en «España» con n = 21 y cinco días. La FAQ lo presenta como referencia de precio. Conviene añadir «en cinco días y con pocos datos» para no convertirlo en benchmark.

# Impacto Esperado

Keyword con intención informativa y competencia media. El valor para la North Star está en el CTA: quien busca «coste por lead» suele tener anuncios activos y un CPL que le preocupa, que es exactamente el perfil del diagnóstico. Con los cambios, es una pieza citable (tabla + definición + FAQ) que puede traer diagnósticos a goteo durante meses. Sin ellos, un solo lector que sume la tabla le quita credibilidad a todo el blog.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Jerarquía correcta: eyebrow, H1, pilar, lede en negrita, tarjeta oscura, H2 con pnum en los pasos. Tabla con wrapper de scroll, buena en móvil.
- Párrafos dentro de las cuatro líneas salvo el de «Por qué bajar el coste por lead» (primero), que roza el límite.
- Un solo destacado y una sola regla: bien dosificado.
- La imagen OG es la genérica del sitio. Para una pieza con tabla propia, una OG con la comparación reformas/formación daría más clics desde LinkedIn.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: el H1 es sólido y lleva la keyword. La meta description es mejor hook que el H1 (el dato concreto), bien.
- Claridad: se entiende a la primera salvo C3 (sentido invertido).
- Credibilidad: alta en el diseño del argumento, dañada por C1, C2, C4, C6, C7, C8 y C10. Todas se arreglan con una frase.
- CTA: conectado y con promesa verificada. El enlace de texto «en quince minutos» del penúltimo párrafo y el botón llevan al mismo sitio, sin fricción.
- Voz: suena a persona casi todo el tiempo («un pelo mejor», «Cinco minutos cada viernes»). El bajón está en «Qué hacemos nosotros», que suena a web de agencia.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Alineado: habla de fugas (lo que pasa después del formulario), de sistemas (origen por contacto) y de decidir con datos. Es la propuesta de valor aplicada a una métrica.
- La deriva a «agentes de IA» en la sección de servicio es el error del ángulo 5. Aquí lo que vende es la medición.
- North Star: el CTA lleva al diagnóstico, que es la puerta a los pilotos. Bien.

# Versión Mejorada del Hook

Lede, primera frase (vale tanto con 4 como con 5 citas de formación):
«En septiembre pagué casi lo mismo por cada contacto en dos sectores. Uno me dio al menos el doble de citas que el otro. El coste por lead no vio ninguna diferencia.»

# Próximo Experimento Recomendado

Dos semanas después de publicar, actualizar la tabla con una columna más, «Reuniones hechas por anuncio», sin tasa de plantones y en valores absolutos por vertical. Medir cuántas solicitudes de diagnóstico llegan desde /blog/coste-por-lead/ (utm o referer en api/diagnostico) frente a la media del blog. Si trae diagnósticos, es la plantilla para «coste por cita» y «coste por cliente».

# Veredicto

**PUBLICAR CON CAMBIOS.** Once críticos, todos de frase o de celda. C4 necesita antes un dato del CRM (4 o 5 citas de formación). C5 depende de quitar el «5 de 9» de la otra pieza o de quitar el enlace.

---

# PIEZA 2 · Post de LinkedIn del viernes (tesis contraria) «Una automatización que falla en silencio sale más cara que no tenerla» + imagen + pie de Instagram + ficha

`content/borradores/2026-09-25-tesis-falla-en-silencio.md` · `content/infografias/2026-09-25/falla-en-silencio.png`

# Nota Global (1-10)

**7**. Sube a 8,5 con los cuatro cambios críticos.

# Resumen Ejecutivo

Buena pieza de tesis contraria: empieza por lo que pasó, tiene un fallo real y propio, y deja una regla aplicable («no le preguntes si lo hizo, mira si pasó»). Los hechos verificables cuadran con el daily de Growth del 24-sep: casi dos días, del 22 al 24 por la tarde, un interruptor en pausa, la etiqueta que se ponía igual, sin alertas, detectado por una captura, arreglado el mismo día invirtiendo el valor por defecto. Omite a propósito el WhatsApp, el 663 y el mensaje cruzado, bien hecho. Fallan cuatro cosas. Hay una construcción prohibida («Lo peor no es eso. Lo peor es…»). Hay un detalle que la fuente no dice («por otra cosa»). El remate («Enviado» no es lo mismo que «recibido») describe otro fallo: el mensaje no se envió, no es que se enviara sin llegar. Y el marco «el primer mensaje a los contactos nuevos es automático» lo lee en clave de WhatsApp cualquiera que haya rellenado el formulario, porque la pantalla de gracias le promete en primera persona «Te mando un WhatsApp».

# Lo Mejor

- Empieza por el hecho, no por un lema. Cumple la regla del 22-sep.
- La idea central es buena y poco dicha: «Con una máquina, nadie pregunta. Por eso es más peligrosa: hace que dejes de mirar.»
- Admite el fallo propio con fecha y lo cierra con la regla. Es opinión + experiencia + aprendizaje, que es lo que pide la guía para LinkedIn.
- La ficha deja por escrito lo que no se cuenta y por qué. Así se trabaja.
- La imagen tiene una jerarquía clara (cifra, qué pasó, la tabla sistema/realidad, la tesis) y el «✓ enviado · no salía» es la pieza visual que explica todo.
- Sin nombres, sin mensajes cruzados, sin tasa de plantones, sin raya larga ni punto y coma.

# Lo Más Débil

- La tesis dice «sale más cara» y el post no enseña ningún coste. No dice cuántos contactos se quedaron sin mensaje ni qué pasó con ellos. Como opinión aguanta, como prueba no.
- El remate «Enviado» / «recibido» apunta a un problema de entrega que no es el que hubo (C3).

# Problemas Críticos Detectados

Cada uno con la frase exacta que falla y la frase propuesta.

**C1 · Construcción prohibida (LinkedIn, tercer párrafo).**
Es «no es X, es Y» partido en dos frases.
- Falla: «Lo peor no es eso. Lo peor es que el sistema apuntaba «enviado» igual.»
- Propuesta: «Y encima el sistema apuntaba «enviado» igual.»

**C2 · Detalle que la fuente no dice (LinkedIn, tercer párrafo).**
Fuente: demand.jsonl 24-sep: «Se ha detectado hoy solo porque Maikel vio una captura de pantalla en GHL, no por ninguna alerta del sistema». No dice que la mirara por otra cosa.
- Falla: «Me di cuenta yo, mirando una captura por otra cosa.»
- Propuesta: «Me di cuenta yo, al ver una captura del CRM.»

**C3 · El remate describe otro fallo (LinkedIn, penúltimo párrafo).**
Fuente: demand.jsonl 24-sep: el mensaje no salía y «act-wa1 se pone tanto si el mensaje sale como si falla». El problema fue que la etiqueta decía «enviado» sin que saliera nada, no que se enviara y no llegara. Y «no es lo mismo que» vuelve a rozar la construcción vetada.
- Falla: ««Enviado» no es lo mismo que «recibido».»
- Propuesta: «Que ponga «enviado» no quiere decir que haya salido.»

**C4 · Por inferencia, se lee como envío automatizado por WhatsApp desde el número personal (LinkedIn, pie de Instagram e imagen).**
Regla de Maikel: nada que parezca envío automatizado por WhatsApp desde su número personal. El post no nombra WhatsApp. Pero la pantalla de gracias del formulario dice «Te mando un WhatsApp» en primera persona (brief §1.2), y el primer mensaje es ese WhatsApp (brief §1.4). Cualquier contacto que haya rellenado el formulario y lea «el primer mensaje que reciben los contactos nuevos… con una máquina» ata cabos. Y el post además dice que el envío ahora está activo por defecto. Si Maikel da el ok explícito a este riesgo, se deja. Si no:
- Falla (LinkedIn): «El primer mensaje que reciben los contactos nuevos en mi empresa estuvo casi dos días sin salir.»
- Propuesta (LinkedIn): «Uno de los mensajes automáticos de mi sistema comercial estuvo casi dos días sin salir.»
- Falla (Instagram e imagen, subtítulo): «Dos días casi enteros sin salir el primer mensaje a los contactos nuevos.» / «casi enteros sin salir el primer mensaje a los contactos nuevos.»
- Propuesta (Instagram e imagen): «Dos días casi enteros sin salir un mensaje automático de mi sistema.» / «casi enteros sin salir un mensaje automático de mi sistema.»
- Imagen, fila de la tabla: «Primer mensaje» → «El mensaje». Hay que regenerar la imagen.

# Qué Eliminaría

- La coletilla «por otra cosa» (C2).
- En el pie de Instagram, «Dímelo abajo». La pregunta ya invita. Sobra la muletilla de creador.

# Qué Simplificaría

- «Un interruptor se quedó en pausa después de un cambio y nadie lo volvió a encender.» Correcta según la fuente, pero «después de un cambio» no dice nada. Más útil y también verificado: «Un interruptor se quedó en pausa, y el sistema estaba montado para que "sin tocar" quisiera decir "apagado".» Así se entiende por qué el arreglo es invertir el valor por defecto.
- «Lo arreglé ese mismo día.» El arreglo lo hizo el agente de Growth (fuente: daily de qualivo.growth). «Lo arreglamos ese mismo día» es igual de corto y exacto.
- «El panel decía que todo iba bien.» La fuente dice «el dashboard parece normal». Se acepta como paráfrasis. Si se regenera la imagen por C4, mejor «Y en el panel todo parecía normal».

# Qué Reforzaría

- Una cifra de coste real, si existe y no toca a terceros: cuántos contactos nuevos entraron entre el 22 y el 24 por la tarde y se quedaron sin ese mensaje. Con eso la tesis «sale más cara» deja de ser solo opinión. Si no se puede contar sin exponer a nadie, marcarla como opinión («creo que sale más cara»).
- La regla, en una línea que se pueda copiar: «Una vez por semana, rellena tu propio formulario y mira qué te llega.» Es la versión práctica de «mira si pasó».

# Riesgos

- C4 es el riesgo principal. Toca una regla explícita de Maikel y a leads activos que pueden leer el post.
- La pausa de LinkedIn sigue vigente según la propia ficha. Publicar no depende de esta revisión.
- Tono: una tesis contraria que suena a confesión funciona. Si al final se añade venta («esto lo arreglamos para ti»), se rompe. Tal como está, bien.

# Impacto Esperado

Buenas conversaciones en comentarios con dueños y responsables comerciales que tienen automatizaciones «que funcionan» sin comprobar. Es exactamente el perfil del diagnóstico. El efecto sobre pilotos es indirecto: construye la imagen de alguien que mira sus propias fugas antes que las del cliente. Métrica útil: comentarios del tipo «a mí me pasó» y mensajes privados, no reacciones.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- «2 días» en naranja gigante para el scroll. Bien. El «casi enteros» queda justo debajo, así que la cifra no engaña.
- El rótulo de la tarjeta («LO QUE DECÍA EL SISTEMA · LO QUE PASABA») solo encaja con la primera fila. «Quién se dio cuenta» y «Alertas» no son «lo que decía el sistema». Mejor rótulo: «QUÉ PASÓ».
- Hay un hueco negro de unos 250 px entre la tarjeta y la tesis. Subir la tesis o bajar la tarjeta mejora el ritmo en móvil.
- Legibilidad buena en 1080 × 1350, contraste suficiente, sin exceso de texto.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook LinkedIn: la tesis en la primera línea es fuerte, pero es una frase de pizarra. La guía pide empezar por lo que pasó (ver hook mejorado).
- Claridad: se entiende a la primera. Frases cortas, se lee en voz alta sin ahogarse.
- Credibilidad: los hechos cuadran con la fuente salvo C2 y C3.
- CTA: pregunta abierta, coherente con «CTA: conversación» de la ficha.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Alineado: habla de una fuga real en la etapa de contacto y de medir el resultado, no la etiqueta. No cae en «IA genérica».
- North Star: pieza de confianza, no de conversión. Correcto para un viernes de tesis contraria. No hace falta forzar el diagnóstico.

# Versión Mejorada del Hook

«Durante casi dos días, mi sistema apuntó «enviado» en mensajes que no salían. Nadie se enteró. Por eso creo que una automatización que falla en silencio sale más cara que no tenerla.»

# Próximo Experimento Recomendado

Publicar la regla práctica como pregunta de seguimiento a los que comenten («¿has rellenado tu propio formulario este mes?») y contar cuántos responden con un fallo propio. Si más de tres cuentan uno, hay material para una pieza de la serie «Buscando la fuga» en la etapa de contacto, con casos de lectores (anonimizados y con permiso).

# Veredicto

**PUBLICAR CON CAMBIOS.** Cuatro críticos. C4 obliga a regenerar la imagen, salvo que Maikel acepte el riesgo de forma explícita. Sobre la pausa de LinkedIn decide Maikel.

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| Artículo «Coste por lead: por qué el número que más miras es el que más engaña» | 6 | PUBLICAR CON CAMBIOS | 11 |
| Post LinkedIn viernes «Una automatización que falla en silencio…» + imagen + pie IG + ficha | 7 | PUBLICAR CON CAMBIOS | 4 |

Verificado y correcto (no requiere cambio): 291,90 € y 21 leads a 13,90 €. Por vertical, 90,03 / 86,77 / 84,23 €, 9 / 8 / 4 leads y 10,00 / 10,85 / 21,06 € de CPL (brief §2). Citas de reformas 2 y coste por cita 45,02 €. Coste por cita de formación 17,35 € con 5 citas (pendiente C4). Entre 10 y 21 € por contacto. EAC 10,2× y 44.000 € atribuidos en un mes, y la matrícula conectada curso a curso (casos/eac). El formulario pregunta inversión mensual y dónde se le escapa (brief §1.2 y api/meta-leadform.js). Promesa del CTA «quince minutos, plan por escrito en 24 horas, lo hagas con nosotros o no» (diagnostico/index.html). Fallo del 24-sep: casi dos días, del 22 al 24 por la tarde, interruptor GATEWAY_PAUSA, etiqueta act-wa1 puesta igual, sin alertas, detectado por una captura en GHL, arreglado el mismo día invirtiendo el valor por defecto (bus/out/demand.jsonl).

Fuera del alcance, conviene corregirlo a la vez: el «5 de 9» publicado en blog/cliente-no-se-presenta-a-la-cita (meta, og, schema y cuerpo). La línea de llms.txt de este artículo (citas de clínicas y, según C4, las de formación). La fila 9 de serie-buscando-la-fuga-por-etapa.md («el nombre del anuncio viaja como etiqueta»). El enlace del pilar metricas-de-marketing a este artículo. Y el resumen por vertical del brief §3, que no cuadra con su propio detalle lead a lead (citas de formación y plantones de clínicas).
