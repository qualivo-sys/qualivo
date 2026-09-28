# Lunes 28 · Agentizando mi propia empresa · «Dos preguntas antes de la llamada»

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
- **CTA:** conversación. **Formato:** imagen 1080 × 1350 + texto.
- **Qué se mide:** comentarios de gente que pregunta el precio en el formulario, o que no se atreve a hacerlo.

## Texto para LinkedIn

> Esta semana he puesto el precio en el formulario de mis anuncios.
>
> Parece lo contrario de lo que hay que hacer. Todo el mundo te dice que el
> formulario sea corto y fácil, para que entren más contactos.
>
> Y el formulario me funciona. De las 14 citas que han salido de mis anuncios,
> 12 entraron por el formulario de Facebook.
>
> Pero también entra mucha gente que solo está mirando. De los primeros 20
> contactos, 14 invertían menos de 500 € al mes en captación, o nada.
>
> Así que el domingo cambié dos cosas. El formulario pregunta ahora cuándo
> quiere empezar (este mes, en uno a tres meses, o solo estoy mirando) y si le
> encaja el precio de entrada.
>
> Lo interesante no es la pregunta. Es lo que hace el sistema con la
> respuesta. Las dos suben o bajan la nota del contacto. Y si a las dos horas y
> media no ha contestado:
>
> A → me avisa a mí y le llamo yo.
> B y C → le llama mi comercial IA, una vez.
> D → nadie le llama. Recibe mensajes y ya está.
>
> Antes llamábamos a todos igual. Ahora mi tiempo va a quien dijo «este mes» y
> «sí».
>
> No sé si va a funcionar. La regla es no tocar nada en siete días y contar
> las reuniones que se celebran, no los contactos. Os lo cuento el lunes que
> viene, salga como salga.
>
> ¿Tú pones el precio antes de la primera llamada, o te lo guardas?
