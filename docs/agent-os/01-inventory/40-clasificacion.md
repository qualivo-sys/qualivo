# FASE 0 · F. INITIAL CLASSIFICATION

| Elemento | CATEGORY | Ubicación | Estado |
|---|---|---|---|
| Sesión "Quipu billing dashboard" | **AGENT** (Brain) | Claude session | 🟢 activo |
| Sesión "Client acquisition strategy" | **AGENT** (sobrecargado: 4 roles) | Claude session | 🟢 activo |
| Sesión "Landing Qualivo.io" | **AGENT** (3 roles) | Claude session | 🟢 activo |
| Sesión "Agente de Ventas" | AGENT | Claude session | 🟡 fichado, sin uso |
| Sesión "Agente de Automatización" | AGENT | Claude session | 🟡 fichado, sin uso |
| Raquel (Vapi) | **AGENT** (canal de voz) | dentro de Outbound | 🟡 sin autonomía propia |
| `sistema/cerebro.md` | **DOCUMENTATION + REGISTRY + PROTOCOL** | repo, 1 rama | 🟡 3 copias divergentes |
| Timbres / Canales (6 pokes) | **EVENT BUS / TASK BUS** | Routines | 🟡 manual, texto libre |
| Prefijo `[PARA CEREBRO]` | **PROTOCOL** | convención en texto | 🟡 sin schema |
| Notion "Sala de Mando" | **CONTROL PLANE + MEMORY** | Notion | 🟡 existe, poco usado |
| Notion BBDD Agentes | **AGENT REGISTRY** | Notion | 🟡 sin sincronizar con la realidad |
| Notion BBDD Tareas | **TASK SYSTEM** | Notion | 🟡 |
| Notion BBDD Decisiones | **DECISION LOG** | Notion | 🟡 |
| Notion BBDD Sprints / Experimentos | **MEMORY (estratégica)** | Notion | 🟡 |
| Notion "OUTBOUND BRAIN" | **MEMORY** (fuente de verdad de outbound) | Notion | 🟢 |
| Google Doc "Estrategia Central v1" | **MEMORY** (fuente de verdad estratégica) | Drive | 🟢 manda sobre el repo |
| Google Sheet caja 12m | **DATA (finanzas)** | Drive | 🟢 |
| `captacion/datos/funnel-diario.csv` | **DATA** (scorecard) | rama outbound | 🟢 |
| `web-diario.csv`, `seo-*.csv`, `redes-*.csv` | DATA | rama landing | 🟡 parcial |
| `quipu/sync_quipu_dashboard.py` | **WORKFLOW** | repo (3 ramas) | 🟢 |
| `guardia_reenvios.py` | **WORKFLOW** | rama outbound | 🟢 |
| Dashboards EAC / Eleva (Apps Script) | **DASHBOARD** | repo `src/` + Sheets | 🟢 |
| `src/connectors/*.gs` | **TOOL** (Meta, Google Ads, TikTok, HubSpot, GHL) | repo | 🟢 reutilizable |
| GoHighLevel | **DATA SOURCE / DATABASE** (CRM) | SaaS | 🟢 |
| Smartlead / Apollo / HeyReach | TOOL | SaaS | 🟢 |
| n8n | WORKFLOW ENGINE | SaaS | 🔴 sin mapa (`mapa-n8n.md` pendiente) |
| Todoist | TASK SYSTEM (humano) | SaaS | 🟢 |
| Quipu | DATA SOURCE (finanzas) | SaaS | 🟢 |
| Vapi / Twilio | TOOL (voz) | SaaS | 🟡 bundle en verificación |
| qualivo.io + agentforme-site | INTERFACE | Vercel | 🟢 |
| Radiografía | INTERFACE (lead magnet central) | Vercel | 🟢 |
| Rama por defecto = `eac-metrics-dashboard` | **UNKNOWN / error** | GitHub | 🔴 |
| Observabilidad / health de agentes | — | **NO EXISTE** | 🔴 |
| Audit log de acciones | — | **NO EXISTE** | 🔴 |
