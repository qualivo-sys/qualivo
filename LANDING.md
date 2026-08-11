# qualivo.io — Documentación del sistema

> Web estática + funciones serverless en Vercel. Este documento es el mapa para mantenerla: estructura, integraciones, cómo desplegar y cómo añadir contenido. **Ningún secreto vive en el repo** — todo en variables de entorno de Vercel.

## Stack

- **HTML/CSS/JS estático**, sin build step. Diseño propio (tokens en `assets/styles.css`: crema `#FAF7F0`, tinta `#101319`, teal `#0E7C74`/`#27BDB1`, amarillo `#F4CC38`, coral `#E8590C`, Montserrat variable local).
- **Vercel** (proyecto `qualivo`, team Qualivo Agency). Deploy directo por CLI (no conectado a GitHub): `vercel deploy --prod` desde la raíz. `.vercelignore` excluye lo que no es la landing (`nuria-pago-pfd`, `src`, etc.).
- **Dominios**: `qualivo.io` (producción) + `www` (redirect 308). DNS en gestiondecuenta (Arsys): A `216.198.79.1`/`64.29.17.1`, CNAME www → `f2aa7cd16f4e7468.vercel-dns-017.com`. MX de Google Workspace — no tocar.

## Mapa de páginas

| Ruta | Qué es |
|---|---|
| `/` | Landing principal (hero animado, problema, diagnostic, casos, recursos, FAQ, formulario) |
| `/consultoria-growth-marketing/` | Página BOFU (keyword: consultoría growth marketing) |
| `/formacion/` | Vertical de formación (keyword: agencia marketing educativo) |
| `/casos/{nuria-roure,bellovinilo,eac,eleva-academy,focus-practical}/` | Casos con números reales |
| `/blog/` + 3 artículos | Biblioteca de problemas (pilares captación y funnel + síntoma) |
| `/diccionario/` + 4 fichas | CAC, ROAS, lead scoring, cualificación (schema DefinedTerm) |
| `/diagnostico-express/` | Auto-diagnóstico de 15 preguntas (lead magnet) |
| `/sobre/` | Perfil de Maikel (E-E-A-T) |
| `/aviso-legal/`, `/privacidad/`, `/cookies/` | Legales (noindex) |
| `/404.html` | Página de error personalizada |

SEO: `sitemap.xml` (reenviar a GSC al añadir páginas), `robots.txt`, `llms.txt` (¡mantener al día — es la carta de presentación ante los LLMs!), JSON-LD en todas las páginas indexables.

## Formularios → GoHighLevel

- **`/api/lead.js`**: formulario principal → upsert de contacto en GHL con tags `qualivo-landing` + `diagnostic-cualificado|diagnostic-fuera-de-alcance`, nota con todos los campos, y aviso por email (Resend). Honeypot + validación en servidor.
- **`/api/autodiagnostico.js`**: resultado del auto-diagnóstico → contacto con tags `autodiagnostico` + `debil-<etapa>`, nota con puntuaciones y fugas, aviso por email.
- **Variables de entorno en Vercel** (Settings → Environment Variables): `GHL_API_KEY` (PIT), `GHL_LOCATION_ID`, `RESEND_API_KEY`, `LEAD_NOTIFY_TO` (destino de avisos; será maikel@qualivo.io cuando se verifique el dominio en Resend), `LEAD_NOTIFY_FROM` (opcional).
- Calendario de confirmación: widget GHL en `assets/app.js` → `CONFIG.CALENDAR_EMBED_URL`.

## Analítica

- **Vercel Web Analytics** (sin cookies, sin banner): script en todas las páginas; activar en el panel del proyecto. Eventos: `diagnostico_solicitado`, `lead_fuera_alcance`, `autodiagnostico_completado`.
- **GA4** `G-LVDQS0MXF4` (propiedad 404387407): solo carga tras consentimiento — `assets/consent.js` gestiona el banner (elección en localStorage `qv-consent`), Consent Mode v2, y el helper `window.qvTrack()`. Mismos 3 eventos. Cambio de elección: botón en `/cookies/`.
- **Search Console**: propiedad `sc-domain:qualivo.io`; la cuenta de servicio `apiclaude@kinetic-dream-377917.iam.gserviceaccount.com` tiene acceso completo (consultas y gestión de sitemaps por API).
- **DinoRank**: proyecto 141600 (ES/es) con API MCP en `api.dinorank.com/mcp` (Bearer con la clave de la cuenta). Cargar las 26 keywords del tracking (doc `keywords-tracking-dinorank.md`).

## Social (GHL Social Planner)

Cuentas conectadas: LinkedIn personal (Maikel), página LinkedIn Qualivo, Instagram @maikel.echevarria, Google Business Profile (verificado). API: `POST /social-media-posting/{locationId}/posts` con `accountIds`, `summary`, `media` (array, obligatorio aunque vacío), `status` (`draft`/`scheduled`), `userId`. Las tarjetas de Instagram viven en `assets/social/` (generadas con `card-template-v2` — línea gráfica de la web).

## Cómo añadir contenido

1. **Caso**: copiar la estructura de `/casos/eac/index.html` (hero con métrica → reto → tarjetas teal → resultados negro → cierre lila → CTA). Añadir a: sección #casos de la landing, `sitemap.xml`, `llms.txt`. Reenviar sitemap.
2. **Artículo**: estructura de `/blog/funnel-de-ventas/index.html` (lede → resumen "en 30 segundos" → H2s → cajas `.post-caso` → CTA → autor). Añadir al índice del blog + sitemap + llms.txt. Regla editorial: `content/brief-redes.md` y la estrategia en la rama `claude/cco-agent-strategy-l6kmqx`.
3. **Ficha del diccionario**: generador con plantilla en el histórico de sesión; estructura definición-destacado → fórmula → error común → caso.
4. Tras cualquier cambio de CSS/JS: la caché ya es `must-revalidate`, no hace falta versionar, pero mantener `?v=` en los enlaces no estorba.

## Gotchas conocidos

- `vercel deploy --prod` a veces falla con "fetch failed" (proxy/red) y puede dejar el deploy en preview: **verificar siempre en producción tras desplegar** (`curl https://qualivo.io/... | grep <algo nuevo>`). Ejecutarlo siempre desde la raíz del repo (desde otro cwd crea proyectos basura).
- El listado del Social Planner (`posts/list`) requiere `accounts` + `fromDate`/`toDate` + `type`; sin ellos devuelve vacío.
- La API de GHL exige `userId` al crear posts y `media` presente.
- Instagram no admite posts sin imagen.
- El buscador de contactos de GHL tarda en indexar: verificar contactos recién creados con el listado (`GET /contacts/?locationId=`), no con `query`.

## Pendientes conocidos (agosto 2026)

- Verificar `qualivo.io` en Resend → cambiar `LEAD_NOTIFY_TO` a maikel@qualivo.io.
- Activar Google Analytics Admin API en el proyecto Cloud 486245798770 para gestionar key events por API (o marcarlos en la UI de GA4).
- Píxel de Meta: pendiente de Pixel ID; integrarlo tras el banner con categoría de marketing.
- Decisión de línea gráfica de carruseles (índigo de `content/` vs clara de la web).
- Informe SEO/leads programado para el 1 de septiembre de 2026.
