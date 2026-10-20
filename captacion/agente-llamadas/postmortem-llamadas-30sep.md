# Las 6 llamadas del 30-sep: qué pasó y de quién es cada fallo

Transcripciones leídas en Vapi el 1-oct. Las llamadas salieron a las **09:19**, no
a las 11:15 como informé ayer.

| Teléfono | Duración | Final |
|---|---:|---|
| +34963312771 | 39s | el médico declina: ya trabaja con otra empresa de captación |
| +34963518689 | 21s | locución de espera, Raquel saluda al contestador |
| +34917024592 | 67s | nadie entiende quién llama |
| +34919332744 | **211s** | **Raquel se queda muda 3 minutos y medio** |
| +34911989523 | 31s | locución de espera, Raquel saluda al contestador |
| +34937544071 | 63s | "¿quién es?" repetido, sin respuesta útil |

**Una conversación útil de seis.** Y la útil es un no limpio: el doctor Lorente ya
colabora con otra empresa de captación. Eso es información buena, no un fracaso.

## Lo que dijo Raquel, literal

> "Es de parte de **Michael** Echevarría, de Qualivo."
> "soy la asistente de **Michael** Echevarría. De **Qualibo**."
> "¿Podría hablar con **nombre de la persona**?"
> "¿Podría hablar con **qué nombre**?"
> "¿Podría **voy a hablar** con el doctor Lorente?"

## Causa raíz, y es mía

**1. No pasé la variable `apertura`.** El `firstMessage` del asistente es
literalmente `"Hola, buenos días. {{apertura}}"`. Yo pasé `cargo` y
`dato_concreto`, pero **no `apertura`**. Resultado: Raquel dice "Hola, buenos
días." y se queda sin frase de apertura. Eso explica los cuatro casos en que
saluda a una locución y no sabe seguir, y explica el "¿Podría hablar con nombre
de la persona?": está leyendo el hueco vacío.

**2. Metí instrucciones dentro de una variable de contenido.** Esto es lo que
pasé en `dato_concreto`:

> "abrio cuatro veces el correo sobre las solicitudes... **Esta persona NO es un
> contacto frio: ha abierto nuestro correo varias veces y no ha contestado.
> Reconocelo en la primera frase.** Quien coge el telefono suele ser recepcion,
> asi que pregunta con quien puedes hablar..."

Dos errores en una frase. El primero es de forma: son **instrucciones metidas en
un campo que se pronuncia**, exactamente lo que la REGLA CERO existe para
impedir, y lo hice yo el día después de escribir la REGLA CERO.

El segundo es de fondo y es peor: **le dije que reconociera las aperturas en la
primera frase**. La sección 2 del rol de cold calling lo prohíbe de forma
explícita: "Nunca digas: he visto que abriste nuestro correo cinco veces. Las
aperturas son una señal interna de priorización." Le pedí justo lo contrario.

**3. El guion v5 nunca se aplicó al asistente.** Comprobado hoy sobre el prompt
vivo: **no contiene "REGLA CERO"**. Y contiene a la vez "Máikel" y "Maikel",
"Cualivo" y "Qualivo", así que la variante sin tilde sigue ahí y es la que la voz
lee en inglés. Esto ya lo avisé el 29-sep como pendiente de Maikel; las llamadas
del 30-sep son la prueba de que sigue pendiente.

**4. Cuota de ElevenLabs agotada.** La llamada de las 14:42 terminó con
`pipeline-error-eleven-labs-quota-exceeded`. Hay que recargar antes de volver a
llamar. Dos llamadas más fallaron por SIP sin conectar (15:10 y 16:28).

## Los 211 segundos de silencio

Es el fallo que más me preocupa, porque al otro lado había una persona ayudando:

> **Recepción:** "Vale, captación de clientes para marketing, ¿verdad? Me dices...
> Ahora, ¿me me estás escuchando? Hola, ¿me me has me escuchas? Hola..."

Preguntó bien, quiso pasar la llamada, y Raquel dejó de contestar durante tres
minutos y medio. Esa persona se quedó hablándole a un silencio con el nombre de
Qualivo encima.

## Qué hace falta antes de volver a llamar

Ninguna de las cuatro es opcional:

1. **Aplicar el guion v5 al asistente de Vapi.** Decisión de Maikel, pendiente
   desde el 29-sep. Sin REGLA CERO y sin quitar las variantes sin tilde, los
   mismos fallos se repiten.
2. **Pasar siempre `apertura`** en `variableValues`, con texto pronunciable y
   entre comillas. Sin esa variable el asistente no tiene primera frase.
3. **`dato_concreto` lleva un hecho y nada más.** Ninguna instrucción, ninguna
   mención a aperturas. Las instrucciones van en el prompt del asistente, no en
   un campo que se pronuncia.
4. **Recargar ElevenLabs.**

## Lo que sí hay que apuntar en el CRM

`historial_llamadas.json` tiene 23 registros y el último es del 10-sep: **las 6
llamadas de ayer no están**. Ese fichero es el que impide repetir llamada en 7
días, así que mientras no se actualice la regla no protege a nadie. Los seis
números de arriba hay que meterlos con fecha 30-sep.
