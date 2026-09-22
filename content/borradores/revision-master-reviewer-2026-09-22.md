# Revisión · Qualivo Master Reviewer · 22-sep-2026

> Tres piezas revisadas con el prompt `content/agentes/prompt-qualivo-master-reviewer.md`, la guía de voz y el estándar de artículos. Cada cifra se ha contrastado con su fuente en el repositorio: `content/propuesta-de-valor-v1.md` (§5 y §10), `content/estrategia-de-contenidos-v1.md` (línea 97), el comentario de `assets/app.js` (líneas 18-26), el código real del agente en `api/seguimientos.js`, la bitácora `captacion/agente-llamadas/bitacora-raquel.md` (21-sep), `casos/nuria-roure/index.html`, la tabla de estudios verificados de `content/borradores/serie-estudio-vs-agente.md`, `captacion/recorrido-activacion-v2.md` y `api/vapi-fin.js`. Lo que la fuente no dice tal cual va en «Problemas Críticos», con la frase que falla y la frase propuesta.
>
> Hallazgo transversal, porque se repite en dos de las tres piezas: el agente de seguimientos (`api/seguimientos.js`) detecta oportunidades que llevan **más días de la cuenta en la misma etapa** (un plazo por etapa: 2, 5, 15 días...), crea una tarea en GHL con **el siguiente movimiento ya escrito** para Maikel y, en sus propias palabras, «no manda nada al cliente: propone la acción a la persona». No mira si hay actividad o tarea pendiente, no redacta el mensaje al cliente y no «se para cuando el cliente responde». Las piezas describen otro agente.

---

# 1 · Artículo de blog · `/blog/presupuestos-sin-respuesta/`

## Nota Global (1-10)

**6.** Buen artículo de criterio con un dato propio que nadie más puede publicar, pero con nueve frases que dicen más que la fuente. Dos de ellas (el sector del caso Nuria Roure y la regla del agente) son errores de hecho en una pieza ya publicada.

## Resumen Ejecutivo

La pieza cumple el estándar en estructura: eyebrow, H1 con keyword, lede, «En 30 segundos», tabla, regla, destacado, caso con número, FAQ con schema, enlaces al pilar y tres internos, CTA conectado al tema. La voz es la de Maikel y no la de una agencia: primera persona real, la parte incómoda («eran mías»), una gracia («Dos mensajes no es seguimiento. Es una despedida educada»). Las cifras del CRM (4, 30, 25, 34.500 €, 15, 25 tareas, 10-sep) cuadran con `app.js`, propuesta §5 y estrategia línea 97. RAIN Group cuadra tal cual con la tabla verificada, y encima el texto reconoce que es prospección y no presupuesto: eso suma credibilidad. La queja de agosto cuadra con `recorrido-activacion-v2.md`.

Lo que falla es la capa de interpretación alrededor de los datos: el caso Nuria Roure se presenta como «un despacho de abogados» (es una psicóloga con negocio de formación y servicios online) y se atribuye el 6,45× al paso 3 del método. La regla del agente y lo que deja en cada tarea no son las del código. Las 25 «oportunidades» de todos los embudos se venden como «presupuestos» en la meta description y en el cuerpo. Y hay tres afirmaciones de comportamiento del cliente («a la semana ya lo ha decidido con otro», «el que más respuestas trae», «la mayoría de los presupuestos abiertos no tiene siguiente paso») sin ninguna fuente, dos de ellas dentro del schema FAQ, que es lo que las IA citan.

## Lo Mejor

- El dato propio, contado entero y con la parte incómoda: «Ninguna de esas 25 era culpa de nadie en concreto. Eran mías.» Es la demostración del producto, no marketing.
- La precisión honesta: «34.500 € declarados no son 34.500 € que se vayan a cobrar. Son conversaciones que no existen.» Esto es lo que hace creíble el resto.
- RAIN Group con su matiz («Eso es prospección, no un presupuesto ya enviado, pero da la escala»). Así se cita un estudio.
- La regla en callout: «Si el número te sorprende, está bien contado.» Memorable y accionable.
- El método regalado en tres pasos, aplicable sin CRM y sin Qualivo. Cumple el filtro «¿alguien pagaría por leer esto?».
- El CTA conecta con el problema exacto del artículo: «¿Cuántos presupuestos tienes abiertos sin siguiente paso?».

## Lo Más Débil

- La descripción del agente no es la del agente real. El lector que pida el diagnóstico esperando «el mensaje preparado» y «se para cuando el cliente responde» se encontrará con tareas para una persona.
- El caso Nuria Roure aparece dos veces con dos historias distintas: en el paso 3 es «un despacho de abogados» que hizo 6,45× «con eso» (poner fecha y nombre), y en el bloque de caso es «cualificación y seguimiento». La segunda es la buena.
- Oportunidades y presupuestos se usan como sinónimos. Los 25 tratos parados están en etapas distintas (nuevo lead, radiografía, contactado, propuesta...). No son 25 presupuestos enviados.
- La FAQ afirma tiempos de decisión del cliente como hechos sin ninguna fuente.
- El artículo no cita el capítulo 1 de la newsletter, aunque el plan de la semana dice que jueves «el vídeo y el artículo citan el capítulo».

## Problemas Críticos Detectados

Cada uno con la frase exacta que falla, por qué, y la frase propuesta.

**C1 · Sector del caso inventado.**
Falla (paso 3): «Con eso, un despacho de abogados hizo 6,45 veces lo invertido sin captar un contacto más. Lo cuento más abajo.»
Fuente: `casos/nuria-roure/index.html` líneas 66 y 90. «Caso 01 · Formación y servicios online». Nuria Roure es psicóloga y doctora en medicina del sueño. No hay despacho de abogados en ningún caso publicado. Además el 6,45× viene de «cualificación, lead scoring y seguimiento», no del paso 3 solo.
Propuesta: «Con eso, y con una cualificación mejor de qué contacto merecía atención, un negocio de formación y servicios online hizo 6,45 veces lo invertido sin captar un contacto más. Lo cuento más abajo.»
Aviso: `content/infografias/2026-09-22-fuga-por-etapa/08-seguimiento.html` repite «Un despacho hizo 6,45 veces lo invertido solo con esto». Está fuera de esta revisión, pero es el mismo error y sale de la misma mano.

**C2 · La regla del agente no es esa.**
Falla: «puse a un agente de seguimientos a recorrer mis cuatro pipelines, trato por trato, con una regla sencilla: si no hay actividad ni tarea pendiente, es un presupuesto parado.»
Fuente: `api/seguimientos.js`, cabecera y `REGLAS`: detecta oportunidades «que llevan demasiado tiempo paradas en la misma etapa», con un plazo por etapa. No consulta actividad ni tareas.
Propuesta: «puse a un agente de seguimientos a recorrer mis cuatro pipelines, trato por trato, con una regla sencilla: cada etapa tiene un plazo, y el trato que lleva más días de la cuenta en la misma etapa está parado.»

**C3 · «Sin fecha, sin tarea, sin nadie a cargo» no es lo que midió.**
Falla (tabla, fila «Sin siguiente paso»): «Sin fecha, sin tarea, sin nadie a cargo. Cinco de cada seis.»
Fuente: la misma. El agente mide días en etapa. «Cinco de cada seis» es correcto (25/30).
Propuesta: «Más días de la cuenta en su etapa sin que nadie las moviera. Cinco de cada seis.»

**C4 · «El mensaje preparado» y «se para en cuanto el cliente responde».**
Falla (tabla, fila «Tareas creadas con fecha y dueño»): «Una por trato, con el siguiente paso y el mensaje preparado.»
Falla (sección «Qué hacemos nosotros con esto»): «deja una tarea por cada uno con fecha, dueño y el mensaje preparado, y se para en cuanto el cliente responde. Es el mismo que encontró los 25 míos.»
Fuente: `api/seguimientos.js`: «crea UNA tarea en GoHighLevel con el siguiente movimiento ya escrito» (título, acción y fecha, asignada a Maikel). «No manda nada al cliente: propone la acción a la persona.» `app.js` línea 50: «tareas creadas, con fecha y con dueño». Nada de mensaje redactado ni de parar por respuesta del cliente: eso es el reloj de activación, otro sistema.
Propuesta tabla: «Una por trato, con el siguiente movimiento escrito y una persona asignada.»
Propuesta párrafo: «deja una tarea por cada uno con fecha, dueño y el siguiente movimiento escrito. No escribe al cliente: te dice a quién tocar, cuándo y con qué. Es el mismo que encontró los 25 míos.»

**C5 · «Más de 57 días» no es «entre 57 y 63».**
Falla (paso 2): «En mi caso, 15 de 25 pasaban de los 57 días.»
Falla (reactivar): «Mis quince de más de 57 días están en esa etapa».
Fuente: estrategia línea 97, propuesta §5 vía plan: «Quince llevaban entre 57 y 63 días». Si una tenía 57 justos, «pasaban de» es falso. El resumen y la tabla lo dicen bien: que el cuerpo diga lo mismo.
Propuesta: «En mi caso, 15 de 25 llevaban entre 57 y 63 días sin que nadie las tocara.» y «Mis quince de entre 57 y 63 días».

**C6 · Reactivación en marcha que ninguna fuente respalda.**
Falla: «Mis quince de más de 57 días están en esa etapa, con un mensaje por motivo. Lo que salga de ahí lo contaré cuando tenga el número, no antes.»
Fuente: ninguna. El plan de la semana dice «Lo que NO dice: cuánto se ha recuperado de esos 34.500 €. No hay número todavía». No hay registro de mensajes de reactivación preparados por motivo para esas quince.
Propuesta: «Mis quince de entre 57 y 63 días son las siguientes de la lista. Lo que salga de ahí lo contaré cuando tenga el número, no antes.»

**C7 · Tiempo de decisión del cliente afirmado como hecho, dentro del schema FAQ.**
Falla (FAQ visible y `FAQPage` en el JSON-LD): «Si el cliente pidió precio es porque lo estaba decidiendo, y a la semana ya lo ha decidido con otro o lo ha aparcado.»
Fuente: ninguna. Es opinión y va en el bloque que las IA extraen tal cual.
Propuesta (en los dos sitios): «Mi regla: entre dos y tres días desde que lo enviaste, no más. Si el cliente pidió precio es porque lo estaba decidiendo, y cada día que pasa decide más sin ti. El primer toque a los dos o tres días, el segundo a la semana, el cierre hacia el día doce.»

**C8 · «El que más respuestas trae» sin un solo número.**
Falla: «Es el mensaje que casi nadie envía y el que más respuestas trae, porque quita la presión.»
Fuente: ninguna en el repositorio.
Propuesta: «Es el mensaje que casi nadie envía y, en mi experiencia, el que más respuestas trae, porque quita la presión. Cuando tenga el número por escrito, lo pongo aquí.»

**C9 · Generalización sin fuente en la primera frase de un H2 (la que citan las IA) y «presupuestos» por «oportunidades» en la meta.**
Falla (primera frase del H2 «Cuánto negocio duerme ahí»): «En una empresa de servicios sin seguimiento sistemático, la mayoría de los presupuestos abiertos no tiene siguiente paso.»
Falla (`og:description`): «En mi propio CRM, 25 de 30 presupuestos abiertos no tenían siguiente paso.»
Fuente: propuesta §5 y `app.js`: «25 oportunidades paradas» de «30 oportunidades abiertas», de cuatro pipelines y de todas las etapas. No son presupuestos enviados. La generalización a «la mayoría» de las empresas no tiene fuente.
Propuesta H2: «El 10 de septiembre, en mi CRM, 25 de 30 oportunidades abiertas no tenían siguiente paso. Es la proporción que me encuentro, con variaciones, en los diagnósticos. Lo sé porque lo veo allí y porque me pasó a mí.»
Propuesta `og:description`: «En mi propio CRM, 25 de 30 oportunidades abiertas no tenían siguiente paso. 34.500 € declarados. Cómo contar los tuyos en diez minutos y qué mandar para que contesten.»

## Qué Eliminaría

- «Lo cuento más abajo» del paso 3, si se aplica C1 y el caso queda en un solo sitio. Contar el caso dos veces con dos versiones es lo que ha generado el error.
- El «Cinco de cada seis» de la tabla si se deja el «25 de 30» al lado: es la misma cifra dos veces en la misma fila.
- «Y con razón: no aporta nada.» tras «Da vergüenza mandarlo, así que no se manda.» Rompe el ritmo y repite lo que ya dice el destacado.

## Qué Simplificaría

- Párrafo del silencio con tres lecturas: bien, pero el cierre «Ese segundo contacto es el que casi nadie hace» ya lo dice el lede. Una vez.
- La sección «Por qué se quedan sin respuesta» tiene tres causas con la misma longitud y el mismo arranque («La primera:», «La segunda:», «La tercera:»). Es la simetría de tres que el estándar veta. Que la tercera sea más larga (es la que lleva el dato) y las dos primeras más cortas.
- «Actividad es una llamada, un correo, un WhatsApp o una tarea con fecha. «Lo tengo en mente» no es actividad.» Bien. Sobra la frase siguiente sobre ordenar por fecha de creación: es una instrucción de software que el lector no va a seguir desde el artículo.

## Qué Reforzaría

- Añadir una línea que enlace con el capítulo 1 de la newsletter cuando esté publicado, como dice el plan de la semana: «Lo que hizo el sistema el lunes, con el fallo incluido, está en el capítulo 1 del diario».
- Marcar como opinión lo que es opinión, con la cara: «Mi regla:», «Yo no lo haría». El estándar lo pide y el artículo lo hace poco fuera de la anécdota.
- La distinción oportunidad / presupuesto, una vez, en una frase: «De esas 25, no todas eran presupuestos enviados: había primeros contactos y propuestas. El método de abajo vale igual para las dos cosas».
- Un dato de vuelta cuando exista: el artículo promete «lo contaré cuando tenga el número». Fecha de revisión visible («actualizado a…») para que la promesa se vea cumplida.

## Riesgos

- Está publicado con el sector del caso mal. Un lector que conozca a Nuria Roure o llegue al caso desde el enlace lo verá en la misma sesión. Es el riesgo de credibilidad más caro de la pieza y se arregla en cinco minutos.
- Un cliente potencial que lea «el mensaje preparado» y «se para cuando responde» y luego vea el agente real en la llamada de diagnóstico: la promesa se rompe delante del comprador. La propuesta de valor §10 existe justo para evitar esto.
- El schema FAQ con «a la semana ya lo ha decidido con otro» puede acabar citado por una IA con la firma de Maikel.
- El mismo error de «despacho» está en la infografía 08 de la serie por etapa. Si se publica sin corregir, la contradicción vive en dos sitios.

## Impacto Esperado

Sobre el North Star (pilotos): el artículo es de fondo de embudo por intención de búsqueda («presupuestos sin respuesta» lo busca alguien con el problema hoy) y el CTA lleva al diagnóstico con la pregunta correcta. Con los cambios, es una pieza que puede traer diagnósticos durante meses. Sin ellos, cada diagnóstico que traiga entra con una expectativa equivocada del agente, y esa es la conversación que no se convierte en piloto.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Jerarquía correcta: lede en negrita solo en la primera frase, tarjeta oscura, H2 con pnum para los tres pasos, tabla con wrapper de scroll, regla, destacado, caso, CTA.
- La tabla es el elemento que más se va a compartir. Las filas 3 y 4 (25 y 34.500 €) deberían ir en negrita más fuerte o con fondo: son las dos cifras de la pieza. Ahora todas pesan igual.
- Párrafos de cuatro líneas o menos en móvil: se cumple salvo «La tercera:», que llega a cinco. Cortar tras «no se manda».
- El bloque «Sigue leyendo» va antes del autor y después del CTA: bien.
- Sin raya larga ni punto y coma en el texto visible: comprobado.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook (lede): «Un presupuesto sin respuesta es una venta que todavía no ha dicho que no.» Se entiende en dos segundos y abre brecha. Bien.
- Claridad: prueba del bar superada en casi todo. «Agentizamos» es vocabulario de marca aceptado.
- Credibilidad: alta en las cifras propias y en RAIN, baja en las tres afirmaciones sin fuente (C7, C8, C9) y rota en el caso (C1). Un lector que pille el «despacho de abogados» desconfía del 34.500 €.
- CTA: específico y ligado al artículo. «Plan por escrito en 24 horas, lo hagas con nosotros o no» cuadra con `/diagnostico/`. Bien.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Habla de fuga (seguimiento), de sistema (el CRM que ya tienes) y de agente encima de lo que existe. No cae en IA genérica. Alineado con propuesta §1.
- Orden promesa → prueba → mecanismo (propuesta §5): se respeta en el bloque de caso, se rompe en el paso 3 (mecanismo → prueba con el caso mal). C1 lo arregla.
- North Star: CTA al diagnóstico con pregunta de dolor. Correcto. El artículo es de los que convierten porque regala el método y vende el hacerlo cada mañana.

## Versión Mejorada del Hook

Lede propuesto (sustituye a los dos primeros párrafos, incluida la frase «Lo escribo con mi propio CRM delante»):

> **Un presupuesto sin respuesta es una venta que todavía no ha dicho que no.** El 10 de septiembre un agente repasó mi CRM: de 30 oportunidades abiertas, 25 no tenían siguiente paso. 34.500 € declarados, y ninguno era culpa de nadie más que mía. Aquí va cómo contar los tuyos en diez minutos y qué mandar para que contesten.

## Próximo Experimento Recomendado

Poner en `/diagnostico/` un campo de origen que distinga este artículo, y durante 30 días comparar cuántos diagnósticos trae frente a `/blog/seguimiento-comercial/` (mismo cluster, sin dato propio). Hipótesis: el dato propio en el resumen y en la tabla dobla la tasa de clic al CTA. Si se confirma, cada artículo del cluster lleva una tabla con dato de la casa.

## Veredicto: PUBLICAR CON CAMBIOS

Ya está publicado: aplicar C1 a C9 hoy, en caliente, empezando por C1, C2 y C4 (los tres que un comprador puede comprobar). Corregir también la infografía 08 antes de que salga.

---

# 2 · Newsletter · capítulo 1 · `content/newsletter/2026-09-23.md`

## Nota Global (1-10)

**7.** Un buen capítulo 1: dato propio, fallo contado sin adorno, lección corta, CTA con un motivo. Le sobran tres rótulos de sección y le faltan cuatro correcciones de exactitud, y la lógica de envío a los leads tiene un agujero que toca justo la herida de agosto.

## Resumen Ejecutivo

El texto respeta la regla del dato: 24 llamadas, 12 contactos, 3 citas, 10 buzones, 4 sin conectar, 2 «no es el lead», 3 locuciones de 118 segundos con recado doble y un minuto de espera, cambio de regla aplicado ese mismo lunes. Todo cuadra con la bitácora del 21-sep. La secuencia (WhatsApp al minuto, Raquel a los veinte, nueve días de cadencia) cuadra con la tabla de estudios y con el recorrido de activación. «Hace dos semanas» cuadra con la propuesta V1 del 10-sep. La cita de las 10:30 cuadra (Celso, martes 10:30). El fallo se cuenta primero como acierto y después como error, sin tapar nada. El asunto es concreto y raro en una bandeja de entrada.

Lo que no cuadra: «sin que yo tocara nada» (una de las 24 la lanzó Maikel a mano), «costaron 1,65 dólares» (la bitácora dice «aproximado»), «No vuelve a pasar» (promesa que la fuente no respalda y que la guía veta como milagro). En la lógica de envío, el correo individual promete «No te insisto más por teléfono» a leads que pueden seguir dentro de la cadencia de nueve días, con Raquel llamando al día siguiente. Después de la queja de agosto, ese es el fallo que no se puede repetir. Y el asunto «tu diagnóstico de la semana pasada» será falso para parte de la lista.

## Lo Mejor

- Primero lo que hizo bien el sistema, con números, y después el fallo, corto. Es el equilibrio pedido y funciona.
- «Raquel la trató como a una persona.» Y el diagnóstico limpio: «No es un fallo de la inteligencia artificial. Es un fallo de guion.» Eso es criterio, no humo.
- La lección: «Los sistemas no fallan en lo que probaste. Fallan en lo que a nadie se le ocurrió probar.» Se subraya sola.
- «Lo barato es llamar. Lo caro es el criterio para saber cuándo colgar.» Remate con gracia que refuerza la idea.
- El cierre: un motivo concreto, la dirección, y «responde a este correo. Lo leo yo.» Voz de email de la guía.
- La tabla de a quién va con la base legal de cada grupo, y el «No» a la base antigua. Es la decisión correcta y está justificada.
- La regla de un solo correo, a mano, sin herramienta, sin píxel. Coherente con la regla de Maikel del 21-sep.

## Lo Más Débil

- Tres rótulos de sección en negrita («Lo que pasó el lunes.», «El fallo.», «Lo que me llevo.»). La regla del 22-sep dice sin rótulos de sección y el texto no los necesita: cada párrafo arranca ya con la idea.
- El primer párrafo es introducción («Hace dos semanas cambié mi empresa entera... Este es el diario de eso»). La guía pide sin introducciones eternas y el lunes es mucho mejor arranque que la biografía.
- El correo individual habla de «no insistir por teléfono» sin comprobar en qué punto de la cadencia está cada lead.
- «Es lo que casi ninguna empresa hace con sus propios comerciales»: afirmación sin base, aunque sea opinión razonable. Marcarla como tal.

## Problemas Críticos Detectados

**C1 · «Sin que yo tocara nada» no es verdad del todo.**
Falla: «Todo quedó escrito en el CRM, con la grabación, sin que yo tocara nada.»
Fuente: bitácora 21-sep, punto 2: la quinta llamada a César se hizo «con contexto (quinta, a mano)», y en «Propuesto, no aplicado»: «reintentos con apertura de contexto obligatoria... hoy solo se hace a mano». Lo del CRM y la grabación sí cuadra: `api/vapi-fin.js` deja en la ficha resultado, resumen, enlace «Escuchar» y transcripción.
Propuesta: «Todo quedó escrito en la ficha de cada contacto, con la grabación. De las 24 llamadas, una la lancé yo a mano. Las otras 23, el sistema solo.»

**C2 · El coste es aproximado y se da como exacto.**
Falla: «Las 24 llamadas costaron 1,65 dólares.»
Fuente: bitácora 21-sep: «Coste aproximado del día: 1,65 $».
Propuesta: «Las 24 llamadas costaron alrededor de 1,65 dólares.» (Sigue condicionada a la decisión 3 de Maikel. Recomendación: que entre, pegada al fallo, como propone el plan.)

**C3 · «No vuelve a pasar» es una promesa que la fuente no respalda.**
Falla: «Si lo que habla es una locución, espera el pitido, deja diez segundos de recado y cuelga. No vuelve a pasar.»
Fuente: bitácora: el cambio está aplicado (cambio 1), pero la misma bitácora tiene tres mejoras «propuestas, no aplicadas» y nadie ha oído todavía una llamada con locución después del cambio. La guía: nada de milagros.
Propuesta: «Si lo que habla es una locución, espera el pitido, deja diez segundos de recado y cuelga. Desde ese lunes la regla está cambiada. Si vuelve a pasar, lo leerás aquí.»

**C4 · «No te insisto más por teléfono» choca con la cadencia que sigue viva.**
Falla (correo individual): «No te insisto más por teléfono: si te sigue interesando, dime un día y una hora y te mando el enlace».
Falla (tabla «A quién va», grupo 2): el criterio es «con correo y sin cita (no `act-agendado`, no `act-baja`, no «no es el lead»)». No excluye a los que siguen dentro de los nueve días de cadencia (`act-voz1`, `act-wa2`, etc.).
Fuente: `captacion/recorrido-activacion-v2.md`: la cadencia son ocho toques en nueve días, dos llamadas, y después del día 9 un toque a los 30 días. Un lead del sábado o del lunes recibirá la segunda llamada de Raquel después de leer que Maikel «no insiste más por teléfono». Es exactamente «escribir a alguien... como si no hubiera contestado», el fallo que costó la queja de agosto.
Propuesta de regla (tabla): «Leads de la campaña de septiembre con correo, sin cita y con la cadencia terminada (`act-fin`), o a los que Maikel para la cadencia a mano antes de escribirles.»
Propuesta de frase: «Por teléfono no te vamos a insistir más. Si te sigue interesando, dime un día y una hora y te mando el enlace: son quince minutos con tus números delante.» Y solo se manda cuando la regla de arriba se cumple.

**C5 · «La semana pasada» será falso para parte de la lista.**
Falla (asunto del correo individual): «tu diagnóstico de la semana pasada». El cuerpo dice «hace unos días».
Fuente: los leads sin cita van desde el arranque de la campaña (el primer lead real es del 11-14 sep, según `plan-semana-39-contenido.md` línea 503) hasta ayer. Para unos fue hace nueve días, para otros anteayer.
Propuesta: «Asunto: el diagnóstico que pediste». Y en el cuerpo, «pediste el diagnóstico de tu sistema comercial y no hemos llegado a hablar».

## Qué Eliminaría

- Los tres rótulos en negrita: «Lo que pasó el lunes.», «El fallo.», «Lo que me llevo.». Regla del 22-sep. El texto se lee igual de bien sin ellos.
- «Este es el diario de eso.» y «Cada semana un capítulo, con lo que salió mal dentro, porque lo que sale bien ya lo cuenta todo el mundo.» del primer párrafo: esa promesa ya está en el preheader y en la descripción de la newsletter. En el cuerpo, una línea al final basta.
- «Y eso solo aparece oyendo las llamadas una a una, cada tarde. Es lo que hago ahora, y es lo que casi ninguna empresa hace con sus propios comerciales.» Reducir a la primera frase. La comparación con «casi ninguna empresa» no tiene base y suena a gurú.

## Qué Simplificaría

- «insiste con cabeza durante nueve días y luego calla»: después del día 9 hay un toque a los 30 días que decide una persona. «y luego para» es más exacto y más corto.
- El recuento del lunes deja dos llamadas sin explicar (una «llámame más tarde» y una cortada). No es falso, pero un lector que sume se queda en 22. O se añade «una me pidió que llamara más tarde y una se cortó» o se dice «Del resto, diez fueron a buzón...».
- «Un comercial nuevo habría hecho lo mismo el primer día. La diferencia es lo que pasa el segundo: ese mismo lunes cambié la regla.» Está bien pero la misma idea está en el pie de foto del martes casi palabra por palabra. Si el suscriptor viene de LinkedIn, lo lee dos veces en dos días. Cambiar una de las dos.

## Qué Reforzaría

- Abrir por el lunes, no por el pivote. La biografía en una frase después del dato (ver hook mejorado).
- El coste (1,65 $) pegado al fallo, como pide el plan: «Tres llamadas de dos minutos a una operadora. Las 24 del día, alrededor de 1,65 dólares. Lo barato es llamar...». Así el remate sale del dato.
- Una frase que diga cuántos leads recibieron el correo individual la semana siguiente, en el capítulo 2. La newsletter promete transparencia: que se vea.
- En «Cómo se envía», medir también cuántos leads sin cita estaban en `act-fin` frente a en cadencia. Es el dato que decide si C4 fue un problema real.

## Riesgos

- Legal y de reputación: C4. Un lead que lea «no te insisto más por teléfono» y reciba la segunda llamada de Raquel al día siguiente es una queja en potencia y una demostración pública de que el sistema no lee sus propias promesas.
- «Reformas» y «mientras yo estaba en otra reunión» solo están en Notion y en las notas del plan, no en la bitácora. Confirmar con Maikel antes de enviar (pregunta directa: ¿era una empresa de reformas y estabas en reunión a las 10:30?).
- La newsletter nativa de LinkedIn no existe todavía y la pausa de redes sigue vigente. Si Maikel no la levanta por escrito el miércoles a las 8:30, el correo individual a los leads enlazaría a un capítulo que no existe. Orden obligatorio: primero capítulo publicado, después correos.
- Nombrar a «Raquel» como «mi comercial IA» sin decir que es un agente de voz en la primera aparición: para un suscriptor nuevo puede leerse como una persona hasta el segundo párrafo. Una glosa de tres palabras lo arregla («Raquel, mi comercial IA, una voz que llama»).

## Impacto Esperado

Sobre el North Star: el capítulo 1 en LinkedIn arranca de cero suscriptores, así que su impacto en pilotos es a medio plazo (credibilidad acumulada). El correo individual a los leads sin cita es lo que puede mover una cita esta semana, y por eso C4 y C5 importan más que el texto de la newsletter. Bien ejecutado, es una segunda oportunidad limpia con los leads que ya pagaste. Mal ejecutado, es una queja.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Es texto: la portada es el asunto y el preheader. El asunto («24 llamadas, 3 citas y dos minutos con una operadora») es específico y abre brecha. El preheader añade el ángulo del fallo. Bien.
- Ritmo: párrafos de tres a cinco líneas, frases cortas en el fallo, una larga para explicar el sistema. Se puede leer en voz alta.
- La cabecera del capítulo en LinkedIn con la imagen «Sin humo» del martes es coherente si esa imagen ya no lleva rótulo de serie (lo dice la ficha del martes).
- Quitados los rótulos, el texto necesita un salto de línea doble entre bloques, nada más.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: el asunto es fuerte, el primer párrafo no. Empieza por «Hace dos semanas cambié mi empresa entera», que es sobre Maikel, cuando el asunto prometió el lunes.
- Claridad: alta. Ninguna palabra que no se diga en un bar.
- Credibilidad: alta por el fallo contado y por las cifras, dañada por C1, C2 y C3, que son las tres frases que un lector escéptico va a probar.
- CTA: un motivo, una dirección, y la alternativa de responder. Correcto. Falta la condición «empresa de servicios que ya vende» al principio del párrafo para filtrar, y ya está.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Serie madre correcta («Agentizando mi propia empresa», la espina dorsal). Habla de sistema comercial que ya existe, fuga, agente encima. Alineado.
- La decisión de no usar la base antigua y de escribir a los leads a mano desde Gmail es la que protege el North Star: una queja más cuesta más que cualquier apertura.
- Lo que se mide (respuestas, citas, suscriptores, no aperturas) está bien elegido.

## Versión Mejorada del Hook

Asunto: se mantiene «24 llamadas, 3 citas y dos minutos con una operadora».

Primer párrafo propuesto (sustituye al actual y absorbe el pivote en una línea):

> El lunes mi empresa hizo 24 llamadas y cerró 3 citas mientras yo estaba en una reunión. En tres de esas llamadas se quedó dos minutos escuchando a una operadora. Hace dos semanas dejé de ser una agencia para meter agentes de IA dentro de sistemas comerciales que ya existen, y lo primero que hice fue meterlos en el mío. Esto es lo que pasó.

## Próximo Experimento Recomendado

Con los leads sin cita y cadencia terminada, partir la lista en dos mitades: la mitad recibe el correo individual con el capítulo como posdata y la otra mitad el mismo correo sin posdata. Medir respuestas y citas en siete días. Hipótesis: el capítulo (ver el fallo contado) sube la respuesta porque quita la sensación de venta. Si no, el capítulo se queda en LinkedIn y el correo se queda corto.

## Veredicto: PUBLICAR CON CAMBIOS

Aplicar C1 a C5 y quitar los rótulos antes del miércoles 8:30. C4 es condición de envío: sin regla de cadencia terminada, el correo individual no sale.

---

# 3 · Guion de vídeo a cámara (45-60 s) · sección «Jueves 24» de `content/borradores/semana-39-formatos-intercalados.md`

## Nota Global (1-10)

**7.** El hook más fuerte de la semana y la estructura correcta (dato, culpa propia, qué hizo el agente, método regalado, CTA de recurso). Pero describe un agente que no es el que corre, un rótulo dice algo que la fuente no dice, y el guion dura entre 65 y 75 segundos, no 45-60.

## Resumen Ejecutivo

Las cifras del guion cuadran con `app.js`, propuesta §5 y §10 y estrategia línea 97: 34.500 €, 30 abiertas, 25 paradas, 15 de dos meses, 25 tareas, 10-sep. «Esta es la segunda» cuadra con `content/recursos/antes-de-gastar-mas.md` (pregunta 2: presupuestos abiertos sin fecha ni responsable). El recurso existe, tiene siete preguntas y va por mensaje directo a mano. La sección «Lo que NO dice» (cuánto se ha recuperado) es la disciplina correcta.

Lo que falla es lo mismo que en el artículo: la regla del agente («si no hay actividad ni tarea») y lo que deja en cada tarea («el mensaje preparado») no son las de `api/seguimientos.js`. El rótulo «15 · MÁS DE 57 DÍAS» dice más que la fuente («entre 57 y 63») y está colocado en el bloque equivocado. El pie de foto llama «presupuestos» a 25 oportunidades de todas las etapas. Y el guion tiene 187 palabras habladas para 58 segundos: a ritmo natural a cámara (2,5 a 2,8 palabras por segundo) son 65 a 75 segundos. Hay que cortar unas cuarenta palabras.

## Lo Mejor

- Los primeros cuatro segundos: «Le pedí a un agente que repasara mi CRM. Encontró 34.500 euros parados.» Un dato propio, una brecha, sin saludo ni logo. Para el scroll.
- «Y ninguna era culpa de nadie. Eran mías.» La confesión a cámara vale más que cualquier caso de cliente.
- «Tú puedes hacerlo hoy sin ningún agente.» Regala el método antes de pedir nada. Es la voz de la guía y es lo que diferencia de una agencia.
- Un rótulo por bloque, en mayúsculas, uno cada vez. Correcto para reel.
- CTA de recurso a mano, sin PDF ni registro, con una pregunta de vuelta («¿cuál de las siete te ha salido peor?»). Convierte el recurso en conversación.

## Lo Más Débil

- Duración. 187 palabras no caben en 58 segundos sin correr, y correr a cámara mata la confesión del segundo bloque.
- El bloque 24-38 s es el más largo (52 palabras) y el que explica el mecanismo del agente. Es donde el espectador se va y donde están los dos errores de hecho.
- Rótulo del bloque 14-24 s («15 · MÁS DE 57 DÍAS») mientras la voz dice «eran mías»: el ojo lee una cifra y el oído oye otra cosa.
- «Encontró 34.500 euros parados» se queda sin el matiz «declarados» que el artículo sí hace. En vídeo se entiende, pero en el pie de foto cabe una palabra más.

## Problemas Críticos Detectados

**C1 · «Sin fecha, sin tarea, sin nadie a cargo» no es lo que midió el agente.**
Falla (4-14 s): «Veinticinco sin siguiente paso. Sin fecha, sin tarea, sin nadie a cargo.»
Fuente: `api/seguimientos.js`: mide días en la misma etapa por encima del plazo de esa etapa. No consulta tareas ni responsable. Propuesta §5 y `app.js`: «25 paradas».
Propuesta: «Veinticinco paradas. Más días de la cuenta en la misma etapa, sin que nadie las moviera.»
Rótulo: «25 DE 30 SIN SIGUIENTE PASO» → «25 DE 30 PARADAS».

**C2 · La regla y «el mensaje preparado».**
Falla (24-38 s): «Recorrió los tratos uno a uno con una regla: si no hay actividad ni tarea, está parado. Y dejó veinticinco tareas con fecha, con nombre y con el mensaje preparado.»
Fuente: `api/seguimientos.js`: «crea UNA tarea en GoHighLevel con el siguiente movimiento ya escrito», asignada a Maikel, y «no manda nada al cliente: propone la acción a la persona». `app.js` línea 50: «tareas creadas, con fecha y con dueño».
Propuesta: «Recorrió los tratos uno a uno con una regla: cada etapa tiene un plazo, y el que lo pasa está parado. Y dejó veinticinco tareas con fecha, con nombre y con el siguiente paso escrito.»
Rótulo: «25 TAREAS · FECHA · NOMBRE · MENSAJE» → «25 TAREAS · FECHA · NOMBRE · SIGUIENTE PASO».

**C3 · «Más de 57 días» no es «entre 57 y 63», y el rótulo va en el bloque equivocado.**
Falla (rótulo del bloque 14-24 s): «15 · MÁS DE 57 DÍAS».
Fuente: estrategia línea 97 y propuesta §5 vía plan: «Quince llevaban entre 57 y 63 días». La voz dice «dos meses» en el bloque 4-14 s, y el rótulo aparece diez segundos después, sobre «eran mías».
Propuesta: rótulo «15 · DOS MESES PARADAS» (cuadra con lo que se dice) y pasarlo al final del bloque 4-14 s. El bloque 14-24 s se queda con «ERAN MÍAS», que es lo que se dice y lo que se recuerda.

**C4 · «Presupuestos» por «oportunidades» en el método y en el pie de foto.**
Falla (38-50 s): «filtra los presupuestos sin actividad en treinta días y suma el importe».
Falla (pie de foto): «Encontró 34.500 € parados en 25 presupuestos sin siguiente paso.»
Fuente: propuesta §5 y `app.js`: «25 oportunidades paradas» de cuatro pipelines y todas las etapas. No son 25 presupuestos enviados.
Propuesta (38-50 s): «filtra las oportunidades sin actividad en treinta días y suma el importe».
Propuesta (pie): «Encontró 34.500 € declarados parados en 25 oportunidades sin mover. Ninguna era culpa de nadie. Eran mías.»

## Qué Eliminaría

- «Lo que hizo el agente no es magia.» (24-38 s). Nadie ha dicho que lo fuera. Son seis palabras y un tono de defensa que no hace falta.
- «Lo que yo llevaba dos meses sin hacer: mirar la lista entera.» Buena frase, pero el bloque ya tiene la idea y el guion necesita esas once palabras en otro sitio.
- «en conseguir contactos» del cierre: «antes de gastar más» ya se entiende, y el recurso se llama así.
- Del pie de foto: «Cómo contar los tuyos en diez minutos, en el vídeo.» El pie no tiene que resumir el vídeo, tiene que dar el CTA.

## Qué Simplificaría

Guion recortado a unas 145 palabras (48-55 s a ritmo natural), con C1 a C4 aplicados:

> **(0-4 s)** Le pedí a un agente que repasara mi CRM. Encontró 34.500 euros parados.
> *Rótulo: 34.500 € PARADOS*
>
> **(4-13 s)** Treinta oportunidades abiertas. Veinticinco paradas: más días de la cuenta en la misma etapa, sin que nadie las moviera. Quince llevaban dos meses.
> *Rótulo: 25 DE 30 PARADAS · 15 · DOS MESES*
>
> **(13-21 s)** Y ninguna era culpa de nadie. Eran mías. El seguimiento lo llevaba en la cabeza, y en la cabeza caben cinco o seis. Las otras veinte dormían.
> *Rótulo: ERAN MÍAS*
>
> **(21-33 s)** El agente recorrió los tratos uno a uno con una regla: cada etapa tiene un plazo, y el que lo pasa está parado. Dejó veinticinco tareas con fecha, con nombre y con el siguiente paso escrito.
> *Rótulo: 25 TAREAS · FECHA · NOMBRE · SIGUIENTE PASO*
>
> **(33-45 s)** Tú puedes hacerlo hoy sin ningún agente. Abre el CRM, filtra las oportunidades sin actividad en treinta días y suma el importe. Si el número te sorprende, está bien contado.
> *Rótulo: SIN ACTIVIDAD EN 30 DÍAS → SUMA*
>
> **(45-53 s)** Tengo la lista de siete cosas que reviso antes de gastar más. Esta es la segunda. Escribe FUGA y te la mando.
> *Rótulo: ESCRIBE «FUGA»*

## Qué Reforzaría

- La confesión. Es el momento del vídeo. Que el rótulo del bloque sea «ERAN MÍAS» y no una cifra: el espectador ya tiene las cifras.
- Un plano de pantalla real de dos segundos (la lista de tareas en GHL, sin nombres) sobre el bloque del agente. Un plano y rótulos está bien, pero la prueba visual de que existe la lista es lo que separa esto de un vídeo de agencia. Si Maikel no quiere pantalla, que enseñe el móvil con la tarea abierta.
- El pie de foto: que lleve la fecha («el 10 de septiembre») para que el dato quede datado, como en el artículo.
- Coherencia con el artículo: mismo vocabulario (oportunidades, paradas, siguiente paso escrito) en las dos piezas, porque saldrán el mismo día con el mismo dato.

## Riesgos

- Duración: si se graba tal cual, o se corre o dura 70 segundos. En reel, el segundo bloque (la confesión) se pierde por retención.
- Descripción del agente distinta del agente real: quien escriba FUGA y luego pida diagnóstico verá la diferencia en la llamada. Mismo riesgo que en el artículo, y más público.
- CTA «Escribe FUGA» con respuesta a mano en 24 horas: si un día caen veinte comentarios y Maikel está en reuniones, se rompe la promesa. Regla de reserva: responder con «te lo mando esta noche» en el comentario si no llega a tiempo.
- Pausa de redes vigente. El guion se puede grabar, pero no publicar, hasta que Maikel la levante por escrito.

## Impacto Esperado

Sobre el North Star: CTA de recurso, así que el impacto directo en diagnósticos es indirecto (quien escribe FUGA entra en conversación con Maikel y la pregunta «¿cuál de las siete te ha salido peor?» abre el diagnóstico sin pedirlo). Es la pieza con más probabilidad de compartirse de la semana, y el dato propio es el que sostiene la credibilidad de todo lo demás. Con C1 y C2 aplicados, cada conversación que abra lo hace con la expectativa correcta del producto.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Portada: los primeros cuatro segundos son el dato y el rótulo «34.500 € PARADOS». Correcto: cifra grande, una idea, sin logo.
- Rótulos en Anton, mayúsculas, naranja sobre vídeo, uno cada vez: legible en móvil. Los rótulos de más de cinco palabras (el del bloque del agente) se leen mal en dos segundos: si se deja «25 TAREAS · FECHA · NOMBRE · SIGUIENTE PASO», que aparezca en dos tiempos («25 TAREAS» y después «FECHA · NOMBRE · SIGUIENTE PASO»).
- Ritmo: seis bloques en 58 segundos con cortes cada 10-14 s. Bien para reel si se recorta el texto. Ahora el bloque 24-38 s es demasiado largo para un solo plano.
- Legibilidad de la voz: sin saludo, frases cortas, una pausa clara antes de «Eran mías». Que se grabe con esa pausa.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: fuerte, específico, propio. Cumple los tres segundos.
- Claridad: cero jerga. «Oportunidades», «tratos», «etapa» son palabras del CRM que el dueño usa.
- Credibilidad: la cifra, la fecha implícita y la confesión la sostienen. La rompen C1 y C2 el día que un comprador vea el agente real.
- CTA: una acción, una palabra, sin enlace, con promesa clara («te la mando»). Bien. «Esta es la segunda» crea curiosidad por las otras seis.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Fuga (seguimiento), sistema (el CRM que ya tiene), agente encima, método regalado. Alineado con propuesta §1 y con la serie madre.
- Es la demostración del producto en la propia casa, lo que la estrategia llama «lo único que nadie del sector puede copiar». Bien elegido como pieza fuerte.
- Reparto de CTA de la semana (57 / 14 / 29 frente a 50 / 30 / 20): el recurso va corto y esta es la única pieza de recurso. Correcto que sea esta.

## Versión Mejorada del Hook

> **(0-4 s)** Un agente repasó mi CRM y encontró 34.500 euros parados. La culpa era mía.
> *Rótulo: 34.500 € PARADOS*

Adelanta la confesión un bloque: la brecha ya no es solo «cuánto» sino «por qué es suya». Y deja el segundo bloque para las cifras, que entran mejor después de saber que no hay culpable externo.

## Próximo Experimento Recomendado

Grabar el mismo guion con los dos hooks (el actual y el de la confesión adelantada), publicarlos con una semana de diferencia en el mismo horario y comparar dos cosas: retención a los 5 segundos y número de «FUGA» en comentarios que acaban en diagnóstico. Hipótesis: la confesión en el hook baja la retención inicial un poco y sube los FUGA que se convierten, porque atrae a dueños que se reconocen. Lo que se mide son diagnósticos, no reproducciones.

## Veredicto: PUBLICAR CON CAMBIOS

Aplicar C1 a C4 y recortar a unas 145 palabras antes de grabar. Grabar solo con la versión corregida: el guion actual no se puede arreglar en montaje.

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| Artículo `/blog/presupuestos-sin-respuesta/` (publicado) | 6 | PUBLICAR CON CAMBIOS (aplicar en caliente hoy) | 9 |
| Newsletter · capítulo 1 · `content/newsletter/2026-09-23.md` | 7 | PUBLICAR CON CAMBIOS (C4 es condición de envío) | 5 |
| Guion de vídeo a cámara · jueves 24 | 7 | PUBLICAR CON CAMBIOS (recortar y corregir antes de grabar) | 4 |

Fuera de las tres piezas, pero mismo error: `content/infografias/2026-09-22-fuga-por-etapa/08-seguimiento.html` dice «Un despacho hizo 6,45 veces lo invertido solo con esto». Nuria Roure no es un despacho y el 6,45× no es «solo con esto».
