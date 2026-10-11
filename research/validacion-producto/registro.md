# Registro de validación de producto

Registro compartido (ChatGPT / Claude). No borrar historial; añadir entradas con fecha.
Etiquetas: COMPROBADO · COMPROBADO-buscador (solo fragmento del buscador) · DECLARADO · ESTIMADO · HIPÓTESIS · PENDIENTE.

## Objetivo y restricciones

- Mercado: España peninsular. Idioma: español de España. Canal previsto: Meta Ads.
- Presupuesto máximo de la prueba: 500 € (muestras 60, tienda/dominio 50, publicidad 250, reserva 140). Costes incrementales de herramientas dentro de los 500 €.
- Exclusiones: alimentación, suplementos, cosmética, médico, seguridad, infantil, electrónica, baterías, falsificaciones, dudas de PI.
- La investigación no autoriza compras, contacto con proveedores, publicación ni campañas.

## Hechos de contexto (2026-10-11)

| Hecho | Estado | Fuente |
|---|---|---|
| Derecho aduanero de 3 € por partida en envíos ≤150 € desde fuera de la UE (1/7/2026–1/7/2028), con cualquier régimen de IVA | COMPROBADO | https://taxation-customs.ec.europa.eu/customs/eu-customs-reform_en · https://trade.ec.europa.eu/access-to-markets/en/news/eu-applies-eu3-customs-duty-item-low-value-e-commerce-consignments |
| Tasa de gestión de 2 € desde 1/11/2026 | COMPROBADO como anuncio; acto delegado PENDIENTE | ídem |
| GPSR (UE 2023/988): la ficha online debe identificar fabricante y persona responsable en la UE, imagen, identificador y advertencias | COMPROBADO | https://eur-lex.europa.eu/legal-content/ES/TXT/HTML/?uri=CELEX:32023R0988 |
| Desistimiento 14 días; reembolso incluye envío inicial; devolución a cargo del cliente solo si se le informó; garantía 3 años | COMPROBADO | https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555 |
| Stripe tarjeta estándar EEE 1,5 % + 0,25 € | COMPROBADO | https://stripe.com/es/pricing |
| Correos Paq Ligero intrapeninsular PVP: ≤500 g 7,56 €; ≤1 kg 10,61 €; ≤2 kg 12,64 € | COMPROBADO (folleto 2026) | https://www.pamplona.es/system/files/files-migrated/VARIOS/fas_correos_2026_peninsula_y_baleares.pdf |
| Dominio .es primer año 7,25 € IVA incl. (OVHcloud) | COMPROBADO | https://www.ovhcloud.com/es-es/domains/tld/es/ |
| Shopify Basic en EUR para España | PENDIENTE (web servida en USD) | https://www.shopify.com/es-es/precios |
| Tarifas CJdropshipping actuales | PENDIENTE (bloqueo anti-bot) | — |

## Candidatos

| ID | Producto | Estado | Confianza | Motivo principal | Fecha |
|---|---|---|---|---|---|
| P01 | Bolsas/cubos de compresión para maleta (sin bomba) | Descartado (para esta prueba) | Media | Mercantilizado en España (Action 3 uds 4,95 €; Amazon Basics ~12-14 €); Trends ES ≈0; temporada baja; margen est. ~7,5 € a 24,90 € | 2026-10-11 |
| P02 | Quitapelos textil/mascota sin batería | En investigación | — | — | 2026-10-11 |
| P03 | Organizador de maletero plegable | Descartado (para esta prueba) | Media | Precio ES 10-30 € (Action 9,99 € con nevera, Fortem ~25-30 €); voluminoso (~3 kg volumétricos); margen est. ≤5 € o negativo | 2026-10-11 |
| P04 | Funda magnética antiescarcha parabrisas | Descartado salvo pack | Baja | Amazon.es desde 8,99 € (COMPROBADO-buscador); temporada corta | 2026-10-11 |
| P05 | Limpiacristales magnético ajustable | Investigar con cautela | Baja | Demostración excelente; riesgo de incompatibilidad con grosor de cristal y devoluciones | 2026-10-11 |
| P06 | Funda hamaca impermeable para perros (asiento trasero) | En profundización | Baja | Precio ES 26-39 € (COMPROBADO-buscador) | 2026-10-11 |
| P07 | Alfombra olfativa para perros (pack) | En profundización | Baja | Buena demostración y logística; Amazon.es 11-29 € | 2026-10-11 |
| P08 | Kit banneton masa madre | Descartado (para esta prueba) | Baja | Contacto con alimentos (Reg. 1935/2004); nicho pequeño | 2026-10-11 |
| P09 | Burlete doble bajo puerta | Descartado | Media | Valor percibido 10-16 € (Leroy Merlin) | 2026-10-11 |
| P10 | Kit cepillos para taladro | Descartado | Media | Precio ES 9-14 €; requiere taladro | 2026-10-11 |

## Consumo de herramientas

| Fecha | Herramienta | Uso | Coste |
|---|---|---|---|
| 2026-10-11 | Apify (plan Starter, límite 30 $/mes) | Solo consultas de lectura a la API (cuenta, límites, catálogo). Ninguna ejecución | 0 $ |
| 2026-10-11 | Apify — estado del ciclo 17/9–16/10 | Gasto 29,98 $ de 30 $ (COMPROBADO); consumo previo por scrapers de Instagram ajenos a esta investigación | — |

## Decisiones

- 2026-10-11: No lanzar Apify en este ciclo (límite agotado). Ampliar límite a 40 $ queda en manos de Maikel.
- 2026-10-11: P01 y P03 descartados para esta prueba por margen y precio de referencia en España.

## Pendientes

- Precios reales de Amazon.es (bloqueado para acceso automatizado) → Apify `junglee/Amazon-crawler`.
- Anuncios activos en Meta (Ad Library requiere sesión) → Apify `apify/facebook-ads-scraper`.
- Cotización con almacén UE (CJ, BigBuy, Syncee requieren registro → autorización).

## Google Trends España, 5 años (COMPROBADO 2026-10-11; datos en `datos/trends-es-2026-10-11/`)

Interés relativo, no volumen. 0 = por debajo del umbral de Google. Ancla "funda coche perro" casi siempre 0: la normalización entre grupos es solo orientativa.

| Término | Media 5 a | Media 12 m | Pico típico | Tendencia 12 m |
|---|---|---|---|---|
| cama perro | 58,6 | 60,2 | dic (nov-ene) | +7 % |
| burlete puerta | 33,9 | 38,4 | nov | +26 % |
| quitapelusas | 27,6 | 23,8 | ene | −17 % |
| organizador armario | 19,1 | 20,4 | sep | +3 % |
| rascador gato | 16,9 | 15,2 | ago/dic | −1 % |
| fuente gato | 4,3 | 6,1 | jul | +83 % |
| packing cubes | 3,7 | 16,4 | irregular | fuerte subida en 2026 |
| cepillo taladro | 2,8 | 2,7 | ene-feb | +28 % |
| organizador maletero | 1,4 | 2,2 | oct/dic | base baja |
| funda coche perro, alfombra olfativa, bolsas de compresión, banneton, limpiacristales magnético, quita pelos perro | <1 | <1 | — | ruido |
| funda parabrisas, comedero lento perro | 0 | 0 | — | — |

Lectura: los candidatos P04-P07 tienen búsqueda casi nula en España; si se prueban, dependen de compra por descubrimiento (Meta), no de búsqueda. Esto no es ausencia de demanda, pero sí ausencia de una señal independiente que la confirme.
