# Prueba de funnel · "Viajar con perro"

Fecha: 2026-10-11 · Estado: **preparado, sin publicar**
Marca provisional: **Ruta Perruna**. Los dominios rutaperruna.es y rutaperruna.com no resuelven en DNS, lo que sugiere que están libres (COMPROBADO 11/10). Antes de usar la marca hay que confirmarlo en un registrador y buscarla en la OEPM y la EUIPO.

## 1. Qué queremos aprender

| Pregunta | Métrica | Por qué importa |
|---|---|---|
| ¿Cuánto cuesta conseguir una venta en Meta? | Coste por compra (CPA) | Es el dato que hace viable o inviable todo lo demás |
| ¿Funciona mejor el producto suelto o el kit? | Ticket medio y % de pedidos con kit | El margen por pedido es el cuello de botella |
| ¿Qué ángulo engancha? | CTR y coste por clic por anuncio | Para decidir las creatividades de la segunda ronda |
| ¿La calidad aguanta? | Prueba de la muestra y quejas o devoluciones | Sin calidad no hay segunda ronda |

**Supuesto más arriesgado:** que alguien compre una colchoneta a ~45 € cuando las tiendas de mascotas tienen alternativas de 14 a 30 €.

## 2. Oferta

| Producto | Precio (IVA incl.) | Papel |
|---|---|---|
| A · Colchoneta de viaje enrollable e impermeable | 44,90 € (provisional; se ajusta con el coste real del proveedor) | Producto principal |
| B · Funda de coche impermeable tipo hamaca | 39,90 € | Venta cruzada |
| Kit A + B | 69,90 € | Ancla de valor y subida de ticket |

- Envío gratis en España peninsular, con plazo real del proveedor más 1–2 días.
- Devolución en 14 días, como marca la ley. Hay que decidir quién paga la devolución e informarlo en la web.
- **No se publican afirmaciones que la muestra no haya superado.** "Impermeable", "antideslizante" y "lavable a 30 °C" quedan pendientes de la prueba.

## 3. Estructura del funnel

```
Anuncio Meta (vídeo/carrusel, 3 ángulos)
  → Landing de producto (colchoneta) con bloque del kit
    → Checkout (Shopify) con oferta del kit en el carrito
      → Página de gracias + email de confirmación con plazo real
        → Email de carrito abandonado (1 h y 24 h)
```

**Eventos de medición:** PageView, ViewContent, AddToCart, InitiateCheckout y Purchase, con píxel y API de conversiones de Meta mediante la integración oficial de Shopify. Antes de lanzar se hace una compra de prueba real con reembolso para comprobar que se registra el evento Purchase.

## 4. Presupuesto de la primera ronda

| Partida | Importe | Notas |
|---|---|---|
| Muestra de A (y de B si cabe) | 25–45 € | Se compra el día 1 y se envía a tu dirección |
| Tienda | ~0–35 € | Prueba gratuita de Shopify o plan Basic (precio en EUR PENDIENTE) |
| Dominio | ~8–10 € | .es en OVHcloud 7,25 € el primer año (COMPROBADO) |
| Publicidad Meta | **150 € máx.** | 3 conjuntos de anuncios × ~10 €/día durante ~5 días |
| **Total** | **~185–240 €** | Quedan ~260–315 € para una segunda ronda o para cambiar de producto |

## 5. Reglas de decisión, fijadas antes de empezar

Margen antes de publicidad por pedido (ESTIMADO, pendiente del proveedor real): entre 9 y 15 € para A y entre 18 y 25 € para el kit. El CPA de equilibrio se toma del margen real del ticket medio.

- **Paro y analizo:**
  - 75 € gastados sin ninguna compra.
  - 150 € gastados con un CPA por encima de 25 €.
  - La muestra no supera la prueba de agua o de cierres. Si eso pasa, pausa inmediata y reembolso de los pedidos pendientes.
- **Segunda ronda (otros 150 €, nuevas creatividades):**
  - Con un CPA entre el de equilibrio y 25 € y un CTR de al menos el 1 %.
  - Con un CPA mayor que el margen pero menor que 1,5 veces el margen.
- **Escalo y negocio lote o almacén:**
  - Con un CPA por debajo del margen antes de publicidad y al menos 5 compras.
- **Ojo con la estadística:** con 150 € esperamos entre 5 y 15 compras como mucho. Es una señal inicial, no una prueba de rentabilidad.

## 6. Checklist antes de publicar (responsable: Maikel salvo indicación)

- [ ] Figura legal con la que se vende (Qualivo, autónomo u otra) y NIF en el aviso legal
- [ ] Tienda creada y dominio conectado
- [ ] Cobros activados (Shopify Payments o Stripe) y una compra de prueba con reembolso
- [ ] Páginas legales revisadas por un profesional, a partir de los borradores de `legal-borradores.md` (Claude)
- [ ] Ficha con los datos GPSR: fabricante, persona responsable en la UE, identificador del producto y advertencias (Claude prepara el texto cuando tengamos el proveedor)
- [ ] Muestra pedida el día 1
- [ ] Píxel y API de conversiones verificados con el Explorador de eventos
- [ ] Banner de cookies con consentimiento previo (CMP compatible con Meta)
- [ ] Creatividades grabadas con vídeo propio (no reutilizar vídeos ni fotos de marcas)
- [ ] Atención al cliente: email y respuesta en menos de 24 h
- [ ] Proceso de pedido documentado: cuando entra un pedido, se compra al proveedor con la dirección del cliente y se envía el seguimiento

## 7. Calendario orientativo

| Día | Tarea |
|---|---|
| 0 | Decisiones de Maikel (empresa, tienda, cobros); muestra pedida |
| 1–2 | Montar la tienda con estos textos, las páginas legales, el píxel y la compra de prueba |
| 2–3 | Grabar 3 vídeos cortos (o UGC con la muestra cuando llegue) |
| 3–8 | Campaña con 150 € |
| 9 | Análisis y decisión con las reglas del punto 5 |

Si se quiere empezar antes de que llegue la muestra, los anuncios solo pueden usar afirmaciones genéricas y vídeo con la muestra en cuanto llegue. Recomendación: **esperar a la muestra para grabar.** Grabar con el producto real es mejor creatividad y evita prometer lo que no hemos comprobado.

---

## 8. Actualización: proveedores con envío desde la UE (2026-10-11)

Resultado de buscar en AliExpress con envío desde ES, PL, DE y FR (COMPROBADO-buscador). CJ, BigBuy, Syncee y Spocket quedan PENDIENTES porque exigen cuenta o tienen bloqueo. Precios sin oferta y con IVA incluido (supuesto). Las fichas no se pudieron abrir (captcha): **hay que confirmar a mano el precio de la talla elegida**.

| Producto | Proveedor recomendado | Precio | Envío | Señales |
|---|---|---|---|---|
| A colchoneta | https://es.aliexpress.com/item/1005012975211088.html (90×60 cm) | 30,32 € | ES, 3–6 días, gastos PENDIENTES | 0 vendidos, sin reseñas |
| A alternativa | https://es.aliexpress.com/item/1005012786425560.html (95×65 cm) | 27,37 € | DE, 5–10 días | 1 vendido |
| B funda hamaca | https://es.aliexpress.com/item/1005010750821144.html (133×140 cm, malla) | 21,49 € | ES, envío gratis, ~4 días | 35 vendidos, 3 reseñas, 4,3★ |
| B mejor respaldada | https://es.aliexpress.com/item/1005008512231045.html | 32,99 € | DE, 5–10 días | 370 vendidos, 58 reseñas, 4,9★ |

**Margen antes de publicidad (ESTIMADO; incluye Stripe y un 10 % de incidencias):**

| Escenario | Margen = CPA de equilibrio |
|---|---|
| A a 44,90 € (proveedor 30,32 €) | **2,15 €**, inviable |
| A a 44,90 € (proveedor 27,37 €) | 5,10 € |
| B a 39,90 € (proveedor 21,49 €) | 7,34 € |
| **B a 44,90 € (proveedor 21,49 €)** | **~11,0 €** |
| Kit a 69,90 € | −1,12 €, inviable |
| **Kit a 79,90 € (A 27,37 € + B 21,49 €)** | **9,12 €** |

**Conclusión:** con dropshipping desde la UE, **la colchoneta como producto principal no da margen**. Antes, en Made-in-China, salía a ~12 € puesta con un lote de 10 uds., pero eso exige comprar stock y hacer los envíos uno mismo.

### Funnel revisado (recomendado)
- **Producto principal: funda de coche tipo hamaca (B) a 44,90 €**, con proveedor en España, envío en ~4 días y unos 11 € de margen.
- **Kit funda + colchoneta a 79,90 €** como subida de ticket, con unos 9 € de margen.
- La colchoneta sola no se ofrece en esta ronda.
- **Contra:** en Meta España ya anuncian fundas parecidas Bonotienda_Es y vigoshop (barrido del 11/10). Competimos en creatividad. La parte buena es que eso indica que hay anunciantes interesados, aunque no prueba que haya ventas.
- **Reglas de decisión ajustadas:** con un margen de ~11 €, una venta con CPA ≤11 € cubre costes. Seguimos si el CPA es ≤15 € tras 150 €, y paramos si supera 25 €.
- **Muestras:** B 1005010750821144 (21,49 €) + A 1005012786425560 (27,37 €) ≈ **49 €**.

### Alternativa B (más trabajo, más margen)
Comprar un lote de 10 colchonetas en Made-in-China (Anhui Keynovo, 8,33 $ FOB) y enviarlas tú desde casa. El margen sube a ~15 € con la colchoneta a 44,90 €, pero inmoviliza ~120 € y requiere preparar los envíos. Solo después de validar el CPA con la opción recomendada.
