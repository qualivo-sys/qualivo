# Borrador de artículo · «Lead scoring: cómo puntuar tus leads con dos notas (y qué hacer con cada letra)»

> **Para publicar el lunes 19-oct** como B1, el pilar de la semana 43 de la estrategia del mes (`content/estrategia/2026-10-estrategia-icp-inversores-que-no-convierten.md`).
> - **Si Maikel no aprueba** subir a dos piezas fuertes por semana, sustituye a la pieza fuerte de la semana 43.
> - **Antes de publicar:** se pasa a la plantilla de `blog/estrategias-marketing-crm/index.html` y se añaden la tarjeta, el sitemap, llms.txt y el registro de keywords.
> - **Ruta propuesta:** `/blog/lead-scoring/`.
> - **Keyword:** lead scoring. **Secundarias:** cómo puntuar leads, puntuación de leads, priorizar leads, lead scoring ejemplo.
> - **Pilar:** captación, `/blog/captacion-de-leads/`.
> - **No pisa:**
>   - `/blog/cualificar-leads/`, que va de qué preguntar;
>   - `/diccionario/lead-scoring/`, que es la definición corta. Este artículo es el cómo, con un sistema real, y enlaza a los dos.

## Ficha

- **Master Reviewer (16-oct):** nota 5, con los 10 críticos aplicados. Las tablas ya coinciden con el código: volumen, sector, tres mensajes, recálculo cada 10 minutos, qué pasa con A y C, y entradilla, momento propio y destacado. **Antes de publicar el lunes:**
  - enlazar desde `/diccionario/lead-scoring/` a este artículo;
  - re-apuntar «Qué hacemos» de `/blog/cualificar-leads/` a «dos notas»;
  - quitar «scoring de leads» de sus keywords secundarias.
- **Dato real (R1/R2):** `api/_scoring.js`, puntos y umbrales tal como están en el código el 16-oct. En la puntuación de inversión manda lo mejor entre la inversión declarada y el encaje con el precio. El encaje con el precio no se cuenta en el artículo, porque es una pregunta de formularios antiguos y daría pie a hablar de precio (R10).
- **Lo que pasa con cada letra:** `api/activacion.js` y `api/_aviso.js`, comprobado por el Master Reviewer el 14-oct.
- **Sin resultados ni recuentos** de cuántos A/B/C/D hemos tenido (R1/R3).
- **Recurso que lo acompañará:** la auditoría de leads (recurso A de la estrategia), cuando exista. Hasta entonces, CTA al diagnóstico.

---

## Título (H1)

**Lead scoring: cómo puntuar tus leads con dos notas (y qué hacer con cada letra)**

**Meta description:** Cómo montar un lead scoring que tu equipo use: una nota para quién es y otra para lo que hace. Los puntos de nuestro sistema y qué hacer con cada letra.

## Entradilla (después del H1)

Si tu equipo abre el CRM y no sabe a quién llamar primero, le falta un orden. El lead scoring es dar a cada contacto una puntuación para decidir a quién atender antes. Aquí va cómo lo hacemos nosotros: dos notas, los puntos de cada una y qué pasa con cada letra. Es parte de la guía de [captación de leads](/blog/captacion-de-leads/).

## Resumen (3 puntos)

- Una sola nota mezcla dos cosas: si el contacto encaja y si se está moviendo. Separadas, cada combinación pide un trato distinto.
- En nuestro sistema, cada contacto que nos pide información lleva dos notas de 0 a 10. Abajo están los puntos de nuestro sistema.
- De las dos notas sale una letra (A, B, C o D), y cada letra tiene su siguiente paso. Así el equipo sabe a quién llamar primero sin preguntar.

## Por qué una sola nota no basta

Un contacto que encaja perfecto y no ha contestado y otro que contesta a todo pero no puede comprarte pueden sacar la misma nota. Con una sola cifra parecen iguales, y no lo son.

Al primero hay que insistirle. Al segundo hay que atenderlo sin dedicarle una tarde. Si los dos llevan un 5, tu equipo los trata igual, y uno de los dos sale perdiendo.

Por eso separamos las dos preguntas: **quién es** y **qué hace**.

## Nota 1 · Quién es (tipología, de 0 a 10)

Mide si encaja con lo que vendes. Sale de lo que el contacto dice en el formulario.

| Qué miramos | Respuesta | Puntos |
|---|---|---|
| Inversión en captación | Más de 2.000 € al mes (desde 1.000 € en el formulario del 15 de octubre) | 5 |
| | Entre 500 y 2.000 € | 4 |
| | Menos de 500 € | 2 |
| | Nada | 0 |
| | No lo dice | 2 |
| Peticiones al mes | Más de 50 | 3 |
| | Entre 20 y 50 | 2 |
| | Menos de 20 | 1 |
| | No lo dice | 1 |
| Sector | Formación, clínicas, reformas o asesorías | 2 |
| | Otro, o no lo dice | 1 |

La nota no pasa de 10. En el formulario que estrenamos el 15 de octubre los tramos de inversión cambian: desde 1.000 € al mes ya suma 5.

## Nota 2 · Qué hace (comportamiento, de 0 a 10)

Mide si se está moviendo. Sale de lo que hace después de dejar sus datos.

| Qué hace | Puntos |
|---|---|
| Contesta a nuestro mensaje | +3 |
| Contesta en menos de una hora | +1 |
| Nos escribe tres mensajes o más | +1 |
| Dice en el formulario que quiere empezar este mes | +3 |
| Dice que quiere empezar en 1-3 meses | +1 |
| Dice que solo está mirando | −1 |
| Habla por teléfono con Raquel, nuestra asistente de voz con IA | +2 |
| Coge cita | +4 |
| Viene a la reunión | +1 |
| No se presenta a la cita | −3 |
| Pide la baja | La nota pasa a 0 |
| No responde tras toda la secuencia | Se queda en 1 como mucho |

La nota va de 0 a 10 y **se recalcula sola** en cada vuelta del sistema, cada diez minutos: contestar, coger cita o no presentarse la mueven.

> **Destacado:** Una letra sin siguiente paso no sirve de nada.

## La letra, y qué hacer con cada una

| Letra | Cuándo | Qué hacemos |
|---|---|---|
| **A** | Quién es 6 o más y qué hace 5 o más (o quién es 9 o más con algo de movimiento) | Aviso a Maikel en cuanto llega a A. Si 2 h 30 después de nuestro primer WhatsApp no ha contestado, a Maikel le salta un aviso para llamarle |
| **B** | Quién es 6 o más, pero se mueve poco | Si en 2 h 30 no contesta, le llama Raquel, una sola vez y en su horario |
| **C** | Qué hace 5 o más, pero quién es menos de 6 | Si en 2 h 30 no contesta, también le llama Raquel. Y antes de ofrecerle una reunión, una o dos preguntas para ver si encaja |
| **D** | El resto, quien pide la baja o quien no responde tras la secuencia | Sin llamada. Sigue con los WhatsApp de la secuencia, salvo quien pidió la baja, al que no se le escribe más |

La B es la que se pierde con una sola nota. Un buen contacto que todavía no ha contestado se queda al fondo de la lista, junto a los que nunca iban a comprar. Con dos notas se ve que vale la pena llamarle.

## Lo que aprendimos al montarlo

Al principio, para hacer preguntas antes de la reunión hacían falta dos señales flojas, y se nos colaban contactos que no encajaban. El 28 de septiembre cambiamos la regla: si la nota de quién es baja de 6, siempre se pregunta antes.

## Cómo montarlo en tu CRM

1. **Elige tres datos de «quién es»** que puedas preguntar en el formulario: inversión, volumen y sector, como nosotros. Si además preguntas lo que paga de media un cliente, apúntalo aparte hasta ver si predice algo. Lo que no preguntas, no lo puedes puntuar.
2. **Elige cinco acciones de «qué hace»** que tu CRM ya registra: contesta, coge cita, viene, no viene, pide la baja.
3. **Pon puntos.** Que lo que más se parece a comprar valga más: coger cita vale más que contestar.
4. **Fija dos umbrales**, uno por nota, y saldrán las cuatro letras. Empieza con 6 y 5, como nosotros, y ajústalos.
5. **Decide qué pasa con cada letra** antes de encenderlo. Una letra sin siguiente paso no sirve de nada.
6. **Revísalo cada mes con las ventas reales.** Si los que compran no eran A, los puntos están mal.

## El límite de la primera nota

La primera nota solo sabe lo que pregunta el formulario. Desde el 8 de octubre, los formularios de una prueba preguntan también cuánto le paga de media un cliente a la empresa. De momento solo lo apuntamos y no entra en la nota. Lo que salga, lo contaremos cuando acabe la prueba. Las preguntas, en [cómo cualificar leads](/blog/cualificar-leads/).

## Preguntas frecuentes

**¿Qué es el lead scoring?**
Dar una puntuación a cada contacto para decidir a quién atender primero. La definición corta está en el [diccionario](/diccionario/lead-scoring/).

**¿Cuántas notas hacen falta?**
Dos: una para si encaja y otra para si se mueve. Con una sola, un contacto que encaja y no contesta y otro que contesta y no encaja pueden salir iguales.

**¿Hace falta un software especial?**
No. Basta con un CRM que guarde campos y etiquetas, y una regla que sume. Nosotros lo hacemos sobre el CRM que ya usa la empresa.

**¿Cada cuánto se revisan los puntos?**
Una vez al mes, con las ventas delante. Si los que compran no salen arriba, hay que cambiar los puntos.

## CTA (caja final, un solo botón)

**¿Sabe tu equipo a quién llamar primero?** 30 minutos con tu CRM o tu formulario delante. Salimos con qué le falta para separar a quien encaja de quien se mueve.
→ Pedir el diagnóstico (`/diagnostico/?utm_source=blog&utm_medium=organic&utm_campaign=articulo&utm_content=lead-scoring`)
