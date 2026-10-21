# Evaluación económica · e-commerce como diversificación

Fecha: 2026-10-21 · Encargo del Chief of Staff de Qualivo para la revisión mensual del 2-nov · **Solo análisis: no se ha comprado, lanzado ni contactado nada.**

Etiquetas: **[DATO]** con fuente · **[EST]** estimación con supuestos explícitos · **[HIP]** hipótesis sin datos.
Base: la investigación del 11 al 16 de octubre en esta rama (`registro.md`, `barrido-internacional-2026-10-11.md`, `funnel-viajar-con-perro/`). No he encontrado la sesión de agosto "Productos dropshipping con margen alto" en las 30 sesiones más recientes de la cuenta, así que no está incorporada.

## Recomendación

**Aparcar.** Con los mejores productos encontrados, el margen antes de publicidad es de 9–15 € por pedido [EST]. El coste por compra en Meta, con supuestos razonables, sale entre 24 y 83 € [EST]. Cada venta pierde dinero salvo en el escenario más favorable, y la ventaja de Maikel (anuncios, landings, automatización) no cambia por sí sola el margen del producto.

**Condición para reabrir:** un producto con **margen antes de publicidad ≥ 25 €** (ticket ≥ 60–70 € o marca blanca con coste bajo) y algún elemento propio que no se pueda copiar en semanas. Solo entonces tendría sentido la prueba mínima del punto 5.

---

## 1. Margen real por pedido

### Producto A · Funda impermeable tipo hamaca para el asiento trasero (perro), dropshipping desde España

| Concepto | Importe | Etiqueta y fuente |
|---|---|---|
| Precio de venta (IVA incl.) | 44,90 € | Propuesta del funnel |
| Ingreso sin IVA (21 %) | 37,11 € | [EST] cálculo |
| Proveedor con envío a domicilio | −21,49 € | [DATO] AliExpress 1005010750821144, envío desde España, buscador del 11/10 (precio sin abrir la ficha; puede cambiar) |
| Cobro (Shopify Payments ~2,1 % + 0,30 €) | −1,24 € | [EST] tarifa a verificar (`revision-red-team.md` I1) |
| Devoluciones e incidencias (10 % del ingreso neto) | −3,71 € | [HIP] sin dato propio; las reseñas de fundas citan correas rotas y que traspasa el agua |
| **Margen antes de publicidad = CPA de equilibrio** | **≈ 10,7 €** | [EST] |
| Con recargo de equivalencia (si Maikel vende como persona física minorista) | ≈ 9,8 € | [HIP] el proveedor pasaría de 21,49 € a ~22,41 €; **a validar con asesor** |

### Producto B · Colchoneta de viaje enrollable para perro, lote de 10 uds. traído de China

| Concepto | Importe | Etiqueta y fuente |
|---|---|---|
| Precio de venta (IVA incl.) | 44,90 € | Propuesta |
| Coste puesto en España por unidad | −12 € | [EST] 8,33 $ FOB con pedido mínimo de 10 (Made-in-China, Anhui Keynovo, [DATO] publicado, no cotizado) + flete y aduana |
| Envío nacional + embalaje | −5,50 € | [EST] Correos/paquetería ≤1 kg |
| Cobro + devoluciones | ≈ −4,9 € | [EST] |
| **Margen antes de publicidad** | **≈ 14,5 €** | [EST] |

Alternativa con más ticket: **kit funda + colchoneta a 79,90 € en dropshipping UE → ≈ 8,6 €** [EST]: la colchoneta en dropshipping cuesta 27,37 € y se come la subida de precio.

### Coste por compra (CPA) estimado

CPA = CPM ÷ (1.000 × CTR) ÷ % de clics que llegan a la landing ÷ conversión de la landing.

| Escenario | CPM | CTR enlace | Clic→visita | Conversión | **CPA** | Fuente de los supuestos |
|---|---|---|---|---|---|---|
| Favorable | 10 € | 1,5 % | 80 % | 3,5 % | **≈ 24 €** | [HIP] tienda nueva con creatividad muy buena |
| Central | 15 € | 1,2 % | 75 % | 2 % | **≈ 83 €** | [EST] CPM dentro del rango del Agente Paid para Q4 España |
| Real Qualivo + conversión 2 % | 29,8 € | 1,12 % | 75 % | 2 % | ≈ 177 € | CPM y CTR [DATO] cuenta de Qualivo 17/09–11/10 (B2B, no comparable); conversión [HIP] |

**Para llegar al equilibrio (~10,7 €)** haría falta, por ejemplo, CPM 10 €, CTR 2 % y conversión del 6 % [EST]: cifras muy por encima de lo normal en una tienda nueva sin reseñas.

**Lectura:** con ambos productos, cada pedido pierde entre ~10 y ~70 € en publicidad en los escenarios favorable y central. Recompras, venta cruzada o tráfico orgánico podrían mejorarlo, pero no hay ningún dato que lo respalde [HIP].

## 2. Capital inicial y caja inmovilizada

| Partida | Producto A (dropshipping) | Producto B (lote) | Etiqueta |
|---|---|---|---|
| Muestra(s) | 21–49 € | 30–40 € | [DATO] precios publicados |
| Stock | 0 € | ~120 € (10 uds.) | [EST] |
| Tienda (Shopify, 1–2 meses) | 0–64 € | 0–64 € | [DATO de terceros] ~32 €/mes; prueba gratis inicial |
| Dominio | 7–10 € | 7–10 € | [DATO] OVHcloud |
| Apps (cookies, facturas compatibles con VeriFactu) | 0–20 € | 0–20 € | [EST] |
| Revisión legal de textos | 0–300 € | 0–300 € | [EST] desde plantillas revisadas hasta un abogado |
| Prueba de anuncios | 150 € | 150 € | Propuesta |
| **Total** | **≈ 180–590 €** | **≈ 310–690 €** | [EST] |
| Caja inmovilizada a la vez | ~150–200 € (anuncios + pedidos pagados a proveedor antes del cobro; Shopify liquida en 3–5 días hábiles [DATO help.shopify.com]) | ~270–330 € (stock + anuncios) | [EST] |

Pérdida máxima esperable si la prueba sale mal: el total de la tabla, menos lo que se recupere del stock.

## 3. Horas semanales de Maikel

| Tarea | Horas/semana con 5–10 pedidos | ¿Puede hacerlo un agente? |
|---|---|---|
| Puesta en marcha (una vez): tienda, legal, píxel, rodaje | 10–15 h en total | Parcial: textos, landing, guiones y legales en borrador sí; cuentas, pagos y rodaje no |
| Pedidos al proveedor y seguimiento | 1–2 h | Sí, con una app tipo DSers; con acceso a la cuenta del proveedor |
| Atención al cliente e incidencias | 1–3 h | Borradores de respuesta sí; la decisión de reembolso y las disputas, Maikel |
| Revisión de anuncios y creatividades | 1–2 h | Informe diario y propuestas sí (como el Agente Paid); publicar cambios con su visto bueno |
| Contenido nuevo (grabar) | 1–3 h | No: necesita producto y perro reales |
| **Total en operación** | **≈ 4–10 h/semana** [EST] | Un agente podría quitar ~40–50 % [HIP] |

Pregunta para Maikel (sin respuesta): **¿cuántas horas semanales puede quitar a Qualivo sin afectar a clientes?**

## 4. Riesgos

| Riesgo | Probabilidad / impacto | Evidencia |
|---|---|---|
| **Sin ventaja competitiva real** | Alta / alto | Fundas similares en Tiendanimal desde 17,50 € con envío gratis y en Amazon ~24 € [DATO]; Bonotienda y vigoshop ya la anuncian en Meta España [DATO Biblioteca de Anuncios, 11/10]; el producto genérico se encuentra en AliExpress por 21 € |
| **Copia rápida** | Alta / medio | Cesto rascador: anunciado en EE. UU. en mayo, copiado por 4 tiendas españolas en septiembre [DATO] |
| **Proveedor** | Media / alto | 35 ventas y 3 reseñas [DATO]; sin responsable UE conocido para el GPSR; sin plan si se queda sin stock |
| **Calidad y devoluciones** | Media / medio | En ~108 reseñas de fundas: resbala, se rompen correas y cremalleras, traspasa la orina [DATO, lectura propia] |
| **Plazos** | Media / medio | 3–6 días declarados [DATO del vendedor]; en Navidad pueden alargarse [HIP] |
| **Legal y fiscal** | Media / alto | Vendedor responsable ante el cliente (14 días de desistimiento, 3 años de garantía [DATO BOE]); GPSR exige operador en la UE [DATO EUR-Lex]; régimen de IVA por decidir; teléfono obligatorio en la información previa |
| **Reputación de Qualivo** | Baja–media / medio | Si se vende bajo Qualivo o con Maikel visible, una mala experiencia salpica a la marca principal [HIP] |
| **Datos de clientes** | Baja / alto | Usar datos de cuentas de clientes de Qualivo para este proyecto puede chocar con sus contratos; está en pausa |

## 5. Prueba mínima (solo propuesta; no recomendada con los productos actuales)

| Elemento | Propuesta |
|---|---|
| Producto | Funda A (o un producto que cumpla la condición de reapertura) |
| Presupuesto máximo | **220 €**: muestra 21 €, tienda y dominio ~40 €, anuncios 150 €, imprevistos ~10 € |
| Duración | 5–7 días de anuncios, tras 7–10 días de preparación |
| Métrica principal | Compras y coste por compra; con menos de 5 compras se decide por el embudo: hook ≥ 20 %, CTR ≥ 1 %, coste por pago iniciado ≤ 7,5 € |
| Éxito | ≥ 5 compras con CPA ≤ 15 € |
| Parada | 75 € gastados sin compras ni pagos iniciados, o CPA > 25 € a los 150 €, o la muestra no pasa la prueba de agua o de correas |
| Prerrequisitos | Figura legal e IVA resueltos, teléfono, datos GPSR del proveedor, muestra probada (`revision-red-team.md`) |

Advertencia: con 150 € salen 1–4 compras en el escenario central [EST]. La prueba sirve para aprender el funnel, no para demostrar rentabilidad.

## 6. Puntuación

| Criterio | Nota | Razón |
|---|---|---|
| **I · Impacto** | 3/10 | Aunque saliera bien, ~10–15 € por pedido limitan el beneficio. Con 100 pedidos al mes y CPA en equilibrio, el beneficio es ~0 € |
| **C · Confianza** | 2/10 | Ningún dato propio de conversión; los supuestos del CPA dejan el margen en negativo en casi todos los escenarios |
| **E · Facilidad** | 4/10 | El funnel ya está preparado, pero faltan figura legal, IVA, proveedor con responsable UE, tienda y rodaje |
| Impacto en caja | −180 a −690 € | Si la prueba falla; inmoviliza 150–330 € durante 2–4 semanas |
| Riesgo | Medio | Dinero acotado; riesgo legal y reputacional manejable si se vende separado de Qualivo |
| Capacidad de Maikel | Media–baja | 10–15 h de puesta en marcha y 4–10 h semanales que salen de Qualivo |

**Hipótesis de diversificación** ("las capacidades de marketing, automatización e IA de Maikel pueden aplicarse a un e-commerce rentable"): la investigación sugiere que esas capacidades bajan el coste de montar y probar (todo el funnel se preparó en días), pero **no arreglan un margen de producto insuficiente**. El cuello de botella es el producto, no el marketing.

## Preguntas abiertas para Maikel

1. ¿Horas semanales disponibles para esto sin afectar a Qualivo?
2. ¿Figura legal (autónomo, Qualivo u otra sociedad) y régimen de IVA?
3. ¿Vender bajo una marca separada de Qualivo?
4. ¿Tienes un nicho propio (aficiones, comunidad) donde haya una ventaja que no dependa del precio?
