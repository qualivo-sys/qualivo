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
