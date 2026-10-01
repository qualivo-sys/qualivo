# Plan de la semana 1 → 11 de octubre: test de los seis vídeos nuevos

Escrito el 1-oct a las 10:45 CEST a petición de Maikel: *"dame el plan de una
semana, cuánto dinero necesitas y cómo lo vamos a revisar"*. Incorpora la
entrega de Creative de esta misma mañana (los seis vídeos en 4:5).

## La hipótesis que se prueba

**H-CREATIVO-02.** *Al menos uno de los seis vídeos nuevos consigue, en su
vertical, un coste por envío igual o menor que el vídeo viejo y una
proporción de citas confirmadas igual o mayor, con ≥ 50 € de gasto y ≥ 3
envíos.* Fecha de muerte: **sábado 11 de octubre, 08:05 CEST**. Ese día se
consolida con lo que haya; no se prolonga.

Lo que esta semana **no** puede decidir, y conviene saberlo antes: coste por
reunión celebrada por creativo. Con 60-120 €/día y ~75 €/reunión salen 0,8-1,6
reuniones al día entre 8 anuncios. Las reuniones se miden después, con los 2-3
creativos que queden tras la consolidación.

## Por qué no se puede fijar un mínimo por vídeo

Meta no admite presupuesto por anuncio: el presupuesto es del conjunto y la
subasta reparte según conversión *predicha*, que depende del historial. Los
anuncios viejos llevan dos semanas y 14 + 5 envíos; los nuevos, cero. Lo
esperable es que el viejo se lleve el 70-80 % del gasto en 3-4 días y los
nuevos queden sin probar. Además el conjunto optimiza por envío, no por
reunión: formación ya enseñó que el envío barato (14,83 €) viene con 57 % de
asistencia y clínicas que el caro (35,17 €) viene con 100 %.

Solución acordada con Maikel: **separar solo lo que el conjunto no prueba.**
El que coge gasto no se toca; el que se queda sin gasto pasa a conjunto
propio con presupuesto igual.

## Calendario

| cuándo (CEST) | qué | quién |
|---|---|---|
| **mié 1, hoy** | Reconstruir los 6 anuncios nuevos con `asset_feed_spec`: 4:5 en feed, 9:16 en stories/reels, cada uno con su formulario propio, en PAUSADO. Pausar las 6 versiones solo-9:16. | Paid construye; **Maikel activa** y autoriza la pausa de las 6 versiones 9:16. T0 = activación. |
| **T0 → T0 + 72 h** (≈ sáb 4) | Fase 1: el conjunto reparte solo. Nadie toca nada. Parte diario a las 08:05. | Paid informa. |
| **sáb 4, 08:05** | **Rescate.** Todo anuncio nuevo con < 15 % del gasto de su conjunto en las 72 h (< ~4,5 €/día de media) se copia a un conjunto propio de **10 €/día** en QV_TEST_DOLOR_<vertical> (los 3 conjuntos por vertical ya existen). Los que cogen gasto se quedan donde están. | Paid monta en PAUSADO con cifras por anuncio; **Maikel activa**. |
| **sáb 4 → sáb 11** | Fase 2: nadie toca nada. Frenar solo con autorización. | Paid informa cada mañana. |
| **mié 8, 08:05** | Revisión intermedia: reparto, CTR, coste por envío, citas confirmadas por formulario. Aviso de topes. H-APRENDIZAJE-01 muere el 9: se cierra con el dato de esta semana. | Paid. |
| **sáb 11, 08:05** | **Consolidación.** Propuesta cerrada: qué queda, qué muere, estructura final. | Paid propone; **Maikel decide y activa**. |

Si Maikel no activa hoy, el calendario se desplaza entero: T0 es la
activación, no la fecha de hoy.

## Criterios de la consolidación del 11-oct

1. Solo se juzga un creativo con **≥ 50 € de gasto y ≥ 3 envíos**. Por debajo
   es "no probado", no "malo", y se dice así.
2. Orden por **coste por envío**, corregido por la **proporción de envíos con
   `act-cita-confirmada` o `nivel-a`** en GHL (tag `form-<id>` de cada
   formulario). Un envío barato que no llega a cita no cuenta como barato.
3. Reunión celebrada (`reunion-celebrada`) decide empates, si hay alguna.
4. Resultado: **como mucho 2 creativos por vertical**, en un solo conjunto de
   30 €/día por vertical. Si ningún nuevo supera al viejo en su vertical, el
   viejo se queda solo y Creative recibe el aprendizaje (qué ángulo falló y
   en qué paso).
5. Vuelta a ~60 €/día consolidados. Reformas se revisa entonces, no antes.

## Dinero

| tramo | €/día | días | € |
|---|---|---|---|
| Fase 1 (mié 1 → sáb 4) | 60 | 3 | 180 |
| Fase 2, caso esperado (3-4 rescatados) | 90-100 | 7 | 630-700 |
| Fase 2, caso máximo (6 rescatados) | 120 | 7 | 840 |
| **Total semana, esperado** | | | **≈ 810-880 €** |
| **Total semana, máximo** | | | **≈ 1.020 €** |
| Referencia: sin test, 60 €/día × 10 días | | | 600 € |

Lo que pido autorizar: **presupuesto diario de hasta 120 €/día entre el 4 y
el 11 de octubre**, decidiéndose la cifra exacta el sábado 4 con el número
real de rescatados (10 € por cada uno). Si Maikel prefiere no pasar de 60,
cabe la alternativa de quitarlo del conjunto principal (viejos 2 × 9 € +
nuevos 6 × 7 €), pero a 7 €/día un creativo de clínicas hace ~1 envío a la
semana y el test no concluye.

**Topes que hay que mover (son de Maikel):**
- QV_VERTICALES_Sep26 tiene tope de **800 €** y lleva **414,64 €** gastados
  (dato Meta 1-oct 10:29 CEST). A 60 €/día se agota el **7-oct**, en mitad
  del test. Subirlo a **1.300 €** cubre hasta el 11 con margen.
- QV_TEST_DOLOR_FORMACION y _CLINICAS **no tienen tope**. Al activar los
  rescatados, poner **300 €** a cada una (3 conjuntos × 10 € × 10 días).

## Cómo se revisa

**Cada mañana, 08:05 CEST** (rutina ya programada), en el chat y en
`bus/out/paid.jsonl`, por anuncio:
- gasto del día y acumulado, y **% del gasto de su conjunto**;
- impresiones, CTR, CPM (los tres a la vez: un CTR solo no dice nada);
- envíos según Meta y, en GHL, contactos con su tag `form-<id>` y cuántos
  tienen `act-wa1`, `act-cita-confirmada`, `nivel-a`, `reunion-celebrada`.
Dato de ayer cerrado; el de hoy solo cuando se pida y marcado como parcial.

**21:10 CEST**: parte corto del día en curso, marcado "hasta las 21:00".

**Tres puntos de decisión**: sábado 4 (rescate), miércoles 8 (intermedia),
sábado 11 (consolidación). En los tres Paid trae la propuesta montada en
pausado y las cifras; activar es de Maikel.

**Cosas que se vigilan además del test:**
- Que el primer lead de cada formulario nuevo llegue a GHL con su
  `form-<id>`, su `sector-*` y arranque `act-wa1`. Si uno falla, se avisa
  ese mismo día: sin eso el test no mide.
- Tope de QV_VERTICALES (arriba).
- Cambios en la cuenta no hechos por Paid ni por Maikel (`/activities`).

## Sobre la entrega de Creative

Los seis 4:5 están en la rama `claude/qualivo-creative-performance`,
`produccion/video-anuncios/finales/4x5/`, 3-5,6 MB cada uno, misma duración
que el 9:16. Están hechos **reduciendo el 9:16 al 80 % y rellenando los
laterales (108 px por lado) con el mismo fotograma desenfocado**: no es un
reencuadre, es el vídeo entero con bandas difuminadas. Opinión de Paid: vale
para esta semana y es mejor que lo que hay ahora (Meta recorta el 9:16 en
feed y se pierde el texto de arriba y abajo), pero un 4:5 nativo rendiría
mejor. Si el test da un ganador, pedir a Creative el reencuadre nativo solo
de ese.

## Lo que Paid hace solo y lo que no

Hace solo: construir en pausado, informar, escribir aquí y en el bus.
No hace sin Maikel: activar, pausar (ni siquiera las versiones 9:16 que
sustituyen las nuevas), subir presupuesto, mover topes, cambiar pujas.

*Fuente de las cifras: Meta Marketing API v21.0 (campañas, conjuntos,
insights 1-oct 10:29 CEST); GHL (tags, análisis del 1-oct); costes por
envío y asistencia del documento `2026-10-01-analisis-por-vertical.md`.
Sin PII.*

---

## Anexo · montaje del 1-oct (11:20 CEST): los seis anuncios 4:5 + 9:16, en pausado

Hecho con los 4:5 entregados por Creative. Verificado por GET después de
crear: cada anuncio tiene las dos piezas (4:5 → feed de Facebook e
Instagram; 9:16 → stories), la misma duración exacta entre ambas, y **el
mismo formulario que su versión solo-9:16**, así que la medición por
formulario no se rompe al cambiar de anuncio.

| anuncio nuevo (PAUSADO) | id | sustituye a | formulario | conjunto |
|---|---|---|---|---|
| `AD · VERT · S1_PLA · 45+916 · form propio` | 120245893309010358 | 120245892933780358 | 1117304254006220 | formación |
| `AD · VERT · S1_CUR · 45+916 · form propio` | 120245893310460358 | 120245892934550358 | 2076998082916565 | formación |
| `AD · VERT · S1_VEL · 45+916 · form propio` | 120245893311900358 | 120245892935420358 | 2554711344941279 | formación |
| `AD · VERT · CLI_HUE · 45+916 · form propio` | 120245893313550358 | 120245892935740358 | 1110031651473942 | clínicas |
| `AD · VERT · CLI_VEL · 45+916 · form propio` | 120245893314930358 | 120245892936080358 | 1491348962802729 | clínicas |
| `AD · VERT · CLI_PRI · 45+916 · form propio` | 120245893315720358 | 120245892936260358 | 1077322415038373 | clínicas |

Estado al crear: PAUSED; revisión de Meta en curso (`PENDING_REVIEW` /
`IN_PROCESS`). Las seis versiones solo-9:16 **siguen activas**: pausarlas
es parte de la activación y la hace Maikel (o la autoriza).

Notas de ejecución:
- La subida de vídeo (`/advideos`) con el token de página falla con error
  genérico (código 1), igual que el 17-sep. Con el token de usuario sube a la
  primera. Anotado: para subir vídeo y crear anuncios hace falta el token de
  usuario; el de página sirve para leer y editar.
- Meta exige `link_urls` en creativos con personalización por colocación
  (subcódigo 1885800). El primer intento creó seis creativos sin enlace que
  no se pueden usar en anuncios; quedan huérfanos en la biblioteca
  (1395994695515342, 1458302986221751, 1703516967386379, 1504027408447965,
  966306786523674, 2328186697993726). No afectan a nada.
- Meta vuelve a copiar los vídeos a ids nuevos dentro del creativo (ya
  conocido); comprobadas duración y dimensiones de las doce copias:
  1080×1350 y 1080×1920, misma duración por pareja.
- Los 4:5 originales subidos a la cuenta: 865409043307626, 1640439994349768,
  2157828358209139, 1439779907529032, 1872157110813816, 2662822967508827.

### Corrección del montaje (1-oct, 12:35 CEST): dentro del mismo anuncio, no como anuncios nuevos

Maikel: *"no tienes que ponerlo como otro anuncio sino dentro del mismo
anuncio en su parte correspondiente, sino serán 6 nuevos"*. Hecho así: los
seis anuncios que ya estaban en circulación se han apuntado al creativo
nuevo (4:5 en feed + 9:16 en stories, mismo formulario). Los seis
duplicados pausados de la tabla anterior se han **borrado**. Verificado por
GET tras el cambio: los seis `ACTIVE`, creativo nuevo, formulario intacto,
las dos piezas presentes.

| anuncio (mismo id de antes) | creativo nuevo |
|---|---|
| S1_PLA `120245892933780358` | 1449455777040581 |
| S1_CUR `120245892934550358` | 1806092807209353 |
| S1_VEL `120245892935420358` | 1094200826435710 |
| CLI_HUE `120245892935740358` | 1650298406772632 |
| CLI_VEL `120245892936080358` | 2393123361425796 |
| CLI_PRI `120245892936260358` | 3759163654232379 |

**T0 del test = 1-oct 12:33 CEST.** Los seis han vuelto a revisión de Meta
(`IN_PROCESS`); los dos anuncios viejos no se han tocado. Rescate previsto:
sábado 4 a las 08:05 (≈ 68 h); se adelanta al viernes 3 si a las 08:05 los
nuevos siguen por debajo del 5 % del gasto de su conjunto.

Nota sobre el estado de hoy a las 12:20 (antes del cambio): los seis nuevos
sumaban 1,45 € y 58 impresiones frente a 13,81 € de los dos viejos; tres de
ellos con 0 impresiones. Es el reparto esperado en un conjunto mixto, no
una avería. Señal aparte: 0 envíos desde el 29-sep, 52,15 € sin lead
(probabilidad ~5 % al coste medio de 17,74 €/envío); si el 1-oct cierra
también a cero se revisa formulario y webhook antes que los anuncios.

---

## Revisión del plan (1-oct, 15:00 CEST): 1.200 €/mes y conjuntos separados

Maikel fija el presupuesto en **1.200 €/mes (40 €/día de media)** y objeta, con
razón, meter los tres anuncios nuevos en el conjunto del anuncio que funcionaba:
añadir anuncios es una edición significativa para Meta y el conjunto mixto ni
protege al viejo ni prueba a los nuevos. Propuesta de Maikel: **viejo 15 € +
nuevos 20 € por vertical = 70 €/día hasta el lunes 6; el lunes se quedan los
ganadores y se baja; una semana mirando calidad; después otras hipótesis.**

### Montado en pausado (15:00 CEST), verificado por GET

| conjunto nuevo (PAUSADO) | id | presupuesto | anuncios (PAUSADOS, en revisión) |
|---|---|---|---|
| `formacion · NUEVOS S1 (3 videos)` | 120245897452530358 | 20 €/día | S1_PLA 120245897454950358 · S1_CUR 120245897456010358 · S1_VEL 120245897456250358 |
| `clinicas · NUEVOS CLI (3 videos)` | 120245897456500358 | 20 €/día | CLI_HUE 120245897458170358 · CLI_VEL 120245897458850358 · CLI_PRI 120245897459220358 |

Copias de los conjuntos vivos (misma audiencia ES 25-65 abierta, mismo objetivo
`QUALITY_LEAD`, misma campaña QV_VERTICALES_Sep26, así que el mismo tope las
gobierna). Los anuncios apuntan a los creativos 4:5+9:16 ya aprobados, cada uno
con su formulario propio: la atribución en GHL por `form-<id>` no cambia.

### Lo que queda de Maikel para arrancar
1. Activar los dos conjuntos NUEVOS.
2. Bajar los conjuntos viejos de 30 a **15 €/día** (o autorizarlo).
3. Autorizar pausar las seis copias nuevas que siguen dentro de los conjuntos
   viejos (120245892933780358, …934550358, …935420358, …935740358, …936080358,
   …936260358), para que cada vídeo corra en un solo sitio.
4. Tope de QV_VERTICALES_Sep26: 800 → **1.575 €** (414,64 gastados + 1.160 de
   octubre).

### Aritmética de octubre con 1.200 €
```
1-oct (hoy, día partido)              ≈  40 €
2–6 oct · 70 €/día × 5 días           = 350 €
7–31 oct · ≈ 32 €/día × 25 días       ≈ 810 €
                                       ─────
                                      ≈ 1.200 €
```
Si la activación es el 2-oct a primera hora, el lunes 6 a las 08:05 hay **4 días
completos** (jue–dom): ≈ 80 € por conjunto de prueba, ≈ 27 € por creativo si el
reparto fuese igual (no lo será). Con eso **el lunes se descarta, no se corona**:
se puede quitar al que tenga CTR claramente peor con ≥ 500 impresiones y señalar
al que lleva mejor coste por apertura; la calidad (cita confirmada, nivel, asistencia)
llega 3-7 días después del envío y es lo que mira la semana del 7 al 13.

### Regla del lunes 6 (08:05)
- Por vertical quedan **como mucho 2 de los 3 nuevos**. Se descarta el de peor CTR
  con ≥ 500 impresiones. El que tenga menos de 10 € de gasto es "no probado" y
  se aparca para otro turno, no se declara malo.
- Los que quedan pasan al conjunto del viejo (viejo + supervivientes) y el
  presupuesto baja a ≈ 16 € formación + ≈ 16 € clínicas = 32 €/día. La medición
  por formulario sigue funcionando aunque compartan conjunto.
- Semana del 7 al 13: calidad por formulario en GHL (wa1, cita confirmada, nivel A,
  reunión). Veredicto de creativos el **lunes 13**; ese día se decide la siguiente
  hipótesis (landing frente a formulario, reencuadre 4:5 nativo del ganador,
  reformas con creativo nuevo, audiencia por intereses).

H-CREATIVO-02 se mantiene como hipótesis, con fecha de muerte **13-oct** en vez
del 11 (el veredicto de calidad necesita la semana completa). El calendario de
72 h / rescate del sábado 4 queda sustituido por lo anterior.

### Activación (1-oct, 15:48 CEST) · "Vale venga dale caña"

Ejecutado en una sola tanda con autorización explícita de Maikel, verificado por
GET inmediatamente después:

| qué | resultado |
|---|---|
| Pausadas las 6 copias nuevas dentro de los conjuntos viejos | PAUSED las seis |
| Conjuntos viejos de formación y clínicas | 30 → **15 €/día**, renombrados `· VIEJO ·` |
| `formacion · NUEVOS S1 (3 videos)` 120245897452530358 | **ACTIVE, 20 €/día**, 3 anuncios activos (en revisión) |
| `clinicas · NUEVOS CLI (3 videos)` 120245897456500358 | **ACTIVE, 20 €/día**, 3 anuncios activos (en revisión) |

**T0 del test = 1-oct 15:48 CEST. Total activo: 70 €/día.** Hoy cuenta como día
parcial. Nadie toca nada hasta el lunes 6 a las 08:05; el sábado 4 a las 08:05
hay revisión sin decisiones (entrega de los seis, primer lead de cada formulario
en GHL con etiqueta y cadencia, ritmo de gasto).

Pendiente de Maikel: tope de QV_VERTICALES_Sep26 800 → 1.575 € y fondos en la
tarjeta (≈ 390 € hasta el lunes, ≈ 810 € más hasta el 31).
