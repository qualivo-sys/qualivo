# Kubysoft · secuencia del piloto

Estado: **borrador, sin aprobar**. Pendiente de revisión de Maikel y después de
Marc. No sale un solo mensaje de aquí hasta que las dos estén hechas.

Escrito el 2-oct. El buzón `hola@kubysoft.es` está caliente hacia el 15-oct, que
es el día 1.

---

## Por qué hay dos versiones

Falta decidir **a qué cargo se escribe**, y es lo único que bloquea cerrar el
copy. En una empresa de clima de 5 a 50 empleados el gerente firma, pero quien
pelea la planificación de técnicos suele ser el responsable de servicio. No les
duele lo mismo.

Así que están las dos escritas. Marc elige señalando una, no contestando una
pregunta abstracta.

| | A · responsable de servicio | B · gerente |
|---|---|---|
| Qué le duele | El día a día: avisos, planificación, partes, material | El dinero y el control: margen, coste administrativo, no ver el negocio |
| Qué promete el mensaje | Que la cadena vaya sola | Saber qué deja cada mantenimiento |
| Riesgo | Puede no tener presupuesto | Puede no conocer el problema de cerca |

## Las reglas que obedece este copy

Salen del brief y de lo que dijo Kubysoft, no de preferencias de estilo:

1. **Nada de casos de éxito ni mención a otros clientes.** Lo pidió Marc y además
   no tenemos referencias de clima (de cinco nombres que dieron, solo
   Tratamiento y Producción de Aire es del sector).
2. **Nunca decir que son los únicos en nada.** AppSAT, KiDOO, SADI y Fecsys
   presentan hoy una propuesta integrada parecida. Lo avisó Kubysoft.
3. **El ángulo es centralizar la operativa, no digitalizar partes.** Cita literal
   de Marc: *"No queremos sustituir únicamente el programa con el que haces los
   partes. Queremos centralizar la operativa de la empresa y automatizar los
   procesos que todavía dependen de personas, Excel, WhatsApp o diferentes
   aplicaciones."*
4. **Ningún mensaje pide una demo.** Su filosofía es entender primero cómo
   trabaja la empresa, porque enseñar un ERP entero sin contexto es
   contraproducente.
5. **Todos acaban en pregunta abierta**, y la pregunta es la que Kubysoft quería
   que hiciera prospección: averiguar qué procesos siguen fuera del sistema.
6. **Sin rayas largas, sin "espero que estés bien", sin "quería ponerme en
   contacto".**

## La personalización: tres cubos, no una plantilla

La primera línea sale de algo que de verdad hemos mirado en su web. Son los tres
casos que dan los datos de los 139:

| cubo | cuántos | de dónde sale |
|---|---|---|
| **WhatsApp** | 41 | tienen `wa.me` o la API de WhatsApp puesta en la web como canal de contacto |
| **CRM** | 2 | se les detecta HubSpot u Odoo |
| **Ficha de Google** | 96 | el resto. Se usan reseñas y nota, que es lo único verificable que tenemos |

Variables disponibles por lead: `{{empresa}}`, `{{ciudad}}`, `{{resenas}}`,
`{{nota}}`, `{{nombre}}` (cuando se consiga; si no, el correo va sin nombre y
empieza por "Buenas").

---

# Versión A · responsable de servicio

## Correo 1 · día 1

**Asunto** (uno por cubo, todos en minúscula y sin la palabra Kubysoft):

- WhatsApp: `los avisos de {{empresa}}`
- CRM: `lo de después del CRM`
- Google: `una pregunta sobre {{empresa}}`

**Cuerpo, cubo WhatsApp:**

> Buenas {{nombre}},
>
> Soy Marc, de Kubysoft. Vi que en {{empresa}} los avisos entran por WhatsApp.
>
> Os escribo porque es donde se suele romper la cadena: el aviso entra por ahí,
> el parte se hace aparte, el material se apunta en otro sitio y la factura sale
> días después.
>
> No vengo a venderos un programa de partes. Lo que hacemos es que esa cadena
> vaya sola, del aviso al cobro.
>
> ¿Cómo lo lleváis ahora, con un programa o con Excel y WhatsApp?
>
> Marc

**Cuerpo, cubo CRM:**

> Buenas {{nombre}},
>
> Soy Marc, de Kubysoft. Mirando vuestra web vi que lleváis el comercial con
> HubSpot, que es más de lo que hace la mayoría del sector.
>
> Justo por eso escribo. En empresas ya organizadas el hueco no suele estar en
> captar, sino en lo que viene después: el aviso, el técnico, el material y la
> factura siguen en herramientas distintas del CRM.
>
> ¿En {{empresa}} eso está conectado o va por separado?
>
> Marc

**Cuerpo, cubo ficha de Google:**

> Buenas {{nombre}},
>
> Soy Marc, de Kubysoft. Os he encontrado por {{ciudad}}, con {{resenas}}
> reseñas y un {{nota}}, así que de trabajo no os falta.
>
> Os escribo por lo que suele venir con eso: más avisos de los que caben en una
> agenda, partes que se cierran tarde y material que se gasta sin que quede
> apuntado en ningún sitio.
>
> ¿Cómo lleváis hoy la planificación de los técnicos, con un programa o con
> Excel y WhatsApp?
>
> Marc

## Correo 2 · día 5

Ángulo nuevo: el stock del técnico, que Marc señaló como uno de los dolores. Es
además el que cita la llamada del día 7.

> **Asunto:** el material de la furgoneta
>
> {{nombre}}, más concreto que la semana pasada.
>
> En clima lo que solemos ver es que la furgoneta lleva material que no está en
> ningún sistema. El técnico lo gasta, se apunta en un papel o no se apunta, y al
> facturar falta la mitad.
>
> ¿Cómo lo lleváis vosotros?
>
> Marc

## Correo 3 · día 10

> **Asunto:** cierro el tema
>
> {{nombre}}, no insisto más.
>
> Si en algún momento os planteáis juntar avisos, técnicos, material y
> facturación en un solo sitio, escríbeme y lo vemos. Y si ya lo tenéis resuelto,
> mejor para vosotros.
>
> Marc

## LinkedIn

**Día 3: invitación sin nota.** Desde el perfil de Marc. Sin nota a propósito: a
los dos días de recibir un correo suyo, el nombre ya le suena, y una nota de
venta en la invitación baja la tasa de aceptación.

**Día 12: mensaje, solo si aceptó.** Ya ha recibido tres correos, así que no se
presenta desde cero:

> Hola {{nombre}}, gracias por aceptar. Soy Marc, de Kubysoft, te escribí hace un
> par de semanas. No te agobio por aquí también: solo por si el correo se perdió,
> lo que quería preguntarte es si en {{empresa}} los partes y la planificación de
> los técnicos van por un programa o cada cosa por su lado. Si ya lo tenéis
> resuelto, perfecto y te dejo en paz.

Es el último toque de LinkedIn. No hay segundo mensaje.

## Teléfono · días 7 y 14

Nunca a puerta fría: para el día 7 ya ha recibido dos correos.

> Hola, ¿hablo con el responsable de servicio? Soy Marc, de Kubysoft. Le escribí
> el martes sobre el material que se lleva el técnico en la furgoneta y que luego
> no aparece al facturar. Llamo por eso y en un minuto le digo si le interesa o
> no. ¿Los avisos y los partes los lleváis con un programa o con Excel y
> WhatsApp?

---

# Versión B · gerente

Mismo esqueleto y mismos días. Cambia de qué habla.

## Correo 1 · día 1

**Asunto:**

- WhatsApp: `los avisos de {{empresa}}`
- CRM: `lo de después del CRM`
- Google: `el margen de los mantenimientos`

**Cuerpo, cubo WhatsApp:**

> Buenas {{nombre}},
>
> Soy Marc, de Kubysoft. Hacemos software de gestión para empresas de servicio
> técnico.
>
> Vi que en {{empresa}} los avisos entran por WhatsApp. Lo pregunto porque cuando
> el aviso vive ahí y el parte en otro sitio, saber qué ha costado de verdad un
> servicio exige cuadrarlo a mano.
>
> ¿Tenéis hoy los avisos, el material y la facturación en el mismo sistema o hay
> alguna pieza fuera?
>
> Marc

**Cuerpo, cubo ficha de Google:**

> Buenas {{nombre}},
>
> Soy Marc, de Kubysoft. Hacemos software de gestión para empresas de servicio
> técnico.
>
> Os escribo por algo concreto: en clima, saber qué margen deja de verdad un
> contrato de mantenimiento suele exigir cruzar a mano el parte, el material y la
> factura, en tres sitios distintos.
>
> No sé si en {{empresa}} lo tenéis resuelto. ¿Va todo por el mismo sistema o hay
> alguna pieza fuera?
>
> Marc

El cubo CRM usa el mismo correo que la versión A: ahí el ángulo ya es de
sistemas y funciona para los dos cargos.

## Correo 2 · día 5

> **Asunto:** lo que cuesta cuadrarlo a mano
>
> {{nombre}}, más concreto que la semana pasada.
>
> Lo que más nos cuentan no es que falte un programa. Es el tiempo de
> administración que se va en pasar lo que hizo el técnico a lo que se factura, y
> lo que se escapa por el camino en material y en horas.
>
> ¿Tenéis medido eso o es de las cosas que se asumen?
>
> Marc

## Correo 3 · día 10

> **Asunto:** cierro el tema
>
> {{nombre}}, no insisto más.
>
> Si en algún momento os planteáis centralizar la operativa en un solo sitio,
> avisos, técnicos, material y facturación, escríbeme y lo vemos. Y si ya lo
> tenéis resuelto, mejor para vosotros.
>
> Marc

## LinkedIn · día 12

> Hola {{nombre}}, gracias por aceptar. Soy Marc, de Kubysoft, te escribí hace un
> par de semanas. No te agobio por aquí también: lo que quería preguntarte es si
> en {{empresa}} tenéis la operativa en un solo sistema o hay piezas en Excel y
> WhatsApp. Si ya lo tenéis resuelto, perfecto y te dejo en paz.

## Teléfono · días 7 y 14

> Hola, ¿hablo con el gerente? Soy Marc, de Kubysoft. Le escribí el martes sobre
> lo que cuesta cuadrar a mano lo que hace el técnico con lo que se factura.
> Llamo por eso y en un minuto le digo si le interesa o no. ¿Tienen los avisos,
> el material y la facturación en el mismo sistema?

---

# Objeciones (las dos versiones)

Salen de la lista que mandó Kubysoft. Ninguna respuesta discute: todas preguntan.

| Le dicen | Contesta |
|---|---|
| Ya tenemos un programa | Me lo imaginaba, casi todos tenéis algo. ¿Y ese programa os lleva también la planificación de los técnicos y el material, o esa parte va por Excel o WhatsApp? |
| Estamos contentos con nuestro ERP | Mejor así. Lo que suelo preguntar es otra cosa: ¿hay algún proceso que sigáis haciendo fuera del ERP o a mano? |
| Cambiar de programa es muy complicado | Lo es, un ERP toca toda la empresa. Por eso no propongo cambiar nada hoy, solo entender cómo trabajáis. |
| Ahora no tengo tiempo | Lo entiendo, por eso no le pido una demo. ¿Le va bien que le llame la semana que viene y en diez minutos le digo si tiene sentido o no? |
| Solo necesito una app para los técnicos | Eso lo resolvemos, pero el valor aparece cuando lo del técnico queda conectado con administración, material y facturación. ¿Hoy eso va junto? |
| Es caro | ¿Comparado con qué? Lo que suelo mirar no es el precio del software, es lo que cuesta mantener procesos duplicados y errores. |
| Somos muy pequeños | ¿Cuántos técnicos sois? Hay planes por tamaño y se implanta por partes. |
| Quiero probar el programa antes | Se lo enseño, pero si le abro el ERP entero va a ver cosas que no usará nunca. Dígame primero qué le come más tiempo administrativo. |
| Nuestro programa ya hace lo mismo | Puede ser. ¿Tenéis integrados también los avisos, los partes, los contratos, el material y la facturación, o hay alguna herramienta aparte? |
| Mándame información | Se la mando, pero pasa lo mismo: ¿qué parte le interesa de verdad? |
| ¿Cuánto cuesta? | **El sistema para y avisa a Marc. No da precios.** |

# Lo que no cubre este borrador

- **El nombre del contacto.** Los 139 leads tienen correo de empresa, casi todos
  `info@`. Si no se enriquece el nombre, los correos van con "Buenas" a secas, que
  en negocio local es normal y no chirría. Enriquecer con Apollo gastaría créditos
  de la bolsa de Qualivo, así que es decisión de Maikel.
- **El cubo CRM son 2 leads.** Está escrito porque es el mejor mensaje de los
  tres, pero mueve poco volumen.
- **Sin aprobar.** Falta Maikel y falta Marc.
