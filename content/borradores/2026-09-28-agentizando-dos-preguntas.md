# Lunes 28 · Agentizando mi propia empresa · «Dos preguntas antes de la llamada»

> **EN PAUSA (29-sep).** El formulario con precio se paró el 28-sep: Maikel
> volvió al anuncio y el formulario de la semana anterior («pon 20 en la que
> funcionaba», «déjalo todo como estaba la semana pasada», bus de Growth
> 28-sep). El texto de abajo ya no vale tal cual: dice que el experimento
> sigue siete días. La versión 2, al final, cuenta lo que pasó de verdad. La
> imagen sigue valiendo si se quita «desde el 27 de septiembre».
>
> Pieza del día (lunes: «Agentizando mi propia empresa», LinkedIn). Imagen:
> `content/infografias/2026-09-28/dos-preguntas.png`. **Sin publicar**, porque
> LinkedIn sigue en pausa.

## Ficha

- **Serie:** Agentizando mi propia empresa (Construyendo Qualivo). **Etapa:** contacto → cita.
- **Qué pasó (dato real):**
  - Qué cambió, el 27-sep. El formulario de formación pregunta «¿Cuándo te gustaría empezar?» (este mes / 1-3 meses / solo estoy mirando) y si le encaja el precio de entrada (sí / depende / ahora mismo no). La pregunta de cuánto invierte desaparece. Código en `api/meta-leadform.js`.
  - Qué hace el sistema con las respuestas. Suben o bajan la nota del contacto (`api/_scoring.js`). Si a las 2 h 30 no ha contestado (`api/activacion.js`): con A, aviso a Maikel y llama él; con B o C, una llamada del comercial IA; con D, nadie llama.
  - Fuente: daily de Growth del 27-sep.
- **Acierto primero:** de 14 citas de los anuncios, 12 entraron por el formulario de Facebook. El formulario trae reuniones.
- **Fallo, corto:** de los primeros 20 contactos, 14 invertían menos de 500 € o nada (brief de la semana 38, contado lead a lead). Mucho curioso.
- **Lo que NO se cuenta:**
  - Cuántos plantones hubo (regla de Maikel).
  - Nombres de leads ni de la clienta que dijo que sí.
  - El canal del primer mensaje (regla del 663).
- **Decisión para Maikel:** ¿se dice la cifra del precio de entrada? En el formulario real aparece. Mi recomendación es no ponerla en LinkedIn todavía: la pieza funciona igual y el precio no se convierte en el tema de los comentarios.
- **Revisión (28-sep):** Master Reviewer, nota 7, publicar con cambios. Aplicados los 5 críticos: fechas, «el formulario trae citas», fuera el «no es X, es Y», la nota como criterio (no la respuesta sola) y la pregunta real del precio en la imagen, con la cifra tapada.
- **CTA:** conversación. **Formato:** imagen 1080 × 1350 + texto.
- **Qué se mide:** comentarios de gente que pregunta el precio en el formulario, o que no se atreve a hacerlo.

## Texto para LinkedIn

> El domingo 27 puse el precio en el formulario de mis anuncios.
>
> Parece lo contrario de lo que hay que hacer. Todo el mundo te dice que el
> formulario sea corto y fácil, para que entren más contactos.
>
> Y el formulario trae citas. De las 14 que han salido de mis anuncios, 12
> entraron por él.
>
> Pero también entra mucha gente que solo está mirando. De los primeros 20
> contactos, 14 invertían menos de 500 € al mes en captación, o nada.
>
> Así que cambié dos cosas. El formulario pregunta ahora cuándo
> quiere empezar (este mes, en uno a tres meses, o solo estoy mirando) y si le
> encaja el precio de entrada.
>
> Lo que me gusta es lo que hace el sistema con las respuestas. Las dos suben o bajan la nota del contacto. Y si a las dos horas y
> media no ha contestado:
>
> A → me avisa a mí y le llamo yo.
> B y C → le llama mi comercial IA, una vez.
> D → nadie le llama. Recibe mensajes y ya está.
>
> Antes llamábamos a todos igual. Ahora mi tiempo va a los que tienen la nota
> más alta. Decir «este mes» y «sí» la sube.
>
> No sé si va a funcionar. La regla es no tocar nada en siete días y contar
> las reuniones que se celebran, no los contactos. Os lo cuento cuando
> pasen los siete días, salga como salga.
>
> ¿Tú pones el precio antes de la primera llamada, o te lo guardas?

## Versión 2 (29-sep) · «Puse el precio en el formulario. Lo quité al día siguiente.»

> El domingo puse el precio en el formulario de uno de mis anuncios. El lunes lo quité.
>
> El formulario me trae citas: de las 14
> que han salido de mis anuncios, 12 entraron por él. Pero también entra mucha
> gente que solo está mirando. De los primeros 20 contactos, 14 invertían menos
> de 500 € al mes en captación, o nada.
>
> Así que cambié la pregunta de cuánto invierte por dos nuevas: cuándo quiere
> empezar y si le encaja el precio de entrada. Con las respuestas, el sistema sube o baja la nota del contacto,
> y la nota decide quién le llama: yo, mi comercial IA o nadie.
>
> ¿Por qué lo quité? Porque el anuncio con el formulario de antes era el que
> funcionaba: el único sí que ha salido de mis anuncios entró por él.
>
> El mismo lunes llegué a montarlo al lado: el formulario nuevo en un conjunto
> aparte, con el mismo anuncio y 15 € al día. Poco después lo pausé también y
> lo dejé todo como la semana anterior. Ahora está en pausa.
>
> ¿Tú cambias lo que funciona para probar algo, o lo pruebas al lado?
