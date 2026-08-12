# SEO — estructura técnica detectada

Fecha: 2026-08-12

## Arquitectura de URLs

- Productos: `/producto/{slug}/` — base WooCommerce en español (`producto`).
- Tienda: `/tienda/` con paginación `/tienda/page/N/` (permalink shop estándar de WooCommerce + WordPress).
- Páginas: slugs planos (`/contacto/`, `/sobre-nosotros/`, `/carros-de-golf/`, `/blog/`).
- Sin extensiones ni parámetros: permalinks "postname".
- El slug `/inicio-2/` y el sufijo `-copia` en un producto delatan duplicados creados en el editor (típico de constructores tipo Elementor/Divi y de duplicar productos en WooCommerce).

## Patrón de titles

- `{Nombre} | Carros Eléctricos de Golf - Greencar` (mayoría)
- `{Nombre} - Carros Eléctricos de Golf - Greencar` (algunas páginas)
- `{Nombre} | GREENCAR - Carros Eléctricos de Golf` (sobre-nosotros)

La coexistencia de separadores `|` y `-` sugiere plugin SEO (Yoast/Rank Math) con plantillas por tipo de contenido, o titles manuales.

## Señales de plataforma (evidencias)

| Evidencia | Conclusión |
|---|---|
| `/producto/`, `/tienda/page/2/` | WordPress + WooCommerce en español |
| Referencias a `/wp-content/` en resultados | WordPress confirmado |
| `/inicio-2/`, slug `...-copia` | uso de constructor de páginas / duplicación de contenido |
| Cláusula RGPD estándar en formulario | plugin de formularios (Contact Form 7 / WPForms / Forminator) con texto legal español |
| Precios "desde 395,00 €" | formato de precio europeo con coma — WooCommerce configurado para España/EUR |

## Pendiente de recuperar (requiere snapshots de Wayback)

- robots.txt y sitemap XML originales.
- Canonicals (confirmar dominio canónico www/sin-www).
- Schema.org (WooCommerce emite `Product`, `Offer`, `BreadcrumbList`; el plugin SEO añade `Organization`/`WebSite`).
- Open Graph y Twitter Cards.
- H1/H2 por página y textos ALT.
- Nombre exacto del theme y plugins (visible en rutas CSS/JS de cualquier snapshot HTML).
