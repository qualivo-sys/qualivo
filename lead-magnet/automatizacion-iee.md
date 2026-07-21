# Automatización IEE — GHL + n8n + DeepAgent

Cómo enganchar el **Índice de Escalabilidad (IEE)** a la infraestructura que Qualivo
**ya tiene** en n8n / GHL, sin reconstruir nada. Auditado sobre la instancia real
(`qualivo.app.n8n.cloud`).

## Lo que ya existe y se reutiliza

| Workflow n8n | ID | Reuso |
|---|---|---|
| **GHL → Deepagent → CRM Automation** | `uK1at0gdmIw87LUF` | **El motor de llamada.** Llamada IA → rescate WhatsApp → transcripción → mover trato → booking con Claude → Slack. |
| Qualivo — Email Sequence ABM | `fi91x1KpaV65jYGE` | Base para la secuencia de email. |
| GHL Lead Scoring IA - Auto Poll | `A9n5Nz2fKpCi1aqj` | Scoring; el IEE ya trae score propio. |
| Ringover/Cloudtalk/JustCall → GHL Nota + Resumen IA | varios | Registro de llamadas. |

- **WhatsApp**: Wazzup conectado en GHL (+ el flujo DeepAgent ya manda WhatsApp de rescate por la API de GHL).
- **Email**: GHL.
- **Booking**: el flujo ya usa **Claude** para extraer la fecha de la transcripción y crear la cita en GHL.

## Contrato del webhook DeepAgent (`ghl-new-lead`)

El flujo espera un `POST` con este `body` (el teléfono es **obligatorio** — hay un `if isNotEmpty`):

| Campo | Uso en el flujo |
|---|---|
| `phone` | Número a llamar + gate del `if` |
| `first_name` | Variable del agente de voz (`first_name`, `user_name`) |
| `email` | Variable del agente |
| `id` | `contactId` de GHL para el WhatsApp de rescate |
| `firstName` | Nombre en el mensaje de WhatsApp |
| *(nuevas)* `iee_score`, `iee_tramo`, `cuello_principal` | Contexto del IEE para el guion |

## Paso 1 · IEE → GHL

Ya está en `indice-escalabilidad.html` → `CONFIG.ghlWebhookUrl` (Inbound Webhook de GHL).
GHL crea el **contacto + trato**, guarda los campos IEE y aplica tag `IEE: {tramo}`.
(Guía detallada en `README.md` → "Conectar el IEE a GHL".)

## Paso 2 · GHL → DeepAgent (solo tramos de más dolor)

En el workflow de GHL, tras crear el trato, añade una acción **Webhook / HTTP POST**
a la URL del webhook `ghl-new-lead`, **con condición**: `iee_tramo` ∈
{*Riesgo crítico*, *Empresa dependiente*} **y** `phone` no vacío **y** consentimiento = sí.

Body a enviar (campos GHL → contrato DeepAgent):

```json
{
  "phone": "{{contact.phone}}",
  "first_name": "{{contact.first_name}}",
  "firstName": "{{contact.first_name}}",
  "email": "{{contact.email}}",
  "id": "{{contact.id}}",
  "iee_score": "{{contact.iee_score}}",
  "iee_tramo": "{{contact.iee_tramo}}",
  "cuello_principal": "{{contact.iee_cuello_principal}}"
}
```

## Paso 3 · Pasar el IEE al agente de voz (edición mínima en n8n)

En el nodo **«Deepagent - Iniciar Llamada»**, dentro de `metadata.dynamicVariables`,
añade estas 3 líneas (el resto se queda igual — es retrocompatible):

```js
"iee_score": "{{ $('Webhook - Nuevo Lead GHL').item.json.body.iee_score }}",
"iee_tramo": "{{ $('Webhook - Nuevo Lead GHL').item.json.body.iee_tramo }}",
"cuello":    "{{ $('Webhook - Nuevo Lead GHL').item.json.body.cuello_principal }}"
```

> **Recomendado:** en vez de editar el flujo activo (lo usan otros funnels), **duplícalo**
> como *«IEE → DeepAgent»* con su propio webhook `iee-new-lead` y déjalo **inactivo** hasta probarlo.
> Así el IEE no se mezcla con las llamadas de otros embudos.

---

## Guion de la llamada IA (agente DeepAgent)

Pégalo en la configuración del agente en DeepAgent. Usa las `dynamicVariables`.
**Regla de oro:** se presenta como IA (transparencia legal) y su único objetivo es
**agendar una sesión con un humano**, nunca vender ni cerrar por teléfono.

**Identidad:** Nora, asistente virtual de Qualivo.
**Duración objetivo:** < 2 min.

**Apertura (con declaración de IA):**
> «Hola {{first_name}}, soy Nora, el asistente virtual de Qualivo — sí, soy una inteligencia
> artificial, te robo solo un minuto. Te llamo porque acabas de calcular tu Índice de
> Escalabilidad y me ha saltado el resultado. ¿Te pillo bien?»

**Gancho (usa el dato del IEE):**
> «Tu índice ha salido {{iee_score}} sobre 100 — tramo "{{iee_tramo}}". Y el punto que hoy más
> te frena para crecer es **{{cuello}}**. No te llamo para venderte nada: es justo eso lo que
> resolvemos en una sesión de diagnóstico de 45 minutos con uno de nuestros especialistas.»

**Objetivo / cierre:**
> «¿Te reservo esa sesión? Es gratuita y sales con un plan concreto, trabajes luego con
> nosotros o no. ¿Qué te viene mejor, esta semana o la próxima?»
> *(Cuando diga día/hora → el flujo lo captura y Claude crea la cita en GHL.)*

**Objeciones:**
- *«No tengo tiempo ahora»* → «Sin problema, son 45 min y los eliges tú. ¿Te mando la
  propuesta de horarios por WhatsApp y reservas cuando quieras?»
- *«¿Cuánto cuesta?»* → «La sesión de diagnóstico no cuesta nada. Es para ver tu caso y
  decirte qué arreglar primero. Lo que decidas hacer después ya lo hablas con el especialista.»
- *«Mándame información»* → «Hecho, te la mando por email y WhatsApp ahora mismo. Y si te
  encaja, en esos mismos mensajes tienes el enlace para reservar. ¿Te parece?»
- *«No me interesa»* → «Entendido, {{first_name}}. Te dejo tu informe en el correo por si
  lo quieres mirar con calma. ¡Mucho éxito con la captación!» *(marcar No interesado)*

---

## Secuencia por tramo (Email + WhatsApp inmediatos en GHL)

Personaliza el primer impacto con el resultado. Variables GHL: `{{contact.first_name}}`,
`{{contact.iee_score}}`, `{{contact.iee_tramo}}`, `{{contact.iee_cuello_principal}}`.
(La secuencia larga de nurturing está en `secuencia-emails.md` y `secuencia-whatsapp.md`.)

### Email · minuto 0 (todos los tramos)
**Asunto:** Tu Índice de Escalabilidad: {{contact.iee_score}}/100 — {{contact.iee_tramo}}

> Hola {{contact.first_name}},
>
> Aquí tienes tu **Índice de Escalabilidad**: **{{contact.iee_score}}/100**, lo que te sitúa
> en el tramo **«{{contact.iee_tramo}}»**.
>
> Tu mayor freno para crecer ahora mismo es **{{contact.iee_cuello_principal}}**. No es un
> problema de anuncios: es el eslabón que se rompe primero cuando subes la inversión.
>
> Dentro del informe tienes tu plan de 90 días para romper ese techo, fase por fase.
> 👉 [Ver mi informe completo]({{url_informe}})
>
> Si quieres que lo revisemos sobre tus números reales, reserva tu sesión de diagnóstico
> (gratis, 45 min): [Reservar]({{url_reserva}})
>
> {{firma}} · Qualivo

### WhatsApp · minuto 2 (vía Wazzup)
> Hola {{contact.first_name}} 👋 Soy {{remitente}}, de Qualivo. Tu Índice de Escalabilidad
> ha salido **{{contact.iee_score}}/100** ({{contact.iee_tramo}}). Tu cuello de botella nº1:
> **{{contact.iee_cuello_principal}}**.
> Te acabo de enviar el informe con el plan de 90 días al correo 📩
> ¿Quieres que lo veamos juntos en una sesión de 45 min? Te paso horarios 👉 {{url_reserva}}

### Línea de apertura según tramo (para email/WhatsApp/llamada)
- **Riesgo crítico** → «Ahora mismo, crecer te rompería el sistema. Priticémoslo antes de invertir más.»
- **Empresa dependiente** → «Creces, pero todo depende de que estés tú encima. Ahí está tu techo.»
- **Empresa estable** → «Funcionas bien a tu ritmo, pero escalar fuerte destaparía las juntas flojas.»
- **Empresa preparada** → «Tu estructura ya no te limita. El reto es acelerar sin perder eficiencia.»
- **Diseñada para escalar** → «Tu sistema trabaja por ti. El único límite es cuánto combustible le metas.»

---

## Nota de seguridad

La API key de n8n usada para auditar esto se compartió por chat: **rótala**
(n8n → Settings → API → revoke + create) cuando esté todo montado.
