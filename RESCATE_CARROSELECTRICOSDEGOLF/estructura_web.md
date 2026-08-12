# Estructura reconstruida — carroselectricosdegolf.com

Fecha: 2026-08-12 · Estado: reconstrucción a partir de índices de buscadores (pendiente de contraste con Wayback Machine).
Leyenda: ✅ URL confirmada en índices · ⚠️ inferida (no confirmada todavía).

## Plataforma

- WordPress + WooCommerce (confirmado por los patrones de URL `/producto/`, `/tienda/`, `/tienda/page/2/` y referencias a `/wp-content/`).
- Dominio canónico observado en los índices: **https://carroselectricosdegolf.com/** (sin www). El sitio hermano greencar.es enlazaba a la variante con www (`https://www.carroselectricosdegolf.com/`), por lo que existía redirección entre variantes. Pendiente de confirmar con canonicals de Wayback.

## Mapa del sitio reconstruido

```
carroselectricosdegolf.com/
├── / ..................................... Home ✅
├── /inicio-2/ ............................ Duplicado/borrador de home (constructor) ✅
├── /tienda/ .............................. Tienda WooCommerce (shop) ✅
│   └── /tienda/page/2/ ................... Paginación 2 ✅  ⇒ catálogo > 1 página
├── /carros-de-golf/ ...................... Landing/categoría "Carros de golf" ✅
├── /producto/ ............................ Fichas de producto WooCommerce
│   ├── greencaddy-classic/ ............... Carro Greencaddy Classic ✅
│   ├── greencaddy-superior/ .............. Carro Greencaddy Superior ✅
│   ├── greencaddy-pro-sport/ ............. Carro Greencaddy Pro Sport ✅
│   ├── greencaddy-pro-sport-blanco-rojo/ . Variante color ✅
│   ├── greencaddy-pro-sport-blanco-amarillo-copia/  Variante color ✅
│   ├── bateria-de-litio-sin-cargador/ .... Batería litio 12V 20Ah ✅
│   ├── cargador-de-bateria-de-litio/ ..... Cargador litio (Anderson) ✅
│   ├── rueda-maciza/ ..................... Rueda maciza ✅
│   ├── portatarjetas-y-portabolas/ ....... Accesorio ✅
│   ├── soporte-movil-o-gps/ .............. Accesorio ✅
│   └── funda-de-viaje/ ................... Accesorio ✅
├── /sobre-nosotros/ ...................... Página corporativa ✅
├── /contacto/ ............................ Contacto (formulario con cláusula RGPD) ✅
├── /blog/ ................................ Blog ✅ (artículos individuales sin localizar)
├── /aviso-legal/ ......................... ⚠️ referenciada en el texto del formulario de contacto
├── /politica-de-privacidad/ .............. ⚠️ referenciada en el texto del formulario de contacto
├── /politica-de-cookies/ ................. ⚠️ habitual en WP con banner de cookies
├── /carrito/ /finalizar-compra/ /mi-cuenta/ ⚠️ páginas estándar WooCommerce (no indexables)
└── /wp-content/uploads/... ............... Imágenes de producto (ninguna URL concreta indexada)
```

## Menú principal (inferido de los títulos y páginas existentes)

⚠️ Estructura probable: Inicio · Carros de golf · Tienda · Accesorios(?) · Sobre nosotros · Blog · Contacto

## Categorías de catálogo detectadas

1. **Carros de golf** (landing propia `/carros-de-golf/`): Greencaddy Classic, Superior, Pro Sport (+2 variantes de color publicadas como productos).
2. **Accesorios/recambios** (sin URL de categoría confirmada): batería, cargador, rueda maciza, portatarjetas y portabolas, soporte móvil/GPS, funda de viaje.

## Footer (inferido)

⚠️ Contacto (email/teléfono), enlaces legales (aviso legal, privacidad, cookies), datos de GREENCAR S.L.

## Relación con el ecosistema Greencar

- **greencar.es** (Squarespace, VIVO): sitio corporativo — historia, fabricación, servicios, FAQ, blog corporativo, condiciones. Enlazaba a `www.carroselectricosdegolf.com` como "tienda online".
- greencar.es tuvo su propia tienda Squarespace (`/tienda/p/...`, aún indexada en Google) que ya no existe; la tienda activa era carroselectricosdegolf.com.
- Redes: Facebook facebook.com/GreencarSL · Instagram @greencarsl.
- Ficha Google Business: 4,9/5 (61 reseñas), Pol. Can Jardí, C/ Compositor Vivaldi 13, Rubí (Barcelona), tel. 935 860 416.
