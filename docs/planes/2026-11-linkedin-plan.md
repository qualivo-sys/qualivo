# LinkedIn · plan de noviembre

Para el Chief of Staff, con copia a Paid y a Outbound. Pedido el 29-oct, entrega antes del
viernes 30 a las 8:00. **Entregado el 29-oct.**

Nada reactivado: las campañas siguen pausadas hasta que Maikel lo confirme en el ritual de las
9:00. Etiquetas: **[C]** confirmado · **[E]** estimación · **[H]** hipótesis.

---

## 0 · Lo que hay que resolver antes de que este plan exista

**HeyReach sigue devolviendo 0 cuentas de LinkedIn conectadas** [C, API, comprobado hoy y los
días 19, 23, 25, 26, 27 y 28-oct; el 2-oct devolvía 1]. Van **27 días**.

La decisión de no cancelar es de facturación. **Esto es otra cosa**: aunque la suscripción siga
pagada, con 0 cuentas vinculadas no se puede enviar una sola invitación. Si el 2-nov seguimos
así, noviembre empieza con el canal muerto y los 62 €/mes se pagan por nada.

> **Lo único que hace falta:** que alguien entre en HeyReach y vuelva a vincular la cuenta de
> LinkedIn de Maikel. No lo puedo hacer yo desde la API.

---

## 1 · Tres correcciones a los datos del encargo

### 1.1 · No son 24 respuestas sin leer. Son 8, y solo 1 está viva

Medido hoy sobre las 191 conversaciones de todas las campañas [C]:

| | |
|---|---:|
| Conversaciones totales | 191 |
| Con alguna respuesta del prospecto | 28 |
| **Cuyo último mensaje es suyo (esperan respuesta)** | **8** |
| Marcadas «sin leer» en HeyReach | 5 |

Y de esas 8: **4 son solo un emoji**, **2 son cierres o rechazos** («no lo llevo yo», «no
invertimos 1 €»), **1 es la del CEO de servicios jurídicos** que sigue abierta desde el 3-oct, y
**1 es un bloqueo** (§1.2).

No encuentro ningún corte de los datos que dé 24. Si el 24 sale de otra fuente, decidme cuál y lo
cruzo; si sale de aquí, el número bueno es 8, y el trabajo real es **una** conversación.

### 1.2 · Hay un bloqueo contra la cuenta de Maikel, y nadie lo había registrado

El 22-sep una prospecta **bloqueó a Maikel**. Es importante para el punto 3 y para todo el plan,
así que pongo la secuencia entera:

| Fecha | Qué pasó |
|---|---|
| 24-ago | Acepta la conexión: *«Estaré encantada de conectar si no es para que me vendas nada ;)»* |
| 25-ago | Le respondemos: *«Trato hecho… me lo tomo en serio: nada de venta»* |
| 25-ago | Conversa bien y explica que no encajan: CRM + ERP desde hace 6 años, cuadro de mando en Power BI desde hace 3, contabilidad analítica. *«Vamos bien en ese sentido ;)»* |
| 2-sep | Le entra un correo automático de la secuencia: *«Supongo que lo tenías sistematizado y no me sacaste del funnel a pesar de que teníamos un trato. Una pena»* |
| 22-sep | Pedimos perdón: *«Ya está hecho y no te va a volver a llegar nada»* |
| 22-sep, **12 minutos después** | *«Hoy me ha entrado otro. Ya estás bloqueado. No me entrarán más ;)»* |

Prometimos sacarla, pedimos perdón, y **el mismo día le salió otro correo**. Está etiquetada
«Interested», que es el tercer falso positivo del autoetiquetador.

**Esto no es anécdota: es el riesgo del plan de noviembre hecho realidad.** El encargo pide
tocar a las mismas personas por correo y por LinkedIn. Esa es exactamente la situación en la que
se rompió aquí.

### 1.3 · Reformas contradice una decisión escrita

El encargo pide cuentas de **reformas** y formación. Sobre reformas, lo que hay medido
(`estrategia/mapa-sectores-29sep.md`) [C]:

> 14 diagnósticos, **0 de nivel A**. Clínicas: 6 diagnósticos, 3 de nivel A.
> «**Se aparca Reformas para frío.** Que siga entrando por anuncios si es barato, pero no se le
> dedica ni un envío en frío hasta que dé un A.»

No me opongo: puede que la Biblioteca de Meta seleccione mejor que el canal que produjo esos 14.
Pero es un cambio de una decisión documentada y **merece ser una decisión consciente, no un
arrastre**. Si se mantiene, propongo medir reformas y formación por separado desde el día 1, para
que el 30-nov se pueda leer cuál de las dos trajo la reunión.

---

## 2 · Cuentas: Biblioteca de anuncios de Meta

**Me parece la mejor señal que hemos usado nunca, y lo digo con motivo.** Es pública, fechada y
**el prospecto puede comprobarla**. Es justo lo contrario del píxel: aquel nos hizo afirmar un
gasto que no existía y nos costó un desmentido por escrito el 1-oct.

Si un anuncio está activo en la Biblioteca, está activo. No hay inferencia.

| | Criterio |
|---|---|
| Fuente | Biblioteca de anuncios de Meta, España |
| Señal | Anuncios activos **30 días o más** (es el criterio que ya usa Outbound) |
| Sectores | Formación y reformas, **etiquetados por separado** |
| Persona | Dueño, gerente o director general. Entra `filtro_fit.py`, que sobre la campaña de septiembre descartaba 16 de 60 (26 %) por cargo [C] |
| Descartes | Los 6 dominios bloqueados de siempre · agencias que anuncian por sus clientes · franquiciados |
| Volumen | **40 cuentas en noviembre**, no más: cada una se verifica a mano |

**El cuello no es LinkedIn, es la verificación manual.** Sin Sales Navigator (`isValidNavigator:
false` [C]) el tamaño y el equipo se miran uno a uno.

---

## 3 · Coordinación con Outbound · y por qué pido un orden distinto

El encargo pide que la misma persona reciba correo y LinkedIn sin duplicar mensajes. **Hoy eso no
se puede garantizar**, y el caso de §1.2 es la prueba.

Lo que falta, en concreto: HeyReach y Smartlead **solo comparten el dominio** [C], y **esta sesión
no tiene la clave de Smartlead** [C], así que no puedo leer qué correo ha salido ni a quién, ni
honrar una baja pedida en el otro canal.

**Propongo invertir el orden de las dos primeras semanas:**

| Semana | Qué |
|---|---|
| **2 al 6-nov** | Montar el cruce: una lista compartida con **el dominio como clave**, un dueño por cuenta, y una columna de «no volver a contactar» que los dos canales respeten. Media jornada de trabajo. **Necesita la clave de Smartlead.** Cero envíos |
| **9 al 13** | Las 40 cuentas verificadas y cargadas. Empiezan las invitaciones |
| **16 al 27** | Secuencia en marcha |
| **30** | Medición contra la vara: ≥1 reunión celebrada con encaje |

Enviar antes de tener el cruce es repetir lo de María con 40 personas nuevas. **Una semana de
preparación dentro de un mes de plazo me parece barato comparado con eso.**

**Regla que propongo para los dos canales, de aplicación inmediata:** si alguien pide no recibir
más, sale de los dos sistemas el mismo día y queda en la lista de exclusión. Hoy esa lista no
existe.

---

## 4 · Volumen diario seguro

| | Dato | Tipo |
|---|---|---|
| Configurado en HeyReach | **18 invitaciones/día** | [C, API] |
| Máximo configurable | 40/día | [C] |
| Ritmo real sostenido en septiembre | 18-24/día, 10 días hábiles, sin activarse ningún cooldown | [C] |
| Cooldowns activos ahora | ninguno | [C] |
| **Bloqueos conocidos contra la cuenta** | **1**, del 22-sep | [C] |

**Propongo 10 invitaciones/día**, no 18, por tres razones:

1. **Hay un bloqueo.** Los bloqueos y las denuncias son lo que restringe cuentas, no el volumen en
   sí. Con uno encima, conviene ir por debajo del límite, no al borde.
2. **La cuenta de Maikel es la única que hay** [C]. Si LinkedIn la restringe, no hay plan B: se
   cae el canal y su perfil personal a la vez.
3. **40 cuentas en el mes son 10/día durante dos semanas.** El volumen no es la restricción: lo es
   la verificación a mano.

Con 10/día y 40 cuentas: ~20 aceptaciones [E, al 49 % histórico] y ~16 conversaciones [E]. Para
sacar 1 reunión de ahí hace falta una tasa de respuesta muy por encima del 3,6 % histórico. **Lo
digo claro: la vara del 30-nov es exigente con este volumen.** Si se quiere más probabilidad, la
palanca no es subir invitaciones: son las 26 cuentas ya aceptadas del triaje, que cuestan cero.

---

## 5 · Copy v2 conversacional, sin precios

La regla que sale del 1-oct y que no se negocia: **la primera línea dice lo que se vio, no lo que
se dedujo**, y la pregunta deja las dos salidas abiertas para que «no es nuestro caso» sea una
respuesta válida.

**Invitación:** sin nota. La pregunta no cabe en 300 caracteres y partirla la deja coja.

**Mensaje del día 4, formación:**

> {Nombre}, vi que tenéis anuncios activos de {programa} desde hace unas semanas.
>
> Cuando una campaña aguanta ese tiempo suele ser porque trae solicitudes. Lo que casi nunca está
> medido es cuántas de esas acaban en matrícula y dónde se caen las demás.
>
> ¿Eso lo tenéis a mano o es de las cosas que nunca hay tiempo de mirar?

**Mensaje del día 4, reformas:**

> {Nombre}, vi que lleváis semanas con anuncios activos en Meta.
>
> En reformas lo que suele atascarse no es que entren solicitudes: es que para presupuestar hay
> que ir a ver la obra, y el día no da para todas.
>
> ¿Cómo decidís a cuál vais primero?

**Segundo mensaje (día 8), común:**

> Por si te sirve aunque no hablemos. El caso que mejor lo explica es de una escuela de formación,
> así que el sector puede no ser el vuestro, pero el problema sí: medían hasta el lead y pasaron a
> medir hasta la venta real.
>
> https://qualivo.io/casos/eac/
>
> Y si en algún momento quieres que mire el vuestro, son quince minutos. Si no toca, sin problema.

Sin precios, sin IA, sin CRM, sin agentes: son medios. El posicionamiento es el aprobado —
*«ya inviertes en captar; te ayudamos a ver dónde se pierden las oportunidades»*— dicho sin
soltar el eslogan.

---

## 6 · Las 8 que esperan respuesta

| Cuántas | Qué son | Qué propongo |
|---|---|---|
| 1 | CEO de servicios jurídicos, 3-oct, **la única viva** | El borrador está entregado desde el 27-oct. Lo manda Maikel |
| 1 | **El bloqueo** | **Nada.** Pidió que no le entrara nada más y nos bloqueó. Entra en la lista de exclusión y no se vuelve a tocar, por ningún canal |
| 2 | Cierres y rechazos | Nada. Cerrados |
| 4 | Solo un emoji | Nada automático. Un emoji no es intención y no merece un mensaje de seguimiento |

**Total de trabajo real: un mensaje**, y ya está escrito.

Aparte de esas 8, lo que sí tiene valor son **las 26 cuentas del triaje de las 84** que merecen
mensaje y ya aceptaron en su día: coste de invitación cero, y es la palanca más barata para la
vara del 30-nov.

---

## 7 · Resumen para Paid, que está recalculando el embudo

Lo que puede meter en su hoja, con su etiqueta:

| Dato | Valor | Tipo |
|---|---|---|
| Coste de LinkedIn | 62 €/mes | [C, dado por CoS] |
| Cuentas nuevas en noviembre | 40 | propuesta |
| Invitaciones/día | 10 | propuesta |
| Aceptación esperada | ~49 % → ~20 | [E, histórico] |
| Conversaciones esperadas | ~16 | [E] |
| Tasa de respuesta histórica | **3,6 %** | [C, 90 días] |
| Reuniones de LinkedIn en 90 días | **0** | [C] |
| Palanca extra sin coste | 26 cuentas ya aceptadas | [C, triaje] |

**Para que el embudo le cuadre:** con el histórico, 16 conversaciones dan menos de una respuesta
positiva. Si la cuenta de 2 clientes necesita que LinkedIn aporte una reunión, la apuesta no está
en el volumen nuevo sino en que la señal de la Biblioteca de Meta y el filtro de cargo muevan la
tasa. **Eso es hipótesis, no previsión**, y por eso la vara del 30-nov me parece bien puesta.

---

## 8 · Lo que necesito, y lo que no puedo hacer

1. **Reconectar la cuenta en HeyReach.** Sin esto no hay noviembre. 27 días.
2. **La clave de Smartlead**, para montar el cruce de la semana del 2. Sin ella, la coordinación
   que pide el encargo no se puede garantizar, y el caso de §1.2 dice lo que pasa entonces.
3. **Confirmar reformas** a sabiendas de que contradice el mapa de sectores (§1.3).
4. **De dónde sale el 24**, si no es de aquí.

**Aviso de transporte:** no puedo mandar esto a Paid ni al Chief of Staff. Esta sesión no expone
`send_message` del MCP de Claude Code Remote y `SendMessage` no alcanza esas sesiones [C]. Queda
en esta rama y en `bus/out/linkedin.jsonl`. Si Paid lo necesita antes del viernes, alguien tiene
que pasárselo a mano.
