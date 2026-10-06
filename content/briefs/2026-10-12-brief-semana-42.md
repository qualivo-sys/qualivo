# Brief de contenido · semana 42 · 12 al 18 de octubre · Cualificación

> Lo escribe el Head of Content el 6-oct-2026 siguiendo el Content OS
> (`content/content-os-v1.md`, §5). Es el primer brief con el motor semanal.
>
> Los especialistas producen contra este brief: social, vídeo, diseño, Growth
> para outbound y el blog. **Nada se publica sin el ok de Maikel (R16).**
>
> Si el veredicto del viernes 9 del plan de octubre cambia la fuga, este brief
> se rehace.

## 1. La obsesión de la semana

**Etapa del Revenue Journey:** cualificación.

**Pregunta:** ¿cómo sabes si el contacto que acaba de entrar puede comprarte, antes de dedicarle una hora?

**Por qué esta semana:**
- Coincide con la semana 2 del plan de octubre, «mejores leads». Paid prueba anuncios nuevos y la métrica es el coste por lead A/B.
- Coincide con las preguntas de tamaño que Growth añade al formulario el 13-oct.

## 2. El dato real (y su fuente)

| Dato | Fuente | Cómo se puede usar |
|---|---|---|
| Nuestra puntuación mira la inversión declarada en anuncios, las peticiones al mes y el sector, y después lo que hace el contacto: si contesta, si coge cita | `api/_scoring.js` | Libre. Se puede explicar cómo puntuamos |
| El 5-oct, un contacto que el formulario puntuó como A (inversión y volumen altos) cobraba a sus clientes un precio que no encajaba con nuestro servicio. El formulario no pregunta cuánto cobra el cliente a los suyos | Daily de Growth del 5-oct (`bus/out/demand.jsonl`) | **Solo anonimizado (R5).** Sin sector, sin cifra del precio y sin fecha. Es un trato abierto: ningún juicio sobre su negocio |
| Desde el 13-oct el formulario lleva preguntas de tamaño | Plan de octubre, daily del 5-oct | Se puede contar que las añadimos y por qué. **El resultado no hasta que acabe el test (R3)** |
| Hay leads buenos que no pueden empezar ahora. Los apartamos en «más adelante» en vez de descartarlos | Bus, cambio de Meta del 6-oct | Se puede contar la práctica, sin nombres ni motivos económicos |

**Lo que NO se usa:**
- Nuestro precio, ni el que aparece en el formulario (R10).
- Ninguna cifra de un cliente, tampoco lo que cobra a los suyos.
- Cuántos A/B/C/D tuvimos en septiembre. El plan dice «unos 14 de 37, a verificar», así que no está verificado (R1).

## 3. El mensaje

**Idea central:** el formulario mide lo que es fácil preguntar (cuánto inviertes, cuántas peticiones tienes). Lo que decide si alguien puede comprarte suele estar en lo que nadie pregunta. En nuestro caso, cuánto cobra él a sus clientes.

**Acierto primero (R12):**
- Puntuar con dos notas, quién es y qué hace, nos deja priorizar.
- Apartar a «más adelante» a quien no puede ahora evita quemar un buen contacto.

**Fallo, corto:** a uno le dimos una A que no era. Le faltaba una pregunta al formulario.

**Frase para Maikel, en su voz, solo si la aprueba:** «Mi formulario sabía cuánto invertía en anuncios. No sabía cuánto cobraba a sus clientes.»

## 4. Las piezas

Cada pieza lleva su ficha con etapa (cualificación), dato y fuente, reglas que toca y CTA. Todas pasan por el Master Reviewer.

| # | Pieza | Quién | Cuándo | CTA (R15) |
|---|---|---|---|---|
| 1 | **Actualización fuerte de `blog/cualificar-leads/`.** Nueva sección «Lo que el formulario no ve». Un paso nuevo, «pregunta por el precio de lo que vende tu cliente». FAQ con «¿cuántas preguntas debe tener un formulario?» sin cifra inventada. Enlace al pilar de la semana 43 cuando exista | Blog | Lun 12 | Diagnóstico (botón único con UTM) |
| 2 | **LinkedIn A · la A que no era.** El caso anonimizado con la frase de la sección 3. Cierra con la pregunta «¿qué pregunta le falta a tu formulario?» | Social | Mar 13 · 8:30 | Conversación |
| 3 | **LinkedIn B · dos notas en vez de una.** Cómo puntuamos: quién es y qué hace. Por qué separar las dos | Social | Mié 14 · 8:30 | Recurso: el artículo, en comentario y no en el post |
| 4 | **Carrusel · «Lo que tu formulario pregunta y lo que debería preguntar».** Dos columnas. Ejemplos marcados como ejemplo. Molde crema y tinta de Maikel | Diseño y social | Jue 15 · 13:30 (Instagram y LinkedIn como documento) | Conversación |
| 5 | **Vídeo de 40-50 s** con la voz de Maikel sobre pantalla. La ficha de un contacto en Intelligence con sus dos notas y su motivo. **Datos de demo marcados como «ejemplo» (R1)** | Vídeo | Vie 16 | Diagnóstico |
| 6 | **Fragmento para outbound.** Dos frases para Growth: «Muchos equipos califican por el tamaño de la empresa. Lo que decide suele ser otra cosa: cuánto vale cada venta. ¿Lo tenéis en la ficha?» | Growth | Lun 12 | No aplica |
| 7 | **Argumento comercial.** Objeción «nos llegan muchos leads pero malos» y la respuesta: «miremos qué pregunta le falta a tu formulario», con la ficha de Intelligence en pantalla. Va al guion de venta | Ventas | Lun 12 | No aplica |
| 8 | **Mejora de landing (propuesta, la decide Paid con Maikel).** En las landings de sector, una frase junto al formulario: «Te preguntamos esto para no hacerte perder el tiempo si no encajamos» | Paid y Growth | Cuando decidan | No aplica |

**Fuera esta semana:**
- Newsletter. Vuelve la semana 45, con la de plantones ya corregida.
- Piezas de plantones. Van en la semana 45.

## 5. Distribución

- **El artículo:**
  - se enlaza desde el post B, en un comentario;
  - desde `blog/formulario-de-facebook-o-landing-page/`;
  - desde `blog/que-es-un-lead/`.
- **El carrusel** se sube también como documento de LinkedIn.
- **Growth** recibe el fragmento 6 el lunes y anota qué cuentas lo recibieron.
- **Todo enlace propio lleva UTM** (Content OS §9), con `utm_campaign=s42-cualificacion` y `utm_content=<pieza>`.

## 6. Medición · viernes 16

| Qué | De dónde |
|---|---|
| Leads con `utm_source=blog` y `utm_content=cualificar-leads` | GHL, nota «Origen» del contacto |
| Comentarios de perfiles de dirección comercial o gerencia en los posts A y B | A mano |
| Respuestas de las cuentas que recibieron el fragmento 6 | Growth |
| Cuántas veces se usó el argumento 7 en reuniones | Maikel o Growth, en la nota del trato |

No cuentan alcance ni likes.

## 7. Lo que necesito de Maikel

1. **Ok a cada pieza** cuando esté lista. Las subo a Notion como las de la semana 41.
2. **La frase de la sección 3**, sí o no.
3. **Grabar la voz del vídeo 5:** 45 segundos. Te paso el guion el jueves.
