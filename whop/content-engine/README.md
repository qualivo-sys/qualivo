# Content Engine — el motor de drop semanal

Convierte **un trabajo real** en el drop de la semana y lo publica en Whop, en la
categoría correcta. La idea de fondo: *nunca grabar “porque sí”* — cada pieza sale
de algo que ya construiste.

```
Proyecto real (cliente / Agentome)
   └─ lo documentas
        └─ [Claude Code] genera el drop  ──► carpeta drops/AAAA-wNN-slug/
              ├─ lesson.md      (guion de la lección)
              ├─ drop.json      (categoría, capítulo, título, vídeo, recursos)
              └─ (assets/…)     (template, agente, workflow, caso — opcional)
        └─ publish-drop.mjs publica la lección en Whop + adjunta recursos + vídeo
```

Lo único 100 % humano: el trabajo real y el vídeo de 15 min. El resto se empaqueta
y publica solo.

## Estructura de un drop

Cada drop es una carpeta en `drops/`. Copia `drops/_template/` y renómbrala
`AAAA-wNN-slug` (año-semana-slug, p. ej. `2026-w31-sdr-claude-code`).

**`drop.json`**

| Campo | Qué es |
|---|---|
| `id` | Igual que el nombre de la carpeta. Clave de idempotencia. |
| `category` | Clave de categoría: `c1`…`c6` (ver tabla abajo). |
| `chapter` | Nombre exacto del subtema/capítulo dentro de esa categoría. |
| `title` | Título de la lección que ve el miembro. |
| `video` | URL de YouTube o Loom. Déjalo `""` hasta que grabes. |
| `resources` | Lista `{label, url}` — los activos (template, repo, workflow). |

**`lesson.md`** — el cuerpo de la lección en markdown (el guion). El publicador le
añade automáticamente una sección **📦 Recursos de esta semana** con los `resources`.

## Categorías y capítulos disponibles

| Clave | Categoría | Capítulos (`chapter`) |
|---|---|---|
| `c1` | Conseguir clientes | Outbound · ABM · LinkedIn · Email · Auditorías IA |
| `c2` | Automatizar ventas | CRM · Follow-ups · Lead Scoring · IA |
| `c3` | Crear agentes | Claude Code · Cursor · MCP · OpenAI · n8n |
| `c4` | Automatizar empresas | Finanzas · RRHH · Operaciones · Customer Success |
| `c5` | Desarrollo | Python · APIs · Docker · GitHub · Bases de datos |
| `c6` | Productividad | Notion · Sistemas · SOPs · IA personal |

> Las categorías se crean con `../build-categories.mjs` y sus IDs viven en
> `../categories-state.json`. El publicador los resuelve desde ahí.

## Publicar un drop

```bash
export WHOP_API_KEY="tu_api_key"          # scope courses:update

# revisa sin tocar la API
node publish-drop.mjs drops/2026-w31-sdr-claude-code --dry-run

# publica de verdad
node publish-drop.mjs drops/2026-w31-sdr-claude-code
```

Es **idempotente**: la primera vez crea la lección y guarda su ID en
`drops-state.json`; reejecutarlo la **actualiza** (no duplica). Cuando grabes el
vídeo, rellena `video` en `drop.json` y vuelve a correrlo — asigna el embed.

## Generar el drop con Claude Code

`CLAUDE.md` (en esta carpeta) es el prompt de atomización: le das un proyecto real
y produce la carpeta del drop lista para publicar. Ese es el paso que automatiza la
parte de “empaquetar”, no la de tener la idea.
