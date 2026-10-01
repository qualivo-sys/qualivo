# Orchestrator · primera lectura y Hot Queue · 1-oct-2026

Leídos: el rol (31 apartados), el anexo de realidad medida, el ICP Operating System, los roles de
llamadas y LinkedIn con sus herramientas, el análisis de septiembre, la alerta SURBL, y la auditoría
de Notion de principio a fin.

**No se ha activado nada ni se ha escrito a nadie.** Todo lo que sigue necesita el OK de Maikel.

**Lo que no he podido medir yo mismo:** esta sesión no tiene claves en el scratchpad, así que no he
consultado Smartlead, GHL, HeyReach ni Vapi. Todo lo que afirmo sale de los documentos del repo y de
la auditoría de Notion, y donde hace falta una consulta a la API lo digo en vez de rellenarlo.

---

## PARTE 1 · Dónde empezaría el lunes, en orden

El anexo propone seis pasos para la primera semana. Estoy de acuerdo con cinco de los seis en el
*qué*. Discrepo en el **orden**, y añado uno que no está. Lo que sigue es mi orden, con el motivo de
cada cosa.

### 1 · Una sola lista de supresión, consultada antes de cualquier envío en cualquier herramienta

El anexo pone esto en el puesto 6. Va primero, y el motivo es la asimetría del coste de
equivocarse.

Que falte el campo `revenue` cuesta un trimestre de aprendizaje. Que falte la lista de supresión
cuesta otra persona quemada y, visto el historial, posiblemente otro expediente: ya hay uno abierto
(CCOO Catalunya, expediente 321728), cuatro escalados y **17 peticiones de parada de 108 respuestas
humanas**. Y el dato que lo decide: al auditarlas ayer, **4 de las 17 no estaban dadas de baja de
verdad**. No es un riesgo teórico; es un fallo que seguía vivo anteayer, con siete campañas activas.

El caso de María Carrascal no fue un fallo de arquitectura. Fue que una promesa hecha en LinkedIn no
existía en ningún sitio que Smartlead leyera. Para que no se repita no hace falta el bus de eventos
que el apartado 5 describe y que hoy no se puede construir: hace falta **un fichero** con una fila
por persona a la que se ha prometido no contactar o que ha pedido parar, en cualquier canal, y una
comprobación contra él antes de cargar un lead o lanzar una llamada. Un día de trabajo.

Esto es, además, la única parte del apartado 7 que se puede implementar sin webhooks, y por eso va
antes que el resto del Event Contract.

### 2 · Revelar los créditos de Apollo antes del 14-oct · **aquí discrepo del anexo**

El anexo (§8) concluye que sobra presupuesto de enriquecimiento y que **el cuello no es Apollo**. En
volumen tiene razón: tres cohortes son 300-450 créditos de 2.467. Pero esa lectura deja fuera el
dato que la auditoría de Notion sí recoge: **los 2.467 créditos caducan el 14 de octubre.** Desde el
lunes son siete días laborables.

En el orden del anexo los créditos se gastan después de arreglar datos y entregabilidad, es decir,
probablemente nunca. Y esas dos cosas no están en conflicto, porque son decisiones distintas:

- **Revelar un email no envía nada.** Un email revelado es inventario en un fichero.
- **Cargar un lead en una campaña sí envía.** Eso es lo que el apartado 27 prohíbe mientras DATA y
  DELIVERABILITY estén roto.

Así que: revelar antes del 14-oct, cargar cero hasta que el sensor y la lista de supresión estén.
El apartado 25 dice que los créditos son capital. Capital que caduca en siete días laborables no se
administra, se usa o se pierde.

Con el reparto de las tres cohortes del apartado 13 y la nota del propio anexo de que Clínicas solo
tiene 553 decisores en toda España, una cohorte de 150 ahí se come el 27% del vertical. Eso hay que
decidirlo sabiéndolo.

### 3 · SURBL en los dos dominios

Coincido con el anexo, en este puesto y no antes, por una razón práctica: la retirada **no la puedo
hacer yo**. Requiere el formulario web de surbl.org y, antes, averiguar por qué están listados, o
vuelven a entrar. Es de Maikel y es el paso 2 del cuello del apartado 27.

Lo que sí recomiendo decidir el lunes y no más tarde: **pausar los 5 buzones de goqualivo.com y
gotqualivo.com.** Son 275 de 525 correos/día, el 52% de la capacidad nominal, pero con los otros dos
dominios limpios quedan 250/día y hoy se envían 37. **Pausar no cuesta volumen real**, y cada rechazo
que acumulamos hace más difícil la retirada.

Y una corrección que hay que escribir en el repo: `estrategia/analisis-septiembre-outbound.md` §6
sigue diciendo *«La entregabilidad… No hay problema de dominio, de calentamiento ni de spam»*. Eso
es falso desde ayer y es exactamente la frase que haría que alguien no actuara. La tasa de rebote no
podía verlo porque **los 550 entraban en Smartlead contados como respuestas, no como rebotes**. Ese
fichero necesita una errata.

### 4 · El sensor: tracking de aperturas en todas las campañas y canal como campo obligatorio

Coincido con el anexo y con el apartado 28. Coste cero, es configuración. El 40% de los envíos sin
medir aperturas y el 82% de las citas sin canal son la razón por la que ninguna comparación de coste
por cita que hemos hecho está demostrada.

Pero hay una consecuencia que el anexo no saca, y vale una decisión gratis el mismo lunes: **la lista
de llamadas calientes se construye con «3 o más aperturas»**, y la apertura es la señal más débil de
la jerarquía del propio Brain (*«nunca tratar una apertura como intención»*), además de no existir en
el 40% de la base. Hay 34 clics medidos. **Un clic vale más que tres aperturas y además se mide
bien.** Lo que haría el lunes es repuntar la capacidad de llamada de la lista de 20 aperturas a la
cohorte de clics. No cuesta nada y es decisión de routing, que ya es mía.

### 5 · Hot Queue con P1 y P3, que son las dos que tienen datos

Coincido sin reservas. Está en la Parte 3.

Una precisión sobre P1 que cambia el trabajo: el anexo y el encargo lo llaman *«~15 respuestas
positivas sin reunión»*, y se lee como un atasco de correo sin contestar. **No lo es.** La auditoría
mide que de 108 respuestas humanas **solo 3 quedaron sin contestar**, y las calientes se contestaron
rápido (Giner en 19 minutos, Dataslayer en 55). El triaje no es el problema.

P1 es gente **a la que sí se contestó** y que aun así nunca llegó a un calendario. Eso apunta al
paso 5 del apartado 19 —reducir fricción, proponer hueco concreto— y no a «responder más rápido». Y
en tres casos concretos (Alejandra Higueras, Alexandra Dalmau, Santiago Paz Noya) el seguimiento
**ya está escrito y lleva días parado porque el borrador no convenció**. Esa parte de P1 no es un
fallo del sistema: es una cola de tres aprobaciones.

### 6 · Los campos `revenue` y `lost_reason` en GHL, con los 18 registros hacia atrás

El anexo lo pone primero. Lo pongo sexto, y no porque no importe: sin esos dos campos los apartados
21, 22, 23 y 26 no tienen materia prima y la métrica maestra no se calcula. Son 3 ganadas con
`monetaryValue = 0` y 15 perdidas sin motivo, 18 registros, una tarde.

Va sexto porque es **aprendizaje retrospectivo**: cambia lo que sabremos en noviembre, no lo que le
pasa a una persona esta semana. Los cinco puntos de arriba sí.

Un dato del anexo que conviene no perder al rellenarlo: **14 de las 15 perdidas empiezan por
«Meta ·»**, o sea vienen de anuncios y se concentran en Reformas y Formación. Las pérdidas no están
repartidas por canal, y eso es una hipótesis con la que entrar a los 15 motivos en vez de con una
lista en blanco.

### 7 · El Event Contract como tabla de estado derivada por sondeo

Último, y de acuerdo con el anexo en la forma: no hay webhooks, las respuestas se detectan sondeando
cada hora, y `NO_SHOW` no se detecta de ninguna manera. Escribirlo como tabla de estado y no
prometer tiempo real. Pero esto es construcción, y los seis puntos anteriores son decisiones y
configuración.

---

## PARTE 2 · Donde discrepo del anexo, resumido

| | El anexo dice | Mi lectura |
|---|---|---|
| **Orden** | `revenue`/`lost_reason` primero, stop conditions sexto | Invertido. La supresión impide daño esta semana; los dos campos cambian lo que sabremos en noviembre. 4 de 17 bajas seguían sin aplicar ayer |
| **Apollo** | *«Sobra presupuesto. El cuello no es Apollo»* | Cierto en volumen, incompleto en plazo: **2.467 créditos caducan el 14-oct**. Revelar ≠ cargar. En su orden, caducan |
| **Los 13 clics** | El problema está después del clic; landing, calendario, fricción, confianza, timing | Falta el primer sospechoso: **el dominio emisor**. Ver abajo |
| **Mensaje** | Paso 4 del cuello: *«funciona»* (2,24% vs 0,48%) | De acuerdo, y por eso no lo toco. Pero el 2,24% es la Capa A, con techo de 15 leads/día. Lo que no tiene datos es la Capa B, que es lo único que escala |
| **Capacidad de llamada** | No lo trata | Hoy apunta a 20 aperturas. Debería apuntar a 34 clics. Gratis, el lunes |
| **LinkedIn** | No lo trata en la primera semana | El propio rol de LinkedIn sigue ordenando como acción nº1 *«las 84 conversaciones dormidas»*. **La auditoría retiró ese dato: son 5 y una es un bloqueo.** El repo lleva una orden retirada como si estuviera viva |

### La discrepancia que más vale: los 13 clics y el dominio emisor

El anexo (§6) lo llama *«la señal más fuerte que hay en los datos de Qualivo ahora mismo»* y tiene
razón. Y tanto el anexo como la auditoría concluyen lo mismo: el copy consiguió el clic, el problema
está después, y es calendario o landing. **A las dos les falta preguntar si el enlace era
alcanzable.**

Cruzando los documentos de despliegue con la alerta SURBL, las siete campañas de líneas de servicio
quedan así:

| Campaña | Envíos | Clics | Resp | Tasa | Buzones emisores | SURBL |
|---|---:|---:|---:|---:|---|---|
| PRL y salud laboral · 3817064 | 35 | — | 2 | **5,71%** | 5× qualivoedge | **limpio** |
| Agent for Me · Gestorías A2 · 3817054 | 86 | — | 3 | 3,49% | 3× goqualivo | LISTADO |
| ICP Adelantta · 3812488 | 172 | ≥7 | 4 | 2,33% | 3× goqualivo | LISTADO |
| **Gestorías · Piloto · 3887259** | 78 | **10** | **0** | **0%** | 3× goqualivo | LISTADO |
| **Administradores de fincas · 3817065** | 39 | **3** | **0** | **0%** | 2× gotqualivo | LISTADO |
| Multiservicio · 3918544 | 45 | — | 0 | 0% | sin confirmar | — |
| Asesorías · presupuesto parado | 30 | — | 0 | 0% | sin confirmar | — |
| **Total** | **485** | **34** | **9** | **1,86%** | | |

Sobre dominio listado: **375 envíos, 7 respuestas, 1,87%.**
Sobre dominio limpio: **35 envíos, 2 respuestas, 5,71%.**

Y las dos campañas con clics y cero respuestas son las dos que salieron **al 100% por los dos
dominios que ahora están confirmados en SURBL**.

El mecanismo es el que ya está escrito en la propia alerta: **Smartlead construye el píxel de
seguimiento y el enlace de baja con el dominio del buzón emisor**. El calendario del email 3 de esas
campañas *es* una URL de goqualivo.com o gotqualivo.com. SURBL es una lista negra **de URLs**, y la
consumen filtros web y de correo corporativos. El patrón observado —clic registrado, ninguna
reserva, ninguna respuesta— es exactamente lo que produce un redirect que el filtro de su empresa
corta después de que Smartlead cuente el clic.

Y la comprobación de agosto que lo descartó no vale: `clics-calendario-adelantta.md` dice *«El enlace
carga bien (HTTP 200)»*, medido desde nuestra propia máquina. Lo he repetido hoy desde este
contenedor y los cuatro dominios devuelven 200. **No prueba nada sobre lo que hace el filtro de un
despacho.** Es el mismo error de «comprobación sin entrada de control» que este equipo ya se ha
señalado tres veces.

**Dos cosas en contra, que digo yo mismo:**

1. **No sé desde cuándo están listados los dos dominios.** Si entraron a finales de septiembre, no
   pueden explicar el comportamiento de agosto. Esto hay que fecharlo antes de dar la hipótesis por
   buena.
2. La auditoría prueba que **los 550 se registran como respuestas con `reply_time`**. Gestorías ·
   Piloto tiene literalmente 0 respuestas, así que probablemente **no** hubo rechazos duros en esa
   campaña. Por eso mi hipótesis es sobre **el destino del clic**, no sobre la entrega.

Es falsable y cuesta poco: fechar el listado, mirar el redirect real del enlace de seguimiento de un
lead de cada campaña, y comparar reserva por dominio emisor. Va antes de rediseñar el calendario o
la landing, porque si el enlace no llega, rediseñar lo que hay detrás no cambia nada.

---

## PARTE 3 · HOT QUEUE · 1-oct-2026

Solo P1 y P3. P2 son 2 casos y se trabajan con los nombres que ya están en el repo (Renato,
Izaskun). **P4 no se puede construir**: depende del scoring unificado, que no existe —y que será el
tercer sistema, así que antes hay que remapear las etiquetas o `nivel-a` seguirá sin significar
nada. **P5** necesita una consulta de última actividad por oportunidad sobre las 48 abiertas.

**Capacidad real de Maikel hoy:** Giner a las 11:00 (primera, diagnóstico) y el **cierre de Asla a
las 12:00**. Así que la cola de hoy no son 20 filas que trabajar: son **tres aprobaciones y una
decisión de precio**. El resto es para el lunes.

### P1 · Respuesta positiva sin reunión

Ordenado por fuerza de intención × frescura. Nada de esto se manda sin OK.

| # | Quién | La señal, literal | Estado | Siguiente acción |
|---|---|---|---|---|
| **A1** | **Alejandra Higueras** · clínica dental | pidió precio 21-sep 10:18 | se le mandó el mismo día 15:21; silencio 10 días. **Seguimiento escrito y parado** | **Aprobar o rehacer el borrador.** Antes: decidir si la garantía es «primer mes» (lo que ella tiene por escrito) o «catorce días» (texto posterior). Son dos garantías |
| **A2** | **Víctor González** · AV Energías | *«Si tienes alguna propuesta mándamela por mail»* 8-sep | contestado 9-sep; el empujón previsto «el jueves» no consta | Invitó una propuesta y no se le mandó. Mandarla |
| **A3** | **Jelen Colak** · My Language Coach | pidió precio; 35 días de silencio antes | se le dio **1.000-2.500 €/mes** el 14-sep | **Esa cifra ya no es el precio** (`precio.md`, 21-sep: 1.200 + 750). Cualquier recontacto corrige el número |
| **A4** | **Alexandra Dalmau** · Aparca&Go | preguntó si lo hablaban ya o esperaban; se dijo «ahora» | silencio desde 21-sep. **Seguimiento escrito y parado** | Aprobar o rehacer |
| **B1** | **Antonio Calviño** · academiakaizen.net, dojoikigai.com | nos dio sus dos webs para que las miráramos | 48 días. Se le prometió el análisis **dos veces** y no se entregó | **Hacer la radiografía de verdad antes de volver a escribirle.** Ya le fallamos |
| **B2** | **Carvajalinos** | *«Envíanos más info»* | petición rebajada a una línea el 14-sep; silencio | Cerrar o mandar algo de valor |
| **C1** | **Manuel Martín** · Gala Formación | pasó la propuesta a Dirección Comercial | nadie contactó a esa persona | Multi-threading. Identificar al derivado. LinkedIn, apartado 16 |
| **C2** | **Diana** · Digital Preventor | la trasladó a la persona adecuada | igual | Igual |
| **C3** | **Felipe Colsa** · Gestionet | dijo que no es decisor y preguntó cuántos somos | sin seguir | Contestar su pregunta y pedir al decisor |
| **D1** | **Mónica** · Mawah Assessors | *«Me parece razonable, pero tenemos que reducir la inversión»* | timing, no rechazo | Nurture con fecha. No empujar |
| **D2** | **Carol** · Zauma | dijo que no es prioridad | se respetó | Dejar. Revisar fin de Q4 |
| **E1** | **Jose Luis González** (CMO) · Grup Montaner | **2 clics** en calendario 24-ago | **7 correos, 0 respuestas**, dos de ellos decían ser el último | **Email cerrado aquí.** Teléfono o LinkedIn, con OK |
| **E2** | **Miguel Cervera** · equilibrha | **1 clic** en calendario 24-ago | **7 correos, 0 respuestas**, idem | Igual |

**Fuera de P1 a propósito:** Lara (pregunta de procedencia del dato, contestada; recontactar es
riesgo legal, no oportunidad) y todo lo que esté en los 19 dominios bloqueados o en las 17
peticiones de parada.

**Lo que P1 dice del sistema:** la mitad de esta cola no está parada por falta de proceso. Está
parada en tres borradores sin aprobar y en dos cuentas donde se insistió siete veces por el único
canal que ya había demostrado no funcionar. El apartado 19 pide *«responder rápido»* y eso ya se
hace bien. Lo que falta es el paso 5, **reducir fricción**: hueco concreto en vez de calendario, y
cambiar de canal cuando el canal está agotado.

### P3 · Clic sin reserva · 34 clics en 485 envíos (7,0% frente al 0,33% de media)

**Con nombre, de los documentos del repo** (los 7 de ICP Adelantta, 24-25 ago):

| Persona | Empresa | Clics | Cuándo |
|---|---|---:|---|
| Jose Luis González (CMO) | Grup Montaner | 2 | 24-ago 12:04 |
| Joan Montaner | Grup Montaner | 1 | 24-ago 13:05 |
| Miguel Cervera | equilibrha | 1 | 24-ago 12:04 |
| Beatriz Sánchez | equilibrha | 1 | 24-ago 13:06 |
| Estela García | Grupo2000 | 1 | 25-ago 07:27 |
| Iban Montanés | Temporal Transfer | 1 | 25-ago 09:24 |
| Eva García | AYCE Laborytax | 1 | 25-ago 09:23 |

**En dos cuentas clicaron dos personas distintas con una hora de diferencia.** Eso es alguien
reenviando el correo dentro de la empresa, no curiosidad individual. **Grup Montaner y equilibrha
son las dos cuentas más fuertes de toda la cohorte** —y son exactamente las dos donde el email está
agotado (E1 y E2 de P1). Se trabajan **como cuenta**, multi-threading y cambio de canal, no como dos
contactos sueltos.

**Sin nombre · requiere consulta a Smartlead, que esta sesión no puede hacer sin claves:**

- **Gestorías · Piloto (3887259): 10 clics, 0 respuestas** en 78 envíos
- **Administradores de fincas (3817065): 3 clics, 0 respuestas** en 39 envíos
- los clics de Adelantta posteriores al 25-ago (la campaña pasó de 132 a 172 envíos)
- Gestorías A2, PRL, Multiservicio y Asesorías: clics sin desglosar

Por cada clicador hace falta lo que pide el apartado 18: qué email recibió, qué enlace, **si el
redirect resolvió**, si llegó al calendario, qué hizo después, si respondió luego.

### Lo que NO hay que hacer con P3, y es lo primero que uno haría

**No mandar el nudge de agosto otra vez.** Ya se mandó, a los 7 de Adelantta, el mismo día 25-ago:

> *«Vi que echaste un ojo al calendario. Si no te cuadra la agenda, no hace falta reunión. Te
> preparo el análisis por escrito…»*

Resultado medido: **Grup Montaner y equilibrha recibieron después siete correos cada uno con cero
respuestas.** La oferta de análisis por escrito no es una idea sin probar en esta cohorte. Es una
idea **probada y fallida** en ella.

El apartado 18 avisa de no asumir que el problema es el copy. De acuerdo. Pero tampoco es seguro que
sea el calendario: **antes de rediseñar nada, verificar que el enlace llegaba**, por lo de la Parte 2.

---

## PARTE 4 · Lo que es de Maikel y me bloquea

### 1 · El apartado 31 está cortado

El rol se corta a mitad de *«FUNNEL · Prospects → replies → positive…»*. Define qué se reporta cada
semana y con qué cortes. **No lo completo por mi cuenta.** Hace falta el resto del 31 y los
apartados posteriores si los hay, antes de montar el weekly review.

### 2 · El conflicto de gobernanza · más estrecho de lo que parece

El apartado 1 me da *«qué oferta utilizar»*, *«qué canal utilizar»* y *«cuándo escalar»*. La regla
vigente del Outbound Brain dice, literal:

> *«Maikel decide posicionamiento, ICPs nuevos, activación de copies, tono, estrategia y canales
> nuevos. El agente decide priorización de señales, personalización, selección de patrón,
> clasificación de respuestas, routing y propuesta de experimentos.»*

Puesto al lado, el Brain **ya me concede** casi todo el apartado 1: priorización, routing,
clasificación, secuencia, experimentos. Los solapamientos reales son **tres**: oferta, escalado de
volumen y canal nuevo. Y el Brain **no menciona el precio en ninguna parte** — eso viene de
`precio.md` y de las rutinas.

Mi propuesta, para que la confirmes o la corrijas, y luego se escribe:

- **Yo decido sin preguntar:** qué cuenta se trabaja antes, por qué canal de los ya activos, en qué
  orden, qué secuencia, cuándo se para y cuándo se cambia de canal.
- **Tú decides:** precio, oferta nueva, copy nuevo, canal nuevo, y subir volumen.

**No tomo ninguna decisión de precio.** Y hay que tomar una esta semana, porque el registro de
precios dice que es único y no lo es:

| Dónde | Entrada | Recurrente |
|---|---|---|
| `precio.md`, «fuente única», 21-sep | 1.200 € | **750 €/mes** |
| Ana Claros (CRM) | 1.200 € | **800 €/mes** |
| Asla · propuesta fuera | 1.200 € | **1.000 €/mes** |
| Alpha Media · nota 22-sep | **1.500 €** | 750 €/mes |
| Alpha Media · Gamma 21-sep, **la que él tiene abierta** | **1.200 €** | 750 €/mes |

Tres cuotas vivas contra una «fuente única» que dice 750. Y tres garantías distintas: «primer mes»
(`precio.md` y lo que tiene Alejandra), «catorce días» (texto posterior) y «3 meses más» (Asla).

**Sergi ve la demo mañana a las 10:00 con su equipo y con Rosa.** Si se dice 1.500 y él abre el
Gamma de 1.200, el problema deja de ser el precio.

### 3 · Lo demás que bloquea y no es mío

- Retirada de **goqualivo.com** y **gotqualivo.com** en surbl.org, y antes, por qué están listados
- Pausar o no los 5 buzones de esos dominios (52% de capacidad nominal, 0% de volumen real)
- Reanudar los **151 leads de Clínicas** (bloqueado por el clasificador de permisos del entorno).
  Dato nuevo: los buzones de rol de esa campaña rebotan al 3,23% y dieron **las dos únicas
  respuestas**; los nominales inferidos rebotan al 12%
- Clínicas · precio por WhatsApp está activa al 5,63% de rebote. Su propia regla dice pausarla; la
  orden de ayer era empujarla. No se ha tocado
- Confirmar los 7 dominios de cliente pendientes: Nuria Roure, BelloVinilo, Equipzilla, Eleva
  Academy, Miquel Baixas, Emprende Aprendiendo, Escuela de Nuevos Negocios
- **2.467 créditos de Apollo, caducan el 14-oct** · siete días laborables desde el lunes
- Raquel: ¿appointment setter (guion v5 en producción) o discovery (lo que pide el rol nuevo)? Sin
  eso no se toca el asistente de Vapi
- Recargar la cuota de ElevenLabs
- Confirmar si entra la socia de Ana Claros el lunes

---

## Reglas que estoy aplicando

Claves solo en scratchpad. Nunca POST de secuencia sobre campaña con leads en curso. Dominios de
cliente y ex cliente fuera. Baja o RGPD: bloquear y pausar sin preguntar y decirlo después, y la
respuesta escrita al RGPD no se manda. Llamadas 10:00-18:00 Europe/Madrid. Nada hacia fuera sin OK.
