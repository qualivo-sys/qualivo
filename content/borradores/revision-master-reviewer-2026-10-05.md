# Revisión Qualivo Master Reviewer · 5-oct-2026

> Tres piezas del commit `0147a43` («Contenido 5-oct»). Revisadas con
> `content/agentes/prompt-qualivo-master-reviewer.md`, `content/guia-de-voz.md`
> (con la regla del 22-sep), `content/estandar-articulos.md` y las reglas de
> Maikel (plantones, WhatsApp desde el número personal, terceros, construcciones
> vetadas, raya larga y punto y coma, acierto con dato primero, nada inventado,
> regla de agosto de `growth-os.md` l. 65, ni precio ni garantía).

## Fuentes contrastadas

| Claim | Fuente | Qué dice la fuente, tal cual |
|---|---|---|
| Limpieza del CRM del 1-oct: qué se encontró | `bus/out/demand.jsonl`, cambio-meta 1-oct 09:10 (`pendiente_de_maikel`) | «Clientes Kubysoft, Adigital y Antic: en etapa Cliente pero abiertos, no ganados» (**3 clientes**). «Duplicados: Oriol/Betlem (Talkual) y Adela» (**2 duplicados**: una empresa con dos personas y una persona). «Jordi (Bigpoma) pidió baja y sigue en Más adelante» (**1 baja**). «Valor de los tratos de Dataslayer y AdelantTa (0 €)» (**2 tratos a 0 €**). También: resultados de 5 reuniones sin anotar. |
| Por qué se hizo la limpieza | misma entrada 09:10 (`titulo`, `autoriza`) | Era la sincronización de la calidad de lead con Meta (CAPI) de 28 leads. Maikel: «necesito que todo este actualizado y todo esta puesto en las apis y demás de meta?». |
| Quién la hizo | entradas 09:10 y 09:25, `agente: growth` | La detectó y la ejecutó **el agente de Growth**. Maikel autorizó: «Si lo que me has dicho». No la hizo Maikel ni «dedicamos un rato». |
| Qué quedó arreglado | cambio-meta 1-oct 09:25 | «CRM limpio para la auditoría: [...] Kubysoft/Adigital/Antic ganados, duplicados de Talkual y Adela abandonados, Jordi (Bigpoma) perdido por baja». **Siguen pendientes de Maikel** el valor de los dos tratos a 0 € y los resultados de las reuniones. |
| «La mitad del equipo desde el correo y la otra mitad desde el CRM» | `content/briefs/2026-10-02-insights-semana-40.md` p. 2 y p. 8 | Una sola empresa: «un equipo que trabaja «50 y 50» entre Gmail y Zoho» y «comerciales que no usan el CRM (Sergi)». No dice que se repita en otras. |
| PDF, llamada o WhatsApp copiados a mano · informes del lunes | `equipos-comerciales/index.html` | «La mitad del equipo trabaja desde Gmail y la otra mitad desde el CRM», «Llega un PDF, una llamada o un WhatsApp, y alguien lo pasa al CRM cuando puede», «Cada lunes alguien junta llamadas, reuniones y tratos en una hoja», bajo «Lo que nos cuentan los directores comerciales». Es una página **«Borrador para revisión de Maikel · no indexada»** (`noindex,nofollow`, fuera del sitemap). El brief no menciona PDF ni lunes. |
| Ningún nombre identificable en la escena | brief, p. 2 | El artículo no da nombre, sector, número de comerciales ni CRM. No identifica a nadie. Ojo: la escena es de Alpha, hoy cliente, y el brief dice «No citar a Alpha como caso hasta que Sergi lo autorice». El artículo no la cita como caso. |
| A/B no reciben el primer WhatsApp sin el ok de Maikel | daily 29-sep `cambios_hoy.cadencia` · **`api/_activacion.js` l. 338-357 y 450-453** | El 29-sep era verdad. **Desde el 1-oct ya no**: «A y B dentro de la supervisión de Maikel (L-V laborables 9:00-19:00): se genera el borrador al momento, se le avisa («sale automáticamente a las HH:MM si no haces nada») y espera ESPERA_A_B_MIN [10]. [...] Si no, sale solo». «A y B fuera de su supervisión pero en hora de WhatsApp: sale al momento». |
| El copiloto redacta y Maikel envía | **`api/_agente.js` l. 463-473** | «1-oct-2026 (Bloque 1, decisión de Maikel): [...] Cuando el lead ya conversa, el agente contesta solo [...] Maikel pasa a ser capa de escalado, no un paso obligatorio». `const COPILOTO = false;`. Y el agente escribe como Maikel: «Nadie sabe que hay un asistente detrás y no lo vas a decir» (l. 34), por la pasarela del móvil personal (l. 491). |
| Raquel dice que es una asistente | `content/borradores/2026-09-24-agentizando-eres-una-maquina.md` (bitácora del 22-sep) · brief p. 6 | Raquel se presenta como «soy Raquel, del equipo de Maikel Echevarría» (`content/carruseles/2026-09-21-llamada-real/laminas.html`). Dice que es IA **cuando se lo preguntan**: «Sí, soy la asistente de IA de Máikel. La reunión es con él, en persona». El 22-sep lo negó y la persona colgó. La respuesta fija se aplicó esa misma tarde. |
| Ofrece una persona | daily 29-sep `objecion_que_se_repite` | «Raquel ya ofrece que la llame una persona si lo prefiere». |
| «Ya no se le olvida» | ninguna | El 29-sep alguien volvió a preguntar «si era una máquina» (Cristina). El daily no dice qué contestó Raquel. No hay fuente para «ya no se le olvida». |
| Miedo a la IA en cuatro reuniones | brief p. 6 | «El miedo es que la IA sustituya a la persona. Renato, Ana, Izaskun y Eva: que no suene a robot, que pare cuando toca y que ellos puedan entrar». No hay citas tipo «¿Mis clientes van a hablar con una máquina?». Y p. 1 y p. 3: «Todas las objeciones fueron de presupuesto, de calendario [...]» y el precio salió en las ocho reuniones. |
| «Llamar para confirmar» (imagen) | `api/activacion.js` l. 30-38 y 462-475 · `content/plan-octubre-2026.md` l. 108-116 | Raquel llama a los B y C que no han contestado a las 2 h 30, para agendar. **No existe una llamada para confirmar citas.** Es la hipótesis de la semana 1 del plan de octubre (5-11 oct): «Quien no confirma la víspera recibe una llamada». Sin construir. |
| Media hora y plan en 24 horas (CTA) | `diagnostico/index.html` | «30 minutos. Te mandamos el plan por escrito en 24 horas». Coherente. La garantía vive en `/diagnostico/`, no en las piezas. |

---

# PIEZA 1 · Artículo «Tu equipo comercial no usa el CRM» (`blog/equipo-comercial-no-usa-el-crm/index.html`)

Keyword: «equipo comercial no usa el CRM». Revisado: texto visible, «En 30 segundos», FAQ visible y schema, CTA, meta y og:description, tarjeta de `blog/index.html` y línea de `llms.txt`.

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **5** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1-6, 11 (cierre como mini landing) y 12. Carrusel, reel, anuncio y outbound no aplican.

## Nota Global (1-10)

5/10.

## Resumen Ejecutivo

Buen tema, buena keyword y bien tejido al pilar. Las cifras de la limpieza cuadran (3 clientes, 1 baja, 2 tratos a 0 €). Pero el artículo cuenta la limpieza como algo que «dedicamos un rato» a hacer, cuando la hizo el agente de Growth con el ok de Maikel, y se pierde la mejor parte: salió el día que el CRM tuvo que decirle la verdad a Meta. Eso prueba la tesis del artículo mejor que cualquier frase. Además hay frases que la fuente no dice («con información distinta en cada ficha», «la escena se repite», «diez minutos», «cada estado era verdad el día que se puso»), seis construcciones «no X, sino Y» disfrazadas y un enlace a una página que Maikel aún no ha aprobado. Todo se arregla frase a frase.

## Lo Mejor

- Dato propio con fecha y cantidades correctas: tres clientes abiertos, una baja en «más adelante», dos tratos a 0 €.
- Primera persona real: es el CRM de Qualivo, no un cliente. Cumple la regla de agosto. Sin nombres, sin tasa de plantones, sin precio ni garantía.
- Sin raya larga ni punto y coma en el texto visible ni en el schema.
- Keyword en title, H1, «about», FAQ y ancla desde el pilar. FAQ del schema idéntica a la visible.
- Los tres cambios son accionables y no piden herramienta nueva. La regla semanal es memorable.
- El CTA habla de lo mismo que el artículo («¿Tu CRM le dice a tu equipo qué toca hoy?») y promete lo que promete `/diagnostico/`.

## Lo Más Débil

- Quién hizo la limpieza y por qué: el artículo lo vuelve genérico y se come la prueba.
- El orden: abre con el fallo (nuestro CRM estaba mal) en vez de con el acierto (el agente lo encontró y lo arregló en una mañana).
- Generalizaciones sin fuente con «casi ningún», «casi todos», «la escena se repite».
- La sección «Qué hacemos nosotros» vende un servicio que solo está descrito en una página en borrador.

## Problemas Críticos Detectados

**C1.1 · Lede con «no es X, es Y» disfrazado y generalización sin fuente.**
- Falla: «Casi ningún equipo comercial deja de usar el CRM por pereza. Lo deja porque rellenarlo no le devuelve nada.»
- Propuesta: «Un equipo comercial deja de usar el CRM cuando rellenarlo no le devuelve nada.»

**C1.2 · Claim sin fuente (nadie ha comparado nuestro CRM con el de otras empresas).**
- Falla: «El 1 de octubre limpiamos nuestro CRM, y nos encontramos lo mismo que vemos en las empresas con las que hablamos.»
- Propuesta: «El 1 de octubre nos pasó a nosotros.»

**C1.3 · Causa inventada y contradicha por la fuente («En 30 segundos»).** La limpieza se hizo precisamente porque había que mandarle a Meta el estado de cada lead.
- Falla: «Nadie lo había hecho mal a propósito. Los estados se quedaron viejos porque nadie los necesitaba al día.»
- Propuesta: «Salió el día que el CRM tuvo que decir la verdad: había que contarle a Meta qué contactos de los anuncios eran buenos.»

**C1.4 · «X, no Y» disfrazado («En 30 segundos»).**
- Falla: «Un CRM se usa cuando le dice al comercial qué toca hoy, no cuando solo guarda lo que ya pasó.»
- Propuesta: «Un CRM se usa cuando le dice al comercial qué toca hoy.»

**C1.5 · Quién hizo la limpieza (inventado) y acierto primero.** La hizo el agente de Growth, con el ok de Maikel, la misma mañana. «Dedicamos un rato» no está en ninguna fuente.
- Falla: «El 1 de octubre dedicamos un rato a dejar el CRM al día. Esto es lo que salió:»
- Propuesta: «El 1 de octubre teníamos que contarle a Meta qué contactos de los anuncios eran buenos, y para eso el CRM tenía que decir la verdad. Nuestro agente de Growth lo repasó, me pasó la lista y, con mi ok, esa misma mañana arregló lo que podía arreglar sin mí. Esto es lo que encontró:»

**C1.6 · «X, no Y» disfrazado.**
- Falla: «Tres empresas que ya eran clientes seguían en la etapa de cliente, pero como tratos abiertos, no ganados.»
- Propuesta: «Tres empresas que ya eran clientes estaban en la etapa de cliente, pero con el trato todavía abierto.»

**C1.7 · Detalle sin fuente y cantidad que falta.** La fuente da dos duplicados (una empresa con dos personas y una persona) y no dice nada de «información distinta».
- Falla: «Contactos duplicados: la misma empresa, dos veces, con información distinta en cada ficha.»
- Propuesta: «Dos duplicados: una empresa y una persona que estaban dos veces.»

**C1.8 · Afirmaciones sin fuente (y falsas para los duplicados y los 0 €, que nunca fueron «verdad»). Además falta el fallo propio, corto: los 0 € siguen pendientes de Maikel.**
- Falla: «Nada de esto lo hizo nadie mal a propósito. Cada estado era verdad el día que se puso. Simplemente, nadie necesitaba que siguiera siendo verdad, porque el trabajo diario no dependía de él. Esa es la raíz del problema en casi todos los equipos.»
- Propuesta: «Nada de esto lo hizo nadie mal a propósito. Y el valor de los dos tratos a 0 € se quedó pendiente de mí.»

**C1.9 · «La escena se repite» no está en la fuente (es una sola empresa, y dijo «50 y 50»).**
- Falla: «Hablando con directores comerciales, la escena se repite: la mitad del equipo trabaja desde el correo y la otra mitad desde el CRM, y nadie sabe con certeza qué toca hoy con cada cliente.»
- Propuesta: «Un director comercial nos contó hace poco que su equipo trabaja «50 y 50» entre el correo y el CRM. Otros nos cuentan lo mismo con otras palabras:» (y sigue «Lo que llega por un PDF…»).

**C1.10 · «Deja de ser X y pasa a ser Y» y comparativo sin fuente.**
- Falla: «Si la ficha le dice al comercial qué toca hoy, el CRM deja de ser un archivo y pasa a ser su lista de trabajo. Es el cambio que más se nota, y no requiere ninguna herramienta nueva.»
- Propuesta: «Si la ficha le dice al comercial qué toca hoy, el CRM se convierte en su lista de trabajo. Y no hace falta ninguna herramienta nueva.»

**C1.11 · Cifra sin fuente (regla).**
- Falla: «Una vez por semana, diez minutos: oportunidades sin siguiente acción, duplicados y estados que ya no son verdad.»
- Propuesta: «Una vez por semana, un repaso corto: oportunidades sin siguiente acción, duplicados y estados que ya no son verdad.»

**C1.12 · Enlace a una página no aprobada.** `/equipos-comerciales/` es «Borrador para revisión de Maikel · no indexada» (`noindex,nofollow`).
- Falla: «Lo cuento con más detalle en equipos comerciales.»
- Propuesta: quitar la frase hasta que Maikel apruebe la página. El párrafo siguiente («Si quieres verlo con tu CRM abierto, en media hora lo miramos juntos.») ya cierra.

**C1.13 · Promesa más fuerte que la fuente.** La página dice «Los mensajes y las reglas los aprobáis antes de que salgan. Al principio, todo en borrador» y el generador admite «o los manda automático».
- Falla: «Si se prepara algún mensaje, lo aprueba el comercial antes de que salga.»
- Propuesta: «Los mensajes y las reglas los aprobáis vosotros antes de que salgan.»

**C1.14 · «X, no Y» disfrazado (FAQ visible y schema).**
- Falla: «…y que la reunión semanal se haga con el CRM abierto, no con una hoja aparte.»
- Propuesta: «…y que la reunión semanal se haga con el CRM abierto.»

**C1.15 · «X, no Y» disfrazado (FAQ visible y schema).**
- Falla: «Casi nunca. El problema suele estar en lo que se le pide al equipo y en lo que el CRM le devuelve, no en la herramienta.»
- Propuesta: «Casi nunca. Si el CRM le pide al equipo más de lo que le devuelve, cambiar de herramienta con los mismos hábitos lleva el mismo desorden a otro sitio.» (y se borra la frase siguiente, que queda repetida).

## Qué Eliminaría

- La frase del enlace a `/equipos-comerciales/` (C1.12).
- «Esa es la raíz del problema en casi todos los equipos» (C1.8).
- El H2 vacío «Qué hacer» seguido de tres H2 numerados: o se pasa a H3 o se quita el H2.

## Qué Simplificaría

- «Así que lo hace lo justo, al final del día o cuando se lo piden» es una hipótesis. Marcarla como tal («Lo normal es…») o cortarla.
- «Si se deja para una vez al año, la limpieza es enorme y nadie se fía de los datos mientras tanto» aparece dos veces (regla y FAQ 3). Dejarla en la FAQ.
- Tarjeta del blog: «los tres cambios que hacen que el equipo lo abra solo» promete resultado. Mejor «y los tres cambios que proponemos».

## Qué Reforzaría

- El bloque de la limpieza como `.post-caso` con las cuatro cifras (3 · 2 · 1 · 2). Es el único dato propio del artículo y ahora es una lista plana.
- GEO: que la primera frase de «Por qué un equipo deja de usar el CRM» responda sola («Un equipo deja de usar el CRM cuando rellenarlo le cuesta tiempo y no le devuelve nada.») y la escena vaya después.
- En «En 30 segundos», poner las cantidades: «tres clientes que seguían como abiertos, dos duplicados, una baja en «más adelante» y dos tratos a 0 €».

## Riesgos

- **Baja que seguía en «más adelante»**: publicarlo es reconocer que alguien que pidió la baja seguía en una etapa de seguimiento. No hay fuente de que se le escribiera, pero en protección de datos suena mal. Que Maikel decida si lo quiere en público.
- La escena «50 y 50» es de una empresa que hoy es cliente. No se nombra y no se cita como caso, así que cumple el brief. No añadir más detalles (14 comerciales, Zoho).
- La sección «Qué hacemos nosotros» describe la oferta de tipo A, que en el brief sigue como «propuesta, decide Maikel».

## Impacto Esperado

Medio en búsqueda (intención clara, poca competencia en español con dato propio). Medio-bajo en diagnósticos: el lector es un director comercial con dolor real, pero llega a un CTA genérico de 30 minutos. Con la historia del agente bien contada sube la credibilidad del «trabajamos encima de tu CRM».

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Tiene resumen oscuro, destacado y regla. Falta el `.post-caso` para el dato propio. Jerarquía rota por el H2 «Qué hacer» vacío. Párrafos cortos, se lee bien en el móvil.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: claro, pero con «no es X, es Y» (C1.1).
- Claridad: buena, sin jerga.
- Credibilidad: las cifras son reales, pero alrededor hay causas y escenas que la fuente no dice (C1.3, C1.5, C1.7, C1.8, C1.9).
- CTA: bien conectado. «Pedir el diagnóstico» coherente con `/diagnostico/`.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Habla de una fuga real (el seguimiento que no vive en el CRM) y del cliente de tipo A, el que cerró. Acerca a diagnósticos con directores comerciales. Contado con el agente, además demuestra lo que vendemos: una IA que encuentra lo que no cuadra y lo arregla con el ok del dueño.

## Versión Mejorada del Hook

«El 1 de octubre nuestro CRM tenía tres clientes que seguían como tratos abiertos. Lo vimos el día que tuvimos que contarle a Meta qué contactos eran buenos.»

## Próximo Experimento Recomendado

Medir durante cuatro semanas los clics al diagnóstico desde este artículo frente a los del pilar `crm-para-pymes`. Si este convierte más, la siguiente pieza del cluster sale con la misma estructura: dato propio arriba y un solo CTA.

## Veredicto: PUBLICAR CON CAMBIOS

**Canibalización con `crm-para-pymes`:** no canibaliza si se mantiene así. El pilar responde «¿por qué fracasan las implantaciones de CRM?» (elegir e implantar). El artículo responde «mi equipo no usa el CRM» (adopción del equipo). Se solapan dos ideas (el CRM tiene que devolver algo al que registra y la dirección tiene que decidir con él), pero el pilar enlaza al artículo con la keyword exacta como ancla y el artículo declara el pilar como guía. Recomendación: enlazar también desde el punto «El equipo lo vive como vigilancia» del pilar y no añadir al artículo una FAQ sobre implantación.

---

# PIEZA 2 · Reorientación «CRM para pymes» (`blog/crm-para-pymes/index.html`)

Revisado solo lo que cambió: el párrafo nuevo tras «Por qué fracasan las implantaciones», el post-cta y el `dateModified`.

Fila de Notion: Diseño ok **sí** · Copy ok **sí** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **7** · Veredicto **PUBLICAR CON CAMBIOS**.

## Nota Global (1-10)

7/10.

## Resumen Ejecutivo

El párrafo nuevo es corto, en tono de persona y lleva al lector del pilar al artículo y al diagnóstico. Las tres cosas que cita (clientes abiertos, duplicados, tratos a 0 €) están en la fuente. Falla una promesa: «con lo que cambiamos» no existe en el artículo. El post-cta gana foco con un solo botón.

## Lo Mejor

- «Y no le pasa solo a los demás.» Arranque humano, sin lema.
- Hechos verificados, sin nombres, sin cifras de clientes, sin precio ni garantía, sin raya ni punto y coma.
- Ancla con la keyword exacta del artículo nuevo. Buena señal contra la canibalización.
- Post-cta coherente con `/diagnostico/` (media hora, plan en 24 horas).

## Lo Más Débil

- «Lo cuento, con lo que cambiamos» promete algo que el artículo no tiene.
- El post-cta ha perdido «Las 6 comprobaciones», la única salida para quien todavía no quiere una reunión.

## Problemas Críticos Detectados

**C2.1 · Promesa que el destino no cumple.** El artículo cuenta lo que se encontró y qué hacer en general. No cuenta qué cambió Qualivo después.
- Falla: «Lo cuento, con lo que cambiamos, en tu equipo comercial no usa el CRM.»
- Propuesta: «Lo cuento en tu equipo comercial no usa el CRM.»

## Qué Eliminaría

Nada más.

## Qué Simplificaría

- «Salimos con qué datos te puedes creer, dónde se queda parado el seguimiento y qué arreglar primero» son tres promesas. `/diagnostico/` dice «dónde se escapa el negocio» y «qué fuga va primero». Con dos basta: «Salimos con dónde se te escapa el seguimiento y qué arreglar primero».

## Qué Reforzaría

- Volver a poner «Las 6 comprobaciones» como enlace de texto bajo el botón, no como segundo botón. El pilar recibe tráfico frío que no está para reunión.

## Riesgos

- Si el artículo nuevo no se corrige antes, el pilar manda tráfico a un texto con claims sin fuente.

## Impacto Esperado

Bajo y positivo: refuerza el cluster, refresca `dateModified` y concentra el CTA. Puede bajar algo la conversión a lead magnet por quitar «Las 6 comprobaciones».

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Sin cambios visuales salvo un botón menos. El párrafo nuevo mide tres líneas en el móvil. Bien.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook del párrafo: bueno.
- Credibilidad: buena, salvo C2.1.
- CTA: claro, un solo paso.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Un pilar de búsqueda que ahora empuja a diagnóstico con una prueba propia. Suma a diagnósticos sin coste.

## Versión Mejorada del Hook

«Y no le pasa solo a los demás. El 1 de octubre nuestro CRM tenía tres clientes que seguían como tratos abiertos.»

## Próximo Experimento Recomendado

Comparar durante cuatro semanas los clics a `/diagnostico/` desde el pilar frente a las cuatro semanas anteriores con el CTA doble.

## Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 3 · Borrador del lunes «La IA no sustituye al comercial» (`content/borradores/2026-10-05-agentizando-semiautomatico.md` + `content/infografias/2026-10-05/semiautomatico.png`)

Revisado el texto de LinkedIn, la ficha y la imagen (vista: titular «LA IA NO SUSTITUYE AL COMERCIAL», columnas «Lo hace la IA: Redactar · Recordar · Avisar · Llamar para confirmar» y «Lo decides tú: Soltar el mensaje · La reunión · El precio · El cierre», pie con el texto del contacto con buena pinta).

Fila de Notion: Diseño ok **no** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **no** · Nota **3** · Veredicto **REHACER**.

Ángulos que aplican: 1-6, 7 (imagen única tipo lámina), 10 no, 12.

## Nota Global (1-10)

3/10.

## Resumen Ejecutivo

La idea es buena y responde a un miedo real que salió en cuatro reuniones. Pero el post describe un sistema que ya no existe. Desde el 1-oct el primer WhatsApp a los A y B sale solo a los diez minutos si Maikel no hace nada, y el copiloto está apagado: el agente contesta solo, como Maikel, por la pasarela de su móvil personal. Así que la pieza afirma cosas falsas y además señala justo lo que la regla de Maikel prohíbe: que parezca que hay WhatsApp automatizado desde su número. A eso se suman citas inventadas, un «no fue el precio» que contradice el brief, una llamada para confirmar que no existe, un titular-lema y un cierre-lema. Hay que rehacerla sobre lo único que sí está verificado y es seguro: la voz.

## Lo Mejor

- El tema: el miedo a que la IA sustituya a la persona salió de verdad con cuatro personas (brief p. 6).
- La respuesta de Raquel cuando le preguntan si es una máquina, y que ofrece una persona, es real y está bien contada.
- Sin nombres, sin sectores, sin precio en cifras, sin tasa de plantones, sin raya ni punto y coma en el copy.
- La ficha detecta el solape con el post del jueves y recomienda publicar uno. Bien visto.

## Lo Más Débil

- Lo que cuenta del WhatsApp es falso desde el 1-oct y toca la regla del número personal.
- No hay acierto con dato: el gancho es una pregunta y el «acierto» no tiene ningún número ni fecha.
- Titular y cierre son lemas.

## Problemas Críticos Detectados

**C3.1 · Lema como titular (regla del 22-sep). Además es el H2 reciclado de `/equipos-comerciales/`.** Imagen y título del borrador.
- Falla: «La IA no sustituye al comercial»
- Propuesta: «Cuatro reuniones, el mismo miedo: que suene a robot»

**C3.2 · Contradice el brief y mete el precio en la pieza.** El precio salió en las ocho reuniones y todas las objeciones fueron de dinero o calendario (brief p. 1 y p. 3). La fuente no dice que esta fuera «la pregunta que más» hicieron.
- Falla: «La pregunta que más me hicieron la semana pasada no fue el precio.»
- Propuesta: «La semana pasada me pidieron lo mismo en cuatro reuniones.»

**C3.3 · Citas inventadas.** El brief dice «que no suene a robot, que pare cuando toca y que ellos puedan entrar». No hay ninguna frase entrecomillada.
- Falla: «Fue esta, con distintas palabras: «¿Y esto no va a sonar a robot? ¿Mis clientes van a hablar con una máquina?». Salió en cuatro reuniones.»
- Propuesta: «Que no suene a robot, que pare cuando toca y poder entrar ellos en la conversación.»

**C3.4 · Falso desde el 1-oct y señala WhatsApp automatizado desde el número personal de Maikel** (texto y pie de la imagen). `api/_activacion.js` l. 338-357: en horario de supervisión sale solo a los 10 minutos, fuera sale al momento.
- Falla: «Cuando entra un contacto con buena pinta, el sistema no le escribe solo. Me avisa a mí con el mensaje ya redactado, y yo lo suelto o lo cambio.»
- Propuesta: «En mi empresa llama una asistente de voz. El 29 de septiembre hizo 15 llamadas. En una, a alguien que no había entrado a su reunión, le dijo que le estábamos esperando, y se conectó en ese momento.» (fuente: daily 29-sep, `titulo` y `llamadas_hoy`). En el pie de la imagen, el mismo texto o nada.

**C3.5 · Falso desde el 1-oct (`COPILOTO = false`, `api/_agente.js` l. 467-473) y vuelve a apuntar al WhatsApp que contesta como Maikel.**
- Falla: «Cuando alguien contesta, el asistente me prepara la respuesta. Si me vale, la envío yo.»
- Propuesta: borrar la frase. No hay versión verdadera que se pueda publicar sin romper la regla del WhatsApp.

**C3.6 · No es tal cual.** Raquel se presenta como «del equipo de Maikel» y dice que es IA cuando se lo preguntan.
- Falla: «Y cuando llama mi asistente de voz, dice que es una asistente. Si la persona prefiere hablar con alguien de carne y hueso, se lo ofrece.»
- Propuesta: «Si alguien le pregunta si es una máquina, dice que sí: que es mi asistente de IA y que la reunión es conmigo, en persona. Y si prefiere que le llame una persona, se lo ofrece.»

**C3.7 · «Ya no se le olvida» sin fuente, y el fallo esconde lo que pasó (lo negó y colgaron).**
- Falla: «Al principio no le habíamos dicho qué responder cuando alguien preguntaba «¿eres una máquina?». Se lo dijimos una vez, y ya no se le olvida.»
- Propuesta: «El 22 de septiembre todavía no le habíamos dicho qué contestar a eso. Alguien se lo preguntó, dijo que no, y colgaron. Esa misma tarde quedó puesta la respuesta.»

**C3.8 · Lema y falso desde el 1-oct** (el agente agenda y conversa solo, Maikel es «capa de escalado»).
- Falla: «La IA hace lo repetitivo. Lo que se decide, lo decido yo.»
- Propuesta: borrar. Se cierra con la pregunta.

**C3.9 · La llamada para confirmar no existe** (es la hipótesis de la semana 1 del plan de octubre, sin construir). Imagen, columna «Lo hace la IA».
- Falla: «Llamar para confirmar»
- Propuesta: «Llamar y proponer hora»

**C3.10 · «Soltar el mensaje» es falso desde el 1-oct y «La reunión» la agenda Raquel.** Imagen, columna «Lo decides tú».
- Falla: «Lo decides tú: Soltar el mensaje · La reunión · El precio · El cierre»
- Propuesta: «Lo hago yo: La reunión, en persona · El cierre»

## Qué Eliminaría

- Todo lo que describe el WhatsApp (C3.4, C3.5) en texto, pie e imagen.
- «Redactar», «Recordar» y «Avisar» de la imagen: los recordatorios salen como «Hola, soy Maikel» por WhatsApp y vuelven a rozar la regla. Columna propuesta: «Lo hace mi asistente de voz: Llamar y proponer hora · Apuntar la cita en mi agenda · Decir que es una IA si se lo preguntan» (fuente: borrador del 24-sep y su bitácora).

## Qué Simplificaría

Texto completo propuesto, todo con fuente:

> La semana pasada me pidieron lo mismo en cuatro reuniones. Que no suene a
> robot, que pare cuando toca y poder entrar ellos en la conversación.
>
> En mi empresa llama una asistente de voz. El 29 de septiembre hizo 15
> llamadas. En una, a alguien que no había entrado a su reunión, le dijo que
> le estábamos esperando, y se conectó en ese momento.
>
> Si alguien le pregunta si es una máquina, dice que sí: que es mi asistente
> de IA y que la reunión es conmigo, en persona. Y si prefiere que le llame
> una persona, se lo ofrece.
>
> El 22 de septiembre todavía no le habíamos dicho qué contestar a eso.
> Alguien se lo preguntó, dijo que no, y colgaron. Esa misma tarde quedó
> puesta la respuesta.
>
> ¿Qué es lo que más te preocupa de meter IA en tu equipo comercial?

## Qué Reforzaría

- La ficha: corregir «El copiloto redacta y Maikel envía (`api/_agente.js`)» y «los leads A y B no reciben el primer WhatsApp sin el ok de Maikel». Las dos cosas cambiaron el 1-oct. El README de la infografía repite el error.

## Riesgos

- **Regla del WhatsApp personal**: la versión actual le dice a cualquiera que haya recibido un WhatsApp de Maikel que pudo escribirlo un sistema. Es el riesgo principal.
- **Fechas**: «la semana pasada» solo vale si sale entre el 5 y el 11-oct. La ficha recomienda dejarla para la semana siguiente. Si se retrasa, «hace dos semanas».
- **Solape**: el borrador del 24-sep («¿Eres una máquina?», sin publicar) cuenta el mismo fallo del 22-sep. Publicar uno de los dos, no ambos.
- **Solape con el post del jueves 8** (cobertura de LinkedIn), ya señalado en la ficha.

## Impacto Esperado

Con la versión propuesta: conversación con dueños que tienen miedo a la IA, que es la objeción de cuatro reuniones. Sirve como respuesta preparada para las demos. Tal como está: riesgo reputacional sin ganancia.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Limpia y legible, buen contraste crema y negro. Pero hay un hueco vacío de unos 300 px entre las columnas y el pie, el titular es un lema y el pie repite el texto falso. «Lo decides tú» frente al «yo» del post confunde a quién habla.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: engancha, pero contradice el brief (C3.2) y abre con una cita inventada (C3.3).
- Claridad: buena.
- Credibilidad: baja. Describe el sistema del 29-sep, no el de hoy.
- CTA: pregunta de conversación, válida con LinkedIn en pausa.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Bien elegido: quita la objeción que frena reuniones. Mal ejecutado: si un cliente potencial descubre que el WhatsApp no era «yo lo suelto», pierde la confianza que la pieza quería ganar. Con la versión de voz suma a conversaciones sin ese riesgo.

## Versión Mejorada del Hook

«La semana pasada me pidieron lo mismo en cuatro reuniones: que no suene a robot.»

## Próximo Experimento Recomendado

Cuando se reactive LinkedIn, publicar la versión de voz y medir mensajes privados de dueños, no comentarios. Si aparecen, convertir la respuesta de Raquel en un fragmento de audio de diez segundos para las demos.

## Veredicto: REHACER

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| 1 · Artículo «Tu equipo comercial no usa el CRM» | 5/10 | PUBLICAR CON CAMBIOS | 15 (C1.1 a C1.15) |
| 2 · Reorientación «CRM para pymes» (párrafo nuevo y post-cta) | 7/10 | PUBLICAR CON CAMBIOS | 1 (C2.1) |
| 3 · Borrador del lunes «La IA no sustituye al comercial» + imagen | 3/10 | REHACER | 10 (C3.1 a C3.10) |
