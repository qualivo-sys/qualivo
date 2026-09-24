# Diario del agente de contenido

Una entrada por día de trabajo. Qué se entregó, qué datos se usaron y de dónde,
qué queda pendiente de Maikel. Redes en pausa mientras no diga lo contrario por
escrito: aquí solo hay borradores.

## Lunes 21 de septiembre de 2026 · primera entrega

**Leído antes de escribir, en este orden:** prompt maestro del agente, skill
`sistema-contenidos`, propuesta de valor V1, estrategia de contenidos V1,
estrategia de redes V1, guía de voz, cola de publicación, bitácora de Raquel.
Además: los borradores de la semana 38 (`semana-2026-09-14.md`,
`linkedin-semana-38.md`, infografías del 17-sep) para no repetir conceptos, el
recorrido de activación V2, el plan de campaña y el prompt de propuestas.

**Entregado:** `content/borradores/plan-semana-39-contenido.md`. Cuatro piezas
de LinkedIn (lunes diario, miércoles banderas rojas de dependencia, jueves
diario, viernes tesis contraria), tres de Instagram en el formato de casa
(martes no hagas/haz, jueves Sin humo, sábado lista rápida), el capítulo 1 de la
newsletter del jueves (430 palabras) y las tres decisiones con recomendación.

**Datos usados, todos verificados en el repositorio:** las 24 llamadas del
21-sep con sus 3 citas, los 118 segundos con la locución de operadora, el lead
que recibió el correo de descarte y la llamada el mismo día (bitácora y commit
`3665657`), el plantón recuperado en seis minutos y la centralita colgada
(18-sep), la llamada de las 9:00 en punto al lead del domingo, el fin de semana
a 8 € frente a 22 € (plan de campaña), el lead perdido el 14-sep por el permiso
caducado (`api/rescate-leads.js`), las llamadas desde el móvil de Maikel.

**Datos que NO he usado:** la base antigua de 3.000 contactos con 200 útiles y
las cinco reuniones del martes. Están en el prompt maestro pero no en ningún
registro del repositorio. Pedidos a Maikel en el plan.

**Decisiones que espero de Maikel:** levantar la pausa solo para LinkedIn en
texto (recomiendo sí, desde el jueves 24), dónde vive la newsletter (recomiendo
newsletter nativa de LinkedIn), publicar coste y herramientas del sistema propio
(recomiendo sí, siempre pegado a lo que salió mal).

**Criterio aplicado que conviene dejar escrito:**
- El test de dependencia del 17-sep ya cubre «el WhatsApp de la empresa es tu
  móvil» como pregunta. La pieza de dependencia de esta semana no pregunta:
  cuenta los tres casos propios. Es otra pieza, no la misma.
- Ningún nombre de lead ni de empresa en las piezas, aunque estén en la
  bitácora. Sin permiso escrito, sin nombre.
- La newsletter va sin la línea del coste (1,65 $) hasta que Maikel decida. La
  línea está escrita en la decisión 3, lista para pegar.

**Mañana (martes 22):** si Maikel contesta las decisiones, aplicar. Si no,
preparar la infografía del martes en HTML sobre el molde `no-hagas.html` y
revisar la bitácora de Raquel por si las reuniones del martes dejan material
para el lunes 28.

### Lunes 21 · noche · llega el brief de Maikel

**Lo que ha pasado.** Maikel ha entregado el brief del Head of Content (papel,
posicionamiento sobre el recorrido de diez pasos, cinco pilares con peso, cinco
series madre, reparto de CTA 50/30/20, proceso semanal en seis pasos y el modo
de trabajo diario: «¿qué ha ocurrido esta semana que pueda enseñar?» antes que
«¿qué publico hoy?»). Dice que esa última parte es la clave: el agente deja de
ser un generador de posts y pasa a ser el sistema editorial de Qualivo.

**Hecho.**
- `content/agentes/brief-head-of-content.md`: el brief entero, tal cual, con una
  tabla final de cómo convive con lo anterior (CTA, recursos, Maikel a cámara,
  series, voz, pausa, datos).
- Prompt maestro y skill `sistema-contenidos` apuntan al brief como documento
  que manda.
- `content/recursos/antes-de-gastar-mas.md`: el primer recurso real, siete
  preguntas con datos propios, para que «escribe FUGA» tenga algo detrás.
- Plan de la semana 39 revisado: 18 aprendizajes extraídos y agrupados (paso 2
  del proceso), series madre en la tabla, CTA repartido (4 conversación, 2
  recurso, 2 diagnóstico), guion de reel de 58 s a cámara con la historia del
  filtro.

**Dudas escritas para Maikel.**
- Voz: sigo con la primera persona de Maikel en redes (el radar lo respalda).
  El brief usa «nosotros» en los ejemplos. Si prefiere el «nosotros», se cambia.
- Reel a cámara: el contrabrief del 25-ago decía «nada de gente a cámara». El
  brief lo pone como formato preferente. Aplico el brief. Necesita que Maikel
  grabe: el guion está listo.
- El recurso se entrega por mensaje directo, a mano o con el agente de WhatsApp.
  Hay que decidir quién contesta a los «FUGA» cuando se levante la pausa.

### Lunes 21 · más tarde · corrección de Maikel: «hay que mostrar cosas positivas que hace el sistema»

Tenía razón: de siete piezas, cinco abrían por un fallo. Cambiado: lunes
«tres reuniones que agendó un agente mientras yo estaba en otra», martes lista
rápida de cinco cosas que hizo el sistema sin mí (infografía nueva,
`lista-sistema.html`), miércoles «tres cosas que ya no dependen de mí» (verdes
primero), viernes el agente que encontró 34.500 € parados en mi CRM (el dato
propio sorprendente que llevaba en cola desde el 10-sep). La pieza de la
velocidad y la lista de cinco fallos pasan a reserva. Regla escrita en el
brief y en el prompt: primero lo que funciona con dato, después el fallo,
corto. Nunca más piezas de fallo que de acierto en una semana.

### Lunes 21 · noche · «¿puedes enseñar ejemplos para que la gente lo vea?»

Hecho un carrusel de demostración con una llamada real del lunes (la cita de
las 10:30): el WhatsApp del minuto uno con el texto real del sistema, la
transcripción de la llamada, la nota que quedó en el CRM, los 50 segundos de
silencio que salieron mal y el remate «20 minutos del formulario a la cita».
Formato de simulación de pantalla del 14-sep. Sin nombre, empresa ni teléfono
del cliente. Va el jueves 24 en Instagram y como documento en LinkedIn; la
tarjeta Sin humo pasa a reserva. Carpeta:
`content/carruseles/2026-09-21-llamada-real/`.

Duda escrita: el cliente podría reconocer su propia llamada aunque no haya
nada que lo identifique. Recomiendo publicar; decide Maikel.

### Lunes 21 · noche · «¿podemos hacerlo con Beatriz, una clínica?»

El carrusel de la llamada de reformas no le convence: es un negocio pequeño
fuera del ICP y la conversación es plana. Hecho el mismo molde con la clínica
dental que entró el viernes 19 por la landing sin anuncio: la página, su
WhatsApp real («no puedo bajar en el calendario»), el fallo arreglado antes de
comer (11:18 y 12:02, commits del 19-sep), la reunión del lunes 13:30 y el
remate. Carpeta `content/carruseles/2026-09-21-clinica-real/`. Faltan tres
cosas que solo tiene Maikel: la frase de ella en la reunión (hueco amarillo en
la lámina 5), su respuesta por WhatsApp (va resumida, no citada) y el permiso
para nombre y clínica. El de reformas queda como reserva.

### Lunes 21 · noche · «hay que darle una vuelta a todo»

Maikel: ni la llamada de reformas ni la clínica le convencen del todo; lo que
quiere es enseñar distintas fugas y mejoras en cualquier etapa del recorrido,
para que el cliente lo vea, y no tanto carrusel: un post sobre algo concreto
que aporte valor. Hecho: serie «Buscando la fuga», diez piezas de una imagen,
una por etapa del recorrido del brief, cada una con la fuga, un caso propio
verificado, la mejora aplicable y lo que se mide. Tres posts de LinkedIn
completos (contacto, reunión, seguimiento). Carpeta
`content/infografias/2026-09-22-fuga-por-etapa/` y doc
`content/borradores/serie-buscando-la-fuga-por-etapa.md`. Los dos carruseles
quedan en reserva. Mañana: adaptar el plan de la semana 39 a esta serie si
Maikel la aprueba.

### Lunes 21 · noche · la idea de Maikel: el estudio, el experto y el agente

Maikel: «según un estudio, una persona tarda tanto en decidir, necesita
tantos impactos… esto es lo que hace uno de nuestros agentes». Y después:
«de cada etapa, qué es lo mejor que se tiene que hacer, y luego mostrar que
un agente también lo hace, porque la gente piensa que la IA no es muy buena».
Hecho: serie «Lo que hace un experto · lo que hace el agente». Cuatro
estudios verificados contra la fuente (HBR 2011, RAIN Group, Velocify, BMJ
Open 2016); descartadas las cifras circulantes sin fuente (el 80 % con cinco
seguimientos, los siete impactos). Tres piezas renderizadas (contacto,
seguimiento, reunión) con tres posts de LinkedIn en
`content/borradores/serie-estudio-vs-agente.md`. Regla escrita: la cifra sale
de quien la publica, y va en la imagen.

Maikel, sobre las tres piezas: «no está mal pero hay mucha información, eso no
lo va a leer nadie». Rehechas: un número grande, una línea, y dos líneas más
(un buen comercial / nuestro agente). Post de LinkedIn por debajo de 90
palabras. Regla nueva para la serie y para el resto: si no cabe en una
pantalla de móvil sin bajar, sobra.

### Lunes 21 · noche · buenas prácticas de carrusel, y aplicarlas

Maikel: «acompaña con una imagen siempre que puedas, todo tiene que ser
bastante visual», y «busca primero las mejores prácticas, analiza carruseles
top y aplícalo después». Hecho: `content/guia-carruseles.md` con las reglas
de cinco fuentes externas, la lista que pasó Maikel, el radar propio y las dos
referencias que trajo (neuromark, consultoriaio). Doce reglas y una lista de
comprobación. Aplicado al carrusel del contacto (7×): ocho láminas, una idea
por lámina, menos de 40 palabras, imagen en todas, barra de progreso, fuente en
la lámina, cierre con una acción. Carpeta
`content/carruseles/2026-09-22-contacto-7x/`. Lo que no he podido hacer: abrir
Instagram o LinkedIn y medir carruseles nuevos uno a uno.

Maikel, sobre el carrusel: el diseño le gusta; pide pantallas creíbles (un
Google Calendar de verdad, no un dibujo) y copy con fórmula. Añadida la
sección de copy a la guía (gancho, cuerpo, una acción, 3-5 etiquetas; PAS
lámina a lámina). Carrusel reescrito con PAS: portada con promesa concreta,
lámina 2 el dolor con una conversación de ejemplo, lámina 3 el estudio,
después experto, agente, calendario del martes con las tres citas en pantalla
tipo Google Calendar, acción para mañana y cierre. Pie de foto para Instagram
y LinkedIn en `caption.md`.

Maikel: los rótulos de sección encima del titular («Contacto · la primera hora») no aportan y «se nota que es muy Claude». Fuera de todos los moldes. Regla escrita en la guía.

### Lunes 21 · noche · revisión en Notion

Maikel quiere que otro agente revise las piezas: diseño, copy, objetivo, CTA,
alineación. Montado en Notion, dentro de «Máquina de Contenido · Qualivo»:
la guía de carruseles y copy (con la lista de quince preguntas), el prompt del
agente revisor y la base «Revisión de piezas · contenido» con columnas para
cada pregunta de Maikel, nota global y qué cambiar. Primera fila: el carrusel
del contacto, en estado «En revisión», con las ocho láminas subidas, el copy
de cada una, el pie de foto y las fuentes. Regla: cuando haya tres piezas en
«En revisión», se lanza el revisor. Prompt también en el repo:
`content/agentes/prompt-agente-revisor.md`.

### Lunes 21 · noche · primera revisión de Maikel y Qualivo Master Reviewer

Maikel revisó el carrusel en Notion. Lo que funciona: territorio Qualivo,
historia clara, la prueba propia. Lo que cambia: la portada prometía «te
cuesta 7 veces más», que no es lo que dice el estudio; ahora «contestar en la
primera hora multiplica casi por 7 la probabilidad de cualificar al
contacto». Lámina 3 con la formulación exacta. Lámina 4 «responde mientras la
intención está caliente». Lámina 5 «¿Y si eso no dependiera de una persona?»
(la IA como solución, no como protagonista). Lámina 6 con los números enormes:
24 llamadas, 3 citas, 0 minutos míos. Lámina 7 «antes de gastar más en
conseguir contactos, mira cuánto tardas en atender los que ya tienes». Cierre
«guarda esto y mide el tiempo real de respuesta de tu último contacto».
Regla nueva: un titular no puede decir más que el estudio; si alguien puede
discutir el dato en comentarios, el dato está mal contado.

El revisor pasa a ser el «Qualivo Master Reviewer» que dictó Maikel (doce
ángulos, formato de respuesta fijo, veredicto PUBLICAR / PUBLICAR CON CAMBIOS
/ REHACER). Sustituye al prompt anterior en Notion y en el repo
(`content/agentes/prompt-qualivo-master-reviewer.md`). La base de revisión
tiene ahora columnas Veredicto y Versión. La pieza vuelve a «En revisión»
como versión 2.

### Lunes 21 · noche · el Master Reviewer revisa la v2

Nota 6, PUBLICAR CON CAMBIOS. Ocho críticos, todos con motivo y fuente; siete
aplicados en la v3 (portada con el número enorme y «dos de cada tres no
llegan», coherencia de horas en la lámina 2, «12 contactos · 3 citas» en vez
de «0 minutos míos», fallo corto de las locuciones, fuera «cada vez» y «con sus
palabras», Harvard Business Review en todos los sitios, calendario sin solape
y con los sectores reales, título arriba en la 8). El octavo es decisión de
Maikel: si se enseña en la lámina 5 el WhatsApp firmado «soy Maikel» junto a
«un comercial IA». Revisión completa en
`content/carruseles/2026-09-22-contacto-7x/revision-master-reviewer-v2.md`.

### Para mañana, martes 22 (pedido de Maikel, 21-sep noche)

Entregar el contenido de la semana 39 rehecho con lo aprendido hoy, en un solo
documento, con esto dentro:
1. **Calendario de la semana intercalando formatos**: un día carrusel, otro
   vídeo, otro post de una imagen, otro vídeo. Cada pieza con gancho, dato
   verificado, formato y CTA (50 / 30 / 20). Todas pasan por el Master
   Reviewer antes de darse por listas.
2. **Propuesta de newsletter** (capítulo 1 rehecho con la regla del dato y el
   equilibrio acierto/fallo): asunto, texto, a quién va. Ahora hay leads:
   incluir a los leads de la campaña que han dado correo y no tienen cita,
   además de la lista de LinkedIn. Comprobar consentimiento y la regla de
   protección de datos de agosto antes de proponer el envío.
3. **Guion de vídeo** para grabar a cámara (45-60 s), de la pieza más fuerte
   de la semana, con rótulos.
4. Plan de envíos: qué día sale la newsletter, qué día se contesta a los
   comentarios, qué se le manda a quien escribe «FUGA».
Todo con la pausa de redes vigente salvo que Maikel la levante por escrito.
La decisión de la lámina 5 del carrusel del contacto sigue pendiente.

## Martes 22 de septiembre de 2026

### Publicado
- **Blog:** https://qualivo.io/blog/presupuestos-sin-respuesta/ · «Presupuestos sin
  respuesta: cuánto negocio duerme ahí y cómo despertarlo». Keyword
  «presupuestos sin respuesta» (fila 10 del calendario SEO del listado
  maestro). Dato propio: el CRM de Qualivo el 10-sep (30 abiertas, 25 sin
  siguiente paso, 34.500 € declarados, 15 entre 57 y 63 días, 25 tareas
  creadas). Tarjeta en el índice del blog (cluster «Funnel y conversión»),
  sitemap, llms.txt y registro nuevo `content/seo-keywords-usadas.md`.
- **Reapuntado:** `/blog/auditoria-de-marketing/`. Solo los dos últimos
  párrafos («Qué cuesta y qué devuelve») y el bloque de cierre. Antes vendía
  «la auditoría, dos semanas» con dos botones (uno a `/#contacto`). Ahora
  cierra con los quince minutos del diagnóstico y un solo botón a
  `/diagnostico/`. Sin tocar título, URL, H1 ni el cuerpo.

### Borradores (pausa vigente, nada publicado en redes)
- `content/borradores/semana-39-formatos-intercalados.md`: la semana
  intercalando formatos como pidió Maikel (martes imagen, miércoles carrusel +
  newsletter, jueves vídeo a cámara + el artículo, viernes texto, sábado reel).
  Con el guion del vídeo del jueves (45-60 s, rótulos, CTA «escribe FUGA»), la
  ficha del martes y el plan de envíos y respuestas.
- `content/newsletter/2026-09-23.md`: capítulo 1 de «Agentizando mi propia
  empresa», rehecho: primero lo que hizo el sistema (24 llamadas, 12
  contactos, 3 citas, una a las 10:30 con reformas mientras Maikel estaba en
  otra reunión), después el fallo, corto. Asunto, preheader, a quién va con la
  base de cada grupo, el correo individual para los leads sin cita y la lista
  de antes de enviar.
- Pieza del día, «Sin humo»: fuera el rótulo de serie de arriba (regla de
  ayer, sin etiquetas de sección) y «comercial IA» en vez de «agente de voz».
  Reenderizada.

### Decisiones que le pido a Maikel (con recomendación)
1. Levantar la pausa y para qué. Recomiendo newsletter y LinkedIn desde el
   miércoles; Instagram cuando revisemos la estética juntos.
2. Newsletter: canal y destinatarios. Recomiendo la nativa de LinkedIn como
   canal principal y, a los leads de campaña sin cita, un correo individual
   desde su Gmail con el capítulo como posdata. Motivo: la casilla del
   formulario cubre atender lo que pidieron; no he encontrado en la política
   de privacidad una mención a envíos periódicos, así que un boletín es otra
   finalidad. La base antigua, no, hasta que confirme consentimientos (queja
   de agosto).
3. Lámina 5 del carrusel «Casi 7×»: sigue pendiente. Recomiendo quitar el
   WhatsApp firmado «soy Maikel» y dejar la tarjeta de la llamada de Raquel.
4. La línea del coste (1,65 dólares) en la newsletter y en el martes.
   Recomiendo que entre, pegada al fallo.

### Descartes
- Segundo artículo hoy: no. El de presupuestos es largo (unas 1.400 palabras)
  y la rutina permite dos solo si el primero es corto.
- Newsletter por correo a la base antigua: no, por la queja de agosto.
- Mandar el capítulo por WhatsApp a los leads: no (regla del 21-sep: nada que
  parezca envío automatizado desde el 663).
- Carrusel para el jueves: no. El jueves lleva vídeo; el carrusel va el
  miércoles para no repetir formato.

### Dudas que dejo escritas
- El día de la newsletter: la rutina dice miércoles, el plan del 21 decía
  jueves. He puesto miércoles 23. Si Maikel prefiere jueves, el fichero se
  renombra y nada más cambia.
- Cuántos leads de campaña tienen correo y no tienen cita: no lo tengo
  cerrado hoy. Se cuenta en GHL el miércoles a primera hora.

### Hipótesis para mañana
- El artículo de presupuestos y el vídeo del jueves comparten el dato: si el
  vídeo trae comentarios con «FUGA», el artículo debería recibir visitas desde
  LinkedIn el jueves y el viernes. Se mira en Vercel el viernes en el ritual.
- Miércoles: si la pausa sigue, toca la segunda pieza de la serie «Lo que dice
  el estudio · lo que hace el agente» (seguimiento, 8 toques) en el molde del
  carrusel, y el blog de la Fuga reunión (plantones) con el dato del BMJ Open.

### Martes 22 · mediodía · el Master Reviewer revisa las tres piezas del día

Informe en `content/borradores/revision-master-reviewer-2026-09-22.md`.
Artículo: nota 6, PUBLICAR CON CAMBIOS, nueve críticos, todos aplicados en
caliente. Newsletter: nota 7, cinco críticos aplicados. Guion del vídeo: nota
7, cuatro críticos aplicados y recortado de 187 a 145 palabras. Lo que
enseñó, y que vale para todo lo que venga: **el agente de seguimientos real
(`api/seguimientos.js`) detecta oportunidades con más días de la cuenta en su
etapa y deja a Maikel el siguiente movimiento escrito; no mira actividad, no
escribe al cliente y no se para por respuesta.** Yo lo había descrito como
otro agente, en el artículo, en el vídeo y en la infografía 08 de la serie por
etapa. Corregido en los cuatro sitios. Segunda lección: Nuria Roure no es un
despacho (formación y servicios online) y el 6,45× viene de cualificación más
seguimiento, no solo de seguimiento. Corregido en el artículo, la infografía y
la serie. Regla nueva para mí: antes de describir lo que hace un agente, leer
su fichero en `api/`, no el resumen.

Filas nuevas en la base de Notion «Revisión de piezas · contenido»: el
artículo (Publicada, v2), la newsletter (En revisión, v2) y el vídeo (En
revisión, v2), con nota, veredicto y qué cambió.

### Martes 22 · mediodía · Maikel elige el carrusel para hoy

«No me convence este [Sin humo]. Me gustaba más el carrusel de ayer.» El
carrusel «Casi 7×» pasa al martes; Sin humo pasa al miércoles y se rehace o se
cambia. Lámina 5 cerrada con mi recomendación: fuera el WhatsApp firmado «soy
Maikel», queda solo la llamada de Raquel. v4 renderizada y entregada en el chat
con los dos pies de foto. Publicar sigue dependiendo de que levante la pausa.

Maikel, 22-sep mediodía: «me gusta, pero lo de las tres locuciones quítalo». Lámina 6 sin la frase del fallo (v5). Regla que anoto: en el carrusel de demostración no va el fallo; el fallo va en el diario y en la newsletter.

Maikel, 22-sep: «no digas cosas como “sin humo” y palabras así, que suena muy
GPT/Claude; siempre un tono humano en los textos». Regla apuntada en la guía
de voz (sección Anti-ChatGPT) y en el prompt del agente: fuera los lemas y
nombres de serie que suenan a máquina; cada pieza empieza por lo que pasó. La
pieza del miércoles se rehace sin ese titular ni ese molde.

### Martes 22 · mediodía · publicado en Instagram

Maikel levantó la pausa para esta pieza en Instagram y me pidió publicarla.
Sin credenciales de GHL en el entorno no pude; me las dio en el chat y el
carrusel «Casi 7×» (v5) salió por el Social Planner a @maikel.echevarria. Ocho
láminas en el CDN de GHL, post creado. Es la primera pieza publicada en redes
desde la pausa del 9-sep. LinkedIn sigue parado. Regla nueva: las credenciales
se piden a Maikel en la sesión y viven en el cuaderno de la sesión, nunca en el
repositorio.

## Miércoles 23 de septiembre de 2026

### Lo que pasó ayer después del cierre
El carrusel «Casi 7×» salió en Instagram (@maikel.echevarria) a mediodía por
el Social Planner de GHL; esta mañana consta como publicado. Es la primera
pieza en redes desde la pausa del 9-sep. Maikel dejó dos reglas nuevas: fuera
los lemas que suenan a máquina («sin humo» y parecidos), y el carrusel de
demostración no lleva el fallo dentro (el fallo va al diario y a la newsletter).

### Publicado
- **Blog:** https://qualivo.io/blog/cliente-no-se-presenta-a-la-cita/ · «El
  cliente no se presenta a la cita: por qué pasa y qué hacer en los diez
  minutos siguientes». Dato propio: semana del 18 al 22 (20 contactos de
  anuncios, 9 citas, 5 plantones, 1 reunión con propuesta) del brief del
  recorrido que dejó el agente de operaciones; el plantón del 18-sep con la
  llamada de las 12:06; el estudio del BMJ Open. La hipótesis «el plantón es
  de diseño» va marcada como hipótesis. Tarjeta, sitemap, llms.txt y registro.
- **Reapuntado:** `/blog/seguimiento-comercial/`. Los dos últimos párrafos y
  el cierre: un solo botón al diagnóstico (antes dos, uno a `/#contacto`),
  con el dato del CRM propio y el enlace al artículo de presupuestos.

### Borradores (pausa vigente)
- Miércoles, bandera roja por fuga (reunión):
  `content/borradores/2026-09-23-bandera-roja-cita.md` con el texto de
  LinkedIn, el pie de Instagram y la ficha; imagen
  `content/infografias/2026-09-23/bandera-roja-cita.png` (5 de 9, tres pares
  rojo/verde). Enlaza con el artículo de hoy en el primer comentario.
- Newsletter capítulo 1 movida al jueves 24 (`content/newsletter/2026-09-24.md`),
  como dice la rutina. Sin cambios de texto salvo la fecha y una línea para
  enlazar el carrusel del martes.

### Decisiones que le pido a Maikel (con recomendación)
1. **Publicar la bandera roja de hoy en LinkedIn.** Recomiendo sí: es la
   pieza que mejor casa con el artículo, y LinkedIn lleva dos semanas sin
   nada. Si dice que sí, la subo yo (ya tengo las credenciales de GHL en la
   sesión) o le paso el texto para su perfil.
2. **La newsletter del jueves:** levantar la pausa para LinkedIn (newsletter
   nativa) y confirmar el correo individual a los leads sin cita con la
   cadencia terminada. Recomiendo las dos cosas.
3. **La tasa de plantones (5 de 9) en abierto.** Recomiendo publicarla: es el
   dato propio más honesto de la semana y va con la mejora al lado.

### Descartes
- Segundo artículo: no, el de plantones es largo.
- Contar en la pieza del día el «¿eres una máquina?» del 22-sep (Raquel lo
  negó y la señora colgó). Es una historia buena, pero hoy toca bandera roja y
  la regla es más aciertos que fallos. Queda para el diario del jueves o la
  newsletter del capítulo 2, con la regla nueva («sí, soy la asistente de IA
  de Máikel») como acierto.
- Newsletter hoy: no, la rutina la fija el jueves.

### Dudas que dejo escritas
- Dos pruebas anunciadas en el artículo (precio antes de reservar,
  confirmación la víspera con hueco que se libera) están en el brief como
  «para discutir», no como aplicadas. El artículo dice «en marcha, sin
  resultado todavía». Si Maikel no las arranca esta semana, hay que
  corregir esa frase.
- El nombre que se ve en el CRM del lead de reformas (constructora) no sale
  en ninguna pieza; en la tabla del artículo va como «una constructora».

### Hipótesis para mañana
- Si la bandera roja sale en LinkedIn, el artículo de plantones debería
  recibir más visitas que el de presupuestos en sus primeras 48 horas, por el
  enlace en el primer comentario. Se mira el viernes en el ritual.
- Jueves: capítulo 1 de la newsletter (ya escrito) y el vídeo a cámara del
  CRM; diario «Agentizando mi propia empresa» en LinkedIn con el «¿eres una
  máquina?» contado como regla nueva.

### Miércoles 23 · mediodía · el Master Reviewer revisa el artículo y la pieza del día

Informe en `content/borradores/revision-master-reviewer-2026-09-23.md`.
Artículo: nota 6, PUBLICAR CON CAMBIOS, nueve críticos aplicados en caliente.
Pieza del día: nota 7, tres críticos aplicados y la imagen rehecha (sin
rótulos «bandera roja / verde», cabecera «lo que hacía · lo que hago ahora»).
Lo que enseñó: (1) el brief de la semana suma 4 plantones en la tabla y dice 5
en el total; el de la clínica (22-sep, 16:00, movido al día siguiente) faltaba
en la fila. Lo he puesto en la tabla del artículo y **Maikel tiene que
confirmar el recuento**. (2) La fuente dice «citas de leads de pago: 9», no que
las nueve las cerrara la IA: ahora dice «mi sistema cerró 9 citas». (3) Lo que
está en prueba (WhatsApp con dos huecos, confirmación la víspera con hueco que
se libera) iba contado como si ya funcionara; ahora va como prueba. (4) La
llamada de plantón salió bien el 18 y mal el 22 (llamada en frío, 12 s): las
dos caras están en el artículo y en el post. Regla que anoto: lo que el brief
marca «para discutir» no se cuenta como hecho, ni en pasado ni en presente.
Filas nuevas en Notion: el artículo (Publicada, v2) y la bandera roja (En
revisión, v2).

## Jueves 24 de septiembre de 2026

### Publicado
- **Blog:** https://qualivo.io/blog/que-poner-en-tu-negocio-para-atraer-clientes/ ·
  «Qué poner en tu negocio para atraer clientes (y qué lo vacía)». Keyword de
  110 búsquedas y competencia cero del listado maestro (fila 7). Datos propios
  de la semana del 18 al 22: 291,90 € en anuncios, 21 contactos a 13,90 €, 8
  de 20 entraron de noche y no recibieron nada hasta las 9:00, 9 citas, 5
  plantones; la clínica del iPhone del 19-sep; el CRM propio. Cinco cosas que
  ponen y cinco que vacían (tabla). Tarjeta, sitemap, llms.txt y registro.
- **Reapuntado:** `/blog/leads-pero-no-ventas/`. Solo «Por dónde empezar»
  (los dos últimos párrafos, con el dato propio de la semana y el enlace al
  artículo de hoy) y el cierre: un solo botón al diagnóstico, antes había dos.

### Borradores (pausa vigente en LinkedIn)
- Jueves, «Agentizando mi propia empresa»:
  `content/borradores/2026-09-24-agentizando-eres-una-maquina.md`. Primero lo
  que hizo el sistema (27 llamadas, una cita de cinco minutos, latencia de
  3,2 a 2,0 s, un contacto con dos buzones que agendó al WhatsApp), después el
  fallo en cuatro líneas: una señora preguntó «¿eres una máquina?», Raquel lo
  negó y colgó; esa tarde, respuesta fija nueva. Imagen
  `content/infografias/2026-09-24/eres-una-maquina.png` (la pregunta, la
  respuesta mala tachada, la nueva).
- La newsletter capítulo 1 (`content/newsletter/2026-09-24.md`) tenía hoy su
  envío. No hay ok escrito de Maikel: no se envía. Queda lista para cuando lo
  dé; solo hay que cambiar «el lunes» por la fecha si pasa de semana.
- El guion del vídeo a cámara del jueves sigue en
  `semana-39-formatos-intercalados.md`, revisado y recortado. Lo graba Maikel
  cuando quiera; no depende de la pausa.

### Decisiones que le pido a Maikel (con recomendación)
1. **Newsletter:** sigue esperando su ok. Recomiendo enviarla hoy mismo por
   LinkedIn (nativa) y el correo individual a los leads sin cita con la
   cadencia terminada. Cada día que pasa, el capítulo 1 envejece.
2. **LinkedIn:** publicar hoy el diario del «¿eres una máquina?» (recomiendo
   sí: es la historia más humana de la semana y la regla nueva es un
   acierto) y ayer la bandera roja (sigue en borrador).
3. **Recuento de plantones:** 4 o 5. Sigue sin cerrar y hoy lo he vuelto a
   usar como 5 en el artículo, con la clínica dentro. Si son 4, corrijo dos
   artículos y una imagen.

### Descartes
- Segundo artículo: no, el de hoy es largo.
- Contar en el post del jueves la locución de operadora que sigue engañando a
  Raquel después del saludo (22-sep) o el mensaje de buzón que no encajaba
  (23-sep): dos fallos más en la misma pieza rompen la regla de más aciertos
  que fallos. Quedan para la newsletter del capítulo 2.
- Usar el dato de «conjuntos con exclusión a 13 € frente a 24-50 €» en el
  artículo: no lo he encontrado en una fuente primaria del repositorio.
  Fuera hasta que aparezca.

### Dudas que dejo escritas
- El artículo dice que la frecuencia de reformas llegó a 2,0 «a los cinco
  días» tal como está en el brief; si el agente de operaciones corrige ese
  dato, hay que tocar la tabla.
- La imagen del jueves decía «colgó a los diez segundos»; la bitácora solo
  dice que colgó. Corregido antes de subirla.

### Hipótesis para mañana
- Viernes: tesis contraria. Candidata con dato propio: «El coste por
  contacto es el número que más engaña»: clínicas a 21 € por contacto y
  reformas a 10 €, y la única reunión que terminó en propuesta fue una
  clínica. Y el ritual del viernes trae los números de la semana 39.
- Si Maikel publica hoy el diario y la newsletter, el viernes se mide qué
  trajo más comentarios: la confesión del fallo o la bandera roja.
