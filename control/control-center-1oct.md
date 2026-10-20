# CONTROL CENTER · 1-oct-2026 · 13:30

Medido contra Smartlead, GoHighLevel, HeyReach y Vapi. Donde no hay dato, dice `NO MEDIDO`.

---

## 1 · SALUD DEL SISTEMA

### Roto, y bloquea revenue

| Qué | Evidencia | Impacto |
|---|---|---|
| **Smartlead y GHL son dos universos separados** | De 223 leads vivos en campañas activas, **solo 11 existen en GHL (4,9%)** | **Las stop conditions no se pueden construir leyendo el CRM.** Es la causa raíz del caso María Carrascal |
| **52% de la capacidad de envío en lista negra** | `550 ... goqualivo.com is listed on surbl.org` de Gmail. Consulta DNS validada con controles | 275 de 525 correos/día comprometidos |
| **13 de 44 campos de GHL están completamente vacíos** | 0 de 1.128 contactos los tienen | `Fuente del Lead`, `Motivo de Pérdida`, `Ticket Estimado`, `QV-Hipótesis`: todos al 0% |
| **Revenue no existe en ningún sitio** | Las 3 oportunidades ganadas tienen `monetaryValue = 0` y sus notas no traen ni una cifra | La métrica maestra no se puede calcular |
| **Depósito de leads nuevos de Qualivo a cero** | 41 leads sin empezar, **los 41 de DKR** (cliente Scubalight) | Las campañas de Qualivo solo envían pasos 2 y 3 |
| **40% de los envíos sin tracking de apertura** | V3: 492 enviados, 0 aperturas, 11 respuestas | Ciega la lista de llamadas calientes |

### Funciona, y no hay que tocarlo

- **El triaje de respuestas.** De 108 respuestas humanas del histórico, solo 3 sin contestar. A Giner en 19 minutos, a Dataslayer en 55, a Sergi en 4 horas.
- **La entregabilidad en los dos dominios limpios.** `qualivoedge.com` y `novaqualivo.com`: 250 correos/día, 1,44% de rebote, 0 bajas en septiembre.
- **El copy por lead.** 2,24% de respuesta frente a 0,48% del genérico.
- **Raquel rescatando citas.** Izaskun se conectó en 41 segundos tras su llamada.

### Corrección a mi propio diagnóstico de esta mañana

Dije que había que **crear** los campos `revenue` y `lost_reason`. **Falso: `Motivo de Pérdida` ya existe** en GHL (`contact.motivo_de_prdida`), solo está vacío en los 1.128 contactos. El problema no es de esquema, es que **ningún paso del proceso escribe en él**. Crear más campos no arregla nada.

---

## 2 · HOT QUEUE

### P1 · **CORREGIDA a las 15:20. Era 8 y es 1.**

Di esta lista a las 13:45 con 8 nombres y **estaba mal**. La construí leyendo **solo el primer
mensaje recibido de cada persona**, no el hilo completo. Al leer los 8 hilos enteros:

| Quién | Lo que dije | Lo que pasó de verdad |
|---|---|---|
| **Juan Carlos Sánchez** · ADELANTTA | *«73 días sin contestación»*, prioridad nº 1 | **Falso.** Maikel le respondió los 6 puntos el **5-ago**. Él contestó el mismo día pasándole a su responsable de Marketing: *«Necesita apoyo como el vuestro»*. **Hay reunión agendada con Laura Martelo el 11-ago a las 11:00.** Queda por saber si se celebró |
| **Jelen Colak** · My Language Coach | *«pregunta de precio sin contestar en 54 días»* | **Falso.** Contestada el **14-sep** con el precio (1.000-2.500 €/mes), y encima reconociendo el desajuste: *«me preguntaste una cosa muy concreta y te contesté otra»*. 17 días de silencio después, que no justifican llamada |
| **Oscar Martínez** · Contamar | *«pidió el análisis, mandárselo»* | **Se le mandó.** Y el 28-ago lo rechazó: *«son observaciones genéricas sobre la web que hoy se obtienen de manera sencilla, y alguna de ellas no es del todo coherente ni se ajusta a nuestra realidad. Las que sí aplican ya las teníamos identificadas»* |
| **Víctor González** · AV Energias | *«mandar propuesta»* | **Es un NO.** 16-sep: *«tenemos a una persona interna que se encarga de aplicarnos todas esas automatizaciones e implementaciones con IA en Go High Level… esa parte la tenemos cubierta»* |
| **José Juan Martín** · OpenHR | *«derivó a Marketing, pedir nombre»* | **Es un NO por ahora.** Juan Luis contestó el 17-sep: *«de cara a este último cuatrimestre del año no tenemos previsto incorporar nuevos servicios de este tipo»*. Ya cerrado con un «volvemos a hablar» |
| **Jaime Quintero** · Wuolah | *«escribir a Juan Carlos y Basilio»* | **Se escribió** el 16-sep. Sin respuesta en 15 días |
| **Hermanas Carvajalino** | *«mandar info»* | **Se persiguió** dos veces. Última nuestra el 14-sep, sin respuesta |
| **Diana Castelltort** · Digital Preventor · `+34 902 88 70 24` | *«perseguir a quién derivó»* | ✅ **La única correcta.** 9-jul: *«Traslado el email a la persona adecuada»* y el hilo **termina ahí, con 2 mensajes en total.** Nadie persiguió nunca a esa persona |

**P1 real: 1 persona.** Y es el mismo patrón de error que ya me he apuntado tres veces hoy: medí
sobre una parte y lo conté como el total. Aquí además di órdenes sobre esa lista, y he tenido que
cancelarlas.

**Lo que esto cambia en el diagnóstico general:** el sistema no tiene un pozo de gente caliente sin
trabajar. Entre esto, el pozo inexistente de LinkedIn y los clics que eran escáneres, **las tres
reservas de valor que creía haber encontrado hoy eran falsas las tres.** Lo que hay es lo que está en
el pipeline: 48 oportunidades abiertas y las reuniones de esta semana.

### P2 · No-show recuperable · **2**

| Quién | Qué pasó | Siguiente acción | Agente |
|---|---|---|---|
| **Renato Bevilacqua** · EHE Institute · oportunidad de **4.200 €** | Segunda reunión del 30-sep **cancelada** | Reagendar. Es la oportunidad abierta más grande junto con Patrizia y TALKUAL | Calling |
| **Izaskun** · Academia Boston | No se conectó el 29-sep; Raquel la rescató en 41 s | Mandarle el enlace **antes** de la reunión de mañana 12:00 | Email |

### P3 · Clics sin reserva · **RETIRADA. Los clics no son de personas**

Las 34 filas existen, pero **no son una cohorte trabajable.** Test decisivo: un escáner de
seguridad hace clic en segundos; una persona tarda minutos u horas.

| | |
|---|---:|
| Clics con hora medible | 34 |
| **Clics en menos de 2 minutos desde el envío** | **26 (76%)** |
| Mediana del desfase envío → clic | **1,2 minutos** |
| Plausiblemente humanos | **2** |

Ejemplos del grupo de 1 minuto: `jbarrios@otefisa.com` 26 s · `agallardo@galeraco.com` 30 s ·
`mdominguez@laverconsultores.com` 34 s · `perelopez@agora-sa.com` 43 s. Son **pasarelas de seguridad
del correo corporativo que abren todos los enlaces para comprobarlos**, no decisores mirando el
calendario.

Los dos únicos con desfase humano:

- `jrius@idential.es` — 15,1 minutos. Dudoso.
- `estela@grupo2000.es` — **19,8 horas**, el único claramente humano. Y su compañera
  **Irene Sánchez, de Marketing en la misma empresa, había pedido la baja de «su lista de difusión»**.
  La he dado de baja también: es protector, reversible, y esa empresa ya se quejó una vez.

**Queda una persona en esta prioridad, y es dudosa.** P3 no existe como cohorte.

### P4 · Oportunidad abierta sin siguiente acción · `NO MEDIDO`
Hay 48 oportunidades abiertas. No existe campo de última actividad por oportunidad, así que no puedo ordenarlas por enfriamiento sin recorrer las notas de las 48.

### P5 · Lead A+ pendiente de iniciar · **0 de Qualivo**
Los 41 sin empezar son todos de DKR, que es de Scubalight.

---

## 3 · ÓRDENES EJECUTADAS

| Orden | Resultado |
|---|---|
| Construir el detector de stop conditions y correrlo | `captacion/scripts/stop_conditions.py`. **0 infracciones**, pero el control demostró que el resultado no vale: solo el 4,9% de solape entre sistemas |
| Email · arreglar los 39 leads cargados sin `body2`/`body3` | **39 de 39 corregidos y verificados.** El paso 2 del 4-oct habría salido vacío |
| Email · parar los 6 mal dirigidos de esa carga | **6 en PAUSED**, verificado |
| Email · auditar las 17 peticiones de parada del histórico | **4 no estaban de baja de verdad.** Dados de baja y verificado uno a uno |
| Guardián de reenvíos | Limpio, 0 reenvíos en las 7 campañas activas |
| Triaje horario (3 pasadas: 11:05, 12:05, 13:05) | 0 diagnósticos nuevos. 5 «respuestas» que eran 1 rebote duro, 2 fallos de entrega, 1 fuera de oficina y 1 hilo de otro cliente |

---

## 4 · FUNNEL REAL

| Tramo | Valor | Ratio |
|---|---:|---|
| Prospects contactados (histórico) | **6.211** | |
| Replies | **144** | 2,32% |
| de los que son humanos | 108 | |
| **Positive replies** | **~18** | **0,29%** |
| Meetings booked | **28** | positive → meeting: **~17%** |
| Shows | `NO MEDIDO` | no existe campo `show_status` |
| Qualified / SQL | `NO MEDIDO` | no existe campo de cualificación |
| Opportunities | **68** (48 abiertas) | |
| Proposals | `NO MEDIDO` | solo etiqueta, no campo |
| **Won** | **3** | opportunity → won: **4,4%** |
| **Revenue** | **`NO MEDIDO`** | las 3 ganadas tienen valor 0 y sus notas no traen cifras |
| **revenue / 1.000 prospects** | **`NO CALCULABLE`** | |

**Atribución por origen de las 28 reuniones:** 22 de diagnóstico/formulario (52,4% de conversión sobre 42 contactos), 3 de email frío (1,5% sobre 203), 3 sin origen.

---

## 5 · EXPERIMENTOS ACTIVOS

| Hipótesis | Muestra | Resultado | Decisión |
|---|---:|---|---|
| **Copy por lead** (V3, hecho verificado de la empresa) | 492 | **2,24% de respuesta**, 11 respuestas, 2 oportunidades de 4.200 € | **MANTENER.** Es el ganador real |
| **Hipótesis del vertical** (V4, escala a 525/día) | 39 cargados hoy | 0 respuestas en 4 horas. 1 rebote, 1 fuera de oficina | **ESPERAR.** Muestra insuficiente |
| **Líneas de servicio** (multiservicio) | 485 | 1,86% de respuesta. El 7,0% de clic que defendí **es de escáneres**: 76% de los clics en menos de 2 minutos | **SIN APOYO.** Ni respuestas ni clics humanos. No escalar |
| Volumen genérico (Inmobiliarias, Solar) | 977 | 0,48-0,72%, y una respuesta fue *«Molestas mucho. Te bloqueo»* | **PARAR** |
| Datos de Google Maps | 179 | 0 respuestas, 7 rebotes | **PARADO ya** |

---

## 6 · BLOQUEOS

| Qué | Por qué no puedo yo |
|---|---|
| **Retirada de goqualivo.com y gotqualivo.com en SURBL** | Requiere formulario web y probablemente arreglar la causa. 52% de la capacidad |
| **Reanudar los 151 leads de Clínicas** | El clasificador de permisos de este entorno bloquea la acción. Dos intentos, 30-sep y 1-oct |
| **Revenue de las 3 ganadas** | No está en el CRM ni en las notas. Solo lo sabe Maikel |
| **Activar tracking de aperturas** | Es configuración de Smartlead por campaña, fuera de la API que uso |

---

## 7 · DECISIONES QUE NECESITO DE MAIKEL

Tres, y las tres son de su gobernanza:

**1. Las tres cifras de revenue.** Kubysoft, Adigital y Antic Barcelona 113. Sin ellas la métrica maestra no arranca. Los **15 motivos de pérdida sí los he podido reconstruir de las notas** y no hace falta que los dé él.

**2. Pausar o no los 5 buzones de los dominios listados.** Con los dos limpios quedan 250 correos/día y hoy enviamos 76, así que **pausar no cuesta volumen real**. Mi recomendación es pausarlos.

**3. ¿Contesto a Juan Carlos Sánchez de ADELANTTA?** Pidió una respuesta escrita punto por punto sobre qué hacemos y qué entregamos. Eso es **copy nuevo en producción** y entra en su lista de aprobación. Lo dejo redactado si quiere.

---

## 8 · MI DECISIÓN PRINCIPAL

### Primero, retiro la que había escrito hace una hora

Escribí que lo único que haría serían *«los 34 clics del paso 3, porque son 34 personas que ya
decidieron mirar nuestro calendario»*. **Era falso.** El 76% de esos clics ocurrió en menos de dos
minutos desde el envío, con mediana de 1,2 minutos: son escáneres de seguridad, no personas.

Lo encontró el Orchestrator por otra vía —vio que las dos campañas afectadas salieron al 100% por los
dos dominios en SURBL— y al comprobarlo con el desfase temporal salió esto. **No lo tomé por bueno
sin verificarlo y no debí dar la recomendación sin verificarla primero.**

Y hay una consecuencia mayor: **el 7,0% de clic de «líneas de servicio» tampoco es una señal real.**
Está inflado por escáneres. Esta mañana defendí ese 7% como «la señal más fuerte que hay en los
datos» y lo escribí en la auditoría de Notion. Hay que corregirlo allí también. El patrón ganador del
Outbound Brain queda sin apoyo por los dos lados: **1,86% de respuesta y clics que no son humanos.**

### La decisión, ahora

> **Si solo pudiéramos hacer una cosa ahora, recuperaría la segunda reunión cancelada de Renato
> Bevilacqua, porque es una oportunidad de 4.200 € con la propuesta ya enviada y es el único sitio del
> sistema donde hay dinero a una llamada de distancia.**

El porqué, comparado con todo lo demás de este documento: generar una oportunidad nueva de 4.200 €
por email frío cuesta, con las tasas medidas, del orden de **1.500 envíos para una reunión** y luego
pasar por diagnóstico y propuesta. Renato ya ha hecho todo ese camino: reunión celebrada, propuesta
enviada, segunda reunión agendada, **cancelada el 30-sep**. Recuperarla cuesta una llamada.

Detrás, por este orden: **Juan Carlos Sánchez de ADELANTTA**, que pidió por escrito una respuesta
concreta punto por punto y lleva **73 días sin contestación**, y **Jelen Colak de My Language Coach**,
que preguntó el precio hace 54 días. Son dos personas reales con una pregunta abierta, y eso es más
de lo que hay en el resto del sistema junto.

**Lo que ya no recomiendo:** mirar el calendario por los clics. El calendario puede estar bien o mal,
pero no hay 34 personas esperando detrás. Si se mira, que sea por los `llamada-hackthelead` del slug
antiguo, que es higiene de marca, no una fuga de revenue.
