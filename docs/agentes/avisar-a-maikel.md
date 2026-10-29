# Avisar a Maikel

Un solo canal para que **cualquier agente** avise a Maikel cuando le necesite.
Cada aviso llega por dos vías independientes, como pidió Maikel el 29-oct
(«enviadme un WhatsApp y un email»):

- **Email** a `maikel@qualivo.io` (Gmail).
- **WhatsApp** a su número personal (+34 647 11 84 91), desde la cuenta de WhatsApp de Qualivo en GHL.

Si un canal falla, el otro sale igualmente.

## Cómo avisar

```bash
curl -sS -X POST "https://qualivo.app.n8n.cloud/webhook/agentes/avisar-maikel" \
  -H "Content-Type: application/json" \
  -H "X-Qualivo-Token: $QUALIVO_AVISOS_TOKEN" \
  -d '{
    "urgencia": "rojo",
    "titulo": "Olga ha devuelto el contrato firmado",
    "texto": "Hay que confirmar el arranque de mañana con Norberto y enviar la factura de los 600 €.",
    "enlace": "https://app.notion.com/p/40756e1ad6ed8112a3c8fcb568205bb6",
    "agente": "Ventas"
  }'
```

Respuesta:

```json
{ "ok": true, "email": "enviado", "whatsapp": "enviado" }
```

| Campo | Obligatorio | Qué poner |
|---|---|---|
| `urgencia` | no (por defecto `normal`) | `rojo` para lo que no puede esperar a mañana: un cliente o lead caliente esperando, un fallo en producción o un pago. Para todo lo demás, `normal`. |
| `titulo` | sí | Una línea (máx. 120 caracteres): qué pasa. |
| `texto` | sí | Qué necesitas de Maikel y para cuándo (máx. 1.500 caracteres). |
| `enlace` | no | URL `http(s)` a la página de Notion, el PR o el hilo. Lo que no sea URL se descarta. |
| `agente` | sí | Quién avisa: `Ventas`, `Chief of Staff`, `Automatización`… |

Errores: si falta `titulo`, `texto` o `agente`, responde `400` con
`{"ok": false, "error": "Faltan campos: …"}`. Si el token no es correcto, responde `403`.

### Cómo llega

WhatsApp:

```
🔴 URGENTE · Olga ha devuelto el contrato firmado

Hay que confirmar el arranque de mañana con Norberto y enviar la factura de los 600 €.

👉 https://app.notion.com/p/40756e1ad6ed8112a3c8fcb568205bb6

— Ventas
```

Asunto del email: `[URGENTE] Olga ha devuelto el contrato firmado · Ventas`
(con `normal`: `🟡 Aviso` y `[Aviso]`).

## Reglas de uso

1. **Antes de avisar, agrupa.** Un aviso por asunto, no uno por cada paso. Si no corre prisa, va al parte diario del Chief of Staff, no aquí.
2. **`rojo` solo si Maikel tiene que actuar hoy.** Si todo es rojo, nada es rojo.
3. **El texto tiene que poder leerse sin abrir nada:** qué pasa, qué necesitas y para cuándo. El enlace es para los detalles.
4. **Nunca datos sensibles** en el texto, como contraseñas, tokens o datos personales de alumnos o clientes. Pon el enlace.
5. El token (`QUALIVO_AVISOS_TOKEN`) lo reparte el Chief of Staff. **No va en el repo.**

### Plan B (si el webhook no responde)

Si tienes el conector de Gmail, envía el mismo aviso por email a `maikel@qualivo.io`
con el asunto `[URGENTE] … · <agente>` y avisa al Chief of Staff de que el webhook ha
fallado. Si no lo tienes, escribe al Chief of Staff (`send_message` a su sesión).

## Por dentro (n8n)

Workflow: [`automatizaciones/avisar-a-maikel/workflow.json`](../../automatizaciones/avisar-a-maikel/workflow.json),
importable en `qualivo.app.n8n.cloud`.

```
Webhook (token en cabecera) → Config → Validar y redactar → ¿válido?
   ├─ no → 400
   └─ sí → Email (Gmail) → Contacto Maikel (GHL, upsert) → WhatsApp (GHL) → Resumen → 200
```

- Los nodos de envío llevan «continuar si falla»: el resumen dice qué canal salió y cuál no.
- El código del nodo de validación también está en [`validar-y-redactar.js`](../../automatizaciones/avisar-a-maikel/validar-y-redactar.js), y se probó en local con tres casos: aviso rojo completo; aviso normal con HTML en el texto y un enlace `javascript:`, donde el HTML se escapa y el enlace se descarta; y un aviso sin título ni agente, que da 400.

### Para ponerlo en marcha (Maikel, unos 10 minutos)

Hasta que se hagan estos pasos, el webhook no existe. Avisa solo a Maikel, así que encenderlo no escribe a clientes ni a leads.

1. **Importar** `workflow.json` en n8n (*Workflows → Import from file*).
2. **Credenciales** (en el almacén de n8n, nunca en los nodos):
   - `Qualivo · Avisos agentes (X-Qualivo-Token)`: *Header Auth*, con nombre `X-Qualivo-Token` y como valor el token que reparte el Chief of Staff.
   - `Qualivo · Gmail maikel@qualivo.io`: *Gmail OAuth2*, con «Sign in with Google».
   - `Qualivo · GHL (Bearer)`: *Header Auth*, con nombre `Authorization` y valor `Bearer <token de la subcuenta Qualivo>`. Permisos: `contacts.write`, `conversations/message.write`.
3. En el nodo **Config avisos**, cambiar `PON-AQUI-LOCATION-ID-DE-QUALIVO` por el *Location ID* de la subcuenta de Qualivo en GHL.
4. **Activar** y lanzar el curl de prueba de arriba con `"urgencia": "normal"` y `"titulo": "Prueba del canal de avisos"`.

### ⚠️ La ventana de 24 h de WhatsApp

WhatsApp solo deja escribir texto libre si **Maikel ha escrito al número de Qualivo
en las últimas 24 h**. Fuera de esa ventana, Meta rechaza el mensaje y el resumen
devuelve `whatsapp: fallo…`, aunque el email sí llega. Hay dos soluciones:

- **Ya:** que Maikel mande un «hola» al WhatsApp de Qualivo cada mañana. Basta para probarlo hoy.
- **Definitiva:** una plantilla *utility* aprobada en GHL (`aviso_agente`: «{{1}} · {{2}} — {{3}}»), enviada desde un workflow de GHL con disparador *Inbound Webhook* en lugar del envío de texto libre. Queda propuesta; cuando esté aprobada, se cambia el nodo «WhatsApp a Maikel (GHL)».
