# Traspaso del agente de voz y del de WhatsApp a otra sesión

Para reutilizar los agentes en otra campaña sin romper la de Qualivo.

## Regla primera: clonar, no compartir

El asistente de voz y el de WhatsApp son **un prompt cada uno**. Si la otra sesión
edita el prompt para su campaña, cambia también las llamadas de Qualivo: no hay
versiones por campaña. Así que la otra sesión **clona** y trabaja sobre su copia.

Clonar en Vapi es un GET del asistente y un POST del mismo cuerpo con otro `name`
(quitando `id`, `orgId`, `createdAt`, `updatedAt`). Cinco minutos.

## Qué se traspasa

| Pieza | Identificador | Se comparte o se clona |
|---|---|---|
| Asistente saliente "Raquel" | `fe2ed34d-82e9-4c6b-b351-8acf90d9dcce` | **clonar** |
| Asistente de recepción (entrantes) | `0014b718-cb03-40bf-ad25-96b9b943f65d` | **no tocar** |
| Número +34647118491 (Vapi BYO) | `b60821ae-39fc-46b3-b8f8-23ee593ee6fd` | ver abajo |
| Credencial SIP Twilio | `dfbb947c-c2ab-4b7c-bd22-92206e7b4441` | se comparte |
| Trunk SIP Twilio | `TKe6579bdbb8fe16a7ee595c91e5b1fd7e` | se comparte |
| Voz de ElevenLabs (Raquel) | en el cuerpo del asistente | se comparte |
| Cola y registro de llamadas | `cola_llamadas.py`, `historial_llamadas.json` | copiar y renombrar |
| Workflows n8n | WF1 `a8CilSogSQN3Ha11` · WF2 `7q7jDW4mNgLQ5FFY` · WF3 `QeOHn5KRDzw2rDrU` | **duplicar** |
| Router SDR de respuestas | `UNBIjWqJl9cYVtal` | duplicar |
| Calendario de reuniones | `zBlsw8BEKA2zah81YlOl` (qualivo-20) | la otra campaña necesita el suyo |

## El número: el único punto de conflicto real

Para **llamadas salientes** el mismo número puede usarlo cualquier asistente: se pasa
`assistantId` en cada llamada. Sin problema.

Para **llamadas entrantes** no: un número apunta a UN asistente. Hoy el 647 apunta al
de recepción, que es el que evita que a Maikel le suene el móvil. Si la otra sesión
engancha su asistente a ese número, Maikel vuelve a quedarse sin filtro de entrantes.

Por eso: **la otra campaña llama con el 647 y punto**. Si también quiere atender
entrantes, necesita número propio. El bundle regulatorio de Twilio para número
español lleva dos rechazos (`BU83efc0c6b957743f9e7cf3ce5cf4f487`), así que la vía
corta es verificar otro móvil de Maikel como caller ID en el mismo trunk, igual que
se hizo con el 647.

## WhatsApp

Está montado sobre GHL en el número 647 (location `bHGMuZEGUESZmVoNv9HT`). Un número
de WhatsApp = una cuenta = una bandeja. Si la otra campaña escribe por ahí, las
conversaciones caen en la misma bandeja y se mezclan con las de Qualivo.

Dos salidas, y la segunda es la buena:
1. Compartir bandeja y separar por etiqueta de contacto. Barato y sucio.
2. Número propio para la otra campaña en su propia location de GHL. Es lo correcto
   si va a tener volumen.

## Claves

Ninguna clave está en el repositorio y así se queda. Viven en el scratchpad de esta
sesión, que muere con el contenedor. La otra sesión necesita que Maikel le pase:
Vapi, Twilio (SID + token), ElevenLabs, GHL (token PIT) y Smartlead.

## Lo que la otra sesión debe leer antes de tocar nada

- `captacion/agente-llamadas/guion.md` — el guion y por qué está así (silencio 10 s,
  buzón se cuelga, la IA solo como mecanismo).
- `captacion/agente-llamadas/diseno.md` — arquitectura.
- `captacion/incidente-reenvios-smartlead-2026-08.md` — el error que costó una queja
  LOPD. Aplica igual a cualquier canal: no repetir contacto por fallo de sistema.
- `captacion/motor-v3.md` — cómo se estructura el copy por lead.
