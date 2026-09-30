# Agente de Cold Calling · estado al 30-sep-2026

Primer turno. **Montaje, no llamadas.** No se ha marcado ningún número y no se
marcará ninguno hasta que Máikel lo apruebe.

## Qué hay aquí

| Fichero | Qué es |
|---|---|
| `guion-cold-calling-v1.md` | El guion: apertura (frío y tibio), gatekeeper, una pregunta de discovery por vertical, cinco objeciones, cierre hacia reunión con Máikel, tabla de resultados |
| `prioridad-612-fichas.md` | Criterio para ordenar las 604 fichas con teléfono, montado sobre la sonda que ya existe en el repo |

## Leído antes de escribir nada

- `captacion/agente-llamadas/guion-raquel-v5.txt`
- `estrategia/mensajes-v3.md`
- `estrategia/propuesta-valor-v1.md`
- `captacion/llamadas-calientes-30sep.md`
- Y dos que no estaban en el encargo y cambian las conclusiones:
  `captacion/raquel-estado-22sep.md` (las tres llamadas de prueba del 22-sep,
  con los cuatro defectos) y `captacion/agente-llamadas/diseno.md`.

## Bloqueado · las transcripciones de hoy

No he podido recuperar las 6 llamadas de las 11:15. **Falta la clave de Vapi.**

- `api.vapi.ai` sí es alcanzable desde este contenedor (devuelve 401 sin
  cabecera de autorización, o sea que la red no es el problema).
- La clave vive en el scratchpad de la sesión de Outbound
  (`.vapi_key`, `.vapi_assistant_id`, `.vapi_phone_id`) y ese scratchpad muere
  con su contenedor. Está escrito así a propósito en
  `captacion/agente-llamadas/traspaso-a-otra-sesion.md`: ninguna clave en el
  repo, y la sesión nueva necesita que Máikel se la pase.
- No tengo canal de mensajes con la sesión de Outbound desde aquí.

Se resuelve de dos maneras, las dos de Máikel:
1. Me pasa la clave privada de Vapi (y el `assistantId`), o
2. le pide a la sesión de Outbound que volqué las 6 transcripciones **y las
   grabaciones** a `captacion/agente-llamadas/pruebas-30sep/`.

Aviso importante para cuando lleguen: **la transcripción no sirve para juzgar
la pronunciación.** Deepgram escribe «Michael» sobre un «Máikel» bien dicho. El
21-sep se dio por hecho lo contrario y la conclusión no se sostenía. Hay que
escuchar el audio.

## Lo que sí se puede decir hoy de esas 6 llamadas, sin las transcripciones

Que salieron con tres de los cuatro defectos del 22-sep todavía abiertos, y
contra la decisión escrita ese día de no volver a marcar hasta cerrarlos:

| Defecto del 22-sep | ¿Cerrado el 30-sep? |
|---|---|
| Sin DTMF: no sabe marcar un dígito en una centralita | **No** |
| Narra su razonamiento en voz alta | **No** — volvió a pasar el 29-sep |
| Se cree falsos nombres («Diga») | **No** — no está en la v5 |
| Repite la apertura palabra por palabra | **No** — no está en la v5 |

Y un caso concreto: **Microfusa ya se llamó el 22-sep** y acabó en centralita
sin salida. La de hoy es su segundo toque, que es el máximo. Esa ficha está
agotada.

Lo digo porque cuando lleguen las transcripciones lo más probable es que
confirmen esos defectos, no que revelen otros. Y eso significa que el problema
no está en el guion.

## Pendiente de Máikel, por orden

1. **Clave de Vapi** (o el volcado de las 6 transcripciones y grabaciones).
2. **`maps_pool.json` al repo.** Sin la lista, el criterio de priorización no
   se puede aplicar.
3. **Aplicar o no la v5 en el asistente de Vapi.** Está escrita en el repo
   desde el 29-sep y **no está aplicada.** Es decisión suya.
4. **Ok a los créditos de Apollo** para el tamaño de plantilla por dominio
   (80–150 dominios de 2.467 créditos disponibles).
5. **Ok al guion y ok a llamar**, y a qué banda de la cola.
6. **Completar la sección 2 del rol y las siguientes** (ver abajo).

## Lo que falta del rol · la sección 2 llegó cortada

La sección 2 («CONTEXTO DEL OUTBOUND») se corta a media frase en *«Una
apertura NO significa necesariamente intención de»*. Lo que falta y he tenido
que decidir yo, para que lo corrija:

1. **Cómo se lee una apertura.** El final de esa frase es la regla. Yo he
   asumido: la apertura ordena la cola y nunca se menciona al prospecto.
2. **Cuántas aperturas dan derecho a llamada, y quién llama a quién.**
   `diseno.md` dice que el agente llama al segundo escalón (3–5 aperturas) y
   que los de 8 o más los llama Máikel en persona. He asumido que sigue en
   vigor. Si ha cambiado, cambia toda la cola.
3. **Cómo se encadenan teléfono y correo.** ¿La llamada entra antes, después o
   entre qué pasos de la secuencia? ¿Y qué pasa con la secuencia de correo
   después de una llamada: se para, sigue, se cambia?
4. **Cómo se reparten los dos toques** entre canales. Los dos intentos de
   `diseno.md` son de teléfono; no sé si un correo gasta cupo.
5. **Qué hace un «no me interesa» dicho por teléfono con la secuencia de
   correo.** He asumido supresión total, en los dos canales. Es lo más
   conservador y lo que evita otra queja LOPD.
6. **Quién lleva a los que sí respondieron al correo**, si el SDR o yo.
7. **Las secciones 3 y siguientes**, que no llegaron. Doy por hecho que ahí
   iban el flujo de la llamada, el escalado a Máikel, el reporte y los
   límites. Lo que he escrito en el guion son mis decisiones, no las suyas.
