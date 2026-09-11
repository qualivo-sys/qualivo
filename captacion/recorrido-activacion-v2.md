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
| 0-2 min | WhatsApp 1 | hay teléfono |
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

## Ventanas horarias (Europe/Madrid)

- **WhatsApp**: 8:00-21:30, todos los días.
- **Voz**: 9:30-14:00 y 16:00-20:00, de lunes a viernes. Nunca festivo.

Lo que cae fuera de ventana no se pierde: espera al siguiente hueco.

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
| Voz · clon de campaña | Vapi | `VAPI_ASSISTANT_ID` en el entorno |
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
| `VAPI_API_KEY` | lanzar la llamada · **falta** |
| `VAPI_ASSISTANT_ID` | el clon de esta campaña · **falta** |
| `VAPI_PHONE_NUMBER_ID` | por defecto el 647 · opcional |
| `META_LEADFORM_VERIFY` · `META_LEADFORM_TOKEN` | webhook del lead form · **falta** |

Sin `VAPI_API_KEY` el reloj sigue funcionando: manda WhatsApp y correos y **anota la
llamada como pendiente** en vez de lanzarla. No se cae y no se pierde ningún lead.
