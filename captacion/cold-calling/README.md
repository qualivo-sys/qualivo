# Agente de Cold Calling · estado al 30-sep-2026

Primer día. **Montaje, no llamadas.** No se ha marcado ningún número.

El rol completo ya está leído: `captacion/agente-llamadas/rol-cold-calling-agent.md`, 21 secciones
más PRINCIPIO FINAL. **Ese es la fuente de verdad**, no el que venía en el system prompt, que
estaba cortado a media frase en la sección 2.

## Qué hay aquí

| Fichero | Qué es |
|---|---|
| `llamada-lorente-30sep.md` | **El entregable.** El contrato del punto 19 completo, montado sobre un lead real de `calientes-30sep.json`, con su payload de Vapi y los tres defectos que salen al montarlo |
| `prioridad-612-fichas.md` | Cómo ordenar las 612 fichas, con recuentos reales del fichero |
| `guion-cold-calling-v1.md` | Capa operativa: mecánica de marcar, contestador, centralita, RGPD, tabla de resultados. **No es un guion de llamada**: el rol dice que esos se hacen uno por llamada |

## LA DECISIÓN QUE HAY QUE TOMAR · el punto 19 no cabe en la v5

Esto era una duda de criterio y ahora tiene causa concreta. Al montar el bloque del punto 19 para
Dr. Lorente aparece el tope:

El asistente de Vapi acepta diez variables (`nombre`, `empresa`, `cargo`, `vertical`,
`email_que_abrio`, `n_aperturas`, `dato_concreto`, `dato_corto`, `dias_ofrecidos`, `email`) y solo
transportan **contexto de apertura**. La PREGUNTA PRINCIPAL, las seis RAMIFICACIONES y las
objeciones del punto 19 no tienen hueco: la v5 lleva su propia lista cerrada de objeciones y su
propio objetivo único, que es «no vendes: agendas». Y `herramientas.md` lo dice: *«si quieres una
variable nueva, tiene que existir primero en el prompt del asistente»*.

O sea: **no se puede entregar el punto 19 a Raquel inyectando variables.** Las dos opciones, con su
coste:

| | Qué implica | Coste | Riesgo |
|---|---|---|---|
| **1 · Raquel hace discovery** | Reescribir el prompt del asistente entero, no solo las variables | Un día de trabajo y una tanda de pruebas al móvil de Máikel antes de soltarlo | Llamadas más largas, más turnos, más margen para que se salga del guion. Y con el defecto de narrar el razonamiento todavía abierto, más turnos es más superficie de fallo |
| **2 · Raquel sigue agendando** | La v5 se queda como está. El punto 19 lo usa una persona | Cero | El rol se aplica a medias y el discovery no escala |

**Mi recomendación: opción 2 por ahora, y probar la 1 en paralelo contra el móvil de Máikel.** El
motivo no es el guion, es que de los cuatro defectos del 22-sep siguen dos abiertos, y los dos
empeoran cuanto más larga es la llamada. Pedirle discovery a una voz que todavía puede narrar su
razonamiento en alto es subir la apuesta con el problema sin arreglar. Pero es decisión de Máikel y
**no se toca el asistente de producción sin su ok**.

## Bloqueado · las transcripciones de las 6 llamadas de hoy

No las he podido recuperar. **Falta la clave de Vapi.**

- `api.vapi.ai` sí es alcanzable desde este contenedor: devuelve 401 limpio sin cabecera de
  autorización, o sea que la red no es el problema.
- La clave vive en el scratchpad de la sesión de Outbound y los scratchpads no se comparten. Está
  escrito así a propósito en `herramientas.md` y en `traspaso-a-otra-sesion.md`.
- No tengo canal de mensajes con la sesión de Outbound desde aquí.

Cuando lleguen: **pide también las grabaciones.** La transcripción no sirve para juzgar la
pronunciación; Deepgram escribe «Michael» sobre un «Máikel» bien dicho, y el 21-sep se concluyó al
revés sobre esa base.

### Lo que sí se puede decir de esas 6 llamadas sin las transcripciones

Que salieron con **tres de los cuatro defectos del 22-sep abiertos**, y contra la decisión escrita
ese día de no volver a marcar hasta cerrarlos:

| Defecto del 22-sep | ¿Cerrado hoy? |
|---|---|
| Sin DTMF: no sabe marcar un dígito en una centralita | **No** |
| Narra su razonamiento en voz alta | **No** — volvió a pasar el 29-sep |
| Se cree falsos nombres («Diga») | **No** — no está en la v5 |
| Repite la apertura palabra por palabra | **No** — no está en la v5 |

Y un caso concreto: **Microfusa ya se llamó el 22-sep** y acabó en una centralita sin salida. La de
hoy es su segundo toque, el máximo: esa ficha está agotada.

Lo más probable es que las transcripciones confirmen esos defectos, no que revelen otros. El
problema no está en el guion.

## Hallazgos del día, sobre los datos

1. **Kalu Institute tiene 18 aperturas** —el triple que el siguiente— y está en la pila de
   «prefijo raro» porque su número no es válido. La señal más fuerte del material está enterrada
   por un número mal leído.
2. **Los cinco «prefijos raros» son números recortados**, el mismo fallo del 22-sep con las tablas.
   Marcarlos como están es llamar a desconocidos.
3. **`privacidad@cbclinic.com`, 4 aperturas.** Un buzón de privacidad abriendo un correo frío
   cuatro veces no es intención de compra. Fuera de la cola: llamar ahí es pedir una queja LOPD.
4. **Ninguno de los 20 leads calientes trae nombre de persona.** La apertura del punto 4 del rol
   («Hola, ¿David?») no se puede usar en ninguno, y con `nombre` vacío la v5 abre con «Hola, .».
5. **Dr. Lorente está en las dos listas** con dos teléfonos distintos. El cruce entre
   `calientes-30sep.json` y `maps-pool-612.json` no está hecho.
6. **315 de las 612 fichas (51 %) son de los sectores aparcados.** El pool útil es 293.
7. **No hay ni una clínica de Madrid o Barcelona en el pool**, y es la vertical de mejor calidad
   medida. Hueco de la extracción, no del sector.
8. **La sonda marca como buenas las webs detrás de un WAF.** `dentallorente.com` sale `OK` con
   todo a cero y lo que se leyó fue una pantalla de Cloudflare. 15 casos seguros en las 2.532
   filas ya sondeadas, más 285 a revisar. Arreglo de dos líneas, en `prioridad-612-fichas.md`.

## Pendiente de Máikel, por orden

1. **Las claves**, que él pegue en esta sesión: `.vapi_key`, `.vapi_assistant_id`,
   `.vapi_phone_id`, `.smartlead_key`, y `.ghl_key` / `.ghl_loc` / `.ghl_calendar` para registrar.
   Sin la de Smartlead no puedo leer el correo literal que recibió cada lead, y sin eso la frase
   «Máikel te escribió porque…» sería inventada.
2. **La decisión de arriba**: opción 1 o opción 2.
3. **Aplicar o no la v5 en el asistente de Vapi.** Escrita desde el 29-sep y **sin aplicar**.
4. **Ok al bloque de Lorente** tal como está, o correcciones.
5. **Ok a llamar**, y a qué banda de la cola.
6. **¿Se extraen clínicas de Madrid y Barcelona?** El script ya está escrito para esas ciudades.

## Preguntas de criterio que el rol no resuelve

El rol completo cierra la sección 2 («una apertura no significa intención de compra; úsala solo
para priorizar»). Quedan cuatro cosas que he tenido que decidir yo:

1. **Cuántas aperturas dan derecho a llamada, y quién llama a quién.** `diseno.md` dice que el
   agente llama al segundo escalón (3-5) y que a los de 8 o más los llama Máikel en persona. He
   asumido que sigue en vigor. Si ha cambiado, cambia toda la cola — y Kalu, con 18, sería de
   Máikel.
2. **Cómo se encadenan teléfono y correo.** ¿La llamada entra antes, después o entre qué pasos de
   la secuencia? ¿Y la secuencia de correo se para después de una llamada?
3. **Si un correo gasta cupo de los dos toques**, o los dos intentos son solo de teléfono.
4. **Qué hace un «no me interesa» telefónico con la secuencia de correo.** He asumido supresión en
   los dos canales: es lo conservador y lo que evita otra queja LOPD.
