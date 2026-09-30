# Raquel · Frío · montado el 30-sep-2026

Clon del asistente vivo, listo y **sin número enganchado: no puede llamar a nadie por sí
solo.** Se dispara pasándole el `assistantId` en un POST a `/call`, y eso no se hace sin el
ok de Máikel.

```
id        081d9e7b-2262-4369-b086-714be7ee545b
nombre    Raquel · Frío
clonado   de "Raquel · Landing Diagnóstico" (af978111-4c4e-4373-ba7b-91827bd3efde)
copia     scratchpad · vapi-asistente-landing-backup-2026-09-30.json
```

## Por qué un clon y no un asistente nuevo

Porque el asistente de landing lleva dos semanas de arreglos pagados con llamadas
reales, y casi todos aplican igual en frío. Reescribir desde cero habría sido tirarlos.

Lo que se hereda tal cual, y ya estaba resuelto ahí:

| Herencia | Vino de |
|---|---|
| Tools `agendar_diagnostico` y `huecos_disponibles`, con su URL y su token embebidos | 18-sep · GHL rechazaba las citas por duración |
| Nunca proponer una hora sin llamar antes a `huecos_disponibles` | 29-sep · a Marian se le ofrecieron dos horas inventadas |
| Nunca llamar a una herramienta sin decir antes una frase | 16-sep · Ziad colgó en el silencio de 7 s |
| No repetir el saludo si te cortan: retomar donde estabas | 18-sep |
| **Menú de centralita: callar y colgar, no leer instrucciones en voz alta** | 22-sep |
| **Locución de operadora: no contestar «claro, aquí espero», callar** | 18-sep · TALKUAL |
| Números y ordinales escritos con letras | 18-sep · la voz los leía mal |
| No leer correos enteros, solo el dominio | 18-sep |
| `server` a `qualivo.io/api/vapi-fin` (nota en GHL + Notion con audio) | 18-sep |
| Buzón detectado con mensaje fijo, silencio a 60 s, `endCall` tras el adiós | 17 y 18-sep |

**Y esto es lo que más duele:** las dos reglas en negrita habrían evitado **tres de las seis
llamadas fallidas de hoy**. Martínez Canut y European Open murieron hablando encima de una
locución de espera. Magister se comió 211 segundos y el 47 % del coste hablando con el bot
de su propia centralita. El asistente de landing sabe no hacer eso desde el 22-sep.

## Lo que se cambia para el frío

| Qué | Antes (landing) | Ahora (frío) |
|---|---|---|
| Premisa | «acabas de pedir el diagnóstico» | **nadie ha pedido nada.** Es una llamada en frío y se dice claro si preguntan |
| `firstMessage` | `Hola, ¿{{nombre}}? … Acabas de pedir…` | `Hola, buenos días. Soy Raquel, del equipo de Máikel Echevarría, de Cuálivo. {{saludo}}` |
| Gatekeeper | «no sueltes el motivo» | **respuesta completa a «¿de qué se trata?»**, que en frío te la hacen siempre |
| Variables | `nombre` `origen` `fuga` `email` `email_dominio` | `saludo` `empresa` `categoria` `ciudad` `asunto_correo` `fuga` `pregunta` `email_dominio` |
| Correo | siempre existe (del formulario) | **casi nunca existe**: si `email_dominio` viene vacío, se pide |
| Duración máxima | 420 s | 300 s |
| Resumen de fin | habla de «quien pidió el diagnóstico» | pide nombre y cargo del decisor, si la fuga se confirmó o se cayó, y las objeciones literales |
| Objeciones nuevas | — | «¿de dónde has sacado mi número?» (con la baja ofrecida en la misma frase), «¿esto es publicidad?» |

### El arreglo del `{{nombre}}` vacío, hecho bien

El fallo de hoy fue que `Qualivo SDR` abre con `Hola, {nombre}` y **ninguno de los 20 leads
trae nombre de persona**. Aquí no hay variable de nombre en la apertura: hay `{{saludo}}`,
una frase entera que se calcula por lead y **siempre va rellena**. Para los que no tienen
nombre es la rama de gatekeeper; si algún día hay nombre, es «¿hablo con X?».

Así el primer turno nunca puede salir vacío ni con un hueco a la vista.

### Comprobado en el asistente ya creado

```
{{dobles}}:  asunto_correo · categoria · ciudad · email_dominio · empresa · fuga · pregunta · saludo
{simples}:   NINGUNO
tools:       agendar_diagnostico · huecos_disponibles
server:      qualivo.io/api/vapi-fin
```

Y los dos endpoints responden 401 sin token, o sea que están desplegados, no son un 404.

**`n_aperturas` no existe en este asistente, a propósito.** El punto 2 del rol prohíbe
mencionar aperturas; mandárselas a la voz es darle la oportunidad de decirlas. Se prioriza
con ese dato antes de llamar y no entra en la llamada.

## La cola · `cola-calientes-30sep.json`

Los 20 leads con sus `variableValues` ya escritos, ordenados por señal de inversión y
toques gastados.

| | leads |
|---|---:|
| **Llamables ya** | **12** |
| de esos, con inversión confirmada (`meta_ads` o `google_ads`) | **3** |
| A revisar el número antes de marcar | 4 |
| Fuera de la cola | 4 |

### Los tres primeros, y por qué

Su propio lead de Smartlead trae `senales` con píxel de anuncios, que es lo que
`mapa-sectores-29sep.md` identificó como el predictor del nivel A:

1. **eFISIO Carabanchel Usera** · Madrid · `meta_ads, analitica, whatsapp, cita_online, formulario` · **cero toques**
2. **Logik Clinic Barcelona** · `meta_ads, analitica, whatsapp, formulario` · un toque
3. **Academia MAGISTER** · Madrid · `meta_ads, google_ads, analitica, formulario` · un toque

eFISIO es el mejor de los tres: es el único sin tocar y tiene cinco señales, incluida
cita online.

**Magister lleva aviso:** su centralita tiene un menú de cuatro opciones y detrás otro
asistente de voz. Con las reglas heredadas debería colgar en veinte segundos en vez de
en 211, pero es justo la llamada que hay que escuchar para comprobar que la regla funciona.

### Los cuatro que se van de la cola, y por qué

- **Clínica dental Dr. Lorente — suprimido.** Hoy dijo *«no nos interesa porque ya
  colaboramos con una empresa para captación de clientes»*. Un no es un no, aunque la
  llamada estuviera rota y aunque nunca llegara a decirle a qué veníamos. Es lo que manda
  `diseno.md` y el punto 14 del rol. **Consecuencia incómoda: el bloque de ejemplo del
  punto 19 que escribí esta mañana (`llamada-lorente-30sep.md`) es de un lead que ya no
  vamos a llamar.** Sigue valiendo como ejemplo del contrato; no vale como cola.
- **MICROFUSA — agotado.** Dos toques: 22-sep (centralita sin salida) y 30-sep.
- **CB Clinic — excluido.** El correo es `privacidad@`. Un buzón de privacidad abriendo un
  correo frío cuatro veces no es intención de compra, y llamar ahí es pedir una queja LOPD.
- **Padelmba — sin número.**

### Los cuatro a revisar, y uno urge

**KALU Institute tiene 18 aperturas**, el triple que el siguiente, y su número
(`790697761`) no es válido en España. Es el mejor lead del material y está enterrado por
un número mal leído. Media hora de mirar su web lo desbloquea. Los otros tres son
Brother, Índice y TAES, con el mismo problema.

Y si sigue en vigor la regla de `diseno.md` de que a los de ocho aperturas o más los llama
Máikel en persona, **Kalu es de Máikel, no de Raquel**.

## ARREGLO DE SEGURIDAD aplicado tras la respuesta de Growth

La respuesta de Growth
(`captacion/agente-llamadas/respuesta-a-cold-calling-30sep.md`, rama de la
landing) trae un aviso que me afectaba ya:

**`api/vapi-fin.js` manda un WhatsApp de rescate al contacto** cuando una llamada
acaba «rota» — `silence-timed-out`, o cualquier razón con «error» o «failed» —.
El texto es *«perdona, se nos ha cortado la llamada. Soy Maikel, de Qualivo…»*.
Solo se salta si el contacto tiene `act-baja`, `wa-humano`, `act-agendado` o
`act-cita-confirmada`.

El clon heredaba ese `server.url`. Y los 20 leads de campaña están probablemente
en GHL. **Una llamada como la de Magister —que murió por silencio en una
centralita, sin que hablara nadie— le habría mandado a ese lead un WhatsApp
disculpándose por una llamada que él no recibió.** Es el mismo error que ya se
cometió el 15-sep con un lead cuyo teléfono nunca sonó.

**Aplicado ya sobre el clon:**

```
server:         null      (antes: qualivo.io/api/vapi-fin)
serverMessages: []
maxDurationSeconds: 240   (antes 300)
```

Sin `server` no hay rescate automático, no hay nota automática en GHL y no hay
aviso a Máikel si una llamada se rompe. Eso lo cubro yo: leo los resultados por
`GET /call` y escribo la NOTA PARA CRM a mano, que es lo que pide el punto 19 del
rol de todas formas.

**Es un apaño, no la solución.** La buena es la opción (b) de Growth: mandar
`origen=frio` en `variableValues` y poner una guarda en `vapi-fin.js` que no
rescate ni etiquete cuando sea frío — una línea, igual que la que ya existe para
`vv.demo === '1'`. Eso toca código de producción de la landing, así que lo decide
Máikel. Yo también prefiero la (b): así los fallos de voz del frío sí avisan a
Máikel.

### Donde no coincido con Growth: la duración y el silencio

Propone `maxDurationSeconds` 120 y `silenceTimeoutSeconds` 20-25. He puesto **240
y he dejado el silencio en 60**, y el motivo es concreto:

- **120 s mataría llamadas buenas.** La primera cita real que cerró Raquel (Grupo
  Rumy, 18-sep) duró 149 s. Una llamada en frío que llega a discovery y a agenda
  no cabe en dos minutos.
- **Bajar el silencio a 25 s reabre un incidente real.** Los 60 s se pusieron el
  18-sep precisamente porque con 25 se colgó encima de una compañera de TALKUAL
  que estaba apuntando el recado. En frío los recados son frecuentes. No cambio
  un daño real y conocido por ahorrar treinta céntimos.
- **Y el silencio no es el que acota una centralita.** Magister duró 211 s con el
  silencio ya en 45, porque el otro bot no paraba de hablar: nunca hubo 45 s
  seguidos de silencio. Lo que acota eso es la regla del prompt —callar ante un
  menú y colgar con `endCall`, y colgar a la segunda vez si contesta otra
  máquina— más el tope de duración como red. La regla ya está en el clon.

Si tras la primera tanda una centralita se sigue comiendo más de un minuto, bajo
la duración. Pero no toco el silencio.

## 30-sep 16:42 · primera llamada de prueba: FALLA POR CUOTA DE VOZ

```
callId        01a0f2c4-1b3f-7ccf-a732-dc86a1a67d49
destino       +34 663 375 205 (móvil de Máikel)
duración      0,4 s
final         pipeline-error-eleven-labs-quota-exceeded
transcripción vacía · no llegó a sonar nada
```

**La cuenta de ElevenLabs se ha quedado sin crédito.** No es el asistente, no es
el guion y no es el número: es el proveedor de voz.

Cuándo pasó, según el listado de llamadas de la cuenta:

| | |
|---|---|
| 30-sep 09:19 · las 6 llamadas en frío | la voz funcionaba |
| 30-sep 14:42 · esta prueba | cuota agotada |

O sea que se agotó **hoy, entre las 11:19 y las 16:41 de Madrid**. Las seis
llamadas de la mañana fueron de las últimas que salieron con voz.

### Qué significa

**No se puede llamar a nadie hasta que Máikel recargue ElevenLabs.** Ni la tanda
de diez, ni una sola. Cualquier llamada que se lance ahora muere en cuatro
décimas de segundo sin que suene el teléfono.

Lo bueno: costó 0,0008 USD averiguarlo, y se averiguó con una llamada a su propio
móvil en vez de quemando diez leads buenos. Si la tanda hubiera salido sin esta
prueba, habríamos gastado los dos toques de diez empresas en llamadas que no
suenan, y `eFISIO` —el mejor lead de la lista, con cero toques— se habría quedado
con un toque gastado a cambio de nada.

### Regla nueva, y es barata

**La primera llamada de cada tanda va al móvil de Máikel, siempre.** Cuesta menos
de un céntimo, tarda cuatro décimas si algo va mal, y detecta de golpe la cuota de
voz, el número emisor caído, el expediente de Twilio rechazado y el asistente mal
configurado. Ninguna de esas cuatro cosas se ve desde el repo.

Es lo mismo que ya dice `diseno.md` («día 1 del piloto: 3 llamadas supervisadas»),
solo que aplicado a cada tanda y no solo al primer día.

## Lo que NO se ha tocado

- **`Qualivo SDR` sigue existiendo.** No lo retiro hasta que el agente de Growth confirme
  que nada apunta a él (n8n, `cola_llamadas.py`, algún workflow). Retirarlo a ciegas puede
  romper algo que no veo.
- **El asistente de landing, intacto.** Solo se ha leído y copiado.
- **Nadie ha sido llamado.** El clon no tiene número asignado.

## Lo que falta para marcar

1. **Ok de Máikel** a la tanda supervisada.
2. **Una llamada de prueba a su móvil antes de cualquier lead**, para oír la voz y cerrar
   de una vez si dice «Máikel» o «Michael», y si dice «Cuálivo» o «Qualibo». Necesito que
   me dé el número al que llamar.
3. **La duración, que no cuadra.** El rol y la v5 dicen «veinte minutos»; el calendario
   está en huecos de treinta y `api/agendar.js` lee la duración del calendario. He puesto
   «unos treinta minutos» en el prompt porque es lo que se reserva de verdad. Si debe ser
   veinte, hay que cambiar el calendario, no el guion.
4. **Grafía de la marca, sin decidir.** El asistente de landing escribe «Cuálivo» con
   tilde en su mensaje de buzón; la v5 del repo dice «Cualivo» sin tilde. He usado
   «Cuálivo», que es la más reciente y la que está en producción. Se cierra escuchando.
5. **Etiquetar la cita como fría en GHL** si Raquel cierra alguna, para no mezclar
   métricas con los leads de pago. Lo pide Growth y tiene razón.
6. **Añadir la opción `frío` al select «Campaña»** de la base de Notion «📞 Llamadas
   de Raquel», y rellenarla yo. Growth rellena esa base a mano en su revisión diaria
   y dice que si yo pongo mis filas con `Campaña = frío`, él no las duplica.

## El riesgo que señala Growth y que no es técnico

**Asistencia a las citas: 54 % en septiembre.** No se procesa la confirmación de la
víspera, el recordatorio del mismo día está en pausa, y los correos de qualivo.io caen
en spam porque a SPF le falta Google y no hay DMARC. Una cita que cierre en frío
recibe confirmación y recordatorio de víspera, pero **el riesgo real no es cerrarla,
es que se presenten**. Su recomendación, que comparto: recordatorio por WhatsApp
además del correo.

Dicho de otro modo: cerrar reuniones en frío sin arreglar el spam de qualivo.io y el
recordatorio es llenar un cubo con un agujero. Y el agujero es de Máikel: SPF y
DMARC.
