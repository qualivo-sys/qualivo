# ICP Operating System de Qualivo · 30-sep-2026

Fuente de verdad para los tres agentes de outbound: email, cold calling y LinkedIn.
Definición estratégica de Maikel; cifras medidas por el agente de Outbound el 30-sep.

---

## 0. Lo primero, porque cambia la pregunta

Medido hoy contra Apollo, con el filtro de los seis motores (España, 11-200 empleados,
cargos decisores):

| Motor | Decisores localizables |
|---|---|
| Reformas / construcción | **34.965** |
| Servicios B2B high-ticket | **8.290** |
| Formación premium | **5.758** |
| SaaS B2B | 1.797 |
| Inmobiliario | 964 |
| Clínicas high-ticket | 553 |
| **Total** | **52.327** |

**Créditos de Apollo disponibles: 2.457, hasta el 14 de octubre.**

Es decir: podemos revelar el **4,7%** de lo que existe. El cuello de botella del outbound
no es encontrar leads. Nunca lo fue. Es el presupuesto de enriquecimiento, y por tanto lo
único que importa de verdad es **a cuál 4,7% le gastamos los créditos**.

### La inversión que conviene ver

Cruzando el tamaño de la bolsa con la calidad medida en el CRM en septiembre:

| Motor | Bolsa | Calidad medida | Coste por cita |
|---|---|---|---|
| Formación premium | 5.758 | 5 nivel A de 12 (42%) | **17 €** |
| Clínicas high-ticket | **553** | 3 nivel A de 6 (**50%**) | — |
| Reformas | **34.965** | 3 A + 2 B de 15 (33%) | **51 €** |
| Servicios B2B | 8.290 | sin datos, nunca activado | — |
| SaaS B2B | 1.797 | sin datos | — |
| Inmobiliario | 964 | sin datos | — |

- **Clínicas es el mejor vertical medido y el que menos leads tiene.** 50% de nivel A pero
  solo 553 decisores localizables en toda España. Apollo no puede alimentarlo. El techo de
  clínicas no es la estrategia, es el censo.
- **Reformas es la bolsa más grande y la peor economía.** 35.000 disponibles y 51 € por cita
  frente a 17 € en formación. Tiene calidad (33% A+B, corregido sobre el dato erróneo del
  29-sep), pero es tres veces más caro.
- **Formación premium es el único motor que está arriba en las dos columnas.** Bolsa amplia
  y la mejor economía medida.
- **Servicios B2B es la apuesta ciega del mes.** 8.290 disponibles, ticket más alto de todos
  (>10.000 €), es el ICP literal de la V1, y **nunca se ha activado una sola campaña**. No hay
  ni un dato propio. Por eso merece presupuesto: no por convicción, por ignorancia.

---

## 1. Reparto de los créditos

2.457 disponibles. Se reservan ~150 de margen para errores y reintentos.

| Motor | Créditos | Por qué ese número |
|---|---:|---|
| Formación premium | 850 | mejor economía medida y bolsa suficiente para elegir |
| Servicios B2B high-ticket | 550 | la apuesta: ticket máximo, cero datos propios |
| Clínicas high-ticket | 380 | mejor calidad medida, pero solo existen 553 |
| Reformas / construcción | 280 | funciona, pero cuesta el triple por cita |
| SaaS B2B | 140 | sin probar, bolsa pequeña |
| Inmobiliario | 100 | sin probar, la bolsa más pequeña después de clínicas |
| **Total** | **2.300** | |

---

## 2. El rendimiento real de Apollo, y la corrección de esta mañana

Prueba del 30-sep sobre 10 escuelas de negocio españolas de 11-200 empleados:

**10 de 10 con email. 10 de 10 `verified`. 9 de 10 nominales** (uno era `direccion@`, buzón
de rol, descartado). Coste: 10 créditos.

Esto **corrige** lo que informé esta mañana. Dije que Apollo no cubría la empresa española
después de que 8 de 10 volvieran `email_status: unavailable`. El diagnóstico estaba mal
atribuido: el problema no era Apollo, era **de dónde le dábamos las empresas**. Aquellas 10
salían de fichas de Google Maps y tenían de 1 a 6 empleados. Por debajo de 10 empleados
Apollo no tiene datos; de 11 en adelante los tiene casi siempre.

Consecuencia práctica: **el suelo de 11 empleados no es un criterio de ICP, es un requisito
técnico de la herramienta.** Por debajo de ahí hay que sacar el contacto de la web a mano, y
lo único completo que se consigue es el teléfono (604 de 612 fichas de Maps).

### Y la corrección del stock

Al montar la cosecha aparecieron 1.548 registros de enriquecimientos de todo septiembre
guardados en los ficheros de resultado. Después de filtrar quedaban 1.266 emails verificados
y nominales, y por un momento parecieron volumen gratis ya pagado.

**No lo eran.** Cruzados contra los leads que hay cargados ahora mismo en Smartlead:

| | |
|---|---|
| Cosechados | 1.266 |
| Ya cargados con ese mismo email | **1.159** |
| Mismo dominio, otra persona | 43 |
| **Limpios de verdad** | **64** |

No hay stock oculto. El gasto de Apollo de septiembre ya está dentro de las campañas.

### El bug del dedupe, cerrado

`dedupe_31ago.json` tiene 3.153 dominios. Los leads cargados hoy en Smartlead son **6.211
emails en 4.778 dominios**. El dedupe estaba ignorando **1.625 dominios ya contactados**.

Desde hoy el dedupe se hace contra los leads vivos de Smartlead, no contra la foto de agosto.
La consulta está en `captacion/scripts/cosecha_apollo.py`.

---

## 3. El scoring · Qualivo ICP Score /100

Tabla de Maikel, literal:

| Señal | Puntos |
|---|---:|
| Ticket >3.000 € | +15 |
| +50 leads/oportunidades mes | +15 |
| Invierte activamente en Ads | +15 |
| Existe equipo comercial/admissions/recepción | +10 |
| Venta requiere reunión/llamada/visita | +10 |
| CRM detectable | +10 |
| Ciclo >7 días | +5 |
| >10 empleados | +5 |
| WhatsApp/teléfono forma parte de venta | +5 |
| Tiene varias fuentes de captación | +5 |
| Base histórica/reactivación potencial | +5 |

**80-100 → atacar inmediatamente · 60-79 → outbound normal · 40-59 → nurture o enriquecer
primero · <40 → no gastar llamada humana.**

### Lo que de esta tabla se puede puntuar gratis y lo que no

Esto importa porque determina si el score se puede aplicar a 2.300 leads o solo a 20.

| Señal | ¿Se puede comprobar sin gastar? | Cómo |
|---|---|---|
| >10 empleados | **Sí** | viene en Apollo |
| Existe equipo comercial/admissions | **Sí** | se cuenta por cargos en Apollo |
| Venta requiere reunión/llamada/visita | **Sí** | por vertical, es estructural |
| Ciclo >7 días | **Sí** | por vertical |
| Varias fuentes de captación | Sí, con sonda | sonda gratis de la web |
| WhatsApp en la venta | Sí, con sonda | sonda gratis de la web |
| CRM detectable | Sí, con sonda | **con cuidado**, ver abajo |
| Invierte en Ads | **Con cuidado** | ver abajo |
| Ticket >3.000 € | No directamente | se infiere del vertical |
| +50 leads/mes | **No** | no es observable desde fuera |
| Base histórica | No | no es observable desde fuera |

**La advertencia, y viene de un error propio:** el 29-sep afirmé que unas empresas no usaban
Google Ads porque no aparecía el tag en el HTML. Era falso: lo cargaba Dataslayer por
JavaScript. Lo mismo pasa con los formularios, que HubSpot inyecta después.

Por tanto, en la sonda estática **la ausencia no prueba nada**. Solo se puntúa lo que se ve;
lo que no se ve queda como DESCONOCIDO, nunca como cero. Es la sección 7 del rol de LinkedIn
aplicada a la herramienta: HECHO, HIPÓTESIS o DESCONOCIDO, y una hipótesis no se escribe
como un hecho.

**Consecuencia:** de las 11 señales, 4 se puntúan gratis y a escala, 3 requieren sonda y 4 no
son observables. El máximo alcanzable a escala es de unos 40 puntos, que en la tabla de
Maikel cae en "nurture o enriquecer primero". Así que el score no sirve para decidir a quién
se descarta; sirve para **ordenar** la cola. Descartar por un score bajo que en realidad es
falta de información sería el mismo error del 29-sep a mayor escala.

---

## 4. Los seis motores

Para cada uno: a quién sí, a quién no, qué cargos, qué se busca, dónde está el dinero
perdido, y el ángulo del email.

### A · Formación premium

**Sí:** escuelas profesionales, business schools, másteres, FP privada, formación
especializada (aviación, audiovisual, estética, sanitaria, tecnología, oposiciones).
11-200 empleados. Programas de 800 a 15.000 €.

**No:** academias de 10 alumnos, formación subvencionada de bajo margen, negocios que
apenas generan solicitudes. Academias de idiomas locales y escuelas de música salvo cadena
con varios centros y ticket alto.

**Cargos:** Director General, Director de Marketing, Director Comercial, Admissions
Director/Manager, CEO.

**Dinero perdido:** `lead → matrícula`. Contacto tardío, uno o dos intentos y abandono,
WhatsApp sin estructura, no-shows a la llamada informativa, "me lo pienso", financiación,
interesados de convocatorias anteriores que nadie vuelve a trabajar.

**Trigger:** están invirtiendo en captar alumnos. Es la mejor señal del vertical.

**Ángulo del email:** el agujero no está en conseguir la solicitud, está entre la solicitud
y la matrícula.

**Másteres online es Tier 1 y lleva campaña propia.** Universidades privadas, business
schools y educación superior online, ticket 3.000-30.000 €, cientos o miles de leads, equipo
de admissions, a veces varios países. Es el mismo dolor multiplicado por volumen.

### B · Clínicas high-ticket

**Sí:** dental, estética, medicina privada, fertilidad, cirugía, capilar, fisioterapia
premium. 1-10 centros, 5-100 empleados, tratamientos >500 € e idealmente >1.500 €, Ads
activos.

**No:** consulta individual pequeña sin inversión ni volumen.

**Cargos:** propietario, gerente, Director de clínica, Marketing Manager, CEO.

**Dinero perdido:** `lead → tratamiento aceptado`, y está sobre todo en el tramo
`cita → asistencia → presupuesto`, no en generar el lead. Recepción saturada, el lead
nocturno que espera a mañana, una sola llamada, primera visita no presentada, presupuesto de
3.000 € que nadie sigue, WhatsApp mezclado con recepción.

**El techo:** solo 553 decisores localizables. Por debajo de 11 empleados hay que ir a la web
a mano, y ahí lo único fiable es el teléfono. **Este vertical es de llamada, no de email.**

### C · Servicios B2B high-ticket

**Sí:** consultoría (ESG, estrategia, transformación, compliance, financiación, M&A),
ingeniería, tecnología, RRHH y ETTs, servicios profesionales. 10-200 empleados, ticket
>3.000 € e idealmente >10.000 €, ciclo de 2 semanas a 6 meses.

En consultoría de alto valor **el requisito de +30 leads/mes deja de aplicar**: con 10
oportunidades de 50.000 € el problema ya merece resolverse.

**Cargos:** CEO, Managing Director, CRO, Sales Director, Marketing Director, Business
Development Director.

**Dinero perdido:** `oportunidad → propuesta → contrato`. La oportunidad depende por completo
del comercial, propuestas abiertas durante semanas, CRM sin actualizar, sin priorización,
bases antiguas, y dirección que para saber cómo va el pipeline tiene que preguntárselo al
comercial.

**Ángulo:** no vender automatización. Encontrar qué oportunidades se están perdiendo dentro
del proceso y montar un sistema que decida qué debería pasar con cada una.

### D · Reformas / construcción

**Sí:** reformas integrales, rehabilitación, constructoras pequeñas y medianas,
instalaciones premium, cocinas, ventanas, climatización, solar. 5-100 empleados, ticket
>5.000 €, más de 20-30 solicitudes al mes, Ads activos.

**Cargos:** CEO, gerente, Director Comercial, Marketing.

**Dinero perdido:** `lead → visita → presupuesto → obra`. El agujero está después del lead:
presupuestos de 20.000 € sin seguimiento, visitas mal cualificadas, comerciales
desplazándose para presupuestos imposibles.

**La nota económica:** 51 € por cita frente a 17 € en formación. No está muerto — en el mes
completo dio 3 A + 2 B de 15 — pero es tres veces más caro. Es volumen, no rentabilidad.

### E · SaaS B2B

**Sí:** 10-200 empleados, trial/demo/freemium, CRM, equipo de Sales/CS/Growth, ACV >1.000 €.

**Cargos:** CEO en SaaS pequeño; Head of Growth, VP Sales, CRO, RevOps, Head of Customer
Success.

**Dinero perdido:** `trial → activación → pago → retención`. Trials sin activar, registros
abandonados, demo requests sin respuesta rápida, MQL que ventas considera malos, datos de
producto separados del CRM, churn y reactivación.

### F · Inmobiliario

**Sí:** promotoras, inmobiliarias medianas, brokers especializados, obra nueva, inversión.
5-100 empleados, +50 leads/mes, varios agentes, portales + web + Ads.

**No:** inmobiliaria tradicional diminuta.

**Cargos:** CEO, Director Comercial, Marketing Director, Sales Manager.

**Dinero perdido:** `lead → visita → reserva → cierre`. El lead de portal que se contesta
tarde, el agente que decide a ojo qué lead vale, visitas no presentadas, y sobre todo el
comprador que no encaja con ese inmueble pero sí con otro y nadie vuelve a él.

---

## 5. Lo que queda fuera de prospección

Osteopatía, escuelas de aviación, academias de idiomas, escuelas de música y suscripción no
son motores. Aviación va dentro de formación premium; osteopatía dentro de formación o
clínicas según de dónde venga el dinero; idiomas y música solo si hay cadena, volumen y
ticket alto. Suscripción queda como ICP secundario: hay menos componente comercial humano y
está más lejos del núcleo.

Sirven en Intelligence como demos y casos de simulación. No como segmentos de prospección.

---

## 6. El problema que esto no resuelve, y hay que decirlo

`mensajes-v3` exige que el email 1 se gane el sitio con **una señal verificada de SU
empresa** en la primera línea, en 90 palabras. El cuerpo común ya ocupa 65, así que quedan
unas 25 para la señal. Verificar una señal por empresa a mano es el cuello declarado del
sistema, y es la razón real de que en septiembre salieran 13 envíos con capacidad para 525
al día.

Enriquecer 2.300 emails no resuelve eso por sí solo: mueve la cola de sitio.

**La salida está en la propia definición de Maikel:** "cada ICP debería tener su propia
definición de dinero perdido", y el email de ejemplo que escribió no afirma ningún hecho de
la empresa — plantea la hipótesis del vertical:

> "He visto que captáis solicitudes para vuestros programas. Lo que solemos encontrar en
> escuelas con un proceso parecido no está en el anuncio, sino entre la solicitud y la
> matrícula: tiempo hasta primer contacto, intentos de seguimiento, no-shows y leads de
> convocatorias anteriores que nadie vuelve a trabajar."

Eso escala a 2.300 sin inventar nada, porque no afirma nada que no se pueda sostener: es
vertical + cargo + etapa observable del embudo, dicho como hipótesis. Y cumple la sección 20
del rol de LinkedIn: no "estáis perdiendo leads", sino "revisaría qué ocurre entre X e Y".

Es un cambio de copy, y el copy lo decide Maikel. Sin su ok no se toca `mensajes-v3`.
