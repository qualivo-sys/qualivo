# Limitaciones de la recuperación — carroselectricosdegolf.com

Fecha del análisis: 2026-08-12
Estado del dominio: **caído**. Las 4 variantes (http/https, con/sin www) devuelven HTTP 503 o error de certificado SSL (el certificado servido ya no corresponde al dominio), consistente con la baja del hosting en Arsys.

> ADVERTENCIA CENTRAL: **lo recuperado de buscadores y archivos públicos NO sustituye una copia de seguridad de WordPress.** Es una reconstrucción documental del contenido público. Todo lo que vivía solo en la base de datos (pedidos, clientes, configuración) no existe en ninguna fuente pública.

## 1. Recuperado (lo que tenemos realmente)

- **Inventario de URLs públicas** del dominio a partir de los índices de Google y DuckDuckGo (ver `inventario_urls.csv`).
- **Title tags verbatim** de las páginas indexadas y fragmentos de meta descriptions/textos (ver `seo/metadata.md`).
- **Datos de catálogo parciales** de los productos indexados: nombres, URLs, claims comerciales, garantías, algunas especificaciones (motor 200W, batería litio 12V 18-20Ah, ciclos de vida, conector Anderson, precios "desde 395 €" y "610 €") — procedentes de snippets de buscador.
- **Sitio corporativo hermano greencar.es completo** (Squarespace, sigue vivo): historia, fabricación propia, servicios, FAQ, blog corporativo (6 artículos), aviso legal, políticas, condiciones de venta, 64 imágenes corporativas y de producto. Guardado en `fuentes_complementarias/greencar_es/`.
- **Datos societarios**: GREENCAR S.L., C/ Compositor Vivaldi 13, Pol. Can Jardí, 08191 Rubí (Barcelona); Registro Mercantil de Barcelona, Tomo 021479, Folio 11, Hoja B-22671; greencar@greencar.es; (+34) 606 375 645 / 93 586 04 16.

## 2. Recuperable parcialmente

- **Descripciones largas de producto**: solo tenemos los fragmentos que los buscadores conservan en sus snippets; el texto completo depende de los snapshots de Wayback Machine.
- **Imágenes de producto originales** (`/wp-content/uploads/`): ninguna imagen del dominio original ha podido descargarse todavía; existen fotos equivalentes de los mismos productos en greencar.es (fuente complementaria, no idéntica).
- **Blog de la tienda** (`/blog/`): la URL existía (indexada en DuckDuckGo) pero no se han localizado artículos individuales indexados; pendiente de Wayback.
- **Estructura de menús, footer y textos legales del dominio**: se infiere parcialmente; los textos legales de greencar.es probablemente eran muy similares, pero no son literalmente los del dominio caído.

## 3. No recuperable públicamente (perdido si no aparece backup de Arsys/agencia)

- Base de datos WooCommerce completa:
  - **pedidos históricos** y su estado;
  - **clientes y cuentas de usuario** (emails, direcciones, historiales);
  - **contraseñas** (hashes);
  - cupones, impuestos, configuración de envío y pasarelas de pago (Stripe/PayPal/Redsys, claves API);
  - stock e inventario real, SKUs internos, costes.
- **wp-config.php, claves y sales**, usuarios de administración.
- **Tema y plugins instalados con su configuración** (los nombres pueden inferirse de los snapshots, la configuración no).
- Contenido en borrador o privado nunca publicado.
- Correos y formularios recibidos (si se guardaban en la BD del plugin de formularios).
- Analítica histórica alojada en el servidor (si la hubiera).

## 4. Riesgos de fidelidad

- Los snippets de buscador pueden recortar o parafrasear texto: todo lo marcado como "(parcial)" debe verificarse contra un snapshot antes de darlo por texto original.
- Los precios recuperados (395 €, 610 €) corresponden a la fecha de indexación, no necesariamente a la última versión de la web.
- Wayback Machine no captura páginas generadas por sesión (carrito, checkout, mi-cuenta) — su ausencia es normal y no indica pérdida adicional.

## 5. Bloqueos técnicos encontrados durante la auditoría (2026-08-12)

- web.archive.org rechazó conexiones desde la IP de salida de este entorno durante gran parte de la auditoría (rate-limit 429 en archive.org y resets de conexión); se emplearon rutas alternativas y reintentos programados.
- Common Crawl (2024-2026, 16 índices consultados): **0 capturas** del dominio.
- arquivo.pt: 0 capturas.
- archive.today: inaccesible desde este entorno.
- La caché pública de Google ya no existe (retirada en 2024), por lo que el índice de Google solo aporta títulos y snippets.


---

# ACTUALIZACIÓN FINAL (tras acceso a Wayback Machine)

## Cobertura real de Wayback Machine (definitiva)

El dominio tiene **solo 14 capturas en total** en Wayback, y **una única captura con contenido**: la home del 14-05-2024 (recuperada íntegra). El resto son: parking de Arsys (2018), redirecciones 301 (2021 → greencar.es; 2024 entre variantes) y errores 500 de robots.txt/favicon. **Ninguna página interior ni ninguna imagen fue archivada jamás.** Esto convierte los snippets de buscador en la única fuente de las descripciones de producto.

## Recuperado (ampliación)

- Home íntegra verbatim (texto, menú, footer, precios, OG, schema, H1-H3).
- Precios completos del catálogo a 14-05-2024 (15 productos).
- Stack técnico exacto y desarrollador (ConsulWeb).
- Nombres de archivo de las 13 imágenes de producto + 2 logos + icono.

## Definitivamente no recuperable de fuentes públicas

- HTML de las páginas interiores (fichas de producto, legales, sobre-nosotros, contacto, tienda, blog).
- Ficheros de imagen originales de /wp-content/uploads/ (404 en Wayback, 0 en índices, 0 en Common Crawl).
- Todo lo privado ya listado (BD WooCommerce, pedidos, clientes, configuración).
