# Revisión Qualivo Master Reviewer · 6-oct-2026

> Dos piezas del commit `b1198d1` («Contenido 6-oct»). Revisadas con
> `content/agentes/prompt-qualivo-master-reviewer.md`, `content/guia-de-voz.md`
> (con la regla del 22-sep), `content/estandar-articulos.md` y las reglas de
> Maikel (tasa de plantones, terceros sin nombres ni cifras, construcciones
> vetadas, raya larga y punto y coma, acierto con dato primero, nada inventado,
> regla de agosto de `growth-os.md` l. 65, ni precio ni garantía).

## Fuentes contrastadas

| Claim | Fuente | Qué dice la fuente, tal cual |
|---|---|---|
| Nivel A por inversión y por más de 100 peticiones | `bus/out/demand.jsonl`, daily 5-oct 10:00 (`para_paid`) | «Lola sale nivel A por inversión 500-2.000 y >100 peticiones». **Correcto.** |
| Servicio de precio bajo | misma entrada (`titulo`, `ticket_estimado`) | «Ticket real 49 € (programa grupal)», «el nivel A del formulario no ve el ticket del cliente final». **Correcto.** La fuente da el precio, **no el margen**: «cada cliente le dejaba poco» es una deducción. |
| «La cuenta tenía que pagarse con muchos clientes» | misma entrada | «con 800 €/mes de cuota la cuenta le sale justa». Habla de **nuestra cuota**. Dice «justa», no «muchos clientes al mes». |
| Se propone añadir al formulario la pregunta del ticket | misma entrada | «Propuesta: añadir al formulario una pregunta de ticket del cliente final (cuánto cobra por su servicio principal). [...] Encaja con las 3 preguntas de tamaño previstas para el 13-oct. **Decide Paid con Maikel.**» |
| Quién lo propone y a quién | misma entrada, `agente: growth`, campo `para_paid` | Lo propone **el agente de Growth**, se lo propone **a Paid**, y la decisión es **de Paid con Maikel, pendiente**. No lo propone «nuestro equipo» y **no se ha cambiado nada** en el formulario. |
| Fecha de entrada del contacto | daily 4-oct 21:40 (`leads_hoy`) y daily 5-oct (`contactado_en`) | Entró antes del 5-oct: «contactado_en 2026-10-04 13:44 (respondió al WhatsApp)», «cita confirmada» el 4-oct para «lunes 5 11:00». **El 5-oct fue la reunión, no la entrada.** |
| Datos que identifiquen al lead | artículo, piezas 1 y 2 | Sin nombre, sin empresa, sin 49 €, sin 500-800 €, sin 100 peticiones. **Cumple.** Quedan fecha + «empresa de formación» + «precio bajo»: no la identifican en público, pero ella sí se reconocería, y es una oportunidad abierta («compara agencias», llamada el 15-oct). |
| El formulario pregunta inversión y volumen | `content/brief-recorrido-semana-38.md` §1.2 · `api/meta-leadform.js` l. 206-222 | Formulario instantáneo de Meta: «inversión mensual (5 tramos), volumen (presupuestos o solicitudes al mes), dónde crees que se te escapa». **Correcto.** Desde el 28-sep el formulario nuevo pregunta también «Nuestros proyectos empiezan desde 750 €/mes. ¿Encaja?» (l. 224-234): es **nuestro** precio, no el del cliente final, así que «no preguntaba cuánto cobra por lo que vende» se sostiene. Ojo: el contacto entró por la landing `/formacion/`, cuyo formulario pregunta sector, equipo, inversión y web, **no** volumen. El artículo no dice por qué formulario entró, así que no es falso, pero es frágil. |
| «Con eso le damos una nota y decidimos a quién llamar primero» | `api/_scoring.js` l. 1-20, 42-69, 122-129 · `api/activacion.js` l. 30-38 y 443-470 | La nota (A-D) suma **tipología** (inversión, volumen, sector y encaje con nuestro precio) y **comportamiento** (contestó, tardó, habló con Raquel, cogió cita). A = «prioridad de Maikel, aviso al momento». En la cadencia, a las 2 h 30 sin respuesta: **A → le llama Maikel, B/C → una llamada de Raquel, D → sin llamada**. La nota decide **quién llama y si se llama**, no un orden de «primero». Y no sale solo del formulario. |
| Ejemplo de 300 € y uno de cada diez | artículo l. 127 (visible), l. 138 (FAQ visible), l. 45 (schema) | Etiquetado como ejemplo en los **tres** sitios. Cuenta correcta: 300 € × 10 % = 30 €. No aparece en «En 30 segundos», meta, og ni `llms.txt`. **Cumple.** |
| Media hora y plan por escrito en 24 horas (CTA de las dos piezas) | `diagnostico/index.html` l. 240, 336, 340, 422 | «30 minutos. Te mandamos el plan por escrito en 24 horas, lo hagas con nosotros o no». Coherente. La garantía del piloto vive en `/diagnostico/`, no en las piezas. Sin precio. |
| «Antes de tocar un anuncio, hacemos la cuenta» · «A veces sale que hay que invertir más» | ninguna | `/diagnostico/` dice «Repasamos los ocho puntos con tus números delante». No dice que se calcule el coste máximo por contacto ni recoge diagnósticos que acabaran en «invertir más». Hábito y experiencia sin fuente. |
| Regla de agosto (`growth-os.md` l. 65) | `content/growth-os.md` l. 65 | Prohíbe resultados de clientes en contenido editorial. El caso del 5-oct es un contacto, no un cliente, y no da resultados. **Cumple.** |
| Tasa de plantones propia | las dos piezas | No aparece. **Cumple.** |

---

# PIEZA 1 · Artículo «Cuánto invertir en publicidad» (`blog/cuanto-invertir-en-publicidad/index.html`)

Keyword: «cuánto invertir en publicidad». Revisado: texto visible, «En 30 segundos», FAQ visible y schema, CTA, title, meta y og:description, breadcrumb y enlaces.

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **5** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1-6, 11 (cierre como mini landing) y 12. Carrusel, reel, anuncio y outbound no aplican.

## Nota Global (1-10)

5/10.

## Resumen Ejecutivo

Buena idea y bien elegida: un caso propio, de ayer, que demuestra la tesis (nuestra nota dio A a un contacto que vendía barato). El ejemplo de 300 € está bien etiquetado en los tres sitios, no hay datos del lead, ni raya larga ni punto y coma. Pero el relato cuenta cosas que la fuente no dice. Pone la entrada del contacto el 5-oct (entró el 4), dice que el formulario ya se cambió (es una propuesta pendiente de Paid y Maikel), atribuye la propuesta a «nuestro equipo» (fue el agente de Growth) y simplifica la nota a «decidimos a quién llamar primero». Además deduce el margen del lead y alude a nuestra cuota con una oportunidad abierta. Y hay siete construcciones «X, no Y» disfrazadas. Todo se arregla frase a frase. Para la intención de búsqueda le falta el paso que convierte el coste por contacto en presupuesto mensual.

## Lo Mejor

- Caso real con fecha y verificable: nivel A por inversión y volumen, servicio de precio bajo, formulario sin pregunta de ticket. Las tres cosas están en el daily del 5-oct.
- Primera persona real y sin héroe: el fallo es de nuestra propia nota. Cumple la regla del 22-sep: la pieza empieza por lo que pasó, no por un lema.
- Ejemplo de 300 € y uno de cada diez etiquetado en visible, FAQ y schema. Cuenta correcta. Mismo «1 de 10, hipótesis» que el flujo de `cuanto-cuestan-anuncios-facebook-instagram`: el cluster es coherente.
- Sin nombres, sin 49 €, sin 500-800 €, sin 100 peticiones, sin tasa de plantones, sin precio ni garantía.
- Keyword en title, H1, URL, «about», destacado y breadcrumb. FAQ del schema idéntica a la visible.
- CTA conectado al tema («¿Sabes cuánto puedes pagar por un contacto?») y fiel a `/diagnostico/` (30 minutos, plan en 24 horas).

## Lo Más Débil

- Fechas y estado de la propuesta: dos frases dan por hecho un cambio que no se ha hecho.
- La nota del scoring contada a medias.
- El párrafo de la reunión deduce el margen y habla de «la nuestra» (inversión) con un lead que decide en una o dos semanas.
- Siete «X, no Y».
- No responde del todo a la keyword: llega a «cuánto puedes pagar por un contacto» y no a «cuánto al mes».

## Problemas Críticos Detectados

Frase exacta que falla → frase propuesta.

**C1.1** (l. 99, texto visible)
«Lo vimos en una reunión del 5 de octubre, y nos obligó a cambiar una pregunta de nuestro propio formulario.»
→ «Lo vimos en una reunión del 5 de octubre, y nos hizo ver que a nuestro propio formulario le falta una pregunta.»
Por qué: la fuente dice «Propuesta: añadir [...] Decide Paid con Maikel». No se ha cambiado nada, y sería añadir, no cambiar.

**C1.2** (l. 104, «En 30 segundos»)
«El 5 de octubre, un contacto entró con nuestra nota más alta por lo que invertía en anuncios y por el volumen de peticiones que recibía.»
→ «El 5 de octubre nos reunimos con un contacto que tenía nuestra nota más alta por lo que invertía en anuncios y por el volumen de peticiones que recibía.»
Por qué: entró antes (contactado y con cita confirmada el 4-oct). El 5 fue la reunión.

**C1.3** (l. 112, texto visible)
«Con eso le damos una nota y decidimos a quién llamar primero.»
→ «Con esas respuestas, y con cómo contesta después, le damos una nota de la A a la D. La nota decide quién le llama si no responde al primer mensaje.»
Por qué: `_scoring.js` suma tipología y comportamiento. `activacion.js` usa el nivel para decidir quién llama (A Maikel, B y C Raquel, D nadie), no un orden de llamada.

**C1.4** (l. 112, texto visible)
«Ese día entró una empresa de formación con la nota más alta: invertía en anuncios y recibía muchas peticiones.»
→ «Ese día nos reunimos con una empresa que tenía la nota más alta: invertía en anuncios y le llegaban muchas peticiones.»
Por qué: misma fecha errónea que C1.2. Quitar el sector reduce que ella se reconozca, y el caso no lo necesita.

**C1.5** (l. 113, texto visible)
«Con ese precio, cada cliente le dejaba poco, y cualquier inversión, la suya en anuncios o la nuestra, tenía que pagarse con muchos clientes al mes.»
→ «Con un precio así, la cuenta de cualquier inversión sale justa.»
Por qué: la fuente da el precio, no el margen, y dice «la cuenta le sale justa» (con nuestra cuota), no «muchos clientes». «La nuestra» publica que medimos si nos puede pagar, con una oportunidad abierta.

**C1.6** (l. 114, texto visible)
«La nota no estaba mal calculada. Le faltaba una pregunta. Por eso nuestro equipo ha propuesto añadir al formulario cuánto cobra la empresa por su servicio principal.»
→ «La nota acertó en lo que medía. Le faltaba una pregunta. Ese mismo día, el agente que sigue a nuestros contactos propuso añadirla al formulario: cuánto cobra la empresa por su servicio principal. La decisión está pendiente.»
Por qué: «no estaba mal calculada, le faltaba» es un «no es X, es Y» disfrazado. La propuesta es del agente de Growth a Paid, y la decisión, de Paid con Maikel, sigue abierta. «Nuestro equipo» no es lo que dice la fuente.

**C1.7** (l. 97, lede)
«La pregunta «¿cuánto invierto en publicidad?» casi siempre se contesta mirando el presupuesto. La cifra que de verdad la responde está en otro sitio: lo que te deja cada cliente que consigues.»
→ «Para saber cuánto invertir en publicidad, empieza por lo que te deja cada cliente que consigues. Con esa cifra y con cuántos contactos te compran, sabes cuánto puedes pagar por cada uno.»
Por qué: «no es X, es Y» disfrazado («se contesta con X / la de verdad es Y»). «Casi siempre» es una frecuencia sin fuente. La propuesta además es una primera frase citable por un LLM.

**C1.8** (l. 116, destacado)
«Cuánto invertir en publicidad no se decide mirando el presupuesto. Se decide mirando cuánto te deja cada cliente.»
→ «Si cada cliente te deja poco, la publicidad tiene que traerte muchos. Esa cuenta se hace antes del primer anuncio.»
Por qué: «no se decide con X, se decide con Y» es la construcción vetada.

**C1.9** (l. 121, texto visible · l. 136 FAQ visible · l. 41 schema)
«Margen, no facturación. Lo que te queda de lo que paga, durante el tiempo que sigue contigo.» y «(margen, no facturación)»
→ «Lo que te queda después de pagar lo que te cuesta servirle, durante el tiempo que sigue contigo.» y «(lo que te queda después de costes)»
Por qué: «X, no Y», tres veces.

**C1.10** (l. 127 visible · l. 138 FAQ visible · l. 45 schema)
«Un ejemplo para ver la cuenta, no una referencia:» y «Es un ejemplo para ver la cuenta, no una referencia.»
→ «Un ejemplo, solo para ver la cuenta:» y «Es solo un ejemplo para ver la cuenta: con tus números saldrá otra cifra.»
Por qué: «X, no Y». La etiqueta de ejemplo se mantiene en los tres sitios.

**C1.11** (l. 129, regla)
«Si no tienes esos dos números, el primer dinero va a medirlos, no a escalar.»
→ «Si no tienes esos dos números, gasta el primer dinero en medirlos. Subir el presupuesto viene después.»
Por qué: «X, no Y», y «escalar» está en la lista de prohibidos de la guía de voz.

**C1.12** (l. 132, texto visible)
«Antes de tocar un anuncio, hacemos la cuenta con tus números: lo que te deja un cliente, cuántos contactos compran y cuánto puedes pagar por cada uno. A veces sale que hay que invertir más. Otras, que lo que falla está después del anuncio, en lo que pasa con los contactos que ya entran.»
→ «En el diagnóstico hacemos esa cuenta con tus números: lo que te deja un cliente, cuántos contactos compran y cuánto puedes pagar por cada uno. Puede salir que te conviene invertir más, o que lo que falla está después del anuncio, en lo que pasa con los contactos que ya entran.»
Por qué: «antes de tocar un anuncio, hacemos» y «a veces sale» cuentan un hábito y experiencias pasadas sin fuente. La propuesta lo convierte en lo que ofrecemos.

## Qué Eliminaría

- «de formación» en el caso (C1.4) y «la suya en anuncios o la nuestra» (C1.5).
- El H2 vacío «La cuenta que va antes del anuncio» seguido de tres H2 numerados: o lleva una frase de respuesta debajo o los pasos pasan a H3. Hoy rompe la regla GEO de «primera frase de cada H2 = respuesta».

## Qué Simplificaría

- El sub del CTA: tres promesas encadenadas con «y». Propuesta: «Media hora con tus números delante. Hacemos la cuenta juntos y en 24 horas tienes el plan por escrito.» Además «salimos con la cuenta hecha» depende de que el contacto sepa su margen y su cierre.
- Lede y primer párrafo: con C1.7 y C1.1 caben en tres frases.

## Qué Reforzaría

- **Paso 4 que falta para la keyword:** «Cuánto al mes: los clientes que quieres, por los contactos que necesitas para cada uno, por lo que puedes pagar por contacto.» Con el ejemplo ya etiquetado: 5 clientes × 10 contactos × 30 € = 1.500 € al mes, marcado como ejemplo. Hoy el artículo responde «cuánto pagar por contacto» y deja «cuánto invertir» a medias. Además, `cuanto-cuestan-anuncios-facebook-instagram` lo enlaza como «la cuenta completa, paso a paso».
- Un `.post-sino` o una tabla corta de dos filas, precio bajo frente a precio alto, con la misma cuenta. Los LLMs extraen tablas mejor que prosa.
- Opinión con la cara: una frase de Maikel marcada como opinión («Yo no subiría el presupuesto sin esos dos números»). Solo si Maikel la suscribe.
- Enlace desde `como-calcular-cac` hacia este artículo. Hoy solo entra desde el de Meta.

## Riesgos

- **Lead abierto:** decide en una o dos semanas, compara agencias y tiene llamada el 15-oct. Si lee el artículo se reconoce (fecha, formación, precio bajo). Con C1.4 y C1.5 baja el riesgo. Que Maikel decida si publica el caso antes del 15-oct.
- Por qué formulario entró: la fuente da «>100 peticiones», pero la landing `/formacion/` no pregunta volumen. Si alguien lo cruza, «nuestro formulario pregunta [...] cuántas peticiones» no cuadra con ese contacto. No es crítico porque el artículo no dice por cuál entró.
- Horizonte distinto: este artículo habla de «el tiempo que sigue contigo» y el de Meta de «el primer año». Alinear.
- `/formacion/` promete el plan en 48 horas y el CTA, como `/diagnostico/`, en 24. Fuera de esta pieza, pero el lead de este caso vino por ahí.

## Impacto Esperado

Medio en búsqueda: keyword con intención de presupuesto, y con el paso 4 compite. Alto en credibilidad si el caso queda exacto: es raro ver a una empresa contar un fallo de su propio scoring. Sobre la North Star: el CTA lleva a diagnósticos con un gancho concreto (la cuenta con tus números). Con las frases inexactas, el riesgo es perder la confianza que el caso quiere ganar.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Usa `.post-resumen`, `.post-destacado`, `.pnum` y `.post-regla`: cumple el mínimo de elementos visuales. Párrafos cortos y legibles en móvil. Fallo de jerarquía: H2 sin contenido antes de los pasos numerados. Falta una tabla o un sí/no, que es lo que la idea pide (precio bajo frente a alto).

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: H1 claro y con keyword. El lede se apoya en un contraste vetado (C1.7).
- Claridad: la cuenta se entiende a la primera.
- Credibilidad: buena base y cuatro frases que la fuente no dice (C1.1 a C1.5, C1.12). No hay ningún número real, pero aquí está justificado: las cifras son del lead y no se publican. El ejemplo está bien marcado.
- CTA: conectado y fiel a la oferta. Sub demasiado largo.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Muy alineado: habla de una fuga (contactos con buena nota que no pueden pagar) y de un sistema (el scoring), no de herramientas. Acerca a pilotos porque el lector sale con una cuenta que no sabe hacer solo y con un motivo para pedir media hora. No canibaliza (ver abajo) si se añade el paso 4 y se alinea la FAQ del artículo de Meta.

## Versión Mejorada del Hook

«Para saber cuánto invertir en publicidad, empieza por lo que te deja cada cliente. El 5 de octubre lo aprendimos con nuestra propia nota: le dio la más alta a un contacto que vendía un servicio de precio bajo.»

## Próximo Experimento Recomendado

Cuando Paid y Maikel decidan la pregunta del ticket (prevista con las preguntas de tamaño del 13-oct), medir en el test de formularios del 12 al 25-oct cuántos A llegan a reunión y cuántos a piloto, con y sin esa pregunta. Si se aprueba, actualizar el artículo con «lo añadimos el día X», sin cifras del lead. En contenido: contar diagnósticos pedidos desde este artículo en 30 días frente al de Meta.

## Veredicto: PUBLICAR CON CAMBIOS

### Canibalización

- **Con `como-calcular-cac`: no canibaliza.** El CAC mide a posteriori cuánto te costó un cliente por canal («qué costes incluir», «por canal», «cuánto tarda en devolverte»). Este fija el presupuesto antes del anuncio. Keyword y «about» distintos. Comparten «margen, no facturación» y, por casualidad, un 300 € (allí margen de 1.000 € al 30 %): coherente. El nuevo enlaza al CAC como guía, pero el CAC no enlaza de vuelta.
- **Con «Cuánto deberías invertir» de `cuanto-cuestan-anuncios-facebook-instagram`: riesgo bajo-medio.** Mismo concepto (lo que te deja un cliente) y FAQ casi gemelas en schema: «¿Cuánto debería invertir en Meta Ads?» frente a «¿Cuánto debería invertir en publicidad?». Además la sección vieja tiene el paso que al nuevo le falta (clientes que quieres × coste máximo, repartido en 30 días). Remedio: paso 4 en el nuevo, y que la FAQ de Meta acabe con «La cuenta completa está en cuánto invertir en publicidad». El párrafo nuevo ya hace de puente en el sentido correcto.

---

# PIEZA 2 · Reorientación de «Cuánto cuestan los anuncios en Facebook e Instagram» (`blog/cuanto-cuestan-anuncios-facebook-instagram/index.html`)

Revisado solo lo que cambió: el párrafo nuevo tras «Cuánto deberías invertir» (l. 173), el post-cta (l. 181-186) y `dateModified`.

Fila de Notion: Diseño ok **sí** · Copy ok **sí, con un cambio** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **8** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1-6, 11 (post-cta) y 12. Carrusel, reel, anuncio y outbound no aplican.

## Nota Global (1-10)

8/10.

## Resumen Ejecutivo

Cambio pequeño y bien hecho. El CTA anterior prometía «en 90 segundos, sin registro» y llevaba a `/diagnostico/`, que es una reunión de 30 minutos. El nuevo dice lo que hay: media hora y plan en 24 horas, con un solo botón. El párrafo nuevo cuenta el caso del 5-oct con exactitud (reunión, nota más alta, precio bajo, formulario sin la pregunta) y manda la keyword «cuánto invertir en publicidad» al artículo nuevo. Un crítico: «el que más se salta» es una comparación sin fuente.

## Lo Mejor

- Corrige una promesa falsa: «90 segundos, sin registro» frente a una reunión de 30 minutos en `/diagnostico/`. Ahora coincide con `diagnostico/index.html` l. 240 y 340.
- El caso está bien contado: «una reunión del 5 de octubre», no «entró el 5». Sin nombre, sin cifras del lead, sin precio ni garantía.
- Un solo botón en vez de dos. El de «Qué es Meta Ads» competía con el diagnóstico.
- Enlace interno con la keyword exacta del artículo nuevo como ancla.
- Sin raya larga ni punto y coma en lo nuevo. `dateModified` actualizado.

## Lo Más Débil

- «El paso 2 es el que más se salta»: afirma una frecuencia que nadie ha medido.
- El sub del CTA encadena tres promesas.
- Remite a «la cuenta completa, paso a paso», y hoy el artículo nuevo no tiene el paso de presupuesto mensual (ver pieza 1).

## Problemas Críticos Detectados

**C2.1** (l. 173, texto visible)
«El paso 2 es el que más se salta. A nosotros nos recordó su importancia una reunión del 5 de octubre: un contacto con nuestra nota más alta vendía un servicio de precio bajo, y el formulario no lo preguntaba.»
→ «El paso 2 es fácil de saltarse. A nosotros nos lo recordó una reunión del 5 de octubre: un contacto con nuestra nota más alta vendía un servicio de precio bajo, y nuestro formulario no lo preguntaba.»
Por qué: «el que más se salta» es un claim comparativo sin fuente. El resto del párrafo cuadra con el daily del 5-oct.

## Qué Eliminaría

Nada más.

## Qué Simplificaría

Sub del CTA: «Media hora con tus números delante. Antes de subir el presupuesto, salimos con cuánto puedes pagar por un contacto y dónde se te enfrían los que ya entran, y el plan por escrito te lo quedas en 24 horas.» → «Media hora con tus números delante, antes de subir el presupuesto. Vemos cuánto puedes pagar por un contacto y dónde se te enfrían los que ya entran. El plan por escrito, en 24 horas.»

## Qué Reforzaría

- La FAQ del schema «¿Cuánto debería invertir en Meta Ads?»: que acabe enviando al artículo nuevo para no competir con «¿Cuánto debería invertir en publicidad?».
- Alinear el paso 2 («lo que te deja en el primer año») con el artículo nuevo («durante el tiempo que sigue contigo»), o explicar por qué aquí es el primer año.

## Riesgos

- El caso aparece ahora en dos URLs. Si Maikel decide no publicarlo antes del 15-oct (pieza 1, Riesgos), hay que quitarlo de las dos.
- Fuera del alcance de este cambio, el texto sin tocar de la sección mantiene «el problema no es Meta: es el margen o la tasa de cierre» (l. 170) y punto y coma en el texto visible y en el FAQ. No entra en este commit, pero conviene limpiarlo en la próxima pasada.

## Impacto Esperado

Positivo y rápido: el artículo ya tiene tráfico de «cuánto cuestan los anuncios» y ahora lo pasa a la pieza de presupuesto y a un CTA honesto. Menos clics que con «90 segundos» probablemente, pero clics de gente que sabe que pide una reunión: mejor para diagnósticos celebrados.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Sin cambios de diseño. Un párrafo de cuatro líneas, dentro del límite. El post-cta con un botón gana claridad.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Claridad: el puente entre «paso 2» y el caso se entiende.
- Credibilidad: caso exacto, salvo C2.1.
- CTA: título y sub hablan del mismo problema que el artículo (contactos que se enfrían). Sub largo.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Bien: convierte un artículo de precio en una puerta al diagnóstico con una promesa cierta, y teje el cluster de presupuesto. Suma a conversaciones sin prometer nada que el diagnóstico no dé.

## Versión Mejorada del Hook

No aplica: el hook del artículo no cambió. Para el párrafo nuevo: «El paso 2 es fácil de saltarse. Nosotros nos lo saltamos en nuestro propio formulario.»

## Próximo Experimento Recomendado

Comparar en 30 días los clics al diagnóstico desde este post-cta con los del CTA anterior, y cuántos acaban en reunión celebrada. Si bajan los clics y sube la tasa de reunión, el cambio funciona.

## Veredicto: PUBLICAR CON CAMBIOS

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| 1 · Artículo «Cuánto invertir en publicidad» | 5/10 | PUBLICAR CON CAMBIOS | 12 (C1.1 a C1.12) |
| 2 · Reorientación «Cuánto cuestan los anuncios en Facebook e Instagram» (párrafo nuevo y post-cta) | 8/10 | PUBLICAR CON CAMBIOS | 1 (C2.1) |
