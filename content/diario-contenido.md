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
