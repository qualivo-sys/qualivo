# Anexo al rol del Orchestrator · qué se puede ejecutar hoy y qué no

Medido contra Smartlead, GoHighLevel, HeyReach y Vapi el 1-oct-2026. El rol es correcto en el
diseño; lo que sigue es el estado del terreno sobre el que tiene que operar.

---

## 1 · La métrica maestra apunta a un campo vacío

El apartado 26 pone **REVENUE** en la cima y pide calcular `REVENUE / 1.000 PROSPECTS`. Comprobado en
el pipeline Prospección:

| | |
|---|---|
| Oportunidades ganadas | **3** (Kubysoft, Adigital, Antic Barcelona 113) |
| Valor monetario registrado en esas 3 | **0 €** |
| Oportunidades perdidas | 15 |
| **Perdidas con motivo estructurado** | **0 de 15** |
| Valor en las 48 abiertas | 31.950 € |

**No existe ni un euro de revenue registrado en el CRM.** Las tres ganadas tienen
`monetaryValue = 0`. La métrica maestra del rol **no se puede calcular hoy**, ni por ICP ni por canal
ni por nada: el denominador existe y el numerador no.

Y el apartado 23 (closed-loop learning) pide aprender del motivo de pérdida. **Las 15 perdidas no
tienen motivo.** El campo no existe como campo estructurado. Hoy el bucle de aprendizaje tiene cero
entradas.

> **Lo primero que hay que construir no es orquestación, son dos campos: `revenue` y `lost_reason`.**
> Sin ellos, los apartados 21, 22, 23 y 26 son decorativos.

Un dato que sí sale y es útil: **14 de las 15 perdidas empiezan por «Meta ·»**, o sea vienen de
anuncios, y se concentran en Reformas y Formación. Las pérdidas no están repartidas por canal.

## 2 · El Single Source of Truth pide 24 campos; hoy faltan los que deciden

El apartado 4 lista 24 campos por contacto. Estado real sobre 1.128 contactos de GHL:

| Campo del rol | Estado hoy |
|---|---|
| `signal`, `hypothesis`, `message angle` | existen a veces, en notas de texto libre, no como campo |
| `email status` / `LinkedIn status` / `call status` | **no existen** como campos; hay etiquetas sueltas |
| `next best action` | **no existe** |
| `reply classification` | parcial: 18 de 46 respuestas de septiembre llegaron al CRM (**61% se perdió**) |
| `show/no-show` | parcial, por etiquetas |
| `lost reason` | **no existe** (0 de 15) |
| `revenue` | **existe y está a cero** |
| canal de origen | **ausente en el 82% de las citas** |

El rol dice *«ningún agente debería actuar ignorando el estado del CRM»*. Hoy el CRM no sabe lo
suficiente como para que ignorarlo sea el problema.

## 3 · El Event Contract no tiene por dónde circular

El apartado 5 define 19 eventos. Hoy **no hay bus de eventos y no hay webhooks entre herramientas**:

- Smartlead **no notifica** a GHL. Las respuestas se detectan **barriendo la API cada hora**.
- HeyReach y Smartlead **no se hablan**. El único campo común es el dominio de la empresa.
- Vapi escribe en GHL solo porque el agente copia el resumen a mano.
- Los dos workflows «Aviso cita Qualivo» de GHL **están en borrador y nunca se publicaron**, por eso
  existe una rutina horaria que avisa de los diagnósticos nuevos: GHL no avisa.

Consecuencia operativa: los eventos se pueden **derivar por sondeo**, no recibir. `EMAIL_REPLIED` se
puede detectar con un retardo de hasta una hora. `EMAIL_CLICKED` igual. `NO_SHOW` no se puede
detectar automáticamente de ninguna forma hoy.

**Eso no invalida el Event Contract: lo convierte en una tabla de estado derivada por sondeo en vez
de un flujo de mensajes.** Es implementable, pero conviene escribirlo así y no prometer tiempo real.

## 4 · Las Stop Conditions ya han fallado en producción, con nombre y apellido

El apartado 7 es el que más urge, y no es teórico. El caso exacto que describe ya pasó:

**María Carrascal (Emana Formación)** aceptó conectar en LinkedIn con la condición *«si no es para que
me vendas nada»*. Se le prometió que no. Le entró un correo de secuencia. Se le pidió perdón por
escrito —*«ya está hecho y no te va a volver a llegar nada»*— y **doce minutos después escribió «hoy
me ha entrado otro. Ya estás bloqueado.»**

La disculpa no la sacó de la secuencia porque **no había ningún mecanismo que conectara una promesa
hecha en LinkedIn con la lista de Smartlead.** Eso es exactamente el apartado 7, y es la prueba de que
hace falta.

Hay más, en el histórico de 108 respuestas humanas: **17 personas pidieron parar** y **4 escalaron**
(«Reportado LOPD», respuesta del delegado de protección de datos con expediente, «¿sabes que esto es
ilegal?», «ya está bien con el fishing»). Al auditarlas el 1-oct, **4 de las 17 no estaban dadas de
baja de verdad.** Ya lo están.

## 5 · La Hot Queue: lo que de verdad hay en cada prioridad hoy

| Prioridad del rol | Cuántos hay hoy | Nota |
|---|---|---|
| **P1 · Positive reply sin reunión** | **~15** | De ~18 respuestas con interés real del histórico, 3 acabaron en reunión |
| **P2 · No-show recuperable** | al menos 2 | Una cita cancelada el 30-sep (Renato) y una que no se conectó y hubo que rescatar con llamada (Izaskun) |
| **P3 · Click + ICP alto** | **34** | Los clics de las campañas de líneas de servicio. **Varios con 0 respuestas** |
| **P4 · Múltiples señales + ICP alto** | no calculable | Requiere el scoring unificado, que aún no existe |
| **P5 · Oportunidad abierta sin actividad** | de 48 abiertas | Habría que medir última actividad por oportunidad |
| **P6 · Lead nuevo A+** | 32 en curso | Formación · Intelligence, cargados el 1-oct |

**P1 y P3 se pueden construir hoy mismo.** P4 depende del scoring. P5 requiere una consulta nueva.

## 6 · El Click Recovery del apartado 18: ya hay un hallazgo

El rol pide tratar los clics sin reserva como cohorte. Medido:

| | Envíos | Clics | Tasa de clic | Respuestas |
|---|---:|---:|---:|---:|
| Campañas de líneas de servicio (7) | 485 | **34** | **7,0%** | 9 |
| Media de septiembre | 4.500 | 15 | **0,33%** | 46 |

**El ángulo de líneas de servicio genera 21 veces más clics que la media.** Y dentro de esas siete
campañas hay dos casos que son exactamente la cohorte del apartado 18:

- **Gestorías · Piloto: 78 envíos, 10 clics, 0 respuestas**
- **Administradores de fincas: 39 envíos, 3 clics, 0 respuestas**

Trece personas fueron al enlace y **ninguna respondió ni reservó.** Como dice el rol, no hay que
asumir que es el copy: el copy consiguió el clic. El problema está después del clic, y nadie lo ha
mirado. **Es la señal más fuerte que hay en los datos de Qualivo ahora mismo.**

## 7 · El scoring único resuelve una contradicción real

El apartado 9 elimina los scorings contradictorios, y hace falta porque **hoy hay dos y son
incompatibles**: el Growth Score 0-50 con 10 variables del Outbound Brain, y el Qualivo ICP Score
0-100 con 11 señales del ICP Operating System. Un contacto etiquetado `nivel-a` o `nivel-c` en el CRM
**no dice con cuál se puntuó.**

Aviso práctico: el FIT/SIGNAL/ECONOMICS/ACCESS 0-10 es el **tercer** sistema. Hay que **remapear las
etiquetas existentes** o seguirá sin significar nada. Y de las 11 señales del score anterior, solo 4
se podían puntuar gratis y a escala; conviene comprobar lo mismo con las cuatro dimensiones nuevas
antes de adoptarlas.

## 8 · Las tres cohortes de octubre cambian el reparto de Apollo

El apartado 13 fija **Formación, Multiservicio B2B y Clínicas**. Eso **contradice el reparto vigente
de los 2.467 créditos**, que es por seis motores:

| Motor | Créditos asignados | ¿Sigue en octubre? |
|---|---:|---|
| Formación | 850 | **sí, cohorte A** |
| Servicios B2B | 550 | **sí, si se entiende como Multiservicio (cohorte B)** |
| Clínicas | 380 | **sí, cohorte C** |
| Reformas | 280 | **no** |
| SaaS | 140 | **no** |
| Inmobiliario | 100 | **no** |

Quedan **520 créditos liberados** de Reformas, SaaS e Inmobiliario. Y el apartado 14 pide 100-150
contactos por hipótesis: **tres cohortes son 300-450 créditos**, de los 2.467 disponibles. Sobra
presupuesto de enriquecimiento. **El cuello no es Apollo.**

Dato relevante para la cohorte C: **solo existen 553 decisores localizables en Clínicas en toda
España.** Una cohorte de 150 consume el 27% del universo del vertical.

Y para la cohorte B: Multiservicio **no estaba en ningún motor**, pese a que el Outbound Brain lo
declara patrón ganador. Esta cohorte lo arregla.

## 9 · El cuello, según el orden del apartado 27

El rol dice *«no optimices el paso 4 si el paso 2 está roto»*. Aplicando su propio orden:

| # | Tramo | Estado |
|---|---|---|
| **1** | **DATA** | **ROTO.** 40% de los envíos sin tracking de apertura · 82% de citas sin canal · 61% de respuestas sin llegar al CRM · 0 revenue · 0 lost reason |
| **2** | **DELIVERABILITY** | **ROTO.** goqualivo.com y gotqualivo.com en SURBL = 275 de 525 correos/día, el **52%** |
| 3 | TARGETING | mejorable: 6 de 39 leads mal dirigidos en la última carga (15%) |
| 4 | MESSAGE | el copy por lead rinde 2,24% frente a 0,48% del genérico. **Funciona** |
| 5 | OFFER | ~1.200 € + 750-1.000 €/mes. 3 ganadas, 15 perdidas sin motivo |
| 6 | REPLY → MEETING | **~18 positivas → 3 reuniones.** Flojo y es el KPI del apartado 19 |
| 7 | MEETING → SHOW | 11 citas en 12 días, 1 cancelada, 1 rescatada por llamada |
| 8 | SHOW → SQL | no medible: no hay campo de cualificación |
| 9-10 | SQL → PROPOSAL → SALE | no medible: no hay revenue ni motivo de pérdida |

**Los dos primeros pasos están roto los dos.** Por la propia regla del rol, no se debe tocar mensaje
ni oferta ni volumen hasta arreglar datos y entregabilidad. Eso coincide con el apartado 28 (P0
DELIVERABILITY, P0 ATTRIBUTION) y con la semana 1 del plan de 30 días.

## 10 · Un conflicto de gobernanza que hay que resolver antes de arrancar

El apartado 1 dice que el Orchestrator decide **«qué oferta utilizar»**, **«cuándo escalar»** y
**«cuándo enviar una cuenta a ventas»**.

La regla vigente de Maikel, repetida en el Outbound Brain (apartado 16) y en las rutinas diarias, es
que **las decisiones de dinero y de copy son suyas** y que **no se activa nada sin su OK**.

Las dos cosas no pueden ser verdad a la vez. **Hay que decidir cuál gana**, y lo razonable es acotar:
el Orchestrator decide priorización, canal, orden, secuencia y paradas sin preguntar; **precio,
oferta nueva y copy nuevo siguen necesitando el OK de Maikel.** Pero eso tiene que estar escrito,
porque tal como está el apartado 1, el agente tendría autoridad sobre el precio.

---

## Lo que yo haría la primera semana, en este orden

1. **Crear los dos campos que faltan en GHL: `revenue` y `lost_reason`.** Y rellenar las 3 ganadas y
   las 15 perdidas hacia atrás, que son 18 registros y se hacen en una tarde. Sin esto no hay
   aprendizaje de ciclo cerrado ni métrica maestra.
2. **Resolver SURBL en los dos dominios.** Es el paso 2 del cuello y bloquea cualquier escalado.
3. **Activar el tracking de aperturas en todas las campañas** y poner el canal como campo obligatorio.
   Coste cero, es configuración.
4. **Construir la Hot Queue con P1 y P3 solamente**, que son las dos que ya tienen datos: ~15
   positivas sin reunión y 34 clics sin reserva. Eso es trabajo para ventas desde el primer día.
5. **Investigar los 13 clics con 0 respuestas** de Gestorías y Fincas. Mirar a dónde llevaba el
   enlace y qué pasó en el calendario.
6. **Implementar las stop conditions como tabla de estado derivada por sondeo**, no como bus de
   eventos, porque no hay webhooks. Y que la primera regla sea la que falló con María Carrascal:
   una promesa de no contactar hecha en cualquier canal bloquea en todos.
