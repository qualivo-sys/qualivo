# Máquina de SEO + Contenidos + Captación — Playbook Qualivo

Plantilla reutilizable para montar, en cualquier proyecto de cliente, el sistema completo que
construimos para **Eleva Academy**:

1. **Máquina de contenidos SEO** — decenas de artículos con marca, schema, interlinking y sitemap.
2. **Lead magnets interactivos** — calculadoras / tests que capturan al CRM.
3. **Google Sheet de mando** — keywords · volumen (DinoRank) · posición (Search Console) · estado.
4. **Investigación de keywords** — DinoRank API + huecos de contenido priorizados.
5. **Embudo de captación → nurturing → scoring** — plan a 60 días con hitos semanales.

> Objetivo: que otro agente (o persona) de Qualivo pueda replicar todo esto en un proyecto nuevo
> (Equipzilla, etc.) sin partir de cero. Empieza por `AGENT_BRIEF.md` si vas a lanzar un agente.

---

## 0. Cómo se replica (resumen de 1 minuto)

| Paso | Qué haces | Herramienta |
|------|-----------|-------------|
| 1 | Copiar esta carpeta al proyecto nuevo y rellenar `.env` | — |
| 2 | Definir marca (`brand.css`) y 5-10 pilares de contenido | Diseño + keyword research |
| 3 | Investigar keywords y volúmenes | `scripts/dino_enrich.py` |
| 4 | Generar artículos desde plantilla | `scripts/gen_articles.py` (adaptar) |
| 5 | Desplegar + sitemap + robots que permita IA (GEO) | Vercel / hosting |
| 6 | Montar lead magnets que capturan al CRM | `api/lead.js` (adaptar) |
| 7 | Crear el Google Sheet de mando y conectarlo | `scripts/build_sheet.py` |
| 8 | Rellenar volúmenes y posiciones | `scripts/fill_volumes.py` |
| 9 | Montar embudo email + scoring en el CRM | `templates/plan-60-dias.md` |
| 10 | Reporte semanal/mensual | Sheet + GA4 |

---

## 1. Arquitectura del sistema

```
                       ┌─────────────────────────┐
   Keyword research    │  DinoRank API            │  volúmenes, competencia,
   (dino_enrich.py) ──▶│  (X-API-Key)             │  huecos de contenido
                       └─────────────────────────┘
                                    │
                                    ▼
   ┌───────────────────────────────────────────────────────┐
   │  Google Sheet "Máquina SEO"  (build_sheet.py)          │
   │  Pestañas:                                             │
   │   · Keywords & Contenido  (maestro: kw|vol|url|pos)    │
   │   · GSC en vivo           (Search Console API)         │
   │   · Oportunidades         (huecos ≥ volumen objetivo)  │
   │   · Visibilidad IA (LLM)  (prompts de citación)        │
   └───────────────────────────────────────────────────────┘
        ▲                                    ▲
        │ posiciones/clics/impresiones       │ artículos publicados
        │                                    │
   ┌────┴───────────────┐        ┌───────────┴──────────────┐
   │ Search Console API │        │  Sitio de contenidos      │
   │ sc-domain:dominio  │        │  · N artículos con marca  │
   │ (gauth.py + JWT)   │        │  · schema Article/FAQ     │
   └────────────────────┘        │  · interlinking + sitemap │
                                 │  · robots permite IA (GEO)│
                                 │  · lead magnets → CRM     │
                                 └───────────┬───────────────┘
                                             │ leads
                                             ▼
                                 ┌──────────────────────────┐
                                 │  CRM (GoHighLevel)        │
                                 │  · secuencia de emails    │
                                 │  · lead scoring           │
                                 │  · handoff a comercial    │
                                 └──────────────────────────┘
```

---

## 2. Autenticación de Google sin librería `cryptography`

`scripts/gauth.py` firma el JWT del **service account** con `openssl` (no requiere instalar
`cryptography`, útil en entornos limitados). Da acceso a **Sheets** y **Search Console**.

**Setup en Google Cloud (una vez por cuenta de agencia, reutilizable):**
1. Crear service account → descargar JSON.
2. **Compartir el Google Sheet** con el email del service account (Editor).
3. En **Search Console** → Configuración → Usuarios → añadir el email del service account (permiso completo o restringido de lectura).
4. Guardar la ruta del JSON en `.env` como `GOOGLE_SA_JSON`.

Scopes usados:
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/webmasters.readonly` (o `webmasters` para enviar sitemaps)

Verificación rápida: `python scripts/gauth.py` imprime el título del sheet y los sitios de GSC.

---

## 3. DinoRank (keyword research)

- Base URL: `https://api.dinorank.com` · Docs: `https://api.dinorank.com/docs/docs.html`
- Auth: cabecera `X-API-Key`.
- Endpoint principal: `POST /api/v1/keyword-research` con `{"keyword","country","language"}`.
  Devuelve `data.data.keywords{}` (dict) con `vol`, `competencia`, `tipo`, `serp` por keyword.
- Otros endpoints: `tfidf`, `tracking`, `visibility`, `linkbuilding`, `searchconsole`,
  `canibalizaciones`, `analytics`, `llms` (requiere `project_id`), `auditoria`, `seolocal`.

`scripts/dino_enrich.py`:
- Lanza varias **semillas** de keyword research y agrega el máximo volumen por keyword.
- Cachea el agregado en disco para no repetir llamadas.
- Filtra al nicho, rellena volúmenes en el maestro y calcula **Oportunidades** (huecos con volumen ≥ umbral y sin artículo).

**Aprendizaje clave (Eleva):** las keywords de *diseño / inspiración* tenían 10-20× más volumen
que las de curso (p. ej. "diseños de uñas con gel" 18.100/mes). Siempre cruza intención comercial
con volumen real antes de decidir la cola de contenido.

---

## 4. Search Console (posiciones en vivo)

- Site: `sc-domain:DOMINIO` (cubre subdominios como `blog.dominio`).
- `searchAnalytics/query` con `dimensions:["page"]` y `["query"]` para posición/clics/impresiones.
- `sitemaps` (PUT) para **enviar el sitemap** por API tras publicar.

`scripts/build_sheet.py` lee el contenido publicado, cruza con GSC y escribe las 4 pestañas del
Sheet, con formato (cabecera en negrita + fila congelada).

---

## 5. Contenido SEO + GEO

Patrón usado (ver `eleva-leadmagnets/tools/gen_articles.py` como referencia real):
- **Hub-and-spoke**: pilares + artículos satélite enlazados entre sí.
- Plantilla `build(a)` que genera cada artículo con header de marca, índice (TOC) cuando hay ≥3
  secciones, recap final, CTA a lead magnet y schema (`Article` / `FAQPage` / `WebApplication`).
- **Sitemap** + **robots.txt** que **permite bots de IA** (GPTBot, ClaudeBot, Google-Extended) para
  **GEO** (posicionamiento en respuestas de LLMs). Ojo: si usas Cloudflare, pon el CNAME en
  **DNS-only** para que sirva *tu* robots.txt, no el gestionado de Cloudflare.

Adaptación a proyecto nuevo: cambia tokens de marca en `brand.css`, la lista de artículos/pilares
y el CTA. La mecánica de plantilla se reutiliza tal cual.

---

## 6. Lead magnets → CRM

`eleva-leadmagnets/api/lead.js` (serverless en Vercel) crea el contacto en **GoHighLevel**:
- API v2 `services.leadconnectorhq.com`, `Version: 2021-07-28`, requiere `User-Agent`.
- `POST /contacts/` con `source`, `tag`, campos personalizados (`detalle`, `origen`).
- Tolera duplicados (GHL puede rechazar por teléfono/email repetido).
- Token y `locationId` van en variables de entorno del hosting, **nunca en el repo**.

Tipos de lead magnet que funcionaron: calculadora de ingresos, calculadora de precios, test
"¿qué producto/curso necesitas?". Siempre **interactivo + aporta valor + captura al CRM**.

---

## 7. Embudo: captación → nurturing → scoring

Ver `templates/plan-60-dias.md` — plan a 8 semanas con hitos semanales en 5 frentes:
SEO · Captación · Lead Nurturing · Lead Scoring · Analítica. Es la plantilla lista para
adaptar volúmenes y metas al nuevo cliente.

---

## 8. Seguridad (obligatorio)

- **Nunca** commitear claves, tokens ni JSON de service account. Todo va por `.env` (git-ignored).
- Los scripts de esta plantilla leen credenciales **solo** de variables de entorno.
- Si un token se expone en un chat/PR, **rótalo** de inmediato.
- Ver `.env.example` para la lista completa de variables.

---

## 9. Ficheros de esta plantilla

```
playbooks/seo-content-machine/
├── README.md              ← este documento
├── AGENT_BRIEF.md         ← prompt listo para lanzar otro agente
├── .env.example           ← variables de entorno necesarias
├── scripts/
│   ├── gauth.py           ← token de service account (JWT vía openssl)
│   ├── build_sheet.py     ← crea/rellena el Google Sheet de mando
│   ├── dino_enrich.py     ← keyword research DinoRank + oportunidades
│   └── fill_volumes.py    ← rellena volúmenes por URL (matching + DinoRank)
└── templates/
    └── plan-60-dias.md    ← plan de embudo con hitos semanales
```

> Referencia de implementación real (Eleva): carpeta `eleva-leadmagnets/` de este repo
> (generadores de artículos, `brand.css`, `api/lead.js`, blog, sitemap).
