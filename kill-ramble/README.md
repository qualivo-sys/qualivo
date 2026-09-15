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
  tools/
    score.mjs                 Scoring de creadores: CSV de entrada → CSV con puntuación, tier y motivo
  data/
    creators.sample.csv       Ejemplo de entrada para score.mjs
    airtable-schema.md        Esquema de la base (tablas, campos, vistas)
```

## Uso rápido del scoring

```bash
node kill-ramble/tools/score.mjs kill-ramble/data/creators.sample.csv > /tmp/scored.csv
```

Sin dependencias. Node 18+.

## Estado

| Pieza | Estado |
|---|---|
| Rol del agente | ✅ `AGENT.md` |
| Primera misión: sistema completo | ✅ `strategy/` |
| Script de scoring | ✅ `tools/score.mjs` |
| Base Airtable creada | ❌ pendiente (esquema en `data/airtable-schema.md`) |
| Dominio de envío + warm-up en Smartlead | ❌ pendiente |
| Calendario de sesiones «Rumble Night» | ❌ pendiente (decisión del estudio) |
