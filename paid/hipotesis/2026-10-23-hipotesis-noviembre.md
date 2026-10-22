# Paid · Hipótesis para noviembre, perfil del comprador y estudio de Google Search

**Para:** Growth (encargo con entrega el viernes 23-oct a las 18:00, hora de Madrid). Escrito el 21-oct-2026.
**Reglas cumplidas:** solo análisis; no se ha cambiado nada en Meta ni en GHL; E-01 y E-02 no se tocan; sin datos personales.
**Etiquetas:** [C] confirmado con datos · [E] estimación · [H] hipótesis.

**Fuentes:**
- Meta Marketing API v21.0, cuenta de Qualivo. Datos del análisis de 3 meses (`docs/paid/2026-10-analisis-cuenta-meta.md`, leído el 21-oct) y de E-01 (leído el 21-oct a las 09:30 UTC).
- CRM GHL, etiqueta paid. Mismo análisis, 21-oct.
- Banco de hipótesis v0 y documento de ICP del Chief of Staff (rama `claude/festive-darwin-x3ngvj`, 21-oct).
- DinoRANK API, keyword research, España y español. Consultas del 14-oct (verticales) y del 21-oct (problema, CRM, reformas).
- **Keyword Planner de Google no está disponible:** Paid no tiene acceso a ninguna cuenta de Google Ads de Qualivo. Los volúmenes y CPC de abajo son de DinoRANK y son estimaciones de la herramienta. Un CPC de 0 significa que no hay dato de puja, no que sea gratis.

---

## 0 · Resumen en 6 líneas

1. **H-05 (E-01) se mantiene sin cambios** hasta el 31-oct. Lleva 20,60 € y 0 leads [C, Meta, 21-oct 09:30 UTC]; el arranque es lento por el reinicio del aprendizaje.
2. **H-07 se corrige y pasa a ser la primera de noviembre (P-02).** Va con un formulario que cierra «nada todavía»: ese grupo ha llegado a 0 reuniones de 11 [C].
3. **H-06 se descarta tal como está.** HOCO es de ventanas, no de formación. Su señal se aprovecha en la variante «ventanas y reformas con equipo» de P-02, ya encargada a Creative.
4. **Nueva hipótesis del comprador (P-03):** el mensaje «Ya inviertes en captar…» dentro del anuncio que nombra el sector, cambiando una sola variable.
5. **Edad (P-04):** no es un experimento propio. Es una lectura del desglose por edad hasta reunión, porque el dato que hay es coste por lead, no reuniones.
6. **Google Search (P-05): no en noviembre.**
   - El volumen comercial es muy bajo y la estimación central sale a unos 430 € por reunión, frente a 137 €.
   - La condición del plan Q4 (cierre ≥15 %) no se cumple: 1 piloto de 10 reuniones celebradas y 0 cobros [C].
   - Queda diseñado un piloto de 200 € por si la condición se cumple.

---

## 1 · Las hipótesis del banco v0 (H-05, H-06, H-07)

| ID v0 | Decisión | Motivo |
|---|---|---|
| **H-05** · formulario con filtro de volumen y valor | **Se mantiene, sin cambios.** Pasa a P-01 | En curso del 20 al 31-oct. Cambiarla ahora contamina la medida. Se añade la lectura del 31-oct (abajo) |
| **H-06** · demo del sistema con el sector nombrado, relevo del 3V2 | **Descartada como hipótesis propia** | (a) El 3V2 gastó 134,28 €, trajo 5 leads y 0 reuniones registradas en el CRM [C]. (b) La única señal buena, HOCO, es de **ventanas**, no de formación: no apoya un nuevo caso de formación. (c) Necesita 8-10 h de Creative sin datos propios. Lo aprovechable pasa a P-02, prueba 2 |
| **H-07** · reformas sigue funcionando | **Corregida y fusionada con X4-reformas.** Pasa a P-02 | El dato de v0 (11,39 € por lead) se corrige con la serie completa: **189,79 €, 15 leads, 12,65 € por lead, 2 reuniones celebradas a 94,90 € y el único piloto de Meta** [C]. Cambio clave: el formulario deja fuera «nada todavía», sin tocar el anuncio |

---

## 2 · Hipótesis de Paid para noviembre (5 como máximo)

Límites que respetan todas: un experimento de pago a la vez; 100-150 € por prueba; referencia de 137 € o menos por reunión con encaje. «Reunión con encaje» es el evento Qualified de Growth desde el 20-oct (reunión celebrada con encaje); no se compara con lo anterior al 20-oct.

### P-01 · Filtro de volumen y valor en el formulario (H-05, E-01, en curso)

- **Causa → resultado.** Creemos que **los leads sin volumen ni valor llenan la agenda de plantones y reuniones sin encaje**. Si se cierran en el formulario sin dejar datos, **esperamos menos leads pero más reuniones con encaje por euro**.
- **Evidencia.** Embudo de 3 meses: 58 leads → 31 reservas → 9 plantones → 10 reuniones celebradas, a 158,08 € cada una [C]. El grupo «nada todavía» llegó a 0 reuniones de 11 [C].
- **Etapa / objetivo.** Lead → reunión con encaje. Objetivo: coste por reunión con encaje ≤137 €.
- **Lo que la refutaría.** 0 leads aptos con 100 € gastados, o leads aptos que siguen sin llegar a reunión.
- **Experimento.**
  - **Variable:** el formulario. El anuncio, el conjunto y el público son los mismos.
  - **Métrica:** leads aptos por cada 100 € y coste por reunión con encaje.
  - **Duración:** del 20 al 31-oct.
  - **Presupuesto:** 20 €/día, máximo 240 €.
  - **Horas:** ya invertidas; 15 min diarios de seguimiento de Paid.
  - **Éxito:** ≥2 leads aptos y ≥1 reunión con encaje antes del 31-oct.
  - **Parada:** 100 € sin ningún lead apto.
  - **Riesgo de contaminación:** el reinicio del aprendizaje. Lleva 20,60 € y 0 leads [C, 21-oct 09:30 UTC], y no se puede separar del efecto del formulario. Control: el anuncio original, 30 días, 427,64 €, 20 leads, 21,38 € por lead [C, snapshot del 19-oct].
- **I/C/E 7 / 5 / 10 → 7,3.**
  - I: ataca la ruptura principal (después de la reserva).
  - C: la evidencia es fuerte en el grupo «nada todavía», pero no se sabe cuánto volumen se pierde.
  - E: ya está montado.
- **Coste y días para lanzar.** Lanzada (0 €, 0 días).

### P-02 · Reformas con filtro (H-07 corregida + X4-reformas)

- **Causa → resultado.** Creemos que **el anuncio 3V reformas trae negocios con equipo y volumen de presupuestos**, y que su único problema era el grupo «nada todavía». Si lo reactivamos tal cual, con un formulario que cierra ese grupo, **esperamos reuniones con encaje por debajo de 137 €**.
- **Evidencia.** 15 leads a 12,65 €, 2 reuniones celebradas a 94,90 € y el único piloto de Meta [C]. Frecuencia 2,36: no está quemado [C]. Los 4 leads «nada todavía» de reformas no llegaron a reunión [C].
- **Etapa / objetivo.** Captación → reunión con encaje en reformas.
- **Lo que la refutaría.** 70 € sin ningún lead A o B, o un coste por lead más del doble que en septiembre (más de 25 €) por subida del CPM.
- **Experimento.**
  - **Variable:** el formulario. Prueba 1: anuncio igual, formulario nuevo, conjunto propio.
  - **Métrica:** coste por reunión con encaje.
  - **Duración:** del 3 al 16-nov.
  - **Presupuesto:** 10 €/día, máximo 140 €.
  - **Horas:** Paid unas 2 h; Maikel, el OK de activación.
  - **Éxito:** ≥1 reunión con encaje a ≤137 € y ≥4 leads A o B.
  - **Parada:** 70 € sin ningún lead A o B.
  - **Riesgo de contaminación:** el conjunto de formación está activo a la vez. Público distinto, pero solapan los intereses de dueños de pyme. Se mide por formulario, no por conjunto.
- **Prueba 2**, solo si la 1 sale bien: variante «ventanas y reformas con equipo» (encargada a Creative con entrega el 14-nov). Cambia solo los 3 primeros segundos y el texto. Aquí entra lo aprovechable de H-06.
- **I/C/E 7 / 6 / 9 → 7,3.**
  - I: la mejor señal de la cuenta.
  - C: 15 leads es poca muestra.
  - E: no necesita Creative para la prueba 1.
- **Coste y días para lanzar.** 140 €; el formulario se monta en 1 día. Lista el 3-nov, con el OK de Maikel.

### P-03 · El mensaje del comprador real dentro del anuncio que nombra el sector (nueva, perfil del comprador)

- **Causa → resultado.** Creemos que **quien compra es el dueño o gerente de una empresa con demanda, equipo que atiende y CRM infrautilizado, y que no tiene visibilidad del seguimiento** (H-ICP del Chief of Staff). Si el anuncio de formación le habla de **las solicitudes que se quedan sin seguimiento** («Ya inviertes en captar. ¿Sabes cuántas solicitudes se quedan sin seguimiento?») en lugar de «más alumnos», **esperamos menos leads pero más reuniones con encaje y más tickets altos**.
- **Evidencia.**
  - Los 2 clientes que siguen pagando (EAC y Eleva) son formación con equipo de admisión y CRM [C, CFO vía Chief of Staff].
  - Alpha, CANCOMAR y Ana Claros describen el dolor del seguimiento, no el de captación [C, Tactiq].
  - El único anuncio de la cuenta que trae reuniones nombra el sector [C].
  - **Contra:** el anuncio genérico «Ya inviertes» (HZ) gastó unos 49 €, tuvo 16 aperturas del formulario y ningún envío [C]. No refuta el mensaje, porque cambió tres cosas a la vez: creatividad sin sector, formulario de 5 preguntas y conjunto nuevo.
- **Etapa / objetivo.** Atracción del decisor correcto. Objetivo: % de leads que declaran equipo y volumen, y coste por reunión con encaje.
- **Lo que la refutaría.**
  - Coste por lead más del doble que el control sin mejora en el % de leads aptos.
  - O 0 reuniones con encaje con 100 €.
- **Experimento.**
  - **Variable:** el mensaje (3 primeros segundos y texto principal). Se mantienen el vídeo base de formación viejo, el formulario de E-01 y el público.
  - **Métrica:** % de leads aptos y coste por reunión con encaje.
  - **Duración:** 14 días.
  - **Presupuesto:** máximo 150 €.
  - **Horas:** Creative unas 3-4 h (solo arranque y texto) [E]; Paid unas 2 h.
  - **Éxito:** % de aptos ≥1,5 veces el de E-01 y ≥1 reunión con encaje a ≤137 €.
  - **Parada:** 75 € sin ningún lead apto.
  - **Riesgo de contaminación:** si corre a la vez que el anuncio actual de formación, los dos compiten en la misma subasta y público. Debe ir en el mismo conjunto como segundo anuncio, comparando por anuncio, o después de P-02.
- **I/C/E 8 / 4 / 6 → 6,0.**
  - I: si funciona, cambia los mensajes de todos los canales.
  - C: hay señal cualitativa, pero el único dato de pago es negativo y está contaminado.
  - E: necesita Creative.
- **Coste y días para lanzar.** 150 € más unas 4 h de Creative; unos 5 días hábiles desde el encargo. Propuesta de fechas: del 17 al 30-nov, en el hueco que el análisis daba a ICP-1.

### P-04 · Edad del decisor: lectura de datos, no experimento

- **Causa → resultado.** Creemos que **el decisor que compra tiene 45 o más años** (hipótesis de Maikel). Si es así, **las reuniones con encaje de Meta deberían venir sobre todo de 45-64 años**.
- **Evidencia.** Solo hay coste por lead, no reuniones [C, Meta, 3 meses]:
  - 45-54: 21,05 €
  - 55-64: 25,34 €
  - 35-44: 29,75 €
  - 25-34: 35,55 €
  - **Ninguna fuente registra la edad de quien llegó a reunión.** No se da por confirmada.
- **Lo que la refutaría.** Que las reuniones con encaje de octubre y noviembre salgan repartidas por edad igual que el gasto.
- **Experimento.** No hay prueba de pago, para no ocupar un hueco ni partir el aprendizaje.
  - **Variable:** ninguna. Se cruza la edad declarada en el desglose de Meta por anuncio con las reuniones con encaje de P-01, P-02 y P-03, más el dato de ICP-0 (Maikel completa la franja de edad de los clientes).
  - **Duración:** hasta el 30-nov.
  - **Presupuesto:** 0 €.
  - **Horas:** Paid 1 h; Growth y CFO, lo que ya tienen en ICP-0.
  - **Riesgo de contaminación:** ninguno.
- **Si la lectura lo apoya,** en diciembre: duplicar el conjunto ganador cambiando solo la edad a 45-65 (150 €).
- **I/C/E 5 / 5 / 10 → 6,7.**
  - I: solo abarata el lead.
  - C: hay dato de coste por lead, no de reunión.
  - E: coste cero.
- **Coste y días para lanzar.** 0 €, 0 días.

### P-05 · Google Search con intención (estudio en la sección 4)

- **Causa → resultado.** Creemos que **quien busca «agencia de marketing para clínicas» o «gestión de leads» ya tiene el problema y busca proveedor**. Si le mostramos una landing con las 3 preguntas de encaje, **esperamos una tasa de reunión por lead mayor que la de Meta (17 %)**.
- **Evidencia.** Solo la de la herramienta: volúmenes y CPC de DinoRANK. Sin ningún dato propio de Search.
- **Lo que la refutaría.** 100 € sin ningún lead, o leads que no pasan el filtro.
- **Experimento.** El piloto de la sección 4.4.
- **I/C/E 4 / 2 / 3 → 3,0.**
  - I: el volumen máximo es muy pequeño.
  - C: el cálculo central sale 3 veces por encima de 137 €.
  - E: no existe la cuenta de Google Ads ni la landing por sector, y falta la etiqueta de conversión por gclid.
- **Coste y días para lanzar.** 200 €; unos 7-10 días de Growth y Paid [E]. **No en noviembre.**

### Orden propuesto

| Prioridad | Hipótesis | ICE | Fechas | Gasto máximo |
|---|---|---|---|---|
| 1 | P-01 · E-01 (en curso) | 7,3 | hasta el 31-oct | 240 € |
| 2 | P-02 · reformas con filtro | 7,3 | 3 al 16-nov | 140 € |
| 3 | P-03 · mensaje del comprador | 6,0 | 17 al 30-nov | 150 € |
| — | P-04 · lectura de edad | 6,7 | continua | 0 € |
| — | P-05 · Google Search | 3,0 | diciembre o más tarde, con condición | 200 € |

**Pruebas de noviembre:** 290 € como máximo (140 + 150), más el anuncio base de formación si se mantiene [E].

---

## 3 · Perfil real del comprador: lo que dice Paid

1. **Lo que Meta confirma** [C]:
   - El formato que trae reuniones es el que **nombra el sector**. Formación viejo hace la reunión a 95,63 €; reformas 3V, a 94,90 €.
   - Las 9 piezas genéricas de octubre gastaron 365,49 € sin ninguna reunión.
   - El comprador **se reconoce por su negocio**, no por la tecnología.
2. **Lo que Meta no puede confirmar todavía.** Si quien llega a reunión es el dueño o gerente, o un mando intermedio. El formulario no lo pregunta.
   - **Pregunta para Growth (P-1):** ¿añadimos «¿Quién decide sobre el seguimiento comercial?» a los formularios nuevos (P-02 y P-03)? Solo para priorizar, sin excluir. Paid propone que sí. Ya se pidió una pregunta parecida para reformas («¿Quién hace el seguimiento de los presupuestos?»).
3. **Anti-perfil en los datos de Meta** [C]: quien declara «nada todavía» de inversión. 0 reuniones de 11. Coincide con el anti-ICP del Chief of Staff (dueño solo, ticket bajo).
4. **Cómo atraerlo por anuncios:** P-03. El mensaje del seguimiento, dentro del anuncio que nombra el sector, con una sola variable. No se prueba en un anuncio genérico, que es lo que falló en HZ.

---

## 4 · Estudio de Google Search

### 4.1 Grupos de palabras clave

Fuente: DinoRANK, España, 14 y 21-oct-2026 [C de la herramienta, E en lo real]. «Vol.» es búsquedas al mes. «Comp.» es competencia de 0 a 1.

| Grupo | Palabras clave representativas (vol. · CPC · comp.) | Volumen del grupo | Intención | Landing necesaria |
|---|---|---|---|---|
| **G1 · Agencia por sector, clínicas** | agencia de marketing para clínicas (70 · 4,57 € · 0,24) · agencia de marketing para clínicas, con tilde (40 · 0,04 € · 0,53) · agencia de marketing para dentistas (50 · 13,92 € · 0,24) · agencia de marketing dental (50 · 30,22 € · 0,22) · agencia marketing médico (40 · 3,68 € · 0,56) | ~250 | **Comercial alta:** busca proveedor | Landing de clínicas con 3 preguntas de encaje. **No existe** |
| **G2 · Marketing para clínicas, mixta** | marketing para clínicas dentales (210 · 4,37 € · 0,32) · marketing digital para clínicas dentales (260 · 2,93 €; 140 · 14,03 €) · marketing clínica dental (70 · 7,89 €) · marketing para clínicas estéticas (50 · 7,26 €) | ~800 | Mixta: mucha formación e ideas; parte comercial | La misma de clínicas |
| **G3 · Formación** | agencia de marketing educativo (70 · sin dato de CPC) · marketing para centros educativos (40 · sin dato) · captación de alumnos (20 · sin dato) | ~150 | Comercial, pero con muy poco volumen | Landing de formación con los casos de EAC y Eleva. **Growth tiene que confirmar cuál** |
| **G4 · Reformas y ventanas** | publicidad para empresas de reformas (20 · sin dato) · el resto por debajo de 20 | <50 | Comercial; volumen casi nulo | **No viable** |
| **G5 · Problema: leads y seguimiento** | gestión de leads (170 · 7,47 € · 0,24; 140 · 32,99 € · 0,45) · captación de clientes (390 · 3,75 € · 0,12) · automatización de marketing (260 · 2,77-4,70 €) · crm para seguimiento de clientes (20 · sin dato) | ~1.000 | **Mayoritariamente informativa o de software:** busca herramienta o definición, no servicio | Landing «dónde se pierden tus oportunidades». No existe |
| **G6 · CRM y herramienta** | crm para pymes (210 · 9,23-26,77 € · 0,30-0,40) · crm para pequeñas empresas (140 · 9,77 €) · gohighlevel español (140 · 4,75 € · 0,65) · partner hubspot (170 · sin dato) | ~700 | Compra de software (muchos «gratis») o agencias que revenden GHL, que son competencia | No recomendada |

**Lectura** [E]:
- Solo G1 tiene intención clara de contratar un servicio como el nuestro, y suma unas 250 búsquedas al mes en toda España.
- G2 y G5 tienen más volumen, pero la mayoría busca información o software.

### 4.2 Comparación con 137 € por reunión

Fórmula: coste por reunión = CPC ÷ (conversión de la landing × % de leads que llegan a reunión celebrada).

| Escenario | CPC | Conversión de la landing | Lead → reunión celebrada | Coste por reunión |
|---|---|---|---|---|
| Optimista | 5 € | 10 % | 35 % | **143 €** |
| Central | 7,50 € | 7 % | 25 % | **429 €** |
| Pesimista | 10 € | 5 % | 17 % (el de Meta [C]) | **1.176 €** |

- **El CPC sale de G1 y G5:** 4-14 € sin las palabras extremas [E, DinoRANK].
- **Las conversiones de la landing son estimaciones** [E]: no hay ningún dato propio de Search.
- **El 17 % es el dato real de Meta** [C]: 10 reuniones celebradas de 58 leads.
- **Meta, como comparación:** 158,08 € por reunión celebrada en toda la cuenta; unos 95 € en los dos anuncios que nombran el sector [C].

**Conclusión** [E]: Search solo iguala 137 € en el escenario optimista. En el central cuesta unas 3 veces más.

### 4.3 La condición del plan Q4

El plan Q4 condiciona Search a una **tasa de cierre del 15 % o más**.

Hoy, con Meta [C, CRM, 21-oct]:
- 10 reuniones celebradas
- 7 propuestas
- 1 piloto, que es el 10 %
- 0 cobros

**La condición no se cumple.** Con el coste del escenario central (unos 430 € por reunión) y un cierre del 10 %, cada cliente costaría unos 4.300 € de anuncios [E].

### 4.4 Piloto propuesto, para cuando se cumpla la condición

- **Cuándo:** no antes de diciembre. Solo si el cierre es del 15 % o más, con al menos 10 reuniones medidas con el evento Qualified, y con la landing de clínicas hecha.
- **Grupo:** solo G1 (agencia por sector, clínicas), en concordancia exacta y de frase. Negativas: «gratis», «curso», «máster», «empleo», «prácticas», «qué es».
- **Landing:** la de clínicas, con **el mismo filtro de volumen y valor que E-01**. Quien no llegue al mínimo va a la guía sin dejar datos.
- **Medición:** etiqueta de conversión con gclid hacia GHL y evento Qualified.
- **Presupuesto:** 200 € como máximo (10 €/día durante 20 días).
- **Éxito:** ≥1 reunión con encaje a ≤200 €. El objetivo de 137 € no es alcanzable con esta muestra.
- **Parada:** 100 € sin ningún lead apto.
- **Horas** [E]: Growth 4-6 h (landing y etiqueta); Paid 3 h (cuenta, campaña y negativas); Maikel 30 min de revisión.
- **Fecha de muerte:** 20 días desde el lanzamiento, o al llegar a 200 €.
- **Riesgo:** con unos 25 clics (200 € ÷ 7,50 €), la muestra es demasiado pequeña para concluir nada que no sea un fracaso claro.

---

## 5 · Preguntas escritas para Growth (no para Maikel)

1. **P-1.** ¿Añadimos la pregunta «¿Quién decide sobre el seguimiento comercial?» a los formularios de P-02 y P-03, para priorizar sin excluir?
2. **P-2.** ¿Qué landing de formación existe y mide hoy? Hace falta para G3, por si algún día hay Search de formación.
3. **P-3.** ¿Tenéis el dato de cierre de clientes de otros canales (outbound, referidos)? El 15 % del plan Q4, ¿es de toda la empresa o solo de pago?
4. **P-4.** ¿Os vale que P-03 ocupe el hueco del 17 al 30-nov que el análisis daba a ICP-1 por edad? A cambio, la edad pasa a ser una lectura de datos (P-04).
5. **P-5.** ¿Hay alguna cuenta de Google Ads de Qualivo, aunque esté vacía? Si existe, Paid necesita acceso de lectura al Planificador de palabras clave para cambiar las cifras de DinoRANK por las de Google.

---

## 6 · Anexo (22-oct) · Google Ads hacia la landing de formación v22

Lo pidió Maikel el 22-oct. La fuente de las palabras clave es DinoRANK, España, del 14 y el 21-oct.

**Búsqueda de formación: casi no hay volumen** [E, DinoRANK]:

| Palabra clave | Volumen al mes | CPC |
|---|---|---|
| agencia de marketing educativo | 70 | sin dato |
| marketing para centros educativos | 40 | sin dato |
| marketing digital para academias | 20 | sin dato |
| captación de alumnos | 20 | sin dato |

- Ninguna otra palabra relacionada con academias y captación llega a 20 búsquedas al mes.
- En total, **menos de 200 búsquedas al mes**. Unos **5-15 clics** si se cubre todo.

**Tres maneras de llevar tráfico de Google, de más a menos recomendable:**

1. **Demand Gen (vídeo en YouTube, Discover y Gmail) con segmentos personalizados de intención.** Personas que han buscado «crm para academias», «software gestión academia», «captar alumnos» o «campañas de matrícula», o que visitan webs de software de gestión de academias.
   - **Creatividad:** el vídeo de 70 s de la landing y el anuncio nuevo de Contenido.
   - **Por qué:** es el único formato de Google con alcance suficiente para formación. Se parece a cómo trabajamos en Meta: nombrar el sector y llevar a la landing.
   - **Riesgo:** como no hay búsqueda, el filtro depende del vídeo y de las preguntas de la landing.
2. **Búsqueda en concordancia exacta y de frase**, solo con las palabras de la tabla, más «agencia captación alumnos» y «marketing para academias».
   - **Palabras negativas:** curso, máster, gratis, empleo, oposiciones, «academia de marketing».
   - **Coste:** unos 5-10 € al día. Gastará poco por falta de búsquedas.
   - **Conclusión:** sirve para no dejar escapar a quien busca, no para probar nada.
3. **Remarketing:** visitantes de la v22 y personas que vieron el vídeo en YouTube.
   - Hoy la audiencia es demasiado pequeña. Hacen falta unos 1.000 usuarios para servir anuncios en la Red de Display.
   - Se activa después de 1 o 2.

**Requisitos antes de gastar un euro** (Growth y Paid, unas 6-8 h) [E]:

1. **Cuenta de Google Ads de Qualivo** con acceso para Paid. Hoy Paid no tiene ninguna.
2. **Formulario de la v22:** campos ocultos de gclid y UTM, que se guarden en la ficha de GHL.
3. **Conversiones:**
   - «Reserva» en Google Ads.
   - Importar «Qualified» (reunión con encaje) desde GHL.
   - Sin eso, Google optimiza a cualquier reserva.
4. **UTM:** `utm_source=google&utm_medium=cpc|demandgen&utm_campaign=formacion-v22&utm_content=<anuncio>`.
5. **Titular de la landing:** uno alineado con el anuncio solo para este tráfico (ver el brief de Contenido).

**Piloto propuesto:**
- **Formato:** Demand Gen, más la búsqueda exacta como complemento.
- **Presupuesto:** 200 € como máximo, en 3 semanas.
- **Éxito:** al menos 1 reunión con encaje a 200 € o menos.
- **Parada:** 100 € sin ninguna reserva que pase el filtro de la landing.
- **Fecha de muerte:** 3 semanas desde el lanzamiento.

**Condición del plan Q4:** cierre del 15 % o más. **Hoy no se cumple:** hay 1 piloto de 10 reuniones celebradas y 0 cobros [C]. Por eso Paid lo propone para diciembre, salvo que Maikel decida adelantarlo, sabiendo que la muestra será pequeña.

**Contaminación:** Demand Gen y Meta llegan a gente parecida. Se mide por UTM y gclid en GHL, nunca por lo que reporta cada plataforma.
