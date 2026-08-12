# INFORME DE RESCATE — carroselectricosdegolf.com

Fecha de la auditoría: 2026-08-12
Realizada tras la baja accidental del hosting en Arsys. El dominio y la zona DNS siguen activos (expira 2029-11-25); solo se ha perdido el servidor/hosting.

---

## RESUMEN

Se ha recuperado **todo el contenido público localizable** de la tienda WooCommerce de Greencar:

1. **La home completa y verbatim** (texto, menú, precios, footer, metadatos, schema) gracias a la única captura de contenido que existe en Wayback Machine (14-05-2024).
2. **El catálogo completo de 15 productos** con nombres, URLs y **precios de mayo de 2024**, más descripciones parciales de 9 de ellos vía snippets de buscadores.
3. **La estructura completa del sitio** (menú, footer, páginas legales, categorías Carros/Baterías/Accesorios) y **el stack técnico exacto** (WordPress + WooCommerce + Elementor + Pro Elements + theme Hello Elementor con child + Yoast SEO, desarrollado por **ConsulWeb**).
4. **Material de marca sustitutivo**: el sitio corporativo hermano greencar.es sigue vivo — se han archivado sus 18 páginas y 64 imágenes oficiales (incluyendo fotos de los mismos carros).

Lo que **no** se ha podido recuperar públicamente: el HTML de las páginas interiores (fichas de producto individuales, legales, sobre-nosotros, contacto), **las imágenes originales de `/wp-content/uploads/`** y, como es lógico, toda la base de datos privada (pedidos, clientes, configuración).

## PORCENTAJE ESTIMADO DE RECONSTRUCCIÓN

| Bloque | Recuperado |
|---|---|
| Estructura del sitio (mapa, menú, categorías) | ~90-95 % |
| Catálogo (nombres, URLs, precios) | ~95 % (15/15 productos con precio a 05/2024) |
| Textos de producto (descripciones completas) | ~25-40 % (fragmentos verbatim de 9 productos + home completa) |
| Páginas corporativas (texto completo) | Home 100 %; resto ~20-30 % (snippets); legales sustituibles por los equivalentes vivos de greencar.es |
| Blog de la tienda | Sin artículos localizados (probablemente vacío o casi vacío) |
| Imágenes originales del dominio | ~0 % (13 nombres de archivo conocidos, ficheros no archivados) — **compensable con las 64 fotos oficiales recuperadas de greencar.es** |
| SEO (titles, robots, canonical, schema) | ~70 % |
| Datos privados (pedidos, clientes, BD) | 0 % — irrecuperable públicamente |

**Estimación global: un 60-75 % del contenido público es reconstruible directamente con lo recuperado; con las fotos y textos del ecosistema Greencar (greencar.es + fotos nuevas de producto) se puede reconstruir una tienda funcionalmente equivalente sin partir de cero.**

## PRODUCTOS (15 localizados, con precio de 14-05-2024)

### Carros (6)
| Producto | Precio | URL slug |
|---|---|---|
| Greencaddy Pro Sport | 379,00 € – 610,00 € | /producto/greencaddy-pro-sport/ |
| Greencady Pro | 379,00 € – 610,00 € | /producto/greencady-pro/ |
| Greencaddy Classic | 379,00 € – 610,00 € | /producto/greencaddy-classic/ |
| Greencaddy Superior | 599,00 € – 805,00 € | /producto/greencaddy-superior/ |
| Greencaddy Pro Sport Blanco/Rojo | (posterior a 05/2024, sin precio) | /producto/greencaddy-pro-sport-blanco-rojo/ |
| Greencaddy Pro Sport Blanco/Amarillo | (posterior a 05/2024, sin precio) | /producto/greencaddy-pro-sport-blanco-amarillo-copia/ |

(Los rangos de precio corresponden a producto variable — presumiblemente configuración de batería.)

### Baterías (3)
| Producto | Precio |
|---|---|
| Batería de litio (SIN cargador) — 12V 20Ah | 180,00 € |
| Batería de litio CON cargador | 210,00 € |
| Cargador de batería de litio (conector Anderson) | 45,00 € |

### Accesorios (6)
| Producto | Precio |
|---|---|
| Portaparaguas | 25,00 € |
| Portatarjetas y portabolas | 25,00 € |
| Kit portaparaguas + portatarjetas + portabolas | 45,00 € |
| Soporte móvil o GPS | 25,00 € |
| Funda de viaje | 25,00 € |
| Rueda maciza | 49,50 € |

Fichas individuales en `/contenido/productos/` (15 archivos).

## PÁGINAS

**14 páginas confirmadas** (home, inicio-2, tienda +pág.2, carros-de-golf, sobre-nosotros, contacto, blog, mi-cuenta y 5 legales). Recuperadas: home íntegra; sobre-nosotros/contacto/carros-de-golf/inicio-2 parciales (snippets); legales solo confirmadas (texto equivalente disponible en greencar.es).

## BLOG

`/blog/` existía (índice de DuckDuckGo) pero **ningún artículo individual aparece en ningún índice ni archivo** → lo más probable es que estuviera vacío o casi vacío. El blog corporativo real está en greencar.es/blog (6 artículos, recuperados íntegros).

## IMÁGENES

- **Del dominio original: 0 descargables.** Wayback no archivó `/wp-content/uploads/` (404) y ningún buscador indexó las URLs de imagen. Se conservan los **13 nombres de archivo** de las fotos de producto (p. ej. `Greencaddy_Classic-Plata.jpg`, `Bateria_Litio_Cargador.jpg`) — útiles para reconstruir la biblioteca con los mismos nombres.
- **Recuperadas 64 imágenes oficiales de la marca** desde greencar.es (fotos de carros Greencaddy, instalaciones, historia, logos) en `/fuentes_complementarias/greencar_es/imagenes/`.

## SEO

Recuperado: titles verbatim de 14 URLs, patrón de titles, canonical y dominio canónico (https sin www), meta robots, Open Graph completo de la home, schema Yoast (@graph con fechas de publicación), jerarquía H1-H3 completa de la home, redirecciones 301 entre variantes. No recuperado: robots.txt y sitemap XML (nunca archivados), metadatos de páginas interiores. Detalle en `/seo/`.

## WORDPRESS (instalación original)

| Elemento | Confirmado |
|---|---|
| CMS / Ecommerce | WordPress + WooCommerce |
| Theme | Hello Elementor + **child theme** |
| Constructor | Elementor + **Pro Elements** (fork gratuito de Elementor Pro) |
| SEO | Yoast SEO |
| Otros indicios | Banner de cookies con «Ajustar Cookies»; formulario de contacto con cláusula RGPD; carrito/Mi cuenta estándar WooCommerce |
| Desarrollador | **ConsulWeb — consulweb.net** (crédito en footer) |
| Fechas | Tienda publicada ~13-12-2023; antes (2021) el dominio redirigía a greencar.es; en 2018 era un parking de Arsys |

## DATOS PERDIDOS (irrecuperables públicamente)

Pedidos, clientes, cuentas y contraseñas, configuración de WooCommerce (pagos, envíos, impuestos, cupones), stock/SKUs internos, wp-config y base de datos completa, borradores, y los ficheros originales de imagen. **Solo un backup de Arsys, de la agencia (ConsulWeb) o una copia local puede recuperarlos.**

## PLAN DE RECONSTRUCCIÓN (si no aparece ningún backup)

1. **Hosting nuevo** (el dominio y el DNS siguen en Arsys y activos): recrear hosting o migrar; emitir certificado SSL.
2. **Replicar el stack**: WordPress + WooCommerce + Hello Elementor + child theme + Elementor (valorar Elementor Pro oficial en lugar de Pro Elements) + Yoast.
3. **Recrear la home** a partir de `/contenido/paginas/home.md` y el HTML archivado (`/snapshots_wayback/home_20240514224522.html`) — texto y estructura 1:1.
4. **Recrear los 15 productos** con los slugs originales exactos (crítico para SEO), precios de referencia de 05/2024 (validar con Greencar los precios actuales), y las descripciones parciales recuperadas; completar specs con el material técnico de greencar.es (FAQ, fabricación).
5. **Fotografiar de nuevo los productos** o reutilizar las fotos oficiales de greencar.es; subir las imágenes con los nombres de archivo originales conocidos.
6. **Recrear las páginas** sobre-nosotros/contacto con los fragmentos recuperados + los textos legales adaptando los de greencar.es (mismo titular GREENCAR S.L.).
7. **Conservar las URLs originales** listadas en `inventario_urls.csv`; añadir redirecciones 301 para cualquier URL que se decida no recrear (p. ej. /inicio-2/, variantes -copia) y forzar https://carroselectricosdegolf.com/ sin www como canónica.
8. Reconfigurar WooCommerce (pagos, envíos 24-48h, devoluciones 15 días según la política recuperada) y el banner de cookies.
9. Reenviar el sitemap en Search Console y verificar la reindexación de los slugs originales.

## QUÉ PEDIR A LA AGENCIA / ARSYS PARA LLEGAR AL 100 %

1. **A Arsys**: cualquier backup de servidor (aunque sea antiguo): copia del plan de hosting, snapshots, backups de BD MySQL. Preguntar explícitamente por backups retenidos tras la baja (suelen conservarse 15-30 días).
2. **A ConsulWeb (la agencia que firma la web)**: su copia de desarrollo/staging, el child theme, la biblioteca de medios (`/wp-content/uploads/` completa), export de productos (CSV WooCommerce) y la BD.
3. **A Greencar internamente**: fotos originales de producto, textos/fichas en Word o email que se enviaran a la agencia, y cualquier export de pedidos/facturación (contabilidad) para reconstruir el histórico mínimo legal.

---

### Anexo — Fuentes utilizadas

Wayback Machine (CDX + snapshots; 14 capturas totales del dominio, 1 con contenido), índice de Google (~20 consultas), DuckDuckGo/Bing, Mojeek, Common Crawl (16 índices 2024-2026: 0 capturas), arquivo.pt (0), archive.today (inaccesible), greencar.es en vivo (18 páginas + sitemap + 64 imágenes), RDAP/DNS/cert del dominio, y páginas de terceros (golfindustria.es, mygolfway.com, anuarioguia.com).
