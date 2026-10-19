# 2b · Creatividades · informe (auditoría oct-2026)

Agente Creative Performance, 19-oct-2026. Complementa el área 2 (Meta Ads) del informe de Paid.

**Fuentes:**
- Paid · Análisis de octubre 2026 (Notion, 19-oct): Meta Marketing API y GHL.
- `paid/revisiones/2026-10-16-analisis-sep-oct-leads-y-calidad.md`.
- `paid/encargos/2026-10-07-creative-demo-caso-v2.md`.
- `paid/revisiones/2026-10-01-*`.
- `bus/out/paid.jsonl` (rama `claude/qualivo-paid`).
- `content/agentes/creative-performance/memoria-creativa.md` y `produccion/video-anuncios/finales/` (rama `claude/qualivo-creative-performance`).

No he leído Meta ni GHL directamente: todas las cifras de resultados son de Paid. No he cambiado nada en Meta.

Leyenda: **[D]** dato confirmado con fuente · **[E]** estimación · **[H]** hipótesis.

## 1 · Situación actual

- **[D] Lo que funciona es un formato, no un gancho.** Las tres piezas con reuniones y propuestas son demos del sistema sobre un caso del sector, con el sector nombrado:
  - formación «viejo» = `QV_3V_formacion_45`;
  - reformas 3V;
  - clínicas «viejo» = `QV_3V_clinicas_45`.

  Las tres son de septiembre y duran unos 70 s. Paid lo midió así hasta el 5-oct: «traen el 100 % de las reuniones celebradas y los nivel A».
- **[D] El 3V2 de formación** sigue el mismo formato con otro caso. Es el más barato por lead de octubre y trajo a HOCO, pero se agotó en unos 4-7 días.
- **[D] Nada de lo nuevo con otro formato ha traído una reunión.** No la han traído ni los ganchos de dolor sobre imagen de archivo ni el anuncio genérico sin sector.
- **[D] Activo a 19-oct:** solo formación «viejo», a 20 €/día. Todo lo demás está pausado.
- **[D] No hay datos por creativo dentro de cada conjunto.** La tabla de resultados por creativo de la memoria creativa sigue vacía: el lead entra en GHL con el formulario, pero no con el nombre del anuncio. Las cifras son por conjunto, y en los conjuntos con un solo anuncio equivalen a la creatividad.

## 2 · Datos por creatividad

### 2.1 · Septiembre y octubre (≈ 90 días), las que tienen resultado comercial [D]
Fuente: Paid, análisis del 16-oct. Periodo: 1-sep a 16-oct.

| Creatividad (conjunto) | Gasto | Leads | Nivel A | Reuniones celebradas | Propuestas | Cliente | €/reunión |
|---|---|---|---|---|---|---|---|
| `QV_3V_formacion` (formación viejo) | 338,74 € | 19 | 8 | 5 | 3 | 0 | 68 € |
| Reformas 3V (vídeo viejo) | 186,38 € | 15 | 3 | 2 | 0 | **1 piloto** | 93 € |
| `QV_3V_clinicas` (clínicas viejo) | 405,23 € | 11 | 5 | 3 | 2 | 0 | 135 € |
| `QV_3V2_formacion` (nativo) | 110,16 € | 4 | 2 | 0 a 16-oct | 0 | 0 | — |
| Clínicas nuevos (`CLI_PRI`) | 47,45 € | 2 | 0 | 0 | 0 | 0 | — |
| Resto: pruebas de septiembre y landing | 306,36 € | 0 en GHL | | | | | |

**Nota [D]:** el nivel B por anuncio no está desglosado en la fuente, así que no puedo dar el % de A/B por creatividad.

### 2.2 · Octubre (1-19 oct) por conjunto [D]
Fuente: Paid, Notion 19-oct. Leads = envíos reales del formulario leídos por API.

| Conjunto | Creatividad | Gasto | CPM | Clics | Leads | €/lead |
|---|---|---|---|---|---|---|
| Formación viejo | `QV_3V_formacion` | 237,81 € | 25,3 € | 101 | 8 | 29,73 € |
| 3V2 formación | `QV_3V2_formacion` | 134,28 € | 43,6 € | 35 | 5 (HOCO, entre ellos) | 26,86 € |
| Clínicas viejo | `QV_3V_clinicas` | 243,00 € | 40,9 € | 59 | 6 | 40,50 € |
| Clínicas nuevos | CLI (dolor sobre archivo) | 80,99 € | 36,0 € | 20 | 2 | 40,50 € |
| HZ «ya inviertes» | `QV_HZ_ya-inviertes` (genérico) | 49,47 € | 49,9 € | 16 | 0 | — |
| Formación nuevos S1 | `S1_VEL`, `S1_PLA`, `S1_CUR` | 44,68 € | 44,1 € | 5 | 0 | — |
| Clínicas 3V2 | `QV_3V2_clinicas` | 33,63 € | 59,5 € | 3 | 0 | — |
| Test landing v21 | `QV_3V2_formacion` → landing | 23,36 € | 41,3 € | 55 | 0 | — |

**Reuniones y propuestas de octubre [D]:**
- **HOCO** (3V2 formación): propuesta de 2.000 €, pendiente.
- **Formación** (formación viejo): oferta abierta.
- **Clínica estética** (clínicas viejo): perdida contra un competidor.

## 3 · Contraste con los datos de Growth

| Afirmación de Growth | Veredicto | Detalle |
|---|---|---|
| «En octubre los viejos de formación y clínicas superan a todo lo nuevo» | **Casi siempre cierto, con una excepción** | **[D]** El 3V2 de formación tiene el mejor €/lead de octubre (26,86 € frente a 29,73 €) y trajo el lead de más valor del mes, HOCO. Se agotó: Meta casi dejó de entregarlo desde el 15-oct. El 3V2 es el mismo formato que los viejos con otro caso; lo nuevo que falla es lo que cambia de formato. |
| «S1, 3V2 clínicas, HZ y el formulario propio gastaron 209 € sin nada útil» | **La conclusión se sostiene; la cifra no me cuadra** | **[D]** Con los datos de Paid del 19-oct, S1 + 3V2 clínicas + HZ + landing suman 151,14 € con 0 leads. Si se añade clínicas nuevos (CLI), son 232,13 € con 2 leads y 0 reuniones. No sé qué conjunto o periodo da 209 €: Growth debería indicar la fuente. |
| «3V2 formación → landing v2: 55 clics y 0 leads» | **Cierto, pero no sirve para juzgar la creatividad** | **[D]** 23,36 € en 2 días. Con el banner de cookies, GA4 solo registró 1 sesión de pago. Paid concluye que no se puede medir. El problema es la landing o la medición, no el vídeo: el mismo vídeo con formulario nativo trajo 5 leads. |

**Matiz sobre el HZ [D]:** el genérico tenía tres cosas nuevas a la vez:
- creatividad sin sector;
- formulario nuevo de 5 preguntas;
- conjunto nuevo en aprendizaje, con CPM de 49,9 €.

Paid vio que la gente abría el formulario y no lo enviaba, y que solo 9 personas vieron el vídeo entero. Con 49 € no se puede saber cuál de las tres cosas falló.

## 4 · Producido y sin usar

| Pieza | Estado | ¿Vale para noviembre? |
|---|---|---|
| Reformas 3V (vídeo viejo) | **[D]** Pausado desde el 1-oct. Es la única creatividad con cliente (piloto) | Depende de si Maikel quiere reformas en el reparto. Es decisión de Paid y presupuesto. |
| «Las fugas» v2 (3 cortes de 53-61 s; uno con Maikel a cámara) | **[D]** Terminado el 29-sep, nunca subido. Usa la voz clonada de Javier y planos de Kling | **[E]** Usa el formato historia con interfaces. Habría que revisar las promesas antes de subirlo (contexto §5). |
| Versiones 1 de Velocidad, Plantones y Curiosos (30-sep) | **[D]** Sustituidas por las versiones 2 (S1), que ya fallaron | No. Mismo ángulo que S1. |
| `CLI_VEL` y `CLI_HUE` | **[D]** Producidos. Paid los agrupa con CLI_PRI en «clínicas nuevos» | No. Dolor sobre imagen de archivo, el formato que no ha funcionado. |
| Estilo Veam v1/v2 | **[D]** Borrador, CTA con el precio antiguo | No sin rehacer el CTA. |
| Corte de 30 s del HZ | **[D]** Paid lo pidió el 15-oct y no se ha producido | No, mientras lo genérico no tenga base. |
| VSL de Maikel (5:38, 4K) | **[D]** Terminada el 14-oct para la landing de formación. No consta que esté publicada | No es un anuncio. Depende de que se arregle la medición de la landing. |
| Propuestas sin producir: N1-N4 (15-oct) y conceptos ICP C1-C3 (14-oct) | **[D]** Solo guion. Nada gastado | Ver §6. Quedan en reserva hasta que haya base. |

## 5 · Cuánto cuesta producir una creatividad

**[E] Estimaciones a partir de lo ocurrido en esta sesión.** No hay registro de horas.

| Tipo | Horas de Maikel | Plazo | Coste directo |
|---|---|---|---|
| Demo del sistema sin personas (tipo 3V2 o HZ) | **1-2 h** de revisión y feedback. El HZ necesitó 6 versiones en una tarde (15-oct); el 3V2, una corrección de zona segura | 1 día | Voz de ElevenLabs (David): unas pocas generaciones por pieza. El coste de la suscripción no lo tengo. Sin Kling. |
| Variante de una demo que ya funciona (nuevo caso o gancho sobre el mismo esqueleto) | **[E] 0,5-1 h** | Medio día | Igual |
| Vídeo con Maikel a cámara (tipo VSL) | **[E] 6-10 h**: grabación, regrabaciones y unas 15 rondas de revisión entre el 9 y el 14-oct | 4-6 días | Unos 90 créditos de Kling, más la voz |

## 6 · Recomendación para noviembre

### Mantener
- **[D] `QV_3V_formacion` (formación viejo).** Es la única creatividad que sostiene entrega y trae reuniones (68 € por reunión).
- No tocar la creatividad mientras sale del aprendizaje, como propone Paid.

### No volver a probar
- **[D] Ganchos de dolor sobre imagen de archivo** (S1 y CLI). Llevan dos rondas: abren bien el primer día, caen en 48 h y no hay reuniones (Paid, 5-oct y 19-oct).
- **[D]+[H] Anuncios genéricos sin sector a 15-20 €/día.** El HZ y los nuevos sin sector gastaron sin leads, y Paid concluye que «solo funcionan los anuncios que nombran formación». El HZ no prueba que lo genérico no funcione, porque cambiaba tres cosas a la vez (§3). Aun así, con este presupuesto no hay margen para aprenderlo.
- **[D] Llevar tráfico a la landing** mientras el banner de cookies impida medirla. No es un fallo creativo, pero tampoco se puede leer.

### Hipótesis con base (como mucho dos)

**H1 · Relevo del 3V2 de formación con un caso nuevo [H].**
- **Base [D]:**
  - el 3V2 formación tuvo el mejor €/lead de octubre y trajo a HOCO;
  - se agotó en una semana;
  - el viejo lleva 5 semanas aguantando.

  El formato funciona; lo que se gasta es la pieza.
- **Prueba:** un vídeo nuevo con el mismo esqueleto (sector nombrado, caso concreto, reloj, señal a Meta), otro caso de formación y el formulario de formación actual. Se lanza cuando el viejo baje de entrega, no a la vez.
- **Coste:** 0,5-1 h de Maikel [E], 1 día de producción, unos 150 € de prueba.
- **Fecha de muerte:** 150 € o 10 días sin una cita reservada.
- **Coincide** con el punto 3 de noviembre de Paid («3V2 con vídeo nuevo»).

**H2 · Ganchos que nombran el dolor de seguimiento, dentro de la demo de formación [H].**
- **Base [D]:** «¿dónde se te escapan?», respondido con «en el seguimiento», aparece en los mejores leads de octubre (Paid §4).
- **Prueba:** solo cambia el gancho de los primeros 3-5 s de la pieza de H1 (por ejemplo, el presupuesto que nadie volvió a llamar). El cuerpo de la demo no se toca.
- **Coste:** sin horas extra si se produce junto con H1. Se prueba en el mismo conjunto contra H1.
- **Requisito:** que el lead entre en GHL con el nombre del anuncio. Si no, no se puede separar H1 de H2 por calidad.

### Condición para cualquier prueba creativa
Un cambio a la vez y con fecha de muerte. Antes de producir nada, Growth y Paid tienen que hacer que **cada lead entre en GHL con el nombre exacto del anuncio**. Sin eso, la tabla por creativo seguirá vacía en noviembre.

## 7 · Problemas, ordenados por impacto

1. **[D] Sin atribución por creativo en el CRM.** Impide decidir qué gancho trae calidad dentro de un conjunto.
2. **[D] Las piezas se agotan rápido con presupuestos pequeños.** El 3V2 duró una semana y no hay relevo producido del formato ganador.
3. **[D] Se probaron muchos formatos a la vez, a 15-20 €/día.** Entre septiembre y octubre se gastaron 306 € sin leads en GHL y 151-232 € en octubre sin reuniones. Ningún conjunto ha salido del aprendizaje (Paid §6).
4. **[D] Pruebas contaminadas.** El HZ cambió creatividad, formulario y conjunto a la vez; la landing no se podía medir.
5. **[E] Horas de Maikel en revisiones.** Las piezas nuevas desde cero cuestan 1-2 h; una variante del ganador, menos de la mitad.

---
*No he subido ni cambiado nada en Meta. Las cifras de resultados son de Paid; las horas son estimaciones.*
