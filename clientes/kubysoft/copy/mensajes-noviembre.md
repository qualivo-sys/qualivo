# Kubysoft · mensajes de la tanda de noviembre, por segmento

Estado: **borrador para que Maikel lo revise el 30-oct a las 16:00 y después lo valide
Marc.** No se ha enviado nada ni se ha cargado nada en Smartlead.

Escrito el 29-oct, a partir del acuerdo del 27-oct con Marc (`reunion-27oct.md`):
mensajes con ejemplos concretos frente al Excel (**checklists, partes digitales,
planificación y rutas, y la demo online**), para empresas de 5 a 20 empleados de
climatización, servicio técnico y mantenimiento, fuera de Navarra y Euskadi.

La lista a la que va está en `lista/lista-29oct.csv`. Cada empresa lleva su
segmento, que decide el mensaje, y una primera línea sacada de su propia web.

---

## Lo que manda en este copy

1. **El primer correo termina en pregunta, no en enlace de agenda.** La demo online
   aparece en el tercero, como opción, no como petición. Es como vende Marc ("demos
   online, sin llamadas"), pero en frío el primer paso tiene que ser contestar una
   línea.
2. **Ejemplos frente al Excel, no beneficios.** Cada correo nombra una tarea que hoy
   se hace en papel o Excel, y dice cómo queda en Kubysoft. Nada de "centralizar",
   "digitalizar" ni "optimizar" en el primer correo.
3. **Nunca "somos los únicos".** Lo pidió Kubysoft en el brief. Marc dijo en la
   reunión que son "de los pocos del sector" con checklist dentro del parte; **no lo
   pongo en el copy hasta que Marc confirme que quiere firmarlo así.** Uso solo lo
   que hace el producto.
4. **El único enlace va a la página de SAT**, `kubysoft.com/es/sistema-ERP`, no a la
   portada genérica. Cambiarlo en la campaña actual sigue **pendiente de OK desde el
   27-oct**.
5. **Sin nombre de persona.** La lista lleva solo datos de empresa. Los correos
   empiezan por "Buenas" y van al correo general de la empresa hasta que se
   enriquezca el contacto, que es decisión de Maikel porque gasta créditos.
6. Firma: Marc · Kubysoft. Sin rayas largas, sin "espero que estés bien".

## Variables

| variable | de dónde sale |
|---|---|
| `{{empresa}}` | nombre comercial, limpio de S.L. y similares |
| `{{ciudad}}` | ciudad de su web; si no hay, la frase se queda sin ciudad |
| `{{primera_linea}}` | una frase sobre algo que hemos visto en **su web** (columna `primera_linea` del CSV). Si no hay nada verificable, se usa la frase por defecto del segmento |

La primera línea es lo que hace que no sea una plantilla. Ejemplos reales de la
revisión: "Vi en vuestra web que hacéis contratos de mantenimiento de calderas en
Ávila y Segovia." No se inventa nada: si no está en su web, no va.

## Secuencia, la misma para todos los segmentos

| correo | día | qué hace |
|---|---|---|
| 1 | 1 | primera línea de su web + la tarea concreta + una pregunta |
| 2 | 4 | el ejemplo frente al Excel, en dos líneas, del parte o la ruta |
| 3 | 9 | la demo online de 20 minutos como opción, y se cierra |

Tres correos y no cuatro: con 5 a 20 empleados quien lee es el gerente o el jefe de
técnicos, y un cuarto toque ya molesta.

---

<a id="clima"></a>
## Clima · climatización y calefacción

**Correo 1**

> Asunto: los partes de {{empresa}}
>
> Buenas,
>
> {{primera_linea}}
>
> Os escribo por una cosa concreta: cuando el técnico termina una revisión o una
> avería, ¿el parte lo rellena en el móvil y queda guardado con su firma, o vuelve en
> papel y alguien lo pasa luego a Excel?
>
> Marc · Kubysoft

Primera línea por defecto: *Os he encontrado buscando empresas de climatización
{{en ciudad}} que hacen mantenimiento, no solo instalación.*

**Correo 2**

> Asunto: RE: los partes de {{empresa}}
>
> Un ejemplo de lo que suele pasar con el Excel: el aviso entra por teléfono, se
> apunta en una hoja, el técnico lo lleva en el WhatsApp y el parte vuelve en papel.
> Son cuatro sitios para un mismo trabajo.
>
> En Kubysoft el aviso se asigna al técnico en la agenda, le sale en el móvil con la
> ruta del día, rellena el parte con fotos y firma del cliente, y la oficina lo ve en
> ese momento para facturar.
>
> ¿En {{empresa}} cuántos de esos pasos van todavía a mano?

**Correo 3**

> Asunto: RE: los partes de {{empresa}}
>
> Último correo, prometido.
>
> Si os interesa verlo con vuestros propios avisos, os lo enseño en una demo online de
> 20 minutos, sin instalar nada: kubysoft.com/es/sistema-ERP
>
> Y si lo tenéis resuelto, decídmelo y no os escribo más.
>
> Marc

<a id="frio"></a>
## Frío · refrigeración comercial e industrial

**Correo 1**

> Asunto: el registro de gases de {{empresa}}
>
> Buenas,
>
> {{primera_linea}}
>
> Con gases fluorados hay que dejar registrada la carga y las fugas de cada equipo, y
> eso suele acabar en una hoja aparte que alguien cuadra a final de mes.
>
> ¿Cómo lo lleváis vosotros hoy, con Excel o lo rellena el técnico en el momento?
>
> Marc · Kubysoft

Primera línea por defecto: *Os he encontrado buscando empresas de frío que hacen
mantenimiento de cámaras e instalaciones{{ en ciudad}}.*

**Correo 2**

> Asunto: RE: el registro de gases de {{empresa}}
>
> Lo concreto: en Kubysoft el parte de la revisión lleva un checklist con los valores
> dentro (presión, carga, temperatura, fuga sí o no), y queda guardado en el historial
> de ese equipo.
>
> Así la hoja de final de mes no existe: el registro sale del propio parte que ha
> rellenado el técnico.
>
> ¿Os quitaría trabajo o ya lo tenéis montado de otra forma?

**Correo 3**: el de clima, con asunto `RE: el registro de gases de {{empresa}}`.

<a id="incendios"></a>
## Incendios · protección contra incendios

**Correo 1**

> Asunto: las actas de revisión de {{empresa}}
>
> Buenas,
>
> {{primera_linea}}
>
> Las revisiones trimestrales y anuales del RIPCI hay que dejarlas documentadas, equipo
> por equipo. ¿Hoy el técnico las rellena en papel para pasarlas luego al ordenador, o
> ya lo hace en el móvil y queda guardado?
>
> Marc · Kubysoft

Primera línea por defecto: *Os he encontrado buscando empresas mantenedoras de
protección contra incendios{{ en ciudad}}.*

**Correo 2**

> Asunto: RE: las actas de revisión de {{empresa}}
>
> El ejemplo: un cliente con 40 extintores, 6 BIEs y una central. En Excel son 47
> líneas que alguien copia del papel.
>
> En Kubysoft el técnico abre la revisión en el móvil, le sale el checklist de cada
> equipo del cliente, marca y anota, el cliente firma ahí mismo, y el acta sale hecha.
> La siguiente revisión ya queda en la agenda.
>
> ¿Cómo lo hacéis vosotros?

**Correo 3**: el de clima, con asunto `RE: las actas de revisión de {{empresa}}`.

<a id="legionela"></a>
## Legionela · control de legionela y tratamiento de aguas

**Correo 1**

> Asunto: los parámetros de los controles de {{empresa}}
>
> Buenas,
>
> {{primera_linea}}
>
> En cada control hay que anotar parámetros (cloro, temperatura, pH) y poder
> demostrarlos después en una inspección.
>
> ¿Eso lo lleváis en hojas de Excel o ya lo rellena el técnico en el móvil y queda
> guardado por instalación?
>
> Marc · Kubysoft

Primera línea por defecto: *Os he encontrado buscando empresas de control de
legionela{{ en ciudad}}.*

**Correo 2**

> Asunto: RE: los parámetros de los controles de {{empresa}}
>
> Lo concreto: en Kubysoft el parte del control lleva un checklist con los campos de
> cada parámetro. El técnico los rellena en la instalación y quedan en el historial de
> ese cliente, con fecha y firma.
>
> Cuando llega la inspección, el registro ya está, sin buscar papeles.
>
> ¿Os encaja o lo tenéis resuelto con otro programa?

**Correo 3**: el de clima, con asunto `RE: los parámetros de los controles de {{empresa}}`.

<a id="puertas"></a>
## Puertas · puertas automáticas y muelles de carga

**Correo 1**

> Asunto: los partes de revisión de {{empresa}}
>
> Buenas,
>
> {{primera_linea}}
>
> Con el mantenimiento preventivo repartido por muchos clientes, lo que más cuesta no
> es la visita, es dejarla documentada y que la siguiente no se olvide.
>
> ¿Cómo lo lleváis hoy, papel y Excel, o ya en el móvil del técnico?
>
> Marc · Kubysoft

**Correo 2**: el de mantenimiento, con asunto `RE: los partes de revisión de {{empresa}}`.

**Correo 3**: el de clima, con el mismo asunto.

<a id="mantenimiento"></a>
## Mantenimiento · mantenimiento de edificios e industria, servicio técnico

**Correo 1**

> Asunto: la planificación de los técnicos de {{empresa}}
>
> Buenas,
>
> {{primera_linea}}
>
> Os escribo por una cosa concreta: con preventivos por contrato y averías que entran
> cada día, ¿cómo repartís hoy el trabajo entre los técnicos, con un programa o con
> Excel y WhatsApp?
>
> Marc · Kubysoft

Primera línea por defecto: *Os he encontrado buscando empresas de mantenimiento con
técnicos propios{{ en ciudad}}.*

**Correo 2**

> Asunto: RE: la planificación de los técnicos de {{empresa}}
>
> Un ejemplo: los preventivos del mes en un Excel, las averías en el WhatsApp y la ruta
> de cada técnico en la cabeza del jefe de equipo.
>
> En Kubysoft los preventivos de cada contrato se generan solos en la agenda, la avería
> se asigna al técnico que está más cerca, y cada uno ve su ruta del día en el móvil
> con el checklist de cada visita.
>
> ¿Os pasa algo parecido o lo tenéis ya organizado?

**Correo 3**: el de clima, con asunto `RE: la planificación de los técnicos de {{empresa}}`.

---

## Respuestas tipo

Las de `secuencia.md` siguen valiendo y no se repiten aquí. Dos reglas que no cambian:
**si preguntan precio, se para y se avisa a Marc**; y **cualquier respuesta humana
va a Marc en el día**.

## Lo que falta para enviar

| qué | quién |
|---|---|
| Revisar estos mensajes | Maikel, 30-oct 16:00 |
| Validar mensajes y lista, empresa por empresa | Marc |
| Confirmar si quiere firmar "de los pocos del sector con checklist" | Marc |
| OK para cambiar el enlace a la página de SAT | Maikel |
| Buzones nuevos (ver coste en `lista/resumen-29oct.md`) | Maikel y Marc |
| Cargar en Smartlead y activar | Qualivo, **solo con OK de Maikel** |
