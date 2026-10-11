# Revisión red team · Ruta Perruna · ronda 1

Fecha: 2026-10-11 · Alcance: todos los archivos de `funnel-viajar-con-perro/` más `../registro.md` y `../informe-2026-10-11.md`.
No es asesoramiento jurídico ni fiscal. Las cifras de terceros que no he podido comprobar hoy van marcadas como **VERIFICAR**.

---

## 0. Veredicto corto

**No lanzar todavía.** El material creativo, la landing v2 y el plan de Meta son buenos y prudentes con las afirmaciones. Pero hay cuatro problemas de base:

1. **El experimento no puede medir lo que dice medir.** Con 150 € y los CPM que el propio plan considera realistas, salen entre 1 y 4 compras. Con eso no se conoce el CPA.
2. **Las reglas de decisión se contradicen entre archivos**, y la regla automática de Meta está configurada con la versión superada.
3. **Falta la base legal para vender:** figura legal, régimen de IVA, datos GPSR de un vendedor de AliExpress desconocido y teléfono en la información precontractual.
4. **Todo depende de una muestra que aún no ha llegado**, y si falla no hay un proveedor alternativo con margen.

**La pregunta incómoda.** El informe de hoy dice que P06 (esta funda) **no** se recomendaba como primera prueba, y que su supuesto invalidante era "no hay proveedor UE a ≤12 € puesto en destino". El proveedor elegido cuesta **21,49 €**, así que ese supuesto se cumple. El plan lo compensa subiendo el precio a 44,90 €, que es 1,5–2,5 veces el de Tiendanimal, y con eso el margen queda en ~11 €.

Ni siquiera en el mejor caso (CPA = margen) se gana dinero, y el árbol de decisión no tiene ninguna rama que lleve a beneficio: el "lote o almacén" solo existe cotizado para la colchoneta, no para la funda.

Así que la pregunta es esta: **¿qué decisión distinta tomaríamos con el resultado?** Si la respuesta es "aprender a montar el embudo y probar ganchos para el siguiente producto", es legítimo, pero entonces hay que decirlo y diseñarlo así. Ver §6.

---

## 1. Bloqueantes

### B1 · El experimento no mide el CPA (fallo de base)

- **Dónde:** `plan-prueba.md` §1 y §5; `paid-meta-plan.md` §0.3, §4 y la revisión final (puntos 2 y 3); `landing-v2-notas.md` §3.
- **Problema.** La pregunta principal es "¿cuánto cuesta una venta?". Con las cifras del propio plan:

| CPM | CTR enlace | CPC | Coste por visita (80 % carga) | Visitas con 150 € | Compras con CVR 2,5 % | CVR necesaria para CPA 11 € | CVR para CPA 15 € |
|---|---|---|---|---|---|---|---|
| 8 € (hipótesis inicial del plan) | 1,5 % | 0,53 € | 0,67 € | 225 | 5,6 | 6,1 % | 4,4 % |
| 12 € ("bien" según la revisión) | 1,2 % | 1,00 € | 1,25 € | 120 | 3,0 | 11,4 % | 8,3 % |
| 20 € ("aceptable" según la revisión) | 1,2 % | 1,67 € | 2,08 € | 72 | 1,8 | 18,9 % | 13,9 % |
| 29,8 € (dato real de la cuenta de Qualivo) | 1,12 % | 2,66 € | 3,33 € | 45 | 1,1 | 30 % | 22 % |

- **Por qué importa:**
  - Con 1–4 compras, el CPA es ruido, y el "seguir aunque haya 0–2 compras" de la revisión final convierte la prueba en una decisión **por métricas intermedias**.
  - La regla "coste por pago iniciado ≤ 7,5 €" depende de suponer que el 50 % de los pagos iniciados acaban en compra (HIPÓTESIS de §4.2). Ese dato es justo lo que no sabemos en una tienda nueva sin reseñas.
  - Con un CPM de 12 € y un CTR de 1,2 %, hacen falta un 17 % de visitas que inicien el pago para cumplir esa regla. Es muy improbable.
  - **El plan no lo dice en voz alta:** en casi todos los escenarios plausibles, el equilibrio exige una conversión de landing por encima del 6–10 %. Una tienda nueva, sin reseñas y al doble del precio de mercado no suele llegar a eso (HIPÓTESIS, pero es el supuesto más frágil de todo el plan).
  - Lo de "qué ángulo funciona" tampoco se resuelve bien: con ~75 € por ángulo (unas 5.000–9.000 impresiones), detectar un CTR del 1 % frente al 1,5 % exige ~7.700 impresiones por variante (cálculo de `landing-v2-notas.md` §3). Solo se verán diferencias grandes, y entre ganchos de un mismo conjunto, ninguna, porque Meta reparte el gasto de forma desigual.
  - "¿Funciona mejor el producto suelto o el kit?" (`plan-prueba.md` §1) **no se puede contestar**: A3 sale de la ronda 1 y el "% de kit" con 1–4 pedidos no significa nada.
- **Corrección propuesta** (decisión de Maikel):
  1. Reescribir el objetivo de la ronda 1: "medir **coste por visita a la landing**, **CTR por ángulo** y **tasa de añadir al carrito**; el CPA queda como dato orientativo".
  2. Fijar antes de empezar un **criterio de muerte que sí se puede medir con 150 €**. Por ejemplo: "si el coste por visita a la landing pasa de 0,60 € (el CPA de 15 € exigiría más del 4 % de conversión), la funda a 44,90 € no es viable aunque haya alguna venta". Con 100–200 visitas, el coste por visita sí es fiable.
  3. Quitar "producto suelto o kit" de las preguntas de la ronda 1.

### B2 · Reglas de decisión contradictorias, y la regla automática está mal

- **Dónde:** `plan-prueba.md` §5 frente a §8; `paid-meta-plan.md` §1.1 (regla automática), §1.2, §1.5, §4.2, §4.3 y la revisión final.
- **Problema.** Hay al menos cuatro versiones vivas:

| Tema | `plan-prueba.md` §5 | `plan-prueba.md` §8 | `paid-meta-plan.md` §1.1 y §4.3 | Revisión final (manda) |
|---|---|---|---|---|
| Parada a los 75 € | 0 compras | — | 0 compras (regla automática) | 0 compras **y** 0 pagos iniciados |
| Seguir | CPA entre el de equilibrio y 25 € con CTR ≥1 %, o CPA <1,5 × margen | CPA ≤15 € | CPA ≤15 € | Embudo: hook ≥20 %, CTR ≥1 %, coste por pago iniciado ≤7,5 €, aunque haya 0–2 compras |
| Parar | CPA >25 € a 150 € | CPA >25 € | CPA >25 € o CTR <1 % | CPA solo cuenta con ≥5 compras |
| Conjuntos | 3 × 10 €/día | — | 3 × 10 €/día | 2 × 15 €/día |
| Subir anuncios | — | — | D-1 | D-2 |
| Apagar un anuncio | — | — | ≥6 € gastados | ≥1.000 impresiones |
| Plan B (ATC/IC) | — | — | gasto <50 % **o** CPM >20 € | solo gasto <50 % |

- **Por qué importa:**
  - La **regla automática** de Meta se crea siguiendo §1.1, que es la versión superada. Pausaría la campaña con pagos iniciados, al contrario de lo que pide la revisión.
  - Con tres reglas distintas, el resultado se puede "leer" a favor de seguir sea cual sea. Es el sesgo que las reglas fijadas de antemano deberían evitar.
  - Además, la revisión no fija **cuándo se para** si no se cumplen las tres condiciones del embudo.
- **Corrección propuesta:** una sola tabla "Reglas vigentes de la ronda 1", firmada antes de lanzar, en `paid-meta-plan.md`, y borrar o tachar las demás. La regla automática pasaría a: "gasto ≥75 € **y** compras = 0 **y** pagos iniciados = 0 → pausar". He añadido un aviso de coherencia en los dos archivos (ver §8), pero **no he cambiado las reglas**.

### B3 · Vendedor de AliExpress desconocido: GPSR, responsabilidad y viabilidad legal del dropshipping

- **Dónde:** `plan-prueba.md` §6 y §8; `legal-borradores.md` §6; `landing-v2.html`, bloque "Información del producto".
- **Problema.** No sabemos quién es el vendedor (empresa, país, dirección), si existe un **operador económico establecido en la UE** responsable del producto (art. 16 GPSR, que remite al art. 4 del Reglamento 2019/1020), ni si el producto y su embalaje llevan los datos del fabricante y un identificador. "Envío desde ES" en AliExpress quiere decir que hay stock en un almacén español, no que el vendedor sea de la UE. Es COMPROBADO-buscador y la ficha no se pudo abrir.
- **Por qué importa:**
  - **Hacer dropshipping es legal, pero el vendedor ante el consumidor es Maikel o su empresa.** Responde de:
    - la conformidad durante **3 años** (art. 114 y ss. TRLGDCU), mientras que la protección de comprador de AliExpress dura semanas;
    - la entrega;
    - el desistimiento.
  - Como distribuidor (art. 12 GPSR), debe comprobar que el fabricante o el importador han cumplido con el etiquetado y la identificación. Si no hay operador UE, `legal-borradores.md` ya dice que **no se vende**, y es correcto.
  - Además, si el producto se vende con la marca "Ruta Perruna" puesta en el propio producto o en el embalaje, Maikel pasa a ser **fabricante** a efectos del GPSR (art. 13). La landing dice bien "No fabricamos la funda". Hay que mantenerlo así.
  - El "lote {{lote}}" de la ficha no se puede cumplir en dropshipping: cada unidad la envía el vendedor y no la vemos.
- **Corrección propuesta:**
  1. Antes de gastar nada más, pedir al vendedor (requiere autorización para contactar, según `registro.md`): razón social, dirección, operador UE responsable, etiqueta del producto y si puede enviar en **embalaje neutro, sin factura ni precio** dentro.
  2. Comprobar en la muestra la etiqueta física: fabricante, identificador y advertencias.
  3. Si falta el operador UE, no se lanza.
  4. En la ficha, cambiar "lote" por "modelo o tipo".
  5. Hacer lo mismo para la colchoneta del kit.

### B4 · Figura legal, IVA, facturas y datos obligatorios sin resolver

- **Dónde:** `plan-prueba.md` §6; `legal-borradores.md` §1 y §2; `landing-v2.html` (FAQ "¿Quién vende?" y footer).
- **Problema y por qué importa:**
  - **Figura legal:** sin NIF ni alta censal no se puede vender, y las páginas legales no se pueden rellenar.
    - Si es persona física (autónomo), hay que contar la cuota y el epígrafe de IAE de comercio minorista (VERIFICAR con un asesor).
    - Si se vende como **persona física minorista**, probablemente toque el **recargo de equivalencia**, que cambia la cuenta del IVA y el margen en varios euros por pedido, en cualquier sentido (VERIFICAR).
    - Si es Qualivo (sociedad), ver I10 sobre la reputación de Qualivo.
  - **Facturas de compra:** para deducir el IVA y el gasto hace falta una factura completa del proveedor con tu NIF. Para los vendedores no UE que envían dentro de la UE, AliExpress actúa como "proveedor presunto" a efectos del IVA. Si emite factura completa a empresas para estos pedidos es VERIFICAR.
    - El margen de 11 € ya supone que el IVA de la compra **no** se deduce (es prudente), pero sin factura el gasto tampoco está bien justificado en el IRPF o el IS.
  - **Facturas de venta:** Shopify no emite facturas españolas de serie; hace falta una app. VeriFactu será obligatorio en 2027 (VERIFICAR la fecha vigente): conviene elegir ya una herramienta compatible.
  - **Teléfono:** el art. 97.1.c TRLGDCU exige en la información precontractual la dirección completa, **el número de teléfono** y el email. Los borradores y la landing solo ponen email.
  - **Revisión profesional de las páginas legales:** está en la checklist, pero **no tiene presupuesto**. Puede costar tanto como la propia prueba.
- **Corrección propuesta:**
  - Decidir la figura y consultar a un asesor sobre el IVA y el recargo de equivalencia antes de abrir Shopify.
  - Añadir el teléfono (vale un móvil) al aviso legal, a las condiciones, a la FAQ y al footer.
  - Presupuestar la revisión legal o usar plantillas de un servicio con revisión incluida.
  - Elegir una app de facturas.

### B5 · La muestra: no hay plan B con margen, y una unidad no representa las demás

- **Dónde:** `plan-prueba.md` §5 y §8; `creative-pack.md` §0 y §4.3; `paid-meta-plan.md` §2.6.
- **Problema:**
  - Todas las creatividades y la mitad de la landing dependen de la muestra.
  - Si la funda de 21,49 € falla, la alternativa "mejor respaldada" (32,99 € desde Alemania) deja un margen de **−0,5 €** a 44,90 €. Hay **plan de pausa, pero no plan de continuidad**.
  - Además, la muestra es **una unidad**: las fichas de AliExpress cambian de fábrica o de material sin aviso, y el cliente recibe unidades que nadie ha visto. Frases como "Probada antes de venderla" y "Lo comprobamos antes de venderla" generalizan a partir de una sola unidad.
- **Por qué importa:** si la muestra falla, el gasto hecho (muestras y Shopify) se pierde y la prueba muere. En ese caso es mejor saberlo antes de crear la cuenta publicitaria y la tienda de pago. Y si la muestra pasa pero el lote no, las afirmaciones grabadas se vuelven engañosas.
- **Corrección propuesta:**
  1. Escribir el plan B: "si falla → no se lanza; se vuelve a la lista de candidatos, o se prueba el proveedor DE solo si el precio sube a ≥54,90 €" (decisión de negocio).
  2. No abrir Shopify de pago ni la cuenta publicitaria hasta que pasen las pruebas privadas de agua y correas.
  3. Redactar las pruebas como "en nuestra prueba con una unidad de muestra…".
  4. Pedir una segunda unidad con el primer pedido real y repetir la prueba de agua.

---

## 2. Importantes

### I1 · Los márgenes no incluyen Shopify ni la comisión real de cobro

- **Dónde:** `plan-prueba.md` §4 y §8; `paid-meta-plan.md` §4.1; `landing-v2-notas.md` §4 (Pagos).
- **Problema:** el margen de ~11 € usa la tarifa de **Stripe** (1,5 % + 0,25 €). En Shopify no se usa Stripe directamente: se cobra con **Shopify Payments**, y con una pasarela de terceros (PayPal, Redsys o Bizum) Shopify añade una **comisión por transacción** en el plan Basic (en torno al 2 %, VERIFICAR). Tampoco entran la cuota mensual, las apps ni los contracargos.

| Funda a 44,90 € (sin IVA: 37,11 €; proveedor 21,49 €; incidencias 10 % = 3,71 €) | Comisión | Margen antes de publicidad |
|---|---|---|
| Stripe 1,5 % + 0,25 € (lo que supone el plan) | 0,92 € | 10,98 € |
| Shopify Payments ~2,1 % + 0,30 € (VERIFICAR) | 1,24 € | 10,66 € |
| PayPal ~2,9 % + 0,35 € + ~2 % de Shopify (VERIFICAR) | 2,55 € | 9,36 € |
| Kit a 79,90 € con Shopify Payments | 1,98 € | 8,59 € |

- **Costes fijos fuera del margen:**
  - Shopify Basic (~24–36 €/mes según el informe, DECLARADO; puede haber una promoción de 1 €/mes los primeros meses, VERIFICAR).
  - Banner de cookies y app de facturas (0–15 €/mes).
  - Contracargos (comisión fija por disputa, VERIFICAR).
  - Las comisiones de cobro **no se devuelven** al reembolsar.
  - Con 1–4 pedidos, los costes fijos pesan más que todo el margen.
  - Shopify Payments retiene los primeros cobros de tiendas nuevas (3–5 días hábiles, COMPROBADO en el informe), y Maikel adelanta el pago a AliExpress.
- **Corrección propuesta:** recalcular §8 con Shopify Payments y la cuota real en EUR, mostrar el margen "con PayPal" como escenario y, si Bizum exige pasarela de terceros, medir su coste antes de activarlo. No cambia la decisión, pero el CPA de equilibrio real ronda los **10–10,5 €**, no los 11 €.

### I2 · Riesgo operativo: proveedor con 35 ventas y 3 reseñas, y sin protocolo de rotura de stock

- **Dónde:** `plan-prueba.md` §6 (proceso de pedido) y §8; `landing-v2-notas.md` §4 (inventario "seguir vendiendo").
- **Problema:**
  - **Stock.** Un vendedor pequeño puede quedarse sin stock en el almacén español y pasar a enviar desde China (2–4 semanas, con aduana) sin avisar. También puede subir el precio o retirar la ficha.
  - **Pedidos manuales.** Cada pedido se compra a mano con la dirección del cliente.
  - **Embalaje.** El paquete puede llevar la marca de AliExpress, el precio o una factura del vendedor.
  - **Precio a la vista.** Cualquiera encuentra la misma funda a 21,49 € con una búsqueda por imagen.
- **Por qué importa:**
  - Si no se puede entregar, la ley exige informar y reembolsar sin demora indebida. El art. 66 bis TRLGDCU fija un máximo de 30 días si no se pactó otro plazo, y la landing promete 3–6 días.
  - Sustituir el producto por otro distinto sin consentimiento no vale.
  - Los retrasos generan disputas y **bajan la puntuación de comentarios de clientes de Meta**, que puede limitar la entrega de los anuncios de la cuenta.
- **Corrección propuesta.** Protocolo escrito antes de lanzar:
  1. Comprobar a diario el stock y el país de envío en la ficha. Si cambia, pausar los anuncios el mismo día.
  2. En Shopify, inventario con seguimiento y una cantidad pequeña (por ejemplo, 5), sin "seguir vendiendo".
  3. Ante una rotura de stock con pedidos pagados: avisar en 24 h, ofrecer el reembolso inmediato o, solo con su consentimiento, esperar o recibir el proveedor alternativo (asumiendo la pérdida, que con 1–4 pedidos se puede asumir).
  4. Pedir al vendedor embalaje neutro.
  5. Preparar una respuesta honesta para "esto está en AliExpress a 20 €".

### I3 · Plazo real: Navidad, Black Friday y temporada

- **Dónde:** `plan-prueba.md` §7; `paid-meta-plan.md` §1.5 y §5C; revisión final, punto 1.
- **Problema.** Calendario realista desde hoy (11/10):

| Hito | Fecha probable |
|---|---|
| Llega la muestra (ES 3–6 días; el pack dice 4–10) | 15–21/10 |
| Pruebas privadas, rodaje y edición de 12 archivos de anuncio y V1–V5 | 18–28/10 |
| Figura legal, Shopify, páginas legales revisadas, píxel y CAPI, compra de prueba | en paralelo, con riesgo de que se alargue |
| Cuenta publicitaria nueva, verificación y revisión de anuncios (subida en D-2) | +2–4 días |
| **D1 de la ronda 1** | **~1–5/11** |
| Lectura y decisión (D7) | ~8–12/11 |
| Ronda 2 con creatividades nuevas y el ángulo de Navidad | **~20/11 en adelante: coincide con Black Friday (27/11) y el Cyber Monday**, cuando suben los CPM |
| Fecha límite de pedido para recibirlo antes de Nochebuena (3–6 días laborables + 2 de margen) | ~14–15/12 |

- **Por qué importa:**
  - La ronda 1 cae en la peor combinación: **fuera de la temporada de búsqueda** de la funda (Trends: picos en julio, agosto y marzo; casi 0 en el cuarto trimestre) y con CPM al alza.
  - El único gancho de temporada (Navidad + kit) se ha sacado de la ronda 1.
  - La ventana de Navidad de la ronda 2 queda en ~2–3 semanas con CPM caros y almacenes saturados.
- **Corrección propuesta:** asumir que la ronda 2 de Navidad depende de que la ronda 1 empiece **antes del 5/11**. Si no, la ronda 2 se aplaza a enero o febrero ("cuesta de enero" y temporada de escapadas), o se reconsidera el producto.

### I4 · El kit en la ronda 1: un segundo proveedor sin respaldo y un plazo que la landing no cumple

- **Dónde:** `landing-v2.html` (selector, bloque del kit, barra superior y microgarantía del plazo); `plan-prueba.md` §8; revisión final, punto 1.
- **Problema:**
  - A3 pasa a la ronda 2, pero el kit sigue a la venta en la landing.
  - La colchoneta viene de **otro vendedor** (DE, 5–10 días, **1 venta**, sin reseñas). El kit llega en **dos paquetes, en fechas distintas**, y la barra superior y la FAQ prometen "3–6 días laborables, desde un almacén en España".
  - El kit además deja menos margen (8,6–9,1 €) y duplica el trabajo de GPSR, muestra y devoluciones.
- **Por qué importa:**
  - Es información precontractual inexacta sobre el plazo y el origen.
  - Añade un segundo punto de fallo justo cuando el kit no se puede medir (B1).
- **Corrección propuesta** (decisión de Maikel): **quitar el kit de la ronda 1** y dejar solo la funda. La alternativa es mantenerlo con un plazo propio ("kit: {{5–10}} días, en dos envíos") y con la muestra de la colchoneta probada. Recomiendo quitarlo.

### I5 · Afirmaciones sin probar que no están marcadas, y algunas inexactas

- **Dónde:** `landing-v2.html`.
- **Problemas:**
  - **Afirmaciones que dependen de [PRUEBA-AGUA] y no llevan marca:**
    - H1 "…Y el asiento, limpio.";
    - meta description "Barro, pelo y patas mojadas en la funda, no en la tapicería";
    - fila de la comparativa "Cubre todo el asiento: Sí".
  - **Datos sin confirmar fuera de las marcas:** "Llega en 3–6 días laborables" en la barra superior y en el CTA final, y "desde un almacén en España". Solo están marcados en la microgarantía y en la FAQ.
  - **Afirmaciones sin ningún protocolo de prueba detrás:**
    - "la hemos probado… **en curvas**" (hero), cuando no hay prueba en marcha y el pack prohíbe grabar con el coche en marcha;
    - "montándola **una y otra vez**";
    - la hipótesis 4 de `landing-v2-notas.md` §3 repite "llevado en curvas".
  - **"Probada antes de venderla"** sugiere que se prueba cada unidad (ver B5).
  - **Afirmaciones sobre la competencia sin fuente en la página:**
    - "Funda básica… Es la queja n.º 1 en reseñas";
    - "Fotos de catálogo".
    - Tienen base en las ~108 reseñas del registro, pero una comparativa tiene que poder demostrarse (art. 10 de la Ley de Competencia Desleal).
  - **Garantía:** "Como en cualquier compra a un vendedor en la UE, tienes la garantía legal de 3 años" es inexacto. El mínimo de la UE son 2 años; los 3 años son de España.
- **Por qué importa:** son prácticas engañosas por acción (art. 5 LCD) y la puerta más fácil para una reclamación o una denuncia de un competidor.
- **Corrección propuesta:**
  - Marcar como [PRUEBA] el H1, la meta description y la fila "Cubre todo".
  - Marcar como {{confirmar}} todas las menciones al plazo.
  - Quitar "en curvas" y "una y otra vez", o sustituirlos por los nombres de las pruebas reales (agua, tirones, correas).
  - Cambiar la frase de la garantía por "Como establece la ley española, tienes 3 años de garantía legal…".
  - Guardar las capturas de las reseñas que respaldan "queja n.º 1", o cambiarlo por "una queja frecuente".

### I6 · RGPD, cookies y emails

- **Dónde:** `legal-borradores.md` §5; `paid-meta-plan.md` §6 (CAPI "Máximo"); `anuncios-y-emails.md`, emails 2 y 3; `landing-v2-notas.md` §4 y §5.
- **Problemas:**
  - **Destinatarios incompletos.** La política de privacidad no menciona a **Meta** como destinatario y corresponsable del píxel y de la API de conversiones (doctrina Fashion ID), ni al **vendedor de AliExpress**, que recibe nombre, dirección y teléfono del cliente. Esto último es probablemente una **transferencia internacional a China**, sin decisión de adecuación: hay que informar de ella y justificarla (art. 49.1.b RGPD, necesaria para ejecutar el contrato, VERIFICAR).
  - **CAPI en "Máximo"** envía datos con hash desde el servidor. Que respete el rechazo de cookies está marcado como VERIFICAR, y debe verificarse de verdad, no darse por hecho.
  - **Carrito abandonado:** los emails 2 y 3 son comunicaciones comerciales. La LSSI (art. 21) exige consentimiento previo, salvo para clientes con contrato previo, y quien abandona el carrito **no** es cliente. Enviárselos solo con el email del checkout es un riesgo sancionable por la AEPD.
  - **Clarity o grabación de sesiones:** necesita consentimiento.
- **Corrección propuesta:**
  - Añadir Meta y el proveedor (con el país) a los destinatarios y a las transferencias.
  - Probar en el Explorador de eventos qué llega por CAPI con las cookies rechazadas.
  - Enviar los emails de carrito solo a quien marque la casilla de marketing (desmarcada) o aceptar el riesgo de forma consciente.
  - He dejado un aviso en el email 2.

### I7 · Cláusulas de los borradores legales que pueden limitar derechos

- **Dónde:** `legal-borradores.md` §4 ("Si el paquete llega dañado, escríbenos con fotos en un plazo de 7 días").
- **Problema:** un plazo de 7 días puede leerse como un límite a la garantía de conformidad (3 años). Sería una cláusula abusiva (art. 86 TRLGDCU).
- **Corrección:** "Te pedimos que nos avises cuanto antes, con fotos; esto no limita tu garantía legal."
- **Además:**
  - La dirección de devolución será probablemente **la casa de Maikel** y quedará publicada. Mejor un apartado de correos o una dirección profesional.
  - Comprobar si la comunidad autónoma exige informar online de las hojas de reclamaciones (VERIFICAR).
  - Confirmar la referencia de resolución alternativa de litigios, ya que la plataforma ODR ya no funciona.

### I8 · Reputación y atención al cliente

- **Dónde:** `landing-v2.html` (microgarantía "Te contesta una persona en < 24 h", Maikel a cámara en H08); `paid-meta-plan.md` A2H3.
- **Problemas:**
  - **Comentarios en los anuncios.** Los anuncios de dropshipping en España suelen recibir comentarios de "esto está en AliExpress / Temu a X €". Con el gancho H08, la cara de Maikel queda asociada a esa conversación.
  - **Carga de trabajo.** La promesa de responder en menos de 24 h, más los pedidos manuales, más las consultas de compatibilidad (el mailto "¿Vale para mi coche?") y el "¿dónde está mi pedido?", recaen sobre una sola persona en noviembre y diciembre.
  - **Riesgo para la cuenta.** Si los retrasos generan disputas, bajan la puntuación de comentarios de Meta y la salud de la cuenta publicitaria.
- **Corrección propuesta:**
  - Plantillas de respuesta: plazo, compatibilidad, "¿por qué más caro?" (la respuesta honesta ya está en la comparativa) y retraso.
  - Moderar a diario los comentarios de los anuncios, sin borrar las críticas legítimas.
  - Fijar quién cubre los fines de semana. Si no hay nadie, cambiar a "en menos de 24 h laborables" en todos los sitios: la barra superior dice "24 h" a secas.

### I9 · La marca de Qualivo y los datos de sus clientes

- **Dónde:** `plan-prueba.md` §6 ("Qualivo, autónomo u otra"); `paid-meta-plan.md`, revisión final ("el agente pide el permiso de Maikel para compartir datos agregados y anonimizados" de cuentas de clientes).
- **Problema:**
  - Si se vende como Qualivo, el aviso legal de una tienda de dropshipping de AliExpress queda ligado al negocio principal.
  - Usar datos de las cuentas publicitarias de **clientes** para un proyecto propio requiere su autorización, o al menos que lo permitan el contrato y el encargo de tratamiento. El permiso de Maikel no basta, aunque los datos estén agregados.
- **Corrección:**
  - Decidir de forma consciente con qué nombre se vende.
  - No usar datos de clientes sin revisar los contratos. Los datos propios de Qualivo, sí.

### I10 · Presupuesto: se sale de lo autorizado en el registro

- **Dónde:** `../registro.md` (publicidad 250 €, total 500 €); `plan-prueba.md` §4; `paid-meta-plan.md` §5.
- **Problema:**
  - Ronda 1 + ronda 2 suman **300 €** de Meta, frente a los 250 € autorizados.
  - Las muestras son ~49 €, frente a 25–45 €.
  - La revisión legal y fiscal no está presupuestada.
  - Además, el registro dice que "la investigación no autoriza compras, contacto con proveedores, publicación ni campañas".
- **Corrección:** autorización explícita de Maikel con el presupuesto total actualizado, incluidos el asesor y los meses de Shopify.

### I11 · Políticas de Meta: riesgo bajo, con matices

- **Dónde:** `paid-meta-plan.md` §0.4, §2 y la revisión, punto 9; `creative-pack.md` §1.
- **Lo que está bien:**
  - No hay atributos personales, salud ni edad.
  - La pantalla partida es real y no usa el rótulo "Antes / ahora". La prohibición de antes/después de Meta se refiere a la salud y al aspecto físico, no a tapicerías, pero aun así conviene mantenerlo así.
  - El perro nunca va suelto.
  - La IA nunca muestra el producto.
- **Riesgos que quedan:**
  1. **Variantes que interpelan a la persona:** las variantes A de H05 ("Si tu coche tiene esto, sigue viendo") y H07B ("¿Cuánto tiempo pasas aspirando…?") no infringen la política, pero chocan con la regla interna. El plan ya usa las descriptivas, así que hay que vigilar al editar.
  2. **Restricciones de las cuentas nuevas:** límite de gasto diario inicial y revisiones largas. Ya está en la checklist.
  3. **Puntuación de comentarios** (ver I2 e I8).
  4. Los titulares con "Probada con agua antes de venderla" solo se publican si la prueba pasa. Ya están marcados.

---

## 3. Menores

| # | Archivo y sección | Problema | Corrección |
|---|---|---|---|
| M1 | `paid-meta-plan.md` §2.3–2.5 y §3.1 | IDs de vídeo erróneos: A1 "V9 en H3" (es V3 + V6), A2 "V9 en H3" (es V8), A3 "Cuerpo: V8" (es V9 o V5) y el ejemplo `RP_R1_A1H3_V9-V6` | **Aplicado** (ver §8) |
| M2 | `paid-meta-plan.md` §1.1 frente a `creative-pack.md` §5.4 | Zona segura inferior del 9:16: ~20 % frente a ~35 %. El 20 % vale para Stories y el 35 % para Reels | Usar el 35 % para todo (el área común del pack) |
| M3 | `creative-pack.md` §0.1 | "Si la prueba falla… pausa y análisis" para cualquier prueba, cuando la tabla del propio pack y `paid-meta-plan.md` §2.6 solo pausan con agua (y correas). Para el resto, se quita la frase | Limitar la pausa a agua y correas, como en `plan-prueba.md` §5 |
| M4 | `creative-pack.md` §1, notas | Habla de un "conjunto de prueba" y de un "conjunto de kit" que no existen en la estructura vigente | Actualizar con la próxima versión del pack |
| M5 | `landing-v2-notas.md` §6 | "Prueba de agua… Si pasa, **no** se usa 'impermeable'": ambiguo, probablemente quería decir "si no pasa" (o "ni siquiera si pasa") | Aclarar según la tabla del pack: si pasa, se usa el resultado concreto; si falla, nunca "impermeable" |
| M6 | `landing-v2-notas.md` §3 | Tráfico estimado de 210–375 visitas (CPC 0,40–0,70 €) y 5–15 compras, frente a la revisión final (CPM de hasta 20 € y 0–10 compras) y el dato real de CPC de 1,28 € | Actualizar a 45–225 visitas (tabla de B1) |
| M7 | `plan-prueba.md` §2 y §5 | Tabla de oferta con la colchoneta como producto principal (44,90/39,90/69,90 €) y reglas antiguas | **Aviso aplicado**. Precios y reglas sin tocar |
| M8 | `paid-meta-plan.md` §0.5 y §1.3 | Hablaban de textos y exclusiones de `anuncios-y-emails.md` que ya no existían | **Aplicado** |
| M9 | `creative-pack.md` (cabecera) | "La muestra llega en 4–10 días", frente a los ~4 días de ES de `plan-prueba.md` §8 | Confirmar con el seguimiento real |
| M10 | `landing-v2.html` | La FAQ "¿Sirve para un perro grande?" y la etiqueta "perros medianos y grandes" dependen del perro del rodaje | Ya está marcado. Sin perro grande, quitar la etiqueta |
| M11 | `plan-prueba.md` (cabecera) | Marca sin comprobar en la OEPM y la EUIPO, y dominio sin registrar | Hacerlo antes de imprimir nada o de crear las cuentas de Meta e Instagram con ese nombre |
| M12 | `paid-meta-plan.md` §1.4 y §3.2 | A3 aterriza con el kit **preseleccionado** por URL, mientras `landing-v2-notas.md` §0 dice "El kit nunca va preseleccionado" (art. 60 bis) | Para la ronda 2: que el anuncio del kit lleve a la ficha con el kit seleccionado es defendible (es lo que la persona ha pulsado), pero hay que decidir una sola regla y escribirla |
| M13 | `landing.html` | v1 con afirmaciones sin probar ("No resbala… en las curvas", "Turismos y SUV") y el desistimiento como respuesta a la compatibilidad | **Marcada como obsoleta** |

---

## 4. Supuestos frágiles (por orden de fragilidad)

1. **Conversión de la landing ≥ 6–10 %** con tráfico frío, tienda sin reseñas y precio doble del de mercado. Es lo que exige el equilibrio con un CPM de 8–12 € (B1). Es el supuesto del que depende todo.
2. **CPM de 6–8 €** en España en noviembre. La revisión ya lo sube a ≤12 € como "bien", y el dato real de Qualivo es de 29,8 €.
3. **Que el comprador no compare precios.** El propio informe lo llama "debilidad, no ventaja". Tiendanimal vende fundas a 17,50–31 € con envío gratis, y Lidl la ha vendido a 6–8 €.
4. **Que el proveedor tenga stock en España y mantenga el precio** durante 2 meses, con 35 ventas en total.
5. **Que la unidad de muestra represente las demás.**
6. **Incidencias del 10 %.** Una sola devolución con etiqueta pagada por nosotros (~12,64 € para 1–2 kg) y el producto perdido cuestan ~34 €, unos 3 pedidos de margen.
7. **Pagos iniciados que terminan en compra: 50 %.** De este supuesto cuelga la regla de "seguir".
8. **Que "envío desde ES" sea un vendedor con un operador UE** que cumpla el GPSR.

---

## 5. ¿Qué pasa si…? (huecos del plan)

| Situación | Qué dice el plan | Qué falta |
|---|---|---|
| La muestra no pasa el agua o las correas | Pausa y reembolso | Un plan de continuidad: no hay un proveedor con margen (B5) |
| La muestra pasa, pero un cliente recibe una unidad peor | — | Reembolso o cambio sin discutir, retirar la afirmación afectada y repetir la prueba con una segunda unidad |
| El proveedor se queda sin stock con pedidos pagados | — | El protocolo de I2 |
| El proveedor pasa a enviar desde China | — | Pausar los anuncios. Los pedidos ya pagados se reembolsan o se avisa del nuevo plazo, a elección del cliente |
| Llega un pedido de kit | Dos líneas al proveedor | Dos paquetes, dos plazos y el texto de la landing (I4) |
| Una sola venta | Seguir por embudo | Qué valor de embudo mata la prueba (B1 y B2) |

---

## 6. La pregunta incómoda, desarrollada

- **Este producto no pasa el filtro de nuestra propia investigación.**
  - El informe y el registro dejaron P06 condicionado a un "proveedor UE ≤12 € puesto" y a un ticket ≥39,90 €. Lo segundo se cumple, pero lo primero no: 21,49 €.
  - El margen sale porque se sube el precio a 44,90 €, y así el problema pasa a ser la conversión, que es el supuesto 1.
- **El mejor resultado posible no es una decisión de negocio.**
  - Aunque la ronda 1 salga muy bien (CPA ≈ 11 €), el beneficio es ~0 € por pedido antes de los costes fijos.
  - "Escalar y negociar lote o almacén" no tiene un camino conocido para la funda: el único proveedor de lote cotizado es el de la colchoneta.
- **Entonces, ¿para qué sirve?** Lo honesto es reconocer que la ronda 1 vale como:
  1. **Aprender a montar el embudo:** Shopify, legal, píxel y CAPI, y creatividades con pruebas. Todo eso se reutiliza con el siguiente producto.
  2. **Comprobar un estilo creativo** ("probamos lo que suele fallar").
  3. **Conseguir una cota del coste por visita en Meta España en el cuarto trimestre**, que sirve para descartar otros candidatos sin gastar.
- **Si ese es el objetivo,** conviene decidirlo así y preguntarse si el producto de aprendizaje debería ser uno con más margen o un test más barato. El informe proponía una página de lista de espera con 30–50 € para medir CTR y coste por visita antes de montar la tienda con cobro, y ese paso se ha saltado.

---

## 7. Recomendación

**No lanzar todavía.** Lanzar **con cambios** cuando se cumpla esta lista mínima:

1. **Decisión explícita de Maikel sobre el objetivo** (§6): "ronda de aprendizaje de embudo" o "validación de negocio". Si es la segunda, este producto con este proveedor no la puede dar.
2. **Una sola tabla de reglas vigentes** (B2), con un criterio de muerte medible con 150 €: coste por visita a la landing y CTR. Regla automática corregida.
3. **Figura legal, NIF, régimen de IVA consultado con un asesor, app de facturas y teléfono** en la información precontractual (B4).
4. **Datos del vendedor y del operador UE (GPSR) confirmados**, y etiqueta comprobada en la muestra. Sin ellos no se lanza (B3).
5. **Muestra con las pruebas privadas de agua y correas superadas** antes de abrir Shopify de pago y la cuenta publicitaria, y plan B escrito (B5).
6. **Kit fuera de la ronda 1**, o con plazo propio y su muestra probada (I4).
7. **Landing:** marcar o quitar las afirmaciones de I5 ("en curvas", H1, plazo y garantía "UE").
8. **Privacidad y emails:** Meta y el proveedor en la política, prueba de CAPI con cookies rechazadas y carrito abandonado solo con consentimiento (I6). Corregir la cláusula de los 7 días (I7).
9. **Protocolo de stock y de atención** escrito (I2 e I8).
10. **Presupuesto autorizado** con los 300 € de Meta, el asesor y los meses de Shopify (I10).

Si los puntos 3–5 no están resueltos antes del **5/11**, recomiendo no lanzar la funda en noviembre (I3) y usar ese tiempo en un candidato con más margen, o hacer la prueba barata de coste por visita.

---

## 8. Cambios aplicados (tarea 2: solo coherencia, sin decisiones de negocio)

No he cambiado precios, reglas de decisión ni estrategia. No he hecho commit.

| Archivo | Cambio |
|---|---|
| `anuncios-y-emails.md` | Reescrito para alinearlo con el plan vigente: <br>· **funda como producto principal**; <br>· estructura de **2 conjuntos ABO × 15 €/día** (A1 barro y A2 pelo); <br>· **A3 Navidad + kit en la ronda 2**; <br>· resúmenes de A1 y A2 que remiten a `paid-meta-plan.md`; <br>· emojis quitados (regla de la ronda 1); <br>· normas con "sin derechos legales como ventaja"; <br>· **emails 2 y 3 hablan de la funda** (el 3, con la pregunta por marca y modelo); <br>· nota de UTM `utm_medium=email`; <br>· aviso de consentimiento en el email 2; <br>· los textos antiguos de la colchoneta pasan a "Reserva (no usar en la ronda 1)", porque `paid-meta-plan.md` §5A cita el ángulo de terrazas. |
| `landing.html` | Comentario HTML al principio: **OBSOLETA**, sustituida por `landing-v2.html`; no usar ni publicar. |
| `paid-meta-plan.md` | **Aviso de coherencia** en la cabecera, con la lista de lo que la revisión final sustituye (conjuntos, regla de los 75 €, decisión por CPA, CPM, plan B, corte de anuncios, D-2). <br>**IDs de vídeo corregidos:** A1 (V6; en H3, V3 + V6), A2 (V7; en H3, V8), A3 (V9; en H3, V5; marcado como ronda 2) y el ejemplo de nombre `RP_R1_A1H3_V3-V6_916-45_v1`. <br>§0.5 marcado como resuelto y §1.3 sin la referencia obsoleta a Baleares. |
| `plan-prueba.md` | **Aviso de coherencia** antes de §1 (§1–5 y §7 son de la etapa de la colchoneta; mandan §8 y la revisión final). En el diagrama del funnel: 2 ángulos y landing de la funda (`landing-v2.html`). En el presupuesto: 2 conjuntos × 15 €/día. En el calendario: vídeos según `creative-pack.md` (6 anuncios en la ronda 1). Precios de §2 y reglas de §5 **sin tocar**. |
| `creative-pack.md` | Documentos relacionados: `landing-v2.html` (v1 obsoleta) y `paid-meta-plan.md`. Los textos de apoyo de V6–V9 remiten a `paid-meta-plan.md` §2.3–2.5 y V9 queda en la ronda 2. |
| `landing-v2-notas.md` | §4: los emails ya hablan de la funda, con un aviso de consentimiento para el carrito abandonado. |

**No aplicado (son propuestas, porque implican decidir algo):** todo lo de B1–B5, I1–I11 y M2–M6, M9–M12. En concreto: textos de la landing (I5), quitar el kit (I4), reglas (B2), márgenes (I1) y la cláusula de los 7 días (I7).
