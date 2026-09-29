# Plan de octubre 2026 · Qualivo

> Escrito el 29-sep por el cerebro, a partir del brief de Maikel del 29-sep.
> Sustituye a `sistema/plan-septiembre.md`.
> **Regla del mes: primero vender, después optimizar, construir solo cuando una fuga demostrada lo justifique.**

---

## 0 · Dos correcciones al brief, antes de nada

El brief pedía verificar el baseline en CRM y Paid. Hecho, y no cuadra.

**El brief decía:** Paid generó 40 leads → 15 citas → 7 reuniones celebradas.

**Lo que dice GoHighLevel:** en septiembre entraron **115 oportunidades**. De ellas, **57 en el pipeline «Qualivo»**, que es el de Paid: 28 en *Contactado*, 28 en *Tibio*, 1 perdida. **Cero citas.** Las nueve reuniones agendadas están todas en el pipeline «Prospección», que es outbound.

Y el gasto: de los 1.689 € de Meta del trimestre, **solo 727,73 € son campañas de Qualivo** (las `QV_*`, todas de septiembre). El resto son campañas de cliente (`HTL_*`, `VALLD_*`).

**Eso cambia la tesis del mes.** El coste por lead es de **12,77 €**, que es barato. El problema no es conseguir leads ni lo que cuestan. El problema es que **56 leads ya pagados se quedaron sin hablar con nadie.**

**Segunda corrección:** el brief asigna responsables a Alba, José y Marilia. Ya no están en el equipo. Octubre lo ejecutan **Maikel y los agentes**, y el plan está dimensionado para eso.

---

## 1 · Baseline de septiembre 2026

| Métrica | Valor | Fuente |
|---|---|---|
| Inversión en Meta (campañas propias) | **727,73 €** | 36 transacciones de Meta |
| Oportunidades nuevas | **115** | GHL, los tres pipelines |
| · desde Paid (pipeline Qualivo) | 57 | GHL |
| · desde Prospección | 58 | GHL |
| Coste por lead de Paid | **12,77 €** | 727,73 / 57 |
| Citas agendadas desde Paid | **0** | GHL |
| Reuniones agendadas (Prospección) | 9 | GHL |
| No presentados | 4 | GHL |
| Segundas reuniones | 3 | GHL |
| Ofertas enviadas | 4 | GHL |
| En negociación | 2 | GHL |
| **€ cobrados de Paid** | **0 €** | Quipu |
| Facturado en el mes | 1.397 € | Quipu |
| Oportunidades abiertas (total) | **130 de 158** | GHL |
| Valor declarado en pipeline | **60.750 €** | GHL |

**Dos huecos del baseline que hay que cerrar la semana 1:** la distribución A/B/C/D no se ha podido verificar desde la API, y el show rate real necesita cruzar citas creadas contra celebradas. Ambos son tarea de la semana 1.

---

## 2 · La tesis de octubre

> **En casa hay más dinero que fuera.**

130 oportunidades abiertas y 60.750 € declarados, contra 727 € de publicidad que produjeron cero citas. Antes de gastar un euro más en tráfico nuevo, octubre trabaja lo que ya está pagado.

**El embudo, con la fuga marcada:**

```
Tráfico → Lead → Conversación → Cita → Reunión → Propuesta → Venta
            ↑         ↑↑↑         ↑       ↑          ↑
          12,77 €   56 PARADOS   0 desde  4 de 13    4 sin
          (bien)     (la fuga)   Paid    no vienen   respuesta
```

---

## 3 · Presupuesto y restricción de caja

**250 €/mes de publicidad.** Unos 8 €/día. No es el presupuesto que querríamos: es el que cabe con **800 € en el banco y 1.142 € de IVA el 20 de octubre**.

No se apaga del todo porque apagar pierde el aprendizaje del píxel y la señal acumulada. Pero octubre no es un mes de escalar inversión: es un mes de arreglar lo que ya se pagó.

Si entra el préstamo de 40.000 €, el presupuesto se revisa en noviembre, no antes, y solo si octubre demuestra que el embudo convierte.

---

## 4 · El mes, semana a semana

Una fuga, una hipótesis, un cambio, una métrica. **Nada de cinco experimentos a la vez.**

### Semana 1 · 30 sep – 5 oct · Los 56 parados

**Fuga:** 56 leads pagados en *Contactado* y *Tibio* que nunca hablaron con nadie.

**Hipótesis:** no se quedaron por ser malos leads, sino porque el primer contacto no generó respuesta y nadie insistió.

**Cambio:** repasar los 56 uno a uno. Cada uno acaba en *conversación abierta*, *cita*, o *descartado con motivo*. Ninguno se queda como está.

**Métrica:** conversaciones abiertas y citas obtenidas de esos 56, a coste cero.

**Además:** cerrar los dos huecos del baseline (A/B/C/D y show rate real) y montar la vista **DINERO MÁS CERCA** con las 130 abiertas: empresa · valor · estado · último contacto · bloqueo · próxima acción · fecha.

**Cierre el lunes 5:** baseline cerrado y firmado. A partir de ahí no se rediscute.

### Semana 2 · 6 – 12 oct · Lead → conversación

**Fuga:** si la semana 1 confirma que el problema es el primer contacto, aquí se arregla para los leads nuevos.

**Reconstruir las primeras 72 horas** de un lead de Paid: tiempo hasta el primer mensaje, % que lo lee, % que responde, % que llega a cita.

**Un solo cambio.** El candidato más probable: el primer mensaje de WhatsApp, personalizado con lo que la persona escribió en el formulario, en lugar de la plantilla.

**Métrica:** % de leads nuevos que llegan a conversación, contra el baseline de la semana 1.

### Semana 3 · 13 – 19 oct · Cita → reunión celebrada

**Fuga:** 4 no presentados. El show rate no llega al 70 %.

**Cambio:** secuencia de confirmación y recordatorio, más recuperación del no-show en menos de 24 horas.

**Métrica:** % de citas celebradas sobre agendadas.

**Y esta semana cae el 13 de octubre: la decisión de Kubysoft.** Va con el número delante, según lo pactado en la propuesta.

### Semana 4 · 20 – 26 oct · Propuesta → cierre

**Fuga:** 4 ofertas enviadas y 2 negociaciones sin cerrar.

**Cambio:** cada trato abierto tiene responsable, próxima acción y fecha. *«Propuesta enviada»* deja de ser un estado válido sin siguiente paso. Y seguimiento por motivo real (precio, no es prioridad, no ve el ROI, necesita a un tercero, timing, comparando, sin confianza, sin dolor), no *«¿has podido mirarlo?»*.

**Métrica:** días desde propuesta hasta decisión, y cuántas se mueven.

**Ojo: el 20 vence el IVA.** Semana de caja tensa.

### Semana 5 · 27 – 31 oct · Veredicto

Cierre del mes y decisión del trimestre. Qué se mantiene, qué se mata, y con qué presupuesto se entra en noviembre.

---

## 5 · El bloque diario de Maikel

**90-120 minutos al día, intocables, dedicados solo a ingresos.**

En ese bloque **no**: crear agentes, programar, rediseñar la web, montar dashboards, investigar herramientas, ni mejorar nada que no responda a una fuga demostrada.

En ese bloque **sí**: llamar, hacer seguimiento, empujar oportunidades abiertas, preparar reuniones, celebrarlas, mover propuestas, pedir decisiones y hablar con clientes.

Encaja en el bloque de 09:00-12:00 de ventas que ya está en el calendario.

---

## 6 · Outbound

No se mide por correos enviados. Se mide por: **cuentas → respuestas → respuestas positivas → reuniones → celebradas → propuestas → clientes.**

Prioridad a **formación**, que es el vertical con mejor economía según los datos disponibles, y que además es donde están los clientes que ya pagan (EAC y Eleva).

Lo que se aprenda en las conversaciones de outbound alimenta los anuncios de Paid, y al revés.

## 7 · Contenido

Sale de las fugas reales, no de ideas sobre IA. Cada problema que aparezca en una reunión se convierte en anuncio, pieza y argumento comercial. Los primeros, ya identificados: *«tienes leads pero no ventas»*, el tiempo de respuesta, los leads abandonados, los plantones, los presupuestos sin seguimiento y por qué un CPL barato puede salir carísimo.

---

## 8 · El viernes

Marcador de la semana, en una línea:

**€ invertidos → leads → A/B → citas → celebradas → propuestas → ventas → € contratado → € cobrado**

Y cinco respuestas, ninguna más: dónde está ahora la mayor fuga · qué aprendimos · qué cambio funcionó · cuál no · **cuál es la ÚNICA mejora de la semana que viene.**

El cerebro entrega el marcador relleno a las 8:00. Maikel no recopila datos, decide.

## 9 · Regla para ideas nuevas

Toda idea nueva de octubre responde a: **¿qué métrica del embudo mejora?** Si no se puede atar a una de estas —más oportunidades cualificadas, más respuesta, más citas, más show, más propuestas, más cierre, más ticket, menos CAC, menos días hasta cobro, más retención— va al **backlog de 2027**. No se construye en octubre.

Esto incluye al propio cerebro. El brief pedía a la vez «no construir infraestructura» y un sistema de scoring, un dashboard y follow-ups por motivo. Se construye **lo mínimo** para medir las cinco métricas del viernes, y nada más.

---

## 10 · El trimestre

- **Octubre · arreglar.** Cero inversión nueva relevante. Convertir lo que ya está pagado. Salida: saber en qué etapa se pierde el dinero y haberla arreglado una vez.
- **Noviembre · escalar lo que funcione.** Solo si octubre demuestra conversión. Con el préstamo dentro, el presupuesto sube al nivel que el embudo demostrado justifique, no antes.
- **Diciembre · cerrar y renovar.** Cerrar el año, renovar a los clientes vivos, y decidir 2027 con doce meses de datos reales.

**El número del trimestre:** pasar de **1.913 €/mes** de facturación a **4.500 €/mes**, que es el punto donde Qualivo deja de perder dinero. Son tres o cuatro clientes recurrentes.

---

## Lo que octubre NO es

No es un mes para construir. No es un mes para escalar inversión. No es un mes para abrir un canal nuevo.

Es un mes para demostrar que el sistema que ya existe convierte. Si no lo demuestra con 250 €/mes, tampoco lo hará con 1.200.
