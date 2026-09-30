# Las 6 llamadas del 30-sep · qué pasó de verdad

Recuperado de la API de Vapi con la clave que pasó Máikel. Seis llamadas
lanzadas a las **11:19 de Madrid** (09:19 UTC), no a las 11:15.

## Resultado en una línea

**Cero conversaciones con un decisor. Cero reuniones. Cinco de seis colgaron
ellos.** Coste total: 0,64 USD, de los cuales 0,30 se los comió una sola
llamada que estuvo 3 minutos y medio hablando con otro robot.

| Empresa | Duración | Cómo acabó |
|---|---:|---|
| Clínica Dental Dr. Lorente | 39 s | colgó el cliente · «no nos interesa, ya colaboramos con una empresa» |
| Microfusa | 67 s | colgó el cliente · sin llegar a decir para qué llamaba |
| Logik Clinic | 63 s | colgó el cliente · bucle de «¿hola?» |
| Clínica Dental Martínez Canut | 21 s | colgó el cliente · locución de espera |
| Magister | **211 s** | **silence-timed-out** · habló con el bot de recepción de Magister |
| European Open Business School | 31 s | colgó el cliente · locución de espera |

Las seis salieron **en 15 segundos**, de 09:19:27 a 09:19:42. Fue una ráfaga
simultánea: nadie podía estar escuchando.

---

## LA CAUSA RAÍZ · el briefing nunca ha llegado a Raquel

El prompt del asistente escribe los huecos con **llave simple**:

```
"Hola, buenos dias. ¿Podria hablar con {nombre}?"
```

Vapi solo sustituye `{{variable}}`, con **llave doble**. Comprobado sobre el
asistente en producción (`fe2ed34d…`):

| | |
|---|---|
| Placeholders con `{{doble}}` en el prompt | **NINGUNO** |
| Placeholders con `{simple}` (muertos) | `nombre` · `dato_corto` · `dato_concreto` · `dias_ofrecidos` · `dia` · `hora` |

**Ninguna variable de `variableValues` ha entrado nunca en una llamada.** Ni el
22-sep ni hoy. Todo lo que se ha mandado en `assistantOverrides` se ha
descartado en silencio, y el modelo ha ido improvisando alrededor del texto del
hueco. Eso es exactamente lo que se oye:

- Microfusa: *«¿Podrías hablar con **nombre de la persona**?»*
- Logik Clinic: *«¿Podría hablar con **qué nombre**?»*
- Dr. Lorente: *«¿Podría **voy a hablar** con el doctor Lorente?»*

Está leyendo el hueco en voz alta y parafraseándolo. No es que la voz se
equivoque: es que nunca ha tenido el dato.

Y explica el defecto del 22-sep que se atribuyó a «se cree falsos nombres»:
cuando preguntó por «Diga» no estaba creyéndose un nombre, estaba rellenando un
hueco vacío con lo último que había oído.

### Segundo efecto: el primer turno se tira a la basura

```
firstMessage: "Hola, buenos días. {{apertura}}"
```

`{{apertura}}` **sí** tiene la sintaxis correcta, pero **no está en ningún
payload del repo** (ni en `llamadas.py`, ni en `vapi_llamada_prueba.py`, ni en
`herramientas.md`). Así que resuelve a vacío y el primer mensaje es siempre un
«Hola, buenos días.» a secas.

Eso es lo que provoca el bucle: el otro contesta «¿hola?» porque no le han dicho
nada, y entonces Raquel suelta su saludo otra vez. Pasa en **las seis llamadas**,
no de vez en cuando. No es un defecto de comportamiento del modelo: es que el
primer turno va vacío por construcción.

---

## EL BLOQUEANTE · Raquel no puede agendar

El prompt dice *«usa la tool `agendar` con el hueco elegido»*. En el asistente:

```
tools:     []
functions: []
toolIds:   null
```

**La herramienta no existe.** El asistente cuyo objetivo declarado es «no
vendes: agendas» no tiene forma de agendar. Aunque una llamada saliera perfecta
y el prospecto dijera sí, no habría cita.

Esto por sí solo explica por qué el canal no ha producido reuniones por esta
vía: no podía.

---

## Lo que corre en producción es la v4, no la v5

`updatedAt: 2026-09-22T07:53:06Z`. El asistente lleva el guion **v4**. La v5
está escrita en el repo desde el 29-sep y sigue sin aplicar, como decía
`herramientas.md`.

Consecuencia directa: la sección de buzones que corre hoy es la de la v4, que es
la que provocó el incidente del 29-sep («Colgar sin dejar mensaje» dicho en voz
alta). La REGLA CERO **no está en producción**.

---

## Sobre la pronunciación · aquí hay que parar y mirar

Las transcripciones dicen «**Michael** Echevarría» (Lorente y Logik), «de
**Qualivo**» (Lorente) y «De **Qualibo**» (Logik).

Y el prompt en producción **ya escribe «Máikel Echevarría» con tilde y
«Cualivo» con C**. O sea: el arreglo del 21-sep ya está aplicado y las
transcripciones siguen diciendo Michael.

Dos explicaciones, y no son lo mismo:

1. **La transcripción miente.** Es el aviso del 22-sep: Deepgram puede escribir
   «Michael» sobre un «Máikel» bien dicho. Entonces no hay problema.
2. **La grafía del prompt no basta.** GPT-4o no copia el prompt: **genera** la
   frase. Puede emitir «Maikel» sin tilde por su cuenta, y lo que llega a
   ElevenLabs es lo que el modelo generó, no lo que pone en el prompt.

Si es la 2, toda la estrategia de «escribirlo con tilde» es insuficiente por
diseño, y el arreglo tiene que estar en la capa de voz —diccionario de
pronunciación de ElevenLabs— o en texto fijo que el modelo no regenere.

**Esto se decide escuchando las grabaciones, y solo así.** Los `callId` están
abajo; `GET /call/<id>` devuelve `recordingUrl`. No pego las URLs aquí porque
son audio de terceros y este fichero va a git.

---

## Lo que sí salió bien, que conviene no romper

- **Martínez Canut:** ante la locución «en breves momentos le atenderemos»,
  Raquel dijo *«Claro, espero»*. El arreglo del silencio del 18-sep funciona.
- **Magister:** ante «¿el qué, perdona?» reformuló en vez de repetir palabra por
  palabra. Cuando tiene contexto que reformular, sabe hacerlo.

---

## Dr. Lorente · el único dato comercial de la tanda

> «No, no nos interesa porque ya colaboramos con una empresa para captación de
> clientes. ¿Vale? Hasta luego.»

Es la objeción «ya tenemos agencia», y **la v4 no la tiene en su lista**. El rol
sí (punto 14) y mi bloque de Lorente también. Raquel no tenía respuesta, así que
aceptó y colgó a los 39 segundos.

No cuenta como «no interesa» de verdad: es un no a una llamada que no llegó a
decir a qué venía. Pero **ya van dos toques** en esa clínica contando el de hoy,
así que sale de la cola de teléfono igualmente.

---

## Magister · dos robots hablando entre ellos

Menú de centralita de cuatro opciones, y detrás **otro asistente de voz**:

> «Hola, soy el gurú de MacCrister. ¿En qué podría ayudarte? ¿Hola? ¿Ahora me
> oyes?»

Raquel y ese bot estuvieron **211 segundos** sin oírse, repitiendo «¿me
escuchas?», hasta que saltó el `silenceTimeoutSeconds` de 45. Se comió el 47 %
del coste de la tanda.

Dos cosas que hay que tocar:

1. **DTMF sigue abierto** y aquí se ve el precio: cualquier centralita es tiempo
   y dinero tirados.
2. **`voicemailDetection` está en `openai` y no detectó nada.** Un menú de
   opciones no es un buzón, así que técnicamente no falló; simplemente no hay
   nada que detecte una centralita. Dos de las seis (Martínez Canut y European
   Open) empezaron con locución de espera y una tercera con menú: **la mitad de
   la tanda.**

---

## Las cuatro correcciones, por orden de impacto

| # | Qué | Coste | Sin esto… |
|---|---|---|---|
| 1 | Cambiar `{simple}` por `{{doble}}` en las 6 variables del prompt | 5 min | el briefing nunca llega y Raquel lee los huecos en voz alta |
| 2 | Mandar `apertura` en `variableValues`, o quitarlo del `firstMessage` | 5 min | el primer turno va vacío y se provoca el bucle de «¿hola?» |
| 3 | Crear la tool `agendar` y engancharla al asistente | medio día con el webhook de n8n | no puede haber reuniones por teléfono |
| 4 | Aplicar la v5 (REGLA CERO + buzones) | 10 min | sigue en producción el guion que dijo «Colgar sin dejar mensaje» |

Las cuatro son cambios en el asistente de producción y **ninguna se toca sin el
ok de Máikel**.

Y una que no es de guion: **el `{{apertura}}` mal enganchado y las llaves
simples se habrían visto en la primera llamada de prueba si alguien hubiera
leído una transcripción entera.** Se leyeron para juzgar la pronunciación, que
es justo lo que una transcripción no puede decir, y no para comprobar si el dato
del lead había llegado, que es justo lo que sí puede decir.

---

## Transcripciones literales

### Clínica Dental Dr. Lorente · +34963312771 · 39 s · colgó el cliente
```
AI:   Hola, buenos días.
User: Doctor Lorente, buenos días.
AI:   Hola, buenos días. ¿Podría voy a hablar con el doctor Lorente?
User: ¿Para qué sería?
AI:   Es de parte de Michael Echevarría, de Qualivo. Le escribió por correo hace
      unos días sobre un tema relacionado con la captación de cliente y quería
      comentarle una cosa.
User: No, no nos interesa porque ya con colaboramos con una empresa para
      captación de clientes. ¿Vale? Hasta luego.
```

### Microfusa · +34917024592 · 67 s · colgó el cliente
```
AI:   Hola, buenos días.
User: ¿Hola? Hola, buen
AI:   Hola, buenos días. ¿Podrías hablar con nombre de la persona?
User: ¿Perdón?
AI:   Perdona, creo que no no me expliqué bien ¿Podría hablar con la persona encargada
User: Sí,
AI:   de la
User: Dime, dime para qué sería. ¿Hola? ¿Hola?
```

### Logik Clinic · +34937544071 · 63 s · colgó el cliente
```
AI:   Hola, buenos días.
User: ¿Hola?
AI:   Hola, buenos días. ¿Podría hablar con qué nombre?
User: Buenos días. ¿Cómo? Hola. ¿Hola? ¿Hola? ¿Hola? Hola. ¿Quién es? Hola, ¿quién es?
AI:   Hola, soy la asistente de Michael Echevarría. De Qualibo.
```

### Clínica Dental Martínez Canut · +34963518689 · 21 s · colgó el cliente
```
AI:   Hola, buenos días.
User: Clínica Martínez Canot. En breves momentos le atenderemos.
AI:   Claro, espero
User: ¿Tienes que anote? Dígame. ¿Hola?
```

### Magister · +34919332744 · 211 s · silence-timed-out
```
AI:   Hola, buenos días.
User: Para asegurar la calidad del servicio, es posible que su llamada sea
      grabada. Para hablar con el departamento de oposiciones, cursos
      homologados o inglés, pulse 1. Hablar con el departamento de grados o
      menciones, pulse 2. Para hablar con el departamento de masters, pulse 3.
      Para otras cuestiones, pulse 4 o espere. Si quiere información para
      reservar su plaza, pulse 3. Para otras gestiones, pulse 4 o espere.
      Hola, soy el gurú de MacCrister. ¿En qué podría ayudarte? ¿Hola?
      ¿Ahora me oyes?
AI:   Hola, buenos días. ¿Podría hablar con la persona que lleva la la parte de
      captación de clientes o de marketing?
User: ¿El qué, perdona?
AI:   Sí, disculpa, estoy buscando a la persona que se encarga de la captación
      de clientes o de marketing en vuestra empresa, ¿cuál sabes quién podría ser?
User: Vale, captación de de clientes para marketing, ¿verdad? Me dices. Me ha
      dicho Ahora, ¿me me estás escuchando? Hola, ¿me me has me escuchas?
      Hola, ¿me me está escuchando?
```

### European Open Business School · +34911989523 · 31 s · colgó el cliente
```
AI:   Hola, buenos días.
User: ¿Ha contactado con European Open Business School. Manténgase a la espera y
      en breve le atenderemos.
AI:   Hola, buenos días. ¿Podría hablar con la persona que lleva la parte de
      captación de clientes o de marketing
```

---

## Identificadores, para volver al audio

`GET https://api.vapi.ai/call/<id>` devuelve `transcript`, `summary`,
`endedReason` y `recordingUrl`. User-Agent de navegador obligatorio.

| Empresa | callId |
|---|---|
| Dr. Lorente | `01a0f19c-9bec-7993-b0fe-c5830a196f8e` |
| Microfusa | `01a0f19c-a563-7ccf-9aca-03496d666ce6` |
| Logik Clinic | `01a0f19c-af0b-7993-b101-4b764058b78d` |
| Martínez Canut | `01a0f19c-b88b-7993-b102-277ebcabf2a0` |
| Magister | `01a0f19c-c1fe-7ccf-9acb-338bb6e35e15` |
| European Open | `01a0f19c-cbf0-7002-b616-73fb032b3eba` |

## Configuración del asistente, tal como está hoy

| | |
|---|---|
| id | `fe2ed34d-82e9-4c6b-b351-8acf90d9dcce` («Qualivo SDR») |
| guion | **v4** · `updatedAt` 2026-09-22 |
| modelo | `gpt-4o` (openai) |
| voz | ElevenLabs `1eHrpOW5l98cxiSRjbzJ` |
| firstMessage | `Hola, buenos días. {{apertura}}` ← variable no enviada |
| silenceTimeoutSeconds | 45 |
| maxDurationSeconds | 300 |
| startSpeakingPlan | `waitSeconds: 0.8` |
| stopSpeakingPlan | `numWords: 3`, `voiceSeconds: 0.3`, `backoffSeconds: 1.5` |
| voicemailDetection | `openai` |
| tools / functions | **vacío** ← no existe `agendar` |
| server (fin de llamada) | webhook de n8n `agente-llamadas-resultados` |

> El `phoneNumberId` que pasó Máikel (`2f99f0e4-…`) **no es** el que figura en
> `traspaso-a-otra-sesion.md` (`b60821ae-…`). Conviene confirmar cuál es el
> número emisor vivo antes de la siguiente tanda.
