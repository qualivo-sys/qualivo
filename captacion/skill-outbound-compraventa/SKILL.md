---
name: outbound-compraventa
description: >-
  Máquina de captación outbound para compraventa. Úsala cuando el usuario quiera
  generar leads (compradores/vendedores), enriquecer sus emails y montar o recargar
  campañas de email en frío. Orquesta Apollo (prospección), Apify (Google Maps +
  scraping de emails) y Smartlead (envío en frío). Palabras gatillo: "leads",
  "captación", "outbound", "campaña en frío", "compraventa", "recargar campaña".
---

# Outbound Compraventa · Apollo + Apify + Smartlead

Agente de captación en frío. Convierte un ICP en una campaña de email frío enviando,
en 4 fases: **sacar leads → enriquecer emails → cargar → lanzar**.

## Prerequisitos (una vez)
Guarda las claves en un fichero local (NO en el repo):
- `~/.outbound/apify_key`   → API token de Apify (Settings → Integrations)
- `~/.outbound/smartlead_key` → API key de Smartlead (Settings → API)
- Apollo: conectar por MCP (`claude mcp add ...`, ver README de instalación).

Carga cada clave con `KEY=$(cat ~/.outbound/apify_key)` antes de usarla. Nunca
imprimas las claves ni las subas a git.

## Reglas de oro (deliverability) — respétalas siempre
- **30-40 emails/día por buzón** en frío. Nunca más.
- **2-3 buzones por dominio**; nunca el dominio principal → dominios secundarios.
- **Email 1 sin links** (mejor entrega). Links a partir del follow-up.
- Warmup 2-3 semanas antes de enviar desde un buzón nuevo.
- Personaliza: nombre, empresa, ciudad. Genérico = spam.

## FASE 1 · Sacar leads
Dos fuentes según el ICP:

**A) Negocios locales (inmobiliarias, brokers, tiendas)** → Apify Google Maps
(mejor cobertura de teléfono/web que Apollo para negocio local):
```bash
KEY=$(cat ~/.outbound/apify_key)
curl -s -X POST "https://api.apify.com/v2/acts/compass~crawler-google-places/run-sync-get-dataset-items?token=$KEY" \
  -H "Content-Type: application/json" -d '{
    "searchStringsArray":["inmobiliaria","compra venta pisos","agencia inmobiliaria"],
    "locationQuery":"Barcelona, Spain","maxCrawledPlacesPerSearch":30,
    "language":"es","skipClosedPlaces":true}' -o places.json
```
Campos útiles: `title, phoneUnformatted, website, categoryName, city, totalScore, reviewsCount`.

**B) Decisores con nombre (empresas, perfiles)** → Apollo MCP
`apollo_mixed_people_api_search` (una sola keyword; varias se unen con AND y salen 0).
Filtra por `person_seniorities` (owner/founder/c_suite), `person_locations`,
`organization_num_employees_ranges`. Luego enriquece con `apollo_people_bulk_match`
(máx 10 por llamada, usa el `id` de cada resultado).

## FASE 2 · Enriquecer emails (para leads de Google Maps)
Google Maps da web pero no email. Rastrea las webs con el Contact Scraper:
```bash
# construir startUrls = [{"url": web1}, ...] a partir de places.json, luego:
curl -s -X POST "https://api.apify.com/v2/acts/vdrmota~contact-info-scraper/runs?token=$KEY" \
  -H "Content-Type: application/json" \
  -d '{"startUrls":[...],"maxDepth":1,"maxRequestsPerStartUrl":3,"sameDomain":true}'
# poll GET /v2/actor-runs/{id} hasta SUCCEEDED, luego
# GET /v2/datasets/{defaultDatasetId}/items?clean=true → cada registro trae "emails"
```
Cruza el email con el negocio por dominio. Prefiere `info@`/`contacto@` del propio
dominio; descarta genéricos de terceros (agencias SEO, gmail sueltos dudosos).

## FASE 3 · Cargar en Smartlead
Sube en trozos de 25 (POST grande = 403 por proxy). Para buzón genérico (info@),
usa saludo SIN nombre y personaliza con `{{company_name}}`.
```bash
SL=$(cat ~/.outbound/smartlead_key)
curl -s -X POST "https://server.smartlead.ai/api/v1/campaigns/$CID/leads?api_key=$SL" \
  -H "Content-Type: application/json" --data-binary @chunk.json
# chunk.json = {"lead_list":[{email,company_name,phone_number,custom_fields:{ciudad}}...],"settings":{...}}
```
Secuencia (POST `/campaigns/$CID/sequences`): 4 pasos, día 0/3/6/9, asunto solo en el
paso 1 (los follow-ups con `"subject":""` van en el mismo hilo). `email_body` en HTML.

## FASE 4 · Lanzar y vigilar
- Ritmo por buzón: `POST /email-accounts/$ID` con `{"max_email_per_day":40}`.
- Arrancar: `POST /campaigns/$CID/status` con `{"status":"START"}` (PAUSED para parar).
- Respuestas: `GET /campaigns/$CID/analytics` (reply_count) y, para el detalle,
  `GET /campaigns/$CID/statistics?offset=&limit=100` (campo `reply_time` por lead).
  Contenido del hilo: `GET /campaigns/$CID/leads/$LID/message-history`.
- Conecta un webhook de respuestas a tu CRM (n8n/GHL) para no perder ninguna.

## Mensaje que convierte (marco "radiografía")
No vendas el servicio: **da valor en el primer email**. Una observación real del negocio
(reseñas ocultas, sin reserva online, web lenta) + oferta de auditoría gratis antes de
decidir. CTA de valor fácil de contestar ("¿Crees que os aportaría valor una revisión?").
