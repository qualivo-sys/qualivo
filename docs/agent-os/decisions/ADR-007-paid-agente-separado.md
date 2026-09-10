# ADR-007 · Paid Media es un agente separado, y multi-cliente

**Fecha** 2026-09-10 · **Estado** propuesta · **Revisa** ADR-001

**Contexto.** En ADR-001 dejé Paid fuera del diseño hasta que Qualivo tuviera presupuesto propio.
Al mirarlo de cerca, ese criterio estaba mal puesto: el dinero que ya se gasta en campañas es de
clientes, y es muy superior. Agente Adigital opera Google Ads sobre una cuenta real hoy, y el
dashboard de EAC gestiona 4.000 €/mes de presupuesto.

**Opciones.** (a) Ampliar Demand con las campañas. (b) Agente Paid separado, desplegado por
cliente. (c) Seguir esperando al presupuesto de Qualivo.

**Decisión.** (b).

**Razones.** Ownership distinto: Demand posee Tráfico → Lead, Paid posee Presupuesto → Tráfico
cualificado. Radio de impacto distinto: un fallo de Demand se corrige, un fallo de Paid gasta
dinero que no vuelve, y lo irreversible necesita su propio envoltorio de permisos. Cadencia
distinta: paid se vigila a diario, Demand es semanal. Conocimiento distinto.

**Consecuencias.** El agente de Qualivo se diseña ahora y se abre cuando se cumplan las tres
condiciones del 9-sep. El de clientes ya existe en Adigital y de ahí sale el playbook. Se mantiene
sin cambios la barandilla ya decidida: construir en pausado, activar es de Maikel. Pausar y
excluir sí son autónomos, porque frenar es reversible y acelerar no.
