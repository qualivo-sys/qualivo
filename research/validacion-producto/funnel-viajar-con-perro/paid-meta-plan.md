# Plan de Meta Ads · Ruta Perruna · Ronda 1

Fecha: 2026-10-11 · Estado: **preparado, sin publicar** · Presupuesto: **150 € máx.**
Producto principal: **funda de coche tipo hamaca, 44,90 €** (margen antes de publicidad ESTIMADO ~11,0 €). Subida de ticket: **kit funda + colchoneta, 79,90 €** (margen ESTIMADO ~9,1 €). Envío gratis a la Península. Proveedor en España, plazo de 3–6 días (PENDIENTE de confirmar con el primer pedido de muestra).

Este documento sustituye la sección "Campaña: estructura" de `anuncios-y-emails.md`. Los textos de anuncio de ese archivo se escribieron para la colchoneta, así que no se usan en esta ronda (ver nota de políticas en el punto 2.1).

**Leyenda:** [PRUEBA] = afirmación que no se publica hasta que la muestra la supere. HIPÓTESIS / ESTIMADO = cifra de referencia que no viene de datos propios. Se explica cómo está calculada y se sustituye por el dato real en cuanto haya gasto.

---

## 0. Lo que conviene saber antes de empezar

1. **El kit deja menos margen que la funda sola** (9,1 € frente a 11,0 €). Cada venta del kit en lugar de la funda reduce el CPA que podemos pagar. En la ronda 1 el kit sirve para medir si sube el ticket, pero el ángulo 3 tiene un CPA de equilibrio más bajo (ver punto 4). Para la ronda 2 conviene recalcular el precio del kit, por ejemplo a 84,90 €, o negociar el coste de la colchoneta.
2. **Con 150 € no se sale de la fase de aprendizaje.** Meta necesita unas 50 conversiones por conjunto de anuncios en 7 días, y esperamos entre 0 y 10 compras en total. Veremos el aviso "Aprendizaje limitado" y es normal. No es motivo para tocar la campaña.
3. **La cuenta es justa.** Con cifras de referencia razonables para España (CPM 6–8 €, CTR de enlace del 1–1,5 % y conversión de la landing del 2 %, todo HIPÓTESIS), el CPA sale entre 25 y 40 €. Llegar a ≤15 € exige que la creatividad y la landing estén claramente por encima de la media. La prueba sirve precisamente para averiguar si lo están.
4. **Política de atributos personales de Meta.** Prohíbe afirmar o insinuar en el texto del anuncio atributos de la persona que lo ve: raza u origen étnico, religión o creencias, edad, orientación sexual, identidad de género, discapacidad o salud física o mental, situación económica, afiliación sindical, antecedentes penales y nombre. Tener perro no aparece en esa lista. Aun así, en esta campaña:
   - No interpelamos a la persona por su situación ("¿Tienes perro?", "Si tienes perro…"). Describimos escenas y el producto ("Del monte al coche…", "Pelo de perro en la tapicería…"). Así también nos separamos del copy de Bonotienda.
   - Nunca mencionamos salud ni edad de la persona o del perro: ni "alergia al pelo", ni "si tienes más de 50", ni "perro mayor con problemas de cadera", ni "perro ansioso o mareado".
   - Nada de situación económica ("si no puedes pagar una tapicería nueva").
   - Verificar la redacción vigente de la política en el Centro de ayuda para empresas de Meta antes de publicar (VERIFICAR: la lista anterior es la que conocemos, puede haber cambiado).
5. **Seguridad vial.** En ningún vídeo aparece el perro suelto con el coche en marcha. Si se graba en marcha, el perro lleva arnés enganchado al cinturón. La funda **no** se presenta como sistema de retención, en línea con la FAQ de la landing.

---

## 1. Estructura de cuenta y campaña

### 1.1 Decisiones

| Decisión | Elección | Por qué |
|---|---|---|
| Tipo de campaña | **Ventas, configuración manual** (no Advantage+ Sales) | Queremos aprender **qué ángulo** funciona. Advantage+ Sales mete todos los anuncios en un solo bloque y lo reparte de forma opaca. Con 150 € concentraría el gasto en 1–2 anuncios desde el primer día y no sabríamos si los otros ángulos fallan o simplemente no se probaron. Advantage+ Sales es buena candidata para la **ronda 2**, con los anuncios ganadores. |
| Evento de optimización | **Purchase (compra)** | Ver 1.2 |
| Estrategia de puja | **Mayor volumen**, sin límite de coste ni de puja | Sin historial, un límite de coste haría que la campaña apenas gaste. |
| Presupuesto | **ABO**: presupuesto por conjunto de anuncios, 3 conjuntos × **10 €/día** = 30 €/día durante 5 días | Con CBO (presupuesto de campaña Advantage+), Meta podría dejar un ángulo con 3 € de gasto. Con ABO cada ángulo recibe unos 50 €. Dentro de cada conjunto, Meta reparte libremente entre los 3 ganchos. |
| Tope de gasto | Límite de gasto de la **campaña: 150 €**. Límite de la **cuenta: 160 €** | Garantía dura de que no se pasa del presupuesto. |
| Regla automática | "Si el gasto de la campaña es ≥ 75 € y las compras = 0, pausar la campaña", comprobada cada 30 min | Aplica la regla de parada sin depender de que alguien mire. |
| Ubicaciones | **Advantage+ placements**, excluyendo **Audience Network** (y Messenger si aparece suelto) | Con poco presupuesto, Audience Network suele aportar clics de baja calidad (HIPÓTESIS habitual, no medida en esta cuenta). Reels, Stories y feed de Instagram y Facebook se quedan. |
| Formatos | Un vídeo por anuncio con **personalización por ubicación**: **9:16** para Reels y Stories, **4:5** para feeds | Cada ubicación recibe el formato que le corresponde. Se deja una zona segura de ~14 % arriba y ~20 % abajo en el 9:16. |
| Mejoras Advantage+ de creatividades | **Desactivadas todas**: música, variaciones de texto, ampliación de imagen, retoques, superposiciones, "enlaces del sitio", anuncios de varios anunciantes y "creatividad dinámica" | Las mejoras automáticas pueden reescribir el texto, lo que podría añadir afirmaciones sin probar, y además contaminan la comparación entre ganchos. |
| Atribución | **7 días tras clic y 1 día tras visualización** (la configuración por defecto) | Es la ventana con la que Meta optimiza. En el informe se añaden las columnas comparativas "1 día tras clic" y "7 días tras clic" para separar las ventas "tras ver" (menos fiables). **La verdad la tiene Shopify:** pedidos con `utm_source=facebook\|instagram` (ver punto 3). |

### 1.2 Optimizar a Purchase o a AddToCart

- **Optimizamos a Purchase.** La pregunta de la prueba es **cuánto cuesta una venta**. Si optimizamos a AddToCart, Meta busca a gente que añade al carrito con facilidad, que suele ser un público distinto del que paga. El CPA de compra saldría peor y además la lectura quedaría sesgada. Con 150 € no vamos a salir del aprendizaje de ninguna forma, así que lo que de verdad perdemos con Purchase es poco. En una cuenta sin historial, Meta también usa señales del sector y de comportamiento.
- **Plan B (solo por un problema de entrega, no por falta de ventas):** al final del **día 2**, si la campaña **gasta menos del 50 %** de lo previsto (<30 € acumulados) **o** el CPM supera los 20 €, es que Meta no encuentra a quién enseñar el anuncio con un evento sin datos. En ese caso:
  1. Se duplica la campaña con optimización a **InitiateCheckout**, que es el evento intermedio más cercano a la compra, con la misma estructura y los mismos anuncios. La original se pausa.
  2. Si InitiateCheckout tampoco entrega, se pasa a **AddToCart**.
  3. Las reglas de decisión se siguen leyendo con el **CPA de compra** (Purchase en Shopify), no con el evento optimizado.
- Si la campaña entrega bien pero no vende, **no** se cambia a AddToCart. Se aplica la regla de los 75 €: pausar y diagnosticar (ver punto 5).

### 1.3 Segmentación

| Parámetro | Valor |
|---|---|
| Público | **Público Advantage+ (amplio)** en los 3 conjuntos. Sin intereses. Sugerencia de edad: 25–65 años, como pista, no como límite. |
| Ubicación | **España**, excluyendo **Islas Baleares, provincia de Las Palmas, provincia de Santa Cruz de Tenerife, Ceuta y Melilla**. Ojo: `anuncios-y-emails.md` no excluía Baleares, y Baleares no es Península. |
| Límites fijos | Edad mínima 18 años. Idioma: no se limita, porque el texto ya está en español. |
| Por qué es amplio | El producto ya filtra al público: un vídeo de un perro con barro subiendo al coche solo engancha a quien tiene ese problema. En España, los intereses ("perros", "mascotas") son públicos de millones de personas, poco precisos y que inflan el CPM. Mantener el mismo público en los 3 conjuntos deja **el ángulo como única variable**. Los intereses se prueban, si acaso, en la ronda 2. |
| Exclusiones de público | Ninguna en la ronda 1, porque no hay compradores. Cuando los haya, se excluye a quien ha comprado en los últimos 30 días. |
| Protección en la tienda | En el checkout de Shopify, las zonas de envío solo incluyen la Península. Así no entran pedidos de las zonas excluidas aunque Meta muestre el anuncio a alguien que esté allí de paso. |

### 1.4 Estructura

```
Campaña  RP_R1_VENTAS_PUR_ABO_ES-PEN_2610      (límite de gasto 150 €)
├─ Conjunto 1  RP_R1_A1-barro_BROAD_PEN_10EUR      10 €/día → A1H1, A1H2, A1H3
├─ Conjunto 2  RP_R1_A2-pelo_BROAD_PEN_10EUR       10 €/día → A2H1, A2H2, A2H3
└─ Conjunto 3  RP_R1_A3-navidad-kit_BROAD_PEN_10EUR 10 €/día → A3H1, A3H2, A3H3
```

Las URL de destino son estas:
- A1 y A2: ficha de la funda, con la funda preseleccionada.
- A3: la misma ficha, con el kit preseleccionado (por ejemplo `?variant=<id-kit>` o un ancla `#kit`).

### 1.5 Calendario (5 días de gasto y 2 de lectura)

| Día | Qué pasa | Qué hace el equipo |
|---|---|---|
| D-2 | Checklist técnica (punto 6) y compra de prueba | Cerrar todos los puntos marcados como bloqueantes |
| D-1 | Se sube la campaña **programada** para D1 a las 00:00 (Europe/Madrid) | Revisión de anuncios de Meta. Se cuenta con hasta 24 h, y en cuentas nuevas a veces más. |
| D1 | Empieza el gasto: 30 €/día | **No tocar nada.** Solo se comprueba que entrega y que llegan eventos. |
| D2 | ~60 € acumulados | Revisión del día 2 (punto 4.3). Plan B de entrega si hace falta. |
| D3 | ~90 € acumulados. **Hacia la mitad del día se pasan los 75 €** | Regla de los 75 € y revisión del día 3 |
| D4 | ~120 € | Solo se mira, salvo que salte una regla |
| D5 | ~150 €. La campaña se para sola por el límite de gasto | Cierre de datos |
| D6–D7 | Sin gasto. Se esperan las conversiones atribuidas con retraso | Cruce de Meta con Shopify y decisión según las reglas del punto 4 |

**Importante:** el 11/10 queda un poco pronto para el ángulo de Navidad. La ronda 1 mide si el ángulo engancha. La campaña fuerte de Navidad sería la ronda 2, a finales de noviembre o principios de diciembre, con la fecha límite real de pedido para recibirlo antes de las fiestas.

### 1.6 Qué NO tocar durante la prueba

- **Presupuestos.** No se suben ni se bajan, aunque un conjunto vaya bien. Lo que sobre se usa alargando días (ver 4.3).
- **Segmentación, ubicaciones, evento de optimización y estrategia de puja.** Cualquier cambio reinicia el aprendizaje.
- **Textos, titulares, vídeos y URL de un anuncio publicado.** Editar un anuncio cuenta como cambio importante. Si hay una errata grave, se duplica el anuncio corregido y se pausa el original.
- **No se añaden anuncios nuevos** a un conjunto activo durante la ronda 1.
- **No se activan ni se desactivan** las mejoras Advantage+.
- Sí se puede **pausar un anuncio concreto** según las reglas del punto 4. Es la única intervención prevista, además de la regla de parada.

---

## 2. Matriz de creatividades (3 ángulos × 3 ganchos = 9 anuncios)

### 2.1 Reglas de redacción y diferenciación

- **Frente a Bonotienda_Es** ("Si tienes perro, mira esto antes de volver a subirlo al coche… Pelos, suciedad y líquidos en los asientos"):
  - No interpelamos a la persona.
  - No usamos el formato "mira esto antes de".
  - No repetimos la tríada genérica "pelos, suciedad y líquidos".
  - Cada anuncio cuenta **una escena concreta** (río, playa, monte, tapicería, viaje a casa de la familia).
  - Respondemos **a las quejas reales** de quien ya ha comprado fundas: que resbala, que se rompen las correas o cremalleras, que traspasa la orina, que no encaja en un SUV y que el pelo se clava. Lo hacemos enseñando la prueba, no prometiendo.
- **Frente a vigoshop (fondo rígido):** no entramos en la comparación de fondo rígido. Nuestro argumento es que se pone y se quita en segundos y que se sacude o se lava [PRUEBA].
- **Afirmaciones que dependen de la muestra:** impermeable o "no pasa al asiento", antideslizante, lavable, encaje en SUV, medidas (133 × 140 cm según la ficha del proveedor), malla de visión y aperturas para el cinturón. Todas van marcadas [PRUEBA]. **Si la muestra no supera una prueba, se quita la frase o se cambia de gancho.** No se publica "por si acaso".
- **"Envío desde España"** es [CONFIRMAR] con el origen real del envío de la muestra.
- Sin emojis en esta ronda. Sin precio tachado, sin "últimas unidades", sin cuenta atrás, sin reseñas ni "+1.000 clientes".
- **Comparaciones:** solo planos reales del mismo coche, sin trucar, con la misma luz y sin borrar nada en edición. Nunca un "antes/después" montado.
- **Texto principal:** la versión corta tiene ≤125 caracteres visibles, contando espacios y sin contar las marcas [PRUEBA], que son internas. La versión larga se usa como texto completo del anuncio: Meta muestra unos 125 caracteres y el resto queda tras "Ver más". Si se prefiere un texto mínimo, se publica solo la versión corta.

### 2.2 Vídeos y ganchos (IDs de `creative-pack.md`)

Se usan los IDs que ya define el equipo creativo en `creative-pack.md`:

| ID | Pieza | Uso en esta matriz |
|---|---|---|
| V1 | Bucle hero, 6 s (landing) | No se usa en anuncios |
| V2 | Demo de instalación, 20 s | Recurso para A2H3 si V8 no se publica |
| V3 | Prueba de agua, 10 s | Cuerpo de A1H3 |
| V4 | Prueba de deslizamiento, 10 s | Incluida dentro de V8 |
| V5 | Kit en uso, 15 s | Cuerpo de A3H3 |
| **V6** | UGC "La probé después del campo", ~25 s | Cuerpo del ángulo 1 |
| **V7** | Demo problema-solución, ~20 s | Cuerpo de A2H1 y A2H2 |
| **V8** | "Probamos lo que suele fallar", ~30 s (solo se publica si pasan las 3 pruebas) | Cuerpo de A2H3 |
| **V9** | Kit para el viaje de Navidad, ~20 s | Cuerpo de A3H1 y A3H2 |
| H01–H15 | Planos de gancho de 0–3 s | Se montan delante del cuerpo |

Cada anuncio = **gancho H (0–3 s) + cuerpo V + cierre de 2 s** con el texto "Envío gratis a la Península · 14 días para devolver". Se exporta en 9:16 y en 4:5 y lleva subtítulos quemados en todos los casos.

El texto en pantalla de los ganchos se toma de `creative-pack.md`, pero no se usan sus variantes con "tu" que interpelan a la persona (por ejemplo, la de H01 "Lo que viene directo a tu asiento"): se usa la variante descriptiva.

### 2.3 Ángulo 1 · Barro: campo, río y playa

**Conjunto:** `RP_R1_A1-barro`. **Destino:** ficha de la funda. **Cuerpo:** V6 (y V9 en H3).

#### A1H1 · Gancho visual
- **Gancho 0–3 s (H01):** primer plano a ras de suelo de las patas con barro que se acercan a la puerta abierta del coche. Texto en pantalla: **"Vuelve del campo así… y quiere subir."**
- **Vídeo:** H01 + V6
- **Texto corto:** `Ruta, baño en el río y vuelta a casa. El barro y el agua se quedan en la funda, no en la tapicería. [PRUEBA]`
- **Texto largo:**
  > Ruta, baño en el río y vuelta a casa. El barro y el agua se quedan en la funda, no en la tapicería. [PRUEBA]
  > Funda tipo hamaca para el asiento trasero: se engancha a los reposacabezas y tapa el hueco de los pies.
  > Al llegar, se quita y se sacude. Lavable [PRUEBA].
  > Envío gratis a la Península y 14 días para devolver.
- **Titular:** Funda para el asiento trasero · 44,90 €
- **Descripción:** Envío gratis a la Península
- **CTA:** Comprar

#### A1H2 · Gancho de resultado
- **Gancho 0–3 s (H02):** cenital del asiento en una sola toma: el perro con barro se sienta y salta fuera, la mano levanta la funda y el asiento de debajo está limpio. Texto: **"Esto es lo que había debajo."** [PRUEBA-AGUA superada]
- **Vídeo:** H02 + V6
- **Texto corto:** `Arena, barro y patas mojadas: todo en la funda. Se saca, se sacude y el asiento sigue como estaba. [PRUEBA]`
- **Texto largo:**
  > Arena, barro y patas mojadas: todo en la funda. Se saca, se sacude y el asiento sigue como estaba. [PRUEBA]
  > Cubre todo el asiento trasero y el hueco de los pies, para que el perro no acabe ahí abajo en cada curva.
  > Aperturas para el cinturón y el enganche del arnés [PRUEBA].
  > Envío gratis a la Península · 14 días para devolver.
- **Titular:** El asiento, igual que antes de la playa
- **Descripción:** Funda tipo hamaca · 44,90 €
- **CTA:** Comprar

#### A1H3 · Gancho de prueba (objeción "traspasa")
- **Gancho 0–3 s (H12):** un vaso medidor de 250 ml se vierte sobre la funda, con el borde del papel de cocina blanco visible debajo. Texto: **"250 ml de agua. Papel debajo. ¿Pasa?"** [PRUEBA-AGUA. Solo se publica si el papel sale seco, también en las costuras.]
- **Vídeo:** H12 + V3 (resultado a los 30 min) + los últimos 8 s de V6
- **Texto corto:** `Le echamos agua encima y miramos debajo. Patas mojadas o un accidente: que se quede en la funda. [PRUEBA]`
- **Texto largo:**
  > Le echamos agua encima y miramos debajo. Patas mojadas o un accidente: que se quede en la funda. [PRUEBA]
  > Lo grabamos con nuestra propia muestra antes de venderla.
  > Se engancha a los reposacabezas, tapa el hueco de los pies y se lava en casa [PRUEBA].
  > Envío gratis a la Península · 14 días para devolver.
- **Titular:** Probada con agua antes de venderla [PRUEBA]
- **Descripción:** Funda de coche para perro · 44,90 €
- **CTA:** Comprar

### 2.4 Ángulo 2 · Pelo y tapicería: el coche que quieres mantener limpio

**Conjunto:** `RP_R1_A2-pelo`. **Destino:** ficha de la funda. **Cuerpo:** V7 (y V9 en H3).

#### A2H1 · Gancho visual
- **Gancho 0–3 s (H05):** macro de pelos clavados en la tapicería y cinta adhesiva que los arranca. Texto: **"Pelo clavado: el clásico del sábado."**
- **Vídeo:** H05 + V7
- **Texto corto:** `Pelo de perro en la tapicería: horas con el guante. En la funda: sacudir y listo. [PRUEBA: el pelo no se clava]`
- **Texto largo:**
  > Pelo de perro en la tapicería: horas con el guante. En la funda: sacudir y listo. [PRUEBA: el pelo no se clava]
  > Funda tipo hamaca que cubre el asiento trasero entero, el respaldo y el hueco de los pies.
  > Se pone en un minuto con los enganches a los reposacabezas y se quita igual de rápido [PRUEBA: cronometrar].
  > Envío gratis a la Península · 14 días para devolver.
- **Titular:** La tapicería, sin pelo de perro
- **Descripción:** Funda tipo hamaca · 44,90 €
- **CTA:** Comprar

#### A2H2 · Gancho de coche cuidado
- **Gancho 0–3 s:** coche recién lavado y brillante, puerta trasera abierta. El perro sube de un salto sobre la funda ya puesta y se tumba. Texto: **"Coche recién lavado. Perro a bordo. Sigue limpio."** Plano de gancho: V4 (o grabar).
- **Vídeo:** V4 (gancho) + V7
- **Texto corto:** `Coche recién lavado y perro a bordo. La funda se lleva el pelo y las uñas; la tapicería, nada. [PRUEBA]`
- **Texto largo:**
  > Coche recién lavado y perro a bordo. La funda se lleva el pelo y las uñas; la tapicería, nada. [PRUEBA]
  > Cubre el asiento trasero completo y tapa el hueco de los pies.
  > Malla en el centro para verle desde delante [PRUEBA: confirmar en la muestra].
  > Envío gratis a la Península · 14 días para devolver.
- **Titular:** Que el coche siga pareciendo nuevo
- **Descripción:** Funda de coche para perro · 44,90 €
- **CTA:** Comprar

Nota: "parecer nuevo" describe el coche, no a la persona, y no afirma su situación económica.

#### A2H3 · Gancho de objeciones (lo que falla en otras fundas)
- **Gancho 0–3 s:** a cámara, un plano UGC con las manos tirando de una correa de la funda. Texto: **"3 cosas que miramos antes de vender esta funda."** En pantalla, una lista: "No resbala · Tapa el hueco · Mide 133 × 140 cm" [PRUEBA las tres].
- **Vídeo:** V9 (tirón de las correas, frenada en parado, cinta métrica) + V7 (instalación en un SUV)
- **Texto corto:** `Que no resbale, que tape el hueco de los pies y que encaje en un SUV. Lo comprobamos antes de venderla. [PRUEBA]`
- **Texto largo:**
  > Que no resbale, que tape el hueco de los pies y que encaje en un SUV. Lo comprobamos antes de venderla. [PRUEBA]
  > Mide 133 × 140 cm [PRUEBA: medir]. Antes de comprar, compara con el ancho de tu asiento trasero.
  > Correas a los reposacabezas y anclajes entre los asientos [PRUEBA: tirón con fuerza].
  > Envío gratis a la Península · 14 días para devolver.
- **Titular:** Mírale las medidas antes de comprar
- **Descripción:** Funda tipo hamaca · 44,90 €
- **CTA:** Comprar

Nota: "compara con el ancho de tu asiento" se refiere al coche, no a un atributo de la persona. Dar las medidas reduce las devoluciones por "no encaja en el SUV".

### 2.5 Ángulo 3 · Viaje de Navidad + kit

**Conjunto:** `RP_R1_A3-navidad-kit`. **Destino:** ficha con el **kit preseleccionado**. **Cuerpo:** V8.

#### A3H1 · Gancho de viaje
- **Gancho 0–3 s:** maletero lleno de bolsas y regalos que se cierra. Corte al asiento trasero: el perro tumbado en la funda, con arnés enganchado al cinturón. Texto: **"400 km a casa de la familia. El perro también viene."** Plano de gancho: V5 (o grabar).
- **Vídeo:** V5 (gancho) + V8
- **Texto corto:** `Viaje en Navidad a casa de la familia: funda para el asiento trasero y colchoneta para dormir al llegar.`
- **Texto largo:**
  > Viaje en Navidad a casa de la familia: funda para el asiento trasero y colchoneta para dormir al llegar.
  > Kit para viajar con perro: funda tipo hamaca + colchoneta de viaje enrollable.
  > La colchoneta se enrolla y se lleva con una mano [PRUEBA]. En casa ajena, el perro ya tiene su sitio.
  > 79,90 € el kit, envío gratis a la Península.
- **Titular:** Kit para viajar con perro · 79,90 €
- **Descripción:** Funda de coche + colchoneta de viaje
- **CTA:** Comprar

#### A3H2 · Gancho de llegada
- **Gancho 0–3 s:** se abre la puerta de una casa, alguien entra con la colchoneta enrollada bajo el brazo y la desenrolla junto al sofá. El perro se tumba encima. Texto: **"Llegar a casa ajena con su sitio debajo del brazo."** Plano de gancho: tomado de V8.
- **Vídeo:** V8 (reordenado: la llegada primero, el coche después)
- **Texto corto:** `En el coche, su funda. En casa de la familia, su colchoneta. Un kit para el viaje de estas fiestas.`
- **Texto largo:**
  > En el coche, su funda. En casa de la familia, su colchoneta. Un kit para el viaje de estas fiestas.
  > La funda cubre el asiento trasero y el hueco de los pies. La colchoneta se enrolla y cabe en el maletero.
  > Las dos con superficie impermeable [PRUEBA].
  > 79,90 € el kit, envío gratis a la Península.
- **Titular:** Su sitio, también en el viaje
- **Descripción:** Kit funda + colchoneta · 79,90 €
- **CTA:** Comprar

#### A3H3 · Gancho de "qué incluye"
- **Gancho 0–3 s:** plano cenital sobre una mesa. Se abre la caja y se colocan la funda doblada, la colchoneta enrollada y los anclajes. Texto: **"Todo lo que va en el kit para viajar con perro."**
- **Vídeo:** plano cenital (grabar o extraer de V8) + V8
- **Texto corto:** `Funda tipo hamaca para el asiento trasero y colchoneta de viaje enrollable. Lo que lleva el kit, sin relleno.`
- **Texto largo:**
  > Funda tipo hamaca para el asiento trasero y colchoneta de viaje enrollable. Lo que lleva el kit, sin relleno.
  > Medidas: funda 133 × 140 cm [PRUEBA], colchoneta 95 × 65 cm [PRUEBA].
  > Para las escapadas y para el viaje de Navidad.
  > 79,90 € el kit, envío gratis a la Península y 14 días para devolver.
- **Titular:** Qué incluye el kit · 79,90 €
- **Descripción:** Envío gratis a la Península
- **CTA:** Comprar

Nota sobre plazos: si se menciona "llega antes de Navidad", tiene que ir con una **fecha límite real de pedido** calculada con el plazo del proveedor más 2 días de margen. En la ronda 1 no se menciona.

### 2.6 Resumen de la matriz

| ID | Ángulo | Gancho | Vídeo | Formato | Destino | Afirmaciones [PRUEBA] que bloquean |
|---|---|---|---|---|---|---|
| A1H1 | Barro | Salto del río al coche | V1 + V6 | 9:16 y 4:5 | Funda | No pasa el agua, lavable |
| A1H2 | Barro | Funda con arena que se sacude | V2 + V6 | 9:16 y 4:5 | Funda | Asiento intacto, aperturas para el cinturón |
| A1H3 | Barro | Agua y pañuelo seco | V9 + V6 | 9:16 y 4:5 | Funda | **Prueba de agua (imprescindible)** |
| A2H1 | Pelo | Guante frente a sacudir | V3 + V7 | 9:16 y 4:5 | Funda | El pelo no se clava, tiempo de instalación |
| A2H2 | Pelo | Coche recién lavado | V4 + V7 | 9:16 y 4:5 | Funda | Malla, resiste uñas |
| A2H3 | Pelo | 3 cosas que miramos | V9 + V7 | 9:16 y 4:5 | Funda | **Antideslizante, medidas, SUV, correas** |
| A3H1 | Navidad | Maletero y 400 km | V5 + V8 | 9:16 y 4:5 | Kit | Se enrolla y se lleva con una mano |
| A3H2 | Navidad | Llegada con la colchoneta | V8 | 9:16 y 4:5 | Kit | Superficie impermeable |
| A3H3 | Navidad | Qué incluye el kit | V8 | 9:16 y 4:5 | Kit | Medidas de las dos piezas |

Si una prueba falla, el plan es este:
- **Agua:** se elimina A1H3, y en todos los anuncios se cambia "no pasa al asiento" por "protege del barro y el pelo".
- **Resbala:** se elimina A2H3 y se vuelve a montar como "cómo se instala".
- **No encaja en un SUV:** se quita "SUV" y se dejan solo las medidas.

---

## 3. Convención de nombres y UTMs

### 3.1 Nombres

Formato: `MARCA_RONDA_NIVEL…`, con guiones bajos entre campos y guiones dentro de cada campo. Sin espacios ni tildes.

| Nivel | Patrón | Ejemplo |
|---|---|---|
| Campaña | `RP_{ronda}_{objetivo}_{evento}_{presupuesto}_{geo}_{AAMM}` | `RP_R1_VENTAS_PUR_ABO_ES-PEN_2610` |
| Conjunto | `RP_{ronda}_{ángulo}_{público}_{geo}_{€día}` | `RP_R1_A1-barro_BROAD_PEN_10EUR` |
| Anuncio | `RP_{ronda}_{IDanuncio}_{vídeo}_{formatos}_{versión}` | `RP_R1_A1H3_V9-V6_916-45_v1` |

- Si se aplica el plan B, el evento cambia: `PUR` → `IC` → `ATC`.
- Si se corrige un anuncio, se sube la versión (`v1` → `v2`). Nunca se reutiliza un nombre.
- Los vídeos exportados llevan el mismo ID: `RP_A1H3_916.mp4` y `RP_A1H3_45.mp4`.

### 3.2 UTMs (parámetros de URL del anuncio)

Se ponen en el campo "Parámetros de URL" de cada anuncio. Usan los parámetros dinámicos de Meta, así que no hay que escribirlos a mano:

```
utm_source={{site_source_name}}&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}&utm_id={{campaign.id}}
```

- `{{site_source_name}}` devuelve `fb`, `ig`, `msg` o `an`, así que en Shopify se ve qué parte viene de Instagram y qué parte de Facebook.
- En Shopify (Analítica → Informes → Sesiones y ventas por UTM) se cruza `utm_content` con el ID del anuncio. Es la **fuente de verdad** de los pedidos cuando Meta atribuye de más o de menos, por ejemplo por usuarios que rechazan las cookies.
- La URL base, sin parámetros extra, es esta: `https://{dominio}/products/funda-coche-perro-hamaca`. Para el kit se añade `?variant={id_kit}`.
- Los mismos UTMs con `utm_medium=email` se usan en los emails de carrito abandonado, para no confundir esas ventas con las de Meta.

---

## 4. Panel de KPIs y reglas de decisión

### 4.1 Economía por producto (margen ESTIMADO de `plan-prueba.md` §8)

| | Funda 44,90 € | Kit 79,90 € | Mezcla 80/20 (HIPÓTESIS) |
|---|---|---|---|
| Margen antes de publicidad | 11,0 € | 9,1 € | 10,6 € |
| **CPA de equilibrio** | **11,0 €** | **9,1 €** | **10,6 €** |
| **ROAS de equilibrio** (PVP / margen) | **4,08** | **8,78** | 4,89 (ticket medio 51,90 €) |
| ROAS con CPA de 15 € ("seguir") | 2,99 | 5,33 | 3,46 |
| ROAS con CPA de 25 € ("parar") | 1,80 | 3,20 | 2,08 |

La mezcla 80/20 es una HIPÓTESIS: 0,8 × 44,90 + 0,2 × 79,90 = 51,90 € de ticket medio, y 0,8 × 11,0 + 0,2 × 9,1 = 10,6 € de margen. Cuando haya pedidos, se recalcula con la proporción real.

**Conclusión práctica:** en esta prueba se decide por **CPA**, no por ROAS. El kit tiene más ticket y menos margen, así que el ROAS lo haría parecer mejor de lo que es.

### 4.2 Umbrales del embudo (calculados hacia atrás desde el CPA)

Fórmulas:
- `CPC enlace = CPM / (1000 × CTR enlace)`
- `CPA = CPC enlace / (% clics que cargan la landing × CVR landing → compra)`
- `Coste por ATC máx. = CPA objetivo × (compras / ATC)`
- `Coste por IC máx. = CPA objetivo × (compras / IC)`

Supuestos de referencia (todo HIPÓTESIS, no son datos de esta cuenta ni benchmarks verificados):
- El 80 % de los clics en el enlace llega a cargar la landing (visita a la página de destino).
- El 30 % de los ATC termina en compra.
- El 50 % de los IC termina en compra.

Son ratios habituales en tiendas nuevas sin reseñas. Se sustituyen por los propios en cuanto haya 20 o más ATC.

| KPI (nivel) | Bien | Aceptable | Mal → acción | De dónde sale el umbral |
|---|---|---|---|---|
| Hook rate = reproducciones de 3 s / impresiones (anuncio) | ≥ 30 % | 20–30 % | < 15 % → cambiar el gancho | HIPÓTESIS de práctica habitual. Mide solo si el gancho para el scroll. |
| CTR de enlace (anuncio y conjunto) | ≥ 1,5 % | 1,0–1,5 % | < 0,8 % → el anuncio no convence | El plan exige un CTR ≥1 % para la ronda 2 (`plan-prueba.md` §5) |
| CPM (conjunto) | ≤ 8 € | 8–12 € | > 15 € → la creatividad tiene mala valoración o hay un problema de entrega | HIPÓTESIS para España en el cuarto trimestre, con público amplio. Solo informativo, no se pausa por el CPM. |
| CPC enlace | ≤ 0,40 € | 0,40–0,60 € | > 0,80 € | Con CPA 15 €, landing 80 % y CVR 3 %: CPC máx. = 15 × 0,8 × 0,03 = **0,36 €**. Con CVR 5 %: 0,60 €. |
| CVR landing → compra (Shopify) | ≥ 3 % | 2–3 % | < 1,5 % → problema de landing o de oferta | Lo que exige el CPA ≤15 € con un CPC de 0,40–0,50 € |
| Coste por ATC | ≤ 3,30 € | 3,30–4,50 € | > 7,50 € | 11 € × 0,30 = 3,30 € (equilibrio). 15 € × 0,30 = 4,50 € (seguir). 25 € × 0,30 = 7,50 € (parar). |
| Coste por IC | ≤ 5,50 € | 5,50–7,50 € | > 12,50 € | 11 × 0,5; 15 × 0,5; 25 × 0,5 |
| **CPA de compra** (campaña) | **≤ 11 €** | **11–15 €** | 15–25 € = zona gris · **> 25 € = parar** | Margen real (§4.1) y reglas de `plan-prueba.md` §8 |
| ROAS (campaña, solo funda) | ≥ 4,1 | 3,0–4,1 | < 1,8 | PVP / CPA |
| Ticket medio y % de kits | — | — | — | Para recalcular el margen de la mezcla |

Un ejemplo de por qué la exigencia es alta: con un CPM de 7 € y un CTR del 1,2 %, el CPC sale a 0,58 €. Con el 80 % de carga y un CVR del 2 %, el CPA sale a **36 €**. Para bajar a 15 € hace falta, por ejemplo, un CTR del 1,5 % (CPC 0,47 €) y un CVR del 3,9 %. Esta tabla sirve para saber **en qué tramo se rompe** si no sale.

**Columnas del panel en el Administrador de anuncios** (se guardan como "RP · Prueba"):
- Importe gastado, impresiones, CPM y frecuencia.
- Reproducciones de 3 s, ThruPlays y hook rate (columna personalizada: reproducciones de 3 s / impresiones).
- Clics en el enlace, CTR de enlace y CPC de enlace.
- Visitas a la página de destino y coste por visita.
- Añadir al carrito y coste por ATC.
- Pagos iniciados y coste por IC.
- Compras, coste por compra, valor de conversión y ROAS de las compras.
- Ventana de atribución con las comparativas de 1 y 7 días tras clic.

Al lado, una hoja con los pedidos de Shopify por `utm_content`.

### 4.3 Reglas por día (con 30 €/día)

Ninguna decisión sobre un **conjunto** antes de que haya gastado ~25 €. Sobre un **anuncio**, ninguna antes de ~6 € o 1.000 impresiones. Es muy poco dato: todas las reglas de corte son para fallos claros, no para ajustes finos.

**Día 2 (~60 € acumulados, ~20 € por conjunto)**
- Comprobaciones técnicas:
  - ¿Coinciden los ATC, IC y compras de Meta con Shopify?
  - ¿Hay pedidos en Shopify sin compra en Meta? Si los hay, el problema es de medición y se arregla antes de seguir.
  - ¿Se ha rechazado algún anuncio?
- Plan B de entrega (1.2) si el gasto acumulado es < 30 € o el CPM es > 20 €.
- **Apagar un anuncio** si ha gastado ≥ 6 €, su **CTR de enlace es < 0,6 %**, su **hook rate es < 15 %** y no tiene ningún ATC. Tienen que cumplirse las cuatro condiciones.
- **No** se apaga ningún conjunto. **No** se toca el presupuesto.

**Día 3 (se pasan los 75 €; ~30 € por conjunto)**
- **75 € sin ninguna compra (en Shopify, con UTM de Meta) → se pausa la campaña** (regla automática) y se pasa al diagnóstico (punto 5, escenario A). Antes de dar la prueba por fallida, se confirma que no hay ventas sin registrar.
- Si hay ≥ 1 compra:
  - **Apagar un conjunto** que lleve ≥ 30 € (2 × el CPA de seguir) con **0 IC** y un CTR de enlace < 0,8 %.
  - **Apagar un anuncio** que lleve ≥ 10 € con CTR < 0,8 % y 0 ATC, siempre que quede al menos 1 anuncio activo en el conjunto.
  - **No se pasa** el presupuesto de un conjunto apagado a otro, porque eso cambia el aprendizaje. Se baja el gasto diario total y el presupuesto que sobra **se aprovecha alargando** el mejor conjunto 1–2 días, hasta llegar a 150 € de gasto total.

**Día 5 (~150 € gastados, o antes si se ha aplicado la regla)**
- Se esperan **48 h** para las conversiones tardías y se decide en D7.

| Resultado a 150 € (compras en Shopify) | Decisión |
|---|---|
| CPA ≤ 11 € y ≥ 5 compras | **Escalar** (escenario C del punto 5) y negociar lote o precio con el proveedor |
| CPA ≤ 15 € | **Segunda ronda** con los anuncios ganadores (escenario C, versión prudente) |
| CPA 15–25 € y CTR ≥ 1 % | **Segunda ronda** con creatividades nuevas sobre el ángulo con mejor coste por IC (escenario B) |
| CPA > 25 €, o CTR < 1 % en toda la campaña | **Parar** y analizar (escenario A o B, según en qué tramo se rompa) |
| La muestra no supera la prueba de agua o la de cierres | **Pausa inmediata** y reembolso de los pedidos pendientes, sea cual sea el CPA |

**Ganador por ángulo:** si hay ≤ 3 compras por ángulo, no se elige ganador por CPA, porque no es significativo. Se elige por **coste por IC** y, después, por **CTR de enlace**. Con tan pocos datos, "ganador" significa "el más prometedor", no "el probado".

---

## 5. Segunda ronda (otros 150 €) según el escenario

### A · Sin ventas (75 € sin compras)

Se diagnostica por tramos, con los datos de las 3 tablas:

| Dónde se rompe | Señal | Ronda 2 |
|---|---|---|
| El anuncio no para el scroll | Hook rate < 15 % en todos los anuncios | Rehacer los ganchos. Con el mismo producto, se prueban 6 ganchos nuevos sobre el cuerpo que mejor retuvo (ThruPlay). |
| El anuncio no lleva clics | Hook bien, CTR < 0,8 % | El mensaje o la oferta no interesa: probar otro ángulo (por ejemplo, el de terrazas y casas ajenas de `anuncios-y-emails.md`) o revisar si el precio aparece demasiado pronto |
| La landing no convierte | CTR ≥ 1 % pero ATC / visitas < 3 % | Problema de landing o de precio. Mirar en la grabación de sesiones (Shopify o Clarity) dónde se van. Probar con medidas más visibles, el vídeo de prueba arriba y FAQ de encaje. Si los clics son buenos pero nadie añade al carrito a 44,90 €, **el precio es el problema**: se valora 39,90 € solo si el coste real del proveedor lo permite, porque con 39,90 € el margen ESTIMADO es de 7,3 €. |
| El checkout no convierte | ATC sí, compras 0 | Revisar gastos inesperados, métodos de pago (Bizum, PayPal y Apple Pay si están disponibles), plazo de entrega visible y confianza (página "Quiénes somos", contacto). Activar los emails de carrito abandonado si no lo estaban. |
| Nada funciona en ningún tramo | Todos los KPIs en "mal" | **No hay ronda 2 con este producto.** Pasar al siguiente candidato de la lista de validación. |

### B · CPA alto (15–25 €)

- Se mantiene **el mejor ángulo** (por coste por IC) y se apagan los demás.
- **5–6 creatividades nuevas** sobre ese ángulo: los ganchos que mejor funcionaron, con variaciones (otro perro, otro coche y otra persona en el UGC). Una estructura de **1 campaña con CBO a 25–30 €/día** y 1 conjunto amplio, o **Advantage+ Sales** con los anuncios ganadores y los nuevos.
- Se ataca la conversión de la landing, porque suele ser donde más se gana: vídeo de prueba en la primera pantalla, tabla de medidas con el "cómo medir tu asiento" y las 3 objeciones resueltas.
- **Oferta:** recalcular el kit para que deje ≥ margen de la funda (por ejemplo, 84,90 €). Si el coste del proveedor baja con volumen, repetirlo.
- **Remarketing pequeño** (3–5 €/día) para quien ha visto ≥ 50 % del vídeo o ha visitado la web en 14 días, con el anuncio de objeciones (A2H3) o el de prueba de agua (A1H3).
- Regla: si tras otros 150 € el CPA no baja de 15 €, se para.

### C · CPA bueno (≤ 15 €; escalar si ≤ 11 € con ≥ 5 compras)

- **Escalado gradual:** +20–30 % de presupuesto cada 48–72 h en el conjunto ganador, sin duplicar presupuestos de golpe.
- Una campaña de **Advantage+ Sales** con los 2–3 mejores anuncios y 3 nuevos. La campaña manual se queda como control.
- **Navidad:** entre finales de noviembre y el 10 de diciembre aproximadamente (ajustar con el plazo real), el ángulo 3 con la **fecha límite real de pedido** en el texto. Es urgencia real, no inventada.
- Operación:
  - Negociar precio o lote con el proveedor.
  - Comprobar el stock antes de escalar.
  - Revisar el servicio de atención al cliente (respuesta en < 24 h).
  - Vigilar que las devoluciones no superen el 10 % de incidencias incluido en el margen.
- Con ≥ 10 compras:
  - Público de exclusión de compradores.
  - Público similar (lookalike) del 1 % sobre compradores, como prueba contra el amplio.
  - Recoger **reseñas reales** de los compradores (email a los 10 días) para la ronda 3. Nunca reseñas inventadas.

---

## 6. Checklist técnica previa (bloqueante salvo que se indique)

**Cuenta y negocio**
- [ ] Portfolio comercial (Business Manager) con la página de Facebook y la cuenta de Instagram de Ruta Perruna conectadas. Autenticación en dos pasos activada para todos los administradores.
- [ ] Cuenta publicitaria nueva con **moneda EUR** y **zona horaria Europe/Madrid**. Las dos se fijan al crear la cuenta y luego no se pueden cambiar.
- [ ] Método de pago añadido. Límite de gasto de la cuenta fijado en 160 €. En cuentas nuevas, Meta puede aplicar un límite diario bajo al principio: hay que comprobar que permite 30 €/día.
- [ ] Verificación del negocio (recomendable, no bloqueante en la ronda 1). Datos del aviso legal coherentes con la figura legal elegida.

**Dominio y eventos**
- [ ] **Dominio verificado** en el Portfolio comercial (Seguridad de la marca → Dominios), con registro TXT de DNS o metaetiqueta en el tema de Shopify.
- [ ] **App "Facebook e Instagram" de Shopify** instalada y conectada al píxel. Intercambio de datos de clientes en el nivel **"Máximo"**, que activa la **API de conversiones** desde el servidor.
- [ ] En el Administrador de eventos (Probar eventos) se ven en tiempo real **PageView, ViewContent, AddToCart, InitiateCheckout y Purchase**, cada uno con origen **navegador y servidor** y **deduplicados** (el mismo `event_id`; Meta lo muestra como "deduplicado").
- [ ] **Calidad de coincidencia de eventos** de Purchase ≥ 6/10 (con email, teléfono y nombre enviados por la API de conversiones).
- [ ] **Medición de eventos agregados:** Meta ha ido simplificando este paso (ya no exige priorizar 8 eventos como antes; VERIFICAR el estado actual en el Administrador de eventos). Si la cuenta aún muestra la configuración de eventos web del dominio, el orden es Purchase > InitiateCheckout > AddToCart > ViewContent.
- [ ] Purchase envía **valor y moneda** (EUR). Comprobar que el valor es el del pedido (44,90 € o 79,90 €) y no 0.

**Compra de prueba**
- [ ] **Compra real** con tarjeta propia, desde un anuncio en borrador o desde la URL con UTMs. Comprobar todo lo siguiente:
  - Llega el Purchase al Administrador de eventos.
  - Aparece en Shopify con el UTM correcto.
  - Llega el email de confirmación con el plazo real.
  - **Se reembolsa** después.
- [ ] Prueba de carrito abandonado: añadir al carrito, dejar el email en el checkout y no pagar. Comprobar que llegan los emails de 1 h y de 24 h.
- [ ] Zonas de envío limitadas a la Península: probar con un código postal de Baleares o de Canarias y comprobar que no permite comprar.

**Consentimiento de cookies (RGPD y LSSI)**
- [ ] Banner de consentimiento previo, con "Rechazar" tan visible como "Aceptar". Con la API de privacidad de clientes de Shopify, o con una CMP compatible que la use.
- [ ] Comprobado que **sin consentimiento no se dispara el píxel** del navegador, y que con consentimiento sí. Lo que se envía por la API de conversiones respeta la señal de consentimiento de Shopify (VERIFICAR el comportamiento de la app en la configuración actual).
- [ ] Hay que asumir que Meta **verá menos conversiones** que Shopify por los rechazos. Por eso las decisiones del punto 4 se toman con **compras de Shopify con UTM de Meta**.

**Página y anuncios**
- [ ] La landing de la funda carga en < 3 s en el móvil (PageSpeed). Medidas, plazo, devoluciones y contacto visibles. Ninguna afirmación [PRUEBA] sin superar.
- [ ] Ficha con los datos GPSR y páginas legales publicadas (ver `plan-prueba.md` §6).
- [ ] Los 9 anuncios (18 archivos: 9:16 y 4:5) revisados con la lista del punto 2.1 y con las marcas [PRUEBA] resueltas o retiradas.
- [ ] Mejoras Advantage+ de creatividades desactivadas en cada anuncio (comprobar una por una, porque algunas vienen activadas por defecto).
- [ ] Regla automática de los 75 € creada y activada.

**Opcional**
- [ ] **Catálogo** de Meta sincronizado desde la app de Shopify (funda y kit). No hace falta en la ronda 1. Sirve para etiquetar productos en Instagram y para anuncios de catálogo o remarketing dinámico en la ronda 2.
- [ ] Microsoft Clarity o la grabación de sesiones de Shopify, para el diagnóstico del escenario A (también sujeto a consentimiento).
