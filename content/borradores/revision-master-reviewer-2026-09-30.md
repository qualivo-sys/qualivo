# Revisión Qualivo Master Reviewer · 30-sep-2026

> Tres piezas del commit `eb1de14` («Contenido 30-sep»). Revisadas con
> `content/agentes/prompt-qualivo-master-reviewer.md`, `content/guia-de-voz.md`
> (con la regla del 22-sep), `content/estandar-articulos.md` y las reglas de
> Maikel (plantones, WhatsApp personal, terceros, construcciones vetadas, raya
> larga y punto y coma, acierto con dato primero, nada inventado, regla de
> agosto de `growth-os.md` l. 65, ni precio ni garantía del calendario de
> octubre).

## Fuentes contrastadas

| Claim | Fuente | Qué dice la fuente, tal cual |
|---|---|---|
| Diagnóstico de 15 a 30 min, huecos de hora en hora | `bus/out/demand.jsonl`, daily 29-sep, `cambios_hoy.agenda` | «Diagnóstico de 30 minutos (antes «15»): cambiado en landings, mensajes, Raquel y calendario. Huecos de hora en hora porque las reuniones se alargan.» No dice «siempre», ni «casi siempre», ni que nadie esperase, ni por qué se alargan. |
| Llamada «te estamos esperando» | mismo daily, `llamadas_hoy` (Izaskun) y `reuniones_hoy` | «llamada de 'te estamos esperando': se conectó a la videollamada en ese momento» y «conectada por la llamada de aviso». La hizo Raquel (voz en Vapi con el móvil de Maikel como identificador, `content/brief-recorrido-semana-38.md` l. 34). |
| Estructura, ficha, quién decide, «si corrige un número…», dos empresas sin ver valor, varios decisores | `content/guion-de-venta.md` | Ficha la manda Growth a las 8:30 (l. 18). Reunión de 30 min en siete partes, cierre en los minutos 25-30 (l. 23-33). «Si corrige un número, lo cambias delante de él» (l. 30). Talkual y Skolae «no veían valor en la reunión hasta que les enseñamos que ya habíamos mirado su negocio» y en la empresa de software «había varios decisores y costó que lo entendieran» (l. 3-8). Esto «sale de lo que ha pasado en septiembre», no de preparar el guion. |
| Herramienta propia para rellenar el diagnóstico en directo | `guion-de-venta.md` l. 20 y 29-30, `intelligence/diagnostico/index.html` | «Diagnóstico en vivo (Maikel, 25-sep-2026): en la reunión Maikel comparte pantalla, hace estas pocas preguntas y las rellena él.» Botón «Ver el diagnóstico». Respaldado. |
| Duración del diagnóstico hoy | `diagnostico/index.html` y git log | La página dice 30 minutos en todo (title, hero, pasos, FAQ) y plan por escrito en 24 horas. `33e3572` lo subió a 45 («las reuniones se alargan casi a la hora») y `31e7663`, un minuto después, lo dejó en 30 porque «Maikel prefiere decir treinta. El calendario sigue reservando la hora entera (30 min + 30 de colchón, un hueco por hora) para que una reunión que se alarga no pise la siguiente». |

Conclusión de duración: las tres piezas dicen 30 minutos y 24 horas, coherentes con `/diagnostico/`. El problema está en otro sitio: la pieza 3 aconseja «dales el tiempo que ya están durando» cuando Qualivo anuncia 30 y reserva la hora porque se alargan casi a la hora. Esa incoherencia se detalla en la pieza 3.

---

# PIEZA 1 · Artículo «Primera reunión con un cliente» (`blog/primera-reunion-con-un-cliente/index.html`)

Keyword: «primera reunión con un cliente». Revisado: texto visible, «En 30 segundos», FAQ, schema, CTA, y también el og:description, la tarjeta del blog (`blog/index.html`) y la línea de `llms.txt`, que repiten el claim.

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **6** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1-6, 11 (el cierre funciona como mini landing) y 12. Carrusel, reel, anuncio y outbound no aplican.

## Nota Global (1-10)

6/10.

## Resumen Ejecutivo

Artículo útil, corto, con estructura clara (antes, durante, al terminar) y un CTA bien conectado. Pero dice más de lo que dicen sus fuentes: «siempre» donde el daily dice «se alargan», una persona que esperaba que no aparece en ningún sitio, un «cada día» que nadie ha medido y una comparación con «una demo de veinte minutos» sin fuente. Además hay dos «no es X, es Y» disfrazados, uno en el lede. Todo se arregla frase a frase, sin tocar la estructura.

## Lo Mejor

- Dato propio con fecha y cifra: el 29-sep el diagnóstico pasa de 15 a 30 minutos con huecos de hora en hora. Es verificable y cuadra con `/diagnostico/`.
- La anécdota de la llamada de «te estamos esperando» es real (Izaskun, daily 29-sep), no nombra a nadie y es accionable.
- Los pasos 1 a 6 son fieles al guion: ficha con dos cosas reales, confirmación con una sola pregunta, un dato que traer, agenda y permiso, quién decide en el minuto dos, «si corrige un número, lo cambias delante de él», cerrar con fecha.
- La cita de agenda del guion se publica sin «y cuánto cuesta». Ni precio ni garantía en todo el artículo. Bien.
- Sin nombres de terceros, sin tasa de plantones, sin raya larga, sin punto y coma.
- Destacado y regla bien elegidos. La keyword está en H1, lede, FAQ y ancla interna.
- El CTA habla de lo mismo que el artículo y promete lo que promete `/diagnostico/` (media hora, plan en 24 horas).

## Lo Más Débil

- El «siempre» se ha colado en cinco sitios (resumen, FAQ visible, FAQ del schema, og:description, tarjeta del blog). La fuente no lo dice.
- «la siguiente persona esperaba» es una escena inventada.
- El lede abre con un «no se pierde por X. Se pierde por Y».
- El artículo empieza por el fallo (15 minutos que se alargaban) y no por el acierto con dato.

## Problemas Críticos Detectados

**C1.1 · «siempre» no está en la fuente (resumen «En 30 segundos»).**
Falla: «Nuestras reuniones de 15 minutos se alargaban siempre. El 29 de septiembre pasaron a 30, con huecos de hora en hora.»
Propuesta: «El 29 de septiembre pasamos nuestro diagnóstico de 15 a 30 minutos, con huecos de hora en hora, porque las reuniones se alargaban.»
(De paso pone el acierto con dato primero.)

**C1.2 · «siempre» y «se quedaban cortos» no están en la fuente (FAQ visible y FAQ del schema, mismo texto en los dos).**
Falla: «En nuestro caso, 15 minutos se quedaban cortos y las reuniones se alargaban siempre, así que pasamos a 30 y dejamos huecos de hora en hora.»
Propuesta: «En nuestro caso, el diagnóstico se anunciaba de 15 minutos y las reuniones se alargaban, así que el 29 de septiembre pasamos a 30 y dejamos huecos de hora en hora.»

**C1.3 · «siempre» no está en la fuente (og:description).**
Falla: «Nuestras reuniones de 15 minutos siempre se alargaban. El 29 de septiembre pasaron a 30. Lo que cambiamos antes, durante y después de la primera reunión.»
Propuesta: «El 29 de septiembre pasamos nuestro diagnóstico de 15 a 30 minutos porque las reuniones se alargaban. Lo que cambiamos antes, durante y después de la primera reunión.»

**C1.4 · «siempre» no está en la fuente (tarjeta en `blog/index.html`).**
Falla: «Nuestras reuniones de 15 minutos siempre se alargaban y pasaron a 30. Qué cambiamos antes, durante y después de la primera reunión.»
Propuesta: «El 29 de septiembre pasamos el diagnóstico de 15 a 30 minutos porque las reuniones se alargaban. Qué cambiamos antes, durante y después de la primera reunión.»

**C1.5 · «casi siempre» y «la siguiente persona esperaba» no están en ninguna fuente. Es una escena inventada.**
Falla: «En la práctica, las reuniones se alargaban casi siempre, y la siguiente persona esperaba.»
Propuesta: «En la práctica, las reuniones se alargaban.»

**C1.6 · Origen equivocado: el guion dice que esto salió de lo que pasó en septiembre, no de prepararlo.**
Falla: «Aprendimos otras dos cosas preparando el guion de la reunión.»
Propuesta: «Septiembre nos dejó otras dos cosas, que ya están en el guion de nuestras reuniones.»

**C1.7 · La fuente dice «hasta que les enseñamos», no «hasta que nota».**
Falla: «Hay gente que no ve para qué sirve la reunión hasta que nota que ya has mirado su negocio.»
Propuesta: «Hay gente que no ve para qué sirve la reunión hasta que le enseñas que ya has mirado su negocio.»

**C1.8 · «mucho más» y «si no lo sabes desde el principio» no están en la fuente, que dice «había varios decisores y costó que lo entendieran».**
Falla: «Y cuando hay varias personas que deciden, cuesta mucho más que lo entiendan todas si no lo sabes desde el principio.»
Propuesta: «Y cuando deciden varias personas, cuesta que lo entiendan todas.»

**C1.9 · «no es X, es Y» disfrazado en el lede (y generalización sin dato: «casi nunca»).**
Falla: «La primera reunión con un cliente casi nunca se pierde por lo que dices en ella. Se pierde antes, porque llega sin saber para qué viene, o al final, porque termina en «ya te digo algo».»
Propuesta: «Para mí, una primera reunión con un cliente se tuerce en dos momentos: antes de empezar, cuando llega sin saber para qué viene, y al final, cuando termina en «ya te digo algo».»

**C1.10 · «es X y no Y», construcción vetada.**
Falla: «Esas dos cosas son las que hacen que, en el minuto uno, note que la reunión es sobre su negocio y no una presentación de la tuya.»
Propuesta: «Esas dos cosas son las que hacen que, en el minuto uno, note que has mirado su negocio antes de hablar con él.»

**C1.11 · Comportamiento de Maikel sin fuente: nada dice que haya primeras reuniones cada día.**
Falla: «Lo cuento con lo que hemos cambiado en nuestras propias reuniones este mes, porque la primera reunión es justo lo que hacemos cada día: media hora para enseñarle a alguien dónde pierde dinero.»
Propuesta: «Lo cuento con lo que hemos cambiado en nuestras propias reuniones este mes, porque nuestro diagnóstico es eso, una primera reunión: media hora para enseñarle a alguien dónde pierde dinero.»

**C1.12 · Cifra sin fuente («veinte minutos»), y choca con el guion, que sí usa una demo de 3 minutos.**
Falla: «Una reunión donde el cliente ve su problema vale más que una demo de veinte minutos.»
Propuesta: «Después, deja que reaccione antes de enseñarle nada más.» (guion, l. 30: «Deja que reaccione».)

**C1.13 · Claim de servicio sin fuente: ninguna página dice que montemos que el comercial «salga con un siguiente paso». Lo que sí está respaldado es la ficha del contacto (`intelligence/`, demo) y que el CRM del cliente sigue como está (`/diagnostico/`, «Sin empezar de cero»).**
Falla: «Es lo mismo que montamos para nuestros clientes: que el comercial llegue preparado y salga con un siguiente paso, dentro del CRM que ya usan.»
Propuesta: «Es lo mismo que montamos para nuestros clientes: que quien atiende a un contacto tenga su ficha delante antes de hablar con él, en el CRM que ya usan.»

## Qué Eliminaría

- Los H2 sueltos «Antes de la reunión», «Durante la reunión» y «Al terminar» como H2 vacíos: pásalos a una línea de sección o a H3, o dales una frase. El estándar pide que la primera frase de cada H2 sea una respuesta.
- «en vez de descubrirlo en el seguimiento» (paso 4): sobra y roza el contraste vetado. Queda: «Si hay alguien más, lo sabes a tiempo de dejarle algo para enseñárselo.»

## Qué Simplificaría

- El `<title>` tiene unos 95 caracteres. «Primera reunión con un cliente: cómo prepararla · Qualivo» cabe entero en Google.
- El párrafo de la llamada: la fuente dice «en ese momento». Mejor «se conectó a la videollamada en ese momento» que «al instante», para ir pegado al dato.

## Qué Reforzaría

- El acierto con dato primero en «Lo que nos enseñó septiembre»: abrir con el cambio del 29-sep o con la llamada de «te estamos esperando», y dejar «las de 15 se alargaban» como fallo corto detrás.
- Una postura con la cara en el cierre («yo no cerraría ninguna sin fecha, aunque quede raro»): la regla ya lo dice, falta que suene a Maikel.

## Riesgos

- El «siempre» y la persona que esperaba son exactamente el tipo de claim que el revisor del 21-sep marcó como crítico. Si se copia en redes, se multiplica.
- La llamada de «te estamos esperando» la hizo Raquel con el móvil de Maikel como identificador. El artículo no dice quién llamó y está bien así. No añadir «le llamé» ni nada que atribuya la llamada a Maikel.
- Plantones: la anécdota de «si a la hora no aparece» no permite deducir ninguna tasa. Aun así, `content/diario-contenido.md` (l. 760 y 812) tiene pendiente con Maikel una tasa de plantones ya publicada en otros sitios. No sumar más contenido de plantones hasta que decida.
- Regla de agosto: las dos lecciones de septiembre vienen de empresas concretas (Talkual, Skolae, la de software). Están generalizadas, sin nombres y sin resultados, así que pasan. No convertirlas en «trabajamos con una empresa que…».
- `llms.txt`: su línea no dice «siempre», está bien. Si se cambia el resumen, revisar que siga cuadrando.

## Impacto Esperado

Moderado y directo sobre diagnósticos: quien busca cómo preparar una primera reunión es alguien que vende, y el CTA le ofrece exactamente eso con sus números. No mueve pilotos por sí solo. Su valor es que la gente llegue al diagnóstico sabiendo cómo será la media hora.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Plantilla del blog correcta: resumen oscuro, destacado, regla, números de sección, FAQ desplegable, autor. Párrafos cortos, se lee bien en móvil. Fallo de jerarquía: tres H2 de sección seguidos de otro H2 numerado dan dos títulos del mismo tamaño pegados. Falta un elemento que aporte algo que Google no tiene, por ejemplo una tabla «minuto · qué haces · qué dices» sacada del guion sin la fila de la propuesta.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: se entiende, pero es un «no es X, es Y» (C1.9).
- Claridad: alta. Frases cortas, ejemplos con hora («mañana a las 10:00», «el jueves a las 12:00»).
- Credibilidad: buena base y mal rematada. Un dato real bien usado y cinco adornos sin fuente (C1.1 a C1.5, C1.11, C1.12).
- CTA: «¿Tus reuniones acaban con fecha?» conecta con el tema, promesa alineada con `/diagnostico/`. Bien.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Habla de fugas (la reunión que acaba sin fecha es una), de sistema (ficha, confirmación, CRM) y lleva al diagnóstico. Suma a la North Star por la vía de diagnósticos. Cumple el estándar salvo en veracidad de claims y en los H2 vacíos.

## Versión Mejorada del Hook

«El 29 de septiembre pasamos nuestro diagnóstico de 15 a 30 minutos, con huecos de hora en hora en el calendario. Las de 15 se alargaban. Esto es lo que cambiamos antes, durante y después de una primera reunión con un cliente.»

## Próximo Experimento Recomendado

Dos semanas midiendo clics del botón «Pedir el diagnóstico» de este artículo frente al de `ahora-no-es-el-momento` (mismo cluster). Si este convierte más, la tabla del guion como elemento visual pasa a ser plantilla de los artículos de ventas.

## Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 2 · Reorientación de «Cliente ideal B2B» (`blog/cliente-ideal-b2b/index.html`)

Revisado solo lo que cambió: errores 2 y 3 de «Los 3 errores clásicos», el párrafo nuevo tras la lista y el post-cta.

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **a medias** · Nota **7** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1-6, 11 (el cierre) y 12.

## Nota Global (1-10)

7/10.

## Resumen Ejecutivo

La reorientación quita el «no es un perfil: es una esperanza» (bien) y lleva el ICP a la primera reunión con enlace al artículo nuevo. El cambio funciona. Falla el post-cta: promete que el diagnóstico te dice «a quién deberías estar llamando primero», y eso no lo promete `/diagnostico/`. El párrafo nuevo es algo confuso y duplica el CTA justo antes de la caja.

## Lo Mejor

- Error 2 sin la construcción vetada: «no te sirve para decidir a quién llamar primero» es concreto y se entiende.
- Error 3 aterriza en algo que el lector reconoce: todos los contactos parecen iguales hasta la reunión.
- Un solo botón en el cierre, a `/diagnostico/`. Antes eran dos.
- Media hora y 24 horas, coherentes con `/diagnostico/`. Ni precio ni garantía. Sin raya larga ni punto y coma.

## Lo Más Débil

- «Si sabes quién es» no dice si habla del ICP o de la persona concreta. Preparar dos cosas reales de su negocio depende de conocer a esa persona, no del ICP, y el salto lógico se nota.
- El error 3 perdió la palabra «fuga» («la fuga más silenciosa de todas»), que era lo más Qualivo del bloque.

## Problemas Críticos Detectados

**C2.1 · Promesa del diagnóstico que la fuente no dice. `/diagnostico/` promete «Cuántos de los que entran iban a comprarte de verdad» (punto «El lead») y «dónde se escapa el negocio», no a quién llamar primero. Además «los demás» es ambiguo.**
Falla: «Media hora con tus números delante. Salimos con a quién deberías estar llamando primero y dónde se te escapan los demás, y el plan por escrito te lo quedas en 24 horas.»
Propuesta: «Media hora con tus números delante. Salimos con cuántos de los que te entran iban a comprarte de verdad y dónde se te escapa el negocio, y el plan por escrito te lo quedas en 24 horas.»

## Qué Eliminaría

- En el párrafo nuevo, el segundo enlace «y si quieres verlo con tu caso, en media hora lo miramos con tus números». La caja del CTA dice lo mismo tres líneas después.

## Qué Simplificaría

- El párrafo nuevo, para que la lógica sea ICP → reunión:
  «El ICP se nota de verdad en la primera reunión. Si el contacto encaja, llegas sabiendo qué mirar de su negocio y a quién preguntar quién decide. Si no encaja, lo normal es que la media hora se vaya en explicar quién eres. Te cuento cómo preparamos esa reunión en [primera reunión con un cliente].»
  «Si no encaja, lo normal es…» es opinión, y conviene que se lea como tal. No hay dato propio que la respalde.

## Qué Reforzaría

- Devolver la fuga al error 3: «Nadie lo nota, porque todos los contactos parecen iguales hasta la primera reunión. Es una fuga que no hace ruido.»

## Riesgos

- Si el post-cta promete priorización de contactos y la reunión no la da, se rompe la confianza justo en el diagnóstico.
- Triada simétrica en el párrafo nuevo («preparas…, preguntas… y sales…»): el estándar la marca como huella de IA. Menor.

## Impacto Esperado

Bajo a moderado. El artículo ya posiciona. El cambio suma un enlace interno útil al artículo nuevo y un CTA más concreto. Efecto sobre diagnósticos pequeño y positivo si se corrige C2.1.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Sin cambios de diseño salvo el botón único, que mejora la jerarquía del cierre. El párrafo nuevo tiene 4 líneas en escritorio y unas 7 en móvil: en el límite del estándar.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Claridad: errores 2 y 3 claros. Párrafo nuevo con la ambigüedad de «quién es».
- Credibilidad: sin cifras nuevas. El único claim con riesgo es el del CTA (C2.1).
- CTA: título «¿Tu captación filtra o recoge de todo?» bien conectado con el ICP.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Buena idea tejer el ICP con la primera reunión: lleva tráfico de un artículo que ya rankea al artículo nuevo y al diagnóstico. Con C2.1 corregido, suma a diagnósticos sin prometer de más.

## Versión Mejorada del Hook

No aplica: el H1 y el lede no cambiaron. Para el párrafo nuevo, la primera frase: «El ICP se nota de verdad en la primera reunión.»

## Próximo Experimento Recomendado

Medir clics del enlace interno a `/blog/primera-reunion-con-un-cliente/` durante dos semanas. Si pasan de un puñado, repetir el patrón (error clásico → primera reunión) en los otros artículos del cluster.

## Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 3 · Borrador de redes del miércoles (`content/borradores/2026-09-30-bandera-roja-reuniones.md` + `content/infografias/2026-09-30/reuniones-15.png`)

Fila de Notion: Diseño ok **a medias** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **a medias** · Nota **4** · Veredicto **REHACER**.

Ángulos que aplican: 1-6, 7 (pieza de imagen única, criterios de portada) y 12.

## Nota Global (1-10)

4/10.

## Resumen Ejecutivo

El dato es bueno y verificable (15 → 30 minutos, huecos de hora en hora, 29-sep). Pero casi todo lo que lo rodea se lo inventa la pieza: por qué se alargaban («la conversación interesa»), qué pasaba (llegar tarde a la siguiente, cerrar deprisa) y un «siempre» que no está en ninguna fuente. Nombra «los mensajes» y «el agente que agenda» en primera persona de Maikel, lo que deja leer que los mensajes que recibe un contacto son automáticos. Y el consejo final («dales el tiempo que ya están durando») contradice lo que hace Qualivo: anuncia 30 y reserva la hora porque se alargan casi a la hora. Además abre con el fallo, no con el acierto. Hay que rehacer el texto y la imagen.

## Lo Mejor

- Dato real, fechado y con antes y después. Sin clientes, sin nombres, sin plantones, sin precio ni garantía.
- La imagen se entiende en un segundo: el 15 tachado y el 30 grande son un buen gancho visual.
- «Guarda los últimos cinco minutos para el siguiente paso» tiene respaldo en el guion (cierre en los minutos 25-30).
- Sin raya larga ni punto y coma en lo que se lee en redes.

## Lo Más Débil

- El «acierto» de la ficha («las reuniones se alargan porque la gente se engancha») no está en ninguna fuente. La regla pide primero el acierto con dato, y el acierto real es el cambio del 29-sep.
- El texto de LinkedIn repite el hook en el segundo párrafo.
- La ficha dice que enlaza con el artículo del día, pero el texto no lleva el enlace.

## Problemas Críticos Detectados

**C3.1 · Orden: abre con el fallo. La regla es primero el acierto con dato, después el fallo, corto (LinkedIn, pie de Instagram e imagen).**
Falla: «Mis reuniones de 15 minutos se alargaban. Así que dejaron de ser de 15.»
Propuesta: «El 29 de septiembre pasé el diagnóstico de 15 a 30 minutos y en el calendario dejé un hueco por hora. Tendría que haberlo hecho antes: las de 15 se alargaban.»

**C3.2 · Causa inventada. El daily solo dice «porque las reuniones se alargan».**
Falla: «Tiene su lado bueno: si se alarga, es porque la conversación interesa.»
Propuesta: eliminar la frase. Si se quiere una opinión, marcarla y no presentarla como lo que pasó: «No sé si es buena o mala señal. Sé que el calendario no aguantaba.»

**C3.3 · Experiencia de Maikel inventada y «siempre» sin fuente. La fuente (commit `31e7663`) solo dice que el colchón es «para que una reunión que se alarga no pise la siguiente».**
Falla: «Pero una reunión que siempre se pasa de hora tiene un problema, aunque vaya bien. Si tienes otra detrás, llegas tarde a esa. Y los últimos minutos, que es cuando se acuerda el siguiente paso, se hacen deprisa.»
Propuesta: «Y una reunión que se alarga pisa la siguiente.»

**C3.4 · Se lee como envío automatizado desde el número de Maikel. En primera persona, en su cuenta personal, «los mensajes» y «el agente que agenda» (Raquel, que llama con su móvil como identificador) dejan atar cabos.**
Falla: «Lo cambié en todo a la vez: en la web, en los mensajes, en el agente que agenda y en el calendario.»
Propuesta: «Lo cambié el mismo día en la web y en el calendario.»

**C3.5 · Consejo incoherente con lo que hace Qualivo, «siempre» sin fuente y «no X. Y» disfrazado. Qualivo anuncia 30 y reserva la hora porque se alargan casi a la hora (`33e3572`, `31e7663`). No les da «el tiempo que ya están durando». Está en LinkedIn, en el pie de Instagram y en el pie de la imagen.**
Falla (LinkedIn e imagen): «Si tus reuniones siempre se pasan de hora, no las acortes. Dales el tiempo que ya están durando, y guarda los últimos cinco minutos para el siguiente paso, con fecha.»
Falla (Instagram): «Si las tuyas siempre se pasan, no las acortes. Dales el tiempo que ya están durando, y guarda los últimos cinco minutos para acordar el siguiente paso.»
Propuesta (las tres): «Si tus reuniones se alargan, deja colchón en el calendario para que una no pise la siguiente. Y guarda los últimos cinco minutos para el siguiente paso, con fecha.»

**C3.6 · La pregunta final le da la vuelta a Maikel: él dice 30 y el colchón es de una hora porque se alargan casi a la hora.**
Falla: «¿Cuánto duran de verdad tus primeras reuniones, y cuánto dices que duran?»
Propuesta: «¿Cuánto os duran de verdad las primeras reuniones?»

**C3.7 · Titular de la imagen, mismo problema que C3.1.**
Falla: «Mis reuniones de 15 minutos se alargaban. Así que dejaron de ser de 15.»
Propuesta: «Desde el 29 de septiembre, mi diagnóstico dura 30 minutos. Las de 15 se alargaban.»

## Qué Eliminaría

- El segundo párrafo de LinkedIn («El diagnóstico que hago con cada empresa se anunciaba de 15 minutos. En la práctica, se alargaba.»): repite el hook.
- El rótulo «Me pasaba a mí» de la imagen. Es justo lo que la regla del 22-sep quiere fuera (un rótulo en mayúsculas encima de la pieza) y además está en pasado cuando las reuniones se siguen alargando. Si hace falta algo arriba, que sea lo que pasó: «29 de septiembre».

## Qué Simplificaría

Texto de LinkedIn completo, con los críticos aplicados:

> El 29 de septiembre pasé el diagnóstico de 15 a 30 minutos y en el
> calendario dejé un hueco por hora. Tendría que haberlo hecho antes: las de
> 15 se alargaban.
>
> Y una reunión que se alarga pisa la siguiente.
>
> Lo cambié el mismo día en la web y en el calendario.
>
> Si tus reuniones se alargan, deja colchón en el calendario para que una no
> pise la siguiente. Y guarda los últimos cinco minutos para el siguiente
> paso, con fecha.
>
> ¿Cuánto os duran de verdad las primeras reuniones?

Pie de Instagram:

> El 29 de septiembre pasé el diagnóstico de 15 a 30 minutos, con un hueco
> por hora. Las de 15 se alargaban.
>
> Si las tuyas se alargan, deja colchón para que una no pise la siguiente, y
> guarda los últimos cinco minutos para el siguiente paso.
>
> ¿Cuánto os duran de verdad? Dímelo abajo.

## Qué Reforzaría

- El enlace al artículo del día en el primer comentario de LinkedIn, como dice la propia ficha.
- CTA de semana 0 del calendario: se puede sumar «Si quieres verlo con tu caso, escríbeme DIAGNÓSTICO». Una pregunta sola da comentarios, no conversaciones.

## Riesgos

- C3.4 es el mismo patrón que la revisión del 25-sep marcó como crítico (C4): la pieza no nombra WhatsApp, pero se deduce.
- Publicar «dales el tiempo que ya están durando» mientras el calendario reserva una hora para una reunión anunciada de 30 es una contradicción que cualquiera que reserve puede ver.
- Redes siguen en pausa (lo dice el propio borrador). No sale sin el ok de Maikel.

## Impacto Esperado

Bajo en pilotos. Es una pieza de criterio y cercanía. Con el CTA de «escríbeme DIAGNÓSTICO» puede abrir alguna conversación. Sin él, se queda en comentarios.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Portada: el 15 tachado en gris con la línea naranja y el «30 min» en crema paran el scroll. Buena jerarquía.
- Ritmo: el bloque antes y después se lee rápido. Hay un hueco muerto de unos 170 px entre las filas y la línea naranja del pie. Subir el pie o meter ahí el «últimos cinco minutos para el siguiente paso» como tercera fila.
- Legibilidad: el pie a 26 px en gris al 75 % queda flojo en móvil. Subir a 30 px o a blanco.
- La columna derecha dice «Diagnóstico de 30 minutos» sin «anunciado», así que da a entender que dura 30. Poner «Diagnóstico anunciado de 30 minutos, con la hora reservada» es más honesto, o quitar «anunciado» también de la izquierda.
- Hay que regenerar el PNG (`render.sh`) con el titular y el pie nuevos (C3.5, C3.7).

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: claro, pero empieza por el fallo (C3.1).
- Claridad: buena.
- Credibilidad: baja. Un dato real rodeado de causa, escena y «siempre» inventados (C3.2, C3.3, C3.5).
- CTA: pregunta de conversación, válida en semana 0, pero con la trampa de C3.6.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

«La reunión que acaba sin fecha» es una fuga real del recorrido y encaja con la semana. La pieza no la nombra como fuga y no lleva a ninguna conversación comercial. Con el CTA de DIAGNÓSTICO y el enlace al artículo, suma algo a diagnósticos. Tal como está, suma cercanía y riesgo.

## Versión Mejorada del Hook

«El 29 de septiembre pasé el diagnóstico de 15 a 30 minutos y en el calendario dejé un hueco por hora. Tendría que haberlo hecho antes: las de 15 se alargaban.»

## Próximo Experimento Recomendado

Publicar la versión corregida en LinkedIn con «escríbeme DIAGNÓSTICO» y, la semana siguiente, una pieza parecida solo con la pregunta. Comparar mensajes privados, no comentarios.

## Veredicto: REHACER

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| 1 · Artículo «Primera reunión con un cliente» | 6/10 | PUBLICAR CON CAMBIOS | 13 (C1.1 a C1.13) |
| 2 · Reorientación «Cliente ideal B2B» (errores 2 y 3, párrafo nuevo, post-cta) | 7/10 | PUBLICAR CON CAMBIOS | 1 (C2.1) |
| 3 · Redes del miércoles «reuniones de 15» + imagen | 4/10 | REHACER | 7 (C3.1 a C3.7) |
