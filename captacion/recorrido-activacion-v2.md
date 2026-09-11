# Recorrido de activación V2 · lead form y landing (11-sep-2026)

Sustituye al mapa de `capa-activacion.md` en todo lo que dependía de la Radiografía.
**La Radiografía ya no existe**: la página se retiró el 11-sep y redirige a
`/diagnostico/`. Los dos prompts maestros (voz y WhatsApp) siguen escritos sobre ella,
así que esta campaña usa **clones**, no los maestros.

## El embudo, con sus dos puertas de entrada

```
   META ADS                         META ADS
   (tráfico)                        (lead form)
       ↓                                 ↓
   /diagnostico/                    webhook → GHL
       ↓                                 ↓
  formulario 2 pasos                 nombre, email,
       ↓                              teléfono
  ┌────┴─────┐                            │
  ↓          ↓                            ↓
AGENDA   no agenda ──────────────→  ACTIVACIÓN
  │                                       ↓
  │                          WhatsApp → voz → email
  │                                       ↓
  └──────────→ DIAGNÓSTICO 15 MIN ←───────┘
                     ↓
                   PLAN
                     ↓
                PILOTO 30 DÍAS
```

Quien agenda **no entra en activación**. Solo recordatorio y preparación de la
llamada. Perseguir a quien ya ha dicho que sí es la forma más rápida de perderlo.

## Las dos entradas no son el mismo lead

| | Landing | Lead form |
|---|---|---|
| Qué sabemos | sector, tamaño, inversión, web, su hipótesis | nombre, email, teléfono |
| Intención | alta: ha leído la página entera | media: ha rellenado sin salir de Instagram |
| Primer WhatsApp | cita su hipótesis textual | pregunta de contexto, una sola |
| Primera llamada | a los 10 min | a los 20 min |

El lead form convierte más barato y peor. La diferencia no se arregla con más
insistencia: se arregla con un primer mensaje que demuestre que alguien ha leído
lo que escribió.

## La cadencia

Reloj desde que entra el lead. Todo se para si agenda, responde o pide la baja.

| Momento | Canal | Solo si |
|---|---|---|
| 0-2 min | WhatsApp 1, o SMS si WhatsApp no puede | hay teléfono |
| +10 min (landing) · +20 min (lead form) | Voz 1 | sin respuesta y en horario de llamada |
| +2 h | WhatsApp 2 | la llamada no se cogió |
| +1 día | Voz 2 | sigue sin respuesta |
| +2 días | Email 1 · «lo que miramos» | |
| +4 días | WhatsApp 3, el último | |
| +6 días | Email 2 · caso más parecido | |
| +9 días | Email 3 · cierre y puerta abierta | pasa a `act-fin` |

Después del día 9 no se vuelve a tocar hasta 30 días, y entonces lo decide una
persona, no el reloj.

**Dos llamadas como máximo.** El incidente de reenvíos de agosto costó una queja
de protección de datos por repetir contacto por fallo de sistema. La regla aquí es
la misma: ante la duda, no se llama.

## WhatsApp solo puede escribir primero dentro de 24 horas

Comprobado el 11-sep con mensajes reales: WhatsApp deja escribir a alguien únicamente
dentro de las 24 horas siguientes a su último mensaje. Fuera de esa ventana, y sin una
plantilla aprobada por Meta, **la API acepta el mensaje y luego lo marca `failed`**.
Nadie avisa. El lead se pierde en silencio y en el CRM parece que se le escribió.

Por eso el primer mensaje no se da por bueno hasta comprobarlo: se envía, se mira el
estado cinco segundos después y, si ha fallado, el mismo texto sale **por SMS**. Esos
contactos quedan marcados con `act-por-sms`.

Lo correcto a medio plazo es crear una plantilla de WhatsApp aprobada para el primer
mensaje: llega mejor y cuesta menos que un SMS. Mientras no exista, el respaldo por
SMS evita que un lead pagado se quede sin respuesta.

## Por qué la agenda es nuestra y no de n8n

La primera llamada real, el 11-sep, terminó con el contacto diciendo que sí a un
hueco y **sin cita creada**. Raquel llamó a la herramienta, pero el webhook de n8n
(`agente-llamadas-agendar`) contesta 200 con el cuerpo vacío y Vapi registra «No
result returned»: la conversación siguió como si todo hubiera ido bien y Raquel se
despidió confirmando una cita que no existía.

Además el modelo mandó `2023-09-12` en vez de 2026, porque no sabe en qué año vive,
y se inventó el teléfono con el texto «[número de teléfono del contacto]».

Ahora la herramienta apunta a `api/agendar.js`, que crea la cita en GHL, corrige el
año si viene del pasado, pone `act-agendado` para parar la cadencia y **le devuelve a
Raquel la frase exacta que debe decir**. Si el hueco está ocupado, le dice que ofrezca
otro. Si falla, que Maikel escribirá. Ya no puede confirmar algo que no ha pasado.

El prompt lleva además la fecha de hoy inyectada y la obligación de deletrear el email
y esperar confirmación: en la prueba se transcribió «michael.ech@gmail.com».

## Ventanas horarias (Europe/Madrid)

- **WhatsApp**: 8:00-21:30, todos los días.
- **Voz**: 9:30-14:00 y 16:00-20:00, de lunes a viernes. Nunca festivo.

Lo que cae fuera de ventana no se pierde: espera al siguiente hueco.

## Las otras cuatro secuencias

La cadencia de arriba es para quien no contesta. El resto del recorrido tiene las
suyas, cada una con su etiqueta disparadora. Las pone GHL o las pones tú a mano.

| Etiqueta | Secuencia | Pasos |
|---|---|---|
| `act-noshow` | Cogió hueco y no apareció | día 0 «te he esperado» · día 2 lo que iba a mirar · día 6 cierre |
| `act-post-diag` | Ya ha tenido el diagnóstico | día 1 el plan por escrito · día 4 «¿lo montamos o lo dejamos?» · día 9 cierre |
| `act-fuera` | No encaja todavía | un solo correo, honesto, con tres cosas que puede mirar él |
| `act-tibio` | Dijo «ahora no» | un único toque a los 30 días |

Ninguna insiste más de lo que dice la tabla. La de fuera de alcance es un correo y se
acabó: mantener un goteo eterno a quien has dicho que no encaja es ruido, y además
mata la credibilidad de haber sido sincero.

**Los recordatorios de la cita los manda GHL** desde el calendario. Aquí no se
duplican: recibir el mismo aviso dos veces es la forma más tonta de parecer un robot.

## Estado, en etiquetas de GHL

Una sola fuente de verdad. El CRM manda; el código solo lee y escribe etiquetas.

| Etiqueta | Qué significa |
|---|---|
| `act-nuevo` | ha entrado, nadie le ha tocado |
| `act-wa1` `act-wa2` `act-wa3` | WhatsApp enviado |
| `act-voz1` `act-voz2` | llamada lanzada |
| `act-email1` `act-email2` `act-email3` | correo enviado |
| `act-agendado` | tiene hueco en el calendario · **para todo** |
| `act-respondio` | ha contestado · **para la cadencia**, sigue el agente |
| `act-baja` | ha dicho que no · **no se le vuelve a escribir** |
| `act-fin` | cadencia agotada |

## Quién hace qué

| Pieza | Dónde vive | Identificador |
|---|---|---|
| Reloj de la cadencia | `api/activacion.js` (cron cada 10 min) | — |
| Entrada del lead form | `api/meta-leadform.js` | — |
| Entrada de la landing | `api/diagnostico.js` | — |
| Voz · clon de campaña | Vapi | `af978111-4c4e-4373-ba7b-91827bd3efde` · «Raquel · Landing Diagnóstico» |
| Agenda de la llamada | `api/agendar.js` | `https://qualivo.io/api/agendar/?k=…` |
| Voz · número saliente | Vapi BYO | `b60821ae-39fc-46b3-b8f8-23ee593ee6fd` |
| WhatsApp | GHL, número 647 | location `bHGMuZEGUESZmVoNv9HT` |
| Calendario | GHL | `zBlsw8BEKA2zah81YlOl` (15 min) |

**Clonar, no editar los maestros.** El asistente maestro de voz
(`fe2ed34d-82e9-4c6b-b351-8acf90d9dcce`) y el de recepción
(`0014b718-cb03-40bf-ad25-96b9b943f65d`) no se tocan. Editar el prompt del maestro
cambia las llamadas que ya están en marcha, porque no hay versiones por campaña.

El asistente de entrantes se queda como está: es lo único que impide que a Maikel le
suene el móvil con cada devolución de llamada.

## Lo que hace falta antes de encender

Ninguna clave está en el repositorio y así se queda.

| Variable | Para qué |
|---|---|
| `GHL_API_KEY` · `GHL_LOCATION_ID` | contactos, etiquetas y WhatsApp · **ya puestas** |
| `RESEND_API_KEY` | los tres correos · **ya puesta** |
| `CRON_SECRET` | proteger el reloj · **ya puesta** |
| `VAPI_API_KEY` | lanzar la llamada · pendiente de poner en Vercel |
| `VAPI_ASSISTANT_ID` | `af978111-4c4e-4373-ba7b-91827bd3efde` · pendiente de poner |
| `VAPI_PHONE_NUMBER_ID` | por defecto el 647 · no hace falta tocarlo |
| `META_LEADFORM_TOKEN` | token de sistema, no caduca · pendiente de poner |
| `META_LEADFORM_VERIFY` | lo inventas tú; el mismo texto va en Meta · pendiente |
| `META_LEADFORM_IDS` | `1006694072388659` · pendiente de poner |
| `META_APP_SECRET` | firma de cada entrega de Meta · pendiente de poner |
| `AGENDA_SECRET` | protege `/api/agendar/`; el mismo valor va en la URL de la herramienta de Vapi · pendiente |

**La suscripción de Meta es por página, no por formulario.** La página «Maikel
Echevarria» (`359073050620335`) tiene diez formularios antiguos activos (HackTheLead,
Qualivo marzo, Qualivo diciembre…). Al suscribirla llegan los leads de todos.

Por eso `META_LEADFORM_IDS` lleva los identificadores de los formularios de esta
campaña. Un lead de cualquier otro formulario se guarda en el CRM con la etiqueta
`leadform-otra-campana` y **no entra en la cadencia**: nadie le escribe ni le llama.
Si la variable está vacía, no se activa ninguno. El valor por defecto es no molestar.

## El formulario de esta campaña

`Qualivo_Diagnostico_sep2026_v1` · id `1006694072388659` · página Maikel Echevarria.

De alta intención, con pantalla de revisión antes de enviar: menos volumen y mejor
lead. Cinco preguntas, las tres de contacto y dos de cualificación:

- **¿Cuánto invertís al mes en conseguir clientes?** — el mismo corte que la landing.
- **¿Dónde crees que se te está escapando el negocio?** — anuncios, web, respuesta,
  seguimiento o «no lo sé». Esta es la que decide qué pregunta lleva el primer
  WhatsApp, y la que se le pasa a Raquel como contexto de la llamada.

Las dos respuestas se guardan en etiquetas (`inv-…`, `fuga-…`) y en una nota del
contacto. La pantalla de gracias lleva al calendario con `?paso=agenda`, así que quien
tiene prisa puede coger hueco sin esperar al WhatsApp.

## Lo comprobado el 11-sep

| Pieza | Estado |
|---|---|
| Clon de voz con `agendar_diagnostico` conectada | creado y verificado |
| Número saliente +34 647118491 | existe en Vapi, id `b60821ae-39fc-46b3-b8f8-23ee593ee6fd` |
| Token de GHL contra `/conversations/messages` | responde; puede mandar WhatsApp |
| Token de Meta | usuario de sistema, sin caducidad, con `leads_retrieval` |
| `/api/activacion/` en producción | 401 sin secreto, como debe ser |
| `/api/meta-leadform/` en producción | 403 con token equivocado, como debe ser |

Cada entrega de Meta llega firmada con el secreto de la app. Con `META_APP_SECRET`
puesto, una entrega sin firma o con firma que no cuadra se rechaza: sin eso,
cualquiera que conozca la URL podría inventarse leads y hacer que les llamemos.
Queda además una segunda barrera: los datos del lead no salen del webhook, se van a
buscar a la Graph API con nuestro token, y un identificador inventado no existe allí.

**La URL del webhook lleva barra final**: `https://qualivo.io/api/meta-leadform/`.
Sin ella el sitio responde 308 y Meta no sigue redirecciones en POST.

Sin `VAPI_API_KEY` el reloj sigue funcionando: manda WhatsApp y correos y **anota la
llamada como pendiente** en vez de lanzarla. No se cae y no se pierde ningún lead.
