# Hack the Lead → Whop

Scripts de Claude Code para montar la membresía **Hack the Lead** en Whop vía API.

Dos capas:

1. **Curso base** (este README): crea el curso completo (9 módulos, 47 lecciones).
   Tú solo grabas los vídeos y los cargas.
2. **Catálogo por problema + motor semanal**:
   - `build-categories.mjs` — crea las **6 categorías por problema** (cada subtema
     es un capítulo), listas para recibir drops. IDs en `categories-state.json`.
   - `content-engine/` — el **motor de drop semanal**: convierte un trabajo real en
     la lección de la semana y la publica en la categoría correcta. Ver
     `content-engine/README.md`.

El resto de este documento cubre la capa 1 (el curso base).

---

## Qué hace

1. **`build-course.mjs`** — crea el curso, sus capítulos (módulos) y todas las
   lecciones en Whop. Cada lección se crea como tipo *vídeo*, con su guion/notas
   ya puestos en el cuerpo de texto. Es **idempotente**: guarda los IDs en
   `whop-state.json`, así puedes reejecutarlo sin duplicar nada.
2. **`set-embeds.mjs`** — cuando ya hayas grabado, asigna el vídeo de cada
   lección (YouTube o Loom) por lote, a partir de `embeds.json`.

## Requisitos

- **Node 18 o superior** (usa `fetch` nativo; sin dependencias que instalar).
- Una **API key de Whop** con el scope `courses:update`.
- El **ID del "experience"** donde vivirá el curso (empieza por `exp_`).

### Dónde saco la API key y el experience ID
- API key: en tu dashboard de Whop → *Developer / API keys*. Dale permiso
  `courses:update`.
- Experience ID: entra al producto/experience donde quieres el curso; el ID
  `exp_...` aparece en la URL del dashboard o en *Settings* del experience.

## Uso paso a paso

```bash
# 1) Simula primero (no toca la API, no necesita key): revisa la estructura
node build-course.mjs --dry-run

# 2) Configura credenciales
export WHOP_API_KEY="tu_api_key"
export WHOP_EXPERIENCE_ID="exp_xxxxxxxxxxxx"

# 3) Crea el curso de verdad (oculto por defecto)
node build-course.mjs
#   …o créalo ya visible:
node build-course.mjs --visible

# 4) Graba los vídeos. Luego carga los enlaces:
cp embeds.example.json embeds.json     # rellena cada lección con su URL
node set-embeds.mjs --dry-run          # revisa
node set-embeds.mjs                    # asigna los vídeos
```

## Editar el contenido

Todo el texto (títulos, guiones, orden) está en **`course-data.mjs`**. Cámbialo
y vuelve a ejecutar `build-course.mjs`:
- Las lecciones que ya existen se respetan (no se duplican).
- Las **nuevas** claves (`key`) se crean.
- Para regenerar desde cero, borra `whop-state.json` y crea un curso nuevo.

> Nota: `build-course.mjs` solo **crea** lo que falta; no reescribe lo ya
> creado. Para **actualizar** títulos y guiones de lecciones/capítulos que ya
> existen, usa `update-content.mjs`:
>
> ```bash
> node update-content.mjs --dry-run     # revisa qué cambiaría
> node update-content.mjs               # aplica los cambios (PATCH)
> node update-content.mjs --lessons-only # no toca los títulos de capítulos
> ```
>
> Así puedes iterar el contenido en `course-data.mjs` y reflejarlo en Whop sin
> recrear el curso.

## `embeds.json` — formato

Clave de lección → enlace del vídeo. Acepta URL de YouTube o Loom, o un objeto
`{"type","id"}`:

```json
{
  "m0l1": "https://youtu.be/dQw4w9WgXcQ",
  "m0l2": "https://www.loom.com/share/abc123",
  "m4l5": { "type": "youtube", "id": "XYZ12345" },
  "m8l5": ""
}
```

Las claves siguen el patrón `m{módulo}l{lección}` (m0l1 = módulo 0, lección 1).
Deja en `""` las que aún no hayas grabado; el script las salta.

## Archivos

| Archivo | Qué es |
|---|---|
| `course-data.mjs` | El contenido del curso (editable) |
| `build-course.mjs` | Crea curso, módulos y lecciones |
| `update-content.mjs` | Reescribe títulos y guiones ya creados |
| `set-embeds.mjs` | Asigna los vídeos por lote |
| `embeds.example.json` | Plantilla con las 47 claves de lección |
| `whop-state.json` | (se genera) IDs creados, para idempotencia |

## Endpoints usados (referencia)

- `POST /api/v1/courses` — crear curso
- `POST /api/v1/course_chapters` — crear capítulo (módulo)
- `POST /api/v1/course_lessons` — crear lección
- `PATCH /api/v1/course_lessons/{id}` — asignar vídeo
- Auth: `Authorization: Bearer <API_KEY>` · scope `courses:update`
- Base: `https://api.whop.com/api/v1`
