# Qualivo · Swipe & Competencia (Meta Ad Library)

Herramienta **interna de Qualivo** (independiente del dashboard de EAC) para
analizar y registrar los **carruseles/anuncios que la competencia tiene activos
en Meta**, usando la **Biblioteca de Anuncios pública** (Meta Ad Library).

Es un **único archivo** (`Swipe.gs`) que se pega en un Google Sheet nuevo. Al
abrir el Sheet aparece el menú **Qualivo Swipe**.

## Qué hace

- **Búsquedas rápidas** clicables a la Ad Library (país configurable, anuncios
  activos) por temática del nicho growth/marketing.
- **Marcas a vigilar** (editable) con su búsqueda directa.
- **Tabla de registro** con gancho de la tarjeta 1, estructura, oferta/CTA,
  fecha de inicio del anuncio, nº de variaciones y **puntuación de viralidad
  (1–5)** con semáforo (verde/ámbar/rojo).

> **Limitación honesta:** la Ad Library no da métricas de engagement. La
> "viralidad" se **infiere** (lo que lleva semanas activo + varias variaciones =
> ganador escalando). Los virales **orgánicos** de IG/LinkedIn no aparecen aquí.

## Cómo probarlo (2 minutos, sin instalar nada)

1. Crea un **Google Sheet nuevo** (será el de Qualivo).
2. **Extensiones → Apps Script**.
3. Borra el `Code.gs` de ejemplo y **pega el contenido de `Swipe.gs`**. Guarda (💾).
4. Vuelve al Sheet y **recárgalo** (F5). Aparecerá el menú **Qualivo Swipe**.
5. **Qualivo Swipe → Crear pestaña Swipe / Competencia**. La primera vez Google
   pedirá **autorizar** el script (tu propia cuenta) → acepta.
6. Se crea la pestaña `Swipe` con los enlaces y la tabla. Haz clic en cualquier
   🔎 / 👤 para abrir la Ad Library ya filtrada.

### Alternativa con clasp (versionado)

```bash
npm install -g @google/clasp
clasp login
cd qualivo-swipe
clasp create --type sheets --title "Qualivo · Swipe"   # crea Sheet + proyecto
clasp push
```

## Personalización

Edita la constante `SWIPE` al principio de `Swipe.gs`:

- `country`: país de la Ad Library (`ES`, `MX`, `US`, …).
- `queries`: búsquedas por temática.
- `brands`: competidores a vigilar.

Tras editar, en el Sheet: **Qualivo Swipe → Reconstruir ayuda (enlaces)**
(no borra tus registros).
