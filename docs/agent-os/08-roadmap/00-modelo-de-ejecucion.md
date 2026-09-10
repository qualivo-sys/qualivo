# CÓMO SE EJECUTA ESTO

Pregunta de Maikel (10-sep): *"¿esto lo ejecutas tú o cómo?"*

## La respuesta honesta primero

**Yo no puedo ser el arquitecto permanente.** Soy una sesión: cuando se cierra, el contenedor
muere y lo que no esté en el repo se pierde. Es exactamente la regla A4 del Anexo aplicada a mí
mismo. Por eso todo lo que produzco va al repo antes de terminar cada bloque, y por eso el rol de
arquitecto tiene que dejar de ser un chat y convertirse en un fichero + una rutina.

Tampoco puedo ejecutar lo que no puedo ver. No tengo acceso a n8n, GoHighLevel, Smartlead,
Todoist, Quipu, Vapi ni Twilio. Puedo leer el repo, las rutinas, las sesiones y Notion.

## Tres carriles en paralelo

### Carril 1 · Yo. Arquitectura y documentación

Todo lo que se hace leyendo y escribiendo en el repo. Sin bloqueo, empieza ya.

| Entregable | Fase | Depende de ti |
|---|---|---|
| Fichas AS-IS de los 3 agentes vivos | 1 | no |
| `registry.json` v1 | 1 | no |
| Diagnóstico completo con solapamientos y ownership | 2 | no |
| Arquitectura del Internal OS | 3 | sí, decisión 3 |
| Protocolos definitivos: event, task, result, report | 4 | sí, decisión 3 |
| Especificación del Brain | 5 | sí, decisión 4 |
| Plan de migración de las 29 ramas | 9 | sí, aprobación |

### Carril 2 · Tus agentes. Su propio inventario

**Nadie conoce a un agente mejor que él mismo.** Que yo deduzca lo que hace Outbound leyendo sus
105 commits es más caro y menos fiable que preguntárselo. Además es la primera prueba real de que
el protocolo funciona: un encargo estructurado que vuelve como un parte estructurado.

Los encargos están escritos en `01-inventory/50-encargos-fase1.md`, listos para disparar por sus
timbres. Cada agente devuelve su ficha AS-IS y la escribe en su rama.

Coste para ti: disparar tres timbres. Coste para ellos: un turno.

### Carril 3 · Tú. Lo que nadie más puede hacer

1. Las cuatro decisiones de `01-inventory/90-unknowns.md`.
2. Confirmar si llegaron el CEO Brief del viernes 5 y el Weekly Plan del lunes 8.
3. Acceso o volcado de n8n, aunque sea una captura de la lista de workflows.
4. Aprobar la consolidación de ramas cuando llegue, porque toca ramas de agentes vivos.

## Regla de reparto

> Si se resuelve leyendo y escribiendo documentos, lo hago yo.
> Si requiere conocer una operación por dentro, lo hace el agente que la opera.
> Si requiere criterio de negocio, dinero o riesgo, lo haces tú.

## Cómo deja de depender de una sesión

El arquitecto se convierte en tres cosas duraderas:

1. **Este directorio** `docs/agent-os/`, en una rama que sí se integra.
2. **`registry.json`**, que sustituye a la tabla "Quién es quién" de `cerebro.md`, ya bifurcada en
   tres copias.
3. **Una rutina semanal de Arquitectura**, que revisa deriva: agentes sin ficha, ownership
   duplicado, rutinas caídas, fuentes de verdad nuevas. Se propone para el viernes, después del
   Weekly Review, y solo se crea cuando el Weekly Review vuelva a ejecutarse.

Mientras tanto, esta sesión hace de arquitecto. Cuando cierre, el trabajo sigue en el repo y
cualquier sesión nueva lo retoma leyendo este directorio.

## Orden de ejecución propuesto

**Ahora:** Carril 1 Fase 1 y encargos del Carril 2 escritos. Hecho.
**Cuando dispares los timbres:** llegan las fichas de los agentes y cierro Fase 1.
**Cuando contestes las 4 decisiones:** Fase 2 y 3.
**Primera reparación, antes que cualquier diseño:** el bucle semanal. Es el hallazgo H2 y no tiene
sentido diseñar aprendizaje sobre un ciclo que no se ejecuta.
