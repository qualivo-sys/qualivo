# FASE 0 · G. UNKNOWN / MISSING INFORMATION

Lo que necesito para cerrar el AS-IS. Ordenado por lo que más bloquea el diseño.

## Bloqueantes para la Fase 2 (diagnóstico)

1. **¿Corrieron las rutinas semanales?** ¿Recibiste el CEO Brief el viernes 5-sep y el Weekly Plan el lunes 8-sep? Confirma o desmiente H2.
2. **n8n**: `automatizaciones/mapa-n8n.md` está pendiente desde el 9-sep. Sin él no se sabe qué está automatizado. ¿Cuántos workflows hay y cuáles están activos?
3. **Notion Sala de Mando**: ¿las bases Agentes / Tareas / Decisiones se usan de verdad o están vacías? Es la diferencia entre "tenemos control plane" y "tenemos las tablas creadas".
4. **Ventas y Automatización**: KEEP, MERGE o RETIRE. (H9)

## Necesarios para el TO-BE

5. **Cifras vivas con fuente**: recurrente actual, conversaciones/mes, propuestas/mes, reuniones/mes. `cerebro.md` da 4.100 €/mes recurrente y objetivo de 30 conversaciones / 8-10 propuestas / 2-4 clientes en septiembre. ¿Vigente a 10-sep? ¿Dónde está el marcador real?
6. **Coste del sistema**: qué se gasta al mes en Claude, Smartlead, Apollo, Vapi, n8n, HeyReach, Vercel. Sin esto no hay coste por reunión cualificada ni rentabilidad por cliente.
7. **Tiempo de Maikel**: cuántas decisiones al día quieres tomar. Es el recurso escaso de toda la arquitectura.
8. **Gestión de secretos**: dónde vive cada clave hoy y qué pasa cuando muere un contenedor.
9. **Clientes**: ¿cuáles siguen activos y facturando? El repo tiene ramas de siete.

## Preguntas de decisión (no de dato)

10. ¿La memoria compartida se consolida en **Notion** o en **el repo**? Hoy están las dos, y eso es la causa raíz de H4.
11. ¿Aceptas que un agente ejecute sin ti tras N ejecuciones limpias, o toda acción 🟡 seguirá pasando por ti indefinidamente?
