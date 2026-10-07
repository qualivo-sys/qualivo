# Revisión Qualivo Master Reviewer · 7-oct-2026

> Tres piezas del commit `d8084e5` («7-oct: artículo «Pipeline de ventas»,
> re-apunte de crm-gratis-para-pymes y borrador bandera roja «Tratos sin
> fecha»»). Revisadas con `content/agentes/prompt-qualivo-master-reviewer.md`
> (incluido §13), las reglas R1-R18 de `content/content-os-v1.md` §3 y
> `content/guia-de-voz.md`. Fuentes de datos: últimas entradas de
> `bus/out/demand.jsonl` (daily de Growth del 6-oct, 19:16, y cambio-meta del
> 6-oct, 14:46) y el código de `api/`.

## Fuentes contrastadas

| Claim | Fuente | Qué dice la fuente, tal cual |
|---|---|---|
| Qué día de la semana fue el 6-oct | daily de Growth del 4-oct (`abm.fecha`) y calendario | «OJO: el lunes es 5-oct, no 6-oct». **El 6-oct fue martes.** El artículo dice «el lunes» cuatro veces y el post de LinkedIn e Instagram, una. **Falso.** La imagen dice «El 6 de octubre»: correcto. |
| «El 6 de octubre … una tarea con fecha para cada trato abierto … siete» | daily 6-oct 19:16, `cambios[0]` | «tareas fechadas en el CRM para todos los tratos abiertos (7 creadas, sin accion en cadencias)». **Correcto** en fecha, en «todos los tratos abiertos» y en **siete tareas**. La fuente **no dice** que haya siete tratos ni que sea una tarea por trato: cuenta tareas, no tratos. «Siete tratos, siete tareas» y «una por trato» son una deducción. |
| Quién creó las tareas | misma entrada, `de: growth` | Las creó **el agente de Growth**. El artículo lo dice bien en l. 112. En l. 99 («repasamos») y en el post, con la voz de Maikel («le pusimos»), se pierde. |
| «Ninguna manda nada sola» | misma entrada | La fuente dice «sin accion en cadencias»: crear las tareas no tocó las cadencias de mensajes. Que una tarea de GHL no manda nada es cierto (en `api/seguimientos.js` las tareas van a una persona, `assignedTo`), así que el **fondo es correcto**. La **forma** es un «no es X, es Y» disfrazado (R11, ver críticos). |
| «Movimos a más adelante a varios contactos que encajan pero ahora no pueden empezar» | cambio-meta 6-oct 14:46, `no_enviado` | «Los movimientos a Más adelante (cinco contactos) no mandan evento: son leads buenos que no pueden pagar ahora. Disqualified les enseñaría a Meta lo contrario.» **Correcto** en «más adelante», en «encajan» («leads buenos») y en «en vez de darlos por perdidos». «Ahora no pueden empezar» suaviza «no pueden pagar ahora», y el daily del mismo día lo resume como «dinero o momento». Se acepta: no inventa y evita hablar de nuestra cuota. «Ese mismo día»: la entrada es del 6-oct y uno de los cinco dijo que no ese día, así que **se sostiene**, aunque la fuente no pone hora a cada movimiento. |
| «Cada uno con su motivo apuntado» / «con su motivo apuntado, para saber cuándo volver a escribirles» | daily del 6-oct 07:45 (`campos_lead`) y daily 6-oct 19:16 (`cierres_negativos`) | El motivo consta para **cuatro de los cinco** (presupuesto o momento). El quinto no tiene motivo en el bus. **Ninguna fuente** dice que se les pusiera fecha para volver a escribirles. |
| «Un aviso cuando una lleva demasiado tiempo quieta» | `api/seguimientos.js` l. 1-10, 21-70, 113-163 · `vercel.json` l. 191-192 | **Verdad hoy, con matices.** Cron de lunes a viernes a las 07:15 UTC. Recorre todas las oportunidades abiertas de GHL. Si una lleva en la misma etapa más días de los que marca su regla (de 1 a 30 según etapa), crea **una tarea** con el siguiente movimiento ya escrito, asignada a una persona. «No manda nada al cliente.» Matices: (1) el aviso es una tarea en el CRM, no una notificación; (2) el código es solo para GoHighLevel y asigna siempre a Maikel (`USUARIO_MAIKEL`), así que «encima del CRM que ya usas» está probado solo en GHL; (3) «un panel para que dirección vea qué se está parando» es Intelligence: demo con datos ficticios y modo real solo para Qualivo (`intelligence/README.md`). La misma frase ya está publicada en `equipo-comercial-no-usa-el-crm` l. 140. No es crítico, pero conviene precisarlo (pieza 1, «Qué simplificaría»). |
| Media hora y plan por escrito en 24 horas (CTA de las piezas 1 y 2) | `diagnostico/index.html` l. 240, 336, 340, 422 | «30 minutos. Te mandamos el plan por escrito en 24 horas, lo hagas con nosotros o no.» **Coherente.** Es una promesa de entrega del diagnóstico gratuito, no precio ni garantía (R10). `/diagnostico/` dice «con tus números delante», no «con tu CRM abierto» (ver Riesgos). |
| Precio y garantía (R10) | las tres piezas | No aparecen. El 1.000 €/mes y los 1.500 € del daily no se usan. La pieza 2 quita además «20 €/mes por usuario». **Cumple.** |
| Nombres y datos de terceros (R5) | las tres piezas | Sin nombres ni empresas. **Cumple.** Riesgo menor de que alguno de los «más adelante» se reconozca por la fecha (Riesgos de las piezas 1 y 3). |
| Tasa de plantones (R7), fallo con datos personales (R8), envío automático por WhatsApp (R9) | las tres piezas | No aparecen. **Cumple.** |
| Raya larga y punto y coma (R11) | texto visible y JSON-LD de la pieza 1, párrafos nuevos y CTA de la pieza 2, texto e imagen de la pieza 3 | Ninguna. **Cumple.** Los «no es X, es Y» disfrazados y los lemas sí aparecen (críticos). |

---

# PIEZA 1 · Artículo «Pipeline de ventas» (`blog/pipeline-de-ventas/index.html`)

Keyword: «pipeline de ventas». Revisado: title, meta y og, «En 30 segundos», texto visible, destacado, regla, «Qué hacemos nosotros», FAQ visible y JSON-LD (las cuatro respuestas son idénticas a las visibles), post-cta y «Sigue leyendo».

Etapa del Revenue Journey: **seguimiento** (con un paso por reactivación en «más adelante»).

Fila de Notion: Diseño ok **sí** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **5** · Veredicto **PUBLICAR CON CAMBIOS**.

Ángulos que aplican: 1-6, 11 (cierre como mini landing), 12 y 13. Carrusel, reel, anuncio y outbound no aplican.

## Nota Global (1-10)

5/10.

## Resumen Ejecutivo

Buen tema para la semana 41 y bien anclado: un dato propio de ayer (siete tareas con fecha para todos los tratos abiertos) y una distinción útil entre «más adelante» y «perdido». Encaja con R13: cualquier director comercial se reconoce en «la ficha cuenta todo en pasado». Pero el artículo se equivoca de día cuatro veces (el 6-oct fue martes, no lunes) y en una pieza cuyo valor es el dato real, ese error se ve. Además convierte siete tareas en «siete tratos, una por trato», pone una opinión en boca de Maikel («lo que haría»), dice «lo que funciona» de algo que empezó ayer, y tiene un lema en el destacado, dos frecuencias sin fuente («casi nunca», «casi siempre») y dos «no es X, es Y» disfrazados. El claim de producto («un aviso cuando una lleva demasiado tiempo quieta») es verdad en `api/seguimientos.js`. Todo se arregla frase a frase.

## Lo Mejor

- Dato propio, fechado y verificable en el daily del 6-oct. El texto visible le atribuye bien el trabajo al agente de Growth (l. 112).
- La sección 3 («más adelante» frente a «perdido») está sacada de una decisión real del 6-oct y se lee como consejo, no como caso.
- Las tres señales de oportunidad parada son concretas y se pueden mirar en cualquier CRM. Buen material para que lo cite un LLM.
- FAQ del schema idéntica a la visible. Un solo botón al diagnóstico con UTM (R15). Sin precio, sin garantía, sin nombres, sin raya larga ni punto y coma.
- El cierre («Qué hacemos nosotros con esto») describe algo que existe hoy en el código.

## Lo Más Débil

- El día de la semana, mal en cuatro sitios.
- Siete tareas contadas como siete tratos.
- Voz mezclada: el blog es «nosotros» (Content OS §2.2) y l. 99 cuela un «haría» de Maikel.
- «Lo que funciona» sobre una medida de un día.
- Destacado con forma de lema y frecuencias sin fuente.

## Problemas Críticos Detectados

Frase exacta que falla → frase propuesta.

**C1.1 · R1 y R4 (l. 99, texto visible)**
«El lunes 6 de octubre repasamos los tratos abiertos de nuestra propia empresa. Esto es lo que hicimos y lo que haría en cualquier equipo comercial.»
→ «El martes 6 de octubre, nuestro agente de Growth repasó los tratos abiertos de Qualivo. Esto es lo que hicimos y lo que recomendamos a cualquier equipo comercial.»
Por qué: el 6-oct fue martes (el propio bus avisa el 4-oct: «el lunes es 5-oct, no 6-oct»). «Lo que haría» es una opinión de Maikel en primera persona sin fuente (R4) y rompe la voz «nosotros» del blog. Las tareas las creó el agente.

**C1.2 · R1 (l. 111, H2)**
«Lo que hicimos el lunes con nuestros tratos abiertos»
→ «Lo que hicimos el 6 de octubre con nuestros tratos abiertos»
Por qué: mismo error de día.

**C1.3 · R1 (l. 104, «En 30 segundos», y l. 112, texto visible)**
«siete tareas, una por trato» y «Fueron siete tareas, una por trato.»
→ «siete tareas en total» y «Fueron siete tareas.»
Por qué: la fuente dice «todos los tratos abiertos (7 creadas)». Cuenta tareas, no tratos. «Una por trato» es probable, pero no está escrito. Si Growth confirma que son siete tratos, se puede volver a poner.

**C1.4 · R11 (l. 112, texto visible)**
«Ninguna manda un mensaje sola: cada tarea le dice a una persona qué toca hacer y qué día.»
→ «Cada tarea le dice a una persona qué toca hacer y qué día. Las cadencias de mensajes no se tocaron.»
Por qué: «ninguna hace X: hace Y» es un «no es X, es Y» disfrazado. La segunda frase es lo que dice la fuente («sin accion en cadencias») y mantiene lo que buscaba R9.

**C1.5 · R1 (l. 113, texto visible)**
«Cada uno con su motivo apuntado.»
→ Eliminar la frase. El párrafo queda: «Ese mismo día movimos a «más adelante» a varios contactos que encajan pero que ahora no pueden empezar, en lugar de darlos por perdidos.»
Por qué: el motivo consta en el bus para cuatro de los cinco, no para todos. Si Growth confirma el quinto, se puede reponer.

**C1.6 · R11 y R1 (l. 115, destacado)**
«El historial te dice dónde está cada oportunidad. La siguiente acción con fecha te dice si va a llegar a venta.»
→ «Abre cualquier ficha y busca qué toca ahora y qué día. Si no lo pone, esa oportunidad está parada.»
Por qué: es un lema de dos frases en espejo («X te dice esto, Y te dice lo otro»), que es la versión disfrazada del contraste vetado. Además promete de más: una fecha no te dice si una oportunidad llegará a venta.

**C1.7 · R1 y R3 (l. 106, «En 30 segundos»)**
«Lo que funciona: una fecha en cada siguiente paso, mirar las tareas vencidas cada mañana y separar «más adelante» de «perdido».»
→ «Lo que recomendamos: una fecha en cada siguiente paso, mirar las tareas vencidas cada mañana y separar «más adelante» de «perdido».»
Por qué: las tareas se crearon ayer y no hay resultado. «Lo que funciona» presenta como resultado algo que aún no se ha medido.

**C1.8 · R1 y R11 (l. 118, texto visible)**
«Casi nunca hay una señal clara. Lo que hay es una de estas tres cosas:»
→ «Hay tres señales que se ven en el CRM:»
Por qué: «casi nunca» es una frecuencia sin fuente (mismo criterio que el carrusel de plantones v2, `ed6bf9a`), y «no hay X, lo que hay es Y» es el contraste vetado.

**C1.9 · R1 (l. 124, texto visible)**
«El comercial lo intuye, pero tiene muchas más oportunidades abiertas y esta no le está llamando. Dirección se entera cuando alguien prepara el informe, o a fin de mes. Y el cliente lleva días sin noticias.»
→ «Si nadie lo mira, pasa esto: el comercial lo intuye, pero tiene otras oportunidades que sí le llaman. Dirección se entera cuando alguien prepara el informe. Y el cliente lleva días sin noticias.»
Por qué: tal como está, describe lo que pasa en cualquier empresa como un hecho general, sin fuente. Con la condición delante es una escena posible y sigue siendo «me pasa a mí». Fuera «o a fin de mes», que añade otra generalización.

**C1.10 · R1 y R2 (l. 129, texto visible)**
«Si falta una de las tres, el CRM la trata como parada. Es lo que hicimos el lunes con las nuestras.»
→ «Si falta una de las tres, trátala como parada. El 6 de octubre lo hicimos con las nuestras: una tarea con fecha en cada trato abierto.»
Por qué: un CRM no trata nada como parado por sí solo, y la frase se puede leer como una función del CRM. «El lunes» es el mismo error de día. La fuente habla de tareas con fecha, no de que asignáramos «quién la lleva», así que «es lo que hicimos» cubría más de lo que se hizo.

**C1.11 · R1 (l. 132, texto visible)**
«Casi siempre basta con mover una fecha o hacer la llamada.»
→ «Con cada una hay dos salidas: hacer hoy lo que tocaba o ponerle una fecha nueva con el motivo.»
Por qué: «casi siempre» es una frecuencia sin fuente.

**C1.12 · R11 (l. 163, «Sigue leyendo»)**
«Seguimiento comercial: las ventas no se pierden por un «no», se pierden por silencio»
→ «Seguimiento comercial: qué hacer cuando un cliente deja de contestar»
Por qué: es texto visible de esta pieza y es el «no es X, es Y» literal. Es el título del artículo enlazado, así que aquí basta con cambiar el ancla. El H1 de `seguimiento-comercial` necesita el mismo arreglo en la próxima pasada.

## Qué Eliminaría

- «Cada uno con su motivo apuntado» (C1.5).
- «o a fin de mes» (C1.9).
- El H2 vacío «Qué hacer» (l. 126), que va seguido de cuatro H2 numerados. Como se dijo el 30-sep y el 6-oct: o lleva una frase de respuesta debajo («Cuatro hábitos, de más diario a más semanal.») o los pasos pasan a H3.

## Qué Simplificaría

- **l. 143, «Qué hacemos nosotros»:** el claim se sostiene en `api/seguimientos.js`, pero «aviso» suena a notificación. Propuesta: «Trabajamos encima del CRM que ya usas: cada oportunidad con su siguiente acción y su fecha, una tarea con el siguiente paso ya escrito cuando una lleva demasiado tiempo en la misma etapa, y un panel para que dirección vea qué se está parando sin pedir informes.» Así describe exactamente lo que hace el código.
- **Post-cta (l. 154):** tres promesas encadenadas. Propuesta: «Media hora con tus números delante. Vemos qué oportunidades se están parando y en 24 horas tienes el plan por escrito.» Además, «con tu CRM abierto» no es lo que dice `/diagnostico/` («con tus números delante»).

## Qué Reforzaría

- **Primera frase con respuesta a la keyword.** Hoy el lede es un gancho y la definición de pipeline solo está en la FAQ. Propuesta para después del lede: «Un pipeline de ventas es la lista de tus oportunidades abiertas por etapa. Sirve de poco si no dice qué toca hacer en cada una y qué día.»
- **Enlazado desde los pilares.** Ni `crm-para-pymes` (el pilar que el artículo cita en l. 95) ni los pilares de la semana 41 (`equipo-comercial-no-usa-el-crm`, `seguimiento-comercial`) enlazan a esta pieza. Content OS §8: «se enlaza desde el pilar».
- **Lo que ya hace nuestro sistema.** `api/seguimientos.js` tiene una regla para «más adelante»: a los 30 días en esa etapa crea una tarea de «toque de los 30 días». Es la prueba de la sección 3 («alguien le escribirá cuando llegue ese día»). Se puede contar como «en nuestro CRM, una oportunidad que lleva 30 días en «más adelante» genera una tarea para escribirle», tras confirmar con Growth que los cinco siguen abiertos en esa etapa.

## Riesgos

- **Tamaño de nuestra cartera.** «Siete tareas para todos los tratos abiertos» deja deducir que Qualivo tiene unos siete tratos abiertos. No lo prohíbe ninguna regla (R7 es la tasa de plantones), pero un prospecto puede leerlo como cartera pequeña. Que lo decida Maikel. Con C1.3 el número queda en «siete tareas» y el riesgo baja.
- **Contactos en «más adelante» (R5).** Son oportunidades abiertas, y uno dijo que no el 6-oct. Si leen «ese mismo día movimos a más adelante a varios contactos», alguno puede reconocerse. No hay juicio sobre su negocio ni nombre, así que es un riesgo bajo.
- **UTM.** `utm_campaign=articulo` en los tres enlaces. El Content OS §9 pide el tema de la semana (por ejemplo, `s41-siguiente-paso`). Es igual en todo el blog desde `f34e860`, así que conviene decidirlo para todo el blog. Sin eso, el panel del viernes no podrá separar la semana 41.
- **Plantilla.** El header dice «Agentes de IA para tu sistema comercial», contra §2.1 («la IA es el mecanismo, el problema va primero»). Es de la plantilla, fuera de esta pieza.
- **Canibalización con `equipo-comercial-no-usa-el-crm`: baja-media.** Las dos piezas comparten «siguiente acción con fecha» y «repaso semanal con el CRM abierto». La keyword es distinta y este artículo añade las tres señales y «más adelante». Para que no compitan, `equipo-comercial-no-usa-el-crm` debería enlazar aquí en su paso 1.

## Impacto Esperado

Medio en búsqueda: «pipeline de ventas» tiene volumen y competencia de SaaS. Este artículo se diferencia con un dato propio y con las tres señales. Alto en credibilidad si el dato queda exacto. Hoy el día equivocado lo desmiente cualquiera que mire un calendario. Para la North Star, el CTA conecta bien con el problema («¿sabes qué oportunidades llevan días sin moverse?»), y quien hace clic llega con un dolor concreto.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Usa `.post-resumen`, `.post-destacado`, `.pnum` y `.post-regla`, así que cumple el mínimo de elementos visuales. Los párrafos son cortos y se leen bien en móvil. El fallo de jerarquía es el H2 «Qué hacer» vacío. Falta un elemento que la idea pide: una tabla de tres filas (señal, cómo se ve en el CRM, qué hacer), que además es lo que mejor extraen los LLMs.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook:** «Una oportunidad parada no avisa» funciona y conecta con el cierre, donde nosotros sí ponemos el aviso.
- **Claridad:** alta.
- **Credibilidad:** la base es buena y el claim de producto es cierto. Pero falla el día (C1.1, C1.2, C1.10), la cuenta (C1.3) y hay tres generalizaciones sin fuente (C1.8, C1.9, C1.11).
- **CTA:** conectado y fiel a `/diagnostico/`, aunque el sub es largo.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Alineado con el tema de la semana 41 del Content OS §5.3 (siguiente paso y CRM). Habla de una fuga (oportunidades que se paran sin que nadie lo vea) y de un sistema (tareas, revisión, «más adelante»), no de herramientas. Acerca a pilotos por la vía del diagnóstico, y el lector sale con una revisión que puede hacer hoy y con un motivo para pedir ayuda.

## Versión Mejorada del Hook

«Una oportunidad parada no avisa. El martes 6 de octubre nuestro agente de Growth le puso una tarea con fecha a cada trato abierto de Qualivo: siete tareas. Así se ve en un pipeline de ventas qué oportunidades se están quedando paradas.»

## Próximo Experimento Recomendado

Dentro de dos semanas, pedir a Growth cuántas de las siete tareas se hicieron en su fecha y cuántas oportunidades cambiaron de etapa. Cuando ese dato esté cerrado (R3), actualizar el artículo con él, salga bien o mal. En contenido, comparar en 30 días los clics al diagnóstico desde este artículo con los de `equipo-comercial-no-usa-el-crm`.

## Veredicto: PUBLICAR CON CAMBIOS

---

# PIEZA 2 · Re-apunte de «CRM gratis para pymes» (`blog/crm-gratis-para-pymes/index.html`)

Revisado solo lo que cambió: el párrafo de l. 152 («¿Y cuándo pasar al plan de pago?»), el de l. 161 («Con eso, un plan gratis…»), el post-cta (l. 169-175) y `dateModified`.

Etapa del Revenue Journey: **seguimiento**.

Fila de Notion: Diseño ok **sí** · Copy ok **sí** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **8** · Veredicto **PUBLICAR**.

Ángulos que aplican: 1-6, 11 (post-cta) y 12.

## Nota Global (1-10)

8/10.

## Resumen Ejecutivo

Es un cambio pequeño y mejora la pieza. Quita un «no es X, es Y» literal («No es el calendario: es que…»), una cifra de precio de terceros sin fuente (20 €/mes por usuario, 3.000 €) y un segundo botón (calculadora) que competía con el diagnóstico. El párrafo nuevo usa el dato del 6-oct con exactitud («una tarea con fecha para cada trato abierto») y lleva al artículo nuevo con un ancla descriptiva. El CTA queda con un solo botón y UTM (R15). No hay críticos.

## Lo Mejor

- Retira el contraste vetado y las cifras sin fuente del párrafo antiguo.
- El dato del 6-oct dice lo que dice la fuente, sin «siete tratos» y sin «lunes».
- Un solo botón al diagnóstico, con UTM y con promesa coherente con `/diagnostico/` (media hora, plan en 24 horas).
- `dateModified` actualizado.
- Sin raya larga ni punto y coma en lo nuevo.

## Lo Más Débil

- «El plan se paga solo» es una frase hecha.
- Se pierde el enlace a `leads-pero-no-ventas`.
- «Es lo que hicimos en nuestro propio CRM», justo después de «un plan gratis», deja leer que usamos un plan gratis. No es así (GoHighLevel es de pago).

## Problemas Críticos Detectados

Ninguno.

## Qué Eliminaría

Nada.

## Qué Simplificaría

- **l. 152:** «Si un recordatorio te salva un presupuesto, el plan se paga solo.» → «Si un recordatorio te salva un presupuesto, el plan ya ha valido lo que cuesta.» Es opcional: la frase actual no rompe ninguna regla, pero suena a eslogan.
- **l. 161:** «Es lo que hicimos el 6 de octubre en nuestro propio CRM: una tarea con fecha para cada trato abierto.» → «Nosotros lo hicimos el 6 de octubre en nuestro CRM: una tarea con fecha para cada trato abierto.» Así no se insinúa que nuestro CRM sea gratis.

## Qué Reforzaría

- Volver a poner el enlace a `/blog/leads-pero-no-ventas/` en otra frase de la sección, porque es enlazado interno que se perdió.
- **Sub del post-cta:** «Media hora con tu CRM abierto» → «Media hora con tus números delante», que es lo que promete `/diagnostico/`. Si Maikel quiere pedir el CRM abierto en la llamada, que se cambie también en `/diagnostico/`.

## Riesgos

- Queda texto sin tocar fuera del alcance de este cambio: raya larga en l. 149 y en el FAQ «¿Qué CRM usáis vosotros?», «casi siempre el problema es de uso, no de software» (frecuencia sin fuente y «X, no Y»), y punto y coma en el FAQ de HubSpot. Conviene limpiarlo en la próxima actualización fuerte.
- El mismo de la pieza 1 con la UTM (`utm_campaign=articulo`).

## Impacto Esperado

Positivo. El artículo tiene intención de comparativa y ahora pasa al lector a un problema concreto (a quién le toca llamar hoy) y a un solo CTA. Puede que haya menos clics que con dos botones, pero más centrados en el diagnóstico.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

Sin cambios de diseño. El post-cta con un botón gana claridad.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Título del CTA:** «¿Tu CRM te dice a quién le toca llamar hoy?» es concreto y conecta con el artículo nuevo.
- **Credibilidad:** el dato es exacto.
- **CTA:** el sub es algo largo.

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Bien: una keyword de herramienta («CRM gratis») queda enlazada a la fuga de seguimiento y al diagnóstico, sin vender herramienta. Teje el cluster de la semana 41.

## Versión Mejorada del Hook

No aplica: el hook del artículo no cambió.

## Próximo Experimento Recomendado

Comparar en 30 días los clics al diagnóstico desde este post-cta con los de los 30 días anteriores (cuando tenía dos botones), y las visitas que pasan a `pipeline-de-ventas`.

## Veredicto: PUBLICAR

---

# PIEZA 3 · Borrador social «Tratos sin fecha» (`content/borradores/2026-10-07-bandera-roja-tratos-sin-fecha.md` + `content/infografias/2026-10-07/tratos-con-fecha.png`)

Revisado: ficha, texto de LinkedIn, pie de Instagram e imagen (1080 × 1350).

Etapa del Revenue Journey: **seguimiento**.

Fila de Notion: Diseño ok **sí, con cambios** · Copy ok **no** · Objetivo claro **sí** · CTA claro **sí** · Alineado con propuesta **sí** · Nota **6** · Veredicto **PUBLICAR CON CAMBIOS** (hay que volver a renderizar la imagen).

Ángulos que aplican: 1-7 (imagen única con estructura de bandera roja), 12 y 13.

## Nota Global (1-10)

6/10.

## Resumen Ejecutivo

La idea es buena y corta: un hábito real de ayer, una pregunta que cualquier dueño se hace («¿cuántas oportunidades tienen fecha?») y un CTA de conversación que cumple R15. La imagen está en el molde de Maikel (tinta, crema, naranja, Anton y Space Grotesk) y se lee en móvil. Pero el texto dice «el lunes» (fue martes), cuenta siete tratos cuando la fuente cuenta siete tareas, usa un contraste disfrazado («ninguna manda nada sola: es para una persona») y añade algo que ninguna fuente dice («para saber cuándo volver a escribirles»). En la imagen, la pareja «más adelante» no casa: la bandera roja es «sin fecha» y la respuesta no da fecha. Y el pie cierra con una generalización sin fuente.

## Lo Mejor

- Hook con dato real y fechado. La imagen ya pone «El 6 de octubre», que es lo correcto.
- La pregunta final es fácil de contestar en comentarios, buena para una conversación (R15).
- «Ninguna manda nada sola» intenta cubrir R9, que es la intención correcta, aunque la forma falla.
- Sin nombres, sin precio, sin tasa de plantones, sin raya larga ni punto y coma.
- La ficha dice etapa, dato, fuente, reglas y CTA, como pide el Content OS §10.

## Lo Más Débil

- El día y la cuenta, igual que en el artículo.
- La segunda fila de la imagen: el problema y la respuesta no hablan de lo mismo.
- «La bandera roja de un CRM es una ficha que solo cuenta lo que ya pasó» llega en el cuarto párrafo. La tensión llega tarde para LinkedIn.

## Problemas Críticos Detectados

**C3.1 · R1 y R4 (l. 24, LinkedIn · l. 41, Instagram)**
«El lunes le pusimos una tarea con fecha a cada trato abierto de mi empresa.»
→ «El 6 de octubre, en mi empresa, el agente que lleva el CRM le puso una tarea con fecha a cada trato abierto.»
Por qué: el 6-oct fue martes. Con «6 de octubre» la frase vale también si LinkedIn se retrasa al jueves 15, como prevé la ficha. Lo hizo el agente de Growth, como dice el artículo. Con la voz de Maikel, «le pusimos» deja leer que lo hizo él (mismo criterio que la revisión del 5-oct). Contarlo además da el ángulo más interesante.

**C3.2 · R1 (l. 26, LinkedIn · l. 42, Instagram · imagen, subtítulo)**
«Siete tratos, siete tareas.»
→ «Siete tareas, cada una con su fecha.»
Por qué: la fuente dice «7 creadas» para «todos los tratos abiertos». Cuenta tareas, no tratos. Corregir también la ficha (l. 12: «Siete es el número de tratos abiertos»).

**C3.3 · R11 (l. 26-27, LinkedIn)**
«Cada una dice qué toca hacer y qué día. Ninguna manda nada sola: es para una persona.»
→ «Cada una le dice a una persona qué toca hacer y qué día.»
Por qué: «ninguna hace X: es para Y» es el «no es X, es Y» disfrazado. La frase propuesta deja claro que hay una persona detrás, así que R9 sigue cubierto.

**C3.4 · R1 y R4 (l. 29-31, LinkedIn)**
«Ese mismo día movimos a «más adelante» a varios contactos que encajan pero que ahora no pueden empezar. Con su motivo apuntado, para saber cuándo volver a escribirles.»
→ «Ese mismo día movimos a «más adelante» a varios contactos que encajan pero que ahora no pueden empezar, en vez de darlos por perdidos.»
Por qué: ninguna fuente dice que se les pusiera fecha ni que el motivo sirva para saber cuándo escribirles. El motivo consta para cuatro de los cinco. «En vez de darlos por perdidos» sí está en la fuente: no se mandó Disqualified a Meta porque son leads buenos.

**C3.5 · R1 (imagen, segunda fila)**
Bandera roja: ««Más adelante» se queda sin fecha.» · Lo que hicimos: «Va a «más adelante» con su motivo.»
→ Bandera roja: «Al que dice «ahora no» se le da por perdido.» · Lo que hicimos: «Va a «más adelante» y sigue en el CRM.»
Por qué: tal como está, la respuesta no contesta a la bandera (la bandera es «sin fecha» y lo que hicimos no da fecha) y «con su motivo» no consta para todos. La pareja propuesta es exactamente lo que cuenta el cambio-meta del 6-oct.

**C3.6 · R1 (imagen, pie)**
«Las que no la tienen son las que se están parando.»
→ «Las que no la tienen son las primeras que hay que mirar.»
Por qué: afirma como regla general algo que nadie ha medido. La propuesta lo convierte en consejo.

## Qué Eliminaría

- La etiqueta «BANDERA ROJA» repetida: está arriba como antetítulo y otra vez como cabecera de columna. Para la columna, «LO QUE PASA» o «LA SEÑAL».
- En LinkedIn, «Nada de lo que toca después.» repite lo que ya dice «solo cuenta lo que ya pasó».

## Qué Simplificaría

- **Imagen:** hay un hueco vacío de unos 130 px entre la segunda fila y la línea naranja. Se puede subir el pie o dar más aire a las tarjetas.
- **Subtítulo de la imagen con C3.1 y C3.2:** «El 6 de octubre, mi agente de CRM le puso una tarea con fecha a cada trato abierto de mi empresa. Siete tareas.» Si queda largo a 40 px, bajar a 36.

## Qué Reforzaría

- **UTM en el enlace del comentario** (ficha, l. 19). El Content OS §9 la hace obligatoria en todo enlace propio: `https://qualivo.io/blog/pipeline-de-ventas/?utm_source=linkedin&utm_medium=organic&utm_campaign=s41-siguiente-paso&utm_content=bandera-roja-tratos-sin-fecha`, y la versión `utm_source=instagram` para la bio o las stories. No es una R, pero es prioridad cero del Content OS.
- **Subir la tensión en LinkedIn:** la bandera roja («una ficha que solo cuenta lo que ya pasó») va en el párrafo 2, justo después del hook, y «más adelante» pasa al final como segunda capa.

## Riesgos

- **Contactos en «más adelante» (R5):** el mismo riesgo que en el artículo, más alto aquí porque el LinkedIn de Maikel es la cobertura del outbound y los contactos abiertos lo miran. Valorar quitar la frase de «más adelante» del post de LinkedIn y dejarla solo en la imagen sin fecha.
- **Tamaño de la cartera:** el mismo de la pieza 1. En el perfil personal de Maikel pesa más.
- **Publicación:** la ficha ya dice «sin publicar» hasta el ok de Maikel a R16 (Content OS §12, D1). Si el post 1 de cobertura sale hoy, la ficha mueve LinkedIn al jueves 15. Con C3.1 el texto aguanta ese cambio.

## Impacto Esperado

Bajo en alcance y medio en conversación: la pregunta es fácil de contestar con un número, y cada respuesta es una oportunidad de seguir la conversación por mensaje privado. Hacia la North Star empuja poco por sí sola, pero sostiene el artículo y la cobertura del outbound de la semana 41.

## Revisión de Diseño (portada, jerarquía visual, ritmo, legibilidad)

El título «TRATOS SIN FECHA» para el scroll, y el naranja en «SIN FECHA» lleva la vista a lo que importa. El molde de Maikel es correcto (Content OS §2.2) y no mezcla la paleta de la web. Las tarjetas en dos columnas se leen en móvil. Fallan la etiqueta duplicada, el hueco vacío y la segunda fila (C3.5). El handle y QUALIVO.IO al pie siguen el patrón de las piezas anteriores.

## Revisión de Copy (hook, claridad, credibilidad, CTA)

- **Hook:** bueno una vez corregido el día. Con el agente (C3.1) gana curiosidad.
- **Claridad:** alta.
- **Credibilidad:** cae por el día, por la cuenta y por la frase sin fuente (C3.1, C3.2, C3.4).
- **CTA:** pregunta cerrada y fácil de contestar. Bien para R15 (conversación).

## Revisión Estratégica (alineación con Qualivo, alineación con North Star)

Alineada con el tema de la semana 41 y con el artículo del día. Habla de una fuga de seguimiento y de un hábito, no de herramientas. Cumple R12: primero el acierto, sin fallo. Cumple R13: «¿cuántas de tus oportunidades tienen fecha?» es una pregunta que cualquier director comercial se hace.

## Versión Mejorada del Hook

«¿Cuántas oportunidades de tu CRM tienen fecha para el siguiente paso? El 6 de octubre, en mi empresa, hicimos que todas la tuvieran.»

## Próximo Experimento Recomendado

Publicar la misma pieza con dos hooks en días distintos (el del dato, «El 6 de octubre…», frente al de la pregunta, «¿Cuántas oportunidades…?»). Medir comentarios con número y mensajes privados que acaban en conversación, no likes. Cruzar los clics del comentario con la UTM en el panel del viernes.

## Veredicto: PUBLICAR CON CAMBIOS

---

# Tabla resumen

| Pieza | Nota | Veredicto | Críticos |
|---|---|---|---|
| 1 · Artículo «Pipeline de ventas» | 5/10 | PUBLICAR CON CAMBIOS | 12 (C1.1 a C1.12) |
| 2 · Re-apunte «CRM gratis para pymes» (dos párrafos y post-cta) | 8/10 | PUBLICAR | 0 |
| 3 · Borrador social «Tratos sin fecha» (texto e imagen) | 6/10 | PUBLICAR CON CAMBIOS (re-render de la imagen) | 6 (C3.1 a C3.6) |
