# Agent to Me · Estrategia de outbound

Documento de trabajo. Sustituye al planteamiento inicial de `piloto-gestorias.md`,
que pasa a ser el ICP secundario. Base: lectura de agenttome.io (14-ago-2026) y
datos reales de la máquina de Qualivo (13 campañas, 3.576 envíos medidos).

---

## 1. Qué vendemos exactamente (según la web)

- Promesa central: "Un equipo digital dentro de tu empresa".
- Modelo de impacto que ya está publicado: **32h/semana de trabajo repetitivo →
  8h/semana de supervisión → 24h/semana devueltas al trabajo que factura**.
- Producto estrella con nombre y cara: **Sofía, SDR digital**, integrada con
  LinkedIn, HubSpot, Gmail, Sheets, WhatsApp y Slack.
- Diferenciador declarado: "trabajo digital con un responsable". No vendemos
  software, vendemos trabajo hecho con alguien que responde por él.
- Entrada actual: Company Scan de 2 minutos, autoservicio.
- Activo de contenido: AI Radar semanal.

Lo que NO hay en la web y condiciona el outbound: ni un solo caso, testimonio,
cifra de cliente real ni precio. En frío, eso hay que compensarlo con el
entregable (punto 4), no con adjetivos.

---

## 2. ICP: el hallazgo que cambia el plan

En la máquina de Qualivo hay un dato que vale más que cualquier intuición:
**la campaña Señales (empresas con vacante activa de comercial) es la que mejor
funciona de las trece**. 60% de aperturas, 3 respuestas, y la respuesta más
rápida de la historia de la máquina (13 minutos).

Y resulta que una empresa que publica una vacante de comercial es exactamente
la que está a punto de gastarse 25.000 euros al año en hacer a mano lo que hace
Sofía. No hay que educarla sobre el problema: ya ha decidido que lo tiene y ya
ha decidido pagar por resolverlo. Solo estamos ofreciendo otra forma de hacerlo.

### ICP primario: empresas contratando comercial o SDR
- Señal: oferta de empleo activa para comercial, ventas, SDR o account executive
  en los últimos 10 días.
- Tamaño: 11-200 empleados. Debajo no hay presupuesto, encima hay comité.
- Geografía: España.
- Decisor: fundador, CEO, director general o director comercial. En este tamaño
  el que publica la vacante y el que firma son la misma persona.
- Por qué compra: tiene el dolor cuantificado y el presupuesto ya mentalmente
  asignado. El coste real de un SDR junior en España ronda los 2.000-2.500 euros
  al mes con seguridad social. Ese es nuestro ancla de precio, y viene dado.
- Ventaja operativa: los filtros de Apollo ya están construidos y probados en la
  campaña 3784821. Cero trabajo de infraestructura de datos.

### ICP secundario: gestorías y asesorías
- Pool Apollo: 924 decisores en España, 5-50 empleados.
- Dolor: altas, nóminas, requerimientos y el mismo correo de cliente cien veces.
- Por qué es secundario y no primario: el dolor es real pero difuso. Nadie ha
  puesto fecha ni presupuesto. El ciclo será más largo.
- Lista ya curada: `gestorias_piloto.json`, 38 leads.

### ICP terciario, para la segunda ola
E-commerce con atención al cliente manual (3.471 decisores en Apollo). Mismo
dolor, bandejas más quemadas. Guardar para cuando el mensaje esté validado.

### Descalificadores (no tocar)
- Menos de 10 empleados: no hay volumen repetitivo ni presupuesto recurrente.
- Startups de producto y equipos técnicos: se lo montan ellos.
- Agencias de marketing y consultoras de IA: son competencia o futuros partners,
  no clientes. Van a otra lista y a otra conversación.
- Corporaciones de más de 500: ciclo de compra que no aguanta un piloto.
- Sector público: fuera por licitación.

---

## 3. El mensaje

### Principio rector
No vender IA. Vender **la nómina que no hace falta firmar** y **las horas que
vuelven**. La palabra "IA" no debería aparecer en el primer email: quien vende
IA compite con todos, quien vende trabajo hecho compite con una contratación.

Terminología: "equipo digital" como nombre del producto. "Empleado" se usa solo
como gancho comparativo ("tu próximo empleado no tiene por qué ser humano"),
nunca como nombre de lo que vendemos.

Regla de estilo heredada de Qualivo y aquí innegociable: cero guiones largos,
frases cortas, cero adjetivos de agencia.

### Secuencia ICP primario (vacante de comercial)

**Email 1. Asunto: la vacante de comercial de {{companyName}}**

> Hola {{firstName}},
>
> He visto que estáis buscando comercial. Antes de firmar esa nómina, una idea
> que quizá no te han contado.
>
> Un comercial junior en España cuesta unos 2.500 euros al mes con seguridad
> social, tarda tres meses en ser útil y, según en qué empresa, se va al año.
> Y buena parte de su día no es vender: es buscar contactos, escribir
> seguimientos, actualizar el CRM y perseguir presupuestos.
>
> Esa parte la hacemos con un equipo digital. Trabaja 24/7, no se va, y tu gente
> se queda solo con las conversaciones que de verdad cierran.
>
> Si quieres, analizo cómo funciona hoy vuestro proceso comercial y te digo qué
> parte concreta se puede montar así y cuántas horas os devuelve. Es gratis, no
> hace falta llamada, y con eso decides.
>
> ¿Te lo preparo?
>
> Maikel · Agent to Me

**Email 2 (+3 días). Mismo hilo.**

> {{firstName}}, te dejo el número que suele abrir los ojos.
>
> En las empresas que analizamos, la media es 32 horas semanales de trabajo
> repetitivo en el equipo. Con un equipo digital eso baja a unas 8 horas de
> supervisión. Son 24 horas a la semana que vuelven a facturar, sin ampliar
> plantilla.
>
> El análisis es gratis y te lo mando por email. ¿Lo preparo para
> {{companyName}}?

**Email 3 (+4 días). Cierre.**

> Última vez que insisto, {{firstName}}.
>
> Si ya habéis cubierto la vacante, enhorabuena y encantado igualmente. Si sigue
> abierta, el análisis te sirve igual para decidir qué pedirle a esa persona y
> qué no.
>
> Un "sí" y te lo mando.
>
> PD: cada semana publico el Radar IA, con lo que va saliendo y cómo aplicarlo.
> [enlace pendiente]

### Secuencia ICP secundario (gestorías)
La ya redactada en `piloto-gestorias.md`, con el cambio de "empleado digital" a
"equipo digital" ya aplicado. Ahí el gancho es el papeleo, no la nómina.

### El test que hay que hacer sí o sí: quién firma
- **Rama A, Maikel**: frío clásico.
- **Rama B, Sofía**: el correo lo firma la SDR digital y lo dice en la primera
  línea. El mensaje ES el producto funcionando. Si Sofía escribe bien y gestiona
  la respuesta, la demo ya está hecha antes de la llamada.

Rama B es arriesgada y por eso se testea en pequeño. Se mide por Scans pedidos,
no por respuestas totales, porque la curiosidad no es intención.

---

## 4. Lead magnet: el Plan de Equipo Digital

El Company Scan de 2 minutos es un buen gancho de web, pero en frío es
insuficiente: es autoservicio, genérico y no demuestra nada. Para outbound hace
falta algo que se entregue hecho, personalizado y sin pedir nada a cambio.

### Qué es
Un documento de una página por empresa, entregado en 48 horas, gratis y sin
llamada previa. Se llama **Plan de Equipo Digital**.

### Qué contiene, en este orden
1. **Las cinco tareas repetitivas que hemos detectado en su empresa**, por rol y
   con nombre concreto. No "gestión comercial", sino "responder la solicitud de
   presupuesto que entra por la web". Se sacan de su web, su LinkedIn, sus
   ofertas de empleo publicadas y su stack visible.
2. **Las horas que se van**, con el cálculo a la vista y las suposiciones
   declaradas. Preferible quedarse corto y que lo corrijan al alza.
3. **Cuál sería el primer agente y qué haría el día 1**, hora a hora. Este es el
   apartado que vende. Debe leerse como la descripción del puesto de alguien que
   empieza el lunes.
4. **Qué se queda con las personas**, explícitamente. Quita el miedo y sube la
   credibilidad: nadie se cree que una máquina lo hace todo.
5. **Las horas devueltas y qué se puede hacer con ellas**, traducido a su
   negocio, no a porcentajes.
6. Una sola línea de siguiente paso: si quiere, montamos ese primer agente.

### Qué NO lleva
Ni precios, ni condiciones, ni propuesta comercial, ni logos de clientes que no
existen todavía. El documento tiene que poder reenviarse dentro de la empresa
sin que parezca una oferta.

### Por qué funciona
- Es el mismo mecanismo de la "radiografía" que ya usa Qualivo en sus campañas
  personalizadas, y ahí el paso 2 de la secuencia es el que trae respuestas.
- Regala trabajo real antes de pedir nada, que es justo lo que compensa la falta
  de casos en la web.
- Es una demo encubierta: si el Plan lo produce mayormente un agente nuestro,
  hemos demostrado el producto entregando el producto.

### Cómo se produce sin morir en el intento
Este entregable solo escala si lo monta un agente. Primera versión con
intervención tuya en la revisión final, objetivo a 30 días: agente que investiga
(web, LinkedIn, ofertas, stack), redacta el borrador y te lo deja para revisar en
diez minutos. Ese agente es además el primer caso de estudio de Agent to Me.

### Escalera de compromiso
Company Scan de 2 minutos (autoservicio, web) → Plan de Equipo Digital (48h,
outbound) → montar el primer agente (venta) → equipo digital creciendo (recurrente).
El Radar IA queda como salida para el que no quiere nada de lo anterior todavía.

---

## 5. Infraestructura: el cuello de botella real

Revisado hoy, 14-ago:

- **Mailerfind: 0 buzones conectados.** No hay canal de email ahí.
- **HeyReach: 1 sola cuenta de LinkedIn** (maikel.mef), ya ocupada con el piloto
  Lanzadera de Qualivo y con el límite de invitaciones en 18 al día.
- **Smartlead: 15 buzones sanos**, pero son dominios de Qualivo y su capacidad
  está comprometida con las campañas actuales.

Consecuencia: hoy no se puede lanzar Agent to Me sin tomar una de estas tres
decisiones.

1. **Dominio hermano y buzones nuevos** (recomendado). Comprar un dominio
   parecido a agenttome.io, dos buzones, y arrancar warmup ya. Son dos o tres
   semanas de reloj, así que cuanto antes empiece, antes se lanza. Protege el
   dominio principal de la web.
2. **Enviar desde los buzones de Qualivo**. Rápido y sin coste, pero mezcla
   marcas y roba capacidad a las campañas que ya funcionan. Aceptable solo para
   un piloto de 30 leads.
3. **Segunda cuenta de LinkedIn**. Si hay otra persona en el equipo dispuesta a
   prestar su perfil, LinkedIn se puede arrancar esta misma semana sin esperar
   al warmup del email.

---

## 6. Plan de arranque propuesto

**Semana 1**
- Comprar dominio hermano y dos buzones. Warmup en marcha el mismo día.
- Sacar de Apollo 40 empresas con vacante de comercial activa (filtros ya hechos).
- Producir 5 Planes de Equipo Digital a mano, para calibrar el formato antes de
  automatizarlo.
- Alinear la web: hoy dice "empleados digitales" y el outbound dirá "equipos
  digitales". Que el lead que hace clic no aterrice en otro idioma.

**Semana 2**
- LinkedIn arranca si hay segunda cuenta.
- Test A/B de remitente, Maikel contra Sofía, 20 leads por rama.

**Semanas 3 y 4**
- Email empieza a enviar con los buzones ya calientes.
- Medir y decidir escalado.

### Cuándo sabremos si funciona
- Respuestas por encima del 5% en email o del 10% sobre aceptadas en LinkedIn.
- Al menos 8 Planes solicitados sobre 40 contactos.
- Y el único número que importa de verdad: **una primera venta de un agente en
  60 días**. Sin eso, el resto son métricas de vanidad.

---

## 7. Lo que necesito de Maikel para ejecutar

1. Decisión de infraestructura de email (opción 1, 2 o 3 del punto 5).
2. Si hay segunda cuenta de LinkedIn disponible.
3. Precio de referencia del primer agente, para saber contra qué anclamos. La
   propuesta natural es anclarlo contra la nómina que sustituye, pero el número
   lo pones tú.
4. Dónde vive el Radar IA, para poner el enlace en los cierres.
