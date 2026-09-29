# Revisión · Qualivo Master Reviewer · 29-sep-2026

> Cuatro piezas revisadas contra sus fuentes: el artículo nuevo «Ahora no es el
> momento», la reorientación de «Embudo de ventas» (los dos párrafos bajo «Ya
> tengo el embudo dibujado. ¿Ahora qué?» y el post-cta), el borrador de redes
> del martes «Sí. Pero más tarde.» con su ficha e imagen, y la corrección de
> ayer (sección y «En 30 segundos» del artículo del formulario, y la versión 2
> del post del lunes).
>
> Fuentes contrastadas:
> - `bus/out/demand.jsonl`: daily del 25-sep (Gastón, tareas 10-dic y 17-may-2027, «Sonia NO es cliente todavía»), aviso y daily del 27-sep (reuniones_celebradas, objecion_que_se_repite, campos_que_pides_por_lead, cadencia y copiloto), los tres cambio_meta del 28-sep y el daily del 28-sep (objeciones_que_se_repiten, reuniones_hoy, copiloto).
> - `api/_agente.js` (modo copiloto del 27-sep, excepción «precualificar» y «agente-auto» del 28-sep), `api/intelligence-datos.js` (redactar y enviar desde Intelligence), `api/activacion.js` y `api/_pausa.js` (cadencia: WhatsApp IA al entrar, respuestas en copiloto).
> - `diagnostico/index.html` (quince minutos y plan por escrito en 24 horas: correcto en los tres CTA).
> - `consultoria-ia/index.html` y `automatizacion-comercial/index.html` (los borradores como parte de lo que se monta para clientes).
>
> Calendario: 23-sep miércoles (reunión de Sonia), 25-sep viernes (reunión de Gastón), 27-sep domingo, 28-sep lunes, 29-sep martes.
>
> Comprobaciones que pasan en las cuatro piezas: sin raya larga ni punto y coma
> en el texto publicable. Sin nombres de leads ni de clientes. Sin cifra de
> plantones. Sin nada que suene a WhatsApp automático desde el número personal
> de Maikel.

---

# PIEZA 1 · Artículo «Ahora no es el momento»

`blog/ahora-no-es-el-momento/index.html` · keyword «ahora no es el momento» (objeción)

# Nota Global (1-10)

**6**. Sube a 8 con los trece cambios de frase de abajo. La estructura vale.

# Resumen Ejecutivo

La idea es buena y útil: «ahora no» puede ser calendario, riesgo o encaje, y cada uno se responde distinto. La pregunta «¿qué tendría que pasar para que sí fuera el momento?» es lo que alguien se lleva. El CTA conecta con el tema y promete lo que promete /diagnostico/.

El problema está en cómo se cuentan los tres casos. Hay dos citas entre comillas que nadie dijo. Hay un sentimiento de Maikel inventado («me dolió más»). El caso del sí se da por resuelto cuando la fuente dice «sí verbal», justo en el cliente que ya hubo que corregir el 25-sep («Sonia NO es cliente todavía»). Y el tercer caso («yo quería otra cosa») sale del daily del 28-sep: la fuente no dice que fuera una reunión ni que fuera la semana pasada. El «Qué hacemos nosotros» describe el copiloto como un servicio para clientes con fecha y tarea. La fuente describe el copiloto interno de Qualivo, que redacta respuestas a lo que escribe el contacto. Además quedan cuatro antítesis del tipo «no es X, es Y».

# Lo Mejor

- La tesis en tres casillas (calendario, riesgo, encaje) es clara, se entiende en cinco segundos y se puede aplicar mañana.
- La pregunta que lo aclara, repetida en resumen, cuerpo y FAQ. Es la frase citable.
- La cita del caso 3, «No sé si es lo que me encaja, yo quería otra cosa», está tal cual en el daily del 28-sep. Y el artículo admite que el fallo es nuestro. Eso es criterio propio.
- «Habían arrancado sin invertir en publicidad» y «le había gustado lo que vio» coinciden con el daily («arrancaron sin publicidad», «le encantó»).
- El 13 de octubre coincide con el daily del 27-sep.
- FAQ del schema idéntico al FAQ visible. Keyword en title, H1, URL, primera frase y breadcrumb. datePublished puesto. Tejido al pilar de seguimiento comercial y a dos artículos del cluster.
- CTA propio del tema («¿Cuántos «ahora no» tienes sin fecha?»), no genérico.

# Lo Más Débil

- Los casos están contados con más detalle del que tiene la fuente (citas, sentimientos, condiciones, «lo resolvimos»).
- No hay ni un dato con número. El estándar pide al menos uno. Lo hay en la fuente y no se usa: el trato de Gastón quedó en «Más adelante» con tareas el 10 de diciembre y el 17 de mayo de 2027. Es la prueba de que la regla «pon fecha» se aplica en casa.
- Un H2 vacío («Tres reuniones, tres «ahora no»») seguido de otro H2. Rompe la regla GEO de que cada H2 empiece con una respuesta.
- «Qué hacer en cada caso» es una comparación de tres cosas con criterios. El estándar la quiere en tabla.

# Problemas Críticos Detectados

**C1. Meta description y description del schema Article** (misma frase en los dos sitios). El tercer caso no consta como reunión ni como de la semana pasada.
- Falla: «Tres objeciones reales de mis reuniones de la última semana, lo que hay detrás de cada una y qué respondería en cada caso.»
- Propuesta: «Tres objeciones reales que nos han salido estos días con clientes, lo que hay detrás de cada una y qué respondería en cada caso.»

**C2. og:description.** Mismo motivo.
- Falla: «Tres reuniones, tres versiones de «ahora no».»
- Propuesta: «Tres conversaciones, tres versiones de «ahora no».»

**C3. Párrafo tras el lede.** El caso 3 llega en el daily del lunes 28 y sin reunión asociada (no está en reuniones_hoy).
- Falla: «Lo sé porque la semana pasada la oí en mis propias reuniones, en tres versiones distintas.»
- Propuesta: «En los últimos días nos ha salido tres veces, en tres versiones distintas.»

**C4. H2 vacío.** Afirma «tres reuniones» y no tiene texto debajo. Además, junto al «14 citas» del artículo del formulario (enlazado en «Sigue leyendo»), un «tres reuniones» invita a hacer la resta de plantones.
- Falla: «Tres reuniones, tres «ahora no»» (H2 sin párrafo)
- Propuesta: borrar el H2. El lector pasa directo al caso 1.

**C5. H2 del caso 1.** Cita entre comillas que la fuente no recoge. La fuente dice «le encantó» y «no es su momento».
- Falla: «Me ha encantado, pero no es mi momento»
- Propuesta: «Le encantó, pero no era su momento» (sin comillas)

**C6. H2 del caso 2.** Cita inventada. La fuente dice «arrancar más tarde con el cobro alineado».
- Falla: «Sí, pero quiero empezar más tarde»
- Propuesta: «Sí, con el arranque más tarde» (sin comillas)

**C7. Caso 2, primer párrafo.** La fuente no dice quién puso la condición ni que el cobro empiece «con el trabajo». Dice «miedo a pagar antes de tenerlo claro», no «antes de verlo funcionar». Y usa el «no era X. Era Y» prohibido.
- Falla: «Otra reunión acabó en un sí. Pero con una condición: arrancar más tarde y que el cobro empezara con el trabajo, no antes. Lo que frenaba no era la fecha. Era pagar algo que todavía no veía funcionar.»
- Propuesta: «Otra reunión acabó en un sí de palabra, con el arranque más tarde y el cobro alineado con ese arranque. Lo que pesaba era el miedo a pagar antes de tenerlo claro.»

**C8. Caso 2, segundo párrafo.** La fuente dice «sí verbal», no algo resuelto. Y dice «cobro alineado», no «el cobro también el 13». Es el mismo trato que el daily del 23-sep dio por cerrado y hubo que corregir el 25-sep.
- Falla: «Lo resolvimos moviendo las dos cosas juntas. El proyecto arranca el 13 de octubre y el cobro también.»
- Propuesta: «Quedamos así: arranca el 13 de octubre, con el cobro alineado con ese arranque y la propuesta de siempre. De momento es un sí de palabra.»
  («La propuesta de siempre» es el «propuesta estándar» del daily, y sostiene la frase siguiente sobre el descuento.)

**C9. Caso 3.** Sentimiento de Maikel que no está en ninguna fuente.
- Falla: «La tercera me dolió más, porque la culpa era nuestra.»
- Propuesta: «La tercera es culpa nuestra.»

**C10. Caso 3.** «Había entendido X, cuando lo que hacemos es Y» es el «no es X, es Y» disfrazado.
- Falla: «Había entendido que solo hacíamos seguimiento de ventas, cuando lo que hacemos es poner agentes en cualquier punto del recorrido donde se pierden clientes, desde que alguien pregunta hasta que compra.»
- Propuesta: «Se quedó con la idea de que hacemos seguimiento de ventas. Hacemos eso y bastante más: ponemos agentes en cualquier punto del recorrido donde se pierden clientes, desde que alguien pregunta hasta que compra.»

**C11. Lista «Si es calendario».** Antítesis «X, no Y».
- Falla: «Un mensaje, con algo útil, no un «¿qué tal?».»
- Propuesta: «Un solo mensaje, y que lleve algo útil.»

**C12. Lista «Si es riesgo».** Antítesis «no toques X. Toca Y».
- Falla: «no toques el precio. Toca cuándo se paga y cuánto se arriesga al principio:»
- Propuesta: «mueve cuándo se paga y cuánto se arriesga al principio, y deja el precio quieto:»

**C13. «Qué hacemos nosotros con esto».** Claim comprobado contra las fuentes:
- El copiloto existe desde el 27-sep. El daily dice «respuestas en copiloto (borrador a Maikel, nada automático)». `api/_agente.js` manda el borrador al móvil de Maikel con «Si te vale, cópialo y mándalo tú».
- Pero redacta la respuesta cuando el contacto escribe. No redacta el mensaje de una fecha apuntada.
- Es el sistema interno de Qualivo. Ninguna fuente dice que esté montado en el CRM de un cliente.
- Desde el 28-sep no vale para todos: a los contactos «precualificar» (niveles C y D) y a los «agente-auto» les contesta el agente solo.
- Tal como está, la frase une cosas que la fuente no une.
- Falla: «Montamos el seguimiento para que eso no dependa de la memoria de nadie, dentro del CRM que ya usas: la fecha queda apuntada con su tarea, y el agente te prepara el borrador del mensaje para que lo revises y lo envíes tú.»
- Propuesta: «En Qualivo lo hacemos así: el «ahora no» se queda en el CRM con su fecha y su tarea. Y desde el 27 de septiembre, cuando un contacto de los que llevo yo contesta por WhatsApp, el agente redacta la respuesta y me la pasa al móvil. Si me vale, la mando yo. Es el tipo de seguimiento que montamos dentro del CRM que ya usas.»
  (La última frase se apoya en /consultoria-ia/, «la IA preparando el contexto (scoring, historial, borradores)».)

# Qué Eliminaría

- El H2 vacío (C4).
- El cuarto punto de «En 30 segundos». Repite palabra por palabra el destacado. Mejor que el destacado sea la única vez que aparece.
- «Si hubiera respondido con un descuento, habría resuelto un problema que no tenía y dejado el que sí tenía.» Es una simetría perfecta que suena a frase hecha, y aparece también en el borrador y en la imagen del martes. En el artículo sobra si se aplica C8.

# Qué Simplificaría

- «Qué hacer en cada caso»: convertir la lista en `.post-tabla` con tres columnas («Lo que oyes», «Lo que suele haber detrás», «Qué haces»). Es lo que extraen los LLM y lo que pide el estándar para comparar.
- La regla y la FAQ 3 dicen lo mismo con la misma frase final («Una respuesta de una palabra vale más que tres recordatorios»). Dejarla en la regla y reformular la FAQ.

# Qué Reforzaría

- Dato con número, y además de casa. Al final del caso 1: «Quedó apuntado en el CRM con dos fechas: una tarea el 10 de diciembre y otra en mayo de 2027.» (daily del 25-sep). Convierte «pon fecha» en algo hecho, no solo aconsejado.
- Dos o tres respuestas literales para copiar. Es lo que busca quien teclea «ahora no es el momento». Por ejemplo, «¿Qué tendría que pasar para que sí lo fuera?» o «¿Te escribo el 10 de noviembre y lo vemos?».
- FAQ 4 («Casi nunca es la mejor palanca»): marcarla como opinión, por ejemplo «Mi recomendación: no empieces por el precio». «En mi experiencia» no vale, porque no hay fuente que lo respalde. El bus del 28-sep sí recoge una objeción de precio (reformas, «buscan lo barato»).

# Riesgos

- El sí es de palabra. Si se cae antes del 13-oct, el caso 2 queda desmentido en un artículo indexado. Con C8 el texto sigue siendo verdad pase lo que pase.
- `llms.txt` repite los dos claims de C1 y C8 («tres casos reales de reuniones de Qualivo de la última semana», «el arranque y el cobro movidos al 13 de octubre»). También `content/diario-contenido.md`. Hay que corregirlos igual. No los toco: fuera del encargo.
- Fuera de estas piezas sigue publicada la tasa de plantones «5 de 9» (por ejemplo en `blog/cliente-no-se-presenta-a-la-cita/` y en `llms.txt`). Ya se avisó el 28-sep y sigue igual.

# Impacto Esperado

Moderado y bien dirigido. «Ahora no es el momento» lo busca gente que vende y tiene contactos parados. Es el público del diagnóstico. El CTA («cuántos contactos están esperando un mensaje que nadie va a mandar») puede traer conversaciones de dueños con cartera dormida. Es la puerta más corta a un piloto de seguimiento.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Jerarquía correcta: eyebrow, H1 con keyword, lede con negrita, resumen oscuro, pnum 1-2-3, destacado y regla.
- Falla el H2 vacío (C4), que deja dos titulares seguidos.
- Falta `.post-caso` o `.post-tabla`. El caso 2 con su fecha pide un `.post-caso`. «Qué hacer en cada caso» pide una tabla.
- Párrafos cortos y se lee sin fatiga en el móvil.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: «la objeción más educada que existe» funciona y tiene gracia.
- Claridad: alta.
- Credibilidad: baja hoy por C5 a C9. Sube mucho con el dato de las tareas del CRM.
- CTA: bueno y conectado con el tema.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Habla de una fuga concreta (el «ahora no» sin fecha) y de sistema (CRM, tarea, borrador). Encaja con Qualivo.
- El caso 3 es un aviso estratégico: si se repite, el problema es cómo se explica Qualivo en la web y en los anuncios. Es la hipótesis del diario. Bien que el artículo lo admita.
- Acerca a pilotos si el lector sale pensando «yo tengo 20 de estos sin fecha».

# Versión Mejorada del Hook

«"Ahora no es el momento" es la objeción más educada que existe. En los últimos días nos ha salido tres veces, y ninguna quería decir lo mismo.»

# Próximo Experimento Recomendado

Durante 14 días, contar los diagnósticos pedidos desde este artículo frente a la media de los artículos de la guía de seguimiento comercial. Si supera la media, la siguiente pieza del cluster es «cómo hacer seguimiento a un "ahora no" sin agobiar», con la plantilla del mensaje.

# Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 2 · Reorientación de «Embudo de ventas»

`blog/embudo-de-ventas/index.html` · solo los dos párrafos bajo «Ya tengo el embudo dibujado. ¿Ahora qué?» y el post-cta

# Nota Global (1-10)

**8**. Buena reorientación: lleva el artículo de concepto a una fuga concreta y a un CTA con compromiso. Dos frases no encajan con lo que el propio artículo explica antes.

# Resumen Ejecutivo

El primer párrafo mantiene el enlace al funnel de ventas y lo acorta bien. El segundo mete la fuga del «ahora no» sin fecha y enlaza al artículo nuevo con un anchor natural. El post-cta pasa de la calculadora a «Pedir el diagnóstico» y se queda con un solo botón, que era lo que había que hacer. La promesa (quince minutos, plan por escrito en 24 horas) coincide con /diagnostico/.

Lo que falla es el encaje con lo anterior. El artículo define cinco etapas: visita, lead, oportunidad, venta, repetición. No existe una flecha «de reunión a cliente», y la última flecha del artículo es venta → repetición. Además, «el embudo parece sano» contradice la regla del propio artículo: si cuentas personas que pasan, los «ahora no» ya se ven como oportunidades que no pasan a venta. Solo parecen «sanos» si cuentas ocupación, que es el error 1 del artículo. Bien usado, eso es un enlace con lo anterior mejor todavía.

# Lo Mejor

- Un solo botón, conectado al tema («¿Por qué flecha se te escapa el dinero?» con «Salimos con la flecha que más te cuesta»).
- La fuga elegida es real, de la cartera de Qualivo, y se explica en una frase.
- Enlace interno natural al artículo nuevo y al funnel de ventas.
- Sin cifras nuevas que verificar, sin nombres, sin rayas ni punto y coma en lo nuevo.

# Lo Más Débil

- La etapa inventada «reunión» en un artículo que acaba de listar las cinco etapas.
- «Parece sano» choca con la regla de contar paso y no ocupación.

# Problemas Críticos Detectados

**C1. Etapa que no existe en el artículo.**
- Falla: «Mira con cuidado la última flecha, la de reunión a cliente.»
- Propuesta: «Mira con cuidado la flecha de oportunidad a venta.»

**C2. Contradice la regla del propio artículo.** Contando paso, el «ahora no» sí se ve.
- Falla: «No se cuentan como «no», así que el embudo parece sano mientras se vacía.»
- Propuesta: «Nadie los cuenta como «no»: se quedan como oportunidades abiertas. Y si cuentas ocupación en vez de paso, el error 1, el embudo parece lleno mientras se vacía.»

# Qué Eliminaría

- «que no sale como pérdida en ningún informe»: «ningún» es absoluto y no hace falta. «que no sale como pérdida en el informe» dice lo mismo.

# Qué Simplificaría

- El segundo párrafo tiene tres ideas (la flecha, el artículo nuevo, el diagnóstico). El enlace «en quince minutos» repite el post-cta que viene justo después. Se puede quitar la última frase del párrafo y dejar que lo haga el post-cta.

# Qué Reforzaría

- Fuera del alcance de esta revisión, pero afecta al encaje: el eyebrow «Conceptos, sin humo» va contra la regla del 22-sep («Sin humo» es uno de los ejemplos vetados). Y el texto antiguo tiene rayas largas y punto y coma (lede, definición, FAQ). Recomiendo una pasada aparte.

# Riesgos

- El diario del 29-sep describe la reorientación como «la flecha de reunión a cliente». Si se corrige C1, conviene corregir también el diario.

# Impacto Esperado

Positivo. Un artículo de definición con tráfico informativo ahora empuja a un problema concreto y a un diagnóstico, en vez de a una calculadora. Menos clics, más cerca de conversaciones.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Sin cambios visuales. El post-cta con un solo botón gana claridad. Los dos párrafos nuevos caben en cuatro líneas en móvil.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Claridad buena.
- Credibilidad tocada por C1: un lector que acaba de leer la tabla de etapas busca la flecha «reunión → cliente» y no la encuentra.
- CTA claro.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Alineada: habla de fugas entre etapas, que es la propuesta de Qualivo, y teje el cluster hacia el artículo de la objeción y el diagnóstico.

# Versión Mejorada del Hook

(Del párrafo nuevo) «Mira con cuidado la flecha de oportunidad a venta. Ahí se quedan los "ahora no" que nadie apunta con fecha.»

# Próximo Experimento Recomendado

Comparar durante 14 días los clics al diagnóstico desde este artículo frente a los clics a la calculadora del mismo periodo anterior. Si bajan los clics pero suben los diagnósticos pedidos, aplicar el mismo cambio a los demás artículos de definición.

# Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 3 · Borrador de redes del martes «Sí. Pero más tarde.» (ficha, LinkedIn, Instagram e imagen)

`content/borradores/2026-09-29-objecion-si-pero-mas-tarde.md` · `content/infografias/2026-09-29/si-pero.png`

# Nota Global (1-10)

**6**. La ficha es honesta (sí verbal, qué no se cuenta, qué pasa si se cae). El texto va más lejos que la fuente.

# Resumen Ejecutivo

La ficha resume bien el dato: «una reunión celebrada acabó en un sí verbal», arranque el 13-oct, «el miedo a pagar antes de tenerlo claro», «arrancando más tarde con el cobro alineado». Y deja escrito el riesgo del sí de palabra.

El texto de LinkedIn, el pie y la imagen añaden lo que la fuente no dice:
- una cita entre comillas («Sí. Pero más tarde.»);
- que le encajaba todo lo que se le enseñó;
- que ella pidió que el cobro empezara con el trabajo;
- que el cobro es el 13 de octubre;
- que se resolvió.

Cambian «tenerlo claro» por «verlo funcionar», que es otra cosa: una es entenderlo y la otra es ver resultados. Hay dos antítesis prohibidas. Y cierra con «casi siempre no tiene que ver con el precio», sin dato y en contra del bus del 28-sep, que recoge una objeción de precio.

La imagen abre con el nombre de la serie, lo que la regla del 22-sep pide evitar.

# Lo Mejor

- La ficha: dato con fuente, acierto primero, lo que no se cuenta (nombre, sector, importe) y el riesgo por escrito.
- «Sin tocar el precio» está respaldado: el daily del 27-sep dice «propuesta estándar».
- La pregunta final de LinkedIn («¿Qué es lo último que te pidieron para decir que sí, y no era un descuento?») invita a contar casos reales.
- La imagen: titular potente, «PERO» en naranja, el tachado de «Un descuento» se entiende al primer vistazo.
- Enlaza con el artículo del día.

# Lo Más Débil

- Se cuenta la reunión como si Maikel la estuviera citando de memoria, con detalles que no están en ninguna fuente.
- La lección final generaliza desde un caso.

# Problemas Críticos Detectados

**C1. Cita entre comillas que nadie dijo** (LinkedIn e Instagram).
- Falla (LinkedIn): ««Sí. Pero más tarde.» / Así acabó una de mis reuniones de la semana pasada.»
- Propuesta: «Sí, pero más tarde. / Así acabó una de mis reuniones de la semana pasada: un sí de palabra, con el arranque más tarde.»
- Falla (Instagram): ««Sí. Pero más tarde.»»
- Propuesta: «Sí, pero más tarde. Así acabó una reunión de la semana pasada.»

**C2. Detalle inventado de la reunión** (LinkedIn, Instagram e imagen).
- Falla (LinkedIn): «Le encajaba todo lo que le enseñé.»
- Falla (Instagram e imagen): «Le encajaba todo.»
- Propuesta: borrar la frase en los tres sitios.

**C3. Cambia lo que dice la fuente y usa «no era X. Era Y»** (LinkedIn, Instagram e imagen). La fuente dice «el miedo a pagar antes de tenerlo claro».
- Falla (LinkedIn): «Lo que la frenaba no era la fecha. Era pagar antes de verlo funcionar.»
- Falla (Instagram e imagen): «Lo que frenaba era pagar antes de verlo funcionar.»
- Propuesta (los tres): «Lo que pesaba era el miedo a pagar antes de tenerlo claro.»

**C4. Atribuye una petición que la fuente no atribuye y usa «no me pidió X, me pidió Y»** (LinkedIn, Instagram e imagen). La fuente no dice quién propuso alinear el cobro.
- Falla (LinkedIn): «Pero no me lo había pedido. Me había pedido otra cosa: que el cobro empezara con el trabajo.»
- Propuesta: «Aquí el precio se quedó como estaba, la propuesta de siempre. Lo que se movió fue el cobro, alineado con el arranque.»
- Falla (Instagram): «No pedía un descuento. Pedía que el cobro empezara con el trabajo. Movimos las dos cosas al 13 de octubre.»
- Propuesta: «El precio, el de siempre. Lo que se movió fue el cobro, alineado con un arranque el 13 de octubre.»
- Falla (imagen): «Lo que no pedía: Un descuento» / «Lo que pedía: Que el cobro empezara con el trabajo. Arranque y cobro, los dos el 13 de octubre.»
- Propuesta (imagen): «Lo que no se tocó: el precio» (sin tachado) / «Lo que se movió: el arranque, al 13 de octubre, y el cobro, alineado con él.»

**C5. Da por hecho un cobro el 13-oct y oculta que es un sí de palabra** (LinkedIn).
- Falla: «Así que movimos las dos cosas juntas. Arranque el 13 de octubre, y el cobro también el 13 de octubre.»
- Propuesta: «Arranca el 13 de octubre, con el cobro alineado con ese arranque. De momento es un sí de palabra.»

**C6. Generalización sin dato y contradicha por el bus** (LinkedIn e Instagram). El 28-sep se registra la objeción «clientes que piden 6-7 presupuestos y buscan lo barato».
- Falla (LinkedIn): «Casi siempre la respuesta no tiene nada que ver con el precio.»
- Propuesta: «Esta vez no tenía que ver con el precio.»
- Falla (Instagram): «Casi nunca es el precio.»
- Propuesta: «Esta vez no era el precio.»

**C7. Rótulo de serie en la imagen** (regla del 22-sep: nada de nombres de serie que suenen a plantilla, la pieza empieza por lo que pasó).
- Falla (imagen, primera línea): «LA OBJECIÓN DE LA SEMANA»
- Propuesta: «UNA REUNIÓN DE LA SEMANA PASADA», y la línea de debajo pasa a «Un sí de palabra. Lo que pesaba era el miedo a pagar antes de tenerlo claro.»

# Qué Eliminaría

- «Si le hubiera bajado el precio, habría resuelto un problema que no tenía y dejado el que sí tenía.» Simetría perfecta, suena a frase hecha. En la imagen ocupa el pie y se puede sustituir por la pregunta del artículo: «¿Qué tendría que pasar para que sí fuera el momento?».
- Los hashtags genéricos (#negocios, #pymes) no aportan nada. Se pueden quitar sin perder nada.

# Qué Simplificaría

- «Me llevo una pregunta para la próxima vez que alguien me diga "ahora no"» afirma algo que Maikel hará. Mejor en opinión: «La pregunta que yo haría ante un "ahora no": ¿qué tendría que pasar para que sí fuera el momento?».
- «Lo que la frenaba» dice el género del cliente. No identifica a nadie, pero la ficha quiere contar lo mínimo. «Lo que pesaba» lo evita (C3).

# Qué Reforzaría

- La honestidad del «de palabra» es un punto a favor en LinkedIn. Nadie cuenta un sí antes de que se firme. Dicho así, suma credibilidad.
- En la imagen hay un hueco vacío de unos 180 px entre el bloque negro y la línea naranja. Se puede subir el pie o dar más cuerpo al bloque negro.

# Riesgos

- Sí de palabra en el mismo trato que el 23-sep se dio por cerrado y el 25-sep hubo que corregir («no ha firmado ni pagado»). La ficha ya dice que si se cae, la pieza no sale o sale contándolo. Mantenerlo.
- «La semana pasada» caduca. Si LinkedIn sigue en pausa y sale la semana que viene, hay que cambiarlo a «hace dos semanas» o poner la fecha.

# Impacto Esperado

Bueno para conversaciones. Alinear cobro y arranque es un tema que cualquier dueño con servicios recurrentes ha vivido, y la pregunta final invita a contarlo. Puede abrir mensajes privados de gente que duda en contratar, que es el paso previo a un diagnóstico.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- Portada: el titular para el scroll y es específico.
- Jerarquía: titular, contexto, contraste tachado/negro, pie. Clara.
- Ritmo: bien, salvo el hueco vacío antes del pie.
- Legibilidad: buena en 1080 × 1350. El gris del contexto se lee.
- Falla el rótulo de serie arriba (C7).

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook: fuerte, pero es una cita que no existe (C1).
- Claridad: alta.
- Credibilidad: hoy baja por C2 a C6. Con los cambios, alta y además honesta.
- CTA: pregunta de conversación, adecuada al objetivo de la ficha.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Alineada: la fuga está en la etapa reunión → cliente, y la pieza enseña cómo se tapó sin tocar el precio. Acerca a conversaciones con gente que vende servicios.

# Versión Mejorada del Hook

«Sí, pero más tarde. Así acabó una de mis reuniones de la semana pasada. Y el precio no se tocó.»

# Próximo Experimento Recomendado

Publicarlo cuando se levante la pausa y contar en 7 días los mensajes privados que pregunten por cómo alinear cobro y arranque. Si hay tres o más, la siguiente pieza de la serie es sobre cómo se hace en la práctica, con la condición de que el 13-oct haya arrancado de verdad.

# Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 4 · Corrección de ayer (artículo del formulario y versión 2 del post del lunes)

`blog/formulario-de-facebook-o-landing-page/index.html` («En 30 segundos» y la sección «Lo que probé el 27 de septiembre (y por qué lo paré al día siguiente)») · `content/borradores/2026-09-28-agentizando-dos-preguntas.md` (Versión 2)

# Nota Global (1-10)

**6**. La dirección es correcta: se admite que el formulario con precio se paró al día siguiente. Pero el hueco del «por qué» se rellena con un razonamiento que Maikel no dejó escrito, y se promete una prueba que en realidad ya se montó y se pausó el mismo lunes.

# Resumen Ejecutivo

Lo que dicen las fuentes del 28-sep, en orden:
1. «Pon 20 en la que funcionaba y 15 a esta nueva hipotesis». Vuelve el anuncio de la semana pasada con el formulario antiguo a 20 €/día. El formulario con precio pasa a un conjunto aparte, con el mismo creativo, a 15 €/día. Es decir, la prueba en paralelo se montó.
2. «Dejalo todo como estaba la semana pasada y reactiva». El conjunto del experimento se pausa. «Experimento del precio en pausa».

Las dos versiones corregidas dicen que se volvió al formulario de antes (bien). Pero añaden un motivo inventado («cambiarle las preguntas en mitad de la semana era jugarme lo que funcionaba»). Presentan la prueba en paralelo como algo futuro («Cuando la haga», «Eso es lo que haré»). En la versión 2 aparece una opinión que nadie ha dicho («La idea era buena, o eso creo todavía»). Y el «añadí dos preguntas» contradice la decisión del 26-sep: «SUSTITUIR la pregunta de inversión, no añadir».

La regla de Maikel (primero el acierto con dato, después el fallo, corto) se cumple a medias. El punto del «En 30 segundos» cuenta el fallo y da el acierto sin dato. Y el dato existe: el daily del 27-sep dice que el único sí entró por el formulario de antes.

# Lo Mejor

- Corregir al día siguiente y en el mismo artículo, con el cambio a la vista en el H2, es lo que da credibilidad al blog.
- Las fechas son correctas: domingo 27 se puso, lunes 28 se quitó.
- «El que funcionaba» es la palabra de Maikel. Usarla es lo más honesto.
- La versión 2 cierra con una buena pregunta de conversación («¿Tú cambias lo que funciona para probar algo, o lo pruebas al lado?»).
- La versión 2 mantiene el acierto con dato (12 de 14 citas) antes del fallo (14 de 20 con menos de 500 €).
- Sin cifra de plantones, sin nombres, sin rayas ni punto y coma.

# Lo Más Débil

- Se explica el porqué con una frase que suena bien y no tiene fuente.
- Se omite que la prueba en paralelo llegó a montarse, que es justo lo más interesante.

# Problemas Críticos Detectados

**Artículo del formulario**

**C1. «En 30 segundos», cuarto punto.** Acierto sin dato, y un plan futuro que la fuente no dice. La fuente dice «experimento del precio en pausa».
- Falla: «El 27 de septiembre probé a cambiar las preguntas: cuándo quiere empezar y si le encaja el precio de entrada. Al día siguiente volví al formulario de antes, porque era el que estaba trayendo reuniones. Las dos preguntas quedan para una prueba en paralelo.»
- Propuesta: «El formulario de antes es el que funcionaba: el único sí que ha salido de mis anuncios entró por él. El 27 de septiembre le cambié dos preguntas, cuándo quiere empezar y si le encaja el precio de entrada, y al día siguiente volví al de antes. La versión nueva está en pausa.»

**C2. Sección, último párrafo.** Motivo inventado.
- Falla: «El anuncio con el formulario viejo era el que estaba trayendo reuniones, y cambiarle las preguntas en mitad de la semana era jugarme lo que funcionaba para probar una idea.»
- Propuesta: «El anuncio con el formulario viejo era el que funcionaba: el único sí que ha salido de mis anuncios entró por él.»

**C3. Sección, último párrafo.** Promete una prueba que ya se montó y se pausó el 28-sep.
- Falla: «La prueba buena es la otra: el mismo anuncio con los dos formularios a la vez, cada uno con su dinero, y comparar las reuniones que se celebran. Cuando la haga, lo contaré aquí, salga bien o salga mal.»
- Propuesta: «Ese mismo lunes llegué a montarlo así: el formulario de antes con 20 € al día y el nuevo en un conjunto aparte, con el mismo anuncio y 15 €. Poco después lo dejé todo como estaba la semana anterior, y el formulario nuevo quedó en pausa. La comparación limpia sería esa: los dos formularios a la vez, cada uno con su dinero, contando reuniones celebradas.»

**Versión 2 del post del lunes**

**C4. Generaliza a todos los anuncios.** El cambio fue solo en el formulario de formación.
- Falla: «El domingo puse el precio en el formulario de mis anuncios. El lunes lo quité.»
- Propuesta: «El domingo puse el precio en el formulario de uno de mis anuncios. El lunes lo quité.»

**C5. Opinión de Maikel inventada.**
- Falla: «La idea era buena, o eso creo todavía.»
- Propuesta: borrar. El párrafo empieza en «El formulario me trae citas: …».

**C6. Contradice la decisión del 26-sep** («SUSTITUIR la pregunta de inversión, no añadir»).
- Falla: «Así que añadí dos preguntas: cuándo quiere empezar y si le encaja el precio de entrada.»
- Propuesta: «Así que cambié la pregunta de cuánto invierte por dos nuevas: cuándo quiere empezar y si le encaja el precio de entrada.»

**C7. Motivo inventado** (igual que C2).
- Falla: «¿Por qué lo quité? Porque el anuncio con el formulario de antes era el que estaba trayendo reuniones. Cambiarle las preguntas en mitad de la semana era jugarme lo que funcionaba para probar una idea.»
- Propuesta: «¿Por qué lo quité? Porque el anuncio con el formulario de antes era el que funcionaba: el único sí que ha salido de mis anuncios entró por él.»

**C8. Promesa de algo que ya pasó** (igual que C3).
- Falla: «La prueba buena es otra: el mismo anuncio con los dos formularios a la vez, cada uno con su dinero, y contar las reuniones que se celebran. Eso es lo que haré.»
- Propuesta: «El mismo lunes llegué a montarlo al lado: el formulario nuevo en un conjunto aparte, con el mismo anuncio y 15 € al día. Poco después lo pausé también y lo dejé todo como la semana anterior. Ahora está en pausa.»

# Qué Eliminaría

- En la versión 2: la opinión inventada (C5).
- En la cabecera del borrador: la frase «La imagen sigue valiendo si se quita «desde el 27 de septiembre»». Si la versión 2 sale con la imagen del 28-sep, conviene revisar que esa imagen no presente las dos preguntas como el formulario actual.

# Qué Simplificaría

- Versión 2: «Con las respuestas, el sistema sube o baja la nota del contacto, y la nota decide quién le llama» va en presente, y el formulario con esas preguntas está en pausa. Mejor en pasado: «Con las respuestas, el sistema subía o bajaba la nota del contacto».
- Artículo: el primer párrafo de la sección sigue en presente («Cambié las preguntas… Quité la de cuánto invierte»). Está bien. El párrafo de «La idea es sencilla» también podría ir en pasado para que no parezca activo.

# Qué Reforzaría

- El dato del único sí (daily del 27-sep) es el acierto con dato que pide la regla. Sirve igual en el artículo y en el post.
- Contar que se llegó a montar la prueba al lado y se pausó el mismo día hace la historia más verdadera y más interesante. Enseña que decidir con caja justa también es parte del sistema.

# Riesgos

- Si el «Cuando la haga, lo contaré aquí» se queda, el blog promete un resultado que quizá no llegue. El diario del 28-sep ya prometía «la segunda parte del post el lunes 5 de octubre». Con el experimento en pausa, esa promesa hay que retirarla también.
- «El único sí» es el sí de palabra del 13-oct. Si se cae, la frase sigue siendo verdad a fecha de publicación, pero conviene revisarla ese día.
- Cuidado con no añadir cuántas reuniones se celebraron por cada vía: junto a las 14 citas deja deducir la tasa de plantones.

# Impacto Esperado

La corrección protege la credibilidad del blog, que es de lo que viven los diagnósticos. La versión 2 del post, con la historia completa, puede generar más conversación que la primera. «Lo monté al lado y lo pausé a las pocas horas» es una decisión que cualquier dueño con caja justa reconoce.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- El H2 nuevo es largo pero claro. Se entiende que hay una corrección.
- El «En 30 segundos» queda con un punto de tres frases, más largo que los otros. Con C1 se queda en tres frases cortas.
- Sin cambios visuales en la versión 2 (texto de LinkedIn).

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- Hook de la versión 2 («El domingo puse el precio… El lunes lo quité.»): muy bueno, empieza por lo que pasó.
- Claridad alta.
- Credibilidad baja hoy por C2, C3, C5 y C7. Con los cambios, alta.
- CTA: la pregunta final de la versión 2 funciona.

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- Encaja con la serie «Agentizando mi propia empresa»: enseña el sistema de Qualivo por dentro, con decisiones reales.
- Aporta a conversaciones porque es una historia de decisión, no de herramienta.
- Riesgo estratégico: prometer experimentos que luego no se hacen resta confianza semana a semana.

# Versión Mejorada del Hook

«El domingo puse el precio en el formulario de uno de mis anuncios. El lunes lo quité. Y lo que funcionaba volvió a tener todo el dinero.»

# Próximo Experimento Recomendado

No es de contenido. Si Maikel decide retomar el formulario con precio, hacerlo en paralelo desde el primer día y fijar la fecha de lectura (7 días, coste por reunión celebrada por conjunto). Y solo entonces anunciar en el blog que se contará el resultado.

# Veredicto: PUBLICAR CON CAMBIOS

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| 1 · Artículo «Ahora no es el momento» | 6 | PUBLICAR CON CAMBIOS | 13 |
| 2 · Reorientación «Embudo de ventas» (dos párrafos y post-cta) | 8 | PUBLICAR CON CAMBIOS | 2 |
| 3 · Borrador del martes «Sí. Pero más tarde.» + imagen | 6 | PUBLICAR CON CAMBIOS | 7 |
| 4 · Corrección de ayer (formulario + versión 2 del lunes) | 6 | PUBLICAR CON CAMBIOS | 8 |

Fuera del encargo, sin tocar: `llms.txt` y `content/diario-contenido.md` repiten los claims de la pieza 1 (C1 y C8) y de la pieza 2 (C1). Y la tasa de plantones «5 de 9» sigue publicada en los sitios avisados el 28-sep.
