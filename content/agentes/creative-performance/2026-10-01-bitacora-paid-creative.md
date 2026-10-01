# Paid y Creative · bitácora, primeras conclusiones e hipótesis (1-oct-2026)

Escrito por el agente Creative Performance el 1-oct-2026.

**Fuentes:**
- Partes del agente de Paid en su rama `claude/qualivo-paid`: `paid/revisiones/`, `paid/estado.md`, `bus/out/paid.jsonl`, del 10-sep al 1-oct.
- Bus de Growth (`bus/out/demand.jsonl`).
- El trabajo de Creative de esta semana.

Paid lee la API de Meta y, desde el 1-oct, también la de GoHighLevel. **Las cifras de este documento son las de Paid, con su fuente; no he leído Meta ni el CRM directamente.**

## 0. Resumen en cinco líneas

1. **El paid funciona mejor de lo que creíamos.** Con el CRM conectado, el coste por reunión celebrada es **75 €** (8 reuniones) o **124 €** si solo se cuentan las 5 que avanzaron. Paid llevaba nueve días diciendo 302 €.
2. **La fuga grande no es el plantón.** El 56 % de los leads de pago **nunca llega a una cita**; en el plantón se pierde el 12 %. Y 3 de los 4 plantones **tenían la cita confirmada**.
3. **Formación es el mejor sector por reunión** (51,90 €). **Clínicas es el que mejor convierte** (100 % de asistencia, 2 de 2) pero el más caro arriba (35 € por envío). **Reformas** es el más barato por envío y tiene la única negociación abierta.
4. **Los creativos viejos están gastados.** El CTR de la cuenta ha caído de ~2,5 % a ~1 % en nueve días con la frecuencia plana: es desgaste de creatividad, no de público. Por eso entran hoy los seis vídeos nuevos.
5. **Hay riesgo de coordinación.** Growth, Paid y Twin Integration han tocado la cuenta en la misma semana con planes distintos. Hace falta un único responsable de ejecutar en Meta.

## 1. Estado de la cuenta a 1-oct (según Paid, 10:03 CEST)

| Campaña | Conjunto | Presupuesto | Anuncios | Estado |
|---|---|---|---|---|
| QV_VERTICALES_Sep26 | formación | 30 €/día | vídeo viejo + S1_PLA + S1_CUR + S1_VEL (cada uno con su formulario) | activo |
| QV_VERTICALES_Sep26 | clínicas | 30 €/día | vídeo viejo + CLI_HUE + CLI_VEL + CLI_PRI (cada uno con su formulario) | activo |
| QV_3VERTICALES_Sep26 | reformas | — | vídeo viejo | pausada (decisión de Maikel) |
| QV_TEST_DOLOR_FORMACION / _CLINICAS | 6 conjuntos de 10 € | — | los mismos seis vídeos | pausadas, sin usar |

- **Total activo: 60 €/día.** Techo de `QV_VERTICALES`: quedan ~410 € hasta los 800 €, unos 7 días; Paid avisará hacia el 7-oct.
- **Un formulario por creativo.** Son duplicados exactos de los originales: el id del formulario identifica el anuncio en el CRM (`form-<id>`). Por primera vez se podrá medir **coste por reunión por anuncio**.
- **Versiones 4:5 para feed:** entregadas por Creative hoy (`produccion/video-anuncios/finales/4x5/`). Paid tiene que crear anuncios nuevos con ellas.

## 2. Cronología

| Fecha | Qué pasó | Quién |
|---|---|---|
| 10-sep | Primera lectura de la cuenta: 1 campaña activa (HERO), 17 € y 0 leads | Paid |
| 11-sep | La campaña HERO se cierra en 20,96 € y 0 leads. «El cuello no es el anuncio» | Paid |
| 14-sep | EXP-001: landing contra formulario nativo. El 70 % se iba a Reels; se restringen ubicaciones | Paid |
| 15-sep | Apagado de la cuenta: 37,07 € y 0 envíos. Se monta y activa QV_CRM_VIDEO a 20 €/día | Paid, con el ok de Maikel |
| 16-sep | Primer lead de pago, que no cualifica. Formulario v3 con filtro. Cuenta en periodo de gracia por impago | Paid |
| 17-sep | Libro de experimentos en Notion. Giro a público abierto con la creatividad como filtro. Versiones 4:5 para feed de los 4 vídeos viejos | Paid |
| 19-22-sep | Auditoría del embudo y recorrido 360 de la semana 38 (con el brief que contaba 17 % de asistencia) | Paid |
| 23-26-sep | Anomalías: presupuestos que vuelven solos, techo de 400 € cruzado, reformas que se pausa sola. 26-sep: freno de todo el paid | Paid |
| 27-28-sep | Relanzamiento de formación con formulario de precio. «El problema del anuncio nuevo es el vídeo, no el formulario». Vuelve el anuncio viejo | Paid |
| 29-sep | Mejor día (23 aperturas, 3 envíos, uno con más de 5.000 €/mes de inversión). Paid frena clínicas por 11,59 € por apertura | Paid |
| 30-sep | Maikel retira a Paid el permiso para pausar solo. Reformas pausada y clínicas reactivada (Twin Integration). Growth monta QV_TEST_DOLOR en pausa | Maikel / Growth |
| 30-sep | Creative: revisión de borradores, tres conceptos por sector y seis vídeos producidos (voz y música rehechas dos veces) | Creative |
| 1-oct, 08:00 | Paid detecta dos días sin leads y el CTR partido por dos: desgaste de creatividad | Paid |
| 1-oct, 10:15 | CRM conectado: 34 envíos = 34 oportunidades. Coste por reunión real: 75-124 €. Asistencia del 56-67 % | Paid |
| 1-oct, 10:03 | Montaje 30+30 €/día con los seis vídeos nuevos dentro de los conjuntos de cada sector | Paid, con la orden de Maikel |
| 1-oct | Creative entrega las seis versiones 4:5 | Creative |

## 3. Lo que ha hecho el agente de Paid (método, aciertos y correcciones)

**Cómo trabaja:**
- Lee la cuenta mañana y noche y deja un parte en el bus.
- Toda cifra va con fuente y fecha.
- Construye en pausa y ejecuta solo con la orden de Maikel.
- Desde el 30-sep ya no pausa por su cuenta.

**Aciertos:**
- Detectó el desgaste de creatividad (CTR que cae con la frecuencia plana) antes que nadie.
- Comprobó que el webhook no pierde leads (34 de 34).
- Encontró que 3 de los 4 plantones tenían la cita confirmada.
- Consiguió la atribución por sector y por anuncio mediante las etiquetas y los formularios propios.
- Defiende separar por **sector** y no por **ángulo**: seis conjuntos de 10 € no salen nunca de la fase de aprendizaje (H-APRENDIZAJE-01).

**Correcciones que él mismo ha publicado:**
- Coste por reunión: dijo 302 € (y luego 400 €) durante nueve días; son 75-124 €. Dividía todo el gasto entre la única reunión que reconocía el brief.
- Asistencia: dijo 17 %; es 56-67 %. El brief de la semana 38 contó mal las reuniones celebradas.
- Retira la recomendación de matar reformas: estaba equivocada.
- Reformula H-CREATIVO-01: la señal de desgaste es el CTR que cae con la frecuencia estable; el CPM no entra, porque oscila sin tendencia.
- Su freno a clínicas del 29-sep acertaba en el síntoma (coste por apertura) y fallaba en la conclusión: clínicas es el sector que mejor convierte.

**Lo que dejó escrito como aviso:**
- El token de GoHighLevel quedó en el historial de su conversación: hay que rotarlo.
- Pide un tope de gasto a nivel de cuenta y reglas automáticas de Meta como red de seguridad, ya que él no puede pausar.

## 4. Lo que ha hecho Creative Performance (29-sep → 1-oct)

- Revisó los borradores de septiembre. Los tres tenían promesas que hoy no cumplimos («de noche», «hora nueva esa misma mañana», «quién se matricula»); se corrigieron.
- Diseñó el test de dolor: tres conceptos por sector con el mismo molde (estructura, CTA y formulario); solo cambia el dolor.
  - **Formación:** Velocidad, Plantones y Curiosos.
  - **Clínicas:** Velocidad, Huecos y Prioridad.
- Produjo los seis vídeos:
  - Planos de septiembre más 5 planos nuevos de clínica en Kling.
  - Voz: primero Javier (Higgsfield), descartado por robótico; ahora **David, de ElevenLabs**.
  - Música: probadas la F y otras; la definitiva es **H «urbano»**, generada con ElevenLabs Music.
  - Montador sin el zoom que hacía temblar las letras.
- Entregó las versiones 4:5 para feed.
- Todo está en `content/agentes/creative-performance/` y `produccion/video-anuncios/`.

## 5. Datos clave (Paid, 17-sep → 1-oct, Meta + CRM)

**Embudo de paid:**
- 603-622 € de gasto → 270 aperturas → **34 envíos** → 34 oportunidades → 15 citas → **8 reuniones celebradas** (5 avanzan de etapa) → 1 negociación → **0 clientes**.

**Por sector:**

| | Gasto | Envíos | €/envío | Celebradas | Plantones | Asistencia | €/reunión | Nivel A |
|---|---|---|---|---|---|---|---|---|
| Formación | 207,59 € | 14 | 14,83 € | 4 | 3 | 57 % | **51,90 €** | 6 |
| Clínicas | 175,84 € | 5 | 35,17 € | 2 | 0 | **100 %** | 87,92 € | 3 |
| Reformas | 189,79 € | 15 | **12,65 €** | 2 | 1 | 67 % | 94,90 € | 3 |
| Asesorías | 29,87 € | 0 | — | 0 | 0 | — | — | 0 |

**Dónde se pierde la gente (34 leads):**

| Etapa | Leads | % del total |
|---|---|---|
| Nunca llegan a cita | 19 | 56 % |
| ↳ la cadencia ni arrancó | 5 | 15 % |
| ↳ conversación que no cuaja en cita | 7 | 21 % |
| ↳ no responde o «más adelante» | 7 | 21 % |
| Plantón | 4 | 12 % |
| Llegan a reunión | 5-8 | 15-24 % |
| Cita pendiente | 6 | 18 % |

**Ojo, las cifras no cuadran con nuestro contexto.** `contexto.md` (del brief de septiembre) decía 40 leads, 7 celebradas, 6 plantones y 54 % de asistencia. Paid, con el CRM, cuenta 34, 8, 4 y 67 %. **A partir de hoy mandan las de Paid**, porque salen de la fuente.

## 6. Primeras conclusiones

1. **El cuello está entre el lead y la cita, no en el anuncio.** Primero hay que hacer que todo lead arranque la cadencia y que las conversaciones abiertas pidan la cita. Un anuncio mejor trae más gente a un embudo que pierde la mitad antes de la cita.
2. **La confirmación de la víspera no es la palanca.** Ya existe y 3 de los 4 plantones habían confirmado. La siguiente palanca a probar es **acortar la distancia hasta la cita** (mismo día o el siguiente).
3. **La creatividad sí es el problema de arriba.** Los vídeos viejos están gastados en toda la cuenta. Que el test de los seis nuevos empiece hoy es la decisión correcta y no hay que esperar más.
4. **Clínicas capta caro pero convierte muy bien.** Es el sector donde un buen creativo puede rendir más. Si los anuncios de clínicas bajan el coste por envío hacia 20 €, es probablemente el mejor sector.
5. **Reformas está apagada contra los datos.** Envío más barato, ninguna pérdida en el arranque y la única negociación abierta. Conviene reabrir la decisión cuando haya lectura de los nuevos.
6. **El test de dolor ya no es un A/B limpio.** Va dentro del mismo conjunto que el vídeo viejo y Meta reparte el gasto. Se lee por anuncio (formulario propio) y **ponderando por gasto**: un anuncio con poco gasto no ha perdido, simplemente no se ha probado.

## 7. Hipótesis abiertas (para revisar)

| Código | Hipótesis | Cómo se mide | Cuándo se revisa | Criterio |
|---|---|---|---|---|
| H-CREATIVO-01 (Paid) | El CTR de la cuenta cae por desgaste de creatividad, no de público | CTR diario con la frecuencia estable; los nuevos deberían devolver el CTR por encima del 2 % | 13-oct | Si con los nuevos el CTR vuelve a ~2,5 %, confirmada |
| H-DOLOR-FOR (Creative) | En formación, un dolor concreto trae más A/B por euro que los otros | Coste por lead A/B por anuncio (formulario propio), ponderado por gasto | A los 150 € por anuncio o el 11-oct | El más barato por A/B con al menos 4 A/B; el doble del mejor, se para |
| H-DOLOR-CLI (Creative) | En clínicas, los vídeos nuevos bajan el coste por envío (hoy 35 €) sin perder calidad | €/envío y % A/B por anuncio frente al vídeo viejo | 11-oct | Si alguno baja de 25 €/envío con A/B, se queda |
| H-ARRANQUE (Paid) | Si todos los leads arrancan la cadencia, el % que llega a cita sube | % de leads con `act-wa1`; lead → cita | Semanal | 0 leads sin arrancar |
| H-DISTANCIA (Paid) | Las citas a 0-1 días tienen menos plantón que las de 3-4 días | Asistencia por días entre la reserva y la cita | Cuando haya 15 citas resueltas | Diferencia de 15 puntos o más |
| H-APRENDIZAJE-01 (Paid) | Los conjuntos de 10 €/día no salen de la fase de aprendizaje | Estado de aprendizaje y coste por envío por conjunto | Ya aplicada: un conjunto por sector | — |
| H-PRECIO-01 (Paid) | Poner precio en el formulario filtra curiosos | Congelada con 8 aperturas | Tras el test de creatividad | No se mezclan dos tests sobre 34 leads |
| H-REFORMAS | Reformas debería estar encendida | €/reunión y negociaciones | Tras la lectura de los nuevos | Decisión de Maikel |

## 8. Riesgos y cosas a resolver

- **Demasiadas manos en Meta.** El 30-sep, Twin Integration (Growth o Maikel) pausó reformas y reactivó clínicas; Growth montó QV_TEST_DOLOR; hoy Paid monta otra estructura con los mismos vídeos. **Propuesta: Paid es el único que ejecuta en Meta; los demás le hacen encargos.**
- **Dos campañas QV_TEST_DOLOR en pausa** con los mismos vídeos. No se borran todavía, pero **no hay que encenderlas** o se duplicaría el gasto (Paid avisa de que todo junto serían 95 €/día).
- **Rotar credenciales:** el token de GoHighLevel (lo dice Paid) y la clave de ElevenLabs (pegada en el chat de Creative).
- **No hay tope de gasto en la cuenta ni reglas automáticas,** y Paid ya no puede frenar. Una mala noche cuesta poco a 60 €/día, pero conviene poner la red.
- **Techo de campaña hacia el 7-oct.**
- **El formulario de formación sigue diciendo «desde 750 €/mes».**

## 9. Decisiones que necesita Maikel

1. **¿Quién ejecuta en Meta a partir de ahora?** Recomendado: solo Paid.
2. **¿Se borran o se dejan dormidas las campañas QV_TEST_DOLOR?** Recomendado: dormidas hasta el 11-oct y luego borrarlas.
3. **¿Reformas vuelve?** Paid dice que sí con los datos de hoy. Recomendado: decidirlo el 11-oct con la lectura de los nuevos.
4. **¿Tope de gasto de cuenta y reglas automáticas en Meta?** Recomendado: sí.
5. **Encargo a Growth/Maikel:** que ningún lead se quede sin arrancar la cadencia y que las conversaciones abiertas pidan la cita. Es la fuga más grande y no es de anuncios.
