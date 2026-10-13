# Master Reviewer · martes 13-oct

> Revisión de las piezas del martes de la semana 42 (cualificación). Los críticos están aplicados en el commit que sigue a e599cff.

## 1. Artículo nuevo, `/blog/leads-que-solo-estan-mirando/` · 5/10 · publicar con cambios

**Críticos (aplicados):**
1. **R2, el sistema contado tal cual.** «Solo estoy mirando» no «baja la nota» por sí sola. Cuenta como una señal de poco encaje, y el primer mensaje deja de ofrecer hora si se junta con otra señal o si el contacto encaja poco por tamaño (`api/_scoring.js`, `api/_agente.js`). Corregido en el resumen, el cuerpo y llms.txt.
2. **R2, la promesa de «nadie reserva».** `/gracias/` enseña el calendario a todos, así que «nadie reserva media hora…» era falso. Ahora: «cuando hay dudas de encaje, el primer mensaje no le pide media hora…».
3. **Alcance de la prueba.** «Nuestros formularios nuevos» pasa a «los formularios de una prueba». Corregido en og:description, el resumen, la tarjeta del blog y llms.txt.
4. **R11, sin el «no es X, es Y».** Reescritos el resumen, el H2 del paso 4 y las descripciones meta y JSON-LD.

**Opcionales (aplicados):**
- La etiqueta pasa de «Captación» a «Cualificación».
- El destacado ya no es eslogan: dice qué respuesta es y qué cambia.
- Mejor texto en el enlace del paso 1.
- La FAQ ya no dice el absoluto «nadie volverá a escribirle».

**Opcionales (no aplicados):**
- **`utm_campaign`:** sigue como decisión pendiente de Maikel (12-oct).
- **El límite de una pieza fuerte por semana:** esta es la segunda de la semana 42, después de la actualización de cualificar-leads. Lo dejo anotado para Maikel. El artículo responde a una pregunta del formulario que ya está en marcha.

## 2. Re-apunte de `/blog/que-es-un-lead/` · 8/10 · publicar

**Opcional (aplicado):** «Y en el formulario, pregunta para cuándo: quien tiene prisa y quien solo está mirando necesitan conversaciones distintas.»

## 3. LinkedIn A, «la A que no era» · 7/10

**Críticos (aplicados):**
- **«Entró» pasa a «tuvimos».** El contacto no entró con la A: la A se la dio el sistema.
- **«La cuenta cambiaba entera» pasa a «había que rehacer la cuenta».** El daily dice «le sale justa», no que cambie entera. La ficha ya cita el literal.

**Cuándo publicar:** el trato sigue abierto, con llamada el 15-oct. Recomendación: publicarlo después de esa fecha (R5).

## Nota de sistema para Growth y Maikel

- **El bus del 8-oct (14:02) contradice al código.** El bus dice que el funnel v2 va en modo sombra: «solo etiquetas… No cambia ningún mensaje». Pero el commit `df4f09d` (8-oct, 16:37) hace que «solo mirando» entre en precualificar, y el commit `c9de117` mete el dolor en el primer WhatsApp. O se corrige el bus, o se revierte el comportamiento.
- **`/gracias/` enseña el calendario a todos**, también a quien sale como «todavía no candidato». Si la prueba quiere medir precualificar, hay que tenerlo en cuenta.
