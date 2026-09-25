# Informe de cierre · Campaña de captación de registros (Adigital)

Periodo 31-08 → 23-09-2026. Cifras extraídas de la API de Google Ads v25 el 25-09.

## Cifras de cierre

| | |
|---|---|
| Invertido | **2.001,71 €** (100,1 % de 2.000 €) |
| Registros | **45** |
| Coste por registro | **44,48 €** |
| Impresiones / clics | 49.098 / 2.428 (CTR 4,95 %) |

Search 43 reg. / 1.751,60 € / CPL 40,73 € · PMax 2 / 144,00 € · Demand Gen 0 / 106,11 €.

## Dos formatos

- **`informe.html`** → PDF de 11 páginas, documento denso con tablas. Se genera con
  Chromium headless. La portada va aparte (`portada.html`, `@page margin 0`) y se une al
  cuerpo (`cuerpo.html`, con márgenes) porque Chromium no respeta `@page :first { margin: 0 }`
  ni los márgenes negativos para sangrar a borde:
  ```sh
  for f in portada cuerpo; do chrome --headless --no-pdf-header-footer \
    --print-to-pdf=$f.pdf "file://$PWD/$f.html"; done
  python3 -c "import pikepdf; o=pikepdf.Pdf.new(); \
    a=pikepdf.Pdf.open('portada.pdf'); b=pikepdf.Pdf.open('cuerpo.pdf'); \
    o.pages.append(a.pages[0]); o.pages.extend(b.pages); o.save('informe.pdf')"
  ```
  Nota de render: dentro de un contenedor flex, un `<span>` anidado en otro `<span>` no
  toma altura; las barras de comparación necesitan `display: block` explícito.
- **Gamma** → versión presentada, sobre el tema `z05hrmn7mkmq7z1` (el de la propuesta de
  Ágape), con el estilo de secciones numeradas en mayúsculas de las presentaciones de Qualivo.

## El argumento central

Con una cuota de impresión del 26,2 %, el mercado total era de **53.405 impresiones** en 24
días. Capturarlo entero habría dado **164 registros** y costado **6.706 €**. Con 2.000 € el
resultado esperable rondaba los 45–50: cerramos en 45. El objetivo de 200–300 registros no
era alcanzable por este canal con este presupuesto.

La segunda mitad del argumento es la página de registro: convirtió al **4,1 %** frente al
8–12 % de referencia. Con los mismos 1.039 clics y un 8 % habrían salido **83 registros** en
lugar de 43. Y con todo el mercado capturado a ese 8 %, serían **317** — el objetivo sí era
alcanzable, pero exigía ~6.700 € de inversión.

## Scripts

`scripts/datos_reunion.py` extrae los datos, `scripts/cierre.py` y `scripts/extra.py` los
agregan (campañas, grupos, dispositivo, semanas, keywords, cuota de impresión, negativas y
listas de remarketing). Las credenciales se leen de `gads_creds.json`, fuera del repositorio.

## Versión Gamma

Deck de 19 tarjetas sobre el tema **Qualivo** (`z05hrmn7mkmq7z1`), el mismo de la propuesta
de Ágape: fondo `#091c27`, turquesa `#23b6b7`, Inter, logo de Qualivo.

- Documento: https://gamma.app/docs/ajgdycypb1n34kv

Cómo se hizo, para repetirlo: la presentación de Ágape **no está guardada como plantilla** en
el espacio de trabajo (la única que lo está es «PPT Qualivo»), así que `generate_from_template`
no la acepta. Se usó `generate` pasando su `themeId` y replicando su estructura narrativa en
`additionalInstructions`: secciones numeradas en mayúsculas, frases cortas, preguntas retóricas
y frase de cierre. Parámetros que importaron:

- `textMode: "preserve"` y `cardSplit: "inputTextBreaks"` — sin esto Gamma reescribe las cifras.
  Los separadores `---` del texto de entrada marcan dónde empieza cada tarjeta.
- `imageOptions.source: "noImages"` — con `themeAccent` la imagen de portada falló al cargar
  (`loadImageStatus: "error"`) y dejaba un hueco roto en la primera pantalla.
- `textOptions.tone` y `audience` se ignoran cuando `textMode` es `preserve`; el tono hay que
  llevarlo en el propio texto de entrada.

Pendiente de ajustar a mano en el editor: en las tablas de 6–7 columnas los valores se parten
en dos líneas en el PDF exportado (`1.03 / 9`, `49.09 / 8`). Se corrige bajando el tamaño de
fuente de esas tarjetas. La API de Gamma solo crea, no edita.
