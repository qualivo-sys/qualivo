# Captación Qualivo — Playbook ejecutado

Sistema de captación de clientes para **Qualivo** (performance marketing para
negocios de servicios y formación en España). Este directorio operativiza los
3 agentes del plan Q2 (`qualivo-agentes-q2/claude-code-skills`) con output ya
redactado y listo para usar.

## ICP (de tus agentes)
Negocios de servicios / formación en España · ticket > 500 € · facturación
20k–100k €/mes · con dolor de **cualificación de leads** y **seguimiento**
(velocidad de respuesta, leads no cualificados, ghosting, caos CRM,
dependencia del equipo).

## Casos de éxito disponibles
- **BelloVinilo** — 3.600 € → 30.000 € (caso público de referencia).
- **EAC** (Escola Aeronàutica de Catalunya) — formación, 3 meses:
  - CPL de **16,3 € → 5,6 €** (−66 %)
  - Leads de **244 → 425/mes** (+74 %)
  - **19 matrículas · ~83.600 € facturados · ROAS 8,1×** (~10.276 € invertidos)
  - *(Números derivados de `src/SeedData.gs`. Confirmar con EAC antes de
    publicarlo con nombre; si no, usar "una escuela de formación aeronáutica".)*

## Los 3 canales y su estado de ejecución

| Canal (agente) | Ola | Output aquí | Herramienta | Estado |
|---|---|---|---|---|
| **ABM Outbound** | Abril · O1 | `abm-secuencia-emails.md`, `abm-apollo-checklist.md` | Apollo + Gmail + Notion | Copy listo · lista Apollo pendiente de auth |
| **LinkedIn Orgánico** | Mayo · O2 | `linkedin-semana-1.md` | HeyGen + Notion + n8n | 1 semana redactada · render pendiente en tus tools |
| **Partnerships** | Junio · O3 | `partnerships-outreach.md` | Apollo + LinkedIn + Notion | Templates listos · lista Apollo pendiente de auth |

## Assets ya creados fuera del repo
- **Notion — CRM "Captación Qualivo — Pipeline de clientes"**: creado.
  https://app.notion.com/p/e5b4db86ae8945a6a96eb85faaedba45
- **Gamma — Caso de éxito EAC** (presentación): generándose.
  https://gamma.app/generations/rRahr4blIuh2gguCLhitC

## Bloqueos (acción tuya)
- **Apollo.io** necesita autorización OAuth (connectors de claude.ai). Sin
  ella no puedo sacar las listas de leads/partners. Todo lo demás (copy,
  Notion, Gamma) no depende de Apollo.

## Siguiente paso recomendado
1. Autoriza Apollo → saco lista de 50–100 academias (ICP) validadas.
2. Grabas los 5 Loom del email 4 (o me das acceso y guío el guión).
3. Cargamos secuencia en Apollo con sender Maikel/Víctor y A/B de subject.
