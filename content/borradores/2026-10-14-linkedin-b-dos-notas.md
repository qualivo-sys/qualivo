# Miércoles 14-oct · LinkedIn B (semana 42) · «Dos notas en vez de una»

> Pieza 3 del brief de la semana 42 (`content/briefs/2026-10-12-brief-semana-42.md`), para el miércoles a las 8:30. Ocupa el hueco del miércoles de la rutina, que era la bandera roja: esta semana manda el brief.
>
> **Sin publicar.** Se publica pieza a pieza con el ok de Maikel (R16).

## Ficha

- **Etapa del Revenue Journey:** cualificación.
- **Datos reales:**
  - **`api/_scoring.js`.** Desde el 21-22 de septiembre, cada contacto lleva dos notas de 0 a 10:
    - **tipología**, lo que es: inversión declarada, peticiones al mes y sector;
    - **comportamiento**, lo que hace: si contesta, si contesta en menos de una hora, si habla con Raquel, si coge cita. Resta si no se presenta.
  - **La letra sale de las dos notas:**
    - **A:** encaja y se mueve. Correo a Maikel al pasar a A; a las 2 h 30 sin respuesta, «LLÁMALE» al móvil, y le llama Maikel.
    - **B:** encaja y se mueve poco. A las 2 h 30 sin respuesta, una llamada de Raquel (`api/activacion.js`). El reenganche está apagado.
    - **C:** se mueve y encaja poco. Con tipología menor de 6 siempre se precualifica: una o dos preguntas antes de la reunión (`precualificar()`).
    - **D:** baja, no responde, descartados o el resto. Sin llamada.
  - El brief dice que se puede explicar «libre».
  - **Formularios de una prueba:** desde el 8-oct preguntan también el precio medio de lo que vende la empresa (`api/_funnel-v2.js`). Solo pone las etiquetas `ticket-*` y `fit-*`: no entra en la tipología.
- **Reglas:**
  - **R1:** ninguna cifra de resultados ni cuántos A/B/C/D hubo, que no está verificado (brief §2). Las letras se cuentan por lo que hacen, no por lo que han conseguido.
  - **R3:** la prueba está en marcha. No se da ningún resultado.
  - **R10:** ni nuestro precio ni los tramos con cifras.
  - **R12:** primero lo que funciona (dos notas para priorizar), luego el límite, corto: la primera nota solo sabe lo que el formulario pregunta.
  - **R11:** sin «no es X, es Y».
- **CTA:** recurso. El artículo va en un comentario, no en el post. El post cierra con una pregunta de conversación.
- **Qué se mide:** comentarios de dueños o directores comerciales sobre cómo deciden a quién llamar primero.
- **Enlace del comentario:** `https://qualivo.io/blog/cualificar-leads/?utm_source=linkedin&utm_medium=organic&utm_campaign=s42-cualificacion&utm_content=linkedin-b`
- **Orden con el post A:** el B no depende del A ni de ningún trato abierto. Recomendación (Master Reviewer 14-oct): el B primero, en cuanto haya ok, y el A después de la llamada del 15-oct. Sacar antes el acierto es lo que pide R12.
- **Master Reviewer (14-oct):** nota 5. Aplicados los 4 críticos (B, C y D como hace el código, Raquel por su nombre, el límite sin dar a entender que la nota ya usa el precio) y tres opcionales.
- **Pendiente de R4:** «Me llega un aviso y le llamo yo» es más exacto y más fuerte para la A, si Maikel confirma que llama él.

## Texto para LinkedIn

> Con una sola nota por contacto acabas mezclando dos cosas distintas.
>
> Quién es. Y qué hace.
>
> Por eso en Qualivo cada contacto que nos pide información lleva dos notas,
> de 0 a 10.
>
> La primera mira quién es: cuánto invierte en captación, cuántas peticiones
> le llegan al mes y a qué se dedica.
>
> La segunda mira qué hace: si dice que quiere empezar ya, si contesta, si
> contesta rápido, si habla con Raquel, nuestra asistente de voz con IA, si
> coge cita. Y baja si no se presenta.
>
> Con las dos sale una letra, y cada letra tiene su trato.
>
> A. Encaja y se mueve. Me llega un aviso al momento.
> B. Encaja, pero se mueve poco. Si no contesta, le llama Raquel.
> C. Se mueve, pero encaja poco. Antes de darle una reunión, le hacemos una o
> dos preguntas.
> D. Ni una cosa ni la otra. No se le llama.
>
> La B es la que se pierde con una sola nota. Un buen contacto que no
> contesta acaba al fondo de la lista, junto a los que nunca iban a comprar.
> Con dos notas se ve que vale la pena insistir.
>
> La primera nota tiene un límite: solo sabe lo que el formulario pregunta.
> Por eso, desde el 8 de octubre, los formularios de una prueba preguntan
> también cuánto cobra la empresa por lo que vende. De momento solo lo
> apuntamos. Lo que salga lo contaré cuando acabe la prueba.
>
> ¿Tú cómo decides a quién llamas primero?

**Primer comentario (de Maikel):**

> Lo cuento con más detalle aquí, con las preguntas que hacemos en el
> formulario: https://qualivo.io/blog/cualificar-leads/?utm_source=linkedin&utm_medium=organic&utm_campaign=s42-cualificacion&utm_content=linkedin-b
