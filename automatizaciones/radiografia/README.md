# Radiografía → reunión · Secuencia 3-7 en n8n

> Entregable del agente de Automatización (encargo del cerebro, 9-sep). Fuente del recorrido y los copies: `sistema/radiografia-recorrido.md` (rama del cerebro).
> Dos workflows importables: **secuencia** (`workflow-secuencia.json`) y **parada** (`workflow-parada.json`). Ambos arrancan con `modo_prueba: true` — esperas de minutos, tarea SDR a 10 min. Nada pasa a días reales hasta que Maikel cambie el flag.

## Qué hace cada workflow

### 1 · Secuencia (webhook `POST /webhook/radiografia/secuencia`)

Un contacto con etiqueta `diagnostico-completo` o `radiografia-anonima` entra por el webhook (lo llama el workflow de entrada de GHL que monta Landing) y recorre:

| Momento | Acción | Condición |
|---|---|---|
| Día 1 | Email "tu radiografía: {cuello}" (pregunta con número, §2 del recorrido) | **solo si NO dejó WhatsApp** — si lo dejó, el día 1 es de Outbound/Maikel (plantilla WA) y aquí no se manda nada |
| Día 3 | Email "el error más común en {cuello}": caso con número + acción que puede hacer hoy | sin respuesta |
| Día 7 | Email "cómo lo arreglamos en {caso}" + oferta del análisis por escrito | sin respuesta |
| Día 7 + 24h | Oportunidad → etapa **"Tibio"** + tarea al SDR con vencimiento a **30 días** (gancho: su propio cuello). **Sin día 14.** | sin respuesta |

Antes de **cada** envío el workflow relee el contacto en GHL: si tiene la etiqueta `secuencia-parada`, muere ahí. Así la parada funciona aunque llegue en mitad de una espera.

Los emails salen por la API de conversaciones de GHL (quedan en el hilo del contacto). Copies por cuello embebidos en el nodo **"Lead y copys"** — son el borrador del cerebro; cuando Ventas publique `ventas/radiografia/`, se sustituyen editando solo ese nodo.

### 2 · Parada (webhook `POST /webhook/radiografia/parada`)

Cualquier respuesta o cita para TODA la secuencia:

1. Etiqueta `secuencia-parada` al contacto (la secuencia lo ve en su siguiente chequeo).
2. Nota en GHL con el motivo y la respuesta literal.
3. Si el motivo NO es cita: **tarea PUENTE a Maikel con vencimiento a 2h** — mini-brief (cuello, puntos, qué dijo) + guía de reacción por cuello + el mensaje de las dos salidas ya redactado (§2), listo para copiar. Es el modo copiloto del agente de WhatsApp: mientras dure, el puente lo manda Maikel.
4. Si es cita: solo etiqueta + nota (ya no hay nada que puentear).

Idempotente: llamadas repetidas re-etiquetan y añaden nota, no rompen nada.

## Contrato de integración (quién llama a qué)

**Al webhook `/radiografia/secuencia`** — lo llama el workflow de entrada de GHL (Landing) al aplicar la etiqueta:

```json
{
  "contact_id": "<id GHL>",        // obligatorio
  "email": "...", "nombre": "...", "empresa": "...",
  "cuello": "seguimiento",          // o tags: ["cuello-seguimiento", ...] — ambos valen
  "puntos": 62, "sector": "...", "web": "...", "utm": {...},
  "whatsapp": "+34..."              // presente solo si lo dejó en el formulario
}
```

**Al webhook `/radiografia/parada`** — lo llaman: (a) workflow GHL "email reply" (Landing lo añade a su workflow de entrada o a uno de 2 nodos: trigger reply → HTTP), (b) workflow GHL "cita creada" con `motivo: "cita"`, (c) los workflows del agente de WhatsApp de Outbound cuando entra reply de WA:

```json
{
  "contact_id": "<id GHL>", "motivo": "email_reply|whatsapp_reply|cita",
  "nombre": "...", "empresa": "...", "cuello": "...", "puntos": 62,
  "texto_respuesta": "..."          // literal de lo que contestó, si se tiene
}
```

**Este workflow NO hace** (reparto §4 del recorrido): la etapa "Radiografía completada" ni la oportunidad ni la puntuación ni la tarea WhatsApp día 1 (Landing); el envío de WhatsApp ni las llamadas de voz (Outbound, WF1-WF3 en `captacion/agente-llamadas/`); el 3-7-14 clásico de cuentas del pipeline sigue en `../seguimientos-3-7-14/`.

## Importar y probar (Maikel)

1. Importar los dos JSON en n8n. En cada nodo HTTP, asignar una credencial **Header Auth** con `Authorization: Bearer <token API GHL>` (una sola credencial para todos).
2. Rellenar el nodo **Config** de cada workflow: `location_id`, `tibio_stage_id` (cuando Landing cree la etapa), `sdr_user_id`, `maikel_user_id`. Sin tocar `modo_prueba` (viene en `true`).
3. Activar ambos y lanzar la prueba: `curl -X POST <n8n>/webhook/radiografia/secuencia -H 'Content-Type: application/json' -d '{"contact_id":"<id contacto de prueba>","nombre":"Prueba","cuello":"seguimiento","puntos":62,"email":"<tu email>"}'` → en ~8 minutos el contacto de prueba recibe los 3 emails y cae la tarea SDR (a 10 min). Repetir llamando a `/radiografia/parada` a mitad para ver la parada y la tarea puente.
4. **Pase a producción** (decisión de Maikel, tras ok al guion): `modo_prueba: false` en el Config de la secuencia. Ese flag es el interruptor entre staging y real.

## Avisos

- El campo del cuerpo del email (`html`) y el de búsqueda de oportunidades siguen la API v2 de LeadConnector; si la subcuenta usa otra versión, ajustar los dos nodos afectados (los nombres de campo están concentrados en los nodos HTTP, nada más que tocar).
- Los 3 emails de la secuencia van en automático una vez activada en producción — ese es el diseño aprobado en el recorrido (§1: "GHL workflow | email | sin respuesta"). La aprobación del copy es el ok de Maikel al guion final; hasta entonces, solo modo prueba contra su propio contacto.
- Riesgo de duplicado a vigilar: si Landing también configura los emails día 1/3/7 dentro de su workflow de GHL, el lead recibiría los emails dos veces. Señalado [PARA CEREBRO] para deslindar antes de producción.
