# Qualivo Growth OS V1 propuesta de simplificación para revisión

Fecha: 9 de octubre de 2026. Estado: BORRADOR NO OPERATIVO.

Esta revisión propone reducir mandatos contradictorios y aprovechar las sesiones, bases y rutinas existentes. No sustituye instrucciones vigentes, no autoriza cambios y no crea un nuevo registro operativo. Las decisiones aceptadas deberán incorporarse a las fuentes existentes; después este borrador quedará como antecedente.

## Alcance y evidencia

Base: [inventario del Chief of Staff](./2026-10-09-inventario-ecosistema-agentes.md), blob `c80bfcaed47c9d28572f379c12298cdae73d6e85`, rama de auditoría en commit `bd30a86b4254d211efe275fd2fe761d28eb5a843`.

Comprobaciones directas del repositorio el 9 de octubre:
- La API devuelve visibilidad pública y rama predeterminada `claude/eac-metrics-dashboard-qx7fkh`. No se ha cambiado ninguna.
- La enumeración devuelve 43 ramas en esta consulta; el inventario hablaba de 45. La diferencia no demuestra borrado ni explica su causa.
- En [main al commit revisado](https://github.com/qualivo-sys/qualivo/tree/3c18dc749b2f5aa45bcf7a23ece8a607ef286019) existe `docs/agent-os/registry.json`. El fichero declara versión `2.0-target`, fecha 10 de septiembre y diseño TO-BE. Debe corregirse la afirmación del inventario de que no existe en main; su existencia no demuestra uso operativo.
- Los ocho ficheros de `bus/out/` y el fichero mensual de tareas de main están vacíos en ese commit. Esto no acredita el estado de otros canales de coordinación.
- Esta revisión no ha accedido al estado vivo de las sesiones o rutinas de Claude ni a los permisos efectivos de las plataformas operativas.

No se incorporan aquí evidencias obtenidas de espacios privados, valores de credenciales, datos de contactos ni condiciones comerciales adicionales.

## Correcciones de interpretación del inventario

| Afirmación | Tratamiento recomendado |
|---|---|
| Coordinación cuadruplicada | Distinguir mandatos documentados de coordinadores que realmente operan. |
| Rutina ejecutada equivale a ciclo funcionando | Exigir resultado, decisión y seguimiento antes de dar el ciclo por validado. |
| Commits como medida de dedicación o retención | No usar ese indicador para inferir horas, calidad ni atención al cliente. Revisar entregas y compromisos. |
| Nadie gestiona retención | Describir la falta de evidencia encontrada; no convertirla en prueba de ausencia. |
| Credenciales sin rotar | Mantener como exposición reportada con remediación no acreditada hasta revisar el proveedor. |
| Un token descrito como ads_read explica escrituras | Verificar permisos efectivos, identidades y registros. El alcance citado no basta para esa atribución. |
| Modelo menor implica mayor riesgo | Evaluar errores y controles reales antes de cambiarlo. |
| Toda taxonomía distinta es duplicidad | Separar etapas comerciales, estados técnicos y marcos de diagnóstico; documentar correspondencias. |
| Sesión sin cron equivale a sesión inútil | Preservar sesiones activas a demanda y comprobar encargos antes de archivar. |
| Registro inexistente en main | Corregir: existe, pero declara diseño objetivo. |

## Diez decisiones propuestas

Todas pendientes de aprobación específica de Maikel.

| Pregunta del apartado 10 | Recomendación | Condición |
|---|---|---|
| 1 Quién dirige | Maikel decide. La sesión existente Qualivo Chief of Staff — Auditoría de agentes coordina el trabajo autorizado. ChatGPT asesora. | No activar leads ni Orchestrator adicional; ampliar el mandato del CoS solo tras aprobar el traspaso. |
| 2 CFO y Cerebro | Conservar Agente CFO y concentrarlo en finanzas. | Transferir y comprobar el seguimiento antes de retirar responsabilidades o rutinas antiguas. |
| 3 Registro oficial | Reutilizar Agentes de Sala de Mando, mantenido por CoS. | Distinguir sesiones, skills y rutinas. No eliminar otros registros hasta comprobar consumidores. |
| 4 Oferta única | Cerrar las decisiones pendientes de la propuesta del 7 de octubre y aprobar una versión. | Revisar propuestas anteriores individualmente; ninguna modificación automática de compromisos. |
| 5 Presupuesto Paid | Reconciliar cifras por canal, periodo, gasto, aprobación y alcance. | Paid aporta configuración y gasto; CFO capacidad; Maikel confirma el límite. |
| 6 Sala de Mando | Probar decisiones, tareas prioritarias y agentes en las bases existentes. | Sin rediseño integral ni nuevas bases. HQ funciona como entrada y biblioteca. |
| 7 Archivo de sesiones | Empezar por trabajos puntuales terminados y talleres sin dependencias. | Preservar ramas y entregables; transferir encargos antes de archivar. No archivar Intelligence por estar a demanda. |
| 8 Skills de Codex | Inventariar existencia, uso, permisos y almacenamiento de secretos por separado. | Una skill instalada no acredita un agente autónomo ni una integración activa. |
| 9 Modelo de Growth | Mantener hasta evaluar una muestra de trabajos y errores. | Calidad, coste, tiempo y supervisión determinan la decisión. |
| 10 Permisos del CoS | Lectura durante auditoría; después, escritura acotada para seguimiento si se aprueba. | Sin envíos, gasto, cambios de campañas ni despliegues. Si el conector no permite acotar técnicamente, documentar el límite. |

## Responsabilidades propuestas sin agentes nuevos

| Responsable existente | Responsabilidad principal | Límites |
|---|---|---|
| Maikel | Prioridades, presupuesto, oferta, compromisos y aprobaciones | Decide sobre el cambio concreto y su alcance. |
| ChatGPT | Analizar evidencia y preparar opciones | No transmite órdenes ni mensajes sin autorización. |
| Chief of Staff | Responsable, plazo, dependencias, bloqueos y evidencia de cierre | Coordina lo aprobado; no redefine estrategia. |
| Agente CFO | Situación financiera y escenarios | No asume coordinación general una vez validado el traspaso. |
| Growth | Web, CRM y cadencias de Qualivo | Propuesta de propietario operativo; confirmar traspaso con Paid. Cambios externos según aprobación. |
| Paid | Medición y recomendaciones de adquisición | Conserva las restricciones vigentes sobre activar, pausar y presupuestar. |
| Outbound | Operación outbound actual | Conservar funciones hasta revisar dependencias; no dividir ni ampliar canales en esta fase. |
| Contenido y Creative | Entregables de sus ámbitos | Coordinación explícita con Growth y Paid; aprobación de publicación según reglas vigentes. |
| Sesiones de cliente | Entrega, próximo hito y bloqueos de su cuenta | No reasignar ni archivar por volumen de commits. |
| Intelligence | Producto y análisis a demanda | Mantener fuera del archivo genérico. |

## Paquetes de cambio para aprobación

### A Seguridad y continuidad

1. Identificar credencial por servicio y referencia segura, sin copiar su valor.
2. Comprobar propietario, alcance efectivo, consumidores y evidencia de rotación o revocación.
3. Preparar sustitución en el almacenamiento de secretos ya disponible; no crear infraestructuras nuevas.
4. Solicitar aprobación del cambio concreto, con consumidores afectados y ventana de intervención.
5. Actualizar consumidores autorizados, realizar una prueba sin envíos ni gasto y revocar la anterior cuando proceda. Si hay abuso activo, proponer contención inmediata con su impacto.
6. Ante fallo, detener el cambio y corregir con una credencial nueva válida; no restaurar una credencial comprometida.
7. Cerrar solo con evidencia del proveedor, resultado de la prueba y ausencia de valores en documentación.

No se considera resuelto un incidente por borrar una cadena de un fichero ni por convertir un repositorio en privado. Revisar también exposición previa e historial antes de proponer su saneamiento.

### B Traspaso de coordinación

- Preparar la lista de rutinas actuales del CFO: disparador, entrada, salida, destinatario, última ejecución y dependencias.
- Separar rutinas financieras de seguimiento general.
- Aprobar propietario y mecanismo de seguimiento usando recursos existentes.
- Probar un ciclo de forma manual, sin otra automatización.
- Retirar tareas duplicadas solo después de comprobar la continuidad.
- Recuperación: restaurar la asignación previa si el seguimiento no funciona; no duplicar notificaciones indefinidamente.

### C Simplificación documental

- Resolver presupuesto y oferta antes de marcar versiones anteriores como históricas.
- Mantener un enlace a la fuente por tipo de dato.
- No copiar métricas a varias bases; guardar referencia, fecha y definición.
- Archivar cada sesión solo con encargo resuelto o transferido, dependencias comprobadas y entregables recuperables.
- No cambiar rama por defecto, fusionar ramas ni alterar despliegues en este paquete.

## Prueba de siete días después de aprobación

Seleccionar una entrega real de cliente y una tarea interna. Usar Tareas y Decisiones existentes.

Cada tarea contiene responsable único, próximo paso, fecha, dependencia, aprobación necesaria y evidencia de cierre. El especialista entrega al CoS; el CoS comprueba y eleva únicamente decisiones pendientes. Si no hay acuse o el plazo peligra, informa del bloqueo a Maikel; no declara finalización por inferencia.

Criterios: todas las tareas seleccionadas con responsable y próximo paso, ninguna finalización sin evidencia, ningún cambio fuera de autorización y un único resumen para Maikel. Registrar minutos de coordinación y decisiones reabiertas; comparar con la referencia inicial al cerrar la semana.

La prueba valida coordinación, no rentabilidad ni rendimiento estadístico de campañas.

## Orden de implementación propuesto

1. Verificar exposiciones y compromisos próximos; preparar acciones específicas.
2. Aprobar y ejecutar correcciones de seguridad con pruebas de continuidad.
3. Aprobar responsabilidad CFO y CoS y reconciliar oferta y presupuesto.
4. Probar el ciclo semanal con recursos existentes.
5. Retirar únicamente redundancias demostradas.
6. Tras aceptar las decisiones, incorporarlas a sus fuentes actuales y cerrar este borrador como antecedente.

## Condiciones para aprobar una acción

La aprobación identifica acción, sistemas y recursos afectados, responsable, ventana, prueba de éxito y recuperación. Aprobar la revisión documental no equivale a autorizar rotación, envíos, gasto, archivo, migración o despliegue.

Esta rama añade exclusivamente esta propuesta. No implementa gobernanza ni modifica la configuración de los agentes.
