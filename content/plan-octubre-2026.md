# Plan de octubre 2026 · Qualivo

> Escrito el 29-sep-2026 a partir de la instrucción de Maikel «Plan de octubre».
> Manda sobre cualquier plan anterior en lo que se contradiga. Es la hoja de
> ruta del mes para Maikel, el equipo y los agentes (Growth, Paid, Contenido,
> Raquel y el agente de WhatsApp).
>
> Principio: **primero vender, después optimizar, construir solo cuando una
> fuga demostrada lo justifique.** En octubre no se construye infraestructura
> nueva. Se hace que la que ya hay convierta mejor.

## 0. Cómo se usa este plan

- **Una fuga, una hipótesis, un cambio, una métrica por semana.** El resto del
  sistema se queda quieto esa semana para poder leer el resultado.
- **El orden de las semanas es el propuesto, no una obligación.** Cada viernes
  el veredicto dice dónde está la mayor fuga, y la semana siguiente ataca esa.
- **El trabajo de ingresos es diario y no espera al experimento.** La vista
  «Dinero más cerca» (sección 6) se trabaja cada mañana, haya el experimento
  que haya.
- **Cualquier idea nueva pasa por la regla de la sección 11.** Si no mueve una
  métrica del embudo, va al backlog de Q1 2027.

## 1. Baseline de septiembre (primera pasada, 29-sep)

Primera comprobación de las cifras de Maikel. Fuentes:
- CRM: `herramientas/revision-semanal.js --desde 2026-09-01 --hasta 2026-09-29`, lanzado el 29-sep con acceso solo al CRM (sin Meta ni Vapi).
- Bus de Growth (`bus/out/demand.jsonl`), del 24 al 28-sep.

**Se cierra el lunes 5-oct**, con Meta y Vapi incluidos.

| Métrica | Cifra de Maikel | Lo que dice la fuente | Estado |
|---|---|---|---|
| Leads de pago | ~40 | 37 en el CRM con etiqueta paid (formación 14, reformas 15, clínicas 5, otros 3) | Cuadra. Falta cruzar con Meta |
| Por sector | Reformas 16, formación 15, clínicas 5 | Reformas 15, formación 14, clínicas 5 | Cuadra casi exacto |
| Citas | 15 | 14 citas de pago a 27-sep (Growth). El cuadro de mando da 18 con cita (formación 9, reformas 6, clínicas 3), pero mezcla citas movidas | **Hay que definir qué es «cita»** (sección 3) |
| Reuniones celebradas | 7 | El cuadro de mando dice «16 hechas», pero **cuenta como hecha toda cita que sigue en «confirmada»**, y varias de esas fueron plantones | **La métrica del show está rota.** Arreglarlo es la tarea número uno del mes |
| Calidad A/B/C/D | 12 / 2 / 9 / 14 | Sin comprobar (el nivel se recalcula en cada vuelta) | Growth congela la foto a 30-sep |
| Coste por cita | Formación ~17 €, reformas ~51 € | Semana del 18 al 22-sep: formación ~22 €, reformas ~45 € (artículo coste-por-lead, contado lead a lead). Growth: ~75 € por reunión celebrada en cada sector | Depende del periodo. Hay que recalcularlo en el mes entero con Meta |
| Gasto Meta | — | ~465 € a 28-sep (QV_VERTICALES 320,87 € + QV_3VERTICALES 144,61 €, bus del 28-sep) | Falta el cierre del 30-sep |
| € cobrados de paid | 0 € | 0 €. Hay un sí de palabra de paid con arranque el 13-oct | Cuadra |
| Propuestas abiertas | — | 8.350 € en el CRM (4 propuestas) y una segunda reunión con propuesta de 1.200 € + 1.000 €/mes | Pasa a «Dinero más cerca» |
| Clientes nuevos (todos los canales) | — | El CRM marca 3 en «cliente» en septiembre, ninguno de paid | **Verificar.** Si se confirma, los canales que no son de pago están cerrando y octubre no puede dejarlos sin atención |

**Dos hallazgos que cambian el plan:**

1. **No sabemos medir el show rate.** El estado de la cita en el calendario no
   se actualiza cuando alguien no viene, y el cuadro de mando lo lee como
   reunión hecha. Sin arreglar esto, la semana del show no se puede evaluar.
   El cambio es de proceso, no de construcción: después de cada cita,
   Maikel o Growth la marca como «vino» o «no vino» ese mismo día.
2. **La mayor fuga medida está entre la cita y la reunión.** Growth, a 27-sep:
   de las citas de pago ya pasadas, más de la mitad no se celebraron. Por eso
   propongo empezar por el show (sección 4) y no por la calidad del lead.

## 2. Objetivo del mes y North Star

**Objetivo:** que el sistema actual convierta mejor en cada etapa, y cerrar el
mes sabiendo el **CAC real de Qualivo** por canal.

**North Star:** la ecuación completa, cada viernes:

€ invertidos → leads → A/B → conversación → cita → reunión celebrada → propuesta → venta → € contratado → € cobrado

**Objetivos orientativos para el 31-oct** (sirven para saber si vamos bien, no
para forzar el número):

| Etapa | Septiembre | Objetivo de octubre |
|---|---|---|
| Show rate (cita → reunión celebrada) | Menos de la mitad (a cerrar el 5-oct) | 60 % o más |
| % de leads A/B | ~38 % (14 de 37, a verificar) | 50 % |
| Propuestas con siguiente paso y fecha | Sin medir | 100 % |
| Días de propuesta a decisión | Sin medir | Medido, y bajando |
| € cobrados de paid | 0 € | Primer cobro (arranque del 13-oct) |
| CAC real por canal | Sin medir | Calculado |

## 3. Definiciones (para que todos contemos lo mismo)

| Etapa | Cuenta cuando… |
|---|---|
| Lead | Entra en el CRM con canal, campaña, sector y anuncio |
| A/B | Su nivel el día que entra. Se congela para medir, aunque luego cambie |
| Conversación | Contesta por cualquier canal, o habla con Raquel más de 30 s con intercambio |
| Cita | Tiene una reserva en el calendario. Una cita movida sigue siendo una sola |
| Reunión celebrada | Se ha hecho la reunión. Se marca «vino» el mismo día |
| No vino | No se presentó a la hora. Se marca «no vino» el mismo día |
| Propuesta | Se ha enviado precio por escrito |
| Venta | Hay un sí firmado o un primer pago |
| € contratado / € cobrado | Lo firmado / lo que ha entrado en la cuenta |

## 4. Plan semana a semana

Cada semana tiene su experimento principal. El trabajo de «Dinero más cerca»
va todos los días en paralelo.

### Semana 0 · 30-sep al 4-oct · Cerrar el baseline y ordenar la cartera

- **Growth:** cierra el baseline de la sección 1 con Meta y Vapi, congela la
  foto A/B/C/D a 30-sep y marca «vino» o «no vino» en todas las citas pasadas
  de septiembre.
- **Maikel:** una sola pasada por la cartera. Cada propuesta y cada A/B sale
  con responsable, próxima acción y fecha.
- **Paid:** no toca nada. Regla de siete días, revisión el 5-oct.
- **Contenido:** prepara los guiones de los anuncios de la semana 2, para que
  Maikel los grabe el jueves 1 o el viernes 2.
- **Salida:** baseline cerrado y primera vista de «Dinero más cerca» el lunes 5.

### Semana 1 · 5 al 11-oct · Que las citas se celebren

- **Fuga:** entre la cita y la reunión celebrada.
- **Hipótesis:** la gente falta porque reserva a varios días vista, sin haber
  confirmado y sin saber qué se va a llevar de la reunión.
- **Cambio único:** el recordatorio pide respuesta («¿sigues pudiendo el
  jueves a las 10:00?»). Quien no confirma la víspera recibe una llamada.
  El recordatorio de la víspera ya está encendido desde el 27-sep, así que
  el cambio es solo que pida confirmación.
- **Métrica:** show rate de las citas de esa semana, separado por días entre
  la reserva y la cita.
- **Mantener si** el show sube 15 puntos o más frente a septiembre. **Iterar
  si** sube menos. **Matar si** no se mueve.
- **En paralelo, sin experimento:** recuperar al que no viene en los 10
  minutos siguientes, con el protocolo de la guía de plantones.

### Semana 2 · 12 al 18-oct · Mejores leads

- **Fuga:** demasiados D. Unos 14 de 37 en septiembre, a verificar.
- **Hipótesis:** el anuncio atrae a gente interesada en la IA, pero sin
  negocio suficiente. Un anuncio que enseña el problema antes que la
  tecnología trae más A/B.
- **Cambio único:** dos anuncios nuevos contra el actual, en el sector que
  mejor economía tenga el 5-oct:
  - Maikel a cámara con el problema.
  - Demo con voz, con el mismo problema.
- **Métrica:** coste por A/B. No el coste por lead.
- **Mantener** el que tenga el menor coste por A/B, con al menos 150 € por
  variante. **Matar** los que doblen el coste por A/B del actual.

### Semana 3 · 19 al 25-oct · Que más leads contesten y reserven

- **Fuga:** el A/B que entra y no acaba hablando con nosotros.
- **Primero:** reconstruir las primeras 72 horas de los A/B de las semanas 1
  y 2:
  - tiempo hasta el primer contacto;
  - cuántos leen y cuántos contestan;
  - cuántos reciben llamada y cuántos hablan con Raquel;
  - cuántos reservan;
  - horas desde que entran hasta que reservan.
- **Cambio único (propuesta):** el primer mensaje usa lo que respondió en el
  formulario. Esta decisión ya está pendiente del ok de Maikel en Todoist.
- **Métrica:** % de A/B que contestan en 24 h y % que reservan en 72 h.
- **Mantener si** sube la respuesta sin bajar la reserva.

### Semana 4 · 26 al 31-oct · Propuesta, seguimiento y cierre

- **Fuga:** empresas que reciben propuesta y no deciden.
- **Hipótesis:** el seguimiento es genérico y sin fecha. Uno por motivo, con
  contexto, acorta la decisión.
- **Cambio único:**
  - Toda propuesta lleva responsable, siguiente paso y fecha.
  - «Propuesta enviada» deja de ser un estado válido si no tiene siguiente paso.
  - Cada una se clasifica por motivo y recibe el seguimiento de su motivo (sección 8).
- **Métrica:** días desde la propuesta hasta la decisión, y % de propuestas
  con respuesta en 7 días.

## 5. Guion comercial (una mejora por semana)

- **Qualivo en una frase:** «Te decimos dónde se te escapa el dinero entre el
  anuncio y el cierre, y lo arreglamos dentro de lo que ya usas».
  Candidata, la misma idea que el titular de la web. Se prueba en las
  reuniones de octubre.
- **Estructura de la reunión:** entender su situación → cuantificar la fuga →
  enseñarle su problema → cómo lo corregimos → estimar el valor → siguiente
  paso.
- **Intelligence:** como mucho tres pantallas, y solo las que enseñan su fuga.
- **Lo que ya sabemos que hay que cambiar** (dailies del 27 y el 28-sep):
  - «No sé si es lo que me encaja, yo quería otra cosa». Se nos entiende
    como seguimiento de ventas. La frase y un ejemplo de su sector tienen que
    salir en los primeros cinco minutos.
  - El miedo a pagar antes de tenerlo claro se resolvió alineando el cobro
    con el arranque, sin tocar el precio. Pasa al guion como respuesta
    estándar.
  - Los agentes se entienden mejor como «te preparan el borrador y lo apruebas
    tú».
- **Después de cada reunión, cuatro campos** (ya acordados con Growth): contactado en, resultado, motivo si no encaja y ticket estimado. Más una frase con la objeción o la duda.

## 6. Cartera: «Dinero más cerca»

Cada mañana, antes de cualquier otra cosa, una vista con:
- empresa, contacto, valor posible y estado;
- último contacto, bloqueo y próxima acción;
- fecha y responsable.

Se ordena por valor posible × intención. Ningún A/B ni ninguna propuesta pasa
tres días sin una razón escrita. La monta Growth desde el CRM, dentro de
Intelligence si ya lo permite, y sin construir nada nuevo si no hace falta.

## 7. Rutina de Maikel

Entre 90 y 120 minutos al día solo para ingresos:
- llamar;
- hacer seguimiento;
- preparar y celebrar reuniones;
- mover propuestas y pedir decisiones;
- reactivar leads.

Durante ese bloque, nada de programar, crear agentes, rediseñar la web, montar
paneles ni investigar herramientas.

## 8. Seguimiento de propuestas por motivo

| Motivo | Seguimiento |
|---|---|
| Precio | Mover el cobro o el alcance antes que el precio (caso del 13-oct) |
| No es prioridad o timing | Fecha acordada y un solo mensaje ese día, con algo útil |
| No ve el retorno | Su cifra: cuánto pierde al mes entre el lead y la venta |
| Tiene que consultarlo | Un resumen de una página para quien decide |
| Está comparando | Un caso parecido al suyo, con números |
| No confía todavía | Una primera parte pequeña que se pueda comprobar |
| No le duele lo suficiente | Se cierra con respeto y se le escribe dentro de 60 días |
| No contesta | A los 7 días, «¿lo dejamos aquí?» con tres respuestas de una palabra |

Nunca «¿has podido mirar la propuesta?».

## 9. Outbound

- Flujo constante de cuentas del perfil ideal, empezando por formación si el
  baseline confirma que es el sector con mejor economía.
- Se mide en cuentas → respuestas → respuestas positivas → reuniones →
  reuniones celebradas → propuestas → clientes. Nunca en correos enviados.
- Lo que se aprende en las conversaciones de outbound alimenta los anuncios,
  y al revés.
- Si se confirma que los tres clientes de septiembre vinieron de canales que
  no son de pago, este bloque sube de prioridad.

## 10. Contenido

El contenido de octubre sale de la fuga de cada semana y de lo que se oye en
las reuniones. Cada problema descubierto se convierte en cinco piezas: el
anuncio, la pieza de redes, el artículo, la newsletter y el argumento
comercial.

| Semana | Fuga | Artículo del blog | Redes | Newsletter / nurturing | Para ventas |
|---|---|---|---|---|---|
| 0 | — | Coste por reunión, no por lead | Tesis: «más leads no arreglan una agenda de plantones» | — | Guiones de anuncios de la semana 2 |
| 1 | Show | El recordatorio que pide respuesta · qué hacer en los 10 minutos después del plantón | Agentizando: cómo confirmamos las citas | Newsletter de plantones, si se aprueba | Mensaje de recuperación del plantón |
| 2 | Calidad | Qué pasa después del clic · por qué un CPL barato sale caro | Problema antes que tecnología (mismos hooks que los anuncios) | Correo del día 2 del nurturing, con el problema de la semana | Hoja «qué hace un agente en cada punto del recorrido» |
| 3 | Respuesta | Tiempo de respuesta · leads que dejan de contestar | La primera hora (datos propios de noche y fin de semana) | Correo con la cifra de la calculadora | Primer mensaje personalizado |
| 4 | Cierre | Presupuestos olvidados · cómo calcular lo que pierdes entre el lead y la venta | Objeción de la semana (de las reuniones reales) | Caso de cliente, si lo autoriza | Seguimientos por motivo (sección 8) |

**Reglas del contenido en octubre:**
- Un dato real por pieza.
- Nada de contenido genérico sobre IA.
- La tasa de plantones propia no se publica.
- Ningún nombre de lead.
- Redes, en pausa hasta que Maikel la levante.

**Prerrequisito de los correos:** el DNS de qualivo.io (SPF, DMARC y dominio
de envío en GHL). Sin eso, el nurturing y la newsletter acaban en spam.

## 11. Regla para ideas nuevas

Toda idea nueva tiene que decir qué métrica del embudo mueve:
- más oportunidades cualificadas;
- más respuesta, más citas o más show;
- más propuestas, más cierre o más ticket;
- menos CAC o menos tiempo hasta el cobro;
- más retención.

Si no se puede atar a una de ellas, va al backlog de Q1 2027.

## 12. Responsables

| Área | Responsable | Apoyo |
|---|---|---|
| Ingresos, reuniones, propuestas, decisiones | Maikel | Growth prepara cada reunión |
| Baseline, cuadro de mando, CRM, «Dinero más cerca», cadencia | Agente de Growth | Por asignar: Alba / José / Marilia (roles a confirmar por Maikel) |
| Anuncios, presupuesto, coste por A/B | Agente de Paid | Maikel aprueba cada cambio |
| Llamadas | Raquel (voz) | Growth revisa las llamadas |
| WhatsApp | Agente de WhatsApp | Growth revisa las conversaciones |
| Contenido, guiones de anuncios, argumentos comerciales, nurturing, newsletter | Agente de Contenido | Maikel graba y aprueba |
| Outbound | Por asignar | — |

## 13. Cuadro de mando semanal (viernes)

Se construye sobre el ritual que ya existe (`content/ritual-semanal.md` y
`herramientas/revision-semanal.js`). Hay que añadirle, sin rehacerlo:
- A/B congelado;
- «vino» y «no vino» marcados;
- € contratado y € cobrado;
- días de la propuesta a la decisión.

**Marcador:** gasto → leads → A/B → conversaciones → citas → reuniones
celebradas → propuestas → ventas → € contratado → € cobrado. Esta semana,
contra la anterior y contra el acumulado del mes.

**Y cinco respuestas:**
1. ¿Dónde está ahora la mayor fuga?
2. ¿Qué aprendimos?
3. ¿Qué cambio funcionó?
4. ¿Qué cambio no funcionó?
5. ¿Cuál es la única mejora de la semana que viene?

## 14. Criterios para mantener, iterar o matar

- **Antes de empezar**, cada experimento escribe:
  - la métrica;
  - el valor de partida;
  - el umbral de éxito;
  - la muestra mínima (7 días o el volumen que diga la tabla de la semana).
- **Mantener:** se alcanza el umbral con la muestra mínima.
- **Iterar:** mejora, pero por debajo del umbral. Se cambia una sola cosa y
  se repite una semana.
- **Matar:** no mejora, o empeora otra etapa (por ejemplo, más respuesta y
  menos reservas).
- **Nunca** se decide con menos de la muestra mínima, salvo que el gasto se
  dispare.

## 15. El trimestre (octubre a diciembre)

| Mes | Foco | Salida del mes |
|---|---|---|
| **Octubre** · convertir mejor | Una fuga por semana sobre el sistema actual | CAC real por canal, show del 60 %, primer cobro de paid, seguimiento por motivo funcionando |
| **Noviembre** · escalar lo que funciona | Más presupuesto solo en el sector y el anuncio con mejor coste por reunión celebrada. Outbound con el mismo mensaje ganador | Coste por cliente estable al subir el gasto. Primeros casos de clientes de octubre publicados |
| **Diciembre** · retener y preparar el año | Clientes recurrentes: resultados del primer mes y casos. Plan de Q1 2027 con el backlog de ideas | Retención de los primeros clientes, 2 casos nuevos y plan de Q1 cerrado |

**Lo que no se hace en el trimestre salvo fuga demostrada:**
- sectores nuevos;
- productos nuevos;
- rediseño de la web;
- agentes nuevos.
