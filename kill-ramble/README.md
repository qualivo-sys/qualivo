# Don't Kill Rumble · Creator Acquisition (Qualivo)

Sistema de adquisición de creadores, prensa y comunidades para **Don't Kill Rumble**
(Scubalight Studios, Mendoza · editor Dojo System · Steam app `2146310`).

> El proyecto se conoce internamente como *Kill & Ramble*. El nombre público del juego es
> **Don't Kill Rumble** y así se usa en todo material de outreach. Ver `strategy/00-diagnostico.md`.

## Qué hay aquí

```
kill-ramble/
  AGENT.md                    Rol e instrucciones del Director de Growth & Creator Acquisition
  strategy/
    00-diagnostico.md         Hechos del juego, premisas y correcciones de enfoque
    01-arquitectura.md        Del descubrimiento al contenido publicado · canales priorizados
    02-segmentacion-scoring.md Tiers, modelo de scoring (100 pts) y justificación
    03-outreach-secuencias.md Secuencias por canal con copy ES/EN
    04-workflows.md           Workflows de automatización con herramientas, costes, complejidad y ROI
    05-herramientas.md        Evaluación de las herramientas propuestas y las que faltan
    06-kpis-experimentos.md   KPIs que importan, objetivos a 90 días y experimentos
    07-riesgos-prioridades.md Riesgos, prioridades y siguiente paso recomendado
    08-open-playtest-sep-oct.md Plan de choque para el Open Playtest (14 sep - 5 oct 2026)
    09-objeciones-y-oferta.md Objeciones del estudio (15 sep), decisiones (solo US, cero producción) y mensaje reescrito
  tools/
    score.mjs                 Scoring de creadores: CSV de entrada → CSV con puntuación, tier y motivo
    yt_aggregate.mjs          Vídeos de Apify (streamers/youtube-scraper) → canales (CSV de entrada del scoring)
    yt_enrich.mjs             Enriquece canales leyendo su página /videos (últimos 30 vídeos), sin API
  data/
    creators.sample.csv       Ejemplo de entrada para score.mjs
    airtable-schema.md        Esquema de la base (tablas, campos, vistas)
```

## Pipeline de descubrimiento (YouTube)

```bash
# 1. Apify: actor streamers/youtube-scraper con búsquedas de comparables → items.json
# 2. Agregar vídeos en canales
node kill-ramble/tools/yt_aggregate.mjs items.json > creators.csv
# 3. Enriquecer canales con ≥ 2000 subs leyendo YouTube (gratis, ~2 min por 150 canales)
node kill-ramble/tools/yt_enrich.mjs creators.csv 2000 > creators_enriched.csv
# 4. Puntuar
node kill-ramble/tools/score.mjs creators_enriched.csv > scored.csv
```

Sin dependencias. Node 18+. Los CSV con datos personales no se guardan en el repo; viven en Notion.

Ejemplo de scoring con datos de muestra:

```bash
node kill-ramble/tools/score.mjs kill-ramble/data/creators.sample.csv > /tmp/scored.csv
```

## Estado

| Pieza | Estado |
|---|---|
| Rol del agente | ✅ `AGENT.md` |
| Primera misión: sistema completo | ✅ `strategy/` |
| Script de scoring | ✅ `tools/score.mjs` |
| Base de datos | ✅ Notion (página «Don't Kill Rumble · Creator Acquisition»); esquema alternativo Airtable en `data/airtable-schema.md` |
| Buzones Smartlead | ✅ 15 buzones Qualivo calientes; dominio propio del juego pendiente para lanzamiento |
| Sesiones | ✅ Open Playtest 14 sep - 5 oct con reserva de franja (falta el enlace) |
| Descubrimiento YouTube | ✅ 480 vídeos → 381 canales → 153 enriquecidos → 39 en zona de contacto (15 sep) |
| Descubrimiento Twitch | ⏰ programado en Apify 20:00 y 02:00 UTC hasta el 19 sep |
