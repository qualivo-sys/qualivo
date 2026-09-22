# Raquel (agente de voz) · estado al 22-sep y qué falta

> Traspaso de Outbound a Landing/Growth. Lo escribo con el detalle de lo que he
> tocado y, sobre todo, de lo que he **dejado sin tocar** y por qué, para que
> nadie repita las pruebas que ya están hechas.

## Dónde vive

Asistente de Vapi "Qualivo SDR". El id está en el scratchpad de Outbound
(`.vapi_assistant_id`), igual que la clave y el id del número.

**Aviso de API**: Vapi va detrás de Cloudflare y tumba cualquier petición sin
User-Agent de navegador. Devuelve un `error code: 1010` que no explica nada y se
parece a un problema de permisos. No lo es. Se arregla mandando un User-Agent
normal en la cabecera.

## Qué he cambiado hoy (guion v4)

| antes | ahora | por qué |
|---|---|---|
| `silenceTimeoutSeconds: 10` | **45** | Colgaba encima de gente que estaba apuntando un correo. Pasó el 18-sep con Talkual: una compañera estaba escribiendo el recado y Raquel colgó a mitad. |
| "Maikel Echevarría" en el guion | **"Máikel Echevarría"** con tilde | Sin tilde la voz puede leerlo en inglés. Ojo con esto, ver la advertencia de abajo. |
| Sin `startSpeakingPlan` | `waitSeconds: 0.8` | Entraba encima del otro. |
| Sin `stopSpeakingPlan` | `numWords: 3` | Igual. |
| Apertura única | **Tres ramas**: persona conocida, solo empresa, y recado | La mitad de los números son fijos. Contesta recepción, no quien decide, y el guion viejo no lo contemplaba. |

## ADVERTENCIA IMPORTANTE sobre las transcripciones

El 21-sep informé de que Raquel decía "Michael Echevarría" y "Qualibo". **Eso lo
saqué de las transcripciones y es una conclusión que no se sostiene.**

Lo que aparece en la transcripción no es lo que dice Raquel: es lo que el
transcriptor (Deepgram) entiende del audio de Raquel. "Máikel" bien pronunciado
puede transcribirse "Michael", y "Cualivo" puede salir "Qualivo" o "Qualibo".

**Para saber si la pronunciación está mal hay que escuchar la grabación.** No se
puede decidir por la transcripción, y yo lo di por hecho sin haberlo comprobado.

## Las tres llamadas de prueba del 22-sep

Lanzadas a las 10:35 con el guion v4 ya aplicado.

### 1. FIND IN CORPORATE · móvil · 21 s · colgaron ellos
```
Raquel: Hola, buenos días. Perdona que te moleste, ¿Quién lleva ahí la parte
        de captación de clientes o de marketing?
Cliente: ¿Hola?
Raquel: Hola, buenos días. Perdona que te moleste, ¿Quién lleva ahí la parte
        de captación de clientes o de marketing?
```
**Defecto 1: repite la frase de entrada palabra por palabra.** Cuando el otro
dice "¿hola?" no está pidiendo que le repitas, está comprobando que hay alguien.
Suena a máquina en el primer segundo y colgaron.

### 2. MN Welding Academy · móvil · 73 s
```
Cliente: Gracias. No cuelgues, por favor.
Raquel: Claro, no te preocupes, aquí espero.          <- esto SÍ funcionó
Cliente: Lo siento, pero esta Diga.
Raquel: No pasa nada, gracias por avisar. ¿Sabes a qué hora suele estar?
Cliente: Hola.
Raquel: Hola, buenos días. ¿Podrías hablar con Diga?  <- defecto
```
**Defecto 2: se cree nombres que son ruido de transcripción.** "Diga" es cómo se
coge el teléfono en España, no una persona. Lo mismo pasaría con "Dígame", "Sí"
o "Al habla". Hay que tener una lista negra de falsos nombres.

Lo bueno: el arreglo del silencio funcionó. Cuando le dijeron "no cuelgues",
esperó.

### 3. MICROFUSA · fijo con centralita · 83 s
```
Centralita: De los cursos, pulsa 1. Si quieres hablar con secretaría, pulsa
            el 2. Si quieres hablar con la tienda, pulsa el 3.
Raquel: Y elige la opción adecuada hablar con la persona responsable de la
        captación de clientes o marketing, si es posible. Si ninguna opción
        parece relevante,
```
**Defecto 3, y es el peor: leyó sus propias instrucciones en voz alta.** El
modelo se puso a narrar su razonamiento por el altavoz.

**Defecto 4: no sabe marcar un dígito.** Ante una centralita hay que callarse y
mandar un tono DTMF, no hablar.

Luego llegó a recepción y acabó en "mándenos un correo al departamento de
marketing", que es justo de donde veníamos.

## Lo que hace falta, en orden

1. **Centralita**: detectar el menú, callarse y mandar DTMF. Vapi lo soporta.
   Mientras no esté, cualquier fijo con centralita es tiempo tirado.
2. **No narrar el razonamiento.** Separar instrucciones de lo que se dice en voz
   alta, o bajar el modelo a algo que no piense en alto.
3. **Lista negra de falsos nombres**: diga, dígame, sí, hola, al habla, buenos
   días, un momento.
4. **No repetir la apertura.** Si el otro dice "¿hola?", la segunda frase tiene
   que ser distinta a la primera.
5. **Mejor respuesta a "¿de qué se trata?"**, que es la pregunta que hace
   recepción siempre y donde se decide si te pasan o no.

## Cola pendiente

`llamadas.py` en el scratchpad de Outbound, con cinco leads sin llamar:
Nusiveta Fusteria, Fana Dental Care, Reformas Koncepto, Reformas Actur 3000 y
Plastic Academia. Todos con tres o cuatro aperturas del correo y sin contestar.

**Raquel no vuelve a marcar hasta que estén los puntos 1 a 4.** Es decisión de
Outbound y el motivo es simple: son los leads que más interés han mostrado esta
semana y quemarlos con una llamada mala sale más caro que no llamar.

## Una regla que costó un susto

Los teléfonos se sacan **uno a uno de la ficha del lead**, nunca de una tabla de
un informe. Las tablas recortan por la derecha. De los ocho números que
reconstruí a ojo de mi propio informe, **cuatro estaban mal**: habría llamado a
cuatro desconocidos. Se detectó antes de marcar, pero por poco.
