# Revisión Qualivo Master Reviewer · 2-oct-2026

> Tres piezas del commit `d14ee1c` («Contenido 2-oct»): artículo nuevo
> `blog/origen-de-los-leads/`, reorientación de `blog/metricas-de-marketing/`
> y tesis del viernes `content/borradores/2026-10-02-tesis-etiqueta.md` con su
> imagen `content/infografias/2026-10-02/etiqueta-miente.png`. Revisadas con
> `content/agentes/prompt-qualivo-master-reviewer.md`, `content/guia-de-voz.md`
> (con la regla del 22-sep), `content/estandar-articulos.md` y las reglas de
> Maikel (plantones, WhatsApp personal, terceros, construcciones vetadas, raya
> larga y punto y coma, acierto con dato primero, nada inventado, regla de
> agosto de `growth-os.md` l. 65, ni precio ni garantía).

## Fuentes contrastadas

Todas las entradas son de `bus/out/demand.jsonl`, salvo donde se indica.

| Claim | Fuente | Qué dice la fuente, tal cual | Veredicto |
|---|---|---|---|
| «36 de 38 contactos de pago entraron por la web, según el CRM» | daily 1-oct, `respuesta_a_paid_landing_vs_formulario` | «Con esas etiquetas, de 38 contactos 'paid': 36 cuentan como landing (…) y 2 como solo formulario» | Respaldado, siempre que diga «según las etiquetas». |
| «La etiqueta de web la ponía también el formulario» | daily 1-oct · daily 27-sep · daily 28-sep | «los leads del formulario nativo también llevan 'diagnostico-landing'» · «meta-leadform.js también la pone» · «se pone a todos los que pasan por el flujo del diagnóstico, no porque entraran por la landing» | Respaldado. |
| «Casi todos habían entrado por el formulario» | daily 30-sep, `respuesta_a_tu_pregunta_landing_vs_formulario` | «De 37 leads de pago de septiembre, 36 entraron por el formulario nativo (…) por landing sola solo hay 1 lead» | Respaldado, pero es otro recuento: 37 contactos, septiembre, 30-sep. No es el reparto real de los 38 del 1-oct. Conviene no mezclarlos como si fueran el mismo grupo. |
| «Quien entraba por las dos vías se quedaba con la primera» | daily 29-sep y daily 30-sep | «rellenaron TAMBIÉN el formulario nativo: GHL guarda como fuente lo que llega primero» · «(GHL guarda la primera fuente)» | Respaldado. Matiz: es el campo fuente del contacto, no la etiqueta. |
| Propuesta de etiqueta de entrada única | daily 1-oct | «Propuesta: Paid y Growth fijan una etiqueta de mecanismo de entrada única (entrada-landing / entrada-formulario) en el punto de entrada. Growth la puede añadir si Maikel lo aprueba.» | Respaldado como propuesta pendiente del ok de Maikel. No está hecha. |
| «Esta semana quise saber…» (tesis) · «El 1 de octubre quisimos saber…» (artículo) · «Nos pasó esta semana» (artículo) | daily 22-sep `respuesta_a_paid.landing_vs_formulario_meta` · daily 23-sep `respuesta_a_paid.matiz` | La pregunta es de Paid y ya se contesta el 22-sep. El 23-sep: «Muchos contactos del formulario nativo llevan también la etiqueta diagnostico-landing. Para comparar hay que usar el campo source del trato, no las etiquetas.» | **No respaldado.** La pregunta no la hizo Maikel, no empezó esta semana ni el 1-oct, y el fallo de la etiqueta se vio el 23-sep. Lo que sí es del 1-oct es el recuento 36 de 38. |
| «Otra parte del equipo, mirando los anuncios, veía lo contrario» | daily 22-sep · daily 27-sep (título y `conclusion`) · daily 28-sep | Paid apuntaba a la landing: «la única reunión hecha vino de la landing, pero con n=1» · «El formulario nativo SÍ trae reuniones» · «No movería el tráfico a la landing esta semana». Growth, en el CRM: «Desde el CRM NO veo lo mismo. Leads con etiqueta meta-lead-&lt;id&gt; (…) cruza por meta-lead-&lt;id&gt; y no por diagnostico-landing» y, sobre Paid, «puede ser el origen de tu lectura». | **No respaldado.** Las dos lecturas opuestas existieron. Pero la que veía lo contrario de la etiqueta contaba en el CRM con el identificador del formulario, no «mirando los anuncios». Y la otra lectura (Paid) es la que pudo salir de la propia etiqueta. Tampoco eran «dos personas mirando el mismo dato». |
| «Lo vimos antes de mover un euro» (tesis) · «Lo vimos a tiempo» (artículo) | daily 23, 24, 27, 29 y 30-sep · cambios_meta 28-sep (15:05, 15:25, 15:50), 30-sep (12:44, 13:05, 17:20, 17:22) | «no movería tráfico por esto todavía» · «Antes de mover el tráfico, cruza por meta-lead-&lt;id&gt;» · «No movería el tráfico por esto.» Todos los anuncios activos o preparados siguen con formulario nativo. | Respaldado que **nadie movió tráfico a la web por ese dato**. «Antes de mover un euro» dice más: esos días sí se movió dinero por otros motivos (topes de 450 a 800 € y de 345 €, reactivaciones, reformas apagada). La frase se lee como «no se tocó dinero». |
| «Hay gente que rellena el formulario de Facebook y, minutos después, el de tu web» | daily 29-sep, `el_lead_de_5000` y respuesta a Paid | «Entró DOS veces con 4 minutos de diferencia» · «es la gente con más intención haciendo las dos cosas» | Respaldado en general (sin nombre, bien). |
| Media hora y plan por escrito en 24 horas | `diagnostico/index.html` l. 240 y 422 | «30 minutos. Te mandamos el plan por escrito en 24 horas, lo hagas con nosotros o no.» | Respaldado. Oferta publicada, no garantía de resultado. |
| «Coste por cita y por cliente de cada canal, que explico en coste por lead» | `blog/coste-por-lead/index.html` l. 107, 138, 146 | «el coste por cita y, en cuanto haya ventas, el coste por cliente» | Respaldado. |

Reglas de Maikel en las tres piezas: ni tasa de plantones (las citas y reuniones del daily del 1-oct se quedaron fuera a propósito, bien), ni WhatsApp, ni nombres ni datos de terceros, ni resultados de clientes (los números son del CRM propio), ni precio, ni garantía, ni raya larga ni punto y coma en lo nuevo. Fallan: el orden acierto/fallo, varias antítesis «X, no Y» y, sobre todo, la historia de cómo se vio el fallo.

Fuera del alcance, pero hay que decirlo: `llms.txt` l. 93 y `blog/que-poner-en-tu-negocio-para-atraer-clientes/index.html` l. 106 publican «9 citas, 5 plantones». Eso es la tasa de plantones propia, publicada. Ninguna de las tres piezas de hoy enlaza a ese artículo (el artículo nuevo enlaza a coste por lead, formulario o landing y CAC, que no la publican), pero conviene quitarla en la próxima pasada.

---

# PIEZA 1 · Artículo «Origen de los leads» (`blog/origen-de-los-leads/index.html`)

Keyword: «origen de los leads». Revisado: texto visible, «En 30 segundos», FAQ visible y schema, CTA, title, meta description y og. De paso, la tarjeta de `blog/index.html` y la línea 99 de `llms.txt`, que repiten el claim 36 de 38 (respaldado).

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **6** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1 a 6, 11 (el cierre hace de mini landing) y 12. Carrusel, reel, anuncio y outbound no aplican.

## Nota Global (1-10)

6/10.

## Resumen Ejecutivo

Buen tema y buen caso: un error propio, con número, que el primer resultado de Google no tiene, y cuatro pasos aplicables. La estructura del estándar está completa: eyebrow, H1 con la keyword, lede, «En 30 segundos», pasos con pnum, destacado, regla, FAQ con schema idéntico al visible, pilar, tres enlaces y CTA conectado. Los números del CRM cuadran con el bus. Lo que falla es la historia alrededor del número. La pregunta no nació el 1 de octubre ni esta semana, el fallo de la etiqueta ya estaba visto el 23-sep, y la «otra parte del equipo» no miraba los anuncios: contaba en el mismo CRM con el identificador del formulario. Además empieza por el fallo y deja el acierto para el final, y hay tres antítesis «X, no Y». Todo se arregla frase a frase, sin tocar la estructura.

## Lo Mejor

- El dato es propio, con fecha y respaldado tal cual: 36 de 38 contaban como web según las etiquetas del 1-oct.
- La causa está bien explicada y en lenguaje de bar: la etiqueta la ponía también el formulario porque los dos acababan en el mismo proceso.
- Los cuatro pasos son útiles y se pueden hacer mañana. El 3 (qué pasa cuando alguien entra por dos sitios) es el que nadie cuenta.
- El destacado «Una etiqueta que significa dos cosas no mide ninguna de las dos» es la frase que alguien subrayaría.
- La regla («No muevas dinero de un canal a otro por un dato de origen que no has comprobado») toma partido.
- Sin nombres, sin citas ni reuniones contadas (la tasa de plantones no se puede deducir), sin WhatsApp, sin precio, sin garantía, sin raya larga ni punto y coma.
- CTA coherente con `/diagnostico/` y conectado con el tema.

## Lo Más Débil

- El relato de cómo se vio el fallo no es el que cuenta el bus (ver C1.2 y C1.5).
- Orden: fallo primero, acierto al final y sin dato. La regla pide lo contrario.
- «Casi todos habían entrado por el formulario» viene de otro recuento (30-sep, 36 de 37) y se presenta como si fuera el reparto real de los mismos 38.
- Tres antítesis del tipo «X, no Y».

## Problemas Críticos Detectados

**C1.1 · «Esta semana» no es lo que dice la fuente.** El fallo de la etiqueta ya está en el daily del 23-sep («Muchos contactos del formulario nativo llevan también la etiqueta diagnostico-landing»). Lo de esta semana es el recuento del 1-oct.
- Falla: «Nos pasó a nosotros esta semana, y lo cuento porque es de los errores que no se ven hasta que alguien hace la pregunta.»
- Propuesta: «Nos pasó a nosotros, y lo cuento porque es de los errores que no se ven hasta que alguien hace la pregunta.»

**C1.2 · La pregunta no nació el 1 de octubre («En 30 segundos»).** La hizo Paid y se contesta desde el daily del 22-sep. El 1-oct solo se volvió a contar.
- Falla: «El 1 de octubre quisimos saber cuántos contactos de pago entraron por la web y cuántos por el formulario de Facebook.»
- Propuesta: «Llevábamos días con una pregunta: ¿traen más reuniones los contactos de pago que entran por la web o los del formulario de Facebook?»

**C1.3 · Orden: el resumen da el fallo y no el acierto con dato.** El acierto con número es el recuento del 30-sep y que nadie movió tráfico.
- Falla: «Según las etiquetas del CRM, 36 de 38 habían entrado por la web. Casi todos habían entrado por el formulario.»
- Propuesta: «Un recuento del mismo CRM decía que 36 de 37 contactos de pago de septiembre habían entrado por el formulario, y nadie movió tráfico a la web. Las etiquetas, el 1 de octubre, decían casi lo contrario: 36 de 38 por la web.»

**C1.4 · Orden en el cuerpo, y mezcla de dos recuentos.** «Casi al revés de lo que había pasado» se apoya en el 36 de 37 del 30-sep sin decirlo.
- Falla: «Fuimos al CRM. Según las etiquetas, de 38 contactos de pago, 36 habían entrado por la web y 2 por el formulario. Casi al revés de lo que había pasado.»
- Propuesta: «Fuimos al CRM y nos dio dos respuestas. Un recuento decía que, de 37 contactos de pago de septiembre, 36 habían entrado por el formulario. Las etiquetas, el 1 de octubre, decían casi lo contrario: de 38 contactos de pago, 36 por la web y 2 por el formulario.»

**C1.5 · Cómo se vio el fallo: inventado e invertido.** Nadie lo vio «mirando los anuncios». Growth contaba en el CRM por el identificador del formulario (meta-lead-&lt;id&gt;, daily 28-sep) y veía formulario. Paid apuntaba a la landing, y Growth sospecha que por la propia etiqueta («puede ser el origen de tu lectura»). No eran «dos personas» ni miraban «el mismo dato».
- Falla: «Lo vimos a tiempo porque otra parte del equipo, mirando los anuncios, veía justo lo contrario. Cuando dos personas miran el mismo dato y ven cosas opuestas, el problema suele estar en el dato.»
- Propuesta: «Lo vimos a tiempo, y nadie movió tráfico a la web. Una parte del equipo preguntaba si convenía hacerlo. Otra, contando por el identificador que deja el formulario de Facebook, veía justo lo contrario. Cuando dos lecturas del mismo CRM salen opuestas, el problema suele estar en el dato.»

**C1.6 · Antítesis «X, no Y» (paso 4).**
- Falla: «Si sabes que casi todo tu dinero fue al formulario y el CRM dice que casi todos entraron por la web, el CRM está mal, no tu memoria.»
- Propuesta: «Si sabes que casi todo tu dinero fue al formulario y el CRM dice que casi todos entraron por la web, revisa el CRM antes de dudar de lo que sabes.»

**C1.7 · Antítesis «X, no Y» repetida (paso 2 y FAQ 1, visible y schema).**
- Falla (paso 2): «El origen se apunta en el momento en que el contacto entra, y lo pone el sistema, no una persona después.»
- Propuesta: «El origen se apunta en el momento en que el contacto entra, y lo pone el sistema solo.»
- Falla (FAQ 1, visible y `acceptedAnswer`): «Y que lo ponga el sistema, no una persona después.»
- Propuesta: «Y que lo ponga el sistema solo, sin esperar a que alguien lo rellene.»

**C1.8 · «Casi siempre» sin dato (FAQ 2, visible y schema).** Es una frecuencia que ninguna fuente mide. Lo que sí está respaldado es que a Qualivo le pasaron las dos cosas.
- Falla: «Casi siempre por etiquetas que significan dos cosas a la vez, o porque el CRM guarda solo la primera fuente cuando alguien entra por dos sitios.»
- Propuesta: «Puede salir mal por dos motivos, y a nosotros nos pasaron los dos: etiquetas que significan dos cosas a la vez, y un CRM que guarda solo la primera fuente cuando alguien entra por dos sitios.»

## Qué Eliminaría

- El H2 vacío «Cómo registrar el origen para que no te pase» seguido de otro H2 con pnum. O se deja como H2 y los pasos pasan a H3, o se quita y el primer paso hace de entrada.

## Qué Simplificaría

- «contactos de pago» se puede leer como «contactos que pagaron». Una vez, la primera, mejor «contactos que llegaron por anuncios». Después ya se entiende.
- «outbound» en el paso 1 y en la FAQ 3 (visible y schema): la guía pide «puerta fría».
- Paso 2: «Lo que se rellena a mano días más tarde se rellena mal o no se rellena» es un absoluto. «suele rellenarse mal, o no se rellena» suena igual de humano y no afirma de más.
- Title de 85 caracteres: Google lo cortará. Por ejemplo «Origen de los leads: cuando el CRM dice que entraron por otro sitio · Qualivo».

## Qué Reforzaría

- La definición «X es Y» para los modelos, justo después del lede o como primera frase del primer H2: «El origen de un lead es por dónde entró: el canal, la campaña y la puerta concreta (el formulario de la plataforma o tu web).» Mete además la keyword exacta en el cuerpo, que ahora solo está en H1, title y breadcrumb.
- Una tabla pequeña `.post-tabla` con las dos respuestas del CRM: «Por el identificador del formulario: 36 de 37 por el formulario (30-sep)» frente a «Por las etiquetas: 36 de 38 por la web (1-oct)». Es el elemento que los LLMs extraen y lo que hace visual el caso.
- «El arreglo» del resumen: dejar claro que es lo que recomendamos, porque en Qualivo todavía es una propuesta pendiente del ok de Maikel. Por ejemplo «Cómo se evita: un campo de origen…».
- Un enlace en el cuerpo, no solo en «Sigue leyendo», a formulario de Facebook o landing page: ese artículo ya contó que 12 de 14 citas entraron por el formulario y encaja con el «casi todos».

## Riesgos

- Si Paid o alguien del equipo lee «mirando los anuncios», reconoce que la historia no es así. En un artículo cuya tesis es «comprueba el dato», un detalle falso pesa doble.
- Publicar «36 de 37» junto a «36 de 38» confunde si no se separan bien los dos recuentos (fecha y criterio en cada uno).
- Plantones: el daily del 1-oct trae citas y reuniones por vía. No deben entrar nunca en esta pieza ni en su tarjeta.

## Impacto Esperado

Medio en búsqueda (keyword informativa con poca competencia útil en español) y alto como pieza de criterio: cualquiera que lleve anuncios con formulario nativo se reconoce. Lleva al diagnóstico con un motivo concreto («qué dato de origen te puedes creer»).

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Ritmo bueno, párrafos cortos, se lee bien en móvil. Falta un elemento visual que enseñe el caso (tabla o `.post-caso`). La og:image es la genérica: la infografía del viernes, ya corregida, serviría.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: el lede es correcto pero genérico. El número tendría que estar arriba (ver hook mejorado).
- Claridad: alta.
- Credibilidad: tocada por C1.1, C1.2 y C1.5. Con los cambios, gana.
- CTA: bien conectado («qué dato de origen te puedes creer y cuál no»), coherente con la oferta publicada.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Habla de una fuga real (decidir con un dato que dice dos cosas) y de sistema. Teje el cluster de métricas. Acerca a diagnósticos con gente que ya invierte en anuncios, que es el ICP. Alineada.

## Versión Mejorada del Hook

«Nuestro CRM dio dos respuestas a la misma pregunta. Un recuento decía que 36 de 37 contactos de pago entraron por el formulario de Facebook. Las etiquetas, que 36 de 38 entraron por la web.»

## Próximo Experimento Recomendado

Cuando Maikel apruebe la etiqueta de entrada única, contar dos semanas con ella y añadir al artículo el antes y el después (fecha y criterio). Medir en Search Console impresiones por «origen de los leads» y, cuando haya UTM en el blog, clics al diagnóstico desde esta pieza.

## Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 2 · Reorientación de «Métricas de marketing» (`blog/metricas-de-marketing/index.html`)

Revisado solo lo cambiado: punto 5 de «Cómo construirlo (en este orden)», los dos párrafos de detrás y el post-cta (más el dateModified).

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **7** · Veredicto **PUBLICAR CON CAMBIOS**.

## Nota Global (1-10)

7/10.

## Resumen Ejecutivo

Buena reorientación: el pilar de métricas pasa a tejer la pieza nueva con un caso propio y un solo botón al diagnóstico. El punto 5 pierde la raya larga. El caso está bien condensado y los números cuadran con el bus. Falla una frase: «el que más se rompe» es un superlativo que nadie ha medido.

## Lo Mejor

- El puente es natural: el punto 1 de la lista es el origen, y el párrafo cuenta justo eso con un caso propio y fecha.
- «Antes de montar el panel, comprueba que cada dato dice lo que crees que dice.» Útil y en tono de bar.
- Un solo CTA, coherente con `/diagnostico/` (media hora, plan en 24 horas).
- dateModified actualizado. Sin raya larga ni punto y coma en lo nuevo. Sin precio ni garantía. Sin citas ni reuniones contadas.

## Lo Más Débil

- El superlativo sin fuente de C2.1.
- Solo cuenta el fallo. No hay acierto.

## Problemas Críticos Detectados

**C2.1 · Superlativo sin dato.** Ninguna fuente compara qué paso «se rompe más».
- Falla: «El primer paso es el que más se rompe sin que nadie lo note.»
- Propuesta: «El primer paso se puede romper sin que nadie lo note.»

## Qué Eliminaría

- El enlace en texto «en media hora lo miramos con tus números» repite el post-cta que va justo debajo. Se puede quitar esa frase y dejar solo «Antes de montar el panel, comprueba que cada dato dice lo que crees que dice.»

## Qué Simplificaría

- «A nosotros nos pasó el 1 de octubre» se lee como que el fallo nació ese día. Más exacto: «El 1 de octubre, en nuestro CRM, según las etiquetas…».
- «contactos de pago» → «contactos que llegaron por anuncios», por la misma ambigüedad que en la pieza 1.

## Qué Reforzaría

- El acierto, en media frase y con dato, antes del fallo: «Un recuento del mismo CRM decía que 36 de 37 habían entrado por el formulario, y nadie movió tráfico por eso.» No es crítico en un puente de dos frases, pero cumple la regla de Maikel.
- Se perdió el enlace a la calculadora de fugas, que era un lead magnet. Si se quiere mantener, puede ir en «Sigue leyendo».

## Riesgos

- Fuera del alcance (texto no tocado), en la misma página: el destacado «Cuando cada equipo mira su dashboard, el desacuerdo no es de personas: es de sistema» es un «no es X, es Y» y usa «dashboard». Los puntos 1 a 4 de la lista siguen con raya larga, ahora al lado del 5 que ya no la tiene. Para la próxima pasada.

## Impacto Esperado

Bajo en sí, útil para el cluster: pasa autoridad del pilar a la pieza nueva y al diagnóstico.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Sin cambios de diseño. El post-cta con un solo botón gana claridad. La lista queda con dos formatos (raya en 1-4, dos puntos en 5).

## Revisión de Copy (hook, claridad, credibilidad, CTA)

Claro y hablado. Credibilidad tocada solo por C2.1. CTA bien («qué datos te puedes creer y cuáles hay que arreglar antes de decidir»).

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Bien: lleva de una keyword amplia a una pieza con caso propio y de ahí al diagnóstico.

## Versión Mejorada del Hook

No aplica (no cambia el lede). Para el párrafo: «El primer paso se puede romper sin que nadie lo note. A nosotros, el 1 de octubre, las etiquetas del CRM nos decían que 36 de 38 contactos de pago habían entrado por la web.»

## Próximo Experimento Recomendado

Cuando haya UTM en el blog, medir clics de este párrafo a `/blog/origen-de-los-leads/` frente a los del post-cta.

## Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 3 · Tesis del viernes «Tener el dato no sirve de nada si la etiqueta dice dos cosas» + imagen + pie de Instagram

`content/borradores/2026-10-02-tesis-etiqueta.md` · `content/infografias/2026-10-02/etiqueta-miente.png` (mirada: 1080 × 1350, «36 de 38» grande en naranja, subtítulo, panel claro «Lo que decía el CRM · Lo que pasó» con dos filas, tesis abajo, firma y QUALIVO.IO).

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **5** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1 a 6, 7 (pieza de una imagen, criterios de portada) y 12.

## Nota Global (1-10)

5/10.

## Resumen Ejecutivo

La idea es buena para una tesis contraria y el dato central es real: con las etiquetas del 1-oct, 36 de 38 contactos de pago contaban como entrados por la web, porque el formulario también ponía esa etiqueta. Bien dejado fuera lo de citas y reuniones por vía (dejaría deducir los plantones). Pero la historia que rodea al dato no es la del bus. Maikel no «quiso saber» nada esta semana: la pregunta era de Paid y viene del 22-sep. Nadie lo vio «mirando los anuncios»: la lectura opuesta salía del mismo CRM, contando por el identificador del formulario. Y «antes de mover un euro» dice más de lo que se puede sostener, porque esos días sí se movió dinero por otros motivos. Además, la ficha dice «acierto primero» y el texto, el pie y la imagen empiezan por el fallo. Hay que cambiar la mitad de los párrafos, pero el esqueleto y la imagen aguantan.

## Lo Mejor

- Número fuerte, propio y respaldado tal cual (36 de 38 según las etiquetas).
- La causa en una línea que entiende cualquiera: la etiqueta de «web» la ponía también el formulario.
- La propuesta (etiqueta de entrada única puesta al entrar) es la del bus, contada como propuesta.
- La pregunta final invita a contestar a quien gestiona un CRM o anuncios, que es lo que mide la ficha.
- Sin nombres, sin citas ni reuniones, sin WhatsApp, sin precio, sin garantía, sin raya larga ni punto y coma. Sin resultados de clientes.
- La imagen se lee en un vistazo: número, contradicción y tesis.

## Lo Más Débil

- Un comportamiento de Maikel inventado («quise saber») con una fecha que no es.
- El acierto del texto («lo vimos porque, mirando los anuncios…») no es lo que pasó.
- Orden fallo → acierto en LinkedIn, Instagram e imagen.
- Abre con la tesis como frase de pizarra, no con lo que pasó.

## Problemas Críticos Detectados

**C3.1 · Comportamiento de Maikel inventado y fecha que no es (LinkedIn).** La pregunta es de Paid y está en el bus desde el 22-sep.
- Falla: «Esta semana quise saber cuántos contactos de mis anuncios entran por mi web y cuántos por el formulario de Facebook.»
- Propuesta: «En el equipo llevábamos días con una pregunta: ¿traen más reuniones los contactos de mis anuncios que entran por mi web o los del formulario de Facebook?»

**C3.2 · Orden: fallo primero, sin acierto con dato (LinkedIn).** La ficha promete «acierto primero» y el texto hace lo contrario. Además «Casi todos habían entrado por el formulario» viene de otro recuento (30-sep, 36 de 37) sin decirlo.
- Falla: «Según mi CRM, 36 de 38 habían entrado por la web. / Casi todos habían entrado por el formulario.»
- Propuesta: «Mi CRM daba dos respuestas. Un recuento decía que, de 37 contactos de pago de septiembre, 36 habían entrado por el formulario. Con ese, nadie movió tráfico a la web. / Las etiquetas, el 1 de octubre, decían casi lo contrario: 36 de 38 habían entrado por la web.»

**C3.3 · Cómo se vio el fallo: inventado e invertido, y «un euro» de más (LinkedIn).** La lectura opuesta salía del CRM, contando por meta-lead-&lt;id&gt; (daily 28-sep), no de los anuncios. No eran «dos personas» ni «el mismo dato». Lo respaldado es que no se movió tráfico a la web por ese dato. Dinero sí se movió esos días por otros motivos.
- Falla: «Lo vimos antes de mover un euro porque, mirando los anuncios, otra parte del equipo veía lo contrario. Cuando dos personas miran el mismo dato y ven cosas opuestas, el problema suele estar en el dato.»
- Propuesta: «Una parte del equipo preguntaba si convenía pasar tráfico a la web. Otra, contando por el identificador que deja el formulario, veía lo contrario. Cuando dos lecturas del mismo CRM salen opuestas, el problema suele estar en el dato.»

**C3.4 · Pie de Instagram: mismo orden invertido y mismo «antes de mover dinero».**
- Falla: «36 de 38 contactos de pago entraron por mi web, según mi CRM. Casi todos habían entrado por el formulario de Facebook. / La etiqueta de «web» la ponía también el formulario. Lo vimos antes de mover dinero.»
- Propuesta: «Mi CRM daba dos respuestas. Un recuento: 36 de 37 contactos de pago de septiembre entraron por el formulario de Facebook. Con ese, nadie movió tráfico a la web. Las etiquetas: 36 de 38 por la web. / La etiqueta de «web» la ponía también el formulario.»

**C3.5 · Imagen: solo el fallo, sin acierto con dato.** Regenerar con `render.sh` tras cambiar el HTML.
- Falla: «36 de 38 / contactos de pago entraron por la web, según mi CRM. Casi todos entraron por el formulario de Facebook.»
- Propuesta: «36 de 37 / contactos de pago de septiembre entraron por el formulario de Facebook. Las etiquetas de mi CRM decían que casi todos habían entrado por la web.»

## Qué Eliminaría

- «es sencilla» en «La propuesta ahora es sencilla»: no aporta. «La propuesta: una etiqueta de entrada que diga una sola cosa, puesta en el momento en que entra el contacto.»

## Qué Simplificaría

- «Y quien entraba por las dos vías se quedaba con la primera» parece que es la persona la que se queda con algo. Mejor: «Y a quien entraba por las dos vías, el CRM le guardaba solo la primera.» Lo mismo en la segunda fila del panel de la imagen.
- «contactos de pago» → «contactos de mis anuncios», que ya usa el propio texto.
- La cabecera del panel («Lo que decía el CRM · Lo que pasó») no encaja con la segunda fila, que no es algo que «dijera» el CRM. Mejor «Lo que parecía · Lo que pasaba».

## Qué Reforzaría

- El consejo final («hazle una pregunta cuya respuesta ya sepas») no es lo que se hizo. Lo que se hizo fue cruzar con otro dato que no puede decir dos cosas. Más fiel y más útil: «Antes de decidir con un dato de tu CRM, crúzalo con otro que no pueda decir dos cosas. Si no cuadran, no te fíes de ninguno hasta saber por qué.»
- Actualizar la ficha: el «Acierto primero» actual («dos partes del equipo veían cosas opuestas y se paró a mirar») tiene que reflejar C3.2 y C3.3.

## Riesgos

- Paid lee el bus y reconoce la historia. Si se publica «mirando los anuncios», el post que va de no fiarse del dato tiene un dato falso.
- Plantones: no añadir nunca las citas y reuniones por vía del daily del 1-oct. La ficha ya lo dice. Que no se cuele en comentarios ni respuestas.
- Las redes siguen en pausa. Nada sale sin el ok de Maikel.

## Impacto Esperado

Medio en conversaciones con gente que gestiona CRM o anuncios. La contradicción (dos respuestas del mismo CRM) es más fuerte que la actual y además es verdad.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Número enorme que para el scroll, buena jerarquía, panel legible. Queda un hueco negro de unos 200 px entre el panel y la tesis: subir la tesis o dar más aire al panel. Con «36 de 37» la portada sigue funcionando y el subtítulo carga la sorpresa.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: «Tener el dato no sirve de nada si la etiqueta dice dos cosas» es frase de pizarra. La regla del 22-sep pide empezar por lo que pasó (ver hook mejorado).
- Claridad: alta.
- Credibilidad: dañada por C3.1 y C3.3. Con los cambios queda limpia.
- CTA: la pregunta final es buena y está alineada con lo que se mide.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Habla de una fuga de medición, que es la base de cualquier diagnóstico. Enlaza con el artículo del día. Pieza de confianza para el ICP que ya invierte en anuncios. Alineada.

## Versión Mejorada del Hook

«Mi CRM me dio dos respuestas opuestas a la misma pregunta. Y las dos salían del mismo sitio.»

## Próximo Experimento Recomendado

Cuando se levante la pausa, publicar esta versión y contar cuántos comentarios vienen de gente que gestiona CRM o anuncios y cuántos acaban en mensaje privado. Comparar con la tesis del 25-sep.

## Veredicto: PUBLICAR CON CAMBIOS

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| 1 · Artículo «Origen de los leads» | 6/10 | PUBLICAR CON CAMBIOS | 8 (C1.1 a C1.8) |
| 2 · Reorientación «Métricas de marketing» (punto 5, dos párrafos y post-cta) | 7/10 | PUBLICAR CON CAMBIOS | 1 (C2.1) |
| 3 · Tesis del viernes «la etiqueta dice dos cosas» + imagen + pie | 5/10 | PUBLICAR CON CAMBIOS | 5 (C3.1 a C3.5) |
