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

### Jueves 24 · mediodía · el Master Reviewer revisa el artículo y el diario del día

Informe en `content/borradores/revision-master-reviewer-2026-09-24.md`.
Artículo: nota 7, seis críticos aplicados en caliente (el 19-sep fue sábado,
no viernes; «de noche o en fin de semana», no «a las once de la noche»; 21
solicitudes de 20 personas; la reunión de la clínica vino por la web y no del
anuncio; las cosas gratis son la segunda y la tercera). Diario del jueves:
nota 7, tres críticos aplicados (la cita se cerró en dos minutos útiles; 23
llamadas reales; fuera «colgó a los diez segundos») y una línea añadida: la
cita del miércoles fue plantón. **Recuento de plantones cerrado por el
revisor:** lead a lead son 5 (la tabla por vertical del brief está
desactualizada). Ya no hace falta que Maikel lo confirme. Filas nuevas en
Notion: el artículo (Publicada, v2) y el diario (En revisión, v2).

### Jueves 24 · tarde · carrusel de plantones, guía y newsletter (pedido de Maikel)

Maikel trajo el copy entero de un carrusel de plantones (ocho láminas, cinco
motivos y protocolo) y pidió una portada divertida hecha en Higgsfield, más
una guía para mandar a quien comente «GUÍA» y una newsletter. Hecho:
`content/carruseles/2026-09-24-plantones/` (portada: un dueño de negocio
esperando solo en la videollamada con gorro de fiesta y tarta),
`content/recursos/guia-plantones.md` y
`content/newsletter/2026-09-25-plantones.md`. Regla nueva de Maikel, 24-sep:
**la tasa de plantones propia («5 de 9») no se publica.** Quitada del
carrusel, la guía y la newsletter. Sigue en el artículo del 23, el del 24, la
bandera roja del 23 y el reapuntado de leads-pero-no-ventas: pendiente de que
Maikel diga si la quita de ahí también.

Maikel, 24-sep tarde: la portada le gusta; pide que el contenido hable de los
sectores con los que trabajamos (clínicas, reformas, academias) para que se
reconozcan. Hecho en el carrusel (cada motivo con su sector: reformas, clínicas,
academias, academias, clínicas), la guía (una parte por sector), el pie de foto
y la newsletter. Regla que anoto: los ejemplos genéricos («un cliente», «una
reunión») se cambian por el paciente, el alumno o el cliente de reforma.

Master Reviewer del carrusel de plantones, la guía y la newsletter (24-sep):
nota 7 en las tres. Aplicado lo que no depende de la estructura: el caso del
18-sep contado como pasó (llamó a su oficina, cogió un compañero, escribieron
ellos; sin la frase «te he esperado», que era del correo y no de la llamada),
las pruebas de precio y confirmación como «lo siguiente que quiero probar», la
llamada del martes sin hora inventada, los ejemplos por sector en presente,
una sola llamada a la acción en la newsletter y fuera el «no es X: es Y» de la
lámina 8. Pendiente, a la espera de Maikel: si el carrusel se rehace en torno a
«la primera cita» (sin sector por lámina), que además resuelve los rótulos
«Motivo · sector» y el exceso de palabras por lámina que marca el revisor.

Maikel, 24-sep tarde: saltar de sector en cada lámina «queda raro». Rehecho en torno al punto común, la primera cita: sin rótulos de sector, número en el titular, menos de 40 palabras por lámina, los tres sectores nombrados solo en portada y cierre. Lo específico de cada sector queda en la guía.

### Jueves 24 · publicado en Instagram

Carrusel «Te han dado plantón» (v3) publicado en @maikel.echevarria a las 11:06 UTC, con el ok de Maikel. Post en estado «published» en el Social Planner. Quien comente GUÍA recibe la guía a mano. La newsletter de plantones sigue en borrador.

Newsletter de plantones v2 (24-sep): Maikel pidió enfocarla al dolor del cliente y usar los colores de la web. Rehecha en orden problema, agitar, solución, con el caso propio solo como prueba; paleta y tipografía de qualivo.io. Regla que anoto: los correos llevan la marca de la web (blanco, #101319, #27BDB1, Montserrat); las piezas de redes siguen con el molde de contenido hasta que Maikel decida si también cambian.

Maikel, 24-sep: «una cosa es mi Instagram personal y otra la newsletter de Qualivo». Regla que anoto y que manda desde hoy:
- **Instagram y LinkedIn de Maikel:** primera persona, su cara, sus casos («mi comercial IA», «mi empresa»), molde de contenido (crema, tinta, naranja).
- **Newsletter de Qualivo:** marca. La envía Qualivo, habla en «nosotros», firma Maikel como fundador, colores y tipografía de qualivo.io (blanco, #101319, #27BDB1, #0E7C74, lila #EFECFB, Montserrat), sin reutilizar las imágenes del Instagram personal.
El capítulo 1 «Agentizando mi propia empresa» (`content/newsletter/2026-09-24.md`) es un diario personal de Maikel: si sale, sale como newsletter de LinkedIn de Maikel, no como la de Qualivo.

Prueba de la newsletter de plantones enviada a info@maikelechevarria.com el 24-sep (asunto «[PRUEBA] Le guardaste la hora. No vino.»), desde el Gmail conectado. Versión de correo con tablas y estilos en línea: `content/newsletter/correo/2026-09-25-plantones.html`. El botón GUÍA abre un correo a info@maikelechevarria.com; el de diagnóstico lleva UTM (newsletter / email / plantones).

Segunda prueba de la newsletter (24-sep): en la primera, el gestor de correo de Maikel se comió los fondos (cajas negras, lilas y botones en blanco, texto claro invisible). Arreglado con el color de fondo también como atributo de cada tabla y celda, botones hechos con celdas y la línea de tiempo en vertical. Regla para los correos: nunca un fondo solo en el estilo; siempre bgcolor más background-color, y botones en celda.

### Jueves 24 · tarde · newsletter en GHL

Maikel: «¿podemos montarlo en GHL y enviarlo de forma automática a la base de
datos?». Hecho: plantilla de correo creada en GHL (Marketing › Emails ›
Plantillas, «Newsletter Qualivo · Le guardaste la hora (plantones)»), con el
HTML de `content/newsletter/correo/2026-09-25-plantones.html`. No se ha
enviado a nadie.

Recuento de la base (24-sep, solo cifras):

| Grupo | Contactos |
|---|---|
| Total en GHL | 1.112 |
| Con correo | 652 |
| Pidieron el diagnóstico o entraron por Meta, web o reactivación, con correo y sin baja | 119 |
| De esos, sin cita | 102 |
| De esos, entraron hace más de 9 días (cadencia terminada) | 22 |
| Outbound en frío (Apollo, HubSpot) y base antigua sin consentimiento claro | el resto |

Recomendación: mandarla solo a los 22 (cadencia terminada, sin cita, sin
baja). Los 80 que siguen dentro de la cadencia de 9 días no, porque Raquel
les va a volver a llamar (queja de agosto). El outbound frío y la base
antigua no, porque nunca pidieron recibir correos nuestros. El envío
automático queda pendiente del sí de Maikel con la audiencia elegida.

## Viernes 25 de septiembre de 2026

### Publicado

- **Artículo nuevo:** https://qualivo.io/blog/coste-por-lead/ («Coste por lead: el número que te engaña si lo miras solo»). Dato real: anuncios del 18 al 22-sep por sector (brief de la semana 38). Reformas y formación salen casi al mismo coste por lead (10,00 € y 10,85 €), pero formación sacó cuatro citas y reformas dos, así que la cita cuesta unos 22 € en uno y unos 45 € en el otro. Caso EAC como prueba de medir hasta la venta. Tarjeta en el blog, sitemap, llms.txt y registro de keywords.
- **Reorientado:** `blog/como-captar-clientes/`. Los dos últimos párrafos del paso 5 llevan ahora el dato del coste por lead contra el coste por cita, con enlace al artículo nuevo. La llamada a la acción es un solo botón al diagnóstico. dateModified a 25-sep.

### Borradores (sin publicar)

- **Viernes, tesis contraria:** «Una automatización que falla en silencio sale más cara que no tenerla». Imagen `content/infografias/2026-09-25/falla-en-silencio.png`, texto de LinkedIn y pie de Instagram en `content/borradores/2026-09-25-tesis-falla-en-silencio.md`. Dato: el primer mensaje automático a los contactos nuevos estuvo casi dos días sin salir (22 a 24-sep) con la etiqueta de «enviado» puesta, y lo vio Maikel por una captura (daily de Growth del 24-sep). Se deja fuera, a propósito, que el mensaje es un WhatsApp (regla del 663) y el mensaje cruzado a otro contacto (datos de un tercero).

### Master Reviewer (25-sep)

Informe en `content/borradores/revision-master-reviewer-2026-09-25.md`. El artículo sacó un 6 y el post un 7, las dos piezas con veredicto «publicar con cambios». Aplicados todos los críticos:
- **Artículo.** Los 291,90 € eran de cuatro sectores; ahora se explica que asesorías se paró sin contactos. Una de las dos citas de clínicas entró por la web. Formación tiene 4 citas y no 5: el resumen del brief dice 5, pero el detalle lead a lead da 4, y me quedo con lo que se puede comprobar, así que la cita sale a unos 22 € y no a 17 €. Además: fuera el enlace al artículo que publica el «5 de 9», la etiqueta descrita como es de verdad (el anuncio va apuntado en el contacto), el panel en lugar de un «informe de la mañana» que no da ese dato, fuera «lo agentizamos», el caso EAC dicho como lo cuenta su página y el schema de la FAQ igual que la FAQ visible. Corregida también la línea de llms.txt.
- **Post.** Fuera el «lo peor no es eso», «captura del CRM», remate corregido y «un mensaje automático de mi sistema» en texto e imagen, para que nadie lo lea como WhatsApp automatizado desde el 663. Imagen regenerada.
- **Queda para otro día (fuera del alcance de hoy).** El «5 de 9» del artículo del 23-sep, que depende de la decisión de Maikel. La fila 9 de `serie-buscando-la-fuga-por-etapa.md`, que tiene el mismo error de la etiqueta. El enlace desde el pilar de métricas. El resumen del brief, que no cuadra con su propio detalle.

### Decisiones que dejo tomadas

- Hoy no toca capítulo de newsletter (solo los miércoles). La de plantones sigue en la plantilla de GHL, sin enviar.
- La tesis sale con el fallo propio porque es lo que la hace creíble. El arreglo va detrás, con una regla que cualquiera puede aplicar sin tener agentes: «no le preguntes si lo hizo, mira si pasó».

### Descartes

- Un artículo sobre «cuánto cuesta un lead en clínicas». Con cuatro leads y una cita que entró por la web, no por el anuncio, no da para una cifra por sector que se sostenga. En el artículo de hoy clínicas aparece solo en la tabla.

### Pendiente de Maikel

1. Newsletter de plantones: ¿se envía a los 22 (cadencia terminada, sin cita, sin baja)? ¿La mandas tú desde GHL o la mando yo con tu ok?
2. ¿Quito el «5 de 9» de los artículos del 23 y 24-sep y del borrador de bandera roja? Recomiendo que sí, por tu regla del 24-sep.
3. LinkedIn sigue en pausa. Hay tres piezas listas (bandera roja, «¿eres una máquina?», falla en silencio).
4. Borradores de Gmail para Betlem y Patrizia, esperando tu envío. Falta confirmar la hora de Renato y cancelar la reserva duplicada de Armando.

### Hipótesis

- El coste por cita separa mejor los sectores que el coste por lead. Lo comprobaré con la semana 39 cuando haya más citas por sector.

## Lunes 28 de septiembre de 2026

### Publicado

- **Artículo nuevo:** https://qualivo.io/blog/formulario-de-facebook-o-landing-page/ («Formulario de Facebook o landing page: qué trae más citas»).
  - Dato real, del daily de Growth del 27-sep: de 14 citas de anuncios, 12 entraron por el formulario y 2 por la web.
  - Lo cuento con la advertencia de que casi todo el gasto iba al formulario, así que eso no demuestra que sea mejor.
  - Lo que sí cambia el resultado son las preguntas: las dos nuevas del 27-sep (cuándo y precio de entrada).
  - Registrado en la tarjeta del blog, el sitemap, llms.txt y el registro de keywords.
- **Reorientado:** `blog/captacion-de-leads/`. Error 3 y destacado reescritos con enlace al artículo nuevo. Cierre con un solo botón al diagnóstico. dateModified a 28-sep.
- **Corregida** la tarjeta del artículo del viernes en el índice del blog: decía «más del doble» y son el doble (4 citas frente a 2 tras la revisión).

### Borradores (sin publicar)

- **Lunes, «Agentizando mi propia empresa»: «Dos preguntas antes de la llamada».**
  - Imagen: `content/infografias/2026-09-28/dos-preguntas.png`.
  - Texto y ficha: `content/borradores/2026-09-28-agentizando-dos-preguntas.md`.
  - Dato: el formulario nuevo y las rutas por nivel a las 2 h 30 (A llama Maikel, B y C una llamada del comercial IA, D nadie), sacadas del código (`api/activacion.js`, `api/_scoring.js`).

### Decisiones que dejo tomadas

- **Precio de entrada:** no pongo la cifra en el blog ni en el post, aunque ya aparece en el formulario del anuncio. La pieza se sostiene sin ella y así no se convierte en el tema.
- **Primeros 20 contactos:** uso el recuento lead a lead y no el resumen del brief. La tabla da 6 que no invertían nada y el resumen dice 5. Con 14 de 20 por debajo de 500 € o en cero, la frase es la misma de todas formas.
- **Dato propio que falta:** no publico cuántas reuniones se celebraron por cada vía. Deja deducir la tasa de plantones, regla de Maikel.

### Master Reviewer (28-sep)

Informe completo en `content/borradores/revision-master-reviewer-2026-09-28.md`.

| Pieza | Nota | Veredicto |
|---|---|---|
| Artículo | 6 | publicar con cambios |
| Reorientación de captación | 8 | publicar |
| Post | 7 | publicar con cambios |

Aplicados todos los críticos.

- **Artículo:**
  - Fuera el «no es X, es Y» del arranque y de la regla.
  - Lo que no he podido comparar va como opinión o hipótesis, no como hecho: formulario frente a landing, «dos toques».
  - La nota se explica como es. «Este mes» y «sí» suben la nota, pero no llevan solos a la llamada de Maikel.
  - La medición es por nivel y por ruta, no «por vía con el mismo anuncio».
  - El «Sigue leyendo» ya no enlaza a un artículo que publica la tasa de plantones.
- **Post:**
  - Fechas corregidas.
  - La nota como criterio.
  - En la imagen, la pregunta real del precio con la cifra tapada.
- **Otros ficheros:**
  - `llms.txt` sin la construcción prohibida.
  - Schema de captación sin «no es X sino Y».
  - `coste-por-lead` en pasado («el formulario preguntaba cuánto invertía»), para que no contradiga el de hoy.

**Aviso importante del revisor.** La cifra de citas y plantones de la semana 38 («9 citas, 5 plantones») sigue publicada en cinco sitios: `blog/que-poner-en-tu-negocio-para-atraer-clientes/`, `blog/leads-pero-no-ventas/`, `blog/cliente-no-se-presenta-a-la-cita/`, `blog/index.html` y `llms.txt`. Va contra la regla de Maikel. No lo toco sin su ok, porque cambia tres artículos publicados. Lo añado a la pregunta pendiente del «5 de 9».

### Pendiente de Maikel

1. **Precio en redes y blog:** ¿se dice la cifra en redes o en el blog? Recomiendo que no, de momento.
2. **Pendientes de la semana pasada:**
   - Newsletter de plantones: ¿a los 22, desde GHL o con mi envío?
   - Quitar la tasa de plantones («5 de 9», «9 citas, 5 plantones») de los cinco sitios donde aparece. Recomiendo que sí, hoy mismo: tu regla lo pide y son cambios de una frase.
   - Levantar la pausa de LinkedIn. Ya hay cuatro piezas listas.

### Hipótesis

- **Formulario nuevo:** las dos preguntas bajan el volumen, pero suben las reuniones celebradas. Se comprueba el lunes 5 de octubre con el dato de Growth, y ese mismo día sale la segunda parte del post, con el resultado, sea el que sea.

## Martes 29 de septiembre de 2026

### Corrección de lo de ayer (lo primero)

El formulario con precio se paró el 28-sep, un día después de empezar. Maikel volvió al anuncio y al formulario de la semana anterior («pon 20 en la que funcionaba», «déjalo todo como estaba la semana pasada»; bus de Growth del 28-sep).

El artículo del lunes decía que el experimento seguía siete días. Está corregido:
- una sección nueva, «Lo que probé el 27 de septiembre (y por qué lo paré al día siguiente)»;
- el «En 30 segundos», llms.txt y el sitemap, con fecha del 29-sep.

El borrador del lunes queda EN PAUSA, con una versión 2 que cuenta lo que pasó: «Puse el precio en el formulario. Lo quité al día siguiente.».

En Todoist, las dos tareas que dependían del experimento cambian a la versión 2.

### Publicado

- **Artículo nuevo:** https://qualivo.io/blog/ahora-no-es-el-momento/ («"Ahora no es el momento": qué hacer cuando un cliente te lo dice»).
  - Dato real: tres objeciones de conversaciones con clientes (dailies de Growth del 27 y el 28-sep). Una no era su momento. Otra fue un sí de palabra con arranque el 13-oct y el cobro alineado con él. La tercera no había entendido el servicio.
  - Sin nombres.
  - Registrado en la tarjeta, el sitemap, llms.txt y las keywords.
- **Reorientado:** `blog/embudo-de-ventas/`. El último párrafo antes de las FAQ, dividido en dos: la fuga de los «ahora no» sin fecha en la flecha de oportunidad a venta, con enlace al artículo de hoy y al diagnóstico. Cierre con un solo botón.

### Borradores (sin publicar)

- **Martes, «la objeción de la semana»** (la serie que antes se llamaba «Sin humo», un nombre que ya no se usa): «Sí. Pero más tarde.».
  - Imagen: `content/infografias/2026-09-29/si-pero.png`.
  - Texto y ficha: `content/borradores/2026-09-29-objecion-si-pero-mas-tarde.md`.
    - El acierto: el sí se resolvió sin tocar el precio, alineando el cobro con el arranque.

### Master Reviewer (29-sep)

Informe en `content/borradores/revision-master-reviewer-2026-09-29.md`. Notas: artículo 6, reorientación 8, borrador 6 y corrección de ayer 6. Las cuatro salen con «publicar con cambios». Aplicados los 30 críticos. Lo importante:

- **Un sí de palabra.** No se cuenta como hecho cerrado. Tampoco se dice quién propuso alinear el cobro, porque la fuente no lo dice.
- **Nada inventado.** Fuera «le encajaba todo» y «me dolió más». Fuera las citas entre comillas que no están en la fuente.
- **El copiloto, como es de verdad.** Redacta respuestas a lo que escribe el contacto, y las mando yo. No prepara mensajes por fecha.
- **El formulario con precio, con toda la historia.** El lunes llegó a montarse aparte, a 15 € al día, y después se pausó. Motivo real: el formulario de antes es por el que entró el único sí. Ya no se dice «jugarme lo que funcionaba», que era inventado.
- **Embudo.** La flecha correcta es de oportunidad a venta. Y el eyebrow «Conceptos, sin humo» pasa a «Conceptos».
- **Imagen del martes.** Sin rótulo de serie: «Lo que no se tocó: el precio / Lo que se movió: el arranque y el cobro».

### Decisiones que dejo tomadas

- **El formulario con precio no se vende como experimento en marcha.** Contarlo como «lo probé y lo paré» es más honesto y además da mejor pieza.
- **El sí del 13-oct se cuenta sin nombre, sector ni importe.** Si se cae antes del arranque, la pieza no sale o sale contándolo.

### Descartes

- Un artículo sobre «el cliente que pide 6 o 7 presupuestos y busca lo barato» (objeción de reformas del 28-sep). Es un solo caso, y el lead todavía no ha tenido la reunión (miércoles 30). Queda para cuando haya reunión.

### Pendiente de Maikel

1. **Tasa de plantones publicada en cinco sitios:** ¿la quito? Recomiendo que sí.
2. **Versión 2 del post del lunes y borrador del martes:** aprobarlos cuando se levante la pausa de LinkedIn.
3. **Nurturing:** falta el enlace del vídeo y el ok. Newsletter de plantones: decidir si sale a los 22.

### Hipótesis

- La objeción de encaje («yo quería otra cosa») apunta a cómo se explica Qualivo en la web y en el anuncio. Si se repite esta semana, propongo una pieza sobre «qué hace un agente en cada punto del recorrido», con un ejemplo por sector.

## Miércoles 30 de septiembre de 2026

### Coordinación con la otra sesión de contenido

Esta noche otra sesión ha dejado mucho contenido de octubre:
- el calendario (`content/calendario-contenidos-octubre-2026.md`);
- tres carruseles, guiones de voz y anuncios con IA;
- los correos de la semana y el playbook del lead A/B;
- un simulador del embudo como imán de leads.

**Lo sigo, no lo duplico.** El capítulo de la newsletter del jueves (tarea D) ya está: el correo «Lo que vamos a hacer en octubre», en `content/newsletter/2026-10/`. No escribo otro.

Tres choques de reglas que dejo escritos para Maikel:
1. **Resultados de clientes en redes.** El calendario recuerda la regla de agosto (`content/growth-os.md`): sin resultados de clientes en contenido editorial, ni anonimizados. Mi borrador del martes («Sí. Pero más tarde», un sí de palabra de un cliente) se acerca a esa línea. **Lo retengo** hasta que Maikel decida. El artículo «ahora no es el momento» cuenta objeciones de clientes sin cifras ni resultados. Lo dejo publicado, pero lo señalo.
2. **Cámara.** El calendario dice «Maikel no sale a cámara en octubre». Su instrucción del plan de octubre pide probar «Maikel a cámara vs voz IA/demo», y en Todoist hay una tarea para grabar un vídeo a cámara. Hay que saber cuál manda.
3. **Precio.** El calendario dice ni precio ni garantía en ningún contenido. Ya lo cumplíamos: el precio iba tapado en la imagen del lunes.

### Publicado

- **Artículo nuevo:** https://qualivo.io/blog/primera-reunion-con-un-cliente/ («Primera reunión con un cliente: cómo prepararla para que acabe en un siguiente paso»).
  - Dato real, del daily de Growth del 29-sep: el diagnóstico pasó de 15 a 30 minutos, con huecos de hora en hora, porque las reuniones se alargaban. Y una llamada de «te estamos esperando» recuperó una reunión en el momento.
  - Estructura, sacada del guion de venta v1.
  - Registrado en la tarjeta del blog, el sitemap, llms.txt y las keywords.
- **Reorientado:** `blog/cliente-ideal-b2b/`.
  - El error 3 y un párrafo nuevo llevan el ICP a la primera reunión, con enlace al artículo de hoy y al diagnóstico.
  - El error 2 pierde el «no es un perfil: es una esperanza».
  - El cierre queda en un solo botón.

### Borradores (sin publicar)

- **Miércoles, bandera roja:** «Mis reuniones de 15 minutos se alargaban».
  - Imagen: `content/infografias/2026-09-30/reuniones-15.png`.
  - Texto y ficha: `content/borradores/2026-09-30-bandera-roja-reuniones.md`.
  - Solo habla de cómo trabaja Qualivo, sin clientes.

### Master Reviewer (30-sep)

Informe en `content/borradores/revision-master-reviewer-2026-09-30.md`.

| Pieza | Nota | Veredicto | Qué he hecho |
|---|---|---|---|
| Artículo | 6 | Publicar con cambios | Aplicados los 13 críticos |
| Reorientación | 7 | Publicar con cambios | Aplicado el único crítico |
| Bandera roja | 4 | Rehacer | Rehecha con sus 7 críticos |

- **Artículo:**
  - Fuera los «siempre» y «casi siempre».
  - Fuera «la siguiente persona esperaba».
  - Fuera «una demo de veinte minutos».
  - La tarjeta del blog y la og:description están corregidas.
- **Bandera roja:**
  - Fuera la causa inventada («si se alarga es que interesa»).
  - Fuera el consejo de dar más tiempo a la reunión. Contradecía lo que hace Qualivo: anuncia 30 minutos y reserva la hora.
  - Fuera «lo cambié en los mensajes y en el agente», que dejaba leer mensajes automáticos desde el número de Maikel.
  - Imagen regenerada, sin rótulo.

El revisor recomienda no publicar más contenido sobre plantones hasta que Maikel decida sobre la tasa publicada. Lo aplico desde hoy.

### Descartes

- **Un artículo sobre el recordatorio de cita.** Se come la keyword secundaria del artículo del 23-sep («recordatorio de cita»). Va mejor como pieza de la semana 1 (plantones), empujando ese artículo, como propone el calendario.
- **Bandera roja con «el lead que no recuerda haber pedido el diagnóstico»** (daily del 29-sep). Es un solo caso y no sé cuánto tardamos en contactarle. No puedo atribuir la causa.

### Pendiente de Maikel

1. **Regla de agosto** (sin resultados de clientes en redes): ¿sigue en pie? Si sí, retiro del todo el borrador del martes. Recomiendo mantenerla hasta que haya un cliente que autorice su caso.
2. **Cámara en octubre:** ¿sí o no? Hace falta la respuesta antes de la semana 2 (anuncios).
3. **Tasa de plantones publicada:** ¿se quita? Sigue siendo lo más urgente.

### Hipótesis

- Si el diagnóstico de 30 minutos reduce las reuniones sin siguiente paso, se verá en la semana 4 (días de propuesta a decisión). Hay que apuntar desde ya, en cada reunión, si acabó con fecha.

## Jueves 1 de octubre de 2026

### Publicado

- **Artículo nuevo:** https://qualivo.io/blog/cualificar-leads/ («Cualificar leads: por qué el formulario no basta»).
  - Dato real: dos reuniones del 30-sep (daily y meta-capi de Growth). En las dos, el formulario prometía más encaje del que había. Un contacto de nivel A no encajaba. Otro marcó de 500 a 2.000 € al mes y vivía del boca a boca.
  - Se cualifica en tres capas (formulario, primera conversación, comportamiento) y se le devuelve a Meta quién encajó.
  - Va sin nombres.
  - Registrado en la tarjeta, el sitemap, llms.txt y las keywords.
- **Reorientado:** `blog/que-es-un-lead/`. Sus dos últimos párrafos enlazan ahora a coste-por-lead y al artículo de hoy, y he quitado la raya larga. Cierre con un solo botón.

### Borradores (sin publicar)

- **Jueves, «Agentizando»:** «Le digo a Meta quién encajó».
  - Imagen: `content/infografias/2026-10-01/le-digo-a-meta.png`.
  - Texto y ficha: `content/borradores/2026-10-01-agentizando-le-digo-a-meta.md`.
  - El acierto: el sistema devuelve contactado, cualificado y descartado, también después de la reunión.
  - El fallo, corto: diez días sin que llegara casi nada a Meta.

### Master Reviewer (1-oct)

Informe en `content/borradores/revision-master-reviewer-2026-10-01.md`.

| Pieza | Nota | Veredicto | Críticos aplicados |
|---|---|---|---|
| Artículo | 6 | Publicar con cambios | 16 |
| Reorientación | 7 | Publicar con cambios | 3 |
| Borrador | 6 | Publicar con cambios | 6 |

Lo importante:

- **Las dos preguntas** («cómo os llegan los clientes», «quién lo va a usar») no son lo que hacemos hoy. Van como hipótesis sin medir.
- **Las campañas siguen optimizando por leads.** El cambio a calidad es una propuesta para el 5-oct. Por eso fuera «así Meta busca más contactos como los buenos».
- **El servicio, como consta:** puntuación de contactos sobre tus herramientas, con una nota que se mueve.
- **El fallo, con su cifra:** 2 «contactado» y 0 «cualificado» en diez días.
- **Tarjeta del blog y llms.txt:** corregidas igual.

**Duda para Growth.** La entrada meta-capi de las 15:20 del 30-sep, la del lead de reformas que marcó 500-2.000 € y vivía del boca a boca, lleva un id distinto al de Fran. El daily de las 19:50 aún daba la reunión de Fran como pendiente. El caso se sostiene porque está escrito en esa entrada, pero antes de reutilizarlo hay que saber de qué lead es.

### Decisiones que dejo tomadas

- **Dato que no publico:** el «36 de 37 entraron por el formulario y tienen 8 reuniones celebradas» (daily del 30-sep). Junto con las citas ya publicadas, deja deducir la tasa de plantones.
- **Clínicas:** Maikel la reactivó el 30-sep porque, aunque el contacto sea caro, sus leads tenían buena pinta. Encaja con el artículo de coste por lead, pero no lo cuento en redes hasta que la decisión tenga resultado.

### Descartes

- **Una pieza sobre los tests de dolor de formación y clínicas** (montados en pausa el 30-sep, salida prevista el 1-oct con el ok de Maikel). Es un experimento sin empezar y no se publica nada hasta que termine. Regla del análisis del 30-sep.

### Pendiente de Maikel (sin cambios desde ayer)

1. **Las cuatro reglas por decidir:**
   - resultados de clientes en redes;
   - cámara en octubre;
   - precio en el contenido;
   - quitar la tasa de plantones.
2. **LinkedIn:** levantar la pausa. Ya hay seis borradores listos de esta semana y la anterior.
3. **DNS de qualivo.io:** arreglarlo. Y el ok a los UTM del blog (análisis del 30-sep).

### Hipótesis

- Si el lead A que no encaja se repite, la pregunta que falta en el formulario es quién va a usar el sistema. Lo apunto para el test de formularios de Growth (12 al 25-oct).

## Viernes 2 de octubre de 2026

### Novedades de la operación que afectan a contenido

- **Nurturing por correo encendido** el 1-oct (otra sesión, commits 4ec9c22 y 71f876d):
  - formación y clínicas;
  - solo para leads nuevos;
  - 6 toques: días 0, 2, 5, 8, 12 y 20;
  - sustituye a la bienvenida.
  - Las versiones que maqueté el 28-sep son la base.
  - **Pendiente de comprobar:** si el DNS (SPF y DMARC) ya está arreglado. Si no, esos correos pueden caer en spam. Lo dejo escrito para Maikel.
- **Raquel llama ahora desde el 647**, el mismo número del WhatsApp. No cambia nada del contenido publicado.

### Publicado

- **Artículo nuevo:** https://qualivo.io/blog/origen-de-los-leads/ («Origen de los leads: cuando tu CRM te dice que entraron por donde no entraron»).
  - Dato real, de los dailies de Growth del 1-oct y del 30-sep. Las etiquetas daban 36 de 38 contactos de pago entrados por la web, porque la etiqueta de web la ponía también el formulario. Otro recuento del mismo CRM daba 36 de 37 por el formulario. Además, el CRM guarda la primera fuente.
  - Registrado en la tarjeta del blog, el sitemap, llms.txt y las keywords.
- **Reorientado:** `blog/metricas-de-marketing/`.
  - Tras la lista «Cómo construirlo», el caso del origen mal etiquetado, con enlace al artículo de hoy.
  - Raya larga quitada.
  - Cierre con un solo botón.

### Borradores (sin publicar)

- **Viernes, tesis contraria:** «Tener el dato no sirve de nada si la etiqueta dice dos cosas».
  - Imagen: `content/infografias/2026-10-02/etiqueta-miente.png`.
  - Texto y ficha: `content/borradores/2026-10-02-tesis-etiqueta.md`.

### Master Reviewer (2-oct)

Informe en `content/borradores/revision-master-reviewer-2026-10-02.md`.

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| Artículo | 6 | publicar con cambios | 8 |
| Reorientación | 7 | publicar con cambios | 1 |
| Tesis | 5 | publicar con cambios | 5 |

Aplicados todos. Las cifras del CRM cuadraban con el bus. Lo que fallaba era la historia de cómo se vio el error:
- **Quién preguntó y cuándo.** La pregunta la hizo Paid y venía de días atrás. No la hizo Maikel ni fue «esta semana».
- **De dónde sale «casi todos por el formulario».** Viene de otro recuento, el 36 de 37 de septiembre, y ahora se dice así.
- **De dónde salía la lectura contraria.** Salía del mismo CRM, no «de los anuncios».
- **«Antes de mover un euro».** Pasa a «nadie movió tráfico a la web», porque esos días sí se movió dinero por otros motivos.

Imagen regenerada con «36 de 37».

### Decisiones que dejo tomadas

- **Sin citas ni reuniones por vía.** Del mismo daily solo uso el reparto entre web y formulario. Junto a lo ya publicado, dejarían deducir la tasa de plantones.

### Descartes

- **El fallo de llamadas con el 663** (7 de 18 con error de conexión) como pieza. Toca el número personal de Maikel y la regla del 663.

### Pendiente de Maikel

1. **¿Está arreglado el DNS?** Ahora que el nurturing está encendido, es lo más urgente.
2. **Las cuatro reglas por decidir:**
   - resultados de clientes en redes;
   - cámara;
   - precio;
   - quitar la tasa de plantones.
3. **LinkedIn:** levantar la pausa. Hay siete borradores listos.

### Hipótesis

- La etiqueta de entrada única que propone Growth permitirá el lunes 5 contestar de verdad «web o formulario». Si se aprueba, el artículo de hoy tendrá una segunda parte con el dato bien medido.

## Lunes 5 de octubre de 2026

### Hecho desde el viernes (encargos de Growth con el ok de Maikel)

- **Cobertura de LinkedIn para el experimento tipo A.** Cuatro borradores del 6 al 9-oct, en `content/linkedin/2026-10-06-air-cover.md`.
- **Landings con efecto, para revisar:**
  - Plantilla de /para/ en `herramientas/para.js`. Growth ya la ha usado para las 5 cuentas de nivel 1.
  - `equipos-comerciales/v2/`.
  - Capturas en `content/marca/capturas-landings-2026-10-02/`.
- **Aviso de Growth:** la semana 41 empieza hoy, lunes 5 (algunos ficheros decían 6). Mis borradores de LinkedIn ya tenían bien los días: martes 6, miércoles 7, jueves 8 y viernes 9.

### Publicado

- **Artículo nuevo:** https://qualivo.io/blog/equipo-comercial-no-usa-el-crm/ («Tu equipo comercial no usa el CRM: por qué pasa y qué hacer»).
  - Primer artículo pensado para el tipo A (equipos comerciales B2B).
  - Dato real: la limpieza de nuestro propio CRM del 1-oct (bus de Growth). Aparecieron clientes que seguían como abiertos, duplicados, una baja que seguía en «más adelante» y tratos de 0 €.
  - La escena del equipo que trabaja «50 y 50» entre el correo y el CRM va sin nombre.
  - Registrado en la tarjeta, el sitemap, llms.txt y las keywords.
- **Reorientado:** `blog/crm-para-pymes/`. Añadido un párrafo sobre nuestra limpieza, con enlace al artículo de hoy. El cierre queda en un solo botón.

### Borradores (sin publicar)

- **Lunes, «Agentizando»: RETIRADO.** «La IA no sustituye al comercial» (`content/borradores/2026-10-05-agentizando-semiautomatico.md`).
  - El Master Reviewer le puso un 3 y pidió rehacerlo.
  - Describía el WhatsApp como funcionaba el 29-sep. Desde el 1-oct, el primer mensaje a los A/B sale solo a los 10 minutos y el copiloto está apagado.
  - No se reescribe: el post 3 de la cobertura cubre el tema.

### Master Reviewer (5-oct)

Informe en `content/borradores/revision-master-reviewer-2026-10-05.md`.

| Pieza | Nota | Veredicto | Qué he hecho |
|---|---|---|---|
| Artículo | 5 | Publicar con cambios | Aplicados los 15 críticos |
| Reorientación | 7 | Publicar con cambios | Aplicado el único crítico |
| Borrador | 3 | Rehacer | Retirado |

En el artículo:
- **Quién hizo la limpieza y por qué.** La hizo Growth con el ok de Maikel, porque había que pasar a Meta la calidad de los leads.
- **Cantidades exactas.** 3 clientes, 2 duplicados y 2 tratos de 0 €.
- **Fuera la baja que seguía en «más adelante».** Riesgo de protección de datos, por la queja de agosto.
- **El «50 y 50» va atribuido a «un director comercial».** Sin nombre.
- **Fuera el enlace a /equipos-comerciales/.** Es un borrador sin indexar.

Corregido también, fuera de las piezas revisadas:
- **`blog/ahora-no-es-el-momento/`.** Decía que el agente le redacta las respuestas a Maikel y él las manda. Con el copiloto apagado, ya no es verdad. Quitada esa frase.
- **La propuesta de la semana 41.** Lleva un aviso: la pieza «semiautomático» ya no se publica tal cual.

**Para Maikel:** desde el 1-oct, a los leads A/B el primer WhatsApp les sale solo a los 10 minutos desde la pasarela de tu número personal. Va contra la regla de no enviar nada automático desde el 663. No es tema de contenido, pero lo dejo escrito para que lo veas con Growth.

### Pendiente de Maikel

1. **Aprobar los 4 posts de cobertura**, el primero para mañana martes a las 8:30. Sin ok de publicación, la prospección del miércoles empieza sin cobertura.
2. **Elegir qué versión de equipos comerciales va a producción.** La v2 tiene efectos y menos texto.
3. **Siguen pendientes:**
   - el DNS, con el nurturing ya encendido;
   - la tasa de plantones;
   - los resultados de clientes en redes;
   - la cámara.

### Hipótesis

- Si la prospección tipo A trae visitas a los artículos de CRM, se verá en Search Console y en las páginas /para/ con visita humana. Lo miraré el viernes 9 con Growth.

## Martes 6 de octubre de 2026

### Publicado

- **Artículo nuevo:** https://qualivo.io/blog/cuanto-invertir-en-publicidad/ («Cuánto invertir en publicidad: empieza por lo que te deja un cliente»).
  - Dato real, del daily de Growth del 5-oct: un contacto entró con la nota más alta por inversión y volumen, y en la reunión vimos que su servicio era de precio bajo. El formulario no lo preguntaba.
  - El caso va sin nombre ni cifras de su negocio.
  - El ejemplo de cuenta (300 € y uno de cada diez) va marcado como ejemplo.
  - Registrado en la tarjeta del blog, el sitemap, llms.txt y las keywords.
- **Reorientado:** `blog/cuanto-cuestan-anuncios-facebook-instagram/`.
  - Nuevo párrafo tras «Cuánto deberías invertir», con el caso y el enlace al artículo de hoy.
  - Cierre con un solo botón.

### Master Reviewer (6-oct)

Informe en `content/borradores/revision-master-reviewer-2026-10-06.md`. Nota 5 al artículo y 8 a la reorientación, las dos para publicar con cambios. He aplicado los 13 críticos. Lo importante:

- **Quién propuso añadir la pregunta.** Fue Growth, a Paid, y la decisión sigue pendiente. No es «nuestro equipo la ha añadido».
- **Cómo funciona la nota.** Va de la A a la D y decide quién llama si el contacto no contesta. No decide a quién se llama primero.
- **Construcciones «no es X, es Y» disfrazadas:** fuera.
- **Paso 4 añadido** (presupuesto del mes), para que el artículo esté completo frente al de Meta.

**Decisión propia, por prudencia.** El contacto sigue abierto: compara agencias y tiene llamada el 15-oct. He quitado la fecha y he dejado de decir que su precio es «bajo». Ahora pone «el precio de su servicio cambiaba toda la cuenta». Si leyera el artículo, no encontraría un juicio sobre su negocio. Maikel puede pedirme que quite el caso entero.

### Borradores

- **Martes:** no hago pieza nueva. La semana de redes ya está cubierta con los cuatro posts de cobertura (`content/linkedin/2026-10-06-air-cover.md`), y el primero toca hoy a las 8:30. Una pieza más diluiría la coherencia que buscamos con la prospección.

### Descartes

- **La objeción «lo estoy comparando con otras agencias»** (reunión del 5-oct). Es un solo caso y la decisión llega en una o dos semanas. Mejor esperar al resultado.

### Pendiente de Maikel

1. **Post 1 de la cobertura, si lo apruebas para hoy.** Los cuatro posts están en `content/linkedin/2026-10-06-air-cover.md`.
2. **Ojo con la sección de captación de `/home-nueva/`:** dice que las campañas aprenden de quién compra, y hoy no es así.
3. **Siguen abiertos:**
   - el WhatsApp automático desde tu número para los leads A/B;
   - el DNS;
   - la tasa de plantones publicada;
   - si se cuentan resultados de clientes;
   - si sales a cámara.

### Hipótesis

- Si se añade al formulario la pregunta de cuánto cobra la empresa por su servicio principal, bajarán los leads de nivel A que luego no encajan por precio. Se podrá medir con el test de formularios del 12 al 25-oct.

### Martes 6-oct · tarde · tasa de plantones retirada (P0 del diagnóstico)

Maikel compartió el diagnóstico de Notion «Diagnóstico de contenido y nuevo Content OS · 6 oct 2026». Su P0 es retirar las cifras de plantones publicadas. Hecho:

- **`blog/cliente-no-se-presenta-a-la-cita/`.** Sin «5 de 9» ni «cinco plantones». La tabla se queda solo con «sector / qué pasó».
- **`blog/leads-pero-no-ventas/`.** Fuera las cifras de plantones.
- **`blog/que-poner-en-tu-negocio-para-atraer-clientes/`.** Fuera las cifras de plantones.
- **`blog/index.html` y `llms.txt`.** Quitadas también.
- **Lo que se queda.** Las cifras de citas que no dejan deducir la tasa: 14 citas, 12 por el formulario, y el reparto por sector del artículo de coste por lead.

### Martes 6-oct · noche · Content OS v1

Con el ok de Maikel, queda escrito `content/content-os-v1.md`. Desde hoy es la fuente de verdad de contenido. Recoge:

- el diagnóstico de Notion;
- el plan de octubre;
- el brief del Head of Content;
- la guía de voz;
- el análisis de septiembre.

Lo principal:

- **Revenue Journey** como marco de marca.
- **Dos capas de marca:** Maikel y Qualivo.
- **18 reglas en un solo sitio.** La de resultados de clientes cambia: se pueden usar con permiso escrito.
- **Una obsesión comercial por semana** en vez del artículo diario.
- **SEO por autoridad temática**, con el pilar «cómo gestionar un lead».
- **Convención de UTM.**
- **Gobernanza con un solo Head of Content.**
- **La lista de documentos** que quedan como históricos.

**Pendiente de Maikel:** las ocho decisiones de su §12. La que más urge es la D1, levantar la pausa de LinkedIn pieza a pieza.

### Martes 6-oct · noche · UTM en el blog (primer paso del Content OS)

- **Los 79 botones al diagnóstico de los 47 artículos llevan ya UTM.** Todos con `utm_source=blog`, `utm_medium=organic` y `utm_campaign=articulo`. En `utm_content` va el nombre de cada artículo.
- **Cómo llega el dato.** El formulario de `/diagnostico/` ya mandaba `location.search` al CRM. Ahora cada lead que viene del blog llega con el artículo del que sale.
- **Ojo:** `api/diagnostico.js` convierte `utm_content` en la etiqueta `creativo-<slug>`. En el blog, esa etiqueta es el artículo, no un anuncio.
- **Para los artículos nuevos:** la regla queda apuntada en `content/estandar-articulos.md`.

### Martes 6-oct · noche · DNS resuelto

Maikel confirma que el DMARC está hecho y que qualivo.io ya envía el nurturing. Lo he comprobado en el DNS público:

- **SPF** de Google en la raíz y de Resend en `send.qualivo.io`.
- **DKIM** de Google y de Resend.
- **DMARC** con `p=none`.

En el Content OS, la D8 queda cerrada y la R17 ya no bloquea la newsletter por el DNS. Cada envío sigue necesitando el ok de Maikel.

### Martes 6-oct · noche · piezas de la semana 41 en Notion

Maikel pidió ver las piezas de la semana. Están en la página de Notion «Piezas de la semana 41 · 5-11 oct», debajo del Content OS, con una casilla de aprobación en cada una.

**Fechas que propongo:**
- **LinkedIn de cobertura:** el post 1 el miércoles 7, el 2 el jueves 8 y el 4 el viernes 9.
- **El post 3 espera** a que se hable con Growth del WhatsApp automático (R2 y R9).

**Corregido hoy:**
- **Carrusel de plantones v2.** Fuera «Casi nunca lo es» de la lámina 1, porque no tenía fuente. Del pie de foto quito «casi nunca» y «casi siempre», que tampoco la tenían, y un «no es X, es Y».
- **Newsletter de plantones.** «Quince minutos» pasa a «unos 30 minutos», que es lo que dura la llamada.

**Recomiendo no enviar la newsletter esta semana.** Le quedan tres cosas:
- un «casi nunca» sin fuente;
- el consejo de dar precio antes de la cita, cuando nuestro propio test con precio sigue sin conclusión;
- un preheader con «no es X».

Mi propuesta es arreglarla y enviarla en la semana 45, la de citas.

### Martes 6-oct · noche · lo que no necesita ok (Content OS §13)

Maikel: «ves haciendo todo lo que consideres que no tenga que ir aceptando». Hecho:

- **`content/casos-permisos.md`.** Registro vacío para la R6, con códigos de cliente y sin datos personales, porque el repo es público.
- **Master Reviewer.** Nuevo §13 con las reglas R1 a R18 y la etapa del Revenue Journey. No he tocado el texto que dictó Maikel.
- **Newsletter de plantones corregida:**
  - fuera «Casi nunca es mala educación», que no tenía fuente;
  - el consejo de dar precio antes de la cita pasa a ser «da la cita lo más cerca que puedas», porque nuestro test con precio no tiene conclusión;
  - el preheader con «no es X» pasa a ser «Y la cuenta de verdad llega después».
- **`/home-nueva/v1/`.** La frase «las campañas aprenden de quién acaba comprando, no de…» pasa a ser «Le contamos a Meta qué contactos acaban encajando…». Es lo que hace Growth desde el 28-sep con la API de conversiones.
- **Brief de la semana 42 (cualificación)**, en `content/briefs/2026-10-12-brief-semana-42.md`:
  - el dato sale de `api/_scoring.js` y del daily del 5-oct, anonimizado;
  - 8 piezas, con medición el viernes 16.
- **Señales del Content OS:**
  - una puerta cero en la skill `sistema-contenidos`;
  - un aviso de «histórico» en 13 documentos;
  - el calendario de octubre pasa a ser un banco de piezas;
  - una nota en el brief del Head of Content.

**Pendiente de Maikel:** D1 (LinkedIn), D4 (rutina) y D7 (WhatsApp).

### Martes 6-oct · noche · revisión de la web V2 (ChatGPT) y arreglos que no necesitan ok

Maikel compartió la revisión de ChatGPT de la web V2 y dijo «podemos ir haciendo lo que consideres».

**Documentos:**
- **`content/web-copy-actual-2026-10-06.md`.** El copy de 39 páginas, palabra por palabra, con avisos contra R1 a R18. Se sube a Notion debajo de la revisión.
- **`content/web-v2/decisiones-p0.md`**, también en Notion. Recoge:
  - el posicionamiento;
  - la message house ajustada a nuestras reglas;
  - el CTA único;
  - la arquitectura;
  - qué es Intelligence;
  - la evidencia que podemos afirmar;
  - lo que no cogemos de la revisión (los segundos de respuesta como promesa, los lemas, el CTA «Auditoría»).
- **Content OS.** El recorrido pasa a 7 etapas, que acaban en la reactivación, con Intelligence como capa de medición.

**Arreglos en la web publicada:**
- **Botones.** 82 páginas interiores mandaban «Solicitar diagnóstico» a `/#contacto`. Ahora van a `/diagnostico/`. En el blog, con UTM: 159 botones en total.
- **Caso mal atribuido.** En `/consultoria-ia/`, «8 seg del anuncio al CRM» pasa de EAC a Focus Practical, que es de quien es.
- **`sitemap.xml`:**
  - fuera `/hola/`, que es noindex;
  - fuera las URL repetidas;
  - dentro clínicas, reformas y asesorías.
- **Blog:**
  - fuera la tarjeta repetida de «Cuánto cuesta Google Ads»;
  - «Conceptos, sin humo» pasa a ser «Conceptos» en 7 páginas.

**No lo he tocado, es de Maikel o de Growth:**
- las promesas de respuesta «en dos minutos» y «de noche» (R2), que hay que confirmar con Growth para los sistemas de los clientes;
- la garantía visible;
- los logos y resultados fuera de las páginas de caso;
- el banner de borrador de equipos comerciales.

### Miércoles 7-oct · trabajo del día

**Publicado:**
- **[/blog/pipeline-de-ventas/](https://qualivo.io/blog/pipeline-de-ventas/).** Tema de la semana 41. El dato viene del daily de Growth del 6-oct: siete tareas con fecha, una en cada trato abierto, y los leads buenos que ahora no pueden empezar pasan a «más adelante». Va con tarjeta en el blog, sitemap, llms.txt y registro de keywords.
- **Re-apunte de [/blog/crm-gratis-para-pymes/](https://qualivo.io/blog/crm-gratis-para-pymes/).**
  - Los dos últimos párrafos, sin un «no es X, es Y» y sin cifras de terceros sin fuente.
  - Enlace al artículo nuevo.
  - Un solo CTA al diagnóstico, sin el botón de la calculadora.

**Borrador:** `content/borradores/2026-10-07-bandera-roja-tratos-sin-fecha.md`, con la imagen `content/infografias/2026-10-07/tratos-con-fecha.png`. Es para Instagram, o para LinkedIn el jueves 15 si hoy sale el post 1 de cobertura.

**Revisión del Master Reviewer** (`content/borradores/revision-master-reviewer-2026-10-07.md`): artículo 5, re-apunte 8 y bandera roja 6. Aplicados todos los críticos:
- **El día:** el 6-oct fue martes, no lunes.
- **Las cifras:** «siete tareas», no «siete tratos».
- **Quién lo hizo:** el agente, no Maikel.
- **Lo que no tiene fuente:** fuera «casi nunca» y «casi siempre», y «lo que funciona» pasa a «lo que recomendamos».
- **Voz:** fuera dos «no es X, es Y» disfrazados y el lema en espejo del destacado.
- **El ancla a seguimiento-comercial**, que era un «no es X, es Y» literal. El H1 de ese artículo queda pendiente.

**Descartado:** el capítulo de newsletter del jueves (punto D de la rutina). Con el Content OS la newsletter pasa a quincenal, y el próximo envío previsto es la semana 45, con la de plantones ya corregida. Escribir uno cada semana choca con eso. Se recupera si Maikel mantiene la rutina actual (D4).

**Decisiones para Maikel:**
1. **D1, LinkedIn:** publicar hoy el post 1 de cobertura. Recomendación: sí, coincide con las primeras conexiones de Growth.
2. **D4:** cambiar la rutina de las 7:15 al modelo semanal. Recomendación: sí, porque hoy la rutina y el Content OS se contradicen (artículo diario y newsletter semanal).
3. **D7:** el WhatsApp automático desde su número. Recomendación: hablarlo con Growth antes del post 3.

**Hipótesis para mañana:** si el post 1 sale hoy, las cuentas A que reciben la conexión de Growth miran el perfil y alguna lo comenta o lo menciona al responder. Se mide el viernes con Growth.

### Jueves 8-oct · trabajo del día

**Publicado:**
- **[/blog/objecion-de-precio/](https://qualivo.io/blog/objecion-de-precio/)** («Objeción de precio: qué hacer cuando el cliente dice que no tiene presupuesto»).
  - Tema de la semana 41: siguiente paso. Prepara la 42: cualificación.
  - **Dato real, del daily de Growth del 6-oct:** de los cinco «no» de la semana, cuatro fueron por presupuesto o por momento, y la objeción que más se repetía era la cuota mensual. Ese día se preparó la oferta en dos formas.
  - **Sin nombres ni sector,** porque hay un contacto abierto.
  - Va con tarjeta en el blog, sitemap, llms.txt y registro de keywords.
- **Re-apunte de [/blog/ahora-no-es-el-momento/](https://qualivo.io/blog/ahora-no-es-el-momento/).**
  - El primer párrafo de «Qué hacemos nosotros con esto» lleva el dato y enlaza al artículo nuevo.
  - Un solo botón, como ya tenía.
  - Fuera también un «Casi nunca» sin fuente en una FAQ.
- **Registro de keywords:** apuntado también el re-apunte del 7-oct (`crm-gratis-para-pymes`), que faltaba.

**Borrador:** `content/borradores/2026-10-08-agentizando-se-corrige.md` («Un agente que se corrige por escrito»).
- **Dato:** el 6-oct, Growth respondió a Paid de dónde venían las reuniones de pago, y el 7-oct se corrigió por escrito. Una de ellas venía de una landing y el origen no cuadraba en tres casos.
- **Sin tasas del test**, que sigue abierto (R3), y sin nombres.
- **Cuándo va:** hoy en LinkedIn toca el post 2 de la cobertura si el post 1 salió ayer. Si es así, este queda para el lunes 12.

**Master Reviewer** (`content/borradores/revision-master-reviewer-2026-10-08.md`): artículo 6, re-apunte 6 y LinkedIn 7. Aplicados los 12 críticos. Lo importante:
- la cifra literal es «los cinco «no» de esa semana», no «nuestros últimos cinco» ni «reuniones»;
- el destacado ya no da a entender que cambiar la forma de pago cambie el «no», porque un caso con la versión sin cuota siguió en «no»;
- lo que se propuso añadir al formulario fue solo la pregunta de cuánto cobra la empresa, y sigue pendiente;
- en LinkedIn, la pregunta de Paid y la respuesta de Growth van tal como están en el bus.

**Descartado:** el capítulo de newsletter. Hoy es jueves, no toca (punto D), y además la newsletter va quincenal con el Content OS.

**Decisiones para Maikel:**
1. **D1, LinkedIn:** ¿salió ayer el post 1 de la cobertura? Recomendación: si salió, hoy el post 2 y el borrador de «Agentizando» el lunes 12.
2. **Cifra del artículo:** confirmar con Growth el «4 de 5». Un daily del mismo 6-oct apunta a un sexto contacto como «momento». Recomendación: dejarlo publicado, porque es el literal del daily que nombra los cuatro, y corregirlo si Growth dice otra cosa.
3. **D4:** la rutina diaria frente al modelo semanal del Content OS. Recomendación: pasar al semanal desde el lunes 12, con el brief de la semana 42 ya escrito.
4. **Landing madre /recorrido/v3/:** las decisiones de ayer siguen abiertas:
   - cableado con Growth;
   - el precio visible como prueba;
   - casos fuera de /casos/;
   - el vídeo de la página de confirmación.

**Hipótesis para mañana:** si la cuota mensual es la objeción que más se repite, los leads que piden la versión sin cuota tienen que aparecer ya en el formulario como «precio: depende». Se puede mirar con Growth en el scoring (`precio-depende`) el viernes 16.

### Viernes 9-oct · trabajo del día

**Publicado:**
- **[/blog/quien-decide-la-compra/](https://qualivo.io/blog/quien-decide-la-compra/)** («Quién decide la compra: qué hacer cuando a la reunión no viene el que decide»).
  - Abre la semana 42, la de cualificación.
  - **Dato real, del daily de Growth del 8-oct:** «lo veo con el equipo y te digo» y que a la reunión no llega quien decide estaban entre las objeciones que se repetían.
  - **Del funnel v2 de Growth:** los formularios preparados para la prueba prevista el lunes 12 preguntan quién decide (yo, yo con un socio u otra persona). Además, `/confirmado/` deja preparado un correo para avisar a quien decide.
  - **Sin nombres ni sector,** y sin la reunión del 8-oct, porque es un contacto abierto.
  - Va con tarjeta en el blog, sitemap, llms.txt y registro de keywords.
- **Re-apunte de [/blog/primera-reunion-con-un-cliente/](https://qualivo.io/blog/primera-reunion-con-un-cliente/).**
  - El primer párrafo de «Qué hacemos nosotros con esto» lleva el dato y enlaza al artículo nuevo.
  - Sale la frase de la «herramienta propia para rellenar el diagnóstico en directo», que no he podido verificar (R2).

**Borrador:** `content/borradores/2026-10-09-tesis-quien-decide.md`, tesis contraria: «Antes de preguntar cuánto invierte, pregunta quién decide».
- **Necesita tu ok a la tesis** (R4). Se apoya en tu mensaje del 7-oct: la inversión declarada es una señal bastante mala.
- **Cuándo va:** si la cobertura de LinkedIn empezó el miércoles, hoy toca el post 4 y esta pieza pasa al viernes 16.

**Master Reviewer** (`content/borradores/revision-master-reviewer-2026-10-09.md`): artículo 6, re-apunte 7 y tesis 5. Aplicados los críticos. Lo importante:
- **R5:** fuera la reunión del 8-oct.
- **R2/R3:** la prueba del lunes se cuenta como «prevista», porque los anuncios están pausados, el presupuesto está pendiente y el saldo de Meta sin confirmar.
- **R1:** fuera los «suele» y las causas sin fuente.
- **Tesis:** el caso del 5-oct se cuenta como lo que fue, que faltaba saber lo que cobraba el contacto.

**Lo he visto en el bus y afecta a la landing de ayer:** Growth ha publicado `/gracias/` (calendario y prueba de precio A/B por día) y `/confirmado/` (preparación), dentro del funnel v2. `/confirmado/` cubre lo que propuse en `/recorrido/v3/confirmado/`, así que la mía queda como borrador de referencia y no hay que mantener dos. El precio visible de `/gracias/` es decisión tuya (R10 queda en excepción para esa prueba).

**Descartado:** el capítulo de newsletter. Es viernes, no toca.

**Decisiones para Maikel:**
1. **Tesis del viernes (R4):** ¿suscribes «antes de preguntar cuánto invierte, pregunta quién decide»? Recomendación: sí, y publicarla el viernes 16 con la semana 42.
2. **D1, LinkedIn:** dime qué posts de la cobertura han salido, para cuadrar el banco. Recomendación: post 4 hoy si salieron el 1 y el 2.
3. **D4:** pasar la rutina al modelo semanal desde el lunes 12. Recomendación: sí. El brief de la semana 42 ya está y hoy he abierto su tema.
4. **Landing /recorrido/v3/:** ahora que existen `/gracias/` y `/confirmado/`, decidir si la v3 se monta encima de esas dos páginas o se archiva. Recomendación: decidirlo después del primer cohorte del funnel v2.

**Hipótesis para la semana que viene:** con la pregunta de quién decide en el formulario nuevo, los contactos con «otra persona» llegarán a la reunión más veces sin quien decide que los de «yo». Se puede contar con Growth el viernes 16 cruzando la etiqueta `decisor-*` con las reuniones, sin publicar tasas (R3) mientras dure la prueba.

