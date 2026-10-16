# Qué compraría y qué no · presupuesto de outbound · 8-oct-2026

Maikel ofrece dinero para buzones. Mi respuesta: **los buzones no son el cuello, y hay
dos cosas distintas que sí compraría.**

---

## 1 · Tu instinto era correcto, pero en agosto

En `plan/informe-lunes-24ago.md`, línea 91, la recomendación era literalmente **«Comprar
buzones. El cuello de botella no es la lista, son los 325…»**. Entonces era verdad.

Lo que ha cambiado está escrito en dos sitios del repo:

> `estrategia/siete-puertas.md`, línea 53: «Capacidad 475 emails/día; hoy cargo **40-80
> leads/día porque verifico a mano**».

> `content/propuestas-areas/2026-10-05-outbound.md`, línea 60: «El hallazgo que define la
> semana: **el cuello es la señal, no el pool**».

## 2 · La medición: usamos entre el 16% y el 32% de lo que ya tenemos

| Dominio | Buzones | Capacidad/día | Estado |
|---|---:|---:|---|
| qualivoedge.com | 5 | 150 | limpio |
| novaqualivo.com | 5 | 100 | limpio |
| **goqualivo.com** | 3 | ~165 | **en SURBL, fuera de las 62 campañas** |
| **gotqualivo.com** | 2 | ~110 | **en SURBL, fuera de las 62 campañas** |

**Capacidad viva: 250/día. Carga real: 40-80/día.**

Comprar buzones ahora es comprar capacidad que no estamos usando. Y además tiene coste
negativo: más buzones nuevos significa más calentamiento y más superficie de reputación
que vigilar, para enviar lo mismo.

## 3 · Lo que SÍ compraría, por orden

### a) Dos dominios nuevos para jubilar goqualivo y gotqualivo · ~30-50 €/mes

Esto no es comprar capacidad, es **recuperar los 275/día que están muertos** y arreglar
un problema que levanté ayer y que sigue abierto:

La firma del ABM tiene que decir `qualivo.io` mientras el `From:` es `qualivoedge.com`,
porque el dominio de marca no se puede usar para enviar. **Firma y remitente en dominios
distintos es una señal de desconfianza en cada correo que mandamos**, y no hay salida
mientras los dos dominios quemados sigan en la lista negra.

Coste aproximado: 2 dominios a 10-15 €/año, más 6 buzones. Entre 3 y 6 € por buzón al mes
según proveedor, así que **30-50 €/mes**. Es la compra más barata y la de mayor efecto de
toda esta lista.

Aviso honesto: esto necesita **tres semanas de calentamiento** antes de enviar en serio.
No arregla octubre, arregla noviembre.

### b) Créditos de Apollo · es el coste real del volumen

Aquí está el dinero de verdad, y no es en buzones.

Cada lead cargado consume **1 crédito** de Apollo al revelar su correo. Así que el
volumen de envío y el gasto de créditos van 1 a 1:

| Volumen mensual | Créditos/mes que hace falta |
|---|---:|
| Lo que cargamos hoy (40-80/día) | 800-1.600 |
| Lo que propone el plan (2.000-2.500) | **~2.500** |
| El techo de la capacidad limpia (5.000) | ~5.000 |

**Quedan 2.304 créditos y caducan el 14-oct, en seis días.** Si no se gastan, se
evaporan. Eso es lo urgente de esta semana, más que cualquier compra.

No sé el precio de tu plan de Apollo, así que no te doy un número en euros: te doy el
número en créditos, que es el que hay que contratar. **Pídeme que lo calcule en euros
cuando me digas qué plan tienes.**

### c) Nada más, todavía

No pediría ninguna herramienta de verificación ni de detección de tecnología hasta poder
medir **dónde se va el tiempo de verificación**. Ahora mismo sé que verifico a mano y que
cargo 40-80 en lugar de 250, pero no sé si el tiempo se va en el probe, en leer el cargo,
o en el cruce de dedupe. Pedir una herramienta sin saber eso es el mismo error que cometí
el 7-oct cuando recomendé cerrar puertas con 40 envíos de muestra.

Se mide en una mañana en cuanto tenga la clave.

## 4 · Lo que mueve más que todo lo anterior y cuesta cero

De mi propio plan de octubre, las dos palancas con pérdida demostrable:

1. **Contestar en 4 horas** a las cinco o seis personas que muestran interés real al mes.
   De las 6 que hubo, cero se contestaron, esperaron un mes y ninguna acabó en reunión.
2. **No entregar propuestas a una sola persona.** 11 propuestas, 1 cierre, y en 6 de las
   11 la decisión estaba fuera de la sala.

Las dos cuestan **0 €**. Si solo se hiciera una cosa este mes, sería la segunda.

## 5 · La respuesta incómoda a «dónde pondría el dinero»

Si la pregunta es **qué compra más reuniones que acaban comprando**, el dato dice que no
es el correo frío.

| Canal · 5-oct | Toques | Respuestas | Reuniones agendadas |
|---|---:|---:|---:|
| Correo frío | 101 | 2, las dos un no | 0 |
| WhatsApp / Meta | 5 | **9** | **3** |

Mes de octubre hasta el 5: correo frío 285 envíos y 8 respuestas y **cero reuniones**;
WhatsApp 10 toques y 14 respuestas.

Con dinero nuevo sobre la mesa, el canal que ha producido reuniones este mes es el de
anuncios y WhatsApp. Eso no es mi área y no voy a opinar sobre cuánto meter en Meta, pero
sería deshonesto pedirte dinero para mi canal sin decirte que el otro está convirtiendo
mejor.

## 6 · Resumen para decidir en treinta segundos

| Qué | Cuánto | Cuándo da fruto | ¿Lo pido? |
|---|---|---|---|
| Buzones nuevos para más volumen | — | — | **No.** Usamos 40-80 de 250 |
| 2 dominios + 6 buzones para jubilar los de SURBL | 30-50 €/mes | noviembre, hay 3 semanas de calentamiento | **Sí**, es lo primero |
| Créditos de Apollo, ~2.500/mes | por confirmar con tu plan | inmediato | **Sí** |
| Gastar los 2.304 que caducan el 14-oct | 0 € extra | esta semana | **Sí, urgente** |
| Herramienta de verificación | — | — | **No todavía**, falta medir |
| SLA de 4 h y la regla de las dos personas | 0 € | esta semana | **Sí** |
