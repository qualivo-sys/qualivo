# Auditoría de las cifras de los casos (27-oct-2026)

1. **36 cifras distintas** en las 4 páginas de casos de producción (rama `claude/qualivo-landing-vercel-nubk1i`). Las de C-01, C-02 y C-03 se repiten en unas 45 páginas más y en los correos automáticos de `api/`.
2. **Comprobables hoy: 4 sí, 6 en parte y 26 no.** Las 4 que se pueden comprobar son de C-04, con su cuenta de Meta. **Ninguna cifra de retorno ni de ventas tiene fuente en el repo** (10,2×, 44.000 €, 6,45×, 12.900 €, 8,3× y 30.000 €).
3. **Se mantienen 4** (C-04: 6,86 €, 5,95 €, 3,2 € y −53 %), siempre con fecha y fuente.
4. **Hay que reformular 9**: pasan a un rango o a una redacción con fecha y fuente. Tres de ellas **contradicen los datos de Meta** (2,86 €, «ambas por debajo de 3,50 €» y CPC de 0,20 €).
5. **Hay que quitar 23**: todos los retornos, las ventas y las inversiones en euros, el embudo de C-03 (559 / 573 / 68 / 10) y los datos del CRM que no se pueden ver.
6. **Aplicado en la rama:** las 4 páginas anónimas, `llms.txt` (líneas de los casos) y los borradores de permiso. **No está aplicado** en el resto de páginas ni en `api/` (lista en la sección 4). La rama no debe fusionarse sin eso.

> Repo público: los clientes van por código (C-01…C-04), como en
> `content/casos/2026-10-27-borradores-permiso.md`. No se citan rutas, nombres ni
> números de cuenta que los identifiquen. Las cifras sí aparecen.

---

## 0. Cómo se ha hecho

- **Origen de cada cifra:** `git log -S'<cifra>' --all` sobre todo el historial, y después búsqueda en `content/`, `research/`, `paid/`, `bus/`, `intelligence/`, `api/_fichas/`, `apps-script-standalone/` y `drafts/`.
- **Resultado:** las 36 cifras entran en el repo el **11-ago-2026**, en cuatro commits seguidos de una misma sesión (`52da4235` a las 18:22, `2eb095ca` a las 18:33, `0d0528f7` a las 18:47 y, antes, `fd1d334a` a las 07:46 en `captacion/landing-mapa-fugas.html`). **Ninguno cita un documento, un CSV, una captura ni un panel.** Se escribieron a partir de lo que se dijo en la conversación. La landing de las 07:46 lo admite: «Cifras aportadas por cada cliente sobre el periodo indicado».
- **Comprobación con Meta (solo lectura, 27-oct-2026, ~07:50 UTC):** varias peticiones GET de `insights` (`spend`, `actions`, `ctr`, `cpc`, `clicks`, `action_values`) con el token de `.env.meta`. **El token tiene acceso a las cuentas de los cuatro clientes**, no solo a la de C-03. No se ha cambiado nada. Meta puede rehacer las cifras de días pasados por la atribución, así que son las de hoy.
- **Lo que Meta no puede probar:** ventas, facturación, matrículas, entrevistas, oportunidades del CRM ni retorno. Para eso hace falta el CRM o la contabilidad del cliente, y no hay ninguna copia en el repo.

### Corrección sobre el panel de C-03

El aviso del Chief of Staff decía que «el panel de C-03 no calcula el retorno». **Sí lo calcula, pero con un precio supuesto.** El script del panel, en `apps-script-standalone/` (único `.gs` de la carpeta, commit `05f1fca7`, 29-jul-2026), líneas 40 y 179:

```js
MATRICULA: 4400,
var fact=crm.matriculas*CFG.MATRICULA, roas=totInv>0?fact/totInv:0;
```

- La «facturación» es **nº de oportunidades ganadas × 4.400 €**, un precio fijo escrito a mano en el código. No sale de lo facturado.
- Los «44.000 €» son 10 × 4.400 €. El «ROAS 10,2×» es 44.000 € ÷ unos 4.310 € de inversión (559 leads × 7,71 €).
- Las «matrículas» son las oportunidades que pasaron a ganadas en ese mes, aunque se crearan antes (`wonCarry`).
- Las «entrevistas» son las oportunidades creadas en el mes que hoy están en «Entrevistado», «Negociación» o ganadas. No son entrevistas hechas.
- La inversión de TikTok es un número escrito a mano (`TIKTOK_SPEND: 430.66`, `TIKTOK_CONV: 37`).
- El panel solo escribe el mes en curso en un Google Sheet externo, y el repo no guarda ninguna copia. **No se puede saber de qué mes son las cifras publicadas.**

---

## 1. Tabla por cifra (páginas de casos en producción)

Leyenda de «¿Se puede comprobar hoy?»: **sí** = la reproduzco con datos primarios · **parcial** = solo una parte, o con otra base · **no** = no hay fuente o los datos la contradicen.

### C-03 · Centro de formación profesional

| # | Cifra literal | De dónde sale | ¿Se puede comprobar hoy? | Propuesta y texto exacto |
|---|---|---|---|---|
| 1 | «10,2×» · «ROAS — retorno sobre la inversión publicitaria» (hero, resultados, meta description) | `2eb095ca`, 11-ago-2026 18:33 (alta del caso, sin fuente). Cálculo del panel (script de `apps-script-standalone/`, línea 179): matrículas × 4.400 € fijos ÷ inversión. No hay copia del Sheet. | **No.** Hacen falta el Sheet de ese mes, Google Ads, TikTok y las oportunidades ganadas en GHL. Además, el numerador es un precio supuesto, no lo facturado. | **Quitar.** Solo se vuelve a poner con una exportación guardada y el OK del centro, y con este texto: «Retorno estimado de X× en [mes y año]: matrículas × precio medio de matrícula ÷ inversión publicitaria, según el CRM del centro». |
| 2 | «Por cada 1 € invertido en captación, ~10 € en matrículas» · «con retorno de 10×» | Sale de la 1. | **No.** | **Quitar.** En la frase final: «— con visibilidad del anuncio a la matrícula, curso a curso». |
| 3 | «44.000 € · Facturación atribuida en un mes» | `2eb095ca`. Son 10 × 4.400 € (`CFG.MATRICULA`). | **No.** Es una estimación, no facturación. | **Quitar.** |
| 4 | «10 · Matrículas cerradas en el mes» | `2eb095ca`. En el panel son las oportunidades ganadas por fecha de cambio de estado, incluidas las de meses anteriores. | **No.** No hay acceso a GHL ni copia del mes. | **Quitar.** |
| 5 | «7,71 € · CPL medio — coste por lead» | `1c799356` / `2eb095ca`, 11-ago. CPL combinado de Meta, Google y TikTok. | **Parcial.** CPL mensual en Meta en 2026: jun 5,12 €, jul 6,59 €, ago 8,76 €, sep 6,33 €, oct (hasta el 26) 4,86 €. El combinado no se puede rehacer. | **Rango:** «5-9 € · Coste por lead en Meta, rango mensual de junio a septiembre de 2026». |
| 6 | «573 · Oportunidades generadas en el CRM» | `2eb095ca`. | **No** (es del CRM). | **Quitar.** |
| 7 | «559 · Leads captados · Meta · Google · TikTok» | `2eb095ca`. | **No, y Meta no cuadra.** Solo Meta dio 556 leads en junio y 544 en julio de 2026. Con los 37 de TikTok del panel, ninguno de los dos meses da 559, y ningún mes da a la vez 559 leads y unos 4.310 € de inversión. | **Quitar.** |
| 8 | «68 · Entrevistas» (y, en la rama, «12 % de leads a entrevista» y «15 % de entrevistas a matrícula») | `2eb095ca`. En el panel, una «entrevista» es una oportunidad que hoy está en esa etapa. | **No.** | **Quitar.** En su lugar va el embudo sin números: «El panel cuenta cada mes, por curso y por canal, cuántos leads llegan a cada etapa. Las cifras del centro no se publican». |
| 9 | «100% · Trazabilidad del anuncio a la matrícula» | `2eb095ca`. | **No.** El panel deja una parte en «Otros/web» (`chan()`) y TikTok va a mano, así que no es el 100 %. | **Quitar.** Lo sustituye «3 · Canales en el mismo panel: Meta y Google, automáticos; TikTok, a mano». Esto sí está comprobado en el código. |

### C-01 · Consulta de salud con servicios y formación online

| # | Cifra literal | De dónde sale | ¿Se puede comprobar hoy? | Propuesta y texto exacto |
|---|---|---|---|---|
| 10 | «6,45×» · «De retorno» (title, hero, resultados) | `52da4235`, 11-ago 18:22. **Esa misma mañana** (`fd1d334a`, 07:46) el mismo caso ponía «8,6x · 12.900 € facturados con 1.500 € de inversión publicitaria». La inversión pasó de 1.500 € a 2.000 € en 11 horas sin ninguna fuente. | **No.** | **Quitar.** Solo con los datos de la clienta por escrito: «Según la clienta, X € en ventas atribuibles con Y € invertidos en [qué] entre [fechas]». |
| 11 | «2.000 € · De inversión» | `52da4235` (antes, «1.500 €»). | **No, y además no se explica.** Las dos cuentas de Meta de la clienta suman unos 271.000 € de 2024 a oct-2026, así que «2.000 €» no puede ser su inversión publicitaria. No se dice qué es (¿honorarios?, ¿un lanzamiento?). | **Quitar.** |
| 12 | «12.900 € · En ventas atribuibles al sistema» | `fd1d334a` / `52da4235`. | **No.** Las compras que mide el píxel no llegan a esa cifra en ningún mes, y las ventas por llamada no pasan por Meta. | **Quitar.** |
| 13 | «sin captar un lead más» · «Mismo tráfico» · (en la rama) «0 € de inversión extra en captación» | `52da4235`. | **No.** La inversión mensual en la cuenta principal de Meta de la clienta va de unos 1.900 € a unos 16.000 € en 2024-2026. Sin un periodo, «0 € extra» no se puede probar. | **Quitar** el «0 €». Nuevo título de la sección: «Mismas oportunidades. Sistema distinto.» |
| 14 | «más de 20 años de experiencia» (biografía de la clienta) | `52da4235`. | No comprobado. No es un resultado. | **Quitar** (ya estaba quitado en la versión anónima porque identifica). |

### C-02 · Empresa de reformas B2B

| # | Cifra literal | De dónde sale | ¿Se puede comprobar hoy? | Propuesta y texto exacto |
|---|---|---|---|---|
| 15 | «8,3×» · «De retorno sobre la inversión» | `fd1d334a` (07:46: «30.000 € facturados en tres meses con 3.600 € de inversión publicitaria») y `52da4235`. | **No.** | **Quitar.** En el hero lo sustituye «6 · Piezas construidas desde cero», que es comprobable en la propia página (6 tarjetas). |
| 16 | «3.600 € · De inversión» | Los mismos commits. `content/estrategia/2026-10-15-cliente-ideal.md:17`: «“1.200 €” al mes según Maikel (14-oct), **periodo a confirmar**». | **Parcial y no cuadra.** La cuenta de Meta del cliente suma 4.542 € (nov-2025 a jul-2026). El máximo en tres meses seguidos es 2.352 € (ene-mar 2026), lejos de los «3.600 € en tres meses» de la versión original. No sé si hubo Google Ads. | **Quitar.** |
| 17 | «30.000 € · En ventas» | Los mismos commits. | **No.** | **Quitar.** Solo con datos del cliente: «Según el cliente, X € en ventas entre [fechas]». |

### C-04 · Academia de formación en oficios

Todas las cifras de esta tabla, con la cuenta de Meta del cliente. «Arranque» son las tres primeras campañas del curso principal (2-14 de julio de 2026). «Campaña con reel» es la v2 del curso principal (17 de julio a 14 de agosto). El caso se publicó el 11 de agosto.

| # | Cifra literal | De dónde sale | ¿Se puede comprobar hoy? | Propuesta y texto exacto |
|---|---|---|---|---|
| 18 | «leads cualificados de [oficio] a 3 €» (title, h1) | `0d0528f7`, 11-ago 18:47. | **Parcial.** El CPL de la campaña con reel es 3,21 €. Que los leads estén «cualificados» no se puede ver sin el CRM. | **Reformular:** «Leads con preguntas filtro a unos 3 €». |
| 19 | «3,22 € · CPL · [curso principal] (reel)» | `0d0528f7`. | **Sí.** El anuncio reel, el 11-ago: 186,58 € / 58 leads = 3,22 €. Hoy el reel está en 3,25 € y la campaña en 3,21 €. | **Mantener**, con fecha: «De 6,86 € a 3,21 € por lead en el curso principal (julio-agosto de 2026, datos de la cuenta de Meta)». |
| 20 | «82 leads con 264 € invertidos» | `0d0528f7`. | **No.** El 11-ago el reel llevaba 58 leads con 186,58 € y la campaña 120 leads con 382,31 €. Ninguna suma da 82 / 264 €. | **Quitar.** |
| 21 | «2,86 € · CPL · cursos cortos · el más barato» · «CPL de 2,86 € desde el primer día» | `0d0528f7`. | **No: los datos lo contradicen.** Cursos cortos: 3,91 € tras sus tres primeros días, 4,05 € el 11-ago (el día que se publicó) y 3,64 € en total (80,09 € / 22 leads). | **Reformular:** «~3,6 € · CPL · cursos cortos · campaña nueva» y «CPL de unos 3,6 € en sus primeras semanas». |
| 22 | «1,82 % · CTR del reel [curso principal]» | `0d0528f7`. | **Parcial.** Reel: 1,80 % el 11-ago y 1,76 % en total. | **Reformular** con la misma base que el CPL: «+28 % · CTR frente al arranque» (1,36 % → 1,75 %). |
| 23 | «CPC de 0,20 €» (reel) | `0d0528f7`. | **No.** Reel: 0,15 €. Campaña con reel: 0,18 €. | **Reformular:** «−56 % · CPC frente al arranque» (0,42 € → 0,18 €). |
| 24 | «132 · Leads [curso principal] (histórico)» | `0d0528f7`. | **No.** El 11-ago Meta daba 170 leads en las campañas del curso. El «histórico» incluye leads importados al CRM, que no se pueden ver. | **Quitar.** |
| 25 | «123 tratos en pipeline» | `0d0528f7`. | **No** (es del CRM). | **Quitar.** |
| 26 | «639 € · Inversión total» | `0d0528f7`. | **No.** Del 1-jul al 11-ago la cuenta gastó 794,27 €, y ninguna fecha de corte da exactamente 639 €. | **Quitar.** |
| 27 | «143 leads captados» | `0d0528f7`. | **No** (no cuadra con ningún corte). | **Quitar.** |
| 28 | «~8 seg · Sync Meta → CRM» | `0d0528f7`. | **No.** No hay ningún registro de la prueba en el repo. Se podría medir comparando la hora de cada lead en Meta con la de alta en GHL. | **Reformular:** «en segundos, automático» (sin número). La cifra solo vuelve con una medición guardada. |
| 29 | «6,86 € · Arranque · primera campaña» | `0d0528f7`. | **Sí**, pero no es «la primera campaña»: son **las tres primeras** (web, dinámica y formulario v1), 343,13 € / 50 leads. | **Mantener** como «Arranque: las tres primeras campañas del curso principal (2-14 de julio de 2026)». |
| 30 | «5,95 € · Formulario v1» | `0d0528f7`. | **Sí.** 285,52 € / 48 leads (4-14 jul). | **Mantener** (en la página anónima, como índice 87). |
| 31 | «CPL −53 %» | `0d0528f7`. | **Sí.** 6,86 € → 3,22 € (reel, 11-ago) o 3,21 € (campaña, total): −53 %. | **Mantener**, con contexto: «−53 % (de 6,86 € a 3,21 €, julio-agosto de 2026, datos de Meta)». |
| 32 | «CTR de 1,30 % a 1,82 %» (+40 %) | `0d0528f7`. | **Parcial y con dos bases distintas.** 1,30 % es solo el formulario v1, no el arranque, y 1,82 % no sale (el reel da 1,80 % o 1,76 %). | **Reformular:** «CTR +28 %» (arranque 1,36 % → campaña con reel 1,75 %). |
| 33 | «CPC de 0,42 € a 0,20 €» (−52 %) | `0d0528f7`. | **Parcial.** 0,42 € sí es el arranque (343,13 € / 816 clics). 0,20 € no sale. | **Reformular:** «CPC −56 %» (0,42 € → 0,18 €). |
| 34 | «Dos campañas activas, ambas por debajo de 3,50 € el lead» | `0d0528f7`. | **No: los datos lo contradicen.** El día que se publicó, los cursos cortos estaban a 4,05 €. | **Reformular:** «Dos campañas: unos 3,2 € el lead en el curso principal y unos 3,6 € en los cursos cortos». |
| 35 | «cursos de 260 € a 1.099 €» | `0d0528f7`. Es un dato del cliente (precios), no un resultado. | No comprobado. | **Quitar** (ya quitado en la versión anónima porque identifica). |
| 36 | «[ciudad] + 40 km» | `0d0528f7`. Es la segmentación, no un resultado. | No comprobado. | **Quitar** (ya quitado en la versión anónima). |

**Recuento (36):**
- **Sí:** 4 (19, 29, 30 y 31).
- **Parcial:** 6 (5, 16, 18, 22, 32 y 33).
- **No:** 26.
- **Mantener:** 4 (19, 29, 30 y 31).
- **Reformular o rango:** 9 (5, 18, 21, 22, 23, 28, 32, 33 y 34).
- **Quitar:** 23.
- **«Según el cliente»:** hoy ninguna. Es el camino para recuperar las cifras 1, 10 y 17 si el cliente da su dato por escrito. Los borradores de permiso ya se lo piden (sección 3).

---

## 2. Las tres más problemáticas

1. **C-03, «44.000 € de facturación» y «ROAS 10,2×».** Se presentan como facturación y retorno reales, pero el código que los calcula multiplica las oportunidades ganadas por un precio fijo de 4.400 €. Además, no se puede saber el mes, y los datos de Meta de junio y julio no cuadran con los 559 leads publicados. Es la cifra que más se repite: 35 ficheros, sin contar los casos.
2. **C-01, «6,45×: 2.000 € → 12.900 €».** El mismo caso se publicó por la mañana con «1.500 € → 8,6×» y por la tarde con «2.000 € → 6,45×», sin ninguna fuente. Además, la clienta invierte en Meta decenas de miles de euros al año, así que «2.000 € de inversión» y «sin captar un lead más» dan a entender algo que no se puede sostener.
3. **C-04, «2,86 € en cursos cortos» y «ambas campañas por debajo de 3,50 €».** Son las únicas cifras que **los propios datos de Meta desmienten**: el día que se publicó, los cursos cortos estaban a 4,05 €. El resto del caso C-04 sí se sostiene.

---

## 3. Qué se ha cambiado en esta rama

- `casos/formacion-profesional/` (C-03):
  - Fuera: el 10,2×, «~10 € por 1 €», el 12 %, el 15 %, «< 8 €», el 100 % y el embudo escalado (1.000 / 1.025 / 122 / 18), que salía de las cifras 4 y 6 a 8.
  - Entra en el hero y en los resultados: «5-9 € · Coste por lead en Meta (jun-sep 2026)».
  - Otros resultados: 3 canales (TikTok, a mano), 4 etapas seguidas y el panel que se actualiza una vez al día.
  - El embudo se queda con las etapas, sin números.
- `casos/salud-servicios-online/` (C-01): fuera el 6,45× (title, metas, hero y resultados) y el «0 € de inversión extra». Los resultados pasan a texto, sin cifras.
- `casos/reformas-b2b/` (C-02): fuera el 8,3× (metas, hero y resultados). En el hero entra «6 · Piezas construidas desde cero», y los resultados explican que la cifra de ventas no se publica.
- `casos/academia-oficios/` (C-04):
  - «cualificados» pasa a «con preguntas filtro».
  - El CPL va con euros, fechas y fuente (6,86 € → 3,21 €).
  - Cursos cortos: «~3,6 €».
  - CTR +28 % y CPC −56 %, con la misma base que el CPL.
  - Fuera los «~8 seg», que pasan a «en segundos».
  - El índice 100 / 87 / 47 se queda, con la base explicada.
- `llms.txt`, líneas 28-31 (resumen de los cuatro casos): con el mismo criterio.
- `content/casos/2026-10-27-borradores-permiso.md`:
  - Los textos de los cuatro correos se han cambiado igual.
  - C-01, C-02 y C-03 llevan un párrafo que pide al cliente sus números (ventas o matrículas, inversión y fechas) para poder publicar el retorno «según el cliente».

---

## 4. Pendiente antes de fusionar: el resto de la web y los correos

Estas páginas repiten las cifras de la sección 1 y **no se han tocado** (en la rama, ya sin nombres). Rutas de producción. Hay que revisar los falsos positivos de la búsqueda.

| Cifra | Ficheros | Propuesta (texto exacto) |
|---|---|---|
| **10,2×** (ROAS, «del anuncio a la matrícula», «ROAS hasta 10,2×», «Mejor ROAS publicado») | `index.html`, `anterior/`, `inicio/v2/`, `home-nueva/` y `home-nueva/v1/`, `formacion/` y sus versiones `anterior/`, `v2/`, `v21/` y `v22/`, `asesorias/`, `clinicas/`, `reformas/anterior/`, `como-funciona/`, `diagnostico/` y `diagnostico/v2/`, `servicios/`, `sobre/`, `video/`, `recorrido/v3/`, `growth-b2b/`, `gestion-google-ads/`, `automatizacion-comercial/`, `consultora-growth-barcelona/`, `consultoria-growth-marketing/`, `consultoria-ia/`, `consultoria-marketing-digital/`, `blog/captacion-de-leads/`, `blog/funnel-de-ventas/`, `blog/leads-pero-no-ventas/`, `blog/metricas-de-marketing/`, `diccionario/cac/`, `diccionario/roas/` y `llms.txt` (líneas 10 y 61 de la rama) | **Quitar el número.** Si la tarjeta lo necesita: «5-9 € · Coste por lead en Meta · centro de formación (jun-sep 2026)». Si no: «Del anuncio a la matrícula, medido por curso y canal». En `diccionario/roas/`: «en un centro de formación, el retorno no se mira en el panel de Meta: se sigue cada lead por el CRM hasta la matrícula, canal a canal». |
| **44.000 €** y el embudo **559 → 573 → 68 → 10** | `index.html`, `anterior/`, `inicio/v2/`, `formacion/` (las 4 versiones), `growth-b2b/`, `blog/index.html`, `blog/funnel-de-ventas/` (en la rama, escalado a 1.000 y todavía con «ROAS 10,2×») y `blog/captacion-de-leads/` | **Quitar.** En `blog/funnel-de-ventas/`, embudo sin números y esta frase: «Un mes real de un centro de formación, medido por canal; las cifras del centro no se publican». |
| **6,45×**, **2.000 €** y **12.900 €** | `anterior/`, `inicio/v2/`, `home-nueva/` (las 2), `asesorias/`, `clinicas/`, `como-funciona/`, `diagnostico/` (las 2), `reformas/anterior/`, `recorrido/v3/`, `encaja/`, `video/`, `growth-b2b/`, las 5 landings SEO, 10 artículos del blog, `diccionario/`, `diccionario/lead-scoring/` y `llms.txt` (líneas 62 y 90 de la rama) | **Quitar el número.** Texto: «Una consulta de salud: no faltaban leads, faltaba saber cuáles merecían atención». |
| **8,3×**, **3.600 €** y **30.000 €** | `index.html`, `reformas/` y `reformas/v22/`, `anterior/`, `inicio/v2/`, `home-nueva/` (las 2), `asesorias/`, `clinicas/`, `como-funciona/`, `diagnostico/` (las 2), `formacion/anterior/`, `reformas/anterior/`, `recorrido/v3/`, `growth-b2b/`, `gestion-google-ads/`, `automatizacion-comercial/` y 3 landings SEO | **Quitar el número.** Texto: «Una empresa de reformas B2B: no había sistema que optimizar; lo construimos desde cero». |
| **−53 %** | Unas 20 páginas (cuadros de casos, landings SEO, `blog/captacion-de-leads/`, `blog/index.html` y `diccionario/cualificacion-de-leads/`) | **Mantener.** Donde quepa: «−53 % de coste por lead (de 6,86 € a 3,21 €, jul-ago 2026)». |
| **2,86 €**, «CPL por debajo de 3 €» y «CPL desde 2,86 €» | `servicios/` y `llms.txt` (línea 10 de la rama) | **Reformular:** «CPL de unos 3 €». |
| «Casos con retornos de 6-10×» y «de 6× a 10×» | `consultoria-growth-marketing/` (meta y og) y `launch/` | **Quitar:** «Casos reales, con lo que se puede medir». |
| **Otros clientes, fuera de C-01…C-04:** «1.160 leads y 21 matrículas en cuatro meses» (academia de manicura) | `diagnostico/` (las 2), `home-nueva/` (las 2) y `formacion/` (las 4 versiones). Origen: `3a263e2b`, 11-sep, «Cifras facilitadas por Maikel (mayo a 11 de septiembre, vista de cohorte)». | **No comprobable en el repo.** Quitar hasta tener el dato y el permiso. |
| **Otros clientes:** «de 83 a 168 entrevistas al mes (+102 %)» (misma academia) | `diagnostico/` (las 2), `consultoria-ia/`, `blog/leads-pero-no-ventas/` y `llms.txt` (línea 10 de la rama) | **Quitar.** Viene de un caso que se retiró de la web el 13-ago (`deac4660`). El «−61 % de CPL en Google» de ese caso ya no está publicado. |
| **Otros clientes:** «ROAS de 0,1 a 7,6» (venta de maquinaria) | `diagnostico/` (las 2) y `home-nueva/` (las 2) | **Quitar.** Origen: `1f9be36c` (1-sep, carpeta `ventas/`), sin fuente. |
| **Correos y agentes automáticos** (también es publicidad: se envían a leads) | `api/_secuencia.js` (10,2× con 559 / 68 / 10, 6,45× con 2.000 / 12.900 €, 8,3× con 3.600 / 30.000 € y 0,1→7,6), `api/_agente.js:38`, `api/_correo-cita.js:106`, `api/_mensajes.js:328`, `api/_nurturing-correos.json` y `content/nurturing/correo/*.html` | Mismo criterio que la web. **Es lo más urgente después de la web**, porque se sigue enviando. |

---

## 5. Para volver a publicar una cifra de retorno

1. Pedir al cliente su número por escrito: ventas o matrículas, inversión y fechas. Los borradores de permiso ya lo piden.
2. Guardar la prueba sin nombres en una carpeta privada (no en este repo, que es público) y anotar la ruta en la nota del contacto en GHL.
3. Publicar con fecha, método y fuente: «Según el cliente, X € en ventas con Y € de inversión publicitaria entre [fechas]». Nunca «facturación» si es una estimación.
4. Para C-03, si se quiere usar el panel: exportar la pestaña del mes con su fecha y llamarlo «retorno estimado (matrículas × precio medio)», no «facturación».
