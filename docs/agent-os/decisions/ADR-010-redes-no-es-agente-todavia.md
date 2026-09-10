# ADR-010 · Redes no es un agente todavía. LinkedIn sí tiene un problema de dueño

**Fecha** 2026-09-10 · **Estado** propuesta

**Contexto.** Después de aprobar Paid como agente propio, la pregunta natural es si redes sociales
merece otro.

**Decisión.** No. Redes se queda dentro de **Content**, con su propio número y un umbral escrito
para separarse.

**Por qué Paid sí y redes no.** No es una cuestión de importancia, es una de naturaleza:

| | Paid | Redes |
|---|---|---|
| Transición que posee | Presupuesto → Tráfico cualificado, **nueva** | Atención → Tráfico, **la misma que Content** |
| Radio de impacto | irreversible, gasta dinero | reversible, se borra un post |
| Cadencia | diaria y vigilada | diaria, la misma que el blog |
| Conocimiento | subastas, pujas, audiencias | formatos y ganchos, lo mismo que el blog |

Paid pasó el corte porque **gasta dinero de forma irreversible**. La diferencia entre un artículo
y un carrusel es de formato, no de decisión. Un agente de redes tendría el mismo dueño de
transición, el mismo KPI y la misma cadencia que Content, y eso choca de frente con la regla de
que una transición tiene un solo dueño.

**Aviso sobre el patrón.** Cada agente propuesto suena razonable por separado: paid, redes,
después vídeo, después email, después community. Si se dice que sí a cada uno, en tres semanas
está montada la organización de veinticinco del brief y el presupuesto de atención se va a catorce
decisiones por semana. La disciplina no es decir que no, es tener un umbral escrito.

## El umbral para cambiar de opinión

Redes se separa de Content cuando deje de producir solo tráfico y empiece a producir
**conversaciones entrantes**, porque entonces sí posee una transición distinta,
`Atención → Conversación entrante`, y además aterriza en el SDR y no en Demand.

**Criterio concreto:** 4 conversaciones entrantes al mes atribuidas a redes, dos meses seguidos.

Hasta entonces, dentro de Content hay un bloque de redes con su número propio, para poder saber si
llega al umbral. Sin medirlo, esta decisión no se puede revisar nunca.

## El problema real, que no es el que se preguntaba

**LinkedIn tiene hoy dos dueños.**

| Quién | Qué tiene | Dónde |
|---|---|---|
| **Outbound** | secuencias de HeyReach, copy de LinkedIn, líneas de servicio, semana 1 | `captacion/linkedin-*.md`, `captacion/heyreach-secuencia-linkedin.md` |
| **Content** | calendario semanal de publicación orgánica, lunes dolor, martes historia de marca... | rutina de content machine |

Mismo canal, dos agentes, dos mensajes, y potencialmente **la misma persona** recibiendo una
solicitud de conexión de uno y viendo un post del otro el mismo día.

**Regla de reparto:**

> **Content publica. Outbound contacta. SDR conversa.**

Y una regla de deduplicación que hoy no existe: **nadie contacta por LinkedIn a alguien que ya
está en una conversación abierta.** El guardián de reenvíos ya hace esto para email; LinkedIn no
tiene equivalente.

## Ajuste de mi diseño a la realidad

En el organigrama puse SEO dentro de Demand. La operación real lo tiene dentro de la content
machine, trabajando de un Sheet de keywords pendientes, y funciona todos los días. Se mantiene lo
que funciona:

> **Demand llena la cola de keywords. Content escribe desde ella.**

Demand posee el análisis de rendimiento en búsqueda y decide qué merece página. Content posee la
producción. Es una relación de entrada y salida, no una decisión partida en dos.
