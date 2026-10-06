# Revisión Qualivo Master Reviewer · 6-oct-2026 · Home V3 (prototipo)

> Pieza: `home-nueva/v3/index.html` (noindex), con el copy del HTML y de las
> cadenas del JS. Capturas en `content/marca/home-v3/` (desk-1 a desk-4, movil-1
> a movil-4). Revisada con `content/agentes/prompt-qualivo-master-reviewer.md`
> (incluida la §13), las reglas R1 a R18 de `content/content-os-v1.md` §3 y las
> decisiones de `content/web-v2/decisiones-p0.md`. Responde a la revisión
> «QUALIVO WEB V2», que pedía tres piezas: hero vivo, recorrido vivo e
> Intelligence como ficha de decisión.
>
> Los números de línea son del HTML. No he tocado el HTML.

## Fuentes contrastadas (R2: lo que la página dice que hace el sistema)

| Claim de la página | Dónde | Fuente | Veredicto |
|---|---|---|---|
| Entra «Domingo, 23:47» y el agente contesta a las 23:51. «WhatsApp en minutos» | hero, l. 237-238 y JS l. 391-392 | `api/_horario.js` l. 5-6 y 34: «WhatsApp todos los días, de 8:00 a 21:30. Fuera, no se envía: se programa para las 8:00 (quiet_hours)». `api/_agente.js` l. 484: «De 21:30 a 8:00 no se escribe a nadie». `api/activacion.js` l. 392: «A/B con 10 min de supervisión» | **Falso hoy.** A las 23:47 no sale nada hasta las 8:00. Y un lead con «encaje 82» es A/B, así que su primer WhatsApp sale a los 10 minutos, no a los 4. `decisiones-p0.md` §8.1 ya dice que «de noche y en fin de semana» está sin confirmar con Growth |
| «con los mensajes que tú has aprobado» · «con un mensaje aprobado» | l. 290 y JS l. 392 | `api/activacion.js` l. 21-31: el primer WhatsApp es «personalizado con IA» a partir del formulario. `api/_agente.js` l. 466-473: `COPILOTO = false`, «el agente contesta solo dentro de su perímetro» | **Falso.** No hay biblioteca de mensajes aprobados. Hay un perímetro de lo que puede decir |
| «Hace las preguntas que faltan y deja en la ficha su nota de encaje y el motivo» | l. 296 | `api/_scoring.js` l. 1-25 (campos «Score · Tipología / Comportamiento / Nivel / Motivo»). `api/_agente.js` l. 466-471 (cualificar está en el perímetro) | **Se sostiene.** Ojo: la nota real es 0-10 más letra A-D. El 82 sobre 100 es de la demo de Intelligence. Vale como ejemplo |
| «Escribe cuando toca y avisa cuando una oportunidad lleva demasiado tiempo quieta» | l. 302 | `api/seguimientos.js` l. 1-5 (cron 7:15 entre semana, `vercel.json` l. 191): crea una tarea por oportunidad parada y «No manda nada al cliente». `api/activacion.js` l. 58: `REENGANCHE_PAUSADO = true` | **La mitad.** «Avisa cuando lleva demasiado tiempo quieta» es verdad. «Escribe cuando toca», aplicado a presupuestos y a «ahora no», no lo es: el reenganche está apagado |
| «Confirma con una pregunta que pide respuesta y, si no llega, le ofrece otra hora ese mismo día» | l. 308 y JS l. 394 | `api/_cita.js` l. 46-52: confirmación al reservar, sin pregunta. `api/_recordatorios.js` l. 1-8: el mismo día a las 9:00, la hora y el enlace. La víspera pide confirmación «solo si se reservó con dos o más días de antelación» | **Falso en la segunda mitad.** No hay nada que ofrezca otra hora si no confirma. Y en el ejemplo la cita se coge el lunes para el martes, así que no habría víspera |
| «Prepara el resumen de la reunión para quien no estuvo» | l. 314 | Nada en `api/`. `api/vapi-fin.js` resume las llamadas de Raquel, no reuniones de venta. `intelligence/js/reunion.js` es una ficha previa a la reunión en la demo, con datos ficticios | **Sin respaldo.** Lo de «recuerda el siguiente paso» sí: `api/seguimientos.js` l. 60 («Cinco días sin respuesta a la oferta») |
| «Vuelve a escribir cuando toca, con un motivo concreto para cada uno» | l. 320 | `api/reactivacion.js` l. 1-6: busca dormidos, les da un motivo **por grupo** y «deja la tarea preparada con el mensaje». No está en los cron de `vercel.json` | **Exagerado.** No escribe: prepara. Y el motivo es por grupo, no uno para cada persona |
| «Ha abierto el presupuesto tres veces» | JS l. 395, 451, 452 | Solo existe en la demo (`intelligence/js/motor.js`, señal `propVista`). En `api/` solo se cuentan aperturas de los correos de la radiografía (`api/resend-evento.js`) | **Sin respaldo** como capacidad del sistema |
| «Ha visitado la página de precios esta semana» | JS l. 457 | `api/visita.js` solo avisa de visitas a `/para/<empresa>/` (outbound) | **Sin respaldo** para la web de un cliente |
| «Apunta de qué anuncio o campaña viene» · «La venta queda unida al anuncio del que vino» | l. 284, JS l. 396 | `api/lead.js` l. 99 (origen y UTM en la ficha), `api/meta-evento.js` l. 4 y 65 (Purchase con valor al ganar la oportunidad) | **Se sostiene** |
| «En una pantalla, encima del CRM que ya tienes» | l. 331 | `intelligence/README.md`: la demo usa datos ficticios. El modo real solo lee nuestro GHL. `decisiones-p0.md` §5 lo pone como «guía interna» | **Sin respaldo hoy** para «el CRM que ya tienes» (cualquiera) |
| «Encaje, intención y riesgo van de 0 a 100 y se calculan con lo que hace cada contacto» | l. 358 | `intelligence/js/motor.js` l. 436-440: el encaje sale de las reglas de perfil (`rg.fit`), no del comportamiento | **Impreciso.** El encaje es cómo es, no lo que hace |
| Diagnóstico de 30 minutos y plan por escrito en 24 horas | l. 207 y 369 | `diagnostico/index.html`: «30 minutos. Te mandamos el plan por escrito en 24 horas, lo hagas con nosotros o no» | **Correcto** |
| Precio o garantía en la pieza | toda la página | Ninguno | **Cumple R10.** El destino del CTA sí los tiene (ver Riesgos) |

---

# Nota Global (1-10)

**6/10.** La estructura es la que pedía la revisión y está bien resuelta: hero que se mueve, recorrido con ficha que cambia y una ficha de decisión creíble. Pero el copy describe un sistema que hoy no existe en seis puntos (R2), y hay un «no es X, es Y» disfrazado en el titular de la sección central (R11). Todo se arregla cambiando texto, sin tocar el diseño.

# Resumen Ejecutivo

La página hace lo que tiene que hacer una home de Qualivo: enseña una oportunidad recorriendo el sistema, dice en qué punto se rompe cada etapa y lleva a un único destino (`/diagnostico/`). El diseño es de lo mejor que hemos hecho. El problema está en la letra pequeña de los ejemplos. El hero contesta un WhatsApp a medianoche, cuando nuestro sistema calla de 21:30 a 8:00. El recorrido promete mensajes aprobados, reprogramar citas el mismo día, resúmenes de reunión y reactivaciones que escriben solas, y nada de eso está en `api/` hoy. Como la pieza entera se vende con «mira cómo funciona», cada una de esas frases es una promesa que el piloto tiene que cumplir. Arreglando los once críticos (todos de texto), la página puede pasar a Maikel.

# Lo Mejor

- **El hero se entiende en 5 segundos.** «Convierte más de las oportunidades que ya estás generando» más una oportunidad que avanza por seis pasos. Problema, mecanismo y CTA en la primera pantalla.
- **«Lo hace el agente / Lo decide tu equipo» en cada etapa.** Es la mejor respuesta que tenemos a «la IA me va a quitar el control», sin decirlo.
- **Las frases en coral de cada etapa** («El formulario dice que encaja, y en la reunión descubres que no», «Quien decide no estaba en la reunión») pasan el test R13. Un director comercial piensa «esto me pasa a mí».
- **Intelligence como ficha de decisión** (oportunidad, tres notas, señales, siguiente acción y porqué), exactamente como pide `decisiones-p0.md` §5.
- **Un solo destino de conversión** y el secundario («Ver cómo funciona») es un ancla, como dice la decisión §3.
- **Ejemplos etiquetados** en el hero, la ficha del recorrido y la lista de Intelligence. Respeta `prefers-reduced-motion`.
- **Sin precio, sin garantía, sin raya larga, sin punto y coma** en el copy.

# Lo Más Débil

- **R2 en el recorrido.** Cuatro de las siete cajas «Lo hace el agente» describen cosas que el sistema no hace hoy (respuesta con mensajes aprobados, reprogramar el mismo día, resumen de reunión, reactivación que escribe sola).
- **El momento de más impacto del hero es el que no es verdad:** el WhatsApp a las 23:51 de un domingo.
- **Sin prueba.** No hay ni un caso ni un dato real en la página. `decisiones-p0.md` §6 lo explica (faltan permisos, R6), pero hoy la credibilidad descansa solo en la demo.
- **Móvil:** la ficha fija del recorrido y la cabecera de dos líneas se comen casi el 40 % de la pantalla y tapan el titular de cada etapa (captura `movil-3-recorrido-4.png`, donde solo se ve «a llamar.»).
- **Intelligence mezcla sectores** (academia, clínica dental, consultoría, reformas) en la lista de un mismo negocio. Ningún dueño tiene esa bandeja.

# Problemas Críticos Detectados

Todos bloquean el paso a Maikel. Ninguno pide cambiar el diseño.

**C1 · R2 · Hero de noche (l. 237-238, JS l. 391-393).**
«Domingo, 23:47» · «WhatsApp en minutos» · registro «23:51 · Le contesta por WhatsApp…».
Nuestro sistema no escribe de 21:30 a 8:00, y a los A/B les da 10 minutos de supervisión.
Cambio:
- Paso 1: «Domingo, 19:40».
- Paso 2: «WhatsApp a los 10 minutos».
- Registro: «19:40 · Entra una petición desde un anuncio…», «19:50 · Agente · Le escribe por WhatsApp…», «19:56 · Agente · Con sus respuestas…».

**C2 · R2 · «Mensajes aprobados» (l. 290 y JS l. 392).**
«Contesta por WhatsApp en minutos, con los mensajes que tú has aprobado, y resuelve las dudas básicas.» y «Le contesta por WhatsApp con un mensaje aprobado y le pregunta…».
Cambio:
- l. 290: «Contesta por WhatsApp en minutos, dentro de tu horario, con un primer mensaje hecho a partir de lo que puso en el formulario, y resuelve las dudas básicas.» Tu equipo: «Qué puede decir el agente, qué no y a qué horas escribe.»
- JS l. 392: «Le escribe por WhatsApp a partir de lo que puso en el formulario y le pregunta qué curso busca y cuándo quiere empezar.»
- JS l. 420 (ficha): «Contestar en minutos, por WhatsApp.» pasa a «Escribirle por WhatsApp a partir de lo que puso en el formulario.»

**C3 · R2 · Seguimiento (l. 302).**
«Escribe cuando toca y avisa cuando una oportunidad lleva demasiado tiempo quieta.»
El aviso es verdad (`api/seguimientos.js`). La parte de escribir, no: el reenganche está apagado.
Cambio: «Avisa a tu equipo cuando una oportunidad lleva demasiado tiempo quieta y le deja escrito el siguiente paso.»

**C4 · R2 · Cita (l. 308 y JS l. 394).**
«Confirma con una pregunta que pide respuesta y, si no llega, le ofrece otra hora ese mismo día.» y «Le confirma con una pregunta que pide respuesta, y contesta que sí.»
Cambio:
- l. 308: «Confirma la cita en cuanto se reserva, el mismo día le recuerda la hora y, si reservó con días de antelación, la víspera le pide que confirme.»
- JS l. 394: «Ha cogido cita para el martes a las 10:00. Le llega la confirmación al momento.»

**C5 · R2 · Venta (l. 314).**
«Prepara el resumen de la reunión para quien no estuvo y recuerda el siguiente paso.»
No hay nada en `api/` que resuma reuniones de venta.
Cambio: «Deja en la ficha lo que contó en cada paso, para que tu equipo se lo pueda pasar a quien decide, y avisa si la propuesta se queda sin respuesta.»

**C6 · R2 · Reactivación (l. 320).**
«Vuelve a escribir cuando toca, con un motivo concreto para cada uno.»
`api/reactivacion.js` prepara la tarea con el mensaje y agrupa por motivo. No escribe.
Cambio: «Encuentra a quien merece un segundo intento y le deja preparado el mensaje, con un motivo distinto según lo que pasó.»

**C7 · R2 · Señales que no medimos (JS l. 395, 451, 452 y 457).**
«Ha abierto el presupuesto tres veces», «Ha abierto el presupuesto 3 veces desde ayer», «el presupuesto revisado», «Ha visitado la página de precios esta semana».
No seguimos aperturas de presupuestos ni visitas a la web del cliente.
Cambio:
- JS l. 395: «Después de la cita ha escrito para preguntar por la financiación. <b>Siguiente acción: llamar antes de las 13:00.</b>»
- JS l. 451: la primera señal pasa a «Ha escrito dos veces desde ayer».
- JS l. 452: «<b>Por qué:</b> intención muy alta y ha vuelto a escribir, pero lleva dos días sin respuesta de una persona.»
- JS l. 457: «Ha visitado la página de precios esta semana» pasa a «Dio el motivo: esperar al presupuesto de octubre». En l. 458, el porqué queda «encaja bien y ya es la fecha que ella pidió.»

**C8 · R2 · Intelligence (l. 331 y 358).**
«En una pantalla, encima del CRM que ya tienes.» y «Encaje, intención y riesgo van de 0 a 100 y se calculan con lo que hace cada contacto.»
Hoy Intelligence es una demo con datos ficticios y un modo real que solo lee nuestro GHL. Y el encaje sale del perfil, no del comportamiento.
Cambio:
- l. 331: «Qué está pasando, qué importa y qué hacer después. En una pantalla.» (el texto literal de `decisiones-p0.md`). Si Growth confirma con qué CRM se conecta, se añade «con los datos de tu CRM».
- l. 358: «Datos de ejemplo. Encaje, intención y riesgo van de 0 a 100. El encaje sale de cómo es cada contacto, y la intención y el riesgo, de lo que hace.»

**C9 · R1 · Cifra sin fuente y ejemplo sin etiqueta.**
- l. 289: «Nadie contesta a tiempo, y a las tres horas ya ha hablado con otro.» Las tres horas no tienen fuente. Cambio: «Nadie contesta a tiempo, y cuando le escribes ya ha hablado con otro.»
- l. 340-343: la ficha de decisión de Intelligence (nombre, euros y tres notas) no lleva «Ejemplo». En móvil queda debajo de la lista y se ve sola. Cambio: añadir `<span class="ej">Ejemplo</span>` en `.dec__top`, junto al valor.

**C10 · R11 · «No es X, es Y» disfrazado (l. 257).**
«Un lead no se pierde de golpe. Se pierde en algún punto del recorrido.»
Es la negación y la corrección de siempre. Viene del Message House de `decisiones-p0.md` §2 («Insight»), así que hay que cambiarlo también allí.
Cambio: «Cada lead se escapa en un punto concreto del recorrido. <span>Te enseñamos cuál.</span>»

**C11 · R11 · Lema (l. 249).**
«El agente hace lo que se repite. Tu equipo decide lo que importa.»
`decisiones-p0.md` lo adoptó para sustituir otro lema, pero tiene la misma forma: dos frases simétricas que suenan a rótulo. Debajo del hero, además, repite lo que el ejemplo ya enseña.
Cambio: «En este ejemplo, el agente contesta, cualifica y da la cita. Llamar y cerrar la venta lo hace tu equipo.»
Si Maikel prefiere mantener la frase porque ya está decidida, que conste como excepción a R11 en `decisiones-p0.md`.

# Qué Eliminaría

- La frase de debajo del hero tal como está (C11). El ejemplo ya lo enseña.
- El enlace del menú «Casos» a `/casos/nuria-roure/`. Lleva a un solo caso con la palabra en plural. Hasta que exista `/casos/`, mejor «Un caso» o quitarlo.
- La descripción de cada oportunidad que se oculta en móvil (`.opp__d { display:none }`). O se enseña, o la lista de móvil queda en nombres y euros sin contexto.

# Qué Simplificaría

- **La ficha fija del recorrido en móvil:** una sola línea con nombre, etapa y siguiente acción (unos 90 px) en vez de la tarjeta de unos 230 px.
- **La bandeja de Intelligence:** todas las oportunidades del mismo negocio (una academia, para que case con el enlace `?sector=formacion`). Por ejemplo «Marta · inglés B2», «Jorge · intensivo de verano», «Sara · curso de empresa», «Iván · clases sueltas».
- **Un solo nombre para la protagonista.** Lucía en el hero y el recorrido y Laura en Intelligence, las dos de academia, con 1.450 € y el mismo anuncio, parecen la misma persona con dos nombres. Usar uno. «Laura» casa con el hook B del reel «Las fugas» (`content/video/2026-09-29-fugas-v2/brief-v2.md`).
- **El rótulo «Lo decide tu equipo»** en etapas donde no se decide nada («Llega a la cita sabiendo qué busca», «Negocia y cierra»). Mejor «Tu equipo».

# Qué Reforzaría

- **La prueba.** Debajo de Intelligence, un bloque de enlaces a las cuatro páginas de caso, contado como problema y fuga, sin cifras grandes hasta tener los permisos (`decisiones-p0.md` §6, R6).
- **La verdad del horario como argumento.** «A las 23:47 no le escribimos. A las 8:00 tiene el mensaje, antes de que abra la competencia.» Es verdad y vende control. Solo si Growth confirma que es lo que se configura en los clientes.
- **La medición.** Cada `/diagnostico/` con su UTM y su `utm_content` (cabecera, hero y cierre). Lo pide la decisión §3 y es lo que dirá qué botón trae diagnósticos.
- **El cierre.** «Diagnóstico → Plan → Piloto → Sistema» está bien. Falta una línea de quién no es cliente («Para quién es y para quién no», `decisiones-p0.md` §0).

# Riesgos

- **R10 en el destino.** El CTA lleva a `/diagnostico/`, que enseña «Si no mejora el número que acordamos, no pagas el piloto» y «Menos de 500 €». La pieza cumple, pero quien hace clic se encuentra precio y garantía. Lo decide Maikel (`decisiones-p0.md` §8.3).
- **Enlace a la demo de Intelligence (l. 359).** El README dice que la demo «no se enlaza desde la web», y que pase a pública lo decide Maikel (§4). La demo tiene un Copilot con preguntas libres a Claude. Antes de enlazarla desde la home, revisar qué contesta sobre precios y plazos.
- **R5, leve.** «Jorge» aparece como lead real en `captacion/agente-llamadas/bitacora-raquel.md` (base antigua). Solo el nombre de pila y en otro sector, así que no lo identifica. Aun así, mejor usar nombres que no estén en el CRM.
- **R2 en lo que viene.** Si se publica con los críticos sin arreglar, el primer piloto de academia preguntará por el resumen de reunión y la reprogramación del mismo día.
- **Accesibilidad.** El hero cambia cada 2,3 s y la ficha de Intelligence cada 3,6 s, sin botón de pausa (WCAG 2.2.2). Las dos zonas llevan `aria-live`, así que un lector de pantalla lee la ficha entera en cada cambio.

# Impacto Esperado

Con los críticos arreglados, la home pasa de describir servicios a enseñar el sistema funcionando. Eso debería subir el clic a `/diagnostico/` de quien ya invierte en captar, que es el perfil que llega a piloto. El mayor impacto en la North Star no está en el hero. Está en que lo que la home promete sea lo que el piloto entrega: cada promesa falsa de hoy es una objeción en la llamada de diagnóstico o un cliente decepcionado en la semana 2 del piloto. Sin prueba visible, el impacto queda por debajo de lo que podría ser.

# Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

- **Portada (desk-1):** muy buena. H1 a 68 px, subtítulo de tres líneas, dos botones claros y la tarjeta negra asomando para invitar a bajar. En móvil (movil-1) el bloque del sistema empieza justo bajo el pliegue. Bien.
- **Jerarquía:** clara en las tres secciones. El contraste negro, blanco y negro (hero claro, Intelligence oscuro, cierre claro) da ritmo.
- **Ritmo de la animación del hero:** 2,3 s por paso con mensajes de 20 a 25 palabras. No da tiempo a leerlos. Subir a 5 s, parar al pasar el ratón o tocar y añadir un botón de pausa.
- **Recorrido en escritorio (desk-3):** la ficha que cambia con destello cuando bajas es el mejor momento de la página. Las etapas que no están activas, al 35 % de opacidad, se leen mal en las capturas (gris sobre blanco). Subir a 0,5.
- **Recorrido en móvil (movil-3):** cabecera de dos líneas (unos 100 px) más ficha fija (unos 230 px) en 844 px de alto. El titular de la etapa queda tapado (`movil-3-recorrido-4.png`). La etiqueta «Ejemplo» baja a 9 px y apenas se lee. Ver «Qué Simplificaría».
- **Intelligence en móvil (movil-4):** la ficha de decisión, que es la pieza que pedía la revisión, queda debajo de una lista de cinco filas. El ciclo automático la cambia fuera de la vista. En móvil, poner la ficha primero, la lista debajo y sin ciclo automático.
- **Letras A, B y C en la lista de Intelligence:** chocan con los niveles A-D reales de la puntuación (`api/_scoring.js`), que miden otra cosa. Mejor «Alta / Media / Baja» o un punto de color.

# Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook:** «Convierte más de las oportunidades que ya estás generando.» Claro y alineado con la promesa de `decisiones-p0.md` §1. El subtítulo cumple. La frase corta de posicionamiento («Encontramos dónde se te escapan las oportunidades…») sigue pendiente de Maikel.
- **Claridad:** alta. Siete etapas, cada una con su titular, su fuga en una línea y quién hace qué. Gramática: «Reservan, no aparecen, y nadie le vuelve a llamar» mezcla plural y singular. Mejor «y nadie les vuelve a llamar».
- **Credibilidad:** es el punto débil, por R2 (C1 a C8) y por la falta de prueba real. Lo que sí está respaldado (origen de cada lead, nota y motivo en la ficha, aviso de oportunidades paradas, venta unida al anuncio) basta para sostener la página.
- **R11:** sin raya larga ni punto y coma. Un «no es X, es Y» disfrazado (C10) y un lema (C11). Los titulares de etapa en «Que…» («Que entre…», «Que ninguna…», «Que la cita…», «Que quien decide…») suenan a plantilla si se leen seguidos. Variar dos.
- **CTA:** el destino es único (`/diagnostico/`), pero hay dos textos. La cabecera dice «Diagnóstico · 30 min» y el hero y el cierre dicen «Ver dónde pierdo oportunidades →». La decisión §3 quiere un solo texto y prevé un test de texto. Con dos variantes en la misma página y sin UTM, ese test no se podrá leer. O se usa el mismo texto en todos, o cada botón lleva su `utm_content`.
- **R13:** las frases en coral lo cumplen. La bandeja de Intelligence con cuatro sectores, no (ver «Qué Simplificaría»).

# Revisión Estratégica (alineación con Qualivo, alineación con North Star)

- **Etapa del Revenue Journey:** la pieza es de **captación** (lleva a pedir el diagnóstico), y su contenido recorre las siete etapas, con Intelligence haciendo de **medición**.
- **Alineación con Qualivo:** muy alta. Habla de fugas, de recorrido y de sistema. La IA aparece como mecanismo («el agente») y no como categoría, como pedía la revisión.
- **North Star (pilotos activos):** el camino «home → diagnóstico → plan → piloto» está claro y sin desvíos. El riesgo para la North Star es de expectativa: lo que la home promete se convierte en el alcance que el cliente espera del piloto. Por eso los críticos de R2 pesan más aquí que en un post.
- **Hipótesis sin validar:** que el hero animado convierte mejor que uno estático, y que Intelligence en la home empuja a pedir el diagnóstico. Las dos se pueden medir con la UTM por botón y la profundidad de scroll.

# Versión Mejorada del Hook

H1 (se mantiene): «Convierte más de las oportunidades que ya estás generando.»

Subtítulo propuesto, más concreto y con la fuga en primer plano:
«Pagas por oportunidades que se pierden antes de llegar a ventas. Te enseñamos en qué punto, y montamos el sistema que contesta, cualifica, sigue y cierra.»

Alternativa para el test con el H1, sacada del Message House:
«Pagas por oportunidades que se pierden antes de llegar a ventas. Te enseñamos dónde.»

# Próximo Experimento Recomendado

**Test de 5 segundos más prueba de lectura en móvil, con cinco dueños o directores comerciales de formación y clínicas, antes de enseñárselo a Maikel.** Preguntas: «¿Qué hace esta empresa?», «¿Qué pasa si haces clic en el botón?» y, tras bajar hasta Intelligence, «¿Qué harías con Marta?». Éxito: 4 de 5 responden bien las tres. Después, cuando se publique, el test ya previsto de «Ver dónde pierdo oportunidades» contra «Quiero mi diagnóstico», con UTM por botón y midiendo diagnósticos celebrados, no clics.

# Veredicto: PUBLICAR CON CAMBIOS

Pasa a Maikel con C1 a C11 aplicados, todos de texto. Si mantiene la frase del hero (C11) por ser una decisión ya tomada, que quede anotada como excepción a R11. La garantía y el precio de `/diagnostico/` siguen siendo decisión suya y conviene resolverlos antes de publicar la home nueva.
