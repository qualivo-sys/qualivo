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
