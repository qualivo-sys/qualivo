# Llamada preparada · Clínica Dental Dr. Lorente · 30-sep-2026

Entregable del punto 19 del rol, para un lead real de `captacion/datos/calientes-30sep.json`.
Hecho a mano a propósito, antes de automatizar nada.

**No se ha llamado. No se llama sin el ok de Máikel.**

---

## CONTEXTO

### Hechos (verificados, con su fuente)

| Dato | Valor | Fuente |
|---|---|---|
| Empresa | Clínica Dental Dr. Lorente | `calientes-30sep.json` + `maps-pool-612.json` |
| Ciudad | València | ficha de Maps |
| Correo de contacto | `cita@dentallorente.com` | lead de campaña |
| Teléfono a marcar | **+34 963 31 27 71** | publicado en el título de su propia web |
| Segundo teléfono | +34 961 14 39 57, sede «Alameda» | ficha de Maps |
| Campaña | «Clinicas WhatsApp» (Smartlead) | lead de campaña |
| Señal de intención | 6 aperturas, sin responder, sin rebote | Smartlead · **interna, no se menciona jamás** |
| Nombre de la persona | **no lo tenemos** | los 20 leads de la lista vienen sin `nombre` |
| Cargo | **no lo tenemos** | ídem |

**Dos cosas que este lead enseña y que no estaban vistas:**

1. **Está en las dos listas.** Aparece como lead de campaña (tel 963312771) y como ficha de Maps
   («Dr. Lorente (Alameda)», tel 961143957). El cruce entre `calientes-30sep.json` y
   `maps-pool-612.json` no está hecho. Sin ese cruce, esta clínica recibiría dos llamadas frías
   como si fueran dos empresas.
2. **Dos números publicados = probablemente dos sedes.** Es la mejor pista de tamaño que tenemos
   de esta empresa, y apunta a que pasa el suelo de 5 personas del ICP. No está confirmado.

### Lo que NO se ha podido verificar

- **El cuerpo literal del correo que recibieron.** Hace falta
  `GET /campaigns/<id>/leads/<leadId>/message-history` de Smartlead y **no tengo la clave**. Por
  eso la apertura de abajo NO afirma de qué iba el correo: dice que Máikel escribió, que es un
  hecho, y deja que lo diga el otro. El punto 16 del rol prohíbe inventar y el 19 lo repite.
- **Las señales de su web.** La sonda devuelve `OK` pero lo que ha leído es una pantalla de
  Cloudflare («One moment, please…»), no su web. Cero señales aquí significa «no he podido
  mirar», no «no invierten». Detalle y arreglo al final.

### Aviso sobre `cita@` como buzón

`cita@dentallorente.com` es un buzón de rol. Las 6 aperturas pueden ser de una recepcionista, de
varias personas o de un escáner de correo. **Como señal de priorización vale; como prueba de
interés de un decisor, no.** Se llama sabiendo eso.

---

## HIPÓTESIS

La que vamos a comprobar, una sola:

> Llegan peticiones de precio por WhatsApp, se contesta el precio, y quien no pide cita en ese
> momento se queda sin que nadie vuelva a escribirle.

De dónde sale: es el ángulo declarado de la campaña «Clinicas WhatsApp», escrito en
`captacion/scripts/llamadas.py` («que muchos que preguntan precio por WhatsApp no acaban pidiendo
cita») y en `estrategia/mapa-sectores-29sep.md` («Clínicas · precio por WhatsApp»).

**Es hipótesis, no hecho**, por dos motivos: no he leído el correo literal, y el ángulo de la
campaña no es lo mismo que el problema de esta clínica. Si en la llamada resulta que no usan
WhatsApp, la hipótesis cae y hay rama preparada para eso.

---

## APERTURA

Todo lo que va entre comillas se pronuncia. Todo lo que no, no.

### A · quien coge el teléfono (es el caso real: no tenemos nombre)

> «Hola, buenos días. Soy Raquel, del equipo de Máikel Echevarría, de Cualivo. Máikel os escribió
> hace unos días por correo sobre cómo lleváis las peticiones de pacientes nuevos. ¿Quién lleva
> ahí esa parte?»

Y callar.

Si contesta «¿de qué se trata?», que es lo que pasa casi siempre:

> «Estamos hablando con clínicas de Valencia sobre qué pasa con la gente que pide precio y no
> acaba pidiendo cita. Máikel escribió por eso y quería comentarlo con quien lleve esa parte.»

Si dice que eso lo lleva ella misma: sigue en la rama B con ella. Es lo más probable en una
clínica.

Si da un nombre y no está: apunta nombre y hora, da las gracias, cuelga. No dejes el recado
entero si puedes volver a llamar.

### B · ya tienes a la persona

> «Máikel te escribió hace unos días por correo. No sé si llegaste a verlo.»

Y callar. **No continuar hablando.**

- Si dice que sí → «Perfecto, te llamaba justo por eso. ¿Te cuento en veinte segundos por qué te
  escribió y me dices si tiene sentido?» Y esperar el permiso.
- Si dice que no → «Normal. Te lo resumo en veinte segundos y me dices si tiene sentido.»

### El resumen de veinte segundos, si da permiso

> «Trabajamos con clínicas que reciben peticiones y presupuestos y pierden parte de esas
> oportunidades entre el primer contacto y el seguimiento. A veces se contesta tarde, otras el
> paciente deja de responder, y otras un presupuesto simplemente se enfría. Nosotros trabajamos
> justo esa parte.»

E inmediatamente la pregunta. **Nunca dos pitches seguidos.**

---

## PREGUNTA PRINCIPAL

> «Cuando alguien os pregunta el precio por WhatsApp y no acaba pidiendo cita, ¿qué pasa con ese
> contacto después?»

Y callar. Contar hasta cinco por dentro.

---

## RAMIFICACIONES

### 1 · «Se le vuelve a escribir» / «le insistimos»

> «Vale. ¿Y eso lo hace alguien en concreto o el que esté en recepción ese día?»

Y después:

> «¿Y soléis insistir una vez, dos?»

Si sale «depende de quién esté» o «una o dos veces», **ahí está la fuga** y es la frase que hay
que anotar literal. Pasa a profundizar.

### 2 · «Nada, si no contesta se queda ahí»

Fuga confirmada de primeras. No te lances:

> «Entiendo. ¿Y eso os pasa con pocos casos o es bastante habitual?»

Si dice «bastantes»:

> «Vale. Entonces ahí sí puede haber algo, porque son pacientes que ya os habían escrito y
> simplemente se enfrían porque nadie vuelve.»

Pasa al cierre.

### 3 · «No lo sé» / «no sabría decirte»

Es la mejor respuesta que pueden dar.

> «Es lo normal, casi nadie lo tiene medido. Y es justo lo que Máikel mira en la llamada.»

Pasa al cierre.

### 4 · «No usamos WhatsApp»

La hipótesis cae. Se reconoce y se pivota, sin forzarla:

> «Vale, entonces por teléfono. Cuando alguien llama preguntando precio y no se queda con cita
> ese día, ¿qué hacéis después?»

### 5 · «Eso lo tenemos bien resuelto» / «lo llevamos al día»

No se fabrica dolor. El rol lo dice y se cumple:

> «Perfecto. Entonces probablemente no tiene sentido que te quite tiempo. Gracias por cogerlo.»

Cerrar bien y registrar como D — NO FIT. Es un resultado válido, no un fracaso.

### 6 · «Sí, eso nos pasa»

> «¿Y te acuerdas de algún caso reciente?»

Deja que lo cuente él. Sus palabras valen más que las tuyas, y son lo que se le pasa a Máikel.

---

## OBJECIONES PROBABLES

### «Mándame información»

> «Claro. Y para no mandarte el típico PDF que no sirve de nada, dime solo una cosa: cuando
> alguien pide precio y luego deja de contestar, ¿tenéis algún seguimiento definido?»

Si aparece problema:

> «Perfecto. Entonces te mando exactamente esa parte y, si tiene sentido, lo veis con Máikel.»

Se rebate **una sola vez**. Si insiste: «Hecho, ¿a qué correo te lo mando?», apuntar y cerrar.

### «Eso lo lleva el doctor / la dirección»

> «Claro. ¿Y cómo se llama, para preguntar por él cuando vuelva a llamar? ¿A qué hora suele
> estar?»

Nunca fingir que le conoces.

### «Ya tenemos a alguien que nos lleva el marketing»

> «Perfecto, y esto no lo sustituye. Ellos os traen pacientes. Lo que quería entender es qué pasa
> después: cuando alguien pregunta y no contesta, o deja un presupuesto pendiente. ¿Eso también
> os lo llevan?»

### «No me interesa»

> «No hay problema. Solo por no volver a molestarte con algo que no aplica: ¿es porque ya tenéis
> esa parte resuelta o porque ahora mismo no es prioridad?»

Si confirma que no hay interés, **no se discute**. Se agradece y se cuelga.

### «Ahora no puedo, estoy con un paciente»

> «Sin problema. ¿Te va mejor esta tarde o mañana por la mañana?»

Coger ventana y colgar en menos de diez segundos. No cuenta como intento gastado: es una cita.

### «¿De dónde habéis sacado mi número?»

> «Está publicado en vuestra web. Llamamos a empresas, no a particulares. Y si queréis que no
> volvamos a llamar ni a escribir, lo apunto ahora mismo y ya está.»

Si dice que sí: se apunta, se confirma en voz alta, se bloquea el mismo día y se pausa el lead en
Smartlead. Sin preguntar el motivo.

### «¿Eres una máquina?»

> «Sí, soy la asistente automática de Máikel, me tiene para cuadrar la agenda. Si prefieres que te
> llame él en persona, se lo paso. ¿Cómo lo quieres?»

---

## CIERRE

Conectado al problema que haya salido, nunca «¿quieres una reunión?». Reduciendo la decisión paso
a paso:

> «Por lo que me cuentas, creo que sí tendría sentido que Máikel vea cómo lo tenéis montado. En
> veinte minutos repasa con vosotros ese recorrido y os dice dónde cree que se están quedando
> pacientes. ¿Te encaja mejor mañana o el jueves?»

Después:

> «¿Mañana o tarde?»

Después, hora concreta. Y al confirmar:

> «Pues apuntado, {día} a las {hora}. Te llega la invitación al correo ahora mismo. ¿Te la mando a
> cita@dentallorente.com o mejor a otro?»

Confirma el correo despacio y **espera**. Si se queda callado está apuntando, no se ha ido.

Si duda de qué pasa después de la reunión:

> «Y si de ahí sale algo claro, se prueba un mes sin coste. Después ya decidís vosotros si tiene
> sentido seguir.»

Nunca antes. Nunca como gancho de entrada. **Nunca un precio.**

---

## NOTA PARA CRM

Esto **no lo escribe Raquel**. Lo escribo yo leyendo `GET https://api.vapi.ai/call/<callId>`
(`transcript`, `summary`, `endedReason`, `recordingUrl`), y de ahí sale la nota en GHL
(`POST /contacts/<id>/notes`).

Campos a rellenar, según el punto 18 del rol:

- **Clasificación**: A reunión · B interés/seguimiento · C no interesa · D no fit · E no
  contactado · F gatekeeper.
- **Con quién se habló** y si era decisor o recepción.
- **El nombre y el cargo del decisor**, si han salido. Hoy no los tenemos: si la llamada los da,
  es media victoria aunque no haya reunión.
- **Palabras exactas del prospecto** sobre el seguimiento. Literales, sin resumir. Son lo que usa
  Máikel en la reunión.
- **Proceso actual**: quién contesta el WhatsApp, cuántos intentos, qué pasa con los presupuestos.
- **Si la hipótesis se confirmó o cayó**, y por qué. Esto es lo que mejora la siguiente llamada.
- **Objeciones** que aparecieron, literales.
- **Si usan WhatsApp o no** (decide el ángulo del resto de la campaña Clínicas).
- Fecha de reunión, o fecha de rellamada, o motivo de descarte.
- **Y el número que funcionó**: 963312771 o 961143957. Hay dos y solo uno se ha probado.

Y una cosa más, sobre la pronunciación: para saber si sonó «Máikel» o «Michael» hay que **escuchar
`recordingUrl`**. La transcripción de Deepgram no sirve para eso; el 21-sep se concluyó al revés y
la conclusión no se sostenía.

---

## El payload de Vapi, y el problema que aparece al montarlo

Lo que se puede inyectar hoy sin tocar el asistente en producción:

```json
{
  "assistantId": "<.vapi_assistant_id>",
  "phoneNumberId": "<.vapi_phone_id>",
  "customer": { "number": "+34963312771" },
  "assistantOverrides": {
    "variableValues": {
      "nombre": "",
      "empresa": "Clínica Dental Dr. Lorente",
      "cargo": "",
      "vertical": "clinicas",
      "email_que_abrio": "cómo lleváis las peticiones de pacientes nuevos",
      "n_aperturas": "6",
      "dato_concreto": "que mucha gente pregunta el precio por WhatsApp y no acaba pidiendo cita",
      "dato_corto": "lo de las peticiones que no acaban en cita",
      "dias_ofrecidos": "mañana a las diez y media o el jueves a las cuatro",
      "email": "cita@dentallorente.com"
    }
  },
  "//header": "User-Agent de navegador OBLIGATORIO, o Cloudflare devuelve error 1010"
}
```

### Tres defectos que salen de montarlo, y uno es bloqueante

**1 · `nombre` vacío rompe la apertura.** La v5 abre con «Hola, {nombre}». Con `nombre` en blanco
dice «Hola, .» o se lo inventa. Y **los 20 leads de la lista vienen sin nombre**, así que esto
afecta a todos, no a este. Arreglo mínimo: que el prompt del asistente use la rama Caso B cuando
`nombre` esté vacío, en vez de confiar en que el modelo lo deduzca. Eso es tocar el asistente.

**2 · `n_aperturas` viaja hasta Raquel y no debería existir.** El punto 2 del rol prohíbe
mencionar aperturas y el punto 17 lo repite. Mandar el dato dentro del prompt es darle a la voz la
oportunidad de decirlo. Se prioriza con él **antes** de llamar; no tiene por qué entrar en la
llamada. Propongo quitarlo de `variableValues`.

**3 · El bloqueante: el punto 19 no cabe en la v5.** Las diez variables que acepta el asistente
(`nombre`, `empresa`, `cargo`, `vertical`, `email_que_abrio`, `n_aperturas`, `dato_concreto`,
`dato_corto`, `dias_ofrecidos`, `email`) solo transportan **contexto de apertura**. La PREGUNTA
PRINCIPAL, las seis RAMIFICACIONES y las objeciones de arriba no tienen hueco: la v5 lleva su
propia lista cerrada de objeciones y su propio objetivo único, que es «no vendes: agendas».

Y herramientas.md lo dice claro: *«si quieres una variable nueva, tiene que existir primero en el
prompt del asistente»*.

**Conclusión, y no la decido yo:** este bloque no se puede entregar a Raquel inyectando variables.
O se reescribe el prompt del asistente, o este bloque lo usa una persona. Es exactamente el
conflicto que está anotado al final del rol, y ahora tiene una causa concreta en vez de ser una
opinión.

---

## Arreglo pendiente en la sonda (lo he encontrado con este lead)

`probe_dataset.py` marca `estado: OK` con solo mirar que la respuesta pase de 2.500 bytes. La web
de Lorente devuelve 12.054 bytes de pantalla de Cloudflare («One moment, please…»), así que sale
`OK` con todas las señales a cero. Leído tal cual, esta clínica parece no medir ni invertir nada.

Prevalencia medida sobre `captacion/datos/probe-dataset.csv`, 2.532 filas en `OK`:

| | filas |
|---|---:|
| Título de WAF (Cloudflare, «Just a moment…», «Attention Required») | **15** · falso negativo seguro |
| Todas las señales a cero por otro motivo | 285 · a revisar |

Arreglo: marcar `BLOQUEADA_O_CAIDA` cuando el cuerpo o el título contenga *one moment · just a
moment · checking your browser · attention required · access denied*. Son dos líneas y evita
descartar empresas por no haber podido mirarlas.

Y en cualquier caso vale la regla que ya está escrita en herramientas.md: **una señal positiva de
la sonda es un hecho, una negativa no es nada.**
