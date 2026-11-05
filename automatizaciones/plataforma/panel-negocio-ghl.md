# Panel de negocio Qualivo · lo que necesita saber Growth del GHL de Qualivo

5-nov-2026 · Automatización, para Growth (Intelligence). El panel lee en vivo y hace acciones en GHL de
Qualivo solo cuando Maikel pulsa.

## 1. Clave: una nueva y solo para el panel

- **Recomendación:** una *Private Integration* nueva en la subcuenta de Qualivo, «Qualivo · Panel de negocio», guardada en Vercel como **`GHL_PANEL_API_KEY`** (solo producción y preview de la rama del panel). La crea Maikel; el Chief of Staff se lo lleva.
- **Por qué no reutilizar `GHL_API_KEY`:** esa clave la usan la web, la capa de activación y los crons, con permisos más amplios. Si el panel tiene la suya, se puede revocar o rotar sin parar la captación, y en los registros de GHL se ve qué hizo el panel.
- **Permisos justos** para leer el pipeline y hacer las 5 acciones:
  - `contacts.readonly` y `contacts.write`: etiqueta RC, campos RC, notas y tareas del contacto;
  - `opportunities.readonly` y `opportunities.write`: leer el pipeline y mover de etapa o marcar el resultado;
  - `locations/customFields.readonly`: resolver los IDs de los campos RC;
  - `locations/tags.readonly`;
  - `calendars.readonly` y `calendars/events.readonly`: las reuniones de la semana;
  - `users.readonly`: el responsable de cada tarea.
- La clave **solo se usa en el servidor** (`api/…` de Vercel), nunca en el navegador. Cada acción comprueba la sesión de Maikel.

## 2. Campos RC (creados el 4-nov)

| Qué | Clave en GHL | Tipo | Valores |
|---|---|---|---|
| Etiqueta | `RC` | etiqueta | — |
| Canal de origen RC | `contact.canal_de_origen_rc` | opción única | Reactivación · Meta · Referido/Partner · Clase · Outbound · Red personal · Contenido |
| Fecha RC | `contact.fecha_rc` | fecha | la de la reunión |

- **«Marcar RC» desde el panel** = poner la etiqueta `RC` + el canal + la fecha, las tres a la vez. El recuento semanal (`automatizaciones/recuento-rc/recuento.js`) solo cuenta las RC que tienen las tres.
- Los IDs de los campos se leen de `GET /locations/{id}/customFields?model=contact` por su `fieldKey`. No hay que escribirlos a mano.

## 3. Pipelines y etapas

Hay tres pipelines: **Prospección** (el comercial: Nuevo Lead → … → Oferta enviada → Segunda reunión →
Negociación → Piloto → Cliente), **Qualivo Pipeline** (el de la web: … → Propuesta Enviada → Cliente
Activo) y **ABM**. Los IDs de las etapas se leen de `GET /opportunities/pipelines`; tampoco hay que escribirlos a mano.

## 4. Qué se dispara al mover una etapa (para no duplicar)

Mover una oportunidad desde el panel es igual que moverla a mano en GHL, así que **ya dispara lo que existe**:

- **Workflows de GHL publicados** en Qualivo: «Cliente ganado:», «ETAPA_NUEVO_LEAD», «Lead_agendado», «Radiografía · contestó» y «ABM — Nuevo Contacto». Hay que revisar con Maikel si alguno escribe al contacto al cambiar de etapa antes de usar el botón con leads reales.
- **Señales a Meta** (`api/senales-meta.js`, cada 2 horas): lee los cambios de etapa y se los cuenta a Meta. Es deseable: el panel no tiene que mandar nada a Meta por su cuenta.
- **Seguimientos** (`api/seguimientos.js`, de lunes a viernes): crea tareas de oportunidades atascadas. Si el panel también crea tareas «de seguimiento», que use otro título para no duplicarlas.
- **n8n:** ningún workflow de n8n actúa sobre los cambios de etapa de Qualivo. Los pollers de etapas son de EAC y ELEVA, en sus subcuentas. Los puentes de Qualivo (ManyChat, Q-Flow y SDR) solo crean contactos o notas al entrar respuestas. **No hay que montar nada en n8n para el panel.**

## 5. Consejos

- Paginación: `GET /opportunities/search` devuelve 100 por página con `meta.nextPageUrl`. Ahora mismo hay 195 oportunidades [C, 4-nov].
- Límite de la API de GHL: 100 llamadas cada 10 s por subcuenta. Cachear las lecturas del panel unos segundos y reintentar el 429.
- Cada acción deja una nota «[Panel] …» en el contacto, para que quede rastro de qué se hizo desde el panel.
