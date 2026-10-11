# Landing v2 · notas de CRO, tests, Shopify y pendientes

Fecha: 2026-10-11 · Archivo: `landing-v2.html` (maqueta, **no publicar** hasta resolver los [PRUEBA] y los {{…}}).
Producto principal: funda de coche tipo hamaca a 44,90 €. Subida de ticket: kit funda + colchoneta a 79,90 €. Contexto en `plan-prueba.md` §8.

## 0. Ideas que guían la página

1. **No competimos en precio.** Hay fundas a 17–25 € (Amazon, Tiendanimal) y anunciantes en Meta con productos parecidos (Bonotienda_Es, vigoshop.es). Somos de 2 a 2,5 veces más caros. La landing tiene que justificar esa diferencia con **pruebas que se ven** (vídeos sin cortes), **medidas tomadas por nosotros**, **una persona que contesta** y **claridad total**: precio final, plazo, quién vende y quién paga la devolución.
2. **Las reseñas de la competencia son el guion.** Las quejas reales (resbala, el agua traspasa, se rompen las correas, no encaja en SUV, el pelo se clava) se convierten en las secciones de la página. Así contestamos las objeciones antes de que aparezcan.
3. **La honestidad también vende.** La comparativa admite que a un perro pequeño que casi no viaja le basta con una toalla. Al visitante frío de Meta le suena creíble, y filtra a quien devolvería el producto.
4. **Legal y conversión van juntos.** Hay tres puntos legales que condicionan el diseño:
   - **Derechos legales como si fueran ventaja propia.** Presentar los 14 días de desistimiento o la garantía legal de 3 años como ventaja de la tienda es práctica desleal "en todo caso" (Directiva 2005/29/CE, anexo I, punto 10; en España, art. 20 y ss. de la Ley de Competencia Desleal). Por eso **no aparecen** en la barra superior, las microgarantías, los CTA ni la comparativa. Solo figuran como información neutra en la FAQ ("Como establece la ley…"), en las condiciones y en el footer legal.
   - Las microgarantías son ventajas propias y reales: **envío gratis a la Península con su plazo**, **pruebas grabadas sin cortes** y **una persona que responde en menos de 24 h**.
   - Si se decide asumir el coste de la devolución, eso sí es una ventaja propia (la ley permite cobrarlo si se informa) y se puede anunciar como "Devolución sin coste para ti", siempre sin presentar el plazo de 14 días como mérito nuestro.
   - **El kit nunca va preseleccionado.** Marcar por defecto la opción más cara se acerca a los pagos adicionales por defecto que prohíbe el art. 60 bis del TRLGDCU, así que el selector arranca en la funda.
   - **Sin "ahorro".** La colchoneta no se vende sola, así que mostrar un ahorro sería un precio de referencia inventado.

## 1. Lógica CRO por sección

| # | Sección | Trabajo que hace | Decisiones |
|---|---|---|---|
| 0 | Barra superior | Responde a "¿cuánto me cuesta de verdad?", "¿cuándo llega?" y "¿hay alguien detrás?" antes del primer scroll | Envío gratis Península · 3–6 días laborables · respuesta de una persona en < 24 h. Sin derechos legales como reclamo, sin contadores ni urgencia |
| 1 | Cabecera | Marca y vía de contacto | **Sin menú**, para que nadie se vaya. "¿Dudas? Escríbenos" abre un mailto como señal de que hay alguien detrás |
| 2 | Hero | Que el visitante de un anuncio entienda en 3 s qué es, para quién, cuánto cuesta y que puede comprar ya | **V1 arriba en móvil** porque continúa el anuncio (mismo plano: barro → asiento limpio). Titular de resultado concreto ("Vuelve del monte…") en vez de una característica. Precio final con IVA y envío pegado al titular. Selector funda/kit como tarjetas grandes y táctiles. El CTA repite el precio de la opción elegida. Las 3 microgarantías (envío y plazo, probada en vídeo, atención humana) van **debajo** del CTA, donde surge la duda. Debajo, en letra pequeña, métodos de pago, "precio final" y aviso de que no es un sistema de retención |
| 3 | El problema | Que el visitante se reconozca: es su coche | 3 escenas sacadas de las reseñas: barro y agua, pelo clavado, perro en el hueco de los pies. Sin dramatizar ni hablar de seguridad |
| 4 | Demo en 3 pasos (V2) | Desmonta la objeción "instalarla es un rollo" (queja de las reseñas) | Un solo vídeo de 20 s partido en 3 tramos con `data-start`. El tiempo de montaje solo se publica cronometrado en 2 coches |
| 5 | Quejas y cómo lo comprobamos (V3, V4, F4) | **Diferenciador principal** frente a fundas de 20 €: pruebas reproducibles | Cada tarjeta lleva la cita de la queja, el protocolo de la prueba y el resultado. El compromiso de publicar el resultado "salga como salga" refuerza la credibilidad y nos obliga a cumplirlo |
| 5b | Opiniones | Prueba social | **Oculto** hasta tener al menos 3 opiniones reales con permiso. Nunca reseñas de AliExpress ni inventadas |
| 6 | Comparativa | Justificar 44,90 € frente a 0 € y 20 € | Categorías genéricas, sin nombrar marcas ni tiendas (para no caer en publicidad comparativa engañosa ni denigratoria). Reconoce que somos más caros. La columna propia remite a vídeos, no a adjetivos. En móvil, tabla con scroll horizontal **dentro** del contenedor y primera columna fija |
| 7 | Kit (V5, F5) | Subir el ticket | Un caso de uso distinto (llegar a casa de la familia en Navidad o al apartamento), no "más producto". Botón secundario que selecciona el kit y vuelve al hero, para que el carrito sea siempre el mismo |
| 8 | Medidas y "¿vale para mi coche?" (F1, F2, F3, F6) | Desmonta la objeción "no encaja en mi SUV", fuente probable de devoluciones | Guía de 4 pasos medible con una cinta, lista de coches probados y un mailto con asunto y cuerpo rellenos para preguntar por un modelo. Cada consulta es un lead y un dato de compatibilidad |
| 9 | FAQ | Resolver objeciones de cierre e informar de los derechos legales de forma neutra | Orden por frecuencia esperada: plazo, devolución (desistimiento "como establece la ley"), defectos (garantía legal), lavado, SUV, perro grande, retención, pasajeros, pago, quién vende. `<details>` nativo, que no necesita JS. Cada apertura se mide con `faq_open` para reordenar |
| 10 | CTA final | Recoger a quien llega al final | Repite opción elegida y precio. Enlaza al hero, donde están el selector y la información precontractual |
| 11 | Información del producto (GPSR) | Cumplir el art. 19 del GPSR | Fabricante, persona responsable en la UE, modelo y lote, y advertencias, también para la colchoneta. **Sin persona responsable en la UE no se vende** |
| 12 | Footer | Información LSSI y enlaces legales | Razón social, NIF, dirección, email y formulario de desistimiento |
| — | Barra fija en móvil | Tener el CTA siempre a mano | Se oculta cuando el CTA del hero está en pantalla. Muestra la opción elegida y su precio. Se oculta a partir de 900 px |

**Cambios frente a la estructura sugerida:**
- Hay un bloque de opiniones (5b), oculto, para que el hueco esté reservado en el diseño.
- La guía de compatibilidad está fusionada con medidas y fotos F1–F3: la duda "¿cabe?" se resuelve mirando.
- Hay un CTA final antes del bloque GPSR, para que el último bloque persuasivo no sea texto legal.

## 2. IDs de medios (para el equipo creativo)

| ID | Tipo | Contenido | Dónde |
|---|---|---|---|
| V1 | Vídeo en bucle de 6 s, 4:5, sin sonido | Perro con barro sube → se tumba → funda fuera, asiento limpio | Hero |
| V2 | Vídeo de 20 s | Instalación completa en tiempo real, en 3 tramos (0–7, 7–14 y 14–20 s) | Demo |
| V3 | Vídeo de 10 s | 250 ml en el centro y en una costura, 30 min, levantar y ver el papel | Pruebas |
| V4 | Vídeo de 10 s | Cinta de carrocero alineada, garrafa de 5 L y 10 tirones, regla sobre el desfase (tela; V4b en piel si hay coche) | Pruebas |
| V5 | Vídeo de 15 s | Funda en el coche → colchoneta desenrollada al llegar → enrollar y llevar del asa | Kit |
| F1 | Foto | Funda en modo hamaca desde la puerta trasera abierta ("Probada en [modelo]") | Medidas (foto principal) |
| F2 | Foto | Detalle de la ventana de malla con la cremallera medio abierta | Medidas |
| F3 | Foto | Ranura del cinturón con el enganche saliendo | Medidas |
| F4 | Foto | Hebilla cerrada alrededor del reposacabezas | Pruebas (correas) y medidas |
| F5 | Foto | Bodegón del kit: funda doblada y colchoneta enrollada | Kit |
| F6 | Foto | Colchoneta enrollada cogida del asa (y versión con cinta métrica) | Kit |

> IDs y contenidos alineados con `creative-pack.md` (§2). Los protocolos de prueba de la landing son los del pack: [PRUEBA-AGUA], [PRUEBA-DESLIZ], [PRUEBA-CORREAS], [PRUEBA-INSTAL], [PRUEBA-MEDIDAS], [PRUEBA-SUV], [PRUEBA-PELO], [PRUEBA-LAVADO].
> **Hueco sin foto:** el pack no incluye una foto de la funda extendida con cinta métrica. Si se quiere enseñar la medida real en la ficha, conviene añadirla al rodaje como F7.

Formato de los vídeos: MP4 H.264 de menos de 2 MB para V1, `autoplay muted loop playsinline`, `poster` con el primer fotograma y `preload="metadata"` en V2–V5. Los vídeos de prueba (V3 y V4) **sin cortes**: si se acelera la espera, se indica en pantalla ("30 min acelerados").

## 3. Hipótesis de test A/B, priorizadas

**Tráfico realista de la primera ronda:** 150 € con un CPC de ~0,40–0,70 € dan unas **210–375 visitas** a la landing y, según el plan, entre 5 y 15 compras. Con ese volumen **no se puede hacer ningún test A/B fiable sobre la compra**. Para detectar un salto de conversión del 2 % al 3 % hacen falta ~3.800 visitas por variante (α = 0,05, potencia del 80 %, dos colas).

**Regla honesta:**
- En la ronda 1 la landing va **sin test**, con una sola versión.
- Los ángulos se prueban en Meta, que es donde está el volumen de impresiones.
- Desde la ronda 2, se testea solo lo que mueve métricas intermedias de base alta (añadir al carrito, elección del kit) y solo cambios grandes. Un test se da por bueno cuando alcanza el tamaño indicado, no cuando "parece que gana".

| Prioridad | Hipótesis | Por qué | Métrica principal | Tamaño mínimo honesto |
|---|---|---|---|---|
| 1 | **V1 (vídeo de prueba real) frente a F1 (foto estática) en el hero** aumenta la tasa de añadir al carrito | Continúa el anuncio y enseña el resultado. Las fundas competidoras usan fotos de catálogo | Visitas → AddToCart | Del 6 % al 12 %: **~360 visitas por variante**. Del 6 % al 9 %: ~1.200. Solo cabe en la ronda 2 si se esperan efectos grandes |
| 2 | **Devolución sin coste para el cliente** ("Devolución sin coste para ti" en la barra; no se menciona el plazo de 14 días como ventaja) frente a devolución a cargo del cliente sube la conversión lo bastante para pagar su coste | Somos más caros que Amazon, donde devolver es gratis. Es una decisión de negocio (~5–7 € por devolución), así que conviene medirla | Visitas → Purchase; también la tasa de devolución | Del 2 % al 4 %: **~1.150 visitas por variante**. Ronda 3 o posterior. Mientras tanto, decidirlo con criterio (recomendado: asumirla nosotros si el margen real lo permite) |
| 3 | **Oferta del kit en el carrito** ("Añade la colchoneta por 35 € más") frente a kit solo en la página sube el % de pedidos con kit sin bajar la conversión | En el carrito el comprador ya ha decidido. La subida se enmarca contra 44,90 € y no contra 0 € | % de pedidos con kit (o de carritos con kit) | Del 20 % al 35 %: **~140 carritos por variante**. Del 15 % al 30 %: ~120. Es el test más factible en las primeras rondas |
| 4 | **Titular de prueba** ("Lo hemos mojado, montado y llevado en curvas: mira los vídeos") frente al titular de resultado ("Vuelve del monte con el perro lleno de barro…") | Saber si el tráfico frío compra más por el beneficio o por la credibilidad. La respuesta orienta las creatividades | Visitas → AddToCart y profundidad de scroll hasta las pruebas | Del 6 % al 9 %: ~1.200 por variante. **Hacerlo primero en Meta** como test de texto (CTR, del 1 % al 1,5 %: ~7.700 impresiones por variante, barato) y pasar a la landing el ganador |
| 5 | **Bloque de pruebas justo después del hero** frente a después del problema y la demo | Si la duda principal es "¿traspasa o resbala?", adelantar la respuesta reduce el rebote | Visitas → AddToCart; % que ve el bloque de pruebas | Del 6 % al 9 %: ~1.200 por variante. Último en prioridad. Antes, mirar los mapas de calor (si se instalan) y `faq_open` |

**Tamaños calculados** con la fórmula de dos proporciones, α = 0,05 (dos colas) y potencia del 80 %:

| Salto | Tamaño por variante |
|---|---|
| 2 % → 3 % | 3.821 |
| 2 % → 4 % | 1.140 |
| 6 % → 9 % | 1.207 |
| 6 % → 12 % | 356 |
| 20 % → 35 % | 138 |
| 15 % → 30 % | 120 |

**Excluido a propósito:** preseleccionar el kit (riesgo legal, ver §0), urgencia o contadores de cualquier tipo, y precios tachados.

## 4. Configuración recomendada de Shopify

**Producto**
- Un solo producto, "Funda de coche para perro tipo hamaca", con 2 variantes: `Funda` (44,90 €) y `Kit funda + colchoneta` (79,90 €).
- El selector de la landing manda el `variant_id` a `/cart/add.js`.
- Con un producto y variantes, ViewContent y AddToCart llevan el mismo `content_id` padre, el informe de "% kit" sale directo y se evitan colecciones vacías.
- SKU distintos por variante para el pedido al proveedor (el kit = 2 líneas al proveedor).
- Inventario sin seguimiento o con "seguir vendiendo", según la disponibilidad del proveedor. Revisar el stock a diario.

**Carrito**
- Usar la página de carrito, no el cajón lateral. En móvil se lee mejor y es donde va la oferta del kit.
- **Oferta del kit:**
  - Si en el carrito está la variante `Funda`, se muestra un bloque "¿Viajáis lejos? Cambia al kit con colchoneta por 35,00 € más".
  - El botón cambia la línea a la variante `Kit` con `/cart/change.js`. **No suma un segundo producto.**
  - Se hace con un bloque de tema o con un poco de Liquid. Las apps de upsell suelen meter contadores o descuentos, así que hay que revisar que no lo hagan.
  - Debe ser una casilla o un botón **sin marcar**.
- Sin códigos de descuento en la ronda 1. Si no hay descuentos activos, comprobar que el campo de código no aparece o queda discreto (**PENDIENTE verificar** en el checkout actual).
- Mostrar el envío "Gratis" y el total con IVA ya en el carrito.

**Checkout**
- Cuentas de cliente opcionales o desactivadas. Nunca obligatorias.
- **Teléfono:** opcional, con el texto "Solo para el transportista". Si el proveedor lo exige, obligatorio y con ese mismo texto.
- **Empresa:** oculto. **Dirección 2:** opcional.
- Autocompletado de dirección activado.
- **Marketing:** casilla de email **sin marcar** por defecto. SMS desactivado.
- Propinas desactivadas.
- **Políticas:** enlazar reembolso, envío, privacidad, términos y contacto (Shopify las muestra en el pie del checkout). Rellenar los datos del vendedor en *Ajustes → Políticas → Información de contacto*.
- **Botón final:** "Pagar ahora" (por defecto) cumple el art. 98.2 del TRLGDCU, que pide indicar de forma inequívoca que el pedido implica pagar. No cambiarlo por "Continuar".
- **Idioma y moneda:** español, EUR, precios con IVA incluido. Configurar los impuestos de España (21 %) y comprobar que el checkout muestra "IVA incluido".

**Envío**
- Una sola zona, España peninsular: excluir Baleares (CP 07), Canarias (35 y 38), Ceuta (51) y Melilla (52), por provincia o con una regla de códigos postales.
- Tarifa única "Envío gratis · 3–6 días laborables" {{confirmar el plazo real}}.
- Si alguien de las zonas excluidas llega al checkout, debe ver un mensaje claro de que no se envía, no un error genérico.

**Pagos**
- **Tarjeta, Apple Pay y Google Pay:** Shopify Payments, si está disponible para la figura legal elegida. Si no, Stripe a través de una pasarela compatible.
- **PayPal:** integración nativa de Shopify (PayPal Express). Enlazar la cuenta PayPal Business.
- **Bizum:** **PENDIENTE verificar.** Por lo que sabemos, Shopify Payments no lo ofrece de forma nativa en España. Requiere una pasarela de terceros (TPV de Redsys del banco o un proveedor como PayComet, Sipay o Mollie, según disponibilidad). Hay que comprobar la comisión, el alta y el tiempo de aprobación.
  - **Recomendación:** si el alta de Bizum retrasa el lanzamiento más de 2–3 días, lanzar sin Bizum, quitarlo de la landing y añadirlo después. **No mostrar logotipos de métodos que no estén activos.**
- Compra de prueba real con reembolso para cada método activo (ya está en el checklist del plan).

**Página de gracias y emails**
- Página de gracias con el plazo real, qué pasa ahora (pedimos al proveedor y te enviamos el seguimiento) y el email de contacto.
- Emails 1–3 de `anuncios-y-emails.md` (ya hablan de la funda desde el 11/10). Antes de activar los de carrito abandonado, ver el punto de consentimiento en `revision-red-team.md`.

## 5. Eventos de medición

**Base:** la app oficial de Meta en Shopify, con píxel y API de conversiones y deduplicación por `event_id`. Eventos estándar automáticos: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `AddPaymentInfo` y `Purchase`. Todo condicionado al consentimiento del banner de cookies (CMP).

**Eventos propios** (en la maqueta se empujan a `window.dataLayer` y en Shopify se recogen con un *Customer event / pixel personalizado* hacia GA4 o los informes de Shopify; a Meta solo se mandan los estándar):

| Evento | Cuándo | Para qué |
|---|---|---|
| `select_variant` (`variant`) | Cambio en el selector | % que mira el kit |
| `add_to_cart_click` (`variant`, `source`: hero o sticky) | Clic en un CTA | Valor de la barra fija |
| `select_kit_block` | Botón del bloque kit | Si el bloque kit convence |
| `faq_open` (`faq`) | Apertura de una pregunta | Objeciones reales; reordenar la FAQ |
| `compat_contact` / `contact_click` | Mailto de compatibilidad o de dudas | Dudas previas a la compra; leads |
| `final_cta` | CTA final | Si el final de la página aporta |
| `video_play` / `video_50` (`asset`) | Al implementar `<video>` | Si se ven las pruebas V3 y V4 |
| `scroll_depth` (25/50/75/100) | GA4 o scroll mejorado | Dónde se pierden |

**Panel mínimo diario** (hoja de cálculo): gasto, clics, visitas a la landing, AddToCart, InitiateCheckout, Purchase, % de kit, ticket medio, CPA y las 3 FAQ más abiertas. Antes de lanzar, comprobar Purchase con el Explorador de eventos.

## 6. Pendientes de rellenar

**[PRUEBA] (con la muestra)**
- [ ] Medidas reales de la funda (declaradas 133 × 140 cm) y peso.
- [ ] Rango de ancho de asiento en el que encaja, y si funciona con reposacabezas integrados.
- [ ] Montaje cronometrado en 2 coches (al menos uno SUV), primera vez y sin ayuda. Marca, modelo y año de cada coche.
- [ ] Número de anclajes de asiento y de correas.
- [ ] Prueba de agua: 250 ml en el centro y en una costura, 30 min, papel debajo (V3). Si pasa, **no** se usa "impermeable" ni "el agua no llega".
- [ ] [PRUEBA-DESLIZ]: cinta, garrafa de 5 L y 10 tirones, en tela (y en piel si se puede) (V4). Desplazamiento en cm. "Antideslizante" solo si pasa en tela **y** en piel.
- [ ] [PRUEBA-CORREAS]: 5 kg durante 60 s en cada correa y hebilla, y la cremallera 20 veces (F4).
- [ ] Pelo: si sale con la mano o con un cepillo de goma.
- [ ] Lavado según la etiqueta. "Lavadora" solo si la etiqueta lo permite y lo hemos probado.
- [ ] Colchoneta: medidas (~95 × 65 cm), peso y si aísla de la humedad del suelo (o se borra esa línea).
- [ ] Frase del hero "la hemos probado…", microgarantía "Probada antes de venderla" y compromiso "salga como salga": solo con V3, V4 y la prueba de correas grabados.
- [ ] Peso del perro de las pruebas, para la FAQ "¿Sirve para un perro grande?".

**{{…}} (datos)**
- [ ] Plazo real de entrega (3–6 días laborables, por confirmar con el proveedor).
- [ ] Quién paga la devolución y su coste. Dirección de devolución en España.
- [ ] Métodos de pago activos (Bizum, PayPal, tarjeta).
- [ ] Email de atención; razón social, NIF y dirección (aviso legal, FAQ "¿Quién vende?" y footer).
- [ ] Materiales, accesorios incluidos e instrucciones de lavado del fabricante.
- [ ] Si se puede sentar un pasajero con la funda puesta.
- [ ] Peso máximo del perro si el fabricante lo indica (si no, no se promete).
- [ ] GPSR de la funda y de la colchoneta: fabricante, persona responsable en la UE, modelo, lote y composición (solo si es exacta).
- [ ] {{testimonio real 1–3}}: solo compradores reales con permiso escrito. Hasta entonces, el bloque `#opiniones` se elimina del tema.
- [ ] Revisar los precios de la comparativa ("desde unos 17–25 €") el día de publicar.
- [ ] Enlaces legales del footer a las páginas reales.
