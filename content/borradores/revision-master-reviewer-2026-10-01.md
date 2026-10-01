# Revisión Qualivo Master Reviewer · 1-oct-2026

> Tres piezas del commit `bcfd83f` («Contenido 1-oct»): artículo nuevo
> `blog/cualificar-leads/`, reorientación de `blog/que-es-un-lead/` y borrador de
> redes del jueves con su imagen. Revisadas con
> `content/agentes/prompt-qualivo-master-reviewer.md`, `content/guia-de-voz.md`
> (con la regla del 22-sep), `content/estandar-articulos.md` y las reglas de
> Maikel (plantones, WhatsApp personal, terceros, construcciones vetadas, raya
> larga y punto y coma, acierto con dato primero, nada inventado, regla de
> agosto de `growth-os.md` l. 65, ni precio ni garantía).

## Fuentes contrastadas

| Claim | Fuente | Qué dice la fuente, tal cual | Veredicto |
|---|---|---|---|
| Contacto de formación «con la nota más alta según su formulario» que no encajaba | `bus/out/demand.jsonl`, daily 30-sep, `reuniones_hoy[0]` y `objecion_que_se_repite` | «formación, formulario nativo, entró como nivel A» · «perfil sin capacidad para el sistema (persona mayor, poco manejo del ordenador); el formulario decía otra cosa» · «Marian: A en el formulario, no encaja en la reunión» | La reunión y el no encaje, respaldados. «Nota más alta» no: la fuente habla de **nivel A**, y en `api/_scoring.js` la nota es un número de 0 a 10 (dos notas) y el nivel es una letra. «Muy poco manejo» tampoco: la fuente dice «poco». |
| Contacto de reformas: 500-2.000 €/mes en el formulario y boca a boca en la llamada | `demand.jsonl`, meta-capi 30-sep 15:20 | «el formulario decía 500-2.000 €/mes y en la llamada, todo boca a boca» | Respaldado. «Inversión mensual **en anuncios**» no está en la fuente. Tampoco consta su nivel ni que el formulario lo pusiera «delante en la cola». |
| «Pasó de cualificado a descartado en Meta tras la reunión» | misma entrada 15:20 | «marcado «Disqualified» en Meta tras la reunión del 30-sep … Antes estaba como Qualified (cita)» | Respaldado. «En cuanto vimos» añade una inmediatez que la fuente no da. |
| Estados devueltos a Meta y fallo de diez días | daily 28-sep, `cambios_hoy.meta_capi` | «la calidad del lead (Contacted/Qualified/Converted/Disqualified) no llegaba a Meta porque la llamada no se esperaba en Vercel: 2 Contacted y 0 Qualified en diez días» · «precualificación «no encaja todavía» → Disqualified» | Son **cuatro** estados, no tres. Y Disqualified también se usa para quien no contesta (meta-capi 29-sep 08:40: «nunca contestaron … marcados Disqualified») y para la precualificación. Lo que no llegaba era la calidad, no «casi nada». |
| Meta ya busca contactos parecidos a los buenos | daily 28-sep, `que_necesito_de_paid` | «que el objetivo de los conjuntos pase de LEAD_GENERATION a leads de conversión cuando haya señal (propuesta para la revisión del lunes 5-oct)» | No consta. A 1-oct los conjuntos siguen optimizando por LEAD_GENERATION. |
| «La nota se recalcula cada vez que el contacto hace algo» | `api/_scoring.js` l. 18-20 y 24-25 | «El nivel se recalcula en cada vuelta: contestar, coger cita o no presentarse lo mueven» · «Lo llama el reloj de activación en cada vuelta» | Parcial. Se recalcula **el nivel**, **en cada vuelta del reloj**, no por evento. Y la tipología (lo que sale del formulario) no cambia con lo que hace el contacto. Cambia el comportamiento. |
| Las dos preguntas de la primera conversación como práctica actual («cómo cualificamos ahora») | `captacion/agente-llamadas/bitacora-raquel.md` l. 22 · `content/diario-contenido.md` l. 881 · `api/_scoring.js` l. 64-66 | «¿cómo os llegan hoy los clientes…?» solo se usa «si marcó «no lo sé» en el formulario». «Quién va a usar el sistema» es una **hipótesis** del diario para el test de formularios (12-25 oct). La precualificación real es solo para tipología < 6 (niveles C y D). | No consta como práctica actual. Se puede contar como recomendación, no como «lo que hacemos ahora». |
| «Montamos la cualificación en tres capas dentro del CRM que ya usas» | `servicios/index.html` l. 88 · `index.html` l. 34 y 84 | «cualificación, scoring, análisis y agentes, sobre tus herramientas» · «en el sistema de captación y ventas que la empresa ya tiene» · «No sustituimos el sistema del cliente» | Aceptable que Qualivo monte cualificación y puntuación sobre las herramientas del cliente. **No** consta un servicio «en tres capas» con «las dos preguntas», y «para que cada semana te traiga más contactos parecidos» promete un resultado que ni en la cuenta propia está pasando. |
| Plan por escrito en 24 horas, media hora | `diagnostico/index.html` l. 240, 340, 422 | «30 minutos. Te mandamos el plan por escrito en 24 horas, lo hagas con nosotros o no.» | Respaldado. Es la oferta publicada, no una garantía de resultado. |
| «Te lo cuento con números de nuestra propia campaña» (coste por cliente por canal) | `blog/coste-por-lead/index.html` | El artículo da coste por contacto y por cita del 18 al 22-sep, y dice «en cuanto haya ventas, el coste por cliente». | Tiene números propios, pero de coste por cita, no por cliente. |

Nota sobre las fuentes: el daily del 30-sep (19:50) sigue con la reunión de reformas «pendiente de que Maikel lo cuente», con otro id de lead (Fran, `meta-lead-1876002526973538`) que el de la entrada de las 15:20 (`meta-lead-2078971852850525`). Además, la entrada de las 15:20 dice de reformas «no puede usar el sistema ni la videollamada», muy parecido a lo de formación. Me ciño a lo que dice cada entrada, como se pidió, pero conviene que Growth aclare si son el mismo lead antes de que el caso se use más.

---

# PIEZA 1 · Artículo «Cualificar leads» (`blog/cualificar-leads/index.html`)

Keyword: «cualificar leads». Revisado: texto visible, «En 30 segundos», FAQ visible y schema, CTA, meta description, og:description y, de paso, la tarjeta de `blog/index.html` y la línea de `llms.txt`, que repiten los claims.

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **6** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1-6, 11 (el cierre hace de mini landing) y 12. Carrusel, reel, anuncio y outbound no aplican.

## Nota Global (1-10)

6/10.

## Resumen Ejecutivo

Buen artículo de base: empieza por lo que pasó, con fecha, dos casos propios sin nombres y una tesis clara. Estructura del estándar completa (eyebrow, H1 con keyword, lede, resumen, pasos con pnum, destacado, regla, FAQ con schema idéntico a la visible, pilar y tres enlaces). Pero en los detalles dice más que sus fuentes: «nota más alta» donde la fuente dice nivel A, «muy poco» donde dice «poco», «en anuncios» que no consta, un recálculo «cada vez que hace algo» que el código hace en cada vuelta del reloj, y presenta como práctica actual unas preguntas que son una hipótesis. El cierre promete que Meta «cada semana te traiga más contactos parecidos», algo que en la propia cuenta aún no pasa. Y la misma antítesis «ordena, no decide» sale tres veces. Todo se arregla frase a frase.

## Lo Mejor

- Empieza por lo que pasó y con fecha: dos reuniones propias del 30-sep. Cumple la regla del 22-sep.
- El dato de reformas está tal cual en la fuente: 500 a 2.000 € al mes en el formulario, boca a boca en la llamada.
- El paso de «cualificado» a «descartado» en Meta después de la reunión está en el bus y da al artículo algo que el primer resultado de Google no tiene.
- Ni nombres, ni edad, ni sector más allá de «formación» y «reformas». Sin tasa de plantones, sin WhatsApp, sin precio, sin garantía, sin raya larga, sin punto y coma.
- Habla de «contacto» y deja «lead» para la keyword. Buena aplicación de la guía.
- CTA conectado con el tema y coherente con `/diagnostico/` (media hora, plan en 24 horas).

## Lo Más Débil

- Varias frases dicen un poco más de lo que dice la fuente. Sueltas parecen detalles, juntas restan credibilidad a un artículo cuyo valor es precisamente ser real.
- «Cómo cualificamos ahora» y las dos preguntas: se venden como práctica de Qualivo cuando la precualificación real solo se hace con niveles C y D, y la pregunta de «quién lo va a usar» es una hipótesis para el test de octubre.
- La antítesis «ordenar / decidir» se repite en lede, destacado y H2 del paso 1.
- El cierre de servicio promete un resultado semanal.

## Problemas Críticos Detectados

**C1.1 · «Nota más alta» no es lo que dice la fuente (resumen).** Daily 30-sep: «entró como nivel A».
- Falla: «El 30 de septiembre, un contacto que entró con la nota más alta según su formulario no encajaba en la reunión.»
- Propuesta: «El 30 de septiembre, un contacto que entró como nivel A, el más alto de nuestra puntuación, no encajaba en la reunión.»

**C1.2 · Mismo claim en el cuerpo.**
- Falla: «La primera fue con un contacto de formación que había entrado con la nota más alta según lo que marcó en el formulario.»
- Propuesta: «La primera fue con un contacto de formación que había entrado como nivel A, el más alto de nuestra puntuación, por lo que marcó en el formulario.»

**C1.3 · «Muy poco» exagera la fuente («poco manejo del ordenador»).**
- Falla: «En la reunión vimos que no encajaba: el sistema lo iba a usar una persona con muy poco manejo del ordenador.»
- Propuesta: «En la reunión vimos que no encajaba: quien iba a usar el sistema tenía poco manejo del ordenador.»

**C1.4 · «En anuncios» no está en la fuente (resumen).** La entrada de las 15:20 solo dice «500-2.000 €/mes».
- Falla: «Otro había marcado una inversión mensual en anuncios, y en la llamada nos contó que todo le llegaba por el boca a boca.»
- Propuesta: «Otro había marcado una inversión de 500 a 2.000 € al mes, y en la llamada nos contó que todo le llegaba por el boca a boca.»

**C1.5 · No consta que el formulario pusiera delante al de reformas.** No hay nivel ni puntuación de ese lead en ninguna fuente.
- Falla: «En los dos casos el formulario hizo su trabajo: los puso delante en la cola.»
- Propuesta: «En los dos casos el formulario prometía más encaje del que había.»

**C1.6 · El recálculo no es como dice el artículo.** `api/_scoring.js`: «El nivel se recalcula en cada vuelta: contestar, coger cita o no presentarse lo mueven».
- Falla: «En nuestro caso, la nota que da el formulario se recalcula cada vez que el contacto hace algo.»
- Propuesta: «En nuestro caso, el nivel se recalcula en cada vuelta del sistema: contestar, coger cita o no presentarse lo mueven.»

**C1.7 · Las dos preguntas no constan como práctica actual (meta description y description del schema Article).**
- Falla: «y cómo cualificamos ahora: formulario, primera conversación y comportamiento.»
- Propuesta: «y cómo cualificar en tres capas: formulario, primera conversación y comportamiento.»

**C1.8 · Mismo problema en og:description.**
- Falla: «Lo que hacemos ahora para cualificar.»
- Propuesta: «Cómo cualificar para que no te pase.»

**C1.9 · Eficacia de las dos preguntas sin marcar como hipótesis (paso 2).** El estándar pide separar hecho, hipótesis y opinión.
- Falla: «Con sus palabras se ve enseguida si lo que marcó se sostiene.»
- Propuesta: «Son las dos que habrían destapado los dos casos del 30 de septiembre. Es una hipótesis, sin medir todavía.»

**C1.10 · «En cuanto» añade una inmediatez que la fuente no da** («tras la reunión»).
- Falla: «el contacto de reformas del 30 de septiembre pasó de «cualificado» a «descartado» en cuanto vimos que no encajaba.»
- Propuesta: «el contacto de reformas del 30 de septiembre pasó de «cualificado» a «descartado» después de la reunión.»

**C1.11 · Servicio «en tres capas» que no consta.** Lo respaldado es «cualificación, scoring… sobre tus herramientas» (`/servicios/`). Las «dos preguntas» como parte del servicio, no.
- Falla: «Montamos la cualificación en las tres capas dentro del CRM que ya usas: la nota inicial con el formulario, las dos preguntas en la primera conversación y la nota que se recalcula con lo que hace cada contacto.»
- Propuesta: «Montamos la puntuación de contactos sobre las herramientas que ya usas: una nota con lo que marcan en el formulario, que se mueve con lo que hacen después.»

**C1.12 · Promesa de resultado (garantía implícita).** En la cuenta propia los conjuntos siguen en LEAD_GENERATION y el cambio es una propuesta para el 5-oct.
- Falla: «Y la devolución a la plataforma de anuncios, para que cada semana te traiga más contactos parecidos a los que encajan.»
- Propuesta: «Y la devolución a la plataforma de anuncios de qué contactos encajaron y cuáles no.»

**C1.13 · Antítesis vetada en el lede.**
- Falla: «Sirve para ordenar a quién llamar primero. No sirve para decidir solo con eso quién te va a comprar.»
- Propuesta: «Con eso sabes a quién llamar primero. Si te va a comprar, lo sabrás cuando habléis.»

**C1.14 · Antítesis vetada en el destacado** (y repetida por tercera vez).
- Falla: «El formulario ordena la cola. No decide quién compra.»
- Propuesta: «Entró como nivel A. En la reunión, no encajaba.»

**C1.15 · Antítesis vetada en el H2 del paso 1.**
- Falla: «El formulario: para ordenar, no para decidir»
- Propuesta: «El formulario: te dice a quién llamar primero»

**C1.16 · Antítesis vetada en el paso 2.**
- Falla: «ya lo sabes antes de la reunión, no durante.»
- Propuesta: «ya lo sabes antes de la reunión.»

Arrastre fuera de este fichero (no tocado, avisar a quien lo publique): la tarjeta de `blog/index.html` («Cómo cualificamos ahora, en tres capas») y la línea 98 de `llms.txt` («un contacto con la nota más alta», «marcó inversión en anuncios») repiten C1.1, C1.4 y C1.7. Hay que corregirlas igual.

## Qué Eliminaría

- Una de las tres apariciones de «ordenar / decidir». Con C1.13 a C1.15 quedan cero.
- «Un contacto que contesta en diez minutos y reserva para mañana dice más de su interés que el tramo de inversión que marcó.» La idea ya está en la frase anterior.

## Qué Simplificaría

- El H2 vacío «Cómo cualificar en tres capas», seguido de otro H2 sin texto entre medias. Una frase debajo que responda sola (GEO): «Cualificar bien tiene tres capas: lo que marca en el formulario, lo que te cuenta en la primera conversación y lo que hace después.»
- FAQ 4 (visible y schema): «puede buscar más contactos parecidos a los buenos» → añadir «si la campaña está configurada para aprender de esa información». Así no contradice el estado real de la cuenta.

## Qué Reforzaría

- Una tabla de las tres capas (qué mira, cuándo, qué se le escapa) para los LLM. El estándar la pide en cada comparación importante.
- La primera persona: «nuestras propias reuniones» está bien, pero falta una opinión con cara marcada como opinión. Si Maikel la da, mejor. No la invento.
- El enlace a `/blog/primera-reunion-con-un-cliente/` dentro del paso 2, no solo en «Sigue leyendo».

## Riesgos

- Credibilidad: si alguien de Qualivo o un cliente conoce el CRM, «cómo cualificamos ahora» con dos preguntas que no se hacen a todos se cae.
- Terceros: «poco manejo del ordenador» junto con sector y fecha describe a una persona real. Sin nombre ni edad es aceptable. No añadir más rasgos (fuera «persona mayor», que está en la fuente).
- Fuentes: ver la nota sobre los dos ids de reformas.
- La regla del artículo («ninguna reunión larga solo con el formulario») va por delante de lo que Qualivo hace hoy, que solo precualifica niveles C y D. Como consejo al lector vale. Si alguien pregunta «¿y vosotros?», la respuesta honesta es «empezamos a hacerlo tras el 30-sep», y eso no consta.

## Impacto Esperado

Medio en búsqueda: «cualificar leads» tiene intención de gente que gestiona captación, es decir, el ICP. Bajo en diagnósticos directos hasta que el blog lleve UTM (pendiente de Maikel). Su valor real es de autoridad: un caso propio con fecha que ningún competidor tiene.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Usa resumen oscuro, pnum, destacado y regla. Párrafos cortos, se lee bien en el móvil. Falla la jerarquía en «Cómo cualificar en tres capas»: dos H2 seguidos. Falta el elemento `.post-caso` para los dos casos del 30-sep, que es exactamente para lo que existe.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: el lede funciona («treinta segundos, desde el móvil, entre otras cosas»), pero remata con la antítesis.
- Claridad: alta. Se entiende en cinco segundos.
- Credibilidad: buena base, dañada por los seis claims que van más allá de la fuente (C1.1 a C1.6, C1.10).
- CTA: conectado al tema y fiel a `/diagnostico/`. Sin precio ni garantía.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Habla de una fuga real (dar por bueno el formulario) y de sistema (nota, CRM, devolución a Meta). Bien alineado. El párrafo de servicio, con C1.11 y C1.12, conecta con pilotos sin prometer de más.

## Versión Mejorada del Hook

«Entró como nivel A, lo más alto de nuestra puntuación. En la reunión vimos que no encajaba. Fue el 30 de septiembre, y ese mismo día nos pasó otra vez.»

## Próximo Experimento Recomendado

Si Maikel aprueba el test de formularios de Growth (12 al 25-oct), llevar «quién va a usar el sistema» como pregunta en una de las dos variantes y actualizar el artículo con el resultado. Convierte la hipótesis de C1.9 en dato.

## Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 2 · Reorientación de «Qué es un lead» (`blog/que-es-un-lead/index.html`)

Revisado solo lo cambiado: párrafo bajo «La métrica que manda», párrafo bajo «Antes de pedir más leads» y post-cta (más el dateModified).

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **7** · Veredicto **PUBLICAR CON CAMBIOS**.

## Nota Global (1-10)

7/10.

## Resumen Ejecutivo

Buena reorientación: el artículo genérico pasa a tejer el cluster (coste por lead, cualificar leads) y cambia el doble botón por uno solo al diagnóstico. El párrafo nuevo habla como una persona. Fallan tres frases: una promete números de coste por cliente que el artículo enlazado no tiene, otra repite el «daba por buenos» sin fuente para reformas, y la tercera vende como práctica actual las tres capas.

## Lo Mejor

- «Antes de comprar más, mira qué pasa con los que ya entran: quién contesta, quién reserva, quién se presenta.» Claro, en tono de bar, sin tasa de plantones.
- Un solo CTA, coherente con `/diagnostico/` (media hora, plan en 24 horas).
- dateModified actualizado a 2026-10-01.
- Sin raya larga ni punto y coma en lo nuevo. Sin precio ni garantía.

## Lo Más Débil

- El enlace a coste por lead promete números de coste por cliente.
- El caso del 30-sep llega condensado con un matiz que la fuente no respalda.

## Problemas Críticos Detectados

**C2.1 · Promete números que el artículo enlazado no tiene.** La frase va justo después de «coste por cliente por canal», y `blog/coste-por-lead/` da coste por contacto y por cita, no por cliente.
- Falla: «Te lo cuento con números de nuestra propia campaña en coste por lead.»
- Propuesta: «En coste por lead lo cuento con números de mi propia campaña, medidos hasta la cita.»

**C2.2 · «Daba por buenos» no consta para el de reformas.**
- Falla: «A nosotros, el 30 de septiembre, dos contactos que el formulario daba por buenos no encajaban en la reunión.»
- Propuesta: «A nosotros nos pasó dos veces el 30 de septiembre: el formulario prometía más encaje del que había y en la reunión no encajaban.»

**C2.3 · «Cualificamos ahora» no consta como práctica actual.**
- Falla: «Cómo cualificamos ahora, en tres capas, está en cualificar leads.»
- Propuesta: «Cómo cualificar en tres capas para que no te pase está en cualificar leads.»

## Qué Eliminaría

Nada de lo nuevo.

## Qué Simplificaría

- «Salimos con qué pasa con tus contactos desde que entran y dónde se pierden» se lee con tropiezo. Mejor: «Vemos qué pasa con tus contactos desde que entran y dónde se pierden. El plan por escrito te lo quedas en 24 horas.»
- En la frase que no cambió del mismo párrafo, «canales «caros» que son los únicos rentables» es un absoluto sin fuente. No es crítico porque no es texto nuevo, pero ya que se toca el párrafo: «canales «caros» que acaban saliendo más rentables».

## Qué Reforzaría

Nada más. El párrafo ya hace su trabajo de puente.

## Riesgos

- Fuera del alcance de esta revisión pero en la misma página: el destacado «Un lead no es un activo. Es una conversación pendiente que caduca — cada día sin respuesta vale menos.» tiene un «no es X, es Y» y una raya larga. Para la próxima pasada.

## Impacto Esperado

Bajo en sí, útil para el cluster: pasa autoridad de una página genérica a la pieza nueva y al diagnóstico.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Sin cambios de diseño. El post-cta con un solo botón gana claridad.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

Claro y hablado. Credibilidad tocada por C2.1 y C2.2. CTA bien.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Bien: lleva de una keyword informativa a una pieza con caso propio y de ahí al diagnóstico.

## Versión Mejorada del Hook

No aplica (no cambia el lede). Para el párrafo: «Antes de comprar más contactos, mira qué pasa con los que ya entran.»

## Próximo Experimento Recomendado

Cuando haya UTM en el blog, medir clics de este párrafo a `/blog/cualificar-leads/` y a `/diagnostico/` frente a los del post-cta.

## Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 3 · Redes del jueves «Le digo a Meta quién encajó» (`content/borradores/2026-10-01-agentizando-le-digo-a-meta.md` + `content/infografias/2026-10-01/le-digo-a-meta.png`)

Revisado: texto de LinkedIn, ficha e imagen (mirada: titular, subtítulo, tabla de tres estados, línea del fallo, firma).

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **no** · Alineado con propuesta **sí** · Nota **6** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1-6, 7 (pieza de una imagen) y 12.

## Nota Global (1-10)

6/10.

## Resumen Ejecutivo

Buena idea y bien ordenada: acierto con fecha primero, fallo corto después, sin clientes, sin nombres, sin WhatsApp, sin plantones. Pero simplifica la fuente hasta falsearla: son cuatro estados y no tres, «descartado» no es solo «en la reunión vimos que no encajaba», y «no le llegó casi nada» confunde los contactos (que sí llegaban) con su calidad (2 Contacted y 0 Qualified). La imagen añade «así busca más contactos como los buenos», que en la cuenta propia todavía no pasa. Abre con un «no solo X» y deja a la vista el rótulo de la ficha («El fallo, corto»).

## Lo Mejor

- Acierto con dato primero (30-sep, de «cualificado» a «descartado» después de la reunión) y fallo después, corto y con fecha de arreglo. Exactamente el orden pedido.
- «Para Meta era un buen lead. Ahora sabe que no.» Frase de persona, con gracia.
- El párrafo de por qué («aprende a traerte más gente que rellena formularios. Que no es lo mismo que gente que compra.») se entiende a la primera.
- Nada de resultados de clientes (regla de agosto), ningún nombre, ningún WhatsApp, ni precio ni garantía, sin raya larga ni punto y coma.
- Imagen limpia, legible, con el estado clave en negro.

## Lo Más Débil

- Los tres estados están definidos a medida de la historia, no como funcionan.
- El fallo sin su número, cuando el número existe y es más fuerte que «casi nada».
- La pregunta final habla de «venta» y el post habla de encaje.

## Problemas Críticos Detectados

**C3.1 · «No solo X» disfrazado (primera línea del texto).**
- Falla: «Le digo a Meta quién encajó. No solo quién dejó sus datos.»
- Propuesta: «Le digo a Meta quién encajó.»

**C3.2 · Imagen, subtítulo: «no solo X» y un claim que no consta.** La cuenta sigue en LEAD_GENERATION (daily 28-sep, propuesta para el 5-oct).
- Falla: «No solo quién dejó sus datos. Así busca más contactos como los buenos.»
- Propuesta: «Qué pasó con cada contacto después del formulario, también después de la reunión.»

**C3.3 · Son cuatro estados, no tres** (daily 28-sep: Contacted, Qualified, Converted, Disqualified. La propia ficha lo dice).
- Falla: «Así que mi sistema le devuelve tres cosas de cada contacto:»
- Propuesta: «Así que mi sistema le devuelve en qué punto está cada contacto. Por ejemplo:»

**C3.4 · «Descartado» no es solo eso** (meta-capi 29-sep 08:40: Disqualified a quien nunca contestó. Daily 28-sep: precualificación «no encaja todavía» → Disqualified). En texto e imagen.
- Falla: «Descartado: en la reunión vimos que no encajaba.»
- Propuesta: «Descartado: no contestó o vimos que no encajaba.»

**C3.5 · Rótulo de ficha a la vista y claim inexacto en el texto.** «El fallo, corto» es la instrucción de la ficha copiada (regla del 22-sep). Y lo que no llegaba era la calidad: «2 Contacted y 0 Qualified en diez días».
- Falla: «El fallo, corto: durante diez días a Meta no le llegó casi nada, por un fallo técnico. Lo arreglamos el 28 de septiembre.»
- Propuesta: «Pero durante diez días esto no funcionó: a Meta le llegaron 2 «contactado» y ningún «cualificado», por un fallo técnico. Lo arreglamos el 28 de septiembre.»

**C3.6 · Mismo claim inexacto en la imagen (pie).**
- Falla: «Durante diez días no le llegó casi nada, por un fallo técnico. Arreglado el 28 de septiembre.»
- Propuesta: «Durante diez días solo le llegaron 2 «contactado» y ningún «cualificado», por un fallo técnico. Arreglado el 28 de septiembre.»

## Qué Eliminaría

- La serie «Agentizando mi propia empresa» como rótulo visible si se pensaba poner en el post o en la imagen. Hoy solo está en la ficha. Que se quede ahí (regla del 22-sep sobre nombres de serie).

## Qué Simplificaría

- La pregunta final, para que hable de lo mismo que el post: «¿Le cuentas a tu plataforma de anuncios qué leads acabaron en venta, o solo cuántos entraron?» → «¿Tu plataforma de anuncios sabe qué contactos encajaron, o solo cuántos entraron?»

## Qué Reforzaría

- Una línea, si Maikel la quiere dar, sobre por qué decidió marcarlo como descartado. En la fuente solo consta «sip lo que consideres» a la propuesta de Growth. No la invento.

## Riesgos

- Si alguien que gestiona anuncios lee «así busca más contactos como los buenos» y pregunta por el objetivo de la campaña, la respuesta (LEAD_GENERATION) desmonta la pieza. Por eso C3.2.
- La firma de la imagen es «@maikel.echevarria», el usuario de Instagram, en una pieza para LinkedIn. Menor, pero conviene revisarlo.
- Las redes siguen en pausa. Nada sale sin el ok de Maikel.

## Impacto Esperado

Medio en conversaciones con gente que gestiona anuncios, que es justo el público que mide la ficha. Es técnica pero se entiende. Con la pregunta corregida, invita a contestar con su caso.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Titular fuerte y legible en el feed. La tabla de estados se lee de un vistazo y el negro marca el estado protagonista. Queda un hueco grande entre la tabla y el pie. Si se añade el número del fallo (C3.6), se puede subir el pie o darle algo más de cuerpo. Regenerar con `render.sh` tras los cambios.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: «Le digo a Meta quién encajó.» funciona solo, sin el «no solo».
- Claridad: alta.
- Credibilidad: dañada por C3.3 a C3.6. Con el número del fallo gana más de lo que pierde.
- CTA: pregunta de conversación válida, pero desalineada (venta frente a encaje).

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Habla de sistema y de una fuga concreta (la plataforma no sabe quién encaja). Enlaza con el artículo del día. Aporta conversaciones con el ICP técnico. Alineada.

## Versión Mejorada del Hook

«Para Meta, el contacto de reformas del 30 de septiembre era un buen lead. Después de la reunión le dijimos que no.»

## Próximo Experimento Recomendado

Cuando se levante la pausa, publicar esta versión con la pregunta corregida y contar cuántos comentarios vienen de gente que gestiona anuncios y cuántos acaban en mensaje privado. Comparar con la pieza del 28-sep.

## Veredicto: PUBLICAR CON CAMBIOS

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| 1 · Artículo «Cualificar leads» | 6/10 | PUBLICAR CON CAMBIOS | 16 (C1.1 a C1.16) |
| 2 · Reorientación «Qué es un lead» (dos párrafos y post-cta) | 7/10 | PUBLICAR CON CAMBIOS | 3 (C2.1 a C2.3) |
| 3 · Redes del jueves «Le digo a Meta quién encajó» + imagen | 6/10 | PUBLICAR CON CAMBIOS | 6 (C3.1 a C3.6) |
