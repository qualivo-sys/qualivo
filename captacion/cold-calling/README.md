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

## Las 6 llamadas de hoy · recuperadas y analizadas

Máikel pasó las claves. El parte completo, con las seis transcripciones
literales, está en **`captacion/agente-llamadas/pruebas-30sep.md`**.

Resultado: **cero conversaciones con un decisor, cero reuniones, cinco de seis
colgaron ellos.** Y la causa no es el guion:

1. **El briefing nunca ha llegado a Raquel.** El prompt escribe los huecos con
   llave simple (`{nombre}`) y Vapi solo sustituye `{{doble}}`. Cero
   placeholders correctos en todo el prompt. Todo lo mandado en `variableValues`,
   desde siempre, se ha descartado en silencio, y se oye a Raquel leyendo el
   hueco en voz alta: *«¿Podrías hablar con nombre de la persona?»*
2. **`firstMessage` es `"Hola, buenos días. {{apertura}}"` y `apertura` no se
   manda nunca.** El primer turno va vacío, el otro contesta «¿hola?» y Raquel
   repite el saludo. Pasa en las seis, por construcción.
3. **`agendar` no existe.** `tools: []`, `functions: []`. El asistente cuyo
   objetivo declarado es «no vendes: agendas» no tiene forma de agendar.
4. **Corre la v4**, no la v5 (`updatedAt` 2026-09-22).

Esto corrige dos cosas que yo escribí antes atribuyéndolas al modelo y que eran
configuración: el bucle de «¿hola?», y lo de «creerse falsos nombres» del
22-sep. Cuando preguntó por «Diga» no se estaba creyendo un nombre: estaba
rellenando un hueco vacío con lo último que había oído.

Y una corrección sobre la pronunciación: **el prompt en producción ya escribe
«Máikel Echevarría» con tilde y «Cualivo» con C**, y las transcripciones siguen
diciendo «Michael» y «Qualibo». O la transcripción miente —el aviso del
22-sep— o la grafía en el prompt no basta, porque GPT-4o **genera** la frase en
vez de copiarla y lo que llega a ElevenLabs es lo que generó el modelo. Se
decide escuchando las grabaciones, y solo así.

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

1. **Ok a las cuatro correcciones del asistente**, por orden de impacto y
   detalladas en `pruebas-30sep.md`: llaves dobles · `apertura` · la tool
   `agendar` · aplicar la v5. Las tres primeras son minutos; `agendar` es medio
   día con el webhook de n8n. **No toco el asistente de producción sin su ok.**
2. **Confirmar el número emisor.** El `phoneNumberId` que pasó (`2f99f0e4-…`) no
   es el de `traspaso-a-otra-sesion.md` (`b60821ae-…`).
3. **La decisión de arriba**: opción 1 o opción 2.
4. **Ok al bloque de Lorente** tal como está, o correcciones.
5. **Ok a llamar**, y a qué banda de la cola.
6. **¿Se extraen clínicas de Madrid y Barcelona?** El script ya está escrito para esas ciudades.

Claves: ya están. Viven en el scratchpad de esta sesión y **no van al repo**.
Falta solo `.ghl_calendar` (qualivo-20 es `zBlsw8BEKA2zah81YlOl` según el
traspaso, sin confirmar). El `.gitignore` ya cubre los nombres de fichero que
usan los scripts: antes no, y `captacion/scripts/` está dentro del repo, así que
un `git add -A` las habría publicado.

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
