# Línea de contenido · Agentes (propuesta, 3-nov)

> Decisión de Maikel (3-nov): «la calidad del lead se queda básica; si vendemos sistemas agentizados, hay que ir por ahí, como Pau y los demás».
> Sustituye a los 6 reels del 2-nov (`2026-11-reels-formato-llambi.md`), que quedan como reserva.
> **Propuesta para aprobar. No se publica nada sin el OK de Maikel.**

## La diferencia con Pau, Jaime y Fede

Ellos hablan **de** la IA: noticias, prompts y herramientas. Es el tema más saturado del sector (102 de 290 publicaciones del radar de octubre [C]).
Nosotros la **enseñamos funcionando**: agentes que ya trabajan en Qualivo y en la captación de nuestros leads, con la pantalla, la regla y lo que hacen cuando se equivocan. Nadie de los analizados lo hace con su propia empresa.

## Tres pilares

| Pilar | Qué es | Peso |
|---|---|---|
| **1 · Mi empresa la llevan agentes** | Detrás de cámaras: el Chief of Staff, Growth, Paid y Contenido, el parte diario, un agente que corrige a otro | 40 % |
| **2 · Agentes que no dejan escapar un lead** | Los que trabajan con nuestros leads: el que contesta por WhatsApp, el vigía de 15 minutos, el reenganche, la puntuación, el recordatorio | 40 % |
| **3 · La noticia de IA, traducida** | Al estilo de Pau: qué ha salido esta semana y qué cambia para una pyme que capta clientes | 20 % |

**Formato:** Maikel a cámara, unos 60-100 s, con 2-3 cortes de pantalla real (GHL, Notion, WhatsApp con los datos tapados). Título en dos líneas con una palabra en color. Pie «👉 tema». «Comenta PALABRA» con un recurso útil.

**Reglas que siguen:** ni nombres ni datos de leads o clientes en pantalla (se tapan); ninguna cifra sin fuente; no prometemos lo que el agente no hace.

---

## A1 · «Mi empresa la llevan 8 agentes» (pilar 1)
**Título:** «Mi empresa la llevan / *8 agentes*. Y yo.»
**Pie:** 👉 Cómo se organiza una empresa con agentes de IA
**Gancho:** «Cada mañana, antes de las 9, ocho agentes me dejan su parte. Esto es lo que me cuentan.» (pantalla: el parte diario en Notion)
**Cuerpo:** «Uno lleva los anuncios. Otro, el contenido. Otro mira los números de captación. Y uno, el jefe de gabinete, los coordina y me dice qué necesita de mí. Yo no les reviso el trabajo línea a línea: les reviso los bloqueos. Lo que me llevó tiempo no fue montarlos, fue escribirles las reglas: qué pueden hacer solos y qué me tienen que preguntar. Publicar, gastar o hablar con un cliente, siempre pasa por mí.»
**CTA:** «**Comenta EQUIPO** y te mando cómo están repartidos y las reglas que les puse.»
**Recurso:** mapa de los agentes (qué hace cada uno, qué decide solo, qué pregunta).
**Antes de grabar:** contar los agentes activos ese día y ajustar el número del título.

## A2 · «Un agente corrigió a otro» (pilar 1)
**Título:** «Un agente / *corrigió* a otro.»
**Pie:** 👉 Qué pasa cuando un agente de IA se equivoca
**Gancho:** «El 7 de octubre, un agente de mi empresa corrigió a otro. Por escrito.»
**Cuerpo:** «El de anuncios preguntó qué traía más reuniones. El de captación le contestó con un dato… y al día siguiente vio que lo había contado mal. No lo escondió: mandó la corrección, explicó el error y le pidió al de anuncios que revisara sus cuentas. Eso es lo que más me importa de un agente: no que no se equivoque, sino que lo diga y deje rastro.»
**CTA:** «**Comenta ERROR** y te mando la regla que les pongo para corregirse.»
**Recurso:** la regla de corrección (qué se escribe, a quién, dónde queda).
**Fuente:** borrador `content/borradores/2026-10-08-agentizando-se-corrige.md` [C]. Comprobar el detalle antes de grabar.

## A3 · «El agente que contesta como yo» (pilar 2)
**Título:** «Un agente contesta / mis WhatsApp *como yo*.»
**Pie:** 👉 Un agente que contesta a los leads, y lo que nunca hace
**Gancho:** «Un lead me contestó a las 8:30. Hasta que yo lo vi, nadie le respondió. Desde entonces contesta un agente.»
**Cuerpo:** «Lee toda la conversación y la ficha, contesta en mi tono, y su único objetivo es entender qué le pasa y cerrar una videollamada. Y tiene tres cosas que no hace nunca: no da precios, no promete cifras y, si el lead pide hablar conmigo o algo suena raro, deja de contestar y me pasa el hilo. Lo difícil no es que hable. Es decidir cuándo se calla.»
**CTA:** «**Comenta WHATSAPP** y te mando las reglas que le puse.»
**Recurso:** las reglas del agente de WhatsApp (qué hace, qué no, cuándo avisa).
**Fuente:** `api/_agente.js` (desde el 18-sep) [C]. Sin el nombre del lead.

## A4 · «El vigía de los 15 minutos» (pilar 2)
**Título:** «Ningún lead / se queda *sin respuesta*.»
**Pie:** 👉 Un agente que vigila que nadie se quede sin contestar
**Gancho:** «Un lead estuvo tres horas sin que nadie le escribiera. Ese día monté un vigía.»
**Cuerpo:** «Si entra un contacto, el horario de WhatsApp está abierto y en 15 minutos no ha salido el primer mensaje, me avisa al móvil y por correo. Una sola vez por contacto. No escribe al lead: me avisa a mí para que escriba a mano. Porque cuando algo falla en silencio, la pasarela que llega a su tope o un teléfono mal puesto, nadie se entera hasta que el lead ya se ha ido.»
**CTA:** «**Comenta VIGÍA** y te mando cómo montarlo en tu CRM.»
**Recurso:** receta del vigía (disparador, condición, aviso) para GHL u otro CRM.
**Fuente:** `api/_vigia-primer-mensaje.js` (22-oct) [C]. Sin el código del lead.

## A5 · «Tres intentos y lo descarta» (pilar 2)
**Título:** «Mi agente insiste *tres veces*. / Luego lo deja.»
**Pie:** 👉 Cómo retomar conversaciones paradas sin ser pesado
**Gancho:** «El lead contesta, tú respondes… y silencio. ¿Cuántas veces le vuelves a escribir?»
**Cuerpo:** «Nosotros lo decidimos una vez y se lo dimos a un agente. Tres intentos como mucho, cada uno más espaciado que el anterior. Cada mensaje lo escribe leyendo toda la conversación, nunca una plantilla. Y tras el tercero sin respuesta, lo marca como descartado y deja una nota. Ni lo persigue para siempre ni lo olvida al segundo día.»
**CTA:** «**Comenta TRES** y te mando la regla y ejemplos de los tres mensajes.»
**Recurso:** la regla de reenganche y tres mensajes de ejemplo (ilustrativos).
**Fuente:** `api/_reenganche.js` (21-sep) [C].

## A6 · La noticia de la semana (pilar 3)
**Título:** «[Noticia de IA] / ¿Y a tu *empresa*?»
**Pie:** 👉 [noticia] y qué cambia para una pyme que capta clientes
**Gancho:** «[La noticia en una frase, con fecha y fuente]. Te cuento qué cambia, de verdad, para una empresa como la tuya.»
**Cuerpo:** «[Qué es, en dos frases.] Lo que me importa: [una aplicación concreta a captación o atención de leads]. Lo probé en mi empresa así: [qué hicimos, si lo hicimos]. Y lo que no haría todavía: [un límite].»
**CTA:** «**Comenta [PALABRA]** y te mando [la guía o el prompt que usamos].»
**Antes de grabar:** noticia real de esa semana, con fecha y fuente; solo contar lo que hayamos probado.

---

## Ritmo propuesto
- **Piloto de 2 semanas (S46-S47):** 2 reels por semana, que sustituyen a los carruseles de esas semanas. Grabación los jueves (3 por hora).
- **Medición:** comentarios con la palabra, mensajes directos y **conversaciones con encaje** que salen de ahí (etiqueta por palabra en el CRM).
- Los carruseles de captación ya hechos (C4, C5, C7…) quedan como reserva.

## Recursos que hay que preparar si se aprueba
| Palabra | Recurso | Quién |
|---|---|---|
| EQUIPO | Mapa de agentes y reglas | Contenido |
| ERROR | Regla de corrección | Contenido |
| WHATSAPP | Reglas del agente de WhatsApp | Contenido |
| VIGÍA | Receta del vigía para un CRM | Contenido + Automatización |
| TRES | Regla de reenganche + 3 mensajes | Contenido |
| Comentario → mensaje directo | Automatización (ya encargado por Growth) | Automatización |
