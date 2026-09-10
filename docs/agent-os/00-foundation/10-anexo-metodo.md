# ANEXO A · Lo que añado al prompt del arquitecto

El prompt maestro de Maikel (§0-36) es la base. Estas siete piezas no están en él y,
después de inspeccionar el sistema real, creo que sin ellas la arquitectura no aguanta.

## A1 · El recurso escaso no son los agentes: es la atención de Maikel

Qualivo es una persona con agentes. El cuello de botella estructural no es la capacidad de
ejecución (10 rutinas diarias funcionando lo demuestran) sino **el número de decisiones al día
que solo Maikel puede tomar**. `cerebro.md` lo dice explícitamente: las decisiones de dinero y de
campaña las toma Maikel.

**Regla:** cada ficha de agente añade `ATTENTION_COST` = nº de decisiones humanas por semana que
genera. Un agente que produce tres aprobaciones diarias es un pasivo aunque su KPI sea bueno.
El Brain tiene un presupuesto semanal de atención y lo reparte como reparte dinero.

## A2 · Escalera de confianza: 🟢🟡🔴 debe poder subir de nivel

El modelo de permisos del prompt es estático. Si una acción nace 🟡, muere 🟡, y Maikel es el
aprobador para siempre. La autonomía nunca crece.

**Regla:** cada acción 🟡 lleva contador. Tras N ejecuciones consecutivas aprobadas sin
corrección (propuesta: N=10 para acciones reversibles), el Brain propone promoverla a 🟢 en el
Weekly Review. Una sola corrección la devuelve a 🟡. La promoción la firma Maikel y se registra
en Decisiones. Nunca se promueve nada irreversible ni que gaste dinero.

## A3 · Radio de impacto, además de permiso

Aprobar no es la única dimensión. Importa qué pasa si el agente se equivoca.

`BLAST_RADIUS`: **INTERNO** (solo lo ve Qualivo) · **VISIBLE_CLIENTE** (llega a un cliente o
prospecto) · **IRREVERSIBLE** (dinero, contrato, borrado, envío masivo).

Un error interno se corrige. Uno visible cuesta reputación. Uno irreversible cuesta caja. Dos
acciones pueden ser ambas 🟡 y necesitar controles distintos.

## A4 · La sesión es runtime, no almacenamiento

Este es un fallo activo, no una hipótesis: hay rutinas que dependen de claves en
`/tmp/claude-0/...`. El contenedor es efímero.

**Regla dura:** nada que deba sobrevivir a un contenedor puede vivir solo en la sesión o en el
scratchpad. Todo estado va a repo, Notion, Sheets o CRM. Un agente debe poder morir y renacer
leyendo su estado desde fuera. Corolario: si un agente necesita "recordar la conversación" para
funcionar, está mal diseñado.

## A5 · Si solo se garantiza un ritmo, que sea el semanal

La inspección demuestra lo contrario de lo que uno esperaría: lo diario se sostiene solo, lo
semanal se cae. Y lo semanal es lo que corrige el rumbo.

**Regla:** el Weekly Review es la única rutina que no puede fallar en silencio. Si no se ejecuta,
avisa. Un día sin ejecutar cuesta un día; una semana sin revisar cuesta la semana entera.

## A6 · Son tres capas, no dos

El prompt separa Internal OS y Client OS. Falta la tercera, que está mezclada en la misma
infraestructura: el **Personal OS de Maikel** (inglés, entrenamientos, SO personal). No hay que
eliminarla, hay que nombrarla y aislarla, porque compite por el mismo recurso escaso (A1) y
contamina la medición de rentabilidad.

## A7 · Todo agente necesita latido

Sin `HEALTH` no hay organización, hay esperanza. Añadir a cada agente: `LAST_RUN`,
`LAST_RESULT`, `CONSECUTIVE_FAILURES`, `SILENT_SINCE`. Y una regla: **el silencio es un fallo**.
Un agente que no reporta en su cadencia esperada se marca degradado y aparece en el parte diario.
Bastó mirar `last_run` una vez para encontrar un fallo de un mes.

## A8 · Métrica que falta

El prompt define la cadena `Opportunities → … → Profit`. Añadir el denominador:
**coste por reunión cualificada, incluyendo el coste del sistema** (modelos, SaaS, APIs) y
**decisiones de Maikel consumidas por reunión**. Un OS que multiplica reuniones y multiplica
aprobaciones no ha escalado nada.
