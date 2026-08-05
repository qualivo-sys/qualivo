# Content — el trabajo real convertido en activos

Espacio de trabajo del [`chief-content-officer`](../.claude/agents/chief-content-officer.md).
La idea es simple: **no creamos contenido, documentamos lo que construimos.**
Cada commit, PR, cliente cerrado o error resuelto es materia prima.

## Flujo semanal

```bash
# 1. Saca la materia prima de la semana (lo que construiste de verdad):
bash content/weekly-digest.sh          # últimos 7 días (tus commits)
bash content/weekly-digest.sh 14 all   # 14 días, todo el equipo

# 2. Pásaselo al CCO:
```

> Actúa como el `chief-content-officer`. Aquí está el digest de la semana.
> Elige los 2–3 ángulos con más potencial y devuélvemelos con los 8 puntos.

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
