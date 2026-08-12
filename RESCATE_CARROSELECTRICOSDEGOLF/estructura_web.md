# Estructura reconstruida — carroselectricosdegolf.com

Fecha: 2026-08-12
Fuentes: snapshot íntegro de la home en Wayback Machine (14-05-2024) + índices de Google/DuckDuckGo (estado 2025-26).
Leyenda: ✅ confirmado · ⚠️ inferido.

## Plataforma técnica (confirmada por el HTML archivado)

| Componente | Valor |
|---|---|
| CMS | WordPress |
| Ecommerce | **WooCommerce** |
| Constructor | **Elementor** + **Pro Elements** (fork GPL de Elementor Pro: loop builder, nav menu, widgets WooCommerce) |
| Theme | **Hello Elementor** con **child theme** (`/wp-content/themes/child/`) |
| SEO | **Yoast SEO** (schema @graph WebPage/WebSite/Organization, robots meta `index, follow, max-image-preview:large…`) |
| Desarrollador | **ConsulWeb** (https://www.consulweb.net/) — crédito «by ConsulWeb» en el footer |
| Hosting/registrador | Arsys (IP 217.76.142.212, NS servidoresdns.net, registrador NICLINE/Arsys) |
| Idioma | es_ES |

## Cronología del dominio

| Fecha | Estado |
|---|---|
| 2016-11-25 | Registro del dominio (Arsys/NICLINE) |
| 2018-08 | Página de parking de Arsys (capturada por Wayback) |
| 2021-11 | Redirección 301 → greencar.es |
| 2023-12-13 | Publicación de la home de la tienda WooCommerce (fecha Yoast) |
| 2024-04-24 | Última modificación de la home registrada |
| 2024-05-14 | Única captura de contenido en Wayback |
| 2024-2026 | Evolución posterior: se añaden /blog/, /carros-de-golf/, variantes de color del Pro Sport (solo constan en índices de buscadores) |
| 2026 | Baja del hosting: 503 + certificado inválido (dominio y DNS siguen activos; expira 2029-11-25) |

## Dominio canónico (confirmado)

**https://carroselectricosdegolf.com/** (https, sin www).
Redirecciones capturadas el 14-05-2024: `http://` → 301 → https; `https://www.` → 301 → https sin www. Canonical de Yoast: `https://carroselectricosdegolf.com/`.

## Menú principal (verbatim de la home archivada, may-2024)

**Inicio · Sobre nosotros · Tienda · Contacto** (+ carrito WooCommerce con total y enlace a Mi cuenta)

## Mapa del sitio

```
carroselectricosdegolf.com/
├── / ......................................... Home ✅ (recuperada íntegra)
├── /sobre-nosotros/ .......................... ✅ menú
├── /tienda/ .................................. ✅ menú (shop WooCommerce)
│   └── /tienda/page/2/ ....................... ✅ índices 2026
├── /contacto/ ................................ ✅ menú
├── /mi-cuenta/ ............................... ✅ cabecera
├── /producto/ (15 productos confirmados)
│   ├── Carros:
│   │   ├── greencaddy-pro-sport/ ............. ✅ 379–610 €
│   │   ├── greencady-pro/ .................... ✅ 379–610 € (solo en home 2024)
│   │   ├── greencaddy-classic/ ............... ✅ 379–610 €
│   │   ├── greencaddy-superior/ .............. ✅ 599–805 €
│   │   ├── greencaddy-pro-sport-blanco-rojo/ . ✅ (índices 2026, posterior a may-2024)
│   │   └── greencaddy-pro-sport-blanco-amarillo-copia/ ✅ (ídem)
│   ├── Baterías:
│   │   ├── bateria-de-litio-sin-cargador/ .... ✅ 180 €
│   │   ├── bateria-de-litio-con-cargador/ .... ✅ 210 €
│   │   └── cargador-de-bateria-de-litio/ ..... ✅ 45 €
│   └── Accesorios:
│       ├── portaparaguas/ .................... ✅ 25 €
│       ├── portatarjetas-y-portabolas/ ....... ✅ 25 €
│       ├── kit-portaparaguas-portatarjetas-y-portabolas/ ✅ 45 €
│       ├── soporte-movil-o-gps/ .............. ✅ 25 €
│       ├── funda-de-viaje/ ................... ✅ 25 €
│       └── rueda-maciza/ ..................... ✅ 49,50 €
├── /carros-de-golf/ .......................... ✅ índices 2026 (landing añadida tras may-2024)
├── /blog/ .................................... ✅ índices 2026 (añadido tras may-2024; sin artículos localizados)
├── /inicio-2/ ................................ ✅ índices 2026 (duplicado Elementor)
└── Footer legal:
    ├── /aviso-legal/ ......................... ✅ footer
    ├── /terminos-y-condiciones/ .............. ✅ footer
    ├── /condiciones-generales-de-venta/ ...... ✅ footer
    ├── /politica-de-privacidad/ .............. ✅ footer
    └── /politica-de-cookies/ ................. ✅ footer (+ botón «Ajustar Cookies» ⇒ plugin banner cookies)
```

## Estructura de la home (secciones, verbatim)

1. Hero H1 «La comodidad en el Golf es una realidad» + cinta «Colección Greencaddy 2024»
2. H2 **Carros** (texto marca + 4 tarjetas de producto con rango de precio y CTA «Descubrir →»)
3. H2 **Baterías** (3 tarjetas)
4. H2 **Accesorios** (6 tarjetas)
5. H2 **¿Nuestra filosofía?** (garantía 3 años, 1 año baterías)
6. H2 **Nosotros** (4 valores: Durabilidad y Fiabilidad · Facilidad de uso · Estilo y acabados · Calidad-Precio)
7. Bloques: Facilidades de compra (horario L-J 8–17:30, V 8–14) · Devoluciones flexibles (15 días) · Atención al cliente
8. Footer: logo blanco · © 2024 · by ConsulWeb · navegación · 5 enlaces legales

## Categorización del ecommerce

La home organizaba el catálogo en 3 grupos: **Carros · Baterías · Accesorios** (⇒ categorías WooCommerce probables). La navegación de compra pasaba por /tienda/ y las tarjetas Elementor de la home. ⚠️ No consta ninguna URL `/categoria-producto/` indexada.

## Footer (verbatim)

Greencar © 2024 · by ConsulWeb · Inicio · Sobre nosotros · Contacto · Aviso legal · Términos y condiciones · Condiciones generales de venta · Política de privacidad · Política de cookies · «→ Ajustar Cookies»

## Ecosistema

- **greencar.es** (Squarespace, VIVO): corporativo. En 2021-2023 el dominio de la tienda redirigía ahí; tras el lanzamiento de la tienda, greencar.es enlazaba a `https://www.carroselectricosdegolf.com/`.
- Redes: facebook.com/GreencarSL · Instagram @greencarsl.
- Google Business: 4,9/5 (61 reseñas) · Pol. Can Jardí, C/ Compositor Vivaldi 13, 08191 Rubí (Barcelona) · 935 860 416.
