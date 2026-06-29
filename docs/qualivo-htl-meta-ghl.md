# HackTheLead · Integración Meta Lead Form → GHL → CAPI

Runbook de la **Parte 2** del brief (la técnica). El montaje del formulario en
Ads Manager (Parte 1) y la redacción de las secuencias WhatsApp/email son del
equipo; aquí está lo que conecta Meta con GoHighLevel y devuelve el evento a Meta.

**Arquitectura elegida:** integración **nativa Meta↔GHL** para traer el lead +
**Conversions API por código** (este repo) para optimizar sobre leads reales.

```
Meta Lead Form ──(integración nativa FB de GHL)──▶ Contacto en GHL
                                                        │
                                          Workflow de knockout (GHL UI)
                                                        │
                         descartado ◀──┤ ¿invierte? ├──▶ cualificado (+Scale si >1.500€)
                          (stop)                              │
                                              ┌──────────────┼──────────────┐
                                         crea oportunidad   WA1          Webhook ─▶ Web App (doPost)
                                         (Qualivo Pipeline) (secuencia)        │
                                                                         sendLeadEventToMeta()
                                                                                │
                                                                      Meta Conversions API (Lead)
```

---

## 1. Conexión nativa Meta ↔ GHL

GHL → **Settings → Integrations → Facebook** → conecta la página y la cuenta
publicitaria **Qualivo Agencia** (`act_3453332464718877`). Activa **Lead Ads** y
asocia el **formulario instantáneo** de HackTheLead al sub-account.

> La integración nativa guarda el `leadgen_id` de Meta con el contacto. **Hay que
> mapearlo a un campo** para poder devolver el evento por CAPI con match directo
> (ver §2 y §4).

---

## 2. Mapeo de campos (formulario → contacto GHL)

Location `bHGMuZEGUESZmVoNv9HT` · los campos `HTL - …` **ya existen**:

| Pregunta del formulario (Parte 1) | Campo GHL | `fieldKey` | Tipo |
|---|---|---|---|
| ¿A qué se dedica tu negocio? | HTL - Sector o actividad | `contact.htl__sector_o_actividad` | TEXT |
| ¿Cuánto inviertes al mes en publicidad? | HTL - Inversión mensual en ads | `contact.htl__inversin_mensual_en_ads` | SINGLE_OPTIONS |
| Nombre completo | First/Last Name | estándar | — |
| WhatsApp / teléfono | Phone | estándar | — |
| Email (obligatorio) | Email | estándar | — |
| _(de la integración nativa)_ **leadgen_id** | crea un campo p.ej. `Meta Lead ID` | `contact.meta_lead_id` | TEXT |

### ⚠️ Ajuste necesario — opciones de inversión no coinciden

El brief propone estas respuestas: **Nada todavía / Menos de 500€ / Entre 500€ y
1.500€ / Más de 1.500€**. Pero el picklist actual de
`contact.htl__inversin_mensual_en_ads` es: **Menos de 500€ / 500–1.500€ /
1.500–5.000€ / Más de 5.000€**. No casan, y el knockout depende de **"Nada
todavía"**, que **no existe** en el campo.

Elige una y déjala consistente entre Meta y GHL:

- **Opción recomendada:** en el formulario de Meta usa **exactamente** las
  opciones del picklist de GHL y **añade "Nada todavía"** como primera opción del
  campo `htl__inversin_mensual_en_ads`. Así el valor entra 1:1 y el workflow
  ramifica por valor exacto. El tier Scale pasa a ser `1.500–5.000€` ó
  `Más de 5.000€`.
- **Alternativa:** mapea la respuesta a un **campo TEXT** aparte para el knockout
  y deja el picklist para reporting.

---

## 3. Workflow de knockout (GHL · los filtros que Meta NO hace)

Trigger: **Facebook Lead Form submitted** (formulario de HackTheLead).

1. **If/Else — inversión = "Nada todavía"** → tag `descartado` · **Stop** (sin
   secuencia, sin oportunidad, sin CAPI).
2. **Else** → tag `cualificado` · **Create Opportunity** en pipeline **"Qualivo
   Pipeline"** (`980j4DzvOwp7aDmkk2ZA`), etapa **Nuevo Lead**.
   - **If inversión ∈ {1.500–5.000€, Más de 5.000€}** → tag adicional `Scale`.
   - Lanza **WA1** (secuencia del equipo — no incluida en este repo).
   - **Webhook** (§4) → dispara la CAPI.

> `htl__sector_o_actividad` es texto abierto: **no filtra**, solo se guarda para
> leerlo antes de la llamada.

**Enrutado de tier (en la llamada):** `< ~1.500€` → estándar (850€ + 595€/mes) ·
`> ~1.500€` (tag `Scale`) → Scale (~1.400€ + ~950€/mes).

---

## 4. Conversions API (código de este repo)

Cuando el lead queda **cualificado**, el workflow llama por **Webhook** al Web App
de Apps Script, que reenvía el evento a Meta. Así la campaña optimiza hacia leads
**buenos**, no hacia el volumen frío del lead form.

**Acción Webhook en GHL:**
- **URL:** la del Web App (`menú Qualivo · Lead Form → Ver URL del webhook`),
  con `?secret=...` si defines `LEAD_WEBHOOK_SECRET`.
- **Method:** POST · **Custom Data** (JSON):

```json
{
  "meta_lead_id": "{{contact.meta_lead_id}}",
  "email": "{{contact.email}}",
  "phone": "{{contact.phone}}",
  "first_name": "{{contact.first_name}}",
  "last_name": "{{contact.last_name}}",
  "event_name": "Lead"
}
```

`mapGhlWebhookToLead()` es tolerante a variantes de nombres de clave. Con
`meta_lead_id` el match es directo (sin PII); si falta, cae a email/teléfono
hasheados en SHA-256 (lo hace `MetaCAPI.gs`).

**Despliegue del Web App:** Apps Script → Implementar → Nueva implementación →
Aplicación web · *Ejecutar como: yo* · *Acceso: Cualquier usuario (anónimo)*.

---

## 5. Credenciales (Script Properties — nunca en código)

| Clave | Valor |
|---|---|
| `META_CAPI_TOKEN` | Token del dataset/píxel con permiso de Conversions API |
| `META_DATASET_ID` | ID del dataset (píxel) de Qualivo |
| `META_TEST_EVENT_CODE` | `TESTxxxx` (Events Manager → Probar eventos) — solo QA |
| `LEAD_WEBHOOK_SECRET` | Secreto para proteger el Web App (opcional, recomendado) |
| `GHL_TOKEN` | Private Integration Token (`pit-…`) |
| `GHL_LOCATION_ID` | `bHGMuZEGUESZmVoNv9HT` |
| `GHL_PIPELINE_ID` | `980j4DzvOwp7aDmkk2ZA` (Qualivo Pipeline) |

Cárgalas con **EAC Dashboard → Configurar credenciales (hoja _Config)** y luego
**Guardar credenciales de _Config**, o directamente en *Configuración del
proyecto → Propiedades del script*.

> El `META_CAPI_TOKEN` es **distinto** del token de lectura `ads_read`: se genera
> en Events Manager → Configuración del dataset → Conversions API → Generar token.

---

## 6. QA antes de activar gasto (NO SALTARSE)

Haz un **lead de prueba de punta a punta** y confirma los tres en verde:

- [ ] **(a) Entra en GHL** — envía el formulario en vista previa de Meta; aparece el contacto con los campos mapeados.
- [ ] **(b) Se filtra bien** — "Nada todavía" → `descartado` sin secuencia; el resto → `cualificado` (+`Scale` si >1.500€) y oportunidad en *Nuevo Lead*.
- [ ] **(c) Dispara el WhatsApp al instante** (WA1).
- [ ] **CAPI** — menú **Qualivo · Lead Form → Probar lead (QA CAPI)** y verifica el evento *Lead* en **Events Manager → Probar eventos** (`META_TEST_EVENT_CODE`).

**Solo activa el gasto cuando (a), (b), (c) y la CAPI estén en verde.** Sin esto
puedes pagar por leads que nunca reciben respuesta — lo contrario de lo que vende
HackTheLead.

---

## Pendiente (no olvidar)

- **Las secuencias** (5 emails + 5 WhatsApp) las redacta el equipo; atarlas al
  **WhatsApp**, no al email (el email de Meta puede venir desactualizado).
- **Diagnóstico de la landing** que no convertía (carga móvil / CTAs / tracking).
  El lead form esquiva el problema pero no lo resuelve; necesario si en el futuro
  se vuelve a una landing propia.
