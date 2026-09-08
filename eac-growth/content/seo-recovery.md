# EAC · Recuperación SEO post-hackeo

Descubierto al conectar Search Console (vía OAuth de maikel@qualivo.io). El hackeo (inyección
`thai_casino_inj`) dejó rastro en el índice de Google que aún hay que limpiar.

## Diagnóstico (últimos 90 días, GSC)
- **79% de los clics (26.681) son spam de casino** indonesio: `suster123`, `sengtoto`, `alexis togel`, `dewatogel`, `pttogel`, `slot mahjong`… No son alumnos.
- Se colaban por las **páginas legales inyectadas** (`/politica-cookies/` 24.574 clics, `/aviso-legal/` 8.643).
- Clics legítimos reales: ~7.216.

## Lo que YA está bien
- `/politica-cookies/` y `/aviso-legal/` → **re-rastreadas y en `noindex`/excluidas** (4-sep y 27-ago). Google las está soltando.
- Home (`/`) → indexada y sana.
- Las URLs basura del malware (`/best-*-casino-*`, `/gates-of-olympus-*`, `/enroll-students-new/`, `/edwiser-*`) ya tienen **impresiones casi a cero** → decayendo.

## Acciones para rematar (en GSC, no por API)
1. **Seguridad y acciones manuales → Problemas de seguridad**: si sale "Contenido pirateado" y el sitio está limpio → **Solicitar revisión**.
2. Que las URLs basura devuelvan **404/410** (o noindex) — pedir a adgoritmo/SiteGround. Lista completa en la pestaña **"Limpieza SEO"** del sheet.
3. **Retirada de URLs** (GSC) para las peores, como parche temporal.
4. **Reenviar sitemap** limpio + Solicitar indexación de las páginas reales.
5. **Publicar contenido nuevo de aviación** (Fases 3+) → señal fuerte de recuperación.

## Oportunidad inmediata (quick wins SEO)
EAC ya rankea para **23 de nuestras 290 keywords**, varias en página 1-2 (ver pestaña "Keywords SEO"):
- `cuanto gana un azafato de vuelo` p5.8 · `curso auxiliar de vuelo` p9.4 · `curso tcp` p15.6 ·
  `curso tcp barcelona` p6.6 · `salario auxiliar de vuelo` p5.2 · `curso despachador de vuelo` p5.4 …
→ Optimizar/refrescar esas páginas es lo más rentable a corto plazo (Fase 3 empieza por ahí).
