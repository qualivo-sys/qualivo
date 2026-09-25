# 4. Revenue Intelligence, experimentos, seguridad y backlog

## Revenue Intelligence

### Misión

Responder, con evidencia trazable:

1. ¿Dónde estamos perdiendo más dinero?
2. ¿Qué evidencia tenemos?
3. ¿Qué ha cambiado?
4. ¿Qué merece atención?
5. ¿Qué experimento deberíamos ejecutar?

No diseña campañas ni modifica procesos. Convierte señales dispersas en una cola priorizada de decisiones.

### Unidad de análisis

`fuente × campaña × vertical × cohort × lifecycle stage × periodo`

Métricas primarias: coste, conversaciones reales, cualificados, reuniones realizadas, propuestas, ganados, revenue, tiempo por etapa, valor/retención. Cada ratio muestra numerador, denominador, periodo y cobertura de datos.

### Priorización

`Impacto económico estimado × confianza de evidencia × urgencia ÷ coste/riesgo de intervención`

Una recomendación no se prioriza con volumen insuficiente, atribución rota o causa no distinguible. En esos casos, la recomendación es mejorar observabilidad antes de optimizar.

### Salida obligatoria

- fuga / oportunidad y etapa;
- evidencia y cobertura;
- cambio detectado contra baseline;
- hipótesis y alternativas;
- owner de diseño/ejecución;
- experimento propuesto;
- decisión requerida y riesgo;
- vínculo a Experiment Memory.

## Experiment Memory

No es una biblioteca de ideas: es el registro que evita repetir pruebas y permite aprender.

| Campo | Definición |
|---|---|
| ID y fecha | Identificador estable, fecha de alta/cierre |
| PROBLEMA | Fuga concreta y segmento/etapa afectados |
| EVIDENCIA | Eventos, cohortes, periodo, calidad y limitaciones |
| HIPÓTESIS | Cambio causal esperado, falsable |
| EXPERIMENTO | Único cambio, owner, población y guardrails |
| BASELINE | Métrica, numerador/denominador, periodo y valor previo |
| RESULTADO | Resultado, cobertura, efectos secundarios |
| DECISIÓN | mantener / revertir / iterar / no concluyente |
| APRENDIZAJE | qué se sabe, dónde aplica y qué no se puede afirmar |
| APROBACIÓN | aprobador, fecha y alcance de ejecución |

Fase 2 elegirá ubicación (Notion/DB/repositorio) y propietario. Hasta entonces, ningún experimento se declara «ganador» sin baseline y condición de decisión.

## Seguridad P0: exposición de credenciales

### Hallazgo

Dos skills locales contienen valores de acceso embebidos. Los archivos afectados son:

| Archivo afectado | Tipo de secreto expuesto | Sistema afectado | Estado |
|---|---|---|---|
| `C:\\Users\\User\\.agents\\skills\\agente-business-developer\\SKILL.md` | credenciales/API keys y valores de acceso operativos | prospección, enriquecimiento, CRM/outreach | **tratar como potencialmente activo** hasta verificar y rotar |
| `C:\\Users\\User\\.agents\\skills\\agente-automations\\SKILL.md` | credenciales/API keys y referencias de acceso a integraciones | automatizaciones, APIs y observabilidad | **tratar como potencialmente activo** hasta verificar y rotar |

No se reproducen valores, IDs sensibles ni secretos en este documento.

### Plan de retirada (sin ejecutar)

1. Inventariar claves por proveedor y propósito en un registro privado, sin pegarlas en Git/Notion/skills.
2. Localizar todas las copias: skills, historial, scripts, variables locales, CI/CD y documentación.
3. Sustituir cada referencia por nombre de variable de entorno o secret manager; las skills solo describen cómo obtenerla, nunca su valor.
4. Añadir escaneo preventivo pre-commit/CI y reglas de exclusión de secretos.
5. Revisar permisos mínimos, propietarios, caducidad y logs de uso.

### Plan de rotación (requiere aprobación explícita)

1. Nombrar owner y ventana para cada proveedor.
2. Crear credencial nueva con permisos mínimos.
3. Actualizar secret manager/runtime sin exponer valor.
4. Probar en entorno controlado o con una transacción segura.
5. Revocar la antigua, comprobar logs y documentar la fecha de rotación.
6. Declarar incidente cerrado solo después de verificar que no quedan referencias.

## Backlog priorizado

### P0 — proteger y hacer medible

1. Aprobar y ejecutar retirada/rotación de secretos expuestos.
2. Elegir owner, rama/repo canónico y proceso de release de Qualivo; la rama por defecto actual no es base adecuada del OS.
3. Unificar la definición y captura de `meeting.completed`, no-show y propuesta/decisión.
4. Eliminar calendarios/rutas paralelas o establecer su evento común antes de optimizar anuncios.
5. Separar FIT, INTENT y HUMAN PRIORITY en el modelo de datos.
6. Corregir la discrepancia entre acción enviada, etiqueta CRM y resultado real en automatizaciones.

### P1 — cerrar el bucle de revenue

1. Instrumentar Event Contract v1 mediante plan RevOps aprobado.
2. Construir Revenue Intelligence con cobertura y calidad de datos explícitas.
3. Consolidar Outbound Revenue Engine bajo un pipeline/cuenta/contacto común.
4. Reconciliar oferta, promesa, duración de reunión, garantías y condiciones entre landing, guion, propuesta y contrato.
5. Integrar señales de Content y Paid a nivel de campaña/cohorte.
6. Formalizar handoff Sales → CS y primer valor.

### P2 — optimización y escala

1. Activar Experiment Memory y ritual de revisión semanal.
2. Automatizar QA, alertas de SLA y auditoría de eventos.
3. Diseñar modelo de health, retención, expansión y referidos.
4. Reorganizar/instalar los skills especializados tras validar sus límites.
5. Crear reporting por vertical, fuente, segmento y cohorte con atribución declarada.

## Criterio de salida de Fase 1

Fase 1 está completa cuando esta documentación tenga aprobación de arquitectura y se decida qué P0 pasa a propuesta de Fase 2. No queda autorizada ninguna implementación por el mero hecho de estar documentada.
