# FASE 0 · A. SOURCE MAP

Fuentes que **he podido inspeccionar directamente** en esta sesión (10-sep-2026).

| SOURCE | TYPE | LOCATION | WHAT IT CONTAINS | RELEVANCE | INSPECCIONADO |
|---|---|---|---|---|---|
| Repo `qualivo-sys/qualivo` | Repository | GitHub, 29 ramas | Todo el trabajo de agentes y clientes, sin integrar | CRÍTICA | ✅ completo (ramas listadas, 5 leídas) |
| `sistema/cerebro.md` | Documentation / Protocol | rama `claude/quipu-billing-dashboard-g2s2ap` | Constitución de facto: quién es quién, protocolo, directrices, pipeline, decisiones | CRÍTICA | ✅ leído íntegro (103 líneas) |
| Routines (triggers) | Workflow / Scheduler | Claude Code Remote, 23 activas | El scheduler real de Qualivo | CRÍTICA | ✅ las 23, con prompt y last_run |
| Sesiones | Agent runtime | Claude Code Remote, 46 | Los agentes viven aquí | CRÍTICA | ✅ listado completo con estado |
| Notion `Qualivo OS · Sala de Mando` | Memory / Control Plane | Notion | BBDD: Agentes, Tareas, Decisiones, Sprints, Experimentos + OUTBOUND BRAIN | CRÍTICA | 🟡 índice leído, contenido no |
| Conectores MCP | Tools | Cuenta claude.ai | 14 instalados, 9 activos | ALTA | ✅ listado |
| Google Doc "Estrategia Central Qualivo v1" | Memory (fuente de verdad) | Drive `1GIDjC9ZeNm...` | Estrategia que manda sobre el repo | CRÍTICA | ❌ no leído |
| Google Sheet cuadro de caja (cerebro) | Data / Finance | Drive | Caja 12m, plan recortes | CRÍTICA | ❌ no leído |
| GoHighLevel | Data (CRM) | SaaS | Fuente de verdad comercial | CRÍTICA | ❌ no accedido |
| Smartlead / Apollo / HeyReach | Tools (outbound) | SaaS | Campañas, respuestas, secuencias | ALTA | 🟡 Apollo y HeyReach conectados por MCP |
| Vapi / Twilio | Tools (voz) | SaaS | Agente Raquel | MEDIA | ❌ |
| n8n | Workflow engine | SaaS | Automatizaciones; `mapa-n8n.md` pendiente | ALTA | ❌ |
| Todoist | Tasks | SaaS | Tareas reales de Maikel + horas por proyecto | ALTA | ❌ |
| Quipu | Finance | SaaS | Facturación | ALTA | ❌ vía script `quipu/sync_quipu_dashboard.py` |
| Vercel | Infra | SaaS | qualivo.io + agentforme-site | MEDIA | ❌ |

## Conectores MCP (estado real)

**Conectados y activos:** Apollo.io · Gamma · Gmail · Google Calendar · Google Drive · Heygen · HeyReach · Higgsfield · Notion
**Instalados pero apagados en chat:** Canva · Motion · Slack · Stytch
**Roto:** Mailerfind (`needs_reconnect`)

No hay conector MCP de: GoHighLevel, Smartlead, n8n, Todoist, Quipu, Vapi, Twilio, Meta, Google Ads, Search Console. Se acceden por API con claves guardadas en el *scratchpad* de cada sesión.
