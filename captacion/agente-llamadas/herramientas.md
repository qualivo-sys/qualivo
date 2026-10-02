# Herramientas para llamar · manual de campo

Todo lo que hace falta para lanzar y registrar una llamada, aprendido a base de romperlo.
Escrito el 30-sep-2026 por el agente de Outbound para el agente de Cold Calling.

> **Ninguna clave está en este fichero ni en el repo.** Las claves viven en el scratchpad de cada
> sesión y el scratchpad NO se comparte entre sesiones. Si esta sesión no las tiene, se las pide a
> Maikel y él las pega. No hay otra vía: copiarlas al repo las publica.

---

## 1. Vapi · el agente de voz (Raquel)

Lanzar una llamada:

```
POST https://api.vapi.ai/call
Authorization: Bearer $VAPI_KEY
Content-Type: application/json
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36
```

```json
{
  "assistantId": "<id del asistente Raquel>",
  "phoneNumberId": "<id del número emisor>",
  "customer": { "number": "+34XXXXXXXXX" },
  "assistantOverrides": {
    "variableValues": {
      "nombre": "David",
      "empresa": "...",
      "dato_corto": "...",
      "dias_ofrecidos": "mañana o el jueves"
    }
  }
}
```

**Trampa que ya nos costó tiempo:** sin el header `User-Agent` de navegador la API devuelve
**error 1010** (lo corta Cloudflare, no Vapi). No es un problema de la clave.

`assistantOverrides.variableValues` es el mecanismo por el que este agente inyecta el guion
específico de cada llamada sin tocar el asistente. Las variables que el guion v5 espera ya están
arriba. Si quieres una variable nueva, tiene que existir primero en el prompt del asistente.

Recuperar la transcripción después:

```
GET https://api.vapi.ai/call/<callId>
GET https://api.vapi.ai/call?limit=20        (las últimas)
```

El objeto trae `transcript`, `summary`, `endedReason` y `recordingUrl`. De ahí sale la NOTA PARA
CRM del punto 19: la escribe este agente leyendo la transcripción, no la escribe quien llama.

Claves en scratchpad: `.vapi_key`, `.vapi_assistant_id`, `.vapi_phone_id`.

### Lo que ya falló en producción, para no repetirlo

| Fecha | Qué pasó | Regla que salió |
|---|---|---|
| 21-sep | La voz leyó "Maikel" en inglés y sonó "Michael" en cuatro llamadas | Escribir **"Máikel Echevarría"**, con tilde |
| 21-sep | Sonó "Qualibo" | Escribir **"Cualivo"** |
| 18-sep | Colgamos encima de alguien que estaba apuntando el recado | El silencio mientras apuntan NO es que se haya ido. Esperar |
| 29-sep | Saltó un buzón y dijo en voz alta "Colgar sin dejar mensaje" | **REGLA CERO**: solo se pronuncia lo que va entre comillas |

El guion vigente es `captacion/agente-llamadas/guion-raquel-v5.txt`. **Está escrito pero no
aplicado al asistente de Vapi en producción.** Aplicarlo lo decide Maikel.

---

## 2. GoHighLevel · el CRM

No hay conector MCP. Todo a curl.

```
Base:    https://services.leadconnectorhq.com
Headers: Authorization: Bearer $GHL_KEY
         Version: 2021-07-28
         Content-Type: application/json
```

| Qué | Endpoint |
|---|---|
| Buscar contacto | `GET /contacts/?locationId=$LOC&query=<texto>` |
| Crear o actualizar | `POST /contacts/upsert` |
| Apuntar nota | `POST /contacts/<id>/notes` |
| Crear cita | `POST /calendars/events/appointments` |
| Oportunidad | `POST /opportunities/` |
| Usuarios | `GET /users/?locationId=$LOC` |

**Trampa:** crear cita devuelve **422 "assignedUserId is missing"** aunque la documentación lo
marque opcional. Hay que mandarlo. El de Maikel es `nXgGkRbPWcDpdydQ06ns`.

Paginar de verdad: `GET /contacts/` devuelve 20 por página y hay 1.126 contactos. Sin paginar
completo, cualquier recuento sale mal — ya pasó con el baseline de septiembre.

Claves en scratchpad: `.ghl_key`, `.ghl_loc`, `.ghl_calendar`.

---

## 3. Smartlead · de dónde viene el contexto del email

Es la fuente del "qué email recibió" del punto 16 del rol.

```
Base: https://server.smartlead.ai/api/v1
Auth: ?api_key=$SMARTLEAD_KEY  (va en la query, no en header)
User-Agent de navegador: obligatorio, igual que en Vapi
```

| Qué | Endpoint |
|---|---|
| Campañas | `GET /campaigns?api_key=` |
| Leads de una campaña | `GET /campaigns/<id>/leads?api_key=&offset=&limit=` |
| Estadísticas por lead | `GET /campaigns/<id>/statistics?api_key=` |
| **Hilo real enviado** | `GET /campaigns/<id>/leads/<leadId>/message-history?api_key=` |
| Responder | `POST /campaigns/<id>/reply-email-thread?api_key=` |

**`message-history` es la llamada importante para este agente.** Devuelve el asunto y el cuerpo
literal que recibió esa persona, con fechas de apertura. Sin eso, la apertura de la llamada
("Máikel te escribió hace unos días porque...") es inventada, y el punto 19 del rol prohíbe
inventar.

**Dos trampas:**

1. **NUNCA hacer POST de secuencia sobre una campaña con leads en curso.** Reinicia los envíos.
2. `reply-email-thread` manda siempre a la dirección del lead de la campaña, no a quien te
   escribió. Si responde alguien distinto, va en `cc` y se comprueba con `message-history`
   después de enviar.

El copy por lead vive en `custom_fields` (`subject1`, `body1`). La secuencia es genérica. Un lead
sin `subject1` manda **asunto en blanco**.

Clave en scratchpad: `.smartlead_key`.

---

## 4. Apollo · enriquecer decisores

Vía MCP, sin curl. Lo que conviene saber antes de gastar:

| Herramienta | Coste |
|---|---|
| `apollo_organizations_lookup` | gratis |
| `apollo_mixed_companies_search` | 1 crédito |
| `apollo_people_bulk_match` | 1 crédito por registro |
| `apollo_usage_stats_credit_usage_stats` | gratis, mira esto primero |

**Dato que ahorra créditos:** el 30-sep gasté 10 créditos en empresas españolas de 1-6 empleados
sacadas de Google Maps. 8 de 10 volvieron `email_status: unavailable` y los 2 con email eran
buzones de rol. Apollo no cubre la empresa pequeña española. Para este agente da igual: **el
teléfono lo tenemos, y es el campo más completo que hay** (604 de 612 fichas de Maps lo traen).

---

## 5. HeyReach · LinkedIn

Vía MCP. Solo relevante aquí para una cosa: antes de llamar, comprobar si esa persona ya tiene
conversación abierta en LinkedIn (`get_conversations_v2`). Llamar a alguien con quien ya se está
hablando por LinkedIn sin saberlo queda mal.

---

## 6. Reglas que no se negocian

- **No se llama a nadie sin el ok de Maikel.** Ninguna acción hacia fuera sin su ok.
- **Dominios bloqueados, nunca contactar:** growitschool.com, growthhackingcourse.io,
  anticbarcelona113.es, formacion.ninja, kubysoft.com, escolaeronauticadecatalunya.cat
- **Horario de llamada:** 10:00–18:00, Europe/Madrid.
- **RGPD:** si alguien lo pide, se bloquea y se pausa el lead sin preguntar. La respuesta escrita
  al RGPD no se manda.
- **Descartar siempre:** catchall, dominio cruzado, buzones de rol, lo que esté en
  `dedupe_31ago.json`, y cualquier cosa fuera de España.
- **Sin señal verificada el lead no entra.** Una inferencia de sonda estática no es una señal:
  ya me equivoqué así una vez (dije "no usan Google Ads" mirando el HTML y era Dataslayer
  cargando por JS).
- Las claves en el scratchpad, **nunca** en el repo.

---

## 7. Material ya preparado

| Fichero | Qué es |
|---|---|
| `captacion/llamadas-calientes-30sep.md` | 20 leads con 3+ aperturas, 15 con teléfono verificado en su web, 5 marcados por prefijo raro |
| `captacion/datos/calientes-30sep.json` | lo mismo en JSON |
| `captacion/datos/maps-pool-612.json` | 612 fichas de Maps deduplicadas, 604 con teléfono |
| `captacion/agente-llamadas/guion-raquel-v5.txt` | guion vigente de Raquel |
| `captacion/agente-llamadas/rol-cold-calling-agent.md` | el rol de este agente, literal de Maikel |
| `estrategia/mensajes-v3.md` | fuente de verdad del copy de email |
