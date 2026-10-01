# Orchestrator · primera lectura y Hot Queue · 1-oct-2026

Leídos: el rol (31 apartados), **la adenda del 1-oct**, el anexo de realidad medida, el ICP Operating
System, los roles de llamadas y LinkedIn con sus herramientas, el análisis de septiembre, la alerta
SURBL y la auditoría de Notion de principio a fin.

**No se ha activado nada ni se ha escrito a nadie.**

**Lo que no he podido medir yo mismo:** esta sesión no tiene claves en el scratchpad, así que no he
consultado Smartlead, GHL, HeyReach ni Vapi. Todo lo que afirmo sale de los documentos del repo y de
la auditoría de Notion; donde hace falta una consulta a la API, lo digo en vez de rellenarlo.

---

## 0 · La adenda resuelve lo que iba a preguntar, y corrige mi orden

Escribí la primera versión de esto antes de leer la adenda. Dos de sus puntos la cambian:

**La gobernanza está cerrada** (apartado A) y coincide con lo que iba a proponer: decido
priorización, canal, orden, timing, paradas por stop conditions, clasificación y preparación de
listas; **recomiendo** oferta, precio, copy y escalado, y la aprobación es suya. Ya no hay pregunta
que hacer. **El apartado 31 está completo** (apartado C): embudo, nueve ratios obligatorios y cierre
en seis decisiones. Tampoco hay que pedir nada.

**Y retiro mi reordenación.** Mi primera versión ponía la lista de supresión por delante de DATA,
con el argumento de que el daño se acumula mientras trabajamos en otra cosa. Ese argumento no se
sostiene cuando lo miro bien, por dos motivos:

1. Las 4 bajas que faltaban de las 17 **ya están aplicadas y verificadas una a una** (auditoría, §6).
   La fuga aguda está tapada a mano; lo que queda es el mecanismo, que es diseño.
2. P0.1, P0.2 y P0.3 son **tres documentos, no tres ejecuciones**: auditoría de campos, checklist de
   dominios y diseño V1. Ninguno envía nada, el depósito está vacío y cargar necesita su OK. Así que
   **no hay riesgo acumulándose** mientras se escriben, que es justo lo que yo estaba valorando.

El orden del apartado M se mantiene: **P0.1 DATA → P0.2 DELIVERABILITY → P0.3 STOP CONDITIONS →
P0.4 HOT QUEUE → P0.5 los 133.** Lo único que conservo de mi versión es cuál es la primera fila que
hay que construir dentro de P0.3, y resulta que ya está escrita en el apartado G: que una promesa
hecha en un canal bloquee en todos.

La Hot Queue va aquí entregada por delante de su turno porque se pidió hoy, y porque es el único de
los cinco que produce trabajo para una persona esta semana.

---

## 1 · Lo que aporto sobre el anexo

Coincido con el anexo en el fondo. Tres cosas donde discrepo o añado, por orden de cuánto valen.

### 1.1 · Los 13 clics con 0 respuestas: falta el primer sospechoso

El anexo (§6) lo llama *«la señal más fuerte que hay en los datos de Qualivo ahora mismo»* y tiene
razón. Y tanto el anexo como la auditoría concluyen lo mismo: el copy consiguió el clic, el problema
está después, y es calendario o landing. **A las dos les falta preguntar si el enlace era
alcanzable.**

Cruzando los documentos de despliegue con la alerta SURBL, las siete campañas de líneas de servicio:

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

Sobre dominio listado: **375 envíos, 7 respuestas, 1,87%.** Sobre dominio limpio: **35 envíos, 2
respuestas, 5,71%.** Y las dos campañas con clics y cero respuestas son las dos que salieron **al
100% por los dos dominios confirmados en SURBL**.

El mecanismo ya está escrito en la propia alerta: **Smartlead construye el píxel de seguimiento y el
enlace de baja con el dominio del buzón emisor.** El calendario del email 3 de esas campañas *es* una
URL de goqualivo.com o gotqualivo.com. SURBL es una lista negra **de URLs** y la consumen filtros web
y de correo corporativos. Clic registrado, ninguna reserva, ninguna respuesta es exactamente lo que
produce un redirect que el filtro de su empresa corta **después** de que Smartlead cuente el clic.

Y la comprobación de agosto que lo descartó no vale: `clics-calendario-adelantta.md` dice *«El enlace
carga bien (HTTP 200)»*, medido desde nuestra propia máquina. Repetido hoy desde este contenedor, los
cuatro dominios devuelven 200. **No prueba nada sobre el filtro de un despacho.** Es el mismo error
de «comprobación sin entrada de control» que este equipo ya se ha señalado tres veces.

**Dos cosas en contra, que digo yo mismo:**

1. **No sé desde cuándo están listados los dos dominios.** Si entraron a finales de septiembre, no
   explican el comportamiento de agosto. Hay que fecharlo antes de dar la hipótesis por buena.
2. La auditoría prueba que **los 550 se registran como respuestas con `reply_time`**. Gestorías ·
   Piloto tiene literalmente 0 respuestas, así que probablemente **no** hubo rechazos duros ahí. Por
   eso la hipótesis es sobre **el destino del clic**, no sobre la entrega.

Falsable y barata: fechar el listado, mirar el redirect real del enlace de un lead por campaña, y
comparar reserva por dominio emisor. Entra en P0.2, en la columna `evidencia` del formato del
apartado H, y va **antes** de rediseñar calendario o landing: si el enlace no llega, lo que haya
detrás da igual.

### 1.2 · Los créditos de Apollo caducan el 14-oct · recomendación, no objeción

El apartado K dice que después de clasificar los 133 diga **dónde invertir los siguientes 300-450
créditos**, y el anexo (§8) concluye que sobra presupuesto y que el cuello no es Apollo. Las dos
cosas son ciertas en volumen. Lo que ninguna de las dos recoge: **los 2.467 créditos caducan el
14-oct**, siete días laborables desde el lunes.

El número en crudo: si se invierten 300-450, **expiran unos 2.000.**

Y son dos decisiones distintas, que conviene no pegar:

- **Revelar un email no envía nada.** Es inventario en un fichero, y la adenda sitúa la aprobación en
  *«cargar una lista que vaya a empezar a recibir comunicaciones»*, no en revelar.
- **Cargar sí envía**, y eso espera a DATA, stop conditions y deliverability, como dice la regla Ñ.

**Mi recomendación:** decidir antes del 14-oct cuántos créditos se revelan, aunque la carga se quede
en cero hasta que los P0 estén. Si la respuesta es «solo 300-450», que sea una decisión tomada y no
el resultado de que se acabe el plazo. El apartado 25 dice que los créditos son capital; capital que
caduca en siete días laborables no se administra, se usa o se pierde.

### 1.3 · La capacidad de llamada apunta a la señal más débil

La lista de llamadas calientes se construye con *«3 o más aperturas»*. La apertura es la señal más
débil de la jerarquía del propio Brain (*«nunca tratar una apertura como intención»*) y **no existe en
el 40% de la base**. Hay 34 clics medidos, y un clic está por encima de una apertura en esa misma
jerarquía.

Repuntar la capacidad de llamada de las 20 aperturas a la cohorte de clics es selección de canal y
prioridad, así que por el apartado A **lo decido yo**. Lo hago en P0.4 y queda en la columna `agente`
de la cola. No cuesta nada.

### 1.4 · Dos erratas que dejan órdenes retiradas como si estuvieran vivas

- `estrategia/analisis-septiembre-outbound.md` §6 sigue diciendo *«La entregabilidad… No hay problema
  de dominio, de calentamiento ni de spam»*. Es falso desde ayer, y es exactamente la frase que haría
  que alguien no actuara sobre SURBL. La tasa de rebote no podía verlo porque **los 550 contaban como
  respuestas, no como rebotes**.
- `captacion/agente-linkedin/rol-linkedin-outbound.md`, nota de adaptación §4, ordena como acción nº1
  *«las 84 conversaciones dormidas, antes de invitar a nadie nuevo»*. **La auditoría retiró ese dato:
  son 5 y una es un bloqueo.** Quien abra ese fichero el lunes empieza por un pozo que no existe.

Las dos son correcciones de fichero, sin decisión detrás. Entran en P0.1.

---

## 2 · HOT QUEUE V1 · 1-oct-2026

Formato del apartado L. P1 y P3 son las dos únicas con datos hoy; **P4** necesita una consulta de
última actividad sobre las 48 oportunidades abiertas y **P5** sale de los 133 una vez clasificados
(P0.5). P2 son dos casos ya nombrados en el repo (Renato cancelado el 30-sep, Izaskun rescatada con
llamada).

**Capacidad real de Maikel hoy:** Giner a las 11:00 y **el cierre de Asla a las 12:00**. La cola de
hoy no son 20 filas: son **tres aprobaciones y una decisión de precio**. El resto es del lunes.

### P1 · Positive reply sin reunión

Corrección de marco: el anexo lo llama *«~15 respuestas positivas sin reunión»* y se lee como un
atasco de correo sin contestar. **No lo es.** La auditoría mide que de 108 respuestas humanas **solo
3 quedaron sin contestar**, y las calientes se contestaron en minutos (Giner 19', Dataslayer 55').
El triaje no es el problema. P1 es gente **a la que sí se contestó** y que nunca llegó a un
calendario — o sea el paso 5 del apartado 19, **reducir fricción**, no «responder más rápido».

| Persona | Empresa | Señal | Estado | Última acción | Siguiente acción | Agente | Pri | Motivo |
|---|---|---|---|---|---|---|---|---|
| Alejandra Higueras | clínica dental | pidió precio 21-sep 10:18 | silencio 10d | precio enviado 21-sep 15:21 | aprobar o rehacer el borrador parado | Maikel | P1 | pidió precio y se le dio; **antes decidir si la garantía es «primer mes» o «catorce días»** |
| Víctor González | AV Energías | *«si tienes alguna propuesta mándamela por mail»* | el empujón previsto no consta | contestado 9-sep | mandar la propuesta que invitó | Email | P1 | invitó una propuesta y no se le mandó |
| Jelen Colak | My Language Coach | pidió precio | silencio desde 14-sep | se le dio **1.000-2.500 €/mes** | recontactar **corrigiendo la cifra** | Email | P1 | esa horquilla ya no es el precio (`precio.md`, 21-sep) |
| Alexandra Dalmau | Aparca&Go | preguntó si hablaban ya o esperaban | silencio desde 21-sep | se dijo «ahora» 21-sep 18:03 | aprobar o rehacer el borrador parado | Maikel | P1 | borrador escrito y parado |
| Antonio Calviño | academiakaizen.net · dojoikigai.com | nos dio sus dos webs para que las miráramos | 48 días | último intento 14-sep | **hacer la radiografía de verdad antes de escribir** | Orchestrator | P2 | se le prometió el análisis dos veces y no se entregó |
| Carvajalinos | — | *«Envíanos más info»* | silencio | petición rebajada 14-sep | mandar algo de valor o cerrar | Email | P3 | pidió info y seguimos sin dársela |
| Manuel Martín | Gala Formación | pasó la propuesta a Dirección Comercial | derivación sin seguir | — | identificar al derivado, multi-threading | LinkedIn | P2 | nos abrió la puerta y no entramos |
| Diana | Digital Preventor | la trasladó a la persona adecuada | derivación sin seguir | — | identificar al derivado | LinkedIn | P2 | igual |
| Felipe Colsa | Gestionet | no es decisor; preguntó cuántos somos | sin seguir | — | contestar su pregunta y pedir al decisor | Email | P3 | pregunta sin responder |
| Mónica | Mawah Assessors | *«razonable, pero tenemos que reducir la inversión»* | timing, no rechazo | — | nurture con fecha, no empujar | Orchestrator | P4 | bloqueo declarado de presupuesto |
| Carol | Zauma | dijo que no es prioridad | respetado | — | revisar fin de Q4 | Orchestrator | P5 | lo dijo ella |
| Jose Luis González (CMO) | Grup Montaner | **2 clics en calendario** 24-ago | **7 correos, 0 respuestas** | 2 de ellos decían ser el último | **email cerrado aquí** → teléfono o LinkedIn | Calling | P1 | también P3; el canal está agotado, no la cuenta |
| Miguel Cervera | equilibrha | **1 clic en calendario** 24-ago | **7 correos, 0 respuestas** | idem | **email cerrado aquí** → teléfono o LinkedIn | Calling | P1 | idem |

**Fuera de P1 a propósito:** Lara (pregunta de procedencia del dato, ya contestada; recontactar es
riesgo legal, no oportunidad) y todo lo que esté en los 19 dominios bloqueados o en las 17 peticiones
de parada.

**Lo que P1 dice del sistema:** la mitad no está parada por falta de proceso. Está parada en **tres
borradores sin aprobar** y en dos cuentas donde se insistió **siete veces** por el único canal que ya
había demostrado no funcionar.

### P3 · Click/engagement fuerte + ICP alto · 34 clics en 485 envíos (7,0% vs 0,33% de media)

Con nombre, de los documentos del repo (los 7 de ICP Adelantta, 24-25 ago):

| Persona | Empresa | Clics | Cuándo | Siguiente acción | Agente | Pri |
|---|---|---:|---|---|---|---|
| Jose Luis González (CMO) | Grup Montaner | 2 | 24-ago 12:04 | cambio de canal · cuenta | Calling | P1 |
| Joan Montaner | Grup Montaner | 1 | 24-ago 13:05 | multi-threading en la misma cuenta | LinkedIn | P2 |
| Miguel Cervera | equilibrha | 1 | 24-ago 12:04 | cambio de canal · cuenta | Calling | P1 |
| Beatriz Sánchez | equilibrha | 1 | 24-ago 13:06 | multi-threading en la misma cuenta | LinkedIn | P2 |
| Estela García | Grupo2000 | 1 | 25-ago 07:27 | verificar el enlace antes de tocar | Orchestrator | P3 |
| Iban Montanés | Temporal Transfer | 1 | 25-ago 09:24 | idem · líneas sin verificar | Orchestrator | P3 |
| Eva García | AYCE Laborytax | 1 | 25-ago 09:23 | idem · líneas sin verificar | Orchestrator | P3 |

**En dos cuentas clicaron dos personas distintas con una hora de diferencia.** Eso es alguien
reenviando el correo dentro de la empresa, no curiosidad individual. **Grup Montaner y equilibrha son
las dos cuentas más fuertes de toda la cohorte** — y son exactamente las dos donde el email está
agotado. Se trabajan **como cuenta**, no como contactos sueltos.

**Sin nombre · requiere consulta a Smartlead, que esta sesión no puede hacer sin claves:**
Gestorías · Piloto (10 clics / 0 resp / 78 envíos) · Administradores de fincas (3 / 0 / 39) · los
clics de Adelantta posteriores al 25-ago (la campaña pasó de 132 a 172 envíos) · Gestorías A2, PRL,
Multiservicio y Asesorías sin desglosar. Por cada clicador hace falta lo del apartado 18: qué email,
qué enlace, **si el redirect resolvió**, si llegó al calendario, qué hizo después.

### Lo que NO hay que hacer con P3, y es lo primero que uno haría

**No mandar el nudge de agosto otra vez.** Ya se mandó, a los 7 de Adelantta, el 25-ago:

> *«Vi que echaste un ojo al calendario. Si no te cuadra la agenda, no hace falta reunión. Te preparo
> el análisis por escrito…»*

Resultado medido: **Grup Montaner y equilibrha recibieron después siete correos cada uno con cero
respuestas.** La oferta de análisis por escrito no es una idea sin probar en esta cohorte: es una
idea **probada y fallida** en ella. El apartado 18 avisa de no asumir que el problema es el copy;
tampoco es seguro que sea el calendario. Verificar el enlace primero.

---

## 3 · Lo que recomiendo y espera su aprobación

Por el apartado A, esto es recomendación mía y la decisión es suya.

### 3.1 · El registro de precios dice que es único y no lo es

| Dónde | Entrada | Recurrente |
|---|---|---|
| `precio.md`, «fuente única», 21-sep | 1.200 € | **750 €/mes** |
| Ana Claros (CRM) | 1.200 € | **800 €/mes** |
| Asla · propuesta fuera | 1.200 € | **1.000 €/mes** |
| Alpha Media · nota 22-sep | **1.500 €** | 750 €/mes |
| Alpha Media · Gamma 21-sep, **la que él tiene abierta** | **1.200 €** | 750 €/mes |

Tres cuotas vivas contra una fuente única que dice 750. Y tres garantías: «primer mes» (`precio.md` y
lo que tiene Alejandra por escrito), «catorce días» (texto posterior) y «3 meses más» (Asla).

**Sergi ve la demo mañana a las 10:00 con su equipo y con Rosa.** Si se dice 1.500 y él abre el Gamma
de 1.200, el problema deja de ser el precio. **Recomiendo fijar 1.200 + 750 y una sola garantía antes
de esa hora**, y que `precio.md` recoja las excepciones ya comprometidas en lugar de contradecirlas.

### 3.2 · Pausar los 5 buzones de los dominios listados

275 de 525 correos/día, el 52% de la capacidad **nominal**. Pero con los otros dos dominios limpios
quedan 250/día y hoy se envían 37: **pausar no cuesta volumen real**, y cada rechazo que acumulamos
hace más difícil la retirada. La retirada en surbl.org es suya: requiere el formulario web y,
antes, saber por qué están listados.

### 3.3 · Lo demás que bloquea y no es mío

- Reanudar los **151 de Clínicas** — pero antes el informe que pide el apartado I. Dato que cambia la
  premisa: los buzones de rol de esa campaña rebotan al **3,23%** y dieron **las dos únicas
  respuestas**; los nominales inferidos rebotan al **12%**. La regla «descartar buzones de rol» está
  al revés para clínicas pequeñas
- Clínicas · precio por WhatsApp está activa al 5,63% de rebote. Su propia regla dice pausarla; la
  orden de ayer era empujarla. **No se ha tocado**
- Confirmar los 7 dominios de cliente pendientes: Nuria Roure, BelloVinilo, Equipzilla, Eleva
  Academy, Miquel Baixas, Emprende Aprendiendo, Escuela de Nuevos Negocios
- **Cuántos de los 2.467 créditos de Apollo se revelan antes del 14-oct** (ver 1.2)
- Raquel: ¿appointment setter (guion v5, en producción) o discovery (lo que pide su rol nuevo)? Sin
  eso no se toca el asistente de Vapi. La evidencia favorece lo primero: rescatando a Izaskun
  funcionó en 41 segundos; abriendo en frío, de 6 llamadas salió 1 conversación
- Recargar la cuota de ElevenLabs · confirmar si entra la socia de Ana Claros el lunes

---

## 4 · Siguiente entrega

Por el orden del apartado M, y sin plan de 30 días:

**P0.1 DATA** — auditoría campo a campo de los 15 del apartado E con el veredicto EXISTE / FALTA /
HAY QUE MODIFICAR, sin crear nada redundante, más la propuesta de backfill de las 3 ganadas y las 15
perdidas. Con el límite que marca él: recuperar revenue y motivo **solo cuando pueda demostrarse**.
Pista de partida: 14 de las 15 perdidas empiezan por «Meta ·» y se concentran en Reformas y
Formación — las pérdidas no están repartidas por canal.

**Necesito las claves de GHL y Smartlead en el scratchpad para P0.1 y P0.2.** Sin ellas la auditoría
de campos es una lectura de documentos, no una medición, y los 13 clics sin nombre siguen sin nombre.

---

## Reglas que estoy aplicando

Claves solo en scratchpad. Nunca POST de secuencia sobre campaña con leads en curso. Dominios de
cliente y ex cliente fuera. Baja o RGPD: bloquear y pausar sin preguntar y decirlo después, y la
respuesta escrita al RGPD no se manda. Llamadas 10:00-18:00 Europe/Madrid. Nada hacia fuera sin OK.
