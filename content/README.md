# Content — el trabajo real convertido en activos

Espacio de trabajo del [`chief-content-officer`](../.claude/agents/chief-content-officer.md).
La idea es simple: **no creamos contenido, documentamos lo que construimos.**
Cada commit, PR, cliente cerrado o error resuelto es materia prima.

## Las dos fuentes

El contenido nace del cruce de dos fuentes, nunca de una sola:

1. **Build log (git)** — qué construimos de verdad. Es el driver. → `weekly-digest.sh`
2. **Radar IA (Notion)** — de qué habla el mercado ahora. Es solo contexto y
   timing. → base de datos **"📡 Radar IA Marketing"** en `QUALIVO — HQ`,
   alimentada por el `agente-radar-ia-marketing` (n8n).

El contenido con más autoridad vive en la **intersección**: una noticia del
radar conectada con algo que ya hicimos. El radar nunca decide solo qué se
publica; si un hallazgo no se ancla a trabajo real o a un cliente, es ruido.

### El bucle completo

```
radar-scout ──► Radar IA (Notion) ──┐
 (feeder semanal)                    ├──► chief-content-officer ──► contenido
weekly-digest.sh ──► build log ──────┘        (cruza ambas fuentes)
```

El [`radar-scout`](../.claude/agents/radar-scout.md) mantiene fresco el radar
(rastrea, puntúa y escribe hallazgos en Notion). Sin él, el radar caduca y el CCO
lee contexto viejo. Corre programado **a diario** (mira desde la última entrada
hasta hoy, así nunca duplica ni se queda atrás).

## Flujo semanal

```bash
# 1. Saca la materia prima de la semana (lo que construiste de verdad):
bash content/weekly-digest.sh          # últimos 7 días (tus commits)
bash content/weekly-digest.sh 14 all   # 14 días, todo el equipo

# 2. Pásaselo al CCO:
```

> Actúa como el `chief-content-officer`. Aquí está el build log de la semana.
> Crúzalo con el Radar IA (Notion, relevancia 4–5) y dame los 2–3 ángulos con
> más potencial, con los 8 puntos. Prioriza los que conecten una noticia del
> radar con algo que ya construimos.

El agente traduce el detalle técnico a lenguaje de negocio, decide a qué empresa
del ecosistema alimenta cada pieza y propone cómo reutilizarla en newsletter,
vídeo, carrusel, tweet, clase y lead magnet.

## Archivos

| Archivo | Qué es |
|---|---|
| `weekly-digest.sh` | Vuelca commits + cambios reales de un periodo como materia prima. |
| `backlog.md` | Cola de ideas de contenido detectadas, ancladas al trabajo real. |

## Regla de oro

Nada de contenido por tendencias. Todo parte de lo que realmente construimos.
Si el digest está vacío, no se inventa: se pregunta qué se hizo fuera del repo.
