# Barrido internacional de anuncios · oportunidades con poca presencia en España

Fecha: 2026-10-11 · Estado: **investigación previa, no es una validación**
Datos: [`datos/meta-ads-internacional-2026-10-11.csv`](datos/meta-ads-internacional-2026-10-11.csv) (982 anuncios depurados, sin imágenes ni enlaces firmados)

Etiquetas usadas: **COMPROBADO** · **DECLARADO POR TERCEROS** (texto de anuncio, tienda o prensa) · **ESTIMADO** · **HIPÓTESIS** · **PENDIENTE**.

**Avisos que valen para todo el informe:**
- Que un anuncio esté "activo" no demuestra que haya gasto continuo.
- La antigüedad de un anuncio no demuestra ventas ni beneficio.
- Muchas variantes no demuestran que la campaña escale.
- La fecha de inicio no garantiza que el anuncio haya estado activo sin interrupción.
- La Biblioteca de Anuncios y el Actor de Apify pueden tener cobertura incompleta.

---

## A. Resumen

### Cobertura realizada

**Barrido internacional:**
- EE. UU. y Reino Unido: 15 tipos de producto en inglés. Alemania: 10 tipos de producto en alemán.
- Solo anuncios activos, máximo 25 por búsqueda, con búsqueda por palabras sin orden.
- Resultado: 830 anuncios cobrados y 967 filas descargadas.

**Contraste en España:**
- 6 búsquedas en español sobre los 4 tipos de producto con señal en varias tiendas.
- Solo anuncios activos, máximo 15 por búsqueda.

**Lo que no se ha cubierto de lo que pedía el encargo, sin presentarlo como completo:**
- **Categorías nuevas por debajo de lo pedido:** solo 6 de las 25 búsquedas son categorías nuevas fuera de mascotas, viajes y organización (burlete, reclinatorio de jardín, soporte de plantas y cepillo de limpieza, más dos equivalentes en Alemania). Son el 24 %; el encargo pedía al menos un tercio.
- **Búsquedas por tienda o anunciante no realizadas.** Solo hubo búsquedas por producto.
- **Prueba pequeña:** no se hizo una prueba específica antes del barrido. Se reutilizó el mismo Actor y los mismos parámetros que se habían validado ese mismo día con una prueba de 5 anuncios (run `epL7cjmU9qp0MZgps`).
- **Comprobación manual:** se hizo con unas 60 filas impresas con texto, anunciante y destino. No se abrieron las fichas de los anuncios una por una.

### Coste de Apify (COMPROBADO, API de Apify)

| Run | Actor | Países | Parámetros | Registros | Coste |
|---|---|---|---|---|---|
| `6wnjV4d0DZqMpWP5W` (dataset `hOx7zujo4ggRguzWe`) | `apify/facebook-ads-scraper` | US, GB, DE | 40 URLs de la Biblioteca, activos, `resultsLimit` 25, tope de gasto 5 $ | 830 cobrados / 967 filas | 4,15 $ |
| `RqRBNJqz6uFO2Ehin` (dataset `lFBUp3qMhxdCIMATu`) | ídem | ES | 6 URLs, activos, `resultsLimit` 15, tope de gasto 0,80 $ | 19 cobrados / 20 filas | 0,095 $ |
| **Total del barrido** | | | | | **4,245 $** (tope 5 $) |

- **Gasto del ciclo de Apify:** pasó de 31,11 $ a 36,05 $ (+4,94 $). La diferencia con 4,245 $ puede ser uso de plataforma o las extracciones diarias de Instagram; es PENDIENTE de conciliar en la consola.
- **No se programó ningún gasto recurrente.**

### Limitaciones

- **Ruido en la búsqueda por palabras:** salen relatos, aplicaciones y anuncios de salud.
- **Cobertura de la Biblioteca:**
  - Para EE. UU. y Reino Unido, la Biblioteca solo muestra anuncios activos.
  - No hay datos de gasto ni de alcance de anuncios comerciales.
  - Hay un máximo de 25 anuncios por búsqueda.
- **Dominios del mismo grupo:** Tier-Herzen y Tierbedarf Pro comparten textos y productos, y se tratan como el mismo grupo. Pelsbarn opera en .de y en .org.

### Recomendación

**Ninguna oportunidad está lista para avanzar a una prueba.** Hay un único candidato a seguir investigando, con confianza baja: **P27, estante de ducha sin taladrar de diseño.** Lo anuncian tres tiendas alemanas independientes y no encontramos anuncios suyos en España con estas búsquedas. Su coste de proveedor y su margen están PENDIENTES.

El hallazgo más útil es otro: el **cesto rascador de cuerda para gatos** que se anuncia en EE. UU. y Reino Unido **ya se ha copiado en España en las últimas 3 semanas**, por al menos 4 tiendas. Una de ellas traduce el texto casi literalmente. **La ventana entre "se anuncia fuera" y "se copia aquí" puede ser de semanas.** Eso debilita la estrategia de importar lo que funciona fuera si no se tiene una ventaja propia.

---

## B. Tabla de oportunidades

| ID | Producto | Tiendas y países | Anuncios y fechas observadas | Oferta y precio | Evidencias independientes | Publicidad en España (búsquedas del 11/10) | Alternativas locales | Margen provisional | Confianza | Estado y siguiente acción |
|---|---|---|---|---|---|---|---|---|---|---|
| P27 | Estante de ducha **sin taladrar** (aluminio o acero lacado, adhesivo incluido), diseño minimalista | Designfabrik Hamburg, Metallbude y Nordesign (DE; 3 dominios distintos) | Designfabrik: 15 anuncios y 36 variantes, el más antiguo del 23/04/2026 (ad 888159084314577, desde 02/06/2026). Metallbude: desde 02/07/2026 (ad 1857870868901919, desde 21/09). Nordesign: set de ducha de 2 piezas desde 06/10/2026 | Designfabrik: desde 39,99 € en negro, envío gratis desde 35 € en DE. Metallbude SHEA: 85 € IVA incl., 30/50 cm, 0,5/0,7 kg, carga 5/7 kg, adhesivo incluido (COMPROBADO en web) | Designfabrik: 4,9 con 1.454 reseñas. Metallbude: 4,93 con 383 reseñas (DECLARADO por la tienda) | "estante ducha sin taladrar" y "repisa ducha": **sin anuncios relevantes encontrados** | Leroy Merlin, especiero o estante adhesivo de acero inoxidable, pack de 2: 22,58 €. ManoMano: aluminio de esquina a 16,99 €; inoxidable negro, pack de 2: 58,92 €. Leroy con espejo: 47,99 € (oferta antigua). Marca tesa Aluxx en el mercado español (todo COMPROBADO-buscador o DECLARADO) | **PENDIENTE** (coste de proveedor no comprobado). Escenario a 39,90 € con coste puesto ≤10 €: ~12,6 € (ESTIMADO) | Baja | **Investigar.** Comprobar el coste de proveedor y de envío; leer reseñas negativas sobre el adhesivo |
| P28 | Cesto o cama rascador de cuerda tejida para gatos | Stimulicat (US/GB), Celery Pets (US), Marlene's Pet Shop (US, un rascador parecido) | Stimulicat: 27 anuncios y 38 variantes desde 28/05/2026 (ad 27790013610601196). Celery Pets: desde 14/06/2026 (ad 1336647495079015) | Precio PENDIENTE en EE. UU. En España, Vittasa "Nidora": "a partir de 49,99 €" (COMPROBADO en web; el precio mostrado es confuso) | Ninguna fuera de los anuncios | **Sí: producto exacto** en Vittasa (9 anuncios desde 20/09/2026, texto traducido de Stimulicat), Silenxio (29/09), Alynoa (30/09) y Más que Mascotas/biocarepet (05/10) | Rascadores en IKEA y Action desde 2,99–5,99 € (ronda anterior) | No calculado | Media | **Descartado como arbitraje:** el producto ya está en España con competencia |
| P29 | Reclinatorio o asiento de jardín 2 en 1 con acolchado | Aimerla (US, una sola tienda) | 25 anuncios y 44 variantes; el más antiguo del 11/12/2024 (ad 580361241590330) | Precio no visible en la landing (PENDIENTE); "hasta 60 % de descuento", "garantía de por vida", devolución en 99 días (DECLARADO) | "157.000 clientes" y "6.361 reseñas de 5★" (DECLARADO por el anunciante, sin verificar) | "reclinatorio jardín": **sin anuncios relevantes encontrados** | PENDIENTE: la búsqueda web no encontró oferta local equivalente | PENDIENTE; producto voluminoso (~2–3 kg, ESTIMADO) | Baja | **Aplazado a primavera.** El anuncio dice "patented design": revisar propiedad intelectual |
| P30 | Organizador de fregadero de acero inoxidable de diseño (set de 8 piezas) | Nordesign (DE, una tienda + influencer) | Desde 21/05/2026; ads 1540427067371900 y 1561238218616722 | PENDIENTE | Ninguna | "organizador fregadero": **sin anuncios relevantes encontrados** | IKEA y Amazon con organizadores baratos (HIPÓTESIS, no comprobado) | PENDIENTE | Baja | Investigar solo si P27 avanza (mismo comprador) |
| — | Funda de coche de fondo rígido para perro | Team K9, PetsVet Supply, Epic Companion, RUFF Liners (US) | Desde 13/11/2025 (Team K9) | — | — | **Sí:** vigoshop.es y Bonotienda_Es (barrido anterior) | Tiendanimal 17,50–39,99 € | — | Media | Descartado: ya se anuncia en España |
| — | Guante quitapelos de mascota | PurePath (US/GB; 15 anuncios y 46 variantes) | Desde 22/03/2026 | — | — | **Sí:** PurePath y CurlZip anuncian en España | Zooplus y AliExpress a 3–7 € | — | Media | Descartado |
| — | Bolsa de cabina con compresión | Overpackbag (US/GB) | Desde 15/05/2026 | — | — | — | — | — | — | **Excluido:** lleva bomba eléctrica y batería USB-C |
| — | Burlete doble para puerta | Cozy Hoome (US/GB) | Desde 23/04/2025 | — | — | No buscado de nuevo | Leroy Merlin 1,57–16,33 € (ronda anterior) | — | Media | Descartado (precio local muy bajo, P09) |
| — | Rascador de sisal de pared o alfombra | Tier-Herzen / Tierbedarf Pro (DE, mismo grupo) | Desde 26/07/2024 | — | — | No buscado | IKEA 5,99 €, Action 2,99 € | — | Media | Descartado (P23) |
| — | Cama de coche para perro de tejido teddy | Pelsbarn (DE/US, una empresa) | Desde 27/07/2026 | — | — | **No buscado** (tope de gasto) | PENDIENTE | — | Baja | PENDIENTE. Ojo: usa ángulos de "ansiedad" y "seguridad" |

---

## C. Finalistas

**Solo uno merece seguir investigando**, y todavía no merece una prueba.

### P27 · Estante de ducha sin taladrar, de diseño

- **Producto y comprador:**
  - Estante de aluminio o acero lacado (negro o blanco mate), de 30–50 cm, con adhesivo incluido.
  - Comprador: inquilino o propietario reciente que quiere orden en la ducha sin hacer agujeros en el azulejo y sin perder la fianza.
  - Que el alquiler sea un problema relevante en España es HIPÓTESIS: falta un dato oficial sobre el porcentaje de hogares en alquiler.
- **Oferta internacional que merece estudiar:**
  - **Designfabrik Hamburg:** ángulo "Bohren nervt" (taladrar es un fastidio; agujeros, polvo, problemas con el casero), descuento para nuevos clientes y envío gratis.
  - **Metallbude:** posicionamiento premium a 85 € con medidas y carga declaradas.
  - **Nordesign:** sets coordinados de ducha y fregadero, con creadoras de contenido.
- **Adaptación para España:**
  - Ángulo "apto para pisos de alquiler", demostración de la instalación en 2 minutos y prueba de carga en vídeo.
  - Set coordinado (estante + escurridor o dispensador) para subir el ticket.
- **Diferenciación frente a lo local:**
  - Frente a los modelos baratos (17–23 €): diseño, carga declarada y comprobada, adhesivo de marca y garantía de sujeción.
  - Frente a tesa: estética y set coordinado.
  - **Débil si el cliente compara en ManoMano o Amazon.**
- **Proveedor y costes pendientes:**
  - No se encontró un listado mayorista comprobado; la búsqueda devolvió minoristas.
  - En Walmart hay estantes adhesivos negros de 7,02–13,69 $ (COMPROBADO-buscador), lo que sugiere un coste de fábrica bajo (HIPÓTESIS).
  - Pendientes: proveedor con adhesivo de calidad conocida (por ejemplo 3M VHB o equivalente), pedido mínimo, envío a España, datos GPSR y coste de muestra.
- **Margen provisional (ESTIMADO, viabilidad PENDIENTE):**
  - Supuestos: precio 39,90 € IVA incl. (32,98 € sin IVA); Stripe 0,85 €; coste puesto ≤10 € (supuesto, no cotizado); envío nacional 5,50 €; embalaje 0,50 €; 10 % de devoluciones sin recuperar producto.
  - Resultado: **~12,6 €** de margen antes de publicidad, que es el CPA de equilibrio.
  - CPA objetivo: ~7,6 €, dejando 5 € de contribución.
  - A 49,90 € (set de 2) con coste de 16 €: ~16 €.
- **Riesgos:**
  - Que el adhesivo falle: caen botellas o se daña el azulejo, con reclamaciones y devoluciones.
  - Superficies no aptas (pintura, azulejo poroso).
  - Humedad y cal.
  - Copias rápidas, como ha pasado con P28.
  - Obligaciones GPSR: instrucciones y advertencias de carga en español.
- **Argumento más fuerte a favor:** tres tiendas alemanas independientes anuncian este producto con meses de actividad y miles de reseñas declaradas. El problema (no taladrar) se entiende sin explicación y se demuestra bien en vídeo.
- **Argumento más fuerte en contra:** el producto ya existe en España a 17–23 € y con marca (tesa). Que no haya anuncios en Meta no significa que no haya oferta, y el ángulo premium alemán puede no trasladarse a un precio de 40 € en España.
- **Supuesto invalidante:** que un comprador español pague ≥39,90 € por diseño cuando hay alternativas funcionales a 17–23 €.
- **Evidencia que cambiaría la recomendación:**
  - Un proveedor con adhesivo probado y coste puesto ≤8 €.
  - Reseñas españolas que muestren quejas de fallo del adhesivo en las versiones baratas, lo que daría espacio a la diferenciación.
  - Anuncios de este producto en España en una búsqueda más amplia (lo debilitaría).
- **Siguiente comprobación más barata (0 €):**
  1. Leer 50 reseñas negativas de estantes adhesivos en Amazon.es y ManoMano.
  2. Buscar el mismo modelo con búsqueda visual en AliExpress o Alibaba para conocer el coste.
  3. Hacer 3 búsquedas más en la Biblioteca para España con sinónimos: "estantería baño sin agujeros", "cesta ducha adhesiva", "baño de alquiler". Coste aproximado 0,05 $, que requeriría ampliar el tope.

---

## D. Descartes

| Producto | Motivo | Evidencia | Qué tendría que cambiar |
|---|---|---|---|
| P28 cesto rascador de cuerda | Ya está en España: al menos 4 tiendas lo anuncian desde el 20/09/2026. Además usa alegaciones de bienestar ("lima las uñas de forma natural") a evitar | Anuncios de Vittasa, Silenxio, Alynoa y Más que Mascotas (COMPROBADO vía Apify, run `RqRBNJqz6uFO2Ehin`) | Que las tiendas españolas dejen de anunciarlo tras unas semanas (señal de que no funcionó) o tener un proveedor exclusivo con calidad claramente superior |
| Funda de coche de fondo rígido para perro | Ya se anuncia en España | vigoshop.es, Bonotienda_Es (barrido anterior) | Un proveedor UE barato y una diferenciación real (ver P06) |
| Guante quitapelos | Ya se anuncia en España y es muy barato | PurePath y CurlZip en España | — |
| Bolsa de cabina con compresión | Excluida por llevar batería y bomba eléctrica | Texto del anuncio: "Built-in electric pump", "USB-C rechargeable" | Ampliar las exclusiones en una prueba futura |
| Burlete y rascador de sisal de pared | Precio local muy bajo (rondas anteriores) | Leroy Merlin, IKEA, Action | — |
| P29 reclinatorio de jardín (aplazado, no descartado) | Una sola tienda; "diseño patentado" en el anuncio; estacional; voluminoso | Anuncios de Aimerla desde 11/12/2024 | Comprobar la patente y la oferta local; reconsiderar en febrero o marzo |

---

## Herramientas

- **Biblioteca de Anuncios de Meta (API oficial):** gratuita, pero la cuenta de Maikel necesita completar la verificación de identidad. Probado el 11/10: error 2332002. Aporta lo mismo que el Actor de Apify, pero sin coste. Limitación: para anuncios no políticos solo cubre anuncios entregados en la UE.
- **No se proponen herramientas nuevas de pago.** El cuello de botella no es la herramienta, sino el coste de proveedor y la demanda en España, y eso se resuelve con cotizaciones (requieren autorización) y lectura de reseñas.
